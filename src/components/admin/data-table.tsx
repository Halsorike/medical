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
      <div className={cn("rounded-lg border bg-white p-10 text-center text-sm text-muted-foreground", className)}>
        {empty}
      </div>
    );
  }
  return (
    <div className={cn("overflow-x-auto rounded-lg border bg-white", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-slate-50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            {columns.map((c, i) => (
              <th key={i} className={cn("px-4 py-3 font-medium", c.className)}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={rowKey ? rowKey(row, i) : row.id ?? i} className="border-b last:border-0 hover:bg-slate-50/60">
              {columns.map((c, j) => (
                <td key={j} className={cn("px-4 py-3 align-middle", c.className)}>{c.accessor(row)}</td>
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
          <button key={p} className={cn("min-w-[28px] rounded border px-2 py-1", p === current ? "bg-brand-gradient text-white" : "hover:bg-muted")}>{p}</button>
        ))}
        {pages > 3 && <span className="px-1">…</span>}
        {pages > 3 && <button className="min-w-[28px] rounded border px-2 py-1 hover:bg-muted">{pages}</button>}
        <select className="ml-2 rounded border bg-white px-2 py-1 text-xs">
          <option>10 / page</option><option>20 / page</option><option>50 / page</option>
        </select>
      </div>
    </div>
  );
}
