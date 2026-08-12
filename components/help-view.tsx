"use client";

import { Button } from "@heroui/react";
import { useAppStore } from "@/stores/app-store";
import { Card, PageHeader } from "./ui";

const sections=[
  ["Primeros pasos","Indica tu nombre, crea tu primera cuenta y registra un ingreso para comenzar a ver tu resumen financiero."],
  ["Movimientos","Un Ingreso aumenta el dinero disponible y un Gasto lo reduce. Una Transferencia mueve dinero entre tus propias cuentas: no se considera un ingreso ni un gasto."],
  ["Cuentas","Cada cuenta parte de su saldo inicial. Nexo suma ingresos y transferencias recibidas, y resta gastos y transferencias enviadas."],
  ["Presupuestos","Define un límite mensual por categoría. Nexo compara los gastos del periodo y muestra el porcentaje consumido."],
  ["Metas de ahorro","Crea una meta con importe y fecha objetivo. Cada aporte se guarda en su historial y actualiza el avance."],
  ["Patrimonio","Activos − Pasivos = Patrimonio. Los saldos de tus cuentas ya están incluidos; registra sólo otros activos para no duplicarlos."],
  ["Negocio","El espacio Negocio reúne una visión básica de ventas, costos, inventario y reportes. No sustituye un sistema contable empresarial."],
  ["Productos y costos","Registra precio de venta y costos de materia prima, mano de obra u otros. Nexo deriva costo unitario, ganancia y margen."],
  ["Inventario","Ajusta cantidades, costo unitario y stock mínimo. El valor de inventario es cantidad por costo unitario."],
  ["Flujo de caja","Compara entradas, salidas y flujo neto. La vista proyectada incorpora movimientos recurrentes activos."],
  ["Estado de resultados","Resume ventas, costo de ventas, margen bruto, gastos operativos y utilidad para el periodo."],
  ["Balance general","Presenta activos, pasivos y patrimonio calculado con los datos actuales."],
  ["Indicadores financieros","Muestra ratios derivados de tus datos. Cuando una división no es válida, Nexo indica Sin datos suficientes."],
  ["Backups","Tus datos se guardan en este dispositivo y Nexo Local V1.1 no usa nube. Si se borran los datos del navegador, pueden perderse. Exporta periódicamente desde Configuración → Datos → Exportar backup JSON. Para restaurar, utiliza Importar backup JSON."],
  ["Instalar Nexo","En navegadores compatibles, abre el menú del navegador y busca la opción de instalar o añadir a la pantalla de inicio. El nombre exacto puede variar."],
  ["Uso sin conexión","Tras una primera carga y cacheo correctos, puedes usar las operaciones locales sin Internet. Al reconectar no se sincroniza con una nube porque Nexo Local no tiene nube."],
] as const;

export function HelpView(){const setGuideCompleted=useAppStore(state=>state.setGuideCompleted);return <><PageHeader title="Ayuda y guía" description="Aprende a utilizar Nexo y encuentra respuestas rápidas." action={<Button className="secondary-button" onPress={()=>void setGuideCompleted(false)}>Ver guía inicial</Button>}/><Card className="help-center">{sections.map(([title,copy])=><details id={title==="Backups"?"backups":undefined} key={title}><summary>{title}</summary><p>{copy}</p></details>)}</Card></>}
