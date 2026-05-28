"use client";

import { type FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CONTACT = {
  address: "123 Mecca Street, Amman, Jordan 11180",
  phone: "+962 6 123 4567",
  emergency: "+962 7 9876 5432",
  email: "info@jordanhearing.com",
};

const SUBJECTS_EN = ["General Inquiry", "Book Appointment", "Product Inquiry", "Complaint", "Partnership", "Other"];
const SUBJECTS_AR = ["استفسار عام", "حجز موعد", "استفسار عن منتج", "شكوى", "شراكة", "أخرى"];

export default function Contact() {
  const locale = useLocale();
  const t = useTranslations("contact");
  const subjects = locale === "ar" ? SUBJECTS_AR : SUBJECTS_EN;
  const [submitted, setSubmitted] = useState(false);
  const [agree, setAgree] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", subject: subjects[0] ?? "General Inquiry", message: "",
  });

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
            "@type": "LocalBusiness",
            name: "Jordan Hearing & Speech Therapy",
            email: CONTACT.email,
            telephone: CONTACT.phone,
            address: {
              "@type": "PostalAddress",
              streetAddress: "123 Mecca Street",
              addressLocality: "Amman",
              postalCode: "11180",
              addressCountry: "JO",
            },
            openingHours: ["Su-Th 08:00-18:00", "Fr 09:00-14:00"],
          }),
        }}
      />
      {/* Hero */}
      <div className="relative overflow-hidden bg-purple-50 pb-10 pt-8">
        <div className="container text-center">
          <h1 className="gradient-text text-[38px] font-semibold">
            {t("heading")}
          </h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg viewBox="0 0 1440 30" className="w-full fill-white">
            <path d="M0,15 C360,30 1080,0 1440,15 L1440,30 L0,30 Z" />
          </svg>
        </div>
      </div>

      <div className="container py-12">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[auto_1fr]">
          {/* Left sidebar */}
          <aside className="w-56 shrink-0 space-y-4">
            <div className="rounded-2xl bg-purple-50 p-5">
              <p className="mb-4 text-sm font-semibold text-gray-700">{t("infoTitle")}</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />
                    <span className="text-gray-600">{CONTACT.address}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />
                    <div>
                      <p className="text-gray-600">{t("emailPhone")}</p>
                    <p className="text-xs text-muted-foreground">{CONTACT.email}</p>
                    <p className="text-xs text-muted-foreground">{CONTACT.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />
                  <div>
                    <p className="text-gray-600">{CONTACT.phone}</p>
                    <p className="text-xs text-muted-foreground">{t("emergency")}: {CONTACT.emergency}</p>
                  </div>
                  </div>
              </div>
            </div>
          </aside>

          {/* Form */}
          <div className="rounded-2xl border border-purple-100 bg-white p-8 shadow-sm">
            {submitted ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-14 w-14 text-green-500" />
                <h2 className="mt-4 text-xl font-semibold">{t("successTitle")}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("successMsg")}
                </p>
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
                      <span className="flex h-10 w-12 items-center justify-center rounded-lg border border-input bg-muted text-sm">JO</span>
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
                    className="mt-0.5 accent-purple-600"
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

        {/* Clinic Location + Hours */}
        <div className="mx-auto mt-12 max-w-5xl">
          <h2 className="mb-6 text-xl font-bold">
            {t("clinicLocation")}
          </h2>
          <div className="relative overflow-hidden rounded-2xl border border-purple-100">
            {/* Map placeholder */}
            <iframe
              title="Jordan Hearing & Speech Therapy location in Amman"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3384.0!2d35.9106!3d31.9539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDU3JzE0LjAiTiAzNcKwNTQnMzguMiJF!5e0!3m2!1sen!2sjo!4v1234567890"
              className="h-72 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            {/* Hours overlay card */}
            <div className="absolute right-4 top-4 rounded-2xl bg-white p-4 shadow-lg">
              <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">TIME</p>
              <p className="font-bold text-gray-800">{t("workingHours")}</p>
              <p className="mt-1 text-xs text-gray-600">Sun-Thu 8:00 AM - 6:00 PM</p>
              <p className="text-xs text-gray-600">Fri 9:00 AM - 2:00 PM</p>
              <p className="text-xs text-gray-600">Sat Closed</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
