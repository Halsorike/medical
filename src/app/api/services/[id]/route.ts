import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { fail, ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const serviceUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  nameAr: z.string().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  price: z.coerce.number().positive().optional(),
  duration: z.coerce.number().int().positive().optional(),
  departmentId: z.string().min(1).optional(),
});

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const service = await db.service.findUnique({
    where: { id: params.id },
    include: { department: true },
  });

  if (!service) {
    return fail("Service not found", 404);
  }

  return ok(service);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const parsed = serviceUpdateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const existing = await db.service.findUnique({ where: { id: params.id } });

  if (!existing) {
    return fail("Service not found", 404);
  }

  try {
    const service = await db.service.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return ok(service);
  } catch {
    return fail("Service could not be updated", 409);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const existing = await db.service.findUnique({ where: { id: params.id } });

  if (!existing) {
    return fail("Service not found", 404);
  }

  try {
    await db.service.delete({ where: { id: params.id } });
    return ok({ deleted: true });
  } catch {
    return fail("Service could not be deleted", 409);
  }
}
