"use client";
import { useState } from "react";
import { toast } from "sonner";
import { orders } from "@/data/orders";
import { PageHeader } from "@/components/admin/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Check, X } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

type Row = { id: string; code: string; date: string; total: number; customer: string; reason: string; status: "pending" | "approved" | "rejected" };

const base = orders.slice(0, 12).map((o, i) => ({
  id: o.id, code: o.code, date: o.date, total: o.total, customer: o.customer,
  reason: ["Damaged item", "Wrong item", "Changed mind", "Late delivery"][i % 4],
  status: (["pending", "approved", "rejected"] as const)[i % 3],
})) as Row[];

const rejectReasons = ["Outside return window", "Item used or worn", "Missing original packaging", "Final-sale product"];

export default function Refunds() {
  const requests = base.filter((r) => r.status === "pending");
  const approved = base.filter((r) => r.status === "approved");
  const rejected = base.filter((r) => r.status === "rejected");
  const [config, setConfig] = useState({ window: "14", autoApproveBelow: "20", allowPartial: true });

  const cols = [
    { header: "ID", accessor: (r: Row) => r.id.slice(0, 6) },
    { header: "Order code", accessor: (r: Row) => r.code },
    { header: "Date & time", accessor: (r: Row) => formatDate(r.date) },
    { header: "Customer", accessor: (r: Row) => r.customer },
    { header: "Total", accessor: (r: Row) => formatCurrency(r.total) },
    { header: "Reason", accessor: (r: Row) => r.reason },
    { header: "Status", accessor: (r: Row) => <StatusBadge value={r.status} /> },
    { header: "Action", accessor: () => (
      <div className="flex gap-2 text-muted-foreground">
        <button className="hover:text-green-600" aria-label="Approve"><Check className="h-4 w-4" /></button>
        <button className="hover:text-red-600" aria-label="Reject"><X className="h-4 w-4" /></button>
      </div>
    ) },
  ];

  return (
    <>
      <PageHeader title="Refunds" description="Refund requests, history and configuration" />
      <Tabs defaultValue="requests">
        <TabsList>
          <TabsTrigger value="requests">Refund requests</TabsTrigger>
          <TabsTrigger value="approved">Approved refunds</TabsTrigger>
          <TabsTrigger value="rejected">Rejected refunds</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>
        <TabsContent value="requests"><DataTable rows={requests} rowKey={(r) => r.id} columns={cols} /><Pagination total={requests.length} /></TabsContent>
        <TabsContent value="approved"><DataTable rows={approved} rowKey={(r) => r.id} columns={cols} /><Pagination total={approved.length} /></TabsContent>
        <TabsContent value="rejected"><DataTable rows={rejected} rowKey={(r) => r.id} columns={cols} /><Pagination total={rejected.length} /></TabsContent>
        <TabsContent value="config">
          <div className="grid gap-4 lg:grid-cols-2">
            <form onSubmit={(e) => { e.preventDefault(); toast.success("Configuration saved"); }} className="space-y-3 rounded-lg border bg-white p-6">
              <p className="font-semibold">Refund configuration</p>
              <div><Label>Refund window (days)</Label><Input type="number" min={1} value={config.window} onChange={(e) => setConfig({ ...config, window: e.target.value })} /></div>
              <div><Label>Auto-approve below ($)</Label><Input type="number" min={0} value={config.autoApproveBelow} onChange={(e) => setConfig({ ...config, autoApproveBelow: e.target.value })} /></div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={config.allowPartial} onChange={(e) => setConfig({ ...config, allowPartial: e.target.checked })} /> Allow partial refunds</label>
              <Button type="submit" variant="gradient">Save</Button>
            </form>
            <div className="rounded-lg border bg-white p-6">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-semibold">Reject reasons</p>
                <Button size="sm" variant="outline"><Plus className="mr-1 h-4 w-4" />New configuration</Button>
              </div>
              <ul className="space-y-2 text-sm">
                {rejectReasons.map((r) => <li key={r} className="flex items-center justify-between border-b pb-2 last:border-0">{r}<button className="text-xs text-red-600">Remove</button></li>)}
              </ul>
              <div className="mt-3"><Label>Add reason</Label><Textarea rows={2} placeholder="Describe a new reject reason…" /></div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
