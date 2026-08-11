# Solución de problemas

## Mis datos desaparecieron

Comprueba primero que usas el mismo navegador, perfil y origen web. No borres caché ni almacenamiento. Busca un backup JSON reciente y revisa si el navegador bloqueó `LocalStorage`. Si cambió el dominio, exporta desde el origen anterior e importa en el nuevo.

## El backup no se importa

Confirma que es un JSON exportado por Nexo y no un CSV. No edites el archivo. Versiones futuras, JSON parcial o referencias inválidas se rechazan para proteger el estado actual. Conserva tanto el archivo fallido como un backup del estado vigente.

## La aplicación no se instala

Usa el despliegue HTTPS, espera la primera carga completa y revisa manifest/Service Worker en DevTools. En iPhone se usa **Añadir a pantalla de inicio**; no siempre existe un prompt automático.

## Una ruta no está disponible offline

Reconecta, abre correctamente esa ruta y vuelve a intentar. Una ruta nunca cacheada devuelve 503 de forma deliberada.

## Veo una interfaz anterior tras desplegar

Primero vuelve online y recarga una vez para que el worker busque la actualización. Comprueba que `/sw.js` responde sin caché HTTP y que `CACHE_VERSION` cambió cuando correspondía. Exporta backup antes de eliminar manualmente datos del sitio; no es el primer paso recomendado.

## El demo no aparece

`NEXT_PUBLIC_DEMO_DATA=true` sólo se usa si no existe dataset guardado. Verifica la variable en el proceso de build/start y usa un perfil limpio de prueba.

## El demo aparece inesperadamente

Configura `NEXT_PUBLIC_DEMO_DATA=false` o elimina la variable antes del build. En una prueba controlada, exporta backup antes de usar **Eliminar todos los datos**.

## LocalStorage no está disponible

Revisa modo privado, permisos, políticas corporativas y cuota. Nexo mostrará un aviso y no debe reemplazar el estado anterior ante una escritura fallida.

## Falla build o testing

Verifica Node.js ≥20.9, `pnpm install`, ausencia de otro `next dev` del mismo proyecto y disponibilidad de Chromium para Playwright. Ejecuta por separado `pnpm typecheck`, `pnpm lint`, `pnpm test` y `pnpm build` para aislar el error.
