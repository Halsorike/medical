"use client";

import { Link } from "@/navigation";
import { useState } from "react";
import { usePathname } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Clock, Ear, Heart, Mail, Menu, Phone, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "./cart-context";

export function StoreHeader() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const { count } = useCart();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const otherLocale = locale === "ar" ? "en" : "ar";
  const otherLocaleLabel = locale === "ar" ? "EN" : "\u0639\u0631\u0628\u064a";

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/services", label: t("services") },
    { href: "/team", label: t("team") },
    { href: "/blog", label: t("blog") },
    { href: "/contact", label: t("contact") },
    { href: "/evaluation", label: t("evaluation") },
    { href: "/shop", label: t("shop") },
  ];

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0_8px_30px_rgba(6,28,61,0.08)]">
      <div className="container flex h-[92px] items-center justify-between gap-4 lg:h-[148px]">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient text-white shadow-[0_12px_24px_rgba(155,31,225,0.22)] lg:h-[82px] lg:w-[82px]">
            <Ear className="h-8 w-8 lg:h-11 lg:w-11" />
          </div>
          <div className="hidden max-w-[120px] leading-tight sm:block lg:max-w-[198px]">
            <p className="gradient-text text-sm font-semibold lg:text-[22px]">Jordan Hearing</p>
            <p className="text-xs font-light text-[#1e1e1e] lg:text-[15px]">&amp; Speech Therapy</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                isActive(link.href)
                  ? "gradient-text text-[15.8px] font-semibold"
                  : "text-[15.8px] font-normal text-[#1e1e1e] transition-colors hover:text-[#9b1fe1]"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            aria-label={t("cart")}
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-[#1e1e1e] transition-colors hover:text-[#9b1fe1]"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-button-gradient text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <Link
            href="/wishlist"
            aria-label={t("wishlist")}
            className="hidden h-11 w-11 items-center justify-center rounded-full text-[#1e1e1e] transition-colors hover:text-[#9b1fe1] sm:flex"
          >
            <Heart className="h-5 w-5" />
          </Link>
          <Link
            href={pathname}
            locale={otherLocale}
            className="hidden h-9 items-center rounded-full border border-[#9b1fe1]/30 px-3 text-[13px] font-medium text-[#9b1fe1] transition hover:bg-[#9b1fe1]/10 sm:flex"
          >
            {otherLocaleLabel}
          </Link>
          <Button asChild variant="gradient" className="hidden h-12 gap-2 px-7 py-3 sm:inline-flex">
            <Link href="/book-appointment">
              {t("bookAppointment")}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t bg-white px-4 pb-5 lg:hidden">
          <nav className="mx-auto flex max-w-md flex-col gap-3 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive(link.href)
                    ? "gradient-text text-sm font-semibold"
                    : "text-sm font-medium text-[#1e1e1e] hover:text-[#9b1fe1]"
                }
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={pathname}
              locale={otherLocale}
              className="flex h-9 w-fit items-center rounded-full border border-[#9b1fe1]/30 px-3 text-[13px] font-medium text-[#9b1fe1] transition hover:bg-[#9b1fe1]/10"
              onClick={() => setMobileOpen(false)}
            >
              {otherLocaleLabel}
            </Link>
            <Button asChild variant="gradient" className="mt-2 w-full gap-2">
              <Link href="/book-appointment" onClick={() => setMobileOpen(false)}>
                {t("bookAppointment")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <div className="mt-4 flex flex-col gap-2 rounded-[20px] bg-[rgba(255,53,245,0.04)] p-4 text-xs text-[#42526b]">
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#ca79c6]" /> +962 6 123 4567
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#ca79c6]" /> info@jordanhearing.com
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-[#ca79c6]" /> Sun-Thu 8AM-6PM
              </p>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
