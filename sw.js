const CACHE_NAME = 'wedding-invitation-v49';
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
