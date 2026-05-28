import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { fail, ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const patientCreateSchema = z.object({
  name: z.string().min(2),
  nameAr: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(7),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.enum(["male", "female"]).optional(),
  address: z.string().optional(),
  medicalHistory: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  await ensureSeeded();

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? searchParams.get("search") ?? "";

  const where: Prisma.PatientWhereInput = q
    ? {
        OR: [{ name: { contains: q } }, { email: { contains: q } }, { phone: { contains: q } }],
      }
    : {};

  const patients = await db.patient.findMany({
    where,
    include: {
      appointments: {
        take: 3,
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return ok(patients);
}

export async function POST(request: NextRequest) {
  await ensureSeeded();

  const parsed = patientCreateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  try {
    const patient = await db.patient.create({
      data: parsed.data,
    });

    return ok(patient, { status: 201 });
  } catch {
    return fail("Patient could not be created", 409);
  }
}
