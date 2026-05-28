"use client";
import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { FileBarChart, FileSpreadsheet, FileText, Download } from "lucide-react";

const tiles = [
  { name: "Sales by product", icon: FileBarChart, desc: "Top-selling products in a period" },
  { name: "Sales by category", icon: FileBarChart, desc: "Performance per category" },
  { name: "Stock report", icon: FileSpreadsheet, desc: "Current stock and low-stock alerts" },
  { name: "Customer report", icon: FileText, desc: "Customer growth and retention" },
  { name: "Affiliate report", icon: FileText, desc: "Commissions by affiliate" },
  { name: "Refunds report", icon: FileText, desc: "Refund volume and reasons" },
  { name: "Tax report", icon: FileSpreadsheet, desc: "Tax collected by region" },
  { name: "Shipping report", icon: FileSpreadsheet, desc: "Shipping costs vs revenue" },
];

const REPORT_TYPES = ["Appointment", "Income", "Expense", "Employee", "Patient", "Sales", "Emails", "Doctor"];

export default function Reports() {
  const [showResult, setShowResult] = useState(false);
  return (
    <>
      <PageHeader title="Reports" description="Generate reports and download analytics exports" />
      <Tabs defaultValue="generate">
        <TabsList>
          <TabsTrigger value="generate">Generate report</TabsTrigger>
          <TabsTrigger value="exports">Exports</TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <Tabs defaultValue={REPORT_TYPES[0]} className="rounded-lg border bg-white p-4">
            <TabsList className="flex flex-wrap">
              {REPORT_TYPES.map((t) => <TabsTrigger key={t} value={t}>{t}</TabsTrigger>)}
            </TabsList>
            {REPORT_TYPES.map((t) => (
              <TabsContent key={t} value={t}>
                <form onSubmit={(e) => { e.preventDefault(); setShowResult(true); }} className="grid gap-3 md:grid-cols-5">
                  <div><Label>From date</Label><Input type="date" /></div>
                  <div><Label>To date</Label><Input type="date" /></div>
                  <div><Label>Status</Label>
                    <Select><SelectTrigger><SelectValue placeholder="Please select" /></SelectTrigger>
                      <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="open">Open</SelectItem><SelectItem value="closed">Closed</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div><Label>Filter</Label><Input placeholder="Filter…" /></div>
                  <div className="flex items-end gap-2"><Button type="submit" variant="gradient">Get report</Button></div>
                </form>
                {showResult && (
                  <div className="mt-4 rounded-md border bg-slate-50 p-6 text-center text-sm text-muted-foreground">
                    {t} report generated (mock). Rendering would happen here based on filters.
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>

        <TabsContent value="exports">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tiles.map((r) => (
              <div key={r.name} className="rounded-lg border bg-white p-5">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-brand-gradient text-white"><r.icon className="h-5 w-5" /></div>
                <p className="mt-3 font-semibold">{r.name}</p>
                <p className="text-sm text-muted-foreground">{r.desc}</p>
                <Button size="sm" variant="outline" className="mt-4"><Download className="mr-2 h-3 w-3" />Export CSV</Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
