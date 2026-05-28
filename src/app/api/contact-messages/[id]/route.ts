import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { fail, ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const contactMessageUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1).optional(),
  status: z.enum(["new", "read", "replied"]).optional(),
});

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const message = await db.contactMessage.findUnique({ where: { id: params.id } });

  if (!message) {
    return fail("Contact message not found", 404);
  }

  return ok(message);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const parsed = contactMessageUpdateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const existing = await db.contactMessage.findUnique({ where: { id: params.id } });

  if (!existing) {
    return fail("Contact message not found", 404);
  }

  const message = await db.contactMessage.update({
    where: { id: params.id },
    data: parsed.data,
  });

  return ok(message);
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();

  const existing = await db.contactMessage.findUnique({ where: { id: params.id } });

  if (!existing) {
    return fail("Contact message not found", 404);
  }

  await db.contactMessage.delete({ where: { id: params.id } });

  return ok({ deleted: true });
}
