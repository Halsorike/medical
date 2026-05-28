import { Link } from "@/navigation";
import { User, ShoppingBag, MapPin, Settings, LogOut } from "lucide-react";
export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container grid gap-6 py-8 md:grid-cols-[240px_1fr]">
      <aside className="h-fit rounded-lg border bg-white p-4">
        <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">My account</p>
        <nav className="space-y-1 text-sm">
          {[
            ["/account", "Profile", User],
            ["/account/orders", "Orders", ShoppingBag],
            ["/account/addresses", "Addresses", MapPin],
            ["/account/profile", "Settings", Settings],
          ].map(([href, label, Icon]: any) => (
            <Link key={href} href={href} className="flex items-center gap-2 rounded px-3 py-2 hover:bg-muted">
              <Icon className="h-4 w-4" />{label}
            </Link>
          ))}
          <Link href="/login" className="flex items-center gap-2 rounded px-3 py-2 text-red-600 hover:bg-red-50"><LogOut className="h-4 w-4" />Sign out</Link>
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}
