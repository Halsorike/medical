import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { fail, ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const permissionsSchema = z.string().refine((value) => {
  try {
    return Array.isArray(JSON.parse(value));
  } catch {
    return false;
  }
}, "Permissions must be a JSON array string");

const roleUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  nameAr: z.string().optional(),
  permissions: permissionsSchema.optional(),
});

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const role = await db.role.findUnique({ where: { id: params.id } });

  if (!role) {
    return fail("Role not found", 404);
  }

  return ok(role);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const parsed = roleUpdateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const existing = await db.role.findUnique({ where: { id: params.id } });

  if (!existing) {
    return fail("Role not found", 404);
  }

  try {
    const role = await db.role.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return ok(role);
  } catch {
    return fail("Role could not be updated", 409);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const existing = await db.role.findUnique({ where: { id: params.id } });

  if (!existing) {
    return fail("Role not found", 404);
  }

  await db.role.delete({ where: { id: params.id } });

  return ok({ deleted: true });
}
