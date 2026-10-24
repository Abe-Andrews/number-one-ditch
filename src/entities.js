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
      if (this.relayCd > 0) this.relayCd--;
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
        if (this.t >= 12 && this.t <= 26) this.swingHits(w, this.bassRect(), 2);
        if (this.t >= 38) this.state = 'walk';
        return;
      }

      // puffing Dad's pipe: Nate stands still, the world keeps going
      if (this.state === 'pipe') { G.pipe.update(); return; }

      // Abe's reach (the finale): arms up, bonking whatever's over his head
      if (this.state === 'reach') {
        this.t++;
        if (this.t >= 4 && this.t <= 10) G.relayReach(this, w);
        if (this.t >= 16) { this.state = 'walk'; this.pose = this.carry ? 'hold' : null; }
        return;
      }

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
      // (standing in spilled RoFo Pop: sticky, half speed)
      if (this.sticky > 0) this.sticky--;
      const sp = (d.x && d.y ? 1.0 : 1.35) * (this.sticky > 0 ? 0.5 : 1);
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
      // the finale: each of the family has their own move on Z (Lily's is her "No.")
      if (G.state.playAs && G.RELAY_MOVE[G.state.playAs]) { G.RELAY_MOVE[G.state.playAs](this, this.world); return; }
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

    // Fainting (G.play.dying counts the frames): a dizzy spin, a wobble, then he tips
    // over onto his back and the stars come out.
    drawFaint(ctx, cx, cy) {
      const S = this.spr, d = G.play.dying, land = G.FAINT_LAND, start = land - 18;
      const k = d < start ? 0 : Math.min(1, (d - start) / (land - start));
      const wobble = d >= 36 && d < start ? Math.sin((d - 36) * 0.9) * 0.18 : 0;
      const ang = wobble + k * k * (Math.PI / 2);
      drawShadow(ctx, this.x + k * 6, this.y, cx, cy, k > 0.5);
      const flash = d < 36 && (d >> 1) & 1;
      const img = S[this.dir][0];
      ctx.save();
      ctx.translate(Math.round(this.x) - cx, Math.round(this.y) + 1 - cy);
      ctx.rotate(ang);
      ctx.drawImage(flash ? G.art.flash(img) : img, -8, -S.h + 1);
      ctx.restore();
      if (d < land) return;
      // seeing stars, circling his head (which is off to the right once he's down)
      const hx = this.x + S.h - 6 - cx, hy = this.y - 9 - cy;
      for (let i = 0; i < 3; i++) {
        const a = d / 9 + (i * Math.PI * 2) / 3, sx = Math.round(hx + Math.cos(a) * 7), sy = Math.round(hy + Math.sin(a) * 2.5);
        ctx.fillStyle = '#1c1424'; ctx.fillRect(sx - 2, sy - 1, 5, 3); ctx.fillRect(sx - 1, sy - 2, 3, 5);
        ctx.fillStyle = Math.sin(a) > 0 ? '#f8d850' : '#c89838'; ctx.fillRect(sx - 1, sy, 3, 1); ctx.fillRect(sx, sy - 1, 1, 3);
      }
    }

    draw(ctx, cx, cy) {
      if (this.hidden) return;
      const S = this.spr;
      // (fainting comes before the after-hit blink, which would otherwise freeze him invisible)
      if (this.state === 'dead') { this.drawFaint(ctx, cx, cy); return; }
      drawShadow(ctx, this.x, this.y, cx, cy);
      if (this.inv > 0 && this.state !== 'hurt' && (this.inv >> 2) & 1) return;
      let img;
      if (this.pose === 'hold') img = S.hold;
      else img = S[this.dir][this.state === 'walk' ? walkFrame(this.anim, this.moving) : 0];
      // (z: up in the air, e.g. Abe boosting Nate over a hedge)
      const sx = Math.round(this.x - 8) - cx, sy = Math.round(this.y - S.h + 2 - (this.z || 0)) - cy;
      const swinging = this.state === 'swing', bassing = this.state === 'bass';
      if (swinging && this.dir === 'up') this.drawHammer(ctx, cx, cy);
      if (bassing && this.dir === 'up') this.drawBass(ctx, cx, cy);
      const charged = this.state === 'charge' && this.t >= NO_FULL && (G.tick >> 2) & 1;
      ctx.drawImage((this.state === 'hurt' && (this.t >> 1) & 1) || charged ? G.art.flash(img) : img, sx, sy);
      // (Doron, in the finale, with a rock over his head)
      if (this.carry) ctx.drawImage(G.spr.tossRock, sx + 2, sy - 8);
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
        const ic = this.holdIcon, ix = Math.round(this.x - ic.width / 2) - cx, iy = sy - ic.height - 1;
        // a slow burst of light behind whatever Nate just found
        const gx = ix + ic.width / 2, gy = iy + ic.height / 2, t = G.tick * 0.03;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = 'rgba(255,236,160,0.2)';
        for (let i = 0; i < 8; i++) {
          const a = t + (i * Math.PI) / 4, R = i % 2 ? 15 : 20;
          ctx.beginPath(); ctx.moveTo(gx, gy);
          ctx.lineTo(gx + Math.cos(a - 0.14) * R, gy + Math.sin(a - 0.14) * R);
          ctx.lineTo(gx + Math.cos(a + 0.14) * R, gy + Math.sin(a + 0.14) * R);
          ctx.fill();
        }
        ctx.fillStyle = 'rgba(255,248,210,0.22)';
        ctx.beginPath(); ctx.arc(gx, gy, 8, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        ctx.drawImage(ic, ix, iy);
        // and a few twinkles around it
        for (let i = 0; i < 3; i++) {
          const ph = (G.tick + i * 13) % 40;
          if (ph > 14) continue;
          const a = -t * 1.7 + (i * 2 * Math.PI) / 3, R = 12 + (i % 2) * 3, px = Math.round(gx + Math.cos(a) * R), py = Math.round(gy + Math.sin(a) * R);
          ctx.fillStyle = '#ffffff'; ctx.fillRect(px, py, 1, 1);
          if (ph > 3 && ph < 11) { ctx.fillStyle = '#fff4c0'; ctx.fillRect(px - 1, py, 3, 1); ctx.fillRect(px, py - 1, 1, 3); }
        }
      }
      if (this.emote) ctx.drawImage(this.emote, Math.round(this.x - 2) - cx, sy - 12);
      if (G.play.earworm > 0 && G.play.earwormKind === 'hypno') {
        // hypnotized: little purple spirals circling his head
        for (let i = 0; i < 2; i++) {
          const a = G.tick * 0.1 + i * Math.PI, nx = Math.round(this.x + Math.cos(a) * 9) - cx, ny = Math.round(sy - 2 + Math.sin(a) * 3);
          ctx.drawImage(G.spr.hypnoSpiral[(G.tick >> 3) & 1], nx - 6, ny - 6);
        }
      } else if (G.play.earworm > 0) {
        // little pink notes circling his head
        ctx.fillStyle = '#f8a8c8';
        for (let i = 0; i < 3; i++) {
          const a = G.tick * 0.1 + (i * Math.PI * 2) / 3, nx = Math.round(this.x + Math.cos(a) * 9) - cx, ny = Math.round(sy - 2 + Math.sin(a) * 3);
          ctx.fillRect(nx, ny, 2, 2); ctx.fillRect(nx + 1, ny - 3, 1, 3);
        }
      }
      if (G.play.spraying && G.play.sprayLen) {
        // the Portable Bidet in his hand, and the stream arcing out of its nozzle down to the ground
        const len = G.play.sprayLen, b = this.dir === 'left' ? G.spr.bidetHandL : G.spr.bidetHand, [nx, ny] = G.play.bidetNozzle(this);
        for (let d = 0; d < len; d += 2) {
          const [x, y] = G.play.bidetArc(this, d, len), wob = Math.round(Math.sin((G.tick + d) * 0.6) * Math.min(1, d / 24));
          ctx.fillStyle = ((d >> 1) + (G.tick >> 1)) % 3 ? '#a8d8ff' : '#ffffff';
          ctx.fillRect(Math.round(x + (this.dir === 'up' || this.dir === 'down' ? wob : 0)) - cx, Math.round(y + (this.dir === 'left' || this.dir === 'right' ? wob : 0)) - cy, 2, 2);
        }
        ctx.drawImage(b, nx - (this.dir === 'left' ? 0 : b.width - 1) - cx, ny - cy);
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
      // a slow wind-up, then the big sweep
      const k = Math.max(0, Math.min(1, (this.t - 8) / 18)), flip = this.dir === 'left' || this.dir === 'down' ? -1 : 1;
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
      // Mom turns back to her flowers a moment after a chat
      if (this.held === G.spr.wateringCan && this.dir !== this.homeDir) {
        if ((this.backT = (this.backT || 0) + 1) > 45) { this.dir = this.homeDir; this.backT = 0; }
      }
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
      // (offstage until a cutscene brings them in, like the family arriving at the Ditch)
      if (this.hidden) return;
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
      const can = this.held === G.spr.wateringCan;
      if (can && this.dir === 'up') this.drawCan(ctx, cx, cy);
      // (z: up in the air, e.g. Abe leaping out of a bush)
      ctx.drawImage(img, Math.round(this.x - 8) - cx, Math.round(this.y - S.h + 2 - (this.z || 0)) - cy);
      if (can && this.dir !== 'up') this.drawCan(ctx, cx, cy);
      else if (this.held && !can) {
        // (heldAt: [dx, dy] to hold it off to one side, e.g. Mikey's bouquet, so it doesn't cover him)
        const [hx, hy] = this.heldAt || [0, 0];
        ctx.drawImage(this.held, Math.round(this.x - this.held.width / 2 + hx) - cx, Math.round(this.y - S.h + 10 + hy - (this.z || 0)) - cy);
      }
      if (this.emote) ctx.drawImage(this.emote, Math.round(this.x - 2) - cx, Math.round(this.y - S.h - 10) - cy);
    }

    // Mom's watering can, held at her side by the grip; tipped toward whatever
    // she's facing, with water pouring out of the rose while she's not busy.
    drawCan(ctx, cx, cy) {
      const d = this.dir, right = d === 'right', side = d === 'left' || right;
      const img = right ? G.spr.wateringCanR : G.spr.wateringCan;
      const x = Math.round(this.x + (right ? 2 : d === 'left' ? -18 : d === 'down' ? -17 : -4)) - cx;
      const y = Math.round(this.y - 12) - cy;
      ctx.drawImage(img, x, y);
      if (!side || G.script.busy) return;
      const sx = right ? x + 15 : x, sy = y + 12;
      for (let k = 0; k < 5; k++) {
        const ph = (G.tick * 0.6 + k * 3) % 13;
        ctx.fillStyle = k % 2 ? '#a8e0ff' : '#78c8ff';
        ctx.fillRect(sx + (k % 3) - 1, sy + Math.floor(ph), 1, 2);
      }
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
      // (pose 'hold': arms up, e.g. Abe reaching for something way up high)
      ctx.drawImage(this.pose === 'hold' ? S.hold : S[this.dir][walkFrame(this.anim, this.moving)], Math.round(this.x - 8) - cx, Math.round(this.y - S.h + 2) - cy);
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
      ctx.drawImage(G.spr.bouquet, Math.round(this.x - G.spr.bouquet.width / 2 - 7) - cx, sy + 11);
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
    // a beaten house critter never comes back
    markGone() {
      if (!this.goneFlag) return;
      G.state.flags[this.goneFlag] = true;
      if (this.world.ents.every((e) => e === this || e.dead || !e.goneFlag)) this.world.pop(this.x, this.y - 30, 'ALL CLEAR!', '#78e070');
    }
    die() {
      this.markGone();
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

  // ============================================================== ROFO POP (the bay)
  // Blue raspberry 2-liters in the Chesapeake Channel Tunnel. Abe and Hannah bring
  // RoFo Pop from the Eastern Shore every time they visit. Nobody drinks it.
  // A spill of it on the road: sticky, slows Nate to half speed while he's in it.
  class StickyPuddle extends Ent {
    constructor(x, y, big) { super(x, y); this.life = big ? 420 : 300; this.r = 2; this.max = big ? 18 : 12; this.flat = true; }
    update() {
      if (G.script.busy) return;
      if (this.r < this.max) this.r += 0.6;
      if (--this.life <= 0) { this.dead = true; return; }
      const p = G.play.player;
      if (((p.x - this.x) / this.r) ** 2 + ((p.y - 2 - this.y) / (this.r * 0.55)) ** 2 <= 1) {
        if (!p.sticky && G.tick - (this.popT || -99) > 50) { this.popT = G.tick; this.world.pop(p.x, p.y - 30, 'sticky...', '#78c0ff'); }
        p.sticky = 3;
      }
    }
    draw(ctx, cx, cy) {
      const a = Math.min(1, this.life / 60) * 0.85, x = this.x - cx, y = this.y - cy;
      ctx.save(); ctx.globalAlpha = a;
      ctx.fillStyle = '#1a4ea8'; ctx.beginPath(); ctx.ellipse(x, y, this.r + 1, this.r * 0.55 + 1, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2a7ae0'; ctx.beginPath(); ctx.ellipse(x, y, this.r, this.r * 0.55, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#a8d8ff'; ctx.fillRect(Math.round(x - this.r * 0.4), Math.round(y - 1), 2, 1);
      ctx.restore();
    }
  }
  G.StickyPuddle = StickyPuddle;

  // The fizzer: hops after Nate, stops to shake itself up (fizz everywhere), then
  // FWOOSH: a spray of fizz and a sticky puddle. Flat for a bit afterward.
  class RofoPop extends Critter {
    constructor(x, y) {
      super(x, y, 2);
      this.intro = 'rofo';
      this.state = 'hop';
      this.st = 60 + Math.random() * 60;
      this.bits = ['#2a7ae0', '#78c0ff', '#ffffff', '#38a83a'];
      this.dropChance = 0.7;
      this.lift = 0;
      this.reelable = true;
    }
    onHook() { this.called = null; this.fly = null; this.lift = 0; this.touch = false; this.state = 'flat'; this.st = 200; }
    // flung out of the Two-Liter's cap: up from the top of it, an arc, and down where it lands
    launch(tx, ty, n) { this.fly = { x0: this.x, y0: this.y, x1: tx, y1: ty, t: 0, n }; this.touch = false; this.lift = 66; }
    onReeled() { this.state = 'flat'; this.st = 80; this.touch = false; this.lift = 0; this.world.pop(this.x, this.y - 28, '@_@', '#78c0ff'); }
    think(w, p, dx, dy, dist) {
      if (this.carried) { if ((this.carryT = (this.carryT || 0) + 1) > 150) this.carried = false; return; }
      this.carryT = 0;
      if (this.fly) {
        const f = this.fly, k = ++f.t / f.n;
        this.x = f.x0 + (f.x1 - f.x0) * k; this.y = f.y0 + (f.y1 - f.y0) * k;
        this.lift = (1 - k) * 66 + Math.sin(k * Math.PI) * 24;
        if (k >= 1) {
          Object.assign(this, { fly: null, lift: 0, touch: true, state: 'hop', st: 40 + Math.random() * 40 });
          G.audio.sfx('bump');
          w.burst(this.x, this.y, ['#78c0ff', '#ffffff'], 4, { speed: 0.8, up: 0.4, life: 14, size: 1 });
        }
        return;
      }
      // the Two-Liter is calling: waddle back to be poured in
      const boss = this.called;
      if (boss && !boss.dead && boss.state === 'refill' && this.state !== 'flat') {
        const bx = boss.x - this.x, by = boss.y + 6 - this.y, bd = Math.hypot(bx, by) || 1;
        this.hopT = (this.hopT || 0) + 1;
        this.lift = Math.abs(Math.sin(this.hopT * Math.PI / 16)) * 4;
        this.vx = (bx / bd) * 0.9; this.vy = (by / bd) * 0.9; this.step(w);
        if (bd < 18) boss.drink(this);
        return;
      }
      this.called = null;
      if (this.state === 'hop') {
        this.hopT = (this.hopT || 0) + 1;
        this.lift = Math.abs(Math.sin(this.hopT * Math.PI / 24)) * 4;
        if (dist < 150) this.chase(w, dx, dy, dist, 0.5); else this.wander(w, 0.3);
        if (--this.st <= 0 && dist < 100) { this.state = 'shake'; this.st = 48; this.lift = 0; }
      } else if (this.state === 'shake') {
        if (this.st % 4 === 0) w.burst(this.x, this.y - 24, ['#ffffff', '#a8d8ff'], 1, { speed: 0.6, up: 1.2, life: 14, size: 1 });
        if (this.st === 24) G.audio.sfx('fuse');
        if (--this.st <= 0) { this.spray(w, p); this.state = 'flat'; this.st = 70; }
      } else if (--this.st <= 0) { this.state = 'hop'; this.st = 90 + Math.random() * 60; this.touch = true; }
    }
    spray(w, p) {
      const dx = p.x - this.x, dy = p.y - this.y, d = Math.hypot(dx, dy) || 1, a = Math.atan2(dy, dx);
      G.audio.sfx('dash');
      w.pop(this.x, this.y - 32, 'FWOOSH!', '#78c0ff');
      w.burst(this.x, this.y - 22, ['#2a7ae0', '#78c0ff', '#ffffff'], 10, { speed: 1.6, up: 1, g: 0.06, life: 22, size: 2 });
      w.add(new StickyPuddle(this.x + (dx / d) * Math.min(d, 34), this.y + (dy / d) * Math.min(d, 34)));
      for (let i = -1; i <= 1; i++) w.add(new Shot(this.x, this.y - 14, Math.cos(a + i * 0.3) * 1.8, Math.sin(a + i * 0.3) * 1.8, G.spr.fizzDrop, { life: 45, z: 4 }));
    }
    die() {
      super.die();
      // sometimes a bottle survives: drinking it gets a heart back. It does not taste good.
      if (Math.random() < 0.35) this.world.add(new Pickup(this.x + 6, this.y, 'rofo'));
    }
    draw(ctx, cx, cy) {
      const j = this.state === 'shake' ? ((G.tick >> 1) & 1 ? 1 : -1) : 0;
      this.drawSprite(ctx, cx - j, cy, this.state === 'flat' ? G.spr.rofo.flat : G.spr.rofo.idle, this.lift);
    }
  }
  G.RofoPop = RofoPop;

  // THE TWO-LITER: the boss at the end of the Chesapeake Channel Tunnel. A giant RoFo
  // Pop with arms and legs. Slow: it lumbers after Nate and the road thumps with every
  // step. But it hits like a truck: a stomp is a heart, and a fist slam is two. The hard
  // part is the little ones. It keeps popping its cap and flinging more fizzers out, and
  // faster once it's half empty. Running low, it calls them back to pour them in.
  class TwoLiter extends Ent {
    constructor(x, y, bounds) {
      super(x, y);
      Object.assign(this, { enemy: true, boss: true, name: 'THE TWO-LITER', hp: 20, maxHp: 20, hb: { w: 20, h: 10 }, bounds, t: 0,
        state: 'rest', st: 60, stepT: 0, foot: 0, spawnT: 90, slamOk: 0, phase: 1, hurtT: 0, home: { x, y }, pours: [], refillCool: 0, ring: null });
    }
    // (only the little bottles in the arena with it; the ones back down the tunnel can't get here)
    fizzers() { const yMax = this.arenaBottom || 1e9; return this.world.ents.filter((e) => e instanceof RofoPop && !e.dead && e.y < yMax); }
    // a little bottle made it back: picked up, held over the cap and poured in (health back when it's done)
    drink(f) {
      f.dead = true; f.called = null;
      this.pours.push({ t: 0 });
      G.audio.sfx('blip');
      this.world.pop(this.x, this.y - 88, '*slurp*', '#78c0ff');
    }
    hurtBox() { return [this.x - 16, this.y - 70, this.x + 16, this.y]; }
    // its feet: walking into them hurts
    footBox() { return [this.x - 17, this.y - 16, this.x + 17, this.y + 2]; }
    // a fist comes down on either side: everything in this oval gets it
    inSlam(p, grow = 2) { return ((p.x - this.x) / (40 + grow)) ** 2 + ((p.y - this.y - 4) / (22 + grow)) ** 2 <= 1; }
    hit(dmg, sx, sy) {
      if (this.state === 'defeated') return;
      this.hp = Math.max(0, this.hp - dmg);
      this.hurtT = 12;
      G.audio.sfx('hit');
      this.world.burst(this.x, this.y - 40, ['#2a7ae0', '#78c0ff', '#ffffff'], 6, { speed: 1.4, up: 0.6, g: 0.06, life: 24, size: 2 });
      if (Math.random() < 0.3) this.world.pop(this.x, this.y - 84, ['*fzzt*', 'GLUG!', 'FIZZ!', '*sploosh*'][Math.floor(Math.random() * 4)], '#78c0ff');
      if (this.hp <= 0) { this.state = 'defeated'; this.ring = null; G.script.run(G.SCRIPTS.popDefeated(this)); }
    }
    bomb(sx, sy) { this.hit(3, sx, sy); }
    // pops its cap and flings out more little ones
    spawn(force) {
      const hot = this.phase === 2;
      if (!force && this.fizzers().length >= (hot ? 6 : 4)) { this.spawnT = 60; return; }
      Object.assign(this, { state: 'spawn', st: 44, spawnT: hot ? 210 : 300 });
    }
    update(w) {
      if (G.script.busy || this.state === 'defeated') return;
      this.t++;
      const p = G.play.player, b = this.bounds, hot = this.phase === 2;
      if (this.hurtT > 0) this.hurtT--;
      if (this.refillCool > 0) this.refillCool--;
      if (this.phase === 1 && this.hp <= this.maxHp / 2) { this.phase = 2; w.pop(this.x, this.y - 84, 'HALF EMPTY!', '#f86858'); }
      for (const pr of this.pours) {
        if (++pr.t === 26) {
          this.hp = Math.min(this.maxHp, this.hp + 3);
          G.audio.sfx('gulp');
          w.pop(this.x, this.y - 94, '+GLUG!', '#78c0ff');
          w.burst(this.x, this.y - 72, ['#2a7ae0', '#78c0ff'], 6, { speed: 0.8, up: 0.8, life: 16, size: 2 });
        }
      }
      this.pours = this.pours.filter((pr) => pr.t < 34);
      if (this.ring && (this.ring.r += 3) > 52) this.ring = null;
      if (G.overlap(this.footBox(), p.hurtBox())) p.hurt(2, this.x, this.y);
      switch (this.state) {
        case 'walk': {
          // running low: call the little bottles back (fling some out first if there aren't any)
          if (this.hp <= this.maxHp * 0.4 && this.refillCool <= 0) {
            if (this.fizzers().length) {
              Object.assign(this, { state: 'refill', st: 240, refillCool: 480 });
              w.pop(this.x, this.y - 88, 'REFILL TIME!', '#f86858');
              if (!G.state.flags.popRefillHint) G.script.run(G.SCRIPTS.popRefillHint());
            } else { this.spawn(true); this.refillCool = 100; }
            break;
          }
          if (--this.spawnT <= 0) { this.spawn(); if (this.state === 'spawn') break; }
          // close enough to reach: both fists go up
          if (this.t >= this.slamOk && this.inSlam(p, 0)) {
            Object.assign(this, { state: 'windup', st: hot ? 30 : 40 });
            w.pop(this.x, this.y - 88, '!', '#f86858');
            G.audio.sfx('fuse');
            break;
          }
          // lumbering after Nate, one heavy step at a time
          const dx = p.x - this.x, dy = p.y - this.y, d = Math.hypot(dx, dy) || 1, sp = hot ? 0.42 : 0.32;
          this.x = Math.max(b[0], Math.min(b[2], this.x + (dx / d) * sp));
          this.y = Math.max(b[1], Math.min(b[3], this.y + (dy / d) * sp));
          if (++this.stepT >= (hot ? 20 : 24)) {
            this.stepT = 0; this.foot ^= 1;
            G.audio.sfx('bump'); G.play.shake(4, 1);
            w.burst(this.x + (this.foot ? 7 : -7), this.y, ['#8a8a90', '#b0b0b4'], 3, { speed: 0.6, up: 0.3, life: 14, size: 1 });
          }
          break;
        }
        case 'windup':
          if (--this.st <= 0) {
            // SLAM: two hearts if Nate's in it
            G.audio.sfx('boom'); G.play.shake(16, 3);
            w.pop(this.x, this.y - 88, 'SLAM!', '#f86858');
            this.ring = { r: 8 };
            for (const sx of [-22, 22]) w.burst(this.x + sx, this.y + 2, ['#8a8a90', '#b0b0b4', '#78c0ff'], 8, { speed: 1.4, up: 0.8, life: 20, size: 2 });
            if (this.inSlam(p)) p.hurt(4, this.x, this.y - 10);
            if (hot) for (const sx of [-22, 22]) w.add(new StickyPuddle(this.x + sx, this.y + 4));
            Object.assign(this, { state: 'stuck', st: hot ? 45 : 60 });
          }
          break;
        case 'stuck':
          // fists still on the road, catching its breath: the time to get some hits in
          if (this.st === 30) w.pop(this.x, this.y - 84, '*huff*', '#a8d8ff');
          if (--this.st <= 0) Object.assign(this, { state: 'walk', stepT: 0, slamOk: this.t + 50 });
          break;
        case 'spawn':
          if (this.st === 44) { G.audio.sfx('fuse'); w.pop(this.x, this.y - 88, '*shake shake*', '#78c0ff'); }
          if (--this.st === 18) {
            G.audio.sfx('poof'); w.pop(this.x, this.y - 88, '*POP*', '#f4f4f0');
            w.burst(this.x, this.y - 72, ['#ffffff', '#a8d8ff', '#78c0ff'], 8, { speed: 1.2, up: 1.4, life: 20, size: 2 });
            const live = this.fizzers().length, cap = hot ? 6 : 4, yMax = (this.arenaBottom || b[3] + 80) - 20;
            for (let i = 0, n = hot ? 3 : 2; i < n && live + i < cap; i++) {
              const tx = Math.max(b[0] - 6, Math.min(b[2] + 6, this.x + (i - (n - 1) / 2) * 34 + (Math.random() * 2 - 1) * 8));
              const ty = Math.max(b[1] + 8, Math.min(yMax, this.y + 26 + Math.random() * 36));
              const f = w.add(new RofoPop(this.x, this.y + 2));
              f.intro = null; f.launch(tx, ty, 30 + i * 6);
            }
          }
          if (this.st <= 0) Object.assign(this, { state: 'walk', stepT: 0 });
          break;
        case 'refill': {
          // stands still and calls them in; the ones Nate hooks away (or bonks) don't make it
          const live = this.fizzers().filter((f) => !f.carried && !f.fly && f.state !== 'flat');
          for (const f of live) f.called = this;
          if (this.t % 20 === 0) w.pop(this.x + (Math.random() * 20 - 10), this.y - 90, '*glug glug*', '#78c0ff');
          if (--this.st <= 0 || (!live.length && !this.pours.length)) { for (const f of this.fizzers()) f.called = null; Object.assign(this, { state: 'walk', stepT: 0 }); }
          break;
        }
        case 'rest':
          if (--this.st <= 0) Object.assign(this, { state: 'walk', stepT: 0 });
          break;
      }
    }
    // the ground under the slam: a warning while the fists are up, then the shockwave
    drawGround(ctx, cx, cy) {
      const x = Math.round(this.x) - cx, y = Math.round(this.y + 4) - cy;
      ctx.save();
      if (this.state === 'windup') {
        ctx.globalAlpha = (G.tick >> 2) & 1 ? 0.45 : 0.25;
        ctx.fillStyle = '#f86858'; ctx.beginPath(); ctx.ellipse(x, y, 42, 24, 0, 0, Math.PI * 2); ctx.fill();
      }
      if (this.ring) {
        ctx.globalAlpha = Math.max(0, 1 - this.ring.r / 52); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(x, y, this.ring.r, this.ring.r * 0.55, 0, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.restore();
    }
    draw(ctx, cx, cy) {
      const S = G.spr.twoLiter, st = this.state, shake = (G.tick >> 1) & 1 ? 1 : -1;
      let pose = 'stand', jx = 0, bob = 0;
      if (st === 'defeated') pose = 'flat';
      else if (this.pours.length) pose = 'pour';
      else if (st === 'walk') { pose = this.foot ? 'walk2' : 'walk1'; bob = this.stepT < 5 ? 1 : 0; }
      else if (st === 'windup') { pose = 'raise'; jx = shake; }
      else if (st === 'stuck') pose = 'slam';
      else if (st === 'spawn' && this.st > 18) jx = shake;
      let img = S[pose];
      if (this.hurtT && (this.hurtT >> 1) & 1) img = G.art.flash(img);
      ctx.drawImage(G.spr.shadowBig, Math.round(this.x - 22) - cx, Math.round(this.y - 4) - cy, 44, 7);
      ctx.drawImage(img, Math.round(this.x - img.width / 2 + jx) - cx, Math.round(this.y - img.height + 2 + bob) - cy);
      // a little bottle in the raised glove, tipped over the cap and poured in
      const b = G.spr.rofo.idle;
      for (const pr of this.pours) {
        const k = Math.min(1, pr.t / 26), a = -2.2 * Math.min(1, k * 1.6), hx = Math.round(this.x + 13) - cx, hy = Math.round(this.y - 80) - cy;
        ctx.save(); ctx.translate(hx, hy); ctx.rotate(a); ctx.drawImage(b, -b.width / 2, -b.height / 2); ctx.restore();
        if (k > 0.6 && pr.t < 30) {
          const mx = Math.round(hx + Math.sin(a) * 11), my = Math.round(hy - Math.cos(a) * 11);
          ctx.fillStyle = '#2a7ae0'; ctx.fillRect(mx - 1, my, 2, Math.max(1, Math.round(this.y - 73) - cy - my));
        }
      }
    }
  }
  G.TwoLiter = TwoLiter;
  // the Two-Liter's slam warning and shockwave, drawn flat on the road under everything
  class SlamZone extends Ent {
    constructor(boss) { super(boss.x, boss.y); this.boss = boss; this.flat = true; }
    update() { const b = this.boss; this.x = b.x; this.y = b.y; if (b.dead || b.state === 'defeated') this.dead = true; }
    draw(ctx, cx, cy) { this.boss.drawGround(ctx, cx, cy); }
  }
  G.SlamZone = SlamZone;

  // ============================================================== ROMULUS
  // Abe and Hannah's border collie. He isn't scared of anybody... except Nate. In the condo
  // he hides behind the breakfast bar and trembles whenever Nate gets close.
  const RUN = ['run1', 'run2', 'run3', 'run2'];
  class Romulus extends Ent {
    constructor(x, y, state) {
      super(x, y);
      Object.assign(this, { state: state || 'hide', face: 1, dir: 'right', solid: true, hb: { w: 20, h: 6 }, anim: 0, t: 0, near: false });
      this.talk = () => (this.chase ? G.SCRIPTS.romulusFound(this) : G.SCRIPTS.romulusTalk(this));
    }
    // outside, in the hide and seek, he's out of sight in a bush or under a car (this.hidden):
    // checking that spot (Z) or spraying it finds him
    box() { return this.hidden ? this.hidden.box : super.box(); }
    update(w) {
      this.t++;
      if (this.dir === 'left' || this.dir === 'right') this.face = this.dir === 'right' ? 1 : -1;
      if (this.walking || G.script.busy) return;
      const p = G.play.player, dist = Math.hypot(p.x - this.x, p.y - this.y);
      this.near = dist < 60;
      // hide and seek: get close and he bolts (and he whimpers now and then when Nate's nearby)
      if (this.chase && this.hidden) {
        // he whimpers now and then: up close, right from his hiding spot; further off, Nate just
        // hears it (and bushes rustle when he's close)
        const [hx, hy] = this.hidden.c, d = Math.hypot(p.x - hx, p.y - hy);
        if (this.t % 150 === 0) {
          if (d < 64) w.pop(hx, hy - 20, '*whimper*', '#c8c8d0');
          else if (d < 140) w.pop(p.x, p.y - 36, '*a faint whimper*', '#8a8a98');
        }
        if (this.hidden.leafy && d < 64 && this.t % 150 === 75) w.burst(hx, hy - 8, ['#3a7a34', '#5a9a44'], 3, { speed: 0.6, up: 0.6, g: 0.08, life: 16, size: 1 });
        return;
      }
      if (this.chase) {
        if (dist < 34) { G.script.run(G.SCRIPTS.romulusFound(this)); return; }
        if (dist < 110 && this.t % 120 === 0) w.pop(this.x, this.y - 26, '*whimper*', '#c8c8d0');
        this.dir = p.x > this.x ? 'right' : 'left';
        return;
      }
      if (this.state === 'hide') {
        // keeps one eye on Nate at all times
        this.dir = p.x > this.x ? 'right' : 'left';
        if (this.near && this.t % 100 === 0) w.pop(this.x, this.y - 26, '*whimper*', '#c8c8d0');
      }
    }
    // the bidet: he HATES it
    onSpray() {
      if (this.chase) { if (!G.script.busy) G.script.run(G.SCRIPTS.romulusFound(this)); return; }
      if ((this.whineT = (this.whineT || 0) - 1) > 0) return;
      this.whineT = 60;
      G.audio.sfx('whine');
      this.world.pop(this.x, this.y - 26, '*WHINE*', '#a8d8ff');
    }
    draw(ctx, cx, cy) {
      if (this.hidden) return;
      const S = G.spr.romulus[this.face > 0 ? 'right' : 'left'];
      const img = this.walking ? S[RUN[(this.anim >> 2) % 4]] : S[{ lie: 'lie', happy: 'happy', alert: 'stand' }[this.state] || 'scared'];
      const j = this.state === 'hide' && this.near && !this.walking ? (G.tick >> 1) & 1 : 0;
      drawShadow(ctx, this.x, this.y, cx, cy, false);
      ctx.drawImage(img, Math.round(this.x - img.width / 2 + j) - cx, Math.round(this.y - 22) - cy);
    }
  }
  G.Romulus = Romulus;

  // One of Anette's thirsty potted plants on the condo street. A good soak from the
  // Portable Bidet (about half a second of spray) perks it right up, for good.
  class ThirstyPlant extends Ent {
    constructor(x, y, o) {
      super(x, y);
      Object.assign(this, o, { solid: true, hb: { w: 12, h: 6 }, water: 0 });
      this.talk = () => G.SCRIPTS.plantLook(this);
    }
    get happy() { return !!G.state.flags['plant_' + this.id]; }
    onSpray() {
      if (this.happy) return;
      const w = this.world;
      if (++this.water % 5 === 0) w.burst(this.x, this.y - 12, ['#5aa8e8', '#a8d8ff'], 2, { speed: 0.6, up: 0.4, g: 0.1, life: 14, size: 1 });
      if (this.water < 30) return;
      G.state.flags['plant_' + this.id] = true;
      G.audio.sfx('heart');
      w.burst(this.x, this.y - 12, ['#78e070', '#f8f8a0', '#ffffff'], 12, { speed: 1.2, up: 1, g: 0.05, life: 22, size: 2 });
      const n = G.plantsWatered();
      w.pop(this.x, this.y - 30, n >= 5 ? 'All five! Go tell Anette.' : G.sayable(n) + ' of 5 watered!', '#78e070');
    }
    draw(ctx, cx, cy) {
      const img = G.spr.plants[this.kind][this.happy ? 1 : 0];
      drawShadow(ctx, this.x, this.y, cx, cy, false);
      ctx.drawImage(img, Math.round(this.x - img.width / 2) - cx, Math.round(this.y - img.height + 2) - cy);
    }
  }
  G.ThirstyPlant = ThirstyPlant;

  // A golfer on the course. During the Romulus fight they tee off at Nate (FORE!), with a
  // mark on the grass where each ball is coming down. A blast from the bidet makes them
  // stop for a bit. Once the fight is over they're just people playing golf.
  class Golfer extends Ent {
    constructor(o) {
      super(o.x, o.y);
      Object.assign(this, { dir: 'down' }, o, { solid: true, hb: { w: 12, h: 8 }, t: 0, swingT: 0, cool: o.delay || 120, stunT: 0 });
    }
    get S() { return G.sprites[this.sprite]; }
    update(w) {
      if (G.script.busy) return;
      this.t++;
      if (this.stunT > 0) { this.stunT--; return; }
      const p = G.play.player, r = w.romulus, on = w.romFight && r && !['pose', 'defeated'].includes(r.state);
      this.dir = Math.abs(p.x - this.x) > Math.abs(p.y - this.y) ? (p.x > this.x ? 'right' : 'left') : p.y > this.y ? 'down' : 'up';
      if (!on) return;
      if (this.swingT > 0) {
        // the backswing... and the follow-through
        if (--this.swingT === 10) {
          G.audio.sfx('clank');
          w.add(new GolfShot(this.x, this.y - 8, p.x + G.play.player.ivx * 18, p.y + G.play.player.ivy * 18));
        }
        return;
      }
      if (--this.cool <= 0) {
        this.swingT = 34;
        this.cool = 200 - (r ? r.heat : 1) * 25 + Math.floor(Math.random() * 60);
        w.pop(this.x, this.y - 34, 'FORE!', '#f8f8f0');
      }
    }
    onSpray() {
      if (this.stunT > 0) { this.stunT = Math.max(this.stunT, 120); return; }
      this.stunT = 180; this.swingT = 0;
      this.world.pop(this.x, this.y - 34, ['HEY!', 'Kid! Seriously?!', 'Is that a BIDET?'][this.t % 3], '#f8f8f0');
    }
    draw(ctx, cx, cy) {
      const S = this.S, img = S[this.dir][0];
      drawShadow(ctx, this.x, this.y, cx, cy, false);
      ctx.drawImage(img, Math.round(this.x - img.width / 2) - cx, Math.round(this.y - S.h + 2) - cy);
      // the club: up behind the head on the backswing, then whipping through
      const k = this.swingT > 10 ? (34 - this.swingT) / 24 : this.swingT > 0 ? 1 + (10 - this.swingT) / 10 : 0;
      const a = Math.PI * 0.6 - k * Math.PI * 1.2 * (k > 1 ? 1.4 : 1), hx = Math.round(this.x + 3) - cx, hy = Math.round(this.y - 12) - cy;
      ctx.strokeStyle = '#c8ccd2'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + Math.round(Math.cos(a) * 12), hy + Math.round(Math.sin(a) * 12)); ctx.stroke();
      if (this.stunT > 0) { ctx.fillStyle = '#a8d8ff'; if ((G.tick >> 3) & 1) ctx.fillRect(Math.round(this.x - 4) - cx, Math.round(this.y - S.h) - cy, 2, 3); }
    }
  }
  G.Golfer = Golfer;

  // A golf ball teed off at Nate: a high arc, its shadow growing on the grass where it'll land.
  class GolfShot extends Ent {
    constructor(x, y, tx, ty) {
      super(x, y);
      Object.assign(this, { fx: x, fy: y, tx, ty, t: 0, n: 58, z: 0, landed: 0, flat: false });
    }
    update() {
      if (G.script.busy) return;
      if (this.landed) { if (++this.landed > 50) this.dead = true; return; }
      const k = ++this.t / this.n;
      this.x = this.fx + (this.tx - this.fx) * k; this.y = this.fy + (this.ty - this.fy) * k;
      this.z = Math.sin(k * Math.PI) * 54;
      if (k >= 1) {
        this.z = 0; this.landed = 1;
        G.audio.sfx('bump');
        const p = G.play.player;
        if (Math.abs(p.x - this.x) < 9 && Math.abs(p.y - 4 - this.y) < 9) p.hurt(1, this.x, this.y - 6);
      }
    }
    draw(ctx, cx, cy) {
      const img = G.spr.golfBall;
      if (!this.landed) {
        // where it's coming down
        const k = this.t / this.n, r = 3 + k * 5;
        ctx.save(); ctx.globalAlpha = 0.25 + k * 0.45; ctx.strokeStyle = '#f86858'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(Math.round(this.tx) - cx, Math.round(this.ty) - cy, r, r * 0.55, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
        drawShadow(ctx, this.x, this.y, cx, cy, false);
      } else if (this.landed > 30 && (this.landed >> 1) & 1) return;
      ctx.drawImage(img, Math.round(this.x - 2) - cx, Math.round(this.y - 5 - this.z) - cy);
    }
  }
  G.GolfShot = GolfShot;

  // A bark: a ring that rolls out across the grass (once per ring, it knocks Nate back).
  class BarkRing extends Ent {
    constructor(x, y, max, color) { super(x, y); Object.assign(this, { r: 8, max, flat: true, done: false, color: color || '#f8f8f0' }); }
    update() {
      if (G.script.busy) return;
      this.r += 2.6;
      const p = G.play.player, d = Math.hypot(p.x - this.x, (p.y - this.y) * 1.4);
      if (!this.done && Math.abs(d - this.r) < 7) { this.done = true; p.hurt(1, this.x, this.y); }
      if (this.r > this.max) this.dead = true;
    }
    draw(ctx, cx, cy) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - this.r / this.max) * 0.9;
      ctx.strokeStyle = this.color; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(this.x - cx, this.y - cy, this.r, this.r / 1.4, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
  }
  G.BarkRing = BarkRing;

  // ROMULUS, HUGE: on the golf course, the size of a golf cart. Nate never hits him (the
  // hammer just gets "Nate would NEVER hit a dog"). But Romulus hates water (he really
  // does), so Nate sprays him with the Portable Bidet: hold X. A steady spray pins him
  // down, cowering and whining; soak him enough and he yelps and shrinks a size. Three
  // sizes and he's back to normal. The bidet runs dry fast; Nate refills it at the pond
  // (Romulus won't go near the water). On his own he circles Nate, stalks him (the border
  // collie crouch) and dashes to herd him, does zoomies laps around the course, and barks
  // shockwaves. A dash or zoomies can't be stopped: he's too fired up.
  class GiantRomulus extends Ent {
    constructor(x, y, arena) {
      super(x, y);
      Object.assign(this, { enemy: true, boss: true, name: 'ROMULUS', hp: 3, maxHp: 3, stage: 3, wet: 0, arena, t: 0, state: 'pose', st: 0, face: -1,
        anim: 0, z: 0, cycle: 0, orbit: 0, hb: { w: 40, h: 12 }, hitMsgT: 0, vx: 0, vy: 0, soakT: 0, whineT: 0 });
    }
    get s() { return this.stage + 1; }
    // how worked up he is: 1 when he's huge, 3 when he's down to the last size
    get heat() { return 4 - Math.max(1, this.stage); }
    // how much spraying it takes to shrink him a size (in frames of spray)
    get need() { return [90, 75, 60][this.heat - 1]; }
    footBox() { const s = this.s; return [this.x - 10 * s, this.y - 5 * s, this.x + 10 * s, this.y + 2]; }
    hurtBox() { const s = this.s; return [this.x - 11 * s, this.y - 18 * s, this.x + 11 * s, this.y]; }
    hit() {
      if (this.state === 'defeated') return;
      G.audio.sfx('bump');
      if (this.hitMsgT > 0) return;
      this.hitMsgT = 150;
      const p = G.play.player;
      this.world.pop(p.x, p.y - 34, ['Nate would NEVER hit a dog.', 'Not Romulus. Never.', 'He\'s a GOOD BOY.'][this.cycle % 3], '#f8f8f0');
    }
    bomb() { this.hit(); }
    onHook() { this.world.pop(this.x, this.y - 22 * this.s, 'WAY too big to reel in.', '#f8f8f0'); return false; }
    // the bidet: called every frame the spray is on him
    onSpray() {
      if (['yelp', 'flee', 'defeated', 'pose'].includes(this.state)) return;
      const w = this.world;
      this.wet++;
      this.hp = this.stage - this.wet / this.need;
      if (--this.whineT <= 0) {
        this.whineT = 36;
        G.audio.sfx('whine');
        w.pop(this.x + (Math.random() * 16 - 8) * this.s, this.y - 22 * this.s, ['*whine*', 'NO BATH!', '*WHIMPER*', '*whine whine*'][this.cycle++ % 4], '#a8d8ff');
      }
      if (this.wet >= this.need) { this.yelp(); return; }
      if (this.state === 'dash' || this.state === 'zoomies') return;
      if (this.state !== 'soaked') { this.state = 'soaked'; if (!G.state.flags.romSoakHint) G.script.run(G.SCRIPTS.romulusHint('soak')); }
      this.soakT = 16;
    }
    yelp() {
      Object.assign(this, { state: 'yelp', st: 44 });
      G.audio.sfx('yelp');
      this.world.pop(this.x, this.y - 24 * this.s, 'YELP!', '#f8f8f0');
    }
    // move by (vx, vy) inside the course, sliding around the pond (he won't go near the water)
    nearPond(x, y) { const P = this.arena.pond; return ((x - P.x) / (P.rx + 10)) ** 2 + ((y - P.y) / (P.ry + 10)) ** 2 < 1; }
    step(vx, vy) {
      const A = this.arena, nx = Math.max(A.x0, Math.min(A.x1, this.x + vx)), ny = Math.max(A.y0, Math.min(A.y1, this.y + vy));
      if (Math.abs(vx) > 0.2) this.face = vx > 0 ? 1 : -1;
      this.anim += Math.min(2, Math.hypot(vx, vy) * 0.6);
      if (this.nearPond(nx, ny)) {
        if (!this.nearPond(nx, this.y)) { this.x = nx; return true; }
        if (!this.nearPond(this.x, ny)) { this.y = ny; return true; }
        return false;
      }
      const free = nx === this.x + vx && ny === this.y + vy;
      this.x = nx; this.y = ny;
      return free;
    }
    go(tx, ty, sp) {
      const dx = tx - this.x, dy = ty - this.y, d = Math.hypot(dx, dy);
      if (d <= sp) { this.step(dx, dy); return true; }
      this.step((dx / d) * sp, (dy / d) * sp);
      return false;
    }
    toRoam(n) { Object.assign(this, { state: 'roam', st: n, orbit: Math.atan2(this.y - G.play.player.y, this.x - G.play.player.x) }); }
    pickAttack() {
      const order = ['stalk', 'bark', 'zoomies', 'stalk', 'bark', 'stalk'], m = order[this.cycle++ % order.length], h = this.heat;
      if (m === 'stalk') { Object.assign(this, { state: 'stalk', st: [52, 44, 36][h - 1] }); this.world.pop(this.x, this.y - 22 * this.s, '!', '#f86858'); }
      else if (m === 'bark') Object.assign(this, { state: 'bark', st: h === 3 ? 80 : 50 });
      else {
        const A = this.arena;
        Object.assign(this, { state: 'zoomies', st: 150 + h * 20, zDir: Math.random() < 0.5 ? 1 : -1, zA: Math.atan2(this.y - (A.y0 + A.y1) / 2, this.x - (A.x0 + A.x1) / 2) });
        this.world.pop(this.x, this.y - 22 * this.s, 'ZOOMIES!', '#f8d850');
      }
    }
    update(w) {
      if (G.script.busy || this.state === 'defeated' || this.state === 'pose') return;
      this.t++;
      if (this.hitMsgT > 0) this.hitMsgT--;
      const p = G.play.player, dx = p.x - this.x, dy = p.y - this.y, dist = Math.hypot(dx, dy) || 1, s = this.s, h = this.heat;
      // bumping into him: a dash or zoomies knocks Nate flat; otherwise he just nudges him away
      if (G.overlap(this.footBox(), p.hurtBox())) {
        if (['dash', 'skid', 'zoomies'].includes(this.state)) p.hurt(2, this.x, this.y);
        else w.move(p, Math.sign(dx || 1) * 1.6, Math.sign(dy || 1) * 0.6);
      }
      switch (this.state) {
        case 'roam': {
          // trots in a wide circle around Nate, keeping him herded
          this.orbit += (0.01 + 0.004 * h) * (this.cycle % 2 ? 1 : -1);
          const R = 96 - h * 8;
          this.go(p.x + Math.cos(this.orbit) * R, p.y + Math.sin(this.orbit) * R * 0.7, 1.1 + 0.3 * h);
          if (--this.st <= 0) this.pickAttack();
          break;
        }
        case 'stalk':
          // the border collie crouch: eyes locked on Nate, then he goes
          this.face = dx > 0 ? 1 : -1;
          if (--this.st <= 0) { const sp = 3.6 + 0.5 * h; Object.assign(this, { state: 'dash', st: 46, vx: (dx / dist) * sp, vy: (dy / dist) * sp }); G.audio.sfx('dash'); }
          break;
        case 'dash':
          if (this.t % 4 === 0) w.burst(this.x - this.face * 8 * s, this.y, ['#4a8a34', '#6aa848', '#7a5a38'], 2, { speed: 1, up: 1, g: 0.12, life: 18, size: 2 });
          if (!this.step(this.vx, this.vy) || --this.st <= 0) Object.assign(this, { state: 'skid', st: 22 });
          break;
        case 'skid':
          this.vx *= 0.86; this.vy *= 0.86; this.step(this.vx, this.vy);
          if (--this.st <= 0) this.toRoam(110 - h * 15);
          break;
        case 'zoomies': {
          // laps around the course at full tilt
          const A = this.arena, cx = (A.x0 + A.x1) / 2, cy = (A.y0 + A.y1) / 2;
          this.zA += (0.032 + 0.006 * h) * this.zDir;
          this.go(cx + Math.cos(this.zA) * (A.x1 - A.x0) * 0.4, cy + Math.sin(this.zA) * (A.y1 - A.y0) * 0.38, 4 + h * 0.4);
          if (this.t % 5 === 0) w.burst(this.x, this.y, ['#4a8a34', '#6aa848'], 2, { speed: 1, up: 1, g: 0.12, life: 16, size: 2 });
          if (--this.st <= 0) this.toRoam(100 - h * 15);
          break;
        }
        case 'bark':
          this.face = dx > 0 ? 1 : -1;
          if (this.st % 30 === 10 && this.st > 0) {
            G.audio.sfx('woof'); G.play.shake(6, 2);
            w.pop(this.x + this.face * 10 * s, this.y - 22 * s, 'WOOF!', '#f8f8f0');
            w.add(new BarkRing(this.x + this.face * 8 * s, this.y - 2, 88 + h * 14));
          }
          if (--this.st <= 0) this.toRoam(100 - h * 15);
          break;
        case 'soaked':
          // cowering while the water's on him, dripping
          if (this.t % 4 === 0) w.burst(this.x + (Math.random() * 16 - 8) * s, this.y - 12 * s, ['#5aa8e8', '#a8d8ff', '#ffffff'], 2, { speed: 0.6, up: 0.2, g: 0.12, life: 18, size: 2 });
          if (--this.soakT <= 0) Object.assign(this, { state: 'shake', st: [50, 42, 34][h - 1] });
          break;
        case 'shake':
          // shaking it off (he hates this SO much)
          if (this.st % 6 === 0) w.burst(this.x, this.y - 10 * s, ['#5aa8e8', '#a8d8ff', '#ffffff'], 6, { speed: 2.2, up: 1, g: 0.1, life: 20, size: 2 });
          if (this.st % 24 === 0) w.pop(this.x, this.y - 22 * s, '*shake shake*', '#a8d8ff');
          if (--this.st <= 0) Object.assign(this, { state: 'flee', st: 50 });
          break;
        case 'yelp': {
          // jumps straight up, and comes down a size smaller
          const k = 1 - this.st / 44;
          this.z = Math.sin(k * Math.PI) * 12 * s;
          if (this.st === 22) {
            this.stage--; this.wet = 0; this.hp = this.stage;
            G.audio.sfx('poof');
            w.burst(this.x, this.y - 10 * this.s, ['#ffffff', '#e8e8f0', '#c8c8d8'], 18, { speed: 2, life: 26, size: 3 });
            if (this.stage <= 0) { Object.assign(this, { state: 'defeated', z: 0 }); G.script.run(G.SCRIPTS.romulusBeaten(this)); return; }
          }
          if (--this.st <= 0) {
            this.z = 0;
            Object.assign(this, { state: 'flee', st: 70 });
            if (this.stage === 2) G.script.run(G.SCRIPTS.romulusHint('shrink'));
          }
          break;
        }
        case 'flee':
          this.go(this.x - (dx / dist) * 100, this.y - (dy / dist) * 100, 3.4);
          if (--this.st <= 0) this.toRoam(60);
          break;
      }
    }
    draw(ctx, cx, cy) {
      const s = this.s, set = this.stage <= 0 ? G.spr.romulus : G.spr.romulusBig[s], st = this.state;
      if (this.walking && (this.dir === 'left' || this.dir === 'right')) this.face = this.dir === 'right' ? 1 : -1;
      const dir = this.face > 0 ? 'right' : 'left', run = RUN[Math.floor(this.anim / 5) % 4];
      let pose = this.pose || 'stand', jx = 0;
      if (st === 'defeated') pose = this.pose || (this.walking ? RUN[(this.anim >> 2) % 4] : 'stand');
      else if (['roam', 'dash', 'zoomies'].includes(st)) pose = run;
      else if (st === 'flee' || st === 'yelp') pose = st === 'flee' ? run : 'scared';
      else if (st === 'stalk' || st === 'skid') pose = 'stalk';
      else if (st === 'bark') pose = this.st % 30 < 16 ? 'bark' : 'stand';
      else if (st === 'soaked') { pose = 'scared'; jx = (G.tick >> 1) & 1 ? 1 : -1; }
      else if (st === 'shake') { pose = 'stand'; jx = (G.tick >> 1) & 1 ? 2 : -2; }
      const img = set[dir][pose] || set[dir].stand;
      if (this.stage <= 0) drawShadow(ctx, this.x, this.y, cx, cy, true);
      else { ctx.fillStyle = 'rgba(20,40,20,0.28)'; ctx.beginPath(); ctx.ellipse(Math.round(this.x) - cx, Math.round(this.y) - cy, 10 * s, 2.2 * s, 0, 0, Math.PI * 2); ctx.fill(); }
      ctx.drawImage(img, Math.round(this.x - img.width / 2 + jx) - cx, Math.round(this.y - 22.1 * s - this.z) - cy);
    }
  }
  G.GiantRomulus = GiantRomulus;

  // ============================================================== CHKD: the hypnotized babies
  // Father Eggmas hypnotized the whole children's hospital, babies and all. They crawl after
  // Nate (fast, for babies), and now and then sit back and WAAAH: a ring of crying rolls out.
  // A bonk doesn't hurt them, it snaps them out of it: a giggle, a yawn, and they doze right
  // off (poof, back to the nursery). The badge baby is teething on Hannah's work badge, and
  // crawls away from Nate around the playroom.
  class HypnoBaby extends Critter {
    constructor(x, y, kind = 'blue', o = {}) {
      super(x, y, 1);
      Object.assign(this, { kind, state: 'crawl', st: 90 + Math.random() * 90, face: 1, bits: ['#f8f8f0', '#a85ae8', '#f8c8e8'], dropChance: 0.45, intro: 'baby' }, o);
    }
    hurtBox() { return [this.x - 9, this.y - 13, this.x + 9, this.y]; }
    think(w, p, dx, dy, dist) {
      if (this.badge) {
        if (dist < 72) { this.vx = -(dx / dist) * 1.05; this.vy = -(dy / dist) * 1.05; this.step(w); }
        else this.wander(w, 0.35);
        if (this.vx) this.face = this.vx > 0 ? 1 : -1;
        if (this.t % 170 === 0) w.pop(this.x, this.y - 22, '*chomp chomp*', '#f8c8e8');
        return;
      }
      if (this.state === 'crawl') {
        if (dist < 140) this.chase(w, dx, dy, dist, 0.62); else this.wander(w, 0.3);
        if (this.vx) this.face = this.vx > 0 ? 1 : -1;
        if (--this.st <= 0 && dist < 110) { this.state = 'cry'; this.st = 50; this.face = dx > 0 ? 1 : -1; }
      } else if (this.state === 'cry') {
        if (this.st === 40) {
          G.audio.sfx('wah');
          w.pop(this.x, this.y - 24, 'WAAAH!', '#a8d8ff');
          w.add(new BarkRing(this.x, this.y - 2, 60, '#a8d8ff'));
        }
        if (--this.st <= 0) { this.state = 'crawl'; this.st = 130 + Math.random() * 90; }
      }
    }
    die() {
      this.dead = true;
      G.audio.sfx('giggle');
      this.world.pop(this.x, this.y - 22, ['*giggle*', 'goo goo!', '*yawn*', 'ba!'][Math.floor(Math.random() * 4)], '#f8c8e8');
      this.world.burst(this.x, this.y - 8, this.bits, 10, { speed: 1, up: 0.8, life: 22, size: 2 });
      this.markGone();
      if (!this.badge) G.play.maybeDrop(this.x, this.y, this.dropChance);
      if (this.onBonk) this.onBonk(this);
    }
    draw(ctx, cx, cy) {
      const S = G.spr.babies[this.badge ? 'badge' : this.kind], r = this.face > 0;
      const img = this.state === 'cry' ? (r ? S.cryR : S.cryL) : (r ? S.right : S.left)[(this.t >> 3) & 1];
      this.drawSprite(ctx, cx, cy, img, this.state === 'cry' ? 0 : (this.t >> 3) & 1);
    }
  }
  G.HypnoBaby = HypnoBaby;

  // A baby in a rolling hospital bassinet, racing up and down the ward hallway. It picks up speed
  // when Nate's in its lane. Two bonks stop it (and the baby giggles and dozes off).
  class BassinetBaby extends Critter {
    constructor(x, y, dir) {
      super(x, y, 2);
      Object.assign(this, { dir: dir || 1, heavy: true, bits: ['#f8f8f0', '#cfe6f2', '#a85ae8'], dropChance: 0.6, intro: 'bassinet' });
    }
    hurtBox() { return [this.x - 11, this.y - 18, this.x + 11, this.y]; }
    think(w, p, dx, dy, dist) {
      const inLane = Math.abs(dy) < 18 && Math.sign(dx) === this.dir;
      const sp = inLane ? 2.4 : 1;
      const h = w.move(this, this.dir * sp, 0);
      if (h.hitX) { this.dir = -this.dir; G.audio.sfx('bump'); }
      if (inLane && this.t % 50 === 0) w.pop(this.x, this.y - 28, 'WHEEE!', '#a8d8ff');
    }
    die() {
      this.dead = true;
      G.audio.sfx('giggle');
      this.world.pop(this.x, this.y - 26, '*giggle*', '#f8c8e8');
      this.world.burst(this.x, this.y - 10, this.bits, 12, { speed: 1, up: 0.8, life: 22, size: 2 });
      G.play.maybeDrop(this.x, this.y, this.dropChance);
    }
    draw(ctx, cx, cy) {
      const img = G.spr.bassinetBaby, jx = (this.t >> 2) & 1;
      this.drawSprite(ctx, cx, cy, img, jx);
    }
  }
  G.BassinetBaby = BassinetBaby;

  // Hypnosis (the mech's antenna): Nate's controls flip for a couple of seconds (no damage).
  // It's the same flipped-controls effect as a song stuck in his head (G.play.earworm), but
  // with spirals circling his head instead of notes.
  G.hypnotize = (w, n = 150) => {
    const p = G.play.player;
    if (p.inv > 0 || p.state === 'dead' || G.play.earworm > 20) return false;
    G.play.earworm = n; G.play.earwormKind = 'hypno';
    G.audio.sfx('whine');
    w.pop(p.x, p.y - 38, 'HYPNOTIZED!', '#c898ff'); w.pop(p.x, p.y - 28, 'controls flipped!', '#a8a0d8');
    w.burst(p.x, p.y - 20, ['#a85ae8', '#f8f0ff'], 8, { speed: 1, life: 18, size: 2 });
    return true;
  };

  // A hypno-spiral from the mech's antenna: drifts after Nate. One touch and he's hypnotized.
  class HypnoShot extends Ent {
    constructor(x, y, vx, vy) { super(x, y); Object.assign(this, { vx, vy, life: 210, z: 10 }); }
    update(w) {
      if (G.script.busy) return;
      const p = G.play.player, dx = p.x - this.x, dy = p.y - 6 - this.y, d = Math.hypot(dx, dy) || 1;
      this.vx += (dx / d) * 0.025; this.vy += (dy / d) * 0.025;
      const sp = Math.hypot(this.vx, this.vy); if (sp > 1.35) { this.vx *= 1.35 / sp; this.vy *= 1.35 / sp; }
      this.x += this.vx; this.y += this.vy;
      if (--this.life <= 0) { this.dead = true; return; }
      if (G.overlap([this.x - 5, this.y - 6, this.x + 5, this.y + 2], p.hurtBox())) { this.dead = true; G.hypnotize(w); }
    }
    draw(ctx, cx, cy) {
      const img = G.spr.hypnoSpiral[(this.life >> 3) & 1];
      ctx.drawImage(img, Math.round(this.x - 6) - cx, Math.round(this.y - 6 - this.z) - cy);
    }
  }
  G.HypnoShot = HypnoShot;

  // A hypno-wave: a purple ring rolling out from the mech. Jump the gap... or get hypnotized.
  class HypnoRing extends Ent {
    constructor(x, y, max) { super(x, y); Object.assign(this, { r: 10, max, flat: true, done: false }); }
    update(w) {
      if (G.script.busy) return;
      this.r += 1.9;
      const p = G.play.player, d = Math.hypot(p.x - this.x, (p.y - this.y) * 1.4);
      if (!this.done && Math.abs(d - this.r) < 6) { this.done = true; G.hypnotize(w, 170); }
      if (this.r > this.max) this.dead = true;
    }
    draw(ctx, cx, cy) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - this.r / this.max) * 0.95;
      for (let i = 0; i < 2; i++) {
        ctx.strokeStyle = i ? '#f8f0ff' : '#a85ae8'; ctx.lineWidth = i ? 1 : 4;
        ctx.setLineDash(i ? [3, 5] : []); ctx.lineDashOffset = -G.tick;
        ctx.beginPath(); ctx.ellipse(this.x - cx, this.y - cy, this.r, this.r / 1.4, 0, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.restore();
    }
  }
  G.HypnoRing = HypnoRing;

  // A pacifier from the mech's bottle cannon: it arcs over onto a marked spot.
  class PacifierShot extends Ent {
    constructor(x, y, tx, ty) { super(x, y); Object.assign(this, { fx: x, fy: y, tx, ty, t: 0, n: 52, z: 30 }); }
    update() {
      if (G.script.busy) return;
      const k = ++this.t / this.n;
      this.x = this.fx + (this.tx - this.fx) * k; this.y = this.fy + (this.ty - this.fy) * k;
      this.z = 30 * (1 - k) + Math.sin(k * Math.PI) * 36;
      if (k >= 1) {
        this.dead = true;
        G.audio.sfx('bump');
        this.world.burst(this.tx, this.ty - 3, ['#f4a8c8', '#f8f8f4'], 5, { speed: 0.9, up: 0.6, life: 14, size: 1 });
        const p = G.play.player;
        if (Math.abs(p.x - this.tx) < 10 && Math.abs(p.y - 4 - this.ty) < 9) p.hurt(1, this.tx, this.ty - 6);
      }
    }
    draw(ctx, cx, cy) {
      const k = this.t / this.n, r = 3 + k * 5;
      ctx.save(); ctx.globalAlpha = 0.25 + k * 0.5; ctx.strokeStyle = '#f86858'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(Math.round(this.tx) - cx, Math.round(this.ty) - cy, r, r * 0.55, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      drawShadow(ctx, this.x, this.y, cx, cy, false);
      ctx.drawImage(G.spr.pacifierShot, Math.round(this.x - 5) - cx, Math.round(this.y - 8 - this.z) - cy);
    }
  }
  G.PacifierShot = PacifierShot;

  // ============================================================== MECHA-BABY (CHKD boss)
  // The user's idea: a hypnotized baby piloting a mech suit, stomping around the NICU. (Father
  // Eggmas isn't fought at the hospital; he's just the one who did the hypnotizing.) The
  // spiral antenna on its dome plays the lullaby that has the whole hospital under, and it
  // hypnotizes Nate too: spirals and hypno-waves flip his controls. Nate never touches the
  // baby, he breaks the MECH, and its armor just goes CLANK except when it's open: the
  // rattle stuck in the floor after a smash, the vents popped open after a volley of
  // pacifiers, or (past half) dizzy after charging into a wall. Up to 4 damage per opening,
  // then it shakes it off.
  class MechaBaby extends Ent {
    constructor(x, y, bounds) {
      super(x, y);
      Object.assign(this, {
        enemy: true, boss: true, noBar: true, name: 'MECHA-BABY', hp: 24, maxHp: 24, bounds,
        state: 'idle', st: 0, t: 0, face: 1, hurtT: 0, hb: { w: 30, h: 10 }, cycle: 0, dome: 'hypno',
      });
    }
    get angry() { return this.hp <= this.maxHp / 2; }
    get open() { return this.state === 'stuck' || this.state === 'vent' || this.state === 'dizzy'; }
    hurtBox() { return [this.x - 24, this.y - 52, this.x + 24, this.y]; }
    start() { this.state = 'walk'; this.st = 90; this.noBar = false; }
    update(w) {
      this.t++;
      if (G.script.busy || this.state === 'idle' || this.state === 'defeated') return;
      if (this.hurtT > 0) this.hurtT--;
      const p = G.play.player, b = this.bounds, dx = p.x - this.x, dy = p.y - this.y, dist = Math.hypot(dx, dy) || 1;
      // stomping into Nate hurts (but not while it's stuck, venting or dizzy)
      if (!this.open && G.overlap([this.x - 18, this.y - 14, this.x + 18, this.y], p.hurtBox())) p.hurt(1, this.x, this.y);
      // past half: it cries for backup
      if (this.angry && !this.babyCall) { this.babyCall = true; this.callBabies(w); G.audio.sfx('wah'); w.pop(this.x, this.y - 74, 'MAMA!', '#f8c8e8'); }
      switch (this.state) {
        case 'walk':
          this.face = dx >= 0 ? 1 : -1;
          if (dist > 40) { const sp = this.angry ? 0.6 : 0.42; this.x += (dx / dist) * sp; this.y += (dy / dist) * sp; }
          if (this.t % 24 === 0) { G.audio.sfx('bump'); G.play.shake(2, 1); }
          // the antenna: a hypno-spiral every few seconds
          if (this.t % (this.angry ? 140 : 190) === 60) {
            const a = Math.atan2(dy, dx);
            w.add(new HypnoShot(this.x, this.y - 66, Math.cos(a) * 0.8, Math.sin(a) * 0.8));
            G.audio.sfx('whine');
          }
          if (--this.st <= 0) this.pickAttack(w, p);
          break;
        case 'raise':   // winding up the rattle (where it'll land is marked)
          if (--this.st <= 0) this.smash(w, p);
          break;
        case 'volley':  // pacifiers out of the bottle cannon
          if (this.st % 14 === 0 && this.shots > 0) { this.fire(w, p); this.shots--; }
          if (--this.st <= 0) { this.state = 'vent'; this.st = 100; this.dmgHere = 0; G.audio.sfx('dash'); w.pop(this.x, this.y - 74, 'The vents popped open!', '#f8e070'); }
          break;
        case 'beam':    // the antenna spins up and sends out a hypno-wave
          if (this.st === 30) { w.add(new HypnoRing(this.x, this.y, 150)); G.audio.sfx('bell'); w.pop(this.x, this.y - 74, '~ la la laaa ~', '#c898ff'); }
          if (--this.st <= 0) { this.state = 'walk'; this.st = 60; }
          break;
        case 'crouch':
          if (--this.st <= 0) {
            this.state = 'charge'; this.st = 90;
            const a = Math.atan2(dy, dx); this.cv = [Math.cos(a) * 3.2, Math.sin(a) * 3.2];
            G.audio.sfx('dash'); w.pop(this.x, this.y - 74, 'WHEEE!', '#a8d8ff');
          }
          break;
        case 'charge': {
          const nx = this.x + this.cv[0], ny = this.y + this.cv[1];
          if (nx < b.x0 || nx > b.x1 || ny < b.y0 || ny > b.y1 || --this.st <= 0) {
            this.state = 'dizzy'; this.st = 110; this.dmgHere = 0;
            G.audio.sfx('boom'); G.play.shake(14, 3);
            w.pop(this.x, this.y - 74, 'BONK! It\'s dizzy!', '#f8e070');
          } else { this.x = nx; this.y = ny; }
          break;
        }
        case 'stuck': case 'vent': case 'dizzy':
          if (this.state === 'vent' && this.t % 6 === 0) w.burst(this.x + (Math.random() * 30 - 15), this.y - 40, ['#f8f8f8', '#d8d8e0'], 1, { speed: 0.4, up: 1, life: 20, size: 2 });
          if (--this.st <= 0) this.recover();
          break;
      }
      this.x = G.clamp(this.x, b.x0, b.x1); this.y = G.clamp(this.y, b.y0, b.y1);
    }
    pickAttack(w, p) {
      const moves = this.angry ? ['smash', 'beam', 'charge', 'volley', 'charge', 'beam'] : ['smash', 'volley', 'beam', 'smash', 'volley'];
      const m = moves[this.cycle++ % moves.length];
      if (m === 'smash') {
        this.state = 'raise'; this.st = this.angry ? 34 : 46;
        this.face = p.x >= this.x ? 1 : -1;
        this.target = { x: this.x + this.face * 27, y: this.y - 2 };
        G.audio.sfx('swing'); w.pop(this.x, this.y - 74, '*whirr*', '#c8d8e8');
      } else if (m === 'volley') {
        this.state = 'volley'; this.shots = this.angry ? 5 : 3; this.st = this.shots * 14 + 20;
      } else if (m === 'beam') {
        this.state = 'beam'; this.st = 50;
      } else {
        this.state = 'crouch'; this.st = 34;
      }
    }
    smash(w, p) {
      const t = this.target;
      this.state = 'stuck'; this.st = this.angry ? 90 : 110; this.dmgHere = 0;
      G.audio.sfx('boom'); G.play.shake(12, 3);
      w.burst(t.x, t.y - 4, ['#f0c830', '#e85050', '#f8f8f8'], 12, { speed: 1.6, up: 1, g: 0.1, life: 24, size: 2 });
      w.add(new BarkRing(t.x, t.y, 70, '#f8e070'));
      if (Math.hypot(p.x - t.x, (p.y - t.y) * 1.3) < 20) p.hurt(2, t.x, t.y);
      w.pop(t.x, t.y - 30, 'The rattle\'s STUCK!', '#f8e070');
    }
    fire(w, p) {
      const b = this.bounds;
      const tx = G.clamp(p.x + (Math.random() * 50 - 25), b.x0 - 8, b.x1 + 8), ty = G.clamp(p.y + (Math.random() * 30 - 15), b.y0, b.y1 + 8);
      w.add(new PacifierShot(this.x - this.face * 28, this.y - 12, tx, ty));
      G.audio.sfx('swing');
    }
    recover() { this.state = 'walk'; this.st = this.angry ? 70 : 100; }
    // past half: two hypnotized babies crawl in from the sides
    callBabies(w) {
      const b = this.bounds, kinds = ['blue', 'pink', 'tan', 'brown'];
      for (const x of [b.x0, b.x1]) {
        if (w.ents.filter((e) => e instanceof HypnoBaby && !e.dead).length >= 4) break;
        const baby = w.add(new HypnoBaby(x, b.y1, kinds[Math.floor(Math.random() * 4)], { intro: null, dropChance: 0.5 }));
        w.burst(baby.x, baby.y - 8, ['#f8f0ff', '#a85ae8'], 6, { speed: 1, life: 16, size: 2 });
      }
    }
    hit(dmg, sx, sy) {
      if (this.state === 'defeated' || this.state === 'idle' || this.hurtT > 0) return;
      this.hurtT = 10;
      if (!this.open) {
        G.audio.sfx('clank');
        if (G.tick - (this.clankPop || -99) > 40) { this.clankPop = G.tick; this.world.pop(this.x, this.y - 64, 'CLANK! Too tough!', '#c8d8e8'); }
        return;
      }
      const before = this.hp;
      this.hp = Math.max(0, this.hp - Math.min(dmg, 2));
      G.audio.sfx('hit');
      this.world.burst(this.x, this.y - 30, ['#8ab8e8', '#f8e070', '#3a3a4a'], 6, { speed: 1.4, up: 0.8, g: 0.08, life: 22, size: 2 });
      if (this.hp <= 0) { this.state = 'defeated'; G.script.run(G.SCRIPTS.mechDefeated(this)); return; }
      if ((this.dmgHere = (this.dmgHere || 0) + (before - this.hp)) >= 4) { this.recover(); this.world.pop(this.x, this.y - 74, 'It shakes it off!', '#f8e070'); }
    }
    bomb(sx, sy) { if (this.open) this.hit(2, sx, sy); }
    draw(ctx, cx, cy) {
      if (this.hidden) return;
      const set = G.spr.mech[this.face > 0 ? 'right' : 'left'];
      const pose = this.state === 'raise' ? 'raise' : this.state === 'stuck' ? 'smash' : null;
      const moving = this.state === 'walk' || this.state === 'charge' || this.walking;
      let img = pose ? set[pose] : set.idle[moving ? (this.t >> 3) & 1 : 0];
      if (this.hurtT && (this.hurtT >> 1) & 1) img = G.art.flash(img);
      const jx = this.state === 'crouch' || this.state === 'beam' ? ((this.t >> 1) & 1 ? 1 : -1) : 0;
      const bx = Math.round(this.x - 36) - cx + jx, by = Math.round(this.y - 62) - cy;
      // where the rattle is coming down
      if (this.state === 'raise' && this.target) {
        const k = 1 - this.st / 46;
        ctx.save(); ctx.globalAlpha = 0.35 + k * 0.5; ctx.strokeStyle = '#f86858'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(Math.round(this.target.x) - cx, Math.round(this.target.y) - cy, 16, 9, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      }
      ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = '#1a1a2a';
      ctx.beginPath(); ctx.ellipse(Math.round(this.x) - cx, Math.round(this.y) - cy, 24, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      ctx.drawImage(img, bx, by);
      // the vents, glowing, when they pop open
      if (this.state === 'vent') { ctx.fillStyle = (this.t >> 2) & 1 ? '#f86858' : '#f8a058'; for (let i = 0; i < 3; i++) ctx.fillRect(bx + 28, by + 29 + i * 3, 16, 2); }
      // the dome (the baby cries when the mech is stuck or dizzy) and the spiral antenna
      const dome = G.spr.mechDome[this.dome !== 'hypno' ? this.dome : this.state === 'stuck' || this.state === 'dizzy' ? 'cry' : 'hypno'];
      ctx.drawImage(dome, bx + 22, by - 3);
      if (this.dome === 'hypno') {
        const ax = bx + 36, ay = by - 14, spin = this.state === 'beam' ? 0.5 : 0.12;
        ctx.fillStyle = '#5a5a6a'; ctx.fillRect(ax, ay, 1, 11);
        ctx.save(); ctx.translate(ax, ay); ctx.rotate(this.t * spin);
        ctx.fillStyle = '#3a1a5a'; ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill();
        for (let i = 0; i < 30; i++) { const t = i * 0.35, r = i * 0.18; ctx.fillStyle = i % 6 < 3 ? '#a85ae8' : '#f8f0ff'; ctx.fillRect(Math.round(Math.cos(t) * r), Math.round(Math.sin(t) * r), 1, 1); }
        ctx.restore();
      }
      // dizzy: stars going round the dome
      if (this.state === 'dizzy') for (let i = 0; i < 3; i++) {
        const a = this.t * 0.15 + i * Math.PI * 2 / 3;
        ctx.drawImage(G.spr.tinyStars[i], Math.round(bx + 36 + Math.cos(a) * 16) - 5, Math.round(by - 6 + Math.sin(a) * 4) - 5);
      }
      if (this.dome === 'asleep' && (this.t >> 5) & 1) G.font.draw(ctx, 'z', bx + 50, by - 8 - ((this.t >> 3) & 3), '#f8f8f8');
    }
  }
  G.MechaBaby = MechaBaby;

  // ============================================================== THE FINALE: the Number One Ditch
  // Father Eggmas has possessed the whole family. Nate fights them one at a time (Doron, Dad,
  // Lily, Mom, Abe, Hannah), each with their own moves. Then, once they're all free and Hannah
  // has patched him up, every one of them takes a turn against Father Eggmas himself, and
  // Nate finishes it. (Not connected to the story yet: an admin checkpoint for now.)

  // a silhouette of a sprite in one color (for the possessed glow), cached
  const tintCache = new Map();
  function tinted(img, color) {
    let m = tintCache.get(img);
    if (!m) tintCache.set(img, (m = {}));
    if (m[color]) return m[color];
    const c = G.canvas(img.width, img.height), x = c.getContext('2d');
    x.drawImage(img, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, img.width, img.height);
    return (m[color] = c);
  }
  // twice-size frames of anyone's sprite, cached
  const bigCache = {};
  function bigOf(id) {
    if (bigCache[id]) return bigCache[id];
    const S = G.sprites[id], B = { h: S.h * 2, hold: G.art.scale2(S.hold) };
    for (const d of ['down', 'up', 'left', 'right']) B[d] = S[d].map(G.art.scale2);
    return (bigCache[id] = B);
  }
  G.finBig = bigOf;

  // Something lobbed in an arc onto a marked spot (rocks, flower pots, ornaments, cans).
  class Lob extends Ent {
    constructor(x, y, tx, ty, img, o = {}) {
      super(x, y);
      Object.assign(this, { fx: x, fy: y, tx, ty, img, t: 0, n: o.n || 50, h: o.h || 40, z0: o.z0 || 16, dmg: o.dmg == null ? 1 : o.dmg, onLand: o.onLand, color: o.color || '#f86858' });
      this.z = this.z0;
    }
    update(w) {
      if (G.script.busy) return;
      const k = ++this.t / this.n;
      this.x = this.fx + (this.tx - this.fx) * k; this.y = this.fy + (this.ty - this.fy) * k;
      this.z = this.z0 * (1 - k) + Math.sin(k * Math.PI) * this.h;
      if (k < 1) return;
      this.dead = true;
      const p = G.play.player;
      if (this.dmg && Math.abs(p.x - this.tx) < 11 && Math.abs(p.y - 4 - this.ty) < 9) p.hurt(this.dmg, this.tx, this.ty - 6);
      if (this.onLand) this.onLand(w, this.tx, this.ty);
      else { G.audio.sfx('bump'); w.burst(this.tx, this.ty - 3, ['#c8c0b0', '#8a8274'], 5, { speed: 0.9, up: 0.6, life: 14, size: 1 }); }
    }
    draw(ctx, cx, cy) {
      const k = this.t / this.n, r = 3 + k * 6;
      if (this.color) {
        ctx.save(); ctx.globalAlpha = 0.25 + k * 0.5; ctx.strokeStyle = this.color; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(Math.round(this.tx) - cx, Math.round(this.ty) - cy, r, r * 0.55, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      }
      drawShadow(ctx, this.x, this.y, cx, cy, false);
      ctx.drawImage(this.img, Math.round(this.x - this.img.width / 2) - cx, Math.round(this.y - this.img.height - this.z) - cy);
    }
  }
  G.Lob = Lob;
  // an ornament lands and shatters into shards
  G.ornamentShatter = (w, x, y) => {
    G.audio.sfx('clank');
    w.burst(x, y - 4, ['#d83030', '#f8e070', '#ffffff'], 8, { speed: 1.2, up: 0.6, life: 16, size: 2 });
    const k = Math.floor(Math.random() * 3);
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + 0.25; w.add(new Shot(x, y - 3, Math.cos(a) * 1.35, Math.sin(a) * 1.35, G.spr.shards[k], { life: 46, z: 4 })); }
  };

  // Abe's can of beans: it lands, hisses, and BLOWS (the Bean Incident), spraying beans.
  class BeanBomb extends Ent {
    constructor(x, y) { super(x, y); this.t = 75; }
    update(w) {
      if (G.script.busy) return;
      if (--this.t % 12 === 0) G.audio.sfx('fuse');
      if (this.t > 0) return;
      this.dead = true;
      G.audio.sfx('boom'); G.play.shake(8, 2);
      w.burst(this.x, this.y - 6, ['#8a3a1a', '#c86a2a', '#f8a838', '#f8e070'], 18, { speed: 2, up: 1.2, g: 0.1, life: 26, size: 2 });
      w.pop(this.x, this.y - 24, 'BEANS!', '#f8a838');
      const p = G.play.player;
      if (Math.hypot(p.x - this.x, (p.y - this.y) * 1.3) < 22) p.hurt(1, this.x, this.y);
      for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + 0.3; w.add(new Shot(this.x, this.y - 4, Math.cos(a) * 1.3, Math.sin(a) * 1.3, G.spr.bean, { life: 44, z: 4 })); }
    }
    draw(ctx, cx, cy) {
      const img = G.spr.beanCan, j = this.t < 25 ? ((this.t >> 1) & 1 ? 1 : -1) : 0;
      drawShadow(ctx, this.x, this.y, cx, cy, false);
      ctx.drawImage(this.t < 25 && (this.t >> 2) & 1 ? G.art.flash(img) : img, Math.round(this.x - img.width / 2 + j) - cx, Math.round(this.y - img.height) - cy);
    }
  }
  G.BeanBomb = BeanBomb;

  // Hannah's bandage roll unrolls into a strip on the ground: walk through it and Nate gets
  // tangled up (half speed).
  class BandageStrip extends Ent {
    constructor(x, y) { super(x, y); Object.assign(this, { life: 380, len: 0, flat: true }); }
    update() {
      if (G.script.busy) return;
      if (this.len < 40) this.len += 2;
      if (--this.life <= 0) { this.dead = true; return; }
      const p = G.play.player;
      if (Math.abs(p.x - this.x) < this.len / 2 + 2 && Math.abs(p.y - this.y) < 5) {
        if (!p.sticky && G.tick - (this.popT || -99) > 50) { this.popT = G.tick; this.world.pop(p.x, p.y - 30, 'tangled!', '#f8f4ec'); }
        p.sticky = 3;
      }
    }
    draw(ctx, cx, cy) {
      const x0 = Math.round(this.x - this.len / 2) - cx, y = Math.round(this.y) - cy;
      ctx.save(); ctx.globalAlpha = Math.min(1, this.life / 60);
      ctx.fillStyle = '#d8d0c0'; ctx.fillRect(x0, y - 2, this.len, 5); ctx.fillStyle = '#f8f4ec'; ctx.fillRect(x0, y - 2, this.len, 2);
      ctx.fillStyle = '#c0b8a8'; for (let x = 2; x < this.len; x += 5) ctx.fillRect(x0 + x, y + 1, 1, 2);
      ctx.restore();
    }
  }
  G.BandageStrip = BandageStrip;

  // One of Mom's chickens (Henrietta's sisters): runs around and fires eggs at Nate.
  class HenMinion extends Critter {
    constructor(x, y) {
      super(x, y, 1);
      Object.assign(this, { bits: ['#f4f2ec', '#e8c040', '#d83030'], dropChance: 0.5, face: 1, cool: 60 + Math.random() * 40 });
    }
    hurtBox() { return [this.x - 7, this.y - 13, this.x + 7, this.y]; }
    think(w, p, dx, dy, dist) {
      this.wander(w, 0.8);
      if (this.vx) this.face = this.vx > 0 ? 1 : -1;
      if (--this.cool <= 0) {
        this.cool = 95;
        G.audio.sfx('bawk');
        w.add(new Shot(this.x, this.y - 6, (dx / dist) * 1.6, (dy / dist) * 1.6, G.spr.egg, { life: 110, z: 6 }));
      }
    }
    draw(ctx, cx, cy) {
      const S = G.spr.chickens.white[this.face > 0 ? 'right' : 'left'];
      this.drawSprite(ctx, cx, cy, S[(this.t >> 3) & 1]);
    }
  }
  G.HenMinion = HenMinion;

  // Possessed Lily's "NO.": a big word that flies at Nate.
  class EnemyNo extends Ent {
    constructor(x, y, vx, vy) { super(x, y); Object.assign(this, { vx, vy, life: 130 }); }
    update(w) {
      if (G.script.busy) return;
      this.x += this.vx; this.y += this.vy;
      if (--this.life <= 0 || w.tileSolid(Math.floor(this.x / 16), Math.floor((this.y - 8) / 16))) { this.dead = true; return; }
      const p = G.play.player;
      if (G.overlap([this.x - 9, this.y - 20, this.x + 9, this.y - 6], p.hurtBox())) { this.dead = true; p.hurt(1, this.x, this.y); }
    }
    draw(ctx, cx, cy) {
      const t = 'NO.', w = G.font.width(t);
      G.font.draw(ctx, t, Math.round(this.x - w / 2) - cx, Math.round(this.y - 18) - cy, '#f8d8f0', { shadow: '#6a1a7a' });
    }
  }
  G.EnemyNo = EnemyNo;

  // Possessed Lily's heart balloons: they drift after Nate. A bonk pops them (sometimes
  // there's a heart inside).
  class FinBalloon extends HeartShot {
    constructor(x, y) { super(x, y); this.enemy = true; this.life = 380; }
    hit() { this.pop(); if (Math.random() < 0.3) this.world.add(new Pickup(this.x, this.y + 4, 'heart')); }
  }
  G.FinBalloon = FinBalloon;

  // ---- the family, possessed. Drawn twice size with spiral eyes and a purple glow. Nate's
  // hammer only lands while they're OPEN (dizzy, out of breath, distracted), up to 3 hits per
  // opening; any other time it's BLOCKED and Nate gets shoved back. A package always opens
  // them up.
  const POSSESSED = {
    doron: { name: 'DORON', hp: 10, sub: 'the oldest brother', speed: 0.7, cycle: ['charge', 'rock', 'charge', 'flex'], cycle2: ['charge', 'rock', 'charge', 'rock', 'flex'] },
    dad: { name: 'DAD', hp: 10, sub: 'the pastor', speed: 0.55, cycle: ['letters', 'charge', 'smoke'], cycle2: ['letters', 'charge', 'smoke', 'charge'] },
    lily: { name: 'LILY', hp: 9, sub: 'the little sister', speed: 0.6, cycle: ['no', 'balloons', 'no', 'bigNo'], cycle2: ['no', 'balloons', 'bigNo', 'no', 'bigNo'] },
    michelle: { name: 'MOM', hp: 10, sub: 'the flower farmer', speed: 0.55, cycle: ['pots', 'snap', 'water', 'hens', 'pots', 'water'], cycle2: ['pots', 'hens', 'snap', 'water', 'pots', 'water'] },
    abe: { name: 'ABE', hp: 10, sub: 'the master', speed: 0.6, cycle: ['beans', 'bush', 'question', 'beans', 'bush'], cycle2: ['beans', 'bush', 'beans', 'question', 'bush'] },
    hannah: { name: 'HANNAH', hp: 10, sub: 'the nurse', speed: 0.6, cycle: ['ice', 'bandage', 'heal', 'code', 'ice', 'heal'], cycle2: ['ice', 'code', 'heal', 'bandage', 'ice', 'heal'] },
  };
  G.POSSESSED = POSSESSED;
  const LILY_INSIDE = ['...nate...?', 'i\'m scared...', 'make it stop...', 'nate, help...'];

  class Possessed extends Ent {
    constructor(id, x, y, bounds) {
      super(x, y);
      const d = POSSESSED[id];
      Object.assign(this, {
        id, d, enemy: true, boss: true, noBar: true, name: d.name, hp: d.hp, maxHp: d.hp, bounds,
        state: 'idle', st: 0, t: 0, dir: 'down', anim: 0, hurtT: 0, kb: { x: 0, y: 0 }, hb: { w: 18, h: 8 },
        cycle: 0, sprite: id + 'Possessed', z: 0, vx: 0, vy: 0,
      });
    }
    get angry() { return this.hp <= this.maxHp / 2; }
    get isOpen() { return this.state === 'open' || this.state === 'heal'; }
    hurtBox() { return this.lurking ? [-999, -999, -998, -998] : [this.x - 13, this.y - 46 - this.z, this.x + 13, this.y - this.z]; }
    start() { this.state = 'walk'; this.st = 60; this.noBar = false; }
    open(n, label) {
      this.state = 'open'; this.st = n; this.dmgHere = 0; this.vx = this.vy = 0;
      if (label) this.world.pop(this.x, this.y - 58, label, '#f8e070');
    }
    toWalk(n) { this.state = 'walk'; this.st = n || 70; }
    next() {
      const c = this.angry ? this.d.cycle2 : this.d.cycle;
      this.begin(c[this.cycle++ % c.length]);
    }
    update(w) {
      this.t++;
      if (G.script.busy || this.state === 'idle' || this.state === 'defeated') return;
      const p = G.play.player, dx = p.x - this.x, dy = p.y - this.y, dist = Math.hypot(dx, dy) || 1;
      if (this.hurtT > 0) { this.hurtT--; w.move(this, this.kb.x, 0); w.move(this, 0, this.kb.y); this.kb.x *= 0.8; this.kb.y *= 0.8; }
      // the possession, coming off them as purple wisps
      if (this.t % 16 === 0 && !this.lurking) w.burst(this.x + (Math.random() * 20 - 10), this.y - 40 - this.z, ['#a85ae8', '#6a2a9a', '#d8a8f8'], 1, { speed: 0.3, up: 0.7, g: -0.02, life: 28, size: 2 });
      if (this.pendingSlip) { this.pendingSlip = false; p.hurt(1, p.x + 4, p.y); }
      if (this.state === 'open') { if (--this.st <= 0) this.toWalk(60); return; }
      this[this.id](w, p, dx, dy, dist);
      const b = this.bounds;
      this.x = G.clamp(this.x, b.x0, b.x1); this.y = G.clamp(this.y, b.y0, b.y1);
    }
    // walking: straight at Nate (keep: hang back at about that distance instead)
    stroll(w, dx, dy, dist, keep) {
      let sx = dx / dist, sy = dy / dist;
      if (keep) { if (dist < keep - 20) { sx = -sx; sy = -sy; } else if (dist < keep + 20) { const t = sx; sx = -sy; sy = t; } }
      const sp = this.d.speed * (this.angry ? 1.25 : 1);
      w.move(this, sx * sp, 0); w.move(this, 0, sy * sp);
      this.dir = G.dirToward(dx, dy); this.anim++;
    }
    charge(w, p, dx, dy, dist, bounceText) {
      this.anim += 2;
      this.dir = G.dirToward(this.vx, this.vy);
      const h = w.move(this, this.vx, this.vy), b = this.bounds;
      const out = this.x <= b.x0 || this.x >= b.x1 || this.y <= b.y0 || this.y >= b.y1;
      if (h.hitX || h.hitY || out) {
        if (this.bounces > 0) {
          this.bounces--;
          const sp = Math.hypot(this.vx, this.vy);
          this.vx = (dx / dist) * sp; this.vy = (dy / dist) * sp;
          this.x = G.clamp(this.x, b.x0 + 2, b.x1 - 2); this.y = G.clamp(this.y, b.y0 + 2, b.y1 - 2);
          G.audio.sfx('bump'); w.pop(this.x, this.y - 58, bounceText, '#f8e070');
        } else { G.audio.sfx('boom'); G.play.shake(10, 3); this.open(100, 'DIZZY!'); }
      } else if (--this.st <= 0) this.open(60, 'DIZZY!');
      if (this.state === 'charge' && G.overlap(this.hurtBox(), p.hurtBox())) p.hurt(2, this.x, this.y);
    }
    windupCharge(text, speed, bounces) { this.state = 'windup'; this.st = 34; this.chargeSp = speed; this.chargeBounces = bounces; if (text) this.world.pop(this.x, this.y - 58, text, '#f8e070'); }
    windup(w, dx, dy, dist, popText) {
      this.dir = G.dirToward(dx, dy);
      if (--this.st > 0) return;
      this.state = 'charge'; this.st = 90;
      this.vx = (dx / dist) * this.chargeSp; this.vy = (dy / dist) * this.chargeSp; this.bounces = this.chargeBounces;
      G.audio.sfx('dash'); if (popText) this.world.pop(this.x, this.y - 58, popText, '#f8e070');
    }
    lobAt(w, p, img, spread, o) {
      const b = this.bounds, tx = G.clamp(p.x + (Math.random() * 2 - 1) * spread, b.x0, b.x1), ty = G.clamp(p.y + (Math.random() * 2 - 1) * spread * 0.6, b.y0, b.y1);
      w.add(new Lob(this.x, this.y - 30, tx, ty, img, o));
    }

    // ---- the oldest brother: LEG DAY. Clotheslines that leave him dizzy when he hits the
    // bank, rocks dug out of the ditch, and he can't help striking a pose for the crowd.
    begin(m) {
      const w = this.world;
      switch (m) {
        case 'charge': this.windupCharge(this.id === 'doron' ? 'LEG DAY!' : null, this.angry ? 3.8 : 3.2, this.angry ? 1 : 0); break;
        case 'rock': this.state = 'dig'; this.st = 30; w.pop(this.x, this.y - 58, 'ROCK!', '#f8e070'); break;
        case 'flex': this.state = 'flex'; this.st = 34; w.pop(this.x, this.y - 58, 'POSE FOR THE CROWD!', '#f8e070'); break;
        case 'letters': this.state = 'yell'; this.st = 56; w.pop(this.x, this.y - 58, 'DO YOU SPEAK...', '#ffffff'); break;
        case 'smoke': this.state = 'smoke'; this.st = 70; w.pop(this.x, this.y - 58, 'Peace be with you...', '#d8d8e0'); G.audio.sfx('blip'); break;
        case 'no': this.state = 'no'; this.st = 3; this.shotT = 6; break;
        case 'balloons': this.state = 'balloons'; this.st = 30; w.pop(this.x, this.y - 58, '*balloons*', '#ff98d0'); break;
        case 'bigNo': this.state = 'bigNo'; this.st = 64; break;
        case 'pots': this.state = 'pots'; this.st = 3; this.shotT = 8; w.pop(this.x, this.y - 58, 'Catch, honey!', '#e8a0d8'); break;
        case 'snap': this.state = 'snap'; this.st = 26; w.pop(this.x, this.y - 58, 'Grow, my babies!', '#e8a0d8'); break;
        case 'hens': this.state = 'hens'; this.st = 26; w.pop(this.x, this.y - 58, 'HENRIETTA! GET HIM!', '#e8a0d8'); break;
        case 'water': this.state = 'watering'; this.st = 20; break;
        case 'beans': this.state = 'beans'; this.st = 2; this.shotT = 10; w.pop(this.x, this.y - 58, 'THE BEAN INCIDENT!', '#f8a838'); break;
        case 'bush': this.state = 'dive'; this.st = 26; w.pop(this.x, this.y - 58, '*rustle rustle*', '#8ad868'); break;
        case 'question': this.state = 'asking'; G.script.run(G.SCRIPTS.finAbeQuestion(this)); break;
        case 'ice': this.state = 'ice'; this.st = 2; this.shotT = 10; w.pop(this.x, this.y - 58, 'You need some ICE.', '#a8d8ff'); break;
        case 'bandage': this.state = 'bandage'; this.st = 2; this.shotT = 10; w.pop(this.x, this.y - 58, 'Hold STILL.', '#a8d8ff'); break;
        case 'heal': this.state = 'heal'; this.st = 150; this.dmgHere = 0; w.pop(this.x, this.y - 58, '*patching herself up*', '#78e070'); break;
        case 'code': this.state = 'code'; this.st = 3; this.shotT = 12; w.pop(this.x, this.y - 58, 'CODE BLUE!', '#7ab8f8'); G.audio.sfx('bell'); break;
        default: this.toWalk(60);
      }
    }
    doron(w, p, dx, dy, dist) {
      switch (this.state) {
        case 'walk': this.stroll(w, dx, dy, dist); if (--this.st <= 0) this.next(); break;
        case 'windup': this.windup(w, dx, dy, dist, 'CLOTHESLINE!'); break;
        case 'charge': this.charge(w, p, dx, dy, dist, 'OFF THE BANK!'); break;
        case 'dig':
          if (--this.st <= 0) { this.state = 'throw'; this.st = this.angry ? 3 : 2; this.shotT = 0; }
          break;
        case 'throw':
          if (--this.shotT <= 0) {
            this.shotT = 20;
            G.audio.sfx('swing');
            this.lobAt(w, p, G.spr.tossRock, 26, { n: 44, h: 44, onLand: (ww, x, y) => { G.audio.sfx('bump'); G.play.shake(4, 1); ww.burst(x, y - 3, ['#a8a49c', '#5a5650'], 7, { speed: 1.1, up: 0.8, life: 18, size: 2 }); if (Math.random() < 0.22) ww.add(new Pickup(x, y, 'heart')); } });
            if (--this.st <= 0) this.toWalk(60);
          }
          break;
        case 'flex':
          this.dir = 'down';
          if (--this.st <= 0) this.open(80, 'FLEXING! Hit him!');
          break;
      }
    }
    // ---- Dad: "DO YOU SPEAK... EEENGLISH?!" (rings of letters), dropkicks off the bank,
    // and smoke rings out of his pipe. Past half, he puts the luchador mask back on.
    dad(w, p, dx, dy, dist) {
      switch (this.state) {
        case 'walk': this.stroll(w, dx, dy, dist); if (--this.st <= 0) this.next(); break;
        case 'windup': this.windup(w, dx, dy, dist, ['FLYING ELBOW!', 'DROPKICK!', 'BODY SLAM!'][Math.floor(Math.random() * 3)]); break;
        case 'charge': this.charge(w, p, dx, dy, dist, 'OFF THE ROPES!'); break;
        case 'yell':
          this.st--;
          if (this.st === 30) { w.pop(this.x, this.y - 48, 'EEENGLISH?!', '#f8d850'); this.letters(w, this.angry ? 12 : 9, 0); }
          if (this.angry && this.st === 8) this.letters(w, 12, Math.PI / 12);
          if (this.st <= 0) this.open(56, '*huff huff*');
          break;
        case 'smoke':
          if (this.st % 18 === 0) {
            const off = this.st * 0.07;
            for (let i = 0; i < 8; i++) { const a = off + i * Math.PI / 4; w.add(new Shot(this.x, this.y - 10, Math.cos(a) * 1.05, Math.sin(a) * 1.05, G.spr.smokeRing, { life: 100, z: 8 })); }
            G.audio.sfx('blip');
          }
          if (--this.st <= 0) this.toWalk(70);
          break;
      }
    }
    letters(w, n, off) {
      const word = 'EEENGLISH';
      G.audio.sfx('yell');
      for (let i = 0; i < n; i++) { const a = off + (i / n) * Math.PI * 2; w.add(new Letter(this.x, this.y - 4, Math.cos(a) * 1.3, Math.sin(a) * 1.3, word[i % word.length])); }
    }
    // ---- Lily: "NO." (lots of them), Mikey's heart balloons, and a giant "NOOOOO" that
    // leaves her out of breath. Somewhere in there, the real Lily is scared.
    lily(w, p, dx, dy, dist) {
      switch (this.state) {
        case 'walk':
          this.stroll(w, dx, dy, dist, 90);
          if (this.t % 330 === 100) w.pop(this.x, this.y - 58, LILY_INSIDE[Math.floor(this.t / 330) % LILY_INSIDE.length], '#9890a8');
          if (--this.st <= 0) this.next();
          break;
        case 'no':
          if (--this.shotT <= 0) {
            this.shotT = 24;
            G.audio.sfx('no');
            const a = Math.atan2(dy, dx), n = this.angry ? 3 : 1;
            for (let i = 0; i < n; i++) { const b = a + (i - (n - 1) / 2) * 0.35; w.add(new EnemyNo(this.x, this.y - 6, Math.cos(b) * 2.1, Math.sin(b) * 2.1)); }
            if (--this.st <= 0) this.toWalk(70);
          }
          break;
        case 'balloons':
          if (--this.st <= 0) {
            const alive = w.ents.filter((e) => e instanceof FinBalloon && !e.dead).length;
            for (let i = 0; i < Math.min(3, 6 - alive); i++) w.add(new FinBalloon(this.x + (i - 1) * 16, this.y - 20));
            G.audio.sfx('poof');
            this.toWalk(60);
          }
          break;
        case 'bigNo':
          if (this.st % 8 === 0) w.burst(this.x, this.y - 30, ['#f8a8e8', '#a85ae8', '#ffffff'], 3, { speed: 1.4, life: 16, size: 2 });
          if (--this.st <= 0) {
            G.audio.sfx('no'); G.audio.sfx('boom'); G.play.shake(14, 3);
            w.pop(this.x, this.y - 64, 'NOOOOOOOOOO!', '#ffffff');
            w.add(new BarkRing(this.x, this.y, 120, '#f8a8e8'));
            this.open(100, '*gasp* *gasp*');
          }
          break;
      }
    }
    // ---- Mom: flower pots, snapdragons, the chickens, and she can't resist watering her
    // flowers (distracted!). Sneak up on her and she shrieks "JAMIE LEE CURTIS!"
    michelle(w, p, dx, dy, dist) {
      if (this.state === 'walk' || this.state === 'pots') {
        if (dist < 30) this.startle = (this.startle || 0) + 1; else this.startle = 0;
        if (this.startle > 34) {
          this.startle = 0;
          G.audio.sfx('yell'); G.play.shake(12, 3);
          w.pop(this.x, this.y - 64, 'JAMIE LEE CURTIS!!', '#ffffff');
          w.add(new BarkRing(this.x, this.y, 80, '#f8f0a0'));
          if (dist < 28) p.hurt(2, this.x, this.y);
          this.open(50, '*catching her breath*');
          return;
        }
      }
      switch (this.state) {
        case 'walk': this.stroll(w, dx, dy, dist, 80); if (--this.st <= 0) this.next(); break;
        case 'pots':
          if (--this.shotT <= 0) {
            this.shotT = 18; G.audio.sfx('swing');
            this.lobAt(w, p, G.spr.clayPot, 30, { n: 46, h: 40, onLand: (ww, x, y) => { G.audio.sfx('clank'); ww.burst(x, y - 4, ['#c8683a', '#4a3020', '#58a840', '#e83878'], 9, { speed: 1.2, up: 0.8, life: 18, size: 2 }); if (Math.random() < 0.2) ww.add(new Pickup(x, y, 'heart')); } });
            if (--this.st <= 0) this.toWalk(70);
          }
          break;
        case 'snap':
          if (--this.st <= 0) {
            const alive = w.ents.filter((e) => e instanceof G.Snapdragon && !e.dead).length, b = this.bounds;
            for (let i = 0; i < Math.min(2, 3 - alive); i++) {
              let x, y, k = 0;
              do { x = b.x0 + Math.random() * (b.x1 - b.x0); y = b.y0 + 20 + Math.random() * (b.y1 - b.y0 - 20); } while ((Math.hypot(x - p.x, y - p.y) < 44 || Math.hypot(x - this.x, y - this.y) < 30) && ++k < 12);
              const s = w.add(new G.Snapdragon(x, y)); s.intro = null; s.dropChance = 0.5;
              w.burst(x, y - 6, ['#58a840', '#e83878', '#6a4220'], 8, { speed: 1, up: 0.8, life: 18, size: 2 });
            }
            this.toWalk(70);
          }
          break;
        case 'hens':
          if (--this.st <= 0) {
            const alive = w.ents.filter((e) => e instanceof HenMinion && !e.dead).length;
            for (let i = 0; i < Math.min(2, 3 - alive); i++) w.add(new HenMinion(this.x + (i ? 14 : -14), this.y + 6));
            G.audio.sfx('bawk');
            this.toWalk(70);
          }
          break;
        case 'watering':
          if (--this.st <= 0) this.open(100, '*watering her flowers*');
          break;
      }
    }
    // ---- Abe: cans of beans (the Bean Incident), diving into a bush and leaping out of a
    // different one (RAAAAAH!), and his favorite trap: a quick question.
    abe(w, p, dx, dy, dist) {
      switch (this.state) {
        case 'walk': this.stroll(w, dx, dy, dist); if (--this.st <= 0) this.next(); break;
        case 'beans':
          if (--this.shotT <= 0) {
            this.shotT = 24; G.audio.sfx('swing');
            this.lobAt(w, p, G.spr.beanCan, 34, { n: 46, h: 42, dmg: 0, color: '#f8a838', onLand: (ww, x, y) => { G.audio.sfx('bump'); ww.add(new BeanBomb(x, y)); } });
            if (--this.st <= 0) this.toWalk(70);
          }
          break;
        case 'dive': {
          // he heads for the nearest bush and disappears into it...
          const bush = (w.finBushes || []).reduce((best, b2) => (!best || Math.hypot(b2[0] - this.x, b2[1] - this.y) < Math.hypot(best[0] - this.x, best[1] - this.y) ? b2 : best), null);
          if (bush) { const bx = bush[0] - this.x, by = bush[1] - this.y, bd = Math.hypot(bx, by) || 1; if (bd > 4) { this.x += (bx / bd) * 2.6; this.y += (by / bd) * 2.6; this.anim += 2; this.dir = G.dirToward(bx, by); } }
          if (--this.st <= 0 || !bush) {
            this.lurking = true; this.state = 'lurk'; this.st = 90 + Math.random() * 40;
            const others = (w.finBushes || []).filter((b2) => b2 !== bush);
            this.exitBush = others[Math.floor(Math.random() * others.length)] || bush;
            G.audio.sfx('poof'); w.burst(this.x, this.y - 10, ['#3a7a34', '#5a9a44'], 10, { speed: 1.2, up: 1, life: 20, size: 2 });
          }
          break;
        }
        case 'lurk':
          // ...the bushes rustle (the one he's in, more)...
          if (this.t % 9 === 0) { const b2 = Math.random() < 0.55 ? this.exitBush : w.finBushes[Math.floor(Math.random() * w.finBushes.length)]; w.finRustle = { b: b2, t: 10 }; }
          if (--this.st <= 0) {
            // ...and RAAAAAH, out he comes, at Nate
            this.lurking = false; this.x = this.exitBush[0]; this.y = this.exitBush[1];
            this.state = 'leap'; this.st = 0; this.lx0 = this.x; this.ly0 = this.y; this.lx1 = p.x; this.ly1 = p.y;
            G.audio.sfx('yell'); w.pop(this.x, this.y - 58, 'RAAAAAAH!', '#ffffff');
          }
          break;
        case 'leap': {
          const k = ++this.st / 34;
          this.x = this.lx0 + (this.lx1 - this.lx0) * k; this.y = this.ly0 + (this.ly1 - this.ly0) * k; this.z = Math.sin(k * Math.PI) * 34;
          if (k >= 1) {
            this.z = 0; G.audio.sfx('boom'); G.play.shake(12, 3);
            w.add(new BarkRing(this.x, this.y, 70, '#f8e070'));
            if (Math.hypot(p.x - this.x, (p.y - this.y) * 1.3) < 20) p.hurt(2, this.x, this.y);
            this.open(90, 'HA! GOT YOU!');
          }
          break;
        }
        case 'asking': break;   // (the question script is running)
      }
    }
    // ---- Hannah: ice packs, bandage rolls that tangle Nate up, CODE BLUE, and she patches
    // herself up (hit her while she does, or she gets 3 hp back).
    hannah(w, p, dx, dy, dist) {
      switch (this.state) {
        case 'walk': this.stroll(w, dx, dy, dist, 85); if (--this.st <= 0) this.next(); break;
        case 'ice':
          if (--this.shotT <= 0) {
            this.shotT = 32; G.audio.sfx('swing');
            const a = Math.atan2(dy, dx), n = this.angry ? 7 : 5;
            for (let i = 0; i < n; i++) { const b = a + (i - (n - 1) / 2) * 0.24; w.add(new Shot(this.x, this.y - 8, Math.cos(b) * 1.6, Math.sin(b) * 1.6, G.spr.icePack, { life: 120, z: 8 })); }
            if (--this.st <= 0) this.toWalk(70);
          }
          break;
        case 'bandage':
          if (--this.shotT <= 0) {
            this.shotT = 22; G.audio.sfx('swing');
            this.lobAt(w, p, G.spr.bandageRoll, 30, { n: 44, h: 36, dmg: 1, color: '#f8f4ec', onLand: (ww, x, y) => { G.audio.sfx('bump'); ww.add(new BandageStrip(x, y)); } });
            if (--this.st <= 0) this.toWalk(70);
          }
          break;
        case 'heal':
          if (this.t % 6 === 0) w.burst(this.x + (Math.random() * 20 - 10), this.y - 20 - Math.random() * 20, ['#78e070', '#c8f8b8', '#ffffff'], 1, { speed: 0.3, up: 0.8, g: -0.02, life: 24, size: 2 });
          if (--this.st <= 0) {
            const before = this.hp; this.hp = Math.min(this.maxHp, this.hp + 3);
            G.audio.sfx('heart');
            w.pop(this.x, this.y - 58, before < this.hp ? '+' + (this.hp - before) + ' (she healed!)' : 'All better!', '#78e070');
            this.toWalk(60);
          }
          break;
        case 'code':
          if (--this.shotT <= 0) {
            this.shotT = 22;
            w.add(new BarkRing(this.x, this.y, 100, '#7ab8f8')); G.audio.sfx('blip');
            if (--this.st <= 0) this.toWalk(70);
          }
          break;
      }
    }

    hit(dmg, sx, sy) {
      if (this.state === 'defeated' || this.state === 'idle' || this.lurking) return;
      const p = G.play.player;
      if (!this.isOpen) {
        G.audio.sfx('clank');
        if (G.tick - (this.blockPop || -99) > 30) { this.blockPop = G.tick; this.world.pop(this.x, this.y - 54, 'BLOCKED!', '#c8c8d0'); }
        const dx = p.x - this.x, dy = p.y - this.y, m = Math.hypot(dx, dy) || 1;
        if (p.state !== 'dead') { p.state = 'hurt'; p.t = 8; p.kb = { x: (dx / m) * 2.4, y: (dy / m) * 2.4 }; }
        return;
      }
      if (this.hurtT > 0) return;
      this.hp = Math.max(0, this.hp - Math.min(dmg, 2));
      this.hurtT = 12;
      const dx = this.x - sx, dy = this.y - sy, m = Math.hypot(dx, dy) || 1;
      this.kb = { x: (dx / m) * 1.6, y: (dy / m) * 1.6 };
      G.audio.sfx('hit');
      this.world.burst(this.x, this.y - 28, ['#a85ae8', '#f8f0ff', '#d8a8f8'], 5, { speed: 1.2, up: 0.6, life: 20, size: 2 });
      if (this.state === 'heal') { this.world.pop(this.x, this.y - 58, 'Interrupted!', '#f8e070'); this.state = 'open'; this.st = 50; this.dmgHere = 0; }
      if (this.hp <= 0) { this.state = 'defeated'; this.vx = this.vy = 0; G.script.run(G.SCRIPTS.finFreed(this)); return; }
      if (this.id === 'dad' && this.angry && !this.masked) { this.masked = true; this.state = 'walk'; this.st = 40; G.script.run(G.SCRIPTS.finDadMask(this)); return; }
      if ((this.dmgHere = (this.dmgHere || 0) + 1) >= 3) { this.toWalk(50); this.world.pop(this.x, this.y - 58, 'Shakes it off!', '#c8a8f8'); }
    }
    bomb(sx, sy) { if (this.isOpen) this.hit(2, sx, sy); else if (!this.lurking) this.open(70, 'STUNNED!'); }

    draw(ctx, cx, cy) {
      if (this.hidden || this.lurking) return;
      const B = bigOf(this.sprite);
      const moving = this.state === 'walk' || this.state === 'charge' || this.state === 'dive';
      let img = this.state === 'defeated' ? B.down[0] : B[this.dir][moving ? walkFrame(this.anim, true) : 0];
      if (this.state === 'flex' || this.state === 'bigNo' || this.state === 'yell' || this.state === 'heal') img = B.hold;
      if ((this.hurtT && (this.hurtT >> 1) & 1) || (this.state === 'windup' && (this.st >> 2) & 1)) img = G.art.flash(img);
      ctx.drawImage(G.spr.shadowBig, Math.round(this.x - 12) - cx, Math.round(this.y - 4) - cy, 24, 6);
      const jx = this.state === 'windup' || this.state === 'bigNo' || this.state === 'dig' ? ((G.tick >> 1) & 1 ? 1 : -1) : 0;
      const sx = Math.round(this.x - 16 + jx) - cx, sy = Math.round(this.y - B.h + 4 - this.z) - cy;
      // the possession: a flickering purple glow around them
      if (this.state !== 'defeated') {
        const glow = tinted(img, '#a85ae8');
        ctx.save(); ctx.globalAlpha = 0.45 + Math.sin(this.t * 0.15) * 0.25;
        for (const [ox, oy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) ctx.drawImage(glow, sx + ox, sy + oy);
        ctx.restore();
      }
      ctx.drawImage(img, sx, sy);
      // Mom's watering can
      if (this.state === 'watering' || (this.state === 'open' && this.id === 'michelle' && this.st > 50)) ctx.drawImage(G.spr.wateringCan, sx + 22, sy + 30);
      // Hannah's heal: a green glow
      if (this.state === 'heal') { ctx.save(); ctx.globalAlpha = 0.25 + Math.sin(this.t * 0.3) * 0.15; ctx.drawImage(tinted(img, '#78e070'), sx, sy); ctx.restore(); }
      if (this.state === 'open') {
        for (let i = 0; i < 4; i++) {
          const a = G.tick * 0.12 + (i * Math.PI) / 2;
          ctx.fillStyle = i % 2 ? '#f8d850' : '#ffffff';
          ctx.fillRect(Math.round(this.x + Math.cos(a) * 12) - cx, Math.round(sy - 4 + Math.sin(a) * 3), 3, 3);
        }
      }
    }
  }
  G.Possessed = Possessed;

  // ============================================================== FATHER EGGMAS
  // During the gauntlet he sits on his throne of egg cartons and watches. Then the relay:
  // each of the family gets a turn against him with their own move, and he only takes
  // damage from that move (TURNS). Every turn he fights a little differently, and nastier.
  // Abe's turn ends with the first big crack in his shell ("Nice crack, Abe!"). Nate goes
  // last: egg tennis with the golden egg knocks him down, and Abe's pipe song, Nice Crack,
  // finishes the job.
  const TURNS = {
    doron: { weapon: 'rock', need: 5, h: 22, every: 100, attacks: ['lob', 'spirals', 'egglets', 'lob'], tip: 'Z: pick up a rock. Z again: throw it at Father Eggmas!' },
    dad: { weapon: 'letter', need: 10, h: 22, every: 90, attacks: ['spirals', 'lob', 'egglets', 'lob'], tip: 'Z: "EEENGLISH!" Letters fly at Father Eggmas.' },
    lily: { weapon: 'no', need: 5, h: 16, every: 85, attacks: ['spirals', 'spirals', 'lob', 'egglets'], tip: 'Hold Z to wind up a "No." Let go to say it. Only a full "No." counts!' },
    michelle: { weapon: 'egg', need: 12, h: 22, every: 80, attacks: ['egglets', 'lob', 'spirals', 'rain'], tip: 'Z: Henrietta fires an egg.' },
    abe: { weapon: 'reach', need: 6, h: 50, every: 80, attacks: ['lights', 'lob', 'spirals', 'lights'], tip: 'He\'s floating too high for anybody else. Z: Abe reaches up and bonks him!' },
    hannah: { weapon: 'ice', need: 9, h: 22, every: 72, attacks: ['spirals', 'rain', 'lights', 'egglets'], tip: 'Z: throw an ice pack.' },
    nate: { weapon: 'crack', need: 3, h: 22, every: 70, attacks: ['golden', 'lob', 'spirals', 'golden', 'lights', 'egglets'], tip: 'Bat the golden egg back with your hammer until it knocks him down. Then puff NICE CRACK (X: down, down, left)!' },
  };
  G.FIN_TURNS = TURNS;
  G.FIN_RELAY = ['doron', 'dad', 'lily', 'michelle', 'abe', 'hannah', 'nate'];
  const RELAY_TOTAL = G.FIN_RELAY.reduce((n, id) => n + TURNS[id].need, 0);

  class EggmasBoss extends Ent {
    constructor(x, y, bounds) {
      super(x, y);
      Object.assign(this, {
        enemy: true, boss: true, noBar: true, name: 'FATHER EGGMAS', bounds, state: 'throne', t: 0, h: 0, hurtT: 0, turn: null,
        turnHits: 0, cracks: 0, cycle: 0, atkT: 120, home: { x, y }, hb: { w: 30, h: 10 }, scale: 2, throneX: x, throneY: y,
      });
      this.hp = this.maxHp = RELAY_TOTAL;
    }
    get td() { return TURNS[this.turn]; }
    // what can hit him: everything near him on the ground (his shadow and up through him), or
    // only his body when he's floating high (Abe's turn)
    hurtBox() {
      if (this.state !== 'fight' && this.state !== 'down') return [-999, -999, -998, -998];
      return this.h > 40 ? [this.x - 18, this.y - this.h - 58, this.x + 18, this.y - this.h - 8] : [this.x - 22, this.y - this.h - 60, this.x + 22, this.y + 6];
    }
    // the relay: start someone's turn
    beginTurn(id) {
      this.turn = id; this.turnHits = 0; this.state = 'fight'; this.atkT = 80; this.cycle = 0; this.noBar = false;
      this.targetH = this.td.h;
    }
    update(w) {
      this.t++;
      if (this.hurtT > 0) this.hurtT--;
      if (this.h !== (this.targetH || 0) && this.state !== 'down') this.h += Math.sign((this.targetH || 0) - this.h) * Math.min(1.5, Math.abs((this.targetH || 0) - this.h));
      if (G.script.busy) return;
      if (this.state === 'throne') {
        if (this.t % 260 === 120) w.pop(this.x, this.y - 92, ['HO HO HO.', 'Isn\'t this NICE? The whole family, together.', 'Merry Christmas, Nate.', 'HO. HO. HO.'][Math.floor(this.t / 260) % 4], '#f86858');
        return;
      }
      if (this.state === 'down') {
        if (--this.downT <= 0) { this.state = 'fight'; this.targetH = this.td.h; w.pop(this.x, this.y - 60, 'He\'s back up!', '#f86858'); }
        return;
      }
      if (this.state !== 'fight') return;
      // Doron's turn: the ditch keeps turning up rocks
      if (this.turn === 'doron' && this.t % 90 === 0 && w.ents.filter((e) => e instanceof LiftRock && !e.dead).length < 3 && !G.play.player.carry) {
        const b0 = this.bounds, r = w.add(new LiftRock(b0.x0 + 10 + Math.random() * (b0.x1 - b0.x0 - 20), b0.y0 + 40 + Math.random() * (b0.y1 - b0.y0 - 50)));
        w.burst(r.x, r.y - 4, ['#a8a49c', '#5a4e40'], 6, { speed: 0.8, up: 0.8, life: 16, size: 1 });
      }
      // floating around the ditch in a slow figure-eight
      const b = this.bounds, sp = 0.012 + this.cracks * 0.003 + (this.turn === 'nate' ? 0.004 : 0);
      const tx = (b.x0 + b.x1) / 2 + Math.sin(this.t * sp) * (b.x1 - b.x0) * 0.38, ty = b.y0 + 40 + (Math.sin(this.t * sp * 2) + 1) * (b.y1 - b.y0 - 80) * 0.3;
      this.x += (tx - this.x) * 0.04; this.y += (ty - this.y) * 0.04;
      if (--this.atkT <= 0) {
        const a = this.td.attacks[this.cycle++ % this.td.attacks.length];
        this.attack(w, a);
        this.atkT = this.td.every;
      }
    }
    attack(w, a) {
      const p = G.play.player, b = this.bounds;
      if (a === 'lob' || a === 'rain') {
        const n = a === 'rain' ? 6 : 3;
        for (let i = 0; i < n; i++) {
          const near = i === 0 || a === 'lob';
          const tx = near ? G.clamp(p.x + (Math.random() * 60 - 30), b.x0, b.x1) : b.x0 + Math.random() * (b.x1 - b.x0);
          const ty = near ? G.clamp(p.y + (Math.random() * 40 - 20), b.y0, b.y1) : b.y0 + Math.random() * (b.y1 - b.y0);
          w.add(new Lob(this.x, this.y - this.h - 30, tx, ty, G.spr.ornaments[i % 3], { n: 48 + i * 6, h: 50, z0: this.h + 30, onLand: (ww, x, y) => G.ornamentShatter(ww, x, y) }));
        }
        G.audio.sfx('swing');
        w.pop(this.x, this.y - this.h - 74, a === 'rain' ? 'DECK THE HALLS!' : 'HO HO HO!', '#f86858');
      } else if (a === 'spirals') {
        const n = this.cracks ? 4 : 3, base = Math.atan2(p.y - this.y, p.x - this.x);
        for (let i = 0; i < n; i++) { const ang = base + (i - (n - 1) / 2) * 0.7; w.add(new HypnoShot(this.x, this.y - this.h - 30, Math.cos(ang) * 1, Math.sin(ang) * 1)); }
        G.audio.sfx('whine');
      } else if (a === 'egglets') {
        const alive = w.ents.filter((e) => e instanceof Egglet && !e.dead).length;
        for (let i = 0; i < Math.min(2, 4 - alive); i++) {
          const e = w.add(new Egglet(this.x + (i ? 16 : -16), this.y + 4));
          w.burst(e.x, e.y - 8, ['#f2ead6', '#7a1e2c'], 6, { speed: 1, life: 16, size: 2 });
        }
        w.pop(this.x, this.y - this.h - 74, 'Go, my little eggs!', '#f86858');
      } else if (a === 'lights') {
        // he yanks his Christmas lights: a string goes taut across the ditch and lights up
        const rows = this.cracks ? 2 : 1;
        for (let i = 0; i < rows; i++) {
          const y = i === 0 ? G.clamp(p.y, b.y0, b.y1) : G.clamp(p.y + (Math.random() < 0.5 ? -40 : 40), b.y0, b.y1);
          w.add(new LightWire(b.x0 - 24, b.x1 + 24, y));
        }
        G.audio.sfx('buzz');
        w.pop(this.x, this.y - this.h - 74, 'LIGHT IT UP!', '#f8e070');
      } else if (a === 'golden') {
        if (w.ents.some((e) => e instanceof GoldenEgg && !e.dead)) return;
        const rotten = this.cracks > 0 && Math.random() < 0.25;
        w.add(new GoldenEgg(this, rotten));
        G.audio.sfx('swing');
        w.pop(this.x, this.y - this.h - 74, rotten ? 'Catch THIS!' : 'Catch, Nate!', '#f8e070');
      }
    }
    // a hit from the move whose turn it is
    relayHit(kind, src) {
      if (this.state !== 'fight' && this.state !== 'down') return false;
      if (!this.turn || kind !== this.td.weapon) return false;
      if (kind !== 'crack' && this.hurtT > 0) return true;
      this.hp = Math.max(0, this.hp - 1);
      this.turnHits++;
      this.hurtT = 14;
      G.audio.sfx('hit'); G.play.shake(5, 2);
      this.world.burst(this.x, this.y - this.h - 36, ['#f2ead6', '#7a1e2c', '#f8e070'], 8, { speed: 1.6, up: 0.8, g: 0.06, life: 24, size: 2 });
      this.world.pop(this.x, this.y - this.h - 78, ['OOF!', 'HOW DARE YOU!', 'MY PAISLEY!', 'OW! OW!'][this.turnHits % 4], '#f86858');
      if (this.turnHits >= this.td.need) { this.state = 'tagout'; G.script.run(G.SCRIPTS.finTagOut(this)); }
      return true;
    }
    hit(dmg, sx, sy) {
      if (this.turn === 'michelle') { this.relayHit('egg'); return; }
      if (this.turn === 'nate' && G.tick - (this.slipPop || -99) > 40) {
        this.slipPop = G.tick;
        this.world.pop(this.x, this.y - this.h - 70, this.state === 'down' ? 'Puff NICE CRACK! (X: down, down, left)' : 'Too slippery! Bat the golden egg!', '#f8e070');
      }
    }
    // Lily's "No."
    onNo(shot) {
      if (this.turn !== 'lily' || this.state !== 'fight') return false;
      if (shot.weak) { this.world.pop(this.x, this.y - this.h - 74, 'WAS THAT A MAYBE? HO HO!', '#f86858'); return true; }
      return this.relayHit('no');
    }
    noBox() { return this.hurtBox(); }
    // the golden egg got him: down he goes, and Nate has a few seconds for Nice Crack
    knockDown() {
      this.state = 'down'; this.downT = 330; this.targetH = 0; this.h = Math.min(this.h, 10);
      G.audio.sfx('boom'); G.play.shake(14, 3);
      this.world.burst(this.x, this.y - 30, ['#f8e070', '#f2ead6', '#ffffff'], 16, { speed: 2, up: 1, g: 0.1, life: 26, size: 2 });
      this.world.pop(this.x, this.y - 74, 'NOW! Puff NICE CRACK! (X: down, down, left)', '#f8e070');
    }
    draw(ctx, cx, cy) {
      if (this.hidden) return;
      const img0 = G.spr.eggmas, sc = this.scale, W = img0.width * sc, H = img0.height * sc;
      const bob = this.state === 'throne' ? Math.round(Math.sin(this.t * 0.05) * 1) : this.state === 'down' ? 0 : Math.round(Math.sin(this.t * 0.08) * 3);
      const x = Math.round(this.x - W / 2) - cx, gy = Math.round(this.y) - cy, y = gy - H - Math.round(this.h) + bob;
      if (this.state === 'throne') ctx.drawImage(G.spr.eggThrone, Math.round(this.throneX - 44) - cx, Math.round(this.throneY - 92) - cy);
      else {
        // his shadow on the ditch bed
        ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = '#100818';
        ctx.beginPath(); ctx.ellipse(Math.round(this.x) - cx, gy, 20, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
      // a dark purple glow around him
      ctx.save(); ctx.globalAlpha = 0.3 + Math.sin(this.t * 0.07) * 0.12;
      const g = tinted(img0, '#6a2a9a');
      ctx.drawImage(g, x - 3, y - 3, W + 6, H + 6);
      ctx.restore();
      let img = img0;
      if (this.hurtT && (this.hurtT >> 1) & 1) img = G.art.flash(img0);
      ctx.drawImage(img, x, y, W, H);
      // cracks in his shell
      const cr = this.cracks;
      if (cr) {
        ctx.fillStyle = '#3a2a1a';
        const lines = [[[14, 1], [12, 4], [15, 6], [13, 9]], [[6, 5], [9, 7], [8, 10], [11, 12]], [[22, 5], [19, 8], [21, 11], [18, 13]]];
        for (let i = 0; i < Math.min(cr, lines.length); i++) {
          const L = lines[i];
          for (let k = 0; k < L.length - 1; k++) {
            const [ax, ay] = L[k], [bx, by] = L[k + 1], n = Math.max(Math.abs(bx - ax), Math.abs(by - ay)) * sc;
            for (let s = 0; s <= n; s++) ctx.fillRect(x + Math.round((ax + (bx - ax) * s / n) * sc), y + Math.round((ay + (by - ay) * s / n) * sc), Math.max(1, sc >> 1), Math.max(1, sc >> 1));
          }
        }
      }
      if (this.state === 'down') for (let i = 0; i < 4; i++) {
        const a = G.tick * 0.12 + (i * Math.PI) / 2;
        ctx.fillStyle = i % 2 ? '#f8d850' : '#ffffff';
        ctx.fillRect(Math.round(this.x + Math.cos(a) * 18) - cx, Math.round(y - 4 + Math.sin(a) * 4), 3, 3);
      }
    }
  }
  G.EggmasBoss = EggmasBoss;

  // An egglet: a little Father Eggmas, waddling after whoever's up. One hit pops it (it
  // might have a heart in it).
  class Egglet extends Critter {
    constructor(x, y) { super(x, y, 1); Object.assign(this, { bits: ['#f2ead6', '#7a1e2c', '#fbfbf8'], dropChance: 0.45, face: 1 }); }
    hurtBox() { return [this.x - 7, this.y - 15, this.x + 7, this.y]; }
    onNo() { this.hit(1, this.x, this.y + 10); return false; }
    think(w, p, dx, dy, dist) {
      this.chase(w, dx, dy, dist, 0.55);
      this.face = dx > 0 ? 1 : -1;
      if (this.t % 200 === 50) w.pop(this.x, this.y - 22, 'ho ho', '#f86858');
    }
    die() {
      this.dead = true;
      G.audio.sfx('poof');
      this.world.burst(this.x, this.y - 8, this.bits, 10, { speed: 1.2, life: 20, size: 2 });
      if (Math.random() < this.dropChance) this.world.add(new Pickup(this.x, this.y, G.state.hp < G.state.maxHp ? 'heart' : 'tooth'));
    }
    draw(ctx, cx, cy) {
      const img = G.spr.egglet[this.face > 0 ? 'right' : 'left'][(this.t >> 3) & 1];
      this.drawSprite(ctx, cx, cy, img);
    }
  }
  G.Egglet = Egglet;

  // The golden egg (egg tennis): bat it back with the hammer. He bats it back too, a little
  // faster every time... until he misses, and it knocks him flat. The rotten one (green):
  // DON'T swing at it, just get out of the way.
  class GoldenEgg extends Ent {
    constructor(boss, rotten) {
      super(boss.x, boss.y + 4);
      Object.assign(this, { boss, rotten, sp: 1.25, toBoss: false, z: boss.h + 34, life: 900, hb: { w: 16, h: 18 } });
      // how many times he'll bat it back before he misses
      this.bats = rotten ? 0 : Math.floor(Math.random() * (boss.cracks ? 3 : 2)) + (boss.turnHits ? 1 : 0);
    }
    update(w) {
      if (G.script.busy) return;
      if (--this.life <= 0) { this.shatter(w); return; }
      const p = G.play.player, b = this.boss;
      const tx = this.toBoss ? b.x : p.x, ty = this.toBoss ? b.y + 2 : p.y;
      const dx = tx - this.x, dy = ty - this.y, d = Math.hypot(dx, dy) || 1;
      this.x += (dx / d) * this.sp; this.y += (dy / d) * this.sp;
      const zt = this.toBoss ? b.h + 30 : 10;
      this.z += (zt - this.z) * 0.06;
      this.t = (this.t || 0) + 1;
      if (this.t % 4 === 0) w.burst(this.x, this.y - this.z - 4, this.rotten ? ['#8aaa4a'] : ['#f8e070', '#ffffff'], 1, { speed: 0.2, life: 14, size: 1 });
      if (!this.toBoss && d < 9) {
        p.hurt(this.rotten ? 1 : 2, this.x, this.y);
        if (this.rotten) w.pop(this.x, this.y - 26, 'EW!', '#8aaa4a');
        this.shatter(w);
      } else if (this.toBoss && d < 16) {
        if (b.state !== 'fight') { this.shatter(w); return; }
        if (this.bats > 0) {
          this.bats--; this.toBoss = false; this.sp += 0.3;
          G.audio.sfx('clank'); w.pop(b.x, b.y - b.h - 74, ['HO!', 'HO HO!', 'NICE TRY!'][this.bats % 3], '#f86858');
        } else { this.dead = true; b.knockDown(); }
      }
    }
    onHammer(player) {
      if (this.toBoss) return;
      if (this.rotten) {
        this.world.pop(this.x, this.y - 26, 'SPLAT! EW!', '#8aaa4a');
        player.hurt(1, this.x, this.y);
        this.shatter(this.world);
        return;
      }
      this.toBoss = true; this.sp += 0.35;
      G.audio.sfx('hit'); G.play.shake(3, 1);
      this.world.pop(this.x, this.y - 30, 'THWACK!', '#f8e070');
    }
    shatter(w) {
      this.dead = true;
      G.audio.sfx('poof');
      w.burst(this.x, this.y - this.z, this.rotten ? ['#6a8a3a', '#8aaa4a', '#f8f0d0'] : ['#f8e070', '#e8b830', '#ffffff'], 10, { speed: 1.4, up: 0.6, g: 0.08, life: 20, size: 2 });
    }
    draw(ctx, cx, cy) {
      drawShadow(ctx, this.x, this.y, cx, cy, false);
      ctx.drawImage(G.spr.goldenEgg[this.rotten ? 1 : 0], Math.round(this.x - 6) - cx, Math.round(this.y - 14 - this.z) - cy);
    }
  }
  G.GoldenEgg = GoldenEgg;

  // Father Eggmas's Christmas lights, yanked taut across the ditch: they blink while they
  // tighten (get out from under them, or find a gap where a bulb's missing), then light up.
  class LightWire extends Ent {
    constructor(x0, x1, y) {
      super((x0 + x1) / 2, y);
      Object.assign(this, { x0, x1, t: 0, flat: true });
      const n = Math.floor((x1 - x0) / 12), g = 2 + Math.floor(Math.random() * (n - 5));
      this.gaps = [g, g + 1];
    }
    inGap(x) { const i = Math.floor((x - this.x0) / 12); return this.gaps.includes(i); }
    update() {
      if (G.script.busy) return;
      this.t++;
      if (this.t === 56) G.audio.sfx('buzz');
      if (this.t > 56 && this.t < 92) {
        const p = G.play.player;
        if (Math.abs(p.y - this.y) < 7 && !this.inGap(p.x)) p.hurt(1, p.x, this.y - 10);
      }
      if (this.t >= 96) this.dead = true;
    }
    draw(ctx, cx, cy) {
      const live = this.t > 56, n = Math.floor((this.x1 - this.x0) / 12), y = Math.round(this.y) - cy - 2;
      ctx.fillStyle = live ? '#f8f0a0' : '#2a2a30';
      ctx.fillRect(Math.round(this.x0) - cx, y, Math.round(this.x1 - this.x0), 1);
      const cols = ['#f83838', '#38c848', '#f8e040', '#3878f8'];
      for (let i = 0; i < n; i++) {
        if (this.gaps.includes(i)) continue;
        const bx = Math.round(this.x0 + i * 12 + 6) - cx, on = live || ((this.t >> 2) + i) % 3 === 0;
        ctx.fillStyle = on ? cols[i % 4] : '#4a4a54';
        ctx.fillRect(bx - 1, y + 1, 3, 4);
        if (live && (this.t + i) % 4 < 2) { ctx.fillStyle = '#ffffff'; ctx.fillRect(bx, y - 2, 1, 2); }
      }
    }
  }
  G.LightWire = LightWire;

  // ---- the family's moves against Father Eggmas (they hit his egglets, too)
  class RelayShot extends Ent {
    constructor(x, y, vx, vy, kind) { super(x, y); Object.assign(this, { vx, vy, kind, life: 80 }); }
    update(w) {
      if (G.script.busy) return;
      this.x += this.vx; this.y += this.vy;
      if (--this.life <= 0 || w.tileSolid(Math.floor(this.x / 16), Math.floor((this.y - 6) / 16))) { this.dead = true; return; }
      const r = [this.x - 6, this.y - 16, this.x + 6, this.y - 2];
      for (const e of w.ents) {
        if (e.dead) continue;
        if (e instanceof EggmasBoss) { if (G.overlap(r, e.hurtBox()) && e.relayHit(this.kind)) { this.dead = true; return; } }
        else if (e.enemy && e.hurtBox && !e.boss && G.overlap(r, e.hurtBox())) { e.hit(1, this.x - this.vx * 4, this.y - this.vy * 4); this.dead = true; return; }
      }
    }
    draw(ctx, cx, cy) {
      if (this.kind === 'letter') G.font.drawBig(ctx, this.ch || 'E', Math.round(this.x - 4) - cx, Math.round(this.y - 18) - cy, 1, '#f8d850', '#5a1020');
      else ctx.drawImage(G.spr.icePack, Math.round(this.x - 6) - cx, Math.round(this.y - 14) - cy);
    }
  }
  G.RelayShot = RelayShot;
  // a rock Doron can pick up off the ditch bed
  class LiftRock extends Ent {
    constructor(x, y) { super(x, y); this.hb = { w: 14, h: 8 }; }
    draw(ctx, cx, cy) { drawShadow(ctx, this.x, this.y, cx, cy, false); ctx.drawImage(G.spr.tossRock, Math.round(this.x - 6) - cx, Math.round(this.y - 9) - cy); }
  }
  G.LiftRock = LiftRock;

  // what Z does for each of the family on their turn (Lily's is her "No.", built in)
  G.RELAY_LABEL = { doron: 'ROCK', dad: 'ENG', lily: 'NO.', michelle: 'EGG', abe: 'BONK', hannah: 'ICE' };
  const eggmasIn = (w) => w.ents.find((e) => e instanceof EggmasBoss && !e.dead);
  G.RELAY_MOVE = {
    // Doron: pick up a rock (Z), throw it at Father Eggmas (Z)
    doron(p, w) {
      if (p.relayCd > 0) return;
      const boss = eggmasIn(w);
      if (p.carry) {
        p.carry = false; p.pose = null; p.relayCd = 18;
        const tx = boss ? boss.x : p.x, ty = boss ? boss.y : p.y - 60;
        G.audio.sfx('swing'); w.pop(p.x, p.y - 34, 'HRNGH!', '#68c8ff');
        w.add(new Lob(p.x, p.y - 26, tx, ty, G.spr.tossRock, { n: 34, h: 30, z0: 22, dmg: 0, color: null, onLand: (ww, x, y) => {
          G.audio.sfx('bump'); ww.burst(x, y - 3, ['#a8a49c', '#5a5650'], 7, { speed: 1.1, up: 0.8, life: 18, size: 2 });
          const bb = eggmasIn(ww);
          if (bb && Math.abs(bb.x - x) < 26 && Math.abs(bb.y - y) < 22) bb.relayHit('rock');
          for (const e of ww.ents) if (e instanceof Egglet && !e.dead && Math.hypot(e.x - x, e.y - y) < 18) e.hit(1, x, y);
        } }));
        return;
      }
      const rock = w.ents.find((e) => e instanceof LiftRock && !e.dead && Math.hypot(e.x - p.x, e.y - p.y) < 22);
      if (!rock) { if (G.tick - (p.rockPop || -99) > 40) { p.rockPop = G.tick; w.pop(p.x, p.y - 32, 'Need a ROCK!', '#68c8ff'); } return; }
      rock.dead = true; p.carry = true; p.pose = 'hold';
      G.audio.sfx('bump'); w.pop(p.x, p.y - 34, 'ROCK!', '#68c8ff');
    },
    // Dad: "EEENGLISH!" three letters fly at Father Eggmas
    dad(p, w) {
      if (p.relayCd > 0) return;
      p.relayCd = 34;
      const boss = eggmasIn(w), base = boss ? Math.atan2(boss.y - p.y, boss.x - p.x) : Math.atan2(G.DIRS[p.dir][1], G.DIRS[p.dir][0]);
      'ENG'.split('').forEach((ch, i) => { const a = base + (i - 1) * 0.22; const s = w.add(new RelayShot(p.x, p.y - 2, Math.cos(a) * 2.4, Math.sin(a) * 2.4, 'letter')); s.ch = ch; s.life = 100; });
      G.audio.sfx('yell'); w.pop(p.x, p.y - 34, 'EEENGLISH!', '#f8d850');
    },
    // Mom: Henrietta fires an egg
    michelle(p, w) {
      if (p.relayCd > 0) return;
      p.relayCd = 16;
      w.add(new G.EggShot(p.x, p.y, p.dir));
      G.audio.sfx('bawk');
    },
    // Abe: he's 6'5". He reaches up and bonks him
    abe(p, w) {
      if (p.relayCd > 0 || p.state !== 'walk') return;
      p.relayCd = 22; p.state = 'reach'; p.t = 0; p.pose = 'hold'; p.hitSet.clear();
      G.audio.sfx('swing');
    },
    // Hannah: an ice pack
    hannah(p, w) {
      if (p.relayCd > 0) return;
      p.relayCd = 26;
      const boss = eggmasIn(w), a = boss ? Math.atan2(boss.y - p.y, boss.x - p.x) : Math.atan2(G.DIRS[p.dir][1], G.DIRS[p.dir][0]);
      w.add(new RelayShot(p.x, p.y - 2, Math.cos(a) * 2.2, Math.sin(a) * 2.2, 'ice'));
      G.audio.sfx('swing');
    },
  };
  // Abe's reach: a tall box straight up over his head
  G.relayReach = (p, w) => {
    const r = [p.x - 14, p.y - 96, p.x + 14, p.y - 8];
    for (const e of w.ents) {
      if (e.dead || p.hitSet.has(e)) continue;
      if (e instanceof EggmasBoss) { if (G.overlap(r, e.hurtBox())) { p.hitSet.add(e); if (e.relayHit('reach')) w.pop(p.x, p.y - 60, 'BONK!', '#ffa848'); } }
      else if (e.enemy && e.hurtBox && !e.boss && G.overlap([p.x - 16, p.y - 30, p.x + 16, p.y + 6], e.hurtBox())) { p.hitSet.add(e); e.hit(1, p.x, p.y); }
    }
  };



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
      this.markGone();
      this.dead = true;
      G.audio.sfx('boom');
      G.play.shake(8, 2);
      w.burst(this.x, this.y - 10, ['#e83848', '#f8d040', '#58c0f8', '#c858e8', '#ffffff'], 22, { speed: 2, life: 30, size: 2 });
      w.pop(this.x, this.y - 26, 'BOOM!', '#f8d040');
      if (Math.hypot(p.x - this.x, p.y - this.y) < 24) p.hurt(1, this.x, this.y);
    }
    hit() {
      if (this.dead) return;
      this.markGone();
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
      if (this.bag && this.t % 130 === 0) w.pop(this.x, this.y - 32, '*crunch crunch*', '#c8a080');
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
      if (this.bag) { this.bag = false; G.script.run(G.SCRIPTS.doritosBack()); }
      for (let i = 0; i < 3; i++) this.world.add(new Pickup(this.x + (i - 1) * 10, this.y + 4, 'tooth5'));
    }
    draw(ctx, cx, cy) {
      const set = this.face === 'left' ? G.spr.bearL : G.spr.bear;
      const moving = this.fled || this.state === 'charge' || (this.state === 'roam' && (this.vx || this.vy));
      const frame = moving ? Math.floor(this.t / (this.state === 'charge' || this.fled ? 5 : 10)) % 2 : 0;
      if (this.fled) ctx.globalAlpha = Math.min(1, this.st / 40);
      this.drawSprite(ctx, cx, cy, set[frame]);
      // Dad's blue Doritos, clamped in its jaws
      if (this.bag) {
        const bx = Math.round(this.x + (this.face === 'left' ? -17 : 11)) - cx, by = Math.round(this.y - 15) - cy;
        ctx.fillStyle = '#2a5ad0'; ctx.fillRect(bx, by, 6, 8);
        ctx.fillStyle = '#c8c8d0'; ctx.fillRect(bx, by, 6, 1);
        ctx.fillStyle = '#e88a30'; ctx.fillRect(bx + 2, by + 3, 2, 2);
      }
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
  // Lives in the basement and eats Michelle's books. He loves books.
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
            G.play.earworm = 170; G.play.earwormKind = 'song';
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
  ];
  G.JJ_SONG = JJ_SONG;
  const JJ_OUCH = ['OUCH, BRO!', 'NOT THE MIC!', 'STILL ON KEY!', 'AYO?!', 'I\'M ICY!', 'THAT WAS FLAT!'];
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


  // ============================================================== THE ANDOVER MINES
  // A mineral vein (or a dump pile / slag heap): three hammer hits (the bass
  // counts double) and it breaks open, rolling a specimen from its zone.
  class OreVein extends Ent {
    constructor(x, y, zone) {
      super(x, y);
      this.solid = true;
      this.hb = { w: 14, h: 8 };
      this.zone = zone;
      this.hits = 0;
      this.shakeT = 0;
      this.t = Math.floor(Math.random() * 90);
    }
    onHammer(p) {
      if (this.dead) return;
      this.hits += p.state === 'bass' ? 2 : 1;
      this.shakeT = 8;
      G.audio.sfx('clank');
      const w = this.world;
      w.burst(this.x, this.y - 8, ['#8a7466', '#a8583a', '#c8c8d8'], 5, { speed: 1.2, up: 0.6, g: 0.1, life: 16, size: 2 });
      w.pop(this.x, this.y - 22, this.hits >= 3 ? 'CRACK!' : 'CLINK!', '#e0e0e8');
      if (this.hits >= 3) {
        this.dead = true;
        w.burst(this.x, this.y - 6, ['#8a7466', '#6e5a4e', '#a8583a'], 12, { speed: 1.4, up: 0.8, g: 0.1, life: 24, size: 3 });
        G.rockFind(this.zone, this.x, this.y);
      }
    }
    update() { this.t++; if (this.shakeT > 0) this.shakeT--; }
    draw(ctx, cx, cy) {
      const jx = this.shakeT > 0 ? ((this.shakeT >> 1) & 1 ? 1 : -1) : 0;
      if (this.zone === 'dump' || this.zone === 'slag') {
        ctx.drawImage(this.zone === 'slag' ? G.spr.slagPile : G.spr.dumpPile, Math.round(this.x - 10 + jx) - cx, Math.round(this.y - 11) - cy);
      } else if (G.spr.outcrops[this.zone]) {
        // a bedrock outcrop poking out of the grass, cracking as it's hammered
        const ox = Math.round(this.x - 10 + jx) - cx, oy = Math.round(this.y - 13) - cy;
        ctx.drawImage(G.spr.outcrops[this.zone], ox, oy);
        ctx.fillStyle = '#1c1612';
        if (this.hits >= 1) { ctx.fillRect(ox + 9, oy + 4, 1, 5); ctx.fillRect(ox + 10, oy + 8, 1, 2); }
        if (this.hits >= 2) { ctx.fillRect(ox + 5, oy + 7, 1, 4); ctx.fillRect(ox + 12, oy + 6, 3, 1); }
      } else {
        ctx.drawImage(G.spr.oreVein[Math.min(2, this.hits)], Math.round(this.x - 9 + jx) - cx, Math.round(this.y - 15) - cy);
      }
      // in the dark tunnels the veins glint through the lantern-less black
      if (this.glowColor) this.world.glows.push({ x: Math.round(this.x + 3), y: Math.round(this.y - 10 + Math.sin(this.t / 20)), color: this.glowColor });
      // a glint now and then
      if ((this.t % 90) < 6) { ctx.fillStyle = '#ffffff'; ctx.fillRect(Math.round(this.x + 3) - cx, Math.round(this.y - 10) - cy, 1, 1); ctx.fillRect(Math.round(this.x + 2) - cx, Math.round(this.y - 11) - cy, 3, 1); }
    }
  }
  G.OreVein = OreVein;

  // Old quarry rubble on the fairgrounds: green serpentine, far too solid for
  // a hammer. A Booby-Trapped Package, though...
  class QuarryRubble extends Ent {
    constructor(x, y) {
      super(x, y);
      this.solid = true;
      this.hb = { w: 22, h: 8 };
      this.shakeT = 0;
    }
    onHammer() {
      this.shakeT = 6;
      G.audio.sfx('clank');
      this.world.pop(this.x, this.y - 26, 'CLANK! Too solid.', '#e0e0e8');
    }
    bomb() {
      if (this.dead) return;
      this.dead = true;
      this.world.burst(this.x, this.y - 8, ['#4e7a5e', '#78a888', '#2e4a3a', '#9ac8a8'], 22, { speed: 2, up: 1.2, g: 0.1, life: 36, size: 3 });
      G.rockGain('serpentine', this.x, this.y);
    }
    update() { if (this.shakeT > 0) this.shakeT--; }
    draw(ctx, cx, cy) {
      const jx = this.shakeT > 0 ? ((this.shakeT >> 1) & 1 ? 1 : -1) : 0;
      ctx.drawImage(G.spr.quarryRubble, Math.round(this.x - 12 + jx) - cx, Math.round(this.y - 15) - cy);
    }
  }
  G.QuarryRubble = QuarryRubble;

  // A rock far too heavy for Nate (the basalt boulder by Brady Brook, the
  // dolomite ledge on campus). Doron can heave it up and crack it open.
  class BigRock extends Ent {
    constructor(x, y, kind, onHammer) {
      super(x, y);
      this.solid = true;
      this.kind = kind;
      this.hb = { w: 32, h: 12 };
      this.onHammerFn = onHammer;
      this.lift = 0;
      this.shakeT = 0;
    }
    onHammer(p) {
      if (G.script.busy) return;
      G.audio.sfx('clank');
      this.shakeT = 6;
      const [dx, dy] = G.DIRS[p.dir];
      this.world.burst(p.x + dx * 14, p.y - 8 + dy * 10, ['#ffffff', '#f8d850', '#ffb040'], 8, { speed: 1.6, life: 12 });
      this.world.pop(p.x + dx * 12, p.y - 30, 'CLANK!', '#e0e0e8');
      this.onHammerFn(this);
    }
    update() { if (this.shakeT > 0) this.shakeT--; }
    draw(ctx, cx, cy) {
      const img = this.kind === 'basalt' ? G.spr.bigBasalt : G.spr.bigDolomite;
      const jx = this.shakeT > 0 ? ((G.tick >> 1) & 1 ? 1 : -1) : 0;
      if (this.lift) ctx.drawImage(G.spr.shadowBig, Math.round(this.x - 18) - cx, Math.round(this.y - 4) - cy, 36, 5);
      const x0 = Math.round(this.x - 18 + jx) - cx, y0 = Math.round(this.y - 24 - this.lift) - cy;
      ctx.drawImage(img, x0, y0);
      // split open (until the next visit)
      if (this.done) { ctx.fillStyle = '#0c0a0a'; for (let i = 0; i < 10; i++) ctx.fillRect(x0 + 17 + ((i >> 1) & 1), y0 + 5 + i * 2, 1, 2); }
    }
  }
  G.BigRock = BigRock;

  // ============================================================== FATHER CHRISTMAS (postgame boss)
  // The original Christmas doll, out of the box after years in the basement.
  // Spirals of glass ornaments, a sleigh dash that leaves candy canes behind,
  // present bombs that burst into rings, a teleport-and-lunge, and (furious)
  // HO HO HO shockwaves with one gap to slip through. Faster at each phase.
  class FCOrnament extends Ent {
    constructor(x, y, vx, vy, kind = 0) { super(x, y); Object.assign(this, { vx, vy, kind, life: 260 }); }
    hurtBox() { return [this.x - 3, this.y - 12, this.x + 3, this.y - 6]; }
    update(w) {
      if (G.script.busy) return;
      this.x += this.vx; this.y += this.vy;
      if (--this.life <= 0 || w.tileSolid(Math.floor(this.x / 16), Math.floor(this.y / 16))) { this.dead = true; return; }
      const p = G.play.player;
      if (G.overlap(this.hurtBox(), p.hurtBox())) { this.dead = true; p.hurt(1, this.x, this.y); }
    }
    draw(ctx, cx, cy) {
      ctx.drawImage(G.spr.ornaments[this.kind], Math.round(this.x - 4) - cx, Math.round(this.y - 14) - cy);
      // they glint in the dark of the mine
      this.world.glows.push({ x: Math.round(this.x), y: Math.round(this.y - 9), color: ['#ff6050', '#60e070', '#f8d050'][this.kind] });
    }
  }
  G.FCOrnament = FCOrnament;

  // candy canes dropped by the sleigh dash: they stick around for a few seconds
  class FCCandyCane extends Ent {
    constructor(x, y) { super(x, y); this.life = 210; }
    hurtBox() { return [this.x - 3, this.y - 9, this.x + 3, this.y]; }
    update() {
      if (G.script.busy) return;
      if (--this.life <= 0) { this.dead = true; return; }
      const p = G.play.player;
      if (this.life < 180 && G.overlap(this.hurtBox(), p.hurtBox())) p.hurt(1, this.x, this.y);
    }
    draw(ctx, cx, cy) {
      if (this.life < 40 && (this.life >> 1) & 1) return;
      ctx.drawImage(G.spr.candyCane, Math.round(this.x - 3) - cx, Math.round(this.y - 10) - cy);
    }
  }
  G.FCCandyCane = FCCandyCane;

  // a present lobbed at Nate: lands, fizzes, then bursts into a ring of ornaments
  class FCGift extends Ent {
    constructor(x, y, tx, ty, ring) { super(x, y); Object.assign(this, { sx: x, sy: y, tx, ty, ring, t: 0, air: 46, fuse: 44, z: 0 }); }
    update(w) {
      if (G.script.busy) return;
      this.t++;
      if (this.t <= this.air) {
        const k = this.t / this.air;
        this.x = this.sx + (this.tx - this.sx) * k; this.y = this.sy + (this.ty - this.sy) * k;
        this.z = Math.sin(k * Math.PI) * 40;
        if (this.t === this.air) G.audio.sfx('bump');
        return;
      }
      this.z = 0;
      if (this.t % 10 === 0) G.audio.sfx('fuse');
      if (this.t < this.air + this.fuse) return;
      this.dead = true;
      G.audio.sfx('boom');
      G.play.shake(6, 2);
      w.fx.push({ x: this.x, y: this.y - 5, vx: 0, vy: 0, circle: true, r: 18, max: 10, life: 10, color: '#fff4c0' });
      w.burst(this.x, this.y - 5, ['#2e7a3e', '#f8d040', '#ffffff', '#d83030'], 12, { speed: 1.8, life: 18, size: 2 });
      const p = G.play.player;
      if (Math.hypot(p.x - this.x, p.y - this.y) < 18) p.hurt(2, this.x, this.y);
      const off = Math.random() * Math.PI;
      for (let i = 0; i < this.ring; i++) {
        const a = off + (i / this.ring) * Math.PI * 2;
        w.add(new FCOrnament(this.x, this.y, Math.cos(a) * 1.05, Math.sin(a) * 1.05, i % 3));
      }
    }
    draw(ctx, cx, cy) {
      ctx.drawImage(G.spr.shadow, Math.round(this.x - 6) - cx, Math.round(this.y - 3) - cy);
      let img = G.spr.giftBomb;
      if (this.t > this.air && (this.t >> (this.t > this.air + 28 ? 1 : 2)) & 1) img = G.art.flash(img);
      ctx.drawImage(img, Math.round(this.x - 5) - cx, Math.round(this.y - 11 - this.z) - cy);
    }
  }
  G.FCGift = FCGift;

  const FC_TAUNT = ['You LAUGHED at me.', 'I was FIRST.', 'An EGG. On MY mantel.', 'Years. In a BOX.', 'Ho. Ho. Ho.', 'I don\'t NEED clothes.', 'Who packed me, Nate?'];
  const FC_OUCH = ['MY MANTEL!', 'NOT THE BEARD!', 'HO... HO...', 'I WAS FIRST!', 'AN EGG?! AN EGG!', 'NAUGHTY!'];
  class FatherChristmas extends Ent {
    // bounds: [x0, y0, x1, y1] in pixels, the floor he stays over
    constructor(x, y, bounds) {
      super(x, y);
      this.enemy = true;
      this.boss = true;
      this.name = 'FATHER CHRISTMAS';
      this.hp = this.maxHp = 40;
      this.hb = { w: 16, h: 8 };
      this.bounds = bounds;
      this.t = 0;
      this.state = 'float';
      this.st = 80;
      this.cycle = 0;
      this.hurtT = 0;
      this.kb = { x: 0, y: 0 };
      this.alpha = 1;
      this.phase = 1;
      this.goal = { x, y };
    }
    hurtBox() { return [this.x - 10, this.y - 38, this.x + 10, this.y]; }
    get rage() { return this.phase >= 3; }
    clampIn(o) {
      const b = this.bounds;
      return { x: Math.max(b[0], Math.min(b[2], o.x)), y: Math.max(b[1], Math.min(b[3], o.y)) };
    }
    toFloat() { this.state = 'float'; this.st = [0, 70, 52, 38][this.phase]; this.alpha = 1; }
    pick() {
      const w = this.world, ph = this.phase;
      const order = [null,
        ['spiral', 'gifts', 'sleigh', 'spiral', 'tele'],
        ['spiral', 'sleigh', 'gifts', 'tele', 'hohoho', 'gifts'],
        ['hohoho', 'tele', 'sleigh', 'spiral', 'gifts', 'tele']][ph];
      const m = order[this.cycle++ % order.length];
      if (m === 'spiral') {
        Object.assign(this, { state: 'spiral', st: [0, 110, 130, 150][ph], spin: (Math.random() < 0.5 ? 1 : -1) * 0.21, ang: Math.random() * 6.28 });
        w.pop(this.x, this.y - 52, 'DECK THE HALLS.', '#f86858');
      } else if (m === 'gifts') {
        this.reps = [0, 3, 4, 5][ph];
        Object.assign(this, { state: 'gifts', st: this.reps * 22 + 24 });
        w.pop(this.x, this.y - 52, 'PRESENTS!', '#f86858');
      } else if (m === 'sleigh') {
        Object.assign(this, { state: 'sleighAim', st: 40, reps: ph });
      } else if (m === 'tele') {
        this.teleT = [0, 50, 42, 34][ph];
        Object.assign(this, { state: 'tele', st: this.teleT, reps: ph === 1 ? 1 : 2 });
      } else {
        Object.assign(this, { state: 'hohoho', st: 3 * 36 + 12, reps: 3 });
      }
    }
    update(w) {
      if (G.script.busy || this.state === 'defeated') return;
      this.t++;
      const p = G.play.player, dx = p.x - this.x, dy = p.y - this.y;
      if (this.hurtT > 0) {
        this.hurtT--;
        w.move(this, this.kb.x, 0); w.move(this, 0, this.kb.y);
        this.kb.x *= 0.8; this.kb.y *= 0.8;
      }
      // each phase change gets a little scene
      const ph = this.hp <= this.maxHp * 0.25 ? 3 : this.hp <= this.maxHp * 0.55 ? 2 : 1;
      if (ph > this.phase) {
        this.phase = ph;
        this.toFloat();
        Object.assign(this, this.clampIn(this));
        G.script.run(G.SCRIPTS.fcPhase(this, ph));
        return;
      }
      if (this.alpha > 0.6 && G.overlap(this.hurtBox(), p.hurtBox())) p.hurt(2, this.x, this.y);
      const fast = [0, 1, 1.3, 1.6][this.phase], b = this.bounds;
      switch (this.state) {
        case 'float': {
          // drifts around the room, keeping his distance
          if (this.t % 50 === 0 || Math.hypot(this.goal.x - this.x, this.goal.y - this.y) < 6) {
            const a = Math.random() * Math.PI * 2, r = 70 + Math.random() * 40;
            this.goal = this.clampIn({ x: p.x + Math.cos(a) * r, y: p.y + Math.sin(a) * r * 0.6 });
          }
          w.move(this, (this.goal.x - this.x) * 0.03 * fast, 0); w.move(this, 0, (this.goal.y - this.y) * 0.03 * fast);
          if (this.t % 110 === 0) w.pop(this.x, this.y - 52, FC_TAUNT[Math.floor(Math.random() * FC_TAUNT.length)], '#f86858');
          if (--this.st <= 0) this.pick();
          break;
        }
        case 'spiral': {
          // arms up, glass ornaments spiral out of the beard
          const arms = this.phase + 1, every = [0, 7, 6, 5][this.phase], v = 1.1 * Math.sqrt(fast);
          if (this.st % every === 0) {
            for (let i = 0; i < arms; i++) {
              const a = this.ang + (i / arms) * Math.PI * 2;
              w.add(new FCOrnament(this.x, this.y - 14, Math.cos(a) * v, Math.sin(a) * v, i % 3));
            }
            this.ang += this.spin;
            if (this.st % (every * 3) === 0) G.audio.sfx('blip');
          }
          if (--this.st <= 0) this.toFloat();
          break;
        }
        case 'gifts': {
          if (this.st % 22 === 0 && this.reps > 0) {
            this.reps--;
            const t = this.clampIn({ x: p.x + (Math.random() * 2 - 1) * 36, y: p.y + (Math.random() * 2 - 1) * 24 });
            w.add(new FCGift(this.x, this.y - 20, t.x, t.y, [0, 6, 8, 10][this.phase]));
            G.audio.sfx('swing');
          }
          if (--this.st <= 0) this.toFloat();
          break;
        }
        case 'sleighAim': {
          // vanishes, pops up at the far side of the room on Nate's row... then charges
          if (this.st === 40) { G.audio.sfx('poof'); w.burst(this.x, this.y - 20, ['#ece4d0', '#ffffff'], 10, { speed: 1.2, life: 20, size: 2 }); this.alpha = 0; }
          if (this.st === 30) {
            const fromLeft = p.x > (b[0] + b[2]) / 2;
            this.x = fromLeft ? b[0] : b[2];
            this.y = Math.max(b[1], Math.min(b[3], p.y));
            this.dashDir = fromLeft ? 1 : -1;
            this.alpha = 1;
            w.pop(this.x, this.y - 52, 'HO HO HO!', '#f86858');
            G.audio.sfx('yell');
          }
          if (--this.st <= 0) { this.state = 'sleigh'; this.lastDrop = this.x; G.audio.sfx('dash'); }
          break;
        }
        case 'sleigh': {
          this.x += this.dashDir * (3.2 + this.phase * 0.5);
          if (Math.abs(this.x - this.lastDrop) >= 20) { this.lastDrop = this.x; w.add(new FCCandyCane(this.x, this.y + Math.round(Math.random() * 10 - 5))); }
          if (this.t % 2 === 0) w.burst(this.x - this.dashDir * 10, this.y - 10, ['#ffffff', '#e8f4fc'], 1, { speed: 0.4, life: 16, size: 2 });
          if ((this.dashDir > 0 && this.x >= b[2]) || (this.dashDir < 0 && this.x <= b[0])) {
            if (--this.reps > 0) { this.state = 'sleighAim'; this.st = 40; } else this.toFloat();
          }
          break;
        }
        case 'tele': {
          // fades out, fades back in right behind Nate, then lunges
          const k = this.teleT - this.st;
          if (k === 1) { G.audio.sfx('poof'); w.burst(this.x, this.y - 20, ['#ece4d0', '#ffffff'], 10, { speed: 1.2, life: 20, size: 2 }); }
          if (k <= 10) this.alpha = 1 - k / 10;
          else if (k === 14) {
            const [fx, fy] = G.DIRS[p.dir];
            Object.assign(this, this.clampIn({ x: p.x - fx * 36, y: p.y - fy * 30 + (fy ? 0 : 6) }));
            this.alpha = 0.3;
            G.audio.sfx('secret');
          } else if (k > 14) this.alpha = Math.min(1, this.alpha + 0.05);
          if (--this.st <= 0) {
            const a = Math.atan2(dy, dx);
            Object.assign(this, { alpha: 1, state: 'swipe', st: 16, vx: Math.cos(a) * 4, vy: Math.sin(a) * 4 });
            w.pop(this.x, this.y - 52, 'BOO.', '#f86858');
            G.audio.sfx('dash');
          }
          break;
        }
        case 'swipe': {
          w.move(this, this.vx, 0); w.move(this, 0, this.vy);
          if (--this.st <= 0) { if (--this.reps > 0) { this.state = 'tele'; this.st = this.teleT; } else this.toFloat(); }
          break;
        }
        case 'hohoho': {
          // rings of ornaments, each with one gap (roughly toward Nate) to slip through
          if (this.st % 36 === 12 && this.reps > 0) {
            this.reps--;
            const n = 28, base = Math.atan2(dy, dx) + (Math.random() * 2 - 1) * 0.9;
            const g0 = Math.round((base / (Math.PI * 2)) * n);
            for (let i = 0; i < n; i++) {
              let d = (((i - g0) % n) + n) % n;
              if (d > n / 2) d -= n;
              if (Math.abs(d) <= 2) continue;
              const a = (i / n) * Math.PI * 2;
              w.add(new FCOrnament(this.x, this.y - 14, Math.cos(a), Math.sin(a), i % 3));
            }
            w.pop(this.x, this.y - 52, 'HO!', '#f86858');
            G.audio.sfx('yell');
            G.play.shake(8, 2);
          }
          if (--this.st <= 0) this.toFloat();
          break;
        }
      }
    }
    hit(dmg, sx, sy) {
      if (this.state === 'defeated' || this.alpha < 0.6) return;
      this.hp = Math.max(0, this.hp - dmg);
      this.hurtT = 10;
      const dx = this.x - sx, dy = this.y - sy, m = Math.hypot(dx, dy) || 1;
      this.kb = { x: (dx / m) * 1.2, y: (dy / m) * 1.2 };
      G.audio.sfx('hit');
      this.world.burst(this.x, this.y - 24, ['#ece4d0', '#fbf7ec', '#e8b898'], 5, { speed: 1.3, up: 0.6, g: 0.06, life: 26, size: 2 });
      if (Math.random() < 0.3) this.world.pop(this.x, this.y - 52, FC_OUCH[Math.floor(Math.random() * FC_OUCH.length)], '#f86858');
      if (this.hp <= 0) {
        this.state = 'defeated';
        this.alpha = 1;
        G.script.run(G.SCRIPTS.fcDefeated(this));
      }
    }
    bomb(sx, sy) { this.hit(3, sx, sy); }
    draw(ctx, cx, cy) {
      if (this.hidden || this.alpha <= 0) return;
      const up = ['spiral', 'hohoho', 'gifts', 'swipe', 'sleighAim', 'sleigh'].includes(this.state) || (this.state === 'tele' && this.st < this.teleT - 14);
      let img = this.sweater ? G.spr.fc.sweater : G.spr.fc[(up ? 'up' : 'idle') + (this.rage && this.state !== 'defeated' ? 'Rage' : '')];
      if (this.hurtT && (this.hurtT >> 1) & 1) img = G.art.flash(img);
      const bob = this.state === 'defeated' || this.still ? 0 : 3 + Math.round(Math.sin(this.t * 0.08) * 2);
      const aiming = this.state === 'sleighAim' && this.st < 30;
      // a red warning band across the row he's about to charge down
      if (aiming) { ctx.fillStyle = 'rgba(255,60,60,' + (0.12 + ((this.t >> 2) & 1) * 0.1) + ')'; ctx.fillRect(0, Math.round(this.y - 30) - cy, G.W, 32); }
      const jx = aiming ? ((this.t >> 1) & 1 ? 1 : -1) : 0;
      ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
      ctx.drawImage(G.spr.shadowBig, Math.round(this.x - 12) - cx, Math.round(this.y - 4) - cy, 24, 5);
      ctx.drawImage(img, Math.round(this.x - 15 + jx) - cx, Math.round(this.y - 42 - bob) - cy);
      ctx.globalAlpha = 1;
    }
  }
  G.FatherChristmas = FatherChristmas;

  // A brown bat: hangs still until Nate's lantern gets close, then flutters at him.
  class Bat extends Critter {
    constructor(x, y) {
      super(x, y, 1);
      this.dropChance = 0.35;
      this.bits = ['#4a3440', '#6a4a5a'];
      this.awake = false;
      this.wob = Math.random() * 6;
    }
    hurtBox() { return [this.x - 6, this.y - 20, this.x + 6, this.y - 8]; }
    think(w, p, dx, dy, dist) {
      if (!this.awake) { if (dist < 72) { this.awake = true; w.pop(this.x, this.y - 26, 'SQUEAK!', '#c8a8d8'); } return; }
      // erratic little loops toward Nate
      this.wob += 0.2;
      const a = Math.atan2(dy, dx) + Math.sin(this.wob) * 1.1;
      this.x += Math.cos(a) * 1.15; this.y += Math.sin(a) * 1.15;
    }
    draw(ctx, cx, cy) {
      let img = G.spr.bat[this.awake ? (this.t >> 2) & 1 : 1];
      if (this.hurtT && (this.hurtT >> 1) & 1) img = G.art.flash(img);
      ctx.drawImage(img, Math.round(this.x - 7) - cx, Math.round(this.y - 18 - (this.awake ? Math.sin(this.t / 5) * 2 : 0)) - cy);
    }
  }
  G.Bat = Bat;

  // ============================================================== SURF ROD (cast + reel)
  // X casts a lure in the direction Nate faces. It flies out over land or
  // water; anything it hooks gets reeled back toward Nate: enemies take a
  // hit and get yanked closer (gulls come right out of the sky), pickups get
  // dragged in, and some things (Tyler) have their own idea of what happens.
  const isWater = (w, x, y) => { const d = G.TILE_DEFS[w.tileAt(Math.floor(x / 16), Math.floor(y / 16))]; return !!(d && (d.k === 'bay' || d.k === 'water')); };
  class Lure extends Ent {
    constructor(p) {
      super(p.x, p.y);
      const [dx, dy] = DIRS[p.dir];
      Object.assign(this, { owner: p, dir: p.dir, vx: dx * 4.5, vy: dy * 4.5, state: 'out', dist: 0, max: 104 });
      this.x = p.x + dx * 10; this.y = p.y + dy * 6;
    }
    hookBox() { return [this.x - 5, this.y - 14, this.x + 5, this.y - 2]; }
    update(w) {
      if (G.script.busy) return;
      const p = this.owner;
      if (this.state === 'out') {
        this.x += this.vx; this.y += this.vy; this.dist += 4.5;
        for (const e of w.ents) {
          if (e.dead || e === p || e === this || !e.hurtBox) continue;
          if ((e.enemy || e.hookable) && G.overlap(this.hookBox(), e.hurtBox())) { this.hook(w, e); return; }
        }
        for (const e of w.ents) {
          if (!e.dead && e instanceof G.Pickup && G.overlap(this.hookBox(), e.box())) { this.carry = e; this.state = 'back'; G.audio.sfx('blip'); return; }
        }
        const tx = Math.floor(this.x / 16), ty = Math.floor((this.y - 4) / 16);
        if (this.dist >= this.max || (w.tileSolid(tx, ty) && !isWater(w, this.x, this.y - 4))) {
          this.state = 'back';
          if (isWater(w, this.x, this.y - 4)) w.burst(this.x, this.y - 4, ['#a8d0e0', '#ffffff'], 4, { speed: 0.6, up: 0.6, g: 0.06, life: 14, size: 1 });
        }
      } else {
        // reel in
        const dx = p.x - this.x, dy = p.y - 6 - this.y, d = Math.hypot(dx, dy);
        if (d < 8) {
          this.dead = true;
          const c = this.carry;
          if (c && !c.dead && !(c instanceof G.Pickup)) {
            // a reeled-in critter lands in front of Nate, dazed
            const [fx, fy] = DIRS[this.dir];
            w.move(c, (p.x + fx * 16) - c.x, 0); w.move(c, 0, (p.y + fy * 14) - c.y);
            c.carried = false;
            if (c.onReeled) c.onReeled(p);
          } else if (c && !c.dead) { c.x = p.x; c.y = p.y; }
          return;
        }
        this.x += (dx / d) * 5.5; this.y += (dy / d) * 5.5;
        if (this.carry && !this.carry.dead) { this.carry.x = this.x; this.carry.y = this.y + 6; }
      }
    }
    hook(w, e) {
      this.state = 'back';
      const p = this.owner;
      // (onHook returning false means the hook slid right off)
      if (e.onHook && e.onHook(p) === false) { G.audio.sfx('clank'); return; }
      G.audio.sfx('select');
      w.pop(this.x, this.y - 22, 'HOOKED!', '#f8f8f0');
      if (e.reelable) { this.carry = e; e.carried = true; return; }
      if (!e.onHook) e.hit(1, e.x * 2 - p.x, e.y * 2 - p.y); // (knocked back TOWARD Nate)
    }
    draw(ctx, cx, cy) {
      const p = this.owner, [dx, dy] = DIRS[p.dir];
      const hx = Math.round(p.x + dx * 4) - cx, hy = Math.round(p.y - 10) - cy;
      const tx = Math.round(p.x + dx * 15 + (dy ? 4 : 0)) - cx, ty = Math.round(p.y - 22 + dy * 6) - cy;
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#2a3a5a';
      ctx.beginPath(); ctx.moveTo(hx + 0.5, hy + 0.5); ctx.lineTo(tx + 0.5, ty + 0.5); ctx.stroke();
      ctx.strokeStyle = 'rgba(240,240,248,0.85)';
      ctx.beginPath(); ctx.moveTo(tx + 0.5, ty + 0.5); ctx.lineTo(Math.round(this.x) - cx + 0.5, Math.round(this.y - 8) - cy + 0.5); ctx.stroke();
      ctx.drawImage(G.spr.lure, Math.round(this.x - 3) - cx, Math.round(this.y - 11) - cy);
    }
  }
  G.Lure = Lure;

  // ============================================================== HOOK-A-DUCK (the fair)
  // Rubber ducks floating around the trough at the Hook-a-Duck booth (`path` is the rectangle
  // [x0, y0, x1, y1] they go around, `s` how far around it, 0-1), and the golden duck, bobbing in
  // its little tub way in the back, out of reach of the duck poles. Only the golden one can be
  // hooked: a surf rod reaches it, and reels it in.
  class FairDuck extends Ent {
    constructor(x, y, o = {}) {
      super(x, y);
      Object.assign(this, o);
      this.hb = { w: 8, h: 4 };
      this.face = 1;
      if (this.golden) { this.hookable = true; this.reelable = true; }
    }
    hurtBox() { return [this.x - 7, this.y - 11, this.x + 7, this.y + 1]; }
    update() {
      if (this.carried || this.golden || G.script.busy) return;
      this.s = (this.s + 0.0014) % 1;
      const [x0, y0, x1, y1] = this.path, w = x1 - x0, h = y1 - y0;
      let d = this.s * 2 * (w + h);
      if (d < w) { this.x = x0 + d; this.y = y0; this.face = 1; }
      else if ((d -= w) < h) { this.x = x1; this.y = y0 + d; }
      else if ((d -= h) < w) { this.x = x1 - d; this.y = y1; this.face = -1; }
      else { this.x = x0; this.y = y1 - (d - w); }
    }
    onReeled() { G.script.run(G.SCRIPTS.goldenDuck(this)); }
    draw(ctx, cx, cy) {
      const set = this.golden ? G.spr.goldenDuck : G.spr.rubberDuck, img = this.face < 0 ? set.left : set.right;
      const bob = this.carried ? 0 : Math.round(Math.sin(G.tick / 14 + (this.s || 0) * 40));
      if (this.golden && !this.carried && (G.tick >> 3) % 6 === 0) { ctx.fillStyle = '#fff8c0'; ctx.fillRect(Math.round(this.x + 3) - cx, Math.round(this.y - 11) - cy, 1, 1); }
      ctx.drawImage(img, Math.round(this.x - 5) - cx, Math.round(this.y - 8 + bob) - cy);
    }
  }
  G.FairDuck = FairDuck;

  // Something the Portable Bidet's stream can hit, but otherwise invisible: onWet is called
  // every frame it's wet (the clowns' mouths at the water-gun race).
  class SprayTarget extends Ent {
    constructor(box, onWet) { super((box[0] + box[2]) / 2, box[3]); this.wetBox = box; this.onWet = onWet; }
    hurtBox() { return this.wetBox; }
    onSpray(p) { this.onWet(p); }
    update() {}
    draw() {}
  }
  G.SprayTarget = SprayTarget;

  // ============================================================== SEAGULL (the bridge-tunnel)
  // Sits on top of a light pole, out of reach. When Nate wanders close it
  // screeches, dives at the spot where he's standing, overshoots, and flaps
  // back up to its light. Only hittable while it's down low.
  class Seagull extends Critter {
    constructor(x, y, perchZ, laughing) {
      super(x, y, 2);
      this.home = { x, y };
      this.perchZ = this.z = perchZ;
      this.laughing = laughing;
      this.state = 'perch';
      this.st = 30 + Math.random() * 90;
      this.touch = false;
      this.bits = ['#ffffff', '#c8ccd4', laughing ? '#1c1c22' : '#a8b0bc'];
    }
    hurtBox() { return [this.x - 7, this.y - this.z - 12, this.x + 7, this.y - this.z]; }
    update(w) {
      if (G.script.busy) return;
      this.t++;
      if (this.hurtT > 0) {
        this.hurtT--;
        this.x += this.kb.x; this.y += this.kb.y;
        this.kb.x *= 0.85; this.kb.y *= 0.85;
        if (this.hurtT === 0) this.rise();
        return;
      }
      if (this.calm > 0) { this.calm--; return; }
      const p = G.play.player, dx = p.x - this.x, dy = p.y - this.y, dist = Math.hypot(dx, dy) || 1;
      if (this.state === 'perch') {
        this.z = this.perchZ;
        if (dist < 100 && --this.st <= 0) {
          this.state = 'alert'; this.st = 22;
          w.pop(this.x, this.y - this.z - 16, this.laughing ? 'HA HA HA!' : 'SKREE!', '#f8f8f0');
          G.audio.sfx('swing');
        }
      } else if (this.state === 'alert') {
        // flaps in place, then dives at where Nate is right now (and past him)
        if (--this.st <= 0) {
          const ux = dx / dist, uy = dy / dist, over = 44;
          this.from = { x: this.x, y: this.y, z: this.z };
          this.to = { x: p.x + ux * over, y: p.y + uy * over };
          this.f = dist / (dist + over);
          this.dur = Math.round(30 + dist * 0.25);
          this.k = 0;
          this.state = 'dive';
          G.audio.sfx('dash');
        }
      } else if (this.state === 'dive') {
        const k = ++this.k / this.dur, f = this.f;
        this.x = this.from.x + (this.to.x - this.from.x) * k;
        this.y = this.from.y + (this.to.y - this.from.y) * k;
        this.z = k < f ? Math.max(2, this.from.z * ((f - k) / f) ** 2) : 2 + 26 * ((k - f) / (1 - f));
        if (this.z < 10 && G.overlap(this.hurtBox(), p.hurtBox())) p.hurt(1, this.x, this.y);
        if (k >= 1) this.rise();
      } else if (this.state === 'fall') {
        // startled off its light: drops to the ground in a flurry
        const k = Math.min(1, ++this.k / 16);
        this.z = this.from.z + (3 - this.from.z) * k * k;
        if (k >= 1) Object.assign(this, { state: 'grounded', st: 90 });
      } else if (this.state === 'grounded') {
        // hooked and yanked down: flapping on the ground, easy to bonk
        this.z = 2 + Math.abs(Math.sin(this.t * 0.4)) * 3;
        if (--this.st <= 0) this.rise();
      } else if (this.state === 'rise') {
        // back up to its light
        const k = ++this.k / this.dur;
        this.x = this.from.x + (this.home.x - this.from.x) * k;
        this.y = this.from.y + (this.home.y - this.from.y) * k;
        this.z = this.from.z + (this.perchZ - this.from.z) * k;
        if (k >= 1) { this.state = 'perch'; this.st = 90 + Math.random() * 90; this.x = this.home.x; this.y = this.home.y; }
      }
    }
    onHook(p) {
      if (this.dead) return;
      this.hp--;
      G.audio.sfx('hit');
      if (this.hp <= 0) { this.die(); return; }
      // out of the sky and onto the ground, right in front of Nate
      const dx = this.x - p.x, dy = this.y - p.y, d = Math.hypot(dx, dy) || 1;
      this.x = p.x + (dx / d) * 22; this.y = p.y + (dy / d) * 18;
      Object.assign(this, { state: 'grounded', st: 80, z: 3, hurtT: 0 });
      this.world.pop(this.x, this.y - 20, this.laughing ? 'HA-- HUH?!' : 'SKRAWK!', '#f8f8f0');
    }
    // Jamie Lee Curtis on the pipe: the fright knocks it right off its light
    startle() {
      if (this.state === 'grounded' || this.state === 'fall') return;
      Object.assign(this, { state: 'fall', from: { x: this.x, y: this.y, z: this.z }, k: 0, calm: 0, hurtT: 0 });
      this.world.burst(this.x, this.y - this.z - 6, this.bits, 6, { speed: 0.9, up: 0.5, g: 0.05, life: 24, size: 1 });
      this.world.pop(this.x, this.y - this.z - 16, this.laughing ? 'HA-- AAAH!' : 'SKRAWK?!', '#f8f8f0');
    }
    rise() {
      this.state = 'rise';
      this.from = { x: this.x, y: this.y, z: this.z };
      this.dur = 70; this.k = 0;
    }
    die() {
      this.dead = true;
      G.audio.sfx('poof');
      const w = this.world, f = G.state.flags;
      w.burst(this.x, this.y - this.z - 6, this.bits, 14, { speed: 1.2, up: 0.6, g: 0.05, life: 30, size: 2 });
      // the old fisherman is counting
      if (f.rodQuest && !G.state.items.rod) {
        f.gullBonks = (f.gullBonks || 0) + 1;
        w.pop(this.x, this.y - this.z - 30, f.gullBonks >= 5 ? 'THAT\'S FIVE!' : G.sayable(f.gullBonks) + '/5', '#78e8e8');
      }
      if (this.laughing) w.pop(this.x, this.y - this.z - 20, 'ha... ha.', '#c8c8d0');
      // drop the loot somewhere Nate can reach it (not out over the water)
      let x = this.x, y = this.y;
      const p = G.play.player;
      for (let i = 0; i < 8 && w.tileSolid(Math.floor(x / 16), Math.floor(y / 16)); i++) { x += (p.x - x) * 0.35; y += (p.y - y) * 0.35; }
      const s = G.state, r = Math.random();
      w.add(new G.Pickup(x, y, s.hp < s.maxHp && r < 0.25 ? 'heart' : r < 0.6 ? 'tooth5' : 'tooth'));
    }
    draw(ctx, cx, cy) {
      const set = G.spr.gull[this.laughing ? 1 : 0];
      let img = this.state === 'perch' ? set.sit : (this.t >> (this.state === 'grounded' ? 1 : 2)) & 1 ? set.up : set.down;
      if (this.hurtT && (this.hurtT >> 1) & 1) img = G.art.flash(img);
      if (this.z < 40) { ctx.globalAlpha = 0.5; ctx.drawImage(G.spr.shadow, Math.round(this.x - 6) - cx, Math.round(this.y - 3) - cy); ctx.globalAlpha = 1; }
      const flip = this.state !== 'perch' && (this.state === 'dive' ? this.to.x > this.from.x : this.home.x > this.x);
      const x = Math.round(this.x - 8) - cx, y = Math.round(this.y - this.z - 12) - cy;
      if (flip) { ctx.save(); ctx.translate(x + 16, y); ctx.scale(-1, 1); ctx.drawImage(img, 0, 0); ctx.restore(); }
      else ctx.drawImage(img, x, y);
      if (this.calm > 0) drawHalo(ctx, this.x - cx, this.y - this.z - 16 - cy);
    }
  }
  G.Seagull = Seagull;

  // ============================================================== TYLER (boss)
  // Hypnotized by Father Eggmas, collecting a "toll" in the Chesapeake Channel
  // Tunnel. He throws the toll back at Nate (shark teeth), sifts gravel down on
  // him, yells HERE I COME and charges (then he's dizzy), and when he
  // screams about his mosasaur tooth, a mosasaur skull bursts up out of the road.
  class FallingRock extends Ent {
    constructor(x, y, delay) { super(x, y); this.t = -(delay || 0); this.fall = 34; }
    update(w) {
      if (G.script.busy) return;
      if (++this.t < 0) return;
      if (this.t === this.fall) {
        G.audio.sfx('bump');
        w.burst(this.x, this.y - 3, ['#8a8c90', '#c8c0a8', '#5a5a64'], 6, { speed: 1, up: 0.5, g: 0.1, life: 16, size: 2 });
        const p = G.play.player;
        if (Math.hypot(p.x - this.x, (p.y - this.y) * 1.3) < 10) p.hurt(1, this.x, this.y);
      }
      if (this.t > this.fall + 30) this.dead = true;
    }
    draw(ctx, cx, cy) {
      if (this.t < 0) return;
      if (this.t < this.fall) {
        const k = this.t / this.fall;
        ctx.globalAlpha = 0.3 + 0.5 * k;
        ctx.drawImage(G.spr.shadow, Math.round(this.x - 6) - cx, Math.round(this.y - 3) - cy);
        ctx.globalAlpha = 1;
        ctx.drawImage(G.spr.pebble, Math.round(this.x - 3) - cx, Math.round(this.y - 5 - (1 - k) * 90) - cy);
      } else if (this.t < this.fall + 20 || (this.t >> 2) & 1) {
        ctx.drawImage(G.spr.pebble, Math.round(this.x - 3) - cx, Math.round(this.y - 5) - cy);
      }
    }
  }
  G.FallingRock = FallingRock;

  class MosasaurJaws extends Ent {
    constructor(x, y) { super(x, y); this.t = 0; this.warn = 44; }
    update(w) {
      if (G.script.busy) return;
      this.t++;
      if (this.t === this.warn) {
        G.audio.sfx('boom');
        G.play.shake(10, 3);
        w.burst(this.x, this.y - 6, ['#2e6a8a', '#5a9ab8', '#e8f4f8'], 14, { speed: 1.6, up: 1.2, g: 0.1, life: 26, size: 2 });
        w.pop(this.x, this.y - 44, 'CHOMP!', '#e8e0c8');
        const p = G.play.player;
        if (Math.hypot(p.x - this.x, (p.y - this.y) * 1.3) < 15) p.hurt(2, this.x, this.y);
      }
      if (this.t > this.warn + 40) this.dead = true;
    }
    draw(ctx, cx, cy) {
      const x = Math.round(this.x) - cx, y = Math.round(this.y) - cy;
      if (this.t < this.warn) {
        // a dark swirl spreading in the road: get out of the way
        const r = 4 + (this.t / this.warn) * 12;
        ctx.fillStyle = 'rgba(20,40,60,0.55)';
        ctx.beginPath(); ctx.ellipse(x, y - 3, r, r * 0.55, 0, 0, Math.PI * 2); ctx.fill();
        if ((this.t >> 2) & 1) {
          ctx.strokeStyle = 'rgba(160,220,255,0.7)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.ellipse(x, y - 3, r * 0.6, r * 0.33, this.t * 0.2, 0, Math.PI * 2); ctx.stroke();
        }
        return;
      }
      const k = this.t - this.warn, rise = Math.min(1, k / 6), sink = Math.max(0, (k - 26) / 14);
      const img = G.spr.mosasaur[k < 5 ? 0 : 1], h = Math.round(img.height * Math.max(0, rise - sink));
      ctx.fillStyle = 'rgba(20,40,60,0.55)';
      ctx.beginPath(); ctx.ellipse(x, y - 3, 16, 9, 0, 0, Math.PI * 2); ctx.fill();
      if (h > 0) ctx.drawImage(img, 0, 0, img.width, h, x - (img.width >> 1), y - 2 - h, img.width, h);
    }
  }
  G.MosasaurJaws = MosasaurJaws;

  const TYLER_YELLS = ['THE MOSASAUR TOOTH!', 'WHERE IS IT, NATE?', 'FIVE INCHES! SERRATED!', 'GIVE IT BACK!', 'I KNOW YOU HAVE IT!'];
  class TylerBoss extends Ent {
    constructor(x, y) {
      super(x, y);
      Object.assign(this, { enemy: true, boss: true, name: 'TYLER', hp: 26, maxHp: 26, hb: { w: 12, h: 8 }, t: 0,
        state: 'pace', st: 60, dir: 'down', anim: 0, hurtT: 0, kb: { x: 0, y: 0 }, cycle: 0, phase: 1, goal: { x, y } });
    }
    get S() { return G.sprites.tylerHypno; }
    hurtBox() { return [this.x - 7, this.y - 24, this.x + 7, this.y]; }
    toPace() { this.state = 'pace'; this.st = this.phase === 2 ? 50 : 75; }
    get open() { return this.state === 'reeled'; }
    // hooked with the surf rod: yanked down the tunnel to Nate, screen dropped.
    // Right after he gets back up he's watching for the hook, so it slides off.
    onHook(p) {
      if (this.state === 'defeated' || this.state === 'yank' || this.state === 'reeled') return false;
      // the hook only catches him while his screen is down: sifting, or dizzy after a charge
      if (this.state !== 'sift' && this.state !== 'dizzy') {
        if (G.tick - (this.clangT || -99) > 30) { this.clangT = G.tick; this.world.pop(this.x, this.y - 34, 'CLANG!', '#c8c8d0'); }
        return false;
      }
      if (this.hookCool > 0) {
        if (G.tick - (this.dodgeT || -99) > 30) { this.dodgeT = G.tick; this.world.pop(this.x, this.y - 34, 'NOT AGAIN!', '#78e8e8'); }
        return false;
      }
      const ty = Math.max(3 * 16, Math.min(21 * 16, p.y - 22));
      Object.assign(this, { state: 'yank', k: 0, from: { x: this.x, y: this.y }, to: { x: Math.max(5 * 16 + 8, Math.min(11 * 16 - 8, p.x)), y: ty } });
      this.world.pop(this.x, this.y - 34, 'WHOA-OA-OA!', '#78e8e8');
    }
    pick() {
      const order = this.phase === 2 ? ['mosasaur', 'teeth', 'aim', 'sift', 'mosasaur', 'aim'] : ['teeth', 'sift', 'aim', 'teeth', 'mosasaur'];
      const m = order[this.cycle++ % order.length];
      if (m === 'teeth') Object.assign(this, { state: 'teeth', reps: 3, st: 3 * 18 + 8 });
      else if (m === 'sift') Object.assign(this, { state: 'sift', st: 70 });
      else if (m === 'aim') Object.assign(this, { state: 'aim', st: 30 });
      else { const n = this.phase === 2 ? 3 : 1; Object.assign(this, { state: 'mosasaur', reps: n, st: n * 32 + 50, mT: n * 32 + 50 }); }
    }
    update(w) {
      if (G.script.busy || this.state === 'defeated') return;
      this.t++;
      if (this.hookCool > 0) this.hookCool--;
      const p = G.play.player, dx = p.x - this.x, dy = p.y - this.y, dist = Math.hypot(dx, dy) || 1, hot = this.phase === 2;
      if (this.hurtT > 0) {
        this.hurtT--;
        w.move(this, this.kb.x, 0); w.move(this, 0, this.kb.y);
        this.kb.x *= 0.8; this.kb.y *= 0.8;
      }
      if (this.phase === 1 && this.hp <= this.maxHp / 2) {
        this.phase = 2;
        this.toPace();
        G.script.run(G.SCRIPTS.tylerPhase(this));
        return;
      }
      if (this.state !== 'dizzy' && this.state !== 'reeled' && this.state !== 'yank' && G.overlap(this.hurtBox(), p.hurtBox())) p.hurt(this.state === 'charge' ? 2 : 1, this.x, this.y);
      this.moving = false;
      switch (this.state) {
        case 'yank': {
          const k = Math.min(1, ++this.k / 14);
          this.x = this.from.x + (this.to.x - this.from.x) * k; this.y = this.from.y + (this.to.y - this.from.y) * k;
          this.dir = 'down';
          if (k >= 1) {
            Object.assign(this, { state: 'reeled', st: hot ? 80 : 100 });
            G.audio.sfx('bump'); G.play.shake(6, 2);
            w.pop(this.x, this.y - 34, 'REELED IN!', '#f8d850');
          }
          break;
        }
        case 'reeled':
          // flat on his face, screen dropped: now's the time
          if (--this.st <= 0) { this.toPace(); this.hookCool = hot ? 120 : 90; w.pop(this.x, this.y - 34, 'SCREEN UP!', '#78e8e8'); }
          break;
        case 'pace': {
          // stays up the tunnel from Nate, sidestepping across the lanes
          if (this.t % 40 === 0 || Math.abs(this.goal.x - this.x) + Math.abs(this.goal.y - this.y) < 4) {
            this.goal = { x: 5 * 16 + 8 + Math.random() * 80, y: Math.max(3 * 16, Math.min(9 * 16, p.y - 70 - Math.random() * 20)) };
          }
          const gx = this.goal.x - this.x, gy = this.goal.y - this.y;
          const mx = Math.sign(gx) * Math.min(hot ? 1.5 : 1.1, Math.abs(gx)), my = Math.sign(gy) * Math.min(0.9, Math.abs(gy));
          w.move(this, mx, 0); w.move(this, 0, my);
          this.moving = Math.abs(mx) + Math.abs(my) > 0.2;
          if (this.moving) this.anim++;
          this.dir = Math.abs(mx) > 0.5 && Math.abs(mx) > Math.abs(my) ? (mx < 0 ? 'left' : 'right') : 'down';
          if (this.t % 120 === 0) w.pop(this.x, this.y - 34, TYLER_YELLS[Math.floor(Math.random() * TYLER_YELLS.length)], '#78e8e8');
          if (--this.st <= 0) this.pick();
          break;
        }
        case 'teeth': {
          // throws the toll back at Nate, a fan at a time
          this.dir = 'down';
          if (this.st % 18 === 0 && this.reps > 0) {
            this.reps--;
            const a = Math.atan2(dy, dx), n = hot ? 5 : 3, sp = hot ? 1.9 : 1.6;
            for (let i = 0; i < n; i++) { const b = a + (i - (n - 1) / 2) * 0.24; w.add(new Shot(this.x, this.y - 10, Math.cos(b) * sp, Math.sin(b) * sp, G.spr.tooth, { life: 200, z: 4 })); }
            this.thrown = (this.thrown || 0) + n; // every tooth he throws is one Nate doesn't get back (S.tylerDefeated)
            G.audio.sfx('swing');
          }
          if (--this.st <= 0) this.toPace();
          break;
        }
        case 'sift': {
          // shakes his sifting screen: gravel rains down around Nate
          this.dir = 'down';
          if (this.st === 70) {
            w.pop(this.x, this.y - 34, 'SIFT! SIFT! SIFT!', '#78e8e8');
            const n = hot ? 9 : 6;
            for (let i = 0; i < n; i++) {
              const x = i === 0 ? p.x : 5 * 16 + 4 + Math.random() * 88, y = i === 0 ? p.y : Math.max(3 * 16, Math.min(21 * 16, p.y + (Math.random() * 2 - 1) * 44));
              w.add(new FallingRock(x, y, i * 7));
            }
          }
          if (this.st % 6 === 0) G.audio.sfx('blip');
          if (--this.st <= 0) this.toPace();
          break;
        }
        case 'aim': {
          // HERE I COME! then a charge straight at Nate
          if (this.st === 30) { w.pop(this.x, this.y - 34, 'HERE I COME!', '#78e8e8'); G.audio.sfx('select'); }
          this.dir = G.dirToward(dx, dy);
          if (--this.st <= 0) {
            const sp = hot ? 4.2 : 3.4;
            Object.assign(this, { state: 'charge', st: 50, vx: (dx / dist) * sp, vy: (dy / dist) * sp });
            G.audio.sfx('dash');
          }
          break;
        }
        case 'charge': {
          this.moving = true; this.anim += 2;
          const h = w.move(this, this.vx, this.vy);
          if (h.hitX || h.hitY || --this.st <= 0) {
            Object.assign(this, { state: 'dizzy', st: hot ? 50 : 70 });
            G.audio.sfx('bump');
            G.play.shake(8, 2);
            w.pop(this.x, this.y - 34, 'OOF.', '#78e8e8');
          }
          break;
        }
        case 'dizzy':
          if (--this.st <= 0) this.toPace();
          break;
        case 'mosasaur': {
          this.dir = 'down';
          if (this.st === this.mT) { G.audio.sfx('yell'); G.play.shake(16, 2); w.pop(this.x, this.y - 36, 'THE MOSASAUR TOOTH!!!', '#ff6a5a'); }
          if (this.st % 32 === 0 && this.reps > 0) { this.reps--; w.add(new MosasaurJaws(p.x, p.y)); }
          if (--this.st <= 0) this.toPace();
          break;
        }
      }
    }
    hit(dmg, sx, sy) {
      if (this.state === 'defeated') return;
      // anything but a reeled-in Tyler just clanks off the sifting screen
      if (!this.open) {
        G.audio.sfx('clank');
        if (G.tick - (this.blockT || -99) > 20) { this.blockT = G.tick; this.world.pop(this.x, this.y - 34, 'BLOCKED!', '#c8c8d0'); }
        if (!G.state.flags.tylerBlockHint) { G.state.flags.tylerBlockHint = true; G.script.run(G.SCRIPTS.tylerBlockHint()); }
        return;
      }
      this.hp = Math.max(0, this.hp - dmg);
      this.hurtT = 12;
      G.audio.sfx('hit');
      this.world.burst(this.x, this.y - 16, ['#5a5c3a', '#3a2a20', '#f8f8f8'], 5, { speed: 1.3, up: 0.6, g: 0.06, life: 24, size: 2 });
      if (this.hp <= 0) { this.state = 'defeated'; G.script.run(G.SCRIPTS.tylerDefeated(this)); }
    }
    bomb(sx, sy) { this.hit(3, sx, sy); }
    draw(ctx, cx, cy) {
      const S = this.S;
      drawShadow(ctx, this.x, this.y, cx, cy);
      let img = S[this.dir][walkFrame(this.anim, this.moving)];
      if (this.hurtT && (this.hurtT >> 1) & 1) img = G.art.flash(img);
      const sx = Math.round(this.x - 8) - cx, sy = Math.round(this.y - S.h + 2) - cy;
      ctx.drawImage(img, sx, sy);
      // the sifting screen: shaken during a sift, dropped when reeled in, otherwise held up as a shield
      if (this.state === 'sift') ctx.drawImage(G.spr.sifter, sx - 1 + ((this.t >> 1) & 1 ? 1 : -1), sy + S.h - 15);
      else if (this.open || this.state === 'yank' || this.state === 'dizzy') ctx.drawImage(G.spr.sifter, sx + 12, sy + S.h - 8);
      else if (this.dir !== 'up') ctx.drawImage(G.spr.sifter, sx - 1 + (this.dir === 'left' ? -5 : this.dir === 'right' ? 5 : 0), sy + S.h - 17);
      if (this.state === 'dizzy' || this.open) {
        ctx.fillStyle = '#d040f0';
        for (let i = 0; i < 3; i++) {
          const a = this.t * 0.15 + (i * Math.PI * 2) / 3;
          ctx.fillRect(Math.round(this.x + Math.cos(a) * 9) - cx, Math.round(this.y - S.h - 2 + Math.sin(a) * 3) - cy, 2, 2);
        }
      }
    }
  }
  G.TylerBoss = TylerBoss;

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
      return { tooth: G.spr.tooth, tooth5: G.spr.toothGold, heart: G.spr.heart.full, doosh: G.spr.doosh, package: G.spr.gift, rofo: G.spr.rofo.bottle }[this.kind];
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
