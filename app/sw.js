// Qasr PWA service worker — cache-first for the app shell & photos, network-first for HTML so updates land.
const V = 'qasr-v6';
const SHELL = ['./', './index.html', './admin.html', './data.js', './manifest.json', './admin.webmanifest', './img/mark.png', './img/mark_white.png', './img/banner.webp', './img/gallery1.webp', './img/gallery2.webp', './img/gallery3.webp'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url); if (e.request.method !== 'GET') return;
  if (u.origin !== location.origin) { e.respondWith(caches.open(V).then(async c => { const h = await c.match(e.request); const f = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => h); return h || f; })); return; }
  if (e.request.mode === 'navigate' || u.pathname.endsWith('.html') || u.pathname.endsWith('.js')) {
    e.respondWith(fetch(e.request).then(r => { caches.open(V).then(c => c.put(e.request, r.clone())); return r; }).catch(() => caches.match(e.request).then(h => h || caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(e.request).then(h => h || fetch(e.request).then(r => { if (r.ok) caches.open(V).then(c => c.put(e.request, r.clone())); return r; })));
});
