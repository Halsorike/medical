import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Shop â€” Hearing Aids & Accessories",
  description: "Browse hearing aids, accessories, and therapeutic devices at Echo Wellness Center.",
  alternates: { canonical: "/shop" },
};

export default function ShopLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
