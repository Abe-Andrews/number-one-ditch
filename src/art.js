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
    set.torso = make('right', 0, 'torso');
    return set;
  }

  function drawPerson(p, c, dir, step, pose) {
    const y0 = 1, ty = y0 + 10, ly = ty + c.torso, sy = ly + c.legs;
    if (dir === 'right') return drawSide(p, c, step, y0, ty, ly, sy, pose);
    const back = dir === 'up';
    const bx0 = c.big ? 3 : c.wide ? 4 : 5, bx1 = c.big ? 12 : c.wide ? 11 : 10;
    const ax0 = bx0 - 1, ax1 = bx1 + 1;

    // legs / skirt
    if (c.dress) {
      skirtFront(p, c, step, ly, sy);
    } else {
      p.hline(c.big ? 4 : 5, c.big ? 11 : 10, ly, c.pants);
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
    if (c.big) {
      // rounded shoulders and a belly that sticks out a little at the sides
      p.d[ty * p.w + bx0] = null; p.d[ty * p.w + bx1] = null;
      for (let y = ty + 3; y < ly - 1; y++) { p.set(bx0 - 1, y, c.shirt); p.set(bx1 + 1, y, c.shirtD); }
      if (!back) p.hline(bx0 + 2, bx1 - 2, ly - 2, shade(c.shirt, 0.12));
    }
    if (!back) {
      if (c.neckline) { p.hline(6, 9, ty, c.skin); if (c.necklace) p.set(8, ty, c.necklace); }
      if (c.neck) { p.set(7, ty, c.neck); p.set(8, ty, c.neck); }
      if (c.collar) { p.set(6, ty, c.collar); p.set(9, ty, c.collar); p.set(7, ty, c.skin); p.set(8, ty, c.skin); p.set(7, ty + 1, c.shirtD); }
    }
    // over-ear headphones resting around the neck (the cups on the collarbones; the band behind)
    if (c.headphones) {
      if (back) p.hline(6, 9, ty, c.headphones);
      else { p.rect(5, ty, 2, 2, c.headphones); p.rect(9, ty, 2, 2, c.headphones); p.set(5, ty, shade(c.headphones, 0.4)); p.set(10, ty, shade(c.headphones, 0.4)); }
    }
    if (c.logo && !back) p.set(bx1 - 1, ty + 2, c.logo);
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
      headExtras(p, c, y0, 'back');
      hatBack(p, c, y0, ty);
      return;
    }
    p.set(5, y0 + 5, c.eyes); p.set(5, y0 + 6, c.eyes);
    p.set(10, y0 + 5, c.eyes); p.set(10, y0 + 6, c.eyes);
    if (c.smile && c.grin) { p.hline(5, 10, y0 + 8, c.smile); p.set(8, y0 + 8, '#5a2a24'); p.set(5, y0 + 8, c.skinD); p.set(10, y0 + 8, c.skinD); }
    else if (c.smile) { p.set(6, y0 + 8, c.skinD); p.hline(7, 8, y0 + 8, c.smile); p.set(9, y0 + 8, c.skinD); }
    else p.hline(7, 8, y0 + 8, c.skinD);
    if (c.blush) { p.set(4, y0 + 7, BLUSH); p.set(11, y0 + 7, BLUSH); }
    if (c.goatee) p.hline(6, 9, y0 + 9, c.goatee);
    hairFront(p, c, y0, ty);
    if (c.beard) {
      const b = c.beard;
      if (!c.beardLow) { p.set(3, y0 + 6, b); p.set(12, y0 + 6, b); }
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
    headExtras(p, c, y0, 'front');
    hatFront(p, c, y0, ty);
  }

  // Extras drawn over the head: messy tufts, sport sunglasses pushed up on the
  // forehead (Tyler), and hypnotized spiral eyes (whoever Father Eggmas got to).
  function headExtras(p, c, y0, view) {
    if (c.bangs && view === 'front') {
      // soft, wispy bangs parted in the middle (Nani)
      const H = c.hair, D = c.hairD;
      for (const [x, col] of [[4, D], [5, H], [6, D], [9, D], [10, H], [11, D]]) p.set(x, y0 + 3, col);
      p.set(4, y0 + 4, D); p.set(11, y0 + 4, D);
    }
    if (c.messy) {
      const H = c.hair, D = c.hairD;
      for (const [x, d] of [[4, 0], [6, 1], [8, 0], [10, 1], [11, 0]]) p.set(x, y0 - 1 + d, d ? D : H);
      p.set(3, y0 + 1, H); p.set(12, y0 + 1, D);
    }
    if (c.shades) {
      const g = c.shades;
      if (view === 'back') { p.hline(3, 12, y0 + 3, g); return; }
      if (view === 'side') { p.hline(5, 13, y0 + 2, g); p.hline(9, 12, y0 + 3, g); p.set(11, y0 + 2, '#5a7088'); return; }
      p.hline(3, 12, y0 + 2, g); p.hline(4, 6, y0 + 3, g); p.hline(9, 11, y0 + 3, g);
      p.set(5, y0 + 2, '#5a7088'); p.set(10, y0 + 2, '#5a7088');
    }
    // super bushy eyebrows (Tom): a heavy bar over each eye, nearly meeting in the middle,
    // with tufts at the outer corners
    if (c.brows && view === 'front') {
      const B = c.brows, BL = shade(c.brows, 0.35);
      p.hline(4, 11, y0 + 3, c.skin); // a clear forehead, so the brows stand out
      for (const [x0, x1, t0, t1] of [[3, 6, 4, 5], [9, 12, 10, 11]]) {
        p.hline(x0, x1, y0 + 4, B);
        p.set(t0, y0 + 3, B); p.set(t1, y0 + 3, BL);
      }
      p.set(3, y0 + 5, B); p.set(12, y0 + 5, B);
    }
    // older faces: little lines under the eyes
    if (c.wrinkles && view === 'front') { p.set(5, y0 + 7, c.skinD); p.set(10, y0 + 7, c.skinD); }
    if (c.wrinkles && view === 'side') p.set(10, y0 + 7, c.skinD);
    if (c.brows && view === 'side') {
      p.hline(8, 12, y0 + 4, c.brows); p.set(12, y0 + 5, c.brows); p.set(10, y0 + 4, shade(c.brows, 0.35));
    }
    if (c.swirl && view === 'front') {
      for (const ex of [5, 10]) { p.set(ex - 1, y0 + 5, '#f8f8f8'); p.set(ex + 1, y0 + 6, '#f8f8f8'); p.set(ex, y0 + 4, c.eyes); }
    }
    if (c.swirl && view === 'side') { p.set(9, y0 + 5, '#f8f8f8'); p.set(11, y0 + 6, '#f8f8f8'); }
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
    // a chest tattoo (McGregor's), inked over bare skin
    if (c.tattoo && y - ty >= 1 && y - ty <= 3 && x >= 6 && x <= 9 && (x * 5 + y * 3) % 3 === 0) return c.tattoo;
    if (c.pattern === 'plaid') {
      const vx = x % 3 === 1, hy = (y - ty) % 3 === 2;
      if (vx && hy) return c.plaidW;
      if (vx || hy) return c.plaidL;
      return edge ? c.shirtD : c.shirt;
    }
    if (c.pattern === 'stripes') return x % 2 ? '#1c1c24' : c.shirt;
    if (c.pattern === 'chestStripes') { const r = y - ty; return r === 2 || r === 4 ? '#f0f0f0' : edge ? c.shirtD : c.shirt; }
    if (c.pattern === 'stars') return G.hash(x, y, 9) < 0.17 ? '#24305a' : edge ? c.shirtD : c.shirt;
    if (c.pattern === 'cosmic') {
      // a bright space print: white specks and little bursts of pink and cyan on blue (Dr. Nataro)
      const h = G.hash(x, y, 11);
      if (h < 0.1) return '#f8f8ff';
      if (h < 0.2) return '#e050c0';
      if (h < 0.28) return '#50d8f0';
      return edge ? c.shirtD : c.shirt;
    }
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
    if (s === 'bald') {
      p.hline(6, 7, y0 + 1, shade(c.skin, 0.18));
    } else if (s === 'short') {
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
    } else if (s === 'cropped') {
      // short, textured hair on top; temples just a little higher (Dad)
      top(3);
      p.hline(4, 11, y0 + 3, H);
      p.set(4, y0 + 3, D); p.set(11, y0 + 3, D);
      // short sideburns only, so the hair doesn't run down into the beard
      p.set(3, y0 + 3, H); p.set(12, y0 + 3, H);
      p.set(3, y0 + 4, D); p.set(12, y0 + 4, D);
      for (let x = 4; x <= 11; x += 2) p.set(x, y0 + 1, L);
      p.set(5, y0, L); p.set(8, y0, L);
      p.set(6, y0 + 3, D); p.set(9, y0 + 3, D);
    } else if (s === 'mop') {
      // a mop-top: a full fringe straight across, down to the eyebrows, and the sides down over
      // the ears to the jaw (the Paul McCartney Lady)
      top(4);
      p.hline(4, 11, y0 + 4, H);
      for (const x of [5, 8, 10]) p.set(x, y0 + 4, D);
      for (let y = y0 + 3; y <= y0 + 8; y++) { p.set(2, y, D); p.set(3, y, H); p.set(12, y, H); p.set(13, y, D); }
      p.set(3, y0 + 9, D); p.set(12, y0 + 9, D);
      p.hline(5, 9, y0 + 1, L); p.set(6, y0, L); p.set(10, y0 + 2, L);
    } else if (s === 'locs') {
      // shoulder-length twists (Bismarck): a few hanging down over the forehead, the rest framing
      // the face, every other pixel a shade darker so they read as separate twists
      top(3);
      for (let x = 3; x <= 12; x++) p.set(x, y0 + 3, x % 2 ? D : H);
      for (const x of [4, 7, 10]) p.set(x, y0 + 4, D);
      for (let y = y0 + 4; y <= ty + 2; y++) { p.set(2, y, y % 2 ? D : H); p.set(3, y, y % 2 ? H : D); p.set(12, y, y % 2 ? D : H); p.set(13, y, y % 2 ? H : D); }
      p.set(5, y0 + 1, L); p.set(8, y0, L); p.set(10, y0 + 1, L);
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
      const end = c.hairEnd != null ? ty + c.hairEnd : s === 'shoulder' ? ty + 1 : ty + 5;
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
    if (s === 'bald') { p.hline(6, 8, y0 + 1, shade(c.skin, 0.15)); return; }
    const rows = s === 'buzz' ? 7 : 9;
    for (let i = 0; i < rows; i++) p.hline(HEAD[i][0], HEAD[i][1], y0 + i, i >= rows - 2 ? D : H);
    p.hline(6, 9, y0 + 1, L);
    p.set(3, y0 + 5, c.skin); p.set(12, y0 + 5, c.skin);
    if (s === 'mop') {
      // the mop-top covers the ears and comes down over the back of the neck
      for (let y = y0 + 3; y <= y0 + 8; y++) { p.set(2, y, D); p.hline(3, 12, y, y > y0 + 7 ? D : H); p.set(13, y, D); }
      p.hline(4, 11, y0 + 9, D);
    }
    if (s === 'locs') {
      for (let y = y0 + 3; y <= ty + 2; y++) for (let x = 2; x <= 13; x++) p.set(x, y, x % 2 ? D : H);
    }
    if (s === 'long' || s === 'wavy' || s === 'shoulder') {
      p.hline(5, 10, y0 + 9, H);
      const end = c.hairEnd != null ? ty + c.hairEnd : s === 'shoulder' ? ty + 1 : ty + 5;
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
      // (capHigh: worn up off the forehead, so big eyebrows show under the brim)
      const brim = c.capHigh ? 2 : 3;
      for (let i = 0; i < brim; i++) p.hline(HEAD[i][0], HEAD[i][1], y0 + i, c.hat);
      p.hline(5, 7, y0, c.hatL);
      if (c.patch) { p.set(7, y0 + 1, c.patch); p.set(8, y0 + 1, c.patch); }
      p.hline(3, 12, y0 + brim, c.hatD);
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

  // (pose 'torso': no arms or legs, for a fighter's jointed limbs to be drawn on in Doron's fight night)
  function drawSide(p, c, step, y0, ty, ly, sy, pose) {
    const limbs = pose !== 'torso';
    const sx0 = c.big ? 4 : c.wide ? 5 : 6, sx1 = c.big ? 11 : c.wide ? 10 : 9;
    const H = c.hair, D = c.hairD, s = c.hairStyle;
    const longHair = s === 'long' || s === 'wavy' || s === 'shoulder' || s === 'locs';
    const hairEnd = c.hairEnd != null ? ty + c.hairEnd : s === 'shoulder' ? ty + 1 : s === 'locs' ? ty + 2 : ty + 5;

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
    if (!limbs) {
      // (none)
    } else if (c.dress) {
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
    if (c.big) for (let y = ty + 2; y < ly; y++) p.set(sx1 + 1 + (y > ty + 3 && y < ly - 1 ? 1 : 0), y, c.shirt), p.set(sx1 + 1, y, c.shirt);
    if (c.neckline) p.set(sx1, ty, c.skin);
    if (c.collar) { p.set(sx1 - 1, ty, c.collar); p.set(sx1, ty, c.skin); }
    if (c.neck) p.set(sx1, ty, c.neck);
    if (c.headphones) { p.rect(sx1 - 2, ty, 2, 2, c.headphones); p.set(sx1 - 2, ty, shade(c.headphones, 0.4)); }
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
    for (let y = ty + 1; y <= (limbs ? end : -1); y++) {
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
    if (s === 'bald') {
      p.hline(5, 6, y0 + 1, shade(c.skin, 0.18));
    } else if (s === 'buzz') {
      top(2); p.hline(3, 10, y0 + 2, D);
      for (let y = y0 + 3; y <= y0 + 5; y++) p.hline(3, 5, y, D);
    } else if (s === 'receding') {
      p.hline(5, 8, y0, H); p.hline(4, 7, y0 + 1, H); p.hline(3, 6, y0 + 2, H);
      for (let y = y0 + 3; y <= y0 + 6; y++) p.hline(3, 5, y, y > y0 + 4 ? D : H);
    } else if (s === 'cropped') {
      top(3);
      p.hline(3, 10, y0 + 3, H); p.set(10, y0 + 3, D);
      for (let y = y0 + 4; y <= y0 + 6; y++) p.hline(3, 5, y, y > y0 + 5 ? D : H);
      for (let x = 4; x <= 10; x += 2) p.set(x, y0 + 1, c.hairL);
    } else if (s === 'mop') {
      top(4);
      p.hline(3, 11, y0 + 4, H); p.set(9, y0 + 4, D); p.set(11, y0 + 4, D);
      for (let y = y0 + 5; y <= y0 + 8; y++) p.hline(3, 7, y, y > y0 + 7 ? D : H);
      p.set(2, y0 + 5, D); p.set(2, y0 + 6, D); p.set(2, y0 + 7, D);
      p.hline(5, 8, y0 + 1, c.hairL);
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
        if (s === 'locs') for (let y = y0 + 3; y <= y0 + 9; y++) { p.set(4, y, D); p.set(6, y, D); }
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
    if (c.goatee) p.hline(9, 11, y0 + 9, c.goatee);
    if (c.glasses) {
      const g = c.glasses;
      p.set(9, y0 + 5, g); p.set(9, y0 + 6, g); p.set(11, y0 + 5, g); p.set(11, y0 + 6, g);
      p.set(10, y0 + 4, g); p.set(10, y0 + 7, g);
      p.set(10, y0 + 5, '#e4eef6');
      p.hline(7, 8, y0 + 5, g);
    }
    if (c.earring) p.set(7, y0 + 7, c.earring);
    headExtras(p, c, y0, 'side');
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

  // a pint of dulce de leche ice cream: maroon lid, caramel swirl band, the oval label, caramel cubes
  const DOOSH_PAL = Object.assign({}, ICON_PAL, { K: '#9e3a56', M: '#7a1e38', m: '#561226', T: '#ecc898', O: '#d8842c', h: '#f6bc64' });
  const dooshRows = [
    '.oooooooooo.',
    'oKKKKKKKKKKo',
    'oMMMMMMMMMMo',
    'ommmmmmmmmmo',
    '.oTTOTTOOTo.',
    '.oOMMMMMMTo.',
    '.oMWWWWWWMo.',
    '.oTMMMMMMOo.',
    '.oWWWWWWWWo.',
    '..oWOhcWWo..',
    '..oWccWWWo..',
    '..oWWWWWWo..',
    '...oooooo...',
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
    // ---- the Chesapeake Bay Bridge-Tunnel
    // open bay: deeper, greener water than the brook, with whitecaps
    bay(p, r, v, mask, frame) {
      p.rect(0, 0, 16, 16, '#2e6a8a');
      for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
        const w = Math.sin((x + frame * 2) * 0.6 + y * 1.1) + Math.sin((y - frame) * 0.8 + x * 0.2);
        if (w > 1.6) p.set(x, y, '#5a9ab8'); else if (w < -1.6) p.set(x, y, '#22526e');
      }
      if (v % 4 === 0) { const x = 3 + (v * 5) % 9, y = 3 + (v * 3) % 10; p.hline(x, x + 2, y, frame & 1 ? '#e8f4f8' : '#a8d0e0'); p.set(x + 1, y - 1, '#e8f4f8'); }
      const edge = (cond, fn) => { if (cond) for (let i = 0; i < 16; i++) fn(i); };
      edge(mask & 1, (i) => { p.set(i, 0, P.foam); p.set(i, 1, (i + frame) % 4 ? '#5a9ab8' : P.foam); });
      edge(mask & 4, (i) => { p.set(i, 15, '#1c4a64'); p.set(i, 14, '#22526e'); });
      edge(mask & 8, (i) => { p.set(0, i, P.foam); p.set(1, i, (i + frame) % 4 ? '#5a9ab8' : P.foam); });
      edge(mask & 2, (i) => { p.set(15, i, P.foam); p.set(14, i, (i + frame) % 4 ? '#5a9ab8' : P.foam); });
    },
    // granite riprap armoring the man-made island
    riprap(p, r) {
      p.rect(0, 0, 16, 16, '#4a4a54');
      for (let i = 0; i < 6; i++) {
        const x = Math.floor(r() * 12), y = Math.floor(r() * 12), w = 4 + Math.floor(r() * 4), h = 3 + Math.floor(r() * 3);
        const c = ['#8a8a94', '#9a9aa4', '#7a7a86'][Math.floor(r() * 3)];
        p.rect(x, y, w, h, c); p.hline(x, x + w - 1, y, '#c0c0c8'); p.hline(x, x + w - 1, y + h - 1, '#5a5a64');
      }
      if (r() < 0.3) { p.set(5 + Math.floor(r() * 6), 6, '#f8f8f8'); }
    },
    // the road deck (no grass fringe), and a lane with the yellow centerline on its left edge
    roadDeck(p, r) {
      p.rect(0, 0, 16, 16, '#4c4c56');
      for (let i = 0; i < 12; i++) p.set(r() * 16, r() * 16, r() < 0.5 ? '#5e5e6a' : '#3e3e48');
      if (r() < 0.15) p.set(4 + r() * 8, 4 + r() * 8, '#f8f8f8');
    },
    laneV(p, r, v) {
      TILE_DRAW.roadDeck(p, r);
      p.rect(0, 2, 1, 8, '#f0c838'); p.rect(1, 2, 1, 8, '#d8a828');
    },
    // the trestle's concrete parapet
    parapet(p, r) {
      p.rect(0, 0, 16, 16, '#8a8a94');
      p.rect(3, 0, 10, 16, '#c4c4cc'); p.vline(3, 0, 15, '#e4e4ec'); p.vline(12, 0, 15, '#9a9aa4');
      for (const y of [0, 8]) p.hline(3, 12, y, '#a8a8b2');
      p.vline(0, 0, 15, '#5a5a64'); p.vline(15, 0, 15, '#5a5a64');
    },
    // inside the tunnel: cream ceramic tile walls with a blue band, a raised catwalk
    tunnelWall(p, r) {
      p.rect(0, 0, 16, 16, '#e4dfcc');
      for (let y = 0; y < 16; y += 4) p.hline(0, 15, y, '#c4bea8');
      for (let x = 0; x < 16; x += 4) p.vline(x, 0, 15, '#cfc9b4');
      p.rect(6, 0, 4, 16, '#3a6ab0'); p.vline(6, 0, 15, '#5a8ad0');
      if (r() < 0.4) p.rect(Math.floor(r() * 12), Math.floor(r() * 12), 3, 2, '#bab29a');
    },
    catwalk(p, r) {
      p.rect(0, 0, 16, 16, '#9a9aa2');
      for (let i = 0; i < 6; i++) p.set(r() * 16, r() * 16, r() < 0.5 ? '#aaaab2' : '#8a8a92');
      p.vline(0, 0, 15, '#d8d8e0'); p.vline(1, 0, 15, '#b8b8c0'); p.vline(15, 0, 15, '#d8d8e0'); p.vline(14, 0, 15, '#6a6a74');
      p.hline(0, 15, 15, '#8a8a92');
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
    // ---- home (Rattlesnake Bridge Rd) tiles
    lawnL(p, r) {
      p.rect(0, 0, 16, 16, '#66c454');
      for (let i = 0; i < 4; i++) p.set(r() * 16, r() * 16, '#8ad868');
      for (let i = 0; i < 2; i++) { const x = 2 + Math.floor(r() * 12), y = 3 + Math.floor(r() * 11); p.set(x, y, '#4aa83e'); p.set(x - 1, y - 1, '#4aa83e'); p.set(x + 1, y - 1, '#4aa83e'); }
    },
    lawnD(p, r) {
      p.rect(0, 0, 16, 16, '#58b448');
      for (let i = 0; i < 4; i++) p.set(r() * 16, r() * 16, '#78cc5c');
      for (let i = 0; i < 2; i++) { const x = 2 + Math.floor(r() * 12), y = 3 + Math.floor(r() * 11); p.set(x, y, '#3e963a'); p.set(x - 1, y - 1, '#3e963a'); p.set(x + 1, y - 1, '#3e963a'); }
    },
    gravel(p, r, v, mask) {
      p.rect(0, 0, 16, 16, '#b8b4ac');
      for (let i = 0; i < 26; i++) {
        const h = r();
        p.set(r() * 16, r() * 16, h < 0.4 ? '#9a968e' : h < 0.75 ? '#d4d0c8' : '#8a7e70');
      }
      edgeFringe(p, mask, v, P.grass, '#8a867e');
    },
    pavers(p) {
      // herringbone-ish red brick walk
      p.rect(0, 0, 16, 16, '#b0583e');
      for (let y = 0; y < 16; y += 4) {
        p.hline(0, 15, y, '#d8b8a0');
        for (let x = (y / 4) % 2 ? 2 : 6; x < 16; x += 8) p.vline(x, y, y + 3, '#d8b8a0');
      }
      p.set(3, 2, '#c8684c'); p.set(11, 10, '#c8684c'); p.set(7, 14, '#984830');
    },
    roadLine(p, r, v, mask) {
      TILE_DRAW.asphalt(p, r, v, mask & ~1);
      p.rect(2, 0, 7, 1, '#f0c838'); p.rect(2, 1, 7, 1, '#d8a828');
    },
    // Mom's garden fence. Along the top and bottom you see the X-braced panels; down the
    // sides you look along the fence, so it's a rail with posts; corners and the ends at
    // the gate get a post.
    rusticFence(p, r, v, mask) {
      grassBase(p, r);
      const wood = '#9a7a58', woodD = '#6a5038', woodL = '#b8946a', wire = '#a8b0a0';
      const L = !(mask & 8), R = !(mask & 2), U = !(mask & 1), D = !(mask & 4);
      const horiz = L || R, vert = U || D;
      if (vert) {
        const y0 = U ? 0 : 7, y1 = D ? 15 : 9;
        p.rect(6, y0, 4, y1 - y0 + 1, wood); p.vline(6, y0, y1, woodL); p.vline(9, y0, y1, woodD);
        p.vline(5, y0, y1, OUT); p.vline(10, y0, y1, OUT);
      }
      if (horiz) {
        const x0 = L ? 0 : 8, x1 = R ? 15 : 8;
        for (let y = 5; y < 12; y += 2) p.hline(x0, x1, y, wire);
        p.hline(x0, x1, 2, OUT); p.hline(x0, x1, 3, woodL); p.hline(x0, x1, 4, woodD);
        p.hline(x0, x1, 11, wood); p.hline(x0, x1, 12, woodD); p.hline(x0, x1, 13, OUT);
        if (L && R) {
          for (let t = 0; t < 7; t++) { p.set(3 + t, 5 + t, wood); p.set(12 - t, 5 + t, wood); }
          p.rect(0, 1, 2, 14, wood); p.vline(1, 1, 14, woodD); p.vline(0, 1, 14, woodL);
        }
      }
      // a post wherever the fence turns, ends or runs along the side
      if (!(horiz && L && R && !vert)) {
        const top = vert && !horiz ? 5 : 1, bot = vert && !horiz ? 11 : 14;
        p.rect(6, top, 4, bot - top + 1, wood); p.vline(6, top, bot, woodL); p.vline(9, top, bot, woodD);
        p.hline(6, 9, top, woodL);
        p.vline(5, top, bot, OUT); p.vline(10, top, bot, OUT); p.hline(5, 10, top - 1, OUT); p.hline(5, 10, bot + 1, OUT);
      }
    },
    raisedBed(p, r) {
      p.rect(0, 0, 16, 16, '#7a5a3a');
      p.rect(1, 1, 14, 14, '#5a3e28');
      p.rect(2, 2, 12, 12, '#4a3020');
      const greens = ['#4aa040', '#68c050', '#2e7a30'];
      for (let i = 0; i < 6; i++) {
        const x = 3 + Math.floor(r() * 9), y = 3 + Math.floor(r() * 9), g = greens[i % 3];
        p.set(x, y, g); p.set(x + 1, y, g); p.set(x, y + 1, g); p.set(x + 1, y - 1, '#8ad868');
        if (r() < 0.3) p.set(x + 1, y + 1, '#e04030');
      }
      p.hline(0, 15, 0, '#9a7a58'); p.vline(15, 0, 15, '#5a4028');
    },
    flowerBed(p, r) {
      // snapdragons: tall spikes of red, pink and white
      p.rect(0, 0, 16, 16, '#3e7a34');
      const cols = ['#d83050', '#f08098', '#ffffff', '#c82838', '#f0d8e0'];
      for (let i = 0; i < 7; i++) {
        const x = 1 + Math.floor(r() * 14), top = 1 + Math.floor(r() * 6), c = cols[i % cols.length];
        p.vline(x, top + 4, 15, '#2e6a28');
        for (let y = top; y < top + 5; y++) p.set(x + (y % 2), y, c);
      }
    },
    fabric(p, r) {
      p.rect(0, 0, 16, 16, '#3a3c40');
      for (let y = 1; y < 16; y += 3) p.hline(0, 15, y, '#44464c');
      for (let i = 0; i < 3; i++) p.set(r() * 16, r() * 16, '#5a5c62');
    },
    hedge(p, r, v) {
      // round boxwood
      grassBase(p, r);
      const q = new Pix(16, 16);
      for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
        const dx = x - 7.5, dy = y - 9;
        if (dx * dx / 56 + dy * dy / 42 > 1) continue;
        const s = dx * 0.3 + dy * 0.5 + (G.hash(x, y, v + 9) - 0.5) * 2.5;
        q.set(x, y, s < -1.6 ? '#7ab858' : s < 1.2 ? '#3e7a34' : '#24562a');
      }
      q.outline('#163a1c');
      for (let i = 0; i < q.d.length; i++) if (q.d[i]) p.d[i] = q.d[i];
    },
    // ---- inside the house on Rattlesnake Bridge Rd
    oakFloor(p, r, v) {
      // honey oak boards
      p.rect(0, 0, 16, 16, '#c8884a');
      for (let row = 0; row < 4; row++) {
        const y = row * 4, seam = (v * 7 + row * 5) % 16;
        p.hline(0, 15, y, '#d49656');
        p.hline(0, 15, y + 3, '#a86c38');
        p.vline(seam, y, y + 2, '#a86c38');
        for (let i = 0; i < 2; i++) p.set(r() * 16, y + 1 + Math.floor(r() * 2), r() < 0.5 ? '#b87a40' : '#dca064');
      }
    },
    bathTile(p, r) {
      p.rect(0, 0, 16, 16, '#ddd3bd');
      p.hline(0, 15, 7, '#c4b8a0'); p.hline(0, 15, 15, '#c4b8a0'); p.vline(7, 0, 15, '#c4b8a0'); p.vline(15, 0, 15, '#c4b8a0');
      for (let i = 0; i < 4; i++) p.set(r() * 16, r() * 16, '#e8e0cc');
    },
    rugNavy(p, r, v, mask) { rugTile(p, mask, { field: '#2a3458', pat: '#46507a', accent: '#c8a060', border: '#9a3434', edge: '#e8d8b0' }); },
    rugRed(p, r, v, mask) { rugTile(p, mask, { field: '#9a2c30', pat: '#b84a44', accent: '#e0c080', border: '#2a3458', edge: '#e8d8b0' }); },
    rugIkat(p, r, v, mask) {
      p.rect(0, 0, 16, 16, '#e2ddd2');
      for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
        const d = Math.abs((x % 8) - 3.5) + Math.abs((y % 8) - 3.5);
        if (d >= 2.5 && d < 3.5) p.set(x, y, '#4a4a52');
        else if (d < 1) p.set(x, y, '#8a8a92');
      }
      const b = '#6a6a72';
      if (mask & 1) { p.rect(0, 0, 16, 2, b); p.hline(0, 15, 0, '#f0ece4'); }
      if (mask & 4) { p.rect(0, 14, 16, 2, b); p.hline(0, 15, 15, '#f0ece4'); }
      if (mask & 8) { p.rect(0, 0, 2, 16, b); p.vline(0, 0, 15, '#f0ece4'); }
      if (mask & 2) { p.rect(14, 0, 2, 16, b); p.vline(15, 0, 15, '#f0ece4'); }
    },
    // two-tile-tall walls: crown molding on the upper row, baseboard on the lower
    faceLiving(p, r, v, mask) { faceTile(p, mask, '#b8ccd0'); },
    faceSun(p, r, v, mask) {
      faceTile(p, mask, '#8c9c60', { tex: () => { for (let y = 1; y < 16; y += 3) p.hline(0, 15, y, '#94a468'); } });
    },
    faceDen(p, r, v, mask) {
      faceTile(p, mask, '#a85a4a', {
        tex: () => { for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) if ((x * 3 + y * 5) % 11 === 0) p.set(x, y, '#c88068'); else if ((x + y * 2) % 13 === 0) p.set(x, y, '#8a4438'); },
        lower: () => { p.rect(0, 4, 16, 2, '#f6f4ee'); p.hline(0, 15, 5, '#d8d4c8'); p.rect(0, 6, 16, 6, '#cbbba0'); },
      });
    },
    faceKitchen(p, r, v, mask) {
      faceTile(p, mask, '#efe6d0', { lower: () => { p.rect(0, 2, 16, 10, '#f6f0e0'); for (let x = 1; x < 16; x += 2) p.vline(x, 3, 11, '#e0d6bc'); p.hline(0, 15, 2, '#ffffff'); } });
    },
    facePanel(p, r, v, mask) {
      faceTile(p, mask, '#f0ece2', {
        tex: () => { const y0 = mask & 1 ? 5 : 1, y1 = mask & 4 ? 10 : 15; p.hline(2, 13, y0, '#d8d2c4'); p.hline(2, 13, y1, '#d8d2c4'); p.vline(2, y0, y1, '#d8d2c4'); p.vline(13, y0, y1, '#d8d2c4'); p.hline(3, 12, y0 + 1, '#ffffff'); },
      });
    },
    faceCream(p, r, v, mask) { faceTile(p, mask, '#efe4cc'); },
    faceBlue(p, r, v, mask) { faceTile(p, mask, '#c8d4dc'); },
    faceBath(p, r, v, mask) {
      faceTile(p, mask, '#f2f2ee', { lower: () => { p.rect(0, 2, 16, 10, '#f8f8f6'); for (let y = 2; y < 12; y += 3) { p.hline(0, 15, y, '#d8dcdc'); for (let x = (y % 2) * 4; x < 16; x += 8) p.vline(x, y, y + 2, '#d8dcdc'); } } });
    },
    faceNate(p, r, v, mask) { faceTile(p, mask, '#8ea4bc'); },
    faceLily(p, r, v, mask) { faceTile(p, mask, '#ecccd0'); },
    glassWall(p) {
      // a run of windows seen from above
      p.rect(0, 0, 16, 16, P.wallTop); p.hline(0, 15, 0, P.wallTopL);
      p.rect(0, 5, 16, 7, '#f6f4ee'); p.rect(1, 6, 14, 5, '#9ac4e0');
      p.vline(7, 6, 10, '#f6f4ee'); p.vline(8, 6, 10, '#f6f4ee');
      p.set(2, 7, '#d8f0ff'); p.set(3, 7, '#d8f0ff'); p.set(10, 7, '#d8f0ff');
    },
    counter(p, r) {
      // cream base cabinets under a black stone countertop
      p.rect(0, 0, 16, 6, '#2a2a30'); p.hline(0, 15, 0, '#4a4a54');
      for (let i = 0; i < 5; i++) p.set(r() * 16, 1 + r() * 4, '#3a3a44');
      p.rect(0, 6, 16, 10, '#efe6d0'); p.hline(0, 15, 6, '#1c1c22');
      for (const x of [1, 9]) { p.rect(x, 8, 6, 6, '#e2d8bc'); p.rect(x + 1, 9, 4, 4, '#efe6d0'); }
      p.set(6, 10, '#c8a858'); p.set(9, 10, '#c8a858'); p.hline(0, 15, 15, '#b8ac90');
    },
    stairsUp(p) {
      for (let k = 0; k < 4; k++) {
        const y = k * 4;
        p.rect(0, y, 16, 4, '#b07440'); p.hline(0, 15, y, '#d09058'); p.hline(0, 15, y + 3, '#6a4020');
      }
      p.vline(0, 0, 15, '#f6f4ee'); p.vline(15, 0, 15, '#f6f4ee');
    },
    stairsDown(p) {
      for (let k = 0; k < 4; k++) {
        const y = k * 4, f = -0.08 * k;
        p.rect(0, y, 16, 4, shade('#a86c3c', f)); p.hline(0, 15, y, shade('#c88850', f)); p.hline(0, 15, y + 3, shade('#5a3418', f));
      }
      p.vline(0, 0, 15, '#f6f4ee'); p.vline(15, 0, 15, '#f6f4ee');
    },
    // ---- the basement
    faceStone(p, r, v, mask) {
      p.rect(0, 0, 16, 16, '#6a6a72');
      for (let y = 0; y < 16; y += 5) { p.hline(0, 15, y, '#4a4a52'); for (let x = (y % 10 ? 3 : 8); x < 16; x += 9) p.vline(x, y, y + 4, '#4a4a52'); }
      for (let i = 0; i < 4; i++) p.set(r() * 16, r() * 16, '#8a8a92');
      if (mask & 4) { p.rect(0, 14, 16, 2, '#3a3a42'); }
    },
    // ---- the Andover mines
    cutFloor(p, r) {
      p.rect(0, 0, 16, 16, '#866654');
      for (let i = 0; i < 9; i++) p.set(r() * 16, r() * 16, ['#a8583a', '#6e5244', '#9a8478', '#7a7270'][Math.floor(r() * 4)]);
      if (r() < 0.4) p.rect(r() * 12, r() * 12, 3, 2, '#6a5246');
    },
    cutWall(p, r, v, mask) {
      p.rect(0, 0, 16, 16, '#7a5a4a');
      for (let y = 3; y < 16; y += 4) p.hline(0, 15, y + Math.floor(r() * 2), '#5e4438');
      for (let i = 0; i < 4; i++) { const x = Math.floor(r() * 14), y = Math.floor(r() * 12); p.rect(x, y, 2, 3, '#a84a2a'); }
      if (mask & 1) { p.rect(0, 0, 16, 3, '#4a7a34'); p.hline(0, 15, 3, '#2e4a22'); for (let x = 0; x < 16; x += 3) p.set(x, 3 + (x % 2), '#4a7a34'); }
      if (mask & 4) p.hline(0, 15, 15, '#4a3428');
    },
    tunnelFace(p, r, v, mask) {
      p.rect(0, 0, 16, 16, '#4a3a34');
      for (let y = 2; y < 16; y += 4) p.hline(0, 15, y + Math.floor(r() * 2), '#3a2c28');
      for (let i = 0; i < 3; i++) p.set(r() * 16, r() * 14, '#8a4a30');
      if (v % 5 === 0) { p.rect(6, 0, 4, 16, '#7a5a34'); p.vline(6, 0, 15, '#9a7444'); p.vline(9, 0, 15, '#5a4024'); }
      if (mask & 4) p.hline(0, 15, 15, '#241c18');
    },
    mineFloor(p, r) {
      p.rect(0, 0, 16, 16, '#4e423c');
      for (let i = 0; i < 7; i++) p.set(r() * 16, r() * 16, ['#5e504a', '#3e3430', '#7a4a34'][Math.floor(r() * 3)]);
    },
    mineRail(p, r) {
      p.rect(0, 0, 16, 16, '#4e423c');
      for (let y = 1; y < 16; y += 5) p.hline(1, 14, y, '#6a4a2a');
      p.vline(4, 0, 15, '#9a9aa4'); p.vline(11, 0, 15, '#9a9aa4');
    },
    hallTile(p, r) {
      p.rect(0, 0, 16, 16, '#e4dac4');
      p.hline(0, 15, 0, '#cbbfa6'); p.vline(0, 0, 15, '#cbbfa6'); p.hline(0, 15, 8, '#d4c8b0'); p.vline(8, 0, 15, '#d4c8b0');
      for (let i = 0; i < 3; i++) p.set(1 + r() * 14, 1 + r() * 14, '#d8ceb6');
    },
    faceOak(p, r, v, mask) {
      const oak = '#9a6234', oakD = '#6a4220', oakL = '#b8804a';
      p.rect(0, 0, 16, 16, '#eadfc4');
      for (let i = 0; i < 4; i++) p.set(r() * 16, r() * 16, '#dccfae');
      if (mask & 1) { p.rect(0, 0, 16, 3, oakD); p.hline(0, 15, 3, oakL); }
      if (mask & 4) {
        p.rect(0, 2, 16, 14, oak); p.hline(0, 15, 2, oakL); p.hline(0, 15, 3, oakD);
        p.rect(2, 5, 12, 6, oakL); p.rect(3, 6, 10, 4, oak);
        p.rect(0, 13, 16, 3, oakD);
      }
    },
    snow(p, r) {
      p.rect(0, 0, 16, 16, '#eef2f8');
      for (let i = 0; i < 7; i++) p.set(r() * 16, r() * 16, r() < 0.6 ? '#d4deec' : '#ffffff');
      if (r() < 0.3) p.hline(Math.floor(r() * 10), Math.floor(r() * 10) + 4, Math.floor(r() * 14) + 1, '#dce4f0');
    },
    snowPath(p, r) {
      p.rect(0, 0, 16, 16, '#dde4ee');
      for (let i = 0; i < 6; i++) p.set(r() * 16, r() * 16, r() < 0.5 ? '#c8d2e0' : '#eef2f8');
      if (r() < 0.6) { const x = 3 + Math.floor(r() * 8), y = 2 + Math.floor(r() * 9); p.rect(x, y, 2, 3, '#c4cedc'); p.rect(x + 3, y + 3, 2, 3, '#c4cedc'); }
    },
    iceHole(p, r, v, mask) {
      p.rect(0, 0, 16, 16, '#1e4a78');
      for (let i = 0; i < 4; i++) { const x = Math.floor(r() * 12), y = 2 + Math.floor(r() * 12); p.hline(x, x + 3, y, '#3a7ab0'); }
      edgeFringe(p, mask, v, '#a8d8f0', '#e8f8ff');
    },
    ice(p, r, v, mask) {
      p.rect(0, 0, 16, 16, '#a8d8f0');
      for (let i = 0; i < 3; i++) { const x = Math.floor(r() * 14), y = Math.floor(r() * 14); for (let k = 0; k < 4; k++) p.set(x + k, y + (k >> 1), '#d8f0fc'); }
      if (r() < 0.4) { const x = Math.floor(r() * 12), y = Math.floor(r() * 12); p.set(x, y, '#80b4d4'); p.set(x + 1, y + 1, '#80b4d4'); p.set(x + 2, y + 1, '#80b4d4'); p.set(x + 3, y + 2, '#80b4d4'); }
      edgeFringe(p, mask, v, '#eef2f8', '#c8dcea');
    },
    basementFloor(p, r) {
      p.rect(0, 0, 16, 16, '#7a7670');
      for (let i = 0; i < 7; i++) p.set(r() * 16, r() * 16, r() < 0.5 ? '#6a6660' : '#8a8680');
      if (r() < 0.3) p.rect(r() * 12, r() * 12, 3, 2, '#5a5650');
    },
    // ---- Dad's workshop
    faceBoards(p, r, v, mask) {
      // dark stained board walls between the studs
      p.rect(0, 0, 16, 16, '#4a3424');
      for (const x of [0, 5, 10, 15]) p.vline(x, 0, 15, '#2e2018');
      for (let i = 0; i < 5; i++) p.set(r() * 16, r() * 16, '#5e4430');
      if (mask & 1) { p.rect(0, 0, 16, 3, '#6a4a30'); p.hline(0, 15, 0, '#8a6a48'); p.hline(0, 15, 3, '#2e2018'); }
      if (mask & 4) { p.rect(0, 13, 16, 3, '#8a8680'); p.hline(0, 15, 13, '#a8a49c'); }
    },
    shopFloor(p, r, v) {
      // concrete with sawdust drifting around
      p.rect(0, 0, 16, 16, '#a8a49c');
      for (let i = 0; i < 8; i++) p.set(r() * 16, r() * 16, r() < 0.5 ? '#9a968e' : '#b8b4ac');
      if (v % 2 === 0) for (let i = 0; i < 14; i++) { const x = 3 + r() * 10, y = 3 + r() * 10; p.set(x, y, '#e0c890'); p.set(x + 1, y, '#d8bc80'); }
    },
    garageDoor(p) {
      // a roll-up door seen from inside
      p.rect(0, 0, 16, 16, '#e8e8e4'); for (const y of [3, 7, 11]) p.hline(0, 15, y, '#c8c8c4');
      p.hline(0, 15, 0, '#9aa0a8'); p.hline(0, 15, 15, '#9aa0a8');
    },
    openBay(p, r) {
      // the open middle bay: daylight on the concrete
      p.rect(0, 0, 16, 16, '#c8c4b8');
      for (let i = 0; i < 6; i++) p.set(r() * 16, r() * 16, '#d8d4c8');
      p.hline(0, 15, 15, '#9aa0a8');
    },
    bridge(p) {
      // wooden plank bridge running north-south, rails on both sides
      p.rect(0, 0, 16, 16, '#a07848');
      for (let y = 0; y < 16; y += 3) p.hline(1, 14, y, '#7a5630');
      p.rect(0, 0, 2, 16, '#6a4a2a'); p.rect(14, 0, 2, 16, '#6a4a2a');
      p.vline(0, 0, 15, OUT); p.vline(15, 0, 15, OUT);
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
    // ---- the Number One Ditch (the finale): wet gravel and mud on the ditch bed (with a
    // little shark tooth here and there), and steep muddy banks with grass along the top
    ditchBed(p, r, v) {
      p.rect(0, 0, 16, 16, '#4e4438');
      for (let i = 0; i < 14; i++) p.set(r() * 16, r() * 16, ['#6a5e4e', '#3e352a', '#7a6e5c', '#5a4e3e'][Math.floor(r() * 4)]);
      if (r() < 0.25) { const x = 2 + Math.floor(r() * 11), y = 2 + Math.floor(r() * 11); p.rect(x, y, 3, 2, '#3a4a5a'); p.set(x, y, '#5a7a9a'); }
      if (r() < 0.14) { const x = 2 + Math.floor(r() * 12), y = 2 + Math.floor(r() * 12); p.set(x, y, '#f4f0e0'); p.set(x, y + 1, '#d8d0b8'); }
    },
    bankFace(p, r, v, mask) {
      p.rect(0, 0, 16, 16, '#5a4a38');
      for (let i = 0; i < 8; i++) p.set(r() * 16, r() * 16, r() < 0.5 ? '#4a3c2c' : '#6a5844');
      for (let x = 0; x < 16; x += 3) p.vline(x + (v % 3), 2 + Math.floor(r() * 6), 15, '#4e4030');
      if (mask & 1) { p.rect(0, 0, 16, 4, '#3e7a34'); for (let x = 0; x < 16; x += 2) p.set(x, 4, '#2e6a2c'); p.set(r() * 16, 1, '#5a9a44'); }
    },
    // ---- the grocery store on College Hill: pale mint walls with a green base band, and
    // checkered linoleum
    groceryWall(p, r, v, mask) {
      p.rect(0, 0, 16, 16, '#d8ecd8');
      for (let i = 0; i < 4; i++) p.set(r() * 16, r() * 16, '#cce2cc');
      if (mask & 1) { p.rect(0, 0, 16, 3, '#f4f4ee'); p.hline(0, 15, 3, '#b8ccb8'); }
      if (mask & 4) { p.rect(0, 11, 16, 5, '#2e7a3e'); p.hline(0, 15, 11, '#4a9a5a'); p.hline(0, 15, 15, '#1e5a2c'); }
    },
    groceryFloor(p, r) {
      for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) p.set(x, y, ((x >> 3) + (y >> 3)) % 2 ? '#c8c6c0' : '#e8e6de');
      for (let i = 0; i < 4; i++) p.set(r() * 16, r() * 16, '#d8d6ce');
    },
    // ---- CHKD's roof (at night): dark membrane with gravel ballast, the concrete ledge around the
    // edge, and the sky (the view out past the city gets painted over it)
    roofDeck(p, r, v) {
      p.rect(0, 0, 16, 16, '#3c404c');
      for (let i = 0; i < 16; i++) p.set(r() * 16, r() * 16, ['#4a4e5a', '#34374a', '#565a66', '#2e3240'][Math.floor(r() * 4)]);
      if (v % 4 === 0) p.hline(0, 15, 15, '#34384a');
    },
    roofSky(p) { p.rect(0, 0, 16, 16, '#0c0a20'); },
    roofLedge(p, r, v) {
      p.rect(0, 0, 16, 16, '#5e626c');
      p.rect(0, 0, 16, 5, '#8a8e98'); p.hline(0, 15, 0, '#a8acb4'); p.hline(0, 15, 5, '#44484f');
      for (let i = 0; i < 5; i++) p.set(r() * 16, 6 + r() * 9, '#52565f');
      if (v % 2 === 0) p.vline(15, 6, 15, '#4c5058');
    },
    // ---- CHKD: butter-yellow walls with a band of bright squares, speckled floors with colored
    // inlays, foam mats in the playroom; the NICU is calm and blue, with a border of stars
    faceChkd(p, r, v, mask) {
      p.rect(0, 0, 16, 16, '#f4e8b8');
      for (let i = 0; i < 4; i++) p.set(r() * 16, r() * 16, '#ecdeaa');
      if (mask & 1) { p.rect(0, 0, 16, 3, '#f8f8f4'); p.hline(0, 15, 3, '#d8cca0'); }
      if (mask & 4) {
        const c = ['#d83030', '#f08a28', '#f0c830', '#2e8a4e', '#2a6ad8'];
        for (let x = 0; x < 16; x += 4) p.rect(x, 4, 4, 3, c[(v + x / 4) % 5]);
        p.rect(0, 12, 16, 4, '#2a6ad8'); p.hline(0, 15, 12, '#4a8ae8');
      }
    },
    chkdFloor(p, r, v) {
      p.rect(0, 0, 16, 16, '#e8e4d8');
      for (let i = 0; i < 10; i++) p.set(r() * 16, r() * 16, r() < 0.5 ? '#d8d4c8' : '#f4f2ec');
      for (let i = 0; i < 3; i++) p.set(r() * 16, r() * 16, ['#e8b8b8', '#b8c8e8', '#e8dcb0'][i]);
      p.hline(0, 15, 15, '#dcd8cc');
    },
    playMat(p, r, v) {
      // big foam puzzle mats, one soft color per tile, with the puzzle notches
      const c = ['#e87a7a', '#7aa8e8', '#f0d070', '#7ac88a'][v % 4], d = shade(c, -0.2);
      p.rect(0, 0, 16, 16, c);
      p.hline(0, 15, 15, d); p.vline(15, 0, 15, d);
      p.rect(6, 0, 4, 2, d); p.rect(0, 6, 2, 4, d); p.rect(7, 1, 2, 1, c);
      for (let i = 0; i < 3; i++) p.set(r() * 16, r() * 16, shade(c, 0.12));
    },
    faceNicu(p, r, v, mask) {
      p.rect(0, 0, 16, 16, '#c8d6ea');
      if (mask & 1) { p.rect(0, 0, 16, 3, '#f0f4f8'); p.hline(0, 15, 3, '#a8b8d0'); }
      if (mask & 4) {
        p.rect(0, 12, 16, 4, '#8a9ac8'); p.hline(0, 15, 12, '#a8b8e0');
        const sx = 4 + (v % 3) * 3; p.set(sx, 6, '#f8f0b0'); p.hline(sx - 1, sx + 1, 7, '#f8f0b0'); p.set(sx, 8, '#f8f0b0');
      }
    },
    nicuFloor(p, r) {
      p.rect(0, 0, 16, 16, '#d6dce4');
      for (let i = 0; i < 8; i++) p.set(r() * 16, r() * 16, r() < 0.5 ? '#c8ced8' : '#e2e8ee');
      p.hline(0, 15, 15, '#c4cad4'); p.vline(15, 0, 15, '#c4cad4');
    },
    // ---- El Toro Loco: orange walls under dark ceiling beams, a band of talavera tile along the
    // bottom, and terracotta saltillo tile floors
    faceToro(p, r, v, mask) {
      p.rect(0, 0, 16, 16, '#d8703c');
      for (let i = 0; i < 5; i++) p.set(r() * 16, r() * 16, r() < 0.5 ? '#cc6634' : '#e27a46');
      if (mask & 1) { p.rect(0, 0, 16, 3, '#2a3c44'); p.hline(0, 15, 3, '#1a262c'); }
      if (mask & 4) {
        p.rect(0, 11, 16, 5, '#f4ecd8'); p.hline(0, 15, 11, '#c8b898'); p.hline(0, 15, 15, '#8a7a5a');
        for (let x = 0; x < 16; x += 4) { p.rect(x + 1, 12, 2, 2, '#2a5aa8'); p.set(x + 3, 14, '#e8b830'); p.set(x, 13, '#2a5aa8'); }
      }
    },
    toroFloor(p, r, v) {
      for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) p.set(x, y, (x % 8 === 7 || y % 8 === 7) ? '#8a4a30' : G.hash(Math.floor(x / 8) + v * 2, Math.floor(y / 8), 41) < 0.3 ? '#b8603e' : '#c46c48');
      for (let i = 0; i < 4; i++) p.set(r() * 16, r() * 16, '#d07a54');
    },
    // ---- Abe and Hannah's condo (Chesapeake)
    // light gray walls with white trim, light LVP downstairs, carpet upstairs
    faceCondo(p, r, v, mask) { faceTile(p, mask, '#d4d8da'); },
    lvp(p, r, v) {
      p.rect(0, 0, 16, 16, '#d2bc9c');
      for (let row = 0; row < 4; row++) {
        const y = row * 4, seam = (v * 11 + row * 7) % 16;
        p.hline(0, 15, y, '#dcc8aa');
        p.hline(0, 15, y + 3, '#b8a282');
        if ((v + row) % 2) p.vline(seam, y, y + 2, '#b8a282');
        for (let i = 0; i < 2; i++) p.set(r() * 16, y + 1 + Math.floor(r() * 2), r() < 0.5 ? '#c4ae8c' : '#e2d0b4');
      }
    },
    carpet(p, r) {
      p.rect(0, 0, 16, 16, '#cdc5b8');
      for (let i = 0; i < 18; i++) p.set(r() * 16, r() * 16, r() < 0.5 ? '#c0b8aa' : '#d8d2c6');
    },
    whiteTile(p, r) {
      p.rect(0, 0, 16, 16, '#f0f0ec');
      p.hline(0, 15, 7, '#d0d0cc'); p.hline(0, 15, 15, '#d0d0cc'); p.vline(7, 0, 15, '#d0d0cc'); p.vline(15, 0, 15, '#d0d0cc');
      for (let i = 0; i < 3; i++) p.set(r() * 16, r() * 16, '#e2e2de');
      p.set(1, 1, '#ffffff'); p.set(9, 9, '#ffffff');
    },
    condoCounter(p, r) {
      // light gray shaker cabinets under a white countertop
      p.rect(0, 0, 16, 6, '#f4f4f0'); p.hline(0, 15, 0, '#ffffff');
      for (let i = 0; i < 3; i++) p.set(r() * 16, 1 + r() * 4, '#e0e0dc');
      p.rect(0, 6, 16, 10, '#c4c8cc'); p.hline(0, 15, 6, '#8e949a');
      for (const x of [1, 9]) { p.rect(x, 8, 6, 6, '#b2b6bc'); p.rect(x + 1, 9, 4, 4, '#c4c8cc'); }
      p.set(6, 9, '#5a5e64'); p.set(9, 9, '#5a5e64'); p.hline(0, 15, 15, '#8e949a');
    },
    // windows and the patio slider in a side wall, seen from above
    sideWindow(p) {
      p.rect(0, 0, 16, 16, P.wallTop); p.hline(0, 15, 0, P.wallTopL);
      p.rect(5, 0, 7, 16, '#f6f4ee'); p.rect(6, 1, 5, 14, '#9ac4e0');
      p.hline(6, 10, 7, '#f6f4ee'); p.hline(6, 10, 8, '#f6f4ee');
      p.set(7, 2, '#d8f0ff'); p.set(7, 3, '#d8f0ff'); p.set(8, 10, '#d8f0ff');
    },
    sideSlider(p) {
      p.rect(0, 0, 16, 16, P.wallTop);
      p.rect(4, 0, 9, 16, '#e8e8e4'); p.rect(5, 0, 7, 16, '#9ac4e0');
      p.vline(8, 0, 15, '#e8e8e4'); p.vline(12, 0, 15, '#a8a8a4');
      p.set(6, 3, '#d8f0ff'); p.set(6, 4, '#d8f0ff'); p.set(10, 9, '#d8f0ff');
    },
    // the loft railing: white balusters under an oak handrail, with the living room far below
    loftRail(p) {
      p.rect(0, 0, 16, 16, '#cdc5b8');
      p.rect(0, 5, 16, 9, '#6e665c');
      for (let x = 1; x < 16; x += 4) { p.rect(x, 5, 2, 9, '#f6f4ee'); p.vline(x + 1, 5, 13, '#d8d4c8'); }
      p.rect(0, 2, 16, 3, '#b07a44'); p.hline(0, 15, 2, '#d09a60'); p.hline(0, 15, 4, '#7a4a24');
      p.rect(0, 14, 16, 2, '#f6f4ee'); p.hline(0, 15, 15, '#d8d4c8');
    },
    openBelow(p, r, v) {
      TILE_DRAW.lvp(p, r, v);
      for (let i = 0; i < p.d.length; i++) if (p.d[i]) p.d[i] = shade(p.d[i], -0.5);
    },
    // carpeted treads; the open side gets the oak handrail and white balusters
    carpetStairsUp(p, r, v, mask) { carpetStairs(p, mask, 0); },
    carpetStairsDown(p, r, v, mask) { carpetStairs(p, mask, -0.07); },
    condoMat(p, r, v) {
      TILE_DRAW.lvp(p, r, v);
      p.rect(2, 3, 12, 12, '#4a4a52'); p.rect(3, 4, 10, 10, '#6a6a74');
      p.hline(5, 10, 8, '#4a4a52'); p.hline(6, 9, 9, '#4a4a52'); p.hline(7, 8, 10, '#4a4a52');
    },
    mulch(p, r) {
      p.rect(0, 0, 16, 16, '#6a4430');
      for (let i = 0; i < 26; i++) { const t = r(); p.set(r() * 16, r() * 16, t < 0.4 ? '#4e3022' : t < 0.75 ? '#845640' : '#5a3a28'); }
      for (let i = 0; i < 4; i++) { const x = r() * 14, y = r() * 15; p.hline(x, x + 1, y, '#9a6a4a'); }
    },
    // the golf course: mowed stripes down the fairway
    fairwayL(p, r) { p.rect(0, 0, 16, 16, '#7ccc5c'); for (let i = 0; i < 6; i++) p.set(r() * 16, r() * 16, '#8cd86a'); },
    fairwayD(p, r) { p.rect(0, 0, 16, 16, '#6cbe50'); for (let i = 0; i < 6; i++) p.set(r() * 16, r() * 16, '#5cae44'); },
  };

  function carpetStairs(p, mask, dim) {
    for (let k = 0; k < 4; k++) {
      const y = k * 4, f = dim * k;
      p.rect(0, y, 16, 4, shade('#c8c0b2', f)); p.hline(0, 15, y, shade('#ddd6ca', f)); p.hline(0, 15, y + 3, shade('#968e82', f));
    }
    // (in the condo the open side is always on the left; the right side runs along a wall)
    if (mask & 8) { p.rect(0, 0, 3, 16, '#f6f4ee'); for (let y = 1; y < 16; y += 4) p.vline(1, y, y + 1, '#d8d4c8'); p.vline(0, 0, 15, '#b07a44'); }
    else p.vline(0, 0, 15, '#f6f4ee');
    if (mask & 2) p.vline(15, 0, 15, '#f6f4ee');
  }

  // Oriental rug: an all-over lattice with a patterned border where it ends.
  function rugTile(p, mask, c) {
    p.rect(0, 0, 16, 16, c.field);
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      if ((x + y) % 8 === 0 || (x - y + 16) % 8 === 0) p.set(x, y, c.pat);
      else if (x % 8 === 4 && y % 8 === 4) p.set(x, y, c.accent);
    }
    if (mask & 1) { p.rect(0, 0, 16, 4, c.border); p.hline(0, 15, 0, c.edge); p.hline(0, 15, 4, c.accent); for (let x = 1; x < 16; x += 3) p.set(x, 2, c.accent); }
    if (mask & 4) { p.rect(0, 12, 16, 4, c.border); p.hline(0, 15, 15, c.edge); p.hline(0, 15, 11, c.accent); for (let x = 1; x < 16; x += 3) p.set(x, 13, c.accent); }
    if (mask & 8) { p.rect(0, 0, 4, 16, c.border); p.vline(0, 0, 15, c.edge); p.vline(4, 0, 15, c.accent); for (let y = 1; y < 16; y += 3) p.set(2, y, c.accent); }
    if (mask & 2) { p.rect(12, 0, 4, 16, c.border); p.vline(15, 0, 15, c.edge); p.vline(11, 0, 15, c.accent); for (let y = 1; y < 16; y += 3) p.set(13, y, c.accent); }
  }

  // Interior wall face; the top row of a wall gets crown molding, the bottom row a baseboard.
  function faceTile(p, mask, base, opt = {}) {
    p.rect(0, 0, 16, 16, base);
    if (opt.tex) opt.tex();
    if (mask & 1) { p.hline(0, 15, 0, '#ffffff'); p.hline(0, 15, 1, '#f0eee8'); p.hline(0, 15, 2, shade(base, -0.15)); }
    if (mask & 4) {
      if (opt.lower) opt.lower();
      p.rect(0, 12, 16, 4, '#f6f4ee'); p.hline(0, 15, 12, '#ffffff'); p.hline(0, 15, 15, '#c8c4b8');
    }
  }

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

  function buildingExtra(def) {
    return def.tower ? 28 : (def.chimney || def.weathervane) ? 16 : 0;
  }

  function building(def) {
    const W = def.w * 16, H = def.h * 16, extra = buildingExtra(def);
    const p = new Pix(W, H + extra);
    const wallH = def.wallH || 32, roofH = H - wallH;
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
        } else if (def.style === 'clapboard') {
          if (y % 3 === 2) col = shade(wall, -0.1);
        } else if (def.style === 'shake') {
          const row = Math.floor(y / 5), off = row % 2 ? 3 : 0;
          if (y % 5 === 4) col = wallD;
          else if ((x + off) % 6 === 0) col = shade(wall, -0.14);
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
    const rowsY = def.stories === 2 ? [wy + 3, wy + wallH - 22] : [wy + 5];
    const noWindows = def.style === 'metal' || def.garageDoors;
    for (let x = 6; x + 10 < W && !noWindows; x += 24) {
      rowsY.forEach((yy, ri) => {
        if (ri === rowsY.length - 1 && x + 12 > doorPx - 4 && x < doorPx + 20) return;
        const gh = def.stories === 2 ? 11 : 14;
        p.rect(x - 1, yy, 12, gh, '#f4f0e8');
        p.rect(x, yy + 1, 10, gh - 2, def.glass || '#4a6aa0');
        p.rect(x + 1, yy + 2, 3, 3, '#a8c8f0');
        p.vline(x + 5, yy + 1, yy + gh - 2, '#f4f0e8');
        p.hline(x, x + 9, yy + Math.floor(gh / 2), '#f4f0e8');
        if (def.shutters) { p.rect(x - 4, yy, 3, gh, def.shutters); p.rect(x + 12, yy, 3, gh, def.shutters); }
        else p.hline(x - 2, x + 11, yy + gh, '#d8d0c0');
      });
    }
    if (def.garageDoors) {
      // paneled roll-up doors along the bottom of the wall
      const n = def.garageDoors, gap = 4, dw2 = Math.floor((W - 8 - gap * (n - 1)) / n), dh2 = Math.min(26, wallH - 4);
      for (let i = 0; i < n; i++) {
        const x0 = 4 + i * (dw2 + gap), y0 = wy + wallH - dh2;
        p.rect(x0 - 1, y0 - 1, dw2 + 2, dh2 + 1, '#e8e8e8');
        p.rect(x0, y0, dw2, dh2, '#f8f8f4');
        for (let yy = y0 + 4; yy < y0 + dh2; yy += 6) p.hline(x0, x0 + dw2 - 1, yy, '#c8c8c8');
        for (let xx = x0 + 5; xx < x0 + dw2 - 2; xx += 6) p.vline(xx, y0, y0 + dh2 - 1, '#dcdcdc');
      }
    }
    // door
    const dx = doorPx + 1, dw = 14, dh = 24;
    if (!def.garageDoors) {
      p.rect(dx - 1, wy + wallH - dh - 1, dw + 2, dh + 1, def.doorFrame || '#f0ece0');
      p.rect(dx, wy + wallH - dh, dw, dh, def.doorColor || '#6a3a20');
      p.vline(dx + 6, wy + wallH - dh, wy + wallH - 1, shade(def.doorColor || '#6a3a20', -0.3));
      p.vline(dx + 7, wy + wallH - dh, wy + wallH - 1, shade(def.doorColor || '#6a3a20', -0.3));
      p.set(dx + 4, wy + wallH - 11, '#f8d040'); p.set(dx + 9, wy + wallH - 11, '#f8d040');
      if (def.wreath) {
        const cx = dx + 7, cy = wy + wallH - dh + 6;
        for (let a = 0; a < 12; a++) p.set(cx + Math.round(Math.cos(a / 12 * Math.PI * 2) * 3), cy + Math.round(Math.sin(a / 12 * Math.PI * 2) * 3), a % 4 ? '#2e7a30' : '#4aa040');
        p.set(cx, cy + 3, '#d03030'); p.set(cx - 1, cy + 4, '#d03030'); p.set(cx + 1, cy + 4, '#d03030');
      }
    }
    if (def.sign) {
      p.rect(doorPx - 6, wy + 1, 28, 5, '#2a3a5a');
      p.hline(doorPx - 4, doorPx + 19, wy + 3, '#e8d8a0');
    }
    // red brick chimney running up the end of the house, with whitewash patches
    if (def.chimney) {
      const cx0 = def.chimney.x, cw = def.chimney.w || 10, top = 2;
      for (let y = top; y < H + extra; y++) {
        for (let x = cx0; x < cx0 + cw; x++) {
          const row = Math.floor(y / 3), off = row % 2 ? 2 : 0;
          let col = (y % 3 === 2 || (x + off) % 4 === 0) ? '#c8a088' : '#a8402e';
          if (y > H + extra - 24 && G.hash(x, y, 31) < 0.35) col = '#e8dcd0';
          p.set(x, y, col);
        }
      }
      p.hline(cx0 - 1, cx0 + cw, top, '#6a2a20'); p.hline(cx0 - 1, cx0 + cw, top + 1, '#8a3428');
    }
    // white louvered cupola on the ridge
    if (def.cupola) {
      const cx = Math.floor(W / 2);
      p.rect(cx - 5, extra - 2, 11, 3, '#5a5c66'); p.rect(cx - 4, extra + 1, 9, 7, '#f4f4f0');
      for (let y = extra + 2; y < extra + 7; y += 2) p.hline(cx - 3, cx + 3, y, '#c8c8c4');
      p.hline(cx - 6, cx + 6, extra - 3, '#4a4c56');
    }
    // horse weathervane on the ridge
    if (def.weathervane) {
      const vx = Math.floor(W / 2), dk = '#2a2a30';
      p.vline(vx, 6, extra + 1, dk);
      p.hline(vx - 4, vx + 4, 9, dk);
      p.rect(vx - 4, 2, 7, 3, dk); p.set(vx + 3, 1, dk); p.set(vx + 4, 1, dk); p.set(vx + 3, 2, dk);
      p.set(vx - 4, 5, dk); p.set(vx - 3, 5, dk); p.set(vx + 1, 5, dk); p.set(vx + 2, 5, dk); p.set(vx - 5, 2, dk);
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

  // Feldspar, the corn stalk in a pot in Nate's lab: a gold tassel on top, long leaves arching
  // off both sides, and one ear of corn peeking out of its husk
  function feldspar() {
    const p = new Pix(16, 30), G1 = '#5aa848', G2 = '#3e8838', GL = '#8ad068', T1 = '#e0c068', T2 = '#b89040';
    // the tassel
    p.vline(7, 0, 4, T1); p.set(6, 1, T1); p.set(5, 2, T2); p.set(9, 1, T1); p.set(10, 2, T2); p.set(4, 3, T2); p.set(8, 2, T2);
    // the stalk, with a node every few rows
    p.vline(7, 4, 22, G1); p.vline(8, 3, 22, G2);
    for (const y of [9, 14, 19]) p.hline(7, 8, y, '#7ab858');
    // the leaves: [start x, start y, direction]
    const leaf = (x, y, d, len) => {
      for (let k = 0; k < len; k++) {
        const lx = x + d * k, ly = y + Math.floor((k * k) / 7);
        p.set(lx, ly, k < 2 ? G1 : GL); p.set(lx, ly + 1, G2);
      }
    };
    leaf(6, 6, -1, 6); leaf(9, 4, 1, 6); leaf(9, 11, 1, 7); leaf(6, 16, -1, 6);
    // the ear: husk around yellow kernels, a little silk on top
    p.rect(3, 10, 4, 6, '#7ab858'); p.vline(6, 11, 15, G2); p.rect(4, 10, 2, 5, '#f0d050');
    p.set(4, 11, '#d8a830'); p.set(5, 13, '#d8a830'); p.set(4, 14, '#d8a830');
    p.set(4, 9, '#c89868'); p.set(5, 8, '#c89868'); p.set(5, 9, '#e0b080');
    // the pot
    p.rect(4, 22, 8, 7, '#c86838'); p.hline(3, 12, 22, '#e08850'); p.vline(11, 23, 28, '#a04c28'); p.hline(5, 10, 21, '#5a3a20');
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

  // Dad's hand-carved pipe: briar bowl and a black stem.
  function pipeIcon() {
    const p = new Pix(16, 10);
    const wood = '#9a5530', woodL = '#c47a48', woodD = '#6a3418', stem = '#1c1c22';
    p.rect(10, 1, 5, 7, wood);
    p.vline(10, 2, 6, woodL); p.vline(14, 2, 7, woodD); p.hline(11, 13, 7, woodD);
    p.hline(10, 14, 1, woodD); p.hline(11, 13, 2, '#3a2010');
    p.hline(2, 9, 5, stem); p.hline(1, 9, 6, stem); p.hline(0, 2, 5, stem);
    p.set(5, 5, '#4a4a54');
    p.outline();
    return p.canvas();
  }

  // Tiny pipe drawn at Nate's mouth while he puffs.
  function pipeSmall() {
    const p = new Pix(8, 6);
    p.hline(0, 4, 3, '#1c1c22');
    p.rect(4, 1, 3, 4, '#9a5530'); p.vline(6, 1, 4, '#6a3418');
    p.hline(4, 6, 1, '#3a2010'); p.set(5, 0, '#ff9040');
    return p.canvas();
  }

  // A Micro Mayhem ticket: gold stock, a perforated stub and a red star.
  function ticketIcon() {
    const p = new Pix(16, 10);
    p.rect(1, 1, 14, 8, '#f8d040');
    p.rect(1, 1, 14, 1, '#fff0a0');
    for (let y = 1; y < 9; y += 2) p.set(5, y, '#c09018');
    p.set(10, 3, '#d03038'); p.hline(9, 11, 4, '#d03038'); p.set(10, 5, '#d03038'); p.set(9, 6, '#d03038'); p.set(11, 6, '#d03038');
    p.outline();
    return p.canvas();
  }

  function phoneIcon() {
    const p = new Pix(12, 16);
    p.rect(1, 0, 10, 16, '#2a2a34');
    p.rect(2, 2, 8, 11, '#e8f0f8');
    p.rect(3, 3, 5, 2, '#78e070'); p.rect(4, 6, 5, 2, '#68a8ff'); p.rect(3, 9, 4, 2, '#78e070');
    p.hline(5, 6, 14, '#5a5a68');
    p.outline();
    return p.canvas();
  }

  // Graded test paper with a red A+.
  function paperIcon() {
    const p = new Pix(14, 16);
    p.rect(1, 1, 12, 14, '#f8f8f0');
    p.rect(10, 1, 3, 3, '#d8d8d0');
    for (let y = 8; y < 14; y += 2) p.hline(3, 10, y, '#a0a0b0');
    const R = '#e03040';
    p.set(3, 3, R); p.set(2, 4, R); p.set(4, 4, R); p.hline(2, 4, 5, R); p.set(2, 6, R); p.set(4, 6, R);
    p.set(7, 4, R); p.hline(6, 8, 5, R); p.set(7, 6, R);
    p.outline();
    return p.canvas();
  }

  function schoolDesk() {
    const p = new Pix(16, 18);
    p.rect(4, 12, 8, 5, '#6a7080'); p.hline(4, 11, 12, '#8a90a0');
    p.rect(1, 3, 14, 7, '#c89058'); p.hline(1, 14, 3, '#e0b078'); p.hline(1, 14, 9, '#9a6838');
    p.rect(5, 4, 6, 4, '#f8f8f0'); p.hline(6, 9, 5, '#9090a0'); p.hline(6, 8, 6, '#9090a0');
    p.vline(2, 10, 16, '#5a5a64'); p.vline(13, 10, 16, '#5a5a64');
    p.outline();
    return p.canvas();
  }  // the same desk, with Bismarck's giant law school prep book on it (bristling with colored tabs)
  function schoolDeskBook() {
    const c = schoolDesk(), x = c.getContext('2d');
    x.fillStyle = '#1a2448'; x.fillRect(3, 3, 10, 6);
    x.fillStyle = '#2a3a6a'; x.fillRect(3, 3, 9, 5);
    x.fillStyle = '#f0ead8'; x.fillRect(3, 8, 9, 1);
    x.fillStyle = '#d8b850'; x.fillRect(5, 4, 5, 1); x.fillRect(5, 6, 3, 1);
    for (const [y, col] of [[3, '#f8d850'], [4, '#f86858'], [6, '#78c8f8'], [7, '#78e070']]) { x.fillStyle = col; x.fillRect(13, y, 1, 1); }
    x.fillStyle = '#f86858'; x.fillRect(7, 2, 1, 1); x.fillStyle = '#78c8f8'; x.fillRect(10, 2, 1, 1);
    return c;
  }
  // a flyer pinned to the wall: a little church drawn in pen, and handwriting
  function churchFlyer() {
    const p = new Pix(10, 12);
    p.rect(0, 0, 10, 12, '#f8f4e8'); p.vline(9, 0, 11, '#d8d0bc'); p.hline(0, 9, 11, '#d8d0bc');
    p.set(4, 0, '#d83838'); p.set(5, 0, '#d83838');
    const ink = '#2a3a8a';
    p.vline(4, 1, 3, ink); p.hline(3, 5, 2, ink);
    p.set(4, 4, ink); p.set(3, 5, ink); p.set(5, 5, ink); p.set(2, 6, ink); p.set(6, 6, ink);
    p.vline(2, 7, 8, ink); p.vline(6, 7, 8, ink); p.hline(2, 6, 9, ink); p.set(4, 8, ink);
    for (let x = 1; x < 8; x += 2) p.set(x, 10, '#8a90b8');
    return p.canvas();
  }
  // the same desk, with a copy of the campus paper spread open on it (the masthead, a photo, columns)
  function schoolDeskPaper() {
    const c = schoolDesk(), x = c.getContext('2d');
    x.fillStyle = '#7a7468'; x.fillRect(1, 3, 14, 7);
    x.fillStyle = '#e4dccb'; x.fillRect(2, 3, 12, 6);
    x.fillStyle = '#2a2420'; x.fillRect(3, 4, 10, 1);
    x.fillStyle = '#3a3a5a'; x.fillRect(3, 6, 4, 3);
    x.fillStyle = '#f4f4f0'; x.fillRect(4, 7, 2, 2);
    x.fillStyle = '#8a8478'; x.fillRect(8, 6, 5, 1); x.fillRect(8, 8, 4, 1);
    return c;
  }


  function chalkboard(text = 'FINAL EXAM') {
    // (wide enough for the text, with room for the scribbles after it)
    const W = Math.max(80, G.font.width(text) + 24), sx = W - 14;
    const p = new Pix(W, 16);
    p.rect(0, 0, W, 16, '#7a5028');
    p.rect(2, 2, W - 4, 11, '#2e5a3e');
    for (let i = 0; i < 14; i++) p.hline(sx + (i % 3), sx + (i % 3) + 4 + (i % 2) * 3, 3 + i % 9, '#c8dcc8');
    p.hline(1, W - 2, 14, '#a07040'); p.set(10, 13, '#ffffff'); p.set(11, 13, '#ffffff');
    p.outline();
    const c = p.canvas();
    G.font.draw(c.getContext('2d'), text, 5, 3, '#eef6ee');
    return c;
  }

  // Mikey's bouquet: red, pink and yellow flowers in paper.
  function bouquet() {
    const p = new Pix(12, 13);
    const cols = ['#e03048', '#f080a8', '#f8d040', '#e03048', '#ffffff'];
    [[3, 2], [6, 1], [8, 3], [4, 5], [7, 5], [2, 4]].forEach(([x, y], i) => {
      const c = cols[i % cols.length];
      p.set(x, y, c); p.set(x + 1, y, c); p.set(x, y + 1, c); p.set(x + 1, y + 1, shade(c, -0.2));
    });
    p.set(5, 3, '#4aa040'); p.set(9, 5, '#4aa040'); p.set(1, 6, '#4aa040');
    for (let y = 7; y < 13; y++) p.hline(3 + Math.floor((y - 7) / 2), 8 - Math.floor((y - 7) / 2), y, y % 2 ? '#f0e8f8' : '#e0d0f0');
    p.outline();
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

  // ---------------------------------------------------------------- home props
  // Dad's old teal Ford pickup, seen from above, tailgate toward the camera.
  function truck() {
    const p = new Pix(28, 46);
    const teal = '#3a8a86', tealD = '#2a6662', tealL = '#5aaaa4', rust = '#8a5a3a';
    for (const [x, y] of [[0, 7], [24, 7], [0, 33], [24, 33]]) p.rect(x, y, 4, 7, '#1c1c22');
    p.rect(2, 1, 24, 44, teal);
    p.vline(2, 1, 44, tealL); p.vline(25, 1, 44, tealD);
    p.rect(4, 2, 20, 8, tealL); p.hline(4, 23, 1, '#e8e8e8');
    p.set(4, 2, '#f8f0b0'); p.set(23, 2, '#f8f0b0');
    p.rect(5, 11, 18, 5, '#34496a'); p.hline(6, 12, 12, '#8ab0d8');
    p.rect(4, 16, 20, 7, teal); p.hline(4, 23, 16, tealL);
    p.rect(4, 24, 20, 16, '#2a3a38');
    p.rect(8, 27, 6, 4, '#6a6a70'); p.rect(15, 30, 5, 6, '#c8c0b0'); p.rect(10, 33, 3, 3, '#d83030');
    p.rect(3, 40, 22, 4, tealD); p.hline(8, 9, 41, '#f0f0f0'); p.hline(11, 12, 41, '#f0f0f0'); p.hline(14, 15, 41, '#f0f0f0'); p.hline(17, 18, 41, '#f0f0f0');
    p.hline(2, 25, 44, '#e0e0e0');
    p.set(6, 20, rust); p.set(7, 21, rust); p.set(20, 38, rust); p.set(5, 37, rust);
    p.outline();
    return p.canvas();
  }

  // Red chicken coop with a white metal roof and a long white-framed run.
  function coop() {
    const W = 96, H = 44, p = new Pix(W, H);
    const roof = '#e8eaee', roofD = '#b8bcc4', red = '#a83030', redD = '#7a2020';
    // run: wire mesh with white frame
    for (let y = 14; y < 40; y++) for (let x = 2; x < 58; x++) p.set(x, y, (x + y) % 4 === 0 || (x - y) % 4 === 0 ? '#9aa89a' : '#5a8a4a');
    for (const x of [2, 16, 30, 44, 57]) p.rect(x, 12, 2, 28, '#f4f4f0');
    p.hline(2, 58, 39, '#f4f4f0');
    for (let y = 2; y < 13; y++) for (let x = 0; x < 62; x++) p.set(x, y, x % 5 === 0 ? roofD : roof);
    // coop house
    p.rect(58, 14, 36, 26, red);
    for (let x = 60; x < 94; x += 4) p.vline(x, 14, 39, redD);
    p.rect(64, 20, 8, 7, '#f4f4f0'); p.rect(65, 21, 6, 5, '#34496a');
    p.rect(80, 26, 8, 13, '#f4f4f0'); p.rect(81, 27, 6, 12, redD);
    for (let y = 0; y < 14; y++) for (let x = 56; x < 96; x++) p.set(x, y, x % 5 === 0 ? roofD : roof);
    p.hline(56, 95, 13, '#9aa0a8');
    p.outline();
    return p.canvas();
  }

  // Daisy's house, where the greenhouse used to be: a little wooden bunny hutch with an
  // A-frame roof and a white picket fence all the way around. Through the doorway: his
  // blue blanket (with a wet spot on it). Daisy himself hops around in front (daisy()).
  function bunnyHouse() {
    const W = 48, H = 40, p = new Pix(W, H);
    // grass inside the pen, and the back of the fence (behind the hutch, so the roof covers it)
    p.rect(2, 12, 44, 24, '#6cc454');
    p.hline(1, 46, 11, '#f6f4ee'); p.hline(1, 46, 12, '#d8d4c8');
    for (let x = 1; x < 47; x += 5) p.vline(x, 9, 12, '#f6f4ee');
    for (let i = 0; i < 26; i++) p.set(2 + Math.floor(G.hash(i, 1, 70) * 44), 12 + Math.floor(G.hash(i, 2, 70) * 24), G.hash(i, 3, 70) < 0.5 ? '#5aae48' : '#84d868');
    // the hutch: plank walls...
    p.rect(5, 14, 20, 14, '#c8935a');
    for (let x = 8; x < 25; x += 4) p.vline(x, 14, 27, '#a87440');
    p.hline(5, 24, 27, '#8a5a30');
    // ...an A-frame roof...
    for (let y = 1; y < 15; y++) {
      const half = Math.round(y * 0.95) + 1;
      for (let x = 15 - half; x <= 14 + half; x++) p.set(x, y, y % 3 === 0 ? '#6a3428' : x <= 14 ? '#9a5040' : '#843e32');
    }
    p.hline(1, 28, 15, '#5a2a20');
    // ...and an arched doorway, with the blue blanket (and its wet spot) inside
    p.rect(11, 19, 8, 9, '#2a1c18'); p.hline(12, 17, 18, '#2a1c18');
    p.rect(11, 24, 8, 4, '#4a78c8'); p.hline(11, 18, 24, '#6a98e0'); p.set(13, 25, '#6a98e0');
    p.rect(15, 25, 2, 2, '#2c4a8a'); p.set(17, 26, '#2c4a8a');
    // a food bowl and a carrot top by the door
    p.rect(6, 28, 5, 2, '#d84848'); p.hline(7, 9, 27, '#e8a040');
    // the white picket fence all the way around
    const WH = '#f6f4ee', WD = '#d8d4c8';
    for (const x of [1, 46]) { p.vline(x, 9, 37, WH); for (let y = 13; y < 33; y += 5) p.set(x === 1 ? 2 : 45, y, WD); }
    for (let x = 1; x < 47; x += 3) { p.vline(x, 30, 37, WH); p.set(x, 29, WH); p.vline(x + 1, 31, 37, WD); }
    p.hline(1, 46, 32, WH); p.hline(1, 46, 35, WH);
    p.outline();
    return p.canvas();
  }
  // Daisy (a gray boy bunny; they found out he was a boy after they named him): sitting, and mid-hop
  function daisy(hop) {
    const p = new Pix(11, 10), fur = '#6e6e78', furD = '#50505a', ear = '#c8a0a8';
    if (hop) {
      p.rect(2, 5, 7, 3, fur); p.hline(2, 8, 7, furD); p.rect(8, 3, 3, 3, fur);
      p.vline(8, 0, 2, fur); p.vline(9, 0, 2, furD); p.set(8, 1, ear); p.set(10, 4, '#1c1424');
      p.set(1, 5, '#ffffff'); p.set(0, 6, '#ffffff'); p.set(3, 8, furD); p.set(8, 8, furD);
    } else {
      p.rect(2, 5, 6, 4, fur); p.hline(2, 7, 8, furD); p.rect(6, 3, 4, 4, fur);
      p.vline(7, 0, 2, fur); p.vline(8, 0, 2, furD); p.set(7, 1, ear); p.set(9, 4, '#1c1424'); p.set(10, 5, '#f0a0a8');
      p.set(1, 6, '#ffffff'); p.set(1, 7, '#ffffff');
    }
    p.outline();
    return p.canvas();
  }

  function firewood() {
    const p = new Pix(32, 20);
    for (let row = 0; row < 4; row++) {
      for (let i = 0; i < 6; i++) {
        const x = 1 + i * 5 + (row % 2) * 2, y = 4 + row * 4;
        if (x > 27) continue;
        p.rect(x, y, 4, 4, '#a07040'); p.rect(x + 1, y + 1, 2, 2, '#d8b070');
      }
    }
    p.hline(0, 31, 3, '#7a5030');
    p.outline();
    return p.canvas();
  }

  function sawhorses() {
    const p = new Pix(44, 22);
    for (const x of [6, 32]) { for (let t = 0; t < 12; t++) { p.set(x - 4 + Math.floor(t / 3), 9 + t, '#b08050'); p.set(x + 4 - Math.floor(t / 3), 9 + t, '#b08050'); } p.rect(x - 5, 8, 11, 2, '#a07040'); }
    p.rect(0, 3, 44, 3, '#f0d8a8'); p.hline(0, 43, 3, '#fff0c8');
    p.rect(2, 6, 40, 2, '#e8c890');
    p.outline();
    return p.canvas();
  }

  // Nate's house, drawn from the family's photos of the side that faces the
  // driveway. Left to right: the whitewashed brick chimney, the 1½-story gable
  // with the covered porch and sunroom, the 2-story block with the front door
  // between two lanterns, the 2-story front gable with its band of windows,
  // and the 1-story wing with the side door everybody actually uses.
  function farmhouse() {
    const W = 240, H = 112, GY = H - 1, p = new Pix(W, H);
    const wall = '#f2f0ea', wallLn = '#dedcd4', wallS = '#d6d4cc', wallSLn = '#c4c2ba';
    const trim = '#ffffff', shut = '#1c2a26', glass = '#34465e', glassL = '#9ab8d8';
    const roof = '#545862', roofR = shade(roof, -0.15);
    const roofCols = {};
    const shingle = (x, y, base) => {
      const c = roofCols[base] || (roofCols[base] = [base, shade(base, -0.3), shade(base, 0.2)]);
      const off = Math.floor(y / 4) % 2 ? 4 : 0;
      p.set(x, y, y % 4 === 3 || (x + off) % 8 === 0 ? c[1] : y % 4 === 0 ? c[2] : c[0]);
    };
    const clap = (x0, y0, x1, y1, dark) => {
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) p.set(x, y, y % 3 === 2 ? (dark ? wallSLn : wallLn) : (dark ? wallS : wall));
    };
    // white-framed window with a cross mullion, a glint and optional shutters
    const win = (x, y, w, h, o = {}) => {
      p.rect(x - 1, y - 1, w + 2, h + 2, trim);
      p.rect(x, y, w, h, o.glass || glass);
      if (o.mullion !== false) { p.vline(x + Math.floor(w / 2), y, y + h - 1, trim); p.hline(x, x + w - 1, y + Math.floor(h / 2), trim); }
      p.set(x + 1, y + 1, glassL); p.set(x + 2, y + 1, glassL); p.set(x + 1, y + 2, glassL);
      if (o.shutters) { const s = o.shutters; p.rect(x - 1 - s, y - 1, s, h + 2, shut); p.rect(x + w + 1, y - 1, s, h + 2, shut); }
    };
    const lantern = (x, y) => {
      p.rect(x, y, 2, 6, '#1c1c22'); p.set(x, y + 2, '#f8d878'); p.set(x + 1, y + 2, '#f8d878'); p.set(x, y + 3, '#f0b848'); p.set(x + 1, y + 3, '#f0b848');
    };
    const gableRoof = (x0, x1, top, cx, peak, ridgeX) => {
      const rake = (x) => peak + Math.floor(Math.abs(x - cx));
      for (let x = x0; x <= x1; x++) for (let y = top; y < rake(x); y++) shingle(x, y, x <= ridgeX ? roof : roofR);
      return rake;
    };

    // ---- roofs, back to front
    // A's long side roof (sweeps down to the porch), with a little shed dormer
    for (let x = 60; x <= 83; x++) for (let y = 14; y <= 78; y++) shingle(x, y, roof);
    p.hline(60, 83, 14, shade(roof, 0.3));
    p.vline(60, 14, 78, shade(roof, -0.35));
    for (let x = 63; x <= 81; x++) for (let y = 41; y <= 44; y++) shingle(x, y, roof);
    p.hline(63, 81, 45, trim);
    clap(65, 46, 79, 58);
    p.vline(64, 46, 58, shade(roof, -0.35)); p.vline(80, 46, 58, shade(roof, -0.35)); p.hline(64, 80, 59, shade(roof, -0.35));
    win(69, 49, 7, 6, { mullion: false, glass: '#8a6a4a' });
    for (let y = 50; y < 55; y += 2) p.hline(69, 75, y, '#a88a68');
    // A's front gable roof
    const aRake = gableRoof(10, 61, 14, 35.5, 32, 35);
    // B: 2-story side-gabled block
    for (let x = 84; x <= 131; x++) for (let y = 30; y <= 62; y++) shingle(x, y, roof);
    p.hline(84, 131, 30, shade(roof, 0.3));
    p.hline(84, 131, 63, trim);
    // D: the 1-story wing (drawn before C, which overlaps its end)
    for (let x = 178; x <= 239; x++) for (let y = 52; y <= 80; y++) shingle(x, y, roof);
    p.hline(178, 239, 52, shade(roof, 0.3));
    p.hline(178, 239, 81, trim);
    // C: 2-story front gable
    const cRake = gableRoof(130, 181, 12, 155.5, 40, 155);

    // ---- walls
    // A's gable wall: full height on the left, down to the porch roof elsewhere
    for (let x = 12; x <= 59; x++) {
      const r = aRake(x);
      clap(x, r + 2, x, x <= 23 ? GY : 78);
    }
    for (let x = 10; x <= 61; x++) { p.set(x, aRake(x), trim); p.set(x, aRake(x) + 1, trim); }
    p.vline(12, 56, GY, trim); p.vline(23, 57, GY, '#e4e4e4');
    win(32, 50, 8, 10, { shutters: 3 });
    p.rect(33, 38, 6, 5, trim); p.hline(34, 37, 39, '#9a9ca4'); p.hline(34, 37, 41, '#9a9ca4');
    // B, C and D walls
    clap(84, 64, 131, GY);
    for (let x = 132; x <= 179; x++) clap(x, cRake(x) + 2, x, GY);
    for (let x = 130; x <= 181; x++) { p.set(x, cRake(x), trim); p.set(x, cRake(x) + 1, trim); }
    clap(180, 82, 239, GY);
    p.rect(132, 64, 2, 48, trim); p.rect(178, 64, 2, 48, trim); p.rect(238, 82, 2, 30, trim);
    // foundations
    p.rect(13, 109, 10, 3, '#b0aca4'); p.rect(134, 109, 44, 3, '#b0aca4'); p.rect(180, 109, 58, 3, '#b0aca4');

    // ---- B's upper floor: a small window, and one with an air conditioner
    win(88, 67, 6, 9);
    win(109, 66, 8, 11, { shutters: 3 });
    p.rect(110, 72, 6, 4, '#c8ccd0'); p.hline(110, 115, 72, '#e8ecf0'); p.hline(111, 114, 74, '#9aa0a8');

    // ---- the porch: shingled roof on white posts over the sunroom and front door
    for (let x = 24; x <= 131; x++) for (let y = 79; y <= 86; y++) shingle(x, y, shade(roof, 0.08));
    p.hline(24, 131, 79, shade(roof, -0.35));
    p.hline(24, 131, 87, trim);
    clap(24, 88, 131, GY, true);
    // recessed corner: a glass door and the white hutch
    p.rect(27, 90, 8, 22, trim); p.rect(28, 91, 6, 17, glass); p.hline(28, 33, 96, trim); p.hline(28, 33, 101, trim); p.set(29, 92, glassL);
    p.rect(37, 95, 8, 2, '#8a8a90'); p.rect(37, 97, 8, 15, '#f4f4f0'); p.rect(38, 99, 2, 3, '#3a3a40'); p.rect(42, 99, 2, 3, '#3a3a40'); p.hline(37, 44, 104, '#d8d8d4');
    // sunroom: four tall glass panels with sheer curtains
    p.rect(48, 88, 46, 24, trim);
    for (let i = 0; i < 4; i++) {
      const x = 50 + i * 11;
      p.rect(x, 90, 9, 20, glass);
      p.vline(x, 90, 109, '#e4e6ee'); p.vline(x + 8, 90, 109, '#e4e6ee'); p.vline(x + 1, 90, 109, '#c8ccd8');
      p.set(x + 3, 91, glassL); p.set(x + 4, 91, glassL); p.set(x + 3, 92, glassL);
    }
    // front door between two lanterns, with a wreath, and a window beside it
    p.rect(99, 88, 16, 24, trim);
    p.rect(100, 89, 14, 23, '#2c2a28');
    for (const [x, y, h] of [[102, 92, 7], [108, 92, 7], [102, 101, 8], [108, 101, 8]]) p.rect(x, y, 4, h, '#3a3734');
    p.set(111, 100, '#f8d040');
    for (let a = 0; a < 12; a++) p.set(107 + Math.round(Math.cos(a / 12 * Math.PI * 2) * 3), 95 + Math.round(Math.sin(a / 12 * Math.PI * 2) * 3), a % 4 ? '#2e7a30' : '#4aa040');
    p.set(107, 98, '#d03030'); p.set(106, 99, '#d03030'); p.set(108, 99, '#d03030');
    lantern(96, 91); lantern(116, 91);
    win(120, 91, 8, 12);
    // posts
    for (const x of [24, 46, 94, 130]) p.rect(x, 88, 2, 24, trim);

    // ---- C: attic vent, two shuttered windows upstairs, a band of five below
    p.rect(152, 46, 8, 8, trim);
    for (let y = 47; y < 53; y += 2) { p.hline(153, 158, y, '#9a9ca4'); p.hline(153, 158, y + 1, '#d8dade'); }
    win(140, 67, 8, 11, { shutters: 3 });
    win(164, 67, 8, 11, { shutters: 3 });
    p.rect(140, 90, 31, 14, trim);
    for (let i = 0; i < 5; i++) {
      const x = 141 + i * 6;
      p.rect(x, 91, 5, 12, glass); p.set(x + 1, 92, glassL); p.set(x + 1, 93, glassL);
    }
    p.set(155, 96, '#f8d878'); p.set(154, 97, '#f8d878'); p.set(155, 97, '#f0c060'); p.set(155, 98, '#b88848');
    p.rect(136, 90, 3, 14, shut); p.rect(172, 90, 3, 14, shut);

    // ---- D: the side door (glass storm door) with its lantern, two shuttered windows
    p.rect(193, 86, 14, 26, trim);
    p.rect(195, 88, 10, 15, '#2a3444'); p.set(196, 89, glassL); p.set(197, 89, glassL); p.set(196, 90, glassL);
    p.hline(195, 204, 104, '#d8d8d8'); p.set(203, 97, '#c8c8c8');
    lantern(189, 90);
    win(213, 89, 7, 11, { shutters: 2 });
    win(229, 89, 7, 11, { shutters: 2 });

    // ---- the tall brick chimney on the end, whitewash flaking off toward the bottom
    for (let y = 6; y <= GY; y++) {
      const row = Math.floor(y / 3), off = row % 2 ? 2 : 0;
      for (let x = 0; x <= 13; x++) {
        let col = y % 3 === 2 || (x + off) % 5 === 0 ? '#c49c84' : G.hash(Math.floor((x + off) / 5), row, 5) < 0.3 ? '#963a2a' : '#ac4630';
        if (G.hash(x >> 1, y >> 1, 31) < 0.08 + 0.55 * (y / H) ** 2) col = '#e6dcd2';
        if (x >= 12) col = shade(col, -0.2);
        p.set(x, y, col);
      }
    }
    p.rect(0, 4, 14, 2, '#6a2a20'); p.hline(3, 10, 4, '#2a1a18');
    p.outline();
    return p.canvas();
  }

  // The raised stone patio off the porch: flagstone top, a fieldstone
  // retaining wall, and brick steps down to the lawn at the chimney end.
  function patio() {
    const W = 112, H = 48, p = new Pix(W, H);
    for (let y = 0; y < 30; y++) {
      const band = Math.floor(y / 8), off = band % 2 ? 5 : 0;
      for (let x = 0; x < W; x++) {
        const seam = y % 8 === 7 || (x + off) % 10 === 9;
        const h = G.hash(Math.floor((x + off) / 10), band, 40);
        p.set(x, y, seam ? '#a89c88' : h < 0.33 ? '#c8bca8' : h < 0.66 ? '#bcb09a' : '#d2c8b4');
      }
    }
    // capstones and the fieldstone wall
    p.rect(16, 30, W - 16, 3, '#ddd2bc'); p.hline(16, W - 1, 30, '#ece4d2');
    const stones = ['#c8b090', '#b89c7c', '#d8c4a4', '#a8a090', '#9a8a70'];
    for (let y = 33; y < 44; y++) {
      const row = Math.floor((y - 33) / 4);
      for (let x = 16; x < W; x++) {
        const k = Math.floor((x + row * 5) / 8);
        const seam = (y - 33) % 4 === 3 || (x + row * 5) % 8 === 0;
        p.set(x, y, seam ? '#7a6e5c' : stones[Math.floor(G.hash(k, row, 41) * stones.length)]);
      }
    }
    p.rect(16, 44, W - 16, 2, '#a8a8a4');
    // brick steps
    for (let i = 0; i < 3; i++) {
      const y0 = 30 + i * 6;
      p.rect(1, y0, 14, 6, '#a84c3a'); p.hline(1, 14, y0, '#d07a5e'); p.hline(1, 14, y0 + 1, '#c06a50');
      p.vline(5 + (i % 2) * 3, y0 + 2, y0 + 5, '#8a3a2c'); p.vline(10 + (i % 2) * 3, y0 + 2, y0 + 5, '#8a3a2c');
    }
    p.outline();
    return p.canvas();
  }

  function grill() {
    const p = new Pix(16, 20);
    p.rect(2, 3, 12, 4, '#3a3a44'); p.hline(3, 12, 3, '#5a5a66'); p.hline(5, 10, 2, '#9aa0a8');
    p.rect(2, 7, 12, 6, '#2a2a30'); p.hline(2, 13, 7, '#1c1c22');
    p.rect(0, 8, 2, 2, '#6a6a72'); p.rect(14, 8, 2, 2, '#6a6a72');
    p.vline(3, 13, 18, '#2a2a30'); p.vline(12, 13, 18, '#2a2a30'); p.hline(3, 12, 16, '#3a3a44');
    p.set(3, 19, '#1c1c22'); p.set(12, 19, '#1c1c22');
    p.outline();
    return p.canvas();
  }

  // The navy patio umbrella, closed up and strapped, in its stand.
  function patioUmbrella() {
    const p = new Pix(12, 36);
    p.vline(6, 0, 33, '#d8d8d8'); p.set(6, 0, '#c8c8c8');
    for (let y = 3; y <= 25; y++) {
      const half = y < 6 || y > 22 ? 1 : 2;
      for (let x = 6 - half; x <= 5 + half + 1; x++) p.set(x, y, x <= 5 ? '#344a80' : '#283a6a');
    }
    p.hline(4, 8, 14, '#1c2848');
    p.rect(3, 32, 7, 3, '#3a3a40'); p.hline(3, 9, 32, '#5a5a62');
    p.outline();
    return p.canvas();
  }

  // Split logs stacked end-on: a little stack, and a long rack with black metal ends.
  function logEnds(p, x0, y0, w, rows, seed) {
    for (let row = 0; row < rows; row++) {
      for (let x = x0 + (row % 2) * 2; x + 4 <= x0 + w; x += 5) {
        const y = y0 + row * 4, t = G.hash(x, row, seed);
        p.rect(x, y, 4, 4, t < 0.4 ? '#a07040' : t < 0.75 ? '#8a5a30' : '#b8844c');
        p.rect(x + 1, y + 1, 2, 2, t < 0.5 ? '#d8b070' : '#e8c890');
      }
    }
  }
  function woodStack() {
    const p = new Pix(16, 18);
    logEnds(p, 1, 2, 14, 4, 3);
    p.outline();
    return p.canvas();
  }
  function woodRack() {
    const p = new Pix(48, 26);
    logEnds(p, 3, 2, 42, 5, 7);
    p.rect(0, 1, 2, 24, '#2a2a30'); p.rect(46, 1, 2, 24, '#2a2a30'); p.rect(0, 22, 48, 2, '#2a2a30');
    p.outline();
    return p.canvas();
  }
  // A loose heap of freshly split wood waiting to be stacked.
  function woodPile() {
    const p = new Pix(30, 14);
    const cols = ['#c88848', '#a86a38', '#e0a868', '#b87a40'];
    for (let i = 0; i < 16; i++) {
      const x = 2 + Math.floor(G.hash(i, 1, 60) * 21), y = 3 + Math.floor(G.hash(i, 2, 60) * 7) + Math.floor(Math.abs(x - 13) / 5);
      p.rect(x, y, 6, 3, cols[i % cols.length]); p.hline(x, x + 5, y, '#f0c890');
    }
    p.outline();
    return p.canvas();
  }

  function firePit() {
    const p = new Pix(16, 14);
    for (let y = 0; y < 14; y++) for (let x = 0; x < 16; x++) {
      const dx = (x - 7.5) / 7.5, dy = (y - 7) / 6;
      if (dx * dx + dy * dy > 1) continue;
      const inner = (x - 7.5) ** 2 / 25 + (y - 7) ** 2 / 12 <= 1;
      p.set(x, y, inner ? (G.hash(x, y, 61) < 0.25 ? '#6a4028' : '#3a2a24') : ['#8a8070', '#a89c88', '#6a5a4a'][Math.floor(G.hash(x >> 1, y >> 1, 62) * 3)]);
    }
    p.hline(5, 10, 6, '#8a5a30'); p.hline(6, 9, 8, '#a07040'); p.set(7, 7, '#c8c0b8');
    p.outline();
    return p.canvas();
  }

  // White wrought-iron table and chair, plus a yellow sling chair.
  function lawnSet() {
    const p = new Pix(32, 22);
    const white = '#f2f2ee', iron = '#d8d8d4';
    for (let y = 6; y <= 12; y++) for (let x = 9; x <= 23; x++) if ((x - 16) ** 2 / 49 + (y - 9) ** 2 / 9 <= 1) p.set(x, y, (x + y) % 3 ? white : iron);
    p.vline(16, 13, 19, iron); p.hline(13, 19, 20, iron);
    // wrought-iron chair
    p.rect(1, 3, 7, 7, white); for (let x = 2; x < 7; x += 2) p.vline(x, 4, 8, iron);
    p.rect(1, 10, 7, 3, white); p.vline(1, 13, 19, iron); p.vline(7, 13, 19, iron);
    // yellow sling chair
    p.rect(25, 3, 6, 8, '#f0d060'); p.hline(25, 30, 3, '#f8e890');
    p.rect(25, 11, 6, 3, '#e8c040'); p.vline(24, 3, 19, white); p.vline(31, 3, 19, white);
    p.outline();
    return p.canvas();
  }

  // The driveway hoop: glass backboard, orange rim and net, black pole.
  function hoop() {
    const p = new Pix(28, 48);
    p.rect(2, 0, 24, 15, '#dfe8f2');
    p.rect(2, 0, 24, 2, '#2a58b0'); p.rect(2, 13, 24, 2, '#2a58b0'); p.rect(2, 0, 2, 15, '#2a58b0'); p.rect(24, 0, 2, 15, '#2a58b0');
    p.rect(9, 6, 10, 1, '#2a58b0'); p.rect(9, 6, 1, 7, '#2a58b0'); p.rect(18, 6, 1, 7, '#2a58b0');
    p.hline(9, 18, 15, '#e86020'); p.hline(9, 18, 16, '#c04a18');
    for (let y = 17; y <= 21; y++) { const i = y - 17; p.set(9 + i, y, '#f4f4f4'); p.set(18 - i, y, '#f4f4f4'); p.set(13, y, '#e8e8e8'); }
    p.rect(13, 17, 3, 27, '#1c1c22');
    p.rect(8, 42, 12, 6, '#2a2a30'); p.hline(8, 19, 42, '#4a4a54');
    p.outline();
    return p.canvas();
  }

  // The big double-trunk tree between the house and the driveway (it towers
  // over the house), just starting to turn for fall.
  function bigTree() {
    const W = 96, H = 120, p = new Pix(W, H);
    const bark = '#6e6050', barkD = '#4a3e34', barkL = '#8a7c6a';
    // one thick base that splits into two trunks
    for (let y = 40; y < H; y++) {
      const t = Math.max(0, (y - 40) / 64), spread = Math.round((1 - Math.min(1, t)) * 13);
      const w = y > 100 ? 8 : 6;
      for (const cx of [44 - spread, 52 + spread]) {
        p.rect(cx - (w >> 1), y, w, 1, bark); p.set(cx - (w >> 1), y, barkL); p.set(cx + (w >> 1) - 1, y, barkD);
      }
    }
    p.rect(40, 108, 17, 12, bark); p.vline(40, 108, 119, barkL); p.vline(56, 108, 119, barkD);
    p.hline(37, 59, 119, barkD); p.set(38, 118, barkD); p.set(58, 118, barkD);
    const blobs = [[48, 34, 30], [20, 44, 18], [76, 44, 18], [30, 18, 18], [66, 18, 18], [48, 12, 16], [48, 58, 16]];
    for (let y = 0; y < 74; y++) for (let x = 0; x < W; x++) {
      if (!blobs.some(([cx, cy, r]) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r)) continue;
      const s = (x - 48) * 0.035 + (y - 30) * 0.055 + (G.hash(x >> 1, y >> 1, 77) - 0.5) * 1.3;
      p.set(x, y, s < -0.95 ? '#d4d072' : s < -0.35 ? '#98c254' : s < 0.45 ? '#5a9a3c' : '#3a7030');
    }
    // leaf clumps, yellowing leaves and a few branches showing through
    for (let i = 0; i < 26; i++) {
      const x = 8 + Math.floor(G.hash(i, 1, 78) * 80), y = 6 + Math.floor(G.hash(i, 2, 78) * 60);
      if (!p.get(x, y)) continue;
      if (i % 3) { p.hline(x - 1, x + 1, y + 1, '#2e6028'); p.set(x, y, '#b8d868'); } else { p.set(x, y, '#e8c048'); p.set(x + 1, y, '#d8a040'); }
    }
    for (const [x0, y0, x1, y1] of [[31, 60, 18, 46], [65, 60, 78, 46], [36, 52, 30, 30], [60, 52, 66, 30]]) {
      for (let k = 0; k <= 12; k++) p.set(Math.round(x0 + (x1 - x0) * k / 12), Math.round(y0 + (y1 - y0) * k / 12), barkD);
    }
    p.outline('#1c2a18');
    return p.canvas();
  }

  // Navy SUV seen from above, nose toward the house.
  function suv() {
    const p = new Pix(26, 40);
    const navy = '#283868', navyL = '#3a4c88', navyD = '#1c2850', glass = '#2a3a50';
    for (const [x, y] of [[0, 6], [22, 6], [0, 28], [22, 28]]) p.rect(x, y, 4, 7, '#1c1c22');
    p.rect(2, 1, 22, 38, navy);
    p.vline(2, 1, 38, navyL); p.vline(23, 1, 38, navyD);
    p.rect(4, 2, 18, 8, navyL); p.set(4, 2, '#f8f0b0'); p.set(21, 2, '#f8f0b0');
    p.rect(4, 10, 18, 5, glass); p.hline(5, 10, 11, '#8ab0d8');
    p.rect(4, 15, 18, 13, navy); p.vline(6, 16, 27, '#9aa0a8'); p.vline(19, 16, 27, '#9aa0a8');
    p.rect(4, 28, 18, 4, glass);
    p.rect(3, 33, 20, 5, navyD); p.set(3, 36, '#e03030'); p.set(22, 36, '#e03030');
    p.outline();
    return p.canvas();
  }

  function picnicTable() {
    const p = new Pix(32, 20);
    p.rect(2, 2, 28, 3, '#9a6a3c'); p.rect(2, 15, 28, 3, '#9a6a3c');
    p.rect(4, 6, 24, 8, '#b07c4c');
    for (const y of [8, 11]) p.hline(4, 27, y, '#8a5a30');
    p.vline(6, 5, 15, '#6a4628'); p.vline(25, 5, 15, '#6a4628');
    p.outline();
    return p.canvas();
  }

  // ================================================================ HOUSE INTERIOR
  // Furniture drawn from the listing photos of the house. Things that stand
  // against a wall are tall enough to reach up over the two-tile wall face.
  const GLASS = '#9ac4e0', GLASS_L = '#d8f0ff', BRASS = '#d8b050', WHITE = '#f6f4ee', WHITE_D = '#d8d4c8';
  const finish = (p) => { p.outline(); return p.canvas(); };
  // window glass with a hint of the yard outside
  function view(p, x, y, w, h) {
    p.rect(x, y, w, h, GLASS);
    for (let i = 0; i < w; i++) {
      const t = y + h - 2 - Math.round(Math.abs(Math.sin((x + i) * 0.7)) * 3);
      for (let yy = Math.max(y, t); yy < y + h; yy++) p.set(x + i, yy, yy > t + 1 ? '#4a8a3c' : '#6aaa4c');
    }
    p.set(x + 1, y + 1, GLASS_L);
  }

  // Wall window with white trim; optional bamboo shade or curtains.
  function wallWindow(tiles, deco) {
    const W = tiles * 16, p = new Pix(W, 26);
    p.rect(1, 0, W - 2, 24, WHITE);
    for (let i = 0; i < tiles; i++) {
      const x = i * 16;
      view(p, x + 3, 2, 10, 20);
      p.hline(x + 3, x + 12, 11, WHITE);
      if (deco === 'shade') { p.rect(x + 3, 2, 10, 7, '#c8a46c'); for (let y = 3; y < 9; y += 2) p.hline(x + 3, x + 12, y, '#a8844c'); }
    }
    p.rect(0, 23, W, 3, WHITE); p.hline(0, W - 1, 25, WHITE_D);
    if (deco === 'curtains') { p.rect(0, 0, 3, 24, '#f0e8e0'); p.rect(W - 3, 0, 3, 24, '#f0e8e0'); p.hline(0, W - 1, 0, '#3a3034'); }
    return finish(p);
  }

  function curio() {
    const p = new Pix(16, 40);
    p.rect(0, 2, 16, 38, '#b8783e'); p.rect(0, 0, 16, 3, '#9a6234'); p.hline(0, 15, 0, '#d8a060');
    p.rect(2, 4, 12, 20, '#cfe0e8');
    for (const y of [10, 16]) p.hline(2, 13, y, '#9a6234');
    p.vline(7, 4, 23, '#9a6234'); p.vline(8, 4, 23, '#9a6234');
    for (const y of [8, 14, 21]) { p.set(3, y, '#ffffff'); p.set(4, y, '#3a5aa8'); p.set(10, y, '#ffffff'); p.set(11, y, '#c84848'); p.set(12, y - 1, '#f0e0a0'); }
    p.rect(1, 26, 14, 12, '#a86a34'); p.vline(7, 26, 37, '#7a4a22'); p.set(6, 31, '#f0d070'); p.set(9, 31, '#f0d070');
    p.hline(0, 15, 39, '#6a4020');
    return finish(p);
  }

  function frenchDoor() {
    const p = new Pix(16, 28);
    p.rect(0, 0, 16, 28, WHITE);
    for (const dx of [1, 9]) for (let r = 0; r < 5; r++) for (let c = 0; c < 2; c++) view(p, dx + c * 3, 2 + r * 5, 2, 4);
    p.vline(7, 0, 27, WHITE_D); p.vline(8, 0, 27, WHITE_D); p.set(6, 15, BRASS); p.set(9, 15, BRASS);
    return finish(p);
  }

  // Living room: brick fireplace and dark mantel, a landscape hung above.
  function brickFireplace() {
    const p = new Pix(32, 44);
    p.rect(7, 1, 18, 11, '#c8a050'); p.rect(8, 2, 16, 9, '#8ab0c8'); p.rect(8, 7, 16, 4, '#5a7a4a'); p.hline(8, 23, 7, '#8aa070'); p.set(14, 5, '#f0f0f0');
    for (let y = 16; y < 36; y++) for (let x = 3; x < 29; x++) {
      const row = Math.floor((y - 16) / 3), off = row % 2 ? 2 : 0;
      p.set(x, y, (y - 16) % 3 === 2 || (x + off) % 5 === 0 ? '#c49c84' : G.hash(x >> 2, row, 9) < 0.3 ? '#963a2a' : '#ac4630');
    }
    p.rect(1, 13, 30, 3, '#4a2a1c'); p.hline(1, 30, 13, '#6a3a26'); p.set(5, 12, '#e8d8a0'); p.set(26, 11, '#e8e8f0'); p.set(26, 12, '#e8e8f0');
    p.rect(9, 22, 14, 14, '#1c1418'); p.hline(9, 22, 22, '#3a2a24');
    p.hline(11, 20, 33, '#6a4028'); p.hline(12, 19, 32, '#8a5a30'); p.set(14, 31, '#f8a028'); p.set(16, 30, '#f8d040'); p.set(17, 31, '#f86020'); p.set(15, 30, '#f86020');
    p.rect(0, 36, 32, 6, '#8a7e70'); p.hline(0, 31, 36, '#a89c8c');
    return finish(p);
  }

  // Bay window over the tufted sofa (and in the family room).
  function bayWindow() {
    const p = new Pix(64, 28);
    p.rect(0, 0, 64, 26, WHITE);
    for (let i = 0; i < 5; i++) view(p, 3 + i * 12, 2, 10, 20);
    p.rect(0, 23, 64, 5, WHITE); p.hline(0, 63, 27, WHITE_D);
    return finish(p);
  }

  function tuftedSofa() {
    const p = new Pix(48, 26), c = '#d8ccb4', d = '#bcae94';
    p.rect(4, 2, 40, 10, c); p.hline(4, 43, 2, '#e8dcc4');
    for (let y = 4; y < 11; y += 3) for (let x = 6 + (y % 2) * 2; x < 42; x += 5) p.set(x, y, d);
    p.rect(0, 5, 6, 15, c); p.rect(42, 5, 6, 15, c); p.vline(5, 6, 19, d); p.vline(42, 6, 19, d); p.hline(0, 5, 5, '#e8dcc4'); p.hline(42, 47, 5, '#e8dcc4');
    p.rect(6, 12, 36, 8, '#e0d4bc'); p.vline(17, 12, 19, d); p.vline(29, 12, 19, d); p.hline(6, 41, 12, '#ece2cc');
    p.rect(1, 20, 46, 3, d); p.set(2, 23, '#4a3020'); p.set(45, 23, '#4a3020'); p.set(2, 24, '#4a3020'); p.set(45, 24, '#4a3020');
    p.rect(8, 7, 7, 6, '#f2ecdc'); p.rect(20, 7, 8, 6, '#6a8ab0'); p.set(23, 9, '#e8d8a8'); p.rect(33, 7, 7, 6, '#f2ecdc');
    return finish(p);
  }

  // Round side table with a blue-and-white ginger jar lamp.
  function gingerLamp() {
    const p = new Pix(16, 32);
    p.rect(3, 0, 10, 8, '#f4ecd8'); p.hline(3, 12, 0, '#fff8e8'); p.hline(3, 12, 7, '#d8ccb0');
    p.vline(8, 8, 9, BRASS);
    p.rect(4, 10, 8, 9, '#f4f4f8'); p.rect(5, 12, 6, 5, '#3a5aa8'); p.set(7, 14, '#f4f4f8'); p.set(9, 13, '#f4f4f8');
    p.rect(1, 19, 14, 3, '#9a6234'); p.hline(1, 14, 19, '#c88a50');
    p.vline(3, 22, 31, '#7a4a22'); p.vline(12, 22, 31, '#7a4a22'); p.hline(3, 12, 27, '#7a4a22');
    return finish(p);
  }

  function secretary() {
    const p = new Pix(16, 42);
    p.rect(0, 0, 16, 3, '#4a2218'); p.rect(1, 3, 14, 17, '#6a3424');
    p.rect(3, 5, 10, 13, '#cfd8e0'); p.hline(3, 12, 11, '#6a3424'); p.vline(8, 5, 17, '#6a3424');
    for (const y of [10, 16]) { p.set(4, y, '#e0c080'); p.set(6, y, '#ffffff'); p.set(11, y, '#a83a3a'); }
    p.rect(0, 20, 16, 4, '#8a4a30'); p.hline(0, 15, 20, '#a85a3a');
    p.rect(1, 24, 14, 16, '#6a3424');
    for (const y of [27, 32, 37]) { p.hline(2, 13, y - 1, '#4a2218'); p.set(5, y, BRASS); p.set(10, y, BRASS); }
    p.hline(0, 15, 41, '#3a1810');
    return finish(p);
  }

  // Front-facing chair (seen from the front) in any upholstery.
  function armchair(c, opt = {}) {
    const p = new Pix(16, 22), d = shade(c, -0.18), l = shade(c, 0.15);
    p.rect(2, 1, 12, 9, c); p.hline(3, 12, 1, l);
    if (opt.wing) { p.rect(0, 3, 3, 9, c); p.rect(13, 3, 3, 9, c); p.vline(2, 4, 11, d); p.vline(13, 4, 11, d); }
    if (opt.stripes) for (let x = 3; x < 13; x += 2) p.vline(x, 2, 9, d);
    p.rect(0, 10, 16, 8, c); p.rect(3, 10, 10, 6, l); p.hline(3, 12, 10, shade(c, 0.25));
    p.vline(2, 10, 17, d); p.vline(13, 10, 17, d); p.hline(0, 15, 17, d);
    if (opt.studs) for (let x = 1; x < 15; x += 2) p.set(x, 16, BRASS);
    const leg = opt.leg || '#4a3020';
    p.vline(1, 18, 21, leg); p.vline(14, 18, 21, leg);
    return finish(p);
  }

  function coffeeTable() {
    const p = new Pix(32, 18);
    p.rect(0, 0, 32, 9, '#7a4a28'); p.hline(0, 31, 0, '#9a6234'); p.rect(0, 9, 32, 3, '#5a3418');
    p.rect(4, 2, 8, 2, '#2a4a7a'); p.rect(4, 4, 8, 2, '#e8e0c8'); p.rect(5, 1, 6, 1, '#a83a3a');
    p.vline(22, 0, 5, '#f8f4e8'); p.vline(25, 1, 5, '#f8f4e8'); p.set(22, 0, '#f8d040'); p.set(25, 1, '#f8d040');
    p.vline(1, 12, 17, '#4a2a18'); p.vline(30, 12, 17, '#4a2a18');
    return finish(p);
  }

  // Red Chinese garden stool.
  function drumStool() {
    const p = new Pix(10, 13);
    p.rect(1, 0, 8, 3, '#c83838'); p.hline(1, 8, 0, '#e86060');
    p.rect(0, 3, 10, 8, '#b02c2c'); p.hline(0, 9, 5, '#e8c060'); p.hline(0, 9, 9, '#e8c060');
    p.set(3, 7, '#f0e0c0'); p.set(6, 7, '#f0e0c0'); p.rect(1, 11, 8, 2, '#8a2020');
    return finish(p);
  }

  // A sofa seen from behind (the red floral one faces the fireplace).
  function sofaBack() {
    const p = new Pix(48, 20), c = '#b0443c', d = '#8a2c28';
    p.rect(0, 0, 48, 14, c); p.hline(0, 47, 0, '#c8605a');
    for (let i = 0; i < 26; i++) { const x = 2 + Math.floor(G.hash(i, 1, 33) * 44), y = 2 + Math.floor(G.hash(i, 2, 33) * 10); p.set(x, y, i % 3 ? '#e8c890' : '#6a8a5a'); p.set(x + 1, y, d); }
    p.rect(0, 14, 48, 4, d); p.vline(2, 18, 19, '#3a2418'); p.vline(45, 18, 19, '#3a2418');
    return finish(p);
  }

  function tuftedOttoman() {
    const p = new Pix(22, 15);
    for (let y = 0; y < 9; y++) for (let x = 0; x < 22; x++) if ((x - 10.5) ** 2 / 121 + (y - 4.5) ** 2 / 20 <= 1) p.set(x, y, (x + y) % 4 ? '#c8b890' : '#7a8a5a');
    for (let x = 4; x < 18; x += 4) p.set(x, 4, '#8a7a5a');
    p.rect(1, 6, 20, 7, '#b8a880'); for (let x = 2; x < 20; x += 3) { p.set(x, 8, '#a84848'); p.set(x + 1, 10, '#5a7a9a'); }
    p.hline(1, 20, 12, '#8a7a5a'); p.rect(2, 13, 18, 2, '#5a4030');
    return finish(p);
  }

  // Wood console on an X-shaped metal base, with a black-shaded lamp and an orchid.
  function xConsole() {
    const p = new Pix(32, 30);
    p.rect(19, 0, 10, 6, '#1c1c22'); p.vline(24, 6, 11, BRASS); p.rect(22, 11, 5, 2, BRASS);
    p.vline(7, 4, 11, '#4a7a3a'); p.set(6, 4, '#e8a0d8'); p.set(8, 5, '#f0c0e8'); p.set(6, 6, '#e8a0d8'); p.rect(5, 10, 5, 3, '#f4f4f0');
    p.rect(0, 13, 32, 7, '#8a5a30'); p.hline(0, 31, 13, '#b07a44'); p.hline(2, 29, 17, '#6a4020'); p.set(15, 16, BRASS);
    for (let t = 0; t < 9; t++) { p.set(3 + t, 20 + t, '#b8bcc4'); p.set(11 - t, 20 + t, '#b8bcc4'); p.set(20 + t, 20 + t, '#b8bcc4'); p.set(28 - t, 20 + t, '#b8bcc4'); }
    p.hline(3, 12, 29, '#9aa0a8'); p.hline(20, 29, 29, '#9aa0a8');
    return finish(p);
  }

  function grandfatherClock() {
    const p = new Pix(12, 44);
    p.rect(1, 0, 10, 3, '#5a2a18'); p.set(2, 0, '#7a3a24'); p.set(9, 0, '#7a3a24');
    p.rect(0, 3, 12, 12, '#6a3424'); p.rect(2, 5, 8, 8, '#f4ecd8'); p.set(6, 9, '#1c1c22'); p.vline(6, 6, 9, '#1c1c22'); p.hline(6, 8, 9, '#1c1c22');
    p.rect(1, 15, 10, 21, '#7a3c28'); p.rect(3, 17, 6, 15, '#4a2218'); p.vline(6, 18, 27, BRASS); p.rect(5, 27, 3, 3, '#f0c850');
    p.rect(0, 36, 12, 8, '#5a2a18'); p.hline(0, 11, 36, '#7a3c28');
    return finish(p);
  }

  function louverDoor() {
    const p = new Pix(16, 28);
    p.rect(0, 0, 16, 28, WHITE);
    for (const x of [1, 9]) for (let y = 2; y < 26; y += 2) p.hline(x, x + 5, y, WHITE_D);
    p.vline(7, 0, 27, WHITE_D); p.vline(8, 0, 27, WHITE_D); p.set(6, 14, BRASS); p.set(9, 14, BRASS);
    return finish(p);
  }

  function archMirror() {
    const p = new Pix(12, 22);
    for (let y = 0; y < 22; y++) for (let x = 0; x < 12; x++) {
      const inArch = y >= 6 || (x - 5.5) ** 2 + (y - 6) ** 2 <= 36;
      if (inArch) p.set(x, y, '#c8a050');
    }
    for (let y = 2; y < 20; y++) for (let x = 2; x < 10; x++) if (y >= 6 || (x - 5.5) ** 2 + (y - 6) ** 2 <= 14) p.set(x, y, '#d0dce4');
    p.set(4, 6, '#ffffff'); p.set(4, 7, '#ffffff'); p.set(5, 8, '#ffffff');
    return finish(p);
  }

  // Den: stone fireplace with a white mantel, the TV above it.
  function stoneFireplace() {
    const p = new Pix(32, 44);
    p.rect(4, 0, 24, 12, '#1c1c22'); p.rect(5, 1, 22, 10, '#2a3240'); p.hline(6, 12, 2, '#4a5a70');
    p.rect(1, 13, 30, 3, WHITE); p.hline(1, 30, 13, '#ffffff');
    p.rect(2, 16, 28, 20, WHITE); p.rect(5, 18, 22, 18, '#8a8a8e');
    for (let y = 18; y < 36; y++) for (let x = 5; x < 27; x++) if (G.hash(x >> 2, y >> 1, 13) < 0.3) p.set(x, y, '#a8a8ac'); else if ((x + y * 3) % 7 === 0) p.set(x, y, '#6a6a70');
    p.rect(9, 22, 14, 14, '#141418'); p.rect(10, 23, 12, 12, '#2a2a30'); p.vline(15, 23, 34, '#4a4a54'); p.vline(16, 23, 34, '#4a4a54');
    p.hline(11, 20, 33, '#e88020'); p.set(13, 32, '#f8d040'); p.set(18, 32, '#f8d040');
    p.rect(0, 36, 32, 6, '#8a8a8e'); p.hline(0, 31, 36, '#a8a8ac');
    return finish(p);
  }

  // Built-in shelves stuffed with books.
  function bookshelf2() {
    const p = new Pix(16, 44);
    p.rect(0, 0, 16, 44, WHITE); p.rect(2, 2, 12, 40, '#d8d4c8');
    const cols = ['#a83a3a', '#2a4a7a', '#3a6a3a', '#e8c060', '#6a3a6a', '#1c1c22', '#c86a28', '#f0f0e8', '#7a4a2a'];
    for (const y0 of [3, 13, 23, 33]) {
      p.hline(2, 13, y0 + 8, WHITE);
      for (let x = 2; x < 14; x++) {
        const h = 5 + Math.floor(G.hash(x, y0, 21) * 3);
        p.vline(x, y0 + 8 - h, y0 + 7, cols[Math.floor(G.hash(x, y0, 22) * cols.length)]);
      }
    }
    return finish(p);
  }

  function guitar() {
    const p = new Pix(10, 26);
    p.rect(4, 0, 2, 2, '#3a2418'); p.vline(4, 2, 11, '#5a3418'); p.vline(5, 2, 11, '#7a4a28');
    for (let y = 12; y < 26; y++) for (let x = 0; x < 10; x++) {
      const top = (x - 4.5) ** 2 / 9 + (y - 15) ** 2 / 9 <= 1, bottom = (x - 4.5) ** 2 / 20 + (y - 21) ** 2 / 16 <= 1;
      if (top || bottom) p.set(x, y, '#d8a058');
    }
    p.set(4, 17, '#2a1a10'); p.set(5, 17, '#2a1a10'); p.set(4, 18, '#2a1a10'); p.set(5, 18, '#2a1a10'); p.hline(3, 6, 22, '#5a3418');
    return finish(p);
  }

  function barometer() {
    const p = new Pix(8, 16);
    p.rect(2, 0, 4, 4, '#7a4a28'); p.rect(3, 1, 2, 2, '#f4ecd8');
    p.vline(3, 4, 8, '#7a4a28'); p.vline(4, 4, 8, '#7a4a28');
    for (let y = 8; y < 16; y++) for (let x = 0; x < 8; x++) if ((x - 3.5) ** 2 + (y - 11.5) ** 2 <= 13) p.set(x, y, '#7a4a28');
    for (let y = 9; y < 15; y++) for (let x = 1; x < 7; x++) if ((x - 3.5) ** 2 + (y - 11.5) ** 2 <= 6) p.set(x, y, '#f4ecd8');
    p.set(4, 11, '#1c1c22'); p.set(5, 10, '#1c1c22');
    return finish(p);
  }

  function floorLamp() {
    const p = new Pix(12, 34);
    p.rect(1, 0, 10, 8, '#d8c8a0'); for (let x = 2; x < 11; x += 2) p.vline(x, 1, 7, '#c0ac80'); p.hline(1, 10, 7, '#a89470');
    p.vline(6, 8, 31, '#3a3a40'); p.rect(3, 31, 7, 3, '#2a2a30');
    return finish(p);
  }

  function writingDesk() {
    const p = new Pix(32, 22);
    p.rect(0, 0, 32, 8, '#7a4a28'); p.hline(0, 31, 0, '#9a6234');
    p.rect(3, 1, 8, 5, '#f4f0e4'); p.hline(4, 9, 3, '#8a8a90'); p.rect(20, 1, 4, 4, '#2a4a7a'); p.set(26, 2, '#c8a050');
    p.rect(0, 8, 32, 8, '#6a3c20'); for (const x of [2, 22]) { p.rect(x, 9, 8, 6, '#7a4a28'); p.set(x + 4, 12, BRASS); }
    p.vline(1, 16, 21, '#4a2a18'); p.vline(30, 16, 21, '#4a2a18');
    return finish(p);
  }

  // ---- kitchen
  // The big built-in stainless fridge. 'open' shows it emptied out with the light on.
  function fridge(open) {
    const p = new Pix(32, 44), st = '#c8ccd2', sd = '#9aa0a8', sl = '#eef0f4';
    p.rect(0, 0, 32, 5, '#3a3a40'); for (let x = 2; x < 30; x += 2) p.vline(x, 1, 3, '#6a6a74');
    p.rect(0, 5, 32, 37, st); p.hline(0, 31, 5, sl);
    if (open) {
      p.rect(2, 7, 28, 33, '#f8f8f0'); for (const y of [16, 25, 33]) p.hline(2, 29, y, '#d8dce0');
      p.rect(4, 13, 3, 3, '#e8e060'); p.rect(22, 30, 4, 3, '#a8d870'); p.set(5, 8, '#fff8c0'); p.set(26, 8, '#fff8c0');
      for (let i = 0; i < 6; i++) p.set(4 + Math.floor(G.hash(i, 3, 70) * 24), 9 + Math.floor(G.hash(i, 4, 70) * 30), '#d8f0ff');
    } else {
      p.vline(15, 5, 41, sd); p.vline(16, 5, 41, sd);
      p.rect(12, 12, 2, 18, sl); p.vline(13, 12, 29, sd); p.rect(18, 12, 2, 18, sl); p.vline(19, 12, 29, sd);
      for (let i = 0; i < 6; i++) p.vline(3 + i * 2, 8, 38, i % 2 ? '#d4d8de' : st);
    }
    p.rect(0, 42, 32, 2, '#5a5a62');
    return finish(p);
  }

  // Cream upper cabinets hung on the wall; 'micro' puts the microwave in.
  function upperCabs(n, micro) {
    const W = n * 16, p = new Pix(W, 20);
    p.rect(0, 0, W, 18, '#efe6d0'); p.hline(0, W - 1, 0, '#ffffff');
    for (let i = 0; i < n; i++) {
      const x = i * 16;
      if (micro === i) { p.rect(x + 1, 6, 14, 10, '#c8ccd2'); p.rect(x + 2, 7, 9, 8, '#1c1c22'); p.vline(x + 13, 8, 13, '#4a4a54'); continue; }
      for (const dx of [1, 9]) { p.rect(x + dx, 2, 6, 14, '#e2d8bc'); p.rect(x + dx + 1, 3, 4, 12, '#efe6d0'); }
      p.set(x + 6, 13, '#c8a858'); p.set(x + 9, 13, '#c8a858');
    }
    p.hline(0, W - 1, 17, '#c8bc9c'); p.hline(0, W - 1, 18, '#b8ac90');
    return finish(p);
  }

  function wallOvens() {
    const p = new Pix(16, 44);
    p.rect(0, 0, 16, 44, '#efe6d0'); p.hline(0, 15, 0, '#ffffff');
    for (const y of [6, 19]) { p.rect(1, y, 14, 12, '#c8ccd2'); p.rect(3, y + 3, 10, 7, '#1c1c22'); p.hline(2, 13, y + 1, '#eef0f4'); p.set(5, y + 5, '#4a4a54'); }
    p.rect(1, 33, 14, 9, '#e2d8bc'); p.set(8, 36, '#c8a858');
    return finish(p);
  }

  function rangeTop() {
    const p = new Pix(16, 18);
    p.rect(0, 0, 16, 7, '#3a3a40'); for (const [x, y] of [[2, 1], [9, 1], [2, 4], [9, 4]]) { p.rect(x, y, 5, 2, '#1c1c22'); p.set(x + 2, y, '#5a5a64'); }
    p.rect(0, 7, 16, 11, '#c8ccd2'); p.hline(0, 15, 7, '#eef0f4');
    for (let x = 2; x < 15; x += 3) p.set(x, 8, '#2a2a30');
    p.rect(2, 10, 12, 6, '#2a2a30'); p.hline(2, 13, 9, '#eef0f4');
    return finish(p);
  }

  // Stainless double sink set into the counter under the window band.
  function sinkTop() {
    const p = new Pix(32, 8);
    p.rect(2, 1, 13, 6, '#9aa0a8'); p.rect(3, 2, 11, 4, '#c8ccd2'); p.rect(17, 1, 11, 6, '#9aa0a8'); p.rect(18, 2, 9, 4, '#c8ccd2');
    p.set(8, 4, '#5a5a62'); p.set(22, 4, '#5a5a62');
    p.rect(28, 2, 3, 4, '#d8b070'); p.vline(16, 0, 3, '#b8bcc4'); p.hline(13, 16, 0, '#b8bcc4');
    return p.canvas();
  }

  // Long farmhouse table with white Windsor chairs on both sides.
  function farmTable() {
    const p = new Pix(80, 42);
    const windsor = (x, y, back) => {
      if (back) {
        for (let i = 0; i < 5; i++) p.vline(x + 1 + i * 2, y + 1, y + 7, WHITE);
        p.hline(x, x + 10, y, WHITE); p.hline(x + 1, x + 9, y - 1, WHITE);
      } else {
        p.hline(x, x + 10, y + 3, WHITE); p.rect(x, y + 4, 11, 3, WHITE_D);
        for (let i = 0; i < 5; i++) p.vline(x + 1 + i * 2, y - 4, y + 2, WHITE);
        p.hline(x, x + 10, y - 5, WHITE); p.vline(x + 1, y + 7, y + 9, WHITE_D); p.vline(x + 9, y + 7, y + 9, WHITE_D);
      }
    };
    for (const x of [6, 24, 44, 62]) windsor(x, 2, true);
    p.rect(2, 10, 76, 16, '#a86a38'); for (let y = 12; y < 26; y += 4) p.hline(2, 77, y, '#8a5428'); p.hline(2, 77, 10, '#c88a50');
    p.rect(2, 26, 76, 3, '#6a3c1c'); p.rect(5, 29, 3, 11, '#6a3c1c'); p.rect(72, 29, 3, 11, '#6a3c1c');
    p.rect(30, 13, 8, 5, '#f4f4f8'); p.rect(31, 12, 6, 2, '#3a5aa8'); p.set(33, 15, '#3a5aa8');
    for (const x of [26, 44]) { p.vline(x, 9, 14, '#f8f4e8'); p.set(x, 8, '#f8d040'); }
    for (const x of [6, 24, 44, 62]) windsor(x, 30, false);
    return finish(p);
  }

  // Wrought-iron candle chandelier hanging over the table.
  function chandelier() {
    const p = new Pix(40, 30), iron = '#2a2a30';
    p.vline(20, 0, 9, iron);
    p.rect(17, 9, 7, 4, iron); p.vline(20, 13, 20, iron);
    for (let t = 0; t <= 16; t++) { const x = 4 + t * 2, y = 18 + Math.round(Math.abs(t - 8) / 3); p.set(x, y, iron); p.set(x + 1, y, iron); }
    for (const x of [4, 12, 20, 28, 36]) { p.rect(x - 1, 14, 3, 4, '#f8f4e8'); p.set(x, 12, '#f8d040'); p.set(x, 13, '#f8a028'); p.vline(x, 18, 21, iron); }
    p.rect(18, 21, 5, 3, iron);
    return finish(p);
  }

  function blender(full) {
    const p = new Pix(10, 16);
    p.rect(3, 0, 4, 2, '#2a2a30');
    p.rect(2, 2, 6, 9, '#d8e8f0'); if (full) p.rect(3, 5, 4, 6, full); p.vline(3, 3, 9, '#ffffff');
    p.rect(1, 11, 8, 5, '#c8ccd2'); p.set(4, 13, '#e83848'); p.set(6, 13, '#2a2a30');
    return finish(p);
  }

  // A giant glass boot, the official vessel of chugging.
  function glassBoot(fill) {
    const p = new Pix(14, 22);
    for (let y = 0; y < 16; y++) p.hline(3, 9, y, '#d8ecf4');
    p.rect(3, 15, 10, 6, '#d8ecf4'); p.hline(3, 12, 21, '#b8d0dc');
    if (fill) { for (let y = 5; y < 16; y++) p.hline(4, 8, y, fill); p.rect(4, 15, 8, 5, fill); p.hline(4, 8, 5, shade(fill, 0.35)); }
    p.vline(4, 1, 14, '#ffffff'); p.vline(3, 0, 20, '#b8d0dc'); p.vline(9, 0, 14, '#b8d0dc');
    return finish(p);
  }

  function ringLight() {
    const p = new Pix(18, 42);
    for (let y = 0; y < 18; y++) for (let x = 0; x < 18; x++) {
      const d = Math.hypot(x - 8.5, y - 8.5);
      if (d <= 8.5 && d >= 6) p.set(x, y, d > 7.4 ? '#e8e8ec' : '#fffff4');
    }
    p.vline(9, 17, 38, '#2a2a30'); p.vline(8, 17, 38, '#3a3a40');
    for (let t = 0; t < 5; t++) { p.set(8 - t, 38 + (t >> 1), '#2a2a30'); p.set(9 + t, 38 + (t >> 1), '#2a2a30'); }
    return finish(p);
  }

  function tripodPhone() {
    const p = new Pix(12, 30);
    p.rect(2, 0, 8, 13, '#1c1c22'); p.rect(3, 1, 6, 11, '#3a4a6a'); p.set(4, 2, '#8ab0d8');
    p.vline(6, 13, 22, '#2a2a30');
    for (let t = 0; t < 8; t++) { p.set(6 - Math.floor(t * 0.6), 22 + t, '#2a2a30'); p.set(6 + Math.floor(t * 0.6), 22 + t, '#2a2a30'); p.set(6, 22 + t, '#3a3a40'); }
    return finish(p);
  }

  function counterTV() {
    const p = new Pix(12, 10);
    p.rect(0, 0, 12, 8, '#c8ccd2'); p.rect(1, 1, 10, 6, '#2a3a5a'); p.set(2, 2, '#6a8ab8'); p.rect(4, 8, 4, 2, '#9aa0a8');
    return finish(p);
  }
  function knifeBlock() {
    const p = new Pix(8, 10);
    p.rect(1, 4, 6, 6, '#a86a38'); p.hline(1, 6, 4, '#c88a50');
    for (const x of [2, 3, 4, 5]) p.vline(x, 1 + (x % 2), 3, '#1c1c22');
    return finish(p);
  }

  // ---- front hall and powder room
  function hallConsole() {
    const p = new Pix(32, 26);
    p.rect(22, 0, 7, 6, '#f4ecd8'); p.vline(25, 6, 9, BRASS); p.rect(23, 9, 5, 3, BRASS);
    p.rect(5, 8, 8, 3, '#3a5aa8'); p.hline(6, 11, 7, '#f4f4f8');
    p.rect(0, 12, 32, 5, '#6a3424'); p.hline(0, 31, 12, '#8a4a30');
    p.rect(1, 17, 30, 3, '#5a2a1c'); p.vline(2, 20, 25, '#4a2218'); p.vline(29, 20, 25, '#4a2218'); p.hline(2, 29, 23, '#4a2218');
    return finish(p);
  }
  function giltMirror() {
    const p = new Pix(28, 20);
    p.rect(0, 0, 28, 20, '#c8a050'); p.rect(2, 2, 24, 16, '#d0dce4'); p.hline(0, 27, 0, '#e8c870');
    p.set(5, 4, '#ffffff'); p.set(6, 5, '#ffffff'); p.set(7, 6, '#ffffff');
    return finish(p);
  }
  function hallBench() {
    const p = new Pix(16, 14);
    p.rect(0, 2, 16, 5, '#2a4a7a'); p.hline(0, 15, 2, '#4a6a9a'); p.rect(0, 7, 16, 3, '#6a3424');
    p.vline(1, 10, 13, '#4a2218'); p.vline(14, 10, 13, '#4a2218');
    return finish(p);
  }

  // Dark wood demilune vanity with a white bowl sink.
  function demilune() {
    const p = new Pix(16, 24);
    p.rect(4, 0, 2, 4, '#c8ccd2'); p.hline(4, 9, 0, '#c8ccd2');
    p.rect(0, 4, 16, 5, '#5a2a1c'); p.hline(0, 15, 4, '#7a3c28'); p.rect(4, 5, 8, 3, '#ffffff'); p.hline(5, 10, 6, '#d8dce0');
    p.rect(1, 9, 14, 13, '#4a2218'); p.vline(5, 10, 21, '#3a1810'); p.vline(10, 10, 21, '#3a1810'); p.set(7, 15, BRASS); p.set(8, 15, BRASS);
    p.hline(1, 14, 22, '#2a1008'); p.rect(2, 23, 2, 1, '#2a1008'); p.rect(12, 23, 2, 1, '#2a1008');
    return finish(p);
  }
  // Oval mirror in a rectangular frame, brass sconces either side.
  function ovalMirror() {
    const p = new Pix(28, 22);
    p.rect(6, 0, 16, 22, '#8a8a90'); p.rect(7, 1, 14, 20, '#b8bcc4');
    for (let y = 2; y < 20; y++) for (let x = 8; x < 20; x++) if ((x - 13.5) ** 2 / 30 + (y - 10.5) ** 2 / 72 <= 1) p.set(x, y, '#d0dce4');
    p.set(11, 5, '#ffffff'); p.set(11, 6, '#ffffff');
    for (const x of [1, 24]) { p.rect(x, 9, 3, 3, BRASS); p.rect(x, 4, 3, 5, '#f8f4e8'); p.set(x + 1, 3, '#f8d040'); }
    return finish(p);
  }
  function horsePrint() {
    const p = new Pix(12, 10);
    p.rect(0, 0, 12, 10, '#2a2a30'); p.rect(1, 1, 10, 8, '#f0e8d0');
    p.hline(3, 7, 5, '#5a3a24'); p.hline(4, 6, 4, '#5a3a24'); p.set(8, 4, '#5a3a24'); p.set(8, 3, '#5a3a24'); p.set(3, 6, '#5a3a24'); p.set(7, 6, '#5a3a24'); p.set(5, 3, '#c83030');
    return finish(p);
  }
  function toilet() {
    const p = new Pix(12, 18);
    p.rect(1, 0, 10, 6, '#f8f8f6'); p.hline(1, 10, 0, '#ffffff'); p.set(9, 2, '#c8ccd2');
    for (let y = 6; y < 16; y++) for (let x = 0; x < 12; x++) if ((x - 5.5) ** 2 / 30 + (y - 10) ** 2 / 20 <= 1) p.set(x, y, '#f4f4f2');
    for (let y = 8; y < 13; y++) for (let x = 3; x < 9; x++) if ((x - 5.5) ** 2 / 7 + (y - 10) ** 2 / 5 <= 1) p.set(x, y, '#c8dce8');
    p.rect(4, 15, 4, 3, '#e8e8e4');
    return finish(p);
  }

  // ---- mudroom and family room
  function coatHooks() {
    const p = new Pix(32, 26);
    p.rect(0, 2, 32, 3, WHITE); for (let x = 3; x < 32; x += 7) p.set(x, 5, BRASS);
    const coat = (x, c) => { p.rect(x - 2, 6, 6, 14, c); p.hline(x - 2, x + 3, 6, shade(c, 0.2)); p.vline(x, 7, 19, shade(c, -0.25)); };
    coat(3, '#2a3a5a'); coat(10, '#8a2c28'); coat(17, '#5a6a3a'); coat(24, '#c8a46c');
    p.rect(27, 6, 5, 6, '#3a3a40');
    return finish(p);
  }
  function bootBench() {
    const p = new Pix(32, 18);
    p.rect(0, 0, 32, 4, '#9a6234'); p.hline(0, 31, 0, '#c88a50'); p.rect(0, 4, 32, 8, '#7a4a22');
    p.rect(3, 6, 5, 6, '#5a3418'); p.rect(9, 6, 5, 6, '#5a3418'); p.rect(19, 7, 6, 5, '#2a3a5a'); p.rect(26, 7, 4, 5, '#c8a046');
    p.vline(1, 12, 17, '#5a3418'); p.vline(30, 12, 17, '#5a3418');
    return finish(p);
  }
  function washerDryer() {
    const p = new Pix(32, 28);
    for (const x of [0, 16]) {
      p.rect(x, 0, 16, 28, '#f4f4f2'); p.rect(x, 0, 16, 4, '#d8dce0'); p.set(x + 3, 2, '#4a8ad8'); p.set(x + 12, 2, '#2a2a30');
      for (let y = 7; y < 23; y++) for (let xx = x + 2; xx < x + 14; xx++) {
        const d = Math.hypot(xx - (x + 7.5), y - 14.5);
        if (d <= 6) p.set(xx, y, d > 4.6 ? '#9aa0a8' : '#5a6a7a');
      }
      p.set(x + 6, 12, '#a8c8e8');
    }
    return finish(p);
  }
  function blueHutch() {
    const p = new Pix(16, 42);
    p.rect(0, 0, 16, 3, '#8ab0b8'); p.rect(1, 3, 14, 20, '#a8c8cc');
    p.rect(3, 5, 10, 16, '#d8e4e8'); p.hline(3, 12, 11, '#8ab0b8'); p.hline(3, 12, 16, '#8ab0b8');
    for (const y of [9, 14, 20]) for (let x = 4; x < 12; x += 3) p.set(x, y, y === 14 ? '#3a5aa8' : '#ffffff');
    p.rect(0, 23, 16, 3, '#8ab0b8'); p.rect(1, 26, 14, 14, '#a8c8cc'); p.vline(7, 27, 39, '#8ab0b8'); p.set(6, 32, '#f8f4e8'); p.set(9, 32, '#f8f4e8');
    p.hline(0, 15, 41, '#6a9098');
    return finish(p);
  }
  // Toy train table: a little town with roads, track and a blue base.
  function trainTable() {
    const p = new Pix(32, 26);
    p.rect(0, 0, 32, 16, '#5aa04a');
    p.hline(2, 29, 3, '#8a6a4a'); p.hline(2, 29, 12, '#8a6a4a'); p.vline(2, 3, 12, '#8a6a4a'); p.vline(29, 3, 12, '#8a6a4a');
    for (let x = 3; x < 29; x += 2) { p.set(x, 2, '#5a4a3a'); p.set(x, 13, '#5a4a3a'); }
    p.rect(8, 6, 5, 4, '#e8e0d0'); p.hline(8, 12, 5, '#c83030'); p.rect(18, 6, 4, 4, '#3a5aa8'); p.rect(14, 2, 4, 2, '#d83030'); p.rect(14, 1, 2, 1, '#2a2a30');
    p.rect(0, 16, 32, 5, '#3a6ab8'); p.hline(0, 31, 16, '#5a8ad8');
    p.vline(1, 21, 25, '#2a4a8a'); p.vline(30, 21, 25, '#2a4a8a');
    return finish(p);
  }

  // ---- upstairs
  // Bed seen from the foot: headboard against the wall, pillows, quilt.
  function homeBed(o) {
    const W = o.w, H = o.h || 52, p = new Pix(W, H), hb = o.head || '#7a4a28';
    p.rect(0, 0, W, 14, hb); p.hline(0, W - 1, 0, shade(hb, 0.25)); p.rect(2, 2, W - 4, 10, shade(hb, -0.1));
    const pw = W >= 40 ? 3 : W >= 28 ? 2 : 1, pwid = Math.floor((W - 6) / pw);
    for (let i = 0; i < pw; i++) {
      const x = 3 + i * pwid, col = (o.pillows || ['#f4f4f0'])[i % (o.pillows || ['#f4f4f0']).length];
      p.rect(x, 10, pwid - 1, 7, col); p.hline(x, x + pwid - 2, 10, shade(col, 0.2)); p.hline(x, x + pwid - 2, 16, shade(col, -0.2));
    }
    if (o.accent) { const x = Math.floor(W / 2) - 4; p.rect(x, 13, 8, 5, o.accent[0]); p.set(x + 3, 15, o.accent[1]); p.set(x + 5, 14, o.accent[1]); }
    const q = o.quilt, qd = shade(q, -0.2);
    p.rect(0, 18, W, H - 24, q); p.hline(0, W - 1, 18, shade(q, 0.2));
    if (o.pattern === 'plaid') for (let y = 18; y < H - 6; y++) for (let x = 0; x < W; x++) { if (x % 6 === 2 || y % 6 === 2) p.set(x, y, o.patC); if (x % 6 === 2 && y % 6 === 2) p.set(x, y, qd); }
    if (o.pattern === 'quilted') for (let y = 20; y < H - 6; y += 4) for (let x = 2 + (y % 8 ? 2 : 0); x < W - 1; x += 4) p.set(x, y, qd);
    if (o.foot) { p.rect(0, H - 16, W, 8, o.foot[0]); for (let x = 1; x < W; x += 3) p.set(x, H - 13 + (x % 2), o.foot[1]); }
    p.vline(0, 18, H - 6, qd); p.vline(W - 1, 18, H - 6, qd);
    p.rect(0, H - 6, W, 4, o.skirt || qd); p.rect(1, H - 2, 2, 2, '#4a2a18'); p.rect(W - 3, H - 2, 2, 2, '#4a2a18');
    return finish(p);
  }

  function nightstand(shadeCol) {
    const p = new Pix(16, 30);
    p.rect(3, 0, 10, 8, shadeCol); p.hline(3, 12, 0, shade(shadeCol, 0.25)); p.hline(3, 12, 7, shade(shadeCol, -0.25));
    p.vline(8, 8, 13, shadeCol === '#1c1c22' ? BRASS : '#2a2a30'); p.rect(6, 13, 5, 2, '#2a2a30');
    p.rect(0, 15, 16, 4, '#9a6234'); p.hline(0, 15, 15, '#c88a50');
    p.rect(1, 19, 14, 9, '#8a5428'); p.hline(2, 13, 23, '#6a3c1c'); p.set(8, 21, BRASS); p.set(8, 26, BRASS);
    p.rect(1, 28, 2, 2, '#4a2a18'); p.rect(13, 28, 2, 2, '#4a2a18');
    return finish(p);
  }

  function hamper() {
    const p = new Pix(14, 18);
    p.rect(0, 0, 14, 3, '#b8945c'); p.hline(0, 13, 0, '#d8b47c');
    for (let y = 3; y < 18; y++) for (let x = 0; x < 14; x++) p.set(x, y, (x + y) % 3 === 0 ? '#8a6a3a' : (x - y + 30) % 3 === 0 ? '#c8a46c' : '#a8844c');
    return finish(p);
  }

  // Framed paintings from the listing photos.
  function painting(kind) {
    const W = kind === 'small' ? 14 : 24, H = 16, p = new Pix(W, H);
    p.rect(0, 0, W, H, kind === 'barn' ? '#5a3a24' : '#c8a050');
    const x0 = 2, y0 = 2, w = W - 4, h = H - 4;
    if (kind === 'barn') {
      p.rect(x0, y0, w, h, '#a8c0d8'); p.rect(x0, y0 + 7, w, h - 7, '#6a9a4a');
      p.rect(x0 + 2, y0 + 3, 9, 6, '#a83a2a'); p.hline(x0 + 2, x0 + 10, y0 + 2, '#7a2a1c'); p.rect(x0 + 5, y0 + 6, 3, 3, '#5a2014');
      p.hline(x0 + 13, x0 + 17, y0 + 7, '#f4f4f0'); p.set(x0 + 17, y0 + 6, '#f4f4f0'); p.set(x0 + 13, y0 + 8, '#f4f4f0'); p.set(x0 + 16, y0 + 8, '#f4f4f0');
    } else if (kind === 'sea') {
      p.rect(x0, y0, w, h, '#b8d0e0'); p.rect(x0, y0 + 6, w, h - 6, '#3a6a9a'); p.rect(x0, y0 + 4, 8, 3, '#4a7a4a');
      p.set(x0 + 12, y0 + 7, '#ffffff'); p.vline(x0 + 12, y0 + 4, y0 + 6, '#f4f4f0'); p.set(x0 + 16, y0 + 8, '#f4f4f0');
    } else if (kind === 'sunset') {
      for (let y = 0; y < h; y++) p.hline(x0, x0 + w - 1, y0 + y, y < 3 ? '#4a4a7a' : y < 6 ? '#c86a5a' : y < 8 ? '#f0a050' : '#2a3a5a');
      p.hline(x0 + 6, x0 + 13, y0 + 7, '#f8d070');
    } else if (kind === 'small') {
      p.rect(x0, y0, w, h, '#e8dcc0'); p.rect(x0 + 2, y0 + 5, 6, 5, '#7a8a5a'); p.set(x0 + 4, y0 + 3, '#c88a50');
    } else {
      p.rect(x0, y0, w, h, '#a8c4d8'); p.rect(x0, y0 + 6, w, h - 6, '#7a9a5a'); p.hline(x0, x0 + w - 1, y0 + 6, '#5a7a4a'); p.rect(x0 + 13, y0 + 2, 3, 3, '#f8f0d0');
    }
    return finish(p);
  }

  function familyPhotos() {
    const p = new Pix(30, 14);
    const frame = (x, y, w, h, fill) => { p.rect(x, y, w, h, '#2a2a30'); p.rect(x + 1, y + 1, w - 2, h - 2, fill); };
    frame(0, 2, 8, 10, '#d8c8b0'); frame(10, 0, 10, 8, '#c8d8e8'); frame(22, 3, 8, 10, '#e8d8c8');
    for (const [x, y] of [[3, 6], [13, 3], [16, 3], [25, 7]]) { p.set(x, y, '#c88a60'); p.set(x, y + 1, '#3a5aa8'); p.set(x, y - 1, '#7a4a28'); }
    return finish(p);
  }

  function spindleChair() {
    const p = new Pix(12, 22);
    p.hline(0, 11, 0, '#4a2a18'); p.hline(0, 11, 1, '#5a3420');
    for (const x of [1, 4, 7, 10]) p.vline(x, 2, 9, '#5a3420');
    p.rect(0, 10, 12, 4, '#c8a46c'); p.hline(0, 11, 13, '#5a3420');
    p.vline(1, 14, 21, '#4a2a18'); p.vline(10, 14, 21, '#4a2a18');
    return finish(p);
  }
  function glider() {
    const p = new Pix(18, 22), c = '#9a9ca4';
    p.rect(2, 0, 14, 10, c); p.hline(3, 14, 0, '#b8bac2'); p.rect(0, 6, 4, 10, c); p.rect(14, 6, 4, 10, c);
    p.rect(3, 10, 12, 6, '#acaeb6'); p.hline(0, 17, 16, '#7a7c84'); p.rect(2, 17, 14, 3, '#6a6c74'); p.hline(1, 16, 21, '#4a4c54');
    return finish(p);
  }
  function settee() {
    const p = new Pix(32, 22);
    p.rect(1, 0, 30, 3, '#c8c0b0'); p.rect(2, 3, 28, 7, '#f0e8d8');
    for (let i = 0; i < 18; i++) p.set(3 + Math.floor(G.hash(i, 1, 44) * 26), 4 + Math.floor(G.hash(i, 2, 44) * 5), i % 2 ? '#a8b8d0' : '#d89aa0');
    p.rect(0, 2, 3, 12, '#c8c0b0'); p.rect(29, 2, 3, 12, '#c8c0b0');
    p.rect(3, 10, 26, 5, '#e8e0d0'); p.rect(5, 6, 6, 5, '#a8b8d0'); p.rect(21, 6, 6, 5, '#e8d0b0');
    p.hline(0, 31, 15, '#a89c88'); p.vline(1, 16, 21, '#5a3a24'); p.vline(30, 16, 21, '#5a3a24');
    return finish(p);
  }
  // The giant stuffed giraffe. Nobody knows where it came from. Nobody dares move it.
  function giraffe() {
    const p = new Pix(24, 58), y1 = '#e8b850', b = '#a86a2a';
    p.rect(10, 0, 8, 7, y1); p.rect(16, 3, 6, 4, y1); p.set(11, 0, b); p.set(14, 0, b); p.vline(11, -1, 0, b);
    p.set(17, 4, '#1c1c22'); p.hline(20, 21, 6, '#c89040');
    p.rect(10, 7, 6, 22, y1);
    p.rect(4, 28, 16, 14, y1);
    for (const [x, y] of [[11, 10], [13, 15], [11, 20], [13, 25], [6, 31], [10, 34], [15, 30], [17, 36], [7, 38]]) p.rect(x, y, 2, 2, b);
    for (const x of [5, 9, 14, 18]) { p.rect(x, 42, 2, 14, y1); p.set(x, 46, b); p.rect(x, 56, 2, 2, '#6a4a2a'); }
    p.vline(9, 8, 22, '#d8a040');
    return finish(p);
  }

  // Cherry double vanity, granite top, big framed mirror above.
  function doubleVanity() {
    const p = new Pix(48, 42);
    p.rect(2, 0, 44, 18, '#6a2a1c'); p.rect(4, 2, 40, 14, '#d0dce4'); p.set(8, 4, '#ffffff'); p.set(9, 5, '#ffffff'); p.set(10, 6, '#ffffff');
    p.rect(0, 20, 48, 6, '#c8bca8'); for (let i = 0; i < 20; i++) p.set(Math.floor(G.hash(i, 1, 55) * 48), 20 + Math.floor(G.hash(i, 2, 55) * 6), i % 2 ? '#a89c88' : '#e0d8c8');
    for (const x of [8, 30]) { p.rect(x, 22, 10, 3, '#f8f8f6'); p.set(x + 5, 20, '#c8ccd2'); p.vline(x + 5, 18, 20, '#c8ccd2'); }
    p.rect(0, 26, 48, 16, '#7a2a1c'); p.hline(0, 47, 26, '#9a3a28');
    for (const x of [2, 13, 26, 37]) p.rect(x, 28, 9, 12, '#6a2418');
    for (const x of [10, 15, 34, 39]) p.set(x, 33, '#c8ccd2');
    return finish(p);
  }
  function tub() {
    const p = new Pix(32, 30);
    p.rect(0, 0, 32, 30, '#f4f4f2'); p.hline(0, 31, 0, '#ffffff');
    p.rect(3, 4, 26, 21, '#d8e4ec'); p.rect(5, 6, 22, 17, '#b8d4e4'); p.hline(6, 12, 8, '#e8f4fc');
    p.rect(14, 1, 4, 2, '#c8ccd2');
    return finish(p);
  }

  // Nate's old chemistry desk: flasks, a burner, a lava lamp and the food coloring.
  function chemDesk(hasDye) {
    const p = new Pix(32, 30);
    p.rect(22, 0, 5, 3, '#c8ccd2'); p.rect(21, 3, 7, 9, '#3a8ad8'); p.rect(23, 4, 3, 3, '#f86050'); p.set(24, 9, '#f86050'); p.rect(22, 12, 5, 2, '#c8ccd2');
    p.vline(5, 4, 9, '#d8ecf4'); p.rect(3, 9, 5, 4, '#78e070'); p.vline(11, 6, 12, '#d8ecf4'); p.rect(10, 10, 3, 3, '#f8d040');
    if (hasDye) { p.rect(15, 8, 3, 5, '#2a6ae8'); p.set(16, 7, '#f4f4f0'); }
    p.rect(0, 13, 32, 5, '#8a5a30'); p.hline(0, 31, 13, '#b07a44');
    p.rect(0, 18, 32, 8, '#6a4020'); p.rect(2, 19, 10, 6, '#7a4a28'); p.set(7, 22, BRASS);
    p.vline(30, 18, 29, '#4a2a18'); p.vline(1, 26, 29, '#4a2a18');
    return finish(p);
  }
  function fireworksPoster() {
    const p = new Pix(16, 20);
    p.rect(0, 0, 16, 20, '#1c1834'); p.hline(0, 15, 0, '#3a3454');
    for (const [cx, cy, c] of [[5, 6, '#f8d040'], [11, 9, '#e83848'], [7, 13, '#78e8e8']]) for (let a = 0; a < 8; a++) { p.set(cx + Math.round(Math.cos(a * 0.8) * 2.6), cy + Math.round(Math.sin(a * 0.8) * 2.6), c); p.set(cx, cy, '#ffffff'); }
    p.hline(2, 13, 17, '#f8f8f0'); p.hline(4, 11, 18, '#c8c8d0');
    return finish(p);
  }
  function linenShelf() {
    const p = new Pix(16, 42);
    p.rect(0, 0, 16, 42, WHITE); p.rect(2, 2, 12, 38, '#d8d4c8');
    const cols = ['#f4f4f0', '#a8c8e8', '#e8c8c8', '#c8e0c0', '#f0e8c8'];
    for (const y0 of [3, 13, 23, 33]) { p.hline(2, 13, y0 + 8, WHITE); for (let k = 0; k < 3; k++) { const c = cols[Math.floor(G.hash(k, y0, 31) * cols.length)]; p.rect(3, y0 + 6 - k * 2, 10, 2, c); p.hline(3, 12, y0 + 6 - k * 2, shade(c, 0.2)); } }
    return finish(p);
  }
  function windowSeat() {
    const p = new Pix(32, 14);
    p.rect(0, 0, 32, 6, '#4a6a9a'); p.hline(0, 31, 0, '#6a8aba'); for (let x = 2; x < 32; x += 6) p.set(x, 3, '#f0e8c8');
    p.rect(3, 1, 7, 4, '#f0e8c8'); p.rect(0, 6, 32, 8, WHITE); p.hline(0, 31, 13, WHITE_D);
    return finish(p);
  }
  function dresser() {
    const p = new Pix(32, 24);
    p.rect(4, 0, 8, 6, '#c8a050'); p.rect(5, 1, 6, 4, '#d0dce4'); p.rect(22, 2, 5, 4, '#e8c8d0');
    p.rect(0, 6, 32, 3, '#9a6234'); p.hline(0, 31, 6, '#c88a50');
    p.rect(0, 9, 32, 13, '#8a5428'); for (const y of [12, 17]) { p.hline(1, 30, y - 2, '#6a3c1c'); p.set(9, y, BRASS); p.set(22, y, BRASS); }
    p.rect(1, 22, 2, 2, '#4a2a18'); p.rect(29, 22, 2, 2, '#4a2a18');
    return finish(p);
  }

  // ================================================================ YARD (from the listing photos)
  // White square gatepost with a ball finial at the foot of the driveway.
  function gatePost() {
    const p = new Pix(14, 34);
    for (let y = 0; y < 7; y++) for (let x = 0; x < 14; x++) if ((x - 6.5) ** 2 + (y - 3.5) ** 2 <= 11) p.set(x, y, x < 6 ? '#ffffff' : '#e8e8e4');
    p.rect(3, 7, 8, 2, '#d8d8d4'); p.rect(1, 9, 12, 3, '#f4f4f0'); p.hline(1, 12, 9, '#ffffff');
    p.rect(2, 12, 10, 19, '#f4f4f0'); p.vline(9, 12, 30, '#d8d8d4'); p.vline(10, 12, 30, '#d8d8d4'); p.vline(3, 13, 30, '#ffffff');
    p.rect(1, 30, 12, 4, '#e8e8e4'); p.hline(1, 12, 33, '#c8c8c4');
    return finish(p);
  }

  // The flag on its pole, two frames of waving.
  function flagFrames() {
    return [0, 1].map((f) => {
      const p = new Pix(26, 60);
      p.rect(0, 0, 3, 3, '#e8c850'); p.vline(1, 3, 59, '#f4f4f0'); p.vline(2, 3, 59, '#c8c8c4');
      for (let y = 0; y < 13; y++) for (let x = 0; x < 20; x++) {
        const yy = y + 3 + Math.round(Math.sin(x * 0.45 + f * 1.6) * 1.2);
        p.set(3 + x, yy, x < 9 && y < 7 ? ((x + y) % 2 ? '#2a3a7a' : (y % 2 ? '#2a3a7a' : '#f4f4f0')) : y % 2 ? '#f4f4f0' : '#c83038');
      }
      p.rect(0, 57, 4, 3, '#a8a8a4');
      return finish(p);
    });
  }

  // Free-form pool on a wide stone deck (the survey draws it kidney-shaped).
  function kidneyPool() {
    const W = 128, H = 96, p = new Pix(W, H);
    const inPool = (x, y) => {
      const a = (x - 52) ** 2 / 1300 + (y - 46) ** 2 / 560 <= 1;
      const b = (x - 86) ** 2 / 560 + (y - 50) ** 2 / 480 <= 1;
      const bite = (x - 70) ** 2 / 140 + (y - 70) ** 2 / 120 <= 1;
      return (a || b) && !bite;
    };
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const deck = (x - 64) ** 2 / 4300 + (y - 48) ** 2 / 2400 <= 1;
      if (!deck) continue;
      const band = Math.floor(y / 9), off = band % 2 ? 6 : 0;
      const seam = y % 9 === 8 || (x + off) % 13 === 12;
      const h = G.hash(Math.floor((x + off) / 13), band, 47);
      p.set(x, y, seam ? '#c8c0ae' : h < 0.33 ? '#e4ded0' : h < 0.66 ? '#dad4c4' : '#ece6d8');
    }
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (!inPool(x, y)) continue;
      const edge = !inPool(x - 2, y) || !inPool(x + 2, y) || !inPool(x, y - 2) || !inPool(x, y + 2);
      const deep = (x - 40) ** 2 / 600 + (y - 44) ** 2 / 300 <= 1;
      p.set(x, y, edge ? '#f4f4f0' : deep ? '#3a8ad0' : '#5aaee8');
      if (!edge && (x * 7 + y * 13) % 41 === 0) p.set(x, y, '#c8ecff');
    }
    p.vline(90, 24, 29, '#c8ccd2'); p.vline(94, 24, 29, '#c8ccd2'); p.hline(90, 94, 26, '#c8ccd2');
    return p.canvas();
  }

  // Dark green market umbrella, open, seen from above at an angle.
  function marketUmbrella() {
    const p = new Pix(38, 46);
    for (let y = 0; y < 22; y++) for (let x = 0; x < 38; x++) {
      const d = (x - 18.5) ** 2 / 342 + (y - 13) ** 2 / 110;
      if (d > 1 || y < 13 - Math.sqrt(Math.max(0, 1 - (x - 18.5) ** 2 / 342)) * 13) continue;
      const seg = Math.floor(Math.atan2(y - 13, x - 18.5) * 4 / Math.PI + 8) % 2;
      p.set(x, y, seg ? '#1e5a3a' : '#2a6a48');
    }
    p.set(18, 0, '#c8a050'); p.set(19, 0, '#c8a050');
    for (let x = 1; x < 37; x += 3) p.set(x, 21 - (x % 2), '#164a2e');
    p.vline(18, 22, 43, '#a87a48'); p.vline(19, 22, 43, '#8a5a30');
    return finish(p);
  }
  // Teak table with chairs around it.
  function teakSet() {
    const p = new Pix(44, 30), t = '#b08858', d = '#8a6838';
    for (const x of [4, 16, 28]) { p.rect(x, 0, 10, 8, t); for (let k = 1; k < 10; k += 3) p.vline(x + k, 1, 7, d); }
    p.rect(2, 8, 40, 10, t); for (let y = 10; y < 18; y += 3) p.hline(2, 41, y, d); p.hline(2, 41, 8, '#c8a070');
    p.rect(14, 10, 4, 4, '#e8f0f4'); p.rect(26, 11, 3, 3, '#e8f0f4');
    for (const x of [4, 16, 28]) { p.rect(x, 18, 10, 9, t); p.hline(x, x + 9, 22, d); p.vline(x + 1, 27, 29, d); p.vline(x + 8, 27, 29, d); }
    return finish(p);
  }
  function teakBench() {
    const p = new Pix(30, 14), t = '#a08060', d = '#7a5a3a';
    p.rect(0, 0, 30, 5, t); for (let x = 2; x < 30; x += 3) p.vline(x, 1, 4, d);
    p.rect(0, 5, 30, 4, '#b89068'); p.hline(0, 29, 8, d); p.vline(1, 9, 13, d); p.vline(28, 9, 13, d);
    return finish(p);
  }
  function lounger() {
    const p = new Pix(16, 32), t = '#b08858', d = '#8a6838';
    p.rect(2, 0, 12, 10, t); for (let y = 2; y < 10; y += 2) p.hline(3, 12, y, d);
    p.rect(2, 10, 12, 20, '#c09868'); for (let y = 12; y < 30; y += 3) p.hline(3, 12, y, d);
    p.rect(3, 1, 10, 6, '#f4f0e4'); p.set(2, 30, d); p.set(13, 30, d);
    return finish(p);
  }

  // The little white pool house: clapboard, a porch on white posts, a
  // rocking chair, and the flag on a bracket.
  function poolHouse() {
    const W = 40, H = 58, p = new Pix(W, H);
    for (let y = 0; y < 22; y++) for (let x = 4; x < 36; x++) p.set(x, y, y % 4 === 3 ? '#3a3c44' : (x + (y >> 2) * 4) % 8 === 0 ? '#3a3c44' : '#4a4c56');
    p.hline(4, 35, 0, '#6a6c76');
    for (let y = 22; y < 50; y++) for (let x = 6; x < 34; x++) p.set(x, y, y % 3 === 2 ? '#e2e0d8' : '#f4f2ec');
    p.rect(10, 26, 7, 9, '#1c2226'); p.rect(11, 27, 5, 7, '#3a4a5a'); p.set(12, 28, '#8ab0d8');
    p.rect(21, 30, 9, 20, '#1c2226'); p.rect(22, 31, 7, 18, '#2a3238'); p.set(27, 40, BRASS);
    for (let y = 36; y < 40; y++) for (let x = 2; x < 38; x++) p.set(x, y, y === 36 ? '#6a6c76' : '#4a4c56');
    p.rect(2, 40, 2, 14, '#ffffff'); p.rect(36, 40, 2, 14, '#ffffff');
    p.rect(0, 52, 40, 6, '#e8e6e0'); p.hline(0, 39, 52, '#ffffff');
    p.rect(7, 44, 6, 7, '#ffffff'); for (let x = 7; x < 13; x += 2) p.vline(x, 40, 44, '#ffffff'); p.hline(6, 13, 51, '#d8d8d4');
    p.vline(36, 28, 33, '#5a5a62');
    return finish(p);
  }
  function porchFlag() {
    const p = new Pix(14, 12);
    for (let y = 0; y < 8; y++) for (let x = 0; x < 12; x++) {
      const yy = y + Math.round(x * 0.25);
      p.set(x + 1, yy + 1, x < 5 && y < 4 ? '#2a3a7a' : y % 2 ? '#f4f4f0' : '#c83038');
    }
    p.set(0, 0, '#5a5a62'); p.set(1, 1, '#5a5a62');
    return finish(p);
  }
  function adirondack() {
    const p = new Pix(16, 20), g = '#1e4a32', d = '#163a26';
    for (const x of [2, 5, 8, 11]) { p.rect(x, 0, 3, 10, g); p.set(x, 0, d); }
    p.rect(0, 8, 16, 3, g); p.rect(2, 11, 12, 5, '#245a3c'); for (let y = 12; y < 16; y += 2) p.hline(2, 13, y, d);
    p.vline(1, 11, 19, d); p.vline(14, 11, 19, d); p.hline(0, 15, 8, '#2e6a48');
    return finish(p);
  }
  // Flowering trees: pink crabapple and purple wisteria.
  function bloomTree(seed, cols) {
    const p = new Pix(32, 34);
    const blobs = [[16, 12, 12], [8, 15, 7.5], [24, 15, 7.5], [16, 5, 8]];
    for (let y = 0; y < 28; y++) for (let x = 0; x < 32; x++) {
      if (!blobs.some(([cx, cy, r]) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r)) continue;
      const s = (x - 16) * 0.07 + (y - 11) * 0.11 + (G.hash(x, y, seed) - 0.5) * 0.9;
      p.set(x, y, s < -0.9 ? cols[0] : s < -0.2 ? cols[1] : s < 0.7 ? cols[2] : cols[3]);
    }
    for (let i = 0; i < 12; i++) { const x = 4 + Math.floor(G.hash(i, seed, 1) * 24), y = 3 + Math.floor(G.hash(i, seed, 2) * 20); if (p.get(x, y)) p.set(x, y, '#ffffff'); }
    p.rect(13, 26, 6, 6, '#6a4a3a'); p.rect(16, 26, 3, 6, '#4a3428'); p.hline(11, 20, 31, '#4a3428');
    p.outline(shade(cols[3], -0.4));
    return p.canvas();
  }
  // ================================================================ STORY SPRITES
  // The four ingredients for the nastiest drink Nate can make.
  function milkIcon() {
    const p = new Pix(16, 16);
    p.rect(4, 1, 8, 3, '#e8e8e4'); p.hline(5, 10, 0, '#f8f8f6'); p.rect(4, 4, 8, 11, '#f8f8f6');
    p.rect(4, 7, 8, 4, '#3a78d8'); p.set(6, 8, '#ffffff'); p.set(7, 9, '#ffffff'); p.hline(4, 11, 14, '#d8d8d4');
    return finish(p);
  }
  function dyeIcon() {
    const p = new Pix(16, 16);
    p.rect(7, 0, 2, 3, '#f4f4f0'); p.rect(6, 3, 4, 2, '#f4f4f0'); p.rect(5, 5, 6, 10, '#2a6ae8'); p.vline(6, 6, 13, '#6a9af8'); p.rect(5, 8, 6, 3, '#f4f4f0'); p.set(7, 9, '#2a6ae8');
    return finish(p);
  }
  function smokeIcon() {
    const p = new Pix(16, 16);
    p.rect(6, 0, 4, 2, '#1c1c22'); p.rect(6, 2, 4, 3, '#5a3418'); p.rect(4, 5, 8, 10, '#6a3418'); p.vline(5, 6, 13, '#9a5a2a');
    p.rect(4, 8, 8, 4, '#e8d8b0'); p.set(6, 9, '#c83030'); p.set(8, 10, '#3a3a40'); p.set(9, 9, '#3a3a40');
    return finish(p);
  }
  function vodkaIcon() {
    const p = new Pix(16, 16);
    for (const [x, y] of [[1, 5], [6, 3], [11, 5]]) { p.rect(x + 1, y, 2, 3, '#c83030'); p.rect(x, y + 3, 4, 8, '#e8f4fc'); p.vline(x, y + 4, y + 10, '#ffffff'); p.rect(x, y + 6, 4, 2, '#3a5aa8'); }
    return finish(p);
  }
  // Mikey's ammunition: music notes and heart balloons.
  function noteSprite() {
    const p = new Pix(9, 11);
    p.vline(5, 0, 7, '#f8d040'); p.vline(6, 0, 1, '#f8d040'); p.set(7, 1, '#f8d040'); p.set(8, 2, '#f8d040');
    p.rect(2, 7, 4, 3, '#f8d040'); p.set(3, 8, '#fff4b0');
    return finish(p);
  }
  function heartBalloon(col) {
    const p = new Pix(12, 16);
    const rows = ['.oo..oo.', 'oooooooo', 'oooooooo', 'oooooooo', '.oooooo.', '..oooo..', '...oo...'];
    rows.forEach((r, y) => r.split('').forEach((ch, x) => { if (ch === 'o') { p.set(2 + x, y * 1 + 1, col); p.set(2 + x, y + 2, col); } }));
    p.set(3, 2, '#ffffff'); p.set(3, 3, '#ffffff');
    p.vline(6, 10, 15, '#e8e8f0');
    return finish(p);
  }

  // ================================================================ HOME CRITTERS
  // Angry eyebrows for things that shouldn't have faces.
  function angryEyes(p, x, y, gap) {
    p.set(x, y, '#1c1424'); p.set(x + gap, y, '#1c1424');
    p.set(x - 1, y - 1, '#1c1424'); p.set(x + gap + 1, y - 1, '#1c1424');
    p.set(x, y + 1, '#ffffff'); p.set(x + gap, y + 1, '#ffffff');
  }

  // Corn on the cob, husk and all. Nate had a bunch of these in his room.
  function corncob(squash) {
    const p = new Pix(14, 20), top = squash ? 2 : 0;
    for (let y = top; y < 15; y++) {
      const half = y < top + 2 ? 2 : y > 12 ? 3 : 4;
      for (let x = 7 - half; x < 7 + half; x++) p.set(x, y, (x + y) % 2 ? '#f8d848' : '#e8b830');
    }
    for (let y = top + 1; y < 14; y += 2) p.set(5, y, '#fff0a0');
    for (const [x0, dir] of [[3, -1], [10, 1]]) for (let k = 0; k < 6; k++) { p.set(x0 + dir * Math.floor(k / 2), 19 - k, '#4a9a38'); p.set(x0 + 1 + dir * Math.floor(k / 2), 19 - k, '#68b850'); }
    p.rect(5, 15, 4, 5, '#5aaa44'); p.vline(7, 14, 19, '#3a7a2c');
    angryEyes(p, 5, top + 5, 3);
    p.hline(6, 8, top + 9, '#7a3a20');
    return finish(p);
  }
  function kernelShot() {
    const p = new Pix(5, 5);
    p.rect(1, 1, 3, 3, '#f8d848'); p.set(1, 1, '#fff4b0');
    return finish(p);
  }

  // A cereal box with a grudge. Frames: shuffle, shuffle, tipped over to pour.
  function cerealBox(frame) {
    const p = new Pix(18, 22);
    const box = (x0, y0) => {
      p.rect(x0, y0, 12, 18, '#d83838'); p.rect(x0 + 12, y0 + 1, 2, 17, '#a02828');
      p.rect(x0, y0, 12, 5, '#f8d040'); p.hline(x0, x0 + 11, y0 + 5, '#c89818');
      p.rect(x0 + 2, y0 + 10, 8, 5, '#f4f4f0'); p.hline(x0 + 3, x0 + 8, y0 + 15, '#d8d8d4');
      for (const [dx, c] of [[3, '#58c048'], [5, '#3878d8'], [7, '#f8a028'], [4, '#c858e8'], [6, '#f8d040']]) p.set(x0 + dx, y0 + 10 + (dx % 2), c);
      angryEyes(p, x0 + 3, y0 + 2, 5);
    };
    if (frame === 2) {
      box(2, 3);
      p.rect(2, 1, 12, 2, '#f8e070'); p.hline(2, 13, 0, '#c89818');
      for (const [x, y, c] of [[3, 0, '#58c048'], [6, 0, '#3878d8'], [9, 0, '#f8a028'], [12, 0, '#c858e8']]) p.set(x, y, c);
    } else {
      box(frame ? 3 : 2, 4);
    }
    return finish(p);
  }
  function cerealRing(col) {
    const p = new Pix(6, 6);
    p.rect(1, 1, 4, 4, col); p.set(2, 2, null); p.d[2 * 6 + 2] = null; p.d[3 * 6 + 3] = null; p.d[2 * 6 + 3] = null; p.d[3 * 6 + 2] = null;
    p.set(1, 1, shade(col, 0.4));
    return finish(p);
  }

  // One of Nate's homemade fireworks: a rocket on a stick. Frame 1 has the fuse lit.
  function rocket(lit) {
    const p = new Pix(10, 26);
    for (let y = 0; y < 4; y++) p.hline(5 - Math.ceil(y / 2), 4 + Math.ceil(y / 2), y, '#f4f4f0');
    p.rect(3, 4, 4, 11, '#d83838'); p.hline(3, 6, 7, '#f4f4f0'); p.hline(3, 6, 11, '#f4f4f0'); p.vline(6, 4, 14, '#a02828');
    p.set(4, 8, '#1c1424'); p.set(5, 8, '#1c1424');
    p.vline(5, 15, 25, '#a87a48');
    p.set(3, 15, '#5a5a62'); p.set(2, 16, '#5a5a62');
    if (lit) { p.set(1, 16, '#f8d040'); p.set(1, 17, '#ffffff'); p.set(0, 16, '#f8a028'); p.set(2, 18, '#f8a028'); }
    return finish(p);
  }

  // Snapdragon: a flower with teeth. Frames: closed, snapping open.
  function snapdragon(open) {
    const p = new Pix(18, 24);
    p.vline(9, 12, 23, '#3a8a30'); p.vline(8, 14, 23, '#4aa040');
    for (let k = 0; k < 5; k++) { p.set(7 - k, 19 - (k >> 1), '#58b048'); p.set(10 + k, 17 - (k >> 1), '#58b048'); }
    const cx = 9, cy = open ? 7 : 8;
    for (let y = 0; y < 13; y++) for (let x = 2; x < 16; x++) {
      const d = (x - cx) ** 2 / 36 + (y - cy) ** 2 / 25;
      if (d > 1) continue;
      p.set(x, y, d > 0.6 ? '#c83878' : '#e858a0');
    }
    if (open) {
      p.rect(5, 6, 8, 4, '#5a1028');
      for (let x = 5; x < 13; x += 2) { p.set(x, 6, '#ffffff'); p.set(x + 1, 9, '#ffffff'); }
    } else {
      p.hline(5, 12, 9, '#8a2050'); for (let x = 6; x < 12; x += 2) p.set(x, 8, '#ffffff');
    }
    angryEyes(p, 6, 3, 5);
    return finish(p);
  }
  function pollenShot() {
    const p = new Pix(6, 6);
    p.rect(1, 1, 4, 4, '#d8e048'); p.set(1, 1, '#f8f8a0'); p.set(4, 4, '#a8b030');
    return finish(p);
  }

  // A New Jersey black bear (Bedminster has them). Facing right; two walk frames.
  function bear(step) {
    const p = new Pix(34, 26), fur = '#24201e', furL = '#3a3430';
    for (let y = 4; y < 19; y++) for (let x = 2; x < 26; x++) {
      if ((x - 13) ** 2 / 132 + (y - 11.5) ** 2 / 48 > 1) continue;
      p.set(x, y, y < 8 ? furL : fur);
    }
    for (let y = 2; y < 13; y++) for (let x = 20; x < 32; x++) {
      if ((x - 25.5) ** 2 / 28 + (y - 7.5) ** 2 / 24 > 1) continue;
      p.set(x, y, fur);
    }
    p.rect(29, 7, 4, 4, '#a8845c'); p.set(32, 7, '#1c1414'); p.set(29, 10, '#8a6a48');
    p.rect(21, 1, 3, 3, fur); p.set(22, 2, '#4a3e38');
    p.set(27, 5, '#f8f4e8'); p.set(27, 6, '#140c0c');
    const legs = step ? [[4, 0], [9, 2], [17, 2], [22, 0]] : [[4, 2], [9, 0], [17, 0], [22, 2]];
    for (const [x, off] of legs) { p.rect(x, 17 - off, 4, 7 + off - (off ? 1 : 0), fur); p.hline(x, x + 3, 23 - (off ? 1 : 0), '#4a3e38'); }
    return finish(p);
  }

  // Birdhouse gourd: dried, with a round door. Frames wobble left/right.
  function gourd(lean) {
    const p = new Pix(14, 18), body = '#c8a060', dark = '#9a7440', lite = '#e0c080';
    const sx = lean ? 1 : 0;
    for (let y = 2; y < 18; y++) for (let x = 0; x < 14; x++) {
      const top = (x - 6.5 - sx) ** 2 / 6 + (y - 4.5) ** 2 / 9 <= 1;
      const bot = (x - 6.5) ** 2 / 36 + (y - 12) ** 2 / 30 <= 1;
      if (top || bot) p.set(x, y, x > 9 ? dark : x < 4 ? lite : body);
    }
    p.rect(6 + sx, 0, 2, 3, '#6a4a28');
    p.rect(5, 10, 4, 4, '#2a1a10'); p.set(5, 10, '#4a3420');
    p.hline(6, 8, 15, '#6a4a28');
    angryEyes(p, 4, 7, 5);
    return finish(p);
  }
  // The sparrow that lives in the gourd. Two flap frames, facing right.
  function birdFrame(up) {
    const p = new Pix(12, 9);
    p.rect(3, 3, 6, 4, '#8a5a3a'); p.rect(8, 2, 3, 3, '#8a5a3a'); p.set(11, 3, '#e8b030'); p.set(9, 2, '#140c0c');
    p.rect(4, 5, 4, 2, '#e8d8b0'); p.hline(1, 3, 4, '#6a4428');
    if (up) { p.rect(4, 0, 4, 3, '#6a4428'); } else { p.rect(4, 6, 4, 3, '#6a4428'); }
    return finish(p);
  }

  // An unopened can of beans (for Abe's science experiment).
  function beanCan() {
    const p = new Pix(8, 10);
    p.rect(0, 0, 8, 10, '#c8ccd2'); p.hline(0, 7, 0, '#eef0f4'); p.hline(0, 7, 9, '#9aa0a8');
    p.rect(0, 3, 8, 5, '#d86828'); p.set(2, 5, '#8a3a18'); p.set(4, 4, '#8a3a18'); p.set(5, 6, '#8a3a18');
    return finish(p);
  }

  // ================================================================ DAD'S WORKSHOP (the garage)
  // Drawn from the family's photos: dark board walls, sawdust everywhere,
  // the woodworking machines, the dusty red convertible, and Nate's bass.
  function convertible() {
    const p = new Pix(48, 74), red = '#b82a2a', redD = '#8a1c1c', redL = '#d84848', dust = '#c88070';
    for (const [x, y] of [[0, 10], [42, 10], [0, 52], [42, 52]]) p.rect(x, y, 6, 12, '#1c1c22');
    for (let y = 2; y < 72; y++) {
      const inset = y < 8 ? 8 - y : y > 66 ? y - 66 : 0;
      p.hline(4 + inset, 43 - inset, y, red);
    }
    p.vline(4, 8, 66, redL); p.vline(43, 8, 66, redD);
    p.rect(10, 4, 28, 2, '#e8e8e8'); p.set(8, 6, '#f8f0b0'); p.set(39, 6, '#f8f0b0');
    p.hline(14, 33, 14, redD); p.hline(14, 33, 15, redL);
    p.rect(8, 24, 32, 5, '#34496a'); p.hline(9, 18, 25, '#8ab0d8');
    p.rect(7, 29, 34, 22, '#8a8c94'); for (let y = 31; y < 50; y += 3) p.hline(8, 39, y, '#7a7c84'); p.hline(7, 40, 29, '#a8aab2');
    p.rect(9, 50, 30, 4, '#34496a');
    for (let i = 0; i < 70; i++) p.set(6 + Math.floor(G.hash(i, 1, 81) * 36), 54 + Math.floor(G.hash(i, 2, 81) * 15), dust);
    for (const [hx, hy] of [[13, 58], [30, 60]]) { p.rect(hx, hy, 4, 4, redD); for (let k = 0; k < 4; k++) p.set(hx + k, hy - 2 + (k % 2), redD); }
    p.hline(18, 27, 64, '#9a2020'); p.hline(19, 25, 66, '#9a2020');
    p.rect(14, 70, 20, 2, '#d8d8d8');
    return finish(p);
  }

  // The long workbench on the back wall: pegboard with hanging tools above it.
  function workbench() {
    const W = 96, p = new Pix(W, 44);
    p.rect(0, 0, W, 22, '#a8865c');
    for (let y = 2; y < 22; y += 4) for (let x = 2 + (y % 8 ? 2 : 0); x < W; x += 4) p.set(x, y, '#7a5c3c');
    const tool = (x, h, c) => { p.vline(x, 3, 3 + h, c); p.set(x - 1, 3, c); p.set(x + 1, 3, c); };
    [[6, 10, '#2a2a30'], [12, 7, '#c83030'], [17, 12, '#5a5a62'], [24, 8, '#e8c040'], [30, 10, '#2a2a30'], [64, 9, '#3a7ac8'], [70, 12, '#5a5a62'], [77, 8, '#c83030'], [84, 10, '#2a2a30'], [90, 7, '#e8c040']].forEach(([x, h, c]) => tool(x, h, c));
    p.rect(40, 4, 18, 14, '#6a4a2a'); for (let y = 6; y < 18; y += 4) for (let x = 42; x < 56; x += 5) { p.rect(x, y, 4, 3, '#8a6a42'); p.set(x + 2, y + 1, '#d8b060'); }
    p.rect(0, 22, W, 6, '#9a7a52'); p.hline(0, W - 1, 22, '#c8a878'); for (let i = 0; i < 14; i++) p.set(Math.floor(G.hash(i, 3, 82) * W), 23 + Math.floor(G.hash(i, 4, 82) * 4), '#6a4a2a');
    p.rect(0, 28, W, 3, '#5a3e24');
    for (const x of [2, 46, 90]) p.rect(x, 31, 4, 13, '#5a3e24');
    p.rect(8, 34, 10, 6, '#3a7a3a'); p.rect(24, 35, 8, 5, '#c8c0b0'); p.rect(60, 34, 12, 6, '#e8c040'); p.rect(76, 36, 8, 4, '#c83030');
    return finish(p);
  }
  // Nate's bass lying on the bench, neck and body side by side like in the photo.
  // Nate's half-finished bass (from the user's photo): raw walnut body with
  // long horns reaching toward the neck, a maple neck that runs right through
  // the body, silver frets, empty pickup routs, a rounded paddle headstock.
  const BWAL = '#8a7062', BWALD = '#6a5446', BWALL = '#a68c7c', BMAP = '#e6cc9a', BMAPD = '#c8aa78', BMAPL = '#f6e2b8', BFRET = '#ecece6', BROUT = '#3a2c24';
  function bassOnBench() {
    const p = new Pix(52, 16);
    for (let y = 0; y < 16; y++) for (let x = 26; x < 52; x++) {
      const body = (x - 42) ** 2 / 88 + (y - 7.5) ** 2 / 60 <= 1;
      const hornU = (x - 33) ** 2 / 26 + (y - 2) ** 2 / 4 <= 1;
      const hornL = (x - 35) ** 2 / 20 + (y - 13.5) ** 2 / 4 <= 1;
      if (body || hornU || hornL) p.set(x, y, y < 3 ? BWALL : y > 12 ? BWALD : (x * 7 + y * 3) % 11 ? BWAL : BWALD);
    }
    for (let y = 2; y < 14; y++) for (let x = 0; x < 9; x++) {
      if ((x - 4.5) ** 2 / 20 + (y - 7.5) ** 2 / 26 <= 1 || (x >= 5 && y >= 5 && y <= 10)) p.set(x, y, y < 5 ? BMAPL : BMAP);
    }
    for (const [x, y] of [[3, 5], [6, 5], [3, 10], [6, 10]]) p.set(x, y, BROUT);
    p.rect(8, 6, 44, 4, BMAP); p.hline(8, 51, 6, BMAPL); p.hline(8, 51, 9, BMAPD);
    let fx = 10, gap = 3.2;
    while (fx < 38) { p.vline(Math.round(fx), 6, 9, BFRET); fx += gap; gap = Math.max(1.6, gap * 0.93); }
    p.rect(41, 5, 3, 6, BROUT); p.rect(47, 5, 3, 6, BROUT);
    return finish(p);
  }
  // Nate's half-finished bass, standing up (COLLECTABLES > Instruments): a 4-in-line maple headstock
  // with empty tuner holes, a maple neck with the frets in, and a bare walnut body with its pickup
  // and bridge routed out but nothing in them. No strings, no finish.
  function natesBass() {
    const W = 22, H = 72, p = new Pix(W, H);
    for (let y = 0; y < 13; y++) {
      const x0 = 8 + Math.round(y * 0.1), x1 = y < 2 ? 12 + y : 14;
      p.hline(x0, x1, y, y < 1 ? BMAPD : BMAP); p.set(x0, y, BMAPL); p.set(x1, y, BMAPD);
    }
    for (const y of [2, 5, 8, 11]) p.set(10, y, BROUT);
    for (let y = 13; y < 50; y++) { p.hline(9, 13, y, BMAP); p.set(9, y, BMAPL); p.set(13, y, BMAPD); }
    p.hline(9, 13, 13, BFRET);
    let fy = 16, gap = 3.4;
    while (fy < 46) { p.hline(10, 12, Math.round(fy), BFRET); fy += gap; gap = Math.max(1.6, gap * 0.94); }
    for (let y = 36; y < H; y++) for (let x = 0; x < W; x++) {
      const low = (x - 11) ** 2 / 112 + (y - 61) ** 2 / 110 <= 1;
      const up = (x - 11) ** 2 / 69 + (y - 50) ** 2 / 64 <= 1;
      const hornU = (x - 4) ** 2 / 8 + (y - 43) ** 2 / 42 <= 1;
      const hornL = (x - 18) ** 2 / 6 + (y - 46) ** 2 / 20 <= 1;
      if (!(low || up || hornU || hornL) || (x >= 9 && x <= 13 && y < 50)) continue;
      p.set(x, y, x < 3 ? BWALL : x > 18 || y > 69 ? BWALD : (x * 3 + y * 7) % 13 ? BWAL : BWALD);
    }
    // the routes: a split pickup, the control cavity and the bridge screw holes, all empty
    p.rect(7, 53, 4, 2, BROUT); p.rect(11, 55, 4, 2, BROUT);
    p.set(17, 59, BROUT); p.set(18, 62, BROUT);
    for (const x of [8, 10, 12, 14]) p.set(x, 65, BROUT);
    return finish(p);
  }
  function bassIcon() {
    const p = new Pix(16, 16);
    for (let y = 6; y < 16; y++) for (let x = 0; x < 10; x++) {
      const body = (x - 3.8) ** 2 / 13 + (y - 11.8) ** 2 / 12 <= 1;
      const horn = (x - 7.2) ** 2 / 2.5 + (y - 8.4) ** 2 / 2.5 <= 1;
      if (body || horn) p.set(x, y, (x + y) % 5 ? BWAL : BWALD);
    }
    for (let k = -1; k < 10; k++) { p.set(3 + k, 12 - k, BMAP); p.set(4 + k, 12 - k, BMAPD); if (k >= 4 && k % 2 === 0) p.set(4 + k, 12 - k, BFRET); }
    p.set(3, 12, BROUT); p.set(5, 10, BROUT);
    p.rect(12, 1, 3, 3, BMAP); p.set(11, 2, BMAP); p.set(13, 0, BMAP); p.set(13, 2, BROUT);
    return finish(p);
  }
  function shopShelves(plane) {
    const p = new Pix(16, 44);
    p.rect(0, 0, 16, 44, '#8a6a42'); p.rect(2, 2, 12, 40, '#4a3424');
    const items = ['#e8e8e8', '#e8c040', '#c83030', '#3a7ac8', '#5a8a3a', '#c8a878', '#f4f4f0'];
    for (const y0 of [3, 13, 23, 33]) {
      p.hline(2, 13, y0 + 8, '#8a6a42');
      for (let x = 3; x < 13; x += 3) { const c = items[Math.floor(G.hash(x, y0, 83) * items.length)]; const h = 3 + Math.floor(G.hash(x, y0, 84) * 4); p.rect(x, y0 + 8 - h, 2, h, c); }
    }
    if (plane) { p.hline(0, 15, 1, '#f4f4f0'); p.rect(6, 0, 4, 3, '#f4f4f0'); p.set(7, 0, '#c83030'); p.set(1, 2, '#c83030'); }
    return finish(p);
  }
  function sepiaPhoto() {
    const p = new Pix(30, 22);
    p.rect(0, 0, 30, 22, '#3a2a1c'); p.rect(2, 2, 26, 18, '#c8b088');
    p.rect(3, 12, 24, 7, '#a88a62');
    for (let x = 4; x < 27; x += 3) { p.rect(x, 8 + (x % 2), 2, 5, '#5a4630'); p.set(x, 7 + (x % 2), '#7a6248'); }
    p.rect(12, 3, 6, 5, '#e8d8b0');
    return finish(p);
  }
  function toolChest() {
    const p = new Pix(16, 36);
    p.rect(0, 0, 16, 12, '#c83030'); p.hline(0, 15, 0, '#e85050'); p.rect(2, 2, 12, 3, '#a02020');
    p.rect(0, 12, 16, 20, '#c83030');
    for (let y = 14; y < 31; y += 4) { p.hline(1, 14, y + 3, '#8a1818'); p.hline(5, 10, y + 1, '#d8d8d8'); }
    p.rect(1, 32, 3, 3, '#1c1c22'); p.rect(12, 32, 3, 3, '#1c1c22');
    return finish(p);
  }
  function lumberPile() {
    const p = new Pix(48, 24);
    for (let k = 0; k < 6; k++) {
      const y = 18 - k * 3, x0 = (k % 2) * 3, c = k % 3 === 0 ? '#c8a070' : k % 3 === 1 ? '#a87a4a' : '#d8b888';
      p.rect(x0, y, 45, 3, c); p.hline(x0, x0 + 44, y, shade(c, 0.15)); p.vline(x0 + 44, y, y + 2, shade(c, -0.3));
    }
    p.rect(2, 21, 4, 3, '#5a3e24'); p.rect(40, 21, 4, 3, '#5a3e24');
    return finish(p);
  }
  // Woodworking machines.
  function drillPress() {
    const p = new Pix(16, 42);
    p.rect(2, 2, 12, 9, '#e8e4d8'); p.rect(3, 0, 9, 3, '#3a3a40'); p.hline(2, 13, 10, '#c8c4b8'); p.rect(12, 5, 4, 2, '#1c1c22');
    p.rect(6, 11, 4, 4, '#9aa0a8'); p.vline(8, 15, 20, '#c8ccd2');
    p.rect(7, 11, 2, 29, '#c8ccd2'); p.vline(8, 11, 39, '#eef0f4');
    p.rect(2, 22, 12, 3, '#e8e4d8'); p.rect(1, 38, 14, 4, '#3a3a40');
    return finish(p);
  }
  function lathe() {
    const p = new Pix(48, 28);
    p.rect(2, 8, 44, 5, '#e8e4d8'); p.hline(2, 45, 8, '#f8f4e8');
    p.rect(0, 0, 12, 13, '#e8e4d8'); p.rect(1, 1, 10, 4, '#c8c4b8'); p.set(3, 3, '#c83030'); p.set(4, 3, '#1c1c22');
    p.rect(12, 4, 3, 4, '#5a5a62'); p.rect(15, 3, 14, 6, '#c8a070'); p.hline(15, 28, 3, '#e0c090'); p.rect(29, 4, 3, 4, '#5a5a62');
    p.rect(36, 2, 8, 11, '#e8e4d8');
    p.rect(8, 13, 32, 6, '#a87a4a'); for (let x = 10; x < 38; x += 4) p.hline(x, x + 2, 15, '#5a5a62');
    for (const x of [3, 41]) p.rect(x, 13, 4, 15, '#d8d4c8');
    return finish(p);
  }
  function bandsaw() {
    const p = new Pix(16, 44);
    p.rect(1, 0, 14, 30, '#e8e4d8'); p.rect(2, 2, 12, 10, '#3a8a5a'); p.rect(2, 16, 12, 10, '#3a8a5a');
    p.rect(5, 5, 6, 3, '#e8e4d8'); p.vline(8, 12, 16, '#c8ccd2');
    p.rect(0, 28, 16, 3, '#9aa0a8'); p.rect(3, 31, 10, 13, '#3a8a5a'); p.hline(3, 12, 31, '#5aaa7a');
    return finish(p);
  }
  function tableSaw() {
    const p = new Pix(32, 28);
    p.rect(0, 0, 32, 12, '#9aa0a8'); p.hline(0, 31, 0, '#c8ccd2'); for (let x = 2; x < 32; x += 6) p.vline(x, 1, 11, '#8a9098');
    p.rect(14, 3, 3, 6, '#5a5a62'); p.set(15, 4, '#e8e8e8'); p.rect(24, 0, 2, 12, '#e8c040');
    p.rect(2, 12, 28, 6, '#5a5a62'); p.rect(12, 13, 8, 3, '#c83030');
    for (const [x0, x1] of [[3, 0], [28, 31]]) for (let y = 18; y < 28; y++) p.set(x0 + Math.round((x1 - x0) * (y - 18) / 10), y, '#3a3a40');
    p.rect(10, 20, 8, 6, '#c8a070'); p.rect(11, 18, 6, 2, '#e0c090');
    return finish(p);
  }
  function planer() {
    const p = new Pix(18, 30);
    p.rect(1, 0, 16, 10, '#f0c020'); p.hline(1, 16, 0, '#f8d850'); p.rect(3, 3, 12, 3, '#1c1c22'); p.set(4, 4, '#f0c020');
    p.rect(2, 10, 14, 3, '#3a3a40');
    p.rect(1, 13, 16, 17, '#8a6a42'); p.hline(1, 16, 13, '#a88a5c'); for (let y = 16; y < 30; y += 5) p.hline(2, 15, y, '#6a4a2a');
    return finish(p);
  }
  function sander() {
    const p = new Pix(26, 30);
    p.rect(4, 0, 18, 14, '#c8ccd2'); p.hline(4, 21, 0, '#eef0f4');
    p.rect(6, 4, 14, 6, '#d88878'); for (let x = 7; x < 20; x += 3) p.vline(x, 4, 9, '#c87868');
    p.rect(2, 14, 22, 16, '#3a7a5a'); p.hline(2, 23, 14, '#5a9a7a'); p.rect(8, 18, 10, 6, '#2a6a4a'); p.set(12, 20, '#e8e8e8');
    return finish(p);
  }
  function miterSaw() {
    const p = new Pix(28, 28);
    p.rect(9, 0, 10, 10, '#c83030'); p.hline(9, 18, 0, '#e85050'); for (let y = 2; y < 12; y++) for (let x = 8; x < 20; x++) if ((x - 14) ** 2 + (y - 7) ** 2 <= 30 && (x - 14) ** 2 + (y - 7) ** 2 >= 20) p.set(x, y, '#c8ccd2');
    p.rect(4, 12, 20, 4, '#5a5a62');
    p.rect(0, 16, 28, 3, '#2a5ab8'); for (const [x0, x1] of [[2, 0], [25, 27]]) for (let y = 19; y < 28; y++) p.set(x0 + Math.round((x1 - x0) * (y - 19) / 9), y, '#2a4a8a');
    return finish(p);
  }
  function dustCollector() {
    const p = new Pix(26, 28);
    p.rect(0, 6, 18, 22, '#e8e8e8'); p.hline(0, 17, 6, '#ffffff'); for (let y = 10; y < 16; y += 2) p.hline(3, 14, y, '#9aa0a8');
    p.rect(19, 0, 7, 28, '#c8ccd2'); p.rect(19, 0, 7, 4, '#9aa0a8'); p.vline(20, 4, 27, '#eef0f4');
    return finish(p);
  }
  function shopVac() {
    const p = new Pix(14, 18);
    p.rect(1, 2, 12, 14, '#e86a20'); p.hline(1, 12, 2, '#f88a40'); p.rect(3, 0, 8, 3, '#2a2a30'); p.rect(0, 15, 14, 3, '#2a2a30');
    p.vline(12, 4, 12, '#2a2a30'); p.set(13, 4, '#2a2a30');
    return finish(p);
  }
  function feedBags() {
    const p = new Pix(28, 18);
    for (const [x, y] of [[0, 6], [13, 6], [6, 0]]) { p.rect(x, y, 15, 11, '#e8c040'); p.hline(x, x + 14, y, '#f8d860'); p.rect(x + 3, y + 4, 9, 3, '#c83030'); p.set(x + 5, y + 5, '#f4f4f0'); }
    return finish(p);
  }
  function buckets() {
    const p = new Pix(18, 16);
    for (const x of [0, 9]) { p.rect(x, 3, 9, 13, '#f4f4f0'); p.rect(x, 2, 9, 2, '#d8d8d4'); p.hline(x + 1, x + 7, 6, '#d8d8d4'); }
    return finish(p);
  }
  function oldFridge() {
    const p = new Pix(16, 38);
    p.rect(0, 2, 16, 36, '#ece4cc'); for (let y = 0; y < 3; y++) p.hline(2 - y + 1, 13 + y - 1, y, '#ece4cc');
    p.hline(0, 15, 14, '#c8bca0'); p.rect(12, 6, 2, 6, '#c8ccd2'); p.rect(12, 18, 2, 10, '#c8ccd2');
    p.set(3, 4, '#f8f4e8'); p.rect(0, 36, 16, 2, '#9a9080');
    return finish(p);
  }

  // ================================================================ MORE HOME + FAIR BITS
  function router() {
    const p = new Pix(16, 12);
    p.vline(3, 0, 5, '#2a2a30'); p.vline(12, 0, 5, '#2a2a30');
    p.rect(1, 5, 14, 6, '#1c1c22'); p.hline(1, 14, 5, '#3a3a44');
    for (const x of [4, 6, 8]) p.set(x, 8, '#58e078'); p.set(10, 8, '#f8d040');
    return finish(p);
  }
  // A cardboard protest sign on a stick, lettered with the game font.
  // (one line per | in the text, each centered)
  function protestSign(text, board) {
    const rows = text.split('|'), tw = Math.max(...rows.map((r) => G.font.width(r)));
    const W = tw + 6, H = rows.length * 9 + 3;
    const c = G.canvas(W + 2, H + 10), x = c.getContext('2d');
    x.fillStyle = '#7a5a3a'; x.fillRect(Math.floor(W / 2), H, 2, 10);
    x.fillStyle = '#1c1424'; x.fillRect(0, 0, W + 2, H + 1);
    x.fillStyle = board || '#e8d8b0'; x.fillRect(1, 1, W, H - 1);
    rows.forEach((r, i) => G.font.draw(x, r, 1 + Math.round((W - G.font.width(r)) / 2), 2 + i * 9, '#2a1a10'));
    return c;
  }
  // The protest organizer's megaphone.
  function megaphone() {
    const p = new Pix(10, 7);
    p.rect(0, 2, 3, 3, '#3a3a44'); p.set(0, 2, '#5a5a64');
    for (let i = 0; i < 7; i++) p.vline(3 + i, 3 - Math.floor(i / 2), 3 + Math.floor(i / 2), i === 1 || i === 4 ? '#e83838' : '#f4f2f0');
    p.vline(9, 0, 6, '#c82828');
    return finish(p);
  }
  // A few cave pearls on the bottom of a still pool (drawn flat, over the water).
  function cavePearls() {
    const p = new Pix(26, 14);
    for (const [x, y] of [[3, 6], [8, 3], [13, 7], [18, 4], [10, 10], [21, 9]]) {
      p.rect(x, y, 3, 3, '#e8e2d2'); p.set(x, y, '#ffffff'); p.set(x + 2, y + 2, '#a8a090');
    }
    return finish(p);
  }
  // Michelle's flower stand: a wooden cart with buckets of cut flowers.
  function flowerStand() {
    const p = new Pix(48, 36);
    p.rect(0, 0, 48, 5, '#e8c8d8'); for (let x = 0; x < 48; x += 8) p.rect(x, 0, 4, 5, '#f4f4f0'); p.hline(0, 47, 5, '#a87a98');
    p.vline(2, 5, 18, '#8a5a30'); p.vline(45, 5, 18, '#8a5a30');
    const cols = ['#e83878', '#f8d040', '#c858e8', '#f8f8f0', '#f08030', '#e84848'];
    for (let i = 0; i < 5; i++) {
      const x = 4 + i * 8;
      p.rect(x, 22, 7, 6, '#b8bcc4'); p.hline(x, x + 6, 22, '#d8dce0');
      for (let k = 0; k < 6; k++) { const fx = x + (k % 3) * 2 + 1, fy = 15 + Math.floor(k / 3) * 3; p.vline(fx, fy + 1, 22, '#3a8a30'); p.set(fx, fy, cols[(i + k) % cols.length]); }
    }
    p.rect(0, 28, 48, 6, '#9a6a3a'); p.hline(0, 47, 28, '#c88a50');
    p.rect(2, 34, 3, 2, '#5a3a20'); p.rect(43, 34, 3, 2, '#5a3a20');
    return finish(p);
  }
  // Heavy old door to the basement.
  function basementDoor() {
    const p = new Pix(16, 28);
    p.rect(0, 0, 16, 28, '#f4f4f0'); p.rect(2, 2, 12, 26, '#6a4a30');
    for (let y = 4; y < 26; y += 7) p.hline(3, 12, y, '#5a3a24');
    p.set(11, 15, '#d8b050'); p.set(11, 16, '#d8b050');
    return finish(p);
  }

  // ================================================================ THE BASEMENT
  function bookPile(seed, n) {
    const p = new Pix(24, 18);
    const cols = ['#a83a3a', '#2a4a7a', '#3a6a3a', '#e8c060', '#6a3a6a', '#c86a28', '#f0f0e8', '#1c1c22'];
    for (let i = 0; i < n; i++) {
      const w = 10 + Math.floor(G.hash(i, seed, 1) * 8), x = 2 + Math.floor(G.hash(i, seed, 2) * (20 - w)), y = 15 - i * 3;
      const c = cols[Math.floor(G.hash(i, seed, 3) * cols.length)];
      p.rect(x, y, w, 3, c); p.hline(x, x + w - 1, y, shade(c, 0.25)); p.vline(x + w - 1, y, y + 2, '#f4ecd8');
    }
    return finish(p);
  }
  function furnace() {
    const p = new Pix(24, 40);
    p.rect(9, 0, 6, 10, '#7a7c84'); p.rect(2, 10, 20, 28, '#8a8c94'); p.hline(2, 21, 10, '#a8aab2');
    p.rect(6, 22, 12, 8, '#3a3a40'); p.hline(7, 16, 27, '#f88020'); p.set(9, 25, '#f8c040'); p.set(14, 26, '#f8c040');
    p.rect(1, 37, 22, 3, '#5a5a62');
    return finish(p);
  }
  function storageBoxes() {
    const p = new Pix(28, 24);
    for (const [x, y, w, h] of [[0, 8, 14, 16], [13, 10, 15, 14], [5, 0, 14, 10]]) { p.rect(x, y, w, h, '#c8a070'); p.hline(x, x + w - 1, y, '#e0c090'); p.vline(x + (w >> 1), y, y + 3, '#a07a48'); }
    p.rect(7, 3, 9, 3, '#f4f4f0'); p.set(9, 4, '#c83030'); p.set(11, 4, '#3a8a30'); p.set(13, 4, '#c83030');
    return finish(p);
  }
  // A book flapping through the air like a bird (two frames).
  function flyingBook(open) {
    const p = new Pix(14, 10);
    if (open) { p.rect(0, 2, 6, 6, '#a83a3a'); p.rect(8, 2, 6, 6, '#a83a3a'); p.rect(6, 3, 2, 5, '#f4ecd8'); p.hline(1, 5, 4, '#f4ecd8'); p.hline(8, 12, 4, '#f4ecd8'); }
    else { p.rect(3, 0, 8, 10, '#2a4a7a'); p.vline(3, 0, 9, '#1c3058'); p.rect(5, 2, 5, 2, '#e8c060'); }
    return finish(p);
  }
  // The Globglogabgalab: a pink, sagging bookworm with a little bald head.
  // Frames sway left/right for his dance.
  function globglog(lean) {
    // 52 wide so his skinny arms can stick out past the body
    const W = 52, H = 48, p = new Pix(W, H), skin = '#e8a898', sd = '#c88070', sl = '#f8c8b8', crease = '#b06858';
    const off = lean;
    for (let y = 14; y < 46; y++) {
      const t = (y - 14) / 32, half = Math.round(9 + Math.sin(t * Math.PI) * 6 + t * 3);
      const cx = 26 + Math.round(off * (1 - t) * 2);
      for (let x = cx - half; x <= cx + half; x++) p.set(x, y, (y % 6 === 0) ? sd : x > cx + half - 3 ? sd : x < cx - half + 3 ? sl : skin);
    }
    for (let k = 0; k < 8; k++) { p.set(36 + k, 42 + (k >> 2), skin); p.set(36 + k, 43 + (k >> 2), sd); }
    const hx = 26 + off * 2;
    for (let y = 0; y < 15; y++) for (let x = hx - 6; x <= hx + 6; x++) if ((x - hx) ** 2 / 36 + (y - 7) ** 2 / 50 <= 1) p.set(x, y, skin);
    p.set(hx - 3, 6, '#f4f4f0'); p.set(hx - 2, 6, '#1c1424'); p.set(hx + 2, 6, '#f4f4f0'); p.set(hx + 3, 6, '#1c1424');
    p.hline(hx - 4, hx - 1, 4, '#8a5a50'); p.hline(hx + 1, hx + 4, 4, '#8a5a50');
    for (let y = 6; y < 12; y++) p.set(hx + (y > 9 ? 1 : 0), y, sd); p.rect(hx, 10, 3, 2, sd);
    p.hline(hx - 2, hx + 2, 12, '#a85a58');
    // skinny arms out from the shoulders, waving as he sways; a crease where they cross the body
    const arm = (x0, y0, x1, y1) => {
      const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
      for (let i = 0; i <= n; i++) {
        const x = Math.round(x0 + ((x1 - x0) * i) / n), y = Math.round(y0 + ((y1 - y0) * i) / n);
        p.set(x, y - 1, crease); p.set(x, y, sl); p.set(x, y + 1, skin); p.set(x, y + 2, crease);
      }
    };
    const hand = (x, y) => { p.rect(x - 1, y - 1, 3, 3, skin); p.set(x - 2, y + 1, skin); p.set(x, y + 2, sd); p.set(x + 1, y + 2, sd); };
    const lh = 28 - off * 3, rh = 30 + off * 3;
    arm(hx - 8, 17, hx - 15, 22 - off); arm(hx - 15, 22 - off, hx - 21, lh); hand(hx - 21, lh + 1);
    arm(hx + 8, 17, hx + 15, 23 + off); arm(hx + 15, 23 + off, hx + 20, rh); hand(hx + 20, rh + 1);
    return finish(p);
  }
  // ================================================================ VAN WICKLE HALL (geology, from photos)
  // Romanesque Revival, 1900: tan brick, terra-cotta trim, a steep front gable
  // with three arched windows and a crest, a lettered band, a big round-arched
  // entrance up stone steps, and a long wing with arched windows and a gray roof.
  function vanWickle() {
    const W = 128, H = 96, p = new Pix(W, H);
    const brick = '#c8885a', brickD = '#b07446', brickL = '#d89a6a', tc = '#a85030', tcL = '#c8704a';
    const glass = '#34424e', glassL = '#5a7080', stone = '#cfc6ae', stoneD = '#a8a08c', roof = '#6a6460', roofD = '#55504c';
    const brickFill = (x0, y0, x1, y1) => {
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        const course = (y - y0) % 3 === 2, joint = (x + (Math.floor((y - y0) / 3) % 2) * 3) % 6 === 0;
        p.set(x, y, course ? brickD : joint && G.hash(x, y, 77) < 0.7 ? brickD : G.hash(x, y, 78) < 0.08 ? brickL : brick);
      }
    };
    const archWin = (cx, top, w, h) => {
      // round-arched window with a terra-cotta surround
      const r = Math.floor(w / 2);
      for (let y = top - 1; y <= top + h + 1; y++) for (let x = cx - r - 1; x <= cx + r + 1; x++) {
        const dy = y - (top + r), inArch = y < top + r ? (x - cx) ** 2 + dy ** 2 <= (r + 1) ** 2 : true;
        if (inArch) p.set(x, y, tc);
      }
      for (let y = top; y <= top + h; y++) for (let x = cx - r; x <= cx + r; x++) {
        const dy = y - (top + r), inArch = y < top + r ? (x - cx) ** 2 + dy ** 2 <= r * r : true;
        if (inArch) p.set(x, y, (x === cx - r + 1 && y > top + r) ? glassL : glass);
      }
      p.vline(cx, top + r, top + h, '#5a4a40');
      p.hline(cx - r - 1, cx + r + 1, top + h + 1, stone);
    };
    // the long wing: hipped gray roof, frieze, five arched windows
    for (let y = 34; y <= 50; y++) {
      const inset = Math.max(0, 50 - y) * 0;
      const right = 126 - Math.max(0, (50 - y) - 8);
      for (let x = 48 + inset; x <= right; x++) p.set(x, y, (y - 34) % 3 === 0 ? roofD : roof);
    }
    p.hline(48, 126, 50, '#4a4440'); p.hline(52, 118, 34, roofD);
    p.rect(116, 24, 5, 11, '#7a5040'); p.hline(115, 121, 24, '#5a3a30');
    brickFill(48, 51, 126, 87);
    p.rect(48, 52, 79, 3, tc); for (let x = 50; x < 126; x += 4) p.set(x, 53, tcL);
    for (const cx of [57, 71, 85, 99, 113]) archWin(cx, 60, 9, 16);
    p.rect(48, 88, 79, 8, stone); p.hline(48, 126, 88, '#e0d8c4'); for (let x = 52; x < 126; x += 9) p.vline(x, 89, 95, stoneD);
    // the front gable pavilion
    brickFill(2, 34, 50, 89);
    for (let y = 4; y <= 36; y++) {
      const half = Math.round(((y - 4) / 32) * 26);
      for (let x = 26 - half; x <= 26 + half; x++) if (x >= 0 && x < 53) {
        const course = (y - 4) % 3 === 2;
        p.set(x, y, course ? brickD : brick);
      }
      // terra-cotta coping down both slopes
      for (const x of [26 - half, 26 + half]) { p.set(x, y, tc); p.set(x + (x < 26 ? 1 : -1), y, tcL); }
    }
    // the crest at the peak
    p.rect(23, 1, 7, 5, tc); p.set(26, 0, '#5a3a30'); p.hline(24, 28, 2, tcL); p.set(25, 4, '#5a3a30'); p.set(27, 4, '#5a3a30');
    // three arched windows in the gable
    for (const cx of [17, 26, 35]) archWin(cx, 17, 7, 11);
    // the lettered band (VAN WICKLE MEMORIAL LIBRARY)
    p.rect(3, 38, 47, 5, '#e2d4ac'); p.hline(3, 49, 38, '#f0e4c4'); p.hline(3, 49, 42, '#b8a880');
    for (let x = 6; x < 48; x += 2) if (G.hash(x, 7, 3) < 0.75) p.vline(x, 39, 41, '#8a7a5a');
    // narrow windows either side of the entrance
    for (const x0 of [5, 43]) { p.rect(x0, 58, 5, 14, glass); p.hline(x0 - 1, x0 + 5, 57, tc); p.hline(x0 - 1, x0 + 5, 72, stone); p.set(x0 + 1, 60, glassL); }
    // the big round-arched entrance
    for (let y = 47; y <= 91; y++) for (let x = 11; x <= 41; x++) {
      const d = (x - 26) ** 2 + (y - 62) ** 2;
      if (y < 62 ? d <= 15 * 15 : Math.abs(x - 26) <= 15) {
        const inner = y < 62 ? d <= 11 * 11 : Math.abs(x - 26) <= 11;
        p.set(x, y, inner ? '#2a1c18' : (y < 62 && d > 13.5 * 13.5) || Math.abs(x - 26) > 13.5 ? tcL : tc);
      }
    }
    for (let a = 0; a < 7; a++) { const ang = Math.PI + (a / 6) * Math.PI; p.set(26 + Math.round(Math.cos(ang) * 8), 62 + Math.round(Math.sin(ang) * 8), '#6a4a30'); }
    p.rect(17, 66, 18, 24, '#5a3a24'); p.vline(26, 66, 89, '#3a2418'); p.rect(19, 70, 5, 8, '#6a4a30'); p.rect(28, 70, 5, 8, '#6a4a30');
    p.set(24, 79, '#d8b050'); p.set(28, 79, '#d8b050');
    // stone base and the steps up to the door
    p.rect(2, 88, 49, 8, stone); p.hline(2, 50, 88, '#e0d8c4');
    p.rect(13, 90, 27, 6, '#d6d0c6'); p.hline(13, 39, 90, '#eeeae2'); p.hline(13, 39, 93, '#b8b2a8'); p.hline(15, 37, 94, '#eeeae2');
    return finish(p);
  }
  // A glass-topped oak display case of minerals on blue felt, with little white labels.
  function mineralCase(kind) {
    const p = new Pix(32, 24), oak = '#9a6234', oakD = '#6a4220', felt = kind === 'fluor' ? '#1c1830' : '#3a5a9a';
    p.rect(0, 0, 32, 12, '#c8e0e8'); p.rect(1, 1, 30, 10, felt);
    const gems = {
      quartz: ['#f4f4f8', '#c8a8e8', '#8a6ab8', '#a8a0a0'],
      garnet: ['#8a1828', '#b02838', '#6a1020', '#d84858'],
      fluor: ['#58f878', '#f85858', '#58f878', '#f8f858'],
      fossil: ['#d8c8a8', '#a89878', '#c8b898', '#8a7a68'],
      pyrite: ['#d8b848', '#f0d870', '#b89838', '#f8e898'],
    }[kind];
    for (let i = 0; i < 8; i++) {
      const x = 3 + (i % 4) * 7, y = 2 + Math.floor(i / 4) * 5, c = gems[i % gems.length];
      p.rect(x, y, 3 + (i % 2), 3, c); p.set(x + 1, y, '#ffffff');
      if (kind === 'fossil' && i % 2) { p.set(x + 1, y + 1, '#6a5a48'); }
      p.hline(x, x + 2, y + 4, kind === 'fluor' ? '#8a8aa8' : '#f4f4f0');
    }
    p.hline(0, 31, 0, '#e8f4f8'); p.set(4, 2, '#ffffff'); p.set(5, 1, '#ffffff');
    p.rect(0, 12, 32, 9, oak); p.hline(0, 31, 12, '#b8804a'); p.rect(3, 14, 12, 5, oakD); p.rect(17, 14, 12, 5, oakD);
    p.rect(1, 21, 2, 3, oakD); p.rect(29, 21, 2, 3, oakD);
    return finish(p);
  }
  // The cross-section rock wall: slices of Eastern PA stacked oldest (bottom) to youngest (top).
  function rockWallSection() {
    const W = 96, H = 26, p = new Pix(W, H);
    const layers = [['#a85a48', '#c87060'], ['#a8a090', '#c0b8a4'], ['#8a8a90', '#a4a4aa'], ['#c8c0a8', '#ded6c0'], ['#5a5a62', '#7a7a84']];
    let y = 0;
    layers.forEach(([c, cl], li) => {
      const h = li === 4 ? 6 : 5;
      for (let x = 0; x < W;) {
        const w = 6 + Math.floor(G.hash(x, li, 5) * 9);
        p.rect(x, y, Math.min(w, W - x), h, G.hash(x, li, 6) < 0.3 ? cl : c);
        p.hline(x, Math.min(W - 1, x + w - 1), y, '#3a3a40'); p.vline(x, y, y + h - 1, '#3a3a40');
        if (li === 4) for (let k = x + 2; k < x + w - 1; k += 3) p.set(k, y + 3, '#d8d8e0'); // gneiss banding
        x += w;
      }
      y += h;
    });
    p.hline(0, W - 1, 0, '#2a2a30');
    return finish(p);
  }
  // An arched stained glass window (Van Wickle was the library, 1900-63).
  function stainedGlass() {
    const p = new Pix(16, 26), lead = '#2a2420', cols = ['#d8a040', '#58a058', '#4a7ac8', '#c84848', '#e8d070', '#8a5ab8'];
    for (let y = 0; y < 26; y++) for (let x = 0; x < 16; x++) {
      if (y < 8 && (x - 7.5) ** 2 + (y - 8) ** 2 > 64) continue;
      const edge = x === 0 || x === 15 || y === 25 || (y < 8 && (x - 7.5) ** 2 + (y - 8) ** 2 > 50);
      p.set(x, y, edge ? '#8a6a48' : (x % 5 === 2 || y % 6 === 3) ? lead : cols[(Math.floor(x / 5) + Math.floor(y / 6) * 2) % cols.length]);
    }
    p.set(7, 4, '#ffffff'); p.set(8, 4, '#f8f0c8');
    return finish(p);
  }
  // The lab jaw crusher: green steel, a hopper on top, two flywheels, a catch tray,
  // and Nate's signed permission slip taped to the front.
  function jawCrusher() {
    const p = new Pix(30, 34), g = '#3a7a4a', gD = '#2a5a36', gL = '#5a9a68', steel = '#5a5a64';
    p.rect(3, 26, 24, 6, steel); p.hline(3, 26, 26, '#7a7a84'); p.rect(4, 32, 3, 2, '#3a3a40'); p.rect(23, 32, 3, 2, '#3a3a40');
    p.rect(7, 8, 16, 18, g); p.vline(7, 8, 25, gL); p.vline(22, 8, 25, gD);
    // hopper
    for (let y = 0; y < 8; y++) { const half = 9 - Math.floor(y / 2); p.hline(15 - half, 14 + half, y, y === 0 ? '#9a9aa4' : '#7a7a84'); }
    p.rect(11, 1, 8, 4, '#2a2a30'); p.set(12, 2, '#8a8a90'); p.set(15, 3, '#a8a090');
    // flywheels
    for (const cx of [3, 26]) for (let a = 0; a < 24; a++) { const ang = (a / 24) * Math.PI * 2; p.set(cx + Math.round(Math.cos(ang) * 4), 15 + Math.round(Math.sin(ang) * 4), '#3a3a40'); }
    for (const cx of [3, 26]) { p.hline(cx - 3, cx + 3, 15, '#5a5a64'); p.vline(cx, 12, 18, '#5a5a64'); p.set(cx, 15, '#c8c8d0'); }
    // the jaw opening and the catch tray full of gravel
    p.rect(11, 20, 8, 3, '#1c1c22'); p.rect(9, 23, 12, 3, '#8a8a90'); for (let x = 10; x < 20; x += 2) p.set(x, 23, '#c8c0b0');
    // hazard stripes and the permission slip
    for (let x = 8; x < 22; x++) p.set(x, 8, (x >> 1) % 2 ? '#f8d040' : '#1c1c22');
    p.rect(9, 11, 7, 7, '#f4f4f0'); p.hline(10, 14, 13, '#8a8a90'); p.hline(10, 13, 15, '#8a8a90'); p.set(14, 16, '#4a6ac8'); p.set(15, 16, '#4a6ac8');
    p.set(9, 11, '#c8c8a0'); p.set(15, 11, '#c8c8a0');
    return finish(p);
  }
  // A diamond-blade rock saw in a water tray.
  function rockSaw() {
    const p = new Pix(28, 20);
    p.rect(1, 8, 26, 8, '#4a5a7a'); p.hline(1, 26, 8, '#6a7a9a'); p.rect(3, 10, 22, 4, '#3a7ab0');
    for (let a = 0; a < 28; a++) { const ang = (a / 28) * Math.PI * 2; p.set(14 + Math.round(Math.cos(ang) * 6), 8 + Math.round(Math.sin(ang) * 6), '#c8c8d0'); }
    p.set(14, 8, '#5a5a64'); p.rect(2, 16, 2, 4, '#3a3a40'); p.rect(24, 16, 2, 4, '#3a3a40');
    return finish(p);
  }
  // A black-topped lab bench with two petrographic microscopes.
  function microscopeBench() {
    const p = new Pix(44, 24);
    p.rect(0, 12, 44, 3, '#2a2a30'); p.hline(0, 43, 12, '#4a4a54'); p.rect(0, 15, 44, 7, '#9a6234'); p.rect(2, 22, 3, 2, '#6a4220'); p.rect(39, 22, 3, 2, '#6a4220');
    for (const x0 of [8, 28]) {
      p.rect(x0, 9, 8, 3, '#e8e8ec'); p.rect(x0 + 2, 1, 3, 9, '#d8d8e0'); p.rect(x0 + 2, 0, 3, 2, '#2a2a30');
      p.rect(x0 + 1, 6, 5, 1, '#5a5a64'); p.set(x0 + 6, 8, '#d8a040'); p.set(x0 + 7, 8, '#4a7ac8');
    }
    for (const x of [19, 21, 23]) { p.rect(x, 11, 1, 1, '#a8c8f0'); }
    return finish(p);
  }
  // The department's prized conglomerate: a gray rock full of other rocks.
  function conglomerate() {
    const p = new Pix(16, 12);
    for (let y = 2; y < 12; y++) for (let x = 0; x < 16; x++) if ((x - 7.5) ** 2 / 56 + (y - 7) ** 2 / 25 <= 1) p.set(x, y, '#8a8a8e');
    for (const [x, y, c] of [[4, 6, '#c8b898'], [8, 5, '#5a5a62'], [11, 7, '#a85a48'], [6, 9, '#d8d8d8'], [10, 9, '#6a6a70'], [3, 8, '#7a6a5a']]) { p.set(x, y, c); p.set(x + 1, y, c); }
    return finish(p);
  }
  // A meteorite on a white pedestal under a glass dome.
  function meteoritePedestal() {
    const p = new Pix(16, 26);
    p.rect(3, 14, 10, 12, '#ecece8'); p.hline(3, 12, 14, '#ffffff'); p.vline(12, 14, 25, '#c8c8c0');
    for (let y = 8; y < 14; y++) for (let x = 4; x < 12; x++) if ((x - 7.5) ** 2 / 12 + (y - 11) ** 2 / 6 <= 1) p.set(x, y, (x + y) % 3 ? '#3a3632' : '#5a524a');
    p.set(6, 10, '#8a8a90'); p.set(9, 11, '#2a2420');
    for (let a = 0; a < 20; a++) { const ang = Math.PI + (a / 19) * Math.PI; p.set(8 + Math.round(Math.cos(ang) * 6), 13 + Math.round(Math.sin(ang) * 9), '#c8e4ec'); }
    p.set(5, 6, '#ffffff');
    return finish(p);
  }
  // Rock garden boulders (oldest to youngest in Eastern PA).
  function gardenRock(kind) {
    const p = new Pix(20, 14);
    const c = { gneiss: ['#6a6a72', '#d8d8e0'], limestone: ['#a8a8a4', '#c8c8c0'], conglomerate: ['#9a9284', '#c8b898'], sandstone: ['#a85a48', '#c87868'] }[kind];
    for (let y = 1; y < 14; y++) for (let x = 0; x < 20; x++) if ((x - 9.5) ** 2 / 90 + (y - 8) ** 2 / 40 <= 1) p.set(x, y, y < 5 ? c[1] : c[0]);
    if (kind === 'gneiss') for (let y = 5; y < 13; y += 3) for (let x = 2; x < 18; x++) if ((x - 9.5) ** 2 / 90 + (y - 8) ** 2 / 40 <= 1) p.set(x, y + (x % 4 < 2 ? 0 : 1), c[1]);
    if (kind === 'conglomerate') for (let i = 0; i < 9; i++) p.set(3 + (i * 5) % 14, 5 + (i * 3) % 7, ['#d8d8d8', '#5a5a62', '#a85a48'][i % 3]);
    if (kind === 'limestone') for (let i = 0; i < 4; i++) p.set(4 + i * 4, 9, '#8a8a84');
    if (kind === 'sandstone') for (let y = 6; y < 13; y += 2) p.hline(4, 15, y, '#94503e');
    return finish(p);
  }
  // A black campus lamppost with a maroon Lafayette banner.
  function lamppost() {
    const p = new Pix(12, 40);
    p.rect(5, 6, 2, 34, '#1c1c22'); p.rect(3, 0, 6, 6, '#2a2a30'); p.rect(4, 1, 4, 4, '#f8e8a0'); p.rect(3, 38, 6, 2, '#1c1c22');
    p.rect(7, 10, 5, 12, '#8a1c2c'); p.hline(7, 11, 10, '#a83040'); p.vline(9, 13, 18, '#f4f0e8'); p.hline(9, 10, 18, '#f4f0e8');
    return finish(p);
  }

  // ================================================================ THE ANDOVER MINES
  // Specimen icons (14x12), one look per rock.
  function rockIcon(id) {
    const p = new Pix(14, 12);
    const blob = (c, cl) => { for (let y = 1; y < 12; y++) for (let x = 0; x < 14; x++) if ((x - 6.5) ** 2 / 44 + (y - 6.5) ** 2 / 28 <= 1) p.set(x, y, y < 4 ? cl : c); };
    switch (id) {
      case 'hematite': blob('#5a3a36', '#8a5a54'); for (const [x, y] of [[4, 6], [8, 5], [6, 8], [10, 8]]) p.set(x, y, '#a8302a'); p.hline(3, 9, 9, '#7a2a24'); break;
      case 'magnetite': blob('#2a2a30', '#4a4a54'); for (const [x, y] of [[5, 4], [8, 6], [4, 8], [10, 7]]) { p.set(x, y, '#9a9aa8'); p.set(x + 1, y + 1, '#6a6a74'); } break;
      case 'calcite': blob('#e8e4d8', '#ffffff'); p.hline(3, 10, 5, '#c8c0b0'); p.vline(7, 3, 10, '#c8c0b0'); p.set(5, 7, '#f8f0c8'); break;
      case 'marble': blob('#ecebe6', '#ffffff'); for (let x = 2; x < 12; x++) p.set(x, 5 + Math.round(Math.sin(x) * 1.5), '#a8a8b0'); p.set(9, 9, '#c8c8d0'); break;
      case 'quartz': p.rect(2, 9, 10, 3, '#8a8a90'); for (const [x, h] of [[3, 7], [6, 9], [9, 6]]) { p.rect(x, 9 - h, 2, h, '#e8f4fc'); p.set(x, 9 - h - 1, '#ffffff'); p.vline(x + 1, 9 - h, 8, '#b8d0e0'); } break;
      case 'jasper': blob('#a83a2a', '#c85a44'); p.hline(3, 9, 7, '#8a2a20'); p.set(5, 4, '#e88070'); break;
      case 'garnet': blob('#7a7a80', '#9a9aa0'); for (const [x, y] of [[3, 5], [7, 4], [9, 7], [5, 8]]) { p.rect(x, y, 2, 2, '#8a1828'); p.set(x, y, '#d84858'); } break;
      case 'pyrite': p.rect(1, 5, 6, 6, '#c8a838'); p.rect(6, 3, 6, 6, '#d8b848'); p.hline(6, 11, 3, '#f8e898'); p.hline(1, 6, 5, '#f0d870'); p.vline(11, 3, 8, '#a88a28'); break;
      case 'slag': blob('#3a8a8a', '#68c8c0'); for (const [x, y] of [[4, 6], [8, 8], [9, 4]]) p.set(x, y, '#1c4a4a'); p.set(5, 3, '#c8f8f0'); break;
      case 'sphalerite': blob('#4a2a14', '#7a4a24'); p.set(5, 4, '#c88a40'); p.set(8, 7, '#a86a30'); p.hline(4, 7, 9, '#2a180a'); break;
      case 'galena': p.rect(2, 4, 6, 6, '#8a8a98'); p.rect(6, 2, 6, 6, '#a8a8b8'); p.hline(6, 11, 2, '#e0e0ec'); p.hline(2, 7, 4, '#c8c8d8'); p.vline(11, 2, 7, '#6a6a78'); p.rect(3, 9, 4, 1, '#6a6a78'); break;
      case 'chalcopyrite': blob('#b89838', '#d8b848'); for (const [x, y, c] of [[3, 7, '#5a6ad8'], [6, 8, '#a858c8'], [9, 6, '#58b8c8'], [7, 5, '#c858a8']]) { p.set(x, y, c); p.set(x + 1, y, c); } break;
      case 'specular': blob('#5a5a64', '#7a7a84'); for (const [x, y] of [[3, 5], [6, 3], [9, 6], [5, 8], [10, 9]]) { p.set(x, y, '#ffffff'); p.set(x + 1, y, '#c8c8d8'); } break;
      case 'lodestone': blob('#2a2a30', '#44444c'); for (let x = 1; x < 13; x += 2) { p.set(x, 1, '#8a8a94'); p.set(x + 1, 0, '#8a8a94'); } p.rect(10, 7, 3, 1, '#c8c8d0'); p.set(12, 6, '#c8c8d0'); break;
      case 'dolomite': blob('#a8a49a', '#c8c4b8'); for (const [x, y] of [[3, 6], [7, 5], [10, 8], [5, 9]]) p.set(x, y, '#e8e4d8'); p.hline(2, 11, 7, '#8a8678'); break;
      case 'gneiss': blob('#e0d8c8', '#f0ece0'); for (const y of [5, 8, 10]) for (let x = 1; x < 13; x++) p.set(x, y + Math.round(Math.sin(x * 0.7 + y) * 0.8), '#3a3a40'); p.set(6, 4, '#d89a8a'); break;
      case 'stromatolite': blob('#9a8a70', '#b8a88a'); for (const r of [2, 4, 6]) for (let x = 0; x < 14; x++) { const y = 11 - Math.round(Math.sqrt(Math.max(0, r * r - (x - 6.5) ** 2)) * 1.1); if (y > 1 && y < 11) p.set(x, y, '#6a5a44'); } break;
      case 'cementrock': blob('#4e5058', '#6a6c74'); p.hline(2, 11, 6, '#3a3c44'); p.hline(3, 10, 9, '#3a3c44'); p.set(8, 4, '#8a8c94'); break;
      case 'serpentine': blob('#4e8a5e', '#78b888'); for (const [x, y] of [[3, 7], [4, 8], [5, 8], [8, 5], [9, 6], [10, 9]]) p.set(x, y, '#2e5a3e'); p.set(5, 4, '#c8f0d0'); p.set(9, 8, '#a8d8b0'); break;
      case 'eastonite': for (let i = 0; i < 4; i++) { p.rect(2 + i, 8 - i * 2, 9, 3, i % 2 ? '#a87a3a' : '#c8984a'); p.hline(2 + i, 10 + i, 8 - i * 2, '#f0d088'); } p.set(6, 3, '#ffffff'); break;
      case 'shale': for (let i = 0; i < 3; i++) { p.rect(1 + i, 9 - i * 3, 12 - i * 2, 3, i % 2 ? '#a85040' : '#9a4a3a'); p.hline(1 + i, 12 - i, 9 - i * 3, '#c8705a'); } p.set(6, 7, '#5a2a20'); p.set(7, 7, '#5a2a20'); break;
      case 'basalt': blob('#2e2e34', '#46464e'); for (const [x, y] of [[4, 6], [8, 5], [6, 9], [10, 8]]) { p.set(x, y, '#1a1a20'); p.set(x + 1, y, '#5a5a64'); } break;
      case 'prehnite': blob('#2e2e34', '#46464e'); for (const [x, y] of [[4, 5], [5, 5], [6, 4], [5, 6], [8, 6], [9, 7], [8, 7]]) p.set(x, y, '#b8e898'); p.set(5, 4, '#e8fcd8'); p.set(9, 6, '#e8fcd8'); break;
      case 'chesapecten':
        // a fossil scallop: a ribbed fan of a shell, cream and tan, with its two little hinge "ears"
        for (let y = 0; y < 12; y++) for (let x = 0; x < 14; x++) {
          const dx = x - 6.5, dy = 10.5 - y, r = Math.hypot(dx, dy * 1.05), a = Math.atan2(dx, dy);
          if (r <= 9.5 && Math.abs(a) <= 1.05) p.set(x, y, Math.round((a + 1.1) * 5) % 2 ? '#d8c8a0' : '#b8a478');
        }
        p.rect(3, 9, 8, 3, '#c8b488'); p.hline(3, 10, 11, '#9a8458'); p.set(6, 2, '#f0e4c8'); p.set(4, 4, '#e8dcb8');
        break;
      case 'megalodon':
        // a big triangular fossil tooth: dark enamel, serrated edges, a brown root band
        for (let y = 0; y < 12; y++) for (let x = 0; x < 14; x++) {
          const half = (y - 1) * 0.62;
          if (y >= 1 && Math.abs(x - 6.5) <= half) p.set(x, y, y >= 9 ? '#7a5638' : (x - 6.5) < -half + 1.2 ? '#8a8e96' : '#4a4e58');
        }
        for (let y = 2; y < 9; y += 2) { p.set(Math.round(6.5 - (y - 1) * 0.62), y, '#2a2e36'); p.set(Math.round(6.5 + (y - 1) * 0.62), y, '#2a2e36'); }
        p.set(6, 3, '#c8ccd4'); p.set(5, 5, '#a8acb4'); p.hline(1, 12, 9, '#5a3e28');
        break;
      case 'cavepearl':
        for (const [ox, oy, r] of [[4.5, 7.5, 3.2], [9.5, 5, 3.4], [9.5, 9.8, 2]]) for (let y = 0; y < 12; y++) for (let x = 0; x < 14; x++) {
          const d = (x - ox) ** 2 + (y - oy) ** 2;
          if (d <= r * r) p.set(x, y, d <= 1.2 && x <= ox && y <= oy ? '#ffffff' : x < ox && y < oy ? '#fbf8ee' : '#e0d8c6');
        }
        break;
      case 'fairystone':
        // staurolite, twinned into a little cross: two dark brown crystals crossing at right angles
        p.rect(5, 0, 4, 12, '#6a3a2a'); p.rect(1, 4, 12, 4, '#6a3a2a');
        p.vline(5, 0, 11, '#8a5a44'); p.hline(1, 12, 4, '#8a5a44');
        p.vline(8, 0, 11, '#4a2418'); p.hline(1, 12, 7, '#4a2418');
        p.set(6, 1, '#b08068'); p.set(2, 5, '#b08068'); p.set(10, 5, '#a07058'); p.set(6, 9, '#a07058');
        break;
      case 'cannonball': for (let y = 1; y < 12; y++) for (let x = 1; x < 13; x++) if ((x - 6.5) ** 2 + (y - 6.5) ** 2 <= 27) p.set(x, y, '#2a2a2e'); p.set(4, 4, '#8a8a94'); p.set(5, 3, '#6a6a74'); p.set(8, 9, '#4a3a2a'); break;
    }
    return finish(p);
  }
  // A mineral vein in the rock: glints in the lantern light; cracks when hit.
  function oreVein(stage) {
    const p = new Pix(18, 16);
    for (let y = 2; y < 16; y++) for (let x = 0; x < 18; x++) if ((x - 8.5) ** 2 / 72 + (y - 9) ** 2 / 44 <= 1) p.set(x, y, y < 6 ? '#8a7466' : '#6e5a4e');
    for (const [x, y, c] of [[4, 8, '#a8302a'], [8, 6, '#c8c8d8'], [12, 9, '#d8b848'], [7, 11, '#5a5a64'], [10, 12, '#a8302a']]) { p.set(x, y, c); p.set(x + 1, y, c); }
    if (stage >= 1) { p.vline(9, 4, 9, '#2a1c18'); p.set(10, 10, '#2a1c18'); p.set(8, 11, '#2a1c18'); }
    if (stage >= 2) { p.vline(5, 7, 13, '#2a1c18'); p.hline(10, 14, 7, '#2a1c18'); p.set(12, 12, '#2a1c18'); }
    return finish(p);
  }
  // A heap of mine waste on the dump (and a glassy slag heap by the old furnace).
  function dumpPile(slag) {
    const p = new Pix(20, 12), c = slag ? ['#3a8a8a', '#2a6a6a', '#68c8c0', '#5a5a5a'] : ['#7a5a4a', '#5e4438', '#a8583a', '#8a8a90'];
    for (let y = 2; y < 12; y++) for (let x = 0; x < 20; x++) if ((x - 9.5) ** 2 / 100 + (y - 11) ** 2 / 81 <= 1) p.set(x, y, c[Math.floor(G.hash(x, y, slag ? 31 : 32) * 4)]);
    return finish(p);
  }
  // The ruins of the old Andover iron furnace: a stone stack, crumbling.
  function furnaceRuin() {
    const p = new Pix(36, 44);
    for (let y = 6; y < 44; y++) { const half = 10 + Math.floor((y - 6) / 6); for (let x = 18 - half; x <= 17 + half; x++) p.set(x, y, ((x + (y >> 2)) % 5 === 0 || y % 4 === 0) ? '#6a6460' : (G.hash(x, y, 9) < 0.15 ? '#9a928a' : '#84807a')); }
    for (let y = 0; y < 8; y++) for (let x = 9 + y; x < 27 - (y >> 1); x++) if (G.hash(x, y, 11) < 0.7) p.set(x, y + 4, '#84807a');
    for (let y = 28; y < 44; y++) for (let x = 13; x < 23; x++) if ((x - 18) ** 2 / 25 + (y - 36) ** 2 / 64 <= 1 || y > 36) p.set(x, y, '#2a2420');
    for (const [x, y] of [[6, 20], [28, 26], [10, 34], [25, 14]]) p.rect(x, y, 3, 2, '#4a7a34');
    return finish(p);
  }
  // A timbered tunnel mouth (the adit) at the north end of the cut.
  function adit() {
    const p = new Pix(28, 26);
    p.rect(4, 6, 20, 20, '#120c0a'); for (let y = 6; y < 26; y++) p.set(4 + (y % 3 === 0 ? 1 : 0), y, '#1c1410');
    p.rect(1, 4, 4, 22, '#7a5a34'); p.rect(23, 4, 4, 22, '#7a5a34'); p.vline(1, 4, 25, '#9a7444'); p.vline(23, 4, 25, '#9a7444');
    p.rect(0, 2, 28, 5, '#6a4a2a'); p.hline(0, 27, 2, '#9a7444');
    p.rect(9, 9, 10, 4, '#e8d8b0'); p.hline(10, 17, 10, '#8a2a20'); p.hline(10, 16, 11, '#8a2a20');
    return finish(p);
  }
  // A little brown bat (two frames).
  function batFrame(up) {
    const p = new Pix(14, 8), c = '#4a3440', cl = '#6a4a5a';
    p.rect(5, 2, 4, 4, c); p.set(6, 3, '#f8d850'); p.set(8, 3, '#f8d850'); p.set(5, 1, c); p.set(8, 1, c);
    if (up) { p.hline(0, 4, 1, cl); p.hline(9, 13, 1, cl); p.set(1, 2, c); p.set(12, 2, c); }
    else { p.hline(0, 4, 4, cl); p.hline(9, 13, 4, cl); p.set(0, 5, c); p.set(13, 5, c); }
    return finish(p);
  }

  // ---- area rocks: outcrops, quarry rubble, the big rocks only Doron can move, a gravel bar
  function outcrop(kind) {
    const p = new Pix(20, 14);
    const c = { laf: ['#8a8c90', '#a8aaae', '#6e7074'], eas: ['#4e5058', '#6a6c74', '#3a3c44'], bed: ['#9a4a3a', '#b8624e', '#7a3a2c'] }[kind];
    for (let y = 2; y < 14; y++) for (let x = 0; x < 20; x++) if ((x - 9.5) ** 2 / 100 + (y - 10) ** 2 / 64 <= 1) p.set(x, y, y % 3 === 0 ? c[2] : y < 6 ? c[1] : c[0]);
    p.set(5, 7, '#4a7a34'); p.set(6, 7, '#5a9a40'); p.set(14, 5, '#4a7a34');
    return finish(p);
  }
  function quarryRubble() {
    const p = new Pix(24, 16);
    for (const [x, y, w, h] of [[0, 8, 9, 8], [7, 5, 10, 11], [15, 7, 9, 9], [4, 2, 8, 7], [12, 1, 7, 6]]) {
      p.rect(x, y, w, h, '#4e7a5e'); p.hline(x, x + w - 1, y, '#78a888'); p.vline(x + w - 1, y, y + h - 1, '#3a5a46');
      p.set(x + 2, y + 3, '#2e4a3a'); p.set(x + 4, y + 5, '#9ac8a8');
    }
    return finish(p);
  }
  function bigRock(kind) {
    const p = new Pix(36, 26);
    const c = kind === 'basalt' ? ['#2e2e34', '#46464e', '#1e1e24', '#5a5a64'] : ['#8a8c90', '#a8aaae', '#6e7074', '#c0c2c6'];
    for (let y = 2; y < 26; y++) for (let x = 0; x < 36; x++) if ((x - 17.5) ** 2 / 300 + (y - 15) ** 2 / 150 <= 1) p.set(x, y, y < 9 ? c[1] : (x + y * 3) % 7 === 0 ? c[2] : c[0]);
    if (kind === 'basalt') for (const [x, y] of [[9, 12], [16, 9], [24, 14], [12, 18], [21, 20]]) { p.set(x, y, c[2]); p.set(x + 1, y, c[3]); }
    else for (let y = 10; y < 24; y += 3) for (let x = 4; x < 32; x++) if ((x - 17.5) ** 2 / 300 + (y - 15) ** 2 / 150 <= 1 && (x + y) % 4 < 2) p.set(x, y, c[3]);
    p.rect(6, 22, 6, 3, '#4a7a34'); p.rect(26, 21, 5, 3, '#4a7a34');
    return finish(p);
  }
  // a sandy gravel bar in the brook, pebbles of every color washed down from upstream
  function gravelBar() {
    const p = new Pix(28, 12);
    for (let y = 0; y < 12; y++) for (let x = 0; x < 28; x++) {
      const d = (x - 13.5) ** 2 / 182 + (y - 6) ** 2 / 30;
      if (d <= 1) p.set(x, y, d > 0.75 ? '#a89a78' : G.hash(x, y, 62) < 0.25 ? '#a89878' : '#c8b890');
    }
    for (let i = 0; i < 22; i++) {
      const x = 3 + Math.floor(G.hash(i, 3, 61) * 22), y = 3 + Math.floor(G.hash(i, 4, 61) * 6);
      const c = ['#b8624e', '#6e7074', '#e8e0d0', '#2e2e34', '#8ac888'][i % 5];
      p.set(x, y, c); if (i % 3 === 0) p.set(x + 1, y, c);
    }
    return finish(p);
  }

  // a rolled-up diploma with a red ribbon
  function diploma() {
    const p = new Pix(16, 10);
    p.rect(1, 2, 14, 6, '#f4ecd8'); p.hline(1, 14, 2, '#ffffff'); p.hline(1, 14, 7, '#c8bca0');
    p.rect(0, 2, 2, 6, '#e0d4b8'); p.rect(14, 2, 2, 6, '#e0d4b8');
    p.rect(7, 1, 2, 8, '#d03038'); p.set(6, 9, '#d03038'); p.set(9, 9, '#d03038');
    return finish(p);
  }
  // Father Eggmas's calling card: a scrap of paper in shaky red marker, pinned up
  function eggNote() {
    const p = new Pix(10, 11);
    p.rect(1, 2, 8, 9, '#f4ecd8'); p.hline(1, 8, 10, '#c8bca0'); p.set(4, 1, '#c83030'); p.set(5, 1, '#e85050');
    for (const [x, y, w] of [[2, 4, 3], [6, 4, 2], [2, 6, 5], [3, 8, 4]]) p.hline(x, x + w - 1, y, '#c83030');
    return finish(p);
  }
  // ---- Dad's snacks: a bag of candy corn, a bag of blue Doritos, and the
  // muddy bear tracks across the workshop floor
  function candyCorn() {
    const p = new Pix(14, 16);
    p.rect(2, 2, 10, 13, '#e8f0f4'); p.hline(2, 11, 2, '#c8d4dc'); p.rect(2, 0, 10, 2, '#e85a20'); p.hline(3, 10, 1, '#f8a040');
    for (const [x, y] of [[4, 5], [8, 6], [5, 9], [9, 10], [4, 12], [8, 13], [6, 7]]) { p.set(x, y, '#f8f8f0'); p.set(x, y + 1, '#f8a020'); p.set(x + 1, y + 1, '#f8a020'); p.set(x, y + 2, '#f8d040'); p.set(x + 1, y + 2, '#f8d040'); }
    p.rect(3, 3, 8, 2, '#e85a20'); p.set(5, 3, '#f8f8f0'); p.set(8, 3, '#f8f8f0');
    return finish(p);
  }
  function doritos() {
    const p = new Pix(14, 16);
    p.rect(1, 1, 12, 14, '#2a5ad0'); p.hline(1, 12, 1, '#5a8af0'); p.vline(12, 1, 14, '#1a3aa0'); p.hline(1, 12, 0, '#c8c8d0'); p.hline(1, 12, 15, '#c8c8d0');
    for (let y = 0; y < 5; y++) p.hline(5 - y, 7 + y, 6 + y, y === 0 ? '#f8d040' : '#e88a30');
    p.set(5, 8, '#78c048'); p.set(8, 9, '#78c048'); p.set(6, 10, '#78c048');
    p.hline(3, 10, 3, '#e83030'); p.hline(4, 9, 4, '#f8f8f0');
    return finish(p);
  }
  function pawPrints() {
    const p = new Pix(46, 14), mud = '#6a5038', mudD = '#4a3828';
    for (const [x, y] of [[2, 8], [14, 3], [26, 8], [38, 3]]) {
      p.rect(x, y + 2, 4, 3, mud); p.hline(x + 1, x + 2, y + 5, mudD);
      for (const t of [0, 2, 4]) p.set(x + t - 1 + (t >> 1), y, mudD);
    }
    return p.canvas();
  }

  // ---- secret rocks: the carnival balloon booth (full, and after Lily), a
  // funnel cake, and Dr. Nataro's tray of three gray rocks with a dropper bottle
  function balloonBooth(popped) {
    const W = 48, H = 44, p = new Pix(W, H);
    p.rect(0, 0, W, 8, '#e83030');
    for (let x = 0; x < W; x += 8) p.rect(x, 0, 4, 8, '#f8f8f0');
    for (let x = 0; x < W; x += 4) p.set(x + 1, 8, x % 8 ? '#f8f8f0' : '#e83030');
    p.rect(1, 9, 2, 35, '#8a5a34'); p.rect(W - 3, 9, 2, 35, '#8a5a34');
    p.rect(4, 10, W - 8, 22, '#5a3a24'); p.hline(4, W - 5, 10, '#7a5434');
    const cols = ['#e83030', '#f8d040', '#3878d8', '#38a048'];
    for (let i = 0; i < 12; i++) {
      const bx = 9 + (i % 4) * 9, by = 13 + Math.floor(i / 4) * 6;
      if (popped) { p.set(bx + 1, by + 3, cols[(i + 1) % 4]); p.set(bx + 2, by + 4, cols[(i + 1) % 4]); continue; }
      p.rect(bx, by, 4, 4, cols[(i + 1) % 4]); p.set(bx + 1, by + 1, '#ffffff'); p.set(bx + 2, by + 4, '#3a2a20');
    }
    // the counter with the top prize on its velvet pillow
    p.rect(3, 32, W - 6, 12, '#c8a070'); p.hline(3, W - 4, 32, '#e0c090'); p.hline(3, W - 4, 43, '#8a6a48');
    if (!popped) { p.rect(19, 28, 10, 4, '#8a2848'); p.rect(21, 25, 6, 4, '#6a6c74'); p.set(22, 26, '#8a8c94'); p.rect(30, 30, 4, 2, '#f8f8f0'); }
    else p.rect(19, 30, 10, 2, '#8a2848');
    for (const x of [8, 12, 38]) { p.vline(x, 34, 38, '#3a3a40'); p.set(x, 33, '#e83030'); }
    return finish(p);
  }
  // ---- the midway at the fair, and other things for late-game exploring: the high striker,
  // Hook-a-Duck (and its rubber ducks), the water-gun race, the Science Center's emergency
  // shower and eyewash, the bidet's upgrades, and the attic hatch at home
  // the high striker: a red and white pole with colored bands up the side, the bell on top, the
  // strike pad on a wooden base, and the mallet leaning on it (the puck is drawn sliding on top)
  function highStriker() {
    const W = 32, H = 64, p = new Pix(W, H);
    p.rect(2, 53, 28, 11, '#8a5a34'); p.hline(2, 29, 53, '#b07848'); p.hline(2, 29, 63, '#5a3a20');
    p.rect(17, 49, 10, 5, '#3a3a40'); p.rect(18, 48, 8, 2, '#d83030');
    p.rect(10, 7, 6, 46, '#f8f8f0'); p.vline(10, 7, 52, '#e0e0d8'); p.vline(15, 7, 52, '#c8c8c0');
    for (let y = 11; y < 52; y += 5) p.hline(11, 14, y, '#d83030');
    ['#a858c8', '#3878d8', '#38a048', '#f0c830', '#f08a28', '#d83030'].forEach((c, i) => p.rect(5, 9 + i * 7, 4, 6, c));
    for (let y = 0; y < 7; y++) for (let x = 0; x < 12; x++) if (((x - 5.5) / 5.5) ** 2 + ((y - 6) / 6) ** 2 <= 1) p.set(7 + x, y, x < 4 ? '#f8e070' : '#d8a830');
    p.set(9, 2, '#ffffff');
    p.vline(26, 32, 52, '#a87848'); p.vline(27, 32, 52, '#8a5a34'); p.rect(23, 28, 8, 5, '#6a6a74'); p.hline(23, 30, 28, '#8a8a94');
    return finish(p);
  }
  // Hook-a-Duck: a striped awning, the back wall with the sign, the little tub up on a stand in
  // the back for the golden duck (way out of reach), and the long blue trough the ducks float
  // around (the ducks are drawn on top)
  function duckBooth() {
    const W = 64, H = 90, p = new Pix(W, H);
    p.rect(0, 0, W, 10, '#f0c830'); for (let x = 0; x < W; x += 8) p.rect(x, 0, 4, 10, '#3878d8');
    for (let x = 0; x < W; x += 4) p.set(x + 1, 10, x % 8 ? '#3878d8' : '#f0c830');
    p.rect(0, 11, 2, 36, '#8a5a34'); p.rect(W - 2, 11, 2, 36, '#8a5a34');
    p.rect(2, 11, W - 4, 17, '#f4f0e8'); p.hline(2, W - 3, 27, '#c8c4b8');
    p.rect(2, 28, W - 4, 16, '#2e8a48'); for (let x = 4; x < W - 4; x += 5) p.vline(x, 29, 43, '#3a9a54');
    p.rect(22, 30, 20, 7, '#3878d8'); p.rect(24, 31, 16, 4, '#68b8f8'); p.rect(30, 37, 4, 7, '#8a5a34');
    p.rect(1, 44, W - 2, 46, '#2a5ab8'); p.rect(4, 47, W - 8, 40, '#58a8f0');
    p.rect(14, 56, W - 28, 20, '#2a5ab8'); p.rect(15, 57, W - 30, 18, '#f0c830'); p.rect(17, 59, W - 34, 14, '#f8e070');
    for (let x = 6; x < W - 6; x += 7) { p.set(x, 50, '#a8d8ff'); p.set(x + 3, 82, '#a8d8ff'); }
    const cv = finish(p);
    G.font.draw(cv.getContext('2d'), 'HOOK-A-DUCK', 32 - Math.round(G.font.width('HOOK-A-DUCK') / 2), 15, '#d83030');
    return cv;
  }
  // a rubber duck floating (facing right; mirrored for left), and the golden one
  function rubberDuck(gold) {
    const p = new Pix(10, 8), b = gold ? '#f8d030' : '#f8e050', d = gold ? '#c89810' : '#d8b030';
    p.rect(1, 4, 8, 3, b); p.hline(2, 7, 7, d); p.rect(5, 1, 4, 4, b); p.set(7, 2, '#1a1a1a'); p.rect(9, 3, 1, 2, '#f08a28');
    p.set(2, 4, '#ffffff'); p.set(6, 1, '#ffffff');
    if (gold) { p.set(3, 5, '#ffffff'); p.set(8, 5, '#fff8c0'); }
    return finish(p);
  }
  // the water-gun race: a red and white awning, three clown faces on the back wall with their
  // mouths open (the targets; the balloons over their heads are drawn on top, filling up), and
  // the counter with three water guns bolted to it
  function raceBooth() {
    const W = 80, H = 64, p = new Pix(W, H);
    p.rect(0, 0, W, 9, '#e83030'); for (let x = 0; x < W; x += 8) p.rect(x, 0, 4, 9, '#f8f8f0');
    for (let x = 0; x < W; x += 4) p.set(x + 1, 9, x % 8 ? '#f8f8f0' : '#e83030');
    p.rect(0, 10, 2, 54, '#8a5a34'); p.rect(W - 2, 10, 2, 54, '#8a5a34');
    p.rect(2, 10, W - 4, 38, '#3a6ad8'); for (let y = 12; y < 48; y += 4) p.hline(2, W - 3, y, '#4a7ae8');
    for (const cx of [13, 40, 67]) {
      p.vline(cx, 11, 26, '#e8e8e8');
      for (let y = -7; y <= 7; y++) for (let x = -7; x <= 7; x++) if (x * x + y * y <= 49) p.set(cx + x, 34 + y, '#f8f4ec');
      p.rect(cx - 9, 27, 3, 5, '#f08a28'); p.rect(cx + 7, 27, 3, 5, '#f08a28');
      p.set(cx - 3, 31, '#1a1a1a'); p.set(cx + 3, 31, '#1a1a1a'); p.rect(cx - 1, 33, 3, 2, '#e83030');
      for (let y = -2; y <= 2; y++) for (let x = -3; x <= 3; x++) if (x * x / 9 + y * y / 4 <= 1) p.set(cx + x, 38 + y, '#2a1a1a');
    }
    p.rect(1, 48, W - 2, 16, '#c8a070'); p.hline(1, W - 2, 48, '#e0c090'); p.hline(1, W - 2, 63, '#8a6a48');
    for (const cx of [13, 40, 67]) { p.rect(cx - 3, 44, 7, 5, '#38a048'); p.rect(cx - 1, 39, 3, 5, '#2a8838'); p.set(cx, 38, '#a8d8ff'); }
    return finish(p);
  }
  // the Science Center's emergency shower and eyewash: a pipe down from the ceiling to a big
  // green pull handle and shower head, the eyewash bowl, and its water jug on a shelf
  function safetyStation() {
    const W = 16, H = 42, p = new Pix(W, H);
    // the green EMERGENCY sign up on the wall, the pipe down to the shower head and pull handle
    p.rect(1, 0, 14, 8, '#2e9a48'); p.hline(1, 14, 0, '#4aba64'); p.hline(1, 14, 7, '#1e7a38');
    p.rect(6, 1, 4, 6, '#f8f8f0'); p.rect(7, 2, 2, 4, '#2e9a48'); p.rect(5, 3, 6, 2, '#f8f8f0'); p.rect(6, 3, 4, 2, '#2e9a48');
    p.vline(7, 8, 17, '#a8a8b0'); p.vline(8, 8, 17, '#7a7a84');
    p.hline(2, 13, 18, '#c8c8d0'); p.rect(3, 19, 10, 2, '#8a8a94');
    p.rect(12, 12, 2, 5, '#2e9a48'); p.rect(11, 11, 4, 2, '#3aaa58');
    // the eyewash bowl, its pipe, and the jug on the shelf underneath
    p.rect(2, 24, 12, 4, '#e8e8ec'); p.rect(3, 25, 10, 2, '#a8d8f0'); p.vline(8, 28, 33, '#a8a8b0');
    p.rect(1, 33, 14, 2, '#8a8a94'); p.rect(4, 35, 8, 7, '#c8e8f8'); p.hline(4, 11, 35, '#ffffff'); p.rect(6, 34, 4, 1, '#2a6ad8');
    return finish(p);
  }
  // the bidet's upgrades: the lab carboy tank, and the turbo nozzle from the water race
  function carboyIcon() {
    const p = new Pix(14, 16);
    p.rect(1, 4, 12, 12, '#d8eef8'); p.rect(2, 8, 10, 7, '#7ac0f0'); p.hline(2, 11, 8, '#a8d8ff');
    p.rect(5, 1, 4, 3, '#2a6ad8'); p.hline(1, 12, 4, '#f4fbff'); p.vline(1, 4, 15, '#f4fbff');
    p.rect(3, 10, 5, 3, '#f8f8f0'); p.hline(4, 6, 11, '#3a3a40');
    p.outline();
    return p.canvas();
  }
  function nozzleIcon() {
    const p = new Pix(16, 12);
    p.rect(0, 3, 9, 6, '#f08a28'); p.hline(0, 8, 3, '#f8b058'); p.rect(9, 4, 4, 4, '#3878d8'); p.rect(13, 5, 3, 2, '#2a2a30');
    p.rect(2, 9, 3, 3, '#f08a28'); p.set(14, 3, '#a8d8ff'); p.set(15, 2, '#a8d8ff'); p.set(15, 9, '#a8d8ff');
    p.outline();
    return p.canvas();
  }
  // the attic hatch, up where the hallway wall meets the ceiling (the pull cord snapped off years ago)
  function homeAtticHatch() {
    const p = new Pix(28, 16);
    p.rect(0, 0, 28, 10, '#8a7e6a'); p.rect(2, 1, 24, 7, '#d8ccb4'); p.hline(2, 25, 8, '#5a5040'); p.hline(2, 25, 1, '#ece2cc');
    p.rect(12, 4, 4, 2, '#8a7e6a');
    p.vline(14, 10, 13, '#b8925a'); p.rect(13, 13, 3, 2, '#a8824a');
    return finish(p);
  }

  function funnelCake() {
    const p = new Pix(16, 12);
    for (let y = 4; y < 12; y++) for (let x = 0; x < 16; x++) if ((x - 7.5) ** 2 / 60 + (y - 8) ** 2 / 14 <= 1) p.set(x, y, '#f4f4f0');
    for (let i = 0; i < 18; i++) { const a = i * 0.9, r = 1 + i * 0.32; p.set(Math.round(7.5 + Math.cos(a) * r * 1.4), Math.round(6 + Math.sin(a) * r * 0.6), i % 3 ? '#d8a050' : '#b87830'); }
    for (const [x, y] of [[5, 4], [9, 5], [7, 7], [11, 6], [4, 6]]) p.set(x, y, '#ffffff');
    return finish(p);
  }
  function rockTray() {
    const p = new Pix(26, 10);
    p.rect(0, 5, 20, 5, '#8a8a94'); p.hline(0, 19, 5, '#b8b8c0');
    for (const [x, c] of [[2, '#9a9aa0'], [8, '#8a8890'], [14, '#a8a49a']]) { p.rect(x, 3, 4, 3, c); p.hline(x, x + 3, 3, '#c8c8d0'); }
    for (const [x, ch] of [[3, '#f4f2ec'], [9, '#f4f2ec'], [15, '#f4f2ec']]) p.set(x + 1, 8, ch);
    p.rect(21, 3, 4, 7, '#a86a30'); p.rect(22, 0, 2, 3, '#3a3a40'); p.set(22, 5, '#f4f2ec');
    return finish(p);
  }

  // ================================================================ MIKEY'S NOTE
  // Recreated from the real note Mikey gave Lily after she said no: page 1 is
  // the letter (torn out of a spiral notebook, misspellings, scribbles and all,
  // with a crying self-portrait and a heart turning into a broken heart);
  // page 2 is his pencil drawing of her on loose-leaf. Full-screen pages.
  function mikeyNotePages() {
    const px = (x, X, Y, c, w = 1, h = 1) => { x.fillStyle = c; x.fillRect(Math.round(X), Math.round(Y), w, h); };
    const line = (x, x0, y0, x1, y1, c) => { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1; for (let i = 0; i <= n; i++) px(x, x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n, c); };
    const ring = (x, cx, cy, rx, ry, c, a0 = 0, a1 = Math.PI * 2) => { for (let a = a0; a <= a1; a += 0.08) px(x, cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, c); };
    const heart = (x, cx, cy, r, c, fill) => {
      for (let y = -r; y <= r * 1.3; y++) for (let X = -r * 1.3; X <= r * 1.3; X++) {
        const u = X / r, v = -y / r, k = (u * u + v * v - 1) ** 3 - u * u * v * v * v;
        if (fill ? k <= 0 : k <= 0 && k > -0.12) px(x, cx + X, cy + y, c);
      }
    };
    const INK = '#1c1c2c';
    // ---- page 1: the letter
    const c1 = G.canvas(240, 160), a = c1.getContext('2d');
    px(a, 0, 0, '#1c1424', 240, 160);
    const L = 30, T = 3, W = 184, H = 154;
    px(a, L, T, '#f4f2ec', W, H);
    for (let y = T + 12; y < T + H - 2; y += 9) px(a, L + 3, y, '#c8ccd8', W - 5, 1);
    // ragged edge where it tore off the spiral, with little tabs hanging on
    for (let y = T; y < T + H; y += 3) px(a, L, y, '#1c1424', 1 + Math.floor(G.hash(y, 1, 77) * 3), 3);
    for (let y = T + 8; y < T + H - 4; y += 15) px(a, L - 3, y, '#f4f2ec', 4, 4);
    // fold creases
    px(a, L + (W >> 1), T, 'rgba(0,0,0,0.07)', 1, H); px(a, L, T + 52, 'rgba(0,0,0,0.07)', W, 1); px(a, L, T + 104, 'rgba(0,0,0,0.07)', W, 1);
    px(a, L + W - 1, T, '#d8d4c8', 1, H); px(a, L, T + H - 1, '#d8d4c8', W, 1);
    // the handwriting: word by word, a little wobbly; {x:n} is a scribbled-out word
    const LINES = [
      [14, 'Dear', 'Lily,', 'I', 'love', 'you', 'so', 'much.'],
      [4, 'I', 'know', 'you', "don't", 'like', 'me.'],
      [4, 'And', 'it', 'broke', 'my', { x: 'heart' }],
      [4, 'when', '(you', 'know', 'what)', 'happened.'],
      [4, 'And', "I'm", 'sorry,', 'because', 'I'],
      [4, 'feel', 'like', 'I', 'made', 'you', 'emmbar-'],
      [4, 'essed', 'and', { x: 16 }, "I'm", 'very'],
      [4, 'sorry.'],
      [4, 'And', 'if', 'you', { x: 20 }, "don't", 'like', 'me'],
      [4, 'than', 'R.I.P', 'Me.', 'Sorry.'],
    ];
    const scribble = (X, Y, w) => { for (let i = 0; i < w; i += 1) { const h = (i * 7) % 5; line(a, X + i, Y + 1 + h % 3, X + i + 1, Y + 6 - h % 4, INK); } };
    LINES.forEach(([indent, ...words], i) => {
      let X = L + 6 + indent;
      const Y = T + 5 + i * 9;
      words.forEach((wd, j) => {
        const wob = Math.round(G.hash(i, j, 33) * 2) - 1;
        if (typeof wd === 'object') {
          if (typeof wd.x === 'string') { G.font.draw(a, wd.x, X, Y + wob, INK); scribble(X - 1, Y + wob, G.font.width(wd.x) + 2); X += G.font.width(wd.x) + 5; }
          else { scribble(X, Y + wob, wd.x); X += wd.x + 4; }
          return;
        }
        G.font.draw(a, wd, X, Y + wob, INK);
        // a little heart dotting the i in "Lily"
        if (wd === 'Lily,') { const ix = X + G.font.width('L') + 1; px(a, ix - 1, Y + wob, '#f4f2ec', 3, 2); heart(a, ix, Y + wob - 1, 2, '#c83050', true); }
        X += G.font.width(wd) + 4;
      });
    });
    // the doodles: a crying Mikey with scribbly hair, a heart, "to", a broken heart
    const fy = T + 99;
    ring(a, L + 46, fy + 12, 9, 10, INK);
    for (let i = 0; i < 26; i++) line(a, L + 37 + (i % 13) * 1.5, fy + 1 + (i % 3), L + 38 + (i % 13) * 1.5, fy + 7 - (i % 4), INK);
    for (const ex of [L + 42, L + 50]) { px(a, ex - 1, fy + 10, INK, 3, 3); px(a, ex - 1, fy + 10, '#f4f2ec'); px(a, ex, fy + 13, '#5a7ab0', 1, 5); }
    ring(a, L + 46, fy + 21, 3, 2, INK, Math.PI * 1.15, Math.PI * 1.85);
    for (const [dx, dy] of [[-4, 25], [2, 29], [-1, 35]]) { px(a, L + 46 + dx, fy + dy, '#5a7ab0', 1, 2); px(a, L + 46 + dx - 1, fy + dy + 2, '#5a7ab0', 3, 2); }
    ring(a, L + 46, fy + 44, 10, 3, INK);
    heart(a, L + 76, fy + 12, 7, INK, false);
    G.font.draw(a, 'to', L + 90, fy + 9, INK);
    // the broken heart: split down a jagged crack, a tiny sad face across the halves
    heart(a, L + 120, fy + 12, 9, INK, false);
    for (let y = fy + 2; y < fy + 24; y++) { const z = L + 120 + (((y - fy) >> 2) % 2 ? 2 : -1); px(a, z, y, '#f4f2ec', 2, 1); px(a, z - 1, y, INK); px(a, z + 2, y, INK); }
    px(a, L + 114, fy + 10, INK); px(a, L + 126, fy + 10, INK); px(a, L + 114, fy + 12, '#5a7ab0', 1, 3);
    ring(a, L + 120, fy + 18, 4, 2, INK, Math.PI * 1.15, Math.PI * 1.85);
    // ---- page 2: his drawing of her
    const c2 = G.canvas(240, 160), b = c2.getContext('2d');
    px(b, 0, 0, '#1c1424', 240, 160);
    const L2 = 34, W2 = 172;
    px(b, L2, 2, '#f8f8f4', W2, 156);
    for (let y = 18; y < 158; y += 8) px(b, L2 + 1, y, '#b4cce4', W2 - 2, 1);
    px(b, L2 + 20, 2, '#e09090', 1, 156);
    for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) if ((x - 3) ** 2 + (y - 3) ** 2 <= 9) px(b, L2 + 6 + x, 20 + y, '#1c1424');
    px(b, L2 + (W2 >> 1), 2, 'rgba(0,0,0,0.06)', 1, 156); px(b, L2, 60, 'rgba(0,0,0,0.06)', W2, 1);
    const G1 = '#3e3e46', G2 = '#6a6a72', G3 = '#9a9aa2', cx = 120;
    G.font.draw(b, 'Lily', cx - 8, 10, G2);
    // hair: diagonal pencil strokes on top, flowing down into long strands past her shoulders
    for (let y = 30; y < 64; y++) for (let x = cx - 30; x <= cx + 30; x++) {
      if (((x - cx) / 29) ** 2 + ((y - 57) / 27) ** 2 > 1) continue;
      const d = (((x - y) % 3) + 3) % 3;
      if (d === 0) px(b, x, y, y < 44 ? G1 : G2);
      else if (d === 1 && y < 40) px(b, x, y, G2);
    }
    ring(b, cx, 57, 29, 27, G1, Math.PI * 1.08, Math.PI * 1.92);
    for (const side of [-1, 1]) for (let k = 0; k < 6; k++) {
      const x0 = cx + side * (29 - k * 2.5), bottom = 132 - k * 7 + (k % 2) * 5;
      for (let y = 50; y < bottom; y++) {
        const t = (y - 50) / (bottom - 50), x = x0 + side * (Math.round(Math.sin(y / 10 + k * 1.3) * 2) + t * 6);
        px(b, x, y, k % 2 ? G2 : G1, t > 0.85 ? 1 : 2, 1);
      }
    }
    // face: jaw down to a pointed chin
    line(b, cx - 20, 82, cx - 12, 98, G2); line(b, cx - 12, 98, cx, 106, G2); line(b, cx, 106, cx + 12, 98, G2); line(b, cx + 12, 98, cx + 20, 82, G2);
    // bangs, falling to just above her eyes
    for (let i = 0; i < 9; i++) {
      const bx = cx - 24 + i * 6, len = 18 + ((i * 5) % 3) * 3;
      for (let y = 0; y < len; y++) { const w = Math.max(1, Math.round(4 * (1 - y / len))); px(b, bx - (w >> 1) + (y >> 3) * (i < 4 ? -1 : 1), 52 + y, i % 3 ? G1 : G2, w, 1); }
    }
    // big eyes: a heavy upper lash, dark irises, two highlights
    for (const ex of [cx - 12, cx + 12]) {
      px(b, ex - 5, 76, G1, 11, 2); px(b, ex + (ex < cx ? -7 : 6), 75, G1, 2, 1);
      px(b, ex - 3, 78, G1, 7, 7); px(b, ex - 2, 83, G2, 5, 2); px(b, ex - 2, 79, '#f8f8f4', 2, 2); px(b, ex + 2, 83, '#f8f8f4');
      px(b, ex - 3, 86, G3, 7, 1);
    }
    // blush (little hatch marks), freckles, a tiny nose and a small smile
    for (const bx of [cx - 18, cx + 12]) { for (let i = 0; i < 4; i++) line(b, bx + i * 2, 93, bx + i * 2 + 1, 91, G3); for (const [fx, fy2] of [[1, 89], [4, 90], [6, 88]]) px(b, bx + fx, fy2, G2); }
    px(b, cx, 91, G3); px(b, cx + 1, 92, G3);
    px(b, cx - 3, 97, G2); px(b, cx - 2, 98, G2, 4, 1); px(b, cx + 2, 97, G2);
    return [c1, c2];
  }
  // the key item: a little square of folded notebook paper
  function noteIcon() {
    const p = new Pix(14, 14);
    p.rect(1, 2, 12, 10, '#f4f2ec'); p.vline(7, 2, 11, '#d0ccc0'); p.hline(1, 12, 7, '#d0ccc0');
    for (const y of [4, 9]) p.hline(2, 12, y, '#b8c4d8');
    p.set(3, 4, '#c83050'); p.set(5, 4, '#c83050'); p.hline(3, 5, 5, '#c83050'); p.set(4, 6, '#c83050');
    for (let y = 2; y < 12; y += 2) p.set(1, y, '#c8c4b8');
    return finish(p);
  }

  // ================================================================ THE CHESAPEAKE BAY BRIDGE-TUNNEL
  // A highway light, its arm reaching out over the road (gulls sit on these).
  // Drawn with the arm pointing right; the left-pointing one is the mirror.
  function lampPost() {
    const p = new Pix(30, 60), g = '#9aa0a8', gD = '#6a7078', gL = '#c8ccd2';
    p.rect(2, 8, 3, 50, g); p.vline(2, 8, 57, gL); p.vline(4, 8, 57, gD);
    p.rect(1, 56, 5, 4, gD); p.hline(1, 5, 56, g);
    for (let i = 0; i <= 18; i++) { const x = 3 + i, y = i < 5 ? 8 - i : 3; p.set(x, y, g); p.set(x, y + 1, gD); }
    p.rect(18, 1, 10, 4, '#7a8088'); p.hline(18, 27, 1, '#9aa0a8'); p.hline(19, 26, 5, '#fff4c8'); p.hline(20, 25, 6, '#f8e098');
    return finish(p);
  }
  // Seagulls: a herring gull (white head, yellow bill) and a laughing gull
  // (black head, red bill). Poses: sitting, wings up, wings down.
  function gullFrame(laughing, pose) {
    const p = new Pix(16, 12);
    const wing = laughing ? '#5a6270' : '#a8b0bc', head = laughing ? '#1c1c22' : '#f8f8f8', beak = laughing ? '#a02828' : '#f0c838', legs = laughing ? '#802020' : '#e8a090';
    if (pose === 'sit') {
      p.rect(4, 5, 8, 5, '#f8f8f8'); p.rect(5, 4, 7, 3, wing); p.rect(11, 5, 3, 2, '#202024');
      p.rect(2, 2, 4, 4, head); p.set(3, 3, laughing ? '#f8f8f8' : '#101010');
      p.set(1, 4, beak); p.set(0, 4, beak); if (!laughing) p.set(1, 5, '#d03030');
      p.set(6, 10, legs); p.set(9, 10, legs); p.set(6, 11, legs); p.set(9, 11, legs);
    } else {
      const up = pose === 'up';
      p.rect(5, 6, 6, 3, '#f8f8f8'); p.rect(3, 5, 3, 3, head); p.set(2, 6, beak); p.set(1, 6, beak);
      for (let i = 0; i < 6; i++) {
        const y = up ? 6 - i : 6 + Math.floor(i / 2);
        p.set(6 - i, y, i > 3 ? '#202024' : wing); p.set(9 + i, y, i > 3 ? '#202024' : wing);
        p.set(7 - i, y, wing); p.set(8 + i, y, wing);
      }
      p.set(11, 7, '#d8d8e0'); p.set(12, 7, '#202024');
    }
    return finish(p);
  }
  // The ventilation building over the tunnel portal: louvered concrete with
  // the road diving into the dark under a green sign.
  function tunnelPortal(label) {
    const W = 192, H = 100, p = new Pix(W, H);
    p.rect(0, 0, W, 22, '#9aa0a8'); p.hline(0, W - 1, 0, '#c0c4ca'); p.hline(0, W - 1, 21, '#7a8088');
    for (const cx of [36, 156]) for (let y = 4; y < 18; y++) for (let x = cx - 8; x <= cx + 8; x++) if ((x - cx) ** 2 + (y - 11) ** 2 <= 49) p.set(x, y, (x + y) % 3 ? '#5a6068' : '#3a4048');
    p.rect(0, 22, W, H - 22, '#cfcabe');
    for (let y = 28; y < 92; y += 4) { p.hline(8, 54, y, '#8a8a90'); p.hline(8, 54, y + 1, '#a8a8ae'); p.hline(137, 183, y, '#8a8a90'); p.hline(137, 183, y + 1, '#a8a8ae'); }
    for (const x of [6, 56, 135, 185]) p.rect(x, 22, 2, H - 22, '#b0aca0');
    // the tunnel mouth
    p.rect(60, 52, 72, H - 52, '#a8a49a'); p.hline(60, 131, 52, '#e0dcd0');
    for (let y = 56; y < H; y++) { const k = Math.min(1, (y - 56) / 20); for (let x = 64; x < 128; x++) p.set(x, y, k < 0.5 ? '#2a2630' : '#14121a'); }
    for (const [x, y] of [[80, 66], [111, 66], [86, 74], [105, 74], [92, 80], [99, 80]]) { p.set(x, y, '#f8a040'); p.set(x + 1, y, '#c87828'); }
    p.vline(96, 86, 99, '#c8a030');
    p.outline();
    const c = p.canvas(), x = c.getContext('2d');
    const text = label || 'CHESAPEAKE CHANNEL TUNNEL', tw = G.font.width(text), sw = tw + 10, sx = Math.round((W - sw) / 2);
    x.fillStyle = OUT; x.fillRect(sx - 1, 33, sw + 2, 15);
    x.fillStyle = '#ffffff'; x.fillRect(sx, 34, sw, 13);
    x.fillStyle = '#1e6a3a'; x.fillRect(sx + 1, 35, sw - 2, 11);
    G.font.draw(x, text, sx + 5, 37, '#ffffff');
    return c;
  }
  // a container ship headed for the channel
  function containerShip() {
    const p = new Pix(170, 40);
    for (let x = 0; x < 170; x++) { const top = x < 14 ? 22 + Math.round((14 - x) * 0.4) : 22; p.vline(x, top, 36, x < 10 ? '#7a1c1c' : '#8a2424'); p.set(x, 36, '#3a0c0c'); }
    p.hline(6, 169, 22, '#c8c8d0');
    const cols = ['#d84838', '#3a78c8', '#e8a830', '#3a9a5a', '#8a5ab8', '#d8d8d8'];
    for (let b = 0; b < 9; b++) for (let k = 0; k < 2 + (b % 3 === 1 ? 1 : 0); k++) { const x = 20 + b * 14, y = 16 - k * 6; p.rect(x, y, 13, 6, cols[(b * 3 + k) % cols.length]); p.hline(x, x + 12, y, '#f8f8f8'); }
    p.rect(150, 4, 14, 18, '#f0f0f0'); p.hline(150, 163, 7, '#3a4a5a'); p.hline(150, 163, 11, '#3a4a5a'); p.rect(156, 0, 3, 4, '#3a3a40');
    return finish(p);
  }
  // a little fishing boat (small enough to slip under the trestle, unlike the ships)
  function fishingBoat() {
    const p = new Pix(38, 18);
    p.rect(2, 10, 32, 5, '#f0f0ec'); p.hline(2, 33, 12, '#2a5aa8'); p.hline(3, 33, 14, '#8a2424');
    p.rect(34, 9, 1, 4, '#f0f0ec'); p.rect(35, 8, 1, 3, '#f0f0ec'); p.set(36, 8, '#f0f0ec');
    p.rect(6, 4, 11, 6, '#e8e8e4'); p.hline(5, 17, 3, '#c83838'); p.rect(8, 6, 2, 2, '#2a3a4a'); p.rect(12, 6, 3, 2, '#2a3a4a');
    p.vline(21, 0, 9, '#5a5a60'); p.hline(21, 28, 2, '#5a5a60'); p.vline(28, 3, 9, '#8a8a90');
    return finish(p);
  }
  // a brown pelican on the rocks
  function pelican() {
    const p = new Pix(16, 16);
    p.rect(4, 7, 9, 6, '#7a6a5a'); p.rect(5, 8, 7, 3, '#9a8a78'); p.rect(11, 9, 3, 3, '#5a4a3e');
    p.rect(3, 2, 3, 6, '#f0e8d0'); p.rect(3, 1, 3, 3, '#f8e8a0');
    p.hline(0, 3, 3, '#c8a868'); p.hline(0, 3, 4, '#a88848'); p.rect(0, 5, 3, 2, '#8a7058');
    p.set(4, 2, '#101010'); p.set(6, 13, '#3a3a40'); p.set(9, 13, '#3a3a40');
    return finish(p);
  }
  // a coin-op viewer for looking out over the bay
  function bayViewer() {
    const p = new Pix(14, 26);
    p.rect(6, 10, 2, 14, '#3a6a4a'); p.rect(3, 23, 8, 3, '#2a4a36');
    p.rect(1, 2, 12, 9, '#4a8a5a'); p.hline(1, 12, 2, '#6aaa7a'); p.rect(2, 4, 3, 3, '#1c1c24'); p.rect(9, 4, 3, 3, '#1c1c24');
    p.set(3, 5, '#88c8e8'); p.set(10, 5, '#88c8e8'); p.rect(5, 8, 4, 2, '#d8b040');
    return finish(p);
  }
  // an amber light fixture on the tunnel wall, and a green tunnel sign
  function tunnelLight() {
    const p = new Pix(8, 6);
    p.rect(0, 0, 8, 6, '#4a4a54'); p.rect(1, 1, 6, 4, '#f8b040'); p.hline(1, 6, 1, '#fff0c0');
    return finish(p);
  }
  function tunnelSign() {
    const p = new Pix(24, 12);
    p.rect(0, 0, 24, 12, '#ffffff'); p.rect(1, 1, 22, 10, '#1e6a3a');
    for (const [x, y, w] of [[3, 3, 12], [3, 6, 18], [17, 3, 4]]) p.hline(x, x + w - 1, y, '#e8f0e8');
    p.outline();
    return p.canvas();
  }

  // ---- the old fisherman's surf rod: an inventory icon, the rod in his hands,
  // a red-and-white lure and a bobber
  function rodIcon() {
    const p = new Pix(16, 16);
    for (let i = 0; i < 14; i++) p.set(1 + i, 14 - i, i < 4 ? '#2a2a30' : '#3a5a8a');
    for (let i = 4; i < 14; i += 3) p.set(2 + i, 14 - i, '#c8c8d0');
    p.rect(3, 9, 3, 3, '#8a8a94'); p.set(4, 10, '#d8d8e0'); p.set(6, 10, '#2a2a30');
    p.set(15, 1, '#e83030'); p.set(15, 2, '#f8f8f8'); p.vline(15, 3, 6, '#e8e8f0');
    return finish(p);
  }
  function rodHeld() {
    const p = new Pix(22, 24);
    for (let i = 0; i < 22; i++) p.set(i, 23 - i, i < 5 ? '#2a2a30' : '#3a5a8a');
    p.rect(3, 17, 3, 3, '#8a8a94'); p.set(4, 18, '#d8d8e0');
    return finish(p);
  }
  function lure() {
    const p = new Pix(6, 6);
    p.rect(1, 1, 4, 2, '#e83030'); p.rect(1, 3, 4, 2, '#f8f8f8'); p.set(5, 4, '#c8c8d0'); p.set(0, 2, '#101010');
    return finish(p);
  }
  // an old brass gate key with a paper tag
  function gateKey() {
    const p = new Pix(16, 14);
    for (let y = 1; y < 8; y++) for (let x = 1; x < 8; x++) if ((x - 4) ** 2 + (y - 4) ** 2 <= 9 && (x - 4) ** 2 + (y - 4) ** 2 > 2) p.set(x, y, '#d8b040');
    p.set(3, 2, '#f8e088'); p.hline(7, 14, 4, '#d8b040'); p.hline(7, 14, 5, '#a88828');
    p.vline(12, 6, 8, '#d8b040'); p.vline(14, 6, 9, '#d8b040');
    p.rect(2, 9, 6, 4, '#f4ecd8'); p.hline(3, 6, 10, '#c83030'); p.set(5, 8, '#8a8a94');
    return finish(p);
  }
  function bobber() {
    const p = new Pix(5, 6);
    p.rect(1, 0, 3, 3, '#e83030'); p.rect(1, 3, 3, 2, '#f8f8f8'); p.set(2, 5, '#2a2a30');
    return finish(p);
  }

  // ---- Tyler's fight: a mosasaur skull bursting up out of the road (jaws open,
  // then snapped shut), a pebble of sifted gravel, and his sifting screen
  function mosasaurSkull(open) {
    const W = 32, H = 36, p = new Pix(W, H), bone = '#e8e0c8', boneD = '#b8ac90', tooth = '#fffaf0', dark = '#3a2a24';
    // the back of the skull, down in the water
    for (let y = 24; y < H; y++) for (let x = 6; x < 26; x++) if ((x - 15.5) ** 2 / 100 + (y - 32) ** 2 / 64 <= 1) p.set(x, y, y > 30 ? boneD : bone);
    p.rect(9, 27, 3, 3, dark); p.rect(20, 27, 3, 3, dark);
    if (open) {
      // two long jaws flaring up into a V, lined with conical teeth
      for (let i = 0; i < 24; i++) {
        const y = 26 - i, lx = 12 - Math.round(i * 0.42), rx = 19 + Math.round(i * 0.42);
        p.hline(lx - 2, lx + 1, y, i % 5 === 0 ? boneD : bone); p.hline(rx - 1, rx + 2, y, i % 5 === 0 ? boneD : bone);
        if (i % 3 === 1) { p.set(lx + 2, y, tooth); p.set(lx + 3, y - 1, tooth); p.set(rx - 2, y, tooth); p.set(rx - 3, y - 1, tooth); }
      }
      for (let y = 6; y < 26; y++) for (let x = 13; x < 19; x++) if (p.d[y * W + x] == null && Math.abs(x - 15.5) < (26 - y) * 0.42 + 1) p.set(x, y, '#5a1c1c');
    } else {
      // snapped shut: one long narrow snout, the teeth interlocked down the middle
      for (let y = 2; y < 27; y++) { const half = 2 + Math.round((y - 2) * 0.18); p.hline(15 - half, 16 + half, y, y % 6 === 0 ? boneD : bone); }
      for (let y = 6; y < 26; y += 2) { p.set(15, y, tooth); p.set(16, y + 1, tooth); }
      p.vline(15, 3, 26, boneD);
    }
    return finish(p);
  }
  function pebble() {
    const p = new Pix(7, 6);
    p.rect(1, 1, 5, 4, '#8a8c90'); p.hline(1, 5, 1, '#c0c0c8'); p.hline(2, 5, 4, '#5a5a64'); p.set(4, 2, '#b8624e');
    return finish(p);
  }
  function sifter() {
    const p = new Pix(18, 10);
    p.rect(0, 0, 18, 10, '#9a7444'); p.rect(2, 2, 14, 6, '#5a5a62');
    for (let x = 2; x < 16; x += 2) p.vline(x, 2, 7, '#8a8a94');
    for (let y = 2; y < 8; y += 2) p.hline(2, 15, y, '#8a8a94');
    p.set(6, 4, '#f8f8f0'); p.set(11, 5, '#3a3a40'); p.set(9, 3, '#b8624e');
    return finish(p);
  }

  // ---- the deep stope: the DO NOT OPEN (LILY) box, an ore cart, timbers, lanterns
  function fcCrate(open) {
    const p = new Pix(20, 17);
    p.rect(1, 4, 18, 13, '#c8a070'); p.vline(18, 4, 16, '#a07a48'); p.hline(1, 18, 16, '#a07a48');
    if (open) {
      p.rect(2, 4, 16, 3, '#2a1c14');
      p.rect(0, 1, 4, 4, '#e0c090'); p.rect(16, 1, 4, 4, '#e0c090'); p.hline(5, 14, 3, '#d8b480');
    } else {
      p.rect(1, 2, 18, 3, '#e0c090'); p.vline(10, 2, 8, '#b8b0a0'); p.hline(1, 18, 2, '#f0d8a8');
    }
    // marker scrawl on the side: CHRISTMAS / DO NOT OPEN (LILY)
    for (const [x, w] of [[3, 6], [10, 5]]) p.hline(x, x + w - 1, 9, '#c83030');
    for (const [x, w] of [[3, 3], [7, 4], [12, 5]]) p.hline(x, x + w - 1, 12, '#c83030');
    p.set(3, 13, '#c83030'); p.set(16, 13, '#c83030');
    return finish(p);
  }
  function mineCart() {
    const p = new Pix(24, 16);
    p.rect(2, 3, 20, 9, '#6a4a3a'); p.hline(1, 22, 2, '#8a6a52'); p.hline(1, 22, 3, '#4a3428'); p.hline(2, 21, 11, '#3e2a20');
    for (const x of [4, 9, 14, 19]) { p.set(x, 5, '#a8886a'); p.set(x, 9, '#a8886a'); }
    for (const [x, y, c] of [[5, 1, '#8a8c90'], [8, 0, '#a8302a'], [12, 1, '#6e7074'], [16, 0, '#8a5a54'], [19, 1, '#8a8c90']]) { p.rect(x, y, 3, 2, c); }
    for (const x of [5, 16]) { p.rect(x, 11, 4, 4, '#1c1614'); p.set(x + 1, 12, '#5a5a62'); }
    return finish(p);
  }
  function timberSet() {
    const p = new Pix(34, 30), wd = '#7a5a34', wl = '#9a7444', wk = '#5a3e22';
    for (const x of [1, 29]) { p.rect(x, 3, 4, 27, wd); p.vline(x, 3, 29, wl); p.vline(x + 3, 3, 29, wk); for (let y = 7; y < 29; y += 6) p.set(x + 1, y, wk); }
    p.rect(0, 0, 34, 4, wd); p.hline(0, 33, 0, wl); p.hline(0, 33, 3, wk);
    p.set(8, 1, wk); p.set(20, 2, wk);
    return finish(p);
  }
  function mineLantern() {
    const p = new Pix(7, 11);
    p.hline(2, 4, 0, '#3a3a40'); p.set(1, 1, '#3a3a40'); p.set(5, 1, '#3a3a40');
    p.rect(1, 2, 5, 2, '#2a2a30'); p.rect(1, 4, 5, 5, '#f8d878'); p.vline(1, 4, 8, '#3a3a40'); p.vline(5, 4, 8, '#3a3a40'); p.set(3, 5, '#ffffff');
    p.rect(1, 9, 5, 2, '#2a2a30');
    return p.canvas();
  }

  // ================================================================ FATHER CHRISTMAS (postgame)
  // The original Christmas doll: a tall peach cloth body (he came from the thrift
  // store with no clothes), long floppy arms, a wild cream wool hood and beard
  // around a tiny face with black bead eyes. Frames: arms down / arms up; rage
  // eyes; and (after) Michelle's red sweater.
  function fatherChristmas(armsUp, rage, sweater) {
    const W = 30, H = 42, p = new Pix(W, H);
    const wool = '#ece4d0', woolD = '#cfc3a6', woolL = '#fbf7ec', skin = '#e8b898', skinD = '#c89878';
    // the cloth body and stubby legs
    p.rect(9, 22, 12, 13, skin); p.vline(20, 22, 34, skinD); p.vline(15, 26, 33, skinD);
    p.rect(10, 35, 4, 6, skin); p.rect(16, 35, 4, 6, skin); p.vline(13, 35, 40, skinD); p.vline(19, 35, 40, skinD);
    if (sweater) {
      p.rect(8, 22, 14, 13, '#c83030'); p.hline(8, 21, 34, '#a02020'); p.hline(8, 21, 23, '#e85050');
      for (const [x, y] of [[11, 27], [15, 29], [19, 27], [13, 31], [17, 32]]) { p.set(x, y, '#f8f8f0'); p.set(x - 1, y, '#f8d8d8'); p.set(x + 1, y, '#f8d8d8'); }
    }
    // long floppy arms
    const arm = sweater ? '#c83030' : skin;
    if (armsUp) { p.rect(3, 8, 4, 16, arm); p.rect(23, 8, 4, 16, arm); p.rect(3, 6, 4, 3, skin); p.rect(23, 6, 4, 3, skin); }
    else { p.rect(4, 22, 4, 12, arm); p.rect(22, 22, 4, 12, arm); p.rect(4, 33, 4, 3, skin); p.rect(22, 33, 4, 3, skin); p.vline(7, 22, 35, skinD); p.vline(25, 22, 35, skinD); }
    // the wool hood and beard: a big shaggy mane down to the chest
    for (let y = 0; y < 30; y++) for (let x = 0; x < W; x++) {
      const top = (x - 14.5) ** 2 / 100 + (y - 11) ** 2 / 121 <= 1;
      const beard = y >= 12 && Math.abs(x - 14.5) <= 9 - (y - 12) * 0.35;
      if (top || beard) p.set(x, y, G.hash(x, y, 71) < 0.18 ? woolL : (x + y) % 5 === 0 ? woolD : wool);
    }
    // the little face peeking out of the wool: black bead eyes, a pointy nose
    for (let y = 5; y < 13; y++) for (let x = 9; x < 21; x++) if ((x - 14.5) ** 2 / 26 + (y - 8.5) ** 2 / 13 <= 1) p.set(x, y, '#ecb894');
    p.hline(11, 18, 5, '#d8a080');
    const eye = rage ? '#ff2020' : '#100c0c';
    for (const ex of [12, 17]) { p.set(ex, 8, eye); p.set(ex, 9, eye); p.set(ex - (ex < 14 ? 0 : 0), 7, rage ? '#ff9090' : '#ecb894'); }
    if (!rage) { p.set(12, 8, '#f8f8f8'); p.set(17, 8, '#f8f8f8'); p.set(12, 9, eye); p.set(17, 9, eye); p.set(13, 9, eye); p.set(16, 9, eye); }
    p.set(14, 9, '#d08868'); p.set(15, 9, '#d08868'); p.set(14, 10, '#c07858'); p.set(15, 10, '#e0a080');
    // the wool mustache sweeping out over the beard
    p.hline(11, 18, 11, woolL); p.hline(9, 20, 12, wool); p.set(10, 11, wool); p.set(19, 11, wool);
    return finish(p);
  }
  function ornament(col) {
    const p = new Pix(8, 9);
    for (let y = 2; y < 9; y++) for (let x = 0; x < 8; x++) if ((x - 3.5) ** 2 + (y - 5.5) ** 2 <= 11) p.set(x, y, col);
    p.rect(3, 0, 2, 2, '#d8b050'); p.set(2, 4, '#ffffff');
    return finish(p);
  }
  function candyCane() {
    const p = new Pix(7, 10);
    for (let y = 3; y < 10; y++) p.set(5, y, y % 2 ? '#e83030' : '#ffffff');
    p.set(4, 2, '#ffffff'); p.set(3, 1, '#e83030'); p.set(2, 1, '#ffffff'); p.set(1, 2, '#e83030'); p.set(1, 3, '#ffffff');
    return finish(p);
  }
  function giftBomb() {
    const p = new Pix(10, 10);
    p.rect(1, 2, 8, 8, '#2e7a3e'); p.vline(5, 2, 9, '#f8d040'); p.hline(1, 8, 5, '#f8d040'); p.set(4, 1, '#f8d040'); p.set(6, 1, '#f8d040'); p.set(3, 0, '#f8d040'); p.set(7, 0, '#f8d040');
    return finish(p);
  }

  // ================================================================ THE FROZEN POND (Ice JJ Fish)
  // Snow piled on every branch of a pine (white on each top edge).
  function snowCap(src) {
    const c = G.canvas(src.width, src.height), x = c.getContext('2d');
    x.drawImage(src, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height), px = d.data, W = c.width;
    const solid = (i, j) => j >= 0 && px[(j * W + i) * 4 + 3] > 0;
    for (let j = c.height - 1; j >= 0; j--) for (let i = 0; i < W; i++) {
      if (!solid(i, j) || solid(i, j - 1) || G.hash(i, j, 41) < 0.15) continue;
      for (let k = 0; k < 2; k++) {
        if (!solid(i, j + k)) break;
        const o = ((j + k) * W + i) * 4;
        px[o] = k ? 214 : 244; px[o + 1] = k ? 226 : 248; px[o + 2] = k ? 240 : 252;
      }
    }
    x.putImageData(d, 0, 0);
    return c;
  }
  function micSprite() {
    const p = new Pix(5, 8);
    p.rect(1, 0, 3, 3, '#c8c8d0'); p.set(2, 1, '#8a8a94'); p.set(1, 0, '#f0f0f4');
    p.rect(2, 3, 1, 5, '#1c1c22');
    return finish(p);
  }
  function snowflake() {
    const p = new Pix(7, 7), c = '#d8f4ff';
    p.vline(3, 0, 6, c); p.hline(0, 6, 3, c); p.set(1, 1, c); p.set(5, 1, c); p.set(1, 5, c); p.set(5, 5, c); p.set(3, 3, '#ffffff');
    return finish(p);
  }
  function icicle() {
    const p = new Pix(6, 14);
    for (let y = 0; y < 14; y++) { const w = Math.max(1, 3 - Math.floor(y / 5)); p.hline(3 - w, 2 + w, y, y % 4 ? '#bce8fc' : '#e8f8ff'); }
    p.vline(2, 0, 9, '#ffffff');
    return finish(p);
  }
  function snowman() {
    const p = new Pix(18, 26);
    for (const [cx, cy, r] of [[9, 19, 6.5], [9, 9, 4.5]]) for (let y = 0; y < 26; y++) for (let x = 0; x < 18; x++) if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) p.set(x, y, x > cx + 2 ? '#d4deec' : '#f4f8fc');
    p.rect(5, 1, 8, 4, '#1c1c22'); p.hline(3, 14, 5, '#1c1c22');
    p.hline(5, 12, 8, '#1c1c22'); p.set(7, 9, '#1c1c22'); p.set(11, 9, '#1c1c22'); p.hline(8, 10, 9, '#1c1c22');
    p.set(9, 11, '#f08030'); p.set(10, 11, '#f08030');
    p.hline(5, 13, 14, '#c83030'); p.set(12, 15, '#c83030'); p.set(12, 16, '#c83030');
    p.set(9, 18, '#1c1c22'); p.set(9, 21, '#1c1c22');
    return finish(p);
  }

  // ================================================================ MOM'S MISSING BOOKS (quest items)
  // A book page with a bite out of the corner.
  function chewedPage() {
    const p = new Pix(11, 13);
    p.rect(0, 0, 11, 13, '#f4ecd8');
    for (let y = 2; y < 12; y += 2) p.hline(1, 8, y, '#b8ac98');
    for (const [x, y] of [[8, 0], [9, 0], [10, 0], [9, 1], [10, 1], [10, 2], [7, 0]]) p.d[y * p.w + x] = null; // the bite
    p.set(8, 1, '#c8bca4'); p.set(9, 2, '#c8bca4');
    p.set(2, 10, '#9ac878'); p.set(3, 11, '#9ac878');
    return finish(p);
  }
  // "Being a Wonderful Pastor's Wife": pastel pink, a white heart, gold lettering.
  function pastorBook() {
    const p = new Pix(12, 15);
    p.rect(0, 0, 12, 15, '#e8a0b8'); p.vline(0, 0, 14, '#c87898'); p.hline(0, 11, 14, '#c87898');
    p.hline(3, 9, 2, '#e8c060'); p.hline(3, 8, 4, '#e8c060');
    for (const [x, y] of [[4, 8], [5, 7], [7, 7], [8, 8], [6, 8], [5, 9], [6, 10], [7, 9], [4, 7], [8, 7]]) p.set(x, y, '#ffffff');
    p.hline(3, 9, 12, '#e8c060');
    return finish(p);
  }
  // Dad's keyring: a ring, a few keys, one rusty.
  function keyring() {
    const p = new Pix(14, 12);
    for (let a = 0; a < 16; a++) p.set(4 + Math.round(Math.cos(a / 16 * Math.PI * 2) * 3), 4 + Math.round(Math.sin(a / 16 * Math.PI * 2) * 3), '#c8c8d0');
    p.rect(6, 6, 6, 2, '#d8b040'); p.set(12, 8, '#d8b040'); p.set(10, 8, '#d8b040');
    p.rect(3, 7, 2, 4, '#c8c8d0'); p.set(5, 10, '#c8c8d0');
    p.rect(7, 2, 5, 2, '#a85a28'); p.set(12, 3, '#a85a28'); p.set(11, 4, '#a85a28');
    return finish(p);
  }
  function earplugs() {
    const p = new Pix(12, 8);
    for (const x0 of [0, 7]) { p.rect(x0 + 1, 1, 3, 6, '#f0c040'); p.vline(x0 + 1, 1, 6, '#f8d870'); p.hline(x0 + 1, x0 + 3, 6, '#c89a28'); }
    p.hline(4, 7, 3, '#4a8ac8');
    return finish(p);
  }

  // Mom's green watering can, tipped forward to pour (spout and rose on the left).
  function wateringCan() {
    const p = new Pix(16, 12), g = '#4a8a48', gl = '#6aaa60', gd = '#346834', brass = '#c8a040';
    // the barrel
    p.rect(8, 3, 6, 7, g); p.hline(8, 13, 3, gl); p.vline(8, 4, 9, gl); p.hline(8, 13, 9, gd); p.vline(13, 4, 9, gd);
    p.hline(9, 12, 6, gd);
    // carry handle over the top and the grip at the back
    p.hline(9, 12, 0, gd); p.vline(9, 0, 3, gd); p.vline(12, 0, 3, gd);
    p.vline(15, 4, 8, gd); p.set(14, 4, gd); p.set(14, 8, gd);
    // the long spout, angled down, with a brass rose on the end
    for (let k = 0; k < 6; k++) { p.set(7 - k, 7 + Math.floor(k / 2), g); p.set(7 - k, 8 + Math.floor(k / 2), gd); }
    p.rect(0, 9, 2, 3, brass); p.set(0, 10, '#8a6a28');
    return finish(p);
  }
  function eggShot() {
    const p = new Pix(6, 7);
    p.rect(1, 1, 4, 5, '#f8f4e8'); p.set(2, 0, '#f8f4e8'); p.set(3, 0, '#f8f4e8'); p.set(1, 2, '#ffffff');
    return finish(p);
  }

  function mailbox() {
    const p = new Pix(12, 24);
    p.rect(5, 8, 2, 16, '#8a6038');
    p.rect(1, 2, 10, 7, '#1c1c22'); p.hline(2, 9, 2, '#3a3a44');
    p.rect(10, 0, 2, 5, '#d83030');
    p.outline();
    return p.canvas();
  }

  function streetSign() {
    const p = new Pix(18, 32);
    p.rect(8, 6, 2, 26, '#8a8a94');
    p.rect(0, 0, 18, 7, '#2e7a48'); p.hline(2, 15, 3, '#f0f0f0');
    p.outline();
    return p.canvas();
  }

  function pineTree(seed) {
    const p = new Pix(32, 42);
    for (let tier = 0; tier < 4; tier++) {
      const top = tier * 8, half = 6 + tier * 3;
      for (let y = 0; y < 12; y++) {
        const w = Math.floor((half * (y + 2)) / 13);
        for (let x = 16 - w; x <= 16 + w; x++) {
          const s = (x - 16) * 0.1 + (G.hash(x, top + y, seed) - 0.5) * 0.8;
          p.set(x, top + y, s < -0.35 ? '#3e8a4a' : s < 0.4 ? '#2a6a3a' : '#1c4e2c');
        }
      }
    }
    p.rect(14, 36, 5, 6, '#6a4424'); p.vline(18, 36, 41, '#4a2c18');
    p.outline('#102a18');
    return p.canvas();
  }

  // Hens for the coop. Facing left; mirrored for right. Second frame pecks.
  function chicken(color, peck) {
    const p = new Pix(14, 13);
    const D = shade(color, -0.2);
    for (let y = 0; y < 13; y++) for (let x = 0; x < 14; x++) {
      const dx = (x - 8) / 5, dy = (y - 7) / 3.6;
      if (dx * dx + dy * dy <= 1) p.set(x, y, y > 7 ? D : color);
    }
    p.rect(12, 3, 2, 4, color); p.set(13, 2, color);
    const hy = peck ? 7 : 3;
    p.rect(2, hy, 4, 3, color);
    p.set(3, hy - 1, '#d83030'); p.set(4, hy - 1, '#d83030');
    p.set(1, hy + 1, '#f0a020');
    p.set(3, hy + 1, '#1c1c22');
    p.set(2, hy + 3, '#d83030');
    p.vline(7, 10, 11, '#e8a020'); p.vline(9, 10, 11, '#e8a020'); p.set(6, 11, '#e8a020'); p.set(10, 11, '#e8a020');
    p.outline();
    return p.canvas();
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

  // ================================================================ ABE AND HANNAH'S CONDO (Chesapeake)
  // From the listing photos: beige vinyl siding, white trim, a red brick base,
  // gray shingles, and a light blue front door with a wreath.
  const CONDO = { sid: '#e4dac2', sidLn: '#d0c4a8', trim: '#f6f4ee', trimD: '#d8d4c8', roof: '#6c6e74', glass: '#3e5068', glassL: '#9ab8d8', door: '#86b2c6', doorD: '#6a98ae' };

  // Seen from their front walk (the west end of the building): the living room
  // wing and its big window, the blue door under a little portico with the
  // two-story gable above it, the bedroom windows, the side gate and the end of
  // the storage garage. Unit B is the roof running back behind it.
  function condoBuilding() {
    const W = 192, H = 160, GY = H - 1, p = new Pix(W, H), C = CONDO;
    const roofR = shade(C.roof, -0.16), roofF = shade(C.roof, 0.06), hip = shade(C.roof, -0.38);
    const cols = {};
    const shingle = (x, y, base) => {
      const c = cols[base] || (cols[base] = [base, shade(base, -0.3), shade(base, 0.2)]);
      const off = Math.floor(y / 4) % 2 ? 4 : 0;
      p.set(x, y, y % 4 === 3 || (x + off) % 8 === 0 ? c[1] : y % 4 === 0 ? c[2] : c[0]);
    };
    const siding = (x, y0, y1, dark) => {
      for (let y = y0; y <= y1; y++) p.set(x, y, y % 3 === 2 ? (dark ? shade(C.sidLn, -0.1) : C.sidLn) : (dark ? shade(C.sid, -0.1) : C.sid));
    };
    // white-trimmed window with grilles in the top sash
    const win = (x, y, w, h) => {
      p.rect(x - 2, y - 2, w + 4, h + 4, C.trim); p.hline(x - 3, x + w + 2, y + h + 2, C.trim); p.hline(x - 3, x + w + 2, y + h + 3, C.trimD);
      p.rect(x, y, w, h, C.glass);
      const mid = y + Math.floor(h / 2);
      p.hline(x, x + w - 1, mid, C.trim);
      for (let gx = x + 3; gx < x + w - 1; gx += 4) p.vline(gx, y, mid - 1, C.trim);
      p.hline(x, x + w - 1, y + Math.floor(h / 4), C.trim);
      p.set(x + 1, y + 1, C.glassL); p.set(x + 2, y + 1, C.glassL); p.set(x + 1, mid + 1, C.glassL);
    };
    const rake = (x) => 62 + Math.floor(Math.abs(x - 87.5));
    const two = (x) => x >= 56 && x <= 119;
    const eave = (x) => (two(x) ? rake(x) : x >= 174 ? 128 : 124);
    const gate = (x) => x >= 164 && x <= 173;

    // ---- roofs (running back toward Unit B) and walls, column by column
    for (let x = 0; x < W; x++) {
      const e = eave(x);
      if (two(x)) {
        for (let y = 0; y < e; y++) shingle(x, y, x <= 87 ? C.roof : roofR);
        p.set(x, e, C.trim); p.set(x, e + 1, C.trim);
        siding(x, e + 2, GY);
      } else {
        for (let y = 0; y < e - 2; y++) shingle(x, y, y < 98 ? (x < 56 ? C.roof : roofR) : roofF);
        p.set(x, 98, hip);
        p.set(x, e - 2, C.trim); p.set(x, e - 1, C.trimD);
        if (!gate(x)) siding(x, e, GY);
      }
    }
    p.hline(0, W - 1, 0, shade(C.roof, 0.3));
    p.vline(87, 0, 61, shade(C.roof, 0.3)); p.vline(88, 0, 61, hip);
    p.vline(55, 95, 121, hip); p.vline(120, 95, 121, hip);
    for (const [x, y] of [[22, 40], [150, 54], [102, 22]]) { p.rect(x, y, 7, 5, '#4a4c52'); p.hline(x, x + 6, y, '#8a8c92'); }

    // ---- the living room wing: the big double window
    win(10, 130, 15, 18); win(29, 130, 15, 18);
    // ---- the two-story gable: attic vent up top, the upstairs window
    p.rect(82, 70, 12, 10, C.trim);
    for (let y = 72; y < 79; y += 2) p.hline(84, 91, y, '#9a9ca4');
    win(74, 90, 12, 15); win(90, 90, 12, 15);
    // ---- the portico: a little gable on two white posts over the front door
    const prake = (x) => 113 + Math.floor(Math.abs(x - 87.5) * 0.55);
    for (let x = 64; x <= 111; x++) {
      const r = prake(x);
      for (let y = r - 3; y < r; y++) shingle(x, y, C.roof);
      p.set(x, r, C.trim); p.set(x, r + 1, C.trim);
      for (let y = r + 2; y <= 126; y++) p.set(x, y, y % 3 === 2 ? C.sidLn : shade(C.sid, 0.05));
    }
    p.rect(64, 127, 48, 3, C.trim); p.hline(64, 111, 129, C.trimD);
    for (let x = 69; x <= 106; x++) siding(x, 130, GY, true);
    p.rect(64, 130, 5, 30, C.trim); p.vline(68, 130, GY, C.trimD);
    p.rect(107, 130, 5, 30, C.trim); p.vline(111, 130, GY, C.trimD);
    // the light blue front door, and its wreath
    p.rect(78, 132, 20, 28, C.trim);
    p.rect(80, 134, 16, 26, C.door);
    for (const [x, y, w, h] of [[82, 137, 5, 8], [89, 137, 5, 8], [82, 148, 5, 9], [89, 148, 5, 9]]) { p.rect(x, y, w, h, C.doorD); p.hline(x, x + w - 1, y, shade(C.door, 0.15)); }
    p.set(94, 147, BRASS); p.set(94, 148, '#b08a38');
    for (let a = 0; a < 16; a++) p.set(88 + Math.round(Math.cos(a / 16 * Math.PI * 2) * 4), 141 + Math.round(Math.sin(a / 16 * Math.PI * 2) * 4), a % 3 ? '#3a7a34' : '#5aa048');
    for (let a = 0; a < 10; a++) p.set(88 + Math.round(Math.cos(a / 10 * Math.PI * 2) * 3), 141 + Math.round(Math.sin(a / 10 * Math.PI * 2) * 3), a % 2 ? '#2e6a2c' : '#4a9040');
    p.set(87, 145, '#f0e8dc'); p.set(88, 146, '#f0e8dc'); p.set(89, 145, '#f0e8dc');
    p.rect(73, 137, 3, 5, '#2a2a30'); p.set(74, 138, '#f8d878'); p.set(74, 139, '#f0b848');
    // ---- the bedroom windows
    win(126, 131, 12, 17); win(147, 131, 12, 17);
    // ---- the wood side gate, tucked between the bedroom and the storage garage
    for (let x = 164; x <= 173; x++) {
      for (let y = 124; y < 130; y++) p.set(x, y, '#5e584c');
      for (let y = 130; y <= GY; y++) p.set(x, y, (x - 164) % 3 === 2 ? '#8a6a44' : '#b08a5a');
    }
    p.hline(164, 173, 133, '#8a6a44'); p.hline(164, 173, 152, '#8a6a44'); p.set(171, 142, '#2a2a30');
    // ---- the end of the storage garage, with a coach light
    p.rect(181, 134, 3, 5, '#2a2a30'); p.set(182, 135, '#f8d878');
    // corner boards and the red brick base
    for (const x of [0, 56, 118, 162, 174, 190]) { const y0 = two(x) ? eave(x) + 2 : eave(x); p.rect(x, y0, 2, 152 - y0, C.trim); }
    for (let y = 152; y <= GY; y++) for (let x = 0; x < W; x++) {
      if (gate(x) || (x >= 78 && x <= 97) || (x >= 64 && x <= 68) || (x >= 107 && x <= 111)) continue;
      const row = Math.floor(y / 3), off = row % 2 ? 2 : 0;
      p.set(x, y, y % 3 === 2 || (x + off) % 5 === 0 ? '#c49c88' : G.hash(Math.floor((x + off) / 5), row, 7) < 0.3 ? '#963e2c' : '#aa4a34');
    }
    p.outline();
    return p.canvas();
  }

  // The brick step up to the front door.
  function brickStep() {
    const p = new Pix(40, 10);
    for (let y = 0; y < 10; y++) for (let x = 0; x < 40; x++) {
      const row = Math.floor(y / 3), off = row % 2 ? 3 : 0;
      p.set(x, y, y % 3 === 2 || (x + off) % 6 === 0 ? '#c49c88' : G.hash(Math.floor((x + off) / 6), row, 8) < 0.3 ? '#963e2c' : '#aa4a34');
    }
    p.hline(0, 39, 0, '#c86a50');
    p.outline();
    return p.canvas();
  }

  // Round shrubs for the mulch beds: boxwoods, azaleas, and the big one by the
  // corner (the one Abe hides behind).
  function shrub(w, h, seed, flowers) {
    const p = new Pix(w, h);
    const cx = (w - 1) / 2, cy = h * 0.56, rx = w / 2 - 0.5, ry = h * 0.44;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const dx = (x - cx) / rx, dy = (y - cy) / ry;
      if (dx * dx + dy * dy > 1 - G.hash(x, y, seed) * 0.12) continue;
      const s = dx * 0.55 + dy * 0.85 + (G.hash(x >> 1, y >> 1, seed + 1) - 0.5) * 0.8;
      p.set(x, y, s < -0.7 ? '#7ab858' : s < 0.45 ? '#3e7a34' : '#24562a');
    }
    for (let i = 0; i < (flowers || 0); i++) {
      const x = Math.floor(G.hash(i, 1, seed + 2) * w), y = Math.floor(G.hash(i, 2, seed + 2) * h);
      if (p.get(x, y) && p.get(x + 1, y)) { p.set(x, y, '#f490c0'); p.set(x + 1, y, '#e0609a'); }
    }
    p.outline('#163a1c');
    return p.canvas();
  }

  // Abe's Traeger: a black pellet-grill barrel on legs, the hopper on the side, a smokestack.
  function traeger() {
    const p = new Pix(30, 26), blk = '#2a2a30', blkL = '#4a4a56', blkD = '#16161a', steel = '#c8ccd2';
    p.rect(0, 5, 8, 11, blk); p.hline(0, 7, 5, blkL); p.rect(1, 7, 6, 2, blkD); p.rect(2, 11, 4, 2, '#3a3a44'); p.set(3, 11, '#e85820');
    p.rect(8, 6, 19, 9, blk); p.hline(9, 25, 5, blk); p.hline(10, 24, 4, blkL); p.hline(9, 25, 6, blkL);
    p.hline(8, 26, 10, blkD);
    p.hline(12, 22, 8, steel); p.set(12, 9, steel); p.set(22, 9, steel);
    p.rect(24, 0, 3, 5, blk); p.hline(23, 27, 0, blkL);
    p.vline(10, 15, 23, blk); p.vline(24, 15, 23, blk); p.hline(10, 24, 19, '#3a3a44');
    p.rect(9, 23, 3, 3, blkD); p.rect(23, 23, 3, 3, blkD);
    p.outline();
    return p.canvas();
  }

  // A white plastic lawn chair.
  function lawnChair() {
    const p = new Pix(14, 18), w = '#f4f4f0', wd = '#d4d4cc';
    p.rect(2, 0, 10, 8, w); for (let y = 2; y < 8; y += 2) p.hline(3, 10, y, wd);
    p.rect(0, 6, 2, 5, w); p.rect(12, 6, 2, 5, w);
    p.rect(1, 8, 12, 4, w); p.hline(1, 12, 11, wd);
    p.vline(2, 12, 17, wd); p.vline(11, 12, 17, wd); p.vline(3, 12, 16, w); p.vline(10, 12, 16, w);
    p.outline();
    return p.canvas();
  }

  // The air conditioner out back: fan grille on top, fins down the sides.
  function acUnit() {
    const p = new Pix(18, 18);
    p.rect(0, 0, 18, 6, '#9aa0a8'); p.hline(0, 17, 0, '#c8ccd2');
    for (let y = 1; y < 6; y++) for (let x = 3; x < 15; x++) if ((x - 8.5) ** 2 / 30 + (y - 3) ** 2 / 6 <= 1) p.set(x, y, (x + y) % 2 ? '#3a3e44' : '#5a5e66');
    p.rect(0, 6, 18, 10, '#b8bcc4'); for (let x = 1; x < 18; x += 2) p.vline(x, 7, 15, '#9aa0a8');
    p.rect(0, 16, 18, 2, '#6a6e74');
    p.outline();
    return p.canvas();
  }

  // The tall wood privacy fence between the two patios (dog-eared boards).
  function privacyFence(tiles) {
    const W = tiles * 16, p = new Pix(W, 30);
    for (let x = 0; x < W; x++) for (let y = 2; y < 30; y++) p.set(x, y, x % 4 === 3 ? '#8a6438' : G.hash(x >> 2, 0, 12) < 0.4 ? '#b08454' : '#a47a4a');
    for (let x = 0; x < W; x += 4) { p.set(x, 1, '#a47a4a'); p.set(x + 1, 0, '#b08454'); p.set(x + 1, 1, '#b08454'); p.set(x + 2, 1, '#a47a4a'); }
    p.hline(0, W - 1, 8, '#8a6438'); p.hline(0, W - 1, 22, '#8a6438');
    p.outline();
    return p.canvas();
  }

  // The little wood-fenced spot for the trash and recycling bins.
  function trashEnclosure() {
    const p = new Pix(30, 24);
    p.rect(3, 0, 10, 7, '#3e6a44'); p.hline(3, 12, 0, '#5a8a5e');
    p.rect(16, 1, 11, 6, '#3a3a42'); p.hline(16, 26, 1, '#5a5a64');
    for (let x = 0; x < 30; x++) for (let y = 6; y < 24; y++) p.set(x, y, x % 4 === 3 ? '#8a6438' : '#a87e4c');
    p.hline(0, 29, 9, '#8a6438'); p.hline(0, 29, 20, '#8a6438');
    p.outline();
    return p.canvas();
  }

  // ---- their street (from the user's photos and the satellite view)
  // shared bits for the neighbors' duplexes: shingles, siding and a white-trimmed window
  function condoKit(p, pal) {
    const cols = {};
    return {
      shingle(x, y, base) {
        const c = cols[base] || (cols[base] = [base, shade(base, -0.3), shade(base, 0.2)]);
        const off = Math.floor(y / 4) % 2 ? 4 : 0;
        p.set(x, y, y % 4 === 3 || (x + off) % 8 === 0 ? c[1] : y % 4 === 0 ? c[2] : c[0]);
      },
      siding(x, y0, y1) { for (let y = y0; y <= y1; y++) p.set(x, y, y % 3 === 2 ? pal.sidLn : pal.sid); },
      win(x, y, w, h) {
        p.rect(x - 2, y - 2, w + 4, h + 4, pal.trim); p.hline(x - 3, x + w + 2, y + h + 2, pal.trim); p.hline(x - 3, x + w + 2, y + h + 3, pal.trimD);
        p.rect(x, y, w, h, pal.glass);
        const mid = y + Math.floor(h / 2);
        p.hline(x, x + w - 1, mid, pal.trim);
        for (let gx = x + 3; gx < x + w - 1; gx += 4) p.vline(gx, y, mid - 1, pal.trim);
        p.set(x + 1, y + 1, pal.glassL); p.set(x + 2, y + 1, pal.glassL); p.set(x + 1, mid + 1, pal.glassL);
      },
      // a white garage door with a row of little windows across the top
      garage(x, y, w, h) {
        p.rect(x - 2, y - 2, w + 4, h + 2, pal.trim);
        p.rect(x, y, w, h, '#f2f2ee');
        for (let gy = y + 8; gy < y + h; gy += 6) p.hline(x, x + w - 1, gy, '#d6d6ce');
        for (let wx = x + 3; wx + 6 <= x + w - 2; wx += 9) { p.rect(wx, y + 3, 6, 3, '#4a5468'); p.hline(wx, wx + 5, y + 3, '#7a8aa0'); }
      },
      lantern(x, y) { p.rect(x, y, 3, 5, '#2a2a30'); p.set(x + 1, y + 1, '#f8d878'); p.set(x + 1, y + 2, '#f0b848'); },
    };
  }
  // The neighbors next door, where the street curves: tan siding, a light brown hip
  // roof with the second floor's gable at the back, and two white garage doors.
  function condoNeighborTan() {
    const W = 176, H = 128, GY = H - 1, p = new Pix(W, H);
    const pal = { sid: '#d6c6a2', sidLn: '#c2b08a', trim: '#f6f4ee', trimD: '#d8d4c8', glass: '#3e5068', glassL: '#9ab8d8' };
    const roof = '#a8825a', roofR = shade(roof, -0.16), hip = shade(roof, -0.34), K = condoKit(p, pal);
    const EAVE = 84, two = (x) => x >= 8 && x <= 76, rake = (x) => 8 + Math.floor(Math.abs(x - 42) * 0.5);
    const top = (x) => (x < 8 ? 56 + (8 - x) * 3 : two(x) ? 56 : x <= 150 ? 40 : 40 + Math.floor((x - 150) * 1.7));
    for (let x = 0; x < W; x++) {
      if (two(x)) {
        // the second floor: its gable roof, then its wall with the double window
        for (let y = 0; y < rake(x); y++) K.shingle(x, y, x <= 42 ? roof : roofR);
        p.set(x, rake(x), pal.trim); p.set(x, rake(x) + 1, pal.trim);
        K.siding(x, rake(x) + 2, top(x) - 1);
      }
      for (let y = top(x); y < EAVE; y++) K.shingle(x, y, x > 150 ? roofR : roof);
      p.set(x, EAVE, pal.trim); p.set(x, EAVE + 1, pal.trimD);
      K.siding(x, EAVE + 2, GY);
    }
    p.hline(77, 150, 40, shade(roof, 0.3)); p.hline(8, 76, 56, hip);
    for (let x = 151; x < W; x++) p.set(x, top(x), hip);
    p.vline(42, 0, 8, shade(roof, 0.3));
    K.win(26, 30, 12, 14); K.win(44, 30, 12, 14);
    // the front door and a window on either side of it
    K.win(8, 98, 12, 15); K.win(54, 98, 12, 15);
    p.rect(30, 94, 18, 34, pal.trim); p.rect(32, 96, 14, 32, '#ece6da');
    for (const [x, y] of [[34, 99], [40, 99], [34, 112], [40, 112]]) { p.rect(x, y, 4, 9, '#dcd4c6'); p.hline(x, x + 3, y, '#f8f4ec'); }
    p.set(44, 112, BRASS); K.lantern(25, 100);
    // two garage doors and a coach light between them
    K.garage(76, 94, 38, 34); K.garage(122, 94, 38, 34); K.lantern(116, 100);
    for (const x of [0, 70, 174]) p.rect(x, EAVE + 2, 2, GY - EAVE - 1, pal.trim);
    p.outline();
    return p.canvas();
  }
  // Another duplex at the corner where the street bends, cream with a gray roof like
  // Abe and Hannah's: a front gable with a big half-round window, and a dormer.
  function condoNeighborCream() {
    const W = 192, H = 112, GY = H - 1, p = new Pix(W, H), C = CONDO, K = condoKit(p, C);
    const roofR = shade(C.roof, -0.16), hip = shade(C.roof, -0.36);
    const EAVE = 70, gab = (x) => x >= 16 && x <= 80, rake = (x) => 6 + Math.floor(Math.abs(x - 48) * 0.62);
    const dor = (x) => x >= 118 && x <= 162, drake = (x) => 4 + Math.floor(Math.abs(x - 140) * 0.6);
    const top = (x) => (x < 16 ? 30 + Math.floor((16 - x) * 2.5) : x > 175 ? 22 + Math.floor((x - 175) * 2.8) : 22);
    for (let x = 0; x < W; x++) {
      if (gab(x)) {
        // the two-story front gable comes all the way down to the ground
        for (let y = 0; y < rake(x); y++) K.shingle(x, y, x <= 48 ? C.roof : roofR);
        p.set(x, rake(x), C.trim); p.set(x, rake(x) + 1, C.trim);
        K.siding(x, rake(x) + 2, GY);
        continue;
      }
      if (dor(x)) {
        for (let y = 0; y < drake(x); y++) K.shingle(x, y, x <= 140 ? C.roof : roofR);
        p.set(x, drake(x), C.trim); p.set(x, drake(x) + 1, C.trim);
        K.siding(x, drake(x) + 2, 45);
        for (let y = 46; y < EAVE; y++) K.shingle(x, y, C.roof);
      } else for (let y = top(x); y < EAVE; y++) K.shingle(x, y, x > 175 || x < 16 ? roofR : C.roof);
      p.set(x, EAVE, C.trim); p.set(x, EAVE + 1, C.trimD);
      K.siding(x, EAVE + 2, GY);
    }
    p.hline(81, 175, 22, shade(C.roof, 0.3)); p.hline(118, 162, 46, hip);
    // the attic vent up in the gable, and the big window with its half-round top
    p.rect(42, 16, 12, 9, C.trim); for (let y = 18; y < 24; y += 2) p.hline(44, 51, y, '#9a9ca4');
    p.rect(34, 58, 29, 42, C.trim);
    for (let y = 44; y < 58; y++) for (let x = 34; x <= 62; x++) if (Math.hypot(x - 48, y - 58) <= 14.5) p.set(x, y, C.trim);
    for (let y = 46; y < 98; y++) for (let x = 36; x <= 60; x++) {
      if (y < 58 && Math.hypot(x - 48, y - 58) > 12.5) continue;
      p.set(x, y, C.glass);
    }
    for (let a = 1; a < 4; a++) for (let r = 0; r < 12; r++) p.set(48 - Math.round(Math.cos(a * Math.PI / 4) * r), 58 - Math.round(Math.sin(a * Math.PI / 4) * r), C.trim);
    p.hline(36, 60, 58, C.trim); p.hline(36, 60, 78, C.trim); for (let x = 40; x < 60; x += 5) p.vline(x, 59, 77, C.trim);
    p.set(38, 60, C.glassL); p.set(39, 60, C.glassL); p.set(38, 80, C.glassL);
    // the dormer's double window
    K.win(124, 22, 12, 14); K.win(144, 22, 12, 14);
    // the front door with a coach light, the windows, the end of the garage
    p.rect(96, 78, 18, 34, C.trim); p.rect(98, 80, 14, 32, '#f0ece4');
    for (const [x, y] of [[100, 83], [106, 83], [100, 96], [106, 96]]) { p.rect(x, y, 4, 9, '#dcd6ca'); p.hline(x, x + 3, y, '#f8f6f0'); }
    p.set(110, 96, BRASS); K.lantern(89, 84);
    K.win(124, 80, 12, 17); K.win(146, 80, 12, 17); K.lantern(184, 84);
    for (const x of [0, 16, 79, 176, 190]) p.rect(x, gab(x) ? rake(x) + 2 : EAVE + 2, 2, 104 - (gab(x) ? rake(x) + 2 : EAVE + 2), C.trim);
    // a red brick base, like theirs
    for (let y = 104; y <= GY; y++) for (let x = 0; x < W; x++) {
      if (x >= 96 && x <= 113) continue;
      const row = Math.floor(y / 3), off = row % 2 ? 2 : 0;
      p.set(x, y, y % 3 === 2 || (x + off) % 5 === 0 ? '#c49c88' : G.hash(Math.floor((x + off) / 5), row, 9) < 0.3 ? '#963e2c' : '#aa4a34');
    }
    p.outline();
    return p.canvas();
  }
  // an SUV seen from above, nose up, in any color
  function suvTop(c) {
    const p = new Pix(26, 40), L = shade(c, 0.22), D = shade(c, -0.3), glass = '#2a3a50';
    for (const [x, y] of [[0, 6], [22, 6], [0, 28], [22, 28]]) p.rect(x, y, 4, 7, '#1c1c22');
    p.rect(2, 1, 22, 38, c);
    p.vline(2, 1, 38, L); p.vline(23, 1, 38, D);
    p.rect(4, 2, 18, 8, L); p.set(4, 2, '#f8f0b0'); p.set(21, 2, '#f8f0b0');
    p.rect(4, 10, 18, 5, glass); p.hline(5, 10, 11, '#8ab0d8');
    p.rect(4, 15, 18, 13, c); p.vline(6, 16, 27, '#9aa0a8'); p.vline(19, 16, 27, '#9aa0a8');
    p.rect(4, 28, 18, 4, glass);
    p.rect(3, 33, 20, 5, D); p.set(3, 36, '#e03030'); p.set(22, 36, '#e03030');
    p.outline();
    return p.canvas();
  }
  // a quarter turn (clockwise: nose up becomes nose right)
  function rot90(src, cw = true) {
    const c = G.canvas(src.height, src.width), x = c.getContext('2d');
    if (cw) { x.translate(src.height, 0); x.rotate(Math.PI / 2); } else { x.translate(0, src.width); x.rotate(-Math.PI / 2); }
    x.drawImage(src, 0, 0);
    return c;
  }
  // a black carriage lamp on a post, along the street
  function postLamp() {
    const p = new Pix(10, 36), b = '#24242a', bL = '#4a4a54';
    p.rect(4, 10, 2, 24, b); p.vline(4, 11, 33, bL);
    p.rect(2, 33, 6, 3, b);
    p.rect(3, 0, 4, 2, b); p.rect(1, 2, 8, 2, b);
    p.rect(2, 4, 6, 6, '#f8e8a8'); p.vline(5, 4, 9, b); p.hline(2, 7, 7, '#f0d070'); p.rect(3, 10, 4, 1, b);
    return finish(p);
  }
  // a tall, skinny evergreen (a row of them along the street)
  function arborvitae() {
    const p = new Pix(12, 30), g = '#2e6a34', gL = '#4a8a44', gD = '#1e4a26';
    for (let y = 0; y < 27; y++) {
      const hw = Math.max(1, Math.round(5 * Math.sin(Math.PI * (y + 3) / 32)));
      p.hline(6 - hw, 5 + hw, y, g);
      if (y % 3 === 1) p.set(6 - hw + 1, y, gL);
      p.set(5 + hw, y, gD);
      if (y % 4 === 2) p.set(6, y, gL);
    }
    p.rect(5, 27, 2, 3, '#6a4a30');
    return finish(p);
  }
  // a school bus seen from above, headed down the main road
  function schoolBus() {
    const p = new Pix(30, 80), y0 = '#f0b828', yL = '#f8cc48', yD = '#c88c18', blk = '#24242a';
    for (const y of [10, 56]) { p.rect(0, y, 2, 9, blk); p.rect(28, y, 2, 9, blk); }
    p.rect(2, 0, 26, 74, y0);
    p.rect(5, 2, 20, 58, yL); p.vline(2, 0, 73, yD); p.vline(27, 0, 73, yD);
    for (const x of [3, 26]) p.vline(x, 3, 70, blk);
    for (const y of [12, 38]) { p.rect(11, y, 8, 6, '#e8e8e0'); p.hline(11, 18, y, '#ffffff'); }
    p.rect(5, 61, 20, 6, '#34496a'); p.hline(6, 12, 62, '#8ab0d8');
    p.rect(6, 67, 18, 9, y0); p.hline(6, 23, 67, yD); p.set(7, 74, '#fff0b0'); p.set(22, 74, '#fff0b0');
    for (const x of [4, 24]) { p.set(x, 60, '#f86030'); p.set(x + 1, 60, '#f8a020'); }
    p.rect(5, 76, 20, 3, blk);
    return finish(p);
  }

  // ================================================================ ROMULUS
  // Abe and Hannah's border collie, from the user's photos: black, with a thin white blaze
  // up between his amber-brown eyes, a white muzzle and big black nose, a white chest that
  // runs up his throat, white front legs and paws, white "pants" behind his back legs, and
  // a bushy black tail with a white tip. Ears up, with the tips folded over. No collar.
  // His body is in profile and his head is turned toward the camera (like in both photos),
  // so you see both eyes and the blaze. Drawn from shapes in a 32 x 24.5 grid (2.5 of it is
  // headroom, plus 1 on each side for his tail), so the same dog comes out crisp at any size: s = 1 in the house, 2-4 on the
  // golf course. Facing right; mirror for left. His paws touch the ground 2 units above the
  // bottom of the canvas.
  function borderCollie(s, pose) {
    const TOP = 2.5, LEFT = 1, W = Math.ceil((32 + 2 * LEFT) * s), H = Math.ceil((22 + TOP) * s), p = new Pix(W, H);
    const BLK = '#1c1c24', BLK_L = '#383848', BLK_D = '#101016', WHT = '#f6f4ef', WHT_D = '#dcd8d0', WHT_S = '#c4c0b8';
    const o = Object.assign({ cf: 0, cr: 0, hx: 0, hy: 0, mouth: 1, ears: 'up', tail: 'low', legs: 'stand', eye: 'normal', tilt: 0 }, {
      stand: {}, run1: { legs: 'run1', tail: 'flow', hy: 0.6 }, run2: { legs: 'run2', tail: 'flow', cf: 0.4, cr: 0.4, hy: 0.6 }, run3: { legs: 'run3', tail: 'flow', hy: 0.6 },
      stalk: { cf: 2.6, cr: 1.2, hx: 1.6, hy: 3.6, mouth: 0, ears: 'fwd', legs: 'crouch', eye: 'stare' },
      bark: { hy: -1, mouth: 2, legs: 'brace', ears: 'fwd' },
      scared: { cf: 1.2, cr: 2.8, hx: -0.8, hy: 2.4, mouth: 0, ears: 'back', tail: 'tuck', legs: 'cower', eye: 'wide' },
      lie: { cf: 5.4, cr: 5.6, hy: 4.4, legs: 'lie', tail: 'lie' },
      happy: { tail: 'up', mouth: 1 },
    }[pose]);
    const { cf, cr, hx, hy } = o;
    const shapes = [];
    // an ellipse (optionally tilted, optionally with a ragged, furry edge)
    const ell = (cx, cy, rx, ry, col, a = 0, fl = 0) => shapes.push((u, v) => {
      const du = u - cx, dv = v - cy, c = Math.cos(a), sn = Math.sin(a), x = du * c + dv * sn, y = -du * sn + dv * c;
      let lim = 1;
      if (fl) lim = 1 + fl * (G.hash(Math.floor((Math.atan2(y / ry, x / rx) + Math.PI) * 4), Math.round(cx * 10), 17) - 0.45);
      return (x / rx) ** 2 + (y / ry) ** 2 <= lim * lim ? (typeof col === 'function' ? col(u, v, x, y) : col) : null;
    });
    // a capsule from one point to another, its radius going from r0 to r1
    const seg = (x0, y0, x1, y1, r0, col, r1 = r0) => shapes.push((u, v) => {
      const dx = x1 - x0, dy = y1 - y0, L2 = dx * dx + dy * dy || 1, k = Math.max(0, Math.min(1, ((u - x0) * dx + (v - y0) * dy) / L2));
      return Math.hypot(u - x0 - dx * k, v - y0 - dy * k) <= r0 + (r1 - r0) * k ? (typeof col === 'function' ? col(u, v, k) : col) : null;
    });
    const tri = (a, b, c, col) => shapes.push((u, v) => {
      const sg = (p1, p2) => (u - p2[0]) * (p1[1] - p2[1]) - (p1[0] - p2[0]) * (v - p2[1]);
      const d1 = sg(a, b), d2 = sg(b, c), d3 = sg(c, a);
      return (d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0) ? null : col;
    });
    const GND = 19.4;
    // paws: [x, lift] for far front, far hind, near front, near hind
    const L = {
      stand: [[17.0, 0], [5.6, 0], [18.6, 0], [7.0, 0]], brace: [[18.4, 0], [5.0, 0], [20.0, 0], [6.4, 0]],
      run1: [[20.8, 1.0], [4.4, 0.4], [22.4, 0.4], [3.2, 1.2]], run2: [[15.2, 0.4], [9.8, 1.0], [16.4, 1.2], [11.0, 0.2]], run3: [[19.2, 0.2], [5.0, 1.4], [17.4, 1.2], [8.2, 0]],
      crouch: [[19.4, 0], [5.4, 0], [20.8, 0], [6.8, 0]], cower: [[17.2, 0], [7.4, 0], [18.4, 0], [8.6, 0]],
    }[o.legs];
    // ---- the tail, behind everything: bushy, hanging low, a white tip
    const TP = {
      low: [[4.6, 8.4 + cr], [2.4, 9.8 + cr], [1.0, 11.6 + cr], [0.6, 13.4 + cr]], flow: [[4.6, 8.4 + cr], [2.0, 9.0 + cr], [0.4, 10.2 + cr], [-0.4, 11.8 + cr]],
      up: [[4.8, 8.2 + cr], [3.2, 5.8 + cr], [2.8, 3.4 + cr], [3.6, 1.6 + cr]],
      tuck: [[5.4, 9.2 + cr], [5.0, 12.4 + cr], [6.4, 15.0 + cr], [8.6, 16.4 + cr]], lie: [[4.6, 12.6 + cr], [2.4, 14.6 + cr], [0.8, 16.4 + cr], [0.6, 18.2 + cr]],
    }[o.tail];
    seg(...TP[0], ...TP[1], 1.5, BLK, 1.8);
    seg(...TP[1], ...TP[2], 1.8, BLK, 1.6);
    seg(...TP[2], ...TP[3], 1.6, (u, v, k) => (k > 0.45 ? WHT : BLK), 1.0);
    // ---- a leg: hip or elbow, the middle joint, the paw (white from the middle joint down in front)
    const frontLeg = (px, lift, far) => {
      const ex = 17.0 - (far ? 1.4 : 0), ey = 12.6 + cf, py = GND - lift, wx = ex + (px - ex) * 0.75, wy = py - 1.8;
      const c = far ? WHT_D : WHT;
      seg(ex, ey, wx, wy, 1.25, c, 1.0);
      seg(wx, wy, px, py - 0.4, 1.0, c, 0.95);
      ell(px + 0.5, py, 1.25, 0.65, c);
      if (!far) ell(ex - 0.7, ey + 1.8, 0.7, 1.6, c, -0.2, 0.5); // the feathering down the back of the leg
    };
    const hindLeg = (px, lift, far) => {
      const off = far ? -1.3 : 0, hx0 = 7.4 + off, hy0 = 10.8 + cr, kx = 9.0 + off, ky = 13.4 + cr, py = GND - lift, hkx = px - 0.8, hky = py - 2.6;
      const B = far ? BLK_D : BLK, Wc = far ? WHT_D : WHT;
      ell(hx0 + 0.4, hy0 + 1.4, 2.5, 2.9, B, 0, 0.18);
      seg(kx, ky, hkx, hky, 1.15, (u, v, k) => (k > 0.55 ? Wc : B), 0.95);
      seg(hkx, hky, px, py - 0.4, 0.95, Wc, 0.9);
      ell(px + 0.5, py, 1.2, 0.65, Wc);
      if (!far) ell(hx0 - 1.8, hy0 + 2.6, 1.0, 1.9, WHT, 0.3, 0.45); // white "pants" behind the thigh
    };
    if (L) { frontLeg(L[0][0], L[0][1], true); hindLeg(L[1][0], L[1][1], true); frontLeg(L[2][0], L[2][1], false); hindLeg(L[3][0], L[3][1], false); }
    // ---- the body (over the tops of the legs: black shoulders and hips): a deep chest, the barrel, the rump, tipped forward when he digs
    const by = (cf + cr) / 2, dark = (u, v, x, y) => (y < -2.1 ? BLK_L : BLK);
    ell(7.4, 9.8 + cr, 3.4, 3.0, dark, o.tilt, 0.12);
    ell(12.2, 9.9 + by, 6.2, 2.8, dark, o.tilt, 0.1);
    ell(16.6, 10.5 + cf, 3.5, 3.5, dark, o.tilt, 0.1);
    if (!L) {
      // lying down, like the first photo: front legs stretched out in front, a back leg tucked under
      seg(17.4, 16.4, 24.4, 18.8, 1.15, WHT_D); ell(25.0, 19.0, 1.4, 0.75, WHT_D);
      seg(18.4, 16.8, 25.6, 19.2, 1.2, WHT); ell(26.4, 19.4, 1.5, 0.8, WHT);
      ell(8.4, 15.6, 3.2, 2.8, BLK, 0, 0.15); ell(11.0, 19.0, 1.5, 0.75, WHT); ell(6.0, 16.6, 1.2, 1.6, WHT, 0.3, 0.4);
    }
    // ---- the neck, and the white that runs from his chin down his chest
    const H0x = 22.0 + hx, H0y = 4.2 + hy;
    seg(16.8, 8.4 + cf, H0x - 1.4, H0y + 1.0, 2.8, BLK);
    seg(H0x + 0.6, H0y + 2.4, 19.0, 10.2 + cf, 1.3, WHT, 1.8);
    ell(19.1, 11.0 + cf, 1.9, 3.1, (u, v, x, y) => (x < -0.9 && y > 1.0 ? WHT_D : WHT), -0.2, 0.3);
    // ---- the head, turned toward the camera (at house size the face is placed by hand, below)
    const hx1 = H0x, hy1 = H0y, tiny = s < 1.5;
    if (!tiny) {
    const ear = (bx0, by0, bx1, by1, tx, ty, fold) => {
      tri([bx0, by0], [bx1, by1], [tx, ty], BLK);
      if (fold) tri([tx, ty], [tx + fold[0], ty + fold[1]], [tx + fold[2], ty + fold[3]], BLK_L);
    };
    if (o.ears === 'back') {
      ear(hx1 - 2.4, hy1 - 1.2, hx1 - 0.6, hy1 - 2.4, hx1 - 4.6, hy1 - 2.2);
      ear(hx1 + 0.2, hy1 - 2.6, hx1 + 1.8, hy1 - 2.4, hx1 - 2.2, hy1 - 3.8);
    } else if (o.ears === 'fwd') {
      ear(hx1 - 2.8, hy1 - 1.0, hx1 - 0.8, hy1 - 2.4, hx1 - 2.4, hy1 - 4.6);
      ear(hx1 + 0.6, hy1 - 2.6, hx1 + 2.6, hy1 - 1.8, hx1 + 1.8, hy1 - 5.0);
    } else {
      // up, with the tips folded over
      ear(hx1 - 2.8, hy1 - 1.0, hx1 - 0.8, hy1 - 2.4, hx1 - 3.0, hy1 - 4.2, [1.5, 0.3, 1.3, 1.6]);
      ear(hx1 + 0.6, hy1 - 2.6, hx1 + 2.6, hy1 - 1.8, hx1 + 1.6, hy1 - 4.6, [1.5, 0.4, 1.0, 1.7]);
    }
    ell(hx1, hy1, 3.4, 3.0, (u, v, x, y) => (y < -1.6 ? BLK_L : BLK), 0, 0.12);
    // the mouth (open and panting, wide open when he barks), then the white muzzle over it
    if (o.mouth) {
      const open = o.mouth === 2 ? 1.4 : 0.7;
      ell(hx1 + 2.3, hy1 + 2.5 + open * 0.3, 1.5, 0.6 + open * 0.4, '#4a141c');
      seg(hx1 + 2.4, hy1 + 2.4, hx1 + 2.5, hy1 + 3.6 + open, 0.75, (u, v, k) => (k > 0.85 ? '#d85878' : '#f07a98'), 0.65);
      ell(hx1 + 2.0, hy1 + 3.0 + open, 1.5, 0.55, WHT_D);
    }
    ell(hx1 + 2.5, hy1 + 1.5, 2.0, 1.5, (u, v, x, y) => (y > 0.7 ? WHT_D : WHT));
    // the blaze: a thin white stripe from the muzzle up between his eyes
    seg(hx1 + 2.1, hy1 + 0.8, hx1 + 0.9, hy1 - 2.9, 0.8, WHT, 0.32);
    // the big black nose
    ell(hx1 + 4.0, hy1 + 1.0, 0.95, 0.75, '#0e0e12');
    // eyes: amber-brown, dark pupils, a bright catchlight (wide and white-rimmed when he's scared)
    const eye = (ex, ey, far) => {
      const r = far ? 0.58 : 0.66;
      if (o.eye === 'wide') ell(ex, ey, r + 0.3, r + 0.3, WHT);
      ell(ex, ey, r, r, o.eye === 'stare' ? '#c07a28' : '#9a5a20');
      ell(ex + 0.12, ey + 0.08, r * 0.5, r * 0.55, '#1a0c06');
    };
    eye(hx1 + 2.5, hy1 - 0.6, false);
    eye(hx1 - 0.1, hy1 - 0.8, true);
    }
    // ---- rasterize: the last shape that covers a pixel's center wins
    for (let py = 0; py < H; py++) for (let px = 0; px < W; px++) {
      const u = (px + 0.5) / s - LEFT, v = (py + 0.5) / s - TOP;
      let col = null;
      for (const f of shapes) { const c = f(u, v); if (c) col = c; }
      if (col) p.set(px, py, col);
    }
    // the little things that matter most: eyes, nose and catchlights, placed by hand at small sizes
    const at = (u, v) => [Math.floor((u + LEFT) * s), Math.floor((v + TOP) * s)];
    const put = (u, v, col) => { const [x, y] = at(u, v); p.set(x, y, col); };
    if (tiny) {
      // his face, pixel by pixel: ears with folded tips, amber eyes either side of the blaze,
      // the white muzzle and big black nose, and his tongue out when his mouth is open
      const ears = { up: ['k....k...', 'Kk..Kk...'], fwd: ['K....K...', 'K...KK...'], back: ['.........', 'kKK.kKK..'] }[o.ears];
      const mouth = o.mouth ? ['..KwMPww.', '.....P...'] : ['..Kwwww..', '.........'];
      const face = [...ears, 'KKKWKKK..', 'KKKWKKK..', 'KAKWWAK..', 'KKWWWWWW.', '.KWWWWWNN', ...mouth];
      const C = { K: BLK, k: BLK_L, W: WHT, w: WHT_D, A: o.eye === 'wide' ? '#f6f4ef' : '#c87e2a', N: '#0e0e12', M: '#4a141c', P: '#f07a98' };
      const [x0, y0] = at(hx1 - 3, hy1 - 5);
      face.forEach((row, j) => [...row].forEach((ch, i) => { if (C[ch]) p.set(x0 + i, y0 + j, C[ch]); }));
    } else {
      for (const [ex, ey] of [[hx1 + 2.5, hy1 - 0.6], [hx1 - 0.1, hy1 - 0.8]]) put(ex - 0.2, ey - 0.25, '#fff4dc');
      put(hx1 + 3.7, hy1 + 0.7, '#5a5a66');
    }
    p.outline();
    return p.canvas();
  }
  // a golf ball (the golfers on the course tee off at Nate during the Romulus fight)
  function golfBall() {
    const p = new Pix(5, 5);
    p.rect(1, 0, 3, 5, '#f8f8f4'); p.rect(0, 1, 5, 3, '#f8f8f4'); p.set(1, 1, '#ffffff'); p.set(3, 3, '#d8d8d0'); p.set(2, 2, '#e4e4dc');
    return finish(p);
  }
  // The Portable Bidet (from the user's photo): a charcoal cylinder with a domed top, a darker
  // base ring, the groove down its side, and a black nozzle arm swung up off the top.
  function bidetIcon() {
    const p = new Pix(15, 18), b = '#4a4c54', bL = '#6e707a', bD = '#33353b', base = '#2a2b30', arm = '#141418';
    p.rect(3, 4, 7, 11, b); p.hline(4, 8, 3, b); p.hline(5, 7, 2, b);
    p.vline(4, 4, 13, bL); p.set(5, 3, bL); p.vline(9, 4, 14, bD);
    p.vline(7, 5, 12, '#24252a');
    p.rect(2, 14, 9, 4, base); p.hline(2, 10, 14, '#44454c'); p.rect(4, 15, 5, 2, '#1e1f23');
    for (let i = 0; i <= 5; i++) { p.set(8 + i, 4 - Math.round(i * 0.7), arm); p.set(8 + i, 5 - Math.round(i * 0.7), arm); }
    p.rect(12, 0, 3, 2, arm); p.set(13, 0, '#c8ccd2');
    return finish(p);
  }
  // the little one Nate holds while he sprays (nozzle forward)
  function bidetHand() {
    const p = new Pix(10, 11), b = '#4a4c54', arm = '#141418';
    p.rect(1, 3, 4, 6, b); p.hline(2, 3, 2, b); p.vline(1, 3, 7, '#6e707a'); p.rect(0, 8, 6, 3, '#2a2b30');
    for (let i = 0; i <= 4; i++) p.set(4 + i, 3 - Math.round(i * 0.5), arm);
    p.rect(8, 0, 2, 2, arm); p.set(9, 0, '#c8ccd2');
    return finish(p);
  }
  // the pin on the green: a flagstick with a red flag
  function golfFlag() {
    const p = new Pix(14, 38);
    p.vline(2, 4, 35, '#f4f4f0'); p.vline(3, 4, 35, '#c8c8c0');
    for (let y = 4; y < 13; y++) p.hline(4, 4 + Math.round((y - 4) * 0.4 + 6 - Math.abs(y - 8.5) * 0.9), y, '#d83040');
    p.hline(4, 9, 4, '#f05060');
    p.rect(0, 35, 6, 3, '#1c3a1c');
    return finish(p);
  }

  // ---- Abe and Hannah's dining room and living room (from the user's photos)
  // The light oak table with four white Windsor spindle-back chairs: two behind it, one at each end.
  function condoDiningSet() {
    const W = 76, H = 50, p = new Pix(W, H), oak = '#d8b47e', oakD = '#b88c56', oakL = '#ecd2a0', leg = '#c49a62';
    // a bow-back Windsor chair seen from the front: the arched back with its spindles, the seat, the legs
    const front = (x, y) => {
      for (let i = 0; i <= 10; i++) { const yy = y + Math.round(Math.abs(i - 5) ** 1.6 / 4); p.set(x + i, yy, WHITE); p.set(x + i, yy + 1, WHITE_D); }
      for (let i = 2; i <= 8; i += 2) p.vline(x + i, y + 2, y + 11, WHITE);
      p.vline(x, y + 3, y + 11, WHITE); p.vline(x + 10, y + 3, y + 11, WHITE);
    };
    // the same chair from the side (at the ends of the table), facing in
    const side = (x, y, flip) => {
      const fx = (i) => (flip ? x + 8 - i : x + i);
      for (let j = 0; j < 12; j++) p.set(fx(1), y + j, WHITE);
      for (let j = 0; j < 12; j += 3) p.set(fx(2), y + j + 1, WHITE_D);
      p.set(fx(1), y - 1, WHITE); p.set(fx(2), y - 1, WHITE);
      for (let i = 1; i <= 7; i++) { p.set(fx(i), y + 12, WHITE); p.set(fx(i), y + 13, WHITE_D); }
      for (const i of [1, 7]) p.vline(fx(i), y + 14, y + 21, WHITE_D);
    };
    front(14, 4); front(50, 4);
    // the oval top, its apron and the turned legs
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const e = ((x + 0.5 - 38) / 29) ** 2 + ((y + 0.5 - 24) / 10) ** 2;
      if (e <= 1) p.set(x, y, e > 0.82 && y < 24 ? oakL : (y + Math.floor(x / 9)) % 5 === 0 ? oakD : oak);
    }
    for (let x = 12; x <= 64; x++) { const yy = 24 + Math.round(10 * Math.sqrt(Math.max(0, 1 - ((x + 0.5 - 38) / 29) ** 2))); p.vline(x, yy, yy + 2, '#a87c48'); }
    for (const x of [16, 59]) { p.rect(x, 36, 3, 13, leg); p.set(x + 1, 40, oakL); p.set(x + 1, 44, oakD); }
    for (const x of [24, 51]) p.rect(x, 34, 2, 9, oakD);
    side(0, 22, false); side(67, 22, true);
    return finish(p);
  }
  // The dark carved sideboard against the dining room wall, with bottles, candlesticks, a little plant and a lamp.
  function condoSideboard() {
    const W = 48, H = 34, p = new Pix(W, H), wood = '#4a2a1c', woodL = '#6a3e28', woodD = '#2e1a10';
    p.rect(0, 14, 48, 3, woodL); p.hline(0, 47, 14, '#8a5638');
    p.rect(1, 17, 46, 12, wood);
    for (const x of [2, 17, 32]) { p.rect(x, 19, 14, 8, woodD); p.rect(x + 1, 20, 12, 6, wood); p.set(x + 7, 23, BRASS); }
    p.hline(1, 46, 28, woodD);
    for (const x of [2, 44]) { p.rect(x, 29, 2, 5, woodD); p.set(x, 31, woodL); }
    p.rect(22, 29, 4, 2, woodD);
    // on top: bottles (green, brown, clear), two candlesticks with pink tapers, a succulent, a little lamp
    for (const [x, c, h] of [[4, '#3a7a3a', 9], [7, '#7a3a1c', 11], [10, '#c8d8e0', 8], [13, '#2a4a2a', 10]]) { p.rect(x, 14 - h, 2, h, c); p.set(x, 14 - h - 1, '#2a2a30'); }
    for (const x of [30, 34]) { p.vline(x, 9, 13, BRASS); p.vline(x, 3, 8, '#e87a98'); p.set(x, 2, '#f8d040'); }
    p.rect(21, 10, 5, 4, '#e8e4dc'); p.set(22, 8, '#4a8a44'); p.set(24, 8, '#4a8a44'); p.rect(21, 9, 5, 1, '#5a9a54');
    p.rect(40, 6, 6, 4, '#f4ecd8'); p.vline(43, 10, 13, BRASS);
    return finish(p);
  }
  // A big monstera in a pot, next to the sideboard.
  function monstera() {
    const W = 28, H = 42, p = new Pix(W, H), g = '#2e6a34', gL = '#4a8a44', gD = '#1e4a26';
    const leaf = (cx, cy, r) => {
      for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) {
        if (x * x + y * y > r * r) continue;
        // the splits in the leaf
        if (r > 4 && Math.abs(x) > 1 && (Math.abs(y) % 3 === 0) && x * x + y * y > (r - 3) * (r - 3)) continue;
        p.set(cx + x, cy + y, x + y < -2 ? gL : (x > r / 2 ? gD : g));
      }
    };
    for (const [x, y] of [[13, 30], [10, 26], [16, 27]]) p.vline(x, y - 6, y + 4, gD);
    leaf(7, 14, 6); leaf(20, 12, 6); leaf(13, 6, 5); leaf(6, 25, 5); leaf(22, 23, 5); leaf(14, 19, 4);
    p.rect(8, 32, 12, 9, '#e8e2d6'); p.hline(7, 20, 32, '#f6f2ea'); p.hline(8, 19, 40, '#c8c0b2'); p.vline(19, 33, 40, '#c8c0b2');
    return finish(p);
  }
  // The cream couch, seen from its side: it faces left, toward the fireplace. Arms at both
  // ends, three seat cushions, the back down its right side, a striped pillow.
  function condoSofa() {
    const W = 32, H = 72, p = new Pix(W, H), c = '#e6dccb', cL = '#f4ecdc', cD = '#c8bca8', cDD = '#a89c88';
    p.rect(20, 4, 11, 60, c); p.vline(20, 4, 63, cL); p.vline(30, 4, 63, cD);
    for (const y of [10, 28, 46]) { p.rect(5, y, 15, 17, c); p.hline(5, 19, y, cL); p.hline(5, 19, y + 16, cD); p.vline(5, y, y + 16, cD); }
    for (const y of [0, 62]) { p.rect(1, y, 30, 9, c); p.hline(1, 30, y, cL); p.hline(1, 30, y + 8, cD); p.vline(1, y, y + 8, cD); }
    p.rect(1, 66, 30, 3, cD); p.hline(1, 30, 69, cDD);
    for (const x of [3, 28]) { p.rect(x, 70, 2, 2, '#3a2a20'); }
    // pillows: a cream one and a striped one up by the top arm
    p.rect(13, 11, 8, 8, '#f4f0e8'); p.hline(13, 20, 11, '#ffffff');
    p.rect(12, 20, 9, 8, '#e8dccc'); for (let y = 21; y < 28; y += 2) p.hline(12, 20, y, '#b8a890');
    return finish(p);
  }
  // The dark cherry trestle coffee table, long side running up and down, a wooden bowl on it.
  function trestleTable() {
    const W = 30, H = 52, p = new Pix(W, H), top = '#5a2418', topL = '#7a3a26', topD = '#3e1810';
    p.rect(1, 0, 28, 40, top); p.hline(1, 28, 0, topL); p.vline(1, 0, 39, topL);
    for (let y = 6; y < 40; y += 9) p.hline(4, 26, y, '#4e1e14');
    p.rect(1, 40, 28, 4, topD);
    // the trestle at the near end: a carved board on a wide foot
    p.rect(11, 44, 8, 5, topD); p.rect(13, 45, 4, 2, top); p.rect(6, 49, 18, 3, topD); p.hline(6, 23, 49, top);
    // the wooden bowl
    for (let y = -4; y <= 4; y++) for (let x = -5; x <= 5; x++) if ((x / 5.5) ** 2 + (y / 4.5) ** 2 <= 1) p.set(15 + x, 18 + y, y < -1 ? '#d88a50' : '#b06a3a');
    p.hline(11, 19, 15, '#7a4422');
    return finish(p);
  }
  // The big navy rug with pale vines, little birds and cream flowers, laid flat.
  function birdRug() {
    const W = 96, H = 112, p = new Pix(W, H), base = '#3c465a', band = '#56607a', vine = '#7e8aa2', bird = '#c8ccd4', flower = '#e8dcc0';
    p.rect(0, 0, W, H, base);
    p.rect(3, 3, W - 6, H - 6, band); p.rect(6, 6, W - 12, H - 12, base);
    for (let x = 4; x < W - 4; x += 4) { p.set(x, 4, flower); p.set(x, H - 5, flower); }
    for (let y = 4; y < H - 4; y += 4) { p.set(4, y, flower); p.set(W - 5, y, flower); }
    // vines and leaves across the field
    for (let i = 0; i < 46; i++) {
      const x = 9 + Math.floor(G.hash(i, 3, 61) * (W - 20)), y = 9 + Math.floor(G.hash(i, 5, 61) * (H - 20));
      p.set(x, y, vine); p.set(x + 1, y - 1, vine); p.set(x - 1, y - 1, vine); p.set(x, y + 1, '#68748c');
      if (i % 3 === 0) p.set(x + 2, y + 2, flower);
    }
    // a few herons
    for (const [x, y] of [[24, 30], [66, 52], [30, 80], [70, 92]]) {
      p.vline(x, y - 5, y, bird); p.set(x + 1, y - 5, bird); p.set(x + 2, y - 5, bird); p.rect(x - 3, y, 4, 2, bird); p.vline(x - 2, y + 2, y + 5, bird); p.vline(x, y + 2, y + 5, bird);
    }
    return p.canvas();
  }
  // The little cream end table with a drawer, and a brass lamp with a crystal shade.
  function condoEndTable() {
    const W = 16, H = 34, p = new Pix(W, H), cream = '#f0e8d4', creamD = '#d4c8b0';
    for (let y = 0; y < 8; y++) { const half = 2 + Math.round(y * 0.8); p.hline(8 - half, 7 + half, y, (y + (y >> 1)) % 3 ? '#e4ecf2' : '#ffffff'); }
    p.set(6, 3, '#ffffff'); p.set(10, 5, '#c8d8e8');
    p.vline(7, 8, 13, BRASS); p.vline(8, 8, 13, '#b08a38'); p.rect(5, 14, 6, 2, BRASS);
    p.rect(0, 16, 16, 3, cream); p.hline(0, 15, 16, '#fbf6ea');
    p.rect(1, 19, 14, 5, cream); p.hline(1, 14, 23, creamD); p.set(8, 21, '#5a3a24');
    for (const x of [1, 14]) p.vline(x, 24, 33, creamD);
    return finish(p);
  }
  // The white cabinet with glass doors, a pleated-shade lamp and a few books on top.
  function glassCabinet() {
    const W = 20, H = 36, p = new Pix(W, H);
    p.rect(3, 0, 8, 6, '#f4f0e6'); for (let x = 4; x < 11; x += 2) p.vline(x, 1, 5, '#dcd6c8');
    p.vline(7, 6, 10, BRASS); p.rect(5, 10, 5, 2, BRASS);
    p.rect(12, 9, 7, 3, '#4a6a8a'); p.rect(12, 7, 6, 2, '#c8a868');
    p.rect(0, 12, 20, 22, WHITE); p.hline(0, 19, 12, '#ffffff'); p.hline(0, 19, 33, WHITE_D);
    for (const x of [2, 10]) { p.rect(x, 14, 8, 17, '#aebcc8'); p.hline(x, x + 7, 22, WHITE); p.set(x + 1, 15, '#e0ecf4'); p.rect(x + 2, 17, 3, 4, '#8a6a4a'); p.rect(x + 2, 25, 4, 4, '#c8a878'); }
    p.vline(9, 18, 22, '#c8ccd2'); p.vline(11, 18, 22, '#c8ccd2');
    p.rect(1, 34, 2, 2, WHITE_D); p.rect(17, 34, 2, 2, WHITE_D);
    return finish(p);
  }
  // Romulus's plush bed, and his food and water bowls on a little wooden stand.
  function dogBed() {
    const W = 30, H = 18, p = new Pix(W, H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const e = ((x + 0.5 - 15) / 15) ** 2 + ((y + 0.5 - 9) / 9) ** 2;
      if (e > 1) continue;
      p.set(x, y, e > 0.5 ? (y < 9 ? '#d8ccba' : '#b8aa96') : (x + y) % 5 === 0 ? '#e4dccc' : '#f0eadf');
    }
    return finish(p);
  }
  function dogBowls() {
    const W = 22, H = 11, p = new Pix(W, H);
    p.rect(0, 4, 22, 5, '#a8784a'); p.hline(0, 21, 4, '#c8945e'); p.rect(1, 9, 2, 2, '#7a5430'); p.rect(19, 9, 2, 2, '#7a5430');
    for (const [x, fill] of [[2, '#8a5a30'], [12, '#78b8e8']]) { p.rect(x, 1, 8, 4, '#c8ccd2'); p.hline(x, x + 7, 1, '#e8ecf0'); p.rect(x + 1, 2, 6, 2, fill); }
    return finish(p);
  }
  // A small dark wood chest of drawers by the window, with a pothos on top.
  function smallChest() {
    const W = 16, H = 26, p = new Pix(W, H);
    for (const [x, y] of [[4, 2], [9, 1], [11, 4], [3, 5], [7, 4]]) { p.rect(x, y, 3, 2, '#4a8a44'); p.set(x, y, '#6aaa5a'); }
    p.rect(5, 6, 6, 4, '#c8724a'); p.hline(5, 10, 6, '#e08a5a');
    p.rect(0, 10, 16, 2, '#6a3e28'); p.rect(1, 12, 14, 12, '#5a3220');
    for (const y of [15, 19]) { p.hline(1, 14, y - 1, '#3e2214'); p.set(5, y + 1, BRASS); p.set(10, y + 1, BRASS); }
    p.rect(1, 24, 2, 2, '#3e2214'); p.rect(13, 24, 2, 2, '#3e2214');
    return finish(p);
  }

  // ---- the rest of Abe and Hannah's (from the user's photos)
  // Kitchen: a runner rug and a crock of wooden spoons.
  function kitchenRunner() {
    const W = 66, H = 22, p = new Pix(W, H);
    p.rect(0, 0, W, H, '#e8e2d2');
    for (let x = 0; x < W; x += 2) { p.set(x, 0, '#d4ccb8'); p.set(x, H - 1, '#d4ccb8'); }
    p.rect(4, 4, W - 8, H - 8, '#9a9ca2'); p.rect(6, 6, W - 12, H - 12, '#a8aab0');
    for (let x = 8; x < W - 8; x += 4) p.set(x, 10, '#c8cad0');
    return p.canvas();
  }
  function utensilCrock() {
    const p = new Pix(9, 14);
    for (const [x, y] of [[2, 0], [4, 1], [6, 0], [3, 2]]) { p.vline(x, y, 6, '#c8945e'); p.set(x, y, '#a87444'); }
    p.rect(1, 6, 7, 8, '#7a4a28'); p.hline(1, 7, 6, '#9a6234'); p.vline(2, 7, 12, '#9a6234');
    return finish(p);
  }
  // Downstairs bath: a fluffy white bath mat, and a little wicker basket on the toilet tank.
  function bathMat() {
    const W = 28, H = 12, p = new Pix(W, H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if ((x < 2 || x > W - 3) && (y < 2 || y > H - 3)) continue;
      p.set(x, y, (x * 3 + y * 5) % 7 === 0 ? '#e4e2dc' : '#f6f4ee');
    }
    return p.canvas();
  }
  function tankBasket() {
    const p = new Pix(10, 6);
    p.rect(0, 1, 10, 5, '#c8a068'); for (let x = 1; x < 10; x += 2) p.vline(x, 1, 5, '#a88048'); p.hline(0, 9, 1, '#e0bc84');
    p.rect(2, 0, 3, 2, '#e8f0f0'); p.rect(6, 0, 2, 2, '#78c0b0');
    return finish(p);
  }
  // Downstairs bedroom: the bed in rumpled white bedding (head against the wall on the right),
  // a white nightstand with an amber glass-ball lamp under a burlap shade, a dark wood one
  // with a white-shaded lamp, a cream dresser with brass pulls, and a white ceiling fan.
  function condoBed() {
    const W = 50, H = 44, p = new Pix(W, H), wh = '#f6f4ee', whD = '#dcd8ce', whS = '#c8c4b8';
    const gr = '#6aa87a', grD = '#4e8a5e', grL = '#8ac49a';
    // green and white sheets: the duvet in wide stripes running across the bed, softly rumpled
    const stripe = (x, y, dark) => ((x >> 2) % 2 ? (dark ? grD : gr) : (dark ? whD : wh));
    for (let y = 2; y < 28; y++) for (let x = 1; x < 33; x++) p.set(x, y, stripe(x, y, false));
    for (let i = 0; i < 22; i++) {
      const x = 3 + Math.floor(G.hash(i, 1, 71) * 28), y = 5 + Math.floor(G.hash(i, 2, 71) * 20);
      for (let k = 0; k <= 3 + (i % 3); k++) p.set(x + k, y, stripe(x + k, y, true));
    }
    // the top sheet turned down at the head: white with a green band
    p.rect(30, 2, 4, 26, wh); p.vline(31, 2, 27, gr); p.vline(33, 2, 27, whD);
    // pillows: green pillowcases with white edges
    for (const y of [3, 15]) { p.rect(36, y, 12, 10, grL); p.hline(36, 47, y, '#ffffff'); p.vline(36, y, y + 9, '#ffffff'); p.hline(36, 47, y + 9, gr); }
    p.rect(34, 2, 2, 26, wh); p.vline(48, 2, 27, whS);
    // the front: the striped duvet hanging over the side, then the white bed skirt and the frame
    for (let y = 28; y < 34; y++) for (let x = 1; x < 49; x++) p.set(x, y, x >= 30 ? (y === 28 ? wh : whD) : stripe(x, y, y > 30));
    p.rect(2, 34, 46, 8, wh); for (let x = 3; x < 48; x += 3) p.vline(x, 35, 41, whD);
    p.rect(2, 42, 2, 2, '#2a2a30'); p.rect(46, 42, 2, 2, '#2a2a30');
    return finish(p);
  }
  function nightstandAmber() {
    const W = 16, H = 38, p = new Pix(W, H);
    // the burlap shade, the stacked amber glass balls, the brass foot
    for (let y = 0; y < 9; y++) { const half = 4 + Math.round(y * 0.5); p.hline(8 - half, 7 + half, y, (y * 3 + half) % 4 ? '#c8a060' : '#b08a4c'); }
    p.hline(3, 12, 9, '#e8d8a8');
    for (const [y, r] of [[12, 2], [16, 3], [21, 2]]) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (dx * dx + dy * dy <= r * r + 1) p.set(7 + dx, y + dy, dx + dy < 0 ? '#f8b840' : '#d88a18');
    p.rect(5, 24, 6, 2, '#8a7040');
    p.rect(0, 26, 16, 3, WHITE); p.hline(0, 15, 26, '#ffffff');
    p.rect(1, 29, 14, 4, WHITE); p.hline(1, 14, 32, WHITE_D); p.set(8, 31, '#c8c8c8');
    for (const x of [1, 14]) p.vline(x, 33, 37, WHITE_D);
    return finish(p);
  }
  function nightstandDark() {
    const W = 16, H = 36, p = new Pix(W, H);
    for (let y = 0; y < 8; y++) { const half = 3 + Math.round(y * 0.5); p.hline(8 - half, 7 + half, y, '#f6f4ee'); }
    p.hline(3, 12, 7, '#dcd8ce');
    p.vline(7, 8, 18, '#d8a040'); p.vline(8, 8, 18, '#b08030'); p.rect(5, 18, 6, 3, '#c89040');
    p.rect(0, 21, 16, 3, '#6a3e28'); p.hline(0, 15, 21, '#8a5638');
    p.rect(1, 24, 14, 10, '#5a3220'); p.hline(1, 14, 28, '#3e2214'); p.set(7, 26, BRASS); p.set(7, 31, BRASS);
    p.rect(1, 34, 2, 2, '#3e2214'); p.rect(13, 34, 2, 2, '#3e2214');
    return finish(p);
  }
  function creamDresser() {
    const W = 18, H = 30, p = new Pix(W, H), c = '#f2ead8', cD = '#d8ccb4';
    p.rect(0, 0, 18, 3, c); p.hline(0, 17, 0, '#fbf6ea');
    p.rect(1, 3, 16, 24, c);
    for (const y of [3, 11, 19]) {
      p.hline(1, 16, y, cD);
      // brass bail pulls
      for (const x of [4, 12]) { p.hline(x - 1, x + 1, y + 4, BRASS); p.set(x - 1, y + 3, '#a8822e'); p.set(x + 1, y + 3, '#a8822e'); }
    }
    p.hline(1, 16, 26, cD); p.rect(1, 27, 3, 3, cD); p.rect(14, 27, 3, 3, cD); p.rect(5, 27, 8, 1, cD);
    return finish(p);
  }
  // a white ceiling fan, seen from below at an angle; f turns the blades (4 frames go round)
  function ceilingFan(f) {
    const W = 48, H = 22, p = new Pix(W, H);
    for (let b = 0; b < 5; b++) {
      const a = (b / 5 + f / 20) * Math.PI * 2;
      for (let r = 4; r < 22; r++) {
        const x = Math.round(24 + Math.cos(a) * r), y = Math.round(10 + Math.sin(a) * r * 0.38);
        for (const dx of [-1, 0, 1]) p.set(x + dx, y, '#f0eee8');
        p.set(x, y + 1, '#d8d4cc');
      }
    }
    p.rect(20, 7, 9, 6, '#f8f6f0'); p.hline(20, 28, 7, '#ffffff');
    p.rect(21, 13, 7, 4, '#fff4d8'); p.hline(22, 26, 16, '#f0e0b0');
    p.vline(24, 0, 6, '#e8e6e0');
    return finish(p);
  }
  // Upstairs loft: the TV on its cherry console (showing the ocean), the big gray ottoman with
  // a game of cards on it, the light gray couch (from behind) with striped pillows and a sherpa
  // throw, a dark wood bookshelf with flowers on top and a little lighthouse lamp, a brass floor
  // lamp, Abe's yellow electric guitar, and teal curtains.
  function loftTV() {
    const W = 52, H = 46, p = new Pix(W, H);
    p.rect(2, 0, 48, 28, '#16161c'); p.rect(4, 2, 44, 24, '#2a5ab8');
    p.rect(4, 2, 44, 10, '#4a8ad8'); p.hline(4, 47, 12, '#a8d0f0'); p.rect(4, 13, 44, 13, '#1e48a0');
    for (let i = 0; i < 9; i++) p.hline(6 + i * 5, 8 + i * 5, 16 + (i % 3) * 3, '#3a6ac8');
    p.rect(22, 28, 8, 2, '#16161c');
    p.rect(0, 30, 52, 3, '#7a3a24'); p.hline(0, 51, 30, '#9a5234');
    p.rect(1, 33, 50, 11, '#5e2c1c');
    for (const x of [2, 18, 34]) { p.rect(x, 35, 15, 7, '#4a2214'); p.rect(x + 1, 36, 13, 5, '#6a3422'); p.set(x + 7, 38, BRASS); }
    p.rect(1, 44, 3, 2, '#3e1c10'); p.rect(48, 44, 3, 2, '#3e1c10');
    p.rect(40, 26, 3, 4, '#c8ccd2'); p.rect(44, 27, 2, 3, '#e86868');
    return finish(p);
  }
  function grayOttoman() {
    const W = 48, H = 22, p = new Pix(W, H), c = '#c4c0b8', cL = '#d8d4cc', cD = '#a8a49c';
    p.rect(0, 0, 48, 13, c); p.hline(0, 47, 0, cL); p.vline(0, 0, 12, cL);
    p.rect(0, 13, 48, 7, cD); p.hline(0, 47, 13, c);
    p.rect(1, 20, 3, 2, '#3a2a20'); p.rect(44, 20, 3, 2, '#3a2a20');
    // a game of cards, mid-hand
    for (const [x, y] of [[10, 4], [14, 3], [27, 5], [31, 4], [36, 7]]) { p.rect(x, y, 4, 5, '#f8f8f4'); p.set(x + 1, y + 1, (x + y) % 2 ? '#d83040' : '#2a2a30'); }
    return finish(p);
  }
  function loftSofaBack() {
    const W = 80, H = 26, p = new Pix(W, H), c = '#b8b4ac', cL = '#ccc8c0', cD = '#9a968e';
    // pillows peeking over the back: striped, navy, striped
    for (const [x, navy] of [[6, false], [22, true], [52, false], [64, false]]) {
      p.rect(x, 0, 12, 7, navy ? '#2a3458' : '#f0ece4');
      if (!navy) for (let xx = x + 1; xx < x + 12; xx += 3) p.vline(xx, 0, 6, xx % 2 ? '#a8b8d8' : '#e8b8c0');
    }
    p.rect(0, 5, 80, 14, c); p.hline(0, 79, 5, cL);
    for (let x = 0; x < 80; x += 3) for (let y = 7; y < 18; y += 3) p.set(x + (y % 2), y, cD);
    // the sherpa throw over the back
    p.rect(30, 4, 18, 12, '#f6f2e8'); for (let i = 0; i < 20; i++) p.set(31 + (i * 7) % 16, 5 + (i * 5) % 10, '#e4dccc');
    p.rect(0, 19, 80, 4, cD); p.rect(2, 23, 3, 3, '#3a2a20'); p.rect(75, 23, 3, 3, '#3a2a20');
    return finish(p);
  }
  function condoBookshelf() {
    const W = 20, H = 54, p = new Pix(W, H), wd = '#4a2c1c', wdL = '#6a4028';
    // the vase of flowers on top
    p.rect(8, 6, 4, 6, '#5a6ab8'); for (const [x, y, c] of [[7, 2, '#e8a0c8'], [10, 1, '#f8a040'], [12, 3, '#f8f0e8'], [9, 4, '#c84868'], [11, 5, '#4a8a44']]) p.rect(x, y, 2, 2, c);
    p.rect(0, 12, 20, 42, wd); p.hline(0, 19, 12, wdL);
    const cols = ['#e8e0d0', '#3a5a8a', '#c86a3a', '#4a7a4a', '#e8c060', '#8a3a3a', '#2a2a40', '#d8d0b8', '#5a8aa8'];
    for (const y of [15, 25, 35]) {
      p.rect(2, y, 16, 8, '#2e1a10');
      for (let x = 2; x < 18; x++) if ((x * 7 + y) % 9 !== 0) p.vline(x, y + 1 + ((x + y) % 3 === 0 ? 1 : 0), y + 7, cols[(x * 5 + y) % cols.length]);
    }
    // the bottom shelf: a few books and the little lighthouse lamp, glowing
    p.rect(2, 45, 16, 7, '#2e1a10'); for (let x = 2; x < 9; x++) p.vline(x, 47, 51, cols[(x * 3) % cols.length]);
    p.rect(12, 47, 3, 5, '#f8f0e0'); p.hline(12, 14, 48, '#d83838'); p.rect(12, 45, 3, 2, '#f8d878');
    return finish(p);
  }
  function condoFloorLamp() {
    const W = 16, H = 48, p = new Pix(W, H);
    for (let y = 0; y < 13; y++) { const half = 4 + Math.round(y * 0.3); for (let x = 8 - half; x <= 7 + half; x++) p.set(x, y, (x + y) % 3 === 0 ? '#f0e4c0' : '#fbf2d8'); }
    p.vline(7, 13, 45, '#d8a848'); p.vline(8, 13, 45, '#b08430'); p.rect(4, 45, 8, 3, '#b08430');
    return finish(p);
  }
  function yellowGuitar() {
    const W = 12, H = 32, p = new Pix(W, H);
    p.rect(4, 0, 4, 4, '#e8c888'); p.set(3, 1, '#c8ccd2'); p.set(8, 2, '#c8ccd2');
    p.rect(5, 4, 2, 13, '#e8c888'); for (let y = 6; y < 17; y += 3) p.set(5, y, '#8a6a3a');
    for (let y = 17; y < 31; y++) { const half = y < 22 ? 3 : y < 25 ? 4 : 5; p.hline(6 - half, 5 + half, y, '#e8b040'); }
    p.rect(3, 22, 4, 6, '#f8f6f0'); p.hline(4, 8, 25, '#c8ccd2'); p.set(8, 27, '#2a2a30');
    return finish(p);
  }
  function tealCurtain() {
    const W = 5, H = 44, p = new Pix(W, H);
    p.hline(0, 4, 0, '#8a8c92');
    for (let y = 1; y < H; y++) for (let x = 0; x < W; x++) p.set(x, y, x % 2 ? '#3a7a7c' : '#4e9294');
    return finish(p);
  }

  // ---- the upstairs walk-in closet (from the user's photo): junk, and guitars
  // The white shelves, crammed: a gray bin, a flowered bag and a box on top, a coil of
  // (yellow, of course) guitar cable and a framed signed jersey number 5, a LEGO Technic
  // box and a shoe box, a pink box and folded black clothes, a white basket and a black case.
  function closetShelves() {
    const W = 34, H = 62, p = new Pix(W, H);
    p.rect(0, 0, 34, 62, WHITE); p.vline(33, 0, 61, WHITE_D);
    const shelf = (y) => { p.hline(1, 32, y, '#ffffff'); p.hline(1, 32, y + 1, WHITE_D); };
    for (const y of [12, 24, 36, 48]) shelf(y);
    for (const [y0, y1] of [[1, 11], [14, 23], [26, 35], [38, 47], [50, 60]]) p.rect(2, y0, 30, y1 - y0 + 1, '#e8e6e0');
    // top: a gray fabric bin, a flowered bag, a cardboard box
    p.rect(3, 3, 9, 8, '#9a9ca2'); p.hline(3, 11, 3, '#b8bac0');
    p.rect(13, 4, 8, 7, '#2a3a5a'); for (const [x, y, c] of [[14, 5, '#e87a3a'], [17, 7, '#e8c048'], [19, 5, '#d84868'], [15, 9, '#78c0b0']]) p.rect(x, y, 2, 2, c);
    p.rect(22, 5, 10, 6, '#c8a06a'); p.hline(22, 31, 5, '#d8b47e'); p.vline(27, 5, 10, '#a88048');
    // a coil of yellow guitar cable, and the framed jersey number 5 (signed all over)
    cableCoil(p, 9, 19, 5);
    p.rect(17, 14, 13, 9, '#1c1c22'); p.rect(18, 15, 11, 7, '#f8f8f4');
    p.rect(22, 16, 3, 1, '#1c1c22'); p.set(22, 17, '#1c1c22'); p.rect(22, 18, 3, 1, '#1c1c22'); p.set(24, 19, '#1c1c22'); p.rect(22, 20, 3, 1, '#1c1c22');
    for (const [x, y] of [[19, 16], [26, 17], [19, 20], [27, 20], [20, 18]]) p.set(x, y, '#5a5a6a');
    // a LEGO Technic box, a shoe box
    p.rect(3, 29, 16, 7, '#1c1c22'); p.rect(4, 30, 3, 2, '#e83030'); p.rect(4, 32, 3, 1, '#f8d040'); p.hline(9, 17, 31, '#c8ccd2');
    p.rect(20, 30, 11, 6, '#f4f4f0'); p.hline(20, 30, 30, '#3a6ac8'); p.rect(23, 32, 4, 2, '#3a6ac8');
    // a pink box, folded black clothes
    p.rect(3, 41, 11, 7, '#e8909a'); p.hline(3, 13, 41, '#f8b0b8'); p.rect(16, 42, 14, 6, '#2a2a30'); p.hline(16, 29, 44, '#3a3a42');
    // a white basket full of odds and ends, a black case
    p.rect(3, 53, 13, 7, '#f4f4f0'); for (let x = 4; x < 16; x += 2) p.vline(x, 54, 59, '#dcdad4'); p.rect(5, 51, 3, 2, '#3a6ac8'); p.rect(10, 50, 4, 3, '#f8f8f4');
    p.rect(18, 52, 13, 8, '#22222a'); p.hline(18, 30, 52, '#3a3a44'); p.rect(23, 55, 3, 1, '#8a8a92');
    return finish(p);
  }
  // Jackets on the rod: black, brown, a red plaid shirt, olive, and a white garment bag.
  function hangingClothes() {
    const W = 48, H = 36, p = new Pix(W, H);
    p.hline(0, 47, 0, '#9aa0a8');
    const coat = (x, w, c, plaid) => {
      p.set(x + (w >> 1), 1, '#e8e8e8'); p.hline(x + 1, x + w - 2, 2, '#e8e8e8');
      for (let y = 3; y < H - 2; y++) for (let i = 0; i < w; i++) {
        const col = plaid ? (((i >> 1) + (y >> 1)) % 2 ? '#a82828' : '#1c1c22') : i === 0 ? shade(c, -0.2) : c;
        p.set(x + i, y, col);
      }
    };
    coat(0, 9, '#26262c'); coat(8, 9, '#6a4428'); coat(16, 8, null, true); coat(23, 8, '#5a6040');
    // the garment bag, a little see-through
    p.hline(31, 46, 2, '#e8e8e8');
    for (let y = 3; y < H; y++) for (let x = 31; x < 47; x++) p.set(x, y, (x + y) % 5 === 0 ? '#dcdcdc' : '#f4f4f4');
    p.rect(35, 10, 6, 10, '#c8c8cc');
    return finish(p);
  }
  // Abe's guitars: two on stands, two hard cases, and a little amp.
  function guitarOnStand(kind) {
    const W = 16, H = 38, p = new Pix(W, H), acoustic = kind === 'acoustic';
    p.vline(8, 30, 37, '#2a2a30'); p.hline(4, 12, 37, '#2a2a30'); p.set(5, 36, '#2a2a30'); p.set(11, 36, '#2a2a30');
    p.rect(6, 0, 4, 4, acoustic ? '#3a2418' : '#1c1c22'); p.set(5, 1, '#c8ccd2'); p.set(10, 1, '#c8ccd2'); p.set(5, 3, '#c8ccd2'); p.set(10, 3, '#c8ccd2');
    p.rect(7, 4, 2, 13, acoustic ? '#6a4428' : '#e8c888');
    if (acoustic) {
      // a sunburst acoustic
      for (let y = 17; y < 33; y++) { const half = y < 22 ? 5 : y < 25 ? 4 : 6; for (let x = 8 - half; x < 8 + half; x++) { const e = Math.abs(x - 7.5) / half; p.set(x, y, e > 0.75 ? '#3a1c10' : e > 0.45 ? '#a8501c' : '#e8a040'); } }
      for (let y = 23; y < 27; y++) for (let x = 6; x < 10; x++) if ((x - 7.5) ** 2 + (y - 25) ** 2 <= 4) p.set(x, y, '#1c1c22');
      p.hline(5, 10, 30, '#2a1810');
    } else {
      // a black electric with a white pickguard
      for (let y = 17; y < 32; y++) { const half = y < 21 ? 4 : y < 24 ? 3 : 5; p.hline(8 - half, 7 + half, y, '#1c1c22'); }
      p.rect(5, 21, 5, 8, '#f8f8f4'); p.hline(6, 9, 24, '#c8ccd2'); p.hline(6, 9, 27, '#c8ccd2');
    }
    return finish(p);
  }
  function guitarCase(kind) {
    const W = 16, H = 36, p = new Pix(W, H), tweed = kind === 'tweed';
    const c = tweed ? '#c8a874' : '#1c1c22', cD = tweed ? '#8a6a44' : '#0e0e12', cL = tweed ? '#e0c494' : '#3a3a44';
    for (let y = 0; y < H; y++) {
      const half = y < 12 ? 3 : y < 18 ? 4 + Math.round((y - 12) / 3) : y < 24 ? 6 : 7;
      for (let x = 8 - half; x < 8 + half; x++) p.set(x, y, tweed && (x + y) % 3 === 0 ? cD : c);
    }
    p.vline(8 - 6, 18, 34, cL); p.set(8, 1, cL);
    if (tweed) { p.hline(1, 14, 26, '#6a3a1c'); p.rect(6, 22, 4, 2, '#4a2a14'); }
    else { p.rect(6, 22, 4, 2, '#8a8a92'); for (const y of [10, 30]) p.set(8, y, '#8a8a92'); }
    return finish(p);
  }
  function miniAmp() {
    const W = 18, H = 16, p = new Pix(W, H);
    p.rect(0, 0, 18, 15, '#1c1c22'); p.hline(0, 17, 0, '#3a3a44');
    p.rect(2, 2, 14, 3, '#2a2a30'); for (const x of [4, 8, 12]) p.set(x, 3, '#c8ccd2');
    p.rect(2, 6, 14, 8, '#4a4038'); for (let y = 7; y < 14; y += 2) for (let x = 3; x < 16; x += 2) p.set(x, y, '#5e544a');
    p.set(14, 3, '#e83030'); p.rect(1, 15, 2, 1, '#0e0e12'); p.rect(15, 15, 2, 1, '#0e0e12');
    return finish(p);
  }
  // On the floor: boxes, a red zippered storage bag, a gray one, and the ugly Christmas
  // sweater (red, white snowflakes, a gingerbread man) dumped on top.
  function closetJunk() {
    const W = 34, H = 30, p = new Pix(W, H);
    p.rect(1, 8, 14, 14, '#c8a06a'); p.hline(1, 14, 8, '#d8b47e'); p.vline(8, 8, 21, '#a88048');
    p.rect(17, 12, 16, 12, '#8a8c92'); p.hline(17, 32, 12, '#a8aab0'); p.hline(17, 32, 17, '#c8ccd2');
    p.rect(3, 20, 18, 9, '#c83838'); p.hline(3, 20, 20, '#e85858'); p.hline(4, 19, 24, '#a82828'); for (let x = 5; x < 20; x += 3) p.set(x, 22, '#e8a0a0');
    // the sweater
    for (let y = 0; y < 12; y++) for (let x = 10; x < 30; x++) {
      if ((x < 13 || x > 26) && y > 7) continue;
      p.set(x, y, (x + y * 2) % 7 === 0 ? '#f8f8f4' : y === 3 || y === 9 ? '#2a6a3a' : '#c82828');
    }
    p.rect(18, 4, 3, 3, '#a8662e'); p.set(19, 3, '#a8662e'); p.set(17, 5, '#a8662e'); p.set(21, 5, '#a8662e'); p.set(18, 7, '#a8662e'); p.set(20, 7, '#a8662e');
    return finish(p);
  }

  // ---- Anette's thirsty plants (her side quest on the condo street)
  // A potted plant, droopy (dry, yellowed leaves hanging over the rim) or perked up and blooming.
  function pottedPlant(kind, happy) {
    const W = 18, H = 24, p = new Pix(W, H);
    const pot = { hydrangea: ['#c06a40', '#d8845a', '#9a4e2c'], petunia: ['#e8e4dc', '#f8f6f0', '#c8c0b2'], fern: ['#5a7aa8', '#7a9ac8', '#3e5a88'],
      geranium: ['#c06a40', '#d8845a', '#9a4e2c'], rose: ['#3a4a3a', '#5a6a5a', '#2a3428'] }[kind];
    const bloom = { hydrangea: ['#7a9ae8', '#a8b8f0', '#5a72c8'], petunia: ['#a050c8', '#d090e8', '#7a3aa0'], fern: null,
      geranium: ['#e04040', '#f87070', '#a82828'], rose: ['#e86890', '#f8a0b8', '#b84a6a'] }[kind];
    // the pot
    for (let y = 15; y < 24; y++) { const half = 6 - Math.floor((y - 15) / 3); p.hline(9 - half, 8 + half, y, pot[0]); p.set(8 + half, y, pot[2]); }
    p.rect(2, 14, 14, 2, pot[1]); p.hline(2, 15, 15, pot[0]);
    if (!happy) {
      // dry: yellow-brown leaves flopped over the rim, a couple of dead blooms
      for (const [x0, dir] of [[5, -1], [8, -1], [10, 1], [13, 1]]) for (let i = 0; i < 6; i++) {
        const x = x0 + dir * Math.floor(i / 2), y = 9 + i;
        p.set(x, y, i % 2 ? '#a08a48' : '#8a9a48'); p.set(x + dir, y, '#7a6a38');
      }
      p.rect(7, 8, 4, 6, '#7a8a40'); p.set(8, 7, '#8a7a5a'); p.set(10, 7, '#8a7a5a');
      return finish(p);
    }
    // perked up: green leaves standing tall
    if (kind === 'fern') {
      for (const [dx, h] of [[-6, 9], [-3, 12], [0, 13], [3, 12], [6, 9]]) for (let i = 0; i < h; i++) {
        const x = 9 + Math.round(dx * i / h), y = 14 - i;
        p.set(x, y, '#3e8a3a'); if (i % 2) { p.set(x - 1, y, '#5aa848'); p.set(x + 1, y, '#5aa848'); }
      }
      return finish(p);
    }
    for (let y = 3; y < 15; y++) for (let x = 2; x < 16; x++) if (((x - 9) / 7) ** 2 + ((y - 9) / 6) ** 2 <= 1) p.set(x, y, (x + y) % 3 ? '#3e8a3a' : '#5aa848');
    // and its flowers
    const spots = kind === 'hydrangea' ? [[6, 5, 3], [12, 6, 3], [9, 9, 2]] : [[5, 5, 1], [9, 4, 1], [13, 6, 1], [7, 9, 1], [11, 10, 1], [4, 11, 1], [14, 11, 1]];
    for (const [cx, cy, r] of spots) for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r + 1) p.set(cx + x, cy + y, x + y < 0 ? bloom[1] : (x + y) % 2 ? bloom[2] : bloom[0]);
    return finish(p);
  }

  // ---- Abe's office / the spare room (from the user's photos, tidied up)
  // The spare bed: a black iron headboard (on the left, against the wall), a white comforter
  // with gray vines, gray pillows and a rust paisley one. Made, for once.
  function guestBed() {
    const W = 52, H = 50, p = new Pix(W, H), iron = '#24242a', ironL = '#4a4a54';
    // the iron headboard: a rounded top rail over vertical bars
    p.vline(1, 2, 49, iron); p.vline(2, 2, 49, ironL);
    for (let y = 2; y < 40; y++) { const x = 1 + Math.round(Math.max(0, 5 - Math.abs(y - 21) / 4)); p.set(x, y, iron); }
    for (let y = 6; y < 38; y += 4) p.hline(2, 5, y, iron);
    p.vline(5, 4, 38, iron);
    // the mattress top: gray sheets showing at the head, the comforter with its vine print
    p.rect(6, 8, 45, 26, '#9a9ca4');
    for (let y = 8; y < 34; y++) for (let x = 16; x < 51; x++) p.set(x, y, '#f4f2ee');
    // little gray vines and leaves scattered across it
    for (let i = 0; i < 26; i++) {
      const x = 18 + Math.floor(G.hash(i, 1, 91) * 30), y = 10 + Math.floor(G.hash(i, 2, 91) * 22);
      p.set(x, y, '#a8acb4'); p.set(x + 1, y - 1, '#a8acb4'); if (i % 2) p.set(x - 1, y - 1, '#c4c8ce');
    }
    p.vline(16, 8, 33, '#dcdad4');
    // pillows: two gray ones, and the rust paisley one leaning on them
    for (const y of [9, 21]) { p.rect(7, y, 8, 11, '#7a7e88'); p.hline(7, 14, y, '#9a9ea8'); }
    p.rect(9, 14, 6, 9, '#a8584a'); for (const [x, y] of [[10, 15], [12, 18], [10, 20], [13, 21]]) p.set(x, y, '#e8c8b8');
    // the front: the comforter hanging over the side, then the dark frame and legs
    for (let y = 34; y < 42; y++) for (let x = 6; x < 51; x++) p.set(x, y, x < 16 ? '#8a8c94' : (x * 5 + y * 3) % 13 === 0 ? '#b0b4bc' : '#e8e6e0');
    p.rect(6, 42, 45, 3, '#3a3a42'); p.rect(48, 45, 2, 5, iron);
    return finish(p);
  }
  // The white desk: two monitors up on a little wooden riser, a keyboard, a mug, a can.
  function officeDesk() {
    const W = 50, H = 42, p = new Pix(W, H);
    for (const x of [4, 24]) { p.rect(x, 0, 21, 14, '#16161c'); p.rect(x + 1, 1, 19, 12, '#2a2e3a'); p.hline(x + 2, x + 8, 2, '#4a5468'); }
    p.rect(22, 0, 6, 2, '#2a2a30'); p.rect(23, 0, 4, 1, '#8a8a92');
    p.rect(12, 14, 3, 3, '#16161c'); p.rect(34, 14, 3, 3, '#16161c');
    p.rect(6, 17, 38, 4, '#c8a06a'); p.hline(6, 43, 17, '#e0bc84');
    p.rect(0, 21, 50, 3, '#8a8c92'); p.hline(0, 49, 21, '#a8aab0');
    p.rect(14, 22, 20, 2, '#1c1c22'); p.hline(15, 32, 22, '#3a3a44');
    p.rect(38, 18, 4, 4, '#f4f4f0'); p.set(42, 19, '#f4f4f0'); p.rect(8, 18, 3, 4, '#3a9a5a');
    p.rect(0, 24, 50, 2, '#f4f4f0');
    for (const x of [1, 47]) p.rect(x, 26, 2, 16, '#f4f4f0');
    p.hline(3, 46, 30, '#e0e0dc');
    return finish(p);
  }
  // A gray mesh office chair with a white frame, from behind.
  function officeChair() {
    const W = 18, H = 28, p = new Pix(W, H);
    p.rect(3, 0, 12, 13, '#f0f0ec'); p.rect(4, 1, 10, 11, '#7a7e88'); for (let y = 2; y < 12; y += 2) p.hline(5, 12, y, '#8a8e98');
    p.rect(1, 12, 3, 6, '#f0f0ec'); p.rect(14, 12, 3, 6, '#f0f0ec');
    p.rect(3, 15, 12, 5, '#6a6e78'); p.vline(8, 20, 23, '#c8ccd2'); p.vline(9, 20, 23, '#f0f0ec');
    p.hline(2, 15, 24, '#f0f0ec'); for (const x of [2, 8, 15]) p.rect(x, 25, 2, 2, '#3a3a42');
    return finish(p);
  }
  function blackFloorLamp() {
    const W = 16, H = 48, p = new Pix(W, H);
    for (let y = 0; y < 11; y++) p.hline(3, 12, y, y < 2 ? '#fffbf0' : (y % 3 === 0 ? '#f0ead8' : '#f8f4e8'));
    p.hline(3, 12, 10, '#e0d8c4');
    p.vline(7, 11, 44, '#24242a'); p.vline(8, 11, 44, '#3a3a42'); p.rect(4, 44, 8, 3, '#24242a');
    return finish(p);
  }
  // A dark wood chest at the foot of the bed, brass corners and latch.
  function woodChest() {
    const W = 18, H = 34, p = new Pix(W, H), wd = '#4a2a1c', wdL = '#6a3e28';
    p.rect(0, 0, 18, 26, wdL); p.hline(0, 17, 0, '#8a5638'); for (let y = 6; y < 26; y += 7) p.hline(1, 16, y, wd);
    p.rect(0, 26, 18, 8, wd); p.hline(0, 17, 26, '#3a1e12');
    for (const [x, y] of [[0, 0], [16, 0], [0, 24], [16, 24], [0, 32], [16, 32]]) p.rect(x, y, 2, 2, BRASS);
    p.rect(8, 27, 2, 3, BRASS);
    return finish(p);
  }
  // The white cube shelf: books, a whole row of records, two Catan boxes, little speakers, a
  // basket, a lighthouse lamp; a printer, a record player and a pleated lamp up top.
  function cubeShelf() {
    const W = 36, H = 54, p = new Pix(W, H);
    // up top: the printer, the record player, the lamp
    p.rect(1, 6, 11, 7, '#2a2a30'); p.hline(1, 11, 6, '#4a4a54'); p.rect(3, 8, 6, 1, '#6a6a74');
    p.rect(14, 9, 11, 4, '#e8e4dc'); p.rect(15, 9, 8, 2, '#1c1c22'); p.set(19, 9, '#c83838');
    for (let y = 0; y < 5; y++) p.hline(27 - Math.floor(y / 2), 32 + Math.floor(y / 2), y, y % 2 ? '#f0e8d0' : '#f8f2e0');
    p.rect(28, 5, 4, 8, '#e8e0d0'); p.set(29, 7, '#78a888'); p.set(30, 9, '#e898a8');
    // the 4x4 cubes
    p.rect(0, 13, 36, 41, '#f6f4ee'); p.vline(35, 13, 53, '#dcd8ce');
    const cube = (cx, cy) => [2 + cx * 8, 15 + cy * 9];
    for (let cy = 0; cy < 4; cy++) for (let cx = 0; cx < 4; cx++) { const [x, y] = cube(cx, cy); p.rect(x, y, 7, 8, '#3a3a40'); }
    const books = ['#e8e0d0', '#3a5a8a', '#c86a3a', '#4a7a4a', '#e8c060', '#8a3a3a', '#2a2a40', '#5a8aa8'];
    { const [x, y] = cube(0, 0); for (let i = 0; i < 7; i++) p.vline(x + i, y + 1 + (i % 3 === 0 ? 1 : 0), y + 7, books[i]); }
    { const [x, y] = cube(1, 0); p.rect(x + 1, y + 2, 3, 6, '#1c1c22'); p.set(x + 2, y + 4, '#5a5a64'); p.rect(x + 5, y + 4, 2, 4, '#f8f0e0'); p.set(x + 5, y + 3, '#f8d878'); }
    { const [x, y] = cube(2, 0); p.rect(x, y + 3, 7, 5, '#e8e4dc'); p.rect(x + 1, y + 4, 2, 2, '#c8a0b0'); }
    { const [x, y] = cube(3, 0); p.rect(x + 1, y + 2, 3, 6, '#1c1c22'); p.set(x + 2, y + 4, '#5a5a64'); p.rect(x + 4, y + 5, 3, 3, '#2a2a30'); }
    { const [x, y] = cube(0, 1); for (const yy of [y + 2, y + 4, y + 6]) { p.hline(x, x + 6, yy, '#c83030'); p.hline(x, x + 6, yy + 1, '#e8b040'); } }
    { const [x, y] = cube(1, 1); p.rect(x + 2, y + 6, 3, 2, '#e8e4dc'); }
    { const [x, y] = cube(2, 1); p.rect(x, y + 3, 7, 5, '#c8a068'); for (let xx = x; xx < x + 7; xx += 2) p.vline(xx, y + 3, y + 7, '#a88048'); }
    { const [x, y] = cube(3, 1); for (let i = 0; i < 5; i++) p.hline(x, x + 6, y + 3 + i, books[(i + 3) % 8]); }
    for (let cx = 0; cx < 4; cx++) { const [x, y] = cube(cx, 2); for (let i = 0; i < 7; i++) p.vline(x + i, y + 1, y + 7, books[(i * 3 + cx) % 8]); }
    // the bottom row: records, packed in
    for (let cx = 0; cx < 4; cx++) { const [x, y] = cube(cx, 3); for (let i = 0; i < 7; i++) p.vline(x + i, y + 1, y + 7, i % 2 ? '#1c1c22' : ['#c8a878', '#d86a4a', '#5a8ac8', '#e8e0d0'][(i + cx) % 4]); }
    return finish(p);
  }
  // Three more electric guitars leaning in the corner (sunburst, white, black).
  function guitarTrio() {
    const W = 26, H = 44, p = new Pix(W, H);
    const gtr = (x, body, guard) => {
      p.rect(x, 0, 3, 5, '#e8c888'); p.set(x - 1, 1, '#c8ccd2'); p.set(x - 1, 3, '#c8ccd2');
      p.vline(x + 1, 5, 25, '#e8c888'); p.vline(x + 2, 5, 25, '#d8b878');
      for (let y = 25; y < 43; y++) { const half = y < 30 ? 3 : y < 33 ? 2 : 4; for (let xx = x + 1 - half; xx <= x + 2 + half; xx++) p.set(xx, y, typeof body === 'function' ? body(xx - x, y) : body); }
      p.rect(x - 1, 31, 5, 7, guard); p.hline(x, x + 2, 33, '#c8ccd2');
    };
    gtr(4, (dx, y) => (Math.abs(dx - 1.5) > 3 ? '#3a1c10' : Math.abs(dx - 1.5) > 1.5 ? '#a8501c' : '#e8a040'), '#1c1c22');
    gtr(12, '#f0ece0', '#f8f8f4');
    gtr(20, '#1c1c22', '#f8f8f4');
    return finish(p);
  }
  // A little vintage amp: black, a silver grille cloth, a chrome panel.
  function vibroAmp() {
    const W = 22, H = 18, p = new Pix(W, H);
    p.rect(0, 0, 22, 17, '#1c1c22'); p.hline(0, 21, 0, '#3a3a44');
    p.rect(2, 2, 18, 3, '#c8ccd2'); for (const x of [4, 8, 12, 16]) p.set(x, 3, '#2a2a30'); p.set(18, 3, '#e83030');
    p.rect(2, 6, 18, 9, '#a8acb4'); for (let y = 7; y < 15; y += 2) for (let x = 3; x < 20; x += 2) p.set(x, y, '#8a8e96');
    p.rect(2, 17, 3, 1, '#0e0e12'); p.rect(17, 17, 3, 1, '#0e0e12');
    return finish(p);
  }
  // Two framed vintage guitar ads, stacked (wood frames, white mats, old paintings with speech bubbles).
  function guitarAdPrints() {
    const W = 14, H = 30, p = new Pix(W, H), fr = '#6a3e24';
    for (const [y, tint] of [[0, '#d8b8c0'], [15, '#c8c8c8']]) {
      p.rect(0, y, 14, 14, fr); p.rect(1, y + 1, 12, 12, '#f8f6f0');
      p.rect(3, y + 3, 8, 8, tint); p.rect(5, y + 5, 2, 4, '#3a2a2a'); p.rect(6, y + 7, 4, 1, '#f0f0ec'); p.rect(8, y + 3, 3, 2, '#ffffff');
    }
    return finish(p);
  }
  // The framed WILCO poster from the show at the Dome in Virginia Beach: blue sky, the name in
  // big dark letters, seagulls, a striped beach umbrella and checkered towels on the sand.
  function wilcoPoster() {
    const W = 16, H = 24, p = new Pix(W, H);
    p.rect(0, 0, 16, 24, '#6a3a20'); p.rect(1, 1, 14, 22, '#4a8ac8');
    // "WILCO", in tiny letters
    const L = { W: ['1.1', '1.1', '111'], I: ['1', '1', '1'], L: ['1.', '1.', '11'], C: ['11', '1.', '11'], O: ['11', '11', '11'] };
    let x = 1;
    for (const ch of 'WILCO') { const g = L[ch]; g.forEach((row, j) => [...row].forEach((c, i) => { if (c === '1') p.set(x + i, 2 + j, '#1c2030'); })); x += g[0].length + 1; }
    for (const [gx, gy] of [[3, 7], [10, 6], [7, 10]]) { p.set(gx, gy, '#f8e8d8'); p.set(gx + 1, gy + 1, '#f8e8d8'); p.set(gx + 2, gy, '#f8e8d8'); }
    for (let yy = 12; yy < 23; yy++) for (let xx = 1; xx < 15; xx++) if (yy > 19 - xx * 0.4) p.set(xx, yy, '#f0d4c0');
    for (let i = 0; i < 4; i++) p.hline(9 + i, 14 - i, 11 + i, i % 2 ? '#f8f0e8' : '#e8703a');
    p.vline(11, 15, 20, '#e8703a');
    for (let yy = 18; yy < 22; yy++) for (let xx = 2; xx < 9; xx++) p.set(xx, yy, ((xx >> 1) + yy) % 2 ? '#1c2030' : (xx + yy) % 3 ? '#c8d048' : '#e8703a');
    return finish(p);
  }

  // The living room fireplace on the side wall, seen from above: the white
  // mantel, the marble surround, the firebox and the hearth.
  function condoFireplace() {
    const p = new Pix(22, 48), C = CONDO;
    p.rect(0, 0, 9, 48, C.trim); p.vline(0, 0, 47, '#ffffff'); p.vline(8, 0, 47, C.trimD);
    p.rect(9, 6, 5, 36, '#e4e4e8');
    for (let i = 0; i < 10; i++) p.set(9 + Math.floor(G.hash(i, 1, 80) * 5), 6 + Math.floor(G.hash(i, 2, 80) * 36), '#c4c4cc');
    p.rect(10, 14, 4, 20, '#1c1418');
    p.set(13, 22, '#f8a028'); p.set(13, 24, '#f8d040'); p.set(12, 23, '#f86020'); p.set(13, 26, '#f86020'); p.set(12, 27, '#f8a028');
    p.rect(14, 10, 8, 28, '#b8b8c0'); p.vline(14, 10, 37, '#9a9aa4'); p.hline(14, 21, 10, '#d4d4dc');
    p.outline();
    return p.canvas();
  }

  // The brass lantern hanging over the front hall.
  function entryLantern() {
    const p = new Pix(10, 26), b = '#b08a38', bL = '#d8b050';
    p.vline(5, 0, 9, b);
    p.hline(2, 7, 10, bL); p.rect(1, 11, 8, 2, b);
    p.rect(2, 13, 6, 9, '#f8eecc'); p.vline(1, 13, 21, b); p.vline(8, 13, 21, b); p.vline(5, 13, 21, b);
    p.set(3, 15, '#fff8e0'); p.set(6, 16, '#f8d878');
    p.rect(2, 22, 6, 2, b); p.set(4, 24, b); p.set(5, 24, b);
    p.outline();
    return p.canvas();
  }

  // ---- the galley kitchen: stainless fridge, light gray cabinets, glass-top range
  function condoFridge() {
    const p = new Pix(18, 42), st = '#c8ccd2', sd = '#9aa0a8', sl = '#eef0f4';
    p.rect(0, 0, 18, 4, '#5a5e66'); p.hline(0, 17, 0, '#7a7e86');
    p.rect(0, 4, 18, 37, st); p.hline(0, 17, 4, sl);
    for (let i = 0; i < 5; i++) p.vline(2 + i * 3, 6, 38, i % 2 ? '#d4d8de' : st);
    p.hline(0, 17, 27, sd);
    p.vline(15, 8, 23, sl); p.vline(16, 8, 23, sd);
    p.hline(5, 12, 30, sl); p.hline(5, 12, 31, sd);
    p.rect(0, 41, 18, 1, '#5a5a62');
    return finish(p);
  }
  function condoUpperCabs(n, micro) {
    const W = n * 16, p = new Pix(W, 20), cab = '#c8ccd0', cabD = '#b2b6bc';
    p.rect(0, 0, W, 18, cab); p.hline(0, W - 1, 0, '#e0e2e4');
    for (let i = 0; i < n; i++) {
      const x = i * 16;
      if (micro === i) { p.rect(x + 1, 6, 14, 10, '#c8ccd2'); p.hline(x + 1, x + 14, 6, '#eef0f4'); p.rect(x + 2, 7, 9, 8, '#1c1c22'); p.vline(x + 13, 8, 13, '#4a4a54'); continue; }
      for (const dx of [1, 9]) { p.rect(x + dx, 2, 6, 14, cabD); p.rect(x + dx + 1, 3, 4, 12, cab); }
      p.set(x + 6, 12, '#5a5e64'); p.set(x + 9, 12, '#5a5e64');
    }
    p.hline(0, W - 1, 17, '#9aa0a6'); p.hline(0, W - 1, 18, '#8a9096');
    return finish(p);
  }
  function glassRange() {
    const p = new Pix(16, 18);
    p.rect(0, 0, 16, 7, '#1c1c22'); p.hline(0, 15, 0, '#3a3a44');
    for (const [x, y] of [[2, 1], [9, 1], [2, 4], [9, 4]]) { p.rect(x, y, 5, 2, '#3a2c2e'); p.set(x + 2, y, '#5a4446'); }
    p.rect(0, 7, 16, 11, '#c8ccd2'); p.hline(0, 15, 7, '#eef0f4');
    for (let x = 2; x < 15; x += 3) p.set(x, 8, '#2a2a30');
    p.rect(2, 10, 12, 6, '#2a2a30'); p.hline(2, 13, 9, '#eef0f4');
    return finish(p);
  }
  // (sits over a counter tile's cabinet front)
  function dishwasher() {
    const p = new Pix(16, 10);
    p.rect(0, 0, 16, 10, '#c8ccd2'); p.hline(0, 15, 0, '#2a2a30'); p.hline(2, 13, 2, '#eef0f4'); p.hline(2, 13, 3, '#8a9098');
    for (let i = 0; i < 3; i++) p.vline(3 + i * 4, 5, 9, '#d8dce0');
    return p.canvas();
  }

  // ---- the laundry: the washer and dryer face each other across the room
  function washerFront() {
    const p = new Pix(16, 28);
    p.rect(0, 0, 16, 28, '#f4f4f2'); p.rect(0, 0, 16, 5, '#d8dce0'); p.set(3, 2, '#4a8ad8'); p.set(12, 2, '#2a2a30'); p.hline(6, 9, 2, '#9aa0a8');
    for (let y = 8; y < 24; y++) for (let x = 2; x < 14; x++) { const d = Math.hypot(x - 7.5, y - 15.5); if (d <= 6) p.set(x, y, d > 4.6 ? '#9aa0a8' : '#5a6a7a'); }
    p.set(6, 12, '#a8c8e8');
    return finish(p);
  }
  // (facing away from us, toward the washer: its top, its back and the dryer vent)
  function dryerBack() {
    const p = new Pix(16, 24);
    p.rect(0, 0, 16, 4, '#d8dce0'); p.hline(0, 15, 0, '#eef0f4');
    p.rect(0, 4, 16, 8, '#f4f4f2'); p.hline(0, 15, 4, '#ffffff');
    p.rect(0, 12, 16, 12, '#e2e2de'); p.hline(0, 15, 12, '#c8c8c4');
    p.rect(9, 15, 4, 4, '#b8bcc4'); p.rect(10, 19, 2, 5, '#d8dce0'); p.set(10, 21, '#9aa0a8');
    p.set(3, 16, '#b8b8b4'); p.set(3, 20, '#b8b8b4');
    return finish(p);
  }
  function wireShelf(tiles) {
    const W = tiles * 16, p = new Pix(W, 8);
    p.hline(0, W - 1, 0, WHITE); p.hline(0, W - 1, 2, WHITE_D);
    for (let x = 0; x < W; x += 2) p.vline(x, 0, 2, '#e8e6e0');
    for (let x = 2; x < W; x += 12) { p.set(x, 3, WHITE_D); p.set(x + 1, 4, WHITE_D); p.set(x + 2, 5, WHITE_D); }
    return finish(p);
  }

  // ---- the bathrooms
  function condoVanity(tiles) {
    const W = tiles * 16, p = new Pix(W, 22);
    p.rect(0, 0, W, 6, '#ece8e0'); p.hline(0, W - 1, 0, '#f8f6f2');
    for (let i = 0; i < W / 3; i++) p.set(Math.floor(G.hash(i, 1, 81) * W), 1 + Math.floor(G.hash(i, 2, 81) * 4), '#d8d0c4');
    const s = Math.floor(W / 2) - 5;
    p.rect(s, 1, 10, 4, '#f8f8f6'); p.rect(s + 1, 2, 8, 2, '#dce4ec'); p.vline(s + 5, 0, 1, '#c8ccd2');
    p.rect(0, 6, W, 16, '#f2f2ee'); p.hline(0, W - 1, 6, '#c8c8c0');
    for (let x = 2; x + 12 <= W; x += 14) { p.rect(x, 8, 12, 12, '#e4e4de'); p.rect(x + 1, 9, 10, 10, '#f2f2ee'); p.set(x + 10, 13, '#a8acb2'); }
    return finish(p);
  }
  // a big mirror with a light box over it
  function bathMirror(tiles) {
    const W = tiles * 16, p = new Pix(W, 24);
    p.rect(1, 0, W - 2, 4, '#c8ccd2'); for (let x = 4; x < W - 3; x += 6) { p.rect(x, 1, 3, 3, '#fff8d8'); p.set(x + 1, 2, '#ffffff'); }
    p.rect(1, 6, W - 2, 18, '#d8e4ec'); p.hline(1, W - 2, 6, '#b8c4cc');
    p.set(4, 9, '#ffffff'); p.set(5, 10, '#ffffff'); p.set(6, 11, '#ffffff'); p.set(W - 8, 16, '#ffffff'); p.set(W - 7, 17, '#ffffff');
    return finish(p);
  }
  function openShelves() {
    const p = new Pix(16, 20);
    for (const y of [0, 9, 18]) { p.rect(0, y, 16, 2, WHITE); p.hline(0, 15, y + 1, WHITE_D); }
    p.vline(0, 0, 19, WHITE_D); p.vline(15, 0, 19, WHITE_D);
    return finish(p);
  }
  // downstairs: the tub along the outside wall, its curtain on the far side
  function tubCurtain() {
    const W = 48, p = new Pix(W, 38);
    p.hline(0, W - 1, 0, '#c8ccd2');
    // a botanical print, like the photo: sage leaves and little yellow flowers on cream
    for (let x = 0; x < 30; x++) for (let y = 1; y < 20; y++) {
      const hsh = G.hash(x >> 1, y >> 1, 83);
      p.set(x, y, x % 4 === 0 ? '#e4e2d4' : hsh < 0.2 ? '#7ea88a' : hsh < 0.3 ? '#5a8a70' : hsh < 0.36 ? '#e8c048' : '#f0eee2');
    }
    for (let x = 0; x < 30; x += 5) p.set(x + 2, 1, '#9aa0a8');
    p.rect(0, 18, W, 20, '#f4f4f2'); p.hline(0, W - 1, 18, '#ffffff');
    p.rect(3, 21, W - 6, 14, '#d8e4ec'); p.rect(5, 23, W - 10, 10, '#b8d4e4'); p.hline(6, 14, 25, '#e8f4fc');
    p.rect(W - 8, 19, 4, 2, '#c8ccd2');
    return finish(p);
  }
  // upstairs: the tub against the wall, behind sliding glass doors
  function tubGlass() {
    const W = 32, p = new Pix(W, 36);
    p.rect(0, 0, W, 7, '#f2f2ee'); for (let y = 1; y < 7; y += 2) p.hline(0, W - 1, y, '#dcdcd8');
    p.rect(0, 7, W, 20, '#f4f4f2'); p.rect(2, 9, W - 4, 15, '#d8e4ec'); p.rect(4, 11, W - 8, 11, '#b8d4e4');
    p.rect(W / 2 - 2, 8, 4, 2, '#c8ccd2');
    p.rect(0, 26, W, 10, '#f4f4f2'); p.hline(0, W - 1, 26, '#ffffff');
    p.hline(0, W - 1, 6, '#b8bcc4'); p.hline(0, W - 1, 7, '#9aa0a8');
    for (const x of [0, 15, 16, 31]) p.vline(x, 6, 33, '#b8bcc4');
    p.hline(0, W - 1, 33, '#9aa0a8');
    for (let i = 0; i < 6; i++) { p.set(4 + i, 11 + i, '#f0f8ff'); p.set(20 + i, 13 + i, '#f0f8ff'); }
    return finish(p);
  }

  // ---- closets
  function bifoldCloset() {
    const p = new Pix(32, 28);
    p.rect(0, 0, 32, 28, WHITE); p.hline(0, 31, 0, WHITE_D);
    for (let i = 0; i < 4; i++) { const x = i * 8; p.vline(x, 1, 27, WHITE_D); p.rect(x + 2, 3, 4, 10, '#eceae2'); p.rect(x + 2, 15, 4, 10, '#eceae2'); }
    p.vline(31, 1, 27, WHITE_D); p.set(14, 14, '#b8bcc4'); p.set(17, 14, '#b8bcc4');
    return finish(p);
  }
  function atticHatch() {
    const p = new Pix(14, 12);
    p.rect(0, 0, 14, 12, WHITE); p.rect(2, 2, 10, 8, '#eceae2'); p.hline(2, 11, 2, WHITE_D); p.set(10, 6, '#b8bcc4');
    return finish(p);
  }
  // the walk-in closet's wire shelf and hanging rod
  function closetRods(tiles) {
    const W = tiles * 16, p = new Pix(W, 14);
    p.hline(0, W - 1, 0, WHITE); p.hline(0, W - 1, 2, WHITE_D); for (let x = 0; x < W; x += 2) p.vline(x, 0, 2, '#e8e6e0');
    p.hline(0, W - 1, 9, '#c8ccd2'); p.hline(0, W - 1, 10, '#9aa0a8');
    for (let x = 6; x < W; x += 16) { p.vline(x, 3, 8, WHITE_D); p.vline(x + 1, 3, 8, WHITE_D); }
    return finish(p);
  }

  // ---- the storage garage: junk, and a TON of yellow guitar cables (Abe bought
  // them to sell on eBay)
  function cableCoil(p, cx, cy, r, c = ['#f0c820', '#e0b418', '#8a6a0c']) {
    const ry = r * 0.6;
    for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - r); x <= cx + r; x++) {
      const e = ((x - cx) / r) ** 2 + ((y - cy) / ry) ** 2;
      if (e > 1 || e < 0.3) continue;
      p.set(x, y, e < 0.45 ? c[2] : e > 0.68 && e < 0.8 ? c[1] : c[0]);
    }
    p.set(Math.round(cx + r), Math.round(cy), '#2a2a30'); p.set(Math.round(cx + r) + 1, Math.round(cy), '#c8ccd2');
  }
  function cableHeap(seed) {
    const p = new Pix(30, 20), coils = [];
    [[14, 6, 6], [23, 7, 5], [8, 11, 7], [19, 13, 6]].forEach(([x, y, r], i) => coils.push([x + (G.hash(i, 1, seed) - 0.5) * 4, y + (G.hash(i, 2, seed) - 0.5) * 2, r]));
    coils.sort((a, b) => a[1] - b[1]).forEach(([cx, cy, r]) => cableCoil(p, cx, cy, r));
    p.outline();
    return p.canvas();
  }
  // clear plastic totes with blue lids, stuffed with yellow cables
  function cableTotes(n) {
    const p = new Pix(20, n * 15 + 3);
    for (let k = 0; k < n; k++) {
      const y0 = k * 15;
      p.rect(0, y0, 20, 4, '#3a6ab8'); p.hline(0, 19, y0, '#5a8ad8');
      p.rect(1, y0 + 4, 18, 14, '#d8e0e4'); p.vline(1, y0 + 4, y0 + 17, '#b8c4ca'); p.vline(18, y0 + 4, y0 + 17, '#b8c4ca');
      for (let i = 0; i < 16; i++) { const x = 2 + Math.floor(G.hash(i, k, 90) * 15), y = y0 + 5 + Math.floor(G.hash(i, k + 7, 90) * 11); p.set(x, y, '#f0c820'); p.set(x + 1, y, '#d0a414'); p.set(x, y + 1, '#d0a414'); }
    }
    p.outline();
    return p.canvas();
  }
  // an open cardboard box overflowing with them
  function cableBox() {
    const p = new Pix(24, 22);
    cableCoil(p, 8, 7, 5); cableCoil(p, 15, 6, 5); cableCoil(p, 11, 9, 4);
    p.rect(1, 9, 22, 13, '#c8a070'); p.hline(1, 22, 9, '#e0c090'); p.vline(12, 9, 12, '#a07a48');
    p.rect(0, 6, 4, 4, '#d8b080'); p.rect(20, 6, 4, 4, '#d8b080');
    cableCoil(p, 19, 12, 3);
    p.outline();
    return p.canvas();
  }
  // boxes, a box fan, and an orange extension cord that has given up
  function junkPile() {
    const p = new Pix(30, 26);
    p.rect(15, 0, 14, 14, '#e8e8e4');
    for (let y = 1; y < 13; y++) for (let x = 16; x < 28; x++) if ((x - 21.5) ** 2 + (y - 6.5) ** 2 <= 30) p.set(x, y, (x + y) % 2 ? '#8a8e96' : '#5a5e66');
    p.rect(20, 5, 3, 3, '#e8e8e4');
    for (const [x, y, w, h] of [[0, 10, 13, 16], [11, 14, 15, 12]]) { p.rect(x, y, w, h, '#c8a070'); p.hline(x, x + w - 1, y, '#e0c090'); p.vline(x + (w >> 1), y, y + 3, '#a07a48'); }
    cableCoil(p, 7, 7, 6, ['#e87820', '#d06818', '#7a3a0c']);
    p.outline();
    return p.canvas();
  }

  // ================================================================ TOM'S PIZZA (Lafayette)
  // Tom's second store (the first is in Union, NJ): a little storefront with a red, white
  // and green awning, and inside, the deck ovens, the hood, the mosaic counter with its
  // glass pizza case, stacks of boxes, and red-checkered tables.
  // A College Hill storefront: flat roof, brick front, a sign, a striped scalloped awning,
  // two big windows (what's in them depends on the shop) and a glass door.
  function storefront(o) {
    const W = 96, H = 64, p = new Pix(W, H);
    p.rect(0, 0, W, 10, '#5a5c64'); p.hline(0, W - 1, 0, '#7a7c84'); p.hline(0, W - 1, 9, '#3a3c44');
    for (let y = 10; y < H; y++) for (let x = 0; x < W; x++) {
      const row = Math.floor(y / 4), off = row % 2 ? 4 : 0;
      p.set(x, y, y % 4 === 3 || (x + off) % 8 === 0 ? '#c8a088' : G.hash(Math.floor((x + off) / 8), row, o.seed || 21) < 0.3 ? shade(o.brick, -0.12) : o.brick);
    }
    p.rect(8, 12, 80, 13, '#f6f0e0'); p.rect(9, 13, 78, 11, o.signBg); p.hline(9, 86, 13, shade(o.signBg, 0.15));
    const aw = o.awning;
    for (let y = 27; y < 35; y++) for (let x = 2; x < W - 2; x++) p.set(x, y, aw[Math.floor((x - 2) / 6) % aw.length]);
    for (let x = 2; x < W - 2; x++) if ((x - 2) % 6 > 0 && (x - 2) % 6 < 5) p.set(x, 35, aw[Math.floor((x - 2) / 6) % aw.length]);
    p.hline(2, W - 3, 27, shade(aw[0], -0.35));
    for (const x0 of [6, 60]) {
      p.rect(x0, 39, 30, 21, '#2a2a30'); p.rect(x0 + 2, 41, 26, 17, o.lease ? '#3a4048' : '#4a6a88'); p.set(x0 + 3, 42, '#a8c8e8'); p.set(x0 + 4, 42, '#a8c8e8');
      if (o.window) o.window(p, x0);
    }
    p.rect(40, 38, 16, 26, '#2a2a30'); p.rect(42, 40, 12, 24, o.lease ? '#4a5058' : '#6a8aa8'); p.vline(47, 40, 63, '#2a2a30'); p.set(52, 52, '#d8b050');
    if (o.door) o.door(p);
    p.outline();
    const cv = p.canvas(), x = cv.getContext('2d');
    if (o.sign) { const tw = G.font.width(o.sign); G.font.draw(x, o.sign, Math.round((W - tw) / 2), 15, o.signText || '#fff4c0', { shadow: shade(o.signBg, -0.55) }); }
    return cv;
  }
  function tomsPizza() {
    return storefront({
      sign: 'TOM\'S PIZZA', signBg: '#c82828', brick: '#ac4e38', awning: ['#c82828', '#f6f4ee', '#2e8a3e'],
      window: (p, x0) => { for (let y = 0; y < 9; y++) for (let x = 0; x < 13; x++) if ((x - 6) ** 2 / 40 + (y - 4) ** 2 / 18 <= 1) p.set(x0 + 9 + x, 47 + y, (x + y) % 5 === 0 ? '#c83828' : '#f0c050'); },
      door: (p) => { p.rect(42, 46, 12, 4, '#f6f0e0'); p.hline(43, 52, 47, '#2e8a3e'); p.hline(43, 52, 48, '#c82828'); },
    });
  }
  // the grocery store: green awning, crates of produce in the windows
  function groceryStore() {
    return storefront({
      sign: 'GROCERY', signBg: '#2e7a3e', brick: '#b8805a', seed: 23, awning: ['#2e8a3e', '#f6f4ee'],
      window: (p, x0) => {
        for (const [cx, cols] of [[x0 + 4, ['#d83030', '#e84848']], [x0 + 12, ['#f0a020', '#f8c040']], [x0 + 20, ['#58a838', '#78c848']]]) {
          p.rect(cx, 52, 7, 5, '#a87848'); p.hline(cx, cx + 6, 52, '#c89868');
          for (let i = 0; i < 5; i++) p.set(cx + 1 + i, 50 + (i % 2), cols[i % 2]);
          p.hline(cx + 1, cx + 5, 51, cols[0]);
        }
      },
      door: (p) => { p.rect(43, 45, 10, 5, '#f6f0e0'); p.hline(44, 51, 47, '#2e7a3e'); },
    });
  }
  // ---- the grocery store on College Hill, after close (Dad's hip hop class): the produce stand,
  // the dairy cooler, aisle endcaps, the checkout, Dad's boombox, the stock boy's mop bucket, and
  // the PRODUCE sign
  function produceStand() {
    const W = 64, H = 32, p = new Pix(W, H);
    p.rect(0, 4, W, 28, '#8a5a34'); p.hline(0, W - 1, 4, '#a87448'); p.hline(0, W - 1, 31, '#5a3a20');
    const bins = [['#d83030', '#f05858'], ['#f0a020', '#f8c040'], ['#e8d040', '#f8ec80'], ['#4a9a3a', '#6aba5a'], ['#7a3a8a', '#a05ab0'], ['#c84828', '#e86a48']];
    bins.forEach(([c, l], i) => {
      const x0 = 2 + (i % 3) * 21, y0 = i < 3 ? 5 : 16;
      p.rect(x0, y0, 18, 10, '#5a3a20');
      for (let k = 0; k < 14; k++) { const x = x0 + 2 + (k % 7) * 2, y = y0 + 2 + Math.floor(k / 7) * 4; p.rect(x, y, 2, 3, c); p.set(x, y, l); }
    });
    for (let i = 0; i < 3; i++) { p.rect(6 + i * 21, 27, 9, 4, '#f8f8f0'); p.hline(7 + i * 21, 13 + i * 21, 29, '#d83030'); }
    return finish(p);
  }
  function dairyCooler() {
    const W = 64, H = 46, p = new Pix(W, H);
    p.rect(0, 0, W, H, '#c8ccd4'); p.hline(0, W - 1, 0, '#e8eaf0'); p.rect(0, 0, W, 8, '#2a6ad8'); p.hline(0, W - 1, 7, '#1a4aa8');
    const goods = [['#f8f8f8', '#2a6ad8'], ['#f4ead0', '#e8dcb8'], ['#f8a8c8', '#ffffff'], ['#f8c040', '#38a048']];
    for (let i = 0; i < 4; i++) {
      const x0 = 2 + i * 15;
      p.rect(x0, 9, 14, 35, '#a8d8f0'); p.vline(x0 + 12, 10, 42, '#e8f8ff'); p.vline(x0, 9, 43, '#8a8e96');
      for (const y of [15, 23, 31, 39]) {
        p.hline(x0 + 1, x0 + 12, y + 1, '#8a8e96');
        for (let k = 0; k < 3; k++) p.rect(x0 + 2 + k * 4, y - 4, 3, 5, goods[i][k % 2]);
      }
      p.vline(x0 + 10, 25, 28, '#3a3a40');
    }
    const cv = finish(p);
    G.font.draw(cv.getContext('2d'), 'DAIRY', 32 - Math.round(G.font.width('DAIRY') / 2), 1, '#ffffff');
    return cv;
  }
  // an aisle endcap, stacked with cereal boxes and cans
  function aisleShelf() {
    const W = 16, H = 46, p = new Pix(W, H);
    p.rect(0, 0, 16, 46, '#8a9098'); p.rect(1, 1, 14, 44, '#b8bcc4');
    const cols = ['#d83030', '#f0c830', '#3a6ad8', '#38a048', '#f08a28'];
    for (let y = 3, r = 0; y < 42; y += 9, r++) {
      p.hline(1, 14, y + 7, '#6a7078');
      for (let x = 2, k = 0; x < 14; x += 3, k++) { const c = cols[(k + r * 2) % 5]; p.rect(x, y, 2, 7, c); p.set(x, y, '#ffffff'); }
    }
    return finish(p);
  }
  function checkout() {
    const W = 48, H = 28, p = new Pix(W, H);
    p.rect(0, 10, W, 18, '#3a3e48'); p.hline(0, W - 1, 10, '#5a5e68'); p.hline(0, W - 1, 27, '#22262e');
    p.rect(0, 8, 30, 4, '#1a1a20'); for (let x = 1; x < 30; x += 3) p.set(x, 9, '#4a4a54');
    p.rect(32, 0, 12, 11, '#2a2a30'); p.rect(33, 1, 10, 5, '#2a4a3a'); p.hline(34, 41, 3, '#58d878');
    p.rect(2, 15, 26, 2, '#d83030');
    for (let x = 4; x < 26; x += 5) { p.rect(x, 19, 3, 5, ['#f0c830', '#d83030', '#8a3a1a', '#38a048', '#f8f8f8'][(x / 5) % 5 | 0]); }
    return finish(p);
  }
  // Dad's boombox: the speakers thump (two frames)
  function boombox(frame) {
    const p = new Pix(18, 12);
    p.rect(0, 3, 18, 9, '#3a3a44'); p.hline(0, 17, 3, '#5a5a64'); p.rect(4, 0, 10, 2, '#6a6a74'); p.vline(4, 0, 3, '#6a6a74'); p.vline(13, 0, 3, '#6a6a74');
    const r = frame ? 3.2 : 2.4;
    for (const cx of [4, 13]) for (let y = -3; y <= 3; y++) for (let x = -3; x <= 3; x++) if (x * x + y * y <= r * r) p.set(cx + x, 7 + y, x * x + y * y <= 1.5 ? '#8a8a94' : '#1a1a20');
    p.rect(8, 5, 2, 2, '#f8d040'); p.set(8, 9, '#58d878');
    return finish(p);
  }
  function mopBucket() {
    const p = new Pix(14, 22);
    p.rect(1, 12, 11, 9, '#f0c830'); p.hline(1, 11, 12, '#f8e070'); p.rect(2, 13, 9, 2, '#8ab8d8');
    p.vline(9, 0, 13, '#c8a070'); p.rect(7, 13, 6, 4, '#e8e4d8');
    p.set(2, 21, '#2a2a30'); p.set(10, 21, '#2a2a30');
    return finish(p);
  }
  function produceSign() {
    const W = 60, H = 12, p = new Pix(W, H);
    p.rect(0, 0, W, H, '#2e7a3e'); p.hline(0, W - 1, 0, '#4a9a5a'); p.hline(0, W - 1, H - 1, '#1e5a2c');
    for (const [x, c] of [[3, '#d83030'], [53, '#f0a020']]) { p.rect(x, 3, 4, 5, c); p.set(x + 1, 2, '#3a9a3a'); }
    const cv = finish(p);
    G.font.draw(cv.getContext('2d'), 'PRODUCE', 30 - Math.round(G.font.width('PRODUCE') / 2), 2, '#ffffff');
    return cv;
  }
  // ---- a Canada goose (off the golf course, at the condo): black head and neck with the white
  // chinstrap, a brown back, a pale chest, a white rump under the black tail, black legs. Poses:
  // walk (2 frames), graze (head down in the grass), hiss (wings up, neck out, beak open), and fly
  // (2 frames). Facing right; mirrored for left. Feet on the bottom row.
  function goose(pose) {
    const W = 26, H = 24, p = new Pix(W, H), BLK = '#1a1a1e', BRN = '#7a6a58', BRN_D = '#5a4c3e', BRN_L = '#94826c', CH = '#cbbfaa', BEL = '#e6e2d8', WHT = '#f6f6f2';
    const flying = pose === 'fly1' || pose === 'fly2', gy = flying ? 16 : 17;
    // the body, the folded wing, the chest and belly
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const d = ((x - 10) / 7.5) ** 2 + ((y - gy + 4) / 4.2) ** 2;
      if (d > 1) continue;
      p.set(x, y, y > gy - 2 ? BEL : x > 13 && y > gy - 6 ? CH : y < gy - 6 ? BRN_L : BRN);
    }
    for (let x = 5; x <= 13; x++) p.set(x, gy - 4 + (x > 10 ? 1 : 0), BRN_D);
    for (let x = 6; x <= 12; x += 3) p.set(x, gy - 6, BRN_D);
    // the tail (black) and the white rump under it
    p.rect(1, gy - 7, 3, 3, BLK); p.set(0, gy - 6, BLK); p.rect(3, gy - 4, 2, 2, WHT);
    // the legs (or tucked up, flying)
    if (!flying) {
      const a = pose === 'walk2' ? 1 : 0, b = pose === 'walk2' ? -1 : 0;
      p.vline(8 + a, gy, gy + 5, BLK); p.vline(12 + b, gy, gy + 5, BLK);
      p.hline(7 + a, 9 + a, gy + 6, BLK); p.hline(11 + b, 13 + b, gy + 6, BLK);
    }
    // the neck and head
    let nx, ny, hx, hy, open = false;
    if (pose === 'graze') { nx = [15, 17, 18, 19]; ny = [gy - 5, gy - 2, gy + 1, gy + 3]; hx = 19; hy = gy + 3; }
    else if (pose === 'hiss') { nx = [16, 18, 20, 21]; ny = [gy - 6, gy - 7, gy - 8, gy - 8]; hx = 22; hy = gy - 9; open = true; }
    else if (flying) { nx = [16, 18, 20]; ny = [gy - 6, gy - 7, gy - 8]; hx = 21; hy = gy - 9; }
    else { nx = [15, 16, 16, 16]; ny = [gy - 6, gy - 9, gy - 12, gy - 15]; hx = 17; hy = gy - 17; }
    for (let i = 0; i < nx.length; i++) { p.rect(nx[i], ny[i], 2, 3, BLK); }
    p.rect(hx - 1, hy, 4, 3, BLK);
    p.hline(hx - 1, hx + 1, hy + 2, WHT); p.set(hx, hy + 1, WHT);           // the chinstrap
    if (open) { p.set(hx + 3, hy, BLK); p.set(hx + 3, hy + 2, BLK); p.set(hx + 3, hy + 1, '#d86878'); }
    else p.rect(hx + 3, hy + 1, 1, 1, BLK);
    // wings: up and spread when it hisses, beating when it flies
    if (pose === 'hiss' || pose === 'fly1') {
      for (let k = 0; k < 9; k++) { p.vline(5 + k, gy - 11 - Math.round(Math.sin(k / 8 * Math.PI) * 4) + (k > 6 ? 2 : 0), gy - 6, k % 3 ? BRN : BRN_D); p.set(5 + k, gy - 12 - Math.round(Math.sin(k / 8 * Math.PI) * 4) + (k > 6 ? 2 : 0), BRN_L); }
    } else if (pose === 'fly2') {
      for (let k = 0; k < 9; k++) p.vline(5 + k, gy - 2, gy + 2 + Math.round(Math.sin(k / 8 * Math.PI) * 3), k % 3 ? BRN : BRN_D);
    }
    return finish(p);
  }
  // brand-new white high-tops, on the workshop floor (Dad wears loafers), with a mixtape tucked in one
  function highTops() {
    const p = new Pix(20, 12);
    for (const x0 of [0, 10]) {
      p.rect(x0 + 1, 2, 5, 6, '#f8f8f4'); p.rect(x0 + 1, 7, 9, 3, '#f8f8f4'); p.hline(x0 + 1, x0 + 9, 10, '#c8c8c0'); p.hline(x0, x0 + 9, 11, '#3a3a40');
      p.vline(x0 + 1, 2, 9, '#e0e0d8'); p.hline(x0 + 2, x0 + 8, 8, '#d83030');
      for (const y of [3, 5]) p.hline(x0 + 2, x0 + 4, y, '#b8b8c0');
      p.rect(x0 + 2, 1, 4, 1, '#e8e8e0');
    }
    p.rect(3, 0, 5, 3, '#2a2a30'); p.hline(4, 6, 1, '#f8e070');
    return finish(p);
  }
  // Lily's trash can, full of taxidermy catalogs still in their plastic (Abe signed her up), the top
  // one with a squirrel in a tiny top hat on the cover
  function catalogBin() {
    const p = new Pix(16, 18);
    // the catalogs sticking up out of it, glossy, in plastic wrap
    p.rect(2, 1, 6, 8, '#3a6a4a'); p.rect(3, 2, 4, 4, '#d8c8a0'); p.hline(2, 7, 1, '#e8f0f8');
    p.rect(8, 0, 6, 9, '#8a3a2a'); p.rect(9, 1, 4, 3, '#f0e0b8'); p.hline(8, 13, 0, '#f0f4f8');
    p.rect(5, 3, 7, 7, '#e8dcc0'); p.hline(5, 11, 3, '#ffffff'); p.vline(11, 4, 9, '#c8bca0');
    // the top one: a squirrel in a tiny top hat
    p.rect(7, 6, 3, 3, '#9a6a3a'); p.set(10, 7, '#9a6a3a'); p.set(10, 6, '#b8885a'); p.set(8, 7, '#1a1a1a');
    p.rect(7, 4, 3, 1, '#1a1a1a'); p.rect(8, 3, 1, 1, '#1a1a1a');
    p.hline(6, 10, 9, '#c83030');
    // the wastebasket
    p.rect(1, 9, 14, 9, '#c8ccd4'); p.hline(1, 14, 9, '#e8eaf0'); p.hline(2, 13, 17, '#8a8e96');
    for (let x = 3; x < 14; x += 3) p.vline(x, 10, 16, '#a8acb4');
    return finish(p);
  }
  // a push broom for the workshop floor (Dad holds it at his side)
  function broom() {
    const p = new Pix(10, 26);
    p.vline(4, 0, 18, '#a87848'); p.vline(5, 0, 18, '#8a5a34');
    p.rect(1, 18, 8, 2, '#3a3a40');
    for (let x = 0; x < 10; x++) p.vline(x, 20, 25 - (x === 0 || x === 9 ? 1 : 0), x % 2 ? '#d8b860' : '#c8a048');
    return finish(p);
  }
  // an empty shop, waiting for a tenant
  function forLeaseShop() {
    return storefront({
      sign: '', signBg: '#6a6c74', brick: '#9a6a52', seed: 25, awning: ['#7a7c84', '#a8aab0'], lease: true,
      window: (p, x0) => { p.rect(x0 + 8, 44, 14, 9, '#f6f4ee'); p.hline(x0 + 10, x0 + 19, 46, '#c82828'); p.hline(x0 + 10, x0 + 17, 48, '#3a3a40'); p.hline(x0 + 10, x0 + 18, 50, '#3a3a40'); },
    });
  }
  // stainless deck ovens, stacked two high
  function deckOven() {
    const p = new Pix(32, 40), st = '#b8bcc4', sd = '#8a8e96', sl = '#e0e2e8';
    p.rect(0, 0, 32, 40, st); p.hline(0, 31, 0, sl);
    for (const y of [4, 19]) { p.rect(2, y, 28, 12, sd); p.rect(3, y + 1, 26, 10, st); p.hline(5, 26, y + 3, '#5a5e66'); p.hline(5, 26, y + 4, sl); p.set(4, y + 8, '#d03030'); }
    p.rect(0, 34, 32, 6, '#6a6e76'); p.vline(3, 34, 39, '#3a3c44'); p.vline(28, 34, 39, '#3a3c44');
    return finish(p);
  }
  function ovenHood() {
    const p = new Pix(40, 14);
    p.rect(2, 0, 36, 4, '#a8acb4'); p.rect(0, 4, 40, 9, '#c8ccd2'); p.hline(0, 39, 4, '#e8eaf0'); p.hline(0, 39, 12, '#8a8e96');
    for (let x = 4; x < 38; x += 4) p.vline(x, 6, 10, '#a8acb4');
    return finish(p);
  }
  // the counter: a mosaic tile top (tan, with brown diamonds), and the glass pizza case at the end
  function tomsCounter(tiles) {
    const W = tiles * 16, p = new Pix(W, 22), caseX = W - 40;
    for (let y = 0; y < 7; y++) for (let x = 0; x < caseX; x++) {
      const d = Math.abs((x % 8) - 4) + Math.abs((y % 7) - 3);
      p.set(x, y, d === 3 ? '#8a5a38' : d < 2 ? '#c8783a' : (x + y) % 3 ? '#e8d8b8' : '#d8c4a0');
    }
    p.rect(0, 7, caseX, 15, '#d8c8a8'); p.hline(0, caseX - 1, 7, '#8a6a48');
    for (let x = 4; x < caseX - 4; x += 16) { p.rect(x, 10, 12, 9, '#c8b898'); p.rect(x + 1, 11, 10, 7, '#d8c8a8'); }
    // the register
    p.rect(6, 0, 10, 6, '#2a2a30'); p.rect(7, 1, 8, 2, '#58a858'); p.hline(7, 14, 4, '#4a4a54');
    // the glass case, with pizzas on the shelves
    p.rect(caseX, 0, 40, 22, '#b8bcc4'); p.rect(caseX + 2, 1, 36, 18, '#c8dce8'); p.hline(caseX + 2, caseX + 37, 10, '#9aa0a8');
    for (const [px, py] of [[caseX + 4, 4], [caseX + 20, 4], [caseX + 8, 13]]) {
      for (let y = 0; y < 5; y++) for (let x = 0; x < 14; x++) if ((x - 6.5) ** 2 / 45 + (y - 2) ** 2 / 6 <= 1) p.set(px + x, py + y, (x * 3 + y) % 7 === 0 ? '#c83828' : y === 0 || x === 0 ? '#d89a48' : '#f0c858');
    }
    p.set(caseX + 4, 2, '#ffffff'); p.set(caseX + 5, 2, '#ffffff');
    return finish(p);
  }
  function pizzaBoxes() {
    const p = new Pix(18, 26);
    for (let i = 0; i < 6; i++) { const y = 22 - i * 4; p.rect(0, y, 18, 4, '#f4f0e8'); p.hline(0, 17, y, '#ffffff'); p.hline(2, 15, y + 2, i % 2 ? '#c82828' : '#d8d0c0'); }
    return finish(p);
  }
  // the framed picture on the wall: Dad (glasses, beard, navy sweater) and Tom (blue cap,
  // bushy brows, striped shirt) in front of the ovens at the original Tom's Pizza
  function dadTomPicture() {
    const p = new Pix(32, 26);
    p.rect(0, 0, 32, 26, '#7a4a28'); p.hline(0, 31, 0, '#9a6a40'); p.vline(0, 0, 25, '#9a6a40'); p.hline(0, 31, 25, '#5a3418');
    p.rect(2, 2, 28, 22, '#f6f4ee');
    // the shop behind them: tan wall, the stainless oven and hood
    p.rect(3, 3, 26, 20, '#d8c8a8');
    p.rect(13, 4, 10, 3, '#a8acb4'); p.rect(14, 7, 8, 9, '#b8bcc4'); p.hline(15, 20, 9, '#7a7e86'); p.hline(15, 20, 13, '#7a7e86');
    // Dad, up front on the left
    p.rect(4, 17, 11, 6, '#26304e'); p.set(8, 17, '#e8e8e4'); p.set(9, 18, '#e8e8e4');
    p.rect(6, 9, 7, 8, '#e8b898'); p.hline(6, 12, 8, '#8a7a6a'); p.hline(7, 11, 7, '#8a7a6a');
    p.hline(6, 8, 11, '#2a2a30'); p.hline(10, 12, 11, '#2a2a30'); p.set(9, 11, '#2a2a30'); p.set(7, 11, '#d8e8f0'); p.set(11, 11, '#d8e8f0');
    p.rect(6, 14, 7, 3, '#a8886a'); p.hline(8, 10, 14, '#c88878');
    // Tom, behind the counter on the right
    p.rect(19, 17, 9, 6, '#26304e'); p.hline(19, 27, 18, '#f0f0f0'); p.hline(19, 27, 20, '#f0f0f0');
    p.rect(21, 11, 5, 6, '#d4a486'); p.rect(20, 9, 7, 3, '#4a88c8'); p.hline(19, 25, 11, '#345f8c');
    p.hline(21, 22, 13, '#1c1614'); p.hline(24, 25, 13, '#1c1614'); p.hline(22, 24, 16, '#ac9a8c');
    p.rect(3, 22, 26, 1, '#c8b898');
    return finish(p);
  }

  // a little table with a red-checkered cloth and two chairs
  function checkTable() {
    const p = new Pix(32, 26);
    for (const x of [0, 26]) { p.rect(x, 8, 6, 10, '#7a4a28'); p.hline(x, x + 5, 8, '#9a6a40'); p.vline(x + 1, 18, 25, '#5a3418'); p.vline(x + 4, 18, 25, '#5a3418'); }
    for (let y = 4; y < 16; y++) for (let x = 6; x < 26; x++) p.set(x, y, (Math.floor(x / 3) + Math.floor(y / 3)) % 2 ? '#d83838' : '#f6f4ee');
    p.hline(6, 25, 16, '#a82828'); p.vline(15, 17, 25, '#4a4a54'); p.vline(16, 17, 25, '#4a4a54'); p.hline(12, 19, 25, '#4a4a54');
    p.rect(13, 7, 6, 4, '#f0c050'); p.set(15, 8, '#c83828');
    return finish(p);
  }

  // ================================================================ EL TORO LOCO (from the user's photos)
  // Down the main road from Abe and Hannah's. Outside: a low brick building with a dark green
  // band along the roofline, a cream "Restaurante Mexicano" sign on it, a green awning over the
  // door, a green fabric awning over the window on the right, and the tall white sign out by the
  // road with the charging bull. Inside: red vinyl booths, dark wood tables with black chairs,
  // little Mexican flags strung everywhere, frosted glass lamps, a desert mural, a soccer ball,
  // beer signs, a metal sun, and a pillar hung with garlic.
  function toroFront() {
    const W = 256, H = 80, p = new Pix(W, H);
    // the flat roof, seen from above (tar and gravel), with an AC unit and a vent
    for (let y = 0; y < 22; y++) for (let x = 0; x < W; x++) p.set(x, y, G.hash(x, y, 31) < 0.12 ? '#5a524a' : G.hash(x, y, 32) < 0.08 ? '#3a342e' : '#4a433c');
    p.hline(0, W - 1, 0, '#6a625a'); p.hline(0, W - 1, 1, '#5e564e');
    p.rect(180, 4, 22, 13, '#8a8e94'); p.rect(181, 5, 20, 11, '#b8bcc2'); for (let x = 183; x < 200; x += 3) p.vline(x, 6, 14, '#8a8e94');
    p.rect(40, 8, 8, 6, '#7a7e84'); p.hline(40, 47, 8, '#9a9ea4');
    // the dark green band along the roofline
    p.rect(0, 22, W, 12, '#1e5a36'); p.hline(0, W - 1, 22, '#3a8a5a'); p.hline(0, W - 1, 23, '#2a7046'); p.hline(0, W - 1, 33, '#0e3420');
    for (let x = 8; x < W; x += 16) p.vline(x, 24, 32, '#185030');
    // brick walls
    for (let y = 34; y < H; y++) {
      const row = Math.floor((y - 34) / 4), off = row % 2 ? 4 : 0;
      for (let x = 0; x < W; x++) p.set(x, y, (y - 34) % 4 === 3 || (x + off) % 8 === 0 ? '#a8786a' : G.hash(Math.floor((x + off) / 8), row, 33) < 0.3 ? '#7a3226' : '#8e3c2c');
    }
    // dark tinted windows with a glare and a sill
    const win = (x0, y0, w, h) => {
      p.rect(x0 - 1, y0 - 1, w + 2, h + 2, '#1a1a1e');
      p.rect(x0, y0, w, h, '#22323a');
      for (let i = 0; i < h; i++) { if (3 + i < w) p.set(x0 + 3 + i, y0 + i, '#4a6470'); if (7 + i < w) p.set(x0 + 7 + i, y0 + i, '#3a5460'); }
      p.hline(x0 - 1, x0 + w, y0 + h + 1, '#c8b8a8');
    };
    for (const x0 of [12, 40, 132, 160]) win(x0, 48, 20, 22);
    // the front door: glass double doors under a little green awning
    p.rect(78, 44, 36, 36, '#6a2a20');
    p.rect(80, 52, 32, 28, '#1a1a1e'); p.rect(82, 54, 13, 26, '#2a3a42'); p.rect(97, 54, 13, 26, '#2a3a42');
    p.set(93, 67, '#c8c8d0'); p.set(99, 67, '#c8c8d0');
    for (let i = 0; i < 10; i++) { p.set(84 + i, 56 + i * 2, '#4a6470'); p.set(99 + i, 56 + i * 2, '#4a6470'); }
    for (let y = 42; y < 51; y++) for (let x = 74; x < 118; x++) p.set(x, y, (x - 74) % 6 < 3 ? '#2a7a46' : '#22663a');
    p.hline(74, 117, 42, '#3a9a5a'); for (let x = 74; x < 118; x += 3) p.set(x, 51, '#1a5030');
    // the green fabric awning over the window on the right
    for (let y = 37; y < 47; y++) { const k = Math.round((y - 37) * 0.4); for (let x = 154 - k; x < 186 + k; x++) p.set(x, y, (x - 148) % 8 < 4 ? '#2e8a4e' : '#267a42'); }
    p.hline(150, 189, 46, '#1a5030'); p.hline(154, 185, 37, '#4aa86a');
    // the cantina's side door, at the far right
    p.rect(216, 50, 18, 30, '#1a1a1e'); p.rect(218, 52, 14, 28, '#3a2a22'); p.set(229, 67, '#c8c8d0');
    for (let y = 43; y < 49; y++) for (let x = 212; x < 238; x++) p.set(x, y, (x - 212) % 6 < 3 ? '#2a7a46' : '#22663a');
    // the cream sign on the green band: RESTAURANTE MEXICANO, in red
    const t = 'RESTAURANTE MEXICANO', tw = G.font.width(t), sx = 96 - Math.round(tw / 2) - 4;
    p.rect(sx, 24, tw + 8, 9, '#f2ead6'); p.hline(sx, sx + tw + 7, 24, '#ffffff'); p.hline(sx, sx + tw + 7, 32, '#c8bca0');
    p.outline();
    const cv = p.canvas();
    G.font.draw(cv.getContext('2d'), t, sx + 4, 25, '#c02828');
    return cv;
  }

  // the tall white sign out by the road: EL TORO LOCO in red over the charging bull,
  // "Restaurante Mexicano" in green, "and CANTINA" in red, on a teal base (the street number
  // on the base is left off)
  function toroSign() {
    const W = 78, H = 100, PH = 72, p = new Pix(W, H);
    p.rect(21, PH, 36, H - PH, '#2a8a8a'); p.vline(21, PH, H - 1, '#4ab0b0'); p.vline(56, PH, H - 1, '#1a6060'); p.hline(21, 56, PH, '#5ac0c0');
    p.hline(25, 52, PH + 8, '#1e7272');
    p.rect(0, 0, W, PH, '#5a6a70'); p.rect(2, 2, W - 4, PH - 4, '#f8f8f4'); p.hline(2, W - 3, 2, '#ffffff');
    // the bull, charging down and to the right, with a yellow rope around his neck and a dust cloud
    const bx = 20, by = 16;
    for (const [cx, cy, r] of [[bx + 3, by + 23, 4], [bx + 11, by + 24, 4], [bx + 22, by + 24, 3], [bx + 31, by + 23, 4]]) {
      for (let y = -r; y <= r; y++) for (let x = -r - 1; x <= r + 1; x++) if ((x / (r + 1)) ** 2 + (y / r) ** 2 <= 1) p.set(cx + x, cy + y, y < 0 ? '#ffffff' : '#d8d8dc');
    }
    for (let y = 0; y < 16; y++) for (let x = 0; x < 26; x++) {
      const e = ((x - 12) / 13) ** 2 + ((y - 8) / 8) ** 2;
      if (e <= 1) p.set(bx + x, by + y, y < 4 && x > 8 ? '#a0602e' : e > 0.75 ? '#5a3214' : '#7a4420');
    }
    for (const lx of [3, 7, 16, 20]) { p.rect(bx + lx, by + 14, 2, 7, '#5a3214'); p.hline(bx + lx, bx + lx + 1, by + 21, '#2a1608'); }
    p.rect(bx + 23, by + 8, 9, 8, '#6a3a18'); p.rect(bx + 26, by + 14, 7, 5, '#5a3214');
    p.set(bx + 31, by + 17, '#2a1608'); p.set(bx + 28, by + 11, '#ffffff'); p.set(bx + 29, by + 11, '#1a1a1a');
    p.hline(bx + 30, bx + 34, by + 8, '#f4f0e0'); p.set(bx + 35, by + 7, '#f4f0e0'); p.set(bx + 36, by + 6, '#d8d0b8');
    p.hline(bx + 21, bx + 24, by + 7, '#f4f0e0'); p.set(bx + 20, by + 6, '#d8d0b8');
    for (let y = 1; y < 14; y++) p.set(bx + 21 + (y % 2), by + y, y % 2 ? '#f0d040' : '#c8a020');
    p.vline(bx + 1, by - 3, by + 4, '#5a3214'); p.hline(bx, bx + 2, by - 4, '#2a1608');
    p.outline();
    const cv = p.canvas(), x = cv.getContext('2d');
    const line = (s, y, c, sh) => G.font.draw(x, s, Math.round((W - G.font.width(s)) / 2), y, c, { shadow: sh });
    line('EL TORO LOCO', 5, '#d82828', '#7a1010');
    line('Restaurante', 41, '#2e8a2e', '#a8d850');
    line('Mexicano', 51, '#2e8a2e', '#a8d850');
    line('and CANTINA', 61, '#d82828');
    return cv;
  }

  // ---- inside
  // a booth, seen from the front: the tall red vinyl back against the wall (and the seat)...
  function boothBack() {
    const W = 32, H = 24, p = new Pix(W, H);
    p.rect(0, 0, W, 4, '#4a2a18'); p.hline(0, W - 1, 0, '#6a4228');
    p.rect(1, 4, W - 2, 14, '#b81e24'); p.hline(1, W - 2, 4, '#e04048');
    for (let x = 4; x < W - 2; x += 6) p.vline(x, 5, 17, '#8a1418');
    p.rect(1, 18, W - 2, 6, '#d02a30'); p.hline(1, W - 2, 18, '#f05058'); p.hline(1, W - 2, 23, '#8a1418');
    p.vline(0, 4, 23, '#4a2a18'); p.vline(W - 1, 4, 23, '#4a2a18');
    return finish(p);
  }
  // ...and the table in front of it (a caddy of salt, pepper and hot sauce, chips and salsa),
  // with the other bench's back toward us
  function boothFront(chips = true) {
    const W = 32, H = 26, p = new Pix(W, H);
    p.rect(1, 0, 30, 10, '#5a3a24'); p.hline(1, 30, 0, '#7a5434'); for (let x = 3; x < 30; x += 7) p.hline(x, x + 3, 5, '#4a2e1c');
    p.rect(1, 10, 30, 2, '#3a2416');
    p.rect(3, 2, 2, 4, '#f0f0f0'); p.rect(5, 2, 2, 4, '#4a4a4a'); p.rect(7, 1, 2, 5, '#c82020'); p.set(7, 1, '#f0d040');
    if (chips) {
      p.rect(18, 2, 9, 6, '#c84828'); p.hline(18, 26, 2, '#e06a48');
      for (const [cx, cy] of [[19, 3], [21, 2], [23, 3], [25, 2], [20, 5], [24, 5]]) { p.set(cx, cy, '#f0c860'); p.set(cx + 1, cy, '#e0b048'); }
      p.rect(12, 4, 4, 3, '#f0f0f0'); p.hline(13, 14, 4, '#b82818'); p.set(13, 5, '#d83828');
    }
    p.rect(14, 12, 4, 4, '#2a1a10');
    p.rect(0, 15, W, 11, '#b81e24'); p.hline(0, W - 1, 15, '#4a2a18'); p.hline(0, W - 1, 16, '#e04048');
    for (let x = 3; x < W - 1; x += 6) p.vline(x, 17, 24, '#8a1418');
    p.hline(0, W - 1, 25, '#6a1014');
    return finish(p);
  }
  // a dark wood table with two black metal chairs
  function toroTable() {
    const W = 32, H = 26, p = new Pix(W, H);
    for (const x of [0, 26]) {
      p.vline(x + 1, 2, 24, '#1a1a1e'); p.vline(x + 4, 2, 24, '#1a1a1e'); p.hline(x + 1, x + 4, 2, '#3a3a44');
      for (const y of [5, 8, 11]) p.hline(x + 2, x + 3, y, '#2a2a30');
      p.rect(x, 14, 6, 3, '#3a3a44'); p.hline(x, x + 5, 14, '#5a5a64');
    }
    p.rect(6, 6, 20, 10, '#5a3a24'); p.hline(6, 25, 6, '#7a5434'); p.rect(6, 16, 20, 2, '#3a2416');
    p.vline(8, 18, 25, '#3a2416'); p.vline(23, 18, 25, '#3a2416');
    p.rect(9, 8, 2, 3, '#f0f0f0'); p.rect(11, 8, 2, 3, '#4a4a4a'); p.rect(13, 7, 2, 4, '#c82020'); p.set(13, 7, '#f0d040');
    p.rect(18, 9, 5, 3, '#f0f0f0'); p.hline(18, 22, 9, '#ffffff');
    return finish(p);
  }
  // the desert mural: a big blue sky, a sun, purple mountains, sand and agave
  function toroMural() {
    const W = 64, H = 24, p = new Pix(W, H);
    for (let y = 0; y < H; y++) p.hline(0, W - 1, y, y < 4 ? '#3a7ac8' : y < 8 ? '#5a94d8' : '#8ab8e8');
    for (let y = -3; y <= 3; y++) for (let x = -3; x <= 3; x++) if (x * x + y * y <= 10) p.set(48 + x, 5 + y, '#f8d850');
    for (let x = 0; x < W; x++) {
      const m1 = 11 + Math.round(3 * Math.sin(x * 0.18) + 2 * Math.sin(x * 0.07 + 1)), m2 = 14 + Math.round(2 * Math.sin(x * 0.27 + 2));
      for (let y = m1; y < H; y++) p.set(x, y, '#8a6ab0');
      for (let y = m2; y < H; y++) p.set(x, y, '#6a4a90');
      for (let y = 17; y < H; y++) p.set(x, y, (x + y) % 7 ? '#d8a860' : '#c89050');
    }
    for (const [ax, ay] of [[8, 21], [22, 22], [38, 20], [55, 22]]) {
      for (const [dx, h] of [[-3, 2], [-2, 4], [-1, 5], [0, 6], [1, 5], [2, 4], [3, 2]]) p.vline(ax + dx, ay - h, ay, Math.abs(dx) % 2 ? '#3a7a4a' : '#5a9a5a');
    }
    p.outline('#5a3a24');
    return p.canvas();
  }
  // a string of little Mexican flags (green, white and red), sagging between its ends
  function bunting(W, sag = 3) {
    const p = new Pix(W, 9 + sag);
    const yAt = (x) => Math.round(sag * Math.sin(Math.PI * x / (W - 1)));
    for (let x = 0; x < W; x++) p.set(x, yAt(x), '#3a3a3a');
    for (let x0 = 2; x0 + 6 < W; x0 += 9) {
      const y = 1 + yAt(x0 + 3);
      for (let i = 0; i < 6; i++) p.vline(x0 + i, y, y + 5, i < 2 ? '#1e8a3e' : i < 4 ? '#f6f6f0' : '#d82830');
      p.set(x0 + 2, y + 2, '#a8783a'); p.set(x0 + 3, y + 2, '#5a8a3a');
    }
    return p.canvas();
  }
  // a frosted glass lamp on a brass chain, glowing
  function toroLamp() {
    const p = new Pix(14, 34), T = 12;
    for (let y = 0; y < 8 + T; y++) p.set(6 + (y % 2), y, y % 2 ? '#8a6a30' : '#c8a050');
    p.hline(4, 9, 9 + T, '#c8a050');
    p.rect(2, 10 + T, 10, 7, '#f6eed8'); p.hline(2, 11, 10 + T, '#fffaf0'); p.vline(11, 11 + T, 16 + T, '#d8ccb0');
    for (let x = 2; x < 12; x += 2) p.set(x, 17 + T, '#f6eed8');
    p.rect(5, 18 + T, 4, 2, '#fff4a8');
    return finish(p);
  }
  // a peach pillar, hung with a strand of garlic
  function garlicPillar() {
    const p = new Pix(16, 46);
    p.rect(1, 0, 14, 46, '#f0a878'); p.vline(1, 0, 45, '#f8c098'); p.rect(12, 0, 3, 46, '#d08858');
    p.vline(7, 2, 34, '#8a7a5a');
    for (let i = 0; i < 9; i++) {
      const x = 5 + (i % 2) * 3, y = 4 + i * 3.4;
      p.rect(x, Math.round(y), 3, 3, '#f8f4ea'); p.set(x + 2, Math.round(y) + 2, '#d8d0c0'); p.set(x + 1, Math.round(y) - 1, '#c8b8a8');
    }
    return finish(p);
  }
  // beer signs (no brands): a blue surfboard, and a green one with a gold crown
  function beerSurf() {
    const p = new Pix(12, 30);
    p.vline(5, 0, 3, '#3a3a3a');
    for (let y = 4; y < 30; y++) { const h = Math.round(5 * Math.sin(Math.PI * (y - 3) / 27)); p.hline(6 - h, 5 + h, y, '#2a6ac8'); }
    p.vline(5, 6, 27, '#f8f8f0'); p.vline(6, 6, 27, '#f0c830');
    return finish(p);
  }
  function beerGreen() {
    const p = new Pix(22, 14);
    p.rect(0, 0, 22, 14, '#1e8a3e'); p.rect(1, 1, 20, 12, '#2aa04a'); p.hline(1, 20, 1, '#5ac070');
    for (const x of [8, 11, 14]) { p.vline(x, 4, 7, '#f0c830'); p.set(x, 3, '#f8e070'); }
    p.hline(7, 15, 8, '#f0c830'); p.hline(5, 17, 10, '#f8f8f0');
    return finish(p);
  }
  function soccerBall() {
    const p = new Pix(12, 12);
    for (let y = 0; y < 12; y++) for (let x = 0; x < 12; x++) if ((x - 5.5) ** 2 + (y - 5.5) ** 2 <= 30) p.set(x, y, '#f8f8f4');
    p.rect(4, 4, 4, 3, '#1a1a1e'); p.hline(5, 6, 7, '#1a1a1e');
    for (const [x, y] of [[1, 5], [1, 6], [10, 5], [10, 6], [3, 10], [4, 10], [7, 10], [8, 10], [5, 0], [6, 0]]) p.set(x, y, '#1a1a1e');
    for (const [x, y] of [[3, 3], [8, 3], [3, 7], [8, 7], [5, 8], [6, 8]]) p.set(x, y, '#a8a8b0');
    return finish(p);
  }
  // a metal sun with a face
  function sunFace() {
    const p = new Pix(20, 20);
    for (let a = 0; a < 12; a++) { const t = a * Math.PI / 6; for (let r = 6; r < 10; r++) p.set(Math.round(9.5 + Math.cos(t) * r), Math.round(9.5 + Math.sin(t) * r), a % 2 ? '#c88a20' : '#e8a830'); }
    for (let y = 0; y < 20; y++) for (let x = 0; x < 20; x++) if ((x - 9.5) ** 2 + (y - 9.5) ** 2 <= 30) p.set(x, y, (x + y) % 9 ? '#f0b838' : '#d89a28');
    p.set(7, 8, '#5a3a10'); p.set(12, 8, '#5a3a10'); p.hline(8, 11, 12, '#8a5a18'); p.set(7, 11, '#8a5a18'); p.set(12, 11, '#8a5a18');
    return finish(p);
  }
  // the swinging kitchen door, with a round window
  function kitchenDoor() {
    const p = new Pix(16, 28);
    p.rect(0, 0, 16, 28, '#5a3a24'); p.rect(1, 1, 14, 27, '#8a5a34'); p.vline(8, 1, 27, '#6a4228');
    for (let y = 5; y <= 9; y++) for (let x = 2; x <= 13; x++) if ((x - 7.5) ** 2 / 20 + (y - 7) ** 2 / 5 <= 1) p.set(x, y, '#c8d8e0');
    p.hline(2, 14, 20, '#c8c8d0');
    return finish(p);
  }
  // the cantina bar: a dark wood front with slats, and the shelf of bottles on the wall behind it
  function toroBar() {
    const W = 64, H = 22, p = new Pix(W, H);
    p.rect(0, 0, W, 5, '#7a5434'); p.hline(0, W - 1, 0, '#9a7450'); p.hline(0, W - 1, 4, '#4a2e1c');
    for (const [x, c] of [[6, '#c8e0e8'], [9, '#c8e0e8'], [30, '#f0c860'], [44, '#c8e0e8'], [55, '#a83020']]) { p.vline(x, 0, 2, c); p.set(x, 0, '#ffffff'); }
    p.rect(0, 5, W, 17, '#4a2e1c');
    for (let x = 2; x < W; x += 5) p.vline(x, 7, 20, '#3a2214');
    p.hline(0, W - 1, 20, '#2a1a10');
    return finish(p);
  }
  function toroBottles() {
    const W = 64, H = 22, p = new Pix(W, H);
    p.rect(0, 0, W, H, '#4a2e1c');
    for (const y of [9, 20]) { p.rect(0, y, W, 2, '#7a5434'); p.hline(0, W - 1, y, '#9a7450'); }
    const cols = ['#c88a20', '#2a7a3a', '#e8e0d0', '#a83020', '#d8a830', '#4a6a2a', '#f0f0e8', '#8a4a1a'];
    for (let i = 0; i < 18; i++) for (const shelf of [9, 20]) {
      const x = 2 + i * 3.5 + (shelf === 20 ? 1.5 : 0), c = cols[(i * 3 + shelf) % cols.length], h = 5 + ((i + shelf) % 3);
      if (x > W - 3) continue;
      p.rect(Math.round(x), shelf - h, 2, h, c); p.set(Math.round(x), shelf - h - 1, '#2a2a2a'); p.set(Math.round(x), shelf - h + 1, shade(c, 0.4));
    }
    return finish(p);
  }
  function barStool() {
    const p = new Pix(10, 14);
    p.rect(1, 0, 8, 4, '#c82828'); p.hline(1, 8, 0, '#e85050');
    p.vline(4, 4, 13, '#2a2a30'); p.vline(5, 4, 13, '#4a4a54'); p.hline(2, 7, 9, '#3a3a44'); p.hline(2, 7, 13, '#2a2a30');
    return finish(p);
  }
  // the little open mic stage in the cantina: a low riser, a mic stand, an amp and a stool
  function toroStage() {
    const W = 48, H = 36, p = new Pix(W, H);
    p.rect(0, 16, W, 14, '#6a4a30'); p.hline(0, W - 1, 16, '#8a6a48');
    for (let x = 0; x < W; x += 8) p.vline(x, 17, 29, '#5a3a24');
    p.rect(0, 30, W, 6, '#2a2a30'); p.hline(0, W - 1, 30, '#4a4a54');
    p.vline(14, 2, 24, '#2a2a30'); p.rect(13, 0, 3, 3, '#4a4a54'); p.set(14, 0, '#8a8a94'); p.hline(11, 17, 24, '#2a2a30');
    p.rect(30, 12, 12, 11, '#1e1e24'); p.rect(31, 14, 10, 7, '#3a3a40'); for (let y = 15; y < 21; y += 2) p.hline(31, 40, y, '#2a2a30'); p.hline(30, 41, 12, '#4a4a54'); p.set(39, 13, '#e8c040');
    p.rect(21, 14, 6, 2, '#2a2a30'); p.vline(22, 16, 23, '#2a2a30'); p.vline(25, 16, 23, '#2a2a30');
    return finish(p);
  }
  // the chalkboard A-frame out front of the stage
  function openMicSign() {
    const p = new Pix(30, 28);
    p.rect(1, 0, 28, 22, '#6a4a30'); p.rect(3, 2, 24, 18, '#2a3430');
    p.vline(3, 22, 27, '#5a3a24'); p.vline(26, 22, 27, '#5a3a24');
    p.outline();
    const cv = p.canvas(), x = cv.getContext('2d');
    for (const [s, y] of [['OPEN', 3], ['MIC!', 11]]) G.font.draw(x, s, 15 - Math.round(G.font.width(s) / 2), y, '#f4f0e8');
    return cv;
  }
  // Romulus's favorite toy (from the user's photo): a big shaggy tan sloth with an orange face,
  // a pale muzzle with a dark nose, little black eyes, and long white claws
  function slothPlush() {
    const W = 16, H = 20, p = new Pix(W, H), F = '#d8b078', FL = '#ecd0a0', FD = '#a8804a';
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const head = ((x - 7.5) / 6) ** 2 + ((y - 5) / 5) ** 2 <= 1, body = ((x - 7.5) / 6.5) ** 2 + ((y - 13) / 6.5) ** 2 <= 1;
      if (head || body) p.set(x, y, G.hash(x, y, 51) < 0.25 ? FL : G.hash(x, y, 52) < 0.2 ? FD : F);
    }
    for (const x of [1, 3, 12, 14]) p.set(x, 0 + (x % 3), F);
    for (let y = 2; y <= 8; y++) for (let x = 3; x <= 12; x++) if (((x - 7.5) / 4.6) ** 2 + ((y - 5) / 3.6) ** 2 <= 1) p.set(x, y, '#c8843a');
    for (let y = 5; y <= 10; y++) for (let x = 4; x <= 11; x++) if (((x - 7.5) / 3.3) ** 2 + ((y - 7.5) / 2.5) ** 2 <= 1) p.set(x, y, '#ecd6b4');
    p.hline(6, 9, 5, '#3a2a20'); p.hline(7, 8, 6, '#5a4030'); p.hline(5, 10, 9, '#4a3020');
    p.set(5, 4, '#141010'); p.set(10, 4, '#141010');
    for (const [x, y] of [[1, 12], [2, 13], [1, 14], [14, 12], [13, 13], [14, 14], [4, 19], [6, 19], [9, 19], [11, 19]]) p.set(x, y, '#f4f0e8');
    p.outline('#6a4a2a');
    return p.canvas();
  }
  function slothIcon() {
    const c = G.canvas(16, 16), s = slothPlush();
    c.getContext('2d').drawImage(s, 0, 0, 16, 20, 1, -1, 14, 17);
    return c;
  }
  // Abe's bass (sunburst, from the black case in his closet), as an icon, and held across the
  // Paul McCartney Lady (she's left-handed: the neck points the other way)
  function abeBassIcon() {
    const p = new Pix(16, 16);
    for (let i = 0; i < 9; i++) { p.set(6 + i, 9 - i, '#8a5a30'); p.set(7 + i, 9 - i, '#6a4020'); }
    p.rect(13, 0, 3, 3, '#2a1a10');
    for (let y = 8; y < 16; y++) for (let x = 0; x < 9; x++) {
      const e = ((x - 4) / 4.4) ** 2 + ((y - 12) / 3.8) ** 2;
      if (e <= 1) p.set(x, y, e > 0.6 ? '#3a1a0a' : e > 0.3 ? '#a85a20' : '#e8a040');
    }
    p.hline(2, 6, 12, '#f0f0f0'); p.set(5, 10, '#1a1a1a');
    p.outline();
    return p.canvas();
  }
  function bassHeld() {
    const p = new Pix(20, 8);
    p.hline(0, 11, 3, '#8a5a30'); p.hline(0, 11, 4, '#6a4020'); p.rect(0, 2, 2, 4, '#2a1a10');
    for (let y = 0; y < 8; y++) for (let x = 10; x < 20; x++) {
      const e = ((x - 15) / 4.8) ** 2 + ((y - 4) / 3.8) ** 2;
      if (e <= 1) p.set(x, y, e > 0.6 ? '#3a1a0a' : e > 0.3 ? '#a85a20' : '#e8a040');
    }
    p.vline(14, 2, 6, '#f0f0f0');
    p.outline();
    return p.canvas();
  }
  function cableIcon() {
    const p = new Pix(16, 16);
    cableCoil(p, 7.5, 9, 6.5);
    p.outline();
    return p.canvas();
  }
  // Romulus's head, golf cart sized, shoved out through the trees with his sloth clamped in his
  // jaws (facing right, toward Nate): black fur with a ragged back edge (the leaves cover it),
  // a folded-over ear tip, the thin white blaze, an amber eye, a white muzzle, the big shiny
  // nose, and the sloth between his teeth. Frame 1 is mid-tug: a snarl in the muzzle, and the
  // sloth stretched a little farther.
  function romSnout(tug) {
    const W = 52, H = 36, p = new Pix(W, H);
    const BLK = '#1c1c24', BLK_L = '#383848', BLK_D = '#101016', WHT = '#f6f4ef', WHT_D = '#dcd8d0', WHT_S = '#c4c0b8';
    const inE = (x, y, cx, cy, rx, ry) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
    const furry = (x, y, cx, cy, rx, ry) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1 + (G.hash(x >> 1, y >> 1, 91) - 0.5) * 0.35;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      // the skull and the jowl under it (black, ragged at the back)
      if (furry(x, y, 15, 15, 15, 12) || furry(x, y, 18, 24, 11, 6)) p.set(x, y, y < 8 && G.hash(x, y, 92) < 0.5 ? BLK_L : G.hash(x, y, 93) < 0.12 ? BLK_D : BLK);
    }
    // the ear, up, with the tip folded over
    for (let y = 0; y < 8; y++) for (let x = 6; x < 20; x++) if (y >= Math.abs(x - 12) * 0.9 - 1 && y < 8) p.set(x, y + 1, y < 3 ? BLK_L : BLK);
    for (const [x, y] of [[13, 0], [14, 1], [15, 1], [15, 2]]) p.set(x, y, BLK_L);
    // the upper muzzle (white, sloping down to the nose), shaded underneath
    for (let y = 8; y < 26; y++) for (let x = 18; x < W; x++) {
      const top = 12 + (x - 18) * 0.12, bot = 23 - (x - 18) * 0.06;
      if (y >= top && y <= bot && inE(x, y, 32, 17.5, 15, 8)) p.set(x, y, y > bot - 2 ? WHT_S : y > bot - 4 ? WHT_D : WHT);
    }
    // the blaze: a thin white stripe from the muzzle up between his eyes
    for (let k = 0; k <= 10; k++) { const x = Math.round(23 - k * 0.8), y = Math.round(12 - k); p.set(x, y, WHT); if (k < 5) p.set(x + 1, y, WHT); }
    // the eye: amber-brown, a dark pupil, a catchlight, and a little brow of light fur
    for (let y = 7; y <= 11; y++) for (let x = 25; x <= 30; x++) if (inE(x, y, 27.5, 9, 2.4, 2)) p.set(x, y, '#9a5a20');
    p.rect(27, 8, 2, 2, '#1a0c06'); p.set(27, 8, '#ffffff'); p.hline(25, 30, 6, BLK_L);
    // the snarl, mid-tug
    if (tug) for (const [x, y] of [[30, 13], [31, 14], [34, 13], [35, 14], [38, 14]]) p.set(x, y, WHT_S);
    // the mouth, open around the sloth: the dark inside, the lower jaw, a few teeth
    for (let y = 22; y < 30; y++) for (let x = 20; x < 46; x++) if (inE(x, y, 32, 25, 13, 3.2)) p.set(x, y, '#4a141c');
    for (let y = 26; y < 34; y++) for (let x = 18; x < 44; x++) if (inE(x, y, 30, 29.5, 13, 3.4)) p.set(x, y, y > 31 ? WHT_S : y > 29 ? WHT_D : WHT);
    for (const x of [24, 29, 36, 41]) { p.set(x, 23, '#ffffff'); p.set(x, 24, '#e8e4dc'); }
    for (const x of [26, 33]) p.set(x, 27, '#ffffff');
    // the sloth, clamped in his teeth and hanging out toward Nate (shaggy tan, an orange face, white claws)
    const sx = tug ? 2 : 0;
    for (let y = 21; y < 33; y++) for (let x = 34; x < W; x++) {
      if (inE(x, y, 43 + sx, 27, 7 + sx * 0.5, 4.6)) p.set(x, y, G.hash(x, y, 51) < 0.25 ? '#ecd0a0' : G.hash(x, y, 52) < 0.2 ? '#a8804a' : '#d8b078');
    }
    for (let y = 23; y < 28; y++) for (let x = 38; x < 44; x++) if (inE(x, y, 40.5 + sx, 25.5, 2.6, 2)) p.set(x, y, '#c8843a');
    p.set(40 + sx, 25, '#141010'); p.set(42 + sx, 25, '#141010');
    for (const [x, y] of [[50, 26], [51, 27], [50, 28], [49, 30], [50, 31]]) p.set(x + sx > W - 1 ? W - 1 : x + sx, y, '#f4f0e8');
    // the upper lip over the sloth, and the big shiny nose
    for (let x = 22; x < 46; x++) p.set(x, Math.round(22.6 - (x - 22) * 0.04), WHT_D);
    for (let y = 11; y < 21; y++) for (let x = 41; x < W; x++) if (inE(x, y, 46, 15.5, 4.6, 3.6)) p.set(x, y, '#0e0e12');
    p.hline(44, 46, 13, '#6a6a78'); p.set(43, 14, '#4a4a56'); p.set(48, 17, '#000000'); p.set(47, 17, '#000000');
    p.outline();
    return p.canvas();
  }
  // the clump of leaves (and a pine bough) his head shoves through: it covers the back of his head
  function romSnoutLeaves() {
    const W = 26, H = 46, p = new Pix(W, H), cols = ['#2e6a2c', '#3a7a34', '#5a9a44', '#7aba5a'];
    for (let i = 0; i < 26; i++) {
      const cx = 4 + G.hash(i, 1, 94) * 16, cy = 3 + G.hash(i, 2, 94) * 40, r = 3 + G.hash(i, 3, 94) * 3;
      for (let y = -6; y <= 6; y++) for (let x = -6; x <= 6; x++) if (x * x + y * y <= r * r) p.set(cx + x, cy + y, x + y < -2 ? cols[3] : x + y < 2 ? cols[2] : G.hash(i, 4, 94) < 0.5 ? cols[1] : cols[0]);
    }
    for (let y = 8; y < 40; y += 3) p.set(18 + Math.round(Math.sin(y) * 2), y, '#1e4a22');
    for (let x = 0; x < 12; x++) p.set(x, 30 + Math.round(x * 0.3), '#6a4a2a');
    return finish(p);
  }

  // ================================================================ ABE'S REACH (he's 6'5")
  // A kite stuck high in the tree on the visitor parking island (with a pouch tied to its tail)
  function kiteInTree() {
    const p = new Pix(18, 32), cx = 8;
    for (let y = 0; y <= 15; y++) {
      const h = y <= 5 ? Math.round(y * 1.2) : Math.round((15 - y) * 0.6);
      for (let x = cx - h; x <= cx + h; x++) p.set(x, y, (x < cx) === (y < 6) ? '#d83030' : '#f0c830');
    }
    p.vline(cx, 0, 15, '#7a5430'); p.hline(cx - 6, cx + 6, 5, '#7a5430');
    for (let y = 16; y < 29; y++) p.set(cx + Math.round(Math.sin(y * 0.6) * 2), y, '#e8e8e0');
    for (const y of [19, 23, 27]) { const x = cx + Math.round(Math.sin(y * 0.6) * 2); p.set(x - 1, y, '#3a6ad8'); p.set(x + 1, y, '#3a6ad8'); }
    p.rect(cx - 2, 29, 4, 3, '#8a6a3a'); p.hline(cx - 2, cx + 1, 29, '#a88a5a');
    return finish(p);
  }
  // Anette's old garden, walled in by a tall hedge: a section of hedge (a top and a front face),
  // the little wooden gate (latched, then open), a stone birdbath, a bench, a gnome, roses
  function tallHedge() {
    const p = new Pix(16, 28);
    for (let y = 0; y < 28; y++) for (let x = 0; x < 16; x++) {
      const top = y < 12, h = G.hash(x, y, 71);
      p.set(x, y, top ? (h < 0.25 ? '#7ab858' : h < 0.7 ? '#5a9a44' : '#4a8a3a') : (h < 0.2 ? '#4a8a3a' : h < 0.75 ? '#3e7a34' : '#2a5a2a'));
    }
    p.hline(0, 15, 12, '#24562a');
    for (let x = 0; x < 16; x += 3) p.set(x, 0, '#9ad070');
    return p.canvas();
  }
  function gardenGate(open) {
    const p = new Pix(16, 28);
    if (open) {
      p.rect(0, 10, 3, 18, '#8a6a42'); p.vline(1, 10, 27, '#a8865a'); p.set(1, 9, '#8a6a42');
      return finish(p);
    }
    p.rect(1, 10, 14, 18, '#8a6a42');
    for (let x = 2; x < 15; x += 3) { p.vline(x, 10, 27, '#a8865a'); p.set(x, 9, '#8a6a42'); }
    p.hline(1, 14, 14, '#6a4a2a'); p.hline(1, 14, 23, '#6a4a2a');
    p.rect(11, 17, 3, 3, '#7a7a80'); p.set(12, 18, '#c86a3a'); p.set(11, 19, '#c86a3a');
    return finish(p);
  }
  function birdbath() {
    const p = new Pix(16, 22);
    p.rect(1, 2, 14, 5, '#a8a8a0'); p.hline(1, 14, 2, '#c8c8c0'); p.rect(3, 3, 10, 2, '#7ab0d8'); p.hline(4, 9, 3, '#b8e0f8');
    p.rect(6, 7, 4, 11, '#9a9a92'); p.vline(6, 7, 17, '#b8b8b0');
    p.rect(3, 18, 10, 4, '#8a8a82'); p.hline(3, 12, 18, '#a8a8a0');
    p.set(4, 1, '#5a8a3a'); p.set(12, 1, '#5a8a3a');
    return finish(p);
  }
  function stoneBench() {
    const p = new Pix(30, 14);
    p.rect(0, 2, 30, 5, '#a8a8a0'); p.hline(0, 29, 2, '#c8c8c0'); p.hline(0, 29, 6, '#7a7a72');
    for (const x of [3, 23]) { p.rect(x, 7, 4, 7, '#8a8a82'); p.vline(x, 7, 13, '#a8a8a0'); }
    p.set(8, 3, '#7a9a5a'); p.set(9, 3, '#7a9a5a'); p.set(20, 4, '#7a9a5a');
    return finish(p);
  }
  function gardenGnome() {
    const p = new Pix(10, 16);
    for (let y = 0; y < 6; y++) p.hline(5 - Math.ceil(y / 2), 4 + Math.ceil(y / 2), y, '#d83030');
    p.rect(3, 6, 4, 2, '#f2c8a8'); p.set(4, 6, '#2a2a30'); p.set(6, 6, '#2a2a30');
    p.rect(2, 8, 6, 3, '#f4f4f0'); p.rect(2, 11, 6, 3, '#3a6ad8'); p.rect(2, 14, 6, 2, '#5a3a24');
    return finish(p);
  }
  function roseBush() {
    const p = new Pix(16, 16);
    for (let y = 2; y < 16; y++) for (let x = 0; x < 16; x++) if (((x - 7.5) / 7.5) ** 2 + ((y - 9) / 7) ** 2 <= 1) p.set(x, y, G.hash(x, y, 73) < 0.3 ? '#4a8a3a' : '#2e6a2e');
    for (const [x, y] of [[4, 5], [9, 4], [12, 8], [6, 9], [3, 11], [10, 12]]) { p.set(x, y, '#d82838'); p.set(x + 1, y, '#f04858'); p.set(x, y + 1, '#a81828'); }
    return finish(p);
  }

  // ================================================================ CHKD (from the user's photo)
  // Children's Hospital of The King's Daughters, where Hannah works in the NICU. Outside: the
  // long beige wing with the name across it, the entrance pavilion with the giant alphabet
  // blocks (a red cross over C H K D) and a gable with an arched window over the glass doors,
  // the tower with the purple glass cupola, the brown brick tower, the striped canopy over the
  // drop-off, and the plaza: blue and yellow swirls painted on the ground, big red ball
  // bollards, yellow benches, bronze statues of kids playing, and the flag.
  const CHKD_BEIGE = '#e2d6bc', CHKD_BEIGE_D = '#c8baa0', CHKD_BEIGE_L = '#f0e8d4';
  function chkdBrick(p, x0, y0, w, h, seed) {
    for (let y = 0; y < h; y++) {
      const row = Math.floor(y / 3), off = row % 2 ? 3 : 0;
      for (let x = 0; x < w; x++) p.set(x0 + x, y0 + y, y % 3 === 2 || (x + off) % 6 === 0 ? '#9a8470' : G.hash(Math.floor((x + off) / 6), row, seed) < 0.3 ? '#6a4a34' : '#7a563c');
    }
  }
  // a ribbon of dark windows with white mullions
  function chkdWindows(p, x0, y0, w, h, step = 8, frame = '#f4f0e8', glass = '#2a3440') {
    p.rect(x0, y0, w, h, frame);
    for (let x = x0 + 1; x < x0 + w - 1; x += step) p.rect(x, y0 + 1, step - 1, h - 2, glass);
    for (let x = x0 + 3; x < x0 + w - 2; x += step * 3) p.vline(x, y0 + 2, y0 + h - 3, '#4a5a68');
    if (h > 12) p.hline(x0, x0 + w - 1, y0 + Math.round(h / 2), frame);
  }
  function chkdFront() {
    const W = 576, H = 176, p = new Pix(W, H);
    // ---- behind it all: the rest of the medical center, taller brown brick buildings with
    // rows of windows, and the roofs in between
    for (let y = 0; y < 72; y++) for (let x = 0; x < W; x++) {
      const bx = Math.floor(x / 64), tall = 6 + Math.floor(G.hash(bx, 0, 85) * 22);
      if (y < tall) { p.set(x, y, '#9aa8b8'); continue; }
      const win = (x % 8 < 4) && (y % 9 > 3) && (y % 9 < 8);
      p.set(x, y, y === tall ? '#c8b8a0' : win ? '#5a6470' : (bx % 2 ? '#a88a6a' : '#b89a78'));
    }
    // ---- the long left wing: flat roof, the name across its upper band, two ribbons of windows, brick base
    p.rect(0, 52, 216, 12, '#b8b4ac'); p.hline(0, 215, 52, '#d0ccc4'); p.hline(0, 215, 63, '#8a867e');
    p.rect(0, 64, 216, 112, CHKD_BEIGE);
    for (let x = 6; x < 216; x += 24) { p.vline(x, 66, 94, CHKD_BEIGE_D); p.vline(x + 1, 66, 94, CHKD_BEIGE_L); }
    p.hline(0, 215, 64, CHKD_BEIGE_L); p.hline(0, 215, 95, CHKD_BEIGE_D);
    chkdWindows(p, 4, 100, 208, 26);
    p.rect(0, 128, 216, 6, CHKD_BEIGE_D);
    chkdWindows(p, 4, 138, 150, 22, 10);
    chkdBrick(p, 0, 160, 216, 16, 81);
    p.rect(160, 136, 44, 24, '#7a563c'); p.rect(176, 140, 14, 14, '#c8b88a'); p.rect(178, 142, 10, 10, '#8a9ab8');   // the round medallion by the door
    // ---- the tower behind the entrance, with the purple glass cupola
    p.rect(236, 8, 80, 168, CHKD_BEIGE); p.vline(236, 8, 175, CHKD_BEIGE_L); p.rect(308, 8, 8, 168, CHKD_BEIGE_D);
    const gable = (cx, top, half) => { for (let y = 0; y < half; y++) p.hline(cx - y, cx + y, top + y, '#e8e8f0'); };
    p.rect(232, 14, 88, 30, '#2a1e34');
    for (let x = 234; x < 318; x += 7) p.rect(x, 18, 5, 24, x % 2 ? '#5a3a6a' : '#6a4a7a');
    p.hline(232, 319, 30, '#f0f0f4'); p.hline(232, 319, 43, '#f0f0f4');
    gable(250, 2, 14); gable(276, 0, 16); gable(302, 2, 14);
    for (let y = 6; y < 13; y++) for (let x = 270; x < 283; x++) if ((x - 276) ** 2 + (y - 10) ** 2 <= 16) p.set(x, y, '#3a2a4a');
    p.rect(268, 50, 16, 46, '#3a4450'); for (let y = 54; y < 94; y += 6) p.hline(268, 283, y, '#f4f0e8');
    // ---- the giant alphabet blocks: a red cross on yellow, over C H K D
    const block = (x, y, face, letter, ink) => {
      p.rect(x, y, 14, 14, face); p.hline(x, x + 13, y, shade(face, 0.3)); p.vline(x + 13, y, y + 13, shade(face, -0.3)); p.hline(x, x + 13, y + 13, shade(face, -0.3));
      return [x, y, letter, ink];
    };
    const letters = [];
    block(269, 62, '#f0c830'); p.rect(274, 64, 4, 10, '#d82828'); p.rect(271, 67, 10, 4, '#d82828');
    letters.push(block(248, 76, '#d82828', 'C', '#f8d840'), block(262, 76, '#8a8ad8', 'H', '#d82828'), block(276, 76, '#f0c830', 'K', '#d82828'), block(290, 76, '#f0c830', 'D', '#2a4aa8'));
    // ---- the entrance: a gable with an arched window, over the glass doors
    p.rect(216, 96, 120, 80, CHKD_BEIGE); p.hline(216, 335, 96, CHKD_BEIGE_L);
    for (let y = 0; y < 30; y++) p.hline(Math.round(276 - y * 1.4), Math.round(276 + y * 1.4), 100 + y, y === 0 ? CHKD_BEIGE_L : '#d8ccb0');
    for (let y = 108; y < 126; y++) for (let x = 262; x < 291; x++) if (((x - 276) / 13) ** 2 + ((y - 126) / 17) ** 2 <= 1) p.set(x, y, x % 6 === 0 || y === 118 ? '#f4f0e8' : '#2a3440');
    chkdWindows(p, 218, 104, 30, 30, 6); chkdWindows(p, 304, 104, 30, 30, 6);
    p.rect(240, 132, 72, 6, '#f4f0e8'); p.hline(240, 311, 137, '#c8c4bc');
    p.rect(244, 138, 64, 38, '#f4f0e8');
    for (const x of [248, 262, 278, 292]) p.rect(x, 142, 12, 34, '#2a3440');
    p.vline(254, 142, 175, '#4a5a68'); p.vline(298, 142, 175, '#4a5a68'); p.rect(270, 140, 12, 2, '#c8c8d0');
    // ---- the right side: a beige block, the brown brick tower, and the striped building beyond
    p.rect(336, 36, 56, 140, CHKD_BEIGE); p.hline(336, 391, 36, CHKD_BEIGE_L);
    for (let y = 44; y < 140; y += 24) chkdWindows(p, 340, y, 48, 16, 8);
    chkdBrick(p, 392, 16, 120, 160, 83); p.hline(392, 511, 16, '#9a8470');
    for (let y = 26; y < 150; y += 22) for (const x of [402, 430, 470, 494]) { p.rect(x - 2, y - 2, 16, 18, CHKD_BEIGE); p.rect(x, y, 12, 14, '#2a3440'); p.vline(x + 6, y, y + 13, '#f4f0e8'); }
    p.rect(512, 56, 64, 120, CHKD_BEIGE);
    for (let y = 56; y < 176; y += 12) p.rect(512, y, 64, 4, '#9a7a5a');
    for (let y = 64; y < 150; y += 24) chkdWindows(p, 518, y, 52, 14, 7);
    chkdWindows(p, 340, 150, 168, 26, 9);
    p.outline();
    const cv = p.canvas(), x = cv.getContext('2d');
    for (const [bx, by, l, ink] of letters) G.font.draw(x, l, bx + 7 - Math.round(G.font.width(l) / 2), by + 4, ink);
    const name = 'Children\'s Hospital of The King\'s Daughters';
    G.font.draw(x, name, 108 - Math.round(G.font.width(name) / 2), 74, '#4a3a2a');
    return cv;
  }
  // the striped canopy over the drop-off, on white posts
  function chkdCanopy() {
    const W = 144, H = 60, p = new Pix(W, H);
    const bands = ['#d83030', '#f0c830', '#2e8a4e', '#2a6ad8', '#f08a28'];
    p.rect(0, 0, W, 10, '#e8e8ec'); p.hline(0, W - 1, 0, '#ffffff');
    for (let x = 0; x < W; x++) for (let y = 10; y < 16; y++) p.set(x, y, bands[Math.floor(x / 12) % bands.length]);
    p.hline(0, W - 1, 16, '#8a8a92');
    for (let x = 4; x < W; x += 12) p.vline(x, 2, 8, '#c8c8d0');
    for (const x of [6, 66, 134]) { p.rect(x, 17, 5, 43, '#f4f4f0'); p.vline(x + 4, 17, 59, '#c8c8c8'); }
    p.rect(60, 17, 17, 6, '#d83030'); p.rect(62, 23, 13, 4, '#f4f4f0');
    return finish(p);
  }
  // a big red ball bollard
  function redBall() {
    const p = new Pix(14, 14);
    for (let y = 0; y < 14; y++) for (let x = 0; x < 14; x++) { const d = (x - 6.5) ** 2 + (y - 6.5) ** 2; if (d <= 44) p.set(x, y, d < 8 && x < 7 && y < 7 ? '#e86a50' : (x + y > 16 ? '#8a2a1e' : '#b83a28')); }
    p.set(4, 4, '#f8a088');
    return finish(p);
  }
  // a yellow capsule bench
  function yellowBench() {
    const p = new Pix(30, 12);
    for (let y = 0; y < 8; y++) for (let x = 0; x < 30; x++) if (((x - 14.5) / 15) ** 2 + ((y - 4) / 4.5) ** 2 <= 1) p.set(x, y, y < 3 ? '#f8e070' : '#e8c030');
    for (const x of [6, 22]) { p.rect(x, 7, 3, 5, '#c89a20'); }
    return finish(p);
  }
  // bronze statues of kids playing (and a little dog)
  function kidStatues() {
    const W = 40, H = 34, p = new Pix(W, H), B = '#8a6a3a', BL = '#b8925a', BD = '#5a4224';
    const kid = (x, y, h, arm) => {
      p.rect(x - 2, y - h, 5, 5, B); p.set(x - 1, y - h, BL);
      p.rect(x - 2, y - h + 5, 5, h - 9, B); p.vline(x - 2, y - h + 5, y - 5, BL);
      p.vline(x - 1, y - 4, y, BD); p.vline(x + 1, y - 4, y, BD);
      if (arm > 0) { p.set(x + 3, y - h + 6, B); p.set(x + 4, y - h + 5, B); p.set(x + 5, y - h + 4, B); }
      else { p.set(x - 3, y - h + 6, B); p.set(x - 4, y - h + 7, B); }
    };
    kid(8, 30, 22, 1); kid(18, 32, 26, -1); kid(29, 31, 20, 1);
    p.rect(30, 26, 7, 4, B); p.rect(35, 23, 3, 3, B); p.set(31, 30, BD); p.set(36, 30, BD);
    p.rect(2, 30, 36, 4, '#8a8a82'); p.hline(2, 37, 30, '#a8a8a0');
    return finish(p);
  }
  // the flagpole, with the flag
  function chkdFlag() {
    const p = new Pix(24, 80);
    p.vline(3, 2, 79, '#c8c8d0'); p.vline(4, 2, 79, '#8a8a92'); p.rect(2, 0, 4, 3, '#d8c060');
    for (let y = 0; y < 13; y++) for (let x = 0; x < 18; x++) {
      const wav = Math.round(Math.sin(x * 0.5) * 1);
      p.set(5 + x, 4 + y + wav, x < 8 && y < 7 ? ((x + y) % 3 ? '#2a3a7a' : '#f8f8f8') : (y % 2 ? '#f8f8f8' : '#c82838'));
    }
    p.rect(1, 76, 7, 4, '#9a9a92');
    return finish(p);
  }
  // a hospital street lamp
  function chkdLamp() {
    const p = new Pix(16, 64);
    p.vline(4, 6, 63, '#b8b8c0'); p.vline(5, 6, 63, '#8a8a92');
    p.hline(4, 12, 4, '#8a8a92'); p.rect(8, 2, 7, 4, '#d8d8e0'); p.hline(9, 13, 5, '#f8f4c8');
    p.rect(2, 52, 6, 12, '#c82828'); p.hline(2, 7, 52, '#e85050');
    return finish(p);
  }

  // a car seat (the hypnotized dad out front is carrying one)
  function carSeat() {
    const p = new Pix(14, 12);
    p.rect(1, 3, 12, 8, '#4a4a54'); p.rect(3, 4, 8, 5, '#8a8a96'); p.hline(1, 12, 10, '#2a2a30');
    for (let x = 1; x <= 12; x++) p.set(x, 3 - Math.round(Math.sin((x - 1) / 11 * Math.PI) * 3), '#2a2a30');
    p.rect(5, 5, 4, 3, '#f8c8d8');
    return finish(p);
  }
  // ---- inside: the lobby, the ward, the playroom and the NICU
  function receptionDesk() {
    const W = 64, H = 28, p = new Pix(W, H);
    p.rect(0, 0, W, 6, '#f4f0e8'); p.hline(0, W - 1, 0, '#ffffff'); p.hline(0, W - 1, 5, '#c8c4bc');
    p.rect(0, 6, W, 22, '#4a8ad8'); for (let x = 0; x < W; x += 8) p.rect(x, 8, 4, 18, ['#f0c830', '#d83030', '#2e8a4e', '#f08a28'][(x / 8) % 4]);
    p.hline(0, W - 1, 27, '#2a4a8a');
    p.rect(10, -0, 12, 2, '#2a2a30'); p.rect(44, 0, 10, 2, '#2a2a30');
    return finish(p);
  }
  function elevatorDoors() {
    const p = new Pix(32, 32);
    p.rect(0, 0, 32, 32, '#9aa0a8'); p.rect(2, 6, 28, 26, '#c8ccd2'); p.vline(16, 6, 31, '#8a8e96'); p.vline(15, 6, 31, '#e0e2e8');
    p.rect(10, 1, 12, 4, '#1a1a1e'); p.set(13, 2, '#f86858'); p.set(14, 2, '#f86858'); p.set(17, 2, '#f86858');
    return finish(p);
  }
  function elevatorButtons() {
    const p = new Pix(6, 12);
    p.rect(0, 0, 6, 12, '#b8bcc4'); p.rect(2, 2, 2, 2, '#f8f8f8'); p.rect(2, 7, 2, 2, '#f8f8f8');
    return finish(p);
  }
  function fishTank() {
    const W = 48, H = 30, p = new Pix(W, H);
    p.rect(0, 0, W, H, '#2a2a30'); p.rect(2, 2, W - 4, H - 8, '#3a8ad8');
    for (let y = 2; y < H - 6; y++) p.hline(2, W - 3, y, y < 8 ? '#5aa8e8' : y < 16 ? '#3a8ad8' : '#2a6ab8');
    p.rect(2, H - 10, W - 4, 4, '#e8d8a8');
    for (const x of [8, 30, 40]) { p.vline(x, H - 18, H - 10, '#3a9a4a'); p.vline(x + 1, H - 15, H - 10, '#4aba5a'); }
    for (const [x, y, c] of [[12, 8, '#f08a28'], [24, 13, '#f0c830'], [34, 7, '#d83030'], [18, 17, '#f8f8f8']]) { p.rect(x, y, 4, 2, c); p.set(x - 1, y, c); p.set(x + 4, y + 1, '#1a1a1a'); }
    for (const [x, y] of [[28, 4], [29, 9], [10, 14]]) p.set(x, y, '#c8e8f8');
    p.rect(0, H - 6, W, 6, '#6a4a30');
    return finish(p);
  }
  function bigTeddy() {
    const p = new Pix(26, 28), F = '#9a6a3a', FL = '#c8945a', FD = '#6a4422';
    for (let y = 0; y < 28; y++) for (let x = 0; x < 26; x++) {
      const head = ((x - 12.5) / 7) ** 2 + ((y - 7) / 6.5) ** 2 <= 1, body = ((x - 12.5) / 10) ** 2 + ((y - 19) / 8.5) ** 2 <= 1;
      const ears = ((x - 6) / 3) ** 2 + ((y - 2) / 3) ** 2 <= 1 || ((x - 19) / 3) ** 2 + ((y - 2) / 3) ** 2 <= 1;
      if (head || body || ears) p.set(x, y, (x + y) % 7 ? F : FD);
    }
    for (let y = 15; y < 25; y++) for (let x = 7; x < 19; x++) if (((x - 12.5) / 5.5) ** 2 + ((y - 20) / 5) ** 2 <= 1) p.set(x, y, FL);
    p.rect(10, 8, 6, 4, FL); p.set(12, 8, '#1a1010'); p.set(13, 8, '#1a1010'); p.set(10, 6, '#1a1010'); p.set(15, 6, '#1a1010');
    p.rect(9, 13, 8, 2, '#d83030');
    return finish(p);
  }
  function kidChairs() {
    const W = 48, H = 20, p = new Pix(W, H), cols = ['#d83030', '#2a6ad8', '#f0c830', '#2e8a4e'];
    for (let i = 0; i < 4; i++) {
      const x = i * 12, c = cols[i];
      p.rect(x + 1, 0, 10, 8, c); p.hline(x + 1, x + 10, 0, shade(c, 0.3));
      p.rect(x, 8, 12, 5, shade(c, 0.12)); p.hline(x, x + 11, 12, shade(c, -0.3));
      p.vline(x + 1, 13, 19, '#4a4a54'); p.vline(x + 10, 13, 19, '#4a4a54');
    }
    return finish(p);
  }
  // the alphabet blocks again, stacked up as a lobby sculpture
  function blockStack() {
    const W = 40, H = 44, p = new Pix(W, H);
    const block = (x, y, face) => { p.rect(x, y, 16, 16, face); p.hline(x, x + 15, y, shade(face, 0.3)); p.vline(x + 15, y, y + 15, shade(face, -0.3)); p.hline(x, x + 15, y + 15, shade(face, -0.3)); };
    block(2, 28, '#d83030'); block(20, 28, '#f0c830'); block(11, 12, '#8a8ad8');
    p.rect(16, 0, 10, 12, '#f0c830'); p.rect(19, 2, 4, 8, '#d83030'); p.rect(17, 4, 8, 4, '#d83030');
    p.outline();
    const cv = p.canvas(), x = cv.getContext('2d');
    for (const [l, bx, by, ink] of [['C', 10, 32, '#f8d840'], ['K', 28, 32, '#d83030'], ['H', 19, 16, '#d83030']]) G.font.draw(x, l, bx - Math.round(G.font.width(l) / 2), by, ink);
    return cv;
  }
  function giftShop() {
    const W = 48, H = 40, p = new Pix(W, H);
    p.rect(0, 14, W, 26, '#f4f0e8'); p.hline(0, W - 1, 14, '#ffffff');
    for (const y of [22, 31]) p.hline(0, W - 1, y, '#c8b898');
    for (const [x, y, c] of [[4, 17, '#9a6a3a'], [12, 17, '#f0c8d8'], [20, 17, '#f8f8f8'], [28, 17, '#9a6a3a'], [36, 17, '#a8d8f0'], [6, 26, '#f0c830'], [16, 26, '#d8a8e8'], [26, 26, '#9a6a3a'], [38, 26, '#f08a8a']]) { p.rect(x, y, 6, 5, c); p.set(x + 1, y + 1, '#1a1010'); p.set(x + 4, y + 1, '#1a1010'); }
    for (const [x, c] of [[6, '#d83030'], [14, '#2a6ad8'], [22, '#f0c830'], [32, '#2e8a4e'], [40, '#d870c8']]) {
      for (let y = 0; y < 8; y++) for (let k = 0; k < 7; k++) if (((k - 3) / 3.5) ** 2 + ((y - 3.5) / 4) ** 2 <= 1) p.set(x - 3 + k, y, c);
      p.set(x - 2, 1, '#ffffff'); p.vline(x, 8, 14, '#8a8a8a');
    }
    return finish(p);
  }
  function nurseStation() {
    const W = 80, H = 30, p = new Pix(W, H);
    p.rect(0, 0, W, 8, '#f4f0e8'); p.hline(0, W - 1, 0, '#ffffff');
    for (const x of [6, 30, 56]) { p.rect(x, -0 + 0, 14, 7, '#2a2a30'); p.rect(x + 1, 1, 12, 5, '#3a8ad8'); p.hline(x + 2, x + 10, 3, '#a8e8a8'); }
    p.rect(0, 8, W, 22, '#6aa8c8'); for (let x = 3; x < W; x += 10) p.vline(x, 10, 28, '#5a98b8');
    p.rect(22, 3, 6, 4, '#f0c830'); p.rect(48, 3, 5, 4, '#f4f4f4'); p.set(49, 4, '#2a2a30');
    p.hline(0, W - 1, 29, '#3a6a8a');
    return finish(p);
  }
  // a patient room door, with a little window and a star on it
  function roomDoor(c) {
    const p = new Pix(16, 28);
    p.rect(0, 0, 16, 28, '#f4f0e8'); p.rect(2, 2, 12, 26, c); p.rect(5, 5, 6, 7, '#c8e0f0'); p.vline(8, 5, 11, '#f4f0e8');
    p.set(12, 16, '#c8c8d0'); p.set(12, 17, '#c8c8d0');
    p.set(8, 20, '#f8e070'); p.hline(7, 9, 21, '#f8e070'); p.set(8, 22, '#f8e070');
    return finish(p);
  }
  function ivPole() {
    const p = new Pix(10, 34);
    p.vline(4, 4, 31, '#b8b8c0'); p.hline(1, 8, 2, '#b8b8c0'); p.rect(1, 3, 4, 7, '#d8eef8'); p.hline(1, 4, 3, '#ffffff');
    p.hline(1, 8, 32, '#6a6a72'); p.set(0, 33, '#2a2a2a'); p.set(9, 33, '#2a2a2a');
    return finish(p);
  }
  function wheelchair() {
    const p = new Pix(16, 18);
    for (let a = 0; a < 20; a++) { const t = a / 20 * Math.PI * 2; p.set(Math.round(7 + Math.cos(t) * 6), Math.round(11 + Math.sin(t) * 6), '#3a3a44'); }
    p.rect(4, 2, 2, 9, '#5a5a64'); p.rect(4, 8, 9, 3, '#2a6ad8'); p.rect(4, 2, 2, 7, '#2a6ad8'); p.hline(11, 15, 13, '#5a5a64');
    return finish(p);
  }
  function crashCart() {
    const p = new Pix(16, 22);
    p.rect(0, 2, 16, 18, '#d83030'); for (const y of [6, 10, 14]) p.hline(1, 14, y, '#a82020'); p.rect(0, 0, 16, 3, '#e8e8ec');
    p.rect(3, 0, 6, 2, '#f0c830'); p.set(2, 21, '#2a2a2a'); p.set(13, 21, '#2a2a2a');
    return finish(p);
  }
  function rockingHorse() {
    const p = new Pix(22, 20);
    for (let x = 0; x < 22; x++) p.set(x, 17 + Math.round(((x - 10.5) / 10.5) ** 2 * -3 + 2), '#8a5a30');
    p.rect(5, 8, 11, 5, '#f8f4ec'); p.rect(14, 3, 5, 7, '#f8f4ec'); p.set(18, 4, '#1a1a1a'); p.rect(12, 2, 3, 6, '#d83030');
    for (const x of [6, 14]) p.vline(x, 13, 17, '#8a5a30'); p.rect(7, 7, 5, 2, '#2a6ad8');
    return finish(p);
  }
  function ballPit() {
    const W = 48, H = 28, p = new Pix(W, H), cols = ['#d83030', '#2a6ad8', '#f0c830', '#2e8a4e', '#f08a28'];
    p.rect(0, 6, W, 22, '#2a6ad8'); p.rect(2, 8, W - 4, 18, '#5aa8f0');
    for (let i = 0; i < 70; i++) { const x = 2 + Math.floor(G.hash(i, 1, 91) * (W - 6)), y = 2 + Math.floor(G.hash(i, 2, 91) * 20); p.rect(x, y, 3, 3, cols[i % 5]); p.set(x, y, '#ffffff'); }
    p.hline(0, W - 1, 27, '#1a4aa8');
    return finish(p);
  }
  function toyKitchen() {
    const p = new Pix(32, 30);
    p.rect(0, 6, 32, 24, '#f4a8c8'); p.rect(0, 4, 32, 4, '#f8f4ec');
    p.rect(3, 12, 12, 10, '#f8f8f8'); p.rect(5, 14, 8, 6, '#2a2a30'); p.rect(18, 10, 11, 4, '#c8c8d0');
    for (const x of [19, 25]) { p.rect(x, 5, 4, 2, '#3a3a40'); }
    p.rect(18, 16, 11, 12, '#f8d0e0'); p.set(27, 22, '#c8a0b0');
    return finish(p);
  }
  function blockTower() {
    const p = new Pix(16, 30), cols = ['#d83030', '#f0c830', '#2a6ad8', '#2e8a4e', '#f08a28'];
    for (let i = 0; i < 5; i++) { const x = 3 + ((i * 3) % 4) - 1, y = 24 - i * 6, c = cols[i]; p.rect(x, y, 9, 6, c); p.hline(x, x + 8, y, shade(c, 0.3)); }
    return finish(p);
  }
  // an isolette (NICU incubator): a clear hood over a tiny swaddled baby, on a cart with drawers
  function isolette(cap) {
    const W = 32, H = 30, p = new Pix(W, H);
    p.rect(1, 2, 30, 14, '#cfe6f2'); p.hline(1, 30, 2, '#f4fbff'); p.vline(1, 2, 15, '#f4fbff'); p.vline(30, 2, 15, '#a8c8d8');
    for (const x of [6, 22]) for (let y = 7; y <= 11; y++) for (let k = -2; k <= 2; k++) if (k * k + (y - 9) ** 2 <= 5) p.set(x + k, y, '#a8c8d8');
    p.rect(10, 8, 12, 6, '#f8f4ee'); p.rect(19, 7, 5, 5, '#f2c8b0'); p.rect(19, 6, 5, 3, cap); p.set(20, 9, '#8a6a5a'); p.set(22, 9, '#8a6a5a');
    p.hline(10, 18, 10, '#e8d8e0');
    p.rect(0, 16, 32, 3, '#e8e8ec'); p.rect(3, 19, 26, 9, '#f4f4f0'); p.hline(3, 28, 23, '#c8c8c8'); p.set(15, 21, '#8a8a92'); p.set(15, 25, '#8a8a92');
    p.rect(26, 17, 4, 2, '#78e070');
    p.set(4, 29, '#2a2a2a'); p.set(27, 29, '#2a2a2a');
    return finish(p);
  }
  // a monitor on a pole: a green heartbeat line
  function vitalsMonitor() {
    const p = new Pix(14, 34);
    p.rect(0, 0, 14, 11, '#2a2a30'); p.rect(1, 1, 12, 9, '#0e1a14');
    const line = [5, 5, 5, 3, 7, 1, 5, 5, 5, 5, 4, 5];
    line.forEach((y, i) => p.set(1 + i, 1 + y, '#58e878'));
    p.set(11, 2, '#f86858');
    p.vline(6, 11, 31, '#b8b8c0'); p.hline(2, 11, 32, '#6a6a72');
    return finish(p);
  }
  function nicuGlider() {
    const p = new Pix(18, 22);
    p.rect(3, 0, 12, 12, '#7a5434'); p.rect(4, 1, 10, 10, '#c8b8e0');
    p.rect(1, 11, 16, 5, '#9a7450'); p.rect(2, 11, 14, 3, '#c8b8e0');
    for (const x of [2, 15]) p.vline(x, 16, 21, '#5a3a24'); p.hline(0, 17, 21, '#5a3a24');
    return finish(p);
  }
  function nicuDoors() {
    const p = new Pix(32, 32);
    p.rect(0, 0, 32, 32, '#9aa0a8'); p.rect(2, 8, 13, 24, '#c8d8e8'); p.rect(17, 8, 13, 24, '#c8d8e8');
    p.rect(4, 12, 9, 7, '#e8f4fc'); p.rect(19, 12, 9, 7, '#e8f4fc');
    p.rect(6, 1, 20, 6, '#2a4aa8');
    p.outline();
    const cv = p.canvas();
    G.font.draw(cv.getContext('2d'), 'NICU', 16 - Math.round(G.font.width('NICU') / 2), 0, '#f8f8f8');
    return cv;
  }
  // Hannah's work badge (a key item)
  function badgeIcon() {
    const p = new Pix(16, 16);
    p.vline(7, 0, 3, '#2a6ad8'); p.vline(8, 0, 3, '#2a6ad8');
    p.rect(3, 4, 10, 12, '#f8f8f4'); p.rect(3, 4, 10, 3, '#2a6ad8');
    p.rect(5, 8, 4, 5, '#f6d0bc'); p.rect(5, 8, 4, 2, '#c8995a'); p.hline(10, 11, 9, '#8a8a92'); p.hline(10, 11, 11, '#8a8a92');
    p.outline();
    return p.canvas();
  }

  // ---- after MECHA-BABY: Hannah's first-aid kit and the supply closets that restock it, Ruby's
  // room on the ward (the rock kid), and the roof at night (the helipad)
  // Hannah's first-aid kit: a red zip bag with a white cross and a handle
  function firstAidIcon() {
    const p = new Pix(16, 14);
    p.rect(1, 4, 14, 10, '#c82838'); p.hline(1, 14, 4, '#e85868'); p.hline(1, 14, 13, '#8a1824'); p.vline(14, 5, 13, '#a01c2c');
    p.hline(5, 10, 1, '#3a3a44'); p.vline(5, 1, 3, '#3a3a44'); p.vline(10, 1, 3, '#3a3a44');
    p.hline(2, 13, 6, '#f0c830');
    p.rect(7, 7, 2, 6, '#ffffff'); p.rect(5, 9, 6, 2, '#ffffff');
    p.outline();
    return p.canvas();
  }
  // a supply closet door (the ward and the lobby): gray, with a red cross on the sign
  function supplyDoor() {
    const p = new Pix(16, 28);
    p.rect(0, 0, 16, 28, '#f4f0e8'); p.rect(2, 2, 12, 26, '#b8c0cc'); p.vline(13, 2, 27, '#9aa2ae'); p.hline(2, 13, 2, '#d8dee6');
    p.rect(4, 5, 8, 8, '#f8f8f4'); p.rect(7, 6, 2, 6, '#d83030'); p.rect(5, 8, 6, 2, '#d83030');
    p.set(11, 17, '#6a6a72'); p.set(11, 18, '#6a6a72');
    p.hline(4, 11, 22, '#9aa2ae'); p.hline(4, 11, 24, '#9aa2ae');
    return finish(p);
  }
  // the NICU's supply cabinet, on the wall: glass doors, shelves of gauze and little bottles
  function supplyCabinet() {
    const p = new Pix(16, 24);
    p.rect(0, 0, 16, 24, '#e8ecf0'); p.hline(0, 15, 0, '#ffffff'); p.hline(0, 15, 23, '#a8b0bc');
    p.rect(1, 2, 14, 14, '#b8d8e8'); p.vline(8, 2, 15, '#e8ecf0');
    for (const y of [6, 11]) p.hline(1, 14, y, '#d8e4ec');
    p.rect(2, 3, 2, 3, '#f8f8f8'); p.rect(5, 4, 2, 2, '#f0a8b8'); p.rect(9, 3, 3, 3, '#f8f8f8'); p.vline(13, 4, 5, '#68a8e8');
    p.rect(2, 8, 3, 3, '#f8e070'); p.rect(10, 8, 4, 3, '#a8e0a8'); p.vline(6, 9, 10, '#f8f8f8');
    p.rect(2, 13, 5, 2, '#f8f8f8'); p.rect(10, 12, 2, 3, '#e86868');
    p.rect(5, 17, 6, 5, '#f8f8f4'); p.rect(7, 17, 2, 5, '#d83030'); p.rect(5, 18, 6, 2, '#d83030');
    return finish(p);
  }
  // Ruby's window: night outside, the city lit up, the blinds halfway down
  function roomWindow() {
    const W = 44, H = 22, p = new Pix(W, H);
    p.rect(0, 0, W, H, '#f4f0e8');
    p.rect(2, 2, W - 4, H - 4, '#141a34');
    for (const [x, h] of [[3, 6], [8, 9], [13, 5], [17, 9], [23, 7], [28, 8], [33, 5], [37, 9]]) {
      p.rect(x, H - 2 - h, 4, h, '#283052');
      for (let y = H - 1 - h; y < H - 3; y += 2) if (G.hash(x, y, 33) < 0.55) p.set(x + 1 + (y % 4 ? 1 : 0), y, '#f8d878');
    }
    for (let y = 2; y < 9; y++) p.hline(2, W - 3, y, y % 2 ? '#e8e4d8' : '#c8c4b8');
    p.set(26, 4, '#f8f8ff');
    p.vline(W >> 1, 9, H - 3, '#f4f0e8');
    p.hline(1, W - 2, H - 2, '#d8d4c8');
    return finish(p);
  }
  // Ruby's whiteboard: her name and a dinosaur (it had spiral eyes this morning)
  function kidWhiteboard() {
    const W = 32, H = 20, p = new Pix(W, H);
    p.rect(0, 0, W, H, '#b8bcc4'); p.rect(1, 1, W - 2, H - 2, '#fbfbf8');
    const dino = '#3a9a4a';
    for (let x = 19; x <= 26; x++) for (let y = 10; y <= 13; y++) if (!((x === 19 || x === 26) && y === 10)) p.set(x, y, dino);
    for (const [x, y] of [[18, 10], [17, 9], [17, 8], [16, 7], [15, 7], [16, 6], [15, 6], [14, 7], [27, 12], [28, 13], [29, 14], [20, 14], [20, 15], [24, 14], [24, 15]]) p.set(x, y, dino);
    p.set(15, 6, '#1a1a1a');
    for (const [x, y] of [[21, 9], [23, 9], [25, 10]]) p.set(x, y, '#f08a28');
    p.hline(2, W - 3, H - 2, '#c8c8d0'); p.rect(4, H - 3, 3, 1, '#d83030'); p.rect(8, H - 3, 3, 1, '#2a6ad8');
    const cv = finish(p);
    G.font.draw(cv.getContext('2d'), 'RUBY', 3, 3, '#d83878');
    return cv;
  }
  // the TV on the wall, a cartoon on
  function wallTV() {
    const p = new Pix(22, 15);
    p.rect(0, 0, 22, 14, '#1a1a20'); p.rect(1, 1, 20, 11, '#58b8f0'); p.rect(1, 9, 20, 3, '#5ac85a');
    p.rect(5, 4, 4, 5, '#f8e070'); p.set(6, 5, '#1a1a1a'); p.set(8, 5, '#1a1a1a'); p.rect(13, 6, 5, 3, '#f88aa8'); p.set(16, 5, '#f88aa8');
    p.rect(17, 2, 3, 3, '#ffffff');
    p.hline(10, 11, 14, '#3a3a44');
    return finish(p);
  }
  // the hospital bed, in two layers so Ruby sits up in it: the frame and pillow behind her, and
  // the blanket over her legs (her cast propped up on top, her egg carton of rocks in her lap)
  function bedBack() {
    const W = 32, H = 54, p = new Pix(W, H);
    p.rect(2, 0, 28, 8, '#9aa8b8'); p.hline(2, 29, 0, '#c8d0dc'); p.rect(5, 2, 22, 4, '#b8c4d4');
    p.rect(1, 8, 30, 40, '#e8ecf0'); p.vline(1, 8, 47, '#a8b0bc'); p.vline(30, 8, 47, '#a8b0bc');
    p.rect(6, 8, 20, 9, '#ffffff'); p.hline(6, 25, 16, '#d8dce4');
    p.rect(0, 20, 2, 16, '#8a96a8'); p.rect(30, 20, 2, 16, '#8a96a8');
    p.rect(2, 47, 28, 4, '#9aa8b8'); p.hline(2, 29, 47, '#b8c4d4');
    for (const x of [3, 27]) p.rect(x, 51, 2, 3, '#2a2a30');
    return finish(p);
  }
  function bedFront() {
    const W = 32, H = 54, p = new Pix(W, H);
    p.rect(1, 26, 30, 21, '#5a8ad8'); p.hline(1, 30, 26, '#f8f8f8'); p.hline(1, 30, 27, '#8ab0f0');
    for (const [x, y] of [[5, 41], [12, 44], [27, 31], [8, 37], [28, 42]]) { p.set(x, y, '#f8e070'); p.set(x + 1, y, '#f8e070'); }
    // the cast, on a pillow, signed in marker
    p.rect(16, 36, 12, 6, '#ffffff'); p.hline(16, 27, 41, '#d8dce4');
    p.rect(19, 29, 6, 17, '#f4f4f0'); p.vline(24, 29, 45, '#d8d8d0'); p.hline(19, 24, 29, '#ffffff');
    for (const [x, y, c] of [[20, 32, '#d83030'], [21, 32, '#d83030'], [22, 35, '#2a6ad8'], [20, 39, '#3a9a4a'], [21, 40, '#3a9a4a'], [23, 42, '#a838c8']]) p.set(x, y, c);
    p.rect(19, 46, 6, 2, '#c88a60');
    // the egg carton of rocks
    p.rect(3, 29, 13, 7, '#d8ccb0'); p.hline(3, 15, 29, '#ece2c8'); p.hline(3, 15, 35, '#b8ac90');
    const rocks = ['#8a7a6a', '#c84848', '#e8e4d8', '#5a5a64', '#d8b848', '#68a868'];
    for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) { if (i === 5 && j === 1) continue; const c = rocks[(i + j * 3) % 6]; p.set(4 + i * 2, 31 + j * 2, c); p.set(5 + i * 2, 31 + j * 2, shade(c, -0.25)); }
    return finish(p);
  }
  function recliner() {
    const p = new Pix(20, 22);
    p.rect(2, 0, 16, 12, '#4a8a8a'); p.hline(3, 16, 1, '#6aaaa8');
    p.rect(0, 8, 20, 10, '#3a7a7a'); p.rect(3, 10, 14, 6, '#5a9a98'); p.hline(3, 16, 10, '#7ababa');
    p.rect(1, 18, 2, 4, '#3a3a40'); p.rect(17, 18, 2, 4, '#3a3a40');
    return finish(p);
  }
  // get-well balloons tied to the chair: pink, blue, and a red heart
  function getWellBalloons() {
    const p = new Pix(22, 36);
    const ball = (cx, cy, c) => { for (let y = -5; y <= 5; y++) for (let x = -4; x <= 4; x++) if ((x / 4.4) ** 2 + (y / 5.4) ** 2 <= 1) p.set(cx + x, cy + y, c); p.set(cx - 2, cy - 3, '#ffffff'); p.set(cx, cy + 6, c); };
    for (const [x0, y0] of [[5, 12], [11, 9], [17, 13]]) for (let y = y0 + 6; y < 36; y++) p.set(Math.round(x0 + (11 - x0) * (y - y0 - 6) / (35 - y0 - 6)), y, '#d0d0d8');
    ball(5, 12, '#f86888'); ball(17, 13, '#68b8f8');
    const heart = ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'];
    heart.forEach((row, y) => { for (let x = 0; x < row.length; x++) if (row[x] === 'X') p.set(8 + x, 2 + y, '#e83848'); });
    p.set(9, 3, '#ffffff');
    return finish(p);
  }
  // Ruby's nightstand: a stack of rock books and a magnifying glass
  function rockBooksStand() {
    const p = new Pix(16, 24);
    p.rect(1, 10, 14, 14, '#c8b898'); p.hline(1, 14, 10, '#e0d4b8'); p.hline(2, 13, 16, '#a89878'); p.set(8, 13, '#6a5a40'); p.set(8, 19, '#6a5a40');
    p.rect(2, 7, 11, 3, '#2a6ad8'); p.hline(2, 12, 8, '#f8f8f8');
    p.rect(3, 4, 10, 3, '#e8b830'); p.hline(3, 12, 5, '#a87820');
    p.rect(2, 2, 9, 2, '#3a9a4a');
    p.set(12, 3, '#8a6a40'); p.set(13, 2, '#8a6a40'); p.rect(13, 0, 3, 2, '#a8d8f0');
    return finish(p);
  }
  // Ruby's heart rock: a heart-shaped beach pebble with a white quartz band all the way around
  // (a wishing rock)
  function heartRock() {
    const rows = [
      '..XXX...XXX..',
      '.XXXXX.XXXXX.',
      'XXXXXXXXXXXXX',
      'XXXXXXXXXXXXX',
      'XXXXXXXXXXXXX',
      '.XXXXXXXXXXX.',
      '..XXXXXXXXX..',
      '...XXXXXXX...',
      '....XXXXX....',
      '.....XXX.....',
      '......X......',
    ];
    const p = new Pix(15, 13);
    rows.forEach((row, y) => { for (let x = 0; x < row.length; x++) if (row[x] === 'X') p.set(x + 1, y + 1, x + y < 5 ? '#d8c0c4' : x + y > 15 ? '#8a7076' : G.hash(x, y, 71) < 0.18 ? '#b8a0a4' : '#a88a90'); });
    for (let x = 0; x < 15; x++) if (p.get(x, 6)) p.set(x, 6, '#f4ece8');
    p.set(3, 2, '#f0e4e8'); p.set(4, 2, '#f0e4e8');
    p.outline();
    return p.canvas();
  }
  // ---- the roof
  // the helipad: a white ring, a white square, the red cross and the H
  function helipad() {
    const R = 44, W = R * 2, p = new Pix(W, W);
    for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) {
      const d = Math.hypot(x - R + 0.5, y - R + 0.5);
      if (d <= R) p.set(x, y, d > R - 3 ? '#d8d8d0' : d > R - 5 ? '#43474f' : G.hash(x, y, 81) < 0.08 ? '#585c66' : '#4e525c');
    }
    p.rect(R - 22, R - 22, 44, 44, '#d8d8d0');
    p.rect(R - 6, R - 20, 12, 40, '#b82828'); p.rect(R - 20, R - 6, 40, 12, '#b82828');
    p.rect(R - 5, R - 5, 2, 10, '#f0f0e8'); p.rect(R + 3, R - 5, 2, 10, '#f0f0e8'); p.rect(R - 3, R - 1, 6, 2, '#f0f0e8');
    return p.canvas();
  }
  // the little brick penthouse over the elevator, with a steel door and a light over it
  function roofAccess() {
    const W = 48, H = 46, p = new Pix(W, H);
    p.rect(0, 0, W, 14, '#3e424e'); p.hline(0, W - 1, 0, '#5a5e6a'); p.rect(5, 3, 12, 7, '#30343e'); p.hline(5, 16, 3, '#4a4e5a');
    for (let y = 14; y < H; y++) for (let x = 0; x < W; x++) p.set(x, y, (y - 14) % 4 === 3 || (x + ((y - 14) >> 2) * 4) % 8 === 0 ? '#4a3a36' : '#6a4e46');
    p.hline(0, W - 1, 14, '#8a8a90');
    p.rect(17, 22, 14, 24, '#4a525e'); p.rect(18, 23, 12, 23, '#5e6674'); p.rect(21, 26, 6, 5, '#e8d898'); p.vline(28, 34, 36, '#c8c8d0');
    p.rect(21, 17, 6, 3, '#f8f0c0'); p.hline(21, 26, 20, '#8a8a90');
    return finish(p);
  }
  // a rooftop air handler: louvers on the side and a big fan on top (two frames)
  function hvacUnit(frame) {
    const W = 40, H = 30, p = new Pix(W, H);
    p.rect(0, 0, W, 16, '#6e7480'); p.hline(0, W - 1, 0, '#8a909c');
    p.rect(0, 16, W, 14, '#5e6470'); for (let x = 3; x < W - 3; x += 3) p.vline(x, 18, 27, '#4c525e');
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const d = (x - 7.5) ** 2 + (y - 7.5) ** 2; if (d <= 49) p.set(4 + x, y + 1, d > 36 ? '#454b55' : '#22262e'); }
    const a = frame * Math.PI / 3;
    for (let k = 0; k < 3; k++) { const t = a + k * Math.PI * 2 / 3; for (let r = 1; r < 6; r++) p.set(Math.round(11.5 + Math.cos(t) * r), Math.round(8.5 + Math.sin(t) * r), '#7a808c'); }
    for (let y = 3; y < 15; y += 3) p.hline(24, 37, y, '#5e6470');
    return finish(p);
  }
  // the windsock, flapping (two frames)
  function windsock(frame) {
    const p = new Pix(24, 36);
    p.vline(3, 2, 35, '#a8a8b0'); p.vline(4, 2, 35, '#7a7a84'); p.rect(1, 34, 6, 2, '#5a5a64');
    for (let x = 5; x < 22; x++) {
      const t = (x - 5) / 16, half = Math.round(3 - t * 1.6), y0 = 6 + Math.round(t * (frame ? 2 : 4) + Math.sin(x * 0.7 + frame * 2.2) * 0.8);
      for (let y = y0 - half; y <= y0 + half; y++) p.set(x, y, Math.floor((x - 5) / 4) % 2 ? '#e8e8e0' : '#e87028');
    }
    return finish(p);
  }
  function roofVent() {
    const p = new Pix(10, 14);
    p.rect(3, 4, 4, 10, '#7a7e88'); p.vline(3, 4, 13, '#9a9ea8'); p.rect(1, 1, 8, 4, '#7a7e88'); p.hline(1, 8, 1, '#a8acb4'); p.rect(2, 3, 6, 2, '#22262e');
    return finish(p);
  }

  // ---- the hypnotized babies (Father Eggmas got to the whole hospital). Crawling, in a little
  // knit hospital cap, a onesie and a diaper, with spiral eyes; crying (a sound ring); and a
  // baby in a rolling bassinet. Bonking one snaps it out of it: it giggles and dozes off.
  function hypnoBaby(o = {}) {
    const cap = o.cap || '#8ab8e8', skin = o.skin || '#f6d2bc', onesie = o.onesie || '#f4f4f0';
    const make = (frame, cry) => {
      const W = 22, H = 16, p = new Pix(W, H), sd = shade(skin, -0.15);
      // body (crawling, facing right): onesie, diaper, an arm and a knee down
      for (let y = 6; y < 13; y++) for (let x = 2; x < 14; x++) if (((x - 8) / 6) ** 2 + ((y - 9.5) / 3.6) ** 2 <= 1) p.set(x, y, onesie);
      for (let y = 8; y < 13; y++) for (let x = 1; x < 6; x++) if (((x - 3.5) / 2.8) ** 2 + ((y - 10.5) / 2.6) ** 2 <= 1) p.set(x, y, '#f8f8f8');
      const a = frame ? 1 : -1;
      p.rect(11 + a, 11, 2, 4, skin); p.rect(4 - a, 12, 3, 3, sd);
      p.rect(11 + a, 14, 3, 2, skin); p.rect(3 - a, 14, 3, 2, skin);
      // the big head, a knit cap, and spiral eyes
      for (let y = 0; y < 11; y++) for (let x = 11; x < 22; x++) if (((x - 16) / 5.2) ** 2 + ((y - 5.5) / 5) ** 2 <= 1) p.set(x, y, y < 4 ? cap : skin);
      p.hline(12, 20, 3, shade(cap, -0.2)); p.set(16, 0, shade(cap, 0.3)); p.set(15, 0, cap);
      p.set(10, 6, skin); p.set(11, 6, sd);
      for (const [ex, ey] of [[15, 5], [19, 5]]) { p.rect(ex - 1, ey - 1, 3, 3, '#f8f8f8'); p.set(ex, ey, '#8a3ac8'); p.set(ex + 1, ey - 1, '#8a3ac8'); p.set(ex - 1, ey + 1, '#8a3ac8'); }
      if (cry) { p.rect(16, 7, 3, 3, '#5a1a2a'); p.set(14, 7, '#8ac8f8'); p.set(14, 8, '#8ac8f8'); p.set(20, 7, '#8ac8f8'); }
      else { p.rect(16, 8, 3, 2, '#f0a8c8'); p.set(17, 8, '#f8f8f8'); }
      p.set(13, 7, '#f0a8a8'); p.set(21, 7, '#f0a8a8');
      if (o.badge) { p.rect(18, 8, 4, 5, '#f8f8f4'); p.rect(18, 8, 4, 1, '#2a6ad8'); p.vline(17, 4, 8, '#2a6ad8'); }
      p.outline();
      return p.canvas();
    };
    const right = [make(0), make(1)], cry = make(0, true);
    return { right, left: right.map(mirror), cryR: cry, cryL: mirror(cry) };
  }
  // a baby in a rolling hospital bassinet (clear plastic on a cart), spiral eyes peeking over
  function bassinetBaby() {
    const W = 26, H = 26, p = new Pix(W, H);
    p.rect(2, 6, 22, 10, '#cfe6f2'); p.hline(2, 23, 6, '#f4fbff'); p.vline(2, 6, 15, '#f4fbff');
    for (let y = 0; y < 9; y++) for (let x = 7; x < 19; x++) if (((x - 13) / 5.5) ** 2 + ((y - 5) / 4.6) ** 2 <= 1) p.set(x, y, y < 3 ? '#f4a8c8' : '#f6d2bc');
    for (const [ex, ey] of [[11, 5], [15, 5]]) { p.rect(ex - 1, ey - 1, 3, 3, '#f8f8f8'); p.set(ex, ey, '#8a3ac8'); p.set(ex + 1, ey - 1, '#8a3ac8'); p.set(ex - 1, ey + 1, '#8a3ac8'); }
    p.rect(3, 9, 20, 6, '#f8f4ee');
    p.rect(1, 16, 24, 3, '#e8e8ec'); p.vline(5, 19, 23, '#9a9aa2'); p.vline(20, 19, 23, '#9a9aa2'); p.hline(4, 21, 22, '#9a9aa2');
    for (const x of [3, 22]) { p.rect(x - 1, 23, 3, 3, '#2a2a30'); }
    p.outline();
    return p.canvas();
  }
  // a hypnotic spiral (the mech's antenna shoots these)
  function hypnoSpiral(frame) {
    const p = new Pix(12, 12);
    for (let i = 0; i < 40; i++) { const t = i * 0.32 + frame * Math.PI / 2, r = i * 0.14; p.set(Math.round(5.5 + Math.cos(t) * r), Math.round(5.5 + Math.sin(t) * r), i % 6 < 3 ? '#a85ae8' : '#f8f0ff'); }
    p.outline('#4a1a6a');
    return p.canvas();
  }
  // little stars (circling the mech's dome when it's dizzy)
  function tinyStar(c) {
    const p = new Pix(10, 10);
    for (const [x, y] of [[4, 0], [5, 0], [4, 1], [5, 1], [0, 3], [1, 3], [2, 3], [3, 3], [6, 3], [7, 3], [8, 3], [9, 3], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [3, 5], [4, 5], [5, 5], [6, 5], [2, 6], [3, 6], [6, 6], [7, 6], [1, 7], [2, 7], [7, 7], [8, 7], [3, 2], [4, 2], [5, 2], [6, 2], [4, 3], [5, 3]]) p.set(x, y, c);
    p.outline();
    return p.canvas();
  }
  // ---- MECHA-BABY (the NICU boss; the user's idea): a hypnotized baby piloting a mech suit
  // built like a toy. A clear dome for a cockpit (the baby sits in it: knit cap, spiral eyes,
  // pacifier), a pastel blue body with a white chest plate and a little heartbeat screen, a
  // big padded diaper, stubby legs, a giant rattle for one arm and a baby-bottle cannon for
  // the other (it fires pacifiers). The spinning spiral antenna on the dome is drawn in code.
  // Poses (facing right: the rattle is on the right): 'idle' (two leg frames), 'raise' (the
  // rattle overhead), 'smash' (the rattle down on the floor).
  const MECH = { blue: '#8ab8e8', blueL: '#b8d8f8', blueD: '#5a88c0', white: '#f4f4f0', joint: '#3a3a4a', rivet: '#f0c830' };
  function mechBody(pose, leg) {
    const W = 72, H = 64, p = new Pix(W, H), M = MECH;
    // legs and feet (one foot lifted on each walking frame)
    for (const [lx, up] of [[24, leg === 1 ? 2 : 0], [41, leg === 2 ? 2 : 0]]) {
      p.rect(lx, 48 - up, 8, 9, M.blue); p.vline(lx, 48 - up, 56 - up, M.blueL); p.vline(lx + 7, 48 - up, 56 - up, M.blueD);
      p.rect(lx + 1, 51 - up, 6, 2, M.joint);
      p.rect(lx - 3, 57 - up, 14, 6, '#4a4a5a'); p.hline(lx - 3, lx + 10, 57 - up, '#6a6a7a');
    }
    // the torso: a rounded box
    for (let y = 22; y < 50; y++) for (let x = 16; x < 56; x++) {
      const ex = Math.max(0, Math.abs(x - 35.5) - 14), ey = Math.max(0, Math.abs(y - 35.5) - 9);
      if (ex * ex + ey * ey > 36) continue;
      p.set(x, y, x < 20 ? M.blueL : x > 51 ? M.blueD : M.blue);
    }
    // the diaper
    p.rect(19, 44, 34, 7, M.white); p.hline(19, 52, 44, '#ffffff'); p.hline(19, 52, 50, '#c8c8c0');
    p.rect(20, 45, 4, 3, '#f8c8d8'); p.rect(48, 45, 4, 3, '#f8c8d8');
    // the chest plate and its little screen (a green heartbeat)
    p.rect(24, 25, 24, 17, M.white); p.hline(24, 47, 25, '#ffffff');
    p.rect(27, 28, 18, 10, '#1a2a2a');
    [3, 3, 3, 1, 6, 0, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3].forEach((dy, i) => p.set(28 + i, 30 + dy, '#58e878'));
    for (const [x, y] of [[25, 26], [46, 26], [25, 40], [46, 40], [18, 30], [53, 30]]) p.set(x, y, M.rivet);
    // the neck ring the dome sits on
    p.rect(26, 19, 20, 4, M.joint); p.hline(26, 45, 19, '#5a5a6a');
    // the bottle-cannon arm (screen left): a big baby bottle, nipple down
    p.rect(12, 26, 6, 6, M.joint);
    p.rect(3, 26, 11, 20, '#e8f0f8'); p.rect(4, 32, 9, 13, '#f8f8f4'); p.vline(3, 26, 45, '#c8d8e8'); p.vline(13, 26, 45, '#a8b8c8');
    for (const y of [30, 35, 40]) p.hline(10, 13, y, '#8aa8c8');
    p.rect(3, 24, 11, 3, '#f4a8c8'); p.rect(5, 46, 7, 3, '#f4a8c8'); p.rect(6, 49, 5, 4, '#e8c8a0'); p.rect(7, 53, 3, 2, '#d8b088');
    // the rattle arm (screen right)
    p.rect(54, 26, 6, 6, M.joint);
    const rattle = (hx, hy, bx, by) => {
      const n = Math.max(Math.abs(bx - hx), Math.abs(by - hy)) || 1;
      for (let i = 0; i <= n; i++) { const x = Math.round(hx + (bx - hx) * i / n), y = Math.round(hy + (by - hy) * i / n); p.rect(x - 1, y - 1, 3, 3, '#f4a8c8'); }
      for (let y = -7; y <= 7; y++) for (let x = -7; x <= 7; x++) if (x * x + y * y <= 49) p.set(bx + x, by + y, Math.floor((x + 7) / 3) % 2 ? '#f0c830' : '#e85050');
      p.set(bx - 3, by - 4, '#ffffff'); p.set(bx - 2, by - 4, '#ffffff');
      p.rect(hx - 2, hy - 2, 5, 5, M.joint);
    };
    if (pose === 'raise') { p.rect(56, 17, 5, 10, M.blue); rattle(58, 16, 60, 8); }
    else if (pose === 'smash') { p.rect(58, 30, 5, 9, M.blue); rattle(61, 40, 63, 55); }
    else { p.rect(57, 31, 5, 8, M.blue); rattle(60, 40, 63, 26); }
    p.outline();
    return p.canvas();
  }
  // the cockpit dome, with the baby inside: hypnotized, crying, asleep, or empty
  function mechDome(state) {
    const W = 28, H = 24, p = new Pix(W, H), cx = 13.5;
    for (let y = 0; y < 22; y++) for (let x = 0; x < W; x++) if (((x - cx) / 13.5) ** 2 + ((y - 21) / 21) ** 2 <= 1) p.set(x, y, '#d8ecf8');
    if (state !== 'empty') {
      for (let y = 6; y < 21; y++) for (let x = 6; x < 22; x++) if (((x - 13.5) / 7.5) ** 2 + ((y - 14) / 7.5) ** 2 <= 1) p.set(x, y, y < 10 ? '#8ab8e8' : '#f6d2bc');
      p.hline(7, 20, 9, '#6a98c8'); p.set(13, 6, '#b8d8f8'); p.set(14, 6, '#b8d8f8');
      if (state === 'asleep') { p.hline(9, 11, 13, '#5a3a3a'); p.hline(16, 18, 13, '#5a3a3a'); p.rect(12, 17, 4, 2, '#e8a0a0'); }
      else {
        for (const ex of [10, 17]) { p.rect(ex - 1, 12, 3, 3, '#f8f8f8'); p.set(ex, 13, '#8a3ac8'); p.set(ex + 1, 12, '#8a3ac8'); p.set(ex - 1, 14, '#8a3ac8'); }
        if (state === 'cry') { p.rect(12, 16, 4, 3, '#5a1a2a'); p.set(8, 13, '#8ac8f8'); p.set(19, 13, '#8ac8f8'); }
        else { p.rect(11, 16, 6, 3, '#f0a8c8'); p.rect(13, 17, 2, 1, '#f8f8f8'); }
      }
      p.set(8, 16, '#f0a8a8'); p.set(19, 16, '#f0a8a8');
    }
    p.vline(4, 10, 16, '#ffffff'); p.vline(5, 7, 9, '#ffffff');
    p.hline(1, W - 2, 21, '#a8c8d8');
    p.outline('#5a7a90');
    return p.canvas();
  }
  // a pacifier (the bottle cannon fires these)
  function pacifierShot() {
    const p = new Pix(10, 10);
    p.rect(3, 0, 4, 1, '#f8f8f4'); p.rect(3, 1, 4, 2, '#f8f8f4'); p.rect(4, 1, 2, 1, '#d8d8d0');
    p.rect(1, 3, 8, 4, '#f4a8c8'); p.hline(2, 7, 3, '#f8c8e0');
    p.rect(4, 7, 2, 2, '#e8c8a0');
    p.outline();
    return p.canvas();
  }

  // ================================================================ THE FINALE: the Number One Ditch
  // Father Eggmas's throne: egg cartons stacked into a seat and a tall back, a red velvet
  // cushion, tinsel draped over it, ornaments hanging off it, and a gold star on top.
  function eggThrone() {
    const W = 88, H = 92, p = new Pix(W, H), pulp = '#b8b0a0', pulpL = '#d0c8b8', pulpD = '#8a8274';
    const carton = (x0, y0, w, h) => {
      p.rect(x0, y0, w, h, pulp); p.hline(x0, x0 + w - 1, y0, pulpL); p.hline(x0, x0 + w - 1, y0 + h - 1, pulpD); p.vline(x0 + w - 1, y0, y0 + h - 1, pulpD);
      for (let x = x0 + 3; x < x0 + w - 3; x += 6) for (let y = y0 + 3; y < y0 + h - 3; y += 6) { p.rect(x, y, 4, 4, pulpD); p.rect(x, y, 3, 3, pulpL); }
    };
    // the tall back: two cartons standing on end, one across the top
    carton(16, 8, 26, 50); carton(46, 8, 26, 50); carton(12, 2, 64, 9);
    // the seat and the base: cartons stacked flat
    carton(8, 58, 72, 14); carton(2, 70, 84, 22);
    // the red velvet cushion
    p.rect(14, 50, 60, 10, '#9a1828'); p.hline(14, 73, 50, '#c83040'); p.hline(14, 73, 59, '#6a1018');
    for (const x of [24, 44, 64]) p.set(x, 54, '#e8c050');
    // tinsel draped across the back and the base, in silver and gold
    for (let x = 6; x < 82; x++) {
      const y1 = 18 + Math.round(Math.sin(x * 0.18) * 3), y2 = 76 + Math.round(Math.sin(x * 0.15 + 1) * 2);
      p.set(x, y1, x % 3 ? '#e8e8f0' : '#f8f8ff'); p.set(x, y1 + 1, x % 4 ? '#a8a8b8' : '#f8e070');
      p.set(x, y2, x % 3 ? '#f8d850' : '#fff8b0'); p.set(x, y2 + 1, '#c89828');
    }
    // ornaments hanging off it
    for (const [x, y, c] of [[20, 26, '#d83030'], [36, 32, '#2e9a4a'], [52, 26, '#d8b040'], [68, 34, '#3a6ad8'], [8, 82, '#d83030'], [80, 84, '#2e9a4a']]) {
      p.vline(x, y - 4, y - 2, '#c8c8c8');
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (dx * dx + dy * dy <= 5) p.set(x + dx, y + dy, c);
      p.set(x - 1, y - 1, '#ffffff');
    }
    // the gold star on top
    for (const [dx, dy] of [[0, 0], [-1, 1], [0, 1], [1, 1], [-3, 2], [-2, 2], [-1, 2], [0, 2], [1, 2], [2, 2], [3, 2], [-1, 3], [0, 3], [1, 3], [-2, 4], [2, 4]]) p.set(44 + dx, dy, '#f8e070');
    p.outline();
    return p.canvas();
  }
  function bean() {
    const p = new Pix(5, 4);
    p.rect(0, 1, 5, 2, '#8a3a1a'); p.hline(1, 3, 0, '#a85028'); p.hline(1, 3, 3, '#6a2a10'); p.set(1, 1, '#c86a3a');
    return p.canvas();
  }
  // the culvert at the north end of the ditch: a big concrete pipe mouth in the mud bank
  function culvert() {
    const W = 72, H = 44, p = new Pix(W, H);
    p.rect(0, 0, W, H, '#5a4a38');
    for (let i = 0; i < 60; i++) p.set(Math.floor(G.hash(i, 1, 121) * W), Math.floor(G.hash(i, 2, 121) * H), G.hash(i, 3, 121) < 0.5 ? '#4a3c2c' : '#6a5844');
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const d = ((x - 36) / 28) ** 2 + ((y - 26) / 22) ** 2;
      if (d <= 1) p.set(x, y, d > 0.72 ? (y < 20 ? '#b8b4ac' : '#9a968e') : d > 0.62 ? '#7a766e' : '#14141a');
    }
    for (let x = 14; x < 58; x += 5) p.set(x, 6 + Math.round(((x - 36) / 28) ** 2 * 14), '#d8d4cc');
    p.rect(0, 0, W, 3, '#3e7a34'); for (let x = 0; x < W; x += 3) p.set(x, 3, '#2e6a2c');
    return p.canvas();
  }
  // the green road sign at the south end, like the one on the title screen
  function ditchSign() {
    const W = 44, H = 34, p = new Pix(W, H);
    for (const x of [10, 33]) { p.rect(x, 12, 2, 22, '#5a3818'); p.vline(x, 12, 33, '#7a5028'); }
    p.rect(0, 0, W, 15, '#1c1424'); p.rect(1, 1, W - 2, 13, '#2e8a48'); p.hline(2, W - 3, 2, '#e8f0e8');
    const cv = p.canvas();
    G.font.draw(cv.getContext('2d'), 'No.1 DITCH', 22 - Math.round(G.font.width('No.1 DITCH') / 2), 4, '#ffffff');
    return cv;
  }
  function cattails() {
    const p = new Pix(14, 26);
    for (const [x, h] of [[3, 22], [7, 25], [11, 20]]) {
      p.vline(x, 26 - h, 25, '#4a7a34'); p.rect(x - 1, 26 - h + 2, 3, 6, '#6a4220'); p.set(x, 26 - h, '#8aa858');
    }
    for (const [x, y] of [[1, 18], [5, 14], [9, 16], [12, 12]]) { p.set(x, y, '#5a9a44'); p.set(x, y + 1, '#5a9a44'); p.set(x + 1, y + 2, '#4a8a3a'); }
    return finish(p);
  }
  // the golden egg (egg tennis), and the rotten one (don't swing at it)
  function goldenEgg(rotten) {
    const p = new Pix(12, 14), c = rotten ? ['#6a8a3a', '#8aaa4a', '#4a6a2a'] : ['#e8b830', '#f8e070', '#b88820'];
    for (let y = 0; y < 14; y++) for (let x = 0; x < 12; x++) if (((x - 5.5) / 5.5) ** 2 + ((y - 7.5) / 6.6) ** 2 <= 1) p.set(x, y, x + y < 9 ? c[1] : x + y > 15 ? c[2] : c[0]);
    p.set(3, 3, '#ffffff'); p.set(4, 3, '#ffffff'); p.set(3, 4, '#ffffff');
    if (rotten) { p.set(7, 8, '#3a4a1a'); p.set(5, 10, '#3a4a1a'); p.set(8, 5, '#3a4a1a'); }
    p.outline(rotten ? '#2a3a1a' : '#6a4a10');
    return p.canvas();
  }
  // an egglet: a little Father Eggmas, waddling (two frames)
  function egglet(frame) {
    const p = new Pix(14, 18), cream = '#f2ead6', creamD = '#d4c8ac', red = '#7a1e2c';
    for (let y = 0; y < 11; y++) for (let x = 0; x < 14; x++) if (((x - 6.5) / 5.5) ** 2 + ((y - 5.5) / 5.5) ** 2 <= 1) p.set(x, y, x + y > 13 ? creamD : cream);
    p.set(4, 5, '#1e2230'); p.set(9, 5, '#1e2230'); p.set(6, 7, '#b8203a');
    for (const [x, y] of [[3, 8], [5, 9], [7, 10], [9, 9], [10, 8], [6, 11], [8, 11]]) p.set(x, y, '#fbfbf8');
    p.rect(3, 11, 8, 4, red); p.set(5, 12, '#c8984c'); p.set(8, 13, '#3e6a44');
    const a = frame ? 1 : 0;
    p.rect(3 + a, 15, 3, 2, '#1e2230'); p.rect(8 - a, 15, 3, 2, '#1e2230');
    p.set(2, 12, cream); p.set(11, 12, cream);
    p.outline();
    return p.canvas();
  }
  function tossRock() {
    const p = new Pix(12, 10);
    for (let y = 0; y < 10; y++) for (let x = 0; x < 12; x++) if (((x - 5.5) / 5.8) ** 2 + ((y - 5) / 4.6) ** 2 <= 1) p.set(x, y, x + y < 7 ? '#a8a49c' : x + y > 13 ? '#5a5650' : '#7a766e');
    p.set(4, 4, '#c8c4bc'); p.set(8, 6, '#4a4640');
    p.outline();
    return p.canvas();
  }
  function clayPot() {
    const p = new Pix(12, 14);
    p.rect(1, 6, 10, 3, '#c8683a'); p.rect(2, 9, 8, 5, '#b85a2e'); p.hline(1, 10, 6, '#e08858'); p.vline(9, 9, 13, '#8a3e1e');
    p.rect(3, 4, 6, 2, '#4a3020');
    for (const [x, y, c] of [[4, 1, '#e83878'], [7, 0, '#f8d040'], [6, 2, '#58a840'], [3, 3, '#58a840'], [8, 3, '#58a840']]) p.set(x, y, c);
    p.outline();
    return p.canvas();
  }
  function icePack() {
    const p = new Pix(12, 9);
    p.rect(0, 0, 12, 9, '#7ac8f0'); p.rect(1, 1, 10, 7, '#a8e0f8'); p.hline(2, 9, 2, '#e8f8ff'); p.rect(4, 3, 4, 3, '#f8f8f8'); p.set(5, 4, '#d83030'); p.set(6, 4, '#d83030');
    p.outline();
    return p.canvas();
  }
  function bandageRoll() {
    const p = new Pix(10, 10);
    for (let y = 0; y < 10; y++) for (let x = 0; x < 10; x++) { const d = (x - 4.5) ** 2 + (y - 4.5) ** 2; if (d <= 20) p.set(x, y, d < 4 ? '#c8c0b0' : (x + y) % 3 ? '#f8f4ec' : '#e8e0d0'); }
    p.outline();
    return p.canvas();
  }
  // a smoke ring (possessed Dad puffs these out of his pipe)
  function smokeRing() {
    const p = new Pix(12, 10);
    for (let y = 0; y < 10; y++) for (let x = 0; x < 12; x++) { const d = ((x - 5.5) / 5.5) ** 2 + ((y - 4.5) / 4.5) ** 2; if (d <= 1 && d >= 0.35) p.set(x, y, d > 0.75 ? '#a8a8b4' : '#d8d8e0'); }
    return p.canvas();
  }
  // an ornament shard
  function shard(c) {
    const p = new Pix(5, 5);
    p.set(2, 0, c); p.hline(1, 3, 1, c); p.hline(0, 4, 2, c); p.hline(1, 3, 3, '#ffffff'); p.set(2, 4, c);
    return p.canvas();
  }

  // ================================================================ THE BAY: RoFo Pop and the toll plaza
  // RoFo Pop, blue raspberry: what Abe and Hannah grab on the Eastern Shore as a "gift"
  // every time they visit. It does not taste good. A 2-liter: white cap, blue soda, the
  // round green RoFo POP label with a raspberry, and (being an enemy) angry little eyes.
  function twoLiter(W, H, o = {}) {
    const p = new Pix(W, H), blue = '#2a7ae0', blueL = '#78c0ff', blueD = '#1a4ea8', cx = (W - 1) / 2;
    const capW = Math.max(3, Math.round(W * 0.38)), capH = Math.max(2, Math.round(H * 0.09)), neck = Math.round(H * 0.17), base = Math.max(2, Math.round(H * 0.06));
    const c0 = Math.round(cx - capW / 2 + 0.5);
    p.rect(c0, 0, capW, capH, '#f4f4f0'); p.hline(c0, c0 + capW - 1, 0, '#ffffff'); p.hline(c0, c0 + capW - 1, capH - 1, '#c8c8c4');
    for (let y = 0; y < neck; y++) {
      const k = (y + 1) / neck, half = capW / 2 + (W / 2 - capW / 2) * Math.sin(k * Math.PI / 2);
      p.hline(Math.round(cx - half + 0.5), Math.round(cx + half - 0.5), capH + y, blue);
    }
    p.rect(0, capH + neck, W, H - capH - neck - base, blue);
    for (let x = 0; x < W; x++) if (x % Math.max(3, Math.round(W / 5)) !== 0) p.vline(x, H - base, H - 1, blueD);
    // shine down the left side, shadow down the right
    p.vline(Math.max(1, Math.round(W * 0.18)), capH + 2, H - base - 2, blueL);
    p.vline(W - 1, capH + neck, H - base - 1, blueD);
    // the label: a green ring around a white middle, a red raspberry under it
    const ly = Math.round(H * 0.52), lw = Math.round(W * (W >= 30 ? 0.46 : 0.42)), lh = Math.max(3, Math.round(H * (W >= 30 ? 0.16 : 0.13)));
    for (let y = -lh; y <= lh; y++) for (let x = -lw; x <= lw; x++) {
      const e = (x / lw) ** 2 + (y / lh) ** 2;
      if (e <= 1) p.set(Math.round(cx + x), ly + y, e > 0.62 ? '#38a83a' : '#f4f8f0');
    }
    if (W >= 20) { p.rect(Math.round(cx + lw * 0.2), ly + lh + 2, 3, 3, '#d83848'); p.set(Math.round(cx + lw * 0.2) + 1, ly + lh + 1, '#58b040'); }
    else { p.set(Math.round(cx), ly, '#2a5ab8'); p.set(Math.round(cx) + 1, ly + lh, '#d83848'); }
    // angry eyes above the label
    const ey = Math.round(H * 0.34), ex = Math.max(2, Math.round(W * 0.22)), es = W >= 20 ? 2 : 1;
    for (const sx of [-1, 1]) {
      const x0 = Math.round(cx + sx * ex - (es - 1) / 2);
      p.rect(x0, ey, es, es + 1, '#0c0814');
      p.hline(x0 - (sx < 0 ? 1 : 0), x0 + es - (sx < 0 ? 1 : 0), ey - 1 - (sx < 0 ? 0 : 0), '#0c0814');
      p.set(sx < 0 ? x0 - 1 : x0 + es, ey - 2, '#0c0814');
    }
    if (o.flat) { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const c = p.get(x, y); if (c === blue) p.set(x, y, (x + y) % 3 ? '#a8c8e0' : '#c8dcec'); } }
    p.outline();
    const cv = p.canvas();
    if (W >= 30) {
      const x = cv.getContext('2d'), F = G.font;
      F.draw(x, 'RoFo', Math.round(cx - F.width('RoFo') / 2), ly - 8, '#2a5ab8');
      F.draw(x, 'POP', Math.round(cx - F.width('POP') / 2), ly, '#e8c020', { shadow: '#2a5ab8' });
    }
    return cv;
  }
  // The Two-Liter with arms and legs: rubber-hose arms in white cartoon gloves, stubby
  // legs in red sneakers. Poses: stand, walk1/walk2 (a foot up, the arms swinging),
  // raise (both fists overhead, about to slam), slam (fists down on the road), pour
  // (one glove up over the cap, where it holds a little bottle to pour in).
  function twoLiterBrute(pose, flat) {
    const body = twoLiter(34, 64, { flat }), W = 60, H = 84, BX = 13, BY = 8, p = new Pix(W, H);
    const limb = flat ? '#6a7a98' : '#14306a', limbL = flat ? '#8a9ab8' : '#2a4a98';
    const glove = '#f4f4f0', gloveD = '#c8c8c4', shoe = flat ? '#b87880' : '#d83848', shoeL = flat ? '#d0a0a8' : '#f06070';
    // big rubber-hose arms, thicker toward the fist
    const arm = (pts) => {
      const segs = pts.length - 1;
      for (let s = 0; s < segs; s++) {
        const [x0, y0] = pts[s], [x1, y1] = pts[s + 1], n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
        for (let i = 0; i <= n; i++) {
          const k = (s + i / n) / segs, r = k < 0.5 ? 2 : 3, x = Math.round(x0 + (x1 - x0) * i / n), y = Math.round(y0 + (y1 - y0) * i / n);
          p.rect(x - r + 1, y - r + 1, r * 2 - 1, r * 2 - 1, limb);
        }
        for (let i = 0; i <= n; i++) p.set(Math.round(x0 + (x1 - x0) * i / n) - 1, Math.round(y0 + (y1 - y0) * i / n) - 1, limbL);
      }
      const [x, y] = pts[segs];
      p.hline(x - 3, x + 2, y - 4, glove); p.rect(x - 4, y - 3, 8, 6, glove); p.hline(x - 3, x + 2, y + 3, gloveD); p.vline(x + 3, y - 3, y + 2, gloveD);
      p.hline(x - 3, x + 1, y - 3, '#ffffff'); p.set(x - 2, y + 1, gloveD); p.set(x, y + 1, gloveD);
    };
    const leg = (x, up) => {
      const top = BY + 58, foot = BY + 70 - up;
      p.rect(x, top, 8, foot - top, limb); p.vline(x + 1, top, foot - 1, limbL);
      p.rect(x - 2, foot, 12, 4, shoe); p.hline(x - 1, x + 8, foot, shoeL); p.hline(x - 2, x + 9, foot + 4, glove);
    };
    const L = [15, 36], R = [44, 36];
    const hands = {
      stand: [[5, 53], [54, 53]], walk1: [[5, 47], [54, 57]], walk2: [[5, 57], [54, 47]],
      raise: [[8, 6], [51, 6]], slam: [[5, 76], [54, 76]], pour: [[5, 53], null],
    }[pose];
    arm([L, hands[0]]);
    if (hands[1]) arm([R, hands[1]]); else arm([R, [54, 22], [43, 7]]);
    leg(19, pose === 'walk1' ? 3 : 0); leg(33, pose === 'walk2' ? 3 : 0);
    p.outline();
    const cv = p.canvas();
    cv.getContext('2d').drawImage(body, BX, BY);
    return cv;
  }
  // a little bottle on the ground (the "heal": it does not taste good)
  function rofoBottleIcon() {
    const p = new Pix(8, 14);
    p.rect(3, 0, 2, 2, '#f4f4f0'); p.rect(2, 2, 4, 2, '#2a7ae0'); p.rect(1, 4, 6, 9, '#2a7ae0'); p.vline(2, 4, 12, '#78c0ff');
    p.rect(2, 7, 4, 3, '#f4f8f0'); p.set(3, 8, '#38a83a'); p.set(4, 8, '#d83848'); p.hline(1, 6, 13, '#1a4ea8');
    p.outline();
    return p.canvas();
  }
  // a drop of blue fizz
  function fizzDrop() {
    const p = new Pix(5, 5);
    p.rect(1, 1, 3, 3, '#3a8ae8'); p.set(2, 0, '#3a8ae8'); p.set(1, 1, '#a8d8ff');
    p.outline('#1a3a78');
    return p.canvas();
  }
  // the toll plaza at the Eastern Shore end: a canopy over four booths
  function tollPlaza() {
    const W = 160, H = 64, p = new Pix(W, H);
    // canopy roof and its blue fascia
    p.rect(0, 6, W, 12, '#e8e8e4'); p.hline(0, W - 1, 6, '#ffffff'); p.rect(0, 18, W, 8, '#2a4a8a'); p.hline(0, W - 1, 18, '#3a5aa0'); p.hline(0, W - 1, 25, '#1a2a5a');
    // lane signs hanging off the fascia: E-ZPass (purple) and CASH (green)
    for (const [x, col] of [[20, '#5a2a8a'], [68, '#5a2a8a'], [116, '#2e8a3e']]) { p.rect(x, 26, 24, 9, col); p.hline(x, x + 23, 26, shade(col, 0.3)); p.hline(x + 3, x + 20, 30, '#f4f4f0'); }
    // posts and booths (on the islands at 0, 48, 96 and 144)
    for (const bx of [0, 48, 96, 144]) {
      p.rect(bx + 6, 26, 4, 16, '#b8b8c0');
      p.rect(bx + 1, 38, 14, 22, '#f2f2ee'); p.hline(bx + 1, bx + 14, 38, '#ffffff'); p.rect(bx + 1, 38, 14, 3, '#c83838');
      p.rect(bx + 3, 43, 10, 8, '#4a6a88'); p.set(bx + 4, 44, '#a8c8e8'); p.vline(bx + 8, 43, 50, '#f2f2ee');
      p.rect(bx + 1, 58, 14, 2, '#f8d040');
    }
    p.outline();
    const cv = p.canvas(), x = cv.getContext('2d');
    G.font.draw(x, 'TOLL', Math.round((W - G.font.width('TOLL')) / 2), 8, '#2a4a8a');
    return cv;
  }

  // ================================================================ DAD'S PIPES AND TOBACCO TINS (the pipe bench)
  // The pipes Dad made, from his photos and his pipe journal, drawn from a little geometry: a bowl
  // (its shape, the rim, how wide and tall), a shank, a stem (a curve, straight or bent) and maybe
  // a silver band where they meet. The design space is 64x34; pipeArt draws it at any scale (the
  // pipe book, the stain bench, a menu icon), and `parts` says what each pixel is (for the stain).
  const PIPE_GEO = {
    // the one Dad gave Nate (the pipe icon, bigger)
    dad: { bowl: { shape: 'cyl', cx: 50, top: 10, w: 15, h: 16, rb: 5 }, shank: [44, 20, 33, 20, 7, 6.5], stem: [[33, 20], [20, 20], [7, 17.5]], st: [5.5, 4], grain: 'straight', wood: '#9a5530' },
    // P12: a block with "many many flaws," made small, sandblasted for practice, dyed black
    black: { bowl: { shape: 'cyl', cx: 50, top: 8, wTop: 15, wBot: 14, h: 18, rb: 5 }, shank: [44, 20, 23, 20.5, 7.5, 6.5], stem: [[23, 20.5], [14, 20.5], [5, 21]], st: [5.5, 3.5], blastShank: true, grain: 'blast', wood: '#2e2a2e' },
    // P3 / P13: his first sandblast, a Dublin, in Cordovan leather dye (the shank left smooth)
    cordovan: { bowl: { shape: 'cyl', cx: 49, top: 6, wTop: 18, wBot: 13, h: 21, rb: 6 }, shank: [43, 21, 29, 19.5, 7.5, 6.5], stem: [[29, 19.5], [16, 18.5], [4, 13]], st: [5.5, 3.5], grain: 'blast', wood: '#3e1e1c', shankWood: '#6a2820' },
    // P14: a squashed tomato with a silver band
    silver: { bowl: { shape: 'squash', cx: 50, top: 11, w: 19, h: 14 }, shank: [42, 19.5, 36, 19.5, 7, 7], band: 2.5, stem: [[36, 19.5], [22, 19.5], [8, 19.5]], st: [6, 4.5], grain: 'birdseye', wood: '#a8442a' },
    // P15: the long-stem prince (a practice tomato that "turned out GREAT")
    prince: { bowl: { shape: 'squash', cx: 53, top: 10, w: 19, h: 15 }, shank: [45, 19, 40, 19, 6.5, 6], stem: [[40, 19], [21, 19], [3, 19]], st: [5, 3], grain: 'straight', wood: '#b04c2c' },
    // P16 / P8: a king-sized bent billiard in British tan
    tan: { bowl: { shape: 'ball', cx: 48, top: 9, w: 19, h: 18 }, shank: [41, 21, 31, 16, 8, 6.5], stem: [[31, 16], [17, 10], [4, 9.5]], st: [6, 3.5], grain: 'straight', wood: '#c06428' },
    // P17: a copy of a Castello (long shank, short stem, like his Caminetto)
    castello: { bowl: { shape: 'cyl', cx: 52, top: 8, w: 15, h: 18, rb: 6 }, shank: [46, 20, 22, 20, 7.5, 7], stem: [[22, 20], [16, 20], [10, 20]], st: [6, 4.5], grain: 'straight', wood: '#c4703a' },
    // 18P: the Strawberry Briar (no stain, just Danish oil, sanded to 1500)
    strawberry: { bowl: { shape: 'cyl', cx: 49, top: 7, wTop: 17, wBot: 15, h: 19, rb: 7.5 }, shank: [42, 20.5, 33, 17, 8, 6.5], stem: [[33, 17], [18, 12], [5, 6.5]], st: [6, 3.5], grain: 'strawberry', wood: '#d8945a' },
    // P4 / P7: Abe's "Minecraft pipe": eight panels, bevels on the bottom (not the top), a square shank
    minecraft: { bowl: { shape: 'oct', cx: 50, top: 9, w: 16, h: 17, rb: 4 }, shank: [44, 20, 26, 20, 7, 7], square: true, stem: [[26, 20], [17, 20], [8, 20]], st: [5, 3], grain: 'panels', wood: '#7a4426' },
  };
  // the bowl's half-width at height Y (or -1 outside it)
  function bowlHW(b, Y) {
    const k = (Y - b.top) / b.h;
    if (k < 0 || k > 1) return -1;
    if (b.shape === 'ball' || b.shape === 'squash') {
      // a sphere (or a squashed one) with the top sliced off for the rim
      const cy = b.top + b.h * (b.shape === 'ball' ? 0.4 : 0.3), ry = b.top + b.h - cy, d = (Y - cy) / (Y < cy ? ry * 1.25 : ry);
      return (b.w / 2) * Math.sqrt(Math.max(0, 1 - d * d));
    }
    const wt = b.wTop || b.w, wb = b.wBot || b.w, hw = (wt + (wb - wt) * k) / 2, rb = Math.min(b.rb || 4, hw), dy = Y - (b.top + b.h - rb);
    if (dy <= 0) return hw;
    return b.shape === 'oct' ? hw - dy : hw - rb + Math.sqrt(Math.max(0, rb * rb - dy * dy));
  }
  // where a point sits on a thick line: { d: across (-1 top .. 1 bottom), t: along } or null
  function onThick(X, Y, ax, ay, bx, by, th0, th1) {
    const dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy, t = Math.max(0, Math.min(1, ((X - ax) * dx + (Y - ay) * dy) / len2));
    const len = Math.sqrt(len2), nx = -dy / len, ny = dx / len, across = (X - ax) * nx + (Y - ay) * ny;
    const along = ((X - ax) * dx + (Y - ay) * dy) / len2;
    if (along < -0.02 || along > 1.02) return null;
    const half = (th0 + (th1 - th0) * t) / 2;
    return Math.abs(across) <= half ? { d: (-across / half) * (dx < 0 ? 1 : -1), t } : null;
  }
  const pipeCache = {};
  function pipeArt(id, scale = 1, opts = {}) {
    const key = [id, scale, opts.wood, opts.shankWood, opts.parts].join('|');
    if (pipeCache[key]) return pipeCache[key];
    const g = PIPE_GEO[id], b = g.bowl, W = Math.ceil(64 * scale), H = Math.ceil(34 * scale), p = new Pix(W, H), parts = new Uint8Array(W * H);
    const wood = opts.wood || g.wood, shankWood = opts.shankWood || (opts.wood ? opts.wood : g.shankWood || g.wood);
    const thin = (th) => Math.max(th, 1.6 / scale), fine = scale >= 0.6;
    // the stem's curve, as short straight pieces
    const [s0, s1, s2] = g.stem, pts = [];
    for (let i = 0; i <= 16; i++) { const t = i / 16, u = 1 - t; pts.push([u * u * s0[0] + 2 * u * t * s1[0] + t * t * s2[0], u * u * s0[1] + 2 * u * t * s1[1] + t * t * s2[1]]); }
    let stemLen = 0;
    for (let i = 1; i < pts.length; i++) stemLen += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    const hwTop = bowlHW(b, b.top + 0.01), capRy = Math.max(1.4, hwTop * 0.24);
    const [x0, y0, x1, y1, th0, th1] = g.shank;
    for (let py = 0; py < H; py++) for (let px = 0; px < W; px++) {
      const X = (px + 0.5) / scale, Y = (py + 0.5) / scale;
      let c = null, part = 0;
      // the bowl, with its rim seen from a little above (and the dark chamber inside)
      const hw = bowlHW(b, Y), inCap = Y < b.top && ((X - b.cx) / hwTop) ** 2 + ((Y - b.top) / capRy) ** 2 <= 1;
      if ((hw >= 0 && Math.abs(X - b.cx) <= hw) || inCap) {
        if (((X - b.cx) / (hwTop * 0.68)) ** 2 + ((Y - b.top) / (capRy * 0.62)) ** 2 <= 1) { c = '#1c120e'; part = 5; } else {
          const u = inCap ? 0 : (X - b.cx) / Math.max(0.5, hw), k = (Y - b.top) / b.h;
          let s = inCap ? 0.14 : -0.3 * u + (u > -0.62 && u < -0.38 ? 0.1 : 0) - (k > 0.8 ? (k - 0.8) * 0.6 : 0);
          let col = wood;
          if (g.grain === 'panels' && !inCap) {
            // eight flat panels: three of them face us
            s = u < -0.36 ? 0.12 : u > 0.36 ? -0.16 : 0;
            if (Math.abs(Math.abs(u) - 0.36) < 0.5 / (hw * scale) + 0.04) s = -0.24;
          }
          if (fine) {
            if (g.grain === 'blast') s += (G.hash(px, py, 3) - 0.5) * 0.3 + (Math.sin((Y + Math.sin(X * 0.7) * 1.5) * 2.2) > 0.55 ? 0.1 : 0);
            else if (g.grain === 'straight' && (px + Math.round(Math.sin(py * 0.3) * 1.5)) % 3 === 0) s -= 0.07;
            else if ((g.grain === 'birdseye' || g.grain === 'panels') && G.hash(px, py, 5) < 0.05) s -= 0.2;
            else if (g.grain === 'strawberry') {
              if (G.hash(px, py, 6) < 0.07) col = shade('#a8403a', (G.hash(px, py, 8) - 0.5) * 0.2);
              else if ((px + Math.round(Math.sin(py * 0.3) * 1.5)) % 4 === 0) s -= 0.05;
            }
          }
          c = shade(col, s); part = 1;
        }
      } else {
        // the shank (sandblasted too on the black one), then the band and the stem
        const sh = onThick(X, Y, x0, y0, x1, y1, th0, th1);
        if (sh) {
          let s = g.square ? (sh.d < -0.3 ? 0.12 : sh.d > 0.35 ? -0.18 : 0) : -0.22 * sh.d;
          if (fine && g.blastShank) s += (G.hash(px, py, 3) - 0.5) * 0.3;
          else if (fine && py % 3 === 0 && g.grain !== 'blast') s -= 0.05;
          c = shade(shankWood, s); part = 2;
        } else {
          let acc = 0;
          for (let i = 1; i < pts.length && !c; i++) {
            const a = pts[i - 1], q = pts[i], seg = Math.hypot(q[0] - a[0], q[1] - a[1]);
            const t0 = acc / stemLen, t1 = (acc + seg) / stemLen;
            acc += seg;
            const th = (t) => thin(g.st[0] + (g.st[1] - g.st[0]) * t) * (t > 0.93 ? 1.25 : 1);
            const hit = onThick(X, Y, a[0], a[1], q[0], q[1], th(t0), th(t1));
            if (!hit) continue;
            const along = (t0 + (t1 - t0) * hit.t) * stemLen;
            if (g.band && along < g.band) { c = hit.d < -0.3 ? '#ffffff' : hit.d > 0.4 ? '#8a8e98' : '#d8dce4'; part = 3; }
            else { c = hit.d < -0.35 ? '#4a4a56' : hit.d > 0.5 ? '#101014' : '#1c1c22'; part = 4; }
          }
        }
      }
      if (c) { p.set(px, py, c); parts[py * W + px] = part; }
    }
    p.outline();
    const cv = p.canvas();
    cv.parts = parts;
    return (pipeCache[key] = cv);
  }
  // how wide the bowl is at k (0 at the rim, 1 at the heel), as a share of its widest
  function pipeProfile(id, k) {
    const b = PIPE_GEO[id].bowl;
    let max = 0;
    for (let i = 0; i <= 40; i++) max = Math.max(max, bowlHW(b, b.top + (b.h * i) / 40));
    return Math.max(0, bowlHW(b, b.top + Math.min(0.999, Math.max(0.001, k)) * b.h)) / max;
  }

  // ---- the tobacco tins from Dad's pipe journal (from photos of the real tins; nobody seems to
  // have photographed a tin of Craven's Claw, so that label is a guess)
  function ell(p, cx, cy, rx, ry, c, lower) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
      if (lower && y + 0.5 < cy) continue;
      if (((x + 0.5 - cx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2 <= 1) p.set(x, y, c);
    }
  }
  // a line of tiny "writing" (too small to read, the way a label looks from across the room)
  function squig(p, x0, x1, y, c) { for (let x = x0; x <= x1; x++) if ((x - x0) % 5 !== 4) p.set(x, y - ((x * 7) % 3 === 0 ? 1 : 0), c); }
  // a round tin seen from a little above: its side, then the lid (rim and face). label() draws on
  // the face, which is centered at (16, 9.5) and about 25x14.
  function roundTin(side, rim, face, label) {
    const p = new Pix(32, 25);
    ell(p, 16, 14.5, 14.5, 8.5, shade(side, -0.25), true);
    p.rect(2, 9, 28, 6, side);
    p.rect(4, 11, 2, 7, shade(side, 0.25));
    ell(p, 16, 9.5, 14.5, 8.5, rim);
    ell(p, 16, 9.5, 12.8, 7.3, face);
    const inFace = (x, y) => ((x + 0.5 - 16) / 12.8) ** 2 + ((y + 0.5 - 9.5) / 7.3) ** 2 <= 1;
    label(p, inFace);
    return finish(p);
  }
  function tinArt(id) {
    const gold = '#e0b848', ink = '#18141a';
    switch (id) {
      case 'orlik': return roundTin('#b01c24', gold, '#d42830', (p, inFace) => {
        // gold bands across the lid, the black oval with "Orlik" in white, the little old man on top
        for (let x = 3; x < 29; x++) for (const y of [6, 13]) if (inFace(x, y)) p.set(x, y, '#e8c050');
        ell(p, 16, 9.5, 6.5, 2.8, ink); ell(p, 16, 9.5, 5.5, 2, '#2a2228');
        squig(p, 12, 20, 10, '#f8f8f0');
        p.rect(15, 2, 2, 3, '#f4ece0'); p.set(15, 2, '#e8b8a0'); p.set(16, 5, '#f4ece0');
        squig(p, 11, 21, 15, '#f8d040');
      });
      case 'capstan': {
        // square, gold-edged, sky blue, with a navy banner and the little tower on top
        const p = new Pix(32, 25);
        p.rect(3, 17, 26, 5, '#b89038'); p.rect(4, 18, 2, 4, '#e0c060');
        p.rect(2, 2, 28, 16, gold); p.rect(3, 1, 26, 18, gold);
        p.rect(4, 3, 24, 13, '#a8d8e8'); p.hline(4, 27, 3, '#c8ecf4');
        p.rect(6, 8, 20, 4, '#1a2a5a'); squig(p, 9, 22, 10, '#f8f8f0');
        p.rect(15, 4, 2, 4, '#1a2a5a'); p.set(15, 3, '#1a2a5a'); p.set(16, 3, '#1a2a5a'); p.hline(14, 17, 7, '#1a2a5a');
        squig(p, 11, 20, 14, '#3a4a7a');
        return finish(p);
      }
      case 'oldGowrie': {
        // a tall yellow can (100g) with a silver lid: the R monogram, the name, an etched scene
        const p = new Pix(32, 25);
        ell(p, 15.5, 22, 8.5, 2.5, '#b08810', true);
        p.rect(7, 4, 17, 19, '#f0c020');
        p.rect(8, 4, 2, 19, '#f8e070'); p.rect(21, 4, 3, 19, '#c89a10');
        ell(p, 15.5, 4, 8.5, 2.6, '#9aa0a8'); ell(p, 15.5, 3.6, 7.5, 1.9, '#d0d4dc');
        ell(p, 15.5, 8.5, 2.2, 2.2, '#6a4a14'); ell(p, 15.5, 8.5, 1.3, 1.3, '#f0c020'); p.set(15, 8, '#6a4a14');
        squig(p, 10, 21, 12, '#5a3a10'); squig(p, 11, 20, 14, '#5a3a10');
        for (let x = 9; x < 22; x++) { p.set(x, 18 + Math.round(Math.sin(x * 0.9)), '#7a5a20'); if (x % 3 === 0) p.set(x, 20, '#7a5a20'); }
        return finish(p);
      }
      case 'margate': return roundTin('#b89038', gold, '#f2e8cc', (p) => {
        // cream lid, a ring of small green writing, "Margate" in big red script
        for (let a = 0; a < 40; a++) if (a % 2) { const t = (a / 40) * Math.PI * 2; p.set(16 + Math.cos(t) * 10.8, 9.5 + Math.sin(t) * 5.8, '#3a7a3a'); }
        squig(p, 10, 22, 9, '#a01c28'); squig(p, 10, 22, 10, '#a01c28');
        squig(p, 12, 20, 12, '#b83038');
      });
      case 'scottishCake': return roundTin('#c85a1c', gold, '#ec7a2c', (p, inFace) => {
        // orange lid, black hills (and a hunter with his dog), a cream label on top
        for (let x = 3; x < 29; x++) for (let y = 10; y < 17; y++) if (inFace(x, y) && y > 11 + Math.sin(x * 0.55) * 1.4) p.set(x, y, '#1a1210');
        p.vline(21, 8, 11, '#1a1210'); p.set(20, 9, '#1a1210'); p.set(22, 9, '#1a1210'); p.hline(23, 24, 11, '#1a1210'); p.set(24, 10, '#1a1210');
        ell(p, 16, 5.5, 6.5, 2.4, '#f4ecd4'); squig(p, 12, 20, 5, '#b02020'); p.hline(13, 19, 7, '#3a3030');
      });
      case 'royalJersey': return roundTin('#3e1a66', gold, '#5a2a8c', (p) => {
        // purple lid, a gold mace across it, "Royal Jersey" in gold
        for (let i = 0; i <= 14; i++) p.set(9 + i, 14 - Math.round(i * 0.62), '#e8c050');
        p.rect(23, 4, 2, 2, '#f8e070'); p.set(22, 6, '#e8c050');
        squig(p, 6, 12, 6, '#e8c050'); squig(p, 17, 25, 12, '#e8c050');
      });
      case 'lane1q': return roundTin('#9aa0aa', '#c8ccd4', '#2848a8', (p) => {
        // blue lid, a ring of gold lettering, the red-and-white crest in the middle
        for (let a = 0; a < 44; a++) if (a % 3) { const t = (a / 44) * Math.PI * 2; p.set(16 + Math.cos(t) * 10.6, 9.5 + Math.sin(t) * 5.6, '#e8c050'); }
        p.rect(14, 6, 5, 5, '#c82838'); p.hline(15, 17, 11, '#c82838'); p.set(16, 12, '#c82838');
        p.set(14, 9, '#f8f8f0'); p.set(15, 8, '#f8f8f0'); p.set(16, 7, '#f8f8f0'); p.set(17, 8, '#f8f8f0'); p.set(18, 9, '#f8f8f0');
        p.hline(14, 18, 4, '#e8c050'); p.set(14, 3, '#e8c050'); p.set(16, 3, '#e8c050'); p.set(18, 3, '#e8c050');
      });
      case 'borkum': {
        // a pouch: red on top (white lettering, a black sailing ship), white below ("Cherry Cavendish")
        const p = new Pix(32, 25);
        for (let x = 8; x <= 23; x++) p.set(x, 1 + (x % 2), '#c8c8d0');
        p.rect(8, 3, 16, 12, '#b81c26'); p.vline(23, 3, 14, '#8a141c');
        squig(p, 10, 21, 5, '#f8f8f0'); squig(p, 11, 20, 7, '#f8f8f0');
        p.hline(11, 20, 13, ink); p.hline(12, 19, 14, ink); p.vline(14, 9, 12, ink); p.vline(17, 10, 12, ink); p.hline(13, 15, 10, ink); p.hline(16, 18, 11, ink);
        p.hline(8, 23, 15, '#e8c050');
        p.rect(8, 16, 16, 8, '#f4f0ea'); p.vline(23, 16, 23, '#c8c4bc');
        squig(p, 10, 21, 19, '#b81c26'); squig(p, 12, 19, 21, '#d84050');
        return finish(p);
      }
      case 'maidenLane': {
        // bulk, from the shop in Manhattan: a Mason jar of it, with their crossed-pipes label
        const p = new Pix(32, 25);
        p.rect(8, 7, 16, 17, '#c8d8e0'); p.rect(7, 9, 18, 13, '#c8d8e0');
        for (let y = 10; y < 23; y++) for (let x = 8; x < 24; x++) p.set(x, y, ['#8a5a2a', '#6a4020', '#a87038'][Math.floor(G.hash(x, y, 4) * 3)]);
        p.vline(9, 9, 21, '#e8f0f4');
        p.rect(9, 2, 14, 5, '#b8bcc4'); p.hline(9, 22, 2, '#d8dce4'); p.hline(9, 22, 4, '#9aa0a8');
        ell(p, 16, 15.5, 4.8, 4.8, gold); ell(p, 16, 15.5, 3.8, 3.8, '#f0d070');
        for (let i = 0; i < 6; i++) { p.set(13 + i, 13 + i, ink); p.set(18 - i, 13 + i, ink); }
        p.rect(12, 12, 2, 2, ink); p.rect(18, 12, 2, 2, ink);
        return finish(p);
      }
      case 'cravensClaw': return roundTin('#1c3a2a', gold, '#24503a', (p) => {
        // dark green lid, a cream medallion with a black claw, the name in gold
        ell(p, 16, 8.5, 5.5, 3.8, '#f0e6c8');
        for (const dx of [-2, 0, 2]) { p.vline(16 + dx, 6, 9, ink); p.set(16 + dx + (dx < 0 ? -1 : dx > 0 ? 1 : 0), 5, ink); }
        p.hline(14, 18, 10, ink);
        squig(p, 9, 23, 14, '#e8c050');
      });
    }
    return null;
  }
  // Dad's pipe book (his real journal: a blue textured notebook, a little gold emblem, a black ribbon)
  // the Micro Mayhem title belt: a black strap and a big gold plate with a red stone
  function beltIcon() {
    const p = new Pix(16, 10);
    p.rect(0, 3, 16, 4, '#1c1c24'); p.hline(0, 15, 3, '#3a3a44');
    p.rect(4, 1, 8, 8, '#e8b830'); p.hline(4, 11, 1, '#f8e070'); p.vline(4, 1, 8, '#f8e070'); p.hline(5, 11, 8, '#a87a18'); p.vline(11, 2, 8, '#a87a18');
    p.rect(6, 3, 4, 4, '#c8901c'); p.rect(7, 4, 2, 2, '#d83038'); p.set(7, 4, '#f87878');
    p.rect(1, 4, 2, 2, '#c8a030'); p.rect(13, 4, 2, 2, '#c8a030');
    p.outline();
    return p.canvas();
  }
  function pipeBookIcon() {
    const p = new Pix(14, 16);
    p.rect(2, 0, 11, 15, '#2a4a8a');
    for (let y = 1; y < 15; y++) for (let x = 3; x < 13; x++) if ((x + y) % 3 === 0) p.set(x, y, '#3a5aa8');
    p.vline(2, 0, 14, '#1a2a5a'); p.hline(3, 12, 0, '#4a6ab8');
    p.rect(7, 6, 2, 2, '#e0b848'); p.set(7, 6, '#f8e070');
    p.vline(10, 14, 15, '#1a1a1a'); p.set(11, 15, '#1a1a1a');
    return finish(p);
  }
  // Abe's Jazzmaster (from the user's photo): a sparkly plum offset body, a tortoiseshell pickguard,
  // two cream soapbar pickups, the chrome bridge and tremolo (and its arm), a rosewood board with
  // pearl dots on an aged maple neck, and the headstock with its gold logo and six tuners down one side
  function jazzmaster() {
    const W = 24, H = 74, p = new Pix(W, H);
    // the headstock
    for (let y = 0; y < 13; y++) {
      const x0 = 9 + Math.round(y * 0.18), x1 = y < 2 ? 14 + y : 15;
      p.hline(x0, x1, y, y < 1 ? '#c89048' : '#d8a058');
      p.set(x1, y, '#b07838');
    }
    for (const y of [2, 4, 6, 8, 10, 12]) { p.set(7 + Math.round(y * 0.18), y, '#c8ccd4'); p.set(8 + Math.round(y * 0.18), y, '#8a8e98'); }
    p.vline(13, 3, 6, '#e8c050'); p.set(12, 4, '#e8c050'); p.set(14, 6, '#e8c050');
    // the neck: maple, with a rosewood board, frets and pearl dots
    for (let y = 13; y < 50; y++) { p.hline(10, 14, y, '#d8a058'); p.hline(11, 13, y, '#3a2214'); }
    let fy = 15;
    for (let k = 1; fy < 48; k++) {
      p.hline(11, 13, fy, '#c8ccd4');
      if ([3, 5, 7, 9].includes(k)) p.set(12, fy + 1, '#f0e8d8');
      if (k === 12) { p.set(11, fy - 1, '#f0e8d8'); p.set(13, fy - 1, '#f0e8d8'); }
      fy += Math.max(2, Math.round(4 - k * 0.2));
    }
    // the body: an offset outline (the waist is crooked on purpose), plum with a little sparkle
    const L = [[42, 6], [44, 3], [49, 3], [54, 5], [58, 3], [62, 2], [68, 2], [71, 4], [73, 8]];
    const R = [[44, 18], [47, 21], [52, 20], [56, 19], [61, 22], [68, 22], [71, 20], [73, 16]];
    const edge = (pts, y) => { if (y <= pts[0][0]) return pts[0][1]; for (let k = 1; k < pts.length; k++) if (y <= pts[k][0]) { const [y0, x0] = pts[k - 1], [y1, x1] = pts[k]; return x0 + ((x1 - x0) * (y - y0)) / (y1 - y0); } return pts[pts.length - 1][1]; };
    for (let y = 42; y < H; y++) {
      const x0 = Math.round(edge(L, y)), x1 = Math.round(y < 44 ? 15 : edge(R, y));
      for (let x = x0; x <= x1; x++) {
        const rim = x === x0 || x === x1 || y === H - 1;
        p.set(x, y, rim ? '#5a1a40' : G.hash(x, y, 13) < 0.1 ? '#c868a8' : x < x0 + 2 ? '#a8447e' : '#8a2e62');
      }
    }
    // the tortoiseshell pickguard, around the neck and both pickups
    for (let y = 44; y < 65; y++) {
      const x0 = Math.round(edge(L, y)) + 2, x1 = Math.round(edge(R, y)) - 2;
      for (let x = x0; x <= x1; x++) {
        if (y > 59 && x < 9 + (y - 59)) continue;
        const h = G.hash(x, y, 17);
        p.set(x, y, h < 0.25 ? '#c06a28' : h < 0.4 ? '#3a1a08' : '#7a3a14');
      }
    }
    // the neck runs onto the body, then the strings to the bridge
    for (let y = 42; y < 47; y++) { p.hline(10, 14, y, '#d8a058'); p.hline(11, 13, y, '#3a2214'); }
    for (let y = 47; y < 62; y++) if (y % 2) { p.set(11, y, '#d8d8e0'); p.set(13, y, '#d8d8e0'); }
    // the two soapbar pickups
    for (const py of [49, 56]) { p.rect(8, py, 8, 3, '#efe6c8'); p.hline(8, 15, py + 2, '#c8bea0'); for (let k = 0; k < 6; k++) p.set(9 + k, py + 1, '#b8b0a0'); }
    // the bridge, the tremolo plate and its arm, and the knobs
    p.hline(9, 15, 62, '#c8ccd4'); p.hline(9, 15, 63, '#8a8e98');
    p.rect(9, 65, 7, 5, '#b8bcc4'); p.hline(9, 15, 65, '#e8ecf0'); p.set(12, 67, '#8a8e98');
    for (let k = 0; k < 5; k++) p.set(16 + k, 65 - k, '#c8ccd4');
    p.set(18, 59, '#efe6c8'); p.set(19, 62, '#efe6c8'); p.set(6, 46, '#efe6c8');
    return finish(p);
  }
  // Abe's 1984 Stratocaster (from the user's photo): black, a white pickguard and three white
  // single-coils, white knobs, a maple neck with black dots, and the small vintage headstock
  function stratocaster() {
    const W = 24, H = 74, p = new Pix(W, H), MAP = '#e8b058', MAPD = '#c08838', DOT = '#2a2018';
    const edge = (pts, y) => { if (y <= pts[0][0]) return pts[0][1]; for (let k = 1; k < pts.length; k++) if (y <= pts[k][0]) { const [y0, x0] = pts[k - 1], [y1, x1] = pts[k]; return x0 + ((x1 - x0) * (y - y0)) / (y1 - y0); } return pts[pts.length - 1][1]; };
    // the headstock: tuners down the left, the curvy end bulging right
    for (let y = 0; y < 14; y++) {
      const x0 = 9 + Math.round(y * 0.1), x1 = y < 1 ? 13 : y < 2 ? 15 : y < 6 ? 16 : y < 9 ? 15 : 14;
      p.hline(x0, x1, y, MAP); p.set(x1, y, MAPD);
    }
    for (const y of [1, 3, 5, 7, 9, 11]) { p.set(7 + Math.round(y * 0.1), y, '#c8ccd4'); p.set(8 + Math.round(y * 0.1), y, '#8a8e98'); }
    p.set(13, 4, '#8a6030'); p.set(13, 5, '#8a6030'); p.set(14, 6, '#8a6030');
    // the maple neck: frets and black dots
    for (let y = 14; y < 52; y++) { p.hline(10, 14, y, MAP); p.set(14, y, MAPD); }
    let fy = 16;
    for (let k = 1; fy < 50; k++) {
      p.hline(10, 14, fy, '#c8ccd4');
      if ([3, 5, 7, 9].includes(k)) p.set(12, fy + 1, DOT);
      if (k === 12) { p.set(11, fy - 1, DOT); p.set(13, fy - 1, DOT); }
      fy += Math.max(2, Math.round(4 - k * 0.2));
    }
    // the body: the bass-side horn reaches higher than the treble side's, a waist, a round bottom
    const L = [[41, 3], [42, 2], [44, 1], [47, 1], [50, 2], [53, 3], [56, 3], [59, 2], [62, 1], [66, 1], [69, 2], [71, 4], [73, 7]];
    const R = [[45, 19], [46, 21], [48, 22], [50, 22], [53, 21], [56, 21], [59, 22], [62, 23], [66, 23], [69, 22], [71, 20], [73, 16]];
    const LIN = [[41, 5], [43, 6], [45, 7], [47, 8], [49, 9]], RIN = [[45, 18], [47, 17], [49, 16]];
    const inBody = (x, y) => {
      if (y < 41 || y >= H) return false;
      const x0 = Math.round(edge(L, y)), x1 = Math.round(edge(R, y));
      if (x < x0 || x > x1 || (y < 45 && x > Math.round(edge(LIN, y)))) return false;
      return y >= 50 || x <= Math.round(edge(LIN, y)) || x >= Math.round(edge(RIN, y));
    };
    for (let y = 41; y < H; y++) for (let x = 0; x < W; x++) {
      if (!inBody(x, y)) continue;
      const rim = !inBody(x - 1, y) || !inBody(x + 1, y) || !inBody(x, y + 1) || !inBody(x, y - 1);
      p.set(x, y, rim ? '#0c0c10' : x < edge(L, y) + 2 ? '#4a4a56' : '#1a1a20');
    }
    // the white pickguard: from the neck down the middle to the knobs, black all around it
    const GL = [[47, 9], [49, 7], [51, 5], [54, 4], [57, 4], [60, 5], [63, 7], [66, 9], [69, 12]];
    const GR = [[47, 15], [49, 18], [51, 20], [54, 20], [57, 20], [60, 21], [63, 21], [66, 20], [69, 19], [70, 17]];
    for (let y = 47; y < 71; y++) {
      const x0 = Math.round(edge(GL, y)), x1 = Math.round(edge(GR, y));
      for (let x = x0; x <= x1; x++) if (inBody(x, y)) p.set(x, y, x === x0 || x === x1 || y === 70 ? '#c8c8c0' : '#f2f2ec');
    }
    for (let y = 47; y < 52; y++) { p.hline(10, 14, y, MAP); p.set(14, y, MAPD); }
    // strings, three single-coils, the bridge, knobs, the switch and the jack
    for (let y = 52; y < 64; y++) if (y % 2) { p.set(11, y, '#a8acb4'); p.set(13, y, '#a8acb4'); }
    for (const py of [52, 56, 60]) { p.rect(8, py, 9, 3, '#a8a8a0'); p.rect(9, py + 1, 7, 1, '#fafaf4'); for (let k = 0; k < 3; k++) p.set(10 + k * 2, py + 1, '#7a7a74'); }
    p.rect(9, 64, 7, 2, '#c8ccd4'); p.hline(9, 15, 64, '#e8ecf0');
    for (const [x, y] of [[18, 62], [19, 65], [18, 68]]) { p.set(x, y, '#fafaf4'); p.set(x, y + 1, '#a8a8a0'); }
    p.set(19, 59, '#fafaf4');
    p.set(21, 69, '#c8ccd4'); p.set(21, 70, '#8a8e98');
    return finish(p);
  }
  // Abe's 1974 Telecaster Deluxe (from the user's photo): a red single-cutaway body with the paint
  // worn through in spots, a big black pickguard, two chrome Wide Range humbuckers, four knobs, a
  // hardtail bridge, a maple neck with black dots and the big '70s headstock
  function teleDeluxe() {
    const W = 24, H = 74, p = new Pix(W, H), MAP = '#ecc478', MAPD = '#c89c50', DOT = '#2a2018';
    // the big headstock
    for (let y = 0; y < 15; y++) {
      const x0 = 9 + Math.round(y * 0.08), x1 = y < 1 ? 15 : y < 9 ? 18 - (y < 2 || y > 7 ? 1 : 0) : y < 12 ? 16 : 14;
      p.hline(x0, x1, y, MAP); p.set(x1, y, MAPD);
    }
    for (const y of [2, 4, 6, 8, 10, 12]) { p.set(7 + Math.round(y * 0.08), y, '#c8ccd4'); p.set(8 + Math.round(y * 0.08), y, '#8a8e98'); }
    p.set(14, 3, '#8a6030'); p.set(15, 4, '#8a6030'); p.set(15, 5, '#8a6030'); p.set(16, 6, '#8a6030');
    for (let y = 15; y < 50; y++) { p.hline(10, 14, y, MAP); p.set(14, y, MAPD); }
    let fy = 17;
    for (let k = 1; fy < 48; k++) {
      p.hline(10, 14, fy, '#c8ccd4');
      if ([3, 5, 7, 9].includes(k)) p.set(12, fy + 1, DOT);
      if (k === 12) { p.set(11, fy - 1, DOT); p.set(13, fy - 1, DOT); }
      fy += Math.max(2, Math.round(4 - k * 0.2));
    }
    // the body: a rounded bass-side shoulder, one cutaway and a little horn on the treble side
    const inBody = (x, y) => {
      if (y < 43 || y >= H || x < 1 || x > 22) return false;
      if (y < 48) return (x <= 10 && x >= 10 - (y - 43) * 2) || ((x - 19.5) ** 2 / 8 + (y - 48) ** 2 / 20 <= 1);
      if (y < 51 && x >= 15 && x <= 17) return (x - 15) ** 2 + (y - 48) ** 2 > 9;
      const bx = Math.max(0, 6 - x, x - 17), by = Math.max(0, y - 68);
      return bx * bx + by * by <= 30;
    };
    for (let y = 43; y < H; y++) for (let x = 0; x < W; x++) {
      if (!inBody(x, y) || (x >= 10 && x <= 14 && y < 50)) continue;
      const edge = !inBody(x - 1, y) || !inBody(x + 1, y) || !inBody(x, y + 1), h = G.hash(x, y, 23);
      p.set(x, y, h < 0.07 ? '#e8d8c0' : edge ? (h < 0.3 ? '#e8d8c0' : '#a02018') : x < 4 ? '#f05040' : '#d83828');
    }
    // the black pickguard: around the neck, both pickups and the knobs on the lower right
    const edge = (pts, y) => { if (y <= pts[0][0]) return pts[0][1]; for (let k = 1; k < pts.length; k++) if (y <= pts[k][0]) { const [y0, x0] = pts[k - 1], [y1, x1] = pts[k]; return x0 + ((x1 - x0) * (y - y0)) / (y1 - y0); } return pts[pts.length - 1][1]; };
    const GL = [[44, 9], [45, 7], [46, 5], [47, 3], [60, 3], [61, 4], [62, 6], [63, 14], [71, 14]];
    const GR = [[44, 15], [46, 20], [48, 21], [66, 21], [67, 20], [69, 19], [71, 17]];
    for (let y = 44; y < 72; y++) for (let x = Math.round(edge(GL, y)); x <= Math.round(edge(GR, y)); x++) {
      if (!inBody(x, y) || !inBody(x - 1, y) || !inBody(x + 1, y) || !inBody(x, y + 1)) continue;
      p.set(x, y, '#141418');
    }
    for (let y = 43; y < 50; y++) { p.hline(10, 14, y, MAP); p.set(14, y, MAPD); }
    // strings, the two humbuckers, the hardtail bridge and the four knobs
    for (let y = 50; y < 64; y++) if (y % 2) { p.set(11, y, '#a8acb4'); p.set(13, y, '#a8acb4'); }
    for (const py of [51, 57]) { p.rect(8, py, 8, 3, '#c8ccd4'); p.hline(8, 15, py, '#e8ecf0'); for (let k = 0; k < 6; k++) p.set(9 + k, py + 1, '#6a6e78'); }
    p.rect(8, 63, 8, 3, '#c8ccd4'); p.hline(8, 15, 63, '#e8ecf0'); for (let k = 0; k < 3; k++) p.set(9 + k * 2, 64, '#8a8e98');
    for (const [x, y] of [[16, 63], [19, 64], [16, 67], [19, 68]]) { p.set(x, y, '#e8ecf0'); p.set(x + 1, y, '#a8acb4'); p.set(x, y + 1, '#5a5e68'); p.set(x + 1, y + 1, '#3a3e48'); }
    return finish(p);
  }
  G.TIN_IDS = ['lane1q', 'borkum', 'maidenLane', 'royalJersey', 'scottishCake', 'capstan', 'oldGowrie', 'cravensClaw', 'orlik', 'margate'];

  // ================================================================ EXPORTS
  G.art = {
    OUT, shade, Pix, fromRows, mirror, flash, person, P, scale2, buildingExtra, pipeArt, pipeProfile, PIPE_GEO,
    tile, tree, building,
  };

  // Build everything that doesn't depend on content.
  G.art.init = function () {
    const S = G.spr = {};
    S.heart = { full: heartIcon('full'), half: heartIcon('half'), empty: heartIcon('empty') };
    S.tooth = toothIcon(false);
    S.toothGold = toothIcon(true);
    S.doosh = fromRows(dooshRows, DOOSH_PAL).canvas();
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
    S.plant = plant(); S.feldspar = feldspar();
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
    S.heartBig = scale2(S.heart.full);
    S.schoolDesk = schoolDesk(); S.schoolDeskPaper = schoolDeskPaper(); S.schoolDeskBook = schoolDeskBook(); S.churchFlyer = churchFlyer();
    S.bouquet = bouquet();
    // home
    S.truck = truck();
    S.coop = coop();
    S.bunnyHouse = bunnyHouse(); S.daisy = { sit: daisy(false), hop: daisy(true), sitL: mirror(daisy(false)), hopL: mirror(daisy(true)) };
    S.firewood = firewood();
    S.sawhorses = sawhorses();
    S.patio = patio();
    // inside the house
    S.wallWindow = { one: wallWindow(1), two: wallWindow(2), shade: wallWindow(1, 'shade'), shade2: wallWindow(2, 'shade'), curtains: wallWindow(1, 'curtains') };
    S.curio = curio(); S.frenchDoor = frenchDoor(); S.brickFireplace = brickFireplace(); S.bayWindow = bayWindow();
    S.tuftedSofa = tuftedSofa(); S.gingerLamp = gingerLamp(); S.secretary = secretary();
    S.chairWhite = armchair('#e8eef0', { leg: '#c8a46c' }); S.chairLeather = armchair('#b8783e', { studs: true });
    S.wingback = armchair('#c8b48c', { wing: true, stripes: true, leg: '#6a3424' }); S.chairBlue = armchair('#a8c0cc', { leg: '#c8a46c' });
    S.coffeeTable = coffeeTable(); S.drumStool = drumStool(); S.sofaBack = sofaBack(); S.tuftedOttoman = tuftedOttoman();
    S.xConsole = xConsole(); S.grandfatherClock = grandfatherClock(); S.louverDoor = louverDoor(); S.archMirror = archMirror();
    S.stoneFireplace = stoneFireplace(); S.bookshelf2 = bookshelf2(); S.guitar = guitar(); S.barometer = barometer();
    S.floorLamp = floorLamp(); S.writingDesk = writingDesk();
    S.fridge = fridge(false); S.fridgeOpen = fridge(true); S.wallOvens = wallOvens(); S.rangeTop = rangeTop(); S.sinkTop = sinkTop();
    S.upperCabs = upperCabs(3); S.upperCabsMicro = upperCabs(3, 2); S.upperCabs2 = upperCabs(2);
    S.farmTable = farmTable(); S.chandelier = chandelier(); S.counterTV = counterTV(); S.knifeBlock = knifeBlock();
    S.blender = blender(null); S.blenderFull = blender('#8a9a5a');
    S.boot = glassBoot(null); S.bootSludge = glassBoot('#8a9a5a'); S.bootBlue = glassBoot('#3a6ae8'); S.bootMilk = glassBoot('#f4f4f0');
    S.ringLight = ringLight(); S.tripodPhone = tripodPhone();
    S.hallConsole = hallConsole(); S.giltMirror = giltMirror(); S.hallBench = hallBench();
    S.demilune = demilune(); S.ovalMirror = ovalMirror(); S.horsePrint = horsePrint(); S.toilet = toilet();
    S.coatHooks = coatHooks(); S.bootBench = bootBench(); S.washerDryer = washerDryer(); S.blueHutch = blueHutch(); S.trainTable = trainTable();
    S.bedKing = homeBed({ w: 48, h: 56, quilt: '#f0f2f4', pattern: 'quilted', skirt: '#2a3458', pillows: ['#f4f4f0', '#e8ecf0'], head: '#8a5428' });
    S.bedLily = homeBed({ w: 32, h: 50, quilt: '#2a3458', pattern: 'quilted', pillows: ['#2a3458', '#f4f4f0'], accent: ['#c8a050', '#3a2a18'], foot: ['#e8d8c8', '#c87a8a'], head: '#e8e0d8' });
    S.bedGuest = homeBed({ w: 32, h: 50, quilt: '#f6f4ee', pillows: ['#e8e4d0', '#d8d4c0'], skirt: '#e8dcc8', head: '#6a3a24' });
    S.bedNate = homeBed({ w: 16, h: 48, quilt: '#66705a', pattern: 'plaid', patC: '#98a288', pillows: ['#f4f4f0'], head: '#7a4a28' });
    S.nightRed = nightstand('#d84848'); S.nightBlack = nightstand('#1c1c22'); S.nightCream = nightstand('#f4ecd8');
    S.hamper = hamper(); S.paintBarn = painting('barn'); S.paintSea = painting('sea'); S.paintSunset = painting('sunset'); S.paintLand = painting('land'); S.paintSmall = painting('small');
    S.familyPhotos = familyPhotos(); S.spindleChair = spindleChair(); S.glider = glider(); S.settee = settee(); S.giraffe = giraffe();
    S.doubleVanity = doubleVanity(); S.tub = tub(); S.chemDesk = chemDesk(true); S.chemDeskEmpty = chemDesk(false); S.fireworksPoster = fireworksPoster();
    S.linenShelf = linenShelf(); S.windowSeat = windowSeat(); S.dresser = dresser();
    // yard
    S.gatePost = gatePost(); S.flag = flagFrames(); S.kidneyPool = kidneyPool(); S.marketUmbrella = marketUmbrella();
    S.teakSet = teakSet(); S.teakBench = teakBench(); S.lounger = lounger(); S.poolHouse = poolHouse(); S.porchFlag = porchFlag();
    S.adirondack = adirondack(); S.pinkTree = bloomTree(7, ['#ffe0ec', '#f8a8c8', '#e078a0', '#b85078']); S.purpleTree = bloomTree(9, ['#e8d8f8', '#c8a0e8', '#9a70c8', '#6a4898']);
    // story
    S.milk = milkIcon(); S.dye = dyeIcon(); S.liquidSmoke = smokeIcon(); S.vodka = vodkaIcon();
    S.corncob = [corncob(false), corncob(true)]; S.kernel = kernelShot();
    S.cereal = [cerealBox(0), cerealBox(1), cerealBox(2)];
    S.rings = ['#e83848', '#f8d040', '#58c048', '#3878d8'].map(cerealRing);
    S.rocket = [rocket(false), rocket(true)];
    S.snapdragon = [snapdragon(false), snapdragon(true)]; S.snapdragonL = S.snapdragon.map(mirror); S.pollen = pollenShot();
    S.bear = [bear(0), bear(1)]; S.bearL = S.bear.map(mirror);
    S.gourd = [gourd(false), gourd(true)];
    S.bird = [birdFrame(true), birdFrame(false)]; S.birdL = S.bird.map(mirror);
    S.beanCan = beanCan();
    // more home + fair bits
    S.router = router(); S.flowerStand = flowerStand(); S.basementDoor = basementDoor();
    S.signs = {
      people: protestSign('RESPECT|LITTLE|PEOPLE', '#f8e8a0'), grass: protestSign('SAVE THE|GRASS', '#c8e8b0'),
      money: protestSign('WASTE OF|MONEY', '#f0d0c0'), quad: protestSign('GIVE BACK|THE QUAD', '#d0e0f0'),
      who: protestSign('WHO|APPROVED|THIS?', '#f4f0e0'),
      cave: protestSign('CAVE|CLOSED', '#f8d0c0'),
    };
    S.bookPiles = [bookPile(1, 5), bookPile(2, 4), bookPile(3, 6)]; S.furnace = furnace(); S.storageBoxes = storageBoxes();
    S.flyingBook = [flyingBook(true), flyingBook(false)];
    S.globglog = [globglog(-1), globglog(0), globglog(1)]; S.egg = eggShot();
    S.wateringCan = wateringCan(); S.wateringCanR = mirror(S.wateringCan);
    S.chewedPage = chewedPage(); S.pastorBook = pastorBook(); S.keyring = keyring(); S.earplugs = earplugs();
    // Dad's workshop
    S.convertible = convertible(); S.workbench = workbench(); S.bassOnBench = bassOnBench(); S.natesBass = natesBass(); S.bassIcon = bassIcon();
    S.shopShelves = shopShelves(false); S.shopShelvesPlane = shopShelves(true); S.sepiaPhoto = sepiaPhoto(); S.toolChest = toolChest(); S.lumberPile = lumberPile();
    S.drillPress = drillPress(); S.lathe = lathe(); S.bandsaw = bandsaw(); S.tableSaw = tableSaw(); S.planer = planer(); S.sander = sander();
    S.miterSaw = miterSaw(); S.dustCollector = dustCollector(); S.shopVac = shopVac(); S.feedBags = feedBags(); S.buckets = buckets(); S.oldFridge = oldFridge();
    S.note = noteSprite(); S.heartRed = heartBalloon('#e83848'); S.heartPink = heartBalloon('#f080b0');
    S.farmhouse = farmhouse();
    S.grill = grill();
    S.patioUmbrella = patioUmbrella();
    S.woodStack = woodStack();
    S.woodRack = woodRack();
    S.woodPile = woodPile();
    S.firePit = firePit();
    S.lawnSet = lawnSet();
    S.hoop = hoop();
    S.bigTree = bigTree();
    S.suv = suv();
    S.picnicTable = picnicTable();
    S.mailbox = mailbox();
    S.streetSign = streetSign();
    S.pines = [pineTree(4), pineTree(5)];
    S.snowPines = S.pines.map(snowCap);
    S.vanWickle = vanWickle();
    S.rockIcons = {}; for (const k of ['hematite', 'magnetite', 'calcite', 'marble', 'quartz', 'jasper', 'garnet', 'pyrite', 'slag', 'sphalerite', 'galena', 'chalcopyrite', 'specular', 'lodestone', 'cannonball', 'dolomite', 'gneiss', 'stromatolite', 'cementrock', 'serpentine', 'eastonite', 'shale', 'basalt', 'prehnite', 'cavepearl', 'megalodon', 'chesapecten', 'fairystone']) S.rockIcons[k] = rockIcon(k);
    S.oreVein = [oreVein(0), oreVein(1), oreVein(2)]; S.dumpPile = dumpPile(false); S.slagPile = dumpPile(true);
    S.furnaceRuin = furnaceRuin(); S.adit = adit(); S.bat = [batFrame(true), batFrame(false)];
    S.megaphone = megaphone(); S.cavePearls = cavePearls();
    S.outcrops = { laf: outcrop('laf'), eas: outcrop('eas'), bed: outcrop('bed') };
    S.quarryRubble = quarryRubble(); S.bigBasalt = bigRock('basalt'); S.bigDolomite = bigRock('dolomite'); S.gravelBar = gravelBar();
    S.fc = { idle: fatherChristmas(false, false), up: fatherChristmas(true, false), idleRage: fatherChristmas(false, true), upRage: fatherChristmas(true, true), sweater: fatherChristmas(false, false, true) };
    S.diploma = diploma(); S.eggNote = eggNote(); S.candyCorn = candyCorn(); S.doritos = doritos(); S.pawPrints = pawPrints();
    S.balloonBooth = balloonBooth(false); S.balloonBoothEmpty = balloonBooth(true); S.funnelCake = funnelCake(); S.rockTray = rockTray();
    S.mikeyNote = mikeyNotePages(); S.noteIcon = noteIcon();
    S.lampPost = lampPost(); S.lampPostL = mirror(S.lampPost);
    S.gull = [false, true].map((l) => ({ sit: gullFrame(l, 'sit'), up: gullFrame(l, 'up'), down: gullFrame(l, 'down') }));
    S.tunnelPortal = tunnelPortal(); S.tunnelPortalTS = tunnelPortal('THIMBLE SHOAL CHANNEL TUNNEL'); S.containerShip = containerShip(); S.fishingBoat = fishingBoat(); S.pelican = pelican(); S.pelicanL = mirror(S.pelican);
    S.bayViewer = bayViewer(); S.tunnelLight = tunnelLight(); S.tunnelSign = tunnelSign();
    S.gateKey = gateKey(); S.rodIcon = rodIcon(); S.rodHeld = rodHeld(); S.lure = lure(); S.bobber = bobber();
    S.mosasaur = [mosasaurSkull(true), mosasaurSkull(false)]; S.pebble = pebble(); S.sifter = sifter();
    S.fcCrate = fcCrate(false); S.fcCrateOpen = fcCrate(true); S.mineCart = mineCart(); S.timberSet = timberSet(); S.mineLantern = mineLantern();
    S.ornaments = [ornament('#d83030'), ornament('#2e9a4a'), ornament('#d8b040')]; S.candyCane = candyCane(); S.giftBomb = giftBomb();
    S.mineralCases = {}; for (const k of ['quartz', 'garnet', 'fluor', 'fossil', 'pyrite']) S.mineralCases[k] = mineralCase(k);
    S.rockWall = rockWallSection(); S.stainedGlass = stainedGlass(); S.jawCrusher = jawCrusher(); S.rockSaw = rockSaw();
    S.microscopeBench = microscopeBench(); S.conglomerate = conglomerate(); S.meteorite = meteoritePedestal(); S.lamppost = lamppost();
    S.boulders = {}; for (const k of ['gneiss', 'limestone', 'conglomerate', 'sandstone']) S.boulders[k] = gardenRock(k);
    S.mic = micSprite(); S.snowflake = snowflake(); S.icicle = icicle(); S.snowman = snowman();
    S.chickens = {};
    for (const [k, col] of [['white', '#f4f2ec'], ['brown', '#b8683a']]) {
      const a = chicken(col, false), b = chicken(col, true);
      S.chickens[k] = { left: [a, b], right: [mirror(a), mirror(b)] };
    }
    S.ticket = ticketIcon();
    S.phone = phoneIcon();
    S.pipe = pipeIcon();
    S.pipeSmall = pipeSmall();
    S.pipeSmallL = mirror(S.pipeSmall);
    S.paper = paperIcon();
    S.chalkboard = chalkboard(); S.chalkboardEng = chalkboard('EEENGLISH 101');
    S.chalkboardGeo = chalkboard('CRYSTALS!');
    // the bay: RoFo Pop (the small fizzers and the Two-Liter), and the toll plaza
    S.rofo = { idle: twoLiter(12, 22), flat: twoLiter(12, 22, { flat: true }), bottle: rofoBottleIcon() };
    S.twoLiter = { flat: twoLiterBrute('slam', true) };
    for (const pose of ['stand', 'walk1', 'walk2', 'raise', 'slam', 'pour']) S.twoLiter[pose] = twoLiterBrute(pose);
    S.fizzDrop = fizzDrop(); S.tollPlaza = tollPlaza();
    // Tom's Pizza
    S.tomsPizza = tomsPizza(); S.groceryStore = groceryStore(); S.broom = broom(); S.catalogBin = catalogBin(); S.highTops = highTops(); S.goose = { right: {} }; for (const k of ['walk1', 'walk2', 'graze', 'hiss', 'fly1', 'fly2']) S.goose.right[k] = goose(k); S.goose.left = {}; for (const k in S.goose.right) S.goose.left[k] = mirror(S.goose.right[k]); S.produceStand = produceStand(); S.dairyCooler = dairyCooler(); S.aisleShelf = aisleShelf(); S.checkout = checkout(); S.boombox = [0, 1].map(boombox); S.mopBucket = mopBucket(); S.produceSign = produceSign(); S.forLeaseShop = forLeaseShop(); S.deckOven = deckOven(); S.ovenHood = ovenHood(); S.tomsCounter = tomsCounter(7);
    S.pizzaBoxes = pizzaBoxes(); S.checkTable = checkTable(); S.dadTomPicture = dadTomPicture();
    // Abe and Hannah's condo
    S.condo = condoBuilding(); S.brickStep = brickStep();
    S.condoTan = condoNeighborTan(); S.condoCream = condoNeighborCream(); S.postLamp = postLamp(); S.arborvitae = arborvitae(); S.schoolBus = schoolBus();
    // Romulus: the house-size dog, and the giant on the golf course at three sizes
    const DOG_POSES = ['stand', 'run1', 'run2', 'run3', 'stalk', 'bark', 'scared', 'happy'];
    const dogSet = (s, poses) => { const r = {}, l = {}; for (const k of poses) { r[k] = borderCollie(s, k); l[k] = mirror(r[k]); } return { right: r, left: l }; };
    S.romulus = dogSet(1, [...DOG_POSES, 'lie']);
    S.romulusBig = { 4: dogSet(4, DOG_POSES), 3: dogSet(3, DOG_POSES), 2: dogSet(2, DOG_POSES) };
    S.golfBall = golfBall(); S.golfFlag = golfFlag();
    S.bidetIcon = bidetIcon(); S.bidetHand = bidetHand(); S.bidetHandL = mirror(S.bidetHand);
    S.condoCars = { jeep: rot90(suvTop('#c4c8cc'), false), black: suvTop('#2a2a30'), escape: rot90(suvTop('#26262c')), crv: rot90(suvTop('#6a98a8')) };
    S.boxwood = shrub(16, 13, 3); S.azalea = shrub(17, 14, 5, 16); S.bigShrub = shrub(36, 32, 7);
    S.traeger = traeger(); S.lawnChair = lawnChair(); S.acUnit = acUnit(); S.privacyFence = privacyFence(4); S.trashEnclosure = trashEnclosure();
    S.condoFireplace = condoFireplace(); S.entryLantern = entryLantern();
    S.condoDiningSet = condoDiningSet(); S.condoSideboard = condoSideboard(); S.monstera = monstera(); S.condoSofa = condoSofa(); S.trestleTable = trestleTable();
    S.birdRug = birdRug(); S.condoEndTable = condoEndTable(); S.glassCabinet = glassCabinet(); S.dogBed = dogBed(); S.dogBowls = dogBowls(); S.smallChest = smallChest();
    S.condoArmchair = armchair('#e6dccb');
    S.kitchenRunner = kitchenRunner(); S.utensilCrock = utensilCrock(); S.bathMat = bathMat(); S.tankBasket = tankBasket();
    // El Toro Loco
    S.toroFront = toroFront(); S.toroSign = toroSign(); S.toroCars = { white: suvTop('#eceef0'), gray: suvTop('#4a4c54'), red: suvTop('#a83030'), blue: rot90(rot90(suvTop('#3a5a98'))) };
    S.boothBack = boothBack(); S.boothFront = boothFront(); S.boothFrontBare = boothFront(false); S.toroTable = toroTable();
    S.toroMural = toroMural(); S.buntingWall = bunting(288, 2); S.buntingRoom = bunting(288, 5); S.toroLamp = toroLamp(); S.garlicPillar = garlicPillar();
    S.beerSurf = beerSurf(); S.beerGreen = beerGreen(); S.soccerBall = soccerBall(); S.sunFace = sunFace(); S.kitchenDoor = kitchenDoor();
    S.toroBar = toroBar(); S.toroBottles = toroBottles(); S.barStool = barStool(); S.toroStage = toroStage(); S.openMicSign = openMicSign();
    // CHKD
    S.carSeat = carSeat(); S.chkdCars = { red: rot90(suvTop('#b83030')), white: rot90(suvTop('#eceef0'), false) };
    S.chkdFront = chkdFront(); S.chkdCanopy = chkdCanopy(); S.redBall = redBall(); S.yellowBench = yellowBench(); S.kidStatues = kidStatues(); S.chkdFlag = chkdFlag(); S.chkdLamp = chkdLamp();
    S.receptionDesk = receptionDesk(); S.elevatorDoors = elevatorDoors(); S.elevatorButtons = elevatorButtons(); S.fishTank = fishTank(); S.bigTeddy = bigTeddy(); S.kidChairs = kidChairs();
    S.blockStack = blockStack(); S.giftShop = giftShop(); S.nurseStation = nurseStation(); S.roomDoors = ['#8ab8e8', '#f4a8c8', '#a8d8a0', '#f8d890'].map(roomDoor);
    S.ivPole = ivPole(); S.wheelchair = wheelchair(); S.crashCart = crashCart(); S.rockingHorse = rockingHorse(); S.ballPit = ballPit(); S.toyKitchen = toyKitchen(); S.blockTower = blockTower();
    S.isolettes = { blue: isolette('#8ab8e8'), pink: isolette('#f4a8c8'), mint: isolette('#a8e0c8') }; S.vitalsMonitor = vitalsMonitor(); S.nicuGlider = nicuGlider(); S.nicuDoors = nicuDoors(); S.badgeIcon = badgeIcon();
    S.highStriker = highStriker(); S.duckBooth = duckBooth(); S.raceBooth = raceBooth(); S.safetyStation = safetyStation(); S.homeAtticHatch = homeAtticHatch();
    S.rubberDuck = { right: rubberDuck(false) }; S.rubberDuck.left = mirror(S.rubberDuck.right); S.goldenDuck = { right: rubberDuck(true) }; S.goldenDuck.left = mirror(S.goldenDuck.right);
    S.carboyIcon = carboyIcon(); S.nozzleIcon = nozzleIcon();
    S.firstAidIcon = firstAidIcon(); S.supplyDoor = supplyDoor(); S.supplyCabinet = supplyCabinet(); S.heartRock = heartRock();
    S.roomWindow = roomWindow(); S.kidWhiteboard = kidWhiteboard(); S.wallTV = wallTV(); S.bedBack = bedBack(); S.bedFront = bedFront(); S.recliner = recliner(); S.getWellBalloons = getWellBalloons(); S.rockBooksStand = rockBooksStand();
    S.helipad = helipad(); S.roofAccess = roofAccess(); S.hvacUnit = [0, 1, 2].map(hvacUnit); S.windsock = [0, 1].map(windsock); S.roofVent = roofVent();
    S.babies = { blue: hypnoBaby(), pink: hypnoBaby({ cap: '#f4a8c8' }), tan: hypnoBaby({ cap: '#a8e0c8', skin: '#c88a60' }), brown: hypnoBaby({ cap: '#f8d890', skin: '#8a5a3a' }), badge: hypnoBaby({ badge: true }) };
    S.bassinetBaby = bassinetBaby(); S.hypnoSpiral = [0, 1].map(hypnoSpiral); S.tinyStars = [tinyStar('#f8e070'), tinyStar('#f8c8e8'), tinyStar('#a8d8f8')];
    S.mech = { right: { idle: [mechBody('idle', 1), mechBody('idle', 2)], raise: mechBody('raise'), smash: mechBody('smash') } };
    S.mech.left = { idle: S.mech.right.idle.map(mirror), raise: mirror(S.mech.right.raise), smash: mirror(S.mech.right.smash) };
    S.mechDome = { hypno: mechDome('hypno'), cry: mechDome('cry'), asleep: mechDome('asleep'), empty: mechDome('empty') }; S.pacifierShot = pacifierShot();
    // the finale (the Number One Ditch)
    S.eggThrone = eggThrone(); S.culvert = culvert(); S.ditchSign = ditchSign(); S.cattails = cattails(); S.bean = bean();
    S.goldenEgg = [goldenEgg(false), goldenEgg(true)]; S.egglet = { right: [egglet(0), egglet(1)] }; S.egglet.left = S.egglet.right.map(mirror);
    S.tossRock = tossRock(); S.clayPot = clayPot(); S.icePack = icePack(); S.bandageRoll = bandageRoll(); S.smokeRing = smokeRing();
    S.tins = {}; for (const id of G.TIN_IDS) S.tins[id] = tinArt(id);
    S.pipeBook = pipeBookIcon(); S.beltIcon = beltIcon();
    S.jazzmaster = jazzmaster(); S.stratocaster = stratocaster(); S.teleDeluxe = teleDeluxe();
    S.shards = ['#d83030', '#2e9a4a', '#d8b040'].map(shard);
    S.kiteInTree = kiteInTree(); S.tallHedge = tallHedge(); S.gardenGate = gardenGate(false); S.gardenGateOpen = gardenGate(true);
    S.birdbath = birdbath(); S.stoneBench = stoneBench(); S.gardenGnome = gardenGnome(); S.roseBush = roseBush();
    S.slothPlush = slothPlush(); S.slothIcon = slothIcon(); S.abeBassIcon = abeBassIcon(); S.bassHeld = bassHeld(); S.cableIcon = cableIcon(); S.romSnout = [romSnout(false), romSnout(true)]; S.romSnoutLeaves = romSnoutLeaves();
    S.condoBed = condoBed(); S.nightstandAmber = nightstandAmber(); S.nightstandDark = nightstandDark(); S.creamDresser = creamDresser();
    S.ceilingFan = [0, 1, 2, 3].map(ceilingFan);
    S.loftTV = loftTV(); S.grayOttoman = grayOttoman(); S.loftSofaBack = loftSofaBack(); S.condoBookshelf = condoBookshelf(); S.condoFloorLamp = condoFloorLamp();
    S.yellowGuitar = yellowGuitar(); S.tealCurtain = tealCurtain();
    S.plants = {}; for (const k of ['hydrangea', 'petunia', 'fern', 'geranium', 'rose']) S.plants[k] = [pottedPlant(k, false), pottedPlant(k, true)];
    S.guestBed = guestBed(); S.officeDesk = officeDesk(); S.officeChair = officeChair(); S.blackFloorLamp = blackFloorLamp(); S.woodChest = woodChest();
    S.cubeShelf = cubeShelf(); S.guitarTrio = guitarTrio(); S.vibroAmp = vibroAmp(); S.guitarAdPrints = guitarAdPrints(); S.wilcoPoster = wilcoPoster();
    S.closetShelves = closetShelves(); S.hangingClothes = hangingClothes(); S.closetJunk = closetJunk(); S.miniAmp = miniAmp();
    S.guitarAcoustic = guitarOnStand('acoustic'); S.guitarElectric = guitarOnStand('electric'); S.caseBlack = guitarCase('black'); S.caseTweed = guitarCase('tweed');
    S.condoFridge = condoFridge(); S.glassRange = glassRange(); S.dishwasher = dishwasher();
    S.condoUppers = { two: condoUpperCabs(2), micro: condoUpperCabs(1, 0), three: condoUpperCabs(3) };
    S.washerFront = washerFront(); S.dryerBack = dryerBack(); S.wireShelf = wireShelf(1);
    S.condoVanity = condoVanity(2); S.bathMirror = bathMirror(2); S.openShelves = openShelves(); S.tubCurtain = tubCurtain(); S.tubGlass = tubGlass();
    S.bifoldCloset = bifoldCloset(); S.atticHatch = atticHatch(); S.closetRods = closetRods(4);
    S.cableHeaps = [cableHeap(1), cableHeap(2), cableHeap(3)]; S.cableTotes = cableTotes(2); S.cableBox = cableBox(); S.junkPile = junkPile();
  };
})();
