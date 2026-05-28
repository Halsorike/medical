import { Link } from "@/navigation";
import { Heart, MapPin, Settings, ShoppingBag, Star } from "lucide-react";
import type { Order } from "@/types";
import { getApiData } from "@/lib/server-api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const dynamic = "force-dynamic";

const statusVariant: Record<Order["status"], BadgeProps["variant"]> = {
  delivered: "success",
  shipped: "info",
  pending: "warning",
  cancelled: "destructive",
  refunded: "secondary",
  confirmed: "default",
};

const quickLinks = [
  { label: "Manage addresses", href: "/account/addresses", icon: MapPin },
  { label: "Profile settings", href: "/account/profile", icon: Settings },
];

export default async function AccountHome() {
  const orders = await getApiData<Order[]>("/api/orders") ?? [];
  const recentOrders = orders.slice(0, 3);
  const stats = [
    { label: "Total orders", value: orders.length, icon: ShoppingBag },
    { label: "Wishlist items", value: "6", icon: Heart },
    { label: "Club points", value: "430", icon: Star },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, Alex ðŸ‘‹</h1>
        <p className="text-sm text-muted-foreground">Member since January 2024</p>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex items-center gap-3 rounded-lg border bg-white p-4">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Recent orders</h2>
        <div className="overflow-hidden rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.code}</TableCell>
                  <TableCell>{formatDate(order.date)}</TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="border-t p-4">
            <Link href="/account/orders" className="text-sm font-medium text-primary hover:underline">
              View all orders &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {quickLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex cursor-pointer items-center gap-3 rounded-lg border bg-white p-4 transition hover:bg-muted"
            >
              <Icon className="h-5 w-5 text-primary" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
