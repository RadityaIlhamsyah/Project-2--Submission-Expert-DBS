import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache images with a Cache First strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Cache SVG, XML, and other assets with Stale-While-Revalidate
registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style' || request.destination === 'font' || request.destination === 'object',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Offline Fallback
self.addEventListener('install', (event) => {
  const offlinePage = new Response(
    `
    <html>
      <head>
        <title>Offline - Burger Apps</title>
        <style>
          body { font-family: sans-serif; text-align: center; padding: 20px; }
          .offline-message { margin: 20px; }
        </style>
      </head>
      <body>
        <h1>Offline Mode</h1>
        <div class="offline-message">
          <p>You are currently offline. Please check your internet connection.</p>
          <button onclick="window.location.reload()">Try Again</button>
        </div>
      </body>
    </html>
    `,
    {
      headers: { 'Content-Type': 'text/html' },
    }
  );

  const offlineFallbackPage = new Request('offline.html');
  event.waitUntil(
    caches.open('offline-cache').then((cache) => {
      return cache.put(offlineFallbackPage, offlinePage);
    })
  );
});
