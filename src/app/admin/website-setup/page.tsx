"use client";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

const PAGES = ["General", "Home", "About", "Services", "Team", "Blog", "Contact", "Evaluation", "Shop"];
const SECTIONS = ["Header Nav Menu", "Slider", "Hero", "About Us Section", "Services Section", "Team Section", "Testimonial", "Blog Section", "Footer", "Latest Technology", "Clinic Information", "Contact Field"];

function Uploader({ label = "Drag & drop files or Browse" }: { label?: string }) {
  return <div className="grid h-28 place-items-center rounded-md border border-dashed text-sm text-muted-foreground">{label}</div>;
}

export default function WebsiteSetupPage() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  return (
    <>
      <PageHeader
        title="Website setup"
        description="Edit every section of the public clinic + shop website"
        action={
          <div className="flex gap-2">
            <Button variant={lang === "en" ? "gradient" : "outline"} onClick={() => setLang("en")}>English</Button>
            <Button variant={lang === "ar" ? "gradient" : "outline"} onClick={() => setLang("ar")}>Arabic</Button>
          </div>
        }
      />
      <Tabs defaultValue="General">
        <TabsList className="flex flex-wrap">
          {PAGES.map((p) => <TabsTrigger key={p} value={p}>{p}</TabsTrigger>)}
        </TabsList>
        {PAGES.map((p) => (
          <TabsContent key={p} value={p}>
            <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
              <div className="rounded-lg border bg-white p-3 text-sm">
                <p className="mb-2 font-semibold">{p} sections</p>
                <ul className="space-y-1">
                  {SECTIONS.map((s) => (
                    <li key={s}>
                      <button className="w-full rounded-md px-3 py-2 text-left hover:bg-muted">{s}</button>
                    </li>
                  ))}
                  <li><button className="mt-2 inline-flex items-center gap-1 text-xs text-primary"><Plus className="h-3 w-3" /> Add new</button></li>
                </ul>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); toast.success("Website section saved"); }} className="space-y-4 rounded-lg border bg-white p-6" dir={lang === "ar" ? "rtl" : "ltr"}>
                <div className="grid gap-3 md:grid-cols-2">
                  <div><Label>Title</Label><Input /></div>
                  <div><Label>Tagline</Label><Input /></div>
                </div>
                <div><Label>Content</Label><Textarea rows={4} /></div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div><Label>Logo</Label><Uploader /></div>
                  <div><Label>Favicon</Label><Uploader /></div>
                </div>
                <div><Label>Hero image</Label><Uploader /></div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline">Reset</Button>
                  <Button type="submit" variant="gradient">Update</Button>
                </div>
              </form>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
