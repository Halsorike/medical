import { getRequestConfig } from "next-intl/server";

export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  const selectedLocale = locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;

  return {
    locale: selectedLocale,
    messages: (await import(`../messages/${selectedLocale}.json`)).default,
  };
});
