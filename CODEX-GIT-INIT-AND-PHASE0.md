# CODEX — Git Init + Phase 0 Unblock
## تشغيله مرة واحدة قبل المتابعة لـ Phase 1

**الوضع:** `D:\Projects\Medical` ليس git repo بعد.
**الهدف:** تهيئة git، ربط GitHub، initial commit، إنشاء feature branch.
**الـ remote:** `https://github.com/Halsorike/medical.git`

---

## RULES

```
❌ لا تعدّل .env أو .env.local
❌ لا تشغّل git push --force
❌ لا تعدّل أي source files في هذا الملف
✅ اتبع الخطوات بالترتيب بالضبط
✅ تحقق من كل خطوة قبل التالية
```

---

## الخطوة 1 — تهيئة Git

```powershell
cd D:\Projects\Medical

git init
git config user.email "HALSORIKE@icloud.com"
git config user.name "Husam"
```

**تحقق:**
```powershell
git status
# يجب أن يظهر: On branch master (أو main) — Untracked files
```

---

## الخطوة 2 — تأكد من .gitignore

```powershell
# تحقق أن هذه الأشياء ستُتجاهل:
cat .gitignore
```

يجب أن يحتوي على:
```
node_modules
.next
.env.local
.env
*.log
```

إذا ناقص أي منها، أضفه:
```powershell
# أضف prisma/dev.db إذا ما كان موجوداً:
Add-Content .gitignore "`nprisma/dev.db"
Add-Content .gitignore "screenshots/"
Add-Content .gitignore ".vercel"
```

---

## الخطوة 3 — Stage وInitial Commit

```powershell
# Stage كل شيء (node_modules و .next محمية بـ .gitignore)
git add .

# تحقق من حجم ما سيُرفع
git status --short | measure-object | select Count

# Initial commit
git commit -m "chore: initial commit — Jordan Hearing & Speech Therapy v1.0

Frontend: Next.js 14 + TypeScript + Tailwind + shadcn/ui
i18n: Arabic (default) + English via next-intl
Admin: 49 pages (mock data — v2 will replace with real APIs)
Schema: PostgreSQL via Prisma (7 models)
Build: 111/111 static pages PASS
TypeCheck: PASS | Lint: PASS"
```

---

## الخطوة 4 — ربط GitHub Remote

```powershell
git remote add origin https://github.com/Halsorike/medical.git

# تحقق:
git remote -v
# يجب يظهر:
# origin  https://github.com/Halsorike/medical.git (fetch)
# origin  https://github.com/Halsorike/medical.git (push)
```

---

## الخطوة 5 — Rename Branch إلى main (إذا كانت master)

```powershell
git branch -M main
git branch
# يجب أن يظهر: * main
```

---

## الخطوة 6 — Push إلى GitHub

```powershell
git push -u origin main
```

**إذا طلب authentication:**
- استخدم GitHub Personal Access Token (PAT) بدل كلمة المرور
- الـ PAT تُنشئه من: GitHub → Settings → Developer settings → Personal access tokens → Generate new token
- الصلاحيات المطلوبة: `repo` (Full control)
- Username: `Halsorike`
- Password: الـ PAT الذي أنشأته

**إذا ظهر خطأ "remote already has commits":**
```powershell
# إذا كان الـ repo على GitHub فيه README أو ملفات:
git pull origin main --allow-unrelated-histories --no-edit
git push origin main
```

---

## الخطوة 7 — إنشاء Feature Branch

```powershell
git checkout -b feature/backend-complete-v2
git branch
# يجب أن يظهر: * feature/backend-complete-v2
```

---

## الخطوة 8 — Push الـ Branch

```powershell
git push -u origin feature/backend-complete-v2
```

---

## الخطوة 9 — تحقق نهائي

```powershell
git log --oneline
# يجب أن يظهر: commit واحد على الأقل

git branch -a
# يجب أن يظهر:
# * feature/backend-complete-v2
#   main
#   remotes/origin/main
#   remotes/origin/feature/backend-complete-v2

git status
# يجب: nothing to commit, working tree clean
```

---

## معايير القبول — Phase 0 مكتمل ✅

```
[ ] git init تم
[ ] .gitignore يتجاهل node_modules و .next و .env* و prisma/dev.db
[ ] Initial commit موجود على main
[ ] Remote origin يشير لـ https://github.com/Halsorike/medical.git
[ ] Branch feature/backend-complete-v2 موجود محلياً وعلى GitHub
[ ] git status نظيف (nothing to commit)
[ ] npm run build لا يزال PASS بعد هذه الخطوات
```

---

## بعد اكتمال هذا الملف:

انتقل مباشرة لـ `CODEX-BACKEND-COMPLETE-V2.md` وابدأ من **Phase 1**.

كل commit في Phase 1-8 سيكون على `feature/backend-complete-v2`.

---

## ملاحظة على api.ts compatibility (من نتيجة Phase 0)

Codex لاحظ أن `src/lib/api.ts` يعيد `{ data }` فقط بدون `{ success, message, data }`.

**في Phase 2، عند كتابة كل API جديدة:**
- استخدم دالة `ok()` الموجودة كما هي
- لا تعدّل `api.ts` الحالية إلا إذا كانت `ok()` لا تعيد `success: true`
- إذا احتجت `notFound()` وما كانت موجودة، أضفها فقط لـ `api.ts` بدون تعديل الدوال الموجودة:

```ts
// أضف في نهاية src/lib/api.ts فقط إذا notFound غير موجودة:
export function notFound(entity = "Resource") {
  return Response.json(
    { success: false, data: null, message: `${entity} not found` },
    { status: 404 }
  );
}
```
