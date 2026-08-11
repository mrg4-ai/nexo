import type { AppData } from "@/domain/models";
import { migrateAppData } from "./app-data";
export interface NexoBackup { app:"nexo";schemaVersion:2;exportedAt:string;data:AppData }
export const createBackup=(data:AppData,now=new Date()):NexoBackup=>({app:"nexo",schemaVersion:2,exportedAt:now.toISOString(),data});
export function parseBackup(raw:string):AppData|null{try{const v=JSON.parse(raw) as Partial<NexoBackup>;if(v.app!=="nexo"||![1,2].includes(Number(v.schemaVersion))||!v.data)return null;return migrateAppData(v.data)}catch{return null}}
export const escapeCsv=(value:unknown)=>`"${String(value??"").replaceAll('"','""').replace(/\r?\n/g," ")}"`;
export function transactionsCsv(data:AppData){const accounts=new Map(data.accounts.map(a=>[a.id,a.name]));return "\uFEFF"+["date,type,description,category,account,amount,currency",...data.transactions.map(t=>[t.date,t.type,t.description,t.category,accounts.get(t.accountId)??"",t.amount.toFixed(2),data.settings.currency].map(escapeCsv).join(","))].join("\r\n")}
