"use client";
import { useState } from "react";
import { allBrands } from "@/data/products";
import { PageHeader } from "@/components/admin/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";

export default function Brands() {
  const [list, setList] = useState<string[]>(allBrands);
  const [name, setName] = useState("");
  return (
    <>
      <PageHeader title="Brands" />
      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader><TableRow><TableHead>Brand</TableHead><TableHead>Products</TableHead><TableHead className="text-right"></TableHead></TableRow></TableHeader>
            <TableBody>{list.map((b, i) => (
              <TableRow key={b}><TableCell>{b}</TableCell><TableCell>{2 + ((i * 7 + b.length) % 30)}</TableCell>
                <TableCell className="text-right"><Button size="icon" variant="ghost" onClick={() => setList(list.filter((_, x) => x !== i))}><Trash2 className="h-4 w-4 text-red-500" /></Button></TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if (name) { setList([...list, name]); setName(""); } }} className="h-fit space-y-3 rounded-lg border bg-white p-5">
          <p className="font-semibold">Add brand</p>
          <Input placeholder="Brand name" value={name} onChange={(e) => setName(e.target.value)} />
          <Button type="submit" variant="gradient" className="w-full"><Plus className="mr-2 h-4 w-4" />Add</Button>
        </form>
      </div>
    </>
  );
}
