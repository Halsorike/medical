import { Link } from "@/navigation";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Order, Product } from "@/types";
import { getApiData } from "@/lib/server-api";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusVariant: Record<string, BadgeProps["variant"]> = {
  delivered: "success",
  shipped: "info",
  pending: "warning",
  cancelled: "destructive",
  refunded: "secondary",
  confirmed: "default",
};

const paymentVariant: Record<string, BadgeProps["variant"]> = {
  paid: "success",
  unpaid: "warning",
  refunded: "secondary",
};

export default async function StoreOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getApiData<Order>(`/api/orders/${params.id}`);
  const products = await getApiData<Product[]>("/api/products") ?? [];

  if (!order) {
    notFound();
  }

  const lineItems = Array.from({ length: Math.min(3, Math.max(2, order.items % 3 + 1)) }).map((_, index) => {
    const seed = Number.parseInt(order.id, 10) || 1;
    const product = products[(seed + index) % Math.max(products.length, 1)];
    const qty = index + 1;
    return {
      id: `${order.id}-${product?.id ?? index}`,
      product,
      qty,
      subtotal: qty * (product?.price ?? order.total),
    };
  });

  const subtotal = lineItems.reduce((sum, item) => sum + item.subtotal, 0);
  const shipping = 4.99;
  const total = subtotal + shipping;

  return (
    <div className="space-y-5">
      <Link href="/account/orders" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>{order.code}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{formatDate(order.date)}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
            <Badge variant={paymentVariant[order.payment]}>{order.payment}</Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Items Ordered</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.product?.image ?? ""} alt={item.product?.name ?? "Medical product"} className="h-12 w-12 rounded-md border object-cover" />
                          <span className="font-medium">{item.product?.name ?? "Medical product"}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell>{formatCurrency(item.product?.price ?? order.total)}</TableCell>
                      <TableCell>{formatCurrency(item.subtotal)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
              <p>Alex Demo</p>
              <p>123 Main St</p>
              <p>Boston, MA 02115</p>
              <p>United States</p>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{formatCurrency(shipping)}</span>
            </div>
            <div className="flex items-center justify-between border-t pt-3 text-base font-semibold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
