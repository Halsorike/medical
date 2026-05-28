import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Hearing evaluation, speech therapy, occupational therapy, hearing aid fitting and rehabilitation â€” Jordan Hearing & Speech Therapy.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Hearing & Speech Therapy Services in Jordan",
    description: "Comprehensive audiology and speech therapy services in Amman, Jordan.",
    images: ["/og-image.jpg"],
  },
};

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
