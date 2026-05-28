"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useAdminLocale } from "@/components/admin/admin-locale-provider";

type ApiPatient = { id: string; name: string; email: string; phone?: string | null };
type ApiDoctor = { id: string; name: string };
type ApiService = { id: string; name: string; departmentId: string };

export default function NewAppointment() {
  const router = useRouter();
  const { labels } = useAdminLocale();
  const [patients, setPatients] = useState<ApiPatient[]>([]);
  const [doctors, setDoctors] = useState<ApiDoctor[]>([]);
  const [services, setServices] = useState<ApiService[]>([]);
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [serviceId, setServiceId] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/patients").then((response) => (response.ok ? response.json() : Promise.reject())),
      fetch("/api/doctors").then((response) => (response.ok ? response.json() : Promise.reject())),
      fetch("/api/services").then((response) => (response.ok ? response.json() : Promise.reject())),
    ])
      .then(([patientPayload, doctorPayload, servicePayload]: [{ data: ApiPatient[] }, { data: ApiDoctor[] }, { data: ApiService[] }]) => {
        setPatients(patientPayload.data);
        setDoctors(doctorPayload.data);
        setServices(servicePayload.data);
      })
      .catch(() => toast.error("Appointment options could not be loaded"));
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const selectedPatient = patients.find((patient) => patient.id === patientId);
    const selectedDoctor = doctors.find((doctor) => doctor.id === doctorId);
    const selectedService = services.find((service) => service.id === serviceId);

    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientName: selectedPatient?.name ?? "Clinic patient",
        email: String(formData.get("email") || selectedPatient?.email || ""),
        phone: String(formData.get("phone") || selectedPatient?.phone || ""),
        department: selectedDoctor?.name ?? "Clinic",
        service: selectedService?.name ?? "Consultation",
        date: String(formData.get("date") ?? ""),
        slot: String(formData.get("time") ?? ""),
        confirmation: "email",
        status: "pending",
      }),
    });

    if (!response.ok) {
      toast.error("Appointment could not be created");
      return;
    }

    toast.success("Appointment created");
    router.push("/admin/clinic/appointments");
  }

  return (
    <>
      <PageHeader title={labels.appointments.newAppointment} description={labels.appointments.description} />
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-lg border bg-white p-6 md:grid-cols-2"
      >
        <div><Label>{labels.appointments.patient} *</Label>
          <Select value={patientId} onValueChange={setPatientId}><SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
            <SelectContent>{patients.slice(0, 12).map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Patient name AR *</Label><Input dir="rtl" /></div>
        <div><Label>{labels.patients.email} *</Label><Input name="email" type="email" required /></div>
        <div><Label>{labels.patients.phone} *</Label><Input name="phone" required /></div>
        <div><Label>{labels.appointments.date} *</Label><Input name="date" type="date" required /></div>
        <div><Label>{labels.appointments.time} *</Label><Input name="time" type="time" required /></div>
        <div><Label>{labels.appointments.service} *</Label>
          <Select value={serviceId} onValueChange={setServiceId}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>{services.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>{labels.appointments.employee} *</Label>
          <Select value={doctorId} onValueChange={setDoctorId}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>{doctors.slice(0, 12).map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Session type *</Label>
          <Select defaultValue="In-Person"><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="Zoom">Zoom</SelectItem><SelectItem value="In-Person">In-Person</SelectItem><SelectItem value="Phone">Phone</SelectItem></SelectContent>
          </Select>
        </div>
        <div><Label>Period of session</Label><Input placeholder="e.g. 30 min" /></div>
        <div className="md:col-span-2"><Label>Notes</Label><Textarea rows={3} /></div>
        <div className="md:col-span-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>{labels.common.cancel}</Button>
          <Button type="submit" variant="gradient">{labels.common.save}</Button>
        </div>
      </form>
    </>
  );
}
