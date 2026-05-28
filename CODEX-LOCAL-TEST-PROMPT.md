# Codex Prompt — Local Test Run
**Project:** D:\Projects\Medical
**Stack:** Next.js 14 · TypeScript · Tailwind CSS · shadcn/ui · Prisma + SQLite · Playwright

---

## OBJECTIVE

Run the full local test suite for the Medical project and report results. Fix any failures found. Do NOT push, deploy, or edit .env files.

---

## STEP 1 — Typecheck

```bash
cd D:\Projects\Medical
npm run typecheck
```

**Expected:** 0 errors.

If errors exist:
- Fix type errors in the reported files only
- Do NOT change any logic or UI — types only
- Re-run until clean

---

## STEP 2 — Lint

```bash
cd D:\Projects\Medical
npm run lint
```

**Expected:** No errors (warnings acceptable).

If errors exist:
- Fix ESLint errors in the reported files
- Common fixes: add `// eslint-disable-next-line @next/next/no-img-element` above `<img>` tags, fix unused imports
- Do NOT change component logic

---

## STEP 3 — Build

```bash
cd D:\Projects\Medical
npm run build
```

**Expected:** Build completes, 79/79 pages generated.

Known non-fatal warning to ignore:
```
⚠ DATABASE_URL is missing — using dummy URL for build
```
This is expected in local build. Do NOT try to fix it.

If build fails:
- Read the exact error message
- Fix only the failing file
- Re-run build

---

## STEP 4 — Start Dev Server (background)

```bash
cd D:\Projects\Medical
npx next dev &
```

Wait 5 seconds for server to start on http://localhost:3000

Verify server is running:
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```
Expected: `200`

---

## STEP 5 — Run Playwright Smoke Tests

```bash
cd D:\Projects\Medical
npx playwright test e2e/smoke.spec.ts --reporter=line
```

**Expected:** All routes return 200. Tests pass.

If a route returns 404/500:
- Check the route file exists in `src/app/(store)/` or `src/app/admin/`
- Fix the page component if broken
- Do NOT create new routes unless explicitly missing

---

## STEP 6 — Run Storefront Flow Tests

```bash
cd D:\Projects\Medical
npx playwright test e2e/store-pages.spec.ts e2e/store-flows.spec.ts --reporter=line
```

**Expected:** All tests pass.

Common failures and fixes:
| Failure | Fix |
|---------|-----|
| `select` component crash on shop page | Ensure `<SelectValue placeholder="...">` has no empty string value passed |
| Cart page empty state missing | Check `src/app/(store)/cart/page.tsx` renders empty state |
| Blog slug 404 | Check `src/app/(store)/blog/[slug]/page.tsx` handles unknown slugs with notFound() |

---

## STEP 7 — Run Admin Auth Tests

```bash
cd D:\Projects\Medical
npx playwright test e2e/admin-auth.spec.ts --reporter=line
```

**Expected:** Login with `admin@clinic.com` / `admin123` works. Protected routes redirect unauthenticated users.

If auth fails:
- Check `src/app/api/auth/login/route.ts` returns correct session cookie
- Check `middleware.ts` protects `/admin` routes
- Check `src/app/admin/login/page.tsx` exists

---

## STEP 8 — Run Responsive Tests

```bash
cd D:\Projects\Medical
npx playwright test e2e/responsive.spec.ts --reporter=line
```

**Expected:** Homepage, shop, contact render correctly at 375px, 768px, 1280px.

---

## STEP 9 — Run Full Suite (final verification)

```bash
cd D:\Projects\Medical
npx playwright test --reporter=line 2>&1 | tail -20
```

**Expected:** 151 passed, 0 failed.

---

## STEP 10 — Stop Dev Server

```bash
kill $(lsof -t -i:3000) 2>/dev/null || true
```

---

## FINAL REPORT FORMAT

After all steps complete, output this exact table:

```
╔══════════════════════════════════════╦══════════╦═══════════════════════════╗
║ Check                                ║ Status   ║ Notes                     ║
╠══════════════════════════════════════╬══════════╬═══════════════════════════╣
║ npm run typecheck                    ║ ✅ PASS  ║ 0 errors                  ║
║ npm run lint                         ║ ✅ PASS  ║ 0 errors                  ║
║ npm run build                        ║ ✅ PASS  ║ 79/79 pages               ║
║ Smoke tests (all routes 200)         ║ ✅ PASS  ║ 67 routes checked         ║
║ Store flow tests                     ║ ✅ PASS  ║ cart, blog, product flows ║
║ Admin auth tests                     ║ ✅ PASS  ║ login + protected routes  ║
║ Responsive tests                     ║ ✅ PASS  ║ 375/768/1280px            ║
║ Full Playwright suite                ║ ✅ PASS  ║ 151/151 passed            ║
╚══════════════════════════════════════╩══════════╩═══════════════════════════╝
```

Replace ✅ PASS with ❌ FAIL and add error detail in Notes column for any failures.

---

## RULES

- Do NOT delete files or folders
- Do NOT run git reset / git clean / git push
- Do NOT edit .env or .env.local
- Do NOT run npm audit fix --force
- Do NOT upgrade major dependencies
- Fix ONLY what is failing — minimal changes
- All fixes must pass typecheck + lint before moving on
