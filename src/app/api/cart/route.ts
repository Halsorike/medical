import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { fail, getCartSessionId, toPublicProduct, validationError, withCartCookie } from "@/lib/api";

export const dynamic = "force-dynamic";

const cartMutationSchema = z.object({
  productId: z.string().optional(),
  slug: z.string().optional(),
  qty: z.coerce.number().int().min(1).default(1),
  mode: z.enum(["add", "set"]).default("add"),
}).refine((value) => value.productId || value.slug, {
  message: "productId or slug is required",
});

async function getCartItems(sessionId: string) {
  const items = await db.cartItem.findMany({
    where: { sessionId, product: { deleted: false } },
    include: { product: true },
    orderBy: { id: "asc" },
  });

  return items.map((item) => ({
    id: item.id,
    qty: item.qty,
    product: toPublicProduct(item.product),
  }));
}

async function resolveProduct(productId?: string, slug?: string) {
  if (productId) {
    return db.product.findFirst({ where: { id: productId, deleted: false } });
  }

  if (slug) {
    return db.product.findFirst({ where: { slug, deleted: false } });
  }

  return null;
}

export async function GET() {
  await ensureSeeded();

  const sessionId = getCartSessionId();
  return withCartCookie(await getCartItems(sessionId), sessionId);
}

export async function POST(request: NextRequest) {
  await ensureSeeded();

  const parsed = cartMutationSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const product = await resolveProduct(parsed.data.productId, parsed.data.slug);

  if (!product) {
    return fail("Product not found", 404);
  }

  const sessionId = getCartSessionId();
  const existing = await db.cartItem.findUnique({
    where: { sessionId_productId: { sessionId, productId: product.id } },
  });

  await db.cartItem.upsert({
    where: { sessionId_productId: { sessionId, productId: product.id } },
    update: {
      qty: parsed.data.mode === "set" ? parsed.data.qty : (existing?.qty ?? 0) + parsed.data.qty,
    },
    create: {
      sessionId,
      productId: product.id,
      qty: parsed.data.qty,
    },
  });

  return withCartCookie(await getCartItems(sessionId), sessionId);
}

export async function DELETE(request: NextRequest) {
  await ensureSeeded();

  const body = await request.json().catch(() => null);
  const productId = typeof body?.productId === "string" ? body.productId : request.nextUrl.searchParams.get("productId") ?? undefined;
  const slug = typeof body?.slug === "string" ? body.slug : request.nextUrl.searchParams.get("slug") ?? undefined;

  const product = await resolveProduct(productId, slug);

  if (!product) {
    return fail("Product not found", 404);
  }

  const sessionId = getCartSessionId();

  await db.cartItem.deleteMany({
    where: {
      sessionId,
      productId: product.id,
    },
  });

  return withCartCookie(await getCartItems(sessionId), sessionId);
}
