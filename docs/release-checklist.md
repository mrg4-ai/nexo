# Checklist de release

## Automatización

- [x] `pnpm typecheck`
- [x] `pnpm lint`
- [x] `pnpm test`
- [x] `pnpm build`
- [x] Regresión Playwright desktop/móvil contra producción
- [x] `pnpm test:pwa`
- [x] URL inválida online muestra not-found; ruta no cacheada offline muestra 503
- [x] No hay `console.log`/`console.debug` con datos financieros

## Datos y dominio

- [x] Inicio limpio sin reseed inesperado
- [x] Modo demo determinista y aislado
- [x] Transferencias conservan el total combinado
- [x] Fechas de límites de mes/año y bisiesto
- [x] Valores negativos, ceros e importes extremos
- [x] Archivados preservan historial y no aparecen en nuevos selectores
- [x] Quota failure no cambia el estado anterior
- [x] Corrupción y versiones incompatibles no se sobrescriben
- [x] Backup exportar→borrar→importar→exportar
- [x] Backups inválidos no alteran datos
- [x] CSV abre como UTF-8 y conserva escaping
- [x] Eliminar todo conserva claves ajenas

## PWA y responsive

- [x] Manifest, favicon, Apple Touch y maskable válidos
- [x] Worker sólo en producción y `/sw.js` sin caché HTTP
- [x] Actualización limpia cachés Nexo anteriores sin tocar `LocalStorage`
- [x] CRUD y backup offline después de primera carga
- [x] 320×568, 375×812, 390×844, 430×932, 768×1024, 1024×768, 1280×800, 1440×900 y 1920×1080
- [x] Sin overflow, acción principal oculta, navegación superpuesta ni chart roto

## Manual y despliegue

- [ ] `NEXT_PUBLIC_APP_URL` documentada/configurada para el origen final
- [ ] HTTPS y assets públicos correctos
- [x] Documentación coincide con rutas, fórmulas, comandos y conteos
- [ ] Checklist físico Android Chrome completado por una persona
- [ ] Checklist físico iPhone Safari completado por una persona
- [ ] Checklist físico Desktop Chrome/Edge completado por una persona

## Hallazgos del RC 2026-08-11

- **BLOCKER:** ninguno encontrado.
- **MAJOR corregidos:** validación incompleta de storage/backup; recuperación V1 detrás de V2 corrupta; falta de feedback de lectura; estados negativos con tono positivo; proyección de caja fija; gastos de reporte sin filtro de período; distribución de gasto ficticia.
- **MINOR corregidos:** categorías mojibake, metadata con fallback localhost, foco/Escape/trap básico del sheet y contenido largo.
- **COSMETIC no perseguido:** compactación del código existente y copy visual aprobado.
