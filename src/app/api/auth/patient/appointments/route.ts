import { db } from "@/lib/db";
import { fail, ok } from "@/lib/api";
import { getPatientSessionId } from "@/lib/patient-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const patientId = getPatientSessionId();
  if (!patientId) return fail("Unauthorized", 401);

  const appointments = await db.appointment.findMany({
    where: { patientId },
    orderBy: { createdAt: "desc" },
  });

  return ok(appointments);
}
