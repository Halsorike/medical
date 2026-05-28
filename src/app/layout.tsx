import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Noto_Sans_Arabic, Poppins } from "next/font/google";
import { defaultLocale } from "@/i18n";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jordanhearing.com"),
  title: {
    default: "Jordan Hearing & Speech Therapy",
    template: "%s | Jordan Hearing & Speech Therapy",
  },
  description: "Professional hearing and speech therapy clinic in Jordan.",
  openGraph: {
    title: "Jordan Hearing & Speech Therapy",
    description: "Professional hearing and speech therapy clinic in Jordan.",
    url: "https://jordanhearing.com",
    siteName: "Jordan Hearing & Speech Therapy",
    type: "website",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://jordanhearing.com",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: "Jordan Hearing & Speech Therapy",
    url: "https://jordanhearing.com",
    telephone: "+962-6-123-4567",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Mecca Street",
      addressLocality: "Amman",
      addressCountry: "JO",
    },
    medicalSpecialty: ["Audiology", "SpeechTherapy", "OccupationalTherapy"],
  };

  return (
    <html lang={defaultLocale} dir="rtl" className={`${poppins.variable} ${notoArabic.variable}`} suppressHydrationWarning>
      <body className="min-h-full antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
