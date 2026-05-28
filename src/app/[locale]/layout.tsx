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
    metadataBase: new URL("https://jordanhearing.com"),
    title: {
      default: isAr
        ? "المركز الأردني للسمع والنطق والعلاج الوظيفي"
        : "Jordan Hearing & Speech Therapy",
      template: isAr
        ? "%s | المركز الأردني للسمع"
        : "%s | Jordan Hearing & Speech Therapy",
    },
    description: isAr
      ? "مركز متخصص في السمع والنطق والعلاج الوظيفي في الأردن."
      : "Professional hearing and speech therapy clinic in Jordan.",
    alternates: {
      canonical: `https://jordanhearing.com/${locale}`,
      languages: {
        ar: "https://jordanhearing.com/ar",
        en: "https://jordanhearing.com/en",
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
