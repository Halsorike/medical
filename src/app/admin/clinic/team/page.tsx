"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2 } from "lucide-react";

type ApiDoctor = {
  id: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  specialization: string;
  status: string;
  department?: { name: string } | null;
};

export default function TeamPage() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<ApiDoctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const query = q ? `?search=${encodeURIComponent(q)}` : "";

    fetch(`/api/doctors${query}`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data: ApiDoctor[] }) => setRows(payload.data))
      .catch(() => toast.error("Team could not be loaded"))
      .finally(() => setLoading(false));
  }, [q]);

  async function deleteDoctor(id: string) {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    const response = await fetch(`/api/doctors/${id}`, { method: "DELETE" });

    if (!response.ok) {
      toast.error("Doctor could not be deleted");
      return;
    }

    setRows((current) => current.filter((doctor) => doctor.id !== id));
    toast.success("Doctor deleted");
  }
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
        empty={loading ? "Loading team..." : "No team members."}
        rowKey={(r) => r.id}
        columns={[
          { header: "ID", accessor: (r) => r.id },
          { header: "Employee", accessor: (r) => r.name },
          { header: "Email", accessor: (r) => r.email },
          { header: "Phone", accessor: (r) => r.phone },
          { header: "Department", accessor: (r) => r.department?.name ?? "-" },
          { header: "Role", accessor: (r) => r.title },
          { header: "Status", accessor: (r) => <StatusBadge value={r.status} /> },
          { header: "Action", accessor: (r) => (
            <div className="flex gap-2 text-muted-foreground">
              <button className="hover:text-primary" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
              <button className="hover:text-red-600" aria-label="Delete" onClick={() => void deleteDoctor(r.id)}><Trash2 className="h-4 w-4" /></button>
            </div>
          ) },
        ]}
      />
      <Pagination total={rows.length} />
    </>
  );
}
