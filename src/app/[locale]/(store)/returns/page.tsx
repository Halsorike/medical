"use client";

import { type FormEvent, useState } from "react";
import { Link } from "@/navigation";
import { ChevronDown, CreditCard, RotateCcw, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const policyCards = [
  {
    title: "30-day returns",
    text: "Return most items within 30 days of delivery for a full refund. Items must be unused and in original packaging.",
    icon: RotateCcw,
  },
  {
    title: "Free return shipping",
    text: "We cover return shipping costs for defective or incorrect items. For other returns, a $5.99 label fee applies.",
    icon: Truck,
  },
  {
    title: "Refund timeline",
    text: "Refunds are processed within 3-5 business days after we receive your return. Credit card refunds may take an additional 2-3 days.",
    icon: CreditCard,
  },
];

const faqs = [
  {
    question: "What items can't be returned?",
    answer: "Prescription medications, opened personal care items, and temperature-sensitive products cannot be returned.",
  },
  {
    question: "Can I exchange instead of return?",
    answer: "Yes! Select 'Exchange' in the return form and choose your replacement item.",
  },
  {
    question: "What if my item arrived damaged?",
    answer: "Contact us within 48 hours with photos. We'll send a replacement or issue a full refund immediately.",
  },
];

export default function Returns() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [refundMethod, setRefundMethod] = useState("original");

  function submitReturn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    alert("Return request submitted (mock)");
  }

  return (
    <div className="container grid grid-cols-1 gap-8 py-10 md:grid-cols-[1fr_420px]">
      <section className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Returns &amp; Refunds</h1>
          <p className="mt-2 text-muted-foreground">We want you to be 100% satisfied with your purchase.</p>
        </div>

        <div className="grid gap-4">
          {policyCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="space-y-4 rounded-lg border bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold">{card.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{card.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="overflow-hidden rounded-lg border bg-white">
          {faqs.map((faq, index) => {
            const open = openFaq === index;
            return (
              <div key={faq.question} className="border-b last:border-b-0">
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center justify-between gap-3 p-4 text-left font-medium"
                  onClick={() => setOpenFaq(open ? null : index)}
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", open ? "rotate-180" : "")} />
                </button>
                {open ? <p className="px-4 pb-4 text-sm text-muted-foreground">{faq.answer}</p> : null}
              </div>
            );
          })}
        </div>
      </section>

      <aside className="space-y-4">
        <form onSubmit={submitReturn} className="space-y-4 rounded-lg border bg-white p-5">
          <h2 className="text-xl font-semibold">Start a Return</h2>
          <div className="space-y-2">
            <Label htmlFor="order-number">Order number</Label>
            <Input id="order-number" placeholder="#ORD-XXXXX" required />
          </div>
          <div className="space-y-2">
            <Label>Reason</Label>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="defective">Defective product</SelectItem>
                <SelectItem value="wrong-item">Wrong item received</SelectItem>
                <SelectItem value="changed-mind">Changed my mind</SelectItem>
                <SelectItem value="damaged">Damaged in transit</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="details">Details</Label>
            <Textarea id="details" rows={3} placeholder="Please describe the issue..." />
          </div>
          <div className="space-y-2">
            <Label>Refund method</Label>
            <div className="grid gap-2">
              {[
                { value: "original", label: "Original payment method" },
                { value: "credit", label: "Store credit" },
              ].map((method) => (
                <label
                  key={method.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm transition",
                    refundMethod === method.value ? "border-primary bg-primary/5" : "hover:bg-muted",
                  )}
                >
                  <input
                    type="radio"
                    name="refundMethod"
                    value={method.value}
                    checked={refundMethod === method.value}
                    onChange={(event) => setRefundMethod(event.target.value)}
                    className="h-4 w-4"
                  />
                  <span>{method.label}</span>
                </label>
              ))}
            </div>
          </div>
          <Button type="submit" variant="gradient" className="w-full">
            Submit return request
          </Button>
        </form>

        <div className="rounded-lg bg-slate-50 p-4 text-sm">
          <p className="font-medium">Need help? Contact our support team</p>
          <Link href="/contact" className="mt-2 inline-block text-primary hover:underline">
            Chat with us &rarr;
          </Link>
        </div>
      </aside>
    </div>
  );
}
