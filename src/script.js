'use strict';
// Cutscene/dialogue scripting using generator functions.
//
//   function* talk() {
//     yield G.say('Abe', 'How many legs does an insect have?');
//     const pick = yield G.ask('Nate', '...', ['Six', 'More than five']);
//   }
//
// Each yielded command has start()/update()/draw(); update() returns true when done.

(function () {
  const F = () => G.font;

  G.script = {
    cur: null,
    queue: [],
    get busy() { return !!this.cur; },
    run(it) {
      if (!it) return;
      if (this.cur) { this.queue.push(it); return; }
      this.cur = { it, cmd: null, val: undefined };
      this.advance();
    },
    advance() {
      const s = this.cur;
      for (let guard = 0; s && guard < 200; guard++) {
        if (s.cmd) {
          if (!s.cmd.update()) return;
          s.val = s.cmd.result;
          s.cmd = null;
        }
        const r = s.it.next(s.val);
        s.val = undefined;
        if (r.done) {
          this.cur = null;
          if (this.queue.length) this.run(this.queue.shift());
          return;
        }
        s.cmd = r.value || null;
        if (s.cmd && s.cmd.start) s.cmd.start();
      }
    },
    update() { if (this.cur) this.advance(); },
    draw(ctx) { if (this.cur && this.cur.cmd && this.cur.cmd.draw) this.cur.cmd.draw(ctx); },
    reset() { this.cur = null; this.queue = []; },
  };

  // ------------------------------------------------------------ box drawing
  const STYLES = {
    normal: { bg: '#1e1830', border: '#f0e8d0', inner: '#4a4064', text: '#f8f8f0', shadow: '#0c0814' },
    phone: { bg: '#f4f2f8', border: '#2a2238', inner: '#c8c0d8', text: '#282030', shadow: null },
  };
  G.BOX_STYLES = STYLES;

  function box(ctx, x, y, w, h, style = STYLES.normal) {
    ctx.fillStyle = style.border;
    ctx.fillRect(x + 1, y, w - 2, h);
    ctx.fillRect(x, y + 1, w, h - 2);
    ctx.fillStyle = style.inner;
    ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
    ctx.fillStyle = style.bg;
    ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  }
  G.box = box;

  G.NAME_COLORS = {
    Nate: '#78e070', Lily: '#ff98d0', Abe: '#ffa848', Hannah: '#c898ff', Doron: '#68c8ff',
    Dad: '#f8d850', 'Father Eggmas': '#f86858', Tyler: '#78e8e8', Mikey: '#ff98d0',
    Nani: '#ffb8e0', 'El EEENGLISH': '#f86858', 'Pyro Pete': '#ffa848', 'Badlands Chugs': '#ff9a28', 'Little Nate': '#a8f098',
    Michelle: '#e8a0d8', Globglogabgalab: '#f8a8c8', 'Ice JJ Fish': '#a8e0ff', 'Father Christmas': '#ff6a5a', 'Hooded Figure': '#b8a8e8', 'Old Fisherman': '#a8d0e0', Carny: '#f8d040',
  };

  const BOX = { x: 6, w: 228, h: 44, lineH: 11, lines: 3 };

  // ------------------------------------------------------------ say / ask
  function dialog(name, text, opts = {}) {
    const style = STYLES[opts.style || 'normal'];
    const pages = [];
    const lines = F().wrap(text, BOX.w - 16);
    for (let i = 0; i < lines.length; i += BOX.lines) pages.push(lines.slice(i, i + BOX.lines));
    return {
      pages, page: 0, chars: 0, blipT: 0, choice: 0, result: undefined, wait: 0,
      start() {
        const pl = G.play && G.play.player;
        this.top = opts.top != null ? opts.top : (!G.play.camFocus && pl && pl.y - G.play.cam.y > 96);
      },
      pageLen() { return this.pages[this.page].reduce((n, l) => n + F().visibleLength(l), 0); },
      update() {
        const inp = G.input;
        const len = this.pageLen();
        if (this.chars < len) {
          this.chars += inp.down('a') || inp.down('b') ? 2.5 : 0.75;
          if (++this.blipT % 4 === 0) G.audio.sfx('blip');
          if (inp.hit('a') && this.chars > 3) { this.chars = len; inp.eat('a'); }
          if (this.chars >= len) this.wait = 6;
          return false;
        }
        if (this.wait > 0) { this.wait--; return false; }
        const last = this.page === this.pages.length - 1;
        if (last && opts.options) {
          if (inp.hit('up')) { this.choice = (this.choice + opts.options.length - 1) % opts.options.length; G.audio.sfx('menu'); }
          if (inp.hit('down')) { this.choice = (this.choice + 1) % opts.options.length; G.audio.sfx('menu'); }
          if (inp.hit('a')) { inp.eat('a'); G.audio.sfx('select'); this.result = this.choice; return true; }
          return false;
        }
        if (inp.hit('a') || inp.hit('b')) {
          inp.eat('a'); inp.eat('b');
          if (last) return true;
          this.page++;
          this.chars = 0;
        }
        return false;
      },
      draw(ctx) {
        const y = this.top ? 4 : G.H - BOX.h - 4;
        box(ctx, BOX.x, y, BOX.w, BOX.h, style);
        if (name) {
          const nw = F().width(name) + 10;
          box(ctx, BOX.x + 6, y - 9, nw, 13, style);
          let nc = opts.nameColor || G.NAME_COLORS[name] || '#f8d850';
          if (opts.style === 'phone') nc = G.art.shade(nc, -0.45);
          F().draw(ctx, name, BOX.x + 11, y - 6, nc, { shadow: style.shadow });
        }
        let left = Math.floor(this.chars);
        this.pages[this.page].forEach((line, i) => {
          if (left <= 0) return;
          const n = F().visibleLength(line);
          F().draw(ctx, line, BOX.x + 8, y + 7 + i * BOX.lineH, style.text, { max: left, shadow: style.shadow });
          left -= n;
        });
        const done = this.chars >= this.pageLen() && this.wait <= 0;
        if (done && !(opts.options && this.page === this.pages.length - 1) && (G.tick >> 4) & 1) {
          ctx.fillStyle = opts.style === 'phone' ? '#2a2238' : '#f8d850';
          const ax = BOX.x + BOX.w - 12, ay = y + BOX.h - 9;
          ctx.fillRect(ax, ay, 5, 1); ctx.fillRect(ax + 1, ay + 1, 3, 1); ctx.fillRect(ax + 2, ay + 2, 1, 1);
        }
        if (done && opts.options && this.page === this.pages.length - 1) {
          const ow = Math.max(...opts.options.map((o) => F().width(o))) + 22;
          const oh = opts.options.length * 11 + 8;
          const ox = BOX.x + BOX.w - ow, oy = this.top ? y + BOX.h + 2 : y - oh - 2;
          box(ctx, ox, oy, ow, oh);
          opts.options.forEach((o, i) => {
            F().draw(ctx, o, ox + 14, oy + 5 + i * 11, i === this.choice ? '#f8d850' : '#f8f8f0', { shadow: '#0c0814' });
          });
          const cy = oy + 6 + this.choice * 11;
          const bob = (G.tick >> 3) & 1;
          ctx.fillStyle = '#f8d850';
          ctx.fillRect(ox + 6 + bob, cy, 1, 5); ctx.fillRect(ox + 7 + bob, cy + 1, 1, 3); ctx.fillRect(ox + 8 + bob, cy + 2, 1, 1);
        }
      },
    };
  }

  G.say = (name, text, opts) => dialog(name, text, opts);
  G.ask = (name, text, options, opts = {}) => dialog(name, text, Object.assign({}, opts, { options }));
  G.text = (name, text) => dialog(name, text, { style: 'phone' });

  // ------------------------------------------------------------ misc commands
  G.wait = (n) => ({ start() { this.t = n; }, update() { return --this.t <= 0; } });

  G.shakeCmd = (n, mag) => ({ start() { G.play.shake(n, mag); }, update() { return true; } });

  G.fadeOut = (n = 16) => ({
    start() { this.t = 0; },
    update() { this.t++; G.fade = Math.min(1, this.t / n); return this.t >= n; },
  });
  G.fadeIn = (n = 16) => ({
    start() { this.t = 0; },
    update() { this.t++; G.fade = Math.max(0, 1 - this.t / n); return this.t >= n; },
  });

  G.emote = (ent, kind = 'bang', n = 40) => ({
    start() { this.t = n; ent.emote = G.spr[kind]; G.audio.sfx('menu'); },
    update() { if (--this.t <= 0) { ent.emote = null; return true; } return false; },
  });

  G.face = (ent, dir) => ({ start() { ent.dir = dir; }, update() { return true; } });

  // Tween the camera zoom (1 = normal) over n frames.
  G.zoomTo = (z, n = 30) => ({
    start() { this.from = G.play.zoom || 1; this.t = 0; },
    update() { this.t++; const k = Math.min(1, this.t / n); G.play.zoom = this.from + (z - this.from) * k * k * (3 - 2 * k); return this.t >= n; },
  });

  // Huge shaking text across the middle of the screen.
  G.bigText = (text, n = 90, color = '#78c8ff') => ({
    start() { this.t = 0; },
    update() { return ++this.t >= n; },
    draw(ctx) {
      const sc = this.t < 8 ? 4 - Math.floor(this.t / 4) : 2, w = G.font.bigWidth(text, sc);
      const j = this.t < 30 ? Math.round((Math.random() * 2 - 1) * 2) : 0;
      G.font.drawBig(ctx, text, Math.round((G.W - w) / 2) + j, 60 - sc * 3 + j, sc, color, '#1c1424');
    },
  });

  // Full-screen pages of paper (a note, a letter): Z turns the page, and Z on
  // the last one puts it away.
  G.noteView = (pages) => ({
    start() { this.i = 0; this.t = 0; G.audio.sfx('menu'); },
    update() {
      const inp = G.input;
      if (++this.t > 14 && (inp.hit('a') || inp.hit('b'))) {
        inp.eat('a'); inp.eat('b');
        G.audio.sfx('menu');
        this.t = 0;
        if (++this.i >= pages.length) return true;
      }
      return false;
    },
    draw(ctx) {
      ctx.drawImage(pages[Math.min(this.i, pages.length - 1)], 0, 0);
      const hint = this.i < pages.length - 1 ? 'Z: turn it over' : 'Z: fold it back up';
      G.font.draw(ctx, hint, G.W - G.font.width(hint) - 4, G.H - 9, '#f8f8f0', { shadow: '#000' });
    },
  });

  // Point the camera somewhere for a cutscene (null = back to Nate).
  G.camFocus = (x, y, n = 40) => ({
    start() { G.play.camFocus = x == null ? null : { x, y }; this.t = n; },
    update() { return --this.t <= 0; },
  });

  // Run several commands at once; done when all of them are (nulls are skipped).
  G.together = (...cmds) => {
    const list = cmds.filter(Boolean);
    return {
      start() { list.forEach((c) => c.start && c.start()); this.done = list.map(() => false); },
      update() { list.forEach((c, i) => { if (!this.done[i]) this.done[i] = c.update(); }); return this.done.every(Boolean); },
      draw(ctx) { list.forEach((c) => c.draw && c.draw(ctx)); },
    };
  };

  // Walk an entity to (x, y) ignoring collision.
  G.walkTo = (ent, x, y, speed = 1) => ({
    start() { ent.walking = true; },
    update() {
      const dx = x - ent.x, dy = y - ent.y, d = Math.hypot(dx, dy);
      if (d <= speed) {
        ent.x = x; ent.y = y; ent.moving = false; ent.walking = false;
        return true;
      }
      ent.x += (dx / d) * speed;
      ent.y += (dy / d) * speed;
      ent.dir = G.dirToward(dx, dy);
      ent.moving = true;
      ent.anim = (ent.anim || 0) + 1;
      return false;
    },
  });

  // Nate holds an item over his head while the fanfare plays.
  G.itemGet = (icon, text) => ({
    start() {
      const p = G.play.player;
      p.pose = 'hold'; p.dir = 'down'; p.holdIcon = icon; p.state = 'walk';
      G.audio.sfx('fanfare');
      this.t = 0;
      this.d = dialog(null, text);
    },
    update() {
      if (++this.t < 45) return false;
      if (this.t === 45) this.d.start();
      if (this.d.update()) {
        G.play.player.pose = null;
        G.play.player.holdIcon = null;
        return true;
      }
      return false;
    },
    draw(ctx) { if (this.t >= 45) this.d.draw(ctx); },
  });

  // ------------------------------------------------------------ Dad's pipe
  // Ocarina-style: arrows puff smoke rings with notes; a known sequence
  // returns that smoke signal's id (or nothing if put away).
  const ARROW = { up: '↑', down: '↓', left: '←', right: '→' };
  G.arrows = (seq) => seq.map((d) => ARROW[d]).join(' ');

  // Pipe mode is a player state (not a script), so the world keeps moving:
  // enemies can still walk up and bonk Nate while he puffs.
  G.pipe = {
    active: false,
    start() {
      const p = G.play.player;
      this.active = true;
      this.seq = [];
      this.t = 0;
      this.matched = null;
      p.pipeOut = true;
      p.state = 'pipe';
      p.moving = false;
    },
    stop() {
      this.active = false;
      const p = G.play.player;
      if (!p) return;
      p.pipeOut = false;
      if (p.state === 'pipe') p.state = 'walk';
    },
    bowl() {
      const p = G.play.player, S = p.spr, top = p.y - S.h + 2;
      const off = { right: [9, 8], left: [-9, 8], down: [5, 9], up: [0, 6] }[p.dir];
      return [p.x + off[0], top + off[1]];
    },
    // called from Player.update while Nate is in the 'pipe' state
    update() {
      const inp = G.input;
      this.t++;
      if (this.t % 14 === 0) {
        const [bx, by] = this.bowl();
        G.play.world.fx.push({ x: bx, y: by, vx: (Math.random() - 0.5) * 0.2, vy: -0.35, life: 34, color: '#c8c8d0', size: 2, grow: true });
      }
      if (this.matched) {
        if (--this.matchT > 0) return;
        const sig = G.SIGNALS.find((sg) => sg.id === this.matched);
        this.stop();
        const it = sig.effect();
        if (it && typeof it.next === 'function') G.script.run(it);
        return;
      }
      for (const d of ['up', 'down', 'left', 'right']) if (inp.hit(d)) this.puff(d);
      if (inp.hit('a') || inp.hit('b')) {
        inp.eat('a'); inp.eat('b');
        this.stop();
      }
    },
    puff(d) {
      this.seq.push(d);
      if (this.seq.length > 8) this.seq.shift();
      G.audio.puff(d);
      const [bx, by] = this.bowl(), [dx, dy] = G.DIRS[d];
      G.play.world.fx.push({ x: bx, y: by - 2, vx: dx * 0.7, vy: dy * 0.7 - 0.15, ring: true, life: 50, max: 50, color: '#eeeef4' });
      for (const sig of G.SIGNALS) {
        if (!sig.known()) continue;
        const n = sig.seq.length;
        if (this.seq.length >= n && this.seq.slice(-n).join() === sig.seq.join()) {
          this.matched = sig.id;
          this.matchT = 30;
          G.audio.sfx('secret');
          break;
        }
      }
    },
    draw(ctx) {
      if (!this.active) return;
      const y = G.H - 40;
      G.box(ctx, 6, y, 228, 36);
      F().draw(ctx, 'DAD\'S PIPE', 12, y + 4, '#f8d850', { shadow: '#0c0814' });
      F().draw(ctx, this.seq.length ? G.arrows(this.seq) : '{d}Puff with the arrow keys...', 70, y + 4, '#f8f8f0', { shadow: '#0c0814' });
      const known = G.SIGNALS.filter((sg) => sg.known());
      const line = known.length ? known.map((sg) => sg.name + ' ' + G.arrows(sg.seq)).join('   ') : 'No smoke signals learned yet.';
      F().draw(ctx, this.matched ? '{g}' + G.SIGNALS.find((sg) => sg.id === this.matched).name + '!' : '{c}' + line, 12, y + 15, '#f8f8f0', { shadow: '#0c0814' });
      F().draw(ctx, 'Z: put the pipe away   (enemies don\'t wait!)', 12, y + 25, '#9890a8', { shadow: '#0c0814' });
    },
  };

  // Big centered banner (chapter titles, achievements).
  G.banner = (title, sub, n = 150) => ({
    start() { this.t = 0; },
    update() {
      this.t++;
      if (this.t > 30 && G.input.hit('a')) { G.input.eat('a'); return true; }
      return this.t >= n;
    },
    draw(ctx) {
      const a = Math.min(1, this.t / 15);
      ctx.fillStyle = `rgba(12,8,20,${0.75 * a})`;
      ctx.fillRect(0, 52, G.W, 52);
      const tw = F().width(title);
      F().draw(ctx, title, Math.round((G.W - tw) / 2), 64, '#f8d850', { shadow: '#0c0814' });
      if (sub) {
        const sw = F().width(sub);
        F().draw(ctx, sub, Math.round((G.W - sw) / 2), 82, '#f8f8f0', { shadow: '#0c0814' });
      }
    },
  });
})();
