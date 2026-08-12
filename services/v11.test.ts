import { beforeEach, describe, expect, it, vi } from "vitest";
import { demoRepository, DEMO_STORAGE_KEY, realRepository, STORAGE_KEY } from "@/repositories/local/app.repository";
import { migrateAppData } from "./app-data";
import { seedData } from "./seed";

describe("contratos V1.1",()=>{
  const values=new Map<string,string>();
  beforeEach(()=>{values.clear();vi.stubGlobal("window",{});vi.stubGlobal("localStorage",{getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>values.set(key,value),removeItem:(key:string)=>values.delete(key),key:(index:number)=>[...values.keys()][index]??null,get length(){return values.size}})});

  it("completa perfiles y guía ausentes en un V2 anterior",()=>{
    const legacy=structuredClone(seedData) as unknown as Record<string,unknown>;
    delete legacy.profile;
    delete (legacy.settings as Record<string,unknown>).guideCompleted;
    expect(migrateAppData(legacy)).toMatchObject({profile:null,settings:{guideCompleted:false,schemaVersion:2}});
  });

  it("guarda datos reales y demo en claves independientes",async()=>{
    const real=structuredClone(seedData);real.profile={...real.profile!,name:"Real"};
    const demo=structuredClone(seedData);demo.profile={...demo.profile!,name:"Demo"};
    await realRepository().save(real);await demoRepository().save(demo);
    expect(JSON.parse(values.get(STORAGE_KEY)!).profile.name).toBe("Real");
    expect(JSON.parse(values.get(DEMO_STORAGE_KEY)!).profile.name).toBe("Demo");
  });

  it("limpia la demo sin tocar el dataset real",async()=>{
    await realRepository().save(seedData);await demoRepository().save(seedData);
    await demoRepository().clear();
    expect(values.has(DEMO_STORAGE_KEY)).toBe(false);
    expect(values.has(STORAGE_KEY)).toBe(true);
  });
});
