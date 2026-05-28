"use client";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { employees } from "@/data/clinic";
import { useState } from "react";

export default function TeamPage() {
  const [q, setQ] = useState("");
  const rows = employees.filter((e) => e.name.toLowerCase().includes(q.toLowerCase()) || e.email.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader
        title="Team"
        description="Doctors, nurses and other staff"
        action={
          <div className="flex gap-2">
            <Link href="/admin/clinic/roles"><Button variant="outline">Permission groups</Button></Link>
            <Link href="/admin/clinic/team/new"><Button variant="gradient"><Plus className="mr-1 h-4 w-4" /> New employee</Button></Link>
          </div>
        }
      />
      <div className="mb-3 flex gap-2"><Input placeholder="Search team…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" /></div>
      <DataTable
        rows={rows}
        rowKey={(r) => r.id}
        columns={[
          { header: "ID", accessor: (r) => r.id },
          { header: "Employee", accessor: (r) => r.name },
          { header: "Email", accessor: (r) => r.email },
          { header: "Phone", accessor: (r) => r.phone },
          { header: "Department", accessor: (r) => r.department },
          { header: "Role", accessor: (r) => r.role },
          { header: "Status", accessor: (r) => <StatusBadge value={r.status} /> },
          { header: "Action", accessor: () => (
            <div className="flex gap-2 text-muted-foreground">
              <button className="hover:text-primary" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
              <button className="hover:text-red-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
            </div>
          ) },
        ]}
      />
      <Pagination total={rows.length} />
    </>
  );
}
