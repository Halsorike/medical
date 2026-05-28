"use client";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { clinicStats, appointments, patients, appointmentSeries } from "@/data/clinic";
import { CalendarCheck, CheckCircle2, XCircle, Clock } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const icons = [CalendarCheck, CheckCircle2, XCircle, Clock];

export default function ClinicDashboard() {
  const upcoming = appointments.filter((a) => a.status === "upcoming").slice(0, 6);
  return (
    <>
      <PageHeader title="Clinic dashboard" description="Appointments, patients, and staff at a glance" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {clinicStats.map((s, i) => <StatCard key={s.label} label={s.label} value={String(s.value)} icon={icons[i]} hint="this month" />)}
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
            {patients.slice(0, 6).map((p) => (
              <li key={p.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                <span>{p.name}</span><span className="text-xs text-muted-foreground">{p.totalAppointments} appts</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6">
        <p className="mb-3 font-semibold">Upcoming appointments</p>
        <DataTable
          rows={upcoming}
          rowKey={(r) => r.id}
          columns={[
            { header: "#", accessor: (r) => r.id },
            { header: "Patient", accessor: (r) => r.patientName },
            { header: "Type", accessor: (r) => r.type },
            { header: "Details", accessor: (r) => r.details },
            { header: "Date", accessor: (r) => r.date },
            { header: "Time", accessor: (r) => r.time },
            { header: "Employee", accessor: (r) => r.employee },
            { header: "Status", accessor: (r) => <StatusBadge value={r.status} /> },
          ]}
        />
      </div>
    </>
  );
}
