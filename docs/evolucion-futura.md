# Nota de evolución futura

La separación existente permite imaginar otra versión con este flujo:

```text
UI → Zustand/servicios → AppRepository → ApiRepository → backend → SQL
```

Un cambio así exigiría diseñar autenticación, autorización, sincronización, conflictos, contratos HTTP, observabilidad y migración desde archivos locales. Ningún proveedor, esquema SQL o protocolo está decidido en V1. Esta nota sólo explica por qué la UI y las fórmulas no dependen directamente de `LocalStorage`; no es un plan de implementación ni una promesa de producto.
