"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type ApiDepartment = { id: string; name: string };
type ApiRole = { id: string; name: string };

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewEmployee() {
  const router = useRouter();
  const [departments, setDepartments] = useState<ApiDepartment[]>([]);
  const [roles, setRoles] = useState<ApiRole[]>([]);
  const [departmentId, setDepartmentId] = useState("");
  const [roleId, setRoleId] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/departments").then((response) => (response.ok ? response.json() : Promise.reject())),
      fetch("/api/roles").then((response) => (response.ok ? response.json() : Promise.reject())),
    ])
      .then(([departmentPayload, rolePayload]: [{ data: ApiDepartment[] }, { data: ApiRole[] }]) => {
        setDepartments(departmentPayload.data);
        setRoles(rolePayload.data);
      })
      .catch(() => toast.error("Form options could not be loaded"));
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const selectedRole = roles.find((role) => role.id === roleId);
    const selectedDepartment = departments.find((department) => department.id === departmentId);

    const response = await fetch("/api/doctors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        nameAr: String(formData.get("nameAr") ?? ""),
        title: selectedRole?.name ?? "Clinic Specialist",
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        specialization: selectedDepartment?.name ?? "Clinic",
        slug: slugify(name) || crypto.randomUUID(),
        departmentId: departmentId || undefined,
        status: "active",
        bio: String(formData.get("notes") ?? ""),
      }),
    });

    if (!response.ok) {
      toast.error("Employee could not be saved");
      return;
    }

    toast.success("Employee saved");
    router.push("/admin/clinic/team");
  }

  return (
    <>
      <PageHeader title="New employee" description="Add a doctor, nurse or admin user" />
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-lg border bg-white p-6 md:grid-cols-2"
      >
        <div><Label>Name EN *</Label><Input name="name" required /></div>
        <div><Label>Name AR *</Label><Input name="nameAr" dir="rtl" required /></div>
        <div><Label>Email *</Label><Input name="email" type="email" required /></div>
        <div><Label>Password *</Label><Input type="password" required /></div>
        <div><Label>Phone *</Label><Input name="phone" required /></div>
        <div><Label>Emergency Phone *</Label><Input /></div>
        <div>
          <Label>Department *</Label>
          <Select value={departmentId} onValueChange={setDepartmentId}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>{departments.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>Role *</Label>
          <Select value={roleId} onValueChange={setRoleId}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>{roles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2"><Label>Photo</Label>
          <div className="mt-1 grid h-32 place-items-center rounded-md border border-dashed text-sm text-muted-foreground">Drag &amp; drop files or Browse</div>
        </div>
        <div className="md:col-span-2"><Label>Notes</Label><Textarea name="notes" rows={3} /></div>
        <div className="md:col-span-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" variant="gradient">Save employee</Button>
        </div>
      </form>
    </>
  );
}
