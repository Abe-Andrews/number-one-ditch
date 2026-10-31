'use strict';
// Hand-made bitmap font (GBA-style). Rows 0-6 sit on the baseline at row 6;
// rows 7-8 are descenders. '#' = ink.

(function () {
  const GLYPHS = {
    A: '.###./#...#/#...#/#####/#...#/#...#/#...#',
    B: '####./#...#/#...#/####./#...#/#...#/####.',
    C: '.###./#...#/#..../#..../#..../#...#/.###.',
    D: '####./#...#/#...#/#...#/#...#/#...#/####.',
    E: '#####/#..../#..../####./#..../#..../#####',
    F: '#####/#..../#..../####./#..../#..../#....',
    G: '.###./#...#/#..../#.###/#...#/#...#/.####',
    H: '#...#/#...#/#...#/#####/#...#/#...#/#...#',
    I: '###/.#./.#./.#./.#./.#./###',
    J: '..###/...#./...#./...#./#..#./#..#./.##..',
    K: '#...#/#..#./#.#../##.../#.#../#..#./#...#',
    L: '#..../#..../#..../#..../#..../#..../#####',
    M: '#...#/##.##/#.#.#/#.#.#/#...#/#...#/#...#',
    N: '#...#/##..#/#.#.#/#..##/#...#/#...#/#...#',
    O: '.###./#...#/#...#/#...#/#...#/#...#/.###.',
    P: '####./#...#/#...#/####./#..../#..../#....',
    Q: '.###./#...#/#...#/#...#/#.#.#/#..#./.##.#',
    R: '####./#...#/#...#/####./#.#../#..#./#...#',
    S: '.####/#..../#..../.###./....#/....#/####.',
    T: '#####/..#../..#../..#../..#../..#../..#..',
    U: '#...#/#...#/#...#/#...#/#...#/#...#/.###.',
    V: '#...#/#...#/#...#/#...#/#...#/.#.#./..#..',
    W: '#...#/#...#/#...#/#.#.#/#.#.#/##.##/#...#',
    X: '#...#/#...#/.#.#./..#../.#.#./#...#/#...#',
    Y: '#...#/#...#/.#.#./..#../..#../..#../..#..',
    Z: '#####/....#/...#./..#../.#.../#..../#####',
    a: '..../..../.##./...#/.###/#..#/.###',
    b: '#.../#.../###./#..#/#..#/#..#/###.',
    c: '..../..../.###/#.../#.../#.../.###',
    d: '...#/...#/.###/#..#/#..#/#..#/.###',
    e: '..../..../.##./#..#/####/#.../.###',
    f: '.##/#../###/#../#../#../#..',
    g: '..../..../.###/#..#/#..#/#..#/.###/...#/.##.',
    h: '#.../#.../###./#..#/#..#/#..#/#..#',
    i: '#/./#/#/#/#/#',
    j: '..#/.../..#/..#/..#/..#/..#/#.#/.#.',
    k: '#.../#.../#..#/#.#./##../#.#./#..#',
    l: '#/#/#/#/#/#/#',
    m: '...../...../####./#.#.#/#.#.#/#.#.#/#.#.#',
    n: '..../..../###./#..#/#..#/#..#/#..#',
    o: '..../..../.##./#..#/#..#/#..#/.##.',
    p: '..../..../###./#..#/#..#/#..#/###./#.../#...',
    q: '..../..../.###/#..#/#..#/#..#/.###/...#/...#',
    r: '.../.../#.#/##./#../#../#..',
    s: '..../..../.###/#.../.##./...#/###.',
    t: '.#./.#./###/.#./.#./.#./..#',
    u: '..../..../#..#/#..#/#..#/#..#/.###',
    v: '...../...../#...#/#...#/.#.#./.#.#./..#..',
    w: '...../...../#...#/#...#/#.#.#/#.#.#/.#.#.',
    x: '..../..../#..#/#..#/.##./#..#/#..#',
    y: '..../..../#..#/#..#/#..#/#..#/.###/...#/.##.',
    z: '..../..../####/...#/.##./#.../####',
    0: '.##./#..#/#.##/##.#/#..#/#..#/.##.',
    1: '.#./##./.#./.#./.#./.#./###',
    2: '.##./#..#/...#/..#./.#../#.../####',
    3: '###./...#/...#/.##./...#/...#/###.',
    4: '#..#/#..#/#..#/####/...#/...#/...#',
    5: '####/#.../#.../###./...#/...#/###.',
    6: '.##./#.../#.../###./#..#/#..#/.##.',
    7: '####/...#/..#./.#../.#../.#../.#..',
    8: '.##./#..#/#..#/.##./#..#/#..#/.##.',
    9: '.##./#..#/#..#/.###/...#/...#/.##.',
    '.': '././././././#',
    ',': '././././././#/#',
    '!': '#/#/#/#/#/./#',
    '?': '.##./#..#/...#/..#./.#../..../.#..',
    "'": '#/#/./././.',
    '"': '#.#/#.#/.../.../.../.../...',
    '-': '.../.../.../###/.../.../...',
    ':': './././#/././#',
    ';': './././#/././#/#',
    '(': '.#/#./#./#./#./#./.#',
    ')': '#./.#/.#/.#/.#/.#/#.',
    '/': '...#/...#/..#./.#../.#../#.../#...',
    '+': '...../...../..#../.###./..#../...../.....',
    '=': '..../..../####/..../####/..../....',
    '*': '..#../..#../#####/.###./.#.#./#...#/.....',
    '>': '#.../.#../..#./...#/..#./.#../#...',
    '<': '...#/..#./.#../#.../.#../..#./...#',
    '[': '##/#./#./#./#./#./##',
    ']': '##/.#/.#/.#/.#/.#/##',
    '&': '.#../#.#./#.#./.#../#.##/#..#/.##.',
    '%': '##..#/##.#./..#../.#.../#.##./#..##/.....',
    '~': '...../...../.#..#/#.##./...../...../.....',
    '_': '..../..../..../..../..../..../####',
    // arrows for smoke signal sequences
    '↑': '..#../.###./#.#.#/..#../..#../..#../.....',
    '↓': '...../..#../..#../..#../#.#.#/.###./..#..',
    '←': '...../..#../.#.../#####/.#.../..#../.....',
    '→': '...../..#../...#./#####/...#./..#../.....',
    '★': '...../..#../..#../#####/.###./.#.#./#...#',
    '✓': '...../....#/...#./#..#./.##../.#.../.....',
    '♪': '..#../..##./..#.#/..#../.##../###../.#...',
    '♫': '.####/.#..#/.#..#/.#..#/##.##/##.##/.....',
    '■': '..../####/####/####/####/..../....',
    '°': '.##./#..#/.##./..../..../..../....',
  };
  const ROWS = 9;
  const parsed = {};
  for (const ch in GLYPHS) {
    const rows = GLYPHS[ch].split('/');
    parsed[ch] = { w: rows[0].length, rows };
  }
  parsed[' '] = { w: 3, rows: [] };

  const COLORS = {
    w: '#f8f8f0', k: '#282030', r: '#f86858', b: '#68a8ff', g: '#78e070',
    y: '#f8d850', p: '#ff98d0', o: '#ffa848', v: '#c898ff', d: '#9890a8', c: '#78e8e8',
  };

  const cache = new Map();
  function glyph(ch, color) {
    const key = ch + color;
    let c = cache.get(key);
    if (c) return c;
    const g = parsed[ch] || parsed['?'];
    c = G.canvas(Math.max(1, g.w), ROWS);
    const x = c.getContext('2d');
    x.fillStyle = color;
    g.rows.forEach((row, y) => {
      for (let i = 0; i < row.length; i++) if (row[i] === '#') x.fillRect(i, y, 1, 1);
    });
    c.adv = g.w + 1;
    cache.set(key, c);
    return c;
  }

  // Split text into runs, honoring {r} style color codes.
  function tokens(str, base) {
    const out = [];
    let color = base;
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (ch === '{') {
        const end = str.indexOf('}', i);
        const code = str.slice(i + 1, end);
        color = code === '/' ? base : (COLORS[code] || code);
        i = end;
        continue;
      }
      out.push({ ch, color });
    }
    return out;
  }

  function charW(ch) {
    const g = parsed[ch] || parsed['?'];
    return g.w + 1;
  }

  function width(str) {
    let w = 0;
    for (const t of tokens(str, '')) w += charW(t.ch);
    return Math.max(0, w - 1);
  }

  // Draws text; `max` limits the number of visible characters (typewriter).
  function draw(ctx, str, x, y, color = COLORS.w, opt = {}) {
    const toks = tokens(str, color);
    const n = opt.max == null ? toks.length : Math.min(opt.max, toks.length);
    if (opt.shadow) {
      let cx = x;
      for (let i = 0; i < n; i++) {
        ctx.drawImage(glyph(toks[i].ch, opt.shadow), cx + 1, y + 1);
        cx += charW(toks[i].ch);
      }
    }
    let cx = x;
    for (let i = 0; i < n; i++) {
      const t = toks[i];
      if (t.ch !== ' ') ctx.drawImage(glyph(t.ch, t.color), cx, y);
      cx += charW(t.ch);
    }
    return cx - x;
  }

  // Word-wrap to lines no wider than maxW. Color codes carry across lines.
  function wrap(str, maxW) {
    const lines = [];
    for (const para of str.split('\n')) {
      let line = '';
      let carry = '';
      for (const word of para.split(' ')) {
        const test = line ? line + ' ' + word : word;
        if (width(test) > maxW && line) {
          lines.push(carry + line);
          carry = lastColor(carry + line);
          line = word;
        } else {
          line = test;
        }
      }
      lines.push(carry + line);
    }
    return lines;
  }

  function lastColor(str) {
    const m = str.match(/\{[^}]*\}(?!.*\{)/);
    return m && m[0] !== '{/}' ? m[0] : '';
  }

  function visibleLength(str) {
    return tokens(str, '').length;
  }

  // Big title text: draws each glyph scaled with a thick outline.
  function drawBig(ctx, str, x, y, scale, fill, outline) {
    let cx = x;
    for (const ch of str) {
      const g = parsed[ch] || parsed['?'];
      for (const [dx, dy, col] of [[-1, 0, outline], [1, 0, outline], [0, -1, outline], [0, 1, outline], [1, 1, outline], [-1, 1, outline], [1, -1, outline], [-1, -1, outline], [0, 0, null]]) {
        g.rows.forEach((row, ry) => {
          for (let i = 0; i < row.length; i++) {
            if (row[i] !== '#') continue;
            ctx.fillStyle = col || (typeof fill === 'function' ? fill(ry) : fill);
            ctx.fillRect(cx + i * scale + dx, y + ry * scale + dy, scale, scale);
          }
        });
      }
      cx += (g.w + 1) * scale;
    }
    return cx - x;
  }

  function bigWidth(str, scale) {
    let w = 0;
    for (const ch of str) w += ((parsed[ch] || parsed['?']).w + 1) * scale;
    return w - scale;
  }

  G.font = { draw, width, wrap, visibleLength, drawBig, bigWidth, COLORS };
})();
