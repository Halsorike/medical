"use client";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { schedules } from "@/data/clinic";

export default function SchedulePage() {
  return (
    <>
      <PageHeader title="Schedule" description="Doctor and service availability" action={<Button variant="gradient"><Plus className="mr-1 h-4 w-4" />New schedule</Button>} />
      <DataTable
        rows={schedules}
        rowKey={(r) => r.id}
        columns={[
          { header: "ID", accessor: (r) => r.id },
          { header: "Service", accessor: (r) => r.service },
          { header: "Session type", accessor: (r) => r.sessionType },
          { header: "Period", accessor: (r) => r.period },
          { header: "Date", accessor: (r) => r.date },
          { header: "Time", accessor: (r) => r.time },
          { header: "Employee", accessor: (r) => r.employee },
        ]}
      />
      <Pagination total={schedules.length} />
    </>
  );
}
