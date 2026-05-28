"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type Line = { name: string; qty: number; unitCost: number };

export default function NewPurchaseOrder() {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>([{ name: "", qty: 1, unitCost: 0 }]);
  const update = (i: number, patch: Partial<Line>) => setLines((ls) => ls.map((l, j) => (i === j ? { ...l, ...patch } : l)));
  const total = lines.reduce((a, l) => a + l.qty * l.unitCost, 0);
  return (
    <>
      <PageHeader title="New purchase order" description="Order stock from a supplier" />
      <form onSubmit={(e) => { e.preventDefault(); toast.success("Purchase order saved"); router.push("/admin/purchase"); }} className="space-y-4 rounded-lg border bg-white p-6">
        <div className="grid gap-3 md:grid-cols-2">
          <div><Label htmlFor="supplier-name">Supplier name</Label><Input id="supplier-name" placeholder="Supplier name" required /></div>
          <div><Label htmlFor="contact-details">Contact details</Label><Input id="contact-details" /></div>
          <div><Label htmlFor="order-date">Order date</Label><Input id="order-date" type="date" required /></div>
          <div><Label htmlFor="expected-delivery">Expected delivery</Label><Input id="expected-delivery" type="date" /></div>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="font-semibold">Order lines</p>
            <Button type="button" variant="outline" size="sm" onClick={() => setLines((ls) => [...ls, { name: "", qty: 1, unitCost: 0 }])}><Plus className="mr-1 h-4 w-4" />Add line</Button>
          </div>
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 text-left text-xs uppercase text-muted-foreground"><th className="px-3 py-2">Product</th><th className="px-3 py-2">Qty</th><th className="px-3 py-2">Unit cost</th><th className="px-3 py-2">Subtotal</th><th></th></tr></thead>
              <tbody>
                {lines.map((l, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-2"><Input value={l.name} onChange={(e) => update(i, { name: e.target.value })} placeholder="Product name" /></td>
                    <td className="px-3 py-2 w-24"><Input type="number" min={1} value={l.qty} onChange={(e) => update(i, { qty: Number(e.target.value) || 1 })} /></td>
                    <td className="px-3 py-2 w-32"><Input type="number" min={0} value={l.unitCost} onChange={(e) => update(i, { unitCost: Number(e.target.value) || 0 })} /></td>
                    <td className="px-3 py-2 w-32">{formatCurrency(l.qty * l.unitCost)}</td>
                    <td className="px-3 py-2"><button type="button" onClick={() => setLines((ls) => ls.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-red-600"><Trash2 className="h-4 w-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 text-sm">
          <span className="text-muted-foreground">Total</span>
          <span className="text-lg font-bold">{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" variant="gradient">Save purchase order</Button>
        </div>
      </form>
    </>
  );
}
