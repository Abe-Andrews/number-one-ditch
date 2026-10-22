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
      // (a new save or a new game: no rolling or shaking from the old numbers)
      if (this.seen !== s) { this.seen = s; this.lastHp = s.hp; this.hurtT = 0; this.healT = 0; this.tShown = s.teeth; this.tSeen = s.teeth; this.gain = 0; this.gainT = 0; }
      // hearts: they shake when Nate gets hurt, flash when he heals,
      // and the last one beats when he's down to one heart
      if (s.hp < this.lastHp) this.hurtT = 14;
      else if (s.hp > this.lastHp) this.healT = 16;
      this.lastHp = s.hp;
      if (this.hurtT > 0) this.hurtT--;
      if (this.healT > 0) this.healT--;
      const n = s.maxHp / 2, last = Math.ceil(s.hp / 2) - 1, low = s.hp <= 2 && s.maxHp > 2 && s.hp > 0;
      const shake = this.hurtT > 0 ? ((this.hurtT >> 1) & 1 ? 1 : -1) : 0, beat = low && G.tick % 48 < 6;
      for (let i = 0; i < n; i++) {
        const v = s.hp - i * 2;
        let img = v >= 2 ? G.spr.heart.full : v === 1 ? G.spr.heart.half : G.spr.heart.empty;
        if ((beat && i === last) || (this.healT > 0 && i === last && (this.healT >> 2) & 1)) img = G.art.flash(img);
        ctx.drawImage(img, 5 + (i % 10) * 8 + shake, 5 + Math.floor(i / 10) * 8 - (beat && i === last ? 1 : 0));
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
        // the bidet's water level, down the right side of its box (red when it's nearly dry)
        if (s.xItem === 'bidet') {
          const k = G.bidetWater() / G.BIDET_MAX, hh = Math.round(16 * k);
          ctx.fillStyle = '#1c2a3a'; ctx.fillRect(G.W - 34, 8, 2, 16);
          ctx.fillStyle = k > 0.25 ? '#5aa8e8' : '#f86858'; ctx.fillRect(G.W - 34, 24 - hh, 2, hh);
        }
        itemBox(ctx, G.W - 27, 5, 'Z', s.items.hammer ? G.ITEMS.hammer.icon() : null);
      }
      if (s.admin) F().draw(ctx, s.god ? 'ADMIN (INVINCIBLE)' : 'ADMIN', 5, 15 + Math.floor((s.maxHp / 2 - 1) / 10) * 8, '#ff98d0', { shadow: SH });
      // shark teeth: the counter rolls to the new number (skipping the sacred
      // number, like the teeth do) and a little +n floats up beside it
      if (s.teeth !== this.tSeen) {
        const d = s.teeth - this.tSeen;
        this.gain = (this.gainT > 0 && Math.sign(this.gain) === Math.sign(d) ? this.gain : 0) + d;
        this.gainT = 70;
        this.tSeen = s.teeth;
      }
      const rolling = this.tShown !== s.teeth;
      if (rolling) {
        const d = s.teeth - this.tShown, dir = Math.sign(d);
        let v = this.tShown + dir * Math.min(Math.abs(d), Math.max(1, Math.ceil(Math.abs(d) / 24)));
        while (/6/.test(String(v)) && v !== s.teeth) v += dir;
        this.tShown = v;
      }
      ctx.drawImage(G.spr.tooth, 5, G.H - 14 - (rolling && (G.tick >> 2) & 1 ? 1 : 0));
      const shown = String(this.tShown).padStart(3, '0');
      F().draw(ctx, shown, 15, G.H - 13, rolling ? (this.gain < 0 ? '#f86858' : '#f8d850') : '#f8f8f0', { shadow: SH });
      if (this.gainT > 0) {
        this.gainT--;
        const txt = (this.gain > 0 ? '+' : '-') + G.sayable(Math.abs(this.gain));
        ctx.globalAlpha = Math.min(1, this.gainT / 20);
        F().draw(ctx, txt, 18 + F().width(shown), G.H - 13 - Math.min(4, Math.floor((70 - this.gainT) / 6)), this.gain > 0 ? '#f8d850' : '#f86858', { shadow: SH });
        ctx.globalAlpha = 1;
      }
    },

    // The boss's health: fills up when the fight starts, flashes on a hit,
    // and leaves a pale trail that drains away a moment later.
    bossBar(ctx, b) {
      const w = 140, x = Math.round((G.W - w) / 2), y = G.H - 13;
      let bt = this.bt;
      if (!bt || bt.b !== b) bt = this.bt = { b, show: 0, trail: b.hp, last: b.hp, hold: 0, flash: 0 };
      if (bt.show < 1) bt.show = Math.min(1, bt.show + 1 / 40);
      if (b.hp < bt.last) { bt.hold = 24; bt.flash = 6; }
      if (b.hp > bt.last) bt.trail = b.hp; // (healed: Berk's crowd)
      bt.last = b.hp;
      if (bt.hold > 0) bt.hold--;
      else if (bt.trail > b.hp) bt.trail = Math.max(b.hp, bt.trail - b.maxHp / 80);
      if (bt.flash > 0) bt.flash--;
      const ease = 1 - (1 - bt.show) * (1 - bt.show);
      const frac = (v) => Math.max(0, Math.min(1, v / b.maxHp)) * ease, iw = w - 2;
      // the name on a little plate
      const nw = F().width(b.name) + 12, nx = Math.round((G.W - nw) / 2), ny = y - 13;
      ctx.fillStyle = SH; ctx.fillRect(nx - 1, ny - 1, nw + 2, 13);
      ctx.fillStyle = '#5a5078'; ctx.fillRect(nx, ny, nw, 11);
      ctx.fillStyle = '#1e1830'; ctx.fillRect(nx + 1, ny + 1, nw - 2, 10);
      F().draw(ctx, b.name, nx + 6, ny + 2, '#f8d850', { shadow: SH });
      // the frame, with little gold studs on the ends
      ctx.fillStyle = SH; ctx.fillRect(x - 2, y - 2, w + 4, 10);
      ctx.fillStyle = '#5a5078'; ctx.fillRect(x - 1, y - 1, w + 2, 8);
      ctx.fillStyle = '#2a1020'; ctx.fillRect(x, y, w, 6);
      for (const sx of [x - 5, x + w + 2]) {
        ctx.fillStyle = SH; ctx.fillRect(sx, y, 3, 6); ctx.fillRect(sx - 1, y + 1, 5, 4);
        ctx.fillStyle = '#f8d850'; ctx.fillRect(sx, y + 2, 3, 2); ctx.fillRect(sx + 1, y + 1, 1, 4);
      }
      // the pale trail, then the health itself
      const hw = Math.round(iw * frac(b.hp)), tw = Math.round(iw * frac(bt.trail));
      if (tw > hw) { ctx.fillStyle = '#f8e0a0'; ctx.fillRect(x + 1 + hw, y + 1, tw - hw, 4); }
      if (hw > 0) {
        const low = b.hp <= b.maxHp / 4 && (G.tick >> 3) & 1;
        ctx.fillStyle = bt.flash ? '#ffffff' : low ? '#ff6868' : '#e83848'; ctx.fillRect(x + 1, y + 1, hw, 4);
        ctx.fillStyle = bt.flash ? '#ffffff' : '#ff98a0'; ctx.fillRect(x + 1, y + 1, hw, 1);
        ctx.fillStyle = bt.flash ? '#e8e8f0' : '#a82838'; ctx.fillRect(x + 1, y + 4, hw, 1);
      }
      // quarter marks
      ctx.fillStyle = 'rgba(12,8,20,0.55)';
      for (let q = 1; q < 4; q++) ctx.fillRect(x + 1 + Math.round((iw * q) / 4), y + 1, 1, 4);
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

  // ------------------------------------------------------------ quest toasts
  // Twice a second (outside cutscenes) the side quests get compared with the
  // last look. A new quest, a new rumor or a finished one pops a little card up
  // from the bottom of the screen, and new ones say NEW on the QUESTS page
  // until Nate looks at it.
  const TOAST = { active: ['NEW QUEST', '#f8d850'], rumor: ['NEW RUMOR', '#78e8e8'], done: ['QUEST COMPLETE', '#78e070'] };
  const TOAST_T = 170;
  G.toasts = {
    list: [], t: 0, dur: TOAST_T,
    update() {
      if (!this.list.length || G.script.busy) return;
      // (quicker when there's a line of them)
      if (this.t === 0) { this.dur = this.list.length > 1 ? 120 : TOAST_T; G.audio.sfx(this.list[0].kind === 'done' ? 'secret' : 'select'); }
      if (++this.t >= this.dur) { this.list.shift(); this.t = 0; }
    },
    clear() { this.list = []; this.t = 0; },
    draw(ctx, raised) {
      const q = this.list[0];
      if (!q || !this.t || G.script.busy) return;
      const [label, col] = TOAST[q.kind], t = this.t;
      const k = Math.min(1, t / 10, (this.dur - t) / 12), e = 1 - (1 - k) * (1 - k);
      const name = fit(q.name, 180), w = Math.max(F().width(label), F().width(name)) + 30, h = 22;
      const x = Math.round((G.W - w) / 2), y = G.H - (raised ? 56 : 32) + Math.round((1 - e) * 10);
      ctx.globalAlpha = e;
      ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(x + 2, y + 2, w, h);
      ctx.fillStyle = col; ctx.fillRect(x + 1, y, w - 2, h); ctx.fillRect(x, y + 1, w, h - 2);
      ctx.fillStyle = '#1e1830'; ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
      ctx.fillStyle = '#2a2240'; ctx.fillRect(x + 1, y + 1, w - 2, 1);
      // the badge: ! for a quest, ? for a rumor, a check when it's done
      const bx = x + 4, by = y + 4;
      ctx.fillStyle = '#0c0814'; ctx.fillRect(bx + 1, by, 12, 14); ctx.fillRect(bx, by + 1, 14, 12);
      ctx.fillStyle = col; ctx.fillRect(bx + 1, by + 1, 12, 12);
      ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.fillRect(bx + 1, by + 1, 12, 2);
      ctx.fillStyle = '#1c1424';
      if (q.kind === 'done') [[3, 7], [4, 8], [5, 9], [6, 8], [7, 7], [8, 6], [9, 5], [10, 4]].forEach(([dx, dy]) => ctx.fillRect(bx + dx, by + dy, 1, 2));
      else F().draw(ctx, q.kind === 'active' ? '!' : '?', bx + 7 - Math.floor(F().width(q.kind === 'active' ? '!' : '?') / 2), by + 4, '#1c1424');
      F().draw(ctx, label, x + 22, y + 3, col, { shadow: SH });
      F().draw(ctx, name, x + 22, y + 12, '#f8f8f0', { shadow: SH });
      // a glint across the card as it lands
      if (t > 6 && t < 26) {
        const gx = x + Math.round(((t - 6) / 20) * (w + 16)) - 8;
        ctx.save(); ctx.beginPath(); ctx.rect(x + 1, y + 1, w - 2, h - 2); ctx.clip();
        ctx.fillStyle = 'rgba(255,255,255,0.18)';
        for (let i = 0; i < h; i++) ctx.fillRect(gx - Math.floor(i / 2), y + i, 4, 1);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    },
  };
  G.questWatch = () => {
    const s = G.state, side = G.journal().side;
    // the first look (old saves, new games, admin runs) just takes notes
    if (!s.questLog) { s.questLog = {}; for (const q of side) s.questLog[q.name] = q.kind; return; }
    s.questNew = s.questNew || {};
    for (const q of side) {
      const was = s.questLog[q.name];
      if (was === q.kind || was === 'done' || (was && q.kind === 'rumor')) continue;
      s.questLog[q.name] = q.kind;
      G.toasts.list.push({ kind: q.kind, name: q.name });
      if (q.kind === 'done') delete s.questNew[q.name];
      else s.questNew[q.name] = 1;
    }
  };

  // ------------------------------------------------------------ pause menu
  // GBA-style pages: QUESTS / MAP / ITEMS / KEYS / PEOPLE / COLLECTABLES / SAVE (ADMIN
  // in admin runs). Q/E flip pages (or press up into the tab bar, then left/right).
  // The menu opens on whichever page you had open last (QUESTS the first time).
  const TABS = ['QUESTS', 'MAP', 'ITEMS', 'KEYS', 'PEOPLE', 'COLLECTABLES', 'SAVE'];
  const QUEST_TAB = 0, MAP_TAB = 1, ITEM_TAB = 2, KEY_TAB = 3, PEOPLE_TAB = 4, COLL_TAB = 5, SAVE_TAB = 6;
  const COLS = 4, ROWS = 3, RCOLS = 5, PCOLS = 3;
  // COLLECTABLES opens on a list of sections; Z opens one, X backs out. Add new kinds here.
  const COLLECTIONS = [
    { id: 'rocks', name: 'Rocks', icon: 'rocks', count: () => [G.rocksFound(), G.ROCKS.length], blurb: 'Every specimen Nate has dug up, smashed out or sifted, area by area.' },
    { id: 'photos', name: 'Photos', icon: 'photo', count: () => [G.photosFound(), G.PHOTOS.length], blurb: 'Old family photos, hidden all over. Some of them Mom would rather nobody saw.' },
  ];
  const SEL = { bg: '#3a3058', border: '#f8d850', inner: '#7a6a30' };
  const TXT = (ctx, str, x, y, col) => F().draw(ctx, str, x, y, col || '#f8f8f0', { shadow: SH });
  const C = { gold: '#f8d850', cyan: '#78e8e8', green: '#78e070', red: '#f86858', dim: '#9890a8', faint: '#5a4e70', soft: '#c8c0d8', pink: '#ff98d0' };
  const QMODES = ['ACTIVE', '100%', 'RULES'];
  let lastTab = QUEST_TAB;

  // ---- tiny 9x9 pixel icons for the tabs and stats (drawn once)
  const ICON_PAL = {
    k: '#1c1424', w: '#f4ecd8', y: '#f8d850', o: '#c89838', b: '#8a5a34', g: '#b8b8c8', G: '#6a6a78', r: '#e85050',
    c: '#78e8e8', C: '#3a98b8', s: '#f4c8aa', h: '#9a4a28', n: '#4a8a48', u: '#3a68b8', l: '#a8c8f0',
  };
  const ICON_ART = {
    quests: ['.kkkkkkk.', 'kwwwwwwwk', 'kwbbbbbwk', 'kwwwwwwwk', 'kwbbbbwwk', 'kwwwwwwwk', 'kwbbwwrrk', 'kwwwwwrrk', '.kkkkkkk.'],
    items: ['kkkkkkkk.', 'kgggggGk.', 'kgwwgggk.', 'kkkkbkkk.', '....b....', '....b....', '....b....', '...kbk...', '....k....'],
    keys: ['..kkk....', '.kyyyk...', '.ky.yk...', '.kyyyk...', '..kyk....', '...ykk...', '...yyk...', '...ykk...', '...yyk...'],
    people: ['..kkkkk..', '.khhhhhk.', '.hhssshh.', '.skssksk.', '.sssssss.', '..sskss..', '..sssss..', '.nnnnnnn.', 'nnnnnnnnn'],
    rocks: ['...kkk...', '..kcwck..', '.kcwccck.', 'kccccccCk', 'kCcccccCk', '.kCcccCk.', '..kCcCk..', '...kCk...', '....k....'],
    save: ['kkkkkkkkk', 'kuwwwwwuk', 'kuwwwwwuk', 'kuuuuuuuk', 'kuugggguk', 'kuugkgguk', 'kuugggguk', 'kuuuuuuuk', 'kkkkkkkkk'],
    admin: ['.kk...kk.', 'kggk.kggk', 'kggkkkggk', '.kgggggk.', '..kgggk..', '...kgk...', '...kgk...', '...kgk...', '...kkk...'],
    clock: ['..kkkkk..', '.kwwkwwk.', 'kwwwkwwwk', 'kwwwkwwwk', 'kwwwkkkwk', 'kwwwwwwwk', 'kwwwwwwwk', '.kwwwwwk.', '..kkkkk..'],
    map: ['.kkkkkkk.', 'kwwnkwwwk', 'kwnnkwrwk', 'kwwwkrwrk', 'kwyykwrwk', 'kwyykwwwk', 'kwwwkwwnk', '.kkkkkkk.', '.........'],
    college: ['....k....', '..kkrkk..', '.krrrrrk.', 'kkkkkkkkk', '.kwkwkwk.', '.kwkwkwk.', '.kwkwkwk.', 'kkkkkkkkk', 'kgggggggk'],
    fair: ['..kkkkk..', '.ky.k.yk.', 'ky.kkk.yk', 'k.kkykk.k', 'kkkyyykkk', 'k.kkykk.k', 'ky.kkk.yk', '.kykkkyk.', '.kk...kk.'],
    house: ['....k....', '...krk...', '..krrrk..', '.krrrrrk.', 'kkkkkkkkk', '.kwwwwwk.', '.kukbkuk.', '.kwkbkwk.', '.kkkkkkk.'],
    mine: ['..kkkkk..', '.kbbbbbk.', 'kbkkkkkbk', 'kbk...kbk', 'kbk...kbk', 'kbk...kbk', 'kbk.y.kbk', 'kbk...kbk', 'kkkkkkkkk'],
    bridge: ['..k...k..', '.kgk.kgk.', 'kkgkkkgkk', 'ggggggggg', 'kkkkkkkkk', '.k.k.k.k.', 'ulululull', 'uuuuuuuuu', '.........'],
    trophy: ['kkkkkkkkk', 'kyyyyyyyk', 'kkyyyyykk', '.kyywyyk.', '..kyyyk..', '...kyk...', '...kyk...', '..kkkkk..', '..koook..'],
    party: ['.kk...kk.', 'khhk.kssk', 'kssk.kssk', '.kk...kk.', 'knnk.kuuk', 'nnnnkuuuu', 'nnnnkuuuu', 'nnnnkuuuu', '.........'],
    collect: ['....k....', '...kyk...', 'kkkkykkkk', 'kyyyyyyyk', '.kyyyyyk.', '..kyyyk..', '.kyykyyk.', '.kyk.kyk.', '.kk...kk.'],
    photo: ['kkkkkkkkk', 'kwwwwwwwk', 'kwllllwwk', 'kwlsslllk', 'kwlsslllk', 'kwlnnnllk', 'kwnnnnnwk', 'kwwwwwwwk', 'kkkkkkkkk'],
  };
  const iconCache = {};
  function icon(name) {
    if (iconCache[name]) return iconCache[name];
    const c = G.canvas(9, 9), x = c.getContext('2d');
    ICON_ART[name].forEach((row, y) => {
      const r = row.padEnd(9, '.').slice(0, 9);
      for (let i = 0; i < 9; i++) { const col = ICON_PAL[r[i]]; if (col) { x.fillStyle = col; x.fillRect(i, y, 1, 1); } }
    });
    return (iconCache[name] = c);
  }

  // ---- drawing helpers: cards, bars, key caps, the selection cursor
  function card(ctx, x, y, w, h, title, tcol, right, rcol) {
    ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(x + 2, y + 2, w, h);
    ctx.fillStyle = '#5a5078'; ctx.fillRect(x + 1, y, w - 2, h); ctx.fillRect(x, y + 1, w, h - 2);
    ctx.fillStyle = '#1e1830'; ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
    ctx.fillStyle = '#2a2240'; ctx.fillRect(x + 1, y + 1, w - 2, 1);
    if (!title) return;
    ctx.fillStyle = '#2a2240'; ctx.fillRect(x + 1, y + 1, w - 2, 12);
    ctx.fillStyle = '#3e3460'; ctx.fillRect(x + 1, y + 13, w - 2, 1);
    TXT(ctx, title, x + 5, y + 3, tcol || C.gold);
    if (right) TXT(ctx, right, x + w - 5 - F().width(right), y + 3, rcol || C.cyan);
  }
  function bar(ctx, x, y, w, h, frac, col) {
    ctx.fillStyle = '#0c0814'; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#2a2240'; ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
    const f = Math.round((w - 2) * Math.max(0, Math.min(1, frac)));
    if (f <= 0) return;
    ctx.fillStyle = col; ctx.fillRect(x + 1, y + 1, f, h - 2);
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(x + 1, y + 1, f, 1);
  }
  function keycap(ctx, x, y, label) {
    const w = F().width(label) + 6;
    ctx.fillStyle = '#0c0814'; ctx.fillRect(x, y + 1, w, 10);
    ctx.fillStyle = '#b8b0c8'; ctx.fillRect(x, y, w, 10);
    ctx.fillStyle = '#f4f2f8'; ctx.fillRect(x + 1, y, w - 2, 1);
    ctx.fillStyle = '#8a809c'; ctx.fillRect(x + 1, y + 9, w - 2, 1);
    F().draw(ctx, label, x + 3, y + 2, '#282030');
    return w;
  }
  // a little pink twinkle for things that are new
  function sparkle(ctx, x, y) {
    ctx.fillStyle = SH; ctx.fillRect(x + 1, y + 2, 5, 3); ctx.fillRect(x + 2, y + 1, 3, 5); ctx.fillRect(x + 3, y, 1, 7);
    ctx.fillStyle = C.pink; ctx.fillRect(x + 3, y + 1, 1, 5); ctx.fillRect(x + 1, y + 3, 5, 1); ctx.fillRect(x + 2, y + 2, 3, 3);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(x + 3, y + 3, 1, 1);
  }
  // a little pointing arrow that bobs next to whatever is selected
  function cursor(ctx, x, y) {
    const b = (G.tick >> 3) & 1;
    ctx.fillStyle = '#0c0814'; ctx.fillRect(x + b, y, 1, 7); ctx.fillRect(x + 1 + b, y + 1, 1, 5); ctx.fillRect(x + 2 + b, y + 2, 1, 3); ctx.fillRect(x + 3 + b, y + 3, 1, 1);
    ctx.fillStyle = C.gold; ctx.fillRect(x + b, y + 1, 1, 5); ctx.fillRect(x + 1 + b, y + 2, 1, 3); ctx.fillRect(x + 2 + b, y + 3, 1, 1);
  }
  // gold corner brackets that pulse around a selected grid slot
  function brackets(ctx, x, y, w, h) {
    const o = (G.tick >> 3) & 1, L = 4;
    ctx.fillStyle = C.gold;
    for (const [cx, cy, sx, sy] of [[x - o, y - o, 1, 1], [x + w - 1 + o, y - o, -1, 1], [x - o, y + h - 1 + o, 1, -1], [x + w - 1 + o, y + h - 1 + o, -1, -1]]) {
      ctx.fillRect(sx > 0 ? cx : cx - L + 1, cy, L, 1);
      ctx.fillRect(cx, sy > 0 ? cy : cy - L + 1, 1, L);
    }
  }
  // an inset slot for an item or rock
  function slot(ctx, x, y, w, h, rim) {
    ctx.fillStyle = rim || '#4a4064'; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#140e22'; ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
    ctx.fillStyle = '#1e1830'; ctx.fillRect(x + 2, y + 2, w - 3, h - 3);
  }
  // text that won't run past `w` pixels
  function fit(str, w) {
    if (F().width(str) <= w) return str;
    let s = str;
    while (s.length > 1 && F().width(s + '...') > w) s = s.slice(0, -1);
    return s.trimEnd() + '...';
  }
  // the completion ring (cached per percent)
  const ringCache = new Map();
  function ring(frac, gold, R = 16, r = 11) {
    const key = Math.round(frac * 100) + (gold ? 'g' : '') + R;
    let c = ringCache.get(key);
    if (c) return c;
    const S = R * 2 + 4, m = S / 2;
    c = G.canvas(S, S);
    const x = c.getContext('2d');
    for (let py = 0; py < S; py++) for (let px = 0; px < S; px++) {
      const dx = px + 0.5 - m, dy = py + 0.5 - m, d = Math.hypot(dx, dy);
      if (d > R + 1.5 || d < r - 1.5) continue;
      let col;
      if (d > R + 0.5 || d < r - 0.5) col = '#0c0814';
      else {
        let a = Math.atan2(dx, -dy) / (Math.PI * 2);
        if (a < 0) a += 1;
        const on = a <= frac + 0.001, outer = d > (R + r) / 2;
        col = gold ? (outer ? '#78e070' : '#a8f098') : on ? (outer ? '#f8d850' : '#fff0a0') : (outer ? '#3a3058' : '#2e2648');
      }
      x.fillStyle = col; x.fillRect(px, py, 1, 1);
    }
    ringCache.set(key, c);
    return c;
  }

  // ---- the MAP page: where Nate has been, where he is, and where the quests are
  const PLACES = [
    { id: 'laf', name: 'LAFAYETTE', x: 30, y: 36, icon: 'college', key: 'Lafayette',
      maps: [['lab', 'Nate\'s Lab'], ['campus', 'The Quad'], ['science', 'Science Center'], ['geology', 'Van Wickle Hall'], ['pardee', 'Pardee Hall'], ['collegeHill', 'College Hill'], ['toms', 'Tom\'s Pizza']] },
    { id: 'fair', name: 'EASTON FAIR', x: 98, y: 32, icon: 'fair', key: 'Easton', maps: [['fair', 'Fairgrounds'], ['arena', 'Expo Hall'], ['fairCave', 'The Little Cave']] },
    { id: 'home', name: 'HOME', x: 44, y: 72, icon: 'house', key: 'Home',
      maps: [['home', 'The Yard'], ['homeDown', 'Downstairs'], ['homeUp', 'Upstairs'], ['garage', 'Dad\'s Workshop'], ['basement', 'Basement'], ['north', 'The Frozen Pond']] },
    { id: 'andover', name: 'ANDOVER', x: 112, y: 64, icon: 'mine', key: 'Andover', maps: [['andover', 'The Mines'], ['andoverMine', 'The Tunnels'], ['andoverDeep', 'The Deep Stope']] },
    { id: 'bay', name: 'THE BAY', x: 74, y: 98, icon: 'bridge', key: 'Bay', maps: [['cbbtToll', 'Toll Plaza'], ['cbbt', 'The First Island'], ['chesTunnel', 'Chesapeake Channel Tunnel'], ['cbbtMid', 'Between the Tunnels'], ['cbbtTunnel', 'Thimble Shoal Tunnel']] },
    { id: 'ditch', name: 'THE DITCH', x: 118, y: 94, icon: 'trophy', key: '-', maps: [] },
  ];
  const ROADS = [['laf', 'fair'], ['laf', 'home'], ['home', 'andover'], ['home', 'bay'], ['bay', 'ditch']];
  const placeById = (id) => PLACES.find((p) => p.id === id);
  // somewhere Nate has been (older saves didn't keep track, so the story fills in)
  const SEEN_IF = {
    lab: () => true, campus: () => true, science: (f) => f.chemMet, pardee: (f) => f.engMet, geology: (f) => f.profTalk,
    fair: (f) => f.doronChat || f.doronDeal, arena: (f) => f.dadBeaten, fairCave: (f) => f.caveSeen, home: (f) => f.homeArrived, homeDown: (f) => f.badlandsMet,
    garage: (f) => f.snackQuest, basement: (f) => f.globMet, north: (f) => f.jjSeen, andover: (f) => f.andover || f.andoverMine,
    andoverMine: (f) => f.andoverMine, andoverDeep: (f) => f.fcAwake, cbbt: (f) => f.cbbtArrived, cbbtTunnel: (f) => f.tunnelSeen, cbbtToll: (f) => f.tollMet, chesTunnel: (f) => f.chesSeen, cbbtMid: (f) => f.midSeen,
  };
  const beenTo = (id) => !!((G.state.visited && G.state.visited[id]) || (SEEN_IF[id] && SEEN_IF[id](G.state.flags)));
  const placeVisited = (pl) => pl.maps.some(([id]) => beenTo(id));
  // can Nate get there yet?
  const placeOpen = (pl) => {
    const f = G.state.flags, s = G.state;
    return { laf: true, fair: s.items.cap || f.doronChat, home: f.boulderGone, andover: s.items.andoverKey || f.andoverLocked, bay: f.mikeyBeaten, ditch: f.tylerBeaten }[pl.id] || placeVisited(pl);
  };
  // which place Nate is standing in
  const placeOf = (mapId) => {
    if (mapId === 'ring') mapId = 'arena';
    if (mapId === 'goldenHour') mapId = 'home';
    if (mapId === 'jamStage') mapId = (G.state.jamFrom && G.state.jamFrom.map) || 'campus';
    return PLACES.find((pl) => pl.maps.some(([id]) => id === mapId));
  };
  // where the main quest is headed
  const mainPlace = () => {
    const f = G.state.flags, s = G.state;
    if (!s.items.cap) return 'laf';
    if (!f.dadBeaten) return 'fair';
    if (!f.boulderGone) return 'laf';
    if (!f.mikeyBeaten) return 'home';
    if (!f.tylerBeaten) return 'bay';
    return 'ditch';
  };
  // a round badge for a place on the map
  function badge(ctx, x, y, rim, fill) {
    for (let dy = -8; dy <= 8; dy++) {
      const hw = Math.floor(Math.sqrt(72.5 - dy * dy));
      ctx.fillStyle = SH; ctx.fillRect(x - hw, y + dy, hw * 2 + 1, 1);
      if (Math.abs(dy) <= 7) { const w2 = Math.floor(Math.sqrt(56.5 - dy * dy)); ctx.fillStyle = rim; ctx.fillRect(x - w2, y + dy, w2 * 2 + 1, 1); }
      if (Math.abs(dy) <= 6) { const w3 = Math.floor(Math.sqrt(42.5 - dy * dy)); ctx.fillStyle = fill; ctx.fillRect(x - w3, y + dy, w3 * 2 + 1, 1); }
    }
  }

  // A photo, full screen: framed on the left, its name and caption on the right.
  const photoPages = new Map();
  G.photoPage = (ph) => {
    const ready = ph.img.complete && ph.img.naturalWidth;
    if (ready && photoPages.has(ph.id)) return photoPages.get(ph.id);
    const c = G.canvas(G.W, G.H), x = c.getContext('2d');
    // the picture at its own size (they're made to fit: 82x120 tall, 120x90 wide), framed on the left
    const iw = ready ? ph.img.naturalWidth : 82, ih = ready ? ph.img.naturalHeight : 120;
    const fx = 10, fy = Math.round((G.H - 6 - (ih + 8)) / 2), tx = fx + iw + 18, tw = G.W - tx - 6;
    x.fillStyle = '#1c1424'; x.fillRect(0, 0, G.W, G.H);
    x.fillStyle = '#0c0814'; x.fillRect(fx + 3, fy + 3, iw + 10, ih + 10);
    x.fillStyle = '#f6f4ee'; x.fillRect(fx, fy, iw + 8, ih + 8);
    x.fillStyle = '#d8d4c8'; x.fillRect(fx, fy + ih + 7, iw + 8, 1);
    if (ready) x.drawImage(ph.img, fx + 4, fy + 4); else { x.fillStyle = '#3e3460'; x.fillRect(fx + 4, fy + 4, iw, ih); }
    TXT(x, ph.name, tx, 16, C.gold);
    TXT(x, ph.place, tx, 26, C.cyan);
    x.fillStyle = '#3e3460'; x.fillRect(tx, 37, tw, 1);
    F().wrap(ph.caption, tw).slice(0, 12).forEach((l, i) => TXT(x, l, tx, 42 + i * 9, C.soft));
    if (ready) photoPages.set(ph.id, c);
    return c;
  };
  // a tiny framed version, for the "you got it" fanfare
  G.photoIcon = (ph) => {
    const c = G.canvas(12, 15), x = c.getContext('2d');
    x.fillStyle = '#1c1424'; x.fillRect(0, 0, 12, 15);
    x.fillStyle = '#f6f4ee'; x.fillRect(1, 1, 10, 13);
    if (ph.img.complete && ph.img.naturalWidth) { x.imageSmoothingEnabled = true; fitImage(x, ph.img, 2, 2, 8, 11); }
    return c;
  };
  // draw an image scaled to fit inside w x h, centered, keeping its shape
  function fitImage(ctx, img, x, y, w, h) {
    const k = Math.min(w / img.naturalWidth, h / img.naturalHeight), dw = Math.round(img.naturalWidth * k), dh = Math.round(img.naturalHeight * k);
    ctx.drawImage(img, x + Math.round((w - dw) / 2), y + Math.round((h - dh) / 2), dw, dh);
  }

  class PauseMenu {
    constructor() {
      this.tab = lastTab;
      this.sel = 0;
      this.qsel = 0;
      this.qscroll = 0;
      this.qmode = 0;
      this.msel = Math.max(0, PLACES.indexOf(G.play.world && placeOf(G.play.world.id)));
      this.onTabs = false;
      this.msg = '';
      this.msgT = 0;
      this.openT = 0;
      this.fresh = Object.assign({}, G.state.questNew);
      G.audio.sfx('select');
    }

    // shared gear slots ([a, b]) show whichever item Nate has (or the last one, still unfound);
    // KEY ITEMS just lists what Nate is carrying, in order (the grid holds twelve)
    slots() {
      if (this.tab === ITEM_TAB) return G.GEAR_SLOTS.map((e) => (Array.isArray(e) ? e.find((id) => G.itemHas(id)) || e[e.length - 1] : e));
      const held = G.KEY_SLOTS.flat().filter((id) => G.itemHas(id)).slice(0, COLS * ROWS);
      return held.concat(Array(COLS * ROWS - held.length).fill(null));
    }

    switchTab(d) {
      this.tab = (this.tab + d + TABS.length) % TABS.length;
      lastTab = this.tab;
      this.admList = null;
      this.coll = null;
      this.photoView = null;
      this.sel = 0;
      this.scroll = 0;
      G.audio.sfx('menu');
    }

    move(d, count) {
      const n = this.sel + d;
      if (n < 0 || n >= count) return false;
      this.sel = n;
      G.audio.sfx('menu');
      return true;
    }

    // the rows the QUESTS list is showing right now
    questRows() {
      if (this.qmode === 0) return G.journal().side;
      if (this.qmode === 1) return G.completion().map(([name, ok]) => ({ name, ok }));
      return [];
    }

    update() {
      const inp = G.input;
      this.openT++;
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
      // (inside a COLLECTABLES section, X backs out instead)
      if (inp.hit('b') && !G.state.admin && !(this.tab === COLL_TAB && this.coll)) this.saveTo(G.state.slot || 1);

      if (this.onTabs) {
        if (inp.hit('left')) this.switchTab(-1);
        if (inp.hit('right')) this.switchTab(1);
        if (inp.hit('down') || inp.hit('a')) { inp.eat('a'); this.onTabs = false; G.audio.sfx('menu'); }
        return false;
      }

      if (this.tab === QUEST_TAB) {
        // Z flips between active quests, the 100% checklist and Abe's Rules; up/down picks a row
        if (inp.hit('a')) { inp.eat('a'); this.qmode = (this.qmode + 1) % QMODES.length; this.qsel = 0; this.qscroll = 0; G.audio.sfx('menu'); }
        const n = this.questRows().length;
        if (inp.hit('down') && this.qsel < n - 1) { this.qsel++; G.audio.sfx('menu'); }
        if (inp.hit('up')) { if (this.qsel > 0) { this.qsel--; G.audio.sfx('menu'); } else { this.onTabs = true; G.audio.sfx('menu'); } }
      } else if (this.tab === MAP_TAB) {
        // arrows hop to the nearest place that way; up off the top goes to the tabs
        for (const [d, vx, vy] of [['left', -1, 0], ['right', 1, 0], ['up', 0, -1], ['down', 0, 1]]) {
          if (!inp.hit(d)) continue;
          const a = PLACES[this.msel];
          let best = -1, bs = 1e9;
          PLACES.forEach((b, j) => {
            const dx = b.x - a.x, dy = b.y - a.y, along = dx * vx + dy * vy;
            if (j === this.msel || along <= 0) return;
            const score = along + Math.abs(dx * vy - dy * vx) * 2;
            if (score < bs) { bs = score; best = j; }
          });
          if (best >= 0) { this.msel = best; G.audio.sfx('menu'); }
          else if (d === 'up') { this.onTabs = true; G.audio.sfx('menu'); }
        }
      } else if (this.tab === ITEM_TAB || this.tab === KEY_TAB) {
        const col = this.sel % COLS, row = Math.floor(this.sel / COLS);
        if (inp.hit('left') && col > 0) this.move(-1, COLS * ROWS);
        if (inp.hit('right') && col < COLS - 1) this.move(1, COLS * ROWS);
        if (inp.hit('down') && row < ROWS - 1) this.move(COLS, COLS * ROWS);
        if (inp.hit('up')) { if (row > 0) this.move(-COLS, COLS * ROWS); else { this.onTabs = true; G.audio.sfx('menu'); } }
        if (inp.hit('a')) return this.activate();
      } else if (this.tab === COLL_TAB && this.photoView) {
        // looking at a photo: Z or X puts it away
        if (inp.hit('a') || inp.hit('b')) { inp.eat('a'); inp.eat('b'); this.photoView = null; G.audio.sfx('cancel'); }
      } else if (this.tab === COLL_TAB && this.coll && inp.hit('b')) {
        inp.eat('b');
        this.sel = COLLECTIONS.findIndex((c) => c.id === this.coll);
        this.coll = null;
        G.audio.sfx('cancel');
      } else if (this.tab === COLL_TAB && !this.coll) {
        // the list of sections
        if (inp.hit('down')) this.move(1, COLLECTIONS.length);
        if (inp.hit('up')) { if (this.sel > 0) this.move(-1, COLLECTIONS.length); else { this.onTabs = true; G.audio.sfx('menu'); } }
        if (inp.hit('a')) { inp.eat('a'); this.coll = COLLECTIONS[this.sel].id; this.sel = 0; G.audio.sfx('select'); }
      } else if (this.tab === COLL_TAB && this.coll === 'photos') {
        const n = G.PHOTOS.length, col = this.sel % PCOLS, row = Math.floor(this.sel / PCOLS);
        if (inp.hit('left') && col > 0) this.move(-1, n);
        if (inp.hit('right') && col < PCOLS - 1) this.move(1, n);
        if (inp.hit('down') && this.sel + PCOLS < n) this.move(PCOLS, n);
        if (inp.hit('up')) { if (row > 0) this.move(-PCOLS, n); else { this.onTabs = true; G.audio.sfx('menu'); } }
        if (inp.hit('a')) {
          inp.eat('a');
          const ph = G.PHOTOS[this.sel];
          if (ph && G.photoHas(ph.id)) { this.photoView = ph; G.audio.sfx('select'); } else G.audio.sfx('bump');
        }
      } else if (this.tab === COLL_TAB) {
        // ROCKS: one page per area (Z flips pages), five to a row
        if (inp.hit('a')) { inp.eat('a'); this.rockArea = ((this.rockArea || 0) + 1) % G.ROCK_AREAS.length; this.sel = 0; G.audio.sfx('menu'); }
        const n = this.areaRocks().length, col = this.sel % RCOLS, row = Math.floor(this.sel / RCOLS);
        if (inp.hit('left') && col > 0) this.move(-1, n);
        if (inp.hit('right') && col < RCOLS - 1) this.move(1, n);
        if (inp.hit('down') && this.sel + RCOLS < n) this.move(RCOLS, n);
        if (inp.hit('up')) { if (row > 0) this.move(-RCOLS, n); else { this.onTabs = true; G.audio.sfx('menu'); } }
      } else if (this.tab === PEOPLE_TAB) {
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
      // dim the game behind, with a darker band for the tabs
      const k = Math.min(1, this.openT / 8), ease = 1 - (1 - k) * (1 - k);
      ctx.fillStyle = 'rgba(12,8,20,' + (0.88 * ease) + ')';
      ctx.fillRect(0, 0, G.W, G.H);
      ctx.fillStyle = 'rgba(20,14,34,' + (0.9 * ease) + ')';
      ctx.fillRect(0, 0, G.W, 19);
      ctx.fillRect(0, 144, G.W, 16);
      ctx.save();
      ctx.translate(0, Math.round((1 - ease) * -10));
      ctx.globalAlpha = ease;
      this.drawTabs(ctx);
      if (this.tab === QUEST_TAB) this.drawQuests(ctx);
      else if (this.tab === MAP_TAB) this.drawMap(ctx);
      else if (this.tab === ITEM_TAB || this.tab === KEY_TAB) this.drawGrid(ctx);
      else if (this.tab === PEOPLE_TAB) this.drawPeople(ctx);
      else if (this.tab === COLL_TAB) this.drawCollect(ctx);
      else if (G.state.admin) this.drawAdmin(ctx);
      else this.drawSave(ctx);
      ctx.restore();
      this.drawHints(ctx);
    }

    // the button hints along the bottom (or a message, or the save prompt)
    drawHints(ctx) {
      const y = 147;
      if (this.confirm) { TXT(ctx, '{r}Save over File ' + this.confirm + '?', 6, y + 2); let x = 110; x += keycap(ctx, x, y, 'Z') + 3; TXT(ctx, 'yes', x, y + 2, C.soft); x += 22; x += keycap(ctx, x, y, 'X') + 3; TXT(ctx, 'no', x, y + 2, C.soft); return; }
      if (this.msgT > 0) { TXT(ctx, '{g}' + this.msg, 6, y + 2); return; }
      const admin = G.state.admin, act = {
        [QUEST_TAB]: QMODES[(this.qmode + 1) % QMODES.length] === 'ACTIVE' ? 'quests' : QMODES[(this.qmode + 1) % QMODES.length] === '100%' ? '100% list' : 'rules',
        [MAP_TAB]: null, [ITEM_TAB]: 'set to X', [KEY_TAB]: 'use', [PEOPLE_TAB]: 'bring along',
        [COLL_TAB]: this.photoView ? 'put away' : !this.coll ? 'open' : this.coll === 'rocks' ? 'next area' : 'look',
        [SAVE_TAB]: admin ? (this.admList ? 'go' : 'do it') : 'save here',
      }[this.tab];
      const pairs = act ? [['Z', act]] : [['↑↓←→', 'look around']];
      if (this.tab === COLL_TAB && this.coll && !this.photoView) pairs.push(['X', 'back']);
      else if (!admin && !(this.tab === COLL_TAB && this.photoView)) pairs.push(['X', 'quick save']);
      else if (this.tab === SAVE_TAB && this.admList) pairs.push(['X', 'back']);
      pairs.push(['Q/E', 'pages'], ['ENTER', 'close']);
      let x = 5;
      for (const [key, label] of pairs) {
        const w = F().width(key) + 6 + 3 + F().width(label);
        if (x + w > G.W - 4) break;
        x += keycap(ctx, x, y, key) + 3;
        TXT(ctx, label, x, y + 2, C.soft);
        x += F().width(label) + 8;
      }
    }

    drawTabs(ctx) {
      const names = TABS.map((n, i) => (i === SAVE_TAB && G.state.admin ? 'ADMIN' : n));
      const icons = ['quests', 'map', 'items', 'keys', 'people', 'collect', G.state.admin ? 'admin' : 'save'];
      const wOf = (i) => (i === this.tab ? 9 + 5 + F().width(names[i]) + 8 : 17);
      const gap = 2, total = names.reduce((a, _, i) => a + wOf(i), 0) + gap * (names.length - 1);
      let x = Math.round((G.W - total) / 2);
      keycap(ctx, x - 13, 5, 'Q');
      names.forEach((n, i) => {
        const on = i === this.tab, w = wOf(i);
        const blink = on && this.onTabs && (G.tick >> 4) & 1;
        const style = on ? (blink ? { bg: '#5a4878', border: '#ffffff', inner: '#7a6a30' } : SEL) : { bg: '#1a1428', border: '#5a5078', inner: '#262038' };
        G.box(ctx, x, on ? 1 : 3, w, on ? 17 : 14, style);
        if (!on) ctx.globalAlpha *= 0.55;
        ctx.drawImage(icon(icons[i]), x + 4, on ? 5 : 6);
        if (!on) ctx.globalAlpha /= 0.55;
        if (on) TXT(ctx, n, x + 16, 6, C.gold);
        // a gold dot on QUESTS while there's something new on it
        if (i === QUEST_TAB && !on && G.state.questNew && Object.keys(G.state.questNew).length) {
          ctx.fillStyle = SH; ctx.fillRect(x + w - 5, 2, 5, 5);
          ctx.fillStyle = C.gold; ctx.fillRect(x + w - 4, 3, 3, 3);
        }
        x += w + gap;
      });
      keycap(ctx, x + 2, 5, 'E');
    }

    // ---- QUESTS: how far along, the main quest, and everything on the go
    drawQuests(ctx) {
      const s = G.state, f = s.flags, j = G.journal();
      if (s.questNew && Object.keys(s.questNew).length) s.questNew = {};
      // across the top: the main quest
      const goal = F().wrap(j.goal, 220).slice(0, 3), mh = 13 + goal.length * 9 + 2;
      card(ctx, 5, 21, 230, mh);
      TXT(ctx, 'MAIN QUEST', 10, 24, C.gold);
      TXT(ctx, j.chapter, 230 - F().width(j.chapter), 24, C.cyan);
      goal.forEach((l, i) => TXT(ctx, l, 10, 34 + i * 9));
      const y0 = 21 + mh + 3, h0 = 142 - y0;

      // left: the completion ring and a few numbers
      const LX = 5, LW = 66;
      card(ctx, LX, y0, LW, h0);
      const pct = G.completionPct(), full = pct >= 100, rg = ring(pct / 100, full);
      const rx = LX + Math.round((LW - rg.width) / 2), ry = y0 + 3;
      ctx.drawImage(rg, rx, ry);
      const pt = (full ? '100' : G.sayable(pct)) + '%', bw = F().bigWidth(pt, 1);
      F().drawBig(ctx, pt, rx + Math.round((rg.width - bw) / 2), ry + Math.round(rg.width / 2) - 4, 1, (yy) => (yy < 3 ? '#fff4c0' : full ? '#78e070' : '#f8d850'), '#1c1424');
      const lbl = full ? (f.fcBeaten ? 'ALL DONE!' : 'COMPLETE!') : 'COMPLETE';
      TXT(ctx, lbl, LX + Math.round((LW - F().width(lbl)) / 2), ry + rg.height + 1, full ? C.green : C.dim);
      // rocks and teeth side by side, then hearts, then play time on its own line if it needs the room
      const time = G.playTimeText(s.playTime), sy = ry + rg.height + 12, bottom = y0 + h0 - 2;
      const cells = [[icon('rocks'), G.sayable(G.rocksFound()), 0, 0], [G.spr.tooth, G.sayable(s.teeth), 1, 0], [G.spr.heart.full, G.sayable(s.maxHp / 2), 0, 1]];
      if (F().width(time) <= 19) cells.push([icon('clock'), time, 1, 1]);
      else if (sy + 30 <= bottom) cells.push([icon('clock'), time, 0, 2]);
      else cells.splice(2, 1, [icon('clock'), time, 0, 1]);
      ctx.fillStyle = '#3e3460'; ctx.fillRect(LX + 4, sy - 2, LW - 8, 1);
      cells.forEach(([im, val, col, row]) => {
        const x = LX + 4 + col * 31, y = sy + 1 + row * 10;
        ctx.drawImage(im, x, y + Math.round((7 - Math.min(9, im.height)) / 2));
        TXT(ctx, fit(val, col ? 20 : row === 2 || (row === 1 && cells.length === 3) ? 48 : 20), x + 10, y, C.gold);
      });

      // right: the list (quests / the 100% checklist / Abe's Rules)
      const RX = 74, RW = 161, ly = y0, lh = h0;
      const rows = this.questRows();
      card(ctx, RX, ly, RW, lh);
      let cx = RX + 3;
      QMODES.forEach((m, i) => {
        const label = m === 'ACTIVE' ? 'QUESTS' : m, w = F().width(label) + 8, on = i === this.qmode;
        ctx.fillStyle = on ? '#4a3a70' : '#221a36'; ctx.fillRect(cx, ly + 2, w, 11);
        if (on) { ctx.fillStyle = C.gold; ctx.fillRect(cx, ly + 12, w, 1); }
        TXT(ctx, label, cx + 4, ly + 4, on ? C.gold : C.faint);
        cx += w + 2;
      });
      const count = this.qmode === 0 ? G.sayable(rows.filter((q) => q.kind === 'active').length) + ' active'
        : this.qmode === 1 ? G.sayable(G.completion().filter((c) => c[1]).length) + '/' + G.completion().length : '';
      if (count) TXT(ctx, count, RX + RW - 5 - F().width(count), ly + 4, C.dim);
      ctx.fillStyle = '#3e3460'; ctx.fillRect(RX + 1, ly + 14, RW - 2, 1);

      if (this.qmode === 2) { this.drawRules(ctx, RX, ly, RW, lh); return; }
      const detail = this.qmode === 0 && rows.length ? 21 : 0;
      const top = ly + 17, RH = 10, vis = Math.max(1, Math.floor((lh - 18 - detail) / RH));
      this.qsel = Math.min(this.qsel, Math.max(0, rows.length - 1));
      if (this.qsel < this.qscroll) this.qscroll = this.qsel;
      if (this.qsel >= this.qscroll + vis) this.qscroll = this.qsel - vis + 1;
      if (!rows.length) { F().wrap('No side quests yet. Talk to people!', RW - 16).forEach((l, i) => TXT(ctx, l, RX + 8, top + 2 + i * 9, C.dim)); return; }
      const check = (x, y, col) => { ctx.fillStyle = col; ctx.fillRect(x, y + 3, 1, 1); ctx.fillRect(x + 1, y + 4, 1, 1); ctx.fillRect(x + 2, y + 3, 1, 1); ctx.fillRect(x + 3, y + 2, 1, 1); ctx.fillRect(x + 4, y + 1, 1, 1); };
      rows.slice(this.qscroll, this.qscroll + vis).forEach((q, k) => {
        const i = this.qscroll + k, y = top + k * RH, sel = i === this.qsel && !this.onTabs;
        if (sel) { ctx.fillStyle = '#3a3058'; ctx.fillRect(RX + 2, y - 2, RW - 4, RH); cursor(ctx, RX + 3, y - 1); }
        if (this.qmode === 1) {
          // the 100% checklist
          const bx = RX + 10;
          ctx.fillStyle = '#0c0814'; ctx.fillRect(bx, y - 1, 7, 7);
          ctx.fillStyle = q.ok ? '#2a5a28' : '#2a2240'; ctx.fillRect(bx + 1, y, 5, 5);
          if (q.ok) check(bx + 1, y - 1, C.green);
          const extra = q.name === 'Every rock' ? G.sayable(G.rocksFound()) + '/' + G.ROCKS.length
            : q.name === 'Every photo' ? G.sayable(G.photosFound()) + '/' + G.PHOTOS.length : q.ok ? 'Done' : '';
          TXT(ctx, fit(q.name, RW - 30 - F().width(extra)), bx + 11, y - 1, q.ok ? C.dim : '#f8f8f0');
          if (extra) TXT(ctx, extra, RX + RW - 6 - F().width(extra), y - 1, q.ok ? C.green : C.gold);
          return;
        }
        // a side quest: ! active, ? rumor, a check when it's done
        const col = q.kind === 'active' ? C.gold : q.kind === 'rumor' ? C.cyan : C.green;
        // new since the last look: the bullet twinkles pink now and then
        if (this.fresh[q.name] && q.kind !== 'done' && (G.tick >> 4) % 3 === 2) sparkle(ctx, RX + 11, y - 1);
        else if (q.kind === 'done') check(RX + 11, y - 1, col);
        else TXT(ctx, q.kind === 'active' ? '!' : '?', RX + 12, y - 1, col);
        const sw = F().width(q.status), room = RW - 26 - sw;
        // a little progress bar if there's room for it next to the name
        const showBar = q.prog && q.kind === 'active' && F().width(q.name) <= room - 22;
        TXT(ctx, fit(q.name, room), RX + 19, y - 1, q.kind === 'done' ? C.dim : q.kind === 'rumor' ? C.cyan : '#f8f8f0');
        if (showBar) bar(ctx, RX + RW - 6 - sw - 22, y, 18, 5, q.prog[0] / q.prog[1], C.gold);
        TXT(ctx, q.status, RX + RW - 5 - sw, y - 1, q.kind === 'done' ? C.green : q.kind === 'rumor' ? C.dim : C.soft);
      });
      // scroll marks
      ctx.fillStyle = C.dim;
      if (this.qscroll > 0) { ctx.fillRect(RX + RW - 9, top - 2, 5, 1); ctx.fillRect(RX + RW - 8, top - 3, 3, 1); ctx.fillRect(RX + RW - 7, top - 4, 1, 1); }
      if (this.qscroll + vis < rows.length) { const by = top + vis * RH - 2; ctx.fillRect(RX + RW - 9, by, 5, 1); ctx.fillRect(RX + RW - 8, by + 1, 3, 1); ctx.fillRect(RX + RW - 7, by + 2, 1, 1); }
      // what to do about the quest under the cursor
      if (detail) {
        const q = rows[this.qsel], dy = ly + lh - detail;
        ctx.fillStyle = '#3e3460'; ctx.fillRect(RX + 1, dy, RW - 2, 1);
        ctx.fillStyle = '#181228'; ctx.fillRect(RX + 1, dy + 1, RW - 2, detail - 2);
        const hint = F().wrap((q.where ? '{c}' + q.where + ':{/} ' : '') + (q.hint || ''), RW - 10).slice(0, 2);
        hint.forEach((l, i) => TXT(ctx, l, RX + 5, dy + 3 + i * 8, C.soft));
        // and a NEW badge sitting on the box's top edge
        if (this.fresh[q.name] && q.kind !== 'done') {
          const bw = F().width('NEW') + 6, bx = RX + RW - bw - 14;
          ctx.fillStyle = SH; ctx.fillRect(bx - 1, dy - 5, bw + 2, 11);
          ctx.fillStyle = '#c83878'; ctx.fillRect(bx, dy - 4, bw, 9);
          ctx.fillStyle = C.pink; ctx.fillRect(bx, dy - 4, bw, 1);
          F().draw(ctx, 'NEW', bx + 3, dy - 3, '#ffffff');
        }
      }
    }

    // Abe's Rules, and how they're going
    drawRules(ctx, x, y, w, h) {
      const s = G.state;
      TXT(ctx, 'ABE\'S RULES', x + 6, y + 18, '#ffa848');
      let ry = y + 28;
      for (const r of ['1. Nate and Lily may not say the sacred number.', '2. Abe is the Master. See rule 1.']) for (const l of F().wrap(r, w - 14)) { TXT(ctx, l, x + 8, ry); ry += 8; }
      ry += 3;
      ctx.fillStyle = '#3e3460'; ctx.fillRect(x + 4, ry - 2, w - 8, 1);
      for (const [label, val, col] of [['Slips', s.stats.slips, C.red], ['Sacred numbers bonked', s.stats.sixes || 0, C.gold], ['Pins', s.stats.pins || 0, C.gold]]) {
        if (ry + 8 > y + h - 2) break;
        TXT(ctx, label, x + 8, ry, C.soft);
        const v = G.sayable(val);
        TXT(ctx, v, x + w - 8 - F().width(v), ry, col);
        ry += 9;
      }
    }

    // ---- MAP: the road trip so far
    drawMap(ctx) {
      const s = G.state, j = G.journal(), here = G.play.world && placeOf(G.play.world.id), main = mainPlace();
      const MX = 5, MY = 21, MW = 140, MH = 121;
      const total = PLACES.reduce((n, pl) => n + pl.maps.length, 0), been = PLACES.reduce((n, pl) => n + pl.maps.filter(([id]) => beenTo(id)).length, 0);
      card(ctx, MX, MY, MW, MH, 'MAP', C.gold, G.sayable(been) + '/' + G.sayable(total) + ' places', C.dim);
      // the land, with a speckle, and the bay down at the bottom
      ctx.save(); ctx.beginPath(); ctx.rect(MX + 1, MY + 14, MW - 2, MH - 15); ctx.clip();
      ctx.fillStyle = '#1a2a22'; ctx.fillRect(MX + 1, MY + 14, MW - 2, MH - 15);
      ctx.fillStyle = '#22362a';
      for (let yy = MY + 16; yy < MY + MH; yy += 6) for (let xx = MX + 3 + (yy % 12 ? 3 : 0); xx < MX + MW; xx += 6) ctx.fillRect(xx, yy, 1, 1);
      ctx.fillStyle = '#152040';
      ctx.fillRect(MX + 50, MY + 86, 50, 36); ctx.fillRect(MX + 58, MY + 80, 34, 6); ctx.fillRect(MX + 42, MY + 96, 8, 26); ctx.fillRect(MX + 100, MY + 104, 8, 18);
      ctx.fillStyle = '#28407a';
      for (let k = 0; k < 9; k++) { const wx = MX + 52 + ((k * 23 + (G.tick >> 3)) % 46), wy = MY + 88 + ((k * 7) % 30); ctx.fillRect(wx, wy, 3, 1); }
      ctx.restore();
      // roads (dim when they lead somewhere Nate can't go yet)
      for (const [a, b] of ROADS) {
        const A = placeById(a), B = placeById(b), open = placeOpen(A) && placeOpen(B);
        const n = Math.ceil(Math.hypot(B.x - A.x, B.y - A.y) / 3);
        ctx.fillStyle = open ? '#b89868' : '#3e3a50';
        for (let i = 3; i < n - 2; i++) ctx.fillRect(MX + Math.round(A.x + ((B.x - A.x) * i) / n), MY + Math.round(A.y + ((B.y - A.y) * i) / n), 1, 1);
      }
      // the places
      const quests = (pl) => j.side.filter((q) => q.kind !== 'done' && q.where && q.where.includes(pl.key));
      PLACES.forEach((pl, i) => {
        const x = MX + pl.x, y = MY + pl.y, open = placeOpen(pl), seen = placeVisited(pl), sel = i === this.msel && !this.onTabs;
        const rim = sel ? ((G.tick >> 3) & 1 ? '#ffffff' : C.gold) : pl === here ? C.green : open ? '#8a80a8' : '#3e3a50';
        badge(ctx, x, y, rim, open ? '#2a2240' : '#1a1428');
        if (open) { if (!seen) ctx.globalAlpha *= 0.5; ctx.drawImage(icon(pl.icon), x - 4, y - 4); if (!seen) ctx.globalAlpha /= 0.5; }
        else TXT(ctx, '?', x - 1, y - 3, '#5a5078');
        const label = open ? pl.name : '???';
        TXT(ctx, label, x - Math.floor(F().width(label) / 2), y + 10, sel ? C.gold : seen ? '#f8f8f0' : C.dim);
        // quest markers: ! for quests, ? for rumors; a star where the main quest is headed
        const qs = quests(pl);
        if (qs.length) {
          const act = qs.some((q) => q.kind === 'active'), mx = x + 5, my = y - 9;
          ctx.fillStyle = SH; ctx.fillRect(mx - 1, my - 1, 7, 9);
          ctx.fillStyle = act ? C.gold : C.cyan; ctx.fillRect(mx, my, 5, 7);
          F().draw(ctx, act ? '!' : '?', mx + 3 - Math.ceil(F().width(act ? '!' : '?') / 2), my, '#1c1424');
        }
        if (pl.id === main && open) {
          const sx = x - 11, sy = y - 10, tw = (G.tick >> 4) & 1;
          ctx.fillStyle = SH; ctx.fillRect(sx + 1, sy - 1, 3, 7); ctx.fillRect(sx - 1, sy + 1, 7, 3);
          ctx.fillStyle = tw ? '#fff4c0' : C.gold; ctx.fillRect(sx + 2, sy, 1, 5); ctx.fillRect(sx, sy + 2, 5, 1); ctx.fillRect(sx + 1, sy + 1, 3, 3);
        }
      });
      // Nate's head bobbing over wherever he is
      if (here) {
        const img = G.nateSprites().down[0], bob = Math.round(Math.sin(G.tick / 9) * 1.5);
        ctx.drawImage(img, 0, 0, 16, 11, MX + here.x - 8, MY + here.y - 21 + bob, 16, 11);
      }

      // right: about the place under the cursor
      const pl = PLACES[this.msel], open = placeOpen(pl), RX = 148, RW = 87;
      card(ctx, RX, MY, RW, MH, open ? pl.name : '???', C.gold);
      let y = MY + 17;
      if (pl === here) { TXT(ctx, 'YOU ARE HERE', RX + 6, y, C.green); y += 10; }
      if (pl.id === 'ditch') {
        const msg = open ? 'The Number One Ditch, in Chesapeake. Father Eggmas is waiting. (More story soon!)' : 'Somewhere far to the south...';
        F().wrap(msg, RW - 12).forEach((l) => { TXT(ctx, l, RX + 6, y, C.soft); y += 9; });
      } else if (!open) {
        F().wrap('Nate can\'t get here yet.', RW - 12).forEach((l) => { TXT(ctx, l, RX + 6, y, C.dim); y += 9; });
      } else {
        for (const [id, name] of pl.maps) {
          const wid = G.play.world && G.play.world.id, b = beenTo(id);
          const cur = wid === id || (id === 'arena' && wid === 'ring') || (id === 'home' && wid === 'goldenHour');
          if (b) { ctx.fillStyle = cur ? C.green : '#5a5078'; ctx.fillRect(RX + 7, y + 2, 3, 3); }
          else { ctx.fillStyle = '#3e3a50'; ctx.fillRect(RX + 8, y + 3, 1, 1); }
          TXT(ctx, b ? fit(name, RW - 18) : '???', RX + 13, y, b ? (cur ? C.green : '#f8f8f0') : C.faint);
          y += 9;
        }
      }
      // what's going on there
      const qs = open ? quests(pl) : [], act = qs.filter((q) => q.kind === 'active').length, rum = qs.length - act;
      let by = MY + MH - 6 - 9 * ((act ? 1 : 0) + (rum ? 1 : 0) + (pl.id === main && open ? 1 : 0));
      if (by < y + 2) by = y + 2;
      if (by < MY + MH - 6) { ctx.fillStyle = '#3e3460'; ctx.fillRect(RX + 4, by - 3, RW - 8, 1); }
      if (pl.id === main && open) { TXT(ctx, 'Main quest', RX + 6, by, C.gold); by += 9; }
      if (act) { TXT(ctx, '! ' + G.sayable(act) + (act === 1 ? ' quest' : ' quests'), RX + 6, by, C.gold); by += 9; }
      if (rum) { TXT(ctx, '? ' + G.sayable(rum) + (rum === 1 ? ' rumor' : ' rumors'), RX + 6, by, C.cyan); }
    }

    // ---- ITEMS and KEYS: a grid of slots and the details of the one selected
    drawGrid(ctx) {
      const s = G.state, slots = this.slots(), keys = this.tab === KEY_TAB;
      card(ctx, 5, 21, 104, 121, keys ? 'KEY ITEMS' : 'GEAR', C.gold, keys ? G.sayable(slots.filter(Boolean).length) + ' held' : null, C.dim);
      slots.forEach((id, i) => {
        const x = 11 + (i % COLS) * 24, y = 38 + Math.floor(i / COLS) * 24;
        const sel = i === this.sel && !this.onTabs;
        slot(ctx, x, y, 22, 22, sel ? '#7a6a30' : undefined);
        if (id && G.itemHas(id)) {
          const ic = G.ITEMS[id].icon();
          if (ic) ctx.drawImage(ic, x + 11 - Math.floor(ic.width / 2), y + 11 - Math.floor(ic.height / 2));
          const n = G.itemCount(id);
          if (n != null) TXT(ctx, G.sayable(n), x + 21 - F().width(G.sayable(n)), y + 13);
          if (s.xItem === id || id === 'hammer') { const b = id === 'hammer' ? 'Z' : 'X'; ctx.fillStyle = '#0c0814'; ctx.fillRect(x + 1, y + 1, 7, 9); ctx.fillStyle = C.gold; ctx.fillRect(x + 1, y + 1, 6, 8); F().draw(ctx, b, x + 2, y + 2, '#282030'); }
        } else if (id) TXT(ctx, '?', x + 9, y + 7, C.faint);
        if (sel) brackets(ctx, x - 1, y - 1, 24, 24);
      });
      // what's on the buttons
      if (!keys) {
        const xi = s.xItem && G.ITEMS[s.xItem];
        let y = 113;
        keycap(ctx, 11, y, 'Z'); TXT(ctx, fit('Rock Hammer', 80), 23, y + 2, C.gold);
        y += 13;
        keycap(ctx, 11, y, 'X'); TXT(ctx, xi ? fit(xi.short || xi.name, 80) : '{d}(nothing)', 23, y + 2, C.gold);
      } else {
        TXT(ctx, 'Z on an item to use it.', 11, 116, C.dim);
        TXT(ctx, 'Some can be read.', 11, 126, C.dim);
      }
      // details
      const id = slots[this.sel];
      card(ctx, 112, 21, 123, 121);
      if (!id) { TXT(ctx, '{d}Empty. For now.', 118, 28); return; }
      if (!G.itemHas(id)) { TXT(ctx, '???', 118, 28, C.cyan); F().wrap('You haven\'t found this yet.', 110).forEach((l, i) => TXT(ctx, l, 118, 40 + i * 9, C.dim)); return; }
      const def = G.ITEMS[id], ic = def.icon();
      slot(ctx, 117, 26, 38, 34);
      if (ic) ctx.drawImage(ic, 136 - ic.width, 43 - ic.height, ic.width * 2, ic.height * 2);
      F().wrap(def.name, 76).slice(0, 3).forEach((l, i) => TXT(ctx, l, 159, 28 + i * 9, C.cyan));
      const n = G.itemCount(id);
      if (n != null) TXT(ctx, 'x' + G.sayable(n), 159, 52, C.gold);
      ctx.fillStyle = '#3e3460'; ctx.fillRect(116, 64, 115, 1);
      if (id !== 'pipe') { F().wrap(G.itemDesc(id), 112).slice(0, 7).forEach((l, i) => TXT(ctx, l, 118, 68 + i * 10)); return; }
      // Dad's pipe: its songbook (the pipe itself doesn't show them, so learn them here)
      F().wrap(G.itemDesc(id), 112).slice(0, 2).forEach((l, i) => TXT(ctx, l, 118, 68 + i * 10));
      const known = G.SIGNALS.filter((sg) => sg.known()).length, tally = G.sayable(known) + '/' + G.sayable(G.SIGNALS.length);
      TXT(ctx, 'SONGS', 118, 91, C.gold);
      TXT(ctx, tally, 231 - F().width(tally), 91, C.dim);
      G.SIGNALS.forEach((sg, i) => {
        const y = 102 + i * 10;
        if (!sg.known()) { TXT(ctx, '???', 118, y, C.faint); return; }
        const a = G.arrows(sg.seq);
        TXT(ctx, fit(sg.name, 108 - F().width(a)), 118, y, C.cyan);
        TXT(ctx, a, 231 - F().width(a), y);
      });
    }

    // ---- PEOPLE: the party and everyone important Nate has met
    drawPeople(ctx) {
      const list = G.people(), VIS = 5;
      this.sel = Math.min(this.sel, list.length - 1);
      this.scroll = this.scroll || 0;
      if (this.sel < this.scroll) this.scroll = this.sel;
      if (this.sel >= this.scroll + VIS) this.scroll = this.sel - VIS + 1;
      const portrait = (p) => (p.img ? p.img() : (p.id === 'nate' ? G.nateSprites() : G.sprites[p.id]).down[0]);
      card(ctx, 5, 21, 92, 121, 'PEOPLE', C.gold, G.sayable(G.state.party.length) + '/5', C.dim);
      list.slice(this.scroll, this.scroll + VIS).forEach((p, k) => {
        const i = this.scroll + k, y = 37 + k * 21, sel = i === this.sel && !this.onTabs;
        if (sel) { ctx.fillStyle = '#3a3058'; ctx.fillRect(7, y - 1, 88, 20); ctx.fillStyle = C.gold; ctx.fillRect(7, y - 1, 2, 20); }
        slot(ctx, 11, y, 18, 18, sel ? '#7a6a30' : undefined);
        const img = portrait(p), face = p.known ? img : silhouette(img);
        // head-and-shoulders crop (centered for wider sprites like Eggmas)
        ctx.drawImage(face, Math.max(0, Math.round((img.width - 16) / 2)), 0, 16, 16, 12, y + 1, 16, 16);
        TXT(ctx, fit(p.name, 60), 33, y + 2, p.known ? '#f8f8f0' : C.faint);
        if (G.with(p.id)) TXT(ctx, 'following', 33, y + 10, C.green);
        else if (p.id === 'nate') TXT(ctx, 'leader', 33, y + 10, C.gold);
      });
      ctx.fillStyle = C.dim;
      if (this.scroll > 0) { ctx.fillRect(88, 36, 5, 1); ctx.fillRect(89, 35, 3, 1); ctx.fillRect(90, 34, 1, 1); }
      if (this.scroll + VIS < list.length) { ctx.fillRect(88, 139, 5, 1); ctx.fillRect(89, 140, 3, 1); ctx.fillRect(90, 141, 1, 1); }

      const p = list[this.sel];
      card(ctx, 100, 21, 135, 121);
      const img = portrait(p), big = p.known ? img : silhouette(img);
      slot(ctx, 104, 25, 38, 52);
      if (p.img) ctx.drawImage(big, 123 - Math.round(img.width / 2), 75 - img.height);
      else ctx.drawImage(big, 123 - img.width, 75 - img.height * 2, img.width * 2, img.height * 2);
      const nameLines = F().wrap(p.name, 86).slice(0, 2);
      nameLines.forEach((l, i) => TXT(ctx, l, 146, 28 + i * 10, C.gold));
      F().wrap(p.tag || '', 86).slice(0, 2).forEach((l, i) => TXT(ctx, l, 146, 30 + nameLines.length * 10 + i * 9));
      if (!p.known) return;
      ctx.fillStyle = '#3e3460'; ctx.fillRect(104, 81, 127, 1);
      // bio, then the ability under it (8px lines so it all fits)
      const bio = F().wrap(p.bio, 124), skill = p.skill ? F().wrap('{o}Ability:{/} ' + p.skill, 124).slice(0, 2) : [];
      const room = Math.floor((140 - 84) / 8) - skill.length;
      bio.slice(0, room).forEach((l, i) => TXT(ctx, l, 106, 84 + i * 8));
      skill.forEach((l, i) => TXT(ctx, l, 106, 84 + (Math.min(bio.length, room) + i) * 8 + 1));
    }

    // ---- COLLECTABLES: a list of sections (rocks, photos), each with its own page
    drawCollect(ctx) {
      if (this.coll === 'rocks') this.drawRocks(ctx);
      else if (this.coll === 'photos') this.drawPhotos(ctx);
      else this.drawCollectList(ctx);
      if (this.photoView) ctx.drawImage(G.photoPage(this.photoView), 0, 0);
    }
    drawCollectList(ctx) {
      card(ctx, 5, 21, 112, 121, 'COLLECTABLES');
      COLLECTIONS.forEach((c, i) => {
        const y = 39 + i * 26, sel = i === this.sel && !this.onTabs, [have, all] = c.count();
        G.box(ctx, 9, y, 104, 22, sel ? SEL : { bg: '#1a1428', border: '#3e3460', inner: '#262038' });
        ctx.drawImage(icon(c.icon), 14, y + 6);
        TXT(ctx, c.name, 27, y + 4, sel ? C.gold : C.soft);
        bar(ctx, 27, y + 14, 50, 5, have / all, have >= all ? C.green : C.cyan);
        TXT(ctx, G.sayable(have) + '/' + G.sayable(all), 81, y + 12, C.gold);
        if (sel) cursor(ctx, 3, y + 8);
      });
      const c = COLLECTIONS[this.sel];
      card(ctx, 120, 21, 115, 121, c.name, C.cyan);
      F().wrap(c.blurb, 104).slice(0, 8).forEach((l, i) => TXT(ctx, l, 125, 40 + i * 9, C.soft));
    }

    // ---- PHOTOS: thumbnails on the left, the one you're on at the right
    drawPhotos(ctx) {
      const has = (ph) => G.photoHas(ph.id);
      card(ctx, 5, 21, 112, 121, 'PHOTOS', C.gold, G.sayable(G.photosFound()) + '/' + G.sayable(G.PHOTOS.length));
      G.PHOTOS.forEach((ph, i) => {
        const x = 11 + (i % PCOLS) * 35, y = 39 + Math.floor(i / PCOLS) * 46, sel = i === this.sel && !this.onTabs;
        slot(ctx, x, y, 32, 44, has(ph) ? '#d8d4c8' : undefined);
        if (has(ph) && ph.img.complete && ph.img.naturalWidth) { ctx.imageSmoothingEnabled = true; fitImage(ctx, ph.img, x + 2, y + 2, 28, 40); ctx.imageSmoothingEnabled = false; }
        else TXT(ctx, '?', x + 14, y + 18, C.faint);
        if (sel) brackets(ctx, x - 1, y - 1, 34, 46);
      });
      const ph = G.PHOTOS[this.sel];
      card(ctx, 120, 21, 115, 121);
      if (!ph) return;
      if (!has(ph)) {
        TXT(ctx, '???', 125, 27, C.cyan);
        TXT(ctx, ph.place, 125, 37, C.dim);
        ctx.fillStyle = '#3e3460'; ctx.fillRect(124, 48, 107, 1);
        F().wrap(ph.how, 104).slice(0, 8).forEach((l, i) => TXT(ctx, l, 125, 52 + i * 9, C.dim));
        return;
      }
      TXT(ctx, ph.name, 125, 27, C.cyan);
      TXT(ctx, ph.place, 125, 37, C.dim);
      ctx.fillStyle = '#3e3460'; ctx.fillRect(124, 48, 107, 1);
      F().wrap(ph.caption, 104).slice(0, 9).forEach((l, i) => TXT(ctx, l, 125, 52 + i * 9, C.soft));
    }

    // ---- ROCKS: every specimen Nate has found, a page for each area
    areaRocks() { const a = G.ROCK_AREAS[this.rockArea || 0]; return G.ROCKS.filter((r) => r.area === a.id); }
    drawRocks(ctx) {
      const s = G.state, rocks = this.areaRocks(), found = (r) => s.rocksFound && s.rocksFound[r.id];
      const area = G.ROCK_AREAS[this.rockArea || 0], here = rocks.filter(found).length;
      card(ctx, 5, 21, 112, 121);
      // the area, with arrows to the others
      const head = area.name, hw = F().width(head);
      TXT(ctx, '<', 9, 25, C.dim); TXT(ctx, '>', 109, 25, C.dim);
      TXT(ctx, head, 61 - Math.round(hw / 2), 25, C.cyan);
      ctx.fillStyle = '#3e3460'; ctx.fillRect(6, 35, 110, 1);
      rocks.forEach((r, i) => {
        const x = 10 + (i % RCOLS) * 21, y = 39 + Math.floor(i / RCOLS) * 21;
        const sel = i === this.sel && !this.onTabs;
        slot(ctx, x, y, 20, 20, found(r) ? G.RARITY[r.r].color : undefined);
        if (found(r)) {
          ctx.drawImage(G.spr.rockIcons[r.id], x + 3, y + 4);
          const n = (s.rocks && s.rocks[r.id]) || 0;
          if (n) TXT(ctx, G.sayable(n), x + 19 - F().width(G.sayable(n)), y + 12);
        } else TXT(ctx, '?', x + 8, y + 6, C.faint);
        if (sel) brackets(ctx, x - 1, y - 1, 22, 22);
      });
      const ty = 39 + Math.ceil(rocks.length / RCOLS) * 21 + 3;
      TXT(ctx, 'Here', 10, ty, C.soft); bar(ctx, 34, ty + 1, 50, 5, here / rocks.length, C.cyan); TXT(ctx, G.sayable(here) + '/' + rocks.length, 88, ty, C.gold);
      TXT(ctx, 'All', 10, ty + 10, C.soft); bar(ctx, 34, ty + 11, 50, 5, G.rocksFound() / G.ROCKS.length, C.gold); TXT(ctx, G.sayable(G.rocksFound()) + '/' + G.ROCKS.length, 88, ty + 10, C.gold);
      // outside Andover, a rock you've found shows how to get another
      const cur = rocks[this.sel], room = Math.floor((140 - (ty + 23)) / 9);
      if (room > 0) {
        const tip = area.id !== 'andover' && cur && found(cur) && cur.how ? cur.how : 'Crush them at Van Wickle.';
        F().wrap(tip, 102).slice(0, room).forEach((l, i) => TXT(ctx, l, 10, ty + 23 + i * 9, C.dim));
      }
      // details
      const r = rocks[this.sel];
      card(ctx, 120, 21, 115, 121);
      if (!r) return;
      const rar = G.RARITY[r.r];
      if (!found(r)) {
        TXT(ctx, '???', 125, 27, C.cyan);
        TXT(ctx, rar.name, 125, 37, rar.color);
        ctx.fillStyle = '#3e3460'; ctx.fillRect(124, 48, 107, 1);
        F().wrap(r.how || 'Not found yet. Keep exploring the Andover mines.', 104).slice(0, 8).forEach((l, i) => TXT(ctx, l, 125, 52 + i * 9, C.dim));
        return;
      }
      slot(ctx, 124, 25, 32, 28, rar.color);
      ctx.drawImage(G.spr.rockIcons[r.id], 126, 27, 28, 24);
      F().wrap(r.name, 72).slice(0, 2).forEach((l, i) => TXT(ctx, l, 159, 26 + i * 9, C.cyan));
      TXT(ctx, rar.name, 159, r.name.length > 12 ? 45 : 36, rar.color);
      ctx.fillStyle = '#3e3460'; ctx.fillRect(124, 56, 107, 1);
      TXT(ctx, 'Have {y}' + G.sayable((s.rocks && s.rocks[r.id]) || 0) + '{/}   Found {y}' + G.sayable(s.rocksFound[r.id]), 125, 60);
      const g = r.crush;
      const crush = !g ? '{r}Never. Museum piece.' : g.teeth ? '{y}+' + G.sayable(g.teeth) + ' teeth' : g.eggs ? '{y}A dozen eggs' : g.package ? '{y}2 packages' : '{r}Heart container!';
      TXT(ctx, 'Crusher: ' + crush, 125, 70);
      const first = r.fact.split(/(?<=\.) /)[0];
      F().wrap(first, 104).slice(0, 6).forEach((l, i) => TXT(ctx, l, 125, 82 + i * 9, C.soft));
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
      const head = this.admList === 'cp' ? 'JUMP TO A CHECKPOINT' : this.admList === 'place' ? 'GO TO A PLACE' : 'ADMIN (TESTING)';
      card(ctx, 5, 21, 230, 121, head, C.pink, this.admList ? null : 'nothing is saved', C.dim);
      rows.slice(this.scroll, this.scroll + VIS).forEach((r, k) => {
        const i = this.scroll + k, y = 38 + k * 10, on = i === this.sel && !this.onTabs;
        if (on) { ctx.fillStyle = '#3a3058'; ctx.fillRect(7, y - 2, 226, 10); cursor(ctx, 9, y); }
        TXT(ctx, r, 16, y, on ? C.gold : '#f8f8f0');
      });
    }

    // three save files; the one being played is marked
    drawSave(ctx) {
      const cur = G.state.slot || 1;
      for (let i = 0; i < G.SAVE_FILES; i++) {
        G.drawFileCard(ctx, 6, 22 + i * 40, 228, G.readSave(i + 1), i + 1, i === this.sel && !this.onTabs, i + 1 === cur);
      }
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
    ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(x + 2, y + 2, w, 36);
    ctx.fillStyle = sel ? '#f8d850' : '#5a5078'; ctx.fillRect(x + 1, y, w - 2, 36); ctx.fillRect(x, y + 1, w, 34);
    ctx.fillStyle = sel ? '#2c2448' : '#1e1830'; ctx.fillRect(x + 1, y + 1, w - 2, 34);
    ctx.fillStyle = sel ? '#3a3058' : '#2a2240'; ctx.fillRect(x + 1, y + 1, 42, 34);
    TXT(ctx, 'FILE', x + 9, y + 6, sel ? '#f8d850' : '#c8c0d8');
    F().drawBig(ctx, String(n), x + 17, y + 16, 2, sel ? '#f8d850' : '#9890a8', '#1c1424');
    if (current) { ctx.fillStyle = '#78e070'; ctx.fillRect(x + 1, y + 34, w - 2, 1); TXT(ctx, '{g}playing', x + w - 6 - F().width('playing'), y + 26); }
    if (!s) { TXT(ctx, '{d}- empty -', x + 54, y + 14); return; }
    const place = (G.MAPS[s.map] && G.MAPS[s.map].name) || '???';
    TXT(ctx, place, x + 48, y + 5, '#78e8e8');
    for (let i = 0; i < s.maxHp / 2; i++) {
      const v = s.hp - i * 2;
      ctx.drawImage(v >= 2 ? G.spr.heart.full : v === 1 ? G.spr.heart.half : G.spr.heart.empty, x + 48 + (i % 10) * 8, y + 15);
    }
    ctx.drawImage(G.spr.tooth, x + 48, y + 25);
    TXT(ctx, G.sayable(s.teeth), x + 58, y + 25);
    TXT(ctx, G.playTimeText(s.playTime), x + 84, y + 25, '#c8c0d8');
    s.party.forEach((id, i) => {
      const S = id === 'nate' ? (s.items.cap ? G.sprites.nate : G.sprites.nate_nocap) : G.sprites[id];
      if (S) ctx.drawImage(S.down[0], 0, 0, 16, 15, x + w - 22 - i * 16, y + 7, 16, 15);
    });
  };
})();
