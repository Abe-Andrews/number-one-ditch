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
      // ...and from when the half-finished bass was a weapon on X (it's an instrument now)
      if (s.xItem === 'bass') s.xItem = null;
      // ...and from when Ben was Devin (whether he took one of Doron's tickets)
      if (f.ticket_Devin && !f.ticket_Ben) f.ticket_Ben = f.ticket_Devin;
      // ...and from before beating Nani came with the BMF belt
      if (s.fights && s.fights.nani) s.items.bmf = true;
      // ...and from the first Hannah's shift (?v=182), which kept grades and knitted hats
      if (s.nicu) for (const k in s.nicu) if (typeof s.nicu[k] !== 'object') delete s.nicu[k];
      delete s.hats;
      // ...and from when clearing the Boss Rush gave a trophy (it's a golden rock hammer now)
      if (s.items.rushTrophy) { s.items.goldHammer = true; delete s.items.rushTrophy; }
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
    // (a boss rush plays on a copy of the save, and leaves the real one alone)
    if (s.rush) return true;
    // admin (testing) runs never touch the save files: they keep a copy in memory instead, so
    // fainting continues from the last door walked through, like a real save
    if (s.admin) { G.adminSnap = JSON.parse(JSON.stringify(s)); return true; }
    s.slot = n || s.slot || 1;
    s.savedAt = Date.now();
    try { localStorage.setItem(fileKey(s.slot), JSON.stringify(s)); return true; } catch (e) { return false; }
  };

  // Shark teeth never show the sacred number: a count that would have a 6 in it skips to the next
  // one that doesn't (up when Nate gains teeth, down when he spends them). Skipping down takes more
  // than the price, so the difference is owed (s.teethOwed) and comes back with the next teeth he
  // picks up. Returns true if the count skipped.
  function moveTeeth(s, n) {
    let t = s.teeth + n;
    if (n > 0 && s.teethOwed) { t += s.teethOwed; s.teethOwed = 0; }
    const exact = t;
    while (/6/.test(String(t))) t += n >= 0 ? 1 : -1;
    if (t < exact && t >= 0) s.teethOwed = (s.teethOwed || 0) + (exact - t);
    s.teeth = G.clamp(t, 0, 999);
    return t !== exact;
  }

  // Fainting: the frame Nate hits the ground, and the share of his shark teeth he drops.
  const FAINT_LAND = G.FAINT_LAND = 54;
  const FAINT_COST = 0.15;

  // A front door, partway open (k = 1..6): the dark doorway widening out from the middle,
  // with warm light spilling across the floor inside. 12x15, drawn behind Nate.
  const doorFrames = {};
  function doorOpen(k) {
    if (doorFrames[k]) return doorFrames[k];
    const c = G.canvas(12, 15), x = c.getContext('2d'), w = k * 2, x0 = 6 - k;
    x.fillStyle = '#1c1220'; x.fillRect(x0, 0, w, 15);
    x.fillStyle = '#3a2a2e'; x.fillRect(x0, 0, w, 2);
    x.fillStyle = 'rgba(248,208,128,0.55)'; x.fillRect(x0, 11, w, 4);
    x.fillStyle = 'rgba(248,224,160,0.8)'; x.fillRect(x0 + 1, 13, Math.max(0, w - 2), 2);
    return (doorFrames[k] = c);
  }

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

    // Subtitles: lines said out loud without stopping the game (like Nate's first look at a new
    // enemy). They queue up and play one at a time in a slim see-through strip near the bottom of
    // the screen, with the speaker's little face and name, so nothing covers the action.
    say(lines) {
      this.bubbles = this.bubbles || [];
      for (const [who, text] of lines) this.bubbles.push({ who, text, t: 0, dur: 80 + text.length * 2 });
    },
    drawBubble(ctx, b) {
      const F = G.font, s = G.state, who = b.who || 'Nate';
      const id = who === 'Nate' ? (s.items.cap ? 'nate' : 'nate_nocap') : Object.keys(G.PARTY_INFO).find((k) => G.PARTY_INFO[k].name === who);
      const face = id && G.sprites[id] ? G.sprites[id].down[0] : null;
      const nameW = F.width(who) + 6, tx = 6 + (face ? 16 : 2) + nameW, lines = F.wrap(b.text, G.W - tx - 8);
      const h = lines.length * 9 + 5, y = G.H - 15 - h;
      const a = Math.max(0, Math.min(1, b.t / 5, (b.dur - b.t) / 8));
      ctx.globalAlpha = a;
      ctx.fillStyle = 'rgba(12,8,20,0.62)'; ctx.fillRect(2, y, G.W - 4, h);
      ctx.fillStyle = 'rgba(248,216,80,0.5)'; ctx.fillRect(2, y, G.W - 4, 1);
      if (face) ctx.drawImage(face, 2, 1, 12, 11, 6, y + 2, 12, 11);
      F.draw(ctx, who, 6 + (face ? 16 : 2), y + 3, G.NAME_COLORS[who] || '#f8d850', { shadow: '#0c0814' });
      let left = Math.floor(b.t * 1.6);
      lines.forEach((l, k) => { if (left > 0) F.draw(ctx, l, tx, y + 3 + k * 9, '#f8f8f0', { shadow: '#0c0814', max: left }); left -= F.visibleLength(l); });
      ctx.globalAlpha = 1;
    },

    loadMap(id, x, y, dir, skipEnter) {
      this.camFocus = null;
      this.overlay = null;
      this.bubbles = [];
      if (G.hidePipeBook) G.hidePipeBook();
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
      // (some maps have the whole family there in person, like the finale: nobody trails behind)
      if (fid && !G.state.playAs && !this.world.def.noFollower) {
        const t = this.trail[14];
        this.world.add(new G.Follower(fid, 0, t.x, t.y, dir));
      }
      for (const t of this.world.triggers) t.inside = G.overlap(t.rect, this.feet());
      const s = G.state;
      s.map = id; s.x = x; s.y = y; s.dir = dir;
      (s.visited = s.visited || {})[id] = 1;
      // (Nate's own song, if he set one to play in the game, plays instead of the map's music)
      if (G.mixFor) G.audio.setMix(G.mixFor());
      G.audio.play(this.world.def.music);
      // arriving in a new part of the trip gets a title card; rooms inside it get the little name banner.
      // A flashback (and the step back out of one) gets neither, and doesn't count as going anywhere.
      if (G.flashback || this.fromFlashback) {
        G.regionCard.t = 0; G.areaBanner.t = 0;
        this.fromFlashback = !!G.flashback;
      } else {
        const region = G.regionOf && !G.state.rush ? G.regionOf(id) : null;
        if (region && region !== this.lastRegion) { G.regionCard.show(region); G.areaBanner.t = 0; }
        else { G.regionCard.t = Math.min(G.regionCard.t, 0); G.areaBanner.show(this.world.def.name); }
        if (region) this.lastRegion = region;
      }
      this.snapCam();
      if (this.world.def.onEnter && !skipEnter) G.script.run(this.world.def.onEnter());
      // (Lily's Taco Bell line for some places, the first time she walks in with Nate)
      if (!skipEnter && G.lilyMapLine) G.script.run(G.lilyMapLine(id));
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
      if (id && !G.state.playAs && !w.def.noFollower) {
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

    warp(map, tx, ty, dir, sure, door) {
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
        // a front door swings open first, behind Nate, with warm light inside
        if (door) {
          const prop = { img: null, x: door.x + 2, y: door.y + 1, base: door.y };
          self.world.props.push(prop);
          for (let t = 1; t <= 10; t++) { prop.img = doorOpen(Math.min(6, Math.ceil(t * 0.7))); yield G.wait(1); }
        }
        yield G.irisOut(16);
        self.loadMap(map, tx * 16 + 8, ty * 16 + 14, dir);
        self.autosave();
        yield G.wait(4);
        yield G.irisIn(18);
        self.warping = false;
      })());
    },

    // anything hostile on screen goes in s.seen, by its class name. (A save from before this
    // starts out with whatever its visited maps say it must have run into: G.seedSeen, manual.js.)
    noteSeen() {
      const s = G.state, w = this.world, c = this.cam;
      if (!s || !w || s.rush) return;
      if (!s.seen) { s.seen = {}; if (G.seedSeen) G.seedSeen(s); }
      for (const e of w.ents) {
        if (!(e.enemy || e.boss) || e.dead || e.hidden) continue;
        if (e.x < c.x - 8 || e.x > c.x + G.W + 8 || e.y < c.y - 8 || e.y > c.y + G.H + 32) continue;
        const k = e.constructor && e.constructor.name;
        if (k && !s.seen[k]) s.seen[k] = 1;
        // (New Game+: every boss has half again as much health. Left as they are: the relay's Father
        // Eggmas, who counts hits a turn at a time, and bosses with only a few hit points, like Romulus,
        // whose fights are about soaking him, not hitting him)
        if (s.flags.ngPlus && e.boss && !e.ngScaled && e.maxHp >= 6 && !(e instanceof G.EggmasBoss)) {
          e.ngScaled = true;
          e.maxHp = Math.ceil(e.maxHp * 1.5); e.hp = Math.ceil(e.hp * 1.5);
        }
      }
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
      // (Lily sneaking out at 2 AM: only the night's own people and things answer)
      const night = !!G.state.night;
      for (const e of this.world.ents) {
        if (!e.talk || e === p || (night && !e.night)) continue;
        const b = e.box();
        if (!G.overlap([b[0] - 2, b[1] - 6, b[2] + 2, b[3] + 2], pt)) continue;
        if (e instanceof G.Follower) { if (!fighting && !partner) partner = e; continue; }
        if (e instanceof G.NPC) e.dir = G.dirToward(p.x - e.x, p.y - e.y);
        // while Nate is handing out Doron's spare tickets, people get offered one first
        const offer = e instanceof G.NPC && (G.SCRIPTS.ticketReaction(e) || G.SCRIPTS.soakReaction(e));
        G.script.run(offer || e.talk.call(e, e));
        return true;
      }
      let notNow = false;
      for (const pr of this.world.props) {
        if (!pr.talk || !pr.hit || !G.overlap(pr.hit, pt)) continue;
        if (night && !pr.night) { notNow = true; continue; }
        G.script.run(pr.talk());
        return true;
      }
      if (notNow) { this.world.pop(p.x, p.y - 30, (G.state.night.abe ? ['*not now*', '*the lights, Abe*', '*last one up*'] : ['*not now*', '*focus, Lily*', '*Taco Bell first*'])[G.tick % 3], '#c8a0f0'); return true; }
      if (partner) { G.script.run(partner.talk()); return true; }
      return false;
    },

    useItem() {
      const s = G.state;
      if (s.xItem === 'doosh') {
        if (s.items.doosh <= 0) { G.audio.sfx('bump'); return; }
        // (no snacking in the middle of a boss fight)
        if (this.bossFight()) { G.audio.sfx('bump'); this.world.pop(this.player.x, this.player.y - 30, 'No time for Doosh! Not in a boss fight.', '#f8f8f0'); return; }
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
      } else if (s.xItem === 'tacoBag') {
        // the bag from Lily's 2 AM Taco Bell run: every heart back
        const p = this.player, w = this.world;
        if (!(s.items.tacoBag > 0)) { G.audio.sfx('bump'); w.pop(p.x, p.y - 30, 'All gone. Lily could do another run...', '#f8f8f0'); return; }
        if (s.hp >= s.maxHp) { G.script.run((function* () { yield G.say('Nate', 'I\'m not hungry yet. (Your hearts are full.)'); })()); return; }
        if (this.healQ > 0) return;
        s.items.tacoBag--;
        this.healQ += s.maxHp - s.hp;
        G.audio.sfx('gulp');
        w.pop(p.x, p.y - 30, '*crunch*', '#c8a0f0');
        if (G.with('lily') && !s.flags.ateTaco) { s.flags.ateTaco = true; G.script.run((function* () { yield G.say('Lily', 'That was MY Crunchwrap.'); })()); }
      } else if (s.xItem === 'firstAid') {
        // Hannah's first-aid kit: a few hearts back per use; restock it at a supply closet
        const p = this.player, w = this.world;
        if (!(s.items.firstAid > 0)) { G.audio.sfx('bump'); w.pop(p.x, p.y - 30, 'EMPTY! Restock at a supply closet.', '#f8f8f0'); return; }
        if (s.hp >= s.maxHp) { G.audio.sfx('bump'); w.pop(p.x, p.y - 30, 'Your hearts are full.', '#f8f8f0'); return; }
        if (this.healQ > 0) return;
        s.items.firstAid--;
        this.healQ += G.KIT_HEAL;
        G.audio.sfx('heart');
        w.pop(p.x, p.y - 30, 'Patched up!', '#f86868');
        w.burst(p.x, p.y - 14, ['#f86868', '#ffffff', '#f8a8c8'], 10, { speed: 1, up: 0.8, life: 22, size: 2 });
      } else if (s.xItem === 'pipe') {
        G.pipe.start();
      } else if (s.xItem === 'chicken') {
        // the chicken lays... fires... an egg (with a cooldown)
        if (this.eggCool > 0) { G.audio.sfx('bump'); return; }
        const p = this.player, [dx, dy] = G.DIRS[p.dir];
        // eggs are sold separately (Mom's flower stand)
        if (!(s.items.eggs > 0)) { G.audio.sfx('bump'); this.world.pop(p.x, p.y - 30, 'OUT OF EGGS!', '#f8f8f0'); this.eggCool = 20; return; }
        s.items.eggs--;
        // (Mom's garden game upgrades her: Quick, then Double Yolk, then Golden Eggs: see G.EggShot)
        if ((s.flags.chickenUp || 0) >= 2) for (const k of [-0.5, 0.5]) this.world.add(new G.EggShot(p.x + dx * 8, p.y + dy * 6, p.dir, k));
        else this.world.add(new G.EggShot(p.x + dx * 8, p.y + dy * 6, p.dir));
        this.eggCool = G.eggCoolMax();
        p.chickenT = 20;
        G.audio.sfx('bawk');
      } else if (s.xItem === 'bidet') {
        this.bidetStart();
      } else if (s.xItem === 'sifter') {
        // scoop and shake: a gravel spot in front of Nate gives up its find, anywhere else it's just dirt
        const w = this.world, p = this.player, [dx, dy] = G.DIRS[p.dir];
        if (this.siftCool > 0) return;
        this.siftCool = 30;
        const px = p.x + dx * 12, py = p.y - 4 + dy * 12, area = [px - 10, py - 10, px + 10, py + 10];
        const spot = w.props.find((pr) => pr.hit && (pr.sift || pr.talk === G.SCRIPTS.brookSift || pr.talk === G.SCRIPTS.megalodonSift) && G.overlap(pr.hit, area));
        G.audio.sfx('sift');
        w.burst(px, py, ['#a89070', '#c8b090', '#8a7a68'], 6, { speed: 0.8, up: 0.6, g: 0.08, life: 18, size: 1 });
        if (spot) { G.script.run(spot.talk(true)); return; }
        w.pop(p.x, p.y - 30, ['*shake shake*  Just dirt.', '*shake shake*  Pebbles. Nothing good.', '*shake shake*  Nothing here.'][Math.floor(Math.random() * 3)], '#c8b090');
      } else if (s.xItem === 'rod') {
        // cast the surf rod (one line out at a time, and a breather after each one comes back)
        if (this.world.ents.some((e) => e instanceof G.Lure && !e.dead) || this.rodCool > 0) return;
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

    // The Portable Bidet: hold X to spray (a tank holds G.BIDET_MAX frames of it). Facing
    // water, a sink or a toilet, holding X slowly fills it back up instead (G.BIDET_FILL a
    // frame; moving, getting hit or letting go stops it). Anything with onSpray() gets
    // called every frame the stream is on it.
    bidetSource() {
      const p = this.player, w = this.world, [dx, dy] = G.DIRS[p.dir];
      const fx = p.x + dx * 14, fy = p.y - 4 + dy * 14, d = G.TILE_DEFS[w.tileAt(Math.floor(fx / 16), Math.floor(fy / 16))];
      const tp = [p.x + dx * 12 - 3, p.y - 4 + dy * 12 - 3, p.x + dx * 12 + 3, p.y - 4 + dy * 12 + 3];
      const fixture = w.props.find((pr) => pr.hit && G.waterFixture(pr.img) && G.overlap(pr.hit, tp));
      if (fixture) return { kind: fixture.img === G.spr.toilet ? 'toilet' : 'sink', x: fx, y: fy - 10 };
      // (water that's drawn as a picture over blocked tiles, like the pool at home: its prop says so)
      const pool = w.props.find((pr) => pr.refill && pr.hit && G.overlap(pr.hit, tp));
      if (pool) return { kind: pool.refill === 'birdbath' ? 'birdbath' : 'pool', x: fx, y: fy };
      // (a map can have water of its own that isn't a tile, like the trickle down the Number One Ditch)
      // (forgiving: where he's facing, a little to either side of that, or right under his feet)
      if (w.def.water) {
        const sx = dy ? 6 : 0, sy = dx ? 6 : 0;
        for (const [x, y] of [[fx, fy], [fx + sx, fy + sy], [fx - sx, fy - sy], [p.x + dx * 6, p.y - 2 + dy * 6], [p.x, p.y]]) if (w.def.water(x, y)) return { kind: 'water', x, y };
      }
      return d && ['water', 'bay', 'iceHole', 'mineWater'].includes(d.k) ? { kind: 'water', x: fx, y: fy } : null;
    },
    bidetStart() {
      const s = G.state, p = this.player, w = this.world, src = this.bidetSource();
      if (src) {
        if (G.bidetWater() >= G.BIDET_MAX) { w.pop(p.x, p.y - 30, 'It\'s already full.', '#a8d8ff'); return; }
        this.refilling = { x: p.x, y: p.y, dir: p.dir };
        w.pop(p.x, p.y - 30, src.kind === 'toilet' ? '*filling it from the toilet...*' : src.kind === 'sink' ? '*filling it at the sink...*' : src.kind === 'pool' ? '*filling it from the pool...*' : src.kind === 'birdbath' ? '*filling it from the birdbath...*' : '*filling...*', '#a8d8ff');
        if (src.kind === 'toilet' && !s.flags.bidetToilet) { s.flags.bidetToilet = true; G.script.run(G.SCRIPTS.bidetToilet()); }
        if (src.kind === 'pool' && !s.flags.bidetPool) { s.flags.bidetPool = true; G.script.run(G.SCRIPTS.bidetPool()); }
        if (src.kind === 'birdbath' && !s.flags.bidetBirdbath) { s.flags.bidetBirdbath = true; G.script.run(G.SCRIPTS.bidetBirdbath()); }
        return;
      }
      if (G.bidetWater() <= 0) { G.audio.sfx('bump'); this.bidetEmpty(); return; }
      this.spraying = true;
    },
    // filling it back up, a little at a time, for as long as X is held
    refillTick() {
      const r = this.refilling;
      if (!r) return;
      const s = G.state, p = this.player, w = this.world, src = this.bidetSource();
      // (he can shuffle around or turn while he fills, as long as he's still at the water)
      if (!G.input.down('b') || p.state !== 'walk' || s.xItem !== 'bidet' || !src) { this.refilling = null; return; }
      if (G.script.busy) return;
      // (a map's own water can fill it faster: the Ditch's trickle does, mid-fight)
      s.items.bidetWater = Math.min(G.BIDET_MAX, G.bidetWater() + G.BIDET_FILL * (src.kind === 'water' && w.def.waterFill || 1));
      if (G.tick % 24 === 0) { G.audio.sfx('blip'); w.burst(src.x, src.y, ['#5aa8e8', '#a8d8ff', '#ffffff'], 2, { speed: 0.6, up: 0.8, g: 0.1, life: 14, size: 1 }); }
      if (G.bidetWater() >= G.BIDET_MAX) {
        this.refilling = null;
        G.audio.sfx('gulp');
        w.pop(p.x, p.y - 30, 'FULL!', '#a8d8ff');
      }
    },
    // Where the stream is d pixels out: it leaves the nozzle (up by Nate's hand), arcs up a
    // little and comes down to the ground `len` pixels out the way he's facing.
    bidetNozzle(p) {
      return { right: [p.x + 10, p.y - 13], left: [p.x - 11, p.y - 13], down: [p.x + 4, p.y - 11], up: [p.x + 4, p.y - 13] }[p.dir];
    },
    bidetArc(p, d, len) {
      const [dx, dy] = G.DIRS[p.dir], [nx, ny] = this.bidetNozzle(p), k = d / len;
      const h = (p.y - ny) * (1 - k) + (8 + len / 8) * 4 * k * (1 - k);
      return [nx + dx * d, p.y + dy * d - h];
    },
    bidetTick() {
      // still holding X after it ran dry (or after getting knocked around) and now at water: start filling
      if (!this.spraying && !this.refilling && G.input.down('b') && G.state.xItem === 'bidet' && !G.script.busy && this.player.state === 'walk' && G.bidetWater() < G.BIDET_MAX && this.world.def.water && this.bidetSource()) {
        const p = this.player;
        this.refilling = { x: p.x, y: p.y, dir: p.dir };
        this.world.pop(p.x, p.y - 30, '*filling...*', '#a8d8ff');
      }
      if (!this.spraying) return;
      const s = G.state, p = this.player, w = this.world;
      if (!G.input.down('b') || G.script.busy || p.state !== 'walk' || s.xItem !== 'bidet') { this.spraying = false; return; }
      s.items.bidetWater = G.bidetWater() - 1;
      if (G.tick % 10 === 0) G.audio.sfx('spray');
      // it reaches 72px (more with the turbo nozzle), or less if it lands against something
      // solid (it carries over water)
      const [dx, dy] = G.DIRS[p.dir], [nx] = this.bidetNozzle(p);
      let len = 8;
      while (len < G.bidetReach()) {
        const d = G.TILE_DEFS[w.tileAt(Math.floor((nx + dx * len) / 16), Math.floor((p.y - 2 + dy * len) / 16))];
        if (d && d.solid && !['water', 'bay'].includes(d.k)) break;
        len += 4;
      }
      this.sprayLen = len;
      // anything the arc passes through gets wet (things without a hurt box are about 20px tall)
      const pts = [];
      for (let d = 0; d <= len; d += 4) pts.push(this.bidetArc(p, d, len));
      for (const e of w.ents) {
        if (!e.onSpray || e.dead || e === p) continue;
        let b = e.hurtBox ? e.hurtBox() : e.box();
        if (!e.hurtBox) b = [b[0], b[1] - 20, b[2], b[3]];
        if (pts.some(([x, y]) => x >= b[0] && x <= b[2] && y >= b[1] && y <= b[3])) e.onSpray(p);
      }
      const [ex, ey] = pts[pts.length - 1];
      if (G.tick % 3 === 0) w.burst(ex, ey, ['#a8d8ff', '#ffffff'], 1, { speed: 0.6, up: 0.6, g: 0.1, life: 12, size: 1 });
      if (G.bidetWater() <= 0) { this.spraying = false; this.bidetEmpty(); }
    },
    bidetEmpty() {
      const p = this.player;
      this.world.pop(p.x, p.y - 30, this.world.def.water ? 'EMPTY! Get to the water!' : 'EMPTY!', '#a8d8ff');
      if (!G.state.flags.bidetEmptyHint) { G.state.flags.bidetEmptyHint = true; G.script.run(G.SCRIPTS.bidetEmpty()); }
    },

    addTeeth(n) {
      const s = G.state, skipped = moveTeeth(s, n);
      if (n > 0) s.stats.teethEarned = (s.stats.teethEarned || 0) + n;
      // the joke about it only ever plays once on this device (not again for every new game or admin start)
      if (skipped && !s.flags.skipNote) {
        s.flags.skipNote = true;
        let seen = false;
        try { seen = localStorage.getItem('ditch-skipNote') === '1'; localStorage.setItem('ditch-skipNote', '1'); } catch (e) { /* no storage: just show it */ }
        if (!seen) G.script.run(G.SCRIPTS.skipNote());
      }
    },

    maybeDrop(x, y, chance) {
      if (G.state.rush || Math.random() > chance) return;
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
      G.areaBanner.update(); G.regionCard.update();
      // speech bubbles tick along while Nate keeps playing (they wait out cutscenes and the menu)
      if (this.bubbles && this.bubbles.length && !G.script.busy && !this.menu) { const b = this.bubbles[0]; if (++b.t >= b.dur) this.bubbles.shift(); }
      if (this.shakeT > 0) this.shakeT--;

      // fainting: a dizzy spin, a wobble, then he tips over (Player.drawFaint), the stars
      // come out, and the screen fades to the fainted screen
      if (this.dying) {
        const d = ++this.dying;
        if (d < 36 && d % 6 === 0) this.player.dir = ['down', 'left', 'up', 'right'][(d / 6) % 4];
        if (d === 36) this.player.dir = 'down';
        if (d === FAINT_LAND) { G.audio.sfx('bump'); this.shake(8, 2); }
        if (d > 96) G.fade = Math.min(1, (d - 96) / 24);
        if (d > 122) { if (G.state.rush) G.rushEnd.enter(false); else G.gameOver.enter(); }
        return;
      }

      G.state.playTime = (G.state.playTime || 0) + 1;
      if (G.tick % 30 === 0 && !G.script.busy && !this.warping && !G.state.rush && G.postgameTick) G.postgameTick();
      if (G.tick % 30 === 15 && !G.script.busy && !this.warping && !this.menu && !G.state.rush) G.questWatch();
      if (this.eggCool > 0) this.eggCool--;
      if (this.siftCool > 0) this.siftCool--;
      if (this.rodCool > 0) this.rodCool--;
      if (this.earworm > 0 && !G.script.busy) this.earworm--;
      if (this.whiteout > 0) this.whiteout -= 0.03;
      // Hannah (a nurse) patches Nate up when he's low
      if (G.hannahTick && !G.script.busy && !this.warping && !this.menu) G.hannahTick();
      // (thrown in the water by Abe: dripping for a while)
      if (G.soakTick && !this.menu) G.soakTick();

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
      // remember every enemy and boss Nate has run into (the manual's ENEMIES and BOSSES pages)
      if (G.tick % 15 === 0) this.noteSeen();
      this.bidetTick();
      this.refillTick();

      // remember Nate's footsteps for the party to follow
      const pl = this.player, t0 = this.trail[0];
      if (pl.x !== t0.x || pl.y !== t0.y) {
        // (and how far he's walked, for the STATS page: a step is 8 pixels, warps don't count)
        const d = Math.hypot(pl.x - t0.x, pl.y - t0.y);
        if (d < 6 && !G.state.rush) G.state.stats.walked = (G.state.stats.walked || 0) + d;
        this.trail.unshift({ x: pl.x, y: pl.y, dir: pl.dir });
        if (this.trail.length > 90) this.trail.pop();
      }
      // achievements: checked a couple of times a second
      if (G.tick % 30 === 7 && G.checkAchievements) G.checkAchievements();

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
      // clouds, leaves, sparkles, softer light (content.js)
      if (G.ambience) G.ambience(ctx, this.world, cam);
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
      if (this.bubbles && this.bubbles.length && !G.script.busy && !this.menu) this.drawBubble(ctx, this.bubbles[0]);
      G.pipe.draw(ctx);
      // (noBar: a boss whose fight hasn't started yet, so it stays a surprise)
      const boss = this.world.ents.find((e) => e.boss && e.state !== 'defeated' && !e.noBar && !e.hidden);
      if (boss) G.hud.bossBar(ctx, boss);
      if (!this.menu) G.toasts.draw(ctx, !!boss);
      if (!this.menu && !boss && !this.overlay) G.menuLessonCard(ctx);
      G.areaBanner.draw(ctx); G.regionCard.draw(ctx);
      // a full-screen minigame (Dad's pipe bench) stays up between its steps, under the dialogue
      if (this.overlay) this.overlay.draw(ctx);
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
      // (Manual: the instruction booklet, src/manual.js)
      // (New Game+ shows up once any file has cleared the Boss Rush: it has the golden hammer)
      const ngReady = [1, 2, 3].some((n) => { const sv = G.readSave(n); return sv && sv.items && sv.items.goldHammer && !sv.admin; });
      this.opts = (G.hasSave() ? ['Continue', 'Load File', 'New Game'] : ['New Game']).concat(ngReady ? ['New Game+'] : [], 'Admin', 'Manual');
      // which landmarks drift by: the places the latest save has been to
      const v = ((G.hasSave() && G.readSave(G.latestSave())) || {}).visited || {};
      this.reached = [['campus'], ['fair'], ['home'], ['cbbtToll', 'cbbt'], ['chkd'], ['ditchFinal', 'ditchDay']]
        .map((maps, i) => (maps.some((m) => v[m]) ? i : -1)).filter((i) => i >= 0);
      G.audio.setMix(null); G.audio.play('title');
    },
    update() {
      this.t++;
      const inp = G.input;
      // (up goes up and down goes down, wrapping around)
      if (inp.hit('up') || inp.hit('down')) { this.sel = (this.sel + (inp.hit('up') ? this.opts.length - 1 : 1)) % this.opts.length; G.audio.sfx('menu'); }
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
        } else if (opt === 'Manual') {
          G.manual.enter(this);
        } else if (opt === 'New Game+') {
          G.files.enter('new', true);
        } else if (G.hasSave()) {
          G.files.enter('new');
        } else {
          G.files.start(1);
        }
      }
    },
    draw(ctx) {
      // the road trip, rolling past: Nate walking, the places he'll go drifting by in the distance
      this.drawScene(ctx);
      // logo, with a shine that sweeps across it now and then
      this.drawLogo(ctx);
      // Father Eggmas, standing in the grass by the road, waiting
      const eg = G.spr.eggmas;
      ctx.drawImage(eg, 206, 92 + 31 - eg.height);
      // menu
      // (five or six options: the rows close up a little so the box still clears the logo and the bottom)
      const n = this.opts.length, rh = n > 4 ? 11 : 12, w = 84, h = n * rh + 8, x = Math.round((G.W - w) / 2), y = n > 5 ? 80 : n > 4 ? 90 : n > 3 ? 100 : n > 2 ? 108 : 114;
      G.box(ctx, x, y, w, h);
      this.opts.forEach((o, i) => {
        F().draw(ctx, o, x + 18, y + 5 + i * rh, i === this.sel ? '#f8d850' : o === 'Admin' ? '#9890a8' : '#f8f8f0', { shadow: '#0c0814' });
      });
      const cy = y + 6 + this.sel * rh, b = (this.t >> 3) & 1;
      ctx.fillStyle = '#f8d850';
      ctx.fillRect(x + 8 + b, cy, 1, 5); ctx.fillRect(x + 9 + b, cy + 1, 1, 3); ctx.fillRect(x + 10 + b, cy + 2, 1, 1);
      F().draw(ctx, 'Z: select', 4, G.H - 10, '#ffffff', { shadow: '#1c1424' });
      // (which version this is: handy when somebody reports a bug)
      if (G.version) F().draw(ctx, G.version, G.W - 4 - F().width(G.version), G.H - 10, '#c8c0d8', { shadow: '#1c1424' });
    },

    // ---- the scrolling landscape (each layer slower the farther away it is)
    layers() {
      if (this._layers) return this._layers;
      const hills = G.canvas(480, 40), hx = hills.getContext('2d');
      hx.fillStyle = '#7a96c0';
      for (let x = 0; x < 480; x++) { const h = 14 + Math.round(Math.sin(x / 38) * 6 + Math.sin(x / 13 + 1) * 3 + Math.sin(x / 76) * 5); hx.fillRect(x, 40 - h, 1, h); }
      const trees = G.canvas(480, 26), tx = trees.getContext('2d');
      for (let i = 0; i < 24; i++) {
        const x = i * 20 + (i * 7) % 9, r = 7 + (i * 5) % 4;
        tx.fillStyle = '#2f6a3e'; tx.beginPath(); tx.arc(x, 26 - r, r, 0, Math.PI * 2); tx.fill();
        tx.fillStyle = '#3f8a4e'; tx.beginPath(); tx.arc(x - 2, 24 - r, r - 3, 0, Math.PI * 2); tx.fill();
      }
      tx.fillStyle = '#2f6a3e'; tx.fillRect(0, 20, 480, 6);
      return (this._layers = { hills, trees });
    },
    drawScene(ctx) {
      const t = this.t, L = this.layers(), HZ = 92;
      // sky, morning
      const sky = ctx.createLinearGradient(0, 0, 0, HZ);
      sky.addColorStop(0, '#4a78c8'); sky.addColorStop(0.65, '#8ab4e0'); sky.addColorStop(1, '#f8d8a8');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, G.W, HZ + 6);
      // clouds, drifting
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      for (let i = 0; i < 4; i++) {
        const x = ((i * 83 + t * (0.06 + i * 0.015)) % 300) - 40, y = 14 + i * 13 + (i % 2) * 4;
        ctx.fillRect(Math.round(x), y, 22, 4); ctx.fillRect(Math.round(x) + 4, y - 3, 12, 3); ctx.fillRect(Math.round(x) + 14, y - 2, 6, 2);
      }
      // far hills
      const hp = Math.floor(t * 0.15) % 480;
      ctx.drawImage(L.hills, -hp, HZ - 34); ctx.drawImage(L.hills, 480 - hp, HZ - 34);
      // (the hills carry on down behind the trees, so there's never a gap between them)
      ctx.fillStyle = '#7a96c0'; ctx.fillRect(0, HZ + 6, G.W, 16);
      // the places on the trip Nate has been to so far, in the haze (Lafayette, the fair, home, the
      // bay, CHKD, the Ditch), planted behind the trees so their feet are hidden
      const seen = this.reached || [], lp = t * 0.25, gap = 150, cyc = gap * Math.max(3, seen.length);
      seen.forEach((id, k) => {
        const x = ((k * gap + 40 - lp) % cyc + cyc) % cyc - 40;
        if (x <= G.W + 40) this.landmark(ctx, id, Math.round(x), HZ + 14);
      });
      // trees
      const tp = Math.floor(t * 0.5) % 480;
      ctx.drawImage(L.trees, -tp, HZ - 6); ctx.drawImage(L.trees, 480 - tp, HZ - 6);
      // grass and the road
      ctx.fillStyle = '#5aa850'; ctx.fillRect(0, HZ + 20, G.W, G.H - HZ - 20);
      ctx.fillStyle = '#6ab85e'; for (let i = 0; i < 30; i++) { const x = ((i * 37 - t) % 260 + 260) % 260 - 10; ctx.fillRect(Math.round(x), HZ + 24 + (i * 11) % 8, 2, 1); }
      ctx.fillStyle = '#5a5a66'; ctx.fillRect(0, HZ + 32, G.W, 22);
      ctx.fillStyle = '#4a4a56'; ctx.fillRect(0, HZ + 32, G.W, 1); ctx.fillRect(0, HZ + 53, G.W, 1);
      ctx.fillStyle = '#f8e070'; for (let x = -((t * 1) % 24); x < G.W; x += 24) ctx.fillRect(Math.round(x), HZ + 42, 12, 2);
      // Nate, walking
      const S = G.sprites.nate.right, fr = [1, 0, 2, 0][Math.floor(t / 8) % 4];
      ctx.drawImage(G.spr.shadow, 40, HZ + 47);
      ctx.drawImage(S[fr], 38, HZ + 50 - S[fr].height + 2);
    },
    landmark(ctx, i, x, y) {
      const C = '#6a84ae', D = '#5a7298', W = '#9ab4d8';
      ctx.fillStyle = C;
      if (i === 0) {        // Lafayette's clock tower
        ctx.fillRect(x - 4, y - 30, 8, 30); ctx.fillRect(x - 12, y - 12, 24, 12);
        ctx.beginPath(); ctx.moveTo(x - 5, y - 30); ctx.lineTo(x, y - 38); ctx.lineTo(x + 5, y - 30); ctx.fill();
        ctx.fillStyle = W; ctx.fillRect(x - 2, y - 26, 4, 4);
      } else if (i === 1) { // the fair's Ferris wheel, turning
        ctx.strokeStyle = C; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(x, y - 18, 13, 0, Math.PI * 2); ctx.stroke();
        for (let k = 0; k < 8; k++) { const a = this.t * 0.01 + (k * Math.PI) / 4; ctx.beginPath(); ctx.moveTo(x, y - 18); ctx.lineTo(x + Math.cos(a) * 13, y - 18 + Math.sin(a) * 13); ctx.stroke(); ctx.fillRect(Math.round(x + Math.cos(a) * 13) - 1, Math.round(y - 18 + Math.sin(a) * 13), 3, 2); }
        ctx.fillRect(x - 6, y - 6, 2, 6); ctx.fillRect(x + 4, y - 6, 2, 6);
      } else if (i === 2) { // home
        ctx.fillRect(x - 14, y - 12, 28, 12);
        ctx.beginPath(); ctx.moveTo(x - 17, y - 12); ctx.lineTo(x, y - 22); ctx.lineTo(x + 17, y - 12); ctx.fill();
        ctx.fillRect(x + 8, y - 24, 3, 6);
        ctx.fillStyle = W; ctx.fillRect(x - 9, y - 9, 3, 3); ctx.fillRect(x + 6, y - 9, 3, 3); ctx.fillStyle = D; ctx.fillRect(x - 1, y - 7, 3, 7);
      } else if (i === 3) { // the Bridge-Tunnel
        ctx.fillRect(x - 40, y - 22, 70, 2);
        for (let k = -36; k < 30; k += 10) ctx.fillRect(x + k, y - 20, 2, 20);
        ctx.fillRect(x + 28, y - 28, 16, 28); ctx.fillStyle = D; ctx.fillRect(x + 32, y - 22, 8, 22);
      } else if (i === 4) { // CHKD
        ctx.fillRect(x - 16, y - 24, 32, 24); ctx.fillRect(x - 6, y - 30, 12, 6);
        ctx.fillStyle = W; for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) ctx.fillRect(x - 13 + c * 6, y - 21 + r * 6, 3, 3);
        ctx.fillStyle = '#d87878'; ctx.fillRect(x - 1, y - 29, 2, 4); ctx.fillRect(x - 2, y - 28, 4, 2);
      } else {              // the No.1 Ditch sign
        ctx.fillRect(x - 1, y - 34, 2, 34);
        ctx.fillStyle = '#3a8a5a'; ctx.fillRect(x - 13, y - 42, 26, 10);
        F().draw(ctx, 'No.1', x - 10, y - 41, '#f4f4f0');
      }
    },
    drawLogo(ctx) {
      if (!this._logo) {
        const c = G.canvas(G.W, 72), x = c.getContext('2d');
        const small = 'JOURNEY TO THE';
        F().draw(x, small, Math.round((G.W - F().width(small)) / 2), 4, '#ffffff', { shadow: '#1c1424' });
        const grad = (row) => ['#fff4b0', '#ffe070', '#ffd040', '#ffb830', '#ff9a28', '#f07820', '#e05818', '#c84818', '#a83810'][row] || '#a83810';
        const l1 = 'NUMBER ONE';
        F().drawBig(x, l1, Math.round((G.W - F().bigWidth(l1, 2)) / 2), 16, 2, grad, '#2a1420');
        this._logo = c;
        const d = G.canvas(G.W, 40), dx = d.getContext('2d'), l2 = 'DITCH';
        F().drawBig(dx, l2, Math.round((G.W - F().bigWidth(l2, 3)) / 2), 2, 3, grad, '#2a1420');
        this._logo2 = d;
        this._shine = G.canvas(G.W, 72);
      }
      const bob = Math.round(Math.sin(this.t / 30) * 1.5);
      // the shine: a bright diagonal band, only where the letters are
      const k = this.t % 260, sx = -40 + k * 7;
      const sh = this._shine, s = sh.getContext('2d');
      s.clearRect(0, 0, G.W, 72);
      s.globalCompositeOperation = 'source-over';
      s.drawImage(this._logo, 0, 0); s.drawImage(this._logo2, 0, 40 + bob);
      if (k < 45) {
        s.globalCompositeOperation = 'source-atop';
        s.fillStyle = 'rgba(255,255,240,0.7)';
        s.beginPath(); s.moveTo(sx, 0); s.lineTo(sx + 10, 0); s.lineTo(sx - 20, 72); s.lineTo(sx - 30, 72); s.fill();
        s.globalCompositeOperation = 'source-over';
      }
      ctx.drawImage(sh, 0, 6);
    },
  };

  // ================================================================ ADMIN MODE (testing)
  // Start any story checkpoint (see G.ADMIN_CHECKPOINTS in content.js).
  G.adminStart = (i) => {
    const cps = G.ADMIN_CHECKPOINTS, s = newState();
    G.adminSnap = null;
    s.admin = true;
    s.adminCp = i;
    s.teeth = 100;
    for (let j = 0; j <= i; j++) {
      const c = cps[j];
      // (a side checkpoint, alone: true, only counts when it's the one you picked)
      if (c.alone && j !== i) continue;
      Object.assign(s.flags, c.flags || {});
      Object.assign(s.items, c.items || {});
      for (const id of c.party || []) if (!s.party.includes(id)) s.party.push(id);
      if (c.follower !== undefined) s.follower = c.follower;
      if (c.maxHp) s.maxHp = c.maxHp;
      if (c.teeth) s.teeth = c.teeth;
      if (c.jams) s.jams = Object.assign(s.jams || {}, c.jams);
      if (c.rocks) { s.rocks = s.rocks || {}; s.rocksFound = s.rocksFound || {}; for (const r of G.ROCKS) { s.rocks[r.id] = 1; s.rocksFound[r.id] = 1; } }
    }
    const c = cps[i];
    Object.assign(s, { map: c.map, x: c.at[0] * 16 + 8, y: c.at[1] * 16 + 14, dir: c.at[2] });
    s.hp = s.maxHp;
    G.script.reset();
    G.state = s;
    // (a checkpoint that starts out with gear already knows the menu: no menu lesson)
    if (G.menuLesson && G.menuLesson()) s.flags.menuTaught = true;
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
    enter(mode, ng) {
      G.scene = this;
      G.fade = 0;
      this.mode = mode;
      this.ng = !!ng;
      this.sel = 0;
      this.t = 0;
      this.confirm = false;
      this.saves = [1, 2, 3].map((n) => G.readSave(n));
      if (mode === 'load') this.sel = Math.max(0, G.latestSave() - 1);
      else { const empty = this.saves.findIndex((s) => !s); this.sel = empty < 0 ? 0 : empty; }
    },
    // a brand-new game in file n (New Game+: the golden hammer comes along, and it's tougher)
    start(n) {
      G.audio.sfx('select');
      G.state = newState();
      if (this.ng) { G.state.flags.ngPlus = true; G.state.items.goldHammer = true; }
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
      const title = this.mode === 'load' ? 'LOAD A FILE' : this.ng ? 'NEW GAME+: PICK A FILE' : 'NEW GAME: PICK A FILE';
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
      { pic: 'ditch', text: 'The {y}NUMBER ONE DITCH{/}. The map says so. The best ditch in the whole world.' },
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
      G.audio.setMix(null); G.audio.play('title');
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
  // what each party member says to get Nate back up (the user's approved lines)
  const FAINT_LINES = {
    doron: 'Get up, or I\'m lifting you. I lift boulders, Nate.',
    lily: 'Nate. Get up. You\'re embarrassing me.',
    abe: 'You good? Blink twice if you said the number.',
    hannah: 'Deep breath. You\'re okay. Nurse\'s orders: up you get.',
  };
  // Fainting at the Number One Ditch (the finale): whoever went down, Nate cheers them back up
  // (and if it was Nate, he talks himself back up)
  const FIN_FAINT = {
    nate: 'Not yet. Not at the Number One Ditch. Get UP, Nate.',
    doron: 'Doron! Get up! You lift boulders. You can lift you.',
    dad: 'Dad! Get up! You carved that pipe yourself. Show him what it can do.',
    lily: 'Lily! Get up! You\'ve still got a whole stack of catalogs.',
    michelle: 'Mom! Get up! Henrietta still believes in you.',
    abe: 'Abe! Get up! He\'s floating. Nobody else can reach him.',
    romulus: 'Romulus! Buddy! Up! Who\'s a good boy? YOU are!',
    hannah: 'Hannah! You\'re a NICU nurse! You\'re not scared of a cranky little egg!',
  };
  const FIN_FAINT_NAME = { nate: 'Nate', doron: 'Doron', dad: 'Dad', lily: 'Lily', michelle: 'Mom', abe: 'Abe', romulus: 'Romulus', hannah: 'Hannah' };
  const atDitch = () => !!(G.play && G.play.world && G.play.world.def === G.MAPS.ditchFinal && !G.state.flags.fin_done);
  G.gameOver = {
    // who fainted (on the screen it says "<name> fainted...")
    fainter() {
      const id = G.state.playAs || 'nate';
      if (atDitch()) return FIN_FAINT_NAME[id] || 'Nate';
      return id === 'lily' ? 'Lily' : 'Nate';
    },
    // who's there when he comes to: at the Ditch, Nate cheering on whoever went down; Nate for Lily;
    // whoever was following Nate when he went down; or (nobody behind him) just Nate
    speakers(lily) {
      const s = G.state, nate = G.sprites[s.items.cap ? 'nate' : 'nate_nocap'].down[0];
      if (atDitch()) return [{ who: 'Nate', msg: FIN_FAINT[s.playAs || 'nate'] || FIN_FAINT.nate, face: nate }];
      if (lily) return [{ who: 'Nate', msg: 'Get up, Lily. Mikey is still singing.', face: nate }];
      const id = G.activeFollower();
      if (id && FAINT_LINES[id] && G.sprites[id]) return [{ who: G.PARTY_INFO[id].name, msg: FAINT_LINES[id], face: G.sprites[id].down[0] }];
      return [{ who: 'Nate', msg: '...Five more minutes.', face: nate }];
    },
    enter() {
      G.scene = this;
      G.fade = 0;
      this.t = 0;
      this.sel = 0;
      G.script.reset();
      // fainting drops 15% of Nate's shark teeth: taken out of the save he'll continue from
      // (an admin run's save is the copy it keeps in memory)
      const cur = G.state, saved = cur.admin ? G.adminSnap : G.loadSave(cur.slot);
      this.lost = Math.floor(((saved || cur).teeth || 0) * FAINT_COST);
      if (saved) {
        if (this.lost) moveTeeth(saved, -this.lost);
        // the counters, the enemies met and the achievements earned since the last save aren't lost
        // with the faint (and the faint itself counts)
        saved.stats = saved.stats || {};
        for (const k in cur.stats || {}) if (typeof cur.stats[k] === 'number') saved.stats[k] = Math.max(saved.stats[k] || 0, cur.stats[k]);
        saved.stats.faints = (saved.stats.faints || 0) + 1;
        if (cur.seen) saved.seen = Object.assign({}, saved.seen || {}, cur.seen);
        if (cur.achieved) saved.achieved = Object.assign({}, saved.achieved || {}, cur.achieved);
        if (!cur.admin) { G.state = saved; G.writeSave(saved.slot || cur.slot); G.state = cur; }
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
          // admin runs pick up from the last door walked through (or the checkpoint, if none yet)
          if (G.state.admin) {
            if (!G.adminSnap) { G.adminStart(G.state.adminCp || 0); return; }
            G.state = JSON.parse(JSON.stringify(G.adminSnap));
            G.state.hp = G.state.maxHp;
            G.play.enter(false);
            return;
          }
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
      const t1 = this.fainter() + ' fainted...';
      F().drawBig(ctx, t1, Math.round((G.W - F().bigWidth(t1, 2)) / 2), 72, 2, (r) => (r < 2 ? '#ffb0a8' : r < 4 ? '#f86858' : '#c83848'), '#1c1424');
      if (this.t < 60) return;
      // whoever was behind Nate gets him back up, with their face in a little frame (alone, he
      // manages it himself)
      const k = Math.min(1, (this.t - 60) / 10), say = this.speakers(lily);
      let tt = this.t - 60, cur = say[0];
      for (let n = 0; ; n = (n + 1) % say.length) { const d = 70 + say[n].msg.length / 0.9; if (tt < d || say.length === 1) { cur = say[n]; break; } tt -= d; }
      const bw = 228, bx = 6, lines = F().wrap(cur.msg, bw - 47), bh = 16 + lines.length * 9, by = 90 + Math.round((1 - k) * 4);
      ctx.globalAlpha = k;
      G.box(ctx, bx, by, bw, bh);
      ctx.fillStyle = '#0c0814'; ctx.fillRect(bx + 5, by + 3, 28, 24);
      ctx.fillStyle = '#2a2240'; ctx.fillRect(bx + 6, by + 4, 26, 22);
      ctx.drawImage(cur.face, 2, 1, 12, 11, bx + 7, by + 4, 24, 22);
      F().draw(ctx, cur.who, bx + 38, by + 4, G.NAME_COLORS[cur.who] || '#ff98d0', { shadow: '#0c0814' });
      let left = Math.max(0, Math.floor((tt - 6) * 0.9));
      lines.forEach((l, i) => { if (left > 0) F().draw(ctx, l, bx + 38, by + 14 + i * 9, '#f8f8f0', { shadow: '#0c0814', max: left }); left -= F().visibleLength(l); });
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
  // Romulus, for when Nate plays as him (the finale): his dog frames, shaped like a person's set
  // (the player draws him as a dog; this is for anything else that asks, like fainting)
  { const R = G.spr.romulus, fr = (d) => [R[d].stand, R[d].run1, R[d].run3]; G.sprites.romulus = { right: fr('right'), left: fr('left'), down: fr('right'), up: fr('left'), h: 25, hold: R.right.happy }; }
  // Nate only wears his flat cap once Groundskeeper Gus gives it back.
  G.nateSprites = () => (G.state && G.state.playAs ? G.sprites[G.state.playAs]
    : G.state && G.state.items.cap ? G.sprites.nate : G.sprites.nate_nocap);
  for (const ph of G.PHOTOS) if (ph.gen) ph.img.src = ph.gen().toDataURL();
  G.fade = 0;
  G.state = newState();
  G.title.enter();

  // (a fixed 60 steps a second, whatever the screen's refresh rate: 120Hz screens don't run fast)
  const STEP = 1000 / 60;
  let acc = 0, last = performance.now();
  function frame(now) {
    acc += Math.min(100, now - last);
    last = now;
    if (G.paused) acc = 0;
    while (acc >= STEP) {
      G.tick++;
      if (G.input.hit('bug')) { G.input.eat('bug'); G.bugReport(); }
      if (G.input.hit('pause')) { G.input.eat('pause'); G.pause(true); acc = 0; break; }
      G.scene.update();
      G.input.endTick();
      acc -= STEP;
    }
    G.scene.draw(ctx);
    G.drawOverlays(ctx);
    if (G.paused) G.drawPaused(ctx);
    requestAnimationFrame(frame);
  }

  // ---- pausing: the game stops (and goes quiet) when its tab or window loses focus, or on P.
  // Any key or a click picks it back up (that key doesn't also do anything in the game).
  G.paused = false;
  G.pause = (on) => {
    if (G.paused === on) return;
    G.paused = on;
    G.audio.hold(on);
    for (const k of ['a', 'b', 'start', 'up', 'down', 'left', 'right']) G.input.eat(k);
  };
  addEventListener('blur', () => G.pause(true));
  document.addEventListener('visibilitychange', () => { if (document.hidden) G.pause(true); });
  addEventListener('keydown', (e) => { if (!G.paused || e.code === 'KeyM') return; e.preventDefault(); e.stopImmediatePropagation(); if (e.code !== 'KeyP' || !e.repeat) G.pause(false); }, true);
  addEventListener('pointerdown', () => { if (G.paused) G.pause(false); }, true);
  G.drawPaused = (ctx) => {
    ctx.fillStyle = 'rgba(12,8,20,0.72)'; ctx.fillRect(0, 0, G.W, G.H);
    const t = 'PAUSED', w = F().bigWidth(t, 2);
    F().drawBig(ctx, t, Math.round((G.W - w) / 2), 58, 2, (r) => (r < 2 ? '#fff0a8' : r < 4 ? '#f8d850' : '#c89838'), '#1c1424');
    const s = 'Press any key to keep going', sw = F().width(s);
    if ((performance.now() >> 9) & 1) F().draw(ctx, s, Math.round((G.W - sw) / 2), 86, '#f8f8f0', { shadow: '#1c1424' });
  };

  // ---- the version (on the title screen) and the bug report: B copies a snapshot of where things
  // stand (version, scene, map, position, the last line of dialogue, every story flag) to the
  // clipboard, to paste into a text to Abe
  G.version = (() => { const sc = [...document.scripts].find((x) => /main\.js\?v=/.test(x.src)); return sc ? 'v' + sc.src.split('?v=')[1] : 'dev'; })();
  G.notice = null;
  G.bugReport = () => {
    const s = G.state || {}, w = G.play && G.play.world, p = G.play && G.play.player, f = s.flags || {};
    const sceneName = G.scene === G.play ? 'playing' : G.scene === G.title ? 'title screen' : G.scene === G.gameOver ? 'fainted' : G.scene === G.manual ? 'manual' : 'menu';
    const last = (G.dialogLog || []).slice(-3).map((l) => (l.who ? l.who + ': ' : '') + l.text).join(' / ');
    const lines = [
      'Journey to the Number One Ditch: bug report', 'Version: ' + G.version, 'When: ' + new Date().toString(), 'Where: ' + sceneName,
      w && G.scene === G.play ? 'Map: ' + w.id + ' (' + (w.def.name || '') + ') at tile ' + Math.floor(p.x / 16) + ',' + Math.floor(p.y / 16) + ' facing ' + p.dir : null,
      'Playing as: ' + (s.playAs || 'Nate') + ' | hearts ' + s.hp + '/' + s.maxHp + ' | teeth ' + s.teeth + (s.admin ? ' | admin run' : ''),
      'In a scene: ' + (G.script && G.script.busy ? 'yes' : 'no'),
      last ? 'Last lines: ' + last : null,
      'Flags: ' + Object.keys(f).filter((k) => f[k]).sort().join(', '),
    ].filter(Boolean);
    const text = lines.join('\n');
    // (if the browser won't copy it, the report comes up in a box to copy by hand)
    const showBox = () => {
      let box = document.getElementById('bugbox');
      if (!box) {
        box = document.createElement('div'); box.id = 'bugbox';
        box.style.cssText = 'position:fixed;inset:0;z-index:90;display:flex;align-items:center;justify-content:center;background:rgba(12,8,20,.8);font:13px/1.4 ui-monospace,Menlo,monospace;color:#f0e8ff';
        box.innerHTML = '<div style="background:#2a2236;border:2px solid #5a4e70;border-radius:10px;padding:14px;width:min(560px,92vw)"><div style="margin-bottom:8px">Copy this and paste it in a text to Abe:</div><textarea style="width:100%;height:220px;box-sizing:border-box;background:#120e18;color:#f0e8ff;border:1px solid #5a4e70;border-radius:6px;padding:8px;font:inherit"></textarea><div style="text-align:right;margin-top:8px"><button style="font:inherit;padding:4px 14px;border-radius:6px;border:1px solid #5a4e70;background:#3a3048;color:#fff;cursor:pointer">Done</button></div></div>';
        box.querySelector('button').onclick = () => { box.style.display = 'none'; };
        document.body.appendChild(box);
      }
      box.style.display = 'flex';
      const ta = box.querySelector('textarea'); ta.value = text; ta.focus(); ta.select();
    };
    const done = (ok) => { G.notice = { t: 200, text: ok ? 'Bug report copied! Paste it in a text to Abe.' : 'Copy the bug report from the box.' }; G.audio.sfx(ok ? 'select' : 'bump'); if (!ok) showBox(); };
    const fallback = () => { try { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); ta.remove(); done(ok); } catch (e) { done(false); } };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => done(true), fallback); else fallback();
    G.lastBugReport = text;
  };
  // the circle wipe and the fade, over everything (the trailer rig draws these too)
  G.drawOverlays = (ctx) => {
    if (G.iris > 0) {
      // the circle wipe, centered on Nate (or the middle of the screen, off the map)
      const pl = G.scene === G.play && G.play.player, cam = G.play.cam;
      const cx = pl ? Math.round(pl.x - cam.x) : G.W / 2, cy = pl ? Math.round(pl.y - 10 - cam.y) : G.H / 2;
      const far = Math.hypot(Math.max(cx, G.W - cx), Math.max(cy, G.H - cy)) + 4;
      const k = G.iris, r = k >= 1 ? 0 : far * (1 - k) * (1 - k * 0.15);
      ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.rect(0, 0, G.W, G.H);
      if (r > 0) ctx.arc(cx, cy, r, 0, Math.PI * 2, true);
      ctx.fill('evenodd');
    }
    if (G.fade > 0) {
      ctx.fillStyle = `rgba(0,0,0,${G.fade})`;
      ctx.fillRect(0, 0, G.W, G.H);
    }
    // a little message along the top (the bug report)
    if (G.notice && G.notice.t > 0) {
      const n = G.notice, a = Math.min(1, n.t / 20), w = F().width(n.text) + 12;
      ctx.globalAlpha = a;
      ctx.fillStyle = '#1e1830'; ctx.fillRect(Math.round((G.W - w) / 2), 3, w, 13);
      ctx.fillStyle = '#f8d850'; ctx.fillRect(Math.round((G.W - w) / 2), 15, w, 1);
      F().draw(ctx, n.text, Math.round((G.W - w) / 2) + 6, 6, '#f8f8f0', { shadow: '#0c0814' });
      ctx.globalAlpha = 1;
      if (!G.paused) n.t--;
    }
  };
  requestAnimationFrame(frame);

  // Handy for testing from the console.
  G.debug = { newState };
})();
