"use client";
import { useState } from "react";
import { Toaster } from "sonner";
import { AdminLocaleProvider, useAdminLocale } from "@/components/admin/admin-locale-provider";
import { AdminSidebar, MobileAdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";
import { StoreProvider } from "@/lib/store";

function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { dir } = useAdminLocale();

  return (
    <div dir={dir} className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <MobileAdminSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Toaster richColors position={dir === "rtl" ? "top-left" : "top-right"} />
        <AdminTopbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <AdminLocaleProvider>
        <AdminShell>{children}</AdminShell>
      </AdminLocaleProvider>
    </StoreProvider>
  );
}
