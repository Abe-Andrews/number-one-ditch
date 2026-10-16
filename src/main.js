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

  G.hasSave = () => {
    try { return !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; }
  };
  G.loadSave = () => {
    try { return Object.assign(newState(), JSON.parse(localStorage.getItem(SAVE_KEY))); } catch (e) { return null; }
  };
  G.writeSave = () => {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(G.state)); } catch (e) { /* storage unavailable */ }
  };

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
      this.world = new G.World(id);
      this.player = new G.Player(x, y, dir);
      this.world.add(this.player);
      // party members trail behind Nate
      const [ddx, ddy] = G.DIRS[dir];
      this.trail = [];
      for (let i = 0; i < 90; i++) this.trail.push({ x: x - ddx * i * 0.6, y: y - ddy * i * 0.6, dir });
      G.state.party.filter((p) => p !== 'nate').forEach((pid, i) => {
        const t = this.trail[Math.min(89, (i + 1) * 14)];
        this.world.add(new G.Follower(pid, i, t.x, t.y, dir));
      });
      for (const t of this.world.triggers) t.inside = G.overlap(t.rect, this.feet());
      const s = G.state;
      s.map = id; s.x = x; s.y = y; s.dir = dir;
      G.audio.play(this.world.def.music);
      G.areaBanner.show(this.world.def.name);
      this.snapCam();
      if (this.world.def.onEnter && !skipEnter) G.script.run(this.world.def.onEnter());
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

    warp(map, tx, ty, dir) {
      if (this.warping) return;
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
      for (const e of this.world.ents) {
        if (!e.talk || e === p) continue;
        const b = e.box();
        if (!G.overlap([b[0] - 2, b[1] - 6, b[2] + 2, b[3] + 2], pt)) continue;
        if (e instanceof G.NPC) e.dir = G.dirToward(p.x - e.x, p.y - e.y);
        G.script.run(e.talk.call(e, e));
        return true;
      }
      for (const pr of this.world.props) {
        if (!pr.talk || !pr.hit || !G.overlap(pr.hit, pt)) continue;
        G.script.run(pr.talk());
        return true;
      }
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
      if (skipped && !s.flags.skipNote) {
        s.flags.skipNote = true;
        G.script.run(G.SCRIPTS.skipNote());
      }
    },

    maybeDrop(x, y, chance) {
      if (Math.random() > chance) return;
      const s = G.state;
      let kind = 'tooth';
      if (s.hp < s.maxHp && Math.random() < 0.35) kind = 'heart';
      else if (Math.random() < 0.15) kind = 'tooth5';
      this.world.add(new G.Pickup(x, y, kind));
    },

    collect(kind) {
      if (kind === 'tooth') { this.addTeeth(1); G.audio.sfx('tooth'); }
      else if (kind === 'tooth5') { this.addTeeth(5); G.audio.sfx('tooth'); }
      else if (kind === 'heart') { this.healQ += 2; G.audio.sfx('heart'); }
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
      this.player.state = 'dead';
      G.audio.stop();
    },

    update() {
      G.areaBanner.update();
      if (this.shakeT > 0) this.shakeT--;

      if (this.dying) {
        this.dying++;
        if (this.dying % 6 === 0) this.player.dir = ['down', 'left', 'up', 'right'][(this.dying / 6) % 4];
        if (this.dying > 90) G.gameOver.enter();
        return;
      }

      if (this.menu) {
        if (this.menu.update()) this.menu = null;
        return;
      }

      if (!G.script.busy && G.input.hit('start')) {
        G.input.eat('start');
        this.menu = new G.PauseMenu();
        return;
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

      // camera follows Nate (or a cutscene focus point)
      const w = this.world, p = this.player, f = this.camFocus;
      const tx = (f ? f.x : p.x) - G.W / 2, ty = (f ? f.y : p.y - 12) - G.H / 2;
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
      this.world.draw(ctx, cam);
      G.hud.draw(ctx);
      const boss = this.world.ents.find((e) => e.boss && e.state !== 'defeated');
      if (boss) G.hud.bossBar(ctx, boss);
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
      this.opts = G.hasSave() ? ['Continue', 'New Game'] : ['New Game'];
      G.audio.play('title');
    },
    update() {
      this.t++;
      const inp = G.input;
      if (inp.hit('up') || inp.hit('down')) { this.sel = (this.sel + 1) % this.opts.length; G.audio.sfx('menu'); }
      if (inp.hit('a') || inp.hit('start')) {
        inp.eat('a'); inp.eat('start');
        G.audio.sfx('select');
        if (this.opts[this.sel] === 'Continue') {
          G.state = G.loadSave() || newState();
          G.play.enter(false);
        } else {
          G.state = newState();
          G.intro.enter();
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
      const w = 84, h = this.opts.length * 12 + 8, x = Math.round((G.W - w) / 2), y = 114;
      G.box(ctx, x, y, w, h);
      this.opts.forEach((o, i) => {
        F().draw(ctx, o, x + 18, y + 5 + i * 12, i === this.sel ? '#f8d850' : '#f8f8f0', { shadow: '#0c0814' });
      });
      const cy = y + 6 + this.sel * 12, b = (this.t >> 3) & 1;
      ctx.fillStyle = '#f8d850';
      ctx.fillRect(x + 8 + b, cy, 1, 5); ctx.fillRect(x + 9 + b, cy + 1, 1, 3); ctx.fillRect(x + 10 + b, cy + 2, 1, 1);
      F().draw(ctx, 'Z: select', 4, G.H - 10, '#ffffff', { shadow: '#1c1424' });
    },
  };

  // ================================================================ INTRO STORY
  G.intro = {
    pages: [
      { pic: 'ditch', text: 'Chesapeake, Virginia.' },
      { pic: 'ditch', text: 'Off a quiet road lies a ditch. But not just any ditch...' },
      { pic: 'ditch', text: 'The {y}NUMBER ONE DITCH{/}. Google Maps says so. The best ditch in the whole world.' },
      { pic: 'dark', text: 'But deep in the back of a thrift store, something stirred...' },
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
          G.state = G.loadSave() || newState();
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
      const S = G.nateSprites();
      ctx.save();
      ctx.translate(120, 60);
      ctx.rotate(Math.PI / 2);
      ctx.drawImage(S.down[0], -S.h / 2, -8);
      ctx.restore();
      const t1 = 'Nate fainted...';
      F().draw(ctx, t1, Math.round((G.W - F().width(t1)) / 2), 84, '#f86858', { shadow: '#000' });
      if (this.t < 60) return;
      const t2 = 'Lily: get up nate. the ditch needs you';
      F().draw(ctx, t2, Math.round((G.W - F().width(t2)) / 2), 98, '#ff98d0', { shadow: '#000' });
      ['Continue', 'Back to Title'].forEach((o, i) => {
        F().draw(ctx, (i === this.sel ? '> ' : '  ') + o, 84, 118 + i * 12, i === this.sel ? '#f8d850' : '#f8f8f0', { shadow: '#000' });
      });
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
  G.nateSprites = () => (G.state && G.state.items.cap ? G.sprites.nate : G.sprites.nate_nocap);
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
