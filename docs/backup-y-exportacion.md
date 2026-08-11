# Backup, importación y exportación

## Backup JSON

`createBackup` produce un objeto con:

```json
{
  "app": "nexo",
  "schemaVersion": 2,
  "exportedAt": "fecha ISO",
  "data": { "...": "AppData completo" }
}
```

`exportedAt` describe el archivo; no altera las entidades internas.

## Pipeline de importación

```text
archivo → FileReader → JSON.parse → app/schema → migrateAppData
       → validación completa → replaceData → escritura LocalStorage → Zustand
```

`parseBackup` acepta backups Nexo de esquema 1 o 2 sólo si el payload puede convertirse en un `AppData` V2 válido. Un archivo vacío, texto, JSON extranjero, esquema futuro, colección parcial, transacción inválida o referencia huérfana devuelve `null`. La UI no ejecuta `replaceData`, por lo que el estado existente queda intacto.

El round-trip probado es: exportar A, eliminar Nexo, importar A y exportar de nuevo. Los dos payloads `data` son lógicamente equivalentes; `exportedAt` puede cambiar.

## CSV

`transactionsCsv` exporta todas las transacciones con columnas:

```text
date,type,description,category,account,amount,currency
```

Cada campo va entre comillas, las comillas internas se duplican y los saltos de línea se convierten en espacios para conservar una fila por movimiento. Los montos usan punto y dos decimales. El archivo comienza con BOM UTF-8 para mejorar compatibilidad con hojas de cálculo y conserva tildes y emoji.

CSV no contiene todas las colecciones y no puede importarse como backup. Para recuperación usa JSON.
