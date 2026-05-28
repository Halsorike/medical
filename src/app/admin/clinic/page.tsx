"use client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { CalendarCheck, Stethoscope, Users, Building2 } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

type DashboardStats = {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  totalDepartments: number;
  recentPatients: Array<{ id: string; name: string; appointments?: unknown[] }>;
  recentAppointments: Array<{
    id: string;
    patientName: string;
    department: string;
    service: string;
    date: string;
    slot: string;
    status: string;
  }>;
};

const icons = [Users, Stethoscope, CalendarCheck, Building2];

export default function ClinicDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalDepartments: 0,
    recentPatients: [],
    recentAppointments: [],
  });

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data: DashboardStats }) => setStats(payload.data))
      .catch(() => toast.error("Dashboard stats could not be loaded"));
  }, []);

  const cards = [
    { label: "Patients", value: stats.totalPatients },
    { label: "Doctors", value: stats.totalDoctors },
    { label: "Appointments", value: stats.totalAppointments },
    { label: "Departments", value: stats.totalDepartments },
  ];

  const appointmentSeries = useMemo(
    () =>
      stats.recentAppointments.map((appointment, index) => ({
        month: appointment.date || `#${index + 1}`,
        appts: index + 1,
      })),
    [stats.recentAppointments]
  );

  return (
    <>
      <PageHeader title="Clinic dashboard" description="Appointments, patients, and staff at a glance" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((s, i) => <StatCard key={s.label} label={s.label} value={String(s.value)} icon={icons[i]} hint="from database" />)}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border bg-white p-4">
          <p className="mb-2 font-semibold">Appointments calendar</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={appointmentSeries}>
              <defs><linearGradient id="apx" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a855f7" stopOpacity={0.4} /><stop offset="100%" stopColor="#a855f7" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip />
              <Area type="monotone" dataKey="appts" stroke="#9333ea" fill="url(#apx)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="mb-3 font-semibold">Recent patients</p>
          <ul className="space-y-2 text-sm">
            {stats.recentPatients.slice(0, 6).map((p) => (
              <li key={p.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                <span>{p.name}</span><span className="text-xs text-muted-foreground">{p.appointments?.length ?? 0} appts</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6">
        <p className="mb-3 font-semibold">Recent appointments</p>
        <DataTable
          rows={stats.recentAppointments}
          rowKey={(r) => r.id}
          columns={[
            { header: "#", accessor: (r) => r.id },
            { header: "Patient", accessor: (r) => r.patientName },
            { header: "Type", accessor: () => "In-Person" },
            { header: "Details", accessor: (r) => r.service },
            { header: "Date", accessor: (r) => r.date },
            { header: "Time", accessor: (r) => r.slot },
            { header: "Employee", accessor: (r) => r.department },
            { header: "Status", accessor: (r) => <StatusBadge value={r.status} /> },
          ]}
        />
      </div>
    </>
  );
}
