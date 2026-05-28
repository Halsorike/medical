import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { fail, ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const scheduleUpdateSchema = z.object({
  doctorId: z.string().min(1).optional(),
  dayOfWeek: z.string().min(1).optional(),
  startTime: z.string().min(1).optional(),
  endTime: z.string().min(1).optional(),
  maxSlots: z.coerce.number().int().positive().optional(),
});

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const schedule = await db.schedule.findUnique({
    where: { id: params.id },
    include: { doctor: true },
  });

  if (!schedule) {
    return fail("Schedule not found", 404);
  }

  return ok(schedule);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const parsed = scheduleUpdateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const existing = await db.schedule.findUnique({ where: { id: params.id } });

  if (!existing) {
    return fail("Schedule not found", 404);
  }

  try {
    const schedule = await db.schedule.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return ok(schedule);
  } catch {
    return fail("Schedule could not be updated", 409);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const existing = await db.schedule.findUnique({ where: { id: params.id } });

  if (!existing) {
    return fail("Schedule not found", 404);
  }

  await db.schedule.delete({ where: { id: params.id } });

  return ok({ deleted: true });
}
