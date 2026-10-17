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
      const xCount = xi && xi.count ? xi.count() : xi && typeof s.items[s.xItem] === 'number' ? s.items[s.xItem] : null;
      if (s.playAs) {
        // playing as Lily: no items, just her "No."
        itemBox(ctx, G.W - 52, 5, 'X', null);
        itemBox(ctx, G.W - 27, 5, 'Z', null);
        F().draw(ctx, 'NO.', G.W - 24, 13, '#ffffff', { shadow: '#c83878' });
      } else {
        itemBox(ctx, G.W - 52, 5, 'X', xi ? xi.icon() : null, xCount);
        // the chicken needs a moment between eggs
        const cool = s.xItem === 'chicken' && G.play.eggCool > 0 ? G.play.eggCool / 40 : 0;
        if (cool) { ctx.fillStyle = 'rgba(12,8,20,0.6)'; ctx.fillRect(G.W - 50, 7 + Math.round(18 * (1 - cool)), 18, Math.round(18 * cool)); }
        itemBox(ctx, G.W - 27, 5, 'Z', s.items.hammer ? G.ITEMS.hammer.icon() : null);
      }
      if (s.admin) F().draw(ctx, s.god ? 'ADMIN (INVINCIBLE)' : 'ADMIN', 5, 15 + Math.floor((s.maxHp / 2 - 1) / 10) * 8, '#ff98d0', { shadow: SH });
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
  // Tabbed, Minish Cap style: ITEMS / KEY ITEMS / PEOPLE / JOURNAL / SAVE.
  // Q/E switch tabs (or press up into the tab bar and use left/right).
  const TABS = ['ITEMS', 'KEY ITEMS', 'PEOPLE', 'ROCKS', 'JOURNAL', 'SAVE'];
  const ROCKS_TAB = 3, SAVE_TAB = 5, RCOLS = 5;
  const COLS = 4, ROWS = 3;
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

    // shared slots ([a, b]) show whichever item Nate has (or the last one, still unfound)
    slots() { return (this.tab === 0 ? G.GEAR_SLOTS : G.KEY_SLOTS).map((e) => (Array.isArray(e) ? e.find((id) => G.itemHas(id)) || e[e.length - 1] : e)); }

    switchTab(d) {
      this.tab = (this.tab + d + TABS.length) % TABS.length;
      this.admList = null;
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
      // "overwrite File N?" on the SAVE tab
      if (this.confirm) {
        if (inp.hit('a')) { inp.eat('a'); this.saveTo(this.confirm); }
        else if (inp.hit('b') || inp.hit('start')) { inp.eat('b'); inp.eat('start'); this.confirm = 0; G.audio.sfx('cancel'); }
        return false;
      }
      if (inp.hit('start')) { G.audio.sfx('cancel'); return true; }
      if (inp.hit('l')) this.switchTab(-1);
      if (inp.hit('r')) this.switchTab(1);
      if (inp.hit('b') && !G.state.admin) this.saveTo(G.state.slot || 1);

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
      } else if (this.tab === ROCKS_TAB) {
        // the rock collection: one page per area (Z flips pages), 5 to a row
        if (inp.hit('a')) { inp.eat('a'); this.rockArea = ((this.rockArea || 0) + 1) % G.ROCK_AREAS.length; this.sel = 0; G.audio.sfx('menu'); }
        const n = this.areaRocks().length, col = this.sel % RCOLS, row = Math.floor(this.sel / RCOLS);
        if (inp.hit('left') && col > 0) this.move(-1, n);
        if (inp.hit('right') && col < RCOLS - 1) this.move(1, n);
        if (inp.hit('down') && this.sel + RCOLS < n) this.move(RCOLS, n);
        if (inp.hit('up')) { if (row > 0) this.move(-RCOLS, n); else { this.onTabs = true; G.audio.sfx('menu'); } }
      } else if (this.tab === 2) {
        const list = G.people(), n = list.length;
        if (inp.hit('a')) {
          inp.eat('a');
          const p = list[this.sel];
          if (p.id === 'nate') { G.play.setFollower(null, true); G.audio.sfx('select'); this.flash('Nate goes solo.'); }
          else if (G.state.party.includes(p.id)) { G.play.setFollower(p.id, true); G.audio.sfx('select'); this.flash(p.name + ' is following Nate.'); }
          else G.audio.sfx('bump');
        }
        if (inp.hit('down')) this.move(1, n);
        if (inp.hit('up')) { if (this.sel > 0) this.move(-1, n); else { this.onTabs = true; G.audio.sfx('menu'); } }
      } else if (this.tab === SAVE_TAB && G.state.admin) {
        return this.updateAdmin(inp);
      } else if (this.tab === SAVE_TAB) {
        if (inp.hit('down')) this.move(1, G.SAVE_FILES);
        if (inp.hit('up')) { if (this.sel > 0) this.move(-1, G.SAVE_FILES); else { this.onTabs = true; G.audio.sfx('menu'); } }
        if (inp.hit('a')) {
          inp.eat('a');
          const n = this.sel + 1;
          // saving over a different file that already has a game in it asks first
          if (n !== (G.state.slot || 1) && G.readSave(n)) { this.confirm = n; G.audio.sfx('menu'); }
          else this.saveTo(n);
        }
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

    // Save into file n; from now on autosaves go there too.
    saveTo(n) {
      this.confirm = 0;
      const s = G.state, p = G.play.player;
      if (p) { s.x = p.x; s.y = p.y; s.dir = p.dir; s.map = G.play.world.id; }
      if (G.writeSave(n)) { G.audio.sfx('secret'); this.flash('Saved to File ' + n + '!'); }
      else { G.audio.sfx('bump'); this.flash('{r}Couldn\'t save (browser storage is off).'); }
    }

    draw(ctx) {
      ctx.fillStyle = 'rgba(12,8,20,0.86)';
      ctx.fillRect(0, 0, G.W, G.H);
      this.drawTabs(ctx);
      G.box(ctx, 4, 18, 232, 122);
      if (this.tab <= 1) this.drawGrid(ctx);
      else if (this.tab === 2) this.drawPeople(ctx);
      else if (this.tab === ROCKS_TAB) this.drawRocks(ctx);
      else if (this.tab === SAVE_TAB && G.state.admin) this.drawAdmin(ctx);
      else if (this.tab === SAVE_TAB) this.drawSave(ctx);
      else this.drawJournal(ctx);
      let help = ['Z: set to X   X: save', 'Z: use   X: save', 'Z: bring along   X: save', 'Z: next area   X: save', 'X: save', 'Z: save to this file'][this.tab];
      if (G.state.admin) help = ['Z: set to X', 'Z: use', 'Z: bring along', 'Z: next area', '', this.admList ? 'Z: go   X: back' : 'Z: do it'][this.tab];
      help += '   Q/E: tabs   ENTER: close';
      if (this.confirm) help = '{r}Save over File ' + this.confirm + '?{/}  Z: yes  X: no';
      TXT(ctx, this.msgT > 0 && !this.confirm ? '{g}' + this.msg : help, 8, 146, '#9890a8');
    }

    // ---- ROCKS: every specimen Nate has found, a page for each area
    areaRocks() { const a = G.ROCK_AREAS[this.rockArea || 0]; return G.ROCKS.filter((r) => r.area === a.id); }
    drawRocks(ctx) {
      const s = G.state, rocks = this.areaRocks(), found = (r) => s.rocksFound && s.rocksFound[r.id];
      const area = G.ROCK_AREAS[this.rockArea || 0], here = rocks.filter(found).length;
      const head = '< ' + area.name + ' >';
      TXT(ctx, head, Math.round(60 - F().width(head) / 2), 23, '#78e8e8');
      rocks.forEach((r, i) => {
        const x = 9 + (i % RCOLS) * 21, y = 34 + Math.floor(i / RCOLS) * 21;
        G.box(ctx, x, y, 20, 20, i === this.sel && !this.onTabs ? SEL : undefined);
        if (!found(r)) { TXT(ctx, '?', x + 8, y + 6, '#5a4e70'); return; }
        ctx.drawImage(G.spr.rockIcons[r.id], x + 3, y + 4);
        ctx.fillStyle = G.RARITY[r.r].color; ctx.fillRect(x + 2, y + 2, 2, 2);
        const n = (s.rocks && s.rocks[r.id]) || 0;
        if (n) TXT(ctx, G.sayable(n), x + 19 - F().width(G.sayable(n)), y + 12);
      });
      const ty = 34 + Math.ceil(rocks.length / RCOLS) * 21 + 4;
      TXT(ctx, 'Here: {y}' + G.sayable(here) + '/' + rocks.length, 10, ty);
      TXT(ctx, 'All: {y}' + G.sayable(G.rocksFound()) + '/' + G.ROCKS.length, 10, ty + 10);
      if (ty + 22 <= 128) TXT(ctx, 'Crush them at Van', 10, ty + 22, '#9890a8');
      if (ty + 32 <= 128) TXT(ctx, 'Wickle Hall.', 10, ty + 32, '#9890a8');
      // details
      const r = rocks[this.sel];
      ctx.fillStyle = '#2a2240';
      ctx.fillRect(117, 24, 114, 112);
      if (!r) return;
      const rar = G.RARITY[r.r];
      if (!found(r)) {
        TXT(ctx, '???', 121, 30, '#78e8e8');
        TXT(ctx, rar.name, 121, 41, rar.color);
        F().wrap(r.how || 'Not found yet. Keep exploring the Andover mines.', 106).slice(0, 6).forEach((l, i) => TXT(ctx, l, 121, 56 + i * 10, '#9890a8'));
        return;
      }
      ctx.drawImage(G.spr.rockIcons[r.id], 121, 28, 28, 24);
      F().wrap(r.name, 76).slice(0, 2).forEach((l, i) => TXT(ctx, l, 153, 28 + i * 10, '#78e8e8'));
      TXT(ctx, rar.name, 153, r.name.length > 12 ? 48 : 38, rar.color);
      TXT(ctx, 'Have: {y}' + G.sayable((s.rocks && s.rocks[r.id]) || 0) + '{/}  Found: {y}' + G.sayable(s.rocksFound[r.id]), 121, 58);
      const g = r.crush;
      const crush = !g ? '{r}Never. Museum piece.' : g.teeth ? '{y}+' + G.sayable(g.teeth) + ' teeth' : g.eggs ? '{y}A dozen eggs' : g.package ? '{y}2 packages' : '{r}Heart container!';
      TXT(ctx, 'Crusher: ' + crush, 121, 68);
      const first = r.fact.split(/(?<=\.) /)[0];
      F().wrap(first, 106).slice(0, 6).forEach((l, i) => TXT(ctx, l, 121, 80 + i * 9, '#c8c0d8'));
    }

    // ---- ADMIN (testing): replaces the SAVE tab in admin runs
    adminMain() {
      const s = G.state;
      return ['Jump to a checkpoint...', 'Go to a place...', 'Heal fully', '+100 shark teeth', 'Give every item and song', 'One of every rock', 'Invincible: ' + (s.god ? '{g}ON' : '{r}OFF'), 'Quit to title'];
    }
    adminRows() {
      if (this.admList === 'cp') return G.ADMIN_CHECKPOINTS.map((c, i) => G.sayable(i + 1) + '. ' + c.name);
      if (this.admList === 'place') return G.ADMIN_PLACES.map((p) => p.name);
      return this.adminMain();
    }
    updateAdmin(inp) {
      const rows = this.adminRows(), n = rows.length, s = G.state;
      if (inp.hit('down')) this.move(1, n);
      if (inp.hit('up')) { if (this.sel > 0) this.move(-1, n); else if (!this.admList) { this.onTabs = true; G.audio.sfx('menu'); } }
      if (inp.hit('b')) { inp.eat('b'); if (this.admList) { this.sel = this.admList === 'cp' ? 0 : 1; this.admList = null; this.scroll = 0; G.audio.sfx('cancel'); } return false; }
      if (!inp.hit('a')) return false;
      inp.eat('a');
      if (this.admList === 'cp') { G.adminStart(this.sel); return true; }
      if (this.admList === 'place') {
        const pl = G.ADMIN_PLACES[this.sel];
        G.play.warp(pl.map, pl.at[0], pl.at[1], pl.at[2]);
        return true;
      }
      G.audio.sfx('select');
      switch (this.sel) {
        case 0: this.admList = 'cp'; this.sel = s.adminCp || 0; this.scroll = 0; break;
        case 1: this.admList = 'place'; this.sel = 0; this.scroll = 0; break;
        case 2: s.hp = s.maxHp; this.flash('Hearts refilled.'); break;
        case 3: G.play.addTeeth(100); this.flash('+100 shark teeth.'); break;
        case 4: G.adminAllItems(); this.flash('Every item and song unlocked.'); break;
        case 5: G.adminAllRocks(); this.flash('One of every rock added.'); break;
        case 6: s.god = !s.god; this.flash(s.god ? 'Invincible.' : 'Mortal again.'); break;
        case 7: G.play.menu = null; G.title.enter(); return true;
      }
      return false;
    }
    drawAdmin(ctx) {
      const rows = this.adminRows(), VIS = 10;
      this.scroll = this.scroll || 0;
      if (this.sel < this.scroll) this.scroll = this.sel;
      if (this.sel >= this.scroll + VIS) this.scroll = this.sel - VIS + 1;
      const head = this.admList === 'cp' ? 'JUMP TO A CHECKPOINT' : this.admList === 'place' ? 'GO TO A PLACE' : 'ADMIN (TESTING) - NOTHING IS SAVED';
      TXT(ctx, head, 12, 23, '#ff98d0');
      rows.slice(this.scroll, this.scroll + VIS).forEach((r, k) => {
        const i = this.scroll + k, y = 35 + k * 10, on = i === this.sel && !this.onTabs;
        if (on) { ctx.fillStyle = '#3a3058'; ctx.fillRect(8, y - 1, 224, 10); ctx.fillStyle = '#f8d850'; ctx.fillRect(8, y - 1, 2, 10); }
        TXT(ctx, r, 14, y, on ? '#f8d850' : '#f8f8f0');
      });
    }

    // three save files; the one being played is marked
    drawSave(ctx) {
      const cur = G.state.slot || 1;
      for (let i = 0; i < G.SAVE_FILES; i++) {
        G.drawFileCard(ctx, 8, 22 + i * 39, 224, G.readSave(i + 1), i + 1, i === this.sel && !this.onTabs, i + 1 === cur);
      }
    }

    drawTabs(ctx) {
      // six tabs is a squeeze: "KEY ITEMS" goes by KEYS, and the Q/E hints drop if there's no room
      const names = TABS.map((n, i) => (i === SAVE_TAB && G.state.admin ? 'ADMIN' : n === 'KEY ITEMS' ? 'KEYS' : n));
      let pad = 6, gap = 2, ws = names.map((t) => F().width(t) + pad);
      const total = () => ws.reduce((a, b) => a + b, 0) + (TABS.length - 1) * gap;
      if (total() > G.W - 4) { pad = 4; gap = 1; ws = names.map((t) => F().width(t) + pad); }
      const hints = total() + 24 <= G.W;
      let x = Math.round((G.W - total()) / 2);
      if (hints) TXT(ctx, 'Q', x - 10, 6, '#9890a8');
      TABS.forEach((t, i) => {
        const active = i === this.tab;
        const style = active ? (this.onTabs && (G.tick >> 4) & 1 ? { bg: '#5a4878', border: '#ffffff', inner: '#7a6a30' } : SEL) : undefined;
        G.box(ctx, x, 2, ws[i], 14, style);
        TXT(ctx, names[i], x + pad - 1, 5, active ? '#f8d850' : '#9890a8');
        x += ws[i] + gap;
      });
      if (hints) TXT(ctx, 'E', x + 2, 6, '#9890a8');
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
        TXT(ctx, 'Z: {y}Rock Hammer', 12, 100);
        TXT(ctx, 'X: ' + (xi ? '{y}' + (xi.short || xi.name) : '{d}(nothing)'), 12, 110);
      } else {
        TXT(ctx, 'Party: {y}' + s.party.length + '/5', 12, 105);
      }
      ctx.drawImage(G.spr.tooth, 12, 119);
      TXT(ctx, 'Shark teeth: {y}' + G.sayable(s.teeth), 24, 120);
      TXT(ctx, 'Hearts: {r}' + G.sayable(s.maxHp / 2), 12, 130);

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
      j.side.slice(0, 4).forEach(([name, status], i) => {
        TXT(ctx, name, 12, 65 + i * 9, '#78e8e8');
        TXT(ctx, status, 228 - F().width(status), 65 + i * 9);
      });
      TXT(ctx, 'ABE\'S RULES', 12, 101, '#ffa848');
      TXT(ctx, '1. Nate and Lily may not say the sacred number.', 12, 110);
      TXT(ctx, '2. Abe is the Master. See rule 1.', 12, 119);
      TXT(ctx, 'Slips: {r}' + s.stats.slips + '{/}   Sixes bonked: {y}' + (s.stats.sixes || 0) + '{/}   Pins: {y}' + (s.stats.pins || 0), 12, 128, '#9890a8');
    }
  }
  G.PauseMenu = PauseMenu;

  // Play time, keeping clear of the sacred number like everything else.
  G.playTimeText = (frames) => {
    const m = Math.floor((frames || 0) / 3600), h = Math.floor(m / 60);
    return (h ? G.sayable(h) + 'h ' : '') + G.sayable(m % 60) + 'm';
  };

  // One save file: where you are, hearts, shark teeth, play time and the party.
  G.drawFileCard = (ctx, x, y, w, s, n, sel, current) => {
    G.box(ctx, x, y, w, 36, sel ? SEL : undefined);
    TXT(ctx, 'FILE ' + n, x + 6, y + 6, sel ? '#f8d850' : '#c8c0d8');
    if (current) TXT(ctx, '{g}playing', x + 6, y + 18);
    if (!s) { TXT(ctx, '{d}- empty -', x + 56, y + 14); return; }
    const place = (G.MAPS[s.map] && G.MAPS[s.map].name) || '???';
    TXT(ctx, place, x + 50, y + 6, '#78e8e8');
    for (let i = 0; i < s.maxHp / 2; i++) {
      const v = s.hp - i * 2;
      ctx.drawImage(v >= 2 ? G.spr.heart.full : v === 1 ? G.spr.heart.half : G.spr.heart.empty, x + 50 + (i % 10) * 8, y + 16);
    }
    ctx.drawImage(G.spr.tooth, x + 50, y + 26);
    TXT(ctx, String(s.teeth), x + 60, y + 26);
    TXT(ctx, G.playTimeText(s.playTime), x + 82, y + 26, '#c8c0d8');
    s.party.forEach((id, i) => {
      const S = id === 'nate' ? (s.items.cap ? G.sprites.nate : G.sprites.nate_nocap) : G.sprites[id];
      if (S) ctx.drawImage(S.down[0], 0, 0, 16, 15, x + w - 22 - i * 16, y + 17, 16, 15);
    });
  };
})();
