"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import type { Product } from "@/types";
import { PageHeader } from "@/components/admin/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableHeader, TableHead, TableBody, TableRow, TableCell,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Plus, Trash2, Search, Pencil } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data: Product[] }) => setProducts(payload.data))
      .catch(() => toast.error("Products could not be loaded"));
  }, []);

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          q === "" ||
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.brand.toLowerCase().includes(q.toLowerCase()) ||
          p.category.toLowerCase().includes(q.toLowerCase())
      ),
    [products, q]
  );

  async function handleDelete(id: string, name: string) {
    const response = await fetch(`/api/products/${id}`, { method: "DELETE" });

    if (!response.ok) {
      toast.error(`"${name}" could not be removed`);
      return;
    }

    setProducts((current) => current.filter((product) => product.id !== id));
    toast.success(`"${name}" removed from catalog`);
  }

  return (
    <>
      <PageHeader
        title="All products"
        description={`${products.length} products in catalog`}
        action={
          <Link href="/admin/products/new">
            <Button variant="gradient">
              <Plus className="mr-2 h-4 w-4" />
              Add product
            </Button>
          </Link>
        }
      />

      <div className="rounded-lg border bg-white">
        <div className="flex items-center gap-2 p-4">
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, brand or category"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
          <span className="hidden text-sm text-muted-foreground sm:block">
            {filtered.length} results
          </span>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt=""
                      className="h-10 w-10 rounded border bg-slate-50 object-cover"
                    />
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        SKU MED-{p.id.padStart(5, "0")}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>{p.brand}</TableCell>
                <TableCell>{formatCurrency(p.price)}</TableCell>
                <TableCell>
                  <span className={p.stock <= 10 ? "font-semibold text-amber-600" : ""}>
                    {p.stock}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={p.stock > 0 ? "success" : "destructive"}>
                    {p.stock > 0 ? "In stock" : "Out"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild size="icon" variant="ghost" aria-label={`Edit ${p.name}`}>
                      <Link href={`/admin/products/${p.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Delete ${p.name}`}
                      onClick={() => handleDelete(p.id, p.name)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
