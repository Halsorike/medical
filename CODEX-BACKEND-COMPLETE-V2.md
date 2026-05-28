# CODEX MASTER PROMPT — Backend Complete v2.0
## Jordan Hearing & Speech Therapy — من 53% إلى 90%+

**المشروع:** `D:\Projects\Medical`
**الهدف:** backend حقيقي + APIs كاملة + GitHub release v2.0.0
**الحالة الحالية:** Frontend ~80% ✅ | Admin ~30% mock data ❌

---

## RULES — اقرأها أولاً قبل أي سطر كود

```
✅ افحص الكود الموجود قبل الكتابة — لا تفترض
✅ استخدم نفس patterns الموجودة في المشروع (Next.js 14 App Router، Prisma، Zod)
✅ كل API تتبع نفس format الموجود: { data, message, success }
✅ كل ملف جديد يمر بـ: npm run typecheck && npm run lint
✅ commit بعد كل مرحلة — لا تجمع كل شيء في commit واحد

❌ لا تحذف أي ملفات أو folders
❌ لا تعدّل .env أو .env.local
❌ لا تشغّل git reset أو git clean أو git push --force
❌ لا تشغّل npm audit fix --force
❌ لا ترفع أو تنشر على Vercel
❌ لا تكسر الـ build — تحقق بعد كل مرحلة
```

---

## PHASE 0 — Environment Check (قبل أي تغيير)

```bash
# 1. تحقق من البيئة
node --version          # يجب >= 18
npm --version
npx prisma --version

# 2. تأكد من عدم وجود أخطاء حالية
npm run typecheck
npm run lint
npm run build

# 3. افحص الـ schema الحالي
cat prisma/schema.prisma

# 4. افحص الـ API routes الموجودة
find src/app/api -name "route.ts" | sort

# 5. افحص mock data files
ls src/data/

# 6. إنشاء feature branch
git checkout -b feature/backend-complete-v2
git status
```

**معيار القبول للـ Phase 0:**
- [ ] `npm run build` يمر بدون أخطاء
- [ ] Branch `feature/backend-complete-v2` موجود
- [ ] فهم كامل للـ models الموجودة والمفقودة

---

## PHASE 1 — Prisma Schema Expansion

### 1A — اقرأ الـ schema الحالي أولاً

افتح `prisma/schema.prisma` وتأكد من الـ models الموجودة:
- Product, Order, Customer, Appointment, Evaluation, BlogPost, CartItem ✅

### 1B — أضف الـ models المفقودة

**أضف في نهاية `prisma/schema.prisma`:**

```prisma
// ══════════════════════════════════════════
// CLINIC MODELS — مضافة في v2.0
// ══════════════════════════════════════════

model Patient {
  id             String       @id @default(cuid())
  name           String
  nameAr         String?
  email          String       @unique
  phone          String
  dateOfBirth    DateTime?
  gender         String?      // male, female
  address        String?
  medicalHistory String?
  notes          String?
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  appointments   Appointment[]
  evaluations    Evaluation[]
}

model Doctor {
  id             String      @id @default(cuid())
  name           String
  nameAr         String?
  title          String
  titleAr        String?
  email          String      @unique
  phone          String
  bio            String?
  bioAr          String?
  specialization String
  experience     Int?
  qualification  String?
  image          String?
  slug           String      @unique
  departmentId   String?
  status         String      @default("active")
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt

  department     Department? @relation(fields: [departmentId], references: [id])
  schedules      Schedule[]
}

model Department {
  id          String    @id @default(cuid())
  name        String    @unique
  nameAr      String?
  description String?
  descriptionAr String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  doctors     Doctor[]
  services    Service[]
}

model Service {
  id           String     @id @default(cuid())
  name         String
  nameAr       String?
  description  String?
  descriptionAr String?
  price        Float?
  duration     Int?       // دقائق
  departmentId String
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  department   Department @relation(fields: [departmentId], references: [id])
}

model Schedule {
  id         String   @id @default(cuid())
  doctorId   String
  dayOfWeek  String   // Sunday, Monday, Tuesday, ...
  startTime  String   // HH:mm
  endTime    String   // HH:mm
  maxSlots   Int      @default(10)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  doctor     Doctor   @relation(fields: [doctorId], references: [id])
}

model Holiday {
  id          String   @id @default(cuid())
  name        String
  nameAr      String?
  date        DateTime
  description String?
  recurring   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model ContactMessage {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String?
  subject   String?
  message   String
  status    String   @default("new") // new, read, replied
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model BlogCategory {
  id          String     @id @default(cuid())
  name        String     @unique
  nameAr      String?
  slug        String     @unique
  description String?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  posts       BlogPost[]
}

model Role {
  id          String   @id @default(cuid())
  name        String   @unique // admin, doctor, staff
  nameAr      String?
  permissions String   // JSON: ["appointments:read", "patients:write", ...]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model SiteSetting {
  id        String   @id @default(cuid())
  key       String   @unique // "clinic.name", "hero.title.ar", etc.
  value     String
  updatedAt DateTime @updatedAt
}
```

**أيضاً — عدّل `BlogPost` لإضافة relation مع `BlogCategory`:**

```prisma
// في model BlogPost الموجود، أضف:
  categoryId   String?
  blogCategory BlogCategory? @relation(fields: [categoryId], references: [id])
```

**أيضاً — عدّل `Appointment` لإضافة Patient relation:**

```prisma
// في model Appointment الموجود، أضف:
  patientId  String?
  patient    Patient? @relation(fields: [patientId], references: [id])
```

**أيضاً — عدّل `Evaluation` لإضافة Patient relation:**

```prisma
// في model Evaluation الموجود، أضف:
  patientId  String?
  patient    Patient? @relation(fields: [patientId], references: [id])
```

### 1C — Migration

```bash
npx prisma migrate dev --name add_clinic_models
npx prisma generate
```

**إذا فشل migrate dev (PostgreSQL غير شغّال محلياً):**
```bash
# Fallback: استخدم db push
npx prisma db push
npx prisma generate
```

### 1D — Seed data للاختبار

**افتح `prisma/seed.ts` أو أنشئه إذا ما كان موجوداً:**

```ts
// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  // Departments
  const audiology = await db.department.upsert({
    where: { name: "Audiology" },
    update: {},
    create: { name: "Audiology", nameAr: "قسم السمعيات", description: "Hearing evaluation and treatment" },
  });
  const speechDept = await db.department.upsert({
    where: { name: "Speech Therapy" },
    update: {},
    create: { name: "Speech Therapy", nameAr: "علاج النطق", description: "Speech and language therapy" },
  });
  const otDept = await db.department.upsert({
    where: { name: "Occupational Therapy" },
    update: {},
    create: { name: "Occupational Therapy", nameAr: "العلاج الوظيفي", description: "Daily living skills therapy" },
  });

  // Services
  await db.service.createMany({
    skipDuplicates: true,
    data: [
      { name: "Hearing Evaluation", nameAr: "تقييم السمع", price: 80, duration: 60, departmentId: audiology.id },
      { name: "Hearing Aid Fitting", nameAr: "تركيب جهاز السمع", price: 150, duration: 90, departmentId: audiology.id },
      { name: "Speech Assessment", nameAr: "تقييم النطق", price: 70, duration: 60, departmentId: speechDept.id },
      { name: "Speech Therapy Session", nameAr: "جلسة علاج نطق", price: 60, duration: 45, departmentId: speechDept.id },
      { name: "OT Assessment", nameAr: "تقييم وظيفي", price: 70, duration: 60, departmentId: otDept.id },
      { name: "OT Session", nameAr: "جلسة علاج وظيفي", price: 55, duration: 45, departmentId: otDept.id },
    ],
  });

  // Doctors
  const doctor1 = await db.doctor.upsert({
    where: { slug: "ahmad-al-rashidi" },
    update: {},
    create: {
      name: "Dr. Ahmad Al-Rashidi", nameAr: "د. أحمد الرشيدي",
      title: "Hearing Specialist", titleAr: "أخصائي سمعيات",
      email: "ahmad@jordanhearing.com", phone: "+962791000001",
      slug: "ahmad-al-rashidi", specialization: "Audiology",
      experience: 12, departmentId: audiology.id,
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=360&h=450&fit=crop",
    },
  });

  // Patients (sample)
  const patient1 = await db.patient.upsert({
    where: { email: "ahmad.khalil@example.com" },
    update: {},
    create: {
      name: "Ahmad Khalil", email: "ahmad.khalil@example.com",
      phone: "+962791111111", gender: "male",
    },
  });

  // Roles
  await db.role.createMany({
    skipDuplicates: true,
    data: [
      { name: "admin", nameAr: "مدير", permissions: JSON.stringify(["*"]) },
      { name: "doctor", nameAr: "طبيب", permissions: JSON.stringify(["appointments:read", "patients:read", "schedule:read"]) },
      { name: "staff", nameAr: "موظف", permissions: JSON.stringify(["appointments:read", "appointments:write"]) },
    ],
  });

  // Blog Categories
  await db.blogCategory.createMany({
    skipDuplicates: true,
    data: [
      { name: "Hearing Health", nameAr: "صحة السمع", slug: "hearing-health" },
      { name: "Speech Tips", nameAr: "نصائح النطق", slug: "speech-tips" },
      { name: "Occupational Therapy", nameAr: "العلاج الوظيفي", slug: "occupational-therapy" },
      { name: "Child Development", nameAr: "تطور الطفل", slug: "child-development" },
    ],
  });

  // Holidays
  await db.holiday.createMany({
    skipDuplicates: true,
    data: [
      { name: "Eid Al-Fitr", nameAr: "عيد الفطر", date: new Date("2025-03-30") },
      { name: "Eid Al-Adha", nameAr: "عيد الأضحى", date: new Date("2025-06-06") },
      { name: "Independence Day", nameAr: "يوم الاستقلال", date: new Date("2025-05-25") },
    ],
  });

  // Site Settings (defaults)
  const settings = [
    { key: "clinic.name.en", value: "Jordan Hearing & Speech Therapy" },
    { key: "clinic.name.ar", value: "المركز الأردني للسمع والنطق والعلاج الوظيفي" },
    { key: "clinic.phone", value: "+962 6 123 4567" },
    { key: "clinic.email", value: "info@jordanhearing.com" },
    { key: "clinic.address.en", value: "123 Mecca Street, Amman, Jordan" },
    { key: "clinic.address.ar", value: "شارع مكة المكرمة ١٢٣، عمان، الأردن" },
    { key: "hero.title.en", value: "Hear Better, Speak Clearly, Live Fully" },
    { key: "hero.title.ar", value: "اسمع أفضل، تكلم بوضوح، عش بامتلاء" },
    { key: "hero.subtitle.en", value: "Specialist hearing, speech, and occupational therapy in Amman" },
    { key: "hero.subtitle.ar", value: "رعاية سمعية ونطقية ووظيفية متخصصة في عمان" },
    { key: "social.facebook", value: "https://facebook.com/jordanhearing" },
    { key: "social.instagram", value: "https://instagram.com/jordanhearing" },
    { key: "social.twitter", value: "https://twitter.com/jordanhearing" },
    { key: "working_hours", value: "Sun-Thu 8AM-6PM" },
  ];
  for (const s of settings) {
    await db.siteSetting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s });
  }

  console.log("✅ Seed complete");
}

main().catch(console.error).finally(() => db.$disconnect());
```

**تشغيل الـ seed:**
```bash
npx prisma db seed
```

**إضافة في `package.json` إذا ما موجودة:**
```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

### 1E — Commit

```bash
npm run typecheck
npm run build
git add prisma/ package.json
git commit -m "feat(schema): add 10 missing models — Patient, Doctor, Department, Service, Schedule, Holiday, ContactMessage, BlogCategory, Role, SiteSetting"
git push origin feature/backend-complete-v2
```

---

## PHASE 2 — CRUD APIs (9 endpoints)

**Pattern مرجعي:** اقرأ `src/app/api/appointments/route.ts` أولاً — اتبع نفس الـ structure بالضبط.

**الـ pattern المطلوب لكل route.ts:**
```ts
import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

// GET — قائمة مع pagination
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const q = searchParams.get("q") ?? "";
  const skip = (page - 1) * limit;
  // ... query
}

// POST — إضافة
export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  // ... create
}
```

### API 1 — Patients

**`src/app/api/patients/route.ts`**
```ts
import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const schema = z.object({
  name:          z.string().min(2),
  email:         z.string().email(),
  phone:         z.string().min(7),
  dateOfBirth:   z.string().optional(),
  gender:        z.enum(["male", "female"]).optional(),
  address:       z.string().optional(),
  medicalHistory: z.string().optional(),
  notes:         z.string().optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page  = Math.max(1, parseInt(searchParams.get("page")  ?? "1"));
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20"));
  const q     = searchParams.get("q") ?? "";
  const skip  = (page - 1) * limit;

  const where = q
    ? { OR: [{ name: { contains: q } }, { email: { contains: q } }, { phone: { contains: q } }] }
    : {};

  const [total, patients] = await Promise.all([
    db.patient.count({ where }),
    db.patient.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
  ]);

  return ok({ patients, total, page, limit, pages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  const body = await request.json() as unknown;
  const parsed = schema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  const patient = await db.patient.create({ data: parsed.data });
  return ok(patient, 201);
}
```

**`src/app/api/patients/[id]/route.ts`**
```ts
import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ok, notFound, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const schema = z.object({
  name:          z.string().min(2).optional(),
  email:         z.string().email().optional(),
  phone:         z.string().min(7).optional(),
  dateOfBirth:   z.string().optional(),
  gender:        z.enum(["male", "female"]).optional(),
  address:       z.string().optional(),
  medicalHistory: z.string().optional(),
  notes:         z.string().optional(),
});

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const patient = await db.patient.findUnique({
    where: { id: params.id },
    include: { appointments: { take: 10, orderBy: { createdAt: "desc" } }, evaluations: { take: 5, orderBy: { createdAt: "desc" } } },
  });
  if (!patient) return notFound("Patient");
  return ok(patient);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json() as unknown;
  const parsed = schema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  const patient = await db.patient.update({ where: { id: params.id }, data: parsed.data });
  return ok(patient);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await db.patient.delete({ where: { id: params.id } });
  return ok({ deleted: true });
}
```

### API 2 — Doctors

**`src/app/api/doctors/route.ts`**
```ts
import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const schema = z.object({
  name:           z.string().min(2),
  nameAr:         z.string().optional(),
  title:          z.string().min(2),
  titleAr:        z.string().optional(),
  email:          z.string().email(),
  phone:          z.string().min(7),
  specialization: z.string().min(2),
  bio:            z.string().optional(),
  bioAr:          z.string().optional(),
  experience:     z.number().int().optional(),
  qualification:  z.string().optional(),
  image:          z.string().url().optional(),
  slug:           z.string().min(2),
  departmentId:   z.string().optional(),
  status:         z.enum(["active", "inactive"]).default("active"),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const where = q ? { OR: [{ name: { contains: q } }, { specialization: { contains: q } }] } : {};
  const doctors = await db.doctor.findMany({ where, include: { department: true }, orderBy: { name: "asc" } });
  return ok(doctors);
}

export async function POST(request: NextRequest) {
  const body = await request.json() as unknown;
  const parsed = schema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  const doctor = await db.doctor.create({ data: parsed.data });
  return ok(doctor, 201);
}
```

**`src/app/api/doctors/[id]/route.ts`** — نفس pattern الـ patients/[id] مع schema الـ doctor.

### API 3 — Departments

**`src/app/api/departments/route.ts`**
```ts
import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const schema = z.object({
  name:          z.string().min(2),
  nameAr:        z.string().optional(),
  description:   z.string().optional(),
  descriptionAr: z.string().optional(),
});

export async function GET() {
  const departments = await db.department.findMany({
    include: { _count: { select: { doctors: true, services: true } } },
    orderBy: { name: "asc" },
  });
  return ok(departments);
}

export async function POST(request: NextRequest) {
  const body = await request.json() as unknown;
  const parsed = schema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  const dept = await db.department.create({ data: parsed.data });
  return ok(dept, 201);
}
```

**`src/app/api/departments/[id]/route.ts`** — PUT + DELETE.

### API 4 — Services

**`src/app/api/services/route.ts`**
```ts
import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const schema = z.object({
  name:          z.string().min(2),
  nameAr:        z.string().optional(),
  description:   z.string().optional(),
  descriptionAr: z.string().optional(),
  price:         z.number().positive().optional(),
  duration:      z.number().int().positive().optional(),
  departmentId:  z.string().min(1),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const departmentId = searchParams.get("departmentId");
  const where = departmentId ? { departmentId } : {};
  const services = await db.service.findMany({ where, include: { department: true }, orderBy: { name: "asc" } });
  return ok(services);
}

export async function POST(request: NextRequest) {
  const body = await request.json() as unknown;
  const parsed = schema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  const service = await db.service.create({ data: parsed.data });
  return ok(service, 201);
}
```

### API 5 — Schedule

**`src/app/api/schedule/route.ts`**
```ts
import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"] as const;

const schema = z.object({
  doctorId:  z.string().min(1),
  dayOfWeek: z.enum(DAYS),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime:   z.string().regex(/^\d{2}:\d{2}$/),
  maxSlots:  z.number().int().min(1).max(50).default(10),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get("doctorId");
  const where = doctorId ? { doctorId } : {};
  const schedules = await db.schedule.findMany({ where, include: { doctor: true }, orderBy: { dayOfWeek: "asc" } });
  return ok(schedules);
}

export async function POST(request: NextRequest) {
  const body = await request.json() as unknown;
  const parsed = schema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  const schedule = await db.schedule.create({ data: parsed.data });
  return ok(schedule, 201);
}
```

### API 6 — Holidays

**`src/app/api/holidays/route.ts`**
```ts
import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const schema = z.object({
  name:      z.string().min(2),
  nameAr:    z.string().optional(),
  date:      z.string().datetime(),
  description: z.string().optional(),
  recurring: z.boolean().default(false),
});

export async function GET() {
  const holidays = await db.holiday.findMany({ orderBy: { date: "asc" } });
  return ok(holidays);
}

export async function POST(request: NextRequest) {
  const body = await request.json() as unknown;
  const parsed = schema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  const holiday = await db.holiday.create({ data: { ...parsed.data, date: new Date(parsed.data.date) } });
  return ok(holiday, 201);
}
```

### API 7 — Contact Messages

**`src/app/api/contact-messages/route.ts`**

> **ملاحظة:** فحص `src/app/api/contact/route.ts` — إذا موجود، أضف قراءة وتحديث فقط، لا تكرر POST.

```ts
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok } from "@/lib/api";

export const dynamic = "force-dynamic";

// GET — admin inbox
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status"); // new, read, replied
  const where = status ? { status } : {};
  const [total, messages] = await Promise.all([
    db.contactMessage.count({ where }),
    db.contactMessage.findMany({ where, orderBy: { createdAt: "desc" }, take: 50 }),
  ]);
  return ok({ messages, total });
}
```

**`src/app/api/contact-messages/[id]/route.ts`**
```ts
// PUT — تغيير الحالة (new → read → replied)
// DELETE — حذف
```

**`src/app/api/contact/route.ts`** — إذا موجود، أضف حفظ في DB:
```ts
// في POST handler الموجود، أضف:
await db.contactMessage.create({
  data: { name: body.name, email: body.email, phone: body.phone, subject: body.subject, message: body.message },
});
```

### API 8 — Blog Categories

**`src/app/api/blog-categories/route.ts`**
```ts
import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const schema = z.object({
  name:        z.string().min(2),
  nameAr:      z.string().optional(),
  slug:        z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
});

export async function GET() {
  const categories = await db.blogCategory.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });
  return ok(categories);
}

export async function POST(request: NextRequest) {
  const body = await request.json() as unknown;
  const parsed = schema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  const cat = await db.blogCategory.create({ data: parsed.data });
  return ok(cat, 201);
}
```

### API 9 — Website Settings

**`src/app/api/website-settings/route.ts`**
```ts
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok } from "@/lib/api";

export const dynamic = "force-dynamic";

// GET — جلب كل الإعدادات كـ object
export async function GET() {
  const settings = await db.siteSetting.findMany();
  const obj = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  return ok(obj);
}
```

**`src/app/api/website-settings/[key]/route.ts`**
```ts
import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const schema = z.object({ value: z.string() });

export async function PUT(request: NextRequest, { params }: { params: { key: string } }) {
  const body = await request.json() as unknown;
  const parsed = schema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  const setting = await db.siteSetting.upsert({
    where: { key: params.key },
    update: { value: parsed.data.value },
    create:  { key: params.key, value: parsed.data.value },
  });
  return ok(setting);
}
```

### فحص `src/lib/api.ts` — أضف helper functions إذا مفقودة:

```ts
// أضف إذا notFound غير موجودة:
export function notFound(entity = "Resource") {
  return Response.json({ success: false, message: `${entity} not found` }, { status: 404 });
}
```

### Phase 2 Commit:

```bash
npm run typecheck
npm run lint
npm run build
git add src/app/api/
git commit -m "feat(api): add 9 CRUD APIs — patients, doctors, departments, services, schedule, holidays, contact-messages, blog-categories, website-settings"
git push origin feature/backend-complete-v2
```

---

## PHASE 3 — Replace Mock Data in Admin Pages

**الأولوية بالترتيب:**

### 3A — Dashboard (أرقام حقيقية)

**`src/app/admin/page.tsx`**

اقرأ الملف أولاً. ابحث عن hardcoded numbers مثل `1284` أو `23`.

استبدل بـ server-side fetch من DB:

```ts
// أضف في top of component (server component) أو useEffect (client):
const [patients, appointments, evaluations] = await Promise.all([
  db.patient.count(),
  db.appointment.count(),
  db.evaluation.count(),
]);
// أو إذا client component:
const [stats, setStats] = useState({ patients: 0, appointments: 0, evaluations: 0 });
useEffect(() => {
  fetch("/api/dashboard-stats").then(r => r.json()).then(d => setStats(d.data));
}, []);
```

**أنشئ `src/app/api/dashboard-stats/route.ts`:**
```ts
import { db } from "@/lib/db";
import { ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const [patients, appointments, evaluations, pendingAppointments] = await Promise.all([
    db.patient.count(),
    db.appointment.count(),
    db.evaluation.count(),
    db.appointment.count({ where: { status: "pending" } }),
  ]);
  return ok({ patients, appointments, evaluations, pendingAppointments });
}
```

### 3B — Admin Pages — Pattern بديل عام

لكل صفحة تستخدم `import { X } from "@/data/clinic"`:

**القبل:**
```ts
import { patients } from "@/data/clinic";
// ...
const rows = patients.filter(...);
```

**البعد:**
```ts
const [rows, setRows]       = useState<Patient[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError]     = useState<string | null>(null);
const [total, setTotal]     = useState(0);
const [page, setPage]       = useState(1);

useEffect(() => {
  setLoading(true);
  fetch(`/api/patients?page=${page}&q=${q}`)
    .then((r) => r.ok ? r.json() : Promise.reject(r.statusText))
    .then((d: { data: { patients: Patient[]; total: number } }) => {
      setRows(d.data.patients);
      setTotal(d.data.total);
    })
    .catch((e) => setError(String(e)))
    .finally(() => setLoading(false));
}, [page, q]);
```

**أضف Loading + Empty + Error states:**
```tsx
if (loading) return <div className="py-12 text-center text-muted-foreground">جاري التحميل...</div>;
if (error)   return <div className="py-12 text-center text-red-500">خطأ: {error}</div>;
if (!rows.length) return <div className="py-12 text-center text-muted-foreground">لا توجد بيانات</div>;
```

### 3C — الصفحات المطلوب تحديثها (بالأولوية):

| # | الصفحة | API endpoint | أهمية |
|---|--------|-------------|-------|
| 1 | `admin/page.tsx` | `/api/dashboard-stats` | 🔴 |
| 2 | `admin/clinic/patients/page.tsx` | `/api/patients` | 🔴 |
| 3 | `admin/clinic/team/page.tsx` | `/api/doctors` | 🔴 |
| 4 | `admin/clinic/departments/page.tsx` | `/api/departments` | 🔴 |
| 5 | `admin/clinic/services/page.tsx` | `/api/services` | 🔴 |
| 6 | `admin/clinic/schedule/page.tsx` | `/api/schedule` | 🟠 |
| 7 | `admin/clinic/holidays/page.tsx` | `/api/holidays` | 🟠 |
| 8 | `admin/clinic/contact/page.tsx` | `/api/contact-messages` | 🟠 |
| 9 | `admin/clinic/blog-categories/page.tsx` | `/api/blog-categories` | 🟠 |
| 10 | `admin/clinic/accounting/page.tsx` | بيانات من orders + appointments | 🟡 |

**إضافة صفحات تفصيلية مفقودة:**
- `src/app/admin/clinic/patients/[id]/page.tsx` — عرض وتعديل ملف المريض
- `src/app/admin/clinic/team/[id]/page.tsx` — عرض وتعديل ملف الطبيب
- `src/app/admin/clinic/departments/[id]/page.tsx` — تعديل القسم

**Pattern لصفحة التفاصيل:**
```tsx
// admin/clinic/patients/[id]/page.tsx
export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const [patient, setPatient] = useState<Patient | null>(null);
  useEffect(() => {
    fetch(`/api/patients/${params.id}`).then(r => r.json()).then(d => setPatient(d.data));
  }, [params.id]);
  // عرض بيانات + مواعيد سابقة + تقييمات
}
```

### Phase 3 Commit:

```bash
npm run typecheck
npm run lint
npm run build
git add src/app/admin/
git commit -m "feat(admin): replace mock data with real API calls — 10 pages connected to DB"
git push origin feature/backend-complete-v2
```

---

## PHASE 4 — Website Setup (حفظ حقيقي)

**`src/app/admin/website-setup/page.tsx`**

اقرأ الملف الحالي. هيكله موجود (Tabs + Form). المطلوب:

**أ) تحميل البيانات عند الفتح:**
```ts
const [settings, setSettings] = useState<Record<string, string>>({});
useEffect(() => {
  fetch("/api/website-settings").then(r => r.json()).then(d => setSettings(d.data));
}, []);
```

**ب) ربط الـ inputs بالبيانات:**
```tsx
<Input
  value={settings["clinic.name.en"] ?? ""}
  onChange={(e) => setSettings(prev => ({ ...prev, "clinic.name.en": e.target.value }))}
/>
```

**ج) onSubmit يرسل PUT requests:**
```ts
async function handleSave(sectionKeys: string[]) {
  const updates = sectionKeys.map((key) =>
    fetch(`/api/website-settings/${key}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: settings[key] ?? "" }),
    })
  );
  await Promise.all(updates);
  toast.success("تم الحفظ بنجاح");
}
```

**معايير القبول:**
- [ ] بيانات العيادة تُحمّل من DB عند فتح الصفحة
- [ ] Update يرسل PUT request فعلاً
- [ ] Refresh يظهر البيانات المحفوظة
- [ ] اللغة (EN/AR) تحدد أي keys تُحفظ

### Phase 4 Commit:

```bash
npm run typecheck
npm run build
git add src/app/admin/website-setup/
git commit -m "feat(admin): website-setup now persists to DB via SiteSetting model"
git push origin feature/backend-complete-v2
```

---

## PHASE 5 — SEO Critical Fixes

**ملاحظة:** هذه إصلاحات تؤثر على الفهرسة وجودة الموقع. سريعة وأثرها كبير.

### Fix 1 — Homepage generateMetadata

**`src/app/[locale]/(store)/page.tsx`**

استبدل `export const metadata = {...}` بـ:

```ts
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isAr = locale === "ar";
  return {
    title: isAr ? "الرئيسية" : "Home",
    description: isAr
      ? "المركز الأردني للسمع والنطق والعلاج الوظيفي في عمان — تقييم سمعي، علاج نطق، وعلاج وظيفي للأطفال والبالغين."
      : "Jordan Hearing & Speech Therapy in Amman — hearing evaluations, speech therapy, and occupational therapy for all ages.",
    alternates: {
      canonical: `https://jordanhearing.com/${locale}`,
      languages: { ar: "https://jordanhearing.com/ar", en: "https://jordanhearing.com/en" },
    },
    openGraph: {
      title: isAr ? "المركز الأردني للسمع والنطق" : "Jordan Hearing & Speech Therapy",
      description: isAr ? "رعاية متخصصة في عمان، الأردن." : "Specialist care in Amman, Jordan.",
      images: ["/og-image.jpg"],
    },
  };
}
```

### Fix 2 — Blog post hreflang

**`src/app/[locale]/(store)/blog/[slug]/page.tsx`**

في `generateMetadata`، استبدل `alternates`:
```ts
alternates: {
  canonical: `https://jordanhearing.com/${params.locale}/blog/${post.slug}`,
  languages: {
    ar: `https://jordanhearing.com/ar/blog/${post.slug}`,
    en: `https://jordanhearing.com/en/blog/${post.slug}`,
  },
},
```

### Fix 3 — Services layout

**أنشئ `src/app/[locale]/(store)/services/layout.tsx`:**
```ts
import type { Metadata } from "next";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isAr = locale === "ar";
  return {
    title: isAr ? "خدماتنا" : "Our Services",
    description: isAr
      ? "تقييم السمع، علاج النطق، العلاج الوظيفي، وتركيب أجهزة السمع في عمان."
      : "Hearing evaluation, speech therapy, occupational therapy, and hearing aid fitting in Amman.",
    alternates: {
      canonical: `https://jordanhearing.com/${locale}/services`,
      languages: { ar: "https://jordanhearing.com/ar/services", en: "https://jordanhearing.com/en/services" },
    },
  };
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

### Fix 4 — Sitemap hreflang for blog + products

**`src/app/sitemap.ts`** — أضف `alternates` للـ blog و product loops:
```ts
// Blog loop:
entries.push({
  url: `${baseUrl}/${locale}/blog/${post.slug}`,
  lastModified: new Date(),
  alternates: { languages: { ar: `${baseUrl}/ar/blog/${post.slug}`, en: `${baseUrl}/en/blog/${post.slug}` } },
});

// Product loop:
entries.push({
  url: `${baseUrl}/${locale}/product/${product.slug}`,
  lastModified: new Date(),
  alternates: { languages: { ar: `${baseUrl}/ar/product/${product.slug}`, en: `${baseUrl}/en/product/${product.slug}` } },
});
```

### Fix 5 — MedicalClinic JSON-LD

**`src/app/[locale]/(store)/page.tsx`** — أضف داخل الـ JSX return:
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "MedicalClinic",
      name: "Jordan Hearing & Speech Therapy",
      alternateName: "المركز الأردني للسمع والنطق",
      url: "https://jordanhearing.com",
      telephone: "+962-6-123-4567",
      email: "info@jordanhearing.com",
      address: { "@type": "PostalAddress", streetAddress: "123 Mecca Street", addressLocality: "Amman", addressCountry: "JO" },
      medicalSpecialty: ["Audiology", "SpeechTherapy", "PhysicalTherapy"],
    }),
  }}
/>
```

### Phase 5 Commit:

```bash
npm run typecheck
npm run build
git add src/
git commit -m "fix(seo): homepage generateMetadata, blog hreflang, services layout, sitemap hreflang, MedicalClinic JSON-LD"
git push origin feature/backend-complete-v2
```

---

## PHASE 6 — Quality & UX Fixes

### Delete Confirmations

في كل صفحة admin تحتوي `<button>Delete</button>` أو `<Trash2>`:

```tsx
// استبدل:
<button onClick={() => handleDelete(r.id)}>
// بـ:
<button onClick={() => { if (window.confirm("هل أنت متأكد من الحذف؟")) handleDelete(r.id); }}>
```

### Pagination حقيقية

**`src/components/admin/data-table.tsx`** أو أي Pagination component — اقرأه أولاً.

إذا كان ديكورياً (لا يغير الصفحة)، أضف `onPageChange` prop:

```tsx
<Pagination
  total={total}
  page={page}
  limit={20}
  onPageChange={(newPage) => setPage(newPage)}
/>
```

### Empty States

```tsx
// في DataTable أو في الـ page مباشرة:
{rows.length === 0 && (
  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
    <p className="text-lg font-medium">لا توجد بيانات</p>
    <p className="text-sm">أضف أول سجل باستخدام زر الإضافة</p>
  </div>
)}
```

### Phase 6 Commit:

```bash
npm run typecheck
npm run build
git add .
git commit -m "fix(ux): add delete confirmations, real pagination, empty states"
git push origin feature/backend-complete-v2
```

---

## PHASE 7 — Final Validation

### 7A — Build Check

```bash
npm run typecheck    # يجب: 0 errors
npm run lint         # يجب: 0 errors, 0 warnings
npm run build        # يجب: BUILD SUCCESSFUL, 111+ pages
```

### 7B — API Smoke Tests

```bash
# اختبر كل API بـ curl (بعد تشغيل dev server)
npm run dev &

curl http://localhost:3000/api/patients
curl http://localhost:3000/api/doctors
curl http://localhost:3000/api/departments
curl http://localhost:3000/api/services
curl http://localhost:3000/api/schedule
curl http://localhost:3000/api/holidays
curl http://localhost:3000/api/contact-messages
curl http://localhost:3000/api/blog-categories
curl http://localhost:3000/api/website-settings
curl http://localhost:3000/api/dashboard-stats

# كل response يجب أن يكون:
# { "success": true, "data": {...} }
```

### 7C — Checklist النهائي

```
BACKEND:
[ ] Prisma schema يحتوي 17+ models
[ ] 18+ API routes تعمل وتعيد بيانات حقيقية
[ ] Dashboard stats تأتي من DB
[ ] Website Setup يحفظ ويسترجع من DB
[ ] Patients CRUD يعمل كاملاً
[ ] Doctors CRUD يعمل كاملاً

FRONTEND:
[ ] /ar/ RTL يعمل
[ ] /en/ LTR يعمل
[ ] Language switcher يعمل
[ ] Blog cards تعرض عناوين عربية في /ar/
[ ] Team cards تعرض أسماء عربية في /ar/

ADMIN:
[ ] 10 صفحات تعرض بيانات من DB
[ ] Loading state موجود في كل صفحة
[ ] Empty state موجود
[ ] Delete يطلب تأكيد
[ ] Pagination تغير الصفحة فعلاً

SEO:
[ ] Homepage metadata locale-aware
[ ] Services layout.tsx موجود
[ ] Blog hreflang موجود
[ ] Sitemap يحتوي hreflang لكل entry
[ ] MedicalClinic JSON-LD موجود
```

---

## PHASE 8 — GitHub Release

### 8A — Merge إلى main

```bash
# تأكد من نظافة الـ branch
git status
npm run build

# اعمل PR (Pull Request) على GitHub أولاً
# ثم بعد review:
git checkout main
git pull origin main
git merge --no-ff feature/backend-complete-v2 -m "feat: complete backend v2.0 — real APIs, DB integration, SEO fixes"
git push origin main
```

### 8B — Tag و Release

```bash
git tag -a v2.0.0 -m "Jordan Hearing v2.0.0 — Complete Backend Release"
git push origin v2.0.0
```

### 8C — GitHub Release Description

**Title:** `v2.0.0 — Complete Backend & Real APIs`

**Body:**
```markdown
## What's New in v2.0.0

### Backend — الجديد الحقيقي
- ✅ **10 Prisma models** جديدة: Patient, Doctor, Department, Service, Schedule, Holiday, ContactMessage, BlogCategory, Role, SiteSetting
- ✅ **18+ API endpoints** حقيقية تحل محل mock data
- ✅ **Dashboard stats** تأتي من قاعدة البيانات
- ✅ **Website Setup** يحفظ فعلاً في DB ويسترجع عند الفتح

### Admin Panel
- ✅ 10 صفحات admin مربوطة بـ APIs حقيقية
- ✅ CRUD كامل للمرضى والأطباء والأقسام والخدمات
- ✅ Loading / Empty / Error states لكل صفحة
- ✅ Pagination حقيقية
- ✅ Delete confirmations

### Frontend
- ✅ ثنائي اللغة: عربي (افتراضي) + إنجليزي
- ✅ RTL كامل للعربي
- ✅ Team cards وBlog بالعربي والإنجليزي
- ✅ Evaluation ثنائي اللغة
- ✅ Book Appointment ثنائي اللغة

### SEO
- ✅ Homepage generateMetadata locale-aware
- ✅ hreflang لكل blog post وproduct
- ✅ Services layout.tsx للـ metadata
- ✅ MedicalClinic JSON-LD schema
- ✅ Sitemap كامل مع hreflang

### Tech Stack
- Next.js 14 App Router
- TypeScript strict
- Prisma ORM + PostgreSQL
- next-intl (ar/en)
- Tailwind CSS + shadcn/ui
- NextAuth.js
- Zod validation
- Resend email

### Database Models
Product, Order, Customer, Appointment, Evaluation, BlogPost, CartItem,
Patient, Doctor, Department, Service, Schedule, Holiday, ContactMessage,
BlogCategory, Role, SiteSetting

---
*Built for Jordan Hearing & Speech Therapy — Amman, Jordan*
```

---

## FALLBACK LOGIC — إذا فشل شيء

| المشكلة | الحل البديل |
|---------|------------|
| `prisma migrate dev` يفشل (لا Postgres محلي) | استخدم `prisma db push` بدلاً منه |
| TypeScript error في API جديدة | أضف `as unknown` عند parse الـ body |
| `notFound` أو `validationError` غير موجودة في `@/lib/api` | أضفها يدوياً في `src/lib/api.ts` |
| Admin page `"use client"` لا تقبل async fetch | استخدم `useEffect` + `useState` pattern |
| Pagination component لا يقبل `onPageChange` | أضف الـ prop مع default `() => {}` |
| Seed يفشل بسبب unique constraint | أضف `skipDuplicates: true` أو `upsert` |
| Build يفشل بعد schema change | شغّل `npx prisma generate` ثم أعد البناء |

---

## ملخص المراحل

| Phase | المطلوب | الجهد | Commit |
|-------|---------|-------|--------|
| 0 | Environment check + branch | 30 دقيقة | — |
| 1 | Schema + Seed | يوم واحد | `feat(schema): add 10 models` |
| 2 | 9 APIs | يومان | `feat(api): add 9 CRUD APIs` |
| 3 | Replace mock data | يومان | `feat(admin): replace mock data` |
| 4 | Website Setup | نصف يوم | `feat(admin): website-setup persists` |
| 5 | SEO fixes | 4 ساعات | `fix(seo): hreflang + metadata` |
| 6 | Quality + UX | نصف يوم | `fix(ux): confirmations + pagination` |
| 7 | Validation | ساعتان | — |
| 8 | GitHub Release | ساعة | `v2.0.0 tag + release` |
| **المجموع** | | **~7-10 أيام عمل** | **5 commits** |

**النتيجة المتوقعة بعد إنهاء البرومبت: 90-95 / 100**
