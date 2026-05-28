"use client";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { roles } from "@/data/clinic";

export default function RolesPage() {
  return (
    <>
      <PageHeader title="Roles & permission groups" description="Define what each staff role can access" action={<Button variant="gradient"><Plus className="mr-1 h-4 w-4" />New role</Button>} />
      <DataTable
        rows={roles}
        rowKey={(r) => r.id}
        columns={[
          { header: "ID", accessor: (r) => r.id },
          { header: "Role", accessor: (r) => r.name },
          { header: "Members", accessor: (r) => r.members },
          { header: "Permissions", accessor: (r) => r.permissions },
          { header: "Action", accessor: () => (
            <div className="flex gap-2 text-muted-foreground">
              <button className="hover:text-primary" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
              <button className="hover:text-red-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
            </div>
          ) },
        ]}
      />
      <Pagination total={roles.length} />
    </>
  );
}
