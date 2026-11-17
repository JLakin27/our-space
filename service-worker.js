/* Our Space PWA — conservative service worker.
   No caching of app code, Firebase requests, maps or cinematic videos.
   Network-first for navigations; friendly offline document if unreachable. */
const CACHE_NAME = 'our-space-offline-v1';
const OFFLINE_PAGE = new URL('./offline.html', self.registration.scope).pathname;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.add(OFFLINE_PAGE);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith('our-space-offline-') && name !== CACHE_NAME).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.mode !== 'navigate' || event.request.method !== 'GET') return;
  event.respondWith((async () => {
    try {
      return await fetch(event.request);
    } catch (_) {
      const cache = await caches.open(CACHE_NAME);
      return (await cache.match(OFFLINE_PAGE)) || Response.error();
    }
  })());
});
