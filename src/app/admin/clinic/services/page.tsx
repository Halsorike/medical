"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useAdminLocale } from "@/components/admin/admin-locale-provider";

type ApiService = {
  id: string;
  name: string;
  price?: number | null;
  duration?: number | null;
  department?: { name: string } | null;
};

export default function ServicesPage() {
  const { labels } = useAdminLocale();
  const [services, setServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/services")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data: ApiService[] }) => setServices(payload.data))
      .catch(() => toast.error("Services could not be loaded"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader title={labels.services.title} description={labels.services.description} action={<Button variant="gradient"><Plus className="mr-1 h-4 w-4" />{labels.common.add}</Button>} />
      <DataTable
        rows={services}
        empty={loading ? labels.common.loading : labels.common.noData}
        rowKey={(r) => r.id}
        columns={[
          { header: labels.common.id, accessor: (r) => r.id },
          { header: labels.services.name, accessor: (r) => r.name },
          { header: labels.services.department, accessor: (r) => r.department?.name ?? "-" },
          { header: labels.services.duration, accessor: (r) => (r.duration ? `${r.duration} min` : "-") },
          { header: labels.services.price, accessor: (r) => formatCurrency(r.price ?? 0) },
        ]}
      />
      <Pagination total={services.length} />
    </>
  );
}
