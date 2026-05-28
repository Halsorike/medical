import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { fail, ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const blogCategoryUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  nameAr: z.string().optional(),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional(),
});

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const category = await db.blogCategory.findUnique({
    where: { id: params.id },
    include: { posts: true },
  });

  if (!category) {
    return fail("Blog category not found", 404);
  }

  return ok(category);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const parsed = blogCategoryUpdateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const existing = await db.blogCategory.findUnique({ where: { id: params.id } });

  if (!existing) {
    return fail("Blog category not found", 404);
  }

  try {
    const category = await db.blogCategory.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return ok(category);
  } catch {
    return fail("Blog category could not be updated", 409);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const existing = await db.blogCategory.findUnique({ where: { id: params.id } });

  if (!existing) {
    return fail("Blog category not found", 404);
  }

  try {
    await db.blogCategory.delete({ where: { id: params.id } });
    return ok({ deleted: true });
  } catch {
    return fail("Blog category could not be deleted", 409);
  }
}
