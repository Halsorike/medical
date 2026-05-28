"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";

type ApiDepartment = {
  id: string;
  name: string;
  description?: string | null;
  _count?: {
    doctors: number;
    services: number;
  };
};

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<ApiDepartment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/departments")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data: ApiDepartment[] }) => setDepartments(payload.data))
      .catch(() => toast.error("Departments could not be loaded"))
      .finally(() => setLoading(false));
  }, []);

  async function deleteDepartment(id: string) {
    if (!window.confirm("Are you sure you want to delete this department?")) return;

    const response = await fetch(`/api/departments/${id}`, { method: "DELETE" });

    if (!response.ok) {
      toast.error("Department could not be deleted");
      return;
    }

    setDepartments((current) => current.filter((department) => department.id !== id));
    toast.success("Department deleted");
  }

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
        empty={loading ? "Loading departments..." : "No departments."}
        rowKey={(r) => r.id}
        columns={[
          { header: "ID", accessor: (r) => r.id },
          { header: "Department", accessor: (r) => r.name },
          { header: "Total services", accessor: (r) => r._count?.services ?? 0 },
          { header: "Total employees", accessor: (r) => r._count?.doctors ?? 0 },
          { header: "Description", accessor: (r) => r.description ?? "-" },
          { header: "Head", accessor: () => "-" },
          { header: "Action", accessor: (r) => (
            <div className="flex gap-2 text-muted-foreground">
              <button className="hover:text-primary" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
              <button className="hover:text-red-600" aria-label="Delete" onClick={() => void deleteDepartment(r.id)}><Trash2 className="h-4 w-4" /></button>
            </div>
          ) },
        ]}
      />
      <Pagination total={departments.length} />
    </>
  );
}
