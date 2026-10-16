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
    // Fairgrounds
    superfan: { skin: '#f0c8a8', hair: '#5a3a20', hairStyle: 'cap', hat: '#d03038', hatStyle: 'ball', patch: '#f8d040', shirt: '#d03038', pants: '#3a4258', shoes: '#f0f0f0', torso: 6, legs: 3, smile: '#ffffff' },
    attendant: { skin: '#c88a60', hair: '#2a1a14', hairStyle: 'short', shirt: '#f08020', collar: '#f8e040', pants: '#3a3a44', shoes: '#202024', torso: 7, legs: 3 },
    lemonade: { skin: '#f8d8c0', hair: '#e8c060', hairStyle: 'shoulder', shirt: '#f8e040', pants: '#5878b8', shoes: '#f0f0f0', torso: 5, legs: 3, blush: true, smile: '#ffffff' },
    ref: { skin: '#e8b890', hair: '#3a2418', hairStyle: 'buzz', shirt: '#f0f0f0', pattern: 'stripes', pants: '#1c1c24', shoes: '#1c1c24', torso: 6, legs: 3 },
    // Luchador-style wrestlers: masks, singlets, boots.
    wrestler_red: { mask: '#d83038', maskTrim: '#f8d040', skin: '#e8b08a', shirt: '#d83038', pants: '#d83038', neckline: true, sleeves: 0, shorts: true, boots: true, shoes: '#f0f0f0', wide: true, torso: 4, legs: 3 },
    wrestler_blue: { mask: '#3058c8', maskTrim: '#e8e8f0', skin: '#c88a60', shirt: '#3058c8', pants: '#3058c8', neckline: true, sleeves: 0, shorts: true, boots: true, shoes: '#2a3a8a', wide: true, torso: 4, legs: 3 },
    wrestler_gold: { mask: '#e8b830', maskTrim: '#1c1c24', skin: '#a86a48', shirt: '#1c1c24', pants: '#1c1c24', belt: '#e8c040', neckline: true, sleeves: 0, shorts: true, boots: true, shoes: '#1c1c24', wide: true, torso: 4, legs: 3 },
    wrestler_green: { mask: '#38a048', maskTrim: '#ffffff', skin: '#f0c8a8', shirt: '#38a048', pants: '#38a048', neckline: true, sleeves: 0, shorts: true, boots: true, shoes: '#f0f0f0', wide: true, torso: 4, legs: 3 },
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
    fair: {
      bpm: 132,
      tracks: [
        { wave: 'square', vol: 0.055, notes: 'C5:4 E5:2 G5:2 E5:2 C5:2 | D5:4 F5:2 A5:2 F5:2 D5:2 | E5:4 G5:2 C6:2 G5:2 E5:2 | D5:6 G4:6 | C5:4 E5:2 G5:2 E5:2 C5:2 | F5:4 A5:2 C6:2 A5:2 F5:2 | E5:2 D5:2 C5:2 D5:2 E5:2 F5:2 | C5:12' },
        { wave: 'triangle', vol: 0.15, notes: 'C3:4 G3:4 G3:4 | D3:4 A3:4 A3:4 | C3:4 G3:4 G3:4 | G2:4 D3:4 D3:4 | C3:4 G3:4 G3:4 | F2:4 C3:4 C3:4 | C3:4 G3:4 G3:4 | C3:4 G2:4 C3:4' },
      ],
    },
    arena: {
      bpm: 150,
      tracks: [
        { wave: 'square', vol: 0.05, notes: 'E4:2 E4:2 G4:2 E4:2 A4:2 E4:2 B4:2 A4:2 | E4:2 E4:2 G4:2 E4:2 D5:4 B4:4 | E4:2 E4:2 G4:2 E4:2 A4:2 E4:2 B4:2 A4:2 | G4:4 F#4:4 E4:8' },
        { wave: 'sawtooth', vol: 0.06, notes: 'E2:2 E2:2 E3:2 E2:2 E2:2 E2:2 D3:2 E2:2 | E2:2 E2:2 E3:2 E2:2 G2:2 G2:2 A2:2 B2:2 | E2:2 E2:2 E3:2 E2:2 E2:2 E2:2 D3:2 E2:2 | C3:4 B2:4 E2:8' },
        { wave: 'noise', vol: 0.06, notes: 'k:4 s:4 k:2 k:2 s:4 | k:4 s:4 k:2 k:2 s:4 | k:4 s:4 k:2 k:2 s:4 | k:4 s:4 k:2 s:2 s:2 s:2' },
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

  // The giant boulder blocking the road south.
  S.boulderLook = function* () {
    const f = flags();
    if (f.boulderSeen) {
      yield G.say(null, 'A massive glacial erratic. It\'s not going anywhere without some serious muscle.');
      return;
    }
    f.boulderSeen = true;
    yield G.say('Nate', 'Whoa. Is that... a {y}glacial erratic{/}?!');
    yield G.say('Nate', 'A giant boulder dragged here by a glacier over ten thousand years ago. Granite, with pink feldspar. Gorgeous.');
    yield G.say('Nate', '...It\'s also completely blocking the road to Chesapeake.');
    yield G.say('Nate', 'My rock hammer won\'t even scratch this thing. I need someone {y}really{/} strong.');
  };

  S.boulderHit = function () {
    const f = flags();
    if (G.script.busy) return;
    if (!f.boulderHitOnce) {
      f.boulderHitOnce = true;
      G.script.run((function* () {
        yield G.wait(20);
        yield G.say('Nate', 'Ow. OW. My hands are vibrating.');
        yield* S.boulderLook();
      })());
    } else if (!f.boulderHint && (f.boulderHits = (f.boulderHits || 0) + 1) >= 4) {
      f.boulderHint = true;
      G.script.run((function* () { yield* S.boulderLook(); })());
    }
  };

  // ---------------------------------------------------------------- fairgrounds
  S.superfan = function* () {
    yield G.say('Superfan', 'I\'ve been to every Micro Mayhem show for {r}six{/} years straight!');
    yield G.say('Superfan', '...Oh. Was I not supposed to say that around you?');
    yield G.say('Nate', 'You can say it. I just can\'t.');
    yield G.say('Superfan', 'Weird rule, man.');
  };

  S.attendant = function* () {
    yield G.say('Attendant', 'Careful, kid. The wrestlers are warming up out here, and they dropkick anything that moves.');
    yield G.say('Attendant', 'Pro tip: when one of \'em slams into something, they get dizzy. That\'s your chance.');
  };

  S.ticketBooth = function* () {
    yield G.say(null, 'TICKETS. {y}MICRO MAYHEM WRESTLING{/}: show starts at 7!');
    yield G.say(null, 'A sign in the window: "Wrestlers are warming up around the fairgrounds. Enter at your own risk."');
  };

  S.lemonade = function* () {
    const s = G.state;
    const c = yield G.ask('Lemonade', 'Fresh-squeezed lemonade! {y}5 shark teeth{/}. Heals 2 hearts.', ['Buy one', 'No thanks']);
    if (c !== 0) return;
    if (s.teeth < 5) { yield G.say('Lemonade', 'Not enough teeth, hon.'); return; }
    G.play.addTeeth(-5);
    G.play.healQ += 4;
    G.audio.sfx('gulp');
    yield G.say('Nate', 'Ahh. Citric acid. A pH of about 2. Refreshing.');
  };

  S.funnelCake = function* () {
    yield G.say(null, 'FUNNEL CAKE: {r}6{/} shark teeth.');
    yield G.say('Nate', '...I can\'t order that. I\'d have to say the price out loud.');
  };

  S.cornDogs = function* () {
    yield G.say(null, 'CORN DOGS: {r}SOLD OUT{/}. A sign reads: "The wrestlers ate all of them. Sorry."');
  };

  S.potty = function* () {
    const f = flags();
    f.pottyKnocks = (f.pottyKnocks || 0) + 1;
    const lines = ['Occupied.', 'Still occupied.', 'A voice from inside: "GO AWAY."', 'Nate decides not to knock again.'];
    yield G.say(null, lines[Math.min(f.pottyKnocks, lines.length) - 1]);
  };

  // ---------------------------------------------------------------- expo hall
  S.lockerRoom = function* () {
    yield G.say(null, 'LOCKER ROOM. {r}Wrestlers only.{/}');
    yield G.say(null, 'You can hear someone inside doing very loud push-ups.');
  };

  S.nachos = function* () {
    yield G.say(null, 'CONCESSIONS. Popcorn: {y}4 teeth{/}. Nachos: {r}6 teeth{/}.');
    yield G.say('Nate', 'Popcorn it is. ...Actually, I\'m saving my teeth.');
  };

  S.ref = function* () {
    yield G.say('Referee', 'No matches until tonight! ...Not that these guys care.');
    yield G.say('Referee', 'If you pin one, I\'ll count it. One... two... three!');
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
      // paths (the main path runs off the east edge toward the fairgrounds)
      fill(2, 12, 38, 2, '=');
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
      for (let y = 2; y < 28; y += 2) { set(0, y, 'T'); if (y !== 12) set(38, y, 'T'); }
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
      if (!flags().boulderGone) w.add(new G.Boulder(20 * 16, 28 * 16 + 15, S.boulderHit));
      w.add(new G.Sign(37, 11, 'EAST: Easton Fairgrounds. Tonight: {y}MICRO MAYHEM WRESTLING{/}!'));
      w.addWarp(39, 12, 1, 2, 'fair', 1, 12, 'right');
    },
  };

  G.MAPS.fair = {
    name: 'Easton Fairgrounds',
    music: 'fair',
    tiles() {
      const W = 40, H = 32;
      const g = Array.from({ length: H }, () => Array(W).fill('.'));
      const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < W && y < H) g[y][x] = c; };
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) set(x + i, y + j, c); };
      for (let i = 0; i < 50; i++) set(Math.floor(G.hash(i, 15) * W), Math.floor(G.hash(i, 16) * H), ',');
      // dirt paths
      fill(0, 12, 34, 2, '=');
      fill(20, 9, 2, 3, '=');
      fill(20, 14, 2, 14, '=');
      fill(22, 22, 14, 2, '=');
      // parking lot with painted stalls
      fill(2, 16, 16, 12, 'a');
      fill(8, 14, 3, 2, 'a');
      for (const y of [17, 18, 24, 25]) for (const x of [3, 6, 9, 12, 15]) set(x, y, 'l');
      // tall grass in the east field
      fill(28, 25, 8, 3, '"');
      fill(31, 15, 5, 3, '"');
      fill(3, 4, 4, 3, '"');
      [[11, 9], [12, 9], [28, 9], [29, 9], [3, 10], [4, 10], [36, 18], [36, 20]].forEach(([x, y]) => set(x, y, 'b'));
      // tree border (gap on the west edge for the road back to campus)
      for (let x = 0; x < W; x += 2) { set(x, 0, 'T'); set(x, 30, 'T'); }
      for (let y = 2; y < 30; y += 2) { if (y !== 12) set(0, y, 'T'); set(38, y, 'T'); }
      [[8, 3], [32, 4], [24, 26], [34, 12]].forEach(([x, y]) => set(x, y, 'T'));
      return g.map((r) => r.join(''));
    },
    setup(w) {
      w.addBuilding({ x: 13, y: 2, w: 14, h: 7, door: 7, style: 'metal', wall: '#9aa4b4', roof: '#5a6474', banner: 'MICRO MAYHEM WRESTLING', to: { map: 'arena', x: 11, y: 16 } });
      w.addProp({ img: G.spr.booth, tx: 16, ty: 9, h: 2, solid: [16, 9, 3, 2], hit: [16, 9, 3, 2], talk: S.ticketBooth });
      w.addProp({ img: G.spr.standFunnel, tx: 23, ty: 19, h: 3, solid: [23, 20, 4, 2], hit: [23, 20, 4, 2], talk: S.funnelCake });
      w.addProp({ img: G.spr.standCorn, tx: 28, ty: 19, h: 3, solid: [28, 20, 4, 2], hit: [28, 20, 4, 2], talk: S.cornDogs });
      w.addProp({ img: G.spr.standLemon, tx: 33, ty: 19, h: 3, solid: [33, 20, 4, 2], hit: [33, 20, 4, 2], talk: S.lemonade });
      for (const x of [30, 31, 32]) w.addProp({ img: G.spr.potty, tx: x, ty: 9, h: 2, solid: [x, 9, 1, 2], hit: [x, 9, 1, 2], talk: S.potty });
      for (const [x, y] of [[23, 16], [24, 16], [23, 17], [35, 10], [36, 10], [6, 9]]) w.addProp({ img: G.spr.hay, tx: x, ty: y, solid: [x, y, 1, 1] });
      for (const [x, y] of [[19, 15], [22, 21], [18, 11]]) w.addProp({ img: G.spr.trash, tx: x, ty: y, dx: 2, solid: [x, y, 1, 1] });
      [[4, 17, 0], [10, 17, 1], [16, 17, 2], [7, 24, 3], [13, 24, 4], [16, 24, 5]].forEach(([x, y, c]) =>
        w.addProp({ img: G.spr.cars[c], tx: x, ty: y, h: 2, dx: 4, solid: [x, y, 2, 2] }));

      const npc = (sprite, name, tx, ty, talk, o = {}) =>
        w.add(new G.NPC(Object.assign({ sprite, name, x: tx * 16 + 8, y: ty * 16 + 14, talk }, o)));
      npc('superfan', 'Superfan', 23, 10, S.superfan, { wander: 14 });
      npc('attendant', 'Attendant', 8, 15, S.attendant, { dir: 'right' });

      w.add(new G.Sign(5, 11, ['EASTON FAIRGROUNDS', 'Tonight: {y}MICRO MAYHEM WRESTLING{/}! Doors at 7.']));
      w.add(new G.Sign(18, 14, 'PARKING. Do not leave valuables in your car. Or near the wrestlers.'));

      const styles = ['red', 'blue', 'gold', 'green'];
      [[6, 21], [12, 21], [14, 26], [27, 24], [32, 26], [30, 13], [9, 6]].forEach(([x, y], i) =>
        w.add(new G.Wrestler(x * 16 + 8, y * 16 + 14, styles[i % styles.length])));

      w.addWarp(0, 12, 1, 2, 'campus', 38, 12, 'left');
    },
  };

  G.MAPS.arena = {
    name: 'Expo Hall',
    music: 'arena',
    tiles: (() => {
      const rows = ['w'.repeat(24), 'w' + 'v'.repeat(22) + 'w'];
      for (let y = 2; y <= 4; y++) rows.push('w' + 'B'.repeat(9) + 'CCCC' + 'B'.repeat(9) + 'w');
      for (let y = 5; y <= 13; y++) rows.push('w' + 'BBB' + 'C'.repeat(16) + 'BBB' + 'w');
      for (let y = 14; y <= 16; y++) rows.push('w' + 'C'.repeat(22) + 'w');
      rows.push('w'.repeat(11) + 'xx' + 'w'.repeat(11));
      return rows;
    })(),
    setup(w) {
      // the ring: ropes block the edges except the steps on the south side
      w.addProp({ img: G.spr.ring, tx: 8, ty: 6, h: 7, flat: true });
      w.blockTiles(8, 6, 8, 1);
      w.blockTiles(8, 7, 1, 5);
      w.blockTiles(15, 7, 1, 5);
      w.blockTiles(8, 12, 3, 1);
      w.blockTiles(13, 12, 3, 1);
      w.addProp({ img: G.spr.lockerDoor, tx: 11, ty: 1, flat: true, hit: [11, 1, 1, 1], talk: S.lockerRoom });
      w.addProp({ img: G.spr.concession, tx: 2, ty: 15, h: 2, solid: [2, 15, 4, 2], hit: [2, 15, 4, 2], talk: S.nachos });

      w.add(new G.NPC({ sprite: 'ref', name: 'Referee', x: 18 * 16 + 8, y: 15 * 16 + 14, talk: S.ref, wander: 20 }));

      [[10, 8, 'gold'], [13, 10, 'red'], [5, 13, 'blue'], [18, 12, 'green']].forEach(([x, y, s]) =>
        w.add(new G.Wrestler(x * 16 + 8, y * 16 + 14, s)));

      w.addWarp(11, 17, 2, 1, 'fair', 20, 9, 'down');
    },
  };
})();
