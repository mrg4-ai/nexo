# PWA y funcionamiento offline

Nexo es una Progressive Web App: un sitio responsive con manifest, iconos, modo standalone y Service Worker. La instalación requiere normalmente HTTPS; `localhost` es una excepción de desarrollo del navegador.

## Manifest e iconos

`app/manifest.ts` define nombre Nexo, `start_url` y `scope` `/`, display standalone, colores y categorías. `public/icons/` contiene 192×192, 512×512, maskable 512×512 y Apple Touch 180×180. `app/favicon.ico` cubre la pestaña.

## Service Worker

`components/service-worker-registration.tsx` registra `/sw.js` exclusivamente en producción con `updateViaCache: "none"`. En desarrollo desregistra workers del mismo origen para evitar estado obsoleto.

`public/sw.js` usa:

- `nexo-shell-v3` para rutas, manifest e iconos;
- `nexo-assets-v3` para scripts, estilos, fuentes e imágenes;
- navegación network-first con navigation preload;
- assets cache-first;
- respuesta 503 explícita si una ruta offline nunca fue guardada.

Una URL inválida online llega al not-found normal de Next.js. Una ruta no disponible sin red devuelve “Nexo no tiene esta ruta guardada…”, por lo que ambos casos no se confunden.

## Cache Storage frente a LocalStorage

- **Cache Storage:** archivos y respuestas que permiten abrir la aplicación.
- **LocalStorage:** dataset financiero del usuario bajo `nexo:v2:app`.

El Service Worker no lee ni escribe `LocalStorage`.

## Actualizaciones

El worker llama `skipWaiting`, toma clientes con `clients.claim` y elimina sólo caches Nexo de versiones anteriores. Los assets de Next.js tienen nombres con hash, por lo que una actualización no reemplaza datos financieros ni necesita un reload loop. `/sw.js` se sirve con `no-cache, no-store, must-revalidate`.

## Safe areas y standalone

El viewport usa `viewportFit: "cover"`. CSS suma `env(safe-area-inset-top/bottom)` al contenido, navegación y sheet móvil. Apple usa status bar `black-translucent`.

## Límites entre navegadores

iOS instala mediante **Añadir a pantalla de inicio** y puede aplicar políticas de almacenamiento propias. Desktop y Android muestran instalación sólo si el origen y manifest cumplen sus criterios. Offline cubre rutas precacheadas o visitadas; no convierte cualquier URL dinámica en disponible. Reconectarse no sincroniza con nube.
