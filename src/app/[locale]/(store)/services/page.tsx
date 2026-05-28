"use client";

import { Link } from "@/navigation";
import { useLocale } from "next-intl";
import { Activity, Brain, ChevronRight, Ear, MessageCircle, Puzzle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/store/hero-section";
import { Testimonials } from "@/components/store/testimonials";

const services = [
  {
    icon: Ear,
    title: "Audiology",
    titleAr: "السمعيات",
    description: "Hearing tests, auditory processing guidance, and hearing-care recommendations for children and adults.",
    descriptionAr: "تقييمات سمعية وإرشاد سمعي وتوصيات مناسبة للأطفال والبالغين.",
  },
  {
    icon: MessageCircle,
    title: "Speech Therapy",
    titleAr: "علاج النطق",
    description: "Support for speech delay, articulation, language development, fluency, and communication confidence.",
    descriptionAr: "دعم تأخر النطق، اللغة، الطلاقة، ومهارات التواصل بثقة.",
  },
  {
    icon: Activity,
    title: "Occupational Therapy",
    titleAr: "العلاج الوظيفي",
    description: "Sensory, motor, handwriting, feeding, and daily living skill development through practical therapy.",
    descriptionAr: "تنمية المهارات الحسية والحركية ومهارات الحياة اليومية من خلال علاج عملي.",
  },
  {
    icon: Brain,
    title: "Psychology",
    titleAr: "علم النفس",
    description: "Assessment and family-centered support for emotional, developmental, and learning needs.",
    descriptionAr: "تقييم ودعم نفسي للأسرة والطفل للاحتياجات النمائية والتعليمية والانفعالية.",
  },
  {
    icon: Puzzle,
    title: "Behavioral Support / ABA",
    titleAr: "الدعم السلوكي",
    description: "Behavioral support plans and practical parent coaching for daily routines and skill-building.",
    descriptionAr: "خطط دعم سلوكي وتدريب عملي للأهل لبناء المهارات اليومية.",
  },
];

function ServiceMiniCard({ item, locale }: { item: (typeof services)[number]; locale: string }) {
  const title = locale === "ar" ? item.titleAr : item.title;
  const description = locale === "ar" ? item.descriptionAr : item.description;

  return (
    <article className="figma-card flex items-start gap-4 p-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-gold text-white">
        <item.icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className="gradient-text text-[16px] font-semibold">{title}</h3>
        <p className="mt-2 text-[13px] leading-6 text-[#42526b]">{description}</p>
      </div>
    </article>
  );
}

export default function ServicesPage() {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <>
      <HeroSection
        title={isAr ? "خدماتنا" : "Our Services"}
        description={
          isAr
            ? "خدمات علاجية متكاملة في السمعيات، النطق، العلاج الوظيفي، علم النفس، والدعم السلوكي في مسقط."
            : "Integrated audiology, speech therapy, occupational therapy, psychology, and behavioral support in Muscat."
        }
        ctaLabel={isAr ? "احجز تقييم طفلك" : "Book Your Child's Assessment"}
      />

      <section className="figma-section bg-white">
        <div className="container grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-5 md:grid-cols-2">
            {services.slice(0, 3).map((service) => (
              <ServiceMiniCard key={service.title} item={service} locale={locale} />
            ))}
          </div>
          <div>
            <h2 className="gradient-text text-[30px] font-semibold">{isAr ? "رعاية متكاملة" : "Our Services"}</h2>
            <p className="mt-6 text-[20px] font-light leading-9 text-[#1e1e1e]">
              {isAr
                ? "ننسق بين التخصصات ليحصل الطفل والأسرة على خطة واضحة من التقييم إلى المتابعة."
                : "We coordinate across specialties so every child and family receives a clear path from assessment to therapy and follow-up."}
            </p>
            <Button asChild className="mt-8 rounded-full bg-brand-gold px-8 text-white hover:bg-brand-gold/90">
              <Link href="/book-appointment">{isAr ? "ابدأ الآن" : "All Services"}</Link>
            </Button>
          </div>
        </div>
      </section>

      {[
        { title: "Audiology and Hearing Care", items: services.slice(0, 3) },
        { title: "Speech and Communication", items: [services[1], services[3], services[4]] },
        { title: "Occupational and Behavioral Support", items: [services[2], services[3], services[4]] },
      ].map((section) => (
        <section key={section.title} className="figma-section bg-white even:bg-brand-50/60">
          <div className="container">
            <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="gradient-text text-[30px] font-semibold">{section.title}</h2>
                <p className="mt-3 max-w-2xl text-[17px] leading-7 text-[#42526b]">
                  Focused treatment cards built around assessment, family coaching, and measurable progress.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-100 bg-white text-brand-teal" aria-label="Previous">
                  <ChevronRight className="h-5 w-5 rotate-180" />
                </button>
                <button className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-teal text-white" aria-label="Next">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {section.items.map((item) => (
                <article key={`${section.title}-${item.title}`} className="figma-card p-7">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-teal">
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-[20px] font-semibold text-[#061c3d]">{item.title}</h3>
                  <p className="mt-4 text-[15px] leading-7 text-[#42526b]">{item.description}</p>
                  <Link href={`/book-appointment?service=${encodeURIComponent(item.title)}`} className="mt-6 inline-flex items-center text-sm font-semibold text-brand-teal">
                    Book service <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      <Testimonials />
    </>
  );
}
