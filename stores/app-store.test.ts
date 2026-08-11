import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { emptyData } from "@/services/empty-data";
import { seedData } from "@/services/seed";
import { useAppStore } from "./app-store";

describe("configuración de datos iniciales",()=>{
 const original=process.env.NEXT_PUBLIC_DEMO_DATA;
 beforeEach(()=>{vi.stubGlobal("window",{});vi.stubGlobal("localStorage",{getItem:()=>null,setItem:vi.fn(),removeItem:vi.fn(),key:()=>null,length:0});useAppStore.setState({data:emptyData(),hydrated:false,error:null})});
 afterEach(()=>{if(original===undefined)delete process.env.NEXT_PUBLIC_DEMO_DATA;else process.env.NEXT_PUBLIC_DEMO_DATA=original;vi.unstubAllGlobals()});
 it("DEMO inicia con datos deterministas cuando el storage está vacío",async()=>{process.env.NEXT_PUBLIC_DEMO_DATA="true";await useAppStore.getState().hydrate();expect(useAppStore.getState().data).toEqual(seedData);expect(useAppStore.getState().data.products.length).toBeGreaterThan(0)});
 it("CLEAN inicia completamente vacío y no filtra el seed",async()=>{process.env.NEXT_PUBLIC_DEMO_DATA="false";await useAppStore.getState().hydrate();expect(useAppStore.getState().data).toEqual(emptyData());expect(useAppStore.getState().data.transactions).toHaveLength(0)});
});
