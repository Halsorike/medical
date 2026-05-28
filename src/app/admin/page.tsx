"use client";

import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { RevenueLine, OrdersBar, CategoryPie } from "@/components/admin/charts";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  useStore,
  totalRevenue,
  ordersByMonth,
  categoryDistribution,
  lowStockProducts,
} from "@/lib/store";

const statusVariant: Record<string, "success" | "info" | "warning" | "destructive" | "secondary" | "default"> = {
  delivered: "success",
  shipped: "info",
  pending: "warning",
  cancelled: "destructive",
  refunded: "secondary",
  confirmed: "default",
};

export default function AdminDashboard() {
  const { state } = useStore();
  const { products, orders, customers } = state;

  // ── Live KPIs ─────────────────────────────────────────────────────────────
  const revenue = totalRevenue(orders);
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const lowStock = lowStockProducts(products, 10);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  // ── Chart data ─────────────────────────────────────────────────────────────
  const monthlyData = ordersByMonth(orders);
  const categoryData = categoryDistribution(products);

  // ── Recent orders (last 6) ─────────────────────────────────────────────────
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  // ── Activity feed ──────────────────────────────────────────────────────────
  const activity = [
    ...recentOrders.slice(0, 2).map((o) => ({
      icon: ShoppingBag,
      text: `New order ${o.code} — ${o.customer}`,
      time: formatDate(o.date),
      color: "text-primary",
    })),
    ...lowStock.slice(0, 2).map((p) => ({
      icon: AlertTriangle,
      text: `Low stock: ${p.name} (${p.stock} left)`,
      time: "Inventory alert",
      color: "text-amber-500",
    })),
    {
      icon: TrendingUp,
      text: `Revenue this month: ${formatCurrency(monthlyData.at(-1)?.revenue ?? 0)}`,
      time: "Monthly summary",
      color: "text-green-500",
    },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome back. Here's what's happening today."
      />

      {/* ── KPI Cards ──────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={formatCurrency(revenue)}
          hint="all paid orders"
          trend={12}
          icon={DollarSign}
        />
        <StatCard
          label="Total Orders"
          value={orders.length.toString()}
          hint={`${pendingOrders} pending`}
          trend={8}
          icon={ShoppingBag}
        />
        <StatCard
          label="Active Customers"
          value={activeCustomers.toString()}
          hint={`of ${customers.length} total`}
          trend={4}
          icon={Users}
        />
        <StatCard
          label="Products"
          value={products.length.toString()}
          hint={lowStock.length > 0 ? `${lowStock.length} low stock` : "all in stock"}
          trend={lowStock.length > 0 ? -lowStock.length : 0}
          icon={Package}
        />
      </div>

      {/* ── Charts row 1 ───────────────────────────────────────────────────── */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border bg-white p-5 lg:col-span-2">
          <p className="mb-4 font-semibold">Revenue by month</p>
          <RevenueLine data={monthlyData} />
        </div>
        <div className="rounded-lg border bg-white p-5">
          <p className="mb-4 font-semibold">Products by category</p>
          <CategoryPie data={categoryData} />
        </div>
      </div>

      {/* ── Charts row 2 ───────────────────────────────────────────────────── */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border bg-white p-5 lg:col-span-2">
          <p className="mb-4 font-semibold">Orders by month</p>
          <OrdersBar data={monthlyData} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <item.icon className={`mt-0.5 h-4 w-4 shrink-0 ${item.color}`} />
                <div className="min-w-0">
                  <p className="truncate text-sm">{item.text}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── Low stock alert ─────────────────────────────────────────────────── */}
      {lowStock.length > 0 && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="mb-2 flex items-center gap-2 font-semibold text-amber-700">
            <AlertTriangle className="h-4 w-4" />
            Low Stock Alerts ({lowStock.length} products)
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStock.map((p) => (
              <Link
                key={p.id}
                href={`/admin/products/${p.id}`}
                className="rounded-full border border-amber-300 bg-white px-3 py-1 text-xs text-amber-800 hover:bg-amber-100"
              >
                {p.name} — {p.stock} left
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Recent orders table ─────────────────────────────────────────────── */}
      <div className="mt-6 rounded-lg border bg-white">
        <div className="flex items-center justify-between p-4">
          <p className="font-semibold">Recent orders</p>
          <Link
            href="/admin/orders"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="hover:text-primary hover:underline"
                  >
                    {o.code}
                  </Link>
                </TableCell>
                <TableCell>{o.customer}</TableCell>
                <TableCell>{formatDate(o.date)}</TableCell>
                <TableCell>{formatCurrency(o.total)}</TableCell>
                <TableCell>
                  <Badge variant={o.payment === "paid" ? "success" : o.payment === "unpaid" ? "warning" : "secondary"}>
                    {o.payment}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[o.status]}>{o.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
