"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Plus, Bell, Printer, Check } from "lucide-react";

type ApiAppointment = {
  id: string;
  patientName: string;
  department: string;
  service: string;
  date: string;
  slot: string;
  status: string;
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<ApiAppointment[]>([]);

  useEffect(() => {
    fetch("/api/appointments")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data: ApiAppointment[] }) => setAppointments(payload.data))
      .catch(() => toast.error("Appointments could not be loaded"));
  }, []);

  async function updateAppointment(id: string, status: "upcoming" | "done" | "cancelled") {
    const response = await fetch(`/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      toast.error("Appointment could not be updated");
      return;
    }

    setAppointments((current) => current.map((appointment) => (appointment.id === id ? { ...appointment, status } : appointment)));
    toast.success("Appointment updated");
  }

  return (
    <>
      <PageHeader title="Appointments" description="Manage upcoming, done and cancelled appointments"
        action={<Link href="/admin/clinic/appointments/new"><Button variant="gradient"><Plus className="mr-1 h-4 w-4" />New appointment</Button></Link>} />
      <DataTable
        rows={appointments}
        rowKey={(r) => r.id}
        columns={[
          { header: "Appointment ID", accessor: (r) => r.id },
          { header: "Patient", accessor: (r) => r.patientName },
          { header: "Appointment type", accessor: () => "In-Person" },
          { header: "Details", accessor: (r) => r.service },
          { header: "Date", accessor: (r) => r.date },
          { header: "Time", accessor: (r) => r.slot },
          { header: "Employee", accessor: (r) => r.department },
          { header: "Status", accessor: (r) => <StatusBadge value={r.status} /> },
          { header: "Quick action", accessor: (r) => (
            <div className="flex gap-2 text-muted-foreground">
              <button className="hover:text-green-600" aria-label="Approve" onClick={() => void updateAppointment(r.id, "done")}><Check className="h-4 w-4" /></button>
              <button className="hover:text-primary" aria-label="Notify"><Bell className="h-4 w-4" /></button>
              <button className="hover:text-primary" aria-label="Print"><Printer className="h-4 w-4" /></button>
            </div>
          ) },
        ]}
      />
      <Pagination total={appointments.length} />
    </>
  );
}
