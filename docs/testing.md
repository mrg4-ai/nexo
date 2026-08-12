# Testing

## Stack

Vitest ejecuta pruebas de servicios y repositorio. Playwright prueba flujos completos en Chromium desktop/móvil y el Service Worker en producción.

## Comandos

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:e2e
pnpm test:pwa
```

## Cobertura actual

La ejecución V1.1 contiene **56 pruebas unitarias/integración en 7 archivos**:

- redondeo, ingresos, gastos, transferencias y saldos;
- disponible, presupuestos, metas y patrimonio;
- productos, margen, inventario, reportes y ratios con cero;
- fechas de fin de mes/año y febrero bisiesto;
- datasets deterministas de 0, 1, 50, 500 y 1.000 movimientos;
- importes desde S/ 0,01 hasta S/ 9.999.999,99 y resultados negativos;
- backup round-trip, backups inválidos y CSV complejo UTF-8;
- V1→V2, versión futura, corrupción, referencias huérfanas y quota failure;
- borrado limitado a claves `nexo:`;
- contrato PWA e iconos físicos.
- migración no destructiva de perfil/guía y separación de namespaces real/demo.

Playwright contiene **10 pruebas funcionales de producción** y **1 prueba PWA/offline**. Cubre landing, navegación a `/dashboard`, onboarding, persistencia y edición del perfil, ayuda/guía, aislamiento y reset demo, responsive de landing, primera cuenta, movimientos y transferencias, presupuestos, metas, patrimonio, productos, costos, inventario, backup, borrado con namespace y navegación móvil. La prueba PWA cubre manifest con inicio en `/dashboard`, control del worker, rutas cacheadas, CRUD offline, recarga, backup offline y fallback 503.

La regresión RC adicional carga 1.000 movimientos, busca/filtra, confirma que el chart se renderiza y recorre nueve tamaños entre 320×568 y 1920×1080 sin overflow horizontal.

No existe medición porcentual de cobertura configurada; no debe inferirse un porcentaje a partir del número de pruebas. La instalación física sigue el checklist manual.
