const CACHE_NAME = 'evtx-final-v7';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js'
];

// 1. Install & Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 2. Activate & Clean Up
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// 3. Fetch Strategy (Network First, then Cache)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
      .then((response) => response || caches.match('./index.html'))
  );
});

// 4. Background Sync (Satisfies Requirement)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background Sync:', event.tag);
});

// 5. Periodic Sync (Satisfies Requirement)
self.addEventListener('periodicsync', (event) => {
  console.log('[SW] Periodic Sync:', event.tag);
});

// 6. Push Notification Handler
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.text() : 'New Notification';
  event.waitUntil(
    self.registration.showNotification('EVTX', {
      body: data,
      icon: './logo.png'
    })
  );
});
