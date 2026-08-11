import { expect, test } from "@playwright/test";
import { answerPrompts, createAccount, createMovement } from "./helpers";

const cachedRoutes=["/","/transactions","/accounts","/budgets","/goals","/net-worth","/settings","/business","/business/products","/business/inventory","/business/cash-flow","/business/ratios","/business/income-statement","/business/balance-sheet"];

test("installs its production shell and preserves local CRUD offline",async({page,context})=>{
  await page.goto("/");
  await page.evaluate(()=>localStorage.clear());
  await page.reload();
  await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));

  await page.evaluate(async()=>{localStorage.setItem("rc:update-marker","keep");await caches.open("nexo-shell-v2");for(const registration of await navigator.serviceWorker.getRegistrations())await registration.unregister()});
  await page.reload();
  await page.waitForFunction(async()=>Boolean(navigator.serviceWorker.controller)&&!(await caches.keys()).includes("nexo-shell-v2"));
  expect(await page.evaluate(()=>localStorage.getItem("rc:update-marker"))).toBe("keep");

  const manifest=await page.evaluate(async()=>await (await fetch("/manifest.webmanifest")).json());
  expect(manifest).toMatchObject({name:"Nexo",short_name:"Nexo",start_url:"/",scope:"/",display:"standalone"});
  expect(manifest.icons).toEqual(expect.arrayContaining([expect.objectContaining({sizes:"192x192"}),expect.objectContaining({sizes:"512x512",purpose:"maskable"})]));

  await createAccount(page,"Offline BCP","100");
  for(const route of cachedRoutes)await page.goto(route);

  await context.setOffline(true);
  await page.goto("/transactions");
  await createMovement(page,"Gasto","25","Compra sin conexión");
  await page.getByText("Compra sin conexión").click();
  await page.getByLabel("Monto").fill("30");
  await page.getByRole("button",{name:"Guardar cambios"}).click();
  await page.goto("/budgets");answerPrompts(page,["Presupuesto offline","100"]);await page.getByRole("button",{name:/Crear presupuesto/}).first().click();
  await page.goto("/goals");answerPrompts(page,["Meta offline","200","2027-01-01"]);await page.getByRole("button",{name:/Crear meta/}).first().click();answerPrompts(page,["25"]);await page.getByRole("button",{name:"Agregar aporte"}).click();
  await page.goto("/business/products");answerPrompts(page,["Producto offline","10"]);await page.getByRole("button",{name:/Nuevo producto/}).click();
  await page.goto("/business/inventory");answerPrompts(page,["Producto offline","3","2","1"]);await page.getByRole("button",{name:/Ajustar stock/}).first().click();
  await page.goto("/transactions");
  await page.reload();
  await expect(page.getByText("Compra sin conexión")).toBeVisible();
  await expect(page.getByText("-S/ 30.00")).toBeVisible();
  expect(await page.evaluate(()=>localStorage.length)).toBeGreaterThan(0);

  await page.goto("/settings");
  const downloadPromise=page.waitForEvent("download");
  await page.getByRole("button",{name:/Exportar backup JSON/}).click();
  const backupPath=await (await downloadPromise).path();expect(backupPath).toBeTruthy();
  await page.goto("/business/products");answerPrompts(page,["Temporal offline","5"]);await page.getByRole("button",{name:/Nuevo producto/}).click();
  await page.goto("/settings");await page.locator('input[type="file"]').setInputFiles(backupPath!);await page.goto("/business/products");await expect(page.getByText("Temporal offline")).toHaveCount(0);

  const response=await page.goto("/ruta-no-cacheada");
  expect(response?.status()).toBe(503);
  await expect(page.getByText(/no tiene esta ruta guardada/)).toBeVisible();
  await context.setOffline(false);
});
