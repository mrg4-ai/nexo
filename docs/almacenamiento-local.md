# Almacenamiento local

## Por qué LocalStorage en V1

Permite una demo autónoma, local-first y sin infraestructura de servidor. Es suficiente para el volumen objetivo probado de hasta 1.000 movimientos, pero no sustituye una base multiusuario ni una estrategia de sincronización.

## Esquema V2 y claves

- `nexo:v2:app`: `AppData` vigente.
- `nexo:v1:app`: clave legada leída para migración.
- Prefijo propiedad de la aplicación: `nexo:`.

El esquema vive en `services/app-data.ts`; `Settings.schemaVersion` debe ser `2`.

## Lectura segura

`LocalAppRepository.load` obtiene y parsea cada clave dentro de `try/catch`. `migrateAppData` clona, migra y valida todas las colecciones, tipos, cantidades y referencias. Una V2 inválida no se sobrescribe silenciosamente. Si existe una V1 válida, se recupera y guarda como V2; si no, el store inicia de forma segura y muestra un aviso comprensible.

## Escritura atómica

Antes de `localStorage.setItem`, `isAppData` valida el dataset completo. El store construye una nueva raíz, intenta guardarla y sólo entonces actualiza Zustand. `setItem` reemplaza una única clave de forma atómica; si ocurre quota failure o falta de permisos, el valor anterior y el estado visible anterior permanecen intactos.

## Migración V1 → V2

La migración cambia `schemaVersion` a 2, establece el período inicial compatible y añade categorías si faltan. Versiones futuras, versión ausente o V1 parcialmente malformada se rechazan sin migración destructiva.

## Corrupción y fallback

JSON inválido, colecciones parciales, IDs huérfanos o enums desconocidos no entran al store. El contenido original se conserva para no destruir una posible recuperación manual. Nexo no intenta reparar campos financieros ambiguos.

## Eliminar todos los datos

`clear()` recorre las claves y elimina únicamente las que comienzan con `nexo:`. Una clave como `third-party-key` permanece. Después, el store usa `emptyData()`; no vuelve a sembrar demo durante esa sesión.

## Limitaciones

`LocalStorage` depende de navegador, perfil, origen y dispositivo. Puede estar deshabilitado, alcanzar cuota o borrarse por acción del usuario/sistema. No tiene sincronización, control de concurrencia entre dispositivos ni backup automático. Los componentes React no lo usan directamente: pasan siempre por store y repositorio.
