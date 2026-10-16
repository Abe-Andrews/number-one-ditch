'use strict';
// HUD, pause menu and other overlays.

(function () {
  const F = () => G.font;
  const SH = '#0c0814';

  const silCache = new WeakMap();
  function silhouette(src) {
    let c = silCache.get(src);
    if (c) return c;
    c = G.canvas(src.width, src.height);
    const x = c.getContext('2d');
    x.drawImage(src, 0, 0);
    x.globalCompositeOperation = 'source-atop';
    x.fillStyle = '#2a2238';
    x.fillRect(0, 0, c.width, c.height);
    silCache.set(src, c);
    return c;
  }

  function itemBox(ctx, x, y, label, icon, count) {
    G.box(ctx, x, y, 22, 22);
    if (icon) ctx.drawImage(icon, x + 11 - Math.floor(icon.width / 2), y + 11 - Math.floor(icon.height / 2));
    F().draw(ctx, label, x + 2, y - 3, '#f8d850', { shadow: SH });
    if (count != null) F().draw(ctx, String(count), x + 15, y + 13, '#f8f8f0', { shadow: SH });
  }

  G.hud = {
    draw(ctx) {
      const s = G.state;
      // hearts
      const n = s.maxHp / 2;
      for (let i = 0; i < n; i++) {
        const v = s.hp - i * 2;
        const img = v >= 2 ? G.spr.heart.full : v === 1 ? G.spr.heart.half : G.spr.heart.empty;
        ctx.drawImage(img, 5 + (i % 10) * 8, 5 + Math.floor(i / 10) * 8);
      }
      // item buttons
      const xi = s.xItem && G.ITEMS[s.xItem];
      const xCount = xi && typeof s.items[s.xItem] === 'number' ? s.items[s.xItem] : null;
      if (s.playAs) {
        // playing as Lily: no items, just her "No."
        itemBox(ctx, G.W - 52, 5, 'X', null);
        itemBox(ctx, G.W - 27, 5, 'Z', null);
        F().draw(ctx, 'NO.', G.W - 24, 13, '#ffffff', { shadow: '#c83878' });
      } else {
        itemBox(ctx, G.W - 52, 5, 'X', xi ? xi.icon() : null, xCount);
        itemBox(ctx, G.W - 27, 5, 'Z', s.items.hammer ? G.ITEMS.hammer.icon() : null);
      }
      // shark teeth
      ctx.drawImage(G.spr.tooth, 5, G.H - 14);
      F().draw(ctx, String(s.teeth).padStart(3, '0'), 15, G.H - 13, '#f8f8f0', { shadow: SH });
    },

    bossBar(ctx, b) {
      const w = 120, x = Math.round((G.W - w) / 2), y = G.H - 14;
      F().draw(ctx, b.name, Math.round((G.W - F().width(b.name)) / 2), y - 10, '#f8d850', { shadow: SH });
      ctx.fillStyle = SH; ctx.fillRect(x - 1, y - 1, w + 2, 7);
      ctx.fillStyle = '#4a2030'; ctx.fillRect(x, y, w, 5);
      ctx.fillStyle = '#e83848'; ctx.fillRect(x, y, Math.round((w * b.hp) / b.maxHp), 5);
      ctx.fillStyle = '#ff8890'; ctx.fillRect(x, y, Math.round((w * b.hp) / b.maxHp), 1);
    },
  };

  // Area name that drops in when you enter a map.
  G.areaBanner = {
    text: '', t: 0,
    show(text) { this.text = text; this.t = 150; },
    update() { if (this.t > 0) this.t--; },
    draw(ctx) {
      if (this.t <= 0 || !this.text) return;
      const a = Math.min(1, this.t / 20, (150 - this.t) / 10);
      const w = F().width(this.text) + 16;
      const x = Math.round((G.W - w) / 2), y = 20 - Math.round((1 - a) * 10);
      ctx.globalAlpha = a;
      G.box(ctx, x, y, w, 15);
      F().draw(ctx, this.text, x + 8, y + 4, '#f8d850', { shadow: SH });
      ctx.globalAlpha = 1;
    },
  };

  // ------------------------------------------------------------ pause menu
  // Tabbed, Minish Cap style: ITEMS / KEY ITEMS / PEOPLE / JOURNAL.
  // Q/E switch tabs (or press up into the tab bar and use left/right).
  const TABS = ['ITEMS', 'KEY ITEMS', 'PEOPLE', 'JOURNAL'];
  const COLS = 4, ROWS = 2;
  const SEL = { bg: '#3a3058', border: '#f8d850', inner: '#7a6a30' };
  const TXT = (ctx, str, x, y, col) => F().draw(ctx, str, x, y, col || '#f8f8f0', { shadow: SH });

  class PauseMenu {
    constructor() {
      this.tab = 0;
      this.sel = 0;
      this.onTabs = false;
      this.msg = '';
      this.msgT = 0;
      G.audio.sfx('select');
    }

    slots() { return this.tab === 0 ? G.GEAR_SLOTS : G.KEY_SLOTS; }

    switchTab(d) {
      this.tab = (this.tab + d + TABS.length) % TABS.length;
      this.sel = 0;
      this.scroll = 0;
      G.audio.sfx('menu');
    }

    move(d, count, wrapRow) {
      const n = this.sel + d;
      if (n < 0 || n >= count) return false;
      this.sel = n;
      G.audio.sfx('menu');
      return true;
    }

    update() {
      const inp = G.input;
      if (this.msgT > 0) this.msgT--;
      if (inp.hit('start')) { G.audio.sfx('cancel'); return true; }
      if (inp.hit('l')) this.switchTab(-1);
      if (inp.hit('r')) this.switchTab(1);
      if (inp.hit('b')) {
        G.play.autosave();
        G.audio.sfx('select');
        this.flash('Game saved!');
      }

      if (this.onTabs) {
        if (inp.hit('left')) this.switchTab(-1);
        if (inp.hit('right')) this.switchTab(1);
        if (inp.hit('down') || inp.hit('a')) { inp.eat('a'); this.onTabs = false; G.audio.sfx('menu'); }
        return false;
      }

      if (this.tab <= 1) {
        // item grids
        const col = this.sel % COLS, row = Math.floor(this.sel / COLS);
        if (inp.hit('left') && col > 0) this.move(-1, COLS * ROWS);
        if (inp.hit('right') && col < COLS - 1) this.move(1, COLS * ROWS);
        if (inp.hit('down') && row < ROWS - 1) this.move(COLS, COLS * ROWS);
        if (inp.hit('up')) { if (row > 0) this.move(-COLS, COLS * ROWS); else { this.onTabs = true; G.audio.sfx('menu'); } }
        if (inp.hit('a')) return this.activate();
      } else if (this.tab === 2) {
        const n = G.people().length;
        if (inp.hit('down')) this.move(1, n);
        if (inp.hit('up')) { if (this.sel > 0) this.move(-1, n); else { this.onTabs = true; G.audio.sfx('menu'); } }
      } else if (inp.hit('up')) {
        this.onTabs = true;
        G.audio.sfx('menu');
      }
      return false;
    }

    // Z on an item: equip gear to X, or use a key item. Returns true to close the menu.
    activate() {
      const id = this.slots()[this.sel];
      if (!id || !G.itemHas(id)) { G.audio.sfx('bump'); return false; }
      const def = G.ITEMS[id];
      if (id === 'hammer') { this.flash('The rock hammer is always on Z.'); G.audio.sfx('menu'); return false; }
      if (def.equip) {
        G.state.xItem = id;
        G.audio.sfx('select');
        this.flash(def.name + ' set to X!');
        return false;
      }
      if (def.use) {
        G.audio.sfx('select');
        G.script.run(def.use());
        return true;
      }
      G.audio.sfx('bump');
      return false;
    }

    flash(msg) { this.msg = msg; this.msgT = 120; }

    draw(ctx) {
      ctx.fillStyle = 'rgba(12,8,20,0.86)';
      ctx.fillRect(0, 0, G.W, G.H);
      this.drawTabs(ctx);
      G.box(ctx, 4, 18, 232, 122);
      if (this.tab <= 1) this.drawGrid(ctx);
      else if (this.tab === 2) this.drawPeople(ctx);
      else this.drawJournal(ctx);
      let help = ['Z: set to X', 'Z: use', '', ''][this.tab];
      help = (help ? help + '   ' : '') + 'X: save   Q/E: tabs   ENTER: close';
      TXT(ctx, this.msgT > 0 ? '{g}' + this.msg : help, 8, 146, '#9890a8');
    }

    drawTabs(ctx) {
      const ws = TABS.map((t) => F().width(t) + 10);
      let x = Math.round((G.W - ws.reduce((a, b) => a + b, 0) - (TABS.length - 1) * 3) / 2);
      TXT(ctx, 'Q', x - 10, 6, '#9890a8');
      TABS.forEach((t, i) => {
        const active = i === this.tab;
        const style = active ? (this.onTabs && (G.tick >> 4) & 1 ? { bg: '#5a4878', border: '#ffffff', inner: '#7a6a30' } : SEL) : undefined;
        G.box(ctx, x, 2, ws[i], 14, style);
        TXT(ctx, t, x + 5, 5, active ? '#f8d850' : '#9890a8');
        x += ws[i] + 3;
      });
      TXT(ctx, 'E', x + 2, 6, '#9890a8');
    }

    drawGrid(ctx) {
      const s = G.state, slots = this.slots();
      slots.forEach((id, i) => {
        const x = 12 + (i % COLS) * 24, y = 26 + Math.floor(i / COLS) * 24;
        const sel = i === this.sel && !this.onTabs;
        G.box(ctx, x, y, 22, 22, sel ? SEL : undefined);
        if (!id) return;
        if (!G.itemHas(id)) { TXT(ctx, '?', x + 9, y + 7, '#5a4e70'); return; }
        const ic = G.ITEMS[id].icon();
        if (ic) ctx.drawImage(ic, x + 11 - Math.floor(ic.width / 2), y + 11 - Math.floor(ic.height / 2));
        const n = G.itemCount(id);
        if (n != null) TXT(ctx, G.sayable(n), x + 22 - F().width(G.sayable(n)) - 2, y + 13);
        if (s.xItem === id) TXT(ctx, 'X', x + 2, y + 2, '#f8d850');
        if (id === 'hammer') TXT(ctx, 'Z', x + 2, y + 2, '#f8d850');
      });

      // bottom-left summary
      if (this.tab === 0) {
        const xi = s.xItem && G.ITEMS[s.xItem];
        TXT(ctx, 'Z: {y}Rock Hammer', 12, 80);
        TXT(ctx, 'X: ' + (xi ? '{y}' + (xi.short || xi.name) : '{d}(nothing)'), 12, 92);
      } else {
        TXT(ctx, 'Party: {y}' + s.party.length + '/5', 12, 80);
      }
      ctx.drawImage(G.spr.tooth, 12, 104);
      TXT(ctx, 'Shark teeth: {y}' + s.teeth, 24, 105);
      TXT(ctx, 'Hearts: {r}' + s.maxHp / 2, 12, 117);

      // details panel
      const id = slots[this.sel];
      ctx.fillStyle = '#2a2240';
      ctx.fillRect(110, 24, 120, 112);
      if (!id) { TXT(ctx, '{d}Empty. For now.', 116, 30); return; }
      if (!G.itemHas(id)) { TXT(ctx, '???', 116, 30, '#78e8e8'); TXT(ctx, '{d}You haven\'t found this yet.', 116, 44); return; }
      const def = G.ITEMS[id], ic = def.icon();
      if (ic) ctx.drawImage(ic, 116, 28, ic.width * 2, ic.height * 2);
      F().wrap(def.name, 116).slice(0, 2).forEach((l, i) => TXT(ctx, l, 116, 64 + i * 10, '#78e8e8'));
      F().wrap(G.itemDesc(id), 112).slice(0, 5).forEach((l, i) => TXT(ctx, l, 116, 86 + i * 10));
    }

    // Party members plus every key character met so far; scrolls 5 at a time.
    drawPeople(ctx) {
      const list = G.people(), VIS = 5;
      this.sel = Math.min(this.sel, list.length - 1);
      this.scroll = this.scroll || 0;
      if (this.sel < this.scroll) this.scroll = this.sel;
      if (this.sel >= this.scroll + VIS) this.scroll = this.sel - VIS + 1;
      const portrait = (p) => (p.img ? p.img() : (p.id === 'nate' ? G.nateSprites() : G.sprites[p.id]).down[0]);

      list.slice(this.scroll, this.scroll + VIS).forEach((p, k) => {
        const i = this.scroll + k, y = 24 + k * 22;
        if (i === this.sel && !this.onTabs) {
          ctx.fillStyle = '#3a3058'; ctx.fillRect(8, y, 88, 21);
          ctx.fillStyle = '#f8d850'; ctx.fillRect(8, y, 2, 21);
        }
        const img = portrait(p), face = p.known ? img : silhouette(img);
        // head-and-shoulders crop (centered for wider sprites like Eggmas)
        ctx.drawImage(face, Math.max(0, Math.round((img.width - 16) / 2)), 0, 16, 20, 13, y + 1, 16, 20);
        TXT(ctx, p.name, 33, y + 7, p.known ? '#f8f8f0' : '#5a4e70');
      });
      ctx.fillStyle = '#9890a8';
      if (this.scroll > 0) { ctx.fillRect(90, 25, 5, 1); ctx.fillRect(91, 24, 3, 1); ctx.fillRect(92, 23, 1, 1); }
      if (this.scroll + VIS < list.length) { ctx.fillRect(90, 133, 5, 1); ctx.fillRect(91, 134, 3, 1); ctx.fillRect(92, 135, 1, 1); }

      const p = list[this.sel];
      ctx.fillStyle = '#2a2240';
      ctx.fillRect(100, 24, 130, 112);
      const img = portrait(p), big = p.known ? img : silhouette(img);
      if (p.img) ctx.drawImage(big, 104, 80 - img.height + 2);
      else ctx.drawImage(big, 106, 80 - img.height * 2 + 2, img.width * 2, img.height * 2);
      const nameLines = F().wrap(p.name, 86).slice(0, 2);
      nameLines.forEach((l, i) => TXT(ctx, l, 142, 30 + i * 10, '#f8d850'));
      TXT(ctx, p.tag, 142, 32 + nameLines.length * 10);
      if (!p.known) return;
      const bioLines = p.skill ? 3 : 5;
      F().wrap(p.bio, 122).slice(0, bioLines).forEach((l, i) => TXT(ctx, l, 104, 86 + i * 10));
      if (p.skill) F().wrap('{o}Ability:{/} ' + p.skill, 122).slice(0, 2).forEach((l, i) => TXT(ctx, l, 104, 118 + i * 10));
    }

    drawJournal(ctx) {
      const s = G.state, j = G.journal();
      TXT(ctx, 'GOAL', 12, 23, '#f8d850');
      F().wrap(j.goal, 214).slice(0, 2).forEach((l, i) => TXT(ctx, l, 12, 33 + i * 10));
      TXT(ctx, 'SIDE QUESTS', 12, 55, '#f8d850');
      if (!j.side.length) TXT(ctx, '{d}None yet. Talk to people!', 12, 65);
      j.side.slice(0, 3).forEach(([name, status], i) => {
        TXT(ctx, name, 12, 65 + i * 10, '#78e8e8');
        TXT(ctx, status, 228 - F().width(status), 65 + i * 10);
      });
      TXT(ctx, 'ABE\'S RULES', 12, 97, '#ffa848');
      TXT(ctx, '1. Nate and Lily may not say the sacred number.', 12, 107);
      TXT(ctx, '2. Abe is the Master. See rule 1.', 12, 117);
      TXT(ctx, 'Slips: {r}' + s.stats.slips + '{/}   Sixes bonked: {y}' + (s.stats.sixes || 0) + '{/}   Pins: {y}' + (s.stats.pins || 0), 12, 128, '#9890a8');
    }
  }
  G.PauseMenu = PauseMenu;
})();
