const CACHE_NAME = 'wedding-invitation-v53';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './gallery.html',
  './manifest.json',
  './css/styles.css',
  './js/config.js',
  './js/countdown.js',
  './js/particles.js',
  './js/app.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/images/logo.jpg',
  './assets/images/couple-cover.jpg',
  './assets/images/groom.jpg',
  './assets/images/bride.jpg',
  './assets/images/photo1.jpg',
  './assets/images/photo2.jpg',
  './assets/images/gallery-1.jpg',
  './assets/images/gallery-2.jpg',
  './assets/images/gallery-3.jpg',
  './assets/images/gallery-4.jpg',
  './assets/images/gallery-5.jpg',
  './assets/images/gallery-6.jpg',
  './assets/images/gallery-7.jpg',
  './assets/images/gallery-8.jpg',
  './assets/images/gallery-9.jpg',
  './assets/images/gallery-10.jpg',
  './assets/images/gallery-11.jpg',
  './assets/images/gallery-12.jpg',
  './assets/images/gallery-13.jpg',
  './assets/images/gallery-14.jpg',
  './assets/images/gallery-15.jpg',
  './assets/images/gallery-16.jpg',
  './assets/images/gallery-17.jpg',
  './assets/images/gallery-18.jpg',
  './assets/images/gallery-19.jpg',
  './assets/images/gallery-20.jpg',
  './assets/images/gallery-21.jpg',
  './assets/images/gallery-22.jpg',
  './assets/images/gallery-23.jpg',
  './assets/images/gallery-24.jpg',
  './assets/images/gallery-25.jpg',
  './assets/images/wd-photo3.jpg',
  './assets/images/wd-photo4.jpg',
  './assets/images/wd-photo5.jpg',
  './assets/images/wd-photo6.jpg',
  './assets/images/wd-photo7.jpg',
  './assets/images/wd-photo8.jpg',
  './assets/images/wd-photo9.jpg',
  './assets/images/wd-photo10.jpg',
  './assets/images/wd-photo11.jpg',
  './assets/images/wd-photo12.jpg',
  './assets/images/wd-photo13.jpg',
  './assets/images/wd-photo15.jpg',
  './assets/images/wd-photo16.jpg',
  './assets/images/wd-photo17.jpg',
  './assets/images/wd-photo18.jpg',
  './assets/images/wd-photo19.jpg',
  './assets/images/wd-photo20.jpg',
  './assets/images/wd-cac3b471-e416-4c57-8b66-f9b9ce4ed7c3.jpg',
  './assets/images/wd-eadb24cb-fa31-4768-8f5b-4f913e59bf2b.jpg',
  './assets/images/wd-efdeed84-8bc4-4d8c-a546-87086fc985bb.jpg',
  './assets/images/wd-b687cf03-fe26-4972-92c5-26ff5af2d847.jpg',
  './assets/images/wd-d6a92739-c71d-4a72-ac78-20641c31387e.jpg',
  './assets/images/wd-f11503e6-8fcb-46c7-bcd9-e22eed9b6447.jpg',
  './assets/images/wd-11f3636a-a7f3-4574-a7ab-d203db4773ae.jpg',
  './assets/images/wd-c6e08cb2-e2c4-4032-ac64-75c46f88a083.jpg',
  './assets/images/wd-79266957-279a-4867-8263-f98545adc926.jpg',
  './assets/images/wd-3ad3f375-1428-4437-98ee-43d325c9ebab.jpg',
  './assets/images/wd-de49ec15-e711-49c1-958a-0fa6ca18ec51.jpg',
  './assets/images/wd-13eca37c-60ea-4e5a-b0af-faf6f85d6a82.jpg',
  './assets/images/wd-db93ecab-f774-44b1-80f9-53676a2a3485.jpg',
  './assets/images/wd-5ae48852-2a3a-4064-ac7d-a1e0a7f72bbf.jpg',
  './assets/images/wd-12996556-52c8-4edb-bdec-4dc55cd731d1.jpg',
  './assets/images/wd-adb8ec41-cd67-4507-a7af-bfba2cdff428.jpg',
  './assets/images/wd-ddd984b8-847d-454e-be06-85c2aba8b3fe.jpg',
  './assets/images/attire.jpg',
  './assets/images/rsvp-gift.jpg',
  './assets/audio/wedding-ambient.mp3'
];

// Install Event - Pre-cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching static assets');
      // Resilient: one failing asset must not abort the whole install
      // (addAll() throws on 206/partial responses for range-capable files).
      return Promise.all(
        ASSETS_TO_CACHE.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('[SW] Skipped caching', url, err);
          })
        )
      );
    }).then(() => {
      // Pre-cache the ambient audio as a full 200 response (separate from
      // ASSETS_TO_CACHE so a range/206 hiccup can never fail the install).
      return caches.open(CACHE_NAME).then((cache) =>
        fetch('./assets/audio/wedding-ambient.mp3').then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            return cache.put('./assets/audio/wedding-ambient.mp3', res);
          }
        }).catch((err) => {
          console.warn('[SW] Audio pre-cache skipped', err);
        })
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Cache-First strategy with Network Fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // Never leave respondWith(undefined) — that surfaces as net::ERR_FAILED.
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html').then((cachedHome) =>
            cachedHome || new Response('<h1>Offline</h1>', {
              status: 503,
              headers: { 'Content-Type': 'text/html' }
            })
          );
        }
        return new Response(null, { status: 404 });
      });
    })
  );
});
