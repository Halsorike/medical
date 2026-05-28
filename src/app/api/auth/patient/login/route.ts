import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { fail, ok, validationError } from "@/lib/api";
import { setPatientSessionCookie, verifyPassword } from "@/lib/patient-auth";

export const dynamic = "force-dynamic";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);

  const patient = await db.patient.findUnique({ where: { email: parsed.data.email } });
  if (!patient || !verifyPassword(parsed.data.password, patient.passwordHash)) {
    return fail("Invalid email or password", 401);
  }

  const response = ok({ user: { id: patient.id, name: patient.name, email: patient.email, phone: patient.phone } });
  setPatientSessionCookie(response, patient.id);
  return response;
}
