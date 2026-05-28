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
import { useAdminLocale } from "@/components/admin/admin-locale-provider";

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
  const { labels } = useAdminLocale();
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
    if (!window.confirm(labels.common.confirmDelete)) return;

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
        title={labels.team.title}
        description={labels.team.description}
        action={
          <div className="flex gap-2">
            <Link href="/admin/clinic/roles"><Button variant="outline">{labels.team.permissionGroups}</Button></Link>
            <Link href="/admin/clinic/team/new"><Button variant="gradient"><Plus className="mr-1 h-4 w-4" /> {labels.team.newMember}</Button></Link>
          </div>
        }
      />
      <div className="mb-3 flex gap-2"><Input placeholder="Search team…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" /></div>
      <DataTable
        rows={rows}
        empty={loading ? labels.common.loading : labels.common.noData}
        rowKey={(r) => r.id}
        columns={[
          { header: labels.common.id, accessor: (r) => r.id },
          { header: labels.team.name, accessor: (r) => r.name },
          { header: labels.team.email, accessor: (r) => r.email },
          { header: labels.team.phone, accessor: (r) => r.phone },
          { header: labels.team.department, accessor: (r) => r.department?.name ?? "-" },
          { header: labels.team.role, accessor: (r) => r.title },
          { header: labels.team.status, accessor: (r) => <StatusBadge value={r.status} /> },
          { header: labels.common.actions, accessor: (r) => (
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
