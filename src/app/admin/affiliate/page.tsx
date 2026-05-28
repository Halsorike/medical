"use client";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2, DollarSign, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type User = { id: string; name: string; code: string; referrals: number; earnings: number; status: "active" | "inactive" };
const users: User[] = [
  { id: "AF-01", name: "Alice Walker", code: "ALICE10", referrals: 24, earnings: 248.50, status: "active" },
  { id: "AF-02", name: "Brian Chen", code: "BRIAN15", referrals: 18, earnings: 175.20, status: "active" },
  { id: "AF-03", name: "Carla Diaz", code: "CARLA20", referrals: 52, earnings: 612.80, status: "active" },
  { id: "AF-04", name: "David Park", code: "DAVE", referrals: 9, earnings: 78.40, status: "inactive" },
];

const logs = users.flatMap((u, i) => Array.from({ length: 2 }).map((_, j) => ({
  id: `LOG-${i}-${j}`,
  date: `${(i + j) % 28 + 1} Dec 2025`,
  user: u.name,
  action: ["First-purchase commission", "Product-share commission"][j],
  amount: 5 + j * 12,
  status: (["approved", "pending"] as const)[j % 2],
})));

const withdraws = [
  { id: "W-01", user: "Alice Walker", amount: 80, status: "pending" as const, date: "5 Dec 2025" },
  { id: "W-02", user: "Carla Diaz", amount: 300, status: "approved" as const, date: "6 Dec 2025" },
  { id: "W-03", user: "Brian Chen", amount: 50, status: "rejected" as const, date: "7 Dec 2025" },
];

const referrals = [
  { id: "REF-01", referrer: "Alice Walker", referred: "tom@example.com", joined: "2 Dec 2025", firstPurchase: "8 Dec 2025" },
  { id: "REF-02", referrer: "Carla Diaz", referred: "lina@example.com", joined: "3 Dec 2025", firstPurchase: "Pending" },
  { id: "REF-03", referrer: "Carla Diaz", referred: "kevin@example.com", joined: "4 Dec 2025", firstPurchase: "10 Dec 2025" },
];

export default function Affiliate() {
  return (
    <>
      <PageHeader title="Affiliate program" description="Users, logs, withdraws and configuration" />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard label="Total affiliates" value="124" icon={Users} />
        <StatCard label="Total referrals" value="2,348" icon={Share2} />
        <StatCard label="Total commissions paid" value="$8,420" icon={DollarSign} />
      </div>
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Affiliate user</TabsTrigger>
          <TabsTrigger value="logs">Affiliate logs</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw request</TabsTrigger>
          <TabsTrigger value="referrals">Referral users</TabsTrigger>
          <TabsTrigger value="config">Affiliate configurations</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <DataTable rows={users} rowKey={(r) => r.id}
            columns={[
              { header: "ID", accessor: (r) => r.id },
              { header: "Name", accessor: (r) => r.name },
              { header: "Code", accessor: (r) => <code className="rounded bg-muted px-2 py-0.5">{r.code}</code> },
              { header: "Referrals", accessor: (r) => r.referrals },
              { header: "Earnings", accessor: (r) => formatCurrency(r.earnings) },
              { header: "Status", accessor: (r) => <StatusBadge value={r.status} /> },
            ]} />
          <Pagination total={users.length} />
        </TabsContent>
        <TabsContent value="logs">
          <DataTable rows={logs} rowKey={(r) => r.id}
            columns={[
              { header: "Date", accessor: (r) => r.date },
              { header: "User", accessor: (r) => r.user },
              { header: "Action", accessor: (r) => r.action },
              { header: "Amount", accessor: (r) => formatCurrency(r.amount) },
              { header: "Approval", accessor: (r) => <StatusBadge value={r.status} /> },
            ]} />
        </TabsContent>
        <TabsContent value="withdraw">
          <DataTable rows={withdraws} rowKey={(r) => r.id}
            columns={[
              { header: "ID", accessor: (r) => r.id },
              { header: "User", accessor: (r) => r.user },
              { header: "Amount", accessor: (r) => formatCurrency(r.amount) },
              { header: "Date", accessor: (r) => r.date },
              { header: "Status", accessor: (r) => <StatusBadge value={r.status} /> },
            ]} />
        </TabsContent>
        <TabsContent value="referrals">
          <DataTable rows={referrals} rowKey={(r) => r.id}
            columns={[
              { header: "ID", accessor: (r) => r.id },
              { header: "Referrer", accessor: (r) => r.referrer },
              { header: "Referred email", accessor: (r) => r.referred },
              { header: "Joined", accessor: (r) => r.joined },
              { header: "First purchase", accessor: (r) => r.firstPurchase },
            ]} />
        </TabsContent>
        <TabsContent value="config">
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Affiliate configuration saved"); }} className="space-y-4 rounded-lg border bg-white p-6 max-w-2xl">
            <p className="font-semibold">Affiliate configurations</p>
            <div className="grid gap-3 md:grid-cols-2">
              <div><Label>Basic affiliate %</Label><Input type="number" defaultValue={10} /></div>
              <div><Label>Trigger</Label><Input defaultValue="User registration & first purchase" /></div>
              <div><Label>Product sharing affiliate %</Label><Input type="number" defaultValue={5} /></div>
              <div><Label>Category-wise affiliate %</Label><Input type="number" defaultValue={3} /></div>
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Status: active</label>
            <Button type="submit" variant="gradient">Save</Button>
          </form>
        </TabsContent>
      </Tabs>
    </>
  );
}
