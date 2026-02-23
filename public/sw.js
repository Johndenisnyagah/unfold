// Self-destructing service worker.
// This replaces any previously cached SW and immediately unregisters itself,
// clearing stale caches that cause white-screen issues on redeployment.

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((names) =>
            Promise.all(names.map((name) => caches.delete(name)))
        ).then(() => self.registration.unregister())
    );
});
