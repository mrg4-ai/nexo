import { expect, test } from "@playwright/test";
import { createAccount, createMovement, emptyApp } from "./helpers";

test("mobile movement sheet, edit/delete and navigation", async ({ page }) => {
  await emptyApp(page);
  await page.goto("/dashboard");
  await createAccount(page, "BCP", "100");
  await createMovement(page, "Gasto", "25", "Taxi móvil");
  await page.getByRole("link", { name: /Movimientos/ }).click();
  await expect(page.getByText("Taxi móvil")).toBeVisible();
  await page.getByText("Taxi móvil").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByLabel("Monto").fill("30");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await page.getByText("Taxi móvil").click();
  await page.getByRole("button", { name: /Eliminar movimiento/ }).click();
  await expect(page.getByText("Taxi móvil")).toHaveCount(0);
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Nuevo movimiento" }).first().click();
  await expect(page.getByLabel("Monto")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator(".sheet-backdrop")).not.toHaveClass(/open/);
  await page.goto("/budgets");
  await expect(page.getByText(/No tienes presupuestos/)).toBeVisible();
  await page.goto("/net-worth");
  await expect(page.getByRole("heading", { name: "Patrimonio" })).toBeVisible();
});
