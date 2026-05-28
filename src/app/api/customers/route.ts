import { NextRequest } from "next/server";
import { z } from "zod";
import type { Customer as DbCustomer, Order as DbOrder } from "@prisma/client";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { fail, ok, toPublicOrder, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const customerCreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

function toPublicCustomer(customer: DbCustomer, orders: DbOrder[]) {
  const matchingOrders = orders.map(toPublicOrder).filter((order) => order.email === customer.email || order.customer === customer.name);

  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone ?? "",
    address: customer.address ?? "",
    orders: matchingOrders.length,
    spent: matchingOrders.reduce((sum, order) => sum + order.total, 0),
    joined: customer.createdAt.toISOString(),
    status: "active" as const,
  };
}

export async function GET() {
  await ensureSeeded();

  const [customers, orders] = await Promise.all([
    db.customer.findMany({ orderBy: { createdAt: "desc" } }),
    db.order.findMany(),
  ]);

  return ok(customers.map((customer) => toPublicCustomer(customer, orders)));
}

export async function POST(request: NextRequest) {
  await ensureSeeded();

  const parsed = customerCreateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  try {
    const customer = await db.customer.create({
      data: {
        id: crypto.randomUUID(),
        ...parsed.data,
      },
    });

    return ok(toPublicCustomer(customer, []), { status: 201 });
  } catch {
    return fail("Customer could not be created", 409);
  }
}
