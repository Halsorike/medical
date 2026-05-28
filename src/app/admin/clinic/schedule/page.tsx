"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAdminLocale } from "@/components/admin/admin-locale-provider";

type ApiSchedule = {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  maxSlots: number;
  doctor?: { name: string; title: string } | null;
};

export default function SchedulePage() {
  const { labels } = useAdminLocale();
  const [schedules, setSchedules] = useState<ApiSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/schedule")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data: ApiSchedule[] }) => setSchedules(payload.data))
      .catch(() => toast.error("Schedule could not be loaded"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader title={labels.schedule.title} description={labels.schedule.description} action={<Button variant="gradient"><Plus className="mr-1 h-4 w-4" />{labels.common.add}</Button>} />
      <DataTable
        rows={schedules}
        empty={loading ? labels.common.loading : labels.common.noData}
        rowKey={(r) => r.id}
        columns={[
          { header: labels.common.id, accessor: (r) => r.id },
          { header: labels.appointments.service, accessor: (r) => r.doctor?.title ?? "-" },
          { header: labels.schedule.sessionType, accessor: () => "In-Person" },
          { header: labels.schedule.period, accessor: (r) => `${r.maxSlots} slots` },
          { header: labels.appointments.date, accessor: (r) => r.dayOfWeek },
          { header: labels.appointments.time, accessor: (r) => `${r.startTime} - ${r.endTime}` },
          { header: labels.appointments.employee, accessor: (r) => r.doctor?.name ?? "-" },
        ]}
      />
      <Pagination total={schedules.length} />
    </>
  );
}
