"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/navigation";
import { CalendarDays, Heart, MapPin, Settings, ShoppingBag, Star } from "lucide-react";

type PatientUser = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  createdAt?: string;
};

const quickLinks = [
  { label: "My appointments", href: "/account/appointments", icon: CalendarDays },
  { label: "Manage addresses", href: "/account/addresses", icon: MapPin },
  { label: "Profile settings", href: "/account/profile", icon: Settings },
];

export default function AccountHome() {
  const router = useRouter();
  const [patient, setPatient] = useState<PatientUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/patient/me")
      .then((response) => {
        if (response.status === 401) {
          router.push("/login");
          return null;
        }
        return response.ok ? response.json() : Promise.reject();
      })
      .then((payload: { data: { user: PatientUser } } | null) => {
        if (payload) setPatient(payload.data.user);
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return <div className="rounded-lg border bg-white p-8 text-sm text-muted-foreground">Loading account...</div>;
  }

  if (!patient) {
    return null;
  }

  const stats = [
    { label: "Appointments", value: "View", icon: CalendarDays },
    { label: "Wishlist items", value: "6", icon: Heart },
    { label: "Club points", value: "430", icon: Star },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {patient.name}</h1>
        <p className="text-sm text-muted-foreground">{patient.email}</p>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex items-center gap-3 rounded-lg border bg-white p-4">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </section>

      <section className="rounded-lg border bg-white p-5">
        <div className="flex items-center gap-3">
          <ShoppingBag className="h-5 w-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">Your clinic profile is ready</h2>
            <p className="text-sm text-muted-foreground">Use this account to review upcoming appointments and update your information.</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {quickLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex cursor-pointer items-center gap-3 rounded-lg border bg-white p-4 transition hover:bg-muted">
              <Icon className="h-5 w-5 text-primary" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
