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
      itemBox(ctx, G.W - 52, 5, 'X', xi ? xi.icon() : null, xCount);
      itemBox(ctx, G.W - 27, 5, 'Z', s.items.hammer ? G.ITEMS.hammer.icon() : null);
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
  class PauseMenu {
    constructor() {
      this.sel = 0;
      this.msg = '';
      this.msgT = 0;
      G.audio.sfx('select');
    }

    update() {
      const inp = G.input;
      const slots = G.ITEM_SLOTS;
      if (inp.hit('left')) { this.sel = (this.sel + slots.length - 1) % slots.length; G.audio.sfx('menu'); }
      if (inp.hit('right')) { this.sel = (this.sel + 1) % slots.length; G.audio.sfx('menu'); }
      if (inp.hit('a')) {
        const id = slots[this.sel];
        if (this.owned(id) && G.ITEMS[id].equip) {
          G.state.xItem = id;
          G.audio.sfx('select');
          this.flash(G.ITEMS[id].name + ' set to X!');
        } else {
          G.audio.sfx('bump');
        }
      }
      if (inp.hit('b')) {
        G.play.autosave();
        G.audio.sfx('select');
        this.flash('Game saved!');
      }
      if (this.msgT > 0) this.msgT--;
      if (inp.hit('start')) { G.audio.sfx('cancel'); return true; }
      return false;
    }

    flash(msg) { this.msg = msg; this.msgT = 120; }

    owned(id) {
      const v = G.state.items[id];
      return !!v && (typeof v !== 'number' || v > 0);
    }

    draw(ctx) {
      ctx.fillStyle = 'rgba(12,8,20,0.82)';
      ctx.fillRect(0, 0, G.W, G.H);
      const s = G.state;

      // items
      G.box(ctx, 4, 4, 132, 80);
      F().draw(ctx, 'ITEMS', 10, 8, '#f8d850', { shadow: SH });
      G.ITEM_SLOTS.forEach((id, i) => {
        const x = 10 + i * 24, y = 20;
        const own = this.owned(id);
        G.box(ctx, x, y, 22, 22, i === this.sel ? { bg: '#3a3058', border: '#f8d850', inner: '#7a6a30' } : undefined);
        if (own) {
          const ic = G.ITEMS[id].icon();
          ctx.drawImage(ic, x + 11 - Math.floor(ic.width / 2), y + 11 - Math.floor(ic.height / 2));
          if (typeof s.items[id] === 'number') F().draw(ctx, String(s.items[id]), x + 15, y + 13, '#f8f8f0', { shadow: SH });
          if (s.xItem === id) F().draw(ctx, 'X', x + 2, y + 2, '#f8d850', { shadow: SH });
        } else {
          F().draw(ctx, '?', x + 9, y + 7, '#5a4e70');
        }
      });
      const cur = G.ITEMS[G.ITEM_SLOTS[this.sel]];
      const own = this.owned(G.ITEM_SLOTS[this.sel]);
      const lines = F().wrap(own ? cur.desc : '???  You haven\'t found this yet.', 118);
      F().draw(ctx, own ? cur.name : '???', 10, 47, '#78e8e8', { shadow: SH });
      lines.slice(0, 2).forEach((l, i) => F().draw(ctx, l, 10, 59 + i * 10, '#f8f8f0', { shadow: SH }));

      // party
      G.box(ctx, 140, 4, 96, 80);
      F().draw(ctx, 'PARTY', 146, 8, '#f8d850', { shadow: SH });
      const order = ['nate', 'lily', 'abe', 'hannah', 'doron'];
      order.forEach((id, i) => {
        const S = G.sprites[id];
        const x = 146 + i * 17, y = 74 - S.h;
        const has = s.party.includes(id);
        ctx.drawImage(has ? S.down[0] : silhouette(S.down[0]), x, y);
      });
      const known = s.party.length;
      F().draw(ctx, known + '/5 found', 146, 20, '#9890a8', { shadow: SH });

      // Abe's rules
      G.box(ctx, 4, 88, 232, 68);
      F().draw(ctx, 'ABE\'S RULES', 10, 92, '#ffa848', { shadow: SH });
      F().draw(ctx, '1. Nate and Lily may not say the sacred number.', 10, 104, '#f8f8f0', { shadow: SH });
      F().draw(ctx, '2. Abe is the Master. See rule 1.', 10, 114, '#f8f8f0', { shadow: SH });
      F().draw(ctx, 'Sacred number slips: {r}' + s.stats.slips + '{/}   Sixes: {y}' + (s.stats.sixes || 0) + '{/}   Pins: {y}' + (s.stats.pins || 0), 10, 126, '#9890a8', { shadow: SH });
      const help = this.msgT > 0 ? '{g}' + this.msg : 'Z: set to X    X: save    ENTER: close';
      F().draw(ctx, help, 10, 142, '#9890a8', { shadow: SH });
    }
  }
  G.PauseMenu = PauseMenu;
})();
