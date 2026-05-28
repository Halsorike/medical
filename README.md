# Codex Medical Platform v2.0

Complete medical clinic + ecommerce platform.

## Clinic Features

- Patient Management (CRUD + medical history)
- Doctor/Team Management
- Department & Service Management
- Appointment Booking & Scheduling
- Doctor Schedule Management
- Evaluations System
- Contact Messages Inbox
- Blog & Blog Categories
- Roles & Permissions
- Website Settings (CMS)
- Holiday & Leave Management
- Accounting (Income/Expenses)
- Full Arabic/English i18n

## Ecommerce Features (Phase 2)

- Product Catalog
- Cart & Checkout
- Order Management
- Customer Management
- POS System

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma + PostgreSQL
- Tailwind CSS + shadcn/ui
- next-intl (Arabic/English)
- Zod validation
- Sonner toast notifications

## Getting Started

```bash
git clone https://github.com/Halsorike/medical.git
cd medical
npm install
cp .env.example .env   # configure DATABASE_URL
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

## API Endpoints (Clinic)

| Endpoint | Methods |
|----------|---------|
| /api/patients | GET, POST |
| /api/patients/[id] | GET, PUT, DELETE |
| /api/doctors | GET, POST |
| /api/doctors/[id] | GET, PUT, DELETE |
| /api/departments | GET, POST |
| /api/departments/[id] | GET, PUT, DELETE |
| /api/services | GET, POST |
| /api/services/[id] | GET, PUT, DELETE |
| /api/schedule | GET, POST |
| /api/schedule/[id] | GET, PUT, DELETE |
| /api/holidays | GET, POST |
| /api/holidays/[id] | GET, PUT, DELETE |
| /api/contact-messages | GET, POST |
| /api/contact-messages/[id] | GET, PUT, DELETE |
| /api/blog-categories | GET, POST |
| /api/blog-categories/[id] | GET, PUT, DELETE |
| /api/roles | GET, POST |
| /api/roles/[id] | GET, PUT, DELETE |
| /api/website-settings | GET, PUT |
| /api/dashboard/stats | GET |
| /api/appointments | GET, POST |
| /api/appointments/[id] | GET, PUT, DELETE |
| /api/evaluations | GET, POST |
