"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import type { Order, Product } from "@/types";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";

type TimelineStatus = "placed" | "confirmed" | "shipped" | "delivered";

const paymentVariant: Record<string, BadgeProps["variant"]> = {
  paid: "success",
  unpaid: "warning",
  refunded: "secondary",
};

const timelineSteps: { key: TimelineStatus; label: string; note: string }[] = [
  { key: "placed", label: "Placed", note: "Order was created and received by the system." },
  { key: "confirmed", label: "Confirmed", note: "Order details and stock were verified." },
  { key: "shipped", label: "Shipped", note: "Package handed to the carrier and moving in transit." },
  { key: "delivered", label: "Delivered", note: "Order reached the customer destination." },
];

function getTimelineIndex(status: string) {
  if (status === "delivered" || status === "refunded") return 3;
  if (status === "shipped") return 2;
  if (status === "confirmed") return 1;
  return 0;
}

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState<Order["status"]>("pending");

  useEffect(() => {
    Promise.all([
      fetch(`/api/orders/${params.id}`).then((response) => (response.ok ? response.json() : Promise.reject())),
      fetch("/api/products").then((response) => (response.ok ? response.json() : Promise.reject())),
    ])
      .then(([orderPayload, productPayload]: [{ data: Order }, { data: Product[] }]) => {
        setOrder(orderPayload.data);
        setCurrentStatus(orderPayload.data.status);
        setProducts(productPayload.data);
      })
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  const lineItems = useMemo(() => {
    if (!order) return [];
    const count = Math.min(3, Math.max(1, order.items % 3 || 3));
    return Array.from({ length: count }).map((_, index) => {
      const seed = Number.parseInt(order.id, 10) || 1;
      const product = products[(seed + index) % Math.max(products.length, 1)];
      const qty = index + 1;
      return {
        id: `${order.id}-${product?.id ?? index}`,
        name: product?.name ?? "Medical product",
        qty,
        unitPrice: product?.price ?? order.total / count,
        subtotal: qty * (product?.price ?? order.total / count),
      };
    });
  }, [order, products]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border bg-white p-8 text-sm text-muted-foreground">Loading order...</div>
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Loading line items...</CardContent>
        </Card>
      </div>
    );
  }

  if (!order) {
    return (
      <>
        <PageHeader
          title="Order not found"
          description="The requested order does not exist in the mock order list."
          action={
            <Button asChild variant="outline">
              <Link href="/admin/orders">Back to orders</Link>
            </Button>
          }
        />
        <div className="rounded-lg border bg-white p-8 text-sm text-muted-foreground">
          No order matched ID {params.id}.
        </div>
      </>
    );
  }

  const totalItems = lineItems.reduce((sum, item) => sum + item.qty, 0);
  const timelineIndex = getTimelineIndex(currentStatus);

  const updateStatus = async (status: typeof currentStatus) => {
    const response = await fetch(`/api/orders/${order.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      toast.error("Status could not be updated");
      return;
    }

    setCurrentStatus(status);
    setOrder({ ...order, status });
    toast.success(`Status updated to "${status}"`);
  };

  return (
    <>
      <PageHeader
        title={`Order ${order.code}`}
        description={`Placed ${formatDate(order.date)}`}
        action={
          <Button asChild variant="outline">
            <Link href="/admin/orders">Back to orders</Link>
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle>{order.code}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">{formatDate(order.date)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge value={currentStatus} />
                <Badge variant={paymentVariant[order.payment]}>{order.payment}</Badge>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Unit price</TableHead>
                    <TableHead>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell>{formatCurrency(item.subtotal)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              {timelineSteps.map((step, index) => {
                const completed = index < timelineIndex;
                const active = index === timelineIndex;
                const pending = index > timelineIndex;

                return (
                  <div key={step.key} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={[
                          "grid h-9 w-9 place-items-center rounded-full border",
                          completed ? "border-green-200 bg-green-50 text-green-600" : "",
                          active ? "border-blue-200 bg-blue-50 text-blue-600" : "",
                          pending ? "border-slate-200 bg-slate-50 text-slate-400" : "",
                        ].join(" ")}
                      >
                        {completed ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                      </div>
                      {index < timelineSteps.length - 1 ? (
                        <div className={completed || active ? "h-10 w-px bg-green-200" : "h-10 w-px bg-slate-200"} />
                      ) : null}
                    </div>
                    <div className="pb-6">
                      <p className={active ? "font-semibold text-blue-600" : "font-medium"}>{step.label}</p>
                      <p className="text-sm text-muted-foreground">{step.note}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{order.customer}</p>
              <p className="text-muted-foreground">{order.email}</p>
              <p className="text-muted-foreground">+1 555-01{order.id.padStart(2, "0")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
              <p>123 Main St</p>
              <p>Boston, MA 02115</p>
              <p>United States</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment status</span>
                <Badge variant={paymentVariant[order.payment]}>{order.payment}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment method</span>
                <span>Credit Card</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Order total</span>
                <span className="font-semibold">{formatCurrency(order.total)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total items</span>
                <span>{totalItems}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline" onClick={() => updateStatus("shipped")}>
                Mark as Shipped
              </Button>
              <Button className="w-full" variant="gradient" onClick={() => updateStatus("delivered")}>
                Mark as Delivered
              </Button>
              <Button className="w-full" variant="destructive" onClick={() => updateStatus("cancelled")}>
                Cancel Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
