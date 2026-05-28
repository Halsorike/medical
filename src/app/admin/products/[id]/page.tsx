"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COLORS = ["Red", "Blue", "Green", "White", "Black", "Silver", "Pink", "Purple"];
const ATTRIBUTES = ["Size: S", "Size: M", "Size: L", "Size: XL", "Material: Cotton", "Material: Plastic"];

function UploadZone({ label, hint }: { label: string; hint?: string }) {
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-pink-200 bg-pink-50/40 py-6 text-sm text-muted-foreground transition hover:border-primary hover:text-primary">
      <span className="text-2xl text-pink-300">⬆</span>
      <span>
        Drag &amp; drop files or{" "}
        <span className="text-primary underline">Browse</span>
      </span>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      <input type="file" className="hidden" />
      <span className="sr-only">{label}</span>
    </label>
  );
}

function Toggle({ id, label, defaultChecked = false }: { id: string; label: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={id} className="cursor-pointer font-normal">
        {label}
      </Label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => setOn(!on)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${on ? "bg-primary" : "bg-gray-200"}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${on ? "translate-x-6" : "translate-x-1"}`}
        />
      </button>
    </div>
  );
}

function SaveBar({ saving }: { saving: boolean }) {
  return (
    <div className="mt-6 flex justify-end gap-3">
      <Button type="button" variant="outline" asChild>
        <Link href="/admin/products">Save and Unpublish</Link>
      </Button>
      <Button type="submit" variant="gradient" disabled={saving}>
        {saving ? "Saving…" : "Save and Publish"}
      </Button>
    </div>
  );
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data: Product }) => setProduct(payload.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="rounded-lg border bg-white p-8 text-sm text-muted-foreground">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <>
        <PageHeader
          title="Product not found"
          description="The requested product could not be loaded from the mock catalog."
          action={
            <Button asChild variant="outline">
              <Link href="/admin/products">Back to products</Link>
            </Button>
          }
        />
        <div className="rounded-lg border bg-white p-8 text-sm text-muted-foreground">
          No product matched ID {params.id}.
        </div>
      </>
    );
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!product) return;

    const currentProduct = product;
    setSaving(true);
    const formData = new FormData(event.currentTarget);
    const response = await fetch(`/api/products/${currentProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(formData.get("name") ?? currentProduct.name),
        category: String(formData.get("category") ?? currentProduct.category),
        price: Number(formData.get("price") ?? currentProduct.price),
        stock: Number(formData.get("stock") ?? currentProduct.stock),
        description: String(formData.get("description") ?? currentProduct.description ?? ""),
      }),
    });

    setSaving(false);

    if (!response.ok) {
      toast.error("Product could not be updated");
      return;
    }

    const payload = (await response.json()) as { data: Product };
    setProduct(payload.data);
    toast.success("Product updated");
  }

  return (
    <>
      <PageHeader
        title="Add New Product"
        description={`Editing: ${product.name} (ID ${product.id})`}
        action={
          <Button asChild variant="outline">
            <Link href="/admin/products">← Back to products</Link>
          </Button>
        }
      />

      <form onSubmit={handleSave}>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="flex-wrap gap-1">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="media">Files &amp; Media</TabsTrigger>
            <TabsTrigger value="pricing">Price &amp; Stock</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>

          {/* ── General ── */}
          <TabsContent value="general">
            <div className="grid gap-4 rounded-lg border bg-white p-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="product-name">Product Name</Label>
                <Input id="product-name" name="name" defaultValue={product.name} required />
              </div>
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" defaultValue={product.brand} />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" defaultValue={product.category} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={4} defaultValue={product.description ?? ""} />
              </div>
              <SaveBar saving={saving} />
            </div>
          </TabsContent>

          {/* ── Files & Media ── */}
          <TabsContent value="media">
            <div className="space-y-4 rounded-lg border bg-white p-6">
              <h3 className="font-semibold text-primary">Product Files &amp; Media</h3>
              <div>
                <Label className="mb-2 block">Gallery Images (600×600)</Label>
                <UploadZone label="Gallery Images" hint="600 × 600 px recommended" />
              </div>
              <div>
                <Label className="mb-2 block">Thumbnail Image (300×300)</Label>
                <UploadZone label="Thumbnail Image" hint="300 × 300 px recommended" />
              </div>
              <div>
                <Label htmlFor="video-provider">Video Provider</Label>
                <Input id="video-provider" placeholder="YouTube / Vimeo" />
              </div>
              <div>
                <Label htmlFor="video-link">Video Link</Label>
                <Input id="video-link" type="url" placeholder="https://…" />
              </div>
              <div>
                <Label className="mb-2 block">PDF Specification</Label>
                <UploadZone label="PDF Specification" hint=".pdf only" />
              </div>
              <SaveBar saving={saving} />
            </div>
          </TabsContent>

          {/* ── Price & Stock ── */}
          <TabsContent value="pricing">
            <div className="space-y-6 rounded-lg border bg-white p-6">
              <h3 className="font-semibold text-primary">Product Price &amp; Stock</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Colors</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      {COLORS.map((c) => (
                        <SelectItem key={c} value={c.toLowerCase()}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Attributes</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select attribute" />
                    </SelectTrigger>
                    <SelectContent>
                      {ATTRIBUTES.map((a) => (
                        <SelectItem key={a} value={a.toLowerCase().replace(/\s/g, "-")}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="unit-price">Unit price *</Label>
                  <Input id="unit-price" name="price" type="number" step="0.01" defaultValue={product.price} required placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="discount-range">Discount Date Range</Label>
                  <Input id="discount-range" placeholder="Discount Date Range" />
                </div>
                <div>
                  <Label htmlFor="discount">Discount *</Label>
                  <Input id="discount" type="number" step="0.01" defaultValue={product.oldPrice ? product.price - product.oldPrice : 0} placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="set-point">Set Point</Label>
                  <Input id="set-point" type="number" defaultValue={0} placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input id="quantity" name="stock" type="number" defaultValue={product.stock} required placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="external-link">External link</Label>
                  <Input id="external-link" type="url" placeholder="External link" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="ext-btn-text">External link button text</Label>
                  <Input id="ext-btn-text" placeholder="External link button text" />
                </div>
              </div>

              <div className="rounded-lg border border-pink-100 p-4">
                <h4 className="mb-3 font-medium text-primary">Low Stock Quantity Warning</h4>
                <div>
                  <Label htmlFor="low-stock">Quantity *</Label>
                  <Input id="low-stock" type="number" defaultValue={1} className="max-w-xs" />
                </div>
              </div>

              <div className="rounded-lg border border-pink-100 p-4 space-y-3">
                <h4 className="mb-1 font-medium text-primary">Stock Visibility State</h4>
                <Toggle id="show-stock-qty" label="Show Stock Quantity" defaultChecked={true} />
                <Toggle id="show-stock-text" label="Show Stock With Text Only" />
                <Toggle id="hide-stock" label="Hide Stock" />
              </div>

              <SaveBar saving={saving} />
            </div>
          </TabsContent>

          {/* ── SEO ── */}
          <TabsContent value="seo">
            <div className="space-y-4 rounded-lg border bg-white p-6">
              <h3 className="font-semibold text-primary">SEO Meta</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="meta-title-en">Meta Title (EN) *</Label>
                  <Input id="meta-title-en" defaultValue={`${product.name} | Medical`} />
                </div>
                <div>
                  <Label htmlFor="meta-title-ar">Meta Title (AR) *</Label>
                  <Input id="meta-title-ar" dir="rtl" placeholder="العنوان بالعربية" />
                </div>
                <div>
                  <Label htmlFor="desc-ar">Description AR *</Label>
                  <Textarea id="desc-ar" rows={4} dir="rtl" placeholder="الوصف بالعربية" />
                </div>
                <div>
                  <Label htmlFor="desc-en">Description EN *</Label>
                  <Textarea
                    id="desc-en"
                    rows={4}
                    defaultValue={product.description ?? `${product.name} from ${product.brand}. Trusted medical-grade quality.`}
                  />
                </div>
              </div>
              <div>
                <Label className="mb-2 block">Meta Image</Label>
                <UploadZone label="Meta Image" hint="1200 × 630 px recommended" />
              </div>
              <SaveBar saving={saving} />
            </div>
          </TabsContent>

          {/* ── Shipping ── */}
          <TabsContent value="shipping">
            <div className="space-y-4 rounded-lg border bg-white p-6">
              <h3 className="font-semibold text-primary">Shipping</h3>
              <div className="space-y-3">
                <Toggle id="cod" label="Cash On Delivery" defaultChecked={true} />
                <Toggle id="free-shipping" label="Free Shipping" defaultChecked={product.price > 150} />
                <Toggle id="flat-rate" label="Flat Rate" />
                <Toggle id="qty-multiply" label="Is Product Quantity Multiply" />
              </div>
              <div className="rounded-lg border border-pink-100 p-4">
                <h4 className="mb-3 font-medium text-primary">Estimate Shipping Time</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label htmlFor="shipping-days" className="sr-only">
                      Shipping Days
                    </Label>
                    <Input id="shipping-days" type="number" placeholder="Shipping Days" defaultValue={3} />
                  </div>
                  <span className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white">Days</span>
                </div>
              </div>
              <SaveBar saving={saving} />
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </>
  );
}
