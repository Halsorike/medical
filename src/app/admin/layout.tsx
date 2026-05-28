"use client";
import { useState } from "react";
import { Toaster } from "sonner";
import { AdminSidebar, MobileAdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";
import { LocaleDocumentAttributes } from "@/components/i18n/locale-document-attributes";
import { StoreProvider } from "@/lib/store";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <StoreProvider>
      <LocaleDocumentAttributes locale="en" />
      <div dir="ltr" className="flex min-h-screen bg-slate-50">
        <AdminSidebar />
        <MobileAdminSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="flex flex-1 flex-col min-w-0">
          <Toaster richColors position="top-right" />
          <AdminTopbar onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </StoreProvider>
  );
}
