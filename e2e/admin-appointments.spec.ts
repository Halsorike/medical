import { expect, test } from "@playwright/test";
import { expectPageReady, expectTableHasRows, loginAdmin } from "./helpers";

test.describe("admin appointments CRUD", () => {
  test.describe.configure({ timeout: 60_000 });

  test.beforeEach(async ({ page }) => {
    await loginAdmin(page);
  });

  test("view appointments list", async ({ page }) => {
    await page.goto("/admin/clinic/appointments", { waitUntil: "domcontentloaded" });
    await expectPageReady(page);
    await expectTableHasRows(page);
    await expect(page.getByRole("columnheader", { name: /patient/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /date/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /employee|department/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /status/i })).toBeVisible();
  });

  test("create appointment", async ({ page }) => {
    await page.goto("/admin/clinic/appointments/new", { waitUntil: "domcontentloaded" });
    await expectPageReady(page);
    await page.waitForLoadState("networkidle");
    await page.locator('input[type="email"]').fill("clinic@test.com");
    await page.locator('input[name="phone"]').fill("0791234567");
    await page.locator('input[name="date"]').fill("2026-06-01");
    await page.locator('input[name="time"]').fill("11:30");
    await page.getByRole("button", { name: /send invitation/i }).click();
    await page.waitForURL(/\/admin\/clinic\/appointments$/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: /appointments/i })).toBeVisible();
    await expectTableHasRows(page);
  });

  test("update appointment status from quick actions", async ({ page }) => {
    await page.goto("/admin/clinic/appointments", { waitUntil: "domcontentloaded" });
    await expectPageReady(page);
    await page.getByLabel(/approve/i).first().click();
    await expect(page.getByText(/appointment updated/i)).toBeVisible({ timeout: 15_000 });
  });
});
