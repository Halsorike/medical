"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type ApiSchedule = {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  maxSlots: number;
  doctor?: { name: string; title: string } | null;
};

export default function SchedulePage() {
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
      <PageHeader title="Schedule" description="Doctor and service availability" action={<Button variant="gradient"><Plus className="mr-1 h-4 w-4" />New schedule</Button>} />
      <DataTable
        rows={schedules}
        empty={loading ? "Loading schedules..." : "No schedules."}
        rowKey={(r) => r.id}
        columns={[
          { header: "ID", accessor: (r) => r.id },
          { header: "Service", accessor: (r) => r.doctor?.title ?? "-" },
          { header: "Session type", accessor: () => "In-Person" },
          { header: "Period", accessor: (r) => `${r.maxSlots} slots` },
          { header: "Date", accessor: (r) => r.dayOfWeek },
          { header: "Time", accessor: (r) => `${r.startTime} - ${r.endTime}` },
          { header: "Employee", accessor: (r) => r.doctor?.name ?? "-" },
        ]}
      />
      <Pagination total={schedules.length} />
    </>
  );
}
