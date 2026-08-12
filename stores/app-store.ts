"use client";

import { create } from "zustand";
import type { Account, AppData, Transaction, TransactionType, UserProfile, Workspace } from "@/domain/models";
import { demoRepository, realRepository, type AppRepository } from "@/repositories/local/app.repository";
import { emptyData } from "@/services/empty-data";
import { seedData } from "@/services/seed";
import { isFinancialDate } from "@/services/financial-date";
import { isPositiveMoney, roundMoney } from "@/services/money";

const DEMO_SESSION_KEY = "nexo-demo-session";
let repository: AppRepository = realRepository();
const sessionGet=()=>typeof sessionStorage==="undefined"?null:sessionStorage.getItem(DEMO_SESSION_KEY);
const sessionSet=()=>{if(typeof sessionStorage!=="undefined")sessionStorage.setItem(DEMO_SESSION_KEY,"1")};
const sessionClear=()=>{if(typeof sessionStorage!=="undefined")sessionStorage.removeItem(DEMO_SESSION_KEY)};

export type TransactionInput = {type:TransactionType;amount:number;category:string;accountId:string;destinationAccountId?:string;date:string;description:string;notes?:string;recurring?:boolean};
type State = {
  data: AppData;
  hydrated: boolean;
  demoMode: boolean;
  workspace: Workspace;
  drawerOpen: boolean;
  editingTransactionId: string | null;
  draftTransactionType: TransactionType;
  busy: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  exitDemo: () => Promise<void>;
  resetDemo: () => Promise<void>;
  saveProfile: (name: string) => Promise<void>;
  setGuideCompleted: (completed: boolean) => Promise<void>;
  setWorkspace: (workspace: Workspace) => void;
  setPeriod: (period: string) => Promise<void>;
  openDrawer: (id?: unknown) => void;
  closeDrawer: () => void;
  addTransaction: (value: TransactionInput) => Promise<void>;
  updateTransaction: (id: string, value: TransactionInput) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  createAccount: (value: Pick<Account,"name"|"type"|"initialBalance"|"currency">) => Promise<void>;
  updateAccount: (id: string, value: Partial<Pick<Account,"name"|"type"|"initialBalance">>) => Promise<void>;
  archiveAccount: (id: string) => Promise<void>;
  updateData: (fn: (data: AppData) => AppData) => Promise<void>;
  replaceData: (data: AppData) => Promise<void>;
  reset: () => Promise<void>;
  clearError: () => void;
};

const validateTransaction = (value: TransactionInput, data: AppData) => {
  if (!isPositiveMoney(value.amount) || !isFinancialDate(value.date) || !value.description.trim() || !value.category.trim()) throw new Error("Revisa los datos del movimiento.");
  if (!data.accounts.some(account => account.id === value.accountId && !account.archivedAt)) throw new Error("Selecciona una cuenta válida.");
  if (value.type === "transfer" && (!value.destinationAccountId || value.destinationAccountId === value.accountId || !data.accounts.some(account => account.id === value.destinationAccountId && !account.archivedAt))) throw new Error("Elige dos cuentas diferentes.");
};

export const useAppStore = create<State>((set, get) => {
  const commit = async (data: AppData) => {
    set({busy:true,error:null});
    try { await repository.save(data); set({data,busy:false}); }
    catch (error) { set({busy:false,error:error instanceof Error?error.message:"No se pudo guardar el cambio."}); throw error; }
  };

  const loadContext = async (demoMode: boolean) => {
    repository = demoMode ? demoRepository() : realRepository();
    const saved = await repository.load();
    const fallback = demoMode || process.env.NEXT_PUBLIC_DEMO_DATA === "true" ? structuredClone(seedData) : emptyData();
    if (!saved && demoMode) await repository.save(fallback);
    set({data:saved??fallback,hydrated:true,demoMode,error:(repository as {lastLoadError?:string|null}).lastLoadError??null});
  };

  return {
    data: emptyData(), hydrated:false, demoMode:false, workspace:"personal", drawerOpen:false, editingTransactionId:null, draftTransactionType:"expense", busy:false, error:null,
    hydrate: async () => {
      const params = new URLSearchParams(window.location?.search??"");
      if (params.get("mode") === "real") sessionClear();
      if (params.get("demo") === "1") sessionSet();
      await loadContext(sessionGet() === "1");
    },
    exitDemo: async () => { sessionClear(); set({hydrated:false}); await loadContext(false); },
    resetDemo: async () => {
      if (!get().demoMode) return;
      set({busy:true,error:null});
      try { await repository.clear(); const data=structuredClone(seedData); await repository.save(data); set({data,busy:false}); }
      catch (error) { set({busy:false,error:error instanceof Error?error.message:"No se pudo restablecer la demo."}); throw error; }
    },
    saveProfile: async name => {
      const clean = name.trim();
      if (!clean) throw new Error("El nombre es obligatorio.");
      if (clean.length > 60) throw new Error("El nombre puede tener hasta 60 caracteres.");
      const now = new Date().toISOString();
      const current = get().data.profile;
      const profile: UserProfile = current ? {...current,name:clean,updatedAt:now} : {id:crypto.randomUUID(),name:clean,createdAt:now,updatedAt:now};
      await commit({...get().data,profile});
    },
    setGuideCompleted: async guideCompleted => commit({...get().data,settings:{...get().data.settings,guideCompleted}}),
    setWorkspace: workspace => set({workspace}),
    setPeriod: async period => { if (/^\d{4}-\d{2}$/.test(period)) await commit({...get().data,settings:{...get().data.settings,selectedPeriod:period}}); },
    openDrawer: id => { const value=String(id); const typed=(['expense','income','transfer'] as string[]).includes(value); set({drawerOpen:true,editingTransactionId:typeof id==='string'&&!typed?id:null,draftTransactionType:typed?value as TransactionType:'expense',error:null}); },
    closeDrawer: () => set({drawerOpen:false,editingTransactionId:null,error:null}),
    addTransaction: async value => { validateTransaction(value,get().data); const now=new Date().toISOString(); const transaction:Transaction={...value,amount:roundMoney(value.amount),description:value.description.trim(),category:value.category.trim(),id:crypto.randomUUID(),createdAt:now,updatedAt:now,workspace:get().workspace}; await commit({...get().data,transactions:[transaction,...get().data.transactions]}); set({drawerOpen:false,editingTransactionId:null}); },
    updateTransaction: async (id,value) => { validateTransaction(value,get().data); const now=new Date().toISOString(); await commit({...get().data,transactions:get().data.transactions.map(transaction=>transaction.id===id?{...transaction,...value,amount:roundMoney(value.amount),description:value.description.trim(),category:value.category.trim(),updatedAt:now}:transaction)}); set({drawerOpen:false,editingTransactionId:null}); },
    deleteTransaction: async id => commit({...get().data,transactions:get().data.transactions.filter(transaction=>transaction.id!==id)}),
    createAccount: async value => { if(!value.name.trim()||!Number.isFinite(value.initialBalance))throw new Error("Revisa los datos de la cuenta."); const now=new Date().toISOString(); const account:Account={...value,name:value.name.trim(),initialBalance:roundMoney(value.initialBalance),id:crypto.randomUUID(),createdAt:now,updatedAt:now}; await commit({...get().data,accounts:[...get().data.accounts,account]}); },
    updateAccount: async (id,value) => { if(value.name!==undefined&&!value.name.trim())throw new Error("El nombre es obligatorio."); await commit({...get().data,accounts:get().data.accounts.map(account=>account.id===id?{...account,...value,name:value.name?.trim()??account.name,initialBalance:value.initialBalance===undefined?account.initialBalance:roundMoney(value.initialBalance),updatedAt:new Date().toISOString()}:account)}); },
    archiveAccount: async id => { const referenced=get().data.transactions.some(transaction=>transaction.accountId===id||transaction.destinationAccountId===id); await commit({...get().data,accounts:referenced?get().data.accounts.map(account=>account.id===id?{...account,archivedAt:new Date().toISOString(),updatedAt:new Date().toISOString()}:account):get().data.accounts.filter(account=>account.id!==id)}); },
    updateData: async fn => commit(fn(get().data)),
    replaceData: async data => commit(data),
    reset: async () => { set({busy:true,error:null}); try { await repository.clear(); const data=get().demoMode?structuredClone(seedData):emptyData(); if(get().demoMode)await repository.save(data); set({data,busy:false}); } catch(error) { set({busy:false,error:error instanceof Error?error.message:"No se pudieron eliminar los datos."}); throw error; } },
    clearError: () => set({error:null}),
  };
});
