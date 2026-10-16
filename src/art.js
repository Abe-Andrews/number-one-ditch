'use strict';
// All pixel art is generated here in code: characters, tiles, props, icons.

(function () {
  const OUT = '#1c1424';

  // ------------------------------------------------------------ color utils
  const rgbaCache = new Map();
  function rgba(hex) {
    let v = rgbaCache.get(hex);
    if (v) return v;
    const h = hex.slice(1);
    v = [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), h.length === 8 ? parseInt(h.slice(6, 8), 16) : 255];
    rgbaCache.set(hex, v);
    return v;
  }
  function shade(hex, amt) {
    const [r, g, b] = rgba(hex);
    const f = amt < 0 ? (c) => Math.round(c * (1 + amt)) : (c) => Math.round(c + (255 - c) * amt);
    return '#' + [f(r), f(g), f(b)].map((v) => v.toString(16).padStart(2, '0')).join('');
  }

  // ------------------------------------------------------------ pixel buffer
  class Pix {
    constructor(w, h) {
      this.w = w;
      this.h = h;
      this.d = new Array(w * h).fill(null);
    }
    set(x, y, c) {
      x = Math.floor(x); y = Math.floor(y);
      if (c && x >= 0 && y >= 0 && x < this.w && y < this.h) this.d[y * this.w + x] = c;
    }
    get(x, y) {
      return x >= 0 && y >= 0 && x < this.w && y < this.h ? this.d[y * this.w + x] : null;
    }
    rect(x, y, w, h, c) {
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
    }
    hline(x0, x1, y, c) { for (let x = x0; x <= x1; x++) this.set(x, y, c); }
    vline(x, y0, y1, c) { for (let y = y0; y <= y1; y++) this.set(x, y, c); }
    outline(c = OUT) {
      const add = [];
      for (let y = 0; y < this.h; y++) {
        for (let x = 0; x < this.w; x++) {
          if (this.get(x, y)) continue;
          if (this.get(x - 1, y) || this.get(x + 1, y) || this.get(x, y - 1) || this.get(x, y + 1)) add.push(x, y);
        }
      }
      for (let i = 0; i < add.length; i += 2) this.set(add[i], add[i + 1], c);
      return this;
    }
    canvas() {
      const c = G.canvas(this.w, this.h);
      const ctx = c.getContext('2d');
      const img = ctx.createImageData(this.w, this.h);
      for (let i = 0; i < this.d.length; i++) {
        const col = this.d[i];
        if (col) img.data.set(rgba(col), i * 4);
      }
      ctx.putImageData(img, 0, 0);
      return c;
    }
  }

  function fromRows(rows, pal) {
    const w = Math.max(...rows.map((r) => r.length));
    const p = new Pix(w, rows.length);
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) if (pal[row[x]]) p.set(x, y, pal[row[x]]);
    });
    return p;
  }

  function mirror(src) {
    const c = G.canvas(src.width, src.height);
    const x = c.getContext('2d');
    x.translate(src.width, 0);
    x.scale(-1, 1);
    x.drawImage(src, 0, 0);
    return c;
  }

  // White silhouette used for damage flashes.
  const flashCache = new WeakMap();
  function flash(src) {
    let c = flashCache.get(src);
    if (c) return c;
    c = G.canvas(src.width, src.height);
    const x = c.getContext('2d');
    x.drawImage(src, 0, 0);
    x.globalCompositeOperation = 'source-atop';
    x.fillStyle = '#ffffff';
    x.fillRect(0, 0, c.width, c.height);
    flashCache.set(src, c);
    return c;
  }

  // ================================================================ PEOPLE
  // Chibi sprite generator. Every character is a config, so updating someone's
  // look is a one-line change in content.js.
  const HEAD = [[5, 10], [4, 11], [3, 12], [3, 12], [3, 12], [3, 12], [3, 12], [3, 12], [4, 11], [5, 10]];
  const BLUSH = '#f08c8c';

  function person(cfg) {
    const c = Object.assign({
      skin: '#f2c8a0', hair: '#6a4028', hairStyle: 'short', eyes: '#2a2030',
      shirt: '#4878c8', pants: '#383848', shoes: '#4a3428', torso: 6, legs: 3, sleeves: 2,
    }, cfg);
    c.skinD = shade(c.skin, -0.2);
    c.hairD = shade(c.hair, -0.3);
    c.hairL = shade(c.hair, 0.25);
    c.shirtD = shade(c.shirt, -0.25);
    c.pantsD = shade(c.pants, -0.3);
    c.shoesD = shade(c.shoes, -0.3);
    c.shoesL = shade(c.shoes, 0.25);
    if (c.coat) c.coatD = shade(c.coat, -0.18);
    if (c.cloak) c.cloakD = shade(c.cloak, -0.25);
    if (c.dress) c.dressD = shade(c.dress, -0.15);
    if (c.hat) { c.hatD = shade(c.hat, -0.3); c.hatL = shade(c.hat, 0.18); }
    const H = 1 + 10 + c.torso + c.legs + 1 + 1;
    const make = (dir, step, pose) => {
      const p = new Pix(16, H);
      drawPerson(p, c, dir, step, pose);
      p.outline();
      return p.canvas();
    };
    const set = { w: 16, h: H };
    for (const dir of ['down', 'up', 'right']) set[dir] = [0, 1, 2].map((s) => make(dir, s));
    set.left = set.right.map(mirror);
    set.hold = make('down', 0, 'hold');
    return set;
  }

  function drawPerson(p, c, dir, step, pose) {
    const y0 = 1, ty = y0 + 10, ly = ty + c.torso, sy = ly + c.legs;
    if (dir === 'right') return drawSide(p, c, step, y0, ty, ly, sy);
    const back = dir === 'up';
    const bx0 = c.wide ? 4 : 5, bx1 = c.wide ? 11 : 10;
    const ax0 = bx0 - 1, ax1 = bx1 + 1;

    // legs / skirt
    if (c.dress) {
      skirtFront(p, c, step, ly, sy);
    } else {
      p.hline(5, 10, ly, c.pants);
      const liftL = step === 1, liftR = step === 2;
      for (let y = ly + 1; y < sy; y++) {
        const bare = c.shorts && y - ly >= Math.ceil(c.legs / 2);
        const col = bare ? c.skin : c.pants, colD = bare ? c.skinD : c.pantsD;
        // boots: the row above the sole is leather too
        const bootL = c.boots && y === (liftL ? sy - 2 : sy - 1);
        const bootR = c.boots && y === (liftR ? sy - 2 : sy - 1);
        if (!(liftL && y === sy - 1)) {
          if (bootL) { p.hline(5, 6, y, c.shoes); p.set(7, y, c.shoesD); }
          else { p.hline(5, 6, y, col); p.set(7, y, colD); }
        }
        if (!(liftR && y === sy - 1)) {
          if (bootR) { p.set(8, y, c.shoesD); p.hline(9, 10, y, c.shoes); }
          else { p.set(8, y, colD); p.hline(9, 10, y, col); }
        }
      }
      p.hline(5, 7, liftL ? sy - 1 : sy, c.shoes);
      p.hline(8, 10, liftR ? sy - 1 : sy, c.shoes);
      if (!liftL) p.set(7, sy, c.shoesD);
      if (!liftR) p.set(8, sy, c.shoesD);
      if (c.boots) {
        if (!liftL) p.set(5, sy, c.shoesL);
        if (!liftR) p.set(10, sy, c.shoesL);
      }
    }

    // torso
    for (let y = ty; y < ly; y++) {
      for (let x = bx0; x <= bx1; x++) p.set(x, y, torsoPx(c, x, y, ty, x === bx1));
    }
    if (!back) {
      if (c.neckline) { p.hline(6, 9, ty, c.skin); if (c.necklace) p.set(8, ty, c.necklace); }
      if (c.neck) { p.set(7, ty, c.neck); p.set(8, ty, c.neck); }
      if (c.collar) { p.set(6, ty, c.collar); p.set(9, ty, c.collar); p.set(7, ty, c.skin); p.set(8, ty, c.skin); p.set(7, ty + 1, c.shirtD); }
    }
    if (c.belt) {
      p.hline(bx0, bx1, ly - 1, c.belt);
      if (!back) p.set(7, ly - 1, '#c8c8d0');
    }
    if (c.straps) {
      if (back) { p.rect(5, ty, 6, 5, c.straps); p.hline(5, 10, ty + 4, shade(c.straps, -0.3)); p.hline(6, 9, ty + 1, shade(c.straps, 0.2)); }
      else { p.vline(6, ty, ty + 3, c.straps); p.vline(9, ty, ty + 3, c.straps); }
    }

    // outer layers
    if (c.coat) {
      for (let y = ty; y < ly; y++) {
        for (let x = bx0; x <= bx1; x++) {
          if (!back && (x === 7 || x === 8)) continue;
          p.set(x, y, x === bx1 ? c.coatD : c.coat);
        }
      }
      if (!back) { p.set(6, ty, c.coatD); p.set(9, ty, c.coatD); p.set(6, ty + 1, c.coatD); p.set(9, ty + 1, c.coatD); }
      for (let x = bx0; x <= bx1; x++) if (back || x < 7 || x > 8) p.set(x, ly, c.coatD);
    }

    // arms
    if (pose === 'hold') {
      for (const ax of [2, 13]) {
        for (let y = y0 + 1; y <= ty; y++) {
          const sleeve = y > ty - 3;
          p.set(ax, y, sleeve ? (c.coat || c.cloak || armColor(c, ax, y, ty)) : c.skin);
        }
      }
    } else {
      armsFront(p, c, step, ty, ly, ax0, ax1);
    }

    if (c.cloak) cloak(p, c, ty, sy, ax0, ax1, back);

    // head
    HEAD.forEach(([a, b], i) => p.hline(a, b, y0 + i, c.skin));
    if (c.mask) return maskHead(p, c, y0, back ? 'back' : 'front');
    if (back) {
      hairBack(p, c, y0, ty);
      hatBack(p, c, y0, ty);
      return;
    }
    p.set(5, y0 + 5, c.eyes); p.set(5, y0 + 6, c.eyes);
    p.set(10, y0 + 5, c.eyes); p.set(10, y0 + 6, c.eyes);
    if (c.smile) { p.set(6, y0 + 8, c.skinD); p.hline(7, 8, y0 + 8, c.smile); p.set(9, y0 + 8, c.skinD); }
    else p.hline(7, 8, y0 + 8, c.skinD);
    if (c.blush) { p.set(4, y0 + 7, BLUSH); p.set(11, y0 + 7, BLUSH); }
    hairFront(p, c, y0, ty);
    if (c.beard) {
      const b = c.beard;
      p.set(3, y0 + 6, b); p.set(12, y0 + 6, b);
      p.hline(3, 4, y0 + 7, b); p.hline(11, 12, y0 + 7, b);
      p.hline(4, 6, y0 + 8, b); p.hline(9, 11, y0 + 8, b);
      p.hline(5, 10, y0 + 9, b);
    }
    if (c.glasses) {
      // round frames with a lens glint above each eye
      const g = c.glasses, lens = '#e4eef6';
      p.hline(4, 6, y0 + 4, g); p.hline(9, 11, y0 + 4, g);
      p.set(4, y0 + 5, g); p.set(6, y0 + 5, g); p.set(9, y0 + 5, g); p.set(11, y0 + 5, g);
      p.set(4, y0 + 6, g); p.set(6, y0 + 6, g); p.set(9, y0 + 6, g); p.set(11, y0 + 6, g);
      p.set(5, y0 + 5, lens); p.set(10, y0 + 5, lens);
      p.hline(7, 8, y0 + 5, g);
    }
    if (c.earring) p.set(13, y0 + 7, c.earring);
    hatFront(p, c, y0, ty);
  }

  // Luchador mask with contrasting trim around the eyes and mouth.
  function maskHead(p, c, y0, view) {
    const M = c.mask, T = c.maskTrim;
    HEAD.forEach(([a, b], i) => p.hline(a, b, y0 + i, M));
    if (view === 'back') {
      for (let y = y0 + 2; y <= y0 + 7; y++) { p.set(7, y, y % 2 ? T : M); p.set(8, y, y % 2 ? M : T); }
      p.hline(5, 10, y0 + 1, T);
      return;
    }
    if (view === 'side') {
      const rim = c.glasses || T;
      p.set(13, y0 + 6, M);
      p.hline(5, 12, y0 + 1, c.maskEmblem || T);
      p.hline(9, 11, y0 + 4, rim);
      p.set(9, y0 + 5, rim); p.set(11, y0 + 5, rim); p.set(9, y0 + 6, rim); p.set(11, y0 + 6, rim);
      p.set(10, y0 + 5, '#ffffff'); p.set(10, y0 + 6, c.eyes);
      if (c.glasses) p.hline(6, 8, y0 + 5, c.glasses);
      if (c.beard) { p.hline(8, 12, y0 + 8, c.beard); p.set(11, y0 + 8, c.smile || c.skin); p.hline(7, 11, y0 + 9, c.beard); }
      else { p.set(10, y0 + 8, T); p.set(11, y0 + 8, c.skin); p.set(12, y0 + 8, T); }
      p.vline(3, y0 + 3, y0 + 7, T);
      return;
    }
    const E = c.maskEmblem || T;
    p.vline(7, y0 + 1, y0 + 3, E); p.vline(8, y0 + 1, y0 + 3, E); p.hline(6, 9, y0 + 2, E);
    for (const ex of [5, 10]) {
      const rim = c.glasses || T;
      p.hline(ex - 1, ex + 1, y0 + 4, rim);
      p.set(ex - 1, y0 + 5, rim); p.set(ex + 1, y0 + 5, rim); p.set(ex - 1, y0 + 6, rim); p.set(ex + 1, y0 + 6, rim);
      p.set(ex, y0 + 5, '#ffffff'); p.set(ex, y0 + 6, c.eyes);
    }
    if (c.glasses) { p.hline(7, 8, y0 + 5, c.glasses); p.set(3, y0 + 5, c.glasses); p.set(12, y0 + 5, c.glasses); }
    if (c.beard) {
      // the beard pokes out under the mask
      p.hline(4, 6, y0 + 8, c.beard); p.hline(9, 11, y0 + 8, c.beard);
      p.hline(7, 8, y0 + 8, c.smile || c.skin);
      p.hline(5, 10, y0 + 9, c.beard);
    } else {
      p.hline(6, 9, y0 + 8, T); p.hline(7, 8, y0 + 8, c.skin);
    }
  }

  function torsoPx(c, x, y, ty, edge) {
    if (c.pattern === 'plaid') {
      const vx = x % 3 === 1, hy = (y - ty) % 3 === 2;
      if (vx && hy) return c.plaidW;
      if (vx || hy) return c.plaidL;
      return edge ? c.shirtD : c.shirt;
    }
    if (c.pattern === 'stripes') return x % 2 ? '#1c1c24' : c.shirt;
    if (c.pattern === 'floral') {
      const h = G.hash(x, y, 7);
      if (h < 0.18) return '#e27890';
      if (h < 0.3) return '#78a858';
      if (h < 0.36) return '#f0e0c0';
      return c.shirt;
    }
    return edge ? c.shirtD : c.shirt;
  }

  function armColor(c, x, y, ty) {
    if (c.pattern === 'plaid') return (y - ty) % 3 === 2 ? c.plaidL : c.shirtD;
    if (c.pattern === 'floral') return c.skin;
    return c.shirtD;
  }

  function armsFront(p, c, step, ty, ly, ax0, ax1) {
    [[ax0, 0], [ax1, 1]].forEach(([ax, side]) => {
      const swing = (step === 1 && side === 1) || (step === 2 && side === 0) ? 1 : 0;
      const end = ly - 1 - swing;
      for (let y = ty + 1; y <= end; y++) {
        let col;
        if (y === end) col = c.skin;
        else if (c.coat) col = side ? c.coatD : c.coat;
        else if (c.sleeves === 'long' || y < ty + 1 + c.sleeves) col = armColor(c, ax, y, ty);
        else col = side ? c.skinD : c.skin;
        p.set(ax, y, col);
      }
    });
  }

  function skirtFront(p, c, step, ly, sy) {
    for (let y = ly; y < sy; y++) {
      const spread = Math.min(2, (y - ly + 1) >> 1);
      for (let x = 5 - spread; x <= 10 + spread; x++) p.set(x, y, x >= 9 + spread ? c.dressD : c.dress);
    }
    if (c.beltStrap) p.vline(9, ly, sy - 2, c.belt);
    if (step !== 1) p.hline(5, 6, sy, c.shoes);
    if (step !== 2) p.hline(9, 10, sy, c.shoes);
  }

  function cloak(p, c, ty, sy, ax0, ax1, back) {
    for (let y = ty; y < sy; y++) {
      const spread = Math.floor((y - ty) / 3);
      const l = Math.max(1, ax0 - spread), r = Math.min(14, ax1 + spread);
      for (let x = l; x <= r; x++) {
        if (!back && x >= 6 && x <= 9) continue;
        p.set(x, y, x === l || x === r ? c.cloakD : c.cloak);
      }
    }
    if (!back) { p.set(7, ty, '#8a6a40'); p.set(8, ty, '#8a6a40'); }
  }

  function hairFront(p, c, y0, ty) {
    const H = c.hair, D = c.hairD, L = c.hairL, s = c.hairStyle;
    const top = (n) => { for (let i = 0; i < n; i++) p.hline(HEAD[i][0], HEAD[i][1], y0 + i, H); };
    if (s === 'short') {
      top(3);
      [3, 4, 5, 6, 8, 9, 11, 12].forEach((x) => p.set(x, y0 + 3, x % 3 ? H : D));
      p.set(3, y0 + 4, H); p.set(12, y0 + 4, H); p.set(3, y0 + 5, D); p.set(12, y0 + 5, D);
      p.hline(6, 8, y0 + 1, L);
    } else if (s === 'swoop') {
      top(3);
      p.hline(3, 9, y0 + 3, H); p.hline(3, 6, y0 + 4, D); p.set(10, y0 + 3, D);
      p.set(12, y0 + 3, H); p.set(12, y0 + 4, D); p.set(3, y0 + 5, D);
      p.hline(5, 7, y0 + 1, L);
    } else if (s === 'buzz') {
      top(2);
      p.hline(3, 12, y0 + 2, D);
      p.set(3, y0 + 3, D); p.set(12, y0 + 3, D);
      p.hline(6, 8, y0, L);
    } else if (s === 'receding') {
      p.hline(5, 10, y0, H);
      p.hline(4, 5, y0 + 1, H); p.hline(10, 11, y0 + 1, H);
      p.hline(6, 9, y0 + 1, shade(c.skin, -0.06));
      for (let y = y0 + 2; y <= y0 + 5; y++) { p.set(3, y, y > y0 + 3 ? D : H); p.set(12, y, y > y0 + 3 ? D : H); }
      p.hline(6, 8, y0, L);
    } else if (s === 'cap') {
      // hair poking out under a cap
      for (let y = y0 + 3; y <= y0 + 6; y++) { p.set(3, y, H); p.set(12, y, H); }
      p.set(2, y0 + 4, H); p.set(13, y0 + 4, H); p.set(2, y0 + 5, D); p.set(13, y0 + 5, D);
      p.hline(4, 6, y0 + 3, H);
    } else {
      // long / wavy / shoulder
      top(3);
      p.set(7, y0, D); p.set(7, y0 + 1, D);
      p.hline(3, 5, y0 + 3, H); p.hline(10, 12, y0 + 3, H);
      p.set(3, y0 + 4, H); p.set(12, y0 + 4, H);
      p.hline(4, 6, y0 + 1, L);
      const end = s === 'shoulder' ? ty + 1 : ty + 5;
      for (let y = y0 + 4; y <= end; y++) {
        const wave = s === 'wavy' && (y - y0) % 3 === 0 ? 1 : 0;
        p.set(2 - wave, y, D); p.set(3 - wave, y, H);
        p.set(12 + wave, y, H); p.set(13 + wave, y, D);
        if (wave) { p.set(3, y, H); p.set(12, y, H); }
      }
      p.set(3, end + 1, D); p.set(12, end + 1, D);
    }
  }

  function hairBack(p, c, y0, ty) {
    const H = c.hair, D = c.hairD, L = c.hairL, s = c.hairStyle;
    const rows = s === 'buzz' ? 7 : 9;
    for (let i = 0; i < rows; i++) p.hline(HEAD[i][0], HEAD[i][1], y0 + i, i >= rows - 2 ? D : H);
    p.hline(6, 9, y0 + 1, L);
    p.set(3, y0 + 5, c.skin); p.set(12, y0 + 5, c.skin);
    if (s === 'long' || s === 'wavy' || s === 'shoulder') {
      p.hline(5, 10, y0 + 9, H);
      const end = s === 'shoulder' ? ty + 1 : ty + 5;
      for (let y = y0 + 4; y <= end; y++) {
        const wave = s === 'wavy' && (y - y0) % 3 === 0 ? 1 : 0;
        p.hline(3 - wave, 12 + wave, y, H);
        p.set(3 - wave, y, D); p.set(12 + wave, y, D);
      }
      for (let x = 3; x <= 12; x++) if (x % 2) p.set(x, end + 1, D);
    }
  }

  function hatFront(p, c, y0) {
    if (c.hood) {
      for (let i = 0; i < 2; i++) p.hline(HEAD[i][0], HEAD[i][1], y0 + i, c.hood);
      p.hline(4, 11, y0 - 1 < 0 ? y0 : y0, c.hood);
      for (let y = y0 + 1; y <= y0 + 10; y++) { p.set(2, y, shade(c.hood, -0.25)); p.set(13, y, shade(c.hood, -0.25)); }
      p.set(3, y0 + 2, c.hood); p.set(12, y0 + 2, c.hood);
      return;
    }
    if (!c.hat) return;
    if (c.hatStyle === 'flat') {
      for (let i = 0; i < 3; i++) p.hline(HEAD[i][0], HEAD[i][1], y0 + i, c.hat);
      for (let x = 4; x <= 11; x += 2) p.set(x, y0 + 1, c.hatL);
      p.hline(6, 9, y0, c.hatL);
      p.hline(2, 13, y0 + 3, c.hatD);
    } else {
      for (let i = 0; i < 3; i++) p.hline(HEAD[i][0], HEAD[i][1], y0 + i, c.hat);
      p.hline(5, 7, y0, c.hatL);
      if (c.patch) { p.set(7, y0 + 1, c.patch); p.set(8, y0 + 1, c.patch); }
      p.hline(3, 12, y0 + 3, c.hatD);
    }
  }

  function hatBack(p, c, y0, ty) {
    if (c.hood) {
      for (let i = 0; i < 10; i++) p.hline(HEAD[i][0], HEAD[i][1], y0 + i, i > 7 ? shade(c.hood, -0.25) : c.hood);
      p.hline(4, 11, y0 + 10, shade(c.hood, -0.25));
      return;
    }
    if (!c.hat) return;
    for (let i = 0; i < 4; i++) p.hline(HEAD[i][0], HEAD[i][1], y0 + i, i === 3 ? c.hatD : c.hat);
    if (c.hatStyle !== 'flat') { p.set(7, y0 + 3, c.hair); p.set(8, y0 + 3, c.hair); }
  }

  function drawSide(p, c, step, y0, ty, ly, sy) {
    const sx0 = c.wide ? 5 : 6, sx1 = c.wide ? 10 : 9;
    const H = c.hair, D = c.hairD, s = c.hairStyle;
    const longHair = s === 'long' || s === 'wavy' || s === 'shoulder';
    const hairEnd = s === 'shoulder' ? ty + 1 : ty + 5;

    // long hair / hood behind the body
    if (longHair) {
      for (let y = y0 + 3; y <= hairEnd; y++) {
        const wave = s === 'wavy' && (y - y0) % 3 === 0 ? 1 : 0;
        p.hline(2 - wave, 6, y, H);
        p.set(2 - wave, y, D);
      }
    }
    if (c.cloak) {
      for (let y = ty; y < sy; y++) {
        const spread = Math.floor((y - ty) / 3);
        p.hline(Math.max(1, sx0 - 1 - spread), sx1, y, c.cloak);
        p.set(Math.max(1, sx0 - 1 - spread), y, c.cloakD);
      }
    }

    // legs
    if (c.dress) {
      for (let y = ly; y < sy; y++) {
        const spread = Math.min(2, (y - ly + 1) >> 1);
        p.hline(sx0 - spread, sx1 + spread, y, c.dress);
        p.set(sx0 - spread, y, c.dressD);
      }
      if (step === 1) { p.hline(sx1, sx1 + 2, sy, c.shoes); p.hline(sx0 - 1, sx0, sy, c.shoesD); }
      else if (step === 2) { p.hline(sx0 + 1, sx0 + 3, sy, c.shoes); }
      else p.hline(7, 9, sy, c.shoes);
    } else {
      const leg = (pts, dark) => {
        pts.forEach(([x, y], i) => {
          const bare = c.shorts && i >= Math.ceil(c.legs / 2);
          let col = bare ? (dark ? c.skinD : c.skin) : (dark ? c.pantsD : c.pants);
          if (c.boots && i === pts.length - 1) col = dark ? c.shoesD : c.shoes;
          p.hline(x, x + 1, y, col);
        });
      };
      if (step === 0) {
        const pts = [];
        for (let y = ly; y < sy; y++) pts.push([7, y]);
        leg(pts, false);
        p.hline(7, 9, sy, c.shoes);
      } else {
        const front = [], backL = [];
        for (let y = ly; y < sy; y++) {
          const k = Math.min(y - ly, 2);
          front.push([7 + k, y]);
          backL.push([7 - k, y]);
        }
        const swap = step === 2;
        leg(swap ? front : backL, true);
        leg(swap ? backL : front, false);
        const fx = 7 + Math.min(sy - 1 - ly, 2), bx = 7 - Math.min(sy - 1 - ly, 2);
        p.hline(bx - 1, bx + 1, sy, swap ? c.shoes : c.shoesD);
        p.hline(fx, fx + 2, sy, swap ? c.shoesD : c.shoes);
      }
    }

    // torso
    for (let y = ty; y < ly; y++) for (let x = sx0; x <= sx1; x++) p.set(x, y, torsoPx(c, x, y, ty, x === sx0));
    if (c.neckline) p.set(sx1, ty, c.skin);
    if (c.collar) { p.set(sx1 - 1, ty, c.collar); p.set(sx1, ty, c.skin); }
    if (c.neck) p.set(sx1, ty, c.neck);
    if (c.belt) p.hline(sx0, sx1, ly - 1, c.belt);
    if (c.coat) {
      for (let y = ty; y < ly; y++) p.hline(sx0, sx1 - 1, y, c.coat);
      p.hline(sx0 - 1, sx1 - 1, ly, c.coatD);
    }
    if (c.straps) { p.rect(sx0 - 2, ty, 2, 5, c.straps); p.vline(sx0 + 1, ty, ty + 2, shade(c.straps, -0.2)); }
    if (c.dress && c.beltStrap) p.vline(sx1, ly, sy - 2, c.belt);

    // arm
    const ax = 7 + (step === 1 ? 1 : step === 2 ? -1 : 0);
    const end = ly - 1 - (step ? 0 : 0);
    for (let y = ty + 1; y <= end; y++) {
      let col;
      if (y === end) col = c.skin;
      else if (c.coat) col = c.coatD;
      else if (c.cloak) col = c.cloakD;
      else if (c.sleeves === 'long' || y < ty + 1 + c.sleeves) col = armColor(c, ax, y, ty);
      else col = c.skinD;
      p.set(ax, y, col);
      if (!c.wide) continue;
      p.set(ax + 1, y, col);
    }

    // head
    HEAD.forEach(([a, b], i) => p.hline(a, b, y0 + i, c.skin));
    if (c.mask) return maskHead(p, c, y0, 'side');
    p.set(13, y0 + 6, c.skin);
    p.set(10, y0 + 5, c.eyes); p.set(10, y0 + 6, c.eyes);
    p.set(11, y0 + 8, c.smile ? c.smile : c.skinD);
    if (c.blush) p.set(11, y0 + 7, BLUSH);
    p.set(7, y0 + 5, c.skinD); p.set(7, y0 + 6, c.skinD);

    // hair
    const top = (n) => { for (let i = 0; i < n; i++) p.hline(HEAD[i][0], HEAD[i][1], y0 + i, H); };
    if (s === 'buzz') {
      top(2); p.hline(3, 10, y0 + 2, D);
      for (let y = y0 + 3; y <= y0 + 5; y++) p.hline(3, 5, y, D);
    } else if (s === 'receding') {
      p.hline(5, 8, y0, H); p.hline(4, 7, y0 + 1, H); p.hline(3, 6, y0 + 2, H);
      for (let y = y0 + 3; y <= y0 + 6; y++) p.hline(3, 5, y, y > y0 + 4 ? D : H);
    } else if (s === 'cap') {
      for (let y = y0 + 3; y <= y0 + 6; y++) p.hline(3, 5, y, H);
      p.set(2, y0 + 5, D); p.set(6, y0 + 3, H);
    } else {
      top(3);
      p.hline(3, 8, y0 + 3, H);
      p.hline(9, 12, y0 + 3, s === 'swoop' ? H : D);
      if (s === 'swoop') p.set(12, y0 + 4, D);
      if (longHair) {
        for (let y = y0 + 4; y <= y0 + 9; y++) p.hline(3, 6, y, H);
      } else {
        p.hline(3, 6, y0 + 4, H); p.hline(3, 5, y0 + 5, H); p.hline(3, 5, y0 + 6, D); p.hline(3, 4, y0 + 7, D);
      }
      p.hline(5, 8, y0 + 1, c.hairL);
    }
    if (c.beard) {
      const b = c.beard;
      p.hline(8, 9, y0 + 6, b);
      p.hline(8, 12, y0 + 7, b);
      p.hline(8, 12, y0 + 8, b); p.set(11, y0 + 8, c.smile || c.skinD);
      p.hline(7, 10, y0 + 9, b);
    }
    if (c.glasses) {
      const g = c.glasses;
      p.set(9, y0 + 5, g); p.set(9, y0 + 6, g); p.set(11, y0 + 5, g); p.set(11, y0 + 6, g);
      p.set(10, y0 + 4, g); p.set(10, y0 + 7, g);
      p.set(10, y0 + 5, '#e4eef6');
      p.hline(7, 8, y0 + 5, g);
    }
    if (c.earring) p.set(7, y0 + 7, c.earring);
    if (c.hood) {
      for (let i = 0; i < 2; i++) p.hline(HEAD[i][0], HEAD[i][1], y0 + i, c.hood);
      for (let y = y0 + 2; y <= y0 + 10; y++) p.hline(2, 6, y, y > y0 + 7 ? shade(c.hood, -0.25) : c.hood);
    } else if (c.hat) {
      for (let i = 0; i < 3; i++) p.hline(HEAD[i][0], HEAD[i][1], y0 + i, c.hat);
      p.hline(5, 8, y0, c.hatL);
      if (c.hatStyle === 'flat') p.hline(8, 13, y0 + 3, c.hatD);
      else { p.hline(10, 14, y0 + 3, c.hatD); p.set(3, y0 + 3, c.hatD); }
    }
  }

  // ================================================================ ICONS & SMALL SPRITES
  const ICON_PAL = {
    o: OUT, r: '#e83848', w: '#ffc0c8', e: '#5a4a58',
    b: '#9a6a40', B: '#7a4a28', g: '#5a6272', G: '#3a4252', l: '#a8b0c0',
    c: '#c88838', C: '#a86820', L: '#e8b860', W: '#f8f0d8', d: '#7a4818', y: '#d8a050', Y: '#a87030',
  };

  const heartRows = ['.oo.oo.', 'orrorro', 'orwrrro', 'orrrrro', '.orrro.', '..oro..', '...o...'];
  function heartIcon(kind) {
    const rows = heartRows.map((row) => row.split('').map((ch, x) => {
      if (kind === 'empty' && (ch === 'r' || ch === 'w')) return 'e';
      if (kind === 'half' && x >= 4 && (ch === 'r' || ch === 'w')) return 'e';
      return ch;
    }).join(''));
    return fromRows(rows, ICON_PAL).canvas();
  }

  const toothRows = ['.oooooo.', 'obbbbbbo', 'obBBBBbo', '.olglgo.', '.oglggo.', '..olgo..', '..oggo..', '...oo...'];
  function toothIcon(gold) {
    const pal = Object.assign({}, ICON_PAL, gold ? { g: '#e8b830', l: '#fff0a0', G: '#b88820' } : {});
    return fromRows(toothRows, pal).canvas();
  }

  const dooshRows = [
    '...oooooo...',
    '..oWWLLLCo..',
    '.oWLLLLLCCo.',
    '.oLLLLdLCCo.',
    '.odLLLLdCdo.',
    '..oddddddo..',
    '..oyyyyyyo..',
    '..oyYyYyYo..',
    '...oyyyyo...',
    '...oYyYyo...',
    '....oyyo....',
    '....oYyo....',
    '.....oo.....',
  ];

  function hammerSprites() {
    const wood = '#b87840', grip = '#3858c8', steel = '#a8b0c0', steelL = '#e8f0f8', steelD = '#707888';
    // pointing up, hand at (8, 15)
    const up = new Pix(16, 16);
    up.rect(7, 5, 2, 10, wood);
    up.rect(7, 10, 2, 5, grip);
    up.hline(2, 13, 1, steelL);
    up.hline(2, 13, 2, steel);
    up.hline(3, 12, 3, steelD);
    up.set(1, 2, steel);
    up.rect(6, 4, 4, 1, steelD);
    up.outline();
    // pointing up-right, hand at (1, 14)
    const diag = new Pix(16, 16);
    for (let t = 0; t < 9; t++) {
      const col = t < 4 ? grip : wood;
      diag.set(2 + t, 13 - t, col);
      diag.set(3 + t, 13 - t, col);
    }
    for (let s = -4; s <= 3; s++) {
      diag.set(10 + s, 3 + s, s < -2 ? steel : steelL);
      diag.set(11 + s, 3 + s, steel);
      diag.set(11 + s, 4 + s, steelD);
    }
    diag.outline();
    return { up: up.canvas(), diag: diag.canvas() };
  }

  function sixFrames() {
    const pal = { o: OUT, r: '#e04040', l: '#ff8878', w: '#ffffff', k: '#201018', d: '#8a2030', D: '#5a1020' };
    const body = [
      '................',
      '.......ooooo....',
      '.....oorrrrroo..',
      '....orrllllrrro.',
      '...orrlooooorro.',
      '...orlo.....ooo.',
      '..orrlo.........',
      '..orrlooooooo...',
      '..orrrrrrrrrroo.',
      '..orrkrrrrkrrro.',
      '..orrwkrrrwkrro.',
      '..orrwkrrrwkrro.',
      '..orrrrrrrrrrro.',
      '..orrrdddddrrro.',
      '...orrrrrrrrro..',
      '....ooooooooo...',
    ];
    const f1 = fromRows(body.concat(['....DD.....DD...']), pal).canvas();
    const f2 = fromRows(['................'].concat(body.slice(0, 15), ['....ooooooooo...', '...DD.......DD..']).slice(1), pal).canvas();
    return [f1, f2];
  }

  function chestSprites() {
    const pal = { o: OUT, w: '#e8a050', W: '#b86828', D: '#7a4018', y: '#f8d040', Y: '#c09018', k: '#2a1810' };
    const closed = [
      '................',
      '................',
      '..oooooooooooo..',
      '.owwwwwwwwwwwwo.',
      '.owWWWWWWWWWWwo.',
      '.oWWWWWWWWWWWWo.',
      '.oooooooooooooo.',
      '.oWWWWWyyWWWWWo.',
      '.oWWWWWyYWWWWWo.',
      '.oWWWWWWWWWWWWo.',
      '.oDDDDDDDDDDDDo.',
      '.oDDDDDDDDDDDDo.',
      '..oooooooooooo..',
    ];
    const open = [
      '..oooooooooooo..',
      '.owwwwwwwwwwwwo.',
      '.oWWWWWWWWWWWWo.',
      '.oooooooooooooo.',
      '.okkkkkkkkkkkko.',
      '.okkkkkkkkkkkko.',
      '.oooooooooooooo.',
      '.oWWWWWWWWWWWWo.',
      '.oWWWWWWWWWWWWo.',
      '.oWWWWWWWWWWWWo.',
      '.oDDDDDDDDDDDDo.',
      '.oDDDDDDDDDDDDo.',
      '..oooooooooooo..',
    ];
    return { closed: fromRows(closed, pal).canvas(), open: fromRows(open, pal).canvas() };
  }

  function signSprite() {
    const pal = { o: OUT, w: '#e0b070', W: '#a87040', k: '#7a4a28' };
    return fromRows([
      '................',
      '................',
      '.oooooooooooooo.',
      '.owwwwwwwwwwwwo.',
      '.owkkkkwkkkkkwo.',
      '.owwwwwwwwwwwwo.',
      '.owkkkwkkkkwwwo.',
      '.oWWWWWWWWWWWWo.',
      '.oooooooooooooo.',
      '......oWWo......',
      '......oWWo......',
      '......oWWo......',
      '......oWWo......',
      '......oooo......',
    ], pal).canvas();
  }

  function emoteSprite(mark) {
    const pal = { o: OUT, w: '#ffffff', r: '#e83848' };
    const rows = mark === '?'
      ? ['.oooooooo.', 'owwwrrwwwo', 'owwrwwrwwo', 'owwwwrwwwo', 'owwwrwwwwo', 'owwwwwwwwo', 'owwwrwwwwo', '.oooooooo.', '...oo.....', '...o......']
      : ['.oooooooo.', 'owwwrrwwwo', 'owwwrrwwwo', 'owwwrrwwwo', 'owwwrrwwwo', 'owwwwwwwwo', 'owwwrrwwwo', '.oooooooo.', '...oo.....', '...o......'];
    return fromRows(rows, pal).canvas();
  }

  // Father Eggmas, from the real thrift-store doll: bald muslin egg head with a
  // seam, beady eyes, red bead nose, long stringy white beard, burgundy paisley
  // suit, cream mittens with ribbon ties, cream slippers with black toes.
  function eggmas() {
    const W = 28, H = 34, p = new Pix(W, H);
    const cream = '#f2ead6', creamD = '#d4c8ac';
    const red = '#7a1e2c', redD = '#561420', green = '#3e6a44', gold = '#c8984c';
    const white = '#fbfbf8', whiteD = '#c4c4cc', black = '#1e2230', ribbon = '#c02848';
    const paisley = (x, y) => {
      const h = G.hash(x, y, 21);
      return h < 0.09 ? green : h < 0.15 ? gold : h < 0.3 ? redD : red;
    };
    const mirror = (x) => W - 1 - x;
    const both = (x, y, c) => { p.set(x, y, c); p.set(mirror(x), y, c); };

    // arms reaching out and down, mittens on the ends
    [[7, 21], [6, 22], [5, 23]].forEach(([x, y]) => { both(x, y, paisley(x, y)); both(x + 1, y, paisley(x + 1, y)); });
    both(4, 24, ribbon); both(5, 24, ribbon);
    for (let y = 25; y <= 27; y++) for (let x = 2; x <= 5; x++) both(x, y, x === 2 || y === 27 ? creamD : cream);
    // legs and slippers
    for (let y = 27; y <= 29; y++) for (let x = 9; x <= 12; x++) both(x, y, paisley(x, y));
    for (let x = 8; x <= 12; x++) { both(x, 29, cream); both(x, 30, x > 9 ? creamD : cream); }
    for (let y = 30; y <= 32; y++) for (let x = 4; x <= 9; x++) {
      if (y === 32 && (x === 4 || x === 9)) continue;
      both(x, y, y === 30 && x > 7 ? cream : black);
    }
    // body: turtleneck onesie
    for (let y = 18; y <= 27; y++) {
      const inset = y === 18 || y === 27 ? 1 : 0;
      for (let x = 8 + inset; x <= 19 - inset; x++) p.set(x, y, y <= 19 ? (y === 19 ? redD : red) : paisley(x, y));
    }
    // egg head
    const cx = 14, cy = 9.5, rx = 9.6, ry = 9.4;
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < W; x++) {
        const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry;
        if (dx * dx + dy * dy > 1) continue;
        const s = dx * 0.5 + dy * 0.75;
        p.set(x, y, s > 0.55 ? creamD : cream);
      }
    }
    // face
    p.set(11, 10, black); p.set(11, 11, black); p.set(17, 10, black); p.set(17, 11, black);
    p.set(10, 10, white); p.set(18, 10, white);
    p.set(9, 8, '#8a7c70'); p.set(10, 8, '#8a7c70'); p.set(11, 9, '#8a7c70');
    p.set(19, 8, '#8a7c70'); p.set(18, 8, '#8a7c70'); p.set(17, 9, '#8a7c70');
    p.set(14, 13, '#b8203a');
    p.set(9, 13, '#f0c4b8'); p.set(19, 13, '#f0c4b8');
    // white wisps at the sides of the head
    for (let y = 9; y <= 15; y++) {
      if ((y + 1) % 3) { p.set(4, y, y % 2 ? white : whiteD); p.set(mirror(4), y, y % 2 ? white : whiteD); }
      if (y > 11) { p.set(5, y, white); p.set(mirror(5), y, white); }
    }
    // long stringy beard
    p.hline(12, 16, 15, white);
    p.hline(10, 18, 16, white); p.set(13, 16, whiteD); p.set(15, 16, whiteD);
    p.hline(9, 11, 17, white); p.hline(17, 19, 17, white);
    p.set(8, 18, whiteD); p.set(20, 18, whiteD); p.set(7, 19, white); p.set(21, 19, white);
    for (let y = 17; y <= 28; y++) {
      const wave = (y >> 1) % 2;
      p.set(13 + wave, y, white);
      p.set(14 + wave, y, y % 3 ? white : whiteD);
    }
    p.set(12, 18, white); p.set(16, 19, whiteD); p.set(12, 21, whiteD);
    p.outline();
    return p.canvas();
  }

  // ================================================================ TILES
  const P = {
    grass: '#5cba4c', grassD: '#40a03c', grassDD: '#2e7e30', grassL: '#8ad868',
    path: '#dcbc80', pathD: '#bf9a5c', pathL: '#eed8a4',
    water: '#3c7cdc', waterD: '#2c5cb8', waterL: '#78b4f4', foam: '#e0f0ff',
    sand: '#ecd49a', sandD: '#d4b878',
    stone: '#a8a8b8', stoneD: '#727284', stoneL: '#d4d4e0',
    floor: '#c88a50', floorD: '#9e6838', floorL: '#e0aa6c',
    wallTop: '#3c3446', wallTopL: '#4c4458', wallFace: '#ece0c2', wallFaceD: '#cbbb94', base: '#9a7048',
    rug: '#c04848', rugD: '#8a2c34', rugL: '#e8c060',
  };

  function grassBase(p, r) {
    p.rect(0, 0, 16, 16, P.grass);
    for (let i = 0; i < 5; i++) p.set(r() * 16, r() * 16, P.grassL);
    const n = 2 + Math.floor(r() * 3);
    for (let i = 0; i < n; i++) {
      const x = 2 + Math.floor(r() * 12), y = 3 + Math.floor(r() * 11);
      p.set(x, y, P.grassD); p.set(x - 1, y - 1, P.grassD); p.set(x + 1, y - 1, P.grassD);
      p.set(x, y - 1, P.grassL);
    }
  }

  const TILE_DRAW = {
    grass(p, r) { grassBase(p, r); },
    cut(p, r) {
      p.rect(0, 0, 16, 16, P.grass);
      for (let i = 0; i < 7; i++) { const x = r() * 14 + 1, y = r() * 13 + 2; p.set(x, y, P.grassDD); p.set(x, y - 1, P.grassD); }
    },
    flowers(p, r) {
      grassBase(p, r);
      const cols = [['#ffffff', '#f8d040'], ['#ff8890', '#ffffff'], ['#ffe060', '#e07020']];
      for (let i = 0; i < 2; i++) {
        const x = 3 + Math.floor(r() * 10), y = 3 + Math.floor(r() * 10);
        const [petal, mid] = cols[Math.floor(r() * cols.length)];
        p.set(x - 1, y, petal); p.set(x + 1, y, petal); p.set(x, y - 1, petal); p.set(x, y + 1, petal);
        p.set(x, y, mid);
        p.set(x, y + 2, P.grassDD);
      }
    },
    tallgrass(p, r) {
      p.rect(0, 0, 16, 16, P.grassD);
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const x = 2 + col * 5 + (row % 2 ? 2 : 0) + Math.floor(r() * 2), y = 5 + row * 5;
          p.set(x, y, P.grassDD); p.set(x - 1, y - 1, P.grassDD); p.set(x + 1, y - 1, P.grassDD);
          p.set(x - 2, y - 2, P.grass); p.set(x + 2, y - 2, P.grass); p.set(x, y - 2, P.grassL);
          p.set(x - 2, y - 3, P.grassL); p.set(x + 2, y - 3, P.grassL);
        }
      }
    },
    bush(p, r, v) {
      grassBase(p, r);
      const q = new Pix(16, 16);
      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
          const dx = x - 7.5, dy = y - 8.5;
          if (dx * dx + dy * dy > 44) continue;
          const s = dx * 0.35 + dy * 0.5 + (G.hash(x, y, v + 3) - 0.5) * 3;
          q.set(x, y, s < -2 ? '#9ae070' : s < 1.4 ? '#4aa840' : '#2e7a30');
        }
      }
      q.outline('#1a4a22');
      for (let i = 0; i < q.d.length; i++) if (q.d[i]) p.d[i] = q.d[i];
    },
    path(p, r, v, mask) {
      p.rect(0, 0, 16, 16, P.path);
      for (let i = 0; i < 4; i++) {
        const x = 2 + Math.floor(r() * 12), y = 2 + Math.floor(r() * 12);
        p.set(x, y, P.pathD); p.set(x + 1, y, P.pathD); p.set(x, y - 1, P.pathL);
      }
      edgeFringe(p, mask, v, P.grass, P.pathD);
    },
    sand(p, r, v, mask) {
      p.rect(0, 0, 16, 16, P.sand);
      for (let i = 0; i < 6; i++) p.set(r() * 16, r() * 16, P.sandD);
      edgeFringe(p, mask, v, P.grass, P.sandD);
    },
    water(p, r, v, mask, frame) {
      p.rect(0, 0, 16, 16, P.water);
      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
          const w = Math.sin((x + frame * 2) * 0.7 + y * 1.3) + Math.sin((y - frame) * 0.9);
          if (w > 1.55) p.set(x, y, P.waterL);
          else if (w < -1.6) p.set(x, y, P.waterD);
        }
      }
      const edge = (cond, fn) => { if (cond) for (let i = 0; i < 16; i++) fn(i); };
      edge(mask & 1, (i) => { p.set(i, 0, P.foam); p.set(i, 1, (i + frame) % 4 ? P.waterL : P.foam); });
      edge(mask & 4, (i) => { p.set(i, 15, P.waterD); p.set(i, 14, P.water); });
      edge(mask & 8, (i) => { p.set(0, i, P.foam); p.set(1, i, (i + frame) % 4 ? P.waterL : P.foam); });
      edge(mask & 2, (i) => { p.set(15, i, P.foam); p.set(14, i, (i + frame) % 4 ? P.waterL : P.foam); });
    },
    stone(p) {
      for (let row = 0; row < 4; row++) {
        const y = row * 4, off = row % 2 ? 4 : 0;
        p.rect(0, y, 16, 4, P.stone);
        p.hline(0, 15, y, P.stoneL);
        p.hline(0, 15, y + 3, P.stoneD);
        for (let x = off; x < 16; x += 8) p.vline(x, y, y + 3, P.stoneD);
      }
    },
    fence(p, r) {
      grassBase(p, r);
      const wood = '#c08048', woodD = '#8a5428';
      for (const y of [5, 10]) { p.hline(0, 15, y - 1, OUT); p.hline(0, 15, y, wood); p.hline(0, 15, y + 1, woodD); p.hline(0, 15, y + 2, OUT); }
      p.rect(6, 2, 4, 12, wood); p.vline(9, 2, 13, woodD);
      p.vline(5, 2, 13, OUT); p.vline(10, 2, 13, OUT); p.hline(6, 9, 1, OUT); p.hline(6, 9, 14, OUT);
    },
    floor(p) {
      for (let row = 0; row < 4; row++) {
        const y = row * 4;
        p.rect(0, y, 16, 4, P.floor);
        p.hline(0, 15, y, P.floorL);
        p.hline(0, 15, y + 3, P.floorD);
        p.vline((row * 7 + 3) % 16, y, y + 3, P.floorD);
      }
    },
    wallTop(p) {
      p.rect(0, 0, 16, 16, P.wallTop);
      p.hline(0, 15, 0, P.wallTopL);
      for (let i = 0; i < 3; i++) p.set(G.hash(i, 1) * 16, G.hash(i, 2) * 16, P.wallTopL);
    },
    wallFace(p) {
      p.rect(0, 0, 16, 16, P.wallFace);
      for (let x = 0; x < 16; x += 4) p.vline(x, 2, 12, P.wallFaceD);
      p.hline(0, 15, 0, P.wallFaceD); p.hline(0, 15, 1, P.wallFaceD);
      p.rect(0, 13, 16, 3, P.base); p.hline(0, 15, 13, shade(P.base, 0.3));
    },
    rug(p, r, v, mask) {
      p.rect(0, 0, 16, 16, P.rug);
      for (let i = 0; i < 16; i++) {
        if (mask & 1) { p.set(i, 0, P.rugL); p.set(i, 1, P.rugD); }
        if (mask & 4) { p.set(i, 15, P.rugL); p.set(i, 14, P.rugD); }
        if (mask & 8) { p.set(0, i, P.rugL); p.set(1, i, P.rugD); }
        if (mask & 2) { p.set(15, i, P.rugL); p.set(14, i, P.rugD); }
      }
      p.set(7, 7, P.rugL); p.set(8, 8, P.rugL); p.set(7, 8, P.rugD); p.set(8, 7, P.rugD);
    },
    mat(p) {
      TILE_DRAW.floor(p);
      p.rect(2, 3, 12, 12, '#5a4838'); p.rect(3, 4, 10, 10, '#7a6450');
      p.hline(5, 10, 8, '#5a4838'); p.hline(6, 9, 9, '#5a4838'); p.hline(7, 8, 10, '#5a4838');
    },
    void(p) { p.rect(0, 0, 16, 16, '#000000'); },
    asphalt(p, r, v, mask) {
      p.rect(0, 0, 16, 16, '#4c4c56');
      for (let i = 0; i < 12; i++) p.set(r() * 16, r() * 16, r() < 0.5 ? '#5e5e6a' : '#3e3e48');
      edgeFringe(p, mask, v, P.grass, '#3a3a44');
    },
    stall(p, r, v, mask) {
      TILE_DRAW.asphalt(p, r, v, mask);
      p.vline(7, 0, 15, '#e8e8e0'); p.vline(8, 0, 15, '#d0d0c8');
    },
    canvas(p, r) {
      p.rect(0, 0, 16, 16, '#ece8e0');
      for (let i = 0; i < 4; i++) p.set(r() * 16, r() * 16, '#dcd8ce');
    },
    ropeH(p) {
      p.rect(0, 0, 16, 16, '#ece8e0');
      ['#d03040', '#f8f8f8', '#3058c8'].forEach((col, i) => { p.hline(0, 15, 4 + i * 3, col); p.hline(0, 15, 5 + i * 3, '#bcb8b0'); });
    },
    ropeV(p) {
      p.rect(0, 0, 16, 16, '#ece8e0');
      ['#d03040', '#f8f8f8', '#3058c8'].forEach((col, i) => { p.vline(4 + i * 3, 0, 15, col); p.vline(5 + i * 3, 0, 15, '#bcb8b0'); });
    },
    post(p) {
      p.rect(0, 0, 16, 16, '#ece8e0');
      p.rect(3, 2, 10, 12, OUT); p.rect(4, 3, 8, 10, '#9aa0aa');
      p.rect(5, 4, 6, 8, '#d03040'); p.hline(5, 10, 4, '#f06070');
    },
    concrete(p, r) {
      p.rect(0, 0, 16, 16, '#b4b4bc');
      for (let i = 0; i < 6; i++) p.set(r() * 16, r() * 16, r() < 0.5 ? '#c4c4cc' : '#a0a0aa');
      p.hline(0, 15, 15, '#9c9ca6'); p.vline(15, 0, 15, '#9c9ca6');
    },
    bleacher(p, r, v) {
      const fans = ['#d04848', '#4878c8', '#e8b840', '#58a848', '#a058c0', '#f0f0f0', '#8a2034'];
      const skins = ['#f2c8a0', '#c88a60', '#8a5a3a', '#f8d8c0', '#5c3626'];
      const hairs = ['#2a1a14', '#6a4028', '#c8a46c', '#141014', '#9a4a28', '#c0c0c8'];
      for (let k = 0; k < 2; k++) {
        const y = k * 8;
        p.rect(0, y, 16, 3, '#d0d4dc'); p.hline(0, 15, y, '#f0f2f6');
        p.rect(0, y + 3, 16, 5, '#50545e'); p.hline(0, 15, y + 3, '#3a3e48');
        if (v >= 3) continue;
        for (let n = 0; n < 2; n++) {
          if (r() < 0.35) continue;
          const x = 1 + n * 8 + Math.floor(r() * 3);
          p.rect(x, y + 2, 5, 4, fans[Math.floor(r() * fans.length)]);
          p.rect(x + 1, y - 1, 3, 3, skins[Math.floor(r() * skins.length)]);
          p.hline(x + 1, x + 3, y - 1, hairs[Math.floor(r() * hairs.length)]);
          if (r() < 0.3) { p.set(x - 1, y - 1, skins[0]); p.set(x - 1, y, p.get(x, y + 2)); }
        }
      }
    },
  };

  // Grass creeping over the edge of path/sand tiles that border grass.
  function edgeFringe(p, mask, v, grass, shadow) {
    for (let i = 0; i < 16; i++) {
      const depth = 1 + Math.floor(G.hash(i, v, 11) * 2.2);
      if (mask & 1) { for (let d = 0; d < depth; d++) p.set(i, d, grass); p.set(i, depth, shadow); }
      if (mask & 4) { for (let d = 0; d < depth; d++) p.set(i, 15 - d, grass); }
      if (mask & 8) { for (let d = 0; d < depth; d++) p.set(d, i, grass); p.set(depth, i, shadow); }
      if (mask & 2) { for (let d = 0; d < depth; d++) p.set(15 - d, i, grass); }
    }
  }

  const tileCache = new Map();
  function tile(kind, variant, mask, frame) {
    const key = kind + '|' + variant + '|' + mask + '|' + frame;
    let c = tileCache.get(key);
    if (c) return c;
    const p = new Pix(16, 16);
    TILE_DRAW[kind](p, G.rng(variant * 7919 + kind.length * 31 + 1), variant, mask, frame);
    c = p.canvas();
    tileCache.set(key, c);
    return c;
  }

  // ================================================================ PROPS
  function tree(seed) {
    const p = new Pix(32, 34);
    const blobs = [[16, 12, 12], [8, 15, 7.5], [24, 15, 7.5], [16, 5, 8]];
    for (let y = 0; y < 28; y++) {
      for (let x = 0; x < 32; x++) {
        if (!blobs.some(([cx, cy, r]) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r)) continue;
        const s = (x - 16) * 0.07 + (y - 11) * 0.11 + (G.hash(x, y, seed) - 0.5) * 0.9;
        p.set(x, y, s < -1 ? '#a0e078' : s < -0.3 ? '#6cc44c' : s < 0.75 ? '#3c9a3c' : '#24702c');
      }
    }
    // leaf clumps
    for (let i = 0; i < 9; i++) {
      const x = 5 + Math.floor(G.hash(i, seed, 1) * 22), y = 4 + Math.floor(G.hash(i, seed, 2) * 18);
      if (!p.get(x, y)) continue;
      p.hline(x - 1, x + 1, y + 1, '#24702c'); p.set(x, y, '#a0e078');
    }
    p.rect(12, 26, 8, 6, '#8a5a30');
    p.rect(17, 26, 3, 6, '#6a4020');
    p.hline(10, 21, 31, '#6a4020');
    p.hline(13, 15, 27, '#a87040');
    p.outline('#163a1c');
    return p.canvas();
  }

  function building(def) {
    const W = def.w * 16, H = def.h * 16, extra = def.tower ? 28 : 0;
    const p = new Pix(W, H + extra);
    const wallH = 32, roofH = H - wallH;
    const roof = def.roof || '#56607e', roofD = shade(roof, -0.3), roofL = shade(roof, 0.25);
    const wall = def.wall || '#b85840', wallD = shade(wall, -0.25), mortar = def.mortar || '#e2c4aa';
    // roof
    for (let y = 0; y < roofH; y++) {
      const ry = extra + y, row = Math.floor(y / 4), off = row % 2 ? 4 : 0;
      for (let x = 0; x < W; x++) {
        let col = roof;
        if (y % 4 === 3) col = roofD;
        else if ((x + off) % 8 === 0) col = roofD;
        else if (y % 4 === 0) col = roofL;
        p.set(x, ry, col);
      }
    }
    p.hline(0, W - 1, extra, roofL); p.hline(0, W - 1, extra + 1, roofL);
    p.hline(0, W - 1, extra + roofH - 2, roofD); p.hline(0, W - 1, extra + roofH - 1, OUT);
    // wall
    const wy = extra + roofH;
    for (let y = 0; y < wallH; y++) {
      for (let x = 0; x < W; x++) {
        let col = wall;
        if (def.style === 'brick') {
          const row = Math.floor(y / 4), off = row % 2 ? 4 : 0;
          if (y % 4 === 3 || (x + off) % 8 === 0) col = mortar;
        } else if (def.style === 'stone') {
          const row = Math.floor(y / 6), off = row % 2 ? 6 : 0;
          if (y % 6 === 5 || (x + off) % 12 === 0) col = wallD;
        } else if (def.style === 'metal') {
          if (x % 4 === 3) col = wallD;
          else if (x % 4 === 0) col = shade(wall, 0.18);
        } else if (y % 8 === 7) col = wallD;
        p.set(x, wy + y, col);
      }
    }
    p.hline(0, W - 1, wy, wallD);
    // windows
    const doorPx = def.door * 16;
    for (let x = 6; x + 10 < W && def.style !== 'metal'; x += 24) {
      if (x + 12 > doorPx - 4 && x < doorPx + 20) continue;
      p.rect(x - 1, wy + 5, 12, 14, '#f4f0e8');
      p.rect(x, wy + 6, 10, 12, '#4a6aa0');
      p.rect(x + 1, wy + 7, 3, 4, '#a8c8f0');
      p.vline(x + 5, wy + 6, wy + 17, '#f4f0e8');
      p.hline(x, x + 9, wy + 11, '#f4f0e8');
      p.hline(x - 2, x + 11, wy + 19, '#d8d0c0');
    }
    // door
    const dx = doorPx + 1, dw = 14, dh = 24;
    p.rect(dx - 1, wy + wallH - dh - 1, dw + 2, dh + 1, def.doorFrame || '#f0ece0');
    p.rect(dx, wy + wallH - dh, dw, dh, def.doorColor || '#6a3a20');
    p.vline(dx + 6, wy + wallH - dh, wy + wallH - 1, shade(def.doorColor || '#6a3a20', -0.3));
    p.vline(dx + 7, wy + wallH - dh, wy + wallH - 1, shade(def.doorColor || '#6a3a20', -0.3));
    p.set(dx + 4, wy + wallH - 11, '#f8d040'); p.set(dx + 9, wy + wallH - 11, '#f8d040');
    if (def.sign) {
      p.rect(doorPx - 6, wy + 1, 28, 5, '#2a3a5a');
      p.hline(doorPx - 4, doorPx + 19, wy + 3, '#e8d8a0');
    }
    // tower (Pardee-style)
    if (def.tower) {
      const tx = Math.floor(W / 2) - 14;
      p.rect(tx, 10, 28, extra + roofH - 6, wall);
      for (let y = 10; y < extra + roofH + 4; y += 6) p.hline(tx, tx + 27, y, wallD);
      for (let y = 0; y < 12; y++) {
        const half = Math.floor(y * 1.2) + 2;
        p.hline(tx + 14 - half, tx + 13 + half, y, y % 3 === 2 ? roofD : roof);
      }
      p.rect(tx + 9, 16, 10, 10, '#f4f0e8');
      p.rect(tx + 10, 17, 8, 8, '#e8e0c8');
      p.vline(tx + 14, 18, 21, '#2a2028'); p.hline(tx + 14, tx + 16, 21, '#2a2028');
      p.rect(tx + 4, 30, 4, 8, '#4a6aa0'); p.rect(tx + 20, 30, 4, 8, '#4a6aa0');
    }
    p.outline();
    const c = p.canvas();
    if (def.banner) {
      // marquee banner hung across the roof edge
      const x = c.getContext('2d');
      const tw = G.font.width(def.banner), bw = tw + 14, bx = Math.round((W - bw) / 2), by = extra + roofH - 15;
      x.fillStyle = OUT; x.fillRect(bx - 1, by - 1, bw + 2, 15);
      x.fillStyle = '#e8b830'; x.fillRect(bx, by, bw, 13);
      x.fillStyle = '#c02030'; x.fillRect(bx + 1, by + 1, bw - 2, 11);
      for (let i = 0; i < bw; i += 6) { x.fillStyle = (i / 6) % 2 ? '#fff4b0' : '#f8d040'; x.fillRect(bx + i + 2, by - 3, 2, 2); }
      G.font.draw(x, def.banner, bx + 7, by + 2, '#fff4b0', { shadow: '#5a0c14' });
    }
    return c;
  }

  function labBench() {
    const p = new Pix(48, 32);
    const flask = (x, liquid) => {
      p.rect(x + 1, 0, 2, 4, '#d8f0f8');
      p.rect(x, 4, 4, 1, '#d8f0f8');
      p.rect(x - 1, 5, 6, 5, liquid);
      p.set(x, 6, '#ffffff');
    };
    flask(6, '#68e070'); flask(16, '#f070c0'); flask(34, '#60b0ff');
    p.rect(24, 4, 6, 6, '#e8a040'); p.hline(24, 29, 4, '#f8d040'); p.set(26, 2, '#e04040'); p.set(26, 3, '#f8f0d0');
    p.rect(0, 10, 48, 6, '#d8dce4'); p.hline(0, 47, 10, '#f4f6fa'); p.hline(0, 47, 15, '#a0a4b0');
    p.rect(1, 16, 46, 16, '#7c8ca0');
    for (const x of [1, 17, 33]) { p.rect(x + 2, 18, 12, 12, '#90a0b4'); p.hline(x + 6, x + 9, 22, '#3c4450'); }
    p.outline();
    return p.canvas();
  }

  function desk() {
    const p = new Pix(32, 26);
    p.rect(2, 4, 12, 8, '#2a2a34'); p.rect(3, 5, 10, 6, '#5ab0e8'); p.hline(4, 9, 6, '#c8ecff');
    p.rect(1, 11, 14, 1, '#4a4a58');
    p.rect(20, 7, 5, 8, '#1c1c24'); p.rect(21, 8, 3, 5, '#88f0b0');
    p.rect(0, 12, 32, 5, '#b07840'); p.hline(0, 31, 12, '#d09858'); p.hline(0, 31, 16, '#7a4c24');
    p.rect(1, 17, 4, 9, '#8a5a30'); p.rect(27, 17, 4, 9, '#8a5a30'); p.rect(6, 17, 10, 6, '#9a6838'); p.hline(9, 12, 19, '#5a3818');
    p.outline();
    return p.canvas();
  }

  function bed() {
    const p = new Pix(16, 32);
    p.rect(0, 0, 16, 6, '#8a5a30'); p.hline(0, 15, 0, '#b07840');
    p.rect(1, 6, 14, 25, '#f0ece4');
    p.rect(3, 7, 10, 5, '#ffffff'); p.hline(3, 12, 11, '#d0ccd8');
    p.rect(1, 13, 14, 18, '#4878c8'); p.hline(1, 14, 13, '#78a8f0'); p.hline(1, 14, 14, '#78a8f0');
    for (let y = 17; y < 30; y += 4) p.hline(2, 13, y, '#3a60a8');
    p.rect(0, 30, 16, 2, '#8a5a30');
    p.outline();
    return p.canvas();
  }

  function bookshelf() {
    const p = new Pix(16, 30);
    p.rect(0, 0, 16, 30, '#8a5a30');
    const cols = ['#d04848', '#4878c8', '#58a848', '#e8b840', '#a058c0', '#e07838'];
    for (let s = 0; s < 3; s++) {
      const y = 2 + s * 9;
      p.rect(1, y, 14, 7, '#4a2c18');
      for (let x = 1; x < 15; x++) {
        if (G.hash(x, s, 4) < 0.15) continue;
        const h = 5 + Math.floor(G.hash(x, s, 5) * 2);
        p.vline(x, y + 7 - h, y + 6, cols[Math.floor(G.hash(x, s, 6) * cols.length)]);
      }
    }
    p.outline();
    return p.canvas();
  }

  function poster() {
    const p = new Pix(16, 12);
    p.rect(0, 0, 16, 12, '#f8f4ec');
    const cols = ['#f0a0a0', '#f8d880', '#a0d8f0', '#b8e8a0', '#d8b8f0'];
    for (let y = 2; y < 10; y += 2) {
      for (let x = 1; x < 15; x += 2) {
        if (y < 6 && x > 2 && x < 13) continue;
        p.set(x, y, cols[(x + y) % cols.length]);
      }
    }
    p.hline(3, 12, 1, '#404050');
    p.outline();
    return p.canvas();
  }

  function rockTable() {
    const p = new Pix(16, 22);
    p.rect(1, 6, 3, 4, '#909098'); p.set(1, 6, '#c0c0c8');
    p.rect(5, 4, 4, 6, '#e8a0b8'); p.set(6, 4, '#ffd0e0'); p.set(7, 2, '#c890f0'); p.set(7, 3, '#c890f0');
    p.rect(10, 5, 5, 5, '#6a6050'); p.hline(10, 14, 7, '#f0f0f0');
    p.rect(0, 10, 16, 4, '#a07040'); p.hline(0, 15, 10, '#c89058');
    p.rect(1, 14, 2, 8, '#7a5028'); p.rect(13, 14, 2, 8, '#7a5028');
    p.outline();
    return p.canvas();
  }

  function plant() {
    const p = new Pix(16, 22);
    p.rect(6, 2, 4, 12, '#4aa048'); p.vline(9, 2, 13, '#2e7a30'); p.set(7, 1, '#4aa048'); p.set(8, 1, '#4aa048');
    p.rect(2, 6, 3, 2, '#4aa048'); p.rect(2, 3, 2, 3, '#4aa048');
    p.rect(11, 8, 3, 2, '#4aa048'); p.rect(12, 5, 2, 3, '#4aa048');
    p.set(7, 0, '#f080a0');
    p.rect(4, 14, 8, 7, '#c86838'); p.hline(3, 12, 14, '#e08850'); p.vline(11, 15, 20, '#a04c28');
    p.outline();
    return p.canvas();
  }

  function cart() {
    const p = new Pix(36, 38);
    // umbrella
    for (let y = 0; y < 10; y++) {
      const half = Math.min(17, 4 + y * 2);
      for (let x = 18 - half; x < 18 + half; x++) p.set(x, y, Math.floor((x - 18 + 40) / 5) % 2 ? '#ffffff' : '#f070a8');
    }
    p.hline(1, 34, 10, '#c04880');
    p.vline(17, 11, 20, '#808090'); p.vline(18, 11, 20, '#a0a0b0');
    // cart body
    p.rect(2, 20, 32, 12, '#f8f0e0'); p.hline(2, 33, 20, '#c88838'); p.hline(2, 33, 21, '#e8b860');
    p.rect(4, 23, 28, 7, '#f8e8c8');
    p.rect(6, 24, 6, 5, '#c88838'); p.rect(13, 24, 6, 5, '#f8f0d8'); p.rect(20, 24, 6, 5, '#7a4818');
    p.rect(7, 22, 4, 3, '#e8b860'); p.rect(14, 22, 4, 3, '#ffffff'); p.rect(21, 22, 4, 3, '#a06030');
    p.hline(2, 33, 31, '#c8b898');
    p.rect(5, 32, 5, 5, '#3a3040'); p.rect(26, 32, 5, 5, '#3a3040'); p.set(7, 34, '#a0a0b0'); p.set(28, 34, '#a0a0b0');
    p.outline();
    return p.canvas();
  }

  // A glacial erratic: speckled granite (with pink feldspar), cracks and moss.
  function boulder() {
    const p = new Pix(64, 48);
    for (let y = 0; y < 48; y++) {
      for (let x = 0; x < 64; x++) {
        const dx = (x + 0.5 - 32) / 30, dy = (y + 0.5 - 27) / 20;
        const a = Math.atan2(dy, dx);
        const wob = 1 + (G.hash(Math.floor((a + 4) * 3), 1, 9) - 0.5) * 0.14;
        if (dx * dx + dy * dy > wob * wob) continue;
        const s = dx * 0.5 + dy * 0.8 + (G.hash(x >> 1, y >> 1, 3) - 0.5) * 0.35;
        p.set(x, y, s < -0.55 ? '#cac6c0' : s < 0.05 ? '#9c9892' : s < 0.5 ? '#78746e' : '#5a5650');
      }
    }
    for (let i = 0; i < 140; i++) {
      const x = Math.floor(G.hash(i, 1, 4) * 64), y = Math.floor(G.hash(i, 2, 4) * 48);
      if (!p.get(x, y)) continue;
      const h = G.hash(i, 3, 4);
      p.set(x, y, h < 0.4 ? '#e8e4de' : h < 0.75 ? '#3e3a36' : '#c8948a');
    }
    for (const [x0, y0, len, dir] of [[20, 14, 9, 1], [40, 22, 8, -1], [30, 32, 7, 1]]) {
      for (let t = 0; t < len; t++) p.set(x0 + t * dir, y0 + t + (t >> 2), '#2e2a28');
    }
    for (let y = 6; y < 18; y++) {
      for (let x = 10; x < 54; x++) {
        if (!p.get(x, y) || p.get(x, y - 2) || G.hash(x, y, 8) > 0.55) continue;
        p.set(x, y, G.hash(x, y, 9) < 0.5 ? '#5a9a40' : '#3e7a30');
        p.set(x, y + 1, '#3e7a30');
      }
    }
    p.outline();
    return p.canvas();
  }

  function car(color) {
    const p = new Pix(24, 30);
    const D = shade(color, -0.3), L = shade(color, 0.3), glass = '#34496a', glassL = '#8ab0d8';
    for (const [x, y] of [[1, 5], [20, 5], [1, 20], [20, 20]]) p.rect(x, y, 3, 6, '#1e1e24');
    p.rect(3, 1, 18, 28, color);
    p.vline(20, 1, 28, D); p.hline(3, 20, 28, D); p.vline(3, 1, 28, L);
    p.rect(5, 8, 14, 4, glass); p.hline(6, 9, 9, glassL);
    p.rect(5, 12, 14, 8, L); p.hline(5, 18, 12, shade(color, 0.45));
    p.rect(5, 20, 14, 3, glass);
    p.set(4, 1, '#f8f0b0'); p.set(19, 1, '#f8f0b0');
    p.set(4, 28, '#e03030'); p.set(19, 28, '#e03030');
    p.outline();
    return p.canvas();
  }

  function stand(awning, label, labelColor) {
    const p = new Pix(64, 48);
    p.rect(4, 12, 56, 14, '#5a3a28');
    p.rect(2, 12, 2, 30, '#8a6040'); p.rect(60, 12, 2, 30, '#8a6040');
    p.rect(4, 14, 56, 9, '#f8f0d8');
    p.rect(2, 26, 60, 21, '#c08850');
    p.rect(2, 26, 60, 3, '#e0b070');
    for (let x = 10; x < 60; x += 12) p.vline(x, 29, 46, '#a06c3c');
    for (let y = 2; y < 12; y++) for (let x = 0; x < 64; x++) p.set(x, y, Math.floor(x / 8) % 2 ? '#ffffff' : awning);
    for (let x = 0; x < 64; x++) if (x % 8 > 0 && x % 8 < 7) p.set(x, 12, Math.floor(x / 8) % 2 ? '#ffffff' : awning);
    p.hline(0, 63, 1, shade(awning, -0.25));
    p.outline();
    const c = p.canvas();
    const x = c.getContext('2d');
    G.font.draw(x, label, 32 - Math.round(G.font.width(label) / 2), 14, labelColor || '#c03030');
    return c;
  }

  function booth() {
    const p = new Pix(48, 44);
    for (let y = 0; y < 10; y++) p.hline(10 - y, 37 + y, y, y % 3 === 2 ? '#a02428' : '#d03038');
    p.rect(2, 10, 44, 33, '#f0e8d8'); p.vline(45, 10, 42, '#c8bca8');
    p.rect(8, 22, 32, 11, '#34496a'); p.hline(10, 18, 24, '#8ab0d8');
    p.rect(6, 33, 36, 3, '#a87848');
    p.rect(2, 11, 44, 10, '#2a3a5a');
    p.outline();
    const c = p.canvas();
    G.font.draw(c.getContext('2d'), 'TICKETS', 24 - Math.round(G.font.width('TICKETS') / 2), 12, '#f8d850');
    return c;
  }

  function hayBale() {
    const p = new Pix(16, 14);
    p.rect(1, 2, 14, 11, '#e0c060');
    p.hline(1, 14, 2, '#f4dc88');
    for (let i = 0; i < 18; i++) p.set(1 + G.hash(i, 1, 5) * 14, 3 + G.hash(i, 2, 5) * 10, G.hash(i, 3, 5) < 0.5 ? '#c09838' : '#f8e8a0');
    p.vline(5, 2, 12, '#8a6a30'); p.vline(11, 2, 12, '#8a6a30');
    p.rect(1, 10, 14, 3, '#c8a448');
    p.outline();
    return p.canvas();
  }

  function potty() {
    const p = new Pix(16, 30);
    p.rect(1, 2, 14, 27, '#3a78c8');
    p.rect(1, 0, 14, 3, '#f0f0f0'); p.hline(2, 13, 0, '#ffffff');
    p.rect(3, 6, 10, 22, '#4a88d8');
    p.hline(5, 10, 8, '#2a5898'); p.hline(5, 10, 10, '#2a5898');
    p.rect(10, 15, 2, 4, '#e8e8e8');
    p.set(5, 13, '#f8d040'); p.set(6, 13, '#f8d040');
    p.vline(14, 2, 28, '#2a5898');
    p.outline();
    return p.canvas();
  }

  function trashCan() {
    const p = new Pix(12, 16);
    p.rect(1, 3, 10, 12, '#4a7a4a'); p.rect(0, 1, 12, 3, '#5a8a5a'); p.hline(1, 10, 1, '#7aaa7a');
    for (const x of [3, 6, 9]) p.vline(x, 5, 13, '#3a5a3a');
    p.outline();
    return p.canvas();
  }

  // Wrestling ring seen from above: canvas, ropes, corner posts and steps.
  function ring() {
    const p = new Pix(128, 112);
    p.rect(2, 4, 124, 92, '#ece8e0');
    for (let i = 0; i < 60; i++) p.set(4 + G.hash(i, 1, 6) * 120, 6 + G.hash(i, 2, 6) * 88, '#dcd8ce');
    for (let y = 0; y < 112; y++) for (let x = 0; x < 128; x++) {
      const d = Math.hypot(x - 64, y - 50);
      if (d > 15 && d < 18) p.set(x, y, '#d03040');
      if (d <= 15 && Math.abs(x - 64) + Math.abs(y - 50) < 9) p.set(x, y, '#e8b830');
    }
    p.rect(0, 96, 128, 16, '#2848a8'); p.hline(0, 127, 96, '#4868c8'); p.hline(0, 127, 111, '#18307a');
    for (let x = 4; x < 124; x += 10) p.vline(x, 99, 108, '#3858b8');
    const ropes = ['#d03040', '#f8f8f8', '#3058c8'];
    ropes.forEach((col, i) => {
      const o = 6 + i * 3;
      p.hline(6, 121, o, col); p.hline(6, 121, 92 - i * 3, col);
      p.vline(o, 6, 92, col); p.vline(121 - i * 3, 6, 92, col);
    });
    for (const [x, y] of [[2, 2], [118, 2], [2, 86], [118, 86]]) { p.rect(x, y, 8, 8, '#9aa0aa'); p.rect(x + 2, y + 2, 4, 4, '#d03040'); }
    p.rect(52, 97, 24, 15, '#80889a');
    for (let y = 100; y < 112; y += 4) p.hline(52, 75, y, '#5a6274');
    p.outline();
    return p.canvas();
  }

  function concession() {
    const p = new Pix(64, 30);
    p.rect(4, 0, 18, 12, '#d8eef8'); p.rect(5, 6, 16, 6, '#f8e070');
    for (let i = 0; i < 12; i++) p.set(6 + G.hash(i, 1, 7) * 14, 3 + G.hash(i, 2, 7) * 4, '#fff4c0');
    p.rect(4, 0, 18, 1, '#d03038');
    p.rect(34, 2, 12, 10, '#404858'); p.rect(36, 4, 3, 3, '#d03038'); p.rect(41, 4, 3, 3, '#3878d8');
    p.rect(50, 6, 6, 6, '#e8e8f0'); p.rect(51, 4, 4, 2, '#d03038');
    p.rect(0, 12, 64, 4, '#e8e0d0'); p.hline(0, 63, 12, '#ffffff');
    p.rect(0, 16, 64, 14, '#c03040');
    for (let x = 8; x < 64; x += 16) p.rect(x, 19, 8, 8, '#e04858');
    p.outline();
    return p.canvas();
  }

  function lockerDoor() {
    const p = new Pix(16, 24);
    p.rect(1, 2, 14, 22, '#7a8292');
    p.rect(3, 5, 10, 5, '#a8c0d8');
    p.rect(1, 0, 14, 2, '#c03040');
    p.vline(13, 3, 23, '#5a6272');
    p.set(11, 14, '#f8d040'); p.set(11, 15, '#f8d040');
    p.outline();
    return p.canvas();
  }

  // The booby-trapped Christmas present: red paper, gold ribbon, a bow on top.
  function gift(lit) {
    const p = new Pix(14, 14);
    p.rect(1, 4, 12, 9, '#d83038');
    p.rect(1, 4, 12, 2, '#e85a60');
    p.vline(12, 6, 12, '#a82028');
    p.vline(6, 4, 12, '#f8d040'); p.vline(7, 4, 12, '#f8d040');
    p.hline(1, 12, 8, '#f8d040');
    p.set(4, 2, '#f8d040'); p.set(5, 3, '#f8d040'); p.set(3, 3, '#f8d040');
    p.set(9, 2, '#f8d040'); p.set(8, 3, '#f8d040'); p.set(10, 3, '#f8d040');
    p.outline();
    if (lit) { p.set(7, 0, '#ffffff'); p.set(6, 1, '#f8d040'); p.set(8, 1, '#ff9a28'); p.set(7, 1, '#f8d040'); }
    return p.canvas();
  }

  // Nate's brown corduroy flat cap, for the item-get pose.
  function capIcon() {
    const p = new Pix(16, 10);
    const cap = '#86683e', capL = '#a8885a', capD = '#5e4628';
    for (let x = 3; x <= 12; x++) p.set(x, 2, cap);
    for (let x = 2; x <= 13; x++) { p.set(x, 3, x % 2 ? capL : cap); p.set(x, 4, cap); p.set(x, 5, cap); }
    p.hline(5, 9, 1, cap); p.hline(6, 8, 1, capL);
    p.hline(1, 14, 6, capD); p.hline(10, 15, 7, capD);
    p.outline();
    return p.canvas();
  }

  function ringLogo() {
    const p = new Pix(48, 48);
    for (let y = 0; y < 48; y++) for (let x = 0; x < 48; x++) {
      const d = Math.hypot(x + 0.5 - 24, y + 0.5 - 24);
      if (d > 17 && d < 21) p.set(x, y, '#d03040');
      if (Math.abs(x + 0.5 - 24) + Math.abs(y + 0.5 - 24) < 12) p.set(x, y, '#e8b830');
    }
    return p.canvas();
  }

  function scale2(src) {
    const c = G.canvas(src.width * 2, src.height * 2);
    c.getContext('2d').drawImage(src, 0, 0, c.width, c.height);
    return c;
  }

  function shadowSprite(w) {
    const c = G.canvas(w, 4);
    const x = c.getContext('2d');
    x.fillStyle = 'rgba(20,10,30,0.28)';
    x.fillRect(1, 0, w - 2, 4);
    x.fillRect(0, 1, w, 2);
    return c;
  }

  // ================================================================ TITLE / INTRO ART
  function ditchScene() {
    const c = G.canvas(240, 160);
    const x = c.getContext('2d');
    const bands = ['#78c0f8', '#88c8f8', '#98d0f8', '#a8d8f8', '#b8e0f8', '#c8e8f8'];
    bands.forEach((col, i) => { x.fillStyle = col; x.fillRect(0, i * 14, 240, 14); });
    // clouds
    x.fillStyle = '#ffffff';
    [[30, 18, 34], [150, 30, 44], [200, 12, 26]].forEach(([cx, cy, w]) => {
      x.fillRect(cx, cy, w, 6); x.fillRect(cx + 4, cy - 4, w - 12, 4); x.fillRect(cx + 8, cy - 7, w - 22, 3);
    });
    // distant tree line
    for (let i = 0; i < 240; i += 2) {
      const h = 8 + Math.sin(i * 0.15) * 3 + G.hash(i, 3) * 5;
      x.fillStyle = '#3a8048'; x.fillRect(i, 84 - h, 2, h);
    }
    x.fillStyle = '#2e6a3c'; x.fillRect(0, 82, 240, 4);
    // field
    x.fillStyle = '#6cc050'; x.fillRect(0, 86, 240, 74);
    for (let i = 0; i < 260; i++) {
      x.fillStyle = i % 3 ? '#58a840' : '#88d868';
      x.fillRect(G.hash(i, 1) * 240, 88 + G.hash(i, 2) * 72, 1, 2);
    }
    // road
    x.fillStyle = '#5a5a68'; x.fillRect(0, 94, 240, 14);
    x.fillStyle = '#f8d850'; for (let i = 0; i < 240; i += 16) x.fillRect(i, 100, 8, 2);
    x.fillStyle = '#3a3a48'; x.fillRect(0, 108, 240, 2);
    // THE ditch
    x.fillStyle = '#7a5a30'; x.fillRect(0, 126, 240, 18);
    x.fillStyle = '#5a4020'; x.fillRect(0, 128, 240, 14);
    x.fillStyle = '#4878c0'; x.fillRect(0, 131, 240, 9);
    x.fillStyle = '#78b0f0'; for (let i = 0; i < 240; i += 12) x.fillRect(i + (i % 24 ? 3 : 0), 133, 6, 1);
    x.fillStyle = '#3a8030'; x.fillRect(0, 125, 240, 2); x.fillRect(0, 143, 240, 2);
    // sign
    x.fillStyle = '#5a3818'; x.fillRect(176, 104, 3, 24);
    x.fillStyle = '#1c1424'; x.fillRect(148, 95, 60, 14);
    x.fillStyle = '#2e8a48'; x.fillRect(149, 96, 58, 12);
    x.fillStyle = '#e8f0e8'; x.fillRect(150, 97, 56, 1);
    G.font.draw(x, 'No.1 DITCH', 178 - Math.round(G.font.width('No.1 DITCH') / 2), 98, '#ffffff');
    return c;
  }

  // ================================================================ EXPORTS
  G.art = {
    OUT, shade, Pix, fromRows, mirror, flash, person, P, scale2,
    tile, tree, building,
  };

  // Build everything that doesn't depend on content.
  G.art.init = function () {
    const S = G.spr = {};
    S.heart = { full: heartIcon('full'), half: heartIcon('half'), empty: heartIcon('empty') };
    S.tooth = toothIcon(false);
    S.toothGold = toothIcon(true);
    S.doosh = fromRows(dooshRows, ICON_PAL).canvas();
    S.hammer = hammerSprites();
    S.six = sixFrames();
    S.chest = chestSprites();
    S.sign = signSprite();
    S.bang = emoteSprite('!');
    S.huh = emoteSprite('?');
    S.eggmas = eggmas();
    S.bench = labBench();
    S.desk = desk();
    S.bed = bed();
    S.shelf = bookshelf();
    S.poster = poster();
    S.rocks = rockTable();
    S.plant = plant();
    S.cart = cart();
    S.shadow = shadowSprite(12);
    S.shadowBig = shadowSprite(20);
    S.ditch = ditchScene();
    S.trees = [tree(1), tree(2), tree(3)];
    S.boulder = boulder();
    S.cars = ['#d03038', '#3878d8', '#f0f0f0', '#e8b830', '#38a048', '#303038'].map(car);
    S.standFunnel = stand('#e04878', 'Funnel Cake');
    S.standCorn = stand('#e8a020', 'Corn Dogs', '#a05010');
    S.standLemon = stand('#e8d020', 'Lemonade', '#3a8a30');
    S.booth = booth();
    S.hay = hayBale();
    S.potty = potty();
    S.trash = trashCan();
    S.ring = ring();
    S.concession = concession();
    S.lockerDoor = lockerDoor();
    S.gift = gift(false);
    S.giftLit = gift(true);
    S.ringLogo = ringLogo();
    S.cap = capIcon();
  };
})();
