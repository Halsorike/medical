"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DEFAULT_CONTACT = {
  name: "Echo Wellness Center",
  address: "Sarooj, Muscat, Sultanate of Oman",
  addressAr: "الساروج، مسقط، سلطنة عمان",
  phone: "+968 XXXX XXXX",
  emergency: "+968 XXXX XXXX",
  email: "info@echowellness.me",
};

const SUBJECTS_EN = ["General Inquiry", "Book Appointment", "Service Inquiry", "Complaint", "Partnership", "Other"];
const SUBJECTS_AR = ["استفسار عام", "حجز موعد", "استفسار عن خدمة", "شكوى", "شراكة", "أخرى"];

type WebsiteSettings = Record<string, string | undefined>;

export default function Contact() {
  const locale = useLocale();
  const t = useTranslations("contact");
  const subjects = locale === "ar" ? SUBJECTS_AR : SUBJECTS_EN;
  const [submitted, setSubmitted] = useState(false);
  const [agree, setAgree] = useState(false);
  const [contact, setContact] = useState(DEFAULT_CONTACT);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: subjects[0] ?? "General Inquiry",
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

    if (response.ok) {
      setSubmitted(true);
    }
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
            alternateName: "Echo Wellness",
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
            openingHours: ["Su-Th 08:00-18:00", "Sa 09:00-14:00"],
          }),
        }}
      />

      <div className="relative overflow-hidden bg-brand-50 pb-10 pt-8">
        <div className="container text-center">
          <h1 className="gradient-text text-[38px] font-semibold">{t("heading")}</h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg viewBox="0 0 1440 30" className="w-full fill-white">
            <path d="M0,15 C360,30 1080,0 1440,15 L1440,30 L0,30 Z" />
          </svg>
        </div>
      </div>

      <div className="container py-12">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[auto_1fr]">
          <aside className="w-56 shrink-0 space-y-4">
            <div className="rounded-2xl bg-brand-50 p-5">
              <p className="mb-4 text-sm font-semibold text-gray-700">{t("infoTitle")}</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />
                  <span className="text-gray-600">{contact.address}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />
                  <div>
                    <p className="text-gray-600">{t("emailPhone")}</p>
                    <p className="text-xs text-muted-foreground">{contact.email}</p>
                    <p className="text-xs text-muted-foreground">{contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />
                  <div>
                    <p className="text-gray-600">{contact.phone}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("emergency")}: {contact.emergency}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="rounded-2xl border border-brand-100 bg-white p-8 shadow-sm">
            {submitted ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-14 w-14 text-green-500" />
                <h2 className="mt-4 text-xl font-semibold">{t("successTitle")}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{t("successMsg")}</p>
                <Button variant="outline" className="mt-5 rounded-full" onClick={() => setSubmitted(false)}>
                  {t("sendAnother")}
                </Button>
              </div>
            ) : (
              <form onSubmit={sendMessage} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {t("firstName")}<span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={form.firstName}
                      onChange={(e) => setForm((current) => ({ ...current, firstName: e.target.value }))}
                      className="rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {t("lastName")}<span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={form.lastName}
                      onChange={(e) => setForm((current) => ({ ...current, lastName: e.target.value }))}
                      className="rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {t("email")}<span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
                      className="rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {t("phone")}<span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <span className="flex h-10 w-12 items-center justify-center rounded-lg border border-input bg-muted text-sm">OM</span>
                      <Input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm((current) => ({ ...current, phone: e.target.value }))}
                        className="flex-1 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("subject")}<span className="text-red-500">*</span>
                  </label>
                  <Select value={form.subject} onValueChange={(subject) => setForm((current) => ({ ...current, subject }))} required>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder={t("selectSubject")} />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("message")}<span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    rows={5}
                    placeholder={t("messagePlaceholder")}
                    value={form.message}
                    onChange={(e) => setForm((current) => ({ ...current, message: e.target.value }))}
                    className="rounded-lg"
                    required
                  />
                </div>

                <label className="flex cursor-pointer items-start gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-0.5 accent-brand-teal"
                    required
                  />
                  {t("consent")}
                </label>

                <div className="flex justify-end">
                  <Button type="submit" variant="gradient" className="rounded-full px-10">
                    {t("send")}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-5xl">
          <h2 className="mb-6 text-xl font-bold">{t("clinicLocation")}</h2>
          <div className="relative overflow-hidden rounded-2xl border border-brand-100">
            <iframe
              title="Echo Wellness Center location in Muscat"
              src="https://www.google.com/maps?q=23.5880,58.3829&z=15&output=embed"
              className="h-72 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="absolute right-4 top-4 rounded-2xl bg-white p-4 shadow-lg">
              <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">TIME</p>
              <p className="font-bold text-gray-800">{t("workingHours")}</p>
              <p className="mt-1 text-xs text-gray-600">Sun-Thu 8:00 AM - 6:00 PM</p>
              <p className="text-xs text-gray-600">Sat 9:00 AM - 2:00 PM</p>
              <p className="text-xs text-gray-600">Fri Closed</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
