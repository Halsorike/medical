import { NextRequest } from "next/server";
import { z } from "zod";
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
  const parsed = contactSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  return ok({ received: true });
}
