# Codex Prompt — Skills Audit Fixes
**Source:** SKILLS-AUDIT-REPORT.md (seo-audit + ui-ux-pro-max + site-architecture + stop-slop)
**Project:** D:\Projects\Medical — Next.js 14 App Router · TypeScript · Tailwind · shadcn/ui

---

## ALREADY FIXED (do NOT redo)
- ✅ `sitemap.ts` — baseUrl changed to `https://jordanhearing.com`
- ✅ `robots.ts` — sitemap URL added
- ✅ `contact/page.tsx` — h1 fixed to gradient-text
- ✅ `footer.tsx` — Quick Links 24px bold → 15px medium, h2 → h3
- ✅ `header.tsx` — cart/wishlist h-11 w-11, aria-expanded added
- ✅ `team-card.tsx` — overflow-visible removed
- ✅ `blog-card.tsx` — fixed h-[501px] → min-h-[460px]
- ✅ `privacy/page.tsx` — created
- ✅ `terms/page.tsx` — created
- ✅ Homepage copy — 3 stop-slop phrases replaced

---

## TASK 1 — Add metadata to client-page routes

These pages are `"use client"` so they cannot export `metadata` directly.
Create a `layout.tsx` beside each with static metadata:

### `src/app/(store)/contact/layout.tsx`
```tsx
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Jordan Hearing & Speech Therapy in Amman, Jordan. Call +962 6 123 4567 or send us a message.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Jordan Hearing & Speech Therapy",
    description: "Reach our clinic in Amman for hearing and speech therapy inquiries.",
    images: ["/og-image.jpg"],
  },
};
export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

### `src/app/(store)/shop/layout.tsx`
Already exists — check if it has metadata. If not, add:
```tsx
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shop — Hearing Aids & Accessories",
  description: "Browse hearing aids, accessories, and therapeutic devices at Jordan Hearing & Speech Therapy.",
  alternates: { canonical: "/shop" },
};
export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

### `src/app/(store)/services/layout.tsx`
```tsx
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Our Services",
  description: "Hearing evaluation, speech therapy, occupational therapy, hearing aid fitting and rehabilitation — Jordan Hearing & Speech Therapy.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Hearing & Speech Therapy Services in Jordan",
    description: "Comprehensive audiology and speech therapy services in Amman, Jordan.",
    images: ["/og-image.jpg"],
  },
};
export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

### `src/app/(store)/book-appointment/layout.tsx`
```tsx
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Book an Appointment",
  description: "Schedule a hearing or speech therapy appointment at Jordan Hearing & Speech Therapy in Amman.",
  alternates: { canonical: "/book-appointment" },
};
export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

### `src/app/(store)/evaluation/layout.tsx`
```tsx
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Hearing Evaluation",
  description: "Take our free online hearing screening to assess your hearing health. Not a clinical diagnosis.",
  alternates: { canonical: "/evaluation" },
};
export default function EvaluationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

---

## TASK 2 — Fix Shop page H1 to gradient-text

**File:** `src/app/(store)/shop/page.tsx`

Find:
```tsx
<h1 className="text-3xl font-bold md:text-4xl">Shop</h1>
```
Replace with:
```tsx
<h1 className="gradient-text text-[38px] font-semibold">Shop</h1>
```

---

## TASK 3 — Remove or redirect /login-2

**File:** `src/app/(store)/login-2/page.tsx`

Add a redirect to `/login`:
```tsx
import { redirect } from "next/navigation";
export default function Login2Page() {
  redirect("/login");
}
```

Same for `src/app/(store)/login-2/register/page.tsx` → redirect to `/register`.

---

## TASK 4 — Add visible H1 to Book Appointment and Evaluation pages

**File:** `src/app/(store)/book-appointment/page.tsx`
Find the opening of the returned JSX and add before the first section:
```tsx
<h1 className="sr-only">Book an Appointment</h1>
```

**File:** `src/app/(store)/evaluation/page.tsx`
```tsx
<h1 className="sr-only">Online Hearing Evaluation</h1>
```

---

## TASK 5 — Fix OG image placeholder

Create `public/og-image.jpg` (1200×630px gradient PNG).
If image generation is not available, create a minimal placeholder:

```bash
# Use Node canvas or just copy an existing image
cp public/favicon.ico public/og-image.jpg
```

Better: create a simple SVG and convert, or use a solid gradient PNG.
The file just needs to exist so the OG meta tag doesn't return 404.

---

## TASK 6 — Add BreadcrumbList schema to Product and Blog detail pages

**File:** `src/app/(store)/product/[slug]/page.tsx`

Add JSON-LD BreadcrumbList after existing metadata:
```tsx
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://jordanhearing.com" },
    { "@type": "ListItem", position: 2, name: "Shop", item: "https://jordanhearing.com/shop" },
    { "@type": "ListItem", position: 3, name: product.name, item: `https://jordanhearing.com/product/${product.slug}` },
  ],
};
// Add in the JSX:
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
```

**File:** `src/app/(store)/blog/[slug]/page.tsx` — same pattern:
```tsx
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://jordanhearing.com" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://jordanhearing.com/blog" },
    { "@type": "ListItem", position: 3, name: post.title, item: `https://jordanhearing.com/blog/${post.slug}` },
  ],
};
```

---

## TASK 7 — Stop-slop: fix remaining copy on About page

**File:** `src/app/(store)/about/page.tsx`

Find and replace these phrases:
| Old | New |
|-----|-----|
| `"evidence-based approach"` | `"clinical assessment and individual goals"` |
| `"dedicated professionals"` or `"collaborative team of dedicated"` | `"team of audiologists, speech therapists, and occupational therapists"` |
| Any use of `"optimal well-being"` | `"better daily life"` |
| `"holistically"` | remove or replace with specific action |

---

## VALIDATION

After all tasks:
```bash
npm run typecheck
npm run lint
npm run build
```
Expected: 0 errors, build 79+7 new pages = ~86/86 pages.

---

## RULES
- Do NOT delete files
- Do NOT run git reset / git clean / push / deploy
- Do NOT edit .env files
- Minimal changes only
- All new layout.tsx files should be thin wrappers — just metadata + `return <>{children}</>`
