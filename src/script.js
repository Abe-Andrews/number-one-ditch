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
        this.top = opts.top != null ? opts.top : (G.play && G.play.player && G.play.player.y - G.play.cam.y > 96);
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
