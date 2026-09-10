// sw.js — force fresh JSON data on every request
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }

  if (url.origin !== self.location.origin) return;

  if (url.pathname.includes('/data/') && url.pathname.toLowerCase().endsWith('.json')) {
    event.respondWith(
      fetch(req, { cache: 'no-store' })
        .catch(() => new Response('[]', {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }))
    );
    return;
  }
  
});