// Service Worker des Datenschutz-Quiz.
// Beim ersten Besuch landen alle Dateien im Gerätespeicher, damit das Quiz auch ohne Internet startet.
// Mit Internet wird immer zuerst die aktuelle Version geholt (und der Speicher aufgefrischt) –
// Änderungen nach einem Push sind also beim nächsten Öffnen da. Nur ohne Netz (oder wenn das Netz
// länger als NETWORK_TIMEOUT braucht) kommt die gespeicherte Version.
//
// Neue Datei in web/? → unten in FILES eintragen und VERSION erhöhen (tests/pruefe-fragen.mjs prüft das).

const VERSION = 'v1';
const CACHE = 'datenschutz-quiz-' + VERSION;
const NETWORK_TIMEOUT = 3000;

const FILES = [
  './',
  './index.html',
  './css/quiz.css',
  './js/fragen.js',
  './js/quiz.js',
  './manifest.webmanifest',
  './icons/icon-32.png',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './fonts/public-sans-latin-400-normal.woff2',
  './fonts/public-sans-latin-600-normal.woff2',
  './fonts/public-sans-latin-700-normal.woff2',
  './fonts/zilla-slab-latin-600-normal.woff2',
  './fonts/zilla-slab-latin-700-normal.woff2',
  './fonts/ibm-plex-mono-latin-500-normal.woff2',
  './fonts/ibm-plex-mono-latin-600-normal.woff2',
  './Datenschutz_LEK_Fragen_mit_Loesungsblatt.pdf'
];

const SCOPE = new URL('./', self.location.href).pathname;
const MATCH = { ignoreSearch: true, ignoreVary: true };

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // cache: 'reload' umgeht den HTTP-Cache des Browsers, damit wirklich die aktuelle Version landet
    await cache.addAll(FILES.map((f) => new Request(f, { cache: 'reload' })));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // nur eigene alte Caches löschen – andere Apps auf derselben github.io-Adresse bleiben unberührt
    for (const key of await caches.keys()) {
      if (key.startsWith('datenschutz-quiz-') && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(SCOPE)) return;

  // Schriften und Icons ändern sich nicht: direkt aus dem Speicher
  const rest = url.pathname.slice(SCOPE.length);
  if (rest.startsWith('fonts/') || rest.startsWith('icons/')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // alles andere: erst das Netz, bei Ausfall oder Zeitüberschreitung der Speicher
  let stored = Promise.resolve();
  const network = fetch(request).then((response) => {
    if (response.status === 200 && response.type === 'basic') {
      const copy = response.clone();
      stored = caches.open(CACHE).then((cache) => cache.put(request, copy));
    }
    return response;
  });
  event.waitUntil(network.then(() => stored).catch(() => {}));
  event.respondWith(networkFirst(request, network));
});

async function networkFirst(request, network) {
  try {
    return await Promise.race([
      network,
      new Promise((resolve, reject) => setTimeout(() => reject(new Error('timeout')), NETWORK_TIMEOUT))
    ]);
  } catch (err) {
    const cache = await caches.open(CACHE);
    const hit = (await cache.match(request, MATCH)) ||
      (request.mode === 'navigate' ? await cache.match('./', MATCH) : undefined);
    if (hit) {
      network.catch(() => {});
      return hit;
    }
    return network; // nichts gespeichert: auf das Netz warten (oder dessen Fehler weitergeben)
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request, MATCH);
  if (hit) return hit;
  const response = await fetch(request);
  if (response.status === 200 && response.type === 'basic') {
    await cache.put(request, response.clone());
  }
  return response;
}
