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

const roleCreateSchema = z.object({
  name: z.string().min(2),
  nameAr: z.string().optional(),
  permissions: permissionsSchema,
});

export async function GET() {
  await ensureSeeded();

  const roles = await db.role.findMany({
    orderBy: { name: "asc" },
  });

  return ok(roles);
}

export async function POST(request: NextRequest) {
  await ensureSeeded();

  const parsed = roleCreateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  try {
    const role = await db.role.create({
      data: parsed.data,
    });

    return ok(role, { status: 201 });
  } catch {
    return fail("Role could not be created", 409);
  }
}
