# Nexo

Nexo Local V1.1 es una PWA financiera local-first para organizar finanzas personales y de un pequeño negocio. `/` ofrece una presentación pública y `/dashboard` abre la aplicación. Los datos viven en `LocalStorage`: no hay cuentas, inicio de sesión, base de datos de servidor ni sincronización en la nube. Después de una primera carga correcta, las rutas y recursos cacheados pueden utilizarse sin conexión en navegadores compatibles.

## Características

- **Personal:** cuentas, ingresos, gastos, transferencias, presupuestos, metas y aportes, activos, pasivos, patrimonio y gráficos.
- **Negocio:** productos, costos unitarios, ganancia, margen, inventario, flujo de caja, estado de resultados, balance general e indicadores financieros.
- **Sistema:** PWA instalable, funcionamiento offline, backup/importación JSON, exportación CSV y experiencia responsive para desktop y móvil.
- **Experiencia:** landing pública, perfil local, primer inicio guiado, centro de ayuda y demo aislada.

## Stack

- Next.js 16.3.0 y React 19.2.8.
- TypeScript 5, Zustand 5.0.14, HeroUI 3.2.4, Recharts 3.10.1 y lucide-react 1.31.0.
- Vitest 4.1.10 y Playwright 1.51.1.
- Tailwind CSS 4 mediante PostCSS.

## Requisitos

- Node.js 20.9.0 o superior.
- pnpm 11, según el campo `packageManager`.
- Chromium instalado por Playwright para las pruebas E2E.

## Instalación

```bash
pnpm install
```

## Desarrollo

```bash
pnpm dev
```

El Service Worker sólo se registra en producción para evitar cachés obsoletos durante el desarrollo.

## Pruebas

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:e2e
pnpm test:pwa
```

`test:pwa` genera primero el build y ejecuta el flujo offline sobre `next start`. También existe `playwright.production.config.ts` para ejecutar la regresión funcional contra un build ya generado.

## Build de producción

```bash
pnpm build
pnpm start
```

En el despliegue final puede definirse `NEXT_PUBLIC_APP_URL` con el origen HTTPS público para producir URLs absolutas correctas en metadata social.

## Modo demo

Desde la landing, **Probar demo** abre el mismo producto con el dataset determinista de `services/seed.ts`, pero persiste en `nexo-demo:v2:app`. Nunca escribe en `nexo:v2:app`. **Salir de demo** recupera el contexto normal y **Restablecer demo** elimina únicamente el namespace demo.

La variable histórica para entornos dedicados se conserva:

```bash
NEXT_PUBLIC_DEMO_DATA=true pnpm dev
```

Con `NEXT_PUBLIC_DEMO_DATA=true`, una instalación sin datos inicia con el dataset determinista de `services/seed.ts`. Con `false` o sin la variable, inicia vacía. Un dataset guardado siempre tiene prioridad; cambiar la variable no sustituye datos existentes.

## Persistencia de datos

Nexo utiliza `nexo:v2:app` para datos reales y `nexo-demo:v2:app` para la demo aislada. Migra el legado `nexo:v1:app` cuando es válido. Las escrituras se validan antes de reemplazar el valor. Cada borrado queda limitado a su namespace. Exporta backups periódicamente: borrar los datos del navegador, cambiar de perfil u origen puede eliminar o aislar la información.

## PWA y modo offline

`app/manifest.ts` abre la instalación en `/dashboard` y `public/sw.js` cachea landing, aplicación, ayuda y recursos. `Cache Storage` no contiene datasets financieros; éstos continúan en `LocalStorage`. Reconectarse no sincroniza con ningún servicio remoto.

## Documentación

El índice completo está en [docs/README.md](docs/README.md).

## Limitaciones actuales

V1 usa sólo PEN, un navegador/perfil/origen y almacenamiento local. No incluye autenticación, nube, colaboración, conexión bancaria, conversión de moneda ni recuperación remota. La disponibilidad offline y la instalación varían según el navegador. Consulta [docs/limitaciones-v1.md](docs/limitaciones-v1.md).
