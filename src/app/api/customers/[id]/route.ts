import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { fail, ok, toPublicOrder, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const customerUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const customer = await db.customer.findUnique({ where: { id: params.id } });

  if (!customer) {
    return fail("Customer not found", 404);
  }

  const orders = (await db.order.findMany()).map(toPublicOrder).filter((order) => order.email === customer.email || order.customer === customer.name);

  return ok({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone ?? "",
    address: customer.address ?? "",
    orders: orders.length,
    spent: orders.reduce((sum, order) => sum + order.total, 0),
    joined: customer.createdAt.toISOString(),
    status: "active",
    orderHistory: orders,
  });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const parsed = customerUpdateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const existing = await db.customer.findUnique({ where: { id: params.id } });

  if (!existing) {
    return fail("Customer not found", 404);
  }

  const customer = await db.customer.update({
    where: { id: params.id },
    data: parsed.data,
  });

  return ok({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone ?? "",
    address: customer.address ?? "",
    joined: customer.createdAt.toISOString(),
    status: "active",
  });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const existing = await db.customer.findUnique({ where: { id: params.id } });

  if (!existing) {
    return fail("Customer not found", 404);
  }

  await db.customer.delete({ where: { id: params.id } });

  return ok({ deleted: true });
}
