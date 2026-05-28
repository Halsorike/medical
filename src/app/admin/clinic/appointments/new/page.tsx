"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { patients, employees, services } from "@/data/clinic";

export default function NewAppointment() {
  const router = useRouter();
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientName: String(formData.get("patient") || "Clinic patient"),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        department: String(formData.get("employee") || "Clinic"),
        service: String(formData.get("service") || "Consultation"),
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
      <PageHeader title="New appointment" description="Book a session for a patient" />
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-lg border bg-white p-6 md:grid-cols-2"
      >
        <div><Label>Patient name EN *</Label>
          <Select name="patient"><SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
            <SelectContent>{patients.slice(0, 12).map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Patient name AR *</Label><Input dir="rtl" /></div>
        <div><Label>Email *</Label><Input name="email" type="email" required /></div>
        <div><Label>Phone *</Label><Input name="phone" required /></div>
        <div><Label>Date *</Label><Input name="date" type="date" required /></div>
        <div><Label>Time *</Label><Input name="time" type="time" required /></div>
        <div><Label>Service *</Label>
          <Select name="service"><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>{services.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Employee *</Label>
          <Select name="employee"><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>{employees.slice(0, 12).map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
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
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" variant="gradient">Send invitation</Button>
        </div>
      </form>
    </>
  );
}
