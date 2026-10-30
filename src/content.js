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
    // 5'2", a NICU nurse at CHKD (from the user's photos): long, wavy honey-blonde hair, rosy
    // cheeks, a big smile, her blue scrubs with her work badge clipped on, white sneakers.
    hannah: {
      skin: '#f6d0bc', hair: '#c8995a', hairStyle: 'wavy', hairEnd: 3, blush: true, smile: '#ffffff',
      shirt: '#2e56a6', neckline: true, logo: '#f4f0e8', pants: '#2e56a6', shoes: '#f0f0ec', torso: 5, legs: 3,
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
    // Tyler (from his photo): messy dark hair, black sport sunglasses pushed up on
    // his forehead, stubble, an olive zip-up jacket and a black backpack.
    tyler: {
      skin: '#e2b48e', hair: '#3a2a20', hairStyle: 'short', messy: true, shades: '#141418', beard: '#9a7660',
      coat: '#5a5c3a', shirt: '#2a2a2c', straps: '#1c1c20', pants: '#3a3e4a', shoes: '#2e2a28', torso: 7, legs: 4,
    },
    // ...and hypnotized by Father Eggmas: spiral eyes, glowing purple.
    tylerHypno: {
      skin: '#e2b48e', hair: '#3a2a20', hairStyle: 'short', messy: true, shades: '#141418', beard: '#9a7660', eyes: '#d040f0', swirl: true,
      coat: '#5a5c3a', shirt: '#2a2a2c', straps: '#1c1c20', pants: '#3a3e4a', shoes: '#2e2a28', torso: 7, legs: 4,
    },
    // Mikey: short brown hair, dark rectangular glasses, black polo.
    mikey: {
      skin: '#f4cdb0', hair: '#7a4a28', hairStyle: 'short', glasses: '#2a2e48', smile: '#f0e0d8',
      shirt: '#1c1c24', collar: '#34343e', logo: '#d03038', pants: '#5a6478', shoes: '#2a2a30', torso: 5, legs: 3,
    },
    // The old fisherman on the bridge-tunnel island: ball cap, gray beard, tackle vest.
    fisherman: {
      skin: '#e0ac84', hair: '#d0d0d4', hairStyle: 'cap', hat: '#c8b890', hatStyle: 'ball', beard: '#d8d8dc',
      shirt: '#3a6a8a', coat: '#b89a68', pants: '#5a5a48', shoes: '#3a3028', torso: 7, legs: 4,
    },
    // The toll-taker in the Chesapeake Channel Tunnel: a deep hood, no face, two glowing eyes.
    hooded: {
      skin: '#141018', hair: '#2a2438', hairStyle: 'short', eyes: '#f8e070',
      shirt: '#2a2438', pants: '#1e1a28', shoes: '#16121c', cloak: '#2e2840', hood: '#2e2840', torso: 8, legs: 5,
    },
    // Campus NPCs
    // Professor Pembrook of the Department of EEENGLISH: tweed, glasses, and (ever since
    // Micro Mayhem) El EEENGLISH's own navy mask with the white trim and red emblem
    pembrook: {
      skin: '#f0c8a8', hair: '#5a4030', hairStyle: 'short', glasses: '#2a2a30', mask: '#1c2c6c', maskTrim: '#e8e8f0', maskEmblem: '#d03038',
      coat: '#6a5a40', shirt: '#e8e0c8', pants: '#4a4038', shoes: '#3a2818', torso: 7, legs: 3,
    },
    // Ben, Nate's real friend (from the user's photo in Refe Photos/Lafayette People): wavy, tousled
    // light-brown hair, rosy cheeks, a light blue sweatshirt over a white tee, and black over-ear
    // headphones around his neck. (He used to be "Devin"; same lines.)
    ben: {
      skin: '#f6d2bc', hair: '#9a7048', hairStyle: 'mop', blush: true, eyes: '#3a3a48',
      shirt: '#9cb8cc', pants: '#4a5468', shoes: '#e8e8e8', neck: '#f4f4ee', headphones: '#1c1c22', torso: 6, legs: 3,
    },
    // Prof. Sunderlin, Nate's real geology professor (from the user's photo in Refe Photos/Lafayette
    // People): short brown hair, clean-shaven, broad shoulders, a gray polo. (He used to be "Prof.
    // Schist"; same lines.)
    prof: {
      skin: '#f0c4a0', hair: '#6a4a30', hairStyle: 'short',
      shirt: '#7a8088', collar: '#9aa0a8', pants: '#5a5448', shoes: '#4a3424', wide: true, torso: 7, legs: 3,
    },
    // Prof. Carley, Nate's associate geology professor (from the user's photo in Refe Photos/Lafayette
    // People): long straight brown hair, a big smile, a red cardigan over a white top, a little
    // necklace, gray pants. She's taking Nate to New Zealand (geology study abroad).
    carley: {
      skin: '#f4d0b8', hair: '#6a4428', hairStyle: 'long', smile: '#ffffff', blush: true,
      coat: '#d04848', shirt: '#f4f0ec', neckline: true, necklace: '#e8d8a0', pants: '#7a7a80', shoes: '#3a3038', torso: 6, legs: 3,
    },
    // Tom from Tom's Pizza (Union, NJ, and now Lafayette): older, salt-and-pepper hair and
    // gray stubble, super bushy dark eyebrows, blue cap, navy shirt with white stripes across
    // the chest, a navy apron, a gold chain
    tom: {
      skin: '#d4a486', hair: '#8c8884', hairStyle: 'cap', hat: '#4a88c8', hatStyle: 'ball', capHigh: true, brows: '#1c1614',
      beard: '#ac9a8c', wrinkles: true,
      shirt: '#26304e', pattern: 'chestStripes', neckline: true, necklace: '#e8c060',
      pants: '#2a2e40', shoes: '#2a2a30', torso: 7, legs: 3,
    },
    // Campus Safety, keeping everybody on campus during finals week
    // the toll collector at the Eastern Shore end of the Bay Bridge-Tunnel
    // golfers on the course behind the condos (not thrilled about a giant dog on the fairway)
    golferA: { skin: '#f0c8a8', hair: '#6a4a30', hairStyle: 'cap', hat: '#f4f4f0', hatStyle: 'ball', patch: '#2a5a9a', shirt: '#e8c838', collar: '#f8e070', pants: '#c8b48a', shoes: '#f4f4f0', torso: 7, legs: 4 },
    golferB: { skin: '#c88a64', hair: '#2a1c18', hairStyle: 'cap', hat: '#2a4a8a', hatStyle: 'ball', shirt: '#e86a8a', collar: '#f8a0b8', pants: '#3a4a6a', shoes: '#f4f4f0', torso: 7, legs: 4 },
    golferC: { skin: '#e8b898', hair: '#d0d0d4', hairStyle: 'short', shirt: '#5aa86a', collar: '#8ad89a', pants: '#f0ece0', shoes: '#3a3028', torso: 7, legs: 4 },
    tollWorker: {
      skin: '#c88a64', hair: '#2a1c18', hairStyle: 'long', shirt: '#c8e830', collar: '#f0c020',
      pants: '#2a2e40', shoes: '#2a2a30', torso: 6, legs: 3,
    },
    officer: {
      skin: '#e0b090', hair: '#4a3a2a', hairStyle: 'cap', hat: '#1c2a4a', hatStyle: 'ball', patch: '#e8c060',
      shirt: '#2a3a6a', pants: '#1c2440', shoes: '#1c1c22', torso: 7, legs: 4,
    },
    vendor: {
      skin: '#e0aa80', hair: '#3a2418', hairStyle: 'cap', hat: '#ffffff', hatStyle: 'ball', smile: '#ffffff',
      shirt: '#f8f8f8', pants: '#5878b8', shoes: '#303030', torso: 7, legs: 3,
    },
    maya: { skin: '#d8a078', hair: '#2a1a14', hairStyle: 'long', shirt: '#8a2034', pants: '#384058', shoes: '#f0f0f0', torso: 5, legs: 3 },
    // Bismarck, Nate's real friend (from the user's photo in Refe Photos/Lafayette People):
    // shoulder-length black twists, a short goatee, a big grin, and an aqua tee with a little orange
    // logo on the chest. (He used to be "Jordan"; same lines.)
    bismarck: {
      skin: '#7a4a30', hair: '#1c1412', hairStyle: 'locs', goatee: '#1c1412', smile: '#ffffff', grin: true,
      shirt: '#7cc8cc', logo: '#e88a30', pants: '#3a4258', shoes: '#f0f0f0', torso: 6, legs: 3,
    },
    // Fairgrounds
    superfan: { skin: '#f0c8a8', hair: '#5a3a20', hairStyle: 'cap', hat: '#d03038', hatStyle: 'ball', patch: '#f8d040', shirt: '#d03038', pants: '#3a4258', shoes: '#f0f0f0', torso: 6, legs: 3, smile: '#ffffff' },
    attendant: { skin: '#c88a60', hair: '#2a1a14', hairStyle: 'short', shirt: '#f08020', collar: '#f8e040', pants: '#3a3a44', shoes: '#202024', torso: 7, legs: 3 },
    lemonade: { skin: '#f8d8c0', hair: '#e8c060', hairStyle: 'shoulder', shirt: '#f8e040', pants: '#5878b8', shoes: '#f0f0f0', torso: 5, legs: 3, blush: true, smile: '#ffffff' },
    ref: { skin: '#e8b890', hair: '#3a2418', hairStyle: 'buzz', shirt: '#f0f0f0', pattern: 'stripes', pants: '#1c1c24', shoes: '#1c1c24', torso: 6, legs: 3 },
    pete: { skin: '#e8b890', hair: '#6a4028', hairStyle: 'cap', hat: '#e05020', hatStyle: 'ball', beard: '#6a4028', shirt: '#2a2a30', pants: '#4a4038', shoes: '#3a2818', boots: true, torso: 7, legs: 3 },
    // Doron's fight night: five of his favorite UFC fighters, as pixel caricatures (bare chests,
    // fight shorts, black gloves, barefoot). Rampage: a buzzed head and a short beard, heavy build
    // (and his walkout chain); McGregor: a red beard, slicked dark hair and his chest tattoo;
    // Khabib: a full dark beard (and his papakha on the walkout); Mighty Mouse: small and quick;
    // Jon Jones: tall and long-limbed (the reach).
    rampage: { skin: '#5a3626', hair: '#141014', hairStyle: 'buzz', beard: '#1c1414', beardLow: true, shirt: '#5a3626', sleeves: 0, pants: '#1c1c22', belt: '#c83030', shorts: true, shoes: '#5a3626', gloves: '#1c1c22', wide: true, torso: 7, legs: 3, walkout: 'chain' },
    conor: { skin: '#f2c8aa', hair: '#3a2418', hairStyle: 'swoop', beard: '#b0582c', shirt: '#f2c8aa', tattoo: '#3a4a5a', sleeves: 0, pants: '#2a8040', belt: '#f0f0f0', shorts: true, shoes: '#f2c8aa', gloves: '#1c1c22', wide: true, torso: 6, legs: 3 },
    khabib: { skin: '#e8c0a0', hair: '#1c1614', hairStyle: 'buzz', beard: '#1c1614', shirt: '#e8c0a0', sleeves: 0, pants: '#1c1c22', shorts: true, shoes: '#e8c0a0', gloves: '#1c1c22', wide: true, torso: 6, legs: 3, walkout: 'papakha' },
    mouse: { skin: '#6a4430', hair: '#141014', hairStyle: 'bald', shirt: '#6a4430', sleeves: 0, pants: '#e8e8f0', belt: '#d83038', shorts: true, shoes: '#6a4430', gloves: '#1c1c22', torso: 5, legs: 3 },
    jones: { skin: '#5e3a28', hair: '#141014', hairStyle: 'buzz', beard: '#1c1414', beardLow: true, shirt: '#5e3a28', sleeves: 0, pants: '#1c1c22', belt: '#f0f0f0', shorts: true, shoes: '#5e3a28', gloves: '#1c1c22', torso: 7, legs: 5, reach: true },
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
  // Dr. Nataro, a real Lafayette chemistry professor (from the user's photo in Refe Photos/Lafayette
  // People): a shaved head, a short salt-and-pepper beard, and a bright blue shirt with a space
  // print. (He used to be "Dr. Nataro"; same lines.)
  G.CAST.nataro = {
    skin: '#f0c4a8', hair: '#c8c4c0', hairStyle: 'bald', beard: '#8a8884', beardLow: true,
    shirt: '#2a5ab8', pattern: 'cosmic', sleeves: 'long', pants: '#3a3a44', shoes: '#2a2a2a', torso: 7, legs: 3,
  };
  G.CAST.rose = {
    skin: '#f4d4c0', hair: '#e8e8f0', hairStyle: 'shoulder', glasses: '#8a6a9a', smile: '#ffffff', blush: true,
    shirt: '#e8a0c0', coat: '#f0c0d8', dress: '#8a7ab0', shoes: '#f0f0f0', torso: 5, legs: 3,
  };
  // Anette, Abe and Hannah's neighbor: short white hair, a lavender cardigan over a cream blouse, a blue skirt.
  G.CAST.anette = {
    skin: '#f4d4c4', hair: '#f2f2f6', hairStyle: 'cropped', smile: '#ffffff', blush: true,
    shirt: '#f4ecdc', coat: '#b8a0d8', dress: '#5a7aa8', shoes: '#f0f0f0', torso: 5, legs: 3,
  };
  // The Paul McCartney Lady, at El Toro Loco (the user saw her there once). She looks EXACTLY
  // like him: a chestnut mop-top with a full fringe, a navy jacket over a white top, dark jeans
  // and Chelsea boots. She plays bass. Left-handed, of course.
  G.CAST.paulLady = {
    skin: '#f2c8a8', eyes: '#4a3420', hair: '#6a3e24', hairStyle: 'mop', smile: '#ffffff',
    coat: '#2a2e48', shirt: '#f2f0ea', pants: '#2e3a58', shoes: '#2a2420', boots: true, torso: 6, legs: 3,
  };
  // El Toro Loco's server, and some regulars
  G.CAST.toroServer = { skin: '#c88a60', hair: '#1a1010', hairStyle: 'short', shirt: '#1c1c20', pants: '#1c1c20', shoes: '#2a2a2a', torso: 6, legs: 3 };
  G.CAST.toroDiner1 = { skin: '#f0c8a8', hair: '#c8a46c', hairStyle: 'shoulder', shirt: '#4a8ac8', pants: '#3a3a44', shoes: '#f0f0f0', torso: 5, legs: 3, smile: '#ffffff' };
  G.CAST.toroDiner2 = { skin: '#8a5a3a', hair: '#1a1010', hairStyle: 'buzz', beard: '#1a1010', shirt: '#d87830', pants: '#384058', shoes: '#4a3428', torso: 7, legs: 3 };
  G.CAST.toroDiner3 = { skin: '#e8b890', hair: '#9a9aa0', hairStyle: 'receding', glasses: '#2a2a30', shirt: '#6a8a5a', pants: '#5a4a38', shoes: '#4a3428', torso: 7, legs: 3 };
  G.CAST.earl = {
    skin: '#e8b090', hair: '#5a3a20', hairStyle: 'cap', hat: '#3a6a3a', hatStyle: 'ball', patch: '#f0f0f0', beard: '#5a3a20',
    shirt: '#b83030', pattern: 'plaid', plaidL: '#d86060', plaidW: '#2a1a1a', sleeves: 'long', pants: '#3a4a6a', shoes: '#4a3428', boots: true,
    wide: true, torso: 8, legs: 4,
  };
  // Brooks, Nate's real friend (from the user's photo): tall and skinny, dark glasses, a light gray
  // ball cap, an olive green hoodie (hood down) and black joggers. (He used to be "Priya"; same lines.)
  G.CAST.brooks = {
    skin: '#f2cab0', hair: '#3a2a20', hairStyle: 'cap', hat: '#d0d0d4', hatStyle: 'ball', glasses: '#202024',
    shirt: '#6a7458', collar: '#545c44', sleeves: 'long', pants: '#1e1e24', shoes: '#2a2a30', torso: 7, legs: 4,
  };

  // Mom: shoulder-length brown hair, tortoiseshell glasses, freckles, gold earrings,
  // a mauve puffer, jeans and green garden boots.
  G.CAST.michelle = {
    skin: '#f4c8aa', hair: '#5a3624', hairStyle: 'shoulder', glasses: '#7a5434', blush: true, smile: '#ffffff', earring: '#e8c060',
    coat: '#a88aa0', shirt: '#e8dce4', pants: '#4a6aa8', shoes: '#4a7a3a', boots: true, torso: 6, legs: 3,
  };

  // Charge Nurse Dot (an original character): Hannah's charge nurse in the NICU. Short gray hair,
  // reading glasses, purple scrubs, white clogs.
  G.CAST.dot = {
    skin: '#f0c8a8', hair: '#c8c4c8', hairStyle: 'cropped', glasses: '#6a3a7a', smile: '#ffffff',
    shirt: '#7a5aa8', neckline: true, pants: '#7a5aa8', shoes: '#f4f4f0', torso: 6, legs: 3,
  };

  // Nani: silver hair pulled loosely back with wispy bangs, rosy cheeks, a big
  // smile, amber drop earrings and a charcoal-navy knit sweater. (She mostly
  // shows up in the group chat, so her face is on her texts.)
  G.CAST.nani = {
    skin: '#f2c2a8', hair: '#c8c4c0', hairStyle: 'shoulder', bangs: true, blush: true, smile: '#ffffff', earring: '#c8803a',
    shirt: '#3a3e52', sleeves: 4, pants: '#5a5a68', shoes: '#6a4a38', torso: 6, legs: 3,
  };

  // Ice JJ Fish: short dark hair, thin silver glasses, a big gap-toothed grin,
  // white tee with navy stars, a chain, a mic.
  G.CAST.icejj = {
    skin: '#b07a58', eyes: '#2a1a10', hair: '#1c1410', hairStyle: 'buzz', glasses: '#8a8a96', smile: '#ffffff', grin: true,
    shirt: '#f4f4f0', pattern: 'stars', necklace: '#c8c8d0', pants: '#2a3a5a', shoes: '#f0f0f0', torso: 7, legs: 4,
  };

  // Lafayette students, protesting the event village on the quad.
  Object.assign(G.CAST, {
    protest1: { skin: '#e8b890', hair: '#c86a30', hairStyle: 'long', shirt: '#8a2034', pants: '#384058', shoes: '#f0f0f0', torso: 5, legs: 3 },
    protest2: { skin: '#8a5a3a', hair: '#1a1010', hairStyle: 'short', glasses: '#202020', shirt: '#3a6a3a', pants: '#2a2a30', shoes: '#c8c8c8', torso: 6, legs: 3 },
    protest3: { skin: '#f0c8a8', hair: '#e0c070', hairStyle: 'shoulder', shirt: '#f0f0f0', pants: '#5878b8', shoes: '#a03030', torso: 5, legs: 3, blush: true },
    protest4: { skin: '#c88a60', hair: '#2a1a14', hairStyle: 'cap', hat: '#8a2034', hatStyle: 'ball', shirt: '#8a2034', pants: '#4a4038', shoes: '#f0f0f0', torso: 6, legs: 3 },
    protest5: { skin: '#f2c8a0', hair: '#5a3a20', hairStyle: 'buzz', beard: '#5a3a20', shirt: '#4a5a8a', sleeves: 'long', pants: '#3a3a44', shoes: '#3a2818', torso: 7, legs: 3 },
    organizer: { skin: '#e0b088', hair: '#2a1a14', hairStyle: 'shoulder', glasses: '#202020', shirt: '#6a3a8a', pants: '#2a2a30', shoes: '#c8c8c8', torso: 6, legs: 3 },
  });

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
      kind: 'gear', equip: true, name: 'Dad\'s Pipe', short: 'Dad\'s Pipe', has: () => !!st().items.pipe,
      // (looks like whichever pipe Nate picked in COLLECTABLES, and smokes whatever's packed in it)
      icon: () => (st().pipeSkin && G.pipeHas(st().pipeSkin) ? G.pipeLook(st().pipeSkin, 0.25) : G.spr.pipe),
      desc: () => {
        const skin = st().pipeSkin && G.pipeHas(st().pipeSkin) && G.pipeInfo(st().pipeSkin), tob = st().tobacco && G.tinHas(st().tobacco) && G.tinInfo(st().tobacco);
        return (skin ? 'The ' + skin.name + ', made with Dad.' : 'Hand-carved by Dad.') + ' Press X and puff a song.' + (tob ? ' Packed with ' + tob.name + '.' : '');
      },
    },
    bidet: {
      kind: 'gear', equip: true, name: 'Portable Bidet', short: 'Bidet', icon: () => G.spr.bidetIcon, has: () => !!st().items.bidet,
      desc: () => {
        const f = fl(), ups = [f.bidetBig && 'a lab carboy tank (twice the water)', f.bidetNozzle && 'a turbo nozzle (way more reach)'].filter(Boolean);
        return 'From under the sink in Abe and Hannah\'s downstairs bathroom. Hold X to spray. When it runs dry, face any water, sink or toilet and hold X to refill.'
          + (ups.length ? ' Upgraded: ' + ups.join(' and ') + '.' : '');
      },
    },
    rod: {
      kind: 'gear', equip: true, name: 'Surf Rod', short: 'Surf Rod', icon: () => G.spr.rodIcon, has: () => !!st().items.rod,
      desc: 'The old fisherman\'s spare, from the bridge-tunnel island. Press X to cast. Whatever you hook gets reeled in: fish, gulls, teeth... people.',
    },
    candyCorn: {
      kind: 'key', name: 'Mom\'s Candy Corn', icon: () => G.spr.candyCorn, has: () => !!st().items.candyCorn && !fl().snacksDone,
      desc: 'A family-size bag, from behind the gravy boat in the good china. Mom does not know you have it. (She knows.)',
    },
    doritos: {
      kind: 'key', name: 'Blue Doritos', icon: () => G.spr.doritos, has: () => !!st().items.doritos && !fl().snacksDone,
      desc: 'Rescued from a bear. Slightly chewed. Dad will not mind. Dad will not notice.',
    },
    engDiploma: {
      kind: 'key', name: 'Diploma in EEENGLISH', icon: () => G.spr.diploma, has: () => !!fl().engPerfect,
      desc: 'Certifies that Nate speaks EEENGLISH. Three Es. Signed by Professor Pembrook and, in crayon, El EEENGLISH.',
    },
    bmf: {
      kind: 'key', name: 'BMF Belt', short: 'BMF Belt', icon: () => G.spr.bmfIcon, has: () => !!st().items.bmf,
      desc: 'Nani held it until Doron took it off her in the Expo Hall locker room. He is not allowed to say what the letters stand for at Nani\'s house.',
    },
    belt: {
      kind: 'key', name: 'Micro Mayhem Title Belt', short: 'Title Belt', icon: () => G.spr.beltIcon, has: () => !!st().items.belt,
      desc: 'Doron won it at fight night in the Expo Hall locker room: five fighters, five wins. He says champions have people to carry the belt. You\'re the people.',
    },
    pipeBook: {
      kind: 'key', name: 'Dad\'s Pipe Book', short: 'Pipe Book', icon: () => G.spr.pipeBook, has: () => !!st().items.pipeBook,
      desc: 'Dad\'s journal: every pipe he\'s made and every tobacco he\'s smoked, with notes on all of it. He gave it to you. Press Z to read it.',
      use: () => G.SCRIPTS.readPipeBook(),
    },
    mikeyNote: {
      kind: 'key', name: 'Mikey\'s Note', icon: () => G.spr.noteIcon, has: () => !!st().items.mikeyNote,
      desc: 'Folded into a very small square. Mikey gave it to Lily on his way out. Lily can\'t look at it. Press Z to read it.',
      use: () => G.SCRIPTS.readMikeyNote(),
    },
    andoverKey: {
      kind: 'key', name: 'Andover Mines Key', icon: () => G.spr.gateKey, has: () => !!st().items.andoverKey,
      desc: 'Opens the gate at the old Andover iron mines. The tag says "FOR THE ROCK BOY" in Mom\'s church friend\'s handwriting.',
    },
    phone: {
      kind: 'key', name: 'Nate\'s Phone', icon: () => G.spr.phone, has: () => true,
      desc: 'The family group chat. 147 unread, mostly Nani. Press Z to read one.',
      use: () => G.SCRIPTS.naniMessage(),
    },
    hat: {
      kind: 'key', name: 'Hat', icon: () => G.spr.cap, has: () => !!st().items.cap,
      desc: 'Corduroy. Distinguished. Lucky. Everyone says it\'s brown. Nate insists it\'s green.',
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
    vodka: { kind: 'key', name: 'Vodka Shooters', icon: () => G.spr.vodka, has: () => !!st().items.vodka && !fl().badlandsBeaten, desc: 'Three tiny bottles. Mom confiscated them from a hollow "War and Peace" years ago, then sold them back to Nate.' },
    chicken: {
      kind: 'gear', equip: true, name: 'The Chicken', short: 'Chicken', icon: () => G.spr.chickens.white.right[0], has: () => !!st().items.chicken,
      count: () => st().items.eggs || 0,
      desc: 'Henrietta, from Mom\'s flower stand. Press X and she fires an egg. Eggs sold separately (Mom\'s stand, by the dozen).',
    },
    books: {
      kind: 'key', name: 'Mom\'s Books', icon: () => G.spr.flyingBook[1], has: () => !!st().items.books && !fl().shopOpen,
      desc: 'Gardening books, devotionals and a big stack of seed catalogs (dog-eared, everything circled), rescued from the Globglogabgalab. Slightly chewed.',
    },
    basementKey: {
      kind: 'key', name: 'Dad\'s Keyring', icon: () => G.spr.keyring, has: () => !!st().items.basementKey && !fl().globBeaten,
      desc: 'Found in the truck\'s cupholder, under a sermon outline. One of these opens the basement. Probably the rusty one.',
    },
    bait: {
      kind: 'key', name: '"Being a Wonderful Pastor\'s Wife"', short: 'The Bait', icon: () => G.spr.pastorBook, has: () => !!st().items.bait,
      desc: 'A gift to Mom from the church ladies. Mom has been waiting YEARS to get rid of it. Bait for whatever eats books.',
    },
    sifter: {
      kind: 'gear', equip: true, name: 'Tyler\'s Sifter', short: 'Sifter', icon: () => G.spr.sifter, has: () => !!st().items.sifter || !!fl().tylerBeaten,
      desc: 'Tyler\'s sifting screen, for shark teeth at the Number One Ditch. He\'s done sifting forever. Press X to shake the gravel in front of you through it and find the small stuff.',
    },
    badge: {
      kind: 'key', name: 'Hannah\'s Badge', short: 'Badge', icon: () => G.spr.badgeIcon, has: () => !!st().items.badge,
      desc: 'Hannah\'s work badge: her photo, smiling, NICU. Works the elevator up from the CHKD lobby. A little slobbery (a baby was teething on it).',
    },
    // the sloth quest (Romulus is on the golf course)
    abeBass: {
      kind: 'key', name: 'Abe\'s Bass', icon: () => G.spr.abeBassIcon, has: () => !!st().items.abeBass && !fl().bassGiven,
      desc: 'A sunburst bass, from the black case in Abe\'s closet. He has so many guitars, he won\'t even notice. (He will notice.)',
    },
    yellowCable: {
      kind: 'key', name: 'Yellow Guitar Cable', short: 'Cable', icon: () => G.spr.cableIcon, has: () => !!st().items.yellowCable && !fl().bassGiven,
      desc: 'One of Abe\'s thousands of yellow guitar cables, from the storage room. They\'re "inventory." He won\'t miss one.',
    },
    sloth: {
      kind: 'key', name: 'Romulus\'s Sloth', short: 'Sloth', icon: () => G.spr.slothIcon, has: () => !!st().items.sloth && !fl().romGap,
      desc: 'A big, shaggy, fluffy sloth with long white claws. Romulus\'s favorite thing in the whole world. It squeaks. Squeak it at the gap in the woods behind Abe and Hannah\'s patio.',
    },
    earplugs: {
      kind: 'key', name: 'Earplugs', icon: () => G.spr.earplugs, has: () => !!st().items.earplugs,
      desc: 'Cotton balls rolled in Lily\'s vanilla candle wax. A song can\'t get stuck in your head if you can\'t hear it.',
    },
    // CHKD's item: Hannah packs it from the NICU's supply cabinet when she joins
    firstAid: {
      kind: 'gear', equip: true, name: 'Hannah\'s First-Aid Kit', short: 'First-Aid', icon: () => G.spr.firstAidIcon, has: () => !!fl().kitGot,
      desc: () => 'Packed by Hannah: gauze, tape, ice packs and dinosaur bandages. Press X to patch Nate up (3 hearts). Holds ' + G.KIT_MAX + ' uses. Restock it at any supply closet at CHKD.',
    },
  };
  // grid order; null = an empty slot for things Nate hasn't found yet
  G.GEAR_SLOTS = ['hammer', 'doosh', 'package', 'pipe', 'chicken', 'rod', 'sifter', 'bidet', 'firstAid', null, null, null];
  // Hannah's first-aid kit: how many uses it holds, and how much each one heals (half hearts)
  G.KIT_MAX = 3;
  G.KIT_HEAL = 6;
  // how much spray the Portable Bidet holds (frames of holding X), and how much is in it
  // (Dr. Nataro's lab carboy, from the Science Center, doubles it)
  Object.defineProperty(G, 'BIDET_MAX', { get: () => (fl().bidetBig ? 300 : 150), configurable: true });
  // ...and how fast it fills back up while X is held at water, a sink or a toilet (about 5 seconds for a full tank)
  Object.defineProperty(G, 'BIDET_FILL', { get: () => (fl().bidetBig ? 1 : 0.5), configurable: true });
  // how far the stream reaches (the turbo nozzle from the water-gun race at the fair adds a lot)
  G.bidetReach = () => (fl().bidetNozzle ? 112 : 72);
  G.bidetWater = () => { const v = st().items.bidetWater; return v == null ? G.BIDET_MAX : v; };
  // every toilet and sink in the game (by its sprite) fills the bidet back up
  G.waterFixture = (img) => !!img && [G.spr.toilet, G.spr.sinkTop, G.spr.demilune, G.spr.doubleVanity, G.spr.condoVanity, G.spr.safetyStation].includes(img);

  // ================================================================ SMOKE SIGNALS (Dad's pipe)
  // Like ocarina songs: learn a sequence, puff it with the pipe, something
  // happens. Add new ones here as the story teaches them.
  G.SIGNALS = [
    { id: 'peace', name: 'Peace Be With You', seq: ['up', 'down', 'up'], known: () => !!fl().signal_peace, effect: () => G.SCRIPTS.signalPeace() },
    { id: 'icy', name: 'I Pray to Jesus', seq: ['left', 'right', 'up'], known: () => !!fl().signal_icy, effect: () => G.SCRIPTS.signalIcy() },
    { id: 'jlc', name: 'Jamie Lee Curtis', seq: ['right', 'left', 'right'], known: () => !!fl().signal_jlc, effect: () => G.SCRIPTS.signalJlc() },
    // Dad's signature move, from his hip hop class at the grocery store on College Hill
    { id: 'cart', name: 'The Shopping Cart', seq: ['left', 'right', 'left'], known: () => !!fl().signal_cart, effect: () => G.SCRIPTS.signalCart() },
    // "Nice Crack" (down, down, left): Abe teaches it in the finale, once he's free ("Nice
    // crack, Abe!" was Lily, in cooking class). It cracks Father Eggmas's shell when he's down.
    // (Keep any new song's arrows from containing another song's arrows, or one will fire
    // while puffing the other.)
    { id: 'crack', name: 'Nice Crack', seq: ['down', 'down', 'left'], known: () => !!fl().signal_crack, effect: () => G.SCRIPTS.signalCrack() },
  ];
  // (a slot can be shared by items that are never held at the same time: the
  // vodka is used up before Mikey's note, the basement key before the Andover key)
  G.KEY_SLOTS = ['phone', 'hat', 'badge', 'abeBass', 'yellowCable', 'sloth', 'tickets', 'chemFinal', 'milk', 'dye', 'smoke', ['vodka', 'mikeyNote'], 'books', ['basementKey', 'andoverKey'], 'bait', 'earplugs', 'candyCorn', 'doritos', 'engDiploma', 'pipeBook', 'belt', 'bmf'];

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
    doron: { name: 'Doron', bio: 'The oldest brother. Army vet. Obsessed with the UFC. Never skips leg day. Owns three luchador masks. Responsible for the Alligator Incident.', skill: 'Lifts and smashes heavy things' },
    lily: { name: 'Lily', bio: 'Nate\'s sister. Survived a refrigerator. Still subscribed to Badlands Chugs.', skill: 'A "No." that pops balloons' },
    abe: { name: 'Abe', bio: '6\'5". Lives in Chesapeake with Hannah and Romulus. Sells yellow guitar cables on eBay (eventually). Gave Nate a bidet for Christmas, then took it back.', skill: 'He\'s 6\'5": reaches things up high, and boosts Nate over tall hedges' },
    hannah: { name: 'Hannah', bio: '5\'2". A nurse in the NICU at CHKD. Married to Abe. Romulus\'s favorite person. Father Eggmas hypnotized her babies, and now it\'s personal.', skill: 'Heals: patches Nate up when he\'s low, and gives him a checkup when you talk to her' },
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
      id: 'michelle', name: 'Michelle', tag: '{c}Family', met: () => fl().michelleMet,
      bio: () => 'Mom. Flower farmer. Works at the church. NOT "the pastor\'s wife." Yells "Jamie Lee Curtis" when startled.' + (fl().shopOpen ? ' Runs the flower stand.' : ''),
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
    {
      id: 'globglog', name: 'Globglogabgalab', met: () => fl().globMet, img: () => G.spr.globglog[1],
      tag: () => (fl().globBeaten ? '{o}Boss: sings quietly' : '{r}Boss'),
      bio: () => (fl().globBeaten
        ? 'A bookworm who lived in the basement and ate Mom\'s books. Lost a dance battle to Nate. Now sings quietly.'
        : 'Something pink in the basement, eating Mom\'s books and singing a song she can\'t stand. He loves books.'),
    },
    {
      // the hooded figure in the tunnel, until the hood comes down
      get id() { return fl().tylerBeaten ? 'tyler' : fl().tollPaid ? 'tylerHypno' : 'hooded'; },
      get name() { return fl().tollPaid ? 'Tyler' : '???'; },
      met: () => fl().hoodedMet,
      tag: () => (fl().tylerBeaten ? '{o}Boss: snapped out of it' : fl().tollPaid ? '{r}Boss' : '{r}Toll: 500 teeth'),
      bio: () => (fl().tylerBeaten
        ? 'Shark tooth hunter. Screams about mosasaurs. Snapped out of it, gave back the toll, ran for the ditch.'
        : fl().tollPaid
          ? 'Tyler, hypnotized by Father Eggmas. Thinks Nate stole his mosasaur tooth. Throws shark teeth. Hard.'
          : 'Hooded. No face, just glowing eyes. Blocks the Chesapeake Channel Tunnel. Toll: 500 shark teeth.'),
    },
    {
      id: 'fc', name: 'Father Christmas', met: () => fl().fcMet, img: () => (fl().fcBeaten ? G.spr.fc.sweater : G.spr.fc.idle),
      tag: () => (fl().fcBeaten ? '{o}Postgame boss: knitted' : '{r}Postgame boss'),
      bio: () => (fl().fcBeaten
        ? 'The original Christmas doll. Michelle drove him to the Andover mines in a box. Now: half the mantel, one red sweater.'
        : 'The original Christmas doll, thrift-store naked. Vanished in the move. Furious that Eggmas took his mantel.'),
    },
    {
      id: 'icejj', name: 'Ice JJ Fish', met: () => fl().jjMet,
      tag: () => (fl().jjBeaten ? '{o}Boss: beaten' : '{r}Boss'),
      bio: () => (fl().jjBeaten
        ? 'Sang "I Pray to Jesus" on the frozen pond north of the bridge until Nate knocked the mic out of his hands. Taught Nate how to play it on the pipe.'
        : 'Singing "I Pray to Jesus" on a frozen pond north of the bridge. It snows there and nowhere else.'),
    },
    { id: 'gus', name: 'Gus', tag: '{y}Friend', met: () => fl().capQuest, bio: 'Lafayette\'s groundskeeper. Protector of petunias. Found Nate\'s hat.' },
    { id: 'nataro', name: 'Dr. Nataro', tag: '{y}Friend', met: () => fl().chemMet, bio: 'Chemistry professor. Nobody has ever gotten the last question on his final right.' },
    { id: 'pete', name: 'Pyro Pete', tag: '{y}Friend', met: () => fl().doronDeal, bio: 'Runs the pyro for Micro Mayhem. Thinks Nate\'s exploding present was beautiful.' },
    { id: 'prof', name: 'Prof. Sunderlin', tag: '{y}Friend', met: () => fl().profTalk, bio: 'Geology professor. Finds coastal plain ditches fascinating. Flat. Wet. Ditchy.' },
    { id: 'carley', name: 'Prof. Carley', tag: '{y}Friend', met: () => fl().carleyMet, bio: 'Associate professor of geology, in Van Wickle Hall. She\'s taking Nate to New Zealand to study abroad: volcanoes, glaciers and a plate boundary.' },
    { id: 'ben', name: 'Ben', tag: '{y}Friend', met: () => fl().phDone, bio: 'Nate\'s lab partner. Was paid in shark teeth to ask about the pH of rainwater. Once made the campus paper for his shirt.' },
    { id: 'bismarck', name: 'Bismarck', tag: '{y}Friend', met: () => fl().bismarckMet, bio: 'A McKelvey Scholar from Manhattan who wants to be a lawyer. He invited Nate to church.' },
    { id: 'brooks', name: 'Brooks', tag: '{y}Friend', met: () => fl().brooksMet, bio: 'Hilarious. His voice is impossibly high. Higher than his mom\'s.' },
    { id: 'anette', name: 'Anette', tag: '{y}Friend', met: () => fl().anetteMet, bio: 'Abe and Hannah\'s neighbor. Keeps potted plants all up and down the street. Her knees are done with watering cans.' },
    {
      id: 'paulLady', name: 'Paul McCartney Lady', tag: '{y}Friend', met: () => fl().ladyMet,
      bio: () => 'A regular at El Toro Loco. Looks EXACTLY like Paul McCartney, and has heard it every day of her life. Plays bass, left-handed.' + (fl().bassGiven ? ' Traded Romulus\'s sloth for Abe\'s bass, and kept the bass.' : ''),
    },
  ];

  G.people = () => {
    const s = st();
    const list = G.PARTY_ORDER.map((id) => {
      const has = s.party.includes(id), info = G.PARTY_INFO[id];
      return {
        id, known: has, name: has ? info.name : '???',
        tag: !has ? '{d}Not found yet' : id === 'nate' ? '{y}Leader' : G.with(id) ? '{y}Following Nate' : '{g}In the party',
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
    else if (!f.badlandsBeaten && G.ingredientCount() < 4) goal = 'Find milk, blue food coloring, liquid smoke and vodka shooters (ask Mom?) for the refrigerator game. (' + G.sayable(G.ingredientCount()) + '/4)';
    else if (!f.badlandsBeaten) goal = 'Bring the ingredients to Badlands Chugs in the kitchen. Time for the refrigerator game.';
    else if (!f.mikeyBeaten) goal = 'Mikey is waiting at the end of the driveway. Lily has something to tell him.';
    else if (!f.cbbtArrived) goal = 'The road to Chesapeake is open! Leave from either end of Rattlesnake Bridge Rd.';
    else if (!f.tollPaid && f.hoodedNotReady && !s.items.rod) goal = 'The hooded figure says you\'re not ready. Find the old man fishing on the rocks of the island.';
    else if (!f.tollPaid) goal = f.hoodedMet ? 'A hooded figure in the tunnel wants 500 shark teeth to let you through. (' + G.sayable(s.teeth) + '/500)' : 'Cross the Chesapeake Bay Bridge-Tunnel. Chesapeake is on the other side of the tunnel.';
    else if (!f.tylerBeaten) goal = 'The hooded figure is Tyler, hypnotized by Father Eggmas! Snap him out of it.';
    else if (!f.condoArrived) goal = 'Tyler says Father Eggmas is at the Number One Ditch. Chesapeake is through the tunnel!';
    else if (!f.romulusMet) goal = 'Abe and Hannah\'s condo! Their front door is around the side, past the garage.';
    else if (G.romChase()) goal = (f.romHide || 0) < G.ROM_INSIDE ? 'Romulus ran off to hide. Find him somewhere in the house!' : 'Romulus got out the front door, and he\'s hiding somewhere outside. Check bushes, cars, anywhere a dog could squeeze in (press Z on them), or flush him out with the bidet.';
    else if (!f.romulusBeaten && !f.slothQuest) goal = 'Romulus squeezed through the woods behind the patio onto the golf course, and the gap is too small for Nate. Ask Abe what to do.';
    else if (!f.romulusBeaten && f.slothQuest === 1) goal = 'Romulus will come back for his sloth. Abe left it at El Toro Loco, down the main road (off the bottom of the street).';
    else if (!f.romulusBeaten && f.slothQuest === 2) goal = 'The lady at El Toro Loco who looks exactly like Paul McCartney will trade the sloth for a bass and a cable. Try Abe\'s closet and the storage room. (' + G.sayable((s.items.abeBass ? 1 : 0) + (s.items.yellowCable ? 1 : 0)) + '/2)';
    else if (!f.romulusBeaten && f.slothQuest === 3) goal = 'Squeak Romulus\'s sloth at the gap in the woods behind Abe and Hannah\'s patio.';
    else if (!f.romulusBeaten) goal = 'Romulus is out on the golf course, and he\'s HUGE. Go get him!';
    else if (!f.healerTalk) goal = 'Romulus is home safe (and still scared of Nate), and Abe joined the party! Head back to the condo.';
    else if (!f.chkdArrived) goal = 'Abe says you\'ll need a healer to take on Father Eggmas: Hannah, a nurse in the NICU at CHKD. Take Abe\'s Jeep (in the driveway).';
    else if (!s.items.badge && !f.mobileBeaten) goal = 'Everyone at CHKD is hypnotized! The NICU is a locked unit upstairs: find a staff badge to work the lobby elevator.';
    else if (!f.mobileBeaten) goal = 'Take the lobby elevator up to the NICU and find Hannah.';
    else if (!f.roofSeen) goal = 'Hannah joined the party! She wants to show everybody something up on the roof. Take the elevator.';
    else goal = 'Mom and Dad are driving down. When they get here, the whole family goes to the Number One Ditch. Together. (More story soon!)';
    // which chapter of the road trip Nate is on
    const chapter = !f.doronDeal ? 'CH. 1 - LAFAYETTE' : !f.boulderGone ? 'CH. 2 - EASTON FAIR' : !f.mikeyBeaten ? 'CH. 3 - HOME' : !f.condoArrived ? 'CH. 4 - THE BAY' : !f.healerTalk ? 'CH. 5 - CHESAPEAKE' : 'CH. 6 - CHKD';
    // side quests: { name, status, kind (active / rumor / done), prog [n, of], where, hint }
    const side = [];
    const add = (name, done, status, where, hint, prog) => side.push({ name, status: done ? (typeof done === 'string' ? done : 'Done!') : status, kind: done ? 'done' : 'active', where, hint, prog });
    if (f.capQuest || s.items.cap) add('Gus\'s lawn job', s.items.cap, G.sayable(G.capProgress()) + '/10 bonked', 'Lafayette', 'Bonk ten sacred numbers on the quad and Gus gives your hat back.', [G.capProgress(), 10]);
    if (f.dadBeaten && !f.engMet) side.push({ name: 'Pardee Hall', status: 'The door is open', kind: 'rumor', where: 'Lafayette', hint: 'The Department of EEENGLISH finally opened its doors. Someone inside keeps shouting.' });
    if (f.engMet) add('The EEENGLISH exam', f.engPerfect && 'Perfect!', f.engPassed ? 'Retake for diploma' : 'Not passed yet', 'Lafayette - Pardee Hall', f.engPassed ? 'Get all seven right without saying the sacred number.' : 'Professor Pembrook\'s exam: seven questions about things with "English" in the name.');
    if (f.chemMet) add('The Chem Final', f.chemPerfect && 'Perfect!', f.chemPassed ? 'Retake for a heart' : 'Not passed yet', 'Lafayette - Science Center', f.chemPassed ? 'Ace it without saying the sacred number for a heart container.' : 'Dr. Nataro is giving the final in the Science Center.');
    if (f.ticketQuest) {
      const left = s.items.tickets || 0;
      add('Doron\'s spare tickets', f.ticketsDone, left ? G.sayable(left) + ' left' : 'Tell Doron', 'Lafayette + Easton Fair', left ? 'Offer the tickets to people around campus and the fair. Most say no.' + (f.dadBeaten ? ' (They\'re for next week\'s show now.)' : '') : 'All given away! Go tell Doron.', [4 - left, 4]);
    }
    if (G.rocksFound()) add('Nate\'s rocks', G.rocksFound() >= G.ROCKS.length && 'All found!', G.sayable(G.rocksFound()) + '/' + G.ROCKS.length, 'Everywhere', 'Mine the Andover mines. Every other rock is a hidden secret. See the ROCKS page.', [G.rocksFound(), G.ROCKS.length]);
    // rumors: things going on around home that Nate hasn't looked into yet
    const leadHint = { Michelle: 'Mom is out in the garden. Something is going on with her books.', Dad: 'Dad is in his workshop (the garage). He needs something.', Lily: 'Take the trail north, past the bridge over Brady Brook.', Doron: 'Pick "The Andover mines" when you leave home.' };
    if (f.mikeyBeaten) for (const [who, , where, hint] of homeLeads()) side.push({ name: where, status: hint, kind: 'rumor', where: 'Home', hint: leadHint[who] });
    if (f.andoverLocked) add('The Andover mines', s.items.andoverKey && 'Key in hand!', f.shopOpen ? 'Mom sells a key' : 'Need a key', 'Home - Andover', s.items.andoverKey ? 'Pick "The Andover mines" when you leave home.' : f.shopOpen ? 'Mom\'s flower stand sells the gate key. It isn\'t cheap.' : 'The mines are on private land. Mom knows everybody at church.');
    if (f.roseRocks) add('Grandma Rose\'s funnel cake', f.roseTraded, s.items.funnelCake ? 'Bring it to her' : 'Order one', 'Easton Fair', s.items.funnelCake ? 'Grandma Rose is wandering the fair. She\'ll trade her eastonite.' : 'Funnel cake costs the sacred number, and Nate can\'t say it.');
    if (f.plantQuest) add('Anette\'s thirsty plants', f.plantsDone, f.plantsDone ? 'Done' : G.sayable(G.plantsWatered()) + '/5 watered', 'Chesapeake - the condo', G.plantsWatered() >= 5 ? 'All five are watered. Go tell Anette.' : 'Water Anette\'s five potted plants around the street with the Portable Bidet.', [G.plantsWatered(), 5]);
    if (f.hipHopMet) add('Dad\'s hip hop class', f.hipHopDone, G.sayable(f.hipHopRound || 0) + '/3 rounds', 'College Hill', 'It\'s REAL. Talk to Dad at the grocery store and copy his moves with the arrows.', [f.hipHopRound || 0, 3]);
    if (f.mobileBeaten && !f.rubyMet) side.push({ name: 'The rock doctor', status: 'Someone needs one', kind: 'rumor', where: 'CHKD - the ward', hint: 'The nurse on the ward says the girl behind the green door keeps asking for a "rock doctor."' });
    if (f.rubyMet) add('Ruby, the rock kid', f.rubyHeart, !f.rubyQuiz ? G.sayable(f.rubyQ || 0) + '/3 named' : 'Trade her a rock', 'CHKD - the ward', !f.rubyQuiz ? 'Ruby has three rocks with no names. Tell her what they are, rock doctor.' : 'Ruby will trade one of her two fairy stones for a rock she doesn\'t have yet, from somewhere she\'s never been.', !f.rubyQuiz ? [f.rubyQ || 0, 3] : null);
    if (s.party.includes('abe')) add('Abe\'s reach', G.abeReachCount() >= G.ABE_REACH_TOTAL && 'All found!', G.sayable(G.abeReachCount()) + '/' + G.sayable(G.ABE_REACH_TOTAL) + ' found', 'Anywhere', 'Abe is 6\'5". With him along, check things that are way up high (press Z under them): around Abe and Hannah\'s, at CHKD, the tall hedge up by Anette\'s... and maybe places you\'ve already been.', [G.abeReachCount(), G.ABE_REACH_TOTAL]);
    if (f.rodQuest || s.items.rod) add('The old fisherman', s.items.rod, G.sayable(Math.min(5, f.gullBonks || 0)) + '/5 gulls', 'The Bay - the island', 'Bonk gulls when they swoop down low. Five of them.', [Math.min(5, f.gullBonks || 0), 5]);
    if (f.fcAwake) add('Father Christmas', f.fcBeaten, 'The deep stope', 'Andover - the tunnels', 'A cave-in shook loose off the east stope of the Andover tunnels.');
    if (f.snackQuest) {
      const n = (s.items.candyCorn ? 1 : 0) + (s.items.doritos ? 1 : 0);
      add('Dad\'s snacks', f.snacksDone, n === 2 ? 'Bring them to Dad' : G.sayable(n) + '/2 snacks', 'Home', n === 2 ? 'Dad is in his workshop.' : 'Candy corn: Mom hides it somewhere. Doritos: follow the muddy tracks.', [n, 2]);
    }
    if (G.condoDone && G.condoDone()) {
      const nj = G.JAM_SONGS.filter((sg) => (s.jams || {})[sg.id]).length;
      if (!f.jamMet) side.push({ name: 'Abe\'s office', status: 'Abe wants to jam', kind: 'rumor', where: 'Chesapeake - the condo', hint: 'Things are quiet at the condo. Abe\'s little amp is upstairs, in his office.' });
      else add('Jamming with Abe', nj >= G.JAM_SONGS.length && 'All played!', G.sayable(nj) + '/' + G.sayable(G.JAM_SONGS.length) + ' songs', 'Chesapeake - Abe\'s office', 'Play along with Abe at the little amp in Abe\'s office, upstairs: three guitar songs and three drum songs.', [nj, G.JAM_SONGS.length]);
    }
    if (f.dadBeaten) {
      const FS = s.fights || {}, five = G.FIGHTERS.filter((F) => !F.secret), nf = five.filter((F) => FS[F.id]).length;
      if (!f.fightMet) side.push({ name: 'The locker room', status: 'Sounds like a fight in there', kind: 'rumor', where: 'Easton Fair - the Expo Hall', hint: 'The locker room door at the back of the Expo Hall is propped open now. Bring Doron.' });
      else if (nf < five.length) add('Doron\'s fight night', false, G.sayable(nf) + '/' + G.sayable(five.length) + ' beaten', 'Easton Fair - the Expo Hall', 'Doron takes on his favorite UFC fighters in the Expo Hall locker room. Beat Jon Jones for the Micro Mayhem title belt.', [nf, five.length]);
      else add('Doron\'s fight night', FS.nani && 'BMF!', 'A secret challenger is waiting', 'Easton Fair - the Expo Hall', 'Someone in a knit sweater is waiting in the Expo Hall locker room. Nani has some notes.');
    }
    if (f.mobileBeaten && s.party.includes('hannah')) {
      const N = s.nicu || {}, ns = ['shift1', 'shift2', 'shift3'].reduce((t, k) => t + ((N[k] && N[k].stars) || 0), 0);
      if (!f.nicuMet) side.push({ name: 'Charge Nurse Dot', status: 'Hannah is late!', kind: 'rumor', where: 'CHKD - the NICU', hint: 'Hannah\'s charge nurse is back on the floor in the NICU, and she\'s looking for Hannah.' });
      else add('Hannah\'s shift', ns >= 9 && 'Every star!', G.sayable(ns) + '/' + G.sayable(9) + ' stars', 'CHKD - the NICU', 'Talk to Charge Nurse Dot in the NICU with Hannah along, and run the NICU as Hannah. Three shifts, three stars each.', [ns, 9]);
    }
    if (G.homeDone() && !f.pipeBench) side.push({ name: 'Dad\'s workshop', status: 'Dad has something to show you', kind: 'rumor', where: 'Home', hint: 'Things are finally quiet at home. Dad wants you in his workshop.' });
    if (f.pipeBench) {
      const np = G.pipesMadeCount(), nt = G.tinsMadeCount(), all = G.PIPES.length + G.TOBACCOS.length;
      add('Dad\'s pipe bench', np + nt >= all && 'All made!', G.sayable(np) + '/' + G.sayable(G.PIPES.length) + ' pipes, ' + G.sayable(nt) + '/' + G.sayable(G.TOBACCOS.length) + ' tins', 'Home - the workshop', 'Talk to Dad in his workshop. Turn pipes on his lathe and blend tobacco from his jars.', [np + nt, all]);
    }
    if (f.jjMet || f.jjGig) add('Ice JJ Fish', f.jjBeaten && 'Booked!', f.jjGig ? 'Book him' : 'Wants a booking', 'Home - past the bridge', f.jjGig ? 'Survive his whole set and he\'ll play Dad\'s church.' : 'He won\'t stop singing until somebody books him. Who books singers?');
    if (f.booksQuest) {
      const clues = G.clueCount();
      add('Mom\'s missing books', f.shopOpen, s.items.books ? 'Bring them to Mom' : !f.cluesDone ? G.sayable(clues) + '/' + CLUES_NEEDED + ' clues' : !f.momReport ? 'Tell Mom' : !s.items.basementKey && !f.globBeaten ? 'Find Dad\'s keys' : 'The basement',
        'Home', s.items.books ? 'Mom is in the garden.' : !f.cluesDone ? 'Search the house for chewed pages and bite marks.' : !f.momReport ? 'Tell Mom what you found.' : !s.items.basementKey && !f.globBeaten ? 'Dad\'s keys are somewhere he eats lunch.' : 'Earplugs, the bait book, then the basement.', !f.cluesDone ? [clues, CLUES_NEEDED] : null);
    }
    // active first, then rumors, then the done ones
    const rank = { active: 0, rumor: 1, done: 2 };
    side.sort((a, b) => rank[a.kind] - rank[b.kind]);
    return { goal, chapter, side };
  };

  // How close to 100%: every item on the list, with rocks and photos counted one by one.
  G.completionPct = () => {
    const c = G.completion(), n = c.length;
    let done = 0;
    for (const [name, ok] of c) done += name === 'Every rock' ? G.rocksFound() / G.ROCKS.length : name === 'Every photo' ? G.photosFound() / G.PHOTOS.length : ok ? 1 : 0;
    return Math.floor((done / n) * 100);
  };

  // ================================================================ MUSIC (original tunes)
  // Recorded songs, played from a file instead of the tune below with the same name
  // (the tune is the fallback if the file can't load).
  G.SONG_FILES = {
    bookworm: 'assets/music/globglogabgalab.m4a', // the 8-bit Globglogabgalab, in the basement until he's beaten
    serenade: 'assets/music/golden-hour.m4a', // the 8-bit "Golden Hour", for Lily vs. Mikey at the end of the driveway
  };
  // (Father Christmas's theme speeds up as he gets angrier: fc2, fc3 are set below)
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
    // CHKD under Father Eggmas's spell: a slow music-box lullaby in a minor key (original)
    hospital: {
      bpm: 84,
      tracks: [
        { wave: 'triangle', vol: 0.09, notes: 'A5:2 E5:2 C5:2 | B4:2 E5:2 A4:2 | C5:2 B4:2 A4:2 | G#4:6 | A4:2 C5:2 E5:2 | F5:2 E5:2 D5:2 | C5:2 B4:2 G#4:2 | A4:6' },
        { wave: 'triangle', vol: 0.11, notes: 'A2:6 | E2:6 | F2:6 | E2:6 | A2:6 | D3:6 | E2:6 | A2:6' },
      ],
    },
    // Dad's hip hop class, after close at the grocery store: a boom-bap beat, a walking bass and
    // a few synth stabs (original)
    hiphop: {
      bpm: 92,
      tracks: [
        { wave: 'noise', vol: 0.09, notes: 'k:4 h:2 k:2 s:4 h:2 h:2 | k:2 h:2 k:2 k:2 s:4 h:2 k:2 | k:4 h:2 k:2 s:4 h:2 h:2 | k:2 h:2 k:2 k:2 s:2 s:2 s:2 h:2' },
        { wave: 'sawtooth', vol: 0.07, notes: 'C2:3 R:1 C2:2 R:2 D#2:2 F2:2 G2:4 | A#1:3 R:1 A#1:2 R:2 C2:2 D#2:2 C2:4 | C2:3 R:1 C2:2 R:2 D#2:2 F2:2 G2:4 | G2:2 F2:2 D#2:2 C2:2 A#1:4 C2:4' },
        { wave: 'square', vol: 0.04, notes: 'R:4 G4:1 R:1 G4:1 R:5 D#4:2 R:2 | R:4 F4:1 R:1 F4:1 R:5 D#4:2 R:2 | R:4 G4:1 R:1 G4:1 R:5 A#4:2 R:2 | C5:2 R:2 A#4:2 R:2 G4:4 R:4' },
      ],
    },
    // the roof of CHKD at night, looking out at the glow over the Number One Ditch: the title
    // theme, slow and quiet in a minor key, with a little high note falling now and then like
    // snow (original)
    roof: {
      bpm: 66,
      tracks: [
        { wave: 'triangle', vol: 0.08, notes: 'E4:4 A4:4 C5:6 B4:2 | A4:4 F4:4 E4:8 | F4:4 A4:4 D5:6 C5:2 | B4:12 R:4 | E4:4 A4:4 C5:6 E5:2 | F5:4 E5:4 C5:8 | D5:4 C5:4 B4:4 G#4:4 | A4:12 R:4' },
        { wave: 'triangle', vol: 0.12, notes: 'A2:16 | F2:16 | D2:16 | E2:16 | A2:16 | F2:16 | D2:8 E2:8 | A2:16' },
        { wave: 'sine', vol: 0.03, notes: 'E6:2 R:14 | C6:2 R:14 | A5:2 R:14 | B5:2 R:14 | E6:2 R:14 | F6:2 R:14 | D6:2 R:6 B5:2 R:6 | A5:2 R:14' },
      ],
    },
    // the finale (all original): the family, possessed (the home theme, in a minor key and
    // driving), Father Eggmas (the title theme, twisted into a minor key), and the family
    // turning it around (the title theme, heroic)
    possessed: {
      bpm: 150,
      tracks: [
        { wave: 'square', vol: 0.05, notes: 'A#4:4 D5:4 G5:6 F#5:2 | D#5:4 D5:4 A#4:8 | C5:4 D#5:4 A5:6 G5:2 | F#5:12 R:4 | A#4:4 D5:4 G5:6 A#5:2 | A5:4 G5:4 D#5:8 | C5:4 A#4:4 A4:4 D5:4 | G4:12 R:4' },
        { wave: 'sawtooth', vol: 0.055, notes: 'G2:2 G2:2 G3:2 G2:2 G2:2 G2:2 D3:2 G2:2 | D#2:2 D#2:2 D#3:2 D#2:2 D#2:2 D#2:2 A#2:2 D#2:2 | C2:2 C2:2 C3:2 C2:2 C2:2 C2:2 G2:2 C2:2 | D2:2 D2:2 D3:2 D2:2 D2:2 D2:2 F#2:2 A2:2 | G2:2 G2:2 G3:2 G2:2 G2:2 G2:2 D3:2 G2:2 | C2:2 C2:2 C3:2 C2:2 D#2:2 D#2:2 D#3:2 D#2:2 | C2:2 C2:2 D2:2 D2:2 D2:2 D2:2 D3:2 D2:2 | G2:2 D2:2 G2:2 A#2:2 G2:8' },
        { wave: 'noise', vol: 0.055, notes: 'k:4 s:4 k:2 k:2 s:4 | k:4 s:4 k:2 k:2 s:4 | k:4 s:4 k:2 k:2 s:4 | k:4 s:4 k:2 s:2 s:2 s:2 | k:4 s:4 k:2 k:2 s:4 | k:4 s:4 k:2 k:2 s:4 | k:4 s:4 k:2 k:2 s:4 | k:2 k:2 s:2 k:2 s:2 s:2 s:2 s:2' },
      ],
    },
    eggmas: {
      bpm: 176,
      tracks: [
        { wave: 'square', vol: 0.05, notes: 'G4:4 C5:4 D#5:6 D5:2 | C5:4 G#4:4 G4:8 | G#4:4 C5:4 F5:6 D#5:2 | D5:12 R:4 | G4:4 C5:4 D#5:6 G5:2 | G#5:4 G5:4 D#5:8 | F5:4 D#5:4 D5:4 B4:4 | C5:12 R:4' },
        { wave: 'sawtooth', vol: 0.06, notes: 'C2:2 C3:2 C2:2 C3:2 C2:2 C3:2 C2:2 C3:2 | G#1:2 G#2:2 G#1:2 G#2:2 G#1:2 G#2:2 G#1:2 G#2:2 | F1:2 F2:2 F1:2 F2:2 F1:2 F2:2 F1:2 F2:2 | G1:2 G2:2 G1:2 G2:2 G1:2 G2:2 B1:2 D2:2 | C2:2 C3:2 C2:2 C3:2 C2:2 C3:2 C2:2 C3:2 | G#1:2 G#2:2 G#1:2 G#2:2 G#1:2 G#2:2 G#1:2 G#2:2 | F1:2 F2:2 F1:2 F2:2 G1:2 G2:2 G1:2 G2:2 | C2:2 C3:2 C2:2 C3:2 C2:8' },
        { wave: 'noise', vol: 0.06, notes: 'k:2 h:2 s:2 h:2 k:2 k:2 s:2 h:2 | k:2 h:2 s:2 h:2 k:2 k:2 s:2 h:2 | k:2 h:2 s:2 h:2 k:2 k:2 s:2 h:2 | k:2 h:2 s:2 h:2 k:2 s:2 s:2 s:2 | k:2 h:2 s:2 h:2 k:2 k:2 s:2 h:2 | k:2 h:2 s:2 h:2 k:2 k:2 s:2 h:2 | k:2 h:2 s:2 h:2 k:2 k:2 s:2 h:2 | k:2 s:2 k:2 s:2 s:2 s:2 s:2 s:2' },
      ],
    },
    relay: {
      bpm: 164,
      tracks: [
        { wave: 'square', vol: 0.05, notes: 'G4:4 C5:4 E5:6 D5:2 | C5:4 A4:4 G4:8 | A4:4 C5:4 F5:6 E5:2 | D5:12 R:4 | G4:4 C5:4 E5:6 G5:2 | A5:4 G5:4 E5:8 | F5:4 E5:4 D5:4 B4:4 | C5:12 R:4' },
        { wave: 'triangle', vol: 0.12, notes: 'E4:8 G4:8 | E4:8 E4:8 | F4:8 A4:8 | G4:8 B4:8 | E4:8 G4:8 | F4:8 C5:8 | A4:8 G4:8 | E4:12 R:4' },
        { wave: 'sawtooth', vol: 0.05, notes: 'C2:2 C3:2 C2:2 C3:2 C2:2 C3:2 C2:2 C3:2 | A1:2 A2:2 A1:2 A2:2 A1:2 A2:2 A1:2 A2:2 | F1:2 F2:2 F1:2 F2:2 F1:2 F2:2 F1:2 F2:2 | G1:2 G2:2 G1:2 G2:2 G1:2 G2:2 G1:2 G2:2 | C2:2 C3:2 C2:2 C3:2 C2:2 C3:2 C2:2 C3:2 | F1:2 F2:2 F1:2 F2:2 F1:2 F2:2 F1:2 F2:2 | F1:2 F2:2 F1:2 F2:2 G1:2 G2:2 G1:2 G2:2 | C2:2 C3:2 C2:2 C3:2 C2:8' },
        { wave: 'noise', vol: 0.055, notes: 'k:2 h:2 s:2 h:2 k:2 k:2 s:2 h:2 | k:2 h:2 s:2 h:2 k:2 k:2 s:2 h:2 | k:2 h:2 s:2 h:2 k:2 k:2 s:2 h:2 | k:2 h:2 s:2 h:2 k:2 s:2 s:2 s:2 | k:2 h:2 s:2 h:2 k:2 k:2 s:2 h:2 | k:2 h:2 s:2 h:2 k:2 k:2 s:2 h:2 | k:2 h:2 s:2 h:2 k:2 k:2 s:2 h:2 | k:2 s:2 k:2 s:2 s:2 s:2 s:2 s:2' },
      ],
    },
    // MECHA-BABY: the lullaby, turned into a stomping robot march (original)
    mecha: {
      bpm: 152,
      tracks: [
        { wave: 'square', vol: 0.05, notes: 'A4:2 A4:2 E5:2 A4:2 G4:2 A4:2 C5:4 | B4:2 B4:2 E5:2 B4:2 A4:2 B4:2 D5:4 | A4:2 A4:2 E5:2 A4:2 G4:2 A4:2 C5:2 E5:2 | F5:4 E5:4 D5:4 B4:4' },
        { wave: 'sawtooth', vol: 0.055, notes: 'A2:2 A2:2 A3:2 A2:2 A2:2 A2:2 A3:2 A2:2 | E2:2 E2:2 E3:2 E2:2 E2:2 E2:2 E3:2 E2:2 | F2:2 F2:2 F3:2 F2:2 G2:2 G2:2 G3:2 G2:2 | E2:4 E3:4 E2:4 G#2:4' },
        { wave: 'noise', vol: 0.06, notes: 'k:2 h:2 s:2 h:2 k:2 k:2 s:2 h:2 | k:2 h:2 s:2 h:2 k:2 k:2 s:2 h:2 | k:2 h:2 s:2 h:2 k:2 k:2 s:2 h:2 | k:2 h:2 s:2 k:2 s:2 s:2 s:2 s:2' },
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
    // the basement: a slinky little minor-key waltz (original; Mom still hates it)
    bookworm: {
      bpm: 138,
      tracks: [
        { wave: 'square', vol: 0.05, notes: 'D4:3 F4:1 A4:4 G#4:2 A4:2 R:4 | C5:3 A4:1 F4:4 E4:4 R:4 | D4:3 F4:1 A4:4 A#4:2 A4:2 G4:4 | F4:2 E4:2 D4:8 R:4 | A#4:3 A4:1 G4:4 F4:2 G4:2 A4:4 | C5:2 A#4:2 A4:4 G4:8 | F4:2 G4:2 A4:2 F4:2 E4:2 C#4:2 E4:4 | D4:12 R:4' },
        { wave: 'triangle', vol: 0.15, notes: 'D3:4 A2:4 D3:4 A2:4 | F2:4 C3:4 F2:4 C3:4 | D3:4 A2:4 G2:4 A2:4 | D3:4 A2:4 D3:8 | A#2:4 F3:4 A#2:4 F3:4 | C3:4 G3:4 C3:4 E3:4 | A2:4 E3:4 A2:4 C#3:4 | D3:8 A2:8' },
        { wave: 'noise', vol: 0.04, notes: 'k:4 h:2 h:2 s:4 h:4 | k:4 h:2 h:2 s:4 h:4 | k:4 h:2 h:2 s:4 h:4 | k:4 h:2 h:2 s:4 h:4 | k:4 h:2 h:2 s:4 h:4 | k:4 h:2 h:2 s:4 h:4 | k:4 h:2 h:2 s:4 h:4 | k:4 h:2 h:2 s:2 s:2 s:4' },
      ],
    },
    // the Andover tunnels: slow minor arpeggios and water drips (original)
    mine: {
      bpm: 80,
      tracks: [
        { wave: 'square', vol: 0.025, notes: 'A3:2 C4:2 E4:2 C4:2 A3:2 C4:2 E4:2 C4:2 | F3:2 A3:2 C4:2 A3:2 F3:2 A3:2 C4:2 A3:2 | D3:2 F3:2 A3:2 F3:2 D3:2 F3:2 A3:2 F3:2 | E3:2 G#3:2 B3:2 G#3:2 E3:2 G#3:2 B3:2 R:2' },
        { wave: 'triangle', vol: 0.13, notes: 'A2:8 E3:8 | F2:8 C3:8 | D2:8 A2:8 | E2:8 E2:8' },
        { wave: 'noise', vol: 0.02, notes: 'h:2 R:14 | R:6 h:2 R:8 | R:16 | R:10 h:2 R:4' },
      ],
    },
    // the bridge-tunnel: a breezy tune in G, salt air and gulls (original)
    bay: {
      bpm: 104,
      tracks: [
        { wave: 'square', vol: 0.04, notes: 'G4:2 B4:2 D5:4 B4:2 D5:2 E5:4 | D5:4 B4:2 G4:2 A4:8 | A4:2 C5:2 E5:4 D5:2 C5:2 B4:4 | G4:4 A4:2 B4:2 G4:8' },
        { wave: 'triangle', vol: 0.14, notes: 'G2:4 D3:4 G2:4 D3:4 | D2:4 A2:4 D2:4 A2:4 | C3:4 G2:4 C3:4 G2:4 | G2:4 D3:4 G2:8' },
        { wave: 'noise', vol: 0.03, notes: 'k:4 h:4 s:4 h:4 | k:4 h:4 s:4 h:4 | k:4 h:4 s:4 h:4 | k:4 h:4 s:2 s:2 h:4' },
      ],
    },
    // under the shipping channel: a low hum and a slow, uneasy chime (original)
    tunnel: {
      bpm: 70,
      tracks: [
        { wave: 'triangle', vol: 0.14, notes: 'E2:16 | F2:16 | E2:16 | D#2:16' },
        { wave: 'sine', vol: 0.05, notes: 'R:8 B4:8 | R:8 C5:8 | R:8 B4:8 | R:8 A#4:8' },
        { wave: 'noise', vol: 0.012, notes: 'h:8 R:8 | h:8 R:8 | h:8 R:8 | h:8 h:4 R:4' },
      ],
    },
    // Tyler: fast surf rock for a shark tooth hunter, in E minor (original)
    tyler: {
      bpm: 160,
      tracks: [
        { wave: 'square', vol: 0.045, notes: 'E4:2 G4:2 A4:2 B4:2 D5:2 B4:2 A4:2 G4:2 | E4:2 G4:2 A4:2 B4:4 A4:2 G4:2 E4:2 | A4:2 C5:2 D5:2 E5:2 D5:2 C5:2 A4:2 G4:2 | B4:4 A4:2 G4:2 F#4:4 E4:4' },
        { wave: 'triangle', vol: 0.15, notes: 'E2:2 E3:2 E2:2 E3:2 E2:2 E3:2 E2:2 E3:2 | E2:2 E3:2 E2:2 E3:2 G2:2 G3:2 G2:2 G3:2 | A2:2 A3:2 A2:2 A3:2 C3:2 C4:2 C3:2 C4:2 | B2:2 B3:2 B2:2 B3:2 B2:2 B3:2 B2:2 B3:2' },
        { wave: 'noise', vol: 0.05, notes: 'k:2 h:2 s:2 h:2 k:2 h:2 s:2 h:2 | k:2 h:2 s:2 h:2 k:2 h:2 s:2 h:2 | k:2 h:2 s:2 h:2 k:2 h:2 s:2 h:2 | k:2 h:2 s:2 h:2 k:2 s:2 s:2 s:2' },
      ],
    },
    // Father Christmas: a music box gone wrong, in D minor, with sleigh bells (original)
    fc: {
      bpm: 132,
      tracks: [
        { wave: 'sine', vol: 0.1, notes: 'D5:4 F5:2 E5:2 D5:4 | A4:4 A#4:4 A4:4 | G4:4 A#4:2 A4:2 G4:4 | F4:4 E4:4 C#5:4 | D5:4 F5:2 G5:2 A5:4 | A#5:4 A5:4 G5:4 | F5:2 E5:2 D5:2 C#5:2 E5:4 | D5:8 R:4' },
        { wave: 'triangle', vol: 0.15, notes: 'D3:4 A3:4 A3:4 | D3:4 A3:4 A3:4 | G2:4 D3:4 D3:4 | A2:4 E3:4 E3:4 | D3:4 A3:4 A3:4 | G2:4 D3:4 D3:4 | A2:4 E3:4 E3:4 | D3:4 A2:4 D2:4' },
        { wave: 'square', vol: 0.018, notes: 'R:4 F4:4 F4:4 | R:4 F4:4 F4:4 | R:4 A#3:4 A#3:4 | R:4 G4:4 G4:4 | R:4 F4:4 F4:4 | R:4 A#3:4 A#3:4 | R:4 G4:4 G4:4 | R:4 F4:4 R:4' },
        { wave: 'noise', vol: 0.025, notes: 'k:2 h:2 h:2 h:2 h:2 h:2 | k:2 h:2 h:2 h:2 h:2 h:2 | k:2 h:2 h:2 h:2 h:2 h:2 | k:2 h:2 h:2 h:2 s:2 h:2 | k:2 h:2 h:2 h:2 h:2 h:2 | k:2 h:2 h:2 h:2 h:2 h:2 | k:2 h:2 h:2 h:2 h:2 h:2 | k:2 h:2 s:2 h:2 s:2 s:2' },
      ],
    },
    // the frozen pond: a slow, soulful ballad in A minor (original)
    icejj: {
      bpm: 72,
      tracks: [
        { wave: 'sine', vol: 0.11, notes: 'E5:4 D5:2 C5:2 A4:8 | C5:4 D5:2 E5:2 G5:6 E5:2 | D5:4 C5:2 A4:2 G4:8 | A4:4 C5:4 D5:8 | E5:4 G5:2 A5:2 G5:6 E5:2 | D5:4 E5:2 D5:2 C5:8 | A4:4 C5:2 D5:2 E5:4 D5:2 C5:2 | A4:12 R:4' },
        { wave: 'square', vol: 0.022, notes: 'A3:4 C4:4 E4:4 C4:4 | F3:4 A3:4 C4:4 A3:4 | C4:4 E4:4 G4:4 E4:4 | G3:4 B3:4 D4:4 B3:4 | A3:4 C4:4 E4:4 C4:4 | F3:4 A3:4 C4:4 A3:4 | D3:4 F3:4 A3:4 F3:4 | E3:4 G#3:4 B3:4 G#3:4' },
        { wave: 'triangle', vol: 0.15, notes: 'A2:8 E3:8 | F2:8 C3:8 | C3:8 G2:8 | G2:8 D3:8 | A2:8 E3:8 | F2:8 C3:8 | D3:8 A2:8 | E2:8 E3:8' },
        { wave: 'noise', vol: 0.03, notes: 'k:4 h:4 s:4 h:4 | k:4 h:4 s:4 h:4 | k:4 h:4 s:4 h:4 | k:4 h:4 s:4 h:4 | k:4 h:4 s:4 h:4 | k:4 h:4 s:4 h:4 | k:4 h:4 s:4 h:4 | k:4 h:4 s:4 s:4' },
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
    yield G.banner('THE SACRED NUMBER WAS SPOKEN', 'Slips so far: ' + G.sayable(G.state.stats.slips), 150);
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
    yield G.text('Abe', 'hannah and i are right here in chesapeake. we got eyes on the ditch');
    yield G.text('Hannah', 'from the couch');
    yield G.text('Abe', 'nate get down here. not fighting a plush humpty dumpty without you');
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
  // A copy of the campus paper, left on a desk in the Science Center. A true story from the user's
  // dad: Ben wore a shirt that said "SEXY AS HELL" to the ball and ended up in the paper.
  let benPaperC = null;
  const benPaperPage = () => {
    if (benPaperC) return benPaperC;
    const c = G.canvas(G.W, G.H), x = c.getContext('2d'), INK = '#2a2420', SOFT = '#6a6258';
    x.fillStyle = '#ece6d6'; x.fillRect(0, 0, G.W, G.H);
    x.fillStyle = '#d8d0bc'; x.fillRect(0, 0, G.W, 2); x.fillRect(0, G.H - 2, G.W, 2);
    // the masthead
    const mw = FT().bigWidth('THE LAFAYETTE', 2);
    FT().drawBig(x, 'THE LAFAYETTE', Math.round((G.W - mw) / 2), 6, 2, INK, '#c8c0ac');
    x.fillStyle = INK; x.fillRect(8, 27, G.W - 16, 1); x.fillRect(8, 29, G.W - 16, 1);
    FT().draw(x, 'CAMPUS LIFE', 8, 32, SOFT);
    // the headline
    FT().draw(x, 'ONE SHIRT STOLE THE BALL', 8, 43, INK);
    x.fillRect(8, 53, G.W - 16, 1);
    // the photo: Ben at the ball, under the string lights, in the shirt
    x.fillStyle = INK; x.fillRect(8, 58, 78, 84);
    x.fillStyle = '#2a2a48'; x.fillRect(9, 59, 76, 82);
    for (let k = 0; k < 9; k++) { x.fillStyle = k % 2 ? '#f8e0a0' : '#f8c870'; x.fillRect(12 + k * 8, 62 + (k % 3), 2, 2); }
    x.fillStyle = '#3a3a5a'; x.fillRect(9, 128, 76, 13);
    const ben = G.art.person(Object.assign({}, G.CAST.ben, { shirt: '#f4f4f0', neck: null, headphones: null })).down[0];
    x.save(); x.beginPath(); x.rect(9, 59, 76, 82); x.clip();
    x.imageSmoothingEnabled = false;
    x.drawImage(ben, 15, 63, ben.width * 4, ben.height * 4);
    ['SEXY', 'AS', 'HELL'].forEach((w, k) => FT().draw(x, w, 47 - Math.round(FT().width(w) / 2), 111 + k * 8, '#c82838'));
    x.restore();
    FT().draw(x, 'Ben, at the ball.', 8, 145, SOFT);
    // the story
    const story = ['At the ball this year, one shirt stole the show.', 'Its message, in big letters: SEXY AS HELL.', 'Ben wore it all night. And he wore it well.'];
    let y = 59;
    for (const para of story) { for (const l of FT().wrap(para, 140)) { FT().draw(x, l, 94, y, INK); y += 9; } y += 4; }
    return (benPaperC = c);
  };
  // Bismarck, the future lawyer: his law school prep book, left on a desk in Pardee Hall
  S.lawBook = function* () {
    yield G.say(null, 'A giant LSAT prep book. Every page is highlighted, color-coded and tabbed.');
    yield G.say(null, 'Inside the cover, in very neat handwriting: "Property of Bismarck. Future lawyer."');
    yield G.say('Nate', 'He\'s going to be a great lawyer. He could talk anybody into anything.');
  };
  S.benPaper = function* () {
    const f = flags();
    yield G.say(null, 'Someone left a copy of the campus paper on this desk.');
    yield G.noteView([benPaperPage()], 'Z: put it down');
    if (!f.benPaper) {
      f.benPaper = true;
      yield G.say('Nate', 'That\'s BEN! He made the paper!');
      yield G.say('Nate', '...In THAT shirt.');
    } else yield G.say('Nate', 'Still the best thing they\'ve ever printed.');
  };
  S.ben = function* () {
    const f = flags();
    if (f.phDone) {
      yield G.say('Ben', 'Rain is acidic. Life is acidic. Go save your ditch, man.');
      return;
    }
    yield G.say('Ben', 'Nate! Perfect timing. Quick chem question for you.');
    let c;
    do {
      c = yield G.ask('Ben', 'What is the pH of rainwater?', ['7', 'Why do you ask?']);
      if (c === 1) yield G.say('Ben', 'No reason. Totally no reason. Nobody paid me to ask you this.');
    } while (c === 1);
    yield G.say('Ben', 'Okay, sure. But what if it was... {y}slightly acidic{/}?');
    c = yield G.ask('Nate', 'Slightly acidic would be...', ['6', '5.6', 'Nice try.']);
    if (c === 0) {
      yield G.say('Nate', '6.');
      yield* slip();
      yield G.say('Nate', '...!!!');
      yield G.say('Nate', 'THAT\'S UNFAIR! I think about pH often!');
      yield G.say('Ben', 'Abe said you\'d say exactly that. He paid me ten shark teeth.');
      yield G.say('Ben', 'Here, you can have them. I feel kind of bad.');
    } else if (c === 1) {
      yield G.say('Nate', '5.6. Clean rain absorbs CO2 and makes carbonic acid. Obviously.');
      yield G.say('Ben', '...Wow. You really do think about pH often.');
      yield G.say('Nate', 'I do.');
      yield G.say('Ben', 'Abe bet me you\'d fall for it. Here, take the teeth he paid me.');
    } else {
      yield G.say('Ben', 'Abe said you\'d fall for it...');
      yield G.say('Nate', 'Tell Abe I am NOT gullible.');
      yield G.say('Ben', 'He said you\'d say that too. Here, take these. Don\'t tell him.');
    }
    f.phDone = true;
    G.audio.sfx('tooth');
    G.play.addTeeth(10);
    yield G.say(null, 'Got {y}10 shark teeth{/}!');
  };

  S.prof = function* () {
    const f = flags();
    if (f.profTalk) { yield* S.profQuiz(); return; }
    yield G.say('Prof. Sunderlin', 'Nate! I hear a plush egg is after the Number One Ditch.');
    yield G.say('Prof. Sunderlin', 'Tragic. Coastal plain ditches are fascinating. Flat. Wet. Extremely ditchy.');
    yield G.say('Prof. Sunderlin', 'My advice: when in doubt, hit it with your rock hammer.');
    yield G.say('Prof. Sunderlin', 'Rocks, mostly. But those walking {r}sacred numbers{/} on the lawn seem to qualify.');
    f.profTalk = true;
  };

  S.maya = function* () {
    yield G.say('Maya', 'My cousin in Virginia goes shark tooth hunting every weekend.');
    yield G.say('Maya', 'She says there\'s a guy on the beach named {c}Tyler{/} who screams about mosasaurs.');
    yield G.say('Maya', 'Apparently he\'s... VERY intense.');
  };

  S.bismarck = function* () {
    flags().bismarckMet = true;
    yield G.say('Bismarck', 'Did you see Pardee Hall? It\'s the Department of {y}EEENGLISH{/} now.');
    yield G.say('Bismarck', 'Some guy in a cream blazer keeps asking everyone if they speak it.');
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

  // Finals week: no leaving campus for College Hill until the Chem Final is done.
  S.campusSafety = function* (walkedUp) {
    const f = flags(), p = P();
    if (walkedUp) p.dir = 'left';
    yield G.say('Campus Safety', 'Whoa there. It\'s finals week. Nobody leaves campus until their exams are done.');
    if (f.chemMet) yield G.say('Nate', 'I still have Dr. Nataro\'s chem final...');
    else yield G.say('Nate', '...What exams?');
    yield G.say('Campus Safety', 'Chemistry final. Science Center. Pass it, and College Hill is all yours.');
    if (walkedUp) yield G.walkTo(p, p.x + 16, p.y, 1.2);
  };
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
    yield G.say('Gus', 'Ten sacred numbers! My lawn is saved. A deal\'s a deal. Here\'s your brown hat.');
    // it is a brown hat. Nate disagrees.
    yield G.say('Nate', 'Green.');
    yield G.say('Gus', '...What?');
    yield G.say('Nate', 'It\'s a GREEN hat, Gus.');
    yield G.say('Gus', 'Son, that hat is brown. I have been looking at it all morning.');
    yield G.say('Nate', 'It\'s green. It has always been green.');
    yield G.say('Gus', '...Just take your hat.');
    s.items.cap = true;
    yield G.itemGet(G.spr.cap, 'You got your {y}Hat{/} back! Corduroy. Distinguished. Green, according to Nate.');
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
      yield G.say('Dr. Nataro', 'My star student! Go blow something up. Responsibly.');
      return;
    }
    if (!f.chemMet) {
      f.chemMet = true;
      yield G.say('Dr. Nataro', 'Nate! You\'re late for the chemistry final.');
      yield G.say('Nate', 'Final? I have a ditch to save!');
      yield G.say('Dr. Nataro', 'Five questions. Answer carefully.');
      yield G.say('Nate', 'How hard can it be?');
    } else {
      yield G.say('Dr. Nataro', 'Back for a retake? Same five questions.');
    }
    const ready = yield G.ask('Dr. Nataro', 'Ready to take the final?', ['Ready.', 'Not yet.']);
    if (ready !== 0) { yield G.say('Dr. Nataro', 'Come back when you\'re ready. Study your hexagons.'); return; }

    let score = 0, slips = 0;
    for (let i = 0; i < CHEM_FINAL.length; i++) {
      const Q = CHEM_FINAL[i];
      if (Q.hard) yield G.say('Dr. Nataro', 'And now... the final question. Nobody has ever gotten this one right.');
      const a = yield G.ask('Dr. Nataro', 'Question ' + (i + 1) + ': ' + Q.q, Q.opts);
      if (a === Q.opts.indexOf('6')) {
        slips++;
        yield G.say('Nate', '6.');
        yield* slip();
        if (Q.hard) {
          yield G.say('Dr. Nataro', 'Incorrect. AND you said the number. ' + Q.note);
        } else {
          score++;
          yield G.say('Dr. Nataro', '...Correct. Why are you crying?');
        }
      } else if (a === Q.answer) {
        score++;
        if (Q.hard) yield G.say('Dr. Nataro', '...Correct?! Nobody has EVER gotten that right!');
        else yield G.say('Dr. Nataro', ['Correct!', 'Correct. Interesting phrasing.', 'Correct... I suppose.'][i % 3]);
      } else {
        yield G.say('Dr. Nataro', 'Incorrect. ' + Q.note);
        if (Q.hard && a === Q.trap) {
          yield G.say('Nate', '...I just assumed it was the same as the others.');
          yield G.say('Dr. Nataro', 'Never assume. That\'s the first rule of chemistry.');
        }
      }
    }

    yield G.say('Dr. Nataro', 'Final score: ' + G.sayable(score) + ' out of 5.');
    if (score < 3) {
      yield G.say('Dr. Nataro', 'You need 3 to pass. Retake it whenever you\'re ready.');
      return;
    }
    if (!f.chemPassed) {
      f.chemPassed = true;
      G.play.addTeeth(30);
      G.audio.sfx('tooth');
      yield G.say('Dr. Nataro', 'You passed! Here, {y}30 shark teeth{/}. Don\'t ask why I have them.');
    }
    if (score === 5 && slips === 0) {
      f.chemPerfect = true;
      s.maxHp += 2;
      s.hp = s.maxHp;
      yield G.say('Dr. Nataro', 'A perfect score, and you never said the number once. That deserves extra credit.');
      yield G.itemGet(G.spr.heartBig, 'Extra credit! You got a {r}Heart Container{/}! Max hearts +1.');
    } else if (score === 5) {
      yield G.say('Dr. Nataro', 'A perfect score! But you said the sacred number. Retake it without saying it for {y}extra credit{/}.');
    } else {
      yield G.say('Dr. Nataro', 'Get a perfect score without saying the sacred number for {y}extra credit{/}.');
    }
  };

  // ================================================================ PARDEE HALL: THE EEENGLISH EXAM
  // After El EEENGLISH's main event, the Department of EEENGLISH opens its doors.
  // Professor Pembrook saw the match and rewrote the whole department around
  // things with "English" in the name. Seven questions, and two of them are
  // traps: say the sacred number (or a number with it in) and it's a slip.
  const ENG_EXAM = [
    { q: 'In pool, what does it mean to put "English" on the ball?', opts: ['Spin', 'A British accent', 'A tiny top hat'], answer: 0,
      note: 'English is spin. You hit the cue ball off-center and it curves.' },
    { q: 'Where was the English muffin invented?', opts: ['England', 'New York City', 'A muffin factory in Wales'], answer: 1,
      note: 'New York City, 1880. An English baker made them there. The English had never heard of them.' },
    { q: 'What is an English horn?', opts: ['A brass horn from England', 'A woodwind', 'A car horn that apologizes'], answer: 1,
      note: 'It\'s a woodwind. A big oboe, really. It is neither English NOR a horn. Isn\'t that delicious?' },
    { q: 'How many fluid ounces are in an English pint?', opts: ['Sixteen', 'Twenty', 'Twelve'], answer: 1, slip: 0, slipSay: 'Sixteen.',
      note: 'An English pint is twenty ounces. Sixteen is the AMERICAN pint. Small. Timid. Disappointing.' },
    { q: 'A full English breakfast. Which of these is on the plate?', opts: ['Waffles', 'Baked beans', 'Candy corn'], answer: 1,
      note: 'Baked beans. Hot, from the can. NOT heated in the can, in a fire. Somebody in your family knows why.' },
    { q: 'In English cricket, how many balls are bowled in one over?', opts: ['Six', 'Four', 'Five plus one'], answer: 2, slip: 0, slipSay: 'Six.', slipRight: true,
      note: 'An over is... that many balls. You know the number. Everybody knows the number.' },
    { q: 'And finally. Do you speak EEENGLISH?', opts: ['Yes', 'No', 'EEENGLISH'], answer: 2,
      note: 'The answer is always EEENGLISH.' },
  ];
  S.englishExam = function* () {
    const f = flags(), s = G.state;
    if (f.engPerfect) {
      yield G.say('Professor Pembrook', 'DO YOU SPEAK EEENGLISH?');
      yield G.say('Nate', 'EEENGLISH.');
      yield G.say('Professor Pembrook', '...Beautiful. Every time.');
      return;
    }
    if (!f.engMet) {
      f.engMet = true;
      yield G.say('Professor Pembrook', 'DO YOU SPEAK EEENGLISH?!');
      yield G.say('Nate', '...I speak English.');
      yield G.say('Professor Pembrook', 'Not ENGLISH. EEENGLISH. Three Es. Feel them.');
      yield G.say('Professor Pembrook', 'I saw El EEENGLISH at Micro Mayhem. The dropkicks. The letters. The QUESTION. It changed my life.');
      yield G.say('Nate', 'That was my dad.');
      yield G.say('Professor Pembrook', 'Your FATHER is El EEENGLISH?! Then the EEENGLISH is in your blood!');
      yield G.say('Professor Pembrook', 'I\'ve rewritten the entire department. Every class is now about things with "English" in the name. Muffins. Channels. Horns.');
      yield G.say('Professor Pembrook', 'The final exam has seven questions. Pass it, and you may say you speak EEENGLISH.');
    } else {
      yield G.say('Professor Pembrook', 'Back for a retake? Excellent. The EEENGLISH waits for no one.');
    }
    const ready = yield G.ask('Professor Pembrook', 'Are you ready for the EEENGLISH exam?', ['Ready.', 'Not yet.']);
    if (ready !== 0) { yield G.say('Professor Pembrook', 'Go. Study. Eat a muffin. An ENGLISH one.'); return; }

    let score = 0, slips = 0;
    for (let i = 0; i < ENG_EXAM.length; i++) {
      const Q = ENG_EXAM[i];
      const a = yield G.ask('Professor Pembrook', 'Question ' + (i + 1) + ': ' + Q.q, Q.opts);
      if (Q.slip !== undefined && a === Q.slip) {
        // a trap: Nate says the number out loud
        slips++;
        yield G.say('Nate', Q.slipSay);
        if (Q.slipSay !== 'Six.') yield G.say('Nate', '...SIX-teen. Oh no.');
        yield* slip();
        if (Q.slipRight) { score++; yield G.say('Professor Pembrook', '...Correct. But you didn\'t have to SHOUT it.'); }
        else yield G.say('Professor Pembrook', 'Incorrect! ' + Q.note);
      } else if (a === Q.answer) {
        score++;
        if (i === ENG_EXAM.length - 1) yield G.say('Professor Pembrook', 'YES. YES! That is the only answer!');
        else if (Q.slip !== undefined && Q.slipRight) yield G.say('Professor Pembrook', 'Correct... I suppose. Interesting phrasing.');
        else yield G.say('Professor Pembrook', ['Correct! ' + Q.note, 'Correct. ' + Q.note, 'Splendid! ' + Q.note][i % 3]);
      } else {
        yield G.say('Professor Pembrook', 'Incorrect! ' + Q.note);
      }
    }

    yield G.say('Professor Pembrook', 'Final score: ' + G.sayable(score) + ' out of ' + ENG_EXAM.length + '.');
    if (score < 5) { yield G.say('Professor Pembrook', 'You need five to pass. The EEENGLISH is not strong in you yet. Retake it anytime.'); return; }
    if (!f.engPassed) {
      f.engPassed = true;
      G.play.addTeeth(30);
      G.audio.sfx('tooth');
      yield G.say('Professor Pembrook', 'You PASSED! Here: {y}30 shark teeth{/}. The department pays in teeth now. Don\'t ask.');
    }
    if (score === ENG_EXAM.length && slips === 0) {
      f.engPerfect = true;
      yield G.say('Professor Pembrook', 'A PERFECT score. You truly speak EEENGLISH.');
      yield G.itemGet(G.spr.diploma, 'You got a {y}Diploma in EEENGLISH{/}!');
      yield G.say('Professor Pembrook', 'Tell your father. Tell EVERYONE.');
    } else if (score === ENG_EXAM.length) {
      yield G.say('Professor Pembrook', 'Seven out of seven! ...But you said a certain number, didn\'t you. I heard it. Everyone heard it.');
      yield G.say('Professor Pembrook', 'Retake it without saying the number for your {y}diploma{/}.');
    } else {
      yield G.say('Professor Pembrook', 'Get all seven right, and don\'t say anything... unfortunate, and the {y}diploma{/} is yours.');
    }
  };

  S.brooks = function* () {
    const f = flags(), w = G.play.world;
    f.brooksMet = true;
    yield G.say('Brooks', 'I heard nobody has EVER gotten the last question on this final right.');
    // his voice is so high that a beaker on the lab bench gives out (every time; Nate notices once)
    G.audio.sfx('glass');
    w.burst(2 * 16 + 8, 2 * 16 + 4, ['#e8f4fc', '#a8d8f0', '#ffffff'], 12, { speed: 1.4, up: 1, g: 0.12, life: 24, size: 1 });
    w.pop(2 * 16 + 8, 3 * 16 + 4, 'CRACK!', '#a8d8f0');
    G.play.shake(4, 1);
    yield G.wait(24);
    if (!f.brooksCrack) {
      f.brooksCrack = true;
      yield G.say(null, 'A beaker on the lab bench just cracked clean in half.');
      yield G.say('Nate', '...Brooks. Was that your VOICE?');
    }
    yield G.say('Brooks', 'Also, why are there fire extinguishers on every single wall in here?');
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
    // first, the camera swings over to the nearest one so it's in plain view (they hold still
    // during cutscenes): halfway to Nate across, with its feet just above the text box, so Nate
    // stays in the shot too when it's close. Near the map's bottom edge the camera can't go far
    // enough, so the text box moves to the top instead of covering it.
    const p = P(), six = G.play.world.ents.filter((e) => e instanceof G.Six && !e.dead)
      .sort((a, b) => Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y))[0];
    let top = false;
    if (six) {
      yield G.camFocus(Math.abs(six.x - p.x) < 200 ? (six.x + p.x) / 2 : six.x, six.y - 12, 40);
      top = six.y - G.play.cam.y > 98;
    }
    yield G.say('Nate', 'Wait... are those...', { top });
    yield G.say('Nate', 'Walking {r}sacred numbers{/}?! Father Eggmas must have sent them!', { top });
    yield G.say('Nate', 'I won\'t say their name. I\'ll just hit them with a hammer.', { top });
    if (six) yield G.camFocus(null, null, 20);
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
    'Ben': { accept: true, lines: [['', 'Is this another one of Abe\'s tricks?'], ['n', 'No. It\'s one of Doron\'s.'], ['', '...Fine. I\'ll go.']] },
    'Attendant': { lines: [['', 'I\'m working, kid. Also, no.']] },
    'Pyro Pete': { lines: [['', 'Kid, I\'m literally running the pyro.']] },
    'Big Earl': { lines: [['', 'Wrestling\'s fake.'], ['n', 'The pyro is real.'], ['', 'Still no.']] },
    'Prof. Sunderlin': { lines: [['', 'I\'d rather watch sediment settle. And I do. Often.']] },
    'Prof. Carley': { lines: [['', 'I would, but I\'m buried in New Zealand trip paperwork.'], ['', 'Have you sent in your passport info yet, Nate?']] },
    'Maya': { lines: [['', 'I have a thing tonight.'], ['', '...The thing is not going to wrestling.']] },
    'Bismarck': { lines: [['', 'Is that the show with the guy who yells about English? Hard pass.']] },
    'Vendor': { lines: [['', 'And leave my Doosh unattended? Never.']] },
    'Dr. Nataro': { lines: [['', 'I have 200 finals to grade. Nobody got the last question right. Again.']] },
    'Brooks': { lines: [['', 'I\'m literally in the middle of an exam.']] },
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
    if (!f.ticketQuest || f.ticketsGiven || !(s.items.tickets > 0)) return null;
    const r = TICKET_REACTIONS[npc.name];
    const key = 'ticket_' + npc.name;
    if (!r || f[key]) return null;
    return (function* () {
      f[key] = r.accept ? 'yes' : 'no';
      yield G.say('Nate', f.dadBeaten ? 'Hey! Want a free ticket to {y}Micro Mayhem Wrestling{/}? Next week\'s show.' : 'Hey! Want a free ticket to {y}Micro Mayhem Wrestling{/}?');
      for (const [who, line] of r.lines) yield G.say(who === 'n' ? 'Nate' : npc.name, line);
      if (!r.accept) return;
      s.items.tickets--;
      G.audio.sfx('select');
      if (s.items.tickets > 0) {
        yield G.say(null, 'Ticket given! {y}' + G.sayable(s.items.tickets) + '{/} left.');
      } else {
        f.ticketsGiven = true;
        yield G.say(null, f.dadBeaten ? 'That was the last ticket! Doron is going to lose his mind.' : 'That was the last ticket! Go tell {y}Doron{/}.');
      }
    })();
  };

  // all four given away after the show (Doron's not at the fair anymore): he hears about it
  S.ticketsText = function* () {
    const f = flags(), say = G.with('doron') ? G.say : G.text;
    if (f.ticketsDone) return;
    yield G.wait(20);
    if (!G.with('doron')) G.audio.sfx('buzz');
    yield say('Doron', G.with('doron') ? 'Wait. You gave away ALL my tickets? People are actually COMING?!' : 'wait. you gave away ALL my tickets?? people are COMING?');
    yield say('Doron', G.with('doron') ? 'Best day of my life. I\'m not crying. It\'s the pyro smoke.' : 'best day of my life. not crying. its the pyro smoke');
    f.ticketsDone = true;
    G.play.addTeeth(30);
    G.audio.sfx('tooth');
    yield G.say(null, 'Doron sends {y}30 shark teeth{/}. "For your trouble. And for being my brother."');
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
    const f = flags();
    if (G.state.items.hammer && !f.roseTraded && (!f.roseRocks || G.state.items.funnelCake)) { yield* S.roseTrade(); return; }
    if (f['ticket_Grandma Rose'] === 'yes') yield G.say('Grandma Rose', 'Thank you for the ticket, dear. I\'ll be ringside!');
    else if (f.roseTraded) yield G.say('Grandma Rose', 'Best funnel cake I\'ve had in years. Take care of that eastonite, dear.');
    else yield G.say('Grandma Rose', 'I come to the fair every year for the funnel cake. Six teeth! Can you believe it?');
    if (f.roseRocks && !f.roseTraded) yield* S.roseTrade();
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
      Ben: 'Okay. This is actually incredible.',
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

  // a boss leaves a little stash of shark teeth behind
  S.bossStash = function* (n, text) {
    G.play.addTeeth(n);
    G.audio.sfx('tooth');
    yield G.itemGet(G.spr.toothGold, text);
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
    yield* S.bossStash(40, 'The promoter pays the winner of the main event: {y}40 shark teeth{/}.');
    yield G.say('Doron', 'Okay, Nate. A deal\'s a deal. Let\'s go move your boulder.');
    const s = G.state;
    if (!s.party.includes('doron')) s.party.push('doron');
    s.follower = 'doron';
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

  // The Shopping Cart (Dad's signature move, taught at his hip hop class): anything nearby has to
  // stop and dance for 4 seconds (bosses don't). Anybody else nearby dances too. So does Nate.
  S.signalCart = function () {
    const p = P(), w = G.play.world;
    w.fx.push({ x: p.x, y: p.y - 6, vx: 0, vy: 0, circle: true, r: PEACE_RADIUS + 10, max: 24, life: 24, color: '#f878d8' });
    w.pop(p.x, p.y - 34, '~ THE SHOPPING CART ~', '#f878d8');
    for (const e of w.ents) {
      if (e.dead || e.dancing || e.boss || Math.hypot(e.x - p.x, e.y - p.y) > PEACE_RADIUS + 16) continue;
      if (e.enemy) { e.calm = Math.max(e.calm || 0, 240); w.add(new G.DanceNotes(e, 240)); }
      else if (e instanceof G.NPC || e instanceof G.Follower) w.add(new G.DanceNotes(e, 120));
    }
    w.add(new G.DanceNotes(p, 60));
  };

  // I Pray to Jesus (Ice JJ Fish's song, taught by him): an ice beam straight out
  // the way Nate is facing. It stops at walls but carries over water. Anything it
  // touches freezes solid for 5 seconds (and can still be bonked); aimed at the
  // brook pool at home, the water freezes over.
  const BEAM_LEN = 128, BEAM_W = 12;
  S.signalIcy = function () {
    const p = P(), w = G.play.world, [dx, dy] = G.DIRS[p.dir];
    const x0 = p.x + dx * 8, y0 = p.y - 8 + dy * 2;
    let len = 0;
    while (len < BEAM_LEN) {
      const tx = Math.floor((x0 + dx * (len + 4)) / 16), ty = Math.floor((p.y - 4 + dy * (len + 4)) / 16);
      const d = G.TILE_DEFS[w.tileAt(tx, ty)];
      if (w.tileSolid(tx, ty) && !(d && (d.k === 'water' || d.k === 'bay'))) break;
      len += 4;
    }
    const x1 = x0 + dx * len, y1 = y0 + dy * len;
    const r = dx ? [Math.min(x0, x1), y0 - 8, Math.max(x0, x1), y0 + 10] : [x0 - 7, Math.min(y0, y1) - 6, x0 + 7, Math.max(y0, y1) + 8];
    w.fx.push({ beam: true, x0, y0, x1, y1, w: BEAM_W, life: 28, max: 28, color: '#ffffff', glow: '#a8e0ff', x: x0, y: y0, vx: 0, vy: 0 });
    for (let i = 0; i < 16; i++) {
      const k = Math.random();
      w.fx.push({ x: x0 + (x1 - x0) * k + (Math.random() * 2 - 1) * (dy ? 5 : 1), y: y0 + (y1 - y0) * k + (Math.random() * 2 - 1) * (dx ? 5 : 1), vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, life: 18 + Math.random() * 16, color: i % 3 ? '#d8f4ff' : '#ffffff', size: 1 });
    }
    G.audio.sfx('dash');
    w.pop(p.x, p.y - 34, '~ I PRAY TO JESUS ~', '#a8e0ff');
    for (const e of w.ents) {
      if (!e.enemy || e.boss || e.dead || !e.hurtBox || !G.overlap(r, e.hurtBox())) continue;
      e.frozen = 300;
      w.burst(e.x, e.y - 8, ['#ffffff', '#d8f4ff', '#a8e0ff'], 6, { speed: 1, life: 20, size: 1 });
    }
    // some places have water worth freezing
    const def = G.MAPS[w.id];
    if (def && def.onIcy) def.onIcy(w, p, r);
  };

  // Jamie Lee Curtis (taught by Michelle): everything nearby gets the fright of its
  // life and runs from Nate for 3 seconds (no attacks while it runs, and it can
  // still be bonked). Gulls get startled right off their lights.
  const JLC_RADIUS = 80;
  S.signalJlc = function () {
    const p = P(), w = G.play.world;
    w.fx.push({ x: p.x, y: p.y - 6, vx: 0, vy: 0, circle: true, r: JLC_RADIUS - 6, max: 24, life: 24, color: '#ffb8e0' });
    G.audio.sfx('yell');
    G.play.shake(10, 2);
    w.pop(p.x, p.y - 34, 'JAMIE LEE CURTIS!!!', '#e8a0d8');
    let n = 0;
    for (const e of w.ents) {
      if (!e.enemy || e.boss || e.dead || Math.hypot(e.x - p.x, e.y - p.y) > JLC_RADIUS) continue;
      n++;
      if (e instanceof G.Seagull) { e.startle(); continue; }
      e.scared = 180;
      e.calm = 0;
    }
    // the protest at the fair: "nothing scares us" (they always come back, and this always works)
    const protest = [w.organizer, ...(w.protesters || [])].filter((e) => e && !e.dead);
    if (protest.some((e) => Math.hypot(e.x - p.x, e.y - p.y) < 110)) { n++; G.script.run(S.protestScatter()); }
    // Mom does not appreciate it
    const m = w.ents.find((e) => e instanceof G.NPC && e.name === 'Michelle' && Math.hypot(e.x - p.x, e.y - p.y) < 120);
    if (m) w.pop(m.x, m.y - 34, 'NATE!!!', '#e8a0d8');
    else if (!n) w.pop(p.x, p.y - 24, '(nobody to startle)', '#c8c8d0');
  };

  S.dadArena = function* () {
    const f = flags();
    if (!G.state.items.pipe) {
      yield G.say('Dad', 'Nate! Before you go, I made you something in my workshop.');
      yield* S.pipeGift();
      return;
    }
    yield G.say('Dad', 'The nachos here are excellent. Very EEENGLISH.');
    yield G.say('Dad', 'If your mother asks, I was at a book club.');
    // (a clue for the grocery store on College Hill, which is a surprise)
    if (G.with('doron') && !f.runningMan) {
      f.runningMan = true;
      yield G.say('Doron', 'Dad\'s gotten weirdly good at the Running Man lately. At weddings. Out of nowhere.');
      yield G.say('Dad', '...The nachos, Doron.');
    }
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
    yield G.say('Nate', 'The south road is open! First stop: home. Then Chesapeake.');
    d.hold = false;
  };


  // ---------------------------------------------------------------- home

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
    if (G.with('doron')) {
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
  // The old garage fridge in Dad's workshop (the milk for the refrigerator game).
  S.garageFridge = function* () {
    const f = flags(), s = G.state;
    if (f.fridgeGame && !s.items.milk && !f.badlandsBeaten) {
      yield G.say(null, 'The old garage fridge, humming like a jet engine.');
      yield G.say(null, 'Inside: pickles, a tub of fishing worms, and one carton of {y}milk{/}. Expiration date: unclear.');
      yield* getIngredient('milk');
      return;
    }
    yield G.say(null, 'The old garage fridge. Pickles, a tub of fishing worms, and a lot of hope.');
  };

  // Nate's half-finished bass, waiting on the workbench.
  S.bassBench = function* () {
    const s = G.state, w = G.play.world;
    if (s.items.bass) {
      yield G.say(null, 'Nate\'s end of the workbench: fret files, sandpaper, and a jar of screws that is mostly not screws.');
      return;
    }
    yield G.say(null, 'On the workbench: a walnut bass body and a maple neck with the frets already in. No strings. No finish.');
    yield G.say('Nate', 'My bass! I\'ve been building it out here in Dad\'s workshop. It\'s... not done yet.');
    s.items.bass = true;
    if (w.bassProp) w.bassProp.img = null;
    yield G.itemGet(G.spr.bassIcon, 'You got the {y}Half-Finished Bass{/}! It\'s with the instruments in {y}COLLECTABLES{/}.');
    yield G.say('Nate', 'It can\'t play a single note yet. But it will. Someday. Probably.');
    if (G.with('doron')) yield G.say('Doron', 'Strings are kind of the whole thing with a bass, Nate.');
    if (G.with('lily')) yield G.say('Lily', 'It\'s very pretty for something that doesn\'t make any noise.');
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
    if (G.with('doron')) yield G.say('Doron', 'So THAT\'S where it all went.');
    if (G.with('lily')) yield G.say('Lily', 'That\'s why the pool turned green every summer, Nate.');
    yield G.say('Nate', 'Science requires sacrifices. Mostly the pool.');
  };
  S.homeTruck = function* () {
    const f = flags();
    if (needKey()) { yield* S.keyHuntTruck(); return; }
    yield G.say(null, 'Dad\'s old teal Ford pickup. It runs. Mostly.');
    // (a clue for the grocery store on College Hill)
    if (!f.bananaSeen) {
      f.bananaSeen = true;
      yield G.say(null, 'The cupholder is stuffed with grocery receipts. Every single one says: 1 BANANA.');
      yield G.say(null, 'All from the same grocery store on College Hill, in Easton. All on Tuesdays, around 10:45 at night.');
      yield G.say('Nate', 'That\'s an hour away. Who drives an hour to buy ONE banana? At NIGHT?');
    } else yield G.say(null, 'The cupholder is still stuffed with one-banana receipts.');
  };
  S.homeCoop = function* () {
    yield G.say(null, 'The chicken coop. Somebody has been laying eggs in there.');
    yield G.say('Nate', '...Hopefully not Father Eggmas.');
  };
  // Daisy's house, in the corner of Mom's garden
  S.daisyHouse = function* () {
    yield G.say(null, 'Daisy\'s house: a little wooden bunny hutch with a white picket fence around it.');
    yield G.say(null, 'Daisy is a boy. Everybody found that out after he was already named Daisy. It stuck.');
    yield G.say(null, 'Inside, there\'s a blue blanket with a wet spot on it.');
    yield G.say('Nate', 'I don\'t know how that thing is still alive.');
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
  // (a real family joke: years ago, Abe signed Lily up for a taxidermy catalog, and it still comes)
  S.homeMailbox = function* () {
    yield G.say(null, 'The mailbox. Inside: a bill, a postcard from Nani that just says "SHINE!", and a taxidermy catalog addressed to Lily. Again.');
    if (G.with('lily')) yield G.say('Lily', 'ABE.');
    else yield G.say('Nate', 'Abe signed her up for that as a joke. Years ago. It never stopped coming.');
  };
  S.lilyCatalogs = function* () {
    yield G.say(null, 'Lily\'s trash can. It\'s full of taxidermy catalogs, every single one still in its plastic.');
    yield G.say(null, 'The one on top: STUFFED, THE TAXIDERMY CATALOG. This month: "Squirrels in Tiny Hats."');
    if (G.with('lily')) {
      yield G.say('Lily', 'One every month. I have never opened a single one.');
      yield G.say('Nate', 'Who signed you up?');
      yield G.say('Lily', 'Who do you THINK.');
    }
  };
  S.homeStreetSign = function* () {
    yield G.say(null, 'RATTLESNAKE BRIDGE RD.');
    yield G.say(null, 'Bedminster, New Jersey.');
  };
  // Leaving home from either end of the road: back to campus, or the long
  // drive to Chesapeake (which Mikey blocks until Lily is saved).
  S.homeLeave = function* (side) {
    const p = P(), back = side === 'west' ? 1 : -1;
    const c = yield G.ask('Nate', 'Where to?', ['Back to Lafayette', 'Drive to Chesapeake', 'The Andover mines', 'Stay home']);
    if (c === 0) { G.play.warp('campus', 19, 27, 'up'); return; }
    if (c === 2) { yield* S.driveAndover(); return; }
    if (c === 1) {
      if (!flags().lilySaved) { yield* S.mikeyBlock(side); return; }
      if (!flags().mikeyBeaten) { yield* S.mikeyGoldenHour(); return; }
      yield* S.homeEast(side);
      return;
    }
    yield G.walkTo(p, p.x + back * 24, p.y, 1.2);
  };

  // what's still going on around home (for the heads-up and the journal)
  const homeLeads = () => {
    const f = flags(), s = G.state, leads = [];
    if (!f.booksQuest) leads.push(['Michelle', 'Nate! Are you leaving already? Come find me in the garden first. Something strange is going on with my books.', 'Mom\'s garden', 'Mom wants to talk']);
    if (!f.snackQuest) leads.push(['Dad', 'Nate. Workshop. When you have a minute. Bring snacks.', 'Dad\'s workshop', 'Dad needs something']);
    if (!f.jjSeen && !f.jjBeaten) leads.push(['Lily', 'there is singing coming from past the bridge. in the snow. it is july', 'Past the bridge', 'Someone is singing']);
    if (!f.andoverLocked && !s.items.andoverKey) leads.push(['Doron', 'when are we going rock hunting at the andover mines. you promised. you ALWAYS promise', 'The Andover mines', 'Doron wants to go']);
    return leads;
  };
  G.homeLeads = homeLeads;
  // Everything at home done (Mom's books back, Dad's snacks, Ice JJ Fish booked for church): that's
  // when Dad opens his pipe bench.
  G.homeDone = () => { const f = flags(); return !!(f.shopOpen && f.snacksDone && f.jjBeaten); };
  S.homeEast = function* () {
    const f = flags(), p = P(), leads = homeLeads();
    if (!f.leaveNudge && leads.length) {
      f.leaveNudge = true;
      G.audio.sfx('buzz');
      yield G.say(null, 'Before Nate can even get to the car, his phone buzzes. And buzzes.');
      for (const [who, line] of leads) yield G.text(who, line);
      yield G.say('Nate', 'Huh. Sounds like there\'s still plenty going on around here.');
      yield G.say(null, '(None of it is required. Check the {y}JOURNAL{/} for everything going on around home.)');
      const c = yield G.ask('Nate', 'Head out anyway?', ['Drive to Chesapeake', 'Stay a while']);
      if (c) { yield G.walkTo(p, p.x + (p.x < 30 * 16 ? 24 : -24), p.y, 1); return; }
    }
    yield G.say('Nate', 'Chesapeake. Down the Eastern Shore, then straight across the bay. Hang on, Number One Ditch.');
    G.play.warp('cbbtToll', 17, 13, 'left');
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
    if (G.with('doron')) {
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
    yield G.say('Nate', 'Mom confiscated a whole stash of those once. If anybody still has them, it\'s Mom. She\'s usually out in the garden.');
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
    if (flags().badlandsBeaten) {
      if (!G.photoHas('nateSchool')) { yield* S.fridgePhoto(); return; }
      yield G.say(null, 'The fridge. Lily refuses to go near it ever again.');
      yield G.say(null, 'Nate\'s school picture is still stuck to the side. The eyes follow you around the kitchen.');
      return;
    }
    yield* fridgeThump();
    if (G.play.world.badlands) yield G.say('Badlands Chugs', 'Ah-ah-ah. Don\'t touch dat.');
  };

  // The first photo for the collection: Nate's school picture, on the side of the fridge.
  S.fridgePhoto = function* () {
    yield G.say(null, 'The fridge. Lily refuses to go near it ever again.');
    yield G.say(null, 'Stuck to the side with a magnet: Nate\'s old school picture. Navy striped polo. Huge grin. Eyes VERY wide open.');
    yield G.say('Nate', 'Oh no. Not this one.');
    if (G.with('lily')) yield G.say('Lily', 'Oh, I LOVE this one.');
    yield G.say(null, 'Mom asked Dad not to send this picture to anyone. Something about the look in Nate\'s eye.');
    yield G.say('Nate', '...She said not to SEND it. She never said anything about taking a picture of it.');
    G.audio.sfx('blip');
    G.play.shake(4, 1);
    yield G.wait(20);
    yield* S.photoGive('nateSchool');
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

  // ================================================================ MOM (Michelle)
  // First seen watering the dahlias. Nate sneaks up on her, she yells the
  // first name that comes into her head, and hands him the missing-books quest.
  S.michelleStartle = function* () {
    const f = flags(), w = G.play.world, p = P(), m = w.michelle;
    f.michelleMet = true;
    yield G.camFocus(m.x, m.y - 10, 30);
    yield G.say(null, 'Mom is out in the garden, humming to herself and watering the dahlias. She hasn\'t noticed Nate.');
    yield G.camFocus(null, null, 20);
    yield G.walkTo(p, m.x + 15, m.y + 2, 0.5);
    p.dir = 'left';
    // whoever's tagging along hangs back a step
    const fol = w.ents.find((e) => e instanceof G.Follower && !e.dead);
    if (fol) { fol.hold = true; Object.assign(fol, { x: p.x + 18, y: p.y + 6, dir: 'left', moving: false }); }
    yield G.wait(20);
    yield G.say('Nate', 'Hey, Mom.');
    // !!!
    m.dir = 'right';
    m.held = null;
    G.audio.sfx('yell');
    G.play.shake(24, 3);
    w.burst(m.x - 6, m.y - 10, ['#78c8ff', '#a8e0ff', '#ffffff'], 10, { speed: 1.4, up: 1, g: 0.08, life: 26, size: 2 });
    yield G.walkTo(m, m.x, m.y - 10, 3);
    yield G.walkTo(m, m.x, m.y + 10, 3);
    yield G.bigText('JAMIE LEE CURTIS!!!', 70, '#f8d850');
    yield G.say('Michelle', 'JAMIE LEE CURTIS!!!');
    yield G.emote(p, 'bang', 30);
    yield G.say('Nate', '...Hi, Mom.');
    yield G.say('Michelle', 'NATE! Don\'t sneak up on me like that! I almost watered you!');
    yield G.say('Nate', 'Why Jamie Lee Curtis?');
    yield G.say('Michelle', 'It\'s just what came out!');
    if (G.with('lily')) {
      yield G.say('Lily', 'She yelled that in the middle of a conversation once. Nobody was talking about Jamie Lee Curtis.');
      yield G.say('Michelle', 'It was relevant in my HEAD.');
    } else if (G.with('doron')) {
      yield G.say('Doron', 'Still yelling celebrities, Michelle?');
      yield G.say('Michelle', 'Only the good ones.');
    } else {
      yield G.say('Nate', 'You yelled that in the middle of a conversation once. Nobody was talking about Jamie Lee Curtis.');
      yield G.say('Michelle', 'It was relevant in my HEAD.');
    }
    m.held = G.spr.wateringCan;
    yield G.say('Michelle', 'Anyway! Look at these dahlias. Three weddings this month, plus the altar flowers for Sunday.');
    yield G.say('Michelle', 'Speaking of Sunday. A new family visited church. Guess how I got introduced.');
    yield G.say('Nate', '...As Michelle?');
    yield G.say('Michelle', '"And THIS is the pastor\'s wife!"');
    yield G.say('Michelle', 'I WORK there, Nate. I have a job. I have a flower farm. I have a NAME.');
    yield G.say('Nate', 'Michelle.');
    yield G.say('Michelle', 'THANK you.');
    if (f.fridgeGame && !G.state.items.vodka && !f.badlandsBeaten) yield* askMomForVodka();
    // (her missing books wait until things at home calm down, after Golden Hour)
    if (f.mikeyBeaten) yield* momBooksStart(false);
    if (fol) fol.hold = false;
  };

  // The missing books: Mom asks Nate to look into it.
  function* momBooksStart(later) {
    yield G.say('Michelle', later ? 'Nate! Now that things have calmed down around here. Something strange is going on. My books keep disappearing.' : 'Also, something strange is going on. My books keep disappearing.');
    yield G.say('Michelle', 'First my gardening books. Then my devotionals. Then my seed catalogs. ALL of them. I was halfway through the tomatoes!');
    yield G.say('Michelle', 'And at night I hear... singing. Coming up through the floor vents. From the BASEMENT.');
    yield G.say('Nate', 'Singing?');
    yield G.say('Michelle', 'A slithery, horrible little song. It gets stuck in my head for DAYS. I cannot STAND it.');
    yield G.say('Michelle', 'Be a dear and look around the house? Whatever is taking them can\'t be tidy about it. Find me some clues, and I\'ll make it worth your while.');
    flags().booksQuest = true;
  }

  // The refrigerator game needs vodka shooters, and Mom has the only ones.
  function* askMomForVodka() {
    flags().vodkaAsked = true;
    yield G.say('Nate', 'Also... hypothetically... do you still have any vodka shooters?');
    yield G.say('Michelle', 'The ones I found in a hollowed-out "War and Peace"? Who exactly are these for?');
    yield G.say('Nate', 'Badlands Chugs. He locked Lily in the fridge. It\'s for the refrigerator game.');
    yield G.say('Michelle', '...I\'m not even going to ask.');
    yield G.say('Michelle', 'I\'ve been saving these for a special occasion. This is a special occasion.');
    yield* getIngredient('vodka');
  }
  // what Mom talks about before the books go missing (before Golden Hour)
  const MOM_EARLY = [
    'If one more person calls me "the pastor\'s wife" I\'m going to plant them in a raised bed.',
    'Watch out for the snapdragons. These ones bite. I don\'t know where they came from.',
    'Three weddings this month. Do you know how many dahlias that is? I do. I counted.',
  ];

  const MOM_LINES = [
    'Any luck with my books? The basement door is in the front hall.',
    'I heard the singing again last night. I put a pillow over my head. I could STILL hear it.',
    'If one more person calls me "the pastor\'s wife" I\'m going to plant them in a raised bed.',
    'Watch out for the snapdragons. These ones bite. I don\'t know where they came from.',
  ];
  S.michelle = function* () {
    const f = flags(), s = G.state;
    if (!f.michelleMet) { yield* S.michelleStartle(); return; }
    if (f.snackQuest && !s.items.candyCorn && !f.snacksDone && !f.momDenied) { yield* S.momCandy(); return; }
    if (s.items.books && !f.shopOpen) { yield* returnBooks(); return; }
    if (f.cluesDone && !f.momReport) { yield* momReport(); return; }
    if (f.fridgeGame && !s.items.vodka && !f.badlandsBeaten) { yield* askMomForVodka(); return; }
    if (!f.booksQuest) {
      if (f.mikeyBeaten) { yield* momBooksStart(true); return; }
      if (f.lilySaved) { yield G.say('Michelle', 'There\'s a boy at the end of the driveway with heart balloons. Lily has that look on her face.'); return; }
      f.momLine = ((f.momLine || 0) + 1) % MOM_EARLY.length;
      yield G.say('Michelle', MOM_EARLY[f.momLine]);
      return;
    }
    if (!f.cluesDone) { yield G.say('Michelle', 'Find anything? Look around the house. Whatever it is, it leaves a mess.'); return; }
    if (!s.items.basementKey && !f.globBeaten) { yield G.say('Michelle', 'Any luck with your father\'s keys? Garage, truck, grill. Anywhere he\'s ever held a sandwich.'); return; }
    if (!s.items.earplugs && !f.globBeaten) { yield G.say('Michelle', 'Earplugs, Nate. Cotton balls in the upstairs bathroom, wax from Lily\'s candle. Trust me.'); return; }
    f.momLine = ((f.momLine || 0) + 1) % MOM_LINES.length;
    yield G.say('Michelle', f.globBeaten ? 'You found my books? Bring them here!' : MOM_LINES[f.momLine]);
  };

  // The clues point to the basement: Mom explains the key, the earplugs, and the bait.
  function* momReport() {
    const f = flags(), s = G.state;
    f.momReport = true;
    yield G.say('Nate', 'Mom. I found chewed-up pages all over the house. Bite marks. Slime. And they all smell like the basement.');
    yield G.say('Michelle', 'The BASEMENT? That\'s where the singing comes from!');
    yield G.say('Michelle', 'That door has been locked for years. Your father has the only key. On his keyring.');
    yield G.say('Nate', 'Where\'s his keyring?');
    yield G.say('Michelle', 'Not in the bowl. It is NEVER in the bowl. Try the garage, the truck, the grill... anywhere he\'s ever held a sandwich.');
    yield G.say('Michelle', 'And Nate. If you hear that song down there, it gets stuck in your head for DAYS. Wear earplugs.');
    yield G.say('Michelle', 'Cotton balls are in the upstairs bathroom. Roll them in candle wax. Lily has a candle.');
    yield G.say('Michelle', 'One more thing. Whatever is down there eats books. So bring it a book.');
    s.items.bait = true;
    yield G.itemGet(G.spr.pastorBook, 'Michelle hands over {y}"Being a Wonderful Pastor\'s Wife"{/}. A gift from the church ladies.');
    yield G.say('Michelle', 'I have been waiting YEARS for a reason to get rid of that.');
  }

  // ---- the clue hunt: chewed pages around the house (any 3 of 4)
  const CLUES = ['den', 'nightstand', 'mudroom', 'lily'];
  const CLUES_NEEDED = 3;
  G.clueCount = () => CLUES.filter((k) => fl()['clue_' + k]).length;
  // A spot in the house: a clue while the hunt is on, otherwise its usual line.
  const clueSpot = (id, normal, found) => function* () {
    const f = flags();
    if (!f.booksQuest || f.cluesDone || f['clue_' + id] || f.globBeaten) { if (normal) yield G.say(null, normal); return; }
    f['clue_' + id] = true;
    yield* found();
    const n = G.clueCount();
    yield G.itemGet(G.spr.chewedPage, 'You found a {y}chewed page{/}! (' + G.sayable(n) + '/' + CLUES_NEEDED + ' clues)');
    if (n >= CLUES_NEEDED) {
      f.cluesDone = true;
      yield G.say('Nate', 'Bite marks. Slime. And every page smells like... the basement.');
      yield G.say('Nate', 'I should tell Mom.');
    }
  };
  S.clueNightstand = clueSpot('nightstand', 'A nightstand with a red lamp and a tall stack of seed catalogs.', function* () {
    yield G.say(null, 'Mom\'s nightstand. A seed catalog, dog-eared, every tomato circled twice. The whole back half is bitten off.');
    yield G.say('Nate', 'She reads these in bed. Cover to cover. Every night. Like they\'re novels.');
    yield G.say('Nate', 'Whoever did this ate the zinnias. That was her favorite part.');
  });
  S.clueMudroom = clueSpot('mudroom', 'Boots, sneakers, and one flip-flop with no partner.', function* () {
    yield G.say(null, 'Under the boot bench: a stack of church bulletins, nibbled into lace.');
    yield G.say('Nate', 'Even the announcements. Nothing is safe.');
  });
  S.clueLily = clueSpot('lily', 'A nightstand with a little lamp and a phone charger.', function* () {
    yield G.say(null, 'On Lily\'s nightstand: a bookmark. It\'s slimy.');
    if (G.with('lily')) yield G.say('Lily', 'That\'s not mine. That\'s DEFINITELY not mine.');
    else yield G.say('Nate', 'Lily doesn\'t even use bookmarks. She dog-ears. Like a monster.');
  });
  S.clueDen = clueSpot('den', null, function* () {
    yield G.say(null, 'Built-in shelves with big gaps everywhere. A half-eaten cookbook is still wedged in the corner.');
    yield G.say('Nate', 'Bite marks. Great.');
  });

  // ---- Dad's keys (the truck has them; the grill and the workbench don't)
  const needKey = () => flags().momReport && !G.state.items.basementKey && !flags().globBeaten;
  S.keyHuntTruck = function* () {
    G.audio.sfx('door');
    yield G.say(null, 'Nate checks the cupholder of Dad\'s truck. Receipts. A sermon outline. A pipe cleaner...');
    G.state.items.basementKey = true;
    yield G.itemGet(G.spr.keyring, 'You found {y}Dad\'s keyring{/}! One of these opens the basement.');
    yield G.say('Nate', 'Not in the bowl. Never in the bowl.');
  };
  S.keyHuntMiss = (where) => function* () {
    flags()['key_' + where] = true;
    if (where === 'grill') yield G.say(null, 'Nate checks the grill for Dad\'s keys. Tongs. A wire brush. No keys. ...There is half a hot dog, though.');
    else yield G.say(null, 'Nate checks the workbench for Dad\'s keys. Sawdust, a pencil, and three different tape measures. No keys.');
  };

  // ---- earplugs: cotton balls + Lily's candle wax
  function* craftEarplugs() {
    const s = G.state;
    if (!s.items.cotton || !s.items.wax) { yield G.say('Nate', s.items.cotton ? 'Now I need some wax. Lily has a candle.' : 'Now I need cotton balls. Upstairs bathroom.'); return; }
    s.items.cotton = false; s.items.wax = false; s.items.earplugs = true;
    yield G.itemGet(G.spr.earplugs, 'Nate rolls the cotton balls in candle wax. {y}Earplugs{/}! No song can get stuck in his head now.');
  }
  const wantPlugs = () => flags().momReport && !G.state.items.earplugs && !flags().globBeaten;
  S.vanity = function* () {
    if (wantPlugs() && !G.state.items.cotton) {
      G.state.items.cotton = true;
      yield G.say(null, 'On the messy side of the vanity: a bag of cotton balls. Nate grabs a handful.');
      yield* craftEarplugs();
      return;
    }
    yield G.say(null, 'A double vanity. One side is very tidy. The other side is not.');
  };
  S.lilyDresser = function* () {
    if (wantPlugs() && !G.state.items.wax) {
      G.state.items.wax = true;
      yield G.say(null, 'On Lily\'s dresser: a candle called "Vanilla Cupcake." Nate scrapes off a little wax.');
      if (G.with('lily')) yield G.say('Lily', 'That\'s my GOOD candle.');
      yield* craftEarplugs();
      return;
    }
    yield G.say(null, 'A dresser with a mirror, a jewelry box, and a candle that smells like a cupcake.');
  };

  // Books back: Mom finally opens the flower stand she's always wanted.
  function* returnBooks() {
    const f = flags(), s = G.state, w = G.play.world, p = P(), m = w.michelle;
    yield G.say('Nate', 'Mom. I got your books back.');
    yield G.emote(m, 'bang', 30);
    yield G.say('Michelle', 'My BOOKS! Oh, Nate, thank you!');
    yield G.say('Michelle', '...Why are they all chewed?');
    yield G.say('Nate', 'There was a Globglogabgalab living in the basement.');
    yield G.say('Michelle', '...');
    yield G.say('Michelle', 'THAT was the singing?! I KNEW it. I can\'t stand that song. I can\'t stand HIM.');
    yield G.say('Nate', 'He said he\'d sing quietly from now on.');
    yield G.say('Michelle', 'He\'d better.');
    yield G.say('Michelle', 'Gardening books... devotionals... my seed catalogs... wait.');
    yield G.say('Michelle', 'Where\'s "Being a Wonderful Pastor\'s Wife"?');
    yield G.say('Nate', 'That was the bait. He ate it. I could go back down and see if there\'s anything left?');
    yield G.say('Michelle', 'Keep it.');
    yield G.say('Michelle', 'Okay. A deal\'s a deal. I\'ve wanted to do this for years. Give me one minute.');
    s.items.books = false;
    f.shopOpen = true;
    yield G.fadeOut(24);
    w.addProp({ img: G.spr.flowerStand, tx: 35, ty: 25, solid: [35, 25, 3, 1], hit: [35, 25, 3, 1], talk: S.michelleShop });
    Object.assign(m, { x: 34 * 16 + 4, y: 25 * 16 + 14, dir: 'down', talk: S.michelleShop, held: null });
    m.home = { x: m.x, y: m.y };
    Object.assign(p, { x: 36 * 16 + 8, y: 27 * 16 + 6, dir: 'up' });
    G.play.trail = G.play.trail.map((_, i) => ({ x: p.x, y: p.y + i * 0.6, dir: 'up' }));
    G.play.setFollower(G.activeFollower());
    yield G.wait(10);
    yield G.fadeIn(24);
    G.audio.sfx('secret');
    yield G.banner('MICHELLE\'S FLOWERS', 'now open!', 130);
    yield G.say('Michelle', 'Welcome to {p}Michelle\'s Flower Stand{/}! Not "the pastor\'s wife\'s flower stand." MICHELLE\'s.');
    yield G.say('Michelle', 'Fresh flowers, Doosh for the road... and one very special hen.');
    standOpening = true;
    yield* S.michelleShop();
    standOpening = false;
  }
  let standOpening = false;

  // Michelle's pipe song: the first time Nate stops by her stand with Dad's pipe
  S.momSong = function* () {
    const f = flags(), p = P();
    yield G.say('Michelle', 'Is that your father\'s pipe? Did he teach you any of his little songs?');
    yield G.say('Nate', 'Peace Be With You.');
    yield G.say('Michelle', 'Of course he did. Here\'s one he\'ll never teach you. He made it up the first time I yelled "Jamie Lee Curtis" in his ear.');
    yield G.say('Michelle', 'Right, left, right. Fast. Like you just got the fright of your life.');
    f.signal_jlc = true;
    G.audio.sfx('fanfare');
    yield G.itemGet(G.spr.pipe, 'You learned a new pipe song: {p}Jamie Lee Curtis{/}  ' + G.arrows(['right', 'left', 'right']));
    yield G.say(null, 'Puff it on Dad\'s pipe and anything nearby gets the fright of its life and runs. The songs you know are under {y}Dad\'s Pipe{/} in the {y}ITEMS{/} menu.');
    p.dir = 'up';
    yield G.say('Michelle', 'And do NOT puff it at me.');
  };

  // Shark teeth for prices (no sacred numbers on the price tags, of course).
  function* momPay(n) {
    if (G.state.teeth >= n) { G.play.addTeeth(-n); G.audio.sfx('tooth'); return true; }
    yield G.say('Michelle', 'You\'re a little short, hon. Shark teeth don\'t grow on trees. They grow on SHARKS.');
    return false;
  }
  const MOM_CHAT = [
    'If anybody asks, this is MICHELLE\'s Flower Stand. Not the pastor\'s wife\'s flower stand.',
    'Dahlias, zinnias, cosmos, snapdragons... well. Not the snapdragons. Those bite.',
    'I can still hear that song sometimes. Faintly. Through the vents. I\'m going to need a vacation.',
    'People keep asking why I yelled "Jamie Lee Curtis." I don\'t KNOW why. She just lives in my head.',
    'Who do you think does the altar flowers every Sunday? Not "the pastor\'s wife." ME.',
    'Your father\'s "Tuesday thing" always runs late. Last week he came home smelling like cantaloupe.',
  ];
  S.michelleShop = function* () {
    const f = flags(), s = G.state;
    if (f.snackQuest && !s.items.candyCorn && !f.snacksDone && !f.momDenied) { yield* S.momCandy(); return; }
    if (s.items.pipe && !f.signal_jlc && !standOpening) yield* S.momSong();
    const menu = [];
    if (!s.items.chicken) menu.push(['The Chicken: 30', function* () {
      if (!(yield* momPay(30))) return;
      s.items.chicken = true;
      s.xItem = 'chicken';
      yield G.itemGet(G.spr.chickens.white.right[0], 'You got {y}The Chicken{/}! Load her with eggs, then press {y}X{/} to fire one.');
      yield G.say('Michelle', 'Her name is Henrietta. She needs a second between eggs. Don\'t rush her.');
      yield G.say('Nate', 'A chicken that shoots eggs. Mom. This is the best thing you\'ve ever sold.');
      yield G.say('Michelle', 'Eggs are sold separately.');
      yield G.say('Nate', '...She\'s a CHICKEN.');
      yield G.say('Michelle', 'And I\'m a small business. A dozen for 10 teeth.');
    }]);
    if (s.items.chicken) menu.push(['Eggs (a dozen): 10', function* () {
      if ((s.items.eggs || 0) >= 40) { yield G.say('Michelle', 'Henrietta can\'t hold any more eggs, hon. Nobody can.'); return; }
      if (!(yield* momPay(10))) return;
      s.items.eggs = Math.min(40, (s.items.eggs || 0) + 12);
      yield G.itemGet(G.spr.egg, 'You got {y}a dozen eggs{/}! (' + G.sayable(s.items.eggs) + ' loaded)');
      if (!f.eggJoke) { f.eggJoke = true; yield G.say('Michelle', 'Fresh from the coop this morning. Henrietta\'s cousins.'); }
    }]);
    if (!s.items.andoverKey) menu.push(['Andover Mines Key: 200', function* () {
      if (!(yield* momPay(200))) return;
      s.items.andoverKey = true;
      yield G.say('Michelle', 'The Andover mines? The man who owns that land goes to my church. He gave me a key to the gate years ago. "For the rock boy."');
      yield G.say('Nate', 'The rock boy?');
      yield G.say('Michelle', 'You, hon. Everyone at church calls you the rock boy.');
      yield G.itemGet(G.spr.gateKey, 'You got the {y}Andover Mines Key{/}! Pick {y}The Andover mines{/} when you leave home.');
      yield G.say('Nate', 'Two HUNDRED teeth for a key?');
      yield G.say('Michelle', 'It\'s a very special key. The flower fund thanks you. And wear a HELMET.');
    }]);
    if (!f.momHeart) menu.push(['Heart Container: 100', function* () {
      if (!(yield* momPay(100))) return;
      f.momHeart = true;
      s.maxHp += 2;
      s.hp = s.maxHp;
      yield G.itemGet(G.spr.heartBig, 'You got a {r}Heart Container{/}! Max hearts +1.');
      yield G.say('Michelle', 'Pressed flowers in a little heart-shaped frame. It\'s good for you. Don\'t ask how.');
    }]);
    if (f.fridgeGame && !s.items.vodka && !f.badlandsBeaten) menu.push(['Vodka Shooters: 10', function* () {
      yield G.say('Michelle', 'Vodka shooters. Who exactly are these for?');
      yield G.say('Nate', 'Badlands Chugs. He locked Lily in the fridge. It\'s for the refrigerator game.');
      yield G.say('Michelle', '...I\'m not even going to ask.');
      yield G.say('Michelle', 'I found these in a hollowed-out "War and Peace" years ago. I\'ve been saving them for a special occasion.');
      yield G.say('Michelle', 'This is a special occasion.');
      if (s.teeth >= 10) G.play.addTeeth(-10);
      else yield G.say('Michelle', 'You\'re short? ...Just take them. Don\'t tell your father.');
      yield* getIngredient('vodka');
    }]);
    menu.push(['Doosh De Luche: 10', function* () {
      if ((s.items.doosh || 0) >= 3) { yield G.say('Michelle', 'Your pockets are already full of Doosh, hon.'); return; }
      if (!(yield* momPay(10))) return;
      s.items.doosh = (s.items.doosh || 0) + 1;
      f.hadDoosh = true;
      if (!s.xItem) s.xItem = 'doosh';
      yield G.itemGet(G.spr.doosh, 'You got a {y}Doosh De Luche{/}! Heals 4 hearts.');
      yield G.say('Michelle', 'I keep a cooler of these for the farmers market crowd. It\'s pronounced dulce de leche, by the way.');
    }]);
    menu.push(['Bouquet: 5 (heals)', function* () {
      if (s.hp >= s.maxHp) { yield G.say('Michelle', 'You look perfectly healthy. Save your teeth.'); return; }
      if (!(yield* momPay(5))) return;
      s.hp = s.maxHp;
      G.audio.sfx('heart');
      yield G.say(null, 'Nate buries his face in a bouquet of dahlias. Hearts fully restored!');
    }]);
    menu.push(['Just chatting', function* () {
      f.momChat = ((f.momChat || 0) + 1) % MOM_CHAT.length;
      yield G.say('Michelle', MOM_CHAT[f.momChat]);
      if (/Tuesday/.test(MOM_CHAT[f.momChat])) f.tuesdayHeard = true;
    }]);
    menu.push(['Never mind', null]);
    const c = yield G.ask('Michelle', 'What can I get you? Prices are in shark teeth.', menu.map((x) => x[0]));
    if (menu[c][1]) yield* menu[c][1]();
    else yield G.say('Michelle', 'Come back anytime! Tell your friends whose stand it is.');
  };

  // ================================================================ THE BASEMENT
  S.basementDoor = function* () {
    const f = flags();
    const s = G.state;
    if (!f.booksQuest) {
      yield G.say(null, 'The basement door. From somewhere below: a low, slithery humming.');
      yield G.say('Nate', 'Nope. Not without a really good reason.');
      return;
    }
    if (!s.items.basementKey && !f.globBeaten) {
      yield G.say(null, 'The basement door. Locked. From somewhere below: humming.');
      yield G.say('Nate', !f.cluesDone ? 'Mom\'s books... I need more clues first.' : !f.momReport ? 'I should tell Mom what I found.' : 'Dad has the key. Somewhere. Not in the bowl.');
      return;
    }
    if (!f.basementOpened) {
      f.basementOpened = true;
      G.audio.sfx('door');
      yield G.say(null, 'Nate tries every key on Dad\'s keyring. The rustiest one turns. The humming gets louder.');
    }
    if (!f.globBeaten && !s.items.earplugs) {
      const c = yield G.ask('Nate', 'Mom said to wear earplugs. Go down without them?', ['Go down anyway', 'Not yet']);
      if (c !== 0) return;
    }
    G.play.warp('basement', 18, 6, 'down');
  };

  S.globIntro = function* () {
    const f = flags(), w = G.play.world, g = w.glob, p = P(), s = G.state;
    const doron = w.ents.find((e) => e instanceof G.Follower && e.id === 'doron' && !e.dead);
    yield G.wait(20);
    if (!f.globMet && s.items.bait) {
      // nothing here but chewed books and humming in the ducts: time for the bait
      g.hidden = true;
      yield G.say(null, 'Chewed-up books everywhere. But nothing\'s down here... just humming, coming out of the furnace ducts.');
      if (doron) yield G.say('Doron', 'I\'m not scared of a worm.');
      yield G.say('Nate', 'Time for the bait.');
      const bx = 10 * 16 + 8, by = 8 * 16 + 12;
      yield G.walkTo(p, bx, by + 16, 1.2);
      p.dir = 'up';
      s.items.bait = false;
      f.baitPlaced = true;
      const book = { img: G.spr.pastorBook, x: bx - 6, y: by - 15, base: by };
      w.props.push(book);
      G.audio.sfx('menu');
      yield G.say(null, 'Nate sets "Being a Wonderful Pastor\'s Wife" in the middle of the floor and backs away slowly.');
      yield G.walkTo(p, bx, by + 44, 0.8);
      p.dir = 'up';
      yield G.wait(40);
      // he dances out of the furnace duct
      G.audio.sfx('clank');
      G.play.shake(10, 2);
      Object.assign(g, { x: 3 * 16 + 8, y: 4 * 16 + 14, hidden: false });
      w.burst(g.x, g.y - 30, ['#8a8c94', '#c8c8d0', '#f8a8c8'], 12, { speed: 1.4, life: 24, size: 2 });
      w.pop(g.x, g.y - 54, '~ doo dee doo ~', '#f8a8c8');
      yield G.camFocus(g.x, g.y - 20, 20);
      if (doron) {
        // Doron is very brave. Doron is behind the furnace.
        doron.hold = true;
        yield G.say('Doron', '...');
        yield G.walkTo(doron, 2 * 16 + 26, 3 * 16 + 9, 3);
        doron.dir = 'down';
        w.pop(doron.x, doron.y - 30, '*hides*', '#68c8ff');
      }
      yield G.walkTo(g, bx, by - 2, 1.2);
      w.props = w.props.filter((pr) => pr !== book);
      G.audio.sfx('gulp');
      w.burst(bx, by - 8, ['#e8a0b8', '#f4ecd8', '#e8c060'], 12, { speed: 1.2, up: 0.6, g: 0.06, life: 24, size: 2 });
      w.pop(g.x, g.y - 54, '*munch munch*', '#f8a8c8');
      yield G.wait(40);
      f.globMet = true;
      yield G.say('Globglogabgalab', 'Mmm. "Being a Wonderful Pastor\'s Wife." Bland. A little preachy. Needs salt.');
      yield G.say('Globglogabgalab', 'Ah! A visitor!');
      yield G.say('Globglogabgalab', 'I\'m the Globglogabgalab.');
      yield G.say('Globglogabgalab', 'I love books.');
      yield G.say('Globglogabgalab', 'And this basement is a true treasure trove.');
      yield G.say('Nate', 'Those are my mom\'s books. She can\'t STAND you.');
      yield G.say('Globglogabgalab', 'Pity. Her books are simply delicious.');
      yield G.say('Globglogabgalab', 'She bangs on the ceiling every time I sing. No appreciation for the arts.');
      yield G.say('Globglogabgalab', 'The devotionals are so nourishing. And the seed catalogs! What a page-turner. Will she order the heirloom tomatoes? I couldn\'t wait. I ate the ending.');
      yield G.say('Nate', 'Well, I\'m taking them back.');
      yield G.say('Globglogabgalab', 'Then you\'ll have to catch me first, little bookmark.');
      yield G.camFocus(null, null, 30);
    } else {
      yield G.say('Globglogabgalab', 'Back for an encore? Wonderful! Take it from the top!');
    }
    if (s.items.earplugs) yield G.say(null, 'Nate pops in his earplugs. He can\'t hear a thing.');
    else yield G.say(null, 'No earplugs! When he sings, the song gets stuck in Nate\'s head and {r}his controls get scrambled{/}.');
    g.noBar = false;
    yield G.banner('THE GLOBGLOGABGALAB', 'he loves books', 150);
  };

  S.globDefeated = function* (boss) {
    const f = flags(), w = G.play.world, s = G.state;
    G.audio.stop();
    for (const e of w.ents) if (e instanceof G.BookShot) { e.dead = true; w.burst(e.x, e.y - 8, ['#f4ecd8', '#a83a3a'], 4); }
    G.audio.sfx('bell');
    yield G.shakeCmd(30, 3);
    yield G.wait(40);
    yield G.banner('YOU WIN!', 'the music stops', 150);
    yield G.say('Globglogabgalab', 'Oof. Ohh. My spine. ...Do I have a spine?');
    yield G.say('Globglogabgalab', 'Very well. Take the books. I only nibbled the corners. Mostly.');
    yield G.say('Nate', 'And no more singing at night. Mom can hear you through the vents.');
    yield G.say('Globglogabgalab', '...I shall sing QUIETLY.');
    yield G.say('Globglogabgalab', 'Farewell, little bookmark! I go to find a library that appreciates me!');
    w.pop(boss.x, boss.y - 54, '*shimmy shimmy*', '#f8a8c8');
    yield G.walkTo(boss, 3 * 16 + 8, 4 * 16 + 8, 1.6);
    G.audio.sfx('poof');
    w.burst(boss.x, boss.y - 20, ['#e8a898', '#f8c8b8', '#8a8c94'], 14, { speed: 1.2, life: 26, size: 3 });
    boss.dead = true;
    yield G.say(null, 'He squeezes into the furnace ductwork and is gone. Faintly, from somewhere in the walls: humming.');
    G.play.earworm = 0;
    const doron = w.ents.find((e) => e instanceof G.Follower && e.id === 'doron' && e.hold);
    if (doron) {
      yield G.walkTo(doron, doron.x + 18, doron.y + 14, 1);
      yield G.say('Doron', 'I was guarding the furnace.');
      yield G.say('Nate', 'Sure you were.');
      doron.hold = false;
    }
    // something flutters down out of the duct after him
    yield G.wait(20);
    w.pop(3 * 16 + 8, 3 * 16, '*flutter*', '#f4ecd8');
    yield G.say(null, 'Something flutters down out of the duct: a note, in shaky red marker.');
    yield G.say(null, '{r}"ENJOY THE BOOKS. HO HO HO. -E"{/}');
    yield G.say('Nate', '..."E." Father Eggmas let that thing into our BASEMENT?');
    if (G.with('doron')) yield G.say('Doron', 'That egg gets around.');
    else if (G.with('lily')) yield G.say('Lily', 'He was in our HOUSE.');
    w.eggNote = true;
    f.globBeaten = true;
    yield* S.bossStash(40, 'Behind the furnace: {y}40 shark teeth{/} the Globglogabgalab was using as bookmarks.');
    s.items.books = true;
    yield G.itemGet(G.spr.flyingBook[1], 'You got {y}Mom\'s Books{/}! Slightly chewed. Bring them to Mom in the garden.');
    G.audio.play('house');
  };


  // ================================================================ FATHER CHRISTMAS (postgame)
  // The original Christmas doll: bought at a thrift store with no clothes, the
  // kids thought he was hilarious, and he vanished in the move. Abe and Nate
  // always suspected Michelle. Reaching 100% (every quest, every rock) wakes him
  // up, deep in the Andover mines, in a box labeled DO NOT OPEN (LILY). Lily is
  // terrified of him.
  G.SONGS.fc2 = Object.assign({}, G.SONGS.fc, { bpm: 160 });
  G.SONGS.tyler2 = Object.assign({}, G.SONGS.tyler, { bpm: 190 });
  G.SONGS.fc3 = Object.assign({}, G.SONGS.fc, { bpm: 184 });
  const FC_BOUNDS = [2 * 16 + 8, 5 * 16, 22 * 16 - 8, 13 * 16 + 8];
  const fcJunk = (e) => e instanceof G.FCOrnament || e instanceof G.FCGift || e instanceof G.FCCandyCane;

  // 100%: the whole story, every sidequest, every rock and every photo. That's what wakes him.
  G.completion = () => {
    const f = flags(), s = G.state;
    return [
      ['Gus\'s lawn job', !!s.items.cap],
      ['Ben\'s chem question', !!f.phDone],
      ['The Chem Final (perfect)', !!f.chemPerfect],
      ['The EEENGLISH exam (perfect)', !!f.engPerfect],
      ['Doron\'s spare tickets', !!f.ticketsDone],
      ['The main event', !!f.dadBeaten],
      ['The boulder', !!f.boulderGone],
      ['Badlands Chugs', !!f.badlandsBeaten],
      ['Mikey', !!f.mikeyBeaten],
      ['Mom\'s missing books', !!f.shopOpen],
      ['The protesters', !!f.protestReward],
      ['Ice JJ Fish', !!f.jjBeaten],
      ['The old fisherman', !!s.items.rod],
      ['Tyler', !!f.tylerBeaten],
      ['Ruby, the rock kid', !!f.rubyHeart],
      ['Dad\'s hip hop class', !!f.hipHopDone],
      ['Every rock', G.rocksFound() >= G.ROCKS.length],
      ['Every photo', G.photosFound() >= G.PHOTOS.length],
    ];
  };
  G.allDone = () => G.completion().every((c) => c[1]);
  // checked every half second or so from the play loop
  G.postgameTick = () => {
    const f = flags();
    if (G.state.playAs || G.play.dying) return;
    if (f.ticketsGiven && !f.ticketsDone && f.dadBeaten) { G.script.run(S.ticketsText()); return; }
    if (!f.fcAwake && G.allDone()) G.script.run(S.fcWakes());
  };

  S.fcWakes = function* () {
    const f = flags();
    if (f.fcAwake) return;
    yield G.wait(30);
    G.audio.sfx('fanfare');
    yield G.banner('100%!', 'every quest, rock and photo', 170);
    G.audio.sfx('buzz');
    yield G.say(null, 'Nate\'s phone buzzes. And buzzes. And buzzes.');
    yield G.say(null, '{c}~ FAMILY GROUP CHAT ~{/}');
    yield G.text('Lily', 'nate');
    yield G.text('Lily', 'the news says people are hearing HO HO HO coming out of the old andover mines');
    yield G.text('Lily', 'slowly. they said it was SLOW');
    yield G.text('Abe', 'wait. andover. didnt mom go "antiquing" up there the week of the move');
    yield G.text('Abe', 'nate. NATE. you know what this means');
    yield G.say('Nate', '...Father Christmas.');
    yield G.text('Lily', 'i am never going to andover. ever');
    f.fcAwake = true;
    G.audio.sfx('secret');
    yield G.banner('POSTGAME', 'something stirs in the Andover mines', 170);
  };

  // the box at the back of the deep stope, shaking
  S.fcBox = function* () {
    const f = flags(), w = G.play.world, p = P();
    const lily = w.ents.find((e) => e instanceof G.Follower && e.id === 'lily' && !e.dead);
    const doron = w.ents.find((e) => e instanceof G.Follower && e.id === 'doron' && !e.dead);
    yield G.say(null, 'A cardboard box, way down here. In marker: {r}CHRISTMAS. DO NOT OPEN (LILY).{/} It\'s shaking. Something inside is humming. Slowly.');
    if (lily) yield G.say('Lily', 'Nate. NATE. It says do not open. It says LILY. That is ME.');
    const c = yield G.ask('Nate', f.fcMet ? 'Open it again?' : 'Open the box?', ['Open it', 'Absolutely not']);
    if (c) { if (lily) yield G.say('Lily', 'Thank you. Thank you so much.'); return; }
    const bx = w.fcBox.x + 9;
    yield G.walkTo(p, bx, 9 * 16 + 14, 1);
    p.dir = 'up';
    yield G.say(null, 'Nate lifts the lid...');
    // he unfolds out of the box
    G.audio.sfx('yell');
    G.play.shake(20, 3);
    w.fcBox.still = true;
    const b = w.fc = w.add(new G.FatherChristmas(bx, 4 * 16 + 14, FC_BOUNDS));
    b.alpha = 0;
    w.burst(bx, 4 * 16 + 4, ['#d83030', '#2e9a4a', '#d8b040', '#ece4d0', '#ffffff'], 24, { speed: 1.8, up: 1.2, g: 0.08, life: 40, size: 2 });
    yield { update() { b.alpha = Math.min(1, b.alpha + 0.03); return b.alpha >= 1; } };
    yield G.walkTo(b, bx, 6 * 16 + 4, 0.4);
    yield G.camFocus(b.x, b.y - 20, 30);
    if (!f.fcMet) {
      yield G.say('Father Christmas', 'Ho.');
      yield G.say('Father Christmas', 'Ho.');
      yield G.say('Father Christmas', '...Ho.');
      yield G.say('Nate', 'FATHER CHRISTMAS?!');
      if (doron) {
        yield G.say('Doron', 'Is he... naked?');
        yield G.say('Nate', 'He came that way. From the thrift store.');
        yield G.say('Doron', 'Oh, I remember. We thought it was hilarious.');
      }
      yield G.say('Father Christmas', 'Oh, you remember me. How NICE.');
      yield G.say('Father Christmas', 'I was the FIRST, Nate. The original. Front and center on the mantel every December.');
      yield G.say('Father Christmas', 'Abe, Doron, Nate and Lily. You all laughed. I thought you were laughing WITH me.');
      yield G.say('Father Christmas', 'Then came the move. Then came the box. Then came a long, dark drive. Then came THE MINE.');
      yield G.say('Father Christmas', 'And who sits on MY mantel now?');
      yield G.say('Nate', '...Father Eggmas.');
      yield G.say('Father Christmas', 'AN EGG. A plush EGG in a paisley suit. My REPLACEMENT. He even took HALF MY NAME!');
      yield G.say('Father Christmas', 'You did EVERYTHING, Nate. Every quest. Every rock in three counties. All that hammering woke me up.');
      yield G.say('Father Christmas', 'Now I\'m taking back my mantel. And then I\'m taking back CHRISTMAS.');
    } else {
      yield G.say('Father Christmas', 'Back for more? Ho. Ho. HO.');
    }
    if (lily) {
      yield G.say('Lily', 'NOPE.');
      lily.hold = true;
      yield G.walkTo(lily, 0, 8 * 16 + 14, 3.4);
      lily.dead = true;
      w.lilyFled = true;
      yield G.say('Nate', 'LILY!');
      if (!f.fcMet) yield G.text('Lily', 'i am in the car. i locked the doors. good luck');
    }
    if (doron) {
      yield G.say('Doron', 'I\'m not scared of a doll.');
      doron.hold = true;
      yield G.walkTo(doron, 3 * 16 + 18, 12 * 16 + 2, 3);
      doron.dir = 'down';
      w.pop(doron.x, doron.y - 30, '*guards the mine cart*', '#68c8ff');
    }
    yield G.camFocus(null, null, 30);
    if (!f.fcMet) {
      f.fcMet = true;
      yield G.say(null, 'He\'s {r}tough{/}: he hits for a whole heart and gets faster the angrier he gets. Watch for the {r}red band{/} before his sleigh dash, and slip through the {y}gap{/} in his HO HO HO rings.');
      G.play.autosave();
    }
    w.fcFight = true;
    yield G.banner('FATHER CHRISTMAS', 'the original', 150);
    G.audio.play('fc');
  };

  S.fcPhase = function* (boss, ph) {
    const w = G.play.world;
    for (const e of w.ents) if (fcJunk(e)) e.dead = true;
    G.audio.stop();
    yield G.shakeCmd(20, 3);
    if (ph === 2) {
      yield G.say('Father Christmas', 'Do you know what it\'s like? Staring at the inside of a box lid in the dark for YEARS?');
      yield G.say('Father Christmas', 'Every December I pictured you all at home. Hanging up the EGG.');
    } else {
      G.audio.sfx('boom');
      yield G.bigText('NAUGHTY LIST', 70, '#f86858');
      yield G.say('Father Christmas', 'HO. HO. HO. You are ALL on the naughty list.');
    }
    // the box coughs up a couple of hearts
    const bx = w.fcBox.bx + 9;
    for (const dx of [-12, 12]) w.add(new G.Pickup(bx + dx, 5 * 16 + 14, 'heart'));
    G.audio.play(ph === 2 ? 'fc2' : 'fc3');
  };

  S.fcDefeated = function* (boss) {
    const f = flags(), w = G.play.world, p = P();
    G.audio.stop();
    for (const e of w.ents) if (fcJunk(e)) { e.dead = true; w.burst(e.x, e.y - 8, ['#ffffff', '#d83030'], 3); }
    G.audio.sfx('bell');
    yield G.shakeCmd(30, 3);
    yield G.wait(40);
    w.fcFight = false;
    yield G.banner('YOU WIN!', 'the original, defeated', 150);
    boss.still = true;
    p.dir = G.dirToward(boss.x - p.x, boss.y - p.y);
    yield G.say('Father Christmas', '...Fine. FINE. Leave me down here. That\'s what you people do.');
    yield G.say('Nate', 'I didn\'t leave you anywhere! We thought you got lost in the move.');
    yield G.say('Father Christmas', 'LOST? I didn\'t get LOST, Nate. Somebody PACKED me. Somebody DROVE me out here.');
    yield G.say('Father Christmas', 'She said "this is for the best." Then she said "Nate will never look past the rocks."');
    yield G.say('Nate', '...She?');
    const doron = w.ents.find((e) => e instanceof G.Follower && e.id === 'doron' && e.hold);
    if (doron) {
      yield G.walkTo(doron, doron.x + 18, doron.y + 14, 1);
      yield G.say('Doron', 'I was guarding the mine cart.');
      yield G.say('Nate', 'Sure you were.');
      doron.hold = false;
    }
    G.audio.sfx('buzz');
    yield G.say(null, 'Nate texts Mom.');
    yield G.text('Nate', 'mom. did you throw father christmas away in the move');
    yield G.text('Michelle', 'I did NOT throw him away.');
    yield G.text('Michelle', 'I put him in a box, labeled it DO NOT OPEN (LILY), and drove him to the Andover mines.');
    yield G.text('Nate', 'WHY');
    yield G.text('Michelle', 'He was NAKED, Nate. On the MANTEL. The church ladies came over for MOPs.');
    yield G.text('Michelle', 'And I knew you\'d never look at anything down there but the rocks.');
    yield G.say('Nate', 'Abe and I KNEW it.');
    yield G.text('Abe', 'I KNEW IT. she told us he got LOST');
    yield G.say('Father Christmas', '...Can I come home?');
    yield G.text('Michelle', '...Fine. Bring him home. He can have half the mantel. Eggmas can scoot over.');
    yield G.text('Michelle', 'But he is wearing CLOTHES.');
    f.fcBeaten = true;
    // home: Michelle with her knitting needles
    yield G.fadeOut(30);
    G.play.loadMap('homeDown', 9 * 16 + 8, 6 * 16 + 14, 'left', true);
    const hw = G.play.world;
    const m = hw.add(new G.NPC({ sprite: 'michelle', name: 'Michelle', x: 8 * 16 + 8, y: 4 * 16 + 14, dir: 'left' }));
    yield G.say(null, 'Back home. Three hours and one ball of red yarn later...');
    yield G.fadeIn(30);
    yield G.say('Father Christmas', '...It itches.');
    yield G.say('Michelle', 'It\'s wool. You\'re wool. You match.');
    yield G.say('Father Christmas', '...Ho. Ho. Ho.');
    hw.pop(7 * 16 + 8, 3 * 16 - 30, '*content*', '#f8d850');
    yield G.text('Lily', 'is he gone');
    yield G.text('Nate', 'he\'s wearing a sweater now');
    yield G.text('Lily', 'still no');
    G.play.addTeeth(100);
    G.audio.sfx('tooth');
    yield G.itemGet(G.spr.toothGold, 'Father Christmas hands over {y}100 shark teeth{/} he found in the mine. Nobody asks how.');
    G.audio.sfx('fanfare');
    yield G.banner('POSTGAME CLEAR!', 'thank you for playing', 220);
    yield G.walkTo(m, 20 * 16 + 8, 5 * 16 + 14, 1);
    m.dead = true;
    G.play.autosave();
  };

  // afterward he stands by the brick fireplace in his sweater
  S.fcHome = function* () {
    const f = flags();
    f.fcLine = ((f.fcLine || 0) + 1) % 4;
    if (G.with('lily')) { yield G.say('Lily', 'Don\'t look at him. Don\'t make eye contact.'); return; }
    yield G.say('Father Christmas', [
      'Half a mantel. HALF. ...It\'s a start.',
      'The sweater itches. Don\'t tell Michelle.',
      'When the egg comes back, he gets the LEFT side. The drafty side.',
      'Ho. Ho. Ho. (He seems happy. It\'s hard to tell.)',
    ][f.fcLine]);
  };

  // ================================================================ VAN WICKLE HALL (geology)
  // Prof. Carley, in the main hall: Nate's associate geology professor. He's going to New Zealand
  // with her, a geology study abroad trip, and it's all she can talk about.
  const CARLEY_LINES = [
    'The Southern Alps are some of the fastest-rising mountains on Earth. We\'ll see them up close.',
    'Rotorua smells like rotten eggs. That\'s the sulfur. You\'re going to love it, Nate.',
    'The Alpine Fault runs right up the South Island. You can stand on it. Please don\'t jump on it.',
    'Glaciers that reach almost down to the rainforest. Pack layers. Lots of layers.',
    'Go save your ditch first. I can\'t take you to New Zealand if you\'re worried about a Number Two Ditch.',
  ];
  S.carley = function* () {
    const f = flags();
    if (!f.carleyMet) {
      f.carleyMet = true;
      yield G.say('Prof. Carley', 'Nate! Have you started packing for New Zealand yet?');
      yield G.say('Nate', 'I\'ve been packing since the day I signed up.');
      yield G.say('Prof. Carley', 'Good. We\'ll be right on top of a plate boundary the whole trip: the Pacific and Australian plates, grinding right past each other.');
      yield G.say('Prof. Carley', 'Volcanoes, glaciers, geysers, the Alpine Fault... It\'s going to be the best field trip of your life.');
      yield G.say('Nate', 'I\'m bringing my rock hammer.');
      yield G.say('Prof. Carley', '...We\'ll talk about what you\'re allowed to bring home.');
      return;
    }
    f.carleyLine = ((f.carleyLine || 0) + 1) % CARLEY_LINES.length;
    yield G.say('Prof. Carley', CARLEY_LINES[f.carleyLine]);
  };
  // Nate's favorite building on campus: rocks, minerals, and a rock crusher he
  // has written permission to use.
  const GARDEN = {
    gneiss: ['Banded gneiss from the Reading Prong. Over a billion years old: the oldest rock in the garden.', 'Older than the dinosaurs. Older than the sacred number.'],
    limestone: ['Jacksonburg limestone, from the Ordovician. Gray, a little fizzy if you put acid on it.', 'Nate has put acid on it.'],
    conglomerate: ['Shawangunk conglomerate. Silurian. Quartz pebbles cemented together, hard as nails.', 'The cliffs at the Gunks are made of this. Rock climbers love it. So does Nate.'],
    sandstone: ['Catskill red sandstone. Devonian, the youngest rock in the garden. It\'s red because of the iron in it.', 'Iron oxide. Rust, basically. A rusty rock.'],
  };
  S.rockGarden = (k) => function* () {
    if (!flags().rockGarden) { flags().rockGarden = true; yield G.say(null, 'Van Wickle\'s rock garden: big specimens from all over Eastern Pennsylvania, lined up oldest to youngest.'); }
    for (const line of GARDEN[k]) yield G.say(null, line);
  };
  S.vwCase = (k) => function* () {
    const L = {
      quartz: ['Quartz, amethyst and a big chunk of smoky quartz, laid out on blue felt with tiny labels.', ['Nate', 'I could stare at these for hours. I have.']],
      garnet: ['Garnets: deep red, almost purple, each one a perfect little twelve-sided crystal.', ['Nate', 'Rhombic dodecahedron. My favorite crystal shape to say out loud.']],
      fluor: ['The fluorescent case, under a black light: willemite glowing green, calcite glowing red.', 'From Franklin, New Jersey: the fluorescent mineral capital of the world.'],
      fossil: ['Fossils: a trilobite, a fern frond, an ammonite. Half a billion years old, give or take.', ['Nate', 'Give or take a few million. Geologists round generously.']],
      pyrite: ['Pyrite cubes so perfect they look machined. Fool\'s gold.', ['Nate', 'I am no fool. I have a whole jar of it at home.']],
    }[k];
    for (const l of L) yield Array.isArray(l) ? G.say(l[0], l[1]) : G.say(null, l);
  };
  S.vwRockWall = function* () {
    yield G.say(null, 'The cross-section rock wall: slices of rock from eleven spots around Eastern Pennsylvania, stacked oldest to youngest. 1.2 billion years, about twenty feet long.');
    yield G.say(null, 'Every slice sits the way it did in the ground.');
    yield G.say('Nate', 'Gneiss on the bottom. Then limestone, then the Shawangunk, then the Catskill red beds on top. I could recite it in my sleep.');
    if (G.with('doron')) yield G.say('Doron', 'You DO recite it in your sleep.');
  };
  S.crusher = function* () {
    const f = flags(), w = G.play.world, s = G.state;
    if (!f.crusherIntro) {
      f.crusherIntro = true;
      yield G.say(null, 'The jaw crusher: two steel jaws that chew rocks into gravel. Taped to the front is a permission slip.');
      yield G.say(null, '{d}"Nate is authorized to operate the rock crusher. Please supervise him anyway. - Prof. Sunderlin"{/}');
      yield G.say('Nate', 'I have a permission slip. For the rock crusher. This is the best day of my life.');
      if (G.with('doron')) { yield G.say('Doron', 'Can I put something in it?'); yield G.say('Nate', 'No.'); }
    }
    const hasRocks = G.ROCKS.some((r) => G.rocksHave(r.id) > 0);
    const opts = [], acts = [];
    if (!w.crushed) { opts.push('A field sample'); acts.push('sample'); }
    if (hasRocks) { opts.push('A rock from my collection'); acts.push('mine'); }
    opts.push('Not right now'); acts.push(null);
    if (opts.length === 1) { yield G.say('Nate', 'The field samples are done for today. Next time, bring rocks from Andover.'); return; }
    const c = yield G.ask('Nate', 'What goes in the crusher?', opts);
    if (acts[c] === 'mine') { yield* S.crushCollection(); return; }
    if (acts[c] !== 'sample') return;
    w.crushed = true;
    yield G.say(null, 'Nate grabs a field sample from the bucket, puts on his safety glasses, and drops it in the hopper.');
    yield* G.crushAnim(w);
    const FINDS = [
      [4, 'Just gravel. Very fine, very gray gravel.', 0],
      [3, 'Hidden inside: a pocket of clear quartz crystals!', 5],
      [2, 'Garnets! A little cluster of deep red crystals.', 10],
      [2, 'A fossil: a tiny brachiopod shell, about 400 million years old.', 10],
      [1, 'Pyrite! A perfect gold cube, right in the middle of the rock.', 15],
      [1, 'A GEODE. Hollow, sparkling, purple inside. Nate needs a minute.', 25],
    ];
    let roll = Math.random() * FINDS.reduce((n, x) => n + x[0], 0), find = FINDS[0];
    for (const x of FINDS) { roll -= x[0]; if (roll < 0) { find = x; break; } }
    s.stats.crushed = (s.stats.crushed || 0) + 1;
    yield G.say(null, find[1]);
    if (find[2]) {
      G.play.addTeeth(find[2]);
      G.audio.sfx('tooth');
      yield G.say(null, 'A geology major trades Nate {y}' + G.sayable(find[2]) + ' shark teeth{/} for it on the spot.');
    } else {
      yield G.say('Nate', 'Still worth it.');
    }
  };

  // ================================================================ THE ANDOVER MINES (rock collecting)
  // Nate's favorite place to explore: the old iron mines of Andover, Sussex
  // County, NJ (worked before the Revolution; the Continental Congress ran them
  // for cannonballs and steel). Smash dump piles and mineral veins to collect
  // real specimens; crush them at Van Wickle's jaw crusher for rewards.
  const RARITY = [
    { name: 'Common', color: '#f8f8f0' },
    { name: 'Uncommon', color: '#78e070' },
    { name: 'Rare', color: '#68c8ff' },
    { name: 'Very rare', color: '#c898ff' },
    { name: 'Legendary', color: '#f8d850' },
  ];
  G.RARITY = RARITY;
  // crush: what the jaw crusher turns it into (teeth / eggs / packages / heart / none)
  G.ROCKS = [
    // the Andover mines
    { id: 'hematite', name: 'Hematite', area: 'andover', r: 0, crush: { teeth: 5 }, fact: 'Andover\'s red iron ore: the biggest hematite deposit in New Jersey. Scratch it on tile and the streak is reddish brown.' },
    { id: 'magnetite', name: 'Magnetite', area: 'andover', r: 0, crush: { teeth: 5 }, fact: 'Black iron ore that sticks to a magnet. Andover and Sulphur Hill shipped as much as 400,000 tons of iron ore.' },
    { id: 'calcite', name: 'Calcite', area: 'andover', r: 0, crush: { eggs: 12 }, fact: 'Soft and milky white, and it fizzes in acid. It came up with the ore. Crushed, it\'s calcium grit for laying hens.' },
    { id: 'marble', name: 'Franklin Marble', area: 'andover', r: 0, crush: { teeth: 5 }, fact: 'The white, sugary marble of the New Jersey Highlands, over a billion years old. The iron ore formed in rock like this.' },
    { id: 'quartz', name: 'Quartz', area: 'andover', r: 0, crush: { teeth: 5 }, fact: 'Clear six-sided crystals. Hardness 7: it scratches glass. Found almost everywhere, loved anyway.' },
    { id: 'jasper', name: 'Jasper', area: 'andover', r: 1, crush: { teeth: 10 }, fact: 'Opaque red quartz, colored by iron. Old reports list jasper right alongside Andover\'s ore.' },
    { id: 'garnet', name: 'Garnet', area: 'andover', r: 1, crush: { teeth: 15 }, fact: 'Little red-brown twelve-sided crystals. Garnet has been recorded at the Andover Iron Mine.' },
    { id: 'pyrite', name: 'Pyrite', area: 'andover', r: 1, crush: { package: 2 }, fact: 'Fool\'s gold. Strike it with steel and it sparks. Sulphur Hill next door was named for its sulfur-rich ore.' },
    { id: 'slag', name: 'Furnace Slag', area: 'andover', r: 1, crush: { teeth: 10 }, fact: 'Glassy blue-green waste from the old Andover iron furnace, first fired in the 1760s. Not a mineral, but a piece of history.' },
    { id: 'sphalerite', name: 'Sphalerite', area: 'andover', r: 2, crush: { teeth: 20 }, fact: 'Dark, resinous zinc ore. Zinc sulfides turn up mixed with the iron in Andover\'s lower workings, including a vein with copper inclusions.' },
    { id: 'galena', name: 'Galena', area: 'andover', r: 2, crush: { teeth: 20 }, fact: 'Silvery lead ore that breaks into perfect cubes, and it\'s HEAVY. Lead sulfides show up in the lower workings too.' },
    { id: 'chalcopyrite', name: 'Chalcopyrite', area: 'andover', r: 2, crush: { teeth: 25 }, fact: 'Brassy copper ore that tarnishes peacock blue and purple. Early-1940s prospectors came to Andover looking for copper.' },
    { id: 'specular', name: 'Specular Hematite', area: 'andover', r: 3, crush: { teeth: 40 }, fact: 'Hematite in glittering mirror-bright plates. In the lantern light it sparkles like a night sky.' },
    { id: 'lodestone', name: 'Lodestone', area: 'andover', r: 3, crush: { heart: 1 }, fact: 'Magnetite that\'s a natural magnet. Iron filings bristle off it. People used lodestones as the first compasses.' },
    { id: 'cannonball', name: 'Continental Cannonball', area: 'andover', r: 4, crush: null, fact: 'An iron cannonball, maybe cast from Andover ore when the Continental Congress ran the mine for the American army. It belongs in a museum. Nate is the museum.' },
    // Lafayette (College Hill, Easton PA)
    { id: 'dolomite', area: 'lafayette', name: 'Allentown Dolomite', r: 0, crush: { teeth: 5 }, how: 'Dr. Nataro left a tray of gray rocks in the Science Center. Only one of them is dolomite.', fact: 'The most common bedrock in the Lehigh Valley: dolostone from a warm, shallow sea about 500 million years ago.' },
    { id: 'gneiss', area: 'lafayette', name: 'The Nicest Gneiss', r: 1, crush: { teeth: 15 }, how: 'Prof. Sunderlin gives one out for a right answer.', fact: 'Banded Precambrian gneiss of the Reading Prong, over a billion years old. Easton\'s arts trail has a sign about it called "The Nicest Gneiss."' },
    { id: 'stromatolite', area: 'lafayette', name: 'Stromatolite', r: 2, crush: { teeth: 30 }, how: 'Something big and strong could crack the dolomite ledge.', fact: 'Fossil mats of ancient microbes, layered like a cabbage, from the Allentown Formation. Some of the oldest life you can hold.' },
    // Easton (the fairgrounds)
    { id: 'cementrock', area: 'easton', name: 'Cement Rock', r: 0, crush: { teeth: 5 }, how: 'Top prize at the balloon game. Nobody can pop those balloons. Not with darts, anyway.', fact: 'Shaly limestone from the Jacksonburg Formation. The Lehigh Valley ground it into Portland cement and was once the cement capital of America.' },
    { id: 'serpentine', area: 'easton', name: 'Serpentine', r: 1, crush: { package: 2 }, how: 'That pile of old quarry rubble is too solid to hammer. Maybe something explosive?', fact: 'Green "verdolite" from the Chestnut Hill quarries in Easton, cut for ornamental stone. Smooth, waxy and mottled like a snake.' },
    { id: 'eastonite', area: 'easton', name: 'Eastonite', r: 2, crush: { teeth: 30 }, how: 'Grandma Rose would trade for a funnel cake. It costs the sacred number, and Nate can\'t say it.', fact: 'A mica named after Easton itself, found in the Chestnut Hill quarry. Collectors still find it there.' },
    { id: 'cavepearl', area: 'easton', name: 'Cave Pearl', r: 3, crush: { teeth: 40 }, how: 'The protesters won\'t let anybody down the trail to the little cave. Something would have to really startle them.', fact: 'Calcite that grew layer by layer around a grain of sand in a dripping cave pool, rolled smooth like a pearl. The limestone under the Lehigh Valley is full of caves.' },
    // Bedminster (home)
    { id: 'shale', area: 'bedminster', name: 'Passaic Red Shale', r: 0, crush: { teeth: 5 }, how: 'Red rock out on the little island in Brady Brook. If only the water would hold still.', fact: 'Red mud from the Newark Basin, Triassic and Jurassic. Dinosaurs left footprints in mud like this all over New Jersey.' },
    { id: 'basalt', area: 'bedminster', name: 'Watchung Basalt', r: 1, crush: { teeth: 15 }, how: 'The big black boulder by Brady Brook is way too heavy for Nate. Doron, though...', fact: 'Jurassic lava flows that built the Watchung Mountains just east of Bedminster.' },
    { id: 'megalodon', area: 'bay', name: 'Megalodon Tooth', r: 4, crush: null, how: 'A patch of gravel and shell on the island between the two tunnels. Too fine to pick through by hand.', fact: 'A fossil tooth from Otodus megalodon, a giant shark that lived millions of years ago. Fossil shark teeth turn up all over the Chesapeake Bay region.' },
    { id: 'chesapecten', area: 'chesapeake', name: 'Chesapecten Fossil', r: 3, crush: null, how: 'Anette, Abe and Hannah\'s neighbor, has one. Her plants look awfully thirsty.', fact: 'Chesapecten jeffersonius: a fossil scallop millions of years old, named for the Chesapeake Bay and Thomas Jefferson. It\'s the state fossil of Virginia, and back in 1687 it became the first fossil from North America ever pictured in a science book.' },
    { id: 'fairystone', area: 'chesapeake', name: 'Fairy Stone', r: 2, crush: null, how: 'Ruby, a girl on the CHKD ward, has two. She\'ll trade one for a rock from somewhere far away.', fact: 'Staurolite: brown crystals that grow twinned into little crosses. Virginia has a whole state park named for them, Fairy Stone State Park. The legend says they\'re fairy tears, turned to stone.' },
    { id: 'prehnite', area: 'bedminster', name: 'Prehnite', r: 2, crush: { heart: 1 }, how: 'The gravel bar in Brady Brook. You\'d need a sifting screen.', fact: 'Pale green crystals that grow in the gas bubbles of New Jersey basalt. Mindat lists prehnite in Bedminster Township.' },
  ];
  G.rockById = (id) => G.ROCKS.find((r) => r.id === id);
  G.ROCK_AREAS = [
    { id: 'andover', name: 'ANDOVER MINES' },
    { id: 'lafayette', name: 'LAFAYETTE' },
    { id: 'easton', name: 'EASTON FAIR' },
    { id: 'bedminster', name: 'BEDMINSTER' },
    { id: 'bay', name: 'THE BAY' },
    { id: 'chesapeake', name: 'CHESAPEAKE' },
  ];
  const rockState = () => { const s = G.state; s.rocks = s.rocks || {}; s.rocksFound = s.rocksFound || {}; return s; };
  G.rocksFound = () => G.ROCKS.filter((r) => rockState().rocksFound[r.id]).length;
  G.rocksHave = (id) => rockState().rocks[id] || 0;

  // what each spot can hold (weights): dump piles and the slag heap outside,
  // the tunnels, and the lower workings (where the sulfides are)
  const ROCK_ZONES = {
    dump: [['hematite', 30], ['magnetite', 24], ['calcite', 16], ['marble', 14], ['quartz', 12], ['jasper', 7], ['garnet', 3]],
    slag: [['slag', 60], ['hematite', 15], ['quartz', 10], ['jasper', 8], ['magnetite', 7]],
    tunnel: [['hematite', 20], ['magnetite', 20], ['quartz', 10], ['calcite', 8], ['jasper', 11], ['garnet', 12], ['pyrite', 11], ['specular', 4], ['lodestone', 1]],
    deep: [['pyrite', 12], ['sphalerite', 15], ['galena', 12], ['chalcopyrite', 10], ['garnet', 9], ['specular', 7], ['lodestone', 3], ['magnetite', 8], ['hematite', 8]],
    cannon: [['cannonball', 1]],
    bed: [['shale', 1]],
  };
  // Break a vein: roll a specimen, add it, and announce it.
  G.rockFind = (zone, x, y) => {
    const table = ROCK_ZONES[zone] || ROCK_ZONES.dump;
    let roll = Math.random() * table.reduce((n, e) => n + e[1], 0), id = table[0][0];
    for (const [k, wgt] of table) { roll -= wgt; if (roll < 0) { id = k; break; } }
    if (zone === 'cannon') flags().cannonball = true;
    G.rockGain(id, x, y);
  };
  // Add one specimen: new or rare finds get the fanfare, the rest just a pop.
  G.rockGain = (id, x, y) => {
    const s = rockState(), rock = G.rockById(id), isNew = !s.rocksFound[id];
    s.rocks[id] = (s.rocks[id] || 0) + 1;
    s.rocksFound[id] = (s.rocksFound[id] || 0) + 1;
    const w = G.play.world;
    if (isNew || rock.r >= 2) G.script.run(S.rockNew(id, isNew));
    else { G.audio.sfx('tooth'); w.pop(x, y - 30, '+1 ' + rock.name, RARITY[rock.r].color); }
    return isNew;
  };
  // Inside a script: add one and announce it right there.
  S.rockGive = function* (id) {
    const s = rockState(), isNew = !s.rocksFound[id];
    s.rocks[id] = (s.rocks[id] || 0) + 1;
    s.rocksFound[id] = (s.rocksFound[id] || 0) + 1;
    yield* S.rockNew(id, isNew);
  };
  S.rockNew = function* (id, isNew) {
    const rock = G.rockById(id), rar = RARITY[rock.r];
    yield G.itemGet(G.spr.rockIcons[id], (isNew ? 'NEW! ' : '') + 'You found {y}' + rock.name + '{/}! (' + rar.name + ')');
    if (isNew) yield G.say(null, rock.fact);
    if (isNew && rock.r >= 3) yield G.say('Nate', rock.r === 4 ? 'This is the greatest moment of my life. Again.' : 'I have READ about these. In MULTIPLE books.');
    if (isNew && G.rocksFound() === G.ROCKS.length && !flags().rockHound) {
      flags().rockHound = true;
      G.audio.sfx('fanfare');
      yield G.banner('ROCK HOUND!', 'every rock, every area', 170);
      G.play.addTeeth(50);
      yield G.say('Nate', 'Every single rock. I need a bigger shelf.');
      yield G.say(null, 'Nate gets {y}50 shark teeth{/} for completing the collection.');
    }
  };

  // ================================================================ PHOTOS (collectables)
  // Old family photos hidden around the world. Each one is a little picture file in
  // assets/photos (shrunk to fit the screen), shown in COLLECTABLES > Photos.
  G.PHOTOS = [
    {
      id: 'nateSchool', name: 'Picture Day', place: 'Home', file: 'assets/photos/nate-school.png',
      how: 'Somewhere at home, where families stick the good pictures.',
      caption: 'Nate\'s old school picture: the navy striped polo, the big grin, and a strange look in his eye. Mom asked Dad not to send it to anyone.',
    },
    {
      id: 'dadAndTom', name: 'Dad and Tom', place: 'Tom\'s Pizza', file: 'assets/photos/dad-and-tom.png',
      how: 'Hanging on the wall of a pizza place.',
      caption: 'Dad and Tom at the original Tom\'s Pizza in Union, NJ. The whole family calls in orders just to hear Tom pick up the phone: "TOM\'S PIZZA!"',
    },
    {
      id: 'atticSelfie', name: 'Backyard Selfie', place: 'Home', file: 'assets/photos/attic-selfie.png',
      how: 'In a shoebox in the attic. You\'d need somebody really tall to get up there.',
      caption: 'A selfie in the backyard, taken mid-spin. The trees are a blur. One face says "I am cool." The other says "I did not agree to this picture."',
    },
  ];
  for (const ph of G.PHOTOS) { ph.img = new Image(); ph.img.src = ph.file; }
  const photoState = () => (G.state.photos = G.state.photos || {});
  G.photoHas = (id) => !!photoState()[id];
  G.photosFound = () => G.PHOTOS.filter((ph) => G.photoHas(ph.id)).length;
  // Inside a script: add a photo, announce it, and show it full screen.
  S.photoGive = function* (id) {
    const ph = G.PHOTOS.find((q) => q.id === id), isNew = !G.photoHas(id);
    photoState()[id] = 1;
    yield G.itemGet(G.photoIcon(ph), (isNew ? 'NEW PHOTO! ' : '') + '{y}' + ph.name + '{/}');
    yield G.noteView([G.photoPage(ph)], 'Z: put it away');
    if (isNew && !flags().photoTip) { flags().photoTip = true; yield G.say(null, 'Photos go in {y}COLLECTABLES{/} in the menu.'); }
  };

  // A choice from a long list, seven at a time. Returns the index, or -1.
  function* pickFrom(name, text, labels) {
    for (let start = 0; ;) {
      const page = labels.slice(start, start + 7), more = start + 7 < labels.length;
      const c = yield G.ask(name, text, page.concat(more ? ['More...', 'Never mind'] : ['Never mind']));
      if (c < page.length) return start + c;
      if (more && c === page.length) { start += 7; continue; }
      return -1;
    }
  }

  // ---- rocks around Lafayette, the fairgrounds and home: some take more than a hammer
  // A rock too heavy for Nate. With Doron along, he heaves it up and slams it open.
  // Cutscene walks go straight through walls, so pick a standing spot that's
  // actually open (the first of these that fits), or Nate can end up in a tree.
  function openSpot(w, ent, spots) {
    for (const [x, y] of spots) if (!w.blocked(ent.boxAt(x, y), ent)) return [x, y];
    return spots[0];
  }
  S.bigRockLift = function* (rock) {
    const w = G.play.world, p = P(), basalt = rock.kind === 'basalt';
    const d = w.ents.find((e) => e instanceof G.Follower && e.id === 'doron' && !e.dead);
    if (rock.done) { yield G.say('Nate', 'Split clean open. Doron says he\'ll do another one next time we\'re here.'); return; }
    if (!d) {
      yield G.say('Nate', basalt ? 'A huge black basalt boulder, washed down Brady Brook. It weighs about a ton.' : 'A thick dolomite ledge with wavy layers all through it. Fossils, maybe. Way too thick to hammer.');
      yield G.say('Nate', 'I need somebody really strong. Somebody who suplexes rocks for breakfast.');
      return;
    }
    yield G.say('Nate', basalt ? 'Doron. Can you lift that?' : 'Doron. See those wavy layers? I need to get inside that ledge.');
    yield G.say('Doron', basalt ? 'Can I lift it. CAN I LIFT IT.' : 'Say no more.');
    d.hold = true;
    // Nate steps off to the side (whichever side is clear), Doron squares up in front
    const [nx, ny] = openSpot(w, p, [[rock.x - 40, rock.y + 16], [rock.x + 40, rock.y + 16], [rock.x - 32, rock.y + 2], [rock.x + 32, rock.y + 2], [rock.x - 24, rock.y + 30], [rock.x + 24, rock.y + 30]]);
    yield G.walkTo(p, nx, ny, 1.2);
    p.dir = nx < rock.x ? 'right' : 'left';
    const [dx, dy] = openSpot(w, d, [[rock.x, rock.y + 16], [rock.x - 10, rock.y + 16], [rock.x + 10, rock.y + 16], [rock.x, rock.y + 24]]);
    yield G.walkTo(d, dx, dy, 1.2);
    d.dir = 'up';
    yield { start() { G.audio.sfx('dash'); }, update() { rock.lift += 1; G.play.shake(2, 1); return rock.lift >= 30; } };
    yield G.say('Doron', basalt ? 'HUP!' : 'ARMY...');
    yield { update() { rock.lift = Math.max(0, rock.lift - 6); return rock.lift <= 0; } };
    rock.done = true;
    G.audio.sfx('boom');
    G.play.shake(24, 4);
    w.burst(rock.x, rock.y - 10, basalt ? ['#2e2e34', '#46464e', '#5a5a64'] : ['#8a8c90', '#a8aaae', '#c0c2c6'], 20, { speed: 2, up: 1.2, g: 0.1, life: 36, size: 3 });
    yield G.wait(30);
    yield G.say('Doron', basalt ? 'Rock. Meet ground.' : '...SPLIT!');
    d.hold = false;
    yield* S.rockGive(basalt ? 'basalt' : 'stromatolite');
    if (!basalt && G.rocksHave('stromatolite') === 1) yield G.say('Nate', 'Doron. You just cracked open half a billion years.');
    if (!basalt && G.rocksHave('stromatolite') === 1) yield G.say('Doron', 'It had it coming.');
  };

  // Sifting the gravel bar in Brady Brook (once a visit). Prehnite washes out of
  // the basalt upstream; it turns up for sure by the third try.
  // (direct: Nate is already sifting with X, so no question first)
  S.brookSift = function* (direct) {
    const w = G.play.world, f = flags();
    if (w.sifted) { yield G.say('Nate', 'I\'ve sifted this gravel bar down to sand. The brook will bring more.'); return; }
    if (!G.itemHas('sifter')) {
      yield G.say(null, 'A gravel bar in Brady Brook: red shale, black basalt, a little quartz.');
      yield G.say('Nate', 'Anything good in here is too small to pick out by hand. I need a sifting screen.');
      return;
    }
    if (!direct) {
      const c = yield G.ask(null, 'A gravel bar in Brady Brook: red shale, black basalt, a little quartz.', ['Sift through it', 'Leave it']);
      if (c) return;
    }
    w.sifted = true;
    yield G.say(null, 'Nate shakes scoop after scoop of cold, wet gravel through Tyler\'s sifter...');
    G.audio.sfx('slip');
    yield G.wait(30);
    f.siftTries = (f.siftTries || 0) + 1;
    const roll = Math.random();
    if (roll < 0.3 || (f.siftTries >= 3 && !G.rocksHave('prehnite') && !(G.state.rocksFound || {}).prehnite)) {
      yield* S.rockGive('prehnite');
      if (G.rocksHave('prehnite') === 1) yield G.say('Nate', 'Prehnite! It grows in the gas bubbles inside basalt. This came all the way down the brook.');
    } else {
      yield G.say(null, ['Just pebbles. And a crawfish. He seems upset about it.', 'Just pebbles. Nice ones, but pebbles.', 'A bottle cap, three pebbles and a very cold hand.'][Math.floor(roll * 10) % 3]);
    }
  };

  // Prof. Sunderlin's pop quiz (once a visit): a right answer earns a piece of gneiss.
  const PROF_QUIZ = [
    { q: 'Which mineral is harder?', opts: ['Calcite', 'Quartz'], right: 1, why: 'Quartz is a 7 on the Mohs scale. Calcite is a 3. Quartz scratches glass.' },
    { q: 'Gneiss forms from...', opts: ['Cooling lava', 'Heat and pressure', 'River sand'], right: 1, why: 'Gneiss is metamorphic: cooked and squeezed deep underground.' },
    { q: 'Which mineral fizzes in acid?', opts: ['Galena', 'Quartz', 'Calcite'], right: 2, why: 'Calcite is calcium carbonate. Acid makes it bubble.' },
    { q: 'Basalt is what kind of rock?', opts: ['Igneous', 'Sedimentary', 'Metamorphic'], right: 0, why: 'Igneous: it cooled from lava.' },
    { q: 'What is fool\'s gold?', opts: ['Mica', 'Pyrite', 'Galena'], right: 1, why: 'Pyrite. Brassy, cubic, and it sparks.' },
    { q: 'Scratch hematite on tile. The streak is...', opts: ['Reddish brown', 'Black', 'White'], right: 0, why: 'Reddish brown, like rust. Magnetite is the one with the black streak.' },
  ];
  S.profQuiz = function* () {
    const w = G.play.world;
    if (w.profQuizzed) { yield G.say('Prof. Sunderlin', 'Remember: every rock tells a story. Most of them are about pressure.'); return; }
    const c = yield G.ask('Prof. Sunderlin', 'Pop quiz, Nate! Get it right and you get a rock from my office.', ['Bring it on', 'Not now']);
    if (c) return;
    w.profQuizzed = true;
    const q = PROF_QUIZ[Math.floor(Math.random() * PROF_QUIZ.length)];
    const a = yield G.ask('Prof. Sunderlin', q.q, q.opts);
    if (a !== q.right) {
      yield G.say('Prof. Sunderlin', 'Ooh. No. ' + q.why);
      yield G.say('Prof. Sunderlin', 'Come back later and I\'ll give you another one.');
      return;
    }
    yield G.say('Prof. Sunderlin', 'Correct! ' + q.why);
    yield G.say('Prof. Sunderlin', 'Here: the nicest gneiss in my collection. Get it? NICE. GNEISS.');
    yield* S.rockGive('gneiss');
  };

  // Grandma Rose trades her eastonite for three pieces of cement rock.
  S.roseTrade = function* () {
    const f = flags(), s = G.state;
    if (!f.roseRocks) {
      f.roseRocks = true;
      yield G.say('Grandma Rose', 'Is that a rock hammer, dear? I collect rocks too. Have since I was a girl.');
      yield G.say('Grandma Rose', 'I have a piece of eastonite in my purse. Named after this very town. I\'d trade it for one thing.');
      yield G.say('Grandma Rose', 'A funnel cake. I can\'t stand in that line, and I can\'t bring myself to SAY that price out loud.');
      if (!s.items.funnelCake) return;
    }
    if (!s.items.funnelCake) { yield G.say('Grandma Rose', 'A funnel cake, dear. From the stand by the path. Powdered sugar, please.'); return; }
    s.items.funnelCake = false;
    f.roseTraded = true;
    yield G.say('Grandma Rose', 'Oh, it\'s still WARM. You\'re a good boy.');
    yield G.say('Grandma Rose', 'I found this in the old quarry up on Chestnut Hill when I was your age. Take good care of it.');
    yield* S.rockGive('eastonite');
  };

  // ---- the jaw crusher takes specimens from the collection too
  function* crushAnim(w) {
    const cx = 2 * 16 + 16, cy = 3 * 16 + 8;
    yield {
      start() { this.t = 0; },
      update() {
        this.t++;
        if (this.t % 7 === 0) { G.audio.sfx('clank'); w.burst(cx, cy, ['#8a8a90', '#c8c0b0', '#5a5a62', '#a85a48'], 4, { speed: 1.1, up: 0.8, g: 0.1, life: 22, size: 2 }); }
        G.play.shake(2, 1);
        if (this.t === 21) w.pop(cx, cy - 24, 'CRUNCH!', '#ffffff');
        if (this.t === 42) w.pop(cx, cy - 24, 'GRIND!', '#ffffff');
        return this.t >= 60;
      },
    };
  }
  G.crushAnim = crushAnim;
  S.crushCollection = function* () {
    const s = rockState(), w = G.play.world;
    const owned = G.ROCKS.filter((r) => s.rocks[r.id] > 0);
    if (!owned.length) { yield G.say('Nate', 'I don\'t have any rocks on me. Time for a trip to Andover.'); return; }
    const tiers = [...new Set(owned.map((r) => r.r))].sort();
    let pick;
    if (owned.length <= 6) pick = owned;
    else {
      const t = yield G.ask('Nate', 'Which rocks?', tiers.map((r) => RARITY[r].name).concat('Never mind'));
      if (t >= tiers.length) return;
      pick = owned.filter((r) => r.r === tiers[t]);
    }
    const c = yield* pickFrom('Nate', 'Crush which one?', pick.map((r) => r.name + ' x' + G.sayable(s.rocks[r.id])));
    if (c < 0) return;
    const rock = pick[c];
    if (!rock.crush) {
      yield G.say('Nate', rock.id === 'cannonball' ? 'Crush a Continental Army cannonball?! Absolutely not. This goes on my shelf.'
        : rock.id === 'fairystone' ? 'Crush Ruby\'s fairy stone?! Absolutely not. She trusted me with this.'
          : 'Crush my ' + rock.name.toLowerCase() + '?! Absolutely not. This goes on my shelf.');
      return;
    }
    s.rocks[rock.id]--;
    yield G.say(null, 'Nate drops the ' + rock.name.toLowerCase() + ' in the hopper.');
    yield* crushAnim(w);
    const g = rock.crush;
    if (g.teeth) { G.play.addTeeth(g.teeth); G.audio.sfx('tooth'); yield G.say(null, 'Crushed ' + rock.name.toLowerCase() + ' sells to the rock shop: {y}+' + G.sayable(g.teeth) + ' shark teeth{/}.'); }
    if (g.eggs) {
      if (s.items.chicken) { s.items.eggs = Math.min(40, (s.items.eggs || 0) + g.eggs); yield G.itemGet(G.spr.egg, 'Calcium grit for Henrietta! She lays {y}a dozen eggs{/} on the spot.'); }
      else { G.play.addTeeth(5); yield G.say(null, 'Calcite grit. Nobody needs it yet, so Nate sells it: {y}+5 shark teeth{/}.'); }
    }
    if (g.package) {
      s.items.package = Math.min(10, (s.items.package || 0) + g.package);
      yield G.itemGet(G.spr.gift, rock.id === 'pyrite' ? 'Pyrite sparks! Nate rigs {y}2 Booby-Trapped Packages{/}.' : 'Nate packs the ' + rock.name.toLowerCase() + ' grit into boxes with fuses: {y}2 Booby-Trapped Packages{/}.');
    }
    if (g.heart) {
      s.maxHp += 2; s.hp = s.maxHp;
      yield G.itemGet(G.spr.heartBig, rock.id === 'lodestone' ? 'The lodestone crumbles into magnetic filings. Nate feels... drawn to adventure. {r}Heart Container!{/}' : 'The ' + rock.name.toLowerCase() + ' crumbles into glittering green sand. Nate feels brand new. {r}Heart Container!{/}');
    }
  };

  // ---- getting there: the "Where to?" menu at either end of the road
  S.driveAndover = function* () {
    const f = flags();
    if (!G.state.items.andoverKey) {
      f.andoverLocked = true;
      yield G.say('Nate', 'The old Andover mines. I\'ve read every book about them. But they\'re on private land, behind a locked gate.');
      if (f.shopOpen) yield G.say('Nate', 'Mom knows everybody at church. Maybe she can get me a key. Her flower stand has everything else.');
      else yield G.say('Nate', 'I need a key to that gate. Mom knows everybody at church. One of them HAS to own it.');
      return;
    }
    yield G.say('Nate', 'Andover. Key in hand. Helmet... somewhere.');
    G.play.warp('andover', 27, 15, 'left');
  };
  S.andoverCar = function* () {
    const c = yield G.ask('Nate', 'Head home?', ['Head home', 'Keep exploring']);
    if (c === 0) G.play.warp('home', 1, 53, 'right');
  };

  // ================================================================ ADMIN MODE (testing)
  // Story checkpoints in play order. Starting one applies every checkpoint up to
  // it (flags, items, party), then drops Nate at its spot. Admin runs never save.
  G.ADMIN_CHECKPOINTS = [
    { name: 'Nate\'s lab (new game)', map: 'lab', at: [3, 3, 'up'], fresh: true },
    { name: 'Lafayette campus', map: 'campus', at: [6, 7, 'down'], flags: { readChat: true, phoneBuzz: true }, items: { hammer: true } },
    { name: 'Hat back: fair road open', map: 'campus', at: [34, 12, 'right'], flags: { boulderSeen: true, boulderHitOnce: true, capQuest: true, capDone: true, capHeart: true, sixIntro: true }, items: { cap: true }, maxHp: 8 },
    { name: 'Easton Fairgrounds', map: 'fair', at: [1, 12, 'right'], flags: { doronChat: true } },
    { name: 'Main event: El EEENGLISH', map: 'arena', at: [11, 15, 'up'], flags: { doronDeal: true, ticketQuest: true }, items: { package: 5, tickets: 4 } },
    { name: 'Doron\'s fight night (Expo Hall locker room)', map: 'locker', at: [7, 2, 'up'], flags: { mainEvent: true, dadBeaten: true, signal_peace: true }, items: { pipe: true, tickets: 0 }, party: ['doron'], follower: 'doron' },
    { name: 'Boulder: Doron\'s suplex', map: 'campus', at: [20, 25, 'down'], flags: { mainEvent: true, dadBeaten: true, signal_peace: true }, items: { pipe: true, tickets: 0 }, party: ['doron'], follower: 'doron' },
    { name: 'Arrive home', map: 'home', at: [1, 53, 'right'], flags: { boulderGone: true } },
    { name: 'Badlands Chugs (kitchen)', map: 'homeDown', at: [20, 15, 'up'], flags: { homeArrived: true, mikeyMet: true } },
    { name: 'Refrigerator game', map: 'homeDown', at: [29, 4, 'right'], flags: { badlandsMet: true, heardBlender: true, fridgeGame: true }, items: { milk: true, dye: true, smoke: true, vodka: true } },
    { name: 'Golden Hour: play as Lily', map: 'home', at: [43, 44, 'down'], flags: { badlandsBeaten: true, lilySaved: true }, party: ['lily'], follower: 'lily' },
    { name: 'Michelle in the garden', map: 'home', at: [33, 25, 'up'], flags: { mikeyBeaten: true }, items: { mikeyNote: true } },
    { name: 'Mom\'s books: clue hunt', map: 'homeDown', at: [38, 4, 'up'], flags: { michelleMet: true, booksQuest: true } },
    { name: 'Basement: Globglogabgalab', map: 'homeDown', at: [22, 8, 'up'], flags: { clue_den: true, clue_nightstand: true, clue_mudroom: true, cluesDone: true, momReport: true }, items: { basementKey: true, earplugs: true, bait: true } },
    { name: 'Return Mom\'s books (shop)', map: 'home', at: [34, 20, 'left'], flags: { globMet: true, globBeaten: true, baitPlaced: true, basementOpened: true }, items: { books: true, bait: false } },
    { name: 'Dad\'s snacks (workshop)', map: 'garage', at: [10, 10, 'up'], flags: { shopOpen: true }, items: { books: false }, teeth: 120 },
    { name: 'Ice JJ Fish (north)', map: 'north', at: [10, 13, 'up'], flags: { snackQuest: true, snacksDone: true, momDenied: true, jjGig: true } },
    { name: 'Everything done (free roam)', map: 'home', at: [42, 38, 'down'], flags: { jjMet: true, jjBeaten: true, signal_icy: true, signal_jlc: true, momHeart: true, phDone: true, chemMet: true, chemPassed: true, chemPerfect: true, engMet: true, engPassed: true, engPerfect: true, ticketQuest: true, ticketsGiven: true, ticketsDone: true, protestReward: true }, items: { chicken: true, eggs: 40, bass: true, doosh: 3, package: 10, tickets: 0, andoverKey: true }, maxHp: 10, teeth: 300 },
    { name: 'Dad\'s pipe bench (workshop)', map: 'garage', at: [10, 10, 'up'] },
    { name: 'Bay Bridge-Tunnel: the toll plaza', map: 'cbbtToll', at: [17, 13, 'left'], teeth: 520 },
    { name: 'The Two-Liter (Chesapeake Channel Tunnel)', map: 'chesTunnel', at: [7, 26, 'up'], flags: { cbbtArrived: true, tollMet: true, chesSeen: true }, items: { rod: true } },
    { name: 'Tyler (in the tunnel)', map: 'cbbtTunnel', at: [7, 9, 'up'], flags: { popBeaten: true, midSeen: true, cbbtArrived: true, tunnelSeen: true, hoodedMet: true, tollPaid: true, tylerMet: true, rodQuest: true }, items: { rod: true }, teeth: 20 },
    { name: 'Chesapeake: Abe & Hannah\'s', map: 'condo', at: [55, 1, 'down'], flags: { tylerBeaten: true } },
    { name: 'Romulus: hide and seek outside', map: 'condo', at: [24, 20, 'down'], flags: { condoArrived: true, condoScare: true, romulusMet: true, romHide: 4 }, items: { bidet: true } },
    { name: 'El Toro Loco: Romulus\'s sloth', map: 'toroLoco', at: [11, 8, 'up'], flags: { romHide: 8, romToGolf: true, slothQuest: 1 } },
    { name: 'Romulus (the golf course)', map: 'golf', at: [20, 26, 'up'], flags: { slothQuest: 4, ladyMet: true, bassGiven: true, romGap: true }, items: { abeBass: true, yellowCable: true, sloth: true } },
    { name: 'Abe joined: his reach', map: 'condo', at: [16, 13, 'right'], flags: { romulusBeaten: true }, party: ['abe'], follower: 'abe' },
    { name: 'Jamming with Abe (condo office)', map: 'condoUp', at: [22, 17, 'down'], flags: { plantQuest: true, plantsDone: true, gardenOpen: true } },
    { name: 'CHKD: the lobby', map: 'chkdLobby', at: [11, 12, 'up'], flags: { healerTalk: true, chkdArrived: true } },
    { name: 'CHKD: MECHA-BABY (NICU)', map: 'chkdNicu', at: [7, 9, 'up'], flags: { chkdLobby: true, chkdWard: true, badgeUsed: true }, items: { badge: true } },
    { name: 'CHKD: Hannah joined (to the roof)', map: 'chkdNicu', at: [7, 8, 'down'], flags: { mobileBeaten: true, kitGot: true }, party: ['hannah'], follower: 'hannah', items: { firstAid: 3 }, maxHp: 12 },
    { name: 'CHKD: Hannah\'s shift (Charge Nurse Dot)', map: 'chkdNicu', at: [5, 8, 'up'], flags: { mobileBeaten: true, kitGot: true }, party: ['hannah'], follower: 'hannah', items: { firstAid: 3 }, maxHp: 12 },
    { name: 'FINALE: the Number One Ditch', map: 'ditchFinal', at: [7, 17, 'up'], flags: { mobileBeaten: true, roofSeen: true }, party: ['abe', 'hannah'], items: { pipe: true, hammer: true }, maxHp: 12 },
    { name: 'FINALE: Romulus (possessed)', map: 'ditchFinal', at: [7, 13, 'up'], flags: { fin_intro: true, fin_freed: 5, signal_crack: true } },
    { name: 'FINALE: Eggmas, the relay', map: 'ditchFinal', at: [7, 13, 'up'], flags: { fin_freed: 7, fin_relay: 0 } },
    { name: 'FINALE: Romulus\'s turn', map: 'ditchFinal', at: [7, 13, 'up'], flags: { fin_relay: 5 } },
    { name: 'FINALE: Nate\'s turn', map: 'ditchFinal', at: [7, 13, 'up'], flags: { fin_relay: 7 } },
    { name: 'Father Christmas (postgame)', map: 'andoverMine', at: [25, 15, 'right'], flags: { cbbtArrived: true, tunnelSeen: true, hoodedMet: true, tollPaid: true, tylerMet: true, tylerBeaten: true, rockHound: true, fcAwake: true }, rocks: true, teeth: 520 },
  ];
  // Places the admin menu can warp to (with whatever the story state is).
  G.ADMIN_PLACES = [
    { name: 'Nate\'s lab', map: 'lab', at: [3, 4, 'down'] },
    { name: 'Lafayette campus', map: 'campus', at: [20, 10, 'down'] },
    { name: 'Science Center', map: 'science', at: [7, 8, 'up'] },
    { name: 'College Hill', map: 'collegeHill', at: [16, 7, 'up'] },
    { name: 'Tom\'s Pizza', map: 'toms', at: [6, 8, 'up'] },
    { name: 'Pardee Hall (EEENGLISH)', map: 'pardee', at: [7, 8, 'up'] },
    { name: 'Van Wickle Hall (geology)', map: 'geology', at: [10, 12, 'up'] },
    { name: 'Easton Fairgrounds', map: 'fair', at: [9, 12, 'down'] },
    { name: 'Expo Hall', map: 'arena', at: [11, 15, 'up'] },
    { name: 'The cave under the fair', map: 'fairCave', at: [7, 2, 'down'] },
    { name: 'Home: the yard', map: 'home', at: [42, 38, 'down'] },
    { name: 'Home: downstairs', map: 'homeDown', at: [20, 15, 'up'] },
    { name: 'Home: upstairs', map: 'homeUp', at: [13, 12, 'down'] },
    { name: 'Dad\'s workshop', map: 'garage', at: [10, 10, 'up'] },
    { name: 'The basement', map: 'basement', at: [18, 6, 'down'] },
    { name: 'The frozen pond', map: 'north', at: [10, 13, 'up'] },
    { name: 'Andover mines (outside)', map: 'andover', at: [27, 15, 'left'] },
    { name: 'Andover mines (tunnels)', map: 'andoverMine', at: [13, 20, 'up'] },
    { name: 'Andover: the deep stope', map: 'andoverDeep', at: [2, 8, 'right'] },
    { name: 'Bay Bridge-Tunnel: the toll plaza', map: 'cbbtToll', at: [17, 13, 'left'] },
    { name: 'Bay Bridge-Tunnel: the island', map: 'cbbt', at: [14, 20, 'up'] },
    { name: 'Chesapeake Channel Tunnel', map: 'chesTunnel', at: [7, 60, 'up'] },
    { name: 'Between the tunnels', map: 'cbbtMid', at: [14, 55, 'up'] },
    { name: 'Thimble Shoal Tunnel (Tyler)', map: 'cbbtTunnel', at: [7, 60, 'up'] },
    { name: 'Abe & Hannah\'s: outside', map: 'condo', at: [39, 15, 'left'] },
    { name: 'Abe & Hannah\'s: downstairs', map: 'condoDown', at: [13, 18, 'up'] },
    { name: 'Abe & Hannah\'s: upstairs', map: 'condoUp', at: [13, 11, 'down'] },
    { name: 'Abe & Hannah\'s: storage', map: 'condoStorage', at: [10, 5, 'left'] },
    { name: 'The golf course (Romulus)', map: 'golf', at: [20, 26, 'up'] },
    { name: 'El Toro Loco (outside)', map: 'toroLoco', at: [11, 8, 'up'] },
    { name: 'CHKD (outside)', map: 'chkd', at: [16, 21, 'up'] },
    { name: 'The Number One Ditch (finale)', map: 'ditchFinal', at: [7, 17, 'up'] },
    { name: 'CHKD: the lobby', map: 'chkdLobby', at: [11, 12, 'up'] },
    { name: 'CHKD: the ward', map: 'chkdWard', at: [1, 7, 'right'] },
    { name: 'CHKD: the NICU', map: 'chkdNicu', at: [7, 9, 'up'] },
    { name: 'The grocery store (after close)', map: 'grocery', at: [7, 9, 'up'] },
    { name: 'CHKD: Ruby\'s room', map: 'chkdRoom', at: [5, 7, 'up'] },
    { name: 'CHKD: the roof', map: 'chkdRoof', at: [2, 11, 'down'] },
    { name: 'El Toro Loco (inside)', map: 'toroLocoIn', at: [9, 11, 'up'] },
  ];
  // Admin: one of every rock.
  G.adminAllRocks = () => {
    const s = G.state; s.rocks = s.rocks || {}; s.rocksFound = s.rocksFound || {};
    for (const r of G.ROCKS) { s.rocks[r.id] = (s.rocks[r.id] || 0) + 1; s.rocksFound[r.id] = (s.rocksFound[r.id] || 0) + 1; }
  };
  // Admin: hand over everything Nate gets to keep: all the gear (with the bidet's upgrades and a
  // full first-aid kit), every song, the key items he holds on to, and every collectable (photos,
  // Dad's pipes and tins, his pipe book, the instruments). Not the one-time quest items (the candy
  // corn, the sloth, Mom's books...): having those early would jump their quests.
  G.adminAllItems = () => {
    const s = G.state, f = s.flags;
    Object.assign(s.items, { hammer: true, cap: true, pipe: true, bass: true, chicken: true, rod: true, sifter: true, bidet: true, andoverKey: true, mikeyNote: true, badge: true, earplugs: true, pipeBook: true, belt: true, bmf: true });
    s.items.package = 10; s.items.doosh = 3; s.items.eggs = 40; s.items.firstAid = G.KIT_MAX;
    f.kitGot = true; f.bidetBig = true; f.bidetNozzle = true; s.items.bidetWater = G.BIDET_MAX;
    for (const sg of G.SIGNALS) f['signal_' + sg.id] = true;
    // the graded chem final and the EEENGLISH diploma
    f.chemPassed = true; f.engPassed = true; f.engPerfect = true;
    f.doronDeal = true; f.hadDoosh = true; f.capHeart = true;
    s.photos = {}; for (const ph of G.PHOTOS) s.photos[ph.id] = 1;
    s.pipesMade = {}; for (const p of G.PIPES) s.pipesMade[p.id] = { stars: 3, stain: p.stain || 'oil' };
    s.tinsMade = {}; for (const t of G.TOBACCOS) s.tinsMade[t.id] = { stars: 3 };
    s.instruments = {}; for (const it of G.INSTRUMENTS) s.instruments[it.id] = true;
    s.fights = {}; for (const F of G.FIGHTERS) s.fights[F.id] = true;
    s.nicu = { shift1: { stars: 3, best: 300 }, shift2: { stars: 3, best: 420 }, shift3: { stars: 3, best: 540 } };
  };

  // ================================================================ DAD'S SNACKS (and booking Ice JJ Fish)
  // Dad hangs out in his workshop and needs his snacks: candy corn and blue
  // Doritos, together. Mom hides the candy corn in the good china; a bear
  // walked off with the Doritos. Bring him both and he sends Nate to book the
  // man singing a hymn on the pond for Sunday service.
  S.dadWorkshop = function* () {
    const f = flags(), s = G.state;
    // (once everything at home is done: his pipe bench. Before that, a hint that something's coming.)
    if (G.homeDone()) {
      if (!f.pipeBench) yield G.say('Dad', 'Mom has her books back. I have my snacks. The nine o\'clock has a singer. It\'s finally quiet around here.');
      const c = yield G.ask('Dad', f.pipeBench ? 'Want to make something?' : 'Nate. Want to learn how to make a pipe? Or blend some tobacco?', ['Make a pipe', 'Blend tobacco', 'Just talk']);
      if (c === 0 || c === 1) { yield* S.pipeBench(c === 0 ? 'pipe' : 'tin'); return; }
    } else if (f.snacksDone && !f.pipeTease) {
      f.pipeTease = true;
      yield G.say('Dad', 'Nate. Once things settle down around here, come see me. I\'ve got something to teach you in this workshop.');
    }
    if (f.jjBeaten) {
      f.dadLine = ((f.dadLine || 0) + 1) % 4;
      yield G.say('Dad', [
        'He\'s playing the nine o\'clock! The church ladies are going to faint.',
        'Candy corn and blue Doritos. Don\'t tell your mother. She knows.',
        'Do you speak EEENGLISH? ...Just checking.',
        f.hipHopDone ? 'Same time next Tuesday? Your siblings still think you photoshopped me.' : 'Tuesday nights I have a... thing. A church thing. Don\'t wait up.',
      ][f.dadLine]);
      return;
    }
    if (f.jjGig) { yield G.say('Dad', 'Did you book him yet? Tell him we have a fog machine. We don\'t. But we could.'); return; }
    // (Mom's looking for his keys to the basement)
    if (f.momReport && !s.items.basementKey && !f.globBeaten && !f.dadKeyHint) {
      f.dadKeyHint = true;
      yield G.say('Dad', 'My keys? I put them somewhere I would remember. Then I forgot where that was.');
      yield G.say('Dad', 'Check the truck. I eat lunch in the truck.');
      if (f.snackQuest) return;
    }
    // (one thing at a time at home: his snack run waits until Lily and Mikey are sorted out)
    if (!f.snackQuest && !f.mikeyBeaten) {
      if (!f.badlandsMet) yield G.say('Dad', 'Nate! You made it home. Go on in and say hi to everybody. I\'m in the middle of a pipe.');
      else if (!f.lilySaved) {
        yield G.say('Nate', 'Dad, Lily is locked in the kitchen fridge.');
        yield G.say('Dad', 'Then go get your sister out of the fridge. I\'ll survive on sawdust.');
        if (f.fridgeGame && !s.items.milk) yield G.say('Dad', 'If you need milk, there\'s some in the old fridge out here. I wouldn\'t drink it.');
      } else yield G.say('Dad', 'There\'s a boy at the end of our driveway with heart balloons. Lily says she\'ll handle it. I am staying out of it.');
      return;
    }
    if (!f.snackQuest) {
      f.snackQuest = true;
      yield G.say('Dad', 'Nate! Just the man I wanted to see.');
      yield G.say('Dad', 'I have been out here since lunch. I am running on fumes. And sawdust.');
      yield G.say('Dad', 'I need my snacks. Candy corn. And the blue Doritos.');
      yield G.say('Nate', 'Together?');
      yield G.say('Dad', 'Together. Salty and sweet. It is the perfect meal.');
      yield G.say('Dad', 'There was a bag of blue Doritos right here on the bench. Somebody took it.');
      yield G.say('Dad', 'And your mother hides the candy corn. She thinks I don\'t know where. I DON\'T know where. That\'s the problem.');
      return;
    }
    if (!(s.items.candyCorn && s.items.doritos)) {
      const need = [!s.items.candyCorn && 'the candy corn', !s.items.doritos && 'the blue Doritos'].filter(Boolean).join(' and ');
      yield G.say('Dad', 'Still waiting on ' + need + ', Nate. I am wasting away out here.');
      if (!s.items.doritos) yield G.say('Dad', 'Whoever took the Doritos tracked mud all over my floor.');
      return;
    }
    // the delivery
    yield G.say('Nate', 'One bag of candy corn. One bag of blue Doritos. Slightly chewed.');
    yield G.say('Dad', 'Chewed?');
    yield G.say('Nate', 'There was a bear.');
    yield G.say('Dad', '...Very EEENGLISH.');
    s.items.candyCorn = false; s.items.doritos = false;
    f.snacksDone = true;
    yield G.say(null, 'Dad pours the candy corn into the Doritos bag, folds the top over, and shakes it.');
    yield G.say('Dad', 'Ahh. NOW we\'re talking.');
    yield* S.bossStash(20, 'Dad slips you {y}20 shark teeth{/}. "For your trouble. Don\'t tell your mother."');
    // ...and the real reason he's been out here all day
    yield G.wait(30);
    const shop = G.play.world;
    if (shop.dad) shop.pop(shop.dad.x + 30, shop.dad.y - 40, '~ I pray to Jesus ~', '#a8e0ff');
    yield G.wait(40);
    yield G.say('Dad', 'Do you hear that? Somebody has been singing out past the bridge all week.');
    yield G.say('Dad', 'A HYMN, Nate. In a snowstorm. In July.');
    if (f.jjSeen) yield G.say('Nate', 'That\'s Ice JJ Fish. He\'s on our pond. He won\'t stop singing.');
    else yield G.say('Nate', '...Is it snowing past the bridge?');
    yield G.say('Dad', 'Whoever he is, I need him for Sunday service. The nine o\'clock could use some energy.');
    yield G.say('Dad', 'Go out there and book him for me. Tell him the pastor is VERY interested.');
    f.jjGig = true;
    G.audio.sfx('secret');
    yield G.say(null, 'New quest: {y}book the singer on the frozen pond{/} for Dad\'s church. He\'s past the bridge, north of the yard.');
  };

  // the good china: where Mom hides the candy corn
  S.goodChina = function* () {
    const f = flags(), s = G.state;
    yield G.say(null, 'A glass cabinet full of the good china. Nobody is allowed to use the good china.');
    if (f.snacksDone) { yield G.say(null, 'Behind the gravy boat: a candy-corn-shaped empty spot.'); return; }
    if (!f.snackQuest || s.items.candyCorn) return;
    yield G.say(null, 'Nate very, very carefully moves the gravy boat...');
    yield G.say(null, 'Behind it: a family-size bag of candy corn. And two more behind that.');
    s.items.candyCorn = true;
    yield G.itemGet(G.spr.candyCorn, 'You found {y}Mom\'s secret candy corn{/}!');
    G.audio.sfx('yell');
    yield G.say(null, 'From somewhere outside, faintly: "JAMIE LEE CURTIS!"');
    yield G.say('Nate', '...She knows.');
  };

  // asking Mom about candy corn
  S.momCandy = function* () {
    const f = flags();
    f.momDenied = true;
    yield G.say('Nate', 'Mom, do we have any candy corn?');
    yield G.say('Michelle', 'Candy corn? In THIS house? I have no idea what you\'re talking about.');
    yield G.say('Michelle', 'Is this for your father? Your father is not allowed candy corn. Your father knows why.');
    yield G.say('Nate', '...She\'s definitely hiding it.');
    if (G.with('lily')) {
      yield G.say('Lily', 'She hides the good candy in the good china. Living room.');
      yield G.say('Lily', 'Nobody is allowed to touch the good china, so nobody ever looks there.');
      return;
    }
    G.audio.sfx('buzz');
    yield G.text('Lily', 'mom hides the good candy in the good china. living room');
    yield G.text('Lily', 'nobody is allowed to touch the good china so nobody ever looks');
    // (the fridge only comes up once Nate's found her in it)
    yield G.text('Lily', f.badlandsMet && !f.lilySaved ? 'also im still in a fridge. ok bye' : 'you didnt hear it from me');
  };

  // the bear drops the bag
  S.doritosBack = function* () {
    yield G.wait(20);
    yield G.say(null, 'The bear drops the bag and lumbers off toward the brook.');
    G.state.items.doritos = true;
    yield G.itemGet(G.spr.doritos, 'You got the {y}blue Doritos{/}! They\'re... mostly still in the bag.');
  };

  // ================================================================ ICE JJ FISH (north of the bridge)
  // before Dad's booking: he's mid-set, and he won't stop for anybody
  S.jjBusyIntro = function* () {
    const f = flags(), w = G.play.world, g = w.jjNpc;
    if (f.jjSeen) return;
    f.jjSeen = true;
    f.jjMet = true;
    yield G.wait(20);
    yield G.say(null, 'Past the bridge, the woods open up onto a frozen pond. It\'s snowing. Only here.');
    yield G.camFocus(g.x, g.y - 16, 50);
    w.pop(g.x, g.y - 36, '~ ooooOOOOH ~', '#a8e0ff');
    yield G.wait(40);
    yield G.say('Nate', '...Is that Ice JJ Fish? On our pond?');
    if (G.with('doron')) yield G.say('Doron', 'We have a pond?');
    else if (G.with('lily')) yield G.say('Lily', 'Oh no. He\'s singing.');
    yield G.say('Ice JJ Fish', 'Shh. Little man. I\'m in the middle of a SET.');
    yield G.camFocus(null, null, 30);
  };
  S.jjBusy = function* () {
    yield G.say('Ice JJ Fish', 'Ayy, I\'m in the middle of a set. You want a real show? Get me a BOOKING.');
    yield G.say('Nate', '...Who even books Ice JJ Fish?');
  };

  // with Dad's booking: survive the whole set and he'll play Sunday service
  S.jjIntro = function* () {
    const f = flags(), w = G.play.world, g = w.jj;
    yield G.wait(20);
    if (!f.jjBooked) {
      f.jjBooked = true;
      f.jjMet = true;
      if (!f.jjSeen) {
        f.jjSeen = true;
        yield G.say(null, 'Past the bridge, the woods open up onto a frozen pond. It\'s snowing. Only here.');
      }
      yield G.camFocus(g.x, g.y - 16, 50);
      w.pop(g.x, g.y - 36, '~ ooooOOOOH ~', '#a8e0ff');
      yield G.wait(40);
      yield G.say('Nate', 'Ice JJ Fish! My dad\'s a pastor. He heard you all the way from his workshop.');
      yield G.say('Nate', 'He wants to book you. For Sunday service.');
      yield G.say('Ice JJ Fish', 'A CHURCH gig?');
      yield G.say('Ice JJ Fish', '...Ice JJ Fish doesn\'t sign with just anybody, little man.');
      yield G.say('Ice JJ Fish', 'You want me at your dad\'s church? Survive my WHOLE set.');
      if (G.with('doron')) yield G.say('Doron', 'How long is the set?');
      else if (G.with('lily')) yield G.say('Lily', 'Oh no. He\'s going to sing.');
      yield G.say('Ice JJ Fish', 'This one\'s called "I Pray to Jesus." It goes out to the pastor. HIT IT!');
      yield G.camFocus(null, null, 30);
      yield G.say(null, 'Careful: the pond is {c}slippery{/}. Nate slides around on the ice.');
    } else {
      yield G.say('Ice JJ Fish', 'Back for the encore? Say less.');
    }
    yield G.banner('ICE JJ FISH', 'live from the frozen pond', 150);
  };

  S.jjDefeated = function* (boss) {
    const f = flags(), w = G.play.world, s = G.state;
    G.audio.stop();
    for (const e of w.ents) if (e instanceof G.Shot || e instanceof G.Icicle) { e.dead = true; w.burst(e.x, e.y - 6, ['#d8f4ff', '#ffffff'], 4); }
    G.audio.sfx('bell');
    yield G.shakeCmd(30, 3);
    yield G.wait(30);
    yield G.banner('YOU WIN!', 'the snow stops', 150);
    yield G.say('Ice JJ Fish', 'Okay, okay. You got me.');
    yield G.say('Ice JJ Fish', 'That was a vibe though. You felt it, right?');
    yield G.say('Nate', '...I did feel something.');
    yield G.say('Ice JJ Fish', 'That\'s the song, bro. Stay icy.');
    yield G.say('Ice JJ Fish', 'Aight. You survived the whole set. Tell your pops I\'m in. Sunday. Nine a.m.');
    yield G.say('Ice JJ Fish', 'I\'ll bring the snow.');
    yield G.say('Ice JJ Fish', 'Hold up. Is that a pipe? Lemme teach you a little something. Three notes. Real smooth.');
    f.signal_icy = true;
    yield G.itemGet(G.spr.pipe, 'You learned a new pipe song: {c}I Pray to Jesus{/}  ' + G.arrows(['left', 'right', 'up']));
    yield G.say(null, 'Puff it on Dad\'s pipe to fire an ice beam the way you\'re facing. Whatever it hits freezes solid for a few seconds, and frozen enemies can still be bonked.');
    w.pop(boss.x, boss.y - 36, '~ I PRAY TO JESUUUS ~', '#a8e0ff');
    yield G.walkTo(boss, boss.x + 200, boss.y - 10, 1.6);
    boss.dead = true;
    f.jjBeaten = true;
    yield* S.bossStash(40, 'Ice JJ Fish left his tip jar on the ice: {y}40 shark teeth{/}.');
    G.audio.play('home');
    yield G.say('Nate', '...He slid off across the ice. Still singing. I think that means he\'s booked.');
  };

  // The WiFi router on the den desk.
  S.wifi = function* () {
    const f = flags();
    if (f.wifi) {
      yield G.say(null, 'The router. Still {y}ShoolbyBonesLumpSucker{/}. Every capital letter matters.');
      return;
    }
    f.wifi = true;
    yield G.say(null, 'The WiFi router. Its little lights blink like it\'s thinking very hard.');
    yield G.say(null, 'There\'s a label taped to the bottom. Network: {y}THE DITCH 5G{/}');
    yield G.say(null, 'Password: {y}ShoolbyBonesLumpSucker{/}');
    yield G.say('Nate', 'Shoolby. Lily and I made that word up.');
    yield G.say('Nate', 'It doesn\'t mean anything.');
    yield G.say('Nate', '...It means everything.');
    if (G.with('lily')) {
      yield G.say('Lily', 'You told Mom "Shoolby" was in the dictionary.');
      yield G.say('Nate', 'It\'s in OUR dictionary.');
    } else if (G.with('doron')) {
      yield G.say('Doron', 'I\'ve been typing "SchoolbyBones" for three years.');
      yield G.say('Nate', 'There\'s no C, Doron.');
    }
  };

  // Students protesting Lafayette's event village (and whatever else).
  const PROTEST = {
    people: [['Sophomore', 'It\'s NOT okay to make fun of little people. Those wrestlers are athletes.'], ['Sophomore', 'Did you see the guy do a moonsault off the turnbuckle? I can\'t do a moonsault. YOU can\'t do a moonsault.'], ['Nate', 'I can barely do a cartwheel.']],
    grass: [['Junior', 'Lafayette ripped up the whole quad to build their arena.'], ['Junior', 'That grass was older than me. It had seen THINGS.'], ['Nate', 'Rest in peace, grass.']],
    money: [['Senior', 'Do you know how much they spent on a TEMPORARY event village?'], ['Senior', 'Me neither. Nobody will tell us. That\'s how you know it\'s a lot.']],
    quad: [['Freshman', 'The event village blocks the ENTIRE quad.'], ['Freshman', 'I have to walk all the way around it to get to class. It adds four minutes. FOUR.'], ['Nate', 'That\'s eight minutes round trip.'], ['Freshman', 'THANK you.']],
    who: [['Grad Student', 'We have some questions for the president of Lafayette.'], ['Grad Student', 'Mostly "why." Also "why the quad." Also... "why."']],
  };
  S.protester = (sign) => function* () {
    const f = flags();
    for (const [who, line] of PROTEST[sign]) yield G.say(who, line);
    f['protest_' + sign] = true;
    // hear all of them out and they chip in from the protest fund
    if (!f.protestReward && Object.keys(PROTEST).every((k) => f['protest_' + k])) {
      f.protestReward = true;
      yield G.say('Protester', 'Wait. Did you just listen to ALL of us?');
      yield G.say('Protester', 'Nobody listens to all of us. Not even us.');
      G.play.addTeeth(20);
      G.audio.sfx('secret');
      yield G.say(null, 'The protesters pass a hat around. Nate gets {y}20 shark teeth{/} from the protest fund.');
      yield G.say('Nate', 'Solidarity.');
    }
  };
  // The organizer keeps the trail to the little cave closed. "Nothing scares us."
  S.organizer = function* () {
    const f = flags();
    yield G.say('Organizer', 'Whoa, whoa. This trail is part of the protest. Nobody goes down to the cave.');
    if (!f.organizerMet) {
      f.organizerMet = true;
      yield G.say('Nate', 'What does a cave have to do with the quad?');
      yield G.say('Organizer', 'Nothing. That\'s what makes it a statement.');
      yield G.say('Organizer', 'We are not moving until Lafayette gives back the quad. Not one inch. Nothing scares us.');
    } else yield G.say('Organizer', 'Not one inch. Nothing scares us.');
    if (G.state.items.pipe && f.signal_jlc) yield G.say('Nate', '...Nothing, huh?');
    else yield G.say('Nate', 'There\'s a cave down there. I can smell the limestone from here.');
  };
  // Jamie Lee Curtis on the pipe, right at the picket line. They come back every time
  // Nate returns to the fairgrounds, and it scares them off every time. The first time
  // also clears the organizer off the cave trail for good.
  S.protestScatter = function* () {
    const f = flags(), w = G.play.world, p = P(), cam = G.play.cam;
    f.protestScattered = true;
    const org = w.organizer;
    const crowd = w.ents.filter((e) => e instanceof G.NPC && !e.dead && (e.name === 'Protester' || e === org));
    const yells = ['AAAAH!', 'EEEK!', 'RUN!', 'NOT LIKE THIS!', 'MY SIGN!', 'WHAT WAS THAT?!'];
    yield G.wait(12);
    G.audio.sfx('yell');
    crowd.forEach((e, i) => { e.dir = 'down'; if (e !== org && i % 2 === 0) w.pop(e.x, e.y - 58, yells[i % yells.length], '#f8f8f0'); });
    if (org) w.pop(org.x, org.y - 44, 'NOTHING SCARES-- AAAH!', '#c898ff');
    yield G.shakeCmd(20, 2);
    yield G.wait(30);
    // everybody runs for it, off whichever side of the screen is closer
    yield G.together(...crowd.map((e) => G.walkTo(e, e.x < p.x ? cam.x - 40 : cam.x + G.W + 40, e.y - 30 - Math.random() * 40, 3)));
    for (const e of crowd) e.dead = true;
    if (!org) { w.pop(p.x, p.y - 34, '...Sorry!', '#78e070'); return; }
    if (w.caveSign) {
      w.burst(20 * 16 - 4, 29 * 16 + 4, ['#c8b090', '#8a6a48'], 8, { speed: 1, up: 0.8, g: 0.08, life: 24, size: 2 });
      w.props.splice(w.props.indexOf(w.caveSign), 1);
      w.caveSign = null;
    }
    w.block[29 * w.w + 20] = 0; w.block[29 * w.w + 21] = 0;
    w.organizer = null;
    yield G.wait(20);
    yield G.say('Nate', '...Sorry! Sorry. You can come back. It\'s a free country.');
    yield G.say('Nate', 'And the trail to the cave is wide open.');
  };
  const CHANTS = ['GIVE BACK THE QUAD!', 'SAVE THE GRASS!', 'WHO APPROVED THIS?!', 'RESPECT LITTLE PEOPLE!', 'WHERE\'S THE MONEY?!'];

  S.denShelf = function* () {
    const f = flags(), s = G.state;
    if (f.fridgeGame && !s.items.vodka && !f.badlandsBeaten) {
      yield G.say(null, 'Built-in shelves packed with books. There\'s a hollow copy of "War and Peace" up top. Empty.');
      yield G.say('Nate', 'This is where the stash used to be. Mom found it years ago. She definitely still has it.');
      return;
    }
    if (f.booksQuest && !f.cluesDone && !f.clue_den) { yield* S.clueDen(); return; }
    if (f.booksQuest && !f.globBeaten) {
      yield G.say(null, 'Built-in shelves with big gaps everywhere. A few books left behind have little bite marks in them.');
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
    if (needKey() && !f.key_grill) { yield* S.keyHuntMiss('grill')(); return; }
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
    // the chug, in glorious close-up (Nate and whoever's with him step aside so nobody blocks the shot)
    G.audio.play('chug');
    w.boot.img = null;
    b.held = G.spr.bootBlue;
    b.dir = 'down';
    const fol = w.ents.find((e) => e instanceof G.Follower && !e.dead);
    if (fol) fol.hold = true;
    yield G.together(G.walkTo(p, 26 * 16 + 8, 7 * 16 + 14, 1.6), fol && G.walkTo(fol, 34 * 16 + 8, 7 * 16 + 14, 1.6));
    p.dir = 'right';
    if (fol) fol.dir = 'left';
    yield G.camFocus(b.x, b.y - 18, 30);
    yield G.zoomTo(1.5, 40);
    const gaps = [26, 22, 18, 15, 12, 10, 8, 7, 6, 5, 5, 4, 4, 4];
    for (let i = 0; i < gaps.length; i++) {
      G.audio.sfx('gulp');
      w.pop(b.x + (i % 2 ? 10 : -10), b.y - 38 - (i % 4) * 3, 'GLUG', '#78c8ff');
      G.play.shake(6, 1 + (i >> 2));
      yield G.wait(gaps[i]);
    }
    b.held = G.spr.boot;
    G.audio.stop();
    yield G.wait(40);
    yield G.say('Badlands Chugs', '...Finished. Told y\'all. Ain\'t nothing I can\'t...');
    b.held = null;
    yield G.wait(30);
    // something is very, very wrong
    b.sprite = 'badlands_blue';
    b.flashT = 40;
    G.audio.sfx('slip');
    yield G.zoomTo(2, 30);
    yield G.say('Badlands Chugs', '...uh oh.');
    // he swells up and steams while the whole house rumbles
    yield {
      start() { this.t = 0; },
      update() {
        const k = ++this.t / 160;
        b.scale = 1 + k * 0.55 + Math.sin(this.t * 0.7) * 0.04 * k;
        if (this.t % 5 === 0) w.burst(b.x + (Math.random() * 24 - 12), b.y - 28 * b.scale, ['#8a8a94', '#b0b0b8', '#d8d8e0', '#78c8ff'], 2, { speed: 0.6, up: 1.1, life: 40, size: 3 });
        if (this.t % 18 === 0) G.audio.sfx('bump');
        if (this.t % 32 === 0) w.pop(b.x, b.y - 30 - 26 * b.scale, ['*gurgle*', '*GURGLE*', '*BLORP*', '*hissss*', '*WHEEEEE*'][this.t / 32 - 1], '#78c8ff');
        if (this.t > 110) b.flashT = 2;
        G.play.shake(2, 1 + Math.floor(this.t / 50));
        return this.t >= 160;
      },
    };
    yield G.say('Lily', '{d}(from inside the fridge){/} IS HE GONNA BLOW?!');
    yield G.say('Nate', 'EVERYBODY GET DOWN!');
    // KA-BLOOEY
    yield G.wait(10);
    const bx = b.x, by = b.y - 22;
    G.play.whiteout = 1.5;
    G.play.zoom = 1;
    b.scale = 1;
    b.held = null;
    for (let k = 0; k < 3; k++) {
      const ox = k ? Math.random() * 50 - 25 : 0, oy = k ? Math.random() * 24 - 12 : 0;
      G.audio.sfx('boom');
      w.fx.push({ x: bx + ox, y: by + oy, vx: 0, vy: 0, circle: true, r: 40 + k * 10, max: 18, life: 18, color: k === 1 ? '#78c8ff' : '#fff4c0' });
      w.fx.push({ x: bx, y: by, vx: 0, vy: 0, shock: true, r: 150 + k * 50, max: 44, life: 44, color: k === 1 ? '#78c8ff' : '#ffffff' });
      w.burst(bx + ox, by + oy, ['#3a6ae8', '#78c8ff', '#ffffff', '#f4f4f0'], 34, { speed: 3, up: 1.2, g: 0.05, life: 60, size: 3 });
      w.burst(bx + ox, by + oy, ['#8a8a94', '#b0b0b8', '#5a5a64'], 14, { speed: 1, up: 0.5, life: 90, size: 6 });
      G.play.shake(70, 6 - k);
      yield G.wait(k ? 16 : 12);
    }
    // ...and Badlands goes up through the ceiling, still blue
    yield (() => {
      const txt = G.bigText('KA-BLOOEY!!!', 120, '#78c8ff');
      let vy = -1, holed = false;
      return {
        start() { txt.start(); },
        update() {
          vy -= 0.2;
          b.y += vy;
          if (G.tick % 2 === 0) w.burst(b.x, b.y - 10, ['#78c8ff', '#ffffff', '#8a8a94'], 2, { speed: 0.5, life: 30, size: 3 });
          if (!holed && b.y < 3 * 16) {
            holed = true;
            G.audio.sfx('clank');
            w.burst(b.x, 2 * 16, ['#f4f0e4', '#d8d4c8', '#8a7a68'], 26, { speed: 2, up: 0.4, g: 0.1, life: 50, size: 3 });
          }
          return txt.update();
        },
        draw(ctx) { txt.draw(ctx); },
      };
    })();
    b.dead = true;
    yield G.camFocus(null, null, 30);
    // plaster rains down from the hole in the ceiling
    for (let i = 0; i < 4; i++) {
      w.burst(bx + Math.random() * 30 - 15, 2 * 16 + 8, ['#f4f0e4', '#d8d4c8', '#b8b0a0'], 6, { speed: 0.4, up: 0, g: 0.12, life: 40, size: 2 });
      G.play.shake(6, 1);
      yield G.wait(14);
    }
    // a twinkle in the sky, far, far away
    G.audio.sfx('bell');
    w.burst(bx, G.play.cam.y + 6, ['#ffffff', '#f8e868'], 8, { speed: 0.8, life: 24, size: 2 });
    yield G.wait(40);
    w.pop(bx, G.play.cam.y + 24, '...LIKE AND SUBSCRIBE!', '#f8d850');
    yield G.wait(90);
    yield G.say('Nate', '...He went through the roof.');
    yield G.say('Lily', '{d}(from inside the fridge){/} Did he just say "like and subscribe"?!');
    f.badlandsBeaten = true;
    if (fol) fol.hold = false;
    yield* S.bossStash(40, 'Badlands left his sponsorship money on the counter: {y}40 shark teeth{/}.');
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
    if (G.with('doron')) {
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
    G.play.setFollower('lily');
    yield G.say(null, 'Lily is following you now. Swap who tags along in the {y}PEOPLE{/} menu.');
  };

  // ---------------------------------------------------------------- Golden Hour (Lily vs. Mikey)
  S.mikeyGoldenHour = function* () {
    const f = flags(), w = G.play.world, m = w.mikey, p = P();
    if (!m || f.mikeyBeaten || !f.lilySaved) return;
    yield* S.callIn('lily', 'Is that... Mikey? Ugh. I\'ll handle this.');
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
    yield G.say('Mikey', 'Okay. Okay. Here goes. Ahem.');
    yield G.say(null, 'Mikey closes his eyes and starts to sing. Loudly.');
    yield G.say(null, 'You\'re playing as {p}Lily{/}! {y}Hold Z{/} to wind up a {y}"No."{/} and let go to say it.');
    yield G.say(null, 'She has to plant her feet to wind up, so she can\'t move. Let go too soon and it comes out as a mumbled "no..."');
    yield G.say('Lily', 'And Mikey hears a mumbled "no" as a maybe.');
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
    mikey.held = G.spr.bouquet; mikey.heldAt = [-7, 3];
    boss.dead = true;
    yield G.say('Mikey', '...Was it the song?');
    yield G.say('Lily', 'It wasn\'t the song, Mikey. It was the balloons, the roadblock, AND the song.');
    yield G.say('Mikey', '...So that\'s a no.');
    yield G.say('Lily', 'That\'s a no.');
    yield G.say('Mikey', 'Okay. Okay. I respect that.');
    yield G.say('Mikey', 'Can I at least keep the flowers?');
    yield G.say('Lily', 'Keep the flowers, Mikey.');
    yield G.say('Mikey', 'Can I ask you something weird?');
    yield G.say('Mikey', 'A little egg man in a paisley suit came up to me at the gas station. Long white beard.');
    yield G.say('Mikey', 'He said if I sang to you at golden hour, with balloons, you\'d say yes. Guaranteed.');
    yield G.say('Lily', '...Father Eggmas.');
    yield G.say('Mikey', 'He seemed really trustworthy.');
    yield G.say('Lily', 'He is an EGG, Mikey.');
    yield G.say('Mikey', 'Okay. One more thing.');
    yield G.say(null, 'Mikey pulls a piece of notebook paper out of his pocket, folded into a very small square, and holds it out.');
    yield G.say('Mikey', 'Read it later. When I\'m gone. Like, GONE gone.');
    yield G.say('Lily', '...Okay, Mikey.');
    G.state.items.mikeyNote = true;
    yield G.itemGet(G.spr.noteIcon, 'Lily got {p}Mikey\'s Note{/}. It\'s folded into a very small square.');
    yield G.walkTo(mikey, mikey.x + 140, mikey.y, 1.1);
    mikey.dead = true;
    flags().mikeyBeaten = true;
    yield* S.bossStash(30, 'Mikey dropped his gas station change: {y}30 shark teeth{/}.');
    s.playAs = null;
    yield G.say('Nate', 'That was the most powerful "No." I have ever witnessed.');
    yield G.say('Lily', 'Thank you. Here. Hold this. I can\'t look at it.');
    yield G.say(null, 'Lily hands Nate {p}Mikey\'s Note{/}. (Find it in KEY ITEMS and press Z to read it.)');
    yield G.say('Lily', 'Also. Mikey says a little egg man in a paisley suit put him up to all of this.');
    yield G.say('Nate', '...Father Eggmas. He\'s been messing with our family this whole time.');
    yield G.say('Lily', 'Now can we go? The ditch isn\'t going to save itself.');
    G.play.warp('home', 43, 50, 'down');
  };

  // Mikey's note (from KEY ITEMS): two pages, then whoever's around reacts
  S.readMikeyNote = function* () {
    const f = flags();
    yield G.noteView(G.spr.mikeyNote);
    f.noteReads = (f.noteReads || 0) + 1;
    if (G.with('lily')) {
      yield G.say('Lily', ['Why do you still have that.', 'Stop reading it out loud. I can hear you reading it in your head.', 'The drawing is actually kind of good. That makes it worse.'][(f.noteReads - 1) % 3]);
      if (f.noteReads === 1) yield G.say('Nate', 'It\'s a historical document, Lily.');
    } else if (G.with('doron')) {
      yield G.say('Doron', f.noteReads === 1 ? '"R.I.P. Me." Mikey, buddy.' : 'He spelled "embarrassed" with two Ms. Respect the commitment.');
    } else if (f.noteReads === 1) {
      yield G.say('Nate', '..."R.I.P. Me." Mikey. Buddy.');
    }
  };

  // Some jokes need a particular person: swap them in as Nate's companion for it.
  // Returns whether they're there now.
  S.callIn = function* (id, line) {
    if (!G.state.party.includes(id)) return false;
    if (G.with(id)) return true;
    G.play.setFollower(id, true);
    G.audio.sfx('select');
    yield G.wait(14);
    if (line) yield G.say(G.PARTY_INFO[id].name, line);
    return true;
  };

  // ---------------------------------------------------------------- home critters
  const CRITTER_LINES = {
    rofo: [['Nate', '...Is that RoFo Pop? Blue raspberry RoFo Pop?'], ['Nate', 'Abe and Hannah bring us this from the Eastern Shore every time they visit. Every. Time. Nobody drinks it.'], ['Nate', 'And now it\'s ANGRY.']],
    corn: [['Nate', 'My CORN?! I kept a bunch of corn on the cob in my room and now it\'s ALIVE.'], ['Nate', 'Father Eggmas, you monster.']],
    cereal: [['Nate', 'That\'s my cereal! I go through a box a day. I guess they finally fought back.']],
    firework: [['Nate', 'Those are MY fireworks! I knew I should have stored them in the garage.']],
    flower: [['Nate', 'Snapdragons. Living up to the name.']],
    gourd: [['Nate', 'Birdhouse gourds. Hopping. Something is definitely living in there.']],
    bear: [['Nate', 'A BEAR! Bedminster really does have bears!']],
    cable: [['Nate', 'Is that one of Abe\'s yellow guitar cables? It\'s... SLITHERING.'], ['Nate', 'Father Eggmas got to the inventory.']],
    goose: [['Nate', 'Canada geese. Off the golf course.'], ['Nate', 'Rule number one in Virginia: you do NOT make eye contact with a goose.'], ['Nate', '...I made eye contact with a goose.']],
  };
  S.critterIntro = function (kind) {
    const f = flags();
    if (f['met_' + kind]) return;
    f['met_' + kind] = true;
    const lines = CRITTER_LINES[kind].slice();
    if (kind === 'bear' && G.with('doron')) lines.push(['Doron', 'I could take him.'], ['Nate', 'Do NOT suplex the bear.']);
    if (kind === 'cable' && G.with('abe')) lines.push(['Abe', 'Don\'t hurt the inventory!'], ['Nate', 'The inventory is trying to STRANGLE me, Abe.'], ['Abe', '...Okay. Hurt the inventory a little.']);
    if (kind === 'goose' && G.with('abe')) lines.push(['Abe', 'They chased Romulus into the pond once. He still won\'t go near water.']);
    if (kind === 'goose' && G.with('hannah')) lines.push(['Hannah', 'One took my sandwich right out of my hand. I still think about it.']);
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
    if (G.with('doron')) yield G.say('Doron', 'ABE.');
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
    const doron = yield* S.callIn('doron', 'Wait. Is this THE toilet?');
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
    if (G.with('lily')) yield G.say('Lily', 'Still the best story this family has.');
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
    if (id === 'abe' && flags().bassGiven && !flags().abeBassAsk) { yield* S.abeBass(); return; }
    if (id === 'hannah') { yield* S.hannahCheckup(); return; }
    const lines = {
      abe: [
        'I can see over everything from up here. You should try it sometime.',
        'The yellow cables are an investment. The market will come around.',
        'Romulus isn\'t scared of ANYBODY. Except you. Still no idea why.',
        'Keep the bidet topped off. You never know.',
      ],
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

  // Doron always comes running for a suplex, whoever Nate brought along.
  S.suplexTime = function* () {
    yield* S.callIn('doron', 'Did somebody say ROCK?');
    yield* S.boulderSmash();
  };

  S.boulderHit = function () {
    const f = flags();
    if (G.script.busy) return;
    if (G.state.party.includes('doron')) { G.script.run(S.suplexTime()); return; }
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
    const f = flags(), s = G.state;
    yield G.say(null, 'FUNNEL CAKE: {r}6{/} shark teeth.');
    if (s.items.funnelCake) { yield G.say('Nate', 'I already have one. It\'s for Grandma Rose. I am NOT eating it. ...Much.'); return; }
    if (!G.with('doron')) {
      yield G.say('Nate', '...I can\'t order that. The price is the sacred number. I can\'t say it.');
      if (G.with('lily')) yield G.say('Lily', 'Don\'t look at me. I can\'t say it either.');
      return;
    }
    if (s.teeth < 6) { yield G.say('Doron', 'We\'re short a few teeth, Nate.'); return; }
    yield G.say('Doron', 'One funnel cake, please. That\'s six teeth, right?');
    yield G.say('Nate', 'HOW CAN YOU JUST SAY IT LIKE THAT.');
    yield G.say('Doron', 'Say what? Six?');
    yield G.say('Nate', '...');
    G.play.addTeeth(-6);
    s.items.funnelCake = true;
    yield G.itemGet(G.spr.funnelCake, 'Doron hands you a {y}funnel cake{/}. Powdered sugar everywhere.');
    if (f.roseRocks && !f.roseTraded) yield G.say('Nate', 'This is for Grandma Rose. Don\'t eat it.');
    else yield G.say('Doron', 'Somebody around here would probably trade you something for that.');
  };

  // Dr. Nataro's tray of three gray rocks: which one is dolomite? (the acid test)
  S.acidTest = function* () {
    const f = flags();
    if (f.acidDone) { yield G.say(null, 'The tray of gray rocks. Nate already found the dolomite. Rock C. Obviously.'); return; }
    yield G.say(null, 'A tray of three gray rocks, labeled A, B and C, and a dropper bottle of dilute acid. A sticky note: "WHICH ONE IS DOLOMITE? - Dr. M."');
    yield G.say(null, 'Nate drips a little acid on each one.');
    yield G.say(null, '{y}A{/} fizzes like crazy. {y}B{/} does nothing at all. {y}C{/} does nothing... until Nate scratches some into powder. Then the powder fizzes, a little.');
    const c = yield G.ask('Nate', 'Which one is dolomite?', ['A: fizzes a lot', 'B: no fizz at all', 'C: fizzes as powder']);
    if (c !== 2) {
      yield G.say('Nate', c === 0 ? '...No. Fizzing like that is calcite. That\'s limestone.' : '...No. Nothing at all? That\'s quartzite. Acid doesn\'t touch quartz.');
      yield G.say('Nate', 'Think, Nate. You think about this stuff OFTEN.');
      return;
    }
    f.acidDone = true;
    yield G.say('Nate', 'C. Dolomite barely reacts to cold acid, until you powder it. Calcite fizzes right away. Quartz never does.');
    yield G.say('Dr. Nataro', 'Correct! Keep it. You\'re the first student all week who didn\'t try to lick them.');
    yield* S.rockGive('dolomite');
  };

  // the balloon game: darts bounce off; Lily's "No." pops every balloon
  S.balloonGame = function* () {
    const f = flags(), s = G.state, w = G.play.world;
    if (f.balloonWon) { yield G.say('Carny', 'You again. The young lady popped every balloon I own. I had to order more.'); return; }
    yield G.say('Carny', 'Step right up! Pop every balloon, win the TOP PRIZE!');
    yield G.say(null, 'The top prize sits on a velvet pillow: a chunk of gray rock. The tag says "GENUINE LEHIGH VALLEY CEMENT ROCK."');
    if (!f.balloonSeen) { f.balloonSeen = true; yield G.say('Nate', 'I NEED that.'); }
    if (!G.with('lily')) {
      const c = yield G.ask('Carny', 'Three darts, five teeth. Whaddaya say?', ['Play (5 teeth)', 'No thanks']);
      if (c) return;
      if (s.teeth < 5) { yield G.say('Carny', 'Come back with five teeth, pal.'); return; }
      G.play.addTeeth(-5);
      G.audio.sfx('swing');
      yield G.say(null, 'Nate throws three darts. Thunk. Thunk. Thunk. The balloons bounce them right off.');
      yield G.say('Nate', 'These balloons are made of TIRE.');
      yield G.say('Carny', 'Nobody\'s ever popped \'em. Nobody ever will.');
      if (!f.balloonHint) { f.balloonHint = true; yield G.say('Nate', 'I need something that pops balloons. ...Or someone.'); }
      return;
    }
    yield G.say('Carny', 'How about you, young lady? Wanna try?');
    yield G.say('Lily', 'No.');
    // every balloon on the board, all at once
    G.audio.sfx('no');
    G.play.shake(12, 2);
    const b = w.balloonBooth;
    for (let i = 0; i < 12; i++) w.burst(b.x + 10 + (i % 4) * 8, b.y + 10 + Math.floor(i / 4) * 7, ['#e83030', '#f8d040', '#3878d8', '#38a048', '#ffffff'], 4, { speed: 1.4, life: 20, size: 2 });
    w.pop(b.x + 24, b.y - 4, 'POP POP POP POP!', '#f8f8f0');
    b.img = G.spr.balloonBoothEmpty;
    yield G.wait(40);
    yield G.say('Carny', '...');
    yield G.say('Carny', 'That... counts, I guess.');
    f.balloonWon = true;
    yield* S.rockGive('cementrock');
    yield G.say('Lily', 'You\'re welcome.');
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
  const SIX_SPOTS = [[23, 17], [31, 23], [36, 25], [30, 25], [6, 22], [10, 24], [15, 26], [33, 24], [12, 21], [27, 26]];

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
      w.addProp({ img: G.spr.feldspar, tx: 1, ty: 2, solid: [1, 2, 1, 1], hit: [1, 2, 1, 1], talk: say('A corn stalk named Feldspar, growing in a pot. Somehow, it\'s thriving.') });
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
      fill(0, 12, 40, 2, '='); // (off the west edge to College Hill, off the east toward the fairgrounds)
      fill(19, 14, 2, 16, '=');
      fill(6, 7, 1, 5, '=');
      fill(19, 7, 1, 5, '=');
      fill(33, 7, 1, 5, '=');
      // pond
      fill(8, 16, 7, 5, '#');
      fill(9, 17, 5, 3, '~');
      // tall grass
      fill(32, 22, 4, 3, '"');
      fill(33, 25, 3, 2, '"');
      fill(4, 23, 4, 3, '"');
      fill(11, 25, 3, 2, '"');
      // bushes
      [[17, 15], [17, 17], [17, 19], [23, 18], [23, 20], [11, 9], [12, 9], [25, 9], [26, 9], [28, 23], [29, 23], [15, 23], [16, 23]]
        .forEach(([x, y]) => set(x, y, 'b'));
      // fence along the top of the east lawn
      fill(32, 15, 5, 1, 'f');
      // the gravel bed of Van Wickle's rock garden (east side, like the real one)
      fill(34, 20, 4, 2, 'g');
      // tree border with a gap for the south road
      for (let x = 0; x < W; x += 2) { set(x, 0, 'T'); if (x < 18 || x > 20) set(x, 28, 'T'); }
      for (let y = 2; y < 28; y += 2) { if (y !== 12) { set(0, y, 'T'); set(38, y, 'T'); } }
      // scattered trees
      [[3, 16], [4, 20], [24, 23], [34, 17], [13, 22]].forEach(([x, y]) => set(x, y, 'T'));
      return g.map((r) => r.join(''));
    },
    setup(w) {
      w.addBuilding({ x: 3, y: 3, w: 7, h: 4, door: 3, style: 'brick', roof: '#4a5070', sign: true, to: { map: 'lab', x: 6, y: 7 } });
      // Pardee Hall: the Department of EEENGLISH opens once El EEENGLISH has had his main event
      w.addBuilding(Object.assign({ x: 14, y: 2, w: 11, h: 5, door: 5, style: 'stone', wall: '#c8bc9c', roof: '#50607a', tower: true }, flags().dadBeaten ? { to: { map: 'pardee', x: 7, y: 9 } } : { locked: S.pardeeDoor }));
      w.addBuilding({ x: 29, y: 3, w: 9, h: 4, door: 4, style: 'modern', wall: '#d8c8a0', roof: '#6a4a40', to: { map: 'science', x: 7, y: 9 } });
      // west, off the end of the main path: College Hill (Tom's Pizza, the grocery store).
      // It's finals week: Campus Safety keeps Nate on campus until he's passed the Chem Final.
      w.addTrigger(0, 12, 1, 2, () => G.play.warp('collegeHill', 30, 8, 'left'));
      if (!flags().chemPassed) {
        w.officer = w.add(new G.NPC({ sprite: 'officer', name: 'Campus Safety', x: 1 * 16 + 8, y: 12 * 16 + 14, dir: 'right', talk: S.campusSafety }));
        w.blockTiles(0, 12, 1, 2);
        w.addTrigger(2, 12, 1, 2, () => { if (!flags().chemPassed) G.script.run(S.campusSafety(true)); });
      }
      w.add(new G.Sign(2, 11, 'WEST: College Hill. Shops, groceries, and {y}Tom\'s Pizza{/}.'));
      // Van Wickle Hall: the geology building (walk into the arched front door)
      w.addProp({ img: G.spr.vanWickle, tx: 26, ty: 17, h: 4 });
      w.blockTiles(26, 17, 8, 4);
      w.block[20 * w.w + 27] = 0;
      w.addWarp(27, 20, 1, 1, 'geology', 10, 12, 'up');
      w.add(new G.Sign(25, 21, ['VAN WICKLE HALL', 'Geology & Environmental Geosciences. The college library from 1900 to 1963. Exhibits open weekdays.']));
      w.addProp({ img: G.spr.lamppost, tx: 25, ty: 19, dx: 2, solid: [25, 19, 1, 1] });
      // the rock garden: big specimens, oldest to youngest in Eastern Pennsylvania
      for (const [x, y, k] of [[34, 20, 'gneiss'], [35, 21, 'limestone'], [36, 20, 'conglomerate'], [37, 21, 'sandstone']]) {
        w.addProp({ img: G.spr.boulders[k], tx: x, ty: y, dx: -2, solid: [x, y, 1, 1], hit: [x, y, 1, 1], talk: () => S.rockGarden(k)() });
      }
      w.addProp({ img: G.spr.cart, tx: 22, ty: 14, h: 2, dx: -2, solid: [22, 14, 2, 2], hit: [22, 14, 2, 2], talk: S.vendor });
      // a big dolomite ledge by Van Wickle that only Doron can crack
      if (G.state.items.hammer) w.add(new G.BigRock(28 * 16, 22 * 16 + 12, 'dolomite', (r) => G.script.run(S.bigRockLift(r))));

      const npc = (sprite, name, tx, ty, talk, o = {}) =>
        w.add(new G.NPC(Object.assign({ sprite, name, x: tx * 16 + 8, y: ty * 16 + 14, talk }, o)));
      npc('ben', 'Ben', 9, 10, S.ben);
      npc('prof', 'Prof. Sunderlin', 30, 10, S.prof, { wander: 20 });
      npc('maya', 'Maya', 15, 18, S.maya, { dir: 'left' });
      npc('bismarck', 'Bismarck', 23, 9, S.bismarck, { wander: 16 });
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
        if (!flags().boulderGone && G.state.party.includes('doron')) G.script.run(S.suplexTime());
      });
      w.addTrigger(18, 29, 4, 1, () => G.play.warp('home', 1, 53, 'right'));
      w.add(new G.Sign(37, 11, 'EAST: Easton Fairgrounds. Tonight: {y}MICRO MAYHEM WRESTLING{/}!'));
      w.add(new G.Sign(35, 8, ['SCIENCE CENTER. Reopened (mostly) after "an incident involving homemade fireworks."', 'Today: {y}CHEMISTRY FINAL{/} with Dr. Nataro.']));
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
      w.addProp({ img: G.spr.bench, tx: 1, ty: 2, solid: [1, 2, 3, 1], hit: [1, 2, 3, 1], talk: S.acidTest });
      w.addProp({ img: G.spr.rockTray, tx: 1, ty: 2, dx: 15, dy: -10, base: 3 * 16 });
      for (const y of [4, 6, 8]) {
        for (const x of [2, 4, 10, 12]) {
          // (the back-left desk has the campus paper on it, with Ben in it)
          const paper = x === 2 && y === 8;
          w.addProp({ img: paper ? G.spr.schoolDeskPaper : G.spr.schoolDesk, tx: x, ty: y, solid: [x, y, 1, 1], hit: paper ? [x, y, 1, 1] : null, talk: paper ? S.benPaper : null });
        }
      }
      w.add(new G.NPC({ sprite: 'nataro', name: 'Dr. Nataro', x: 7 * 16 + 8, y: 3 * 16 + 14, dir: 'down', talk: S.chemFinal }));
      w.add(new G.NPC({ sprite: 'brooks', name: 'Brooks', x: 13 * 16 + 8, y: 7 * 16 + 14, dir: 'left', talk: S.brooks }));
      // the emergency shower and eyewash (Dr. Nataro upgrades the bidet here; it refills it too)
      w.addProp({ img: G.spr.safetyStation, tx: 12, ty: 2, solid: [12, 2, 1, 1], hit: [12, 2, 1, 1], talk: S.safetyShower });
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

  // Pardee Hall: one lecture hall of the Department of EEENGLISH.
  G.MAPS.pardee = {
    name: 'Pardee Hall: EEENGLISH 101',
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
      const F = furnish(w), sp = G.spr;
      w.addProp({ img: sp.chalkboardEng, tx: 5, ty: 1, flat: true, dy: -1, hit: [5, 1, 5, 1], talk: look('The chalkboard: "EEENGLISH 101." Underneath, in smaller letters: "muffins, channels, horns, breakfast, pints, cricket."') });
      F.hang(sp.sepiaPhoto, 1, 1, 2, look('A framed photo from Micro Mayhem: El EEENGLISH, mid-dropkick. Someone has written "OUR FOUNDER" on the frame.', ['Nate', 'That\'s my dad.']), 4);
      F.stand(sp.bookshelf2, 12, 2, 1, look('"The Complete Works of EEENGLISH." Every book has had extra Es added in pen.'));
      F.stand(sp.bookshelf2, 13, 2, 1, look('A whole shelf of English muffin cookbooks. All of them are from New York.'));
      w.addProp({ img: sp.desk, tx: 6, ty: 3, solid: [6, 3, 2, 1] });
      // (Bismarck left his law school prep book on one: he wants to be a lawyer)
      for (const y of [5, 7]) for (const x of [2, 4, 10, 12]) {
        const book = x === 4 && y === 7;
        w.addProp({ img: book ? sp.schoolDeskBook : sp.schoolDesk, tx: x, ty: y, solid: [x, y, 1, 1], hit: book ? [x, y, 1, 1] : null, talk: book ? S.lawBook : null });
      }
      w.prof = w.add(new G.NPC({ sprite: 'pembrook', name: 'Professor Pembrook', x: 8 * 16 + 8, y: 3 * 16 + 14, dir: 'down', talk: S.englishExam }));
      w.addWarp(7, 10, 1, 1, 'campus', 19, 7, 'down');
    },
    onEnter() {
      return (function* () {
        if (flags().engMet) return;
        yield G.wait(20);
        yield* S.englishExam();
      })();
    },
  };

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
      F.stand(sp.curio, 1, 3, 1, S.goodChina);
      F.hang(sp.frenchDoor, 3, 2, 1, look('French doors out to the side steps by the chimney.'), 1);
      w.addProp({ img: sp.brickFireplace, tx: 5, ty: 1, h: 3, flat: true, solid: [5, 3, 2, 1], hit: [5, 3, 2, 1], talk: look('The brick fireplace, with a landscape hung over the mantel.', 'The chimney outside is older than everybody in the family put together.') });
      F.hang(sp.frenchDoor, 8, 2, 1, look('More French doors. This house loves a French door.'), 1);
      if (f.fcBeaten) w.addProp({ img: sp.fc.sweater, tx: 7, ty: 3, dx: -7, solid: [7, 3, 1, 1], hit: [7, 3, 1, 1], talk: S.fcHome });
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
      w.addProp({ img: sp.basementDoor, tx: 22, ty: 7, flat: true, hit: [22, 7, 1, 1], talk: S.basementDoor });
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
      w.addProp({ img: sp.router, tx: 46, ty: 8, dy: -16, base: 8 * 16 + 16, hit: [46, 8, 1, 1], talk: S.wifi });
      F.stand(sp.writingDesk, 45, 8, 2, look('A writing desk buried in mail and old crossword puzzles.'));
      // ---- mudroom
      F.hang(sp.coatHooks, 37, 12, 2, look('Coat hooks, overloaded with coats from every season.'), 2);
      F.stand(sp.bootBench, 37, 13, 2, () => S.clueMudroom());
      F.stand(sp.washerDryer, 40, 13, 2, look('The washer and dryer. The dryer eats exactly one sock per load.'));
      // ---- family room
      F.hang(sp.bayWindow, 44, 12, 4, null, 1);
      F.stand(sp.blueHutch, 43, 13, 1, look('A light blue painted hutch full of pretty plates.'));
      F.stand(sp.trainTable, 45, 14, 2, look('An old wooden train table. Somebody built a whole little town on it.'));
      // ---- critters: Nate's corn, Nate's cereal and Nate's fireworks, all very much alive
      // house critters stay gone once beaten (flag gone_<map>_<x>_<y>)
      const at = (Kind, x, y) => {
        const id = 'gone_' + w.id + '_' + x + '_' + y;
        if (!flags()[id]) w.add(new Kind(x * 16 + 8, y * 16 + 14)).goneFlag = id;
      };
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
      F.stand(sp.nightRed, 4, 3, 1, () => S.clueNightstand());
      F.stand(sp.bedKing, 5, 3, 3, look('Dad and Michelle\'s room. The bed is made perfectly. Do not sit on it.'), { ht: 3 });
      F.stand(sp.nightRed, 8, 3, 1, look('The other nightstand. A reading lamp and Dad\'s glasses case.'));
      F.stand(sp.chairBlue, 11, 6, 1, look('A comfy reading chair by the closet.'));
      // ---- bathroom
      F.stand(sp.doubleVanity, 14, 3, 3, () => S.vanity());
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
      F.hang(sp.homeAtticHatch, 11, 10, 2, () => S.abeReach('attic'), 17);
      F.hang(sp.paintSmall, 28, 10, 1, look('A little painting of a flower pot.'), 8);
      // ---- Lily's room
      F.hang(sp.wallWindow.shade, 2, 15, 1, null, 3);
      F.hang(sp.paintBarn, 6, 15, 2, look('A painting of a red barn and a white horse.'), 8);
      F.stand(sp.hamper, 1, 16, 1, look('A wicker hamper. Full. Always full.'));
      F.stand(sp.bedLily, 4, 16, 2, look('Lily\'s bed: a navy quilt, leopard print pillows, and a flowered quilt folded at the foot.'), { ht: 3 });
      F.stand(sp.nightCream, 6, 16, 1, () => S.clueLily());
      F.stand(sp.dresser, 7, 16, 2, () => S.lilyDresser());
      F.stand(sp.catalogBin, 10, 16, 1, () => S.lilyCatalogs());
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
      // house critters stay gone once beaten (flag gone_<map>_<x>_<y>)
      const at = (Kind, x, y) => {
        const id = 'gone_' + w.id + '_' + x + '_' + y;
        if (!flags()[id]) w.add(new Kind(x * 16 + 8, y * 16 + 14)).goneFlag = id;
      };
      at(G.Corncob, 23, 6); at(G.Corncob, 25, 5); at(G.Corncob, 8, 11);
      at(G.Firework, 22, 5);
      at(G.CerealBox, 23, 18);
      w.addTrigger(13, 19, 2, 1, () => G.play.warp('homeDown', 17, 8, 'down'));
    },
  };

  // Dad's workshop: the inside of the garage, from the family's photos.
  // what Dad's up to in his workshop (a different one each time Nate walks in): where he stands,
  // which way he faces while he works, and what he says when Nate comes over (the dance practice is
  // a clue for the grocery store on College Hill: "...Stretching.")
  const DAD_SHOP = {
    lathe: { at: [11.5, 6.8], dir: 'down', hi: 'Mind the shavings!' },
    bench: { at: [9.5, 4.9], dir: 'up', hi: 'Feel that. Smooth as a church pew.' },
    pipe: { at: [6.5, 4.9], dir: 'down', hi: '*puff* Ah. Nate.' },
    sweep: { at: [10, 8.9], dir: 'right', hi: 'The war on sawdust continues.' },
    dance: { at: [12.5, 5.9], dir: 'left', hi: null },
  };
  G.MAPS.garage = {
    name: 'Dad\'s Workshop',
    music: 'house',
    tiles() {
      const W = 22, H = 13;
      const g = Array.from({ length: H }, () => Array(W).fill('w'));
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) g[y + j][x + i] = c; };
      fill(1, 1, 20, 2, 'K');
      fill(1, 3, 20, 9, 'm');
      fill(1, 12, 6, 1, 'u'); fill(15, 12, 6, 1, 'u');
      fill(8, 12, 6, 1, 'O');
      return g.map((r) => r.join(''));
    },
    setup(w) {
      const F = furnish(w), sp = G.spr, s = G.state;
      F.stand(sp.oldFridge, 1, 3, 1, () => S.garageFridge());
      F.stand(sp.shopShelves, 2, 3, 1, look('Shelves of jars, wood glue, stain, and mystery cans.'));
      F.stand(sp.shopShelvesPlane, 3, 3, 1, look('More shelves, with a model airplane parked up top.'));
      F.hang(sp.sepiaPhoto, 4, 2, 2, look('A big old sepia photograph of a crowded room from about a hundred years ago. Nobody knows who any of these people are.'), 4);
      // (the bass goes in first so talking to that end of the bench finds it)
      w.bassProp = w.addProp({ img: s.items.bass ? null : sp.bassOnBench, tx: 9, ty: 3, dx: -2, dy: -12, base: 4 * 16, hit: [9, 3, 3, 1], talk: () => S.bassBench() });
      F.stand(sp.workbench, 7, 3, 6, function* () {
        if (needKey() && !flags().key_bench) { yield* S.keyHuntMiss('bench')(); return; }
        yield G.say(null, 'Dad\'s workbench: pegboard full of tools, and every one of them is exactly where he left it.');
      });
      F.hang(sp.wallWindow.one, 13, 2, 1, null, 3);
      F.stand(sp.toolChest, 14, 3, 1, look('A big red rolling tool chest. Every drawer is a different kind of mess.'));
      F.stand(sp.lumberPile, 16, 3, 3, look('A stack of good lumber. It\'s for "a project." It has been for a project for years.'));
      F.stand(sp.bandsaw, 20, 3, 1, look('A bandsaw for cutting curves. Like the curves of a bass body.'));
      F.stand(sp.convertible, 2, 6, 3, look('The old red convertible, under a blanket of sawdust.', 'The trunk is covered in little handprints and a message nobody will admit to writing.'), { ht: 4 });
      F.stand(G.spr.hay, 1, 8, 1, look('A bale of straw for the chicken coop.'));
      F.stand(sp.feedBags, 1, 10, 2, look('Bags of layer feed. The hens know exactly where these are.'));
      F.stand(sp.drillPress, 8, 6, 1, look('A drill press older than Nate. It works better than Nate.'));
      F.stand(sp.lathe, 10, 7, 3, look('Dad\'s lathe. This is where the pipe bowls get turned. There are wood shavings in places wood shavings should never be.'));
      F.stand(sp.sander, 15, 6, 1, look('Drum and belt sanders. Everything in here is sanded. Even the air.'), { dx: -5 });
      F.stand(sp.tableSaw, 17, 6, 2, look('The table saw. Dad\'s rule: ten fingers in, ten fingers out.'));
      F.stand(sp.planer, 19, 9, 1, look('A yellow thickness planer. It is the loudest thing in New Jersey.'));
      F.stand(sp.miterSaw, 16, 9, 2, look('A miter saw on a rolling stand.'));
      F.stand(sp.dustCollector, 13, 10, 2, look('The dust collector. It is losing the war.'));
      F.stand(sp.shopVac, 7, 10, 1, look('An orange shop vac, also losing the war.'));
      F.stand(sp.buckets, 20, 11, 1, look('Five-gallon buckets. Every garage has somewhere between four and four hundred.'));
      // (clues for the grocery store on College Hill)
      w.addProp({ img: sp.highTops, tx: 13, ty: 4, dx: -2, dy: -2, hit: [13, 4, 1, 1], talk: function* () {
        yield G.say(null, 'A pair of brand-new white high-tops. There\'s a cassette tucked in one of them, labeled TUESDAY.');
        yield G.say('Nate', flags().hipHopDone ? 'His dancing shoes. Of course.' : 'Dad wears loafers. Dad has ALWAYS worn loafers.');
      } });
      // Dad, in the middle of something different every time Nate walks in (DAD_SHOP)
      const f = flags();
      if (f.homeArrived) {
        const acts = Object.keys(DAD_SHOP);
        let pick = acts[Math.floor(Math.random() * acts.length)];
        if (pick === f.dadAct) pick = acts[(acts.indexOf(pick) + 1) % acts.length];
        f.dadAct = w.dadAct = pick;
        const act = DAD_SHOP[pick];
        w.dad = w.add(new G.NPC({ sprite: 'dad', name: 'Dad', x: act.at[0] * 16, y: act.at[1] * 16, dir: act.dir, talk: S.dadWorkshop }));
        w.dad.home = { x: w.dad.x, y: w.dad.y };
        if (pick === 'sweep') { w.dad.held = sp.broom; w.dad.heldAt = [7, -6]; w.dad.vx = 0.4; }
        // his pipe smoke (a pipe break)
        w.dadSmoke = [];
        w.props.push({
          img: null, x: 0, y: 0, base: 99000,
          draw(ctx, cx, cy) { for (const r of w.dadSmoke) { ctx.globalAlpha = Math.max(0, 1 - r.t / 90); ctx.drawImage(G.spr.smokeRing, Math.round(r.x - 6) - cx, Math.round(r.y - r.t * 0.35) - cy); } ctx.globalAlpha = 1; },
        });
      }
      // muddy paw prints leading out the open bay (whoever took the Doritos)
      if (f.snackQuest && !s.items.doritos && !f.snacksDone) w.addProp({ img: sp.pawPrints, tx: 9, ty: 10, dy: 2, flat: true, hit: [9, 10, 3, 1], talk: look('Muddy paw prints in the sawdust. BIG ones. A torn corner of a blue chip bag.', 'They lead out the open bay, toward the brook.') });
      // out through the open middle bay
      w.addWarp(8, 12, 6, 1, 'home', 38, 34, 'down');
    },
    onEnter() {
      return (function* () {
        if (flags().workshop) return;
        flags().workshop = true;
        yield G.wait(20);
        yield G.say('Nate', 'Dad\'s workshop. It smells like sawdust and pipe tobacco. It always has.');
      })();
    },
    // Dad gets on with whatever he's doing (DAD_SHOP). When Nate comes over, he stops, turns
    // around and says hi; when Nate wanders off, he gets back to it.
    tick(w) {
      const dad = w.dad;
      for (const r of w.dadSmoke || []) r.t++;
      if (w.dadSmoke) w.dadSmoke = w.dadSmoke.filter((r) => r.t < 90);
      if (!dad || G.script.busy) return;
      const p = G.play.player, d = Math.hypot(p.x - dad.x, p.y - dad.y), act = w.dadAct, t = G.tick;
      if (d < 56 || (dad.paused && d < 76)) {
        if (!dad.paused) {
          dad.paused = true; dad.moving = false; dad.z = 0;
          dad.dir = G.dirToward(p.x - dad.x, p.y - dad.y);
          const hi = act === 'dance' ? (flags().hipHopDone ? 'POP AND LOCK!' : '...Stretching.') : DAD_SHOP[act].hi;
          w.pop(dad.x, dad.y - 34, hi, act === 'dance' && flags().hipHopDone ? '#f8e070' : '#f8f8f0');
        }
        return;
      }
      if (dad.paused) { dad.paused = false; dad.dir = DAD_SHOP[act].dir; }
      const wood = ['#d8b070', '#e8c890', '#b88a50'];
      if (act === 'lathe') {
        // turning a pipe bowl: shavings fly off the lathe, and he leans in now and then
        dad.dir = 'down';
        dad.z = (t >> 5) % 3 === 0 ? 1 : 0;
        if (t % 5 === 0) w.burst(11.5 * 16 + (Math.random() * 10 - 5), 7 * 16 + 2, wood, 1, { speed: 1.2, up: 1, g: 0.1, life: 18, size: 1 });
      } else if (act === 'bench') {
        // sanding something at the workbench: back and forth, sawdust puffing up
        dad.dir = 'up';
        dad.x = dad.home.x + Math.round(Math.sin(t * 0.22) * 3);
        if (t % 9 === 0) w.burst(dad.x, 3 * 16 + 12, ['#e8d8b0', '#d8c098'], 2, { speed: 0.5, up: 0.6, g: 0.02, life: 26, size: 1 });
      } else if (act === 'pipe') {
        // a pipe break: smoke rings drifting up, and a look around the shop now and then
        if (t % 80 === 0) w.dadSmoke.push({ x: dad.x + (dad.dir === 'left' ? -6 : 6), y: dad.y - 26, t: 0 });
        if (t % 160 === 0) dad.dir = ['down', 'left', 'down', 'right'][(t / 160) % 4];
      } else if (act === 'sweep') {
        // sweeping sawdust from one end of the shop to the other
        const x0 = 5.5 * 16, x1 = 15 * 16;
        dad.x += dad.vx;
        if (dad.x < x0 || dad.x > x1) { dad.vx = -dad.vx; dad.x = G.clamp(dad.x, x0, x1); }
        dad.dir = dad.vx > 0 ? 'right' : 'left';
        dad.moving = true; dad.anim = (dad.anim || 0) + 1;
        if (t % 14 === 0) w.burst(dad.x + (dad.vx > 0 ? 10 : -10), dad.y, ['#e8d8b0', '#c8b088'], 2, { speed: 0.6, up: 0.4, g: 0.04, life: 20, size: 1 });
      } else {
        // when he thinks nobody's looking: practicing (a few moves, a hop on each)
        const k = Math.floor(t / 26);
        if (t % 26 === 0 && k % 8 < 4) { dad.dir = ['left', 'right', 'up', 'down'][k % 4]; dad.hop = 12; }
        if (dad.hop > 0) { dad.hop--; dad.z = Math.round(Math.sin((1 - dad.hop / 12) * Math.PI) * 3); } else dad.z = 0;
      }
    },
  };

  // ================================================================ DAD'S PIPE BENCH
  // Once everything at home is done (G.homeDone: Mom's books, Dad's snacks, Ice JJ Fish booked), Dad
  // will teach Nate to make pipes and blend tobacco in the workshop.
  // Nate picks one out of Dad's book (the ones he hasn't made yet are ??? pencil silhouettes).
  // A pipe: cut it on the BANDSAW, turn it on the LATHE, SAND it (or sandblast it), bend the stem
  // (the bent ones), then STAIN it; every pipe is made a little differently (WORK). Tobacco: BLEND
  // it from Dad's jars (he says how many scoops are right), then PACK a bowl and light it. They're collectables: a pipe
  // changes how Dad's Pipe looks, and a tobacco changes the color of its smoke (picked in
  // COLLECTABLES). The whole time, Dad never stops talking about pipes, straight out of his real
  // pipe journal. (The pipes and tins themselves are drawn in art.js.)
  // State: s.pipesMade / s.tinsMade ({ id: { stars } }, and Abe's pipe keeps the stain Nate
  // picked), s.pipeSkin, s.tobacco. Flag: pipeBench. Each step starts with a HOW TO card.
  const FT = () => G.font;
  const RAW_BRIAR = '#e2bc8a';
  const STAINS = {
    black: { name: 'Black', color: '#2e2a2e' },
    cordovan: { name: 'Cordovan', color: '#4a2220' },
    tan: { name: 'British Tan', color: '#c06428' },
    light: { name: 'Light Brown', color: '#b8693a' },
    oil: { name: 'Danish Oil', color: null },
  };
  const STAIN_ORDER = ['black', 'cordovan', 'tan', 'light', 'oil'];
  // d: how hard it is (1-5 stars). stain: the right jar (Abe's pipe: whatever Nate picks).
  // coats: how many coats it wants.
  G.PIPES = [
    {
      id: 'black', num: 'P12', name: 'Black Sandblast', kind: 'A billiard, sandblasted, dyed black', d: 1, stain: 'black', coats: 1,
      intro: 'Start with an easy one. A billiard: straight sides, round bottom.',
      stainHint: 'This one had flaws all over, so it got sandblasted. Then black dye. Black hides everything.',
      facts: ['This block had flaws everywhere. A deep crack in the bowl. So I made it small.', 'Ugly briar? Sandblast it. The soft wood blows away, and the grain stands up.', 'Finish the mouthpiece first. THEN sandblast. Trust me.', 'Then it gets dyed black. Black finish: beautiful.'],
      made: 'Black. Cracked. Beautiful. That one\'s a keeper.',
    },
    {
      id: 'silver', num: 'P14', name: 'Silver Band', kind: 'A squashed tomato, with a silver band', d: 2, stain: 'oil', coats: 1,
      intro: 'A squashed tomato. That\'s really what they call this shape.',
      stainHint: 'No stain on this one. The briar is already a rich, deep red. Just oil.',
      facts: ['Squashed tomato. I am not making that up. Ask any pipe maker.', 'I wanted to try a silver band. It goes right where the stem meets the shank.', 'Make the top a little concave on the lathe. Then the drill finds the center by itself.', 'No stain on this one. The briar is already a rich, deep red.'],
      made: 'Look at that red. God made that color. I just got out of the way.',
    },
    {
      id: 'castello', num: 'P17', name: 'Castello Copy', kind: 'Long shank, short stem, light brown', d: 2, stain: 'light', coats: 1,
      intro: 'I copied this one from a Castello I saw in a pipe shop in Florence.',
      stainHint: 'Light brown stain. One coat, nice and even.',
      facts: ['Long shank, short stem. Like the Caminetto I bought in Sicily.', 'A smaller bowl is a shorter smoke. And it fits so nice in your hand.', 'Twelve percent. That\'s how much water should be in briar before you start working it.', 'I bought a moisture meter just to check. The briar kept losing weight for weeks.'],
      made: 'Not bad for a copy. Castello would be proud. Or confused.',
    },
    {
      id: 'minecraft', num: 'P7', name: 'Minecraft Pipe', kind: 'Abe\'s: eight panels, square shank', d: 3, stain: null, coats: 1,
      intro: 'Your brother asked me for a "Minecraft pipe." So. Here we go.',
      stainHint: 'I asked Abe which finish he wanted. He never answered. You pick.',
      facts: ['Eight sides. Bevels on the bottom. NOT on the top. He was very clear.', 'Medium size. He said "medium." I asked him twice.', 'I modeled it after a 1957 Dunhill. Don\'t tell Abe. He thinks it\'s from Minecraft.', 'Turn it round first. Then the eight panels get sanded flat on the wheel. Then by hand.', 'The grain is a mix: some bird\'s-eye, some cross-cut straight.', 'The drill is four millimeters. The air hole has to meet the very bottom of the chamber.'],
      made: 'A Minecraft pipe. ...I still don\'t know what Minecraft is.',
    },
    {
      id: 'cordovan', num: 'P13', name: 'Cordovan Dublin', kind: 'A Dublin, sandblasted, Cordovan dye', d: 3, stain: 'cordovan', coats: 1,
      intro: 'My very first sandblast. A Dublin: it gets wider toward the top.',
      stainHint: 'The dye is Cordovan. It\'s leather dye, really. On this one, darker is better.',
      facts: ['A Dublin is shaped like a cone. Narrow at the heel, wide at the rim.', 'The dye is Cordovan. Leather dye. On this one, darker is better.', 'Dark brown looks classy. It gives a pipe an old look.', 'I broke one on the lathe once. The tool caught the wood and SNAP. Disappointing.'],
      made: 'Classy. Old-looking. Like your father.',
    },
    {
      id: 'prince', num: 'P15', name: 'Long-Stem Prince', kind: 'A prince: low bowl, long stem', d: 3, stain: 'light', coats: 2,
      intro: 'A prince: a low, round bowl and a long, long stem.',
      stainHint: 'Light brown. And TWO coats on this one.',
      facts: ['This was a little tomato, just for practice. It turned out GREAT. So: a long stem.', 'A long stem keeps the smoke cool. It has farther to travel.', 'Light brown, two coats. The second coat makes it glow.', 'Light passes on the lathe. You can always take more off. You can\'t put it back.'],
      made: 'Very royal. You may now address me as Your Highness.',
    },
    {
      id: 'tan', num: 'P16', name: 'British Tan Bent', kind: 'A king-sized bent billiard', d: 4, stain: 'tan', coats: 1,
      intro: 'A king-sized bent billiard. A big round bowl.',
      stainHint: 'The dye on this one is named after a country. And a kind of brown.',
      facts: ['I was trying for a more dramatic bend on this one.', 'Take care to get the right angle for the stem. Measure! Then measure again.', 'You bend a mouthpiece with heat. Slowly. VERY slowly.', 'Do NOT push too far, or you\'ll break the shank.'],
      made: 'Now THAT is a bend.',
    },
    {
      id: 'strawberry', num: '18P', name: 'Strawberry Briar', kind: 'A bent Dublin. No stain, just Danish oil', d: 5, stain: 'oil', coats: 2,
      intro: 'Strawberry briar. Look at all those little red spots.',
      stainHint: 'No stain. Just Danish oil, two coats. With no stain, every mistake shows. Every single one.',
      facts: ['It\'s called strawberry briar. All those little red spots.', 'No stain. Just Danish oil, two coats. Wipe it on, let it soak in.', 'Sanded all the way to fifteen hundred grit.', 'The mouthpiece is Japanese vulcanite. WAY better than German.', 'I numbered it 18P by mistake. I put the number before the P.', 'Polished it with a brand-new buffer. So much better.'],
      made: 'Strawberry briar. My favorite. Don\'t tell the other pipes.',
    },
  ];
  // whatever else is on his mind (from his pipe journal, mostly)
  const PIPE_TALK = [
    'Briar is the burl of the tree heath. It grows on rocky hillsides around the Mediterranean.',
    'An ebauchon block is from the heart of the burl. A plateau block still has bark on top.',
    'Sand up to eight hundred. Tripoli buff. White polish. Then Danish oil.',
    'I had a block of briar explode while I was drilling it. Just exploded.',
    'Sometimes you cut a block open and it\'s all pits and cracks. Breaks your heart.',
    'If there are holes going into the chamber, you throw it out. No pipe is worth a leak.',
    'Every pipe I make gets a number. They\'re all in my little notebook.',
    'Ten blocks of briar. Two hundred and ten dollars. FREE shipping.',
    'My first pipe was a wedding present. A Peterson\'s Dublin. Pipe of the Year, 2003.',
    'I bought a pipe from a man on the street, right in front of the Vatican.',
    'Our last day in Italy, I took a long walk in Florence. I smoked my pipe and I prayed.',
    'A good pipe is like a good sermon. It takes patience.',
    'Virginia smoke is acidic. Burley smoke is alkaline. I think about pH often.',
    'Rusticated pipes are wonderful for clenching. They don\'t slip in your teeth.',
  ];
  // Dad's jars: the leaf (and two toppings) every blend is made from
  const LEAF = {
    va: { name: 'Bright Virginia', tag: 'VA', color: '#e0b050', about: 'Flue-cured. Full of natural sugar. Sweet, grassy, a little citrus.' },
    red: { name: 'Red Virginia', tag: 'RED', color: '#a8582c', about: 'Virginia left on the stalk longer. Darker and fruitier, like raisins.' },
    bur: { name: 'Burley', tag: 'BUR', color: '#9a7448', about: 'Air-cured. Hardly any sugar. Nutty, a little like cocoa.' },
    ken: { name: 'Dark-Fired Kentucky', tag: 'KEN', color: '#5a3a22', about: 'Cured over hardwood fires. Smoky and strong.' },
    per: { name: 'Perique', tag: 'PER', color: '#3a2418', about: 'Pressed in barrels for a year. Grown in one parish in Louisiana. Spicy.' },
    lat: { name: 'Latakia', tag: 'LAT', color: '#201814', about: 'Smoked over smoldering wood until it goes black. A campfire in a jar.' },
    ori: { name: 'Oriental', tag: 'ORI', color: '#c8b058', about: 'Little sun-dried leaves from Greece and Turkey. Spicy and flowery.' },
    cav: { name: 'Black Cavendish', tag: 'CAV', color: '#2a1a14', about: 'Not a leaf, a recipe: steamed and pressed until it goes black. Mild and sweet.' },
    chr: { name: 'Cherry', tag: 'CHR', color: '#c82838', about: 'A cherry topping. Smells like a candy store.' },
    van: { name: 'Vanilla', tag: 'VAN', color: '#f0e0b0', about: 'A vanilla topping. The one people actually like the smell of.' },
  };
  const LEAF_ORDER = ['va', 'red', 'bur', 'ken', 'per', 'lat', 'ori', 'cav', 'chr', 'van'];
  // The tobaccos from Dad's pipe journal. mix: the four scoops (the recipe, from what's in the
  // real blend). smoke: the color its smoke puffs out of Dad's pipe.
  G.TOBACCOS = [
    {
      id: 'lane1q', name: 'Lane 1-Q', kind: 'Lane Limited. An aromatic', d: 1, mix: ['va', 'cav', 'ken', 'van'], smoke: '#f8ecd0',
      clue: 'Some Virginia, some black Cavendish, a touch of fire-cured Kentucky, and vanilla on top.',
      facts: ['My very first pipe smoked nothing but 1-Q. For YEARS.', 'It\'s the best-selling bulk pipe tobacco in America.', 'Golden Cavendish is just Virginia, steamed and pressed. That\'s why it\'s sweet.'],
      taste: 'Smooth and sweet. Just like my first pipe.',
    },
    {
      id: 'borkum', name: 'Borkum Riff Cherry', kind: 'Borkum Riff. Cherry Cavendish', d: 1, mix: ['cav', 'va', 'chr', 'van'], smoke: '#f890b0',
      clue: 'Black Cavendish and Virginia. Then cherry. And a little vanilla.',
      facts: ['The first thing I ever smoked in the pipe I bought in Rome. Cherry!', 'In Europe they\'re not allowed to call it Cherry anymore. There it\'s "Ruby."', 'It started out in Sweden.'],
      taste: 'Cherry! The whole street is going to know.',
    },
    {
      id: 'maidenLane', name: 'Maiden Lane', kind: 'Barclay-Rex, New York. An English', d: 2, mix: ['va', 'va', 'per', 'lat'], smoke: '#c8a888',
      clue: 'An English, from a shop in Manhattan. Mostly Virginia, some Perique, some Latakia.',
      facts: ['I bought my rusticated Savinelli in Manhattan. This was the first thing I smoked in it.', 'Barclay-Rex has been selling pipes in New York since 1910.', 'They sell it loose, by the scoop. That\'s why it\'s in a jar.', 'People say it tastes a little like dark chocolate.'],
      taste: 'A little smoky. A little like dark chocolate.',
    },
    {
      id: 'capstan', name: 'Capstan Blue', kind: 'Original Navy Cut. A Virginia flake', d: 2, mix: ['va', 'va', 'red', 'red'], smoke: '#a8d8f8',
      clue: 'Navy flake. All Virginia: bright and red, half and half. Pressed hard and sliced thin.',
      facts: ['W.D. & H.O. Wills made it in Bristol, England, more than a hundred years ago.', 'A capstan is the big drum on a ship that winds up the anchor rope.', 'Sailors used to roll their tobacco up tight in canvas and slice it off. That\'s a navy cut.', 'I smoked it in my poker from Florence. AND in the Caminetto.'],
      taste: 'Strong Virginia. A real sailor\'s smoke.',
    },
    {
      id: 'orlik', name: 'Orlik Golden Sliced', kind: 'Orlik, Denmark. A Virginia flake', d: 2, mix: ['va', 'va', 'va', 'per'], smoke: '#f8d070',
      clue: 'Golden Sliced. Virginias. Lots of Virginias. And just a touch of Perique.',
      facts: ['It\'s made in Denmark.', 'For years the tin said burley, not Perique. Somebody mistranslated it.', 'Open the tin and it smells like hay and lemons.', 'I smoked it in the Caminetto from Sicily.'],
      taste: 'Hay and lemons. Like summer.',
    },
    {
      id: 'royalJersey', name: 'Royal Jersey', kind: 'Germain\'s, Isle of Jersey. A Latakia mixture', d: 3, mix: ['va', 'va', 'ori', 'lat'], smoke: '#c8a0f0',
      clue: 'Virginia at the heart. Little sun-dried leaves from Greece and Turkey. And a campfire.',
      facts: ['The second thing I ever smoked in my Savinelli.', 'Germain\'s has been making tobacco on the island of Jersey since 1820.', 'Jersey is a tiny island between England and France. It has its own cows. Famous cows.', 'The tin is purple, with a gold mace on it. Very royal.'],
      taste: 'Rich. A little spicy. Fit for a king.',
    },
    {
      id: 'scottishCake', name: 'Scottish Cake', kind: 'Robert McConnell. A broken cake', d: 3, mix: ['red', 'red', 'ken', 'per'], smoke: '#f0a868',
      clue: 'Dark Virginias, some dark-fired Kentucky, and a pinch of Perique. Pressed for weeks.',
      facts: ['I smoked this in the poker I bought in Florence.', 'One of McConnell\'s original blends. From 1848!', 'It gets pressed for weeks into a cake, then broken up.', 'Open the tin and it smells like raisins and figs.'],
      taste: 'Dark and fruity. Raisins. Figs. Wonderful.',
    },
    {
      id: 'oldGowrie', name: 'Old Gowrie', kind: 'Rattray\'s. A broken flake', d: 4, mix: ['va', 'va', 'ken', 'per'], smoke: '#f0e080',
      clue: 'Mostly the bright, sweet stuff. Some fire. And a little spice.',
      facts: ['Margate and Old Gowrie were my two favorites in the Caminetto.', 'The Carse of Gowrie is in Scotland, right along the River Tay.', 'A broken flake: pressed, sliced, then crumbled up.', 'Rattray\'s started out in Perth, Scotland.'],
      taste: 'Sweet. A little smoke. A little spice. One of my favorites.',
    },
    {
      id: 'margate', name: 'Margate', kind: 'Esoterica. A Full English', d: 4, mix: ['lat', 'lat', 'ori', 'va'], smoke: '#9898a8',
      clue: 'A Full English. More campfire than anything else. Some spice. Just a little Virginia.',
      facts: ['One of my two favorites. Margate and Old Gowrie.', 'A Full English has no flavoring at all. Just leaf. And smoke.', 'The same people who make Royal Jersey blend it, on the island of Jersey.', 'Latakia used to come from Syria. Now it comes from Cyprus.'],
      taste: 'Smoke. Spice. A campfire. My favorite.',
    },
    {
      id: 'cravensClaw', name: 'Craven\'s Claw', kind: 'Rich\'s, Portland. Fermented Virginia', d: 5, mix: ['red', 'red', 'red', 'va'], smoke: '#98d8a8',
      clue: 'Old Virginia, fermented until it goes dark. And one scoop of the bright stuff to wake it up.',
      facts: ['Rich\'s is a tobacco shop in Portland, Oregon. Open since 1894.', 'Fermented Virginia flakes. You rub them out by hand.', 'I smoked it in the Caminetto. Good. Not Margate good.', 'Fermenting tobacco is like aging cheese. It just gets deeper.'],
      taste: 'Deep and creamy. Sweet, with a little spice.',
    },
  ];
  const PIPE_BY = {}, TOB_BY = {};
  for (const p of G.PIPES) PIPE_BY[p.id] = p;
  for (const t of G.TOBACCOS) TOB_BY[t.id] = t;
  const pipesMade = () => (G.state.pipesMade = G.state.pipesMade || {});
  const tinsMade = () => (G.state.tinsMade = G.state.tinsMade || {});
  G.pipeHas = (id) => !!pipesMade()[id];
  G.tinHas = (id) => !!tinsMade()[id];
  G.pipesMadeCount = () => G.PIPES.filter((p) => G.pipeHas(p.id)).length;
  G.tinsMadeCount = () => G.TOBACCOS.filter((t) => G.tinHas(t.id)).length;
  G.pipeInfo = (id) => PIPE_BY[id];
  G.tinInfo = (id) => TOB_BY[id];
  // the smoke's color, from whatever tobacco is packed in Dad's pipe (null: plain gray)
  G.smokeColor = () => { const t = G.state && TOB_BY[G.state.tobacco]; return t ? t.smoke : null; };
  // a pipe's finished colors with this stain (its own stain: the colors in the photos)
  function pipeColors(pipe, stain) {
    const g = G.art.PIPE_GEO[pipe.id];
    if (!stain || stain === pipe.stain || (stain === 'oil' && !pipe.stain)) return { wood: g.wood, shankWood: g.shankWood || g.wood };
    const c = STAINS[stain].color || g.wood;
    return { wood: c, shankWood: c };
  }
  // a pipe the way Nate made it (or Dad's own, for 'dad')
  G.pipeLook = (id, scale = 1) => {
    const pipe = PIPE_BY[id], made = pipesMade()[id];
    return G.art.pipeArt(id, scale, pipe ? pipeColors(pipe, made && made.stain) : {});
  };
  // the stars for a score out of 100
  const starsFor = (score) => (score >= 90 ? 3 : score >= 72 ? 2 : 1);
  // the little pipe at Nate's mouth while he puffs, in the colors of the one he picked
  const smallCache = {};
  G.pipeSmall = (left) => {
    const id = G.state && G.state.pipeSkin, pipe = PIPE_BY[id];
    if (!pipe || !G.pipeHas(id)) return left ? G.spr.pipeSmallL : G.spr.pipeSmall;
    const made = pipesMade()[id], { wood } = pipeColors(pipe, made.stain), key = id + wood + (left ? 'L' : '');
    if (smallCache[key]) return smallCache[key];
    const src = G.spr.pipeSmall, c = G.canvas(src.width, src.height), x = c.getContext('2d');
    x.drawImage(src, 0, 0);
    const img = x.getImageData(0, 0, c.width, c.height), hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const swap = [[hex('#9a5530'), hex(wood)], [hex('#6a3418'), hex(G.art.shade(wood, -0.35))]];
    for (let i = 0; i < img.data.length; i += 4) for (const [from, to] of swap) if (img.data[i] === from[0] && img.data[i + 1] === from[1] && img.data[i + 2] === from[2]) { img.data[i] = to[0]; img.data[i + 1] = to[1]; img.data[i + 2] = to[2]; }
    x.putImageData(img, 0, 0);
    if (G.art.PIPE_GEO[id].band) { x.fillStyle = '#d8dce4'; x.fillRect(3, 3, 1, 1); }
    return (smallCache[key] = left ? G.art.mirror(c) : c);
  };

  // ---- bits every bench screen shares
  // a gray pencil sketch of a pipe or tin (one Nate hasn't made yet)
  const pencilCache = new Map();
  function pencilOf(img) {
    let c = pencilCache.get(img);
    if (c) return c;
    c = G.canvas(img.width, img.height);
    const x = c.getContext('2d');
    x.drawImage(img, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = '#b4b0a8'; x.fillRect(0, 0, c.width, c.height);
    pencilCache.set(img, c);
    return c;
  }
  function corners(ctx, x, y, w, h, c) {
    ctx.fillStyle = c;
    for (const [cx, cy, dx, dy] of [[x, y, 1, 1], [x + w - 1, y, -1, 1], [x, y + h - 1, 1, -1], [x + w - 1, y + h - 1, -1, -1]]) {
      ctx.fillRect(Math.min(cx, cx + dx * 3), cy, 4, 1); ctx.fillRect(cx, Math.min(cy, cy + dy * 3), 1, 4);
    }
  }
  // the workshop wall behind everything, with the step's name across the top
  function benchBack(ctx, title, sub) {
    ctx.fillStyle = '#2a1e16'; ctx.fillRect(0, 0, G.W, G.H);
    ctx.fillStyle = '#33251b'; for (let y = 14; y < 132; y += 12) ctx.fillRect(0, y, G.W, 1);
    ctx.fillStyle = '#16100c'; ctx.fillRect(0, 0, G.W, 12);
    FT().draw(ctx, title, 4, 2, '#f8d850', { shadow: '#000' });
    if (sub) FT().draw(ctx, sub, G.W - 4 - FT().width(sub), 2, '#c8b898', { shadow: '#000' });
  }
  // Dad, talking the whole time Nate works: this one's facts first, then whatever's on his mind.
  // say(): something he has to say RIGHT NOW (a catch on the lathe, the wrong jar).
  // (who: whose face is on the strip; extra: what else they ramble about once the facts run out)
  function dadTalk(facts, who = 'dad', extra = PIPE_TALK) {
    const more = extra.slice().sort(() => Math.random() - 0.5);
    return {
      lines: facts.concat(more), i: 0, t: 0, now: null, nowT: 0,
      say(line) { this.now = line; this.nowT = 210; },
      update() {
        if (this.nowT > 0) { this.nowT--; return; }
        if (++this.t > 320) { this.t = 0; this.i = (this.i + 1) % this.lines.length; }
      },
      draw(ctx) {
        G.box(ctx, 2, 133, 236, 25);
        const face = G.sprites[who] && G.sprites[who].down[0];
        if (face) ctx.drawImage(face, 0, 0, face.width, 14, 6, 138, face.width, 14);
        const line = this.nowT > 0 ? this.now : this.lines[this.i];
        FT().wrap(line, 204).slice(0, 2).forEach((l, k) => FT().draw(ctx, l, 27, 136 + k * 10, this.nowT > 0 ? '#f8d850' : '#f8f8f0', { shadow: '#0c0814' }));
      },
    };
  }
  // ENTER quits partway through (the step's result is 'quit')
  const quitHit = () => { if (!G.input.hit('start')) return false; G.input.eat('start'); G.audio.sfx('cancel'); return true; };
  // holding Z (to stain, blast or heat) only counts once Z has been let go since the step started:
  // the press that picked the jar or closed the HOW TO card is still down for a moment
  const zHeld = (cmd) => { if (!G.input.down('a')) cmd.zReady = true; return !!cmd.zReady && G.input.down('a'); };

  // ---- how to do the next step: a card over the workshop wall (Z: got it)
  function howToCmd(title, lines, back) {
    return {
      start() { this.t = 0; G.play.overlay = this; G.audio.sfx('menu'); },
      update() { if (++this.t > 12 && (G.input.hit('a') || G.input.hit('b'))) { G.input.eat('a'); G.input.eat('b'); G.audio.sfx('select'); return true; } return false; },
      draw(ctx) {
        (back || benchBack)(ctx, 'HOW TO: ' + title);
        G.box(ctx, 10, 20, 220, 132);
        let y = 28;
        for (const l of lines) {
          FT().wrap(l, 196).forEach((row, k) => { FT().draw(ctx, (k ? '  ' : '- ') + row, 18, y, '#f8f8f0', { shadow: '#0c0814' }); y += 10; });
          y += 4;
        }
        if ((this.t >> 4) % 2) FT().draw(ctx, 'Z: got it', 222 - FT().width('Z: got it'), 140, '#f8d850', { shadow: '#0c0814' });
      },
    };
  }
  const HOW_TO = {
    saw: ['Dad drew the pipe on the block. The block feeds into the blade by itself.', 'Hold ↑↓ to slide the block and keep the blade right ON the pencil line.', 'The pipe is ABOVE the line: cut into it and the block is ruined. Below the line just leaves extra wood.', 'Two cuts: the bottom, then the block turns for the back of the bowl. Knots make it jump.'],
    lathe: ['The briar spins and the gouge rides along it by itself. Hold ↓ to cut in, ↑ to back off.', 'Cut down to the white line, a little each pass. It turns green where it\'s right; red is too deep.', 'Watch the BITE bar: in the red, it CATCHES. Too many catches and it SNAPS.'],
    sand: ['Sand off the tool marks, one grit at a time: rough paper first, then finer.', '↑↓ moves the sandpaper to a spot on the pipe. Tap ← → ← → to sand it until its scratches are gone.', 'Then move on! Keep sanding a smooth spot and it goes flat. Too many flat spots and it\'s ruined.'],
    panels: ['Eight panels, sanded flat on the wheel. One grit at a time.', '← → picks a panel. Tap ↑ ↓ ↑ ↓ to sand it until its scratches are gone.', 'Then move on! Keep going on a smooth panel and its edges go round. Too many and it\'s ruined.'],
    blast: ['Sandblasting: the soft wood blows away and the grain stands up.', 'Move the nozzle with the arrows. HOLD Z to blast every bit of bare briar.', 'The rim and the end of the shank are taped. Stay off the tape! Blast through it and the briar under it is ruined.'],
    bend: ['The stem gets bent with heat. HOLD Z under the heat gun until the bar is in SOFT.', 'Hold ↓ to bend it (↑ straightens it) until it matches Dad\'s template. It only bends while it\'s soft.', 'Too hot and it bubbles. When it matches, press X to set it in cold water.'],
    stain: ['Pick the right jar with ↑↓ and Z. (Dad tells you which.)', 'Move the dauber with the arrows. HOLD Z to rub the stain on. Cover every bit before it dries.', 'Missed spots blink. Two-coat pipes: go over everything twice. On the harder pipes, too much puddles: keep moving.'],
    blend: ['Pick a jar with the arrows. Z adds a scoop. X puts the last one back.', 'A blend is four scoops. Dad tells you what goes in it.', 'With four in, he sniffs it and tells you how many are right.'],
    pack: ['The needle goes up and down. Press Z when it\'s inside the green box.', 'Three pinches: gently, then a little firmer, then firm.'],
    fight: ['← → walk (tap twice to dash). ↑ jump. ↓ crouch: it ducks high punches. Z punch, X kick; ↓+Z a low jab, ↓+X a sweep.', 'In the air, Z or X plus a direction: nothing = spin kick, toward him = flying knee, away = back kick, ↑ = up swipe, ↓ = a stomp that SPIKES him.', 'Hold away from him (or hold V) to block; add ↓ for low kicks. Tap V as a hit lands to PARRY. C grabs: the ARMY SUPLEX. ↓ then → then Z: TAKEDOWN. Full FIGHT meter: C is GROUND AND POUND. Win two rounds.'],
    jam: ['Notes slide down the strings. Hit each one with its arrow (← ↓ ↑ →) right as it crosses the pickup at the bottom.', 'Two notes at once? Press both arrows.', 'Hits fill the GROOVE meter, misses drain it. If it empties, Abe stops the band. Make it to the end of the song.'],
    jam_bongos: ['← hits the little drum (the macho), → the big one (the hembra). Hit each note right as it lands on its drum.', 'Hits fill the GROOVE meter, misses drain it. If it empties, Abe stops the band. Make it to the end of the song.'],
    jam_pan: ['Every dent in the steel drum is a note: ← ↓ ↑ → from low to high. Hit each note right as it lands on its dent.', 'Hits fill the GROOVE meter, misses drain it. If it empties, Abe stops the band. Make it to the end of the song.'],
    jam_kit: ['← hi-hat, ↓ kick drum, ↑ snare, → crash and toms. Hit each note right as it lands on its drum.', 'Two at once (like kick and hi-hat)? Press both arrows.', 'Hits fill the GROOVE meter, misses drain it. If it empties, Abe stops the band.'],
  };

  // ---- the book: pick what to make. Ones Nate hasn't made are pencil sketches, named ???.
  function bookCmd(kind) {
    const pipes = kind === 'pipe', list = pipes ? G.PIPES : G.TOBACCOS, cols = pipes ? 4 : 5, cw = pipes ? 57 : 45, ch = 50;
    const has = (it) => (pipes ? G.pipeHas(it.id) : G.tinHas(it.id));
    const art = (it) => (pipes ? G.pipeLook(it.id, 0.75) : G.spr.tins[it.id]);
    return {
      start() { this.sel = 0; G.play.overlay = this; },
      update() {
        const inp = G.input, n = list.length, col = this.sel % cols, go = (d) => { this.sel += d; G.audio.sfx('menu'); };
        if (inp.hit('left') && col > 0) go(-1);
        if (inp.hit('right') && col < cols - 1 && this.sel + 1 < n) go(1);
        if (inp.hit('down') && this.sel + cols < n) go(cols);
        if (inp.hit('up') && this.sel >= cols) go(-cols);
        if (inp.hit('a')) { inp.eat('a'); G.audio.sfx('select'); this.result = list[this.sel]; return true; }
        if (inp.hit('b') || quitHit()) { inp.eat('b'); G.audio.sfx('cancel'); this.result = null; return true; }
        return false;
      },
      draw(ctx) {
        // a page of Dad's journal (lined paper, a red margin, everything in pencil)
        const pencil = '#4a4a52';
        ctx.fillStyle = '#f2ecdc'; ctx.fillRect(0, 0, G.W, G.H);
        ctx.fillStyle = '#dcdcea'; for (let y = 13; y < G.H; y += 10) ctx.fillRect(0, y, G.W, 1);
        ctx.fillStyle = '#e8b0a8'; ctx.fillRect(4, 0, 1, G.H);
        FT().draw(ctx, pipes ? 'DAD\'S PIPE BOOK' : 'DAD\'S TOBACCO JARS', 9, 3, pencil);
        const cnt = G.sayable(list.filter(has).length) + '/' + G.sayable(list.length) + ' made';
        FT().draw(ctx, cnt, G.W - 6 - FT().width(cnt), 3, pencil);
        list.forEach((it, i) => {
          const x = 7 + (i % cols) * cw, y = 15 + Math.floor(i / cols) * ch, a = art(it), made = has(it);
          ctx.drawImage(made ? a : pencilOf(a), x + Math.round((cw - a.width) / 2), y + 3 + Math.round((30 - a.height) / 2));
          const st = '★'.repeat(it.d);
          FT().draw(ctx, st, x + Math.round((cw - FT().width(st)) / 2), y + 37, made ? '#d89a20' : '#a8a4a0');
          if (i === this.sel) corners(ctx, x, y, cw - 1, ch - 2, '#c83838');
        });
        // the one the pencil's on
        const it = list[this.sel], made = has(it), y = 116;
        ctx.fillStyle = '#e6dec8'; ctx.fillRect(0, y - 3, G.W, G.H - y + 3);
        ctx.fillStyle = '#c8bca0'; ctx.fillRect(0, y - 3, G.W, 1);
        FT().draw(ctx, made ? it.name : '???', 8, y, made ? '#2a2a32' : pencil);
        const best = made ? (pipes ? pipesMade() : tinsMade())[it.id].stars : 0;
        if (made) FT().draw(ctx, '{y}' + '★'.repeat(best) + '{d}' + '★'.repeat(3 - best), G.W - 8 - FT().width('★★★'), y, '#d89a20');
        FT().draw(ctx, made ? it.kind : 'Not made yet. Dad will tell you about it.', 8, y + 10, '#6a6a72');
        FT().draw(ctx, 'Hard: ' + '★'.repeat(it.d), 8, y + 20, '#8a8478');
        FT().draw(ctx, 'Z: make it   X: not now', G.W - 8 - FT().width('Z: make it   X: not now'), y + 31, pencil);
      },
    };
  }

  // ---- How each pipe gets made, and how hard each part is. Every pipe has its own:
  //   saw:    two bandsaw cuts: Dad's pencil lines on the block, as [along, down] points (the pipe is
  //           ABOVE the line). feed: how fast the block moves; tol: how far off the line is fine;
  //           ruin: how far into the pipe ruins the block; knots: where the block jolts
  //   lathe:  the layout, left (the shank end) to right (the rim): sections n columns long, turned
  //           to radius r (or tapering [from, to], or a ball [end, middle, end]), plus anything
  //           special: fragile (a catch there snaps it), tight (the silver band's seat), noCut (the
  //           square shank, the plateau: leave them alone), crack (cut deep there and it opens up),
  //           flaws (pits, just for looks), odd (a lumpy block), from (a shank starts this far above
  //           its line: the bandsaw already trimmed it). Then how fast it rides, how many
  //           passes, the tolerance, the safe bite, and how many catches before it snaps
  //   finish: 'sand' (in bands), 'panels' (eight panels on the wheel) or 'blast' (sandblasting)
  //   bend:   the bent ones: the angle on Dad's template, how close is close enough, how fast it heats
  //   stain:  how long until it dries, (the harder ones) how much extra before it puddles, and its
  //           own pass mark (a blotchy stain just gets sanded back and done again)
  //   pass:   the lowest score a step can get before the pipe's ruined
  const WORK = {
    black: {
      pass: 30,
      saw: { feed: 0.5, tol: 6, ruin: 16, knots: [], cuts: [[[0, 40], [150, 40], [190, 45], [220, 56]], [[0, 30], [160, 31]]] },
      lathe: { speed: 0.55, passes: 4, tol: 5.2, bite: 20, catches: 6, flaws: true, layout: [{ n: 50, r: 8, from: 12 }, { n: 20, r: [10, 19] }, { n: 90, r: 19 }] },
      finish: 'blast', blast: { size: 11, tape: 50, tears: 8, time: 1600 },
      stain: { time: 2400, puddle: null, pass: 30 },
    },
    silver: {
      pass: 40,
      saw: { feed: 0.6, tol: 5.2, ruin: 14, knots: [110], cuts: [[[0, 38], [90, 38], [130, 46], [170, 54], [210, 56]], [[0, 48], [40, 34], [90, 28], [140, 34], [175, 48]]] },
      lathe: { speed: 0.65, passes: 4, tol: 4.6, bite: 17, catches: 5, layout: [{ n: 34, r: 8, from: 11 }, { n: 12, r: 6, tight: true, from: 10 }, { n: 114, ball: [13, 24, 17] }] },
      finish: 'sand', sand: { grits: [220, 400, 800], over: 5, flats: 5 },
      stain: { time: 2200, puddle: null, pass: 40 },
    },
    castello: {
      pass: 40,
      saw: { feed: 0.65, tol: 5, ruin: 13, knots: [140], cuts: [[[0, 40], [200, 40], [228, 47], [250, 55]], [[0, 30], [130, 34]]] },
      lathe: { speed: 0.65, passes: 4, tol: 4.5, bite: 17, catches: 5, layout: [{ n: 86, r: 7, fragile: true, from: 11 }, { n: 10, r: [9, 16] }, { n: 64, r: 16 }] },
      finish: 'sand', sand: { grits: [220, 400, 800], over: 4, flats: 4 },
      stain: { time: 2200, puddle: null, pass: 40 },
    },
    minecraft: {
      pass: 50,
      saw: { feed: 0.7, tol: 4.6, ruin: 11, knots: [], facets: true, cuts: [[[0, 40], [130, 40], [150, 40], [165, 51], [215, 51]], [[0, 30], [100, 30], [118, 43], [150, 43]]] },
      lathe: { speed: 0.75, passes: 3, tol: 4, bite: 15, catches: 4, noCutOk: 2, layout: [{ n: 40, r: 15, noCut: 'square' }, { n: 18, r: [12, 19] }, { n: 102, r: 19 }] },
      finish: 'panels', sand: { grits: [220, 400, 800], over: 3, flats: 3 },
      stain: { time: 2000, puddle: 1.4, pass: 45 },
    },
    cordovan: {
      pass: 50,
      saw: { feed: 0.75, tol: 4.5, ruin: 10.5, knots: [70, 160], cuts: [[[0, 36], [100, 38], [150, 46], [200, 54]], [[0, 22], [160, 50]]] },
      lathe: { speed: 0.8, passes: 3, tol: 4, bite: 15, catches: 4, layout: [{ n: 44, r: 8, from: 11 }, { n: 116, r: [12, 24], crack: [56, 74] }] },
      finish: 'blast', blast: { size: 8, tape: 34, tears: 4, time: 1400 },
      stain: { time: 2000, puddle: 1.5, pass: 45 },
    },
    prince: {
      pass: 50,
      saw: { feed: 0.75, tol: 4.2, ruin: 10, knots: [100], cuts: [[[0, 42], [200, 42], [232, 49], [262, 54]], [[0, 46], [40, 34], [80, 32], [125, 42]]] },
      lathe: { speed: 0.8, passes: 3, tol: 3.8, bite: 14, catches: 4, layout: [{ n: 90, r: 6.5, fragile: true, from: 11 }, { n: 70, ball: [14, 23, 19] }] },
      finish: 'sand', sand: { grits: [220, 400, 800], over: 3, flats: 3 },
      stain: { time: 2000, puddle: 1.2, pass: 45 },
    },
    tan: {
      pass: 58,
      saw: { feed: 0.85, tol: 3.8, ruin: 8.5, knots: [60, 140], cuts: [[[0, 22], [70, 30], [130, 42], [180, 54], [230, 58]], [[0, 52], [30, 36], [80, 27], [130, 29], [170, 42], [200, 56]]] },
      lathe: { speed: 0.95, passes: 3, tol: 3.4, bite: 12, catches: 3, layout: [{ n: 36, r: 9, fragile: true, from: 11 }, { n: 10, r: [10, 12] }, { n: 114, ball: [12, 27, 19] }] },
      finish: 'sand', sand: { grits: [220, 400, 800], over: 3, flats: 3 },
      bend: { target: 36, tol: 5, heat: 0.9, bubbles: 4 },
      stain: { time: 1800, puddle: 1.0, pass: 50 },
    },
    strawberry: {
      pass: 65,
      saw: { feed: 0.95, tol: 3.3, ruin: 7.5, knots: [40, 110, 170], cuts: [[[0, 24], [60, 30], [120, 40], [170, 50], [210, 55]], [[0, 26], [20, 21], [36, 29], [52, 22], [70, 27], [160, 48]]] },
      lathe: { speed: 1.0, passes: 3, tol: 3, bite: 11, catches: 2, odd: true, noCutOk: 1, layout: [{ n: 40, r: 8, fragile: true, from: 11 }, { n: 100, r: [14, 21] }, { n: 20, r: 26, noCut: 'plateau' }] },
      finish: 'sand', sand: { grits: [220, 400, 800, 1500], over: 2, flats: 2 },
      bend: { target: 28, tol: 3.5, heat: 1.15, bubbles: 3 },
      stain: { time: 1600, puddle: 0.9, pass: 55 },
    },
  };
  G.PIPE_WORK = WORK;
  // what this pipe's lathe has that the others don't (on its HOW TO card)
  const LATHE_TIP = {
    black: 'This block is full of pits. Don\'t worry about them: it\'s getting sandblasted.',
    silver: 'The gold marks are the seat for the silver band. Turn it EXACTLY to the line there.',
    castello: 'The long shank is thin. If it catches there, it snaps.',
    minecraft: 'Leave the shank square: don\'t cut the striped part! Back off before you get there.',
    cordovan: 'There\'s a crack in the bowl. Cut past the line there and it opens right up.',
    prince: 'A long, thin shank. One catch there and it snaps.',
    tan: 'A big round bowl. The shank snaps if it catches. Do NOT push too far.',
    strawberry: 'An odd, lumpy little block. Don\'t touch the plateau (the rough top) and mind the shank.',
  };
  // what Dad says when a pipe's ruined
  const RUIN = {
    saw: 'You cut right into the pipe. That block\'s done.',
    rough: 'That\'s too far off the line. It won\'t be the right shape.',
    snap: 'SNAP. It caught and broke clean off. I did the exact same thing. Disappointing.',
    crack: 'The crack opened up. Holes going into the chamber: discard.',
    square: 'The shank was supposed to stay square. Abe was very clear.',
    plateau: 'You turned the plateau off. That rough top WAS the pipe.',
    gouged: 'Too much off. You can always take more off. You can\'t put it back.',
    lopsided: 'Lopsided. Too many flat spots.',
    tape: 'You blew through the tape. The rim\'s ruined.',
  };

  // ---- THE BANDSAW: Dad drew the pipe on the block. It feeds into the blade by itself, and ↑↓
  // slides the block to keep the blade on his pencil line. Above the line is the pipe (cut far
  // enough into it and the block's ruined); below is waste (staying low just leaves extra wood).
  // Two cuts: the bottom, then the block turned around for the back of the bowl. Knots jolt the
  // block. Result: { score, ruined } (or 'quit').
  const BLADE_X = 66, BLADE_Y = 70, BLOCK_H = 80;
  function sawCmd(pipe, talk) {
    const w = WORK[pipe.id].saw;
    // the pencil line at any point along a cut (smooth curves; the Minecraft pipe's are straight facets)
    const lineAt = (pts, u) => {
      if (u <= pts[0][0]) return pts[0][1];
      for (let k = 1; k < pts.length; k++) {
        const [u0, y0] = pts[k - 1], [u1, y1] = pts[k];
        if (u <= u1) { const t = (u - u0) / (u1 - u0); return y0 + (y1 - y0) * (w.facets ? t : (1 - Math.cos(t * Math.PI)) / 2); }
      }
      return pts[pts.length - 1][1];
    };
    // the block for a cut, drawn once: the pipe's side a little lighter, the waste darker, the line
    const blockArt = (pts) => {
      const len = pts[pts.length - 1][0], W = len + 40, c = G.canvas(W, BLOCK_H), x = c.getContext('2d');
      for (let u = 0; u < W; u++) {
        const ly = Math.round(lineAt(pts, u - 20));
        for (let y = 0; y < BLOCK_H; y++) {
          const g = G.hash(u >> 1, y, 4) < 0.08 ? -0.12 : Math.sin(y * 0.5 + u * 0.03) > 0.85 ? -0.06 : 0;
          x.fillStyle = G.art.shade(y < ly ? '#d8a670' : '#b07a48', g); x.fillRect(u, y, 1, 1);
        }
        if (u % 3 !== 2) { x.fillStyle = '#2a2a30'; x.fillRect(u, ly, 1, 1); }
      }
      x.fillStyle = '#5a3a20'; x.fillRect(0, 0, W, 1); x.fillRect(0, BLOCK_H - 1, W, 1);
      for (let u = 6; u < len; u += 80) {
        FT().draw(x, 'PIPE', 20 + u, Math.max(2, Math.round(lineAt(pts, u)) - 12), '#7a4a28');
        FT().draw(x, 'waste', 20 + u, Math.min(BLOCK_H - 10, Math.round(lineAt(pts, u)) + 5), '#5a3a20');
      }
      return c;
    };
    const arts = w.cuts.map(blockArt);
    return {
      start() { Object.assign(this, { cut: 0, t: 0, pen: 0, frames: 0, endT: 0, ruined: null, msg: null, msgT: 0, w, lineAt }); this.begin(); talk.nowT = 0; G.play.overlay = this; },
      begin() {
        const pts = w.cuts[this.cut];
        Object.assign(this, { pts, len: pts[pts.length - 1][0], p: -36, kerf: [], shoveT: 0, knots: w.knots.filter((u) => u < pts[pts.length - 1][0]) });
        this.o = BLADE_Y - lineAt(pts, 0) + 12;
      },
      pop(m) { this.msg = m; this.msgT = 50; },
      score() { return Math.max(0, Math.min(100, Math.round(100 - (this.pen / Math.max(1, this.frames)) * 9))); },
      update() {
        const inp = G.input;
        this.t++; talk.update();
        if (this.msgT > 0) this.msgT--;
        if (this.endT > 0) { if (--this.endT === 0) { const sc = this.score(); this.result = { score: sc, ruined: this.ruined || (sc < WORK[pipe.id].pass ? 'rough' : null) }; return true; } return false; }
        if (quitHit()) { this.result = 'quit'; return true; }
        if (inp.down('up')) this.o -= 0.85;
        if (inp.down('down')) this.o += 0.85;
        this.o = Math.max(-20, Math.min(100, this.o));
        this.p += w.feed;
        // a knot in the briar: the blade grabs it and shoves the block for a moment (fight it!)
        if (this.knots.length && this.p >= this.knots[0]) { this.knots.shift(); this.shove = (G.hash(this.cut, Math.round(this.p), 3) < 0.5 ? -1 : 1) * 0.45; this.shoveT = 16; G.audio.sfx('bump'); G.play.shake(6, 2); this.pop('KNOT!'); }
        if (this.shoveT > 0) { this.shoveT--; this.o += this.shove; }
        if (this.p >= 0 && this.p <= this.len) {
          const cutY = BLADE_Y - this.o, e = cutY - lineAt(this.pts, this.p);
          this.kerf.push(this.p, cutY);
          this.frames++;
          if (this.t % 6 === 0) G.audio.sfx('blip');
          if (e < -w.ruin) {
            this.ruined = 'saw'; this.endT = 60; G.audio.sfx('crack'); G.play.shake(10, 3); this.pop('INTO THE PIPE!');
            talk.say('Stop! Stop. You cut right into the pipe.');
            return false;
          }
          if (e < -w.tol) { this.pen += (-e - w.tol) * 2.2; if (!this.warnT) { this.warnT = 70; this.pop('TOO HIGH!'); talk.say('Careful! Above the line is the pipe. Stay ON the line.'); } }
          else if (e > w.tol) { this.pen += (e - w.tol) * 0.5; if (!this.warnT) { this.warnT = 90; this.pop('Low: extra wood'); } }
        }
        if (this.warnT) this.warnT--;
        if (this.p > this.len + 14) {
          if (++this.cut < w.cuts.length) { this.begin(); this.pop('TURN THE BLOCK'); G.audio.sfx('menu'); talk.say('Good. Now turn it around and cut the back of the bowl.'); }
          else { this.endT = 40; G.audio.sfx('select'); this.pop('CUT!'); }
        }
        return false;
      },
      draw(ctx) {
        benchBack(ctx, 'THE BANDSAW', 'CUT ' + G.sayable(Math.min(this.cut + 1, w.cuts.length)) + '/' + G.sayable(w.cuts.length));
        // the table
        ctx.fillStyle = '#4a5058'; ctx.fillRect(0, 14, G.W, 118); ctx.fillStyle = '#5a626c'; ctx.fillRect(0, 14, G.W, 2);
        ctx.fillStyle = '#3e444c'; for (let y = 30; y < 132; y += 24) ctx.fillRect(0, y, G.W, 1);
        // the block, sliding past the blade (and the cut it's left behind)
        const bx = Math.round(BLADE_X - this.p - 20), by = Math.round(this.o);
        ctx.drawImage(arts[Math.min(this.cut, arts.length - 1)], bx, by);
        ctx.fillStyle = '#1a1210';
        for (let k = 0; k < this.kerf.length; k += 2) ctx.fillRect(Math.round(BLADE_X - this.p + this.kerf[k]), Math.round(this.o + this.kerf[k + 1]) - 1, 1, 2);
        // the blade (its teeth running down), its guard, and where it cuts
        ctx.fillStyle = '#c8ccd4'; ctx.fillRect(BLADE_X - 1, 14, 3, 118);
        ctx.fillStyle = '#7a7e88'; for (let y = 14 + (this.t * 3) % 6; y < 132; y += 6) ctx.fillRect(BLADE_X - 1, y, 1, 2);
        ctx.fillStyle = '#c83838'; ctx.fillRect(BLADE_X - 8, 14, 17, 22); ctx.fillStyle = '#e85050'; ctx.fillRect(BLADE_X - 8, 14, 17, 2);
        const e = this.p >= 0 && this.p <= this.len ? BLADE_Y - this.o - lineAt(this.pts, this.p) : 0;
        ctx.fillStyle = e < -w.tol ? '#f86858' : e > w.tol ? '#f8d850' : '#78e070';
        ctx.fillRect(BLADE_X - 6, BLADE_Y, 3, 1); ctx.fillRect(BLADE_X + 4, BLADE_Y, 3, 1);
        if (this.msgT > 0) { const tw = FT().width(this.msg); FT().draw(ctx, this.msg, 150 - Math.round(tw / 2), 40, this.msg === 'INTO THE PIPE!' || this.msg === 'TOO HIGH!' ? '#f86858' : '#f8d850', { shadow: '#000' }); }
        FT().draw(ctx, '↑↓ keep the blade on the line', 100, 120, '#c8c0d8', { shadow: '#000' });
        talk.draw(ctx);
      },
    };
  }

  // ---- THE LATHE: the briar spins, Nate moves the gouge (↓ in, ↑ out) while it rides along,
  // pass after pass, cutting down to Dad's white line. Every pipe has its own layout (WORK.lathe).
  // Push in too far at once and it CATCHES; enough catches (or one on a fragile shank) and it
  // snaps. Too deep is a gouge; too shallow is rough (and gets another pass, twice at most).
  // Result: { score, ruined } (or 'quit').
  function latheLayout(L) {
    const target = [], zone = [];
    for (const s of L.layout) for (let k = 0; k < s.n; k++) {
      const t = s.n > 1 ? k / (s.n - 1) : 0, b = s.ball;
      target.push(b ? (t < 0.5 ? b[0] + (b[1] - b[0]) * Math.sin(t * Math.PI) : b[2] + (b[1] - b[2]) * Math.sin(t * Math.PI)) : Array.isArray(s.r) ? s.r[0] + (s.r[1] - s.r[0]) * t : s.r);
      zone.push({ fragile: !!s.fragile, tight: !!s.tight, noCut: s.noCut || null, crack: !!(s.crack && k >= s.crack[0] && k <= s.crack[1]), from: s.from });
    }
    return { target, zone };
  }
  function latheCmd(pipe, talk) {
    const L = WORK[pipe.id].lathe, X0 = 40, N = 160, AX = 74, RMAX = 30;
    const { target, zone } = latheLayout(L), tolAt = (i) => (zone[i].tight ? Math.min(L.tol, 1.6) : L.tol);
    const wood = new Float32Array(N);
    // (a shank's mostly trimmed already on the bandsaw: it starts closer to its line than the bowl)
    for (let i = 0; i < N; i++) {
      const top = zone[i].from ? target[i] + zone[i].from : RMAX;
      wood[i] = zone[i].noCut ? target[i] : L.odd ? top - 7 * Math.abs(Math.sin(i * 0.06 + 1)) * (top / RMAX) - 3 * G.hash(i, 3, 9) : top;
    }
    // what's special about this layout, labelled over it
    const labels = [];
    let at = 0;
    for (const s of L.layout) {
      const lab = s.noCut === 'square' ? 'KEEP SQUARE' : s.noCut === 'plateau' ? 'PLATEAU' : s.fragile ? 'THIN!' : s.tight ? 'BAND' : s.crack ? 'CRACK' : null;
      if (lab) labels.push([X0 + at + (s.crack ? (s.crack[0] + s.crack[1]) / 2 : s.n / 2), lab, s.noCut ? '#78e8e8' : s.tight ? '#f8d850' : '#f86858']);
      at += s.n;
    }
    const chips = [];
    return {
      start() {
        Object.assign(this, { x: 0, dir: 1, pass: 1, passes: L.passes, extra: 0, tool: RMAX + 4, t: 0, catches: 0, nocuts: 0, shakeT: 0, endT: 0, msg: null, msgT: 0, lockT: 0, deepT: 0, ruined: null, target, wood, zone, bite: L.bite, tolAt });
        talk.nowT = 0; G.play.overlay = this;
      },
      score() {
        let pen = 0, n = 0;
        for (let i = 0; i < N; i++) {
          if (zone[i].noCut) continue;
          const e = wood[i] - target[i], tol = tolAt(i), wgt = zone[i].tight ? 2 : 1;
          n += wgt;
          if (e < -tol) pen += ((-e - tol) * 2.5 + 1) * wgt; else if (e > tol) pen += (e - tol) * wgt;
        }
        return Math.max(0, Math.min(100, Math.round(100 - (pen / n) * 10 - this.catches * 4 - this.nocuts * 15)));
      },
      rough() { let k = 0, n = 0; for (let i = 0; i < N; i++) if (!zone[i].noCut) { n++; if (wood[i] > target[i] + tolAt(i)) k++; } return k / n; },
      pop(text) { this.msg = text; this.msgT = 50; },
      ruin(why, line, msg) { this.ruined = why; this.endT = 70; this.shakeT = 20; G.audio.sfx('crack'); G.play.shake(12, 3); this.pop(msg); talk.say(line); },
      update() {
        const inp = G.input;
        this.t++; talk.update();
        if (this.shakeT > 0) this.shakeT--;
        if (this.msgT > 0) this.msgT--;
        for (const c of chips) { c.x += c.vx; c.y += c.vy; c.vy += 0.12; c.life--; }
        for (let i = chips.length - 1; i >= 0; i--) if (chips[i].life <= 0) chips.splice(i, 1);
        if (this.endT > 0) {
          if (--this.endT === 0) { const sc = this.score(); this.result = { score: sc, ruined: this.ruined || (sc < WORK[pipe.id].pass ? 'gouged' : null) }; return true; }
          return false;
        }
        if (quitHit()) { this.result = 'quit'; return true; }
        // (after a catch, the gouge stays backed off for a moment)
        if (this.lockT > 0) { this.lockT--; this.tool = Math.min(RMAX + 6, this.tool + 0.3); }
        if (inp.down('up')) this.tool = Math.min(RMAX + 6, this.tool + 0.7);
        if (inp.down('down') && !this.lockT) this.tool = Math.max(4, this.tool - 0.7);
        if (this.deepT > 0) this.deepT--;
        const was = this.x;
        this.x = Math.max(0, Math.min(N - 1, this.x + this.dir * L.speed));
        let cutting = false;
        for (let c = Math.floor(Math.min(was, this.x)); c <= Math.floor(Math.max(was, this.x)); c++) {
          if (c < 0 || c >= N || this.tool >= wood[c] - 0.05) continue;
          const z = zone[c];
          // the part that's supposed to stay as it is: hands off (a graze doesn't count)
          if (z.noCut && this.tool >= wood[c] - 1) continue;
          if (z.noCut) {
            this.nocuts++; this.lockT = 30; this.tool = Math.max(this.tool, wood[c] + 4);
            if (this.nocuts > (L.noCutOk || 0)) { this.ruin(z.noCut, RUIN[z.noCut], 'RUINED!'); return false; }
            G.audio.sfx('no'); this.pop('DON\'T CUT THERE!'); talk.say(z.noCut === 'plateau' ? 'NOT the plateau! Leave the top rough!' : 'Not the shank! It stays square! Back off before you get there.');
            break;
          }
          if (wood[c] - this.tool > L.bite) {
            // a catch: the gouge digs in and tears a chunk out, and bounces back up
            for (let k = c - 3; k <= c + 3; k++) if (k >= 0 && k < N && !zone[k].noCut) wood[k] = Math.min(wood[k], this.tool - 2 + Math.abs(k - c) * 0.6);
            // (a catch on a thin shank counts double)
            this.catches += z.fragile ? 2 : 1; this.shakeT = 14; this.lockT = 30; this.tool = Math.min(RMAX + 6, this.tool + L.bite);
            if (this.catches >= L.catches) { this.ruin('snap', z.fragile ? 'The thin shank caught. And SNAP.' : 'It caught one too many times. And SNAP.', 'SNAP!'); return false; }
            G.audio.sfx('crack'); this.pop((z.fragile ? 'THIN SHANK CAUGHT! ' : 'CATCH! ') + '(' + G.sayable(L.catches - this.catches) + ' more: SNAP)');
            talk.say(z.fragile ? 'The shank is thin! That one counts double. Go easy there.' : ['Whoa! Light passes! You can always take more off. You can\'t put it back.', 'Easy! That\'s how I broke one. It caught and SNAP.', 'Gently! Let the lathe do the work.'][this.catches % 3]);
            break;
          }
          wood[c] = this.tool; cutting = true;
          if (z.crack && wood[c] < target[c] - L.tol * 0.6) { this.ruin('crack', 'The crack! It opened right up.', 'CRACK!'); return false; }
          if (this.tool < target[c] - tolAt(c) && !this.deepT) { this.deepT = 90; this.pop('TOO DEEP!'); talk.say(z.tight ? 'The band seat has to be exact! Right on the line.' : 'Back off a little! Stay on the white line.'); }
        }
        if (cutting && this.t % 2 === 0) chips.push({ x: X0 + this.x, y: AX - this.tool, vx: (Math.random() - 0.5) * 2.4, vy: -1 - Math.random() * 1.5, life: 26, c: ['#e8c890', '#d8b070', '#f4dcb0'][this.t % 3] });
        if (cutting && this.t % 9 === 0) G.audio.sfx('blip');
        // end of a pass: turn around (or, if it's still rough after the last one, one more)
        if ((this.dir > 0 && this.x >= N - 1) || (this.dir < 0 && this.x <= 0)) {
          if (this.pass < this.passes) { this.pass++; this.dir = -this.dir; this.pop('PASS ' + G.sayable(this.pass) + '/' + G.sayable(this.passes)); G.audio.sfx('menu'); }
          else if (this.extra < 2 && this.rough() > 0.12) { this.extra++; this.passes++; this.pass++; this.dir = -this.dir; this.pop('ONE MORE PASS'); talk.say('Still rough. Take one more pass.'); G.audio.sfx('menu'); }
          else { this.endT = 50; G.audio.sfx('select'); this.pop('DONE!'); }
        }
        return false;
      },
      draw(ctx) {
        benchBack(ctx, 'THE LATHE', 'PASS ' + G.sayable(this.pass) + '/' + G.sayable(this.passes));
        const jx = this.shakeT > 0 ? Math.round((Math.random() * 2 - 1) * 2) : 0;
        ctx.save(); ctx.translate(jx, 0);
        // the bed and its legs, the headstock (with the spur drive) and the tailstock
        ctx.fillStyle = '#28322e'; ctx.fillRect(8, 108, 224, 8); ctx.fillStyle = '#3e4c46'; ctx.fillRect(8, 108, 224, 2);
        ctx.fillStyle = '#1e2624'; ctx.fillRect(20, 116, 8, 14); ctx.fillRect(212, 116, 8, 14);
        ctx.fillStyle = '#3e5a4c'; ctx.fillRect(10, 40, 26, 68); ctx.fillStyle = '#56786a'; ctx.fillRect(10, 40, 26, 3); ctx.fillRect(10, 40, 2, 68);
        ctx.fillStyle = '#9aa0a8'; ctx.fillRect(34, AX - 9, 6, 18); ctx.fillStyle = '#c8ccd4'; ctx.fillRect(34, AX - 9, 6, 2);
        ctx.fillStyle = '#3e5a4c'; ctx.fillRect(208, 54, 20, 54); ctx.fillStyle = '#56786a'; ctx.fillRect(208, 54, 20, 3);
        ctx.fillStyle = '#9aa0a8'; ctx.fillRect(200, AX - 4, 8, 8); ctx.fillRect(198, AX - 2, 2, 4);
        // the briar, spinning: lighter on top, grain lines rolling around it
        for (let i = 0; i < N; i++) {
          const r = wood[i], x = X0 + i, z = zone[i], top = Math.round(AX - r), h = Math.round(r * 2);
          if (z.noCut === 'square') {
            // the square shank: flat sides, striped so it's clear what to leave alone
            ctx.fillStyle = '#b8824c'; ctx.fillRect(x, top, 1, h);
            ctx.fillStyle = '#78e8e8'; if ((i + this.t) % 6 < 2) { ctx.fillRect(x, top, 1, 1); ctx.fillRect(x, top + h - 1, 1, 1); }
            ctx.fillStyle = '#9a6a3c'; if (i % 6 === 0) ctx.fillRect(x, top + 2, 1, h - 4);
            continue;
          }
          if (z.noCut === 'plateau') {
            // the plateau: rough bark, left the way it grew
            ctx.fillStyle = '#5a3a22'; ctx.fillRect(x, top, 1, h);
            ctx.fillStyle = '#3a2412'; for (let k = 0; k < h; k += 2) if (G.hash(i, k + (this.t >> 2), 5) < 0.4) ctx.fillRect(x, top + k, 1, 1);
            ctx.fillStyle = '#78e8e8'; if ((i + this.t) % 6 < 2) { ctx.fillRect(x, top - 1, 1, 1); ctx.fillRect(x, top + h, 1, 1); }
            continue;
          }
          ctx.fillStyle = '#c89a62'; ctx.fillRect(x, top, 1, h);
          ctx.fillStyle = '#ddb47c'; ctx.fillRect(x, top, 1, Math.round(r * 0.7));
          ctx.fillStyle = '#a87a48'; ctx.fillRect(x, Math.round(AX + r * 0.45), 1, Math.round(r * 0.55));
          ctx.fillStyle = '#9a6a3c';
          for (let k = 0; k < 6; k++) {
            const a = k * 1.047 + this.t * 0.3 + Math.sin(i * 0.12 + k) * 0.12;
            if (Math.sin(a) > 0) ctx.fillRect(x, Math.round(AX - r * Math.cos(a)), 1, 1);
          }
          // pits in a flawed block, and the crack (rolling around with it)
          if (L.flaws && G.hash(i >> 1, (this.t >> 2) % 9, 6) < 0.06) { ctx.fillStyle = '#4a2a14'; ctx.fillRect(x, AX - Math.round(r * 0.3), 1, 2); }
          if (z.crack) { ctx.fillStyle = '#2a1408'; ctx.fillRect(x, AX + ((i + (this.t >> 1)) % 4 < 2 ? -2 : 1), 1, 2); }
          // the wood still to come off (lighter), Dad's white line (green where it's right), and gouges (red)
          const tol = tolAt(i);
          if (r > target[i] + tol) {
            ctx.fillStyle = 'rgba(255,240,200,0.28)';
            ctx.fillRect(x, top, 1, Math.round(r - target[i])); ctx.fillRect(x, Math.round(AX + target[i]), 1, Math.round(r - target[i]));
          }
          if (r < target[i] - tol) { ctx.fillStyle = '#e83838'; ctx.fillRect(x, top, 1, 2); ctx.fillRect(x, top + h - 2, 1, 2); }
          ctx.fillStyle = z.tight ? '#f8d850' : r >= target[i] - tol && r <= target[i] + tol ? '#78e070' : z.fragile ? '#f8a878' : '#f8f8f0';
          ctx.fillRect(x, Math.round(AX - target[i]), 1, 1); ctx.fillRect(x, Math.round(AX + target[i]), 1, 1);
        }
        // the gouge, its tip at the cut (the tip shows how hard it's biting: green, yellow, then red,
        // about to catch)
        const tx = Math.round(X0 + this.x), ty = Math.round(AX - this.tool);
        const bite = (wood[Math.max(0, Math.min(N - 1, Math.round(this.x + this.dir * 2)))] - this.tool) / L.bite, bc = bite > 0.8 ? '#f86858' : bite > 0.55 ? '#f8d850' : '#78e070';
        ctx.fillStyle = '#7a4a28'; ctx.fillRect(tx - 2, ty - 22, 5, 10);
        ctx.fillStyle = '#c8ccd4'; ctx.fillRect(tx - 1, ty - 12, 3, 10); ctx.fillStyle = '#f8f8f8'; ctx.fillRect(tx - 1, ty - 12, 1, 10);
        ctx.fillStyle = bite > 0 ? bc : '#e8ecf0'; ctx.fillRect(tx - 1, ty - 3, 3, 3);
        for (const c of chips) { ctx.fillStyle = c.c; ctx.fillRect(Math.round(c.x), Math.round(c.y), 2, 1); }
        ctx.restore();
        for (const [lx, lab, col] of labels) FT().draw(ctx, lab, Math.round(lx - FT().width(lab) / 2), 27, col, { shadow: '#000' });
        if (this.msgT > 0) { const w = FT().width(this.msg); FT().draw(ctx, this.msg, 120 - Math.round(w / 2), 15, /CATCH|DEEP|SNAP|CRACK|RUIN|DON/.test(this.msg) ? '#f86858' : '#f8d850', { shadow: '#000' }); }
        FT().draw(ctx, 'Bite', 120, 112, '#c8c0d8', { shadow: '#000' });
        ctx.fillStyle = '#0c0814'; ctx.fillRect(142, 113, 50, 5);
        if (bite > 0) { ctx.fillStyle = bc; ctx.fillRect(143, 114, Math.round(48 * Math.min(1, bite)), 3); }
        ctx.fillStyle = '#f86858'; ctx.fillRect(143 + 48, 113, 1, 5);
        FT().draw(ctx, '↓ cut in   ↑ back off', 104, 120, '#c8c0d8', { shadow: '#000' });
        FT().draw(ctx, 'Catches: ' + '{r}' + '■'.repeat(this.catches) + '{d}' + '■'.repeat(Math.max(0, L.catches - this.catches)), 6, 120, '#c8c0d8', { shadow: '#000' });
        talk.draw(ctx);
      },
    };
  }

  // the pipe as bare briar at twice size, split into 4x4 cells (which ones are wood: bowl and shank)
  const CS = 4, PIPE_X = 100, PIPE_Y = 36;
  function woodCells(pipe) {
    const raw = G.art.pipeArt(pipe.id, 2, { wood: RAW_BRIAR, shankWood: RAW_BRIAR }), parts = raw.parts, W = raw.width, H = raw.height;
    const cols = Math.ceil(W / CS), rows = Math.ceil(H / CS), wood = new Uint8Array(cols * rows), bowl = new Uint8Array(cols * rows), shank = new Uint8Array(cols * rows);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const p = parts[y * W + x], i = Math.floor(y / CS) * cols + Math.floor(x / CS);
      if (p === 1) { wood[i] = 1; bowl[i] = 1; } else if (p === 2) { wood[i] = 1; shank[i] = 1; }
    }
    let count = 0;
    for (const w of wood) count += w;
    return { raw, W, H, cols, rows, wood, bowl, shank, count };
  }

  // ---- SANDING: off come the tool marks, one grit at a time. Most pipes are sanded in five bands
  // (↑↓ picks one, tapping ← → ← → sands it); the Minecraft pipe's eight panels are sanded flat
  // on the wheel (← → picks one, ↑ ↓ ↑ ↓ sands it). A band or panel is done when its scratches
  // are gone. Keep going on a done one and it goes flat; too many flat spots and it's lopsided.
  // Result: { score, ruined } (or 'quit').
  function sandCmd(pipe, talk) {
    const S = WORK[pipe.id].sand, panels = WORK[pipe.id].finish === 'panels', c = woodCells(pipe), grits = S.grits, NEED = [6, 4, 3, 3], UNITS = panels ? 8 : 5;
    // which band (top to bottom) or panel (across the bowl) each cell belongs to
    const inPlay = (i) => c.wood[i] && (!panels || c.bowl[i]), along = (i) => (panels ? i % c.cols : Math.floor(i / c.cols));
    let a0 = 1e9, a1 = -1e9;
    for (let i = 0; i < c.wood.length; i++) if (inPlay(i)) { a0 = Math.min(a0, along(i)); a1 = Math.max(a1, along(i)); }
    const unitOf = (i) => (inPlay(i) ? Math.min(UNITS - 1, Math.floor(((along(i) - a0) / (a1 - a0 + 1)) * UNITS)) : -1);
    const span = (u) => [a0 + (u * (a1 - a0 + 1)) / UNITS, a0 + ((u + 1) * (a1 - a0 + 1)) / UNITS];
    const dust = [];
    const pick = panels ? ['left', 'right'] : ['up', 'down'], rub = panels ? ['up', 'down'] : ['left', 'right'];
    return {
      start() { Object.assign(this, { g: 0, unit: Math.floor(UNITS / 2), need: Array(UNITS).fill(NEED[0]), over: Array(UNITS).fill(0), last: null, flats: 0, t: 0, endT: 0, rubT: 0, msg: null, msgT: 0, ruined: null, UNITS }); talk.nowT = 0; G.play.overlay = this; },
      pop(text) { this.msg = text; this.msgT = 50; },
      update() {
        const inp = G.input;
        this.t++; talk.update();
        if (this.msgT > 0) this.msgT--;
        if (this.rubT > 0) this.rubT--;
        for (const p of dust) { p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.life--; }
        for (let i = dust.length - 1; i >= 0; i--) if (dust[i].life <= 0) dust.splice(i, 1);
        if (this.endT > 0) { if (--this.endT === 0) { this.result = { score: Math.max(0, 100 - this.flats * 15), ruined: this.ruined }; return true; } return false; }
        if (quitHit()) { this.result = 'quit'; return true; }
        if (inp.hit(pick[0]) && this.unit > 0) { this.unit--; G.audio.sfx('menu'); }
        if (inp.hit(pick[1]) && this.unit < UNITS - 1) { this.unit++; G.audio.sfx('menu'); }
        // a stroke: the other way from the last one
        const dir = inp.hit(rub[0]) ? rub[0] : inp.hit(rub[1]) ? rub[1] : null;
        if (dir && dir !== this.last) {
          this.last = dir; this.rubT = 6;
          const u = this.unit, [s0, s1] = span(u);
          if (this.t % 2 === 0) G.audio.sfx('blip');
          for (let k = 0; k < 3; k++) {
            const m = (s0 + s1) / 2 * CS;
            dust.push(panels ? { x: 100 + u * 16 + 7 + Math.random() * 8 - 4, y: 42, vx: (Math.random() - 0.5) * 1.6, vy: -0.4 - Math.random(), life: 22 } : { x: PIPE_X + 40 + Math.random() * 80, y: PIPE_Y + m, vx: (Math.random() - 0.5) * 1.4, vy: -0.6 - Math.random(), life: 22 });
          }
          if (this.need[u] > 0) {
            if (--this.need[u] === 0) G.audio.sfx('select');
          } else if (++this.over[u] >= S.over) {
            this.over[u] = 0; this.flats++;
            if (this.flats >= S.flats) { this.ruined = 'lopsided'; this.endT = 60; G.audio.sfx('crack'); this.pop('LOPSIDED!'); talk.say('Oh no. That\'s gone lopsided.'); return false; }
            G.audio.sfx('no'); this.pop((panels ? 'ROUNDED A PANEL!' : 'FLAT SPOT!') + ' (' + G.sayable(S.flats - this.flats) + ' more: ruined)');
            talk.say(panels ? 'Easy! That panel\'s done. Keep the edges crisp.' : 'Easy! That spot\'s done. Move on to another one.');
          }
          // all smooth: on to the next grit (or done)
          if (this.need.every((n) => n === 0)) {
            if (++this.g < grits.length) {
              this.need = Array(UNITS).fill(NEED[this.g]); this.over = Array(UNITS).fill(0);
              this.pop(grits[this.g] + ' GRIT'); talk.say('Good. Now ' + grits[this.g] + '. Finer paper, same thing.');
            } else { this.endT = 40; this.pop('SMOOTH!'); talk.say('Feel that. Smooth as a church pew.'); }
          }
        }
        return false;
      },
      draw(ctx) {
        benchBack(ctx, panels ? 'THE PANELS' : 'SANDING', pipe.name);
        // the grits, coarse to fine
        G.box(ctx, 4, 16, 78, 112);
        FT().draw(ctx, panels ? 'The wheel' : 'Sandpaper', 10, 20, '#c8c0d8');
        grits.forEach((gr, i) => {
          const y = 34 + i * 16, done = i < this.g, on = i === this.g && !this.endT;
          ctx.fillStyle = ['#c8a070', '#d8b888', '#e8d0a8', '#f4e8d0'][i]; ctx.fillRect(12, y, 12, 10);
          for (let k = 0; k < 10; k++) if (G.hash(k, i, 5) < 0.5) { ctx.fillStyle = '#8a6a48'; ctx.fillRect(13 + (k % 5) * 2, y + 2 + Math.floor(k / 5) * 4, 1, 1); }
          FT().draw(ctx, G.sayable(gr) + ' grit' + (done || this.endT ? '  ✓' : ''), 28, y + 2, on ? '#f8d850' : done || this.endT ? '#78e070' : '#f8f8f0');
        });
        FT().draw(ctx, 'Flat: ' + '{r}' + '■'.repeat(this.flats) + '{d}' + '■'.repeat(Math.max(0, S.flats - this.flats)), 10, 112, '#c8c0d8');
        const max = NEED[this.g] || 1;
        if (panels) {
          // the eight panels, unrolled side by side (the octagon up top shows which one's on the wheel)
          for (let u = 0; u < UNITS; u++) {
            const x = 100 + u * 16, y = 46, n = this.endT ? 0 : this.need[u], on = u === this.unit && !this.endT;
            ctx.fillStyle = G.art.shade(RAW_BRIAR, u % 2 ? -0.06 : 0.04); ctx.fillRect(x, y, 14, 54);
            ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillRect(x, y, 1, 54); ctx.fillStyle = 'rgba(90,50,20,0.4)'; ctx.fillRect(x + 13, y, 1, 54);
            ctx.fillStyle = this.g === 0 ? '#8a6040' : this.g === 1 ? '#a07850' : '#b89068';
            for (let k = 0; k < 14 * (n / max); k++) { const sx = x + 1 + Math.floor(G.hash(k, u, 3 + this.g) * 10), sy = y + 2 + Math.floor(G.hash(u, k, 5 + this.g) * 48); ctx.fillRect(sx, sy + 2, 1, 1); ctx.fillRect(sx + 1, sy + 1, 1, 1); ctx.fillRect(sx + 2, sy, 1, 1); }
            if (on) corners(ctx, x - 1, y - 2, 16, 58, n ? '#f8d850' : '#78e070');
            const lab = G.sayable(u + 1);
            FT().draw(ctx, lab, x + 7 - Math.round(FT().width(lab) / 2), y + 57, on ? '#f8d850' : '#9890a8', { shadow: '#000' });
          }
          // the octagon, with the panel on the wheel lit up
          const ox = 116, oy = 28;
          for (let u = 0; u < UNITS; u++) {
            const a0 = (u / UNITS) * Math.PI * 2 - Math.PI / 2, a1 = ((u + 1) / UNITS) * Math.PI * 2 - Math.PI / 2;
            ctx.strokeStyle = u === this.unit ? '#f8d850' : this.need[u] ? '#9a6a3c' : '#78e070'; ctx.lineWidth = u === this.unit ? 2 : 1;
            ctx.beginPath(); ctx.moveTo(ox + Math.cos(a0) * 11, oy + Math.sin(a0) * 11); ctx.lineTo(ox + Math.cos(a1) * 11, oy + Math.sin(a1) * 11); ctx.stroke();
          }
          ctx.lineWidth = 1;
          // the wheel
          const wx = 100 + this.unit * 16 + 7, wy = 36 + (this.rubT ? (this.last === 'up' ? -2 : 2) : 0);
          ctx.fillStyle = '#5a5a64'; ctx.beginPath(); ctx.arc(wx, wy, 7, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = ['#c8a070', '#d8b888', '#e8d0a8', '#f4e8d0'][this.g]; ctx.beginPath(); ctx.arc(wx, wy, 5, 0, Math.PI * 2); ctx.fill();
          for (const p of dust) { ctx.fillStyle = '#f0dcb8'; ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1); }
        }
        // the pipe, with the scratches still left on each band (fewer as it gets smooth)
        if (!panels) ctx.drawImage(c.raw, PIPE_X, PIPE_Y);
        if (!panels) for (let i = 0; i < c.wood.length; i++) {
          const u = unitOf(i);
          if (u < 0) continue;
          const row = Math.floor(i / c.cols), col = i % c.cols, n = this.endT ? 0 : this.need[u];
          if (n > 0 && G.hash(col, row, 7 + this.g) < 0.25 + 0.6 * (n / max)) {
            ctx.fillStyle = this.g === 0 ? '#8a6040' : this.g === 1 ? '#a07850' : '#b89068';
            const x = PIPE_X + col * CS, y = PIPE_Y + row * CS;
            ctx.fillRect(x, y + 3, 1, 1); ctx.fillRect(x + 1, y + 2, 1, 1); ctx.fillRect(x + 2, y + 1, 1, 1); ctx.fillRect(x + 3, y, 1, 1);
          }
        }
        // the band the sandpaper's on (and the sanding block, rubbing)
        if (!this.endT && !panels) {
          const [s0, s1] = span(this.unit), col = this.need[this.unit] ? '#f8d850' : '#78e070';
          const y0 = PIPE_Y + Math.round(s0 * CS), y1 = PIPE_Y + Math.round(s1 * CS);
          corners(ctx, PIPE_X - 2, y0 - 1, c.W + 4, y1 - y0 + 2, col);
          const bx = 84 + (this.rubT ? (this.last === 'left' ? -2 : 2) : 0), by = Math.round((y0 + y1) / 2) - 5;
          ctx.fillStyle = '#5a3a20'; ctx.fillRect(bx, by, 16, 6); ctx.fillStyle = ['#c8a070', '#d8b888', '#e8d0a8', '#f4e8d0'][this.g]; ctx.fillRect(bx, by + 6, 16, 3);
        }
        if (!panels) for (const p of dust) { ctx.fillStyle = '#f0dcb8'; ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1); }
        if (this.msgT > 0) { const w = FT().width(this.msg); FT().draw(ctx, this.msg, Math.min(234 - w, Math.max(86, 160 - Math.round(w / 2))), 15, /FLAT|ROUND|LOP/.test(this.msg) ? '#f86858' : '#f8d850', { shadow: '#000' }); }
        FT().draw(ctx, panels ? '← → a panel   ↑ ↓ sand it' : '↑↓ a spot   ← → sand it', 100, 120, '#c8c0d8', { shadow: '#000' });
        talk.draw(ctx);
      },
    };
  }

  // ---- SANDBLASTING (the two sandblasted pipes, instead of sanding): the rim and the end of the
  // shank are taped off. Hold Z to blast and move the nozzle with the arrows: the soft wood blows
  // away and the grain stands up. Every bit of bare briar wants blasting; stay off the tape (too
  // long on a piece and it blows through, and the briar under it is ruined). It stops on its own
  // once every bit is blasted, right up to the tape (or when the grit runs out). Result: { score, ruined } (or 'quit').
  function blastCmd(pipe, talk) {
    const B = WORK[pipe.id].blast, c = woodCells(pipe), R = B.size;
    // the tape: the rim (the bowl's top two rows) and a ring around the end of the shank
    let rim = 1e9, end = 1e9;
    for (let i = 0; i < c.wood.length; i++) { if (c.bowl[i]) rim = Math.min(rim, Math.floor(i / c.cols)); if (c.shank[i]) end = Math.min(end, i % c.cols); }
    const tape = new Uint8Array(c.wood.length), hp = new Float32Array(c.wood.length), blasted = new Float32Array(c.wood.length);
    let bare = 0;
    for (let i = 0; i < c.wood.length; i++) {
      if (!c.wood[i]) continue;
      if ((c.bowl[i] && Math.floor(i / c.cols) <= rim + 1) || (c.shank[i] && i % c.cols <= end + 2)) { tape[i] = 1; hp[i] = B.tape; } else bare++;
    }
    const grit = [];
    return {
      start() { Object.assign(this, { t: 0, left: B.time, bx: c.W / 2, by: c.H * 0.6, torn: 0, endT: 0, ruined: null, msg: null, msgT: 0, zReady: false, tape, hp, blasted, cells: c, R }); talk.nowT = 0; G.play.overlay = this; },
      pop(m) { this.msg = m; this.msgT = 50; },
      cover() { let k = 0; for (let i = 0; i < c.wood.length; i++) if (c.wood[i] && !tape[i] && blasted[i] >= 1) k++; return k / bare; },
      update() {
        const inp = G.input;
        this.t++; talk.update();
        if (this.msgT > 0) this.msgT--;
        for (const p of grit) { p.x += p.vx; p.y += p.vy; p.life--; }
        for (let i = grit.length - 1; i >= 0; i--) if (grit[i].life <= 0) grit.splice(i, 1);
        if (this.endT > 0) { if (--this.endT === 0) { this.result = { score: Math.max(0, Math.round(this.cover() * 100) - this.torn * 8), ruined: this.ruined }; return true; } return false; }
        if (quitHit()) { this.result = 'quit'; return true; }
        const sp = 1.7;
        if (inp.down('left')) this.bx -= sp;
        if (inp.down('right')) this.bx += sp;
        if (inp.down('up')) this.by -= sp;
        if (inp.down('down')) this.by += sp;
        this.bx = Math.max(0, Math.min(c.W - 1, this.bx)); this.by = Math.max(0, Math.min(c.H - 1, this.by));
        if (zHeld(this)) {
          if (this.t % 2 === 0) for (let k = 0; k < 3; k++) { const a = Math.random() * Math.PI * 2; grit.push({ x: PIPE_X + this.bx, y: PIPE_Y + this.by, vx: Math.cos(a) * 1.4, vy: Math.sin(a) * 1.4, life: 10 }); }
          if (this.t % 10 === 0) G.audio.sfx('spray');
          for (let cy = Math.floor((this.by - R) / CS); cy <= Math.floor((this.by + R) / CS); cy++) for (let cx = Math.floor((this.bx - R) / CS); cx <= Math.floor((this.bx + R) / CS); cx++) {
            if (cx < 0 || cy < 0 || cx >= c.cols || cy >= c.rows) continue;
            const i = cy * c.cols + cx;
            if (!c.wood[i] || Math.hypot(cx * CS + CS / 2 - this.bx, cy * CS + CS / 2 - this.by) > R) continue;
            if (tape[i] && hp[i] > 0) {
              if (--hp[i] <= 0) {
                this.torn++; G.audio.sfx('pop');
                if (this.torn >= B.tears) { this.ruined = 'tape'; this.endT = 60; G.audio.sfx('crack'); this.pop('BLEW THROUGH!'); talk.say('Stop! You blew right through the tape.'); return false; }
                this.pop('THROUGH THE TAPE! (' + G.sayable(B.tears - this.torn) + ' more: ruined)'); talk.say('Off the tape! That\'s the rim under there!');
              }
            } else if (!tape[i]) blasted[i] = Math.min(1, blasted[i] + 0.07);
          }
        }
        if (this.t % 10 === 0 && this.cover() >= 1) { this.endT = 40; G.audio.sfx('secret'); talk.say('Look at that grain stand up. Beautiful.'); return false; }
        if (--this.left <= 0 || inp.hit('b')) { inp.eat('b'); this.endT = 40; G.audio.sfx('select'); }
        return false;
      },
      draw(ctx) {
        benchBack(ctx, 'SANDBLASTING', pipe.name);
        G.box(ctx, 4, 16, 88, 112);
        FT().draw(ctx, 'The blaster', 10, 20, '#c8c0d8');
        ctx.fillStyle = '#5a626c'; ctx.fillRect(16, 34, 30, 50); ctx.fillStyle = '#7a828c'; ctx.fillRect(16, 34, 30, 3);
        ctx.fillStyle = '#2a2a30'; ctx.fillRect(22, 44, 18, 30); ctx.fillStyle = '#c8b898'; ctx.fillRect(23, 45 + Math.round(28 * (1 - this.left / B.time)), 16, Math.round(28 * (this.left / B.time)));
        FT().draw(ctx, 'Grit left', 10, 88, '#9890a8');
        FT().draw(ctx, 'Tape torn:', 10, 100, '#c8c0d8');
        FT().draw(ctx, '{r}' + '■'.repeat(this.torn) + '{d}' + '■'.repeat(Math.max(0, B.tears - this.torn)), 10, 110, '#c8c0d8');
        // the pipe: smooth where it's still bare, the grain standing up where it's blasted, the tape
        ctx.drawImage(c.raw, PIPE_X, PIPE_Y);
        for (let i = 0; i < c.wood.length; i++) {
          if (!c.wood[i]) continue;
          const x = PIPE_X + (i % c.cols) * CS, y = PIPE_Y + Math.floor(i / c.cols) * CS;
          if (tape[i]) {
            ctx.fillStyle = hp[i] > 0 ? '#e8dca0' : '#7a2018'; ctx.fillRect(x, y, CS, CS);
            if (hp[i] > 0) { ctx.fillStyle = hp[i] < B.tape * 0.4 ? '#f8a858' : '#d0c488'; ctx.fillRect(x, y + 1, CS, 1); }
            continue;
          }
          if (blasted[i] > 0) {
            ctx.globalAlpha = blasted[i];
            for (let k = 0; k < 16; k++) { ctx.fillStyle = (k + (i >> 2)) % 5 < 2 ? '#8a5a34' : '#c89060'; ctx.fillRect(x + (k % 4), y + (k >> 2), 1, 1); }
            ctx.globalAlpha = 1;
          }
          if (blasted[i] < 1 && (this.t >> 4) % 2 === 0 && this.t > 60) { ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(x + 1, y + 1, 2, 2); }
        }
        // the nozzle, and the grit flying
        const nx = PIPE_X + Math.round(this.bx), ny = PIPE_Y + Math.round(this.by);
        ctx.strokeStyle = this.zReady && G.input.down('a') ? '#f8d850' : '#f8f8f0'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(nx + 0.5, ny + 0.5, R, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#9aa0a8'; ctx.fillRect(nx - 1, ny - 12, 3, 10);
        for (const p of grit) { ctx.fillStyle = '#e8dcc0'; ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1); }
        FT().draw(ctx, 'BLASTED', 100, 106, '#f8f8f0', { shadow: '#000' });
        const cv = this.cover();
        ctx.fillStyle = '#0c0814'; ctx.fillRect(148, 106, 80, 7); ctx.fillStyle = cv >= 1 ? '#78e070' : '#68c8ff'; ctx.fillRect(149, 107, Math.round(78 * Math.min(1, cv)), 5);
        if (this.msgT > 0) { const w = FT().width(this.msg); FT().draw(ctx, this.msg, Math.min(234 - w, Math.max(96, 160 - Math.round(w / 2))), 15, '#f86858', { shadow: '#000' }); }
        FT().draw(ctx, 'Hold Z: blast   X: done', 100, 120, '#c8c0d8', { shadow: '#000' });
        talk.draw(ctx);
      },
    };
  }

  // ---- BENDING THE STEM (the bent pipes): hold Z under the heat gun until the vulcanite goes soft,
  // then ↓ bends it (↑ straightens it) to Dad's paper template, and X sets it in cold water. It only
  // bends while it's soft, and it cools off fast. Too hot and it bubbles. Result: { score, ruined }.
  function bendCmd(pipe, talk) {
    const B = WORK[pipe.id].bend, SOFT = 55, HOT = 88;
    return {
      start() { Object.assign(this, { t: 0, temp: 0, angle: 0, bubbles: 0, hotT: 0, stiffT: 0, endT: 0, ruined: null, msg: null, msgT: 0, zReady: false, B, SOFT, HOT }); talk.nowT = 0; G.play.overlay = this; },
      pop(m) { this.msg = m; this.msgT = 50; },
      score() { return Math.max(0, Math.round(100 - Math.abs(this.angle - B.target) * (35 / B.tol) - this.bubbles * 8)); },
      update() {
        const inp = G.input;
        this.t++; talk.update();
        if (this.msgT > 0) this.msgT--;
        if (this.stiffT > 0) this.stiffT--;
        if (this.endT > 0) { if (--this.endT === 0) { this.result = { score: this.score(), ruined: this.ruined }; return true; } return false; }
        if (quitHit()) { this.result = 'quit'; return true; }
        this.temp = zHeld(this) ? Math.min(100, this.temp + B.heat) : Math.max(0, this.temp - 0.45);
        if (this.temp > HOT) {
          if (++this.hotT % 14 === 0) {
            this.bubbles++; G.audio.sfx('pop');
            if (this.bubbles >= B.bubbles) { this.ruined = 'bubbles'; this.endT = 60; G.audio.sfx('crack'); this.pop('BUBBLED!'); talk.say('Too hot! It bubbled.'); return false; }
            this.pop('BUBBLING! (' + G.sayable(B.bubbles - this.bubbles) + ' more: ruined)'); talk.say('Too hot! Let it cool a second!');
          }
        } else this.hotT = 0;
        const soft = this.temp >= SOFT, push = inp.down('down') ? 1 : inp.down('up') ? -1 : 0;
        if (push) {
          if (soft) { this.angle = Math.max(0, Math.min(60, this.angle + push * (this.temp >= 70 ? 0.45 : 0.25))); if (this.t % 8 === 0) G.audio.sfx('blip'); }
          else if (!this.stiffT) { this.stiffT = 80; G.audio.sfx('bump'); this.pop('TOO STIFF: HEAT IT UP'); }
        }
        if (inp.hit('b') && this.angle > 2) {
          inp.eat('b'); this.endT = 40; G.audio.sfx('gulp'); this.pop('*hssss*');
          const err = Math.abs(this.angle - B.target);
          talk.say(err <= B.tol * 0.4 ? 'Right on the template. Perfect.' : err <= B.tol ? 'Close. That\'ll sit nicely.' : this.angle < B.target ? 'Not bent enough.' : 'That\'s bent too far.');
        }
        return false;
      },
      draw(ctx) {
        benchBack(ctx, 'BENDING THE STEM', pipe.name);
        // Dad's paper template, with the bend drawn on it
        const px = 44, py = 92, len = 120;
        ctx.fillStyle = '#f2ecdc'; ctx.fillRect(px - 8, 30, 150, 80);
        ctx.fillStyle = '#dcdcea'; for (let y = 38; y < 110; y += 8) ctx.fillRect(px - 8, y, 150, 1);
        const tipAt = (deg) => { const a = (deg * Math.PI) / 180; return [px + 40 + Math.cos(a) * (len - 40), py - Math.sin(a) * (len - 40)]; };
        const [tx, ty] = tipAt(B.target);
        ctx.fillStyle = '#4a4a52';
        for (let k = 0; k <= 40; k += 2) { ctx.fillRect(px + k, py, 1, 1); }
        for (let k = 0; k <= 30; k++) { const s = k / 30; if (k % 2 === 0) ctx.fillRect(Math.round(px + 40 + (tx - px - 40) * s), Math.round(py + (ty - py) * s), 1, 1); }
        FT().draw(ctx, 'template', px + 90, 34, '#8a8478');
        // the stem: straight, then bent at the heat
        const [sx, sy] = tipAt(this.angle), hue = this.temp >= SOFT ? '#3a2a2a' : '#1c1c22';
        ctx.strokeStyle = hue; ctx.lineWidth = 5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + 40, py); ctx.lineTo(sx, sy); ctx.stroke();
        ctx.lineWidth = 1; ctx.lineCap = 'butt';
        ctx.fillStyle = '#c89a62'; ctx.fillRect(px - 14, py - 5, 14, 10);
        // bubbles in it
        ctx.fillStyle = '#f8f0e0'; for (let k = 0; k < this.bubbles; k++) ctx.fillRect(px + 34 + k * 4, py - 2 + (k % 2) * 3, 2, 2);
        // the heat gun, blowing on the bend
        ctx.fillStyle = '#5a5a64'; ctx.fillRect(px + 30, 112, 20, 12); ctx.fillRect(px + 36, 100, 8, 12);
        if (this.zReady && G.input.down('a') && !this.endT) { ctx.fillStyle = (this.t >> 1) % 2 ? '#f8a838' : '#f86838'; ctx.fillRect(px + 37, 96 - (this.t % 3), 6, 4); }
        // the temperature, with the soft range and too hot
        const bx = 206, by = 30, bh = 80;
        ctx.fillStyle = '#0c0814'; ctx.fillRect(bx, by, 12, bh);
        ctx.fillStyle = '#2a4a2a'; ctx.fillRect(bx + 1, by + bh - Math.round((HOT / 100) * bh), 10, Math.round(((HOT - SOFT) / 100) * bh));
        ctx.fillStyle = '#5a2020'; ctx.fillRect(bx + 1, by + 1, 10, Math.round(((100 - HOT) / 100) * bh));
        const fill = Math.round((this.temp / 100) * (bh - 2));
        ctx.fillStyle = this.temp > HOT ? '#f86858' : this.temp >= SOFT ? '#78e070' : '#68c8ff'; ctx.fillRect(bx + 3, by + bh - 1 - fill, 6, fill);
        FT().draw(ctx, 'SOFT', bx - 24, by + bh - Math.round((HOT / 100) * bh) + 8, '#78e070', { shadow: '#000' });
        FT().draw(ctx, 'HOT', bx - 18, by + 2, '#f86858', { shadow: '#000' });
        FT().draw(ctx, G.sayable(Math.round(this.angle)) + '°', 8, 112, '#f8f8f0', { shadow: '#000' });
        if (this.msgT > 0) { const w = FT().width(this.msg); FT().draw(ctx, this.msg, 120 - Math.round(w / 2), 15, /BUBBL|STIFF/.test(this.msg) ? '#f86858' : '#f8d850', { shadow: '#000' }); }
        FT().draw(ctx, 'Z heat  ↓↑ bend  X set', 96, 120, '#c8c0d8', { shadow: '#000' });
        talk.draw(ctx);
      },
    };
  }

  // ---- THE STAIN: pick the jar off the shelf, then rub it on: hold Z and everything under the
  // dauber takes the stain (a two-coat pipe needs going over twice). The EVEN bar fills as the wood
  // gets covered, and missed spots blink. On the harder pipes, going back over a spot too many
  // times puddles it (dark). It stops on its own once it's all covered (or when it dries).
  // Result: { score, stain } (or 'quit').
  function stainCmd(pipe, talk) {
    const W = WORK[pipe.id].stain, c = woodCells(pipe), R = 11 - pipe.d, TIME = W.time * pipe.coats, RATE = 0.95 / R, DONE = pipe.coats * 0.85;
    const CAP = W.puddle == null ? pipe.coats : pipe.coats + W.puddle + 1.5, PUDDLE = W.puddle == null ? Infinity : pipe.coats + W.puddle;
    const coat = new Float32Array(c.cols * c.rows), g = G.art.PIPE_GEO[pipe.id], b = g.bowl;
    return {
      start() {
        Object.assign(this, { step: 'pick', sel: 0, t: 0, left: TIME, wrong: 0, endT: 0, bx: b.cx * 2, by: (b.top + b.h * 0.5) * 2, fin: null, dark: null, painted: false, warnT: 0, coat, woodCell: c.wood, cols: c.cols, R, DONE, PUDDLE });
        talk.nowT = 0; G.play.overlay = this;
      },
      covered() { let k = 0; for (let i = 0; i < coat.length; i++) if (c.wood[i] && coat[i] >= DONE) k++; return k / c.count; },
      good(i) { return coat[i] >= DONE && coat[i] <= PUDDLE; },
      even() { let ok = 0; for (let i = 0; i < coat.length; i++) if (c.wood[i] && this.good(i)) ok++; return ok / c.count; },
      score() { return Math.max(0, Math.round(this.even() * 100) - this.wrong * 5); },
      update() {
        const inp = G.input;
        this.t++; talk.update();
        if (this.warnT > 0) this.warnT--;
        if (this.endT > 0) { if (--this.endT === 0) { this.result = { score: this.score(), stain: this.stain }; return true; } return false; }
        if (quitHit()) { this.result = 'quit'; return true; }
        if (this.step === 'pick') {
          if (inp.hit('up') && this.sel > 0) { this.sel--; G.audio.sfx('menu'); }
          if (inp.hit('down') && this.sel < STAIN_ORDER.length - 1) { this.sel++; G.audio.sfx('menu'); }
          if (inp.hit('a')) {
            inp.eat('a');
            const st = STAIN_ORDER[this.sel];
            if (pipe.stain && st !== pipe.stain) {
              this.wrong++; G.audio.sfx('no');
              talk.say(['Hmm. Not that one. Not on this pipe.', 'No, no. Think about what I told you.', 'Try again. I believe in you.'][(this.wrong - 1) % 3]);
              return false;
            }
            this.stain = st; this.step = 'paint'; this.zReady = false; G.audio.sfx('gulp');
            const col = pipeColors(pipe, st);
            this.fin = G.art.pipeArt(pipe.id, 2, col);
            this.dark = G.art.pipeArt(pipe.id, 2, { wood: G.art.shade(col.wood, -0.5), shankWood: G.art.shade(col.shankWood, -0.5) });
            talk.say((pipe.coats > 1 ? 'Two coats: go over all of it twice. ' : 'Go over every bit once. ') + (W.puddle == null ? 'Hold Z.' : 'And keep moving, or it puddles.'));
          }
          return false;
        }
        // rubbing it on
        const sp = 1.7;
        if (inp.down('left')) this.bx -= sp;
        if (inp.down('right')) this.bx += sp;
        if (inp.down('up')) this.by -= sp;
        if (inp.down('down')) this.by += sp;
        this.bx = Math.max(0, Math.min(c.W - 1, this.bx)); this.by = Math.max(0, Math.min(c.H - 1, this.by));
        if (zHeld(this)) {
          this.painted = true;
          let puddled = false;
          for (let cy = Math.floor((this.by - R) / CS); cy <= Math.floor((this.by + R) / CS); cy++) for (let cx = Math.floor((this.bx - R) / CS); cx <= Math.floor((this.bx + R) / CS); cx++) {
            if (cx < 0 || cy < 0 || cx >= c.cols || cy >= c.rows) continue;
            const i = cy * c.cols + cx;
            if (Math.hypot(cx * CS + CS / 2 - this.bx, cy * CS + CS / 2 - this.by) > R || !c.wood[i]) continue;
            const was = coat[i];
            coat[i] = Math.min(CAP, coat[i] + RATE);
            if (was <= PUDDLE && coat[i] > PUDDLE) puddled = true;
          }
          if (puddled && !this.warnT) { this.warnT = 90; G.audio.sfx('no'); talk.say('Too much! Keep moving, it puddles.'); }
          if (this.t % 12 === 0) G.audio.sfx('spray');
        }
        // covered all over: done
        if (this.painted && this.t % 10 === 0 && this.covered() >= 0.95) { this.endT = 40; G.audio.sfx('secret'); talk.say(this.even() >= 0.9 ? 'That\'s it! Stop right there. Perfect.' : 'Covered. Some of it puddled, though.'); return false; }
        if (--this.left <= 0 || inp.hit('b')) { inp.eat('b'); this.endT = 40; G.audio.sfx('select'); }
        return false;
      },
      draw(ctx) {
        benchBack(ctx, 'THE STAIN', pipe.name);
        // the shelf of jars
        G.box(ctx, 4, 16, 88, 112);
        FT().draw(ctx, this.step === 'pick' ? 'Which jar?' : pipe.coats > 1 ? 'TWO coats' : 'One coat', 10, 20, '#c8c0d8');
        STAIN_ORDER.forEach((id, i) => {
          const y = 32 + i * 19, st = STAINS[id], col = st.color || '#e8c070', on = i === this.sel;
          ctx.fillStyle = '#e8ecf0'; ctx.fillRect(12, y, 9, 14); ctx.fillStyle = '#2a2a30'; ctx.fillRect(13, y - 2, 7, 3);
          ctx.fillStyle = col; ctx.fillRect(13, y + 4, 7, 9); if (!st.color) { ctx.fillStyle = '#f8e8a8'; ctx.fillRect(13, y + 4, 2, 9); }
          FT().draw(ctx, st.name, 25, y + 3, on ? '#f8d850' : this.step === 'paint' && id === this.stain ? '#78e070' : '#f8f8f0');
          if (on && this.step === 'pick') FT().draw(ctx, '→', 1, y + 3, '#f8d850');
        });
        // the pipe: bare briar, with the stain going on cell by cell (puddles go dark)
        ctx.drawImage(c.raw, PIPE_X, PIPE_Y);
        const blink = this.painted && (this.t >> 4) % 2 === 0;
        if (this.fin) for (let cy = 0; cy < c.rows; cy++) for (let cx = 0; cx < c.cols; cx++) {
          const i = cy * c.cols + cx, v = coat[i], x = PIPE_X + cx * CS, y = PIPE_Y + cy * CS;
          if (!c.wood[i]) continue;
          if (v > 0) {
            ctx.globalAlpha = Math.min(1, v / DONE);
            ctx.drawImage(this.fin, cx * CS, cy * CS, CS, CS, x, y, CS, CS);
            // (getting heavy: it darkens a little as a warning, then puddles)
            if (v > PUDDLE) { ctx.globalAlpha = Math.min(1, 0.6 + (v - PUDDLE)); ctx.drawImage(this.dark, cx * CS, cy * CS, CS, CS, x, y, CS, CS); }
            else if (PUDDLE < Infinity && v > pipe.coats) { ctx.globalAlpha = 0.35 * ((v - pipe.coats) / (PUDDLE - pipe.coats)); ctx.drawImage(this.dark, cx * CS, cy * CS, CS, CS, x, y, CS, CS); }
            ctx.globalAlpha = 1;
          }
          if (blink && v < DONE) { ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(x + 1, y + 1, 2, 2); }
        }
        if (this.step === 'paint') {
          // the dauber, the EVEN bar, and how long until it dries
          const bx = PIPE_X + Math.round(this.bx), by = PIPE_Y + Math.round(this.by), ev = this.even();
          ctx.strokeStyle = this.zReady && G.input.down('a') ? '#f8d850' : '#f8f8f0'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(bx + 0.5, by + 0.5, R, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = '#f4f0e8'; ctx.fillRect(bx - 1, by - 1, 3, 3);
          FT().draw(ctx, 'EVEN', 100, 106, '#f8f8f0', { shadow: '#000' });
          ctx.fillStyle = '#0c0814'; ctx.fillRect(126, 106, 102, 7); ctx.fillStyle = ev >= 0.95 ? '#78e070' : '#68c8ff'; ctx.fillRect(127, 107, Math.round(100 * Math.min(1, ev / 0.95)), 5);
          const frac = this.left / TIME;
          FT().draw(ctx, 'DRY', 100, 116, '#9890a8', { shadow: '#000' });
          ctx.fillStyle = '#0c0814'; ctx.fillRect(126, 117, 102, 4); ctx.fillStyle = frac > 0.3 ? '#9890a8' : '#f86858'; ctx.fillRect(127, 118, Math.round(100 * frac), 2);
          FT().draw(ctx, 'Hold Z: stain   X: done', 100, 124, '#c8c0d8', { shadow: '#000' });
        } else FT().draw(ctx, '↑↓ pick a jar   Z: use it', 100, 124, '#c8c0d8', { shadow: '#000' });
        talk.draw(ctx);
      },
    };
  }

  // a jar of leaf off Dad's shelf (drawn once)
  const jarCache = {};
  function jarArt(id) {
    if (jarCache[id]) return jarCache[id];
    const lf = LEAF[id], c = G.canvas(27, 39), x = c.getContext('2d');
    x.fillStyle = '#b8bcc4'; x.fillRect(3, 0, 20, 5); x.fillStyle = '#d8dce4'; x.fillRect(3, 0, 20, 1);
    x.fillStyle = '#d0dce4'; x.fillRect(1, 5, 24, 33);
    for (let yy = 9; yy < 37; yy++) for (let xx = 2; xx < 25; xx++) { x.fillStyle = G.art.shade(lf.color, (G.hash(xx, yy, 2) - 0.5) * 0.4); x.fillRect(xx, yy, 1, 1); }
    x.fillStyle = 'rgba(255,255,255,0.35)'; x.fillRect(3, 7, 1, 28);
    x.fillStyle = '#f4ecd8'; x.fillRect(3, 19, 20, 9);
    FT().draw(x, lf.tag, 13 - Math.round(FT().width(lf.tag) / 2), 20, '#2a2a32');
    return (jarCache[id] = c);
  }
  // a bowlful of a blend (drawn once; the pack shows as much of it as is in)
  const fillCache = {};
  function fillArt(tob) {
    if (fillCache[tob.id]) return fillCache[tob.id];
    const c = G.canvas(46, 72), x = c.getContext('2d'), colors = tob.mix.map((id) => LEAF[id].color);
    for (let yy = 0; yy < 72; yy++) for (let xx = 0; xx < 46; xx++) { x.fillStyle = G.art.shade(colors[Math.floor(G.hash(xx, yy, 7) * 4)], (G.hash(xx, yy, 9) - 0.5) * 0.3); x.fillRect(xx, yy, 1, 1); }
    return (fillCache[tob.id] = c);
  }

  // ---- THE BLEND: four scoops from Dad's jars. Z adds a scoop, X puts the last one back. With
  // four in, Dad tastes it and says how many are right. Result: how many tries (or 'quit').
  function blendCmd(tob, talk) {
    const want = {};
    for (const k of tob.mix) want[k] = (want[k] || 0) + 1;
    const rightOf = (scoops) => { const n = {}; let ok = 0; for (const k of scoops) n[k] = (n[k] || 0) + 1; for (const k in n) ok += Math.min(n[k], want[k] || 0); return ok; };
    talk.lines.unshift(tob.clue);
    return {
      start() { Object.assign(this, { sel: 0, scoops: [], tries: 0, checkT: 0, doneT: 0, t: 0 }); G.play.overlay = this; },
      update() {
        const inp = G.input;
        this.t++; talk.update();
        if (this.doneT > 0) { if (--this.doneT === 0) { this.result = this.tries; return true; } return false; }
        if (quitHit()) { this.result = 'quit'; return true; }
        if (this.checkT > 0) {
          // Dad has a sniff
          if (--this.checkT > 0) return false;
          this.tries++;
          const ok = rightOf(this.scoops);
          if (ok >= 4) { G.audio.sfx('secret'); talk.say('THAT\'S it. That\'s ' + tob.name + '.'); this.doneT = 70; return false; }
          G.audio.sfx(ok >= 3 ? 'blip' : 'no');
          talk.say(['Not one of those is right. Not one.', 'One of those is right.', 'Two of those are right.', 'Three! So close. One is wrong.'][ok] + ' (X takes one back.)');
          return false;
        }
        const col = this.sel % 5;
        if (inp.hit('left') && col > 0) { this.sel--; G.audio.sfx('menu'); }
        if (inp.hit('right') && col < 4) { this.sel++; G.audio.sfx('menu'); }
        if (inp.hit('down') && this.sel < 5) { this.sel += 5; G.audio.sfx('menu'); }
        if (inp.hit('up') && this.sel >= 5) { this.sel -= 5; G.audio.sfx('menu'); }
        if (inp.hit('a') && this.scoops.length < 4) {
          inp.eat('a');
          this.scoops.push(LEAF_ORDER[this.sel]); G.audio.sfx('pop');
          if (this.scoops.length === 4) this.checkT = 40;
        }
        if (inp.hit('b') && this.scoops.length) { inp.eat('b'); this.scoops.pop(); G.audio.sfx('cancel'); }
        return false;
      },
      draw(ctx) {
        benchBack(ctx, 'THE BLEND', tob.name);
        // two shelves of jars
        ctx.fillStyle = '#5a3a20'; ctx.fillRect(4, 55, 154, 4); ctx.fillRect(4, 99, 154, 4);
        LEAF_ORDER.forEach((id, i) => {
          const x = 8 + (i % 5) * 30, y = 16 + Math.floor(i / 5) * 44;
          ctx.drawImage(jarArt(id), x, y);
          if (i === this.sel) corners(ctx, x - 1, y - 2, 28, 43, '#f8d850');
        });
        // the jar Nate's on
        const lf = LEAF[LEAF_ORDER[this.sel]];
        FT().draw(ctx, lf.name, 6, 105, '#f8d850', { shadow: '#000' });
        FT().wrap(lf.about, 154).slice(0, 2).forEach((l, k) => FT().draw(ctx, l, 6, 114 + k * 9, '#c8c0d8', { shadow: '#000' }));
        // the mixing bowl, and what's in it
        G.box(ctx, 162, 16, 74, 112);
        FT().draw(ctx, 'THE BOWL', 172, 20, '#c8c0d8');
        ctx.fillStyle = '#7a4a28'; ctx.fillRect(170, 46, 58, 12); ctx.fillRect(174, 58, 50, 4); ctx.fillStyle = '#9a6238'; ctx.fillRect(170, 46, 58, 2);
        this.scoops.forEach((id, i) => {
          const c = LEAF[id].color, x = 174 + i * 13;
          for (let k = 0; k < 14; k++) { ctx.fillStyle = G.art.shade(c, (G.hash(k, i, 3) - 0.5) * 0.4); ctx.fillRect(x + (k % 5) * 2, 44 - Math.floor(k / 5) * 2, 2, 2); }
        });
        for (let i = 0; i < 4; i++) {
          const id = this.scoops[i];
          FT().draw(ctx, G.sayable(i + 1) + '. ' + (id ? LEAF[id].tag : '...'), 170, 68 + i * 11, id ? '#f8f8f0' : '#5a4e70');
        }
        FT().draw(ctx, this.checkT > 0 ? '*sniff*' : 'Z: scoop', 170, 114, this.checkT > 0 ? '#f8d850' : '#9890a8');
        talk.draw(ctx);
      },
    };
  }

  // ---- PACK A BOWL: three pinches, each a little firmer (Z when the needle's in the box), then
  // light it and watch the smoke come out in the tobacco's color. Result: 0-100 (or 'quit').
  function packCmd(tob, talk) {
    const d = tob.d, ZONES = [0.25, 0.5, 0.75], width = 0.26 - d * 0.025, period = 150 - d * 15;
    return {
      start() { Object.assign(this, { k: 0, t: 0, scores: [], fill: 0, tampT: 0, litT: 0, smoke: [], endT: 0 }); talk.nowT = 0; G.play.overlay = this; },
      needle() { return 0.5 - Math.cos((this.t / period) * Math.PI * 2) * 0.5; },
      update() {
        const inp = G.input;
        this.t++; talk.update();
        if (this.tampT > 0) this.tampT--;
        for (const s of this.smoke) { s.y -= 0.3; s.x += Math.sin((s.t + s.y) * 0.1) * 0.3; s.t++; }
        this.smoke = this.smoke.filter((s) => s.t < 80);
        if (this.endT > 0) { if (--this.endT === 0) { this.result = Math.round(this.scores.reduce((a, b) => a + b, 0) / 3); return true; } return false; }
        if (quitHit()) { this.result = 'quit'; return true; }
        if (this.k >= 3) {
          // lit: the smoke puffs up in this tobacco's color
          this.litT++;
          if (this.litT % 18 === 0) this.smoke.push({ x: 70 + Math.random() * 10, y: 40, t: 0 });
          if (this.litT === 140) this.endT = 30;
          return false;
        }
        if (inp.hit('a')) {
          inp.eat('a');
          const v = this.needle(), off = Math.abs(v - ZONES[this.k]), sc = off <= width / 2 ? Math.round(100 - (off / (width / 2)) * 25) : Math.max(20, Math.round(70 - (off - width / 2) * 200));
          this.scores.push(sc); this.tampT = 16; this.fill = (this.k + 1) / 3;
          G.audio.sfx(sc >= 75 ? 'select' : 'bump');
          talk.say(sc >= 90 ? 'Perfect.' : sc >= 75 ? 'Good.' : v < ZONES[this.k] ? 'Too loose. It\'ll go out on you.' : 'Too tight! You\'ll never get a draw through that.');
          this.k++;
          if (this.k >= 3) { G.audio.sfx('fuse'); talk.say('Now light it. A charring light first, then the real one.'); }
        }
        return false;
      },
      draw(ctx) {
        benchBack(ctx, 'PACK A BOWL', tob.name);
        // the pipe bowl, cut away so you can see the tobacco going in
        const bx = 40, by = 44, bw = 70, bh = 76;
        ctx.fillStyle = '#7a4426'; ctx.fillRect(bx, by, bw, bh); ctx.fillStyle = '#9a5a34'; ctx.fillRect(bx, by, 8, bh); ctx.fillStyle = '#5a3018'; ctx.fillRect(bx + bw - 8, by, 8, bh);
        ctx.fillStyle = '#1c120e'; ctx.fillRect(bx + 12, by, bw - 24, bh - 12);
        const top = by + bh - 12 - Math.round((bh - 16) * Math.min(1, this.fill)), fh = by + bh - 12 - top;
        if (fh > 0) ctx.drawImage(fillArt(tob), 0, 72 - fh, 46, fh, bx + 12, top, 46, fh);
        if (this.k >= 3) { ctx.fillStyle = '#f86838'; for (let x = bx + 14; x < bx + bw - 14; x += 3) if (G.hash(x, this.litT >> 3, 4) < 0.5) ctx.fillRect(x, top, 2, 2); }
        // the tamper, pressing down
        if (this.k < 3 || this.tampT > 0) {
          const ty = top - 26 + (this.tampT > 8 ? 4 : 0);
          ctx.fillStyle = '#c8ccd4'; ctx.fillRect(bx + 22, ty, 26, 4); ctx.fillRect(bx + 32, ty - 22, 6, 22); ctx.fillStyle = '#f8f8f8'; ctx.fillRect(bx + 32, ty - 22, 1, 22);
        }
        // smoke rings, in this tobacco's color
        ctx.fillStyle = tob.smoke;
        for (const s of this.smoke) {
          const r = 2 + s.t * 0.1;
          ctx.globalAlpha = Math.max(0, 1 - s.t / 80);
          for (let a = 0; a < Math.PI * 2; a += 0.35) ctx.fillRect(Math.round(s.x + Math.cos(a) * r), Math.round(s.y + Math.sin(a) * r * 0.7), 1, 1);
        }
        ctx.globalAlpha = 1;
        // the needle and the three boxes
        const mx = 170, my = 22, mh = 100;
        ctx.fillStyle = '#0c0814'; ctx.fillRect(mx, my, 16, mh); ctx.fillStyle = '#2a2240'; ctx.fillRect(mx + 1, my + 1, 14, mh - 2);
        ZONES.forEach((z, i) => {
          const zy = my + mh - Math.round((z + width / 2) * mh), zh = Math.round(width * mh);
          ctx.fillStyle = i === this.k ? '#78e070' : i < this.k ? '#3a6a3a' : '#4a4060'; ctx.fillRect(mx + 1, zy, 14, zh);
          FT().draw(ctx, ['Gently', 'Firmer', 'Firm'][i], mx + 20, zy + Math.round(zh / 2) - 4, i === this.k ? '#f8f8f0' : '#9890a8', { shadow: '#000' });
        });
        if (this.k < 3) { const ny = my + mh - Math.round(this.needle() * mh); ctx.fillStyle = '#f8d850'; ctx.fillRect(mx - 3, ny - 1, 22, 2); }
        FT().draw(ctx, this.k < 3 ? 'Z: tamp' : 'Lit!', mx, my + mh + 3, '#9890a8', { shadow: '#000' });
        talk.draw(ctx);
      },
    };
  }

  // ---- the finished pipe (or tin), held up to the light
  function revealCmd(img, title, stars) {
    return {
      start() { this.t = 0; G.play.overlay = this; G.audio.sfx('fanfare'); },
      update() { this.t++; if (this.t > 45 && G.input.hit('a')) { G.input.eat('a'); return true; } return false; },
      draw(ctx) {
        ctx.fillStyle = '#1a1220'; ctx.fillRect(0, 0, G.W, G.H);
        ctx.save(); ctx.translate(120, 62); ctx.rotate(this.t * 0.008); ctx.fillStyle = '#261c30';
        for (let i = 0; i < 8; i++) { ctx.rotate(Math.PI / 4); ctx.fillRect(-7, 0, 14, 150); }
        ctx.restore();
        const s = Math.min(1, this.t / 20) * 2, w = Math.round(img.width * s), h = Math.round(img.height * s);
        if (w > 0) ctx.drawImage(img, 120 - Math.round(w / 2), 62 - Math.round(h / 2), w, h);
        if (this.t < 20) return;
        const tw = FT().width(title);
        FT().draw(ctx, title, 120 - Math.round(tw / 2), 104, '#f8d850', { shadow: '#000' });
        const st = '{y}' + '★'.repeat(stars) + '{d}' + '★'.repeat(3 - stars);
        FT().draw(ctx, st, 120 - Math.round(FT().width('★★★') / 2), 116, '#f8d850', { shadow: '#000' });
        if (this.t > 45 && (this.t >> 4) % 2) FT().draw(ctx, 'Z', 116, 140, '#9890a8');
      },
    };
  }

  // ---- making a pipe, start to finish: the bandsaw, the lathe, then sanding (or the panels, or
  // sandblasting), bending the stem on the bent ones, and the stain. A step that ruins the pipe
  // (cutting into it, a snap, a crack, lopsided, through the tape) means a new block and starting
  // over; a bad bend gets a new stem, and a blotchy stain gets sanded back and done again.
  function* startOver(why) {
    yield G.say('Dad', RUIN[why] || 'That one\'s going in the scrap bin.');
    return (yield G.ask('Dad', 'Start over with a new block?', ['Start over', 'Not now'])) === 0;
  }
  function* makePipe(pipe) {
    const W = WORK[pipe.id], talk = dadTalk(pipe.facts), again = G.pipeHas(pipe.id);
    const later = function* () { yield G.say('Dad', 'We\'ll finish it another time.'); };
    yield G.say('Dad', again ? 'The ' + pipe.name + ' again? Sure. Practice makes perfect.' : 'Ah. The ' + pipe.name + '.');
    yield G.say('Dad', pipe.intro);
    for (let tries = 0; ; tries++) {
      if (tries) yield G.say(null, 'Dad sets a new block of briar on the bench and draws the pipe on it.');
      // 1. the bandsaw
      yield howToCmd('THE BANDSAW', HOW_TO.saw);
      const saw = yield sawCmd(pipe, talk);
      if (saw === 'quit') { yield* later(); return; }
      if (saw.ruined) { if (yield* startOver(saw.ruined)) continue; return; }
      yield G.say('Dad', saw.score >= 85 ? 'Right on the line. Beautiful.' : saw.score >= 65 ? 'Close enough. The lathe will clean it up.' : 'A little wobbly. We\'ll see.');
      // 2. the lathe
      yield howToCmd('THE LATHE', HOW_TO.lathe.concat([LATHE_TIP[pipe.id]]));
      const lathe = yield latheCmd(pipe, talk);
      if (lathe === 'quit') { yield* later(); return; }
      if (lathe.ruined) { if (yield* startOver(lathe.ruined)) continue; return; }
      yield G.say('Dad', lathe.score >= 90 ? 'Look at that. Clean as a whistle.' : lathe.score >= 72 ? 'Nice. A little sanding and it\'s perfect.' : 'Ehh. Sandpaper covers a multitude of sins.');
      yield G.say(null, 'Dad drills the chamber and the air hole.');
      // 3. sanding, the panels, or sandblasting
      const blast = W.finish === 'blast';
      yield howToCmd(blast ? 'SANDBLASTING' : W.finish === 'panels' ? 'THE PANELS' : 'SANDING', HOW_TO[blast ? 'blast' : W.finish === 'panels' ? 'panels' : 'sand']);
      const fin = yield (blast ? blastCmd(pipe, talk) : sandCmd(pipe, talk));
      if (fin === 'quit') { yield* later(); return; }
      if (fin.ruined) { if (yield* startOver(fin.ruined)) continue; return; }
      yield G.say('Dad', blast ? (fin.score >= 85 ? 'Look at that grain stand up.' : 'A few smooth spots left. It\'ll do.') : fin.score >= 90 ? 'Smooth as glass. You can see your face in it.' : 'A couple of flat spots. Nobody will notice. I\'ll notice.');
      // 4. the bent ones: bend the stem
      let bend = null;
      if (W.bend) {
        for (;;) {
          yield howToCmd('BENDING THE STEM', HOW_TO.bend);
          bend = yield bendCmd(pipe, talk);
          if (bend === 'quit') { yield* later(); return; }
          if (!bend.ruined && bend.score >= W.pass) break;
          yield G.say('Dad', bend.ruined ? 'It bubbled. Vulcanite does that if you rush it.' : 'That\'s not the bend. It won\'t sit right.');
          if ((yield G.ask('Dad', 'I\'ve got another stem. Try the bend again?', ['Try again', 'Not now'])) !== 0) { yield* later(); return; }
        }
      }
      // 5. the stain
      yield G.say('Dad', pipe.stainHint);
      let st;
      for (;;) {
        yield howToCmd('THE STAIN', HOW_TO.stain);
        st = yield stainCmd(pipe, talk);
        if (st === 'quit') { yield* later(); return; }
        if (st.score >= W.stain.pass) break;
        yield G.say('Dad', 'Blotchy. That won\'t do.');
        if ((yield G.ask('Dad', 'Sand it back and stain it again?', ['Try again', 'Not now'])) !== 0) { yield* later(); return; }
      }
      yield G.say('Dad', st.score >= 90 ? 'Even as glass. Beautiful.' : st.score >= 72 ? 'Good coverage. Nice.' : 'A little blotchy. It\'ll age in.');
      yield G.say(null, 'Tripoli buff. White polish. And then...');
      const scores = [saw.score, lathe.score, fin.score, st.score].concat(bend ? [bend.score] : []);
      const stars = starsFor(scores.reduce((a, b) => a + b, 0) / scores.length), made = pipesMade(), prev = made[pipe.id];
      made[pipe.id] = { stars: Math.max(stars, prev ? prev.stars : 0), stain: st.stain };
      yield revealCmd(G.pipeLook(pipe.id, 1), pipe.name, stars);
      yield G.say('Dad', pipe.made);
      if (!prev) {
        G.audio.sfx('secret');
        yield G.say(null, 'The {y}' + pipe.name + '{/} is in {y}COLLECTABLES{/} now. Pick it there and Dad\'s Pipe looks just like it.');
      }
      yield* pipeBookGift();
      return;
    }
  }
  // ...and blending a tobacco
  function* makeTobacco(tob) {
    const talk = dadTalk(tob.facts), again = G.tinHas(tob.id);
    yield G.say('Dad', again ? tob.name + ' again? Good choice.' : 'Ah. ' + tob.name + '.');
    yield howToCmd('THE BLEND', HOW_TO.blend);
    yield G.say('Dad', tob.clue);
    const tries = yield blendCmd(tob, talk);
    if (tries === 'quit') { yield G.say('Dad', 'Another time, then.'); return; }
    yield G.say('Dad', tries === 1 ? 'First try! You\'ve got the nose.' : tries <= 3 ? 'There it is.' : 'Got there in the end.');
    yield G.say('Dad', 'Now pack a bowl.');
    yield howToCmd('PACK A BOWL', HOW_TO.pack);
    const pack = yield packCmd(tob, talk);
    if (pack === 'quit') { yield G.say('Dad', 'Another time, then.'); return; }
    yield G.say('Dad', tob.taste);
    const blend = tries <= 1 ? 100 : tries === 2 ? 85 : tries === 3 ? 72 : 60;
    const stars = starsFor((blend + pack) / 2), made = tinsMade(), prev = made[tob.id];
    made[tob.id] = { stars: Math.max(stars, prev ? prev.stars : 0) };
    yield revealCmd(G.spr.tins[tob.id], tob.name, stars);
    if (!prev) {
      G.audio.sfx('secret');
      yield G.say(null, 'The {y}' + tob.name + '{/} tin is in {y}COLLECTABLES{/} now. Pack it in Dad\'s Pipe there, and the smoke comes out a different color.');
    }
    yield* pipeBookGift();
  }
  // Every pipe and every tobacco in Dad's book: he gives Nate the book.
  function* pipeBookGift() {
    const s = G.state;
    if (s.items.pipeBook || G.pipesMadeCount() < G.PIPES.length || G.tinsMadeCount() < G.TOBACCOS.length) return;
    G.play.overlay = null;
    const w = G.play.world;
    if (w.dad) { w.dad.dir = G.dirToward(P().x - w.dad.x, P().y - w.dad.y); P().dir = G.dirToward(w.dad.x - P().x, w.dad.y - P().y); }
    yield G.wait(20);
    yield G.say('Dad', 'Nate. That\'s all of them. Every pipe in my book. Every tobacco.');
    yield G.say('Nate', 'So I\'m a pipe maker now?');
    yield G.say('Dad', 'It means you listened. To ALL of it. Every single fact.');
    yield G.say('Nate', 'There were a lot of facts.');
    yield G.say('Dad', 'There were. Here. I want you to have this.');
    s.items.pipeBook = true;
    yield G.itemGet(G.spr.pipeBook, 'You got {y}Dad\'s Pipe Book{/}! Every pipe he\'s made, every tobacco he\'s smoked, and a LOT of notes.');
    yield G.say('Dad', 'I\'ll start a new one. I was almost out of pages anyway.');
    yield G.say(null, 'Read it any time: it\'s in {y}KEYS{/}.');
  }
  // ---- reading it: the real thing. Photos of every page of Dad's pipe journal, cover to last page,
  // in order (assets/pipebook, cropped to the page and cleaned up from the family's photos; nothing
  // added or left out). The game screen is too small to read handwriting, so the page is shown over
  // the game at full size (a picture on top of the canvas), with the page count along the bottom.
  // ←→ turn the pages, Z or X closes it.
  const BOOK_PAGES = 28;
  const bookSrc = (i) => 'assets/pipebook/' + String(i).padStart(2, '0') + '.jpg';
  let bookEl = null;
  function bookOverlay() {
    if (bookEl) return bookEl;
    const box = document.createElement('div'), img = document.createElement('img');
    box.style.cssText = 'position:fixed;display:none;z-index:50;background:#16100c;align-items:center;justify-content:center;pointer-events:none';
    img.style.cssText = 'max-height:96%;max-width:96%;box-shadow:0 4px 18px rgba(0,0,0,0.6);image-rendering:auto';
    box.appendChild(img);
    document.body.appendChild(box);
    return (bookEl = { box, img, pre: [] });
  }
  G.hidePipeBook = () => { if (bookEl) bookEl.box.style.display = 'none'; };
  function pipeBookView() {
    return {
      start() {
        this.i = 0; this.t = 0;
        const o = bookOverlay();
        // (load every page up front, so turning one is instant)
        if (!o.pre.length) for (let i = 0; i < BOOK_PAGES; i++) { const im = new Image(); im.src = bookSrc(i); o.pre.push(im); }
        this.show();
        G.audio.sfx('menu');
      },
      // the page over the game screen (all but the strip along the bottom, where the page count goes)
      show() {
        const o = bookOverlay(), r = document.getElementById('screen').getBoundingClientRect(), strip = r.height * (11 / G.H);
        Object.assign(o.box.style, { display: 'flex', left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: (r.height - strip) + 'px' });
        if (o.shown !== this.i) { o.img.src = bookSrc(this.i); o.shown = this.i; }
        // (the pages are grayscale: a touch of sepia gives them their paper color back; the cover's in color)
        o.img.style.filter = this.i ? 'sepia(0.28)' : 'none';
      },
      update() {
        const inp = G.input;
        this.t++;
        if (inp.hit('right') && this.i < BOOK_PAGES - 1) { this.i++; G.audio.sfx('menu'); }
        if (inp.hit('left') && this.i > 0) { this.i--; G.audio.sfx('menu'); }
        if (this.t > 14 && (inp.hit('a') || inp.hit('b'))) { inp.eat('a'); inp.eat('b'); G.audio.sfx('cancel'); G.hidePipeBook(); return true; }
        this.show();
        return false;
      },
      draw(ctx) {
        ctx.fillStyle = '#16100c'; ctx.fillRect(0, 0, G.W, G.H);
        const hint = (this.i > 0 ? '← ' : '') + (this.i ? 'Page ' + G.sayable(this.i) + '/' + G.sayable(BOOK_PAGES - 1) : 'The cover') + (this.i < BOOK_PAGES - 1 ? ' →' : '') + '   Z: close';
        FT().draw(ctx, hint, Math.round((G.W - FT().width(hint)) / 2), G.H - 9, '#c8b898', { shadow: '#000' });
      },
    };
  }
  S.readPipeBook = function* () {
    yield pipeBookView();
    const f = flags();
    if (!f.pipeBookRead) { f.pipeBookRead = true; yield G.say('Nate', 'Every pipe. Every tobacco. Every fact. He really did tell me everything.'); }
  }
  // Dad's pipe bench: what are we making? (from Dad's talk in the workshop, once he has his snacks)
  S.pipeBench = function* (kind) {
    const f = flags();
    if (!f.pipeBench) {
      f.pipeBench = true;
      yield G.say('Dad', 'Every pipe I make goes in my little book. Every tobacco I smoke, too.');
      yield G.say('Dad', 'Pick one. I\'ll show you how it\'s done. And I\'ll tell you EVERYTHING about it.');
      yield G.say('Nate', 'Everything?');
      yield G.say('Dad', 'Everything.');
    }
    const it = yield bookCmd(kind);
    if (it) {
      if (kind === 'pipe') yield* makePipe(it);
      else yield* makeTobacco(it);
    } else yield G.say('Dad', 'Another time, then.');
    G.play.overlay = null;
  };

  // ================================================================ JAMMING WITH ABE (instruments)
  // Once everything at the condo is done (G.condoDone: Romulus home, Anette's plants watered and her
  // garden gate open), Abe will jam with Nate at the little amp in his office, upstairs. A rhythm
  // game: notes slide down a fretboard on four strings (← ↓ ↑ →), and Nate hits them
  // on the beat while Abe plays bass (and dances) and the drums keep time. Three songs, each one
  // faster (finish one to unlock the next), and each one wins one of Abe's electric guitars, on loan:
  // his Stratocaster, his Telecaster Deluxe, then his Jazzmaster. Those are skins for Nate's electric
  // guitar: pick which one he plays with ←→ on Abe's setlist, or in COLLECTABLES > Instruments
  // (Z takes a closer look; Z again plays it). Instruments are collectables, for recording music
  // later. Nate's half-finished bass, from Dad's workbench, is one too.
  // Three DRUM songs too (the setlist's second page; their own unlock chain): Nate on drums, Abe on
  // guitar. Bongos (← the small drum, → the big one), a steel drum (four dents, low to high, a
  // melody like the guitar's), then a whole drum kit (← hi-hat, ↓ kick, ↑ snare, → crash and toms).
  // Each one wins that drum (a gift, not a loan: Hannah wants them out of the condo). Abe doesn't own
  // any drums in real life; these are made up. A drum's intro/won are Abe's lines the first time
  // it comes out and when Nate wins it; fill is what it plays when you look at it.
  // An instrument: blurb (a line or two for the card), about (paragraphs for the closer look),
  // how (the hint before it's found), chord (what it plays when you look; none = no strings),
  // song (the jam that wins it), talk (what Abe says about it while Nate plays it), drum (a drum's kind).
  // State: s.jams ({ song id: best stars }), s.instruments ({ id: true }; the bass is s.items.bass,
  // a guitar or drum is also had once its song is passed), s.guitar (the one Nate plays).
  // Flags: jamTease, jamMet, jamDrum_<song>.
  G.condoDone = () => { const f = flags(); return !!(f.romulusBeaten && f.plantsDone && f.gardenOpen); };
  G.INSTRUMENTS = [
    {
      id: 'bass', name: 'Half-Finished Bass', kind: 'Electric bass (some assembly required)', art: () => G.spr.natesBass,
      has: () => !!G.state.items.bass,
      blurb: 'Nate\'s own build. It looks like a bass. It does not sound like one. Yet.',
      about: [
        'Nate\'s own build, on Dad\'s workbench in the garage: a walnut body and a maple neck, with the frets already in.',
        'That\'s as far as it got: no strings, no finish, not one note. Someday it\'ll play. Until then, it\'s the quietest instrument in the family.',
      ],
      how: 'Nate left something half done on Dad\'s workbench, in the garage at home.',
    },
    {
      id: 'strat', name: 'Abe\'s Stratocaster', kind: 'Electric guitar', art: () => G.spr.stratocaster,
      chord: [40, 47, 52, 56, 59, 64], song: 'shoolby',
      blurb: 'Black, a white pickguard, a maple neck: the one everybody pictures when you say "electric guitar."',
      about: [
        'Abe\'s 1984 Stratocaster, an American Vintage Reissue: a new build of a late-\'50s Strat, made in Fullerton, California.',
        'Three single-coil pickups, and a little quack when you set the switch in between two of them.',
        'Abe\'s rule: everybody starts on a Strat.',
      ],
      how: 'Clear Shoolby Blues, jamming with Abe at the condo.',
      talk: [
        'That\'s my \'84 Strat. A Vintage Reissue, made in Fullerton, California.',
        'Everybody starts on a Strat. It\'s the law.',
        'Three single-coils. Hear that little quack in between? That\'s the good stuff.',
        'Maple neck. Feel how fast that is? Like a bowling lane.',
        'Lock in with the bass. Listen to me. I\'m the bass.',
      ],
    },
    {
      id: 'tele', name: 'Abe\'s Telecaster Deluxe', kind: 'Electric guitar', art: () => G.spr.teleDeluxe,
      chord: [40, 47, 52, 55, 59, 64], song: 'surf',
      blurb: 'A 1974 Fender with two fat humbuckers, a big headstock, and red paint worn through in spots.',
      about: [
        'Abe\'s 1974 Telecaster Deluxe: a Telecaster body with two Wide Range humbuckers, four knobs and the big \'70s headstock.',
        'Seth Lover designed those pickups: the same engineer who invented the humbucker at Gibson.',
        'The red paint is worn through in spots. Abe calls it character.',
      ],
      how: 'Clear Number One Ditch Surf, jamming with Abe at the condo.',
      talk: [
        'That\'s my \'74 Telecaster Deluxe. The paint\'s worn off in spots. That\'s called character.',
        'Those are Wide Range humbuckers. Seth Lover designed them. The guy who INVENTED the humbucker.',
        'Look at that headstock. Big. Very \'70s.',
        'Four knobs. Two volumes, two tones. I only ever touch one of them.',
        'Lock in with the bass. Listen to me. I\'m the bass.',
      ],
    },
    {
      id: 'jazzmaster', name: 'Abe\'s Jazzmaster', kind: 'Electric guitar', art: () => G.spr.jazzmaster,
      chord: [40, 47, 52, 56, 59, 64], song: 'zoomies',
      blurb: 'A vintage Fender with a story for every scratch. On loan from Abe. Very carefully.',
      about: [
        'Abe\'s pride and joy. The body and the wiring are from 1959, the neck is from 1962, and Dave Petillo brought all of it back to life.',
        'The story goes that before Abe, it was Al Alcorn\'s: the engineer who built Pong. A video game legend\'s guitar, in a video game.',
        'Abe would like you to stop touching it now.',
      ],
      how: 'Clear Romulus Zoomies, jamming with Abe at the condo.',
      talk: [
        'The body on this thing is from 1959. The neck showed up in 1962. They get along great.',
        'Dave Petillo brought it back to life. The man is a legend.',
        'Before me, it was Al Alcorn\'s. He built PONG, Nate. The paddle game. Pong!',
        'Fender made the Jazzmaster for jazz players. Then the surf bands got it.',
        'The waist is crooked on purpose. An offset body. It sits better on your leg.',
        'The tremolo floats. Don\'t yank it. Just think about it and it wobbles.',
        'Lock in with the bass. Listen to me. I\'m the bass.',
      ],
    },
    {
      id: 'bongos', name: 'Abe\'s Bongos', kind: 'Hand drums', art: () => G.spr.bongos, drum: 'bongos', song: 'bongos',
      blurb: 'Two little drums joined at the hip: the small one (the macho) up high, the big one (the hembra) down low.',
      about: [
        'Bongos come from Cuba: two small, open-bottomed drums joined by a block of wood, held between the knees and played with the fingers.',
        'The small drum is the macho and the big one is the hembra. The basic bongo pattern is called the martillo: "the hammer."',
        'Abe bought them for the condo. Hannah did not.',
      ],
      how: 'Clear Bongos on the Bay, jamming with Abe at the condo.',
      intro: [[null, 'Abe slides a pair of bongos out from behind the amp.'], ['Abe', 'I bought bongos. Hannah doesn\'t know yet.'], ['Abe', 'You drum, I\'ll play guitar for once. Get through it and they\'re yours. Please. Take them.']],
      won: [['Abe', 'Take the bongos. Seriously. Before Hannah gets home.']], gotLine: 'A gift, not a loan. Abe was VERY clear.',
      fill: [[1, () => G.audio.inst.bongo(true)], [9, () => G.audio.inst.bongo(true)], [17, () => G.audio.inst.bongo(false)], [21, () => G.audio.inst.bongo(true)], [25, () => G.audio.inst.bongo(false)]],
      talk: [
        'Fingers, not palms. Bongos are all fingers.',
        'Small one\'s the macho. Big one\'s the hembra. Don\'t ask me why.',
        'That pattern\'s called the martillo. The hammer.',
        'Hannah thinks the bongos are too loud. Hannah is right. Keep going.',
        'Lock in with me. I\'m on guitar for this one.',
      ],
    },
    {
      id: 'steelpan', name: 'Abe\'s Steel Drum', kind: 'Steel pan', art: () => G.spr.steelPan, drum: 'pan', song: 'island',
      blurb: 'A shiny bowl hammered out of an oil drum, with a note in every dent.',
      about: [
        'The steel pan comes from Trinidad and Tobago, where people in the 1930s and \'40s hammered oil drums into instruments.',
        'Every dent is its own note, tuned by hand. You play it with rubber-tipped sticks.',
        'Abe says it\'s for the beach. It has never been to the beach.',
      ],
      how: 'Clear Island Time, jamming with Abe at the condo.',
      intro: [[null, 'Abe wheels a shiny steel drum on a stand out of the closet.'], ['Abe', 'A steel drum. It\'s for the beach. It has never been to the beach.'], ['Abe', 'Every dent is a note. Low on the left, high on the right.']],
      won: [['Abe', 'Take the steel drum too. Take it to a beach. It deserves a beach.']], gotLine: 'Another gift. Abe insisted.',
      fill: [[1, () => G.audio.inst.pan(60)], [9, () => G.audio.inst.pan(64)], [17, () => G.audio.inst.pan(67)], [25, () => G.audio.inst.pan(72, 1.2)]],
      talk: [
        'Soft sticks. You don\'t hit it. You bounce off it.',
        'Every one of those dents is a note. Somebody tuned that with a HAMMER.',
        'It used to be an oil drum. Now it\'s a vacation.',
        'Close your eyes. We\'re on a beach. We\'re not in Chesapeake.',
        'Lock in with me. I\'m on guitar.',
      ],
    },
    {
      id: 'drumkit', name: 'Abe\'s Drum Kit', kind: 'Drum kit', art: () => G.spr.drumKit, drum: 'kit', song: 'breakdown',
      blurb: 'Kick, snare, two toms, a hi-hat and a crash, in blue sparkle. Very loud. Very blue.',
      about: [
        'A five-piece kit: a kick drum you play with your foot, a snare, two toms, a hi-hat and a crash cymbal.',
        'Around 1909, a bass drum pedal let one drummer play a pile of drums at once. People called the setup a "trap kit," short for "contraption."',
        'Abe bought it for the condo. Hannah would like it out of the condo.',
      ],
      how: 'Clear Bay Bridge Breakdown, jamming with Abe at the condo.',
      intro: [[null, 'Abe pulls a sheet off something big in the corner. It\'s a whole drum kit. In blue sparkle.'], ['Abe', 'Okay. I bought a drum kit. Hannah DEFINITELY doesn\'t know yet.'], ['Abe', 'Hi-hat, kick, snare, crash. All four arrows, and sometimes two at once. Go.']],
      won: [['Abe', '...You\'re a drummer now. Take the kit. All of it.'], ['Abe', 'Hannah heard you from the driveway. She says it\'s the kit or me.']], gotLine: 'Every piece of it. Abe helped carry.',
      fill: [[1, () => { G.audio.inst.kick(); G.audio.inst.crash(); }], [9, () => G.audio.inst.snare()], [13, () => G.audio.inst.tom(true)], [17, () => G.audio.inst.tom(false)], [21, () => G.audio.inst.snare()], [25, () => { G.audio.inst.kick(); G.audio.inst.crash(); }]],
      talk: [
        'Hi-hat keeps the time. Kick on one and three, snare on two and four.',
        'Blue sparkle. I didn\'t pick it. The store picked it. I agreed.',
        'Hit the crash like you mean it. The neighbors already know.',
        'Hannah\'s going to hear this from the driveway.',
        'Lock in with me. I\'m trying to keep up with YOU now.',
      ],
    },
  ];
  const instState = () => (G.state.instruments = G.state.instruments || {});
  G.instrumentHas = (id) => {
    const it = G.INSTRUMENTS.find((i) => i.id === id);
    if (!it) return false;
    if (it.has) return it.has();
    return !!instState()[id] || (!!it.song && !!jamState()[it.song]);
  };
  // the electric guitars, and the one Nate plays (his pick if he has it; else the newest he has;
  // before any, the Strat Abe lends him for the first song)
  G.GUITARS = G.INSTRUMENTS.filter((it) => it.song && !it.drum);
  G.guitarsHad = () => G.GUITARS.filter((it) => G.instrumentHas(it.id));
  G.guitarNow = () => {
    const had = G.guitarsHad(), pick = had.find((it) => it.id === G.state.guitar);
    return pick || had[had.length - 1] || G.GUITARS[0];
  };
  G.instrumentsCount = () => G.INSTRUMENTS.filter((it) => G.instrumentHas(it.id)).length;
  // a guitar at half size, for Nate to hold (or hold up over his head)
  const guitarSmallC = {};
  const guitarSmall = (it) => {
    if (guitarSmallC[it.id]) return guitarSmallC[it.id];
    const src = it.art(), c = G.canvas(Math.ceil(src.width / 2), Math.ceil(src.height / 2));
    c.getContext('2d').drawImage(src, 0, 0, c.width, c.height);
    return (guitarSmallC[it.id] = c);
  };
  // The songs (all original). A riff is notes (or chords, joined with +) and how many beats each
  // gets, "r" a rest, eight beats a riff; bass: the root of each of its two bars. form: the riffs
  // in order. perfect/good: the timing windows (frames), drain: how much a miss costs the groove,
  // lead: how many frames a note takes to slide down. style: the drums and bass (for a drum song:
  // what Abe plays). drums: Nate's drum; pads: what each letter in its riffs hits ([lane, sound])
  // (a steel drum's notes are pitches, like the guitar's).
  const I = () => G.audio.inst;
  const JAM_SONGS = [
    {
      id: 'shoolby', name: 'Shoolby Blues', bpm: 88, d: 1, style: 'rock', perfect: 4, good: 9, drain: 0.05, lead: 96,
      blurb: 'A slow one, to warm up. E minor. Just follow me.',
      riffs: {
        A: { notes: 'E3/1 G3/1 A3/1 G3/1 E3/1 r/1 E3/1 G3/1', bass: [40, 40] },
        B: { notes: 'A3/1 B3/1 D4/1 B3/1 A3/1 r/1 G3/1 E3/1', bass: [45, 40] },
        E: { notes: 'E3/1 G3/1 A3/1 B3/1 E4/2 r/2', bass: [40, 40] },
      },
      form: 'AABAABAE',
    },
    {
      id: 'surf', name: 'Number One Ditch Surf', bpm: 132, d: 2, style: 'surf', perfect: 3, good: 7, drain: 0.07, lead: 84,
      blurb: 'Surf rock: fast picking, all reverb. Hang ten.',
      riffs: {
        A: { notes: 'A3/.5 A3/.5 C4/.5 A3/.5 D4/.5 A3/.5 E4/.5 D4/.5 C4/.5 C4/.5 A3/.5 G3/.5 A3/1 r/1', bass: [45, 45] },
        B: { notes: 'E4/.5 E4/.5 G4/.5 E4/.5 A4/.5 G4/.5 E4/.5 D4/.5 C4/.5 D4/.5 E4/.5 C4/.5 A3/1 r/1', bass: [48, 43] },
        C: { notes: 'E3/.5 E3/.5 E3/.5 E3/.5 E3/.5 E3/.5 G3/.5 A3/.5 C4/1 A3/1 E4/2', bass: [40, 40] },
        E: { notes: 'A3/.5 C4/.5 E4/.5 G4/.5 A4/2 r/4', bass: [45, 45] },
      },
      form: 'AABCABABCE',
    },
    {
      id: 'zoomies', name: 'Romulus Zoomies', bpm: 156, d: 3, style: 'drive', perfect: 3, good: 6, drain: 0.09, lead: 76,
      blurb: 'Fast. Chords (two strings at once). Like Romulus at two in the morning.',
      riffs: {
        A: { notes: 'E3/.5 E3/.5 G3/.5 E3/.5 A3/.5 E3/.5 B3/.5 A3/.5 G3/.5 E3/.5 D4/.5 B3/.5 A3/.5 G3/.5 E3/.5 r/.5', bass: [40, 40] },
        B: { notes: 'B3/.25 D4/.25 E4/.25 D4/.25 B3/.5 A3/.5 G3/.25 A3/.25 B3/.25 A3/.25 G3/.5 E3/.5 E4/.5 D4/.5 B3/.5 A3/.5 G3/1 E3/1', bass: [43, 45] },
        C: { notes: 'E3+B3/1 E3+B3/1 G3+D4/1 A3+E4/1 E3+B3/.5 E3+B3/.5 G3+D4/.5 A3+E4/.5 B3+E4/1 r/1', bass: [40, 43] },
        E: { notes: 'E3/.25 G3/.25 A3/.25 B3/.25 D4/.25 E4/.25 G4/.5 B3+E4/2 r/4', bass: [40, 40] },
      },
      form: 'ABACABCABE',
    },
    {
      id: 'bongos', name: 'Bongos on the Bay', bpm: 96, d: 1, drums: 'bongos', style: 'bongo', perfect: 4, good: 9, drain: 0.05, lead: 96,
      blurb: 'Two drums, two hands. ← the little one, → the big one. I\'ll play guitar.',
      pads: { h: [0, () => I().bongo(true)], l: [3, () => I().bongo(false)] },
      riffs: {
        A: { notes: 'h/1 h/1 h/.5 h/.5 l/1 h/1 h/1 h/.5 h/.5 l/1', bass: [45, 43] },
        B: { notes: 'h/.5 h/.5 l/1 h/.5 h/.5 l/1 h/1 l/1 h/1 l/1', bass: [41, 43] },
        C: { notes: 'h/.5 h/.5 h/.5 l/.5 h/.5 h/.5 h/.5 l/.5 h/.5 h/.5 h/.5 l/.5 h/1 l/1', bass: [45, 40] },
        E: { notes: 'h/.5 l/.5 h/.5 l/.5 h/1 l/1 r/4', bass: [45, 45] },
      },
      form: 'AABABCCE',
    },
    {
      id: 'island', name: 'Island Time', bpm: 112, d: 2, drums: 'pan', style: 'calypso', perfect: 3, good: 7, drain: 0.07, lead: 84,
      blurb: 'Steel drum: every dent is a note, low on the left, high on the right. Calypso. Relax. (Hurry.)',
      riffs: {
        A: { notes: 'C4/.5 E4/.5 G4/1 E4/.5 G4/.5 A4/1 G4/.5 E4/.5 C4/1 D4/1 r/1', bass: [36, 43] },
        B: { notes: 'F4/.5 A4/.5 C5/1 A4/1 G4/.5 B4/.5 D5/1 B4/1 r/2', bass: [41, 43] },
        C: { notes: 'E4/.5 E4/.5 G4/.5 E4/.5 C5/1 A4/.5 G4/.5 E4/.5 D4/.5 C4/.5 D4/.5 E4/2', bass: [36, 45] },
        E: { notes: 'C4/.5 E4/.5 G4/.5 C5/.5 E5/2 r/4', bass: [36, 36] },
      },
      form: 'AABACABACE',
    },
    {
      id: 'breakdown', name: 'Bay Bridge Breakdown', bpm: 120, d: 3, drums: 'kit', style: 'chug', perfect: 3, good: 6, drain: 0.09, lead: 76,
      blurb: 'The whole kit: hi-hat, kick, snare, crash. Two at once is normal. I\'ll try to keep up.',
      pads: { H: [0, () => I().hat()], K: [1, () => I().kick()], S: [2, () => I().snare()], C: [3, () => I().crash()], T: [3, () => I().tom(true)], U: [3, () => I().tom(false)] },
      riffs: {
        A: { notes: 'K+H/.5 H/.5 S+H/.5 H/.5 K+H/.5 K+H/.5 S+H/.5 H/.5 K+H/.5 H/.5 S+H/.5 H/.5 K+H/.5 K+H/.5 S+H/.5 H/.5', bass: [40, 45] },
        B: { notes: 'K+C/1 S/1 K/1 S/1 K/1 S/1 K/.5 K/.5 S/1', bass: [43, 45] },
        C: { notes: 'K+H/.5 H/.5 S+H/.5 H/.5 K+H/.5 H/.5 S+H/.5 H/.5 S/.25 S/.25 S/.25 S/.25 T/.25 T/.25 U/.25 U/.25 K+C/1 r/1', bass: [40, 40] },
        E: { notes: 'K+C/1 r/1 S/.5 S/.5 T/.5 U/.5 K+C/2 r/2', bass: [40, 40] },
      },
      form: 'AABACABCAE',
    },
  ];
  G.JAM_SONGS = JAM_SONGS;
  const jamState = () => (G.state.jams = G.state.jams || {});
  const NOTE_MIDI = (n) => { const m = /^([A-G])(#?)(\d)$/.exec(n); return 12 * (+m[3] + 1) + { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]] + (m[2] ? 1 : 0); };
  // a song's notes ({ beat, midi, lane, dur }), its bass roots bar by bar, and how many beats long
  function buildSong(song) {
    const notes = [], bars = [];
    let beat = 0;
    for (const rid of song.form) {
      const riff = song.riffs[rid];
      for (const tok of riff.notes.split(/\s+/)) {
        const [n, len] = tok.split('/');
        if (n !== 'r') for (const one of n.split('+')) notes.push(song.pads ? { beat, lane: song.pads[one][0], hit: song.pads[one][1] } : { beat, midi: NOTE_MIDI(one) });
        beat += +len;
      }
      bars.push(...riff.bass);
    }
    // the lowest notes go on the left string, the highest on the right (a drum's pads say their own)
    const pitches = [...new Set(notes.map((x) => x.midi))].sort((a, b) => a - b);
    if (!song.pads) for (const x of notes) x.lane = Math.min(3, Math.floor((pitches.indexOf(x.midi) * 4) / pitches.length));
    const out = notes.filter((x, i) => !notes.slice(0, i).some((y) => y.beat === x.beat && y.lane === x.lane));
    for (const x of out) { const next = out.find((y) => y.beat > x.beat); x.dur = Math.min(0.7, ((next ? next.beat : x.beat + 1) - x.beat) * (60 / song.bpm) * 0.95); }
    return { notes: out, bars, beats: beat };
  }

  // ---- the setlist: pick a song (the next one unlocks when you finish the one before it). Two
  // pages, GUITAR then DRUMS (↑↓ runs off the end of one onto the other), each its own unlock chain.
  const jamTrack = (sg) => (sg.drums ? 'drums' : 'guitar');
  const jamPrize = (sg) => G.INSTRUMENTS.find((it) => it.song === sg.id);
  // an image scaled down to fit w x h (never up), drawn with its top-left at x, y
  const fitDraw = (ctx, img, x, y, w, h) => { const k = Math.min(1, w / img.width, h / img.height); ctx.drawImage(img, Math.round(x), Math.round(y), Math.round(img.width * k), Math.round(img.height * k)); return k; };
  function jamPickCmd() {
    const J = jamState();
    return {
      start() { this.sel = Math.max(0, JAM_SONGS.findIndex((sg, i) => !J[sg.id] && this.open(i))); this.t = 0; G.play.overlay = this; },
      open(i) { const sg = JAM_SONGS[i], prev = JAM_SONGS[i - 1]; return !prev || jamTrack(prev) !== jamTrack(sg) || !!J[prev.id]; },
      update() {
        const inp = G.input;
        this.t++;
        if (inp.hit('up') && this.sel > 0) { this.sel--; G.audio.sfx('menu'); }
        if (inp.hit('down') && this.sel < JAM_SONGS.length - 1) { this.sel++; G.audio.sfx('menu'); }
        // ←→ switches which of Abe's guitars Nate plays (on the guitar page)
        const had = G.guitarsHad();
        if ((inp.hit('left') || inp.hit('right')) && had.length > 1 && !JAM_SONGS[this.sel].drums) {
          const i = had.indexOf(G.guitarNow()), it = had[(i + (inp.hit('left') ? had.length - 1 : 1)) % had.length];
          // (a quick strum, so you hear its tone)
          G.state.guitar = it.id; G.audio.sfx('menu'); for (const m of it.chord.slice(1, 4)) G.audio.inst.guitar(m, 0.8, 0.06, it.id);
        }
        if (inp.hit('a')) { inp.eat('a'); if (this.open(this.sel)) { G.audio.sfx('select'); this.result = JAM_SONGS[this.sel]; return true; } G.audio.sfx('bump'); }
        if (inp.hit('b') || quitHit()) { inp.eat('b'); G.audio.sfx('cancel'); this.result = null; return true; }
        return false;
      },
      draw(ctx) {
        const cur = JAM_SONGS[this.sel], drums = !!cur.drums, page = JAM_SONGS.filter((sg) => jamTrack(sg) === jamTrack(cur));
        benchBack(ctx, 'ABE\'S SETLIST: ' + (drums ? 'DRUMS' : 'GUITAR'), G.sayable(JAM_SONGS.filter((sg) => J[sg.id]).length) + '/' + G.sayable(JAM_SONGS.length) + ' played');
        page.forEach((sg, k) => {
          const i = JAM_SONGS.indexOf(sg), y = 17 + k * 31, on = i === this.sel, open = this.open(i), best = J[sg.id] || 0;
          G.box(ctx, 8, y, 166, 29, on ? { bg: '#3a3058', border: '#f8d850', inner: '#7a6a30' } : undefined);
          FT().draw(ctx, G.sayable(k + 1) + '. ' + (open ? sg.name : '???'), 16, y + 4, open ? (on ? '#f8d850' : '#f8f8f0') : '#5a4e70', { shadow: '#0c0814' });
          FT().draw(ctx, open ? G.sayable(sg.bpm) + ' BPM   Hard: ' + '★'.repeat(sg.d) : 'Finish the one before it.', 16, y + 15, '#9890a8', { shadow: '#0c0814' });
          if (best) FT().draw(ctx, '{y}' + '★'.repeat(best) + '{d}' + '★'.repeat(3 - best), 166 - FT().width('★★★'), y + 4, '#f8d850', { shadow: '#0c0814' });
          else if (open) FT().draw(ctx, 'NEW', 166 - FT().width('NEW'), y + 4, '#78e070', { shadow: '#0c0814' });
          // what it wins, in the corner (a silhouette until it's won): a guitar lying down, or the drum
          const prize = jamPrize(sg);
          if (prize) {
            const won = G.instrumentHas(prize.id);
            if (prize.drum) { const img = prize.art(), k2 = Math.min(1, 14 / img.height); fitDraw(ctx, won ? img : G.silhouette(img), 168 - Math.round(img.width * k2), y + 13, 40, 14); }
            else { const img = guitarSmall(prize); ctx.save(); ctx.translate(167 - img.height, y + 27); ctx.rotate(-Math.PI / 2); ctx.drawImage(won ? img : G.silhouette(img), 0, 0); ctx.restore(); }
          }
        });
        // the other page, below
        FT().draw(ctx, drums ? '↑ GUITAR SONGS' : '↓ DRUM SONGS', 16, 111, '#9890a8', { shadow: '#000' });
        if (drums) {
          // the drum for the song you're on (a silhouette until it's won)
          const it = jamPrize(cur), img = it.art(), won = G.instrumentHas(it.id), k = Math.min(2, 56 / img.width, 66 / img.height);
          ctx.drawImage(won ? img : G.silhouette(img), Math.round(208 - (img.width * k) / 2), Math.round(88 - img.height * k), Math.round(img.width * k), Math.round(img.height * k));
          FT().wrap(won ? it.name.replace('Abe\'s ', '') : '???', 56).slice(0, 2).forEach((l, k2) => FT().draw(ctx, l, 208 - Math.round(FT().width(l) / 2), 99 + k2 * 9, '#f8f8f0', { shadow: '#000' }));
        } else {
          // the guitar Nate's playing, on its stand (←→ to switch)
          const gt = G.guitarNow(), gi = gt.art(), many = G.guitarsHad().length > 1;
          ctx.drawImage(gi, 208 - Math.round(gi.width / 2), 22);
          FT().wrap(gt.name.replace('Abe\'s ', ''), 56).slice(0, 2).forEach((l, k) => FT().draw(ctx, l, 208 - Math.round(FT().width(l) / 2), 99 + k * 9, '#f8f8f0', { shadow: '#000' }));
          if (many) { FT().draw(ctx, '←', 180, 54, '#f8d850', { shadow: '#000' }); FT().draw(ctx, '→', 231, 54, '#f8d850', { shadow: '#000' }); }
        }
        FT().wrap(this.open(this.sel) ? cur.blurb : 'Locked.', 220).slice(0, 2).forEach((l, k) => FT().draw(ctx, l, 10, 122 + k * 9, '#c8c0d8', { shadow: '#000' }));
        FT().draw(ctx, !drums && G.guitarsHad().length > 1 ? 'Z: play   ←→: guitar   X: done' : 'Z: play   X: done', 10, 145, '#9890a8', { shadow: '#000' });
      },
    };
  }

  // ---- THE JAM: notes slide down the strings; hit each one (← ↓ ↑ →) as it crosses the pickup.
  // Hits fill the GROOVE meter, misses drain it; empty and Abe stops the band. Finish the song to
  // pass it. Result: { passed, acc, stars, perfect, good, miss, maxCombo, score } (or 'quit').
  // A drum song: the notes land on drums instead of strings (gt is then the drum), Nate plays it
  // instead of a guitar, and Abe plays guitar instead of the band's drums.
  function jamCmd(song, gt, talk) {
    const S0 = buildSong(song), fpb = 3600 / song.bpm, COUNT = Math.round(4 * fpb), HIT_Y = 116, TOP = 14, drums = song.drums;
    const LANES = drums === 'bongos' ? [96, 0, 0, 144] : [87, 109, 131, 153], USED = [0, 1, 2, 3].filter((L) => S0.notes.some((n) => n.lane === L));
    const KEYS = ['left', 'down', 'up', 'right'], ARROWS = ['←', '↓', '↑', '→'];
    const GEM = { bongos: ['#f8d890', 0, 0, '#e09048'], pan: ['#b8d8f8', '#b8f0c8', '#f8e8a0', '#f8c0d8'], kit: ['#f8d850', '#c050a0', '#f0f0f0', '#78c8f8'] }[drums] || ['#c050a0', '#e08030', '#f0e6c0', '#78c8f8'];
    // what a hit sounds like (a drum still sounds when you hit it with no note there)
    const sound = (n) => (n.hit ? n.hit() : drums === 'pan' ? G.audio.inst.pan(n.midi, 0.7) : G.audio.inst.guitar(n.midi, n.dur, undefined, gt.id));
    const abeGuitar = G.guitarNow();
    const notes = S0.notes.map((n) => Object.assign({}, n, { t: COUNT + n.beat * fpb, done: null }));
    const END = notes[notes.length - 1].t + 2 * fpb, speed = (HIT_Y - TOP) / song.lead;
    return {
      start() {
        Object.assign(this, { f: 0, groove: 0.6, combo: 0, maxCombo: 0, score: 0, perfect: 0, good: 0, miss: 0, half: -1, bob: 0, sparks: [], judge: null, judgeT: 0, judgeL: 0, failT: 0, doneT: 0, msg: null, notes, song, fpb, COUNT, hitT: [0, 0, 0, 0] });
        talk.nowT = 0; G.audio.stop(); G.play.overlay = this;
      },
      mult() { return Math.min(4, 1 + Math.floor(this.combo / 8)); },
      // Abe dances: he nods along through the count-in (and while Nate's struggling); in the groove he
      // steps side to side, landing on every beat, and with a streak going he throws his hands up and
      // spins to end every bar. He stops cold when the band stops, and jumps for joy at the end.
      abeDance() {
        const A = G.sprites.abe, beatF = this.f / fpb, beat = Math.floor(beatF), ph = beatF - beat;
        if (this.failT) return { img: A.down[0], dx: 0, dy: 0 };
        if (this.doneT) return { img: A.hold, dx: 0, dy: -Math.round(Math.abs(Math.sin(this.doneT * 0.2)) * 6) };
        if (this.f < COUNT || this.groove < 0.35) return { img: A.down[0], dx: 0, dy: ph < 0.25 ? 2 : 0 };
        const hop = -Math.round(Math.sin(ph * Math.PI) * (this.combo >= 8 ? 5 : 3));
        if (this.combo >= 16 && beat % 4 === 3) return { img: A[['down', 'right', 'up', 'left'][Math.min(3, Math.floor(ph * 4))]][0], dx: 0, dy: hop * 2 };
        if (this.combo >= 24 && beat % 2) return { img: A.hold, dx: 0, dy: hop };
        const sway = Math.sin((beatF * Math.PI) / 2), dir = Math.cos((beatF * Math.PI) / 2) > 0 ? 'right' : 'left';
        return { img: A[dir][beat % 2 ? 1 : 2], dx: Math.round(sway * 4), dy: hop };
      },
      res(passed) {
        const acc = (this.perfect + this.good * 0.6) / notes.length;
        return { passed, acc, stars: acc >= 0.9 ? 3 : acc >= 0.75 ? 2 : 1, perfect: this.perfect, good: this.good, miss: this.miss, maxCombo: this.maxCombo, score: this.score };
      },
      // the band, every half beat: a count-in, then the drums and Abe's bass
      band(h) {
        if (h < 8) { if (h % 2 === 0) { G.audio.inst.hat(); this.bob = 6; } return; }
        const k = h - 8;
        if (k >= S0.beats * 2) return;
        const root = S0.bars[Math.min(Math.floor(k / 8), S0.bars.length - 1)], pos = k % 8, st = song.style;
        if (drums) {
          // a drum song: Abe on guitar (root, fifth and octave) with a bass line under him
          const chord = (dur, vol) => { for (const m of [root + 12, root + 19, root + 24]) G.audio.inst.guitar(m, dur, vol, abeGuitar.id); };
          if (st === 'bongo') { if (pos === 0 || pos === 3 || pos === 6) chord(0.5, 0.05); if (pos === 0 || pos === 4) G.audio.inst.bass(root, 0.3); }
          else if (st === 'calypso') { if (pos % 2) chord(0.16, 0.05); if (pos === 0 || pos === 3 || pos === 4) G.audio.inst.bass(root, 0.22); }
          else { chord(0.12, 0.04); if (pos % 2 === 0) G.audio.inst.bass(root, 0.16); }
          if (pos % 2 === 0) this.bob = 6;
          return;
        }
        if (pos === 0 || pos === 4 || (st === 'drive' && pos % 2 === 0)) G.audio.inst.kick();
        if (pos === 2 || pos === 6) G.audio.inst.snare();
        G.audio.inst.hat();
        if (st !== 'rock' || pos === 0 || pos === 3 || pos === 4) G.audio.inst.bass(st === 'surf' && pos % 2 ? root + 12 : root, st === 'rock' ? 0.3 : 0.16);
        if (pos % 2 === 0) this.bob = 6;
      },
      strum(L) {
        // the closest note still coming on that string, if it's close enough
        let best = null, bd = 1e9;
        for (const n of notes) if (!n.done && n.lane === L) { const d = Math.abs(n.t - this.f); if (d < bd) { bd = d; best = n; } }
        if (best && bd <= song.good) {
          const perfect = bd <= song.perfect;
          best.done = perfect ? 'perfect' : 'good';
          this[best.done]++; this.combo++; this.maxCombo = Math.max(this.maxCombo, this.combo);
          this.score += (perfect ? 100 : 60) * this.mult();
          this.groove = Math.min(1, this.groove + (perfect ? 0.03 : 0.015));
          sound(best); if (drums) this.hitT[L] = 8;
          for (let k = 0; k < 5; k++) this.sparks.push({ x: LANES[L], y: HIT_Y, vx: (Math.random() - 0.5) * 2.4, vy: -1 - Math.random() * 1.6, life: 16, c: GEM[L] });
          this.judge = perfect ? 'PERFECT' : 'GOOD'; this.judgeT = 22; this.judgeL = L;
          if (this.combo % 16 === 0) talk.say(['Nice!', 'Now you\'re playing!', 'YES. Yes. Keep it there.', 'You\'re a natural. Don\'t let it go to your head.'][(this.combo / 16 - 1) % 4]);
        } else if (!best || bd > song.good * 2) {
          // a strum with nothing there: a dead clunk (a drum just sounds, off the beat)
          this.combo = 0; this.groove = Math.max(0, this.groove - 0.02);
          if (drums) { const n = S0.notes.find((x) => x.lane === L); if (n) sound(n); this.hitT[L] = 8; }
          else G.audio.inst.guitar(40 + L * 5, 0.05, 0.06, gt.id);
          this.checkFail();
        }
      },
      missed() {
        this.miss++; this.combo = 0; this.groove -= song.drain;
        this.judge = 'MISS'; this.judgeT = 22;
        this.checkFail();
        if (!this.failT && this.miss % 6 === 1) talk.say(['Stay with me!', 'Count it! One, two, three, four...', 'Listen to the bass. Lock in with me.'][Math.floor(this.miss / 6) % 3]);
      },
      checkFail() {
        if (this.groove > 0 || this.failT) return;
        this.groove = 0; this.failT = 90; G.audio.sfx('no');
        talk.say('...Okay, stop, stop. You lost me.');
      },
      update() {
        const inp = G.input;
        talk.update();
        if (this.judgeT > 0) this.judgeT--;
        if (this.bob > 0) this.bob--;
        for (const p of this.sparks) { p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.life--; }
        this.sparks = this.sparks.filter((p) => p.life > 0);
        if (this.failT > 0) { if (--this.failT === 0) { this.result = this.res(false); return true; } return false; }
        if (this.doneT > 0) { if (--this.doneT === 0) { this.result = this.res(true); return true; } return false; }
        if (quitHit()) { this.result = 'quit'; return true; }
        this.f++;
        const h = Math.floor(this.f / (fpb / 2));
        if (h !== this.half) { this.half = h; this.band(h); }
        for (const L of USED) if (inp.hit(KEYS[L])) this.strum(L);
        for (let L = 0; L < 4; L++) if (this.hitT[L] > 0) this.hitT[L]--;
        for (const n of notes) if (!n.done && this.f - n.t > song.good) { n.done = 'miss'; this.missed(); }
        if (!this.failT && this.f >= END) { this.doneT = 80; G.audio.sfx('fanfare'); this.msg = 'SONG CLEARED!'; talk.say(this.miss === 0 ? 'Not ONE miss?! Who taught you? ...Me. I taught you.' : 'That\'s the song! Nice.'); }
        return false;
      },
      draw(ctx) {
        benchBack(ctx, 'JAMMING WITH ABE', song.name);
        ctx.fillStyle = '#0c0814'; ctx.fillRect(0, 12, G.W, 2); ctx.fillStyle = '#c050a0'; ctx.fillRect(0, 12, Math.round(G.W * Math.min(1, this.f / END)), 2);
        if (drums) this.drawDrums(ctx, speed);
        else this.drawFrets(ctx, speed);
        // the notes coming down
        for (const n of notes) {
          if (n.done && n.done !== 'miss') continue;
          const y = Math.round(HIT_Y - (n.t - this.f) * speed), x = LANES[n.lane];
          if (y < TOP - 4 || y > 132) continue;
          const col = n.done === 'miss' ? '#5a5a64' : GEM[n.lane];
          for (let dy = -3; dy <= 3; dy++) { const w = Math.round(6 * Math.sqrt(1 - (dy / 3.6) ** 2)); ctx.fillStyle = Math.abs(dy) === 3 ? '#1c1424' : col; ctx.fillRect(x - w, y + dy, w * 2 + 1, 1); }
          ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillRect(x - 3, y - 2, 3, 1);
        }
        this.drawRest(ctx);
      },
      // the fretboard: rosewood with maple edges, the frets and dots sliding down toward you
      drawFrets(ctx, speed) {
        ctx.fillStyle = '#d8a058'; ctx.fillRect(74, 14, 92, 118);
        ctx.fillStyle = '#3a2214'; ctx.fillRect(76, 14, 88, 118);
        const off = (this.f * speed) % 32;
        for (let k = -1; k < 5; k++) {
          const y = Math.round(TOP + off + k * 32);
          if (y < 14 || y > 131) continue;
          ctx.fillStyle = '#c8ccd4'; ctx.fillRect(76, y, 88, 1);
          if (y + 16 < 131 && k % 2 === 0) { ctx.fillStyle = '#f0e8d8'; ctx.fillRect(119, y + 15, 2, 2); }
        }
        LANES.forEach((x, L) => { ctx.fillStyle = '#b8bcc4'; ctx.fillRect(x, 14, L < 2 ? 2 : 1, 118); });
        // the pickup across the strings, where the notes are hit
        ctx.fillStyle = '#efe6c8'; ctx.fillRect(78, HIT_Y - 3, 84, 7); ctx.fillStyle = '#c8bea0'; ctx.fillRect(78, HIT_Y + 3, 84, 1);
        LANES.forEach((x, L) => {
          const down = G.input.down(KEYS[L]);
          ctx.fillStyle = down ? GEM[L] : '#5a4a3a';
          for (let dy = -5; dy <= 5; dy++) { const w = Math.round(Math.sqrt(30 - dy * dy)); if (Math.abs(dy) > 3 && !down) { ctx.fillRect(x - w, HIT_Y + dy, 1, 1); ctx.fillRect(x + w, HIT_Y + dy, 1, 1); } else ctx.fillRect(x - w, HIT_Y + dy, w * 2 + 1, 1); }
          FT().draw(ctx, ARROWS[L], x - 2, HIT_Y + 8, down ? '#f8f8f0' : '#9890a8', { shadow: '#000' });
        });
      },
      // a drum song: a dark stage with a lane down to each drum, the beat lines sliding toward you,
      // and the drums themselves where the notes land (they light up and jump when you hit them)
      drawDrums(ctx, speed) {
        ctx.fillStyle = '#4a3a2a'; ctx.fillRect(74, 14, 92, 118);
        ctx.fillStyle = '#231a2e'; ctx.fillRect(76, 14, 88, 118);
        for (const L of USED) { ctx.fillStyle = '#2c2240'; ctx.fillRect(LANES[L] - 8, 14, 17, 118); }
        const off = (this.f * speed) % 32;
        for (let k = -1; k < 5; k++) { const y = Math.round(TOP + off + k * 32); if (y >= 14 && y <= 131) { ctx.fillStyle = '#3e3258'; ctx.fillRect(76, y, 88, 1); } }
        const E = (cx, cy, rx, ry, c) => { ctx.fillStyle = c; for (let y = -ry; y <= ry; y++) { const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y / (ry + 0.5)) ** 2))); ctx.fillRect(Math.round(cx - w), Math.round(cy + y), w * 2 + 1, 1); } };
        const lit = (L) => this.hitT[L] > 0 || G.input.down(KEYS[L]);
        if (drums === 'pan') {
          // one big chrome bowl, a dent for each lane
          E(120, HIT_Y + 3, 47, 11, '#5a606a'); E(120, HIT_Y + 1, 46, 10, '#8a909a'); E(120, HIT_Y, 44, 8, '#d8dce4');
          for (const L of USED) { E(LANES[L], HIT_Y, 8, 4, lit(L) ? '#f8f8ff' : '#aab0bc'); E(LANES[L] - 2, HIT_Y - 1, 3, 1, lit(L) ? GEM[L] : '#c8ccd4'); }
        }
        for (const L of USED) {
          const x = LANES[L], on = lit(L), j = this.hitT[L] > 4 ? 1 : 0, y = HIT_Y + j;
          if (drums === 'bongos') {
            // the macho (small) and the hembra (big): a wooden shell, a chrome hoop, a skin head
            const rx = L === 0 ? 10 : 13, ry = L === 0 ? 5 : 6;
            ctx.fillStyle = '#8a5424'; ctx.fillRect(x - rx, y, rx * 2 + 1, 10); ctx.fillStyle = '#c8823a'; ctx.fillRect(x - rx + 1, y, rx * 2 - 1, 9);
            E(x, y, rx, ry, '#b8bcc4'); E(x, y, rx - 1, ry - 1, on ? '#fff8e0' : '#f0e2bc');
          } else if (drums === 'kit') {
            if (L === 0) { E(x, y + 2, 10, 2, '#a07820'); E(x, y - (on ? 0 : 2), 10, 2, on ? '#fff0a0' : '#e8c048'); ctx.fillStyle = '#9aa0aa'; ctx.fillRect(x, y + 4, 1, 8); }
            else if (L === 1) { E(x, y + 1, 10, 8, '#1a3478'); E(x, y + 1, 8, 6, on ? '#ffffff' : '#f0ece0'); ctx.fillStyle = '#2a58b8'; ctx.fillRect(x - 8, y, 17, 2); }
            else if (L === 2) { ctx.fillStyle = '#2a58b8'; ctx.fillRect(x - 9, y, 19, 6); ctx.fillStyle = '#9aa0aa'; ctx.fillRect(x - 9, y + 5, 19, 1); E(x, y, 9, 3, '#9aa0aa'); E(x, y, 8, 2, on ? '#ffffff' : '#f0ece0'); }
            else { const w = on ? Math.round(Math.sin(this.f) * 1) : 0; E(x, y + 1, 11, 2, '#a07820'); E(x + w, y, 11, 2, on ? '#fff0a0' : '#e8c048'); ctx.fillStyle = '#9aa0aa'; ctx.fillRect(x, y + 3, 1, 9); }
          }
          FT().draw(ctx, ARROWS[L], x - 2, HIT_Y + 11, on ? '#f8f8f0' : '#9890a8', { shadow: '#000' });
        }
      },
      // the sparks, the judgment, Nate and Abe, the meters, the count-in
      drawRest(ctx) {
        for (const p of this.sparks) { ctx.fillStyle = p.c; ctx.fillRect(Math.round(p.x), Math.round(p.y), 2, 2); }
        if (this.judgeT > 0) {
          const t = this.judge, w = FT().width(t), x = this.judge === 'MISS' ? 120 : LANES[this.judgeL];
          FT().draw(ctx, t, Math.round(x - w / 2), HIT_Y - 22 - (22 - this.judgeT) / 3, t === 'PERFECT' ? '#f8d850' : t === 'GOOD' ? '#78e070' : '#f86858', { shadow: '#000' });
        }
        // Nate (with his guitar, or at his drum) on the left, the groove meter and the combo
        const nate = (G.nateSprites ? G.nateSprites() : G.sprites.nate).down[0], b = this.bob > 3 ? 1 : 0;
        ctx.drawImage(nate, 24, 46 + b, nate.width * 2, nate.height * 2);
        if (drums) { const img = gt.art(), hit = this.hitT.some((h) => h > 4) ? 1 : 0; ctx.drawImage(img, Math.round(40 - img.width / 2), { bongos: 80, pan: 74, kit: 66 }[drums] + hit); }
        else { ctx.save(); ctx.translate(40, 82 + b); ctx.rotate(-1.1); ctx.drawImage(guitarSmall(gt), -6, -18); ctx.restore(); }
        FT().draw(ctx, 'GROOVE', 4, 18, '#c8c0d8', { shadow: '#000' });
        ctx.fillStyle = '#0c0814'; ctx.fillRect(6, 28, 8, 90);
        const gh = Math.round(88 * this.groove);
        ctx.fillStyle = this.groove > 0.5 ? '#78e070' : this.groove > 0.25 ? '#f8d850' : '#f86858'; ctx.fillRect(7, 117 - gh, 6, gh);
        if (this.combo >= 4) FT().draw(ctx, G.sayable(this.combo) + ' in a row', 20, 120, '#f8d850', { shadow: '#000' });
        // Abe on the right, dancing, and the score
        const A = this.abeDance();
        ctx.drawImage(A.img, 184 + A.dx, 40 + A.dy, A.img.width * 2, A.img.height * 2);
        // (on guitar, for the drum songs)
        if (drums) { ctx.save(); ctx.translate(200 + A.dx, 76 + A.dy); ctx.rotate(-1.1); ctx.drawImage(guitarSmall(abeGuitar), -6, -18); ctx.restore(); }
        FT().draw(ctx, 'SCORE', 176, 18, '#c8c0d8', { shadow: '#000' });
        FT().draw(ctx, G.sayable(this.score), 176, 27, '#f8f8f0', { shadow: '#000' });
        if (this.mult() > 1) FT().draw(ctx, 'x' + G.sayable(this.mult()), 216, 27, '#f8d850', { shadow: '#000' });
        // the count-in
        if (this.f < COUNT && this.f > 0) {
          const n = G.sayable(Math.floor(this.f / fpb) + 1), w = FT().bigWidth(n, 3);
          FT().drawBig(ctx, n, 120 - Math.round(w / 2), 50, 3, '#f8d850', '#1c1424');
        }
        if (this.msg && this.doneT) { const w = FT().width(this.msg); FT().draw(ctx, this.msg, 120 - Math.round(w / 2), 50, '#f8d850', { shadow: '#000' }); }
        talk.draw(ctx);
      },
    };
  }

  // The little amp in Abe's office: once everything at the condo is done, Abe jams with Nate here.
  S.abeAmp = function* () {
    const f = flags(), s = G.state, J = jamState();
    if (!G.condoDone()) {
      yield G.say(null, 'A little vintage guitar amp.');
      if (s.party.includes('abe') && !f.jamTease) {
        f.jamTease = true;
        yield* S.callIn('abe');
        yield G.say('Abe', 'Once things calm down around here, come find me up here. Bring your ears.');
      }
      return;
    }
    yield* S.callIn('abe', 'Did somebody say amp?');
    if (!f.jamMet) {
      f.jamMet = true;
      yield G.say('Abe', 'Romulus is home. Anette has her garden. It\'s finally quiet. Let\'s play.');
      yield G.say(null, 'Abe opens a tweed case lined with red fur like it\'s a museum exhibit. Inside: a black guitar with a white pickguard.');
      yield G.say('Abe', 'My \'84 Strat. Everybody starts on a Strat. Hold it like a baby bird. Carefully. CAREFULLY.');
      yield G.say('Abe', 'I\'ll play bass. You follow me. Three songs, three of my guitars. Get through a song and its guitar is yours. On loan.');
      yield G.say('Abe', 'And there\'s a second page on the setlist. Drums. Don\'t tell Hannah.');
    }
    for (;;) {
      const song = yield jamPickCmd();
      if (!song) { G.play.overlay = null; yield G.say('Abe', 'Good session.'); return; }
      // a drum song: Abe brings the drum out the first time
      const drum = song.drums && jamPrize(song);
      if (drum && !f['jamDrum_' + song.id]) { f['jamDrum_' + song.id] = true; G.play.overlay = null; for (const [who, line] of drum.intro) yield G.say(who, line); }
      yield howToCmd('JAMMING WITH ABE', drum ? HOW_TO['jam_' + song.drums] : HOW_TO.jam);
      const gt = drum || G.guitarNow(), r = yield jamCmd(song, gt, dadTalk(gt.talk, 'abe', []));
      G.play.overlay = null;
      G.audio.play(G.play.world.def.music);
      if (r === 'quit') { yield G.say('Abe', 'We\'ll pick it up later.'); return; }
      if (!r.passed) { yield G.say('Abe', 'You lost me there. Let\'s take it from the top.'); continue; }
      const first = !J[song.id], idx = JAM_SONGS.indexOf(song);
      J[song.id] = Math.max(J[song.id] || 0, r.stars);
      yield revealCmd(drum ? gt.art() : guitarSmall(gt), song.name, r.stars);
      yield G.say('Abe', r.stars === 3 ? 'That was clean. Really clean.' : r.stars === 2 ? 'Good! A few clams. Everybody hits a few clams.' : 'We got through it! That counts.');
      // the first time through a song, its guitar is Nate's (on loan), and he plays it next; or
      // its drum is Nate's (for keeps)
      const prize = jamPrize(song);
      if (first && prize && prize.drum) {
        for (const [who, line] of prize.won) yield G.say(who, line);
        yield G.itemGet(prize.art(), 'You got {y}' + prize.name + '{/}! ' + prize.gotLine + ' It\'s in {y}COLLECTABLES{/}.');
        G.play.autosave();
      } else if (first && prize) {
        if (prize.id === 'strat') {
          yield G.say('Abe', 'Keep the Strat. Not KEEP keep. Borrow.');
        } else if (prize.id === 'tele') {
          yield G.say(null, 'Abe pulls a red Telecaster Deluxe out of a beat-up black case.');
          yield G.say('Abe', 'My \'74 Tele Deluxe. It\'s yours now. On loan. Don\'t lean it on anything.');
        } else {
          yield G.say('Abe', '...Okay. All three. That was actually good.');
          yield G.say(null, 'Abe opens one more case. Inside: a sparkly plum guitar with a tortoiseshell pickguard.');
          yield G.say('Abe', 'My Jazzmaster. I want you to have it. Not HAVE have. Borrow. A long-term borrow.');
        }
        G.state.guitar = prize.id;
        yield G.itemGet(guitarSmall(prize), 'You got {y}' + prize.name + '{/}! (A loan. He was very clear.) It\'s in {y}COLLECTABLES{/}.'
          + (G.guitarsHad().length > 1 ? ' Switch guitars with {y}←→{/} on the setlist.' : ''));
        if (prize.id === 'jazzmaster') yield G.say('Abe', 'It belonged to Al Alcorn before me. He invented Pong. Treat it like it invented Pong.');
        G.play.autosave();
      }
      const nextSong = JAM_SONGS[idx + 1];
      if (first && nextSong && jamTrack(nextSong) === jamTrack(song)) {
        const next = jamPrize(nextSong);
        yield G.say('Abe', 'Next one: ' + nextSong.name + '. It\'s faster.' + (next ? ' Get through it and my ' + (next.drum ? next.name.replace('Abe\'s ', '').toLowerCase() : next.name.replace('Abe\'s ', '')) + (next.drum === 'bongos' ? ' are yours.' : ' is yours.') : ''));
      }
    }
  };

  // ================================================================ DORON'S FIGHT NIGHT (the locker room)
  // Once El EEENGLISH is beaten, the locker room at the back of the Expo Hall opens up, and Doron
  // (obsessed with the UFC and fighting) takes on five of his favorite UFC fighters in a side-view
  // fighting game, Street Fighter style, with Smash-style aerials. The select screen picks who to
  // fight (only Rampage at first; beating one unlocks the next). Beat Jon Jones for the Micro Mayhem
  // title belt... and then the secret final boss shows up: Nani (her slot doesn't exist until Jones
  // is beaten). VS, then best of three rounds against the clock.
  // ← → walk (tap twice to dash), ↓ crouch (ducks high punches and E's), ↑ jump. Z punch, X kick;
  // ↓+Z low jab, ↓+X sweep. In the air, Z or X with a direction is an aerial: none = a spin kick all
  // around, toward = flying knee, away = back kick, ↑ = up swipe, ↓ = a stomp that SPIKES. V blocks
  // (hold; with ↓ for lows; tap it right as a hit lands to PARRY). C grabs (the ARMY SUPLEX, beats a
  // block). ↓ then → then Z: the TAKEDOWN. Z Z X / Z Z Z / ↓Z X are combos. Hits fill the FIGHT
  // meter; full, C is GROUND AND POUND. Hitting him while he winds up is a COUNTER.
  // Attack heights: high (ducked by crouching), mid, low (block crouching), air (block standing).
  // The fighters fight like themselves (real styles; the trash talk is made up for the game).
  // State: s.fights ({ id: true }). Flags: fightMet, fightHow.
  const FIGHTERS = [
    {
      id: 'rampage', name: 'RAMPAGE', full: 'QUINTON "RAMPAGE" JACKSON',
      style: 'Heavy hands, a wrestling base, and his trademark: the POWERBOMB.',
      hp: 120, speed: 0.95, dmg: 1.25, aggro: 0.5, block: 0.35, grab: 0.25, jump: 0.02, combo: 0.2,
      special: 'powerbomb', also: 'hook', every: 200, walkout: 'chain',
      intro: 'AWOOOOOO! ...You ever been powerbombed? It\'s a whole experience.', rage: 'AWOOOOOOOOO!',
      win: 'I beat RAMPAGE! Nobody powerbombs the Army!',
    },
    {
      id: 'conor', name: 'McGREGOR', full: 'CONOR McGREGOR',
      style: 'A wide southpaw stance. Watch the counter left hand. And the spinning back kick.',
      hp: 100, speed: 1.2, dmg: 1.1, aggro: 0.45, block: 0.3, grab: 0.02, jump: 0.05, combo: 0.35, counter: 0.4,
      special: 'leftStraight', also: 'spinKick', every: 160, keepAway: true,
      intro: 'Watch the left hand. Everybody says that. Nobody watches it.', rage: 'Now I\'m interested.',
      win: 'I watched the left hand! I WATCHED IT!',
    },
    {
      id: 'khabib', name: 'KHABIB', full: 'KHABIB NURMAGOMEDOV',
      style: 'Retired undefeated, 29-0. Sambo, judo and wrestling: takedowns, then ground and pound.',
      hp: 115, speed: 1, dmg: 1, aggro: 0.55, block: 0.4, grab: 0.5, jump: 0.02, combo: 0.15,
      special: 'doubleLeg', also: 'grab', every: 150, walkout: 'papakha',
      intro: 'You will be on your back very soon, my friend.', rage: 'Enough playing.',
      win: 'Khabib retired 29 and 0. Does this count? ...It counts.',
    },
    {
      id: 'mouse', name: 'MIGHTY MOUSE', full: 'DEMETRIOUS "MIGHTY MOUSE" JOHNSON',
      style: 'Lightning fast, always switching stances. Watch for the suplex... into an armbar.',
      hp: 100, speed: 1.75, dmg: 0.95, aggro: 0.8, block: 0.45, grab: 0.15, jump: 0.15, combo: 0.6,
      special: 'suplexArmbar', also: 'flyingKnee', every: 170,
      intro: 'I drilled this move a thousand times. You haven\'t.', rage: 'Switching it up.',
      win: 'Mighty Mouse! Eleven title defenses in a row... and then ME.',
    },
    {
      id: 'jones', name: 'JON JONES', full: 'JON "BONES" JONES',
      style: 'An 84.5-inch reach. Low oblique kicks (crouch and block!) and spinning elbows.',
      hp: 140, speed: 1.1, dmg: 1.2, aggro: 0.6, block: 0.5, grab: 0.2, jump: 0.05, combo: 0.4, reach: 8,
      special: 'oblique', also: 'spinElbow', every: 110, keepAway: true,
      intro: 'Long arms. Long night.', rage: 'Okay. Now I\'m awake.',
      win: 'I beat BONES! Nate, where\'s my BELT?!',
    },
    {
      id: 'nani', name: 'NANI', full: 'NANI', secret: true,
      style: 'The reigning BMF. Loves you very much. Hits VERY hard.',
      hp: 190, speed: 1.45, dmg: 1.5, aggro: 0.95, block: 0.5, grab: 0.1, jump: 0.08, combo: 0.7,
      special: 'flurry', also: 'haymaker', every: 90,
      intro: 'Doron, sweetheart. Did you eat? ...You\'re going to need your strength.', rage: 'NANI IS VERY DISAPPOINTED.',
      win: 'I beat Nani. I feel terrible. I feel AMAZING. I feel terrible.',
    },
  ];
  G.FIGHTERS = FIGHTERS;
  const fightState = () => (G.state.fights = G.state.fights || {});
  const fightOpen = (i) => i === 0 || !!fightState()[FIGHTERS[i - 1].id];
  // the ones on the select screen (Nani only once Jon Jones is beaten)
  const fightersShown = () => FIGHTERS.filter((F) => !F.secret || fightState().jones);
  // start / active / recovery frames, how far it reaches past the body (or box: [x0, x1, y0, y1]
  // around him, x toward the way he faces, y up from his feet), damage, hitstun, its height (h:
  // high / mid / low / air), and the pose for each part (wind-up, hit, recovery). down: knocks him
  // down. grab: a throw (beats a block, misses in the air; bomb: a powerbomb in front, armbar: an
  // armbar after). smash: ground and pound when it connects. leap: [run, jump] off the ground (aim:
  // toward Doron), active until he lands. dash: slides forward. chain: thrown that many times in a
  // row. shoot: throws E's. next: what Z (a) or X (b) cancel into once it's hit (combos). spin:
  // his back turns during the wind-up. spike: knocks someone in the air straight down. crouch: done
  // crouching. air: an aerial.
  const MOVES = {
    punch: { start: 4, active: 3, rec: 9, reach: 26, dmg: 5, stun: 16, h: 'high', poses: ['punch1', 'punch2', 'punch1'], next: { a: 'punch2', b: 'roundhouse' } },
    punch2: { start: 3, active: 3, rec: 10, reach: 26, dmg: 6, stun: 16, h: 'high', poses: ['punch1', 'punch3', 'punch1'], next: { a: 'uppercut', b: 'roundhouse' } },
    uppercut: { start: 5, active: 4, rec: 16, reach: 22, dmg: 9, down: true, h: 'mid', poses: ['punch1', 'upper', 'upper'] },
    roundhouse: { start: 6, active: 4, rec: 16, reach: 32, dmg: 10, down: true, h: 'mid', poses: ['kick1', 'kick2', 'kick1'] },
    kick: { start: 7, active: 4, rec: 13, reach: 30, dmg: 8, stun: 18, h: 'mid', poses: ['kick1', 'kick2', 'kick1'] },
    lowJab: { start: 3, active: 3, rec: 8, reach: 24, dmg: 4, stun: 12, h: 'low', crouch: true, poses: ['crouch', 'crouchJab', 'crouch'], next: { b: 'sweep' } },
    sweep: { start: 7, active: 4, rec: 18, reach: 32, dmg: 7, down: true, h: 'low', crouch: true, poses: ['crouch', 'sweep', 'crouch'] },
    nair: { start: 3, active: 10, rec: 4, dmg: 7, stun: 16, h: 'air', air: true, box: [-20, 20, -4, 34], poses: ['jump', 'nair', 'jump'] },
    fair: { start: 3, active: 999, rec: 4, dmg: 8, stun: 18, h: 'air', air: true, box: [4, 28, -8, 30], poses: ['knee', 'knee', 'jump'] },
    bair: { start: 5, active: 6, rec: 6, dmg: 10, down: true, h: 'air', air: true, box: [-32, -4, 0, 30], poses: ['jump', 'bair', 'jump'] },
    uair: { start: 4, active: 6, rec: 6, dmg: 8, stun: 18, h: 'air', air: true, box: [-14, 22, 24, 60], poses: ['jump', 'uair', 'jump'] },
    dair: { start: 6, active: 999, rec: 8, dmg: 9, stun: 18, h: 'air', air: true, spike: true, box: [-6, 26, -40, 8], poses: ['jump', 'stomp', 'crouch'] },
    grab: { start: 3, active: 3, rec: 20, reach: 22, dmg: 14, grab: true, poses: ['grab', 'grab', 'grab'] },
    takedown: { start: 8, active: 20, rec: 18, reach: 14, dmg: 12, down: true, dash: 3.2, h: 'mid', poses: ['block', 'shoot', 'block'] },
    rush: { start: 12, active: 30, rec: 30, reach: 18, dash: 4.5, smash: true, poses: ['block', 'shoot', 'block'] },
    // the fighters' own: Rampage's hooks and powerbomb, McGregor's counter left and spinning back
    // kick, Khabib's double leg into ground and pound, Mighty Mouse's flying knee and his suplex into
    // an armbar, Jones's oblique kick to the knee and spinning elbow, and Nani's... everything
    hook: { start: 7, active: 3, rec: 12, reach: 24, dmg: 9, stun: 20, h: 'high', poses: ['punch1', 'punch3', 'punch1'] },
    powerbomb: { start: 4, active: 3, rec: 24, reach: 22, dmg: 18, grab: true, bomb: true, poses: ['grab', 'grab', 'grab'] },
    leftStraight: { start: 6, active: 4, rec: 14, reach: 34, dmg: 12, stun: 22, dash: 2.2, h: 'high', poses: ['punch1', 'punch2', 'punch1'] },
    spinKick: { start: 10, active: 4, rec: 16, reach: 32, dmg: 13, down: true, h: 'mid', spin: true, poses: ['kick1', 'kick2', 'kick1'] },
    doubleLeg: { start: 8, active: 18, rec: 22, reach: 16, dash: 3.2, smash: true, poses: ['block', 'shoot', 'block'] },
    suplexArmbar: { start: 3, active: 3, rec: 20, reach: 22, dmg: 12, grab: true, armbar: true, poses: ['grab', 'grab', 'grab'] },
    flyingKnee: { start: 6, active: 999, rec: 16, reach: 26, dmg: 11, down: true, h: 'mid', poses: ['knee', 'knee', 'idle1'], leap: [3.2, 4.2] },
    oblique: { start: 5, active: 3, rec: 12, reach: 36, dmg: 7, stun: 20, h: 'low', poses: ['kick1', 'oblique', 'kick1'] },
    spinElbow: { start: 9, active: 3, rec: 16, reach: 22, dmg: 13, down: true, h: 'high', spin: true, poses: ['punch1', 'punch2', 'punch1'] },
    flurry: { start: 2, active: 2, rec: 3, reach: 26, dmg: 5, stun: 10, h: 'high', chain: 5, poses: ['punch1', 'punch2', 'punch1'] },
    haymaker: { start: 9, active: 3, rec: 14, reach: 30, dmg: 18, down: true, h: 'mid', poses: ['punch1', 'punch3', 'punch1'] },
    letterHit: { dmg: 7, stun: 16, h: 'high' },
  };
  const FLOOR = 138, GRAV = 0.32, ROUND_T = 99 * 60, LEFT = 16, RIGHT = 224, FIGHT_SC = 3;

  // ---- the fighters' bodies: the person's side sprite without its arms and legs (set.torso), with
  // jointed arms and legs drawn on for each pose: two segments each, angles in degrees from
  // straight down (90 is forward, 180 is straight up). The standing leg plants on the floor, so
  // bending the knees crouches the whole body. The back arm and leg are a shade darker, behind
  // him. fa/ba: front/back arm, fl/bl: front/back leg, bx: lean (pixels), by: the body sinks
  // (crouching, over bent knees), air: don't plant.
  const POSES = {
    idle1: { fa: [60, 125], ba: [40, 140], fl: [35, -5], bl: [-35, -5] },
    idle2: { fa: [65, 120], ba: [45, 135], fl: [42, -12], bl: [-42, -12] },
    walk1: { fa: [60, 125], ba: [40, 140], fl: [45, 10], bl: [-35, -25], bx: 1 },
    walk2: { fa: [60, 125], ba: [40, 140], fl: [-20, -30], bl: [25, 5] },
    punch1: { fa: [5, 170], ba: [50, 150], fl: [35, -5], bl: [-40, -10], bx: -2 },
    punch2: { fa: [92, 92], ba: [20, 160], fl: [50, 5], bl: [-50, -25], bx: 2 },
    punch3: { fa: [40, 160], ba: [95, 92], fl: [50, 5], bl: [-50, -25], bx: 3 },
    upper: { fa: [135, 165], ba: [35, 160], fl: [15, -5], bl: [-40, -15], bx: 2 },
    kick1: { fa: [70, 130], ba: [-30, 20], fl: [100, -15], bl: [-10, 0], bx: -2 },
    kick2: { fa: [80, 120], ba: [-60, -30], fl: [100, 100], bl: [-25, -10], bx: -3 },
    oblique: { fa: [70, 130], ba: [-30, 20], fl: [70, 55], bl: [-15, -5], bx: -2 },
    knee: { fa: [70, 150], ba: [45, 160], fl: [115, -30], bl: [25, -45], air: true },
    jump: { fa: [120, 165], ba: [100, 170], fl: [70, -30], bl: [35, -45], air: true },
    nair: { fa: [120, 160], ba: [-120, -160], fl: [100, 100], bl: [-100, -100], air: true },
    bair: { fa: [70, 150], ba: [40, 160], fl: [70, -40], bl: [-100, -100], air: true },
    uair: { fa: [170, 178], ba: [150, 175], fl: [70, -30], bl: [40, -40], air: true },
    stomp: { fa: [150, 170], ba: [140, 165], fl: [8, 0], bl: [-8, 0], air: true },
    block: { fa: [80, 175], ba: [70, 170], fl: [40, -10], bl: [-40, -10], bx: -1 },
    crouch: { fa: [70, 130], ba: [50, 140], fl: [85, -15], bl: [-65, -35], by: 4 },
    crouchBlock: { fa: [80, 175], ba: [70, 170], fl: [85, -15], bl: [-65, -35], by: 4, bx: -1 },
    crouchJab: { fa: [95, 92], ba: [40, 160], fl: [85, -15], bl: [-65, -35], by: 4, bx: 2 },
    sweep: { fa: [60, 150], ba: [-40, -60], fl: [98, 94], bl: [-70, -110], by: 4 },
    grab: { fa: [88, 88], ba: [80, 96], fl: [50, 5], bl: [-45, -20], bx: 2 },
    shoot: { fa: [85, 88], ba: [75, 95], fl: [70, 0], bl: [-60, -80], bx: 3 },
    lift: { fa: [170, 178], ba: [160, 178], fl: [25, 0], bl: [-25, 0], bx: -2 },
    hurt: { fa: [-50, -90], ba: [-65, -110], fl: [20, 0], bl: [-20, 0], bx: -3 },
    win: { fa: [165, 178], ba: [155, 172], fl: [18, 0], bl: [-18, 0] },
    pound: { fa: [130, 70], ba: [40, 150], fl: [85, -75], bl: [-65, -100], bx: 3 },
    pound2: { fa: [60, 150], ba: [130, 70], fl: [85, -75], bl: [-65, -100], bx: 3 },
  };
  const RW = 36, ROX = 10;
  const rigCache = {};
  function fighterPoses(id) {
    if (rigCache[id]) return rigCache[id];
    const set = G.sprites[id], sh = G.art.shade, H = set.h;
    const c = Object.assign({ skin: '#f2c8a0', shirt: '#4878c8', pants: '#383848', shoes: '#4a3428', torso: 6, legs: 3, sleeves: 2 }, G.CAST[id]);
    // (fighters get long arms and legs, so a punch or a kick really reaches; PAD rows on top
    // leave room for a taller stance (and Khabib's hat))
    const PAD = 6, ty = 11 + PAD, ly = ty + c.torso, thick = c.big || c.wide ? 2 : 1;
    const Lu = (c.torso >= 6 ? 4 : 3) + (c.reach ? 1 : 0), Lf = Lu;
    const Lt = Math.ceil(c.legs / 2) + 1, Ls = c.legs + 2 - Lt;
    const armUp = c.coat || (c.sleeves === 0 ? c.skin : c.shirt), armLo = c.coat || (c.sleeves === 'long' || c.sleeves >= 4 ? c.shirt : c.skin);
    const thigh = c.pants, shin = c.shorts ? c.skin : c.pants, boot = c.shoes, fist = c.gloves || c.skin;
    const rad = (a) => (a * Math.PI) / 180;
    const seg = (x, X, Y, ang, len, w, col) => {
      const dx = Math.sin(rad(ang)), dy = Math.cos(rad(ang)), o = (w - 1) / 2;
      x.fillStyle = col;
      for (let t = 0; t <= len + 0.01; t += 0.34) x.fillRect(Math.round(X + dx * t - o), Math.round(Y + dy * t - o), w, w);
      return [X + dx * len, Y + dy * len];
    };
    const arm = (x, X, Y, [a1, a2], dark) => {
      const k = dark ? -0.28 : 0, [ex, ey] = seg(x, X, Y, a1, Lu, thick, sh(armUp, k)), [hx, hy] = seg(x, ex, ey, a2, Lf, thick, sh(armLo, k));
      x.fillStyle = sh(fist, k); x.fillRect(Math.round(hx - 1), Math.round(hy - 1), 2, 2);
    };
    const leg = (x, X, Y, [a1, a2], dark) => {
      const k = dark ? -0.28 : 0, [kx, ky] = seg(x, X, Y, a1, Lt, 2, sh(thigh, k)), [fx, fy] = seg(x, kx, ky, a2, Ls, 2, sh(shin, k));
      // the foot points forward on the floor, and along the leg when it's kicked up
      x.fillStyle = sh(boot, k);
      if (a2 > 60) x.fillRect(Math.round(fx - 1), Math.round(fy - 2), 2, 3); else x.fillRect(Math.round(fx - 1), Math.round(fy), 3, 2);
    };
    // the lowest point of a leg (knee or foot), to plant the standing one on the floor
    const low = ([a1, a2]) => { const ky = Lt * Math.cos(rad(a1)); return Math.max(ky, ky + Ls * Math.cos(rad(a2))); };
    const outlined = (src) => {
      const W = src.width, Hh = src.height, d = src.getContext('2d').getImageData(0, 0, W, Hh).data, out = G.canvas(W, Hh), ox = out.getContext('2d');
      const on = (X, Y) => X >= 0 && Y >= 0 && X < W && Y < Hh && d[(Y * W + X) * 4 + 3] > 0;
      ox.fillStyle = '#1c1424';
      for (let Y = 0; Y < Hh; Y++) for (let X = 0; X < W; X++) if (!on(X, Y) && (on(X - 1, Y) || on(X + 1, Y) || on(X, Y - 1) || on(X, Y + 1))) ox.fillRect(X, Y, 1, 1);
      ox.drawImage(src, 0, 0);
      return out;
    };
    // extra: something drawn over the body (a walkout prop), given the body's x and top row
    const make = (P, extra) => {
      const drop = Math.round(P.air ? 0 : c.legs - Math.max(low(P.fl), low(P.bl))), sink = P.by || 0, bx = ROX + (P.bx || 0);
      const back = G.canvas(RW, H + PAD), front = G.canvas(RW, H + PAD);
      leg(back.getContext('2d'), bx + 7, ly + drop, P.bl, true); arm(back.getContext('2d'), bx + 7, ty + 1 + drop + sink, P.ba, true);
      leg(front.getContext('2d'), bx + 8, ly + drop, P.fl, false); arm(front.getContext('2d'), bx + 8, ty + 1 + drop + sink, P.fa, false);
      const cv = G.canvas(RW, H + PAD), x = cv.getContext('2d');
      x.drawImage(outlined(back), 0, 0);
      x.drawImage(set.torso, bx, drop + sink + PAD);
      if (extra) { const ex = G.canvas(RW, H + PAD); extra(ex.getContext('2d'), bx, drop + sink + PAD); x.drawImage(outlined(ex), 0, 0); }
      x.drawImage(outlined(front), 0, 0);
      return cv;
    };
    const poses = {};
    for (const k in POSES) poses[k] = make(POSES[k]);
    poses.flash = G.art.flash(poses.hurt);
    // the walkout look (select and VS screens): Rampage's chain, Khabib's papakha
    poses.walkout = make(POSES.idle1, c.walkout === 'chain' ? (x, bx, top) => {
      for (const [dx, dy] of [[4, 11], [5, 12], [6, 13], [7, 13], [8, 12], [9, 11]]) { x.fillStyle = (dx + dy) % 2 ? '#c8ccd4' : '#7a7e88'; x.fillRect(bx + dx, top + dy, 1, 1); }
    } : c.walkout === 'papakha' ? (x, bx, top) => {
      for (let y = 0; y < 5; y++) for (let X = 3; X <= 12; X++) { x.fillStyle = (X * 3 + y * 5) % 4 ? '#e8e2d6' : '#b8b0a2'; x.fillRect(bx + X, top - 3 + y, 1, 1); }
    } : null);
    return (rigCache[id] = poses);
  }

  // the locker room: cinder block, two fluorescent lights, a MICRO MAYHEM banner, a row of
  // lockers, a long bench, and the floor
  let stageC = null;
  function lockerStage() {
    if (stageC) return stageC;
    const c = G.canvas(G.W, G.H), x = c.getContext('2d');
    x.fillStyle = '#2a3040'; x.fillRect(0, 0, G.W, G.H);
    x.fillStyle = '#343c50';
    for (let y = 0; y < 108; y += 10) { x.fillRect(0, y, G.W, 1); for (let X = (y / 10) % 2 ? 0 : 10; X < G.W; X += 20) x.fillRect(X, y, 1, 10); }
    for (const lx of [36, 164]) { x.fillStyle = 'rgba(232,240,248,0.07)'; x.fillRect(lx - 20, 7, 80, 70); x.fillStyle = '#e8f0f8'; x.fillRect(lx, 4, 40, 3); }
    x.fillStyle = '#7a1a2a'; x.fillRect(70, 14, 100, 17);
    x.fillStyle = '#f8d850'; x.fillRect(70, 14, 100, 1); x.fillRect(70, 30, 100, 1);
    FT().draw(x, 'MICRO MAYHEM', 120 - Math.round(FT().width('MICRO MAYHEM') / 2), 18, '#f8d850');
    for (let k = 0; k < 12; k++) {
      const lx = 2 + k * 20;
      x.fillStyle = '#4a5a78'; x.fillRect(lx, 40, 18, 66);
      x.fillStyle = '#5a6c8c'; x.fillRect(lx, 40, 18, 2);
      x.fillStyle = '#3a4860'; x.fillRect(lx + 17, 40, 1, 66);
      for (let v = 0; v < 3; v++) x.fillRect(lx + 4, 46 + v * 3, 10, 1);
      x.fillStyle = '#c8ccd4'; x.fillRect(lx + 13, 70, 2, 5);
    }
    x.fillStyle = '#8a6440'; x.fillRect(0, 108, G.W, 5);
    x.fillStyle = '#6a4a30'; x.fillRect(0, 113, G.W, 2);
    x.fillStyle = '#4a4440'; x.fillRect(0, 118, G.W, 42);
    x.fillStyle = '#3a3430'; x.fillRect(0, 118, G.W, 1);
    x.fillStyle = '#54504a'; for (const y of [124, 131, 140, 151]) x.fillRect(0, y, G.W, 1);
    return (stageC = c);
  }


  // ---- the select screen: Doron on the left, whoever you're on on the right, and the faces along
  // the bottom (a silhouette until the one before is beaten; Nani's isn't there at all until Jon
  // Jones is beaten)
  // Doron's moves, for the MOVES page on the select screen: [what, how]
  const FIGHT_MOVES = [
    ['MOVING', [
      ['Walk', '← →'], ['Dash', 'tap ← or → twice'], ['Jump', '↑'], ['Crouch (ducks high punches)', '↓'],
      ['Block', 'hold away, or hold V'], ['Block low kicks', '↓ + away (or ↓ + V)'], ['PARRY', 'tap V as a hit lands'],
    ]],
    ['ATTACKING', [
      ['Punch / Kick', 'Z / X'], ['Low jab / Sweep', '↓+Z / ↓+X'], ['Combos', 'Z Z X, Z Z Z, ↓Z X'],
      ['ARMY SUPLEX (beats a block)', 'C up close'], ['TAKEDOWN', '↓ then → then Z'], ['GROUND AND POUND', 'full FIGHT meter + C'],
    ]],
    ['IN THE AIR (Z or X)', [
      ['Spin kick (hits both sides)', 'no direction'], ['Flying knee', 'toward him'], ['Back kick', 'away from him'],
      ['Up swipe', '↑'], ['Stomp (SPIKES him down)', '↓'],
    ]],
  ];
  function fightSelectCmd() {
    const FS = fightState();
    return {
      start() {
        const L = fightersShown();
        this.sel = Math.max(0, L.findIndex((F) => fightOpen(FIGHTERS.indexOf(F)) && !FS[F.id]));
        this.t = 0; G.play.overlay = this;
      },
      update() {
        const inp = G.input, L = fightersShown();
        this.t++;
        // the moves list: ← → turn the page, any button closes it
        if (this.moves != null) {
          if (inp.hit('left') || inp.hit('right')) { this.moves = (this.moves + (inp.hit('right') ? 1 : FIGHT_MOVES.length - 1)) % FIGHT_MOVES.length; G.audio.sfx('menu'); }
          else if (inp.hit('a') || inp.hit('b') || inp.hit('c')) { inp.eat('a'); inp.eat('b'); this.moves = null; G.audio.sfx('cancel'); }
          return false;
        }
        if (inp.hit('c')) { this.moves = 0; G.audio.sfx('select'); return false; }
        if (inp.hit('left') && this.sel > 0) { this.sel--; G.audio.sfx('menu'); }
        if (inp.hit('right') && this.sel < L.length - 1) { this.sel++; G.audio.sfx('menu'); }
        if (inp.hit('a')) {
          inp.eat('a');
          const F = L[this.sel];
          if (fightOpen(FIGHTERS.indexOf(F))) { G.audio.sfx('select'); this.result = F; return true; }
          G.audio.sfx('bump');
        }
        if (inp.hit('b') || quitHit()) { inp.eat('b'); G.audio.sfx('cancel'); this.result = null; return true; }
        return false;
      },
      draw(ctx) {
        const L = fightersShown();
        ctx.fillStyle = '#16101e'; ctx.fillRect(0, 0, G.W, G.H);
        ctx.fillStyle = '#1e1630';
        for (let k = -G.H; k < G.W; k += 16) for (let y = 0; y < G.H; y += 2) ctx.fillRect(k + y, y, 6, 2);
        FT().drawBig(ctx, 'FIGHT NIGHT', 6, 4, 2, '#f8d850', '#7a1a2a');
        FT().draw(ctx, 'Z fight   X done', G.W - 6 - FT().width('Z fight   X done'), 4, '#9890a8', { shadow: '#000' });
        FT().draw(ctx, 'C moves', G.W - 6 - FT().width('C moves'), 13, '#f8d850', { shadow: '#000' });
        if (this.moves != null) { this.drawMoves(ctx); return; }
        ctx.imageSmoothingEnabled = false;
        // Doron and the pick, in their walkout looks
        const F = L[this.sel], open = fightOpen(FIGHTERS.indexOf(F)), D = fighterPoses('doron').idle1, O = fighterPoses(F.id).walkout;
        ctx.drawImage(D, 40 - (ROX + 8) * 3, 124 - D.height * 3, D.width * 3, D.height * 3);
        FT().draw(ctx, 'DORON', 10, 116, '#f8f8f0', { shadow: '#000' });
        if (G.state.items.belt) FT().draw(ctx, G.state.items.bmf ? 'CHAMPION + BMF' : 'CHAMPION', 6, 24, '#f8d850', { shadow: '#000' });
        ctx.save(); ctx.translate(200, 0); ctx.scale(-1, 1);
        ctx.drawImage(open ? O : G.silhouette(O), -(ROX + 8) * 3, 124 - O.height * 3, O.width * 3, O.height * 3);
        ctx.restore();
        // the middle: his name, his style, and whether he's beaten
        let y = 26;
        for (const l of FT().wrap(open ? F.full : '???', 92).slice(0, 2)) { FT().draw(ctx, l, 120 - Math.round(FT().width(l) / 2), y, open ? '#f8d850' : '#5a4e70', { shadow: '#000' }); y += 9; }
        y += 4;
        const about = open ? F.style : 'Beat ' + FIGHTERS[FIGHTERS.indexOf(F) - 1].name + ' first.';
        FT().wrap(about, 92).slice(0, 5).forEach((l, k) => FT().draw(ctx, l, 120 - Math.round(FT().width(l) / 2), y + k * 9, '#c8c0d8', { shadow: '#000' }));
        if (fightState()[F.id]) FT().draw(ctx, '★ BEATEN', 120 - Math.round(FT().width('★ BEATEN') / 2), 108, '#78e070', { shadow: '#000' });
        else if (open) FT().draw(ctx, F.secret ? 'SECRET CHALLENGER' : 'NEW CHALLENGER', 120 - Math.round(FT().width(F.secret ? 'SECRET CHALLENGER' : 'NEW CHALLENGER') / 2), 108, (this.t >> 4) & 1 ? '#f86858' : '#f8f8f0', { shadow: '#000' });
        // the faces
        const x0 = 120 - L.length * 16 + 1;
        L.forEach((G2, i) => {
          const x = x0 + i * 32, yy = 128, on = i === this.sel, ok = fightOpen(FIGHTERS.indexOf(G2)), S2 = G.sprites[G2.id].down[0];
          ctx.fillStyle = on ? ((this.t >> 3) & 1 ? '#f8d850' : '#f8a040') : '#3e3460'; ctx.fillRect(x - 1, yy - 1, 32, 30);
          ctx.fillStyle = ok ? (G2.secret ? '#3a1420' : '#2a2040') : '#1a1428'; ctx.fillRect(x, yy, 30, 28);
          ctx.drawImage(ok ? S2 : G.silhouette(S2), 0, 0, 16, 13, x - 1, yy + 1, 32, 26);
          if (!ok) FT().draw(ctx, '?', x + 13, yy + 10, '#9890a8');
          if (fightState()[G2.id]) FT().draw(ctx, '★', x + 22, yy + 1, '#f8d850', { shadow: '#000' });
        });
      },
      drawMoves(ctx) {
        const [title, rows] = FIGHT_MOVES[this.moves];
        ctx.fillStyle = '#0c0814'; ctx.fillRect(6, 24, G.W - 12, 128);
        ctx.fillStyle = '#3e3460'; ctx.fillRect(6, 24, G.W - 12, 1); ctx.fillRect(6, 151, G.W - 12, 1);
        FT().draw(ctx, 'DORON\'S MOVES: ' + title, 12, 28, '#f8d850', { shadow: '#000' });
        const pg = G.sayable(this.moves + 1) + '/' + G.sayable(FIGHT_MOVES.length) + '  ← →';
        FT().draw(ctx, pg, G.W - 12 - FT().width(pg), 28, '#9890a8', { shadow: '#000' });
        rows.forEach(([what, how], k) => {
          const y = 42 + k * 13;
          FT().draw(ctx, what, 12, y, '#f8f8f0', { shadow: '#000' });
          FT().draw(ctx, how, G.W - 12 - FT().width(how), y, '#78e8f8', { shadow: '#000' });
        });
        FT().draw(ctx, 'Z, X or C: back', 12, 142, '#9890a8', { shadow: '#000' });
      },
    };
  }

  // ---- the fight. Result: { won } (or 'quit').
  function fightCmd(F) {
    return {
      start() {
        Object.assign(this, { phase: 'vs', t: 0, round: 1, wins: [0, 0], sparks: [], shots: [], pops: [], stop: 0, shakeT: 0, flashT: 0, big: null, bubble: null, bubbleT: 0, buf: [], f: 0, guard: false, parryAt: -99, lastTap: null, lastTapF: -99, combo: 0, comboT: 0, meter: 0 });
        this.reset();
        G.play.overlay = this;
      },
      fighter(sprite, x, face, hp, speed) {
        return { sprite, x, y: 0, vx: 0, vy: 0, face, hp, maxHp: hp, speed, st: 'idle', t: 0, move: null, moveName: null, hit: false, stun: 0, cool: 0, think: 0, blockT: 0, cblockT: 0, sleepT: 0, anim: 0, used: false, chain: 0, rot: 0, combo: 0, raged: false, counterQ: false, lowGuard: false };
      },
      reset() {
        // (the FIGHT meter carries over from round to round)
        this.p = this.fighter('doron', 80, 1, 100, 1.5);
        this.e = this.fighter(F.id, 160, -1, F.hp, F.speed);
        this.e.cool = Math.round(F.every * 0.6);
        this.timer = ROUND_T; this.shots = []; this.combo = 0; this.comboT = 0;
      },
      go(phase) { this.phase = phase; this.t = 0; },
      say(a, text) { this.bubble = { a, text }; this.bubbleT = 110; },
      pop(text, col) { this.pops.push({ text, col: col || '#f8d850', t: 0 }); },
      spark(x, y, cols) { for (let k = 0; k < 8; k++) this.sparks.push({ x, y, vx: (Math.random() - 0.5) * 3, vy: -0.5 - Math.random() * 2, life: 14 + Math.random() * 8, c: cols[k % cols.length] }); },
      gain(n) { this.meter = Math.min(100, this.meter + n); },
      update() {
        if (quitHit()) { this.result = 'quit'; return true; }
        this.t++;
        for (const s of this.sparks) { s.x += s.vx; s.y += s.vy; s.vy += 0.15; s.life--; }
        this.sparks = this.sparks.filter((s) => s.life > 0);
        for (const pp of this.pops) pp.t++;
        this.pops = this.pops.filter((pp) => pp.t < 50);
        if (this.bubbleT > 0) this.bubbleT--;
        if (this.shakeT > 0) this.shakeT--;
        if (this.flashT > 0) this.flashT--;
        if (this.phase === 'vs') {
          if (this.t >= 130 || (this.t > 30 && G.input.hit('a'))) { G.input.eat('a'); this.go('round'); }
          return false;
        }
        if (this.phase === 'round') {
          if (this.t === 1) G.audio.sfx('bell');
          if (this.t === 60) G.audio.sfx('yell');
          this.big = this.t < 60 ? 'ROUND ' + G.sayable(this.round) : 'FIGHT!';
          this.p.anim++; this.e.anim++;
          if (this.t >= 100) { this.big = null; this.go('fight'); }
          return false;
        }
        if (this.phase === 'ko') {
          this.physics(this.p); this.physics(this.e);
          if (this.t >= 120) {
            this.wins[this.koWinner === 'p' ? 0 : 1]++;
            if (this.wins[0] >= 2 || this.wins[1] >= 2) {
              const won = this.wins[0] >= 2;
              this.go('over');
              this.big = won ? 'DORON WINS!' : F.name + ' WINS';
              G.audio.sfx(won ? 'fanfare' : 'no');
              const w = won ? this.p : this.e;
              if (w.st !== 'down') w.st = 'win';
            } else { this.round++; this.reset(); this.big = null; this.go('round'); }
          }
          return false;
        }
        if (this.phase === 'over') {
          this.physics(this.p); this.physics(this.e); this.p.anim++; this.e.anim++;
          if (this.t >= 150) { this.result = { won: this.wins[0] >= 2 }; return true; }
          return false;
        }
        // the fight itself (a hit freezes everything for a few frames)
        if (this.stop > 0) { this.stop--; return false; }
        this.f++;
        this.timer--;
        this.playerInput();
        this.ai();
        this.tick(this.p, this.e);
        this.tick(this.e, this.p);
        this.shotsUpdate();
        this.separate();
        if (this.p.hp <= 0 || this.e.hp <= 0 || this.timer <= 0) this.endRound();
        return false;
      },

      // ---- Doron: the keyboard
      playerInput() {
        const P = this.p, inp = G.input;
        const fwd = P.face > 0 ? 'right' : 'left';
        if (inp.hit('down')) this.buf.push(['d', this.f]);
        if (inp.hit(fwd)) this.buf.push(['f', this.f]);
        this.buf = this.buf.filter(([, t]) => this.f - t < 24);
        // ↓ then → (toward him), then Z
        const qcf = () => { const di = this.buf.findIndex(([k]) => k === 'd'); return di >= 0 && this.buf.slice(di + 1).some(([k]) => k === 'f'); };
        if (inp.hit('v')) this.parryAt = this.f;
        this.vGuard = inp.down('v');
        this.guard = this.vGuard || inp.down(P.face > 0 ? 'left' : 'right');
        if (this.comboT > 0) this.comboT--;
        // in the air, Z or X with a direction: an aerial (one per jump)
        if (P.st === 'air' && !P.used && (inp.hit('a') || inp.hit('b'))) {
          const toward = inp.down(fwd), away = inp.down(P.face > 0 ? 'left' : 'right');
          P.used = true;
          this.begin(P, inp.down('down') ? 'dair' : inp.down('up') ? 'uair' : toward ? 'fair' : away ? 'bair' : 'nair');
          return;
        }
        // combos: once a punch has hit, Z or X cancels the rest of it into the next one
        if (P.st === 'atk' && P.hit && P.move && P.move.next && P.t >= P.move.start + P.move.active) {
          const nx = inp.hit('a') ? P.move.next.a : inp.hit('b') ? P.move.next.b : null;
          if (nx) { this.begin(P, nx); return; }
        }
        if (P.st !== 'idle' && P.st !== 'walk' && P.st !== 'crouch') return;
        if (inp.hit('c')) { if (this.meter >= 100) this.superMove(); else this.begin(P, 'grab'); return; }
        if (inp.hit('a') && qcf()) { this.buf = []; this.say(P, 'TAKEDOWN!'); this.begin(P, 'takedown'); return; }
        // ↓: crouch (a low jab and a sweep from down there; V blocks low)
        if (inp.down('down')) {
          P.vx = 0; P.st = 'crouch';
          if (inp.hit('a')) this.begin(P, 'lowJab');
          else if (inp.hit('b')) this.begin(P, 'sweep');
          return;
        }
        if (P.st === 'crouch') P.st = 'idle';
        if (this.vGuard) { P.vx = 0; P.st = 'idle'; return; }
        if (inp.hit('a')) { this.begin(P, 'punch'); return; }
        if (inp.hit('b')) { this.begin(P, 'kick'); return; }
        const dir = (inp.down('right') ? 1 : 0) - (inp.down('left') ? 1 : 0);
        if (inp.hit('up')) { this.jump(P, dir); return; }
        // tap a direction twice for a dash
        const tap = inp.hit('right') ? 1 : inp.hit('left') ? -1 : 0;
        if (tap) {
          if (this.lastTap === tap && this.f - this.lastTapF < 12) { this.lastTap = null; this.dash(P, tap); return; }
          this.lastTap = tap; this.lastTapF = this.f;
        }
        P.vx = dir * P.speed;
        P.st = dir ? 'walk' : 'idle';
      },
      jump(a, dir) { a.st = 'air'; a.vy = 5.6; a.y = 0.1; a.used = false; a.vx = dir * 1.8; G.audio.sfx('dash'); },
      dash(a, dir) { a.st = 'dash'; a.t = 0; a.vx = dir * 3.6; G.audio.sfx('dash'); },
      superMove() {
        this.meter = 0; this.flashT = 24; this.stop = 18;
        this.pop('GROUND AND POUND!');
        this.say(this.p, 'UFC, BABY!');
        G.audio.sfx('yell');
        this.begin(this.p, 'rush');
      },

      // ---- the other guy: walks in, throws hands (and keeps combos going), blocks some of what he
      // sees coming (high or low), grabs you if you sit there blocking, and uses his specials when
      // they're ready. Under 30% health he gets mad: faster, meaner, more specials.
      ai() {
        const E = this.e, P = this.p, dist = Math.abs(P.x - E.x), R = Math.random;
        if (E.sleepT > 0) {
          E.vx = 0;
          if (E.st === 'idle' || E.st === 'walk') E.st = 'sleep';
          if (--E.sleepT === 0 && E.st === 'sleep') { E.st = 'idle'; this.say(E, '...!'); }
          return;
        }
        if (E.st === 'sleep') E.st = 'idle';
        if (!E.raged && E.hp > 0 && E.hp < E.maxHp * 0.3) { E.raged = true; this.say(E, F.rage); this.pop('HE\'S MAD!', '#f86858'); E.cool = 0; }
        const rage = E.raged ? 1 : 0;
        if (E.cool > 0) E.cool -= 1 + rage;
        if (E.st === 'air' && !E.used && dist < 44 && E.vy < 1) { E.used = true; this.begin(E, 'fair'); return; }
        // keep a combo going when it hits
        if (E.st === 'atk' && E.hit && E.move && E.move.next && E.t >= E.move.start + E.move.active && R() < F.combo) {
          const nx = R() < 0.5 ? E.move.next.a || E.move.next.b : E.move.next.b || E.move.next.a;
          if (nx) { this.begin(E, nx); return; }
        }
        if (E.st !== 'idle' && E.st !== 'walk' && E.st !== 'crouch') return;
        // he blocked it, now the counter (McGregor's left hand)
        if (E.counterQ && E.blockT <= 0 && E.cblockT <= 0) { E.counterQ = false; this.say(E, 'THE LEFT!'); this.begin(E, F.special); return; }
        if (E.cblockT > 0) { E.vx = 0; E.st = 'crouch'; return; }
        if (E.st === 'crouch') E.st = 'idle';
        if (E.blockT > 0) { E.vx = 0; E.st = 'idle'; return; }
        if (--E.think > 0) { E.st = E.vx ? 'walk' : 'idle'; return; }
        E.think = Math.max(3, Math.round((24 - F.aggro * 16) * (0.6 + R() * 0.8) * (rage ? 0.6 : 1)));
        const toward = P.x > E.x ? 1 : -1;
        if (E.cool <= 0) {
          let sp = F.also && R() < 0.4 ? F.also : F.special;
          const ok = {
            powerbomb: dist < 28, hook: dist < 34, leftStraight: dist < 48, spinKick: dist < 40, doubleLeg: dist < 70,
            grab: dist < 28, suplexArmbar: dist < 28, flyingKnee: dist > 36 && dist < 100, oblique: dist < 44, spinElbow: dist < 30,
            flurry: dist < 34, haymaker: dist < 36,
          }[sp];
          if (ok) {
            E.cool = Math.round(F.every * (0.7 + R() * 0.6));
            const shout = { powerbomb: 'POWERBOMB!', doubleLeg: 'DOUBLE LEG!', suplexArmbar: 'SUPLEX...', spinKick: 'HYAH!', haymaker: 'NANI LOVES YOU!' }[sp];
            if (shout) this.say(E, shout);
            this.begin(E, sp);
            return;
          }
        }
        // turtling? he grabs you
        if (dist < 28 && R() < (this.guard ? 0.5 : F.grab)) { this.begin(E, F.id === 'rampage' && R() < 0.5 ? 'powerbomb' : F.id === 'mouse' && R() < 0.5 ? 'suplexArmbar' : 'grab'); return; }
        if (dist < 36 + (F.reach || 0) && R() < Math.min(0.95, F.aggro + rage * 0.15)) { this.begin(E, dist > 26 || R() < 0.5 ? 'kick' : 'punch'); return; }
        if (dist > 40 && dist < 110 && R() < F.jump) { this.jump(E, toward); return; }
        const away = F.keepAway && dist < 60 && R() < 0.6;
        E.vx = (away ? -toward : dist > 30 ? toward : 0) * E.speed * (rage ? 1.2 : 1);
        E.st = E.vx ? 'walk' : 'idle';
      },

      // ---- moves
      begin(a, name) {
        const m = MOVES[name], d = a === this.p ? this.e : this.p;
        if (m.chain && a.moveName !== name) a.chain = 1;
        a.st = 'atk'; a.move = m; a.moveName = name; a.t = 0; a.hit = false;
        if (!m.air) a.vx = 0;
        // the other guy might see it coming: guard up (crouching for a low one, or ducking a high
        // one), and McGregor likes to block it and come back with the left
        if (a === this.p && !m.grab && !m.smash && Math.abs(d.x - a.x) < 60 && d.st !== 'atk' && Math.random() < F.block) {
          const dur = m.start + Math.min(m.active, 20) + 6;
          if (m.h === 'low' || (m.h === 'high' && Math.random() < 0.3)) d.cblockT = dur; else d.blockT = dur;
          if (F.counter && Math.random() < F.counter) d.counterQ = true;
        }
        G.audio.sfx(m.grab || m.leap || m.smash ? 'dash' : 'swing');
      },
      inActive(a) { const m = a.move; return !!m && a.t >= m.start && a.t < m.start + m.active; },
      atkTick(a, d) {
        const m = a.move;
        a.t++;
        if (m.leap && a.t === m.start) {
          // off the ground (an aimed one lands right where Doron is standing)
          a.vy = m.leap[1]; a.y = 0.1;
          a.vx = m.aim ? Math.max(-3.5, Math.min(3.5, (d.x - a.x) / ((2 * m.leap[1]) / GRAV))) : a.face * m.leap[0];
        }
        if (m.dash && this.inActive(a)) a.vx = a.face * m.dash;
        if (m.shoot) for (let k = 0; k < m.shoot; k++) if (a.t === m.start + k * 8) this.shots.push({ x: a.x + a.face * 14, y: 30 - k * 4, vx: a.face * (2.4 + k * 0.3), owner: a, life: 140 });
        if (this.inActive(a) && !a.hit && !m.shoot && !m.landHit && !(m.leap && a.t < m.start)) this.tryHit(a, d);
        if (a.t >= m.start + m.active + m.rec) {
          if (m.chain && a.chain < m.chain) { a.chain++; this.begin(a, a.moveName); return; }
          a.st = 'idle'; a.move = null; a.moveName = null; a.chain = 0;
        }
      },
      // crouching (or in a crouching move, or blocking low)?
      low(a) { return a.st === 'crouch' || (a.st === 'atk' && !!a.move && !!a.move.crouch) || (a.st === 'block' && a.lowGuard); },
      tryHit(a, d) {
        const m = a.move;
        if (d.st === 'down' || d.st === 'thrown' || d.st === 'throw' || d.st === 'pound') return;
        if (m.h === 'high' && this.low(d)) return;
        if (m.box) {
          const xs = a.x + a.face * m.box[0], xe = a.x + a.face * m.box[1], dh = this.low(d) ? 26 : 44;
          if (d.x + 9 < Math.min(xs, xe) || d.x - 9 > Math.max(xs, xe) || d.y + dh < a.y + m.box[2] || d.y > a.y + m.box[3]) return;
        } else {
          const reach = m.reach + (a === this.e ? F.reach || 0 : 0), x0 = a.x + a.face * 6, x1 = a.x + a.face * (6 + reach);
          if (d.x + 9 < Math.min(x0, x1) || d.x - 9 > Math.max(x0, x1)) return;
          if (Math.abs(a.y - d.y) > 30) return;
        }
        if (m.grab && d.y > 0) return;
        a.hit = true;
        this.connect(a, d, m);
      },
      // a hit lands (or gets blocked, or parried, or it's a grab or the super)
      connect(a, d, m) {
        const fromP = a === this.p;
        if (m.smash) {
          // GROUND AND POUND (Doron's super, Khabib's double leg): down he goes, and he's on top of him
          a.st = 'pound'; a.t = 0; a.vx = 0; a.move = null; a.pd = fromP ? [4, 6] : [3, 5];
          if (!fromP) this.say(a, 'SMASH!');
          d.st = 'down'; d.t = 0; d.vx = 0; d.vy = 0; d.y = 0; d.sleepT = 0; d.pinned = true; d.move = null;
          d.x = Math.max(LEFT, Math.min(RIGHT, a.x + a.face * 16));
          G.audio.sfx('hit'); this.shakeT = 10;
          return;
        }
        if (m.grab) {
          a.st = 'throw'; a.t = 0; d.st = 'thrown'; d.t = 0; d.vx = d.vy = 0; d.sleepT = 0; d.move = null;
          this.say(a, fromP ? 'ARMY... SUPLEX!' : m.bomb ? 'UP YOU GO!' : m.armbar ? 'SUPLEX...' : 'GOTCHA!');
          G.audio.sfx('yell');
          return;
        }
        const ready = d.y === 0 && (d.st === 'idle' || d.st === 'walk' || d.st === 'block' || d.st === 'crouch');
        // a PARRY: V tapped right before the hit lands. No damage, and he's wide open.
        if (d === this.p && ready && this.f - this.parryAt <= 8) {
          this.parryAt = -99;
          if (a.st === 'atk') { a.st = 'hurt'; a.stun = 32; a.move = null; a.moveName = null; a.chain = 0; }
          d.st = 'block'; d.stun = 6;
          G.audio.sfx('secret'); this.stop = 8; this.gain(20);
          this.pop('PARRY!', '#78e8f8');
          this.spark(d.x + d.face * 10, FLOOR - 44, ['#78e8f8', '#ffffff']);
          return;
        }
        // a standing guard stops high, mid and air attacks; a crouching one stops mid and low
        const lowNow = this.low(d) || (d !== this.p && d.cblockT > 0);
        const guard = d === this.p ? this.guard : d.blockT > 0 || d.cblockT > 0;
        const covers = m.h === 'low' ? lowNow : m.h === 'air' ? !lowNow : true;
        if (guard && ready && covers && d.sleepT <= 0) {
          d.st = 'block'; d.stun = 12; d.x += a.face * 5; d.vx = 0; d.lowGuard = lowNow;
          if (d === this.p) this.gain(3);
          G.audio.sfx('clank');
          this.spark(d.x - a.face * 8, FLOOR - 44 - d.y, ['#ffffff', '#c8d8f0']);
          return;
        }
        // caught winding up his own move: a COUNTER, for half again the damage
        const counter = d.st === 'atk' && d.move && d.t < d.move.start;
        let dmg = m.dmg * (fromP ? 1 : F.dmg) * (counter ? 1.5 : 1);
        d.hp = Math.max(0, d.hp - Math.round(dmg));
        if (counter && fromP) this.pop('COUNTER!', '#f8a040');
        if (d.sleepT > 0 || d.st === 'sleep') { d.sleepT = 0; this.say(d, '!!'); }
        this.gain(fromP ? 5 : 4);
        G.audio.sfx('hit');
        this.stop = counter ? 8 : 5; this.shakeT = Math.max(this.shakeT, m.down ? 10 : 4);
        this.spark(d.x - a.face * 6, FLOOR - 40 - d.y, counter ? ['#f8a040', '#f86858', '#ffffff'] : ['#f8f8a0', '#f8a040', '#ffffff']);
        // the third clean hit in a row knocks him down (no endless combos)
        d.combo = (d.combo || 0) + 1;
        if (m.spike && d.y > 4) {
          // the stomp on someone in the air: straight down into the floor
          d.hp = Math.max(0, d.hp - 4);
          this.knockDown(d, a.face); d.vy = -6;
          this.pop('SPIKE!', '#f86858');
        } else if (m.down || d.hp <= 0 || d.y > 0 || d.combo >= 3) this.knockDown(d, a.face);
        else { d.st = 'hurt'; d.stun = m.stun; d.vx = a.face * 2.4; d.move = null; d.moveName = null; d.chain = 0; }
        if (m.spike) { a.vy = 3.5; a.y = Math.max(a.y, 0.1); }
        if (fromP) {
          this.combo = (this.comboT > 0 ? this.combo : 0) + 1; this.comboT = 50;
          if (this.combo === 3) this.pop('COMBO!');
        }
      },
      knockDown(d, dir) { d.st = 'down'; d.t = 0; d.move = null; d.moveName = null; d.chain = 0; d.vx = dir * 2; d.vy = Math.max(d.vy, 2.6); d.y = Math.max(d.y, 1); },
      // the suplex: lifted, flipped over his head, and slammed down behind him
      throwTick(a, d) {
        a.t++;
        const m = a.move;
        if (m.bomb) {
          // the powerbomb: hoisted up over his head, then driven straight down in front of him
          d.x = a.x + a.face * 14;
          d.y = a.t < 18 ? 6 + 44 * (a.t / 18) : Math.max(0, 50 * (1 - (a.t - 18) / 12));
          d.rot = -a.face * d.face * Math.PI * Math.min(1, a.t / 18);
        } else if (a.t <= 30) {
          const th = Math.min(1, a.t / 30) * Math.PI;
          d.x = a.x + a.face * 16 * Math.cos(th); d.y = 6 + 40 * Math.sin(th); d.rot = -a.face * d.face * th;
        }
        if (a.t === 30) {
          d.hp = Math.max(0, d.hp - Math.round(m.dmg * (a === this.p ? 1 : F.dmg)));
          d.y = 0; d.rot = 0; d.x = Math.max(LEFT, Math.min(RIGHT, a.x + a.face * (m.bomb ? 18 : -20)));
          d.st = 'down'; d.t = 0; d.vx = (m.bomb ? a.face : -a.face) * 1.2; d.pinned = !!m.armbar;
          if (a === this.p) this.gain(10);
          G.audio.sfx('boom'); this.shakeT = 16; this.stop = 6;
          this.spark(d.x, FLOOR - 6, ['#c8b8a0', '#ffffff', '#8a7a68']);
        }
        // ...and Mighty Mouse turns the suplex into an armbar
        if (m.armbar && a.t === 44) {
          d.hp = Math.max(0, d.hp - Math.round(8 * F.dmg));
          this.pop('ARMBAR!', '#f86858');
          if (d === this.p) this.say(d, 'TAP! TAP! TAP!');
          G.audio.sfx('hit'); this.shakeT = 6;
        }
        if (a.t >= 30 + m.rec + (m.armbar ? 22 : 0)) { a.st = 'idle'; a.move = null; a.moveName = null; d.pinned = false; }
      },
      // GROUND AND POUND: six punches, then one big one
      poundTick(a, d) {
        a.t++;
        d.t = 0;
        if (a.t % 7 === 3 && a.t < 44) {
          d.hp = Math.max(0, d.hp - (a.pd || [4, 6])[0]);
          G.audio.sfx('hit'); this.shakeT = 4;
          this.spark(d.x, FLOOR - 8, ['#f8f8a0', '#f8a040', '#ffffff']);
        }
        if (a.t === 50) {
          d.hp = Math.max(0, d.hp - (a.pd || [4, 6])[1]);
          G.audio.sfx('boom'); this.shakeT = 14; this.stop = 8;
          this.spark(d.x, FLOOR - 8, ['#f86858', '#f8d850', '#ffffff']);
        }
        if (a.t >= 64) { a.st = 'idle'; d.pinned = false; d.t = 20; }
      },

      // ---- one fighter's frame: movement, his state's timer, his attack, and which way he faces
      tick(a, d) {
        this.physics(a);
        if (a.st === 'hurt' || a.st === 'block') { if (--a.stun <= 0) this.recover(a); }
        else if (a.st === 'down') { if (!a.pinned && ++a.t >= 56 && a.hp > 0 && a.y === 0) { this.recover(a); a.vx = 0; } }
        else if (a.st === 'dash') { if (++a.t >= 14) { a.st = 'idle'; a.vx = 0; } }
        else if (a.st === 'throw') this.throwTick(a, d);
        else if (a.st === 'pound') this.poundTick(a, d);
        else if (a.st === 'atk') this.atkTick(a, d);
        if (a.st === 'idle' || a.st === 'walk' || a.st === 'air' || a.st === 'block' || a.st === 'crouch') a.face = d.x >= a.x ? 1 : -1;
        if (a.blockT > 0) a.blockT--;
        if (a.cblockT > 0) a.cblockT--;
        a.anim++;
      },
      recover(a) {
        const was = a.st;
        a.st = 'idle'; a.combo = 0; a.lowGuard = false;
        if (a === this.e) { a.think = 0; if (was !== 'block' && Math.random() < F.block * 1.5) a.blockT = 18; }
      },
      physics(a) {
        if (a.st === 'thrown') return;
        a.x += a.vx;
        if (a.y > 0 || a.vy > 0) {
          a.y += a.vy; a.vy -= GRAV;
          if (a.y <= 0) { a.y = 0; a.vy = 0; this.land(a); }
        } else if (a.st !== 'walk' && a.st !== 'dash' && !(a.st === 'atk' && a.move && a.move.dash && this.inActive(a))) a.vx *= 0.8;
        a.x = Math.max(LEFT, Math.min(RIGHT, a.x));
      },
      land(a) {
        const m = a.move;
        if (a.st === 'air') { a.st = 'idle'; a.vx = 0; return; }
        if (a.st === 'atk' && m && (m.leap || m.air)) {
          // a flying move ends when he lands (the belly-flop is when he lands)
          if (m.landHit && !a.hit) {
            const d = a === this.p ? this.e : this.p;
            a.hit = true;
            if (Math.abs(d.x - a.x) < m.reach && d.y < 20 && d.st !== 'down' && d.st !== 'thrown') this.connect(a, d, m);
          }
          a.t = m.start + m.active; a.vx = 0;
          if (m.leap) { G.audio.sfx('bump'); this.shakeT = Math.max(this.shakeT, m.landHit ? 12 : 4); }
          return;
        }
        if (a.st === 'down') { a.vx *= 0.4; G.audio.sfx('bump'); }
      },
      // El EEENGLISH's E's: they fly straight; jump them, block them, or parry them
      shotsUpdate() {
        for (const s of this.shots) {
          s.x += s.vx; s.life--;
          const d = s.owner === this.e ? this.p : this.e;
          if (s.life > 0 && Math.abs(s.x - d.x) < 10 && d.y < 24 && !this.low(d) && d.st !== 'down' && d.st !== 'thrown' && d.st !== 'pound') { s.life = 0; this.connect(s.owner, d, MOVES.letterHit); }
        }
        this.shots = this.shots.filter((s) => s.life > 0 && s.x > -10 && s.x < G.W + 10);
      },
      // nobody walks through anybody (jump over him, though)
      separate() {
        const P = this.p, E = this.e;
        if ([P.st, E.st].some((st) => st === 'thrown' || st === 'throw' || st === 'pound')) return;
        const dx = E.x - P.x, gap = 26;
        if (Math.abs(dx) >= gap || Math.abs(P.y - E.y) >= 30) return;
        const push = (gap - Math.abs(dx)) / 2, s = dx >= 0 ? 1 : -1;
        P.x -= s * push; E.x += s * push;
        for (const [a, b] of [[P, E], [E, P]]) {
          if (a.x < LEFT) { b.x += LEFT - a.x; a.x = LEFT; }
          if (a.x > RIGHT) { b.x -= a.x - RIGHT; a.x = RIGHT; }
        }
      },
      endRound() {
        const P = this.p, E = this.e;
        const pWins = E.hp <= 0 ? true : P.hp <= 0 ? false : P.hp / P.maxHp >= E.hp / E.maxHp;
        this.koWinner = pWins ? 'p' : 'e';
        const ko = P.hp <= 0 || E.hp <= 0;
        this.big = ko ? 'K.O.!' : 'TIME!';
        G.audio.sfx(ko ? 'boom' : 'bell');
        const loser = pWins ? E : P;
        loser.pinned = false;
        if (ko && loser.st !== 'down' && loser.st !== 'thrown') this.knockDown(loser, pWins ? P.face : E.face);
        for (const a of [P, E]) { a.pinned = false; if (['atk', 'walk', 'sleep', 'dash', 'pound', 'throw', 'crouch'].includes(a.st)) a.st = 'idle'; }
        this.shots = [];
        this.go('ko');
      },

      // ---- drawing
      draw(ctx) {
        if (this.phase === 'vs') { this.drawVs(ctx); return; }
        const sx = this.shakeT ? Math.round((Math.random() * 2 - 1) * 3) : 0;
        ctx.save(); ctx.translate(sx, 0);
        ctx.drawImage(lockerStage(), 0, 0);
        if (this.flashT > 0) { ctx.fillStyle = 'rgba(12,8,20,' + Math.min(0.6, this.flashT / 30) + ')'; ctx.fillRect(0, 0, G.W, G.H); }
        for (const a of [this.p, this.e]) {
          const w = Math.max(10, Math.round(28 - a.y / 3));
          ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(Math.round(a.x - w / 2), FLOOR - 2, w, 3);
        }
        // whoever is mid-move (or doing the throwing) is drawn in front
        const busy = (a) => a.st === 'atk' || a.st === 'throw' || a.st === 'pound';
        const front = busy(this.e) || this.p.st === 'thrown' ? this.e : this.p;
        this.drawFighter(ctx, front === this.p ? this.e : this.p);
        this.drawFighter(ctx, front);
        for (const s of this.shots) FT().drawBig(ctx, 'E', Math.round(s.x - 6), Math.round(FLOOR - s.y - 10), 2, '#d03038', '#1c1424');
        for (const s of this.sparks) { ctx.fillStyle = s.c; ctx.fillRect(Math.round(s.x), Math.round(s.y), 2, 2); }
        ctx.restore();
        this.drawHud(ctx);
      },
      // which pose he's in right now
      poseOf(a) {
        const m = a.move;
        switch (a.st) {
          case 'walk': return (a.anim >> 3) & 1 ? 'walk1' : 'walk2';
          case 'dash': return 'walk1';
          case 'air': return 'jump';
          case 'hurt': return (a.stun >> 1) & 1 ? 'flash' : 'hurt';
          case 'block': return a.lowGuard ? 'crouchBlock' : 'block';
          case 'crouch': return (a === this.p ? this.guard : a.cblockT > 0) ? 'crouchBlock' : 'crouch';
          case 'sleep': return 'sleep';
          case 'win': return (a.anim >> 4) & 1 ? 'win' : 'idle1';
          case 'throw': return a.t < 10 ? 'grab' : a.t > 32 ? 'crouch' : 'lift';
          case 'thrown': case 'down': return 'hurt';
          case 'pound': return ((a.t + 4) / 7 | 0) & 1 ? 'pound2' : 'pound';
          case 'atk': {
            if (!m) return 'idle1';
            const ph = a.t < m.start ? 0 : a.t < m.start + m.active ? 1 : 2;
            let pz = m.poses[ph];
            if (a.moveName === 'chops' && a.chain % 2 === 0 && pz === 'punch2') pz = 'punch3';
            return pz;
          }
        }
        if (a === this.p ? this.guard && this.phase === 'fight' : a.blockT > 0) return 'block';
        return (a.anim >> 4) & 1 ? 'idle2' : 'idle1';
      },
      drawFighter(ctx, a) {
        const P = fighterPoses(a.sprite), m = a.move, img = P[this.poseOf(a)] || P.idle1;
        let rot = 0, lift = 0;
        if (a.st === 'atk' && m && m.lean && (!m.leap || a.y > 0) && a.t >= m.start) rot = m.lean;
        if (a.st === 'down') { rot = -Math.PI / 2; lift = 12; }
        const w = RW * FIGHT_SC, h = img.height * FIGHT_SC, cx = (ROX + 8) * FIGHT_SC;
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        if (a.st === 'thrown') {
          // flipped head over heels, spinning around his middle on the way over
          ctx.translate(Math.round(a.x), Math.round(FLOOR - a.y - h / 2));
          if (a.face < 0) ctx.scale(-1, 1);
          ctx.rotate(a.rot || 0);
          ctx.drawImage(img, -cx, -h / 2, w, h);
        } else {
          ctx.translate(Math.round(a.x), Math.round(FLOOR - a.y - lift));
          const spun = !!(a.st === 'atk' && m && m.spin && a.t < m.start && a.t > 2);
          if ((a.face < 0) !== spun) ctx.scale(-1, 1);
          if (rot) ctx.rotate(rot);
          ctx.drawImage(img, -cx, -h + FIGHT_SC, w, h);
        }
        ctx.restore();
        if (a.st === 'sleep') {
          const top = FLOOR - a.y - h;
          for (let k = 0; k < 3; k++) {
            const zt = (a.anim + k * 20) % 60;
            FT().draw(ctx, 'z', Math.round(a.x + 6 + zt / 4 + k * 3), Math.round(top + 6 - zt / 2), '#f8f8f0', { shadow: '#000' });
          }
        }
        if (a.raged && (a.anim >> 2) & 1 && a.st !== 'down') { ctx.fillStyle = '#f86858'; ctx.fillRect(Math.round(a.x - 2), Math.round(FLOOR - a.y - h + 4), 4, 2); }
        if (this.bubbleT > 0 && this.bubble && this.bubble.a === a) {
          const lines = FT().wrap(this.bubble.text, 110), bw = Math.max(...lines.map((l) => FT().width(l))) + 8, bh = lines.length * 9 + 4;
          const bx = Math.round(Math.max(4, Math.min(G.W - 4 - bw, a.x - bw / 2))), by = Math.round(Math.max(30, FLOOR - a.y - h - bh - 2));
          ctx.fillStyle = '#1c1424'; ctx.fillRect(bx - 1, by - 1, bw + 2, bh + 2);
          ctx.fillStyle = '#f8f8f0'; ctx.fillRect(bx, by, bw, bh);
          lines.forEach((l, k) => FT().draw(ctx, l, bx + 4, by + 3 + k * 9, '#1c1424'));
        }
      },
      drawHud(ctx) {
        const bar = (x, a, right) => {
          const w = 96, k = a.hp / a.maxHp, fw = Math.round(w * k);
          ctx.fillStyle = '#1c1424'; ctx.fillRect(x - 1, 4, w + 2, 9);
          ctx.fillStyle = '#7a1a1a'; ctx.fillRect(x, 5, w, 7);
          ctx.fillStyle = k > 0.3 ? '#f8d850' : '#f86858'; ctx.fillRect(right ? x + w - fw : x, 5, fw, 7);
          ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(right ? x + w - fw : x, 5, fw, 2);
        };
        bar(7, this.p, false); bar(137, this.e, true);
        FT().draw(ctx, 'DORON', 7, 15, '#f8f8f0', { shadow: '#000' });
        FT().draw(ctx, F.name, 233 - FT().width(F.name), 15, '#f8f8f0', { shadow: '#000' });
        for (let i = 0; i < this.wins[0]; i++) FT().draw(ctx, '★', 48 + i * 9, 15, '#f8d850', { shadow: '#000' });
        for (let i = 0; i < this.wins[1]; i++) FT().draw(ctx, '★', 233 - FT().width(F.name) - 12 - i * 9, 15, '#f8d850', { shadow: '#000' });
        const sec = G.sayable(Math.max(0, Math.ceil(this.timer / 60)));
        ctx.fillStyle = '#1c1424'; ctx.fillRect(106, 2, 28, 14);
        FT().draw(ctx, sec, 120 - Math.round(FT().width(sec) / 2), 5, this.timer < 600 ? '#f86858' : '#f8f8f0');
        if (this.comboT > 0 && this.combo >= 2) FT().draw(ctx, G.sayable(this.combo) + ' HITS!', 7, 26, '#f8d850', { shadow: '#000' });
        // the FIGHT meter, along the bottom
        const full = this.meter >= 100;
        FT().draw(ctx, 'FIGHT', 7, 147, full && (this.t >> 3) & 1 ? '#f8d850' : '#c8c0d8', { shadow: '#000' });
        ctx.fillStyle = '#1c1424'; ctx.fillRect(36, 148, 46, 7);
        ctx.fillStyle = full ? ((this.t >> 2) & 1 ? '#f8d850' : '#f86858') : '#f8a040'; ctx.fillRect(37, 149, Math.round(44 * this.meter / 100), 5);
        // (and what the buttons do, right there; full, C is the super)
        const keys = full ? 'C: GROUND AND POUND!' : 'Z punch X kick C grab V block';
        FT().draw(ctx, keys, G.W - 6 - FT().width(keys), 147, full ? ((this.t >> 3) & 1 ? '#f8d850' : '#f8f8f0') : '#9890a8', { shadow: '#000' });
        // pops: PARRY! COUNTER! COMBO! (they float up)
        this.pops.forEach((pp, k) => {
          const w = FT().width(pp.text);
          FT().draw(ctx, pp.text, Math.round(120 - w / 2), Math.round(46 + k * 10 - pp.t / 5), pp.col, { shadow: '#000' });
        });
        if (this.big) {
          const sc = this.big.length > 8 ? 2 : 3, w = FT().bigWidth(this.big, sc);
          FT().drawBig(ctx, this.big, Math.round(120 - w / 2), 54, sc, '#f8d850', '#7a1a2a');
        }
      },
      // VS: Doron slides in from the left, the other guy from the right
      drawVs(ctx) {
        const k = Math.min(1, this.t / 18), e = 1 - (1 - k) * (1 - k);
        ctx.fillStyle = '#5a1418'; ctx.fillRect(0, 0, G.W, G.H);
        ctx.fillStyle = '#14205a'; ctx.beginPath(); ctx.moveTo(136, 0); ctx.lineTo(G.W, 0); ctx.lineTo(G.W, G.H); ctx.lineTo(104, G.H); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#f8d850'; ctx.beginPath(); ctx.moveTo(133, 0); ctx.lineTo(139, 0); ctx.lineTo(107, G.H); ctx.lineTo(101, G.H); ctx.closePath(); ctx.fill();
        const D = fighterPoses('doron').idle1, O = fighterPoses(F.id).walkout;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(D, Math.round(-120 + e * 104), 140 - D.height * 5, D.width * 5, D.height * 5);
        ctx.save(); ctx.translate(Math.round(G.W + 120 - e * 104), 0); ctx.scale(-1, 1);
        ctx.drawImage(O, 0, 140 - O.height * 5, O.width * 5, O.height * 5);
        ctx.restore();
        if (this.t > 14) { const w = FT().bigWidth('VS', 4); FT().drawBig(ctx, 'VS', Math.round(120 - w / 2), 56, 4, '#f8d850', '#1c1424'); }
        FT().draw(ctx, 'DORON', 8, 146, '#f8f8f0', { shadow: '#000' });
        FT().draw(ctx, F.name, G.W - 8 - FT().width(F.name), 146, '#f8f8f0', { shadow: '#000' });
        // and what he has to say about it
        if (this.t > 24) {
          const lines = FT().wrap(F.intro, 120), bw = Math.max(...lines.map((l) => FT().width(l))) + 8, bh = lines.length * 9 + 4, bx = G.W - 6 - bw;
          ctx.fillStyle = '#1c1424'; ctx.fillRect(bx - 1, 5, bw + 2, bh + 2);
          ctx.fillStyle = '#f8f8f0'; ctx.fillRect(bx, 6, bw, bh);
          lines.forEach((l, k2) => FT().draw(ctx, l, bx + 4, 9 + k2 * 9, '#1c1424'));
        }
      },
    };
  }


  // The locker room door at the back of the Expo Hall: before El EEENGLISH, wrestlers only. After,
  // it's open: walk in (G.MAPS.locker), and the fight card on the wall is Doron's fight night.
  S.lockerRoom = function* () {
    if (!flags().dadBeaten) {
      yield G.say(null, 'LOCKER ROOM. {r}Wrestlers only.{/}');
      yield G.say(null, 'You can hear someone inside doing very loud push-ups.');
      return;
    }
    G.audio.sfx('door');
    G.play.warp('locker', 8, 8, 'up');
  };
  // walking in the first time (Doron's lines, if he's along; none of the fighters by name, so
  // nothing's spoiled)
  S.lockerEnter = function* () {
    const f = flags();
    if (f.fightMet) return;
    yield G.wait(20);
    if (!(yield* S.callIn('doron', 'Is that... a LOCKER ROOM?'))) {
      yield G.say('Nate', 'A real wrestlers\' locker room. Doron would LOVE this.');
      return;
    }
    f.fightMet = true;
    yield G.say(null, 'Lockers, a long bench, a heavy bag, wrestlers taping up their wrists... and some VERY familiar faces warming up in the back.');
    yield G.say('Doron', 'Nate. NATE. Those are UFC fighters. In the Micro Mayhem locker room. In EASTON.');
    yield G.say('Doron', 'I\'ve watched every one of their fights. I\'ve been training for this my whole life.');
    yield G.say('Nate', 'Training how?');
    yield G.say('Doron', 'Mostly by watching them. And the Army. Hold my hat.');
    yield G.say('Nate', 'You\'re not wearing a hat.');
    yield G.say('Doron', 'Then hold the water bottle. You\'re in my corner. The fight card\'s on the wall.');
  };
  // the fight card: Doron's fight night
  S.fightCard = function* () {
    const f = flags(), s = G.state;
    if (!(yield* S.callIn('doron', 'Is my name on that card?'))) {
      yield G.say(null, 'The fight card. Somebody wrote DORON at the top in Sharpie.');
      yield G.say('Nate', 'Doron has to be here for this.');
      return;
    }
    if (!f.fightMet) yield* S.lockerEnter();
    else yield G.say('Doron', 'Back for more? Let\'s GO.');
    const FS = fightState();
    let losses = 0;
    for (;;) {
      const F = yield fightSelectCmd();
      if (!F) { G.play.overlay = null; yield G.say('Doron', 'Good session. Same time next week.'); return; }
      if (!f.fightHow) { f.fightHow = true; yield howToCmd('DORON\'S FIGHT NIGHT', HOW_TO.fight); }
      const r = yield fightCmd(F);
      G.play.overlay = null;
      if (r === 'quit') { yield G.say('Doron', 'Tapping out? ...Fine. We\'ll run it back.'); continue; }
      if (!r.won) {
        if (F.id === 'nani') yield G.say('Nani', ['Oh, honey. Did you eat today?', 'Nani loves you. Nani is also undefeated.', 'Get up, sweetheart. Again.'][losses++ % 3]);
        else yield G.say('Doron', ['He got lucky. Run it back.', 'I was feeling him out. NOW I\'m ready.', 'That didn\'t count. Nobody saw that.'][losses++ % 3]);
        continue;
      }
      const first = !FS[F.id], i = FIGHTERS.indexOf(F);
      FS[F.id] = true;
      yield G.say('Doron', F.win);
      if (F.id === 'jones' && first) {
        // the belt...
        if (!s.items.belt) {
          yield G.say(null, 'The wrestlers carry out a gold belt with a plate the size of a dinner plate.');
          yield G.say('Doron', 'Nate. NATE. I\'m the Micro Mayhem CHAMPION.');
          s.items.belt = true;
          yield G.itemGet(G.spr.beltIcon, 'You got the {y}Micro Mayhem Title Belt{/}! Doron says champions have people who carry the belt. You\'re the people.');
          yield G.say('Doron', 'I\'m wearing this to Thanksgiving.');
        }
        // ...and then the secret final boss
        yield G.say(null, 'The lights flicker. The locker room goes quiet. Someone is standing in the doorway in a knit sweater.');
        yield G.say('Doron', '...Nani?');
        yield G.say('Nani', 'Doron. Sweetheart. Put the belt down.');
        yield G.say('Nani', 'Nani has been watching. Nani has some notes.');
        yield G.say(null, '{r}A SECRET CHALLENGER APPROACHES!{/}');
      } else if (F.id === 'nani' && first) {
        yield G.say('Nani', 'Good boy. Now go eat something. You look thin.');
        yield G.say('Doron', 'Yes, Nani.');
        // ...and she was the BMF the whole time
        if (!s.items.bmf) {
          yield G.say(null, 'Nani reaches under her sweater and unbuckles a silver belt. It says BMF on the front.');
          yield G.say('Doron', 'NANI was the BMF?!');
          yield G.say('Nani', 'Since before you were born, sweetheart. It\'s yours now. Don\'t you DARE say what it stands for in my house.');
          s.items.bmf = true;
          yield G.itemGet(G.spr.bmfIcon, 'You got the {y}BMF Belt{/}! Doron is wearing it over the other belt. Two belts. TWO BELTS.');
          yield G.say('Doron', 'Nate. NATE. Two belts.');
        }
      } else if (first && i < FIGHTERS.length - 2) yield G.say(null, '{y}A new challenger!{/} ' + FIGHTERS[i + 1].full + ' wants a piece of Doron.');
      if (first) G.play.autosave();
    }
  };

  // The Expo Hall locker room (through the door at the back of the Expo Hall, once El EEENGLISH is
  // beaten): lockers along the back wall, the fight card, a heavy bag, two long benches, a blue mat
  // in the middle, and a couple of Micro Mayhem wrestlers getting ready.
  G.MAPS.locker = {
    name: 'Locker Room',
    music: 'arena',
    tiles: [
      'wwwwwwwwwwwwwwww',
      'wvvvvvvvvvvvvvvw',
      'wCCCCCCCCCCCCCCw',
      'wCCCnnnnnnnnCCCw',
      'wCCCnnnnnnnnCCCw',
      'wCCCnnnnnnnnCCCw',
      'wCCCnnnnnnnnCCCw',
      'wCCCCCCCCCCCCCCw',
      'wCCCCCCCCCCCCCCw',
      'wwwwwwwwxxwwwwww',
    ],
    setup(w) {
      const F = furnish(w), sp = G.spr;
      F.stand(sp.lockerBank, 1, 2, 3, look('Lockers. One has a sticky note on it: "Do NOT touch the protein powder."'), { dy: -2 });
      F.stand(sp.lockerBank, 12, 2, 3, look('More lockers. Somebody\'s luchador mask is hanging off a door to dry.'), { dy: -2 });
      F.hang(sp.fightCard, 7, 1, 2, () => S.fightCard(), 4);
      F.stand(sp.heavyBag, 4, 2, 1, look('A heavy bag. Nate gives it a little punch. It does not move. His hand does.'));
      F.stand(sp.lockerBench, 1, 7, 2, look('A long bench. It smells like tape and determination.'));
      F.stand(sp.lockerBench, 13, 7, 2, look('Another bench, with a pile of hand wraps on it.'));
      w.add(new G.NPC({ sprite: 'wrestler_gold', name: 'Wrestler', x: 11 * 16 + 8, y: 3 * 16 + 14, dir: 'down', talk: look(['Wrestler', '...ninety-eight... ninety-nine... ONE HUNDRED.'], ['Wrestler', '...One. Two...']) }));
      w.add(new G.NPC({ sprite: 'wrestler_blue', name: 'Wrestler', x: 2 * 16 + 8, y: 5 * 16 + 14, dir: 'right', talk: look(['Wrestler', 'Taping up for the late show. Your brother keeps staring at the fight card.']) }));
      w.addWarp(8, 9, 2, 1, 'arena', 11, 2, 'down');
    },
    onEnter() { return S.lockerEnter(); },
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
      // where the brook widens into a pool, with a little island of red shale in the middle
      fill(4, 1, 8, 5, '~'); fill(7, 2, 2, 2, ',');
      // woods along both banks (the conservation easement)
      for (let x = 0; x < W - 1; x += 2) {
        if (x >= 44 && x <= 54) continue;
        const c = brook(x);
        if (c >= 4) set(x, c - 3, 'T');
        if ((x % 4 === 0 || x > 18) && (x < 3 || x > 12)) set(x, c + 3, 'T');
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
      w.addBuilding({ x: 35, y: 30, w: 7, h: 4, door: 3, style: 'shake', wall: '#2f4a3e', roof: '#4a4c56', garageDoors: 3, cupola: true, weathervane: true, to: { map: 'garage', x: 10, y: 11 } });
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
      // Daisy's house (where the greenhouse used to be), and Daisy, hopping around his pen
      w.addProp({ img: G.spr.bunnyHouse, tx: 36, ty: 16, h: 2, solid: [36, 16, 3, 2], hit: [36, 16, 3, 2], talk: S.daisyHouse });
      w.props.push({
        base: 18 * 16, hit: null,
        draw(ctx, cx, cy) {
          // sits a while, then hops; back and forth across the front of the pen
          const PER = 80, ph = Math.floor(G.tick / PER), t = G.tick % PER, spots = [0, 4, 8, 11, 8, 4];
          const from = spots[ph % spots.length], to = spots[(ph + 1) % spots.length], k = t < 56 ? 0 : (t - 56) / 24;
          const x = 36 * 16 + 22 + from + (to - from) * k, z = Math.sin(k * Math.PI) * 4, left = to < from;
          const img = G.spr.daisy[(k > 0 && k < 1 ? 'hop' : 'sit') + (left ? 'L' : '')];
          ctx.drawImage(img, Math.round(x) - cx, Math.round(16 * 16 + 11 - z) - cy);
        },
      });
      w.addProp({ img: G.spr.mailbox, tx: 46, ty: 51, dx: 2, solid: [46, 51, 1, 1], hit: [46, 51, 1, 1], talk: S.homeMailbox });
      w.addProp({ img: G.spr.streetSign, tx: 40, ty: 51, solid: [40, 51, 1, 1], hit: [40, 51, 1, 1], talk: S.homeStreetSign });
      for (const x of [42, 45]) w.addProp({ img: G.spr.gatePost, tx: x, ty: 52, dx: 1, solid: [x, 52, 1, 1], hit: [x, 52, 1, 1], talk: S.homeGatepost });
      w.addTree(16, 19, 'pine');
      w.addTree(46, 23, 'pine');
      w.add(new G.Sign(53, 12, 'BRADY BROOK.'));
      // a red shale ledge out on the island in the brook pool, a basalt boulder by the brook, a gravel bar to sift
      w.add(new G.OreVein(8 * 16, 2 * 16 + 14, 'bed'));
      // (Nate only remarks on it once the main story at home is done; it's there for explorers before that)
      w.addTrigger(4, 6, 8, 1, () => { if (!flags().poolHint && flags().mikeyBeaten) G.script.run(S.poolHint()); });
      w.add(new G.BigRock(45 * 16, 11 * 16 + 12, 'basalt', (r) => G.script.run(S.bigRockLift(r))));
      w.addProp({ img: G.spr.gravelBar, tx: 47, ty: 9, dx: 2, dy: -1, flat: true, hit: [47, 9, 2, 1], talk: S.brookSift });

      // critters around the property: snapdragons, birdhouse gourds, and the bear by the brook
      const at = (Kind, x, y) => w.add(new Kind(x * 16 + 8, y * 16 + 14));
      for (const [x, y] of [[47, 44], [22, 47], [20, 41], [33, 45], [10, 45]]) at(G.Snapdragon, x, y); // (none in Mom's garden)
      for (const [x, y] of [[6, 33], [27, 42], [51, 38], [50, 46]]) at(G.Gourd, x, y);
      const bear = at(G.Bear, 12, 14);
      if (flags().snackQuest && !G.state.items.doritos && !flags().snacksDone) bear.bag = true;

      // the hens, free-ranging inside the garden fence
      const pen = [27 * 16 + 6, 19 * 16 + 4, 40 * 16 - 6, 23 * 16 - 2];
      [[30, 20, 'white'], [33, 20, 'brown'], [36, 20, 'white'], [34, 22, 'brown'], [30, 22, 'white']]
        .forEach(([x, y, c]) => w.add(new G.Chicken(x * 16 + 8, y * 16 + 12, c, pen)));

      // Mom: watering the dahlias, or running her flower stand once her books are back
      if (flags().shopOpen) {
        w.addProp({ img: G.spr.flowerStand, tx: 35, ty: 25, solid: [35, 25, 3, 1], hit: [35, 25, 3, 1], talk: S.michelleShop });
        w.michelle = w.add(new G.NPC({ sprite: 'michelle', name: 'Michelle', x: 34 * 16 + 4, y: 25 * 16 + 14, dir: 'down', talk: S.michelleShop }));
      } else {
        w.michelle = w.add(new G.NPC({ sprite: 'michelle', name: 'Michelle', x: 33 * 16 + 8, y: 20 * 16 + 14, dir: 'left', talk: S.michelle }));
        w.michelle.held = G.spr.wateringCan;
        if (!flags().michelleMet) w.addTrigger(32, 21, 4, 2, () => { if (!flags().michelleMet) G.script.run(S.michelleStartle()); });
      }

      // leaving: either end of the road asks where to; north past the bridge is a dead end for now
      w.addTrigger(0, 53, 1, 2, () => G.script.run(S.homeLeave('west')));
      w.addTrigger(59, 53, 1, 2, () => G.script.run(S.homeLeave('east')));
      // north past the bridge (Ice JJ's pond) opens once Lily and Mikey are sorted out
      w.addTrigger(51, 0, 2, 1, () => {
        if (flags().mikeyBeaten || flags().jjSeen) G.play.warp('north', 10, 13, 'up');
        else G.script.run(S.northNotYet());
      });

      // Mikey, waiting at the start of the driveway with flowers and heart balloons.
      // Once Lily is out of the fridge, walking by him starts his serenade.
      if (!flags().mikeyBeaten) {
        const mikey = w.add(new G.NPC({ sprite: 'mikey', name: 'Mikey', x: 41 * 16 + 8, y: 50 * 16 + 14, dir: 'down', talk: S.mikey, balloons: true }));
        mikey.held = G.spr.bouquet; mikey.heldAt = [-7, 3];
        w.mikey = mikey;
        if (!flags().lilySaved) w.addTrigger(38, 50, 10, 5, () => { if (!flags().mikeyMet) G.script.run(S.mikeyIntro()); });
        else w.addTrigger(35, 46, 15, 9, () => G.script.run(S.mikeyGoldenHour()));
      }
    },
    // "I Pray to Jesus" on the pipe, beamed at the pool: it freezes over (for this visit)
    onIcy(w, p, beam) {
      if (w.poolFrozen || !G.overlap(beam, [4 * 16, 1 * 16, 12 * 16, 6 * 16])) return false;
      w.poolFrozen = true;
      for (let y = 1; y <= 5; y++) for (let x = 4; x <= 11; x++) if (w.tileAt(x, y) === '~') w.setTile(x, y, 'I');
      w.burst(8 * 16, 3 * 16, ['#ffffff', '#d8f4ff', '#a8e0ff'], 24, { speed: 1.8, life: 34, size: 2 });
      w.pop(8 * 16, 2 * 16, 'THE POOL FROZE!', '#a8e0ff');
      return true;
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
        yield G.say('Nate', 'Smells like woodsmoke and chickens. Feels like home.');
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

  // Van Wickle Hall inside: a tiled main hall with oak wainscot, stained glass from
  // the library days, mineral cases and the cross-section rock wall; the rock prep
  // lab (jaw crusher, rock saw) up on the left, the mineralogy lab on the right.
  G.MAPS.geology = {
    name: 'Van Wickle Hall',
    music: 'house',
    tiles() {
      const W = 22, H = 14;
      const g = Array.from({ length: H }, () => Array(W).fill('w'));
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) g[y + j][x + i] = c; };
      fill(1, 1, 9, 2, 'N'); fill(1, 3, 9, 3, 'C');      // rock prep lab
      fill(12, 1, 9, 2, 'V'); fill(12, 3, 9, 3, 'E');    // mineralogy lab
      fill(1, 6, 20, 2, 'V'); fill(1, 8, 20, 5, 'E');    // the main hall
      fill(5, 6, 1, 2, 'C'); fill(16, 6, 1, 2, 'E');     // doorways up into the labs
      fill(10, 13, 2, 1, 'x');                           // the front doors
      return g.map((r) => r.join(''));
    },
    setup(w) {
      const F = furnish(w), sp = G.spr;
      // ---- main hall
      for (const x of [4, 9, 12]) F.hang(sp.stainedGlass, x, 7, 1, look('Stained glass from when Van Wickle was the college library, back in 1900.', 'Now it lights up rocks instead of books.'), 4);
      F.stand(sp.mineralCases.quartz, 2, 8, 2, () => S.vwCase('quartz')());
      F.stand(sp.mineralCases.garnet, 6, 8, 2, () => S.vwCase('garnet')());
      F.stand(sp.rockWall, 8, 8, 6, () => S.vwRockWall());
      F.stand(sp.mineralCases.fluor, 14, 8, 2, () => S.vwCase('fluor')());
      F.stand(sp.mineralCases.fossil, 17, 8, 2, () => S.vwCase('fossil')());
      F.stand(sp.mineralCases.pyrite, 19, 8, 2, () => S.vwCase('pyrite')());
      F.stand(sp.meteorite, 3, 11, 1, look('A meteorite under a glass dome. An actual rock from outer space.', ['Nate', 'I am not allowed to touch it. I think about touching it every day.']));
      w.add(new G.NPC({ sprite: 'carley', name: 'Prof. Carley', x: 14 * 16 + 8, y: 11 * 16 + 14, dir: 'down', talk: S.carley }));
      w.add(new G.Sign(18, 11, ['GEOLOGY & ENVIRONMENTAL GEOSCIENCES', '"Every rock has a story." Exhibits open weekdays. Please do not lick the minerals.']));
      // ---- rock prep lab
      w.crusherProp = F.stand(sp.jawCrusher, 2, 3, 2, () => S.crusher());
      F.stand(sp.rockSaw, 6, 3, 2, look('A diamond-blade rock saw in a tray of water. It cuts the paper-thin slices for microscope slides.', ['Nate', 'It makes a noise I find very soothing.']));
      F.stand(sp.buckets, 8, 3, 1, look('Buckets of field samples labeled in Sharpie: GUNKS, CATSKILL, JACKSONBURG, and "DO NOT CRUSH (YET)".'));
      // ---- mineralogy lab
      F.hang(sp.chalkboardGeo, 13, 2, 3, look('A chalkboard covered in crystal systems: cubic, tetragonal, hexagonal... and a tiny doodle of a rock with a face.'), 4);
      F.stand(sp.microscopeBench, 12, 4, 3, look('Petrographic microscopes. Put a thin slice of rock under polarized light and it glows like stained glass.'));
      F.stand(sp.microscopeBench, 16, 4, 3, look('More microscopes. Somebody left a thin section of granite on the stage. It looks like a kaleidoscope.'));
      F.stand(sp.conglomerate, 20, 3, 1, look('A plain gray rock at the back of the classroom: a conglomerate made of pieces of an even older conglomerate.', 'A rock full of other rocks\' stories. The professors call it one of the most prized things in the building.', ['Nate', 'It doesn\'t look like much. That\'s what makes it great.']));
      // ---- out the front doors
      w.addTrigger(10, 13, 2, 1, () => G.play.warp('campus', 27, 21, 'down'));
    },
    onEnter() {
      return (function* () {
        if (flags().vanWickle) return;
        flags().vanWickle = true;
        yield G.wait(20);
        yield G.say('Nate', 'Van Wickle Hall. The geology building. My favorite place on campus.');
        yield G.say('Nate', 'It used to be the college library. Now it\'s a library of ROCKS.');
      })();
    },
  };

  // The Andover iron mines, outside: the long open cut (about 300 yards long in
  // real life), mine dumps, the ruins of the old furnace and its slag, and the
  // tunnel mouth at the north end of the cut.
  G.MAPS.andover = {
    name: 'Andover Mines',
    music: 'field',
    tiles() {
      const W = 30, H = 20;
      const g = Array.from({ length: H }, () => Array(W).fill('.'));
      const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < W && y < H) g[y][x] = c; };
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) set(x + i, y + j, c); };
      for (let i = 0; i < 40; i++) set(Math.floor(G.hash(i, 51) * W), Math.floor(G.hash(i, 52) * H), ',');
      // the open cut: rock walls along the north side, rubble floor
      fill(3, 3, 22, 2, '%'); fill(3, 5, 22, 5, 'Z');
      set(6, 4, '@');                               // the tunnel mouth
      // the dumps below the cut
      fill(5, 10, 12, 3, 'Z');
      // a dirt track from the parking spot up to the cut
      fill(17, 10, 2, 4, '='); fill(17, 14, 11, 2, '=');
      fill(24, 12, 4, 2, 'g');                      // pull-off by the road
      // woods all around (a gap on the east for the road out)
      for (let x = 0; x < W; x += 2) { set(x, 0, 'T'); set(x, 18, 'T'); }
      for (let y = 2; y < 18; y += 2) { set(0, y, 'T'); if (y !== 14) set(28, y, 'T'); }
      [[2, 12], [26, 4], [22, 16], [12, 16]].forEach(([x, y]) => set(x, y, 'T'));
      return g.map((r) => r.join(''));
    },
    setup(w) {
      w.addProp({ img: G.spr.adit, tx: 5, ty: 4, dx: 2, base: 4 * 16, flat: true });
      w.addTrigger(6, 4, 1, 1, () => G.play.warp('andoverMine', 13, 20, 'up'));
      w.addProp({ img: G.spr.furnaceRuin, tx: 19, ty: 16, dx: -2, solid: [19, 16, 2, 1], hit: [19, 16, 2, 1], talk: look('The ruins of the old Andover iron furnace, first fired in the 1760s.', 'During the Revolution, the Continental Congress took it over and made cannonballs and steel for the army here.') });
      w.addProp({ img: G.spr.suv, tx: 24, ty: 11, h: 3, dx: 3, solid: [24, 12, 2, 2], hit: [24, 12, 2, 2], talk: S.andoverCar });
      w.add(new G.Sign(21, 12, ['ANDOVER IRON MINE', 'The biggest hematite deposit in New Jersey. Worked before the Revolution, seized by the Continental Congress, reopened 1848, closed 1880.']));
      w.add(new G.Sign(26, 15, ['PRIVATE PROPERTY', '(Nate has a key. The tag says "FOR THE ROCK BOY.")']));
      const at = (x, y, zone) => { const v = w.add(new G.OreVein(x * 16 + 8, y * 16 + 14, zone)); return v; };
      for (const [x, y] of [[9, 6], [13, 7], [16, 6], [20, 8], [22, 6], [6, 11], [10, 12], [14, 11]]) at(x, y, 'dump');
      for (const [x, y] of [[17, 17], [21, 17], [16, 16]]) at(x, y, 'slag');
    },
    onEnter() {
      return (function* () {
        if (flags().andover) return;
        flags().andover = true;
        yield G.wait(20);
        yield G.say('Nate', 'The Andover mines. Iron ore from before the Revolution. I have SO many books about this place.');
        if (G.with('doron')) yield G.say('Doron', 'You dragged me to a hole in the ground.');
        else if (G.with('lily')) yield G.say('Lily', 'If there are bats, I\'m going back to the car.');
        yield G.say(null, 'Smash the {y}dump piles{/} and {y}mineral veins{/} with your hammer to collect rocks. The good stuff is deep in the tunnels.');
        yield G.say(null, 'Crush them at the {y}rock crusher{/} in Van Wickle Hall, and see your collection in the {y}ROCKS{/} menu.');
      })();
    },
  };

  // Inside the Andover workings: dark drifts lit only by Nate's lantern, glinting
  // veins, bats, and the lower workings where the zinc, lead and copper sulfides are.
  G.MAPS.andoverMine = {
    name: 'Andover Mines: the Tunnels',
    music: 'mine',
    tiles() {
      const W = 28, H = 22;
      const g = Array.from({ length: H }, () => Array(W).fill('w'));
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) g[y + j][x + i] = c; };
      fill(13, 3, 2, 19, '@'); fill(13, 3, 1, 19, '|');   // the main drift, with rails
      fill(3, 16, 10, 2, '@'); fill(2, 12, 6, 6, '@');      // west drift and stope
      fill(15, 11, 11, 2, '@'); fill(20, 13, 7, 6, '@');    // east drift and stope
      fill(4, 3, 9, 2, '@'); fill(15, 3, 12, 2, '@');       // the north crosscut
      fill(26, 5, 1, 4, '@');                               // a narrow dead end
      fill(4, 5, 2, 1, '@'); fill(3, 6, 7, 5, '@');         // the lower workings
      if (flags().fcAwake) fill(27, 15, 1, 2, '@');         // (100%) the way to the deep stope
      // rock faces wherever a passage runs below solid rock
      for (let y = 0; y < H - 1; y++) for (let x = 0; x < W; x++) if (g[y][x] === 'w' && g[y + 1][x] !== 'w' && g[y + 1][x] !== '&') g[y][x] = '&';
      return g.map((r) => r.join(''));
    },
    setup(w) {
      const at = (x, y, zone) => {
        const v = w.add(new G.OreVein(x * 16 + 8, y * 16 + 14, zone));
        v.glowColor = zone === 'deep' ? '#a8c8ff' : zone === 'cannon' ? '#f8d850' : '#f8e8a0';
      };
      for (const [x, y] of [[2, 12], [6, 13], [3, 15], [21, 13], [25, 14], [23, 17], [20, 18], [24, 11], [9, 3], [18, 3], [22, 4]]) at(x, y, 'tunnel');
      for (const [x, y] of [[3, 6], [8, 6], [4, 9], [9, 9], [6, 8]]) at(x, y, 'deep');
      if (!flags().cannonball) {
        at(26, 8, 'cannon');
      }
      w.add(new G.Sign(6, 5, ['THE LOWER WORKINGS', '"Zinc and lead sulfides occur mixed with iron ores in the lower workings." - U.S. Bureau of Mines, 1947']));
      for (const [x, y] of [[8, 16], [22, 15], [5, 7], [19, 3]]) w.add(new G.Bat(x * 16 + 8, y * 16 + 14));
      if (flags().fcAwake) w.addTrigger(27, 15, 1, 2, () => G.play.warp('andoverDeep', 1, 8, 'right'));
      w.addTrigger(13, 21, 2, 1, () => G.play.warp('andover', 6, 5, 'down'));
    },
    // Nate's lantern: everything past its glow is pitch black
    tint(ctx) {
      const p = G.play.player, cam = G.play.cam;
      if (!p) return;
      const x = Math.round(p.x - cam.x), y = Math.round(p.y - 10 - cam.y), r = 64 + Math.sin(G.tick * 0.13) * 2;
      const grad = ctx.createRadialGradient(x, y, r * 0.3, x, y, r);
      grad.addColorStop(0, 'rgba(10,6,4,0)');
      grad.addColorStop(1, 'rgba(10,6,4,0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, G.W, G.H);
      ctx.fillStyle = 'rgba(255,160,60,0.05)';
      ctx.fillRect(0, 0, G.W, G.H);
    },
    onEnter() {
      return (function* () {
        const f = flags();
        if (f.fcAwake && !f.fcBeaten && !f.fcPassage) {
          f.fcPassage = true;
          yield G.wait(20);
          yield G.say(null, 'The tunnels are humming. Way off to the {r}east{/}, past the east stope, a cave-in has shaken loose. Cold air is blowing out of a new passage.');
          if (G.with('lily')) yield G.say('Lily', 'I said I was never coming to Andover. Why am I in Andover?');
        }
        if (f.andoverMine) return;
        f.andoverMine = true;
        yield G.wait(20);
        yield G.say('Nate', 'Lantern on. The old workings run a couple hundred feet into the hill.');
        yield G.say(null, 'Watch for {y}glints{/} in the dark: those are mineral veins. The {c}lower workings{/} up north are where the rare stuff is.');
      })();
    },
  };

  // The deep stope: a big, timbered chamber at the very bottom of the old
  // workings, sealed by a cave-in until the 100% rumbling shook it loose.
  // Lanterns on the timbers, a mine cart on a spur, and one cardboard box.
  const STOPE_LANTERNS = [[5 * 16, 3 * 16 + 2], [11 * 16 + 8, 3 * 16 + 2], [18 * 16, 3 * 16 + 2], [5 * 16, 13 * 16 + 6], [18 * 16, 13 * 16 + 6]];
  let stopeDark = null;
  G.MAPS.andoverDeep = {
    name: 'Andover Mines: the Deep Stope',
    get music() { const f = flags(); return f.fcAwake && !f.fcBeaten ? null : 'mine'; },
    tiles() {
      const W = 24, H = 16;
      const g = Array.from({ length: H }, () => Array(W).fill('w'));
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) g[y + j][x + i] = c; };
      fill(2, 3, 20, 11, '@');                 // the stope
      fill(0, 8, 2, 2, '@');                   // the passage back up
      fill(2, 12, 6, 1, '|');                  // a rail spur
      for (let y = 0; y < H - 1; y++) for (let x = 0; x < W; x++) if (g[y][x] === 'w' && g[y + 1][x] !== 'w' && g[y + 1][x] !== '&') g[y][x] = '&';
      return g.map((r) => r.join(''));
    },
    setup(w) {
      const f = flags();
      // timber sets along the walls, each with a lantern
      for (const [lx, ly] of STOPE_LANTERNS) {
        const top = ly < 8 * 16;
        w.props.push({
          base: top ? 2 * 16 : 14 * 16 + 10,
          draw(ctx, cx, cy) {
            ctx.drawImage(G.spr.timberSet, Math.round(lx - 17) - cx, Math.round(ly - (top ? 26 : 30)) - cy);
            const fl = (G.tick >> 3) % 5 === 0 ? 1 : 0;
            ctx.drawImage(G.spr.mineLantern, Math.round(lx - 3) - cx, Math.round(ly - (top ? 10 : 14) + fl) - cy);
            w.glows.push({ x: Math.round(lx), y: Math.round(ly - (top ? 5 : 9)), color: '#f8c060' });
          },
        });
      }
      w.addProp({ img: G.spr.mineCart, tx: 3, ty: 12, dx: 6, dy: 2, solid: [3, 12, 2, 1], hit: [3, 12, 2, 1], talk: look('An old ore cart, rusted to the rails. Doron says it\'s a "tactical position."') });
      for (const [x, y, slag] of [[20, 4, false], [2, 4, true], [21, 12, false]]) w.addProp({ img: slag ? G.spr.slagPile : G.spr.dumpPile, tx: x, ty: y, dx: -2, solid: [x, y, 1, 1] });
      // the box (while he's awake), or what's left of it
      if (f.fcAwake && !f.fcBeaten) {
        const box = w.addProp({ img: G.spr.fcCrate, tx: 11, ty: 4, dx: -1, solid: [11, 4, 2, 1], hit: [11, 4, 2, 1], talk: S.fcBox });
        w.fcBox = box; box.bx = box.x;
      } else if (f.fcBeaten) {
        w.addProp({ img: G.spr.fcCrateOpen, tx: 11, ty: 4, dx: -1, solid: [11, 4, 2, 1], hit: [11, 4, 2, 1], talk: look('The DO NOT OPEN (LILY) box, empty. Somebody opened it. It was Nate.') });
      }
      w.add(new G.Sign(2, 7, ['THE DEEP STOPE', 'Worked out before the Revolution. Then sealed. Then, apparently, used for storage.']));
      w.addTrigger(0, 8, 1, 2, () => { if (!w.fcFight) G.play.warp('andoverMine', 26, 15, 'left'); });
    },
    // the box rattles and hums now and then
    tick(w) {
      const b = w.fcBox;
      if (!b) return;
      b.x = b.bx + (b.still || G.script.busy ? 0 : [0, 1, 0, -1][(G.tick >> 2) & 3] * ((G.tick % 150) < 50 ? 1 : 0));
      if (!b.still && !G.script.busy && G.tick % 220 === 0) w.pop(b.bx + 9, 4 * 16 - 8, ['ho...', 'ho... ho...', '*thump*', 'hmm hmm hmm...'][Math.floor(Math.random() * 4)], '#f86858');
    },
    // lantern light: dark everywhere except around the lanterns, Nate and him
    tint(ctx) {
      const w = G.play.world, p = G.play.player, cam = G.play.cam;
      if (!stopeDark) { stopeDark = document.createElement('canvas'); stopeDark.width = G.W; stopeDark.height = G.H; }
      const d = stopeDark.getContext('2d');
      d.globalCompositeOperation = 'source-over';
      d.clearRect(0, 0, G.W, G.H);
      d.fillStyle = 'rgba(10,6,8,0.86)';
      d.fillRect(0, 0, G.W, G.H);
      d.globalCompositeOperation = 'destination-out';
      const hole = (x, y, r) => {
        const g = d.createRadialGradient(x, y, r * 0.25, x, y, r);
        g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
        d.fillStyle = g; d.fillRect(x - r, y - r, r * 2, r * 2);
      };
      const fl = Math.sin(G.tick * 0.13) * 2;
      for (const [lx, ly] of STOPE_LANTERNS) hole(lx - cam.x, ly - cam.y + 10, 84 + fl);
      if (p) hole(p.x - cam.x, p.y - 10 - cam.y, 60 + fl);
      if (w.fc && !w.fc.dead) hole(w.fc.x - cam.x, w.fc.y - 20 - cam.y, 44);
      ctx.drawImage(stopeDark, 0, 0);
      ctx.fillStyle = 'rgba(255,160,60,0.05)';
      ctx.fillRect(0, 0, G.W, G.H);
      if (w.fcFight) {
        const rage = w.fc && w.fc.rage;
        ctx.fillStyle = rage ? 'rgba(90,0,14,' + (0.22 + Math.sin(G.tick * 0.2) * 0.06) + ')' : 'rgba(30,10,40,0.18)';
        ctx.fillRect(0, 0, G.W, G.H);
      }
    },
    onEnter() {
      return (function* () {
        const f = flags();
        if (!f.fcAwake || f.fcBeaten || f.fcMet) return;
        yield G.wait(30);
        yield G.say('Nate', 'The deep stope. The books say this part was sealed off before the Revolution.');
        yield G.say(null, 'At the back of the chamber, something goes {r}thump{/}.');
        if (G.with('lily')) yield G.say('Lily', 'Nope. No. I am going to stand right here by the tunnel.');
      })();
    },
  };

  // ================================================================ THE CHESAPEAKE BAY BRIDGE-TUNNEL
  // 17.6 miles shore to shore across the mouth of the bay: low trestles, two
  // mile-long tunnels under the shipping channels, and four man-made islands
  // (about five acres each) where the road dives underground. Gulls sit on
  // every light pole. A hooded figure waits at the far end of the tunnel.
  const TOLL = 500;
  S.cbbtArrive = function* () {
    const f = flags(), w = G.play.world;
    if (f.cbbtArrived) return;
    f.cbbtArrived = true;
    yield G.wait(30);
    yield G.say('Nate', 'The Chesapeake Bay Bridge-Tunnel. Seventeen-point-six miles across the mouth of the bay, shore to shore.');
    if (G.with('doron')) {
      yield G.say('Doron', 'Why does a bridge turn into a tunnel?');
      yield G.say('Nate', 'Ships. Huge ones, headed into the bay. A bridge would be in their way, so the road dives under the channels. Twice.');
    } else if (G.with('lily')) {
      yield G.say('Lily', 'Why does the bridge turn into a tunnel?');
      yield G.say('Nate', 'So the ships can get by. The road dives under the shipping channels. Twice.');
      yield G.say('Lily', 'I do not like that.');
    } else {
      yield G.say('Nate', 'Two tunnels under the shipping channels, so the ships can get by. Four man-made islands. This is one of them.');
    }
    const g = w.ents.find((e) => e instanceof G.Seagull);
    if (g) {
      yield G.camFocus(g.x, g.y - g.z, 40);
      yield G.say(null, 'There is a seagull on every light. Every single one of them is looking at Nate.');
      yield G.camFocus(null, null, 30);
    }
    yield G.say('Nate', 'Two tunnels and a whole lot of bridge between here and Chesapeake. Let\'s go.');
  };
  S.cbbtCar = function* () {
    const c = yield G.ask('Nate', 'Head home?', ['Head home', 'Keep going']);
    if (c === 0) G.play.warp('home', 1, 53, 'right');
  };
  S.cbbtTrestleEnd = function* () {
    const p = P();
    yield G.say('Nate', 'That\'s miles of trestle back to the Eastern Shore. If I\'m going home, I\'m taking the car.');
    yield G.walkTo(p, p.x, p.y - 24, 1);
  };
  S.bayViewer = function* () {
    yield G.say(null, 'A coin-op viewer. Nate puts in a quarter.');
    yield G.say(null, 'East: the open Atlantic. West: the bay, all the way to the horizon. A cargo ship lining up for the channel.');
    yield G.say(null, 'And seagulls. So, so many seagulls.');
  };

  // Before Golden Hour the path north waits: one thing at a time at home.
  S.northNotYet = function* () {
    const f = flags(), p = P();
    if (!f.badlandsMet) yield G.say('Nate', 'Is that... snow? Past the bridge? In July? ...Weird. I should check in at the house first.');
    else if (!f.lilySaved) yield G.say('Nate', 'Snow past the bridge? Not now. Lily is in a FRIDGE.');
    else yield G.say('Nate', 'Whatever\'s going on up there can wait. Mikey is still at the end of our driveway.');
    yield G.walkTo(p, p.x, p.y + 18, 1);
  };

  // walking up to the brook pool at home
  S.poolHint = function* () {
    const f = flags(), w = G.play.world;
    f.poolHint = true;
    yield G.say('Nate', 'Red rock out on that little island in the brook. Passaic shale!');
    if (w.poolFrozen) return;
    yield G.say('Nate', 'No way across, though. If only the water would hold still.');
    if (G.state.items.pipe && f.signal_icy) yield G.say('Nate', '...Hm. I know a song that makes things hold still.');
  };

  // ---- the old fisherman on the rocks: knock five gulls out of the sky and his
  // spare surf rod is yours (and you'll need it for whatever's in that tunnel)
  const GULLS_NEEDED = 5;
  S.fisherman = function* () {
    const f = flags(), s = G.state;
    if (s.items.rod) {
      f.fishLine = ((f.fishLine || 0) + 1) % 4;
      yield G.say('Old Fisherman', [
        'Catch anything yet? Stripers run in the fall. Flounder off the islands all summer.',
        'Thirty years out here. Best fishing on the whole East Coast, and nobody believes me.',
        'Cast it at whatever you can\'t reach. Then let the reel do the work.',
        'Still haven\'t found my hat. If you see a gull wearing it, bonk him twice.',
      ][f.fishLine]);
      return;
    }
    if (!f.rodQuest) {
      yield G.say('Old Fisherman', 'Thirty years I been fishing off these rocks. Stripers, flounder, cobia. You name it.');
      yield G.say('Old Fisherman', 'Then these gulls figured out where I keep my bait. Now they take the bait, the sandwich, the hat off my HEAD.');
      yield G.say('Nate', 'They took your hat?');
      yield G.say('Old Fisherman', '...They took my hat.');
      yield G.say('Old Fisherman', 'Tell you what. Knock five of those gulls out of the sky and my spare rod is yours. You can only bonk \'em when they swoop down low.');
      f.rodQuest = true;
      f.gullBonks = 0;
      return;
    }
    const n = f.gullBonks || 0;
    if (n < GULLS_NEEDED) { yield G.say('Old Fisherman', 'That\'s ' + G.sayable(n) + '. Five gulls, son. Get \'em when they swoop.'); return; }
    yield G.say('Old Fisherman', 'Ha! Look at \'em scatter. All right. Here. My spare.');
    s.items.rod = true;
    s.xItem = 'rod';
    yield G.itemGet(G.spr.rodIcon, 'You got the {y}Surf Rod{/}! Press {y}X{/} to cast. Whatever you hook gets reeled right in.');
    yield G.say('Old Fisherman', 'Works on fish. Works on gulls. Works on anything too far away to bonk.');
    yield G.say('Old Fisherman', 'And son? Whatever\'s down in that tunnel... it\'s been taking a toll on folks.');
    yield G.say('Nate', '...Was that a pun?');
    yield G.say('Old Fisherman', 'Thirty years out here. You get punny.');
  };

  // the far end of the tunnel: a hooded figure, and his toll
  S.hooded = function* () {
    const f = flags(), w = G.play.world, p = P(), h = w.hooded, s = G.state;
    if (!h || h.dead || f.tylerBeaten || w.tylerFight) return;
    p.dir = 'up';
    if (f.tollPaid) { yield* S.tylerRematch(); return; }
    if (!f.hoodedMet) {
      f.hoodedMet = true;
      G.audio.stop();
      yield G.camFocus(h.x, h.y - 12, 40);
      w.burst(h.x, h.y - 6, ['#c8c4d8', '#8a849c'], 10, { speed: 0.5, up: 0.2, life: 50, size: 4 });
      yield G.say('Hooded Figure', '...');
      yield G.say('Hooded Figure', 'None pass to Chesapeake without paying the toll.');
      yield G.say('Nate', 'I already paid the toll. At the toll plaza. With money.');
      yield G.say('Hooded Figure', 'That was THEIR toll. This is MY toll.');
      yield G.say('Hooded Figure', 'Five hundred shark teeth.');
      yield G.say('Nate', 'FIVE HUNDRED?!');
      yield G.say('Hooded Figure', 'The ditch is worth it, Nate. You know this.');
      yield G.say('Nate', '...How do you know my name?');
      yield G.say('Hooded Figure', '...');
      if (G.with('doron')) {
        yield G.say('Doron', 'I could take him.');
        yield G.say('Hooded Figure', 'You could not.');
        yield G.say('Doron', '...I could not.');
      } else if (G.with('lily')) {
        yield G.say('Lily', 'Nate. He doesn\'t have a face. Why doesn\'t he have a face?');
      }
      yield G.camFocus(null, null, 30);
      G.audio.play('tunnel');
    }
    if (s.teeth < TOLL) {
      yield G.say('Hooded Figure', 'You have ' + G.sayable(s.teeth) + '. The toll is five hundred. The bay is patient. So am I.');
      yield G.walkTo(p, p.x, p.y + 20, 1.2);
      return;
    }
    if (!s.items.rod) {
      f.hoodedNotReady = true;
      yield G.say('Hooded Figure', 'You have the teeth. But you are not ready.');
      yield G.say('Hooded Figure', 'A hammer will not be enough down here. Find the old man fishing on the rocks.');
      yield G.say('Nate', '...How do you know about him?');
      yield G.say('Hooded Figure', '...');
      yield G.walkTo(p, p.x, p.y + 20, 1.2);
      return;
    }
    const c = yield G.ask('Hooded Figure', 'Five hundred shark teeth. Pay the toll?', ['Pay 500 teeth', 'Not yet']);
    if (c) { yield G.walkTo(p, p.x, p.y + 20, 1.2); return; }
    s.teeth -= TOLL;
    G.audio.sfx('tooth');
    yield G.say(null, 'Nate pours five hundred shark teeth into a little velvet bag. The bag is much smaller than five hundred shark teeth. They all fit.');
    yield G.say('Hooded Figure', 'The toll is paid.');
    yield* S.tylerReveal();
  };

  // ---- the hooded figure was Tyler all along, hypnotized by Father Eggmas
  const tylerJunk = (e) => e instanceof G.Shot || e instanceof G.FallingRock || e instanceof G.MosasaurJaws;
  S.tylerReveal = function* () {
    const f = flags(), w = G.play.world, p = P(), h = w.hooded;
    f.tollPaid = true;
    yield G.say('Hooded Figure', 'Five hundred shark teeth...');
    yield G.say('Hooded Figure', '...and not ONE of them is a MOSASAUR TOOTH.');
    yield G.camFocus(h.x, h.y - 12, 30);
    // the hood comes down
    G.audio.sfx('poof');
    w.burst(h.x, h.y - 20, ['#2e2840', '#4a4260', '#c8c4d8'], 12, { speed: 0.8, up: 0.5, life: 30, size: 3 });
    h.sprite = 'tylerHypno'; h.name = 'Tyler'; h.flashT = 20;
    yield G.wait(30);
    yield G.emote(p, 'bang', 30);
    yield G.say('Nate', 'TYLER?!');
    yield G.say('Tyler', 'You know what I want, Nate.');
    yield G.say('Tyler', 'THE. MOSASAUR. TOOTH.');
    yield G.say('Nate', 'What mosasaur tooth?');
    yield G.say('Tyler', 'MY mosasaur tooth! Five inches! Serrated! The best fossil I ever found!');
    yield G.say('Tyler', 'A little egg in a paisley suit told me everything. A guy in a flat cap took it. A guy with a ROCK HAMMER.');
    yield G.say('Nate', '...Father Eggmas. Tyler, I didn\'t take your tooth! Look at your eyes, they\'re all swirly!');
    if (G.with('doron')) yield G.say('Doron', 'Same swirly eyes Dad had at Micro Mayhem. Eggmas got to him.');
    else if (G.with('lily')) yield G.say('Lily', 'His eyes are doing the swirly thing. I hate it here.');
    yield G.say('Tyler', 'Fine. Then you can have your toll back... ONE TOOTH AT A TIME!');
    f.tylerMet = true;
    G.play.autosave();
    yield* S.tylerFightStart();
  };
  S.tylerRematch = function* () {
    yield G.say('Tyler', 'Back for more? You know what I want. THE MOSASAUR TOOTH.');
    yield* S.tylerFightStart();
  };
  S.tylerFightStart = function* () {
    const f = flags(), w = G.play.world, h = w.hooded;
    yield G.camFocus(null, null, 20);
    if (!f.tylerTutorial) {
      f.tylerTutorial = true;
      yield G.say(null, 'Tyler blocks everything with his {y}sifting screen{/}. Hook him with the {y}Surf Rod{/} (X) to reel him in, then let him have it.');
      yield G.say(null, 'The hook only catches him when his {y}screen is down{/}: while he\'s sifting, or while he\'s dizzy after a charge (he yells {y}HERE I COME{/} first).');
      yield G.say(null, 'Watch the road: a {y}dark swirl{/} means something is coming up from below.');
    }
    // the fight takes the end of the tunnel: closed off above and below
    h.dead = true;
    for (let x = 5; x <= 10; x++) w.block[4 * w.w + x] = 0;
    w.blockTiles(5, 1, 6, 1); w.blockTiles(5, 22, 6, 1);
    for (const e of w.ents) if (e instanceof G.Seagull && e.y < 24 * 16) e.dead = true;
    w.tyler = w.add(new G.TylerBoss(h.x, h.y));
    w.tylerFight = true;
    yield G.banner('TYLER', 'THE MOSASAUR TOOTH!', 150);
    G.audio.play('tyler');
  };
  // (the first time Nate whacks his sifting screen)
  S.tylerBlockHint = function* () {
    yield G.say('Tyler', 'Ha! You can\'t get through the SCREEN, Nate!');
    if (G.state.xItem !== 'rod') yield G.say(null, 'Set the {y}Surf Rod{/} to X in the menu, then cast it at Tyler to reel him in.');
  };
  S.tylerPhase = function* () {
    const w = G.play.world;
    for (const e of w.ents) if (tylerJunk(e)) e.dead = true;
    G.audio.stop();
    yield G.shakeCmd(16, 2);
    yield G.say('Tyler', 'You think this is a GAME, Nate?');
    yield G.say('Nate', 'It... kind of is?');
    yield G.bigText('THE MOSASAUR TOOTH!!!', 70, '#ff6a5a');
    // a couple of hearts come rolling down the tunnel
    for (const dx of [-14, 14]) w.add(new G.Pickup(8 * 16 + dx, 14 * 16 + 14, 'heart'));
    G.audio.play('tyler2');
  };
  S.tylerDefeated = function* (boss) {
    const f = flags(), w = G.play.world, p = P();
    G.audio.stop();
    for (const e of w.ents) if (tylerJunk(e)) e.dead = true;
    G.audio.sfx('bell');
    yield G.shakeCmd(30, 3);
    yield G.wait(40);
    w.burst(boss.x, boss.y - 18, ['#d040f0', '#f8f8f8', '#a8e0ff'], 16, { speed: 1.4, up: 1, g: 0.06, life: 36, size: 2 });
    w.pop(boss.x, boss.y - 36, 'SNAP!', '#ffffff');
    boss.dead = true;
    const t = w.add(new G.NPC({ sprite: 'tyler', name: 'Tyler', x: boss.x, y: boss.y, dir: 'down' }));
    t.flashT = 30;
    w.tylerFight = false;
    yield G.wait(50);
    yield G.banner('YOU WIN!', 'snapped out of it', 150);
    t.dir = G.dirToward(p.x - t.x, p.y - t.y);
    yield G.say('Tyler', '...Nate? What are you doing under the bay?');
    yield G.say('Tyler', 'Why am I wearing a CLOAK?');
    yield G.say('Nate', 'Father Eggmas hypnotized you. You were charging a toll. Five hundred shark teeth.');
    yield G.say('Tyler', '...Did anybody pay it?');
    yield G.say('Nate', 'I paid it.');
    yield G.say('Tyler', 'Oh no. Oh, Nate. Here.');
    // every tooth he threw at Nate during the fight is gone (the longer the fight, the lighter the bag)
    const lost = Math.min(TOLL - 10, boss.thrown || 0), back = TOLL - lost;
    G.play.addTeeth(back);
    G.audio.sfx('tooth');
    if (!lost) yield G.itemGet(G.spr.toothGold, 'Tyler hands back the velvet bag: {y}500 shark teeth{/}. Every single one.');
    else {
      yield G.itemGet(G.spr.toothGold, 'Tyler hands back the velvet bag: {y}' + G.sayable(back) + ' shark teeth{/}.');
      yield G.say('Nate', 'Tyler. This bag is a lot lighter than five hundred.');
      yield G.say('Tyler', 'I... might have thrown some at you. During the fight.' + (lost > 200 ? ' A LOT of them.' : ''));
      yield G.say('Tyler', 'Perfectly good shark teeth. Into the BAY. I feel terrible. Those were GOOD teeth, Nate.');
      if (lost > 300) yield G.say('Nate', 'Somewhere down there, a crab is very rich.');
    }
    yield G.say('Tyler', 'And take my sifter. I am never sifting anything ever again.');
    G.state.items.sifter = true;
    yield G.itemGet(G.spr.sifter, 'You got {y}Tyler\'s Sifter{/}! Equip it in ITEMS and press X to sift the gravel in front of you.');
    yield G.say('Nate', 'There\'s a gravel bar in Brady Brook back home...');
    yield G.say('Tyler', 'Last thing I remember, I was hunting shark teeth at the Number One Ditch. Best ditch in the world.');
    yield G.say('Tyler', 'Then a little egg in a paisley suit walked up and said, "Nate has your mosasaur tooth." And everything went swirly.');
    yield G.say('Nate', 'Father Eggmas is AT the Number One Ditch.');
    if (G.with('doron')) yield G.say('Doron', 'Then that\'s where we\'re going.');
    else if (G.with('lily')) yield G.say('Lily', 'Nate, I want to go home.');
    yield G.say('Tyler', 'Go get him. I\'m heading back to New Jersey before anything else hypnotizes me.');
    yield G.say('Tyler', 'And Nate? If you see my mosasaur tooth...');
    yield G.say('Nate', 'I KNOW, Tyler.');
    // off he runs back down the tunnel toward the bridge and home, still yelling
    // about it (in the lane away from Nate, and off the bottom of the screen)
    for (let x = 5; x <= 10; x++) { w.block[1 * w.w + x] = 0; w.block[22 * w.w + x] = 0; }
    w.pop(t.x, t.y - 34, 'THE MOSASAUR TOOTH!', '#78e8e8');
    const lane = p.x < 8 * 16 ? 10 * 16 + 8 : 5 * 16 + 8;
    yield G.walkTo(t, lane, t.y, 2.2);
    yield G.walkTo(t, lane, G.play.cam.y + G.H + 40, 2.2);
    t.dead = true;
    f.tylerBeaten = true;
    G.audio.play('tunnel');
    G.play.autosave();
  };
  // ================================================================ THE BAY, HEADING SOUTH
  // Real-world order across the Chesapeake Bay Bridge-Tunnel: the toll plaza at the
  // Eastern Shore end, the first island (the old fisherman), the Chesapeake Channel
  // Tunnel (RoFo Pop, and the Two-Liter), the bridge between the tunnels (island with
  // the megalodon gravel), then the Thimble Shoal Channel Tunnel (Tyler), then Chesapeake.

  // ---------------------------------------------------------------- the toll plaza
  S.tollWorker = function* () {
    const f = flags();
    if (!f.tollMet) {
      f.tollMet = true;
      yield G.say('Toll Collector', 'Welcome to the Chesapeake Bay Bridge-Tunnel! Seventeen-point-six miles, shore to shore.');
      yield G.say('Nate', 'Do you take shark teeth?');
      yield G.say('Toll Collector', '...We take cash, cards and E-ZPass.');
      yield G.say('Toll Collector', 'But it\'s funny you ask. All week, people have been calling in about somebody down in the tunnels charging a toll of FIVE HUNDRED SHARK TEETH.');
      yield G.say('Toll Collector', 'That is NOT us. Please do not pay anybody shark teeth.');
      yield G.say('Toll Collector', 'Oh, and drive careful. A truck full of soda tipped over somewhere past the first island. Blue soda. Very sticky.');
      yield G.say(null, 'Dad\'s E-ZPass beeps from the windshield of the car. Nate\'s all paid up.');
      return;
    }
    f.tollLine = ((f.tollLine || 0) + 1) % 3;
    yield G.say('Toll Collector', [
      'Five hundred shark teeth. Can you imagine? Who even HAS five hundred shark teeth?',
      'Watch for the gulls on the islands. They will take a sandwich right out of your hand.',
      'Seventeen-point-six miles. Two tunnels. Four islands. And now, apparently, soda.',
    ][f.tollLine]);
  };
  S.tollCar = function* () {
    const c = yield G.ask('Nate', 'The car\'s right here.', ['Drive onto the bridge', 'Head home', 'Not yet']);
    if (c === 0) G.play.warp('cbbt', 21, 20, 'left');
    else if (c === 1) G.play.warp('home', 1, 53, 'right');
  };
  S.tollEdge = (line) => function* () {
    const p = P();
    yield G.say('Nate', line);
    yield G.walkTo(p, p.x, p.y + (p.y < 8 * 16 ? 20 : -20), 1);
  };

  G.MAPS.cbbtToll = {
    name: 'Bay Bridge-Tunnel: Toll Plaza',
    music: 'bay',
    tiles() {
      const W = 22, H = 16;
      const g = Array.from({ length: H }, () => Array(W).fill('.'));
      const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < W && y < H) g[y][x] = c; };
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) set(x + i, y + j, c); };
      // the bay at the top, with the start of the trestle heading out over it
      fill(0, 0, W, 3, 'y');
      fill(7, 0, 6, 3, '+'); for (let y = 0; y < 3; y++) { set(6, y, '!'); set(13, y, '!'); }
      // the plaza: four lanes through the booths, then the road on down the Eastern Shore
      fill(5, 3, 10, H - 3, 'a');
      for (const x of [5, 8, 11, 14]) fill(x, 6, 1, 4, 'C');   // the booth islands
      fill(16, 9, 5, 6, 'C');                                   // a little lot by the plaza
      for (const [x, y] of [[1, 4], [1, 9], [2, 13], [18, 4]]) set(x, y, 'T');
      return g.map((r) => r.join(''));
    },
    setup(w) {
      const sp = G.spr;
      w.addProp({ img: sp.tollPlaza, tx: 5, ty: 6, h: 4, dx: 0 });
      for (const x of [5, 8, 11, 14]) w.blockTiles(x, 8, 1, 2);
      w.add(new G.NPC({ sprite: 'tollWorker', name: 'Toll Collector', x: 9 * 16 + 8, y: 10 * 16 + 14, dir: 'down', talk: S.tollWorker }));
      w.addProp({ img: sp.suv, tx: 17, ty: 10, h: 3, dx: 3, solid: [17, 11, 2, 2], hit: [17, 11, 2, 2], talk: S.tollCar });
      w.add(new G.Sign(16, 7, ['CHESAPEAKE BAY BRIDGE-TUNNEL', '17.6 miles across the mouth of the Chesapeake Bay. Two tunnels. Four man-made islands.']));
      w.add(new G.Sign(4, 12, ['NOTICE', 'Tolls are paid HERE, at the plaza. Never in the tunnels. Never in shark teeth.']));
      w.addTrigger(7, 0, 6, 1, () => G.script.run(S.tollEdge('Seventeen-point-six miles of bridge. I am DRIVING.')()));
      w.addTrigger(5, 15, 10, 1, () => G.script.run(S.tollEdge('Home is back that way. If I\'m going home, I\'m taking the car.')()));
    },
    onEnter() {
      return (function* () {
        if (flags().tollMet) return;
        yield G.wait(20);
        yield G.say('Nate', 'The toll plaza. Last stop on the Eastern Shore before the bridge-tunnel.');
        yield* S.tollWorker();
      })();
    },
  };

  // ---------------------------------------------------------------- the Chesapeake Channel Tunnel
  // RoFo Pop: a truck full of it tipped over, and Father Eggmas got to the soda. Blue
  // raspberry fizzers all down the tunnel, and the Two-Liter at the far end.
  S.popRefillHint = function* () {
    flags().popRefillHint = true;
    yield G.say(null, 'The Two-Liter is calling the little bottles back to pour them in and fill itself up!');
    if (G.state.items.rod) yield G.say(null, 'Hook them away with the {y}Surf Rod{/} (X) before it gets them, or bonk them first.');
    else yield G.say(null, 'Bonk them before it gets them!');
  };
  S.popFight = function* () {
    const f = flags(), w = G.play.world, p = P();
    if (f.popBeaten || w.popFight) return;
    w.popFight = true;
    // the way back closes behind Nate
    w.blockTiles(5, 24, 6, 1);
    const b = w.pop2l = w.add(new G.TwoLiter(8 * 16, 9 * 16 + 14, [5 * 16 + 18, 5 * 16, 11 * 16 - 18, 21 * 16]));
    b.arenaBottom = 24 * 16;
    w.add(new G.SlamZone(b));
    // it's tall: when Nate is right under it, the camera leans up so its fists stay on screen
    w.camLean = (q) => (b.state === 'defeated' ? 0 : G.clamp(q.y - b.y - 8, 0, 28));
    yield G.camFocus(b.x, b.y - 36, 30);
    G.audio.sfx('fuse');
    w.pop(b.x, b.y - 88, '*fzzzzzzzt*', '#78c0ff');
    yield G.wait(30);
    yield G.say('Nate', 'That is the biggest RoFo Pop I have ever seen.');
    yield G.say('Nate', '...Why does it have LEGS?');
    if (G.with('lily')) yield G.say('Lily', 'I am not drinking that.');
    else if (G.with('doron')) yield G.say('Doron', 'I\'m not drinking that.');
    yield G.camFocus(null, null, 20);
    yield G.banner('THE TWO-LITER', 'RoFo Pop, blue raspberry', 150);
    G.audio.play('boss');
  };
  S.popDefeated = function* (boss) {
    const f = flags(), w = G.play.world, p = P();
    G.audio.stop();
    for (const e of w.ents) if (e instanceof G.RofoPop || e instanceof G.Shot) { e.dead = true; w.burst(e.x, e.y - 8, ['#2a7ae0', '#78c0ff'], 4); }
    boss.pours = [];
    G.audio.sfx('bell');
    yield G.shakeCmd(30, 3);
    // all the fizz goes out of it
    for (let i = 0; i < 4; i++) { w.burst(boss.x, boss.y - 72, ['#ffffff', '#a8d8ff', '#78c0ff'], 6, { speed: 1, up: 1.4, life: 20, size: 2 }); G.audio.sfx('blip'); yield G.wait(12); }
    w.pop(boss.x, boss.y - 88, 'pssssshhhhhh...', '#a8d8ff');
    yield G.wait(50);
    w.popFight = false;
    w.camLean = null;
    f.popBeaten = true;
    for (let x = 5; x <= 10; x++) w.block[24 * w.w + x] = 0;
    yield G.banner('YOU WIN!', 'flat as a pancake', 150);
    yield G.say('Nate', '...Flat. Just like every bottle of RoFo Pop in our garage.');
    G.audio.sfx('buzz');
    yield G.say(null, 'Nate texts the group chat.');
    yield G.text('Nate', 'why is there a giant rofo pop in the chesapeake channel tunnel');
    yield G.text('Abe', 'OMG. we always grab u guys some at the royal farms on the eastern shore');
    yield G.text('Hannah', 'it\'s the thought that counts!!');
    yield G.text('Lily', 'it is BLUE');
    yield G.text('Nate', 'it does not taste good');
    yield G.text('Abe', 'more for us then');
    yield G.text('Hannah', 'we are not drinking it either');
    boss.dead = true;
    w.burst(boss.x, boss.y - 20, ['#a8c8e0', '#ffffff'], 12, { speed: 1.2, life: 26, size: 3 });
    w.add(new G.Pickup(boss.x, boss.y, 'rofo'));
    G.audio.play('tunnel');
    G.play.autosave();
  };

  G.MAPS.chesTunnel = {
    name: 'Chesapeake Channel Tunnel',
    music: 'tunnel',
    tiles() {
      return Array.from({ length: 64 }, () => '    :-++t+-:    ');
    },
    setup(w) {
      const f = flags();
      for (let ty = 2; ty < 64; ty += 4) {
        for (const x of [5 * 16 - 9, 11 * 16 + 1]) {
          w.props.push({ base: ty * 16, draw(ctx, cx, cy) { ctx.drawImage(G.spr.tunnelLight, x - cx, ty * 16 + 4 - cy); w.glows.push({ x: x + 4, y: ty * 16 + 7, color: '#f8a040' }); } });
        }
      }
      for (const [ty, side, text] of [
        [58, 0, ['CHESAPEAKE CHANNEL TUNNEL', 'About a mile long: 5,237 feet, under the main shipping channel into the bay.']],
        [40, 1, ['CAUTION', 'Spilled soda ahead. Extremely sticky. Do NOT drink it.']],
        [26, 0, ['YOU ARE NOW UNDER THE SHIPPING CHANNEL', 'Container ships are passing right over your head. Try not to think about it.']],
      ]) {
        const tx = side ? 11 : 4;
        w.addProp({ img: G.spr.tunnelSign, tx, ty, dx: -4, flat: true, hit: [tx, ty, 1, 1], talk: look(...text) });
      }
      // a few old spills on the road, and the fizzers
      for (const [x, y] of [[7, 50], [9, 41], [6, 33]]) w.add(new G.StickyPuddle(x * 16 + 8, y * 16 + 8, true)).life = 1e9;
      if (!f.popBeaten) {
        for (const [x, y] of [[8, 48], [6, 43], [9, 38], [7, 33], [9, 29]]) w.add(new G.RofoPop(x * 16 + 8, y * 16 + 14));
        w.addTrigger(5, 20, 6, 1, () => { if (!flags().popBeaten && !w.popFight) G.script.run(S.popFight()); });
      }
      // back to the first island, and on out the far end to the bridge between the tunnels
      w.addTrigger(5, 63, 6, 1, () => G.play.warp('cbbt', 14, 10, 'down'));
      w.addTrigger(5, 0, 6, 1, () => {
        if (flags().popBeaten) G.play.warp('cbbtMid', 14, 57, 'up');
        else G.script.run(S.tollEdge('The Two-Liter is still blocking the tunnel.')());
      });
    },
    tint(ctx) {
      ctx.fillStyle = 'rgba(24,10,0,0.2)';
      ctx.fillRect(0, 0, G.W, G.H);
      ctx.fillStyle = 'rgba(80,140,255,0.05)';
      ctx.fillRect(0, 0, G.W, G.H);
    },
    onEnter() {
      return (function* () {
        const f = flags();
        if (f.chesSeen) return;
        f.chesSeen = true;
        yield G.wait(20);
        yield G.say('Nate', 'The Chesapeake Channel Tunnel. About a mile long, right under the shipping channel.');
        yield G.say('Nate', '...Why is the road sticky?');
      })();
    },
  };

  // ---------------------------------------------------------------- between the tunnels
  // Out of the Chesapeake Channel Tunnel onto island 3, a long stretch of trestle over
  // open water, then island 2 and the Thimble Shoal Channel Tunnel. On island 2: a patch
  // of gravel and old shell where a fossil megalodon tooth is waiting (needs Tyler's sifter).
  S.megalodonSift = function* (direct) {
    const f = flags();
    if (!G.itemHas('sifter')) {
      yield G.say(null, 'A patch of gravel and crushed shell, washed up between the rocks. Tiny fossil bits glint in it.');
      yield G.say('Nate', 'There could be shark teeth in here. Real ones. It\'s way too fine to pick through by hand, though. I need a sifting screen.');
      return;
    }
    if (f.megalodon) { yield G.say(null, 'Gravel, shell and a few tiny fossil shark teeth. Nothing like the big one.'); return; }
    if (!direct) {
      const c = yield G.ask(null, 'A patch of gravel and crushed shell. Tiny fossil bits glint in it.', ['Sift it with Tyler\'s sifter', 'Leave it']);
      if (c) return;
    }
    yield G.say(null, 'Nate shakes scoop after scoop through the sifter. Shell, pebbles, a few tiny fossil teeth...');
    G.audio.sfx('slip');
    yield G.wait(30);
    yield G.say(null, '...and then something big and heavy rattles in the screen.');
    f.megalodon = true;
    yield* S.rockGive('megalodon');
    yield G.say('Nate', 'A MEGALODON tooth. Off the bottom of the Chesapeake Bay. This is the greatest day of my life.');
    yield G.say('Nate', 'Tyler is going to lose his MIND.');
  };

  G.MAPS.cbbtMid = {
    name: 'Bay Bridge-Tunnel: Between the Tunnels',
    music: 'bay',
    tiles() {
      const W = 30, H = 60;
      const g = Array.from({ length: H }, () => Array(W).fill('y'));
      const island = (cy) => {
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
          const d = Math.abs((x - 14.5) / 11.5) ** 4 + Math.abs((y - cy) / 8) ** 4;
          if (d <= 1) g[y][x] = d > 0.5 ? '^' : '.';
        }
        for (let y = cy - 6; y <= cy + 6; y++) for (let x = 11; x <= 18; x++) if (y >= 0 && y < H && g[y][x] === '.') g[y][x] = 'C';
      };
      island(8);   // island 2, the Thimble Shoal Channel Tunnel up top
      island(51);  // island 3, out of the Chesapeake Channel Tunnel at the bottom
      // the road straight up the middle, with parapets along the trestle
      for (let y = 0; y < H; y++) {
        for (let x = 13; x <= 16; x++) g[y][x] = x === 15 ? 't' : '+';
        if (y >= 16 && y <= 43) { g[y][12] = '!'; g[y][17] = '!'; }
      }
      // the gravel and shell patch on island 2
      for (const [x, y] of [[6, 9], [7, 9], [6, 10], [7, 10], [8, 10], [7, 11]]) g[y][x] = 'g';
      return g.map((r) => r.join(''));
    },
    setup(w) {
      const sp = G.spr;
      // no ships out here (they cross over the tunnels, not the trestle): just a fishing boat
      // puttering across, under the bridge (hidden behind the deck while it's underneath)
      w.props.push({ base: -1000, draw(ctx, cx, cy) {
        const x = Math.round((G.tick * 0.35 + 120) % 600 - 60) - cx, y = 29 * 16 - cy, img = sp.fishingBoat;
        ctx.save();
        ctx.beginPath(); ctx.rect(-1000, -1000, 12 * 16 - cx + 1000, 4000); ctx.rect(18 * 16 - cx, -1000, 4000, 4000); ctx.clip();
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        for (let i = 1; i <= 4; i++) ctx.fillRect(x - i * 6, y + 15 + (i & 1), 4, 1);
        ctx.drawImage(img, x, y);
        ctx.restore();
      } });
      // the Thimble Shoal Channel Tunnel portal on island 2
      w.addProp({ img: sp.tunnelPortalTS, tx: 9, ty: 0, h: 6 });
      w.blockTiles(9, 0, 12, 6);
      for (let y = 4; y <= 5; y++) for (let x = 13; x <= 16; x++) w.block[y * w.w + x] = 0;
      w.addTrigger(13, 4, 4, 1, () => G.play.warp('cbbtTunnel', 7, 61, 'up'));
      // and back down into the Chesapeake Channel Tunnel off the bottom of island 3
      w.addTrigger(13, 59, 4, 1, () => G.play.warp('chesTunnel', 7, 2, 'down'));
      // lamps along the trestle, gulls on most of them
      const lamp = (tx, ty, armRight, gull) => {
        const bx = tx * 16 + 8, by = ty * 16 + 15;
        w.props.push({ img: armRight ? sp.lampPost : sp.lampPostL, x: armRight ? bx - 3 : bx - 26, y: by - 59, base: by });
        w.blockTiles(tx, ty, 1, 1);
        if (gull !== undefined) w.add(new G.Seagull(bx + (armRight ? 19 : -19), by + 1, 59, gull));
      };
      lamp(12, 12, true); lamp(17, 14, false, false);
      lamp(12, 20, true, true); lamp(17, 26, false, false); lamp(12, 32, true, false); lamp(17, 38, false, true);
      lamp(12, 46, true); lamp(17, 50, false, false);
      w.add(new G.Sign(18, 52, ['ISLAND 3', 'Behind you: the Chesapeake Channel Tunnel. Ahead: the Thimble Shoal Channel Tunnel.']));
      w.add(new G.Sign(11, 9, ['ISLAND 2', 'Ahead: the Thimble Shoal Channel Tunnel. The way in to Hampton Roads runs right over it.']));
      for (const [x, y, flip, line] of [[4, 50, false, 'A brown pelican, wings out, drying off on the rocks.'], [25, 7, true, 'A brown pelican. It has clearly seen some things.']]) {
        w.addProp({ img: flip ? sp.pelicanL : sp.pelican, tx: x, ty: y, solid: [x, y, 1, 1], hit: [x, y, 1, 1], talk: look(line) });
      }
      w.props.push({ img: null, x: 0, y: 0, base: 0, hit: [6 * 16, 9 * 16, 9 * 16, 12 * 16], talk: S.megalodonSift });
    },
    onEnter() {
      return (function* () {
        const f = flags();
        if (f.midSeen) return;
        f.midSeen = true;
        yield G.wait(20);
        yield G.say('Nate', 'Out of the first tunnel. Open water both ways, and the second tunnel at the end of the bridge.');
      })();
    },
  };

  S.tunnelEnd = function* () {
    const p = P();
    if (!flags().tylerBeaten) { yield G.walkTo(p, p.x, p.y + 24, 1); return; }
    if (!flags().condoArrived) yield G.say('Nate', 'Daylight! Chesapeake is right on the other side.');
    // out the far end and into Chesapeake: Abe and Hannah's street
    G.play.warp('condo', 55, 1, 'down');
  };

  G.MAPS.cbbt = {
    name: 'Chesapeake Bay Bridge-Tunnel',
    music: 'bay',
    tiles() {
      const W = 30, H = 44;
      const g = Array.from({ length: H }, () => Array(W).fill('y'));
      // the island: rounded, armored all the way around with riprap
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const d = Math.abs((x - 14.5) / 11.5) ** 4 + Math.abs((y - 16.5) / 12) ** 4;
        if (d <= 1) g[y][x] = d > 0.5 ? '^' : '.';
      }
      // concrete along the road and around the lookout; a little parking lot
      for (let y = 9; y < 28; y++) for (let x = 11; x <= 18; x++) if (g[y][x] === '.') g[y][x] = 'C';
      for (let y = 12; y < 17; y++) for (let x = 5; x <= 10; x++) if (g[y][x] === '.') g[y][x] = 'C';
      for (let y = 17; y < 22; y++) for (let x = 19; x <= 23; x++) g[y][x] = 'a';
      // the road: out of the tunnel portal, down the island and off along the trestle
      for (let y = 9; y < H; y++) {
        for (let x = 13; x <= 16; x++) g[y][x] = x === 15 ? 't' : '+';
        if (y >= 29) { g[y][12] = '!'; g[y][17] = '!'; }
      }
      return g.map((r) => r.join(''));
    },
    setup(w) {
      // a container ship sliding past out in the channel
      w.props.push({ base: -1000, draw(ctx, cx, cy) { ctx.drawImage(G.spr.containerShip, Math.round((G.tick * 0.3) % 760 - 190) - cx, 6 - cy); } });
      // the ventilation building over the tunnel portal; walk into the mouth to go under
      w.addProp({ img: G.spr.tunnelPortal, tx: 9, ty: 4, h: 6 });
      w.blockTiles(9, 4, 12, 6);
      for (let y = 8; y <= 9; y++) for (let x = 13; x <= 16; x++) w.block[y * w.w + x] = 0;
      w.addTrigger(13, 8, 4, 1, () => G.play.warp('chesTunnel', 7, 61, 'up'));
      // light poles on the island and along the trestle, most of them with a gull on top
      const lamp = (tx, ty, armRight, gull) => {
        const bx = tx * 16 + 8, by = ty * 16 + 15;
        w.props.push({ img: armRight ? G.spr.lampPost : G.spr.lampPostL, x: armRight ? bx - 3 : bx - 26, y: by - 59, base: by });
        w.blockTiles(tx, ty, 1, 1);
        if (gull !== undefined) w.add(new G.Seagull(bx + (armRight ? 19 : -19), by + 1, 59, gull));
      };
      lamp(12, 13, true, false); lamp(17, 17, false, true); lamp(12, 21, true); lamp(17, 25, false, false);
      lamp(12, 31, true, false); lamp(17, 35, false, true); lamp(12, 39, true, true); lamp(17, 42, false, false);
      // the lookout: a viewer, a bench, a trash can the gulls have been working on
      w.addProp({ img: G.spr.bayViewer, tx: 7, ty: 13, dx: 1, solid: [7, 13, 1, 1], hit: [7, 13, 1, 1], talk: S.bayViewer });
      w.addProp({ img: G.spr.teakBench, tx: 5, ty: 15, solid: [5, 15, 2, 1], hit: [5, 15, 2, 1], talk: look('A bench facing the bay. The gulls have claimed it. Nate respects that.') });
      w.addProp({ img: G.spr.trash, tx: 9, ty: 16, dx: 2, solid: [9, 16, 1, 1], hit: [9, 16, 1, 1], talk: look('A trash can with a heavy lid. Something has been pecking at it. A lot.') });
      w.add(new G.Sign(11, 10, ['CHESAPEAKE BAY BRIDGE-TUNNEL', 'One of four man-made islands, about five acres each. Ahead: the Chesapeake Channel Tunnel, under the shipping channel.']));
      w.add(new G.Sign(6, 12, ['BIRD NOTE', 'The rocks around these islands are a hangout for gulls, brown pelicans and purple sandpipers.', 'Please do not feed the gulls. They do not need the encouragement.']));
      // brown pelicans on the riprap
      for (const [x, y, flip, line] of [[3, 17, false, 'A brown pelican. It stares at Nate like he owes it money.'], [26, 13, true, 'A brown pelican, eyes closed, napping on the rocks. Living the dream.'], [8, 27, false, 'A brown pelican. It opens its pouch, considers Nate, and closes it again.']]) {
        w.addProp({ img: flip ? G.spr.pelicanL : G.spr.pelican, tx: x, ty: y, solid: [x, y, 1, 1], hit: [x, y, 1, 1], talk: look(line) });
      }
      // the old fisherman on the rocks at the south end, line in the water
      const fish = w.add(new G.NPC({ sprite: 'fisherman', name: 'Old Fisherman', x: 9 * 16 + 8, y: 24 * 16 + 14, dir: 'down', talk: S.fisherman }));
      w.props.push({
        base: 29 * 16,
        draw(ctx, cx, cy) {
          const bob = Math.round(Math.sin(G.tick * 0.06) * 1.5), hx = fish.x + 3, hy = fish.y - 9, tx = fish.x + 15, ty = fish.y - 36, bx = fish.x + 20, by = 29 * 16 + 6 + bob;
          ctx.lineWidth = 1;
          ctx.strokeStyle = '#2a3a5a';
          ctx.beginPath(); ctx.moveTo(hx - cx + 0.5, hy - cy + 0.5); ctx.lineTo(tx - cx + 0.5, ty - cy + 0.5); ctx.stroke();
          ctx.fillStyle = '#8a8a94'; ctx.fillRect(hx + 1 - cx, hy - 4 - cy, 3, 3);
          ctx.strokeStyle = 'rgba(240,240,248,0.8)';
          ctx.beginPath(); ctx.moveTo(tx - cx + 0.5, ty - cy + 0.5); ctx.lineTo(bx - cx + 0.5, by - cy + 0.5); ctx.stroke();
          ctx.drawImage(G.spr.bobber, bx - 2 - cx, by - cy);
        },
      });
      // Nate's car in the lot
      w.addProp({ img: G.spr.suv, tx: 20, ty: 17, h: 3, dx: 3, solid: [20, 18, 2, 2], hit: [20, 18, 2, 2], talk: S.cbbtCar });
      w.add(new G.Chest(23, 12, 'cbbt_teeth', function* () {
        yield G.itemGet(G.spr.toothGold, 'Tucked behind the rocks: {y}30 shark teeth{/}! Probably a gull\'s stash.');
        G.play.addTeeth(30);
      }));
      w.addTrigger(13, 43, 4, 1, () => G.script.run(S.cbbtTrestleEnd()));
    },
    onEnter() { return S.cbbtArrive(); },
  };

  // The Thimble Shoal Channel Tunnel (the second tunnel heading south; the map id is
  // still cbbtTunnel for older saves): about a mile of tiled tube under the bay, sodium
  // lights, a catwalk on each side, and (at the far end) the "toll". Tyler.
  G.MAPS.cbbtTunnel = {
    name: 'Thimble Shoal Channel Tunnel',
    music: 'tunnel',
    tiles() {
      return Array.from({ length: 64 }, () => '    :-++t+-:    ');
    },
    setup(w) {
      for (let ty = 2; ty < 64; ty += 4) {
        for (const [x, side] of [[5 * 16 - 9, 0], [11 * 16 + 1, 1]]) {
          w.props.push({ base: ty * 16, draw(ctx, cx, cy) { ctx.drawImage(G.spr.tunnelLight, x - cx, ty * 16 + 4 - cy); w.glows.push({ x: x + 4, y: ty * 16 + 7, color: '#f8a040' }); } });
        }
      }
      // gulls. In the tunnel. How did they even get in here
      for (const [ty, side, laughing] of [[50, 0, true], [34, 1, false], [18, 0, false]]) {
        w.add(new G.Seagull(side ? 11 * 16 - 4 : 5 * 16 + 4, ty * 16 + 26, 22, laughing));
      }
      for (const [ty, side, text] of [
        [58, 0, ['THIMBLE SHOAL CHANNEL TUNNEL', 'About a mile long: 5,552 feet, under the Thimble Shoal Channel, the way in to Hampton Roads.']],
        [32, 1, ['YOU ARE NOW UNDER THE SHIPPING CHANNEL', 'Container ships are passing right over your head. Try not to think about it.']],
        [12, 0, ['NO STOPPING IN TUNNEL', 'Somebody has scratched underneath: "except for the toll."']],
      ]) {
        const tx = side ? 11 : 4;
        w.addProp({ img: G.spr.tunnelSign, tx, ty, dx: side ? -4 : -4, flat: true, hit: [tx, ty, 1, 1], talk: look(...text) });
      }
      // the toll-taker (after the reveal: Tyler, still hypnotized, waiting for a rematch)
      if (!flags().tylerBeaten) {
        const hyp = flags().tollPaid;
        w.hooded = w.add(new G.NPC({ sprite: hyp ? 'tylerHypno' : 'hooded', name: hyp ? 'Tyler' : 'Hooded Figure', x: 8 * 16, y: 4 * 16 + 14, dir: 'down', talk: S.hooded }));
        w.blockTiles(5, 4, 6, 1);
        w.addTrigger(5, 6, 6, 2, () => { if (!flags().tylerBeaten && !w.tylerFight) G.script.run(S.hooded()); });
      }
      w.addTrigger(5, 0, 6, 1, () => G.script.run(S.tunnelEnd()));
      w.addTrigger(5, 63, 6, 1, () => G.play.warp('cbbtMid', 14, 7, 'down'));
    },
    // ships rumble by overhead now and then
    tick(w) {
      if (G.script.busy) return;
      w.rumbleT = (w.rumbleT || 0) + 1;
      if (w.rumbleT < 900) return;
      w.rumbleT = 0;
      G.audio.sfx('bump');
      G.play.shake(50, 1);
      const p = G.play.player;
      w.pop(p.x, p.y - 34, '*a cargo ship rumbles by overhead*', '#c8c0b0');
    },
    tint(ctx) {
      ctx.fillStyle = 'rgba(24,10,0,0.22)';
      ctx.fillRect(0, 0, G.W, G.H);
      ctx.fillStyle = 'rgba(255,150,50,0.09)';
      ctx.fillRect(0, 0, G.W, G.H);
    },
    onEnter() {
      return (function* () {
        const f = flags();
        if (f.tunnelSeen) return;
        f.tunnelSeen = true;
        yield G.wait(20);
        yield G.say('Nate', 'The Thimble Shoal Channel Tunnel. The second one. Chesapeake is right on the other side.');
        if (G.with('lily')) yield G.say('Lily', 'There is a whole ocean on top of us right now.');
        else if (G.with('doron')) yield G.say('Doron', 'There are gulls in here. How are there gulls in here?');
        else yield G.say('Nate', '...Are those seagulls? In the TUNNEL?');
      })();
    },
  };

  // North of the bridge: snowy woods around a frozen pond, where Ice JJ Fish sings.
  G.MAPS.north = {
    name: 'The Frozen Pond',
    get music() { return flags().jjBeaten ? 'home' : 'icejj'; },
    tiles() {
      const W = 22, H = 16;
      const g = Array.from({ length: H }, (_, y) => Array.from({ length: W }, (_, x) => {
        if ((x - 11) ** 2 / 64 + (y - 7) ** 2 / 20 <= 1) return 'I';
        return 'J';
      }));
      for (let y = 11; y < H; y++) { g[y][10] = 'A'; g[y][11] = 'A'; }
      return g.map((r) => r.join(''));
    },
    setup(w) {
      // snowy pines all the way around (gap at the bottom for the road home)
      for (let x = 0; x < 22; x += 2) w.addTree(x, 0, 'snowpine');
      for (let y = 2; y < 14; y += 2) { w.addTree(0, y, 'snowpine'); w.addTree(20, y, 'snowpine'); }
      for (const x of [2, 4, 6, 14, 16, 18]) w.addTree(x, 14, 'snowpine');
      w.addProp({ img: G.spr.snowman, tx: 3, ty: 11, dx: -1, solid: [3, 11, 1, 1], hit: [3, 11, 1, 1], talk: look('A snowman in a top hat and a red scarf. It\'s been listening to the singing for a long time. It looks tired.') });
      w.add(new G.Sign(14, 12, ['THE FROZEN POND', 'It snows here year-round. Nobody knows why.']));
      w.addTrigger(10, 15, 2, 1, () => G.play.warp('home', 51, 2, 'down'));
      if (!flags().jjBeaten) {
        if (flags().jjGig) w.jj = w.add(new G.IceJJ(11 * 16 + 8, 6 * 16 + 14));
        else w.jjNpc = w.add(new G.NPC({ sprite: 'icejj', name: 'Ice JJ Fish', x: 11 * 16 + 8, y: 6 * 16 + 14, dir: 'down', talk: S.jjBusy }));
      }
    },
    // it's always snowing here
    tint(ctx) {
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      for (let i = 0; i < 46; i++) {
        const sp = 0.3 + (i % 4) * 0.12;
        const y = (i * 37 + G.tick * sp) % (G.H + 8) - 4;
        const x = (i * 53 + Math.sin((G.tick + i * 20) * 0.02) * 8 + 240) % G.W;
        ctx.fillRect(Math.round(x), Math.round(y), i % 3 ? 1 : 2, i % 3 ? 1 : 2);
      }
    },
    // mid-set, he never stops singing
    tick(w) {
      const g = w.jjNpc;
      if (!g || G.script.busy || G.tick % 70) return;
      w.jjVerse = ((w.jjVerse == null ? -1 : w.jjVerse) + 1) % G.JJ_SONG.length;
      w.pop(g.x, g.y - 36, G.JJ_SONG[w.jjVerse], '#a8e0ff');
    },
    onEnter() { return (function* () { const f = flags(); if (!f.jjBeaten) yield* (f.jjGig ? S.jjIntro() : S.jjBusyIntro()); })(); },
  };

  // Under the house: stone walls, a furnace, storage boxes, and the
  // Globglogabgalab's nest of half-eaten books.
  G.MAPS.basement = {
    name: 'Home: Basement',
    get music() { return flags().globBeaten ? 'house' : 'bookworm'; },
    tiles() {
      const W = 22, H = 14;
      const g = Array.from({ length: H }, () => Array(W).fill('w'));
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) g[y + j][x + i] = c; };
      fill(1, 1, 20, 2, 'N');
      fill(1, 3, 20, 10, 'd');
      fill(18, 3, 2, 3, 'S');
      return g.map((r) => r.join(''));
    },
    setup(w) {
      const F = furnish(w), sp = G.spr, f = flags();
      const pile = look('A pile of chewed-up books. Bite marks on every cover.');
      F.stand(sp.furnace, 2, 3, 2, f.globBeaten
        ? look('The furnace. A note is still pinned to it, in shaky red marker:', '{r}"ENJOY THE BOOKS. HO HO HO. -E"{/}', ['Nate', 'Father Eggmas. In our basement. I\'m keeping this as evidence.'])
        : look('The furnace. The ductwork goes up into every room of the house. That explains how Mom heard the singing.'));
      // Eggmas's note, pinned to the furnace (once the Globglogabgalab is gone)
      w.props.push({ base: 4 * 16, draw(ctx, cx, cy) { if (flags().globBeaten || w.eggNote) ctx.drawImage(G.spr.eggNote, 2 * 16 + 12 - cx, 3 * 16 - 6 - cy); } });
      F.stand(sp.storageBoxes, 5, 3, 2, look('Storage boxes: CHRISTMAS, BABY CLOTHES, and one labeled "DO NOT OPEN (LILY)."'));
      F.stand(sp.bookshelf2, 14, 3, 1, look('An old bookshelf. Completely empty. Licked clean.'));
      F.stand(sp.bookshelf2, 15, 3, 1, look('Another empty bookshelf. There\'s a little bite out of the shelf itself.'));
      F.stand(sp.storageBoxes, 1, 11, 2, look('More boxes. One is full of old VHS tapes. Somebody labeled one "DO NOT RECORD OVER." It was recorded over.'));
      for (const [x, y, k] of [[8, 4, 0], [3, 7, 1], [17, 11, 2], [12, 12, 0]]) F.stand(sp.bookPiles[k], x, y, 1, pile);
      w.addTrigger(18, 3, 2, 1, () => G.play.warp('homeDown', 22, 8, 'down'));
      // (no health bar until the fight actually starts, at the end of S.globIntro: it's a surprise)
      if (!f.globBeaten) {
        w.glob = w.add(new G.Globglog(10 * 16 + 8, 8 * 16 + 14)); w.glob.noBar = true;
        // still up in the ducts until the bait goes down (hidden from the first frame, not after the fade-in)
        if (!f.globMet && G.state.items.bait) w.glob.hidden = true;
      }
    },
    onEnter() { return (function* () { if (!flags().globBeaten) yield* S.globIntro(); })(); },
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
      [[12, 9], [28, 9], [29, 9], [36, 18], [36, 20]].forEach(([x, y]) => set(x, y, 'b'));
      // the Hook-a-Duck trough on the midway (real water, under the booth)
      fill(3, 6, 4, 4, '~');
      // tree border (gaps on the west edge for the road back to campus, and at
      // the bottom for the trail down to the little cave)
      for (let x = 0; x < W; x += 2) { set(x, 0, 'T'); if (x !== 20) set(x, 30, 'T'); }
      fill(20, 29, 2, 3, '=');
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
      for (const [x, y] of [[23, 16], [24, 16], [23, 17], [35, 10], [36, 10]]) w.addProp({ img: G.spr.hay, tx: x, ty: y, solid: [x, y, 1, 1] });
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
      // a protest tucked away at the bottom of the grounds, past the stands and the
      // tall grass (Lafayette's event village took the quad); you have to go looking
      w.protesters = [[14, 28, 'protest1', 'people'], [18, 28, 'protest2', 'grass'], [22, 28, 'protest3', 'money'], [26, 28, 'protest4', 'quad'], [30, 28, 'protest5', 'who']]
        .map(([x, y, spr, sign]) => npc(spr, 'Protester', x, y, S.protester(sign), { sign: G.spr.signs[sign] }));
      // the trail down to the little cave, with the protest dug in across it
      // (Jamie Lee Curtis on the pipe scatters them: S.protestScatter)
      w.addTrigger(20, 31, 2, 1, () => G.play.warp('fairCave', 7, 1, 'down'));
      if (!flags().protestScattered) {
        // (the sign stands at the left edge of the trail, the organizer on the right)
        w.organizer = npc('organizer', 'Organizer', 21, 29, S.organizer, { held: G.spr.megaphone });
        const img = G.spr.signs.cave;
        w.caveSign = w.addProp({ img, tx: 20, ty: 29, dx: -4 - Math.floor(img.width / 2), solid: [20, 29, 1, 1], hit: [20, 29, 1, 1], talk: S.organizer });
        w.blockTiles(21, 29, 1, 1);
      }

      w.add(new G.Sign(5, 11, ['EASTON FAIRGROUNDS', 'Tonight: {y}MICRO MAYHEM WRESTLING{/}! Doors at 7.']));
      w.add(new G.Sign(18, 14, 'PARKING. Do not leave valuables in your car. Or near the wrestlers.'));

      const styles = ['red', 'blue', 'gold', 'green'];
      [[6, 21], [12, 21], [14, 26], [27, 24], [32, 26], [30, 13], [35, 14]].forEach(([x, y], i) =>
        w.add(new G.Wrestler(x * 16 + 8, y * 16 + 14, styles[i % styles.length])));

      w.addWarp(0, 12, 1, 2, 'campus', 38, 12, 'left');
      // a pile of old quarry rubble (serpentine) tucked in the corner, and the balloon game
      if (G.state.items.hammer) w.add(new G.QuarryRubble(3 * 16, 28 * 16 + 12));
      w.balloonBooth = w.addProp({ img: flags().balloonWon ? G.spr.balloonBoothEmpty : G.spr.balloonBooth, tx: 27, ty: 14, h: 2, solid: [27, 14, 3, 2], hit: [27, 14, 3, 2], talk: S.balloonGame });
      // the midway: the high striker, Hook-a-Duck and the water-gun race
      midway(w);
    },
    // the protesters chant every so often (and a water-gun race runs, if there's one going)
    tick(w) {
      G.raceTick(w);
      if (G.script.busy || !w.protesters || G.tick % 150) return;
      const live = w.protesters.filter((q) => !q.dead);
      if (!live.length) return;
      const p = live[Math.floor(Math.random() * live.length)];
      w.pop(p.x, p.y - 52, CHANTS[Math.floor(Math.random() * CHANTS.length)], '#f8f8f0');
    },
  };

  // ---------------------------------------------------------------- the midway (late-game fun)
  // Three booths in the field west of the Expo Hall, each one rigged so it takes something from
  // later in the trip: the high striker (nobody rings that bell... but Abe can just reach up and
  // flick it), Hook-a-Duck (the golden duck is way in the back, out of reach of the duck poles,
  // but not a surf rod), and the water-gun race (the booth's squirt guns are pathetic; the
  // Portable Bidet is not). Flags: strikerHint, reach_bell, duckSeen, duckRodHint, goldenDuck,
  // raceBidet, raceTip, raceWon, bidetNozzle.
  G.CAST.raceKid1 = { skin: '#f2c8a0', hair: '#c8a46c', hairStyle: 'short', blush: true, shirt: '#d83030', pants: '#3a4a8a', shorts: true, shoes: '#f0f0f0', torso: 4, legs: 2 };
  G.CAST.raceKid2 = { skin: '#8a5a3a', eyes: '#140c0a', hair: '#1a1010', hairStyle: 'buzz', smile: '#ffffff', shirt: '#f0c830', pants: '#2a2c38', shorts: true, shoes: '#2a2a2a', torso: 4, legs: 2 };
  const DUCK_PATH = [3 * 16 + 9, 70 + 51, 3 * 16 + 55, 70 + 81];   // the loop around the trough
  const RACE_X = [7 * 16 + 13, 7 * 16 + 40, 7 * 16 + 67], RACE_Y = 10 * 16 + 12;
  const RACE_NEED = 70;                                             // frames of stream in the clown's mouth
  const RACE_KID = [1 / 330, 1 / 300];                              // the kids' balloons, per frame
  function midway(w) {
    const sp = G.spr, f = flags();
    // the high striker
    w.striker = { puck: 0, ding: 0 };
    w.props.push({
      img: sp.highStriker, x: 16, y: 10 * 16 - 64, base: 10 * 16 - 1, hit: [16, 9 * 16, 48, 10 * 16], talk: () => S.highStriker(),
      draw(ctx, cx, cy) {
        const x = this.x - cx, y = this.y - cy, py = y + 50 - Math.round(w.striker.puck * 42);
        ctx.drawImage(this.img, x, y);
        ctx.fillStyle = '#2a2a30'; ctx.fillRect(x + 9, py, 8, 3); ctx.fillStyle = '#f8e070'; ctx.fillRect(x + 10, py, 6, 1);
        if (w.striker.ding > 0) {
          w.striker.ding--;
          ctx.fillStyle = (w.striker.ding >> 2) & 1 ? '#fff8c0' : '#f8e070';
          for (const [dx, dy] of [[-9, -2], [-8, 3], [9, -2], [8, 3], [0, -5], [-5, -5], [5, -5]]) ctx.fillRect(x + 13 + dx, y + 3 + dy, 1, 1);
        }
      },
    });
    w.blockTiles(1, 9, 2, 1);
    // Hook-a-Duck (its trough is real water: a lure flies over it, and the bidet fills up at it)
    w.props.push({ img: sp.duckBooth, x: 3 * 16, y: 10 * 16 - 90, flat: true, base: 0 });
    w.props.push({ img: null, x: 0, y: 0, base: 0, hit: [3 * 16, 5 * 16, 7 * 16, 10 * 16], talk: () => S.duckBooth() });
    w.blockTiles(3, 5, 4, 1);
    for (let i = 0; i < 7; i++) w.add(new G.FairDuck(DUCK_PATH[0], DUCK_PATH[1], { path: DUCK_PATH, s: i / 7 }));
    if (!f.goldenDuck) w.add(new G.FairDuck(3 * 16 + 32, 70 + 35, { golden: true }));
    // the water-gun race: the booth, the balloons over the clowns, the clown in Nate's lane (a
    // spray target), and two kids at the other two guns
    w.props.push({ img: sp.raceBooth, x: 7 * 16, y: 10 * 16 - 64, flat: true, base: 0 });
    w.props.push({ img: null, x: 0, y: 0, base: 0, hit: [7 * 16, 6 * 16, 12 * 16, 10 * 16], talk: () => S.raceBooth() });
    w.blockTiles(7, 6, 5, 4);
    w.props.push({
      img: null, x: 0, y: 0, base: 9 * 16,
      draw(ctx, cx, cy) {
        const r = w.race, cols = ['#e83030', '#38c858', '#f0c830'];
        const fill = r ? [r.kids[0], Math.min(1, r.nate / RACE_NEED), r.kids[1]] : [0, 0, 0];
        for (let i = 0; i < 3; i++) {
          if (r && r.popped === i) continue;
          const rad = 2 + Math.round(fill[i] * 7), bx = RACE_X[i] - cx, by = 6 * 16 + 11 - rad - cy;
          ctx.fillStyle = cols[i]; ctx.beginPath(); ctx.arc(bx + 0.5, by + 0.5, rad, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ffffff'; ctx.fillRect(bx - (rad >> 1), by - (rad >> 1), 1, 1);
        }
      },
    });
    w.add(new G.SprayTarget([RACE_X[1] - 9, 7 * 16 + 4, RACE_X[1] + 9, 9 * 16], () => { const r = w.race; if (r && r.on) r.nate++; }));
    w.raceKids = [0, 2].map((lane, k) => w.add(new G.NPC({ sprite: 'raceKid' + (k + 1), name: 'Kid', x: RACE_X[lane], y: RACE_Y, dir: 'up', talk: S.raceKid(k) })));
  }

  // ---- the high striker
  // the puck flies up to k (0-1, 1 = the bell) and drops back down
  const strikerPuck = (w, k) => ({
    start() { this.t = 0; },
    update() {
      const up = 22, down = 30;
      this.t++;
      w.striker.puck = this.t <= up ? k * Math.sin((this.t / up) * Math.PI / 2) : k * Math.max(0, 1 - ((this.t - up) / down) ** 2);
      return this.t >= up + down;
    },
  });
  S.highStriker = function* () {
    const f = flags(), s = G.state, w = G.play.world, abe = s.party.includes('abe');
    if (f.reach_bell) { yield G.say(null, 'The high striker. The carny put up a new sign: NO REACHING.'); return; }
    yield G.say('Carny', 'TEST YOUR STRENGTH! Ring the bell, win the TOP PRIZE!');
    const c = yield G.ask('Carny', 'Five teeth a swing. Step right up!', abe ? ['Swing (5 teeth)', 'Get Abe', 'No thanks'] : ['Swing (5 teeth)', 'No thanks']);
    if (abe && c === 1) {
      // (Nate steps aside, and the camera looks up at the bell)
      yield G.walkTo(P(), 1.4 * 16, 11 * 16 + 10, 1.2);
      P().dir = 'up';
      yield G.camFocus(3 * 16, 8.8 * 16, 24);
      yield* S.abeReach('bell');
      yield G.camFocus(null, null, 20);
      return;
    }
    if (c !== 0) return;
    if (s.teeth < 5) { yield G.say('Carny', 'Come back with five teeth, pal.'); return; }
    G.play.addTeeth(-5);
    const doron = G.with('doron');
    if (doron) yield G.say('Doron', 'Step aside. Let a professional work.');
    yield G.say(null, (doron ? 'Doron' : 'Nate') + ' grabs the mallet and swings with everything he\'s got.');
    G.audio.sfx('hit'); G.play.shake(doron ? 10 : 4, doron ? 3 : 1);
    yield strikerPuck(w, doron ? 0.93 : 0.3);
    if (doron) {
      yield G.say('Carny', 'Ooh! SO close!');
      yield G.say('Doron', 'That bell is bolted down. That bell is BOLTED DOWN.');
      yield G.say('Carny', 'It is not bolted down.');
    } else yield G.say('Carny', 'Ooh. Noodle arms.');
    if (!f.strikerHint) {
      f.strikerHint = true;
      yield G.say('Nate', abe ? 'Nobody\'s swinging hard enough to ring that. ...But Abe is tall enough to just REACH it.' : 'Nobody\'s ringing that bell. Not without being, like, nine feet tall.');
    }
  };

  // ---- Hook-a-Duck
  S.duckBooth = function* () {
    const f = flags(), s = G.state;
    if (f.goldenDuck) { yield G.say('Carny', 'Hook-a-duck! Every duck\'s a winner! ...There is no golden duck. There was never a golden duck.'); return; }
    yield G.say('Carny', 'Hook-a-duck! Every duck\'s a winner! Hook the GOLDEN duck and win the GRAND PRIZE!');
    yield G.say(null, 'The golden duck bobs in a little tub way in the back of the booth. The duck poles are about two feet long.');
    if (!f.duckSeen) { f.duckSeen = true; yield G.say('Nate', 'Nobody can reach that with these little poles.'); yield G.say('Carny', 'Can\'t imagine why, pal.'); }
    const c = yield G.ask('Carny', 'One duck, five teeth!', ['Play (5 teeth)', 'No thanks']);
    if (c === 0) {
      if (s.teeth < 5) { yield G.say('Carny', 'Come back with five teeth, pal.'); return; }
      G.play.addTeeth(-5);
      f.duckPrize = ((f.duckPrize || 0) + 1) % 5;
      yield G.say(null, 'Nate hooks a rubber duck with the little pole.');
      yield G.say('Carny', 'A winner! Your prize: ' + ['a plastic spider ring.', 'a sticker of a different duck.', 'one bouncy ball. Do not bounce it near me.', 'a very small comb.', 'a whistle. Please don\'t.'][f.duckPrize]);
      yield G.say(null, 'Nate puts it in his pocket. It is never seen again.');
    }
    if (s.items.rod && !f.duckRodHint) {
      f.duckRodHint = true;
      yield G.say('Nate', '...Wait. I have a SURF ROD.');
      yield G.say(null, '(Put the Surf Rod on X, stand right in front of the golden duck, and cast.)');
    }
  };
  // the golden duck, reeled in on a surf rod (the bottom has the sacred number on it)
  S.goldenDuck = function* (duck) {
    const f = flags();
    if (f.goldenDuck) return;
    f.goldenDuck = true;
    duck.dead = true;
    yield G.itemGet(G.spr.goldenDuck.right, 'You hooked the {y}Golden Duck{/}!');
    yield G.say('Carny', 'HEY! That\'s not a duck pole!');
    yield G.say('Nate', 'You never said it had to be a duck pole.');
    yield G.say('Carny', '...I never said it had to be a duck pole.');
    yield G.say('Carny', 'Fine. Every duck\'s got a number on the bottom. Read it out loud, and the grand prize is yours.');
    yield G.say(null, 'Nate turns the golden duck over. Painted on the bottom, in gold: the sacred number.');
    yield G.say('Nate', 'It\'s... five. Plus one.');
    yield G.say('Carny', 'Just say the number, pal.');
    yield G.say('Nate', 'It\'s the one between five and seven.');
    yield G.say('Carny', '...Close enough.');
    yield G.say(null, 'The grand prize: a stuffed banana as big as Doron. There is no way it fits in the car.');
    yield G.say('Carny', 'Tell you what. I\'ll buy it back. A hundred and fifty teeth.');
    G.play.addTeeth(150);
    G.audio.sfx('tooth');
    yield G.say(null, 'Nate sells the banana back for {y}150 shark teeth{/}.');
  };

  // ---- the water-gun race
  S.raceKid = (k) => function* () {
    const won = flags().raceWon;
    yield G.say('Kid', [
      won ? 'You used a BIDET. I\'m telling.' : 'I\'ve won this like nine times. My mom is very proud.',
      won ? 'Can I try the bidet? ...Can I at least HOLD the bidet?' : 'The trick is you have to really believe in the clown.',
    ][k]);
  };
  // during a race (from the fair's tick): the kids' balloons fill on their own; Nate's fills
  // only while his stream is in the clown's mouth
  G.raceTick = (w) => {
    const r = w.race;
    if (!r || !r.on || G.script.busy) return;
    r.t++;
    // (the wrestlers wandering the fair hold still and watch: no body slams mid-race)
    for (const e of w.ents) if (e instanceof G.Wrestler && !e.dead) e.calm = 2;
    r.kids = r.kids.map((k, i) => Math.min(1, k + RACE_KID[i]));
    if (r.nate >= RACE_NEED) { r.on = false; G.script.run(S.raceEnd(true)); return; }
    if (r.kids.some((k) => k >= 1)) { r.on = false; G.script.run(S.raceEnd(false)); }
  };
  S.raceBooth = function* () {
    const f = flags(), s = G.state, w = G.play.world, p = P();
    if (w.race) return;
    yield G.say('Carny', f.raceWon ? 'Oh no. Not you again.' : 'WATER RACE! Squirt the clown in the mouth to fill your balloon. Pop it first and WIN!');
    const c = yield G.ask('Carny', 'Five teeth a race. You in?', ['Race (5 teeth)', 'No thanks']);
    if (c !== 0) return;
    if (s.teeth < 5) { yield G.say('Carny', 'Come back with five teeth, pal.'); return; }
    const bidet = !!s.items.bidet;
    if (bidet && s.xItem !== 'bidet') { yield G.say('Nate', 'Wait. I have a better idea.'); yield G.say(null, '(Put the Portable Bidet on X first.)'); return; }
    if (bidet && G.bidetWater() < RACE_NEED + 10) { yield G.say('Nate', 'Wait. My bidet\'s almost empty.'); yield G.say(null, '(Fill it up first. The Hook-a-Duck trough next door is full of water.)'); return; }
    G.play.addTeeth(-5);
    yield G.walkTo(p, RACE_X[1], RACE_Y, 1.4);
    p.dir = 'up';
    if (bidet && !f.raceBidet) {
      f.raceBidet = true;
      yield G.say('Nate', 'Mind if I use my own?');
      yield G.say(null, 'Nate holds up the Portable Bidet.');
      yield G.say('Carny', 'Is that... a BIDET?');
      yield G.say('Nate', 'The rules don\'t say I can\'t.');
      yield G.say('Carny', '...The rules don\'t say you can\'t.');
    }
    w.race = { on: false, t: 0, nate: 0, kids: [0, 0], popped: -1 };
    for (const t of ['READY...', 'SET...']) { G.audio.sfx('blip'); w.pop(RACE_X[1], 84, t, '#f8f8f0'); yield G.wait(36); }
    G.audio.sfx('bell');
    w.pop(RACE_X[1], 84, 'GO!', '#f8e070');
    if (bidet) {
      // (the race runs in G.raceTick: hold X with the stream in the clown's mouth)
      w.race.on = true;
      if (!f.raceTip) { f.raceTip = true; w.pop(p.x, p.y - 34, 'Hold X! Keep it in the clown\'s mouth!', '#a8d8ff'); }
      return;
    }
    // with the booth's squirt gun, Nate doesn't stand a chance
    yield {
      update() {
        const r = w.race;
        r.kids[0] = Math.min(1, r.kids[0] + 1 / 220); r.kids[1] = Math.min(1, r.kids[1] + 1 / 200);
        r.nate = Math.min(RACE_NEED * 0.3, r.nate + 0.1);
        if (G.tick % 10 === 0) w.burst(RACE_X[1], 9 * 16 - 2, ['#a8d8ff', '#ffffff'], 1, { speed: 0.3, up: 0.2, g: 0.1, life: 10, size: 1 });
        return r.kids[1] >= 1;
      },
    };
    yield* S.raceEnd(false, true);
  };
  S.raceEnd = function* (win, gun) {
    const f = flags(), s = G.state, w = G.play.world, r = w.race;
    const lane = win ? 1 : r.kids[0] >= r.kids[1] ? 0 : 2;
    r.on = false; r.popped = lane;
    G.audio.sfx('pop');
    w.burst(RACE_X[lane], 6 * 16 + 4, [['#e83030', '#38c858', '#f0c830'][lane], '#ffffff'], 12, { speed: 1.6, life: 18, size: 2 });
    w.pop(RACE_X[lane], 6 * 16 - 8, 'POP!', '#f8f8f0');
    yield G.wait(30);
    if (!win) {
      yield G.say('Carny', 'And the winner is... NOT YOU! Better luck next time, pal.');
      if (gun) {
        yield G.say('Nate', 'This squirt gun has the water pressure of a drinking fountain.');
        if (!f.raceGunHint) { f.raceGunHint = true; yield G.say('Nate', 'I need something with WAY more pressure.'); }
      } else yield G.say('Nate', 'I have to keep it IN the clown\'s mouth.');
    } else {
      yield G.say('Kid', 'He used a BIDET.');
      yield G.say('Carny', '...Winner winner.');
      if (!f.raceWon) {
        f.raceWon = true; f.bidetNozzle = true;
        yield G.say('Carny', 'Grand prize: a turbo nozzle. Fits any squirt gun. ...Or whatever that is.');
        G.audio.sfx('chest');
        yield G.itemGet(G.spr.nozzleIcon, 'Your Portable Bidet got a {y}Turbo Nozzle{/}! It sprays way farther now.');
        yield G.say('Nate', 'It fits PERFECTLY.');
        yield G.say('Carny', 'Please never come back.');
      } else {
        G.play.addTeeth(10);
        yield G.say(null, 'The carny slides over {y}10 shark teeth{/} without making eye contact.');
      }
    }
    w.race = null;
  };

  // ---- the Science Center: Dr. Nataro upgrades the bidet's tank (a spare lab carboy)
  S.safetyShower = function* () {
    const f = flags(), s = G.state;
    if (!s.items.bidet) {
      yield G.say(null, 'The emergency shower and eyewash station. A big green sign: PULL ONLY IN AN EMERGENCY.');
      yield G.say('Dr. Nataro', 'Do NOT touch that unless something is on fire. Or in your eyes. Or both.');
      return;
    }
    if (f.bidetBig) { yield G.say(null, 'The emergency shower and eyewash station. There\'s one less spare jug on the shelf under it.'); return; }
    yield G.say(null, 'The emergency shower and eyewash station. The eyewash runs off a big jug of water on a shelf underneath.');
    yield G.say('Nate', 'That\'s a LOT of water...');
    yield G.say(null, 'Nate holds the Portable Bidet up next to the jug.');
    yield G.say('Dr. Nataro', 'Nate. Is that a BIDET?');
    yield G.say('Dr. Nataro', 'In MY lab?');
    yield G.say('Nate', 'It\'s a long story. It only holds about a cup of water.');
    yield G.say('Dr. Nataro', '...That tank is pathetic. Give it here.');
    yield G.say(null, 'Dr. Nataro unscrews the little tank and hooks the bidet up to a spare jug from under the eyewash. Lab tape. A LOT of lab tape.');
    f.bidetBig = true;
    s.items.bidetWater = G.BIDET_MAX;
    G.audio.sfx('chest');
    yield G.itemGet(G.spr.carboyIcon, 'Your Portable Bidet got a {y}Lab Carboy Tank{/}! It holds twice the water now, and fills up twice as fast.');
    yield G.say('Dr. Nataro', 'Now get that thing out of my lab. And return my carboy. Eventually. Never.');
  };

  // The little cave under the fairgrounds (past the protest): a limestone hollow
  // with a still pool, and cave pearls on the bottom of it.
  S.cavePool = function* () {
    const f = flags();
    if (f.cavePearl) { yield G.say('Nate', 'The rest of the cave pearls stay right here. Some things belong in caves.'); return; }
    yield G.say(null, 'A still little pool under a dripping ceiling. The bottom is covered in smooth, round white stones.');
    yield G.say('Nate', 'No way. Are those... CAVE PEARLS?');
    f.cavePearl = true;
    yield* S.rockGive('cavepearl');
    yield G.say('Nate', 'Just one. The rest stay here. Some things belong in caves.');
  };
  G.MAPS.fairCave = {
    name: 'The Cave Under the Fair',
    music: 'mine',
    tiles() {
      const W = 15, H = 10;
      const g = Array.from({ length: H }, () => Array(W).fill('w'));
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) g[y + j][x + i] = c; };
      fill(6, 0, 2, 3, '@');   // the way in, from the trail
      fill(2, 3, 11, 6, '@');  // the chamber
      fill(9, 7, 3, 2, '~');   // a still little pool in the back
      for (let y = 0; y < H - 1; y++) for (let x = 0; x < W; x++) if (g[y][x] === 'w' && g[y + 1][x] !== 'w') g[y][x] = '&';
      return g.map((r) => r.join(''));
    },
    setup(w) {
      w.addProp({ img: G.spr.cavePearls, tx: 9, ty: 7, h: 2, dx: 11, dy: -9, flat: true });
      w.addProp({ tx: 9, ty: 7, h: 2, hit: [9, 7, 3, 2], talk: S.cavePool });
      w.addTrigger(6, 0, 2, 1, () => G.play.warp('fair', 20, 29, 'up'));
    },
    // drips from the ceiling into the pool
    tick(w) {
      if (G.tick % 64) return;
      w.fx.push({ x: 9 * 16 + 8 + Math.floor(Math.random() * 3) * 16, y: 5 * 16, vx: 0, vy: 1.4, life: 26, color: '#a8d8f0', size: 1 });
    },
    // daylight from the trail fades into the dark
    tint(ctx) {
      const p = G.play.player, cam = G.play.cam;
      if (!p) return;
      const x = Math.round(p.x - cam.x), y = Math.round(p.y - 10 - cam.y), r = 72 + Math.sin(G.tick * 0.13) * 2;
      const grad = ctx.createRadialGradient(x, y, r * 0.3, x, y, r);
      grad.addColorStop(0, 'rgba(6,8,14,0)');
      grad.addColorStop(1, 'rgba(6,8,14,0.92)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, G.W, G.H);
    },
    onEnter() {
      return (function* () {
        if (flags().caveSeen) return;
        flags().caveSeen = true;
        yield G.wait(20);
        yield G.say('Nate', 'Limestone. The whole Lehigh Valley sits on it, and it\'s full of holes like this.');
      })();
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
      if (flags().dadBeaten && !flags().homeArrived) w.add(new G.NPC({ sprite: 'dad', name: 'Dad', x: 7 * 16 + 8, y: 15 * 16 + 14, dir: 'left', talk: S.dadArena }));
      // everyone Nate gave one of Doron's tickets to shows up ringside
      [['superfan', 'Superfan', 5, 8, 'right'], ['rose', 'Grandma Rose', 18, 8, 'left'], ['gus', 'Gus', 5, 10, 'right'], ['ben', 'Ben', 18, 10, 'left']]
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

  // ================================================================ ABE AND HANNAH'S CONDO (Chesapeake)
  // Their condo by the golf course: the left half (Unit A) of a duplex, built
  // from the listing photos and Abe's answers about the layout. Hannah is at
  // work (she joins on the next level).
  // These maps are turned so their blue front door faces the camera:
  //   up = east (Unit B, the neighbors)    down = west (their front walk)
  //   left = north (the patio, the yard, the trees, then the golf course)
  //   right = south (the street side: the storage garage door and Unit B's front)
  // FURNITURE: Abe is sending photos of their furniture. Each room below has a
  // "FURNITURE (photos pending)" note with its open floor and wall spots, in tiles.

  // Jump an entity to (x, y) in an arc (z = height off the ground), ignoring collision.
  const hop = (e, x, y, h = 24, n = 24) => ({
    start() { this.t = 0; this.x0 = e.x; this.y0 = e.y; e.walking = true; },
    update() {
      const k = Math.min(1, ++this.t / n);
      e.x = this.x0 + (x - this.x0) * k; e.y = this.y0 + (y - this.y0) * k;
      e.z = Math.sin(k * Math.PI) * h;
      e.dir = G.dirToward(x - this.x0, y - this.y0);
      if (k < 1) return false;
      e.z = 0; e.walking = false;
      return true;
    },
  });

  // Abe has been crouched behind the big bush by the corner, waiting.
  S.abeScare = function* () {
    const f = flags(), w = G.play.world, p = P();
    if (f.condoScare) return;
    f.condoScare = true;
    const fol = w.ents.find((e) => e instanceof G.Follower && !e.dead);
    if (fol) fol.hold = true;
    const abe = w.add(new G.NPC({ sprite: 'abe', name: 'Abe', x: 18 * 16, y: 18 * 16 + 12, dir: 'right' }));
    G.audio.sfx('dash');
    yield hop(abe, Math.max(19 * 16 + 8, p.x - 28), p.y, 26, 22);
    abe.dir = 'right';
    G.audio.sfx('yell');
    G.play.shake(18, 3);
    w.pop(abe.x, abe.y - 48, 'RAAAAAH!', '#ffa848');
    yield G.together(
      G.emote(p, 'bang', 36), fol && G.emote(fol, 'bang', 36),
      G.walkTo(p, p.x + 14, p.y + 4, 2.6), fol && G.walkTo(fol, fol.x + 12, fol.y + 6, 2.6),
    );
    p.dir = 'left';
    if (fol) fol.dir = 'left';
    yield G.say('Nate', 'ABE!!');
    if (G.with('lily')) {
      yield G.say('Lily', 'No. NO. Absolutely not. No.');
      yield G.say('Abe', 'Got you. Got BOTH of you.');
    } else if (G.with('doron')) {
      yield G.say('Doron', 'I could see your hat sticking out of that bush from the street.');
      yield G.say('Abe', '...Nate couldn\'t.');
    } else {
      yield G.say('Abe', 'Got you. Got you SO good.');
    }
    yield G.say('Abe', 'You made it! Welcome to Chesapeake.');
    yield G.say('Nate', 'Where\'s Hannah?');
    yield G.say('Abe', 'At work. She\'ll be home later.');
    yield G.say('Abe', 'Oh, quick question. How many strings are on a guitar?');
    const c = yield G.ask('Nate', 'How many strings are on a guitar...', ['Six!', 'One more than five.', 'Not answering that.']);
    if (c === 0) {
      yield* slip();
      yield G.say('Abe', 'GOT HIM.');
    } else if (c === 1) {
      yield G.say('Abe', '...He\'s learning.');
    } else {
      yield G.say('Abe', 'Coward.');
    }
    yield G.say('Abe', 'Come on in. Door\'s open.');
    yield G.walkTo(abe, 23 * 16 + 8, 19 * 16 + 4, 1.4);
    yield G.walkTo(abe, 23 * 16 + 8, 17 * 16 + 12, 1.4);
    G.audio.sfx('door');
    abe.dead = true;
    if (fol) fol.hold = false;
    G.play.autosave();
  };

  // Abe, inside, after the scare.
  S.abeCondo = function* () {
    const f = flags();
    if (G.romChase()) {
      const i = f.romHide || 0;
      if (i < ROM_SPOTS.length) yield G.say('Abe', ROM_SPOTS[i].abe);
      else yield G.say('Abe', 'He got OUTSIDE? I can hear him whimpering. Somewhere ' + (ROM_OUT[f.romSpot] || ROM_OUT[0]).area + ', I think. That\'s all I\'ve got.');
      return;
    }
    if (f.romToGolf && !f.romulusBeaten) { yield* S.abeSloth(); return; }
    if (f.bassGiven && f.romulusBeaten && !f.abeBassAsk) { yield* S.abeBass(); return; }
    f.abeLine = ((f.abeLine || 0) + 1) % 3;
    yield G.say('Abe', [
      'Hannah gets off work later. Make yourselves at home.',
      'The yellow cables in the storage room are inventory. Do NOT touch the inventory.',
      'I\'m working from home today. Technically. My office is upstairs.',
    ][f.abeLine]);
  };

  S.abeBass = function* () {
    flags().abeBassAsk = true;
    yield G.say('Abe', 'Hey, have you seen my bass? The one in the black case?');
    yield G.say('Nate', '...It\'s at El Toro Loco. With a woman who looks exactly like Paul McCartney.');
    yield G.say('Abe', '......');
    yield G.say('Abe', 'Okay. Honestly? That\'s where it belongs.');
  };
  // ---------------------------------------------------------------- Abe: he's 6'5"
  // Once Abe joins (after the Romulus fight), he gets things down from way up high, and boosts
  // Nate over the tall hedge around Anette's old garden. If he's in the party but somebody else
  // is following Nate, he's called in (S.callIn). `at` is where Abe stands to reach (tiles).
  const ABE_REACH = {
    fridge: {
      map: 'condoDown', at: [11, 4.75],
      look: 'A stainless fridge. Nate checks it, just in case. Nobody\'s inside. Good.',
      high: 'There\'s something on top of the fridge, way at the back. Way too high.',
      after: 'A stainless fridge. Nothing on top of it anymore. Hannah may never know.',
      lines: [['Abe', 'My emergency stash. Hannah can\'t reach it up here.'], ['Nate', 'Hannah is five foot two.'], ['Abe', 'That\'s the point.']],
      *reward() {
        const s = G.state;
        s.items.doosh = (s.items.doosh || 0) + 1; flags().hadDoosh = true;
        G.audio.sfx('chest');
        yield G.itemGet(G.spr.doosh, 'Abe hands down a {y}Doosh De Luche{/}!');
      },
    },
    bookshelf: {
      map: 'condoUp', at: [2, 4.75],
      look: 'A tall bookshelf packed with books, flowers on top, and a little lighthouse lamp glowing on the bottom shelf.',
      high: 'There\'s a shoebox way up on top of the bookshelf, behind the flowers. Way too high.',
      after: 'A tall bookshelf packed with books, flowers on top, and a little lighthouse lamp glowing on the bottom shelf.',
      lines: [['Abe', 'My shark tooth collection! From when I was a kid. I hid it up here so Romulus wouldn\'t eat it.'], ['Nate', 'Abe. Some of these are just rocks.'], ['Abe', 'Don\'t tell me which ones.']],
      *reward() { yield* S.bossStash(30, 'Abe gives you his old collection: {y}30 shark teeth{/}. (Probably.)'); },
    },
    kite: {
      map: 'condo', at: [40.5, 15.75],
      look: 'A big tree on the island in the visitor parking.',
      high: 'There\'s a kite stuck way up in the tree, with a little pouch tied to its tail. Way too high.',
      after: 'A big tree on the island in the visitor parking. No more kite.',
      lines: [['Abe', 'Somebody tied a pouch of shark teeth to a kite.'], ['Nate', 'Some kid is going to be very sad.'], ['Abe', 'Some kid should have known better.']],
      *reward() { yield* S.bossStash(20, 'The pouch has {y}20 shark teeth{/} in it.'); },
    },
    giftShop: {
      map: 'chkdLobby', at: [19.5, 11.75],
      look: 'The gift shop: teddy bears, balloons, and a lot of very soft things. Nobody\'s at the register.',
      high: 'Way up on the top shelf, there\'s a stuffed shark with a little pouch tied to its fin. Way too high.',
      after: 'The gift shop. There\'s a note at the register: "IOU one shark. -Nate"',
      lines: [['Abe', 'A stuffed shark. With a pouch of REAL shark teeth on it.'], ['Nate', 'A Number One Ditch souvenir! ...I\'ll leave a note at the register.']],
      *reward() { yield* S.bossStash(25, 'The pouch has {y}25 shark teeth{/} in it.'); },
    },
    // back at the fair: the high striker (S.highStriker calls this once Abe's in the party)
    bell: {
      map: 'fair', at: [2.7, 10.6],
      look: 'The high striker. TEST YOUR STRENGTH!',
      high: 'The bell, way up at the top of the high striker. Way too high.',
      after: 'The high striker. The carny put up a new sign: NO REACHING.',
      reach: 'Abe reaches up and flicks the bell with one finger.', sfx: 'bell',
      onReach() { const w = G.play.world; if (w.striker) { w.striker.ding = 60; w.pop(2 * 16, 10 * 16 - 70, 'DING!', '#f8e070'); } },
      lines: [['Carny', '...'], ['Carny', 'That doesn\'t count.'], ['Abe', 'It rang.'], ['Carny', '...It rang.']],
      *reward() {
        const s = G.state;
        yield G.say('Carny', 'Fine. FINE. Top prize.');
        s.maxHp += 2; s.hp = s.maxHp;
        G.audio.sfx('heart');
        yield G.itemGet(G.spr.heartBig, 'The top prize: a heart-shaped pillow that says I RANG THE BELL. It\'s a {r}Heart Container{/}! Max hearts +1.');
        yield G.say('Abe', 'You keep it. I\'ve got plenty of heart.');
      },
    },
    // back home: the attic hatch in the upstairs hallway
    attic: {
      map: 'homeUp', at: [13.4, 11.6],
      look: 'The attic hatch, up in the hallway ceiling. The pull cord snapped off years ago, and nobody can find the ladder.',
      high: 'The attic hatch, up in the hallway ceiling. Way too high.',
      after: 'The attic hatch. Abe tied a new pull cord on it, up where only Abe can reach it.',
      reach: 'Abe reaches up, pops the hatch open, and feels around in the attic. He doesn\'t even need the ladder.',
      lines: [['Abe', 'Got something. A shoebox. Mom wrote on the lid: OLD PHOTOS (DO NOT LET DAD LABEL).'], ['Nate', 'Why can\'t Dad label?'], ['Abe', 'He labeled the Christmas decorations "MISC. JOY."']],
      *reward() { yield* S.photoGive('atticSelfie'); },
    },
  };
  G.abeReachCount = () => Object.keys(ABE_REACH).filter((id) => flags()['reach_' + id]).length + (flags().gardenOpen ? 1 : 0);
  // (every spot, and the hedge)
  G.ABE_REACH_TOTAL = Object.keys(ABE_REACH).length + 1;
  const abeFollower = () => G.play.world.ents.find((e) => e instanceof G.Follower && e.id === 'abe' && !e.dead);
  S.abeReach = function* (id) {
    const f = flags(), s = G.state, spot = ABE_REACH[id];
    if (f['reach_' + id]) { yield G.say(null, spot.after); return; }
    if (!s.party.includes('abe')) {
      yield G.say(null, spot.look);
      yield G.say(null, spot.high);
      return;
    }
    yield G.say(null, spot.high.replace(' Way too high.', ''));
    yield* S.callIn('abe', 'Need something from up high?');
    const abe = abeFollower();
    if (abe) {
      abe.hold = true;
      yield G.walkTo(abe, spot.at[0] * 16, spot.at[1] * 16, 1.6);
      abe.dir = 'up'; abe.pose = 'hold'; abe.moving = false;
    }
    if (spot.sfx) G.audio.sfx(spot.sfx);
    if (spot.onReach) spot.onReach();
    yield G.say(null, spot.reach || 'Abe reaches up and grabs it. He doesn\'t even go up on his tiptoes.');
    if (abe) abe.pose = null;
    f['reach_' + id] = true;
    for (const [who, line] of spot.lines) yield G.say(who, line);
    yield* spot.reward();
    if (abe) abe.hold = false;
  };

  // The tall hedge around Anette's old garden (up by her place): the gate latch rusted shut from
  // the inside years ago, and her knees can't get her over it. Abe boosts Nate over; Nate gets
  // the gate open from inside, and Anette gets her garden back (and gives Nate a heart container).
  S.gardenHedge = function* () {
    const f = flags(), s = G.state, p = P(), w = G.play.world;
    if (f.gardenOpen) { yield G.say(null, 'Anette\'s garden, behind a tall hedge. The gate is open now.'); return; }
    if (p.y < 4 * 16) { yield* S.gardenGateOpen(); return; }
    yield G.say(null, 'A tall hedge, way over Nate\'s head. There\'s a little wooden gate in it, latched shut from the inside.');
    if (!s.party.includes('abe')) { yield G.say('Nate', 'There\'s no way over that. Not without a ladder. Or somebody really tall.'); return; }
    yield* S.callIn('abe', 'Need a boost?');
    const abe = abeFollower();
    const x = G.clamp(p.x, 14 * 16 + 8, 17 * 16 + 8);
    yield G.walkTo(p, x, 5 * 16 + 10, 1.2);
    p.dir = 'up';
    if (abe) {
      abe.hold = true;
      yield G.walkTo(abe, x + 14, 5 * 16 + 12, 1.6);
      abe.dir = 'up'; abe.pose = 'hold'; abe.moving = false;
    }
    yield G.say('Abe', 'Foot in my hands. On three. One, two...');
    G.audio.sfx('swing');
    yield hop(p, x, 3 * 16 + 12, 40, 30);
    p.dir = 'down';
    if (abe) abe.pose = null;
    yield G.say('Abe', '...I didn\'t say three.');
    yield G.say('Nate', 'Whoa. A whole garden back here. Roses, a birdbath... and the gate\'s latched shut from this side.');
    f.gardenIn = true;
  };
  S.gardenGateOpen = function* () {
    const f = flags(), s = G.state, p = P(), w = G.play.world, an = w.anette;
    yield G.say(null, 'The gate\'s latch is rusted solid. Nate gives it a whack with his rock hammer.');
    G.audio.sfx('clank'); G.play.shake(6, 1);
    yield G.wait(20);
    G.audio.sfx('door');
    f.gardenOpen = true;
    w.gardenGate.img = G.spr.gardenGateOpen;
    w.block[4 * w.w + 16] = 0;
    const abe = abeFollower();
    if (abe) abe.hold = false;
    yield G.say(null, 'The gate creaks open!');
    if (an) {
      yield G.wait(20);
      yield G.walkTo(an, 19 * 16 + 8, 7 * 16 + 12, 1);
      yield G.walkTo(an, 16 * 16 + 8, 5 * 16 + 12, 1);
      an.dir = 'up';
      yield G.say('Anette', 'Oh! Oh my goodness. My GARDEN!');
      yield G.say('Anette', 'That latch rusted shut years ago, and my knees can\'t get over that hedge. I\'ve been peeking at it through the leaves ever since.');
      yield G.say('Nate', 'Abe gave me a boost.');
      if (G.with('abe')) yield G.say('Abe', 'I\'m six foot five. It\'s what I do.');
      yield G.say('Anette', 'My roses are still blooming! Here, dear. This has been sitting under the birdbath the whole time. I always said whoever got that gate open could have it.');
      s.maxHp += 2; s.hp = s.maxHp;
      G.audio.sfx('heart');
      yield G.itemGet(G.spr.heartBig, 'You got a {r}Heart Container{/}! Max hearts +1.');
      yield G.walkTo(an, 16 * 16 + 8, 3 * 16 + 12, 1);
      yield G.walkTo(an, 15 * 16 + 8, 2 * 16 + 12, 1);
      an.dir = 'down';
    } else {
      s.maxHp += 2; s.hp = s.maxHp;
      G.audio.sfx('heart');
      yield G.itemGet(G.spr.heartBig, 'Under the birdbath: a {r}Heart Container{/}! Max hearts +1.');
    }
    G.play.autosave();
  };

  // Romulus is out on the golf course: the only thing that'll bring him back is his sloth, and
  // Abe left it at El Toro Loco
  S.abeSloth = function* () {
    const f = flags();
    if (!f.slothQuest) {
      yield G.say('Abe', 'He went through the WOODS? Onto the course?');
      yield G.say('Nate', 'And the gap is way too small for me.');
      yield G.say('Abe', 'He won\'t come back on his own. Not for me, not for treats. Not for anybody.');
      yield G.say('Abe', '...Except his SLOTH.');
      yield G.say('Nate', 'His what?');
      yield G.say('Abe', 'His sloth. Big, fluffy, long white claws. It squeaks. It\'s his favorite thing in the whole world. He\'d come running from anywhere for that squeak.');
      yield G.say('Nate', 'Great! Where is it?');
      yield G.say('Abe', '......');
      yield G.say('Abe', 'I took it to El Toro Loco last night.');
      yield G.say('Nate', 'Why did you bring a dog toy to a Mexican restaurant?');
      yield G.say('Abe', 'It was in my jacket pocket. Why are YOU asking so many questions?');
      yield G.say('Abe', 'It must have fallen out in the booth. El Toro Loco is down the main road, off the bottom of the street.');
      f.slothQuest = 1;
      return;
    }
    yield G.say('Abe', {
      1: 'El Toro Loco is down the main road, off the bottom of the street. Get that sloth!',
      2: 'How\'s it going at El Toro Loco? ...Why are you looking at my closet like that?',
      3: 'You got his SLOTH! Squeak it at the woods out back. He can\'t resist that squeak.',
    }[f.slothQuest] || 'Romulus is out on the course? And he\'s HUGE? ...Go get him!');
  };

  // the black case in Abe's closet: a bass (once the Paul McCartney Lady needs one)
  S.closetCase = function* () {
    const f = flags(), s = G.state;
    if (f.bassGiven) { yield G.say(null, 'The black guitar case. Empty. Its bass is at El Toro Loco, being played upside down.'); return; }
    if (s.items.abeBass) { yield G.say(null, 'The black guitar case. Empty. Nate has the bass.'); return; }
    if (f.slothQuest !== 2) { yield G.say(null, 'A black guitar case. Probably a guitar in it. Probably.'); return; }
    yield G.say(null, 'Nate opens the black case...');
    G.audio.sfx('chest');
    s.items.abeBass = true;
    yield G.itemGet(G.spr.abeBassIcon, 'You got {y}Abe\'s Bass{/}!');
    yield G.say('Nate', 'A sunburst bass! Abe has a BASS too?');
    yield G.say('Nate', 'He has so many guitars, he won\'t even notice.');
  };
  // the yellow guitar cables in the storage room (Abe's "inventory")
  S.storageCable = function* (text) {
    const f = flags(), s = G.state;
    if (f.slothQuest !== 2 || s.items.yellowCable || f.bassGiven) { yield G.say(null, text); return; }
    yield G.say('Nate', 'Abe said not to touch the inventory.');
    yield G.say('Nate', '...He has thousands. He won\'t miss one.');
    yield G.say(null, 'Nate pulls out a yellow cable. It\'s tangled up with one, two, three, four, five...');
    yield G.say('Nate', '...a LOT of other cables.');
    yield G.say(null, 'It takes a while, but Nate gets it untangled.');
    G.audio.sfx('chest');
    s.items.yellowCable = true;
    yield G.itemGet(G.spr.cableIcon, 'You got a {y}Yellow Guitar Cable{/}!');
  };

  S.condoTraeger = look('Abe\'s Traeger pellet grill. It smells like hickory smoke.');

  // The top of their street leads back to the Bay Bridge-Tunnel.
  S.condoStreetEnd = function* () {
    const p = P();
    const c = yield G.ask('Nate', 'Head back to the Bay Bridge-Tunnel?', ['Back to the tunnel', 'Stay']);
    if (c === 0) G.play.warp('cbbtTunnel', 7, 2, 'down');
    else yield G.walkTo(p, p.x, p.y + 14, 1);
  };

  // ---------------------------------------------------------------- their street
  // From the user's photos and the satellite view. Across from their driveway: the
  // visitor parking (two spots on each side of a mulch island with a big tree), then
  // a mulch strip of round bushes and tall trees, then the main road. Their street
  // bends at the top over to the main road, and curves away at the bottom past the
  // neighbors. The asphalt and curbs are painted once onto one big canvas (smooth
  // curves that tiles can't do) and laid flat over the grass.
  const CONDO_STREET = (() => {
    const T = 16, street = new Path2D(), main = new Path2D();
    street.moveTo(56 * T, 2.5 * T);
    street.lineTo(43 * T, 2.5 * T);
    street.quadraticCurveTo(39.5 * T, 2.5 * T, 39.5 * T, 6 * T);
    street.lineTo(39.5 * T, 22 * T);
    street.quadraticCurveTo(39.5 * T, 34 * T, 14 * T, 41.5 * T);
    main.moveTo(56 * T, -2 * T); main.lineTo(56 * T, 42 * T);
    // the two halves of the visitor parking [x, y, w, h], flush with the street on their left
    const pockets = [[41 * T - 6, 8 * T, 3 * T + 6, 4 * T], [41 * T - 6, 17 * T, 3 * T + 6, 4 * T]];
    const probe = G.canvas(1, 1).getContext('2d');
    // is this point on a road (curbs included)?
    const onRoad = (x, y) => {
      probe.lineWidth = 48 + 8;
      if (probe.isPointInStroke(street, x, y)) return true;
      probe.lineWidth = 64 + 8;
      return probe.isPointInStroke(main, x, y);
    };
    return { street, main, pockets, onRoad, lane: 55 * T };
  })();
  let condoStreetArt = null;
  function condoStreetCanvas(pw, ph) {
    if (condoStreetArt) return condoStreetArt;
    const R = CONDO_STREET, c = G.canvas(pw, ph), x = c.getContext('2d');
    const CURB_D = '#86867e', CURB = '#c8c8c0', ASPH = '#4c4c56', CONC = '#b4b4bc';
    // the cream duplex's driveway runs in under the curb at the corner
    x.fillStyle = CONC; x.fillRect(37 * 16, 3 * 16, 2.5 * 16, 3 * 16);
    // curbs first (a dark line, then the curb top), then the asphalt over them
    x.lineJoin = 'round';
    for (const [grow, col] of [[8, CURB_D], [6, CURB], [0, ASPH]]) {
      x.strokeStyle = col; x.fillStyle = col;
      x.lineWidth = 48 + grow; x.stroke(R.street);
      x.lineWidth = 64 + grow; x.stroke(R.main);
      for (const [px, py, w, h] of R.pockets) x.fillRect(px, py - grow / 2, w + grow / 2, h + grow);
    }
    // crisp pixel edges (no smoothing), and speckles like the asphalt and concrete tiles
    const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const pal = [CURB_D, CURB, ASPH, CONC].map(rgb), speck = [null, null, ['#5e5e6a', '#3e3e48'].map(rgb), ['#c4c4cc', '#a0a0aa'].map(rgb)];
    const img = x.getImageData(0, 0, pw, ph), d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 128) { d[i + 3] = 0; continue; }
      let best = 0, bd = 1e9;
      for (let k = 0; k < pal.length; k++) { const q = pal[k], e = (d[i] - q[0]) ** 2 + (d[i + 1] - q[1]) ** 2 + (d[i + 2] - q[2]) ** 2; if (e < bd) { bd = e; best = k; } }
      let q = pal[best];
      const px = (i >> 2) % pw, py = Math.floor((i >> 2) / pw);
      if (speck[best] && G.hash(px, py, 41) < 0.05) q = speck[best][G.hash(px, py, 43) < 0.5 ? 0 : 1];
      d[i] = q[0]; d[i + 1] = q[1]; d[i + 2] = q[2]; d[i + 3] = 255;
    }
    x.putImageData(img, 0, 0);
    const dot = (col, px, py, w = 1, h = 1) => { x.fillStyle = col; x.fillRect(px, py, w, h); };
    // the stall lines in the visitor spots, and white river stones along the curb behind them
    for (const [, py, , h] of R.pockets) {
      for (const ly of [py + 1, py + 31, py + h - 2]) { dot('#e8e8e0', 660, ly, 42); dot('#c4c4bc', 660, ly + 1, 42); }
      for (let yy = py - 6; yy < py + h + 6; yy += 3) if (G.hash(yy, py, 47) < 0.7) { const sx = 709 + Math.floor(G.hash(yy, 3, 48) * 6); dot('#ece8e0', sx, yy, 2, 2); dot('#b8b4ac', sx + 1, yy + 1); }
    }
    for (let yy = 13 * 16 - 4; yy < 17 * 16 + 2; yy += 3) if (G.hash(yy, 9, 47) < 0.7) { const sx = 661 + Math.floor(G.hash(yy, 5, 48) * 6); dot('#ece8e0', sx, yy, 2, 2); dot('#b8b4ac', sx + 1, yy + 1); }
    // a manhole cover in the street, out past their driveway
    for (let dy = -3; dy <= 3; dy++) for (let dx = -7; dx <= 7; dx++) {
      if ((dx / 7.5) ** 2 + (dy / 3.6) ** 2 > 1) continue;
      dot(dy === -3 ? '#5a5a64' : (dy & 1) ? '#26262e' : '#34343c', 632 + dx, 19 * 16 + 4 + dy);
    }
    return (condoStreetArt = c);
  }
  // Off the bottom of the map: the street (and the main road) just keep going.
  S.condoNeighborhood = function* () {
    const p = P();
    if (p.x > 50 * 16 && flags().slothQuest) {
      const c = yield G.ask('Nate', 'Walk down the main road to El Toro Loco?', ['El Toro Loco', 'Stay']);
      if (c === 0) { G.play.warp('toroLoco', 2, 1, 'down'); return; }
      yield G.walkTo(p, p.x, p.y - 18, 1);
      return;
    }
    yield G.say('Nate', 'That way is just more of the neighborhood. Abe and Hannah\'s is back this way.');
    yield G.walkTo(p, p.x, p.y - 18, 1);
  };

  // ---------------------------------------------------------------- Anette's thirsty plants
  // Anette lives in the cream duplex at the corner. She keeps potted plants all up and down
  // the street, and her knees are done with watering cans. Water all five with the Portable
  // Bidet and she gives Nate the fossil scallop she found on the beach years ago.
  const ANETTE_PLANTS = [
    { id: 'hydrangea', kind: 'hydrangea', at: [27, 6], name: 'my hydrangea, right here by my door' },
    { id: 'petunia', kind: 'petunia', at: [14, 12], name: 'the petunias I put out on Abe and Hannah\'s patio' },
    { id: 'fern', kind: 'fern', at: [42, 6], name: 'the fern by the visitor parking' },
    { id: 'geranium', kind: 'geranium', at: [16, 30], name: 'the geraniums next door' },
    { id: 'rose', kind: 'rose', at: [31, 8], name: 'the little rosebush by the other half of Abe and Hannah\'s' },
  ];
  G.plantsWatered = () => ANETTE_PLANTS.filter((pl) => flags()['plant_' + pl.id]).length;
  S.plantLook = function* (plant) {
    const pl = ANETTE_PLANTS.find((q) => q.id === plant.id);
    if (plant.happy) { yield G.say(null, 'A potted ' + pl.kind + '. It perked right up. You can practically hear it say thank you.'); return; }
    yield G.say(null, 'A potted ' + pl.kind + '. Droopy, dry and crispy around the edges. It needs water.');
    if (flags().anetteMet && !G.itemHas('bidet')) yield G.say('Nate', 'One of Anette\'s. I need something to carry water in.');
  };
  S.anette = function* () {
    const f = flags(), n = G.plantsWatered();
    if (f.plantsDone) {
      f.anetteLine = ((f.anetteLine || 0) + 1) % 3;
      yield G.say('Anette', ['Look at my hydrangea! I could cry.', 'You come by anytime, dear. Bring the... water thing.', 'Abe and Hannah are lucky to have you visiting.'][f.anetteLine]);
      return;
    }
    if (!f.anetteMet) {
      f.anetteMet = true;
      yield G.say('Anette', 'Oh! Hello, dear. You must be visiting Abe and Hannah.');
      yield G.say('Anette', 'I\'m Anette. I keep potted plants all up and down this street. Everybody lets me.');
      yield G.say('Anette', 'But it\'s been so dry, and my knees are done with watering cans. My poor plants are wilting.');
      yield G.say('Anette', 'There are five of them. Would you give them a drink for me? I\'ll make it worth your while.');
      f.plantQuest = true;
      if (G.itemHas('bidet')) {
        yield G.say('Anette', '...Is that a portable bidet?');
        yield G.say('Nate', '...It sprays water.');
        yield G.say('Anette', 'Well. Water is water, dear.');
      } else {
        yield G.say('Anette', 'You\'ll need something to carry water in. Check Abe and Hannah\'s. Everybody has SOMETHING under the bathroom sink.');
      }
      yield G.say(null, 'Water Anette\'s five potted plants around the street.');
      if (n < 5) return;
    }
    if (n < 5) {
      const left = ANETTE_PLANTS.filter((pl) => !f['plant_' + pl.id]);
      yield G.say('Anette', n ? 'That\'s ' + G.sayable(n) + ' of my five! Keep going, dear.' : 'My poor plants. Five of them, all up and down the street.');
      yield G.say('Anette', 'Still thirsty: ' + left[0].name + (left.length > 1 ? ', and ' + (left.length - 1 === 1 ? 'one more' : G.sayable(left.length - 1) + ' more') : '') + '.');
      return;
    }
    // all five: the reward
    f.plantsDone = true;
    yield G.say('Anette', 'All five! Look at them! They haven\'t looked this good all summer.');
    yield G.say('Anette', 'Abe tells me you like rocks. Here, I want you to have this.');
    yield G.say('Anette', 'I found it on the beach years ago, after a big storm. It\'s a fossil scallop. Millions of years old.');
    yield* S.rockGive('chesapecten');
    yield G.say('Anette', 'Thank you, dear. Water them again sometime. With... whatever that is.');
  };

  // ---------------------------------------------------------------- outside
  G.MAPS.condo = {
    name: 'Abe & Hannah\'s Condo',
    music: 'home',
    tiles() {
      const W = 62, H = 40;
      const g = Array.from({ length: H }, (_, y) => Array.from({ length: W }, () => ((y >> 1) % 2 ? 'L' : 'M')));
      const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < W && y < H) g[y][x] = c; };
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) set(x + i, y + j, c); };
      // the golf course along the left: mowed fairway stripes, then the rough
      for (let y = 0; y < H; y++) for (let x = 0; x <= 6; x++) g[y][x] = (x >> 1) % 2 ? "'" : '`';
      fill(7, 0, 2, H, '.');
      // two sand bunkers
      fill(2, 5, 3, 2, 's'); set(3, 7, 's'); set(1, 6, 's');
      fill(1, 21, 2, 2, 's'); set(3, 22, 's');
      // the strip of woods between the yard and the course (the trees themselves go in in setup)
      fill(9, 0, 4, H, '.');
      // out back: their patio (by the dining room slider) and the neighbors' patio
      fill(14, 12, 4, 3, 'C');
      fill(14, 8, 4, 3, 'C');
      // out front: the mulch bed along the house, the brick step, and the walk around to the driveway
      fill(18, 18, 12, 1, '<');
      fill(22, 18, 3, 1, 'C');
      fill(22, 19, 10, 1, 'C');
      fill(30, 17, 2, 2, 'C');
      // the driveway up to the storage garage door (the street itself is painted over the grass in setup)
      fill(30, 14, 8, 3, 'C');
      // the neighbors' side: their front walk, stoop and planting beds
      fill(30, 9, 8, 2, 'C');
      fill(30, 6, 1, 3, '<'); fill(30, 11, 1, 2, '<');
      // the cream duplex at the corner: its bed, stoop, and driveway in to the bend
      fill(19, 6, 6, 1, '<'); fill(25, 6, 2, 1, 'C'); fill(31, 3, 7, 3, 'C');
      // the tan duplex next door: its bed, front walk, and driveway down to where the street curves
      fill(17, 30, 2, 1, '<'); fill(19, 30, 2, 1, 'C'); fill(21, 30, 6, 8, 'C');
      // across the street: mulch above the visitor parking and on the island between its two
      // halves, the long mulch strip behind it, and the beds further down
      fill(41, 4, 13, 4, '<'); fill(41, 12, 3, 5, '<'); fill(44, 8, 10, 14, '<');
      fill(43, 22, 11, 17, '<'); fill(32, 30, 5, 2, '<');
      // Anette's old garden: flowers inside the tall hedge
      fill(14, 1, 4, 3, ',');
      return g.map((r) => r.join(''));
    },
    setup(w) {
      const sp = G.spr, f = flags(), R = CONDO_STREET;
      // ---- the streets, painted flat over the grass (see CONDO_STREET)
      const roads = condoStreetCanvas(w.pw, w.ph);
      w.props.push({ img: null, x: 0, y: 0, flat: true, base: 0, draw(ctx, cx, cy) { ctx.drawImage(roads, -cx, -cy); } });
      // (nothing gets planted on a road)
      const clear = (tx, ty, tw = 1, th = 1) => [[0, 0], [1, 0], [0, 1], [1, 1], [0.5, 0.5]].every(([a, b]) => !R.onRoad(tx * 16 + 5 + a * (tw * 16 - 10), ty * 16 + 5 + b * (th * 16 - 10)));
      // ---- the building (Unit A in front, Unit B's roof running back behind it)
      w.addProp({ img: sp.condo, tx: 18, ty: 8, h: 10 });
      w.blockTiles(18, 8, 12, 10);
      // the front door, under the portico
      w.block[17 * w.w + 23] = 0;
      w.addWarp(23, 17, 1, 1, 'condoDown', 13, 18, 'up');
      // the dining room slider, off the back patio
      for (const y of [12, 13]) w.block[y * w.w + 18] = 0;
      w.addWarp(18, 12, 1, 2, 'condoDown', 1, 4, 'right');
      // the storage garage door, at the top of the driveway
      for (const y of [14, 15, 16]) w.block[y * w.w + 29] = 0;
      w.addWarp(29, 14, 1, 3, 'condoStorage', 10, 5, 'left');
      // up the main road: back to the Bay Bridge-Tunnel (Nate arrives from there at 55, 1)
      w.addTrigger(54, 0, 4, 1, () => G.script.run(S.condoStreetEnd()));
      // off the bottom, where the street and the main road keep going
      for (let x = 0; x < w.w; x++) if (R.onRoad(x * 16 + 8, (w.h - 1) * 16 + 8)) w.addTrigger(x, w.h - 1, 1, 1, () => G.script.run(S.condoNeighborhood()));
      // the neighbors' front door
      w.props.push({ img: null, x: 0, y: 0, base: 0, hit: [29 * 16, 9 * 16, 30 * 16, 12 * 16], talk: look('The neighbors\' front door. They get the street side.') });

      // ---- out front: the brick step, boxwoods and azaleas in the mulch
      w.addProp({ img: sp.brickStep, tx: 22, ty: 18, dx: 4, dy: -6, flat: true });
      const shrub = (img, x, y, talk) => w.addProp({ img, tx: x, ty: y, dx: Math.round((16 - img.width) / 2), solid: [x, y, 1, 1], hit: [x, y, 1, 1], talk });
      const boxwood = look('A round boxwood.'), azalea = look('An azalea.');
      for (const [x, y] of [[20, 18], [21, 18], [25, 18], [27, 18], [29, 18], [30, 6], [30, 8], [30, 11]]) shrub(sp.boxwood, x, y, boxwood);
      for (const [x, y] of [[26, 18], [28, 18], [30, 7], [30, 12]]) shrub(sp.azalea, x, y, azalea);

      // ---- the neighbors: a cream duplex at the corner where the street bends, and the tan one
      // next door with two garage doors (Unit B, the other half of theirs, is the roof behind)
      w.addProp({ img: sp.condoCream, tx: 19, ty: 0, h: 6 });
      w.blockTiles(19, 0, 12, 6);
      w.props.push({ img: null, x: 0, y: 0, base: 0, hit: [25 * 16, 5 * 16, 27 * 16, 6 * 16], talk: look('Another duplex, a lot like Abe and Hannah\'s, with a big half-round window. Nobody answers.') });
      for (const x of [19, 21, 23]) shrub(sp.boxwood, x, 6, boxwood);
      w.addProp({ img: sp.condoTan, tx: 17, ty: 22, h: 8 });
      w.blockTiles(17, 22, 11, 8);
      w.props.push({ img: null, x: 0, y: 0, base: 0, hit: [18 * 16, 29 * 16, 21 * 16, 30 * 16], talk: look('The neighbors\' front door. Nobody\'s home.') });
      w.props.push({ img: null, x: 0, y: 0, base: 0, hit: [21 * 16, 29 * 16, 27 * 16, 30 * 16], talk: look('Two garage doors. The neighbors take their cars seriously.') });
      for (const x of [17, 18]) shrub(sp.boxwood, x, 30, boxwood);
      // ---- cars: a silver Jeep in their driveway, the neighbors' black SUV, and two in the visitor spots
      const car = (img, tx, ty, h, dx, dy, solid, text) => w.addProp({ img, tx, ty, h, dx, dy, solid, hit: solid, talk: look(text) });
      car(sp.condoCars.jeep, 32, 14, 2, 0, -3, [32, 14, 3, 2], 'A silver Jeep, parked in the driveway.').talk = () => S.condoJeep();
      car(sp.condoCars.black, 24, 30, 3, 14, 0, [25, 31, 2, 2], 'The neighbors\' black SUV. Very shiny.');
      car(sp.condoCars.escape, 41, 10, 2, 6, -3, [41, 10, 3, 2], 'A black SUV in one of the visitor spots.');
      car(sp.condoCars.crv, 41, 17, 2, 6, -3, [41, 17, 3, 2], 'A blue SUV in a visitor spot. Somebody has company.');
      // ---- black lamp posts along the street, and a tall street light by the visitor parking
      for (const [x, y] of [[37, 12], [37, 21]]) if (clear(x, y)) w.addProp({ img: sp.postLamp, tx: x, ty: y, dx: 3, solid: [x, y, 1, 1], hit: [x, y, 1, 1], talk: look('A black lamp post.') });
      w.addProp({ img: sp.lampPostL, tx: 41, ty: 21, h: 4, dx: -6, solid: [42, 24, 1, 1] });
      // ---- across the street: tall trees over rows of round bushes in the mulch, and a row
      // of skinny evergreens further down
      // (the big tree on the island between the two halves of the visitor parking)
      w.props.push({ img: sp.trees[1], x: 41 * 16 + 8, y: 13 * 16 - 2, base: 13 * 16 + 31 });
      // (a kite stuck way up in it, until Abe gets it down)
      w.props.push({ img: sp.kiteInTree, x: 42 * 16 + 6, y: 11 * 16 + 4, base: 13 * 16 + 32, draw(ctx, cx, cy) { if (!flags().reach_kite) ctx.drawImage(this.img, this.x - cx, this.y - cy); } });
      w.props.push({ img: null, x: 0, y: 0, base: 0, hit: [41 * 16, 13 * 16, 44 * 16, 15 * 16], talk: () => S.abeReach('kite') });
      w.blockTiles(41, 13, 3, 2);
      for (const [x, y, k] of [[46, 4, 'pine'], [50, 5], [44, 8], [48, 9, 'pine'], [52, 8], [51, 12, 'pine'], [45, 13], [48, 16], [44, 18, 'pine'], [52, 16], [50, 20],
        [47, 23], [51, 25, 'pine'], [48, 28], [52, 31], [47, 33, 'pine'], [50, 36], [46, 38],
        [59, 1, 'pine'], [60, 6], [59, 11], [60, 16, 'pine'], [59, 21], [60, 26], [59, 31, 'pine'], [60, 36],
        [13, 24], [13, 31, 'pine'], [14, 36], [31, 24], [36, 35], [30, 38], [40, 31], [41, 37, 'pine']]) if (clear(x, y, 2, 2)) w.addTree(x, y, k);
      for (let y = 5; y <= 38; y++) for (let x = 44 + (y % 2); x <= 53; x += 2) {
        if (y % 4 === 1 && y > 4 && !(y > 21 && x < 46) && !w.block[y * w.w + x] && clear(x, y)) shrub((x + y) % 6 ? sp.boxwood : sp.azalea, x, y, (x + y) % 6 ? boxwood : azalea);
      }
      for (const x of [32, 34, 36]) if (clear(x, 30)) shrub(sp.boxwood, x, 30, boxwood);
      for (let y = 23; y <= 37; y += 2) if (!w.block[(y + 1) * w.w + 44] && clear(44, y, 1, 2)) w.addProp({ img: sp.arborvitae, tx: 44, ty: y, h: 2, dx: 2, solid: [44, y + 1, 1, 1], hit: [44, y + 1, 1, 1], talk: look('A tall, skinny evergreen. There\'s a whole row of them.') });
      // ---- Romulus, if he got out and he's hiding out here
      S.romSpawn(w, 'condo');
      // ---- Anette, out front of the cream duplex at the corner, and her five thirsty potted plants
      // (once her old garden is open again, she's out in it)
      w.anette = w.add(new G.NPC({ sprite: 'anette', name: 'Anette', x: f.gardenOpen ? 15 * 16 + 8 : 23 * 16 + 8, y: f.gardenOpen ? 2 * 16 + 12 : 7 * 16 + 12, dir: 'down', talk: S.anette }));
      // ---- Anette's old garden, behind a tall hedge (x 13-18, y 0-4): the gate latch rusted shut from
      // the inside years ago. Abe can boost Nate over (S.gardenHedge).
      for (let y = 0; y <= 4; y++) for (let x = 13; x <= 18; x++) {
        if (!(x === 13 || x === 18 || y === 0 || y === 4)) continue;
        w.blockTiles(x, y, 1, 1);
        if (x === 16 && y === 4) continue;
        w.props.push({ img: sp.tallHedge, x: x * 16, y: y * 16 - 12, base: y * 16 + 15 });
      }
      w.gardenGate = { img: f.gardenOpen ? sp.gardenGateOpen : sp.gardenGate, x: 16 * 16, y: 4 * 16 - 12, base: 4 * 16 + 15 };
      w.props.push(w.gardenGate);
      if (f.gardenOpen) w.block[4 * w.w + 16] = 0;
      for (const [x, y, w2, h2] of [[13, 0, 6, 1], [13, 4, 6, 1], [13, 1, 1, 3], [18, 1, 1, 3]]) w.props.push({ img: null, x: 0, y: 0, base: 0, hit: [x * 16, y * 16, (x + w2) * 16, (y + h2) * 16], talk: () => S.gardenHedge() });
      w.addProp({ img: sp.stoneBench, tx: 14, ty: 1, dx: 1, solid: [14, 1, 2, 1], hit: [14, 1, 2, 1], talk: look('A stone bench, with moss on it. Nobody has sat here in years.') });
      w.addProp({ img: sp.birdbath, tx: 16, ty: 2, solid: [16, 2, 1, 1], hit: [16, 2, 1, 1], talk: look('A stone birdbath. There\'s still a little rainwater in it.') });
      w.addProp({ img: sp.gardenGnome, tx: 17, ty: 3, dx: 3, solid: [17, 3, 1, 1], hit: [17, 3, 1, 1], talk: look('A garden gnome. He has seen things.') });
      for (const [x, y] of [[17, 1], [14, 2]]) w.addProp({ img: sp.roseBush, tx: x, ty: y, solid: [x, y, 1, 1], hit: [x, y, 1, 1], talk: look('Anette\'s roses. A little wild, but still blooming.') });
      for (const pl of ANETTE_PLANTS) w.add(new G.ThirstyPlant(pl.at[0] * 16 + 8, pl.at[1] * 16 + 12, { id: pl.id, kind: pl.kind }));
      // ---- the school bus, every so often, down the main road (see tick)
      w.busT = 300;
      w.busProp = { img: null, x: 0, y: 0, base: -1, draw(ctx, cx, cy) { if (w.bus) ctx.drawImage(sp.schoolBus, R.lane - 15 - cx, Math.round(w.bus.y) - 78 - cy); } };
      w.props.push(w.busProp);
      // the big bush at the corner of the house (it rustles until Abe jumps out of it)
      w.bigShrub = w.addProp({
        img: sp.bigShrub, tx: 17, ty: 18, h: 2, dx: -2, solid: [17, 18, 2, 2], hit: [17, 18, 2, 2],
        talk: () => (flags().condoScare ? look('A big round bush by the corner of the house. Abe\'s hiding spot.')() : S.abeScare()),
      });
      w.bigShrub.draw = function (ctx, cx, cy) {
        const rustle = !flags().condoScare && G.tick % 170 < 12;
        ctx.drawImage(this.img, this.x + (rustle ? ((G.tick >> 1) & 1 ? 1 : -1) : 0) - cx, this.y - cy);
      };
      if (!f.condoScare) w.addTrigger(20, 18, 5, 4, () => { if (!flags().condoScare) G.script.run(S.abeScare()); });
      // the little fenced-in spot for the trash cans, beside the driveway
      w.addProp({ img: sp.trashEnclosure, tx: 30, ty: 13, dx: 1, solid: [30, 13, 2, 1], hit: [30, 13, 2, 1], talk: look('A little fenced-in spot for the trash and recycling.') });

      // ---- out back: the patio, the Traeger, two plastic lawn chairs, the air
      // conditioners, and the privacy fence between their patio and the neighbors'
      // FURNITURE (photos pending): anything else on the patio goes on x 14-17, y 12-14
      // (keep x 17, y 12-13 clear: that's the way to the slider).
      w.addProp({ img: sp.privacyFence, tx: 14, ty: 11, solid: [14, 11, 4, 1], hit: [14, 11, 4, 1], talk: look('A wood privacy fence between their patio and the neighbors\'.') });
      w.addProp({ img: sp.traeger, tx: 15, ty: 12, dx: 1, solid: [15, 12, 2, 1], hit: [15, 12, 2, 1], talk: S.condoTraeger });
      for (const x of [14, 16]) w.addProp({ img: sp.lawnChair, tx: x, ty: 14, dx: 1, solid: [x, 14, 1, 1], hit: [x, 14, 1, 1], talk: look('A white plastic lawn chair, pointed at the golf course. Front-row seats.') });
      for (const y of [7, 15]) w.addProp({ img: sp.acUnit, tx: 17, ty: y, dx: -1, solid: [17, y, 1, 1], hit: [17, y, 1, 1], talk: look('An air conditioner, humming away. Virginia summers do not mess around.') });

      // ---- the strip of woods between the yard and the golf course (x 9-12): too thick to get through,
      // except where Romulus squeezes through (straight out from the patio at y 13) and, after the
      // sloth, drags Nate through (S.condoWoods).
      for (let y = 0; y < w.h - 1; y += 2) {
        w.addTree(9, y, y % 6 === 2 ? 'pine' : null);
        if (y + 1 < w.h - 1) w.addTree(11, y + 1, y % 6 === 4 ? null : 'pine');
      }
      w.blockTiles(9, 0, 4, w.h);
      // (while Romulus is out on the golf course, there's a gap he squeezed through: S.condoWoods)
      w.props.push({ img: null, x: 0, y: 0, base: 0, hit: [9 * 16, 0, 13 * 16, w.h * 16], talk: () => S.condoWoods() });
      // ---- the golf course (out of reach for now)
      w.props.push({ img: null, x: 0, y: 0, base: 0, hit: [1 * 16, 5 * 16, 5 * 16, 8 * 16], talk: look('A sand bunker. Nate the geologist: mostly quartz. Nate the golfer: avoid.') });
      w.props.push({ img: null, x: 0, y: 0, base: 0, hit: [1 * 16, 21 * 16, 4 * 16, 23 * 16], talk: look('Another sand bunker. There is a golf ball buried in it. Nate leaves it for its owner.') });
      // ---- Father Eggmas got to Chesapeake too (once Nate's arrived): Abe's yellow guitar cables
      // slithering out of the storage garage, and Canada geese off the golf course, on the front
      // lawn and the far lawn (they're back every visit)
      if (f.condoArrived) {
        const ok = (tx, ty) => !R.onRoad(tx * 16 + 8, ty * 16 + 8) && !w.blocked([tx * 16 + 3, ty * 16 + 6, tx * 16 + 13, ty * 16 + 14]);
        for (const [x, y] of [[34, 16], [36, 15]]) if (ok(x, y)) w.add(new G.YellowCable(x * 16 + 8, y * 16 + 12));
        for (const [x, y] of [[31, 23], [34, 25], [57, 13], [58, 19]]) if (ok(x, y)) w.add(new G.Goose(x * 16 + 8, y * 16 + 12));
      }
    },
    onEnter() {
      return (function* () {
        const f = flags();
        if (f.romulusBeaten && G.state.party.includes('abe') && !f.healerTalk) { yield* S.abeHealer(); return; }
        if (f.condoArrived) return;
        f.condoArrived = true;
        if (P().x < 30 * 16) return;
        yield G.wait(20);
        yield G.say('Nate', 'This is Abe and Hannah\'s street. Their place is across from the visitor parking, and the front door is around the side, past the garage.');
      })();
    },
    // the school bus comes down the main road every so often (it stops and honks if Nate's in the way)
    tick(w) {
      if (G.script.busy) return;
      const b = w.bus, p = G.play.player, R = CONDO_STREET;
      if (!b) { if (--w.busT <= 0) w.bus = { y: -90, honk: 0 }; return; }
      const inWay = Math.abs(p.x - R.lane) < 22 && p.y > b.y - 4 && p.y < b.y + 30;
      if (inWay) {
        if (b.honk-- <= 0) { b.honk = 100; G.audio.sfx('honk'); w.pop(R.lane, b.y - 84, 'HONK!', '#f8d850'); }
      } else { b.y += 1.3; b.honk = Math.min(b.honk, 20); }
      w.busProp.base = b.y;
      if (b.y > w.ph + 100) { w.bus = null; w.busT = 1500 + Math.floor(Math.random() * 900); }
    },
  };

  // ================================================================ ROMULUS
  // Abe and Hannah's border collie (from the user's photos: black and white, a white blaze,
  // his red plaid bandana with the green tag). He isn't scared of anybody. Except Nate,
  // for no reason anyone can figure out (this really happened).
  // The downstairs bathroom sink: there's a portable bidet in the cabinet under it.
  S.condoSink = function* () {
    const s = G.state;
    if (s.items.bidet) { yield G.say(null, 'A long vanity under a big mirror and a light box. The cabinet under the sink has a bidet-shaped empty spot.'); return; }
    yield G.say(null, 'A long vanity under a big mirror and a light box.');
    yield G.say(null, 'Something is rattling around in the cabinet under the sink...');
    yield* S.bidetFind();
  };
  // finding the Portable Bidet (at the sink, or when Romulus knocks the cabinet open)
  S.bidetFind = function* () {
    const s = G.state;
    G.audio.sfx('chest');
    s.items.bidet = true; s.items.bidetWater = G.BIDET_MAX;
    yield G.itemGet(G.spr.bidetIcon, 'You got the {y}Portable Bidet{/}!');
    yield G.say(null, 'Nate gives it a careful sniff, to see if it\'s been used.');
    yield G.say('Nate', '*sniff sniff*');
    yield G.say('Nate', '...Inconclusive.');
    yield G.say('Nate', 'It\'s coming with me anyway.');
    yield G.say(null, 'Set it to X in ITEMS, then hold X to spray. Face any water, sink or toilet and hold X to fill it back up.');
  };

  S.romulusMeet = function* () {
    const f = flags(), w = G.play.world, p = P(), r = w.romulus, abe = w.abe;
    if (f.romulusMet || !r) return;
    f.romulusMet = true;
    yield G.wait(30);
    yield G.camFocus(r.x, r.y - 10, 30);
    yield G.say(null, 'A black and white border collie is curled up in a dog bed by the fireplace.');
    if (abe) yield G.say('Abe', 'Oh, that\'s Romulus. Nothing scares him. He\'s not scared of anybody.');
    r.state = 'alert'; r.dir = p.x > r.x ? 'right' : 'left';
    G.audio.sfx('blip');
    yield G.wait(24);
    yield G.emote(r, 'bang', 30);
    G.audio.sfx('yelp');
    w.pop(r.x, r.y - 28, 'YELP!', '#f8f8f0');
    // ...and he bolts for the kitchen and hides behind the breakfast bar
    yield G.walkTo(r, 11 * 16 + 8, 9 * 16 + 12, 3.2);
    yield G.walkTo(r, 11 * 16 + 8, 6 * 16 + 10, 3.2);
    yield G.walkTo(r, 15 * 16 + 8, 5 * 16 + 12, 3.2);
    r.state = 'hide';
    yield G.camFocus(null, null, 20);
    yield G.say('Nate', '...Romulus? Buddy? It\'s me!');
    w.pop(r.x, r.y - 26, '*whimper*', '#c8c8d0');
    if (abe) {
      yield G.say('Abe', 'Huh. He\'s not scared of ANYBODY.');
      yield G.say('Abe', '...He\'s scared of you?');
      yield G.say('Nate', 'What did I DO?');
      yield G.say('Abe', 'I genuinely have no idea.');
    } else {
      yield G.say('Nate', 'He\'s not scared of anybody. Why is he scared of ME?');
    }
    if (G.with('lily')) yield G.say('Lily', 'He likes me fine.');
    else if (G.with('doron')) yield G.say('Doron', 'Smart dog.');
    // ...and the hide and seek begins
    f.romHide = 0; r.chase = true;
    yield G.say(null, 'Romulus is hiding from Nate. Find him!');
  };

  // ---------------------------------------------------------------- hide and seek
  // After he first sees Nate, Romulus runs and hides. Every time Nate finds him he yelps and
  // bolts to the next spot. In the house (ROM_SPOTS: the kitchen, the downstairs bath, the
  // upstairs closet, under Abe's desk) he's easy to spot. Then he's out the front door, and
  // outside he's much harder to find (ROM_OUT): he hides completely, somewhere different each
  // time, four times over. At last he goes around back and squeezes through the woods onto the
  // golf course. flags.romHide counts how many times he's been found; flags.romSpot is which
  // outside spot he's in. `run` is where he runs (in tiles) when he's found from there, `vanish`
  // means he leaves the map (up or down the stairs).
  const ROM_SPOTS = [
    { map: 'condoDown', at: [15.5, 5.75], run: [[11.5, 5.5], [11.5, 8], [13.5, 9.6], [19.5, 9.6], [19.5, 15.6], [17.5, 15.6]], line: 'He ran down the back hall!', abe: 'He always hides behind the breakfast bar. Right next to me. Not very sneaky.' },
    { map: 'condoDown', at: [17.5, 15.6], run: [[19.5, 15.6], [19.5, 9.6], [13.5, 9.6], [13.5, 12.2]], vanish: true, bidet: true, line: 'He ran up the stairs!', abe: 'Try the bathroom. He likes the bath mat. It\'s fluffy.' },
    { map: 'condoUp', at: [22.5, 6.7], run: [[23.5, 6.7], [23.5, 10.6], [21.5, 12.7]], line: 'He ran out of the closet!', abe: 'Upstairs? Check the closet. Careful of the guitars.' },
    { map: 'condoUp', at: [21.5, 12.75], run: [[16.5, 11.6], [14.5, 11.6], [13.5, 13]], vanish: true, door: true, line: 'He\'s headed downstairs!', abe: 'He likes it under my desk. Probably because it\'s the only clean spot in my office.' },
  ];
  // Outside: `box` is what he's hiding in or under (tiles: x, y, w, h), `at` is where he pops out,
  // `flee` is the way he runs from there (he's off somewhere new once he's off the screen), and
  // `area` is all Abe can tell Nate from inside ("I can hear him whimpering somewhere...").
  const ROM_OUT = [
    { id: 'bigBush', box: [17, 18, 2, 2], at: [16.5, 20.4], flee: [[16.5, 20.7], [35, 20.7], [38.5, 25]], leafy: true, area: 'out front, by the corner of the house' },
    { id: 'azaleas', box: [25, 18, 5, 1], at: [27, 19.7], flee: [[31, 19.7], [36, 20.7], [38.5, 26]], leafy: true, area: 'out front' },
    { id: 'jeep', box: [32, 14, 3, 2], at: [33.5, 16.8], flee: [[36.5, 17], [39.5, 17.5], [39.5, 32]], area: 'by the driveway' },
    { id: 'trash', box: [30, 13, 2, 1], at: [32.5, 13.6], flee: [[35.5, 13.6], [39.5, 13.6], [39.5, 3.5], [52, 2.6]], area: 'by the driveway' },
    { id: 'patioAC', box: [17, 15, 1, 1], at: [16.5, 15.8], flee: [[14.5, 16.5], [13.5, 20.6], [24, 20.8], [36, 20.8]], area: 'out back' },
    { id: 'neighborAC', box: [17, 7, 1, 1], at: [16.5, 7.8], flee: [[15.5, 8.6], [13.5, 8.6], [13.5, 20.6], [24, 20.8]], area: 'out back, on the neighbors\' side' },
    { id: 'creamBoxwood', box: [19, 6, 1, 1], at: [18.4, 6.9], flee: [[17.5, 6.6], [13.5, 6.6], [13.5, 20.6], [24, 20.8]], leafy: true, area: 'up by Anette\'s' },
    { id: 'visitorA', box: [41, 10, 3, 2], at: [40.2, 11.4], flee: [[39.5, 11], [39.5, 3.5], [52, 2.6]], area: 'over by the visitor parking' },
    { id: 'visitorB', box: [41, 17, 3, 2], at: [40.2, 18.4], flee: [[39.5, 19], [39.5, 24], [36, 31]], area: 'over by the visitor parking' },
    { id: 'island', box: [41, 13, 3, 2], at: [42.5, 15.8], flee: [[40, 15.8], [39.5, 8], [39.5, 3.5], [52, 2.6]], leafy: true, area: 'over by the visitor parking' },
    { id: 'evergreen', box: [44, 30, 1, 1], at: [45.5, 30.7], flee: [[47, 30.6], [55.5, 30.6], [55.5, 39]], leafy: true, area: 'across the street, down the row of skinny trees' },
    { id: 'tanBoxwoods', box: [17, 30, 2, 1], at: [16.4, 30.8], flee: [[16.2, 33], [19, 36], [24, 39]], leafy: true, area: 'down by the neighbors with the two garage doors' },
    { id: 'blackSUV', box: [25, 31, 2, 2], at: [23.6, 32.5], flee: [[23.5, 35], [29, 35.5], [33, 33]], area: 'down by the neighbors with the two garage doors' },
  ];
  const ROM_OUT_ROUNDS = 4, ROM_TOTAL = ROM_SPOTS.length + ROM_OUT_ROUNDS;
  G.ROM_INSIDE = ROM_SPOTS.length;
  G.romChase = () => { const f = flags(); return !!f.romulusMet && !f.romToGolf && !f.romulusBeaten && (f.romHide || 0) < ROM_TOTAL; };
  // somewhere new to hide outside: not where he just was, not close by, and not on the screen
  const romPick = (prev) => {
    const last = ROM_OUT[prev], c = G.play.cam, onScreen = (sp) => sp.at[0] * 16 > c.x - 24 && sp.at[0] * 16 < c.x + G.W + 24 && sp.at[1] * 16 > c.y - 24 && sp.at[1] * 16 < c.y + G.H + 24;
    let ok = ROM_OUT.map((sp, i) => i).filter((i) => i !== prev && !onScreen(ROM_OUT[i]) && (!last || Math.hypot(ROM_OUT[i].at[0] - last.at[0], ROM_OUT[i].at[1] - last.at[1]) >= 10));
    if (!ok.length) ok = ROM_OUT.map((sp, i) => i).filter((i) => i !== prev);
    return ok[Math.floor(Math.random() * ok.length)];
  };
  // tuck him away, out of sight, in an outside spot
  const romTuck = (r, i) => {
    const sp = ROM_OUT[i], [bx, by, bw, bh] = sp.box;
    r.x = sp.at[0] * 16; r.y = sp.at[1] * 16;
    r.hidden = { box: [bx * 16, by * 16, (bx + bw) * 16, (by + bh) * 16], c: [(bx + bw / 2) * 16, (by + bh) * 16 - 6], leafy: sp.leafy };
    r.solid = false; r.state = 'hide'; r.chase = true; r.walking = false;
  };
  // put Romulus in his hiding spot, if it's on this map
  S.romSpawn = function (w, map) {
    if (!G.romChase()) return;
    const f = flags(), i = f.romHide || 0;
    if (i < ROM_SPOTS.length) {
      const sp = ROM_SPOTS[i];
      if (sp.map !== map) return;
      w.romulus = w.add(new G.Romulus(sp.at[0] * 16, sp.at[1] * 16, 'hide'));
      w.romulus.chase = true;
      return;
    }
    if (map !== 'condo') return;
    if (!ROM_OUT[f.romSpot]) f.romSpot = Math.floor(Math.random() * ROM_OUT.length);
    w.romulus = w.add(new G.Romulus(0, 0, 'hide'));
    romTuck(w.romulus, f.romSpot);
  };
  // he bolts along `pts` (pixels); once he's well off screen he's already where he's going
  const runOff = (r, pts) => ({
    start() { this.i = 0; r.walking = true; },
    update() {
      const p = P();
      if (this.i >= pts.length) { r.walking = false; return true; }
      const [tx, ty] = pts[this.i], dx = tx - r.x, dy = ty - r.y, d = Math.hypot(dx, dy);
      if (d <= 3.6) { r.x = tx; r.y = ty; this.i++; } else { r.x += (dx / d) * 3.6; r.y += (dy / d) * 3.6; r.dir = G.dirToward(dx, dy); r.anim = (r.anim || 0) + 1; }
      if (Math.hypot(r.x - p.x, r.y - p.y) > 150) { [r.x, r.y] = pts[pts.length - 1]; r.walking = false; return true; }
      return false;
    },
  });
  // outside: he bolts along `pts` and keeps going until he's off the screen
  const runAway = (r, pts) => ({
    start() { this.i = 0; this.n = 0; this.v = [0, 1]; r.walking = true; },
    update() {
      const c = G.play.cam;
      if (++this.n > 240 || r.x < c.x - 20 || r.x > c.x + G.W + 20 || r.y < c.y - 8 || r.y > c.y + G.H + 30) { r.walking = false; return true; }
      const [tx, ty] = this.i < pts.length ? pts[this.i] : [r.x + this.v[0] * 40, r.y + this.v[1] * 40];
      const dx = tx - r.x, dy = ty - r.y, d = Math.hypot(dx, dy);
      if (d <= 3.6) { r.x = tx; r.y = ty; this.i++; return false; }
      this.v = [dx / d, dy / d];
      r.x += this.v[0] * 3.6; r.y += this.v[1] * 3.6; r.dir = G.dirToward(dx, dy); r.anim = (r.anim || 0) + 1;
      return false;
    },
  });
  // Nate found him: a yelp, and he's off to the next spot
  S.romulusFound = function* (r) {
    const f = flags(), w = G.play.world, i = f.romHide || 0, spot = ROM_SPOTS[i];
    if (!r.chase) return;
    if (!spot) { yield* S.romulusFoundOut(r); return; }
    r.chase = false;
    r.dir = P().x > r.x ? 'right' : 'left';
    G.audio.sfx('yelp');
    w.pop(r.x, r.y - 28, 'YELP!', '#f8f8f0');
    yield G.emote(r, 'bang', 24);
    f.romHide = i + 1;
    G.audio.sfx('dash');
    yield runOff(r, spot.run.map(([x, y]) => [x * 16, y * 16]));
    if (spot.vanish) r.dead = true;
    else { r.state = 'hide'; r.chase = true; }
    if (spot.bidet && !G.itemHas('bidet')) {
      yield G.say(null, 'On his way out, Romulus knocked the cabinet under the sink wide open...');
      yield* S.bidetFind();
    }
    yield G.say('Nate', spot.line);
    if (spot.door) {
      // ...and he's out the front door, hiding somewhere outside
      f.romSpot = Math.floor(Math.random() * ROM_OUT.length);
      yield G.wait(30);
      G.audio.sfx('door');
      yield G.say('Nate', '...Was that the front door?!');
    }
  };
  // found outside: he pops out of his spot, yelps and bolts. After the fourth time, he goes
  // around back and through the woods.
  S.romulusFoundOut = function* (r) {
    const f = flags(), w = G.play.world, spot = ROM_OUT[f.romSpot] || ROM_OUT[0], p = P();
    r.chase = false; r.hidden = null; r.solid = true;
    r.x = spot.at[0] * 16; r.y = spot.at[1] * 16;
    r.dir = p.x > r.x ? 'right' : 'left';
    if (spot.leafy) w.burst(r.x, r.y - 10, ['#3a7a34', '#5a9a44', '#7aba5a'], 10, { speed: 1.2, up: 1, g: 0.1, life: 20, size: 2 });
    G.audio.sfx('yelp');
    w.pop(r.x, r.y - 28, 'YELP!', '#f8f8f0');
    yield G.emote(r, 'bang', 24);
    f.romHide = (f.romHide || 0) + 1;
    G.audio.sfx('dash');
    yield runAway(r, spot.flee.map(([x, y]) => [x * 16, y * 16]));
    if (f.romHide >= ROM_TOTAL) { yield* S.romulusToGolf(r); return; }
    f.romSpot = romPick(ROM_OUT.indexOf(spot));
    romTuck(r, f.romSpot);
    const left = ROM_TOTAL - f.romHide;
    yield G.say('Nate', [
      'Gone again! He could be anywhere out here.',
      'He is SO fast. Where did he go THIS time?',
      'Come ON, Romulus! I just want to say hi!',
    ][left % 3]);
  };
  // the last time: he runs around back and squeezes through the trees behind the patio, onto
  // the golf course. The gap is way too small for Nate.
  S.romulusToGolf = function* (r) {
    const f = flags(), w = G.play.world;
    r.x = 15.5 * 16; r.y = 13.4 * 16; r.chase = false; r.hidden = null;
    yield G.camFocus(13 * 16, 13 * 16, 40);
    G.audio.sfx('dash');
    yield G.walkTo(r, 13.5 * 16, 13.3 * 16, 3.4);
    yield G.walkTo(r, 11.5 * 16, 13.2 * 16, 3.4);
    w.burst(11 * 16, 13 * 16 - 8, ['#3a7a34', '#5a9a44', '#7a5a38'], 14, { speed: 1.4, up: 1, g: 0.1, life: 22, size: 2 });
    r.dead = true;
    w.romulus = null;
    yield G.wait(30);
    f.romToGolf = true; f.romHide = ROM_TOTAL;
    yield G.camFocus(null, null, 30);
    yield G.say('Nate', 'Was that Romulus? Out back?');
    yield G.say('Nate', 'He squeezed through the trees behind the patio! Onto the golf course!');
    yield G.say('Nate', 'There\'s no way I fit through that gap. Abe will know what to do.');
  };
  // the gap in the woods behind the patio
  S.condoWoods = function* () {
    const f = flags();
    if (!f.romToGolf || f.romulusBeaten) { yield G.say(null, 'The woods are too thick to get through. The golf course is right there on the other side.'); return; }
    if (f.romGap) {
      const c = yield G.ask('Nate', 'There\'s the hole Romulus dragged me through. Back onto the golf course?', ['Onto the golf course', 'Not yet']);
      if (c === 0) G.play.warp('golf', 34, 13, 'left');
      return;
    }
    if (G.itemHas('sloth')) { yield* S.slothTug(); return; }
    yield G.say(null, 'The gap Romulus squeezed through. It\'s about the size of a border collie.');
    yield G.say('Nate', 'I am not the size of a border collie.');
    if (!f.slothQuest) yield G.say('Nate', 'Abe will know how to get him back.');
  };
  // Squeak the sloth at the gap: Romulus comes crashing back through the trees (HUGE), chomps the
  // sloth, and Nate does not let go. He gets dragged right through the woods onto the course.
  S.slothTug = function* () {
    const f = flags(), w = G.play.world, p = P(), s = G.state;
    p.dir = 'left';
    yield G.say('Nate', 'Okay. Here goes.');
    for (const t of ['*squeak squeak*', '*squeak*']) {
      G.audio.sfx('squeak'); w.pop(p.x, p.y - 34, t, '#f8e0b0');
      yield G.wait(45);
    }
    yield G.wait(30);
    G.play.shake(12, 1);
    w.burst(11 * 16 + 8, p.y - 16, ['#3a7a34', '#5a9a44', '#7a5a38'], 10, { speed: 1, up: 1, g: 0.1, life: 20, size: 2 });
    yield G.say(null, 'Something is crashing through the trees on the other side. Something BIG.');
    G.audio.sfx('woof'); G.play.shake(20, 2);
    // his head shoves out through the leaves (it slides out from behind them; `edge` is where
    // the trees end, and nothing of him shows left of it)
    const snout = {
      // (drawn over every tree in the strip of woods; the leaf clump hides where he comes through)
      img: null, x: p.x - 54, y: p.y - 40, base: p.y + 200, edge: p.x - 50, frame: 0, t0: G.tick, rustleTo: G.tick + 12,
      draw(ctx, cx, cy) {
        const out = Math.min(1, (G.tick - this.t0) / 8), img = G.spr.romSnout[this.frame], x = Math.round(this.x - (1 - out) * 26), y = Math.round(this.y);
        ctx.save();
        ctx.beginPath(); ctx.rect(this.edge - cx, y - 6 - cy, 90, img.height + 12); ctx.clip();
        ctx.drawImage(img, x - cx, y - cy);
        ctx.restore();
        const shake = G.tick < this.rustleTo ? ((G.tick >> 1) & 1 ? 1 : -1) : 0;
        ctx.drawImage(G.spr.romSnoutLeaves, this.edge - 18 + shake - cx, y - 6 - cy);
      },
    };
    w.props.push(snout);
    w.burst(p.x - 30, p.y - 14, ['#3a7a34', '#5a9a44', '#7a5a38'], 16, { speed: 1.6, up: 1, g: 0.1, life: 24, size: 2 });
    w.pop(p.x - 30, p.y - 36, 'CHOMP!', '#f8f8f0');
    yield G.say(null, 'A huge black and white snout shoots out of the trees and CHOMPS the sloth.');
    yield G.say('Nate', 'ROMULUS?! Why is your nose so BIG?');
    yield G.say('Nate', 'I am NOT letting go of this sloth.');
    // tug of war
    for (let k = 0; k < 4; k++) {
      G.audio.sfx('bump'); G.play.shake(8, 1);
      p.x -= 3; snout.x -= 2; snout.frame = 1; snout.rustleTo = G.tick + 8;
      yield G.wait(12);
      p.x += 2; snout.x += 2; snout.frame = 0;
      yield G.wait(10);
    }
    yield G.say(null, 'Romulus pulls. Nate pulls back. Romulus pulls HARDER.');
    G.audio.sfx('dash'); G.play.shake(24, 3);
    w.burst(p.x - 20, p.y - 12, ['#3a7a34', '#5a9a44', '#7a5a38', '#f8f8f0'], 24, { speed: 2, up: 1.2, g: 0.1, life: 26, size: 2 });
    // he yanks his head back through the trees, and Nate goes with it
    snout.frame = 1; snout.rustleTo = G.tick + 20;
    yield G.together(G.walkTo(p, p.x - 34, p.y, 4), { start() { this.t = 0; }, update() { snout.x -= 4; return ++this.t >= 10; } });
    s.items.sloth = false;
    f.romGap = true; f.slothQuest = 4;
    yield G.say(null, 'Nate goes right through the trees.');
    G.play.warp('golf', 34, 13, 'left');
  };

  S.romulusTalk = function* (r) {
    const f = flags(), w = G.play.world;
    if (G.with('hannah')) {
      r.state = 'happy';
      yield G.say('Hannah', 'Romulus! Hi, baby! Who\'s my good boy? WHO\'S my good boy?');
      w.pop(r.x, r.y - 26, '*wag wag wag wag*', '#f8f8f0');
      yield G.say('Nate', 'He LOVES her.');
      yield G.say('Hannah', 'Of course he does. ...He\'s still giving YOU the side-eye, though.');
      r.state = 'hide';
      return;
    }
    f.romLine = ((f.romLine || 0) + 1) % 4;
    if (G.with('doron') && f.romLine === 0) {
      r.state = 'happy';
      yield G.say('Doron', 'Romulus! Good boy. GOOD boy.');
      w.pop(r.x, r.y - 26, '*wag wag wag*', '#f8f8f0');
      yield G.say('Nate', 'Oh, so he LOVES Doron.');
      r.state = 'hide';
      return;
    }
    if (G.with('lily') && f.romLine === 0) {
      r.state = 'happy';
      yield G.say('Lily', 'Hi, Romulus! Hi!');
      w.pop(r.x, r.y - 26, '*wag wag wag*', '#f8f8f0');
      yield G.say('Nate', 'He let LILY pet him?');
      r.state = 'hide';
      return;
    }
    yield G.say('Nate', ['Hey, buddy. It\'s just me.', 'Romulus. I have never done anything to you.', 'Who\'s a good boy? ...Who\'s a good boy who\'s scared of me for no reason?', 'Come here, Romulus! ...No? Okay.'][f.romLine]);
    G.audio.sfx('yelp');
    w.pop(r.x, r.y - 26, '*whimper*', '#c8c8d0');
  };

  // ---------------------------------------------------------------- the golf course: Romulus, huge
  // (Nate gets out here by squeaking Romulus's sloth at the gap in the woods behind the patio:
  // Romulus chomps it from the other side and drags Nate right through. See S.slothTug.)
  // Romulus hates water (he really does), so the way to beat him is the Portable Bidet from
  // under the downstairs bathroom sink. Golfers tee off at Nate the whole time.
  S.romulusFight = function* () {
    const f = flags(), w = G.play.world, p = P(), r = w.romulus, s = G.state;
    if (f.romulusBeaten || w.romFight || !r) return;
    yield G.wait(30);
    yield G.camFocus(r.x, r.y - 40, 40);
    yield G.say('Nate', '...Romulus?');
    r.face = p.x > r.x ? 1 : -1;
    G.audio.sfx('woof'); G.play.shake(20, 2);
    w.pop(r.x, r.y - 100, 'WOOF.', '#f8f8f0');
    yield G.wait(40);
    yield G.say('Nate', 'Why are you the size of a GOLF CART?!');
    if (f.romGap) yield G.say(null, 'Romulus drops the sloth on the green. Gently. Then he looks down at Nate.');
    if (!G.itemHas('bidet')) {
      // (no way to deal with him yet)
      yield G.say('Nate', 'Nope. Not without a plan. Romulus hates water... if only I had something that sprays.');
      yield G.camFocus(null, null, 20);
      G.play.warp('condo', 16, 13, 'left');
      return;
    }
    w.romFight = true;
    if (G.with('lily')) yield G.say('Lily', 'Who\'s a big boy? ...Who\'s a VERY big boy?');
    else if (G.with('doron')) { yield G.say('Doron', 'I\'m not fighting a dog.'); yield G.say('Nate', 'NOBODY is fighting Romulus.'); }
    r.pose = 'stalk';
    yield G.wait(30);
    yield G.say('Nate', 'He doesn\'t look scared of me now. He\'s too big to be scared of anything.');
    yield G.say('Nate', 'But there\'s one thing Romulus hates more than anything in the world...');
    yield G.say('Nate', 'Water.');
    yield G.say('Nate', 'Good thing I brought a portable bidet. ...I never thought I\'d say that.');
    s.xItem = 'bidet';
    G.play.autosave();
    yield G.say(null, 'Hold X to spray Romulus with the {y}Portable Bidet{/}. When it runs dry, face the pond and hold X to fill it back up. It fills slowly!');
    r.pose = null;
    yield G.camFocus(null, null, 30);
    yield G.banner('ROMULUS', 'a very good boy (huge)', 150);
    G.audio.play('boss');
    r.state = 'roam'; r.st = 90;
  };
  S.romulusHint = function* (what) {
    const f = flags();
    if (what === 'soak') {
      f.romSoakHint = true;
      yield G.say('Nate', 'He HATES it! Keep spraying!');
    } else if (what === 'shrink') {
      yield G.say('Nate', 'It\'s working! He\'s shrinking back down!');
      yield G.say(null, 'Watch out for the golfers. They are NOT happy about a giant dog on the course.');
    }
  };
  S.bidetEmpty = function* () {
    yield G.say(null, 'The bidet is empty. Face some water (like a pond), a sink or a toilet and hold X to fill it back up. It takes a while, so keep an eye out.');
  };
  S.bidetToilet = function* () {
    yield G.say('Nate', 'Filling a bidet from a toilet.');
    yield G.say('Nate', 'I\'m not going to think about it.');
  };
  S.romulusBeaten = function* (r) {
    const f = flags(), w = G.play.world, p = P();
    G.audio.stop();
    G.play.spraying = false;
    for (const e of w.ents) if (e instanceof G.BarkRing || e instanceof G.GolfShot) e.dead = true;
    w.romFight = false;
    yield G.wait(40);
    // regular size again, sitting there dripping...
    r.face = p.x > r.x ? 1 : -1;
    yield G.say(null, 'Romulus is back to his regular size. And very, very wet.');
    yield G.wait(20);
    // ...until he notices who's standing there
    r.pose = 'scared';
    G.audio.sfx('yelp');
    w.pop(r.x, r.y - 28, 'YELP!', '#f8f8f0');
    r.pose = null;
    yield G.walkTo(r, r.x + (r.x > p.x ? 40 : -40), r.y, 3);
    r.pose = 'scared'; r.face = p.x > r.x ? 1 : -1;
    yield G.say('Nate', 'And he\'s scared of me again. Of course he is.');
    // Abe comes looking for him
    const abe = w.add(new G.NPC({ sprite: 'abe', name: 'Abe', x: 37 * 16, y: r.y, dir: 'left' }));
    yield G.walkTo(abe, Math.min(34 * 16, r.x + 60), r.y, 1.6);
    yield G.say('Abe', 'ROMULUS! There you are. You can\'t just take off onto the course, buddy.');
    if (f.romGap) {
      yield G.say('Abe', 'Hey, you got his sloth back!');
      yield G.say('Nate', 'Long story. It involves Paul McCartney.');
      yield G.say('Abe', '...What?');
      yield G.say('Nate', 'A lady who looks EXACTLY like him.');
    }
    r.pose = null;
    yield G.walkTo(r, abe.x + 14, abe.y + 4, 3);
    r.pose = 'scared'; r.face = -1;
    yield G.say('Abe', '...Was he HUGE a minute ago? I swear I saw him from the patio.');
    yield G.say('Nate', 'He was the size of a golf cart.');
    yield G.say('Abe', 'Huh. And why is he soaking wet?');
    yield G.say('Nate', '...');
    yield G.say('Abe', 'Is that my BIDET?');
    // (Abe gave it to Nate for Christmas, then got jealous and took it back)
    yield G.say('Nate', 'YOUR bidet? You gave it to me for Christmas!');
    yield G.say('Abe', 'And then I tried it. And I got jealous. So I took it back.');
    yield G.say('Nate', 'You took back a Christmas present.');
    yield G.say('Abe', 'Have you USED it, Nate? You would have taken it back too.');
    if (G.with('lily')) yield G.say('Lily', 'Romulus is still scared of Nate, though.');
    f.romulusBeaten = true;
    yield G.banner('YOU WIN!', 'who\'s a good boy', 150);
    // ...and Abe joins the party
    yield G.say('Abe', 'So. Tyler says Father Eggmas is at the Number One Ditch?');
    yield G.say('Nate', 'Somewhere out there. I\'m going to find him.');
    yield G.say('Abe', 'Then I\'m coming with you. Romulus is home, Hannah\'s at work, and somebody has to keep an eye on my bidet.');
    yield G.say('Nate', 'It\'s MY bidet.');
    yield G.say('Abe', 'Agree to disagree.');
    r.pose = 'scared'; w.pop(r.x, r.y - 26, '*whimper*', '#c8c8d0');
    yield G.say('Abe', 'Romulus. Guard the house. ...Don\'t look at Nate like that.');
    const s = G.state;
    if (!s.party.includes('abe')) s.party.push('abe');
    s.follower = 'abe';
    G.audio.sfx('fanfare');
    yield G.banner('ABE JOINED THE PARTY!', 'He\'s 6\'5". He can reach anything.', 220);
    yield G.say(null, 'With Abe along, Nate can get at things way up high (press Z under them), and Abe can boost him over tall hedges. Swap who tags along in the {y}PEOPLE{/} menu.');
    G.play.autosave();
    G.play.warp('condo', 16, 13, 'left');
  };
  S.golfLeave = function* () {
    const p = P();
    const c = yield G.ask('Nate', 'Head back to Abe and Hannah\'s?', ['Go back', 'Stay']);
    if (c === 0) G.play.warp('condo', 16, 13, 'left');
    else yield G.walkTo(p, p.x, p.y - 14, 1);
  };
  S.golferTalk = function* () {
    const f = flags();
    f.golfLine = ((f.golfLine || 0) + 1) % 3;
    yield G.say('Golfer', f.romulusBeaten
      ? ['Was that your dog? He was the size of a golf cart.', 'I lost six balls today. SIX.', 'Did you spray him with a... never mind.'][f.golfLine]
      : ['Fore.', 'Kid, you\'re standing on the fairway.', 'Is that a dog or a golf cart?'][f.golfLine]);
  };

  // The course behind the condos: the fairway, three bunkers, a pond, the green with its pin.
  const GOLF_POND = { x: 13, y: 19, rx: 4.8, ry: 3.1 };
  G.MAPS.golf = {
    name: 'The Golf Course',
    get music() { return flags().romulusBeaten ? 'home' : 'boss'; },
    tiles() {
      const W = 40, H = 30;
      const g = Array.from({ length: H }, () => Array(W).fill('.'));
      const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < W && y < H) g[y][x] = c; };
      const blob = (cx, cy, rx, ry, c) => { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (((x + 0.5 - cx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2 <= 1) set(x, y, c); };
      // the fairway: mowed stripes in a long oval, with the rough all around it
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (((x + 0.5 - 19.5) / 17.5) ** 2 + ((y + 0.5 - 15) / 12.5) ** 2 <= 1) set(x, y, (x >> 1) % 2 ? "'" : '`');
      // three bunkers and the pond
      blob(9, 8.5, 3, 1.9, 's'); blob(26, 7, 2.4, 1.5, 's'); blob(29, 21.5, 3.2, 1.8, 's');
      blob(GOLF_POND.x, GOLF_POND.y, GOLF_POND.rx, GOLF_POND.ry, '~');
      // the cart path along the bottom
      for (let x = 0; x < 37; x++) { set(x, 27, '='); set(x, 28, '='); }
      // trees around the edges (the woods on the right, with the condos beyond)
      for (let x = 0; x < 36; x += 3) { set(x, 0, 'T'); }
      for (let y = 3; y < 26; y += 3) set(0, y, 'T');
      return g.map((r) => r.join(''));
    },
    setup(w) {
      const f = flags(), sp = G.spr, T = 16;
      // the woods between the course and the condos' yards
      for (let y = 0; y < w.h - 1; y += 2) { w.addTree(36, y, y % 4 ? 'pine' : null); w.addTree(38, y + 1 < w.h - 1 ? y + 1 : y, 'pine'); }
      w.blockTiles(36, 0, 4, w.h);
      // the green and its pin
      w.props.push({ img: null, x: 0, y: 0, flat: true, base: 0, draw(ctx, cx, cy) {
        const x = 31 * T - cx, y = 11.5 * T - cy;
        ctx.fillStyle = '#4aa83e'; ctx.beginPath(); ctx.ellipse(x, y, 46, 30, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#7ad866'; ctx.beginPath(); ctx.ellipse(x, y, 43, 27, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1c3a1c'; ctx.fillRect(x + 8, y - 2, 5, 3);
      } });
      w.addProp({ img: sp.golfFlag, tx: 31, ty: 10, h: 2, dx: 7, dy: 3, solid: [31, 11, 1, 1], hit: [31, 11, 1, 1], talk: look('The pin on the green. Somebody has chewed the flagstick.') });
      w.props.push({ img: null, x: 0, y: 0, base: 0, hit: [36 * T, 0, 40 * T, w.h * T], talk: look('The woods between the golf course and the condos. Abe and Hannah\'s is on the other side.') });
      // golfers around the edges (they tee off at Nate during the fight)
      for (const [x, y, sprite, delay] of [[2, 13, 'golferA', 90], [20, 2, 'golferB', 160], [33, 26, 'golferC', 230]]) {
        w.add(new G.Golfer({ x: x * T + 8, y: y * T + 12, sprite, delay, name: 'Golfer', talk: S.golferTalk }));
      }
      // Romulus, on the green
      if (!f.romulusBeaten) {
        const P = GOLF_POND;
        w.romulus = w.add(new G.GiantRomulus(30 * T, 12 * T, { x0: 4 * T, y0: 5 * T, x1: 34 * T, y1: 26 * T, pond: { x: P.x * T, y: P.y * T, rx: P.rx * T, ry: P.ry * T } }));
        w.romulus.pose = 'happy';
      }
      // the cart path: the way back (once Romulus is himself again)
      w.addTrigger(0, 27, 1, 2, () => { if (!w.romFight) G.script.run(S.golfLeave()); });
      w.addTrigger(20, 29, 4, 1, () => { if (!w.romFight) G.script.run(S.golfLeave()); });
    },
    onEnter() { return (function* () { if (!flags().romulusBeaten) yield* S.romulusFight(); })(); },
  };

  // ---------------------------------------------------------------- downstairs
  //   x: 0 left wall (golf course side) ... 26 right wall (the storage garage is beyond it)
  //   dining room x 1-9, y 3-7 | galley kitchen x 10-16, y 3-6 | laundry x 18-20, y 3-5
  //   living room x 1-9, y 8-18 | front hall x 10-12, y 7-18, stairs x 13-14, y 12-17
  //   back hall x 13-25, y 9-10 | bath x 16-19, y 14-18 | Abe and Hannah's room x 21-25, y 14-18
  G.MAPS.condoDown = {
    name: 'Abe & Hannah\'s',
    music: 'house',
    tiles() {
      const W = 27, H = 20;
      const g = Array.from({ length: H }, () => Array(W).fill('w'));
      const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < W && y < H) g[y][x] = c; };
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) set(x + i, y + j, c); };
      const room = (x, y, w, h, face, floor) => { fill(x, y, w, 2, face); fill(x, y + 2, w, h - 2, floor); };
      room(1, 1, 9, 18, '$', '*');   // dining room (top) and living room (bottom): one open space
      room(10, 1, 7, 6, '$', ')');   // galley kitchen
      fill(11, 3, 6, 1, '/');        // counters along the wall (the fridge stands at x 10)
      fill(12, 6, 5, 1, '/');        // the breakfast bar
      set(17, 4, ')');               // kitchen / laundry
      room(18, 1, 3, 5, '$', ')');   // laundry
      fill(10, 7, 3, 12, '*');       // front hall
      fill(13, 7, 4, 4, '*');        // the breakfast-bar side
      fill(13, 11, 2, 1, '*');       // the top of the stairs
      room(17, 7, 9, 4, '$', '*');   // back hall
      fill(13, 12, 2, 6, ';');       // stairs up
      fill(13, 18, 2, 1, '*');       // the foot of the stairs
      room(16, 12, 4, 7, '$', ')');  // bath
      room(21, 12, 5, 7, '$', '*');  // Abe and Hannah's room
      // doorways
      fill(19, 11, 1, 3, ')');       // back hall / bath
      fill(20, 15, 1, 2, '*');       // bath / bedroom
      fill(21, 11, 1, 3, '*');       // back hall / bedroom
      // the outside walls: the slider and the windows on either side of the fireplace (left),
      // the big window nook, the front door and the bedroom windows (bottom)
      fill(0, 4, 1, 2, '}');
      set(0, 12, '['); set(0, 16, '[');
      fill(3, 19, 5, 1, 'G'); set(13, 19, '>'); fill(22, 19, 3, 1, 'G');
      return g.map((r) => r.join(''));
    },
    setup(w) {
      const F = furnish(w), sp = G.spr, f = flags();
      const spot = (x, y, wt, ht, talk) => w.props.push({ img: null, x: 0, y: 0, base: 0, hit: [x * 16, y * 16, (x + wt) * 16, (y + ht) * 16], talk });
      // ---- dining room (x 1-9, y 3-7), from the user's photo: under the loft, a black iron chandelier over the
      // light oak table and four white Windsor chairs, the dark carved sideboard and a big monstera against the
      // back wall, Romulus's bowls by the kitchen, and the slider out to the patio (x 1, y 4-5 stays clear)
      F.stand(sp.monstera, 3, 3, 1, look('A huge monstera plant. It is thriving. Somebody in this house has a green thumb.'));
      F.stand(sp.condoSideboard, 4, 3, 3, look('A dark carved sideboard. Bottles, candlesticks, a little plant and a lamp on top.'));
      F.stand(sp.condoDiningSet, 3, 5, 5, look('A light wood table and four white spindle-back chairs.'), { ht: 2 });
      w.props.push({ img: sp.chandelier, x: 5 * 16 - 12, y: 54, base: 7 * 16 });
      w.addProp({ img: sp.dogBowls, tx: 9, ty: 7, dx: -3, dy: -2, flat: true, hit: [9, 7, 1, 1], talk: look('Romulus\'s food and water bowls, up on a little wooden stand.') });
      spot(0, 4, 1, 2, look('The sliding glass door out to the patio.'));
      // ---- living room (x 1-9, y 8-18), from the user's photos: vaulted ceiling, the loft looks down on it from
      // upstairs. The navy bird rug, the cream couch facing the fireplace with the cherry trestle coffee table in
      // front of it, the cream end table and its crystal lamp, a cream armchair, the white glass cabinet and
      // Romulus's bed along the left wall, and a little chest with a plant by the big window.
      w.addProp({ img: sp.condoFireplace, tx: 1, ty: 13, h: 3, flat: true, solid: [1, 13, 1, 3], hit: [1, 13, 2, 3], talk: look('The fireplace: a white mantel and a marble surround, with a window on each side looking out at the golf course.') });
      w.props.push({ img: sp.birdRug, x: 3 * 16, y: 11 * 16, flat: true, base: 0 });
      F.stand(sp.glassCabinet, 1, 9, 1, look('A white cabinet with glass doors, and a lamp with a pleated shade on top.'));
      w.addProp({ img: sp.dogBed, tx: 1, ty: 11, dy: 1, flat: true, solid: [1, 11, 2, 1], hit: [1, 11, 2, 1], talk: look('Romulus\'s bed. Plush, and absolutely covered in dog hair.') });
      F.stand(sp.condoArmchair, 4, 10, 1, look('A cream armchair.'));
      F.stand(sp.trestleTable, 5, 12, 2, look('A dark wood trestle coffee table, with a wooden bowl on it.'), { ht: 3 });
      F.stand(sp.condoEndTable, 9, 11, 1, look('A little cream end table with a drawer, and a brass lamp with a crystal shade.'));
      F.stand(sp.condoSofa, 8, 12, 2, look('The cream couch. Comfy. Prime real estate.'), { ht: 4 });
      F.stand(sp.smallChest, 8, 18, 1, look('A small wooden chest of drawers, with a pothos on top.'));
      spot(0, 12, 1, 1, look('A window looking out toward the golf course.'));
      spot(0, 16, 1, 1, look('A window looking out toward the golf course.'));
      spot(3, 19, 5, 1, look('The big window nook, looking out at the front walk.'));
      // ---- front hall (x 10-12, y 7-18): the front door at the bottom, the stairs straight ahead, a brass lantern overhead
      // FURNITURE (photos pending): a console table, coat rack or wall art along x 10, y 13-17.
      w.props.push({ img: sp.entryLantern, x: 11 * 16 + 3, y: 14 * 16, base: 18 * 16 });
      // ---- galley kitchen (x 10-16, y 3-6): stainless fridge, light gray cabinets, white counters,
      // glass-top range with the microwave over it, the sink and dishwasher, and the breakfast bar. From the
      // user's photo: a runner rug and a crock of wooden spoons on the counter. (The white pantry hutch at the
      // end of the galley is gone: the user asked for it out, it hid Romulus behind the breakfast bar.)
      F.stand(sp.condoFridge, 10, 3, 1, () => S.abeReach('fridge'));
      F.hang(sp.condoUppers.two, 11, 2, 2, null, 10);
      F.hang(sp.condoUppers.micro, 13, 2, 1, null, 10);
      F.hang(sp.condoUppers.three, 14, 2, 3, null, 10);
      spot(11, 3, 2, 1, look('White countertops and light gray cabinets.'));
      w.addProp({ img: sp.glassRange, tx: 13, ty: 3, hit: [13, 3, 1, 1], talk: look('A glass-top range, with the microwave right above it.') });
      w.addProp({ img: sp.dishwasher, tx: 14, ty: 3, flat: true, hit: [14, 3, 1, 1], talk: look('The dishwasher.') });
      w.addProp({ img: sp.sinkTop, tx: 15, ty: 3, flat: true, dy: -10, hit: [15, 3, 2, 1], talk: look('The kitchen sink.') });
      spot(12, 6, 5, 1, look('The breakfast bar.'));
      w.props.push({ img: sp.kitchenRunner, x: 11 * 16 - 1, y: 4 * 16 + 5, flat: true, base: 0 });
      F.onCounter(sp.utensilCrock, 12, 3, null);
      if (f.condoScare && !G.state.party.includes('abe')) w.abe = w.add(new G.NPC({ sprite: 'abe', name: 'Abe', x: 12 * 16 + 8, y: 5 * 16 + 14, dir: 'down', talk: S.abeCondo }));
      // Romulus: curled up in his bed the first time; then hiding from Nate all over (ROM_SPOTS); back behind
      // the breakfast bar for good once the golf course is behind him
      if (!f.romulusMet) w.romulus = w.add(new G.Romulus(2 * 16, 11 * 16 + 12, 'lie'));
      else if (f.romulusBeaten) w.romulus = w.add(new G.Romulus(15 * 16 + 8, 5 * 16 + 12, 'hide'));
      else S.romSpawn(w, 'condoDown');
      // ---- laundry (x 18-20, y 3-5), at the far end of the kitchen
      F.stand(sp.washerFront, 19, 3, 1, look('The washer and dryer face each other across the laundry room. Like a standoff.'));
      F.hang(sp.wireShelf, 19, 2, 1, null, 16);
      F.stand(sp.dryerBack, 19, 5, 1, look('The dryer, staring down the washer.'));
      // ---- back hall (x 13-25, y 9-10)
      // FURNITURE (photos pending): wall art on the hall wall, x 17-25, y 7-8.
      // ---- the downstairs bath (x 16-19, y 14-18): doors to the hall and to the bedroom
      // From the user's photo: the leafy shower curtain, a fluffy bath mat, a little basket on the toilet tank
      // (keep x 19, y 14-16 clear: both doors).
      F.hang(sp.bathMirror, 16, 13, 2, null, 8);
      F.stand(sp.condoVanity, 16, 14, 2, S.condoSink);
      F.hang(sp.openShelves, 18, 13, 1, look('Open shelves over the toilet.'), 4);
      F.stand(sp.toilet, 18, 14, 1, look('...It\'s a toilet, Nate.'));
      F.stand(sp.tubCurtain, 16, 17, 3, look('A bathtub with a leafy shower curtain: green leaves and little yellow flowers.'), { ht: 2 });
      w.props.push({ img: sp.bathMat, x: 16 * 16 + 2, y: 15 * 16 + 2, flat: true, base: 0 });
      w.props.push({ img: sp.tankBasket, x: 18 * 16 + 3, y: 14 * 16 - 6, base: 14 * 16 + 16 });
      // ---- Abe and Hannah's room (x 21-25, y 14-18): two sets of white bifold closets, windows facing the front walk
      // From the user's photos: the bed (green and white sheets, per the user) with its head against the outside wall (x 23-25,
      // y 16-17), a white nightstand with an amber glass-ball lamp above it and a dark wood one below, the cream
      // dresser in the corner, and a white ceiling fan over the bed (keep x 21, y 14-16 clear: the doors from
      // the hall and from the bath). Wall art: x 21, y 12-13 (the closets take x 22-25).
      F.hang(sp.bifoldCloset, 22, 13, 2, look('A closet with white bifold doors.'), 1);
      F.hang(sp.bifoldCloset, 24, 13, 2, look('The other closet. Also white bifold doors. Two closets: one each.'), 1);
      spot(22, 19, 3, 1, look('Windows looking out at the front walk.'));
      F.stand(sp.nightstandAmber, 25, 15, 1, look('A white nightstand, and a lamp made of stacked amber glass balls under a burlap shade.'));
      F.stand(sp.condoBed, 23, 16, 3, look('Abe and Hannah\'s bed: green and white sheets, green pillowcases. Unmade.'), { ht: 2 });
      F.stand(sp.nightstandDark, 25, 18, 1, look('A dark wood nightstand, with a white-shaded lamp.'));
      F.stand(sp.creamDresser, 21, 18, 1, look('A cream dresser with fancy brass pulls.'));
      w.props.push({ img: null, x: 22 * 16 + 4, y: 14 * 16 - 4, base: 20 * 16, draw(ctx, cx, cy) { ctx.drawImage(sp.ceilingFan[(G.tick >> 2) % 4], this.x - cx, this.y - cy); } });
      // ---- ways out
      w.addTrigger(13, 12, 2, 1, () => G.play.warp('condoUp', 13, 11, 'up'));
      w.addWarp(13, 19, 1, 1, 'condo', 23, 18, 'down');
      w.addWarp(0, 4, 1, 2, 'condo', 17, 12, 'left');
    },
    onEnter() { return (function* () { if (!flags().romulusMet) yield* S.romulusMeet(); })(); },
  };

  // ---------------------------------------------------------------- upstairs
  //   the loft x 1-14, y 3-11 (over the dining room and kitchen), its railing looking down on the
  //   living room (x 1-9, y 9-18) and the front hall (x 10-12, y 13-18); stairs down x 13-14, y 12-17
  //   the bedroom / Abe's office x 16-25, y 11-18, with its bath (x 16-19, y 3-7) and walk-in closet (x 21-25, y 3-7)
  G.MAPS.condoUp = {
    name: 'Abe & Hannah\'s: Upstairs',
    music: 'house',
    tiles() {
      const W = 27, H = 20;
      const g = Array.from({ length: H }, () => Array(W).fill('w'));
      const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < W && y < H) g[y][x] = c; };
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) set(x + i, y + j, c); };
      const room = (x, y, w, h, face, floor) => { fill(x, y, w, 2, face); fill(x, y + 2, w, h - 2, floor); };
      room(1, 1, 14, 11, '$', '(');  // the loft
      fill(1, 8, 9, 1, ']');         // its railing over the living room...
      fill(1, 9, 9, 10, '{');        // ...two stories down
      fill(10, 12, 3, 1, ']');       // and over the front hall
      fill(10, 13, 3, 6, '{');
      fill(13, 12, 2, 6, '?');       // stairs down
      fill(13, 18, 2, 1, '{');
      fill(0, 4, 1, 3, '[');         // the big loft window, toward the golf course
      room(16, 1, 4, 7, '$', ')');   // bath
      room(21, 1, 5, 7, '$', '(');   // walk-in closet
      room(16, 9, 10, 10, '$', '('); // bedroom / Abe's office
      set(15, 11, '(');              // the door off the loft
      fill(18, 8, 1, 3, ')');        // bedroom / bath
      fill(23, 8, 1, 3, '(');        // bedroom / closet
      fill(18, 19, 2, 1, 'G');       // the double window over the front door
      return g.map((r) => r.join(''));
    },
    setup(w) {
      const F = furnish(w), sp = G.spr;
      const spot = (x, y, wt, ht, talk) => w.props.push({ img: null, x: 0, y: 0, base: 0, hit: [x * 16, y * 16, (x + wt) * 16, (y + ht) * 16], talk });
      // ---- the loft (x 1-14, y 3-11): carpet, the big window, the railing over the living room. From the user's
      // photos: the TV on its cherry console against the back wall, the big gray ottoman, and the light gray
      // couch facing the TV with its back to the railing; in the corner by the window (teal curtains), the
      // bookshelf, a brass floor lamp and Abe's yellow electric guitar (no dog crate: Romulus doesn't have one)
      // (keep x 13-14, y 11 clear at the top of the stairs, and x 14, y 11 for the bedroom door).
      // Wall art: the top wall, x 1-14, y 1-2.
      spot(0, 4, 1, 3, look('The big loft window, looking out over the golf course.'));
      for (const y of [4 * 16 + 4, 7 * 16 + 4]) w.props.push({ img: sp.tealCurtain, x: 16, y: y - 44, base: y });
      F.stand(sp.condoBookshelf, 1, 3, 1, () => S.abeReach('bookshelf'));
      F.stand(sp.condoFloorLamp, 2, 3, 1, look('A brass floor lamp with a pleated shade.'));
      F.stand(sp.yellowGuitar, 3, 3, 1, look('A yellow electric guitar. Abe\'s, obviously. Nate knows better than to touch it.'));
      F.stand(sp.loftTV, 5, 3, 3, look('A big TV on a cherry console. It\'s showing the ocean. Very relaxing.'));
      F.stand(sp.grayOttoman, 5, 5, 3, look('A big gray ottoman. Somebody left a game of cards on it.'));
      F.stand(sp.loftSofaBack, 4, 7, 5, look('A light gray couch, piled with striped pillows and a fuzzy white throw.'));
      spot(1, 8, 9, 1, look('The loft railing. Straight down: the living room.'));
      spot(10, 12, 3, 1, look('The railing over the front hall.'));
      // ---- the bedroom, which doubles as Abe's office (x 16-25, y 11-18). Abe is an AI and machine learning engineer.
      // From the user's photos, tidied up (no suitcases, clothes or clutter): the white desk with two monitors and a
      // gray office chair between the bath and closet doors, a black floor lamp, the spare bed with its iron headboard
      // against the left wall and a wood chest at its foot, the white cube shelf (books, records, Catan, speakers; a
      // printer, record player and lamp on top), Abe's little amp and three guitars in the corner, two framed vintage
      // guitar ads and the WILCO poster on the wall (keep x 16, y 11 clear for the door from the loft, x 18 and x 23 at
      // y 11 for the bath and closet doors, and x 22-23, y 17 so Nate can reach the amp to jam).
      F.hang(sp.atticHatch, 25, 10, 1, look('A little attic hatch. Whatever is up there can stay up there.'), 8);
      spot(18, 19, 2, 1, look('A double window, right over the front door.'));
      F.hang(sp.guitarAdPrints, 22, 10, 1, look('Two framed vintage guitar ads: old-timey paintings, with speech bubbles about guitars.'), 2);
      F.hang(sp.wilcoPoster, 24, 10, 1, look('A framed concert poster: WILCO, at the Dome in Virginia Beach. Seagulls and beach umbrellas.'), 3);
      F.stand(sp.blackFloorLamp, 17, 11, 1, look('A black floor lamp with a white shade.'));
      F.stand(sp.officeDesk, 19, 11, 3, look('Abe\'s desk: two monitors up on a little wooden stand, a keyboard and a mug. This is where the AI and machine learning happens. Or the guitar videos.'));
      F.stand(sp.officeChair, 20, 12, 1, look('A gray office chair. It spins. Nate spins it.'));
      F.stand(sp.guestBed, 16, 14, 3, look('The spare bed: a black iron headboard and a white comforter with gray vines. Made, for once.'), { ht: 2 });
      F.stand(sp.woodChest, 19, 14, 1, look('A dark wood chest at the foot of the bed.'), { ht: 2 });
      F.stand(sp.cubeShelf, 20, 18, 2, look('A white cube shelf: books, a whole row of records, two Catan boxes and little speakers, with a printer, a record player and a lamp on top.'));
      F.stand(sp.guitarTrio, 24, 18, 2, look('Three more of Abe\'s guitars, leaning in the corner. How many guitars does one man need? More. The answer is always more.'));
      F.stand(sp.vibroAmp, 22, 18, 2, () => S.abeAmp());
      // ---- the upstairs bath (x 16-19, y 3-7): tub with sliding glass doors, vanity, toilet
      // FURNITURE (photos pending): towels, a bath mat, decor.
      F.stand(sp.tubGlass, 16, 3, 2, look('A bathtub behind sliding glass doors.'), { ht: 2 });
      F.hang(sp.bathMirror, 18, 2, 2, null, 6);
      F.stand(sp.condoVanity, 18, 3, 2, look('The upstairs vanity.'));
      F.stand(sp.toilet, 19, 5, 1, look('Another toilet. Still a toilet, Nate.'));
      // ---- walk-in closet (x 21-25, y 3-7), from the user's photo: junk, and guitars. The white shelves crammed
      // full on the left, jackets and a garment bag on the rod, Abe's guitars on stands and in cases, a little
      // amp, and a pile of boxes, storage bags and an ugly Christmas sweater (x 23, y 4-7 stays clear from the door).
      F.hang(sp.closetRods, 21, 2, 5, look('The walk-in closet: a wire shelf and a hanging rod.'), 8);
      F.stand(sp.closetShelves, 21, 3, 2, look('Shelves crammed with stuff: a LEGO Technic box, a shoe box, a coil of yellow guitar cable, and a framed jersey number 5, signed by everybody.'));
      w.props.push({ img: sp.hangingClothes, x: 23 * 16, y: 35, base: 3 * 16 + 15, hit: [23 * 16, 3 * 16, 26 * 16, 4 * 16], talk: look('Jackets, a plaid shirt, and a garment bag on the rod.') });
      w.blockTiles(23, 3, 3, 1);
      F.stand(sp.caseBlack, 24, 4, 1, () => S.closetCase());
      F.stand(sp.caseTweed, 25, 4, 1, look('A tweed guitar case. "Vintage," Abe would say.'));
      F.stand(sp.guitarAcoustic, 21, 5, 1, look('A sunburst acoustic guitar on a stand. One of Abe\'s. There are a LOT of Abe\'s guitars.'));
      F.stand(sp.guitarElectric, 22, 5, 1, look('A black electric guitar with a white pickguard. Another one of Abe\'s.'));
      F.stand(sp.miniAmp, 21, 7, 1, look('A little guitar amp. Nate leaves the volume knob alone.'));
      F.stand(sp.closetJunk, 24, 7, 2, look('Boxes, zippered storage bags, and an ugly Christmas sweater with a gingerbread man on it, dumped on top.'));
      // ---- Romulus, if he's hiding up here
      S.romSpawn(w, 'condoUp');
      // ---- way down
      w.addTrigger(13, 17, 2, 1, () => G.play.warp('condoDown', 13, 18, 'down'));
    },
  };

  // ================================================================ TOM'S PIZZA (Lafayette)
  // A real family favorite in Union, NJ: Tom always picks up the phone with "TOM'S PIZZA!"
  // and everybody calls in orders just to hear it. Here he's just opened his second store.
  S.tom = function* () {
    const f = flags();
    if (!f.tomMet) {
      f.tomMet = true;
      yield G.say('Tom', 'TOM\'S PIZZA!');
      yield G.say('Nate', '...Tom? From Union? What are you doing in Easton?');
      yield G.say('Tom', 'I just opened my second store! Right here on College Hill, by Lafayette!');
      yield G.say('Tom', 'Union, and now College Hill. Two Tom\'s Pizzas.');
      yield G.say('Nate', 'Dad is going to lose his mind.');
      yield G.say('Tom', 'Your father! Tell him I said hello. His picture is on the wall over there.');
      return;
    }
    f.tomLine = ((f.tomLine || 0) + 1) % 3;
    yield G.say('Tom', ['TOM\'S PIZZA!', 'Two stores! Union and College Hill. You tell everybody.', 'Next time, call ahead. I like to answer the phone.'][f.tomLine]);
  };
  // the framed photo of Dad and Tom on the wall
  S.tomPhoto = function* () {
    if (G.photoHas('dadAndTom')) { yield G.say(null, 'Dad and Tom, framed on the wall of Tom\'s Pizza.'); return; }
    yield G.say(null, 'A framed photo on the wall: Dad and Tom, behind the counter at the original Tom\'s Pizza in Union.');
    yield G.say('Nate', 'Dad looks thrilled. Tom looks like he has eleven pizzas in the oven.');
    G.audio.sfx('blip');
    yield G.wait(14);
    yield* S.photoGive('dadAndTom');
  };

  // College Hill: a little street of shops just west of campus. Tom's Pizza in the middle,
  // the grocery store (set up for a joke later; locked for now) and an empty shop for lease.
  G.MAPS.collegeHill = {
    name: 'College Hill',
    music: 'field',
    tiles() {
      const W = 32, H = 14;
      const g = Array.from({ length: H }, () => Array(W).fill('.'));
      const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < W && y < H) g[y][x] = c; };
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) set(x + i, y + j, c); };
      for (let x = 0; x < W; x += 2) set(x, 0, 'T');   // trees behind the shops
      fill(0, 6, W, 2, 'C');                           // the sidewalk in front of the shops
      fill(0, 8, W, 1, 'a'); fill(0, 9, W, 1, 'Y');   // the street (two lanes)
      fill(0, 10, W, 1, 'C');                          // the far sidewalk
      for (let x = 1; x < W; x += 4) set(x, 12, 'T');  // trees across the street
      return g.map((r) => r.join(''));
    },
    setup(w) {
      const sp = G.spr;
      // the shops (doors at x + 3): the grocery store, Tom's Pizza, an empty one
      const shop = (img, x) => { w.addProp({ img, tx: x, ty: 2, h: 4 }); w.blockTiles(x, 2, 6, 4); };
      shop(sp.groceryStore, 3); shop(sp.tomsPizza, 13); shop(sp.forLeaseShop, 23);
      w.block[5 * w.w + 16] = 0;
      w.addWarp(16, 5, 1, 1, 'toms', 6, 8, 'up');
      w.props.push({ img: null, x: 0, y: 0, base: 0, hit: [6 * 16, 5 * 16, 7 * 16, 6 * 16], talk: () => S.groceryDoor() });
      w.props.push({ img: null, x: 0, y: 0, base: 0, hit: [26 * 16, 5 * 16, 27 * 16, 6 * 16], talk: look('An empty shop. FOR LEASE. Somebody should open a rock shop.') });
      for (const x of [10, 20]) w.addTree(x, 3);
      // lampposts along the sidewalk
      for (const x of [1, 11, 21, 28]) w.addProp({ img: sp.lamppost, tx: x, ty: 6, dx: 2, solid: [x, 6, 1, 1] });
      w.add(new G.Sign(29, 10, ['COLLEGE HILL', 'EAST: back to campus.']));
      w.add(new G.Sign(17, 7, ['TOM\'S PIZZA', 'Our second location! (The first one is in Union, NJ.) Call ahead.']));
      // the street runs east, back to campus (onto the main path)
      w.addTrigger(31, 8, 1, 2, () => G.play.warp('campus', 1, 12, 'right'));
      w.blockTiles(31, 6, 1, 2); w.blockTiles(31, 10, 1, 1);
    },
    // after the main event, there's a beat thumping out of the grocery store (Dad's class)
    tick(w) {
      if (!flags().dadBeaten || G.script.busy || G.tick % 39) return;
      const p = G.play.player, k = (G.tick / 39) % 4;
      if (Math.abs(p.x - 6.5 * 16) < 140) w.pop(6 * 16 + 8 + (k % 2 ? 9 : -9), 4 * 16 + 10, ['*boom*', '*tss*', '*boom boom*', '*tss*'][k], '#f878d8');
    },
  };

  // ---------------------------------------------------------------- Dad's hip hop class
  // A real Dad joke (the user's): he swears he teaches hip hop dance at the local grocery store
  // after they close, and none of the kids believe him. Here it's true, and it's a SURPRISE: nobody
  // says it before Nate walks in. Just clues that make sense afterward: one-banana receipts in
  // Dad's truck (from this store, Tuesdays, 10:45 at night), brand-new high-tops in his workshop,
  // Dad caught mid-move ("...Stretching."), Mom's "Tuesday thing", Doron on Dad's Running Man, a
  // boombox in the produce section through the store's window. After the main event, the door is
  // propped open with a beat coming out. Inside, after close: Dad's class (two church ladies,
  // the stock boy, a guy who came in for milk). Follow Dad's moves with the arrows for three
  // rounds and he teaches Nate his signature move, The Shopping Cart, on the pipe (anything that
  // hears it has to dance). Nate texts the family a photo. Nobody believes him.
  // Flags: bananaSeen, tuesdayHeard, runningMan (clues), hipHopMet, hipHopRound (0-3), hipHopDone, signal_cart.
  G.CAST.dadHipHop = Object.assign({}, G.CAST.dad, { hairStyle: 'cap', hat: '#d83030', hatStyle: 'ball', coat: '#3a6ad8', shirt: '#f8f8f0', pants: '#2a2c38', shoes: '#f8f8f8' });
  G.CAST.churchLady1 = { skin: '#f4cdb0', hair: '#c8c8d0', hairStyle: 'short', glasses: '#8a6a9a', blush: true, smile: '#ffffff', coat: '#c87898', shirt: '#f4f0e8', pants: '#5a5a7a', shoes: '#f0f0f0', torso: 5, legs: 3 };
  G.CAST.churchLady2 = { skin: '#8a5a3a', eyes: '#140c0a', hair: '#e8e8ec', hairStyle: 'shoulder', smile: '#ffffff', coat: '#4a9a8a', shirt: '#f8d878', pants: '#3a3a4a', shoes: '#f0f0f0', torso: 5, legs: 3 };
  G.CAST.stockBoy = { skin: '#f2c8a0', hair: '#c8a46c', hairStyle: 'short', blush: true, shirt: '#2e8a48', logo: '#f4f0e8', pants: '#c8b088', shoes: '#2a2a2a', torso: 5, legs: 3 };
  G.CAST.milkGuy = { skin: '#e8b890', hair: '#3a2a20', hairStyle: 'receding', beard: '#3a2a20', shirt: '#8a6a4a', pants: '#3a4a6a', shoes: '#4a3428', torso: 6, legs: 4 };
  const HIP_MOVES = { up: 'THE ROBOT', down: 'THE SPRINKLER', left: 'THE RUNNING MAN', right: 'THE MOONWALK' };
  const HIP_ROUNDS = [['up', 'left', 'right'], ['down', 'down', 'left', 'up'], ['right', 'up', 'down', 'left', 'right']];
  const HIP_SPOT = [7.5 * 16, 6.9 * 16];      // Nate's spot on the floor (high enough that text goes at the bottom)
  // a dance move: face that way and hop (the grocery's tick animates the hop)
  const hipMove = (e, d) => { e.dir = d; e.danceT = 20; };
  // Nate's turn: copy the sequence with the arrows (about 4 seconds per move); `ok` says how it went
  const followDad = (seq, w) => ({
    start() { this.i = 0; this.t = 0; this.ok = null; },
    update() {
      const inp = G.input, p = P();
      if (++this.t > 240) { this.ok = false; this.slow = true; G.audio.sfx('bump'); return true; }
      for (const d of ['up', 'down', 'left', 'right']) {
        if (!inp.hit(d)) continue;
        hipMove(p, d);
        for (const e of w.dancers) hipMove(e, d);
        w.pop(p.x, p.y - 34, G.arrows([d]), '#f8f8f0');
        if (d !== seq[this.i]) { this.ok = false; G.audio.sfx('bump'); return true; }
        this.i++; this.t = 0;
        G.audio.sfx('blip');
        if (this.i >= seq.length) { this.ok = true; return true; }
      }
      return false;
    },
    // a little panel up top: YOUR TURN, a dot per move, and a timer bar
    draw(ctx) {
      const n = seq.length, w0 = 18 + n * 10, x0 = Math.round((G.W - w0) / 2), y0 = 6;
      ctx.fillStyle = '#1c1424'; ctx.fillRect(x0, y0, w0, 22); ctx.fillStyle = '#f878d8'; ctx.fillRect(x0 + 1, y0 + 1, w0 - 2, 1);
      G.font.draw(ctx, 'YOUR TURN', x0 + Math.round((w0 - G.font.width('YOUR TURN')) / 2), y0 + 3, '#f8e070');
      for (let i = 0; i < n; i++) { ctx.fillStyle = i < this.i ? '#78e070' : '#5a5064'; ctx.fillRect(x0 + 9 + i * 10, y0 + 13, 6, 4); }
      ctx.fillStyle = '#f878d8'; ctx.fillRect(x0 + 2, y0 + 19, Math.round((w0 - 4) * (1 - this.t / 240)), 1);
    },
  });
  // Dad shows the moves: each one called out over his head
  function* dadShows(w, seq) {
    const dad = w.hipDad;
    for (const d of seq) {
      hipMove(dad, d);
      w.pop(dad.x, dad.y - 40, G.arrows([d]) + ' ' + HIP_MOVES[d], '#f8e070');
      G.audio.sfx('blip');
      yield G.wait(34);
    }
    dad.dir = 'down';
  }
  S.groceryDoor = function* () {
    const f = flags();
    if (!f.dadBeaten) {
      yield G.say(null, 'The grocery store. The doors are locked. A sign on the glass says BACK SOON.');
      yield G.say(null, 'Way in the back, past the registers, there\'s a boombox sitting in the produce section. Huh.');
      return;
    }
    // after hours: the door's propped open, and there's a beat coming out
    if (!f.hipHopMet) yield G.say(null, 'The sign on the door says CLOSED. The door is propped open with a jug of milk. There\'s a beat coming from inside.');
    G.audio.sfx('door');
    G.play.warp('grocery', 7, 9, 'up');
  };
  S.groceryEnter = function* () {
    const f = flags(), w = G.play.world, dad = w.hipDad;
    if (f.hipHopMet) return;
    yield G.wait(24);
    yield G.say(null, 'Half the lights are off. There\'s a boombox in the produce section. And a voice, counting:');
    yield G.say('Dad', 'FIVE, SIX, SEVEN, EIGHT!');
    for (const d of ['left', 'right', 'left']) { for (const e of [dad, ...w.dancers]) hipMove(e, d); yield G.wait(22); }
    dad.dir = 'down';
    for (const e of w.dancers) e.dir = 'up';
    yield G.wait(20);
    yield G.say('Nate', '...');
    yield G.say('Nate', 'DAD?!');
    yield* S.hipHopDad();
  };
  S.hipHopDad = function* () {
    const f = flags(), s = G.state, w = G.play.world, p = P(), dad = w.hipDad;
    if (!f.hipHopMet) {
      f.hipHopMet = true;
      yield G.say('Dad', 'Nate?! ...You weren\'t supposed to find out like this.');
      yield G.say('Nate', f.bananaSeen ? 'Wait. Is THIS what all the bananas were?' : f.tuesdayHeard ? 'Wait. Is THIS your "Tuesday thing"?' : 'Dad. You teach HIP HOP?');
      if (f.bananaSeen) yield G.say('Dad', 'You can\'t just walk into a grocery store and not buy anything, Nate. I like bananas.');
      yield G.say('Dad', 'Every Tuesday, after close. The manager owes me a favor. I married him.');
      yield G.say('Nate', 'You WHAT?');
      yield G.say('Dad', 'To his wife, Nate. I officiated. I\'m a pastor.');
      yield G.say('Dad', 'Grab a spot. Class is in session.');
    } else if (f.hipHopDone) {
      f.hipLine = ((f.hipLine || 0) + 1) % 3;
      yield G.say('Dad', ['Same time next Tuesday. Bring your siblings. They won\'t come.', 'The Shopping Cart is a lifestyle, Nate. Not just a move.', 'Peace be with you. And POP. And LOCK.'][f.hipLine]);
      const c = yield G.ask('Dad', 'One more time, from the top?', ['From the top', 'I\'m good']);
      if (c !== 0) return;
    }
    if (!f.hipHopDone && f.hipHopRound) yield G.say('Dad', 'Back for more! We were on round ' + G.sayable(f.hipHopRound + 1) + '.');
    else if (!f.hipHopDone) {
      const c = yield G.ask('Dad', 'Ready to learn the routine?', ['Let\'s dance', 'Just watching']);
      if (c !== 0) { yield G.say('Dad', 'Watching is the first step. The second step is the Running Man.'); return; }
    }
    // Nate takes his spot on the floor, between the stock boy and the guy with the milk
    yield G.walkTo(p, HIP_SPOT[0], HIP_SPOT[1], 1.2);
    p.dir = 'up';
    if (!f.hipHopRound) yield G.say('Dad', 'I do it, you do it. Use the arrows. Feel it in your hips.');
    const start = f.hipHopDone ? 0 : f.hipHopRound || 0;
    for (let r = start; r < HIP_ROUNDS.length; r++) {
      yield G.say('Dad', ['Round one. Nice and easy.', 'Round two! Pick it up!', 'Final round. This is where the church ladies usually cry.'][r]);
      yield* dadShows(w, HIP_ROUNDS[r]);
      const turn = followDad(HIP_ROUNDS[r], w);
      yield turn;
      p.dir = 'up';
      if (!turn.ok) {
        f.hipMiss = ((f.hipMiss || 0) + 1) % 3;
        yield G.say('Dad', turn.slow ? 'Too slow! The music doesn\'t wait, Nate.' : ['Close! Watch my hips.', 'That was a different dance. Again!', 'You\'re thinking about it. Stop thinking. FEEL it.'][f.hipMiss]);
        const again = yield G.ask('Dad', 'Again?', ['Again', 'Take a break']);
        if (again !== 0) { yield G.say('Dad', 'Hydrate. Then come back.'); return; }
        r--;
        continue;
      }
      for (const e of w.dancers) w.pop(e.x, e.y - 30, ['WHOO!', 'YEAH!', 'GO NATE!', '*claps*'][w.dancers.indexOf(e)], '#f8f8f0');
      G.audio.sfx('clap');
      if (!f.hipHopDone) f.hipHopRound = r + 1;
      if (r < HIP_ROUNDS.length - 1) yield G.say('Dad', ['Okay! OKAY!', 'Look at those hips! Your mother would be horrified.'][r]);
    }
    // the big finish: everybody, all at once
    for (const d of ['left', 'right', 'up', 'down', 'left']) { for (const e of [dad, p, ...w.dancers]) hipMove(e, d); yield G.wait(20); }
    p.dir = 'up'; dad.dir = 'down';
    if (f.hipHopDone) { yield G.say('Dad', 'Still got it.'); return; }
    yield* S.shoppingCart();
  };
  // the reward: Dad's signature move, on the pipe, and the family group chat
  S.shoppingCart = function* () {
    const f = flags(), s = G.state;
    yield G.say('Dad', 'That\'s my boy.');
    yield G.say('Dad', 'Now. My signature move. I have never taught it to anyone.');
    yield G.say('Dad', 'The Shopping Cart. Push it out, pull it back, push it out again.');
    if (!s.items.pipe) yield* S.pipeGift();
    yield G.say('Dad', 'And it works on the pipe. Left, right, left. Anybody who hears it has to dance. They can\'t help it.');
    f.signal_cart = true;
    f.hipHopDone = true;
    G.audio.sfx('fanfare');
    yield G.itemGet(G.spr.pipe, 'You learned a new pipe song: {p}The Shopping Cart{/}  ' + G.arrows(['left', 'right', 'left']));
    yield G.say(null, 'Puff it on Dad\'s pipe, and anything nearby stops to dance for a few seconds.');
    yield G.say('Nate', 'Nobody is going to believe this.');
    yield G.say(null, 'Nate takes a picture. It comes out blurry. Dad was mid-Sprinkler.');
    G.audio.sfx('buzz');
    yield G.say(null, '{c}~ FAMILY GROUP CHAT ~{/}');
    yield G.text('Nate', 'dad actually teaches hip hop at the grocery store');
    yield G.text('Nate', '[1 photo]');
    yield G.text('Lily', 'no he doesnt');
    yield G.text('Nate', 'there is a PHOTO');
    yield G.text('Abe', 'thats so clearly photoshopped');
    yield G.text('Doron', 'Thats a different guy with a beard');
    yield G.text('Lily', 'dad goes to bed at 8:30');
    yield G.text('Michelle', '...THAT\'S where he goes on Tuesdays?');
    yield G.text('Dad', 'I have been telling you kids this for YEARS.');
    yield G.say('Nate', '...He has, actually. Nobody ever believed him.');
    yield G.say('Dad', 'Welcome to my life, son.');
  };
  // the class
  const hipLines = {
    churchLady1: ['Pastor Christian says the Robot is a form of worship.', 'I\'ve been coming for two years. I can almost do the Sprinkler.'],
    churchLady2: ['Don\'t tell the Bible study. They\'d all want to come. There isn\'t room.', 'Your father has the hips of a much younger pastor.'],
    stockBoy: ['I\'m supposed to be mopping. He said mopping IS dancing.', 'Honestly? This is the best part of my job.'],
    milkGuy: ['I just came in for milk.', 'That was three weeks ago.'],
  };
  const hipTalk = (id, name) => function* () {
    const f = flags(), k = 'hip_' + id;
    f[k] = ((f[k] || 0) + 1) % 2;
    yield G.say(name, hipLines[id][f[k]]);
  };

  // The grocery store on College Hill, after close: the produce section (where the class is), the
  // dairy cooler, aisle endcaps, the checkout, and the lights half off except over the dance floor
  const GW = 'à', GF = 'è';
  G.MAPS.grocery = {
    name: 'The Grocery Store (After Close)',
    music: 'hiphop',
    // (Nate's on his own in here: none of the kids ever see the class, which is the whole joke)
    noFollower: true,
    tiles() {
      const W = 16, H = 11;
      const g = Array.from({ length: H }, () => Array(W).fill('w'));
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) g[y + j][x + i] = c; };
      fill(1, 1, 14, 2, GW); fill(1, 3, 14, 7, GF);
      g[10][7] = 'x';
      return g.map((r) => r.join(''));
    },
    setup(w) {
      const F = furnish(w), sp = G.spr;
      F.hang(sp.produceSign, 1, 2, 4, look('PRODUCE.'), 8);
      F.stand(sp.produceStand, 1, 3, 4, look('Apples, oranges, bananas, lettuce, grapes, tomatoes. Somebody arranged the oranges into a smiley face.'), { ht: 2 });
      F.stand(sp.dairyCooler, 11, 3, 4, look('The dairy cooler. Milk is on sale. The guy with the milk is very aware.'));
      F.stand(sp.aisleShelf, 1, 6, 1, look('Cereal. A LOT of cereal. Nate goes through a box a day.'), { ht: 3 });
      F.stand(sp.aisleShelf, 14, 5, 1, look('Soup cans, stacked in a pyramid. Nobody dances near the pyramid.'), { ht: 3 });
      F.stand(sp.checkout, 10, 9, 3, look('The checkout. The register is asleep. A sign taped to it: CLOSED. HIP HOP IN PROGRESS.'));
      F.stand(sp.mopBucket, 4, 9, 1, look('The stock boy\'s mop bucket. The mop is dry. Very dry.'));
      w.props.push({
        img: sp.boombox[0], x: 9 * 16 + 4, y: 4 * 16 + 4, base: 5 * 16 - 1, hit: [9 * 16, 4 * 16, 10 * 16, 5 * 16], talk: look('Dad\'s boombox. It has a cassette in it. The cassette is labeled "HIP HOP 101 (CLEAN)".'),
        draw(ctx, cx, cy) { ctx.drawImage(G.spr.boombox[(G.tick % 39) < 8 ? 1 : 0], this.x - cx, this.y - cy); },
      });
      w.blockTiles(9, 4, 1, 1);
      // Dad, at the front of the class, and the class
      const npc = (sprite, name, x, y, talk, o = {}) => w.add(new G.NPC(Object.assign({ sprite, name, x, y, dir: 'up', talk }, o)));
      w.hipDad = npc('dadHipHop', 'Dad', 7.5 * 16, 4 * 16 + 6, () => S.hipHopDad(), { dir: 'down' });
      w.hipDad.dancer = true;
      w.dancers = [
        npc('churchLady1', 'Church Lady', 5.6 * 16, 5.6 * 16, hipTalk('churchLady1', 'Church Lady')),
        npc('churchLady2', 'Church Lady', 9.4 * 16, 5.6 * 16, hipTalk('churchLady2', 'Church Lady')),
        npc('stockBoy', 'Stock Boy', 5.7 * 16, 6.9 * 16, hipTalk('stockBoy', 'Stock Boy')),
        npc('milkGuy', 'Guy With Milk', 9.3 * 16, 6.9 * 16, hipTalk('milkGuy', 'Guy With Milk'), { held: sp.milk, heldAt: [7, 6] }),
      ];
      for (const e of w.dancers) e.dancer = true;
      w.addWarp(7, 10, 1, 1, 'collegeHill', 6, 6, 'down');
      // the lights: half off, except a pool over the dance floor, and party lights from the boombox
      const shade = G.canvas(G.W, G.H);
      w.props.push({
        img: null, x: 0, y: 0, base: 99990,
        draw(ctx, cx, cy) {
          const g = shade.getContext('2d'), sx = 7.5 * 16 - cx, sy = 5.8 * 16 - cy;
          g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, G.W, G.H);
          g.fillStyle = 'rgba(14,10,34,0.55)'; g.fillRect(0, 0, G.W, G.H);
          g.globalCompositeOperation = 'destination-out';
          const rg = g.createRadialGradient(sx, sy, 12, sx, sy, 78);
          rg.addColorStop(0, 'rgba(0,0,0,1)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
          g.fillStyle = rg; g.fillRect(0, 0, G.W, G.H);
          ctx.drawImage(shade, 0, 0);
          ctx.save(); ctx.globalAlpha = 0.16;
          for (let i = 0; i < 4; i++) {
            const a = G.tick * 0.025 + i * Math.PI / 2;
            ctx.fillStyle = ['#f83878', '#38c8f8', '#f8e038', '#78f838'][i];
            ctx.beginPath(); ctx.ellipse(sx + Math.cos(a) * 44, sy + Math.sin(a) * 24, 12, 7, 0, 0, Math.PI * 2); ctx.fill();
          }
          ctx.restore();
        },
      });
    },
    // the hops (a move lasts 20 frames), and everybody bobbing on the beat
    tick(w) {
      const p = G.play.player;
      for (const e of [...w.ents.filter((q) => q instanceof G.NPC), p]) {
        if (e.dancing) continue;
        if (e.danceT > 0) { e.danceT--; e.z = Math.round(Math.sin((1 - e.danceT / 20) * Math.PI) * 5); if (!e.danceT) e.z = 0; }
        else if (e.dancer) e.z = G.tick % 39 < 6 ? 1 : 0;
      }
    },
    onEnter() { return S.groceryEnter(); },
  };

  G.MAPS.toms = {
    name: 'Tom\'s Pizza',
    music: 'house',
    tiles() {
      const W = 13, H = 10;
      const g = Array.from({ length: H }, () => Array(W).fill('w'));
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) g[y + j][x + i] = c; };
      fill(1, 1, 11, 2, '6');        // tan tile walls
      fill(1, 3, 11, 6, 'z');        // tile floor
      fill(1, 9, 4, 1, 'G'); fill(8, 9, 4, 1, 'G'); g[9][6] = 'x'; // the front windows and the door
      return g.map((r) => r.join(''));
    },
    setup(w) {
      const F = furnish(w), sp = G.spr;
      // behind the counter: the deck ovens under the hood, and Tom
      F.hang(sp.ovenHood, 2, 2, 2, null, 18);
      F.stand(sp.deckOven, 2, 3, 2, look('The deck ovens. Stainless steel, two high, and hot enough to melt a rock hammer.'));
      F.stand(sp.pizzaBoxes, 1, 3, 1, look('A stack of pizza boxes, folded and ready.'));
      w.add(new G.NPC({ sprite: 'tom', name: 'Tom', x: 5 * 16 + 8, y: 4 * 16 + 14, dir: 'down', talk: S.tom }));
      // the counter, with the register and the glass pizza case (talk across it to order from Tom)
      w.addProp({ img: sp.tomsCounter, tx: 1, ty: 5, solid: [1, 5, 7, 1], hit: [1, 5, 5, 1], talk: S.tom });
      w.props.push({ img: null, x: 0, y: 0, base: 0, hit: [6 * 16, 5 * 16, 8 * 16, 6 * 16], talk: look('The glass case: plain, pepperoni, and one slice nobody can identify.') });
      // the customer side: the picture of Dad and Tom on the wall (looking at it gets the
      // real photo for the collection), tables, more boxes
      w.addProp({ img: sp.dadTomPicture, tx: 8, ty: 2, flat: true, dx: 0, dy: -5, hit: [8, 2, 2, 1], talk: S.tomPhoto });
      F.stand(sp.checkTable, 2, 7, 2, look('A little table with a red-checkered tablecloth. The parmesan shaker is full. A miracle.'));
      F.stand(sp.checkTable, 9, 6, 2, look('Another red-checkered table, by the window.'));
      F.stand(sp.pizzaBoxes, 11, 3, 1, look('More pizza boxes. Tom is ready for a rush.'));
      w.addWarp(6, 9, 1, 1, 'collegeHill', 16, 6, 'down');
    },
  };

  // ---------------------------------------------------------------- the storage garage
  // No room to park: it's all junk, and a TON of yellow guitar cables Abe bought to sell on eBay.
  G.MAPS.condoStorage = {
    name: 'The Storage Room',
    music: 'house',
    tiles() {
      const W = 12, H = 9;
      const g = Array.from({ length: H }, () => Array(W).fill('w'));
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) g[y + j][x + i] = c; };
      fill(1, 1, 10, 2, '$');
      fill(1, 3, 10, 5, 'C');
      fill(11, 4, 1, 3, 'C');        // the garage door, rolled up
      return g.map((r) => r.join(''));
    },
    setup(w) {
      const F = furnish(w), sp = G.spr;
      // FURNITURE (photos pending): anything else that lives in storage (open floor around x 3-9, y 4-5).
      const cables = [
        'Yellow guitar cables. A TON of them. Abe bought them to sell on eBay.',
        'More yellow guitar cables. They might be multiplying.',
        'Yellow guitar cables, all the way down. The eBay empire is still in the warehouse phase.',
      ].map((t) => () => S.storageCable(t));
      F.stand(sp.cableTotes, 1, 3, 1, cables[0]);
      F.stand(sp.storageBoxes, 2, 3, 2, look('Boxes. Taped, half taped, and not taped at all.'));
      F.stand(sp.cableBox, 4, 3, 2, cables[1]);
      F.stand(sp.cableTotes, 6, 3, 1, cables[2]);
      F.stand(sp.junkPile, 7, 3, 2, look('A pile of junk: boxes, a box fan, and an orange extension cord that has given up.'));
      F.stand(sp.cableTotes, 9, 3, 1, cables[0]);
      F.stand(sp.cableHeaps[0], 1, 6, 2, cables[1]);
      F.stand(sp.cableHeaps[1], 4, 7, 2, cables[2]);
      F.stand(sp.cableHeaps[2], 7, 6, 2, cables[0]);
      w.addWarp(11, 4, 1, 3, 'condo', 30, 15, 'right');
      // a few of the cables got loose in here (once they're wound up, they stay that way)
      if (flags().condoArrived) {
        // (over on the far side, away from the garage door, so they don't knock Nate right back out of it)
        for (const [x, y] of [[2, 5], [4, 4], [5, 6]]) {
          const id = 'gone_' + w.id + '_' + x + '_' + y;
          if (!flags()[id]) w.add(new G.YellowCable(x * 16 + 8, y * 16 + 12)).goneFlag = id;
        }
      }
    },
    onEnter() {
      return (function* () {
        if (flags().condoStorage) return;
        flags().condoStorage = true;
        yield G.wait(16);
        yield G.say('Nate', 'Whoa. That is a LOT of yellow guitar cables.');
      })();
    },
  };
  // ================================================================ EL TORO LOCO
  // Down the main road from Abe and Hannah's (from the user's photos). Abe left Romulus's sloth
  // in a booth here, and a woman who looks EXACTLY like Paul McCartney found it. She'll trade it
  // for a bass and a cable: she's on at open mic night in the cantina, and her bass is busted.
  // slothQuest: 1 Abe told Nate, 2 she asked for the bass and cable, 3 traded (Nate has the
  // sloth), 4 Romulus dragged Nate through the woods with it.
  S.paulLady = function* () {
    const f = flags(), s = G.state, w = G.play.world, p = P(), L = 'Paul McCartney Lady';
    if ((f.slothQuest || 0) < 2) {
      yield G.say(null, 'A woman is sitting in a booth with a basket of chips. Next to her, sitting up very straight, is a big fluffy sloth.');
      yield G.say('Nate', 'That\'s Romulus\'s sloth!');
      yield G.say('Nate', '...Also. Whoa.');
      yield G.say('Nate', 'Has anybody ever told you that you look EXACTLY like Paul McCartney?');
      yield G.say(L, 'Every single day of my life, honey.');
      f.ladyMet = true;
      yield G.say(L, 'Found this fella in the booth when I sat down. He\'s been keeping me company.');
      yield G.say('Nate', 'He\'s Romulus\'s. Abe and Hannah\'s dog. Romulus ran off onto the golf course, and this sloth is the only thing that\'ll bring him back.');
      yield G.say(L, 'Oh, I\'d give him right back. Only I\'ve got a problem.');
      yield G.say(L, 'It\'s open mic night in the cantina, and I\'m on tonight. And my bass is busted. The neck snapped clean off.');
      yield G.say(L, 'Find me a bass, and a cable to plug it in with, and the sloth\'s all yours. Deal?');
      if (G.instrumentHas('bass')) {
        yield G.say('Nate', 'I have a bass!');
        yield G.say(null, 'Nate holds up his half-finished bass.');
        yield G.say(L, '...It\'s got no strings, honey.');
        yield G.say('Nate', 'It\'s half finished.');
        yield G.say(L, 'So it\'s half a bass.');
      }
      yield G.say('Nate', 'Abe has a whole closet full of guitars. There\'s got to be a bass in there. And about a thousand yellow cables in his storage room.');
      f.slothQuest = 2;
      return;
    }
    if (f.slothQuest === 2) {
      const bass = !!s.items.abeBass, cable = !!s.items.yellowCable;
      if (!bass || !cable) {
        yield G.say(L, 'A bass and a cable, honey. Then he\'s all yours.');
        yield G.say('Nate', !bass && !cable ? 'Abe\'s closet is upstairs, and the yellow cables are in the storage room by the driveway.' : !bass ? 'I still need a bass. Abe\'s closet is upstairs.' : 'I still need a cable. Abe\'s storage room, by the driveway, is full of them.');
        return;
      }
      yield* S.ladyTrade();
      return;
    }
    if (G.with('abe') && !f.ladyAbe) {
      f.ladyAbe = true;
      yield G.say('Abe', '...That\'s my bass.');
      yield G.say(L, 'And doesn\'t she sound beautiful, honey?');
      yield G.say('Abe', '...She really does.');
      return;
    }
    f.ladyLine = ((f.ladyLine || 0) + 1) % 3;
    yield G.say(L, f.romulusBeaten
      ? ['Did you get your dog back? Good. Tell Abe his bass is in good hands. Left ones.', 'Every single day. "Has anybody ever told you..." Yes, honey. They have.', 'Come back for open mic next week. Bring the dog.'][f.ladyLine]
      : ['Go get your dog, honey.', 'This bass plays beautiful. Upside down.', 'Every single day. "Has anybody ever told you..." Yes, honey. They have.'][f.ladyLine]);
  };
  // the trade: she flips Abe's bass over (she's left-handed), plays her open mic number, and
  // hands over the sloth
  S.ladyTrade = function* () {
    const f = flags(), s = G.state, w = G.play.world, lady = w.lady, L = 'Paul McCartney Lady';
    yield G.say('Nate', 'One bass, from Abe\'s closet. And one yellow guitar cable, from Abe\'s "inventory."');
    yield G.say(L, 'Oh, she\'s a beauty.');
    yield G.say(null, 'She flips the bass upside down.');
    yield G.say('Nate', 'Um. You\'re holding it upside down.');
    yield G.say(L, 'I\'m left-handed, honey. I just play it upside down.');
    yield G.say('Nate', '...Of course you do.');
    f.bassGiven = true;
    // up onto the stage for her number
    w.slothProp.hide = true;
    yield G.walkTo(lady, 16 * 16 + 8, 5 * 16 + 10, 1.2);
    yield G.walkTo(lady, 17 * 16 + 8, 4 * 16 + 2, 1.2);
    lady.dir = 'down';
    w.heldBass.show = true;
    yield G.wait(20);
    G.audio.sfx('bassRiff');
    for (const t of ['*bwum*', '*bwum bwum*', '*bwuuum*']) { w.pop(lady.x, lady.y - 30, t, '#f8c878'); yield G.wait(28); }
    yield G.wait(20);
    G.audio.sfx('clap');
    for (const d of w.diners) w.pop(d.x, d.y - 30, '*clap clap*', '#f8f8f0');
    yield G.wait(40);
    yield G.say(L, 'Thank you! Thank you very much.');
    yield G.say(L, 'And a deal\'s a deal, honey. Catch!');
    G.audio.sfx('squeak');
    s.items.sloth = true; f.slothQuest = 3;
    yield G.itemGet(G.spr.slothIcon, 'You got {y}Romulus\'s Sloth{/}!');
    yield G.say(null, 'Nate gives it a squeeze.');
    G.audio.sfx('squeak');
    yield G.say('Nate', '*squeak*');
    yield G.say(L, 'I\'ll hang on to the bass for tonight, if that\'s alright.');
    yield G.say('Nate', 'Abe\'s going to notice.');
    yield G.say(L, 'You said he has a whole closet full.');
    yield G.say('Nate', '...That\'s fair.');
    yield G.say('Nate', 'Back to the woods behind Abe and Hannah\'s patio. Time to squeak this thing.');
    G.play.autosave();
  };
  S.toroServer = function* () {
    const f = flags();
    f.serverLine = ((f.serverLine || 0) + 1) % 3;
    yield G.say('Server', ['Welcome to El Toro Loco! Sit anywhere you like.', 'Chips and salsa are on the house. The salsa is HOT, though. Fair warning.', 'Open mic starts soon, over in the cantina.'][f.serverLine]);
  };
  const DINER_LINES = [
    ['The queso here. THE QUESO.', 'We come every Tuesday. And most Wednesdays.'],
    ['Is that lady over there... no. Never mind. She just looks like him.', 'I asked her for an autograph once. She signed it "Not Paul."'],
    ['I\'m here for the open mic. My buddy\'s doing a spoken-word piece about his truck.', 'Don\'t tell the server, but I\'m on my third basket of chips.'],
  ];
  S.toroDiner = (i) => function* () {
    const f = flags(), k = 'dinerLine' + i;
    f[k] = ((f[k] || 0) + 1) % 2;
    yield G.say('Diner', DINER_LINES[i][f[k]]);
  };
  S.toroLeave = function* () {
    const p = P();
    const c = yield G.ask('Nate', 'Head back up the main road to Abe and Hannah\'s?', ['Back to the condo', 'Stay']);
    if (c === 0) G.play.warp('condo', 55, 37, 'up');
    else yield G.walkTo(p, p.x, p.y + 16, 1);
  };

  // Outside: the main road along the left, the parking lot, the building, and the big sign out on
  // the grass by the lot entrance.
  G.MAPS.toroLoco = {
    name: 'El Toro Loco',
    music: 'home',
    tiles() {
      const W = 30, H = 17;
      const g = Array.from({ length: H }, () => Array(W).fill('.'));
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) g[y + j][x + i] = c; };
      fill(0, 0, 4, H, 'a');          // the main road, back up to Abe and Hannah's street
      fill(5, 7, 19, 1, 'C');         // the sidewalk along the front
      fill(4, 8, 20, 9, 'a');         // the parking lot
      for (const [x, y] of [[6, 0], [10, 0], [14, 0], [18, 0], [22, 0], [26, 1], [27, 5]]) g[y][x] = 'T';
      return g.map((r) => r.join(''));
    },
    setup(w) {
      const sp = G.spr;
      // the double yellow line down the main road, and the parking stalls
      w.props.push({
        img: null, x: 0, y: 0, flat: true, base: 0,
        draw(ctx, cx, cy) {
          ctx.fillStyle = '#e8c838';
          for (let y = 0; y < w.ph; y += 1) { ctx.fillRect(31 - cx, y - cy, 1, 1); ctx.fillRect(33 - cx, y - cy, 1, 1); }
          ctx.fillStyle = '#e8e8e0';
          for (let x = 5; x <= 23; x += 2) ctx.fillRect(x * 16 - cx, 8 * 16 + 2 - cy, 1, 34);
          ctx.fillRect(5 * 16 - cx, 10 * 16 + 4 - cy, 18 * 16, 1);
          for (let x = 5; x <= 23; x += 2) ctx.fillRect(x * 16 - cx, 14 * 16 + 4 - cy, 1, 44);
          ctx.fillRect(5 * 16 - cx, 14 * 16 + 4 - cy, 18 * 16, 1);
        },
      });
      // the building (the door is under the little green awning)
      w.addProp({ img: sp.toroFront, tx: 6, ty: 2, h: 5 });
      w.blockTiles(6, 2, 16, 5);
      for (const x of [11, 12]) w.block[6 * w.w + x] = 0;
      w.addWarp(11, 6, 2, 1, 'toroLocoIn', 9, 11, 'up');
      w.props.push({ img: null, x: 0, y: 0, base: 0, hit: [6 * 16, 5 * 16, 11 * 16, 7 * 16], talk: look('Dark tinted windows. Inside: red booths, and a LOT of little flags.') });
      w.props.push({ img: null, x: 0, y: 0, base: 0, hit: [13 * 16, 5 * 16, 22 * 16, 7 * 16], talk: look('El Toro Loco. Restaurante Mexicano. It smells like fajitas out here.') });
      // the big sign, out on the grass by the road
      w.addProp({ img: sp.toroSign, tx: 25, ty: 9, h: 6, dx: -23, solid: [25, 14, 2, 1], hit: [25, 14, 2, 1], talk: look('The big sign: EL TORO LOCO. Restaurante Mexicano, and CANTINA. The bull looks like he means it.') });
      // cars, nosed in toward the building
      const car = (img, tx, text) => w.addProp({ img, tx, ty: 8, h: 3, dx: 3, dy: -2, solid: [tx, 8, 2, 2], hit: [tx, 8, 2, 2], talk: look(text) });
      car(sp.toroCars.gray, 7, 'A dark gray SUV.');
      car(sp.toroCars.white, 9, 'A little white car. Somebody\'s in there right now, eating chips.');
      car(sp.toroCars.red, 19, 'A red SUV. There\'s a bumper sticker: "I BRAKE FOR QUESO."');
      w.addProp({ img: sp.toroCars.blue, tx: 13, ty: 14, h: 3, dx: 3, dy: -2, solid: [13, 15, 2, 2], hit: [13, 15, 2, 2], talk: look('A blue SUV, backed in. Somebody wanted a quick getaway. With leftovers.') });
      // up the road: back to the condo; down the road: more of Chesapeake
      w.addTrigger(0, 0, 4, 1, () => G.script.run(S.toroLeave()));
      w.addTrigger(0, 16, 4, 1, () => G.script.run(S.condoNeighborhood()));
    },
  };

  // Inside: red booths along both walls, tables with black chairs in the middle, the cantina bar,
  // and the little stage for open mic night.
  const TF = 'ó', TW = 'ñ';
  G.MAPS.toroLocoIn = {
    name: 'El Toro Loco',
    music: 'house',
    tiles() {
      const W = 20, H = 13;
      const g = Array.from({ length: H }, () => Array(W).fill('w'));
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) g[y + j][x + i] = c; };
      fill(1, 1, 18, 2, TW);           // orange walls under dark beams
      fill(1, 3, 18, 9, TF);           // saltillo tile
      fill(1, 12, 8, 1, 'G'); fill(10, 12, 9, 1, 'G'); g[12][9] = 'x'; // the front windows and the door
      return g.map((r) => r.join(''));
    },
    setup(w) {
      const F = furnish(w), sp = G.spr, f = flags();
      // the top wall: little flags all along it, the desert mural, a soccer ball, the metal sun,
      // the bar's bottle shelf, beer signs and the kitchen door
      F.hang(sp.toroMural, 2, 2, 4, look('A mural: a desert, purple mountains, a big blue sky, and a whole lot of agave.'), 5);
      F.hang(sp.soccerBall, 1, 2, 1, look('A soccer ball, hanging on the wall. Nobody is allowed to kick it.'), 14);
      F.hang(sp.beerGreen, 6, 2, 1, null, 12);
      F.hang(sp.sunFace, 7, 2, 1, look('A metal sun with a face. He looks happy to be here.'), 10);
      F.hang(sp.toroBottles, 9, 2, 4, look('Bottles and bottles of tequila. The cantina is open.'), 4);
      F.hang(sp.kitchenDoor, 13, 2, 1, look('The kitchen. It smells AMAZING in there.'), 0);
      F.hang(sp.beerSurf, 14, 2, 1, null, 12);
      w.props.push({ img: sp.buntingWall, x: 16, y: 16 + 3, base: 0, flat: true });
      // the cantina bar, and three red stools
      F.stand(sp.toroBar, 9, 3, 4, look('The cantina bar. Dark wood, and a lot of limes.'));
      for (const x of [9, 10, 12]) w.addProp({ img: sp.barStool, tx: x, ty: 4, dx: 3, solid: [x, 4, 1, 1] });
      // the open mic stage, in the corner
      const stageLook = look('The little stage in the cantina: a mic, an amp and a stool. Open mic night!');
      w.addProp({ img: sp.toroStage, tx: 16, ty: 3, h: 2, flat: true, solid: [16, 3, 3, 2], hit: [16, 3, 3, 2], talk: () => ((flags().slothQuest || 0) >= 3 ? S.paulLady() : stageLook()) });
      F.stand(sp.openMicSign, 15, 4, 1, look('A chalkboard: OPEN MIC! Underneath, smaller: "Sign up at the bar. No more spoken word about trucks."'));
      // a peach pillar hung with garlic
      F.stand(sp.garlicPillar, 8, 7, 1, look('A pillar hung with a strand of garlic. For flavor, or for vampires. Possibly both.'));
      // booths along both walls (the back bench, then the table and the front bench)
      const booth = (bx, by, chips, talk) => {
        w.addProp({ img: sp.boothBack, tx: bx, ty: by, base: by * 16 + 2, solid: [bx, by, 2, 1] });
        return w.addProp({ img: chips ? sp.boothFront : sp.boothFrontBare, tx: bx, ty: by + 1, solid: [bx, by + 1, 2, 1], hit: [bx, by + 1, 2, 1], talk: talk || look('A red booth. Chips, salsa, and a caddy of hot sauce.') });
      };
      w.diners = [];
      const diner = (sprite, x, y, i) => { const d = w.add(new G.NPC({ sprite, name: 'Diner', x: x * 16 + 8, y: y * 16 + 14, dir: 'down', talk: S.toroDiner(i) })); w.diners.push(d); return d; };
      booth(1, 3, true, S.toroDiner(0)); diner('toroDiner1', 1, 3, 0);
      booth(1, 6, false);
      booth(1, 9, true, S.toroDiner(2)); diner('toroDiner2', 1, 9, 2);
      booth(17, 9, true, S.toroDiner(1)); diner('toroDiner3', 18, 9, 1);
      // the Paul McCartney Lady's booth (by the stage), with the sloth sitting next to her, until
      // the trade; then she's up on the stage with Abe's bass
      const traded = (f.slothQuest || 0) >= 3;
      const ladyBooth = look('Her booth. She left a few chips. Nate respects that.');
      booth(17, 6, true, () => ((flags().slothQuest || 0) >= 3 ? ladyBooth() : S.paulLady()));
      w.lady = w.add(new G.NPC({ sprite: 'paulLady', name: 'Paul McCartney Lady', x: 17 * 16 + 8, y: traded ? 4 * 16 + 2 : 6 * 16 + 14, dir: 'down', talk: S.paulLady }));
      w.slothProp = { img: sp.slothPlush, x: 18 * 16, y: 6 * 16 - 2, base: 6 * 16 + 14, hide: traded, draw(ctx, cx, cy) { if (!this.hide) ctx.drawImage(this.img, this.x - cx, this.y - cy); } };
      w.props.push(w.slothProp);
      w.heldBass = { img: sp.bassHeld, x: 0, y: 0, base: 0, show: traded, draw(ctx, cx, cy) { if (this.show) ctx.drawImage(this.img, Math.round(w.lady.x - 10) - cx, Math.round(w.lady.y - 12) - cy); } };
      w.props.push(w.heldBass);
      // tables with black chairs in the middle
      for (const [x, y] of [[4, 6], [4, 9], [12, 6], [12, 9]]) F.stand(sp.toroTable, x, y, 2, look('A dark wood table with black chairs. The hot sauce is the good kind.'));
      // the server
      w.add(new G.NPC({ sprite: 'toroServer', name: 'Server', x: 11 * 16 + 8, y: 5 * 16 + 14, dir: 'down', talk: S.toroServer }));
      // overhead: frosted glass lamps on brass chains, and more strings of flags across the room
      for (const [x, y] of [[5, 5], [13, 5], [5, 8], [13, 8]]) w.props.push({ img: sp.toroLamp, x: x * 16 - 7, y: y * 16 - 22, base: 9999 });
      for (const y of [5, 8]) w.props.push({ img: sp.buntingRoom, x: 16, y: y * 16 + 2, base: 9999 });
      w.addWarp(9, 12, 1, 1, 'toroLoco', 11, 7, 'down');
    },
    tick(w) { if (w.heldBass) w.heldBass.base = w.lady.y + 1; },
  };
  // ================================================================ CHKD (Children's Hospital of The King's Daughters)
  // The next level (the user's story): Abe says that to take on Father Eggmas they'll need a
  // healer, and that's Hannah, a nurse in the NICU at CHKD. But Father Eggmas got there first:
  // the whole hospital is hypnotized (spiral eyes), the babies crawl around after Nate, and a
  // hypnotized baby piloting a mech suit has a spiral antenna that's doing it (MECHA-BABY, the
  // boss). Father Eggmas himself isn't fought here (the user doesn't want him at the hospital). Hannah's
  // work badge works the NICU elevator, and a teething baby has it in the playroom. Bring the
  // mech down, everyone wakes up, and Hannah joins the party as the healer. (flags.mobileBeaten
  // is named for the first version of the boss, a giant crib mobile.)
  // Flags: healerTalk, chkdArrived, chkdLobby, chkdWard, mobileBeaten (and items.badge).

  // everyone at CHKD, hypnotized (spiral eyes) until MECHA-BABY goes down
  G.CAST.chkdDad = { skin: '#e8b890', hair: '#3a2a20', hairStyle: 'cap', hat: '#c83030', hatStyle: 'ball', shirt: '#6a7a9a', sleeves: 'long', pants: '#3a4a6a', shoes: '#4a3428', torso: 7, legs: 3 };
  G.CAST.chkdReception = { skin: '#c88a60', hair: '#2a1a14', hairStyle: 'long', shirt: '#d8a8e8', pants: '#3a3a44', shoes: '#2a2a2a', torso: 5, legs: 3, smile: '#ffffff' };
  G.CAST.chkdGuard = { skin: '#8a5a3a', hair: '#1a1010', hairStyle: 'cap', hat: '#1c2c4c', hatStyle: 'ball', shirt: '#2a3a5a', pants: '#1c2434', shoes: '#1a1a1a', wide: true, torso: 7, legs: 3 };
  G.CAST.chkdNurse = { skin: '#f0c8a8', hair: '#6a4028', hairStyle: 'shoulder', shirt: '#7ac8b8', pants: '#7ac8b8', shoes: '#f0f0f0', torso: 5, legs: 3, smile: '#ffffff' };
  // Ruby, the rock kid on the ward: seven, pink glasses, a hospital gown with little stars, a cast
  G.CAST.rockKid = { skin: '#c88a60', eyes: '#1a1010', hair: '#2a1a14', hairStyle: 'shoulder', glasses: '#e04888', blush: true, smile: '#ffffff', shirt: '#9ad0f0', pants: '#9ad0f0', shoes: '#f0f0f0', torso: 4, legs: 2 };
  for (const id of ['chkdDad', 'chkdReception', 'chkdGuard', 'chkdNurse', 'hannah']) G.CAST[id + 'Hypno'] = Object.assign({}, G.CAST[id], { swirl: true, smile: null, blush: false });

  CRITTER_LINES.baby = [
    ['Nate', 'Is that a BABY? With SPIRAL EYES?'],
    ['Nate', 'Father Eggmas hypnotized the BABIES?!'],
    ['Nate', 'Okay. Okay. A little bonk on the noggin should snap them out of it. GENTLY.'],
  ];
  CRITTER_LINES.bassinet = [
    ['Nate', 'A baby in a bassinet, doing laps down the hall. Who put WHEELS on that?'],
    ['Nate', '...They always have wheels. They just never go THAT fast.'],
  ];

  // Back at the condo after the Romulus fight: Abe has a plan
  S.abeHealer = function* () {
    const f = flags();
    f.healerTalk = true;
    yield G.wait(30);
    yield* S.callIn('abe');
    yield G.say('Abe', 'Nate. If we\'re really going after Father Eggmas, we\'re going to get beat up. A LOT.');
    yield G.say('Abe', 'We need a healer. Somebody who can patch us up.');
    yield G.say('Nate', 'Like a nurse?');
    yield G.say('Abe', 'Like HANNAH. She\'s a nurse in the NICU at CHKD. She\'d never let us go without her.');
    yield G.say('Abe', '...She hasn\'t answered a single text all day, though. That\'s not like her.');
    yield G.say('Nate', 'You don\'t think...');
    yield G.say('Abe', 'Father Eggmas got to Dad. He got to Tyler. My Jeep\'s in the driveway. Let\'s go.');
  };
  // Abe's Jeep, in their driveway (and parked out front of CHKD)
  S.condoJeep = function* () {
    const f = flags();
    if (!f.healerTalk) { yield G.say(null, 'A silver Jeep, parked in the driveway.'); return; }
    if (!G.state.party.includes('abe')) { yield G.say(null, 'Abe\'s Jeep. Abe has the keys.'); return; }
    yield* S.callIn('abe');
    const c = yield G.ask('Abe', f.chkdArrived ? 'Back to CHKD?' : 'Hop in. CHKD?', ['Drive to CHKD', 'Not yet']);
    if (c !== 0) return;
    G.audio.sfx('door');
    yield G.say(null, f.chkdArrived ? 'Abe drives back to CHKD.' : 'Abe drives. Fast. He doesn\'t say a word the whole way there.');
    G.play.warp('chkd', 16, 21, 'up');
  };
  S.chkdJeep = function* () {
    const c = yield G.ask('Abe', 'Head back to the condo?', ['Back to the condo', 'Stay']);
    if (c !== 0) return;
    G.audio.sfx('door');
    G.play.warp('condo', 35, 16, 'left');
  };

  // ---------------------------------------------------------------- outside
  S.chkdArrive = function* () {
    const f = flags();
    yield* S.kitCatchUp();
    if (f.chkdArrived) return;
    f.chkdArrived = true;
    yield G.wait(30);
    yield* S.callIn('abe');
    yield G.say('Abe', 'CHKD. Hannah\'s up in the NICU.');
    yield G.say('Nate', 'It\'s so quiet.');
    yield G.say('Abe', 'It\'s a children\'s hospital. It is NEVER quiet.');
    yield G.say('Nate', '...Is that guy okay?');
  };
  S.chkdDad = function* () {
    const f = flags();
    if (f.mobileBeaten) {
      f.dadLine = ((f.dadLine || 0) + 1) % 2;
      yield G.say('Visitor', ['I came out to get the car seat. That was this MORNING. Where did the day go?', 'My wife had a baby! A little girl! ...I should probably go back inside.'][f.dadLine]);
      return;
    }
    yield G.say('Visitor', 'Must... find... the parking garage...');
    yield G.say('Nate', 'His eyes are SPIRALS.');
    if (G.with('abe')) yield G.say('Abe', 'Father Eggmas. He was here.');
  };

  // ---------------------------------------------------------------- the lobby
  S.chkdLobbyEnter = function* () {
    const f = flags();
    yield* S.kitCatchUp();
    if (f.chkdLobby || f.mobileBeaten) return;
    f.chkdLobby = true;
    yield G.wait(24);
    yield G.say(null, 'Everybody in the lobby is standing perfectly still. Somewhere, a music box is playing.');
    yield* S.callIn('abe');
    yield G.say('Abe', 'The NICU is upstairs, and it\'s a locked unit. You need a staff badge to work the elevator.');
    yield G.say('Nate', 'Where do we get one of those?');
    yield G.say('Abe', 'Hannah has one. ...Hannah is upstairs.');
  };
  S.chkdReception = function* () {
    const f = flags();
    if (f.mobileBeaten) {
      f.recLine = ((f.recLine || 0) + 1) % 2;
      yield G.say('Receptionist', ['Welcome to CHKD! Oh my gosh, why is it dark out? Where did the DAY go?', 'Hannah? From the NICU? She\'s the best. The babies love her.'][f.recLine]);
      return;
    }
    yield G.say('Receptionist', 'Welcome... to... CHKD...');
    yield G.say('Receptionist', 'Visiting hours... are... forever...');
  };
  S.chkdGuard = function* () {
    if (flags().mobileBeaten) { yield G.say('Security Guard', 'I was standing here ALL day? My feet hurt so bad.'); return; }
    yield G.say('Security Guard', 'Upstairs... staff... only. Badge... please...');
  };
  S.chkdElevator = function* () {
    const f = flags(), s = G.state;
    if (!s.items.badge) {
      yield G.say(null, 'The elevator. There\'s a badge reader next to the buttons: STAFF ONLY ABOVE THE LOBBY.');
      if (!f.mobileBeaten) yield G.say('Security Guard', 'Badge... please...');
      return;
    }
    if (!f.badgeUsed) { f.badgeUsed = true; yield G.say(null, 'Nate taps Hannah\'s badge on the reader. *beep* The light turns green.'); }
    const c = yield (f.mobileBeaten
      ? G.ask('Nate', 'The elevator. Where to?', ['Up to the NICU', 'Up to the roof', 'Stay'])
      : G.ask('Nate', 'Take the elevator up to the NICU?', ['Up to the NICU', 'Stay']));
    if (c === 0) { G.audio.sfx('bell'); G.play.warp('chkdNicu', 7, 9, 'up'); }
    else if (f.mobileBeaten && c === 1) { G.audio.sfx('bell'); G.play.warp('chkdRoof', 2, 11, 'down'); }
  };

  // ---------------------------------------------------------------- the ward
  S.chkdWardEnter = function* () {
    const f = flags();
    yield* S.kitCatchUp();
    if (f.chkdWard || f.mobileBeaten) return;
    f.chkdWard = true;
    yield G.wait(20);
    yield G.say(null, 'From down the hall, in the playroom: a happy little *chomp chomp chomp*.');
  };
  S.chkdNurse = function* () {
    const f = flags();
    if (f.mobileBeaten) {
      f.nurseLine = ((f.nurseLine || 0) + 1) % 2;
      yield G.say('Nurse', [
        'Did I chart ANYTHING today? ...I charted the word "lullaby" four hundred times.',
        f.rubyHeart ? 'Ruby showed me her rock collection. Twice. She says her rock doctor fixed it.' : 'The little girl behind the green door keeps asking for a "rock doctor." I told her we only have the regular kind.',
      ][f.nurseLine]);
      return;
    }
    yield G.say('Nurse', 'Hannah... dropped... her badge...');
    yield G.say('Nurse', 'A baby... took it... to the... playroom...');
  };
  // the badge baby gets bonked: Hannah's badge!
  S.badgeFound = function* (baby) {
    const s = G.state;
    s.items.badge = true;
    yield G.wait(20);
    G.audio.sfx('chest');
    yield G.itemGet(G.spr.badgeIcon, 'You got {y}Hannah\'s Badge{/}!');
    yield G.say('Nate', 'It\'s a little slobbery.');
    if (G.with('abe')) {
      yield G.say('Abe', 'That\'s HANNAH\'S badge. She\'d never just leave it lying around.');
      yield G.say('Abe', 'The elevator in the lobby. Let\'s go.');
    } else yield G.say('Nate', 'Hannah\'s badge! Back to the elevator in the lobby.');
  };

  // ---------------------------------------------------------------- the NICU: MECHA-BABY
  S.nicuEnter = function* () {
    const f = flags(), w = G.play.world, p = P(), m = w.mech, h = w.hannahNpc;
    yield* S.kitCatchUp();
    if (f.mobileBeaten || !m) return;
    yield G.wait(30);
    yield G.camFocus(h.x, h.y - 10, 40);
    yield G.say(null, 'It\'s dim and quiet. Rows of isolettes, monitors blinking. And in the middle of it all, rocking an isolette and humming...');
    yield* S.callIn('abe');
    yield G.say('Abe', 'HANNAH!');
    h.dir = 'down';
    yield G.wait(20);
    yield G.say('Hannah', 'Shhhhh. The babies are sleeping.');
    yield G.say('Hannah', 'Visiting hours... are... over...');
    yield G.say('Nate', 'Her eyes are spirals.');
    // CLANK. CLANK. CLANK. Something comes stomping through the NICU doors.
    for (let i = 0; i < 3; i++) { G.audio.sfx('clank'); G.play.shake(8, 2); yield G.wait(24); }
    yield G.say(null, 'Something big is coming through the NICU doors.');
    G.audio.sfx('door');
    m.hidden = false; m.face = -1;
    yield G.camFocus(m.x, m.y - 40, 30);
    yield G.walkTo(m, 8 * 16, 7 * 16 + 8, 0.8);
    m.walking = false;
    yield G.say('Nate', 'Is that... a BABY? Driving a ROBOT?');
    yield G.say('Abe', 'A robot with a BABY BOTTLE for an arm.');
    yield G.say('Nate', 'And a spiral on its head. That antenna! That\'s where the lullaby is coming from!');
    yield G.say('Abe', 'Father Eggmas must have built it. That thing is what has everybody hypnotized.');
    yield G.say('Nate', 'Okay. We break the robot. NOT the baby.');
    yield G.camFocus(null, null, 30);
    yield G.say(null, 'Its armor is too tough to dent... until the rattle gets stuck in the floor, or its vents pop open. And don\'t let the spirals hypnotize you!');
    m.start();
    yield G.banner('MECHA-BABY', 'naptime is OVER', 150);
    G.audio.play('mecha');
  };
  S.mechDefeated = function* (m) {
    const f = flags(), w = G.play.world, p = P(), h = w.hannahNpc, s = G.state;
    G.audio.stop();
    for (const e of w.ents) if (e instanceof G.HypnoShot || e instanceof G.HypnoRing || e instanceof G.PacifierShot || e instanceof G.BarkRing) e.dead = true;
    for (const e of w.ents) if (e instanceof G.HypnoBaby && !e.dead) { e.dead = true; w.burst(e.x, e.y - 8, ['#f8f8f0', '#a85ae8'], 6); }
    G.play.earworm = 0;
    yield G.wait(20);
    // the mech sputters and sits down, the dome pops open, and the baby giggles and dozes off
    for (let i = 0; i < 4; i++) {
      G.audio.sfx('clank'); G.play.shake(10, 2);
      w.burst(m.x + (Math.random() * 40 - 20), m.y - 20 - Math.random() * 30, ['#f8e070', '#ffffff', '#8ab8e8', '#3a3a4a'], 10, { speed: 1.8, up: 1, g: 0.1, life: 26, size: 2 });
      yield G.wait(14);
    }
    G.audio.sfx('boom'); G.play.shake(16, 3);
    yield G.say(null, 'The mech sputters, sparks... and sits down. HARD.');
    G.audio.sfx('door');
    m.dome = 'cry';
    yield G.wait(20);
    yield G.say(null, 'The dome pops open.');
    G.audio.sfx('giggle');
    w.pop(m.x, m.y - 76, '*giggle*', '#f8c8e8');
    yield G.wait(40);
    m.dome = 'asleep';
    w.pop(m.x, m.y - 76, '*yawn*', '#f8c8e8');
    yield G.wait(30);
    yield G.say(null, 'The spiral antenna stops spinning. The lullaby stops.');
    f.mobileBeaten = true;
    yield G.wait(20);
    // the spell breaks: the babies yawn, and Hannah blinks
    G.audio.sfx('heart');
    for (const iso of w.isolettes || []) w.pop(iso.x, iso.y, ['*yawn*', '*coo*', '*hic*'][Math.floor(Math.random() * 3)], '#f8c8e8');
    yield G.wait(40);
    h.sprite = 'hannah';
    w.burst(h.x, h.y - 20, ['#f8f8f8', '#f8e070'], 10, { speed: 1, life: 20, size: 2 });
    yield G.wait(20);
    yield G.say('Hannah', '...Abe?');
    if (G.with('abe')) {
      const abe = w.ents.find((e) => e instanceof G.Follower && e.id === 'abe');
      if (abe) { abe.hold = true; yield G.walkTo(abe, h.x + 18, h.y + 6, 1.4); abe.dir = 'left'; }
    }
    yield G.say('Abe', 'Hannah! Are you okay?');
    yield G.say('Hannah', 'Why are you in my NICU? Why is NATE in my NICU?');
    yield G.say('Hannah', '...Why is there a ROBOT in my NICU? Is that baby DRIVING it?');
    yield G.say('Nate', 'He was. He\'s off duty now.');
    yield G.say(null, 'Hannah lifts the baby out of the dome, swaddles him up tight, and tucks him into an isolette. He\'s out cold.');
    m.dome = 'empty';
    yield G.say('Nate', 'Father Eggmas hypnotized the whole hospital. You\'ve been rocking that isolette all day.');
    yield G.say('Hannah', '...That isolette is EMPTY.');
    yield G.say('Hannah', 'Wait. Father Eggmas? The egg man from the family group chat? That\'s REAL?');
    yield G.say('Nate', 'Very real. He\'s at the Number One Ditch. And we\'re going after him.');
    yield G.say('Abe', 'And we need a healer.');
    yield G.say('Hannah', 'He hypnotized my BABIES.');
    yield G.say('Hannah', '...Let me get my bag.');
    // she packs a first-aid kit from the supply cabinet for Nate (CHKD's item)
    yield G.walkTo(h, 6 * 16 + 8, 3 * 16 + 14, 1.4);
    h.dir = 'up';
    G.audio.sfx('door');
    yield G.say(null, 'Hannah raids the supply cabinet: gauze, tape, ice packs, and a whole box of dinosaur bandages.');
    yield G.walkTo(h, p.x + (p.x < 8 * 16 ? 18 : -18), p.y - 2, 1.4);
    h.dir = p.x < h.x ? 'left' : 'right';
    yield G.say('Hannah', 'Here. You\'re going to need this more than me.');
    yield* S.kitGive();
    const fol = w.ents.find((e) => e instanceof G.Follower && e.id === 'abe');
    if (fol) fol.hold = false;
    if (!s.party.includes('hannah')) s.party.push('hannah');
    G.audio.sfx('fanfare');
    yield G.banner('HANNAH JOINED THE PARTY!', 'She\'s a nurse. She\'ll keep you alive.', 220);
    h.dead = true;
    w.hannahNpc = null;
    G.play.setFollower('hannah', true);
    yield G.say(null, 'With Hannah along, she patches Nate up when he\'s low on hearts. Talk to her for a checkup any time.');
    yield G.say('Hannah', 'My charge nurse is going to KILL me. ...She\'s hypnotized too, isn\'t she. She\'ll never know.');
    yield G.say('Hannah', 'Okay. Before we go ANYWHERE: everybody up to the roof.');
    if (s.party.includes('abe')) yield G.say('Abe', 'The roof?');
    yield G.say('Hannah', 'Trust me. There\'s something you all need to see. The elevator\'s right out the door.');
    G.audio.play('house');
    G.play.autosave();
  };

  // ---------------------------------------------------------------- Hannah, the healer
  // When she's the one following Nate and he's down to two hearts or less, she patches him up
  // (two hearts back, then she needs about 20 seconds before she can do it again).
  G.hannahTick = () => {
    const s = G.state, pl = G.play;
    if (pl.healCd > 0) { pl.healCd--; return; }
    if (!G.with('hannah') || s.hp > 4 || s.hp <= 0 || s.hp >= s.maxHp || pl.dying) return;
    pl.healCd = 1200;
    s.hp = Math.min(s.maxHp, s.hp + 4);
    G.audio.sfx('heart');
    const p = pl.player, w = pl.world;
    w.pop(p.x, p.y - 34, 'Hannah: Hold still!', '#c898ff');
    w.burst(p.x, p.y - 14, ['#f86868', '#ffffff', '#f8a8c8'], 10, { speed: 1, up: 0.8, life: 22, size: 2 });
  };
  // talking to her: a checkup (all hearts back, when nothing's attacking)
  S.hannahCheckup = function* () {
    const f = flags(), s = G.state, w = G.play.world, p = P();
    if (f.mobileBeaten && !f.kitGot) {
      yield G.say('Hannah', 'Oh! Nate, wait. I packed you something.');
      yield* S.kitGive();
      return;
    }
    const fighting = w.ents.some((e) => e.enemy && !e.dead && !e.hidden && e.state !== 'defeated' && Math.hypot(e.x - p.x, e.y - p.y) < 140);
    if (s.hp < s.maxHp && !fighting) {
      s.hp = s.maxHp;
      G.audio.sfx('heart');
      w.burst(p.x, p.y - 14, ['#f86868', '#ffffff', '#f8a8c8'], 12, { speed: 1, up: 0.8, life: 22, size: 2 });
      yield G.say('Hannah', ['Let me see. ...Okay, you\'ll live. Drink some water.', 'Hold still. Hold STILL. There. Good as new.', 'You\'re the worst patient I\'ve ever had. And I work with babies.'][(f.checkup = ((f.checkup || 0) + 1) % 3)]);
      return;
    }
    f.talk_hannah = ((f.talk_hannah || 0) + 1) % 4;
    yield G.say('Hannah', [
      'Romulus is home alone. He\'s fine. He\'s FINE.',
      'Abe, did you bring snacks? You always bring snacks.',
      'If you get hurt, tell me. Don\'t be a hero. Be a patient.',
      'I can\'t believe he hypnotized the BABIES. Father Eggmas is going DOWN.',
    ][f.talk_hannah]);
  };

  // ---------------------------------------------------------------- the maps
  // Outside (from the user's photo): the building across the top, the plaza with the painted
  // blue and yellow swirls, red ball bollards, yellow benches and the bronze kids, the flag,
  // the striped canopy over the drop-off, and the street (Abe parks the Jeep at the curb).
  G.MAPS.chkd = {
    name: 'CHKD',
    get music() { return flags().mobileBeaten ? 'home' : 'hospital'; },
    tiles() {
      const W = 40, H = 26;
      const g = Array.from({ length: H }, () => Array(W).fill('C'));
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) g[y + j][x + i] = c; };
      fill(0, 20, W, 6, 'a');          // the streets
      fill(32, 14, 8, 6, 'a');         // the lot by the drop-off
      fill(1, 12, 11, 3, '<');         // the bed along the left wing
      fill(23, 13, 8, 4, '<');         // the garden with the statues
      fill(0, 11, 2, 9, '.'); fill(38, 11, 2, 3, '.');
      return g.map((r) => r.join(''));
    },
    setup(w) {
      const sp = G.spr, f = flags();
      // the painted ground: the blue swoosh up to the doors, the yellow ring around the garden, the
      // red brick crosswalk and the white one
      w.props.push({
        img: null, x: 0, y: 0, flat: true, base: 0,
        draw(ctx, cx, cy) {
          ctx.save(); ctx.translate(-cx, -cy);
          ctx.lineCap = 'round';
          ctx.strokeStyle = '#3a8ad8'; ctx.lineWidth = 26;
          ctx.beginPath(); ctx.moveTo(3 * 16, 18 * 16); ctx.quadraticCurveTo(12 * 16, 18 * 16, 19 * 16 + 8, 12 * 16); ctx.quadraticCurveTo(25 * 16, 19 * 16, 31 * 16, 18.4 * 16); ctx.stroke();
          ctx.strokeStyle = '#f0c830'; ctx.lineWidth = 10;
          ctx.beginPath(); ctx.ellipse(27 * 16, 15 * 16, 5.4 * 16, 2.8 * 16, 0, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = '#a84a3a'; ctx.fillRect(0, 20 * 16 + 4, 13 * 16, 20);
          ctx.fillStyle = '#c86a58'; for (let x = 0; x < 13 * 16; x += 8) ctx.fillRect(x, 20 * 16 + 4, 1, 20);
          ctx.fillStyle = '#f4f4f0'; for (let x = 26 * 16; x < 39 * 16; x += 12) ctx.fillRect(x, 22 * 16, 7, 26);
          ctx.fillStyle = '#c8c8c0'; ctx.fillRect(0, 20 * 16 - 2, w.pw, 3);
          ctx.restore();
        },
      });
      // the building
      w.addProp({ img: sp.chkdFront, tx: 2, ty: 0, h: 11 });
      w.blockTiles(2, 0, 36, 11);
      for (const x of [18, 19, 20]) w.block[10 * w.w + x] = 0;
      w.addWarp(18, 10, 3, 1, 'chkdLobby', 11, 12, 'up');
      w.props.push({ img: null, x: 0, y: 0, base: 0, hit: [2 * 16, 9 * 16, 17 * 16, 11 * 16], talk: look('Children\'s Hospital of The King\'s Daughters. The windows are dark, and nothing is moving inside.') });
      w.props.push({ img: null, x: 0, y: 0, base: 0, hit: [21 * 16, 9 * 16, 30 * 16, 11 * 16], talk: look('Giant alphabet blocks over the entrance: a red cross, then C, H, K, D.') });
      // the striped canopy over the drop-off (on posts)
      w.addProp({ img: sp.chkdCanopy, tx: 30, ty: 11, h: 3, base: 14 * 16 + 8 });
      for (const x of [30, 34, 38]) w.blockTiles(x, 13, 1, 1);
      // the plaza: the flag, a lamp, the bronze kids, yellow benches, red ball bollards, shrubs
      w.addProp({ img: sp.chkdFlag, tx: 24, ty: 12, dx: -2, solid: [24, 12, 1, 1], hit: [24, 12, 1, 1], talk: look('The flag, flying out front.') });
      for (const x of [15, 22]) w.addProp({ img: sp.chkdLamp, tx: x, ty: 13, dx: 0, solid: [x, 13, 1, 1] });
      w.addProp({ img: sp.kidStatues, tx: 25, ty: 14, h: 2, dx: 4, solid: [25, 15, 3, 1], hit: [25, 14, 3, 2], talk: look('Bronze statues of kids playing, with a little dog. Somebody put a knit cap on the dog.') });
      for (const [x, y] of [[4, 15], [21, 13]]) w.addProp({ img: sp.yellowBench, tx: x, ty: y, solid: [x, y, 2, 1], hit: [x, y, 2, 1], talk: look('A big yellow bench, like a pill. Or a jellybean.') });
      for (const [x, y] of [[8, 18], [12, 18], [16, 18], [23, 18], [28, 18], [31, 17]]) w.addProp({ img: sp.redBall, tx: x, ty: y, dx: 1, solid: [x, y, 1, 1], hit: [x, y, 1, 1], talk: look('A giant red ball. It is not a toy. It is very much a bollard.') });
      const shrub = (x, y) => w.addProp({ img: sp.boxwood, tx: x, ty: y, dx: Math.round((16 - sp.boxwood.width) / 2), solid: [x, y, 1, 1] });
      for (const [x, y] of [[2, 12], [5, 12], [8, 12], [11, 12], [3, 14], [9, 14], [23, 13], [30, 15], [24, 16]]) shrub(x, y);
      w.addTree(0, 11); w.addTree(38, 11, 'pine');
      // cars: Abe's Jeep at the curb, and two in the lot by the drop-off
      w.addProp({ img: sp.condoCars.jeep, tx: 12, ty: 21, h: 2, dy: -3, solid: [12, 21, 3, 2], hit: [12, 21, 3, 2], talk: () => S.chkdJeep() });
      for (const [img, x, y] of [[sp.chkdCars.red, 33, 15], [sp.chkdCars.white, 36, 18]]) w.addProp({ img, tx: x, ty: y, h: 2, dy: -3, solid: [x, y, 3, 2], hit: [x, y, 3, 2], talk: look('A car in the lot. Parked. Very, very crooked.') });
      // a hypnotized dad with a car seat, wandering the plaza
      w.add(new G.NPC({ sprite: f.mobileBeaten ? 'chkdDad' : 'chkdDadHypno', name: 'Visitor', x: 17 * 16 + 8, y: 16 * 16 + 12, dir: 'down', wander: f.mobileBeaten ? 0 : 40, held: sp.carSeat, heldAt: [8, 8], talk: S.chkdDad }));
      // the street goes on (left and right)
      for (const x of [0, w.w - 1]) w.addTrigger(x, 20, 1, 6, () => G.script.run((function* () { const p = P(); yield G.say('Nate', 'Not without the Jeep. Abe parked it at the curb.'); yield G.walkTo(p, p.x + (p.x < 100 ? 18 : -18), p.y, 1); })()));
    },
    onEnter() { return S.chkdArrive(); },
  };

  // The lobby: elevators (a badge reader for the floors above), the information desk, a big
  // fish tank, a giant teddy, rows of little chairs, the alphabet blocks again, the gift shop.
  const CF = 'é', CW = 'á', PM = 'í', NW = 'ú', NF = 'ü';
  G.MAPS.chkdLobby = {
    name: 'CHKD: the Lobby',
    get music() { return flags().mobileBeaten ? 'house' : 'hospital'; },
    tiles() {
      const W = 24, H = 14;
      const g = Array.from({ length: H }, () => Array(W).fill('w'));
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) g[y + j][x + i] = c; };
      fill(1, 1, 22, 2, CW);
      fill(1, 3, 22, 10, CF);
      fill(23, 6, 1, 2, CF);                                    // the hallway east, to the ward
      fill(1, 13, 10, 1, 'G'); fill(12, 13, 11, 1, 'G'); g[13][11] = 'x';
      return g.map((r) => r.join(''));
    },
    setup(w) {
      const F = furnish(w), sp = G.spr, f = flags(), awake = !!f.mobileBeaten;
      // the elevators, with the badge reader between them, and the guard in front
      F.hang(sp.elevatorDoors, 2, 2, 2, () => S.chkdElevator(), 0);
      F.hang(sp.elevatorDoors, 5, 2, 2, () => S.chkdElevator(), 0);
      F.hang(sp.elevatorButtons, 4, 2, 1, () => S.chkdElevator(), 8);
      w.add(new G.NPC({ sprite: awake ? 'chkdGuard' : 'chkdGuardHypno', name: 'Security Guard', x: 4 * 16 + 8, y: 4 * 16 + 12, dir: 'down', talk: S.chkdGuard }));
      // the fish tank, the information desk (talk across it), the block sculpture
      F.hang(sp.fishTank, 8, 2, 3, look('A big fish tank. The fish are swimming in slow, perfect circles. ...Even the FISH?'), 2);
      F.stand(sp.receptionDesk, 13, 4, 4, () => S.chkdReception());
      w.add(new G.NPC({ sprite: awake ? 'chkdReception' : 'chkdReceptionHypno', name: 'Receptionist', x: 14 * 16 + 16, y: 3 * 16 + 12, dir: 'down', talk: S.chkdReception }));
      F.stand(sp.blockStack, 19, 4, 3, look('The alphabet blocks again: C, H, K, and a red cross on top.'));
      // seats, the teddy, the gift shop, plants
      for (const y of [7, 10]) F.stand(sp.kidChairs, 7, y, 3, look('Little chairs in red, blue, yellow and green.'));
      F.stand(sp.bigTeddy, 2, 9, 1, look('A giant teddy bear in a red bow tie. He\'s seen a lot.'));
      F.stand(sp.giftShop, 18, 10, 3, () => S.abeReach('giftShop'));
      F.hang(sp.supplyDoor, 17, 2, 1, () => S.supplyCloset(), 0);
      for (const [x, y] of [[1, 3], [22, 3], [22, 12]]) F.stand(sp.monstera, x, y, 1, look('A big potted plant.'));
      // babies (until MECHA-BABY goes down)
      if (!awake) for (const [x, y, k] of [[12, 8, 'blue'], [16, 9, 'pink'], [5, 11, 'tan']]) w.add(new G.HypnoBaby(x * 16 + 8, y * 16 + 12, k));
      w.addWarp(23, 6, 1, 2, 'chkdWard', 1, 7, 'right');
      w.addWarp(11, 13, 1, 1, 'chkd', 19, 11, 'down');
    },
    onEnter() { return S.chkdLobbyEnter(); },
  };

  // The ward: a long hallway of patient rooms, the nurses' station, bassinets racing up and
  // down, and the playroom at the end (foam mats, a ball pit, a toy kitchen, a rocking horse),
  // where the badge baby is teething on Hannah's badge.
  G.MAPS.chkdWard = {
    name: 'CHKD: the Ward',
    get music() { return flags().mobileBeaten ? 'house' : 'hospital'; },
    tiles() {
      const W = 36, H = 13;
      const g = Array.from({ length: H }, () => Array(W).fill('w'));
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) g[y + j][x + i] = c; };
      fill(1, 1, 24, 2, CW); fill(1, 3, 24, 9, CF);
      fill(26, 1, 9, 2, CW); fill(26, 3, 9, 9, PM);
      fill(25, 5, 1, 3, CF);                                    // the doorway into the playroom
      fill(0, 6, 1, 2, CF);                                     // back to the lobby
      return g.map((r) => r.join(''));
    },
    setup(w) {
      const F = furnish(w), sp = G.spr, f = flags(), s = G.state, awake = !!f.mobileBeaten;
      // patient rooms along the hall (quiet: everybody inside is asleep)
      // (Ruby's room is behind the green one)
      [3, 7, 11, 15, 19, 23].forEach((x, i) => F.hang(sp.roomDoors[i % 4], x, 2, 1, x === 11 ? () => S.rubyDoor() : look(['A patient room. A kid is fast asleep in there, snoring.', 'A patient room. A cartoon is playing to nobody.', 'A patient room. Somebody drew a dinosaur on the whiteboard. It has spiral eyes.'][i % 3]), 0));
      F.hang(sp.supplyDoor, 9, 2, 1, () => S.supplyCloset(), 0);
      // the nurses' station, with a nurse behind it
      F.stand(sp.nurseStation, 10, 6, 5, () => S.chkdNurse());
      w.add(new G.NPC({ sprite: awake ? 'chkdNurse' : 'chkdNurseHypno', name: 'Nurse', x: 12 * 16 + 8, y: 5 * 16 + 12, dir: 'down', talk: S.chkdNurse }));
      F.stand(sp.ivPole, 2, 3, 1, look('An IV pole.'));
      F.stand(sp.ivPole, 18, 3, 1, look('Another IV pole. They\'re everywhere.'));
      F.stand(sp.crashCart, 5, 11, 1, look('A crash cart. Nate does not touch the crash cart.'));
      F.stand(sp.wheelchair, 21, 11, 1, look('A wheelchair. Somebody left a stuffed giraffe in it.'));
      // the playroom
      for (const [x, y] of [[26, 1], [30, 1], [33, 1]]) F.hang(sp.roomDoors[(x >> 1) % 4], x, 2, 1, null, 0);
      w.addProp({ img: sp.ballPit, tx: 27, ty: 3, h: 2, solid: [27, 3, 3, 2], hit: [27, 3, 3, 2], talk: look('A ball pit. Nate has never wanted anything more in his life. Focus, Nate.') });
      F.stand(sp.toyKitchen, 32, 3, 2, look('A little play kitchen. There\'s a plastic egg in the frying pan. Huh.'));
      F.stand(sp.rockingHorse, 28, 9, 1, look('A rocking horse. It\'s rocking. Nobody\'s on it.'));
      for (const [x, y] of [[33, 9], [26, 11]]) F.stand(sp.blockTower, x, y, 1, look('A tower of blocks.'));
      F.stand(sp.kidChairs, 30, 11, 3, look('Little chairs.'));
      // babies: crawling, and bassinets racing down the hall (and the badge baby, in the playroom)
      if (!awake) {
        for (const [x, y, k] of [[6, 9, 'pink'], [17, 8, 'brown'], [22, 4, 'blue'], [29, 7, 'tan']]) w.add(new G.HypnoBaby(x * 16 + 8, y * 16 + 12, k));
        w.add(new G.BassinetBaby(4 * 16, 9 * 16 + 12, 1));
        w.add(new G.BassinetBaby(20 * 16, 4 * 16 + 12, -1));
      }
      if (!s.items.badge) w.add(new G.HypnoBaby(31 * 16, 7 * 16 + 12, 'blue', { badge: true, intro: null, onBonk: () => G.script.run(S.badgeFound()) }));
      w.addWarp(0, 6, 1, 2, 'chkdLobby', 22, 6, 'left');
    },
    onEnter() { return S.chkdWardEnter(); },
  };

  // The NICU: dim and quiet, rows of isolettes with monitors blinking, glider rockers, Hannah in
  // the middle rocking an empty isolette, and MECHA-BABY stomping in through the NICU doors.
  G.MAPS.chkdNicu = {
    name: 'CHKD: the NICU',
    get music() { return flags().mobileBeaten ? 'house' : 'hospital'; },
    // (small enough that the whole room, and the mech, fit on the screen during the fight)
    tiles() {
      const W = 16, H = 11;
      const g = Array.from({ length: H }, () => Array(W).fill('w'));
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) g[y + j][x + i] = c; };
      fill(1, 1, 14, 2, NW); fill(1, 3, 14, 7, NF);
      g[10][7] = 'x';
      return g.map((r) => r.join(''));
    },
    setup(w) {
      const F = furnish(w), sp = G.spr, f = flags();
      F.hang(sp.nicuDoors, 10, 2, 2, look('The doors to the rest of the NICU. Through the windows: more isolettes, and a lot of sleeping babies.'), 0);
      F.hang(sp.supplyCabinet, 6, 2, 1, () => S.supplyCloset(true), 4);
      // isolettes along the back wall, monitors, glider rockers
      w.isolettes = [];
      const iso = (x, y, kind) => { F.stand(sp.isolettes[kind], x, y, 2, look('An isolette. A tiny baby is sleeping inside, swaddled up tight.')); w.isolettes.push({ x: (x + 1) * 16, y: y * 16 - 10 }); };
      iso(1, 3, 'blue'); iso(4, 3, 'pink'); iso(12, 3, 'mint'); iso(13, 6, 'pink'); iso(1, 6, 'mint');
      F.stand(sp.vitalsMonitor, 3, 3, 1, look('A monitor. A steady little heartbeat. Beep. Beep. Beep.'));
      F.stand(sp.vitalsMonitor, 14, 3, 1, look('A monitor. Beep. Beep. Beep.'));
      for (const [x, y] of [[1, 9], [14, 9]]) F.stand(sp.nicuGlider, x, y, 1, look('A glider rocker, for feeding time.'));
      // Hannah's empty isolette, in the middle
      F.stand(sp.isolettes.blue, 7, 3, 2, look('An isolette. It\'s empty. Hannah was rocking it anyway.'));
      if (!f.mobileBeaten) {
        w.hannahNpc = w.add(new G.NPC({ sprite: 'hannahHypno', name: 'Hannah', x: 8 * 16, y: 4 * 16 + 14, dir: 'up', talk: function* () { yield G.say('Hannah', 'Shhhhh...'); } }));
        // (MECHA-BABY waits out of sight behind the NICU doors until the intro)
        w.mech = w.add(new G.MechaBaby(11 * 16, 4 * 16 + 4, { x0: 3 * 16 + 8, y0: 6 * 16, x1: 12 * 16 + 8, y1: 9 * 16 + 8 }));
        w.mech.hidden = true;
      } else {
        // the mech, parked in the corner, out of order
        w.props.push({ img: null, x: 0, y: 0, base: 8 * 16 + 14, draw(ctx, cx, cy) { const bx = 12 * 16 - 36 - cx, by = 8 * 16 + 14 - 62 - cy; ctx.drawImage(G.spr.mech.left.idle[0], bx, by); ctx.drawImage(G.spr.mechDome.empty, bx + 22, by - 3); } });
        w.blockTiles(11, 8, 2, 1);
        w.props.push({ img: null, x: 0, y: 0, base: 0, hit: [11 * 16, 7 * 16, 13 * 16, 9 * 16], talk: look('The mech, parked in the corner. Somebody stuck a note on it: OUT OF ORDER. NO BABIES ALLOWED.') });
        // Hannah's charge nurse, back on the floor (Hannah's shift: the NICU minigame)
        w.add(new G.NPC({ sprite: 'dot', name: 'Charge Nurse Dot', x: 5 * 16 + 8, y: 6 * 16 + 14, dir: 'down', talk: () => S.chargeNurse() }));
      }
      w.addTrigger(7, 10, 1, 1, () => { if (flags().mobileBeaten) G.script.run(S.nicuElevator()); else G.play.warp('chkdLobby', 3, 4, 'down'); });
    },
    onEnter() { return S.nicuEnter(); },
  };
  // ================================================================ HANNAH'S SHIFT (the NICU minigame)
  // After MECHA-BABY, Hannah's charge nurse (Charge Nurse Dot, an original character) is back on the
  // floor in the NICU. Talk to her with Hannah along and you ARE Hannah, running a NICU room against
  // the clock, kitchen-rush style: the babies in their isolettes call for things (a bubble with a
  // timer), and Hannah runs for the supplies and gets it done before the timer runs out.
  // Arrows run, X dashes, Z picks up / puts down, HOLD Z does the job (feed, change, swaddle, put the
  // leads back on, wash up, rock). What the babies need:
  //   feed: a bottle from the fridge, into the bottle warmer (warm after 3 seconds, too hot 8 seconds
  //     after that: bin it), then hold Z at the baby
  //   diaper: a clean one from the shelf, hold Z at the baby, the dirty one in the bin, then hold Z at
  //     the sink (dirty hands can't touch a baby, an isolette or anything clean)
  //   cold: tap Z at the isolette to turn its heat up
  //   swaddle (Shift 2 on): a warm blanket from the blanket warmer
  //   leads (Shift 2 on): the monitor's beeping; lead stickers from the cart
  //   cry (Shift 3): pick the baby up, rock them in the glider, put them back in their own isolette
  // Any counter holds whatever you set on it. Points for every baby looked after (more for being
  // quick); a need that runs out costs 10, and 5 more every 8 seconds it keeps waiting. Stars for
  // the score. Three shifts, each opening once the one before has a star; Shift 3 has twins (who want
  // the same thing at the same time) and Dot doing her rounds, right through the middle of the room.
  // State: s.nicu ({ shift1..3: { stars, best } }). Flags: nicuMet, nicuHow_<shift>.
  const nicuState = () => (G.state.nicu = G.state.nicu || {});
  const NT = 16, NOY = 16; // the room's tiles, and its top (under the HUD bar)
  const WARM = 180, HOT = 660; // a bottle in the warmer: warm, then too hot
  const NICU_NAMES = ['PEANUT', 'BEAN', 'WAFFLES', 'PICKLE', 'NOODLE', 'BISCUIT'];
  const NICU_SUPPLY = { F: 'bottle', D: 'diaper', B: 'blanket', L: 'leads' };
  const NICU_NEEDS = {
    feed: { pts: 25, w: 3, item: 'bottle', hold: 80, ask: 'is hungry. Warm up a bottle.' },
    diaper: { pts: 25, w: 3, item: 'diaper', hold: 70, ask: 'needs a clean diaper.' },
    cold: { pts: 10, w: 1, ask: 'is cold.' },
    swaddle: { pts: 20, w: 2, item: 'blanket', hold: 60, ask: 'kicked loose. Bring a warm blanket.' },
    leads: { pts: 20, w: 2, item: 'leads', hold: 50, ask: 'pulled a lead off. Bring stickers.' },
    cry: { pts: 30, w: 1, ask: 'is crying.' },
  };
  const DIRTY = 'Hands, Hannah! Wash them at the sink.';
  // The rooms (15x8 tiles): c counter, F milk fridge, W bottle warmer, D diapers, B blanket warmer,
  // L lead stickers, S sink, T diaper pail, G glider, I/i an isolette (2x2), . floor.
  const NICU_SHIFTS = [
    {
      id: 'shift1', name: 'SHIFT 1', title: 'DAY SHIFT', secs: 120, patience: 35, every: [300, 660], needs: ['feed', 'diaper', 'cold'], stars: [140, 260, 380],
      blurb: 'Three babies. Bottles, diapers and cold babies. Learn the room.',
      map: ['cFWccccccccccDc', 'c.............c', 'c..Ii..Ii..Ii.c', 'c..ii..ii..ii.c', 'c.............c', 'c.............T', 'c.............c', 'ccccccSSccccccc'],
      how: [
        ['HANNAH\'S SHIFT', ['You\'re Hannah. Arrows run, X dashes. Z picks things up and puts them down. HOLD Z to do the job.', 'A baby who needs something shows it in a bubble, with a timer under it. Get there before it runs out!', 'Any counter holds whatever you set on it. Enter ends the shift early.']],
        ['BOTTLES AND DIAPERS', ['HUNGRY: a bottle from the FRIDGE, into the BOTTLE WARMER until it dings, then hold Z at the baby. Leave it too long and it\'s too hot: bin it.', 'DIAPER: a clean one from the SHELF, hold Z at the baby, toss the dirty one in the PAIL, then hold Z at the SINK. Dirty hands can\'t touch anything.', 'COLD: just tap Z at the isolette.']],
      ],
    },
    {
      id: 'shift2', name: 'SHIFT 2', title: 'EVENING SHIFT', secs: 150, patience: 38, every: [360, 760], needs: ['feed', 'diaper', 'cold', 'swaddle', 'leads'], stars: [210, 400, 580],
      blurb: 'Four babies, two bottle warmers, and two new jobs: swaddling and the monitor leads.',
      map: ['cFWWcccBcccLcDc', 'c.............c', 'c...Ii...Ii...c', 'c...ii...ii...c', 'c.............c', 'c...Ii...Ii...T', 'c...ii...ii...c', 'cccccccSScccccc'],
      how: [['SWADDLES AND LEADS', ['KICKED LOOSE: a warm blanket from the BLANKET WARMER, then hold Z at the baby.', 'MONITOR BEEPING: a lead came off. Grab lead stickers from the CART, then hold Z at the baby.']]],
    },
    {
      id: 'shift3', name: 'SHIFT 3', title: 'NIGHT SHIFT', secs: 180, patience: 36, every: [340, 720], needs: ['feed', 'diaper', 'cold', 'swaddle', 'leads', 'cry'], stars: [290, 520, 760], twins: true, dot: [[1, 1], [13, 1], [13, 4], [1, 4]],
      blurb: 'Five babies, including TWINS, a glider for crying babies, and Dot doing her rounds.',
      map: ['cFWWcBcccLcDcTc', 'c.............c', 'c.Ii..Ii..Ii..c', 'c.ii..ii..ii..c', 'c.............c', 'G...Ii...Ii...c', 'c...ii...ii...c', 'ccccccSSccccccc'],
      how: [['CRYING BABIES', ['CRYING: pick the baby up (tap Z), carry them to the GLIDER and hold Z to rock them, then put them back in their OWN isolette.', 'The TWINS want the same thing at the same time. Always.', 'And Dot is doing her rounds. Don\'t run into Dot.']]],
    },
  ];

  // ---- drawing: the NICU background (menus and HOW TO cards), the need icons, items, a bar
  const nicuBack = (ctx, title, sub) => {
    ctx.fillStyle = '#e8f0f4'; ctx.fillRect(0, 0, G.W, G.H);
    ctx.fillStyle = '#d8e6ee'; for (let y = 14; y < G.H; y += 16) ctx.fillRect(0, y, G.W, 1);
    ctx.fillStyle = '#5a8ab0'; ctx.fillRect(0, 0, G.W, 12);
    FT().draw(ctx, title, 4, 2, '#f8f8f0', { shadow: '#1c2a3a' });
    if (sub) FT().draw(ctx, sub, G.W - 4 - FT().width(sub), 2, '#d8eef8', { shadow: '#1c2a3a' });
  };
  // an 11x11 icon for each need (in the bubble over the isolette): a bottle, a diaper, a snowflake,
  // a blanket, the monitor beeping, a crying face
  const NEED_ART = {
    feed: ['....ppp....', '...ppppp...', '...kkkkk...', '..kwwwwwk..', '..kwmmmwk..', '..kwmmmwk..', '..kwmmmwk..', '..kwmmmwk..', '..kwmmmwk..', '..kwwwwwk..', '...kkkkk...'],
    diaper: ['...........', 'kkkkkkkkkkk', 'kbbbbbbbbbk', 'kwwwwwwwwwk', 'kbwwwwwwwbk', 'kwwwwwwwwwk', '.kwwwwwwwk.', '..kwwwwwk..', '...kwwwk...', '....kkk....', '...........'],
    cold: ['.....c.....', '..c..c..c..', '...c.c.c...', '....ccc....', '.cccccccccc', '....ccc....', '...c.c.c...', '..c..c..c..', '.....c.....', '...........', '...........'],
    swaddle: ['...........', 'kkkkkkkkkkk', 'klllllllllk', 'kpppppppppk', 'klllllllllk', 'klllllllllk', 'kpppppppppk', 'klllllllllk', 'kkkkkkkkkkk', '...........', '...........'],
    leads: ['kkkkkkkkkkk', 'kdddddddddk', 'kdddddrdddk', 'kddddrdrddk', 'krrrrdddrrk', 'kdddddddddk', 'kkkkkkkkkkk', '....kkk....', '...........', '...........', '...........'],
    cry: ['..kkkkkkk..', '.ksssssssk.', 'kskkssskksk', 'ktssssssstk', 'ktssrrrsstk', 'ktsrrrrrstk', '.ksssssssk.', '..kkkkkkk..', '...........', '...........', '...........'],
  };
  const NEED_PAL = { k: '#2a3440', w: '#f8f8f4', b: '#8ac8f8', p: '#f4a8c8', m: '#f8e0a0', c: '#3a88d8', l: '#a8c8f0', d: '#1c2a24', r: '#f84848', s: '#f6d2bc', t: '#5ab8f0' };
  function needIcon(ctx, kind, x, y) {
    const art = NEED_ART[kind], dy = kind === 'leads' || kind === 'cry' ? 2 : kind === 'cold' || kind === 'swaddle' ? 1 : 0;
    art.forEach((row, j) => [...row].forEach((c, i) => { if (c !== '.') { ctx.fillStyle = NEED_PAL[c]; ctx.fillRect(x + i, y + j + dy, 1, 1); } }));
  }
  // the things Hannah carries (10x10)
  function nicuItem(ctx, it, x, y, t) {
    const R = (c, X, Y, w, h) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x + X), Math.round(y + Y), w, h); };
    if (it.kind === 'bottle') {
      const hot = it.heat >= HOT, warm = it.heat >= WARM;
      R('#7a8696', 2, 2, 6, 8); R(hot ? '#f86858' : warm ? '#f8e8b0' : '#dfeefa', 3, 4, 4, 5); R('#f4f4f0', 3, 3, 4, 1); R('#c8ccd4', 2, 2, 6, 1); R('#f4a8c8', 3, 0, 4, 2);
      if (hot && (t >> 3) & 1) { R('#c8ccd4', 1, -3, 1, 2); R('#c8ccd4', 5, -4, 1, 2); R('#c8ccd4', 8, -3, 1, 2); }
    } else if (it.kind === 'diaper' || it.kind === 'dirty') {
      const d = it.kind === 'dirty';
      R('#7a8696', 0, 2, 10, 7); R(d ? '#e8dca8' : '#f8f8f4', 1, 3, 8, 5); R(d ? '#c8b070' : '#8ac8f8', 0, 3, 2, 2); R(d ? '#c8b070' : '#8ac8f8', 8, 3, 2, 2);
      if (d) { R('#a87838', 3, 5, 3, 2); const k = (t >> 3) & 1; R('#78b048', 2, -2 - k, 1, 2); R('#78b048', 7, -3 + k, 1, 2); }
    } else if (it.kind === 'blanket') { R('#7a8696', 0, 2, 10, 8); R('#a8c8f0', 1, 3, 8, 6); R('#f4a8c8', 1, 5, 8, 1); R('#f8f8f4', 1, 3, 8, 1); }
    else if (it.kind === 'leads') { R('#7a8696', 0, 2, 10, 7); R('#f4f4f0', 1, 3, 8, 5); R('#c8c8c8', 2, 4, 2, 2); R('#2a2a30', 4, 4, 2, 2); R('#d83838', 6, 4, 2, 2); }
    else if (it.kind === 'baby') {
      const b = it.baby;
      R('#7a8696', 0, 1, 10, 10); R('#a8c8f0', 1, 2, 8, 8); R('#f6d2bc', 3, 2, 4, 4); R(b.cap, 3, 1, 4, 2); R('#2a1c24', 3, 4, 1, 1); R('#2a1c24', 6, 4, 1, 1);
      if (!b.rocked && (t >> 3) & 1) { R('#8ac8f8', 2, 5, 1, 2); R('#8ac8f8', 7, 5, 1, 2); }
    }
  }
  const bar = (ctx, x, y, w, h, k, col, back) => { ctx.fillStyle = back || '#1c2a3a'; ctx.fillRect(x, y, w, h); ctx.fillStyle = col; ctx.fillRect(x + 1, y + 1, Math.round((w - 2) * Math.max(0, Math.min(1, k))), h - 2); };
  // a big pixel star (9x9 at 2x), gold if earned
  const STAR = ['....#....', '....#....', '...###...', '#########', '.#######.', '..#####..', '..##.##..', '.##...##.', '.#.....#.'];
  const bigStar = (ctx, x, y, got) => STAR.forEach((row, j) => [...row].forEach((c, i) => {
    if (c !== '#') return;
    ctx.fillStyle = '#1c2a3a'; ctx.fillRect(x + i * 2 + 1, y + j * 2 + 1, 2, 2);
    ctx.fillStyle = got ? (j < 3 ? '#fce890' : '#f8a020') : '#c8d0d8'; ctx.fillRect(x + i * 2, y + j * 2, 2, 2);
  }));
  const starRow = (ctx, n, cx, y) => { const w = FT().width('★★★'); FT().draw(ctx, '★'.repeat(n), cx - Math.round(w / 2), y, '#f8a020', { shadow: '#1c2a3a' }); FT().draw(ctx, '★'.repeat(3 - n), cx - Math.round(w / 2) + FT().width('★'.repeat(n)), y, '#b8c4d0', { shadow: '#1c2a3a' }); };

  // ---- a shift: the room, Hannah, the babies, the clock
  function shiftCmd(S0) {
    const inp = G.input;
    const DIRV = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
    return {
      start() {
        this.map = S0.map.map((r) => r.split(''));
        this.W = this.map[0].length; this.H = this.map.length;
        this.cell = []; this.stations = []; this.babies = [];
        for (let y = 0; y < this.H; y++) for (let x = 0; x < this.W; x++) {
          const ch = this.map[y][x];
          if (ch !== '.' && ch !== 'i') this.stations.push({ kind: ch, x, y, w: ch === 'I' ? 2 : 1, h: ch === 'I' ? 2 : 1, item: null });
        }
        for (const st of this.stations) for (let j = 0; j < st.h; j++) for (let i = 0; i < st.w; i++) this.cell[(st.y + j) * this.W + st.x + i] = st;
        const isos = this.stations.filter((st) => st.kind === 'I');
        isos.forEach((st, i) => {
          const twin = !!S0.twins && i >= isos.length - 2;
          st.baby = {
            st, twin, name: twin ? (i === isos.length - 2 ? 'TWIN A' : 'TWIN B') : NICU_NAMES[i],
            iso: twin ? 'mint' : ['blue', 'pink', 'mint'][i % 3], cap: twin ? '#a8e0c8' : ['#8ab8e8', '#f4a8c8', '#a8e0c8'][i % 3],
            need: null, next: 90 + i * 140 + Math.round(Math.random() * 100), prog: 0,
          };
          this.babies.push(st.baby);
        });
        Object.assign(this, { hx: 7 * NT + 8, hy: NOY + 4 * NT + 12, dir: 'up', anim: 0, moving: false, dashT: 0, dashCD: 0, held: null, dirty: false, wash: 0 });
        Object.assign(this, { t: 0, left: S0.secs * 60, score: 0, done: 0, missed: 0, phase: 'ready', pops: [], msg: null, msgT: 0, focus: null, working: null });
        if (S0.dot) { const [x, y] = S0.dot[0]; this.dot = { x: x * NT + 8, y: NOY + y * NT + 12, i: 1, step: 1, dir: 'right', anim: 0, wait: 0 }; }
        G.play.overlay = this;
      },
      // ---- the room's layout
      solidAt(px, py) {
        const tx = Math.floor(px / NT), ty = Math.floor((py - NOY) / NT);
        return tx < 0 || ty < 0 || tx >= this.W || ty >= this.H || this.map[ty][tx] !== '.';
      },
      blocked(x, y) {
        for (const [px, py] of [[x - 5, y - 5], [x + 4, y - 5], [x - 5, y - 1], [x + 4, y - 1]]) if (this.solidAt(px, py)) return true;
        return !!this.dot && Math.abs(this.dot.x - x) < 11 && Math.abs(this.dot.y - y) < 8;
      },
      // the station right in front of Hannah
      target() {
        const [dx, dy] = DIRV[this.dir], px = this.hx + dx * 11, py = this.hy - 3 + dy * 11;
        const tx = Math.floor(px / NT), ty = Math.floor((py - NOY) / NT);
        if (tx < 0 || ty < 0 || tx >= this.W || ty >= this.H) return null;
        return this.cell[ty * this.W + tx] || null;
      },
      say(txt) { this.msg = txt; this.msgT = 150; },
      pop(st, txt, col) { this.pops.push({ x: st.x * NT + st.w * 8, y: NOY + st.y * NT - 4, txt, col, t: 50 }); },
      // ---- what Z does at a station: { tap }, { hold, dur, prog, set, done, baby }, or { no: why }
      act(st) {
        const h = this.held, k = st.kind, no = (why) => ({ no: why });
        if (k === 'I') return this.isoAct(st.baby);
        if (k === 'T') {
          if (!h) return no('The diaper pail. Dirty diapers go in here.');
          if (h.kind === 'baby') return no('You can\'t throw away a baby, Hannah.');
          return { what: 'Z: toss it in the pail', tap: () => { this.held = null; G.audio.sfx('poof'); } };
        }
        if (k === 'S') {
          if (h) return no(h.kind === 'dirty' ? 'Diaper in the pail first. Then wash.' : 'Put that down first.');
          if (!this.dirty) return no('Your hands are already clean.');
          return { what: 'Hold Z: wash your hands', hold: 'wash', dur: 60, prog: () => this.wash, set: (v) => (this.wash = v), done: () => { this.dirty = false; this.wash = 0; G.audio.sfx('select'); this.say('Squeaky clean.'); } };
        }
        if (NICU_SUPPLY[k]) {
          const it = NICU_SUPPLY[k];
          // (an unused one goes back where it came from)
          if (h && h.kind === it && !(it === 'bottle' && h.heat)) return { what: 'Z: put it back', tap: () => { this.held = null; G.audio.sfx('menu'); } };
          if (h) return no('Your hands are full.');
          if (this.dirty) return no(DIRTY);
          return { what: 'Z: take ' + { bottle: 'a bottle of milk', diaper: 'a clean diaper', blanket: 'a warm blanket', leads: 'lead stickers' }[it], tap: () => { this.held = it === 'bottle' ? { kind: 'bottle', heat: 0 } : { kind: it }; G.audio.sfx('pop'); } };
        }
        if (k === 'W') {
          if (st.item) {
            if (h) return no('Your hands are full.');
            if (this.dirty) return no(DIRTY);
            const ht = st.item.heat;
            return { what: 'Z: take the bottle ' + (ht >= HOT ? '(TOO HOT)' : ht >= WARM ? '(warm!)' : '(still warming)'), tap: () => { this.held = st.item; st.item = null; G.audio.sfx('pop'); } };
          }
          if (!h) return no('The bottle warmer. Fridge bottles go in here.');
          if (h.kind !== 'bottle') return no('Only bottles go in the bottle warmer.');
          return { what: 'Z: put the bottle in to warm up', tap: () => { st.item = h; this.held = null; G.audio.sfx('menu'); } };
        }
        if (k === 'c') {
          if (st.item) {
            if (h) return no('Your hands are full.');
            if (this.dirty && st.item.kind !== 'dirty') return no(DIRTY);
            return { what: 'Z: pick it up', tap: () => { this.held = st.item; st.item = null; G.audio.sfx('pop'); } };
          }
          if (!h) return no(null);
          if (h.kind === 'baby') return no('Babies go in their isolettes, not on the counter.');
          return { what: 'Z: set it down here', tap: () => { st.item = h; this.held = null; G.audio.sfx('menu'); } };
        }
        if (k === 'G') {
          if (!h || h.kind !== 'baby') return no('The glider. For rocking a crying baby.');
          const b = h.baby;
          if (b.rocked) return no('Baby ' + b.name + ' is calm now. Back in their isolette.');
          return { what: 'Hold Z: rock Baby ' + b.name, hold: 'rock', dur: 100, baby: b, prog: () => b.prog, set: (v) => (b.prog = v), done: () => { b.rocked = true; b.prog = 0; G.audio.sfx('giggle'); this.say('Baby ' + b.name + ' calmed down. Now back to bed.'); } };
        }
        return no(null);
      },
      isoAct(b) {
        const h = this.held, N = b.need && NICU_NEEDS[b.need], no = (why) => ({ no: why });
        if (h && h.kind === 'baby') {
          if (h.baby !== b) return no('That\'s not Baby ' + h.baby.name + '\'s isolette.');
          return { what: 'Z: put Baby ' + b.name + ' back to bed', tap: () => { this.held = null; b.out = false; if (b.rocked) this.complete(b); else { G.audio.sfx('wah'); this.say('Baby ' + b.name + ' is still crying.'); } } };
        }
        if (this.dirty) return no(DIRTY);
        if (!b.need) return no('Baby ' + b.name + ' is sound asleep.');
        if (b.need === 'cold') return { what: 'Z: turn up the heat for Baby ' + b.name, tap: () => { G.audio.sfx('menu'); this.complete(b); } };
        if (b.need === 'cry') {
          if (h) return no('Put that down to pick up Baby ' + b.name + '.');
          return { what: 'Z: pick up Baby ' + b.name, tap: () => { this.held = { kind: 'baby', baby: b }; b.out = true; b.rocked = false; b.prog = 0; G.audio.sfx('pop'); } };
        }
        if (h && h.kind === 'bottle' && b.need === 'feed' && (h.heat < WARM || h.heat >= HOT)) return no(h.heat < WARM ? 'Too cold! Warm it up in the bottle warmer.' : 'Way too hot! Bin it and start over.');
        if (!h || h.kind !== N.item) return no('Baby ' + b.name + ' ' + N.ask);
        return { what: b.need === 'leads' ? 'Hold Z: stick Baby ' + b.name + '\'s leads back on' : 'Hold Z: ' + { feed: 'feed', diaper: 'change', swaddle: 'swaddle' }[b.need] + ' Baby ' + b.name, hold: b.need, dur: N.hold, baby: b, prog: () => b.prog, set: (v) => (b.prog = v), done: () => {
          if (b.need === 'diaper') { this.held = { kind: 'dirty' }; this.dirty = true; } else this.held = null;
          this.complete(b);
        } };
      },
      complete(b) {
        const N = NICU_NEEDS[b.need], pts = b.left <= 0 ? Math.round(N.pts / 2) : N.pts + Math.round((10 * b.left) / b.max);
        this.score += pts; this.done++;
        this.pop(b.st, '+' + G.sayable(pts), '#38a858');
        G.audio.sfx('select');
        Object.assign(b, { need: null, prog: 0, rocked: false, next: S0.every[0] + Math.round(Math.random() * (S0.every[1] - S0.every[0])) });
      },
      newNeed(b) {
        const pool = S0.needs.flatMap((k) => Array(NICU_NEEDS[k].w).fill(k)), k = pool[Math.floor(Math.random() * pool.length)];
        // (the twins want the same thing at the same time)
        const who = b.twin ? this.babies.filter((o) => o.twin && !o.need && !o.out) : [b];
        for (const o of who) Object.assign(o, { need: k, left: S0.patience * 60, max: S0.patience * 60, prog: 0, overT: 0 });
        G.audio.sfx(k === 'leads' ? 'buzz' : k === 'cry' ? 'wah' : 'blip');
      },
      update() {
        if (quitHit()) { this.result = 'quit'; return true; }
        this.t++;
        for (const p of this.pops) { p.t--; p.y -= 0.4; }
        this.pops = this.pops.filter((p) => p.t > 0);
        if (this.msgT > 0) this.msgT--;
        if (this.phase === 'ready') { if (this.t === 60) G.audio.sfx('bell'); if (this.t >= 100) this.phase = 'play'; return false; }
        if (this.phase === 'over') { if (++this.overT > 100) this.phase = 'results'; return false; }
        if (this.phase === 'results') { if (inp.hit('a')) { inp.eat('a'); this.result = { score: this.score, stars: this.stars, done: this.done, missed: this.missed }; return true; } return false; }
        // the clock
        if (--this.left <= 0) {
          this.phase = 'over'; this.overT = 0;
          this.stars = S0.stars.filter((s) => this.score >= s).length;
          G.audio.sfx('fanfare');
          return false;
        }
        if (this.left === 600) this.say('Ten seconds left!');
        // what Z does right now
        const tgt = this.target(), a = tgt ? this.act(tgt) : null;
        this.focus = tgt; this.working = null; this.hint = a && (a.what || a.no);
        if (inp.hit('a')) { if (a && a.tap) a.tap(); else if (a && a.no) { this.say(a.no); G.audio.sfx('bump'); } }
        const busy = inp.down('a') && a && a.hold;
        if (busy) {
          a.set(a.prog() + 1 / a.dur);
          this.working = a.baby || null;
          if (this.t % 14 === 0) G.audio.sfx(a.hold === 'wash' ? 'spray' : 'blip');
          if (a.prog() >= 1) a.done();
        }
        // Hannah runs (not while she's busy with something)
        this.moving = false;
        if (this.dashCD > 0) this.dashCD--;
        if (!busy) {
          let mx = (inp.down('right') ? 1 : 0) - (inp.down('left') ? 1 : 0), my = (inp.down('down') ? 1 : 0) - (inp.down('up') ? 1 : 0);
          if (mx && !my) this.dir = mx > 0 ? 'right' : 'left';
          else if (my && !mx) this.dir = my > 0 ? 'down' : 'up';
          else if (mx && my && !((this.dir === 'left' && mx < 0) || (this.dir === 'right' && mx > 0) || (this.dir === 'up' && my < 0) || (this.dir === 'down' && my > 0))) this.dir = mx > 0 ? 'right' : 'left';
          if (inp.hit('b') && !this.dashCD) { this.dashT = 9; this.dashCD = 40; G.audio.sfx('dash'); }
          let sp = 1.35;
          if (this.dashT > 0) { this.dashT--; sp = 3.4; if (!mx && !my) [mx, my] = DIRV[this.dir]; }
          if (mx && my) sp *= 0.72;
          const nx = this.hx + mx * sp, ny = this.hy + my * sp;
          if (mx && !this.blocked(nx, this.hy)) { this.hx = nx; this.moving = true; }
          if (my && !this.blocked(this.hx, ny)) { this.hy = ny; this.moving = true; }
          if (this.moving) this.anim++;
        }
        // the babies' needs, each on its own clock (not while Hannah's carrying one or working on one)
        for (const b of this.babies) {
          if (b.out) continue;
          if (!b.need) { if (--b.next <= 0) this.newNeed(b); continue; }
          if (this.working === b) continue;
          b.left--;
          if (b.left === 0) { this.score = Math.max(0, this.score - 10); this.missed++; this.pop(b.st, '-10', '#d83838'); G.audio.sfx('wah'); this.say('Baby ' + b.name + ' waited too long!'); }
          else if (b.left < 0 && ++b.overT % 480 === 0) { this.score = Math.max(0, this.score - 5); this.pop(b.st, '-5', '#d83838'); G.audio.sfx('wah'); }
        }
        // the bottle warmers
        for (const st of this.stations) {
          if (st.kind !== 'W' || !st.item) continue;
          const h = ++st.item.heat;
          if (h === WARM) { G.audio.sfx('bell'); this.pop(st, 'DING!', '#38a858'); }
          if (h === HOT) { G.audio.sfx('no'); this.pop(st, 'TOO HOT', '#d83838'); }
        }
        // Dot, doing her rounds (she waits for Hannah to get out of the way)
        const d = this.dot;
        if (d) {
          const [tx, ty] = S0.dot[d.i], gx = tx * NT + 8, gy = NOY + ty * NT + 12, dx = gx - d.x, dy = gy - d.y, dist = Math.hypot(dx, dy);
          const n = S0.dot.length;
          if (dist < 0.7) { d.x = gx; d.y = gy; d.i = (d.i + d.step + n) % n; }
          else {
            const nx = d.x + (dx / dist) * 0.6, ny = d.y + (dy / dist) * 0.6;
            // (blocked for long enough, she turns around and walks her rounds the other way)
            if (Math.abs(nx - this.hx) < 11 && Math.abs(ny - this.hy) < 8) { if (++d.wait === 40) this.say('Dot: Excuse me, Hannah.'); if (d.wait >= 90) { d.step = -d.step; d.i = (d.i + d.step + n) % n; d.wait = 0; } }
            else { d.x = nx; d.y = ny; d.wait = 0; d.anim++; d.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up'; }
          }
        }
        return false;
      },

      // ---- drawing
      draw(ctx) {
        ctx.fillStyle = '#e8f0f4'; ctx.fillRect(0, 0, G.W, G.H);
        this.drawRoom(ctx);
        // the HUD: the shift, the clock, the score
        ctx.fillStyle = '#5a8ab0'; ctx.fillRect(0, 0, G.W, NOY);
        ctx.fillStyle = '#3a6a90'; ctx.fillRect(0, NOY - 1, G.W, 1);
        FT().draw(ctx, S0.name, 4, 4, '#f8f8f0', { shadow: '#1c2a3a' });
        const secs = Math.max(0, Math.ceil(this.left / 60)), tt = 'TIME ' + G.sayable(secs);
        FT().draw(ctx, tt, 120 - Math.round(FT().width(tt) / 2), 4, secs <= 10 && (this.t >> 4) & 1 ? '#f86858' : '#f8f8f0', { shadow: '#1c2a3a' });
        const sc = 'SCORE ' + G.sayable(this.score);
        FT().draw(ctx, sc, G.W - 4 - FT().width(sc), 4, '#f8d850', { shadow: '#1c2a3a' });
        // the message strip: what just happened, or the controls
        const my = NOY + this.H * NT;
        ctx.fillStyle = '#1c2a3a'; ctx.fillRect(0, my, G.W, G.H - my);
        // (what just happened; else what Z does at whatever Hannah's facing; else the controls)
        const line = this.phase === 'ready' ? 'Get ready...' : this.phase !== 'play' ? '' : this.msgT > 0 ? this.msg : this.hint ? this.hint : this.dirty ? 'Your hands are dirty: wash them at the sink.' : this.held && this.held.kind === 'baby' ? 'Carrying Baby ' + this.held.baby.name : 'Z grab / put down   hold Z: do it   X dash';
        FT().draw(ctx, FT().wrap(line, 232)[0], 4, my + 4, this.msgT > 0 || this.dirty ? '#f8d850' : this.hint ? '#f8f8f0' : '#a8b8c8');
        // the big words
        const big = (txt, col) => { const w = FT().bigWidth(txt, 3); FT().drawBig(ctx, txt, Math.round(120 - w / 2), 60, 3, col, '#1c2a3a'); };
        if (this.phase === 'ready') big(this.t < 60 ? 'READY...' : 'GO!', this.t < 60 ? '#f8d850' : '#78e070');
        if (this.phase === 'over') big('TIME\'S UP!', '#f86858');
        if (this.phase === 'results') this.drawResults(ctx);
      },
      drawRoom(ctx) {
        const T = this.t;
        // the floor
        for (let y = 0; y < this.H; y++) for (let x = 0; x < this.W; x++) {
          ctx.fillStyle = (x + y) % 2 ? '#e2eaf0' : '#eaf1f5'; ctx.fillRect(x * NT, NOY + y * NT, NT, NT);
        }
        // the counters and what's on them
        for (const st of this.stations) {
          const x = st.x * NT, y = NOY + st.y * NT;
          if (st.kind === 'I' || st.kind === 'G') continue;
          if (st.kind !== 'T') {
            ctx.fillStyle = '#7a8696'; ctx.fillRect(x, y, NT, NT);
            ctx.fillStyle = '#e4e9ef'; ctx.fillRect(x, y, NT, 12);
            ctx.fillStyle = '#f6f8fa'; ctx.fillRect(x, y, NT, 1);
            ctx.fillStyle = '#aeb9c6'; ctx.fillRect(x, y + 12, NT, 3);
            ctx.fillStyle = '#cdd5de'; ctx.fillRect(x, y + 1, 1, 11);
          }
          this.drawStation(ctx, st, x, y, T);
          if (st.item && st.kind !== 'W') nicuItem(ctx, st.item, x + 3, y + 1, T);
        }
        // the sprites, back to front: isolettes, the glider, Hannah, Dot
        const list = [];
        for (const st of this.stations) {
          if (st.kind === 'I') list.push({ y: NOY + (st.y + 2) * NT, draw: () => this.drawIsolette(ctx, st.baby, T) });
          // (the glider sits back against the wall: Hannah, beside it, is in front of it)
          if (st.kind === 'G') list.push({ y: NOY + st.y * NT + 4, draw: () => this.drawGlider(ctx, st, T) });
        }
        list.push({ y: this.hy, draw: () => this.drawHannah(ctx, T) });
        if (this.dot) {
          const d = this.dot, S = G.sprites.dot;
          list.push({ y: d.y, draw: () => ctx.drawImage(S[d.dir][walkFrameOf(d.anim, d.wait === 0)], Math.round(d.x - 8), Math.round(d.y - S.h + 2)) });
        }
        list.sort((a, b) => a.y - b.y).forEach((s) => s.draw());
        // what Z would work on: corners around it
        const f = this.focus;
        if (f && this.phase === 'play') {
          const x = f.x * NT, y = NOY + f.y * NT, w = f.w * NT, h = f.h * NT, c = (T >> 3) & 1 ? '#f8d850' : '#f8a020';
          ctx.fillStyle = c;
          for (const [cx, cy, sx, sy] of [[x, y, 1, 1], [x + w - 1, y, -1, 1], [x, y + h - 1, 1, -1], [x + w - 1, y + h - 1, -1, -1]]) { ctx.fillRect(sx > 0 ? cx : cx - 3, cy, 4, 1); ctx.fillRect(cx, sy > 0 ? cy : cy - 3, 1, 4); }
        }
        // the bubbles over babies who need something, and the scores floating up
        for (const b of this.babies) if (b.need && !b.out) this.drawBubble(ctx, b, T);
        for (const p of this.pops) FT().draw(ctx, p.txt, Math.round(p.x - FT().width(p.txt) / 2), Math.round(p.y), p.col, { shadow: '#f8f8f0' });
      },
      drawStation(ctx, st, x, y, T) {
        const R = (c, X, Y, w, h) => { ctx.fillStyle = c; ctx.fillRect(x + X, y + Y, w, h); };
        if (st.kind === 'F') {
          // the milk fridge: a little white fridge with a bottle on the door
          R('#7a8696', 1, 0, 14, 15); R('#f4f6f8', 2, 1, 12, 13); R('#c8d0d8', 2, 6, 12, 1); R('#9aa6b4', 12, 2, 1, 3); R('#9aa6b4', 12, 8, 1, 4);
          R('#f4a8c8', 6, 8, 2, 1); R('#dfeefa', 5, 9, 4, 4); R('#7a8696', 5, 9, 4, 1);
        } else if (st.kind === 'W') {
          // the bottle warmer: the bottle in its well, and a light for how it's doing
          R('#5a6676', 2, 3, 12, 10); R('#f4f6f8', 3, 4, 10, 8); R('#2a3440', 5, 4, 6, 3); R('#f8a020', 4, 9, 2, 1); R('#f8a020', 4, 10, 1, 1);
          const it = st.item, h = it ? it.heat : 0, blink = (T >> 3) & 1;
          if (it) nicuItem(ctx, it, x + 3, y - 4, T);
          R(!it ? '#5a6676' : h >= HOT ? '#f83838' : h >= WARM ? (blink ? '#78e070' : '#3a8a48') : blink ? '#f8a020' : '#a86010', 10, 9, 2, 2);
          if (it && h < WARM) bar(ctx, x + 2, y + 13, 12, 3, h / WARM, '#f8a020');
        } else if (st.kind === 'D') {
          // a basket of clean diapers
          for (const [X, Y] of [[2, 2], [9, 1], [5, 0]]) { R('#7a8696', X, Y, 6, 6); R('#f8f8f4', X + 1, Y + 1, 4, 4); R('#8ac8f8', X + 1, Y + 2, 1, 1); R('#8ac8f8', X + 4, Y + 2, 1, 1); }
          R('#2a5a80', 1, 6, 14, 8); R('#5a8ab0', 2, 7, 12, 6); R('#8ab8d8', 2, 7, 12, 1); R('#3a6a90', 2, 10, 12, 1);
        } else if (st.kind === 'B') {
          // the blanket warmer: a cabinet with a glass door and folded blankets
          R('#7a8696', 1, 0, 14, 14); R('#c8d4e0', 2, 1, 12, 12);
          ['#f4a8c8', '#a8c8f0', '#f8e8a0', '#a8e0c8'].forEach((c, k) => R(c, 3, 2 + k * 3, 10, 2));
          R('#f8a020', 12, 11, 1, 1);
        } else if (st.kind === 'L') {
          R('#7a8696', 2, 3, 12, 9); R('#f4f4f0', 3, 4, 10, 7);
          R('#c8c8c8', 4, 6, 2, 2); R('#2a2a30', 7, 6, 2, 2); R('#d83838', 10, 6, 2, 2);
        } else if (st.kind === 'S') {
          R('#7a8696', 1, 2, 14, 10); R('#c8d4e0', 2, 3, 12, 8); R('#9aa8b8', 3, 5, 10, 5); R('#5a6676', 7, 0, 2, 4); R('#5a6676', 7, 4, 1, 1);
          if (this.wash > 0 && this.focus === st) for (let k = 0; k < 4; k++) R('#f8f8f8', 4 + ((k * 3 + (T >> 2)) % 9), 4 + ((k * 5 + (T >> 3)) % 5), 2, 2);
        } else if (st.kind === 'T') {
          // the diaper pail
          ctx.fillStyle = (st.x + st.y) % 2 ? '#e2eaf0' : '#eaf1f5'; ctx.fillRect(x, y, NT, NT);
          R('#7a8696', 3, 3, 10, 12); R('#f4f4f0', 4, 5, 8, 9); R('#7a8696', 2, 2, 12, 3); R('#c8ccd4', 3, 3, 10, 1); R('#f8d850', 6, 8, 4, 3); R('#5a6676', 6, 14, 4, 2);
        }
      },
      drawIsolette(ctx, b, T) {
        const st = b.st, late = b.need && b.left <= 0, sx = st.x * NT + (late && (T >> 2) & 1 ? 1 : 0), sy = NOY + st.y * NT + 2;
        ctx.drawImage(G.spr.isolettes[b.iso], sx, sy);
        const R = (c, X, Y, w, h) => { ctx.fillStyle = c; ctx.fillRect(sx + X, sy + Y, w, h); };
        if (b.out) { R('#cfe6f2', 10, 5, 15, 10); R('#f8f4ee', 10, 8, 12, 6); return; }
        R(b.cap, 19, 6, 5, 3);
        if (b.need && (T >> 3) & 1) { R('#8ac8f8', 18, 10, 1, 2); R('#8ac8f8', 24, 10, 1, 2); }
      },
      drawGlider(ctx, st, T) {
        const h = this.held, rocking = h && h.kind === 'baby' && this.focus === st && h.baby.prog > 0 && inp.down('a');
        const x = st.x * NT, y = NOY + st.y * NT, dx = rocking ? Math.round(Math.sin(T / 8) * 1.5) : 0;
        ctx.drawImage(G.spr.nicuGlider, x - 1 + dx, y - 8);
      },
      drawHannah(ctx, T) {
        const S = G.sprites.hannah, img = S[this.dir][walkFrameOf(this.anim, this.moving)], x = Math.round(this.hx), y = Math.round(this.hy);
        const it = this.held, pos = { down: [-5, -15], up: [-5, -19], left: [-12, -14], right: [2, -14] }[this.dir];
        if (it && this.dir === 'up') nicuItem(ctx, it, x + pos[0], y + pos[1], T);
        // (a puff of dust while she dashes)
        if (this.dashT > 0) { ctx.fillStyle = '#c8d0d8'; ctx.fillRect(x - 6 - DIRV[this.dir][0] * 6, y - 3, 3, 2); ctx.fillRect(x + 3 - DIRV[this.dir][0] * 6, y - 2, 2, 2); }
        ctx.drawImage(img, x - 8, y - S.h + 2);
        if (it && this.dir !== 'up') nicuItem(ctx, it, x + pos[0], y + pos[1], T);
        // (dirty hands: stink wisps over her head)
        if (this.dirty) for (let k = 0; k < 3; k++) { const wx = x - 6 + k * 5, wy = y - S.h - 3 - (((T >> 3) + k) & 1); ctx.fillStyle = '#78b048'; ctx.fillRect(wx, wy, 1, 2); ctx.fillRect(wx + 1, wy - 2, 1, 2); ctx.fillRect(wx, wy - 4, 1, 2); }
        // the job's progress, over her head
        const a = this.focus && inp.down('a') ? this.act(this.focus) : null;
        if (a && a.hold && a.prog() > 0) bar(ctx, x - 9, y - S.h - 4, 18, 4, a.prog(), '#78e070');
      },
      drawBubble(ctx, b, T) {
        const st = b.st, x = st.x * NT + 8, y = NOY + st.y * NT - 9, late = b.left <= 0;
        ctx.fillStyle = late && (T >> 3) & 1 ? '#d83838' : '#1c2a3a'; ctx.fillRect(x, y, 16, 15); ctx.fillRect(x + 6, y + 15, 4, 2);
        ctx.fillStyle = '#f8f8f0'; ctx.fillRect(x + 1, y + 1, 14, 13); ctx.fillRect(x + 7, y + 14, 2, 2);
        needIcon(ctx, b.need, x + 3, y + 2);
        const k = Math.max(0, b.left / b.max);
        bar(ctx, x, y - 4, 16, 4, k, k > 0.5 ? '#78e070' : k > 0.25 ? '#f8d850' : '#f86858');
        if (b.prog > 0) bar(ctx, x, y + 17, 16, 3, b.prog, '#5a8ab0');
      },
      drawResults(ctx) {
        ctx.fillStyle = 'rgba(28,42,58,0.55)'; ctx.fillRect(0, 0, G.W, G.H);
        ctx.fillStyle = '#1c2a3a'; ctx.fillRect(40, 24, 160, 112); ctx.fillStyle = '#f8f8f0'; ctx.fillRect(41, 25, 158, 110);
        ctx.fillStyle = '#5a8ab0'; ctx.fillRect(41, 25, 158, 12);
        const c = (txt, y, col) => FT().draw(ctx, txt, 120 - Math.round(FT().width(txt) / 2), y, col || '#1c2a3a');
        c(S0.title + ' OVER', 27, '#f8f8f0');
        const sc = G.sayable(this.score), w = FT().bigWidth(sc, 2);
        FT().drawBig(ctx, sc, Math.round(120 - w / 2), 44, 2, '#1c2a3a', '#b8c4d0');
        c('POINTS', 64, '#5a6a7a');
        for (let k = 0; k < 3; k++) bigStar(ctx, 120 - 33 + k * 24, 72, k < this.stars);
        c('Babies looked after: ' + G.sayable(this.done), 94);
        c('Waited too long: ' + G.sayable(this.missed), 104, this.missed ? '#d83838' : '#1c2a3a');
        const nx = S0.stars.find((s) => this.score < s);
        c(nx ? 'Next star at ' + G.sayable(nx) : 'Every star!', 114, '#5a6a7a');
        if ((this.t >> 4) & 1) c('Z: done', 125, '#5a8ab0');
      },
    };
  }
  const walkFrameOf = (anim, moving) => (moving ? [1, 0, 2, 0][Math.floor(anim / 8) % 4] : 0);

  // ---- the menu: the shifts (each opens once the one before has a star), and HOW TO PLAY
  function nicuMenuCmd() {
    const N = nicuState(), rows = NICU_SHIFTS.concat([{ id: 'how', name: 'HOW TO PLAY', blurb: 'The controls, and how to look after every kind of baby.' }]);
    const open = (i) => i === 0 || i === rows.length - 1 || !!(N[rows[i - 1].id] && N[rows[i - 1].id].stars);
    return {
      start() { this.sel = Math.max(0, NICU_SHIFTS.findIndex((S0, i) => open(i) && !(N[S0.id] && N[S0.id].stars >= 3))); this.t = 0; G.play.overlay = this; },
      update() {
        const inp = G.input;
        this.t++;
        if (inp.hit('up') && this.sel > 0) { this.sel--; G.audio.sfx('menu'); }
        if (inp.hit('down') && this.sel < rows.length - 1) { this.sel++; G.audio.sfx('menu'); }
        if (inp.hit('a')) { inp.eat('a'); if (open(this.sel)) { G.audio.sfx('select'); this.result = rows[this.sel]; return true; } G.audio.sfx('bump'); }
        if (inp.hit('b') || quitHit()) { inp.eat('b'); G.audio.sfx('cancel'); this.result = null; return true; }
        return false;
      },
      draw(ctx) {
        const stars = NICU_SHIFTS.reduce((t, S0) => t + ((N[S0.id] && N[S0.id].stars) || 0), 0);
        nicuBack(ctx, 'HANNAH\'S SHIFT', '★ ' + G.sayable(stars) + '/' + G.sayable(NICU_SHIFTS.length * 3));
        rows.forEach((r, i) => {
          const y = 18 + i * 28, on = i === this.sel, ok = open(i), best = N[r.id];
          ctx.fillStyle = on ? '#f8d850' : '#9ab8d0'; ctx.fillRect(8, y, 150, 25); ctx.fillStyle = on ? '#fff8d8' : '#f8f8f0'; ctx.fillRect(9, y + 1, 148, 23);
          if (r.id === 'how') { FT().draw(ctx, r.name, 14, y + 8, '#1c2a3a'); return; }
          FT().draw(ctx, ok ? r.name + ': ' + r.title : r.name + ': ???', 14, y + 3, ok ? '#1c2a3a' : '#9a9aa8');
          if (!ok) FT().draw(ctx, 'locked', 14, y + 13, '#b8b8c0');
          else if (!best) FT().draw(ctx, 'NEW', 14, y + 13, '#38a858');
          else { starRow(ctx, best.stars, 30, y + 13); FT().draw(ctx, 'BEST ' + G.sayable(best.best), 62, y + 13, '#5a6a7a'); }
        });
        const r = rows[this.sel];
        FT().wrap(open(this.sel) ? r.blurb : 'Get a star on ' + rows[this.sel - 1].name + ' first.', 70).forEach((l, k) => FT().draw(ctx, l, 166, 20 + k * 9, '#1c2a3a'));
        const D = G.sprites.dot.down[0], H = G.sprites.hannah.down[0];
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(H, 168, 92, 32, H.height * 2); ctx.drawImage(D, 204, 92, 32, D.height * 2);
        FT().draw(ctx, 'Z: start   X: done', 8, 148, '#5a6a7a');
      },
    };
  }

  // Charge Nurse Dot, back on the floor once MECHA-BABY is parked. With Hannah along, it's her shift.
  S.chargeNurse = function* () {
    const f = flags(), N = nicuState();
    if (!(yield* S.callIn('hannah', 'Oh no. That\'s my charge nurse.'))) {
      yield G.say('Charge Nurse Dot', 'Have you seen Hannah? She\'s on in five minutes. She is NEVER late.');
      return;
    }
    if (!f.nicuMet) {
      f.nicuMet = true;
      yield G.say('Charge Nurse Dot', 'Hannah. Where have you BEEN? The whole unit took a nap, somebody parked a robot in the corner, and you\'re on in five.');
      yield G.say('Hannah', 'I was... saving the world?');
      yield G.say('Charge Nurse Dot', 'Save it after your shift. Babies first. Always.');
      yield G.say('Hannah', 'Nate, want to see what I actually do all day? Stand by the door. Don\'t touch anything. I have to RUN.');
    } else yield G.say('Charge Nurse Dot', 'Back on the floor, Hannah? Good. They missed you.');
    for (;;) {
      const r = yield nicuMenuCmd();
      if (!r) { G.play.overlay = null; yield G.say('Charge Nurse Dot', 'Good work today. Go home and sleep, Hannah.'); return; }
      if (r.id === 'how') {
        // (the cards for every shift that's open)
        for (let i = 0; i < NICU_SHIFTS.length; i++) if (i === 0 || (N[NICU_SHIFTS[i - 1].id] && N[NICU_SHIFTS[i - 1].id].stars)) for (const [t, lines] of NICU_SHIFTS[i].how) yield howToCmd(t, lines, nicuBack);
        continue;
      }
      if (!f['nicuHow_' + r.id]) { f['nicuHow_' + r.id] = true; for (const [t, lines] of r.how) yield howToCmd(t, lines, nicuBack); }
      const res = yield shiftCmd(r);
      G.play.overlay = null;
      if (res === 'quit') { yield G.say('Charge Nurse Dot', 'Leaving in the middle of a shift? ...Fine. Go drink some water.'); continue; }
      const was = N[r.id] || { stars: 0, best: 0 }, i = NICU_SHIFTS.indexOf(r);
      N[r.id] = { stars: Math.max(was.stars, res.stars), best: Math.max(was.best, res.score) };
      yield G.say('Charge Nurse Dot', [
        'We\'ll talk about that one later. Again.',
        'Every baby made it. That\'s the job. Barely.',
        'Good shift. A couple of them waited too long, but good.',
        'Every baby happy. Every single one. That\'s my nurse.',
      ][res.stars]);
      if (!was.stars && res.stars && i < NICU_SHIFTS.length - 1) yield G.say(null, '{y}' + NICU_SHIFTS[i + 1].name + ': ' + NICU_SHIFTS[i + 1].title + '{/} is open!');
      if (i === NICU_SHIFTS.length - 1 && res.stars === 3 && was.stars < 3) yield G.say('Charge Nurse Dot', 'The night shift. Twins. Three stars. Hannah, when I retire, this unit is yours.');
      G.play.autosave();
    }
  };

  // ================================================================ CHKD, AFTER MECHA-BABY
  // Getting ready for the Number One Ditch (the user's picks): Hannah's first-aid kit (CHKD's
  // item, restocked at the supply closets), Ruby (a rock-collecting kid on the ward, an optional
  // side quest), and the roof at night, where the family decides to go together.
  // Flags: kitGot, roofSeen, rubyMet, rubyQ (0-3), rubyQuiz, rubyAsked, rubyTraded (the rock id),
  // rubyHeart.

  // ---------------------------------------------------------------- Hannah's first-aid kit
  S.kitGive = function* () {
    const f = flags(), s = G.state;
    if (f.kitGot) return;
    f.kitGot = true;
    s.items.firstAid = G.KIT_MAX;
    s.xItem = 'firstAid';
    yield G.itemGet(G.spr.firstAidIcon, 'You got {y}Hannah\'s First-Aid Kit{/}! It\'s on X: press it to patch Nate up for 3 hearts.');
    yield G.say('Hannah', 'Three patch-ups. When it runs out, restock it at a supply closet. There\'s one on every floor.');
    yield G.say('Hannah', 'And if I\'m standing RIGHT next to you, just ask me. That\'s literally my job.');
  };
  // (for a save from before the kit existed: Hannah remembers it the next time she's around)
  S.kitCatchUp = function* () {
    const f = flags();
    if (f.kitGot || !f.mobileBeaten || !G.state.party.includes('hannah')) return;
    yield G.wait(20);
    yield* S.callIn('hannah');
    yield G.say('Hannah', 'Oh! Nate, wait. I packed you something.');
    yield G.say(null, 'Hannah hands Nate a red zip bag: gauze, tape, ice packs and a whole box of dinosaur bandages.');
    yield* S.kitGive();
  };
  S.supplyCloset = function* (cabinet) {
    const f = flags(), s = G.state, what = cabinet ? 'supply cabinet' : 'supply closet';
    if (!f.kitGot) { yield G.say(null, 'A ' + what + ': gauze, tape, saline, a hundred things in little packets. Nate doesn\'t know what any of it is for.'); return; }
    if ((s.items.firstAid || 0) >= G.KIT_MAX) { yield G.say(null, 'The ' + what + '. Hannah\'s first-aid kit is already full.'); return; }
    s.items.firstAid = G.KIT_MAX;
    G.audio.sfx('heart');
    f.restock = ((f.restock || 0) + 1) % 3;
    yield G.say(null, 'Nate restocks the first-aid kit from the ' + what + '. Full again!');
    if (G.with('hannah')) yield G.say('Hannah', ['Take the good tape. Not that one. The GOOD tape.', 'Grab some extra ice packs. You\'re going to need them.', 'Leave the dinosaur bandages. ...Okay, take the dinosaur bandages.'][f.restock]);
  };

  // ---------------------------------------------------------------- the elevators
  S.nicuElevator = function* () {
    const p = P();
    const c = yield G.ask('Nate', 'The elevator. Where to?', ['Up to the roof', 'Down to the lobby', 'Stay']);
    if (c === 0) { G.audio.sfx('bell'); G.play.warp('chkdRoof', 2, 11, 'down'); return; }
    if (c === 1) { G.audio.sfx('bell'); G.play.warp('chkdLobby', 3, 4, 'down'); return; }
    yield G.walkTo(p, p.x, p.y - 14, 1);
  };
  S.roofElevator = function* () {
    const p = P();
    const c = yield G.ask('Nate', 'The elevator. Where to?', ['Down to the NICU', 'Down to the lobby', 'Stay']);
    if (c === 0) { G.audio.sfx('bell'); G.play.warp('chkdNicu', 7, 9, 'up'); return; }
    if (c === 1) { G.audio.sfx('bell'); G.play.warp('chkdLobby', 3, 4, 'down'); return; }
    yield G.walkTo(p, p.x, p.y + 14, 1);
  };

  // ---------------------------------------------------------------- Ruby, the rock kid
  // Seven years old, a broken leg, an egg carton full of rocks. Nate is a geologist: a ROCK
  // doctor. She has three rocks she can't name; then she trades one of her two fairy stones
  // for a rock she doesn't have yet, and gives Nate her heart rock (a heart container).
  const RUBY_QUIZ = [
    {
      q: 'This white one fizzes when I put vinegar on it. Like soda!', opts: ['Calcite', 'Quartz', 'Pyrite'], a: 0,
      nate: 'Calcite. The vinegar eats away at it, and the fizz is carbon dioxide.', ruby: 'CALCITE. I\'m writing that down.',
    },
    {
      q: 'This one is GOLD. My dad says it\'s not gold. He\'s wrong, right?', opts: ['It\'s gold', 'It\'s pyrite', 'It\'s brass'], a: 1,
      nate: 'Sorry. It\'s pyrite: fool\'s gold. Real gold is soft, and it doesn\'t grow in perfect little cubes.', ruby: 'Fool\'s gold. ...I like it better anyway. It\'s a TRICKSTER.',
    },
    {
      q: 'And this black one sticks to my fridge magnet. Is it magic?', opts: ['It\'s magic', 'It\'s obsidian', 'It\'s magnetite'], a: 2,
      nate: 'It\'s magnetite. Iron ore. It has so much iron in it that magnets stick to it.', ruby: 'Magnetite. ...That\'s basically magic.',
    },
  ];
  // she already has these (the quiz rocks), and the fairy stones
  const RUBY_HAS = ['calcite', 'pyrite', 'magnetite', 'quartz', 'fairystone'];
  const RUBY_WOW = {
    andover: 'From an old iron MINE? In NEW JERSEY? Were there BATS?',
    lafayette: 'From a COLLEGE? In PENNSYLVANIA? Rocks go to COLLEGE?',
    easton: 'From a FAIR? Did it go on the rides?',
    bedminster: 'From your HOUSE? In New Jersey? That\'s so far!',
    bay: 'A SHARK TOOTH. A MEGALODON shark tooth. I\'m going to scream. ...I\'m screaming on the inside.',
    chesapeake: 'The Virginia STATE FOSSIL?! I\'ve only ever seen it in my BOOK!',
  };
  S.rubyDoor = function* () {
    const f = flags();
    if (!f.mobileBeaten) { yield G.say(null, 'A patient room. Somebody drew a dinosaur on the whiteboard. It has spiral eyes.'); return; }
    if (!f.rubyMet) yield G.say(null, 'A patient room. A little voice from inside: "Is that a ROCK HAMMER?"');
    G.audio.sfx('door');
    G.play.warp('chkdRoom', 5, 7, 'up');
  };
  S.ruby = function* () {
    const f = flags();
    if (f.rubyHeart) {
      f.rubyLine = ((f.rubyLine || 0) + 1) % 4;
      yield G.say('Ruby', [
        'My carton is FULL. That has never happened before.',
        'When my leg gets better, I\'m going to the Number One Ditch. My mom says it\'s just a ditch. My mom is wrong.',
        'Rock doctor! Come back and visit. Bring rocks.',
        'Did you know my fairy stones are fairy TEARS? That\'s why I don\'t cry. I have rocks for that.',
      ][f.rubyLine]);
      return;
    }
    if (!f.rubyMet) {
      f.rubyMet = true;
      yield G.say('Ruby', 'Is that a ROCK HAMMER? Are you a DOCTOR?');
      yield G.say('Nate', 'I\'m a geologist.');
      yield G.say('Ruby', 'A ROCK doctor?!');
      yield G.say('Nate', '...Yes. I am a rock doctor.');
      yield G.say('Ruby', 'I\'m Ruby. I broke my leg climbing up the jungle gym to get a rock off the very top.');
      yield G.say('Ruby', 'I got the rock, though.');
      yield G.say(null, 'Ruby holds up an egg carton. There\'s a rock in every cup but one.');
      yield G.say('Ruby', 'This is my collection. But three of them don\'t have names. My rock book doesn\'t have PICTURES.');
      yield G.say('Ruby', 'Can you tell me what they are, rock doctor?');
    }
    // three rocks with no names (a wrong answer ends the visit; she'll ask again next time)
    if (!f.rubyQuiz) {
      for (let i = f.rubyQ || 0; i < RUBY_QUIZ.length; i++) {
        const q = RUBY_QUIZ[i];
        const c = yield G.ask('Ruby', q.q, q.opts);
        if (c !== q.a) {
          f.rubyMiss = ((f.rubyMiss || 0) + 1) % 3;
          yield G.say('Ruby', ['Hmm. My rock book says no.', 'Are you SURE you\'re a rock doctor?', 'That\'s what my DAD said.'][f.rubyMiss]);
          yield G.say('Ruby', 'Think about it, rock doctor. I\'ll be right here. (Obviously.)');
          return;
        }
        yield G.say('Nate', q.nate);
        yield G.say('Ruby', q.ruby);
        f.rubyQ = i + 1;
      }
      f.rubyQuiz = true;
      yield G.say('Ruby', 'You really ARE a rock doctor.');
    }
    if (!f.rubyTraded) {
      yield* S.rubyTrade();
      if (!f.rubyTraded) return;
    }
    yield* S.rubyHeart();
  };
  S.rubyTrade = function* () {
    const f = flags(), s = rockState();
    if (!f.rubyAsked) {
      f.rubyAsked = true;
      yield G.say('Ruby', 'Okay. Rock doctor. I have a deal for you.');
      yield G.say(null, 'Ruby holds up two little brown stones. Each one is shaped like a tiny cross.');
      yield G.say('Ruby', 'Fairy stones! I have TWO. My grandma says they\'re lucky.');
      yield G.say('Ruby', 'I\'ve never been anywhere but here and my house. Give me a rock from somewhere I\'ve never been, and you can have one.');
      yield G.say('Nate', 'That\'s... everywhere.');
      yield G.say('Ruby', 'EXACTLY. And not one I already have. It\'s for the empty cup.');
    }
    const owned = G.ROCKS.filter((r) => !RUBY_HAS.includes(r.id) && (s.rocks[r.id] || 0) > 0);
    if (!owned.length) {
      yield G.say('Nate', 'I don\'t have anything on me she doesn\'t already have. ...A geologist with no rocks.');
      yield G.say('Ruby', 'That\'s okay. I\'m not going anywhere.');
      yield G.say(null, 'Ruby knocks on her cast. (Any rock she doesn\'t have will do: from Lafayette, the fair, home, the mines, the Bay...)');
      return;
    }
    const c0 = yield G.ask('Ruby', 'Trade me a rock for a fairy stone?', ['Pick a rock', 'Not yet']);
    if (c0 !== 0) { yield G.say('Ruby', 'I\'ll be right here. Obviously.'); return; }
    // pick one (by rarity first, when there are lots: like the jaw crusher)
    let pick = owned;
    if (owned.length > 7) {
      const tiers = [...new Set(owned.map((r) => r.r))].sort();
      const t = yield G.ask('Nate', 'Which rocks?', tiers.map((r) => RARITY[r].name).concat('Never mind'));
      if (t >= tiers.length) return;
      pick = owned.filter((r) => r.r === tiers[t]);
    }
    const i = yield* pickFrom('Nate', 'Give Ruby which one?', pick.map((r) => r.name + ' x' + G.sayable(s.rocks[r.id])));
    if (i < 0) return;
    const rock = pick[i];
    // the precious ones, he has to think about
    if (rock.r >= 3 && s.rocks[rock.id] === 1) {
      yield G.say('Nate', rock.id === 'megalodon' ? '...It\'s my only megalodon tooth.' : rock.id === 'cannonball' ? '...It belongs in a museum.' : '...It\'s my only one.');
      const c = yield G.ask('Nate', 'Give it to her anyway?', ['Give it to her', 'Keep it']);
      if (c !== 0) return;
      if (rock.id === 'cannonball') yield G.say('Nate', '...She\'d make a pretty good museum.');
    }
    s.rocks[rock.id]--;
    f.rubyTraded = rock.id;
    yield G.say(null, 'Nate gives Ruby his ' + rock.name + '.');
    yield G.say('Ruby', RUBY_WOW[rock.area] || 'From somewhere I\'ve NEVER been!');
    yield G.say(null, 'Ruby tucks it into the empty cup. For the first time ever, the carton is full.');
    yield G.say('Ruby', 'A deal\'s a deal.');
    yield* S.rockGive('fairystone');
  };
  S.rubyHeart = function* () {
    const f = flags(), s = G.state;
    if (f.rubyHeart) return;
    yield G.say('Ruby', 'Rock doctor? Can I ask you something?');
    yield G.say('Ruby', 'Everybody in the whole hospital was asleep standing up today. The nurses said a bad egg did it.');
    yield G.say('Nate', '...Father Eggmas.');
    yield G.say('Ruby', 'Are you going to go get him?');
    yield G.say('Nate', 'Yeah. We are.');
    yield G.say(null, 'Ruby digs around under her pillow and holds out a smooth, pinkish-gray stone shaped like a heart, with a white stripe all the way around it.');
    yield G.say('Ruby', 'My heart rock. My grandma found it at the beach. If the stripe goes ALL the way around, it\'s a wishing rock.');
    yield G.say('Ruby', 'I already used my wish. I wished my leg would get better. ...It\'s getting better.');
    yield G.say('Ruby', 'You take it. For being brave.');
    s.maxHp += 2; s.hp = s.maxHp;
    f.rubyHeart = true;
    G.audio.sfx('heart');
    yield G.itemGet(G.spr.heartRock, 'You got Ruby\'s heart rock! It\'s a {r}Heart Container{/}! Max hearts +1.');
    yield G.say('Nate', 'Thank you, Ruby.');
    yield G.say('Ruby', 'Bring it back, okay? After.');
    yield G.say(null, 'On his way out, Nate signs her cast: a little rock hammer, and GET WELL SOON. -THE ROCK DOCTOR.');
  };

  // ---------------------------------------------------------------- the roof
  // Hannah takes everyone up to the helipad. Out past the city, toward Chesapeake, the sky is
  // glowing purple over the Number One Ditch, and it's snowing over just that one spot. Mom and
  // Dad see it on the news, and the family decides: they go together.
  const ROOF_SPOT = { doron: 7.2, lily: 9.2, hannah: 13.4, abe: 15.4 };   // along the ledge (Nate at 11.3)
  const ROOF_GLOW = { x: 13.6 * 16, y: 76 };                              // the glow, on the horizon
  const ROOF_PAD = { x: 10.5 * 16, y: 12 * 16 };                          // the middle of the helipad
  // someone steps out of the elevator after a moment, then walks a path
  const stepOut = (n, delay, pts) => n && ({
    start() { this.t = 0; this.i = 0; this.cmd = null; },
    update() {
      if (this.t++ < delay) return false;
      n.hidden = false;
      if (!this.cmd) {
        if (this.i >= pts.length) return true;
        this.cmd = G.walkTo(n, pts[this.i][0], pts[this.i][1], 1.5); this.cmd.start(); this.i++;
      }
      if (this.cmd.update()) this.cmd = null;
      return false;
    },
  });
  // a slow camera pan, from one point to another
  const panTo = (x0, y0, x1, y1, n) => ({
    start() { this.t = 0; },
    update() { const k = Math.min(1, ++this.t / n), e = k * k * (3 - 2 * k); G.play.camFocus = { x: x0 + (x1 - x0) * e, y: y0 + (y1 - y0) * e }; return this.t >= n; },
  });
  S.roofEnter = function* () {
    if (!flags().roofSeen) yield* S.roofScene();
  };
  S.roofScene = function* () {
    const f = flags(), w = G.play.world, p = P(), fam = w.roofFam, here = (id) => !!fam[id];
    G.audio.sfx('bell');
    yield G.wait(30);
    // everybody steps out of the elevator behind Nate, Hannah first
    yield G.walkTo(p, 3 * 16 + 4, 12 * 16 + 6, 1.2);
    const door = [2 * 16 + 8, 11 * 16 + 10];
    yield G.together(
      stepOut(fam.hannah, 0, [door, [5.4 * 16, 12 * 16]]),
      stepOut(fam.abe, 26, [door, [4.4 * 16, 13.6 * 16]]),
      stepOut(fam.lily, 50, [door, [6.2 * 16, 13.4 * 16]]),
      stepOut(fam.doron, 74, [door, [7.2 * 16, 12.6 * 16]]),
    );
    p.dir = 'right';
    yield G.wait(20);
    if (here('hannah')) yield G.say('Hannah', 'This is where I come on my breaks. When it\'s been a long night.');
    if (here('doron')) {
      yield G.say('Doron', 'There\'s a HELIPAD up here?');
      if (here('hannah')) yield G.say('Hannah', 'The helicopter brings us babies from all over. Tiny ones. They\'re so brave.');
    }
    if (here('lily')) yield G.say('Lily', 'It\'s so quiet up here.');
    if (here('hannah')) yield G.say('Hannah', 'Come here. All of you. Look.');
    // everyone goes over to the ledge
    const y = 8 * 16 + 12;
    yield G.together(G.walkTo(p, 11.3 * 16, y, 1.2), ...Object.keys(fam).map((id) => G.walkTo(fam[id], ROOF_SPOT[id] * 16, y, 1.2)));
    p.dir = 'up';
    for (const n of Object.values(fam)) n.dir = 'up';
    yield G.wait(20);
    // the view (the camera keeps the family along the bottom, above the text)
    yield panTo(p.x, p.y - 12, p.x + 8, 110, 150);
    yield G.wait(40);
    yield G.say(null, 'The whole city is lit up below them. The river. The bridge. Downtown.');
    yield G.say(null, 'And way out past all of it, toward Chesapeake...');
    yield panTo(p.x + 8, 110, ROOF_GLOW.x - 12, 104, 80);
    yield G.wait(40);
    yield G.say(null, '...the sky is glowing purple.');
    if (here('lily')) yield G.say('Lily', 'Nate. What IS that?');
    if (here('abe')) yield G.say('Abe', 'That\'s south. That\'s right about where... the Number One Ditch is.');
    if (here('doron')) yield G.say('Doron', 'Is it SNOWING over there?');
    if (here('hannah')) yield G.say('Hannah', 'Only there. Look. Not one flake anywhere else.');
    yield G.wait(70);
    yield G.say(null, 'On the wind, very faint:');
    G.audio.sfx('hohoho');
    yield G.wait(50);
    yield G.say(null, 'ho... ho... ho...');
    if (here('lily')) yield G.say('Lily', 'I don\'t like it.');
    yield G.say('Nate', 'He\'s waiting for us.');
    yield G.wait(30);
    if (here('hannah')) {
      yield G.say('Hannah', 'When a baby\'s having a hard night, I come up here and look at all the lights.');
      yield G.say('Hannah', 'And I think: every one of those lights is somebody\'s family.');
      if (here('abe')) yield G.say('Abe', '...And he wants ours.');
    }
    yield G.wait(30);
    // Mom and Dad saw it on the news
    G.audio.sfx('buzz');
    yield G.say(null, 'Nate\'s phone buzzes. And buzzes.');
    yield G.say(null, '{c}~ FAMILY GROUP CHAT ~{/}');
    yield G.text('Michelle', 'Are you kids seeing this?? It\'s on the NEWS.');
    yield G.text('Michelle', 'A purple light over Chesapeake. And SNOW. In one spot. The weatherman is just staring at it.');
    yield G.text('Dad', 'It\'s him.');
    yield G.text('Dad', 'Your mother and I are getting in the car.');
    yield G.text('Michelle', 'We are IN the car. Your father is driving. Pray for us.');
    yield G.text('Dad', 'Nobody goes to that ditch alone. Not this time.');
    yield G.text('Dad', 'We go together. All of us.');
    yield G.camFocus(p.x + 8, 110, 30);
    yield G.wait(20);
    yield G.say('Nate', '...You heard Dad.');
    for (const [id, line] of [['doron', 'Together.'], ['lily', 'Together.'], ['abe', 'Together.'], ['hannah', 'Together. ...And everybody gets a checkup first.']]) {
      if (!here(id)) continue;
      fam[id].dir = id === 'doron' || id === 'lily' ? 'right' : 'left';
      yield G.say(G.PARTY_INFO[id].name, line);
    }
    yield G.text('Nate', 'together');
    yield G.text('Michelle', 'Together. And wear a HELMET.');
    G.audio.play('title');
    yield G.camFocus(ROOF_GLOW.x - 12, 104, 50);
    for (const n of Object.values(fam)) n.dir = 'up';
    p.dir = 'up';
    yield G.wait(40);
    f.roofSeen = true;
    yield G.banner('TOGETHER', 'the Number One Ditch is waiting', 200);
    yield G.camFocus(null, null, 30);
    G.play.autosave();
  };
  // up on the roof, after: everybody's at the ledge, still looking
  S.roofTalk = (id) => function* () {
    const f = flags();
    if (id === 'hannah') { yield* S.hannahCheckup(); return; }
    const k = 'roof_' + id;
    f[k] = ((f[k] || 0) + 1) % 2;
    yield G.say(G.PARTY_INFO[id].name, {
      doron: ['I\'ve been in the Army. I\'ve seen weird weather. I have never seen weather THAT specific.', 'When Mom and Dad get here, we roll out. Leg day can wait. ...Leg day can WAIT.'],
      lily: ['It\'s pretty. I hate that it\'s pretty.', 'Mom just texted me separately. Just a heart. ...She\'s scared too.'],
      abe: ['You can see the whole river from up here. And our condo. ...And the Ditch.', 'Romulus is going to be SO mad we left him home for this.'],
    }[id][f[k]]);
  };

  // the view off the edge of the roof (painted over the sky tiles): the night sky and a thin
  // moon, the far shore with the purple glow over the Ditch (and a low cloud snowing on just
  // that one spot), the river with the glow in it, the bridge, downtown, and the treetops and
  // streetlights right below
  function roofView(w) {
    const SKY = ['#05051a', '#06061c', '#08081f', '#0a0a24', '#0d0c29', '#110f2e', '#161334', '#1b173a'];
    // [x, width, height] (downtown is tall on the left; it's low out toward the glow)
    const TOWERS = [[4, 14, 46], [20, 10, 34], [32, 18, 60], [52, 12, 44], [66, 20, 68], [88, 14, 52], [104, 10, 36], [116, 16, 56], [134, 12, 42], [148, 18, 48],
      [170, 14, 26], [186, 10, 16], [198, 16, 12], [216, 12, 10], [230, 18, 14], [250, 14, 24], [266, 18, 40], [286, 12, 34], [300, 18, 50]];
    return {
      img: null, x: 0, y: 0, flat: true, base: -2,
      draw(ctx, cx, cy) {
        const t = G.tick, gx = ROOF_GLOW.x, gy = ROOF_GLOW.y, W = w.pw;
        const R = (x, yy, ww, hh, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x) - cx, Math.round(yy) - cy, ww, hh); };
        // the sky, the stars (a few twinkle), and a thin moon
        for (let i = 0; i < SKY.length; i++) R(0, i * 9, W, 9, SKY[i]);
        R(0, 72, W, 40, '#1b173a');
        for (let i = 0; i < 70; i++) {
          if ((t + i * 53) % 260 < 5) continue;
          R(G.hash(i, 1, 301) * W, G.hash(i, 2, 301) * 62, 1, 1, G.hash(i, 3, 301) < 0.25 ? '#f8f8ff' : '#7a78a8');
        }
        for (let yy = -5; yy <= 5; yy++) for (let xx = -5; xx <= 5; xx++) if (xx * xx + yy * yy <= 25 && (xx - 3) ** 2 + (yy + 1) ** 2 > 22) R(44 + xx, 18 + yy, 1, 1, '#e8e4c8');
        // the glow over the Ditch (it breathes)
        const pulse = 0.82 + Math.sin(t * 0.025) * 0.18;
        ctx.save();
        const g = ctx.createRadialGradient(gx - cx, gy - cy, 1, gx - cx, gy - cy, 66);
        g.addColorStop(0, 'rgba(248,200,255,' + Math.min(1, pulse).toFixed(3) + ')');
        g.addColorStop(0.22, 'rgba(184,100,244,' + (0.6 * pulse).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(70,20,130,0)');
        ctx.fillStyle = g; ctx.fillRect(gx - 66 - cx, gy - 66 - cy, 132, 72);
        ctx.restore();
        // a faint pillar of light up from the Ditch to a low cloud, lit purple from underneath,
        // that snows on just that one spot
        const CY = 38;
        ctx.save();
        ctx.globalAlpha = 0.1 + pulse * 0.06; ctx.fillStyle = '#c890ff'; ctx.fillRect(gx - 14 - cx, CY - cy, 28, gy - CY);
        ctx.globalAlpha = 0.08; ctx.fillRect(gx - 24 - cx, CY + 4 - cy, 48, gy - CY - 4);
        ctx.restore();
        for (let yy = -5; yy <= 5; yy++) {
          const half = Math.round(Math.sqrt(1 - (yy / 5.5) ** 2) * 30);
          R(gx - half + Math.round(Math.sin(t * 0.01 + yy) * 1.5), CY + yy, half * 2, 1, yy >= 3 ? (pulse > 0.9 ? '#7a50b0' : '#6a449c') : yy >= 1 ? '#3e2c66' : '#241c3e');
        }
        for (let i = 0; i < 60; i++) {
          const sp = 0.1 + G.hash(i, 5, 301) * 0.12, yy = CY + 5 + (G.hash(i, 6, 301) * 60 + t * sp) % (gy - CY - 5);
          const x = gx + (G.hash(i, 4, 301) * 2 - 1) * 24 + Math.sin((t + i * 40) * 0.03) * 2;
          ctx.globalAlpha = Math.min(1, (yy - CY - 5) / 6);
          R(x, yy, i % 7 ? 1 : 2, i % 7 ? 1 : 2, i % 3 ? '#ece4ff' : '#ffffff');
        }
        ctx.globalAlpha = 1;
        // the far shore (Chesapeake): flat and dark, a few lights
        R(0, gy, W, 5, '#0e0c1e');
        for (let i = 0; i < 26; i++) R(G.hash(i, 7, 301) * W, gy + 1 + Math.floor(G.hash(i, 8, 301) * 3), 1, 1, G.hash(i, 9, 301) < 0.5 ? '#c8a868' : '#a8a8c8');
        // the river, with the glow in it, and the bridge across it
        R(0, gy + 5, W, 13, '#10183a');
        for (let k = 0; k < 6; k++) {
          const ww = 18 - k * 2 + Math.round(Math.sin(t * 0.05 + k) * 2);
          R(gx - ww / 2 + Math.sin(t * 0.04 + k * 2) * 2, gy + 6 + k * 2, ww, 1, k < 3 ? '#9a68d8' : '#5a3a98');
        }
        for (let i = 0; i < 18; i++) {
          const x = G.hash(i, 10, 301) * W;
          if (Math.abs(x - gx) < 16) continue;
          R(x, gy + 8 + Math.floor(G.hash(i, 11, 301) * 8), 2 + (((t >> 4) + i) % 2), 1, '#5a5a48');
        }
        R(0, gy + 13, W, 1, '#2a2a44');
        for (let x = 3; x < W; x += 9) R(x, gy + 12, 1, 1, '#f8e8b0');
        // downtown
        for (const [x, tw, th] of TOWERS) {
          const top = 108 - th;
          R(x, top, tw, th, '#141228'); R(x, top, 1, th, '#1e1a38');
          for (let wy = top + 3; wy < 104; wy += 3) for (let wx = x + 2; wx < x + tw - 1; wx += 3) {
            const h = G.hash(wx, wy, 303);
            if (h < 0.34) R(wx, wy, 1, 1, h < 0.08 ? '#a8c0f0' : '#f0c870');
          }
          if (th > 44) R(x + (tw >> 1), top - 1, 1, 1, ((t >> 5) + x) % 2 ? '#f83838' : '#5a1818');
        }
        // the treetops and streetlights right below the hospital
        R(0, 104, W, 8, '#070a10');
        for (let i = 0; i < 44; i++) {
          const x = i * 7.5 + G.hash(i, 12, 301) * 5, r = 2 + Math.floor(G.hash(i, 13, 301) * 3);
          R(x - r, 104 - r + 1, r * 2, r, '#0a1014');
        }
        for (let x = 5; x < W; x += 21) { R(x, 107, 1, 1, '#f8b858'); R(x - 1, 108, 3, 1, '#3a2a18'); }
      },
    };
  }

  // Ruby's room (behind the green door on the ward): her bed by the window, her cast, her egg
  // carton of rocks, get-well balloons, and a whiteboard with her dinosaur on it
  G.MAPS.chkdRoom = {
    name: 'CHKD: Ruby\'s Room',
    get music() { return 'house'; },
    tiles() {
      const W = 12, H = 9;
      const g = Array.from({ length: H }, () => Array(W).fill('w'));
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) g[y + j][x + i] = c; };
      fill(1, 1, 10, 2, CW); fill(1, 3, 10, 5, CF);
      g[8][5] = 'x';
      return g.map((r) => r.join(''));
    },
    setup(w) {
      const F = furnish(w), sp = G.spr;
      F.hang(sp.kidWhiteboard, 1, 2, 2, look('Ruby\'s whiteboard: her name, and a green dinosaur. This morning it had spiral eyes. Somebody fixed them.'), 7);
      F.hang(sp.roomWindow, 6, 2, 3, look('The window. It\'s dark out. Down there, the whole city is waking up from a very long nap.'), 8);
      F.hang(sp.wallTV, 10, 2, 1, look('Cartoons. A dog and a cat are arguing about a sandwich.'), 14);
      F.stand(sp.rockBooksStand, 3, 3, 1, look('A stack of rock books ("ROCKS!", "My First Rock Book", "ROCKS 2"), and a magnifying glass.'));
      F.stand(sp.ivPole, 6, 3, 1, look('An IV pole. Ruby stuck a googly eye on it. Its name is Steve.'));
      F.stand(sp.recliner, 9, 4, 1, look('A chair that folds out into a bed, for Ruby\'s mom. A blanket, a phone charger, a half-eaten granola bar.'));
      F.stand(sp.getWellBalloons, 10, 4, 1, look('Get-well balloons. The heart one is losing a little air.'));
      // the bed: the frame, then Ruby sitting up in it, then the blanket over her legs
      w.blockTiles(4, 3, 2, 3);
      w.props.push({
        img: null, x: 4 * 16, y: 6 * 16 - 54, base: 6 * 16 - 1, hit: [4 * 16, 3 * 16, 6 * 16, 6 * 16], talk: () => S.ruby(),
        draw(ctx, cx, cy) {
          const x = this.x - cx, y = this.y - cy, kid = G.sprites.rockKid;
          ctx.drawImage(G.spr.bedBack, x, y);
          ctx.drawImage(kid.down[0], x + 8, y + 27 - kid.h);
          ctx.drawImage(G.spr.bedFront, x, y);
        },
      });
      w.addWarp(5, 8, 1, 1, 'chkdWard', 11, 3, 'down');
    },
  };

  // The roof, at night: the helipad, the little penthouse over the elevator, an air handler, a
  // windsock, and the ledge all the way around. Off the top edge: the view (above).
  const RD = 'ä', RS = 'ö', RL = 'ë';
  G.MAPS.chkdRoof = {
    name: 'CHKD: the Roof',
    // (the whole family's up here in person)
    noFollower: true,
    music: 'roof',
    tiles() {
      const W = 20, H = 17;
      const g = Array.from({ length: H }, () => Array(W).fill(RL));
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) g[y + j][x + i] = c; };
      fill(0, 0, W, 7, RS);
      fill(1, 8, W - 2, 8, RD);
      return g.map((r) => r.join(''));
    },
    setup(w) {
      const sp = G.spr, f = flags();
      w.props.push(roofView(w));
      // the camera leans up near the ledge, to take in the view
      w.camLean = (p) => G.clamp(70 - (p.y - 8 * 16) * 0.7, 0, 64);
      w.props.push({ img: sp.helipad, x: ROOF_PAD.x - 44, y: ROOF_PAD.y - 44, flat: true, base: 0 });
      w.props.push({ img: null, x: 0, y: 0, base: 0, hit: [ROOF_PAD.x - 20, ROOF_PAD.y - 20, ROOF_PAD.x + 20, ROOF_PAD.y + 20], talk: look('The helipad. The helicopter brings babies here from all over. Tonight it\'s just the family, and the wind.') });
      // the penthouse over the elevator (the door works the elevator)
      w.addProp({ img: sp.roofAccess, tx: 1, ty: 8, h: 3 });
      w.blockTiles(1, 9, 3, 2);
      w.block[10 * w.w + 2] = 0;
      w.addTrigger(2, 10, 1, 1, () => G.script.run(S.roofElevator()));
      // the air handler (its fan going), the windsock, vents
      w.props.push({
        img: sp.hvacUnit[0], x: 15 * 16, y: 15 * 16 - 30, base: 15 * 16 - 1, hit: [15 * 16, 14 * 16, 18 * 16, 15 * 16], talk: look('A big air handler. It hums. It\'s the only sound up here besides the wind.'),
        draw(ctx, cx, cy) { ctx.drawImage(G.spr.hvacUnit[(G.tick >> 2) % 3], this.x - cx, this.y - cy); },
      });
      w.blockTiles(15, 14, 3, 1);
      w.props.push({
        img: sp.windsock[0], x: 18 * 16 + 1, y: 9 * 16 - 36, base: 9 * 16 - 1, hit: [18 * 16, 8 * 16, 19 * 16, 9 * 16], talk: look('The windsock. The wind is blowing from the south. From the Ditch.'),
        draw(ctx, cx, cy) { ctx.drawImage(G.spr.windsock[(G.tick >> 4) % 2], this.x - cx, this.y - cy); },
      });
      w.blockTiles(18, 8, 1, 1);
      for (const [x, y] of [[5, 15], [16, 11]]) w.addProp({ img: sp.roofVent, tx: x, ty: y, dx: 3, solid: [x, y, 1, 1] });
      // the ledge: looking out
      w.props.push({ img: null, x: 0, y: 0, base: 0, hit: [16, 7 * 16, w.pw - 16, 8 * 16], talk: function* () {
        yield G.say(null, flags().roofSeen ? 'The purple glow over the Number One Ditch. The snow is still falling, right there and nowhere else.' : 'The city, lit up for miles.');
      } });
      // the family, out at the ledge (or still in the elevator, before the scene)
      const fam = w.roofFam = {}, seen = !!f.roofSeen;
      for (const id of ['doron', 'lily', 'hannah', 'abe']) {
        if (!G.state.party.includes(id)) continue;
        const npc = w.add(new G.NPC({ sprite: id, name: G.PARTY_INFO[id].name, x: seen ? ROOF_SPOT[id] * 16 : 2 * 16 + 8, y: seen ? 8 * 16 + 12 : 10 * 16 + 12, dir: seen ? 'up' : 'down', talk: S.roofTalk(id) }));
        if (!seen) npc.hidden = true;
        fam[id] = npc;
      }
      // the night, and the lights: the helipad's ring (green), red beacons on the corners of the
      // ledge, the lamp over the elevator door
      w.props.push({
        img: null, x: 0, y: 0, base: 99990,
        draw(ctx, cx, cy) {
          const t = G.tick, top = Math.max(0, 7 * 16 - cy);
          ctx.save();
          ctx.globalAlpha = 0.34; ctx.fillStyle = '#0a0620'; ctx.fillRect(0, top, G.W, G.H - top);
          const glow = (x, yy, r, c, a) => { ctx.globalAlpha = a; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x - cx, yy - cy, r, 0, Math.PI * 2); ctx.fill(); };
          for (let i = 0; i < 16; i++) {
            const a = (i / 16) * Math.PI * 2, x = Math.round(ROOF_PAD.x + Math.cos(a) * 42), yy = Math.round(ROOF_PAD.y + Math.sin(a) * 42), on = (i + (t >> 4)) % 8 !== 0;
            glow(x, yy, 3, '#58f878', on ? 0.22 : 0.06);
            ctx.globalAlpha = 1; ctx.fillStyle = on ? '#b8ffc8' : '#2a5a38'; ctx.fillRect(x - cx, yy - cy, 1, 1);
          }
          const blink = t % 100 < 50;
          for (const [x, yy] of [[8, 117], [w.pw - 8, 117], [8, w.ph - 11], [w.pw - 8, w.ph - 11]]) {
            if (blink) glow(x, yy, 5, '#f83838', 0.28);
            ctx.globalAlpha = 1; ctx.fillStyle = blink ? '#ff6a6a' : '#5a1c1c'; ctx.fillRect(x - 1 - cx, yy - 1 - cy, 2, 2);
          }
          glow(40, 148, 12, '#f8e8a0', 0.14);
          glow(40, 148, 5, '#f8e8a0', 0.2);
          ctx.restore();
        },
      });
    },
    onEnter() { return S.roofEnter(); },
  };

  // ================================================================ THE FINALE: the Number One Ditch
  // (The user's design; not connected to the story yet: get here with the admin checkpoints.)
  // Father Eggmas sits on a throne of egg cartons at the culvert end of the ditch. He
  // possesses the whole family, and Nate has to fight them one at a time, in order: Doron,
  // Dad, Lily, Mom, Abe, Hannah. Each one, freed, hugs him (a heart back) and sits on the bank;
  // Abe teaches him Nice Crack on Dad's pipe; Hannah patches him all the way up. Then the
  // relay: every one of them takes a turn against Father Eggmas with their own move (Doron
  // throws rocks, Dad shouts EEENGLISH, Lily says "No.", Mom fires Henrietta's eggs, Abe
  // reaches up and bonks him (and Lily: "Nice crack, Abe!"), Hannah throws ice packs), and
  // Nate goes last: egg tennis, then Nice Crack.
  // Flags: fin_intro, fin_freed (0-7), fin_relay (whose turn, 0-7), fin_done, signal_crack.
  // (Romulus came with Abe and Hannah: he's fought between them, and takes a turn in the relay)
  const FIN_ORDER = ['doron', 'dad', 'lily', 'michelle', 'abe', 'romulus', 'hannah'];
  const FIN_NAME = { nate: 'Nate', doron: 'Doron', dad: 'Dad', lily: 'Lily', michelle: 'Michelle', abe: 'Abe', romulus: 'Romulus', hannah: 'Hannah' };
  const FIN_TITLE = { nate: 'NATE', doron: 'DORON', dad: 'DAD', lily: 'LILY', michelle: 'MOM', abe: 'ABE', romulus: 'ROMULUS', hannah: 'HANNAH' };
  // where everybody sits on the banks once they're free (tiles); the lineup by the throne
  const FIN_SEAT = { doron: [0, 6], dad: [0, 9], lily: [0, 12], nate: [0, 15], michelle: [14, 6], abe: [14, 9], hannah: [14, 12], romulus: [14, 15] };
  const FIN_LINE = { doron: [3, 7], dad: [4.2, 7.8], lily: [5.4, 8.4], michelle: [9.6, 8.4], abe: [10.8, 7.8], hannah: [12, 7], romulus: [7.5, 9.2] };
  // (the bottom of the ditch stays clear of the boss's health bar)
  const FIN_BOUNDS = { x0: 2 * 16 + 12, y0: 7 * 16, x1: 13 * 16 - 12, y1: 16 * 16 };
  const MID = 7.5 * 16;
  for (const id of FIN_ORDER) if (G.CAST[id]) G.CAST[id + 'Possessed'] = Object.assign({}, G.CAST[id], { swirl: true, smile: null, blush: false });
  // a family member at the Ditch (Romulus is a dog: G.DogNPC); possessed: spiral eyes / glowing purple
  const finNew = (w, id, o = {}) => {
    const base = Object.assign({ name: FIN_NAME[id], dir: 'down' }, o);
    if (id === 'romulus') return w.add(new G.DogNPC(base));
    return w.add(new G.NPC(Object.assign(base, { sprite: o.possessed ? id + 'Possessed' : id })));
  };
  const possess = (npc, id) => { if (npc instanceof G.DogNPC) npc.possessed = true; else npc.sprite = id + 'Possessed'; };

  const finFam = (w) => (w.finFam = w.finFam || {});
  const finSeatXY = (id) => [FIN_SEAT[id][0] * 16 + 8, FIN_SEAT[id][1] * 16 + 12];
  // everybody's attacks and leftovers, cleared off the ditch
  G.finClear = (w) => {
    for (const e of w.ents) {
      if (e instanceof G.Lob || e instanceof G.BarkRing || e instanceof G.HypnoShot || e instanceof G.HypnoRing || e instanceof G.EnemyNo || e instanceof G.FinBalloon
        || e instanceof G.HenMinion || e instanceof G.Snapdragon || e instanceof G.BeanBomb || e instanceof G.BandageStrip || e instanceof G.Letter || e instanceof G.Egglet
        || e instanceof G.GoldenEgg || e instanceof G.LightWire || e instanceof G.RelayShot || e instanceof G.LiftRock || e instanceof G.NoShot || e instanceof G.EggShot
        || (e.constructor && e.constructor.name === 'Shot')) {
        e.dead = true;
      }
    }
    G.play.earworm = 0;
    G.play.player.sticky = 0;
  };
  const finCheer = (w, text) => {
    for (const npc of Object.values(finFam(w))) if (npc && !npc.dead && npc.freed) w.pop(npc.x, npc.y - 28, text, '#f8f8f0');
  };

  // ---------------------------------------------------------------- the arrival
  S.finEnter = function* () {
    const f = flags();
    if (f.fin_done) return;
    if (!f.fin_intro) { yield* S.finIntro(); return; }
    if ((f.fin_freed || 0) < FIN_ORDER.length) { yield* S.finNextFight(true); return; }
    yield* S.finTurnStart(G.FIN_RELAY[f.fin_relay || 0], true);
  };
  S.finIntro = function* () {
    const f = flags(), w = G.play.world, p = P(), boss = w.eggmas, fam = finFam(w);
    // the family comes down the bank behind Nate
    yield G.wait(20);
    for (const [i, id] of FIN_ORDER.entries()) {
      const npc = fam[id];
      npc.hidden = false;
      G.play.player.dir = 'up';
      yield G.walkTo(npc, npc.x, npc.y - 18 - (i % 2) * 6, 2.2);
    }
    yield G.wait(20);
    yield G.say('Nate', 'The Number One Ditch.');
    yield G.say('Doron', 'Best ditch in the world.');
    yield G.say('Lily', '...Why is it covered in Christmas lights?');
    yield G.say('Michelle', 'Is that TINSEL? On the CATTAILS?');
    yield G.say('Hannah', 'It\'s snowing. In Chesapeake. That\'s not... that doesn\'t happen.');
    yield G.say(null, 'Romulus presses up against Hannah\'s legs. His hackles are up.');
    yield G.say('Abe', 'He wasn\'t going to stay home for this. Were you, buddy?');
    G.audio.sfx('hohoho');
    yield G.camFocus(boss.x, boss.y - 30, 70);
    yield G.say(null, 'HO. HO. HO.');
    yield G.say('Father Eggmas', 'Welcome, Andrews family... to the Number TWO Ditch.');
    yield G.say('Nate', 'It\'s the Number ONE Ditch. Apple Maps says so.');
    yield G.say('Father Eggmas', 'Apple Maps can be CHANGED, Nate.');
    yield G.say('Dad', 'Is that... the egg from our MANTEL?');
    yield G.say('Father Eggmas', 'Do you know what it\'s like up on that mantel? Smiling. Every December. For YEARS.');
    yield G.say('Father Eggmas', 'And then every January... back in the box. Back in the basement. In the DARK.');
    yield G.say('Abe', 'I mean... that\'s just how Christmas decorations work.');
    yield G.say('Father Eggmas', 'And YOU. Every Christmas, you chased the little one around the house with me.');
    yield G.say('Lily', '...He did.');
    yield G.say('Abe', 'That was a BIT.');
    yield G.say('Father Eggmas', 'So I thought... why be part of the family for one month a year...');
    G.audio.sfx('possess');
    yield G.say('Father Eggmas', '...when I can HAVE the family. Forever.');
    G.audio.play('possessed');
    yield G.camFocus(null, null, 30);
    // the possession: one at a time, the spiral gets them
    const goodbye = {
      doron: 'Nate... my legs... I can\'t move my LEGS...',
      dad: 'Son... run...',
      michelle: 'Nate! Wear a hel...',
      abe: 'Nate, quick ques...',
      romulus: '*whimper*',
      hannah: 'Nate, GO! Get out of h...',
    };
    for (const id of ['doron', 'dad', 'michelle', 'abe', 'romulus', 'hannah']) {
      const npc = fam[id];
      yield G.say(FIN_NAME[id], goodbye[id]);
      G.audio.sfx('possess'); G.play.shake(6, 2);
      w.burst(npc.x, npc.y - 20, ['#a85ae8', '#6a2a9a', '#f8f0ff'], 12, { speed: 1.4, up: 1, life: 24, size: 2 });
      possess(npc, id);
      yield G.wait(20);
    }
    yield G.say('Lily', 'Nate...');
    yield G.say('Lily', 'Nate, I\'m scared.');
    G.audio.sfx('possess'); G.play.shake(8, 2);
    w.burst(fam.lily.x, fam.lily.y - 20, ['#a85ae8', '#6a2a9a', '#f8f0ff'], 12, { speed: 1.4, up: 1, life: 24, size: 2 });
    fam.lily.sprite = 'lilyPossessed';
    yield G.wait(30);
    // they walk up the ditch and line up by his throne
    for (const id of FIN_ORDER) {
      const [lx, ly] = FIN_LINE[id], npc = fam[id];
      yield G.walkTo(npc, lx * 16, ly * 16, 2.4);
      npc.dir = 'down';
    }
    yield G.say('Nate', '...Let them go.');
    yield G.say('Father Eggmas', 'Every family needs a little fighting at Christmas. HO HO HO.');
    yield G.say('Nate', 'I\'m getting you all back. Every single one of you.');
    yield G.banner('THE NUMBER ONE DITCH', 'the final battle', 170);
    f.fin_intro = true; f.fin_freed = 0;
    G.play.autosave();
    yield* S.finNextFight(false);
  };

  // ---------------------------------------------------------------- the gauntlet
  const FIN_TAUNT = {
    doron: [['Father Eggmas', 'Doron. Go play with your little brother.'], ['Doron', 'LEG... DAY...']],
    dad: [['Father Eggmas', 'Christian. Show your son what EEENGLISH really means.'], ['Dad', 'Do you speak... EEENGLISH...?']],
    lily: [['Father Eggmas', 'Little one. Tell him how you feel.'], ['Lily', 'no. no. NO.']],
    michelle: [['Father Eggmas', 'Michelle. You put me in a box every January. Now put HIM in one.'], ['Michelle', 'Wear... a... helmet...']],
    abe: [['Father Eggmas', 'Abe. Ask him a question. You know the one.'], ['Abe', 'Quick... question...']],
    hannah: [['Father Eggmas', 'Nurse. He looks hurt. Go... HELP him.'], ['Hannah', 'This won\'t... hurt... a bit...']],
    romulus: [['Father Eggmas', 'Good boy. Now... SIC HIM.'], ['Nate', 'Romulus! Buddy! It\'s me!'], [null, 'Romulus\'s eyes glow purple. He growls. And he GROWS.'], ['Nate', 'I would NEVER hit a dog.'], ['Nate', '...But you HATE baths.']],
  };
  S.finNextFight = function* (resumed) {
    const f = flags(), w = G.play.world, p = P(), id = FIN_ORDER[f.fin_freed || 0], npc = finFam(w)[id];
    G.audio.play('possessed');
    yield G.wait(resumed ? 30 : 20);
    if (resumed) yield G.say('Father Eggmas', 'Back for more? HO HO HO.');
    for (const [who, text] of FIN_TAUNT[id]) yield G.say(who, text);
    // they come down into the ditch...
    yield G.walkTo(npc, MID, 10 * 16, 2);
    npc.dead = true;
    const b = w.add(id === 'romulus' ? new G.PossessedRomulus(npc.x, npc.y, FIN_BOUNDS) : new G.Possessed(id, npc.x, npc.y, FIN_BOUNDS));
    w.finBoss = b;
    if (id === 'romulus') {
      // the Portable Bidet, ready to go (and the trickle down the middle of the ditch fills it back up)
      const s = G.state;
      s.items.bidet = true; s.xItem = 'bidet'; s.items.bidetWater = G.BIDET_MAX;
      yield G.say(null, 'Spray him with the Portable Bidet (X)! The trickle of water down the middle of the ditch fills it back up.');
    }
    yield G.banner(b.name, 'possessed by Father Eggmas', 120);
    b.start();
  };
  // Dad, past half: the luchador mask goes back on
  S.finDadMask = function* (b) {
    yield G.wait(10);
    yield G.say(null, 'Dad pulls a luchador mask out of his blazer pocket.');
    yield G.say('Nate', 'Dad. No. Not again.');
    G.audio.sfx('bell');
    b.sprite = 'elenglish';
    G.play.world.burst(b.x, b.y - 40, ['#1c2c6c', '#e8e8f0', '#d03038'], 14, { speed: 1.4, up: 1, life: 22, size: 2 });
    yield G.say('Dad', 'EL... EEENGLISH... RETURNS!');
  };
  // Abe's favorite trap, mid-fight
  const FIN_QS = [
    ['How many legs does an insect have?', ['Six!', 'More than five.', 'Not answering that.']],
    ['How many strings on a guitar? You know this one.', ['Six!', 'Five plus one.', 'Ask me later.']],
    ['How many sides on a cube? QUICK!', ['Six!', 'A cube has... sides.', 'Nope.']],
    ['Half a dozen eggs. How many eggs is that?', ['Six!', 'Half a carton.', 'I see what you\'re doing.']],
  ];
  S.finAbeQuestion = function* (b) {
    const f = flags(), q = FIN_QS[(f.fin_q = (f.fin_q || 0) + 1) % FIN_QS.length];
    yield G.say('Abe', 'QUICK QUESTION, NATE!');
    const c = yield G.ask('Abe', q[0], q[1]);
    if (c === 0) {
      yield* S.slip();
      yield G.say('Abe', 'GOT HIM. Every single time.');
      b.toWalk(40);
    } else {
      yield G.say('Abe', '...He\'s learning.');
      b.open(110, 'Stunned! Hit him!');
    }
  };
  // freed, one at a time
  const FIN_FREED = {
    doron: [
      ['Doron', '...Nate?'], ['Doron', 'Did I just clothesline my little brother?'], ['Nate', 'Like four times.'],
      ['Doron', '...Sorry. My legs did it.'], ['Doron', 'Hey. Look at you, though. Taking on the whole family by yourself.'],
      ['Doron', 'Go get the rest of them. I\'ll be right here. Cheering. LOUDLY.'],
      [null, 'Doron gives Nate a hug. It\'s a lot of hug.'],
    ],
    dad: [
      ['Dad', '...Nate? Was I speaking EEENGLISH at you again?'], ['Nate', 'A whole lot of it.'], ['Dad', 'I\'m sorry, son.'],
      ['Dad', 'When I carved that pipe for you, I prayed you\'d never need it for something like this.'],
      ['Dad', 'I\'m proud of you. Peace be with you, Nate.'], ['Nate', '...And also with you.'],
      [null, 'Dad hugs Nate. His beard is scratchy. It always has been.'],
    ],
    lily: [
      ['Lily', '...Nate?'], ['Lily', 'I could hear him. In my head. The whole time.'],
      ['Lily', 'He\'s the scariest thing in the whole world. He always has been.'], ['Nate', 'I know.'],
      ['Lily', '...I said "No." to you. A LOT.'], ['Nate', 'They were really good "No."s.'], ['Lily', '...Thanks.'],
      [null, 'Lily hugs Nate. She doesn\'t let go for a while.'],
      ['Lily', 'Go get Mom.'],
    ],
    michelle: [
      ['Michelle', '...Nate? Oh, honey. Look at you.'], ['Michelle', 'Did I throw my good pots at you? My GOOD pots?'],
      ['Nate', 'And the chickens.'], ['Michelle', 'Henrietta! ...Well. She\'s always been a fighter.'],
      ['Michelle', 'Come here.'], [null, 'Mom hugs Nate. She smells like the garden.'],
      ['Michelle', 'You are so brave. I\'m so proud of you.'], ['Michelle', '...You\'re not wearing a helmet.'],
    ],
    abe: [
      ['Abe', '...Nate?'], ['Abe', 'Did I get you with the question?'], ['Nate', '...'], ['Abe', 'I\'m going to take that as a yes.'],
      ['Abe', 'Hey. I chased Lily around the house with that egg every single Christmas. This is kind of my fault.'],
      ['Nate', 'It\'s a LITTLE your fault.'], ['Abe', '...Fair.'],
      ['Abe', 'Listen. Remember cooking class? I cracked an egg. One hand. Perfect. You know what Lily said.'],
      ['Abe', 'There\'s a song for it. Down, down, left. Puff it on Dad\'s pipe when that egg is down, and CRACK him.'],
    ],
    romulus: [
      [null, 'Romulus shrinks back down to his own size. He shakes off the last of the water. And the purple.'],
      [null, 'He looks at Nate. Nate looks at him.'], ['Nate', '...Hey, buddy.'],
      [null, 'For the first time ever, Romulus doesn\'t run away from Nate.'],
      [null, 'He licks Nate\'s whole face.'], ['Nate', 'He LIKES me!'],
      ['Abe', 'He always liked you. He was just scared of you.'], ['Nate', 'Why was he scared of me?!'], ['Abe', 'Nobody knows, Nate. Nobody knows.'],
    ],
    hannah: [
      ['Hannah', '...Nate? Oh my gosh. Look at you. You\'re a MESS.'], ['Hannah', 'Did I do this? ...I did some of this.'],
      ['Hannah', 'Hold still. HOLD STILL.'],
    ],
  };
  S.finFreed = function* (b) {
    const f = flags(), w = G.play.world, p = P(), s = G.state, id = b.id, fam = finFam(w);
    // (the music keeps going straight through the gauntlet: no switching between fights)
    G.finClear(w);
    yield G.wait(20);
    // the possession comes off them
    for (let i = 0; i < 3; i++) { G.audio.sfx('poof'); w.burst(b.x, b.y - 30, ['#a85ae8', '#6a2a9a', '#f8f0ff'], 14, { speed: 1.8, up: 1.2, life: 26, size: 2 }); yield G.wait(14); }
    b.dead = true; w.finBoss = null;
    const npc = finNew(w, id, { x: b.x, y: b.y, talk: S.finFamTalk(id) });
    npc.freed = true; fam[id] = npc;
    yield G.wait(30);
    yield G.walkTo(p, npc.x, npc.y + 20, 1.4);
    p.dir = 'up';
    for (const [who, text] of FIN_FREED[id]) yield G.say(who, text);
    if (id === 'abe') {
      f.signal_crack = true;
      G.audio.sfx('secret');
      yield G.itemGet(G.spr.pipe, 'You learned {y}Nice Crack{/}! (down, down, left) Puff it on Dad\'s pipe.');
    }
    if (id === 'hannah') {
      // the full patch-up
      G.audio.sfx('heart');
      w.burst(p.x, p.y - 14, ['#f86868', '#ffffff', '#f8a8c8', '#78e070'], 24, { speed: 1.6, up: 1, life: 30, size: 2 });
      s.hp = s.maxHp;
      yield G.say(null, 'Hannah patches Nate up. All of him. Every heart, back.');
      yield G.say('Hannah', 'There. All better.');
      yield G.say('Hannah', 'Now let\'s go crack an egg.');
    } else {
      // a hug: a heart back
      s.hp = Math.min(s.maxHp, s.hp + 2);
      G.audio.sfx('heart');
      w.pop(p.x, p.y - 34, '+1 heart', '#f86868');
    }
    // up to the bank to cheer
    const [sx, sy] = finSeatXY(id);
    yield G.walkTo(npc, sx, sy, 2);
    npc.dir = sx < MID ? 'right' : 'left'; npc.homeDir = npc.dir;
    f.fin_freed = (f.fin_freed || 0) + 1;
    G.play.autosave();
    if (f.fin_freed < FIN_ORDER.length) yield* S.finNextFight(false);
    else yield* S.finRelayStart();
  };

  // ---------------------------------------------------------------- the relay
  S.finRelayStart = function* () {
    const f = flags(), w = G.play.world, p = P(), boss = w.eggmas;
    yield G.wait(30);
    yield G.camFocus(boss.x, boss.y - 30, 40);
    yield G.say('Father Eggmas', '...You beat them. ALL of them.');
    yield G.say('Father Eggmas', 'FINE. If I can\'t have the family... I\'ll take the DITCH.');
    G.audio.sfx('hohoho'); G.play.shake(16, 3);
    yield G.say(null, 'Father Eggmas rises up off his throne.');
    boss.state = 'risen'; boss.throneLeft = true; boss.targetH = 22;
    yield G.wait(50);
    yield G.camFocus(null, null, 30);
    yield G.say('Nate', 'Everybody. Together.');
    yield G.say('Doron', 'Me first. Nobody messes with my family. Or my ditch.');
    yield G.banner('FATHER EGGMAS', 'the egg on the mantel', 170);
    f.fin_relay = 0;
    yield* S.finTurnStart('doron', false);
  };
  const FIN_TURN_IN = {
    doron: [['Doron', 'Rocks. This ditch is FULL of rocks.']],
    dad: [['Dad', 'Father Eggmas. Do YOU speak EEENGLISH?'], ['Father Eggmas', 'I speak EGGLISH. HO HO HO.']],
    lily: [['Father Eggmas', 'Remember me, little one? HO HO HO.'], ['Lily', '...I remember.'], ['Lily', 'I\'ve been scared of you my whole life.'], ['Lily', 'I\'m still scared.'], ['Lily', 'I\'m doing it anyway.']],
    michelle: [['Michelle', 'You took my family, you took my ditch, and you broke my GOOD pots.'], ['Michelle', 'Henrietta. Get him.'], [null, '*BAWK*']],
    abe: [['Father Eggmas', 'HO HO HO! Can\'t reach me up HERE!'], ['Abe', 'Buddy. I\'m six foot five.']],
    romulus: [['Romulus', '*WOOF!*'], ['Father Eggmas', 'Bad dog. BAD DOG!'], ['Hannah', 'Don\'t you TALK to him like that!']],
    hannah: [['Hannah', 'I\'m a NICU nurse. I am not scared of a cranky little egg.'], ['Father Eggmas', 'I am NOT little!']],
    nate: [['Nate', 'My turn.'], ['Doron', 'GO, NATE!'], ['Lily', 'Crack him!'], ['Father Eggmas', 'Come on, then, rock boy. HO HO HO!']],
  };
  // whoever's up takes over (they come down off the bank; whoever was fighting goes back up)
  S.finTurnStart = function* (id, resumed) {
    const f = flags(), w = G.play.world, p = P(), s = G.state, boss = w.eggmas, fam = finFam(w);
    G.finClear(w);
    if (boss.state === 'throne') { boss.state = 'risen'; boss.throneLeft = true; boss.targetH = 22; boss.h = 22; }
    // (resuming after fainting: put the boss and his cracks back the way they were)
    if (resumed) {
      const done = G.FIN_RELAY.slice(0, f.fin_relay || 0);
      boss.hp = boss.maxHp - done.reduce((n, d) => n + G.FIN_TURNS[d].need, 0);
      boss.cracks = done.includes('abe') ? (done.includes('hannah') ? 2 : 1) : 0;
      boss.x = MID; boss.y = 170;
      G.audio.play(boss.cracks ? 'relay' : 'eggmas');
      yield G.wait(30);
      yield G.say('Father Eggmas', 'HO HO HO. Back for more?');
    }
    const cur = s.playAs || 'nate';
    if (cur !== id) {
      // the one coming in walks down; the one going out takes their spot on the bank
      const incoming = fam[id], ox = G.clamp(p.x, FIN_BOUNDS.x0 + 16, FIN_BOUNDS.x1 - 16), oy = G.clamp(p.y, FIN_BOUNDS.y0, FIN_BOUNDS.y1);
      if (incoming) yield G.walkTo(incoming, ox + 14, oy, 2.4);
      if (fam[cur]) { fam[cur].dead = true; }
      const out = finNew(w, cur, { x: ox, y: oy, talk: S.finFamTalk(cur) });
      out.freed = true; fam[cur] = out;
      if (incoming) { incoming.dead = true; fam[id] = null; }
      G.audio.sfx('select');
      w.burst(ox + 14, oy - 12, ['#ffffff', '#f8e070'], 10, { speed: 1, life: 16, size: 2 });
      s.playAs = id === 'nate' ? null : id;
      p.x = ox + 14; p.y = oy; p.carry = false; p.pose = null; p.state = 'walk';
      const [sx, sy] = finSeatXY(cur);
      yield G.walkTo(out, sx, sy, 2.4);
      out.dir = sx < MID ? 'right' : 'left'; out.homeDir = out.dir;
    }
    // a fresh fighter: full hearts
    s.hp = s.maxHp;
    if (!resumed) for (const [who, text] of FIN_TURN_IN[id]) yield G.say(who, text);
    if (id === 'nate' && G.ITEMS.pipe.has()) s.xItem = 'pipe';
    yield G.banner(FIN_TITLE[id] + '\'S TURN', G.FIN_TURNS[id].tip, 150);
    if (id === 'doron') for (let i = 0; i < 3; i++) w.add(new G.LiftRock(56 + i * 64, 200 + (i % 2) * 40));
    if (!resumed && (f.fin_relay || 0) === 0) G.audio.play('eggmas');
    G.play.autosave();
    boss.beginTurn(id);
  };
  // whoever's turn it was got their hits in
  const FIN_TURN_OUT = {
    doron: [['Doron', 'That\'s for my little brother!'], ['Doron', 'Dad! You\'re up!']],
    dad: [['Dad', 'Peace be with YOU.'], ['Dad', 'Lily. Your turn, sweetheart.'], ['Lily', '...Okay.']],
    lily: [['Lily', 'I\'m not scared of you anymore.'], ['Lily', '...Okay, a LITTLE. But not as much.'], ['Lily', 'Mom!']],
    michelle: [['Michelle', 'That\'s for my pots.'], ['Michelle', 'Abe, honey, he\'s floating away!']],
    romulus: [['Hannah', 'GOOD BOY! Who\'s a good boy?!'], ['Abe', 'He is. He is the good boy.'], ['Hannah', 'My turn.']],
    hannah: [['Hannah', 'Nurse\'s orders.'], ['Hannah', 'Nate. Finish it.']],
  };
  S.finTagOut = function* (boss) {
    const f = flags(), w = G.play.world, p = P(), s = G.state, id = boss.turn;
    G.finClear(w);
    if (id === 'nate') { yield* S.finFinale(boss); return; }
    yield G.wait(20);
    if (id === 'abe') {
      // the big crack
      G.audio.sfx('crack'); G.play.shake(20, 4);
      G.play.whiteout = 1;
      boss.cracks = 1;
      w.burst(boss.x, boss.y - boss.h - 40, ['#f2ead6', '#d4c8ac', '#ffffff'], 20, { speed: 2, up: 1.2, g: 0.1, life: 30, size: 2 });
      yield G.wait(40);
      yield G.say(null, 'CRACK! A crack runs right down Father Eggmas\'s shell.');
      yield G.say('Lily', 'NICE CRACK, ABE!');
      yield G.say('Abe', '...Thank you. I have been waiting YEARS for somebody to say that again.');
      yield G.say('Father Eggmas', 'MY SHELL! You CRACKED my SHELL!');
      yield G.say('Abe', 'Romulus! Go get him, buddy!');
      G.audio.play('relay');
    } else {
      if (id === 'hannah') { boss.cracks = 2; G.audio.sfx('crack'); G.play.shake(10, 2); }
      for (const [who, text] of FIN_TURN_OUT[id]) yield G.say(who, text);
    }
    f.fin_relay = (f.fin_relay || 0) + 1;
    yield* S.finTurnStart(G.FIN_RELAY[f.fin_relay], false);
  };
  // Nice Crack (Dad's pipe): the egg is down, and Nate cracks him
  S.signalCrack = function* () {
    const w = G.play.world, p = P(), boss = w.ents.find((e) => e instanceof G.EggmasBoss && !e.dead);
    if (!boss || boss.turn !== 'nate' || boss.state !== 'down' || Math.hypot(boss.x - p.x, boss.y - p.y) > 160) {
      yield G.say(null, 'Nate puffs Nice Crack. ...Nothing around here needs cracking.');
      return;
    }
    G.audio.sfx('crack'); G.play.shake(20, 4); G.play.whiteout = 1;
    boss.cracks = Math.min(3, boss.cracks + 1);
    w.burst(boss.x, boss.y - 30, ['#f2ead6', '#d4c8ac', '#ffffff', '#f8e070'], 24, { speed: 2.2, up: 1.4, g: 0.1, life: 30, size: 2 });
    yield G.wait(30);
    const last = boss.turnHits + 1 >= boss.td.need;
    if (!last) {
      yield G.say(null, 'CRACK!');
      yield G.say('Lily', 'NICE CRACK!');
      yield G.say('Father Eggmas', 'STOP. CRACKING. ME.');
      boss.state = 'fight'; boss.targetH = boss.td.h;
    }
    boss.relayHit('crack');
  };

  // ---------------------------------------------------------------- the end
  S.finFinale = function* (boss) {
    const f = flags(), w = G.play.world, p = P(), s = G.state, fam = finFam(w);
    G.audio.stop();
    yield G.wait(20);
    for (let i = 0; i < 5; i++) {
      G.audio.sfx('crack'); G.play.shake(12 + i * 3, 3);
      w.burst(boss.x + (Math.random() * 30 - 15), boss.y - 30 - Math.random() * 30, ['#f2ead6', '#d4c8ac', '#ffffff', '#a85ae8'], 14, { speed: 2, up: 1.2, g: 0.1, life: 28, size: 2 });
      yield G.wait(16);
    }
    boss.cracks = 3;
    yield G.say('Father Eggmas', 'NO... NO NO NO NO...');
    G.audio.sfx('boom'); G.play.whiteout = 1; G.play.shake(30, 5);
    w.burst(boss.x, boss.y - 30, ['#ffffff', '#f2ead6', '#f8e070', '#a85ae8'], 40, { speed: 3, up: 1.6, g: 0.08, life: 40, size: 3 });
    boss.state = 'defeated'; boss.hidden = true;
    w.finWeather = 'clear';
    // just a doll, lying in the gravel
    const doll = w.add(new G.NPC({ sprite: null, name: 'Father Eggmas', x: boss.x, y: boss.y, dir: 'down', talk: function* () { yield G.say(null, 'A little thrift-store doll with a cracked egg head. He\'s very quiet now.'); } }));
    doll.draw = function (ctx, cx, cy) { ctx.drawImage(G.spr.eggmas, Math.round(this.x - 14) - cx, Math.round(this.y - 30) - cy); ctx.fillStyle = '#3a2a1a'; for (const [x, y] of [[13, 1], [12, 3], [14, 5], [12, 7], [7, 6], [9, 8], [21, 6], [19, 9]]) ctx.fillRect(Math.round(this.x - 14 + x) - cx, Math.round(this.y - 30 + y) - cy, 1, 1); };
    w.finDoll = doll;
    yield G.wait(80);
    s.playAs = null;
    // everyone comes down off the banks
    G.audio.play('title');
    const spots = { doron: [-30, 10], dad: [-20, 22], lily: [-8, -18], michelle: [14, 22], abe: [28, 8], hannah: [20, -14], romulus: [-28, -10] };
    boss.x = G.clamp(boss.x, FIN_BOUNDS.x0 + 30, FIN_BOUNDS.x1 - 30); boss.y = G.clamp(boss.y, FIN_BOUNDS.y0 + 20, FIN_BOUNDS.y1 - 26); w.finDoll.x = boss.x; w.finDoll.y = boss.y;
    for (const id of FIN_ORDER) {
      if (!fam[id] || fam[id].dead) fam[id] = finNew(w, id, { x: finSeatXY(id)[0], y: finSeatXY(id)[1], talk: S.finFamTalk(id) });
      fam[id].freed = true;
    }
    yield G.walkTo(p, boss.x, boss.y + 26, 1.4);
    p.dir = 'up';
    for (const id of FIN_ORDER) { const npc = fam[id]; yield G.walkTo(npc, boss.x + spots[id][0], boss.y + spots[id][1], 2.6); npc.dir = G.dirToward(boss.x - npc.x, boss.y - npc.y); }
    yield G.say(null, 'The snow stops. The Christmas lights stop flickering and just... twinkle.');
    yield G.say(null, 'In the gravel, there\'s a little thrift-store doll with a cracked egg head.');
    yield G.say('Father Eggmas', '...I just wanted... a family.');
    yield G.say('Lily', 'You HAD one.');
    yield G.say('Lily', 'You were on our mantel every single Christmas. You were part of it. Even if you were the scariest part.');
    yield G.say('Michelle', 'You scared Lily half to death for fifteen years. But you were OURS.');
    yield G.say('Dad', 'Every family has a weird uncle. You\'re our weird egg.');
    yield G.say('Father Eggmas', '...Oh.');
    yield G.say('Father Eggmas', '...ho. ho. ho.');
    yield G.say(null, 'And then he\'s just a doll.');
    yield G.wait(40);
    yield G.say('Lily', '...He can come home.');
    yield G.say('Abe', '...Really?');
    yield G.say('Lily', 'In the box. In the attic. FAR back in the attic.');
    yield G.say('Hannah', 'Is everybody okay? Nate, let me see your hands.');
    if (fam.romulus) { yield G.walkTo(fam.romulus, p.x + 12, p.y + 4, 1.6); fam.romulus.dir = 'left'; }
    yield G.say(null, 'Romulus flops down right on Nate\'s feet.');
    yield G.say('Abe', 'Huh. He\'s never done THAT before.');
    yield G.say('Doron', 'So. Now what?');
    yield G.say('Nate', 'Now?');
    yield G.say('Nate', '...Now we hunt for shark teeth. At the Number ONE Ditch.');
    yield G.say(null, 'The whole family kneels down at the edge of the ditch and starts sifting through the gravel.');
    yield G.wait(60);
    yield G.say('Nate', '...Wait.');
    yield G.say('Nate', 'Is that...');
    G.audio.sfx('fanfare');
    yield G.itemGet(G.spr.toothGold, 'THE MOSASAUR TOOTH!');
    yield G.say('Doron', 'Tyler is going to be SO mad.');
    yield G.banner('THE END', 'The Number One Ditch is still Number One.', 300);
    f.fin_done = true;
    G.play.autosave();
  };
  // talking to the family on the banks (during and after)
  const FIN_TALK = {
    doron: ['GO, NATE! LEG DAY!', 'Best ditch in the world. I said it and I meant it.'],
    dad: ['Peace be with you, son.', 'I think about pH often. Here, it\'s about seven. Good ditch.'],
    lily: ['I\'m okay. I\'m okay. ...I\'m okay.', 'He\'s going in the box. FAR back in the box.'],
    michelle: ['Be careful, honey!', 'We\'re getting you a helmet for Christmas. I\'m serious.'],
    abe: ['Nice crack. Still thinking about it.', 'How many sides on a... no. Not today. You earned a day off.'],
    hannah: ['Let me know if anything hurts.', 'I\'m going to need to check EVERYBODY when we get home.'],
    romulus: ['*wag wag wag*', '*rolls over for a belly rub*'],
  };
  S.finFamTalk = (id) => function* () {
    const f = flags(), k = 'finTalk_' + id;
    f[k] = ((f[k] || 0) + 1) % 2;
    yield G.say(FIN_NAME[id], FIN_TALK[id][f.fin_done ? 1 : 0]);
  };

  // ---------------------------------------------------------------- the map
  // The Number One Ditch at night, the way Father Eggmas has done it up: Christmas lights strung
  // across the ditch, snow falling (in Chesapeake), and his throne of egg cartons in front of
  // the culvert at the north end. The ditch bed (gravel, mud, a trickle of water down the middle,
  // shark teeth if you look closely) is the arena; the family sits on the banks.
  const DB = 'ç', BF = 'ê';
  G.MAPS.ditchFinal = {
    name: 'The Number One Ditch',
    noFollower: true,
    // the trickle of water down the middle of the ditch (drawn in setup): the bidet fills up at it
    water(x, y) { return y > 4 * 16 && y < 18 * 16 && Math.abs(x - (MID + Math.sin(y * 0.05) * 10 + Math.sin(y * 0.13) * 4)) < 10; },
    get music() { const f = flags(); return f.fin_done ? 'title' : f.fin_intro ? 'possessed' : 'home'; },
    tiles() {
      const W = 15, H = 21;
      const g = Array.from({ length: H }, () => Array(W).fill('.'));
      const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) g[y + j][x + i] = c; };
      fill(1, 2, 13, 2, BF);         // the north bank (the culvert is in it)
      fill(1, 4, 1, 14, BF); fill(13, 4, 1, 14, BF);   // the side banks
      fill(2, 4, 11, 14, DB);        // the ditch bed
      fill(1, 18, 13, 1, BF); fill(7, 18, 2, 1, DB);   // the south bank, with a way down from the road
      fill(0, 19, W, 2, 'a');        // the road
      for (const [x, y] of [[1, 0], [6, 0], [11, 0]]) g[y][x] = 'T';
      return g.map((r) => r.join(''));
    },
    setup(w) {
      const sp = G.spr, f = flags(), fam = finFam(w);
      // the camera leans up to keep whoever Nate's fighting on the screen (Eggmas floats high)
      w.camLean = (p) => {
        const b = w.finBoss && !w.finBoss.dead ? w.finBoss : w.eggmas && !w.eggmas.hidden && w.eggmas.state !== 'throne' ? w.eggmas : null;
        if (!b) return 0;
        const top = b instanceof G.EggmasBoss ? b.y - b.h - 70 : b.y - 50;
        return G.clamp(p.y - 84 - top, 0, 60);
      };
      // the trickle of water down the middle of the ditch
      w.props.push({
        img: null, x: 0, y: 0, flat: true, base: 0,
        draw(ctx, cx, cy) {
          for (let y = 4 * 16; y < 18 * 16; y += 2) {
            const x = MID + Math.sin(y * 0.05) * 10 + Math.sin(y * 0.13) * 4;
            ctx.fillStyle = '#2a4a6a'; ctx.fillRect(Math.round(x - 6) - cx, y - cy, 12, 2);
            ctx.fillStyle = (y + (G.tick >> 2)) % 16 < 2 ? '#8ab8e0' : '#3a5a7a'; ctx.fillRect(Math.round(x - 4) - cx, y - cy, 8, 1);
          }
        },
      });
      w.addProp({ img: sp.culvert, tx: 5, ty: 2, h: 2, dx: -4, dy: 0 });
      // the throne (solid) and Father Eggmas
      w.blockTiles(5, 4, 5, 2);
      w.props.push({ img: null, x: 0, y: 0, base: 0, hit: [5 * 16, 4 * 16, 10 * 16, 6 * 16], talk: function* () { yield G.say(null, flags().fin_done ? 'An empty throne made of egg cartons. Somebody should recycle it.' : 'A throne made of egg cartons, tinsel and ornaments.'); } });
      if (!f.fin_done) {
        w.eggmas = w.add(new G.EggmasBoss(MID, 66, FIN_BOUNDS));
        w.eggmas.throneX = MID; w.eggmas.throneY = 98;
        if ((f.fin_freed || 0) >= FIN_ORDER.length) { w.eggmas.state = 'risen'; w.eggmas.throneLeft = true; w.eggmas.h = 22; w.eggmas.targetH = 22; w.eggmas.x = MID; w.eggmas.y = 170; }
      }
      // the throne itself, once he's left it
      w.props.push({ img: sp.eggThrone, x: MID - 44, y: 98 - 92, base: 98, draw(ctx, cx, cy) { if (!w.eggmas || w.eggmas.throneLeft || f.fin_done) ctx.drawImage(this.img, this.x - cx, this.y - cy); } });
      // cattails along the banks, the sign by the road, a few bushes (Abe hides in these)
      for (const [x, y] of [[0, 4], [14, 4], [0, 17], [14, 17], [4, 18], [10, 18]]) w.addProp({ img: sp.cattails, tx: x, ty: y, dx: 1 });
      w.addProp({ img: sp.ditchSign, tx: 2, ty: 18, h: 1, dx: 0, dy: -4, talk: look('The sign: No.1 DITCH. Still standing.'), hit: [2, 18, 3, 1] });
      w.finBushes = [[2.6 * 16, 9.5 * 16], [12.4 * 16, 9.5 * 16], [2.6 * 16, 15 * 16], [12.4 * 16, 15 * 16], [MID, 16.8 * 16]];
      for (const b of w.finBushes) {
        w.props.push({ img: sp.boxwood, x: b[0] - 8, y: b[1] - 14, base: b[1], draw(ctx, cx, cy) {
          const r = w.finRustle && w.finRustle.b === b && w.finRustle.t > 0 ? ((G.tick >> 1) & 1 ? 1 : -1) : 0;
          ctx.drawImage(this.img, this.x + r - cx, this.y - cy);
        } });
      }
      // the family: possessed in a line by the throne (or, once freed, on the banks)
      const freed = f.fin_freed || 0, relayAt = f.fin_relay || 0, inRelay = freed >= FIN_ORDER.length && !f.fin_done;
      for (const [i, id] of FIN_ORDER.entries()) {
        let npc;
        if (!f.fin_intro) {
          npc = finNew(w, id, { x: i < 3 ? (5.5 + i * 1.5) * 16 : 6 * 16 + (i - 3) * 22, y: (19.4 + (i > 2 ? 1 : 0)) * 16, dir: 'up' });
          npc.hidden = true;
        } else if (i >= freed && !f.fin_done) {
          npc = finNew(w, id, { x: FIN_LINE[id][0] * 16, y: FIN_LINE[id][1] * 16, possessed: true });
        } else if (inRelay && G.state.playAs === id) {
          npc = null; // (that's who Nate is playing right now)
        } else {
          const [sx, sy] = finSeatXY(id);
          npc = finNew(w, id, { x: sx, y: sy, dir: sx < MID ? 'right' : 'left', talk: S.finFamTalk(id) });
          npc.freed = true;
        }
        fam[id] = npc;
      }
      // during the relay, whoever isn't fighting (Nate too) watches from the bank
      if (inRelay && G.state.playAs) {
        const [sx, sy] = finSeatXY('nate');
        fam.nate = w.add(new G.NPC({ sprite: 'nate', name: 'Nate', x: sx, y: sy, dir: 'right', talk: function* () { yield G.say('Nate', 'You got this!'); } }));
        fam.nate.freed = true;
      }
      if (f.fin_done) {
        // after: the family, sifting for shark teeth
        for (const [i, id] of FIN_ORDER.entries()) { const npc = fam[id]; if (npc) { npc.x = (2.6 + i * 1.9) * 16; npc.y = 12 * 16; npc.dir = 'down'; } }
      }
      // overhead: Christmas lights strung across the ditch, falling snow, and the night
      w.props.push({
        img: null, x: 0, y: 0, base: 99990,
        draw(ctx, cx, cy) {
          if (!flags().fin_done) {
            ctx.save(); ctx.globalAlpha = 0.28; ctx.fillStyle = '#140a28'; ctx.fillRect(0, 0, G.W, G.H); ctx.restore();
          }
          const cols = ['#f83838', '#38c848', '#f8e040', '#3878f8', '#f878d8'];
          for (const [ri, row] of [6, 11, 16].entries()) {
            const y0 = row * 16 - 30;
            for (let x = 0; x < 15 * 16; x += 2) {
              const y = y0 + Math.round(Math.sin((x / (15 * 16)) * Math.PI) * 10);
              ctx.fillStyle = '#1a1a20'; ctx.fillRect(x - cx, y - cy, 2, 1);
              if (x % 14 === 0) {
                const k = (x / 14 + ri) % 5, on = flags().fin_done ? (x / 14 + (G.tick >> 4)) % 3 !== 0 : (x / 14 + (G.tick >> 3)) % 4 !== 0;
                ctx.fillStyle = on ? cols[k] : '#3a3a44'; ctx.fillRect(x - cx, y + 1 - cy, 2, 3);
                if (on) { ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = cols[k]; ctx.fillRect(x - 2 - cx, y - 1 - cy, 6, 7); ctx.restore(); }
              }
            }
          }
          if (w.finWeather !== 'clear' && !flags().fin_done) {
            ctx.fillStyle = '#f8f8ff';
            for (let i = 0; i < 46; i++) {
              const sx0 = G.hash(i, 1, 177) * 260, spd = 0.3 + G.hash(i, 2, 177) * 0.5;
              const y = (G.hash(i, 3, 177) * 200 + G.tick * spd) % 180 - 10, x = (sx0 + Math.sin((G.tick + i * 30) * 0.02) * 6) % 250;
              ctx.fillRect(Math.round(x), Math.round(y), i % 3 ? 1 : 2, i % 3 ? 1 : 2);
            }
          }
        },
      });
      if (f.fin_done) w.addTrigger(6, 20, 3, 1, () => G.script.run(function* () { const p = P(); yield G.say('Nate', 'The road home. (More to come!)'); yield G.walkTo(p, p.x, p.y - 16, 1); }()));
    },
    onEnter() { return S.finEnter(); },
    tick(w) {
      if (w.finRustle && w.finRustle.t > 0) w.finRustle.t--;
      // the family cheers from the banks during the relay
      const boss = w.eggmas;
      if (boss && boss.state === 'fight' && !G.script.busy && G.tick % 170 === 0) {
        const cheers = { doron: 'GO GO GO!', dad: 'Amen!', lily: 'Get him!', michelle: 'Be CAREFUL!', abe: 'NICE!', hannah: 'Breathe!', romulus: 'WOOF!', nate: 'You got this!' };
        const fans = Object.entries(finFam(w)).filter(([k, n]) => n && !n.dead && n.freed);
        if (fans.length) { const [k, n] = fans[Math.floor(Math.random() * fans.length)]; w.pop(n.x, n.y - 28, cheers[k] || 'GO!', '#f8f8f0'); }
      }
    },
  };
})();
