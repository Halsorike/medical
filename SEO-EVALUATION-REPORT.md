# SEO Evaluation Report — Jordan Hearing & Speech Therapy
**Site:** jordanhearing.com | **Date:** May 2026 | **Stack:** Next.js 14 App Router · next-intl · Tailwind

---

## OVERALL SCORE: 71 / 100

| Dimension | Score | Grade |
|-----------|-------|-------|
| Technical SEO | 22/30 | B |
| On-Page & Content | 18/25 | B- |
| AI SEO / LLM Readiness | 11/20 | C+ |
| Programmatic SEO | 8/15 | C+ |
| Product Marketing Alignment | 12/10 *(bonus)* | A |

---

## PART 1 — TECHNICAL SEO AUDIT

### ✅ What's Working

**Sitemap** (`src/app/sitemap.ts`)
- Generates bilingual URLs: `/ar/...` and `/en/...` for all 17 static routes + blog posts + product slugs
- Includes `alternates.languages` (hreflang) on static routes ✓
- `baseUrl = "https://jordanhearing.com"` correctly set ✓
- Referenced in `robots.ts` ✓

**Robots.txt** (`src/app/robots.ts`)
- Allows all, disallows `/admin` ✓
- Sitemap URL included ✓

**Root redirect** (`src/app/page.tsx`)
- `redirect("/ar")` ensures root → Arabic (default locale) ✓

**metadataBase**
- Set to `https://jordanhearing.com` in locale layout ✓
- Prevents relative URL issues with OG images ✓

**Canonical tags**
- Locale layout sets canonical per-locale ✓
- Blog post pages set canonical ✓
- Product pages set canonical ✓

**HTML lang + dir**
- `LocaleDocumentAttributes` sets `lang` and `dir="rtl"` for Arabic ✓

**Schema markup**
- Product pages include BreadcrumbList JSON-LD ✓

---

### ❌ Issues Found

#### CRITICAL

**1. Blog post hreflang missing**
`src/app/[locale]/(store)/blog/[slug]/page.tsx` — `generateMetadata` does NOT include `alternates.languages`:
```ts
alternates: {
  canonical: `/blog/${post.slug}`,
  // ❌ missing:
  // languages: { ar: `https://jordanhearing.com/ar/blog/${post.slug}`, en: `...` }
},
```
Google cannot link Arabic and English versions of the same blog post. Fix:
```ts
alternates: {
  canonical: `https://jordanhearing.com/${params.locale}/blog/${post.slug}`,
  languages: {
    ar: `https://jordanhearing.com/ar/blog/${post.slug}`,
    en: `https://jordanhearing.com/en/blog/${post.slug}`,
  },
},
```

**2. Product page hreflang missing**
`src/app/[locale]/(store)/product/[slug]/page.tsx` — same issue:
```ts
alternates: {
  canonical: `/product/${product.slug}`, // relative — won't resolve correctly
  // ❌ no languages
},
```
Fix:
```ts
alternates: {
  canonical: `https://jordanhearing.com/${params.locale}/product/${product.slug}`,
  languages: {
    ar: `https://jordanhearing.com/ar/product/${product.slug}`,
    en: `https://jordanhearing.com/en/product/${product.slug}`,
  },
},
```

**3. Homepage metadata is not locale-aware**
`src/app/[locale]/(store)/page.tsx` — `export const metadata` is static English-only:
```ts
export const metadata: Metadata = {
  title: "Home",  // ❌ Not "الرئيسية" for Arabic
  description: "Professional hearing, speech, and occupational therapy services in Jordan.",  // ❌ English only
};
```
Since this is a server component, change to `generateMetadata`:
```ts
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isAr = locale === "ar";
  return {
    title: isAr ? "الرئيسية" : "Home",
    description: isAr
      ? "مركز الأردن للسمع والنطق والعلاج الوظيفي — رعاية متخصصة لجميع الأعمار في عمان."
      : "Jordan Hearing & Speech Therapy — specialist care for hearing, speech, and occupational therapy in Amman.",
    alternates: {
      canonical: `https://jordanhearing.com/${locale}`,
      languages: {
        ar: "https://jordanhearing.com/ar",
        en: "https://jordanhearing.com/en",
      },
    },
    openGraph: {
      title: isAr ? "المركز الأردني للسمع والنطق" : "Jordan Hearing & Speech Therapy",
      description: isAr
        ? "رعاية سمعية ونطقية ووظيفية متخصصة في الأردن."
        : "Specialist hearing, speech, and occupational therapy care in Jordan.",
      images: ["/og-image.jpg"],
    },
  };
}
```

#### HIGH

**4. Services page is "use client" — no server metadata**
`src/app/[locale]/(store)/services/page.tsx` starts with `"use client"` and uses `useState`. This means it cannot export `generateMetadata`, so Google crawls this page with no title or description.
Fix options:
- A) Create `src/app/[locale]/(store)/services/layout.tsx` with locale-aware metadata export
- B) Refactor: extract the interactive tab state to a child client component, make the page itself a server component

**5. About page missing `generateMetadata`**
`src/app/[locale]/(store)/about/page.tsx` — has `export const metadata` (static English). Should be `generateMetadata` with Arabic/English variants.

**6. Sitemap blog/product entries missing `alternates`**
Blog and product loops in `sitemap.ts` do NOT include `alternates.languages`:
```ts
// ❌ current:
entries.push({ url: `${baseUrl}/${locale}/blog/${post.slug}`, lastModified: new Date() });

// ✅ fix:
entries.push({
  url: `${baseUrl}/${locale}/blog/${post.slug}`,
  lastModified: new Date(),
  alternates: {
    languages: {
      ar: `${baseUrl}/ar/blog/${post.slug}`,
      en: `${baseUrl}/en/blog/${post.slug}`,
    },
  },
});
```

#### MEDIUM

**7. OG image is a placeholder**
`images: ["/og-image.jpg"]` is used across all pages — this file likely does not exist or is a placeholder. Should be a real 1200×630px image with clinic branding.

**8. Blog slugs are generic**
`digital-thermometer`, `read-blood-pressure-monitor-correctly` — these are pharmacy/general health slugs, not hearing/speech clinic content. They'll confuse Google about the site's niche. Should be renamed and updated to clinic-relevant topics.

**9. No JSON-LD MedicalClinic schema on homepage**
The root layout or homepage should include:
```json
{
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  "name": "Jordan Hearing & Speech Therapy",
  "url": "https://jordanhearing.com",
  "telephone": "+962-6-123-4567",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Mecca Street",
    "addressLocality": "Amman",
    "addressCountry": "JO"
  },
  "medicalSpecialty": ["Audiology", "SpeechTherapy", "OccupationalTherapy"],
  "openingHours": "Mo-Th 08:00-18:00"
}
```

**10. No FAQ schema on Evaluation or Services pages**
These are prime candidates for FAQ rich results in Google.

---

## PART 2 — ON-PAGE & CONTENT SEO

### Issues

**Blog content mismatch with clinic niche**
Current posts: "home medicine cabinet", "blood pressure monitor", "vitamins 101" — these are pharmacy topics, not hearing/speech therapy. Google will categorize the site incorrectly.

**Recommended blog topics for jordanhearing.com:**
- "Signs your child has a hearing problem" (high intent Arabic keyword: أعراض ضعف السمع عند الأطفال)
- "What is auditory processing disorder?" 
- "Cochlear implant vs hearing aid — which is right?"
- "Speech delay in toddlers: when to seek help"
- "How occupational therapy helps children with sensory issues"
- "Hearing evaluation: what to expect on your first visit"

**Title tags too generic**
- Homepage: "Home" — should be "مركز السمع والنطق | عمان الأردن" in Arabic
- About: "About" — should be "من نحن | المركز الأردني للسمع والنطق"

**Meta descriptions too short**
Arabic root layout description: `"مركز متخصص في السمع والنطق والعلاج الوظيفي في الأردن."` — 55 chars. Should be 130–160 chars with primary keywords and location.

Improved Arabic description:
> "المركز الأردني للسمع والنطق والعلاج الوظيفي في عمان — تقييم سمعي، علاج نطق، وعلاج وظيفي للأطفال والبالغين. احجز موعدك اليوم."

Improved English description:
> "Jordan Hearing & Speech Therapy in Amman — specialist hearing evaluations, speech therapy, and occupational therapy for children and adults. Book your appointment today."

---

## PART 3 — AI SEO / LLM CITATION READINESS

**Score: 11/20 — C+**

AI assistants (ChatGPT, Gemini, Perplexity, Claude) cite sources based on:
1. Clear entity definition (who/what/where)
2. Structured factual content
3. Consistent NAP (Name, Address, Phone) across the web
4. FAQ-style content that directly answers questions
5. Wikipedia-style neutral prose about the organization

### What's working
- Clear clinic name: "Jordan Hearing & Speech Therapy" — consistent ✓
- Location mentioned in footer: Amman, Jordan ✓
- Specialist names in team data ✓

### What's missing

**No "About" page optimized for entity disambiguation**
LLMs need a clear paragraph like:
> "Jordan Hearing & Speech Therapy is a medical clinic in Amman, Jordan, specializing in audiology, speech-language pathology, and occupational therapy. Founded in 2010, the clinic serves children and adults across Jordan. Contact: info@jordanhearing.com | +962 6 123 4567."

**No FAQ page**
LLMs love FAQ content — it's the most-cited page type. Create `/faq` with:
- "What services does Jordan Hearing & Speech Therapy offer?"
- "How do I book a hearing evaluation in Amman?"
- "What age can children start speech therapy?"
- "Does the clinic accept insurance?"
- "What is the difference between audiology and speech therapy?"

**No structured "Our Approach" or methodology page**
LLMs cite clinics that explain their process clearly. A `/our-approach` or `/methodology` page with step-by-step treatment descriptions would increase citation probability.

**Blog content doesn't match clinic specialty**
When someone asks Perplexity "best hearing clinic in Jordan", it looks for content about hearing. Current blog posts are about thermometers and vitamins — these actively hurt relevance.

**No Wikipedia / Wikidata presence**
For a clinic of this size, a Wikidata entry linking to the website increases LLM citation probability significantly.

**Recommended quick wins:**
1. Add FAQ JSON-LD to the homepage and services page
2. Rewrite the About page opening paragraph to be entity-clear
3. Add a `/faq` page with 10–15 hearing/speech Q&As
4. Write 2 clinic-niche blog posts (hearing evaluation, speech delay)

---

## PART 4 — PROGRAMMATIC SEO OPPORTUNITIES

**Score: 8/15 — C+**

The site has the infrastructure for programmatic SEO (dynamic routes, bilingual data) but is not using it for keyword volume.

### Opportunity 1 — Doctor profile pages (HIGH VALUE)
Each doctor has a `slug`. Currently there is no `/team/[slug]` route.

Potential keywords:
- "أخصائي سمعيات في عمان" (audiologist in Amman)
- "Dr. Ahmad Al-Rashidi audiologist Jordan"
- "أخصائية نطق أطفال عمان"

**Fix:** Create `src/app/[locale]/(store)/team/[slug]/page.tsx` — one page per doctor with full bio, specializations, and booking CTA.

### Opportunity 2 — Service detail pages (HIGH VALUE)
Currently `/services` is one combined page. Splitting into individual pages creates keyword-specific landing pages:

| Route | Target keyword |
|-------|---------------|
| `/services/hearing-evaluation` | "فحص السمع عمان" |
| `/services/speech-therapy` | "علاج النطق للأطفال الأردن" |
| `/services/occupational-therapy` | "العلاج الوظيفي عمان" |
| `/services/cochlear-implant` | "زراعة القوقعة الأردن" |
| `/services/auditory-processing` | "اضطراب المعالجة السمعية" |

### Opportunity 3 — Location pages (MEDIUM VALUE)
If the clinic serves multiple areas:
- `/areas/amman` → "عيادة سمع عمان"
- `/areas/zarqa` → "علاج نطق الزرقاء"
- `/areas/irbid` → "أخصائي سمع اربد"

### Opportunity 4 — Condition/symptom pages (HIGH VALUE)
High-intent search content:
- `/conditions/hearing-loss` → "ضعف السمع عند الأطفال"
- `/conditions/speech-delay` → "تأخر الكلام عند الأطفال"
- `/conditions/tinnitus` → "علاج الطنين"
- `/conditions/autism-speech` → "علاج النطق للتوحد"

### Opportunity 5 — Product category SEO pages (MEDIUM)
Instead of `/shop` as a single page, individual category pages:
- `/shop/hearing-aids` → "أجهزة سمع في الأردن"
- `/shop/audiometers` → "أجهزة قياس السمع"

---

## PART 5 — PRODUCT MARKETING ALIGNMENT

**Score: 12/10 — A (exceeds expectations)**

### Positioning: STRONG
- Dual-language (Arabic/English) shows local market commitment
- Stats (5000+ patients, 14+ years, 98% satisfaction) are credible and specific
- 6 specialist doctors with photos, bios, and specializations builds trust
- Online hearing evaluation tool is a strong lead-generation differentiator

### Gaps vs. competitors
- No pricing transparency (common for clinics, but a "starting from" range reduces friction)
- No patient testimonial videos (text testimonials exist but video converts better)
- No insurance accepted list
- No accreditation logos (Ministry of Health, JMC, international bodies)

### ICP (Ideal Customer Profile) — well-served
The site covers:
- Parents of children with hearing/speech issues ✓
- Adults with hearing loss ✓
- Cochlear implant patients ✓
- General Arabic-speaking Jordan audience ✓

### Messaging strengths
- "5000+ patients treated" — social proof ✓
- "14+ years experience" — authority ✓
- Online evaluation tool — captures top-of-funnel ✓
- Book appointment CTA in header — conversion-focused ✓

### Messaging gaps
- No "why us vs. other clinics" section
- No insurance/payment info
- No waiting time or response time promise ("We respond within 24 hours")
- "Shop Now" button in footer points to `/shop` — confusing for a medical clinic (should say "Medical Supplies" or "Hearing Aids Shop")

---

## PRIORITIZED ACTION PLAN

### 🔴 Fix Now (Critical — blocks indexing correctness)

| # | Fix | File | Impact |
|---|-----|------|--------|
| 1 | Add hreflang to blog post pages | `blog/[slug]/page.tsx` | High |
| 2 | Add hreflang to product pages | `product/[slug]/page.tsx` | High |
| 3 | Fix homepage metadata → `generateMetadata` with Arabic | `[locale]/(store)/page.tsx` | High |
| 4 | Add hreflang to sitemap blog/product entries | `sitemap.ts` | High |
| 5 | Fix Services page — extract client state, add server metadata | `services/page.tsx` + new layout | High |

### 🟠 Fix Soon (High — SEO quality)

| # | Fix | Impact |
|---|-----|--------|
| 6 | Expand meta descriptions to 130–160 chars (Arabic + English) | High |
| 7 | Add MedicalClinic JSON-LD schema to homepage | High |
| 8 | Replace blog content with clinic-relevant topics | High |
| 9 | Add FAQ page with JSON-LD FAQ schema | Medium-High |
| 10 | Add `generateMetadata` to About page | Medium |

### 🟡 Plan (Medium — growth)

| # | Fix | Impact |
|---|-----|--------|
| 11 | Create `/team/[slug]` doctor detail pages | High |
| 12 | Create individual `/services/[slug]` pages | High |
| 13 | Create `/faq` page (AI SEO + rich results) | Medium |
| 14 | Create `/conditions/[slug]` symptom pages | High |
| 15 | Add accreditation logos + insurance info to About/Contact | Medium |

---

## CODEX-READY FIXES (copy-paste ready for next Codex run)

### Fix 1 — Homepage generateMetadata

**File: `src/app/[locale]/(store)/page.tsx`**

Replace `export const metadata: Metadata = { ... }` with:

```ts
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isAr = locale === "ar";
  return {
    title: isAr ? "الرئيسية" : "Home",
    description: isAr
      ? "المركز الأردني للسمع والنطق والعلاج الوظيفي في عمان — تقييم سمعي، علاج نطق، وعلاج وظيفي للأطفال والبالغين. احجز موعدك اليوم."
      : "Jordan Hearing & Speech Therapy in Amman — specialist hearing evaluations, speech therapy, and occupational therapy for children and adults. Book your appointment today.",
    alternates: {
      canonical: `https://jordanhearing.com/${locale}`,
      languages: {
        ar: "https://jordanhearing.com/ar",
        en: "https://jordanhearing.com/en",
      },
    },
    openGraph: {
      title: isAr ? "المركز الأردني للسمع والنطق" : "Jordan Hearing & Speech Therapy",
      description: isAr
        ? "رعاية سمعية ونطقية ووظيفية متخصصة في الأردن."
        : "Specialist hearing, speech, and occupational therapy in Amman, Jordan.",
      images: ["/og-image.jpg"],
    },
  };
}
```

### Fix 2 — Blog post hreflang

**File: `src/app/[locale]/(store)/blog/[slug]/page.tsx`**

In `generateMetadata`, replace `alternates`:
```ts
alternates: {
  canonical: `https://jordanhearing.com/${params.locale}/blog/${post.slug}`,
  languages: {
    ar: `https://jordanhearing.com/ar/blog/${post.slug}`,
    en: `https://jordanhearing.com/en/blog/${post.slug}`,
  },
},
```

### Fix 3 — Product page hreflang

**File: `src/app/[locale]/(store)/product/[slug]/page.tsx`**

In `generateMetadata`, replace `alternates`:
```ts
alternates: {
  canonical: `https://jordanhearing.com/${params.locale}/product/${product.slug}`,
  languages: {
    ar: `https://jordanhearing.com/ar/product/${product.slug}`,
    en: `https://jordanhearing.com/en/product/${product.slug}`,
  },
},
```

### Fix 4 — Sitemap hreflang for blog + products

**File: `src/app/sitemap.ts`**

Replace the blog loop:
```ts
for (const post of posts) {
  entries.push({
    url: `${baseUrl}/${locale}/blog/${post.slug}`,
    lastModified: new Date(),
    alternates: {
      languages: {
        ar: `${baseUrl}/ar/blog/${post.slug}`,
        en: `${baseUrl}/en/blog/${post.slug}`,
      },
    },
  });
}
```

Replace the product loop:
```ts
for (const product of products) {
  entries.push({
    url: `${baseUrl}/${locale}/product/${product.slug}`,
    lastModified: new Date(),
    alternates: {
      languages: {
        ar: `${baseUrl}/ar/product/${product.slug}`,
        en: `${baseUrl}/en/product/${product.slug}`,
      },
    },
  });
}
```

### Fix 5 — Services page layout with metadata

**New file: `src/app/[locale]/(store)/services/layout.tsx`**

```ts
import type { Metadata } from "next";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isAr = locale === "ar";
  return {
    title: isAr ? "خدماتنا" : "Our Services",
    description: isAr
      ? "خدمات المركز الأردني للسمع والنطق: تقييم السمع، علاج النطق، العلاج الوظيفي، معالجة السمع المركزية، وتركيب أجهزة السمع في عمان."
      : "Jordan Hearing & Speech Therapy services: hearing evaluation, speech therapy, occupational therapy, auditory processing, and hearing aid fitting in Amman.",
    alternates: {
      canonical: `https://jordanhearing.com/${locale}/services`,
      languages: {
        ar: "https://jordanhearing.com/ar/services",
        en: "https://jordanhearing.com/en/services",
      },
    },
  };
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

### Fix 6 — MedicalClinic JSON-LD on homepage

Add to `src/app/[locale]/(store)/page.tsx` inside the JSX return:
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "MedicalClinic",
      name: "Jordan Hearing & Speech Therapy",
      alternateName: "المركز الأردني للسمع والنطق والعلاج الوظيفي",
      url: "https://jordanhearing.com",
      telephone: "+962-6-123-4567",
      email: "info@jordanhearing.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "123 Mecca Street",
        addressLocality: "Amman",
        addressCountry: "JO",
      },
      medicalSpecialty: ["Audiology", "SpeechTherapy", "PhysicalTherapy"],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Sunday","Monday","Tuesday","Wednesday","Thursday"],
          opens: "08:00",
          closes: "18:00",
        },
      ],
      sameAs: [
        "https://facebook.com/jordanhearing",
        "https://instagram.com/jordanhearing",
        "https://twitter.com/jordanhearing",
      ],
    }),
  }}
/>
```

---

## VALIDATION AFTER FIXES

```bash
npm run typecheck
npm run lint
npm run build
```

Then verify with:
- [Google Rich Results Test](https://search.google.com/test/rich-results) → paste jordanhearing.com
- [hreflang validator](https://technicalseo.com/tools/hreflang/) → check `/ar/blog/digital-thermometer`
- Google Search Console → Coverage + Sitemaps after deploy
