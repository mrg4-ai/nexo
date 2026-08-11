import { expect, test } from "@playwright/test";
import { answerPrompts, createAccount, createMovement, emptyApp } from "./helpers";

test.beforeEach(async({page})=>{await emptyApp(page)});

test("first use, income, expense edit/delete and transfer",async({page})=>{
 await createAccount(page,"BCP","100");
 await createMovement(page,"Ingreso","1000","Sueldo E2E");await expect(page.getByText("S/ 1,100.00").first()).toBeVisible();
 await createMovement(page,"Gasto","50","Almuerzo E2E");await page.goto("/transactions");await expect(page.getByText("Almuerzo E2E")).toBeVisible();
 await page.getByText("Almuerzo E2E").click();await page.getByLabel("Monto").fill("75");await page.getByRole("button",{name:"Guardar cambios"}).click();await expect(page.getByText("-S/ 75.00")).toBeVisible();
 await page.getByText("Almuerzo E2E").click();await page.getByRole("button",{name:/Eliminar movimiento/}).click();await expect(page.getByText("Almuerzo E2E")).toHaveCount(0);
 await page.goto("/accounts");answerPrompts(page,["Efectivo","cash","0"]);await page.getByRole("button",{name:/Nueva cuenta/}).click();
 await page.getByRole("button",{name:/Nuevo movimiento/}).first().click();await page.getByRole("button",{name:"Transferencia",exact:true}).click();await page.getByLabel("Monto").fill("100");await page.getByLabel("Descripción").fill("Retiro E2E");await page.getByLabel("Cuenta origen").selectOption({label:"BCP"});await page.getByLabel("Cuenta destino").selectOption({label:"Efectivo"});await page.getByRole("button",{name:"Guardar transferencia"}).click();
 await page.goto("/accounts");await expect(page.getByText("BCP").first()).toBeVisible();await expect(page.getByText("Efectivo").first()).toBeVisible();
});

test("budget, goal and net worth CRUD",async({page})=>{
 await createAccount(page,"BCP","0");await page.goto("/budgets");answerPrompts(page,["Alimentación","500"]);await page.getByRole("button",{name:/Crear presupuesto/}).first().click();await expect(page.getByRole("strong").filter({hasText:"Alimentación"})).toBeVisible();
 await page.goto("/goals");answerPrompts(page,["Emergencia","1000","2027-12-31"]);await page.getByRole("button",{name:/Crear meta/}).first().click();answerPrompts(page,["200"]);await page.getByRole("button",{name:"Agregar aporte"}).click();await expect(page.getByText(/20% completado/)).toBeVisible();
 await page.goto("/net-worth");answerPrompts(page,["Vehículo","5000","Vehículo"]);await page.getByRole("button",{name:"Activo"}).click();answerPrompts(page,["Préstamo","1200","Préstamo"]);await page.getByRole("button",{name:"Pasivo"}).click();await expect(page.getByText("Vehículo")).toBeVisible();await expect(page.getByText("Préstamo")).toBeVisible();
});

test("product costing, inventory, backup replacement and scoped delete",async({page})=>{
 await page.goto("/business/products");answerPrompts(page,["Hamburguesa","20"]);await page.getByRole("button",{name:/Nuevo producto/}).click();await page.getByText("Hamburguesa").click();answerPrompts(page,["Carne","6"]);await page.getByRole("button",{name:/Agregar Materia prima/}).click();await expect(page.getByText("S/ 6.00").first()).toBeVisible();await expect(page.getByText("70.0%")).toBeVisible();
 await page.goto("/business/inventory");answerPrompts(page,["Hamburguesa","5","6","2"]);await page.getByRole("button",{name:/Ajustar stock/}).first().click();await expect(page.getByText("Disponible",{exact:true})).toBeVisible();
 await page.goto("/settings");const downloadPromise=page.waitForEvent("download");await page.getByRole("button",{name:/Exportar backup JSON/}).click();const download=await downloadPromise;const backupPath=await download.path();expect(backupPath).toBeTruthy();await page.goto("/business/products");answerPrompts(page,["Extra","10"]);await page.getByRole("button",{name:/Nuevo producto/}).click();await page.waitForTimeout(300);await page.goto("/settings");await page.locator('input[type="file"]').setInputFiles(backupPath!);await expect(page.getByText("Extra")).toHaveCount(0);await page.getByRole("button",{name:"Eliminar todos los datos"}).click();expect(await page.evaluate(()=>localStorage.getItem("unrelated:key"))).toBe("keep");
});
