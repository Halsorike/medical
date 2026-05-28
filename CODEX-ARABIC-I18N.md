# Codex Prompt — Arabic (Main) + English (Option 2) i18n
**Project:** D:\Projects\Medical — Next.js 14 App Router · TypeScript · Tailwind CSS
**Goal:** Add full Arabic/English bilingual support using `next-intl`.
- Arabic (`ar`) = default language, RTL layout, Noto Sans Arabic font
- English (`en`) = secondary option, LTR layout, existing Poppins font
- URL structure: `/ar/...` (default, Arabic) and `/en/...` (English)
- Language switcher in header
- All storefront pages translated
- Admin panel stays English only

---

## RULES
- Do NOT delete files or folders
- Do NOT run git reset / git clean / push / deploy
- Do NOT edit .env files
- Do NOT run npm audit fix --force
- Do NOT upgrade major dependencies without approval
- Make minimal required changes only

---

## STEP 1 — Install next-intl

```bash
cd D:\Projects\Medical
npm install next-intl@3
```

Verify `next-intl` is in `package.json` dependencies.

---

## STEP 2 — Create translation files

### `messages/ar.json` (Arabic — PRIMARY)
```json
{
  "nav": {
    "home": "الرئيسية",
    "about": "من نحن",
    "services": "خدماتنا",
    "team": "فريقنا",
    "blog": "المدونة",
    "contact": "تواصل معنا",
    "evaluation": "تقييم السمع",
    "shop": "المتجر",
    "bookAppointment": "احجز موعداً",
    "cart": "السلة",
    "wishlist": "المفضلة"
  },
  "hero": {
    "title": "في المركز الأردني للسمع والنطق والعلاج الوظيفي،",
    "subtitle": "نساعد الأطفال والبالغين على تجاوز تحديات السمع والنطق والحسّ — لكي يتواصل كل شخص بوضوح ويعيش باستقلالية.",
    "cta": "احجز موعداً"
  },
  "services": {
    "heading": "خدماتنا",
    "description": "يقدم مركزنا طيفاً واسعاً من الخدمات للمجتمع، بفضل تعدد التخصصات لدينا. تعمل عياداتنا معاً لتحسين جودة حياة كل عميل من خلال رعاية شخصية متكاملة.",
    "cta": "جميع الخدمات",
    "hearing": {
      "title": "السمع وعلاجاته",
      "desc": "تقييمات سمعية شاملة، تشخيص دقيق، تركيب أجهزة السمع، وخطط علاجية للأطفال والبالغين."
    },
    "speech": {
      "title": "النطق وعلاجاته",
      "desc": "علاج نطق متخصص لتأخر اللغة، واضطرابات النطق، والطلاقة، وتنمية مهارات التواصل."
    },
    "occupational": {
      "title": "العلاج الوظيفي",
      "desc": "برامج علاجية لبناء المهارات الحسية والحركية ومهارات الحياة اليومية من خلال أنشطة هادفة."
    }
  },
  "about": {
    "heading": "من نحن",
    "description": "نعمل مع الأسر والمدارس والمختصين لدعم تقدم كل مريض — ليس فقط خلال الجلسات. هدفنا أن يسمع كل شخص نعالجه بوضوح، ويتحدث بثقة، ويشارك بفاعلية في حياته اليومية.",
    "cta": "تواصل معنا"
  },
  "team": {
    "heading": "فريقنا المتميز",
    "description": "أطباؤنا من السمعيين وأخصائيي النطق والمعالجين الوظيفيين يعملون معاً على كل حالة، ويبنون كل خطة علاجية وفق التقييم السريري."
  },
  "blog": {
    "heading": "مدونتنا",
    "description": "اقرأ أدلة عملية حول صحة السمع، وتطور النطق، ونصائح للعلاج في المنزل.",
    "cta": "جميع المقالات",
    "readMore": "اقرأ المزيد",
    "comments": "تعليق"
  },
  "subscribe": {
    "heading": "اشترك الآن",
    "subtext": "اشترك للحصول على نشرتنا الإخبارية",
    "placeholder": "أدخل بريدك الإلكتروني هنا",
    "cta": "اشترك"
  },
  "footer": {
    "quickLinks": "روابط سريعة",
    "contact": "البريد والهاتف",
    "privacy": "سياسة الخصوصية",
    "terms": "شروط الاستخدام",
    "rights": "© 2024 المركز الأردني للسمع والنطق. جميع الحقوق محفوظة."
  },
  "common": {
    "loading": "جارٍ التحميل...",
    "error": "حدث خطأ",
    "notFound": "الصفحة غير موجودة",
    "backHome": "العودة للرئيسية"
  },
  "pages": {
    "about": { "title": "من نحن", "description": "تعرف على المركز الأردني للسمع والنطق والعلاج الوظيفي." },
    "services": { "title": "خدماتنا", "description": "تقييم السمع، علاج النطق، العلاج الوظيفي، تركيب أجهزة السمع." },
    "team": { "title": "فريقنا", "description": "تعرف على فريقنا من أخصائيي السمع والنطق والعلاج الوظيفي." },
    "blog": { "title": "المدونة", "description": "نصائح صحية وأخبار المركز." },
    "contact": { "title": "تواصل معنا", "description": "تواصل مع المركز الأردني للسمع والنطق في عمّان." },
    "shop": { "title": "المتجر", "description": "أجهزة سمع وملحقاتها." },
    "bookAppointment": { "title": "احجز موعداً", "description": "احجز موعدك في المركز الأردني للسمع والنطق." },
    "evaluation": { "title": "تقييم السمع", "description": "أجرِ فحص سمع مبدئياً مجاناً عبر الإنترنت." },
    "privacy": { "title": "سياسة الخصوصية" },
    "terms": { "title": "شروط الاستخدام" }
  },
  "shop": {
    "heading": "المتجر",
    "search": "ابحث عن منتج...",
    "allCategories": "جميع الفئات",
    "sortBy": "ترتيب حسب",
    "popular": "الأكثر شعبية",
    "priceLow": "السعر: من الأقل",
    "priceHigh": "السعر: من الأعلى",
    "newest": "الأحدث",
    "addToCart": "أضف إلى السلة",
    "outOfStock": "غير متوفر",
    "loadMore": "عرض المزيد"
  },
  "contact": {
    "heading": "تواصل معنا!",
    "firstName": "الاسم الأول",
    "lastName": "اسم العائلة",
    "email": "البريد الإلكتروني",
    "phone": "رقم الهاتف",
    "subject": "الموضوع",
    "message": "رسالتك",
    "send": "إرسال",
    "consent": "أوافق على سياسة الخصوصية",
    "successTitle": "تم الإرسال!",
    "successMsg": "شكراً، سنتواصل معك قريباً."
  }
}
```

### `messages/en.json` (English — SECONDARY)
```json
{
  "nav": {
    "home": "Home",
    "about": "About Us",
    "services": "Services",
    "team": "Team",
    "blog": "Blog",
    "contact": "Contact Us",
    "evaluation": "Evaluation",
    "shop": "Shop",
    "bookAppointment": "Book Appointment",
    "cart": "Cart",
    "wishlist": "Wishlist"
  },
  "hero": {
    "title": "At The Jordanian Center for Hearing, Speech, and Occupational Therapy,",
    "subtitle": "we help children and adults overcome hearing, speech, and sensory challenges — so every person can communicate clearly and live independently.",
    "cta": "Book Appointment"
  },
  "services": {
    "heading": "Our Services",
    "description": "JHSM provides a large scale of services to the society due to the multiplicity of specialties in our center. Our clinics work together to improve each client's quality of life through personalized care.",
    "cta": "All Services",
    "hearing": {
      "title": "Hearing and Their Treatments",
      "desc": "Advanced hearing assessment, diagnosis, device fitting, and treatment planning for children and adults."
    },
    "speech": {
      "title": "Speech and its Treatment",
      "desc": "Personalized speech therapy for language delay, articulation, fluency, and communication development."
    },
    "occupational": {
      "title": "Occupational Therapy",
      "desc": "Therapy programs that build sensory, motor, and daily living skills through meaningful activities."
    }
  },
  "about": {
    "heading": "About Us",
    "description": "We work with families, schools, and specialists to support every patient's progress — not just during sessions. Our goal is for every person we treat to hear clearly, speak confidently, and take part fully in daily life.",
    "cta": "Contact Us"
  },
  "team": {
    "heading": "Our Main Team",
    "description": "Our audiologists, speech therapists, and occupational therapists work together on every case — building each treatment plan around clinical assessment, not guesswork."
  },
  "blog": {
    "heading": "Our Blogs",
    "description": "Read practical guides on hearing health, speech development, and therapy tips you can use at home.",
    "cta": "All Blogs",
    "readMore": "Read More",
    "comments": "Comments"
  },
  "subscribe": {
    "heading": "Subscribe now",
    "subtext": "Subscribe to get our Newsletter",
    "placeholder": "Enter your email here",
    "cta": "Subscribe"
  },
  "footer": {
    "quickLinks": "Quick Links",
    "contact": "Email & Phone",
    "privacy": "Privacy Policy",
    "terms": "Terms of Use",
    "rights": "© 2024 Jordan Hearing & Speech Therapy. All Rights Reserved."
  },
  "common": {
    "loading": "Loading...",
    "error": "Something went wrong",
    "notFound": "Page not found",
    "backHome": "Back to Home"
  },
  "pages": {
    "about": { "title": "About Us", "description": "About Jordan Hearing & Speech Therapy." },
    "services": { "title": "Our Services", "description": "Hearing evaluation, speech therapy, occupational therapy, hearing aid fitting." },
    "team": { "title": "Team", "description": "Meet our clinical team." },
    "blog": { "title": "Blog", "description": "Health tips and clinic news." },
    "contact": { "title": "Contact Us", "description": "Get in touch with Jordan Hearing & Speech Therapy in Amman." },
    "shop": { "title": "Shop", "description": "Hearing aids and accessories." },
    "bookAppointment": { "title": "Book an Appointment", "description": "Schedule your appointment." },
    "evaluation": { "title": "Hearing Evaluation", "description": "Free online hearing screening." },
    "privacy": { "title": "Privacy Policy" },
    "terms": { "title": "Terms of Use" }
  },
  "shop": {
    "heading": "Shop",
    "search": "Search products...",
    "allCategories": "All Categories",
    "sortBy": "Sort by",
    "popular": "Most Popular",
    "priceLow": "Price: Low to High",
    "priceHigh": "Price: High to Low",
    "newest": "Newest",
    "addToCart": "Add to Cart",
    "outOfStock": "Out of Stock",
    "loadMore": "Load More"
  },
  "contact": {
    "heading": "Let's get in touch!",
    "firstName": "First Name",
    "lastName": "Last Name",
    "email": "Email",
    "phone": "Phone",
    "subject": "Subject",
    "message": "Message",
    "send": "Send Message",
    "consent": "I agree to the Privacy Policy",
    "successTitle": "Message sent!",
    "successMsg": "Thank you, we will be in touch soon."
  }
}
```

---

## STEP 3 — Create `i18n.ts` (next-intl config)

**File: `src/i18n.ts`**
```ts
import { getRequestConfig } from "next-intl/server";

export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../messages/${locale}.json`)).default,
}));
```

---

## STEP 4 — Create `next-intl.config.ts`

**File: `next-intl.config.ts`** (root of project)
```ts
import { locales, defaultLocale } from "./src/i18n";
export { locales, defaultLocale };
```

---

## STEP 5 — Update `next.config.js`

Replace the existing `next.config.js` content:
```js
const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.medical.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
```

---

## STEP 6 — Update `middleware.ts`

Replace the existing `middleware.ts` to combine admin protection + next-intl routing:
```ts
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "./src/i18n";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin protection (unchanged)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = request.cookies.get("admin_session")?.value;
    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // i18n routing for all other routes
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/admin",
    "/admin/((?!login).*)",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
```

---

## STEP 7 — Restructure app directory for i18n

Move storefront pages under a `[locale]` segment:

```
src/app/
  [locale]/           ← NEW wrapper
    layout.tsx        ← locale-aware layout
    (store)/          ← move existing (store) group here
      layout.tsx
      page.tsx
      about/page.tsx
      services/page.tsx
      team/page.tsx
      blog/...
      contact/page.tsx
      shop/...
      product/...
      book-appointment/page.tsx
      evaluation/page.tsx
      privacy/page.tsx
      terms/page.tsx
      ...all other store pages
  admin/              ← stays at root (no locale)
  api/                ← stays at root (no locale)
  layout.tsx          ← root layout (unchanged)
  robots.ts
  sitemap.ts
```

**Create `src/app/[locale]/layout.tsx`:**
```tsx
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isAr = locale === "ar";
  return {
    metadataBase: new URL("https://jordanhearing.com"),
    title: {
      default: isAr
        ? "المركز الأردني للسمع والنطق والعلاج الوظيفي"
        : "Jordan Hearing & Speech Therapy",
      template: isAr
        ? "%s | المركز الأردني للسمع"
        : "%s | Jordan Hearing & Speech Therapy",
    },
    description: isAr
      ? "مركز متخصص في السمع والنطق والعلاج الوظيفي في الأردن."
      : "Professional hearing and speech therapy clinic in Jordan.",
    alternates: {
      canonical: `https://jordanhearing.com/${locale}`,
      languages: {
        ar: "https://jordanhearing.com/ar",
        en: "https://jordanhearing.com/en",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as "ar" | "en")) {
    notFound();
  }

  const messages = await getMessages();
  const isRtl = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isRtl ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

**IMPORTANT:** Remove the `<html>` and `<body>` tags from the ROOT `src/app/layout.tsx` since `[locale]/layout.tsx` now owns them. The root layout becomes just a pass-through:
```tsx
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Poppins } from "next/font/google";
import { Noto_Sans_Arabic } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

---

## STEP 8 — Update Tailwind for RTL + Arabic font

**`tailwind.config.ts`** — add Arabic font:
```ts
theme: {
  extend: {
    fontFamily: {
      sans: ["var(--font-poppins)", "var(--font-arabic)", "sans-serif"],
      arabic: ["var(--font-arabic)", "sans-serif"],
    },
    // ... existing
  }
}
```

**`src/app/globals.css`** — add RTL utility:
```css
[dir="rtl"] .gradient-text {
  background: linear-gradient(283deg, #9b1fe1 0%, #ca79c6 75%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## STEP 9 — Update `src/app/[locale]/(store)/layout.tsx`

```tsx
import { StoreHeader } from "@/components/store/header";
import { StoreFooter } from "@/components/store/footer";
import { CartProvider } from "@/components/store/cart-context";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <CartProvider>
        <StoreHeader />
        <main className="min-h-[60vh]">{children}</main>
        <StoreFooter />
        <Toaster richColors position="top-right" />
      </CartProvider>
    </Providers>
  );
}
```

---

## STEP 10 — Update Header with language switcher + translations

**`src/components/store/header.tsx`** — add these changes:

1. Import `useTranslations`, `useLocale` from `next-intl` and `Link` from `next-intl/link`
2. Replace `import Link from "next/link"` with `import Link from "next-intl/link"`
3. Add language switcher button (AR / EN toggle):

```tsx
"use client";
import Link from "next-intl/link";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
// ... rest of imports

export function StoreHeader() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const isRtl = locale === "ar";

  const NAV_LINKS = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/services", label: t("services") },
    { href: "/team", label: t("team") },
    { href: "/blog", label: t("blog") },
    { href: "/contact", label: t("contact") },
    { href: "/evaluation", label: t("evaluation") },
    { href: "/shop", label: t("shop") },
  ];

  // Language switcher — links to same path in other locale
  const otherLocale = locale === "ar" ? "en" : "ar";
  const otherLocaleLabel = locale === "ar" ? "EN" : "عربي";

  return (
    <header ...>
      {/* existing header content using t() for labels */}
      {/* Add language switcher beside the book appointment button: */}
      <Link
        href={pathname}
        locale={otherLocale}
        className="flex h-9 items-center rounded-full border border-[#9b1fe1]/30 px-3 text-[13px] font-medium text-[#9b1fe1] transition hover:bg-[#9b1fe1]/10"
      >
        {otherLocaleLabel}
      </Link>
      {/* Book Appointment button uses t("bookAppointment") */}
    </header>
  );
}
```

---

## STEP 11 — Update Homepage to use translations

**`src/app/[locale]/(store)/page.tsx`:**
```tsx
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations();

  return (
    <>
      {/* Hero */}
      <section ...>
        <h1 ...>{t("hero.title")}</h1>
        <p ...>{t("hero.subtitle")}</p>
        <Button ...>{t("hero.cta")}</Button>
      </section>

      {/* Services */}
      <h2 ...>{t("services.heading")}</h2>
      <p ...>{t("services.description")}</p>
      <Button ...>{t("services.cta")}</Button>
      {/* Cards */}
      <h3>{t("services.hearing.title")}</h3>
      <p>{t("services.hearing.desc")}</p>
      <h3>{t("services.speech.title")}</h3>
      <p>{t("services.speech.desc")}</p>
      <h3>{t("services.occupational.title")}</h3>
      <p>{t("services.occupational.desc")}</p>

      {/* About */}
      <h2 ...>{t("about.heading")}</h2>
      <p ...>{t("about.description")}</p>
      <Button ...>{t("about.cta")}</Button>

      {/* Team */}
      <h2 ...>{t("team.heading")}</h2>
      <p ...>{t("team.description")}</p>

      {/* Blog */}
      <h2 ...>{t("blog.heading")}</h2>
      <p ...>{t("blog.description")}</p>
      <Button ...>{t("blog.cta")}</Button>

      {/* Subscribe */}
      <h2 ...>{t("subscribe.heading")}</h2>
      <p ...>{t("subscribe.subtext")}</p>
      <Input placeholder={t("subscribe.placeholder")} />
      <Button ...>{t("subscribe.cta")}</Button>
    </>
  );
}
```

---

## STEP 12 — Update Footer with translations

**`src/components/store/footer.tsx`:**
```tsx
import { useTranslations } from "next-intl";
import Link from "next-intl/link";

export function StoreFooter() {
  const t = useTranslations("footer");
  // Replace hardcoded text with t("quickLinks"), t("contact"), t("privacy"), t("terms"), t("rights")
}
```

---

## STEP 13 — Update BlogCard and TeamCard

**`src/components/store/blog-card.tsx`:**
```tsx
import { useTranslations } from "next-intl";
import Link from "next-intl/link";

export function BlogCard(...) {
  const t = useTranslations("blog");
  // Replace "Read More" with t("readMore")
  // Replace "Comments" with t("comments")
}
```

---

## STEP 14 — Update sitemap.ts for both locales

**`src/app/sitemap.ts`:**
```ts
import type { MetadataRoute } from "next";
import { posts } from "@/data/blog";
import { products } from "@/data/products";

const baseUrl = "https://jordanhearing.com";
const locales = ["ar", "en"];

const staticRoutes = [
  "", "/about", "/shop", "/blog", "/book-appointment",
  "/evaluation", "/services", "/team", "/contact",
  "/privacy", "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        alternates: {
          languages: {
            ar: `${baseUrl}/ar${route}`,
            en: `${baseUrl}/en${route}`,
          },
        },
      });
    }
    for (const post of posts) {
      entries.push({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(),
      });
    }
    for (const product of products) {
      entries.push({
        url: `${baseUrl}/${locale}/product/${product.slug}`,
        lastModified: new Date(),
      });
    }
  }

  return entries;
}
```

---

## STEP 15 — Validation

```bash
npm run typecheck
npm run lint
npm run build
```

**Expected:**
- 0 typecheck errors
- 0 lint errors
- Build passes — pages now include `/ar/...` and `/en/...` variants
- Root `/` redirects to `/ar/` (default locale)
- Root `/en` serves English version
- `<html lang="ar" dir="rtl">` on Arabic pages
- `<html lang="en" dir="ltr">` on English pages

---

## NOTES FOR CODEX

1. **Move files, don't delete.** All existing `src/app/(store)/` files move to `src/app/[locale]/(store)/`.
2. **`admin/` stays at root** — no locale wrapping for admin.
3. **`api/` stays at root** — no locale wrapping for API routes.
4. **Use `next-intl/link` instead of `next/link`** in all storefront components — this preserves locale in all links automatically.
5. **RTL layout** — when `locale === "ar"`, the `<html dir="rtl">` attribute handles text direction for Arabic natively. Tailwind's `rtl:` variants can be used for specific spacing flips (e.g., `rtl:mr-0 rtl:ml-3`).
6. **Arabic font** — `Noto Sans Arabic` via `next/font/google` for Arabic text rendering.
7. **Do not translate admin pages** — admin stays English only.
8. **`useTranslations` is only for client components** — for server components use `getTranslations` from `next-intl/server`.
