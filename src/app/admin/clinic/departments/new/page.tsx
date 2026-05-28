"use client";

import { useRouter } from "next/navigation";
import { Building2, Upload } from "lucide-react";
import { toast } from "sonner";
import { employees } from "@/data/clinic";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NewDepartmentPage() {
  const router = useRouter();

  return (
    <>
      <PageHeader title="New department" description="Create a clinic department and assign its lead." />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          toast.success("Department created");
          router.push("/admin/clinic/departments");
        }}
        className="grid gap-4 rounded-lg border bg-white p-6 md:grid-cols-2"
      >
        <div>
          <Label htmlFor="name-en">Name EN</Label>
          <Input id="name-en" required />
        </div>
        <div>
          <Label htmlFor="name-ar">Name AR</Label>
          <Input id="name-ar" dir="rtl" required />
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
          <Textarea id="description-en" rows={4} />
        </div>
        <div>
          <Label htmlFor="description-ar">AR Description</Label>
          <Textarea id="description-ar" rows={4} dir="rtl" />
        </div>
        <div>
          <Label>Department Head</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.name}
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
