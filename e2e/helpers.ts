import { expect, type Page } from "@playwright/test";

export const adminEmail = process.env.ADMIN_EMAIL ?? "admin@clinic.com";
export const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";

export async function expectNoFrameworkError(page: Page) {
  const overlay = page.locator("nextjs-portal, #__next-error, [data-nextjs-dialog]");

  if (await overlay.first().isVisible().catch(() => false)) {
    await page.reload({ waitUntil: "domcontentloaded" });
  }

  await expect(overlay).toHaveCount(0, { timeout: 10_000 });
}

export async function expectPageReady(page: Page) {
  await expect(page.locator("body")).not.toHaveText("");
  await expectNoFrameworkError(page);
}

export async function expectOneVisible(page: Page, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const candidate = page.getByText(pattern).first();
    if (await candidate.isVisible().catch(() => false)) return;
  }

  throw new Error(`Expected one of these texts to be visible: ${patterns.map(String).join(", ")}`);
}

export async function chooseFirstOption(page: Page, comboIndex = 0) {
  await page.getByRole("combobox").nth(comboIndex).click();
  await page.getByRole("option").first().click();
}

export async function chooseOption(page: Page, comboIndex: number, option: RegExp | string) {
  await page.getByRole("combobox").nth(comboIndex).click();
  await page.getByRole("option", { name: option }).click();
}

export async function clearBrowserState(page: Page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
}

export async function addDigitalThermometerToCart(page: Page) {
  await page.goto("/product/digital-thermometer", { waitUntil: "networkidle" });
  await expectPageReady(page);
  const addButton = page.getByRole("button", { name: /add to cart/i }).first();
  await expect(addButton).toBeVisible();

  const increase = page.getByLabel(/increase/i);
  if (await increase.isVisible().catch(() => false)) {
    await increase.click();
  }

  await addButton.scrollIntoViewIfNeeded();
  await addButton.click();
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const stored = window.localStorage.getItem("medical-cart");
          if (!stored) return 0;
          try {
            const items = JSON.parse(stored) as Array<{ qty?: number }>;
            return items.reduce((total, item) => total + (item.qty ?? 0), 0);
          } catch {
            return 0;
          }
        }),
      { timeout: 10_000 }
    )
    .toBeGreaterThan(0);
  await expect(page.locator('a[aria-label="Cart"]').getByText(/[1-9]/)).toBeVisible({ timeout: 10_000 });
}

export async function loginAdmin(page: Page) {
  await page.goto("/admin/login", { waitUntil: "networkidle" });
  await expectPageReady(page);
  await page.locator('input[name="email"], input[type="email"]').first().fill(adminEmail);
  await page.locator('input[name="password"], input[type="password"]').first().fill(adminPassword);
  await Promise.all([
    page.waitForResponse((response) => response.url().includes("/api/auth/login") && response.status() === 200),
    page.getByRole("button", { name: /sign in|login/i }).click(),
  ]);
  await page.goto("/admin", { waitUntil: "networkidle" });
  await expectOneVisible(page, [/dashboard/i, /total revenue/i, /recent orders/i]);
}

export async function expectTableHasRows(page: Page) {
  await expect(page.locator("tbody tr").first()).toBeVisible({ timeout: 30_000 });
}
