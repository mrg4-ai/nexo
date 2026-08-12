# Manual de usuario de Nexo

## ¿Qué es Nexo?

Nexo ayuda a registrar y entender las finanzas personales y de un pequeño negocio en una sola aplicación. Funciona en soles peruanos y guarda la información en el navegador actual.

## Antes de comenzar

No existe una cuenta de Nexo ni una copia automática en la nube. Tus datos pertenecen a este navegador, perfil y dirección web. Exporta un backup JSON periódicamente y siempre antes de borrar datos del navegador, reinstalar o cambiar de dispositivo.

## Primer inicio

En `/` encontrarás la presentación pública. Pulsa **Empezar** para abrir `/dashboard`. Si el espacio está limpio, Nexo solicita tu nombre antes de mostrar la aplicación. Es obligatorio, se recortan espacios al inicio/final y puedes usar hasta 60 caracteres.

Después verás la guía inicial de seis pasos. Puedes avanzar, retroceder, omitirla o finalizarla; no modifica datos financieros. Con el perfil listo, crea la primera cuenta, elige su tipo e ingresa el saldo que ya tenía. Luego registra el primer ingreso. El saldo inicial no es un ingreso del mes: representa dinero existente antes de comenzar el registro.

## Perfil, guía y ayuda

- Cambia tu nombre en **Configuración → Perfil y guía → Editar**. El saludo se actualiza sin recargar.
- Usa **Ver guía inicial** en Configuración o `/help` para volver a abrirla. Sólo se reinicia el estado de la guía.
- **Ayuda** abre el centro de ayuda dentro de Nexo con explicaciones breves de cada módulo, backups, instalación y uso offline.

## Modo demo

Desde la landing, **Probar demo** abre datos de ejemplo. El indicador **Modo demo** permanece visible. **Salir de demo** vuelve a `/` y conserva intactos tu perfil y datos normales. En Configuración, **Restablecer demo** recupera el dataset de ejemplo original. Los datos demo (`nexo-demo:v2:app`) y personales (`nexo:v2:app`) están aislados.

## Inicio / Dashboard

- **Disponible para gastar:** ingresos del período menos gastos, compromisos recurrentes aún pendientes y el objetivo de ahorro que falta cubrir.
- **Saldo total:** suma del saldo actual de todas las cuentas.
- **Ingresos / Gastos:** entradas y salidas personales del período seleccionado; no incluyen transferencias.
- **Ahorro:** diferencia entre ingresos y gastos del período. Puede ser negativa.
- **Patrimonio:** activos menos pasivos.
- **Flujo de dinero:** evolución visual; admite resultados positivos o negativos.
- **Distribución de gastos:** categorías personales con mayor gasto del período.
- **Presupuesto:** progreso de cada límite por categoría. Más de 100 % significa que fue excedido.
- **Salud financiera:** V1 no guarda un puntaje único. En el espacio Negocio, **Indicadores financieros** muestra razones referenciales; no son asesoría profesional.

## Movimientos

Abre **Nuevo movimiento** y selecciona **Gasto**, **Ingreso** o **Transferencia**. Completa monto, cuenta, fecha y descripción. Para editar o eliminar, abre el movimiento desde la lista. La pantalla permite buscar por descripción, filtrar por tipo y cambiar el período desde el selector superior en desktop.

Una transferencia sólo mueve dinero entre cuentas: no cuenta como ingreso ni gasto y no cambia el dinero combinado.

## Cuentas

Puedes crear cuentas de banco, efectivo, billetera, ahorro u otro tipo. Edita el nombre y saldo inicial desde la tarjeta. Una cuenta sin historial puede eliminarse; si tiene movimientos se archiva para conservarlos. Las cuentas archivadas no aparecen al registrar nuevos movimientos.

## Presupuestos

Crea un límite mensual por categoría, edítalo desde su fila o elimínalo. El progreso compara gastos personales de esa categoría y período con el límite. Los colores acompañan al porcentaje textual; el valor real no se recorta aunque supere 100 %.

## Metas de ahorro

Crea una meta con nombre, monto objetivo y fecha. Añade aportes para actualizar el progreso y su historial. Puedes editar o eliminar la meta. Al eliminarla también se elimina su historial de aportes.

## Activos y pasivos

Un activo es algo de valor; un pasivo es una deuda. Los saldos de cuentas ya se suman automáticamente como activos. No vuelvas a registrar el mismo dinero como activo manual porque duplicaría el patrimonio.

## Patrimonio

La fórmula es `Activos - Pasivos = Patrimonio`. Si tienes S/ 10.000 en activos y S/ 3.000 en deudas, el patrimonio es S/ 7.000. Si las deudas son mayores, el resultado será negativo y Nexo lo mostrará sin ocultarlo.

## Personal / Negocio

En desktop cambia el espacio desde la barra lateral. En móvil, la navegación adapta sus destinos al espacio activo. Los movimientos se guardan con alcance `personal` o `business` y los reportes los separan.

## Negocio y productos

En **Productos** registra nombre y precio de venta. En el detalle añade costos de **Materia prima**, **Mano de obra** y **Otros costos**. Nexo calcula:

- costo unitario: suma de costos;
- ganancia por unidad: precio menos costo;
- margen: ganancia dividida entre precio, en porcentaje.

Un producto puede pausarse para conservar su identidad histórica. Un margen negativo indica que el costo supera al precio.

## Inventario

El ajuste de stock registra cantidad actual, costo unitario y mínimo. **Disponible** significa cantidad mayor al mínimo; **Stock bajo**, cantidad positiva igual o menor; **Agotado**, cero. El valor es cantidad por costo unitario.

## Estado de resultados

Resume ventas, costo de ventas, margen bruto, gastos operativos y utilidad neta del período. **Utilidad disponible** es la utilidad neta calculada. Puede mostrar pérdida.

## Balance general

Presenta activos, pasivos y patrimonio. La igualdad utilizada es `Activos = Pasivos + Patrimonio`. Es una vista simplificada basada en los datos locales registrados.

## Flujo de caja

**Real** usa ingresos y egresos registrados. **Proyectado** añade movimientos recurrentes activos como estimación. La proyección no es una garantía.

## Indicadores financieros

Liquidez, capital de trabajo, endeudamiento, rentabilidad, rotación de inventario y capacidad de pago se calculan con los datos disponibles. Si el denominador es cero aparece **Sin datos suficientes**. Los textos son referenciales y no reemplazan asesoría financiera.

## Selector de período

El selector mensual cambia el período usado por dashboard, presupuestos y reportes. Las fechas se guardan como `YYYY-MM-DD` sin conversión UTC para evitar desplazamientos de día.

## Configuración

Incluye información general, tema, moneda, categorías, administración de datos, PWA y versión. V1 usa tema oscuro y PEN.

## Backup

En **Configuración → Datos**:

1. Pulsa **Exportar backup JSON** y conserva el archivo en un lugar seguro.
2. Para restaurar, pulsa **Importar backup JSON** y elige un archivo válido de Nexo.
3. La importación valida todo antes de reemplazar el dataset actual. Un archivo inválido no debe modificarlo.

Haz backups periódicos. Borrar los datos del navegador puede eliminar Nexo y no existe backup cloud.

## CSV

**Exportar movimientos CSV** crea un archivo UTF-8 con fecha, tipo, descripción, categoría, cuenta, monto y moneda. Puede abrirse en una hoja de cálculo. El CSV sirve para análisis; no es un backup completo importable.

## Instalar Nexo

- **Android Chrome:** abre el menú y busca la opción de instalar o añadir a pantalla de inicio.
- **Desktop Chrome/Edge:** usa el icono de instalación de la barra o la opción equivalente del menú.
- **iPhone Safari:** usa **Compartir** y **Añadir a pantalla de inicio**.

Los nombres exactos pueden variar según versión y plataforma. La instalación requiere un despliegue HTTPS válido.

## Modo offline

Abre Nexo correctamente online al menos una vez y visita las rutas necesarias. Después, el Service Worker puede servir el shell cacheado y el CRUD en `LocalStorage` continúa funcionando offline. Volver a conectarse no sincroniza nada con la nube.

## Eliminar todos los datos

La acción elimina todas las claves propiedad de Nexo en este origen y vuelve inmediatamente al primer inicio limpio. No puede deshacerse sin un backup. Las claves de otras aplicaciones no se eliminan.

## Preguntas frecuentes

**¿Mis datos se envían a internet?** No existe un backend de datos en V1; el despliegue sí entrega los archivos de la aplicación.

**¿Nexo tiene una base de datos en la nube?** No.

**¿Puedo usar automáticamente los mismos datos en otro dispositivo?** No.

**¿Cómo paso mis datos a otro navegador?** Exporta JSON en el origen y luego impórtalo en el destino.

**¿Qué ocurre si borro datos del navegador?** Puedes perder los datos de Nexo. Exporta antes un backup.

**¿Necesito internet?** Para la primera carga y para cachear rutas sí; después hay soporte offline donde el navegador lo permite.

**¿Las transferencias cuentan como gastos?** No; tampoco como ingresos.

**¿Puedo recuperar datos eliminados?** Sólo si conservas un backup JSON válido.

**¿Qué moneda utiliza Nexo V1?** PEN, sol peruano.
