import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().optional(),
  NODE_ENV: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.warn("[env] Some environment variables are malformed; using safe fallbacks where possible.");
}

const values = parsed.success ? parsed.data : {};

function warnMissing(name: string) {
  if (!process.env[name]) {
    console.warn(`[env] ${name} is missing. Configure it in Vercel before production use.`);
  }
}

warnMissing("DATABASE_URL");
warnMissing("NEXTAUTH_SECRET");

export const env = {
  DATABASE_URL: values.DATABASE_URL ?? "",
  RESEND_API_KEY: values.RESEND_API_KEY ?? "",
  RESEND_FROM_EMAIL: values.RESEND_FROM_EMAIL ?? "Medical Clinic <onboarding@resend.dev>",
  NEXTAUTH_SECRET: values.NEXTAUTH_SECRET ?? "",
  NEXTAUTH_URL: values.NEXTAUTH_URL ?? "",
  ADMIN_EMAIL: values.ADMIN_EMAIL ?? "admin@clinic.com",
  ADMIN_PASSWORD: values.ADMIN_PASSWORD ?? "admin123",
  NODE_ENV: values.NODE_ENV ?? "development",
};
