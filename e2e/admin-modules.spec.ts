import { expect, test } from "@playwright/test";
import { expectPageReady, loginAdmin } from "./helpers";

const MODULES: Array<{ route: string; text: RegExp }> = [
  { route: "/admin/reports", text: /reports|sales/i },
  { route: "/admin/marketing", text: /marketing/i },
  { route: "/admin/settings", text: /settings/i },
  { route: "/admin/clinic/blog", text: /blog/i },
  { route: "/admin/clinic/team", text: /team|employee/i },
  { route: "/admin/clinic/services", text: /services/i },
  { route: "/admin/clinic/schedule", text: /schedule/i },
  { route: "/admin/clinic/patients", text: /patients/i },
  { route: "/admin/pos", text: /pos|cart|charge/i },
  { route: "/admin/delivery", text: /delivery/i },
];

test.describe("admin other modules", () => {
  test.describe.configure({ timeout: 60_000 });

  test.beforeEach(async ({ page }) => {
    await loginAdmin(page);
  });

  for (const module of MODULES) {
    test(`${module.route} loads key content`, async ({ page }) => {
      await page.goto(module.route, { waitUntil: "domcontentloaded" });
      await expectPageReady(page);
      await expect(page.getByText(module.text).first()).toBeVisible();
    });
  }
});
