# Checklist manual de dispositivos PWA

Todas las casillas permanecen pendientes hasta que una persona pruebe el despliegue HTTPS final. Antes de pruebas destructivas, exportar un backup JSON.

## Android / Chrome

- [ ] Abrir Nexo online y visitar rutas personales y de negocio.
- [ ] Confirmar que el menú ofrece instalar/añadir a inicio y que nombre/icono sean Nexo.
- [ ] Instalar y abrir desde el launcher en modo standalone.
- [ ] Revisar notch, orientación vertical, teclado, sheet y navegación inferior.
- [ ] Activar modo avión, cerrar/reabrir y navegar por rutas visitadas.
- [ ] Offline: crear/editar/eliminar gasto, crear presupuesto, aportar a meta y ajustar inventario.
- [ ] Recargar offline y comprobar persistencia.
- [ ] Exportar JSON y CSV offline.
- [ ] Volver online y verificar actualización de versión sin pérdida de datos.

## iPhone / Safari

- [ ] Abrir online y usar **Compartir → Añadir a pantalla de inicio**.
- [ ] Confirmar icono, título, standalone y safe areas con notch.
- [ ] Revisar teclado, scroll, sheet y barra inferior.
- [ ] Visitar rutas, activar modo avión, cerrar desde selector y reabrir.
- [ ] Repetir CRUD offline, recarga y backup.
- [ ] Volver online y confirmar que no aparece pantalla en blanco ni loop de recarga.

## Desktop Chrome / Edge

- [ ] Confirmar indicador/opción de instalación y abrir ventana independiente.
- [ ] En DevTools → Application comprobar manifest, scope `/`, iconos y worker activo.
- [ ] Comprobar caches `nexo-shell-v3` y `nexo-assets-v3`.
- [ ] Activar Offline, navegar, recargar, hacer CRUD y exportar backup.
- [ ] Una ruta nunca guardada devuelve 503 offline; una URL inválida online muestra not-found.
- [ ] Simular una nueva versión y confirmar eliminación de cachés Nexo viejos sin tocar `nexo:v2:app`.

## Matriz visual

- [ ] 320×568
- [ ] 375×812
- [ ] 390×844
- [ ] 430×932
- [ ] 768×1024
- [ ] 1024×768
- [ ] 1280×800
- [ ] 1440×900
- [ ] 1920×1080

En cada tamaño: sin overflow horizontal, acción primaria oculta, navegación superpuesta, texto financiero ilegible ni chart roto.

## Criterio

No aprobar el despliegue final si falla instalación, reapertura standalone, CRUD offline, persistencia o backup en un navegador objetivo. Nexo V1 no sincroniza con la nube.
