import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default function PurchaseOrderDetail({ params }: { params: { id: string } }) {
  // Mock detail. In real life, fetch by params.id.
  const order = {
    id: params.id,
    supplier: "MedSupply Inc.",
    contact: "ops@medsupply.com",
    customer: "—",
    date: "2024-01-11",
    status: "completed" as const,
    lines: [
      { name: "Surgical Gloves (M)", qty: 50, unitCost: 8 },
      { name: "Face Masks (50pk)", qty: 30, unitCost: 12 },
      { name: "Alcohol Wipes", qty: 20, unitCost: 5 },
    ],
  };
  const total = order.lines.reduce((a, l) => a + l.qty * l.unitCost, 0);
  return (
    <>
      <PageHeader title={`Order ${order.id} details`} description={`Created ${order.date}`}
        action={<Link href="/admin/purchase"><Button variant="outline">Back to list</Button></Link>} />
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead><tr className="bg-slate-50 text-left text-xs uppercase text-muted-foreground"><th className="px-4 py-3">Product</th><th className="px-4 py-3">Qty</th><th className="px-4 py-3">Unit cost</th><th className="px-4 py-3">Subtotal</th></tr></thead>
            <tbody>
              {order.lines.map((l, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-3">{l.name}</td><td className="px-4 py-3">{l.qty}</td><td className="px-4 py-3">{formatCurrency(l.unitCost)}</td><td className="px-4 py-3 font-medium">{formatCurrency(l.qty * l.unitCost)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr className="border-t bg-slate-50"><td className="px-4 py-3" colSpan={3}><span className="text-muted-foreground">Total</span></td><td className="px-4 py-3 font-bold">{formatCurrency(total)}</td></tr></tfoot>
          </table>
        </div>
        <aside className="space-y-3 rounded-lg border bg-white p-4 text-sm">
          <div><p className="text-xs text-muted-foreground">Supplier</p><p className="font-medium">{order.supplier}</p></div>
          <div><p className="text-xs text-muted-foreground">Contact</p><p>{order.contact}</p></div>
          <div><p className="text-xs text-muted-foreground">Status</p><StatusBadge value={order.status} /></div>
          <div className="space-y-2 pt-2">
            <Button variant="gradient" className="w-full">Mark as received</Button>
            <Button variant="outline" className="w-full">Print PO</Button>
          </div>
        </aside>
      </div>
    </>
  );
}
