import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureSeeded();

  const [totalPatients, totalDoctors, totalAppointments, totalDepartments, recentPatients, recentAppointments] = await Promise.all([
    db.patient.count(),
    db.doctor.count(),
    db.appointment.count(),
    db.department.count(),
    db.patient.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    db.appointment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return ok({
    totalPatients,
    totalDoctors,
    totalAppointments,
    totalDepartments,
    recentPatients,
    recentAppointments,
  });
}
