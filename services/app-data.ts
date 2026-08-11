import type { AppData, BaseRecord } from "@/domain/models";
import { FINANCIAL_PERIOD, isFinancialDate } from "./financial-date";

const object=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==="object";
const finite=(value:unknown):value is number=>typeof value==="number"&&Number.isFinite(value);
const nonNegative=(value:unknown):value is number=>finite(value)&&value>=0;
const positive=(value:unknown):value is number=>finite(value)&&value>0;
const text=(value:unknown):value is string=>typeof value==="string"&&value.trim().length>0;
const base=(value:unknown):value is BaseRecord=>object(value)&&text(value.id)&&text(value.createdAt)&&text(value.updatedAt);
const uniqueIds=(values:{id:string}[])=>new Set(values.map(value=>value.id)).size===values.length;

export function isAppData(value:unknown):value is AppData{
  if(!object(value))return false;
  const d=value as unknown as AppData;
  const arrays=[d.accounts,d.transactions,d.budgets,d.goals,d.assets,d.liabilities,d.products,d.inventory,d.recurring,d.snapshots];
  if(arrays.some(collection=>!Array.isArray(collection))||!object(d.settings)||!object(d.business))return false;
  if(d.settings.schemaVersion!==2||d.settings.currency!=="PEN"||d.settings.appearance!=="dark"||!FINANCIAL_PERIOD.test(d.settings.selectedPeriod)||!nonNegative(d.settings.monthlySavingsTarget)||!object(d.settings.categories)||!Array.isArray(d.settings.categories.personal)||!Array.isArray(d.settings.categories.business)||![...d.settings.categories.personal,...d.settings.categories.business].every(text))return false;
  if(!base(d.business)||!text(d.business.name)||arrays.some(collection=>!uniqueIds(collection)))return false;
  if(!d.accounts.every(account=>base(account)&&text(account.name)&&["bank","cash","wallet","savings","other"].includes(account.type)&&account.currency==="PEN"&&finite(account.initialBalance)&&(account.archivedAt===undefined||text(account.archivedAt))))return false;
  const accountIds=new Set(d.accounts.map(account=>account.id));
  if(!d.transactions.every(transaction=>base(transaction)&&["income","expense","transfer"].includes(transaction.type)&&positive(transaction.amount)&&text(transaction.category)&&text(transaction.description)&&isFinancialDate(transaction.date)&&["personal","business"].includes(transaction.workspace)&&accountIds.has(transaction.accountId)&&(transaction.type!=="transfer"||(!!transaction.destinationAccountId&&transaction.destinationAccountId!==transaction.accountId&&accountIds.has(transaction.destinationAccountId)))))return false;
  if(!d.budgets.every(budget=>base(budget)&&text(budget.category)&&positive(budget.limit)))return false;
  if(!d.goals.every(goal=>base(goal)&&text(goal.name)&&nonNegative(goal.targetAmount)&&nonNegative(goal.currentAmount)&&isFinancialDate(goal.targetDate)&&Array.isArray(goal.contributions)&&uniqueIds(goal.contributions)&&goal.contributions.every(contribution=>text(contribution.id)&&positive(contribution.amount)&&isFinancialDate(contribution.date))))return false;
  if(!d.assets.every(asset=>base(asset)&&text(asset.name)&&text(asset.kind)&&nonNegative(asset.value))||!d.liabilities.every(liability=>base(liability)&&text(liability.name)&&text(liability.kind)&&nonNegative(liability.value)))return false;
  if(!d.products.every(product=>base(product)&&text(product.name)&&nonNegative(product.salePrice)&&nonNegative(product.sales)&&["active","paused"].includes(product.status)&&Array.isArray(product.costs)&&uniqueIds(product.costs)&&product.costs.every(cost=>text(cost.id)&&text(cost.name)&&nonNegative(cost.amount)&&["material","labor","other"].includes(cost.type))))return false;
  const productIds=new Set(d.products.map(product=>product.id));
  if(!d.inventory.every(item=>base(item)&&productIds.has(item.productId)&&nonNegative(item.quantity)&&nonNegative(item.unitCost)&&nonNegative(item.minimumStock)&&Array.isArray(item.adjustments)&&uniqueIds(item.adjustments)&&item.adjustments.every(adjustment=>text(adjustment.id)&&finite(adjustment.quantity)&&isFinancialDate(adjustment.date))))return false;
  if(!d.recurring.every(item=>base(item)&&["income","expense"].includes(item.type)&&positive(item.amount)&&Number.isInteger(item.day)&&item.day>=1&&item.day<=31&&text(item.description)&&typeof item.active==="boolean"))return false;
  return d.snapshots.every(snapshot=>base(snapshot)&&text(snapshot.month)&&finite(snapshot.assets)&&finite(snapshot.liabilities));
}

export function migrateAppData(value:unknown):AppData|null{
  if(!object(value))return null;
  const candidate=structuredClone(value);
  const settings=object(candidate.settings)?candidate.settings:null;
  if(settings?.schemaVersion===1){settings.schemaVersion=2;settings.selectedPeriod="2026-08";}
  if(settings?.schemaVersion===2&&!settings.categories)settings.categories={personal:["Alimentación","Transporte","Vivienda","Servicios","Ingresos","Otros"],business:["Ventas","Costos","Gastos operativos","Servicios","Otros"]};
  return isAppData(candidate)?candidate:null;
}
