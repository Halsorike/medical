import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { fail, ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const holidayCreateSchema = z.object({
  name: z.string().min(2),
  nameAr: z.string().optional(),
  date: z.coerce.date(),
  description: z.string().optional(),
  recurring: z.coerce.boolean().default(false),
});

export async function GET() {
  await ensureSeeded();

  const holidays = await db.holiday.findMany({
    orderBy: { date: "asc" },
  });

  return ok(holidays);
}

export async function POST(request: NextRequest) {
  await ensureSeeded();

  const parsed = holidayCreateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  try {
    const holiday = await db.holiday.create({
      data: parsed.data,
    });

    return ok(holiday, { status: 201 });
  } catch {
    return fail("Holiday could not be created", 409);
  }
}
