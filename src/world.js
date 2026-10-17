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
    'a': { k: 'asphalt', edge: true, group: 'asphalt' },
    'l': { k: 'stall', edge: true, group: 'asphalt' },
    'C': { k: 'concrete' },
    'B': { k: 'bleacher', solid: true },
    'n': { k: 'canvas' },
    'h': { k: 'ropeH', solid: true },
    'j': { k: 'ropeV', solid: true },
    'P': { k: 'post', solid: true },
    // home: Rattlesnake Bridge Rd
    'L': { k: 'lawnL', group: 'lawn' },
    'M': { k: 'lawnD', group: 'lawn' },
    'g': { k: 'gravel', edge: true, group: 'gravel' },
    'p': { k: 'pavers' },
    'Y': { k: 'roadLine', edge: true, group: 'asphalt' },
    'X': { k: 'rusticFence', solid: true },
    'e': { k: 'raisedBed', solid: true },
    'F': { k: 'flowerBed', solid: true },
    'k': { k: 'fabric' },
    'H': { k: 'hedge', solid: true },
    'W': { k: 'bridge', group: 'bridge' },
    // inside the house
    'o': { k: 'oakFloor' },
    'z': { k: 'bathTile' },
    'q': { k: 'rugNavy', edge: true },
    'R': { k: 'rugRed', edge: true },
    'i': { k: 'rugIkat', edge: true },
    '1': { k: 'faceLiving', solid: true, edge: true },
    '2': { k: 'faceSun', solid: true, edge: true },
    '3': { k: 'faceDen', solid: true, edge: true },
    '4': { k: 'faceKitchen', solid: true, edge: true },
    '5': { k: 'facePanel', solid: true, edge: true },
    '6': { k: 'faceCream', solid: true, edge: true },
    '7': { k: 'faceBlue', solid: true, edge: true },
    '8': { k: 'faceBath', solid: true, edge: true },
    '9': { k: 'faceNate', solid: true, edge: true },
    '0': { k: 'faceLily', solid: true, edge: true },
    'G': { k: 'glassWall', solid: true },
    'Q': { k: 'counter', solid: true },
    'S': { k: 'stairsUp' },
    'D': { k: 'stairsDown' },
    // Dad's workshop
    'K': { k: 'faceBoards', solid: true, edge: true },
    'm': { k: 'shopFloor' },
    'u': { k: 'garageDoor', solid: true },
    'O': { k: 'openBay' },
    // the basement
    'N': { k: 'faceStone', solid: true, edge: true },
    'd': { k: 'basementFloor' },
    'J': { k: 'snow' },
    'A': { k: 'snowPath' },
    'I': { k: 'ice', edge: true, ice: true },
  };
  const group = (ch) => (TD[ch] && TD[ch].group) || ch;

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
      this.texts = [];
      this.glows = [];
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

    addTree(x, y, kind) {
      if (kind === 'pink' || kind === 'purple') {
        this.props.push({ img: kind === 'pink' ? G.spr.pinkTree : G.spr.purpleTree, x: x * 16, y: y * 16 - 2, base: y * 16 + 31 });
      } else if (kind === 'pine' || kind === 'snowpine') {
        const set = kind === 'snowpine' ? G.spr.snowPines : G.spr.pines, img = set[(x + y) % set.length];
        this.props.push({ img, x: x * 16, y: y * 16 - 10, base: y * 16 + 31 });
      } else {
        const img = G.spr.trees[(x * 7 + y * 3) % G.spr.trees.length];
        this.props.push({ img, x: x * 16, y: y * 16 - 2, base: y * 16 + 31 });
      }
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
      const extra = G.art.buildingExtra(o);
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
      if (this.def.tick) this.def.tick(this);
      for (const e of this.ents) if (!e.dead && e.update) e.update(this);
      this.ents = this.ents.filter((e) => !e.dead);
      for (const f of this.fx) {
        f.x += f.vx; f.y += f.vy; f.vy += f.g || 0; f.life--;
      }
      this.fx = this.fx.filter((f) => f.life > 0);
      for (const t of this.texts) { t.y -= 0.35; t.t--; }
      this.texts = this.texts.filter((t) => t.t > 0);
    }

    // Floating text (taunts, "CLANK!", etc.)
    pop(x, y, text, color = '#f8d850') {
      this.texts.push({ x, y, text, color, t: 60 });
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
            const g = group(ch);
            const diff = (x, y) => { const n = this.tileAt(x, y); return n !== null && group(n) !== g; };
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

      this.glows = [];
      const list = [];
      for (const p of this.props) if (p.img || p.draw) list.push(p);
      for (const e of this.ents) list.push(e);
      list.sort((a, b) => (a.flat ? -1e6 : a.base != null ? a.base : a.y) - (b.flat ? -1e6 : b.base != null ? b.base : b.y));
      const cx = Math.round(cam.x), cy = Math.round(cam.y);
      for (const d of list) {
        if (d.draw) d.draw(ctx, cx, cy);
        else ctx.drawImage(d.img, d.x - cx, d.y - cy);
      }
      for (const f of this.fx) {
        if (f.ring) {
          // smoke ring: a pixel circle that grows and fades
          const r = 2 + (f.max - f.life) * 0.12;
          ctx.globalAlpha = Math.min(1, f.life / 20) * 0.85;
          ctx.fillStyle = f.color;
          for (let a = 0; a < Math.PI * 2; a += 0.5) {
            ctx.fillRect(Math.round(f.x + Math.cos(a) * r - cx), Math.round(f.y + Math.sin(a) * r * 0.7 - cy), 1, 1);
          }
          ctx.globalAlpha = 1;
          continue;
        }
        if (f.shock) {
          // shockwave: a thick ring racing outward
          const r = f.r * (1 - f.life / f.max) + 4;
          ctx.globalAlpha = Math.min(1, f.life / 10);
          ctx.strokeStyle = f.color; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(Math.round(f.x - cx), Math.round(f.y - cy), r, 0, Math.PI * 2); ctx.stroke();
          ctx.globalAlpha = 1;
          continue;
        }
        if (f.circle) {
          // explosion flash: an expanding disc that fades out
          ctx.globalAlpha = Math.min(1, f.life / 8);
          ctx.fillStyle = f.color;
          ctx.beginPath();
          ctx.arc(Math.round(f.x - cx), Math.round(f.y - cy), f.r * (1 - f.life / f.max) + 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
          continue;
        }
        ctx.fillStyle = f.color;
        const s = f.grow ? f.size * (1 + (1 - f.life / 30)) : f.size;
        ctx.fillRect(Math.round(f.x - s / 2 - cx), Math.round(f.y - s / 2 - cy), Math.round(s), Math.round(s));
      }
      for (const t of this.texts) {
        if (t.t < 12 && (t.t >> 1) & 1) continue;
        // kept on screen; lines too wide for it wrap onto a second row
        const rows = G.font.width(t.text) > G.W - 8 ? G.font.wrap(t.text, G.W - 8) : [t.text];
        rows.forEach((row, i) => {
          const w = G.font.width(row);
          const sx = G.clamp(Math.round(t.x - w / 2) - cx, 2, Math.max(2, G.W - w - 2));
          G.font.draw(ctx, row, sx, Math.round(t.y) - cy - (rows.length - 1 - i) * 9, t.color, { shadow: '#1c1424' });
        });
      }
    }
  }

  G.World = World;
})();
