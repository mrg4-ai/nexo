# Modelo de datos

Todas las entidades principales están en `domain/models.ts`. Los registros con `BaseRecord` tienen `id`, `createdAt` y `updatedAt`; los IDs nuevos se generan con `crypto.randomUUID()`.

## Entidades

- **Account:** nombre, tipo (`bank`, `cash`, `wallet`, `savings`, `other`), saldo inicial, PEN y `archivedAt` opcional. Su saldo actual es derivado.
- **Transaction:** tipo, monto, categoría, cuenta, destino opcional, fecha civil, descripción, notas/recurrencia opcionales y workspace. Las transferencias exigen dos cuentas distintas.
- **Category:** no es una interfaz independiente; son strings dentro de `Settings.categories.personal` y `.business`. Renombrar/archivar una categoría no reescribe el texto histórico de transacciones.
- **Budget:** categoría y límite mensual. El gasto es derivado por categoría y período.
- **SavingGoal:** nombre, objetivo, fecha y ledger de `contributions`. `currentAmount` se persiste por compatibilidad; la UI financiera deriva el avance con `goalAmount`.
- **Contribution:** ID, monto y fecha dentro de una meta.
- **Asset / Liability:** nombre, valor y tipo libre (`kind`). Las cuentas ya son activos automáticos.
- **Business:** identidad básica del negocio local.
- **Product:** nombre, precio, ventas acumuladas, estado `active|paused` y costos.
- **ProductCostItem:** ID, nombre, monto y tipo `material|labor|other`. Es el `ProductCost` implementado.
- **InventoryItem:** producto relacionado, cantidad, costo unitario, mínimo y ajustes.
- **InventoryAdjustment:** ID, diferencia de cantidad y fecha; vive dentro del item.
- **RecurringTransaction:** ingreso/gasto, monto, día, descripción y estado activo. Alimenta proyecciones y disponible.
- **MonthlySnapshot:** etiqueta de mes, activos y pasivos para la serie histórica.
- **Settings:** PEN, tema oscuro, objetivo mensual, versión 2, período y categorías.
- **UserProfile:** identidad local con `id`, nombre, `createdAt` y `updatedAt`. El nombre es obligatorio, se recorta y admite hasta 60 caracteres.
- **Settings:** también persiste `guideCompleted`, que sólo indica si la guía inicial fue finalizada u omitida.
- **AppData:** raíz atómica que agrupa `profile`, todas las colecciones, `business` y `settings`.

## Relaciones y alcance

`Transaction.accountId` y `destinationAccountId` referencian cuentas existentes. `InventoryItem.productId` referencia un producto. La validación rechaza relaciones huérfanas. Las transacciones distinguen `personal` y `business`; cuentas, activos y pasivos participan en la posición financiera global.

## Persistido y derivado

Se persisten entradas del usuario, costos, cantidades y snapshots. No se persisten saldo de cuenta, saldo total, patrimonio, gasto presupuestario, costo unitario, ganancia, margen, valor de inventario ni reportes: se recalculan para evitar valores secundarios obsoletos.

## Archivado

Las cuentas referenciadas reciben `archivedAt` y se conservan para el historial; se excluyen de nuevos movimientos. Los productos usan `status: "paused"` para conservar costos e inventario. Las categorías eliminadas dejan de ofrecerse, pero el string histórico de cada movimiento permanece.
