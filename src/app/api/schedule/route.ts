import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { fail, ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const scheduleCreateSchema = z.object({
  doctorId: z.string().min(1),
  dayOfWeek: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  maxSlots: z.coerce.number().int().positive().default(10),
});

export async function GET(request: NextRequest) {
  await ensureSeeded();

  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get("doctorId");
  const dayOfWeek = searchParams.get("dayOfWeek");

  const where: Prisma.ScheduleWhereInput = {
    ...(doctorId ? { doctorId } : {}),
    ...(dayOfWeek ? { dayOfWeek } : {}),
  };

  const schedules = await db.schedule.findMany({
    where,
    include: { doctor: true },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  return ok(schedules);
}

export async function POST(request: NextRequest) {
  await ensureSeeded();

  const parsed = scheduleCreateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  try {
    const schedule = await db.schedule.create({
      data: parsed.data,
    });

    return ok(schedule, { status: 201 });
  } catch {
    return fail("Schedule could not be created", 409);
  }
}
