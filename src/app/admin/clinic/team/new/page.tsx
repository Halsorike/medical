"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { departments, roles } from "@/data/clinic";

export default function NewEmployee() {
  const router = useRouter();
  return (
    <>
      <PageHeader title="New employee" description="Add a doctor, nurse or admin user" />
      <form
        onSubmit={(e) => { e.preventDefault(); toast.success("Employee saved"); router.push("/admin/clinic/team"); }}
        className="grid gap-4 rounded-lg border bg-white p-6 md:grid-cols-2"
      >
        <div><Label>Name EN *</Label><Input required /></div>
        <div><Label>Name AR *</Label><Input dir="rtl" required /></div>
        <div><Label>Email *</Label><Input type="email" required /></div>
        <div><Label>Password *</Label><Input type="password" required /></div>
        <div><Label>Phone *</Label><Input required /></div>
        <div><Label>Emergency Phone *</Label><Input /></div>
        <div>
          <Label>Department *</Label>
          <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>{departments.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>Role *</Label>
          <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>{roles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2"><Label>Photo</Label>
          <div className="mt-1 grid h-32 place-items-center rounded-md border border-dashed text-sm text-muted-foreground">Drag &amp; drop files or Browse</div>
        </div>
        <div className="md:col-span-2"><Label>Notes</Label><Textarea rows={3} /></div>
        <div className="md:col-span-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" variant="gradient">Save employee</Button>
        </div>
      </form>
    </>
  );
}
