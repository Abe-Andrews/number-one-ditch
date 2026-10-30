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
    // Brooks's voice: impossibly high (higher than his mom's), a little chirp on every blip
    squeak: (t) => tone(2300 + Math.random() * 700, t, 0.03, 'square', 0.04, sfxBus, 3400),
    glass: (t) => { noise(t, 0.08, 0.3, sfxBus, 7000); [3136, 2637, 3520, 2349].forEach((f, i) => tone(f, t + 0.02 + i * 0.04, 0.12, 'triangle', 0.06)); noise(t + 0.1, 0.25, 0.12, sfxBus, 5000); },
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

  function stopSong() {
    if (timer) clearInterval(timer);
    timer = null;
    song = null;
    if (recSource) { try { recSource.stop(); } catch (e) { /* already stopped */ } recSource = null; }
  }

  return {
    unlock,
    sfx,
    play(name) {
      if (want === name && song) return;
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
    // (two slightly detuned oscillators through a closing lowpass, like a plucked string), a bass,
    // and a little drum kit. They go on the music bus.
    inst: {
      guitar(midi, dur = 0.45, vol = 0.16) {
        if (!ctx || muted) return;
        const t = ctx.currentTime + 0.005, f = N(midi), flt = ctx.createBiquadFilter(), g = ctx.createGain();
        flt.type = 'lowpass'; flt.Q.value = 4;
        flt.frequency.setValueAtTime(Math.min(6000, f * 9), t); flt.frequency.exponentialRampToValueAtTime(Math.max(300, f * 1.6), t + dur);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        for (const [type, mul] of [['sawtooth', 1], ['square', 1.004], ['sine', 0.5]]) {
          const o = ctx.createOscillator();
          o.type = type; o.frequency.setValueAtTime(f * mul, t);
          // (a little of the Jazzmaster's floating tremolo)
          o.frequency.setValueAtTime(f * mul, t + dur * 0.5); o.frequency.linearRampToValueAtTime(f * mul * 1.006, t + dur);
          o.connect(flt); o.start(t); o.stop(t + dur + 0.03);
        }
        flt.connect(g); g.connect(musicBus);
      },
      bass(midi, dur = 0.35) {
        if (!ctx || muted) return;
        const t = ctx.currentTime + 0.005;
        tone(N(midi), t, dur, 'triangle', 0.5, musicBus);
        tone(N(midi), t, dur * 0.6, 'square', 0.06, musicBus);
      },
      kick() { if (!ctx || muted) return; const t = ctx.currentTime + 0.005; tone(130, t, 0.16, 'sine', 0.7, musicBus, 42); },
      snare() { if (!ctx || muted) return; const t = ctx.currentTime + 0.005; noise(t, 0.14, 0.32, musicBus, 2200); tone(190, t, 0.07, 'triangle', 0.18, musicBus); },
      hat() { if (!ctx || muted) return; const t = ctx.currentTime + 0.005; noise(t, 0.035, 0.12, musicBus, 8000); },
      // Nate's drums: bongos (a pitched thump that drops, with a slap of skin), a steel pan (a sine
      // with its bright, slightly-off overtones), toms, and a crash
      bongo(hi) { if (!ctx || muted) return; const t = ctx.currentTime + 0.005, f = hi ? 440 : 280; tone(f, t, hi ? 0.12 : 0.17, 'sine', 0.45, musicBus, f * 0.82); noise(t, 0.02, 0.12, musicBus, hi ? 3200 : 2200); },
      pan(midi, dur = 0.6) {
        if (!ctx || muted) return;
        const t = ctx.currentTime + 0.005, f = N(midi);
        tone(f, t, dur, 'sine', 0.24, musicBus); tone(f * 2, t, dur * 0.7, 'sine', 0.09, musicBus); tone(f * 3.01, t, dur * 0.35, 'sine', 0.04, musicBus); tone(f * 4.07, t, 0.08, 'triangle', 0.03, musicBus);
      },
      tom(hi) { if (!ctx || muted) return; const t = ctx.currentTime + 0.005, f = hi ? 190 : 120; tone(f, t, 0.28, 'sine', 0.55, musicBus, f * 0.7); noise(t, 0.05, 0.08, musicBus, 1200); },
      crash() { if (!ctx || muted) return; const t = ctx.currentTime + 0.005; noise(t, 0.9, 0.2, musicBus, 6500); noise(t, 0.4, 0.12, musicBus, 4000); },
    },
    toggleMute() {
      muted = !muted;
      if (master) master.gain.value = muted ? 0 : 0.5;
    },
    get muted() { return muted; },
  };
})();
