import { db } from "@/lib/db";
import { fail, ok } from "@/lib/api";
import { getPatientSessionId } from "@/lib/patient-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const patientId = getPatientSessionId();
  if (!patientId) return fail("Unauthorized", 401);

  const patient = await db.patient.findUnique({
    where: { id: patientId },
    select: { id: true, name: true, email: true, phone: true, createdAt: true },
  });

  if (!patient) return fail("Unauthorized", 401);
  return ok({ user: patient });
}
