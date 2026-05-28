import { test, expect, type Page } from "@playwright/test";
import path from "path";
import fs from "fs";

const OUT = path.resolve("screenshots/ui-automation");

test.setTimeout(60_000);

async function shot(page: Page, name: string) {
  fs.mkdirSync(OUT, { recursive: true });
  await page.screenshot({
    path: path.join(OUT, `${name}.png`),
    fullPage: true,
  });
}

async function adminLogin(page: Page) {
  await page.goto("/admin/login");
  if (!page.url().includes("/admin/login")) {
    return;
  }

  await page.fill('input[name="email"], input[type="email"]', "admin@clinic.com");
  await page.fill('input[name="password"], input[type="password"]', "admin123");
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL(/\/admin(?:\?|$)/, { timeout: 15_000 });
}

test.describe("Storefront Pages", () => {
  test("01 - Homepage", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveTitle(/Jordan Hearing/i);
    await shot(page, "01-homepage");
  });

  test("02 - About", async ({ page }) => {
    await page.goto("/about");
    await page.waitForLoadState("networkidle");
    await shot(page, "02-about");
  });

  test("03 - Services", async ({ page }) => {
    await page.goto("/services");
    await page.waitForLoadState("networkidle");
    await shot(page, "03-services");
    const learnMore = page.getByRole("button", { name: /learn more/i }).first();
    if (await learnMore.isVisible()) {
      await learnMore.click();
      await shot(page, "03-services-expanded");
    }
  });

  test("04 - Team", async ({ page }) => {
    await page.goto("/team");
    await page.waitForLoadState("networkidle");
    await shot(page, "04-team");
  });

  test("05 - Blog listing", async ({ page }) => {
    await page.goto("/blog");
    await page.waitForLoadState("networkidle");
    await shot(page, "05-blog-listing");
  });

  test("06 - Blog post detail", async ({ page }) => {
    await page.goto("/blog");
    await page.waitForLoadState("networkidle");
    const firstPost = page.locator("article a").first();
    const href = await firstPost.getAttribute("href");
    if (href) {
      await page.goto(href);
      await page.waitForLoadState("networkidle");
      await shot(page, "06-blog-detail");
    }
  });

  test("07 - Shop", async ({ page }) => {
    await page.goto("/shop");
    await page.waitForLoadState("networkidle");
    await shot(page, "07-shop");
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill("hearing");
      await page.waitForTimeout(600);
      await shot(page, "07-shop-search");
      await searchInput.clear();
    }
  });

  test("08 - Product detail", async ({ page }) => {
    await page.goto("/shop");
    await page.waitForLoadState("networkidle");
    const firstProduct = page.locator("a[href*='/product/']").first();
    const href = await firstProduct.getAttribute("href");
    if (href) {
      await page.goto(href);
      await page.waitForLoadState("networkidle");
      await shot(page, "08-product-detail");
    }
  });

  test("09 - Cart", async ({ page }) => {
    await page.goto("/cart");
    await page.waitForLoadState("networkidle");
    await shot(page, "09-cart-empty");
    await page.goto("/shop");
    await page.waitForLoadState("networkidle");
    const firstProduct = page.locator("a[href*='/product/']").first();
    const href = await firstProduct.getAttribute("href");
    if (href) {
      await page.goto(href);
      await page.waitForLoadState("networkidle");
      const addBtn = page.getByRole("button", { name: /add to cart/i }).first();
      if (await addBtn.isVisible()) {
        await addBtn.click();
        await page.waitForTimeout(500);
        await page.goto("/cart");
        await page.waitForLoadState("networkidle");
        await shot(page, "09-cart-with-item");
      }
    }
  });

  test("10 - Book Appointment", async ({ page }) => {
    await page.goto("/book-appointment");
    await page.waitForLoadState("networkidle");
    await shot(page, "10-book-appointment");
    const nextBtn = page.getByRole("button", { name: /next|chevron.*right/i }).first();
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await shot(page, "10-book-appointment-next-month");
    }
    const slot = page.locator("button").filter({ hasText: /AM|PM/ }).first();
    if (await slot.isVisible()) {
      await slot.click();
      await shot(page, "10-book-appointment-slot-selected");
    }
  });

  test("11 - Evaluation", async ({ page }) => {
    await page.goto("/evaluation");
    await page.waitForLoadState("networkidle");
    await shot(page, "11-evaluation");
    const neverBtn = page.getByRole("button", { name: /never/i }).first();
    if (await neverBtn.isVisible()) {
      await neverBtn.click();
      await shot(page, "11-evaluation-answering");
    }
  });

  test("12 - Contact", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");
    await shot(page, "12-contact");
  });

  test("13 - Privacy", async ({ page }) => {
    await page.goto("/privacy");
    await page.waitForLoadState("networkidle");
    await shot(page, "13-privacy");
  });

  test("14 - Terms", async ({ page }) => {
    await page.goto("/terms");
    await page.waitForLoadState("networkidle");
    await shot(page, "14-terms");
  });
});

test.describe("Storefront Flows", () => {
  test("F01 - Nav: Home -> About -> Services -> Team -> Contact", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    for (const [route, label] of [
      ["/about", "about"],
      ["/services", "services"],
      ["/team", "team"],
      ["/contact", "contact"],
    ] as const) {
      const navLink = page.getByRole("link", { name: new RegExp(label, "i") }).first();
      if (await navLink.isVisible()) {
        await navLink.click();
        await page.waitForLoadState("networkidle");
        await shot(page, `F01-nav-${label}`);
      } else {
        await page.goto(route);
        await page.waitForLoadState("networkidle");
        await shot(page, `F01-nav-${label}`);
      }
    }
  });

  test("F02 - Subscribe form", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill("test@example.com");
      await shot(page, "F02-subscribe-filled");
    }
  });

  test("F03 - Mobile menu (375px)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await shot(page, "F03-mobile-homepage");
    const hamburger = page.getByRole("button", { name: /toggle menu/i });
    if (await hamburger.isVisible()) {
      await hamburger.click();
      await page.waitForTimeout(300);
      await shot(page, "F03-mobile-menu-open");
      await hamburger.click();
    }
  });

  test("F04 - Tablet layout (768px)", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await shot(page, "F04-tablet-homepage");
    await page.goto("/shop");
    await page.waitForLoadState("networkidle");
    await shot(page, "F04-tablet-shop");
  });
});

test.describe("Admin Pages", () => {
  test("A01 - Admin login page", async ({ page }) => {
    await page.goto("/admin/login");
    await page.waitForLoadState("networkidle");
    await shot(page, "A01-admin-login");
  });

  test("A02 - Admin dashboard", async ({ page }) => {
    await adminLogin(page);
    await page.waitForLoadState("networkidle");
    await shot(page, "A02-admin-dashboard");
  });

  test("A03 - Admin products", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin/products");
    await page.waitForLoadState("networkidle");
    await shot(page, "A03-admin-products");
  });

  test("A04 - Admin product detail (first product)", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin/products");
    await page.waitForLoadState("networkidle");
    const firstRow = page.locator("table tbody tr, [data-testid='product-row']").first();
    const editLink = firstRow.locator("a[href*='/admin/products/']");
    const href = await editLink.getAttribute("href").catch(() => null);
    if (href) {
      await page.goto(href);
      await page.waitForLoadState("networkidle");
      await shot(page, "A04-admin-product-detail");
    } else {
      await page.goto("/admin/products/1");
      await page.waitForLoadState("networkidle");
      await shot(page, "A04-admin-product-detail");
    }
  });

  test("A05 - Admin orders", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin/orders");
    await page.waitForLoadState("networkidle");
    await shot(page, "A05-admin-orders");
  });

  test("A06 - Admin customers", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin/customers");
    await page.waitForLoadState("networkidle");
    await shot(page, "A06-admin-customers");
  });

  test("A07 - Admin clinic appointments", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin/clinic/appointments");
    await page.waitForLoadState("networkidle");
    await shot(page, "A07-admin-appointments");
  });

  test("A08 - Admin clinic patients", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin/clinic/patients");
    await page.waitForLoadState("networkidle");
    await shot(page, "A08-admin-patients");
  });

  test("A09 - Admin clinic evaluations", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin/clinic/evaluations");
    await page.waitForLoadState("networkidle");
    await shot(page, "A09-admin-evaluations");
  });

  test("A10 - Admin clinic schedule", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin/clinic/schedule");
    await page.waitForLoadState("networkidle");
    await shot(page, "A10-admin-schedule");
  });

  test("A11 - Admin blog", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin/clinic/blog");
    await page.waitForLoadState("networkidle");
    await shot(page, "A11-admin-blog");
  });

  test("A12 - Admin categories", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin/categories");
    await page.waitForLoadState("networkidle");
    await shot(page, "A12-admin-categories");
  });
});

test("ZZ - Generate visual HTML report", async ({ page: _ }) => {
  fs.mkdirSync(OUT, { recursive: true });
  const files = fs.readdirSync(OUT)
    .filter((f) => f.endsWith(".png"))
    .sort();

  const rows = files.map((f) => {
    const label = f.replace(".png", "").replace(/-/g, " ").replace(/^\d+ /, "");
    return `
      <div class="card">
        <p class="label">${f.replace(".png", "")}</p>
        <img src="${f}" alt="${label}" loading="lazy" />
      </div>`;
  }).join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>UI Automation Screenshots - Jordan Hearing</title>
<style>
  body { font-family: system-ui, sans-serif; background: #f5f5f5; margin: 0; padding: 24px; }
  h1 { font-size: 24px; color: #9b1fe1; margin-bottom: 8px; }
  p.meta { color: #666; font-size: 13px; margin-bottom: 32px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(420px, 1fr)); gap: 24px; }
  .card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
  .label { font-size: 13px; font-weight: 600; color: #9b1fe1; padding: 10px 14px 0; margin: 0; }
  img { width: 100%; display: block; border-top: 1px solid #f0f0f0; margin-top: 8px; }
</style>
</head>
<body>
<h1>UI Automation Screenshots</h1>
<p class="meta">Jordan Hearing & Speech Therapy - ${files.length} screenshots captured - ${new Date().toLocaleString()}</p>
<div class="grid">
${rows}
</div>
</body>
</html>`;

  fs.writeFileSync(path.join(OUT, "index.html"), html);
  console.log(`\nVisual report saved -> screenshots/ui-automation/index.html (${files.length} screenshots)\n`);
});
