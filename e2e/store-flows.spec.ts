import { expect, test } from "@playwright/test";
import { addDigitalThermometerToCart, chooseFirstOption, clearBrowserState, expectPageReady } from "./helpers";

test.describe("store user flows", () => {
  test.describe.configure({ timeout: 60_000 });

  test.beforeEach(async ({ page }) => {
    await clearBrowserState(page);
  });

  test("search flow finds thermometer products", async ({ page }) => {
    await page.goto("/shop");
    await page.getByPlaceholder(/search/i).fill("thermometer");
    await page.getByRole("button", { name: /search/i }).click();
    await expect(page.locator("a[href^='/product/']").first()).toBeVisible({ timeout: 15_000 });
  });

  test("add to cart flow updates header badge", async ({ page }) => {
    await addDigitalThermometerToCart(page);
  });

  test("cart management flow updates quantity and removes item", async ({ page }) => {
    await addDigitalThermometerToCart(page);
    await page.goto("/cart");
    await expectPageReady(page);
    await expect(page.getByText(/digital|thermometer|medicine cabinet/i).first()).toBeVisible();

    await page.getByLabel(/increase quantity/i).first().click();
    await page.getByLabel(/decrease quantity/i).first().click();

    await page.getByRole("button", { name: /remove/i }).first().click();
    await expect(page.getByText(/your cart is empty/i)).toBeVisible();
  });

  test("checkout flow creates an order", async ({ page }) => {
    await addDigitalThermometerToCart(page);
    await page.goto("/cart");
    await expectPageReady(page);

    await page.getByPlaceholder(/first name/i).fill("Ahmad");
    await page.getByPlaceholder(/last name/i).fill("Test");
    await page.getByPlaceholder(/^address$/i).fill("123 Main St");
    await page.getByPlaceholder(/^city$/i).first().fill("Amman");
    await page.getByPlaceholder(/^country$/i).fill("Jordan");
    await page.getByPlaceholder(/zipcode/i).fill("11118");
    await page.getByRole("button", { name: /credit card/i }).click();
    await page.getByPlaceholder(/cardholder/i).fill("Ahmad Test");
    await page.getByPlaceholder(/card number/i).fill("4111111111111111");
    await page.getByPlaceholder(/month/i).fill("12");
    await page.getByPlaceholder(/year/i).fill("2026");
    await page.getByPlaceholder(/cvc/i).fill("123");
    await page.getByRole("button", { name: /^pay \$/i }).click();
    await expect(page.getByText(/order placed successfully/i)).toBeVisible({ timeout: 15_000 });
  });

  test("book appointment flow submits successfully", async ({ page }) => {
    await page.goto("/book-appointment");
    await expectPageReady(page);
    const main = page.getByRole("main");

    await main.locator("input").nth(0).fill("Sara");
    await main.locator("input").nth(1).fill("Ali");
    await main.locator('input[type="email"]').fill("sara@test.com");
    await main.locator('input[type="tel"]').nth(0).fill("0791234567");
    await main.locator('input[type="tel"]').nth(1).fill("0797654321");
    await page.locator("button:not([disabled])").filter({ hasText: /^\d+$/ }).first().click();
    await page.getByRole("button", { name: /11:00 AM/i }).click();
    await chooseFirstOption(page, 0);
    await chooseFirstOption(page, 1);
    await page.getByRole("button", { name: /confirm booking/i }).click();
    await expect(page.getByText(/appointment confirmed|appointment booked successfully/i).first()).toBeVisible({ timeout: 30_000 });
  });

  test("evaluation flow reaches success state", async ({ page }) => {
    await page.goto("/evaluation");
    await expectPageReady(page);
    const main = page.getByRole("main");
    await main.locator("input").nth(0).fill("Test User");
    await main.locator("input").nth(1).fill("34");
    await main.locator('input[type="email"]').fill("test@test.com");
    await main.locator('input[type="tel"]').fill("0791234567");

    const combos = await main.getByRole("combobox").count();
    for (let i = 0; i < combos; i += 1) {
      await main.getByRole("combobox").nth(i).click();
      await page.getByRole("option", { name: /sometimes/i }).click();
    }

    await page.getByRole("button", { name: /submit/i }).click();
    await expect(page.getByText(/evaluation results|submitted|success/i).first()).toBeVisible({ timeout: 30_000 });
  });

  test("contact form flow shows success state", async ({ page }) => {
    await page.goto("/contact");
    await expectPageReady(page);
    const form = page.locator("form").first();
    await form.locator("input").nth(0).fill("Test");
    await form.locator("input").nth(1).fill("User");
    await form.locator('input[type="email"]').fill("test@test.com");
    await form.locator('input[type="tel"]').fill("0791234567");
    await form.locator("textarea").fill("Hello clinic");
    await form.locator('input[type="checkbox"]').check();
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByText(/message sent|thank you/i).first()).toBeVisible({ timeout: 30_000 });
  });
});
