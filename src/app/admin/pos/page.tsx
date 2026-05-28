"use client";
import { useState } from "react";
import { toast } from "sonner";
import { products } from "@/data/products";
import { PageHeader } from "@/components/admin/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2, ScanLine } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type Line = { id: string; name: string; price: number; qty: number };
export default function POS() {
  const [q, setQ] = useState(""); const [cart, setCart] = useState<Line[]>([]);
  const list = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())).slice(0, 12);
  const add = (p: typeof products[number]) =>
    setCart((c) => (c.find((x) => x.id === p.id) ? c.map((x) => x.id === p.id ? { ...x, qty: x.qty + 1 } : x) : [...c, { id: p.id, name: p.name, price: p.price, qty: 1 }]));
  const total = cart.reduce((a, l) => a + l.qty * l.price, 0);
  return (
    <>
      <PageHeader title="POS system" description="Fast in-store checkout" />
      <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
        <div className="rounded-lg border bg-white p-4">
          <div className="relative mb-4"><ScanLine className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Scan or search product…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {list.map((p) => (
              <button key={p.id} onClick={() => add(p)} className="rounded-lg border p-3 text-left hover:border-primary hover:shadow">
                <p className="line-clamp-2 text-sm font-medium">{p.name}</p>
                <p className="mt-1 text-xs text-primary font-semibold">{formatCurrency(p.price)}</p>
              </button>
            ))}
          </div>
        </div>
        <aside className="rounded-lg border bg-white">
          <p className="border-b p-4 font-semibold">Cart</p>
          <div className="max-h-96 divide-y overflow-y-auto">
            {cart.length === 0 ? <p className="p-6 text-center text-sm text-muted-foreground">No items yet. Scan or pick a product.</p> :
              cart.map((l) => (
                <div key={l.id} className="flex items-center gap-3 p-3 text-sm">
                  <div className="flex-1"><p className="font-medium">{l.name}</p><p className="text-xs text-muted-foreground">{formatCurrency(l.price)}</p></div>
                  <div className="inline-flex items-center rounded-md border">
                    <button onClick={() => setCart((c) => c.map((x) => x.id === l.id ? { ...x, qty: Math.max(0, x.qty - 1) } : x).filter((x) => x.qty > 0))} className="p-1.5"><Minus className="h-3 w-3" /></button>
                    <span className="w-8 text-center">{l.qty}</span>
                    <button onClick={() => setCart((c) => c.map((x) => x.id === l.id ? { ...x, qty: x.qty + 1 } : x))} className="p-1.5"><Plus className="h-3 w-3" /></button>
                  </div>
                  <button onClick={() => setCart((c) => c.filter((x) => x.id !== l.id))}><Trash2 className="h-4 w-4 text-red-500" /></button>
                </div>
              ))}
          </div>
          <div className="border-t p-4">
            <div className="flex justify-between font-semibold"><span>Total</span><span>{formatCurrency(total)}</span></div>
            <Button variant="gradient" className="mt-3 w-full" disabled={cart.length === 0} onClick={() => { toast.success("Sale completed"); setCart([]); }}>Charge</Button>
          </div>
        </aside>
      </div>
    </>
  );
}
