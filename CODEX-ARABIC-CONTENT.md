# Codex Prompt — Full Arabic Content Translation
**Project:** D:\Projects\Medical
**Goal:** Translate all remaining page body content, mock data, and static text to Arabic.
**Already done:** UI labels, nav, buttons, homepage sections (in messages/ar.json)
**This prompt:** page bodies, data files, form options, about/services/team content

---

## RULES
- Do NOT delete files
- Do NOT run git reset / git clean / push / deploy
- Do NOT edit .env files
- Make minimal changes — only content/text, no logic changes
- After all changes: `npm run typecheck && npm run lint && npm run build`

---

## APPROACH — Locale-aware data pattern

For data files (team, blog, products), use a locale-aware helper rather than duplicating the entire array.
The locale comes from the URL segment `[locale]` in the page.

---

## TASK 1 — Create bilingual team data

**File: `src/data/team.ts`**

Replace the existing file content with a bilingual version:

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

// Helper: get locale-aware fields
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

## TASK 2 — Update TeamCard to accept locale

**File: `src/components/store/team-card.tsx`**

Update the component to use `nameAr`/`titleAr` based on locale:

```tsx
// Add to props:
type TeamCardProps = {
  doctor: Doctor;
  locale?: string;
};

export function TeamCard({ doctor, locale = "en" }: TeamCardProps) {
  const displayName = locale === "ar" ? doctor.nameAr : doctor.name;
  const displayTitle = locale === "ar" ? doctor.titleAr : doctor.title;
  // Replace doctor.name → displayName, doctor.title → displayTitle
  // Keep all other code unchanged
}
```

---

## TASK 3 — Update Team page to pass locale

**File: `src/app/[locale]/(store)/team/page.tsx`**

```tsx
export default function TeamPage({ params: { locale } }: { params: { locale: string } }) {
  // Pass locale to TeamCard
  return (
    // ...
    {doctors.map((doctor) => (
      <TeamCard key={doctor.slug} doctor={doctor} locale={locale} />
    ))}
  );
}
```

---

## TASK 4 — Create bilingual blog data

**File: `src/data/blog.ts`**

Add Arabic fields to each post. Keep existing English fields. Add `titleAr`, `excerptAr`, `categoryAr`, `contentAr`:

```ts
export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  titleAr: string;
  excerpt: string;
  excerptAr: string;
  date: string;
  category: string;
  categoryAr: string;
  readTime: string;
  content: string[];
  contentAr: string[];
};

// Post 1:
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

// Post 2:
titleAr: "كيف تقرأ جهاز قياس ضغط الدم بشكل صحيح",
excerptAr: "دليل سريع للقراءات الدقيقة.",
categoryAr: "الأجهزة",
contentAr: [
  "أرقام ضغط الدم يمكن أن تتفاوت أكثر مما يتوقع الناس، خاصةً عندما يكون الجسم متوتراً أو متعجلاً. القراءة المفيدة تبدأ بالإعداد الصحيح: اجلس بشكل مريح، وارتح لبضع دقائق.",
  "قراءة واحدة نادراً ما تحكي القصة الكاملة. ابحث عن الأنماط عبر عدة أيام في أوقات مشابهة بدلاً من الاستجابة لرقم واحد.",
  "أجهزة المنزل مفيدة لأنها تلتقط الأنماط اليومية خارج العيادة. الاحتفاظ بسجل قصير للقراءات والأعراض يجعل المواعيد أكثر إنتاجية.",
  "إذا ظلت القراءات مرتفعة باستمرار، فالخطوة التالية هي فحص معايرة سريع ومحادثة مع متخصص."
],

// Post 3:
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

Add similar `titleAr`, `excerptAr`, `categoryAr`, `contentAr` for posts 4-6 if they exist, following the same pattern.

Also add helper function at the bottom of blog.ts:
```ts
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

## TASK 5 — Update Blog listing page to use locale

**File: `src/app/[locale]/(store)/blog/page.tsx`**

```tsx
import { getPostLocale } from "@/data/blog";

export default function BlogPage({ params: { locale } }: { params: { locale: string } }) {
  const localePosts = posts.map(p => getPostLocale(p, locale));
  // Use localePosts instead of posts
  // Pass localePosts to BlogCard and blog-list-client
}
```

**File: `src/app/[locale]/(store)/blog/blog-list-client.tsx`**
- Accept locale prop, apply `getPostLocale` before rendering

**File: `src/app/[locale]/(store)/blog/[slug]/page.tsx`**
- Apply `getPostLocale(post, locale)` before rendering post content

---

## TASK 6 — Update About page body text

**File: `src/app/[locale]/(store)/about/page.tsx`**

Add locale prop and switch body content:

```tsx
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
};
```

---

## TASK 7 — Update Services page body text

**File: `src/app/[locale]/(store)/services/page.tsx`**

Add Arabic service descriptions:

```tsx
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

// In the component, use:
const locale = params.locale;
const SERVICES_DISPLAY = locale === "ar" ? SERVICES_AR : SERVICES_EN;
```

---

## TASK 8 — Update product data names (Arabic)

**File: `src/data/products.ts`**

Add Arabic names array and bilingual description generator:

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

// Update the products array to include nameAr:
export const products: Product[] = names.map((name, i) => ({
  ...existing,
  nameAr: namesAr[i] || name,
  descriptionAr: `${namesAr[i] || name} من ${brands[i % brands.length]}. جودة طبية موثوقة.`,
}));

// Add to Product type in types.ts:
// nameAr?: string;
// descriptionAr?: string;
```

**File: `src/types/index.ts` or `src/types.ts`** — add optional fields:
```ts
export type Product = {
  // ... existing fields
  nameAr?: string;
  descriptionAr?: string;
};
```

Then in shop/product pages, use:
```ts
const displayName = locale === "ar" && product.nameAr ? product.nameAr : product.name;
const displayDesc = locale === "ar" && product.descriptionAr ? product.descriptionAr : product.description;
```

---

## TASK 9 — Update Contact page form options in Arabic

**File: `src/app/[locale]/(store)/contact/page.tsx`**

```tsx
const SUBJECTS_AR = ["استفسار عام", "حجز موعد", "استفسار عن منتج", "شكوى", "شراكة", "أخرى"];
const SUBJECTS_EN = ["General Inquiry", "Book Appointment", "Product Inquiry", "Complaint", "Partnership", "Other"];

// In component:
const SUBJECTS = locale === "ar" ? SUBJECTS_AR : SUBJECTS_EN;
```

---

## TASK 10 — Update Evaluation page questions in Arabic

**File: `src/app/[locale]/(store)/evaluation/page.tsx`**

```tsx
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

const locale = params.locale;
const QUESTIONS_DISPLAY = locale === "ar" ? QUESTIONS_AR : QUESTIONS;
```

---

## TASK 11 — Update Book Appointment page in Arabic

**File: `src/app/[locale]/(store)/book-appointment/page.tsx`**

```tsx
const DEPARTMENTS_AR = ["قسم السمعيات", "علاج النطق", "العلاج الوظيفي", "تركيب أجهزة السمع"];
const SERVICES_AR = ["تقييم السمع", "تقييم النطق", "متابعة زراعة القوقعة", "علاج الطنين", "تقييم التوازن"];

const DAYS_OF_WEEK_AR = ["أح", "إث", "ثل", "أر", "خم", "جم", "سب"];

const locale = params.locale;
const DEPARTMENTS_DISPLAY = locale === "ar" ? DEPARTMENTS_AR : DEPARTMENTS;
const SERVICES_DISPLAY = locale === "ar" ? SERVICES_AR : SERVICES;
const DAYS_DISPLAY = locale === "ar" ? DAYS_OF_WEEK_AR : DAYS_OF_WEEK;
```

---

## TASK 12 — Update messages/ar.json with missing keys

Add to `messages/ar.json`:
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

---

## VALIDATION

```bash
npm run typecheck
npm run lint
npm run build
```

Expected: 0 errors, build passes with Arabic content on all pages.

Check manually:
- `/ar/team` → doctor names in Arabic
- `/ar/blog` → blog titles in Arabic
- `/ar/services` → service descriptions in Arabic
- `/ar/contact` → form options in Arabic
- `/ar/evaluation` → questions in Arabic
- `/en/team` → doctor names in English (unchanged)
