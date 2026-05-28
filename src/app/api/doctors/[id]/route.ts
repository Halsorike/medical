import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { fail, ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const doctorUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  nameAr: z.string().optional(),
  title: z.string().min(2).optional(),
  titleAr: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().min(7).optional(),
  bio: z.string().optional(),
  bioAr: z.string().optional(),
  specialization: z.string().min(2).optional(),
  experience: z.coerce.number().int().nonnegative().optional(),
  qualification: z.string().optional(),
  image: z.string().url().optional(),
  slug: z.string().min(2).optional(),
  departmentId: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const doctor = await db.doctor.findUnique({
    where: { id: params.id },
    include: {
      department: true,
      schedules: { orderBy: { dayOfWeek: "asc" } },
    },
  });

  if (!doctor) {
    return fail("Doctor not found", 404);
  }

  return ok(doctor);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const parsed = doctorUpdateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const existing = await db.doctor.findUnique({ where: { id: params.id } });

  if (!existing) {
    return fail("Doctor not found", 404);
  }

  try {
    const doctor = await db.doctor.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return ok(doctor);
  } catch {
    return fail("Doctor could not be updated", 409);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const existing = await db.doctor.findUnique({ where: { id: params.id } });

  if (!existing) {
    return fail("Doctor not found", 404);
  }

  try {
    await db.doctor.delete({ where: { id: params.id } });
    return ok({ deleted: true });
  } catch {
    return fail("Doctor could not be deleted", 409);
  }
}
