"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Department = { id: string; name: string; nameAr?: string | null };
type Service = { id: string; name: string; nameAr?: string | null; departmentId: string };

const fallbackDepartments: Department[] = [
  { id: "audiology", name: "Audiology", nameAr: "السمعيات" },
  { id: "speech", name: "Speech Therapy", nameAr: "علاج النطق" },
  { id: "ot", name: "Occupational Therapy", nameAr: "العلاج الوظيفي" },
];

const fallbackServices: Service[] = [
  { id: "hearing-test", name: "Hearing Assessment", nameAr: "تقييم السمع", departmentId: "audiology" },
  { id: "speech-assessment", name: "Speech Assessment", nameAr: "تقييم النطق", departmentId: "speech" },
  { id: "ot-assessment", name: "OT Assessment", nameAr: "تقييم العلاج الوظيفي", departmentId: "ot" },
];

const days = [
  { label: "Mon", value: "2026-06-01", day: "01" },
  { label: "Tue", value: "2026-06-02", day: "02" },
  { label: "Wed", value: "2026-06-03", day: "03" },
  { label: "Thu", value: "2026-06-04", day: "04" },
  { label: "Fri", value: "2026-06-05", day: "05" },
  { label: "Sat", value: "2026-06-06", day: "06" },
];

const morningSlots = ["10:30", "11:00", "11:30"];
const afternoonSlots = ["14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[14px] font-medium text-[#1a1a2e]">
        {label}
        {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "h-12 w-full border-0 border-b border-[#d8e3e6] bg-transparent px-0 text-[15px] outline-none transition placeholder:text-[#9aa8ad] focus:border-brand-teal focus:ring-0";

export default function BookAppointmentPage() {
  const locale = useLocale();
  const t = useTranslations("bookAppointment");
  const isAr = locale === "ar";
  const [departments, setDepartments] = useState<Department[]>(fallbackDepartments);
  const [services, setServices] = useState<Service[]>(fallbackServices);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    emergencyPhone: "",
    date: days[1].value,
    slot: "10:30",
    departmentId: fallbackDepartments[0].id,
    serviceId: fallbackServices[0].id,
    notes: "",
    confirmation: "Email",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/departments").then((response) => (response.ok ? response.json() : Promise.reject())),
      fetch("/api/services").then((response) => (response.ok ? response.json() : Promise.reject())),
    ])
      .then(([departmentsPayload, servicesPayload]: [{ data: Department[] }, { data: Service[] }]) => {
        if (departmentsPayload.data?.length) {
          setDepartments(departmentsPayload.data);
          setForm((current) => ({ ...current, departmentId: departmentsPayload.data[0].id }));
        }
        if (servicesPayload.data?.length) {
          setServices(servicesPayload.data);
          setForm((current) => ({ ...current, serviceId: servicesPayload.data[0].id }));
        }
      })
      .catch(() => toast.error("Could not load departments and services"));
  }, []);

  const filteredServices = useMemo(() => {
    const matches = services.filter((service) => service.departmentId === form.departmentId);
    return matches.length ? matches : services;
  }, [form.departmentId, services]);

  useEffect(() => {
    if (!filteredServices.some((service) => service.id === form.serviceId)) {
      setForm((current) => ({ ...current, serviceId: filteredServices[0]?.id ?? "" }));
    }
  }, [filteredServices, form.serviceId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const department = departments.find((item) => item.id === form.departmentId);
    const service = services.find((item) => item.id === form.serviceId);
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientName: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        department: department?.name ?? form.departmentId,
        service: service?.name ?? form.serviceId,
        date: form.date,
        slot: form.slot,
        confirmation: form.confirmation,
      }),
    });

    if (!response.ok) {
      toast.error("Could not confirm appointment");
      return;
    }

    setSubmitted(true);
    toast.success("Appointment confirmed");
  }

  if (submitted) {
    return (
      <section className="container py-20">
        <div className="figma-card mx-auto max-w-xl p-10 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-brand-teal" />
          <h1 className="gradient-text mt-5 text-[32px] font-semibold">{t("confirmed")}</h1>
          <p className="mt-3 text-[#42526b]">We will contact you soon with the appointment details.</p>
          <Button asChild className="mt-8 rounded-full bg-brand-gold px-8 text-white hover:bg-brand-gold/90">
            <a href={`/${locale}/account/appointments`}>View my appointments</a>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-16 md:py-20">
      <div className="mb-12 text-center">
        <h1 className="gradient-text text-[38px] font-semibold">{t("heading")}</h1>
      </div>

      <form onSubmit={handleSubmit} className="figma-card mx-auto max-w-[1030px] p-6 md:p-10">
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          <Field label={t("firstName")} required>
            <input className={inputClass} value={form.firstName} onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))} required />
          </Field>
          <Field label={t("lastName")} required>
            <input className={inputClass} value={form.lastName} onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))} required />
          </Field>
          <Field label="Email" required>
            <input type="email" className={inputClass} value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required />
          </Field>
          <div />
          <Field label={t("phone")} required>
            <div className="flex items-center gap-3 border-b border-[#d8e3e6] focus-within:border-brand-teal">
              <span className="text-xl">🇴🇲</span>
              <input type="tel" className="h-12 flex-1 border-0 bg-transparent outline-none focus:ring-0" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} required />
            </div>
          </Field>
          <Field label="Emergency Phone" required>
            <div className="flex items-center gap-3 border-b border-[#d8e3e6] focus-within:border-brand-teal">
              <span className="text-xl">🇴🇲</span>
              <input type="tel" className="h-12 flex-1 border-0 bg-transparent outline-none focus:ring-0" value={form.emergencyPhone} onChange={(event) => setForm((current) => ({ ...current, emergencyPhone: event.target.value }))} required />
            </div>
          </Field>

          <Field label="Appointment Date" required>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {days.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, date: day.value }))}
                  className={`rounded-[18px] border px-3 py-3 text-center transition ${
                    form.date === day.value ? "border-brand-teal bg-brand-teal text-white" : "border-brand-100 bg-white text-[#42526b]"
                  }`}
                >
                  <span className="block text-xs">{day.label}</span>
                  <span className="block text-lg font-semibold">{day.day}</span>
                </button>
              ))}
            </div>
          </Field>

          <Field label="Appointment Time" required>
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#42526b]">{t("morning")}</p>
                <div className="flex flex-wrap gap-2">
                  {morningSlots.map((slot) => (
                    <button key={slot} type="button" onClick={() => setForm((current) => ({ ...current, slot }))} className={`rounded-full px-4 py-2 text-sm ${form.slot === slot ? "bg-brand-teal text-white" : "bg-brand-50 text-brand-blue"}`}>
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#42526b]">{t("afternoon")}</p>
                <div className="flex flex-wrap gap-2">
                  {afternoonSlots.map((slot) => (
                    <button key={slot} type="button" onClick={() => setForm((current) => ({ ...current, slot }))} className={`rounded-full px-4 py-2 text-sm ${form.slot === slot ? "bg-brand-teal text-white" : "bg-brand-50 text-brand-blue"}`}>
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Field>

          <Field label={t("selectDepartment")} required>
            <select className={inputClass} value={form.departmentId} onChange={(event) => setForm((current) => ({ ...current, departmentId: event.target.value }))} required>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {isAr && department.nameAr ? department.nameAr : department.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("selectService")} required>
            <select className={inputClass} value={form.serviceId} onChange={(event) => setForm((current) => ({ ...current, serviceId: event.target.value }))} required>
              {filteredServices.map((service) => (
                <option key={service.id} value={service.id}>
                  {isAr && service.nameAr ? service.nameAr : service.name}
                </option>
              ))}
            </select>
          </Field>

          <div className="md:col-span-2">
            <Field label={t("notes")} required>
              <Textarea className="min-h-[120px] rounded-[18px] border-brand-100 focus-visible:ring-brand-teal" value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
            </Field>
          </div>

          <div className="md:col-span-2">
            <p className="mb-3 text-[14px] font-medium text-[#1a1a2e]">Appointment Confirmation<span className="text-red-500">*</span></p>
            <div className="flex flex-wrap gap-3">
              {["Email", "SMS", "WhatsApp"].map((method) => (
                <label key={method} className={`cursor-pointer rounded-full border px-5 py-2 text-sm ${form.confirmation === method ? "border-brand-teal bg-brand-teal text-white" : "border-brand-100 text-[#42526b]"}`}>
                  <input className="sr-only" type="radio" name="confirmation" value={method} checked={form.confirmation === method} onChange={() => setForm((current) => ({ ...current, confirmation: method }))} />
                  {method}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Button type="submit" className="h-13 rounded-full bg-brand-gold px-12 py-6 text-[18px] text-white hover:bg-brand-gold/90">
            <CalendarDays className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
            {t("confirm")}
          </Button>
        </div>
      </form>
    </section>
  );
}
