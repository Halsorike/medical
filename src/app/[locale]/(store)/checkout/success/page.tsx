"use client";

import { Link } from "@/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

type LastOrder = {
  orderNumber: string;
  items: Array<{ product: { id: string; name: string; price: number }; qty: number }>;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
};

export default function Success() {
  const [order, setOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("lastOrder");
    if (!stored) return;

    try {
      setOrder(JSON.parse(stored) as LastOrder);
    } catch {
      setOrder(null);
    }
  }, []);

  return (
    <div className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
      <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
      <h1 className="mt-4 text-3xl font-bold">Thank you! Your order is confirmed.</h1>
      <p className="mt-2 text-muted-foreground">
        A confirmation has been sent to your email. Estimated delivery: 2-3 business days.
      </p>

      {order && (
        <div className="mt-8 rounded-2xl border border-brand-100 bg-white p-6 text-left shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b pb-3">
            <span className="text-sm text-muted-foreground">Order number</span>
            <span className="font-bold text-brand-blue">#{order.orderNumber}</span>
          </div>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.product.id} className="flex justify-between gap-4 text-sm">
                <span>{item.product.name} x {item.qty}</span>
                <span className="font-medium">{formatCurrency(item.product.price * item.qty)}</span>
              </div>
            ))}
          </div>
          {order.discount > 0 && (
            <div className="mt-4 flex justify-between text-sm text-green-700">
              <span>Discount</span>
              <span>-{formatCurrency(order.discount)}</span>
            </div>
          )}
          <div className="mt-2 flex justify-between text-sm">
            <span>Shipping</span>
            <span>{order.shipping === 0 ? "Free delivery within Muscat" : formatCurrency(order.shipping)}</span>
          </div>
          <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold">
            <span>Total paid</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-center gap-3">
        <Link href="/shop"><Button variant="gradient">Continue shopping</Button></Link>
        <Link href="/account/orders"><Button variant="outline">View my orders</Button></Link>
      </div>
      </div>
    </div>
  );
}
