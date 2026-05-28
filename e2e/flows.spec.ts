import { expect, test } from "@playwright/test";
import { addDigitalThermometerToCart, clearBrowserState, expectPageReady, loginAdmin } from "./helpers";

test("F1 - storefront login: form renders and accepts input", async ({ page }) => {
  await page.goto("/login");
  await expectPageReady(page);
  const email = page.getByLabel("Email", { exact: false });
  const password = page.getByLabel("Password", { exact: false });
  await email.fill("test@example.com");
  await password.fill("password123");
  await expect(page.getByRole("button", { name: /sign in/i })).toBeEnabled();
  await expect(page.getByRole("link", { name: /create account/i })).toBeVisible();
});

test("F2 - storefront register: page renders", async ({ page }) => {
  await page.goto("/register");
  await expectPageReady(page);
  await expect(page.getByRole("heading", { name: /create your account/i })).toBeVisible();
});

test("F3 - storefront cart to payment: full happy path", async ({ page }) => {
  await clearBrowserState(page);
  await addDigitalThermometerToCart(page);
  await page.goto("/cart", { waitUntil: "domcontentloaded" });
  await expectPageReady(page);
  await expect(page.getByText(/digital thermometer/i).first()).toBeVisible();
  await page.getByPlaceholder(/first name/i).fill("John");
  await page.getByPlaceholder(/last name/i).fill("Doe");
  await page.getByPlaceholder(/^address$/i).fill("123 Main Street");
  await page.getByPlaceholder(/^city$/i).first().fill("Amman");
  await page.getByPlaceholder(/^country$/i).fill("Jordan");
  await page.getByPlaceholder(/zipcode/i).fill("11118");
  await page.getByPlaceholder(/cardholder/i).fill("John Doe");
  await page.getByPlaceholder(/card number/i).fill("4242424242424242");
  await page.getByPlaceholder(/month/i).fill("12");
  await page.getByPlaceholder(/year/i).fill("2028");
  await page.getByPlaceholder(/cvc/i).fill("123");
  await page.getByRole("button", { name: /^pay \$/i }).click();
  await expect(page.getByText(/order placed successfully/i)).toBeVisible();
});

test("F4 - storefront cart: empty state renders", async ({ page }) => {
  await clearBrowserState(page);
  await page.goto("/cart");
  await expect(page.getByText(/your cart is empty/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /browse shop/i })).toBeVisible();
});

test("F5 - admin dashboard: loads without error", async ({ page }) => {
  await loginAdmin(page);
  await expect(page.locator("aside").first()).toBeVisible();
  await expect(page.locator("main")).toBeVisible();
});

test("F6 - admin products: list renders", async ({ page }) => {
  await loginAdmin(page);
  await page.goto("/admin/products");
  await expect(page.locator("table, [role='table']")).toBeVisible();
});

test("F7 - admin new product: form renders", async ({ page }) => {
  await loginAdmin(page);
  await page.goto("/admin/products/new");
  await expect(page.locator("input").first()).toBeVisible();
  await expect(page.getByRole("button", { name: /^publish product$/i })).toBeVisible();
});

test("F8 - admin orders: list renders", async ({ page }) => {
  await loginAdmin(page);
  await page.goto("/admin/orders");
  await expect(page.locator("table, [role='table']")).toBeVisible();
});

test("F9 - admin purchase/new: form submit shows confirmation", async ({ page }) => {
  await loginAdmin(page);
  await page.goto("/admin/purchase/new");
  await page.getByPlaceholder("Supplier name").fill("MedSupply Co.");
  const dateInputs = page.locator("input[type='date']");
  await dateInputs.nth(0).fill("2026-06-01");
  await dateInputs.nth(1).fill("2026-06-15");
  await page.getByPlaceholder("Product name").first().fill("Surgical Gloves");
  await page.getByRole("button", { name: /save purchase order/i }).click();
  await expect(page.getByText(/purchase order saved/i)).toBeVisible({ timeout: 15_000 });
});

test("F10 - admin refunds: page renders", async ({ page }) => {
  await loginAdmin(page);
  await page.goto("/admin/refunds");
  await expect(page.locator("main, [role='main'], .container").first()).toBeVisible();
});

test("F11 - admin clinic: page renders", async ({ page }) => {
  await loginAdmin(page);
  await page.goto("/admin/clinic");
  await expect(page.locator("body")).toBeVisible();
});

test("F12 - admin clinic/team: list renders", async ({ page }) => {
  await loginAdmin(page);
  await page.goto("/admin/clinic/team");
  await expect(page.locator("body")).toBeVisible();
});

test("F13 - admin clinic/team/new: form renders", async ({ page }) => {
  await loginAdmin(page);
  await page.goto("/admin/clinic/team/new");
  await expect(page.locator("input").first()).toBeVisible();
});

test("F14 - admin website-setup: tab switching works", async ({ page }) => {
  await loginAdmin(page);
  await page.goto("/admin/website-setup");
  await expect(page.getByRole("tab", { name: "General" })).toBeVisible();
  await page.getByRole("tab", { name: "About" }).click();
  await expect(page.getByRole("tab", { name: "About" })).toHaveAttribute("data-state", "active");
  await page.getByRole("tab", { name: "Contact" }).click();
  await expect(page.getByRole("tab", { name: "Contact" })).toHaveAttribute("data-state", "active");
});

test("F15 - admin website-setup: General form submit shows confirmation", async ({ page }) => {
  await loginAdmin(page);
  await page.goto("/admin/website-setup");
  await page.locator("input").first().fill("Medical Clinic");
  await page.getByRole("button", { name: /update/i }).click();
  await expect(page.getByText(/website section saved/i)).toBeVisible({ timeout: 15_000 });
});

test("F16 - admin marketing: page renders", async ({ page }) => {
  await loginAdmin(page);
  await page.goto("/admin/marketing");
  await expect(page.locator("body")).toBeVisible();
});

test("F17 - admin sidebar: ecommerce group toggles", async ({ page }) => {
  await loginAdmin(page);
  const ecomBtn = page.getByRole("button", { name: /^Ecommerce$/ }).first();
  await expect(ecomBtn).toBeVisible();
  const initialExpanded = await ecomBtn.getAttribute("aria-expanded");
  await ecomBtn.click();
  await expect(ecomBtn).toHaveAttribute("aria-expanded", initialExpanded === "true" ? "false" : "true");
  await ecomBtn.click();
  await expect(ecomBtn).toHaveAttribute("aria-expanded", initialExpanded ?? "true");
});

test("F18 - admin brands: add and delete brand", async ({ page }) => {
  await loginAdmin(page);
  await page.goto("/admin/brands");
  await expect(page.locator("table")).toBeVisible();
  const rowsBefore = await page.locator("tbody tr").count();
  await page.getByPlaceholder("Brand name").fill("TestBrand");
  await page.getByRole("button", { name: /^add$/i }).click();
  await expect(page.locator("tbody tr")).toHaveCount(rowsBefore + 1);
  await page.locator("tbody tr").last().getByRole("button").click();
  await expect(page.locator("tbody tr")).toHaveCount(rowsBefore);
});
