import { chromium } from "@playwright/test";
import path from "path";
import fs from "fs";

const BASE_URL = "http://localhost:3000";
const OUT_DIR = path.join(process.cwd(), "screenshots", "current");
fs.mkdirSync(OUT_DIR, { recursive: true });

const PAGES = [
  { name: "01-homepage", url: "/" },
  { name: "02-shop", url: "/shop" },
  { name: "03-product-detail", url: "/product/digital-thermometer" },
  { name: "04-cart", url: "/cart" },
  { name: "05-checkout", url: "/checkout" },
  { name: "06-blog", url: "/blog" },
  { name: "07-blog-detail", url: "/blog/digital-thermometer" },
  { name: "08-about", url: "/about" },
  { name: "09-services", url: "/services" },
  { name: "10-team", url: "/team" },
  { name: "11-contact", url: "/contact" },
  { name: "12-book-appointment", url: "/book-appointment" },
  { name: "13-evaluation", url: "/evaluation" },
  { name: "14-login", url: "/login" },
  { name: "15-register", url: "/register" },
  { name: "16-account", url: "/account" },
  { name: "17-wishlist", url: "/wishlist" },
  { name: "18-deals", url: "/deals" },
  { name: "19-brands", url: "/brands" },
  { name: "20-categories", url: "/categories" },
  { name: "21-admin-login", url: "/admin/login" },
  { name: "22-admin-dashboard", url: "/admin" },
  { name: "23-admin-products", url: "/admin/products" },
  { name: "24-admin-orders", url: "/admin/orders" },
  { name: "25-admin-customers", url: "/admin/customers" },
  { name: "26-admin-appointments", url: "/admin/clinic/appointments" },
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  for (const p of PAGES) {
    try {
      await page.goto(`${BASE_URL}${p.url}`, {
        waitUntil: "networkidle",
        timeout: 15000,
      });
      await page.waitForTimeout(1500);
      const file = path.join(OUT_DIR, `${p.name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(`✅ ${p.name} → ${file}`);
    } catch (e) {
      console.log(`❌ ${p.name} → ${(e as Error).message}`);
    }
  }

  await browser.close();
  console.log("\n✅ All screenshots saved to:", OUT_DIR);
})();
