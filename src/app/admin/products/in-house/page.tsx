import { products } from "@/data/products";
import { PageHeader } from "@/components/admin/page-header";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
export default function InHouse() {
  const list = products.filter((_, i) => i % 2 === 0);
  return (
    <>
      <PageHeader title="In-house products" description="Products manufactured or curated in-house" />
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>SKU</TableHead><TableHead>Stock</TableHead><TableHead>Price</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>{list.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell>MED-{p.id.padStart(5, "0")}</TableCell>
              <TableCell>{p.stock}</TableCell>
              <TableCell>{formatCurrency(p.price)}</TableCell>
              <TableCell><Badge variant="success">Active</Badge></TableCell>
            </TableRow>
          ))}</TableBody>
        </Table>
      </div>
    </>
  );
}
