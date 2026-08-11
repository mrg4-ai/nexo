import { describe, expect, it } from "vitest";
import type { Transaction } from "@/domain/models";
import { isAppData, migrateAppData } from "./app-data";
import { createBackup, parseBackup, transactionsCsv } from "./backup";
import { accountBalance, actualCashFlow, availableToSpend, balanceSheet, budgetSpent, monthly, netWorth, productMetrics, safeRatio, statement, totalBalance } from "./finance";
import { isFinancialDate, periodOf } from "./financial-date";
import { roundMoney, sumMoney } from "./money";
import { stressData } from "./rc-fixtures";

describe("release candidate: volumen y extremos",()=>{
  it.each([0,1,50,500,1000])("mantiene válido y serializable un dataset de %i movimientos",count=>{
    const data=stressData(count);const restored=JSON.parse(JSON.stringify(data));
    expect(isAppData(restored)).toBe(true);expect(restored.transactions).toHaveLength(count);
    expect(Number.isFinite(totalBalance(data))).toBe(true);expect(transactionsCsv(data).split("\r\n")).toHaveLength(count+1);
  });
  it("conserva precisión de centavos en importes extremos",()=>{
    expect([0.01,0.1,1,9999.99,999999.99,9999999.99].map(roundMoney)).toEqual([0.01,0.1,1,9999.99,999999.99,9999999.99]);
    expect(sumMoney([0.01,0.1,1,9999.99,999999.99,9999999.99])).toBe(11010001.08);
  });
});

describe("release candidate: escenarios negativos y cero",()=>{
  it("muestra resultados negativos sin recortarlos",()=>{
    const data=stressData(0);data.transactions=[tx("income",100),tx("expense",450,"e2")];data.liabilities=[record({name:"Deuda",value:14000,kind:"Corriente"},"l")];
    expect(availableToSpend(data,"2026-08")).toBe(-350);expect(netWorth(data)).toBe(-13350);expect(actualCashFlow(data,"2026-08","personal").net).toBe(-350);
    data.products=[record({name:"Producto con pérdida",salePrice:10,sales:2,status:"active",costs:[{id:"c",name:"Costo",amount:12,type:"material"}]},"p")];
    expect(productMetrics(data.products[0])).toEqual({unitCost:12,profit:-2,margin:-20});
  });
  it("evita NaN e infinito con denominadores cero",()=>{expect(safeRatio(0,0)).toBeNull();expect(safeRatio(10,0)).toBeNull();expect(productMetrics(record({name:"Gratis",salePrice:0,sales:0,status:"active",costs:[]},"p")).margin).toBe(0)});
  it("admite pérdida de negocio y patrimonio negativo manteniendo el balance",()=>{const data=stressData(0);data.products=[record({name:"P",salePrice:1,sales:10,status:"active",costs:[{id:"c",name:"Costo",amount:5,type:"material"}]},"p")];data.transactions=[{...tx("expense",100,"be"),workspace:"business"}];data.liabilities=[record({name:"Deuda",value:5000,kind:"Corriente"},"l")];expect(statement(data).net).toBe(-150);expect(balanceSheet(data).balanced).toBe(true)});
});

describe("release candidate: transferencias y fechas",()=>{
  it("tolera el ciclo A→B→C→A y edición/eliminación sin alterar el total",()=>{
    const data=stressData(0);data.accounts=["A","B","C"].map(id=>record({name:id,type:"bank" as const,initialBalance:100,currency:"PEN" as const},id));
    const transfers=[transfer("A","B",20,"ab"),transfer("B","C",30,"bc"),transfer("C","A",10,"ca")];
    expect(sumMoney(data.accounts.map(a=>accountBalance(a,transfers)))).toBe(300);expect(monthly(transfers,"income","2026-08")).toBe(0);expect(monthly(transfers,"expense","2026-08")).toBe(0);
    const edited=transfers.map(t=>t.id==="ab"?{...t,amount:45,accountId:"C",destinationAccountId:"B"}:t);expect(sumMoney(data.accounts.map(a=>accountBalance(a,edited)))).toBe(300);
    expect(sumMoney(data.accounts.map(a=>accountBalance(a,edited.filter(t=>t.id!=="bc"))))).toBe(300);
  });
  it.each(["2023-12-31","2024-01-01","2024-02-29","2024-12-31","2025-01-01"])("valida y agrupa %s sin desplazamiento UTC",date=>{expect(isFinancialDate(date)).toBe(true);expect(periodOf(date)).toBe(date.slice(0,7))});
  it("separa meses, presupuestos y cierres de año",()=>{const data=stressData(0);data.transactions=[{...tx("expense",10,"d"),date:"2024-02-29"},{...tx("expense",20,"j"),date:"2024-03-01"}];expect(monthly(data.transactions,"expense","2024-02")).toBe(10);expect(budgetSpent(data,"Alimentación","2024-03")).toBe(20)});
});

describe("release candidate: backup, CSV y migración",()=>{
  it("completa dos rondas lógicamente equivalentes de backup",()=>{const data=stressData(50);const first=parseBackup(JSON.stringify(createBackup(data,new Date("2026-08-11T00:00:00Z"))));expect(first).toEqual(data);const second=parseBackup(JSON.stringify(createBackup(first!,new Date("2026-08-12T00:00:00Z"))));expect(second).toEqual(data)});
  it.each(["", "texto", "{}", JSON.stringify({app:"otra",schemaVersion:2,data:stressData(1)}), JSON.stringify({app:"nexo",schemaVersion:99,data:stressData(1)}), JSON.stringify({app:"nexo",schemaVersion:2,data:{}})])("rechaza backup inválido sin producir reemplazo",raw=>expect(parseBackup(raw)).toBeNull());
  it("rechaza colecciones y referencias parcialmente corruptas",()=>{const malformed=stressData(1);malformed.transactions[0].accountId="inexistente";expect(migrateAppData(malformed)).toBeNull();const malformedAccount=stressData(1) as unknown as {accounts:{type:string}[]};malformedAccount.accounts[0].type="banco";expect(migrateAppData(malformedAccount)).toBeNull()});
  it("genera CSV UTF-8 escapado con puntuación y contenido multilínea",()=>{const data=stressData(1);data.transactions[0].description='Cena, amigos; "Pago completo"\nLínea 2 — José 😊';const csv=transactionsCsv(data);expect(csv.charCodeAt(0)).toBe(0xfeff);expect(csv).toContain('"Cena, amigos; ""Pago completo"" Línea 2 — José 😊"');expect(csv).toContain('"0.01"')});
});

describe("release candidate: identidad histórica",()=>{
  it("acepta cuenta archivada y categoría histórica sin ofrecer una relación corrupta",()=>{const data=stressData(1);data.accounts[0].archivedAt="2026-08-11T01:00:00.000Z";data.transactions[0].category="Categoría histórica archivada";expect(isAppData(data)).toBe(true);expect(data.settings.categories.personal).not.toContain(data.transactions[0].category);expect(accountBalance(data.accounts[0],data.transactions)).toBe(1000.01)});
});

const record=<T extends object>(value:T,id:string)=>({id,createdAt:"2026-08-11T00:00:00.000Z",updatedAt:"2026-08-11T00:00:00.000Z",...value});
const tx=(type:"income"|"expense",amount:number,id="t"):Transaction=>record({type,amount,category:"Alimentación",accountId:"stress-account",date:"2026-08-11",description:id,workspace:"personal"},id);
const transfer=(origin:string,destination:string,amount:number,id:string):Transaction=>record({type:"transfer",amount,category:"Transferencia",accountId:origin,destinationAccountId:destination,date:"2026-08-11",description:id,workspace:"personal"},id);
