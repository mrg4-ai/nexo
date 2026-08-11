import { expect, test } from "@playwright/test";
import { stressData } from "../services/rc-fixtures";

test("1.000 movimientos, filtros, charts, importes extremos y matriz responsive", async ({ page }) => {
  const data = stressData(1000);
  data.accounts[0].name = "Cuenta con un nombre deliberadamente muy largo para validar el comportamiento responsive sin perder su valor accesible";
  data.transactions[999].description = "Descripción extensa con coma, tildes y contenido que debe truncarse visualmente sin destruir la lista";
  await page.addInitScript(dataset => localStorage.setItem("nexo:v2:app", JSON.stringify(dataset)), data);
  const started = Date.now();
  await page.goto("/");
  await expect(page.getByText("Disponible para gastar")).toBeVisible();
  expect(Date.now() - started).toBeLessThan(10000);
  await expect(page.locator(".recharts-responsive-container").first()).toBeVisible();
  await page.goto("/transactions");
  await page.getByPlaceholder(/Buscar descripcion/).fill("Movimiento determinista 775");
  await expect(page.getByText("Movimiento determinista 775", { exact: true })).toBeVisible();
  await page.getByPlaceholder(/Buscar descripcion/).fill("");

  for (const size of [{ width: 320, height: 568 }, { width: 375, height: 812 }, { width: 390, height: 844 }, { width: 430, height: 932 }, { width: 768, height: 1024 }, { width: 1024, height: 768 }, { width: 1280, height: 800 }, { width: 1440, height: 900 }, { width: 1920, height: 1080 }]) {
    await page.setViewportSize(size);
    const overflow = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      elements: [...document.querySelectorAll<HTMLElement>("body *")]
        .filter(element => { const rect = element.getBoundingClientRect(); return rect.right > document.documentElement.clientWidth + 1 || rect.left < -1; })
        .slice(0, 8)
        .map(element => ({ tag: element.tagName, text: element.innerText?.slice(0, 35), className: element.className.toString(), left: Math.round(element.getBoundingClientRect().left), right: Math.round(element.getBoundingClientRect().right) })),
    }));
    expect(overflow.scrollWidth, `${size.width}x${size.height}: ${JSON.stringify(overflow.elements)}`).toBeLessThanOrEqual(overflow.clientWidth + 1);
    await expect(page.getByRole("button", { name: /Nuevo movimiento/ }).first()).toBeVisible();
  }
});
