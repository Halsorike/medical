import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { fail, ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const holidayUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  nameAr: z.string().optional(),
  date: z.coerce.date().optional(),
  description: z.string().optional(),
  recurring: z.coerce.boolean().optional(),
});

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const holiday = await db.holiday.findUnique({ where: { id: params.id } });

  if (!holiday) {
    return fail("Holiday not found", 404);
  }

  return ok(holiday);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const parsed = holidayUpdateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const existing = await db.holiday.findUnique({ where: { id: params.id } });

  if (!existing) {
    return fail("Holiday not found", 404);
  }

  const holiday = await db.holiday.update({
    where: { id: params.id },
    data: parsed.data,
  });

  return ok(holiday);
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const existing = await db.holiday.findUnique({ where: { id: params.id } });

  if (!existing) {
    return fail("Holiday not found", 404);
  }

  await db.holiday.delete({ where: { id: params.id } });

  return ok({ deleted: true });
}
