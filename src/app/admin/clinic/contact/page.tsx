"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { useAdminLocale } from "@/components/admin/admin-locale-provider";

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
  const { labels } = useAdminLocale();
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
      <PageHeader title={labels.contact.title} description={labels.contact.description} />
      <DataTable
        rows={contactRequests}
        empty={loading ? labels.common.loading : labels.common.noData}
        rowKey={(r) => r.id}
        columns={[
          { header: labels.common.id, accessor: (r) => r.id },
          { header: labels.patients.name, accessor: (r) => r.name },
          { header: labels.patients.phone, accessor: (r) => r.phone },
          { header: labels.patients.email, accessor: (r) => r.email },
          { header: labels.contact.message, accessor: (r) => <span className="line-clamp-1 max-w-md">{r.message}</span> },
          { header: labels.appointments.date, accessor: (r) => new Date(r.createdAt).toLocaleDateString() },
          { header: labels.appointments.status, accessor: (r) => <StatusBadge value={r.status} /> },
        ]}
      />
      <Pagination total={contactRequests.length} />
    </>
  );
}
