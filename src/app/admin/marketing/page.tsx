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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";

type Coupon = { id: string; code: string; type: string; value: string; minOrder?: string; status: "active" | "inactive" };
const coupons: Coupon[] = [
  { id: "C-01", code: "TOTAL500", type: "For Total Orders", value: "$500", minOrder: "$2000", status: "active" },
  { id: "C-02", code: "WELCOME10", type: "Welcome Coupon", value: "10%", status: "active" },
  { id: "C-03", code: "BACK2SCHOOL", type: "For Products", value: "15%", status: "active" },
  { id: "C-04", code: "VIPCLUB", type: "For Customers", value: "20%", status: "inactive" },
];

type Subscriber = { id: string; email: string; phone: string; date: string };
const subscribers: Subscriber[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `S-${1000 + i}`,
  email: `user${i + 1}@example.com`,
  phone: `+1 555-04${String(10 + i).padStart(2, "0")}`,
  date: `${(i % 28) + 1} Dec 2025`,
}));

type Newsletter = { id: string; subject: string; sentTo: number; date: string; status: "sent" | "draft" };
const newsletters: Newsletter[] = [
  { id: "N-01", subject: "December flash sale", sentTo: 8420, date: "2025-12-01", status: "sent" },
  { id: "N-02", subject: "New year wellness pack", sentTo: 7820, date: "2025-12-26", status: "sent" },
  { id: "N-03", subject: "Diabetes care guide", sentTo: 0, date: "—", status: "draft" },
];

export default function MarketingPage() {
  const [tab, setTab] = useState("coupons");
  const [couponType, setCouponType] = useState("products");
  return (
    <>
      <PageHeader title="Marketing" description="Coupons, subscribers and newsletters" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="newsletters">Newsletters</TabsTrigger>
          <TabsTrigger value="new-coupon">New coupon</TabsTrigger>
        </TabsList>

        <TabsContent value="coupons">
          <div className="mb-3 flex justify-end"><Button variant="gradient" onClick={() => setTab("new-coupon")}><Plus className="mr-1 h-4 w-4" />New coupon</Button></div>
          <DataTable
            rows={coupons}
            rowKey={(r) => r.id}
            columns={[
              { header: "Code", accessor: (r) => <code className="rounded bg-muted px-2 py-0.5">{r.code}</code> },
              { header: "Type", accessor: (r) => r.type },
              { header: "Value", accessor: (r) => r.value },
              { header: "Min order", accessor: (r) => r.minOrder ?? "—" },
              { header: "Status", accessor: (r) => <StatusBadge value={r.status} /> },
              { header: "Action", accessor: () => (
                <div className="flex gap-2 text-muted-foreground">
                  <button className="hover:text-primary" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                  <button className="hover:text-red-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                </div>
              ) },
            ]}
          />
          <Pagination total={coupons.length} />
        </TabsContent>

        <TabsContent value="subscribers">
          <DataTable
            rows={subscribers}
            rowKey={(r) => r.id}
            columns={[
              { header: "Email", accessor: (r) => r.email },
              { header: "Phone number", accessor: (r) => r.phone },
              { header: "Subscribed", accessor: (r) => r.date },
            ]}
          />
          <Pagination total={subscribers.length} />
        </TabsContent>

        <TabsContent value="newsletters">
          <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
            <form onSubmit={(e) => { e.preventDefault(); toast.success("Newsletter sent"); }} className="space-y-3 rounded-lg border bg-white p-6">
              <div><Label>To</Label>
                <Select defaultValue="subs"><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="subs">Emails (Subscribers)</SelectItem>
                    <SelectItem value="customers">All customers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Newsletter subject</Label><Input required /></div>
              <div><Label>Newsletter content</Label><Textarea rows={8} required /></div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline">Save draft</Button>
                <Button type="submit" variant="gradient">Send</Button>
              </div>
            </form>
            <div className="rounded-lg border bg-white p-4 text-sm">
              <p className="mb-3 font-semibold">Recent</p>
              <ul className="space-y-3">
                {newsletters.map((n) => (
                  <li key={n.id} className="border-b pb-2 last:border-0">
                    <p className="font-medium">{n.subject}</p>
                    <p className="text-xs text-muted-foreground">{n.status === "sent" ? `Sent to ${n.sentTo.toLocaleString()} · ${n.date}` : "Draft"}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="new-coupon">
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Coupon saved"); setTab("coupons"); }} className="grid gap-4 rounded-lg border bg-white p-6 md:grid-cols-2">
            <div className="md:col-span-2"><Label>Coupon information</Label></div>
            <div>
              <Label>Coupon type</Label>
              <Select value={couponType} onValueChange={setCouponType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="products">For products</SelectItem>
                  <SelectItem value="orders">For total orders</SelectItem>
                  <SelectItem value="welcome">Welcome coupon</SelectItem>
                  <SelectItem value="category">Product category coupon</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Coupon code</Label><Input placeholder="e.g. SAVE10" required /></div>
            <div><Label>Discount</Label><Input placeholder="e.g. 10 or 10%" required /></div>
            <div><Label>Valid until</Label><Input type="date" /></div>
            {couponType === "orders" && <div><Label>Minimum order</Label><Input placeholder="$0" /></div>}
            {couponType === "products" && <div><Label>Products</Label><Input placeholder="Select products" /></div>}
            <div className="md:col-span-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setTab("coupons")}>Cancel</Button>
              <Button type="submit" variant="gradient">Save coupon</Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </>
  );
}
