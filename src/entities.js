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
      if (G.script.busy) { if (!this.walking) this.moving = false; return; }
      const inp = G.input;

      if (this.state === 'hurt') {
        w.move(this, this.kb.x, 0);
        w.move(this, 0, this.kb.y);
        this.kb.x *= 0.82; this.kb.y *= 0.82;
        if (--this.t <= 0) this.state = 'walk';
        return;
      }

      if (this.state === 'swing') {
        this.t++;
        if (this.t >= 3 && this.t <= 10) this.swingHits(w);
        if (this.t >= 14) this.state = 'walk';
        return;
      }

      // puffing Dad's pipe: Nate stands still, the world keeps going
      if (this.state === 'pipe') { G.pipe.update(); return; }

      // walking
      const d = inp.dir();
      this.moving = !!(d.x || d.y);
      if (this.moving) {
        if (d.x && d.y) {
          const okH = (d.x < 0 && this.dir === 'left') || (d.x > 0 && this.dir === 'right');
          const okV = (d.y < 0 && this.dir === 'up') || (d.y > 0 && this.dir === 'down');
          if (!okH && !okV) this.dir = d.x < 0 ? 'left' : 'right';
        } else {
          this.dir = d.x < 0 ? 'left' : d.x > 0 ? 'right' : d.y < 0 ? 'up' : 'down';
        }
        const sp = d.x && d.y ? 1.0 : 1.35;
        w.move(this, d.x * sp, 0, true);
        w.move(this, 0, d.y * sp, true);
        this.anim++;
      } else {
        this.anim = 0;
      }

      if (inp.hit('a')) {
        inp.eat('a');
        if (!G.play.tryInteract()) this.startSwing();
      } else if (inp.hit('b')) {
        inp.eat('b');
        G.play.useItem();
      }
    }

    startSwing() {
      if (!G.state.items.hammer) return;
      this.state = 'swing';
      this.t = 0;
      this.hitSet.clear();
      G.audio.sfx('swing');
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

    swingHits(w) {
      const r = this.swingRect();
      for (const e of w.ents) {
        if (e.dead || this.hitSet.has(e)) continue;
        if (e.enemy && G.overlap(r, e.hurtBox())) {
          this.hitSet.add(e);
          e.hit(1, this.x, this.y);
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
      if (this.inv > 0 || G.script.busy || this.state === 'dead') return;
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
      const S = this.spr;
      drawShadow(ctx, this.x, this.y, cx, cy);
      if (this.inv > 0 && this.state !== 'hurt' && (this.inv >> 2) & 1) return;
      let img;
      if (this.pose === 'hold') img = S.hold;
      else img = S[this.dir][this.state === 'walk' ? walkFrame(this.anim, this.moving) : 0];
      const sx = Math.round(this.x - 8) - cx, sy = Math.round(this.y - S.h + 2) - cy;
      const swinging = this.state === 'swing';
      if (swinging && this.dir === 'up') this.drawHammer(ctx, cx, cy);
      ctx.drawImage(this.state === 'hurt' && (this.t >> 1) & 1 ? G.art.flash(img) : img, sx, sy);
      if (swinging && this.dir !== 'up') this.drawHammer(ctx, cx, cy);
      if (this.pose === 'hold' && this.holdIcon) {
        const ic = this.holdIcon;
        ctx.drawImage(ic, Math.round(this.x - ic.width / 2) - cx, sy - ic.height - 1);
      }
      if (this.emote) ctx.drawImage(this.emote, Math.round(this.x - 2) - cx, sy - 12);
      if (this.pipeOut && this.dir !== 'up') {
        const pos = { right: [11, 7], left: [-3, 7], down: [8, 8] }[this.dir];
        ctx.drawImage(this.dir === 'left' ? G.spr.pipeSmallL : G.spr.pipeSmall, sx + pos[0], sy + pos[1]);
      }
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
