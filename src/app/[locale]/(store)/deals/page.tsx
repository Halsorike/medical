import { Tag } from "lucide-react";
import type { Product } from "@/types";
import { getApiData } from "@/lib/server-api";
import { ProductCard } from "@/components/store/product-card";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Deals() {
  const products = await getApiData<Product[]>("/api/products") ?? [];
  const deals = products.filter((p) => p.oldPrice);
  const totalSavings = deals.reduce((sum, p) => sum + (p.oldPrice! - p.price), 0);

  return (
    <div className="container py-10">
      {/* Header banner */}
      <div className="mb-8 overflow-hidden rounded-xl bg-brand-gradient p-8 text-white">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wide">Limited time offers</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold">Today&apos;s Deals</h1>
            <p className="mt-1 text-white/80">
              {deals.length} products on sale â€” save up to {formatCurrency(totalSavings)} total
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">{deals.length}</p>
            <p className="text-sm text-white/80">active deals</p>
          </div>
        </div>
      </div>

      {/* Products grid */}
      {deals.length === 0 ? (
        <div className="rounded-lg border bg-white py-20 text-center text-muted-foreground">
          No deals available right now. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {deals.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}
