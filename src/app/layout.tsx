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
  metadataBase: new URL("https://echowellness.me"),
  title: {
    default: "Echo Wellness Center | مركز إيكو للعافية",
    template: "%s | Echo Wellness Center",
  },
  description:
    "Echo Wellness Center in Muscat, Oman - Audiology, Speech Therapy, Occupational Therapy, Psychology and Behavioral Support for children and adults.",
  openGraph: {
    title: "Echo Wellness Center | مركز إيكو للعافية",
    description:
      "Audiology, speech therapy, occupational therapy, psychology, and behavioral support in Muscat, Oman.",
    url: "https://echowellness.me",
    siteName: "Echo Wellness Center",
    locale: "ar_OM",
    type: "website",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://echowellness.me",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": "https://echowellness.me/#clinic",
    name: "Echo Wellness Center",
    alternateName: "مركز إيكو للعافية",
    url: "https://echowellness.me",
    logo: "https://echowellness.me/logo.png",
    image: "https://echowellness.me/og-image.jpg",
    description:
      "Multidisciplinary rehabilitation clinic offering Audiology, Speech Therapy, Occupational Therapy, Psychology, and Behavioral Support in Muscat, Oman.",
    telephone: "+968-XXXX-XXXX",
    email: "info@echowellness.me",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sarooj",
      addressLocality: "Muscat",
      addressRegion: "Muscat Governorate",
      postalCode: "100",
      addressCountry: "OM",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 23.588,
      longitude: 58.3829,
    },
    medicalSpecialty: ["Audiology", "SpeechTherapy", "OccupationalTherapy", "Psychology", "BehavioralTherapy"],
    availableService: [
      { "@type": "MedicalTherapy", name: "Hearing Assessment and Treatment", alternateName: "تقييم وعلاج السمع" },
      { "@type": "MedicalTherapy", name: "Speech and Language Therapy", alternateName: "علاج النطق واللغة" },
      { "@type": "MedicalTherapy", name: "Occupational Therapy", alternateName: "العلاج الوظيفي" },
      { "@type": "MedicalTherapy", name: "Psychological Assessment and Support", alternateName: "التقييم والدعم النفسي" },
      { "@type": "MedicalTherapy", name: "Behavioral Support and ABA", alternateName: "الدعم السلوكي وتحليل السلوك التطبيقي" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "14:00",
      },
    ],
    sameAs: ["https://www.instagram.com/echowellness.om/"],
    priceRange: "$$",
    currenciesAccepted: "OMR",
    paymentAccepted: "Cash, Credit Card",
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
