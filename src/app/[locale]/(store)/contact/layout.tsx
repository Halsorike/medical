import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Jordan Hearing & Speech Therapy in Amman, Jordan. Call +962 6 123 4567 or send us a message.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Jordan Hearing & Speech Therapy",
    description: "Reach our clinic in Amman for hearing and speech therapy inquiries.",
    images: ["/og-image.jpg"],
  },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
