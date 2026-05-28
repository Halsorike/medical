# Medical — Ecommerce + Admin (Next.js 14)

Generated from Figma design "All Pages Codex".
Stack: Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui primitives.

## Install

```bash
npm install
npm run dev          # http://localhost:3000
```

Or for production:

```bash
npm run build
npm start
```

## Storefront routes (`/`)
- `/` Home
- `/shop` Product listing with search, filters (category / brand / price), sort
- `/product/[slug]` Product detail with image gallery, tabs, related products
- `/cart` Cart with quantity, remove, totals
- `/checkout` Multi-section checkout form
- `/checkout/success` Order confirmation
- `/categories`, `/brands`, `/deals`, `/wishlist`, `/blog`
- `/help`, `/track`, `/contact`, `/returns`
- `/login`, `/register`
- `/account`, `/account/orders`, `/account/addresses`, `/account/profile`

## Admin routes (`/admin/*`)
- `/admin` Dashboard (KPIs, revenue line/bar charts, top categories pie, activity, recent orders)
- `/admin/pos` POS system (scan/search → cart → charge)
- `/admin/products` All products (search, edit/delete actions)
- `/admin/products/new` New product (5-tab form: General, Media, Pricing/Stock, SEO, Shipping)
- `/admin/products/in-house` In-house products
- `/admin/products/import` Bulk CSV/XLSX import with template download
- `/admin/categories`, `/admin/brands`, `/admin/attributes`, `/admin/colors` (CRUD)
- `/admin/orders` Orders list with status / payment filters
- `/admin/refunds` Refund requests with approve/reject
- `/admin/customers`, `/admin/sellers`, `/admin/delivery`
- `/admin/affiliate`, `/admin/club-points`
- `/admin/marketing` (campaigns, coupons, banners, flash sales, notifications)
- `/admin/support` (tickets)
- `/admin/sales`, `/admin/reports`
- `/admin/settings` (store / payments / shipping / email)
- `/admin/login`

## Mock data
All data is currently mock, isolated under `src/data/`:
- `products.ts` — product catalog
- `orders.ts` — order list
- `customers.ts` — customer list
- `admin.ts` — sales-by-month, top categories, recent activity, admin nav

Replace each `data/*.ts` with real API calls when the backend is ready.

## Notes
- The Figma file `I1yxSeUAawgY1YKYefLj47` contains a single page "Ecommerce" with both storefront and admin frames laid out side-by-side. The implementation covers every section label visible in the design.
- Validation (`npm run build / lint / typecheck`) was not runnable in the build sandbox due to environment limits — please run on host.
