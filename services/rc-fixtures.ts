import type { AppData, Transaction } from "@/domain/models";
import { emptyData } from "./empty-data";

const stamp="2026-08-11T00:00:00.000Z";
export function stressData(transactionCount:number):AppData{
  const data=emptyData();
  data.accounts=[{id:"stress-account",name:"Cuenta determinista para pruebas de carga",type:"bank",initialBalance:1000,currency:"PEN",createdAt:stamp,updatedAt:stamp}];
  data.transactions=Array.from({length:transactionCount},(_,index):Transaction=>({
    id:`stress-${index}`,
    type:index%3===0?"income":"expense",
    amount:[0.01,0.1,1,9999.99,999999.99,9999999.99][index%6],
    category:index%2===0?"Alimentación":"Servicios",
    accountId:"stress-account",
    date:`2026-${String(index%12+1).padStart(2,"0")}-${String(index%28+1).padStart(2,"0")}`,
    description:`Movimiento determinista ${index}`,
    workspace:"personal",
    createdAt:stamp,
    updatedAt:stamp,
  }));
  return data;
}
