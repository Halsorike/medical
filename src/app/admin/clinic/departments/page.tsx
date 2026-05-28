"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAdminLocale } from "@/components/admin/admin-locale-provider";

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
  const { labels } = useAdminLocale();
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
    if (!window.confirm(labels.common.confirmDelete)) return;

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
        title={labels.departments.title}
        description={labels.departments.description}
        action={
          <Button asChild variant="gradient">
            <Link href="/admin/clinic/departments/new"><Plus className="mr-1 h-4 w-4" />{labels.departments.newDepartment}</Link>
          </Button>
        }
      />
      <DataTable
        rows={departments}
        empty={loading ? labels.common.loading : labels.common.noData}
        rowKey={(r) => r.id}
        columns={[
          { header: labels.common.id, accessor: (r) => r.id },
          { header: labels.departments.name, accessor: (r) => r.name },
          { header: labels.departments.services, accessor: (r) => r._count?.services ?? 0 },
          { header: labels.departments.doctors, accessor: (r) => r._count?.doctors ?? 0 },
          { header: labels.departments.descriptionLabel, accessor: (r) => r.description ?? "-" },
          { header: labels.departments.head, accessor: () => "-" },
          { header: labels.common.actions, accessor: (r) => (
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
