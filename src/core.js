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
    // (fg: the fade stage, after the fader, so a fade in or out never fights the volume knob)
    const fg = ctx.createGain();
    post.connect(lo); lo.connect(hi); hi.connect(pan); pan.connect(vol); vol.connect(fg); fg.connect(musicBus); fg.connect(send); send.connect(reverb());
    let fxNodes = [], fxKind = undefined, fxTune = null;
    // (the pedal sits between the input and the rest; rebuilt when it changes. k: its knobs, 0-10 each;
    // fxTune turns them on the pedal that's already in)
    const pedal = (kind, k) => {
      fxKind = kind; fxTune = null;
      input.disconnect(); for (const n of fxNodes) { try { n.stop && n.stop(); } catch (e) { /* fine */ } n.disconnect(); }
      fxNodes = [];
      const keep = (...ns) => { fxNodes.push(...ns); return ns[0]; }, t = () => ctx.currentTime;
      if (kind === 'drive') {
        // DRIVE: how hard it clips; TONE: dark to bright; LEVEL: how loud it comes out
        const pre = keep(ctx.createGain()), ws = keep(ctx.createWaveShaper()), tame = keep(ctx.createBiquadFilter()), out = keep(ctx.createGain());
        tame.type = 'lowpass';
        input.connect(pre); pre.connect(ws); ws.connect(tame); tame.connect(out); out.connect(post);
        // (at Abe's settings, 6/5/6, it's the pedal from before it had knobs)
        fxTune = ([drive, tone, level]) => { pre.gain.setTargetAtTime(1 + drive * 0.25, t(), 0.02); ws.curve = driveCurve(6 + drive * 2); tame.frequency.setTargetAtTime(1400 + tone * 360, t(), 0.02); out.gain.setTargetAtTime(0.15 + level * 0.05, t(), 0.02); };
      } else if (kind === 'echo') {
        // E.LEVEL: how loud the echoes are; F.BACK: how many times they repeat; D.TIME: how long until they come back
        const d = keep(ctx.createDelay(1)), fb = keep(ctx.createGain()), wet = keep(ctx.createGain());
        input.connect(post); input.connect(d); d.connect(fb); fb.connect(d); d.connect(wet); wet.connect(post);
        // (5/4/4: the old echo. F.BACK all the way up nearly repeats forever; D.TIME runs 50 to 750 ms)
        fxTune = ([lvl, back, time]) => { wet.gain.setTargetAtTime(lvl * 0.1, t(), 0.02); fb.gain.setTargetAtTime(back * 0.095, t(), 0.02); d.delayTime.setTargetAtTime(0.05 + time * 0.07, t(), 0.05); };
      } else if (kind === 'chorus') {
        // RATE: how fast it swirls; DEPTH: how wide the wobble is
        const d = keep(ctx.createDelay(0.1)), lfo = keep(ctx.createOscillator()), depth = keep(ctx.createGain()), wet = keep(ctx.createGain());
        d.delayTime.value = 0.022; wet.gain.value = 0.7;
        lfo.connect(depth); depth.connect(d.delayTime); lfo.start();
        input.connect(post); input.connect(d); d.connect(wet); wet.connect(post);
        // (3/5: the old chorus)
        fxTune = ([rate, dep]) => { lfo.frequency.setTargetAtTime(0.2 + rate * 0.3, t(), 0.05); depth.gain.setTargetAtTime(dep * 0.0008, t(), 0.05); };
      } else if (kind === 'trem') {
        // WAVE: smooth (triangle) to choppy (square); RATE: how fast it pulses; DEPTH: how deep
        // (the WAVE knob turns the triangle up into a clipper, so it squares off as it goes: a smooth
        // pulse at 0, a trapezoid in the middle, nearly a square at 10. 3/5/8: the old tremolo. All
        // the way down on DEPTH it's off; all the way up, the volume goes right down to nothing)
        const amp = keep(ctx.createGain()), lfo = keep(ctx.createOscillator()), sq = keep(ctx.createGain()), clip = keep(ctx.createWaveShaper()), depth = keep(ctx.createGain());
        lfo.type = 'triangle'; clip.curve = new Float32Array([-1, 1]);
        lfo.connect(sq); sq.connect(clip); clip.connect(depth); depth.connect(amp.gain); lfo.start();
        input.connect(amp); amp.connect(post);
        fxTune = ([wave, rate, dep]) => { sq.gain.setTargetAtTime(1 + wave * 0.6, t(), 0.02); lfo.frequency.setTargetAtTime(1 + rate * 0.9, t(), 0.05); const dd = dep * 0.05; amp.gain.setTargetAtTime(1 - dd, t(), 0.02); depth.gain.setTargetAtTime(dd, t(), 0.02); };
      } else if (kind === 'fuzz') {
        // VOLUME, TONE, SUSTAIN: a lot of gain into a hard clipper, then a tone control (5/5/7: about as loud as the overdrive)
        const pre = keep(ctx.createGain()), ws = keep(ctx.createWaveShaper()), hp = keep(ctx.createBiquadFilter()), lp = keep(ctx.createBiquadFilter()), out = keep(ctx.createGain());
        hp.type = 'highpass'; hp.frequency.value = 90; lp.type = 'lowpass';
        input.connect(pre); pre.connect(ws); ws.connect(hp); hp.connect(lp); lp.connect(out); out.connect(post);
        fxTune = ([volume, tone, sustain]) => { pre.gain.setTargetAtTime(3 + sustain * 2.5, t(), 0.02); ws.curve = driveCurve(40 + sustain * 8); lp.frequency.setTargetAtTime(500 + tone * 550, t(), 0.02); out.gain.setTargetAtTime(0.1 + volume * 0.05, t(), 0.02); };
      } else if (kind === 'wah') {
        // SENS, DECAY, MANUAL: an auto-wah. An envelope follower (rectify, then smooth) opens a resonant
        // bandpass as you play; SENS is how far, DECAY how slowly it closes, MANUAL where it rests
        const bp = keep(ctx.createBiquadFilter()), dry = keep(ctx.createGain()), wet = keep(ctx.createGain()), rect = keep(ctx.createWaveShaper()), sm = keep(ctx.createBiquadFilter()), sens = keep(ctx.createGain());
        bp.type = 'bandpass'; bp.Q.value = 4; dry.gain.value = 0.25; wet.gain.value = 2.2;
        const rc = new Float32Array(257); for (let i = 0; i < 257; i++) rc[i] = Math.abs((i / 128) - 1); rect.curve = rc;
        sm.type = 'lowpass';
        input.connect(dry); dry.connect(post); input.connect(bp); bp.connect(wet); wet.connect(post);
        input.connect(rect); rect.connect(sm); sm.connect(sens); sens.connect(bp.frequency);
        fxTune = ([sn, decay, manual]) => { sens.gain.setTargetAtTime(sn * 900, t(), 0.02); sm.frequency.setTargetAtTime(30 - decay * 2.6, t(), 0.02); bp.frequency.setTargetAtTime(250 + manual * 110, t(), 0.02); };
      } else if (kind === 'phaser') {
        // SPEED (its only knob, like the classic orange one): four allpass stages swept by a slow LFO,
        // mixed back with the dry sound so the notches swoosh up and down
        const lfo = keep(ctx.createOscillator()), depth = keep(ctx.createGain()), dry = keep(ctx.createGain()), wet = keep(ctx.createGain());
        dry.gain.value = 0.6; wet.gain.value = 0.6; depth.gain.value = 500; lfo.connect(depth); lfo.start();
        let last = input;
        for (let i = 0; i < 4; i++) { const ap = keep(ctx.createBiquadFilter()); ap.type = 'allpass'; ap.frequency.value = 700; ap.Q.value = 0.7; depth.connect(ap.frequency); last.connect(ap); last = ap; }
        input.connect(dry); dry.connect(post); last.connect(wet); wet.connect(post);
        fxTune = ([speed]) => { lfo.frequency.setTargetAtTime(0.1 + speed * 0.55, t(), 0.05); };
      } else if (kind === 'comp') {
        // OUTPUT, SENSITIVITY: squeezes the loud parts down so everything sits even (and sustains)
        const cp = keep(ctx.createDynamicsCompressor()), out = keep(ctx.createGain());
        cp.knee.value = 10; cp.ratio.value = 6; cp.attack.value = 0.003; cp.release.value = 0.2;
        input.connect(cp); cp.connect(out); out.connect(post);
        fxTune = ([output, sn]) => { cp.threshold.setTargetAtTime(-8 - sn * 3.5, t(), 0.02); out.gain.setTargetAtTime(0.5 + output * 0.2, t(), 0.02); };
      } else if (kind === 'looper') {
        // LOOP LEVEL, BARS (one to four): whatever's played comes back around a whole number of bars
        // later, again and again, fading slowly; the song's bar length comes in as a third value
        const d = keep(ctx.createDelay(20)), fb = keep(ctx.createGain()), wet = keep(ctx.createGain());
        fb.gain.value = 0.9;
        input.connect(post); input.connect(d); d.connect(fb); fb.connect(d); d.connect(wet); wet.connect(post);
        fxTune = ([lvl, bars, bar = 2.4]) => { wet.gain.setTargetAtTime(lvl * 0.1, t(), 0.02); d.delayTime.setValueAtTime(Math.min(19.9, (1 + Math.floor(bars / 3.4)) * bar), t()); };
      } else input.connect(post);
      if (fxTune && k) fxTune(k);
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
        if (o.fx !== undefined && (o.fx || null) !== fxKind) pedal(o.fx || null, o.fxk);
        else if (o.fxk && fxTune) fxTune(o.fxk);
      },
      // a fade on this channel, from one level to another (0-1) starting at audio time `at`; unfade
      // puts it straight back to full (when the playback stops partway through one)
      fadeTo(at, from, to, dur) { const g = fg.gain; g.cancelScheduledValues(at); g.setValueAtTime(from, at); g.linearRampToValueAtTime(to, at + Math.max(0.01, dur)); },
      unfade() { const g = fg.gain, now = ctx.currentTime; g.cancelScheduledValues(now); g.setValueAtTime(1, now); },
    };
  }
  // A held note's way out: the guitars, the steel drum and the flutes return this, a function that
  // fades their last gain node out quickly (now, or at an audio time), for when a held key lets go.
  // (srcs: its oscillators, stopped right after the fade, so a long held note doesn't keep running)
  // A sustained note (the cello, the horns, the sax, the synth, the kazoo, the theremin, Nate singing):
  // oscillators (waves: [type, pitch multiple, level]) through a lowpass that can swell open as the
  // note starts (lp: [start, top, settle], multiples of the pitch; or lpHz in Hz) and optional peaks
  // (series EQ: [Hz, Q, dB]) or formants (parallel bandpasses: [Hz, Q, level], or [[from], [to]] to
  // slide between them); an envelope that holds while the note's held; a vibrato that creeps in
  // (vib: [rate, depth, delay]); a puff of noise at the start (puff: [seconds, level, Hz]); an optional
  // distortion (drive); an optional slide in from another pitch (from, glide), or partway through to
  // another (bend). Returns its let-go.
  function voiceNote(o) {
    const t = when(o.at), f = N(o.midi), len = Math.max(0.12, o.dur), rg = ctx.createGain(), srcs = [], peak = lv(o.vol);
    rg.connect(bus());
    const cap = (x) => Math.min(12000, Math.max(60, x)), lp = ctx.createBiquadFilter(), g = ctx.createGain(), sw = o.swell || 0.05;
    lp.type = 'lowpass'; lp.Q.value = o.q || 0.7;
    const [c0, c1, c2] = o.lpHz || o.lp.map((m) => m * f);
    lp.frequency.setValueAtTime(cap(c0), t); lp.frequency.exponentialRampToValueAtTime(cap(c1), t + sw); lp.frequency.exponentialRampToValueAtTime(cap(c2), t + sw + 0.25);
    const atk = o.attack || 0.03, rel = o.rel || 0.12, sus = o.sus || 1;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + atk);
    if (sus !== 1) g.gain.exponentialRampToValueAtTime(peak * sus, t + atk + 0.2);
    g.gain.setValueAtTime(peak * sus, t + Math.max(atk + 0.21, len * 0.9)); g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(atk + 0.22, len) + rel);
    const vg = ctx.createGain(); vg.gain.value = 0;
    if (o.vib) {
      const [rate, depth, delay] = o.vib, v = ctx.createOscillator();
      v.frequency.value = rate; vg.gain.setValueAtTime(0, t + delay); vg.gain.linearRampToValueAtTime(f * depth, t + delay + 0.3);
      v.connect(vg); v.start(t); v.stop(t + len + rel + 0.2); srcs.push(v);
    }
    for (const [type, mul, lvl] of o.waves) {
      const osc = ctx.createOscillator(), og = ctx.createGain();
      osc.type = type; og.gain.value = lvl;
      if (o.from != null) { osc.frequency.setValueAtTime(N(o.from) * mul, t); osc.frequency.exponentialRampToValueAtTime(f * mul, t + (o.glide || 0.08)); }
      else osc.frequency.value = f * mul;
      // (bend: a slide partway through, to another pitch: { midi, after, dur } in seconds)
      if (o.bend) { osc.frequency.setValueAtTime(f * mul, t + o.bend.after); osc.frequency.exponentialRampToValueAtTime(N(o.bend.midi) * mul, t + o.bend.after + o.bend.dur); }
      vg.connect(osc.frequency); osc.connect(og); og.connect(lp); osc.start(t); osc.stop(t + len + rel + 0.2); srcs.push(osc);
    }
    let tail = lp;
    if (o.drive) { const ws = ctx.createWaveShaper(); ws.curve = driveCurve(o.drive); tail.connect(ws); tail = ws; }
    for (const [hz, q, db] of o.peaks || []) { const pk = ctx.createBiquadFilter(); pk.type = 'peaking'; pk.frequency.value = hz; pk.Q.value = q; pk.gain.value = db; tail.connect(pk); tail = pk; }
    if (o.formants) {
      const sum = ctx.createGain();
      for (const fm of o.formants) {
        const [a, b] = Array.isArray(fm[0]) ? fm : [fm, fm], bp = ctx.createBiquadFilter(), bg = ctx.createGain();
        bp.type = 'bandpass'; bp.Q.value = a[1]; bp.frequency.setValueAtTime(a[0], t); if (b[0] !== a[0]) bp.frequency.exponentialRampToValueAtTime(b[0], t + 0.09);
        bg.gain.value = a[2] * 4; tail.connect(bp); bp.connect(bg); bg.connect(sum);
      }
      tail = sum;
    }
    tail.connect(g); g.connect(rg);
    if (o.puff) noise(t, o.puff[0], lv(o.puff[1]), rg, o.puff[2]);
    return letGo(rg, srcs);
  }
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
      // A violin: a bowed string. Three slightly detuned sawtooths (the string, sawed by the bow) through
      // a lowpass and two body resonances; the bow swells in, holds steady as long as it's drawn, and
      // lifts off; a vibrato creeps in after a moment; and a little scratch of rosin as the bow catches
      violin(midi, dur = 0.5, vol = 0.22, at) {
        if (!ctx || muted) return;
        const t = when(at), f = N(midi), len = Math.max(0.15, dur), rg = ctx.createGain(), srcs = [], peak = lv(vol);
        rg.connect(bus());
        const lp = ctx.createBiquadFilter(), b1 = ctx.createBiquadFilter(), b2 = ctx.createBiquadFilter(), g = ctx.createGain();
        lp.type = 'lowpass'; lp.frequency.value = Math.min(7000, f * 8); lp.Q.value = 0.7;
        b1.type = 'peaking'; b1.frequency.value = 480; b1.Q.value = 1.2; b1.gain.value = 6;
        b2.type = 'peaking'; b2.frequency.value = 2900; b2.Q.value = 1.5; b2.gain.value = 5;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + 0.07);
        g.gain.setValueAtTime(peak, t + Math.max(0.08, len * 0.85)); g.gain.exponentialRampToValueAtTime(0.0001, t + len + 0.12);
        const v = ctx.createOscillator(), vg = ctx.createGain();
        v.frequency.value = 5.6; vg.gain.value = 0; vg.gain.setValueAtTime(0, t + 0.15); vg.gain.linearRampToValueAtTime(f * 0.008, t + 0.45);
        v.connect(vg); v.start(t); v.stop(t + len + 0.2); srcs.push(v);
        for (const [mul, lvl] of [[1, 0.5], [1.004, 0.35], [0.997, 0.25]]) {
          const o = ctx.createOscillator(), og = ctx.createGain();
          o.type = 'sawtooth'; o.frequency.value = f * mul; vg.connect(o.frequency); og.gain.value = lvl;
          o.connect(og); og.connect(lp); o.start(t); o.stop(t + len + 0.2); srcs.push(o);
        }
        lp.connect(b1); b1.connect(b2); b2.connect(g); g.connect(rg);
        noise(t, 0.05, lv(vol * 0.18), rg, 3200);
        return letGo(rg, srcs);
      },
      // The cello: the violin's big sister, an octave and a fifth down; darker, a slower bow, a wider vibrato
      cello(midi, dur = 0.6, vol = 0.26, at) {
        if (!ctx || muted) return;
        return voiceNote({ midi, dur, vol, at, waves: [['sawtooth', 1, 0.5], ['sawtooth', 1.003, 0.35], ['sawtooth', 0.997, 0.25]], lp: [6, 6, 6], peaks: [[230, 1.2, 6], [1400, 1.5, 3]], attack: 0.12, vib: [5, 0.009, 0.25], puff: [0.06, 0.04, 1800] });
      },
      // Nate's bass, plugged in: round and woody, a pluck that settles into a long sustain
      ebass(midi, dur = 0.5, vol = 0.34, at) {
        if (!ctx || muted) return;
        return voiceNote({ midi, dur, vol, at, waves: [['triangle', 1, 0.75], ['sawtooth', 1, 0.3], ['sine', 2, 0.14]], lp: [9, 4.5, 3], swell: 0.08, q: 1.2, attack: 0.005, rel: 0.09, sus: 0.7, peaks: [[120, 1, 3]] });
      },
      // The upright bass, plucked: a round thump that blooms and fades (held, it rings on a while)
      upbass(midi, dur = 0.5, vol = 0.34, at) {
        if (!ctx || muted) return;
        const t = when(at), f = N(midi), len = Math.max(0.2, dur), rg = ctx.createGain(), lp = ctx.createBiquadFilter(), g = ctx.createGain(), srcs = [], peak = lv(vol);
        rg.connect(bus());
        lp.type = 'lowpass'; lp.frequency.setValueAtTime(Math.min(4000, f * 7), t); lp.frequency.exponentialRampToValueAtTime(Math.max(150, f * 2), t + 0.3);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + 0.006); g.gain.exponentialRampToValueAtTime(peak * 0.4, t + 0.25);
        g.gain.exponentialRampToValueAtTime(peak * (len > 0.9 ? 0.2 : 0.08), t + Math.max(0.3, len * 0.85)); g.gain.exponentialRampToValueAtTime(0.0001, t + len + 0.15);
        for (const [type, mul, lvl] of [['triangle', 1, 1], ['sine', 2, 0.3], ['sine', 1, 0.6]]) { const o = ctx.createOscillator(), og = ctx.createGain(); o.type = type; o.frequency.value = f * mul; og.gain.value = lvl; o.connect(og); og.connect(lp); o.start(t); o.stop(t + len + 0.2); srcs.push(o); }
        lp.connect(g); g.connect(rg);
        noise(t, 0.03, lv(vol * 0.3), rg, 600);
        return letGo(rg, srcs);
      },
      // The horns: a trumpet (a bright blat as the lips buzz), a trombone (darker, and it slides into its
      // notes: from, a pitch to slide from, or a little scoop up from just under), a sax (a reed: hollow,
      // breathy, a wide smoky vibrato)
      trumpet(midi, dur = 0.4, vol = 0.17, at) {
        if (!ctx || muted) return;
        return voiceNote({ midi, dur, vol, at, waves: [['sawtooth', 1, 0.6], ['sawtooth', 1.002, 0.3]], lp: [1.5, 9, 5], swell: 0.05, q: 1.4, peaks: [[1300, 1, 4]], attack: 0.03, vib: [5.5, 0.006, 0.3], puff: [0.03, 0.03, 3000] });
      },
      trombone(midi, dur = 0.5, vol = 0.22, at, from, bend) {
        if (!ctx || muted) return;
        return voiceNote({ midi, dur, vol, at, waves: [['sawtooth', 1, 0.6], ['sawtooth', 1.003, 0.3]], lp: [1.2, 5, 3], swell: 0.08, q: 1.2, attack: 0.05, vib: bend ? null : [5, 0.005, 0.35], from: from != null ? from : midi - 1, glide: from != null ? 0.18 : 0.06, bend, puff: [0.03, 0.025, 1500] });
      },
      sax(midi, dur = 0.4, vol = 0.18, at) {
        if (!ctx || muted) return;
        const len = Math.max(0.12, dur), r = voiceNote({ midi, dur, vol, at, waves: [['square', 1, 0.35], ['sawtooth', 1, 0.3], ['sawtooth', 2.002, 0.08]], lp: [2, 5, 3.5], swell: 0.05, q: 2, peaks: [[700, 2, 5], [2500, 2, 4]], attack: 0.035, vib: [5, 0.011, 0.2] });
        noise(when(at), len, lv(vol * 0.06), bus(), 4200);
        return r;
      },
      // The synth: two buzzy saws and a square an octave down through a resonant lowpass; cut (0-10) is its FILTER knob
      synth(midi, dur = 0.4, vol = 0.13, at, cut = 6) {
        if (!ctx || muted) return;
        const hz = 200 * Math.pow(2, cut * 0.55);
        return voiceNote({ midi, dur, vol, at, waves: [['sawtooth', 1, 0.5], ['sawtooth', 1.006, 0.4], ['square', 0.5, 0.25]], lpHz: [hz * 2, hz * 1.4, hz], swell: 0.04, q: 6, attack: 0.008, rel: 0.1 });
      },
      // A kazoo (a hum through a buzzing paper membrane: nasal, fuzzy) and a theremin (a pure, eerie
      // whistle with a big vibrato that slides from wherever it was: from)
      kazoo(midi, dur = 0.4, vol = 0.1, at) {
        if (!ctx || muted) return;
        return voiceNote({ midi, dur, vol, at, waves: [['sawtooth', 1, 0.6], ['square', 1, 0.2]], lp: [9, 9, 9], drive: 6, peaks: [[1000, 3, 10], [2400, 4, 7]], attack: 0.02, vib: [6, 0.012, 0.1] });
      },
      theremin(midi, dur = 0.5, vol = 0.22, at, from) {
        if (!ctx || muted) return;
        return voiceNote({ midi, dur, vol, at, waves: [['sine', 1, 0.85], ['sine', 2, 0.05]], lp: [10, 10, 10], attack: 0.1, rel: 0.25, vib: [6.5, 0.018, 0.04], from: from != null ? from : null, glide: 0.16 });
      },
      // Nate, singing into Studio B's mic: a buzzy source through vowel formants (a boy's, a little high).
      // syl: 0 "doo" (a little D click, then oo), 1 "bah" (the lips pop open into ah), 2 "la" (an L
      // sliding into ah)
      voice(midi, dur = 0.4, vol = 0.32, at, syl = 0) {
        if (!ctx || muted) return;
        const OO = [[340, 7, 1], [950, 9, 0.45], [2400, 12, 0.18]], AH = [[820, 6, 1], [1250, 8, 0.6], [2700, 10, 0.25]], LL = [[380, 7, 1], [1350, 9, 0.5], [2700, 12, 0.2]];
        const formants = syl === 2 ? LL.map((a, i) => [a, AH[i]]) : syl === 1 ? AH : OO;
        const r = voiceNote({ midi, dur, vol, at, waves: [['sawtooth', 1, 0.7], ['sawtooth', 1.002, 0.3]], lp: syl === 1 ? [0.6, 6, 6] : [6, 6, 6], swell: 0.03, formants, attack: syl === 2 ? 0.05 : 0.02, vib: [5.2, 0.01, 0.25] });
        if (syl === 0) noise(when(at), 0.015, lv(vol * 0.25), bus(), 2600);
        return r;
      },
      // the drum machine's own sounds (the boom: a deep kick that drops and rings; a clap; an open hi-hat;
      // a rimshot) and a cowbell (two square waves through a bandpass; hi: the high one)
      boom(at) { if (!ctx || muted) return; const t = when(at); tone(150, t, 0.7, 'sine', lv(0.8), bus(), 42); tone(60, t, 0.5, 'sine', lv(0.3), bus(), 40); },
      clap(at) { if (!ctx || muted) return; const t = when(at); for (const d of [0, 0.011, 0.022]) noise(t + d, 0.02, lv(0.28), bus(), 1300); noise(t + 0.03, 0.16, lv(0.2), bus(), 1100); },
      openhat(at) { if (!ctx || muted) return; const t = when(at); noise(t, 0.32, lv(0.1), bus(), 8000); },
      rim(at) { if (!ctx || muted) return; const t = when(at); tone(1700, t, 0.03, 'square', lv(0.1), bus()); noise(t, 0.02, lv(0.15), bus(), 3000); },
      cowbell(hi, at) {
        if (!ctx || muted) return;
        const t = when(at), k = hi ? 1.25 : 1, bp = ctx.createBiquadFilter(), g = ctx.createGain();
        bp.type = 'bandpass'; bp.frequency.value = 2200 * k; bp.Q.value = 1.2; g.gain.value = 2.5; bp.connect(g); g.connect(bus());
        tone(540 * k, t, 0.28, 'square', lv(0.12), bp); tone(800 * k, t, 0.28, 'square', lv(0.12), bp);
      },
      // Pianos (all three can be held; letting go drops the damper): an upright (a felt hammer on
      // strings: bright, then a quick drop and a long fade, even with the key down), a Casio (a cheap
      // little synth: square and saw, steady while held), and a Fender Rhodes (a struck tine: an FM
      // bark that mellows out, a bell on top, and the suitcase amp's gentle tremolo)
      piano(midi, dur = 0.6, vol = 0.2, at) {
        if (!ctx || muted) return;
        const t = when(at), f = N(midi), len = Math.max(0.2, dur), rg = ctx.createGain(), flt = ctx.createBiquadFilter(), g = ctx.createGain(), srcs = [], peak = lv(vol);
        rg.connect(bus());
        flt.type = 'lowpass'; flt.frequency.setValueAtTime(Math.min(9000, f * 9), t); flt.frequency.exponentialRampToValueAtTime(Math.max(600, f * 2.5), t + Math.min(len, 1.5));
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + 0.004);
        g.gain.exponentialRampToValueAtTime(peak * 0.35, t + Math.min(0.5, len * 0.6));
        // (held: a long, slow ring, the way a piano sings while the key's down)
        if (len > 1.2) g.gain.exponentialRampToValueAtTime(peak * 0.15, t + len * 0.8);
        g.gain.exponentialRampToValueAtTime(0.0001, t + len + 0.05);
        for (const [type, mul, lvl] of [['triangle', 1, 1], ['triangle', 1.003, 0.6], ['sine', 2, 0.35], ['sine', 3.01, 0.15]]) {
          const o = ctx.createOscillator(), og = ctx.createGain();
          o.type = type; o.frequency.value = f * mul; og.gain.value = lvl; o.connect(og); og.connect(flt); o.start(t); o.stop(t + len + 0.1); srcs.push(o);
        }
        flt.connect(g); g.connect(rg);
        noise(t, 0.03, lv(vol * 0.25), rg, 900);
        return letGo(rg, srcs);
      },
      casio(midi, dur = 0.4, vol = 0.13, at) {
        if (!ctx || muted) return;
        const t = when(at), f = N(midi), len = Math.max(0.12, dur), rg = ctx.createGain(), flt = ctx.createBiquadFilter(), g = ctx.createGain(), srcs = [], peak = lv(vol);
        rg.connect(bus());
        flt.type = 'lowpass'; flt.frequency.value = Math.min(6000, f * 6); flt.Q.value = 3;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + 0.01); g.gain.exponentialRampToValueAtTime(peak * 0.8, t + 0.08);
        g.gain.setValueAtTime(peak * 0.8, t + Math.max(0.09, len)); g.gain.exponentialRampToValueAtTime(0.0001, t + len + 0.06);
        for (const [type, mul, lvl] of [['square', 1, 0.6], ['sawtooth', 1.006, 0.35]]) {
          const o = ctx.createOscillator(), og = ctx.createGain();
          o.type = type; o.frequency.value = f * mul; og.gain.value = lvl; o.connect(og); og.connect(flt); o.start(t); o.stop(t + len + 0.1); srcs.push(o);
        }
        flt.connect(g); g.connect(rg);
        return letGo(rg, srcs);
      },
      rhodes(midi, dur = 0.7, vol = 0.2, at) {
        if (!ctx || muted) return;
        const t = when(at), f = N(midi), len = Math.max(0.2, dur), rg = ctx.createGain(), g = ctx.createGain(), amp = ctx.createGain(), peak = lv(vol);
        rg.connect(bus());
        const car = ctx.createOscillator(), mod = ctx.createOscillator(), idx = ctx.createGain(), bell = ctx.createOscillator(), bg = ctx.createGain(), trem = ctx.createOscillator(), tg = ctx.createGain();
        car.frequency.value = f; mod.frequency.value = f;
        idx.gain.setValueAtTime(f * 1.4, t); idx.gain.exponentialRampToValueAtTime(f * 0.15, t + 0.6);
        mod.connect(idx); idx.connect(car.frequency);
        bell.frequency.value = f * 7.1; bg.gain.setValueAtTime(lv(vol * 0.12), t); bg.gain.exponentialRampToValueAtTime(0.0001, t + 0.25); bell.connect(bg); bg.connect(rg);
        amp.gain.value = 0.85; trem.frequency.value = 4.5; tg.gain.value = 0.15; trem.connect(tg); tg.connect(amp.gain);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + 0.006);
        g.gain.exponentialRampToValueAtTime(peak * 0.5, t + Math.min(0.7, len * 0.7));
        if (len > 1.2) g.gain.exponentialRampToValueAtTime(peak * 0.25, t + len * 0.8);
        g.gain.exponentialRampToValueAtTime(0.0001, t + len + 0.1);
        car.connect(g); g.connect(amp); amp.connect(rg);
        const srcs = [car, mod, bell, trem];
        for (const o of srcs) { o.start(t); o.stop(t + len + 0.15); }
        return letGo(rg, srcs);
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
    // (fx: null, 'drive', 'echo', 'chorus', 'trem'; fxk: its knobs, 0-10 each), a tone knob (a tilt:
    // -2 dark to +2 bright), the pan (-4 left to +4 right) and its volume, out to the music, with a send
    // to the shared reverb (verb 0-3). set({ vol, pan, tone, verb, fx, fxk }) changes it on the fly.
    // Null before the audio runs.
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
