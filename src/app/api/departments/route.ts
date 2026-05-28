import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { fail, ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const departmentCreateSchema = z.object({
  name: z.string().min(2),
  nameAr: z.string().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
});

export async function GET() {
  await ensureSeeded();

  const departments = await db.department.findMany({
    include: {
      _count: {
        select: { doctors: true, services: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return ok(departments);
}

export async function POST(request: NextRequest) {
  await ensureSeeded();

  const parsed = departmentCreateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  try {
    const department = await db.department.create({
      data: parsed.data,
    });

    return ok(department, { status: 201 });
  } catch {
    return fail("Department could not be created", 409);
  }
}
