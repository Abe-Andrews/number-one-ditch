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
      skin: '#f0c0a0', hair: '#a88a62', hairStyle: 'cropped', beard: '#8a7058', beardLow: true, glasses: '#4a4248', smile: '#ffffff',
      coat: '#ece4d0', shirt: '#283044', pants: '#4a4a58', shoes: '#4a3020',
      wide: true, torso: 7, legs: 4,
    },
    // Placeholders until reference photos arrive.
    tyler: {
      skin: '#e8b890', hair: '#e0c070', hairStyle: 'cap', hat: '#3a7ab0', hatStyle: 'ball',
      shirt: '#f0d040', pants: '#c8a878', shorts: true, shoes: '#606060', torso: 7, legs: 4,
    },
    // Mikey: short brown hair, dark rectangular glasses, black polo.
    mikey: {
      skin: '#f4cdb0', hair: '#7a4a28', hairStyle: 'short', glasses: '#2a2e48', smile: '#f0e0d8',
      shirt: '#1c1c24', collar: '#34343e', logo: '#d03038', pants: '#5a6478', shoes: '#2a2a30', torso: 5, legs: 3,
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
    pete: { skin: '#e8b890', hair: '#6a4028', hairStyle: 'cap', hat: '#e05020', hatStyle: 'ball', beard: '#6a4028', shirt: '#2a2a30', pants: '#4a4038', shoes: '#3a2818', boots: true, torso: 7, legs: 3 },
    // Luchador-style wrestlers: masks, singlets, boots.
    wrestler_red: { mask: '#d83038', maskTrim: '#f8d040', skin: '#e8b08a', shirt: '#d83038', pants: '#d83038', neckline: true, sleeves: 0, shorts: true, boots: true, shoes: '#f0f0f0', wide: true, torso: 4, legs: 3 },
    wrestler_blue: { mask: '#3058c8', maskTrim: '#e8e8f0', skin: '#c88a60', shirt: '#3058c8', pants: '#3058c8', neckline: true, sleeves: 0, shorts: true, boots: true, shoes: '#2a3a8a', wide: true, torso: 4, legs: 3 },
    wrestler_gold: { mask: '#e8b830', maskTrim: '#1c1c24', skin: '#a86a48', shirt: '#1c1c24', pants: '#1c1c24', belt: '#e8c040', neckline: true, sleeves: 0, shorts: true, boots: true, shoes: '#1c1c24', wide: true, torso: 4, legs: 3 },
    wrestler_green: { mask: '#38a048', maskTrim: '#ffffff', skin: '#f0c8a8', shirt: '#38a048', pants: '#38a048', neckline: true, sleeves: 0, shorts: true, boots: true, shoes: '#f0f0f0', wide: true, torso: 4, legs: 3 },
  };

  // Nate before he gets his flat cap back from Groundskeeper Gus.
  G.CAST.nate_nocap = Object.assign({}, G.CAST.nate, { hat: null, hatStyle: null });
  G.CAST.gus = {
    skin: '#e8b890', hair: '#b8b8c0', hairStyle: 'cap', hat: '#d8c088', hatStyle: 'ball', beard: '#c8c8d0',
    shirt: '#4a7a48', collar: '#6a9a60', pants: '#8a7450', shoes: '#4a3428', boots: true, torso: 7, legs: 3,
  };

  // Science Center classroom
  G.CAST.moles = {
    skin: '#d8a078', hair: '#e0e0e8', hairStyle: 'receding', glasses: '#2a2a30',
    coat: '#f4f4f4', shirt: '#6a4a8a', pants: '#3a3a44', shoes: '#2a2a2a', torso: 7, legs: 3,
  };
  G.CAST.rose = {
    skin: '#f4d4c0', hair: '#e8e8f0', hairStyle: 'shoulder', glasses: '#8a6a9a', smile: '#ffffff', blush: true,
    shirt: '#e8a0c0', coat: '#f0c0d8', dress: '#8a7ab0', shoes: '#f0f0f0', torso: 5, legs: 3,
  };
  G.CAST.earl = {
    skin: '#e8b090', hair: '#5a3a20', hairStyle: 'cap', hat: '#3a6a3a', hatStyle: 'ball', patch: '#f0f0f0', beard: '#5a3a20',
    shirt: '#b83030', pattern: 'plaid', plaidL: '#d86060', plaidW: '#2a1a1a', sleeves: 'long', pants: '#3a4a6a', shoes: '#4a3428', boots: true,
    wide: true, torso: 8, legs: 4,
  };
  G.CAST.priya = { skin: '#b07850', hair: '#1a1010', hairStyle: 'long', shirt: '#8a2034', pants: '#384058', shoes: '#f0f0f0', torso: 5, legs: 3 };

  // Badlands Chugs: bald, full beard, black "Don't Touch Dat" tee, white sneakers.
  G.CAST.badlands = {
    skin: '#6a4232', eyes: '#140c0a', hair: '#6a4232', hairStyle: 'bald', beard: '#24201e',
    shirt: '#1c1c20', logo: '#a8a8b0', pants: '#2a2c34', shoes: '#f0f0f0', wide: true, big: true, torso: 9, legs: 4,
  };
  // ...right after chugging Nate's drink.
  G.CAST.badlands_blue = Object.assign({}, G.CAST.badlands, { skin: '#4a6ad0', hair: '#4a6ad0', beard: '#1c2a5a' });

  // Nate at three, for the Alligator Incident flashback: light blue shirt, diaper, bare feet.
  G.CAST.nate_toddler = {
    skin: '#f8d0b4', hair: '#c8642c', hairStyle: 'short', blush: true,
    shirt: '#8ab8e8', pants: '#f4f4f0', shorts: true, shoes: '#f0c0a0', torso: 3, legs: 2,
  };

  // Dad as El EEENGLISH: luchador mask over his glasses and beard, blazer on.
  G.CAST.elenglish = Object.assign({}, G.CAST.dad, { mask: '#1c2c6c', maskTrim: '#e8e8f0', maskEmblem: '#d03038' });

  // ================================================================ ITEMS
  // kind 'gear' shows on the ITEMS tab (equip to X); 'key' shows on KEY ITEMS.
  // has()/count()/desc may be functions so entries can react to the story.
  const st = () => G.state, fl = () => G.state.flags;
  G.ITEMS = {
    hammer: { kind: 'gear', name: 'Rock Hammer', icon: () => G.spr.hammer.up, desc: 'A geologist\'s best friend. Always on Z.' },
    doosh: {
      kind: 'gear', equip: true, name: 'Doosh De Luche', icon: () => G.spr.doosh,
      desc: 'Heals 4 hearts. (It\'s pronounced dulce de leche.)',
      has: () => (st().items.doosh || 0) > 0 || !!fl().hadDoosh,
    },
    package: {
      kind: 'gear', equip: true, name: 'Booby-Trapped Package', short: 'Packages', icon: () => G.spr.gift,
      desc: 'Set one down with X. It goes BANG a few seconds later. Merry Christmas!',
      has: () => (st().items.package || 0) > 0 || !!fl().doronDeal,
    },
    pipe: {
      kind: 'gear', equip: true, name: 'Dad\'s Pipe', short: 'Dad\'s Pipe', icon: () => G.spr.pipe, has: () => !!st().items.pipe,
      desc: () => {
        const known = G.SIGNALS.filter((sg) => sg.known());
        return 'Hand-carved by Dad. Press X, then puff arrows. ' +
          (known.length ? 'Signals: ' + known.map((sg) => '{c}' + sg.name + '{/} ' + G.arrows(sg.seq)).join(', ') : '');
      },
    },
    bidet: { kind: 'gear', name: 'Portable Bidet', icon: () => null, desc: '', has: () => !!st().items.bidet },
    phone: {
      kind: 'key', name: 'Nate\'s Phone', icon: () => G.spr.phone, has: () => true,
      desc: 'The family group chat. 147 unread, mostly Nani. Press Z to read one.',
      use: () => G.SCRIPTS.naniMessage(),
    },
    hat: {
      kind: 'key', name: 'Hat', icon: () => G.spr.cap, has: () => !!st().items.cap,
      desc: 'Brown corduroy. Distinguished. Lucky. Nate never goes anywhere without it.',
    },
    tickets: {
      kind: 'key', name: 'Micro Mayhem Tickets', icon: () => G.spr.ticket,
      has: () => (st().items.tickets || 0) > 0, count: () => st().items.tickets,
      desc: 'Doron\'s spare tickets. Talk to people to offer them one. Nobody ever takes them.',
    },
    chemFinal: {
      kind: 'key', name: 'Graded Chem Final', icon: () => G.spr.paper, has: () => !!fl().chemPassed,
      desc: () => (fl().chemPerfect
        ? '5 out of 5, and not one sacred number. Gold star. In the margin: "Interesting phrasing."'
        : 'Passed! In the margin: "Retake it without saying the number for extra credit."'),
    },
    // the refrigerator game ingredients (used up once Badlands is beaten)
    milk: { kind: 'key', name: 'Milk', icon: () => G.spr.milk, has: () => !!st().items.milk && !fl().badlandsBeaten, desc: 'From Dad\'s garage fridge. The expiration date is a mystery.' },
    dye: { kind: 'key', name: 'Blue Food Coloring', icon: () => G.spr.dye, has: () => !!st().items.dye && !fl().badlandsBeaten, desc: 'From Nate\'s old chemistry set. Turns anything the color of a smurf.' },
    smoke: { kind: 'key', name: 'Liquid Smoke', icon: () => G.spr.liquidSmoke, has: () => !!st().items.smoke && !fl().badlandsBeaten, desc: 'Hickory flavor. From Dad\'s grill stuff. Never drink this.' },
    vodka: { kind: 'key', name: 'Vodka Shooters', icon: () => G.spr.vodka, has: () => !!st().items.vodka && !fl().badlandsBeaten, desc: 'Three tiny bottles from inside a hollow copy of "War and Peace."' },
  };
  // grid order; null = an empty slot for things Nate hasn't found yet
  G.GEAR_SLOTS = ['hammer', 'doosh', 'package', 'pipe', 'bidet', null, null, null];

  // ================================================================ SMOKE SIGNALS (Dad's pipe)
  // Like ocarina songs: learn a sequence, puff it with the pipe, something
  // happens. Add new ones here as the story teaches them.
  G.SIGNALS = [
    { id: 'peace', name: 'Peace Be With You', seq: ['up', 'down', 'up'], known: () => !!fl().signal_peace, effect: () => G.SCRIPTS.signalPeace() },
  ];
  G.KEY_SLOTS = ['phone', 'hat', 'tickets', 'chemFinal', 'milk', 'dye', 'smoke', 'vodka'];

  G.itemHas = (id) => {
    const def = G.ITEMS[id];
    if (!def) return false;
    if (def.has) return def.has();
    const v = st().items[id];
    return !!v && (typeof v !== 'number' || v > 0);
  };
  G.itemCount = (id) => {
    const def = G.ITEMS[id];
    if (def.count) return def.count();
    const v = st().items[id];
    return typeof v === 'number' ? v : null;
  };
  G.itemDesc = (id) => {
    const d = G.ITEMS[id].desc;
    return typeof d === 'function' ? d() : d;
  };

  // ================================================================ PARTY
  G.PARTY_ORDER = ['nate', 'doron', 'lily', 'abe', 'hannah'];
  G.PARTY_INFO = {
    nate: { name: 'Nate', bio: 'Geology major at Lafayette. Makes his own fireworks. Thinks about pH often.', skill: 'Rock hammer, chemistry, explosive presents' },
    doron: { name: 'Doron', bio: 'The oldest brother. Army vet. Never skips leg day. Owns three luchador masks. Responsible for the Alligator Incident.', skill: 'Lifts and smashes heavy things' },
    lily: { name: 'Lily', bio: 'Nate\'s sister. Survived a refrigerator. Still subscribed to Badlands Chugs.', skill: 'A "No." that pops balloons' },
    abe: { name: 'Abe', bio: '', skill: '' },
    hannah: { name: 'Hannah', bio: '', skill: '' },
  };

  // ================================================================ PEOPLE (menu tab)
  // The party first (unfound family as silhouettes), then everyone important
  // Nate has met. Unmet characters stay hidden.
  const CHARACTERS = [
    {
      id: 'dad', name: 'Dad', tag: '{c}Family', met: () => fl().readChat,
      bio: 'Christian. A pastor who carves pipes in his workshop. Asks everyone if they speak EEENGLISH.',
    },
    {
      id: 'elenglish', name: 'El EEENGLISH', met: () => fl().mainEvent,
      tag: () => (fl().dadBeaten ? '{o}Boss: defeated!' : '{r}Boss'),
      bio: () => (fl().dadBeaten
        ? 'Dad, brainwashed by Father Eggmas into a luchador. The main event. Unmasked by a present.'
        : 'Dad?! Brainwashed by Father Eggmas. Fires EEENGLISH letters and dropkicks off the ropes.'),
    },
    {
      id: 'eggmas', name: 'Father Eggmas', tag: '{r}Villain', met: () => true, img: () => G.spr.eggmas,
      bio: 'A plush Christmas Humpty Dumpty from a thrift store. Wants the Number One Ditch to be Number Two.',
    },
    {
      id: 'badlands', name: 'Badlands Chugs', met: () => fl().badlandsMet,
      tag: () => (fl().badlandsBeaten ? '{o}Boss: chugged!' : '{r}Boss'),
      bio: () => (fl().badlandsBeaten
        ? 'Famous chugger. Chugged Nate\'s blue smoky milk vodka in one go, then went through the roof. The video did great.'
        : 'Famous chugger. Locked Lily in the kitchen fridge for a video. Challenged to the refrigerator game.'),
    },
    {
      id: 'mikey', name: 'Mikey', met: () => fl().mikeyMet,
      tag: () => (fl().mikeyBeaten ? '{o}Miniboss: told no' : '{p}Waiting for Lily'),
      bio: () => (fl().mikeyBeaten
        ? 'Sang Lily a song at golden hour, with heart balloons. She said no. He kept the flowers.'
        : 'Showed up with flowers, heart balloons and a song. Won\'t let anyone drive to Chesapeake until he talks to Lily.'),
    },
    { id: 'gus', name: 'Gus', tag: '{y}Friend', met: () => fl().capQuest, bio: 'Lafayette\'s groundskeeper. Protector of petunias. Found Nate\'s hat.' },
    { id: 'moles', name: 'Dr. Moles', tag: '{y}Friend', met: () => fl().chemMet, bio: 'Chemistry professor. Nobody has ever gotten the last question on his final right.' },
    { id: 'pete', name: 'Pyro Pete', tag: '{y}Friend', met: () => fl().doronDeal, bio: 'Runs the pyro for Micro Mayhem. Thinks Nate\'s exploding present was beautiful.' },
    { id: 'prof', name: 'Prof. Schist', tag: '{y}Friend', met: () => fl().profTalk, bio: 'Geology professor. Finds coastal plain ditches fascinating. Flat. Wet. Ditchy.' },
    { id: 'devin', name: 'Devin', tag: '{y}Friend', met: () => fl().phDone, bio: 'Nate\'s lab partner. Was paid in shark teeth to ask about the pH of rainwater.' },
  ];

  G.people = () => {
    const s = st();
    const list = G.PARTY_ORDER.map((id) => {
      const has = s.party.includes(id), info = G.PARTY_INFO[id];
      return {
        id, known: has, name: has ? info.name : '???',
        tag: has ? '{g}In the party' : '{d}Not found yet',
        bio: has ? info.bio : '', skill: has ? info.skill : '',
      };
    });
    for (const c of CHARACTERS) {
      if (!c.met()) continue;
      list.push({
        id: c.id, known: true, name: c.name, img: c.img,
        tag: typeof c.tag === 'function' ? c.tag() : c.tag,
        bio: typeof c.bio === 'function' ? c.bio() : c.bio,
      });
    }
    return list;
  };

  // ================================================================ JOURNAL
  // The current goal follows the story flags, so anyone picking the game back
  // up knows where to go.
  G.journal = () => {
    const f = fl(), s = st();
    let goal;
    if (!f.readChat) goal = 'Check your phone. It\'s buzzing on the desk in your lab.';
    else if (!s.items.hammer) goal = 'Grab your rock hammer from the chest in your lab.';
    else if (!f.boulderSeen) goal = 'Head south toward Chesapeake, VA.';
    else if (!s.items.cap) goal = f.capQuest ? 'Bonk 10 sacred numbers for Gus to get your hat back.' : 'Find your hat. Someone on the quad must have seen it.';
    else if (!f.doronDeal) goal = 'Find Doron at the Easton Fairgrounds, east of campus.';
    else if (!f.dadBeaten) goal = 'Watch the main event inside the Expo Hall.';
    else if (!f.boulderGone) goal = 'Bring Doron to the boulder on the south road.';
    else if (!f.homeArrived) goal = 'Take the south road to Rattlesnake Bridge Road. Home!';
    else if (!f.badlandsMet) goal = f.mikeyMet ? 'Find Lily. Mikey won\'t let anyone drive to Chesapeake until he talks to her. Try the house.' : 'Explore home. Go inside!';
    else if (!f.badlandsBeaten && G.ingredientCount() < 4) goal = 'Beat Badlands Chugs at the refrigerator game. Find milk, blue food coloring, liquid smoke and vodka shooters. (' + G.sayable(G.ingredientCount()) + '/4)';
    else if (!f.badlandsBeaten) goal = 'Bring the ingredients to Badlands Chugs in the kitchen. Time for the refrigerator game.';
    else if (!f.mikeyBeaten) goal = 'Mikey is waiting at the end of the driveway. Lily has something to tell him.';
    else goal = 'The road to Chesapeake is open! Leave from either end of Rattlesnake Bridge Rd. (More story soon!)';
    const side = [];
    if (f.capQuest || s.items.cap) side.push(['Gus\'s lawn job', s.items.cap ? '{g}Done!' : G.sayable(G.capProgress()) + '/10 sacred numbers']);
    if (f.chemMet) side.push(['The Chem Final', f.chemPerfect ? '{g}Perfect!' : f.chemPassed ? 'Passed! Retake for a heart' : 'Not passed yet']);
    if (f.ticketQuest) {
      const left = s.items.tickets || 0;
      side.push(['Doron\'s spare tickets', f.ticketsDone ? '{g}Done!' : f.dadBeaten ? 'The show\'s over' : left ? G.sayable(left) + ' left' : 'Go tell Doron!']);
    }
    return { goal, side };
  };

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
    home: {
      bpm: 96,
      tracks: [
        { wave: 'square', vol: 0.045, notes: 'B4:4 D5:4 G5:6 F#5:2 | E5:4 D5:4 B4:8 | C5:4 E5:4 A5:6 G5:2 | F#5:12 R:4 | B4:4 D5:4 G5:6 B5:2 | A5:4 G5:4 E5:8 | C5:4 B4:4 A4:4 D5:4 | G4:12 R:4' },
        { wave: 'triangle', vol: 0.15, notes: 'G2:8 D3:8 | C3:8 G2:8 | A2:8 E3:8 | D3:8 D2:8 | G2:8 B2:8 | C3:8 E3:8 | A2:8 D3:8 | G2:16' },
      ],
    },
    boss: {
      bpm: 160,
      tracks: [
        { wave: 'square', vol: 0.055, notes: 'A4:2 A4:2 C5:2 A4:2 D5:2 A4:2 E5:2 D5:2 | C5:2 C5:2 E5:2 C5:2 F5:4 E5:4 | A4:2 A4:2 C5:2 A4:2 D5:2 A4:2 E5:2 G5:2 | F5:4 E5:4 D5:4 C5:4' },
        { wave: 'sawtooth', vol: 0.06, notes: 'A2:2 A2:2 A3:2 A2:2 A2:2 A2:2 G2:2 A2:2 | F2:2 F2:2 F3:2 F2:2 G2:2 G2:2 G3:2 G2:2 | A2:2 A2:2 A3:2 A2:2 A2:2 A2:2 G2:2 A2:2 | D3:4 E3:4 E2:8' },
        { wave: 'noise', vol: 0.06, notes: 'k:2 h:2 s:2 h:2 k:2 k:2 s:2 h:2 | k:2 h:2 s:2 h:2 k:2 k:2 s:2 h:2 | k:2 h:2 s:2 h:2 k:2 k:2 s:2 h:2 | k:2 h:2 s:2 h:2 k:2 s:2 s:2 s:2' },
      ],
    },
    // Mikey's serenade (an original tune, not the song he's been practicing)
    serenade: {
      bpm: 104,
      tracks: [
        { wave: 'square', vol: 0.05, notes: 'F#4:4 A4:2 D5:4 C#5:2 B4:4 | A4:6 F#4:2 E4:8 | G4:4 B4:2 E5:4 D5:2 C#5:4 | B4:12 R:4 | F#4:4 A4:2 D5:4 E5:2 F#5:4 | E5:4 D5:4 B4:8 | G4:4 A4:4 B4:4 C#5:4 | D5:12 R:4' },
        { wave: 'triangle', vol: 0.14, notes: 'D3:8 A2:8 | F#2:8 A2:8 | G2:8 E3:8 | A2:8 A2:8 | D3:8 F#3:8 | B2:8 G2:8 | E2:8 A2:8 | D3:16' },
        { wave: 'noise', vol: 0.03, notes: 'h:4 h:4 h:4 h:4 | h:4 h:4 h:4 h:4 | h:4 h:4 h:4 h:4 | h:4 h:4 h:4 h:4 | h:4 h:4 h:4 h:4 | h:4 h:4 h:4 h:4 | h:4 h:4 h:4 h:4 | h:4 h:4 h:4 h:4' },
      ],
    },
    // Badlands' groove for the refrigerator game
    chug: {
      bpm: 96,
      tracks: [
        { wave: 'square', vol: 0.05, notes: 'E4:2 R:2 E4:2 G4:2 A4:4 G4:2 E4:2 | D4:2 R:2 D4:2 E4:2 G4:4 E4:4 | E4:2 R:2 E4:2 G4:2 A4:2 C5:2 B4:2 A4:2 | G4:4 E4:4 D4:4 E4:4' },
        { wave: 'sawtooth', vol: 0.05, notes: 'E2:4 E2:2 G2:2 A2:4 G2:4 | D2:4 D2:2 E2:2 G2:4 E2:4 | E2:4 E2:2 G2:2 A2:4 C3:4 | B2:4 G2:4 D2:4 E2:4' },
        { wave: 'noise', vol: 0.06, notes: 'k:4 h:2 h:2 s:4 h:4 | k:4 h:2 k:2 s:4 h:4 | k:4 h:2 h:2 s:4 h:4 | k:2 k:2 h:4 s:4 s:4' },
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

  // Reading the phone from the KEY ITEMS menu: a random Nani message.
  const NANI = [
    'Nate, you are a shining star! Keep shining! Love, Nani',
    'Remember to drink water and believe in yourself!',
    'Every ditch is the number one ditch to somebody. Love, Nani',
    'You are braver than you believe and smarter than you think!',
    'Today is a gift. That is why they call it the present. (Not the exploding kind, Nate.)',
    'Did you eat? Nani loves you!',
    'Be the light you wish to see in the world. Also wear a jacket.',
  ];
  S.naniMessage = function* () {
    yield G.say(null, '{c}~ FAMILY GROUP CHAT ~{/}');
    yield G.text('Nani', NANI[Math.floor(Math.random() * NANI.length)]);
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
    f.hadDoosh = true;
    if (!s.xItem) s.xItem = 'doosh';
    yield G.itemGet(G.spr.doosh, 'You got a {y}Doosh De Luche{/}! Press {y}X{/} to eat it and heal 4 hearts.');
  };

  // Groundskeeper Gus found Nate's cap. He'll trade it for 10 bonked Sixes.
  G.fairLit = () => !!(G.state && G.state.flags.doronDeal);

  const CAP_GOAL = 10;
  G.capProgress = () => Math.min(CAP_GOAL, G.state.stats.sixes || 0);
  // Abe's Rule #1 applies to on-screen counters too: 6 is shown as "5+1".
  G.sayable = (n) => (String(n).includes('6') ? (n - 1) + '+1' : String(n));

  S.gus = function* () {
    const f = flags(), s = G.state;
    if (s.items.cap) {
      yield G.say('Gus', 'Lawn\'s looking great. My petunias thank you.');
      return;
    }
    if (!f.capQuest) {
      yield G.say('Gus', 'Afternoon. Found this blowing around the quad this morning.');
      yield G.say(null, 'Gus holds up a brown corduroy {y}hat{/}.');
      yield G.say('Nate', 'MY HAT! That\'s mine!');
      yield G.say('Gus', 'Is it now. Very distinguished. Tell you what...');
      yield G.say('Gus', 'Those walking... uh... {r}sixes{/} have been tearing up my lawn all morning.');
      yield G.say('Nate', 'The {r}sacred numbers{/}. I\'m not allowed to say it.');
      yield G.say('Gus', '...Sure. Bonk {y}10{/} of your sacred numbers and the hat\'s all yours.');
      f.capQuest = true;
      const n = G.capProgress();
      if (n > 0) yield G.say('Gus', 'I saw you already got ' + G.sayable(n) + '. Those count. ' + G.sayable(CAP_GOAL - n) + ' to go.');
      else yield G.say('Gus', 'They\'re on the lawns south of the main path. Go get \'em.');
      if (n < CAP_GOAL) return;
    }
    const n = G.capProgress();
    if (n < CAP_GOAL) {
      yield G.say('Gus', 'That\'s ' + G.sayable(n) + ' so far. I need ' + CAP_GOAL + '. Keep bonking.');
      return;
    }
    yield G.say('Gus', 'Ten sacred numbers! My lawn is saved. A deal\'s a deal.');
    s.items.cap = true;
    yield G.itemGet(G.spr.cap, 'You got your {y}Hat{/} back! Corduroy. Distinguished. Yours.');
    yield G.say('Nate', 'Ahh. Now I can think clearly.');
    // the lucky cap comes with a heart container
    s.maxHp += 2;
    s.hp = s.maxHp;
    f.capHeart = true;
    yield G.itemGet(G.spr.heartBig, 'With his lucky hat back, Nate feels braver. You got a {r}Heart Container{/}! Max hearts +1.');
  };

  // The way east is closed until Nate has a reason to go AND his cap back.
  // ---------------------------------------------------------------- the chem final
  // Questions 1-4: the answer is always 6, so Nate has to answer the
  // roundabout way ("6" still counts, but it's a sacred number slip).
  // Question 5 is brutally hard and the answer is NOT 6: anyone coasting on
  // the pattern with "Half a dozen" gets it wrong.
  const CHEM_FINAL = [
    { q: 'How many carbon atoms are in a benzene ring?', opts: ['5', '6', 'Five plus one', '12'], answer: 2, note: 'Benzene is a ring of six carbons.' },
    { q: 'What is the atomic number of carbon?', opts: ['6', '12', 'Half a dozen', '14'], answer: 2, note: 'Carbon has six protons.' },
    { q: 'Quartz crystals grow as prisms with how many sides?', opts: ['4', 'One more than five', '6', '8'], answer: 1, note: 'Quartz is hexagonal. Six sides.' },
    { q: 'If [H+] is 10 to the -6 molar, what is the pH?', opts: ['6', '8', 'Slightly acidic: 5+1', '-6'], answer: 2, note: 'The pH is six. You of all people should know that.' },
    {
      hard: true, trap: 1,
      q: 'How many unpaired electrons does a gadolinium(III) ion have?',
      opts: ['6', 'Half a dozen', '7', '14'], answer: 2,
      note: 'Gadolinium(III) is 4f7. Seven unpaired electrons.',
    },
  ];

  S.chemFinal = function* () {
    const f = flags(), s = G.state;
    if (f.chemPerfect) {
      yield G.say('Dr. Moles', 'My star student! Go blow something up. Responsibly.');
      return;
    }
    if (!f.chemMet) {
      f.chemMet = true;
      yield G.say('Dr. Moles', 'Nate! You\'re late for the chemistry final.');
      yield G.say('Nate', 'Final? I have a ditch to save!');
      yield G.say('Dr. Moles', 'Five questions. Answer carefully.');
      yield G.say('Nate', 'How hard can it be?');
    } else {
      yield G.say('Dr. Moles', 'Back for a retake? Same five questions.');
    }
    const ready = yield G.ask('Dr. Moles', 'Ready to take the final?', ['Ready.', 'Not yet.']);
    if (ready !== 0) { yield G.say('Dr. Moles', 'Come back when you\'re ready. Study your hexagons.'); return; }

    let score = 0, slips = 0;
    for (let i = 0; i < CHEM_FINAL.length; i++) {
      const Q = CHEM_FINAL[i];
      if (Q.hard) yield G.say('Dr. Moles', 'And now... the final question. Nobody has ever gotten this one right.');
      const a = yield G.ask('Dr. Moles', 'Question ' + (i + 1) + ': ' + Q.q, Q.opts);
      if (a === Q.opts.indexOf('6')) {
        slips++;
        yield G.say('Nate', '6.');
        yield* slip();
        if (Q.hard) {
          yield G.say('Dr. Moles', 'Incorrect. AND you said the number. ' + Q.note);
        } else {
          score++;
          yield G.say('Dr. Moles', '...Correct. Why are you crying?');
        }
      } else if (a === Q.answer) {
        score++;
        if (Q.hard) yield G.say('Dr. Moles', '...Correct?! Nobody has EVER gotten that right!');
        else yield G.say('Dr. Moles', ['Correct!', 'Correct. Interesting phrasing.', 'Correct... I suppose.'][i % 3]);
      } else {
        yield G.say('Dr. Moles', 'Incorrect. ' + Q.note);
        if (Q.hard && a === Q.trap) {
          yield G.say('Nate', '...I just assumed it was the same as the others.');
          yield G.say('Dr. Moles', 'Never assume. That\'s the first rule of chemistry.');
        }
      }
    }

    yield G.say('Dr. Moles', 'Final score: ' + G.sayable(score) + ' out of 5.');
    if (score < 3) {
      yield G.say('Dr. Moles', 'You need 3 to pass. Retake it whenever you\'re ready.');
      return;
    }
    if (!f.chemPassed) {
      f.chemPassed = true;
      G.play.addTeeth(30);
      G.audio.sfx('tooth');
      yield G.say('Dr. Moles', 'You passed! Here, {y}30 shark teeth{/}. Don\'t ask why I have them.');
    }
    if (score === 5 && slips === 0) {
      f.chemPerfect = true;
      s.maxHp += 2;
      s.hp = s.maxHp;
      yield G.say('Dr. Moles', 'A perfect score, and you never said the number once. That deserves extra credit.');
      yield G.itemGet(G.spr.heartBig, 'Extra credit! You got a {r}Heart Container{/}! Max hearts +1.');
    } else if (score === 5) {
      yield G.say('Dr. Moles', 'A perfect score! But you said the sacred number. Retake it without saying it for {y}extra credit{/}.');
    } else {
      yield G.say('Dr. Moles', 'Get a perfect score without saying the sacred number for {y}extra credit{/}.');
    }
  };

  S.priya = function* () {
    yield G.say('Priya', 'I heard nobody has EVER gotten the last question on this final right.');
    yield G.say('Priya', 'Also, why are there fire extinguishers on every single wall in here?');
  };

  S.notEast = function* () {
    const p = P(), f = flags();
    if (!f.doronChat) {
      yield G.say('Nate', 'The fairgrounds? No time for that. Chesapeake is {y}south{/}, not east.');
    } else if (f.capQuest) {
      yield G.say('Nate', 'I\'m not showing up anywhere without my hat. {y}Gus{/} has it. Ten sacred numbers, then it\'s mine.');
    } else {
      yield G.say('Nate', 'I\'m not going anywhere without my {y}hat{/}. Someone on the quad must have seen it.');
    }
    yield G.walkTo(p, p.x - 20, p.y, 1);
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
    if (!f.doronChat) yield* S.doronChat();
  };

  // Doron invites the family to Micro Mayhem. Again. Nobody answers. Again.
  S.doronChat = function* () {
    flags().doronChat = true;
    yield G.wait(30);
    G.audio.sfx('buzz');
    yield G.emote(P(), 'bang', 30);
    yield G.say(null, 'Bzzt! Bzzt! The family group chat again.');
    yield G.text('Doron', 'MICRO MAYHEM WRESTLING. TONIGHT. easton fairgrounds');
    yield G.text('Doron', 'i have 6 tickets. who\'s coming');
    yield G.say(null, '{d}Seen by Lily, Abe, Hannah, Dad and Nani.{/}');
    yield G.text('Nani', 'Doron, you are a bright light in this world. Keep shining! Love, Nani');
    yield G.text('Doron', 'nani are you coming');
    yield G.say(null, '{d}Seen by Nani.{/}');
    yield G.say('Nate', '...Doron is basically a human forklift. If anyone can move this boulder, it\'s him.');
    yield G.say('Nate', 'The fairgrounds are {y}east{/} of campus. Looks like I\'m going to Micro Mayhem.');
  };

  // Doron at the fairgrounds: the pitch, the deal, and the exploding present.
  S.doron = function* (npc) {
    const f = flags(), s = G.state, w = G.play.world;
    if (f.doronDeal) {
      if (!f.ticketQuest) { yield* S.doronTickets(); return; }
      if (f.ticketsGiven && !f.ticketsDone) { yield* S.ticketsReward(); return; }
      if (!f.ticketsDone && s.items.tickets > 0) {
        yield G.say('Doron', 'Still ' + G.sayable(s.items.tickets) + ' tickets left. Try anybody! Fair people, campus people...');
        yield G.say('Doron', 'Or go inside and watch the main event. Your call. (Please pick the main event.)');
        return;
      }
      yield G.say('Doron', 'Main event\'s about to start! Get in there!');
      return;
    }
    yield G.say('Doron', 'NATE?! You came? You actually came to Micro Mayhem?!');
    yield G.say('Doron', 'I\'ve been inviting the family for YEARS. Nobody ever comes.');
    const c = yield G.ask('Doron', 'So you\'re coming to the show, right?', ['No.', 'Absolutely not.', 'I\'m only here for the boulder.']);
    yield G.say('Doron', c === 2 ? 'Boulder? ...I\'ll take that as a yes.' : 'I\'ll take that as a maybe.');
    yield G.say('Nate', 'There\'s a glacial erratic blocking the road to Chesapeake. I need someone who can lift a school bus.');
    yield G.say('Doron', 'Say less. I\'ll move your boulder...');
    yield G.say('Doron', '...AFTER the show. One match. That\'s the deal.');
    yield G.say('Doron', 'Oh, and get this: {y}Dad{/} actually said yes! First time EVER!');
    yield G.say('Doron', 'But he went to find seats an hour ago and never came back. Weird.');
    yield G.say('Nate', 'Fine. One match. Oh, and... I got you something.');

    // the present
    yield G.say(null, 'Nate hands Doron a beautifully wrapped present.');
    npc.held = G.spr.gift;
    npc.dir = 'down';
    yield G.wait(30);
    yield G.say('Doron', '...');
    yield G.say('Doron', 'The last time you gave me a present, it EXPLODED.');
    yield G.say('Nate', 'That was one time. This one\'s a peace offering.');
    yield G.say('Doron', '...Okay. Thanks, man. That\'s actually really sweet.');
    yield G.say(null, '*rip*');
    npc.held = null;
    G.play.explode(npc.x, npc.y - 12, false);
    npc.flashT = 40;
    w.pop(npc.x, npc.y - 34, 'AAAGH!!', '#ffffff');
    yield G.wait(70);
    yield G.say('Doron', 'EVERY. SINGLE. TIME.');
    yield G.say('Nate', 'Hehehe. Gets you every time.');

    // the pyro guy saw the whole thing
    const pete = w.add(new G.NPC({ sprite: 'pete', name: 'Pyro Pete', x: 28 * 16 + 8, y: 10 * 16 + 14, talk: S.pete }));
    yield G.walkTo(pete, 24 * 16 + 8, 10 * 16 + 14, 1.2);
    pete.dir = 'left';
    yield G.say('Pyro Pete', 'Whoa, whoa! Who rigged that?!');
    yield G.say('Nate', 'Me. Chemistry. And a LOT of wrapping paper.');
    yield G.say('Pyro Pete', 'Kid, that was beautiful. I run the pyro for tonight\'s show.');
    yield G.say('Pyro Pete', 'I\'ve got a whole crate of gift boxes backstage. Here, let\'s wrap you a few.');
    s.items.package = (s.items.package || 0) + 5;
    s.xItem = 'package';
    yield G.itemGet(G.spr.gift, 'You got {y}5 Booby-Trapped Packages{/}! Press {y}X{/} to set one down. It goes BANG a few seconds later.');
    yield G.say('Pyro Pete', 'Need more? I\'ll wrap you {y}5 for 10 shark teeth{/}. I\'ll be right here.');
    yield G.say('Doron', 'Can we PLEASE go watch wrestling now?');
    // the sun goes down and the fair lights up
    f.doronDeal = true;
    G.audio.sfx('secret');
    yield G.wait(30);
    yield G.say(null, 'The sun sinks low. String lights flicker on, and the Ferris wheel starts to turn.');
    yield* S.doronTickets();
  };

  // ---------------------------------------------------------------- Doron's spare tickets
  // He bought 6. One's his, one's Nate's. Nobody ever takes the other 4.
  const TICKET_REACTIONS = {
    'Superfan': { accept: true, lines: [['', 'A FREE TICKET?! I already have one, but now I can sit in TWO seats!']] },
    'Grandma Rose': { accept: true, lines: [['', 'Wrestling? At my age?'], ['', '...Absolutely. Do they still use the folding chairs?']] },
    'Gus': { accept: true, lines: [['', 'Haven\'t been to a wrestling show since \'89.'], ['', 'Sure. Why not. The lawn can wait.']] },
    'Devin': { accept: true, lines: [['', 'Is this another one of Abe\'s tricks?'], ['n', 'No. It\'s one of Doron\'s.'], ['', '...Fine. I\'ll go.']] },
    'Attendant': { lines: [['', 'I\'m working, kid. Also, no.']] },
    'Pyro Pete': { lines: [['', 'Kid, I\'m literally running the pyro.']] },
    'Big Earl': { lines: [['', 'Wrestling\'s fake.'], ['n', 'The pyro is real.'], ['', 'Still no.']] },
    'Prof. Schist': { lines: [['', 'I\'d rather watch sediment settle. And I do. Often.']] },
    'Maya': { lines: [['', 'I have a thing tonight.'], ['', '...The thing is not going to wrestling.']] },
    'Jordan': { lines: [['', 'Is that the show with the guy who yells about English? Hard pass.']] },
    'Vendor': { lines: [['', 'And leave my Doosh unattended? Never.']] },
    'Dr. Moles': { lines: [['', 'I have 200 finals to grade. Nobody got the last question right. Again.']] },
    'Priya': { lines: [['', 'I\'m literally in the middle of an exam.']] },
    'Referee': { lines: [['', 'I\'m already going. I\'m the REFEREE.']] },
  };

  S.doronTickets = function* () {
    const f = flags(), s = G.state;
    f.ticketQuest = true;
    s.items.tickets = 4;
    yield G.say('Doron', 'Oh, and... I still have 4 extra tickets. I bought 6, like always.');
    yield G.say('Doron', 'Nobody EVER takes them. If you find anyone who wants to come... anyone at all...');
    yield G.itemGet(G.spr.ticket, 'You got {y}4 Micro Mayhem Tickets{/}! Talk to people around town to offer them one.');
  };

  S.ticketReaction = function (npc) {
    const f = flags(), s = G.state;
    if (!f.ticketQuest || f.ticketsGiven || f.dadBeaten || !(s.items.tickets > 0)) return null;
    const r = TICKET_REACTIONS[npc.name];
    const key = 'ticket_' + npc.name;
    if (!r || f[key]) return null;
    return (function* () {
      f[key] = r.accept ? 'yes' : 'no';
      yield G.say('Nate', 'Hey! Want a free ticket to {y}Micro Mayhem Wrestling{/}?');
      for (const [who, line] of r.lines) yield G.say(who === 'n' ? 'Nate' : npc.name, line);
      if (!r.accept) return;
      s.items.tickets--;
      G.audio.sfx('select');
      if (s.items.tickets > 0) {
        yield G.say(null, 'Ticket given! {y}' + G.sayable(s.items.tickets) + '{/} left.');
      } else {
        f.ticketsGiven = true;
        yield G.say(null, 'That was the last ticket! Go tell {y}Doron{/}.');
      }
    })();
  };

  S.ticketsReward = function* () {
    const f = flags();
    yield G.say('Doron', 'Wait. You gave away ALL of them? People are actually COMING?!');
    yield G.say('Doron', 'This is the best day of my life.');
    yield G.say('Nate', 'Are you... crying?');
    yield G.say('Doron', 'It\'s the pyro smoke.');
    f.ticketsDone = true;
    G.play.addTeeth(30);
    yield G.itemGet(G.spr.toothGold, 'Doron gives you {y}30 shark teeth{/}. "For your trouble. And for being my brother."');
  };

  S.ferrisWheel = function* () {
    if (G.fairLit()) yield G.say(null, 'The Ferris wheel is turning! ...Nate is too busy saving a ditch to ride it.');
    else yield G.say(null, 'FERRIS WHEEL. Opens at 7 o\'clock.');
  };

  S.rose = function* () {
    if (flags()['ticket_Grandma Rose'] === 'yes') {
      yield G.say('Grandma Rose', 'Thank you for the ticket, dear. I\'ll be ringside!');
      return;
    }
    yield G.say('Grandma Rose', 'I come to the fair every year for the funnel cake. Six teeth! Can you believe it?');
  };

  S.earl = function* () {
    yield G.say('Big Earl', 'You ever notice how the Ferris wheel and the wrestlers both go in circles?');
    yield G.say('Big Earl', '...Me neither. Forget I said anything.');
  };

  // after the main event, ticket holders stick around ringside
  S.ringsideFan = function* (npc) {
    const lines = {
      Superfan: 'TWO SEATS! BEST NIGHT OF MY LIFE!',
      'Grandma Rose': 'That man in the blazer has wonderful form.',
      Gus: 'Haven\'t had this much fun since \'89.',
      Devin: 'Okay. This is actually incredible.',
    };
    yield G.say(npc.name, lines[npc.name] || 'WOOOO!');
  };

  S.pete = function* () {
    const s = G.state;
    const c = yield G.ask('Pyro Pete', 'Booby-Trapped Packages! {y}5 for 10 shark teeth{/}.', ['Buy 5', 'No thanks']);
    if (c !== 0) { yield G.say('Pyro Pete', 'Stay explosive, kid.'); return; }
    if ((s.items.package || 0) >= 10) { yield G.say('Pyro Pete', 'You\'re already carrying 10. Any more and you\'re a fire hazard.'); return; }
    if (s.teeth < 10) { yield G.say('Pyro Pete', 'Ten teeth, kid. Go bonk some wrestlers.'); return; }
    G.play.addTeeth(-10);
    s.items.package = Math.min(10, (s.items.package || 0) + 5);
    if (!s.xItem) s.xItem = 'package';
    G.audio.sfx('tooth');
    yield G.say(null, 'Got {y}5 Booby-Trapped Packages{/}!');
  };

  // The main event: Dad has become El EEENGLISH.
  S.mainEvent = function* () {
    const f = flags(), w = G.play.world, p = P();
    if (f.mainEvent) {
      // already volunteered (e.g. continuing a save): straight back to the ring
      G.play.warp('ring', 4, 5, 'right');
      return;
    }
    const doron = w.add(new G.NPC({ sprite: 'doron', name: 'Doron', x: p.x + 18, y: p.y, dir: 'up', talk: S.doron }));
    yield G.wait(20);
    yield G.say('Doron', 'We made it! Front row! Well... standing room. Same thing.');
    yield G.camFocus(12 * 16, 9 * 16 + 8, 40);
    G.audio.stop();
    G.audio.sfx('bell');
    yield G.wait(30);
    yield G.say('Referee', 'LADIES AND GENTLEMEN! It is time for tonight\'s... {y}MAIN EVENT{/}!');
    yield G.say('Referee', 'Making his debut... from parts unknown... weighing in at one dad...');
    yield G.say('Referee', 'EL... {r}EEENGLISHHHHH{/}!!!');
    G.audio.play('arena');
    const dad = w.add(new G.NPC({ sprite: 'elenglish', name: 'El EEENGLISH', x: 11 * 16 + 8, y: 2 * 16 + 10, dir: 'down' }));
    yield G.walkTo(dad, 11 * 16 + 8, 5 * 16 + 14, 0.9);
    yield G.walkTo(dad, 11 * 16 + 8, 9 * 16 + 14, 0.9);
    dad.dir = 'down';
    yield G.shakeCmd(24, 2);
    G.audio.sfx('yell');
    yield G.say('El EEENGLISH', 'DO YOU SPEAK... {y}EEEEENGLISH{/}?!');
    yield G.emote(p, 'huh', 40);
    yield G.say('Nate', '...Is that DAD?');
    doron.dir = 'up';
    yield G.say('Doron', 'DAD?! I\'ve been looking for you for an hour!');
    yield G.say('Nate', 'Look at his eyes. They\'re all swirly. {r}Father Eggmas{/} got to him!');
    yield G.say('El EEENGLISH', 'Ho... ho... ho... I mean... DO YOU SPEAK EEENGLISH?!');
    yield G.say('Referee', 'We need a challenger from the audience! Any volunteers?');
    yield G.say('Doron', 'MY BROTHER WILL DO IT!');
    yield G.say('Nate', 'Doron, NO--');
    yield G.say('Doron', 'You came to Micro Mayhem. Now you\'re IN Micro Mayhem.');
    f.mainEvent = true;
    G.play.warp('ring', 4, 5, 'right');
  };

  S.ringIntro = function* () {
    G.state.hp = G.state.maxHp; // start the main event fresh
    yield G.wait(20);
    G.audio.sfx('bell');
    yield G.banner('MAIN EVENT', 'NATE  vs.  EL EEENGLISH', 170);
    yield G.say('El EEENGLISH', 'DO YOU SPEAK EEENGLISH?!');
    yield G.say(null, 'Your hammer only works while he\'s {y}dizzy{/}. {y}Booby-Trapped Packages{/} (press X) stun him anytime.');
  };

  S.finishHint = function* () {
    yield G.say('Doron', 'He\'s on the ropes! Your hammer can\'t finish him!');
    yield G.say('Doron', 'Give him a {y}present{/}, Nate! Set down a {y}Booby-Trapped Package{/} (press X)!');
  };

  S.dadDefeated = function* (boss) {
    const w = G.play.world, p = P();
    G.audio.stop();
    for (const e of w.ents) if (e.enemy && e !== boss) { e.dead = true; w.burst(e.x, e.y - 8, ['#ffffff', '#e8e0f0'], 8); }
    for (const e of w.ents) if (e instanceof G.Letter) e.dead = true;
    G.audio.sfx('bell');
    yield G.shakeCmd(30, 3);
    yield G.wait(40);
    w.burst(boss.x, boss.y - 40, ['#1c2c6c', '#e8e8f0', '#d03038'], 14, { speed: 1.6, up: 1.2, g: 0.08, life: 40, size: 3 });
    w.pop(boss.x, boss.y - 50, 'THE MASK IS OFF!', '#ffffff');
    boss.dead = true;
    const dad = w.add(new G.NPC({ sprite: 'dad', name: 'Dad', x: boss.x, y: boss.y, dir: 'down' }));
    dad.flashT = 30;
    yield G.wait(50);
    yield G.banner('YOU WIN!', '1... 2... 3!', 150);
    dad.dir = G.dirToward(p.x - dad.x, p.y - dad.y);
    yield G.say('Dad', 'Do you speak... oh. Hello, boys.');
    yield G.say('Dad', 'Why am I wearing a mask?');
    const doron = w.add(new G.NPC({ sprite: 'doron', name: 'Doron', x: 7 * 16 + 8, y: 8 * 16 + 14, dir: 'up' }));
    yield G.walkTo(doron, dad.x - 20, dad.y + 6, 1.2);
    yield G.say('Nate', 'Father Eggmas brainwashed you, Dad.');
    yield G.say('Dad', 'The last thing I remember is a little egg man offering me a free ticket. He spoke excellent EEENGLISH.');
    yield G.say('Doron', 'Dad. You came to Micro Mayhem. You were the MAIN EVENT.');
    yield G.say('Dad', '...Was I good?');
    yield G.say('Doron', 'You were incredible.');
    yield G.say('Dad', 'Before you boys go... Nate, I made you something in my workshop.');
    yield* S.pipeGift();
    yield G.say('Doron', 'Okay, Nate. A deal\'s a deal. Let\'s go move your boulder.');
    const s = G.state;
    if (!s.party.includes('doron')) s.party.push('doron');
    flags().dadBeaten = true;
    G.audio.sfx('fanfare');
    yield G.banner('DORON JOINED THE PARTY!', 'He can lift and smash heavy things.', 220);
    yield G.say('Dad', 'You boys go on. I\'m staying for the nachos.');
    G.play.warp('arena', 11, 14, 'down');
  };

  // Dad's hand-carved pipe and the first smoke signal.
  S.pipeGift = function* () {
    const s = G.state, f = flags();
    s.items.pipe = true;
    if (!s.xItem) s.xItem = 'pipe';
    yield G.itemGet(G.spr.pipe, 'You got {y}Dad\'s Pipe{/}! Hand-carved in his workshop. Equip it to {y}X{/} to puff smoke signals.');
    yield G.say('Dad', 'A good pipe is like a good sermon. It takes patience, and it\'s best shared.');
    yield G.say('Dad', 'Every pipe has its signals. Here\'s one my father taught me. When things get rowdy, puff this.');
    f.signal_peace = true;
    G.audio.sfx('fanfare');
    yield G.banner('YOU LEARNED A SMOKE SIGNAL', 'Peace Be With You:  ' + G.arrows(['up', 'down', 'up']), 200);
    yield G.say('Dad', 'Peace be with you, son.');
  };

  // Smoke signal: calms every nearby enemy for about 10 seconds. Instant and
  // non-blocking (no banner), so the world never pauses for the pipe.
  const PEACE_RADIUS = 64; // about 4 tiles around Nate; the flash ring shows the reach
  S.signalPeace = function () {
    const p = P(), w = G.play.world;
    w.fx.push({ x: p.x, y: p.y - 6, vx: 0, vy: 0, circle: true, r: PEACE_RADIUS - 6, max: 24, life: 24, color: '#fff0a0' });
    w.pop(p.x, p.y - 34, 'PEACE BE WITH YOU', '#f8e070');
    let n = 0;
    for (const e of w.ents) {
      if (!e.enemy || e.boss || e.dead || Math.hypot(e.x - p.x, e.y - p.y) > PEACE_RADIUS) continue;
      e.calm = 600;
      n++;
    }
    if (!n) w.pop(p.x, p.y - 24, '(nobody to calm down)', '#c8c8d0');
  };

  S.dadArena = function* () {
    if (!G.state.items.pipe) {
      yield G.say('Dad', 'Nate! Before you go, I made you something in my workshop.');
      yield* S.pipeGift();
      return;
    }
    yield G.say('Dad', 'The nachos here are excellent. Very EEENGLISH.');
    yield G.say('Dad', 'If your mother asks, I was at a book club.');
  };

  // Doron suplexes the glacial erratic.
  S.boulderSmash = function* () {
    const f = flags(), w = G.play.world;
    const b = w.ents.find((e) => e instanceof G.Boulder);
    const d = w.ents.find((e) => e instanceof G.Follower && e.id === 'doron');
    if (!b || !d || f.boulderGone) return;
    yield G.say('Doron', 'This the rock?');
    yield G.say('Nate', 'It\'s a glacial erratic. It weighs about as much as a school bus.');
    yield G.say('Doron', 'Stand back.');
    const p = P();
    yield G.walkTo(p, b.x - 48, b.y - 40, 1.2);
    p.dir = 'right';
    d.hold = true;
    yield G.walkTo(d, b.x, b.y - 26, 1.2);
    d.dir = 'down';
    yield G.say('Doron', 'ARMY...');
    b.shakeT = 1;
    // hoist it overhead
    yield { start() { G.audio.sfx('dash'); }, update() { b.lift = (b.lift || 0) + 1; G.play.shake(2, 1); return b.lift >= 62; } };
    yield G.wait(20);
    yield G.say('Doron', '...SUPLEX!!!');
    yield { update() { b.lift -= 10; return b.lift <= 0; } };
    b.lift = 0;
    b.dead = true;
    f.boulderGone = true;
    G.play.explode(b.x, b.y - 16, false);
    G.play.shake(30, 4);
    w.burst(b.x, b.y - 16, ['#9c9892', '#cac6c0', '#5a5650', '#c8948a'], 24, { speed: 2.4, up: 1.5, g: 0.1, life: 45, size: 4 });
    yield G.wait(60);
    yield G.say('Nate', '...That rock survived the ice age.');
    yield G.say('Doron', 'It didn\'t survive leg day.');
    yield G.say('Nate', 'Where did you even learn that?');
    yield G.say('Doron', 'The Army. We suplexed boulders every morning before breakfast.');
    yield G.say('Nate', 'I don\'t think that\'s true.');
    yield G.say('Doron', 'You weren\'t there.');
    yield G.say('Nate', 'The road to Chesapeake is open!');
    d.hold = false;
  };

  S.southRoad = function* () {
    const p = P();
    yield G.say('Nate', 'Chesapeake is this way. Hang on, Number One Ditch. We\'re coming.');
    yield G.banner('TO BE CONTINUED...', 'The road south opens in the next update!', 300);
    yield G.walkTo(p, p.x, p.y - 18, 1);
  };

  // ---------------------------------------------------------------- home
  const inside = '(Dad\'s workshop opens up in a future update!)';

  // Mikey: flowers, balloons, a song he's been practicing, and one mission.
  S.mikeyIntro = function* () {
    const f = flags(), p = P(), m = G.play.world.mikey;
    if (f.mikeyMet || !m) return;
    f.mikeyMet = true;
    m.dir = G.dirToward(p.x - m.x, p.y - m.y);
    yield G.emote(m, 'bang', 30);
    yield G.say('Mikey', 'Nate! Oh, hi! Is... is Lily home?');
    yield G.say('Nate', 'Mikey? What\'s with the balloons?');
    yield G.say('Mikey', 'They\'re for Lily. So are the flowers. I\'ve also been practicing a song.');
    yield G.say('Mikey', 'Have you seen her? I really, really need to talk to her. It\'s important.');
    yield G.say('Nate', 'I just got here. I haven\'t seen her.');
    if (G.state.party.includes('doron')) {
      yield G.say('Doron', 'Who\'s the kid with the balloons?');
      yield G.say('Nate', 'Mikey. He has a... thing for Lily.');
      yield G.say('Doron', 'Oh no.');
    }
    yield G.say('Mikey', 'Then nobody\'s driving to Chesapeake until I talk to Lily. I\'ll be right here. With my balloons.');
  };

  S.mikey = function* (npc) {
    const f = flags();
    if (f.lilySaved && !f.mikeyBeaten) { yield* S.mikeyGoldenHour(); return; }
    if (!f.mikeyMet) { yield* S.mikeyIntro(); return; }
    const lines = [
      'Have you found Lily yet? I\'ll wait. I\'m very good at waiting.',
      'The balloons are starting to droop a little. That\'s fine. I\'m fine.',
      'I\'ve been practicing my song all week. It\'s about a golden... hour.',
      'Nobody drives to Chesapeake until I talk to Lily. That\'s the rule now.',
    ];
    f.mikeyTalk = ((f.mikeyTalk || 0) + 1) % lines.length;
    yield G.say('Mikey', lines[f.mikeyTalk]);
  };

  // Try to leave and Mikey sprints over to block the road.
  S.mikeyBlock = function* (side) {
    const f = flags(), p = P(), w = G.play.world, m = w.mikey;
    if (!m) return;
    f.mikeyMet = true;
    const back = side === 'west' ? 1 : -1;
    yield G.walkTo(m, 43 * 16 + 8, 53 * 16 + 10, 4);
    yield G.walkTo(m, G.clamp(p.x - back * 16, 8, w.pw - 8), p.y, 4);
    m.dir = G.dirToward(p.x - m.x, p.y - m.y);
    if (!f.mikeyBlocked) {
      f.mikeyBlocked = true;
      yield G.say('Mikey', 'WAIT! Nate! You can\'t drive to Chesapeake yet!');
      yield G.say('Mikey', 'Not until you bring me Lily. I have flowers. I have balloons. I have a SONG.');
      yield G.say('Nate', '...Fine. I\'ll find her.');
    } else {
      yield G.say('Mikey', ['Lily first. Then you can drive to Chesapeake.', 'Nope. Not until I see Lily.', 'The balloons and I are not moving.'][Math.floor(Math.random() * 3)]);
    }
    yield G.walkTo(p, p.x + back * 28, p.y, 1.4);
    yield G.walkTo(m, 43 * 16 + 8, 53 * 16 + 10, 4);
    yield G.walkTo(m, m.home.x, m.home.y, 3);
    m.dir = 'down';
  };
  S.homeGarage = function* () {
    const f = flags(), s = G.state;
    if (f.fridgeGame && !s.items.milk && !f.badlandsBeaten) {
      yield G.say(null, 'The garage, with Dad\'s workshop inside. In the corner, the old garage fridge hums like a jet engine.');
      yield G.say(null, 'Inside: pickles, a tub of fishing worms, and one carton of {y}milk{/}. Expiration date: unclear.');
      yield* getIngredient('milk');
      return;
    }
    yield G.say(null, 'The garage, with Dad\'s workshop inside: pipe blanks, rasps, sandpaper, and about four hundred coffee cans full of screws.');
    yield G.say(null, inside);
  };
  S.homeFlag = function* () {
    yield G.say(null, 'The flag on its pole, snapping in the breeze. You can see it all the way from the road.');
  };
  S.homePoolSet = function* () {
    yield G.say(null, 'A teak table under a dark green umbrella. Lunch by the pool hits different.');
  };
  S.homeLounger = function* () {
    yield G.say(null, 'A teak lounge chair. Somebody left a towel on it to save their spot. In October.');
  };
  S.homeAdirondack = function* () {
    yield G.say(null, 'A green Adirondack chair under the old oak. The best seat on the whole property.');
  };
  S.homeGatepost = function* () {
    yield G.say(null, 'A white gatepost with a ball on top. There\'s one on each side of the driveway.');
  };
  // Nate's secret chemistry supplier.
  S.homePoolHouse = function* () {
    const f = flags(), party = G.state.party;
    if (f.chlorine) {
      yield G.say(null, 'The pool house. The chlorine bucket is still mysteriously half empty. Nate is still not sorry.');
      return;
    }
    f.chlorine = true;
    yield G.say(null, 'The little white pool house: a porch, a white rocking chair, and the flag on a bracket.');
    yield G.say(null, 'Inside: towels, pool noodles, a skimmer net... and a bucket of chlorine that is somehow ALWAYS half empty.');
    yield G.say('Nate', '...I borrow it. For experiments.');
    if (party.includes('doron')) yield G.say('Doron', 'So THAT\'S where it all went.');
    if (party.includes('lily')) yield G.say('Lily', 'That\'s why the pool turned green every summer, Nate.');
    yield G.say('Nate', 'Science requires sacrifices. Mostly the pool.');
  };
  S.homeTruck = function* () {
    yield G.say(null, 'Dad\'s old teal Ford pickup. It runs. Mostly.');
  };
  S.homeCoop = function* () {
    yield G.say(null, 'The chicken coop. Somebody has been laying eggs in there.');
    yield G.say('Nate', '...Hopefully not Father Eggmas.');
  };
  S.homeGreenhouse = function* () {
    yield G.say(null, 'The little greenhouse, packed with seedlings.');
  };
  S.homeFirewood = function* () {
    yield G.say(null, 'A neat stack of split firewood. Dad did all of it by hand.');
  };
  S.homePatio = function* () {
    yield G.say(null, 'The stone patio: the umbrella, the grill, and the best seat in the house for sunsets.');
  };
  S.homePool = function* () {
    yield G.say(null, 'The pool. Nate learned to swim here. (Swimming not included.)');
  };
  S.homeLawnSet = function* () {
    yield G.say(null, 'White wrought-iron chairs and a yellow lawn chair. Comfy for about four minutes.');
  };
  S.homeSUV = function* () {
    yield G.say(null, 'A navy SUV, parked in its usual spot by the house.');
  };
  S.homeHoop = function* () {
    yield G.say(null, 'The driveway hoop. Countless games of H-O-R-S-E were lost here.');
  };
  S.homePicnic = function* () {
    yield G.say(null, 'The picnic table. Every summer cookout ends up right here.');
  };
  S.homeMailbox = function* () {
    yield G.say(null, 'The mailbox. Inside: a catalog, a bill, and a postcard from Nani that just says "SHINE!"');
  };
  S.homeStreetSign = function* () {
    yield G.say(null, 'RATTLESNAKE BRIDGE RD.');
    yield G.say(null, 'Bedminster, New Jersey.');
  };
  // Leaving home from either end of the road: back to campus, or the long
  // drive to Chesapeake (which Mikey blocks until Lily is saved).
  S.homeLeave = function* (side) {
    const p = P(), back = side === 'west' ? 1 : -1;
    const c = yield G.ask('Nate', 'Where to?', ['Back to Lafayette', 'Drive to Chesapeake', 'Stay home']);
    if (c === 0) { G.play.warp('campus', 19, 27, 'up'); return; }
    if (c === 1) {
      if (!flags().lilySaved) { yield* S.mikeyBlock(side); return; }
      if (!flags().mikeyBeaten) { yield* S.mikeyGoldenHour(); return; }
      yield* S.homeEast(side);
      return;
    }
    yield G.walkTo(p, p.x + back * 24, p.y, 1.2);
  };

  S.homeEast = function* (side) {
    const p = P(), back = side === 'west' ? 1 : -1;
    yield G.say('Nate', 'Chesapeake is still a long way down this road.');
    yield G.banner('TO BE CONTINUED...', 'The road to Chesapeake opens in a future update!', 240);
    yield G.walkTo(p, p.x + back * 24, p.y, 1);
  };
  S.homeNorth = function* () {
    const p = P();
    yield G.say('Nate', 'Past the bridge it\'s just woods, deer and ticks. Nothing out there... yet.');
    yield G.walkTo(p, p.x, p.y + 20, 1);
  };

  // ---------------------------------------------------------------- Badlands Chugs and the refrigerator game
  // Lily is locked in the kitchen fridge. The only way to get her out: beat
  // Badlands at the refrigerator game with the nastiest drink Nate can make.
  const INGREDIENTS = [
    { id: 'milk', name: 'Milk', icon: () => G.spr.milk },
    { id: 'dye', name: 'Blue Food Coloring', icon: () => G.spr.dye },
    { id: 'smoke', name: 'Liquid Smoke', icon: () => G.spr.liquidSmoke },
    { id: 'vodka', name: 'Vodka Shooters', icon: () => G.spr.vodka },
  ];
  G.INGREDIENTS = INGREDIENTS;
  G.ingredientCount = () => INGREDIENTS.filter((g) => G.state.items[g.id]).length;

  function* getIngredient(id) {
    const g = INGREDIENTS.find((x) => x.id === id);
    G.state.items[id] = true;
    yield G.itemGet(g.icon(), 'You got {y}' + g.name + '{/}! (' + G.sayable(G.ingredientCount()) + '/4 ingredients)');
    if (G.ingredientCount() === 4) yield G.say('Nate', 'That\'s everything. Time to make the worst drink in New Jersey.');
  }

  // Lily thumping around inside the fridge.
  function* fridgeThump() {
    const fr = G.play.world.fridge;
    if (fr) fr.shakeT = 30;
    G.audio.sfx('bump');
    yield G.wait(10);
    G.audio.sfx('bump');
    yield G.say('Lily', '{d}(from inside the fridge){/} MMMPH! MMMMPH!');
  }

  S.badlandsIntro = function* () {
    const f = flags(), w = G.play.world, p = P(), b = w.badlands;
    if (!b || f.badlandsMet) return;
    f.badlandsMet = true;
    G.audio.play('chug');
    yield G.camFocus(b.x - 20, b.y - 10, 40);
    b.dir = 'down';
    yield G.say('Badlands Chugs', 'What\'s up, everybody! Badlands Chugs here. Today\'s video is a SPECIAL one.');
    b.dir = 'left';
    yield* fridgeThump();
    b.dir = 'down';
    yield G.say('Badlands Chugs', 'We got a girl in the fridge. We gonna put her in this blender... liquify her...');
    G.audio.sfx('buzz');
    yield G.shakeCmd(20, 1);
    yield G.say('Badlands Chugs', '...and CHUG her. Ten million views. Easy.');
    yield G.camFocus(null, null, 20);
    yield G.emote(p, 'bang', 40);
    yield G.say('Nate', 'LILY?! That\'s my SISTER in there!');
    yield* fridgeThump();
    b.dir = G.dirToward(p.x - b.x, p.y - b.y);
    yield G.say('Badlands Chugs', 'Ayy, the brother! You can be in the video. Say hi to the people.');
    yield G.say('Nate', 'You are NOT chugging my sister!');
    yield G.say('Badlands Chugs', 'Who\'s gonna stop me? Ain\'t nobody ever out-chugged Badlands.');
    if (G.state.party.includes('doron')) {
      yield G.say('Doron', 'I could suplex him.');
      yield G.say('Badlands Chugs', 'Don\'t touch dat.');
      yield G.say('Doron', '...He said not to touch that.');
    }
    yield G.say('Nate', '...Then I challenge you. To the {y}refrigerator game{/}.');
    yield G.emote(b, 'bang', 40);
    G.audio.sfx('bell');
    yield G.say('Badlands Chugs', '...The refrigerator game. Oh, you know the rules?');
    yield G.say('Badlands Chugs', 'I make you a drink. You chug it, and you guess what\'s in it. Then you make me one, and I chug yours.');
    yield G.say('Badlands Chugs', 'I finish yours, she goes in the blender. I CAN\'T finish yours... she\'s all yours.');
    yield G.say('Badlands Chugs', 'Go find the nastiest stuff you can. I\'ll be right here. And don\'t touch dat fridge.');
    yield G.say('Nate', 'Okay. Think like a chemist. Things that should never, ever be in the same glass.');
    yield G.say('Nate', '{y}Milk{/}: Dad keeps some in the garage fridge. {y}Liquid smoke{/}: with the grill stuff out on the patio.');
    yield G.say('Nate', '{y}Blue food coloring{/}: my old chemistry set, upstairs. And {y}vodka shooters{/}...');
    yield G.say('Nate', 'Somebody in this house hides those in a book. Probably a book nobody would ever read.');
    f.fridgeGame = true;
    yield G.banner('THE REFRIGERATOR GAME', 'Find: Milk, Blue Food Coloring, Liquid Smoke, Vodka Shooters', 240);
  };

  S.badlands = function* () {
    const f = flags(), n = G.ingredientCount();
    if (!f.badlandsMet) { yield* S.badlandsIntro(); return; }
    if (n >= 4) { yield* S.fridgeGame(); return; }
    const lines = [
      'Clock\'s ticking. The blender\'s warming up.',
      'Nastiest stuff in the house. Don\'t come back here with no lemonade.',
      'You got ' + G.sayable(n) + ' out of 4. I can count, young man.',
      'Don\'t touch dat fridge.',
    ];
    f.badTalk = ((f.badTalk || 0) + 1) % lines.length;
    yield G.say('Badlands Chugs', lines[f.badTalk]);
  };

  S.badlandsPhone = function* () {
    if (flags().badlandsBeaten) {
      yield G.say(null, 'Badlands\' phone, still on its tripod. Still recording.');
      yield G.say(null, 'The upload is already live: "I CHUGGED THE WORST DRINK EVER (GONE WRONG)". 2.3 million views and climbing.');
      return;
    }
    yield G.say(null, 'A phone on a tripod. The little red light means it\'s recording.');
    yield G.say('Nate', 'Hi, Nani.');
  };

  S.fridgeTalk = function* () {
    if (flags().badlandsBeaten) { yield G.say(null, 'The fridge. Lily refuses to go near it ever again.'); return; }
    yield* fridgeThump();
    if (G.play.world.badlands) yield G.say('Badlands Chugs', 'Ah-ah-ah. Don\'t touch dat.');
  };

  // ---- the ingredient hunt
  S.chemDesk = function* () {
    const f = flags(), s = G.state;
    if (f.fridgeGame && !s.items.dye && !f.badlandsBeaten) {
      yield G.say(null, 'Nate\'s old chemistry set. A flame test kit, a lava lamp, and a bottle of {y}blue food coloring{/} from the "make your own lava lamp" experiment.');
      yield* getIngredient('dye');
      const desk = G.play.world.chemDesk;
      if (desk) desk.img = G.spr.chemDeskEmpty;
      return;
    }
    yield G.say(null, 'Nate\'s old chemistry set. This is where it all began. The scorch mark on the ceiling is from 2017.');
  };

  S.denShelf = function* () {
    const f = flags(), s = G.state;
    if (f.fridgeGame && !s.items.vodka && !f.badlandsBeaten) {
      yield G.say(null, 'Built-in shelves packed with books. One is a suspiciously light copy of "War and Peace."');
      yield G.say(null, 'It\'s hollow! Inside: three {y}vodka shooters{/}.');
      yield G.say('Nate', 'Nobody in this family has ever read "War and Peace." Now we know why.');
      yield* getIngredient('vodka');
      return;
    }
    yield G.say(null, 'Built-in shelves packed with books: thrillers, cookbooks, and seven different Bibles.');
  };

  S.homeGrill = function* () {
    const f = flags(), s = G.state;
    if (f.fridgeGame && !s.items.smoke && !f.badlandsBeaten) {
      yield G.say(null, 'Dad\'s grill. Tongs, a wire brush, and a little bottle of {y}Liquid Smoke{/}.');
      yield G.say('Nate', 'Hickory flavor. Perfect. Terrible. Perfect.');
      yield* getIngredient('smoke');
      return;
    }
    yield* S.homePatio();
  };

  // ---- the refrigerator game itself
  const ROUNDS = [
    {
      taste: 'First taste: salty. Sour. Kind of... briny? And there are crunchy bits.',
      hint: 'It tastes exactly like it came out of a jar with a dill on the label.',
      options: ['Orange juice', 'Pickle juice', 'Maple syrup', 'Chocolate milk'], answer: 1,
    },
    {
      taste: 'Next gulp: thick. Creamy. Eggy. It coats the inside of Nate\'s whole mouth.',
      hint: 'It\'s the white stuff that goes on a turkey sandwich. Wobbly.',
      options: ['Whipped cream', 'Yogurt', 'Mayonnaise', 'Pudding'], answer: 2,
    },
    {
      taste: 'Last swallow: it BURNS. Vinegar and red pepper. Nate\'s eyes are watering.',
      hint: 'It comes in a little bottle and you shake it onto eggs.',
      options: ['Ketchup', 'Mustard', 'Horseradish', 'Hot sauce'], answer: 3,
    },
  ];

  S.fridgeGame = function* () {
    const f = flags(), w = G.play.world, p = P(), b = w.badlands;
    G.audio.play('chug');
    b.dir = G.dirToward(p.x - b.x, p.y - b.y);
    yield G.say('Badlands Chugs', 'You got your ingredients? Aight. But the refrigerator game got rules. Guest goes first.');
    yield G.say('Nate', 'Wait. I have to drink something TOO?');
    yield G.say('Badlands Chugs', 'Every time. Don\'t worry. I made it special.');
    b.dir = 'up';
    w.blender.img = G.spr.blenderFull;
    G.audio.sfx('buzz');
    yield G.shakeCmd(40, 1);
    yield G.wait(50);
    w.boot.img = G.spr.bootSludge;
    b.dir = G.dirToward(p.x - b.x, p.y - b.y);
    yield G.say(null, 'Badlands pours a lumpy, gray-green sludge into the giant glass boot and slides it over.');
    yield G.say('Badlands Chugs', 'Chug it. Then tell me what\'s in it.');
    for (let i = 0; i < 3; i++) { G.audio.sfx('gulp'); yield G.wait(22); }
    yield G.shakeCmd(24, 2);
    yield G.emote(p, 'bang', 40);
    yield G.say('Nate', 'BLEGH. Okay. Okay. I can figure this out. It\'s just chemistry.');
    w.boot.img = G.spr.boot;
    const right = ['Yup.', 'Mm-hm. Correct.', 'Dang. You got a tongue on you.'];
    for (let r = 0; r < ROUNDS.length; r++) {
      const R = ROUNDS[r];
      for (let tries = 0; ; tries++) {
        yield G.say('Nate', R.taste + (tries ? ' ' + R.hint : ''));
        const pick = yield G.ask('Badlands Chugs', 'So what\'s in it?', R.options);
        if (pick === R.answer) { G.audio.sfx('secret'); yield G.say('Badlands Chugs', right[r]); break; }
        G.audio.sfx('buzz');
        yield G.say('Badlands Chugs', 'NOPE. Take another sip.');
        G.audio.sfx('gulp');
        yield G.shakeCmd(16, 2);
      }
    }
    yield G.say('Badlands Chugs', 'Pickle juice, mayo and hot sauce. ...Respect. You got a stomach of steel, young man.');
    yield G.say('Badlands Chugs', 'Now. My turn. Whatchu got for me?');
    // Nate mixes the worst drink in New Jersey
    G.audio.play('house');
    yield G.say(null, 'Nate pours in the {y}milk{/}...');
    w.boot.img = G.spr.bootMilk; G.audio.sfx('menu');
    yield G.say(null, '...squeezes in the whole bottle of {y}blue food coloring{/}...');
    w.boot.img = G.spr.bootBlue; G.audio.sfx('menu');
    yield G.say(null, '...a big glug of {y}liquid smoke{/}...');
    w.burst(w.boot.x + 7, w.boot.y + 2, ['#8a8a94', '#b0b0b8', '#d8d8e0'], 10, { speed: 0.4, up: 0.6, life: 50, size: 3 });
    G.audio.sfx('poof');
    yield G.say(null, '...and all three {y}vodka shooters{/}.');
    G.audio.sfx('gulp');
    yield G.say('Nate', 'Milk, blue food coloring, liquid smoke and vodka. Chemically speaking, this should not exist.');
    yield G.emote(b, 'huh', 40);
    yield G.say('Badlands Chugs', 'It\'s blue. Why is it blue? And why is it... SMOKING?');
    yield G.say('Badlands Chugs', '...Ain\'t nothing Badlands can\'t chug. Don\'t touch dat.');
    // the chug
    G.audio.play('chug');
    w.boot.img = null;
    b.held = G.spr.bootBlue;
    b.dir = 'down';
    for (let i = 0; i < 7; i++) { G.audio.sfx('gulp'); w.pop(b.x, b.y - 36 - i * 2, 'GLUG', '#78c8ff'); yield G.wait(16); }
    b.held = G.spr.boot;
    yield G.wait(30);
    yield G.say('Badlands Chugs', '...Finished. Told y\'all. Ain\'t nothing I can\'t...');
    b.held = null;
    b.sprite = 'badlands_blue';
    b.flashT = 60;
    G.audio.stop();
    G.audio.sfx('slip');
    yield G.shakeCmd(60, 2);
    yield G.wait(60);
    yield G.say('Badlands Chugs', '...uh oh.');
    yield G.wait(20);
    // KABOOM
    G.play.explode(b.x, b.y - 14, false);
    w.burst(b.x, b.y - 14, ['#3a6ae8', '#78c8ff', '#ffffff', '#f4f4f0'], 30, { speed: 2.6, up: 1, g: 0.05, life: 50, size: 3 });
    w.burst(b.x, b.y - 10, ['#8a8a94', '#b0b0b8', '#5a5a64'], 16, { speed: 0.8, up: 0.5, life: 70, size: 5 });
    w.pop(b.x, b.y - 46, 'KA-BLOOEY!', '#78c8ff');
    G.play.shake(50, 5);
    yield G.walkTo(b, b.x, b.y - 240, 6);
    b.dead = true;
    yield G.wait(50);
    w.pop(p.x, p.y - 56, '...LIKE AND SUBSCRIBE!', '#f8d850');
    yield G.wait(80);
    yield G.say('Nate', '...He went through the roof.');
    f.badlandsBeaten = true;
    yield* S.lilyRescue();
  };

  S.lilyRescue = function* () {
    const f = flags(), w = G.play.world, p = P(), s = G.state;
    yield G.walkTo(p, 25 * 16, 4 * 16 + 14, 1.2);
    p.dir = 'up';
    yield G.say('Nate', 'Hang on, Lily!');
    G.audio.sfx('door');
    w.fridge.img = G.spr.fridgeOpen;
    w.burst(25 * 16, 3 * 16, ['#ffffff', '#d8f0ff', '#a8d8f8'], 24, { speed: 1.4, up: 0.4, life: 40, size: 2 });
    const lily = w.add(new G.NPC({ sprite: 'lily', name: 'Lily', x: 25 * 16, y: 3 * 16 + 12, dir: 'down' }));
    lily.flashT = 40;
    yield G.walkTo(p, p.x + 18, p.y + 6, 1.4);
    p.dir = 'left';
    yield G.walkTo(lily, lily.x, 4 * 16 + 14, 0.8);
    G.audio.play('home');
    yield G.say('Lily', 'It is FREEZING in there. How long was I in the fridge?!');
    yield G.say('Nate', 'Long enough. Are you okay?');
    yield G.say('Lily', 'I\'m fine. I was next to the leftover lasagna the whole time. We bonded.');
    yield G.say('Lily', 'Wait. Was that... Badlands Chugs? THE Badlands Chugs?');
    yield G.say('Nate', 'He wanted to put you in a blender.');
    yield G.say('Lily', '...I\'m still subscribed.');
    if (s.party.includes('doron')) {
      yield G.say('Doron', 'Lily! You\'re okay! Want to see my suplex?');
      yield G.say('Lily', 'No.');
    }
    if (!s.party.includes('lily')) s.party.push('lily');
    f.lilySaved = true;
    G.audio.sfx('fanfare');
    yield G.banner('LILY JOINED THE PARTY!', 'Her "No." can stop anything.', 220);
    yield G.say('Lily', 'Wait. Is Mikey still outside? With the balloons?');
    yield G.say('Nate', 'And a song.');
    yield G.say('Lily', 'Ugh. Okay. Let\'s go get this over with.');
    lily.dead = true;
    const idx = s.party.filter((id) => id !== 'nate').indexOf('lily');
    w.add(new G.Follower('lily', idx, lily.x, lily.y, 'down'));
  };

  // ---------------------------------------------------------------- Golden Hour (Lily vs. Mikey)
  S.mikeyGoldenHour = function* () {
    const f = flags(), w = G.play.world, m = w.mikey, p = P();
    if (!m || f.mikeyBeaten || !f.lilySaved) return;
    m.dir = G.dirToward(p.x - m.x, p.y - m.y);
    yield G.emote(m, 'bang', 40);
    yield G.say('Mikey', 'LILY! You\'re okay! I was so worried. I brought flowers. And balloons. Heart-shaped ones.');
    yield G.say('Lily', 'Hi, Mikey.');
    yield G.say('Mikey', 'I\'ve been practicing all week. This one\'s for you. It\'s about that hour... when the light gets all golden.');
    yield G.say('Lily', 'Mikey, no.');
    yield G.say('Mikey', 'I haven\'t even STARTED!');
    G.audio.stop();
    yield G.say('Nate', '...Lily. I think this one is yours.');
    yield G.say('Lily', 'Fine. Hold my phone.');
    G.state.playAs = 'lily';
    G.play.warp('goldenHour', 3, 5, 'right');
  };

  S.goldenIntro = function* () {
    G.state.hp = G.state.maxHp;
    yield G.wait(20);
    yield G.banner('GOLDEN HOUR', 'LILY  vs.  MIKEY', 170);
    yield G.say('Mikey', 'Okay. Okay. Here goes. Ahem. {p}~ Laaa la la laaa... ~{/}');
    yield G.say(null, 'You\'re playing as {p}Lily{/}! Press {y}Z{/} to say {y}"No."{/}');
    yield G.say(null, 'Pop his heart balloons first. When they\'re all gone, tell HIM no.');
  };

  S.mikeyDefeated = function* (boss) {
    const w = G.play.world, s = G.state;
    G.audio.stop();
    for (const e of w.ents) if (e instanceof G.Note || e instanceof G.HeartShot) { e.dead = true; w.burst(e.x, e.y - 6, ['#f8d040', '#ff98d0'], 4); }
    G.audio.sfx('bell');
    yield G.shakeCmd(30, 3);
    w.pop(boss.x, boss.y - 44, 'NO.', '#ffffff');
    yield G.wait(60);
    yield G.banner('YOU WIN!', 'Lily said no.', 160);
    const mikey = w.add(new G.NPC({ sprite: 'mikey', name: 'Mikey', x: boss.x, y: boss.y, dir: 'left' }));
    mikey.held = G.spr.bouquet;
    boss.dead = true;
    yield G.say('Mikey', '...Was it the song?');
    yield G.say('Lily', 'It wasn\'t the song, Mikey. It was the balloons, the roadblock, AND the song.');
    yield G.say('Mikey', '...So that\'s a no.');
    yield G.say('Lily', 'That\'s a no.');
    yield G.say('Mikey', 'Okay. Okay. I respect that.');
    yield G.say('Mikey', 'Can I at least keep the flowers?');
    yield G.say('Lily', 'Keep the flowers, Mikey.');
    yield G.walkTo(mikey, mikey.x + 140, mikey.y, 1.1);
    mikey.dead = true;
    flags().mikeyBeaten = true;
    s.playAs = null;
    yield G.say('Nate', 'That was the most powerful "No." I have ever witnessed.');
    yield G.say('Lily', 'Thank you. Now can we go? The ditch isn\'t going to save itself.');
    G.play.warp('home', 43, 50, 'down');
  };

  // ---------------------------------------------------------------- home critters
  const CRITTER_LINES = {
    corn: [['Nate', 'My CORN?! I kept a bunch of corn on the cob in my room and now it\'s ALIVE.'], ['Nate', 'Father Eggmas, you monster.']],
    cereal: [['Nate', 'That\'s my cereal! I go through a box a day. I guess they finally fought back.']],
    firework: [['Nate', 'Those are MY fireworks! I knew I should have stored them in the garage.']],
    flower: [['Nate', 'Snapdragons. Living up to the name.']],
    gourd: [['Nate', 'Birdhouse gourds. Hopping. Something is definitely living in there.']],
    bear: [['Nate', 'A BEAR! Bedminster really does have bears!']],
  };
  S.critterIntro = function (kind) {
    const f = flags();
    if (f['met_' + kind]) return;
    f['met_' + kind] = true;
    const lines = CRITTER_LINES[kind].slice();
    if (kind === 'bear' && G.state.party.includes('doron')) lines.push(['Doron', 'I could take him.'], ['Nate', 'Do NOT suplex the bear.']);
    G.script.run((function* () { for (const [who, text] of lines) yield G.say(who, text); })());
  };

  // ---------------------------------------------------------------- the Bean Incident
  // Another true family story: Abe put an unopened can of beans in the fire.
  // It blew a hole through the bottom of the steel fire pit and flew across
  // the yard, raining burning embers and beans.
  S.homeFirePit = function* () {
    const f = flags(), s = G.state, w = G.play.world, p = P();
    if (f.beans) {
      yield G.say(null, 'The fire pit, with a bean-can-sized hole blown through the bottom. Abe is no longer allowed near it with groceries.');
      return;
    }
    f.beans = true;
    yield G.say(null, 'The steel fire pit. There\'s a jagged hole blown clean through the bottom.');
    yield G.say('Nate', '...Ah. The Bean Incident.');
    if (s.party.includes('doron')) yield G.say('Doron', 'ABE.');
    yield G.say('Nate', 'Abe wanted to know what happens if you put a can of beans in the fire. Unopened.');
    // flashback
    yield G.fadeOut(20);
    G.flashback = true;
    const hide = (v) => { p.hidden = v; for (const e of w.ents) if (e instanceof G.Follower) e.hidden = v; };
    hide(true);
    const pit = { x: 14 * 16 + 8, y: 39 * 16 + 9 };
    const abe = w.add(new G.NPC({ sprite: 'abe', name: 'Abe', x: pit.x - 6, y: pit.y + 20, dir: 'up' }));
    const can = w.add(new G.Thing(pit.x, pit.y + 2, G.spr.beanCan));
    yield G.camFocus(pit.x + 56, pit.y - 16, 1);
    yield G.fadeIn(20);
    yield G.banner('FLASHBACK', 'The front yard, one fateful night', 120);
    yield G.say('Abe', 'Science. One can of beans. Straight into the fire.');
    for (let i = 0; i < 3; i++) {
      G.audio.sfx('fuse');
      w.pop(pit.x, pit.y - 16, 'hisssss...', '#c8c8d0');
      w.burst(pit.x, pit.y - 6, ['#f8a028', '#f8d040'], 3, { speed: 0.6, up: 0.6, life: 16, size: 1 });
      yield G.wait(36);
    }
    yield G.say('Abe', '...Is it supposed to bulge like that?');
    // KA-BEAN
    G.audio.sfx('boom');
    G.play.shake(40, 4);
    w.fx.push({ x: pit.x, y: pit.y - 6, vx: 0, vy: 0, circle: true, r: 30, max: 14, life: 14, color: '#fff0c0' });
    w.burst(pit.x, pit.y - 6, ['#f8a028', '#e85820', '#f8d040'], 26, { speed: 2.4, up: 1, g: 0.06, life: 40, size: 2 });
    w.burst(pit.x, pit.y - 6, ['#8a4a28', '#a85a30', '#6a3418'], 18, { speed: 1.8, up: 1.4, g: 0.08, life: 50, size: 2 });
    w.pop(pit.x, pit.y - 30, 'KA-BEAN!', '#f8a028');
    abe.dir = 'up';
    yield G.emote(abe, 'bang', 20);
    // the can rockets across the whole yard, raining embers and beans
    const path = [[pit.x + 30, pit.y - 22], [pit.x + 70, pit.y - 34], [pit.x + 110, pit.y - 36], [pit.x + 150, pit.y - 28], [pit.x + 185, pit.y - 10], [pit.x + 215, pit.y + 14]];
    for (const [tx, ty] of path) {
      yield G.walkTo(can, tx, ty, 3.4);
      w.burst(can.x, can.y - 4, ['#f8a028', '#e85820', '#8a4a28', '#a85a30', '#f8d040'], 8, { speed: 0.8, up: 0.2, g: 0.07, life: 50, size: 2 });
    }
    G.audio.sfx('clank');
    w.pop(can.x, can.y - 14, 'clank.', '#c8c8d0');
    yield G.wait(50);
    abe.dir = 'right';
    yield G.say('Abe', '...Huh.', { top: true });
    yield G.fadeOut(20);
    abe.dead = true;
    can.dead = true;
    G.flashback = false;
    hide(false);
    yield G.camFocus(null, null, 1);
    yield G.fadeIn(20);
    yield G.say('Nate', 'It blew a hole right through the bottom of a steel fire pit, then flew clear across the yard.');
    yield G.say('Nate', 'It rained burning embers and beans. Everywhere.');
  };

  // ---------------------------------------------------------------- the Alligator Incident
  // A true family story: Doron left a surprise in the upstairs toilet to gross
  // out Abe. Abe never saw it. Three-year-old Nate did.
  S.alligatorToilet = function* () {
    const f = flags(), s = G.state, w = G.play.world, p = P();
    if (f.alligator) {
      yield G.say(null, 'The upstairs toilet. No alligators today. Nate checked. Twice.');
      return;
    }
    f.alligator = true;
    yield G.say(null, 'The upstairs toilet.');
    yield G.emote(p, 'bang', 30);
    yield G.say('Nate', '...I don\'t like this toilet.');
    const doron = s.party.includes('doron');
    if (doron) {
      yield G.say('Doron', 'HA! Nate. Remember the alligator?');
      yield G.say('Nate', 'Don\'t.');
      yield G.say('Doron', 'I pooped in there to gross out Abe. Didn\'t flush. It was a masterpiece.');
      yield G.say('Doron', 'But Abe never came. THIS guy did. Three years old, needs the bathroom...');
    } else {
      yield G.say('Nate', 'Doron once did something unspeakable in here, just to gross out Abe. He didn\'t flush.');
      yield G.say('Nate', 'Abe never saw it. I did. I was three.');
    }
    // flashback
    yield G.fadeOut(20);
    G.flashback = true;
    const hide = (v) => { p.hidden = v; for (const e of w.ents) if (e instanceof G.Follower) e.hidden = v; };
    hide(true);
    const kid = w.add(new G.NPC({ sprite: 'nate_toddler', name: 'Little Nate', x: 18 * 16 + 8, y: 5 * 16 + 14, dir: 'up' }));
    yield G.camFocus(17 * 16, 8 * 16, 1);
    yield G.fadeIn(20);
    yield G.banner('FLASHBACK', 'Rattlesnake Bridge Rd, a long time ago', 120);
    yield G.wait(40);
    yield G.emote(kid, 'bang', 40);
    G.audio.sfx('yell');
    yield G.shakeCmd(20, 2);
    yield G.walkTo(kid, 16 * 16 + 8, 7 * 16 + 14, 2);
    yield G.camFocus(17 * 16, 10 * 16, 20);
    yield G.walkTo(kid, 16 * 16 + 8, 11 * 16 + 14, 2);
    kid.dir = 'down';
    w.pop(kid.x, kid.y - 26, 'WAAAAAH!', '#78c8ff');
    yield G.shakeCmd(30, 3);
    yield G.say('Little Nate', 'THERE\'S AN ALLIGATOR IN THE TOILET!!!', { top: true });
    w.pop(kid.x, kid.y - 26, 'WAAAAAAAAAH!', '#78c8ff');
    yield G.wait(60);
    yield G.fadeOut(20);
    kid.dead = true;
    G.flashback = false;
    hide(false);
    yield G.camFocus(null, null, 1);
    yield G.fadeIn(20);
    if (doron) {
      yield G.say('Doron', 'Screaming! Crying! You wouldn\'t go near a toilet for a week.');
      yield G.say('Nate', 'It had TEETH, Doron.');
      yield G.say('Doron', 'It did not have teeth.');
      yield G.say('Nate', 'I KNOW WHAT I SAW.');
    } else {
      yield G.say('Nate', 'It had teeth. I know what I saw.');
    }
    if (s.party.includes('lily')) yield G.say('Lily', 'Still the best story this family has.');
  };

  // ---------------------------------------------------------------- the 6 key
  // Pressing 6 on the keyboard counts as saying the sacred number.
  S.sixKey = function* () {
    if (!flags().sixKey) {
      flags().sixKey = true;
      yield G.say(null, 'You pressed the {r}sacred number{/} on your keyboard. That counts.');
    }
    yield* slip();
  };

  S.partyTalk = function* (id) {
    const lines = {
      doron: [
        'Leg day is every day.',
        'Still can\'t believe Dad was the main event.',
        'Nobody else wanted to come to Micro Mayhem. Their loss.',
        'If you hand me a present, I\'m opening it from twenty feet away.',
      ],
    }[id] || ['...'];
    const f = flags();
    f['talk_' + id] = ((f['talk_' + id] || 0) + 1) % lines.length;
    const name = id[0].toUpperCase() + id.slice(1);
    yield G.say(name, lines[f['talk_' + id]]);
  };

  S.boulderHit = function () {
    const f = flags();
    if (G.script.busy) return;
    if (G.state.party.includes('doron')) { G.script.run(S.boulderSmash()); return; }
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

  // where Sixes appear on the campus lawns (first 7 at load, the rest for respawns)
  const SIX_SPOTS = [[28, 20], [31, 21], [34, 20], [30, 25], [6, 22], [10, 24], [15, 26], [33, 24], [12, 21], [27, 26]];

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
        yield G.say('Nate', 'Hammer: check. Hat: ...wait. Where\'s my {y}hat{/}?!');
        yield G.say('Nate', 'I never go anywhere without my hat. Maybe it blew away on the quad...');
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
      w.addBuilding({ x: 29, y: 3, w: 9, h: 4, door: 4, style: 'modern', wall: '#d8c8a0', roof: '#6a4a40', to: { map: 'science', x: 7, y: 9 } });
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

      SIX_SPOTS.slice(0, 7).forEach(([x, y]) => w.add(new G.Six(x * 16 + 8, y * 16 + 14)));

      w.addTrigger(1, 15, 37, 1, () => {
        if (flags().sixIntro) return;
        flags().sixIntro = true;
        G.script.run(S.sixIntro());
      });
      if (!flags().boulderGone) w.add(new G.Boulder(20 * 16, 28 * 16 + 15, S.boulderHit));
      // with Doron along, walking up to the boulder starts the suplex
      w.addTrigger(17, 25, 6, 2, () => {
        if (!flags().boulderGone && G.state.party.includes('doron')) G.script.run(S.boulderSmash());
      });
      w.addTrigger(18, 29, 4, 1, () => G.play.warp('home', 1, 53, 'right'));
      w.add(new G.Sign(37, 11, 'EAST: Easton Fairgrounds. Tonight: {y}MICRO MAYHEM WRESTLING{/}!'));
      w.add(new G.Sign(35, 8, ['SCIENCE CENTER. Reopened (mostly) after "an incident involving homemade fireworks."', 'Today: {y}CHEMISTRY FINAL{/} with Dr. Moles.']));
      // the fairgrounds only open up once the boulder (and Doron's text) gives Nate a reason to go
      w.addTrigger(39, 12, 1, 2, () => {
        if (flags().doronChat && G.state.items.cap) G.play.warp('fair', 1, 12, 'right');
        else G.script.run(S.notEast());
      });
      npc('gus', 'Gus', 6, 15, S.gus, { wander: 12 });
    },
    // Sacred numbers keep wandering back onto the lawns, off-screen.
    tick(w) {
      if (G.script.busy) return;
      w.spawnT = (w.spawnT || 0) + 1;
      if (w.spawnT < 300) return;
      w.spawnT = 0;
      if (w.ents.filter((e) => e instanceof G.Six).length >= 7) return;
      const p = G.play.player;
      const spots = SIX_SPOTS.filter(([x, y]) => Math.hypot(x * 16 + 8 - p.x, y * 16 + 14 - p.y) > 150);
      if (!spots.length) return;
      const [x, y] = spots[Math.floor(Math.random() * spots.length)];
      w.add(new G.Six(x * 16 + 8, y * 16 + 14));
    },
  };

  G.MAPS.science = {
    name: 'Science Center',
    music: 'house',
    tiles: [
      'wwwwwwwwwwwwwww',
      'wvvvvvvvvvvvvvw',
      'w_____________w',
      'w_____________w',
      'w_____________w',
      'w_____________w',
      'w_____________w',
      'w_____________w',
      'w_____________w',
      'w_____________w',
      'wwwwwwwxwwwwwww',
    ],
    setup(w) {
      w.addProp({ img: G.spr.chalkboard, tx: 5, ty: 1, flat: true, dy: -1 });
      w.addProp({ img: G.spr.desk, tx: 10, ty: 2, solid: [10, 2, 2, 1] });
      w.addProp({ img: G.spr.bench, tx: 1, ty: 2, solid: [1, 2, 3, 1] });
      for (const y of [4, 6, 8]) {
        for (const x of [2, 4, 10, 12]) w.addProp({ img: G.spr.schoolDesk, tx: x, ty: y, solid: [x, y, 1, 1] });
      }
      w.add(new G.NPC({ sprite: 'moles', name: 'Dr. Moles', x: 7 * 16 + 8, y: 3 * 16 + 14, dir: 'down', talk: S.chemFinal }));
      w.add(new G.NPC({ sprite: 'priya', name: 'Priya', x: 13 * 16 + 8, y: 7 * 16 + 14, dir: 'left', talk: S.priya }));
      w.addWarp(7, 10, 1, 1, 'campus', 33, 7, 'down');
    },
  };

  // ---------------------------------------------------------------- inside the house
  // Laid out from the listing photos. Walls are two tiles tall; furniture that
  // stands against a wall reaches up over it, and pictures hang on it.
  function furnish(w) {
    const center = (img, wt) => Math.round((wt * 16 - img.width) / 2);
    return {
      // a piece standing on floor row `ty`
      stand(img, tx, ty, wt, talk, o = {}) {
        const ht = o.ht || 1;
        return w.addProp(Object.assign({ img, tx, ty, h: ht, dx: center(img, wt), solid: [tx, ty, wt, ht], hit: talk ? [tx, ty, wt, ht] : null, talk }, o));
      },
      // something hung on a wall face whose bottom row is `ty`
      hang(img, tx, ty, wt, talk, lift = 5) {
        return w.addProp({ img, tx, ty, flat: true, dx: center(img, wt), dy: -lift, hit: talk ? [tx, ty, wt, 1] : null, talk });
      },
      // something sitting on a countertop in row `ty`
      onCounter(img, tx, ty, talk, dx = 0) {
        return w.addProp({ img, tx, ty, dx: 8 - (img.width >> 1) + dx, dy: -10, hit: talk ? [tx, ty, 1, 1] : null, talk });
      },
    };
  }
  const look = (...pages) => function* () { for (const pg of pages) yield Array.isArray(pg) ? G.say(pg[0], pg[1]) : G.say(null, pg); };

  G.MAPS.homeDown = {
    name: 'Home: Downstairs',
    music: 'house',
    tiles() {
      const W = 50, H = 18;
      const g = Array.from({ length: H }, () => Array(W).fill('w'));
      const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < W && y < H) g[y][x] = c; };
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) set(x + i, y + j, c); };
      const room = (x, y, w, h, face, floor) => { fill(x, y, w, 2, face); fill(x, y + 2, w, h - 2, floor); };
      room(1, 1, 15, 9, '1', 'o');   // living room
      room(17, 1, 6, 16, '5', 'o');  // front hall
      room(24, 1, 12, 16, '4', 'o'); // kitchen
      room(37, 1, 12, 9, '3', 'o');  // den
      room(1, 11, 15, 6, '2', 'o');  // sunroom
      room(37, 11, 5, 6, '6', 'o');  // mudroom
      room(43, 11, 6, 6, '7', 'o');  // family room
      // the powder room, tucked into the corner of the hall
      fill(19, 1, 1, 5, 'w'); fill(19, 5, 4, 1, 'w');
      room(20, 1, 3, 4, '5', 'z');
      fill(19, 6, 4, 2, '5');
      // doorways
      const door = (x, y, w, h) => fill(x, y, w, h, 'o');
      door(21, 5, 1, 3);   // powder room
      door(16, 8, 1, 2);   // living room / hall
      door(16, 14, 1, 2);  // sunroom / hall
      door(10, 10, 3, 3);  // living room / sunroom
      door(23, 11, 1, 2);  // hall / kitchen
      door(36, 5, 1, 2);   // kitchen / den
      door(36, 14, 1, 2);  // kitchen / mudroom
      door(39, 10, 1, 3);  // den / mudroom
      door(48, 10, 1, 3);  // den / family room
      door(42, 14, 1, 2);  // mudroom / family room
      fill(17, 3, 2, 5, 'S'); // stairs up
      // south wall: windows, and the three doors out
      fill(2, 17, 13, 1, 'G'); fill(27, 17, 6, 1, 'G'); fill(44, 17, 4, 1, 'G');
      set(4, 17, 'x'); set(20, 17, 'x'); set(39, 17, 'x');
      // rugs
      fill(4, 5, 10, 5, 'q');
      fill(3, 14, 8, 2, 'R');
      fill(19, 9, 2, 6, 'R');
      fill(27, 15, 6, 1, 'R');
      fill(39, 5, 8, 4, 'i');
      fill(44, 14, 4, 2, 'R');
      // kitchen counters
      fill(26, 3, 10, 1, 'Q');
      fill(26, 16, 9, 1, 'Q');
      return g.map((r) => r.join(''));
    },
    setup(w) {
      const F = furnish(w), sp = G.spr, f = flags();
      // ---- living room
      F.stand(sp.curio, 1, 3, 1, look('A glass cabinet full of the good china. Nobody is allowed to use the good china.'));
      F.hang(sp.frenchDoor, 3, 2, 1, look('French doors out to the side steps by the chimney.'), 1);
      w.addProp({ img: sp.brickFireplace, tx: 5, ty: 1, h: 3, flat: true, solid: [5, 3, 2, 1], hit: [5, 3, 2, 1], talk: look('The brick fireplace, with a landscape hung over the mantel.', 'The chimney outside is older than everybody in the family put together.') });
      F.hang(sp.frenchDoor, 8, 2, 1, look('More French doors. This house loves a French door.'), 1);
      F.hang(sp.bayWindow, 10, 2, 4, null, 1);
      F.stand(sp.tuftedSofa, 10, 3, 3, look('The tufted sofa under the big window. Prime napping real estate.'));
      F.stand(sp.gingerLamp, 9, 3, 1, look('A blue-and-white ginger jar lamp. Very fancy. Do not throw a ball near it.'));
      F.stand(sp.gingerLamp, 13, 3, 1, look('Another ginger jar lamp. They come in pairs, like Nate and Lily.'));
      F.stand(sp.secretary, 15, 3, 1, look('A tall old secretary desk. The little drawers are full of rubber bands and mystery keys.'));
      F.stand(sp.chairWhite, 6, 6, 1, look('A white armchair. Comfy. Nobody eats on it.'));
      F.stand(sp.coffeeTable, 8, 6, 2, look('A coffee table with big books nobody reads and two candlesticks.'));
      F.stand(sp.chairBlue, 11, 6, 1, look('A pale blue armchair with a view of the fire.'));
      F.stand(sp.drumStool, 5, 8, 1, look('A red ceramic garden stool. Is it a table? A seat? Nobody knows.'));
      F.stand(sp.sofaBack, 8, 8, 3, look('The red floral sofa. Somehow it goes with everything.'));
      F.stand(sp.chairLeather, 2, 6, 1, look('A worn leather club chair. It squeaks when you sit down. Everyone pretends it doesn\'t.'));
      // ---- sunroom
      F.hang(sp.archMirror, 2, 12, 1, look('An arched mirror. Nate checks his hat. Still distinguished.'), 3);
      F.hang(sp.louverDoor, 13, 12, 1, look('A closet full of board games with missing pieces.'), 1);
      F.stand(sp.wingback, 2, 13, 1, look('A wingback chair. Perfect for reading by the windows.'));
      F.stand(sp.xConsole, 4, 13, 2, look('A console on an X-shaped base, with a lamp and an orchid that refuses to die.'));
      F.stand(sp.wingback, 7, 13, 1, look('The other wingback chair. Slightly more broken in.'));
      F.stand(sp.tuftedOttoman, 6, 15, 1, look('A big round tufted ottoman. Feet up!'), { dx: -3 });
      F.stand(sp.grandfatherClock, 15, 13, 1, look('The grandfather clock. It chimes on the hour. It has never once been on time.'));
      F.stand(sp.plant, 13, 16, 1, look('A potted cactus soaking up the sun. It is doing better than all of us.'));
      // ---- front hall and powder room
      F.hang(sp.horsePrint, 20, 2, 1, look('An old print of a racehorse.'), 8);
      F.hang(sp.ovalMirror, 21, 2, 1, null, 3);
      F.hang(sp.horsePrint, 22, 2, 1, look('Another racehorse. This one is winning.'), 8);
      F.stand(sp.demilune, 21, 3, 1, look('The powder room: white paneling, a dark wood vanity and horse prints. Fancy, for a bathroom.'));
      F.stand(sp.toilet, 22, 4, 1, look('...It\'s a toilet, Nate.'));
      F.hang(sp.giltMirror, 19, 7, 2, null, 3);
      F.stand(sp.hallConsole, 19, 8, 2, look('A hall table with a lamp and a bowl for keys. The keys are never in the bowl.'));
      F.stand(sp.hallBench, 22, 15, 1, look('A little bench by the front door for pulling off muddy boots.'));
      // ---- kitchen
      w.fridge = w.addProp({ img: sp.fridge, tx: 24, ty: 3, h: 1, solid: [24, 3, 2, 1], hit: [24, 3, 2, 1], talk: () => S.fridgeTalk() });
      // while Lily is inside, the fridge rattles every few seconds
      w.fridge.draw = function (ctx, cx, cy) {
        if (this.shakeT > 0) this.shakeT--;
        const rattle = this.shakeT > 0 || (!flags().badlandsBeaten && G.tick % 200 < 14);
        const j = rattle ? ((G.tick >> 1) & 1 ? 1 : -1) : 0;
        ctx.drawImage(this.img, this.x + j - cx, this.y - cy);
      };
      if (f.badlandsBeaten) w.fridge.img = sp.fridgeOpen;
      F.stand(sp.wallOvens, 26, 3, 1, look('Double wall ovens. Thanksgiving headquarters.'));
      F.hang(sp.upperCabs2, 27, 2, 2, null, 10);
      F.hang(sp.upperCabsMicro, 29, 2, 3, null, 10);
      F.hang(sp.upperCabs, 32, 2, 3, null, 10);
      w.addProp({ img: sp.rangeTop, tx: 31, ty: 3, hit: [31, 3, 1, 1], talk: look('The range. Something is always simmering on it.') });
      F.onCounter(sp.knifeBlock, 34, 3, look('A knife block. Badlands didn\'t touch it. Good.'));
      F.onCounter(sp.counterTV, 35, 3, look('A little TV on the counter, permanently tuned to the weather.'));
      w.boot = F.onCounter(sp.boot, 28, 3, look('A giant glass boot. The official vessel of chugging.'));
      w.blender = F.onCounter(sp.blender, 30, 3, look('A blender. It looks... hungry.'));
      w.addProp({ img: sp.sinkTop, tx: 29, ty: 16, flat: true, dy: -10, hit: [29, 16, 2, 1], talk: look('The big kitchen sink under a row of windows. You can see the whole backyard from here.') });
      F.stand(sp.farmTable, 27, 9, 5, look('The long farmhouse table and the white Windsor chairs. Every family dinner happens right here.'), { ht: 2 });
      w.props.push({ img: sp.chandelier, x: 28 * 16 + 4, y: 112, base: 11 * 16 + 1 });
      F.stand(sp.ringLight, 32, 5, 1, look('Badlands\' ring light. It makes everything look like a music video.'));
      F.stand(sp.tripodPhone, 30, 6, 1, () => S.badlandsPhone());
      if (!f.badlandsBeaten) {
        w.badlands = w.add(new G.NPC({ sprite: 'badlands', name: 'Badlands Chugs', x: 30 * 16 + 8, y: 4 * 16 + 14, dir: 'down', talk: S.badlands }));
        w.addTrigger(24, 3, 12, 14, () => { if (!flags().badlandsMet) G.script.run(S.badlandsIntro()); });
      }
      // ---- den
      F.stand(sp.floorLamp, 37, 3, 1, look('A floor lamp with a woven shade.'));
      F.stand(sp.bookshelf2, 38, 3, 1, () => S.denShelf());
      w.addProp({ img: sp.stoneFireplace, tx: 39, ty: 1, h: 3, flat: true, solid: [39, 3, 2, 1], hit: [39, 3, 2, 1], talk: look('The den: a stone fireplace with the TV right above it. Game nights happen here.') });
      F.stand(sp.bookshelf2, 41, 3, 1, () => S.denShelf());
      F.hang(sp.guitar, 43, 2, 1, look('An acoustic guitar on the wall. Somebody knows three chords on it.'), 3);
      F.hang(sp.wallWindow.one, 45, 2, 1, null, 3);
      F.hang(sp.barometer, 47, 2, 1, look('A barometer. It says CHANGE. It always says CHANGE.'), 8);
      F.stand(sp.chairLeather, 43, 5, 1, look('A leather armchair angled at the TV.'));
      F.stand(sp.writingDesk, 45, 8, 2, look('A writing desk buried in mail and old crossword puzzles.'));
      // ---- mudroom
      F.hang(sp.coatHooks, 37, 12, 2, look('Coat hooks, overloaded with coats from every season.'), 2);
      F.stand(sp.bootBench, 37, 13, 2, look('Boots, sneakers, and one flip-flop with no partner.'));
      F.stand(sp.washerDryer, 40, 13, 2, look('The washer and dryer. The dryer eats exactly one sock per load.'));
      // ---- family room
      F.hang(sp.bayWindow, 44, 12, 4, null, 1);
      F.stand(sp.blueHutch, 43, 13, 1, look('A light blue painted hutch full of pretty plates.'));
      F.stand(sp.trainTable, 45, 14, 2, look('An old wooden train table. Somebody built a whole little town on it.'));
      // ---- critters: Nate's corn, Nate's cereal and Nate's fireworks, all very much alive
      const at = (Kind, x, y) => w.add(new Kind(x * 16 + 8, y * 16 + 14));
      at(G.Corncob, 12, 8); at(G.Corncob, 9, 15);
      at(G.CerealBox, 41, 8); at(G.CerealBox, 47, 13);
      at(G.Firework, 18, 12);
      // ---- ways out
      w.addTrigger(17, 3, 2, 1, () => G.play.warp('homeUp', 13, 13, 'up'));
      w.addWarp(4, 17, 1, 1, 'home', 14, 34, 'down');
      w.addWarp(20, 17, 1, 1, 'home', 17, 34, 'down');
      w.addWarp(39, 17, 1, 1, 'home', 23, 34, 'down');
    },
    onEnter() {
      return (function* () {
        const f = flags();
        if (f.badlandsMet || f.heardBlender) return;
        f.heardBlender = true;
        yield G.wait(20);
        yield G.say(null, '{d}From the kitchen: a muffled "MMMPH!" ...and a blender whirring.{/}');
        yield G.say('Nate', 'Lily? ...Why is someone running the blender?');
      })();
    },
  };

  G.MAPS.homeUp = {
    name: 'Home: Upstairs',
    music: 'house',
    tiles() {
      const W = 36, H = 21;
      const g = Array.from({ length: H }, () => Array(W).fill('w'));
      const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < W && y < H) g[y][x] = c; };
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) set(x + i, y + j, c); };
      const room = (x, y, w, h, face, floor) => { fill(x, y, w, 2, face); fill(x, y + 2, w, h - 2, floor); };
      room(1, 1, 12, 7, '6', 'o');   // Dad and Michelle's room
      room(14, 1, 6, 7, '8', 'z');   // bathroom
      room(21, 1, 7, 7, '9', 'o');   // Nate's room
      room(29, 1, 6, 7, '7', 'o');   // the giraffe room
      room(1, 9, 34, 4, '5', 'o');   // hallway
      room(1, 14, 10, 6, '0', 'o');  // Lily's room
      room(17, 14, 10, 6, '6', 'o'); // guest room
      room(28, 14, 7, 6, '5', 'o');  // linen nook
      fill(13, 13, 2, 7, 'D');       // stairs down
      const door = (x, y, w, h) => fill(x, y, w, h, 'o');
      door(6, 8, 1, 3); door(16, 8, 1, 3); door(24, 8, 1, 3); door(31, 8, 1, 3);
      door(9, 13, 1, 3); door(25, 13, 1, 3); door(31, 13, 1, 3);
      fill(3, 6, 8, 2, 'R');
      fill(22, 6, 3, 2, 'q');
      fill(30, 6, 4, 2, 'q');
      fill(2, 11, 10, 2, 'R'); fill(16, 11, 18, 2, 'R');
      fill(2, 18, 6, 2, 'R');
      fill(18, 18, 6, 2, 'R');
      return g.map((r) => r.join(''));
    },
    setup(w) {
      const F = furnish(w), sp = G.spr, f = flags();
      // ---- Dad and Michelle's room
      F.hang(sp.wallWindow.shade, 2, 2, 1, null, 3);
      F.hang(sp.paintLand, 9, 2, 1, look('A landscape: rolling hills, a big sky. Very New Jersey.'), 9);
      F.hang(sp.louverDoor, 11, 2, 1, look('A closet with louvered doors.'), 1);
      F.hang(sp.louverDoor, 12, 2, 1, look('More closet. It\'s mostly sweaters.'), 1);
      F.stand(sp.nightRed, 4, 3, 1, look('A nightstand with a red lamp and a stack of library books.'));
      F.stand(sp.bedKing, 5, 3, 3, look('Dad and Michelle\'s room. The bed is made perfectly. Do not sit on it.'), { ht: 3 });
      F.stand(sp.nightRed, 8, 3, 1, look('The other nightstand. A reading lamp and Dad\'s glasses case.'));
      F.stand(sp.chairBlue, 11, 6, 1, look('A comfy reading chair by the closet.'));
      // ---- bathroom
      F.stand(sp.doubleVanity, 14, 3, 3, look('A double vanity. One side is very tidy. The other side is not.'));
      F.hang(sp.paintSunset, 18, 2, 1, look('A painting of the sun going down over the water.'), 8);
      F.stand(sp.toilet, 19, 3, 1, () => S.alligatorToilet());
      F.stand(sp.tub, 18, 6, 2, look('A bathtub. Rubber duck not included.'), { ht: 2 });
      // ---- Nate's room
      F.hang(sp.poster, 21, 2, 1, look('The periodic table Nate memorized in seventh grade. Twice.'), 6);
      F.hang(sp.fireworksPoster, 23, 2, 1, look('"FIREWORKS: A CHEMICAL HISTORY." Nate\'s most treasured possession.'), 5);
      F.hang(sp.wallWindow.one, 25, 2, 1, null, 3);
      w.chemDesk = F.stand(f.badlandsBeaten || G.state.items.dye ? sp.chemDeskEmpty : sp.chemDesk, 21, 3, 2, () => S.chemDesk());
      F.stand(sp.bedNate, 26, 3, 1, look('Nate\'s old bed. The plaid quilt matches his shirt. It always has.'), { ht: 3 });
      F.stand(sp.rocks, 27, 3, 1, look('Nate\'s first rock collection. Mostly gravel from the driveway. Labeled anyway.'));
      // ---- the giraffe room
      F.hang(sp.wallWindow.curtains, 31, 2, 1, null, 3);
      F.stand(sp.glider, 29, 3, 1, look('A gray glider chair. It glides.'));
      F.stand(sp.settee, 31, 3, 2, look('A floral settee under the window.'));
      F.stand(sp.giraffe, 34, 3, 1, look('A giant stuffed giraffe. Nobody knows where it came from. Nobody dares move it.'), { ht: 2 });
      // ---- hallway
      F.hang(sp.familyPhotos, 3, 10, 2, look('Family photos all the way down the hall. School pictures, beach trips, one very bad haircut.'), 5);
      F.hang(sp.familyPhotos, 19, 10, 2, look('More family photos. Somebody is always blinking.'), 5);
      F.hang(sp.paintSmall, 28, 10, 1, look('A little painting of a flower pot.'), 8);
      // ---- Lily's room
      F.hang(sp.wallWindow.shade, 2, 15, 1, null, 3);
      F.hang(sp.paintBarn, 6, 15, 2, look('A painting of a red barn and a white horse.'), 8);
      F.stand(sp.hamper, 1, 16, 1, look('A wicker hamper. Full. Always full.'));
      F.stand(sp.bedLily, 4, 16, 2, look('Lily\'s bed: a navy quilt, leopard print pillows, and a flowered quilt folded at the foot.'), { ht: 3 });
      F.stand(sp.nightCream, 6, 16, 1, look('A nightstand with a little lamp and a phone charger.'));
      F.stand(sp.dresser, 7, 16, 2, look('A dresser with a mirror and a jewelry box.'));
      // ---- guest room
      F.hang(sp.paintSea, 18, 15, 2, look('A painting of a sailboat out on the bay.'), 8);
      F.hang(sp.wallWindow.shade, 23, 15, 1, null, 3);
      F.stand(sp.nightBlack, 19, 16, 1, look('A nightstand with a black lamp.'));
      F.stand(sp.bedGuest, 20, 16, 2, look('The guest room. White duvet, fluffy pillows. Guests never want to leave.'), { ht: 3 });
      F.stand(sp.spindleChair, 24, 17, 1, look('A wooden chair with a woven seat.'));
      // ---- linen nook
      F.stand(sp.linenShelf, 28, 16, 1, look('Towels, sheets, and one beach towel shaped like a slice of watermelon.'));
      F.stand(sp.linenShelf, 29, 16, 1, look('Even more towels. Nobody knows how there are this many towels.'));
      F.hang(sp.wallWindow.two, 32, 15, 2, null, 3);
      F.stand(sp.windowSeat, 32, 16, 2, look('A window seat with a view of the whole yard. The best seat in the house.'));
      // ---- critters (Nate's room is ground zero: he kept a LOT of corn in there)
      const at = (Kind, x, y) => w.add(new Kind(x * 16 + 8, y * 16 + 14));
      at(G.Corncob, 23, 6); at(G.Corncob, 25, 5); at(G.Corncob, 8, 11);
      at(G.Firework, 22, 5);
      at(G.CerealBox, 23, 18);
      w.addTrigger(13, 19, 2, 1, () => G.play.warp('homeDown', 17, 8, 'down'));
    },
  };

  // Golden hour at the end of the driveway: Lily vs. Mikey.
  G.MAPS.goldenHour = {
    name: 'Golden Hour',
    music: 'serenade',
    tiles() {
      const W = 15, H = 10;
      const g = Array.from({ length: H }, (_, y) => Array.from({ length: W }, (_, x) => ((x >> 1) % 2 ? 'L' : 'M')));
      for (let x = 0; x < W; x++) g[9][x] = 'f';
      for (let y = 2; y < H; y++) { g[y][0] = 'f'; g[y][14] = 'f'; }
      for (let x = 0; x < W; x += 2) g[0][x] = 'T';
      [[3, 3], [11, 7], [6, 7], [9, 2], [2, 6], [12, 4]].forEach(([x, y]) => { g[y][x] = ','; });
      return g.map((r) => r.join(''));
    },
    setup(w) {
      w.addProp({ img: G.spr.gatePost, tx: 6, ty: 9, dx: 1 });
      w.addProp({ img: G.spr.gatePost, tx: 8, ty: 9, dx: 1 });
      if (!flags().mikeyBeaten) w.add(new G.MikeyBoss(11 * 16 + 8, 4 * 16 + 14));
      const cheer = (sprite, name, x) => w.add(new G.NPC({ sprite, name, x: x * 16 + 8, y: 8 * 16 + 12, dir: 'up' }));
      cheer('nate', 'Nate', 2);
      if (G.state.party.includes('doron')) cheer('doron', 'Doron', 12);
    },
    tint(ctx) {
      ctx.fillStyle = 'rgba(255,170,60,0.22)';
      ctx.fillRect(0, 0, G.W, G.H);
      const g = ctx.createLinearGradient(0, 0, 0, G.H);
      g.addColorStop(0, 'rgba(255,120,80,0.18)'); g.addColorStop(1, 'rgba(255,220,120,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, G.W, G.H);
    },
    onEnter() {
      return (function* () {
        if (!flags().mikeyBeaten) yield* S.goldenIntro();
      })();
    },
  };

  // Nate's childhood home on Rattlesnake Bridge Rd, Bedminster NJ, laid out
  // from the property survey and the family's photos: the road and board
  // fence along the bottom; a long gravel driveway up through the front
  // meadow into the asphalt parking area, then on north past the garage and
  // the pool to a bridge over Brady Brook; the white farmhouse (chimney end on
  // the left, raised stone patio off the porch, side door onto the parking
  // area); the big double-trunk tree; firewood racks, the basketball hoop and
  // the garage (Dad's workshop inside); the pool with the pool house on its
  // left; and the fenced garden with the chicken coop behind it all. (No house
  // number: the game is public.)
  G.MAPS.home = {
    name: 'Rattlesnake Bridge Rd',
    music: 'home',
    tiles() {
      const W = 60, H = 56;
      const g = Array.from({ length: H }, (_, y) => Array.from({ length: W }, (_, x) => ((x >> 1) % 2 ? 'L' : 'M')));
      const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < W && y < H) g[y][x] = c; };
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) set(x + i, y + j, c); };
      // the long gravel driveway: up from the road into the parking area...
      fill(43, 46, 2, 7, 'g');
      fill(42, 41, 2, 6, 'g');
      // ...and on north between the garage and the pool, then over the brook
      fill(42, 18, 2, 18, 'g');
      fill(43, 16, 2, 3, 'g');
      fill(44, 15, 2, 2, 'g');
      fill(45, 14, 2, 2, 'g');
      fill(46, 13, 2, 2, 'g');
      fill(47, 12, 3, 2, 'g');
      fill(49, 11, 2, 2, 'g');
      fill(51, 0, 2, 12, 'g');
      // Brady Brook runs diagonally across the top; the driveway crosses on a bridge
      const brook = (x) => Math.round(1 + x * 0.15);
      for (let x = 0; x < W; x++) { set(x, brook(x), '~'); set(x, brook(x) + 1, '~'); }
      for (let y = 0; y < H; y++) for (const x of [51, 52]) if (g[y][x] === '~') g[y][x] = 'W';
      // woods along both banks (the conservation easement)
      for (let x = 0; x < W - 1; x += 2) {
        if (x >= 44 && x <= 54) continue;
        const c = brook(x);
        if (c >= 4) set(x, c - 3, 'T');
        if (x % 4 === 0 || x > 18) set(x, c + 3, 'T');
      }
      // the asphalt parking area in front of the house, and the garage apron
      fill(20, 36, 26, 5, 'a');
      fill(35, 34, 7, 2, 'a');
      // Rattlesnake Bridge Road and the board fence along it (gap for the driveway)
      fill(0, 53, W, 1, 'a');
      fill(0, 54, W, 1, 'Y');
      fill(0, 52, W, 1, 'f');
      set(43, 52, 'g'); set(44, 52, 'g');
      set(42, 52, 'L'); set(45, 52, 'L'); // the gateposts
      // wildflowers scattered across the front meadow
      for (let i = 0; i < 40; i++) {
        const x = Math.floor(G.hash(i, 71) * 52), y = 41 + Math.floor(G.hash(i, 72) * 10);
        if (g[y][x] === 'L' || g[y][x] === 'M') set(x, y, ',');
      }
      // brick paver walk from the parking area to the side door
      fill(23, 34, 1, 2, 'p');
      // boxwood under the window band, round shrubs by the side door, boxwoods under the big tree
      fill(20, 34, 2, 1, 'H');
      fill(24, 34, 2, 1, 'H');
      fill(26, 35, 2, 1, 'H');
      // the garden: rustic X-braced fence, raised beds, snapdragons, paths
      fill(26, 15, 15, 1, 'X'); fill(26, 23, 15, 1, 'X');
      fill(26, 15, 1, 9, 'X'); fill(40, 15, 1, 9, 'X');
      set(33, 23, 'k');
      fill(27, 18, 13, 1, '=');
      fill(34, 19, 1, 4, '=');
      fill(35, 19, 1, 4, 'k');
      [[28, 19], [29, 19], [28, 21], [29, 21], [37, 19], [38, 19], [37, 21], [38, 21]].forEach(([x, y]) => set(x, y, 'e'));
      fill(31, 19, 2, 3, 'F');
      // big oaks around the yard; woods along the west and east edges
      [[8, 30], [5, 26], [24, 20], [14, 23], [0, 19], [0, 23], [0, 27], [0, 31],
        [56, 14], [58, 16], [56, 20], [58, 22], [56, 26], [58, 28], [56, 31], [58, 33],
        [8, 40], [9, 35], [15, 45], [28, 46], [38, 46], [47, 42], [6, 47], [18, 49], [33, 49],
        [57, 37], [57, 41], [57, 45], [0, 35], [0, 39], [0, 43], [0, 47]]
        .forEach(([x, y]) => set(x, y, 'T'));
      return g.map((r) => r.join(''));
    },
    setup(w) {
      // the house; walk into the porch door, the front door or the side door to go inside
      w.addProp({ img: G.spr.farmhouse, tx: 11, ty: 27, h: 7 });
      w.blockTiles(11, 28, 12, 6);
      w.blockTiles(23, 30, 3, 4);
      for (const [x, tx] of [[14, 4], [17, 20], [23, 39]]) {
        w.block[33 * w.w + x] = 0;
        w.addWarp(x, 33, 1, 1, 'homeDown', tx, 16, 'up');
      }
      // the raised stone patio off the porch: steps down at the chimney end
      w.addProp({ img: G.spr.patio, tx: 12, ty: 34, h: 3, flat: true });
      w.blockTiles(13, 36, 6, 1);
      w.addProp({ img: G.spr.grill, tx: 13, ty: 34, solid: [13, 34, 1, 1], hit: [13, 34, 1, 1], talk: S.homeGrill });
      w.addProp({ img: G.spr.patioUmbrella, tx: 15, ty: 34, dx: 2, solid: [15, 34, 1, 1], hit: [15, 34, 1, 1], talk: S.homePatio });
      w.addProp({ img: G.spr.woodStack, tx: 18, ty: 34, solid: [18, 34, 1, 1], hit: [18, 34, 1, 1], talk: S.homeFirewood });
      // the lawn by the patio
      w.addProp({ img: G.spr.firePit, tx: 14, ty: 39, solid: [14, 39, 1, 1], hit: [14, 39, 1, 1], talk: S.homeFirePit });
      w.addProp({ img: G.spr.lawnSet, tx: 16, ty: 38, solid: [16, 38, 2, 1], hit: [16, 38, 2, 1], talk: S.homeLawnSet });
      w.addProp({ img: G.spr.sawhorses, tx: 5, ty: 38, dx: 2, solid: [5, 38, 3, 1] });
      // the flag on its pole out front, and a green Adirondack chair under the old oak
      w.props.push({ draw(ctx, cx, cy) { ctx.drawImage(G.spr.flag[(G.tick >> 4) & 1], 198 - cx, 41 * 16 + 16 - 60 - cy); }, base: 41 * 16 + 15, hit: [12 * 16, 41 * 16, 13 * 16, 42 * 16], talk: S.homeFlag });
      w.blockTiles(12, 41, 1, 1);
      w.addProp({ img: G.spr.adirondack, tx: 7, ty: 27, solid: [7, 27, 1, 1], hit: [7, 27, 1, 1], talk: S.homeAdirondack });
      // flowering trees: a pink crabapple out front, wisteria by the pool
      w.addTree(36, 42, 'pink');
      w.addTree(24, 43, 'pink');
      w.addTree(55, 29, 'purple');
      // the big double-trunk tree between the house and the parking area
      w.props.push({ img: G.spr.bigTree, x: 27 * 16 - 48, y: 35 * 16 - 120, base: 35 * 16 - 1 });
      w.blockTiles(26, 33, 2, 2);
      w.addProp({ img: G.spr.suv, tx: 20, ty: 37, h: 3, dx: 3, solid: [20, 38, 2, 2], hit: [20, 38, 2, 2], talk: S.homeSUV });
      // firewood racks, a fresh pile and the hoop beside the garage (Dad's workshop
      // inside), which opens onto the parking area
      w.addProp({ img: G.spr.woodRack, tx: 28, ty: 34, solid: [28, 34, 3, 1], hit: [28, 34, 3, 1], talk: S.homeFirewood });
      w.addProp({ img: G.spr.woodRack, tx: 31, ty: 34, solid: [31, 34, 3, 1], hit: [31, 34, 3, 1], talk: S.homeFirewood });
      w.addProp({ img: G.spr.woodPile, tx: 31, ty: 35, dx: 1, solid: [31, 35, 2, 1], hit: [31, 35, 2, 1], talk: S.homeFirewood });
      w.addProp({ img: G.spr.hoop, tx: 34, ty: 34, dx: -6, solid: [34, 34, 1, 1], hit: [34, 34, 1, 1], talk: S.homeHoop });
      w.addBuilding({ x: 35, y: 30, w: 7, h: 4, door: 3, style: 'shake', wall: '#2f4a3e', roof: '#4a4c56', garageDoors: 3, cupola: true, weathervane: true, locked: S.homeGarage });
      w.addProp({ img: G.spr.truck, tx: 44, ty: 36, h: 3, dx: 2, solid: [44, 36, 2, 3], hit: [44, 36, 2, 3], talk: S.homeTruck });
      // across the driveway: the little white pool house on the pool's left, lined up with its middle
      w.addProp({ img: G.spr.poolHouse, tx: 44, ty: 30, h: 3, dx: -4, solid: [44, 30, 2, 3], hit: [44, 30, 2, 3], talk: S.homePoolHouse });
      w.addProp({ img: G.spr.porchFlag, tx: 45, ty: 31, dx: 14, base: 33 * 16 });
      // the free-form pool on its stone deck, teak furniture and green market umbrellas
      w.addProp({ img: G.spr.kidneyPool, tx: 46, ty: 27, h: 6, flat: true });
      w.blockTiles(48, 28, 5, 1);
      w.blockTiles(47, 29, 6, 3);
      w.props.push({ img: null, x: 0, y: 0, base: 0, hit: [47 * 16, 28 * 16, 53 * 16, 32 * 16], talk: S.homePool });
      w.addProp({ img: G.spr.teakSet, tx: 48, ty: 33, solid: [48, 33, 3, 1], hit: [48, 33, 3, 1], talk: S.homePoolSet });
      w.props.push({ img: G.spr.marketUmbrella, x: 48 * 16 + 3, y: 33 * 16 - 30, base: 34 * 16 + 1 });
      for (const x of [49, 51]) w.addProp({ img: G.spr.lounger, tx: x, ty: 26, solid: [x, 26, 1, 1], hit: [x, 26, 1, 1], talk: S.homeLounger });
      w.props.push({ img: G.spr.marketUmbrella, x: 50 * 16 - 11, y: 26 * 16 - 32, base: 27 * 16 + 1 });
      w.addProp({ img: G.spr.teakBench, tx: 52, ty: 33, solid: [52, 33, 2, 1], hit: [52, 33, 2, 1], talk: S.homeLounger });
      // behind it all: the picnic table and the garden
      w.addProp({ img: G.spr.picnicTable, tx: 29, ty: 24, solid: [29, 24, 2, 1], hit: [29, 24, 2, 1], talk: S.homePicnic });
      w.addProp({ img: G.spr.coop, tx: 28, ty: 16, h: 2, solid: [28, 16, 6, 2], hit: [28, 16, 6, 2], talk: S.homeCoop });
      w.addProp({ img: G.spr.greenhouse, tx: 36, ty: 16, h: 2, solid: [36, 16, 3, 2], hit: [36, 16, 3, 2], talk: S.homeGreenhouse });
      w.addProp({ img: G.spr.mailbox, tx: 46, ty: 51, dx: 2, solid: [46, 51, 1, 1], hit: [46, 51, 1, 1], talk: S.homeMailbox });
      w.addProp({ img: G.spr.streetSign, tx: 40, ty: 51, solid: [40, 51, 1, 1], hit: [40, 51, 1, 1], talk: S.homeStreetSign });
      for (const x of [42, 45]) w.addProp({ img: G.spr.gatePost, tx: x, ty: 52, dx: 1, solid: [x, 52, 1, 1], hit: [x, 52, 1, 1], talk: S.homeGatepost });
      w.addTree(16, 19, 'pine');
      w.addTree(46, 23, 'pine');
      w.add(new G.Sign(53, 12, 'BRADY BROOK.'));

      // critters around the property: snapdragons, birdhouse gourds, and the bear by the brook
      const at = (Kind, x, y) => w.add(new Kind(x * 16 + 8, y * 16 + 14));
      for (const [x, y] of [[30, 22], [38, 22], [20, 41], [33, 45], [10, 45]]) at(G.Snapdragon, x, y);
      for (const [x, y] of [[6, 33], [27, 42], [51, 38], [50, 46]]) at(G.Gourd, x, y);
      at(G.Bear, 12, 14);

      // the hens, free-ranging inside the garden fence
      const pen = [27 * 16 + 6, 19 * 16 + 4, 40 * 16 - 6, 23 * 16 - 2];
      [[30, 20, 'white'], [33, 20, 'brown'], [36, 20, 'white'], [34, 22, 'brown'], [30, 22, 'white']]
        .forEach(([x, y, c]) => w.add(new G.Chicken(x * 16 + 8, y * 16 + 12, c, pen)));

      // leaving: either end of the road asks where to; north past the bridge is a dead end for now
      w.addTrigger(0, 53, 1, 2, () => G.script.run(S.homeLeave('west')));
      w.addTrigger(59, 53, 1, 2, () => G.script.run(S.homeLeave('east')));
      w.addTrigger(51, 0, 2, 1, () => G.script.run(S.homeNorth()));

      // Mikey, waiting at the start of the driveway with flowers and heart balloons.
      // Once Lily is out of the fridge, walking by him starts his serenade.
      if (!flags().mikeyBeaten) {
        const mikey = w.add(new G.NPC({ sprite: 'mikey', name: 'Mikey', x: 41 * 16 + 8, y: 50 * 16 + 14, dir: 'down', talk: S.mikey, balloons: true }));
        mikey.held = G.spr.bouquet;
        w.mikey = mikey;
        if (!flags().lilySaved) w.addTrigger(38, 50, 10, 5, () => { if (!flags().mikeyMet) G.script.run(S.mikeyIntro()); });
        else w.addTrigger(35, 46, 15, 9, () => G.script.run(S.mikeyGoldenHour()));
      }
    },
    // the flock's revenge: angry hens swoop in from off-screen for a few seconds
    tick(w) {
      if (!w.swarmT || G.script.busy) return;
      w.swarmT--;
      if (w.swarmT % 22 !== 0) return;
      const p = G.play.player, side = Math.floor(Math.random() * 4);
      const cx = G.play.cam.x, cy = G.play.cam.y;
      const sx = side === 0 ? cx - 16 : side === 1 ? cx + G.W + 16 : cx + Math.random() * G.W;
      const sy = side === 2 ? cy - 16 : side === 3 ? cy + G.H + 16 : cy + Math.random() * G.H;
      w.add(new G.AngryChicken(sx, sy, p.x, p.y));
      if (w.swarmT === 0) w.chickenHits = 0;
    },
    onEnter() {
      return (function* () {
        if (flags().homeArrived) return;
        flags().homeArrived = true;
        yield G.wait(30);
        yield G.say('Nate', 'Rattlesnake Bridge Road. Home sweet home.');
        if (G.state.party.includes('doron')) yield G.say('Doron', 'Smells like woodsmoke and chickens. Feels like home.');
        const m = G.play.world.mikey;
        if (m && !flags().mikeyMet) {
          yield G.camFocus(m.x, m.y - 10, 60);
          yield G.emote(m, 'bang', 40);
          yield G.say('Nate', '...Is that Mikey? At the end of our driveway? With balloons?');
          yield G.camFocus(null, null, 30);
        }
      })();
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
      [[8, 3], [24, 26], [34, 12]].forEach(([x, y]) => set(x, y, 'T'));
      return g.map((r) => r.join(''));
    },
    // sunset once the show is about to start, night after the main event
    tint(ctx) {
      const f = flags();
      if (f.dadBeaten) {
        ctx.fillStyle = 'rgba(14,20,72,0.5)';
        ctx.fillRect(0, 0, G.W, G.H);
      } else if (f.doronDeal) {
        // banded sunset: purple sky up top fading into orange
        ctx.fillStyle = 'rgba(255,110,40,0.26)';
        ctx.fillRect(0, 0, G.W, G.H);
        ctx.fillStyle = 'rgba(80,30,130,0.26)';
        ctx.fillRect(0, 0, G.W, 56);
        ctx.fillStyle = 'rgba(80,30,130,0.14)';
        ctx.fillRect(0, 56, G.W, 40);
      }
    },
    setup(w) {
      w.addBuilding({ x: 13, y: 2, w: 14, h: 7, door: 7, style: 'metal', wall: '#9aa4b4', roof: '#5a6474', banner: 'MICRO MAYHEM WRESTLING', to: { map: 'arena', x: 11, y: 16 } });
      w.addProp({ img: G.spr.booth, tx: 16, ty: 9, h: 2, solid: [16, 9, 3, 2], hit: [16, 9, 3, 2], talk: S.ticketBooth });
      w.addProp({ img: G.spr.standFunnel, tx: 23, ty: 19, h: 3, solid: [23, 20, 4, 2], hit: [23, 20, 4, 2], talk: S.funnelCake });
      w.addProp({ img: G.spr.standCorn, tx: 28, ty: 19, h: 3, solid: [28, 20, 4, 2], hit: [28, 20, 4, 2], talk: S.cornDogs });
      w.addProp({ img: G.spr.standLemon, tx: 33, ty: 19, h: 3, solid: [33, 20, 4, 2], hit: [33, 20, 4, 2], talk: S.lemonade });
      for (const x of [30, 31, 32]) w.addProp({ img: G.spr.potty, tx: x, ty: 9, h: 2, solid: [x, 9, 1, 2], hit: [x, 9, 1, 2], talk: S.potty });
      for (const [x, y] of [[23, 16], [24, 16], [23, 17], [35, 10], [36, 10], [6, 9]]) w.addProp({ img: G.spr.hay, tx: x, ty: y, solid: [x, y, 1, 1] });
      for (const [x, y] of [[19, 15], [19, 21], [18, 11]]) w.addProp({ img: G.spr.trash, tx: x, ty: y, dx: 2, solid: [x, y, 1, 1] });
      // Ferris wheel in the corner and strings of lights over the paths
      w.props.push(new G.FerrisWheel(33 * 16, 8 * 16 + 14));
      w.blockTiles(31, 8, 4, 1);
      // (the middle string starts at x=25 so its pole isn't where Nate talks to Doron)
      for (const [a, b] of [[[12, 11], [19, 11]], [[25, 11], [29, 11]], [[22, 21], [37, 21]]]) {
        w.props.push(new G.LightString(a[0] * 16 + 8, a[1] * 16 + 14, b[0] * 16 + 8, b[1] * 16 + 14));
        for (const [tx, ty] of [a, b]) {
          w.props.push(new G.LightPole(tx * 16 + 8, ty * 16 + 14));
          w.blockTiles(tx, ty, 1, 1);
        }
      }
      [[4, 17, 0], [10, 17, 1], [16, 17, 2], [7, 24, 3], [13, 24, 4], [16, 24, 5]].forEach(([x, y, c]) =>
        w.addProp({ img: G.spr.cars[c], tx: x, ty: y, h: 2, dx: 4, solid: [x, y, 2, 2] }));

      const npc = (sprite, name, tx, ty, talk, o = {}) =>
        w.add(new G.NPC(Object.assign({ sprite, name, x: tx * 16 + 8, y: ty * 16 + 14, talk }, o)));
      npc('superfan', 'Superfan', 14, 11, S.superfan, { wander: 10 });
      npc('attendant', 'Attendant', 8, 15, S.attendant, { dir: 'right' });
      if (!flags().dadBeaten) npc('doron', 'Doron', 22, 10, S.doron);
      if (flags().doronDeal) npc('pete', 'Pyro Pete', 24, 10, S.pete, { dir: 'left' });
      npc('rose', 'Grandma Rose', 27, 23, S.rose, { wander: 10 });
      npc('earl', 'Big Earl', 25, 13, S.earl);

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
      if (flags().dadBeaten) w.add(new G.NPC({ sprite: 'dad', name: 'Dad', x: 7 * 16 + 8, y: 15 * 16 + 14, dir: 'left', talk: S.dadArena }));
      // everyone Nate gave one of Doron's tickets to shows up ringside
      [['superfan', 'Superfan', 5, 8, 'right'], ['rose', 'Grandma Rose', 18, 8, 'left'], ['gus', 'Gus', 5, 10, 'right'], ['devin', 'Devin', 18, 10, 'left']]
        .forEach(([sprite, name, x, y, dir]) => {
          if (flags()['ticket_' + name] !== 'yes') return;
          w.add(new G.NPC({ sprite, name, x: x * 16 + 8, y: y * 16 + 14, dir, talk: S.ringsideFan }));
        });

      // before the main event, wrestlers are warming up in here
      if (!flags().doronDeal || flags().dadBeaten) {
        [[10, 8, 'gold'], [13, 10, 'red'], [5, 13, 'blue'], [18, 12, 'green']].forEach(([x, y, s]) =>
          w.add(new G.Wrestler(x * 16 + 8, y * 16 + 14, s)));
      }

      w.addWarp(11, 17, 2, 1, 'fair', 20, 9, 'down');
    },
    onEnter() {
      const f = flags();
      return (function* () {
        if (f.doronDeal && !f.dadBeaten) yield* S.mainEvent();
      })();
    },
  };

  // The ring for the boss fight: one screen, ropes all around, crowd up top.
  G.MAPS.ring = {
    name: 'Main Event',
    music: 'boss',
    tiles: (() => {
      const rows = ['B'.repeat(15), 'P' + 'h'.repeat(13) + 'P'];
      for (let y = 2; y <= 8; y++) rows.push('j' + 'n'.repeat(13) + 'j');
      rows.push('P' + 'h'.repeat(13) + 'P');
      return rows;
    })(),
    setup(w) {
      w.addProp({ img: G.spr.ringLogo, tx: 6, ty: 4, h: 3, flat: true });
      if (!flags().dadBeaten) w.add(new G.ElEnglish(10 * 16 + 8, 5 * 16 + 14));
    },
    onEnter() {
      return (function* () {
        if (!flags().dadBeaten) yield* S.ringIntro();
      })();
    },
  };
})();
