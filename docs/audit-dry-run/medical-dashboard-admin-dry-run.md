# Medical Dashboard + Admin Panel Dry Run Audit

Project: `D:\Projects\Medical`
Agent: Codex Read-Only Audit Runner
Mode: read-only source audit; report-only write under `docs\audit-dry-run`

## Executive Status

- Admin route inventory: PASS for actual filesystem state, 44 admin `page.tsx` files found. The gate text expected 45, so the count expectation does not match the repository.
- Storefront route inventory: PASS, 23 storefront `page.tsx` files found.
- Admin route renderability: PASS via `npm run test:smoke`, 67/67 smoke tests passed.
- Sidebar href verification: PASS, 39 sidebar/data nav hrefs all map to existing admin route files.
- Missing nav entries: PASS, none found.
- Orphaned route check: PARTIAL. Five admin routes have no direct sidebar nav entry: `/admin/login`, `/admin/purchase/new`, `/admin/purchase/[id]`, `/admin/clinic/appointments/new`, `/admin/clinic/team/new`. These are standalone/action/detail routes, not flat sidebar destinations.
- Explicit missing routes: CONFIRMED missing: `/admin/orders/[id]`, `/admin/customers/[id]`.
- Data/type dependencies: PASS by TypeScript check; data modules export typed mock flat arrays.
- Playwright test IDs/selectors: PASS/NOT APPLICABLE for test IDs. No `getByTestId` or `data-testid` usage was found; tests use role, label, text, and locator selectors.
- Auth/RBAC enforcement: GAP. No middleware file, route guard, session enforcement, or RBAC enforcement found.
- Toast feedback: GAP. No `toast`, `sonner`, or `useToast` usage found; feedback is mostly `alert(...)` and local UI state.
- DB/schema: GAP. Data is mock flat arrays in `src\data`; no schema, ORM, migrations, or persistence layer found.

## Read Scope Evidence

Read targets reviewed:

- `src\app\admin\**`: 44 admin page files found.
- `src\app\(store)\**`: 23 storefront page files found.
- `src\data\admin.ts`, `src\data\admin-nav.ts`, `src\data\clinic.ts`, `src\data\orders.ts`, `src\data\customers.ts`, `src\data\products.ts`.
- `src\types\index.ts`.
- `src\components\admin\`: 7 component files found: `charts.tsx`, `data-table.tsx`, `page-header.tsx`, `sidebar.tsx`, `stat-card.tsx`, `status-badge.tsx`, `topbar.tsx`.
- `src\lib\utils.ts`.
- `src\app\admin\layout.tsx`.
- `playwright.config.ts`.
- `e2e\smoke.spec.ts`.
- `e2e\flows.spec.ts`.
- `package.json`.
- `D:\Projects\Medical\Figma\` listed only: `All Pages Codex.pdf` and `HAYNAH_FIGMA_PAGE_2_BossSync_COMPONENTS_TREE.json`. The 400MB PDF was not parsed.

## Route Inventory

Admin routes found: 44.

Storefront routes found: 23.

Smoke test coverage: `e2e\smoke.spec.ts` runs all configured store/admin smoke routes. The host run reported `67 passed`, matching 23 storefront + 44 admin smoke cases.

Dynamic route coverage:

- `/admin/purchase/[id]` exists and was smoke-tested with `/admin/purchase/1`.
- `/product/[slug]` exists in storefront and is covered by store smoke/flows.
- `/admin/orders/[id]` does not exist.
- `/admin/customers/[id]` does not exist.

## Sidebar Verification

Nav hrefs discovered from `src\data\admin.ts` and `src\data\clinic.ts`: 39.

All 39 nav hrefs map to existing admin route files:

- `/admin`
- `/admin/affiliate`
- `/admin/attributes`
- `/admin/brands`
- `/admin/categories`
- `/admin/clinic`
- `/admin/clinic/accounting`
- `/admin/clinic/appointments`
- `/admin/clinic/blog`
- `/admin/clinic/blog-categories`
- `/admin/clinic/contact`
- `/admin/clinic/departments`
- `/admin/clinic/evaluations`
- `/admin/clinic/holidays`
- `/admin/clinic/mail`
- `/admin/clinic/patients`
- `/admin/clinic/roles`
- `/admin/clinic/schedule`
- `/admin/clinic/services`
- `/admin/clinic/team`
- `/admin/club-points`
- `/admin/colors`
- `/admin/customers`
- `/admin/delivery`
- `/admin/marketing`
- `/admin/orders`
- `/admin/pos`
- `/admin/products`
- `/admin/products/import`
- `/admin/products/in-house`
- `/admin/products/new`
- `/admin/purchase`
- `/admin/refunds`
- `/admin/reports`
- `/admin/sales`
- `/admin/sellers`
- `/admin/settings`
- `/admin/support`
- `/admin/website-setup`

Nav entries pointing to missing routes: none.

Admin routes with no direct sidebar nav entry:

- `/admin/login`
- `/admin/purchase/new`
- `/admin/purchase/[id]`
- `/admin/clinic/appointments/new`
- `/admin/clinic/team/new`

## Data Dependency Review

Typed data evidence:

- `src\data\products.ts` imports `Product` and exports `products: Product[]`, `allCategories`, `allBrands`.
- `src\data\orders.ts` imports `Order` and exports `orders: Order[]`.
- `src\data\customers.ts` imports `Customer` and exports `customers: Customer[]`.
- `src\data\clinic.ts` exports typed arrays for clinic stats, departments, services, roles, employees, patients, appointments, schedules, holidays, evaluations, blogs, mail, contact requests, income, expenses, and nav.
- `src\types\index.ts` defines `Product`, `Order`, `Customer`, and `CartItem`.
- `npm run typecheck` passed, confirming source-level type compatibility.

DB/schema gap:

- No ORM/schema/migration evidence found in reviewed scope.
- No `fetch(...)` data-loading layer was found for admin/store data in the reviewed route/data scope.
- Admin and storefront data are currently mock flat arrays and generated arrays.

## Playwright Selector Review

`e2e\flows.spec.ts` contains 18 mapped flow tests:

- F1 storefront login.
- F2 storefront register.
- F3 storefront cart to checkout happy path.
- F4 storefront cart empty state.
- F5 admin dashboard.
- F6 admin products list.
- F7 admin new product form.
- F8 admin orders list.
- F9 admin purchase/new submit.
- F10 admin refunds.
- F11 admin clinic.
- F12 admin clinic/team.
- F13 admin clinic/team/new.
- F14 admin website setup tab switching.
- F15 admin website setup submit alert.
- F16 admin marketing.
- F17 admin sidebar ecommerce group toggles.
- F18 admin brands add/delete.

Selector evidence:

- No `getByTestId` usage found.
- No `data-testid` usage found.
- Existing tests use `getByRole`, `getByLabel`, `getByText`, and `locator(...)`.
- `npm run test:smoke` passed 67/67. Flow tests were mapped/reviewed but were not part of the requested one-next-action host command.

## Auth, RBAC, Logout, Toast

Auth/RBAC findings:

- No `middleware.*` file found.
- No route-level auth guard found in reviewed scope.
- No enforced RBAC/permission checks found.
- Clinic roles are mock data and UI only; they do not enforce access.

Logout finding:

- Store account layout has a `Sign out` link pointing to `/login`.
- No `signOut` handler or session invalidation was found.

Toast feedback finding:

- No `toast`, `sonner`, or `useToast` usage found.
- Mock feedback appears through `alert(...)` and local state banners.

## Requested Host Command Result

Command sequence run on host with PowerShell-compatible chaining:

```powershell
Set-Location "D:\Projects\Medical"
npm run typecheck
if ($LASTEXITCODE -eq 0) { npm run test:smoke } else { exit $LASTEXITCODE }
```

Results:

- `npm run typecheck`: PASS.
- `npm run test:smoke`: PASS.
- Smoke result: `67 passed`.
- Exact error lines: none.

## KPI Status

- 100% admin routes inventoried: PASS for actual 44 files; repository does not match the prompt's expected 45 count.
- 100% sidebar links verified: PASS, 39/39 hrefs valid.
- 100% flows mapped: PASS, 18/18 flow specs reviewed.
- 100% permission areas reviewed: PASS, with auth/RBAC enforcement gap reported.
- 0 code edits: PASS, no source edits performed during this audit.
- 0 destructive actions: PASS.
- Evidence report produced: PASS.

## One Next Action

Owner should decide whether `/admin/orders/[id]` and `/admin/customers/[id]` are approved sprint scope, because both missing detail routes are confirmed and should not be implemented without scope approval.
