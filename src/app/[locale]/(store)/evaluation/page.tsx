"use client";
import { useState } from "react";
import { Link } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const QUESTIONS = [
  "Do you have difficulty hearing in noisy environments?",
  "Do you often ask people to repeat themselves?",
  "Do you turn up the TV or radio louder than others prefer?",
  "Do you have ringing or buzzing in your ears?",
  "Do you miss parts of conversations?",
  "Do you have difficulty understanding speech on the phone?",
];

const QUESTIONS_AR = [
  "هل تجد صعوبة في السمع في البيئات الصاخبة؟",
  "هل تطلب كثيراً من الآخرين إعادة ما قالوه؟",
  "هل ترفع صوت التلفاز أو الراديو أكثر مما يفضّل الآخرون؟",
  "هل تسمع طنيناً أو أزيزاً في أذنيك؟",
  "هل تفوتك أجزاء من المحادثات؟",
  "هل تجد صعوبة في فهم الكلام عبر الهاتف؟",
];

const ANSWER_SCORES: Record<string, number> = {
  never: 0,
  rarely: 1,
  sometimes: 2,
  often: 3,
  always: 4,
};

const ANSWERS_AR: Record<string, number> = {
  "أبداً": 0,
  "نادراً": 1,
  "أحياناً": 2,
  "غالباً": 3,
  "دائماً": 4,
};

const ANSWER_LABELS = {
  never: "Never",
  rarely: "Rarely",
  sometimes: "Sometimes",
  often: "Often",
  always: "Always",
};

type Result = {
  score: number;
  level: "normal" | "mild" | "moderate" | "significant";
  recommendation: string;
};

function getResult(score: number): Result {
  if (score <= 8) {
    return { score, level: "normal", recommendation: "Normal hearing ? no intervention needed" };
  }
  if (score <= 16) {
    return { score, level: "mild", recommendation: "Mild hearing difficulty ? recommend consultation" };
  }
  if (score <= 24) {
    return { score, level: "moderate", recommendation: "Moderate hearing loss ? recommend evaluation" };
  }
  return { score, level: "significant", recommendation: "Significant hearing loss ? urgent consultation recommended" };
}

const resultVariant: Record<Result["level"], "success" | "warning" | "info" | "destructive"> = {
  normal: "success",
  mild: "warning",
  moderate: "info",
  significant: "destructive",
};

export default function EvaluationPage() {
  const locale = useLocale();
  const t = useTranslations("evaluation");
  const questionsDisplay = locale === "ar" ? QUESTIONS_AR : QUESTIONS;
  const answersDisplay = locale === "ar" ? ANSWERS_AR : ANSWER_SCORES;
  const answerEntries = Object.entries(answersDisplay);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [personalInfo, setPersonalInfo] = useState({ name: "", age: "", email: "", phone: "" });
  const [result, setResult] = useState<Result | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const answeredCount = Object.keys(answers).length;
  const progressWidth = ["w-0", "w-1/6", "w-2/6", "w-3/6", "w-4/6", "w-5/6", "w-full"][answeredCount] ?? "w-0";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (answeredCount < questionsDisplay.length) {
      toast.error("Please answer all hearing questions before submitting.");
      return;
    }

    const score = Object.values(answers).reduce((total, answer) => total + (answersDisplay[answer] ?? 0), 0);
    const nextResult = getResult(score);
    setSubmitting(true);
    const response = await fetch("/api/evaluations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientName: personalInfo.name,
        age: personalInfo.age,
        email: personalInfo.email,
        phone: personalInfo.phone,
        answers,
        score,
      }),
    });
    setSubmitting(false);

    if (!response.ok) {
      toast.error("Evaluation submission failed. Please try again.");
      return;
    }

    setResult(nextResult);
    toast.success("Evaluation submitted successfully! We will contact you with results.");
  }

  function resetEvaluation() {
    setAnswers({});
    setPersonalInfo({ name: "", age: "", email: "", phone: "" });
    setResult(null);
  }

  return (
    <>
      <h1 className="sr-only">Online Hearing Evaluation</h1>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-gradient pb-16 pt-12 text-white">
        <div className="container text-center">
          <h1 className="text-3xl font-bold">{t("heading")}</h1>
          <p className="mt-3 max-w-xl mx-auto text-white/85 leading-relaxed">
            {t("subtext")}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg viewBox="0 0 1440 60" className="w-full fill-white">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      <div className="container py-12">
        {result ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-brand-100 bg-white p-12 text-center shadow-sm">
            <Badge variant={resultVariant[result.level]} className="mb-4 capitalize">{result.level}</Badge>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <span className="text-3xl">?</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Your Evaluation Results</h2>
            <p className="mt-3 text-3xl font-bold text-brand-blue">{result.score}/24</p>
            <p className="mt-3 text-muted-foreground">
              {result.level === "normal"
                ? t("resultNormal")
                : result.level === "mild"
                  ? t("resultMild")
                  : result.level === "moderate"
                    ? t("resultModerate")
                    : t("resultSevere")}
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/book-appointment">
                <Button variant="gradient" className="rounded-full px-8">{t("bookNow")}</Button>
              </Link>
              <Button variant="outline" className="rounded-full px-8" onClick={resetEvaluation}>
                Retake Evaluation
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-8">
            {/* Personal info */}
            <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
              <h3 className="mb-5 font-semibold text-gray-800">Personal Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Name*</label>
                  <Input
                    value={personalInfo.name}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                    className="rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Age*</label>
                  <Input
                    type="number"
                    min={1}
                    max={120}
                    value={personalInfo.age}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, age: e.target.value })}
                    className="rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Email*</label>
                  <Input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                    className="rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone*</label>
                  <Input
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                    className="rounded-lg"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Questionnaire */}
            <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <h3 className="font-semibold text-gray-800">Hearing Self-Assessment</h3>
                  <span className="text-muted-foreground">Question {Math.min(answeredCount + 1, questionsDisplay.length)} of {questionsDisplay.length}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-brand-100">
                  <div className={`h-full rounded-full bg-brand-gradient transition-all ${progressWidth}`} />
                </div>
              </div>
              <div className="space-y-5">
                {questionsDisplay.map((q, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-blue">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="mb-2 text-sm text-gray-700">{q}</p>
                      <Select
                        value={answers[i] ?? ""}
                        onValueChange={(v) => setAnswers({ ...answers, [i]: v })}
                        required
                      >
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Select your answer" />
                        </SelectTrigger>
                        <SelectContent>
                          {answerEntries.map(([answer]) => (
                            <SelectItem key={answer} value={answer}>
                              {locale === "ar" ? answer : ANSWER_LABELS[answer as keyof typeof ANSWER_LABELS]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <Button type="submit" variant="gradient" className="rounded-full px-12 py-3 text-base font-semibold" disabled={submitting}>
                {submitting ? "Submitting..." : t("submit")}
              </Button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
