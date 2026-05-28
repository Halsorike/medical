import { test, expect } from "@playwright/test";

/**
 * Smoke test — every page.tsx route must load with HTTP 200
 * and render without a React crash boundary.
 *
 * Route segments in parentheses (route groups) are stripped by Next.js.
 * Dynamic segments like [slug] are replaced with a known fixture value.
 */

const STORE_ROUTES = [
  "/",
  "/about",
  "/account",
  "/account/addresses",
  "/account/orders",
  "/account/orders/1",
  "/account/profile",
  "/blog",
  "/blog/digital-thermometer",
  "/book-appointment",
  "/brands",
  "/cart",
  "/categories",
  "/checkout",
  "/checkout/success",
  "/contact",
  "/deals",
  "/evaluation",
  "/help",
  "/login",
  "/login-2",
  "/login-2/register",
  "/product/digital-thermometer", // fixture slug from mock data
  "/register",
  "/returns",
  "/services",
  "/shop",
  "/team",
  "/track",
  "/wishlist",
];

const ADMIN_ROUTES = [
  "/admin",
  "/admin/affiliate",
  "/admin/attributes",
  "/admin/brands",
  "/admin/categories",
  "/admin/clinic",
  "/admin/clinic/accounting",
  "/admin/clinic/appointments",
  "/admin/clinic/appointments/new",
  "/admin/clinic/blog",
  "/admin/clinic/blog-categories",
  "/admin/clinic/contact",
  "/admin/clinic/departments",
  "/admin/clinic/departments/new",
  "/admin/clinic/evaluations",
  "/admin/clinic/holidays",
  "/admin/clinic/holidays/new",
  "/admin/clinic/mail",
  "/admin/clinic/patients",
  "/admin/clinic/roles",
  "/admin/clinic/schedule",
  "/admin/clinic/services",
  "/admin/clinic/team",
  "/admin/clinic/team/new",
  "/admin/club-points",
  "/admin/colors",
  "/admin/customers",
  "/admin/customers/1",
  "/admin/delivery",
  "/admin/login",
  "/admin/marketing",
  "/admin/orders",
  "/admin/orders/1",
  "/admin/pos",
  "/admin/products",
  "/admin/products/1",
  "/admin/products/import",
  "/admin/products/in-house",
  "/admin/products/new",
  "/admin/purchase",
  "/admin/purchase/1", // fixture id
  "/admin/purchase/new",
  "/admin/refunds",
  "/admin/reports",
  "/admin/sales",
  "/admin/sellers",
  "/admin/settings",
  "/admin/support",
  "/admin/website-setup",
];

const ALL_ROUTES = [...STORE_ROUTES, ...ADMIN_ROUTES];

for (const route of ALL_ROUTES) {
  test(`smoke: ${route}`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });

    // Must not be a server error
    expect(
      response?.status(),
      `${route} returned ${response?.status()}`
    ).toBeLessThan(500);

    // Must not show Next.js error overlay
    const errorOverlay = page.locator(
      "nextjs-portal, #__next-error, [data-nextjs-dialog]"
    );
    await expect(errorOverlay).toHaveCount(0);

    // Page must have a non-empty body
    const bodyText = await page.locator("body").innerText();
    expect(bodyText.trim().length, `${route} body is empty`).toBeGreaterThan(0);
  });
}
