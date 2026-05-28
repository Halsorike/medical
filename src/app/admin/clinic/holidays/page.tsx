"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type ApiHoliday = {
  id: string;
  name: string;
  date: string;
  description?: string | null;
  recurring: boolean;
};

export default function HolidaysPage() {
  const [holidays, setHolidays] = useState<ApiHoliday[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/holidays")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data: ApiHoliday[] }) => setHolidays(payload.data))
      .catch(() => toast.error("Holidays could not be loaded"))
      .finally(() => setLoading(false));
  }, []);

  const all = holidays;
  const onlyHol = holidays;
  const onlyLeave: ApiHoliday[] = [];
  const cols = [
    { header: "Holiday ID", accessor: (r: ApiHoliday) => r.id },
    { header: "Employee", accessor: () => "All Staff" },
    { header: "Period", accessor: (r: ApiHoliday) => (r.recurring ? "Recurring" : "One day") },
    { header: "Date", accessor: (r: ApiHoliday) => new Date(r.date).toLocaleDateString() },
    { header: "Reason", accessor: (r: ApiHoliday) => r.description ?? r.name },
    { header: "Type", accessor: () => <StatusBadge value="holiday" /> },
  ];
  return (
    <>
      <PageHeader title="Holiday & leave" description="Clinic-wide holidays and individual leave requests" action={<div className="flex gap-2"><Button variant="outline"><Plus className="mr-1 h-4 w-4" />New leave</Button><Button asChild variant="gradient"><Link href="/admin/clinic/holidays/new"><Plus className="mr-1 h-4 w-4" />New holiday</Link></Button></div>} />
      <Tabs defaultValue="all">
        <TabsList><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="holidays">Holidays</TabsTrigger><TabsTrigger value="leaves">Leaves</TabsTrigger></TabsList>
        <TabsContent value="all"><DataTable rows={all} empty={loading ? "Loading holidays..." : "No holidays."} rowKey={(r) => r.id} columns={cols} /><Pagination total={all.length} /></TabsContent>
        <TabsContent value="holidays"><DataTable rows={onlyHol} empty={loading ? "Loading holidays..." : "No holidays."} rowKey={(r) => r.id} columns={cols} /><Pagination total={onlyHol.length} /></TabsContent>
        <TabsContent value="leaves"><DataTable rows={onlyLeave} rowKey={(r) => r.id} columns={cols} /><Pagination total={onlyLeave.length} /></TabsContent>
      </Tabs>
    </>
  );
}
