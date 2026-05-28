import { expect, test } from "@playwright/test";
import { expectPageReady, loginAdmin } from "./helpers";

test.describe("responsive and visual checks", () => {
  test("mobile homepage opens hamburger navigation", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expectPageReady(page);
    await expect(page.getByLabel(/toggle menu/i)).toBeVisible();
    await page.getByLabel(/toggle menu/i).click();
    await expect(page.getByRole("link", { name: /services/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /book appointment/i }).first()).toBeVisible();
  });

  test("tablet shop page adapts product grid", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/shop");
    await expectPageReady(page);
    await expect(page.locator("a[href^='/product/']").first()).toBeVisible({ timeout: 15_000 });
    const visibleProducts = await page.locator("a[href^='/product/']").count();
    expect(visibleProducts).toBeGreaterThan(1);
  });

  test("desktop admin dashboard keeps sidebar and KPI grid visible", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await loginAdmin(page);
    await expect(page.getByRole("navigation").first()).toBeVisible();
    await expect(page.getByText(/total revenue/i)).toBeVisible();
    await expect(page.getByText(/orders/i).first()).toBeVisible();
  });
});
