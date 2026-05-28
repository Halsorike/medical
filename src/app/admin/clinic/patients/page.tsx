"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Eye, Pencil } from "lucide-react";
import { useAdminLocale } from "@/components/admin/admin-locale-provider";

type ApiPatient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string | null;
  gender?: string | null;
  createdAt: string;
  appointments?: unknown[];
};

export default function PatientsPage() {
  const { labels } = useAdminLocale();
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<ApiPatient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const query = q ? `?search=${encodeURIComponent(q)}` : "";

    fetch(`/api/patients${query}`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data: ApiPatient[] }) => setRows(payload.data))
      .catch(() => toast.error("Patients could not be loaded"))
      .finally(() => setLoading(false));
  }, [q]);
  return (
    <>
      <PageHeader title={labels.patients.title} description={labels.patients.description} action={<Button variant="gradient"><Plus className="mr-1 h-4 w-4" />{labels.patients.newPatient}</Button>} />
      <div className="mb-3"><Input placeholder="Search patients…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" /></div>
      <DataTable
        rows={rows}
        empty={loading ? labels.common.loading : labels.common.noData}
        rowKey={(r) => r.id}
        columns={[
          { header: labels.common.id, accessor: (r) => r.id },
          { header: labels.patients.name, accessor: (r) => r.name },
          { header: labels.patients.appointments, accessor: (r) => r.appointments?.length ?? 0 },
          { header: labels.patients.phone, accessor: (r) => r.phone },
          { header: labels.patients.gender, accessor: (r) => r.gender ?? "-" },
          { header: labels.patients.email, accessor: (r) => r.email },
          { header: labels.patients.actions, accessor: () => (
            <div className="flex gap-2 text-muted-foreground">
              <button className="hover:text-primary" aria-label="View"><Eye className="h-4 w-4" /></button>
              <button className="hover:text-primary" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
            </div>
          ) },
        ]}
      />
      <Pagination total={rows.length} />
    </>
  );
}
