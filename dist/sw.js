const CACHE = 'consulting-knowledge-v4-12';
const ASSETS = ['./', './index.html', './styles.css', './app.js', './manifest.webmanifest', './favicon.svg'];

self.addEventListener('install', event => event.waitUntil(
  caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
));

self.addEventListener('activate', event => event.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())
));

// Network first: a new deploy reaches users on the next load; the cache is only the offline fallback.
function networkFirst(req) {
  return fetch(req).then(res => {
    if (res.ok) {
      const clone = res.clone();
      caches.open(CACHE).then(cache => cache.put(req, clone));
    }
    return res;
  }).catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')));
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Server data is private and always live: never cached, never served from the offline fallback.
  if (url.origin === self.location.origin && /\/api\//.test(url.pathname)) return;
  const fonts = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (url.origin === self.location.origin || fonts) event.respondWith(networkFirst(req));
});
