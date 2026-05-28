"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";

type ApiOrder = {
  id: string;
  code: string;
  customer: string;
  date: string;
  total: number;
  status: string;
};

type ExpenseRecord = { id: string; invoice: string; date: string; description: string; head: string; amount: number };

const expenseRecords: ExpenseRecord[] = [];

export default function AccountingPage() {
  const [incomeRecords, setIncomeRecords] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data: ApiOrder[] }) => setIncomeRecords(payload.data))
      .catch(() => toast.error("Income records could not be loaded"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader title="Accounting" description="Incomes, expenses and invoices" />
      <Tabs defaultValue="incomes">
        <TabsList><TabsTrigger value="incomes">Incomes</TabsTrigger><TabsTrigger value="expenses">Expenses</TabsTrigger></TabsList>
        <TabsContent value="incomes">
          <DataTable
            rows={incomeRecords}
            empty={loading ? "Loading income records..." : "No income records."}
            rowKey={(r) => r.id}
            columns={[
              { header: "Invoice ID", accessor: (r) => r.code },
              { header: "Patient name", accessor: (r) => r.customer },
              { header: "Date & time", accessor: (r) => new Date(r.date).toLocaleDateString() },
              { header: "Description", accessor: (r) => r.status },
              { header: "Employee", accessor: () => "-" },
              { header: "Service", accessor: () => "Order" },
              { header: "Amount", accessor: (r) => formatCurrency(r.total) },
            ]}
          />
          <Pagination total={incomeRecords.length} />
        </TabsContent>
        <TabsContent value="expenses">
          <DataTable
            rows={expenseRecords}
            rowKey={(r) => r.id}
            columns={[
              { header: "Invoice ID", accessor: (r) => r.invoice },
              { header: "Date & time", accessor: (r) => r.date },
              { header: "Description", accessor: (r) => r.description },
              { header: "Expense head", accessor: (r) => r.head },
              { header: "Amount", accessor: (r) => formatCurrency(r.amount) },
            ]}
          />
          <Pagination total={expenseRecords.length} />
        </TabsContent>
      </Tabs>
    </>
  );
}
