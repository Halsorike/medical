"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NewHolidayPage() {
  const router = useRouter();

  return (
    <>
      <PageHeader title="" description="" />
      {/* Figma: Holidays / Leaves sub-tabs at top of content area */}
      <Tabs defaultValue="holidays" className="mb-6">
        <TabsList>
          <TabsTrigger value="holidays">Holidays</TabsTrigger>
          <TabsTrigger value="leaves" onClick={() => router.push("/admin/clinic/holidays")}>
            Leaves
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="rounded-lg border bg-white p-6 max-w-2xl">
        <h2 className="mb-6 text-lg font-semibold text-primary">New Holiday</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            toast.success("Holiday created");
            router.push("/admin/clinic/holidays");
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="period">Period of Holiday *</Label>
            <Input id="period" required placeholder="" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="start-date">Start Date *</Label>
              <Input id="start-date" type="date" required />
            </div>
            <div>
              <Label htmlFor="end-date">End Date *</Label>
              <Input id="end-date" type="date" required />
            </div>
          </div>

          <div>
            <Label htmlFor="reason">Reason of Holiday *</Label>
            <Textarea id="reason" rows={5} required placeholder="" />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="gradient">
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/clinic/holidays")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
