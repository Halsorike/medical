import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { fail, ok, orderStatusSchema, toPublicOrder, validationError } from "@/lib/api";
import { sendOrderConfirmationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const orderCreateSchema = z.object({
  status: orderStatusSchema.default("pending"),
  total: z.coerce.number().nonnegative(),
  items: z.array(z.unknown()).min(1),
  shippingAddress: z.record(z.string(), z.unknown()),
  customer: z.string().optional(),
  email: z.string().email().optional(),
  payment: z.enum(["paid", "unpaid", "refunded"]).default("paid"),
});

export async function GET() {
  await ensureSeeded();

  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  return ok(orders.map(toPublicOrder));
}

export async function POST(request: NextRequest) {
  await ensureSeeded();

  const parsed = orderCreateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const code = `#ORD-${Date.now().toString().slice(-5)}`;
  const customerEmail = parsed.data.email ?? String(parsed.data.shippingAddress.email ?? "customer@example.com");
  const order = await db.order.create({
    data: {
      id: crypto.randomUUID(),
      status: parsed.data.status,
      total: parsed.data.total,
      items: JSON.stringify({
        count: parsed.data.items.length,
        lineItems: parsed.data.items,
        code,
        customer: parsed.data.customer ?? String(parsed.data.shippingAddress.name ?? "Store Customer"),
        email: customerEmail,
        payment: parsed.data.payment,
        date: new Date().toISOString(),
      }),
      shippingAddress: JSON.stringify(parsed.data.shippingAddress),
    },
  });

  await sendOrderConfirmationEmail({
    orderId: code,
    to: customerEmail,
    items: parsed.data.items,
    total: parsed.data.total,
    shippingAddress: parsed.data.shippingAddress,
  });

  return ok(toPublicOrder(order), { status: 201 });
}
