"use client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { CalendarCheck, Stethoscope, Users, Building2 } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useAdminLocale } from "@/components/admin/admin-locale-provider";

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
  const { labels } = useAdminLocale();
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
    { label: labels.dashboard.totalPatients, value: stats.totalPatients },
    { label: labels.dashboard.totalDoctors, value: stats.totalDoctors },
    { label: labels.dashboard.totalAppointments, value: stats.totalAppointments },
    { label: labels.dashboard.totalDepartments, value: stats.totalDepartments },
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
      <PageHeader title={labels.dashboard.title} description={labels.dashboard.description} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((s, i) => <StatCard key={s.label} label={s.label} value={String(s.value)} icon={icons[i]} hint={labels.common.fromDatabase} />)}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border bg-white p-4">
          <p className="mb-2 font-semibold">{labels.dashboard.appointmentsCalendar}</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={appointmentSeries}>
              <defs><linearGradient id="apx" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a855f7" stopOpacity={0.4} /><stop offset="100%" stopColor="#a855f7" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip />
              <Area type="monotone" dataKey="appts" stroke="#9333ea" fill="url(#apx)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="mb-3 font-semibold">{labels.dashboard.recentPatients}</p>
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
        <p className="mb-3 font-semibold">{labels.dashboard.recentAppointments}</p>
        <DataTable
          rows={stats.recentAppointments}
          rowKey={(r) => r.id}
          columns={[
            { header: labels.common.id, accessor: (r) => r.id },
            { header: labels.appointments.patient, accessor: (r) => r.patientName },
            { header: labels.appointments.service, accessor: (r) => r.service },
            { header: labels.appointments.date, accessor: (r) => r.date },
            { header: labels.appointments.time, accessor: (r) => r.slot },
            { header: labels.appointments.employee, accessor: (r) => r.department },
            { header: labels.appointments.status, accessor: (r) => <StatusBadge value={r.status} /> },
          ]}
        />
      </div>
    </>
  );
}
