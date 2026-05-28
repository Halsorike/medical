import { expect, test } from "@playwright/test";
import { adminEmail, adminPassword, expectOneVisible, expectPageReady, loginAdmin } from "./helpers";

test.describe("admin authentication", () => {
  test("valid credentials redirect to dashboard", async ({ page }) => {
    await loginAdmin(page);
    await expect(page).toHaveURL(/\/admin\/?$/);
    await expectOneVisible(page, [/total revenue/i, /orders/i, /customers/i]);
  });

  test("invalid credentials show an error and stay on login", async ({ page }) => {
    await page.goto("/admin/login");
    await expectPageReady(page);
    await page.locator('input[name="email"], input[type="email"]').first().fill("wrong@email.com");
    await page.locator('input[name="password"], input[type="password"]').first().fill("wrongpass");
    await page.getByRole("button", { name: /sign in|login/i }).click();
    await expect(page.getByText(/invalid|failed|try again/i)).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("protected route redirects to admin login", async ({ context, page }) => {
    await context.clearCookies();
    await page.goto("/admin");
    await page.waitForURL(/\/admin\/login/, { timeout: 10_000 });
    await expect(page.locator('input[name="email"], input[type="email"]').first()).toBeVisible();
  });

  test("logout clears the admin session", async ({ page }) => {
    await loginAdmin(page);
    await page.getByLabel(/logout/i).click();
    await page.waitForURL(/\/admin\/login/, { timeout: 10_000 });
    await page.locator('input[name="email"], input[type="email"]').first().fill(adminEmail);
    await page.locator('input[name="password"], input[type="password"]').first().fill(adminPassword);
    await expect(page.getByRole("button", { name: /sign in|login/i })).toBeVisible();
  });
});

