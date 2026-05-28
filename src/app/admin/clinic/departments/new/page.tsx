"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Upload } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ApiDoctor = { id: string; name: string };

export default function NewDepartmentPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<ApiDoctor[]>([]);

  useEffect(() => {
    fetch("/api/doctors")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data: ApiDoctor[] }) => setDoctors(payload.data))
      .catch(() => toast.error("Doctors could not be loaded"));
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/departments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(formData.get("name") ?? ""),
        nameAr: String(formData.get("nameAr") ?? ""),
        description: String(formData.get("description") ?? ""),
        descriptionAr: String(formData.get("descriptionAr") ?? ""),
      }),
    });

    if (!response.ok) {
      toast.error("Department could not be created");
      return;
    }

    toast.success("Department created");
    router.push("/admin/clinic/departments");
  }

  return (
    <>
      <PageHeader title="New department" description="Create a clinic department and assign its lead." />
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-lg border bg-white p-6 md:grid-cols-2"
      >
        <div>
          <Label htmlFor="name-en">Name EN</Label>
          <Input id="name-en" name="name" required />
        </div>
        <div>
          <Label htmlFor="name-ar">Name AR</Label>
          <Input id="name-ar" name="nameAr" dir="rtl" required />
        </div>
        <div className="md:col-span-2">
          <Label>Upload Icon</Label>
          <label className="mt-2 flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-sm text-muted-foreground transition hover:border-primary hover:text-primary">
            <Building2 className="h-6 w-6" />
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span>Drag &amp; drop files or Browse</span>
            </div>
            <input type="file" className="hidden" />
          </label>
        </div>
        <div>
          <Label htmlFor="description-en">EN Description</Label>
          <Textarea id="description-en" name="description" rows={4} />
        </div>
        <div>
          <Label htmlFor="description-ar">AR Description</Label>
          <Textarea id="description-ar" name="descriptionAr" rows={4} dir="rtl" />
        </div>
        <div>
          <Label>Department Head</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="doa">DOA - Date of Activation</Label>
          <Input id="doa" type="date" />
        </div>
        <div className="md:col-span-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/clinic/departments")}>
            Cancel
          </Button>
          <Button type="submit" variant="gradient">
            Save
          </Button>
        </div>
      </form>
    </>
  );
}
