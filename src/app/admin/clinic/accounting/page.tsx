"use client";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { incomeRecords, expenseRecords } from "@/data/clinic";
import { formatCurrency } from "@/lib/utils";

export default function AccountingPage() {
  return (
    <>
      <PageHeader title="Accounting" description="Incomes, expenses and invoices" />
      <Tabs defaultValue="incomes">
        <TabsList><TabsTrigger value="incomes">Incomes</TabsTrigger><TabsTrigger value="expenses">Expenses</TabsTrigger></TabsList>
        <TabsContent value="incomes">
          <DataTable
            rows={incomeRecords}
            rowKey={(r) => r.id}
            columns={[
              { header: "Invoice ID", accessor: (r) => r.invoice },
              { header: "Patient name", accessor: (r) => r.patient },
              { header: "Date & time", accessor: (r) => r.date },
              { header: "Description", accessor: (r) => r.description },
              { header: "Employee", accessor: (r) => r.employee },
              { header: "Service", accessor: (r) => r.service },
              { header: "Amount", accessor: (r) => formatCurrency(r.amount) },
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
