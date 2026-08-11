import { beforeEach, describe, expect, it, vi } from "vitest";
import { LocalAppRepository, STORAGE_KEY } from "./app.repository";
import { seedData } from "../../services/seed";

describe("repositorio local",()=>{
 const map=new Map<string,string>();
 beforeEach(()=>{map.clear();vi.stubGlobal("window",{});vi.stubGlobal("localStorage",{getItem:(key:string)=>map.get(key)??null,setItem:(key:string,value:string)=>map.set(key,value),removeItem:(key:string)=>map.delete(key),key:(index:number)=>[...map.keys()][index]??null,get length(){return map.size}})});

 it("guarda y recupera datos V2 válidos",async()=>{const repo=new LocalAppRepository();await repo.save(seedData);expect(await repo.load()).toEqual(seedData);expect(repo.lastLoadError).toBeNull()});
 it("conserva almacenamiento corrupto y comunica el fallo",async()=>{const repo=new LocalAppRepository();map.set(STORAGE_KEY,"bad json");expect(await repo.load()).toBeNull();expect(map.get(STORAGE_KEY)).toBe("bad json");expect(repo.lastLoadError).toMatch(/dañados/)});
 it("recupera un V1 válido aunque el V2 esté corrupto",async()=>{const repo=new LocalAppRepository();const legacy={...seedData,settings:{...seedData.settings,schemaVersion:1,selectedPeriod:undefined}};map.set(STORAGE_KEY,"bad json");map.set("nexo:v1:app",JSON.stringify(legacy));expect((await repo.load())?.settings.schemaVersion).toBe(2);expect(JSON.parse(map.get(STORAGE_KEY)!).settings.schemaVersion).toBe(2);expect(repo.lastLoadError).toBeNull()});
 it("rechaza versiones futuras y V1 parcialmente malformado sin sobrescribir",async()=>{const repo=new LocalAppRepository();const future=JSON.stringify({...seedData,settings:{...seedData.settings,schemaVersion:99}});map.set(STORAGE_KEY,future);expect(await repo.load()).toBeNull();expect(map.get(STORAGE_KEY)).toBe(future);map.clear();const partial={...seedData,accounts:[{id:"sin-campos"}],settings:{...seedData.settings,schemaVersion:1}};map.set("nexo:v1:app",JSON.stringify(partial));expect(await repo.load()).toBeNull();expect(map.has(STORAGE_KEY)).toBe(false)});
 it("mantiene el estado anterior si LocalStorage rechaza una escritura",async()=>{const previous=JSON.stringify(seedData);map.set(STORAGE_KEY,previous);vi.stubGlobal("localStorage",{getItem:(key:string)=>map.get(key)??null,setItem:()=>{throw new DOMException("Quota exceeded","QuotaExceededError")},removeItem:(key:string)=>map.delete(key),key:(index:number)=>[...map.keys()][index]??null,get length(){return map.size}});await expect(new LocalAppRepository().save({...seedData,transactions:[]})).rejects.toThrow(/No se pudo guardar/);expect(map.get(STORAGE_KEY)).toBe(previous)});
 it("elimina sólo claves propiedad de Nexo",async()=>{map.set(STORAGE_KEY,"x");map.set("nexo:cache","x");map.set("third-party-key","keep-me");await new LocalAppRepository().clear();expect([...map.keys()]).toEqual(["third-party-key"]);expect(map.get("third-party-key")).toBe("keep-me")});
});
