"use client";
import { useState } from "react";
import { Check, Circle, Mail, MessageCircle, Package, Phone, Truck, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";


const timeline = [
  { label: "Order placed", detail: "Jan 15, 2026 at 9:00 AM", status: "completed" },
  { label: "Confirmed", detail: "Jan 15, 2026 at 9:45 AM", status: "completed" },
  { label: "Shipped", detail: "Jan 16, 2026 via FedEx #7489234", status: "completed" },
  { label: "Out for delivery", detail: "Expected May 19, 2026", status: "active" },
  { label: "Delivered", detail: "", status: "pending" },
] as const;

const helpRows = [
  { icon: Phone, label: "Call us", detail: "+1 800 MED-HELP (Mon-Fri 8am-8pm)" },
  { icon: Mail, label: "Email us", detail: "support@medical.com" },
  { icon: MessageCircle, label: "Live chat", detail: "Available 24/7" },
];

export default function Track() {
  const [state, setState] = useState<"idle" | "loading" | "found" | "missing">("idle");

  return (
    <div className="container py-10">
      <div className="mx-auto grid max-w-2xl gap-6 md:grid-cols-[1fr_280px]">
        <div className="space-y-5">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setState("loading");
              setTimeout(() => setState(Math.random() > 0.2 ? "found" : "missing"), 700);
            }}
            className="space-y-4 rounded-lg border bg-white p-6"
          >
            <div>
              <h1 className="text-2xl font-bold">Track your order</h1>
              <p className="mt-1 text-sm text-muted-foreground">Enter your order number and email to see live status.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Order number</Label>
              <Input id="code" placeholder="#ORD-10268" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required />
            </div>
            <Button variant="gradient" type="submit" disabled={state === "loading"} className="w-full">
              {state === "loading" ? (
                <>
                  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Searching...
                </>
              ) : (
                "Track order"
              )}
            </Button>
          </form>

          {state === "found" ? (
            <div className="rounded-lg border bg-white p-5">
              <div className="mb-4 flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <Package className="mt-0.5 h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold">ORD-10268 is on its way!</p>
                  <p className="text-sm text-muted-foreground">Estimated delivery: Tomorrow, May 19</p>
                </div>
              </div>

              <div>
                {timeline.map((step, index) => {
                  const completed = step.status === "completed";
                  const active = step.status === "active";
                  const nextCompleted = timeline[index + 1]?.status === "completed";
                  const Icon = completed ? Check : active ? Truck : Circle;

                  return (
                    <div key={step.label}>
                      <div className="flex items-start gap-3">
                        <div
                          className={
                            completed
                              ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600"
                              : active
                                ? "flex h-8 w-8 shrink-0 animate-pulse items-center justify-center rounded-full bg-blue-100 text-blue-600"
                                : "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-muted-foreground"
                          }
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="pb-1">
                          <p className={completed ? "font-medium text-foreground" : active ? "font-medium text-blue-600" : "text-muted-foreground"}>
                            {step.label}
                          </p>
                          {step.detail ? <p className="text-xs text-muted-foreground">{step.detail}</p> : null}
                        </div>
                      </div>
                      {index < timeline.length - 1 ? (
                        <div className={completed && nextCompleted ? "ml-4 h-6 w-0.5 bg-green-500" : "ml-4 h-6 w-0.5 bg-slate-200"} />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {state === "missing" ? (
            <div className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <XCircle className="h-5 w-5 shrink-0" />
              <p>No order found. Please check your order number and email.</p>
            </div>
          ) : null}
        </div>

        <aside className="space-y-4 rounded-lg border bg-white p-5">
          <div>
            <h2 className="font-semibold">Need help?</h2>
            <div className="mt-4 space-y-4">
              {helpRows.map((row) => {
                const Icon = row.icon;
                return (
                  <div key={row.label} className="flex gap-3">
                    <Icon className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{row.label}</p>
                      <p className="text-xs text-muted-foreground">{row.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <Separator />
          <div>
            <h2 className="font-semibold">Track with carrier</h2>
            <p className="mt-2 text-sm text-muted-foreground">If your order was shipped, you can also track directly:</p>
            <div className="mt-3 flex flex-col gap-2">
              {["FedEx tracking", "UPS tracking", "USPS tracking"].map((carrier) => (
                <a key={carrier} href="#" className="text-sm text-primary underline">
                  {carrier}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
