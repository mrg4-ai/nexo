import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import manifest from "../app/manifest";

const root=process.cwd();
const pngSize=(path:string)=>{const bytes=readFileSync(path);return {width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)}};

describe("PWA contract",()=>{
  it("declares an installable, root-scoped manifest",()=>{
    expect(manifest()).toMatchObject({name:"Nexo",short_name:"Nexo",start_url:"/",scope:"/",display:"standalone",background_color:"#090d0c",theme_color:"#090d0c"});
    expect(manifest().icons).toEqual(expect.arrayContaining([expect.objectContaining({sizes:"192x192",purpose:"any"}),expect.objectContaining({sizes:"512x512",purpose:"any"}),expect.objectContaining({sizes:"512x512",purpose:"maskable"})]));
  });

  it.each([["icon-192.png",192],["icon-512.png",512],["maskable-512.png",512],["apple-touch-icon.png",180]])("ships %s with physical dimensions",(file,size)=>{
    const path=join(root,"public","icons",file);expect(existsSync(path)).toBe(true);expect(pngSize(path)).toEqual({width:size,height:size});
  });

  it("isolates versioned shell caches and never touches LocalStorage",()=>{
    const worker=readFileSync(join(root,"public","sw.js"),"utf8");
    expect(worker).toContain('CACHE_VERSION = "v3"');
    expect(worker).toContain("self.skipWaiting()");
    expect(worker).toContain("self.clients.claim()");
    expect(worker).toContain('request.method !== "GET"');
    expect(worker).toContain("key.startsWith(CACHE_PREFIX)");
    expect(worker).not.toMatch(/localStorage|indexedDB|caches\.keys\(\)[\s\S]*key !==/);
  });
});
