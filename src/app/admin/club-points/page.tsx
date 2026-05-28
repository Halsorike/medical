"use client";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coins, Users, TrendingUp } from "lucide-react";
import { products } from "@/data/products";
import { customers } from "@/data/customers";
import { formatCurrency } from "@/lib/utils";

const userPoints = customers.slice(0, 12).map((c, i) => ({
  id: c.id,
  user: c.name,
  email: c.email,
  points: 200 + i * 35,
  paymentAmount: 80 + i * 12,
  createdAt: `${(i % 28) + 1} Dec 2025`,
}));

const productPoints = products.slice(0, 12).map((p, i) => ({
  id: p.id,
  name: p.name,
  price: p.price,
  points: 5 + i,
}));

export default function ClubPoints() {
  const [tab, setTab] = useState("users");
  return (
    <>
      <PageHeader title="Club point system" description="Loyalty points awarded to customers" />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard label="Total points issued" value="284,520" icon={Coins} />
        <StatCard label="Active members" value="612" icon={Users} />
        <StatCard label="Redemption rate" value="38%" icon={TrendingUp} trend={4} />
      </div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="users">User points</TabsTrigger>
          <TabsTrigger value="products">Set product point</TabsTrigger>
          <TabsTrigger value="range">Range</TabsTrigger>
          <TabsTrigger value="multi">Multiple products</TabsTrigger>
          <TabsTrigger value="all">All products</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <DataTable rows={userPoints} rowKey={(r) => r.id}
            columns={[
              { header: "User", accessor: (r) => r.user },
              { header: "Email", accessor: (r) => r.email },
              { header: "Points", accessor: (r) => r.points },
              { header: "Payment amount", accessor: (r) => formatCurrency(r.paymentAmount) },
              { header: "Created at", accessor: (r) => r.createdAt },
            ]} />
          <Pagination total={userPoints.length} />
        </TabsContent>
        <TabsContent value="products">
          <DataTable rows={productPoints} rowKey={(r) => r.id}
            columns={[
              { header: "Product", accessor: (r) => r.name },
              { header: "Price", accessor: (r) => formatCurrency(r.price) },
              { header: "Points", accessor: (r) => r.points },
              { header: "Action", accessor: () => <Button size="sm" variant="outline">Set points</Button> },
            ]} />
        </TabsContent>
        <TabsContent value="range">
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Range rule saved"); }} className="space-y-3 rounded-lg border bg-white p-6 max-w-2xl">
            <p className="font-semibold">Set point for product within a range</p>
            <p className="text-xs text-muted-foreground">Set any specific point for those products whose price is between Min-price and Max-price. Min-price should be less than Max-price.</p>
            <div className="grid gap-3 md:grid-cols-3">
              <div><Label>Min price</Label><Input type="number" defaultValue={5} /></div>
              <div><Label>Max price</Label><Input type="number" defaultValue={25000} /></div>
              <div><Label>Points</Label><Input type="number" defaultValue={100} /></div>
            </div>
            <Button type="submit" variant="gradient">Save</Button>
          </form>
        </TabsContent>
        <TabsContent value="multi">
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Multi-product rule saved"); }} className="space-y-3 rounded-lg border bg-white p-6 max-w-2xl">
            <p className="font-semibold">Set point for multiple products</p>
            <div><Label>Products</Label><Input placeholder="Select products…" /></div>
            <div><Label>Points</Label><Input type="number" defaultValue={50} /></div>
            <Button type="submit" variant="gradient">Save</Button>
          </form>
        </TabsContent>
        <TabsContent value="all">
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Global rule saved"); }} className="space-y-3 rounded-lg border bg-white p-6 max-w-2xl">
            <p className="font-semibold">Set point for all products</p>
            <div><Label>Set point for $1.000</Label><Input type="number" defaultValue={1} /></div>
            <Button type="submit" variant="gradient">Save</Button>
          </form>
        </TabsContent>
      </Tabs>
    </>
  );
}
