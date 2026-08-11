import { describe, expect, it } from "vitest";
import { createBackup, parseBackup, transactionsCsv } from "./backup";
import { seedData } from "./seed";
describe("backup and export",()=>{
 it("round-trips a versioned replacement backup",()=>{const raw=JSON.stringify(createBackup(seedData,new Date("2026-08-10T00:00:00Z")));expect(parseBackup(raw)).toEqual(seedData)});
 it("rejects partial and foreign payloads",()=>{expect(parseBackup("{}" )).toBeNull();expect(parseBackup(JSON.stringify({app:"other",schemaVersion:2,data:seedData}))).toBeNull()});
 it("escapes CSV quotes and emits fixed-decimal amounts",()=>{const data={...seedData,transactions:[{...seedData.transactions[0],description:'Café "Central"'}]};const csv=transactionsCsv(data);expect(csv).toContain('"Café ""Central"""');expect(csv).toContain('"8500.00"')});
});
