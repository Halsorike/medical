"use client";

import { useEffect, useState } from "react";
import { Link } from "@/navigation";
import type { Order } from "@/types";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type OrderStatusFilter = "all" | Order["status"];

const statuses: OrderStatusFilter[] = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled", "refunded"];

const statusVariant: Record<Order["status"], BadgeProps["variant"]> = {
  delivered: "success",
  shipped: "info",
  pending: "warning",
  cancelled: "destructive",
  refunded: "secondary",
  confirmed: "default",
};

export default function MyOrders() {
  const [status, setStatus] = useState<OrderStatusFilter>("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const filtered = status === "all" ? orders : orders.filter((order) => order.status === status);

  useEffect(() => {
    fetch("/api/orders")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data: Order[] }) => setOrders(payload.data))
      .catch(() => setOrders([]));
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <Badge variant="secondary" className="text-muted-foreground">
          {orders.length} orders total
        </Badge>
      </div>

      <Tabs value={status} onValueChange={(value) => setStatus(value as OrderStatusFilter)}>
        <TabsList className="h-auto flex-wrap justify-start">
          {statuses.map((item) => (
            <TabsTrigger key={item} value={item} className="capitalize">
              {item}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="overflow-hidden rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.code}</TableCell>
                <TableCell>{formatDate(order.date)}</TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>{formatCurrency(order.total)}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/account/orders/${order.id}`}>View details</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No orders with this status</div>
        ) : null}
      </div>
    </div>
  );
}
