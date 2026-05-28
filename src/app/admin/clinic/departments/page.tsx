"use client";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { departments } from "@/data/clinic";

export default function DepartmentsPage() {
  return (
    <>
      <PageHeader
        title="Departments"
        description="Clinical departments and ownership"
        action={
          <Button asChild variant="gradient">
            <Link href="/admin/clinic/departments/new"><Plus className="mr-1 h-4 w-4" />New Department</Link>
          </Button>
        }
      />
      <DataTable
        rows={departments}
        rowKey={(r) => r.id}
        columns={[
          { header: "ID", accessor: (r) => r.id },
          { header: "Department", accessor: (r) => r.name },
          { header: "Total services", accessor: (r) => r.services },
          { header: "Total employees", accessor: (r) => r.employees },
          { header: "Total patients", accessor: (r) => r.patients },
          { header: "Head", accessor: (r) => r.head },
          { header: "Action", accessor: () => (
            <div className="flex gap-2 text-muted-foreground">
              <button className="hover:text-primary" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
              <button className="hover:text-red-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
            </div>
          ) },
        ]}
      />
      <Pagination total={departments.length} />
    </>
  );
}
