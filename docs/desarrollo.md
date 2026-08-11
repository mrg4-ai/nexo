# Guía de desarrollo

## Preparación

Requiere Node.js ≥20.9 y pnpm 11.

```bash
pnpm install
pnpm dev
```

## Producción

```bash
pnpm build
pnpm start
```

Define opcionalmente `NEXT_PUBLIC_APP_URL=https://origen-final.example` para metadata social absoluta.

## Tests

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:e2e
pnpm test:pwa
```

La suite E2E normal usa `next dev` en el puerto 3100. `test:pwa` construye y levanta producción en 3200. `playwright.production.config.ts` usa 3300 y presupone un build existente.

## Demo y limpio

- `NEXT_PUBLIC_DEMO_DATA=true`: usa `services/seed.ts` si no hay datos guardados.
- `NEXT_PUBLIC_DEMO_DATA=false` o variable ausente: usa `emptyData()`.

El entorno se evalúa al compilar/ejecutar Next.js. Los datos existentes tienen prioridad.

## Añadir una funcionalidad respetando la arquitectura

1. Modifica `domain/models.ts` sólo si hay datos persistidos nuevos.
2. Actualiza validación/migración en `services/app-data.ts`.
3. Ajusta el contrato/repositorio si la operación de persistencia realmente cambia.
4. Implementa fórmulas en un servicio, no en varias vistas.
5. Añade una acción atómica en `useAppStore`.
6. Conecta la UI sin usar `LocalStorage` directamente.
7. Añade pruebas unitarias, de fallo y E2E relevantes.
8. Actualiza la documentación española.

## Reglas de dominio

- Las transferencias nunca son ingreso ni gasto.
- Las fechas financieras pasan por `services/financial-date.ts`.
- El dinero se redondea con `roundMoney`/`sumMoney`.
- No dupliques fórmulas financieras dentro de componentes.
- Primero persiste; después publica el nuevo estado Zustand.
- Conserva entidades históricas referenciadas mediante archivado/pausa.

Antes de modificar APIs de Next.js, consulta la documentación instalada en `node_modules/next/dist/docs/`, porque el proyecto usa Next.js 16.3.
