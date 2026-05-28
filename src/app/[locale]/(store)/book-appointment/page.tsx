"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type ApiDepartment = { id: string; name: string; nameAr?: string | null };
type ApiService = { id: string; name: string; nameAr?: string | null; departmentId: string };

type ConfirmationSummary = {
  date: string;
  slot: string;
  department: string;
  service: string;
  confirmation: "email" | "sms" | "whatsapp";
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_OF_WEEK_AR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MORNING_SLOTS = ["10:30 AM", "11:00 AM", "11:30 AM"];
const AFTERNOON_SLOTS = ["02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM"];

const FALLBACK_DEPARTMENTS: ApiDepartment[] = [
  { id: "audiology", name: "Audiology", nameAr: "Audiology" },
  { id: "speech", name: "Speech Therapy", nameAr: "Speech Therapy" },
  { id: "ot", name: "Occupational Therapy", nameAr: "Occupational Therapy" },
  { id: "psychology", name: "Psychology", nameAr: "Psychology" },
  { id: "behavior", name: "Behavioral Support", nameAr: "Behavioral Support" },
];

const FALLBACK_SERVICES: ApiService[] = [
  { id: "hearing-evaluation", name: "Hearing Evaluation", nameAr: "Hearing Evaluation", departmentId: "audiology" },
  { id: "speech-assessment", name: "Speech Assessment", nameAr: "Speech Assessment", departmentId: "speech" },
  { id: "ot-assessment", name: "OT Assessment", nameAr: "OT Assessment", departmentId: "ot" },
  { id: "psychology-consultation", name: "Psychology Consultation", nameAr: "Psychology Consultation", departmentId: "psychology" },
  { id: "aba-support", name: "Behavioral Support Session", nameAr: "Behavioral Support Session", departmentId: "behavior" },
];

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
  const daysDisplay = locale === "ar" ? DAYS_OF_WEEK_AR : DAYS_OF_WEEK;
  const [departments, setDepartments] = useState<ApiDepartment[]>(FALLBACK_DEPARTMENTS);
  const [services, setServices] = useState<ApiService[]>(FALLBACK_SERVICES);
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
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    emergencyPhone: "",
    department: "",
    service: "",
    specialRequests: "",
  });

  const filteredServices = useMemo(() => {
    if (!form.department) return services;
    const filtered = services.filter((service) => service.departmentId === form.department);
    return filtered.length ? filtered : services;
  }, [form.department, services]);

  useEffect(() => {
    Promise.all([
      fetch("/api/departments").then((response) => (response.ok ? response.json() : Promise.reject())),
      fetch("/api/services").then((response) => (response.ok ? response.json() : Promise.reject())),
    ])
      .then(([departmentPayload, servicePayload]: [{ data: ApiDepartment[] }, { data: ApiService[] }]) => {
        if (departmentPayload.data?.length) setDepartments(departmentPayload.data);
        if (servicePayload.data?.length) setServices(servicePayload.data);
      })
      .catch(() => {
        setDepartments(FALLBACK_DEPARTMENTS);
        setServices(FALLBACK_SERVICES);
      });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const serviceName = params.get("service");
    const doctor = params.get("doctor");
    const selectedService = serviceName ? services.find((service) => service.name === serviceName) : null;

    setForm((current) => ({
      ...current,
      service: selectedService?.id ?? current.service,
      specialRequests: doctor ? `Preferred specialist: ${doctor}` : current.specialRequests,
    }));
  }, [services]);

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

    const selectedDepartment = departments.find((department) => department.id === form.department);
    const selectedService = services.find((service) => service.id === form.service);

    setSubmitting(true);
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientName: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        department: selectedDepartment?.name ?? form.department,
        service: selectedService?.name ?? form.service,
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

    toast.success(`Appointment booked successfully. Confirmation will be sent via ${confirmation}.`);
    setConfirmed({
      date: displayDate(selectedDate),
      slot: selectedSlot,
      department: selectedDepartment?.name ?? form.department,
      service: selectedService?.name ?? form.service,
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
      <div className="relative overflow-hidden bg-brand-50 pb-8 pt-6">
        <div className="container">
          <h1 className="text-2xl font-bold text-brand-blue">{t("heading")}</h1>
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
              OK
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{t("confirmed")}</h2>
            <div className="mt-6 space-y-3 rounded-xl bg-brand-50 p-5 text-start text-sm">
              <p><span className="font-semibold text-gray-800">Date:</span> {confirmed.date}</p>
              <p><span className="font-semibold text-gray-800">Time:</span> {confirmed.slot}</p>
              <p><span className="font-semibold text-gray-800">Department:</span> {confirmed.department}</p>
              <p><span className="font-semibold text-gray-800">Service:</span> {confirmed.service}</p>
              <p><span className="font-semibold text-gray-800">Confirmation will be sent via:</span> {confirmed.confirmation === "whatsapp" ? "WhatsApp" : confirmed.confirmation.toUpperCase()}</p>
            </div>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="gradient" className="rounded-full px-8" onClick={resetBooking}>
                Book Another Appointment
              </Button>
              <Button asChild variant="outline" className="rounded-full px-8">
                <Link href="/account/appointments">View my appointments</Link>
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  First Name<span className="text-red-500">*</span>
                </label>
                <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="rounded-lg" required />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Last Name<span className="text-red-500">*</span>
                </label>
                <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="rounded-lg" required />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Email<span className="text-red-500">*</span>
              </label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-lg" required />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Phone<span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <span className="flex h-10 w-12 items-center justify-center rounded-lg border border-input bg-muted text-sm">OM</span>
                  <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="flex-1 rounded-lg" required />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Emergency Contact (Optional)</label>
                <div className="flex gap-2">
                  <span className="flex h-10 w-12 items-center justify-center rounded-lg border border-input bg-muted text-sm">OM</span>
                  <Input type="tel" value={form.emergencyPhone} onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })} className="flex-1 rounded-lg" />
                </div>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Appointment Date<span className="text-red-500">*</span>
                </label>
                <div className="rounded-xl border border-brand-100 bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <button type="button" className="text-gray-500 hover:text-brand-teal" onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))} aria-label="Previous month">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-medium text-gray-700">{monthLabel(visibleMonth)}</span>
                    <button type="button" className="text-gray-500 hover:text-brand-teal" onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))} aria-label="Next month">
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
                                if (!isPast) setSelectedDate(day);
                              }}
                              disabled={isPast}
                              className={`h-8 w-8 rounded-full text-xs font-medium transition-colors ${
                                isSelected
                                  ? "bg-brand-gradient text-white"
                                  : isPast
                                    ? "cursor-not-allowed text-gray-300"
                                    : "text-gray-700 hover:bg-brand-50"
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

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Appointment Time<span className="text-red-500">*</span>
                </label>
                <div className="space-y-3 rounded-xl border border-brand-100 bg-white p-4">
                  <div>
                    <p className="mb-2 text-xs text-muted-foreground">{t("morning")}</p>
                    <div className="flex flex-wrap gap-2">
                      {MORNING_SLOTS.map((slot) => (
                        <button key={slot} type="button" onClick={() => setSelectedSlot(slot)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${selectedSlot === slot ? "bg-brand-gradient text-white" : "border border-gray-200 text-gray-600 hover:border-brand-teal"}`}>
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs text-muted-foreground">{t("afternoon")}</p>
                    <div className="flex flex-wrap gap-2">
                      {AFTERNOON_SLOTS.map((slot) => (
                        <button key={slot} type="button" onClick={() => setSelectedSlot(slot)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${selectedSlot === slot ? "bg-brand-gradient text-white" : "border border-gray-200 text-gray-600 hover:border-brand-teal"}`}>
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Department<span className="text-red-500">*</span>
                </label>
                <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v, service: "" })} required>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder={t("selectDepartment")} />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {locale === "ar" && department.nameAr ? department.nameAr : department.name}
                      </SelectItem>
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
                    {filteredServices.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {locale === "ar" && service.nameAr ? service.nameAr : service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Special Requests</label>
              <Textarea
                rows={4}
                placeholder="Share concerns, history, goals, or specialist preference."
                value={form.specialRequests}
                onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                className="rounded-lg"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Appointment Confirmation<span className="text-red-500">*</span>
              </label>
              <div className="flex gap-5">
                {(["email", "sms", "whatsapp"] as const).map((method) => (
                  <label key={method} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                    <input type="radio" name="confirmation" checked={confirmation === method} onChange={() => setConfirmation(method)} className="accent-brand-teal" />
                    {method === "email" ? "Email" : method === "sms" ? "SMS" : "WhatsApp"}
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
