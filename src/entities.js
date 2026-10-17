'use strict';
// Player, NPCs, enemies, pickups and interactive objects.

(function () {
  const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  G.DIRS = DIRS;

  function dirToward(dx, dy) {
    return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
  }
  G.dirToward = dirToward;

  class Ent {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.hb = { w: 10, h: 6 };
      this.solid = false;
      this.dead = false;
    }
    boxAt(x, y) {
      return [x - this.hb.w / 2, y - this.hb.h, x + this.hb.w / 2, y];
    }
    box() { return this.boxAt(this.x, this.y); }
    get base() { return this.y; }
  }
  G.Ent = Ent;

  function drawShadow(ctx, x, y, cx, cy, big) {
    const s = big ? G.spr.shadowBig : G.spr.shadow;
    ctx.drawImage(s, Math.round(x - s.width / 2) - cx, Math.round(y - 3) - cy);
  }
  G.drawShadow = drawShadow;

  // A bunch of bobbing heart balloons tied to someone's hand (Mikey's, for Lily).
  function drawBalloons(ctx, x, top, seed, n = 3) {
    const hand = [Math.round(x + 5), Math.round(top + 16)];
    [[-7, -14, 'heartRed'], [0, -21, 'heartPink'], [7, -15, 'heartRed']].slice(0, n).forEach(([dx, dy, key], i) => {
      const bx = Math.round(x + dx + Math.sin(G.tick / 40 + i * 2 + seed) * 1.5);
      const by = Math.round(top + dy + Math.sin(G.tick / 30 + i) * 1.5);
      drawString(ctx, bx, by + 8, hand[0], hand[1]);
      ctx.drawImage(G.spr[key], bx - 6, by - 4);
    });
  }
  function drawString(ctx, x0, y0, x1, y1) {
    ctx.fillStyle = '#e8e8f0';
    const n = Math.max(1, Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let k = 0; k <= n; k++) ctx.fillRect(Math.round(x0 + ((x1 - x0) * k) / n), Math.round(y0 + ((y1 - y0) * k) / n), 1, 1);
  }

  // Little golden halo over enemies calmed by "Peace Be With You".
  function drawHalo(ctx, x, y) {
    x = Math.round(x); y = Math.round(y);
    ctx.fillStyle = '#5a4810';
    ctx.fillRect(x - 4, y - 1, 9, 4);
    ctx.fillStyle = '#f8e070';
    ctx.fillRect(x - 3, y, 7, 1); ctx.fillRect(x - 3, y + 1, 1, 1); ctx.fillRect(x + 3, y + 1, 1, 1); ctx.fillRect(x - 2, y + 2, 5, 1);
    ctx.fillStyle = '#5a4810';
    ctx.fillRect(x - 2, y + 1, 5, 1);
  }

  function walkFrame(anim, moving) {
    return moving ? [1, 0, 2, 0][Math.floor(anim / 8) % 4] : 0;
  }

  // ============================================================== PLAYER
  class Player extends Ent {
    constructor(x, y, dir) {
      super(x, y);
      this.dir = dir || 'down';
      this.anim = 0;
      this.moving = false;
      this.state = 'walk';
      this.t = 0;
      this.inv = 0;
      this.kb = { x: 0, y: 0 };
      this.pose = null;
      this.holdIcon = null;
      this.hitSet = new Set();
    }

    get spr() { return G.nateSprites(); }

    update(w) {
      if (this.inv > 0) this.inv--;
      if (this.noT > 0) this.noT--;
      if (G.script.busy) { if (!this.walking) this.moving = false; return; }
      const inp = G.input;

      if (this.state === 'hurt') {
        w.move(this, this.kb.x, 0);
        w.move(this, 0, this.kb.y);
        this.kb.x *= 0.82; this.kb.y *= 0.82;
        if (--this.t <= 0) this.state = 'walk';
        this.waterCheck(w);
        return;
      }

      if (this.state === 'swing') {
        this.t++;
        if (this.t >= 3 && this.t <= 10) this.swingHits(w);
        if (this.t >= 14) this.state = 'walk';
        return;
      }

      // the half-finished bass: a big, slow, wide arc that hits twice as hard
      if (this.state === 'bass') {
        this.t++;
        if (this.t >= 4 && this.t <= 13) this.swingHits(w, this.bassRect(), 2);
        if (this.t >= 22) this.state = 'walk';
        return;
      }

      // puffing Dad's pipe: Nate stands still, the world keeps going
      if (this.state === 'pipe') { G.pipe.update(); return; }

      // Lily winding up a "No.": she plants her feet while Z is held
      if (this.state === 'charge') {
        this.t++;
        this.moving = false; this.anim = 0;
        if (this.t === NO_FULL) {
          G.audio.sfx('select');
          w.burst(this.x, this.y - 22, ['#ffffff', '#ff98d0', '#c83878'], 8, { speed: 1, life: 16, size: 1 });
        }
        if (!inp.down('a')) this.releaseNo();
        return;
      }

      // walking (on ice, Nate slides: he speeds up and slows down gradually).
      // With a song stuck in his head (the Globglogabgalab, no earplugs), left is right and up is down.
      const d0 = inp.dir(), d = G.play.earworm > 0 ? { x: -d0.x, y: -d0.y } : d0;
      this.moving = !!(d.x || d.y);
      const under = G.TILE_DEFS[w.tileAt(Math.floor(this.x / 16), Math.floor((this.y - 3) / 16))];
      const sp = d.x && d.y ? 1.0 : 1.35;
      if (this.moving) {
        if (d.x && d.y) {
          const okH = (d.x < 0 && this.dir === 'left') || (d.x > 0 && this.dir === 'right');
          const okV = (d.y < 0 && this.dir === 'up') || (d.y > 0 && this.dir === 'down');
          if (!okH && !okV) this.dir = d.x < 0 ? 'left' : 'right';
        } else {
          this.dir = d.x < 0 ? 'left' : d.x > 0 ? 'right' : d.y < 0 ? 'up' : 'down';
        }
        this.anim++;
      } else {
        this.anim = 0;
      }
      if (under && under.ice) {
        this.ivx = (this.ivx || 0) + (d.x * sp - (this.ivx || 0)) * 0.05;
        this.ivy = (this.ivy || 0) + (d.y * sp - (this.ivy || 0)) * 0.05;
        if (w.move(this, this.ivx, 0, true).hitX) this.ivx = 0;
        if (w.move(this, 0, this.ivy, true).hitY) this.ivy = 0;
      } else {
        this.ivx = d.x * sp; this.ivy = d.y * sp;
        if (this.moving) { w.move(this, d.x * sp, 0, true); w.move(this, 0, d.y * sp, true); }
      }
      if (this.waterCheck(w)) return;

      if (inp.hit('a')) {
        inp.eat('a');
        if (!G.play.tryInteract()) this.startSwing();
      } else if (inp.hit('b')) {
        inp.eat('b');
        if (!G.state.playAs) G.play.useItem();
      }
    }

    // Cracked ice: step (or slide) into open water and Nate falls in, loses half
    // a heart and climbs back out where he last stood safely.
    waterCheck(w) {
      const haz = (x, y) => { const d = G.TILE_DEFS[w.tileAt(Math.floor(x / 16), Math.floor(y / 16))]; return !!(d && d.hazard); };
      if (haz(this.x, this.y - 3)) {
        G.audio.sfx('poof');
        w.burst(this.x, this.y - 4, ['#3a7ab0', '#a8d8f0', '#ffffff'], 14, { speed: 1.6, up: 1, g: 0.1, life: 24, size: 2 });
        w.pop(this.x, this.y - 26, 'SPLASH!', '#a8e0ff');
        const s = this.safe || { x: this.x, y: this.y + 24 };
        this.x = s.x; this.y = s.y; this.ivx = this.ivy = 0;
        this.state = 'walk';
        if (!G.state.god) G.state.hp = Math.max(0, G.state.hp - 1);
        G.audio.sfx('hurt');
        this.inv = 70;
        G.play.shake(6, 2);
        if (G.state.hp <= 0) G.play.die();
        return true;
      }
      if (!haz(this.x - 7, this.y - 6) && !haz(this.x + 7, this.y - 6) && !haz(this.x - 7, this.y + 2) && !haz(this.x + 7, this.y + 2)) this.safe = { x: this.x, y: this.y };
      return false;
    }

    startSwing() {
      if (G.state.playAs === 'lily') { this.chargeNo(); return; }
      if (!G.state.items.hammer) return;
      this.state = 'swing';
      this.t = 0;
      this.hitSet.clear();
      G.audio.sfx('swing');
    }

    // Lily's only move, and it is enough: hold Z to wind it up (she can't
    // move while she does), let go to say it. Let go too early and it comes
    // out as a mumbled "no..." that Mikey hears as a maybe.
    chargeNo() {
      if (this.noT > 0) return;
      this.state = 'charge';
      this.t = 0;
      G.audio.sfx('blip');
    }

    releaseNo() {
      const full = this.t >= NO_FULL;
      this.state = 'walk';
      this.noT = 8;
      const [dx, dy] = DIRS[this.dir];
      this.world.add(new NoShot(this.x + dx * 8, this.y + dy * 6, this.dir, !full));
      G.audio.sfx(full ? 'no' : 'blip');
      if (full) G.play.shake(4, 1);
    }

    swingRect() {
      const { x, y } = this;
      switch (this.dir) {
        case 'right': return [x + 2, y - 20, x + 21, y + 3];
        case 'left': return [x - 21, y - 20, x - 2, y + 3];
        case 'up': return [x - 11, y - 32, x + 11, y - 8];
        default: return [x - 11, y - 6, x + 11, y + 14];
      }
    }

    startBass() {
      if (this.state !== 'walk') return;
      this.state = 'bass';
      this.t = 0;
      this.hitSet.clear();
      G.audio.sfx('bass');
    }

    bassRect() {
      const { x, y } = this;
      switch (this.dir) {
        case 'right': return [x + 2, y - 32, x + 32, y + 12];
        case 'left': return [x - 32, y - 32, x - 2, y + 12];
        case 'up': return [x - 20, y - 44, x + 20, y - 6];
        default: return [x - 20, y - 8, x + 20, y + 24];
      }
    }

    swingHits(w, r = this.swingRect(), dmg = 1) {
      for (const e of w.ents) {
        if (e.dead || this.hitSet.has(e)) continue;
        if (e.enemy && G.overlap(r, e.hurtBox())) {
          this.hitSet.add(e);
          e.hit(dmg, this.x, this.y);
        } else if (e.onHammer && G.overlap(r, e.box())) {
          this.hitSet.add(e);
          e.onHammer(this);
        }
      }
      // cut grass and bushes (only the tile cells near the hammer head)
      const tx0 = Math.floor((r[0] + 3) / 16), tx1 = Math.floor((r[2] - 3) / 16);
      const ty0 = Math.floor((r[1] + 3) / 16), ty1 = Math.floor((r[3] - 3) / 16);
      for (let ty = ty0; ty <= ty1; ty++) {
        for (let tx = tx0; tx <= tx1; tx++) {
          const ch = w.tileAt(tx, ty);
          const d = ch && G.TILE_DEFS[ch];
          if (!d || !d.cut || w.block[ty * w.w + tx]) continue;
          w.setTile(tx, ty, 'c');
          G.audio.sfx('cut');
          const cx = tx * 16 + 8, cy = ty * 16 + 8;
          w.burst(cx, cy, ch === 'b' ? ['#2e7a30', '#4aa840', '#9ae070'] : ['#40a03c', '#8ad868', '#2e7e30'], 10, { speed: 1.4, up: 0.8, g: 0.08, life: 22 });
          G.play.maybeDrop(cx, cy + 4, ch === 'b' ? 0.35 : 0.22);
        }
      }
    }

    hurt(dmg, sx, sy) {
      if (this.inv > 0 || G.script.busy || this.state === 'dead' || G.state.god) return;
      if (this.state === 'pipe') G.pipe.stop(); // a hit knocks the pipe out of his mouth
      G.state.hp = Math.max(0, G.state.hp - dmg);
      G.audio.sfx('hurt');
      this.inv = 70;
      this.state = 'hurt';
      this.t = 12;
      const dx = this.x - sx, dy = this.y - sy, m = Math.hypot(dx, dy) || 1;
      this.kb = { x: (dx / m) * 2.6, y: (dy / m) * 2.6 };
      G.play.shake(6, 2);
      if (G.state.hp <= 0) G.play.die();
    }

    hurtBox() { return [this.x - 6, this.y - 14, this.x + 6, this.y]; }

    draw(ctx, cx, cy) {
      if (this.hidden) return;
      const S = this.spr;
      drawShadow(ctx, this.x, this.y, cx, cy);
      if (this.inv > 0 && this.state !== 'hurt' && (this.inv >> 2) & 1) return;
      let img;
      if (this.pose === 'hold') img = S.hold;
      else img = S[this.dir][this.state === 'walk' ? walkFrame(this.anim, this.moving) : 0];
      const sx = Math.round(this.x - 8) - cx, sy = Math.round(this.y - S.h + 2) - cy;
      const swinging = this.state === 'swing', bassing = this.state === 'bass';
      if (swinging && this.dir === 'up') this.drawHammer(ctx, cx, cy);
      if (bassing && this.dir === 'up') this.drawBass(ctx, cx, cy);
      const charged = this.state === 'charge' && this.t >= NO_FULL && (G.tick >> 2) & 1;
      ctx.drawImage((this.state === 'hurt' && (this.t >> 1) & 1) || charged ? G.art.flash(img) : img, sx, sy);
      if (this.state === 'charge') {
        // wind-up meter over Lily's head
        const k = Math.min(1, this.t / NO_FULL), bx = Math.round(this.x - 8) - cx, by = sy - 6;
        ctx.fillStyle = '#1c1424'; ctx.fillRect(bx - 1, by - 1, 18, 4);
        ctx.fillStyle = k >= 1 ? ((G.tick >> 2) & 1 ? '#ffffff' : '#ff98d0') : '#c83878';
        ctx.fillRect(bx, by, Math.round(16 * k), 2);
      }
      if (swinging && this.dir !== 'up') this.drawHammer(ctx, cx, cy);
      if (bassing && this.dir !== 'up') this.drawBass(ctx, cx, cy);
      if (this.pose === 'hold' && this.holdIcon) {
        const ic = this.holdIcon;
        ctx.drawImage(ic, Math.round(this.x - ic.width / 2) - cx, sy - ic.height - 1);
      }
      if (this.emote) ctx.drawImage(this.emote, Math.round(this.x - 2) - cx, sy - 12);
      if (G.play.earworm > 0) {
        // little pink notes circling his head
        ctx.fillStyle = '#f8a8c8';
        for (let i = 0; i < 3; i++) {
          const a = G.tick * 0.1 + (i * Math.PI * 2) / 3, nx = Math.round(this.x + Math.cos(a) * 9) - cx, ny = Math.round(sy - 2 + Math.sin(a) * 3);
          ctx.fillRect(nx, ny, 2, 2); ctx.fillRect(nx + 1, ny - 3, 1, 3);
        }
      }
      if (this.chickenT > 0) {
        this.chickenT--;
        const ch = G.spr.chickens.white[this.dir === 'left' ? 'left' : 'right'][(this.chickenT >> 2) & 1];
        ctx.drawImage(ch, Math.round(this.x - ch.width / 2) - cx, sy - ch.height + 2);
      }
      if (this.pipeOut && this.dir !== 'up') {
        const pos = { right: [11, 7], left: [-3, 7], down: [8, 8] }[this.dir];
        ctx.drawImage(this.dir === 'left' ? G.spr.pipeSmallL : G.spr.pipeSmall, sx + pos[0], sy + pos[1]);
      }
    }

    // Held by the neck, the bass sweeps through a wide arc in front of Nate.
    drawBass(ctx, cx, cy) {
      const img = G.spr.bassSwing;
      const base = { right: 0, down: Math.PI / 2, left: Math.PI, up: -Math.PI / 2 }[this.dir];
      const k = Math.min(1, this.t / 13), flip = this.dir === 'left' || this.dir === 'down' ? -1 : 1;
      const a = base + flip * (-1.2 + k * 2.4);
      const hand = { right: [4, -9], left: [-4, -9], down: [2, -7], up: [-2, -12] }[this.dir];
      ctx.save();
      ctx.translate(Math.round(this.x + hand[0]) - cx, Math.round(this.y + hand[1]) - cy);
      ctx.rotate(a + Math.PI / 2);
      ctx.drawImage(img, -7, -32);
      ctx.restore();
    }

    drawHammer(ctx, cx, cy) {
      const H = G.spr.hammer;
      const phase = this.t < 4 ? 0 : this.t < 8 ? 1 : 2;
      // [sprite, quarter turns, hand offset]
      const table = {
        right: [[H.up, 0], [H.diag, 0], [H.up, 1]],
        down: [[H.up, 1], [H.diag, 1], [H.up, 2]],
        left: [[H.up, 0], [H.diag, 3], [H.up, 3]],
        up: [[H.up, 1], [H.diag, 0], [H.up, 0]],
      };
      const hand = { right: [5, -9], left: [-5, -9], down: [3, -7], up: [-2, -13] }[this.dir];
      const [img, q] = table[this.dir][phase];
      const piv = img === H.up ? [8, 15] : [2, 14];
      ctx.save();
      ctx.translate(Math.round(this.x + hand[0]) - cx, Math.round(this.y + hand[1]) - cy);
      ctx.rotate((q * Math.PI) / 2);
      ctx.drawImage(img, -piv[0], -piv[1]);
      ctx.restore();
    }
  }
  G.Player = Player;

  // ============================================================== NPC
  class NPC extends Ent {
    constructor(o) {
      super(o.x, o.y);
      Object.assign(this, o);
      this.solid = true;
      this.hb = { w: 12, h: 8 };
      this.dir = o.dir || 'down';
      this.homeDir = this.dir;
      this.anim = 0;
      this.moving = false;
      this.home = { x: o.x, y: o.y };
      this.wt = 60 + Math.random() * 90;
      this.vx = 0; this.vy = 0;
    }

    get S() { return G.sprites[this.sprite]; }

    update(w) {
      if (this.flashT > 0) this.flashT--;
      if (G.script.busy) { if (!this.walking) this.moving = false; return; }
      if (!this.wander) return;
      if (--this.wt <= 0) {
        if (this.moving) {
          this.moving = false;
          this.wt = 60 + Math.random() * 120;
        } else {
          const dirs = Object.keys(DIRS);
          let dir = dirs[Math.floor(Math.random() * 4)];
          const hx = this.x - this.home.x, hy = this.y - this.home.y;
          if (Math.hypot(hx, hy) > this.wander) dir = dirToward(-hx, -hy);
          this.dir = dir;
          this.vx = DIRS[dir][0] * 0.5; this.vy = DIRS[dir][1] * 0.5;
          this.moving = true;
          this.wt = 20 + Math.random() * 40;
        }
      }
      if (this.moving) {
        const p = G.play.player;
        const r = this.boxAt(this.x + this.vx, this.y + this.vy);
        if (G.overlap(r, p.box())) { this.moving = false; return; }
        const hit = w.move(this, this.vx, this.vy);
        if (hit.hitX || hit.hitY) this.moving = false;
        this.anim++;
      }
    }

    draw(ctx, cx, cy) {
      const S = this.S;
      drawShadow(ctx, this.x, this.y, cx, cy, S.h > 24);
      let img = S[this.dir][walkFrame(this.anim, this.moving)];
      if (this.flashT > 0 && (this.flashT >> 1) & 1) img = G.art.flash(img);
      if (this.balloons) drawBalloons(ctx, this.x - cx, this.y - S.h - cy, this.x);
      if (this.sign) ctx.drawImage(this.sign, Math.round(this.x - this.sign.width / 2 + 4) - cx, Math.round(this.y - S.h - this.sign.height + 14) - cy);
      if (this.scale && this.scale !== 1) {
        // swelling up (Badlands, right before the end)
        const k = this.scale, w2 = Math.round(16 * k), h2 = Math.round(S.h * k);
        ctx.drawImage(img, Math.round(this.x - w2 / 2) - cx, Math.round(this.y + 2 - h2) - cy, w2, h2);
        return;
      }
      ctx.drawImage(img, Math.round(this.x - 8) - cx, Math.round(this.y - S.h + 2) - cy);
      if (this.held) ctx.drawImage(this.held, Math.round(this.x - this.held.width / 2) - cx, Math.round(this.y - S.h + 10) - cy);
      if (this.emote) ctx.drawImage(this.emote, Math.round(this.x - 2) - cx, Math.round(this.y - S.h - 10) - cy);
    }
  }
  G.NPC = NPC;

  // ============================================================== FOLLOWER
  // A party member trailing behind Nate, Minish Cap style.
  class Follower extends Ent {
    constructor(id, idx, x, y, dir) {
      super(x, y);
      this.id = id;
      this.idx = idx;
      this.dir = dir;
      this.anim = 0;
      this.moving = false;
    }

    get S() { return G.sprites[this.id]; }

    talk() { return G.SCRIPTS.partyTalk(this.id); }

    update() {
      if (this.walking || this.hold) return;
      const tr = G.play.trail;
      const tgt = tr[Math.min(tr.length - 1, (this.idx + 1) * 14)];
      const dx = tgt.x - this.x, dy = tgt.y - this.y, d = Math.hypot(dx, dy);
      if (d > 0.6) {
        const sp = Math.min(d, Math.max(1.35, d * 0.2));
        this.x += (dx / d) * sp;
        this.y += (dy / d) * sp;
        this.dir = tgt.dir;
        this.moving = true;
        this.anim++;
      } else {
        this.moving = false;
      }
    }

    draw(ctx, cx, cy) {
      if (this.hidden) return;
      const S = this.S;
      drawShadow(ctx, this.x, this.y, cx, cy, S.h > 24);
      ctx.drawImage(S[this.dir][walkFrame(this.anim, this.moving)], Math.round(this.x - 8) - cx, Math.round(this.y - S.h + 2) - cy);
      if (this.emote) ctx.drawImage(this.emote, Math.round(this.x - 2) - cx, Math.round(this.y - S.h - 10) - cy);
    }
  }
  G.Follower = Follower;

  // ============================================================== PACKAGE (bomb)
  // A booby-trapped Christmas present. Set it down, run, BANG.
  class Package extends Ent {
    constructor(x, y) {
      super(x, y);
      this.t = 110;
      this.hb = { w: 10, h: 6 };
    }
    update() {
      if (G.script.busy) return;
      this.t--;
      if (this.t % 14 === 0) G.audio.sfx('fuse');
      if (this.t <= 0) {
        this.dead = true;
        G.play.explode(this.x, this.y - 5, true);
      }
    }
    draw(ctx, cx, cy) {
      ctx.drawImage(G.spr.shadow, Math.round(this.x - 6) - cx, Math.round(this.y - 3) - cy);
      let img = (this.t >> 2) & 1 ? G.spr.giftLit : G.spr.gift;
      if (this.t < 40 && (this.t >> 1) & 1) img = G.art.flash(img);
      const jx = this.t < 40 ? ((this.t >> 1) & 1 ? 1 : -1) : 0;
      ctx.drawImage(img, Math.round(this.x - 7 + jx) - cx, Math.round(this.y - 14) - cy);
    }
  }
  G.Package = Package;

  // ============================================================== LETTER (boss projectile)
  class Letter extends Ent {
    constructor(x, y, vx, vy, ch) {
      super(x, y);
      Object.assign(this, { vx, vy, ch, life: 240 });
      this.hb = { w: 6, h: 6 };
    }
    update(w) {
      if (G.script.busy) return;
      this.x += this.vx;
      this.y += this.vy;
      if (--this.life <= 0 || w.tileSolid(Math.floor(this.x / 16), Math.floor(this.y / 16))) { this.dead = true; return; }
      const p = G.play.player;
      if (G.overlap([this.x - 3, this.y - 16, this.x + 3, this.y - 8], p.hurtBox())) {
        this.dead = true;
        p.hurt(1, this.x, this.y);
      }
    }
    draw(ctx, cx, cy) {
      G.font.drawBig(ctx, this.ch, Math.round(this.x - 2) - cx, Math.round(this.y - 18) - cy, 1, '#f8d850', '#5a1020');
    }
  }
  G.Letter = Letter;

  // ============================================================== EL EEENGLISH (boss)
  // Dad, brainwashed by Father Eggmas, in a luchador mask (glasses and beard on
  // the outside). Hammer only lands while he's dizzy; packages always stun him.
  let bossSprites = null;
  function bigSprites() {
    if (bossSprites) return bossSprites;
    const S = G.sprites.elenglish;
    bossSprites = { h: S.h * 2 };
    for (const d of ['down', 'up', 'left', 'right']) bossSprites[d] = S[d].map(G.art.scale2);
    return bossSprites;
  }

  class ElEnglish extends Ent {
    constructor(x, y) {
      super(x, y);
      this.enemy = true;
      this.boss = true;
      this.name = 'EL EEENGLISH';
      this.hp = this.maxHp = 12;
      this.hb = { w: 18, h: 8 };
      this.state = 'strut';
      this.t = 70;
      this.dir = 'left';
      this.anim = 0;
      this.next = 'yell';
      this.summoned = false;
      this.hurtT = 0;
      this.kb = { x: 0, y: 0 };
      this.bounces = 0;
      this.supplyT = 90;
    }

    hurtBox() { return [this.x - 11, this.y - 40, this.x + 11, this.y]; }
    get angry() { return this.hp <= this.maxHp / 2; }

    update(w) {
      if (G.script.busy || this.state === 'defeated') return;
      const p = G.play.player;
      const dx = p.x - this.x, dy = p.y - this.y, dist = Math.hypot(dx, dy) || 1;
      this.resupply(w);
      if (this.hurtT > 0) {
        this.hurtT--;
        w.move(this, this.kb.x, 0);
        w.move(this, 0, this.kb.y);
        this.kb.x *= 0.8; this.kb.y *= 0.8;
        return;
      }
      if (!this.summoned && this.angry) this.summon(w);

      if (this.state === 'strut') {
        this.dir = G.dirToward(dx, dy);
        const sp = this.angry ? 0.75 : 0.55;
        w.move(this, (dx / dist) * sp, 0);
        w.move(this, 0, (dy / dist) * sp);
        this.anim++;
        if (--this.t <= 0) {
          this.state = this.next;
          this.next = this.next === 'yell' ? 'windup' : 'yell';
          this.t = this.state === 'yell' ? 56 : 34;
          if (this.state === 'yell') w.pop(this.x, this.y - 54, 'DO YOU SPEAK...', '#ffffff');
        }
      } else if (this.state === 'yell') {
        this.t--;
        if (this.t === 30) { w.pop(this.x, this.y - 46, 'EEENGLISH?!', '#f8d850'); this.fire(w, this.angry ? 12 : 9, 0); }
        if (this.angry && this.t === 8) this.fire(w, 12, Math.PI / 12);
        if (this.t <= 0) { this.state = 'strut'; this.t = 80; }
      } else if (this.state === 'windup') {
        this.dir = G.dirToward(dx, dy);
        if (--this.t <= 0) {
          const sp = this.angry ? 3.4 : 3.0;
          this.state = 'charge';
          this.t = 90;
          this.vx = (dx / dist) * sp;
          this.vy = (dy / dist) * sp;
          this.bounces = this.angry ? 1 : 0;
          G.audio.sfx('dash');
          w.pop(this.x, this.y - 50, ['FLYING ELBOW!', 'BODY SLAM!', 'DROPKICK!'][Math.floor(Math.random() * 3)], '#ffd860');
        }
      } else if (this.state === 'charge') {
        this.anim += 2;
        this.dir = G.dirToward(this.vx, this.vy);
        const h = w.move(this, this.vx, this.vy);
        if (h.hitX || h.hitY) {
          if (this.bounces > 0) {
            this.bounces--;
            const sp = Math.hypot(this.vx, this.vy);
            this.vx = (dx / dist) * sp;
            this.vy = (dy / dist) * sp;
            G.audio.sfx('bump');
            w.pop(this.x, this.y - 50, 'OFF THE ROPES!', '#ffd860');
          } else {
            this.dizzy(100);
            G.audio.sfx('bump');
            G.play.shake(10, 3);
          }
        } else if (--this.t <= 0) {
          this.dizzy(60);
        }
        if (G.overlap(this.hurtBox(), p.hurtBox())) p.hurt(2, this.x, this.y);
      } else if (this.state === 'dizzy') {
        if (--this.t <= 0) { this.state = 'strut'; this.t = 60; }
      }
    }

    dizzy(n) { this.state = 'dizzy'; this.t = n; this.vx = this.vy = 0; }

    fire(w, n, off) {
      const word = 'EEENGLISH';
      G.audio.sfx('yell');
      for (let i = 0; i < n; i++) {
        const a = off + (i / n) * Math.PI * 2;
        w.add(new Letter(this.x, this.y - 4, Math.cos(a) * 1.25, Math.sin(a) * 1.25, word[i % word.length]));
      }
    }

    summon(w) {
      this.summoned = true;
      w.pop(this.x, this.y - 54, 'TAG TEAM!', '#ff9a28');
      G.audio.sfx('bell');
      w.add(new Wrestler(2 * 16 + 8, 2 * 16 + 14, 'red'));
      w.add(new Wrestler(12 * 16 + 8, 8 * 16 + 12, 'blue'));
    }

    // If Nate is out of packages, Pyro Pete tosses one in from the crowd so the
    // fight can always be finished.
    resupply(w) {
      const s = G.state;
      const supplied = (s.items.package || 0) > 0 ||
        w.ents.some((e) => !e.dead && (e instanceof G.Package || (e instanceof G.Pickup && e.kind === 'package')));
      if (supplied) { this.supplyT = 120; return; }
      if (--this.supplyT > 0) return;
      this.supplyT = 300;
      let x, y, tries = 0;
      do {
        x = 32 + Math.random() * 176;
        y = 48 + Math.random() * 80;
      } while (Math.hypot(x - this.x, y - this.y) < 48 && ++tries < 10);
      const pk = w.add(new G.Pickup(x, y, 'package'));
      pk.life = 900;
      w.pop(x, y - 20, 'CATCH, KID!', '#ffa848');
      G.audio.sfx('menu');
    }

    // hammer: only lands while he's dizzy, and can't deliver the final blow
    hit(dmg, sx, sy) {
      if (this.state !== 'dizzy') {
        G.audio.sfx('clank');
        this.world.pop(this.x, this.y - 48, 'BLOCKED!', '#c8c8d0');
        const p = G.play.player, dx = p.x - this.x, dy = p.y - this.y, m = Math.hypot(dx, dy) || 1;
        p.state = 'hurt'; p.t = 8; p.kb = { x: (dx / m) * 2.4, y: (dy / m) * 2.4 };
        return;
      }
      this.damage(1, sx, sy, false);
    }

    // booby-trapped package
    bomb(sx, sy) {
      this.damage(3, sx, sy, true);
      if (this.hp > 0) { this.state = 'dizzy'; this.t = 120; this.world.pop(this.x, this.y - 50, 'WHAT WAS IN THAT?!', '#ffffff'); }
    }

    damage(n, sx, sy, fromBomb) {
      if (!fromBomb && this.hp - n < 1) {
        // last sliver of health: only a package can finish him
        n = this.hp - 1;
        if (!G.state.flags.bossFinishHint) {
          G.state.flags.bossFinishHint = true;
          G.script.run(G.SCRIPTS.finishHint());
        } else {
          this.world.pop(this.x, this.y - 50, 'USE A PACKAGE!', '#ffa848');
        }
      }
      this.hp = Math.max(0, this.hp - n);
      this.hurtT = 12;
      const dx = this.x - sx, dy = this.y - sy, m = Math.hypot(dx, dy) || 1;
      this.kb = { x: (dx / m) * 2, y: (dy / m) * 2 };
      G.audio.sfx('hit');
      if (this.hp <= 0) {
        this.state = 'defeated';
        G.script.run(G.SCRIPTS.dadDefeated(this));
      }
    }

    draw(ctx, cx, cy) {
      const S = bigSprites();
      ctx.drawImage(G.spr.shadowBig, Math.round(this.x - 12) - cx, Math.round(this.y - 4) - cy, 24, 6);
      let frame = 0;
      if (this.state === 'charge') frame = 1 + ((this.anim >> 2) & 1);
      else if (this.state === 'strut') frame = walkFrame(this.anim, true);
      let img = S[this.dir][frame];
      if ((this.hurtT && (this.hurtT >> 1) & 1) || (this.state === 'windup' && (this.t >> 2) & 1)) img = G.art.flash(img);
      const jx = this.state === 'windup' || this.state === 'yell' ? ((G.tick >> 1) & 1 ? 1 : -1) : 0;
      const sx = Math.round(this.x - 16 + jx) - cx, sy = Math.round(this.y - S.h + 4) - cy;
      ctx.drawImage(img, sx, sy);
      if (this.state === 'dizzy') {
        for (let i = 0; i < 4; i++) {
          const a = G.tick * 0.12 + (i * Math.PI) / 2;
          ctx.fillStyle = i % 2 ? '#f8d850' : '#ffffff';
          ctx.fillRect(Math.round(this.x + Math.cos(a) * 11) - cx, Math.round(sy - 4 + Math.sin(a) * 3), 3, 3);
        }
      }
    }
  }
  G.ElEnglish = ElEnglish;

  // ============================================================== LILY'S "NO."
  const NO_FULL = 34;
  class NoShot extends Ent {
    constructor(x, y, dir, weak) {
      super(x, y);
      const [dx, dy] = DIRS[dir];
      const sp = weak ? 1.8 : 3;
      this.vx = dx * sp; this.vy = dy * sp;
      this.life = weak ? 24 : 52;
      this.weak = !!weak;
    }
    update(w) {
      if (G.script.busy) return;
      this.x += this.vx; this.y += this.vy;
      if (--this.life <= 0) { this.dead = true; return; }
      const r = this.weak ? [this.x - 7, this.y - 14, this.x + 7, this.y - 4] : [this.x - 15, this.y - 26, this.x + 15, this.y - 2];
      for (const e of w.ents) {
        if (e.dead || !e.onNo) continue;
        if (G.overlap(r, e.noBox ? e.noBox() : e.hurtBox()) && e.onNo(this)) { this.dead = true; return; }
      }
    }
    draw(ctx, cx, cy) {
      if (this.weak) {
        const t = 'no...', w = G.font.width(t);
        G.font.draw(ctx, t, Math.round(this.x - w / 2) - cx, Math.round(this.y - 14) - cy, '#c8b8d0', { shadow: '#3a2a48' });
        return;
      }
      const t = 'NO.', w = G.font.bigWidth(t, 2);
      G.font.drawBig(ctx, t, Math.round(this.x - w / 2) - cx, Math.round(this.y - 28) - cy, 2, '#ffffff', '#c83878');
    }
  }
  G.NoShot = NoShot;

  // ============================================================== MIKEY'S SERENADE
  // Golden music notes: they sting, but a "No." swats them out of the air.
  class Note extends Ent {
    constructor(x, y, vx, vy) {
      super(x, y);
      Object.assign(this, { vx, vy, life: 260 });
    }
    hurtBox() { return [this.x - 4, this.y - 12, this.x + 4, this.y - 2]; }
    onNo() { this.dead = true; this.world.burst(this.x, this.y - 6, ['#f8d040', '#ffffff'], 4); return false; }
    update(w) {
      if (G.script.busy) return;
      this.x += this.vx; this.y += this.vy;
      if (--this.life <= 0 || w.tileSolid(Math.floor(this.x / 16), Math.floor((this.y - 6) / 16))) { this.dead = true; return; }
      const p = G.play.player;
      if (G.overlap(this.hurtBox(), p.hurtBox())) { this.dead = true; p.hurt(1, this.x, this.y); }
    }
    draw(ctx, cx, cy) {
      ctx.drawImage(G.spr.note, Math.round(this.x - 4) - cx, Math.round(this.y - 12 + Math.sin((this.life + this.x) / 6) * 1.5) - cy);
    }
  }
  G.Note = Note;

  // A heart balloon that drifts after Lily and pops in her face.
  class HeartShot extends Ent {
    constructor(x, y) {
      super(x, y);
      this.life = 420;
      this.vx = 0; this.vy = -0.4;
      this.col = Math.random() < 0.5 ? 'heartRed' : 'heartPink';
    }
    hurtBox() { return [this.x - 6, this.y - 16, this.x + 6, this.y - 2]; }
    onNo() { this.pop(); return false; }
    pop() {
      this.dead = true;
      G.audio.sfx('poof');
      this.world.burst(this.x, this.y - 10, ['#e83848', '#f080b0', '#ffffff'], 8, { speed: 1.2, life: 18 });
      this.world.pop(this.x, this.y - 22, 'POP!', '#ff98d0');
    }
    update(w) {
      if (G.script.busy) return;
      const p = G.play.player, dx = p.x - this.x, dy = p.y - this.y, d = Math.hypot(dx, dy) || 1;
      this.vx += (dx / d) * 0.02; this.vy += (dy / d) * 0.02;
      const sp = Math.hypot(this.vx, this.vy);
      if (sp > 0.7) { this.vx *= 0.7 / sp; this.vy *= 0.7 / sp; }
      this.x += this.vx; this.y += this.vy;
      if (--this.life <= 0) { this.pop(); return; }
      if (G.overlap(this.hurtBox(), p.hurtBox())) { this.pop(); p.hurt(1, this.x, this.y); }
    }
    draw(ctx, cx, cy) {
      const bob = Math.round(Math.sin(this.life / 10) * 1.5);
      ctx.drawImage(G.spr[this.col], Math.round(this.x - 6) - cx, Math.round(this.y - 18 + bob) - cy);
    }
  }
  G.HeartShot = HeartShot;

  // ============================================================== MIKEY (miniboss)
  // Three heart balloons orbit him and soak up Lily's "No."s. Pop them all and
  // he's wide open; at half health the golden hour kicks in.
  // Mikey's song: golden hour (lyrics added by the user), sung until she beats him.
  const MIKEY_SONG = [
      '~ It was just two lovers ~', '~ Sittin\' in the car, listening to Blonde ~',
      '~ Fallin\' for each other ~', '~ Pink and orange skies, feelin\' super childish ~',
      '~ No Donald Glover ~', '~ Missed call from my mother ~',
      '~ Like, "Where you at tonight?" Got no alibi ~', '~ I was all alone with the love of my life ~',
      '~ She\'s got glitter for skin ~', '~ My radiant beam in the night ~',
      '~ I don\'t need no light to see you ~', '~ SHINE! ~',
      '~ It\'s your golden hour (oh) ~', '~ You slow down time ~',
      '~ In your golden hour (oh) ~', '~ WE WERE JUST TWO LOVERS! ~',
      '~ Feet up on the dash, drivin\' nowhere fast ~', '~ Burnin\' through the summer ~',
      '~ Radio on blast, make the moment last ~', '~ She got solar power ~',
      '~ Minutes feel like hours ~', '~ She knew she was the baddest, can you even imagine ~',
      '~ Fallin\' like I did? ~', '~ FOR THE LOVE OF MY LIFE! ~',
      '~ She\'s got glow on her face ~', '~ A glorious look in her eyes ~',
      '~ My angel of light ~', '~ I was all alone with the love of my life ~',
      '~ She\'s got glitter for skin ~', '~ My radiant beam in the night ~',
      '~ I don\'t need no light to see you ~', '~ SHINE! ~',
      '~ It\'s your golden hour (oh) ~', '~ You slow down time ~',
      '~ In your golden hour (oh) ~',
  ];
  const MIKEY_MAYBE = ['WAS THAT A MAYBE?', 'I HEARD "MAYBE"!', 'SO... A YES?', 'SHE\'S WARMING UP!'];
  const MIKEY_OUCH = ['OOF.', 'BUT THE SONG...', 'NOT EVEN A MAYBE?', 'OUCH.', 'I PRACTICED!'];
  class MikeyBoss extends Ent {
    constructor(x, y) {
      super(x, y);
      this.enemy = true;
      this.boss = true;
      this.name = 'MIKEY';
      this.hp = this.maxHp = 6;
      this.hb = { w: 12, h: 8 };
      this.state = 'stroll';
      this.t = 80;
      this.dir = 'left';
      this.anim = 0;
      this.shield = 3;
      this.spin = 0;
      this.hurtT = 0;
      this.kb = { x: 0, y: 0 };
      this.cycle = 0;
      this.hitsOpen = 0;
    }
    get S() { return G.sprites.mikey; }
    get golden() { return this.hp <= this.maxHp / 2; }
    hurtBox() { return [this.x - 7, this.y - 22, this.x + 7, this.y]; }
    noBox() { return this.shield > 0 ? [this.x - 20, this.y - 46, this.x + 20, this.y + 2] : [this.x - 11, this.y - 28, this.x + 11, this.y + 3]; }
    balloonPos(i) {
      const a = this.spin + (i * Math.PI * 2) / 3;
      return [this.x + Math.cos(a) * 15, this.y - 30 + Math.sin(a) * 5];
    }
    hit() { G.audio.sfx('bump'); }

    onNo(shot) {
      if (this.state === 'defeated') return false;
      const w = this.world;
      if (shot.weak) {
        // a mumbled no is basically a yes, as far as Mikey is concerned
        w.pop(this.x, this.y - 44, MIKEY_MAYBE[this.maybe = ((this.maybe || 0) + 1) % MIKEY_MAYBE.length], '#ff98d0');
        G.audio.sfx('heart');
        return true;
      }
      if (this.shield > 0) {
        this.shield--;
        const [bx, by] = this.balloonPos(this.shield);
        G.audio.sfx('poof');
        w.burst(bx, by, ['#e83848', '#f080b0', '#ffffff'], 10, { speed: 1.3, life: 20 });
        w.pop(bx, by - 8, 'POP!', '#ff98d0');
        if (this.shield === 0) {
          this.state = 'open';
          this.t = 210;
          this.hitsOpen = 0;
          w.pop(this.x, this.y - 34, 'MY BALLOONS!', '#ffffff');
        }
        return true;
      }
      this.hp--;
      this.hurtT = 14;
      const dx = this.x - shot.x, dy = this.y - shot.y, m = Math.hypot(dx, dy) || 1;
      this.kb = { x: (dx / m) * 2.2, y: (dy / m) * 2.2 };
      G.audio.sfx('hit');
      w.pop(this.x, this.y - 34, MIKEY_OUCH[(this.maxHp - this.hp) % MIKEY_OUCH.length], '#f8f8f0');
      if (this.hp <= 0) {
        this.state = 'defeated';
        G.script.run(G.SCRIPTS.mikeyDefeated(this));
      } else if (++this.hitsOpen >= 3) {
        this.t = Math.min(this.t, 10);
      }
      return true;
    }

    update(w) {
      if (G.script.busy || this.state === 'defeated') return;
      this.spin += this.golden ? 0.07 : 0.05;
      // he never stops singing
      this.songT = (this.songT || 0) + 1;
      if (this.songT % 80 === 1) {
        this.verse = ((this.verse == null ? -1 : this.verse) + 1) % MIKEY_SONG.length;
        w.pop(this.x, this.y - 52, MIKEY_SONG[this.verse], this.golden ? '#ffb848' : '#f8d850');
      }
      const p = G.play.player;
      const dx = p.x - this.x, dy = p.y - this.y, dist = Math.hypot(dx, dy) || 1;
      if (this.hurtT > 0) {
        this.hurtT--;
        w.move(this, this.kb.x, 0); w.move(this, 0, this.kb.y);
        this.kb.x *= 0.8; this.kb.y *= 0.8;
        return;
      }
      if (this.state !== 'open' && G.overlap(this.hurtBox(), p.hurtBox())) p.hurt(1, this.x, this.y);

      if (this.state === 'stroll') {
        // keep a polite serenading distance from Lily
        this.dir = G.dirToward(dx, dy);
        const want = dist > 84 ? 1 : dist < 56 ? -1 : 0;
        const side = Math.sin(this.spin * 0.7);
        w.move(this, (dx / dist) * 0.5 * want - (dy / dist) * 0.45 * side, 0);
        w.move(this, 0, (dy / dist) * 0.5 * want + (dx / dist) * 0.45 * side);
        this.anim++;
        if (--this.t <= 0) {
          const moves = this.golden ? ['sing', 'hearts', 'golden', 'dash'] : ['sing', 'hearts', 'sing', 'dash'];
          this.state = moves[this.cycle++ % moves.length];
          this.t = { sing: 70, hearts: 40, golden: 90, dash: 36 }[this.state];
          if (this.state === 'golden') G.audio.sfx('bell');
          if (this.state === 'dash') w.pop(this.x, this.y - 40, 'LILY, WAIT!', '#ffffff');
        }
      } else if (this.state === 'sing') {
        this.dir = G.dirToward(dx, dy);
        if (this.t % 18 === 0) {
          const n = this.golden ? 5 : 3, base = Math.atan2(dy, dx);
          for (let i = 0; i < n; i++) {
            const a = base + (i - (n - 1) / 2) * 0.32;
            w.add(new Note(this.x, this.y - 6, Math.cos(a) * 1.2, Math.sin(a) * 1.2));
          }
          G.audio.sfx('blip');
        }
        if (--this.t <= 0) { this.state = 'stroll'; this.t = 70; }
      } else if (this.state === 'hearts') {
        if (this.t === 30 || (this.golden && this.t === 10)) {
          w.add(new HeartShot(this.x - 10, this.y - 20));
          w.add(new HeartShot(this.x + 10, this.y - 20));
          G.audio.sfx('heart');
        }
        if (--this.t <= 0) { this.state = 'stroll'; this.t = 80; }
      } else if (this.state === 'golden') {
        if (this.t === 70 || this.t === 35) {
          const off = this.t === 35 ? Math.PI / 12 : 0;
          for (let i = 0; i < 12; i++) {
            const a = off + (i / 12) * Math.PI * 2;
            w.add(new Note(this.x, this.y - 6, Math.cos(a) * 1.05, Math.sin(a) * 1.05));
          }
        }
        if (--this.t <= 0) { this.state = 'stroll'; this.t = 70; }
      } else if (this.state === 'dash') {
        if (this.t > 20) { this.dir = G.dirToward(dx, dy); this.vx = (dx / dist) * 2.6; this.vy = (dy / dist) * 2.6; this.t--; return; }
        this.anim += 2;
        const h = w.move(this, this.vx, this.vy);
        if (h.hitX || h.hitY || --this.t <= 0) { this.state = 'stroll'; this.t = 60; if (h.hitX || h.hitY) G.audio.sfx('bump'); }
      } else if (this.state === 'open') {
        // no balloons: he just stands there, crushed, until he blows up more
        if (--this.t <= 0) {
          this.shield = 3;
          this.state = 'stroll';
          this.t = 50;
          w.pop(this.x, this.y - 40, 'I BROUGHT MORE BALLOONS!', '#ff98d0');
          G.audio.sfx('heart');
        }
      }
    }

    draw(ctx, cx, cy) {
      const S = this.S;
      drawShadow(ctx, this.x, this.y, cx, cy);
      const moving = this.state === 'stroll' || this.state === 'dash';
      let img = S[this.dir][walkFrame(this.anim, moving)];
      if (this.hurtT && (this.hurtT >> 1) & 1) img = G.art.flash(img);
      const sx = Math.round(this.x - 8) - cx, sy = Math.round(this.y - S.h + 2) - cy;
      const back = [], front = [];
      for (let i = 0; i < this.shield; i++) (Math.sin(this.spin + (i * Math.PI * 2) / 3) < 0 ? back : front).push(i);
      const balloon = (i) => {
        const [bx, by] = this.balloonPos(i);
        drawString(ctx, Math.round(bx) - cx, Math.round(by + 8) - cy, sx + 13, sy + 15);
        ctx.drawImage(G.spr[i === 1 ? 'heartPink' : 'heartRed'], Math.round(bx - 6) - cx, Math.round(by - 4) - cy);
      };
      back.forEach(balloon);
      ctx.drawImage(img, sx, sy);
      ctx.drawImage(G.spr.bouquet, Math.round(this.x - G.spr.bouquet.width / 2) - cx, sy + 8);
      front.forEach(balloon);
      if (this.state === 'open') {
        ctx.fillStyle = '#78c8ff';
        const ty = (G.tick >> 2) % 6;
        ctx.fillRect(sx + 4, sy + 7 + ty, 1, 2); ctx.fillRect(sx + 11, sy + 7 + ((ty + 3) % 6), 1, 2);
      }
    }
  }
  G.MikeyBoss = MikeyBoss;

  // ============================================================== HOME CRITTERS
  // Shared enemy plumbing for the home area: knockback, hurt flash, the Peace
  // halo, contact damage, a one-time "what IS that" line, and a poof (plus a
  // maybe-drop) when they go down. Subclasses supply think() and draw().
  class Critter extends Ent {
    constructor(x, y, hp) {
      super(x, y);
      this.enemy = true;
      this.hp = hp;
      this.t = Math.floor(Math.random() * 100);
      this.hurtT = 0;
      this.kb = { x: 0, y: 0 };
      this.calm = 0;
      this.vx = 0; this.vy = 0;
      this.wt = 0;
    }
    hurtBox() { return [this.x - 7, this.y - 15, this.x + 7, this.y]; }
    update(w) {
      if (G.script.busy) return;
      this.t++;
      if (this.hurtT > 0) {
        this.hurtT--;
        w.move(this, this.kb.x, 0); w.move(this, 0, this.kb.y);
        this.kb.x *= 0.85; this.kb.y *= 0.85;
        return;
      }
      if (this.calm > 0) { this.calm--; return; }
      const p = G.play.player, dx = p.x - this.x, dy = p.y - this.y, dist = Math.hypot(dx, dy) || 1;
      if (this.intro && dist < 90) G.SCRIPTS.critterIntro(this.intro);
      this.think(w, p, dx, dy, dist);
      if (this.touch !== false && G.overlap(this.hurtBox(), p.hurtBox())) p.hurt(this.dmg || 1, this.x, this.y);
    }
    step(w) {
      const h1 = w.move(this, this.vx, 0), h2 = w.move(this, 0, this.vy);
      if (h1.hitX) this.vx = -this.vx;
      if (h2.hitY) this.vy = -this.vy;
    }
    wander(w, sp) {
      if (--this.wt <= 0) {
        const a = Math.random() * Math.PI * 2, go = Math.random() < 0.7;
        this.vx = go ? Math.cos(a) * sp : 0; this.vy = go ? Math.sin(a) * sp : 0;
        this.wt = 40 + Math.random() * 80;
      }
      this.step(w);
    }
    chase(w, dx, dy, dist, sp) { this.vx = (dx / dist) * sp; this.vy = (dy / dist) * sp; this.step(w); }
    hit(dmg, sx, sy) {
      this.hp -= dmg;
      this.hurtT = 14;
      this.calm = 0;
      const dx = this.x - sx, dy = this.y - sy, m = Math.hypot(dx, dy) || 1, k = this.rooted ? 0 : this.heavy ? 1.2 : 3;
      this.kb = { x: (dx / m) * k, y: (dy / m) * k };
      G.audio.sfx('hit');
      if (this.hp <= 0) this.die();
    }
    die() {
      this.dead = true;
      G.audio.sfx('poof');
      this.world.burst(this.x, this.y - 8, this.bits || ['#ffffff', '#e8e0f0'], 12, { speed: 1.2, life: 22, size: 3 });
      G.play.maybeDrop(this.x, this.y, this.dropChance || 0.6);
    }
    drawSprite(ctx, cx, cy, img, lift = 0) {
      drawShadow(ctx, this.x, this.y, cx, cy, this.bigShadow);
      if (this.hurtT && (this.hurtT >> 1) & 1) img = G.art.flash(img);
      ctx.drawImage(img, Math.round(this.x - img.width / 2) - cx, Math.round(this.y - img.height + 1 - lift) - cy);
      if (this.calm > 0) drawHalo(ctx, this.x - cx, this.y - img.height - 4 - lift - cy);
    }
  }
  G.Critter = Critter;

  // Anything an enemy spits or pours: flies straight, stings on contact.
  class Shot extends Ent {
    constructor(x, y, vx, vy, img, o = {}) {
      super(x, y);
      Object.assign(this, { vx, vy, img, life: o.life || 150, dmg: o.dmg || 1, z: o.z || 7 });
    }
    update(w) {
      if (G.script.busy) return;
      this.x += this.vx; this.y += this.vy;
      if (--this.life <= 0 || w.tileSolid(Math.floor(this.x / 16), Math.floor(this.y / 16))) { this.dead = true; return; }
      const p = G.play.player;
      if (G.overlap([this.x - 3, this.y - 8, this.x + 3, this.y], p.hurtBox())) { this.dead = true; p.hurt(this.dmg, this.x, this.y); }
    }
    draw(ctx, cx, cy) {
      ctx.drawImage(this.img, Math.round(this.x - this.img.width / 2) - cx, Math.round(this.y - this.z - this.img.height / 2) - cy);
    }
  }
  G.Shot = Shot;

  // Corn on the cob: hops after Nate and spits kernels.
  class Corncob extends Critter {
    constructor(x, y) {
      super(x, y, 2);
      this.intro = 'corn';
      this.bits = ['#f8d848', '#ffffff', '#f8f0c0', '#5aa040'];
      this.fireT = 60 + Math.random() * 60;
    }
    think(w, p, dx, dy, dist) {
      if (dist > 84) { this.wander(w, 0.3); return; }
      this.chase(w, dx, dy, dist, 0.45);
      if (--this.fireT <= 0) {
        this.fireT = 110;
        const a = Math.atan2(dy, dx);
        for (const o of [-0.32, 0, 0.32]) w.add(new Shot(this.x, this.y - 2, Math.cos(a + o) * 1.4, Math.sin(a + o) * 1.4, G.spr.kernel));
        G.audio.sfx('blip');
      }
    }
    die() { super.die(); this.world.pop(this.x, this.y - 22, 'POP!', '#f8e070'); }
    draw(ctx, cx, cy) {
      const hop = this.hurtT || this.calm ? 0 : Math.abs(Math.sin(this.t * 0.2)) * 3;
      this.drawSprite(ctx, cx, cy, G.spr.corncob[hop > 2 ? 1 : 0], hop);
    }
  }
  G.Corncob = Corncob;

  // A cereal box: shuffles around, and when Nate lines up with it, it tips
  // over and pours a stream of cereal at him.
  class CerealBox extends Critter {
    constructor(x, y) {
      super(x, y, 3);
      this.intro = 'cereal';
      this.bits = ['#e83848', '#f8d040', '#58c048', '#3878d8', '#f8f8f0'];
      this.pourT = 0;
      this.cool = 40;
    }
    think(w, p, dx, dy, dist) {
      if (this.pourT > 0) {
        if (--this.pourT % 7 === 0) {
          const [ux, uy] = DIRS[this.pourDir];
          const jit = () => (Math.random() - 0.5) * 0.5;
          w.add(new Shot(this.x + ux * 6, this.y + uy * 4, ux * 1.8 + (uy ? jit() : 0), uy * 1.8 + (ux ? jit() : 0), G.spr.rings[(this.pourT / 7) % 4 | 0], { life: 100 }));
          G.audio.sfx('blip');
        }
        return;
      }
      if (this.cool > 0) this.cool--;
      if (dist < 110 && this.cool <= 0 && (Math.abs(dx) < 10 || Math.abs(dy) < 10)) {
        this.pourDir = G.dirToward(dx, dy);
        this.pourT = 43;
        this.cool = 120;
        return;
      }
      if (dist < 110) this.chase(w, dx, dy, dist, 0.3); else this.wander(w, 0.25);
    }
    draw(ctx, cx, cy) {
      this.drawSprite(ctx, cx, cy, this.pourT > 0 ? G.spr.cereal[2] : G.spr.cereal[Math.floor(this.t / 16) % 2]);
    }
  }
  G.CerealBox = CerealBox;

  // One of Nate's own fireworks. Gets close and the fuse lights; then it
  // rockets at Nate and bursts. A bonk before launch defuses it.
  class Firework extends Critter {
    constructor(x, y) {
      super(x, y, 1);
      this.intro = 'firework';
      this.touch = false;
      this.state = 'idle';
      this.bits = ['#e83848', '#f8d040', '#ffffff'];
    }
    think(w, p, dx, dy, dist) {
      if (this.state === 'idle') { if (dist < 88) { this.state = 'lit'; this.ft = 54; } return; }
      if (this.state === 'lit') {
        if (this.ft % 8 === 0) G.audio.sfx('fuse');
        if (this.ft % 3 === 0) w.burst(this.x - 4, this.y - 9, ['#f8d040', '#ffffff', '#f8a028'], 1, { speed: 0.7, life: 8, size: 1 });
        if (--this.ft <= 0) {
          this.state = 'fly';
          this.ft = 70;
          this.vx = (dx / dist) * 2.3; this.vy = (dy / dist) * 2.3;
          G.audio.sfx('dash');
        }
        return;
      }
      this.x += this.vx; this.y += this.vy;
      w.burst(this.x - this.vx * 3, this.y - 10 - this.vy * 3, ['#f8a028', '#f8d040', '#8a8a94'], 1, { speed: 0.3, life: 14, size: 2 });
      const wall = w.tileSolid(Math.floor(this.x / 16), Math.floor(this.y / 16));
      if (--this.ft <= 0 || wall || G.overlap(this.hurtBox(), p.hurtBox())) this.explode(w, p);
    }
    explode(w, p) {
      this.dead = true;
      G.audio.sfx('boom');
      G.play.shake(8, 2);
      w.burst(this.x, this.y - 10, ['#e83848', '#f8d040', '#58c0f8', '#c858e8', '#ffffff'], 22, { speed: 2, life: 30, size: 2 });
      w.pop(this.x, this.y - 26, 'BOOM!', '#f8d040');
      if (Math.hypot(p.x - this.x, p.y - this.y) < 24) p.hurt(1, this.x, this.y);
    }
    hit() {
      if (this.dead) return;
      this.dead = true;
      G.audio.sfx('clank');
      this.world.pop(this.x, this.y - 26, this.state === 'idle' ? 'BONK!' : 'DEFUSED!', '#c8c8d0');
      this.world.burst(this.x, this.y - 10, this.bits, 8, { speed: 1, life: 18, size: 2 });
      G.play.maybeDrop(this.x, this.y, 0.6);
    }
    draw(ctx, cx, cy) {
      const img = G.spr.rocket[this.state === 'idle' ? 0 : 1];
      if (this.state !== 'fly') { this.drawSprite(ctx, cx, cy, img, this.state === 'lit' ? (G.tick >> 1) & 1 : 0); return; }
      ctx.save();
      ctx.translate(Math.round(this.x) - cx, Math.round(this.y - 10) - cy);
      ctx.rotate(Math.atan2(this.vy, this.vx) + Math.PI / 2);
      ctx.drawImage(img, -5, -13);
      ctx.restore();
    }
  }
  G.Firework = Firework;

  // Snapdragon: rooted in place, bites anything that gets close and spits pollen.
  class Snapdragon extends Critter {
    constructor(x, y) {
      super(x, y, 2);
      this.intro = 'flower';
      this.rooted = true;
      this.bits = ['#e83878', '#f8a0c8', '#58a840'];
      this.cool = 50 + Math.random() * 60;
      this.snapT = 0;
      this.face = 'right';
    }
    think(w, p, dx, dy, dist) {
      this.face = dx < 0 ? 'left' : 'right';
      if (this.snapT > 0) this.snapT--;
      if (dist < 26 && this.snapT <= 0) { this.snapT = 24; G.audio.sfx('swing'); }
      if (dist < 100 && --this.cool <= 0) {
        this.cool = 100;
        this.snapT = 12;
        w.add(new Shot(this.x, this.y - 2, (dx / dist) * 1.3, (dy / dist) * 1.3, G.spr.pollen, { life: 120, z: 12 }));
        G.audio.sfx('blip');
      }
    }
    draw(ctx, cx, cy) {
      const set = this.face === 'left' ? G.spr.snapdragonL : G.spr.snapdragon;
      this.drawSprite(ctx, cx, cy, set[this.snapT > 0 ? 1 : 0]);
    }
  }
  G.Snapdragon = Snapdragon;

  // The bear. Roams its patch of woods, growls, then charges. Wins? It just
  // lumbers back into the woods (nobody hurts the bear).
  class Bear extends Critter {
    constructor(x, y) {
      super(x, y, 8);
      this.intro = 'bear';
      this.heavy = true;
      this.bigShadow = true;
      this.dmg = 2;
      this.hb = { w: 20, h: 8 };
      this.home = { x, y };
      this.state = 'roam';
      this.face = 'right';
    }
    hurtBox() { return [this.x - 13, this.y - 20, this.x + 13, this.y]; }
    update(w) {
      if (this.fled) {
        if (G.script.busy) return;
        this.x += this.vx; this.y += this.vy; this.t++;
        if (--this.st <= 0) this.dead = true;
        return;
      }
      super.update(w);
    }
    think(w, p, dx, dy, dist) {
      if (this.state === 'roam') {
        const hx = this.x - this.home.x, hy = this.y - this.home.y, hd = Math.hypot(hx, hy) || 1;
        if (hd > 72) { this.vx = (-hx / hd) * 0.4; this.vy = (-hy / hd) * 0.4; this.step(w); } else this.wander(w, 0.35);
        if (dist < 96) { this.state = 'growl'; this.st = 44; w.pop(this.x, this.y - 32, 'GRRRR!', '#c8a080'); G.audio.sfx('yell'); }
      } else if (this.state === 'growl') {
        this.vx = this.vy = 0;
        this.face = dx < 0 ? 'left' : 'right';
        if (--this.st <= 0) { this.state = 'charge'; this.st = 70; this.vx = (dx / dist) * 2.5; this.vy = (dy / dist) * 2.5; G.audio.sfx('dash'); }
      } else if (this.state === 'charge') {
        const h1 = w.move(this, this.vx, 0), h2 = w.move(this, 0, this.vy);
        if (h1.hitX || h2.hitY) { this.state = 'dazed'; this.st = 80; G.audio.sfx('bump'); G.play.shake(8, 2); }
        else if (--this.st <= 0) { this.state = 'rest'; this.st = 70; }
      } else if (--this.st <= 0) {
        this.state = 'roam';
      }
      if (this.vx) this.face = this.vx < 0 ? 'left' : 'right';
    }
    die() {
      // it doesn't go poof; it just leaves
      this.fled = true;
      this.enemy = false;
      this.touch = false;
      this.st = 120;
      const p = G.play.player, dx = this.x - p.x, dy = this.y - p.y, m = Math.hypot(dx, dy) || 1;
      this.vx = (dx / m) * 2; this.vy = (dy / m) * 2;
      this.face = this.vx < 0 ? 'left' : 'right';
      this.world.pop(this.x, this.y - 34, 'HMPH.', '#c8a080');
      G.audio.sfx('poof');
      for (let i = 0; i < 3; i++) this.world.add(new Pickup(this.x + (i - 1) * 10, this.y + 4, 'tooth5'));
    }
    draw(ctx, cx, cy) {
      const set = this.face === 'left' ? G.spr.bearL : G.spr.bear;
      const moving = this.fled || this.state === 'charge' || (this.state === 'roam' && (this.vx || this.vy));
      const frame = moving ? Math.floor(this.t / (this.state === 'charge' || this.fled ? 5 : 10)) % 2 : 0;
      if (this.fled) ctx.globalAlpha = Math.min(1, this.st / 40);
      this.drawSprite(ctx, cx, cy, set[frame]);
      ctx.globalAlpha = 1;
      if (this.state === 'dazed') {
        for (let i = 0; i < 3; i++) {
          const a = G.tick * 0.12 + (i * Math.PI * 2) / 3;
          ctx.fillStyle = i % 2 ? '#f8d850' : '#ffffff';
          ctx.fillRect(Math.round(this.x + Math.cos(a) * 10) - cx, Math.round(this.y - 26 + Math.sin(a) * 3) - cy, 2, 2);
        }
      }
    }
  }
  G.Bear = Bear;

  // Birdhouse gourd: wobbles after Nate. Crack it and the sparrow inside comes out swinging.
  class Gourd extends Critter {
    constructor(x, y) {
      super(x, y, 2);
      this.intro = 'gourd';
      this.bits = ['#c8a060', '#8a6a3a', '#f0d8a0'];
    }
    think(w, p, dx, dy, dist) {
      if (dist < 72) {
        this.chase(w, dx, dy, dist, 0.5);
        if (this.t % 40 === 0) G.audio.sfx('fuse');
      } else this.wander(w, 0.25);
    }
    die() {
      super.die();
      this.world.pop(this.x, this.y - 22, 'CRACK!', '#e8d8a0');
      this.world.add(new Bird(this.x, this.y - 6));
    }
    draw(ctx, cx, cy) {
      const wob = this.hurtT || this.calm ? 0 : Math.floor(this.t / 9) % 2;
      this.drawSprite(ctx, cx, cy, G.spr.gourd[wob]);
    }
  }
  G.Gourd = Gourd;

  // The sparrow: swoops at Nate once or twice, then flies off.
  class Bird extends Critter {
    constructor(x, y) {
      super(x, y, 1);
      this.life = 220;
      this.dropChance = 0.3;
      this.bits = ['#8a5a3a', '#e8d8b0'];
      this.vy = -1.2;
    }
    hurtBox() { return [this.x - 6, this.y - 22, this.x + 6, this.y - 6]; }
    update(w) {
      if (G.script.busy) return;
      this.t++;
      if (this.hurtT > 0) this.hurtT--;
      const p = G.play.player;
      if (this.leaving || --this.life <= 0) {
        this.leaving = true;
        this.x += this.vx; this.y -= 1.8;
        if (this.y < G.play.cam.y - 40) this.dead = true;
        return;
      }
      const dx = p.x - this.x, dy = p.y - this.y, d = Math.hypot(dx, dy) || 1;
      this.vx += (dx / d) * 0.09; this.vy += (dy / d) * 0.09;
      const sp = Math.hypot(this.vx, this.vy);
      if (sp > 1.7) { this.vx *= 1.7 / sp; this.vy *= 1.7 / sp; }
      this.x += this.vx; this.y += this.vy;
      if (G.overlap(this.hurtBox(), p.hurtBox())) { p.hurt(1, this.x, this.y); this.leaving = true; this.vx = dx > 0 ? -1.4 : 1.4; }
    }
    draw(ctx, cx, cy) {
      const set = this.vx < 0 ? G.spr.birdL : G.spr.bird;
      let img = set[(this.t >> 2) & 1];
      if (this.hurtT && (this.hurtT >> 1) & 1) img = G.art.flash(img);
      ctx.drawImage(G.spr.shadow, Math.round(this.x - 6) - cx, Math.round(this.y - 3) - cy);
      ctx.drawImage(img, Math.round(this.x - 6) - cx, Math.round(this.y - 20) - cy);
    }
  }
  G.Bird = Bird;

  // A plain sprite on the ground (used in cutscenes).
  class Thing extends Ent {
    constructor(x, y, img) { super(x, y); this.img = img; }
    draw(ctx, cx, cy) { if (this.img) ctx.drawImage(this.img, Math.round(this.x - this.img.width / 2) - cx, Math.round(this.y - this.img.height) - cy); }
  }
  G.Thing = Thing;


  // ============================================================== THE CHICKEN (egg launcher)
  class EggShot extends Ent {
    constructor(x, y, dir) {
      super(x, y);
      const [dx, dy] = DIRS[dir];
      this.vx = dx * 3.2; this.vy = dy * 3.2;
      this.life = 55;
    }
    splat(w) {
      this.dead = true;
      w.burst(this.x, this.y - 8, ['#f8f4e8', '#f8d040', '#ffffff'], 8, { speed: 1.1, life: 18, size: 2 });
      w.pop(this.x, this.y - 18, 'SPLAT!', '#f8e070');
    }
    update(w) {
      if (G.script.busy) return;
      this.x += this.vx; this.y += this.vy;
      if (--this.life <= 0) { this.dead = true; return; }
      if (w.tileSolid(Math.floor(this.x / 16), Math.floor(this.y / 16))) { this.splat(w); return; }
      const r = [this.x - 4, this.y - 12, this.x + 4, this.y - 2];
      for (const t of w.ents) {
        if (t.dead || !t.enemy || !t.hurtBox) continue;
        if (G.overlap(r, t.hurtBox())) { t.hit(1, this.x - this.vx * 4, this.y - this.vy * 4); this.splat(w); return; }
      }
    }
    draw(ctx, cx, cy) {
      ctx.drawImage(G.spr.egg, Math.round(this.x - 3) - cx, Math.round(this.y - 12) - cy);
    }
  }
  G.EggShot = EggShot;

  // ============================================================== THE GLOBGLOGABGALAB (boss)
  // Lives in the basement, eats Michelle's books, and never stops dancing.
  class BookShot extends Ent {
    constructor(x, y, vx, vy) { super(x, y); Object.assign(this, { vx, vy, life: 200 }); }
    hurtBox() { return [this.x - 5, this.y - 14, this.x + 5, this.y - 4]; }
    update(w) {
      if (G.script.busy) return;
      this.x += this.vx; this.y += this.vy;
      if (--this.life <= 0 || w.tileSolid(Math.floor(this.x / 16), Math.floor(this.y / 16))) { this.dead = true; return; }
      const p = G.play.player;
      if (G.overlap(this.hurtBox(), p.hurtBox())) { this.dead = true; p.hurt(1, this.x, this.y); }
    }
    draw(ctx, cx, cy) {
      ctx.drawImage(G.spr.flyingBook[(this.life >> 2) & 1], Math.round(this.x - 7) - cx, Math.round(this.y - 16) - cy);
    }
  }
  G.BookShot = BookShot;

  class Globglog extends Ent {
    constructor(x, y) {
      super(x, y);
      this.enemy = true;
      this.boss = true;
      this.name = 'THE GLOBGLOGABGALAB';
      this.hp = this.maxHp = 14;
      this.hb = { w: 24, h: 8 };
      this.home = { x, y };
      this.t = 0;
      this.state = 'dance';
      this.st = 120;
      this.hurtT = 0;
      this.kb = { x: 0, y: 0 };
      this.cycle = 0;
    }
    hurtBox() { return [this.x - 13, this.y - 40, this.x + 13, this.y]; }
    get angry() { return this.hp <= this.maxHp / 2; }
    update(w) {
      if (G.script.busy || this.state === 'defeated') return;
      this.t++;
      const p = G.play.player, dx = p.x - this.x, dy = p.y - this.y, dist = Math.hypot(dx, dy) || 1;
      if (this.hurtT > 0) {
        this.hurtT--;
        w.move(this, this.kb.x, 0); w.move(this, 0, this.kb.y);
        this.kb.x *= 0.8; this.kb.y *= 0.8;
      }
      if (G.overlap(this.hurtBox(), p.hurtBox())) p.hurt(1, this.x, this.y);
      if (this.state === 'dance') {
        // a lopsided little waltz around the middle of the room
        const sp = this.angry ? 0.034 : 0.024;
        const tx = this.home.x + Math.sin(this.t * sp) * 72, ty = this.home.y + Math.sin(this.t * sp * 2) * 26;
        w.move(this, (tx - this.x) * 0.06, 0); w.move(this, 0, (ty - this.y) * 0.06);
        if (this.t % 40 === 0) w.pop(this.x + (Math.random() * 30 - 15), this.y - 52, ['~ hmm hmm ~', 'MMMM. BOOKS.', '*twirl*', '~ doo dee doo ~'][Math.floor(Math.random() * 4)], '#f8a8c8');
        if (--this.st <= 0) {
          const moves = this.angry ? ['toss', 'storm', 'toss', 'shimmy'] : ['toss', 'toss', 'storm'];
          this.state = moves[this.cycle++ % moves.length];
          // no earplugs? his twirls get the song stuck in Nate's head (controls flip)
          if ((this.state === 'storm' || this.state === 'shimmy') && !G.state.items.earplugs) {
            G.play.earworm = 170;
            w.pop(p.x, p.y - 30, 'SONG STUCK IN HEAD!', '#f8a8c8');
          }
          this.st = { toss: 60, storm: 90, shimmy: 60 }[this.state];
        }
      } else if (this.state === 'toss') {
        // flings books at Nate in a fan
        if (this.st % 20 === 0) {
          const a = Math.atan2(dy, dx), n = this.angry ? 5 : 3;
          for (let i = 0; i < n; i++) { const b = a + (i - (n - 1) / 2) * 0.28; w.add(new BookShot(this.x, this.y - 10, Math.cos(b) * 1.5, Math.sin(b) * 1.5)); }
          G.audio.sfx('swing');
        }
        if (--this.st <= 0) { this.state = 'dance'; this.st = 100; }
      } else if (this.state === 'storm') {
        // spins in place and books fly off him in a ring
        if (this.st % 30 === 0) {
          const off = (this.st / 30) * 0.3;
          for (let i = 0; i < 10; i++) { const a = off + (i / 10) * Math.PI * 2; w.add(new BookShot(this.x, this.y - 10, Math.cos(a) * 1.2, Math.sin(a) * 1.2)); }
          G.audio.sfx('dash');
          w.pop(this.x, this.y - 52, '*TWIRL*', '#f8a8c8');
        }
        if (--this.st <= 0) { this.state = 'dance'; this.st = 110; }
      } else if (this.state === 'shimmy') {
        // shimmies straight at Nate
        if (this.st === 60) { this.vx = (dx / dist) * 2.2; this.vy = (dy / dist) * 2.2; w.pop(this.x, this.y - 52, 'SHIMMY!', '#f8a8c8'); G.audio.sfx('dash'); }
        const h = w.move(this, this.vx, this.vy);
        if (h.hitX || h.hitY || --this.st <= 0) { this.state = 'dance'; this.st = 90; }
      }
    }
    hit(dmg, sx, sy) {
      if (this.state === 'defeated') return;
      this.hp = Math.max(0, this.hp - dmg);
      this.hurtT = 12;
      const dx = this.x - sx, dy = this.y - sy, m = Math.hypot(dx, dy) || 1;
      this.kb = { x: (dx / m) * 1.6, y: (dy / m) * 1.6 };
      G.audio.sfx('hit');
      this.world.burst(this.x, this.y - 20, ['#a83a3a', '#2a4a7a', '#f4ecd8', '#e8c060'], 5, { speed: 1.4, up: 0.6, g: 0.06, life: 26, size: 2 });
      if (this.hp <= 0) {
        this.state = 'defeated';
        G.script.run(G.SCRIPTS.globDefeated(this));
      }
    }
    bomb(sx, sy) { this.hit(3, sx, sy); }
    draw(ctx, cx, cy) {
      if (this.hidden) return;
      const frames = G.spr.globglog;
      // sways left and right on the beat
      const beat = Math.floor(this.t / (this.angry ? 9 : 12)) % 4;
      let img = frames[[0, 1, 2, 1][beat]];
      if (this.hurtT && (this.hurtT >> 1) & 1) img = G.art.flash(img);
      const bob = Math.abs(Math.sin(this.t * 0.15)) * 3;
      ctx.drawImage(G.spr.shadowBig, Math.round(this.x - 14) - cx, Math.round(this.y - 4) - cy, 28, 6);
      ctx.drawImage(img, Math.round(this.x - 26) - cx, Math.round(this.y - 47 - bob) - cy);
    }
  }
  G.Globglog = Globglog;


  // ============================================================== ICE JJ FISH (boss)
  // Sings on the frozen pond north of the bridge: snowflake notes, a huge held
  // high note, a slide across the ice (then he's dizzy), and later, icicles.
  const JJ_SONG = [
      '~ I pray to Jesus ~', '~ (Jesus) ~',
      '~ I pray to Jesus Christ ~', '~ (Jesus) ~',
      '~ I pray to Jesus Christ ~', '~ (Jesus) ~',
      '~ I pray to Jesus ~',
      '~ When I\'m stuck and don\'t know what to do ~', '~ (Don\'t know what to do, don\'t know what to do) ~',
      '~ You\'re the only one I can go and count on, too ~', '~ (Count on too, count on too) ~',
      '~ If it weren\'t for you I wouldn\'t know what to do ~', '~ (What to do, what to do) ~',
      '~ You\'ve always been there for me, that\'s why I love you ~', '~ (I love you, that\'s why I love you) ~',
      '~ I\'m sorry to you for breaking all your rules ~', '~ (All your rules, all your rules) ~',
      '~ I don\'t know what was wrong with me for acting such a fool ~', '~ (Such a fool, acting such a fool) ~',
      '~ All my life I went and put my trust into you ~', '~ (Trust in you, trust in you) ~',
      '~ I owe you for everything you\'ve done for me, that\'s true ~', '~ (That is true, that is very true) ~',
      '~ I hope you accept my apology for what I do ~', '~ (What I do, what I do) ~',
      '~ I promise to you, God, I will make it up to you ~', '~ (Up to you, make it up to you) ~',
      '~ I pray to Jesus ~', '~ (Jesus) ~',
      '~ I pray to Jesus Christ ~', '~ (Jesus) ~',
      '~ I pray to Jesus Christ ~', '~ (Jesus) ~',
      '~ I pray to Jesus Christ ~', '~ (Jesus) ~',
  ];  const JJ_OUCH = ['OUCH, BRO!', 'NOT THE MIC!', 'STILL ON KEY!', 'AYO?!', 'I\'M ICY!', 'THAT WAS FLAT!'];
  class Icicle extends Ent {
    constructor(x, y) { super(x, y); this.t = 50; this.land = 0; }
    update(w) {
      if (G.script.busy) return;
      if (this.land) { if (--this.land <= 0) this.dead = true; return; }
      if (--this.t > 0) return;
      this.land = 12;
      G.audio.sfx('clank');
      w.burst(this.x, this.y - 4, ['#e8f8ff', '#bce8fc', '#ffffff'], 10, { speed: 1.4, up: 0.8, g: 0.1, life: 22, size: 2 });
      const p = G.play.player;
      if (G.overlap([this.x - 9, this.y - 8, this.x + 9, this.y + 3], p.hurtBox())) p.hurt(1, this.x, this.y);
    }
    draw(ctx, cx, cy) {
      if (this.land) return;
      const k = 1 - this.t / 50;
      ctx.fillStyle = `rgba(30,60,110,${0.2 + k * 0.35})`;
      ctx.beginPath(); ctx.ellipse(Math.round(this.x) - cx, Math.round(this.y) - cy, 4 + k * 5, 2 + k * 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.drawImage(G.spr.icicle, Math.round(this.x - 3) - cx, Math.round(this.y - 14 - this.t * 3) - cy);
    }
  }
  G.Icicle = Icicle;

  class IceJJ extends Ent {
    constructor(x, y) {
      super(x, y);
      this.enemy = true;
      this.boss = true;
      this.name = 'ICE JJ FISH';
      this.hp = this.maxHp = 22;
      this.hb = { w: 12, h: 8 };
      this.home = { x, y };
      this.state = 'glide';
      this.t = 90;
      this.dir = 'down';
      this.anim = 0;
      this.hurtT = 0;
      this.kb = { x: 0, y: 0 };
      this.cycle = 0;
      this.songT = 0;
      this.verse = -1;
      this.vx = 0; this.vy = 0;
    }
    get S() { return G.sprites.icejj; }
    get hyped() { return this.hp <= this.maxHp / 2; }
    hurtBox() { return [this.x - 7, this.y - 22, this.x + 7, this.y]; }
    snow(w, a, sp) { w.add(new Shot(this.x, this.y - 2, Math.cos(a) * sp, Math.sin(a) * sp, G.spr.snowflake, { life: 220, z: 9 })); }
    // he skates around the holes (they count as walls for him)
    skate(w, dx, dy) {
      const hole = (x, y) => { const d = G.TILE_DEFS[w.tileAt(Math.floor(x / 16), Math.floor((y - 3) / 16))]; return !!(d && d.hazard); };
      let hitX = false, hitY = false;
      if (dx) hitX = hole(this.x + dx + Math.sign(dx) * 7, this.y) || w.move(this, dx, 0).hitX;
      if (dy) hitY = hole(this.x, this.y + dy + Math.sign(dy) * 4) || w.move(this, 0, dy).hitY;
      return { hitX, hitY };
    }
    // the high note cracks the pond open in a few spots (never right under Nate)
    crackIce(w, n) {
      const p = G.play.player, spots = [];
      for (let ty = 0; ty < w.h; ty++) for (let tx = 0; tx < w.w; tx++) {
        if (w.tileAt(tx, ty) !== 'I') continue;
        const cx = tx * 16 + 8, cy = ty * 16 + 8;
        if (Math.hypot(cx - p.x, cy - (p.y - 6)) < 40 || Math.hypot(cx - this.x, cy - (this.y - 6)) < 28) continue;
        spots.push([tx, ty]);
      }
      w.holes = w.holes || 0;
      for (let k = 0; k < n && spots.length && w.holes < 10; k++) {
        const [tx, ty] = spots.splice(Math.floor(Math.random() * spots.length), 1)[0];
        w.setTile(tx, ty, 'U');
        if (Math.random() < 0.6 && w.tileAt(tx + 1, ty) === 'I') w.setTile(tx + 1, ty, 'U');
        w.holes++;
        w.burst(tx * 16 + 8, ty * 16 + 8, ['#e8f8ff', '#a8d8f0', '#ffffff'], 10, { speed: 1.6, up: 0.8, g: 0.1, life: 24, size: 2 });
        w.pop(tx * 16 + 8, ty * 16 - 4, 'CRACK!', '#ffffff');
      }
      G.audio.sfx('boom');
      G.play.shake(16, 3);
    }
    update(w) {
      if (G.script.busy || this.state === 'defeated') return;
      // he never stops singing
      if (++this.songT % 70 === 1) { this.verse = (this.verse + 1) % JJ_SONG.length; w.pop(this.x, this.y - 36, JJ_SONG[this.verse], '#a8e0ff'); }
      const p = G.play.player, dx = p.x - this.x, dy = p.y - this.y, dist = Math.hypot(dx, dy) || 1;
      if (this.hurtT > 0) {
        // knocked back across the ice
        this.hurtT--;
        if (this.skate(w, this.kb.x, 0).hitX) this.kb.x = -this.kb.x;
        if (this.skate(w, 0, this.kb.y).hitY) this.kb.y = -this.kb.y;
        this.kb.x *= 0.93; this.kb.y *= 0.93;
        return;
      }
      if (this.state !== 'dizzy' && G.overlap(this.hurtBox(), p.hurtBox())) p.hurt(1, this.x, this.y);
      if (this.state === 'glide') {
        // a lazy figure skate around the pond
        this.t--;
        const tx = this.home.x + Math.cos(this.songT * 0.02) * 64, ty = this.home.y + Math.sin(this.songT * 0.02) * 22;
        this.skate(w, (tx - this.x) * 0.04, 0); this.skate(w, 0, (ty - this.y) * 0.04);
        this.dir = G.dirToward(dx, dy);
        this.anim++;
        if (this.t <= 0) {
          const moves = this.hyped ? ['sing', 'high', 'slide', 'icicles'] : ['sing', 'high', 'sing', 'slide'];
          this.state = moves[this.cycle++ % moves.length];
          this.t = { sing: 80, high: 70, slide: 60, icicles: 100 }[this.state];
        }
      } else if (this.state === 'sing') {
        this.dir = G.dirToward(dx, dy);
        if (this.t % 20 === 0) {
          const n = this.hyped ? 5 : 3, a = Math.atan2(dy, dx);
          for (let i = 0; i < n; i++) this.snow(w, a + (i - (n - 1) / 2) * 0.3, this.hyped ? 1.6 : 1.3);
          G.audio.sfx('blip');
        }
        if (--this.t <= 0) { this.state = 'glide'; this.t = 80; }
      } else if (this.state === 'high') {
        // holds a high note so long the air freezes
        this.dir = 'down';
        if (this.t === 66) { w.pop(this.x, this.y - 48, '~ OOOOOOOOOOOH ~', '#ffffff'); G.audio.sfx('bell'); }
        G.play.shake(2, 1);
        if (this.t === 50 || this.t === 22) {
          const n = 14, gap = Math.floor(Math.random() * n);
          for (let i = 0; i < n; i++) if (i !== gap && i !== (gap + 1) % n) this.snow(w, (i / n) * Math.PI * 2 + this.t * 0.02, 1.1);
          w.fx.push({ x: this.x, y: this.y - 10, vx: 0, vy: 0, shock: true, r: 50, max: 22, life: 22, color: '#d8f4ff' });
          // once the pond has cracked, every high note opens another hole
          if (this.t === 22 && this.hyped) this.crackIce(w, 1);
        }
        if (--this.t <= 0) { this.state = 'glide'; this.t = 90; }
      } else if (this.state === 'crack') {
        // half health: a note so high the pond gives way
        this.dir = 'down';
        G.play.shake(2, this.t < 50 ? 2 : 1);
        if (this.t === 88) { w.pop(this.x, this.y - 48, '~ OOOOOOOOOOOOOOOOOH ~', '#ffffff'); G.audio.sfx('bell'); }
        if (this.t === 66) w.pop(this.x, this.y - 40, '*creeeak*', '#a8e0ff');
        if (this.t === 60 || this.t === 44) G.audio.sfx('clank');
        if (this.t === 30) this.crackIce(w, 5);
        if (--this.t <= 0) { this.state = 'glide'; this.t = 60; }
      } else if (this.state === 'slide') {
        // a knee slide right across the ice
        if (this.t === 60) { this.vx = (dx / dist) * 3.2; this.vy = (dy / dist) * 3.2; w.pop(this.x, this.y - 36, 'WHOOOO!', '#ffffff'); G.audio.sfx('dash'); this.dir = G.dirToward(dx, dy); }
        if (this.skate(w, this.vx, 0).hitX) { this.vx = -this.vx; G.audio.sfx('bump'); }
        if (this.skate(w, 0, this.vy).hitY) { this.vy = -this.vy; G.audio.sfx('bump'); }
        this.vx *= 0.985; this.vy *= 0.985;
        if (--this.t <= 0) { this.state = 'dizzy'; this.t = this.hyped ? 50 : 70; w.pop(this.x, this.y - 36, '...whoa.', '#ffffff'); }
      } else if (this.state === 'dizzy') {
        this.dir = ['down', 'left', 'up', 'right'][(this.t >> 3) % 4];
        if (--this.t <= 0) { this.state = 'glide'; this.t = 70; }
      } else if (this.state === 'icicles') {
        if (this.t % 20 === 0 && this.t > 10) {
          w.add(new Icicle(p.x + (Math.random() * 20 - 10), p.y + (Math.random() * 10 - 5)));
          if (this.t === 100) w.pop(this.x, this.y - 36, 'IT\'S GETTING COLD IN HERE!', '#a8e0ff');
        }
        if (--this.t <= 0) { this.state = 'glide'; this.t = 70; }
      }
    }
    hit(dmg, sx, sy) {
      if (this.state === 'defeated') return;
      const wasHyped = this.hyped;
      this.hp = Math.max(0, this.hp - dmg);
      this.hurtT = 16;
      if (this.hyped && !wasHyped && this.hp > 0) { this.state = 'crack'; this.t = 90; this.vx = this.vy = 0; }
      const dx = this.x - sx, dy = this.y - sy, m = Math.hypot(dx, dy) || 1;
      this.kb = { x: (dx / m) * 3, y: (dy / m) * 3 };
      G.audio.sfx('hit');
      this.world.pop(this.x, this.y - 30, JJ_OUCH[Math.floor(Math.random() * JJ_OUCH.length)], '#f8f8f0');
      if (this.hp <= 0) {
        this.state = 'defeated';
        G.script.run(G.SCRIPTS.jjDefeated(this));
      }
    }
    bomb(sx, sy) { this.hit(3, sx, sy); }
    draw(ctx, cx, cy) {
      const S = this.S;
      drawShadow(ctx, this.x, this.y, cx, cy);
      const moving = this.state === 'glide' || this.state === 'slide';
      let img = S[this.dir][walkFrame(this.anim, moving)];
      if (this.hurtT && (this.hurtT >> 1) & 1) img = G.art.flash(img);
      const sx = Math.round(this.x - 8) - cx, sy = Math.round(this.y - S.h + 2) - cy;
      ctx.drawImage(img, sx, sy);
      // the mic
      if (this.dir !== 'up') ctx.drawImage(G.spr.mic, sx + (this.dir === 'left' ? 2 : this.dir === 'right' ? 10 : 9), sy + 9);
      if (this.state === 'dizzy') {
        ctx.fillStyle = '#d8f4ff';
        for (let i = 0; i < 3; i++) {
          const a = this.t * 0.15 + (i * Math.PI * 2) / 3;
          ctx.fillRect(Math.round(this.x + Math.cos(a) * 9) - cx, Math.round(this.y - S.h - 2 + Math.sin(a) * 3) - cy, 2, 2);
        }
      }
    }
  }
  G.IceJJ = IceJJ;

  // ============================================================== SIX (enemy)
  class Six extends Ent {
    constructor(x, y) {
      super(x, y);
      this.enemy = true;
      this.hb = { w: 10, h: 6 };
      this.hp = 2;
      this.t = Math.floor(Math.random() * 100);
      this.vx = 0; this.vy = 0;
      this.wt = 0;
      this.hurtT = 0;
      this.kb = { x: 0, y: 0 };
    }

    hurtBox() { return [this.x - 7, this.y - 15, this.x + 7, this.y]; }

    update(w) {
      if (G.script.busy) return;
      this.t++;
      if (this.hurtT > 0) {
        this.hurtT--;
        w.move(this, this.kb.x, 0);
        w.move(this, 0, this.kb.y);
        this.kb.x *= 0.85; this.kb.y *= 0.85;
        return;
      }
      if (this.calm > 0) { this.calm--; return; }
      const p = G.play.player;
      const dx = p.x - this.x, dy = p.y - this.y, dist = Math.hypot(dx, dy);
      if (dist < 64) {
        this.vx = (dx / dist) * 0.52;
        this.vy = (dy / dist) * 0.52;
      } else if (--this.wt <= 0) {
        const a = Math.random() * Math.PI * 2;
        const go = Math.random() < 0.7;
        this.vx = go ? Math.cos(a) * 0.4 : 0;
        this.vy = go ? Math.sin(a) * 0.4 : 0;
        this.wt = 40 + Math.random() * 80;
      }
      const hit = w.move(this, this.vx, 0);
      const hit2 = w.move(this, 0, this.vy);
      if (hit.hitX) this.vx = -this.vx;
      if (hit2.hitY) this.vy = -this.vy;
      if (G.overlap(this.hurtBox(), p.hurtBox())) p.hurt(1, this.x, this.y);
    }

    hit(dmg, sx, sy) {
      this.hp -= dmg;
      this.hurtT = 14;
      this.calm = 0;
      const dx = this.x - sx, dy = this.y - sy, m = Math.hypot(dx, dy) || 1;
      this.kb = { x: (dx / m) * 3, y: (dy / m) * 3 };
      G.audio.sfx('hit');
      if (this.hp <= 0) {
        this.dead = true;
        G.audio.sfx('poof');
        this.world.burst(this.x, this.y - 8, ['#ffffff', '#e8e0f0', '#ff8878'], 12, { speed: 1.2, life: 20, size: 3 });
        G.play.maybeDrop(this.x, this.y, 0.6);
        G.state.stats.sixes = (G.state.stats.sixes || 0) + 1;
        // progress on Gus's lawn job
        const f = G.state.flags;
        if (f.capQuest && !G.state.items.cap && !f.capDone) {
          const n = G.capProgress();
          if (n >= 10) {
            f.capDone = true;
            this.world.pop(this.x, this.y - 26, '10/10! Go see Gus!', '#78e070');
            G.audio.sfx('secret');
          } else {
            this.world.pop(this.x, this.y - 26, G.sayable(n) + '/10', '#f8f8f0');
          }
        }
      }
    }

    draw(ctx, cx, cy) {
      drawShadow(ctx, this.x, this.y, cx, cy);
      const z = Math.abs(Math.sin(this.t * 0.18)) * (this.hurtT || this.calm ? 0 : 3);
      let img = G.spr.six[Math.floor(this.t / 10) % 2];
      if (this.hurtT && (this.hurtT >> 1) & 1) img = G.art.flash(img);
      ctx.drawImage(img, Math.round(this.x - 8) - cx, Math.round(this.y - 16 - z) - cy);
      if (this.calm > 0) drawHalo(ctx, this.x - cx, this.y - 19 - cy);
    }
  }
  G.Six = Six;

  // ============================================================== WRESTLER (enemy)
  // Wanders, winds up when Nate gets close, then dropkicks in a straight line.
  // Charging into a wall (or missing) leaves them dizzy and open to a bonk.
  const TAUNTS = ['DROPKICK!', 'OHHH YEAH!', 'FLYING ELBOW!', 'SUPLEX TIME!', 'BODY SLAM!', 'CLOTHESLINE!'];

  class Wrestler extends Ent {
    constructor(x, y, style) {
      super(x, y);
      this.enemy = true;
      this.style = style;
      this.hb = { w: 10, h: 6 };
      this.hp = 3;
      this.dir = 'down';
      this.state = 'wander';
      this.t = 40 + Math.random() * 60;
      this.cool = 60;
      this.anim = 0;
      this.vx = 0; this.vy = 0;
      this.hurtT = 0;
      this.kb = { x: 0, y: 0 };
    }

    get S() { return G.sprites['wrestler_' + this.style]; }

    hurtBox() { return [this.x - 7, this.y - 16, this.x + 7, this.y]; }

    update(w) {
      if (G.script.busy) return;
      const p = G.play.player;
      if (this.cool > 0) this.cool--;
      if (this.hurtT > 0) {
        this.hurtT--;
        w.move(this, this.kb.x, 0);
        w.move(this, 0, this.kb.y);
        this.kb.x *= 0.85; this.kb.y *= 0.85;
        return;
      }
      if (this.calm > 0) {
        this.calm--;
        this.state = 'wander';
        this.vx = this.vy = 0;
        this.cool = 60;
        return;
      }
      const dx = p.x - this.x, dy = p.y - this.y, dist = Math.hypot(dx, dy) || 1;

      if (this.state === 'wander') {
        if (dist < 76 && this.cool <= 0) {
          this.state = 'windup';
          this.t = 30;
          this.dir = G.dirToward(dx, dy);
          return;
        }
        if (--this.t <= 0) {
          const go = Math.random() < 0.7, a = Math.random() * Math.PI * 2;
          this.vx = go ? Math.cos(a) * 0.45 : 0;
          this.vy = go ? Math.sin(a) * 0.45 : 0;
          this.t = 40 + Math.random() * 80;
        }
        if (this.vx || this.vy) {
          this.dir = G.dirToward(this.vx, this.vy);
          const h = w.move(this, this.vx, this.vy);
          if (h.hitX) this.vx = -this.vx;
          if (h.hitY) this.vy = -this.vy;
          this.anim++;
        }
      } else if (this.state === 'windup') {
        this.dir = G.dirToward(dx, dy);
        if (--this.t <= 0) {
          this.state = 'charge';
          this.t = 42;
          this.vx = (dx / dist) * 2.6;
          this.vy = (dy / dist) * 2.6;
          G.audio.sfx('dash');
          w.pop(this.x, this.y - 26, TAUNTS[Math.floor(Math.random() * TAUNTS.length)], '#ffd860');
        }
      } else if (this.state === 'charge') {
        this.anim += 2;
        const h = w.move(this, this.vx, this.vy);
        if (h.hitX || h.hitY) {
          this.dizzy(w, true);
        } else if (--this.t <= 0) {
          this.dizzy(w, false);
        }
      } else if (this.state === 'dizzy') {
        if (--this.t <= 0) { this.state = 'wander'; this.t = 30; this.cool = 70; }
      }

      // only the dropkick itself hurts, so it's readable: dodge the charge, then bonk
      if (this.state === 'charge' && G.overlap(this.hurtBox(), p.hurtBox())) p.hurt(2, this.x, this.y);
    }

    dizzy(w, bonk) {
      this.state = 'dizzy';
      this.t = bonk ? 80 : 50;
      this.vx = this.vy = 0;
      if (bonk) {
        G.audio.sfx('bump');
        G.play.shake(6, 2);
        w.burst(this.x, this.y - 10, ['#ffffff', '#c8c8d0'], 6, { speed: 1, life: 14 });
      }
    }

    hit(dmg, sx, sy) {
      this.hp -= dmg;
      this.hurtT = 14;
      this.calm = 0;
      const dx = this.x - sx, dy = this.y - sy, m = Math.hypot(dx, dy) || 1;
      this.kb = { x: (dx / m) * 3, y: (dy / m) * 3 };
      if (this.state === 'charge' || this.state === 'windup') { this.state = 'dizzy'; this.t = 40; }
      G.audio.sfx('hit');
      if (this.hp <= 0) {
        this.dead = true;
        G.audio.sfx('bell');
        this.world.pop(this.x, this.y - 24, '1... 2... 3!', '#ffffff');
        this.world.burst(this.x, this.y - 8, ['#ffffff', '#f8d850', '#e8e0f0'], 14, { speed: 1.3, life: 22, size: 3 });
        G.play.maybeDrop(this.x, this.y, 0.75);
        G.state.stats.pins = (G.state.stats.pins || 0) + 1;
      }
    }

    draw(ctx, cx, cy) {
      const S = this.S;
      drawShadow(ctx, this.x, this.y, cx, cy);
      let frame = 0;
      if (this.state === 'charge') frame = 1 + ((this.anim >> 2) & 1);
      else if (this.state === 'wander' && (this.vx || this.vy)) frame = walkFrame(this.anim, true);
      let img = S[this.dir][frame];
      if ((this.hurtT && (this.hurtT >> 1) & 1) || (this.state === 'windup' && (this.t >> 2) & 1)) img = G.art.flash(img);
      const jx = this.state === 'windup' ? ((this.t >> 1) & 1 ? 1 : -1) : 0;
      const sx = Math.round(this.x - 8 + jx) - cx, sy = Math.round(this.y - S.h + 2) - cy;
      ctx.drawImage(img, sx, sy);
      if (this.calm > 0) drawHalo(ctx, this.x - cx, sy - 3);
      if (this.state === 'dizzy') {
        for (let i = 0; i < 3; i++) {
          const a = G.tick * 0.12 + (i * Math.PI * 2) / 3;
          ctx.fillStyle = i ? '#f8d850' : '#ffffff';
          ctx.fillRect(Math.round(this.x + Math.cos(a) * 6) - cx, Math.round(sy - 3 + Math.sin(a) * 2), 2, 2);
        }
      }
    }
  }
  G.Wrestler = Wrestler;

  // ============================================================== FAIR DECORATIONS
  // Pixel-plotted line helper (keeps everything crisp, no anti-aliasing).
  function plot(ctx, x0, y0, x1, y1, color, w = 1) {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) | 0 || 1;
    ctx.fillStyle = color;
    for (let i = 0; i <= n; i++) ctx.fillRect(Math.round(x0 + ((x1 - x0) * i) / n), Math.round(y0 + ((y1 - y0) * i) / n), w, w);
  }
  const BULBS = ['#ff5a5a', '#ffd84a', '#5ae07a', '#5aa8ff', '#ffffff'];

  // Turns (with lights) once the show is about to start.
  class FerrisWheel {
    constructor(cx, groundY) {
      this.hx = cx;
      this.hy = groundY - 64;
      this.R = 40;
      this.base = groundY;
      this.hit = [cx - 26, groundY - 18, cx + 26, groundY + 2];
      this.talk = () => G.SCRIPTS.ferrisWheel();
    }
    draw(ctx, cx, cy) {
      const lit = G.fairLit(), hx = this.hx - cx, hy = this.hy - cy, R = this.R, gy = this.base - cy;
      // A-frame legs
      plot(ctx, hx, hy, hx - 28, gy, '#4a4e5e', 2);
      plot(ctx, hx, hy, hx + 28, gy, '#4a4e5e', 2);
      plot(ctx, hx - 14, hy + 32, hx + 14, hy + 32, '#4a4e5e', 1);
      ctx.fillStyle = '#6a6e7e'; ctx.fillRect(hx - 34, gy - 2, 68, 4);
      // rim
      for (let t = 0; t < 360; t += 2) {
        const a = (t * Math.PI) / 180;
        ctx.fillStyle = '#e8e8f0';
        ctx.fillRect(Math.round(hx + Math.cos(a) * R), Math.round(hy + Math.sin(a) * R), 2, 2);
        ctx.fillStyle = '#b8b8c8';
        ctx.fillRect(Math.round(hx + Math.cos(a) * (R - 5)), Math.round(hy + Math.sin(a) * (R - 5)), 1, 1);
      }
      const spin = lit ? G.tick * 0.006 : 0.3;
      for (let k = 0; k < 8; k++) {
        const a = spin + (k * Math.PI) / 4;
        const rx = hx + Math.cos(a) * R, ry = hy + Math.sin(a) * R;
        plot(ctx, hx, hy, rx, ry, '#c8c8d8', 1);
        // gondola hangs straight down from the rim
        const col = ['#d83038', '#f8c030', '#3878d8', '#38a048'][k % 4];
        ctx.fillStyle = '#2a2030'; ctx.fillRect(Math.round(rx) - 5, Math.round(ry) + 1, 10, 8);
        ctx.fillStyle = col; ctx.fillRect(Math.round(rx) - 4, Math.round(ry) + 2, 8, 6);
        ctx.fillStyle = '#f8f0e0'; ctx.fillRect(Math.round(rx) - 3, Math.round(ry) + 3, 6, 2);
      }
      ctx.fillStyle = '#2a2030'; ctx.fillRect(hx - 3, hy - 3, 6, 6);
      ctx.fillStyle = '#c8c8d8'; ctx.fillRect(hx - 2, hy - 2, 4, 4);
      if (!lit) return;
      for (let t = 0; t < 360; t += 15) {
        const a = (t * Math.PI) / 180 + spin;
        const x = Math.round(hx + Math.cos(a) * R), y = Math.round(hy + Math.sin(a) * R);
        const col = BULBS[((t / 15) + (G.tick >> 4)) % BULBS.length];
        ctx.fillStyle = col; ctx.fillRect(x, y, 2, 2);
        G.play.world.glows.push({ x: x + cx + 1, y: y + cy + 1, color: col });
      }
    }
  }
  G.FerrisWheel = FerrisWheel;

  // A wooden light pole; depth-sorted like everything else on the ground.
  class LightPole {
    constructor(x, y) { this.x = x; this.y = y; this.base = y; }
    draw(ctx, cx, cy) {
      const H = 30;
      ctx.fillStyle = '#2a2030'; ctx.fillRect(this.x - 2 - cx, this.y - H - cy, 4, H + 1);
      ctx.fillStyle = '#7a5a3a'; ctx.fillRect(this.x - 1 - cx, this.y - H - cy, 2, H);
    }
  }
  G.LightPole = LightPole;

  // A sagging string of bulbs between two pole tops; drawn overhead.
  class LightString {
    constructor(x1, y1, x2, y2) {
      Object.assign(this, { x1, y1, x2, y2 });
      this.base = Math.max(y1, y2) + 200;
    }
    draw(ctx, cx, cy) {
      const lit = G.fairLit(), H = 30, sag = 12;
      const n = Math.max(8, Math.round(Math.abs(this.x2 - this.x1) / 2));
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        const x = Math.round(this.x1 + (this.x2 - this.x1) * t) - cx;
        const y = Math.round(this.y1 - H + (this.y2 - this.y1) * t + sag * 4 * t * (1 - t)) - cy;
        ctx.fillStyle = '#2a2030'; ctx.fillRect(x, y, 1, 1);
        if (i % 4 !== 2) continue;
        let col = BULBS[(i >> 2) % BULBS.length];
        if (lit && ((i >> 2) + (G.tick >> 5)) % 7 === 0) col = '#ffffff';
        ctx.fillStyle = lit ? col : G.art.shade(col, -0.55);
        ctx.fillRect(x - 1, y + 1, 2, 2);
        if (lit) G.play.world.glows.push({ x: x + cx, y: y + cy + 2, color: col });
      }
    }
  }
  G.LightString = LightString;

  // ============================================================== CHICKENS
  // Hens that wander and peck inside a pen. Bonk one and it flees with a BAWK.
  // Bonk them 6 times (the sacred number) and the whole flock gets revenge.
  class Chicken extends Ent {
    constructor(x, y, color, pen) {
      super(x, y);
      this.color = color;
      this.pen = pen; // [x0, y0, x1, y1] in px
      this.hb = { w: 8, h: 4 };
      this.dir = Math.random() < 0.5 ? 'left' : 'right';
      this.t = Math.floor(Math.random() * 100);
      this.wt = 0;
      this.peck = 0;
      this.flee = 0;
      this.vx = 0; this.vy = 0;
    }

    update(w) {
      if (G.script.busy) return;
      this.t++;
      if (this.peck > 0) { this.peck--; return; }
      if (this.flee <= 0 && --this.wt <= 0) {
        if (Math.random() < 0.4) { this.peck = 30 + Math.random() * 40; this.vx = this.vy = 0; this.wt = 1; return; }
        const a = Math.random() * Math.PI * 2;
        this.vx = Math.cos(a) * 0.3; this.vy = Math.sin(a) * 0.3;
        this.wt = 30 + Math.random() * 60;
      }
      if (this.flee > 0) this.flee--;
      const [x0, y0, x1, y1] = this.pen;
      if ((this.x + this.vx < x0 && this.vx < 0) || (this.x + this.vx > x1 && this.vx > 0)) this.vx = -this.vx;
      if ((this.y + this.vy < y0 && this.vy < 0) || (this.y + this.vy > y1 && this.vy > 0)) this.vy = -this.vy;
      const h = w.move(this, this.vx, this.vy);
      if (h.hitX) this.vx = -this.vx;
      if (h.hitY) this.vy = -this.vy;
      if (this.vx) this.dir = this.vx < 0 ? 'left' : 'right';
      const p = G.play.player;
      if (this.t % 300 === 0 && Math.hypot(p.x - this.x, p.y - this.y) < 60) G.audio.sfx('cluck');
    }

    onHammer(p) {
      const w = this.world;
      w.chickenHits = (w.chickenHits || 0) + 1;
      G.audio.sfx('bawk');
      w.pop(this.x, this.y - 16, 'BAWK!', '#ffffff');
      w.burst(this.x, this.y - 6, ['#ffffff', '#f4f2ec', '#e8e0d0'], 6, { speed: 1, up: 0.6, g: 0.05, life: 26 });
      const dx = this.x - p.x, dy = this.y - p.y, m = Math.hypot(dx, dy) || 1;
      this.vx = (dx / m) * 1.8; this.vy = (dy / m) * 1.8;
      this.flee = 40; this.peck = 0;
      if (w.chickenHits >= 6 && !w.swarmT) {
        w.swarmT = 420;
        w.pop(p.x, p.y - 40, 'THE CHICKENS HAVE HAD ENOUGH!', '#ff9a28');
        G.play.shake(10, 2);
      }
    }

    draw(ctx, cx, cy) {
      ctx.drawImage(G.spr.shadow, Math.round(this.x - 6) - cx, Math.round(this.y - 3) - cy);
      const S = G.spr.chickens[this.color][this.dir];
      const hop = this.flee > 0 ? ((this.t >> 2) & 1) * 2 : 0;
      const img = this.peck > 0 && (this.t >> 3) & 1 ? S[1] : S[0];
      ctx.drawImage(img, Math.round(this.x - 7) - cx, Math.round(this.y - 12 - hop) - cy);
    }
  }
  G.Chicken = Chicken;

  // Revenge of the flock: angry hens swooping in from off-screen.
  class AngryChicken extends Ent {
    constructor(x, y, tx, ty) {
      super(x, y);
      const d = Math.hypot(tx - x, ty - y) || 1;
      this.vx = ((tx - x) / d) * 2.3;
      this.vy = ((ty - y) / d) * 2.3;
      this.life = 200;
      this.color = Math.random() < 0.5 ? 'white' : 'brown';
      this.hb = { w: 8, h: 6 };
    }
    update() {
      if (G.script.busy) return;
      this.x += this.vx; this.y += this.vy;
      if (--this.life <= 0) { this.dead = true; return; }
      const p = G.play.player;
      if (G.overlap([this.x - 5, this.y - 12, this.x + 5, this.y - 2], p.hurtBox())) p.hurt(1, this.x, this.y);
    }
    draw(ctx, cx, cy) {
      const S = G.spr.chickens[this.color][this.vx < 0 ? 'left' : 'right'];
      ctx.drawImage(G.spr.shadow, Math.round(this.x - 6) - cx, Math.round(this.y - 3) - cy);
      ctx.drawImage(S[(G.tick >> 2) & 1], Math.round(this.x - 7) - cx, Math.round(this.y - 20) - cy);
    }
  }
  G.AngryChicken = AngryChicken;

  // ============================================================== BOULDER
  class Boulder extends Ent {
    // No talk(): pressing Z next to it swings the hammer so you get the CLANK.
    constructor(cx, by, onHammer) {
      super(cx, by);
      this.solid = true;
      this.hb = { w: 66, h: 28 };
      this.onHammerFn = onHammer;
    }
    onHammer(p) {
      G.audio.sfx('clank');
      G.play.shake(4, 1);
      const [dx, dy] = G.DIRS[p.dir];
      this.world.burst(p.x + dx * 14, p.y - 8 + dy * 10, ['#ffffff', '#f8d850', '#ffb040'], 8, { speed: 1.6, life: 12 });
      this.world.pop(p.x + dx * 12, p.y - 30, 'CLANK!', '#e0e0e8');
      this.onHammerFn();
    }
    draw(ctx, cx, cy) {
      ctx.drawImage(G.spr.shadowBig, Math.round(this.x - 34) - cx, Math.round(this.y - 4) - cy, 68, 6);
      const lift = this.lift || 0, jx = this.shakeT > 0 ? ((G.tick >> 1) & 1 ? 1 : -1) : 0;
      ctx.drawImage(G.spr.boulder, Math.round(this.x - 32 + jx) - cx, Math.round(this.y - 46 - lift) - cy);
    }
  }
  G.Boulder = Boulder;

  // ============================================================== PICKUP
  class Pickup extends Ent {
    constructor(x, y, kind) {
      super(x, y);
      this.kind = kind;
      this.hb = { w: 10, h: 8 };
      this.z = 0;
      this.vz = 2.2;
      this.life = 600;
    }

    get img() {
      return { tooth: G.spr.tooth, tooth5: G.spr.toothGold, heart: G.spr.heart.full, doosh: G.spr.doosh, package: G.spr.gift }[this.kind];
    }

    update() {
      if (G.script.busy) return;
      if (this.vz || this.z > 0) {
        this.z += this.vz;
        this.vz -= 0.25;
        if (this.z <= 0) { this.z = 0; this.vz = Math.abs(this.vz) > 0.8 ? -this.vz * 0.4 : 0; }
      }
      if (--this.life <= 0) this.dead = true;
      const p = G.play.player;
      if (this.z < 4 && G.overlap(this.box(), p.hurtBox())) {
        this.dead = true;
        G.play.collect(this.kind);
      }
    }

    draw(ctx, cx, cy) {
      if (this.life < 120 && (this.life >> 2) & 1) return;
      const img = this.img;
      ctx.drawImage(G.spr.shadow, Math.round(this.x - 6) - cx, Math.round(this.y - 3) - cy);
      ctx.drawImage(img, Math.round(this.x - img.width / 2) - cx, Math.round(this.y - img.height - this.z) - cy);
    }
  }
  G.Pickup = Pickup;

  // ============================================================== CHEST / SIGN
  class Chest extends Ent {
    constructor(tx, ty, id, contents) {
      super(tx * 16 + 8, ty * 16 + 15);
      this.id = id;
      this.contents = contents;
      this.solid = true;
      this.hb = { w: 16, h: 14 };
    }
    get opened() { return !!G.state.flags['chest_' + this.id]; }
    talk() {
      const self = this;
      return (function* () {
        if (self.opened) { yield G.say(null, 'It\'s empty.'); return; }
        G.state.flags['chest_' + self.id] = true;
        G.audio.sfx('chest');
        yield G.wait(20);
        yield* self.contents();
      })();
    }
    draw(ctx, cx, cy) {
      const img = this.opened ? G.spr.chest.open : G.spr.chest.closed;
      ctx.drawImage(img, Math.round(this.x - 8) - cx, Math.round(this.y - 13) - cy);
    }
  }
  G.Chest = Chest;

  class Sign extends Ent {
    constructor(tx, ty, text) {
      super(tx * 16 + 8, ty * 16 + 14);
      this.text = text;
      this.solid = true;
      this.hb = { w: 14, h: 8 };
    }
    talk() {
      const text = this.text;
      return (function* () {
        const pages = Array.isArray(text) ? text : [text];
        for (const t of pages) yield G.say(null, t);
      })();
    }
    draw(ctx, cx, cy) {
      ctx.drawImage(G.spr.sign, Math.round(this.x - 8) - cx, Math.round(this.y - 13) - cy);
    }
  }
  G.Sign = Sign;
})();
