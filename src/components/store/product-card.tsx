"use client";
import { Link } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Heart, ShoppingCart } from "lucide-react";
import type { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "./cart-context";

export function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const locale = useLocale();
  const t = useTranslations("shop");
  const displayName = locale === "ar" && p.nameAr ? p.nameAr : p.name;

  return (
    <div className="group overflow-hidden rounded-[15px] bg-white shadow-[0_11px_26px_rgba(6,28,61,0.1)] transition hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(6,28,61,0.14)]">
      <Link href={`/product/${p.slug}`} className="relative block aspect-square overflow-hidden bg-[rgba(0,153,168,0.06)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt={displayName} className="h-full w-full object-cover transition group-hover:scale-105" />
        {p.stock === 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white">
            {t("outOfStock")}
          </span>
        )}
        {/* Wishlist button overlay */}
        <button
          aria-label={`Wishlist ${displayName}`}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity hover:text-brand-teal"
        >
          <Heart className="h-4 w-4" />
        </button>
        {/* Add to cart overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-button-gradient py-2 text-center transition-transform group-hover:translate-y-0">
          <button
            onClick={(e) => { e.preventDefault(); add(p); }}
            disabled={p.stock === 0}
            className="flex w-full items-center justify-center gap-2 text-sm font-medium text-white disabled:opacity-50"
          >
            <ShoppingCart className="h-4 w-4" />
            {t("addToCart")}
          </button>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/product/${p.slug}`}>
          <h3 className="line-clamp-1 text-sm font-medium text-[#061c3d] hover:text-[#005F9E]">
            {displayName}
          </h3>
        </Link>
        <div className="mt-1 flex items-center justify-between">
          <span className="gradient-text font-bold">{formatCurrency(p.price)}</span>
          <Button
            size="icon"
            variant="gradient"
            aria-label="Add to cart"
            className="h-8 w-8 rounded-full p-0"
            onClick={() => add(p)}
            disabled={p.stock === 0}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
