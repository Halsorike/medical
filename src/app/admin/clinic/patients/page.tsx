"use client";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Eye, Pencil } from "lucide-react";
import { patients } from "@/data/clinic";
import { useState } from "react";

export default function PatientsPage() {
  const [q, setQ] = useState("");
  const rows = patients.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader title="Patients" description="All registered patients" action={<Button variant="gradient"><Plus className="mr-1 h-4 w-4" />New patient</Button>} />
      <div className="mb-3"><Input placeholder="Search patients…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" /></div>
      <DataTable
        rows={rows}
        rowKey={(r) => r.id}
        columns={[
          { header: "ID", accessor: (r) => r.id },
          { header: "Patient name", accessor: (r) => r.name },
          { header: "Total appointments", accessor: (r) => r.totalAppointments },
          { header: "Next appointment", accessor: (r) => r.nextAppointment },
          { header: "Employee", accessor: (r) => r.employee },
          { header: "Email", accessor: (r) => r.email },
          { header: "Action", accessor: () => (
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
