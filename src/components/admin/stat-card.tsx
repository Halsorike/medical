import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  trend?: number;
}) {
  return (
    <div className="rounded-lg border border-brand-100 bg-white/95 p-5 shadow-sm shadow-brand-100/60 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {Icon && (
          <div className="grid h-9 w-9 place-items-center rounded-md bg-brand-gradient text-white shadow-sm shadow-brand-200">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold text-brand-text">{value}</p>
      {(hint || trend !== undefined) && (
        <p className={cn("mt-1 text-xs", trend && trend < 0 ? "text-red-600" : "text-green-600")}>
          {trend !== undefined ? `${trend > 0 ? "+" : "-"} ${Math.abs(trend)}% ` : ""}
          {hint}
        </p>
      )}
    </div>
  );
}
