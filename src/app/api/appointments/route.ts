import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { appointmentStatusSchema, ok, validationError } from "@/lib/api";
import { sendAppointmentConfirmationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const appointmentCreateSchema = z.object({
  patientName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  department: z.string().min(1),
  service: z.string().min(1),
  date: z.string().min(1),
  slot: z.string().min(1),
  confirmation: z.string().optional(),
  status: appointmentStatusSchema.default("pending"),
});

export async function GET() {
  await ensureSeeded();

  const appointments = await db.appointment.findMany({
    orderBy: { createdAt: "desc" },
  });

  return ok(appointments);
}

export async function POST(request: NextRequest) {
  await ensureSeeded();

  const parsed = appointmentCreateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const appointment = await db.appointment.create({
    data: parsed.data,
  });

  await sendAppointmentConfirmationEmail({
    to: parsed.data.email,
    patientName: parsed.data.patientName,
    date: parsed.data.date,
    slot: parsed.data.slot,
    department: parsed.data.department,
    service: parsed.data.service,
  });

  return ok(appointment, { status: 201 });
}
