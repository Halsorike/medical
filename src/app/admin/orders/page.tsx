"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableHeader, TableHead, TableBody, TableRow, TableCell,
} from "@/components/ui/table";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Order } from "@/types";

const statusVariant: Record<string, "success" | "info" | "warning" | "destructive" | "secondary" | "default"> = {
  delivered: "success",
  shipped: "info",
  pending: "warning",
  cancelled: "destructive",
  refunded: "secondary",
  confirmed: "default",
};

const ORDER_STATUSES: Order["status"][] = [
  "pending", "confirmed", "shipped", "delivered", "cancelled", "refunded",
];

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetch("/api/orders")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data: Order[] }) => setOrders(payload.data))
      .catch(() => toast.error("Orders could not be loaded"));
  }, []);

  const filtered = useMemo(
    () =>
      orders.filter(
        (o) =>
          (statusFilter === "all" || o.status === statusFilter) &&
          (q === "" ||
            o.code.toLowerCase().includes(q.toLowerCase()) ||
            o.customer.toLowerCase().includes(q.toLowerCase()))
      ),
    [orders, q, statusFilter]
  );

  async function handleStatusChange(id: string, code: string, newStatus: Order["status"]) {
    const response = await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      toast.error(`Order ${code} could not be updated`);
      return;
    }

    setOrders((current) => current.map((order) => (order.id === id ? { ...order, status: newStatus } : order)));
    toast.success(`Order ${code} updated to "${newStatus}"`);
  }

  return (
    <>
      <PageHeader
        title="Orders"
        description={`${orders.length} total orders`}
      />
      <div className="rounded-lg border bg-white">
        <div className="flex flex-wrap items-center gap-2 p-4">
          <Input
            placeholder="Search by order code or customer"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-sm"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {ORDER_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">{filtered.length} results</span>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">
                  <Link href={`/admin/orders/${o.id}`} className="hover:text-primary hover:underline">
                    {o.code}
                  </Link>
                </TableCell>
                <TableCell>
                  {o.customer}
                  <p className="text-xs text-muted-foreground">{o.email}</p>
                </TableCell>
                <TableCell>{formatDate(o.date)}</TableCell>
                <TableCell>{o.items}</TableCell>
                <TableCell>{formatCurrency(o.total)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      o.payment === "paid"
                        ? "success"
                        : o.payment === "unpaid"
                        ? "warning"
                        : "secondary"
                    }
                  >
                    {o.payment}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={o.status}
                    onValueChange={(val) =>
                      handleStatusChange(o.id, o.code, val as Order["status"])
                    }
                  >
                    <SelectTrigger className="h-7 w-32 text-xs">
                      <SelectValue>
                        <Badge variant={statusVariant[o.status]}>{o.status}</Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          <Badge variant={statusVariant[s]}>{s}</Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/orders/${o.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
