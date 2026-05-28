import { NextRequest } from "next/server";
import { z } from "zod";
import { ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const newsletterSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  const parsed = newsletterSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  return ok({ subscribed: true, email: parsed.data.email });
}
