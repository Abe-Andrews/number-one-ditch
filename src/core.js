'use strict';
// Core: namespace, canvas helpers, randomness, input, and audio.

const G = window.G = {
  W: 240,
  H: 160,
  T: 16,
  tick: 0,
};

G.clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

G.canvas = function (w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  c.getContext('2d').imageSmoothingEnabled = false;
  return c;
};

// Seeded xorshift RNG so procedural art looks the same every load.
G.rng = function (seed) {
  let s = (seed >>> 0) || 1;
  return function () {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
};

// Stable hash of integer coordinates -> [0, 1).
G.hash = function (x, y, s = 0) {
  let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

// ---------------------------------------------------------------- input
G.input = (function () {
  const KEYMAP = {
    ArrowUp: 'up', KeyW: 'up',
    ArrowDown: 'down', KeyS: 'down',
    ArrowLeft: 'left', KeyA: 'left',
    ArrowRight: 'right', KeyD: 'right',
    KeyZ: 'a', Space: 'a', KeyJ: 'a',
    KeyX: 'b', KeyK: 'b',
    KeyC: 'c', KeyV: 'v',
    Enter: 'start', Escape: 'start',
    KeyQ: 'l', BracketLeft: 'l',
    KeyE: 'r', BracketRight: 'r',
    KeyM: 'mute',
    Digit6: 'six', Numpad6: 'six',
  };
  const held = {};
  const pressed = {};

  addEventListener('keydown', (e) => {
    const b = KEYMAP[e.code];
    if (!b) return;
    e.preventDefault();
    if (!held[b]) pressed[b] = true;
    held[b] = true;
    G.audio.unlock();
    if (b === 'mute') G.audio.toggleMute();
  });
  addEventListener('keyup', (e) => {
    const b = KEYMAP[e.code];
    if (!b) return;
    e.preventDefault();
    held[b] = false;
  });
  addEventListener('blur', () => {
    for (const k in held) held[k] = false;
  });

  return {
    down: (b) => !!held[b],
    hit: (b) => !!pressed[b],
    eat: (b) => { pressed[b] = false; },
    endTick: () => { for (const k in pressed) pressed[k] = false; },
    dir() {
      let x = 0, y = 0;
      if (held.left) x -= 1;
      if (held.right) x += 1;
      if (held.up) y -= 1;
      if (held.down) y += 1;
      return { x, y };
    },
  };
})();

// ---------------------------------------------------------------- audio
G.audio = (function () {
  let ctx = null, master, musicBus, sfxBus, noiseBuf;
  let muted = false;
  let want = null;      // song requested (may be before unlock)
  let song = null;      // { name, tracks: [{ notes, i, t }], bpm }
  let timer = null;
  let mix = null, mixPlayer = null; // Nate's own song, playing as the game's music
  let level = 1; // the studio's track volume (G.audio.withLevel)
  let route = null; // where the instruments play into (a studio track's channel; G.audio.withRoute)
  const bus = () => route || musicBus;
  const lv = (v) => v * level;
  // a note's start: an audio-clock time to schedule it for, or right now
  const when = (at) => Math.max(ctx.currentTime, at || 0) + 0.005;

  function unlock() {
    if (ctx) {
      if (ctx.state === 'suspended') ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.5;
    master.connect(ctx.destination);
    musicBus = ctx.createGain();
    musicBus.gain.value = 0.32;
    musicBus.connect(master);
    sfxBus = ctx.createGain();
    sfxBus.gain.value = 0.55;
    sfxBus.connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    if (want) startSong(want);
  }

  // ---- the studio's mixing board (G.audio.channel)
  let verbNode = null;
  function reverb() {
    if (verbNode) return verbNode;
    // a two-second room: decaying noise in both ears
    const len = Math.floor(ctx.sampleRate * 2.2), ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
    verbNode = ctx.createConvolver(); verbNode.buffer = ir;
    const out = ctx.createGain(); out.gain.value = 0.7; verbNode.connect(out); out.connect(musicBus);
    return verbNode;
  }
  function makeChannel() {
    const input = ctx.createGain(), post = ctx.createGain(), lo = ctx.createBiquadFilter(), hi = ctx.createBiquadFilter(), vol = ctx.createGain(), send = ctx.createGain();
    const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain();
    lo.type = 'lowshelf'; lo.frequency.value = 250; hi.type = 'highshelf'; hi.frequency.value = 2500;
    post.connect(lo); lo.connect(hi); hi.connect(pan); pan.connect(vol); vol.connect(musicBus); vol.connect(send); send.connect(reverb());
    let fxNodes = [], fxKind = undefined;
    // (the pedal sits between the input and the rest; rebuilt when it changes)
    const pedal = (kind) => {
      if (kind === fxKind) return;
      fxKind = kind;
      input.disconnect(); for (const n of fxNodes) { try { n.stop && n.stop(); } catch (e) { /* fine */ } n.disconnect(); }
      fxNodes = [];
      const keep = (...ns) => { fxNodes.push(...ns); return ns[0]; };
      if (kind === 'drive') {
        const pre = keep(ctx.createGain()), ws = keep(ctx.createWaveShaper()), tame = keep(ctx.createBiquadFilter()), out = keep(ctx.createGain());
        pre.gain.value = 2.5; ws.curve = driveCurve(18); tame.type = 'lowpass'; tame.frequency.value = 3200; out.gain.value = 0.45;
        input.connect(pre); pre.connect(ws); ws.connect(tame); tame.connect(out); out.connect(post);
      } else if (kind === 'echo') {
        const d = keep(ctx.createDelay(1)), fb = keep(ctx.createGain()), wet = keep(ctx.createGain());
        d.delayTime.value = 0.33; fb.gain.value = 0.38; wet.gain.value = 0.5;
        input.connect(post); input.connect(d); d.connect(fb); fb.connect(d); d.connect(wet); wet.connect(post);
      } else if (kind === 'chorus') {
        const d = keep(ctx.createDelay(0.1)), lfo = keep(ctx.createOscillator()), depth = keep(ctx.createGain()), wet = keep(ctx.createGain());
        d.delayTime.value = 0.022; lfo.frequency.value = 1.1; depth.gain.value = 0.004; wet.gain.value = 0.7;
        lfo.connect(depth); depth.connect(d.delayTime); lfo.start();
        input.connect(post); input.connect(d); d.connect(wet); wet.connect(post);
      } else if (kind === 'trem') {
        const amp = keep(ctx.createGain()), lfo = keep(ctx.createOscillator()), depth = keep(ctx.createGain());
        amp.gain.value = 0.6; lfo.frequency.value = 5.5; depth.gain.value = 0.4;
        lfo.connect(depth); depth.connect(amp.gain); lfo.start();
        input.connect(amp); amp.connect(post);
      } else input.connect(post);
    };
    pedal(null);
    return {
      input,
      set(o) {
        const t = ctx.currentTime;
        if (o.vol != null) vol.gain.setTargetAtTime(o.vol, t, 0.02);
        if (o.pan != null && pan.pan) pan.pan.setTargetAtTime(o.pan / 4, t, 0.02);
        if (o.tone != null) { hi.gain.setTargetAtTime(o.tone * 4, t, 0.02); lo.gain.setTargetAtTime(-o.tone * 3, t, 0.02); }
        if (o.verb != null) send.gain.setTargetAtTime([0, 0.18, 0.36, 0.6][o.verb] || 0, t, 0.02);
        if (o.fx !== undefined) pedal(o.fx || null);
      },
    };
  }
  // A held note's way out: the guitars, the steel drum and the flutes return this, a function that
  // fades their last gain node out quickly (now, or at an audio time), for when a held key lets go.
  // (srcs: its oscillators, stopped right after the fade, so a long held note doesn't keep running)
  function letGo(node, srcs = []) {
    let done = false;
    return (at) => {
      if (done || !ctx) return;
      done = true;
      const t = Math.max(ctx.currentTime, at || 0);
      node.gain.setValueAtTime(1, t); node.gain.linearRampToValueAtTime(0.0001, t + 0.07);
      for (const o of srcs) try { o.stop(t + 0.1); } catch (e) { /* already stopped */ }
    };
  }
  function tone(f, t, dur, type, vol, bus, slideTo) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.006);
    g.gain.setValueAtTime(vol, t + dur * 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(bus || sfxBus);
    o.start(t);
    o.stop(t + dur + 0.03);
    return o;
  }

  function noise(t, dur, vol, bus, freq) {
    const s = ctx.createBufferSource();
    s.buffer = noiseBuf;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = freq || 3000;
    f.Q.value = 0.7;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(bus || sfxBus);
    s.start(t, Math.random() * 0.5);
    s.stop(t + dur + 0.02);
  }

  const N = (n) => 440 * Math.pow(2, (n - 69) / 12); // midi -> Hz

  const SFX = {
    blip: (t) => tone(1046, t, 0.025, 'square', 0.05),
    menu: (t) => tone(784, t, 0.04, 'square', 0.08),
    select: (t) => { tone(784, t, 0.05, 'square', 0.09); tone(1175, t + 0.05, 0.08, 'square', 0.09); },
    cancel: (t) => { tone(523, t, 0.05, 'square', 0.08); tone(392, t + 0.05, 0.08, 'square', 0.08); },
    swing: (t) => { noise(t, 0.12, 0.25, sfxBus, 2500); tone(260, t, 0.09, 'triangle', 0.15, sfxBus, 700); },
    cut: (t) => noise(t, 0.1, 0.35, sfxBus, 4000),
    hit: (t) => { tone(330, t, 0.07, 'square', 0.18, sfxBus, 110); noise(t, 0.06, 0.25, sfxBus, 1200); },
    hurt: (t) => { tone(500, t, 0.18, 'sawtooth', 0.14, sfxBus, 120); },
    poof: (t) => { noise(t, 0.3, 0.35, sfxBus, 900); tone(200, t, 0.2, 'triangle', 0.15, sfxBus, 60); },
    tooth: (t) => { tone(1568, t, 0.05, 'square', 0.08); tone(2093, t + 0.05, 0.09, 'square', 0.08); },
    heart: (t) => { [72, 76, 79].forEach((n, i) => tone(N(n), t + i * 0.05, 0.08, 'square', 0.08)); },
    door: (t) => { noise(t, 0.15, 0.3, sfxBus, 500); tone(150, t, 0.12, 'triangle', 0.2); },
    bump: (t) => tone(120, t, 0.06, 'square', 0.1),
    buzz: (t) => { for (let i = 0; i < 6; i++) tone(180, t + i * 0.07, 0.05, 'sawtooth', 0.08); },
    chest: (t) => { tone(196, t, 0.1, 'triangle', 0.2); tone(262, t + 0.1, 0.12, 'triangle', 0.2); },
    fanfare: (t) => {
      [67, 71, 74, 79].forEach((n, i) => tone(N(n), t + i * 0.11, 0.1, 'square', 0.1));
      tone(N(83), t + 0.44, 0.5, 'square', 0.1);
      tone(N(79), t + 0.44, 0.5, 'triangle', 0.15);
    },
    slip: (t) => { [62, 61, 60, 59].forEach((n, i) => tone(N(n), t + i * 0.22, i === 3 ? 0.6 : 0.2, 'sawtooth', 0.09)); },
    gulp: (t) => { [0, 0.12, 0.24].forEach((d) => tone(300, t + d, 0.08, 'sine', 0.2, sfxBus, 180)); },
    secret: (t) => { [72, 79, 84, 88].forEach((n, i) => tone(N(n), t + i * 0.08, 0.12, 'square', 0.07)); },
    clank: (t) => { tone(1900, t, 0.12, 'square', 0.09); tone(2650, t, 0.18, 'triangle', 0.1); noise(t, 0.05, 0.3, sfxBus, 6000); },
    dash: (t) => { noise(t, 0.2, 0.25, sfxBus, 1500); tone(180, t, 0.15, 'square', 0.1, sfxBus, 420); },
    cluck: (t) => { tone(620, t, 0.05, 'square', 0.05, sfxBus, 520); tone(560, t + 0.08, 0.05, 'square', 0.05, sfxBus, 480); },
    bawk: (t) => { tone(500, t, 0.18, 'sawtooth', 0.09, sfxBus, 1300); tone(900, t + 0.12, 0.12, 'square', 0.06, sfxBus, 600); },
    boom: (t) => { noise(t, 0.6, 0.6, sfxBus, 400); noise(t, 0.25, 0.4, sfxBus, 2500); tone(110, t, 0.45, 'sine', 0.35, sfxBus, 35); },
    fuse: (t) => noise(t, 0.05, 0.07, sfxBus, 7000),
    yell: (t) => { tone(330, t, 0.35, 'sawtooth', 0.08, sfxBus, 520); tone(247, t, 0.35, 'square', 0.05, sfxBus, 392); },
    no: (t) => { tone(659, t, 0.06, 'square', 0.08, sfxBus, 523); tone(440, t + 0.07, 0.12, 'square', 0.08, sfxBus, 330); },
    bell: (t) => { [0, 0.18, 0.36].forEach((d) => { tone(1568, t + d, 0.3, 'triangle', 0.14); tone(2349, t + d, 0.2, 'sine', 0.06); }); },
    woof: (t) => { tone(240, t, 0.16, 'sawtooth', 0.13, sfxBus, 130); noise(t, 0.1, 0.22, sfxBus, 900); },
    yelp: (t) => { tone(900, t, 0.08, 'square', 0.08, sfxBus, 1500); tone(1400, t + 0.09, 0.14, 'square', 0.07, sfxBus, 800); },
    whine: (t) => { tone(820, t, 0.22, 'triangle', 0.07, sfxBus, 1180); tone(1180, t + 0.22, 0.16, 'triangle', 0.05, sfxBus, 760); },
    spray: (t) => noise(t, 0.16, 0.1, sfxBus, 5200),
    honk: (t) => { [0, 0.28].forEach((d) => { tone(370, t + d, 0.2, 'square', 0.07); tone(466, t + d, 0.2, 'square', 0.06); }); },
    // Matt's boat horn, a splash, and the click of a fishing reel
    horn: (t) => { tone(147, t, 0.9, 'sawtooth', 0.06); tone(149, t, 0.9, 'square', 0.04); },
    splash: (t) => { noise(t, 0.3, 0.3, sfxBus, 1100); tone(420, t, 0.12, 'sine', 0.06, sfxBus, 160); },
    reel: (t) => noise(t, 0.025, 0.12, sfxBus, 4200),
    // Dad snoring in his rocker
    snore: (t) => { noise(t, 0.45, 0.05, sfxBus, 260); tone(84, t, 0.45, 'sawtooth', 0.018, sfxBus, 70); },
    // a floorboard creaking under somebody sneaking out
    creak: (t) => { tone(190, t, 0.32, 'sawtooth', 0.035, sfxBus, 140); tone(260, t + 0.05, 0.22, 'square', 0.015, sfxBus, 200); noise(t, 0.1, 0.06, sfxBus, 700); },
    // the finale: an egg cracking, Father Eggmas laughing, and the possession taking hold
    crack: (t) => { noise(t, 0.12, 0.4, sfxBus, 4200); tone(1400, t, 0.12, 'square', 0.06, sfxBus, 300); noise(t + 0.08, 0.22, 0.28, sfxBus, 1500); tone(180, t + 0.05, 0.3, 'sawtooth', 0.08, sfxBus, 60); },
    hohoho: (t) => { [0, 0.32, 0.64].forEach((d) => { tone(130, t + d, 0.24, 'sawtooth', 0.09, sfxBus, 104); tone(98, t + d, 0.24, 'square', 0.05); }); },
    possess: (t) => { tone(220, t, 0.9, 'triangle', 0.08, sfxBus, 880); tone(233, t, 0.9, 'sawtooth', 0.03, sfxBus, 932); },
    // a hypnotized baby: WAAAH (and the giggle when the bonk snaps them out of it)
    wah: (t) => { tone(620, t, 0.18, 'sawtooth', 0.05, sfxBus, 820); tone(820, t + 0.18, 0.3, 'sawtooth', 0.05, sfxBus, 560); },
    giggle: (t) => { [0, 0.07, 0.14, 0.21].forEach((d, i) => tone(1200 + i * 90 - (i % 2) * 200, t + d, 0.05, 'square', 0.04)); },
    // Romulus's sloth: a squeaky toy
    squeak: (t) => { [0, 0.16].forEach((d) => tone(1700, t + d, 0.1, 'square', 0.05, sfxBus, 2600)); },
    // a balloon popping (the water-gun race)
    pop: (t) => { noise(t, 0.07, 0.4, sfxBus, 2600); tone(700, t, 0.06, 'square', 0.05, sfxBus, 180); },
    // a crowd clapping
    clap: (t) => { for (let i = 0; i < 14; i++) noise(t + i * 0.07 + Math.random() * 0.03, 0.05, 0.22, sfxBus, 1800 + Math.random() * 1200); },
    // the open mic at El Toro Loco: a little walking bass line (an original one)
    bassRiff: (t) => {
      [40, 40, 47, 45, 43, 45, 47, 52, 50, 47, 45, 47, 40].forEach((n, i) => {
        const d = i * 0.17 + (i > 7 ? 0.08 : 0);
        tone(N(n), t + d, 0.16, 'sawtooth', 0.12, sfxBus);
        tone(N(n + 12), t + d, 0.06, 'triangle', 0.05, sfxBus);
      });
    },
  };

  function sfx(name) {
    if (!ctx || muted || !SFX[name]) return;
    SFX[name](ctx.currentTime + 0.005);
  }

  // ---- tiny tracker: "C5:4 R:2 ..." lengths in 16th notes
  const SEMI = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function parse(str) {
    return str.replace(/\|/g, ' ').trim().split(/\s+/).map((tok) => {
      const [n, l] = tok.split(':');
      const len = +l;
      if (n === 'R') return { f: 0, len };
      if (n === 'k' || n === 'h' || n === 's') return { drum: n, len };
      const m = n.match(/^([A-G])([#b]?)(\d)$/);
      const midi = 12 * (+m[3] + 1) + SEMI[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
      return { f: N(midi), len };
    });
  }

  // Recorded songs (a few real tracks the family picked) play from a file in a loop;
  // if the file can't load, the tune in G.SONGS under the same name plays instead.
  const recorded = {}; // name -> AudioBuffer, or false if it failed
  let recSource = null;
  function startRecorded(name, file) {
    song = { name, recorded: true };
    const go = (buf) => {
      if (!song || song.name !== name) return; // something else started while it loaded
      if (!buf) { song = null; startSynth(name); return; }
      recSource = ctx.createBufferSource();
      recSource.buffer = buf;
      recSource.loop = true;
      const g = ctx.createGain();
      g.gain.value = 0.7;
      recSource.connect(g); g.connect(master);
      recSource.start();
    };
    if (name in recorded) { go(recorded[name]); return; }
    fetch(file).then((r) => r.arrayBuffer()).then((ab) => new Promise((ok, no) => ctx.decodeAudioData(ab, ok, no)))
      .then((buf) => { recorded[name] = buf; go(buf); }, () => { recorded[name] = false; go(false); });
  }

  function startSong(name) {
    stopSong();
    if (!ctx) return;
    if (mix) { song = { name, mix: true }; mixPlayer = makePlayer(mix.events, mix.len, true, ctx.currentTime + 0.1); return; }
    const file = G.SONG_FILES && G.SONG_FILES[name];
    if (file && recorded[name] !== false) { startRecorded(name, file); return; }
    startSynth(name);
  }

  function startSynth(name) {
    const def = G.SONGS && G.SONGS[name];
    if (!def || !ctx) return;
    const now = ctx.currentTime + 0.08;
    song = {
      name,
      step: 60 / def.bpm / 4,
      tracks: def.tracks.map((tr) => ({ ...tr, notes: parse(tr.notes), i: 0, t: now })),
    };
    timer = setInterval(schedule, 30);
    schedule();
  }

  function schedule() {
    if (!song || song.recorded) return;
    const horizon = ctx.currentTime + 0.2;
    for (const tr of song.tracks) {
      while (tr.t < horizon) {
        const n = tr.notes[tr.i];
        const dur = n.len * song.step;
        if (n.drum === 'k') tone(150, tr.t, 0.12, 'sine', tr.vol * 2, musicBus, 45);
        else if (n.drum === 'h') noise(tr.t, 0.03, tr.vol * 0.6, musicBus, 8000);
        else if (n.drum === 's') noise(tr.t, 0.1, tr.vol, musicBus, 1800);
        else if (n.f) tone(n.f, tr.t, dur * 0.92, tr.wave, tr.vol, musicBus);
        tr.t += dur;
        tr.i = (tr.i + 1) % tr.notes.length;
      }
    }
  }

  // Abe's guitars, each its own voice. osc: [wave, pitch multiple, level]; the lowpass opens to
  // f * open and closes to f * close (never below floor), q its peak; sustain stretches the note.
  //   strat: bright and glassy, a peaky filter for that in-between-pickups quack, the lows thinned
  //   tele: two fat, detuned saws and a sub, smoother filter, into a pushed amp (soft clipping)
  //   jazzmaster: warm and round (a triangle), longer notes, the tremolo wobble, a slapback echo
  const GUITAR_TONES = {
    strat: { osc: [['sawtooth', 1, 1], ['square', 1.004, 0.6], ['sine', 2, 0.2]], open: 12, close: 2.4, floor: 500, q: 7, sustain: 1, gain: 1, hp: 200 },
    tele: { osc: [['sawtooth', 0.997, 1], ['sawtooth', 1.003, 1], ['sine', 0.5, 0.7]], open: 6, close: 1.5, floor: 350, q: 2, sustain: 1.15, gain: 0.75, drive: 3 },
    jazzmaster: { osc: [['triangle', 1, 1], ['sawtooth', 1.002, 0.7], ['sine', 0.5, 0.3]], open: 9, close: 1.8, floor: 320, q: 1.4, sustain: 1.3, gain: 0.75, wobble: 0.008, echo: 0.11 },
  };
  const driveCurves = {};
  function driveCurve(k) {
    if (driveCurves[k]) return driveCurves[k];
    const c = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) { const x = (i / 1023) * 2 - 1; c[i] = Math.tanh(k * x) / Math.tanh(k); }
    return (driveCurves[k] = c);
  }

  // a recorded song's events, scheduled a little ahead on the audio clock
  function makePlayer(events, len, loop, startAt) {
    const p = { at0: startAt, i: 0, dead: false };
    p.tick = () => {
      if (p.dead || !ctx) return;
      const horizon = ctx.currentTime + 0.2;
      while (events.length) {
        if (p.i >= events.length) { if (!loop || len <= 0) return; p.i = 0; p.at0 += len; }
        const e = events[p.i], at = p.at0 + e.t;
        if (at > horizon) return;
        if (at > ctx.currentTime - 0.05) e.play(at);
        p.i++;
      }
    };
    p.timer = setInterval(p.tick, 25);
    p.tick();
    p.stop = () => { p.dead = true; clearInterval(p.timer); };
    return p;
  }

  function stopSong() {
    if (timer) clearInterval(timer);
    timer = null;
    if (mixPlayer) { mixPlayer.stop(); mixPlayer = null; }
    song = null;
    if (recSource) { try { recSource.stop(); } catch (e) { /* already stopped */ } recSource = null; }
  }

  return {
    unlock,
    sfx,
    play(name) {
      if (want === name && song) return;
      // (the mixtape keeps playing from map to map instead of starting over)
      if (mix && song && song.mix) { want = name; return; }
      want = name;
      if (ctx) startSong(name);
    },
    stop() { want = null; stopSong(); },
    // Dad's pipe: each direction is a breathy note.
    puff(dir) {
      if (!ctx || muted) return;
      const t = ctx.currentTime + 0.005;
      const midi = { up: 74, right: 71, left: 67, down: 62 }[dir];
      tone(N(midi), t, 0.4, 'triangle', 0.16);
      tone(N(midi + 12), t, 0.25, 'sine', 0.03);
      noise(t, 0.3, 0.06, sfxBus, 1500);
    },
    // Instruments, played a note at a time by the game loop (the jam with Abe): an electric guitar
    // (detuned oscillators through a closing lowpass, like a plucked string), a bass, and drums.
    // They go on the music bus. Each of Abe's guitars has its own tone (GUITAR_TONES).
    inst: {
      // every instrument takes an optional `at` last (an audio-clock time: the studio and the
      // mixtape schedule notes ahead), and plays at the current level (G.audio.withLevel)
      guitar(midi, dur = 0.45, vol = 0.16, tone = 'strat', at) {
        if (!ctx || muted) return;
        // (held: a long note, from a held key. Instead of a pluck dying away, it settles to a sustain
        // and stays there, with a little vibrato coming in, until it's let go)
        const T = GUITAR_TONES[tone] || GUITAR_TONES.strat, t = when(at), f = N(midi), held = dur > 0.9, len = dur * (held ? 1 : T.sustain);
        const flt = ctx.createBiquadFilter(), g = ctx.createGain(), peak = lv(vol * T.gain);
        flt.type = 'lowpass'; flt.Q.value = T.q;
        flt.frequency.setValueAtTime(Math.min(8000, f * T.open), t);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + 0.004);
        if (held) {
          flt.frequency.exponentialRampToValueAtTime(Math.min(8000, Math.max(T.floor * 1.6, f * T.close * 1.8)), t + 0.5);
          g.gain.exponentialRampToValueAtTime(peak * 0.5, t + 0.4); g.gain.setValueAtTime(peak * 0.5, t + len - 0.25); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
        } else {
          flt.frequency.exponentialRampToValueAtTime(Math.max(T.floor, f * T.close), t + len);
          g.gain.exponentialRampToValueAtTime(0.0001, t + len);
        }
        const srcs = [];
        let vib = null;
        if (held) {
          const lfo = ctx.createOscillator(); vib = ctx.createGain();
          lfo.frequency.value = 5.5; vib.gain.setValueAtTime(0, t); vib.gain.setValueAtTime(0, t + 0.5); vib.gain.linearRampToValueAtTime(14, t + 1.2);
          lfo.connect(vib); lfo.start(t); lfo.stop(t + len + 0.03); srcs.push(lfo);
        }
        for (const [type, mul, lvl] of T.osc) {
          const o = ctx.createOscillator(), og = ctx.createGain();
          srcs.push(o);
          o.type = type; o.frequency.setValueAtTime(f * mul, t);
          if (vib) vib.connect(o.detune);
          // (the Jazzmaster's floating tremolo: the pitch drifts up, then sags)
          if (T.wobble && !held) { o.frequency.setValueAtTime(f * mul, t + len * 0.3); o.frequency.linearRampToValueAtTime(f * mul * (1 + T.wobble), t + len * 0.6); o.frequency.linearRampToValueAtTime(f * mul * (1 - T.wobble / 2), t + len); }
          og.gain.value = lvl; o.connect(og); og.connect(flt); o.start(t); o.stop(t + len + 0.03);
        }
        // the Strat's single coils are thin (a highpass); the Tele Deluxe's humbuckers push the amp (drive)
        let out = flt;
        if (T.hp) { const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = T.hp; out.connect(hp); out = hp; }
        if (T.drive) { const ws = ctx.createWaveShaper(); ws.curve = driveCurve(T.drive); out.connect(ws); out = ws; }
        const rg = ctx.createGain();
        out.connect(g); g.connect(rg); rg.connect(bus());
        // the Jazzmaster gets a surf-style slapback echo
        if (T.echo) { const d = ctx.createDelay(0.5), dg = ctx.createGain(); d.delayTime.value = T.echo; dg.gain.value = 0.35; rg.connect(d); d.connect(dg); dg.connect(bus()); }
        return letGo(rg, srcs);
      },
      bass(midi, dur = 0.35, at) {
        if (!ctx || muted) return;
        const t = when(at);
        tone(N(midi), t, dur, 'triangle', lv(0.5), bus());
        tone(N(midi), t, dur * 0.6, 'square', lv(0.06), bus());
      },
      kick(at) { if (!ctx || muted) return; const t = when(at); tone(130, t, 0.16, 'sine', lv(0.7), bus(), 42); },
      snare(at) { if (!ctx || muted) return; const t = when(at); noise(t, 0.14, lv(0.32), bus(), 2200); tone(190, t, 0.07, 'triangle', lv(0.18), bus()); },
      hat(at) { if (!ctx || muted) return; const t = when(at); noise(t, 0.035, lv(0.12), bus(), 8000); },
      // Nate's drums: bongos (a pitched thump that drops, with a slap of skin), a steel pan (a sine
      // with its bright, slightly-off overtones), toms, and a crash
      bongo(hi, at) { if (!ctx || muted) return; const t = when(at), f = hi ? 440 : 280; tone(f, t, hi ? 0.12 : 0.17, 'sine', lv(0.45), bus(), f * 0.82); noise(t, 0.02, lv(0.12), bus(), hi ? 3200 : 2200); },
      pan(midi, dur = 0.6, at) {
        if (!ctx || muted) return;
        const t = when(at), f = N(midi), rg = ctx.createGain();
        rg.connect(bus());
        const srcs = [tone(f, t, dur, 'sine', lv(0.24), rg), tone(f * 2, t, dur * 0.7, 'sine', lv(0.09), rg), tone(f * 3.01, t, dur * 0.35, 'sine', lv(0.04), rg)];
        tone(f * 4.07, t, 0.08, 'triangle', lv(0.03), rg);
        return letGo(rg, srcs);
      },
      tom(hi, at) { if (!ctx || muted) return; const t = when(at), f = hi ? 190 : 120; tone(f, t, 0.28, 'sine', lv(0.55), bus(), f * 0.7); noise(t, 0.05, lv(0.08), bus(), 1200); },
      crash(at) { if (!ctx || muted) return; const t = when(at); noise(t, 0.9, lv(0.2), bus(), 6500); noise(t, 0.4, lv(0.12), bus(), 4000); },
      // flutes: a breathy tone that swells in. The Happy Magic Flute (PVC pipe) is hollow and airy and a
      // hair flat, with no vibrato; a real flute is purer, and a gentle vibrato comes in as a note holds
      flute(midi, dur = 0.4, vol = 0.2, kind = 'flute', at) {
        if (!ctx || muted) return;
        const pvc = kind === 'pvc', t = when(at), f = N(midi) * (pvc ? 0.996 : 1), len = Math.max(0.12, dur);
        const o = ctx.createOscillator(), g = ctx.createGain(), rg = ctx.createGain();
        rg.connect(bus());
        o.type = pvc ? 'triangle' : 'sine'; o.frequency.setValueAtTime(f, t);
        if (!pvc) {
          const v = ctx.createOscillator(), vg = ctx.createGain();
          v.frequency.value = 5.2; vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(f * 0.012, t + Math.min(len, 0.9));
          v.connect(vg); vg.connect(o.frequency); v.start(t); v.stop(t + len + 0.12);
        }
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(lv(vol), t + 0.035);
        g.gain.setValueAtTime(lv(vol), t + len * 0.75); g.gain.exponentialRampToValueAtTime(0.0001, t + len + 0.08);
        o.connect(g); g.connect(rg); o.start(t); o.stop(t + len + 0.1);
        // the octave above, quietly, and a puff of breath at the start (a lot more of it through a pipe)
        const o2 = tone(f * 2, t, len * 0.8, 'sine', lv(pvc ? 0.02 : 0.035), rg);
        noise(t, pvc ? 0.14 : 0.06, lv(pvc ? 0.08 : 0.035), rg, pvc ? 1800 : 2600);
        return letGo(rg, [o, o2]);
      },
      // the metronome: a woodblock tick, higher on the one
      click(accent, at) { if (!ctx || muted) return; const t = when(at); tone(accent ? 1800 : 1250, t, 0.04, 'square', lv(accent ? 0.12 : 0.08), bus()); },
    },
    // A baby crying (Hannah's shift): a sawtooth wail that swoops up and falls ("WAAAH"), with a quick
    // vibrato, through two vowel formants. pitch: each baby's own (about 0.8-1.2); loud: 0.5 a
    // whimper, up to about 1.6 a scream (longer, higher, shakier, with a rasp of breath).
    cry(pitch = 1, loud = 1) {
      if (!ctx || muted) return;
      const t = ctx.currentTime + 0.005, dur = 0.3 + 0.42 * loud, f0 = 360 * pitch * (1 + 0.18 * Math.max(0, loud - 1));
      const o = ctx.createOscillator(), vib = ctx.createOscillator(), vg = ctx.createGain(), mix = ctx.createGain(), g = ctx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(f0 * 0.8, t); o.frequency.linearRampToValueAtTime(f0 * 1.3, t + 0.1); o.frequency.exponentialRampToValueAtTime(f0 * 0.85, t + dur);
      vib.frequency.value = 6 + loud * 3; vg.gain.value = f0 * 0.03 * loud; vib.connect(vg); vg.connect(o.frequency);
      for (const [fq, q, lvl] of [[1100, 5, 1], [2700, 7, 0.6]]) {
        const bp = ctx.createBiquadFilter(), bg = ctx.createGain();
        bp.type = 'bandpass'; bp.frequency.value = fq * pitch; bp.Q.value = q; bg.gain.value = lvl;
        o.connect(bp); bp.connect(bg); bg.connect(mix);
      }
      const v = 0.35 * loud;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.04); g.gain.setValueAtTime(v, t + dur * 0.7); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      mix.connect(g); g.connect(sfxBus);
      o.start(t); vib.start(t); o.stop(t + dur + 0.05); vib.stop(t + dur + 0.05);
      if (loud > 1) noise(t, dur * 0.8, 0.025 * loud, sfxBus, 3000);
    },
    // the audio clock (seconds), for timing the studio's live playing against
    now() { return ctx ? ctx.currentTime : 0; },
    get running() { return !!ctx && ctx.state === 'running'; },
    // play whatever fn plays at a level (0-1+) (a studio track's volume)
    withLevel(v, fn) { const o = level; level = v; try { return fn(); } finally { level = o; } },
    withRoute(node, fn) { const o = route; route = node; try { return fn(); } finally { route = o; } },
    // A mixing-board channel for a studio track: what's played into `input` goes through its pedal
    // (fx: null, 'drive', 'echo', 'chorus', 'trem'), a tone knob (a tilt: -2 dark to +2 bright), the
    // pan (-4 left to +4 right) and its volume, out to the music, with a send to the shared reverb
    // (verb 0-3). set({ vol, pan, tone, verb, fx }) changes it on the fly. Null before the audio runs.
    channel() { return ctx ? makeChannel() : null; },
    // A player for a recorded song: events [{ t (seconds), play(at) }] in order, len seconds long,
    // starting at audio time startAt; loop goes around forever. Returns { stop(), at0 }.
    player(events, len, loop, startAt) { return makePlayer(events, len, loop, startAt); },
    // Nate's song as the game's music (the mixtape): { events, len } or null. While it's set, every
    // song the game asks for plays the mixtape instead (it keeps going from map to map).
    setMix(m) { if (m === mix) return; mix = m; if (ctx && want) startSong(want); },
    get mixOn() { return !!mix; },
    toggleMute() {
      muted = !muted;
      if (master) master.gain.value = muted ? 0 : 0.5;
    },
    get muted() { return muted; },
  };
})();
