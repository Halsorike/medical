import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact Us | Echo Wellness Center Muscat Oman",
  description:
    "Contact Echo Wellness Center in Sarooj, Muscat, Oman for audiology, speech therapy, occupational therapy, psychology, and behavioral support.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Echo Wellness Center",
    description: "Reach our clinic in Muscat for multidisciplinary therapy inquiries.",
    images: ["/og-image.jpg"],
  },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
