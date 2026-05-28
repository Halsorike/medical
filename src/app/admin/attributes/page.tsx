"use client";
import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Plus } from "lucide-react";

export default function Attributes() {
  const [list, setList] = useState([
    { name: "Size", values: ["S","M","L","XL"] },
    { name: "Material", values: ["Cotton","Latex-free","Silicone"] },
    { name: "Dosage", values: ["100mg","250mg","500mg"] },
  ]);
  const [n, setN] = useState(""); const [v, setV] = useState("");
  return (
    <>
      <PageHeader title="Attributes" />
      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader><TableRow><TableHead>Attribute</TableHead><TableHead>Values</TableHead></TableRow></TableHeader>
            <TableBody>{list.map((a) => (
              <TableRow key={a.name}><TableCell className="font-medium">{a.name}</TableCell>
                <TableCell><div className="flex flex-wrap gap-1">{a.values.map((x) => <span key={x} className="rounded bg-muted px-2 py-0.5 text-xs">{x}</span>)}</div></TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if (n && v) { setList([...list, { name: n, values: v.split(",").map((x) => x.trim()).filter(Boolean) }]); setN(""); setV(""); } }} className="space-y-3 rounded-lg border bg-white p-5 h-fit">
          <p className="font-semibold">Add attribute</p>
          <Input placeholder="Attribute name" value={n} onChange={(e) => setN(e.target.value)} />
          <Input placeholder="Values (comma-separated)" value={v} onChange={(e) => setV(e.target.value)} />
          <Button type="submit" variant="gradient" className="w-full"><Plus className="mr-2 h-4 w-4" />Add</Button>
        </form>
      </div>
    </>
  );
}
