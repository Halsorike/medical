"use client";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { holidays } from "@/data/clinic";

export default function HolidaysPage() {
  const all = holidays;
  const onlyHol = holidays.filter((h) => h.type === "holiday");
  const onlyLeave = holidays.filter((h) => h.type === "leave");
  const cols = [
    { header: "Holiday ID", accessor: (r: typeof holidays[number]) => r.id },
    { header: "Employee", accessor: (r: typeof holidays[number]) => r.employee },
    { header: "Period", accessor: (r: typeof holidays[number]) => r.period },
    { header: "Date", accessor: (r: typeof holidays[number]) => r.date },
    { header: "Reason", accessor: (r: typeof holidays[number]) => r.reason },
    { header: "Type", accessor: (r: typeof holidays[number]) => <StatusBadge value={r.type} /> },
  ];
  return (
    <>
      <PageHeader title="Holiday & leave" description="Clinic-wide holidays and individual leave requests" action={<div className="flex gap-2"><Button variant="outline"><Plus className="mr-1 h-4 w-4" />New leave</Button><Button asChild variant="gradient"><Link href="/admin/clinic/holidays/new"><Plus className="mr-1 h-4 w-4" />New holiday</Link></Button></div>} />
      <Tabs defaultValue="all">
        <TabsList><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="holidays">Holidays</TabsTrigger><TabsTrigger value="leaves">Leaves</TabsTrigger></TabsList>
        <TabsContent value="all"><DataTable rows={all} rowKey={(r) => r.id} columns={cols} /><Pagination total={all.length} /></TabsContent>
        <TabsContent value="holidays"><DataTable rows={onlyHol} rowKey={(r) => r.id} columns={cols} /><Pagination total={onlyHol.length} /></TabsContent>
        <TabsContent value="leaves"><DataTable rows={onlyLeave} rowKey={(r) => r.id} columns={cols} /><Pagination total={onlyLeave.length} /></TabsContent>
      </Tabs>
    </>
  );
}
