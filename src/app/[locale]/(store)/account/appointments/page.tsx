"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/navigation";
import { CalendarDays, Clock, Grid2X2, List, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

type Appointment = {
  id: string;
  department: string;
  service: string;
  date: string;
  slot: string;
  status: "pending" | "upcoming" | "done" | "cancelled";
};

const tabs = [
  { key: "upcoming", label: "Upcoming" },
  { key: "done", label: "Completed" },
  { key: "cancelled", label: "Canceled" },
] as const;

const statusClass: Record<Appointment["status"], string> = {
  pending: "bg-yellow-100 text-yellow-700",
  upcoming: "bg-green-100 text-green-700",
  done: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function MyAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["key"]>("upcoming");
  const [view, setView] = useState<"list" | "grid">("list");

  useEffect(() => {
    fetch("/api/auth/patient/appointments")
      .then((response) => {
        if (response.status === 401) {
          router.push("/login");
          return null;
        }
        return response.ok ? response.json() : Promise.reject();
      })
      .then((payload: { data: Appointment[] } | null) => {
        if (payload) setAppointments(payload.data);
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const filtered = useMemo(() => {
    if (activeTab === "upcoming") {
      return appointments.filter((appointment) => appointment.status === "upcoming" || appointment.status === "pending");
    }
    return appointments.filter((appointment) => appointment.status === activeTab);
  }, [activeTab, appointments]);

  if (loading) {
    return <div className="figma-card p-8 text-sm text-muted-foreground">Loading appointments...</div>;
  }

  return (
    <section className="py-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="gradient-text text-[38px] font-semibold">My Appointment</h1>
          <p className="mt-2 text-sm text-muted-foreground">Your upcoming and past clinic bookings.</p>
        </div>
        <Button asChild className="rounded-full bg-brand-gold px-8 text-white hover:bg-brand-gold/90">
          <Link href="/book-appointment">Book Appointment</Link>
        </Button>
      </div>

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                activeTab === tab.key ? "bg-brand-gradient text-white shadow-[0_8px_18px_rgba(0,153,168,0.18)]" : "border border-brand-100 bg-white text-[#42526b]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setView("list")} className={`flex h-11 w-11 items-center justify-center rounded-full ${view === "list" ? "bg-brand-teal text-white" : "bg-white text-brand-teal"}`} aria-label="List view">
            <List className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => setView("grid")} className={`flex h-11 w-11 items-center justify-center rounded-full ${view === "grid" ? "bg-brand-teal text-white" : "bg-white text-brand-teal"}`} aria-label="Grid view">
            <Grid2X2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {filtered.length ? (
        <div className={view === "grid" ? "grid gap-5 md:grid-cols-2" : "space-y-5"}>
          {filtered.map((appointment) => (
            <article key={appointment.id} className="figma-card flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-teal">
                <UserRound className="h-11 w-11" />
              </div>
              <div className="min-w-0 flex-1">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass[appointment.status]}`}>
                  {appointment.status === "done" ? "completed" : appointment.status}
                </span>
                <h2 className="mt-3 text-[20px] font-semibold text-[#061c3d]">{appointment.service}</h2>
                <p className="mt-1 text-sm text-[#42526b]">{appointment.department}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#42526b]">
                  <span className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-brand-teal" />
                    {appointment.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-brand-teal" />
                    {appointment.slot}
                  </span>
                </div>
              </div>
              <div className="flex gap-3 sm:flex-col">
                <Button className="rounded-full bg-brand-teal px-6 text-white hover:bg-brand-blue">Reschedule</Button>
                <Button variant="ghost" className="rounded-full text-red-500 hover:text-red-600">Cancel</Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="figma-card p-12 text-center text-sm text-muted-foreground">
          No appointments in this tab.
        </div>
      )}
    </section>
  );
}
