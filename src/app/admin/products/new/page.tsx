"use client";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { allCategories, allBrands } from "@/data/products";
import { Upload } from "lucide-react";

export default function NewProduct() {
  const [saving, setSaving] = useState(false);
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "New Product");
    const rawSlug = String(formData.get("slug") ?? "").trim();
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug: rawSlug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        price: Number(formData.get("price") ?? 0),
        stock: Number(formData.get("stock") ?? 0),
        category: String(formData.get("category") ?? "Devices"),
        description: String(formData.get("description") ?? ""),
        images: [],
      }),
    });
    setSaving(false);

    if (!response.ok) {
      toast.error("Product could not be created");
      return;
    }

    toast.success("Product created");
  }

  return (
    <>
      <PageHeader title="New product" description="Add a product to your catalog" />
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="media">Files & Media</TabsTrigger>
            <TabsTrigger value="pricing">Price & Stock</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>

          <TabsContent value="general" forceMount>
            <div className="rounded-lg border bg-white p-6 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2"><Label>Name</Label><Input name="name" required /></div>
              <div className="md:col-span-2"><Label>Description</Label><Textarea name="description" rows={4} /></div>
              <div><Label>Category</Label><Select name="category"><SelectTrigger><SelectValue placeholder="Choose" /></SelectTrigger><SelectContent>{allCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Brand</Label><Select><SelectTrigger><SelectValue placeholder="Choose" /></SelectTrigger><SelectContent>{allBrands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select></div>
            </div>
          </TabsContent>

          <TabsContent value="media" forceMount>
            <div className="rounded-lg border bg-white p-6">
              <label className="flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-muted-foreground hover:border-primary hover:text-primary">
                <Upload className="h-8 w-8" /><span>Drag & drop or click to upload images</span><input type="file" multiple className="hidden" />
              </label>
            </div>
          </TabsContent>

          <TabsContent value="pricing" forceMount>
            <div className="rounded-lg border bg-white p-6 grid gap-4 md:grid-cols-3">
              <div><Label>Price ($)</Label><Input name="price" type="number" step="0.01" required /></div>
              <div><Label>Compare-at price</Label><Input type="number" step="0.01" /></div>
              <div><Label>Stock quantity</Label><Input name="stock" type="number" required /></div>
              <div><Label>SKU</Label><Input /></div>
              <div><Label>Barcode</Label><Input /></div>
              <div><Label>Tax class</Label><Select><SelectTrigger><SelectValue placeholder="Standard" /></SelectTrigger><SelectContent><SelectItem value="std">Standard</SelectItem><SelectItem value="zero">Zero-rated</SelectItem></SelectContent></Select></div>
            </div>
          </TabsContent>

          <TabsContent value="seo" forceMount>
            <div className="rounded-lg border bg-white p-6 grid gap-4">
              <div><Label>Meta title</Label><Input /></div>
              <div><Label>Meta description</Label><Textarea rows={3} /></div>
              <div><Label>URL slug</Label><Input name="slug" /></div>
              <div><Label>Keywords</Label><Input placeholder="comma-separated" /></div>
            </div>
          </TabsContent>

          <TabsContent value="shipping" forceMount>
            <div className="rounded-lg border bg-white p-6 grid gap-4 md:grid-cols-3">
              <div><Label>Weight (kg)</Label><Input type="number" step="0.1" /></div>
              <div><Label>Length (cm)</Label><Input type="number" /></div>
              <div><Label>Width (cm)</Label><Input type="number" /></div>
              <div><Label>Height (cm)</Label><Input type="number" /></div>
              <div><Label>Free shipping</Label><Select><SelectTrigger><SelectValue placeholder="No" /></SelectTrigger><SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent></Select></div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" type="button">Save as draft</Button>
          <Button variant="gradient" type="submit" disabled={saving}>{saving ? "Publishing…" : "Publish product"}</Button>
        </div>
      </form>
    </>
  );
}
