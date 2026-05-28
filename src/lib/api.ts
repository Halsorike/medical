import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { BlogPost as DbBlogPost, Order as DbOrder, Product as DbProduct } from "@prisma/client";
import { z } from "zod";
import { products as productFixtures } from "@/data/products";

export const orderStatusSchema = z.enum([
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

export const appointmentStatusSchema = z.enum([
  "pending",
  "upcoming",
  "done",
  "cancelled",
]);

const fallbackBrands = ["Pfizer", "Bayer", "Johnson & Johnson", "Roche", "Novartis", "GSK", "Sanofi", "Merck"];

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status });
}

export function validationError(error: z.ZodError) {
  return fail("Validation failed", 422, error.flatten());
}

export function notFound(entity = "Resource") {
  return NextResponse.json({ error: `${entity} not found` }, { status: 404 });
}

export function toPublicProduct(product: DbProduct) {
  const parsedImages = JSON.parse(product.images) as unknown;
  const images = Array.isArray(parsedImages) ? parsedImages.filter((item): item is string => typeof item === "string") : [];
  const fixture = productFixtures.find((item) => item.id === product.id || item.slug === product.slug);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    nameAr: fixture?.nameAr,
    brand: fallbackBrands[(Number(product.id) - 1) % fallbackBrands.length] ?? "Medical",
    category: product.category,
    price: product.price,
    oldPrice: (Number(product.id) - 1) % 3 === 0 ? Math.round(product.price * 1.2 * 100) / 100 : undefined,
    rating: 4.8,
    reviews: 0,
    stock: product.stock,
    image: images[0] ?? "",
    images,
    description: product.description ?? "",
    descriptionAr: fixture?.descriptionAr,
    badges: product.deleted ? ["Archived"] : undefined,
    createdAt: product.createdAt.toISOString(),
  };
}

function jsonObject(value: unknown): Record<string, unknown> {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : {};
    } catch {
      return {};
    }
  }

  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function jsonArray(value: unknown): unknown[] {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return Array.isArray(value) ? value : [];
}

export function toPublicOrder(order: DbOrder) {
  const itemData = jsonObject(order.items);
  const shippingData = jsonObject(order.shippingAddress);

  return {
    id: order.id,
    code: typeof itemData.code === "string" ? itemData.code : `#ORD-${order.id.slice(0, 6).toUpperCase()}`,
    customer: typeof itemData.customer === "string" ? itemData.customer : String(shippingData.name ?? "Store Customer"),
    email: typeof itemData.email === "string" ? itemData.email : String(shippingData.email ?? "customer@example.com"),
    date: typeof itemData.date === "string" ? itemData.date : order.createdAt.toISOString(),
    total: order.total,
    status: order.status,
    payment: typeof itemData.payment === "string" ? itemData.payment : "paid",
    items: typeof itemData.count === "number" ? itemData.count : jsonArray(order.items).length,
    lineItems: itemData.lineItems ?? jsonArray(order.items),
    shippingAddress: jsonObject(order.shippingAddress),
    createdAt: order.createdAt.toISOString(),
  };
}

export function toPublicBlogPost(post: DbBlogPost) {
  return {
    ...post,
    content: jsonArray(post.content).filter((item): item is string => typeof item === "string"),
    createdAt: post.createdAt.toISOString(),
  };
}

export function getCartSessionId() {
  const cookieStore = cookies();
  return cookieStore.get("medical_cart_session")?.value ?? crypto.randomUUID();
}

export function withCartCookie<T>(data: T, sessionId: string, init?: ResponseInit) {
  const response = ok(data, init);
  response.cookies.set("medical_cart_session", sessionId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
