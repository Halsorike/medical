"use client";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_OF_WEEK_AR = ["أح", "إث", "ثل", "أر", "خم", "جم", "سب"];

const MORNING_SLOTS = ["10:30 AM", "11:00 AM", "11:30 AM"];
const AFTERNOON_SLOTS = ["02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM"];

const DEPARTMENTS = ["Audiology", "Speech Therapy", "Occupational Therapy", "Hearing Aid Fitting"];
const SERVICES = ["Hearing Evaluation", "Speech Assessment", "Cochlear Implant Follow-up", "Tinnitus Management", "Balance Assessment"];
const DEPARTMENTS_AR = ["قسم السمعيات", "علاج النطق", "العلاج الوظيفي", "تركيب أجهزة السمع"];
const SERVICES_AR = ["تقييم السمع", "تقييم النطق", "متابعة زراعة القوقعة", "علاج الطنين", "تقييم التوازن"];

type ConfirmationSummary = {
  date: string;
  slot: string;
  department: string;
  service: string;
  confirmation: "email" | "sms" | "whatsapp";
};

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(date);
}

function displayDate(date: Date) {
  return new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(date);
}

export default function BookAppointmentPage() {
  const locale = useLocale();
  const t = useTranslations("bookAppointment");
  const departmentsDisplay = locale === "ar" ? DEPARTMENTS_AR : DEPARTMENTS;
  const servicesDisplay = locale === "ar" ? SERVICES_AR : SERVICES;
  const daysDisplay = locale === "ar" ? DAYS_OF_WEEK_AR : DAYS_OF_WEEK;
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState("03:30 PM");
  const [confirmation, setConfirmation] = useState<"email" | "sms" | "whatsapp">("email");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<ConfirmationSummary | null>(null);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", emergencyPhone: "",
    department: "", service: "", specialRequests: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const service = params.get("service");
    const doctor = params.get("doctor");
    const serviceIndex = service ? SERVICES.indexOf(service) : -1;
    const serviceValue = serviceIndex >= 0 ? servicesDisplay[serviceIndex] : service;

    setForm((current) => ({
      ...current,
      service: serviceValue && servicesDisplay.includes(serviceValue) ? serviceValue : current.service,
      specialRequests: doctor ? `Preferred doctor: ${doctor}` : current.specialRequests,
    }));
  }, [servicesDisplay]);

  const monthDays = useMemo(() => {
    const first = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const totalDays = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
    const days: Array<Date | null> = Array.from({ length: first.getDay() }, () => null);

    for (let day = 1; day <= totalDays; day += 1) {
      days.push(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day));
    }

    return days;
  }, [visibleMonth]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate) {
      toast.error("Please choose an appointment date.");
      return;
    }

    setSubmitting(true);
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientName: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        department: form.department,
        service: form.service,
        date: dateKey(selectedDate),
        slot: selectedSlot,
        confirmation,
        status: "pending",
      }),
    });
    setSubmitting(false);

    if (!response.ok) {
      toast.error("Appointment booking failed. Please try again.");
      return;
    }

    toast.success("Appointment booked successfully! We'll confirm via " + confirmation + ".");
    setConfirmed({
      date: displayDate(selectedDate),
      slot: selectedSlot,
      department: form.department,
      service: form.service,
      confirmation,
    });
  }

  function resetBooking() {
    setConfirmed(null);
    setSelectedDate(null);
    setSelectedSlot("03:30 PM");
    setConfirmation("email");
    setForm({ firstName: "", lastName: "", email: "", phone: "", emergencyPhone: "", department: "", service: "", specialRequests: "" });
  }

  return (
    <>
      <h1 className="sr-only">Book an Appointment</h1>
      {/* Hero */}
      <div className="relative overflow-hidden bg-purple-50 pb-8 pt-6">
        <div className="container">
          <h1 className="text-2xl font-bold text-purple-600">{t("heading")}</h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg viewBox="0 0 1440 30" className="w-full fill-white">
            <path d="M0,15 C360,30 1080,0 1440,15 L1440,30 L0,30 Z" />
          </svg>
        </div>
      </div>

      <div className="container py-10">
        {confirmed ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-green-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-700">
              ?
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{t("confirmed")}</h2>
            <div className="mt-6 space-y-3 rounded-xl bg-purple-50 p-5 text-left text-sm">
              <p><span className="font-semibold text-gray-800">Date:</span> {confirmed.date}</p>
              <p><span className="font-semibold text-gray-800">Time:</span> {confirmed.slot}</p>
              <p><span className="font-semibold text-gray-800">Department:</span> {confirmed.department}</p>
              <p><span className="font-semibold text-gray-800">Service:</span> {confirmed.service}</p>
              <p><span className="font-semibold text-gray-800">Confirmation will be sent via:</span> {confirmed.confirmation === "whatsapp" ? "WhatsApp" : confirmed.confirmation.toUpperCase()}</p>
            </div>
            <Button variant="gradient" className="mt-6 rounded-full px-8" onClick={resetBooking}>
              Book Another Appointment
            </Button>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
          {/* Name row */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                First Name<span className="text-red-500">*</span>
              </label>
              <Input
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="rounded-lg"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Last Name<span className="text-red-500">*</span>
              </label>
              <Input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="rounded-lg"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Email<span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-lg"
              required
            />
          </div>

          {/* Phone row */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Phone<span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <span className="flex h-10 w-12 items-center justify-center rounded-lg border border-input bg-muted text-sm">JO</span>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="flex-1 rounded-lg"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Emergency Contact (Optional)
              </label>
              <div className="flex gap-2">
                <span className="flex h-10 w-12 items-center justify-center rounded-lg border border-input bg-muted text-sm">JO</span>
                <Input
                  type="tel"
                  value={form.emergencyPhone}
                  onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })}
                  className="flex-1 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Date + Time */}
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Calendar picker */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Appointment Date<span className="text-red-500">*</span>
              </label>
              <div className="rounded-xl border border-purple-100 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <button
                    type="button"
                    className="text-gray-500 hover:text-purple-600"
                    onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-medium text-gray-700">{monthLabel(visibleMonth)}</span>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-purple-600"
                    onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
                    aria-label="Next month"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {daysDisplay.map((day) => (
                    <p key={day} className="text-center text-xs text-muted-foreground">{day}</p>
                  ))}
                  {monthDays.map((day, index) => {
                    const isPast = day ? startOfDay(day) < startOfDay(new Date()) : false;
                    const isSelected = day && selectedDate ? dateKey(day) === dateKey(selectedDate) : false;

                    return (
                      <div key={day ? dateKey(day) : `blank-${index}`} className="flex justify-center">
                        {day ? (
                      <button
                        type="button"
                            onClick={() => {
                              if (!isPast) {
                                setSelectedDate(day);
                              }
                            }}
                            disabled={isPast}
                        className={`h-8 w-8 rounded-full text-xs font-medium transition-colors ${
                              isSelected
                            ? "bg-brand-gradient text-white"
                                : isPast
                                  ? "cursor-not-allowed text-gray-300"
                                  : "text-gray-700 hover:bg-purple-50"
                        }`}
                      >
                            {day.getDate()}
                      </button>
                        ) : (
                          <span className="h-8 w-8" />
                        )}
                    </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Time slots */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Appointment Time<span className="text-red-500">*</span>
              </label>
              <div className="rounded-xl border border-purple-100 bg-white p-4 space-y-3">
                <div>
                  <p className="mb-2 text-xs text-muted-foreground">{t("morning")}</p>
                  <div className="flex flex-wrap gap-2">
                    {MORNING_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                          selectedSlot === slot
                            ? "bg-brand-gradient text-white"
                            : "border border-gray-200 text-gray-600 hover:border-purple-300"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs text-muted-foreground">{t("afternoon")}</p>
                  <div className="flex flex-wrap gap-2">
                    {AFTERNOON_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                          selectedSlot === slot
                            ? "bg-brand-gradient text-white"
                            : "border border-gray-200 text-gray-600 hover:border-purple-300"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Department + Service */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Department<span className="text-red-500">*</span>
              </label>
              <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v })} required>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder={t("selectDepartment")} />
                </SelectTrigger>
                <SelectContent>
                  {departmentsDisplay.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Service<span className="text-red-500">*</span>
              </label>
              <Select value={form.service} onValueChange={(v) => setForm({ ...form, service: v })} required>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder={t("selectService")} />
                </SelectTrigger>
                <SelectContent>
                  {servicesDisplay.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Special requests */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Special Requests<span className="text-red-500">*</span>
            </label>
            <Textarea
              rows={4}
              placeholder="Special Requests Or Additional Information You Feel Is Important For The Appointment, Such As Specific Concerns, Previous Medical History, Or Preferences..."
              value={form.specialRequests}
              onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
              className="rounded-lg"
            />
          </div>

          {/* Confirmation method */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Appointment Confirmation<span className="text-red-500">*</span>
            </label>
            <div className="flex gap-5">
              {(["email", "sms", "whatsapp"] as const).map((method) => (
                <label key={method} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="confirmation"
                    checked={confirmation === method}
                    onChange={() => setConfirmation(method)}
                    className="accent-purple-600"
                  />
                  {method === "email" ? "Email" : method === "sms" ? "SMS" : "Whats App"}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <Button type="submit" variant="gradient" className="rounded-full px-12 py-3 text-base font-semibold" disabled={submitting}>
              {submitting ? "Booking..." : t("confirm")}
            </Button>
          </div>
        </form>
        )}
      </div>
    </>
  );
}
