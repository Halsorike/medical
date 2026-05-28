"use client";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { services } from "@/data/clinic";
import { formatCurrency } from "@/lib/utils";

export default function ServicesPage() {
  return (
    <>
      <PageHeader title="Services" description="All medical services offered by departments" action={<Button variant="gradient"><Plus className="mr-1 h-4 w-4" />New service</Button>} />
      <DataTable
        rows={services}
        rowKey={(r) => r.id}
        columns={[
          { header: "ID", accessor: (r) => r.id },
          { header: "Service", accessor: (r) => r.name },
          { header: "Department", accessor: (r) => r.department },
          { header: "Total patients", accessor: (r) => r.totalPatients },
          { header: "Total sales", accessor: (r) => formatCurrency(r.totalSales) },
        ]}
      />
      <Pagination total={services.length} />
    </>
  );
}
