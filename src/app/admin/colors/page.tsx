"use client";
import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

const presets = [
  { name: "Brand teal", hex: "#0099A8" }, { name: "Brand blue", hex: "#005F9E" },
  { name: "Success", hex: "#16a34a" }, { name: "Warning", hex: "#f59e0b" },
  { name: "Danger", hex: "#dc2626" }, { name: "Slate", hex: "#475569" },
];

export default function Colors() {
  const [list, setList] = useState(presets);
  const [name, setName] = useState(""); const [hex, setHex] = useState("#000000");
  return (
    <>
      <PageHeader title="Colors" description="Manage color swatches for variants and theming" />
      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((c, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border bg-white p-4">
              <div className="h-10 w-10 rounded" style={{ backgroundColor: c.hex }} />
              <div className="flex-1"><p className="font-medium">{c.name}</p><p className="text-xs text-muted-foreground">{c.hex}</p></div>
              <Button size="icon" variant="ghost" onClick={() => setList(list.filter((_, x) => x !== i))}><Trash2 className="h-4 w-4 text-red-500" /></Button>
            </div>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if (name) { setList([...list, { name, hex }]); setName(""); } }} className="h-fit space-y-3 rounded-lg border bg-white p-5">
          <p className="font-semibold">Add color</p>
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="flex items-center gap-2"><input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="h-10 w-12 rounded border" /><Input value={hex} onChange={(e) => setHex(e.target.value)} /></div>
          <Button type="submit" variant="gradient" className="w-full"><Plus className="mr-2 h-4 w-4" />Add</Button>
        </form>
      </div>
    </>
  );
}
