"use client";

import { Bell, Search, ChevronDown, Menu, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAdminLocale } from "@/components/admin/admin-locale-provider";

export function AdminTopbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const router = useRouter();
  const { labels, toggleLocale } = useAdminLocale();
  const name = "Medical Admin";
  const email = "Environment configured";
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b bg-white/95 px-4 py-3 shadow-sm backdrop-blur md:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-md p-1 hover:bg-muted md:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative max-w-sm flex-1">
        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={`${labels.common.search}...`} className="ps-9" />
      </div>

      <button
        onClick={toggleLocale}
        className="rounded-full border border-brand-200 px-3 py-1.5 text-sm font-medium text-brand-700 transition hover:bg-brand-50"
      >
        {labels.common.language}
      </button>

      <button
        className="relative rounded-full p-2 hover:bg-muted"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
      </button>

      <button
        onClick={async () => {
          await fetch("/api/auth/logout", { method: "POST" });
          router.push("/admin/login");
          router.refresh();
        }}
        className="rounded-md p-2 text-muted-foreground hover:bg-muted"
        aria-label="Logout"
      >
        <LogOut className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="hidden text-sm md:block">
          <p className="font-medium leading-none">{name}</p>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </div>
    </header>
  );
}
