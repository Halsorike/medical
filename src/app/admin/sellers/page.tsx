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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { Plus, Eye } from "lucide-react";

type Seller = { id: string; name: string; contact: string; products: number; sales: number; status: "approved" | "pending" | "rejected" };
const sellers: Seller[] = [
  { id: "SLR-01", name: "HealthMart Co.", contact: "sales@healthmart.co", products: 124, sales: 28450, status: "approved" },
  { id: "SLR-02", name: "BluePharma", contact: "info@bluepharma.com", products: 82, sales: 12100, status: "approved" },
  { id: "SLR-03", name: "ChemSupply", contact: "hello@chemsupply.io", products: 36, sales: 5200, status: "pending" },
  { id: "SLR-04", name: "MedDirect", contact: "team@meddirect.com", products: 211, sales: 41200, status: "approved" },
  { id: "SLR-05", name: "WellCare Labs", contact: "ops@wellcare.io", products: 12, sales: 1820, status: "rejected" },
];

const packages = [
  { id: "PKG-01", name: "Starter", products: 50, fee: 0, duration: "Monthly" },
  { id: "PKG-02", name: "Growth", products: 500, fee: 49, duration: "Monthly" },
  { id: "PKG-03", name: "Enterprise", products: 5000, fee: 199, duration: "Monthly" },
];

const payoutRequests = sellers.slice(0, 4).map((s, i) => ({ id: `PR-${100 + i}`, seller: s.name, amount: 320 + i * 410, status: (["pending","pending","approved","pending"] as const)[i] }));
const payouts = payoutRequests.filter((p) => p.status === "approved").concat([{ id: "P-001", seller: "BluePharma", amount: 980, status: "approved" }]);

export default function Sellers() {
  return (
    <>
      <PageHeader title="Sellers" description="Marketplace sellers, packages, commissions and payouts" action={<Button variant="gradient"><Plus className="mr-1 h-4 w-4" />Invite seller</Button>} />
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All sellers</TabsTrigger>
          <TabsTrigger value="verify">Verification form</TabsTrigger>
          <TabsTrigger value="packages">Seller packages</TabsTrigger>
          <TabsTrigger value="commission">Commission</TabsTrigger>
          <TabsTrigger value="requests">Payout requests</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="mb-3 flex flex-wrap gap-2">
            <Input placeholder="Type name or email & Enter" className="max-w-xs" />
            <Select defaultValue="all"><SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">Filter by approval</SelectItem><SelectItem value="approved">Approved</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="rejected">Rejected</SelectItem></SelectContent>
            </Select>
            <Select defaultValue="bulk"><SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="bulk">Bulk action</SelectItem><SelectItem value="approve">Approve</SelectItem><SelectItem value="suspend">Suspend</SelectItem></SelectContent>
            </Select>
          </div>
          <DataTable
            rows={sellers}
            rowKey={(r) => r.id}
            columns={[
              { header: "ID", accessor: (r) => r.id },
              { header: "Seller", accessor: (r) => r.name },
              { header: "Contact", accessor: (r) => r.contact },
              { header: "Products", accessor: (r) => r.products },
              { header: "Sales", accessor: (r) => formatCurrency(r.sales) },
              { header: "Status", accessor: (r) => <StatusBadge value={r.status} /> },
              { header: "Action", accessor: () => <button className="text-muted-foreground hover:text-primary" aria-label="View"><Eye className="h-4 w-4" /></button> },
            ]}
          />
          <Pagination total={sellers.length} />
        </TabsContent>
        <TabsContent value="verify">
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Verification request submitted"); }} className="grid gap-4 rounded-lg border bg-white p-6 md:grid-cols-2">
            <div><Label>Legal name</Label><Input required /></div>
            <div><Label>Tax / VAT ID</Label><Input required /></div>
            <div><Label>Contact email</Label><Input type="email" required /></div>
            <div><Label>Country</Label><Input required /></div>
            <div className="md:col-span-2"><Label>Address</Label><Input required /></div>
            <div className="md:col-span-2"><Label>Documents</Label>
              <div className="grid h-28 place-items-center rounded-md border border-dashed text-sm text-muted-foreground">Drag &amp; drop files or Browse</div>
            </div>
            <div className="md:col-span-2 flex justify-end"><Button type="submit" variant="gradient">Submit verification</Button></div>
          </form>
        </TabsContent>
        <TabsContent value="packages">
          <DataTable
            rows={packages}
            rowKey={(r) => r.id}
            columns={[
              { header: "Package", accessor: (r) => r.name },
              { header: "Max products", accessor: (r) => r.products },
              { header: "Fee", accessor: (r) => formatCurrency(r.fee) },
              { header: "Duration", accessor: (r) => r.duration },
            ]}
          />
        </TabsContent>
        <TabsContent value="commission">
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Commission saved"); }} className="space-y-3 rounded-lg border bg-white p-6 max-w-lg">
            <p className="font-semibold">Seller commission activation</p>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Enable global commission</label>
            <div><Label>Default commission %</Label><Input type="number" defaultValue={10} /></div>
            <div><Label>Per-category override</Label><Input placeholder="Coming soon" disabled /></div>
            <Button type="submit" variant="gradient">Save</Button>
          </form>
        </TabsContent>
        <TabsContent value="requests">
          <DataTable
            rows={payoutRequests}
            rowKey={(r) => r.id}
            columns={[
              { header: "Request", accessor: (r) => r.id },
              { header: "Seller", accessor: (r) => r.seller },
              { header: "Requested amount", accessor: (r) => formatCurrency(r.amount) },
              { header: "Status", accessor: (r) => <StatusBadge value={r.status} /> },
            ]}
          />
        </TabsContent>
        <TabsContent value="payouts">
          <DataTable
            rows={payouts}
            rowKey={(r) => r.id}
            columns={[
              { header: "Payout", accessor: (r) => r.id },
              { header: "Seller", accessor: (r) => r.seller },
              { header: "Amount", accessor: (r) => formatCurrency(r.amount) },
              { header: "Status", accessor: (r) => <StatusBadge value={r.status} /> },
            ]}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
