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
    Enter: 'start', Escape: 'start',
    KeyM: 'mute',
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

  function startSong(name) {
    stopSong();
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
    if (!song) return;
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
    toggleMute() {
      muted = !muted;
      if (master) master.gain.value = muted ? 0 : 0.5;
    },
    get muted() { return muted; },
  };
})();
