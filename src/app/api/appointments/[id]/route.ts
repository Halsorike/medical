import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { appointmentStatusSchema, fail, ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const appointmentUpdateSchema = z.object({
  status: appointmentStatusSchema.optional(),
});

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const appointment = await db.appointment.findUnique({ where: { id: params.id } });

  if (!appointment) {
    return fail("Appointment not found", 404);
  }

  return ok(appointment);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const parsed = appointmentUpdateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const existing = await db.appointment.findUnique({ where: { id: params.id } });

  if (!existing) {
    return fail("Appointment not found", 404);
  }

  const appointment = await db.appointment.update({
    where: { id: params.id },
    data: parsed.data,
  });

  return ok(appointment);
}
