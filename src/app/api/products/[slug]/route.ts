import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { fail, ok, toPublicProduct, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const productUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  price: z.coerce.number().nonnegative().optional(),
  stock: z.coerce.number().int().nonnegative().optional(),
  category: z.string().min(1).optional(),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(),
});

async function findProduct(query: string) {
  return db.product.findFirst({
    where: {
      deleted: false,
      OR: [{ slug: query }, { id: query }],
    },
  });
}

export async function GET(_request: NextRequest, { params }: { params: { slug: string } }) {
  await ensureSeeded();

  const product = await findProduct(params.slug);

  if (!product) {
    return fail("Product not found", 404);
  }

  return ok(toPublicProduct(product));
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  await ensureSeeded();

  const existing = await findProduct(params.slug);

  if (!existing) {
    return fail("Product not found", 404);
  }

  const parsed = productUpdateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { images, ...rest } = parsed.data;
  const product = await db.product.update({
    where: { id: existing.id },
    data: {
      ...rest,
      ...(images ? { images: JSON.stringify(images) } : {}),
    },
  });

  return ok(toPublicProduct(product));
}

export async function DELETE(_request: NextRequest, { params }: { params: { slug: string } }) {
  await ensureSeeded();

  const existing = await findProduct(params.slug);

  if (!existing) {
    return fail("Product not found", 404);
  }

  await db.product.update({
    where: { id: existing.id },
    data: { deleted: true },
  });

  return ok({ deleted: true });
}
