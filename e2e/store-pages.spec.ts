import { expect, test } from "@playwright/test";
import { expectOneVisible, expectPageReady } from "./helpers";

test.describe("store navigation and pages", () => {
  test("homepage renders core sections", async ({ page }) => {
    await page.goto("/");
    await expectPageReady(page);
    await expectOneVisible(page, [/Jordan Hearing/i, /Speech Therapy/i]);
    await expect(page.getByText(/Services/i).first()).toBeVisible();
    await expect(page.getByText(/Team/i).first()).toBeVisible();
    await expect(page.getByText(/Blog/i).first()).toBeVisible();
  });

  test("/about renders team and testimonials content", async ({ page }) => {
    await page.goto("/about");
    await expectPageReady(page);
    await expectOneVisible(page, [/about/i, /our story/i, /who we are/i]);
    await expectOneVisible(page, [/team/i, /specialists/i, /testimonials/i, /patients/i]);
  });

  test("/services renders six service cards", async ({ page }) => {
    await page.goto("/services");
    await expectPageReady(page);
    await expect(page.getByRole("heading", { name: /our services/i })).toBeVisible();
    await expect(page.locator("section").filter({ hasText: "Hearing Evaluation" }).locator("h3")).toHaveCount(6);
  });

  test("/team renders doctors with booking buttons", async ({ page }) => {
    await page.goto("/team");
    await expectPageReady(page);
    await expectOneVisible(page, [/Our Team/i, /specialists/i, /doctors/i]);
    await expect(page.getByRole("link", { name: /book appointment/i }).first()).toBeVisible();
  });

  test("/blog renders article grid", async ({ page }) => {
    await page.goto("/blog");
    await expectPageReady(page);
    await expect(page.getByRole("heading", { name: /our blogs|from the blog/i })).toBeVisible();
    await expect(page.getByText(/comments/i).first()).toBeVisible();
    await expect(page.getByText(/read more/i).first()).toBeVisible();
  });

  test("/blog/digital-thermometer renders post detail", async ({ page }) => {
    await page.goto("/blog/digital-thermometer");
    await expectPageReady(page);
    await expect(page.getByRole("heading", { name: /medicine cabinet/i })).toBeVisible();
    await expect(page.getByText(/well-stocked medicine cabinet/i)).toBeVisible();
  });

  test("/contact renders contact form fields", async ({ page }) => {
    await page.goto("/contact");
    await expectPageReady(page);
    await expect(page.getByText("First Name")).toBeVisible();
    await expect(page.getByText("Last Name")).toBeVisible();
    await expect(page.getByText(/^Email\*?$/).first()).toBeVisible();
    await expect(page.getByText(/^Message\*?$/).first()).toBeVisible();
  });

  test("/shop renders product grid controls", async ({ page }) => {
    await page.goto("/shop");
    await expectPageReady(page);
    await expect(page.getByRole("heading", { name: /shop/i })).toBeVisible();
    await expect(page.getByPlaceholder(/search/i)).toBeVisible();
    await expect(page.getByRole("combobox").first()).toBeVisible();
    await expect(page.locator('a[href^="/product/"]').first()).toBeVisible({ timeout: 15_000 });
  });

  test("/product/digital-thermometer renders product detail", async ({ page }) => {
    await page.goto("/product/digital-thermometer");
    await expectPageReady(page);
    await expect(page.getByRole("heading", { name: /thermometer|medicine cabinet|digital/i }).first()).toBeVisible();
    await expect(page.getByText(/\$/).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /add to cart/i }).first()).toBeVisible();
  });

  test("/book-appointment renders calendar, slots and form fields", async ({ page }) => {
    await page.goto("/book-appointment");
    await expectPageReady(page);
    const currentMonth = new Intl.DateTimeFormat("en", { month: "long" }).format(new Date());
    await expect(page.getByRole("heading", { name: /book appointment/i })).toBeVisible();
    await expect(page.getByText(new RegExp(currentMonth, "i"))).toBeVisible();
    await expect(page.getByText(/Morning Slots/i)).toBeVisible();
    await expect(page.getByText("First Name")).toBeVisible();
    await expect(page.getByText(/^Department\*?$/).first()).toBeVisible();
  });

  test("/evaluation renders hearing questions form", async ({ page }) => {
    await page.goto("/evaluation");
    await expectPageReady(page);
    await expectOneVisible(page, [/evaluation/i, /hearing/i]);
    await expect(page.getByRole("combobox").first()).toBeVisible();
    await expect(page.getByRole("button", { name: /submit/i })).toBeVisible();
  });

  test("/cart renders empty state", async ({ page }) => {
    await page.goto("/cart");
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
    await expectPageReady(page);
    await expect(page.getByText(/your cart is empty/i)).toBeVisible();
  });

  test("/checkout renders shipping form or guarded empty cart state", async ({ page }) => {
    await page.goto("/checkout");
    await expectPageReady(page);
    await expectOneVisible(page, [/shipping address/i, /your cart is empty/i]);
  });
});
