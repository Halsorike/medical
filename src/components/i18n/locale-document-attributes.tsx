"use client";

import { useEffect } from "react";
import type { Locale } from "@/i18n";

export function LocaleDocumentAttributes({ locale }: { locale: Locale }) {
  useEffect(() => {
    const isRtl = locale === "ar";
    document.documentElement.lang = locale;
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
  }, [locale]);

  return null;
}
