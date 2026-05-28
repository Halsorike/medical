"use client";

import { useEffect, useState } from "react";
import { Link } from "@/navigation";
import { Heart, X } from "lucide-react";
import type { Product } from "@/types";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data: Product[] }) => setWishlist(payload.data.slice(0, 6)))
      .catch(() => setWishlist([]));
  }, []);

  return (
    <div className="container py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">My Wishlist</h1>
          <Badge variant="secondary">{wishlist.length} items</Badge>
        </div>
        {wishlist.length > 0 ? (
          <Button variant="ghost" onClick={() => setWishlist([])}>
            Clear all
          </Button>
        ) : null}
      </div>

      {wishlist.length === 0 ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border bg-white p-8 text-center">
          <Heart className="mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Your wishlist is empty</h2>
          <p className="mt-2 text-sm text-muted-foreground">Browse products and add your favourites</p>
          <Button asChild variant="gradient" className="mt-5">
            <Link href="/shop">Browse products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {wishlist.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard p={product} />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute right-2 top-2 bg-white/90 shadow-sm hover:bg-white"
                aria-label="Remove from wishlist"
                onClick={() => setWishlist((items) => items.filter((item) => item.id !== product.id))}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
