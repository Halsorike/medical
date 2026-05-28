"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getAdminLabels, type AdminLabels, type AdminLocale } from "@/lib/admin-labels";

type AdminLocaleContextValue = {
  locale: AdminLocale;
  labels: AdminLabels;
  dir: "rtl" | "ltr";
  setLocale: (locale: AdminLocale) => void;
  toggleLocale: () => void;
};

const AdminLocaleContext = createContext<AdminLocaleContextValue | null>(null);
const storageKey = "admin-locale";

function readStoredLocale(): AdminLocale {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "ar" || stored === "en") return stored;
  } catch {
    // localStorage may be unavailable in embedded contexts.
  }

  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${storageKey}=`))
    ?.split("=")[1];

  return cookie === "en" ? "en" : "ar";
}

function writeStoredLocale(locale: AdminLocale) {
  try {
    window.localStorage.setItem(storageKey, locale);
  } catch {
    // Keep the UI usable when localStorage is unavailable.
  }

  document.cookie = `${storageKey}=${locale}; path=/; SameSite=Lax`;
}

export function AdminLocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AdminLocale>("ar");

  useEffect(() => {
    setLocaleState(readStoredLocale());
  }, []);

  useEffect(() => {
    const dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale]);

  const value = useMemo<AdminLocaleContextValue>(() => {
    const dir = locale === "ar" ? "rtl" : "ltr";

    function setLocale(nextLocale: AdminLocale) {
      writeStoredLocale(nextLocale);
      setLocaleState(nextLocale);
    }

    return {
      locale,
      labels: getAdminLabels(locale),
      dir,
      setLocale,
      toggleLocale: () => setLocale(locale === "ar" ? "en" : "ar"),
    };
  }, [locale]);

  return <AdminLocaleContext.Provider value={value}>{children}</AdminLocaleContext.Provider>;
}

export function useAdminLocale() {
  const context = useContext(AdminLocaleContext);

  if (!context) {
    throw new Error("useAdminLocale must be used inside AdminLocaleProvider");
  }

  return context;
}
