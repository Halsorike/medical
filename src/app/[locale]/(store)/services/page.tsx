"use client";

import { Link } from "@/navigation";
import { useState } from "react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Ear, MessageCircle, BriefcaseMedical, Brain, Eye, Activity } from "lucide-react";

const SERVICES = [
  {
    icon: Ear,
    title: "Hearing Evaluation",
    description:
      "Comprehensive audiological assessments using state-of-the-art equipment to accurately measure hearing levels and diagnose hearing disorders across all age groups.",
  },
  {
    icon: MessageCircle,
    title: "Speech Therapy",
    description:
      "Specialized therapy for individuals with speech, language, and communication disorders ? from articulation and fluency challenges to language delays.",
  },
  {
    icon: BriefcaseMedical,
    title: "Occupational Therapy",
    description:
      "Evidence-based occupational therapy that helps patients develop the skills needed for daily activities, improving independence and quality of life.",
  },
  {
    icon: Brain,
    title: "Auditory Processing",
    description:
      "Assessment and treatment of auditory processing disorders, helping patients interpret sounds more effectively in everyday environments.",
  },
  {
    icon: Eye,
    title: "Hearing Aid Fitting",
    description:
      "Professional fitting, calibration and follow-up for hearing aids from leading manufacturers, tailored to each patient's hearing profile.",
  },
  {
    icon: Activity,
    title: "Hearing Rehabilitation",
    description:
      "Structured rehabilitation programs for patients post-cochlear implant surgery or after significant hearing loss, maximizing outcomes.",
  },
];

const SERVICES_AR = [
  {
    icon: Ear,
    title: "تقييم السمع",
    description: "تقييمات سمعية شاملة باستخدام أحدث الأجهزة لقياس مستويات السمع بدقة وتشخيص اضطرابات السمع لجميع الأعمار.",
  },
  {
    icon: MessageCircle,
    title: "علاج النطق",
    description: "علاج متخصص للأفراد الذين يعانون من اضطرابات الكلام واللغة والتواصل — من مشكلات النطق والطلاقة إلى تأخر اللغة.",
  },
  {
    icon: BriefcaseMedical,
    title: "العلاج الوظيفي",
    description: "برامج علاج وظيفي شاملة تساعد الأطفال والبالغين على تطوير مهاراتهم الحسية والحركية ومهارات الحياة اليومية.",
  },
  {
    icon: Brain,
    title: "اضطرابات المعالجة السمعية",
    description: "تشخيص وعلاج متخصص لاضطرابات المعالجة السمعية المركزية التي تؤثر على الفهم في البيئات الصاخبة.",
  },
  {
    icon: Eye,
    title: "تركيب أجهزة السمع",
    description: "اختيار وتركيب وضبط أجهزة السمع المناسبة لكل مريض من قِبل متخصصين معتمدين.",
  },
  {
    icon: Activity,
    title: "إعادة التأهيل السمعي",
    description: "برامج إعادة تأهيل سمعي شاملة تشمل التدريب على الاستماع وتحسين التواصل بعد تركيب الأجهزة.",
  },
];

const SERVICE_DETAILS: Record<string, { department: string; duration: string; fullDescription: string }> = {
  "Hearing Evaluation": {
    department: "Audiology",
    duration: "45-60 minutes",
    fullDescription: "Includes pure tone testing, speech understanding review, middle-ear screening, and a personalized next-step plan.",
  },
  "Speech Therapy": {
    department: "Speech Therapy",
    duration: "45-60 minutes",
    fullDescription: "Sessions may include articulation practice, language development, fluency support, and home exercises.",
  },
  "Occupational Therapy": {
    department: "Occupational Therapy",
    duration: "45-60 minutes",
    fullDescription: "Therapy focuses on sensory regulation, motor planning, daily living routines, and independence skills.",
  },
  "Auditory Processing": {
    department: "Audiology",
    duration: "45-60 minutes",
    fullDescription: "Our specialists assess listening challenges and build practical strategies for school, work, and noisy environments.",
  },
  "Hearing Aid Fitting": {
    department: "Hearing Aid Fitting",
    duration: "45-60 minutes",
    fullDescription: "Includes device selection, ear-fit review, programming, comfort checks, and follow-up adjustments.",
  },
  "Hearing Rehabilitation": {
    department: "Audiology",
    duration: "45-60 minutes",
    fullDescription: "Rehabilitation combines listening exercises, communication strategies, family coaching, and progress tracking.",
  },
};

export default function ServicesPage() {
  const locale = useLocale();
  const [expanded, setExpanded] = useState<string | null>(null);
  const servicesDisplay = locale === "ar" ? SERVICES_AR : SERVICES;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-gradient pb-16 pt-12 text-white">
        <div className="container">
          <h1 className="text-3xl font-bold md:text-4xl">Our Services</h1>
          <p className="mt-3 max-w-xl text-white/85 leading-relaxed">
            We provide a comprehensive range of specialized services in audiology, speech therapy, and occupational therapy, designed to improve quality of life at every stage.
          </p>
          <Link href="/book-appointment" className="mt-6 inline-block">
            <Button className="rounded-full bg-white text-brand-blue font-semibold px-8 hover:bg-white/90">
              Book Appointment -&gt;
            </Button>
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg viewBox="0 0 1440 60" className="w-full fill-white">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {servicesDisplay.map((s, index) => {
            const sourceTitle = SERVICES[index]?.title ?? s.title;
            const detail = SERVICE_DETAILS[sourceTitle];

            return (
            <div key={s.title} className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50">
                <s.icon className="h-6 w-6 text-brand-teal" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-800">{s.title}</h3>
              <div className="mb-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-brand-blue">{detail.department}</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">{detail.duration}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              {expanded === sourceTitle && (
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{detail.fullDescription}</p>
              )}
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => setExpanded((current) => (current === sourceTitle ? null : sourceTitle))}
                >
                  {expanded === sourceTitle ? "Show Less" : "Learn More"}
                </Button>
                <Link href={`/book-appointment?service=${encodeURIComponent(sourceTitle)}`}>
                  <Button variant="gradient" size="sm" className="w-full rounded-full sm:w-auto">
                    Book This Service
                  </Button>
                </Link>
              </div>
            </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-50/60 py-16">
        <div className="container text-center">
          <h2 className="text-2xl font-bold">Ready to get started?</h2>
          <p className="mt-2 text-muted-foreground">Book an appointment with one of our specialists today.</p>
          <Link href="/book-appointment" className="mt-6 inline-block">
            <Button variant="gradient" className="rounded-full px-10">Book Appointment</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
