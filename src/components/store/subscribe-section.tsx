"use client";

import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SubscribeSection() {
  const t = useTranslations("subscribe");

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container">
        <div className="relative mx-auto max-w-[1170px] overflow-hidden rounded-[20px] bg-brand-50 px-5 py-12 text-center md:py-[60px]">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-[44px] border border-brand-teal/10 bg-white/40 rotate-12" />
          <h2 className="gradient-text text-[28px] font-semibold md:text-[30px]">{t("heading")}</h2>
          <p className="mt-4 text-[18px] font-light tracking-[0.04em] text-[#2d2d2d] md:text-[20px]">
            {t("subtext")}
          </p>
          <form className="mx-auto mt-9 flex min-h-[60px] w-full max-w-[560px] flex-col gap-3 rounded-[20px] bg-white p-2 shadow-sm sm:flex-row">
            <Input
              type="email"
              placeholder={t("placeholder")}
              className="h-12 flex-1 rounded-[16px] border-0 px-5 text-[15px] shadow-none focus-visible:ring-brand-teal sm:h-[44px]"
            />
            <Button type="submit" className="h-12 rounded-full bg-brand-gold px-8 text-white hover:bg-brand-gold/90 sm:h-[44px]">
              {t("cta")}
              <Send className="ml-2 h-4 w-4 rtl:ml-0 rtl:mr-2" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
