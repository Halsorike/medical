"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import { useAdminLocale } from "@/components/admin/admin-locale-provider";

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
  const { labels } = useAdminLocale();
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
      <PageHeader title={labels.accounting.title} description={labels.accounting.description} />
      <Tabs defaultValue="incomes">
        <TabsList><TabsTrigger value="incomes">{labels.accounting.incomes}</TabsTrigger><TabsTrigger value="expenses">{labels.accounting.expenses}</TabsTrigger></TabsList>
        <TabsContent value="incomes">
          <DataTable
            rows={incomeRecords}
            empty={loading ? labels.common.loading : labels.common.noData}
            rowKey={(r) => r.id}
            columns={[
              { header: labels.accounting.invoiceId, accessor: (r) => r.code },
              { header: labels.appointments.patient, accessor: (r) => r.customer },
              { header: labels.appointments.date, accessor: (r) => new Date(r.date).toLocaleDateString() },
              { header: labels.departments.descriptionLabel, accessor: (r) => r.status },
              { header: labels.appointments.employee, accessor: () => "-" },
              { header: labels.appointments.service, accessor: () => "Order" },
              { header: labels.accounting.amount, accessor: (r) => formatCurrency(r.total) },
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
