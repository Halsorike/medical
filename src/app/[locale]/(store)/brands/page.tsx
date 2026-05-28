"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/navigation";
import type { Product } from "@/types";
import { Input } from "@/components/ui/input";

export default function Brands() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const allBrands = useMemo(() => Array.from(new Set(products.map((product) => product.brand))), [products]);
  const filtered = allBrands.filter((brand) => brand.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    fetch("/api/products")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data: Product[] }) => setProducts(payload.data))
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="container py-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Shop by Brand</h1>
        <Input
          placeholder="Search brands..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="max-w-xs"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((brand) => {
            const count = products.filter((product) => product.brand === brand).length;

            return (
              <Link
                key={brand}
                href={`/shop?q=${encodeURIComponent(brand)}`}
                className="flex flex-col items-center gap-3 rounded-xl border bg-white p-6 text-center transition-all hover:border-primary hover:shadow-md"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <span className="text-xl font-bold text-slate-400">{brand[0]}</span>
                </div>
                <h2 className="text-sm font-semibold">{brand}</h2>
                <p className="text-xs text-muted-foreground">{count} products</p>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center text-muted-foreground">No brands found for &quot;{query}&quot;</div>
      )}
    </div>
  );
}
