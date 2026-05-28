"use client";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Column<T> = {
  header: string;
  accessor: (row: T) => ReactNode;
  className?: string;
};

export function DataTable<T extends { id?: string | number }>({
  columns,
  rows,
  empty = "No records.",
  rowKey,
  className,
}: {
  columns: Column<T>[];
  rows: T[];
  empty?: string;
  rowKey?: (row: T, i: number) => string | number;
  className?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className={cn("rounded-lg border border-brand-100 bg-white p-10 text-center text-sm text-muted-foreground shadow-sm", className)}>
        {empty}
      </div>
    );
  }
  return (
    <div className={cn("overflow-x-auto rounded-lg border border-brand-100 bg-white shadow-sm", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-brand-100 bg-brand-50/80 text-start text-[11px] uppercase tracking-wider text-brand-700">
            {columns.map((c, i) => (
              <th key={i} className={cn("px-4 py-3 font-semibold", c.className)}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={rowKey ? rowKey(row, i) : row.id ?? i} className="border-b last:border-0 hover:bg-brand-50/50">
              {columns.map((c, j) => (
                <td key={j} className={cn("px-4 py-3 align-middle text-slate-700", c.className)}>
                  {c.accessor(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Pagination({ total, perPage = 10, current = 1 }: { total: number; perPage?: number; current?: number }) {
  const pages = Math.max(1, Math.ceil(total / perPage));
  return (
    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
      <span>Showing 1 to {Math.min(perPage, total)} of {total} items</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3].slice(0, pages).map((p) => (
          <button key={p} className={cn("min-w-[28px] rounded border px-2 py-1", p === current ? "bg-brand-gradient text-white" : "hover:bg-muted")}>
            {p}
          </button>
        ))}
        {pages > 3 && <span className="px-1">...</span>}
        {pages > 3 && <button className="min-w-[28px] rounded border px-2 py-1 hover:bg-muted">{pages}</button>}
        <select className="ms-2 rounded border bg-white px-2 py-1 text-xs">
          <option>10 / page</option>
          <option>20 / page</option>
          <option>50 / page</option>
        </select>
      </div>
    </div>
  );
}
