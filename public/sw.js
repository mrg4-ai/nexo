const CACHE_PREFIX = "nexo-shell-";
const CACHE_VERSION = "v4";
const SHELL_CACHE = `${CACHE_PREFIX}${CACHE_VERSION}`;
const ASSET_CACHE = `nexo-assets-${CACHE_VERSION}`;
const APP_ROUTES = ["/","/dashboard","/transactions","/accounts","/budgets","/goals","/net-worth","/settings","/help","/business","/business/products","/business/inventory","/business/cash-flow","/business/ratios","/business/income-statement","/business/balance-sheet"];
const PRECACHE = [...APP_ROUTES,"/manifest.webmanifest","/favicon.ico","/icons/icon-192.png","/icons/icon-512.png","/icons/maskable-512.png","/icons/apple-touch-icon.png"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(SHELL_CACHE).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => (key.startsWith(CACHE_PREFIX) || key.startsWith("nexo-assets-")) && ![SHELL_CACHE, ASSET_CACHE].includes(key)).map(key => caches.delete(key)));
    if (self.registration.navigationPreload) await self.registration.navigationPreload.enable();
    await self.clients.claim();
  })());
});

async function cacheResponse(cacheName, request, response) {
  if (response.ok && response.type !== "opaque") {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
  }
  return response;
}

async function navigationResponse(event) {
  const request = event.request;
  try {
    const preload = await event.preloadResponse;
    const response = preload || await fetch(request);
    return cacheResponse(SHELL_CACHE, request, response);
  } catch {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;
    return new Response("Nexo no tiene esta ruta guardada para usarla sin conexión.", {status:503,headers:{"Content-Type":"text/plain; charset=utf-8","Cache-Control":"no-store"}});
  }
}

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || url.pathname === "/sw.js" || url.pathname.includes("webpack-hmr")) return;
  if (request.mode === "navigate") { event.respondWith(navigationResponse(event)); return; }
  if (["script","style","font","image"].includes(request.destination)) {
    event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => cacheResponse(ASSET_CACHE, request, response))));
  }
});
