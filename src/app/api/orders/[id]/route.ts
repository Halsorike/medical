import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { fail, ok, orderStatusSchema, toPublicOrder, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const orderUpdateSchema = z.object({
  status: orderStatusSchema.optional(),
});

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const order = await db.order.findUnique({ where: { id: params.id } });

  if (!order) {
    return fail("Order not found", 404);
  }

  return ok(toPublicOrder(order));
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const parsed = orderUpdateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const existing = await db.order.findUnique({ where: { id: params.id } });

  if (!existing) {
    return fail("Order not found", 404);
  }

  const order = await db.order.update({
    where: { id: params.id },
    data: parsed.data,
  });

  return ok(toPublicOrder(order));
}
