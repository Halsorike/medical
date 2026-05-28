"use client";

import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StoreFooter() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const quickLinks = [
    { href: "/shop", label: nav("shop") },
    { href: "/about", label: nav("about") },
    { href: "/services", label: nav("services") },
    { href: "/team", label: nav("team") },
    { href: "/blog", label: nav("blog") },
    { href: "/contact", label: nav("contact") },
    { href: "/evaluation", label: nav("evaluation") },
  ];

  return (
    <footer className="bg-white">
      <div className="bg-figma-footer-gradient text-white lg:min-h-[680px]">
        <div className="overflow-hidden">
          <svg viewBox="0 0 1440 80" className="-mb-1 block w-full fill-white">
            <path d="M0,0 C360,80 1080,80 1440,0 L1440,0 L0,0 Z" />
          </svg>
        </div>

        <div className="container grid gap-12 py-16 lg:grid-cols-[1.2fr_0.9fr_0.75fr_1fr] lg:py-24">
          <div>
            <h3 className="text-[20px] font-semibold uppercase text-white">{t("contact")}</h3>
            <div className="mt-8 flex flex-col gap-5 text-[18px] font-medium text-white/90">
              <p className="flex items-center gap-3">
                <Mail className="h-6 w-6" /> info@echowellness.me
              </p>
              <p className="flex items-center gap-3">
                <Phone className="h-6 w-6" /> +968 XXXX XXXX
              </p>
              <p className="flex items-start gap-3 leading-7">
                <MapPin className="mt-1 h-6 w-6 shrink-0" /> Sarooj, Muscat, Sultanate of Oman
              </p>
            </div>
            <div className="mt-8 flex gap-4">
              <a href="https://www.facebook.com/echowellness.me" aria-label="Facebook" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/echowellness.om/" aria-label="Instagram" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://x.com/echowellness" aria-label="Twitter" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-[20px] font-semibold uppercase text-white">{t("quickLinks")}</h3>
            <nav className="mt-8 flex flex-col gap-3">
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-[15px] font-medium text-white/80 transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </nav>
            <Button asChild className="mt-8 rounded-[10px] bg-white px-8 py-3 text-brand-blue shadow-[0_4px_12px_rgba(255,255,255,0.22)] hover:bg-white/90">
              <Link href="/shop">Shop Now</Link>
            </Button>
          </div>

          <div className="flex flex-col gap-4 pt-16 lg:pt-[86px]">
            <Link href="/privacy" className="text-[18px] font-bold text-white hover:text-white/80">
              {t("privacy")}
            </Link>
            <Link href="/terms" className="text-[18px] font-bold text-white hover:text-white/80">
              {t("terms")}
            </Link>
          </div>

          <div className="flex items-start justify-center lg:justify-end">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white text-white shadow-[0_18px_48px_rgba(6,28,61,0.12)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.svg" alt="Echo Wellness logo" className="h-24 w-24" />
              </div>
              <p className="max-w-[220px] text-[22px] font-bold uppercase leading-tight text-white">
                Echo Wellness
              </p>
            </div>
          </div>
        </div>

        <div className="container pb-8">
            <div className="flex items-center gap-5 text-center text-sm font-medium text-white/90">
            <div className="h-px flex-1 bg-white/60" />
            <p>{t("rights")}</p>
            <div className="h-px flex-1 bg-white/60" />
          </div>
        </div>
      </div>
    </footer>
  );
}
