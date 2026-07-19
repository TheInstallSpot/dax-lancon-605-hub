/* Dax Lancon Racing 605 — LO206 Hub · service worker
   Offline-first caching. Bump CACHE version when you change app files.
   Photos live in a SEPARATE cache (IMG_CACHE) so bumping CACHE for a
   content update does NOT wipe already-downloaded kart photos. */
const CACHE = 'dlr605-v20';
const IMG_CACHE = 'dlr605-images-v1';
const isImage = req =>
  req.destination === 'image' ||
  /\/images\//.test(req.url) ||
  /\.(png|jpe?g|webp|gif|svg|avif)(\?|$)/i.test(req.url);
const APP_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './content.js',
  './app.js',
  './auth.js',
  './manifest.webmanifest'
];
// icons are images → precache them into the persistent image cache
const ICONS = [
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/icon-180.png',
  './icons/favicon-32.png',
  './brand/mark-605.png'
];

self.addEventListener('install', e => {
  e.waitUntil(Promise.all([
    caches.open(CACHE).then(c => c.addAll(APP_ASSETS)),
    caches.open(IMG_CACHE).then(c => c.addAll(ICONS))
  ]).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      // keep the current app cache AND the persistent image cache
      keys.filter(k => k !== CACHE && k !== IMG_CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // Never cache auth / serverless calls — always hit the network live.
  const path = new URL(req.url).pathname;
  if (path.startsWith('/api/') || path.startsWith('/.netlify/')) return;

  // Photos: cache-first from the persistent image cache, then network, then store.
  if (isImage(req)) {
    e.respondWith(
      caches.open(IMG_CACHE).then(c =>
        c.match(req).then(hit => hit ||
          fetch(req).then(res => {
            if (res.ok) c.put(req, res.clone()).catch(() => {}); // never cache a 404/placeholder miss
            return res;
          }).catch(() => hit)
        )
      )
    );
    return;
  }

  // App assets: cache-first, network fallback; navigations fall back to index.html offline.
  e.respondWith(
    caches.match(req).then(cached => cached ||
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => req.mode === 'navigate' ? caches.match('./index.html') : undefined)
    )
  );
});
