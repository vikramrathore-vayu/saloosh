const CACHE = 'saloosh-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', e => {
  console.log('[SW] Installing...');
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      console.log('[SW] Caching assets');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  console.log('[SW] Activating...');
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const resClone = res.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, resClone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
