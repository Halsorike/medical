"use client";

import { useState } from "react";
import { Link } from "@/navigation";
import { ChevronDown, FileText, MessageCircle, RotateCcw, Search, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const categories = [
  { icon: Truck,         label: "Orders & Shipping",  href: "/track" },
  { icon: RotateCcw,     label: "Returns & Refunds",  href: "/returns" },
  { icon: FileText,      label: "Prescriptions",      href: "/contact" },
  { icon: MessageCircle, label: "Contact Support",    href: "/contact" },
];

const faqs = [
  {
    category: "Orders",
    question: "How do I track my order?",
    answer: "Visit the Track Order page and enter your order number and email address to see live delivery status.",
  },
  {
    category: "Returns",
    question: "What is your return policy?",
    answer: "Most items can be returned within 30 days of delivery in original, unused packaging. See our Returns page for full details.",
  },
  {
    category: "Payments",
    question: "Is online payment safe?",
    answer: "Yes. All payments are processed by certified PCI-DSS compliant gateways. We never store your card details.",
  },
  {
    category: "Shipping",
    question: "Do you ship internationally?",
    answer: "We currently ship within the US and Canada. International shipping is coming soon.",
  },
  {
    category: "Orders",
    question: "Can I change or cancel my order?",
    answer: "Orders can be modified or cancelled within 1 hour of placement. Contact support immediately if you need to make changes.",
  },
  {
    category: "Prescriptions",
    question: "How do I upload a prescription?",
    answer: "During checkout, you will be prompted to upload a photo or PDF of your valid prescription. Our pharmacist will review it within 2 hours.",
  },
];

export default function Help() {
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(query.toLowerCase()) ||
      f.answer.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="container py-10">
      {/* Header */}
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold">How can we help you?</h1>
        <p className="mt-2 text-muted-foreground">Search our help centre or browse topics below.</p>
        <div className="relative mt-6">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search help articlesâ€¦"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category shortcuts */}
      {!query && (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map(({ icon: Icon, label, href }) => (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center gap-2 rounded-xl border bg-white p-5 text-center transition hover:border-primary hover:shadow-md"
            >
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">{label}</span>
            </Link>
          ))}
        </div>
      )}

      {/* FAQ accordion */}
      <div className="mx-auto mt-10 max-w-2xl">
        <h2 className="mb-4 text-lg font-semibold">
          {query ? `Results for "${query}"` : "Frequently asked questions"}
        </h2>

        {filtered.length === 0 ? (
          <div className="rounded-lg border bg-white p-8 text-center text-muted-foreground">
            No results found. <Link href="/contact" className="text-primary underline">Contact us</Link> for help.
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border bg-white">
            {filtered.map((faq, i) => {
              const open = openIndex === i;
              return (
                <div key={faq.question} className="border-b last:border-b-0">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    onClick={() => setOpenIndex(open ? null : i)}
                  >
                    <span className="font-medium">{faq.question}</span>
                    <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
                  </button>
                  {open && (
                    <p className="px-5 pb-4 text-sm text-muted-foreground">{faq.answer}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Contact CTA */}
      <div className="mx-auto mt-10 max-w-2xl rounded-xl border bg-white p-6 text-center">
        <MessageCircle className="mx-auto h-8 w-8 text-primary" />
        <h3 className="mt-3 font-semibold">Still need help?</h3>
        <p className="mt-1 text-sm text-muted-foreground">Our support team is available Monâ€“Fri 8amâ€“8pm EST.</p>
        <Link href="/contact">
          <Button variant="gradient" className="mt-4">Contact support</Button>
        </Link>
      </div>
    </div>
  );
}
