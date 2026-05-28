import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { fail, ok, validationError } from "@/lib/api";
import { hashPassword, setPatientSessionCookie } from "@/lib/patient-auth";

export const dynamic = "force-dynamic";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  const parsed = registerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);

  const existing = await db.patient.findUnique({ where: { email: parsed.data.email } });
  if (existing) return fail("A patient with this email already exists", 409);

  const patient = await db.patient.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      passwordHash: hashPassword(parsed.data.password),
    },
  });

  const response = ok({ user: { id: patient.id, name: patient.name, email: patient.email, phone: patient.phone } }, { status: 201 });
  setPatientSessionCookie(response, patient.id);
  return response;
}
