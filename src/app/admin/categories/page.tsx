"use client";
import { useState } from "react";
import { allCategories } from "@/data/products";
import { PageHeader } from "@/components/admin/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function Categories() {
  const [list, setList] = useState<string[]>(allCategories);
  const [name, setName] = useState("");
  return (
    <>
      <PageHeader title="Categories" />
      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Slug</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>{list.map((c, i) => (
              <TableRow key={c}><TableCell>{c}</TableCell><TableCell className="text-muted-foreground">{c.toLowerCase().replace(/\s+/g, "-")}</TableCell>
                <TableCell className="text-right"><Button size="icon" variant="ghost"><Edit className="h-4 w-4" /></Button><Button size="icon" variant="ghost" onClick={() => setList(list.filter((_, x) => x !== i))}><Trash2 className="h-4 w-4 text-red-500" /></Button></TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if (name) { setList([...list, name]); setName(""); } }} className="h-fit space-y-3 rounded-lg border bg-white p-5">
          <p className="font-semibold">Add category</p>
          <Input placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} />
          <Button type="submit" variant="gradient" className="w-full"><Plus className="mr-2 h-4 w-4" />Add</Button>
        </form>
      </div>
    </>
  );
}
