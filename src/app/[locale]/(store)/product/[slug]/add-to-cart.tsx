"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/store/cart-context";
import { formatCurrency } from "@/lib/utils";

export function AddToCartBlock({ product }: { product: Product }) {
  const shop = useTranslations("shop");
  const cart = useTranslations("cart");
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant="gradient"
          className="flex-1 gap-2"
          onClick={() => add(product, qty)}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-4 w-4" />
          {product.stock === 0 ? shop("outOfStock") : `${shop("addToCart")} - ${formatCurrency(product.price * qty)}`}
        </Button>
        <div className="flex items-center">
          <span className="mr-3 text-sm text-muted-foreground">{cart("quantity")}</span>
          <div className="flex items-center rounded-full border border-gray-200">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              aria-label="Decrease"
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-brand-50 transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-sm font-medium">{qty}</span>
            <button
              onClick={() => setQty(Math.min(product.stock || 99, qty + 1))}
              aria-label="Increase"
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-brand-50 transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
