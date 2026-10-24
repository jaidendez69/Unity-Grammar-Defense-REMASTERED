// Service worker for Unity Defense Remastered (browser version).
// Pages are fetched from the NETWORK first (and always revalidated), so reopening the link
// gives the newest version as soon as it is published. The cache is only a fallback for when
// you are offline. Bump CACHE_VERSION on every publish.
const CACHE_VERSION = 'ugd-v13';
const CACHE_NAME = 'unity-defense-remastered-' + CACHE_VERSION;

const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

self.addEventListener('install', (event) => {
    // 'reload' skips the browser's HTTP cache so the cache never gets filled with an old copy
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) =>
            Promise.all(ASSETS_TO_CACHE.map((url) =>
                fetch(new Request(url, { cache: 'reload' })).then((res) => res.ok ? cache.put(url, res) : null).catch(() => null)
            ))
        )
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;
    if (new URL(req.url).origin !== location.origin) return;   // other sites (Firebase etc.) are not touched
    event.respondWith(
        fetch(req, { cache: 'no-cache' })
            .then((res) => {
                if (res && res.ok) {
                    const copy = res.clone();
                    caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
                }
                return res;
            })
            .catch(() => caches.match(req).then((cached) => cached || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error())))
    );
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
