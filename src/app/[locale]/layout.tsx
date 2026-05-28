import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LocaleDocumentAttributes } from "@/components/i18n/locale-document-attributes";
import { type Locale, locales } from "@/i18n";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isAr = locale === "ar";

  return {
    metadataBase: new URL("https://echowellness.me"),
    title: {
      default: isAr ? "مركز إيكو للعافية" : "Echo Wellness Center",
      template: isAr ? "%s | مركز إيكو للعافية" : "%s | Echo Wellness Center",
    },
    description: isAr
      ? "مركز إيكو للعافية في مسقط، عُمان - السمعيات، علاج النطق، العلاج الوظيفي، علم النفس والدعم السلوكي للأطفال والبالغين."
      : "Echo Wellness Center in Muscat, Oman - Audiology, Speech Therapy, Occupational Therapy, Psychology and Behavioral Support.",
    alternates: {
      canonical: `https://echowellness.me/${locale}`,
      languages: {
        ar: "https://echowellness.me/ar",
        en: "https://echowellness.me/en",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const typedLocale = locale as Locale;
  const messages = (await import(`../../../messages/${typedLocale}.json`)).default;

  return (
    <NextIntlClientProvider locale={typedLocale} messages={messages}>
      <LocaleDocumentAttributes locale={typedLocale} />
      {children}
    </NextIntlClientProvider>
  );
}
