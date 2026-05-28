"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

type ApiContactMessage = {
  id: string;
  name: string;
  email: string;
  from?: string;
  to?: string;
  subject?: string | null;
  message: string;
  body?: string;
  createdAt: string;
  date?: string;
  status: string;
  read?: boolean;
};

export default function MailPage() {
  const [inbox, setInbox] = useState<ApiContactMessage[]>([]);
  const [selected, setSelected] = useState<ApiContactMessage | null>(null);
  const sent: ApiContactMessage[] = [];

  useEffect(() => {
    fetch("/api/contact-messages")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data: ApiContactMessage[] }) => {
        const messages = payload.data.map((message) => ({
          ...message,
          from: message.email,
          to: "clinic@medical.com",
          body: message.message,
          date: new Date(message.createdAt).toLocaleDateString(),
          read: message.status !== "new",
        }));
        setInbox(messages);
        setSelected(messages[0] ?? null);
      })
      .catch(() => toast.error("Mail messages could not be loaded"));
  }, []);
  return (
    <>
      <PageHeader title="Mail" description="Patient and team messages" action={<Button variant="gradient"><Plus className="mr-1 h-4 w-4" />New email</Button>} />
      <Tabs defaultValue="inbox">
        <TabsList><TabsTrigger value="inbox">Inbox</TabsTrigger><TabsTrigger value="sent">Sent</TabsTrigger><TabsTrigger value="new">New email</TabsTrigger></TabsList>
        <TabsContent value="inbox">
          <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
            <div className="rounded-lg border bg-white">
              <ul className="divide-y text-sm">
                {inbox.map((m) => (
                  <li key={m.id}>
                    <button onClick={() => setSelected(m)} className={cn("w-full p-3 text-left hover:bg-muted/40", selected?.id === m.id && "bg-muted/60", m.status === "new" && "font-semibold")}>
                      <p className="truncate">{m.email}</p>
                      <p className="truncate text-xs text-muted-foreground">{m.subject ?? "Contact request"}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">{new Date(m.createdAt).toLocaleDateString()}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border bg-white p-6">
              {selected ? (
                <>
                  <p className="text-lg font-semibold">{selected.subject ?? "Contact request"}</p>
                  <p className="text-xs text-muted-foreground">From {selected.from} · {selected.date}</p>
                  <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{selected.message}</div>
                </>
              ) : (
                <p className="grid place-items-center text-sm text-muted-foreground"><Mail className="h-6 w-6" /> Select a message</p>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="sent">
          <ul className="divide-y rounded-lg border bg-white text-sm">
            {sent.map((m) => (
              <li key={m.id} className="p-3"><p className="font-medium">{m.subject}</p><p className="text-xs text-muted-foreground">To {m.to} · {m.date}</p></li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="new">
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Email sent"); }} className="grid gap-4 rounded-lg border bg-white p-6">
            <div><Label>To</Label><Input required placeholder="recipient@example.com" /></div>
            <div><Label>CC</Label><Input /></div>
            <div><Label>Subject</Label><Input required /></div>
            <div><Label>Body</Label><Textarea rows={8} required /></div>
            <div className="flex justify-end gap-2"><Button type="button" variant="outline">Save draft</Button><Button type="submit" variant="gradient">Send</Button></div>
          </form>
        </TabsContent>
      </Tabs>
    </>
  );
}
