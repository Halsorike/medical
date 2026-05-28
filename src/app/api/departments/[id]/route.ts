import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { fail, ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const departmentUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  nameAr: z.string().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
});

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const department = await db.department.findUnique({
    where: { id: params.id },
    include: {
      doctors: { orderBy: { name: "asc" } },
      services: { orderBy: { name: "asc" } },
    },
  });

  if (!department) {
    return fail("Department not found", 404);
  }

  return ok(department);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const parsed = departmentUpdateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const existing = await db.department.findUnique({ where: { id: params.id } });

  if (!existing) {
    return fail("Department not found", 404);
  }

  try {
    const department = await db.department.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return ok(department);
  } catch {
    return fail("Department could not be updated", 409);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const existing = await db.department.findUnique({ where: { id: params.id } });

  if (!existing) {
    return fail("Department not found", 404);
  }

  try {
    await db.department.delete({ where: { id: params.id } });
    return ok({ deleted: true });
  } catch {
    return fail("Department could not be deleted", 409);
  }
}
