'use strict';
// Tile maps, collision, props, triggers and world rendering.

(function () {
  // char -> tile kind. `edge` makes the tile draw borders against different neighbors.
  const TD = G.TILE_DEFS = {
    '.': { k: 'grass' },
    ',': { k: 'flowers' },
    '"': { k: 'tallgrass', cut: true },
    'c': { k: 'cut' },
    'b': { k: 'bush', solid: true, cut: true },
    '=': { k: 'path', edge: true },
    's': { k: 'sand', edge: true },
    '~': { k: 'water', solid: true, edge: true, anim: true },
    '#': { k: 'stone', solid: true },
    'f': { k: 'fence', solid: true },
    '_': { k: 'floor' },
    'w': { k: 'wallTop', solid: true },
    'v': { k: 'wallFace', solid: true },
    'r': { k: 'rug', edge: true },
    'x': { k: 'mat' },
    ' ': { k: 'void', solid: true },
  };

  const overlap = (a, b) => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];
  G.overlap = overlap;

  class World {
    constructor(id) {
      const def = G.MAPS[id];
      this.id = id;
      this.def = def;
      const rows = typeof def.tiles === 'function' ? def.tiles() : def.tiles;
      this.h = rows.length;
      this.w = rows[0].length;
      this.t = rows.map((r) => r.padEnd(this.w, '.').split(''));
      this.pw = this.w * 16;
      this.ph = this.h * 16;
      this.block = new Uint8Array(this.w * this.h);
      this.props = [];
      this.ents = [];
      this.fx = [];
      this.triggers = [];
      for (let y = 0; y < this.h; y++) {
        for (let x = 0; x < this.w; x++) {
          if (this.t[y][x] !== 'T') continue;
          this.t[y][x] = '.';
          this.addTree(x, y);
        }
      }
      if (def.setup) def.setup(this);
    }

    // ---------------------------------------------------------- building
    blockTiles(x, y, w, h) {
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
        const tx = x + i, ty = y + j;
        if (tx >= 0 && ty >= 0 && tx < this.w && ty < this.h) this.block[ty * this.w + tx] = 1;
      }
    }

    addTree(x, y) {
      const img = G.spr.trees[(x * 7 + y * 3) % G.spr.trees.length];
      this.props.push({ img, x: x * 16, y: y * 16 - 2, base: y * 16 + 31 });
      this.blockTiles(x, y, 2, 2);
    }

    addProp(o) {
      // o: { img, tx, ty, solid: [x,y,w,h] tiles, talk, hit: [x,y,w,h] tiles, dy }
      const img = o.img;
      const px = o.tx * 16 + (o.dx || 0);
      const py = o.ty * 16 + (o.h || 1) * 16 - img.height + (o.dy || 0);
      const prop = { img, x: px, y: py, base: o.base != null ? o.base : o.ty * 16 + (o.h || 1) * 16 - 1, talk: o.talk, flat: o.flat };
      if (o.solid) this.blockTiles(...o.solid);
      if (o.hit) prop.hit = [o.hit[0] * 16, o.hit[1] * 16, (o.hit[0] + o.hit[2]) * 16, (o.hit[1] + o.hit[3]) * 16];
      this.props.push(prop);
      return prop;
    }

    addBuilding(o) {
      // o: { x, y, w, h, door (offset), style, roof, wall, tower, to: {map, x, y}, locked: generator }
      const img = G.art.building(o);
      const extra = o.tower ? 28 : 0;
      this.props.push({ img, x: o.x * 16, y: o.y * 16 - extra, base: (o.y + o.h) * 16 - 1 });
      this.blockTiles(o.x, o.y, o.w, o.h);
      const dx = o.x + o.door, dy = o.y + o.h - 1;
      if (o.to) {
        this.block[dy * this.w + dx] = 0;
        this.addWarp(dx, dy, 1, 1, o.to.map, o.to.x, o.to.y, 'up');
      } else if (o.locked) {
        this.props.push({ img: null, x: 0, y: 0, base: 0, hit: [dx * 16, dy * 16, dx * 16 + 16, dy * 16 + 16], talk: o.locked });
      }
    }

    addWarp(x, y, w, h, map, tx, ty, dir) {
      this.triggers.push({
        rect: [x * 16, y * 16, (x + w) * 16, (y + h) * 16],
        fn: () => G.play.warp(map, tx, ty, dir),
      });
    }

    addTrigger(x, y, w, h, fn, once) {
      this.triggers.push({ rect: [x * 16, y * 16, (x + w) * 16, (y + h) * 16], fn, once });
    }

    add(e) {
      this.ents.push(e);
      e.world = this;
      return e;
    }

    // ---------------------------------------------------------- tiles
    tileAt(tx, ty) {
      if (tx < 0 || ty < 0 || tx >= this.w || ty >= this.h) return null;
      return this.t[ty][tx];
    }

    tileSolid(tx, ty) {
      const ch = this.tileAt(tx, ty);
      if (ch === null) return true;
      if (this.block[ty * this.w + tx]) return true;
      const d = TD[ch];
      return !!(d && d.solid);
    }

    setTile(tx, ty, ch) {
      if (this.tileAt(tx, ty) !== null) this.t[ty][tx] = ch;
    }

    // ---------------------------------------------------------- collision
    blocked(r, self) {
      const tx0 = Math.floor(r[0] / 16), tx1 = Math.floor((r[2] - 0.01) / 16);
      const ty0 = Math.floor(r[1] / 16), ty1 = Math.floor((r[3] - 0.01) / 16);
      for (let ty = ty0; ty <= ty1; ty++) for (let tx = tx0; tx <= tx1; tx++) if (this.tileSolid(tx, ty)) return true;
      for (const e of this.ents) {
        if (e === self || !e.solid || e.dead) continue;
        if (self && self.ghost) continue;
        if (overlap(e.box(), r)) return true;
      }
      return false;
    }

    // Moves an entity with axis-separated collision. Returns which axes hit.
    move(e, dx, dy, nudge) {
      let hitX = false, hitY = false;
      if (dx) {
        const r = e.boxAt(e.x + dx, e.y);
        if (!this.blocked(r, e)) e.x += dx;
        else {
          hitX = true;
          if (nudge && !dy) this.nudge(e, 'y', dx);
        }
      }
      if (dy) {
        const r = e.boxAt(e.x, e.y + dy);
        if (!this.blocked(r, e)) e.y += dy;
        else {
          hitY = true;
          if (nudge && !dx) this.nudge(e, 'x', dy);
        }
      }
      return { hitX, hitY };
    }

    // Slide around corners like in Zelda when you're almost lined up with a gap.
    nudge(e, axis, d) {
      for (let off = 1; off <= 7; off++) {
        for (const s of [-1, 1]) {
          const nx = axis === 'x' ? e.x + off * s : e.x + d;
          const ny = axis === 'y' ? e.y + off * s : e.y + d;
          if (!this.blocked(e.boxAt(nx, ny), e)) {
            if (axis === 'x') e.x += s * 0.75; else e.y += s * 0.75;
            return;
          }
        }
      }
    }

    // ---------------------------------------------------------- update
    update() {
      for (const e of this.ents) if (!e.dead && e.update) e.update(this);
      this.ents = this.ents.filter((e) => !e.dead);
      for (const f of this.fx) {
        f.x += f.vx; f.y += f.vy; f.vy += f.g || 0; f.life--;
      }
      this.fx = this.fx.filter((f) => f.life > 0);
    }

    burst(x, y, colors, n = 8, opt = {}) {
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + Math.random() * 0.5;
        const sp = (opt.speed || 1.2) * (0.5 + Math.random());
        this.fx.push({
          x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - (opt.up || 0), g: opt.g || 0,
          life: opt.life || 18 + Math.random() * 10, color: colors[i % colors.length], size: opt.size || 2,
        });
      }
    }

    // ---------------------------------------------------------- draw
    draw(ctx, cam) {
      const t0x = Math.max(0, Math.floor(cam.x / 16)), t1x = Math.min(this.w - 1, Math.floor((cam.x + G.W) / 16));
      const t0y = Math.max(0, Math.floor(cam.y / 16)), t1y = Math.min(this.h - 1, Math.floor((cam.y + G.H) / 16));
      const frame = Math.floor(G.tick / 24) % 3;
      for (let ty = t0y; ty <= t1y; ty++) {
        for (let tx = t0x; tx <= t1x; tx++) {
          const ch = this.t[ty][tx];
          const d = TD[ch] || TD['.'];
          let mask = 0;
          if (d.edge) {
            const diff = (x, y) => { const n = this.tileAt(x, y); return n !== null && n !== ch; };
            if (diff(tx, ty - 1)) mask |= 1;
            if (diff(tx + 1, ty)) mask |= 2;
            if (diff(tx, ty + 1)) mask |= 4;
            if (diff(tx - 1, ty)) mask |= 8;
          }
          const variant = d.anim ? 0 : Math.floor(G.hash(tx, ty) * 4);
          const img = G.art.tile(d.k, variant, mask, d.anim ? frame : 0);
          ctx.drawImage(img, tx * 16 - Math.round(cam.x), ty * 16 - Math.round(cam.y));
        }
      }

      const list = [];
      for (const p of this.props) if (p.img) list.push(p);
      for (const e of this.ents) list.push(e);
      list.sort((a, b) => (a.flat ? -1e6 : a.base != null ? a.base : a.y) - (b.flat ? -1e6 : b.base != null ? b.base : b.y));
      const cx = Math.round(cam.x), cy = Math.round(cam.y);
      for (const d of list) {
        if (d.draw) d.draw(ctx, cx, cy);
        else ctx.drawImage(d.img, d.x - cx, d.y - cy);
      }
      for (const f of this.fx) {
        ctx.fillStyle = f.color;
        const s = f.grow ? f.size * (1 + (1 - f.life / 30)) : f.size;
        ctx.fillRect(Math.round(f.x - s / 2 - cx), Math.round(f.y - s / 2 - cy), Math.round(s), Math.round(s));
      }
    }
  }

  G.World = World;
})();
