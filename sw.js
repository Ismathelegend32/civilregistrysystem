/* Minimal service worker — enables "Install app" on Android Chrome */
const CACHE_NAME = 'crs-local-v1';
const PRECACHE = ['./install.html', './index.html', './manifest.json', './logo.png', './styles.css'];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(PRECACHE).catch(function () { /* partial ok */ });
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (event) {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        caches.match(event.request).then(function (cached) {
            return cached || fetch(event.request);
        })
    );
});
