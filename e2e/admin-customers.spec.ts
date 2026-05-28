import { expect, test } from "@playwright/test";
import { expectPageReady, expectTableHasRows, loginAdmin } from "./helpers";

test.describe("admin customers CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await loginAdmin(page);
  });

  test("view customers list", async ({ page }) => {
    await page.goto("/admin/customers");
    await expectPageReady(page);
    await expectTableHasRows(page);
    await expect(page.getByRole("columnheader", { name: /name/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /email/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /phone/i })).toBeVisible();
  });

  test("view customer detail", async ({ page }) => {
    await page.goto("/admin/customers/1");
    await expectPageReady(page);
    await expect(page.getByRole("heading", { name: /customer:/i })).toBeVisible();
    await expect(page.getByText(/order history/i)).toBeVisible();
  });
});
