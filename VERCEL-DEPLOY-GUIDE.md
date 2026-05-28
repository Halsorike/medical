# Vercel Deployment Guide — Jordan Hearing & Speech Therapy

> **Goal:** Get `https://jordanhearing.com` live on Vercel with a Postgres database, email, and all env vars wired up correctly.
>
> **Time estimate:** ~30 minutes (excluding DNS propagation).

---

## Prerequisites

| Tool | Why |
|------|-----|
| Git repo on GitHub / GitLab / Bitbucket | Vercel pulls from it |
| Vercel account (free Hobby is fine) | Hosting |
| Vercel Postgres **or** external Postgres (Neon, Supabase, Railway) | Production DB |
| Resend account + verified domain | Email notifications |

---

## Step 1 — Switch schema to PostgreSQL

The local schema uses SQLite. Before deploying you must switch the `datasource` in `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

> Keep a backup of the SQLite file (`prisma/dev.db`) — it is still used locally if you set `DATABASE_URL=file:./dev.db` in `.env.local`.

**Commit this change:**
```bash
git add prisma/schema.prisma
git commit -m "chore: switch prisma provider to postgresql for production"
git push
```

---

## Step 2 — Create the Vercel Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository** → select your repo
3. **Framework Preset:** Next.js (auto-detected)
4. **Root Directory:** leave blank (project root)
5. **Build Command:** `npm run build` (default)
6. **Output Directory:** `.next` (default)
7. Click **Deploy** — it will fail on the first deploy because env vars aren't set yet. That's fine.

---

## Step 3 — Provision a Postgres Database

### Option A — Vercel Postgres (easiest)

1. In your Vercel project → **Storage** tab → **Create Database**
2. Choose **Postgres** → give it a name like `jordanhearing-db`
3. Click **Create & Continue**
4. Vercel automatically adds `DATABASE_URL`, `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, etc. to your project's environment variables

Use `POSTGRES_PRISMA_URL` (includes `?pgbouncer=true&connect_timeout=15`) as your `DATABASE_URL`. Vercel sets it automatically — just verify it appears in **Settings → Environment Variables**.

### Option B — Neon (free tier, external)

1. Sign up at [neon.tech](https://neon.tech)
2. Create a project → copy the **Connection string** (postgresql://...)
3. You'll add it manually in Step 4

### Option C — Supabase / Railway

Same idea — create a project, copy the `postgres://` connection string.

---

## Step 4 — Set Environment Variables

In Vercel project → **Settings** → **Environment Variables**, add each of the following. Set **Environment** to `Production` (and optionally `Preview`).

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | `postgresql://user:pass@host/db?sslmode=require` | From Step 3. Vercel Postgres sets this automatically. |
| `NEXTAUTH_SECRET` | Random 32-char string | Generate: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://jordanhearing.com` | Must match your production domain exactly |
| `RESEND_API_KEY` | `re_xxxxxxxxxxxx` | From [resend.com](https://resend.com) dashboard |
| `ADMIN_EMAIL` | `admin@jordanhearing.com` | Your real admin login email |
| `ADMIN_PASSWORD` | Strong password | Avoid the dev default `admin123` |

> **Security:** Never commit real values to git. The `.env.local` file is gitignored — keep secrets there locally only.

After adding all variables, click **Save**.

---

## Step 5 — Redeploy

1. Go to **Deployments** tab → find the latest deployment → click ⋯ → **Redeploy**
2. Or push a new commit to trigger a fresh deploy

Watch the build log. Common failures and fixes:

| Error | Fix |
|-------|-----|
| `Can't reach database server` | Check `DATABASE_URL` is set and the DB allows external connections (Neon: enable SSL, Supabase: use correct port) |
| `NEXTAUTH_URL must be set` | Add `NEXTAUTH_URL` env var |
| `Module not found: prisma/client` | The `postinstall` script runs `prisma generate` automatically — if it's missing, add it to `package.json` scripts |
| Build type errors | Run `npm run typecheck` locally first and fix before pushing |

---

## Step 6 — Run Prisma Migrations

After the first successful deploy, the database is empty — no tables yet.

### Using Vercel CLI (recommended)

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Link to your project
vercel link

# Pull production env vars to .env.production.local
vercel env pull .env.production.local

# Run db push against production DB
DATABASE_URL=$(grep DATABASE_URL .env.production.local | cut -d= -f2-) npx prisma db push
```

### Alternative: Vercel Build Command hook

Add a custom **Build Command** in Vercel project settings:

```
prisma db push && npm run build
```

This runs `db push` on every deploy — safe for `db push` (no migration history), not recommended for `migrate deploy` workflows.

### Seed the admin user

If you have a seed script:

```bash
DATABASE_URL="your-production-url" npx prisma db seed
```

If there is no seed script, log in to the Vercel Postgres dashboard (or use `psql`) and manually insert an admin row if your schema requires one.

---

## Step 7 — Configure Custom Domain

1. Vercel project → **Settings** → **Domains**
2. Add `jordanhearing.com` and `www.jordanhearing.com`
3. Vercel shows you two DNS records to add:

| Type | Name | Value |
|------|------|-------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

4. Log in to your domain registrar (GoDaddy, Namecheap, etc.) and add those records
5. DNS propagation takes 5–60 minutes
6. Vercel automatically provisions a free SSL certificate via Let's Encrypt

> **Update `NEXTAUTH_URL`:** Once the domain is confirmed, make sure `NEXTAUTH_URL=https://jordanhearing.com` is set (not the `.vercel.app` URL).

---

## Step 8 — Configure Resend (Email)

1. Log in to [resend.com](https://resend.com) → **Domains**
2. Add `jordanhearing.com`
3. Resend gives you DNS TXT + MX records → add them to your registrar
4. Verify the domain (green ✓)
5. Create an API key → paste it as `RESEND_API_KEY` in Vercel

The contact form and appointment booking emails will now send from `info@jordanhearing.com` (or whichever `from` address your API routes use).

---

## Step 9 — Verify the Deployment

Once the domain is live, check each of the following:

### Storefront (Arabic)
- [ ] `https://jordanhearing.com` → redirects to `/ar/` (defaultLocale)
- [ ] `/ar/` hero, services, blog cards render correctly
- [ ] `/en/` English version loads
- [ ] Language switcher toggles between `/ar/` and `/en/`
- [ ] RTL layout on `/ar/` (text flows right-to-left)
- [ ] LTR layout on `/en/`

### Store & Cart
- [ ] `/ar/shop` — products list
- [ ] Add to cart → `/ar/cart` shows item
- [ ] Checkout flow (if wired to Stripe/payment, test with test key)

### Admin Panel
- [ ] `https://jordanhearing.com/admin/login` loads in English (LTR)
- [ ] Log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- [ ] Dashboard, Orders, Products, Appointments pages load

### SEO
- [ ] `https://jordanhearing.com/sitemap.xml` returns XML with `/ar/` and `/en/` URLs
- [ ] `https://jordanhearing.com/robots.txt` includes the sitemap URL
- [ ] `<html lang="ar" dir="rtl">` in page source for Arabic pages

### Email
- [ ] Submit the contact form → you receive an email
- [ ] Book appointment → confirmation email arrives

---

## Step 10 — Ongoing Deployments

Every `git push` to your main branch triggers an automatic redeploy on Vercel. No manual steps needed after initial setup.

**Preview deployments:** Every pull request gets its own preview URL (e.g., `medical-git-feature-xyz.vercel.app`). Great for testing Arabic content changes before merging.

---

## Quick Reference — All Env Vars

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require

# Auth
NEXTAUTH_SECRET=<32-char-random-string>
NEXTAUTH_URL=https://jordanhearing.com

# Email
RESEND_API_KEY=re_xxxxxxxxxxxx

# Admin credentials (stored in env, checked in auth route)
ADMIN_EMAIL=admin@jordanhearing.com
ADMIN_PASSWORD=<strong-password>
```

---

## Troubleshooting

**"Application error: a client-side exception has occurred"**
→ Check Vercel build logs. Usually a missing env var or a server component trying to access `localStorage`.

**"PrismaClientInitializationError: Can't reach database server"**
→ DATABASE_URL is wrong or DB doesn't allow connections from Vercel's IP ranges. Enable "Allow from all IPs" in Neon/Supabase dashboard, or use Vercel Postgres which is pre-configured.

**Arabic text shows as boxes / missing font**
→ Noto Sans Arabic is loaded via `next/font/google`. On first cold start it may take a moment. Hard-refresh. If persistent, check the `<html dir="rtl">` is set and the font CSS variable is applied.

**Admin login redirects to `/admin/login` in a loop**
→ `NEXTAUTH_SECRET` is missing or `NEXTAUTH_URL` doesn't match the current domain. Fix both env vars and redeploy.

**Emails not sending**
→ Resend domain not verified yet, or `RESEND_API_KEY` is wrong. Check Resend dashboard for delivery logs.
