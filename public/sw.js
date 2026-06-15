// Minimal service worker. The primary reason it exists is to make the app
// installable as a PWA — Chrome's installability check requires a registered
// SW with a fetch event handler. We intentionally don't cache anything yet:
// box data changes between sessions and we'd rather pay a network round-trip
// than serve stale data. Caching strategies can be layered on here later.

const CACHE_VERSION = "getmoving-v1";

self.addEventListener("install", () => {
  // New SW takes over immediately on next page load instead of waiting for
  // every existing tab to close.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

// Empty fetch handler is enough to satisfy the PWA installability check.
// Browsers detect the listener's presence regardless of whether it calls
// respondWith.
self.addEventListener("fetch", () => {});
