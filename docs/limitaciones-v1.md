# Limitaciones y alcance de V1.1

## Lo que sí soporta

Nexo Local V1.1 ofrece CRUD financiero personal y de negocio, cálculos derivados, reportes simplificados, backup JSON, CSV, responsive, PWA y operaciones locales offline después de cachear la aplicación.

V1.1 añade landing, identidad local, guía, ayuda y demo aislada sin cambiar el motor financiero.

## Límites deliberados

- Persistencia exclusivamente en `LocalStorage`.
- Sin autenticación, cuentas remotas ni recuperación de contraseña.
- Sin nube, sincronización automática ni backup remoto.
- Dataset ligado a navegador, perfil, dispositivo y origen.
- Sólo PEN; sin FX ni conversión de divisas.
- Sin conexiones bancarias, importación bancaria u OCR.
- Sin colaboración, roles ni multiusuario.
- Sin backend, API o base SQL.
- Disponibilidad offline condicionada por rutas/assets cacheados y políticas del navegador.
- Instalación y retención de datos PWA pueden variar por plataforma.
- Estados e indicadores son simplificados y no constituyen asesoría contable o financiera.
- `Product.sales` es un contador del modelo; V1 no implementa un submódulo de ventas por unidades ni contabilidad de inventario automática.

Estas decisiones describen una demo local-first terminada; no son fallos ocultos. Para mover datos entre entornos se usa backup JSON manual.
