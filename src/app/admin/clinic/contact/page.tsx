"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";

type ApiContactMessage = {
  id: string;
  name: string;
  phone?: string | null;
  email: string;
  message: string;
  createdAt: string;
  status: string;
};

export default function ContactPage() {
  const [contactRequests, setContactRequests] = useState<ApiContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/contact-messages")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data: ApiContactMessage[] }) => setContactRequests(payload.data))
      .catch(() => toast.error("Contact messages could not be loaded"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader title="Contact us" description="Inbound requests from the public website" />
      <DataTable
        rows={contactRequests}
        empty={loading ? "Loading contact messages..." : "No contact messages."}
        rowKey={(r) => r.id}
        columns={[
          { header: "ID", accessor: (r) => r.id },
          { header: "Name", accessor: (r) => r.name },
          { header: "Phone", accessor: (r) => r.phone },
          { header: "Email", accessor: (r) => r.email },
          { header: "Message", accessor: (r) => <span className="line-clamp-1 max-w-md">{r.message}</span> },
          { header: "Date", accessor: (r) => new Date(r.createdAt).toLocaleDateString() },
          { header: "Status", accessor: (r) => <StatusBadge value={r.status} /> },
        ]}
      />
      <Pagination total={contactRequests.length} />
    </>
  );
}
