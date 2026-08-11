# Lógica financiera

Las fórmulas siguientes corresponden a `services/finance.ts`. Los importes se redondean a dos decimales mediante `roundMoney`; `sumMoney` redondea en cada acumulación.

## Saldo de cuenta

```text
saldo = saldo inicial
      + ingresos a la cuenta
      - gastos desde la cuenta
      - transferencias salientes
      + transferencias entrantes
```

Una transferencia de S/ 100 reduce una cuenta y aumenta otra por S/ 100: el saldo combinado no cambia.

## Ingresos y gastos

`monthly` filtra por `YYYY-MM`, workspace y tipo. Las transferencias quedan excluidas porque sólo se suman tipos `income` o `expense`.

## Ahorro

La etiqueta **Ahorro** del dashboard móvil significa `ingresos personales - gastos personales` del período. Los aportes de metas no se restan otra vez de esta etiqueta.

## Disponible para gastar

```text
ingresos personales del período
- gastos personales del período
- gastos recurrentes activos todavía no registrados
- parte pendiente del objetivo mensual de ahorro
```

La parte pendiente del objetivo es `max(0, objetivo - aportes a metas del período)`. El resultado puede ser negativo.

## Presupuestos

`budgetSpent` suma gastos personales cuya categoría coincide exactamente y cuya fecha pertenece al período. El porcentaje es `gastado / límite × 100`. La barra visual se limita a 100 % por diseño, pero el texto conserva el porcentaje real.

## Activos, pasivos y patrimonio

```text
activos = saldo actual de cuentas + activos manuales no duplicados
pasivos = suma de liabilities
patrimonio = activos - pasivos
```

El seed legado contiene `as1 / Efectivo y cuentas`; se excluye para no duplicar las cuentas. Los activos nuevos deben representar valores diferentes del dinero ya incluido.

## Productos

```text
costo unitario = suma de ProductCostItem.amount
ganancia por unidad = precio de venta - costo unitario
margen % = ganancia por unidad / precio de venta × 100
```

Si el precio es cero, el margen devuelve `0` para evitar infinito. Si el costo supera al precio, ganancia y margen son negativos.

## Inventario

`valor = cantidad × costo unitario`. Disponible: cantidad mayor al mínimo; stock bajo: cantidad positiva igual o menor; agotado: cantidad menor o igual a cero.

## Estado de resultados

Para el período seleccionado y workspace business:

```text
ventas = ingresos business
costo de ventas = Σ(costo unitario de producto × Product.sales)
margen bruto = ventas - costo de ventas
gastos operativos = gastos business
utilidad neta = ventas - costo de ventas - gastos operativos
```

`Product.sales` es el contador persistido implementado; no se deriva de transacciones. V1 no modela asientos contables ni impuestos.

## Balance general

```text
patrimonio = activos - pasivos
pasivos + patrimonio = activos
```

Es una representación simplificada de la posición local, no un libro mayor contable.

## Flujo de caja

Real: `ingresos business - gastos business` del período. Proyectado: suma al flujo real todos los ingresos y gastos recurrentes activos. Es una estimación y puede ser negativa.

## Indicadores

- Liquidez: activos corrientes / pasivos corrientes.
- Capital de trabajo: activos corrientes - pasivos corrientes.
- Endeudamiento: pasivos / activos × 100.
- Rentabilidad: utilidad neta / ventas × 100.
- Rotación de inventario: costo de ventas / valor actual de inventario.
- Capacidad de pago: utilidad neta / pasivos corrientes.

`safeRatio` devuelve `null` si un valor no es finito o el denominador es cero. La UI muestra **Sin datos suficientes**, nunca `NaN` o `Infinity`.

## Fechas

Los períodos se obtienen por substring de fechas civiles validadas `YYYY-MM-DD`. No se convierten a medianoche local; el formateo usa UTC explícito para no mover una fecha al día anterior o siguiente.
