// The instruction booklet: "Manual" on the title screen. Not 8-bit like the game: the little
// booklet that would've come in the case, back in the GameCube days. Glossy cover art, a health
// warning, a controls diagram with callouts, character pages, a NOTES page nobody ever wrote on,
// and the warranty on the inside back cover. It's HTML on top of the game (like Dad's pipe book),
// sized to the window, and the pages turn like paper.
//   ← → (or A/D, Q/E, or clicking a page) turn the pages; X or Esc closes it.
// The art is the game's own sprites, blown up crisp. Page numbers follow Abe's Rule #1 (G.sayable).
(function () {
  'use strict';

  // ---------------------------------------------------------------- the look
  const CSS = `
  #mb { position: fixed; inset: 0; z-index: 80; display: none; align-items: center; justify-content: center;
    background: radial-gradient(ellipse at 50% 40%, #3a3046 0%, #1c1624 55%, #0c0a10 100%);
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; color: #2a2630; user-select: none; -webkit-user-select: none; }
  #mb.on { display: flex; }
  #mb .mb-stage { position: relative; perspective: 2600px; }
  #mb .mb-book { position: relative; transition: transform .55s cubic-bezier(.45,.05,.35,1); transform-style: preserve-3d; }
  #mb .mb-slot, #mb .mb-leaf { position: absolute; top: 0; width: var(--pw); height: var(--ph); }
  #mb .mb-slot.l { left: 0; } #mb .mb-slot.r { left: var(--pw); }
  #mb.single .mb-slot.r { left: 0; }
  #mb .mb-leaf { left: var(--pw); transform-origin: left center; transform-style: preserve-3d; z-index: 5; }
  #mb.single .mb-leaf { left: 0; }
  #mb .mb-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; overflow: hidden; }
  #mb .mb-back { transform: rotateY(180deg); }
  #mb .mb-shade { position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity .35s; }
  #mb .mb-leaf.go .mb-front .mb-shade { background: linear-gradient(90deg, rgba(0,0,0,.25), rgba(0,0,0,.05) 40%, rgba(255,255,255,.12)); opacity: 1; }
  #mb .mb-leaf.go .mb-back .mb-shade { background: linear-gradient(270deg, rgba(0,0,0,.28), rgba(0,0,0,.04) 40%, rgba(255,255,255,.1)); opacity: 1; }
  #mb .mb-slot { box-shadow: 0 1.6em 3.2em rgba(0,0,0,.55), 0 .3em .8em rgba(0,0,0,.4); }
  /* (the stack of pages showing at the outside edges) */
  #mb .mb-slot.r { box-shadow: .12em .06em 0 #ebe5d8, .24em .12em 0 #d8d0c0, .36em .18em 0 #ebe5d8, .48em .24em 0 #cfc6b4, 0 1.6em 3.2em rgba(0,0,0,.55); }
  #mb .mb-slot.l { box-shadow: -.12em .06em 0 #ebe5d8, -.24em .12em 0 #d8d0c0, -.36em .18em 0 #ebe5d8, -.48em .24em 0 #cfc6b4, 0 1.6em 3.2em rgba(0,0,0,.55); }
  #mb.single .mb-slot.r { box-shadow: .12em .06em 0 #ebe5d8, .24em .12em 0 #d8d0c0, 0 1.6em 3.2em rgba(0,0,0,.55); }
  #mb .mb-ui { position: fixed; left: 0; right: 0; bottom: 1.2vh; text-align: center; font: 600 12px/1.4 "Helvetica Neue", Arial, sans-serif;
    color: #b8b0c8; letter-spacing: .06em; pointer-events: none; }
  #mb .mb-ui b { color: #fff; background: #3a3048; border: 1px solid #5a4e70; border-radius: 4px; padding: 0 .45em; margin: 0 .2em; font-weight: 700; }
  #mb .mb-x { position: fixed; top: 1.6vh; right: 1.6vh; width: 36px; height: 36px; border-radius: 50%; border: 2px solid #5a4e70; background: #2a2236;
    color: #e8e0f8; font: 700 18px/32px Arial, sans-serif; text-align: center; cursor: pointer; }
  #mb .mb-x:hover { background: #3a3048; }
  #mb .mb-hit { position: absolute; top: 0; bottom: 0; width: 50%; cursor: pointer; z-index: 9; }
  #mb .mb-hit.prev { left: 0; } #mb .mb-hit.next { right: 0; }

  /* ---- a page */
  #mb .pg { position: absolute; inset: 0; background: linear-gradient(180deg, #fdfcf9 0%, #f6f3ec 100%); overflow: hidden; }
  #mb .pg.left::after { content: ''; position: absolute; top: 0; bottom: 0; right: 0; width: 9%; pointer-events: none;
    background: linear-gradient(270deg, rgba(60,40,30,.22), rgba(60,40,30,.06) 45%, rgba(0,0,0,0)); }
  #mb .pg.right::after { content: ''; position: absolute; top: 0; bottom: 0; left: 0; width: 9%; pointer-events: none;
    background: linear-gradient(90deg, rgba(60,40,30,.22), rgba(60,40,30,.06) 45%, rgba(0,0,0,0)); }
  #mb .pg.blank { background: #ece6da; }
  #mb .in { position: absolute; left: 8%; right: 8%; top: 5.5%; bottom: 8%; }
  #mb .pg.left .in { left: 7%; right: 10%; } #mb .pg.right .in { left: 10%; right: 7%; }
  #mb .hdr { position: relative; height: 2.3em; margin-bottom: 1.1em; }
  #mb .hdr h2 { position: relative; margin: 0; font: italic 900 1.45em/1.6 "Futura", "Century Gothic", "Avenir Next", "Trebuchet MS", Arial, sans-serif;
    color: #fff; letter-spacing: .02em; text-shadow: .06em .08em 0 rgba(0,0,0,.25); white-space: nowrap; }
  #mb .hdr h2 span { position: relative; display: inline-block; background: var(--ac); padding: 0 .9em 0 2.4em; margin-left: -2.4em;
    border-radius: 0 .8em .8em 0; box-shadow: inset 0 -.17em 0 rgba(0,0,0,.18), 0 .1em .2em rgba(0,0,0,.15); }
  #mb .pg.right .hdr h2 { text-align: right; }
  #mb .pg.right .hdr h2 span { padding: 0 2.4em 0 .9em; margin: 0 -2.4em 0 0; border-radius: .8em 0 0 .8em; }
  #mb .hdr h2 span::before { content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
    background-image: radial-gradient(rgba(255,255,255,.28) 18%, transparent 20%); background-size: .3em .3em; opacity: .45; }
  #mb .hdr .rule { position: absolute; left: 0; right: 0; top: 2.75em; height: .14em; background: var(--ac); opacity: .35; }
  #mb p { margin: 0 0 .6em; font-size: .82em; line-height: 1.42; }
  #mb h3 { margin: .7em 0 .3em; font: 800 .9em/1.2 "Futura", "Century Gothic", "Avenir Next", "Trebuchet MS", Arial, sans-serif; color: var(--ac); letter-spacing: .02em; text-transform: uppercase; }
  #mb h3:first-child { margin-top: 0; }
  #mb .lead { font-size: .86em; line-height: 1.45; font-weight: 500; }
  #mb .lead::first-letter { float: left; font: 900 2.6em/.9 "Futura", "Century Gothic", Arial, sans-serif; color: var(--ac); margin: .06em .1em 0 0; }
  #mb .px { image-rendering: pixelated; image-rendering: crisp-edges; display: block; }
  #mb .ftr { position: absolute; left: 0; right: 0; bottom: 3.2%; height: 1.6em; font: 600 .6em/1.6em "Helvetica Neue", Arial, sans-serif; color: #9a90a4; letter-spacing: .12em; text-transform: uppercase; }
  #mb .pg.left .ftr { left: 7%; } #mb .pg.right .ftr { right: 7%; text-align: right; }
  #mb .pn { display: inline-block; min-width: 2.4em; padding: 0 .5em; border-radius: .8em; background: var(--ac); color: #fff; font-weight: 800; text-align: center; letter-spacing: .02em; }
  #mb .pg.left .pn { margin-right: .8em; } #mb .pg.right .pn { margin-left: .8em; }
  #mb .box { position: relative; border-radius: .6em; background: color-mix(in srgb, var(--ac) 10%, #fff); border: .12em solid color-mix(in srgb, var(--ac) 45%, #fff); padding: .7em .8em .4em; margin: .9em 0 .6em; }
  #mb .box .tag { position: absolute; top: -.75em; left: .8em; background: var(--ac); color: #fff; font: italic 900 .62em/1.6 "Futura", "Century Gothic", Arial, sans-serif; padding: 0 .7em; border-radius: .8em; letter-spacing: .08em; }
  #mb .box p { font-size: .75em; margin-bottom: .35em; }
  #mb .row { display: flex; gap: .8em; align-items: flex-start; }
  #mb .col { flex: 1; min-width: 0; }
  #mb .shot { border-radius: .3em; border: .25em solid #1c1624; box-shadow: 0 .2em .5em rgba(0,0,0,.3); width: 100%; background: #000; }
  #mb .cap { font-size: .62em; color: #6a6070; text-align: center; margin-top: .35em; font-style: italic; }
  #mb .num { display: inline-flex; min-width: 1.5em; height: 1.5em; padding: 0 .3em; box-sizing: border-box; border-radius: .75em; background: var(--ac); color: #fff; font: 800 .7em/1 Arial, sans-serif;
    align-items: center; justify-content: center; flex: none; box-shadow: 0 .1em .2em rgba(0,0,0,.25); }
  #mb .legend { list-style: none; margin: .6em 0 0; padding: 0; }
  #mb .legend li { display: flex; gap: .55em; align-items: flex-start; margin-bottom: .45em; }
  #mb .legend li p { margin: 0; font-size: .76em; }
  #mb .legend li b { color: #2a2238; }

  /* ---- characters and items */
  #mb .who { display: flex; gap: .8em; align-items: center; margin-bottom: .85em; }
  #mb .who .pic { flex: none; width: 4.4em; height: 4.4em; border-radius: 50%; display: flex; align-items: flex-end; justify-content: center; overflow: hidden;
    background: radial-gradient(circle at 50% 35%, #fff 0%, color-mix(in srgb, var(--ac) 30%, #fff) 70%); border: .16em solid var(--ac); box-shadow: 0 .15em .35em rgba(0,0,0,.2); }
  #mb .who .nm { font: italic 900 1.05em/1.1 "Futura", "Century Gothic", Arial, sans-serif; color: #2a2238; }
  #mb .who .nm small { font: 700 .55em/1 "Helvetica Neue", Arial, sans-serif; color: var(--ac); letter-spacing: .12em; text-transform: uppercase; margin-left: .5em; font-style: normal; }
  #mb .who p { margin: .2em 0 0; font-size: .72em; line-height: 1.35; }
  #mb .who .sk { font-size: .62em; color: #5a5064; margin-top: .25em; }
  #mb .who .sk b { color: var(--ac); }
  #mb .item { display: flex; gap: .7em; align-items: center; margin-bottom: .6em; }
  #mb .item .ic { flex: none; width: 2.6em; height: 2.6em; border-radius: .45em; background: #241c30; display: flex; align-items: center; justify-content: center;
    border: .14em solid #4a3e5c; box-shadow: inset 0 0 0 .1em #120e18, 0 .12em .25em rgba(0,0,0,.25); }
  #mb .item b { font: 800 .74em/1.2 "Futura", "Century Gothic", Arial, sans-serif; color: #2a2238; display: block; }
  #mb .item p { margin: .1em 0 0; font-size: .68em; line-height: 1.32; }
  #mb .item.locked .ic { position: relative; background: #8a8298; border-color: #6a6278; }
  #mb .item.locked .ic i { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font: 900 1.3em/1 "Futura", "Century Gothic", Arial, sans-serif;
    color: #fff; font-style: normal; text-shadow: 0 .08em 0 #2a2238, 0 0 .3em rgba(0,0,0,.6); }
  #mb .item.locked b { color: #8a8298; letter-spacing: .1em; }
  #mb .item.locked p { color: #8a8298; font-style: italic; }

  /* ---- the keyboard */
  #mb .kb { position: relative; margin: .4em 0 0; }
  #mb .key { position: absolute; border-radius: .3em; background: linear-gradient(180deg, #fff 0%, #e4e0ea 100%); border: .1em solid #8a8298; box-sizing: border-box;
    box-shadow: 0 .18em 0 #8a8298, 0 .28em .4em rgba(0,0,0,.2); color: #3a3048; display: flex; align-items: center; justify-content: center; }
  #mb .key span { font: 800 .62em/1 Arial, sans-serif; }
  #mb .key .kn { position: absolute; top: -.55em; right: -.55em; font: 800 .5em/1.6em Arial, sans-serif; min-width: 1.6em; height: 1.6em; padding: 0 .2em; box-sizing: border-box;
    border-radius: .8em; background: var(--ac); color: #fff; text-align: center; box-shadow: 0 .1em .2em rgba(0,0,0,.3); }
  #mb .key.hot { background: linear-gradient(180deg, #fff 0%, color-mix(in srgb, var(--ac) 25%, #fff) 100%); border-color: var(--ac); box-shadow: 0 .2em 0 var(--ac), 0 .3em .4em rgba(0,0,0,.2); color: #2a2238; }

  /* ---- the warning page */
  #mb .warn { border: .2em solid #2a2630; padding: .7em .85em .2em; margin-bottom: .7em; }
  #mb .warn h4 { margin: 0 0 .5em; font: 900 1.05em/1.1 Arial, sans-serif; letter-spacing: .04em; display: flex; align-items: center; gap: .45em; }
  #mb .warn h4 i { font-style: normal; display: inline-flex; width: 1.3em; height: 1.15em; background: #f8d040; color: #2a2630; clip-path: polygon(50% 0, 100% 100%, 0 100%);
    align-items: flex-end; justify-content: center; font-size: .9em; padding-bottom: .05em; }
  #mb .warn p { font-size: .66em; line-height: 1.38; text-align: justify; }
  #mb .caps { text-transform: uppercase; font-weight: 800; letter-spacing: .03em; }

  /* ---- contents */
  #mb .toc { list-style: none; padding: 0; margin: .4em 0 0; }
  #mb .toc li { display: flex; align-items: baseline; gap: .4em; font: 700 .82em/2.05 "Futura", "Century Gothic", "Avenir Next", Arial, sans-serif; color: #2a2238; }
  #mb .toc li .dots { flex: 1; border-bottom: .14em dotted #b8b0c4; transform: translateY(-.3em); }
  #mb .toc li .sw { width: .7em; height: .7em; border-radius: 50%; flex: none; transform: translateY(.05em); }
  #mb .toc li .p { font-weight: 900; color: #6a6078; }

  /* ---- the notes page */
  #mb .lines { position: absolute; left: 0; right: 0; top: 3.6em; bottom: 0;
    background-image: repeating-linear-gradient(180deg, transparent 0, transparent 1.55em, #c8c0d4 1.55em, #c8c0d4 1.62em); }

  /* ---- covers */
  #mb .cover { position: absolute; inset: 0; overflow: hidden; color: #fff; }
  #mb .cover .band { position: absolute; left: 0; right: 0; top: 0; height: 7.5%; background: #16121e; display: flex; align-items: center; padding-left: 5%; gap: .55em;
    box-shadow: 0 .2em .4em rgba(0,0,0,.4); z-index: 3; }
  #mb .cover .band .cube { width: 1.5em; height: 1.5em; }
  #mb .cover .band span { font: 800 .62em/1 "Futura", "Century Gothic", Arial, sans-serif; letter-spacing: .28em; color: #e8e0f8; }
  #mb .cover .band span b { color: #ffb830; font-weight: 900; }
  #mb .cover .sky { position: absolute; inset: 0; background: linear-gradient(180deg, #1a1236 0%, #3a2058 26%, #8a3a6a 50%, #f07848 70%, #ffc070 82%, #ffe0a0 100%); }
  #mb .cover .sun { position: absolute; left: 50%; top: 61%; width: 46%; aspect-ratio: 1; transform: translate(-50%, -50%); border-radius: 50%;
    background: radial-gradient(circle, #fff6c8 0%, #ffd070 40%, rgba(255,160,80,0) 70%); }
  #mb .cover .rays { position: absolute; left: 50%; top: 61%; width: 160%; aspect-ratio: 1; transform: translate(-50%, -50%);
    background: repeating-conic-gradient(rgba(255,240,200,.13) 0 6deg, rgba(255,240,200,0) 6deg 16deg); border-radius: 50%;
    -webkit-mask: radial-gradient(circle, #000 0%, rgba(0,0,0,0) 62%); mask: radial-gradient(circle, #000 0%, rgba(0,0,0,0) 62%); }
  #mb .cover .stars { position: absolute; left: 0; right: 0; top: 0; height: 48%;
    background-image: radial-gradient(circle, #fff .07em, transparent .11em), radial-gradient(circle, #fff .05em, transparent .09em), radial-gradient(circle, #ffe8b0 .06em, transparent .1em);
    background-size: 5.1em 4.3em, 7.3em 5.9em, 3.7em 6.7em; background-position: .4em .7em, 2.3em 2.9em, 1.1em 3.4em; opacity: .8;
    -webkit-mask: linear-gradient(180deg, #000 40%, transparent); mask: linear-gradient(180deg, #000 40%, transparent); }
  #mb .cover .ground { position: absolute; left: -5%; right: -5%; bottom: 0; height: 21%; background: linear-gradient(180deg, #2c4a2c 0%, #1a2e1e 100%);
    border-radius: 50% 50% 0 0 / 22% 22% 0 0; }
  #mb .cover .ditch { position: absolute; left: 30%; right: 30%; bottom: 0; height: 15%; background: linear-gradient(180deg, #5a4630, #2a2018);
    clip-path: polygon(18% 0, 82% 0, 100% 100%, 0 100%); }
  #mb .cover .water { position: absolute; left: 46%; right: 46%; bottom: 0; height: 15%; background: linear-gradient(180deg, #8ab8e0, #3a6a9a); clip-path: polygon(30% 0, 70% 0, 100% 100%, 0 100%); opacity: .9; }
  #mb .cover .logo { position: absolute; left: 4%; right: 4%; top: 11%; z-index: 2; filter: drop-shadow(0 .3em 0 rgba(30,10,30,.55)) drop-shadow(0 0 1.2em rgba(255,200,120,.35)); }
  #mb .cover .logo img { width: 100%; }
  #mb .cover .egg { position: absolute; left: 50%; top: 34%; transform: translateX(-50%); width: 27%; z-index: 1;
    filter: drop-shadow(0 0 1em rgba(170,90,232,.85)) drop-shadow(0 0 .3em rgba(170,90,232,.9)); }
  #mb .cover .fam { position: absolute; left: 3%; right: 3%; bottom: 10%; display: flex; justify-content: center; align-items: flex-end; gap: 1.5%; z-index: 2;
    filter: drop-shadow(0 .25em .15em rgba(0,0,0,.45)); }
  #mb .cover .tagline { position: absolute; left: 0; right: 0; top: 66%; text-align: center; font: italic 900 .9em/1 "Futura", "Century Gothic", Arial, sans-serif;
    letter-spacing: .14em; color: #fff; text-shadow: 0 .12em 0 rgba(60,20,40,.6), 0 0 .8em rgba(255,140,80,.6); z-index: 2; }
  #mb .cover .gloss { position: absolute; inset: 0; z-index: 4; pointer-events: none;
    background: linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,255,255,.16) 38%, rgba(255,255,255,0) 46%, rgba(255,255,255,0) 70%, rgba(255,255,255,.07) 76%, rgba(255,255,255,0) 82%); }
  #mb .cover .foot { position: absolute; left: 0; right: 0; bottom: 0; height: 8%; background: #fbf8f2; color: #1c1624; display: flex; align-items: center;
    justify-content: space-between; padding: 0 5%; z-index: 3; box-shadow: 0 -.2em .4em rgba(0,0,0,.35); }
  #mb .cover .foot b { font: italic 900 1.05em/1 "Futura", "Century Gothic", Arial, sans-serif; letter-spacing: .1em; }
  #mb .cover .foot span { font: 700 .5em/1.2 Arial, sans-serif; letter-spacing: .14em; color: #6a6070; text-align: right; }
  #mb .cover.back .sky { background: linear-gradient(180deg, #1c1430 0%, #2a1c44 60%, #3a2450 100%); }
  #mb .bc { position: absolute; left: 10%; right: 10%; top: 14%; bottom: 12%; display: flex; flex-direction: column; align-items: center; text-align: center; z-index: 2; }
  #mb .bc .pub { margin-top: auto; font: italic 900 1.15em/1 "Futura", "Century Gothic", Arial, sans-serif; letter-spacing: .12em; }
  #mb .bc .pub small { display: block; font: 700 .42em/1.8 Arial, sans-serif; letter-spacing: .3em; color: #b8a8d0; font-style: normal; margin-top: .3em; }
  #mb .bc .fine { font: 500 .52em/1.5 Arial, sans-serif; color: #a898c0; margin-top: 1.4em; letter-spacing: .04em; }
  #mb .bc .bar { margin-top: 1.4em; height: 3.2em; width: 9em; background: repeating-linear-gradient(90deg, #fff 0 .14em, transparent .14em .3em, #fff .3em .36em, transparent .36em .5em, #fff .5em .72em, transparent .72em .86em);
    border: .5em solid #fff; outline: .1em solid #fff; box-sizing: content-box; filter: invert(0); background-color: transparent; }
  #mb .bc .printed { margin-top: .8em; font: 800 .5em/1 Arial, sans-serif; letter-spacing: .3em; color: #d8c8f0; }
  `;

  // ---------------------------------------------------------------- the game's art, blown up
  const urls = new Map();
  function src(c) {
    if (!c) return '';
    if (!urls.has(c)) { try { urls.set(c, c.toDataURL()); } catch (e) { urls.set(c, ''); } }
    return urls.get(c);
  }
  // a sprite at `scale` game pixels per... sixteenth of an em (so it grows with the page)
  function px(c, scale, style = '') {
    if (!c) return '';
    return `<img class="px" src="${src(c)}" style="width:${(c.width * scale / 16).toFixed(3)}em;${style}" alt="">`;
  }
  const S = () => G.spr, P = () => G.sprites;
  const pick = (f) => { try { return f(); } catch (e) { return null; } };
  const face = (id) => pick(() => (id === 'nate' ? P().nate || P().nate_nocap : P()[id]).down[0]);

  // the logo, the way the title screen draws it
  function logo() {
    const F = G.font, c = G.canvas(G.W, 72), x = c.getContext('2d');
    const grad = (row) => ['#fff4b0', '#ffe070', '#ffd040', '#ffb830', '#ff9a28', '#f07820', '#e05818', '#c84818', '#a83810'][row] || '#a83810';
    const small = 'JOURNEY TO THE';
    F.draw(x, small, Math.round((G.W - F.width(small)) / 2), 2, '#ffffff', { shadow: '#1c1424' });
    F.drawBig(x, 'NUMBER ONE', Math.round((G.W - F.bigWidth('NUMBER ONE', 2)) / 2), 13, 2, grad, '#2a1420');
    F.drawBig(x, 'DITCH', Math.round((G.W - F.bigWidth('DITCH', 3)) / 2), 34, 3, grad, '#2a1420');
    return c;
  }

  // a made-up "screenshot" of play, for the screen-layout page: grass, a path, Nate, an egglet
  // and a heart, under the real HUD bits
  function playShot() {
    const c = G.canvas(G.W, G.H), x = c.getContext('2d'), F = G.font, sp = S();
    x.fillStyle = '#5a9a48'; x.fillRect(0, 0, G.W, G.H);
    for (let i = 0; i < 260; i++) { const a = (i * 97) % G.W, b = (i * 53 + (i * i) % 41) % G.H; x.fillStyle = i % 3 ? '#4a8a3c' : '#6aaa54'; x.fillRect(a, b, 2, 1); x.fillRect(a + 1, b - 1, 1, 1); }
    x.fillStyle = '#c8a870'; x.fillRect(0, 92, G.W, 22); x.fillStyle = '#b89860'; for (let i = 0; i < G.W; i += 7) x.fillRect(i, 92 + (i % 3) * 7, 3, 1);
    for (const [fx, fy, col] of [[30, 40, '#f8d850'], [60, 130, '#ff98d0'], [190, 50, '#ffffff'], [170, 136, '#f8d850'], [120, 30, '#ff98d0']]) { x.fillStyle = col; x.fillRect(fx, fy, 2, 2); x.fillStyle = '#3a6a30'; x.fillRect(fx, fy + 2, 1, 2); }
    const n = face('nate');
    if (n) x.drawImage(n, 104, 104 - n.height);
    const eg = pick(() => sp.egglet.right[0]);
    if (eg) x.drawImage(eg, 158, 108 - eg.height);
    const hp = pick(() => sp.heart.full);
    if (hp) x.drawImage(hp, 76, 98);
    // the HUD
    for (let i = 0; i < 6; i++) { const im = i < 4 ? sp.heart.full : i === 4 ? sp.heart.half : sp.heart.empty; x.drawImage(im, 5 + i * 8, 5); }
    const box = (bx, label, icon, count) => {
      G.box(x, bx, 5, 22, 22);
      if (icon) x.drawImage(icon, bx + 11 - Math.floor(icon.width / 2), 16 - Math.floor(icon.height / 2));
      F.draw(x, label, bx + 2, 2, '#f8d850', { shadow: '#1c1424' });
      if (count != null) F.draw(x, String(count), bx + 15, 18, '#f8f8f0', { shadow: '#1c1424' });
    };
    // (only gear that's been found: the first one, or an empty box)
    const xs = [['chicken', () => sp.chickens.white.right[0], 12], ['package', () => sp.gift, 5], ['doosh', () => sp.doosh, 3]].find(([id]) => found.has(id));
    box(G.W - 52, 'X', xs ? pick(xs[1]) : null, xs ? xs[2] : null);
    box(G.W - 27, 'Z', found.has('hammer') ? pick(() => sp.hammer.up) : null);
    x.drawImage(sp.tooth, 5, G.H - 14);
    F.draw(x, '047', 15, G.H - 13, '#f8f8f0', { shadow: '#1c1424' });
    return c;
  }

  // the title screen, as it is right now (with the cursor back on the first option)
  function titleShot() {
    const c = G.canvas(G.W, G.H), x = c.getContext('2d'), t = G.title, sel = t.sel;
    try { t.sel = 0; t.draw(x); } catch (e) { x.fillStyle = '#000'; x.fillRect(0, 0, G.W, G.H); }
    t.sel = sel;
    return c;
  }

  // ---------------------------------------------------------------- the pages
  // Each page: { ac: accent color, html(side, n) } where side is 'left'/'right' and n is its
  // printed page number (null on the covers).
  const AC = { red: '#d8402c', orange: '#e8782a', gold: '#d8a020', green: '#3a9a4a', teal: '#1a8a9a', blue: '#3a6ac8', indigo: '#5a4ab8', purple: '#8a3aa8', pink: '#d0457a', slate: '#5a6078' };
  const pageNo = (n) => G.sayable ? G.sayable(n) : String(n);

  function frame(title, ac, body, side, n, opt = {}) {
    return `<div class="pg ${side}" style="--ac:${ac}"><div class="in">
      <div class="hdr"><h2><span>${title}</span></h2><div class="rule"></div></div>
      ${body}</div>
      <div class="ftr">${side === 'left' ? `<span class="pn">${pageNo(n)}</span>Journey to the Number One Ditch` : `Instruction Booklet<span class="pn">${pageNo(n)}</span>`}</div></div>`;
  }

  const who = (id, name, tag, bio, skill, art) => `<div class="who"><div class="pic">${art || px(face(id), 3.2, 'margin-bottom:.15em')}</div><div>
    <div class="nm">${name}<small>${tag}</small></div><p>${bio}</p>${skill ? `<div class="sk"><b>Along for the ride:</b> ${skill}</div>` : ''}</div></div>`;
  const item = (icon, name, text) => `<div class="item"><div class="ic">${px(icon, 2)}</div><div><b>${name}</b><p>${text}</p></div></div>`;
  // Gear nobody's found yet stays a secret: blacked out, with a "?" (no spoilers). "Found" means on
  // any of the save files (the booklet opens from the title screen, so there's no game going).
  let found = new Set();
  function foundGear() {
    const keep = G.state, got = new Set();
    try {
      for (let n = 1; n <= (G.SAVE_FILES || 3); n++) {
        const sv = G.readSave(n);
        if (!sv) continue;
        G.state = sv;
        for (const id of G.GEAR_SLOTS) if (id) { try { if (G.itemHas(id)) got.add(id); } catch (e) { /* (an item that can't tell) */ } }
      }
    } finally { G.state = keep; }
    return got;
  }
  // the icon as a solid black shape
  const blacked = new Map();
  function blackout(c) {
    if (!c) return null;
    if (!blacked.has(c)) {
      const b = G.canvas(c.width, c.height), x = b.getContext('2d');
      x.drawImage(c, 0, 0); x.globalCompositeOperation = 'source-atop'; x.fillStyle = '#0c0a10'; x.fillRect(0, 0, c.width, c.height);
      blacked.set(c, b);
    }
    return blacked.get(c);
  }
  const gear = (id, icon, name, text) => found.has(id) ? item(icon, name, text)
    : `<div class="item locked"><div class="ic">${px(blackout(icon), 2)}<i>?</i></div><div><b>???</b><p>You haven't found this yet.</p></div></div>`;
  const key = (x, y, w, h, label, n) => `<div class="key${n ? ' hot' : ''}" style="left:${x}em;top:${y}em;width:${w}em;height:${h}em"><span>${label}</span>${n ? `<i class="kn">${n}</i>` : ''}</div>`;

  function buildPages() {
    found = foundGear();
    const sp = S(), shotTitle = titleShot(), shotPlay = playShot();
    const pages = [];

    // ---- the front cover
    pages.push({ cover: true, html: () => {
      const fam = ['doron', 'lily', 'nate', 'abe', 'hannah'].map((id) => px(face(id), id === 'nate' ? 4.2 : 3.6)).join('') + px(pick(() => sp.romulus.right.stand), 3.3);
      const cube = `<svg class="cube" viewBox="0 0 20 20"><polygon points="10,1 19,5.5 10,10 1,5.5" fill="#ffb830"/><polygon points="1,5.5 10,10 10,19 1,14.5" fill="#e05818"/><polygon points="19,5.5 10,10 10,19 19,14.5" fill="#a83810"/><text x="10" y="8.2" font-size="5.5" font-weight="900" text-anchor="middle" fill="#2a1420" font-family="Arial">1</text></svg>`;
      return `<div class="cover"><div class="sky"></div><div class="stars"></div><div class="rays"></div><div class="sun"></div>
        <div class="band">${cube}<span><b>FAMILY</b> ENTERTAINMENT SYSTEM</span></div>
        <div class="egg">${px(sp.eggmas, 7, 'width:100%')}</div>
        <div class="logo"><img class="px" src="${src(logo())}" alt=""></div>
        <div class="tagline">THE BEST DITCH IN THE WORLD IS IN DANGER</div>
        <div class="ground"></div><div class="ditch"></div><div class="water"></div>
        <div class="fam">${fam}</div>
        <div class="foot"><b>INSTRUCTION BOOKLET</b><span>FOR 1 PLAYER<br>AND THE WHOLE FAMILY</span></div><div class="gloss"></div></div>`;
    } });

    // ---- 1: the warning
    pages.push({ html: (side, n) => frame('Please Read', AC.slate, `
      <div class="warn"><h4><i>!</i>WARNING</h4>
        <p class="caps">Please read this booklet before playing.</p>
        <p>A very small percentage of players may experience a sudden, overwhelming urge to drive to Chesapeake, Virginia. If you or any member of your family experiences this, stop playing and text the family group chat immediately.</p>
        <p>This game contains bonking, a booby-trapped Christmas present or two, at least one 2 AM Taco Bell run, mild egg-related peril and a very large amount of EEENGLISH.</p></div>
      <div class="warn"><h4><i>!</i>EARWORM ADVISORY</h4>
        <p>Some songs in this game may stay stuck in your head for days. Earplugs are recommended where noted. The makers of this game are not responsible for any humming.</p></div>
      <h3 style="color:#2a2630">Precautions</h3>
      <ul class="legend" style="margin-top:.2em">
        <li><span class="num" style="background:#2a2630">&#9632;</span><p>Take a 15-minute break every hour, or whenever Romulus needs to go out.</p></li>
        <li><span class="num" style="background:#2a2630">&#9632;</span><p>Play in a well-lit room, at a safe distance from the screen and from Doron's luchador masks.</p></li>
        <li><span class="num" style="background:#2a2630">&#9632;</span><p>Do not try any of Nate's fireworks at home. Or at the fair.</p></li>
      </ul>
      <div class="box" style="--ac:${AC.orange}"><span class="tag">ABE'S RULE #1</span>
        <p><b>Nate may not say the sacred number.</b> Not out loud, not in a text, not even on the HUD. Any number that would contain it is written as a sum instead. This booklet follows the rule too: check the page numbers.</p></div>`, side, n) });

    // ---- 2: contents
    const TOC = [['The Story', 3, AC.red], ['Controls', 4, AC.blue], ['Getting Started', 5, AC.green], ['The Game Screen', 6, AC.teal], ['The Pause Menu', 7, AC.indigo],
      ['Fainting and Healing', 8, AC.pink], ['The Family', 9, AC.orange], ['Your Gear', 11, AC.gold], ['Shark Teeth and Collectables', 13, AC.teal], ['The Road Trip', 14, AC.green],
      ['Beware!', 15, AC.purple], ['Hints and Tips', 16, AC.blue], ['Credits', 17, AC.red]];
    pages.push({ html: (side, n) => frame('Contents', AC.indigo, `
      <ul class="toc">${TOC.map(([t, p, c]) => `<li><span class="sw" style="background:${c}"></span>${t}<span class="dots"></span><span class="p">${pageNo(p)}</span></li>`).join('')}</ul>
      <div class="box" style="--ac:${AC.indigo}"><span class="tag">ABOUT THIS BOOKLET</span>
        <p>Use <b>&larr;</b> and <b>&rarr;</b> (or click a page) to turn the pages. Press <b>X</b> or <b>Esc</b> to put the booklet back in the case.</p></div>
      <div style="position:absolute;left:0;right:0;bottom:1.2em;display:flex;justify-content:center;align-items:flex-end;gap:.5em">
        ${['nate', 'doron', 'lily', 'abe', 'hannah'].map((id) => px(face(id), 2.6)).join('')}${px(pick(() => sp.romulus.right.stand), 2.4)}
        <span style="width:1.4em"></span>${px(pick(() => sp.egglet.left[0]), 2.6)}${px(pick(() => sp.egglet.left[1]), 2.6)}</div>
      <div style="position:absolute;left:-2%;right:-2%;bottom:.9em;height:.25em;border-radius:.2em;background:color-mix(in srgb, ${AC.indigo} 30%, #fff)"></div>`, side, n) });

    // ---- 3: the story
    pages.push({ html: (side, n) => frame('The Story', AC.red, `
      <p class="lead">Every Christmas, he comes out of his box and takes his place on the mantel: a plush egg, dressed for the holidays, with a smile that never quite reaches his eyes. The family calls him <b>Father Eggmas</b>.</p>
      <p>This year, his shelf is empty.</p>
      <div class="row" style="align-items:center;margin:.4em 0 .8em">
        <div style="flex:none;width:30%">${px(sp.eggmas, 3.2, 'width:100%;filter:drop-shadow(0 0 .4em rgba(138,58,168,.6))')}</div>
        <div class="col"><div class="box" style="--ac:${AC.red};margin:0"><span class="tag">THE NOTE HE LEFT</span><p style="font:italic 800 .8em/1.3 'Futura','Century Gothic',Arial,sans-serif">"THE NUMBER ONE DITCH SHALL BE MINE. HO HO HO."</p></div></div>
      </div>
      <p>Down in Chesapeake, Virginia, there's a ditch. Gravel, mud, a trickle of water and shark teeth, if you know how to look. It is, by any reasonable measure, the best ditch in the world. And now it's in danger.</p>
      <p>Nate is a geology major at Lafayette College in Easton, Pennsylvania, two drops of base away from a perfectly neutral solution, when his phone starts buzzing. The family group chat has questions. The ditch needs him.</p>
      <p>Grab your rock hammer. Round up the family. Find out what Father Eggmas has been up to on the way. And whatever you do, don't say the sacred number.</p>`, side, n) });

    // ---- 4: controls
    pages.push({ html: (side, n) => {
      const K = 1.9, kb = [
        key(0, 0, K, K, 'Q', '5'), key(2.1, 0, K, K, 'W', '1'), key(4.2, 0, K, K, 'E', '5'),
        key(0.5, 2.1, K, K, 'A', '1'), key(2.6, 2.1, K, K, 'S', '1'), key(4.7, 2.1, K, K, 'D', '1'),
        key(1, 4.2, K, K, 'Z', '2'), key(3.1, 4.2, K, K, 'X', '3'), key(7.3, 4.2, K, K, 'M', pageNo(6)),
        key(2, 6.3, 8, 1.6, 'SPACE = Z', 0),
        key(11.6, 1.05, 3.6, K * 1.6, 'ENTER', '4'),
        key(18.6, 2.1, K, K, '&uarr;', '1'), key(16.5, 4.2, K, K, '&larr;', '1'), key(18.6, 4.2, K, K, '&darr;', '1'), key(20.7, 4.2, K, K, '&rarr;', '1'),
      ].join('');
      const rows = [
        ['Arrow keys / WASD', 'Walk. In menus, move the cursor.'],
        ['Z', 'Swing the rock hammer. Talk, read signs, look at things and pick them up. Confirm.'],
        ['X', 'Use whatever item is set to X (some work while you hold it). Back out of menus.'],
        ['Enter', 'Open the pause menu.'],
        ['Q / E', 'Flip between the pause menu\'s pages.'],
        ['M', 'Mute or unmute the sound.'],
      ];
      return frame('Controls', AC.blue, `
        <p>Journey to the Number One Ditch is played on a keyboard. The keys you'll use most are lit up below.</p>
        <div style="position:relative;font-size:1.1em;margin:.9em 0 .3em;padding:.9em 0 .5em .7em;border-radius:.8em;background:linear-gradient(180deg,#d8d4e0,#bcb6c8);box-shadow:inset 0 .1em 0 #fff, 0 .25em .5em rgba(0,0,0,.25)">
          <div class="kb" style="height:8.1em">${kb}</div></div>
        <ul class="legend">${rows.map(([k, t], i) => `<li><span class="num">${pageNo(i + 1)}</span><p><b>${k}:</b> ${t}</p></li>`).join('')}</ul>
        <div class="box" style="--ac:${AC.blue}"><span class="tag">TIP</span><p>Sometimes you'll be playing as someone other than Nate. Their special move is always on <b>Z</b>, and the Z box in the corner of the screen says what it is.</p></div>`, side, n);
    } });

    // ---- 5: getting started
    pages.push({ html: (side, n) => frame('Getting Started', AC.green, `
      <div style="width:78%;margin:0 auto"><img class="px shot" src="${src(shotTitle)}" alt=""></div><div class="cap">The title screen. Choose with &uarr; and &darr;, then press Z.</div>
      <ul class="legend" style="margin-top:.7em">
        <li><span class="num">1</span><p><b>Continue:</b> pick up the file you played last.</p></li>
        <li><span class="num">2</span><p><b>Load File:</b> choose any of your three save files.</p></li>
        <li><span class="num">3</span><p><b>New Game:</b> start the journey from Nate's lab.</p></li>
        <li><span class="num">4</span><p><b>Admin:</b> jump to any part of the story. You didn't see this.</p></li>
        <li><span class="num">5</span><p><b>Manual:</b> you're reading it.</p></li>
      </ul>
      <div class="box" style="--ac:${AC.green}"><span class="tag">SAVING</span><p>The game saves by itself every time Nate walks through a door. Check on your file from the <b>SAVE</b> page of the pause menu.</p></div>`, side, n) });

    // ---- 5+1: the game screen
    pages.push({ html: (side, n) => frame('The Game Screen', AC.teal, `
      <div style="position:relative"><img class="px shot" src="${src(shotPlay)}" alt="">
        ${[[3, 13, 1], [76, 13, 2], [88, 13, 3], [3, 86, 4], [44, 58, 5], [69, 70, 6]].map(([l, t, k]) => `<span class="num" style="position:absolute;left:${l}%;top:${t}%;font-size:.85em">${pageNo(k)}</span>`).join('')}</div>
      <ul class="legend" style="margin-top:.9em">
        <li><span class="num">1</span><p><b>Hearts:</b> Nate's health. Each hit takes half a heart or more. Run out and he faints.</p></li>
        <li><span class="num">2</span><p><b>X box:</b> the item set to X. The little number is how many are left.</p></li>
        <li><span class="num">3</span><p><b>Z box:</b> the rock hammer, or the special move of whoever you're playing as.</p></li>
        <li><span class="num">4</span><p><b>Shark teeth:</b> how many Nate has collected. It never shows the sacred number.</p></li>
        <li><span class="num">5</span><p><b>Nate.</b> Thinks about pH often.</p></li>
        <li><span class="num">5+1</span><p><b>Trouble.</b> Something that would like a word. Bonk it.</p></li>
      </ul>`, side, n) });

    // ---- 7: the pause menu
    const TABS = [['QUESTS', 'What you\'re doing now, what\'s left to find, and the rules (Abe\'s, mostly).'], ['MAP', 'Where you are, and where you\'ve been.'],
      ['ITEMS', 'Your gear. Pick one and set it to X.'], ['KEYS', 'Key items: things for other people, things that open things, and Dad\'s pipe book.'],
      ['PEOPLE', 'Everyone you\'ve met, and what they\'re like.'], ['COLLECTABLES', 'Rocks, photos, pipes, fish and more. Your collections, piece by piece.'],
      ['SAVE', 'Check on your file.'], ['BOSS RUSH', 'Fight every boss again, back to back. Opens up late in the game.']];
    pages.push({ html: (side, n) => frame('The Pause Menu', AC.indigo, `
      <p>Press <b>Enter</b> any time you're walking around to pause and open the menu. Press <b>Q</b> and <b>E</b> to flip between its pages, and <b>X</b> or <b>Enter</b> to close it.</p>
      <ul class="legend" style="margin-top:.7em">${TABS.map(([t, d]) => `<li><span class="num" style="width:9.4em;border-radius:.4em;font-size:.56em;height:1.8em;letter-spacing:.06em">${t}</span><p>${d}</p></li>`).join('')}</ul>
      <div class="box" style="--ac:${AC.indigo}"><span class="tag">NOTE</span><p>Some pages don't show up until the story gets to them.</p></div>`, side, n) });

    // ---- 8: fainting and healing
    pages.push({ html: (side, n) => frame('Fainting and Healing', AC.pink, `
      <h3>When the hearts run out</h3>
      <p>If Nate loses all of his hearts, he faints. Whoever's with him will help him back up. Choose <b>Continue</b> to go back to your last save with full hearts.</p>
      <p>Fainting costs a little: about <b>15%</b> of the shark teeth Nate is carrying fall out of his pockets.</p>
      <h3>Getting hearts back</h3>
      ${item(sp.heart.full, 'Hearts', 'Some troublemakers drop a heart when you bonk them. Walk over it to pick it up.')}
      ${gear('doosh', sp.doosh, 'Doosh De Luche', 'Heals 4 hearts. Nate can carry three. (It\'s pronounced dulce de leche.)')}
      ${gear('firstAid', sp.firstAidIcon, 'Hannah\'s First-Aid Kit', 'Patches Nate up for 3 hearts. Holds 3 uses, and any supply closet at CHKD restocks it.')}
      ${gear('tacoBag', sp.tacoBag, 'Fourthmeal', 'Every heart back, all at once. From a certain late-night drive-thru.')}
      <div class="box" style="--ac:${AC.pink}"><span class="tag">TIP</span><p>Hannah heals Nate a little while she's following him. Nurse's orders.</p></div>`, side, n) });

    // ---- 9, 10: the family
    pages.push({ html: (side, n) => frame('The Family', AC.orange, `
      ${who('nate', 'Nate', 'You', 'Geology major at Lafayette. Makes his own fireworks. Thinks about pH often.', null)}
      ${who('doron', 'Doron', 'Oldest brother', 'Army vet. Obsessed with the UFC. Never skips leg day. Owns three luchador masks.', 'Lifts and smashes heavy things.')}
      ${who('lily', 'Lily', 'Sister', 'Survived a refrigerator. Still subscribed to Badlands Chugs. Rates everything by how far it is from a Taco Bell.', 'A "No." that pops balloons.')}
      ${who('abe', 'Abe', 'Brother', 'Lives in Chesapeake with Hannah and Romulus. Owns more guitars than anybody needs and way too many yellow cables. Keeper of the sacred number.', 'Gets things down from way up high, and boosts Nate over tall hedges.')}`, side, n) });
    pages.push({ html: (side, n) => frame('The Family', AC.orange, `
      ${who('hannah', 'Hannah', 'Sister-in-law', 'Married to Abe. A NICU nurse at CHKD. Reads fantasy every spare minute, and will stop the car for any animal.', 'Animals trust her, so they won\'t attack. She also heals Nate.')}
      ${who('romulus', 'Romulus', 'The good boy', 'Abe and Hannah\'s dog. Hannah is his favorite person. Hates baths.', null, px(pick(() => sp.romulus.right.stand), 2.6, 'margin-bottom:.5em'))}
      ${who('dad', 'Dad', 'The pastor', 'Carves pipes in his workshop and keeps a little book of every one. Asks everyone if they speak EEENGLISH.', null)}
      ${who('michelle', 'Mom', 'Michelle', 'Flower farmer. Works at the church. NOT "the pastor\'s wife." Yells "Jamie Lee Curtis" when startled.', null)}`, side, n, { wide: true }) });

    // ---- 11, 12: gear
    pages.push({ html: (side, n) => frame('Your Gear', AC.gold, `
      <p>Nate finds gear all over the road trip. Set one to <b>X</b> from the <b>ITEMS</b> page of the pause menu. Gear you haven't found yet stays a secret.</p>
      ${gear('hammer', pick(() => sp.hammer.up), 'Rock Hammer', 'A geologist\'s best friend. Bonks troublemakers, smashes rocks open, and breaks things that are asking for it.')}
      ${gear('package', sp.gift, 'Booby-Trapped Package', 'Set one down with X. It goes BANG a few seconds later. Merry Christmas!')}
      ${gear('chicken', pick(() => sp.chickens.white.right[0]), 'The Chicken', 'Henrietta, from Mom\'s flower stand. Press X and she fires an egg. Eggs sold separately.')}
      ${gear('pipe', sp.pipe, 'Dad\'s Pipe', 'Hand-carved by Dad. Press X and puff a song: each direction is a different note.')}
      ${gear('bidet', sp.bidetIcon, 'Portable Bidet', 'Hold X to spray. When it runs dry, face water, a sink or a toilet and hold X to fill it back up.')}`, side, n) });
    pages.push({ html: (side, n) => frame('Your Gear', AC.gold, `
      ${gear('rod', sp.rodIcon, 'Surf Rod', 'Press X to cast. Whatever you hook gets reeled in: fish, gulls, teeth... people.')}
      ${gear('sifter', sp.sifter, 'Sifter', 'Press X to shake the gravel in front of you through it. Good for finding the small stuff.')}
      ${gear('doosh', sp.doosh, 'Doosh De Luche', 'A snack that heals 4 hearts. No time to eat it during a boss fight.')}
      ${gear('firstAid', sp.firstAidIcon, 'First-Aid Kit', 'Gauze, tape, ice packs and dinosaur bandages.')}
      ${gear('tacoBag', sp.tacoBag, 'Fourthmeal', 'Bean burritos and somebody\'s Crunchwrap. Eat it to get every heart back.')}
      <div class="box" style="--ac:${AC.gold}"><span class="tag">KEY ITEMS</span><p>Some things you find aren't gear: a keyring, a library book, a slobbery badge. They go on the <b>KEYS</b> page, and they're usually for somebody. Talk to people.</p></div>`, side, n, { wide: true }) });

    // ---- 13: shark teeth and collectables
    pages.push({ html: (side, n) => frame('Shark Teeth & Collectables', AC.teal, `
      <div class="row" style="align-items:center"><div style="flex:none">${px(sp.tooth, 4)}</div>
        <div class="col"><h3 style="margin:0">Shark teeth</h3><p>The fossil shark teeth Nate collects along the way. They're money, too: vendors, Pyro Pete and Mom's flower stand all take them. Fainting knocks a few loose, so be careful out there.</p></div></div>
      <h3>Collectables</h3>
      <p>The <b>COLLECTABLES</b> page keeps track of everything you can collect, a section at a time:</p>
      <ul class="legend">
        <li><span class="num">&#9670;</span><p><b>Rocks:</b> specimens Nate digs up, smashes out or sifts.</p></li>
        <li><span class="num">&#9670;</span><p><b>Photos:</b> old family photos, hidden all over. Some of them Mom would rather nobody saw.</p></li>
        <li><span class="num">&#9670;</span><p><b>Dad's Pipes and Tobacco:</b> made with Dad in his workshop.</p></li>
        <li><span class="num">&#9670;</span><p><b>Matt's Survey:</b> every kind of fish you catch out on the bay.</p></li>
        <li><span class="num">&#9670;</span><p><b>Animal Friends</b> and <b>Instruments</b>, and a few more you'll find on your own.</p></li>
      </ul>`, side, n) });

    // ---- 14: the road trip
    const STOPS = [['Lafayette', 'Lafayette College, Easton, PA. Where it all starts.'], ['Easton Fair', 'The fairgrounds, east of campus. Games, rides and a main event.'],
      ['Home', 'Rattlesnake Bridge Road. Mom, Dad, Lily, and a workshop.'], ['Andover Mines', 'Iron country, since colonial times.'],
      ['The Bay', 'The Chesapeake Bay Bridge-Tunnel. Bring a fishing rod.'], ['Chesapeake', 'Abe and Hannah\'s place.'],
      ['CHKD', 'Norfolk, Virginia. Where Hannah works.'], ['The Number One Ditch', 'Chesapeake, Virginia. The best ditch in the world.']];
    pages.push({ html: (side, n) => frame('The Road Trip', AC.green, `
      <p>From a college lab in Pennsylvania to a ditch in Virginia, with a few stops along the way:</p>
      <ul class="legend" style="position:relative;margin-left:.2em">
        <span style="position:absolute;left:.52em;top:.6em;bottom:.9em;width:.16em;background:color-mix(in srgb, ${AC.green} 45%, #fff)"></span>
        ${STOPS.map(([t, d], i) => `<li style="position:relative"><span class="num" style="${i === STOPS.length - 1 ? `background:${AC.red}` : ''}">${i === STOPS.length - 1 ? '&#9733;' : '&#9679;'}</span><p><b>${t}:</b> ${d}</p></li>`).join('')}
      </ul>
      <div class="box" style="--ac:${AC.green}"><span class="tag">TIP</span><p>The <b>MAP</b> page shows where you are. If you're not sure where to go next, check <b>QUESTS</b>.</p></div>`, side, n) });

    // ---- 15: beware
    pages.push({ html: (side, n) => frame('Beware!', AC.purple, `
      <div class="row" style="align-items:center">
        <div style="flex:none;width:34%">${px(sp.eggmas, 3.4, 'width:100%;filter:drop-shadow(0 0 .5em rgba(138,58,168,.7))')}</div>
        <div class="col"><h3 style="margin-top:0">Father Eggmas</h3><p>The egg on the mantel. Jolly. Paisley. Up to something. He says "HO HO HO" a lot, and he never means it in a nice way.</p></div></div>
      <div class="row" style="align-items:center;margin-top:.6em">
        <div style="flex:none;width:18%;display:flex;justify-content:center">${px(pick(() => sp.egglet.right[0]), 3.2)}</div>
        <div class="col"><h3 style="margin-top:0">Egglets</h3><p>"Go, my little eggs!" They waddle, they chase, they say "ho ho." One good bonk is all it takes.</p></div></div>
      <div class="box" style="--ac:${AC.purple}"><span class="tag">WARNING</span><p>Nobody in the family has been acting quite like themselves lately. If somebody you love says something strange, they might need your help more than you think.</p></div>`, side, n) });

    // ---- 15+1: hints and tips
    pages.push({ html: (side, n) => frame('Hints & Tips', AC.blue, `
      <ul class="legend">
        <li><span class="num">1</span><p><b>Talk to everyone.</b> Twice. People say new things as the story goes on.</p></li>
        <li><span class="num">2</span><p><b>Look at everything.</b> Press Z on shelves, signs, trash cans and photos. You never know.</p></li>
        <li><span class="num">3</span><p><b>Check QUESTS</b> when you're stuck. It knows what you should be doing.</p></li>
        <li><span class="num">4</span><p><b>Bring the right person.</b> Some places need Doron's muscle, Abe's reach or Lily's "No."</p></li>
        <li><span class="num">5</span><p><b>Optional means optional.</b> Minigames and side quests are never required. They're just fun (and sometimes worth shark teeth).</p></li>
        <li><span class="num">5+1</span><p><b>Watch the number.</b> If somebody asks you a question with an obvious answer, think before you answer.</p></li>
        <li><span class="num">7</span><p><b>Try your gear on everything.</b> Most items do more than one thing.</p></li>
      </ul>
      <div class="box" style="--ac:${AC.blue}"><span class="tag">FROM THE FAMILY GROUP CHAT</span><p style="font-style:italic">"Be the light you wish to see in the world. Also wear a jacket." &nbsp;&mdash; Nani</p></div>`, side, n) });

    // ---- 17: credits
    pages.push({ html: (side, n) => frame('Credits', AC.red, `
      <div style="text-align:center;margin-top:.4em">
        <p style="font:italic 900 1.15em/1.2 'Futura','Century Gothic',Arial,sans-serif;color:#2a2238;margin-bottom:.2em">Made by Abe</p>
        <p style="font-size:.7em;color:#6a6070;margin-bottom:1.1em">for the family</p>
        <h3 style="text-align:center">Starring</h3>
        <p style="font-size:.74em;line-height:1.7">Nate &middot; Lily &middot; Doron &middot; Abe &middot; Hannah<br>Dad &middot; Mom &middot; Romulus</p>
        <h3 style="text-align:center">And introducing</h3>
        <p style="font-size:.74em;line-height:1.7">Father Eggmas, as himself</p>
        <div style="display:flex;justify-content:center;align-items:flex-end;gap:.4em;margin:1.2em 0">${['nate', 'lily', 'doron', 'abe', 'hannah', 'dad', 'michelle'].map((id) => px(face(id), 2.2)).join('')}${px(pick(() => sp.romulus.right.stand), 2)}</div>
        <h3 style="text-align:center">Special thanks</h3>
        <p style="font-size:.7em;line-height:1.6">Everybody in the family group chat, Nani's inspirational messages, Tyler and his sifter, and the Number One Ditch, for being the best ditch in the world.</p>
      </div>`, side, n) });

    // ---- 18, 19: notes (two of them, like the real ones, and just as empty)
    pages.push({ html: (side, n) => frame('Notes', AC.slate, `<div class="lines"></div>`, side, n) });
    pages.push({ html: (side, n) => frame('Notes', AC.slate, `<div class="lines"></div>`, side, n, { wide: true }) });

    // ---- the inside back cover: the warranty
    pages.push({ html: (side, n) => frame('Warranty', AC.slate, `
      <h3>Limited Warranty</h3>
      <p style="font-size:.66em;text-align:justify">This game is warranted to be a gift. It may not be returned, exchanged or regifted. (Some gifts in this family get taken back. This one won't.)</p>
      <p style="font-size:.66em;text-align:justify">This warranty does not cover damage caused by fireworks, booby-trapped packages, refrigerators, alligators, geese, or saying the sacred number.</p>
      <h3>Customer Service</h3>
      <p style="font-size:.66em;text-align:justify">Stuck? Text the family group chat. Response times vary. Nani will reply first, with something inspirational. Dad will ask if you speak EEENGLISH. Somebody will send a picture of Romulus.</p>
      <div class="box" style="--ac:${AC.slate}"><span class="tag">REMEMBER</span><p>Nobody touches that ditch.</p></div>`, side, n, { wide: true }) });

    // ---- the back cover
    pages.push({ cover: true, html: () => `<div class="cover back"><div class="sky"></div><div class="stars"></div>
      <div class="bc">
        <div style="width:40%;margin-top:6%">${px(sp.eggmas, 5, 'width:100%;filter:drop-shadow(0 0 .8em rgba(170,90,232,.7))')}</div>
        <p style="font:italic 900 1em/1.3 'Futura','Century Gothic',Arial,sans-serif;letter-spacing:.08em;margin-top:1.2em">HO. HO. HO.</p>
        <div class="pub">NUMBER ONE DITCH GAMES<small>CHESAPEAKE, VIRGINIA</small></div>
        <div class="fine">Journey to the Number One Ditch is a family game.<br>Any resemblance to actual family members is completely on purpose.</div>
        <div class="bar"></div>
        <div class="printed">PRINTED IN CHESAPEAKE</div>
      </div><div class="gloss"></div></div>` });

    return pages;
  }

  // ---------------------------------------------------------------- the booklet
  let root, book, slotL, slotR, pages = [], spread = 0, page = 0, flipping = false, single = false, built = false;

  function el(tag, cls, parent) { const e = document.createElement(tag); if (cls) e.className = cls; if (parent) parent.appendChild(e); return e; }

  function build() {
    if (built) return;
    built = true;
    const st = el('style'); st.textContent = CSS; document.head.appendChild(st);
    root = el('div', '', document.body); root.id = 'mb';
    const stage = el('div', 'mb-stage', root);
    book = el('div', 'mb-book', stage);
    slotL = el('div', 'mb-slot l', book); slotR = el('div', 'mb-slot r', book);
    const prev = el('div', 'mb-hit prev', book), next = el('div', 'mb-hit next', book);
    prev.addEventListener('click', () => turn(-1));
    next.addEventListener('click', () => turn(1));
    const x = el('div', 'mb-x', root); x.textContent = '×'; x.title = 'Close'; x.addEventListener('click', () => G.manual.close());
    root.ui = el('div', 'mb-ui', root);
    addEventListener('resize', () => { if (root.classList.contains('on')) { layout(); show(); } });
  }

  // fit the booklet to the window: a two-page spread when there's room, one page at a time when not
  function layout() {
    const vw = innerWidth, vh = innerHeight, R = 0.74;
    single = vw / vh < 1.1;
    let ph = vh * 0.86, pw = ph * R;
    const maxW = (vw * 0.94) / (single ? 1 : 2);
    if (pw > maxW) { pw = maxW; ph = pw / R; }
    root.classList.toggle('single', single);
    root.style.setProperty('--pw', pw + 'px'); root.style.setProperty('--ph', ph + 'px');
    book.style.width = (single ? pw : pw * 2) + 'px'; book.style.height = ph + 'px';
    book.style.fontSize = (ph / 42) + 'px';
  }

  const last = () => pages.length - 1;
  const lastSpread = () => Math.ceil(last() / 2);
  function pageHTML(i, side) {
    if (i < 0 || i > last()) return '';
    const pg = pages[i];
    return pg.cover ? `<div class="pg ${side}" style="background:none">${pg.html()}</div>` : pg.html(side, i);
  }
  // which pages a spread shows: the front cover alone on the right, then 1-2, 3-4..., and the
  // back cover alone on the left
  const spreadPages = (k) => [2 * k - 1, 2 * k];

  function fill(slot, i, side) { slot.innerHTML = pageHTML(i, side); slot.style.visibility = i < 0 || i > last() ? 'hidden' : 'visible'; }

  function show() {
    if (single) {
      fill(slotR, page, page === 0 || page === last() ? 'right' : (page % 2 ? 'left' : 'right'));
      slotL.style.visibility = 'hidden';
      book.style.transform = 'none';
    } else {
      const [l, r] = spreadPages(spread);
      fill(slotL, l, 'left'); fill(slotR, r, 'right');
      // (closed on a cover: the booklet sits in the middle)
      const pw = parseFloat(root.style.getPropertyValue('--pw'));
      book.style.transform = spread === 0 ? `translateX(${-pw / 2}px)` : spread === lastSpread() && r > last() ? `translateX(${pw / 2}px)` : 'none';
    }
    const at = single ? page : spread, end = single ? last() : lastSpread();
    root.ui.innerHTML = (at > 0 ? '<b>&larr;</b> back &nbsp; ' : '') + (at < end ? '<b>&rarr;</b> next page &nbsp; ' : '') + '<b>X</b> close';
  }

  // turn the page (d = 1 forward, -1 back), with the leaf swinging over the spine
  function turn(d) {
    if (flipping) return;
    if (single) {
      const to = page + d;
      if (to < 0 || to > last()) return;
      flipping = true;
      G.audio.sfx('menu');
      const leaf = el('div', 'mb-leaf', book), front = el('div', 'mb-face mb-front', leaf);
      el('div', 'mb-shade', front);
      if (d > 0) {
        front.insertAdjacentHTML('afterbegin', pageHTML(page, 'right'));
        page = to; fill(slotR, page, 'right');
        leaf.style.transition = 'transform .6s cubic-bezier(.45,.05,.35,1), opacity .6s';
        requestAnimationFrame(() => requestAnimationFrame(() => { leaf.classList.add('go'); leaf.style.transform = 'rotateY(-100deg)'; leaf.style.opacity = '0'; }));
      } else {
        front.insertAdjacentHTML('afterbegin', pageHTML(to, 'right'));
        leaf.style.transform = 'rotateY(-100deg)'; leaf.style.opacity = '0';
        leaf.style.transition = 'transform .6s cubic-bezier(.45,.05,.35,1), opacity .6s';
        requestAnimationFrame(() => requestAnimationFrame(() => { leaf.classList.add('go'); leaf.style.transform = 'rotateY(0deg)'; leaf.style.opacity = '1'; }));
        page = to;
      }
      setTimeout(() => { leaf.remove(); flipping = false; show(); }, 640);
      return;
    }
    const to = spread + d;
    if (to < 0 || to > lastSpread()) return;
    flipping = true;
    G.audio.sfx('menu');
    // the leaf between spreads k-1 and k: page 2(k-1) on the front, page 2k-1 on the back
    const k = d > 0 ? to : spread, leaf = el('div', 'mb-leaf', book);
    const front = el('div', 'mb-face mb-front', leaf), back = el('div', 'mb-face mb-back', leaf);
    front.insertAdjacentHTML('afterbegin', pageHTML(2 * (k - 1), 'right')); el('div', 'mb-shade', front);
    back.insertAdjacentHTML('afterbegin', pageHTML(2 * k - 1, 'left')); el('div', 'mb-shade', back);
    // underneath: the pages that'll be showing once it's over
    if (d > 0) { fill(slotR, 2 * to, 'right'); }
    else { fill(slotL, 2 * to - 1, 'left'); leaf.style.transform = 'rotateY(-180deg)'; }
    const pw = parseFloat(root.style.getPropertyValue('--pw'));
    const shift = to === 0 ? -pw / 2 : to === lastSpread() && 2 * to > last() ? pw / 2 : 0;
    leaf.style.transition = 'transform .75s cubic-bezier(.45,.05,.35,1)';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      leaf.classList.add('go');
      leaf.style.transform = d > 0 ? 'rotateY(-180deg)' : 'rotateY(0deg)';
      book.style.transform = shift ? `translateX(${shift}px)` : 'none';
    }));
    setTimeout(() => {
      spread = to;
      // (hide the old page under the leaf until the very end, so nothing peeks out)
      show(); leaf.remove(); flipping = false;
    }, 780);
  }

  // ---------------------------------------------------------------- the scene
  G.manual = {
    enter(back) {
      this.back = back || G.scene;
      build();
      pages = buildPages();
      spread = 0; page = 0; flipping = false;
      layout(); show();
      root.classList.add('on');
      G.scene = this;
      this.t = 0;
      G.audio.sfx('select');
    },
    // (jump straight to a spread, or a page in one-page mode: handy for checking the layout)
    go(k) { if (single) page = Math.max(0, Math.min(last(), k)); else spread = Math.max(0, Math.min(lastSpread(), k)); show(); },
    close() {
      if (!root || !root.classList.contains('on')) return;
      root.classList.remove('on');
      G.audio.sfx('cancel');
      G.scene = this.back || G.title;
    },
    update() {
      const inp = G.input;
      this.t++;
      if (inp.hit('right') || inp.hit('r') || inp.hit('a')) { inp.eat('a'); turn(1); }
      if (inp.hit('left') || inp.hit('l')) turn(-1);
      if (this.t > 10 && (inp.hit('b') || inp.hit('start'))) { inp.eat('b'); inp.eat('start'); this.close(); }
    },
    draw(ctx) {
      ctx.fillStyle = '#0c0a10'; ctx.fillRect(0, 0, G.W, G.H);
    },
  };
})();
