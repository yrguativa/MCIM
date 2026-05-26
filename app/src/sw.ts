import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

precacheAndRoute(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (self as any).__WB_MANIFEST
)

registerRoute(
  ({ url }) => url.pathname.includes('/graphql'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 10,
    plugins: [
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 60 }),
    ],
  }),
)

registerRoute(
  ({ request }) => request.destination === 'font' || request.destination === 'style',
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 }),
    ],
  }),
)

registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }),
    ],
  }),
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const swSelf: any = self

swSelf.addEventListener('activate', (event: { waitUntil: (p: Promise<unknown>) => void; }) => {
  const currentCaches = ['api-cache', 'static-assets', 'images']
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      cacheNames.filter((name) => !currentCaches.includes(name)),
    ).then((cachesToDelete) =>
      Promise.all(cachesToDelete.map((name) => caches.delete(name))),
    ).then(() => swSelf.clients.claim()),
  )
})
