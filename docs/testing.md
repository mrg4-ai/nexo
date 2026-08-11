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

La ejecución RC final contiene **53 pruebas unitarias/integración en 6 archivos**:

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

Playwright funcional cubre primera cuenta, movimientos y transferencias, edición/eliminación, presupuestos, metas, patrimonio, productos, costos, inventario, backup, borrado con namespace y navegación móvil. La prueba PWA cubre manifest, control del worker, rutas cacheadas, CRUD offline, recarga, backup offline y fallback 503.

La regresión RC adicional carga 1.000 movimientos, busca/filtra, confirma que el chart se renderiza y recorre nueve tamaños entre 320×568 y 1920×1080 sin overflow horizontal.

No existe medición porcentual de cobertura configurada; no debe inferirse un porcentaje a partir del número de pruebas. La instalación física sigue el checklist manual.
