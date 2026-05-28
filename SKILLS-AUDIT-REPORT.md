# Combined Skills Audit Report
**Project:** Jordan Hearing & Speech Therapy — D:\Projects\Medical
**Skills applied:** seo-audit · ui-ux-pro-max · site-architecture · stop-slop
**Date:** 2026-05-22

---

## 1. SEO AUDIT

### 🔴 Critical

**C1 — Sitemap uses placeholder domain**
`src/app/sitemap.ts` line 4: `const baseUrl = "https://yourdomain.com"`
All sitemap URLs point to the wrong domain. Google will index the wrong URLs.
**Fix:** Change to `"https://jordanhearing.com"` (already used in `layout.tsx`).

**C2 — Contact, Shop, Services, Book Appointment, Evaluation pages missing metadata export**
These pages are `"use client"` with no `generateMetadata`. Client components cannot export `metadata`. Pages have no title/description in SERP.
**Fix:** Create a `layout.tsx` or separate `metadata.ts` file for each affected route, or move static metadata to the parent layout.

**C3 — `/privacy` and `/terms` pages are missing**
Footer links to `/privacy` and `/terms` — both return 404. Google penalises broken internal links. E-E-A-T signal damaged (no trust pages).
**Fix:** Create `src/app/(store)/privacy/page.tsx` and `src/app/(store)/terms/page.tsx`.

### 🟡 High

**H1 — Robots.txt blocks all of `/admin` but no sitemap reference**
`robots.ts` is missing `sitemap` field.
**Fix:**
```ts
return {
  rules: { userAgent: "*", allow: "/", disallow: "/admin" },
  sitemap: "https://jordanhearing.com/sitemap.xml",
};
```

**H2 — `<html lang="en">` only — no Arabic locale declared**
Clinic is in Jordan. Adding Arabic locale support later will require hreflang. Currently `lang="en"` is fine but note for future.

**H3 — Blog/Product dynamic pages: `generateMetadata` exists but fallback is weak**
`product/[slug]/page.tsx` fallback: `title: "Product"` — too generic. Blog slug page has no metadata at all for unknown slugs.
**Fix:** Use `title: "Product Not Found"` + `noindex` for 404 fallbacks.

**H4 — Open Graph image `/og-image.jpg` does not exist**
All pages reference `/og-image.jpg` in OG metadata but the file is not in `/public/`. Social shares will show broken image.
**Fix:** Create a placeholder `public/og-image.jpg` (1200×630px).

**H5 — Services page is `"use client"` — no server-side metadata**
Title/description never reach Google in a meaningful way. The page also has no `<meta name="description">` equivalent.

### 🟢 Good
- `robots.ts` correctly blocks `/admin`
- `sitemap.ts` includes blog posts + products dynamically
- JSON-LD MedicalClinic schema in root layout ✅
- `metadataBase` correctly set to `https://jordanhearing.com` ✅
- Security headers in `next.config.js` ✅
- Canonical tags on About, Blog, Team pages ✅
- `poweredByHeader: false` ✅

---

## 2. UI/UX PRO MAX AUDIT

### 🔴 Critical

**U1 — Footer link text is oversized (24px bold)**
`footer.tsx` line 56: Quick Links items use `text-[24px] font-bold`. Standard footer links are 14–16px. At 24px bold they crowd the layout and look like headings.
**Fix:** `text-[15px] font-medium text-white/80 hover:text-white`

**U2 — Footer headings use `<h2>` for "Quick Links" and "Email & Phone"**
Semantic issue — these are inside `<footer>`, h2 competes with page h2s. Use `<p>` or `<h3>`.

**U3 — Book Appointment and Evaluation pages: no page-level `<h1>`**
Both are `"use client"` with no visible `<h1>`. Screen readers have no page landmark. Accessibility failure.
**Fix:** Add `<h1 className="sr-only">Book an Appointment</h1>` or a visible heading.

**U4 — Contact page `<h1>` is empty**
`contact/page.tsx`: `<h1 className="text-3xl font-bold"></h1>` — empty element. No visible heading. Screen reader reads nothing.
**Fix:** Add content: `<h1 className="gradient-text text-[30px] font-semibold">Contact Us</h1>`

**U5 — Shop page `<h1>` is plain black "Shop"**
Inconsistent with other pages where H1s use gradient text. Visual inconsistency.
**Fix:** `<h1 className="gradient-text text-[38px] font-semibold">Shop</h1>`

### 🟡 High

**U6 — Services page is client component but has no loading state**
No `Suspense` or skeleton. The expand/collapse service cards cause CLS (layout shift).

**U7 — Team card `min-h-[531px]` with absolute photo may overflow on small screens**
No `overflow-hidden` on outer article wrapper — photo can bleed outside card on narrow viewports.
**Fix:** Add `overflow-hidden` to the outer `<article>` in `team-card.tsx`.

**U8 — Blog card `h-[501px]` fixed height**
On mobile (< 391px wide), fixed height + fixed circular image causes content overlap.
**Fix:** Remove fixed height, use `min-h-[460px]` and `pb-12` for READ MORE spacing.

**U9 — Mobile nav has no `aria-expanded` state on hamburger button**
Toggle button has `aria-label="Toggle menu"` but no `aria-expanded={mobileOpen}`. Screen readers cannot tell if menu is open.
**Fix:** Add `aria-expanded={mobileOpen}` to the toggle button.

**U10 — Tap target sizes: cart/wishlist icon buttons are too small**
`header.tsx`: cart and wishlist buttons have no explicit size. Default shadcn button may render < 44px tap targets on mobile.
**Fix:** Add `className="h-11 w-11"` to both icon buttons.

### 🟢 Good
- Poppins font via `next/font/google` (no layout shift) ✅
- Gradient text utility class reused consistently ✅
- Gradient button with blur shadow layer ✅
- Staggered services cards ✅
- Glassmorphism team card bottom bar ✅
- `shadcn/ui` components throughout ✅
- Mobile hamburger menu implemented ✅
- `loading.tsx` files on blog + shop + product ✅

---

## 3. SITE ARCHITECTURE AUDIT

### 🔴 Critical

**A1 — Login has two separate routes: `/login` and `/login-2`**
`src/app/(store)/login/page.tsx` AND `src/app/(store)/login-2/page.tsx` both exist. Duplicate login pages — one should be canonical or the other removed (at minimum, `/login-2` should redirect to `/login`).

**A2 — No breadcrumbs on inner pages**
Product detail, blog post, team, shop — none have breadcrumbs. Google uses breadcrumbs for understanding hierarchy. Required for BreadcrumbList schema.

**A3 — Account section exists but has no auth guard on storefront**
`/account/*` pages exist but there is no client-side redirect if user is not logged in. Users can visit `/account/orders` with no session.

### 🟡 High

**A4 — `/categories`, `/brands`, `/deals` exist as nav-accessible pages but are not in the main NAV_LINKS**
These pages are reachable from footer/shop but not top nav — creates orphan-like pages from a user navigation perspective.

**A5 — `/evaluation` is in nav but `/book-appointment` is a separate CTA — both serve appointment-related goals**
Consider merging or clearly differentiating these in the nav label. Currently nav shows: "Evaluation" + top-right "Book Appointment" button — confusing hierarchy.

**A6 — Internal linking from blog posts to services/products is missing**
Blog post pages have no related articles, no links to relevant services. Lost SEO link equity.

### 🟢 Good
- All core pages reachable within 2 clicks from homepage ✅
- Logical URL structure: `/blog/[slug]`, `/product/[slug]` ✅
- Admin completely separated under `/admin/*` ✅
- Footer has Quick Links section for secondary navigation ✅
- `sitemap.ts` covers all static + dynamic routes ✅

---

## 4. STOP-SLOP AUDIT (AI Writing Patterns)

Scanned: homepage body text, about page, services descriptions, blog card titles.

### Issues found

**S1 — "holistically empower" (homepage hero)**
Classic AI phrase. Vague and corporate.
**Fix:** "help individuals overcome hearing and speech challenges and live fully."

**S2 — "promoting optimal well-being and participation in life's activities"**
Bureaucratic filler. No clinic would say this out loud.
**Fix:** "so every person can hear clearly, speak confidently, and live independently."

**S3 — "Explore insights, stay informed. Our blogs offer concise expertise for your well-being journey."**
"well-being journey" is AI slop. "concise expertise" is vague.
**Fix:** "Read practical guides on hearing health, speech development, and therapy at home."

**S4 — "Our mission extends beyond the clinic walls"**
Overused corporate opener.
**Fix:** "We work with families, schools, and specialists to support every patient's progress — not just during sessions."

**S5 — "evidence-based approach" (team section)**
Hollow qualifier every clinic uses.
**Fix:** Remove or replace with specific: "each treatment plan is built around clinical assessment, not guesswork."

**S6 — "Our collaborative team of dedicated professionals"**
Triple filler adjectives. "collaborative," "dedicated," "professionals" — all meaningless.
**Fix:** "Our team of audiologists, speech therapists, and occupational therapists works together on every case."

---

## PRIORITY FIX TABLE

| # | Issue | Skill | Severity | File |
|---|-------|-------|----------|------|
| 1 | Sitemap wrong domain | SEO | 🔴 | `src/app/sitemap.ts` |
| 2 | Privacy + Terms pages missing | SEO+UX | 🔴 | create new files |
| 3 | Contact page empty `<h1>` | UI/UX | 🔴 | `contact/page.tsx` |
| 4 | Client pages missing metadata | SEO | 🔴 | multiple pages |
| 5 | Footer link text 24px bold | UI/UX | 🔴 | `footer.tsx` |
| 6 | Sitemap missing sitemap URL in robots | SEO | 🟡 | `robots.ts` |
| 7 | OG image file missing | SEO | 🟡 | `public/og-image.jpg` |
| 8 | Blog card fixed height mobile issue | UI/UX | 🟡 | `blog-card.tsx` |
| 9 | Team card no overflow-hidden | UI/UX | 🟡 | `team-card.tsx` |
| 10 | Hamburger no aria-expanded | UI/UX | 🟡 | `header.tsx` |
| 11 | Cart/wishlist tap target too small | UI/UX | 🟡 | `header.tsx` |
| 12 | Duplicate /login + /login-2 | Arch | 🔴 | `login-2/page.tsx` |
| 13 | No breadcrumbs on inner pages | SEO+Arch | 🟡 | multiple pages |
| 14 | AI slop copy: 6 phrases | Stop-slop | 🟡 | `page.tsx`, about, team |
| 15 | Shop H1 not gradient-text | UI/UX | 🟢 | `shop/page.tsx` |
