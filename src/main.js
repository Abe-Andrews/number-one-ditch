'use strict';
// Scenes, game state, saving and the main loop.

(function () {
  const F = () => G.font;
  const SAVE_KEY = 'number-one-ditch-save-v1';

  // ================================================================ STATE / SAVES
  function newState() {
    return {
      hp: 6, maxHp: 6, teeth: 0,
      items: { hammer: false, doosh: 0, cap: false },
      xItem: null,
      flags: {},
      stats: { slips: 0, sixes: 0 },
      party: ['nate'],
      map: 'lab', x: 3 * 16 + 8, y: 3 * 16 + 14, dir: 'up',
    };
  }

  // The party member following Nate right now (older saves: the newest recruit).
  G.activeFollower = () => {
    const s = G.state;
    if (s.follower === undefined) {
      const r = s.party.filter((p) => p !== 'nate');
      s.follower = r.length ? r[r.length - 1] : null;
    }
    return s.follower && s.party.includes(s.follower) ? s.follower : null;
  };
  G.with = (id) => G.activeFollower() === id;

  // Three save files. File 1 keeps the original key, so older saves show up there.
  G.SAVE_FILES = 3;
  const fileKey = (n) => (n === 1 ? SAVE_KEY : SAVE_KEY + '-' + n);
  G.readSave = (n) => {
    try {
      const raw = localStorage.getItem(fileKey(n));
      if (!raw) return null;
      const s = Object.assign(newState(), JSON.parse(raw));
      // saves that got the cap before it came with a heart container get theirs now
      if (s.items.cap && !s.flags.capHeart) { s.flags.capHeart = true; s.maxHp += 2; }
      // saves from before the Andover gate had a key: if they've been, they keep their way in
      const f = s.flags;
      if (!s.items.andoverKey && (f.andover || f.andoverMine)) s.items.andoverKey = true;
      // ...from before Ice JJ needed a booking, and before Grandma Rose wanted a funnel cake
      if (f.jjMet) f.jjSeen = true;
      if (s.rocksFound && s.rocksFound.eastonite) f.roseTraded = true;
      s.slot = n;
      return s;
    } catch (e) { return null; }
  };
  G.hasSave = () => [1, 2, 3].some((n) => !!G.readSave(n));
  // the file saved most recently (old saves without a timestamp count as oldest)
  G.latestSave = () => {
    let best = 0, when = -1;
    for (let n = 1; n <= G.SAVE_FILES; n++) {
      const s = G.readSave(n);
      if (s && (s.savedAt || 0) > when) { when = s.savedAt || 0; best = n; }
    }
    return best;
  };
  G.loadSave = (n) => G.readSave(n || (G.state && G.state.slot) || G.latestSave() || 1);
  // Write the game to file n (default: the file being played).
  G.writeSave = (n) => {
    const s = G.state;
    if (s.admin) return true; // admin (testing) runs never touch the save files
    s.slot = n || s.slot || 1;
    s.savedAt = Date.now();
    try { localStorage.setItem(fileKey(s.slot), JSON.stringify(s)); return true; } catch (e) { return false; }
  };

  // Fainting: the frame Nate hits the ground, and the share of his shark teeth he drops.
  const FAINT_LAND = G.FAINT_LAND = 54;
  const FAINT_COST = 0.2;

  // ================================================================ PLAY SCENE
  G.play = {
    world: null,
    player: null,
    cam: { x: 0, y: 0 },
    shakeT: 0,
    shakeMag: 0,
    menu: null,
    healQ: 0,
    dying: 0,

    enter(fresh) {
      G.script.reset();
      G.fade = 1;
      this.menu = null;
      G.toasts.clear();
      this.dying = 0;
      this.healQ = 0;
      const s = G.state;
      this.loadMap(s.map, s.x, s.y, s.dir, true);
      const def = this.world.def;
      G.script.run((function* () {
        yield G.fadeIn(24);
        if (fresh) yield* G.SCRIPTS.labIntro();
        if (def.onEnter) yield* def.onEnter();
      })());
      G.scene = this;
    },

    loadMap(id, x, y, dir, skipEnter) {
      this.camFocus = null;
      this.earworm = 0;
      G.pipe.active = false;
      this.world = new G.World(id);
      this.player = new G.Player(x, y, dir);
      this.world.add(this.player);
      // party members trail behind Nate
      const [ddx, ddy] = G.DIRS[dir];
      this.trail = [];
      for (let i = 0; i < 90; i++) this.trail.push({ x: x - ddx * i * 0.6, y: y - ddy * i * 0.6, dir });
      // one party member at a time trails behind Nate (picked in the PEOPLE menu)
      const fid = G.activeFollower();
      if (fid && !G.state.playAs) {
        const t = this.trail[14];
        this.world.add(new G.Follower(fid, 0, t.x, t.y, dir));
      }
      for (const t of this.world.triggers) t.inside = G.overlap(t.rect, this.feet());
      const s = G.state;
      s.map = id; s.x = x; s.y = y; s.dir = dir;
      (s.visited = s.visited || {})[id] = 1;
      G.audio.play(this.world.def.music);
      G.areaBanner.show(this.world.def.name);
      this.snapCam();
      if (this.world.def.onEnter && !skipEnter) G.script.run(this.world.def.onEnter());
    },

    // Swap who's following Nate (null = nobody); poof = with a little puff.
    setFollower(id, poof) {
      const w = this.world, p = this.player;
      G.state.follower = id || null;
      for (const e of w.ents) {
        if (!(e instanceof G.Follower) || e.dead) continue;
        e.dead = true;
        if (poof) w.burst(e.x, e.y - 8, ['#ffffff', '#e8e0f0'], 8);
      }
      if (id && !G.state.playAs) {
        const t = this.trail[Math.min(this.trail.length - 1, 14)];
        const f = w.add(new G.Follower(id, 0, t.x, t.y, p.dir));
        if (poof) w.burst(f.x, f.y - 8, ['#ffffff', '#f8d850'], 10);
      }
    },

    // Booby-trapped package explosion (also used for the gift prank, harmless).
    explode(x, y, harmful) {
      const w = this.world;
      G.audio.sfx('boom');
      this.shake(14, 3);
      w.fx.push({ x, y, vx: 0, vy: 0, circle: true, r: 26, max: 14, life: 14, color: '#fff4c0' });
      w.burst(x, y, ['#ffffff', '#f8d850', '#ff9a28', '#e83848'], 18, { speed: 2.2, life: 18, size: 3 });
      w.burst(x, y, ['#d83038', '#3878d8', '#38a048', '#f8d040', '#ffffff'], 16, { speed: 1.6, up: 1.5, g: 0.06, life: 42, size: 2 });
      w.burst(x, y, ['#8a8a94', '#b0b0b8', '#6a6a74'], 10, { speed: 0.6, up: 0.4, life: 34, size: 4 });
      w.pop(x, y - 22, 'BANG!', '#ff9a28');
      if (!harmful) return;
      const R = 28;
      for (const e of w.ents) {
        if (e.dead || Math.hypot(e.x - x, e.y - y) > R) continue;
        if (e.bomb) e.bomb(x, y);
        else if (e.enemy) e.hit(2, x, y);
      }
      const p = this.player;
      if (Math.hypot(p.x - x, p.y - y) < R - 4) p.hurt(1, x, y);
      for (let ty = Math.floor((y - R) / 16); ty <= Math.floor((y + R) / 16); ty++) {
        for (let tx = Math.floor((x - R) / 16); tx <= Math.floor((x + R) / 16); tx++) {
          const ch = w.tileAt(tx, ty), d = ch && G.TILE_DEFS[ch];
          if (!d || !d.cut || w.block[ty * w.w + tx]) continue;
          if (Math.hypot(tx * 16 + 8 - x, ty * 16 + 8 - y) > R) continue;
          w.setTile(tx, ty, 'c');
          this.maybeDrop(tx * 16 + 8, ty * 16 + 12, 0.25);
        }
      }
    },

    // Is a boss still standing in this room?
    bossFight() {
      return !!this.world && this.world.ents.some((e) => e.boss && !e.dead && e.state !== 'defeated' && e.hp > 0);
    },

    warp(map, tx, ty, dir, sure) {
      if (this.warping) return;
      // walking out an exit in the middle of a boss fight asks first ("Keep fighting" is the
      // default, so a stray step doesn't throw the fight); cutscene warps never ask
      if (!sure && !G.script.busy && this.bossFight()) {
        const self = this;
        G.script.run((function* () {
          const c = yield G.ask(null, 'Leave in the middle of the fight?', ['Keep fighting', 'Leave']);
          if (c === 1) { self.warp(map, tx, ty, dir, true); return; }
          const p = self.player, back = { up: [0, 1], down: [0, -1], left: [1, 0], right: [-1, 0] }[p.dir] || [0, 0];
          yield G.walkTo(p, p.x + back[0] * 18, p.y + back[1] * 18, 1.5); // (ends facing back into the fight)
          G.unstick(p);
        })());
        return;
      }
      this.warping = true;
      G.audio.sfx('door');
      const self = this;
      G.script.run((function* () {
        yield G.fadeOut(14);
        self.loadMap(map, tx * 16 + 8, ty * 16 + 14, dir);
        self.autosave();
        yield G.fadeIn(14);
        self.warping = false;
      })());
    },

    autosave() {
      const s = G.state, p = this.player;
      if (p) { s.x = p.x; s.y = p.y; s.dir = p.dir; s.map = this.world.id; }
      G.writeSave();
    },

    feet() {
      const p = this.player;
      return [p.x - 2, p.y - 3, p.x + 2, p.y];
    },

    shake(n, mag) { this.shakeT = Math.max(this.shakeT, n); this.shakeMag = mag; },

    snapCam() {
      const w = this.world, p = this.player;
      const tx = p.x - G.W / 2, ty = p.y - 12 - G.H / 2;
      this.cam.x = w.pw <= G.W ? (w.pw - G.W) / 2 : G.clamp(tx, 0, w.pw - G.W);
      this.cam.y = w.ph <= G.H ? (w.ph - G.H) / 2 : G.clamp(ty, 0, w.ph - G.H);
    },

    // Talk to whatever is in front of Nate. Returns true if something answered.
    tryInteract() {
      const p = this.player, [dx, dy] = G.DIRS[p.dir];
      const px = p.x + dx * 12, py = p.y - 4 + dy * 12;
      const pt = [px - 1, py - 1, px + 1, py + 1];
      // Party members only chat when no enemies are around (so Z always swings
      // mid-fight), and anything else in front of Nate comes first.
      const fighting = this.world.ents.some((e) => e.enemy && !e.dead && Math.hypot(e.x - p.x, e.y - p.y) < 128);
      let partner = null;
      for (const e of this.world.ents) {
        if (!e.talk || e === p) continue;
        const b = e.box();
        if (!G.overlap([b[0] - 2, b[1] - 6, b[2] + 2, b[3] + 2], pt)) continue;
        if (e instanceof G.Follower) { if (!fighting && !partner) partner = e; continue; }
        if (e instanceof G.NPC) e.dir = G.dirToward(p.x - e.x, p.y - e.y);
        // while Nate is handing out Doron's spare tickets, people get offered one first
        const offer = e instanceof G.NPC && G.SCRIPTS.ticketReaction(e);
        G.script.run(offer || e.talk.call(e, e));
        return true;
      }
      for (const pr of this.world.props) {
        if (!pr.talk || !pr.hit || !G.overlap(pr.hit, pt)) continue;
        G.script.run(pr.talk());
        return true;
      }
      if (partner) { G.script.run(partner.talk()); return true; }
      return false;
    },

    useItem() {
      const s = G.state;
      if (s.xItem === 'doosh') {
        if (s.items.doosh <= 0) { G.audio.sfx('bump'); return; }
        if (s.hp >= s.maxHp) {
          G.script.run((function* () { yield G.say('Nate', 'I\'m not hungry yet. (Your hearts are full.)'); })());
          return;
        }
        s.items.doosh--;
        this.healQ += 8;
        G.audio.sfx('gulp');
        if (!s.flags.ateDoosh) {
          s.flags.ateDoosh = true;
          G.script.run((function* () { yield G.say('Nate', 'Mmm. Doosh De Luche. Delicioso.'); })());
        }
      } else if (s.xItem === 'pipe') {
        G.pipe.start();
      } else if (s.xItem === 'bass') {
        this.player.startBass();
      } else if (s.xItem === 'chicken') {
        // the chicken lays... fires... an egg (with a cooldown)
        if (this.eggCool > 0) { G.audio.sfx('bump'); return; }
        const p = this.player, [dx, dy] = G.DIRS[p.dir];
        // eggs are sold separately (Mom's flower stand)
        if (!(s.items.eggs > 0)) { G.audio.sfx('bump'); this.world.pop(p.x, p.y - 30, 'OUT OF EGGS!', '#f8f8f0'); this.eggCool = 20; return; }
        s.items.eggs--;
        this.world.add(new G.EggShot(p.x + dx * 8, p.y + dy * 6, p.dir));
        this.eggCool = 40;
        p.chickenT = 20;
        G.audio.sfx('bawk');
      } else if (s.xItem === 'rod') {
        // cast the surf rod (one line out at a time)
        if (this.world.ents.some((e) => e instanceof G.Lure && !e.dead)) return;
        this.world.add(new G.Lure(this.player));
        G.audio.sfx('swing');
      } else if (s.xItem === 'package') {
        const w = this.world, p = this.player;
        if (!s.items.package || w.ents.filter((e) => e instanceof G.Package).length >= 2) { G.audio.sfx('bump'); return; }
        const [dx, dy] = G.DIRS[p.dir];
        w.add(new G.Package(p.x + dx * 12, p.y + dy * 10));
        s.items.package--;
        G.audio.sfx('menu');
      } else {
        G.audio.sfx('bump');
      }
    },

    addTeeth(n) {
      const s = G.state;
      let t = s.teeth + n, skipped = false;
      while (/6/.test(String(t))) { t += n >= 0 ? 1 : -1; skipped = true; }
      s.teeth = G.clamp(t, 0, 999);
      // the joke about it only ever plays once on this device (not again for every new game or admin start)
      if (skipped && !s.flags.skipNote) {
        s.flags.skipNote = true;
        let seen = false;
        try { seen = localStorage.getItem('ditch-skipNote') === '1'; localStorage.setItem('ditch-skipNote', '1'); } catch (e) { /* no storage: just show it */ }
        if (!seen) G.script.run(G.SCRIPTS.skipNote());
      }
    },

    maybeDrop(x, y, chance) {
      if (Math.random() > chance) return;
      const s = G.state;
      let kind = 'tooth';
      if (s.hp < s.maxHp && Math.random() < 0.35) kind = 'heart';
      else if (Math.random() < 0.3) kind = 'tooth5';
      this.world.add(new G.Pickup(x, y, kind));
    },

    collect(kind) {
      if (kind === 'tooth') { this.addTeeth(1); G.audio.sfx('tooth'); }
      else if (kind === 'tooth5') { this.addTeeth(5); G.audio.sfx('tooth'); }
      else if (kind === 'heart') { this.healQ += 2; G.audio.sfx('heart'); }
      else if (kind === 'rofo') {
        // a bottle of RoFo Pop: a heart back. It does not taste good.
        this.healQ += 2; G.audio.sfx('gulp');
        const p = this.player;
        this.world.pop(p.x, p.y - 34, ['Blegh.', '...It does not taste good.', 'Why is it BLUE?', 'Nate shudders.'][Math.floor(Math.random() * 4)], '#78c0ff');
      }
      else if (kind === 'package') {
        const s = G.state;
        s.items.package = Math.min(10, (s.items.package || 0) + 1);
        s.xItem = 'package';
        G.audio.sfx('tooth');
      }
    },

    die() {
      if (this.dying) return;
      this.dying = 1;
      G.pipe.stop();
      this.player.state = 'dead';
      G.audio.stop();
    },

    update() {
      G.areaBanner.update();
      if (this.shakeT > 0) this.shakeT--;

      // fainting: a dizzy spin, a wobble, then he tips over (Player.drawFaint), the stars
      // come out, and the screen fades to the fainted screen
      if (this.dying) {
        const d = ++this.dying;
        if (d < 36 && d % 6 === 0) this.player.dir = ['down', 'left', 'up', 'right'][(d / 6) % 4];
        if (d === 36) this.player.dir = 'down';
        if (d === FAINT_LAND) { G.audio.sfx('bump'); this.shake(8, 2); }
        if (d > 96) G.fade = Math.min(1, (d - 96) / 24);
        if (d > 122) G.gameOver.enter();
        return;
      }

      G.state.playTime = (G.state.playTime || 0) + 1;
      if (G.tick % 30 === 0 && !G.script.busy && !this.warping && G.postgameTick) G.postgameTick();
      if (G.tick % 30 === 15 && !G.script.busy && !this.warping && !this.menu) G.questWatch();
      if (this.eggCool > 0) this.eggCool--;
      if (this.earworm > 0 && !G.script.busy) this.earworm--;
      if (this.whiteout > 0) this.whiteout -= 0.03;

      if (this.menu) {
        if (this.menu.update()) this.menu = null;
        return;
      }
      G.toasts.update();

      if (!G.script.busy && G.input.hit('start')) {
        G.input.eat('start');
        this.menu = new G.PauseMenu();
        return;
      }

      // Pressing 6 counts as saying the sacred number.
      if (G.input.hit('six')) {
        G.input.eat('six');
        G.script.run(G.SCRIPTS.sixKey());
      }

      G.script.update();
      this.world.update();

      // remember Nate's footsteps for the party to follow
      const pl = this.player, t0 = this.trail[0];
      if (pl.x !== t0.x || pl.y !== t0.y) {
        this.trail.unshift({ x: pl.x, y: pl.y, dir: pl.dir });
        if (this.trail.length > 90) this.trail.pop();
      }

      // heal over time
      if (this.healQ > 0 && G.tick % 5 === 0) {
        const s = G.state;
        if (s.hp < s.maxHp) { s.hp++; this.healQ--; if (this.healQ % 2 === 0) G.audio.sfx('heart'); }
        else this.healQ = 0;
      }

      // triggers
      if (!G.script.busy && !this.warping) {
        const f = this.feet();
        for (const t of this.world.triggers) {
          const inside = G.overlap(t.rect, f);
          if (inside && !t.inside) t.fn();
          t.inside = inside;
          if (G.script.busy) break;
        }
      }

      // camera follows Nate (or a cutscene focus point); a map can lean it, e.g. up to keep a tall boss in view
      const w = this.world, p = this.player, f = this.camFocus, lean = !f && w.camLean ? w.camLean(p) : 0;
      const tx = (f ? f.x : p.x) - G.W / 2, ty = (f ? f.y : p.y - 12) - G.H / 2 - lean;
      if (w.pw > G.W) this.cam.x += (G.clamp(tx, 0, w.pw - G.W) - this.cam.x) * 0.2;
      if (w.ph > G.H) this.cam.y += (G.clamp(ty, 0, w.ph - G.H) - this.cam.y) * 0.2;
    },

    draw(ctx) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, G.W, G.H);
      const cam = { x: this.cam.x, y: this.cam.y };
      if (this.shakeT > 0) {
        cam.x += (Math.random() * 2 - 1) * this.shakeMag;
        cam.y += (Math.random() * 2 - 1) * this.shakeMag;
      }
      // cutscene zoom, anchored on whatever the camera is looking at
      const z = this.zoom || 1;
      if (z !== 1) {
        const f = this.camFocus;
        const ax = f ? G.clamp(f.x - cam.x, 0, G.W) : G.W / 2, ay = f ? G.clamp(f.y - cam.y, 0, G.H) : G.H / 2;
        ctx.save(); ctx.translate(ax, ay); ctx.scale(z, z); ctx.translate(-ax, -ay);
      }
      this.world.draw(ctx, cam);
      if (z !== 1) ctx.restore();
      // time-of-day tint, then glowing bulbs on top of it
      if (this.world.def.tint) this.world.def.tint(ctx);
      if (this.world.glows.length) {
        ctx.globalCompositeOperation = 'lighter';
        const cx = Math.round(cam.x), cy = Math.round(cam.y);
        for (const g of this.world.glows) {
          ctx.fillStyle = g.color;
          ctx.globalAlpha = 0.16; ctx.fillRect(g.x - 4 - cx, g.y - 4 - cy, 9, 9);
          ctx.globalAlpha = 0.35; ctx.fillRect(g.x - 2 - cx, g.y - 2 - cy, 5, 5);
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
      }
      // white flash (explosions)
      if (this.whiteout > 0) {
        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, this.whiteout)})`;
        ctx.fillRect(0, 0, G.W, G.H);
      }
      // old-photo look for flashbacks
      if (G.flashback) {
        ctx.globalCompositeOperation = 'saturation'; ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, G.W, G.H);
        ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = '#f2d8a8'; ctx.fillRect(0, 0, G.W, G.H);
        ctx.globalCompositeOperation = 'source-over';
      }
      G.hud.draw(ctx);
      G.pipe.draw(ctx);
      // (noBar: a boss whose fight hasn't started yet, so it stays a surprise)
      const boss = this.world.ents.find((e) => e.boss && e.state !== 'defeated' && !e.noBar && !e.hidden);
      if (boss) G.hud.bossBar(ctx, boss);
      if (!this.menu) G.toasts.draw(ctx, !!boss);
      G.areaBanner.draw(ctx);
      G.script.draw(ctx);
      if (this.menu) this.menu.draw(ctx);
    },
  };

  // ================================================================ TITLE
  G.title = {
    enter() {
      G.scene = this;
      G.fade = 0;
      this.t = 0;
      this.sel = 0;
      this.opts = (G.hasSave() ? ['Continue', 'Load File', 'New Game'] : ['New Game']).concat('Admin');
      G.audio.play('title');
    },
    update() {
      this.t++;
      const inp = G.input;
      if (inp.hit('up') || inp.hit('down')) { this.sel = (this.sel + 1) % this.opts.length; G.audio.sfx('menu'); }
      if (inp.hit('a') || inp.hit('start')) {
        inp.eat('a'); inp.eat('start');
        G.audio.sfx('select');
        const opt = this.opts[this.sel];
        if (opt === 'Continue') {
          G.state = G.loadSave(G.latestSave()) || newState();
          G.play.enter(false);
        } else if (opt === 'Load File') {
          G.files.enter('load');
        } else if (opt === 'Admin') {
          G.adminPick.enter();
        } else if (G.hasSave()) {
          G.files.enter('new');
        } else {
          G.files.start(1);
        }
      }
    },
    draw(ctx) {
      ctx.drawImage(G.spr.ditch, 0, 0);
      // logo
      const small = 'JOURNEY TO THE';
      F().draw(ctx, small, Math.round((G.W - F().width(small)) / 2), 10, '#ffffff', { shadow: '#1c1424' });
      const grad = (row) => ['#fff4b0', '#ffe070', '#ffd040', '#ffb830', '#ff9a28', '#f07820', '#e05818', '#c84818', '#a83810'][row] || '#a83810';
      const l1 = 'NUMBER ONE';
      F().drawBig(ctx, l1, Math.round((G.W - F().bigWidth(l1, 2)) / 2), 22, 2, grad, '#2a1420');
      const l2 = 'DITCH';
      const bob = Math.round(Math.sin(this.t / 30) * 1.5);
      F().drawBig(ctx, l2, Math.round((G.W - F().bigWidth(l2, 3)) / 2), 42 + bob, 3, grad, '#2a1420');
      // Father Eggmas lurking by the sign
      const ey = 104 + Math.round(Math.abs(Math.sin(this.t / 20)) * -3);
      ctx.drawImage(G.spr.eggmas, 208, ey);
      // Nate looking on
      ctx.drawImage(G.sprites.nate.right[(this.t >> 4) % 2 ? 0 : 0], 34, 104);
      // menu
      const w = 84, h = this.opts.length * 12 + 8, x = Math.round((G.W - w) / 2), y = this.opts.length > 3 ? 100 : this.opts.length > 2 ? 108 : 114;
      G.box(ctx, x, y, w, h);
      this.opts.forEach((o, i) => {
        F().draw(ctx, o, x + 18, y + 5 + i * 12, i === this.sel ? '#f8d850' : o === 'Admin' ? '#9890a8' : '#f8f8f0', { shadow: '#0c0814' });
      });
      const cy = y + 6 + this.sel * 12, b = (this.t >> 3) & 1;
      ctx.fillStyle = '#f8d850';
      ctx.fillRect(x + 8 + b, cy, 1, 5); ctx.fillRect(x + 9 + b, cy + 1, 1, 3); ctx.fillRect(x + 10 + b, cy + 2, 1, 1);
      F().draw(ctx, 'Z: select', 4, G.H - 10, '#ffffff', { shadow: '#1c1424' });
    },
  };

  // ================================================================ ADMIN MODE (testing)
  // Start any story checkpoint (see G.ADMIN_CHECKPOINTS in content.js).
  G.adminStart = (i) => {
    const cps = G.ADMIN_CHECKPOINTS, s = newState();
    s.admin = true;
    s.adminCp = i;
    s.teeth = 100;
    for (let j = 0; j <= i; j++) {
      const c = cps[j];
      Object.assign(s.flags, c.flags || {});
      Object.assign(s.items, c.items || {});
      for (const id of c.party || []) if (!s.party.includes(id)) s.party.push(id);
      if (c.follower !== undefined) s.follower = c.follower;
      if (c.maxHp) s.maxHp = c.maxHp;
      if (c.teeth) s.teeth = c.teeth;
      if (c.rocks) { s.rocks = s.rocks || {}; s.rocksFound = s.rocksFound || {}; for (const r of G.ROCKS) { s.rocks[r.id] = 1; s.rocksFound[r.id] = 1; } }
    }
    const c = cps[i];
    Object.assign(s, { map: c.map, x: c.at[0] * 16 + 8, y: c.at[1] * 16 + 14, dir: c.at[2] });
    s.hp = s.maxHp;
    G.script.reset();
    G.state = s;
    G.play.menu = null;
    G.play.warping = false;
    G.play.enter(!!c.fresh);
  };

  G.adminPick = {
    VIS: 11,
    enter() { G.scene = this; G.fade = 0; this.sel = 0; this.scroll = 0; this.t = 0; },
    update() {
      this.t++;
      const inp = G.input, n = G.ADMIN_CHECKPOINTS.length;
      if (inp.hit('up')) { this.sel = (this.sel + n - 1) % n; G.audio.sfx('menu'); }
      if (inp.hit('down')) { this.sel = (this.sel + 1) % n; G.audio.sfx('menu'); }
      if (this.sel < this.scroll) this.scroll = this.sel;
      if (this.sel >= this.scroll + this.VIS) this.scroll = this.sel - this.VIS + 1;
      if (inp.hit('b') || inp.hit('start')) { inp.eat('b'); inp.eat('start'); G.audio.sfx('cancel'); G.title.enter(); return; }
      if (inp.hit('a')) { inp.eat('a'); G.audio.sfx('select'); G.adminStart(this.sel); }
    },
    draw(ctx) {
      ctx.drawImage(G.spr.ditch, 0, 0);
      ctx.fillStyle = 'rgba(12,8,20,0.82)';
      ctx.fillRect(0, 0, G.W, G.H);
      const title = 'ADMIN MODE: JUMP TO...';
      F().draw(ctx, title, Math.round((G.W - F().width(title)) / 2), 5, '#f8d850', { shadow: '#0c0814' });
      G.box(ctx, 8, 16, 224, this.VIS * 11 + 6);
      G.ADMIN_CHECKPOINTS.slice(this.scroll, this.scroll + this.VIS).forEach((c, k) => {
        const i = this.scroll + k, y = 20 + k * 11, on = i === this.sel;
        if (on) { ctx.fillStyle = '#3a3058'; ctx.fillRect(10, y - 1, 220, 11); }
        F().draw(ctx, (i + 1 < 10 ? ' ' : '') + G.sayable(i + 1) + '. ' + c.name, 16, y, on ? '#f8d850' : '#f8f8f0', { shadow: '#0c0814' });
      });
      F().draw(ctx, 'Z: go   X: back   (admin runs never save)', 8, G.H - 11, '#c8c0d8', { shadow: '#0c0814' });
    },
  };

  // ================================================================ FILE SELECT
  G.files = {
    enter(mode) {
      G.scene = this;
      G.fade = 0;
      this.mode = mode;
      this.sel = 0;
      this.t = 0;
      this.confirm = false;
      this.saves = [1, 2, 3].map((n) => G.readSave(n));
      if (mode === 'load') this.sel = Math.max(0, G.latestSave() - 1);
      else { const empty = this.saves.findIndex((s) => !s); this.sel = empty < 0 ? 0 : empty; }
    },
    // a brand-new game in file n
    start(n) {
      G.audio.sfx('select');
      G.state = newState();
      G.writeSave(n);
      G.intro.enter();
    },
    update() {
      this.t++;
      const inp = G.input;
      if (this.confirm) {
        if (inp.hit('a')) { inp.eat('a'); this.start(this.sel + 1); }
        else if (inp.hit('b') || inp.hit('start')) { inp.eat('b'); inp.eat('start'); this.confirm = false; G.audio.sfx('cancel'); }
        return;
      }
      if (inp.hit('up')) { this.sel = (this.sel + 2) % 3; G.audio.sfx('menu'); }
      if (inp.hit('down')) { this.sel = (this.sel + 1) % 3; G.audio.sfx('menu'); }
      if (inp.hit('b') || inp.hit('start')) { inp.eat('b'); inp.eat('start'); G.audio.sfx('cancel'); G.title.enter(); return; }
      if (inp.hit('a')) {
        inp.eat('a');
        const s = this.saves[this.sel];
        if (this.mode === 'load') {
          if (!s) { G.audio.sfx('bump'); return; }
          G.audio.sfx('select');
          G.state = s;
          G.play.enter(false);
        } else if (s) {
          this.confirm = true;
          G.audio.sfx('menu');
        } else {
          this.start(this.sel + 1);
        }
      }
    },
    draw(ctx) {
      ctx.drawImage(G.spr.ditch, 0, 0);
      ctx.fillStyle = 'rgba(12,8,20,0.72)';
      ctx.fillRect(0, 0, G.W, G.H);
      const title = this.mode === 'load' ? 'LOAD A FILE' : 'NEW GAME: PICK A FILE';
      F().draw(ctx, title, Math.round((G.W - F().width(title)) / 2), 6, '#f8d850', { shadow: '#0c0814' });
      for (let i = 0; i < 3; i++) G.drawFileCard(ctx, 8, 20 + i * 40, 224, this.saves[i], i + 1, i === this.sel);
      let help = this.mode === 'load' ? 'Z: load   X: back' : 'Z: start a new game here   X: back';
      if (this.confirm) help = '{r}Erase File ' + (this.sel + 1) + ' and start over?{/}  Z: yes  X: no';
      F().draw(ctx, help, 8, G.H - 11, '#c8c0d8', { shadow: '#0c0814' });
    },
  };

  // ================================================================ INTRO STORY
  G.intro = {
    pages: [
      { pic: 'ditch', text: 'Chesapeake, Virginia.' },
      { pic: 'ditch', text: 'Off a quiet road lies a ditch. But not just any ditch...' },
      { pic: 'ditch', text: 'The {y}NUMBER ONE DITCH{/}. Apple Maps says so. The best ditch in the whole world.' },
      { pic: 'dark', text: 'But deep in the Andrews\' basement, something stirred...' },
      { pic: 'eggmas', name: 'Father Eggmas', text: 'HO HO HO! The Number One Ditch shall be MINE!' },
      { pic: 'eggmas', name: 'Father Eggmas', text: 'I will turn it into... the Number {r}TWO{/} Ditch!', shake: true },
      { pic: 'black', text: 'Meanwhile, at Lafayette College in Easton, Pennsylvania...' },
    ],
    enter() {
      G.scene = this;
      G.fade = 0;
      this.i = 0;
      this.t = 0;
      this.startPage();
      G.audio.play('title');
    },
    startPage() {
      const pg = this.pages[this.i];
      this.d = G.say(pg.name || null, pg.text, { top: false });
      this.d.start();
      this.t = 0;
    },
    update() {
      this.t++;
      if (G.input.hit('start')) { G.input.eat('start'); return this.finish(); }
      if (this.d.update()) {
        this.i++;
        if (this.i >= this.pages.length) return this.finish();
        this.startPage();
      }
    },
    finish() {
      G.play.enter(true);
    },
    draw(ctx) {
      const pg = this.pages[this.i];
      if (!pg) return;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, G.W, G.H);
      if (pg.pic === 'ditch') ctx.drawImage(G.spr.ditch, 0, 0);
      if (pg.pic === 'dark' || pg.pic === 'eggmas') {
        ctx.fillStyle = '#1a0c14';
        ctx.fillRect(0, 0, G.W, G.H);
        ctx.fillStyle = '#2e1420';
        for (let r = 60; r > 0; r -= 12) { ctx.globalAlpha = 0.25; ctx.fillRect(120 - r, 60 - r * 0.7, r * 2, r * 1.4); }
        ctx.globalAlpha = 1;
        const egg = G.spr.eggmas, sc = pg.pic === 'eggmas' ? 3 : 2;
        const jx = pg.shake ? Math.round((Math.random() * 2 - 1) * 2) : 0;
        ctx.globalAlpha = pg.pic === 'dark' ? 0.35 : 1;
        ctx.drawImage(egg, 120 - (egg.width * sc) / 2 + jx, 6 + (pg.pic === 'dark' ? 24 : 0), egg.width * sc, egg.height * sc);
        ctx.globalAlpha = 1;
      }
      this.d.draw(ctx);
      F().draw(ctx, 'ENTER: skip', G.W - F().width('ENTER: skip') - 4, 3, '#9890a8', { shadow: '#000' });
    },
  };

  // ================================================================ GAME OVER
  G.gameOver = {
    enter() {
      G.scene = this;
      G.fade = 0;
      this.t = 0;
      this.sel = 0;
      G.script.reset();
      // fainting drops a fifth of Nate's shark teeth: taken out of the save file he'll
      // continue from (admin runs never touch the files, so they just show it)
      const cur = G.state, saved = cur.admin ? null : G.loadSave(cur.slot);
      this.lost = Math.floor(((saved || cur).teeth || 0) * FAINT_COST);
      if (saved && this.lost) {
        saved.teeth -= this.lost;
        G.state = saved; G.writeSave(saved.slot || cur.slot); G.state = cur;
      }
    },
    update() {
      this.t++;
      if (this.t < 60) return;
      const inp = G.input;
      if (inp.hit('up') || inp.hit('down')) { this.sel ^= 1; G.audio.sfx('menu'); }
      if (inp.hit('a') || inp.hit('start')) {
        inp.eat('a'); inp.eat('start');
        G.audio.sfx('select');
        if (this.sel === 0) {
          if (G.state.admin) { G.adminStart(G.state.adminCp || 0); return; }
          G.state = G.loadSave(G.state.slot) || newState();
          G.state.hp = G.state.maxHp;
          G.play.enter(false);
        } else {
          G.title.enter();
        }
      }
    },
    draw(ctx) {
      ctx.fillStyle = '#0c0814';
      ctx.fillRect(0, 0, G.W, G.H);
      // a dim red glow behind whoever fainted
      const glow = ctx.createRadialGradient(120, 58, 4, 120, 58, 90);
      glow.addColorStop(0, 'rgba(120,30,50,0.45)'); glow.addColorStop(1, 'rgba(12,8,20,0)');
      ctx.fillStyle = glow; ctx.fillRect(0, 0, G.W, G.H);
      const S = G.nateSprites();
      ctx.save();
      ctx.translate(120, 60);
      ctx.rotate(Math.PI / 2);
      ctx.drawImage(S.down[0], -S.h / 2, -8);
      ctx.restore();
      // seeing stars
      for (let i = 0; i < 3; i++) {
        const a = this.t / 14 + (i * Math.PI * 2) / 3, sx = Math.round(126 + Math.cos(a) * 8), sy = Math.round(45 + Math.sin(a) * 2.5);
        ctx.fillStyle = '#1c1424'; ctx.fillRect(sx - 2, sy - 1, 5, 3); ctx.fillRect(sx - 1, sy - 2, 3, 5);
        ctx.fillStyle = Math.sin(a) > 0 ? '#f8d850' : '#c89838'; ctx.fillRect(sx - 1, sy, 3, 1); ctx.fillRect(sx, sy - 1, 1, 3);
      }
      // the shark teeth that fell out of his pockets
      if (this.lost) {
        const tt = '-' + G.sayable(this.lost) + ' shark teeth', tw = 10 + F().width(tt), tx = Math.round((G.W - tw) / 2);
        ctx.drawImage(G.spr.tooth, tx, 13);
        F().draw(ctx, tt, tx + 10, 14, '#f86858', { shadow: '#1c1424' });
      }
      const lily = G.state.playAs === 'lily';
      const t1 = (lily ? 'Lily' : 'Nate') + ' fainted...';
      F().drawBig(ctx, t1, Math.round((G.W - F().bigWidth(t1, 2)) / 2), 72, 2, (r) => (r < 2 ? '#ffb0a8' : r < 4 ? '#f86858' : '#c83848'), '#1c1424');
      if (this.t < 60) return;
      // whoever gets them back up says so, with their face in a little frame
      const k = Math.min(1, (this.t - 60) / 10), who = lily ? 'Nate' : 'Lily';
      const msg = lily ? 'Get up, Lily. Mikey is still singing.' : 'Get up, Nate. The ditch needs you.';
      const face = G.sprites[lily ? (G.state.items.cap ? 'nate' : 'nate_nocap') : 'lily'].down[0];
      const bw = 38 + Math.max(F().width(msg), F().width(who)) + 9, bx = Math.round((G.W - bw) / 2), by = 90 + Math.round((1 - k) * 6);
      ctx.globalAlpha = k;
      G.box(ctx, bx, by, bw, 30);
      ctx.fillStyle = '#0c0814'; ctx.fillRect(bx + 5, by + 3, 28, 24);
      ctx.fillStyle = '#2a2240'; ctx.fillRect(bx + 6, by + 4, 26, 22);
      ctx.drawImage(face, 2, 1, 12, 11, bx + 7, by + 4, 24, 22);
      F().draw(ctx, who, bx + 38, by + 5, G.NAME_COLORS[who] || '#ff98d0', { shadow: '#0c0814' });
      F().draw(ctx, msg, bx + 38, by + 16, '#f8f8f0', { shadow: '#0c0814', max: Math.max(0, Math.floor((this.t - 66) * 0.9)) });
      ctx.globalAlpha = 1;
      // continue / title, in a box like the title screen's
      const w = 84, x = Math.round((G.W - w) / 2), y = 125;
      G.box(ctx, x, y, w, 32);
      ['Continue', 'Back to Title'].forEach((o, i) => {
        F().draw(ctx, o, x + 18, y + 5 + i * 12, i === this.sel ? '#f8d850' : '#f8f8f0', { shadow: '#0c0814' });
      });
      const cy = y + 6 + this.sel * 12, b = (this.t >> 3) & 1;
      ctx.fillStyle = '#f8d850';
      ctx.fillRect(x + 8 + b, cy, 1, 5); ctx.fillRect(x + 9 + b, cy + 1, 1, 3); ctx.fillRect(x + 10 + b, cy + 2, 1, 1);
    },
  };

  // ================================================================ BOOT + LOOP
  const cv = document.getElementById('screen');
  const ctx = cv.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  function fit() {
    const s = Math.max(1, Math.floor(Math.min((innerWidth - 40) / G.W, (innerHeight - 90) / G.H)));
    cv.style.width = G.W * s + 'px';
    cv.style.height = G.H * s + 'px';
  }
  addEventListener('resize', fit);
  fit();

  G.art.init();
  G.sprites = {};
  for (const id in G.CAST) G.sprites[id] = G.art.person(G.CAST[id]);
  // Nate only wears his flat cap once Groundskeeper Gus gives it back.
  G.nateSprites = () => (G.state && G.state.playAs ? G.sprites[G.state.playAs]
    : G.state && G.state.items.cap ? G.sprites.nate : G.sprites.nate_nocap);
  G.fade = 0;
  G.state = newState();
  G.title.enter();

  const STEP = 1000 / 60;
  let acc = 0, last = performance.now();
  function frame(now) {
    acc += Math.min(100, now - last);
    last = now;
    while (acc >= STEP) {
      G.tick++;
      G.scene.update();
      G.input.endTick();
      acc -= STEP;
    }
    G.scene.draw(ctx);
    if (G.fade > 0) {
      ctx.fillStyle = `rgba(0,0,0,${G.fade})`;
      ctx.fillRect(0, 0, G.W, G.H);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // Handy for testing from the console.
  G.debug = { newState };
})();
