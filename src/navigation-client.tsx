"use client";

import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import { useLocale } from "next-intl";
import {
  usePathname as useNextPathname,
  useRouter as useNextRouter,
} from "next/navigation";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { defaultLocale, locales, type Locale } from "@/i18n";

type RouterOptions = { scroll?: boolean };

type LocaleLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps> &
  Omit<NextLinkProps, "href"> & {
    href: string;
    locale?: Locale;
    children: ReactNode;
  };

function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

function splitPath(pathname: string) {
  const segments = pathname.split("/");
  const first = segments[1] ?? "";
  const locale = isLocale(first) ? first : undefined;
  const path = locale ? `/${segments.slice(2).join("/")}` : pathname;

  return {
    locale,
    path: path === "/" || path === "" ? "/" : path.replace(/\/$/, ""),
  };
}

function localizeHref(href: string, locale: Locale) {
  if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#")) {
    return href;
  }

  const [path = "/", suffix = ""] = href.split(/(?=[?#])/);
  const { path: unprefixedPath } = splitPath(path);
  const normalizedPath = unprefixedPath === "/" ? "" : unprefixedPath;

  return `/${locale}${normalizedPath}${suffix}`;
}

export function Link({ href, locale, children, ...props }: LocaleLinkProps) {
  const currentLocale = useLocale();
  const selectedLocale = locale ?? (isLocale(currentLocale) ? currentLocale : defaultLocale);

  return (
    <NextLink href={localizeHref(href, selectedLocale)} {...props}>
      {children}
    </NextLink>
  );
}

export function usePathname() {
  const pathname = useNextPathname();
  return splitPath(pathname).path;
}

export function useRouter() {
  const router = useNextRouter();
  const currentLocale = useLocale();
  const locale = isLocale(currentLocale) ? currentLocale : defaultLocale;

  return {
    ...router,
    push: (href: string, options?: RouterOptions) => router.push(localizeHref(href, locale), options),
    replace: (href: string, options?: RouterOptions) => router.replace(localizeHref(href, locale), options),
    prefetch: (href: string) => router.prefetch(localizeHref(href, locale)),
  };
}
