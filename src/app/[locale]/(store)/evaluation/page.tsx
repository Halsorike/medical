"use client";

import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const questions = {
  hearing: [
    "Do you have difficulty hearing in noisy environments?",
    "Do you often ask people to repeat themselves?",
    "Do you miss parts of conversations?",
  ],
  speech: [
    "Does speech sound unclear in daily conversation?",
    "Is it difficult to find the right words quickly?",
    "Do communication challenges affect school or family routines?",
  ],
  occupational: [
    "Are daily routines difficult to complete independently?",
    "Are sensory experiences overwhelming or distracting?",
    "Are fine-motor or handwriting tasks challenging?",
  ],
};

const questionsAr = {
  hearing: ["هل توجد صعوبة في السمع في الأماكن المزدحمة؟", "هل تطلب تكرار الكلام كثيرًا؟", "هل تفوتك أجزاء من المحادثات؟"],
  speech: ["هل يبدو النطق غير واضح في الحديث اليومي؟", "هل توجد صعوبة في اختيار الكلمات؟", "هل تؤثر صعوبات التواصل على المدرسة أو الأسرة؟"],
  occupational: ["هل توجد صعوبة في إنجاز الروتين اليومي؟", "هل تسبب الخبرات الحسية تشتتًا أو انزعاجًا؟", "هل توجد صعوبة في المهارات الدقيقة أو الكتابة؟"],
};

const tabs = [
  { key: "hearing", label: "Hearing", labelAr: "السمع" },
  { key: "speech", label: "Speech", labelAr: "النطق" },
  { key: "occupational", label: "Occupational Therapy", labelAr: "العلاج الوظيفي" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export default function EvaluationPage() {
  const locale = useLocale();
  const t = useTranslations("evaluation");
  const [activeTab, setActiveTab] = useState<TabKey>("hearing");
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const isAr = locale === "ar";

  const visibleQuestions = useMemo(() => (isAr ? questionsAr : questions)[activeTab], [activeTab, isAr]);
  const answeredCount = visibleQuestions.filter((_, index) => answers[`${activeTab}-${index}`] !== undefined).length;

  async function handleDone() {
    if (answeredCount < visibleQuestions.length) {
      toast.error("Please answer all questions first.");
      return;
    }

    const score = visibleQuestions.reduce((total, _, index) => total + (answers[`${activeTab}-${index}`] ? 1 : 0), 0);
    setSubmitting(true);
    const response = await fetch("/api/evaluations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientName: "Storefront visitor",
        age: "0",
        email: "visitor@echowellness.me",
        phone: "+968",
        answers,
        score,
      }),
    });
    setSubmitting(false);

    if (!response.ok) {
      toast.error("Evaluation submission failed.");
      return;
    }

    toast.success("Evaluation submitted. Our team will guide you on next steps.");
  }

  return (
    <section className="container py-16 md:py-20">
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
              activeTab === tab.key ? "bg-brand-gradient text-white shadow-[0_8px_18px_rgba(0,153,168,0.18)]" : "border border-brand-100 bg-white text-[#42526b]"
            }`}
          >
            {isAr ? tab.labelAr : tab.label}
          </button>
        ))}
      </div>

      <div className="mb-12 text-center">
        <h1 className="gradient-text text-[34px] font-semibold">{t("heading")}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-[18px] leading-8 text-[#42526b]">
          Title Of The Question Will Be Here
        </p>
      </div>

      <div className="relative">
        <div className="grid gap-6 lg:grid-cols-3">
          {visibleQuestions.map((question, index) => {
            const key = `${activeTab}-${index}`;
            return (
              <article key={key} className="figma-card min-h-[390px] p-6">
                <div className="mb-8 flex items-center justify-between">
                  <span className="rounded-full border border-brand-teal px-4 py-1 text-xs font-semibold text-brand-teal">
                    Question {index + 1}
                  </span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setAnswers((current) => ({ ...current, [key]: false }))} className={`flex h-9 w-9 items-center justify-center rounded-full ${answers[key] === false ? "bg-red-500 text-white" : "bg-red-50 text-red-500"}`} aria-label="No">
                      <X className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => setAnswers((current) => ({ ...current, [key]: true }))} className={`flex h-9 w-9 items-center justify-center rounded-full ${answers[key] === true ? "bg-green-500 text-white" : "bg-green-50 text-green-500"}`} aria-label="Yes">
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <h2 className="text-[22px] font-semibold leading-8 text-[#061c3d]">{question}</h2>
                <div className="mt-10 flex h-[160px] items-center justify-center rounded-[20px] bg-brand-50 text-brand-teal">
                  <span className="text-[54px] font-semibold">{index + 1}</span>
                </div>
              </article>
            );
          })}
        </div>
        <div className="mt-10 flex justify-center gap-3">
          <button className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-100 bg-white text-brand-teal shadow-sm" aria-label="Previous question">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-teal text-white shadow-sm" aria-label="Next question">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <Button onClick={handleDone} disabled={submitting} className="rounded-full bg-brand-gold px-12 text-white hover:bg-brand-gold/90">
          {submitting ? "Submitting..." : "Done"}
        </Button>
      </div>
    </section>
  );
}
