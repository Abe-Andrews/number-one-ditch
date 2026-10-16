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
  };
  // grid order; null = an empty slot for things Nate hasn't found yet
  G.GEAR_SLOTS = ['hammer', 'doosh', 'package', 'pipe', 'bidet', null, null, null];

  // ================================================================ SMOKE SIGNALS (Dad's pipe)
  // Like ocarina songs: learn a sequence, puff it with the pipe, something
  // happens. Add new ones here as the story teaches them.
  G.SIGNALS = [
    { id: 'peace', name: 'Peace Be With You', seq: ['up', 'down', 'up'], known: () => !!fl().signal_peace, effect: () => G.SCRIPTS.signalPeace() },
  ];
  G.KEY_SLOTS = ['phone', 'hat', 'tickets', 'chemFinal', null, null, null, null];

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
    doron: { name: 'Doron', bio: 'The oldest brother. Army vet. Never skips leg day. Owns three luchador masks.', skill: 'Lifts and smashes heavy things' },
    lily: { name: 'Lily', bio: '', skill: '' },
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
      id: 'mikey', name: 'Mikey', tag: '{p}Waiting for Lily', met: () => fl().mikeyMet,
      bio: 'Showed up with flowers, balloons and a song. Won\'t let anyone drive to Chesapeake until he talks to Lily.',
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
    else if (f.mikeyMet && !f.lilySaved) goal = 'Find Lily. Mikey won\'t let you drive to Chesapeake until he talks to her. (Coming soon!)';
    else goal = 'Explore home. (More of the story is coming soon!)';
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
  const inside = '(The inside is coming in a future update!)';

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
    yield G.walkTo(m, 54 * 16 + 8, 53 * 16 + 10, 4);
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
    yield G.walkTo(m, 54 * 16 + 8, 53 * 16 + 10, 4);
    yield G.walkTo(m, m.home.x, m.home.y, 3);
    m.dir = 'down';
  };
  S.homeFront = function* () {
    yield G.say(null, 'The front door, with a wreath on it. Home sweet home.');
    yield G.say(null, inside);
  };
  S.homeWing = function* () {
    yield G.say(null, 'The French doors by the old brick chimney.');
    yield G.say(null, inside);
  };
  S.homeGarage = function* () {
    yield G.say(null, 'The garage, with Dad\'s workshop inside: pipe blanks, rasps, sandpaper, and about four hundred coffee cans full of screws.');
    yield G.say(null, inside);
  };
  S.homeCovered = function* () {
    yield G.say(null, 'The covered area behind the garage. String lights, folding chairs, and a wheelbarrow that has seen things.');
    yield G.say(null, 'It\'s where everybody ends up on summer nights.');
  };
  S.homePoolHouse = function* () {
    yield G.say(null, 'The little white pool house. Towels, pool noodles, and a skimmer net.');
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

  // Nate's childhood home on Rattlesnake Bridge Rd, Bedminster NJ, laid out
  // from the property survey (plus the family's corrections): the road and
  // board fence along the bottom; the white farmhouse near the road with its
  // patio on the left by the chimney; the garage (Dad's workshop inside) with
  // the covered area built onto its back; the asphalt driveway; the little
  // white pool house to the right of the house and the pool behind it; a long
  // stone driveway that comes in from the road on the far east, runs north to
  // a bridge over Brady Brook, and curves back west to the house; and the
  // fenced garden with the chicken coop. (No house number: the game is public.)
  G.MAPS.home = {
    name: 'Rattlesnake Bridge Rd',
    music: 'home',
    tiles() {
      const W = 60, H = 56;
      const g = Array.from({ length: H }, (_, y) => Array.from({ length: W }, (_, x) => ((x >> 1) % 2 ? 'L' : 'M')));
      const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < W && y < H) g[y][x] = c; };
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) set(x + i, y + j, c); };
      // the long stone driveway: in from the road on the far east, north to the brook...
      fill(54, 44, 2, 9, 'g');
      fill(55, 36, 2, 8, 'g');
      fill(54, 27, 2, 9, 'g');
      fill(53, 18, 2, 9, 'g');
      fill(52, 11, 2, 7, 'g');
      fill(51, 0, 2, 11, 'g');
      // ...and the long branch curving back west to the house
      fill(25, 25, 16, 2, 'g');
      fill(41, 24, 7, 2, 'g');
      fill(48, 23, 6, 2, 'g');
      // Brady Brook runs diagonally across the top; the driveway crosses on a bridge
      const brook = (x) => Math.round(1 + x * 0.15);
      for (let x = 0; x < W; x++) { set(x, brook(x), '~'); set(x, brook(x) + 1, '~'); }
      for (let y = 0; y < H; y++) for (const x of [51, 52]) if (g[y][x] === '~') g[y][x] = 'W';
      // woods along both banks (the conservation easement)
      for (let x = 0; x < W - 1; x += 2) {
        if (x >= 49 && x <= 54) continue;
        const c = brook(x);
        if (c >= 4) set(x, c - 3, 'T');
        if (x % 4 === 0 || x > 18) set(x, c + 3, 'T');
      }
      // asphalt driveway in front of the garage
      fill(9, 25, 16, 3, 'a');
      // Rattlesnake Bridge Road and the board fence along it (gap for the driveway)
      fill(0, 53, W, 1, 'a');
      fill(0, 54, W, 1, 'Y');
      fill(0, 52, W, 1, 'f');
      set(54, 52, 'g'); set(55, 52, 'g');
      // wildflowers scattered across the front meadow
      for (let i = 0; i < 40; i++) set(Math.floor(G.hash(i, 71) * 52), 36 + Math.floor(G.hash(i, 72) * 15), ',');
      // pavers from the driveway down the side of the house to the front door
      fill(29, 27, 1, 8, 'p');
      fill(25, 34, 4, 1, 'p');
      // boxwood hedges along the front of the house
      fill(19, 34, 5, 1, 'H');
      // in-ground pool on a concrete deck, behind the pool house
      fill(33, 17, 7, 5, 'C');
      fill(34, 18, 5, 3, '~');
      // the garden: rustic X-braced fence, raised beds, snapdragons, paths
      fill(2, 9, 15, 1, 'X'); fill(2, 17, 15, 1, 'X');
      fill(2, 9, 1, 9, 'X'); fill(16, 9, 1, 9, 'X');
      set(9, 17, 'k');
      fill(3, 12, 13, 1, '=');
      fill(10, 13, 1, 4, '=');
      fill(11, 13, 1, 4, 'k');
      [[4, 13], [5, 13], [4, 15], [5, 15], [13, 13], [14, 13], [13, 15], [14, 15]].forEach(([x, y]) => set(x, y, 'e'));
      fill(7, 13, 2, 3, 'F');
      // big oaks around the yard; woods between the lot and the driveway and on the east edge
      [[10, 31], [5, 28], [33, 30], [38, 28], [43, 19], [24, 20], [0, 19], [0, 23], [0, 27], [0, 31],
        [48, 27], [48, 31], [56, 14], [58, 16], [56, 20], [58, 22], [56, 26], [58, 28], [56, 31], [58, 33],
        [8, 40], [15, 44], [22, 39], [28, 46], [36, 41], [42, 46], [47, 39], [6, 47], [18, 49], [33, 49], [11, 36],
        [57, 37], [57, 41], [57, 45], [0, 35], [0, 39], [0, 43], [0, 47]]
        .forEach(([x, y]) => set(x, y, 'T'));
      return g.map((r) => r.join(''));
    },
    setup(w) {
      // garage with Dad's workshop inside, and the covered area built onto its back
      w.addBuilding({ x: 9, y: 21, w: 7, h: 4, door: 3, style: 'shake', wall: '#2f4a3e', roof: '#4a4c56', garageDoors: 3, weathervane: true, locked: S.homeGarage });
      w.addProp({ img: G.spr.coveredArea, tx: 4, ty: 21, h: 4, solid: [4, 21, 5, 4], hit: [4, 21, 5, 4], talk: S.homeCovered });
      // the house: chimney wing on the left, two-story main block, patio on the left side
      w.addBuilding({ x: 17, y: 29, w: 4, h: 5, door: 1, style: 'clapboard', wall: '#f2f0ea', roof: '#4a4c56', shutters: '#1c2226', glass: '#3a4a6a', doorColor: '#c8dce8', doorFrame: '#ffffff', chimney: { x: 2, w: 10 }, locked: S.homeWing });
      w.addBuilding({ x: 21, y: 28, w: 8, h: 6, door: 4, style: 'clapboard', stories: 2, wallH: 48, wall: '#f2f0ea', roof: '#4a4c56', shutters: '#1c2226', glass: '#3a4a6a', doorColor: '#1c3a2c', wreath: true, locked: S.homeFront });
      w.addProp({ img: G.spr.patio, tx: 14, ty: 31, h: 3, solid: [14, 32, 3, 2], hit: [14, 31, 3, 3], talk: S.homePatio });
      // the little white pool house, to the right of the house and a bit behind it
      w.addBuilding({ x: 31, y: 22, w: 2, h: 3, door: 0, style: 'clapboard', wall: '#f4f2ec', roof: '#4a4c56', doorColor: '#f4f2ec', doorFrame: '#c8c8c8', locked: S.homePoolHouse });
      // the yard
      w.addProp({ img: G.spr.truck, tx: 18, ty: 25, h: 3, dx: 2, solid: [18, 25, 2, 3], hit: [18, 25, 2, 3], talk: S.homeTruck });
      w.addProp({ img: G.spr.coop, tx: 4, ty: 10, h: 2, solid: [4, 10, 6, 2], hit: [4, 10, 6, 2], talk: S.homeCoop });
      w.addProp({ img: G.spr.greenhouse, tx: 12, ty: 10, h: 2, solid: [12, 10, 3, 2], hit: [12, 10, 3, 2], talk: S.homeGreenhouse });
      w.addProp({ img: G.spr.firewood, tx: 17, ty: 21, solid: [17, 21, 2, 1], hit: [17, 21, 2, 1], talk: S.homeFirewood });
      w.addProp({ img: G.spr.firewood, tx: 2, ty: 25, solid: [2, 25, 2, 1], hit: [2, 25, 2, 1], talk: S.homeFirewood });
      w.addProp({ img: G.spr.sawhorses, tx: 35, ty: 27, dx: 2, solid: [35, 27, 3, 1] });
      w.addProp({ img: G.spr.mailbox, tx: 57, ty: 51, dx: 2, solid: [57, 51, 1, 1], hit: [57, 51, 1, 1], talk: S.homeMailbox });
      w.addProp({ img: G.spr.streetSign, tx: 51, ty: 51, solid: [51, 51, 1, 1], hit: [51, 51, 1, 1], talk: S.homeStreetSign });
      w.props.push({ img: null, x: 0, y: 0, base: 0, hit: [34 * 16, 18 * 16, 39 * 16, 21 * 16], talk: S.homePool });
      w.addTree(16, 19, 'pine');
      w.addTree(41, 21, 'pine');
      w.add(new G.Sign(54, 12, 'BRADY BROOK.'));

      // the hens, free-ranging inside the garden fence
      const pen = [3 * 16 + 6, 13 * 16 + 4, 16 * 16 - 6, 17 * 16 - 2];
      [[6, 14, 'white'], [9, 14, 'brown'], [12, 14, 'white'], [10, 16, 'brown'], [6, 16, 'white']]
        .forEach(([x, y, c]) => w.add(new G.Chicken(x * 16 + 8, y * 16 + 12, c, pen)));

      // leaving: either end of the road asks where to; north past the bridge is a dead end for now
      w.addTrigger(0, 53, 1, 2, () => G.script.run(S.homeLeave('west')));
      w.addTrigger(59, 53, 1, 2, () => G.script.run(S.homeLeave('east')));
      w.addTrigger(51, 0, 2, 1, () => G.script.run(S.homeNorth()));

      // Mikey, waiting at the start of the driveway with flowers and balloons
      if (!flags().lilySaved) {
        const mikey = w.add(new G.NPC({ sprite: 'mikey', name: 'Mikey', x: 53 * 16 + 8, y: 51 * 16 + 14, dir: 'down', talk: S.mikey, balloons: true }));
        mikey.held = G.spr.bouquet;
        w.mikey = mikey;
        w.addTrigger(49, 51, 10, 4, () => { if (!flags().mikeyMet) G.script.run(S.mikeyIntro()); });
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
