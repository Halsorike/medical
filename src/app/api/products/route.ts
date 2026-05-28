import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { fail, ok, toPublicProduct, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const productCreateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  price: z.coerce.number().nonnegative(),
  stock: z.coerce.number().int().nonnegative(),
  category: z.string().min(1),
  description: z.string().optional(),
  images: z.array(z.string().url()).default([]),
});

export async function GET(request: NextRequest) {
  await ensureSeeded();

  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q") ?? searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";

  const products = await db.product.findMany({
    where: {
      deleted: false,
      ...(category ? { category } : {}),
      ...(query
        ? {
            OR: [
              { name: { contains: query } },
              { slug: { contains: query } },
              { category: { contains: query } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return ok(products.map(toPublicProduct));
}

export async function POST(request: NextRequest) {
  await ensureSeeded();

  const parsed = productCreateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  try {
    const product = await db.product.create({
      data: {
        id: parsed.data.id ?? crypto.randomUUID(),
        name: parsed.data.name,
        slug: parsed.data.slug,
        price: parsed.data.price,
        stock: parsed.data.stock,
        category: parsed.data.category,
        description: parsed.data.description,
        images: JSON.stringify(parsed.data.images),
      },
    });

    return ok(toPublicProduct(product), { status: 201 });
  } catch {
    return fail("Product could not be created", 409);
  }
}
