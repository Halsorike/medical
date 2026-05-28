"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Appointment = {
  id: string;
  department: string;
  service: string;
  date: string;
  slot: string;
  status: "pending" | "upcoming" | "done" | "cancelled";
};

const statusVariant: Record<Appointment["status"], BadgeProps["variant"]> = {
  pending: "warning",
  upcoming: "info",
  done: "success",
  cancelled: "destructive",
};

export default function MyAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/patient/appointments")
      .then((response) => {
        if (response.status === 401) {
          router.push("/login");
          return null;
        }
        return response.ok ? response.json() : Promise.reject();
      })
      .then((payload: { data: Appointment[] } | null) => {
        if (payload) setAppointments(payload.data);
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return <div className="rounded-lg border bg-white p-8 text-sm text-muted-foreground">Loading appointments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Appointments</h1>
          <p className="text-sm text-muted-foreground">Your upcoming and past clinic bookings.</p>
        </div>
        <Button asChild variant="gradient">
          <Link href="/book-appointment">Book Appointment</Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        {appointments.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.slot}</TableCell>
                  <TableCell>{appointment.department}</TableCell>
                  <TableCell>{appointment.service}</TableCell>
                  <TableCell><Badge variant={statusVariant[appointment.status]}>{appointment.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No appointments yet.
          </div>
        )}
      </div>
    </div>
  );
}
