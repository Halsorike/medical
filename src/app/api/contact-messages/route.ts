import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { fail, ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const contactMessageCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1),
});

export async function GET(request: NextRequest) {
  await ensureSeeded();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const where: Prisma.ContactMessageWhereInput = status ? { status } : {};

  const messages = await db.contactMessage.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return ok(messages);
}

export async function POST(request: NextRequest) {
  await ensureSeeded();

  const parsed = contactMessageCreateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  try {
    const message = await db.contactMessage.create({
      data: parsed.data,
    });

    return ok(message, { status: 201 });
  } catch {
    return fail("Contact message could not be created", 409);
  }
}
