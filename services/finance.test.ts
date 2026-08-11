import { describe, expect, it } from "vitest";
import { accountBalance, availableToSpend, balanceSheet, budgetSpent, goalAmount, monthly, netWorth, productMetrics, safeRatio, statement } from "./finance";
import { seedData } from "./seed";
describe("financial services",()=>{
 it("sums income and expenses but excludes transfers",()=>{expect(monthly(seedData.transactions,"income","2026-08")).toBe(8500);expect(monthly(seedData.transactions,"expense","2026-08")).toBe(363.5)});
 it("moves money between accounts without changing analytics",()=>{const tx={...seedData.transactions[0],id:"x",type:"transfer" as const,amount:100,accountId:"acc-bank",destinationAccountId:"acc-savings"};expect(accountBalance(seedData.accounts[0],[tx])).toBe(18300);expect(accountBalance(seedData.accounts[2],[tx])).toBe(12300);expect(monthly([tx],"expense","2026-08")).toBe(0)});
 it("calculates net worth from live account balances plus manual assets",()=>expect(netWorth(seedData)).toBe(152226.5));
 it("calculates available to spend with commitments and target",()=>expect(availableToSpend(seedData,"2026-08")).toBe(6256.5));
 it("calculates product margins safely",()=>{expect(productMetrics(seedData.products[0])).toEqual({unitCost:18,profit:20,margin:52.63});expect(productMetrics({...seedData.products[0],salePrice:0}).margin).toBe(0)});
 it("builds income statement and balance sheet totals",()=>{expect(statement(seedData)).toEqual({sales:12400,cogs:6962,gross:5438,expenses:1450,net:3988});const b=balanceSheet(seedData);expect(b.assets).toBe(249426.5);expect(b.liabilities+b.equity).toBe(b.assets)});
 it("handles zero denominators",()=>{expect(safeRatio(10,2)).toBe(5);expect(safeRatio(10,0)).toBeNull()});
 it("uses financial period boundaries",()=>{const base={...seedData.transactions[0],type:"expense" as const};const tx=[{...base,date:"2026-07-31",amount:10},{...base,id:"b",date:"2026-08-01",amount:20},{...base,id:"c",date:"2026-08-31",amount:30},{...base,id:"d",date:"2026-09-01",amount:40}];expect(monthly(tx,"expense","2026-08")).toBe(50);expect(budgetSpent({...seedData,transactions:tx},tx[0].category,"2026-08")).toBe(50)});
 it("derives goal progress from its contribution ledger",()=>expect(goalAmount(seedData.goals[0])).toBe(12600));
 it("does not count an already registered recurring expense twice",()=>{const recurring=seedData.recurring[0];const transaction={...seedData.transactions[0],id:"rec",type:"expense" as const,description:recurring.description,amount:recurring.amount,recurring:true};const data={...seedData,transactions:[...seedData.transactions,transaction]};expect(availableToSpend(data,"2026-08")).toBe(availableToSpend(seedData,"2026-08"))});
});
