const CACHE_NAME = 'pos-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Add other critical static assets here if necessary (like logo.png, restaurant.jpg)
];

self.addEventListener('install', (event) => {
  console.log('Service Worker: Install event triggered. Caching static assets.');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache).catch(err => {
          console.error('Failed to cache some assets during install:', err);
        });
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Only intercept GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return the response from the cache
        if (response) {
          return response;
        }
        
        // No cache match, proceed with network request
        return fetch(event.request).catch(() => {
            // Fallback for when network fails and asset isn't cached (e.g., dynamic imports)
            console.warn('Network request failed and no cache found for:', event.request.url);
        });
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate event triggered.');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Delete old caches
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
