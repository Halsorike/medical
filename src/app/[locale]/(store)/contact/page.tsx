"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const DEFAULT_CONTACT = {
  name: "Echo Wellness Center",
  address: "Sarooj, Muscat, Sultanate of Oman",
  addressAr: "الساروج، مسقط، سلطنة عمان",
  phone: "+968 XXXX XXXX",
  emergency: "+968 XXXX XXXX",
  email: "info@echowellness.me",
};

type WebsiteSettings = Record<string, string | undefined>;

export default function Contact() {
  const locale = useLocale();
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = useState(false);
  const [agree, setAgree] = useState(false);
  const [contact, setContact] = useState(DEFAULT_CONTACT);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });

  useEffect(() => {
    let mounted = true;
    fetch("/api/website-settings")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data?: WebsiteSettings }) => {
        if (!mounted) return;
        const settings = payload.data ?? {};
        const localizedAddress =
          locale === "ar"
            ? settings["clinic.address.ar"] ?? settings["clinic.address"] ?? DEFAULT_CONTACT.addressAr
            : settings["clinic.address.en"] ?? settings["clinic.address"] ?? DEFAULT_CONTACT.address;

        setContact({
          name: settings["clinic.name.en"] ?? settings["clinic.name"] ?? DEFAULT_CONTACT.name,
          address: localizedAddress,
          addressAr: settings["clinic.address.ar"] ?? DEFAULT_CONTACT.addressAr,
          phone: settings["clinic.phone"] ?? DEFAULT_CONTACT.phone,
          emergency: settings["clinic.emergency"] ?? settings["clinic.phone"] ?? DEFAULT_CONTACT.emergency,
          email: settings["clinic.email"] ?? DEFAULT_CONTACT.email,
        });
      })
      .catch(() => {
        if (mounted) setContact(DEFAULT_CONTACT);
      });

    return () => {
      mounted = false;
    };
  }, [locale]);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, consent: agree }),
    });
    if (response.ok) setSubmitted(true);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalClinic",
            name: contact.name,
            email: contact.email,
            telephone: contact.phone,
            address: {
              "@type": "PostalAddress",
              streetAddress: "Sarooj",
              addressLocality: "Muscat",
              addressRegion: "Muscat Governorate",
              postalCode: "100",
              addressCountry: "OM",
            },
            geo: { "@type": "GeoCoordinates", latitude: 23.588, longitude: 58.3829 },
            openingHours: ["Su-Fr 09:00-22:00"],
          }),
        }}
      />

      <section className="container py-16 md:py-20">
        <h1 className="gradient-text text-center text-[38px] font-semibold">{t("heading")}</h1>

        <div className="relative mx-auto mt-12 grid max-w-6xl gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="figma-card h-fit border border-brand-teal/10 bg-brand-50 p-6 lg:sticky lg:top-28">
            <p className="mb-5 text-[18px] font-semibold text-[#061c3d]">{t("infoTitle")}</p>
            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-teal" />
                <span className="text-[#42526b]">{contact.address}</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-teal" />
                <div>
                  <p className="font-medium text-[#061c3d]">{t("emailPhone")}</p>
                  <p className="mt-1 text-[#42526b]">{contact.email}</p>
                  <p className="text-[#42526b]">{contact.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-teal" />
                <div>
                  <p className="font-medium text-[#061c3d]">{contact.phone}</p>
                  <p className="mt-1 text-[#42526b]">{t("emergency")}: {contact.emergency}</p>
                </div>
              </div>
            </div>
          </aside>

          <div className="figma-card p-6 md:p-10">
            {submitted ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-16 w-16 text-brand-teal" />
                <h2 className="mt-4 text-2xl font-semibold text-[#061c3d]">{t("successTitle")}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{t("successMsg")}</p>
                <Button className="mt-6 rounded-full bg-brand-gold px-8 text-white hover:bg-brand-gold/90" onClick={() => setSubmitted(false)}>
                  {t("sendAnother")}
                </Button>
              </div>
            ) : (
              <form onSubmit={sendMessage} className="space-y-7">
                <div className="grid gap-7 sm:grid-cols-2">
                  <Input required placeholder={`${t("firstName")} *`} value={form.firstName} onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))} className="h-12 rounded-none border-0 border-b px-0 shadow-none focus-visible:ring-0" />
                  <Input required placeholder={`${t("lastName")} *`} value={form.lastName} onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))} className="h-12 rounded-none border-0 border-b px-0 shadow-none focus-visible:ring-0" />
                  <Input required type="email" placeholder={`${t("email")} *`} value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="h-12 rounded-none border-0 border-b px-0 shadow-none focus-visible:ring-0" />
                  <div className="flex items-center gap-3 border-b">
                    <span className="text-xl">🇴🇲</span>
                    <input required type="tel" placeholder={`${t("phone")} *`} value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="h-12 flex-1 border-0 bg-transparent outline-none focus:ring-0" />
                  </div>
                </div>

                <Textarea required rows={6} placeholder={`${t("message")} *`} value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} className="rounded-[18px] border-brand-100 focus-visible:ring-brand-teal" />

                <label className="flex cursor-pointer items-start gap-3 text-sm text-[#42526b]">
                  <input type="checkbox" checked={agree} onChange={(event) => setAgree(event.target.checked)} className="mt-1 accent-brand-teal" required />
                  {t("consent")}
                </label>

                <div className="flex justify-end">
                  <Button type="submit" className="rounded-full bg-brand-gold px-10 text-white hover:bg-brand-gold/90">
                    {t("send")}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          <h2 className="mb-6 text-xl font-bold text-[#061c3d]">{t("clinicLocation")}</h2>
          <div className="relative overflow-hidden rounded-[22px] border border-brand-100">
            <iframe
              title="Echo Wellness Center location in Muscat"
              src="https://www.google.com/maps?q=23.5880,58.3829&z=15&output=embed"
              className="h-[360px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="absolute right-5 top-5 rounded-2xl bg-white p-5 shadow-lg">
              <p className="mb-1 text-xs uppercase tracking-wide text-brand-teal">TIME</p>
              <p className="font-bold text-gray-800">{t("workingHours")}</p>
              <p className="mt-2 text-xs text-gray-600">Sunday To Friday 9:00 am - 10:00 pm</p>
              <p className="text-xs text-gray-600">Saturday Closed</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
