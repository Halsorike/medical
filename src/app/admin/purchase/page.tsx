"use client";
import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type PO = { id: string; supplier: string; contact: string; date: string; total: number; status: "draft" | "ordered" | "completed" | "cancelled" };
const purchaseOrders: PO[] = [
  { id: "PO-1234", supplier: "MedSupply Inc.", contact: "ops@medsupply.com", date: "16 Dec 2024", total: 1820, status: "completed" },
  { id: "PO-1235", supplier: "GlobalGloves", contact: "sales@globalgloves.io", date: "18 Dec 2024", total: 320, status: "ordered" },
  { id: "PO-1236", supplier: "PharmaPlus", contact: "billing@pharmaplus.com", date: "20 Dec 2024", total: 2980, status: "draft" },
  { id: "PO-1237", supplier: "EquipCare", contact: "team@equipcare.com", date: "22 Dec 2024", total: 540, status: "completed" },
];

export default function PurchaseOrders() {
  const [q, setQ] = useState("");
  const rows = purchaseOrders.filter((p) => p.supplier.toLowerCase().includes(q.toLowerCase()) || p.id.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader title="Purchase orders" description="Inventory & supplier orders" action={<Link href="/admin/purchase/new"><Button variant="gradient"><Plus className="mr-1 h-4 w-4" />New purchase order</Button></Link>} />
      <div className="mb-3"><Input placeholder="Search supplier or PO #…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" /></div>
      <DataTable
        rows={rows}
        rowKey={(r) => r.id}
        columns={[
          { header: "Order", accessor: (r) => <Link href={`/admin/purchase/${r.id}`} className="text-primary hover:underline">{r.id}</Link> },
          { header: "Supplier name", accessor: (r) => r.supplier },
          { header: "Contact details", accessor: (r) => r.contact },
          { header: "Date", accessor: (r) => r.date },
          { header: "Total", accessor: (r) => formatCurrency(r.total) },
          { header: "Status", accessor: (r) => <StatusBadge value={r.status} /> },
        ]}
      />
      <Pagination total={rows.length} />
    </>
  );
}
