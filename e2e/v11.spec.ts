import { expect, test } from "@playwright/test";
import { answerPrompts, createAccount, emptyApp } from "./helpers";

test("landing pública, entrada real y navegación atrás",async({page})=>{
  await page.goto("/");
  await expect(page.getByRole("heading",{name:/Controla tus finanzas/})).toBeVisible();
  await page.getByRole("link",{name:"Empezar",exact:true}).first().click();
  await expect(page).toHaveURL(/\/dashboard\?mode=real/);
  await expect(page.getByRole("heading",{name:"Bienvenido a Nexo"})).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
});

test("perfil inicial persiste y puede editarse desde Configuración",async({page})=>{
  await page.goto("/dashboard?mode=real");
  await page.evaluate(()=>{localStorage.clear();sessionStorage.clear()});
  await page.reload();
  await page.getByLabel("Nombre").fill("  Ana  ");
  await page.getByRole("button",{name:"Continuar"}).click();
  await page.getByRole("button",{name:"Omitir"}).click();
  await expect(page.getByRole("heading",{name:"Buenas noches, Ana"})).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading",{name:"Buenas noches, Ana"})).toBeVisible();
  await page.goto("/settings");
  await page.getByRole("button",{name:"Editar",exact:true}).first().click();
  await page.getByLabel("Nombre").fill("Ana María");
  await page.getByRole("button",{name:"Guardar",exact:true}).click();
  await page.goto("/dashboard");
  await expect(page.getByRole("heading",{name:"Buenas noches, Ana María"})).toBeVisible();
});

test("ayuda abre la guía y sus controles funcionan",async({page})=>{
  await emptyApp(page);
  await page.goto("/help");
  await expect(page.getByRole("heading",{name:"Ayuda y guía"})).toBeVisible();
  await page.locator(".help-center summary").filter({hasText:"Movimientos"}).click();
  await expect(page.getByText(/Una Transferencia mueve dinero/i)).toBeVisible();
  await page.getByRole("button",{name:"Ver guía inicial"}).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button",{name:"Siguiente"}).click();
  await page.getByRole("button",{name:"Atrás"}).click();
  await page.getByRole("button",{name:"Omitir"}).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("demo está aislada, se restablece y salir recupera datos reales",async({page})=>{
  await emptyApp(page);
  await createAccount(page,"Cuenta Real","250");
  await page.goto("/");
  await page.getByRole("link",{name:"Probar demo",exact:true}).first().click();
  await expect(page.getByText("Modo demo").first()).toBeVisible();
  await page.goto("/accounts");answerPrompts(page,["Cuenta Demo Extra","cash","10"]);await page.getByRole("button",{name:/Nueva cuenta/}).click();
  await expect(page.getByRole("heading",{name:"Cuenta Demo Extra"})).toBeVisible();
  await page.goto("/settings");await page.getByRole("button",{name:"Restablecer demo"}).click();
  await expect(page.getByRole("heading",{name:"Cuenta Demo Extra"})).toHaveCount(0);
  await page.getByRole("button",{name:"Salir de demo"}).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/dashboard?mode=real");
  await page.goto("/accounts");
  await expect(page.getByRole("heading",{name:"Cuenta Real"})).toBeVisible();
  expect(await page.evaluate(()=>localStorage.getItem("nexo-demo:v2:app")!==localStorage.getItem("nexo:v2:app"))).toBe(true);
});

test("landing móvil mantiene CTAs y no produce overflow",async({page})=>{
  for(const size of [{width:375,height:812},{width:390,height:844},{width:430,height:932}]){await page.setViewportSize(size);await page.goto("/");await expect(page.getByRole("heading",{name:/Controla tus finanzas/})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);await page.locator(".landing-menu summary").click();await expect(page.locator(".landing-menu").getByText("Empezar")).toBeVisible()}
});
