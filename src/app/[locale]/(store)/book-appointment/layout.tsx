import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description: "Schedule a hearing or speech therapy appointment at Echo Wellness Center in Muscat.",
  alternates: { canonical: "/book-appointment" },
};

export default function BookLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
