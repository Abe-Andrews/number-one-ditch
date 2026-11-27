// Journey to the Number One Ditch, as an installable app: this keeps a copy of every file the game
// needs, so the installed app (and the page) plays without the internet. It's registered as
// sw.js?v=<version> (src/main.js), so each new version gets a fresh copy and drops the old one.
// (If a file is added to assets/, add it to ASSETS here, or it only gets saved the first time it's used.)
const V = new URL(self.location).searchParams.get('v') || 'dev';
const CACHE = 'number-one-ditch-' + V;
const SRC = ["core", "font", "art", "world", "entities", "script", "ui", "content", "main", "manual"].map((f) => 'src/' + f + '.js?v=' + V);
const ASSETS = ["assets/music/globglogabgalab.m4a", "assets/music/golden-hour.m4a", "assets/music/icejj-got-that.m4a", "assets/music/make-you-fussy.m4a", "assets/photos/attic-selfie.png", "assets/photos/dad-and-tom.png", "assets/photos/dad-grill.png", "assets/photos/dad-italy.png", "assets/photos/nate-school.png", "assets/photos/tree-head.png", "assets/photos/wedding-suit.png", "assets/pipebook/00.jpg", "assets/pipebook/01.jpg", "assets/pipebook/02.jpg", "assets/pipebook/03.jpg", "assets/pipebook/04.jpg", "assets/pipebook/05.jpg", "assets/pipebook/06.jpg", "assets/pipebook/07.jpg", "assets/pipebook/08.jpg", "assets/pipebook/09.jpg", "assets/pipebook/10.jpg", "assets/pipebook/11.jpg", "assets/pipebook/12.jpg", "assets/pipebook/13.jpg", "assets/pipebook/14.jpg", "assets/pipebook/15.jpg", "assets/pipebook/16.jpg", "assets/pipebook/17.jpg", "assets/pipebook/18.jpg", "assets/pipebook/19.jpg", "assets/pipebook/20.jpg", "assets/pipebook/21.jpg", "assets/pipebook/22.jpg", "assets/pipebook/23.jpg", "assets/pipebook/24.jpg", "assets/pipebook/25.jpg", "assets/pipebook/26.jpg", "assets/pipebook/27.jpg", "assets/sfx/english/english-1.m4a", "assets/sfx/english/english-2.m4a", "assets/sfx/english/english-3.m4a", "assets/sfx/english/english-4.m4a", "assets/sfx/english/english-5.m4a", "assets/sfx/english/english-6.m4a", "assets/sfx/english/english-7.m4a"];
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'assets/icons/icon-192.png', 'assets/icons/icon-512.png', 'assets/icons/apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE.concat(SRC, ASSETS))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('number-one-ditch-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
// the page itself: the network first (so a new version shows up), the saved copy when offline;
// everything else: the saved copy first, then the network (and save it for next time)
self.addEventListener('fetch', (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put('index.html', copy)); return r; }).catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return r; })));
});
