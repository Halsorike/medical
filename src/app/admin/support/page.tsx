"use client";
import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

type Ticket = { id: string; subject: string; customer: string; service: string; status: "pending" | "solved"; date: string };
const tickets: Ticket[] = [
  { id: "TCK-2031", subject: "Order #ORD-10254 not received", customer: "Brian Chen", service: "Orders", status: "pending", date: "12 Dec 2025" },
  { id: "TCK-2030", subject: "Wrong product size", customer: "Alice Walker", service: "Refunds", status: "pending", date: "11 Dec 2025" },
  { id: "TCK-2029", subject: "How to claim warranty?", customer: "Carla Diaz", service: "Warranty", status: "solved", date: "10 Dec 2025" },
  { id: "TCK-2028", subject: "Refund delay", customer: "David Park", service: "Refunds", status: "solved", date: "9 Dec 2025" },
];

type Msg = { from: "agent" | "user"; text: string; at: string };
const initial: Msg[] = [
  { from: "user", text: "Hi, Dr. Randy 🙏", at: "10:02" },
  { from: "agent", text: "Good morning, how can I help you?", at: "10:03" },
];

export default function Support() {
  const [chat, setChat] = useState<Msg[]>(initial);
  const [draft, setDraft] = useState("");
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setChat((c) => [...c, { from: "agent", text: draft.trim(), at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setDraft("");
  };

  return (
    <>
      <PageHeader title="Support" description="Tickets and live chat" />
      <Tabs defaultValue="tickets">
        <TabsList>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="chat">Live chat</TabsTrigger>
        </TabsList>
        <TabsContent value="tickets">
          <DataTable
            rows={tickets}
            rowKey={(r) => r.id}
            columns={[
              { header: "#", accessor: (r) => r.id },
              { header: "Subject", accessor: (r) => r.subject },
              { header: "Customer", accessor: (r) => r.customer },
              { header: "Services", accessor: (r) => r.service },
              { header: "Date", accessor: (r) => r.date },
              { header: "Status", accessor: (r) => <StatusBadge value={r.status} /> },
              { header: "Action", accessor: () => <Button size="sm" variant="outline">Open</Button> },
            ]}
          />
          <Pagination total={tickets.length} />
        </TabsContent>
        <TabsContent value="chat">
          <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
            <ul className="rounded-lg border bg-white divide-y text-sm">
              {tickets.map((t) => (
                <li key={t.id} className="cursor-pointer p-3 hover:bg-muted/40">
                  <p className="truncate font-medium">{t.customer}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.subject}</p>
                </li>
              ))}
            </ul>
            <div className="flex h-[480px] flex-col rounded-lg border bg-white">
              <div className="border-b p-3 text-sm font-semibold">Chat box</div>
              <div className="flex-1 space-y-2 overflow-y-auto p-4 text-sm">
                {chat.map((m, i) => (
                  <div key={i} className={`flex ${m.from === "agent" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs rounded-2xl px-3 py-2 ${m.from === "agent" ? "bg-brand-gradient text-white" : "bg-muted"}`}>
                      <p>{m.text}</p><p className="mt-0.5 text-[10px] opacity-70">{m.at}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={send} className="flex gap-2 border-t p-3">
                <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a message…" />
                <Button type="submit" variant="gradient"><Send className="mr-1 h-4 w-4" />Send</Button>
              </form>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
