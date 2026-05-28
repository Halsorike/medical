"use client";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { contactRequests } from "@/data/clinic";

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Contact us" description="Inbound requests from the public website" />
      <DataTable
        rows={contactRequests}
        rowKey={(r) => r.id}
        columns={[
          { header: "ID", accessor: (r) => r.id },
          { header: "Name", accessor: (r) => r.name },
          { header: "Phone", accessor: (r) => r.phone },
          { header: "Email", accessor: (r) => r.email },
          { header: "Message", accessor: (r) => <span className="line-clamp-1 max-w-md">{r.message}</span> },
          { header: "Date", accessor: (r) => r.date },
          { header: "Status", accessor: (r) => <StatusBadge value={r.status} /> },
        ]}
      />
      <Pagination total={contactRequests.length} />
    </>
  );
}
