import { cn } from "@/lib/utils";

const map: Record<string, string> = {
  active: "bg-green-50 text-green-700 ring-green-200",
  inactive: "bg-slate-50 text-slate-600 ring-slate-200",
  approved: "bg-green-50 text-green-700 ring-green-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  declined: "bg-red-50 text-red-700 ring-red-200",
  rejected: "bg-red-50 text-red-700 ring-red-200",
  completed: "bg-green-50 text-green-700 ring-green-200",
  upcoming: "bg-blue-50 text-blue-700 ring-blue-200",
  done: "bg-green-50 text-green-700 ring-green-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
  new: "bg-blue-50 text-blue-700 ring-blue-200",
  replied: "bg-green-50 text-green-700 ring-green-200",
  holiday: "bg-purple-50 text-purple-700 ring-purple-200",
  leave: "bg-orange-50 text-orange-700 ring-orange-200",
  paid: "bg-green-50 text-green-700 ring-green-200",
  unpaid: "bg-amber-50 text-amber-700 ring-amber-200",
  refunded: "bg-slate-100 text-slate-700 ring-slate-200",
};

export function StatusBadge({ value }: { value: string }) {
  const key = value.toLowerCase();
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1", map[key] ?? "bg-slate-50 text-slate-700 ring-slate-200")}>
      {value.replace(/^./, (c) => c.toUpperCase())}
    </span>
  );
}
