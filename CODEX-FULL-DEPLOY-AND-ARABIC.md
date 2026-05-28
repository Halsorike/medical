# Codex Prompt — PostgreSQL Switch + Full Arabic Content Pass

**Project:** `D:\Projects\Medical`
**Stack:** Next.js 14 · TypeScript · Tailwind CSS · shadcn/ui · Prisma · next-intl
**Locales:** `ar` (default, RTL) · `en` (LTR)
**Route structure:** `src/app/[locale]/(store)/...`

---

## RULES — READ FIRST

- Do NOT delete any files or folders
- Do NOT run `git reset`, `git clean`, `git restore`, or push/deploy
- Do NOT edit `.env` or `.env.local`
- Do NOT run `npm audit fix --force`
- Do NOT upgrade major dependencies
- Make minimal changes — only what is listed below
- After ALL tasks: run `npm run typecheck && npm run lint && npm run build`

---

## ═══════════════════════════════════
## PART A — POSTGRESQL SWITCH (deploy readiness)
## ═══════════════════════════════════

### TASK A1 — Switch Prisma provider to PostgreSQL

**File: `prisma/schema.prisma`**

Find line:
```prisma
  provider = "sqlite"
```

Replace with:
```prisma
  provider = "postgresql"
```

That is the only change to this file. Do not touch any model definitions.

> **Why safe locally:** Local dev uses `DATABASE_URL=file:./dev.db` in `.env.local` — SQLite.
> After this change, local dev will error unless `DATABASE_URL` points to a Postgres instance.
> This switch is intentional — it is the deploy-cutover step. Local devs can keep a Postgres
> instance via Docker or switch back temporarily. The file must say `postgresql` for Vercel.

After this task, regenerate the Prisma client:
```bash
npx prisma generate
```

---

## ═══════════════════════════════════
## PART B — FULL ARABIC CONTENT PASS
## ═══════════════════════════════════

**Already done:** UI labels, nav, buttons, homepage sections (in `messages/ar.json` and `messages/en.json`).

**This pass:** page body content, data files (team/blog/products), form options, About/Services/Contact/Evaluation/BookAppointment pages.

---

### TASK B1 — Bilingual team data

**File: `src/data/team.ts`**

Replace the entire file content with the following:

```ts
export type Doctor = {
  name: string;
  nameAr: string;
  title: string;
  titleAr: string;
  slug: string;
  image: string;
  bio: string;
  bioAr: string;
  tags: string[];
  tagsAr: string[];
  socials: { facebook: string; instagram: string; twitter: string };
};

export const doctors: Doctor[] = [
  {
    name: "Dr. Ahmad Al-Rashidi",
    nameAr: "د. أحمد الرشيدي",
    title: "Hearing Specialist",
    titleAr: "أخصائي سمعيات",
    slug: "ahmad-al-rashidi",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=360&h=450&fit=crop",
    bio: "Senior audiologist specializing in diagnostic hearing evaluations and personalized hearing care plans.",
    bioAr: "أخصائي سمعيات بارز متخصص في التقييمات التشخيصية للسمع وخطط الرعاية السمعية الشخصية.",
    tags: ["Audiology", "Diagnostics", "Hearing Care"],
    tagsAr: ["سمعيات", "تشخيص", "رعاية السمع"],
    socials: {
      facebook: "https://facebook.com/dr.ahmad.alrashidi",
      instagram: "https://instagram.com/dr.ahmad.alrashidi",
      twitter: "https://twitter.com/a_alrashidi_aud",
    },
  },
  {
    name: "Dr. Sara Mahmoud",
    nameAr: "د. سارة محمود",
    title: "Speech Therapist",
    titleAr: "أخصائية نطق ولغة",
    slug: "sara-mahmoud",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=360&h=450&fit=crop",
    bio: "Speech therapist focused on pediatric language development, articulation, and family-centered therapy.",
    bioAr: "أخصائية نطق ولغة متخصصة في تطوير لغة الأطفال والنطق والعلاج الموجّه للأسرة.",
    tags: ["Speech Therapy", "Pediatrics", "Language"],
    tagsAr: ["علاج النطق", "طب الأطفال", "اللغة"],
    socials: {
      facebook: "https://facebook.com/dr.sara.mahmoud",
      instagram: "https://instagram.com/dr.sara.mahmoud",
      twitter: "https://twitter.com/smahmoud_speech",
    },
  },
  {
    name: "Dr. Khalid Nasser",
    nameAr: "د. خالد ناصر",
    title: "Occupational Therapist",
    titleAr: "معالج وظيفي",
    slug: "khalid-nasser",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=360&h=450&fit=crop",
    bio: "Occupational therapist helping children and adults build independence through practical daily-life skills.",
    bioAr: "معالج وظيفي يساعد الأطفال والبالغين على بناء الاستقلالية من خلال مهارات الحياة اليومية العملية.",
    tags: ["Occupational Therapy", "Rehabilitation", "Daily Living"],
    tagsAr: ["العلاج الوظيفي", "إعادة التأهيل", "الحياة اليومية"],
    socials: {
      facebook: "https://facebook.com/dr.khalid.nasser",
      instagram: "https://instagram.com/dr.khalid.nasser",
      twitter: "https://twitter.com/k_nasser_ot",
    },
  },
  {
    name: "Dr. Lina Haddad",
    nameAr: "د. لينا حداد",
    title: "Pediatric Audiologist",
    titleAr: "أخصائية سمعيات أطفال",
    slug: "lina-haddad",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=360&h=450&fit=crop",
    bio: "Pediatric audiologist specializing in early hearing screening, cochlear implant follow-up, and infant audiology.",
    bioAr: "أخصائية سمعيات أطفال متخصصة في الكشف المبكر للسمع ومتابعة زراعة القوقعة وسمعيات الرضّع.",
    tags: ["Pediatric Audiology", "Cochlear Implant", "Infant"],
    tagsAr: ["سمعيات الأطفال", "زراعة القوقعة", "الرضّع"],
    socials: {
      facebook: "https://facebook.com/dr.lina.haddad",
      instagram: "https://instagram.com/dr.lina.haddad",
      twitter: "https://twitter.com/lhaddad_aud",
    },
  },
  {
    name: "Dr. Omar Yousef",
    nameAr: "د. عمر يوسف",
    title: "Speech & Language Pathologist",
    titleAr: "أخصائي أمراض النطق واللغة",
    slug: "omar-yousef",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=360&h=450&fit=crop",
    bio: "Specialist in fluency disorders, voice therapy, and adult communication rehabilitation.",
    bioAr: "متخصص في اضطرابات الطلاقة وعلاج الصوت وإعادة تأهيل التواصل لدى البالغين.",
    tags: ["Fluency", "Voice Therapy", "Adult Rehab"],
    tagsAr: ["الطلاقة", "علاج الصوت", "إعادة التأهيل"],
    socials: {
      facebook: "https://facebook.com/dr.omar.yousef",
      instagram: "https://instagram.com/dr.omar.yousef",
      twitter: "https://twitter.com/oyousef_slp",
    },
  },
  {
    name: "Dr. Nadia Saleh",
    nameAr: "د. نادية صالح",
    title: "Occupational Therapist",
    titleAr: "معالجة وظيفية",
    slug: "nadia-saleh",
    image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=360&h=450&fit=crop",
    bio: "Occupational therapist with expertise in sensory processing, school readiness, and fine motor skills.",
    bioAr: "معالجة وظيفية متخصصة في المعالجة الحسية والاستعداد المدرسي والمهارات الحركية الدقيقة.",
    tags: ["Sensory Processing", "School Readiness", "Fine Motor"],
    tagsAr: ["المعالجة الحسية", "الاستعداد المدرسي", "المهارات الحركية الدقيقة"],
    socials: {
      facebook: "https://facebook.com/dr.nadia.saleh",
      instagram: "https://instagram.com/dr.nadia.saleh",
      twitter: "https://twitter.com/nsaleh_ot",
    },
  },
];

/** Returns locale-resolved fields for display. Does not mutate original. */
export function getDoctorLocale(doctor: Doctor, locale: string) {
  return {
    ...doctor,
    name: locale === "ar" ? doctor.nameAr : doctor.name,
    title: locale === "ar" ? doctor.titleAr : doctor.title,
    bio: locale === "ar" ? doctor.bioAr : doctor.bio,
    tags: locale === "ar" ? doctor.tagsAr : doctor.tags,
  };
}
```

---

### TASK B2 — Update TeamCard to accept and use locale

**File: `src/components/store/team-card.tsx`**

1. Read the current file first.
2. Find the `TeamCardProps` type and the component signature.
3. Add `locale?: string` to props (default `"en"`).
4. Replace every reference to `doctor.name` with `locale === "ar" ? doctor.nameAr : doctor.name`.
5. Replace every reference to `doctor.title` with `locale === "ar" ? doctor.titleAr : doctor.title`.
6. Replace every reference to `doctor.tags` (the array map) with `(locale === "ar" ? doctor.tagsAr : doctor.tags)`.
7. Do NOT change any styling, layout, or other logic.
8. The `Doctor` import must come from `"@/data/team"` — update if needed.

---

### TASK B3 — Update Team page to pass locale

**File: `src/app/[locale]/(store)/team/page.tsx`**

1. Read the current file.
2. Ensure the page receives `params: { locale: string }`.
3. Pass `locale={locale}` (or `locale={params.locale}`) to every `<TeamCard>` render.
4. No other changes.

---

### TASK B4 — Bilingual blog data

**File: `src/data/blog.ts`**

1. Read the current file to see existing post structure.
2. Add these fields to the `BlogPost` type:
```ts
titleAr: string;
excerptAr: string;
categoryAr: string;
contentAr: string[];
```
3. Add Arabic translations to each post. Use the values below for posts 1–3. For any additional posts (4–6), follow the same bilingual pattern using sensible Arabic translations of the existing English content.

**Post 1 Arabic fields:**
```ts
titleAr: "٥ أساسيات يحتاجها كل صيدلية منزلية",
excerptAr: "كن مستعداً للاحتياجات الصحية اليومية.",
categoryAr: "نصائح صحية",
contentAr: [
  "الصيدلية المنزلية المجهزة جيداً تجعل المشكلات الصحية البسيطة أسهل في التعامل قبل أن تتفاقم. الهدف ليس بناء مستشفى مصغّر في المنزل، بل الاحتفاظ بالأساسيات في متناول اليد.",
  "ابدأ بمقاييس الحرارة الموثوقة، ومسكنات الألم، ومواد العناية بالجروح، ودعم الترطيب. هذه المواد لا توفر الوقت فحسب، بل تساعد الأسر على الاستجابة بهدوء عند ارتفاع درجة الحرارة ليلاً.",
  "طريقة التخزين مهمة بقدر اختيار المنتج. احتفظ بالأدوية في مكان جاف ومُصنَّف وبعيداً عن متناول الأطفال. راجع تواريخ الصلاحية كل بضعة أشهر.",
  "إذا كان أحد أفراد الأسرة يعاني من حالة مزمنة، أضف قسماً صغيراً لاحتياجاته الروتينية كذلك.",
  "أفضل صيدلية هي تلك التي يسهل التنقل فيها. نظّمها بطريقة يستطيع فيها أي فرد من الأسرة فهمها بسرعة."
],
```

**Post 2 Arabic fields:**
```ts
titleAr: "كيف تقرأ جهاز قياس ضغط الدم بشكل صحيح",
excerptAr: "دليل سريع للقراءات الدقيقة.",
categoryAr: "الأجهزة",
contentAr: [
  "أرقام ضغط الدم يمكن أن تتفاوت أكثر مما يتوقع الناس، خاصةً عندما يكون الجسم متوتراً أو متعجلاً. القراءة المفيدة تبدأ بالإعداد الصحيح: اجلس بشكل مريح، وارتح لبضع دقائق.",
  "قراءة واحدة نادراً ما تحكي القصة الكاملة. ابحث عن الأنماط عبر عدة أيام في أوقات مشابهة بدلاً من الاستجابة لرقم واحد.",
  "أجهزة المنزل مفيدة لأنها تلتقط الأنماط اليومية خارج العيادة. الاحتفاظ بسجل قصير للقراءات والأعراض يجعل المواعيد أكثر إنتاجية.",
  "إذا ظلت القراءات مرتفعة باستمرار، فالخطوة التالية هي فحص معايرة سريع ومحادثة مع متخصص."
],
```

**Post 3 Arabic fields:**
```ts
titleAr: "الفيتامينات ١٠١: اختيار المكمل الغذائي المناسب",
excerptAr: "اعثر على ما يناسب احتياجاتك.",
categoryAr: "التغذية",
contentAr: [
  "المكملات الغذائية مفيدة، لكنها تعمل بشكل أفضل عندما تلبي حاجة حقيقية وليس مجرد شعور غامض. العمر والنظام الغذائي واستخدام الأدوية والنقص المعروف يشكّل ما يناسب كل شخص.",
  "الجودة والاتساق مهمان. اختر منتجات ذات تسمية واضحة وجرعة معقولة وعلامات تجارية تشرح معايير الاختبار.",
  "الخطأ الأكثر شيوعاً هو تكديس منتجات متعددة تتداخل. هذا يؤدي إلى تكلفة غير ضرورية وأحياناً جرعة زائدة.",
  "يمكن للطبيب أو الصيدلاني عادةً تضييق الخيار بسرعة. توصية قصيرة ومحددة أفضل من رف مليء بالمشتريات المأمولة."
],
```

4. Add this helper at the bottom of `blog.ts`:
```ts
/** Returns locale-resolved fields for display. Does not mutate original. */
export function getPostLocale(post: BlogPost, locale: string) {
  return {
    ...post,
    title: locale === "ar" ? post.titleAr : post.title,
    excerpt: locale === "ar" ? post.excerptAr : post.excerpt,
    category: locale === "ar" ? post.categoryAr : post.category,
    content: locale === "ar" ? post.contentAr : post.content,
  };
}
```

---

### TASK B5 — Update Blog pages to use locale

**File: `src/app/[locale]/(store)/blog/page.tsx`**

1. Read the current file.
2. Import `getPostLocale` from `"@/data/blog"`.
3. Resolve posts with locale before passing to any child component:
```ts
const localePosts = posts.map((p) => getPostLocale(p, locale));
```
4. Pass `localePosts` instead of `posts` to `<BlogListClient>` and any `<BlogCard>` renders.

**File: `src/app/[locale]/(store)/blog/blog-list-client.tsx`** (if it exists)

1. Read the file.
2. Accept a `locale` prop (string).
3. Apply `getPostLocale(post, locale)` before rendering each card, OR expect pre-resolved posts from the parent page and just render them as-is (whichever is simpler given the existing code).

**File: `src/app/[locale]/(store)/blog/[slug]/page.tsx`**

1. Read the file.
2. After finding the post by slug, apply: `const localePost = getPostLocale(post, locale);`
3. Use `localePost` for all rendering.

---

### TASK B6 — About page bilingual body content

**File: `src/app/[locale]/(store)/about/page.tsx`**

1. Read the current file.
2. Add a `CONTENT` object at the top of the file (outside the component):

```ts
const CONTENT = {
  ar: {
    heading: "من نحن",
    mission: "تأسس مركزنا عام ٢٠١٠ بهدف واحد: تقديم رعاية سمعية ونطقية ووظيفية من أعلى مستوى لكل أسرة في الأردن. نعمل مع الأطفال من عمر الولادة، والبالغين في كل مرحلة من مراحل الحياة.",
    vision: "رؤيتنا عالم يستطيع فيه كل شخص أن يسمع بوضوح ويتحدث بثقة ويشارك بفاعلية في الحياة اليومية.",
    stats: [
      { label: "مريض تمت معالجته", value: "٥٠٠٠+" },
      { label: "سنوات خبرة", value: "١٤+" },
      { label: "متخصص معتمد", value: "١٢" },
      { label: "نسبة رضا المرضى", value: "٩٨٪" },
    ],
    teamHeading: "فريقنا من المتخصصين",
    techHeading: "أحدث التقنيات",
    techDesc: "نستخدم أحدث الأجهزة التشخيصية والعلاجية المعتمدة دولياً لضمان أفضل النتائج لمرضانا.",
    testimonialsHeading: "آراء مرضانا",
    testimonials: [
      { name: "أم أحمد", text: "بعد جلسات النطق، بدأ ابني يتكلم بشكل واضح. الفريق رائع ومتفانٍ.", role: "والدة مريض" },
      { name: "عبدالله م.", text: "الأجهزة ممتازة والأطباء محترفون جداً. أنصح كل من يعاني من مشكلة سمع بزيارة المركز.", role: "مريض بالغ" },
      { name: "سمر خ.", text: "ابنتي تحسنت كثيراً في العلاج الوظيفي. الحمد لله على هذا المركز.", role: "والدة مريضة" },
    ],
  },
  en: {
    heading: "About Us",
    mission: "Founded in 2010 with one goal: delivering the highest standard of hearing, speech, and occupational therapy care to every family in Jordan. We work with children from birth and adults at every stage of life.",
    vision: "Our vision is a world where everyone can hear clearly, speak confidently, and take part fully in daily life.",
    stats: [
      { label: "Patients Treated", value: "5000+" },
      { label: "Years Experience", value: "14+" },
      { label: "Certified Specialists", value: "12" },
      { label: "Patient Satisfaction", value: "98%" },
    ],
    teamHeading: "Our Specialists Team",
    techHeading: "Latest Technology",
    techDesc: "We use the latest internationally certified diagnostic and therapeutic equipment to ensure the best outcomes for our patients.",
    testimonialsHeading: "Real Stories from Satisfied Customers",
    testimonials: [
      { name: "Ahmad's Mother", text: "After speech sessions, my son started speaking clearly. The team is wonderful and dedicated.", role: "Patient Parent" },
      { name: "Abdullah M.", text: "Excellent equipment and very professional doctors. I recommend the center to anyone with hearing issues.", role: "Adult Patient" },
      { name: "Samar K.", text: "My daughter improved so much in occupational therapy. Thank God for this center.", role: "Patient Parent" },
    ],
  },
} as const;
```

3. In the component body: `const c = CONTENT[locale as "ar" | "en"] ?? CONTENT.ar;`
4. Replace any hardcoded English heading/mission/vision/stats/testimonials with `c.heading`, `c.mission`, etc.
5. Keep all layout, styling, and non-text logic unchanged.

---

### TASK B7 — Services page bilingual descriptions

**File: `src/app/[locale]/(store)/services/page.tsx`**

1. Read the current file to see the existing `SERVICES` array shape and icon imports.
2. Add an Arabic services array using the same icon references:

```ts
const SERVICES_AR = [
  {
    icon: Ear,
    title: "تقييم السمع",
    description: "تقييمات سمعية شاملة باستخدام أحدث الأجهزة لقياس مستويات السمع بدقة وتشخيص اضطرابات السمع لجميع الأعمار.",
  },
  {
    icon: MessageCircle,
    title: "علاج النطق",
    description: "علاج متخصص للأفراد الذين يعانون من اضطرابات الكلام واللغة والتواصل — من مشكلات النطق والطلاقة إلى تأخر اللغة.",
  },
  {
    icon: BriefcaseMedical,
    title: "العلاج الوظيفي",
    description: "برامج علاج وظيفي شاملة تساعد الأطفال والبالغين على تطوير مهاراتهم الحسية والحركية ومهارات الحياة اليومية.",
  },
  {
    icon: Brain,
    title: "اضطرابات المعالجة السمعية",
    description: "تشخيص وعلاج متخصص لاضطرابات المعالجة السمعية المركزية التي تؤثر على الفهم في البيئات الصاخبة.",
  },
  {
    icon: Eye,
    title: "تركيب أجهزة السمع",
    description: "اختيار وتركيب وضبط أجهزة السمع المناسبة لكل مريض من قِبل متخصصين معتمدين.",
  },
  {
    icon: Activity,
    title: "إعادة التأهيل السمعي",
    description: "برامج إعادة تأهيل سمعي شاملة تشمل التدريب على الاستماع وتحسين التواصل بعد تركيب الأجهزة.",
  },
];
```

> **Note:** Use whichever icon names already exist in the file. If `BriefcaseMedical`, `Brain`, `Eye`, `Activity` are not imported, substitute the icons already used in the English array — keep the icon mapping identical to English, just translate title and description.

3. In the component: `const SERVICES_DISPLAY = locale === "ar" ? SERVICES_AR : SERVICES;`
4. Replace the array used in the JSX map with `SERVICES_DISPLAY`.

---

### TASK B8 — Product data Arabic names

**Step 1 — Add optional fields to Product type**

Find the `Product` type definition (likely in `src/types/index.ts`, `src/types.ts`, or inline in `src/data/products.ts`). Add:
```ts
nameAr?: string;
descriptionAr?: string;
```

**Step 2 — Add Arabic names to products array**

**File: `src/data/products.ts`**

1. Read the current file.
2. Add a `namesAr` array at the top (parallel to the existing `names` array):
```ts
const namesAr = [
  "ميزان حرارة رقمي", "جهاز قياس ضغط الدم", "جهاز قياس الأكسجين", "سماعة طبية احترافية",
  "كمامات جراحية (٥٠)", "كمامة N95 (٢٠)", "فيتامين C 1000مج", "أوميغا-3 زيت السمك",
  "معقّم اليدين ٥٠٠مل", "حقيبة إسعافات أولية", "شرائط فحص الجلوكوز", "حقن الأنسولين",
  "جوارب ضاغطة", "دعامة الركبة", "ضمادة مرنة", "كمادة جل باردة",
  "جهاز قياس السكر", "جهاز بخار مضغوط", "كرسي متحرك خفيف", "عصا مشي قابلة للضبط",
  "فيتامينات متعددة يومية", "بروبيوتيك ٦٠ كبسولة", "كالسيوم + D3", "مركب المغنيسيوم",
  "قطرات عيون مرطبة", "كريم مطهر", "شراب للسعال ٢٠٠مل", "أقراص مسكّنة للألم",
];
```
3. In the product map/array construction, add:
```ts
nameAr: namesAr[i] ?? name,
descriptionAr: `${namesAr[i] ?? name} — جودة طبية موثوقة.`,
```

**Step 3 — Use Arabic names in shop/product pages**

In `src/app/[locale]/(store)/shop/page.tsx` (and any product card / product detail page):
```ts
const displayName = locale === "ar" && product.nameAr ? product.nameAr : product.name;
const displayDesc = locale === "ar" && product.descriptionAr ? product.descriptionAr : product.description;
```
Replace rendered `product.name` and `product.description` with `displayName` and `displayDesc`.

---

### TASK B9 — Contact page form subjects in Arabic

**File: `src/app/[locale]/(store)/contact/page.tsx`**

1. Read the current file to find the `SUBJECTS` array (or however subjects/topics are defined).
2. Add bilingual arrays:
```ts
const SUBJECTS_AR = ["استفسار عام", "حجز موعد", "استفسار عن منتج", "شكوى", "شراكة", "أخرى"];
const SUBJECTS_EN = ["General Inquiry", "Book Appointment", "Product Inquiry", "Complaint", "Partnership", "Other"];
const SUBJECTS = locale === "ar" ? SUBJECTS_AR : SUBJECTS_EN;
```
3. Replace the existing subjects reference with `SUBJECTS`.
4. No layout or styling changes.

---

### TASK B10 — Evaluation page questions in Arabic

**File: `src/app/[locale]/(store)/evaluation/page.tsx`**

1. Read the current file.
2. Add Arabic question and answer sets:
```ts
const QUESTIONS_AR = [
  "هل تجد صعوبة في السمع في البيئات الصاخبة؟",
  "هل تطلب كثيراً من الآخرين إعادة ما قالوه؟",
  "هل ترفع صوت التلفاز أو الراديو أكثر مما يفضّل الآخرون؟",
  "هل تسمع طنيناً أو أزيزاً في أذنيك؟",
  "هل تفوتك أجزاء من المحادثات؟",
  "هل تجد صعوبة في فهم الكلام عبر الهاتف؟",
];

const ANSWERS_AR: Record<string, number> = {
  "أبداً": 0, "نادراً": 1, "أحياناً": 2, "غالباً": 3, "دائماً": 4,
};
```
3. Select based on locale:
```ts
const QUESTIONS_DISPLAY = locale === "ar" ? QUESTIONS_AR : QUESTIONS;
const ANSWERS_DISPLAY = locale === "ar" ? ANSWERS_AR : ANSWERS;
```
4. Replace the rendered questions and answer labels with `QUESTIONS_DISPLAY` and `ANSWERS_DISPLAY`.

---

### TASK B11 — Book Appointment page in Arabic

**File: `src/app/[locale]/(store)/book-appointment/page.tsx`**

1. Read the current file.
2. Add Arabic variants for dropdowns and day labels:
```ts
const DEPARTMENTS_AR = ["قسم السمعيات", "علاج النطق", "العلاج الوظيفي", "تركيب أجهزة السمع"];
const SERVICES_AR = ["تقييم السمع", "تقييم النطق", "متابعة زراعة القوقعة", "علاج الطنين", "تقييم التوازن"];
const DAYS_OF_WEEK_AR = ["أح", "إث", "ثل", "أر", "خم", "جم", "سب"];

const DEPARTMENTS_DISPLAY = locale === "ar" ? DEPARTMENTS_AR : DEPARTMENTS;
const SERVICES_DISPLAY = locale === "ar" ? SERVICES_AR : SERVICES;
const DAYS_DISPLAY = locale === "ar" ? DAYS_OF_WEEK_AR : DAYS_OF_WEEK;
```
3. Replace all rendered department/service/day references with the `_DISPLAY` variants.
4. No layout or logic changes.

---

### TASK B12 — Add missing keys to messages/ar.json

**File: `messages/ar.json`**

1. Read the current file.
2. Merge the following keys into the root JSON object (do not overwrite existing keys):

```json
{
  "about": {
    "statsPatients": "مريض تمت معالجته",
    "statsYears": "سنوات خبرة",
    "statsSpecialists": "متخصص معتمد",
    "statsSatisfaction": "نسبة رضا المرضى"
  },
  "evaluation": {
    "heading": "تقييم السمع",
    "subtext": "أجب على الأسئلة التالية للحصول على تقييم مبدئي لسمعك",
    "never": "أبداً",
    "rarely": "نادراً",
    "sometimes": "أحياناً",
    "often": "غالباً",
    "always": "دائماً",
    "submit": "احصل على نتيجتك",
    "resultNormal": "سمعك طبيعي",
    "resultMild": "قد يكون لديك صعوبة طفيفة في السمع",
    "resultModerate": "يُنصح بإجراء تقييم سمعي متخصص",
    "resultSevere": "يُنصح بزيارة عاجلة لأخصائي السمع",
    "bookNow": "احجز تقييماً الآن"
  },
  "bookAppointment": {
    "heading": "احجز موعداً",
    "selectDepartment": "اختر القسم",
    "selectService": "اختر الخدمة",
    "selectDoctor": "اختر الطبيب",
    "firstName": "الاسم الأول",
    "lastName": "اسم العائلة",
    "phone": "رقم الهاتف",
    "notes": "ملاحظات إضافية",
    "morning": "الصباح",
    "afternoon": "بعد الظهر",
    "confirm": "تأكيد الحجز",
    "confirmed": "تم تأكيد موعدك!",
    "back": "رجوع",
    "next": "التالي"
  },
  "cart": {
    "heading": "سلة التسوق",
    "empty": "سلتك فارغة",
    "continueShopping": "متابعة التسوق",
    "total": "المجموع",
    "checkout": "إتمام الشراء",
    "remove": "إزالة",
    "quantity": "الكمية"
  },
  "checkout": {
    "heading": "إتمام الشراء",
    "orderSummary": "ملخص الطلب",
    "placeOrder": "تأكيد الطلب",
    "success": "تم تأكيد طلبك!"
  }
}
```

**File: `messages/en.json`**

Also add matching English keys (read file first, merge — do not overwrite):
```json
{
  "about": {
    "statsPatients": "Patients Treated",
    "statsYears": "Years Experience",
    "statsSpecialists": "Certified Specialists",
    "statsSatisfaction": "Patient Satisfaction"
  },
  "evaluation": {
    "heading": "Hearing Evaluation",
    "subtext": "Answer the following questions for a preliminary hearing assessment",
    "never": "Never",
    "rarely": "Rarely",
    "sometimes": "Sometimes",
    "often": "Often",
    "always": "Always",
    "submit": "Get My Result",
    "resultNormal": "Your hearing appears normal",
    "resultMild": "You may have mild hearing difficulty",
    "resultModerate": "A specialist hearing evaluation is recommended",
    "resultSevere": "An urgent visit to a hearing specialist is recommended",
    "bookNow": "Book an Evaluation"
  },
  "bookAppointment": {
    "heading": "Book an Appointment",
    "selectDepartment": "Select Department",
    "selectService": "Select Service",
    "selectDoctor": "Select Doctor",
    "firstName": "First Name",
    "lastName": "Last Name",
    "phone": "Phone Number",
    "notes": "Additional Notes",
    "morning": "Morning",
    "afternoon": "Afternoon",
    "confirm": "Confirm Booking",
    "confirmed": "Your appointment is confirmed!",
    "back": "Back",
    "next": "Next"
  },
  "cart": {
    "heading": "Shopping Cart",
    "empty": "Your cart is empty",
    "continueShopping": "Continue Shopping",
    "total": "Total",
    "checkout": "Checkout",
    "remove": "Remove",
    "quantity": "Quantity"
  },
  "checkout": {
    "heading": "Checkout",
    "orderSummary": "Order Summary",
    "placeOrder": "Place Order",
    "success": "Your order is confirmed!"
  }
}
```

---

## ═══════════════════════════════════
## VALIDATION
## ═══════════════════════════════════

Run in order:

```bash
npx prisma generate
npm run typecheck
npm run lint
npm run build
```

**Expected:** 0 TypeScript errors, 0 lint errors, build succeeds.

---

## MANUAL SPOT-CHECKS after build

Start dev server and verify these routes:

| Route | Expected |
|-------|----------|
| `/ar/team` | Doctor names in Arabic (د. أحمد الرشيدي...) |
| `/en/team` | Doctor names in English (Dr. Ahmad...) |
| `/ar/blog` | Blog titles in Arabic |
| `/en/blog` | Blog titles in English |
| `/ar/services` | Service titles + descriptions in Arabic |
| `/ar/about` | Mission/vision/stats in Arabic |
| `/ar/contact` | Subject dropdown options in Arabic |
| `/ar/evaluation` | Questions in Arabic, answer labels in Arabic |
| `/ar/book-appointment` | Department/service dropdowns in Arabic |
| `/ar/shop` | Product names in Arabic |
| `/en/shop` | Product names in English |
| Admin (`/admin/...`) | English only, LTR — unchanged |

---

## SUMMARY OF FILES CHANGED

**Part A (PostgreSQL switch):**
- `prisma/schema.prisma` — provider sqlite → postgresql

**Part B (Arabic content):**
- `src/data/team.ts` — bilingual Doctor type + getDoctorLocale helper
- `src/data/blog.ts` — bilingual BlogPost type + getPostLocale helper
- `src/data/products.ts` — namesAr array + nameAr/descriptionAr fields
- `src/types/index.ts` (or wherever Product type lives) — nameAr?, descriptionAr? optional fields
- `src/components/store/team-card.tsx` — locale prop
- `src/app/[locale]/(store)/team/page.tsx` — pass locale to TeamCard
- `src/app/[locale]/(store)/blog/page.tsx` — apply getPostLocale
- `src/app/[locale]/(store)/blog/blog-list-client.tsx` — locale-aware rendering
- `src/app/[locale]/(store)/blog/[slug]/page.tsx` — apply getPostLocale
- `src/app/[locale]/(store)/about/page.tsx` — CONTENT bilingual object
- `src/app/[locale]/(store)/services/page.tsx` — SERVICES_AR array
- `src/app/[locale]/(store)/contact/page.tsx` — SUBJECTS_AR/EN
- `src/app/[locale]/(store)/evaluation/page.tsx` — QUESTIONS_AR + ANSWERS_AR
- `src/app/[locale]/(store)/book-appointment/page.tsx` — DEPARTMENTS_AR, SERVICES_AR, DAYS_AR
- `src/app/[locale]/(store)/shop/page.tsx` — display Arabic product names
- `messages/ar.json` — merge evaluation/bookAppointment/cart/checkout/about keys
- `messages/en.json` — merge matching English keys
