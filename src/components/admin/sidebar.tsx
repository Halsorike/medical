"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import type { KeyboardEvent } from "react";
import { adminSidebarNav, type AdminNavGroup, type AdminNavItem } from "@/data/admin-nav";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

function getIcon(icon: string) {
  return (Icons as any)[icon] ?? Icons.Circle;
}

function isItemActive(item: AdminNavItem, pathname: string | null, siblings: AdminNavItem[] = []) {
  if (pathname === item.href) return true;
  if (item.href === "/admin") return false;
  if (!pathname?.startsWith(`${item.href}/`)) return false;
  return !siblings.some((sibling) => sibling.href !== item.href && (pathname === sibling.href || pathname.startsWith(`${sibling.href}/`)));
}

function isGroupActive(group: AdminNavGroup, pathname: string | null) {
  return group.children.some((item) => pathname === item.href || !!pathname?.startsWith(`${item.href}/`));
}

function readStoredOpen(key: string) {
  try {
    const stored = window.localStorage?.getItem(key);
    if (stored === "true") return true;
    if (stored === "false") return false;
  } catch {
    // Some embedded browser contexts do not expose localStorage.
  }

  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${encodeURIComponent(key)}=`))
    ?.split("=")[1];
  if (cookie === "true") return true;
  if (cookie === "false") return false;
  return null;
}

function writeStoredOpen(key: string, value: boolean) {
  try {
    window.localStorage?.setItem(key, String(value));
  } catch {
    // Keep the sidebar usable when localStorage is unavailable.
  }
  document.cookie = `${encodeURIComponent(key)}=${value}; path=/; SameSite=Lax`;
}

function NavLink({ item, pathname, siblings = [] }: { item: AdminNavItem; pathname: string | null; siblings?: AdminNavItem[] }) {
  const Icon = getIcon(item.icon);
  const active = isItemActive(item, pathname, siblings);
  return (
    <Link href={item.href} className={cn("flex items-center gap-2 rounded-md px-3 py-2 transition", active ? "bg-brand-gradient text-white" : "text-foreground hover:bg-muted")}>
      <Icon className="h-4 w-4" /><span className="truncate">{item.label}</span>
    </Link>
  );
}

function NavGroup({ group, pathname }: { group: AdminNavGroup; pathname: string | null }) {
  const headingId = useId();
  const panelId = useId();
  const storageKey = `admin-sidebar:${group.id}`;
  const active = isGroupActive(group, pathname);
  const Icon = getIcon(group.icon);
  // Start open on the server (avoids hydration mismatch); client corrects via useEffect
  const [open, setOpen] = useState(true);

  useEffect(() => {
    // Run only on the client where localStorage/document are available
    const stored = readStoredOpen(storageKey);
    setOpen(active || stored !== false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mount only — intentionally omit deps to avoid re-running on every active change

  // Re-open when the active route moves into this group
  useEffect(() => {
    if (active) setOpen(true);
  }, [active]);

  function toggle() {
    setOpen((current) => {
      const next = !current;
      writeStoredOpen(storageKey, next);
      return next;
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  }

  return (
    <div className="space-y-1">
      <div
        id={headingId}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 text-sm transition",
          active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        <Icon className="h-4 w-4" />
        <span className="min-w-0 flex-1 truncate font-medium">{group.label}</span>
        <Icons.ChevronDown className={cn("h-4 w-4 transition-transform", open ? "rotate-180" : "")} />
      </div>
      <div id={panelId} role="region" aria-labelledby={headingId} className={cn("space-y-1 pl-2", open ? "block" : "hidden")}>
        {group.children.map((item) => <NavLink key={item.href} item={item} pathname={pathname} siblings={group.children} />)}
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 overflow-y-auto border-r bg-white md:block">
      <div className="border-b p-4">
        <Link href="/admin" className="text-xl font-bold"><span className="bg-brand-gradient bg-clip-text text-transparent">Medical</span><span className="ml-1 text-xs text-muted-foreground">Admin</span></Link>
      </div>
      <nav className="space-y-1 p-3 text-sm">
        {adminSidebarNav.map((entry) => (
          entry.type === "link"
            ? <NavLink key={entry.href} item={entry} pathname={pathname} />
            : <NavGroup key={entry.id} group={entry} pathname={pathname} />
        ))}
      </nav>
    </aside>
  );
}

export function MobileAdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const handleEsc = (e: any) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  return (
    <>
      <div
        className={cn("fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity duration-300", open ? "opacity-100" : "pointer-events-none opacity-0")}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl flex flex-col transition-transform duration-300 ease-in-out md:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b p-4">
          <Link href="/admin" className="text-xl font-bold">
            <span className="bg-brand-gradient bg-clip-text text-transparent">Medical</span>
            <span className="ml-1 text-xs text-muted-foreground">Admin</span>
          </Link>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-muted" aria-label="Close menu">
            <Icons.X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-sm">
          {adminSidebarNav.map((entry) => (
            entry.type === "link"
              ? <NavLink key={entry.href} item={entry} pathname={pathname} />
              : <NavGroup key={entry.id} group={entry} pathname={pathname} />
          ))}
        </nav>
      </div>
    </>
  );
}
