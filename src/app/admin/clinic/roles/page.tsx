"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";

type ApiRole = {
  id: string;
  name: string;
  permissions: string;
};

function permissionCount(permissions: string) {
  try {
    const parsed = JSON.parse(permissions) as unknown;
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

export default function RolesPage() {
  const [roles, setRoles] = useState<ApiRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/roles")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data: ApiRole[] }) => setRoles(payload.data))
      .catch(() => toast.error("Roles could not be loaded"))
      .finally(() => setLoading(false));
  }, []);

  async function deleteRole(id: string) {
    if (!window.confirm("Are you sure you want to delete this role?")) return;

    const response = await fetch(`/api/roles/${id}`, { method: "DELETE" });

    if (!response.ok) {
      toast.error("Role could not be deleted");
      return;
    }

    setRoles((current) => current.filter((role) => role.id !== id));
    toast.success("Role deleted");
  }

  return (
    <>
      <PageHeader title="Roles & permission groups" description="Define what each staff role can access" action={<Button variant="gradient"><Plus className="mr-1 h-4 w-4" />New role</Button>} />
      <DataTable
        rows={roles}
        empty={loading ? "Loading roles..." : "No roles."}
        rowKey={(r) => r.id}
        columns={[
          { header: "ID", accessor: (r) => r.id },
          { header: "Role", accessor: (r) => r.name },
          { header: "Members", accessor: () => "-" },
          { header: "Permissions", accessor: (r) => permissionCount(r.permissions) },
          { header: "Action", accessor: (r) => (
            <div className="flex gap-2 text-muted-foreground">
              <button className="hover:text-primary" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
              <button className="hover:text-red-600" aria-label="Delete" onClick={() => void deleteRole(r.id)}><Trash2 className="h-4 w-4" /></button>
            </div>
          ) },
        ]}
      />
      <Pagination total={roles.length} />
    </>
  );
}
