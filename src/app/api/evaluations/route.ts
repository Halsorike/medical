import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const evaluationSchema = z.object({
  patientName: z.string().min(1),
  age: z.coerce.number().int().min(1).max(120),
  email: z.string().email(),
  phone: z.string().optional(),
  answers: z.record(z.string(), z.string()),
  score: z.coerce.number().int().min(0),
});

export async function GET() {
  const evaluations = await db.evaluation.findMany({
    orderBy: { createdAt: "desc" },
  });

  return ok(evaluations);
}

export async function POST(request: NextRequest) {
  const parsed = evaluationSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const evaluation = await db.evaluation.create({
    data: {
      patientName: parsed.data.patientName,
      age: parsed.data.age,
      email: parsed.data.email,
      phone: parsed.data.phone,
      answers: JSON.stringify(parsed.data.answers),
      score: parsed.data.score,
    },
  });

  return ok(evaluation, { status: 201 });
}
