import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { fail, ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const patientUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  nameAr: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().min(7).optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.enum(["male", "female"]).optional(),
  address: z.string().optional(),
  medicalHistory: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const patient = await db.patient.findUnique({
    where: { id: params.id },
    include: {
      appointments: { orderBy: { createdAt: "desc" } },
      evaluations: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!patient) {
    return fail("Patient not found", 404);
  }

  return ok(patient);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const parsed = patientUpdateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const existing = await db.patient.findUnique({ where: { id: params.id } });

  if (!existing) {
    return fail("Patient not found", 404);
  }

  try {
    const patient = await db.patient.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return ok(patient);
  } catch {
    return fail("Patient could not be updated", 409);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const existing = await db.patient.findUnique({ where: { id: params.id } });

  if (!existing) {
    return fail("Patient not found", 404);
  }

  try {
    await db.patient.delete({ where: { id: params.id } });
    return ok({ deleted: true });
  } catch {
    return fail("Patient could not be deleted", 409);
  }
}
