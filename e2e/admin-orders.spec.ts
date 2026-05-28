import { expect, test } from "@playwright/test";
import { chooseOption, expectPageReady, expectTableHasRows, loginAdmin } from "./helpers";

test.describe("admin orders CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await loginAdmin(page);
  });

  test("view orders list", async ({ page }) => {
    await page.goto("/admin/orders");
    await expectPageReady(page);
    await expectTableHasRows(page);
    await expect(page.getByRole("columnheader", { name: /order/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /customer/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /total/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /status/i })).toBeVisible();
  });

  test("view order detail", async ({ page }) => {
    await page.goto("/admin/orders/1");
    await expectPageReady(page);
    await expect(page.getByText(/order items/i)).toBeVisible();
    await expect(page.getByText(/customer/i).first()).toBeVisible();
  });

  test("update order status", async ({ page }) => {
    await page.goto("/admin/orders");
    await expectPageReady(page);
    const currentStatus = (await page.getByRole("combobox").nth(1).innerText()).toLowerCase();
    await chooseOption(page, 1, currentStatus.includes("shipped") ? /confirmed/i : /shipped/i);
    await expect(page.getByText(/updated/i).first()).toBeVisible({ timeout: 15_000 });
  });
});
