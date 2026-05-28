import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const contactSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  subject: z.string().min(1),
  message: z.string().min(1),
  consent: z.boolean().refine(Boolean),
});

export async function POST(request: NextRequest) {
  await ensureSeeded();

  const parsed = contactSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const message = await db.contactMessage.create({
    data: {
      name: `${parsed.data.firstName} ${parsed.data.lastName}`,
      email: parsed.data.email,
      phone: parsed.data.phone,
      subject: parsed.data.subject,
      message: parsed.data.message,
    },
  });

  return ok({ received: true, id: message.id });
}
