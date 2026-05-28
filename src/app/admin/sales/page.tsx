"use client";

import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { RevenueLine, OrdersBar } from "@/components/admin/charts";
import { useStore, ordersByMonth, totalRevenue } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, ShoppingBag, Percent } from "lucide-react";

export default function Sales() {
  const { state } = useStore();
  const monthlyData = ordersByMonth(state.orders);
  const revenue = totalRevenue(state.orders);
  const avgOrder = state.orders.length > 0 ? revenue / state.orders.length : 0;

  return (
    <>
      <PageHeader title="Sales" description="Revenue performance and trends" />
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <StatCard label="Revenue (total)" value={formatCurrency(revenue)} trend={14} icon={DollarSign} />
        <StatCard label="Orders (total)" value={state.orders.length.toString()} trend={9} icon={ShoppingBag} />
        <StatCard label="Avg order value" value={formatCurrency(avgOrder)} trend={2} icon={DollarSign} />
        <StatCard label="Conversion rate" value="3.4%" trend={-1} icon={Percent} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-5">
          <p className="mb-4 font-semibold">Revenue trend</p>
          <RevenueLine data={monthlyData} />
        </div>
        <div className="rounded-lg border bg-white p-5">
          <p className="mb-4 font-semibold">Orders trend</p>
          <OrdersBar data={monthlyData} />
        </div>
      </div>
    </>
  );
}
