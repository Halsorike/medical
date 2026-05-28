"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type ApiService = {
  id: string;
  name: string;
  price?: number | null;
  duration?: number | null;
  department?: { name: string } | null;
};

export default function ServicesPage() {
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
      <PageHeader title="Services" description="All medical services offered by departments" action={<Button variant="gradient"><Plus className="mr-1 h-4 w-4" />New service</Button>} />
      <DataTable
        rows={services}
        empty={loading ? "Loading services..." : "No services."}
        rowKey={(r) => r.id}
        columns={[
          { header: "ID", accessor: (r) => r.id },
          { header: "Service", accessor: (r) => r.name },
          { header: "Department", accessor: (r) => r.department?.name ?? "-" },
          { header: "Duration", accessor: (r) => (r.duration ? `${r.duration} min` : "-") },
          { header: "Price", accessor: (r) => formatCurrency(r.price ?? 0) },
        ]}
      />
      <Pagination total={services.length} />
    </>
  );
}
