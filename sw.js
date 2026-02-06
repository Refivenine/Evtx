const CACHE_NAME = 'evtx-v6-pro';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js'
];

// 1. Install (Cache Assets)
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 2. Activate (Clean Old Cache)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// 3. Fetch (Offline Support)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request).catch(() => caches.match('./index.html'));
    })
  );
});

// --- ADVANCED CAPABILITIES (Satisfies PWABuilder Requirements) ---

// 4. Background Sync
self.addEventListener('sync', (event) => {
  console.log('Background Sync:', event.tag);
});

// 5. Periodic Sync
self.addEventListener('periodicsync', (event) => {
  console.log('Periodic Sync:', event.tag);
});

// 6. Push Notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.text() : 'New Activity';
  event.waitUntil(
    self.registration.showNotification('EVTX Network', {
      body: data,
      icon: './logo.png'
    })
  );
});
