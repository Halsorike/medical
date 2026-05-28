import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
export function StatCard({ label, value, hint, icon: Icon, trend }: { label: string; value: string; hint?: string; icon?: LucideIcon; trend?: number }) {
  return (
    <div className="rounded-lg border bg-white p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        {Icon && <div className="grid h-8 w-8 place-items-center rounded-md bg-brand-gradient text-white"><Icon className="h-4 w-4" /></div>}
      </div>
      <p className="mt-3 text-2xl font-bold">{value}</p>
      {(hint || trend !== undefined) && (
        <p className={cn("mt-1 text-xs", trend && trend < 0 ? "text-red-600" : "text-green-600")}>
          {trend !== undefined ? `${trend > 0 ? "↑" : "↓"} ${Math.abs(trend)}% ` : ""}{hint}
        </p>
      )}
    </div>
  );
}
