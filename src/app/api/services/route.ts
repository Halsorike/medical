import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { fail, ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const serviceCreateSchema = z.object({
  name: z.string().min(2),
  nameAr: z.string().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  price: z.coerce.number().positive().optional(),
  duration: z.coerce.number().int().positive().optional(),
  departmentId: z.string().min(1),
});

export async function GET(request: NextRequest) {
  await ensureSeeded();

  const { searchParams } = new URL(request.url);
  const departmentId = searchParams.get("departmentId");

  const services = await db.service.findMany({
    where: departmentId ? { departmentId } : {},
    include: { department: true },
    orderBy: { name: "asc" },
  });

  return ok(services);
}

export async function POST(request: NextRequest) {
  await ensureSeeded();

  const parsed = serviceCreateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  try {
    const service = await db.service.create({
      data: parsed.data,
    });

    return ok(service, { status: 201 });
  } catch {
    return fail("Service could not be created", 409);
  }
}
