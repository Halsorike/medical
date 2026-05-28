import { expect, test } from "@playwright/test";
import { chooseFirstOption, expectPageReady, expectTableHasRows, loginAdmin } from "./helpers";

test.describe("admin products CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await loginAdmin(page);
  });

  test("view products list", async ({ page }) => {
    await page.goto("/admin/products");
    await expectPageReady(page);
    await expectTableHasRows(page);
    await expect(page.getByRole("columnheader", { name: /product|name/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /price/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /stock/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /category/i })).toBeVisible();
  });

  test("create product", async ({ page }) => {
    const name = `Test Product ${Date.now()}`;
    await page.goto("/admin/products/new");
    await expectPageReady(page);
    await page.locator('input[name="name"]').fill(name);
    await page.locator('textarea[name="description"]').fill("Test desc");
    await chooseFirstOption(page, 0);
    await page.getByRole("tab", { name: /price/i }).click();
    await page.locator('input[name="price"]').fill("99.99");
    await page.locator('input[name="stock"]').fill("10");
    await page.getByRole("button", { name: /^publish product$/i }).click();
    await expect(page.getByText(/product created/i)).toBeVisible({ timeout: 15_000 });
    await page.goto("/admin/products");
    await expect(page.getByText(name)).toBeVisible();
  });

  test("view product detail", async ({ page }) => {
    await page.goto("/admin/products/1");
    await expectPageReady(page);
    await expect(page.getByText(/editing:/i)).toBeVisible();
    for (const tab of [/general/i, /files.*media/i, /price.*stock/i, /^seo$/i, /shipping/i]) {
      await expect(page.getByRole("tab", { name: tab })).toBeVisible();
    }
  });

  test("edit product", async ({ page }) => {
    await page.goto("/admin/products/1");
    await expectPageReady(page);
    const input = page.locator("#product-name");
    const updated = `Digital Thermometer ${Date.now()}`;
    await input.fill(updated);
    await page.getByRole("button", { name: /save and publish/i }).click();
    await expect(page.getByText(/product updated/i)).toBeVisible({ timeout: 15_000 });
    await expect(input).toHaveValue(updated);
  });
});
