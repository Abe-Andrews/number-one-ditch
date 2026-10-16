'use strict';
// Story content: cast, items, music, maps and scripts.

(function () {
  // ================================================================ CAST
  // Each person is a config for the sprite generator in art.js.
  G.CAST = {
    // Flat cap, auburn hair, plaid flannel, jeans, Red Wing Iron Rangers.
    nate: {
      skin: '#f4c8aa', hair: '#9a4a28', hairStyle: 'swoop', blush: true,
      hat: '#86683e', hatStyle: 'flat',
      shirt: '#66705a', pattern: 'plaid', plaidL: '#98a288', plaidW: '#d8dccc', sleeves: 'long', neck: '#1c1c22',
      pants: '#4a6aa8', shoes: '#9a5226', boots: true,
      torso: 6, legs: 4,
    },
    // Long wavy copper hair, white sundress.
    lily: {
      skin: '#f8d4c0', hair: '#c8582c', hairStyle: 'wavy', blush: true, smile: '#ffffff',
      shirt: '#f6f2ea', dress: '#f6f2ea', neckline: true, necklace: '#e8c060', sleeves: 0,
      shoes: '#c89878', torso: 5, legs: 3,
    },
    // 6'5": tan cap, charcoal pocket tee, black shorts, backpack.
    abe: {
      skin: '#f2c8a8', hair: '#8a6440', hairStyle: 'cap',
      hat: '#d4ae74', hatStyle: 'ball', patch: '#e08830',
      shirt: '#3c3c42', pants: '#1e1e24', shorts: true, shoes: '#2a2a30', straps: '#3a4c74',
      wide: true, torso: 8, legs: 6,
    },
    // 5'2": hooded cloak, floral bodice, cream skirt.
    hannah: {
      skin: '#f4d0b8', hair: '#c8a46c', hairStyle: 'shoulder', blush: true,
      shirt: '#2c3848', pattern: 'floral', dress: '#d8d2a8', cloak: '#7c7658', hood: '#7c7658',
      belt: '#1c1c20', beltStrap: true, shoes: '#202020', torso: 5, legs: 2,
    },
    // 6'2", army, fitness: gray polo, earring.
    doron: {
      skin: '#5c3626', eyes: '#100808', hair: '#141014', hairStyle: 'buzz',
      shirt: '#7e8084', collar: '#f0f0f0', pants: '#2a2c38', shoes: '#202024', earring: '#e0e0e8',
      wide: true, torso: 7, legs: 4,
    },
    // Christian: round glasses, beard, cream blazer.
    dad: {
      skin: '#f0c0a0', hair: '#a88458', hairStyle: 'receding', beard: '#a08262', glasses: '#4a4248', smile: '#ffffff',
      coat: '#ece4d0', shirt: '#283044', pants: '#4a4a58', shoes: '#4a3020',
      wide: true, torso: 7, legs: 4,
    },
    // Placeholders until reference photos arrive.
    tyler: {
      skin: '#e8b890', hair: '#e0c070', hairStyle: 'cap', hat: '#3a7ab0', hatStyle: 'ball',
      shirt: '#f0d040', pants: '#c8a878', shorts: true, shoes: '#606060', torso: 7, legs: 4,
    },
    mikey: {
      skin: '#f4d0b0', hair: '#5a3a20', hairStyle: 'short', glasses: '#3a3a40',
      shirt: '#d8e0f0', collar: '#ffffff', pants: '#5a5a6a', shoes: '#202020', torso: 6, legs: 3,
    },
    // Campus NPCs
    devin: { skin: '#b07850', hair: '#1c1418', hairStyle: 'short', shirt: '#8a2034', pants: '#3a4258', shoes: '#e8e8e8', torso: 6, legs: 3 },
    prof: {
      skin: '#f0c8a8', hair: '#d8d8e0', hairStyle: 'receding', beard: '#d8d8e0', glasses: '#2a2a30',
      coat: '#7a5a3a', shirt: '#e8e0c8', pants: '#4a4038', shoes: '#3a2818', torso: 7, legs: 3,
    },
    vendor: {
      skin: '#e0aa80', hair: '#3a2418', hairStyle: 'cap', hat: '#ffffff', hatStyle: 'ball', smile: '#ffffff',
      shirt: '#f8f8f8', pants: '#5878b8', shoes: '#303030', torso: 7, legs: 3,
    },
    maya: { skin: '#d8a078', hair: '#2a1a14', hairStyle: 'long', shirt: '#8a2034', pants: '#384058', shoes: '#f0f0f0', torso: 5, legs: 3 },
    jordan: { skin: '#f2c8a0', hair: '#e0c070', hairStyle: 'short', glasses: '#202020', shirt: '#5a8a5a', pants: '#2a2a30', shoes: '#a03030', torso: 6, legs: 3 },
  };

  // ================================================================ ITEMS
  G.ITEMS = {
    hammer: { name: 'Rock Hammer', icon: () => G.spr.hammer.up, desc: 'A geologist\'s best friend. Swing it with Z.' },
    doosh: { name: 'Doosh De Luche', icon: () => G.spr.doosh, desc: 'Heals 4 hearts. (It\'s pronounced dulce de leche.)', equip: true },
    fireworks: { name: 'Fireworks', icon: () => null, desc: '' },
    bidet: { name: 'Portable Bidet', icon: () => null, desc: '' },
    mystery: { name: '???', icon: () => null, desc: '' },
  };
  G.ITEM_SLOTS = ['hammer', 'doosh', 'fireworks', 'bidet', 'mystery'];

  // ================================================================ MUSIC (original tunes)
  G.SONGS = {
    title: {
      bpm: 92,
      tracks: [
        { wave: 'square', vol: 0.07, notes: 'G4:4 C5:4 E5:6 D5:2 | C5:4 A4:4 G4:8 | A4:4 C5:4 F5:6 E5:2 | D5:12 R:4 | G4:4 C5:4 E5:6 G5:2 | A5:4 G5:4 E5:8 | F5:4 E5:4 D5:4 B4:4 | C5:12 R:4' },
        { wave: 'triangle', vol: 0.16, notes: 'C3:8 G2:8 | A2:8 E2:8 | F2:8 C3:8 | G2:8 G2:8 | C3:8 E3:8 | F3:8 C3:8 | D3:8 G2:8 | C3:8 C3:8' },
      ],
    },
    field: {
      bpm: 132,
      tracks: [
        { wave: 'square', vol: 0.06, notes: 'E4:2 G4:2 C5:4 B4:2 G4:2 E4:4 | F4:2 A4:2 D5:4 C5:2 A4:2 F4:4 | E4:2 G4:2 C5:2 D5:2 E5:4 D5:2 C5:2 | B4:2 G4:2 A4:2 B4:2 C5:8 | A4:2 C5:2 A4:4 G4:2 E4:2 C4:4 | F4:2 G4:2 A4:4 G4:4 R:4 | E4:2 F4:2 G4:2 E4:2 D4:4 C4:2 D4:2 | E4:4 D4:4 C4:8' },
        { wave: 'triangle', vol: 0.15, notes: 'C3:4 G3:4 C3:4 G3:4 | F2:4 C3:4 F2:4 C3:4 | C3:4 G3:4 E3:4 G3:4 | G2:4 D3:4 G2:4 B2:4 | A2:4 E3:4 A2:4 E3:4 | F2:4 C3:4 F2:4 C3:4 | C3:4 G2:4 F2:4 G2:4 | C3:4 G2:4 C3:8' },
        { wave: 'noise', vol: 0.05, notes: 'k:4 h:4 s:4 h:4 | k:4 h:4 s:4 h:4 | k:4 h:4 s:4 h:4 | k:4 h:4 s:4 h:2 h:2 | k:4 h:4 s:4 h:4 | k:4 h:4 s:4 h:4 | k:4 h:4 s:4 h:4 | k:4 h:4 s:2 s:2 s:4' },
      ],
    },
    house: {
      bpm: 100,
      tracks: [
        { wave: 'square', vol: 0.05, notes: 'C5:4 E5:4 D5:4 B4:4 | A4:4 C5:4 G4:8 | F4:4 A4:4 C5:4 E5:4 | D5:16 | C5:4 E5:4 G5:4 E5:4 | F5:4 D5:4 B4:8 | C5:4 A4:4 F4:4 G4:4 | C5:16' },
        { wave: 'triangle', vol: 0.15, notes: 'C3:8 G2:8 | F2:8 C3:8 | F2:8 A2:8 | G2:16 | C3:8 E3:8 | D3:8 G2:8 | F2:8 G2:8 | C3:16' },
      ],
    },
  };

  // ================================================================ SCRIPTS
  const S = G.SCRIPTS = {};
  const P = () => G.play.player;
  const flags = () => G.state.flags;

  // Saying the sacred number costs half a heart (never the last one).
  function* slip() {
    G.audio.sfx('slip');
    yield G.shakeCmd(30, 3);
    G.state.stats.slips++;
    G.state.hp = Math.max(1, G.state.hp - 1);
    yield G.banner('THE SACRED NUMBER WAS SPOKEN', 'Slips so far: ' + G.state.stats.slips, 150);
  }
  S.slip = slip;

  // Bump the player back and explain why.
  S.notYet = function* (msg) {
    const p = P();
    yield G.say('Nate', msg);
    yield G.walkTo(p, p.x, p.y - 14, 1);
  };

  S.skipNote = function* () {
    yield G.say(null, 'Your shark tooth count skipped right over the {r}sacred number{/}.');
    yield G.say(null, '{o}Abe\'s Rule #1{/}: Nate may not say the sacred number. Not even on the HUD.');
  };

  // ---------------------------------------------------------------- lab
  S.labIntro = function* () {
    yield G.wait(50);
    yield G.say('Nate', 'Two more drops of base... and...');
    yield G.say('Nate', 'Perfectly neutral. A pH of exactly 7. Beautiful.');
    yield G.wait(20);
    G.audio.sfx('buzz');
    yield G.shakeCmd(12, 1);
    yield G.wait(30);
    G.audio.sfx('buzz');
    yield G.emote(P(), 'bang', 40);
    yield G.say(null, 'Bzzt! Bzzt! Nate\'s phone is going crazy over on the {y}desk{/}.');
    flags().phoneBuzz = true;
  };

  S.phone = function* () {
    const f = flags();
    if (f.readChat) {
      yield G.say(null, 'The family group chat. 147 unread messages. Most of them are Nani sending inspirational messages.');
      return;
    }
    yield G.say(null, '{c}~ FAMILY GROUP CHAT ~{/}');
    yield G.text('Lily', 'NATE');
    yield G.text('Lily', 'nate nate nate nate nate');
    yield G.text('Lily', 'FATHER EGGMAS IS GONE. his shelf is EMPTY');
    yield G.text('Abe', 'it wasnt me this time');
    yield G.text('Hannah', 'it was literally always you');
    yield G.text('Lily', 'he left a note. it says "THE NUMBER ONE DITCH SHALL BE MINE. HO HO HO."');
    yield G.say('Nate', 'Not the Number One Ditch!! It\'s the best ditch in the WORLD!');
    yield G.text('Doron', 'Nobody touches that ditch. I\'m mobilizing.');
    yield G.text('Dad', 'What is this group chat. Do you all speak EEENGLISH?');
    yield G.text('Lily', 'dad no');
    yield G.text('Abe', 'nate ur closest. head south toward chesapeake. we\'ll meet up with u on the way');
    yield G.text('Abe', 'and remember the rule');
    yield G.say('Nate', '...Which rule?');
    yield G.text('Abe', 'u know which number u cant say');
    yield G.say('Nate', 'I\'m not going to say it, Abe.');
    yield G.text('Abe', 'ok quick question. how many legs does an insect have?');
    const c = yield G.ask('Nate', 'How many legs does an insect have...', ['Six!', 'More than five.', 'Not answering that.']);
    if (c === 0) {
      yield* slip();
      yield G.text('Abe', 'GOT HIM');
      yield G.text('Lily', 'LMAOOOOO');
      yield G.text('Hannah', 'every single time');
      yield G.say('Nate', '...That\'s unfair. That was a SCIENCE question.');
    } else if (c === 1) {
      yield G.text('Abe', '...he\'s learning');
      yield G.text('Hannah', 'proud of u nate');
    } else {
      yield G.text('Abe', 'coward');
    }
    yield G.text('Lily', 'GO. SAVE. THE. DITCH.');
    f.readChat = true;
    yield G.say('Nate', 'If I\'m going out there, I need my {y}rock hammer{/}. It\'s in the {y}chest{/}.');
  };

  S.labExit = function () {
    const f = flags();
    if (!f.readChat) return G.script.run(S.notYet('My phone\'s blowing up. I should check it first.'));
    if (!G.state.items.hammer) return G.script.run(S.notYet('Can\'t leave without my rock hammer. A geologist is nothing without his hammer.'));
    G.play.warp('campus', 6, 7, 'down');
  };

  // ---------------------------------------------------------------- campus
  S.devin = function* () {
    const f = flags();
    if (f.phDone) {
      yield G.say('Devin', 'Rain is acidic. Life is acidic. Go save your ditch, man.');
      return;
    }
    yield G.say('Devin', 'Nate! Perfect timing. Quick chem question for you.');
    let c;
    do {
      c = yield G.ask('Devin', 'What is the pH of rainwater?', ['7', 'Why do you ask?']);
      if (c === 1) yield G.say('Devin', 'No reason. Totally no reason. Nobody paid me to ask you this.');
    } while (c === 1);
    yield G.say('Devin', 'Okay, sure. But what if it was... {y}slightly acidic{/}?');
    c = yield G.ask('Nate', 'Slightly acidic would be...', ['6', '5.6', 'Nice try.']);
    if (c === 0) {
      yield G.say('Nate', '6.');
      yield* slip();
      yield G.say('Nate', '...!!!');
      yield G.say('Nate', 'THAT\'S UNFAIR! I think about pH often!');
      yield G.say('Devin', 'Abe said you\'d say exactly that. He paid me ten shark teeth.');
      yield G.say('Devin', 'Here, you can have them. I feel kind of bad.');
    } else if (c === 1) {
      yield G.say('Nate', '5.6. Clean rain absorbs CO2 and makes carbonic acid. Obviously.');
      yield G.say('Devin', '...Wow. You really do think about pH often.');
      yield G.say('Nate', 'I do.');
      yield G.say('Devin', 'Abe bet me you\'d fall for it. Here, take the teeth he paid me.');
    } else {
      yield G.say('Devin', 'Abe said you\'d fall for it...');
      yield G.say('Nate', 'Tell Abe I am NOT gullible.');
      yield G.say('Devin', 'He said you\'d say that too. Here, take these. Don\'t tell him.');
    }
    f.phDone = true;
    G.audio.sfx('tooth');
    G.play.addTeeth(10);
    yield G.say(null, 'Got {y}10 shark teeth{/}!');
  };

  S.prof = function* () {
    const f = flags();
    if (f.profTalk) {
      yield G.say('Prof. Schist', 'Remember: every rock tells a story. Most of them are about pressure.');
      return;
    }
    yield G.say('Prof. Schist', 'Nate! I hear a plush egg is after the Number One Ditch.');
    yield G.say('Prof. Schist', 'Tragic. Coastal plain ditches are fascinating. Flat. Wet. Extremely ditchy.');
    yield G.say('Prof. Schist', 'My advice: when in doubt, hit it with your rock hammer.');
    yield G.say('Prof. Schist', 'Rocks, mostly. But those walking {r}sacred numbers{/} on the lawn seem to qualify.');
    f.profTalk = true;
  };

  S.maya = function* () {
    yield G.say('Maya', 'My cousin in Virginia goes shark tooth hunting every weekend.');
    yield G.say('Maya', 'She says there\'s a guy on the beach named {c}Tyler{/} who screams about mosasaurs.');
    yield G.say('Maya', 'Apparently he\'s... VERY intense.');
  };

  S.jordan = function* () {
    yield G.say('Jordan', 'Did you see Pardee Hall? It\'s the Department of {y}EEENGLISH{/} now.');
    yield G.say('Jordan', 'Some guy in a cream blazer keeps asking everyone if they speak it.');
  };

  S.vendor = function* () {
    const f = flags(), s = G.state;
    if (!f.metVendor) {
      yield G.say('Vendor', 'Ice cream! Get your fresh dulce de leche!');
      yield G.say('Nate', 'One {y}Doosh De Luche{/}, please.');
      yield G.say('Vendor', '...It\'s dulce de leche.');
      yield G.say('Nate', 'That\'s what I said. Doosh De Luche.');
      yield G.say('Vendor', 'I... fine. Doosh De Luche.');
      f.metVendor = true;
    }
    const c = yield G.ask('Vendor', 'One Doosh De Luche: {y}10 shark teeth{/}. Heals 4 hearts.', ['Buy one', 'No thanks']);
    if (c !== 0) { yield G.say('Vendor', 'Come back when you\'re craving Doosh.'); return; }
    if (s.items.doosh >= 3) { yield G.say('Vendor', 'Your pockets are already full of Doosh. That\'s a lot of Doosh.'); return; }
    if (s.teeth < 10) { yield G.say('Vendor', 'That\'s not enough teeth. Try whacking some tall grass.'); return; }
    G.play.addTeeth(-10);
    s.items.doosh++;
    if (!s.xItem) s.xItem = 'doosh';
    yield G.itemGet(G.spr.doosh, 'You got a {y}Doosh De Luche{/}! Press {y}X{/} to eat it and heal 4 hearts.');
  };

  S.sixIntro = function* () {
    yield G.say('Nate', 'Wait... are those...');
    yield G.say('Nate', 'Walking {r}sacred numbers{/}?! Father Eggmas must have sent them!');
    yield G.say('Nate', 'I won\'t say their name. I\'ll just hit them with a hammer.');
  };

  S.pardeeDoor = function* () {
    yield G.say(null, 'Locked. From inside, someone bellows: {y}"DO YOU SPEAK EEENGLISH?!"{/}');
    yield G.say('Nate', '...Dad?');
  };

  S.scienceDoor = function* () {
    yield G.say(null, 'SCIENCE CENTER. Closed until further notice due to "an incident involving homemade fireworks."');
    yield G.say('Nate', 'Allegedly.');
  };

  S.southRoad = function* () {
    const p = P();
    yield G.say('Nate', 'Chesapeake is this way. Hang on, Number One Ditch. I\'m coming.');
    yield G.banner('TO BE CONTINUED...', 'The road south opens in the next update!', 300);
    yield G.walkTo(p, p.x, p.y - 18, 1);
  };

  // ================================================================ MAPS
  G.MAPS = {};

  G.MAPS.lab = {
    name: 'Nate\'s Lab',
    music: 'house',
    tiles: [
      'wwwwwwwwwwwww',
      'wvvvvvvvvvvvw',
      'w___________w',
      'w___________w',
      'w____rrrr___w',
      'w____rrrr___w',
      'w___________w',
      'w___________w',
      'wwwwwwxwwwwww',
    ],
    setup(w) {
      const say = (...pages) => function* () { for (const pg of pages) yield Array.isArray(pg) ? G.say(pg[0], pg[1]) : G.say(null, pg); };
      w.addProp({ img: G.spr.plant, tx: 1, ty: 2, solid: [1, 2, 1, 1], hit: [1, 2, 1, 1], talk: say('A cactus named Feldspar. Somehow, it\'s thriving.') });
      w.addProp({
        img: G.spr.bench, tx: 2, ty: 2, solid: [2, 2, 3, 1], hit: [2, 2, 3, 1],
        talk: say('Nate\'s homemade fireworks, drying on the bench.', ['Nate', 'Not stable enough to carry yet. Science takes time. And a fire extinguisher.']),
      });
      w.addProp({
        img: G.spr.poster, tx: 5, ty: 1, dy: -2, flat: true, hit: [5, 1, 1, 1],
        talk: say('A periodic table. Nate has memorized it. Twice.', ['Nate', 'Hydrogen ion concentration... I think about pH often.']),
      });
      w.addProp({ img: G.spr.desk, tx: 7, ty: 2, solid: [7, 2, 2, 1], hit: [7, 2, 2, 1], talk: S.phone });
      w.addProp({
        img: G.spr.shelf, tx: 9, ty: 2, solid: [9, 2, 1, 1], hit: [9, 2, 1, 1],
        talk: say('Books: "Rocks for Jocks." "Fireworks for Beginners." "How to Never Say Numbers." That last one is highlighted.'),
      });
      w.addProp({ img: G.spr.bed, tx: 11, ty: 2, h: 2, solid: [11, 2, 1, 2], hit: [11, 2, 1, 2], talk: say('Nate\'s bed. It smells faintly of sulfur.') });
      w.addProp({
        img: G.spr.rocks, tx: 1, ty: 6, solid: [1, 6, 1, 1], hit: [1, 6, 1, 1],
        talk: say('Nate\'s rock collection. A fine specimen of gneiss.', ['Nate', 'Very gneiss.']),
      });
      w.add(new G.Chest(10, 6, 'lab_hammer', function* () {
        G.state.items.hammer = true;
        yield G.itemGet(G.spr.hammer.up, 'You got the {y}Rock Hammer{/}! A geologist\'s best friend.');
        yield G.say(null, 'Press {y}Z{/} to swing it. Great for rocks, tall grass... and anything shaped like the sacred number.');
      }));
      w.addTrigger(6, 8, 1, 1, S.labExit);
    },
  };

  G.MAPS.campus = {
    name: 'Lafayette College',
    music: 'field',
    tiles() {
      const W = 40, H = 30;
      const g = Array.from({ length: H }, () => Array(W).fill('.'));
      const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < W && y < H) g[y][x] = c; };
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) set(x + i, y + j, c); };
      for (let i = 0; i < 90; i++) set(Math.floor(G.hash(i, 5) * W), Math.floor(G.hash(i, 6) * H), ',');
      // paths
      fill(2, 12, 36, 2, '=');
      fill(19, 14, 2, 16, '=');
      fill(6, 7, 1, 5, '=');
      fill(19, 7, 1, 5, '=');
      fill(33, 7, 1, 5, '=');
      // pond
      fill(8, 16, 7, 5, '#');
      fill(9, 17, 5, 3, '~');
      // tall grass
      fill(27, 18, 4, 3, '"');
      fill(32, 22, 4, 3, '"');
      fill(33, 25, 3, 2, '"');
      fill(4, 23, 4, 3, '"');
      fill(11, 25, 3, 2, '"');
      // bushes
      [[17, 15], [17, 17], [17, 19], [23, 18], [23, 20], [11, 9], [12, 9], [25, 9], [26, 9], [28, 23], [29, 23], [15, 23], [16, 23]]
        .forEach(([x, y]) => set(x, y, 'b'));
      // fence along the top of the east lawn, with a gap
      fill(26, 15, 4, 1, 'f');
      fill(32, 15, 5, 1, 'f');
      // tree border with a gap for the south road
      for (let x = 0; x < W; x += 2) { set(x, 0, 'T'); if (x < 18 || x > 20) set(x, 28, 'T'); }
      for (let y = 2; y < 28; y += 2) { set(0, y, 'T'); set(38, y, 'T'); }
      // scattered trees
      [[3, 16], [4, 20], [24, 23], [34, 17], [13, 22]].forEach(([x, y]) => set(x, y, 'T'));
      return g.map((r) => r.join(''));
    },
    setup(w) {
      w.addBuilding({ x: 3, y: 3, w: 7, h: 4, door: 3, style: 'brick', roof: '#4a5070', sign: true, to: { map: 'lab', x: 6, y: 7 } });
      w.addBuilding({ x: 14, y: 2, w: 11, h: 5, door: 5, style: 'stone', wall: '#c8bc9c', roof: '#50607a', tower: true, locked: S.pardeeDoor });
      w.addBuilding({ x: 29, y: 3, w: 9, h: 4, door: 4, style: 'modern', wall: '#d8c8a0', roof: '#6a4a40', locked: S.scienceDoor });
      w.addProp({ img: G.spr.cart, tx: 22, ty: 14, h: 2, dx: -2, solid: [22, 14, 2, 2], hit: [22, 14, 2, 2], talk: S.vendor });

      const npc = (sprite, name, tx, ty, talk, o = {}) =>
        w.add(new G.NPC(Object.assign({ sprite, name, x: tx * 16 + 8, y: ty * 16 + 14, talk }, o)));
      npc('devin', 'Devin', 9, 10, S.devin);
      npc('prof', 'Prof. Schist', 30, 10, S.prof, { wander: 20 });
      npc('maya', 'Maya', 15, 18, S.maya, { dir: 'left' });
      npc('jordan', 'Jordan', 23, 9, S.jordan, { wander: 16 });
      npc('vendor', 'Vendor', 24, 15, S.vendor, { dir: 'left' });

      w.add(new G.Sign(8, 8, 'NATE\'S DORM. Home of "The Lab." (Not an official lab.)'));
      w.add(new G.Sign(17, 7, 'PARDEE HALL. Department of {y}EEENGLISH{/}. Do you speak it?'));
      w.add(new G.Sign(22, 26, [
        'SOUTH: Chesapeake, VA. 251 miles.',
        '{y}NUMBER ONE DITCH{/}  ***** "The best ditch in the world." (4,031 reviews)',
      ]));
      w.add(new G.Chest(36, 26, 'campus_teeth', function* () {
        yield G.itemGet(G.spr.toothGold, 'You found a stash of {y}20 shark teeth{/}!');
        G.play.addTeeth(20);
      }));

      [[28, 20], [31, 21], [34, 20], [30, 25], [6, 22], [10, 24], [15, 26]].forEach(([x, y]) => w.add(new G.Six(x * 16 + 8, y * 16 + 14)));

      w.addTrigger(1, 15, 37, 1, () => {
        if (flags().sixIntro) return;
        flags().sixIntro = true;
        G.script.run(S.sixIntro());
      });
      w.addTrigger(18, 29, 4, 1, () => G.script.run(S.southRoad()));
    },
  };
})();
