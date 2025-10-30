const CACHE_NAME = 'royaume-paraiges-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  // Forcer l'activation immédiate
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  // Prendre le contrôle immédiatement
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Stratégie de cache : Network First, fallback to cache
self.addEventListener('fetch', (event) => {
  // Ne gérer que les requêtes HTTP/HTTPS de notre domaine
  const url = new URL(event.request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Ne mettre en cache que les réponses valides
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Clone la réponse pour la mettre en cache
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache).catch((err) => {
            console.log('Cache put error:', err);
          });
        });
        return response;
      })
      .catch(() => {
        // Si le réseau échoue, essaie de récupérer depuis le cache
        return caches.match(event.request);
      })
  );
});
