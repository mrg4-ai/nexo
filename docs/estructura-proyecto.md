# Estructura del proyecto

```text
app/                       Rutas, layout, manifest y estilos globales
components/                UI, vistas completas, shell y sheet de movimiento
domain/models.ts           Entidades TypeScript persistidas
stores/app-store.ts        Estado y acciones Zustand
services/                  Finanzas, fechas, dinero, esquema, seed y backup
repositories/local/        Contrato e implementación LocalStorage
public/                    Service Worker, iconos y preview social
e2e/                       Pruebas Playwright funcionales, móviles y PWA
docs/                      Documentación del proyecto
scripts/                   Generación reproducible de iconos PWA
```

## Archivos relevantes

- `app/layout.tsx`: metadata, viewport, fuentes, registro PWA y `AppShell`.
- `app/manifest.ts`: manifest instalable con scope `/` e iconos.
- `app/**/page.tsx`: conecta cada URL con su vista; no contiene lógica financiera. `app/not-found.tsx` y `app/error.tsx` presentan fallos sin stack traces.
- `components/app-shell.tsx`: navegación, workspace, período, hidratación y error global.
- `components/completeness-views.tsx`: CRUD de cuentas, presupuestos, metas, patrimonio, productos, costos, inventario y configuración.
- `components/views.tsx`: dashboards y reportes derivados.
- `components/transaction-sheet.tsx`: alta/edición/eliminación de movimientos y accesibilidad del diálogo.
- `components/ui.tsx`: moneda, métricas, progreso y gráfico compartido.
- `stores/app-store.ts`: única puerta de mutación usada por los componentes.
- `services/finance.ts`: fórmulas financieras reutilizables.
- `services/app-data.ts`: validación completa y migración V1→V2.
- `services/financial-date.ts`: fechas civiles sin desplazamiento UTC.
- `services/money.ts`: redondeo y suma a centavos.
- `services/backup.ts`: backup JSON y CSV UTF-8.
- `services/seed.ts`: demo determinista; no se usa si ya existen datos.
- `services/rc-fixtures.ts`: fixtures deterministas de volumen, sólo importados por pruebas.
- `repositories/local/app.repository.ts`: claves Nexo, lectura, escritura y borrado con namespace.
- `public/sw.js`: precache, navegación network-first, assets cache-first y fallback offline 503.
- `e2e/core.spec.ts`, `mobile.spec.ts`, `pwa.spec.ts`: flujos reales en navegador.

La lógica nueva de dominio debe vivir en `services/`, no duplicada dentro de páginas. Los componentes no deben acceder directamente a `LocalStorage`.
