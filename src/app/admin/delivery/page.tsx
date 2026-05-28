"use client";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";

type Boy = { id: string; name: string; phone: string; email: string; area: string; deliveries: number; earnings: number; collection: number; status: "active" | "inactive" };

const boys: Boy[] = [
  { id: "DLV-01", name: "Marco P.", phone: "+1 555 0101", email: "marco@medical.com", area: "Downtown", deliveries: 142, earnings: 2840, collection: 0, status: "active" },
  { id: "DLV-02", name: "Jin K.", phone: "+1 555 0102", email: "jin@medical.com", area: "North Side", deliveries: 98, earnings: 1960, collection: 120, status: "active" },
  { id: "DLV-03", name: "Sara L.", phone: "+1 555 0103", email: "sara@medical.com", area: "West End", deliveries: 76, earnings: 1520, collection: 0, status: "inactive" },
  { id: "DLV-04", name: "Dimitri V.", phone: "+1 555 0104", email: "dimitri@medical.com", area: "South", deliveries: 201, earnings: 4020, collection: 80, status: "active" },
];

const cancels = [
  { id: "20210520-10560247", code: "REQ-001", requestAt: "2 Dec 2025", requestBy: "Marco P.", reason: "Customer unavailable" },
  { id: "20210520-10560248", code: "REQ-002", requestAt: "3 Dec 2025", requestBy: "Sara L.", reason: "Address not found" },
];

const collected = [
  { id: "COL-01", boy: "Jin K.", amount: 120, date: "12 Dec 2025" },
  { id: "COL-02", boy: "Dimitri V.", amount: 80, date: "13 Dec 2025" },
];

const payments = [
  { id: "PAY-01", boy: "Marco P.", amount: 2840, date: "1 Dec 2025", type: "Monthly salary" },
  { id: "PAY-02", boy: "Jin K.", amount: 1960, date: "1 Dec 2025", type: "Monthly salary" },
];

export default function Delivery() {
  const [tab, setTab] = useState("all");
  return (
    <>
      <PageHeader title="Delivery boys" description="Roster, requests and payouts"
        action={<Button variant="gradient" onClick={() => setTab("new")}><Plus className="mr-1 h-4 w-4" />New delivery boy</Button>} />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All delivery boys</TabsTrigger>
          <TabsTrigger value="cancel">Cancel requests</TabsTrigger>
          <TabsTrigger value="collected">Collected histories</TabsTrigger>
          <TabsTrigger value="payments">Payment histories</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <DataTable rows={boys} rowKey={(r) => r.id}
            columns={[
              { header: "ID", accessor: (r) => r.id },
              { header: "Name", accessor: (r) => r.name },
              { header: "Phone", accessor: (r) => r.phone },
              { header: "Email", accessor: (r) => r.email },
              { header: "Area", accessor: (r) => r.area },
              { header: "Deliveries", accessor: (r) => r.deliveries },
              { header: "Earning", accessor: (r) => formatCurrency(r.earnings) },
              { header: "Collection", accessor: (r) => formatCurrency(r.collection) },
              { header: "Status", accessor: (r) => <StatusBadge value={r.status} /> },
            ]} />
          <Pagination total={boys.length} />
        </TabsContent>
        <TabsContent value="cancel">
          <DataTable rows={cancels} rowKey={(r) => r.id}
            columns={[
              { header: "Code", accessor: (r) => r.code },
              { header: "Request at", accessor: (r) => r.requestAt },
              { header: "Request by", accessor: (r) => r.requestBy },
              { header: "Reason", accessor: (r) => r.reason },
            ]} />
        </TabsContent>
        <TabsContent value="collected">
          <DataTable rows={collected} rowKey={(r) => r.id}
            columns={[
              { header: "ID", accessor: (r) => r.id },
              { header: "Delivery boy", accessor: (r) => r.boy },
              { header: "Amount", accessor: (r) => formatCurrency(r.amount) },
              { header: "Collected at", accessor: (r) => r.date },
            ]} />
        </TabsContent>
        <TabsContent value="payments">
          <DataTable rows={payments} rowKey={(r) => r.id}
            columns={[
              { header: "ID", accessor: (r) => r.id },
              { header: "Delivery boy", accessor: (r) => r.boy },
              { header: "Amount", accessor: (r) => formatCurrency(r.amount) },
              { header: "Type", accessor: (r) => r.type },
              { header: "Paid at", accessor: (r) => r.date },
            ]} />
        </TabsContent>
        <TabsContent value="config">
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Payment configuration saved"); }} className="space-y-3 rounded-lg border bg-white p-6 max-w-lg">
            <p className="font-semibold">Payment configuration</p>
            <label className="flex items-center gap-2 text-sm"><input type="radio" name="pay" defaultChecked /> Monthly salary</label>
            <label className="flex items-center gap-2 text-sm"><input type="radio" name="pay" /> Per order commission</label>
            <div><Label>Amount</Label><Input type="number" min={0} defaultValue={50} /></div>
            <Button type="submit" variant="gradient">Save</Button>
          </form>
        </TabsContent>
        <TabsContent value="new">
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Delivery boy added"); setTab("all"); }} className="grid gap-4 rounded-lg border bg-white p-6 md:grid-cols-2">
            <div><Label>Name *</Label><Input required /></div>
            <div><Label>Email *</Label><Input type="email" required /></div>
            <div><Label>Phone *</Label><Input required /></div>
            <div><Label>Password *</Label><Input type="password" required /></div>
            <div><Label>Country *</Label><Input required /></div>
            <div><Label>City *</Label><Input required /></div>
            <div className="md:col-span-2"><Label>Image *</Label>
              <div className="grid h-28 place-items-center rounded-md border border-dashed text-sm text-muted-foreground">Drag &amp; drop files or Browse</div>
            </div>
            <div className="md:col-span-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setTab("all")}>Cancel</Button>
              <Button type="submit" variant="gradient">Save</Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </>
  );
}
