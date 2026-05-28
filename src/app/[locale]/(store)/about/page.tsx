import { Link } from "@/navigation";
import type { Metadata } from "next";
import { Activity, Ear, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/store/hero-section";
import { TeamCard } from "@/components/store/team-card";
import { Testimonials } from "@/components/store/testimonials";
import { getApiData } from "@/lib/server-api";
import type { Doctor } from "@/types/doctor";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us | Echo Wellness Center",
  description:
    "Founded in Muscat, Oman, Echo Wellness Center provides multidisciplinary rehabilitation: audiology, speech therapy, occupational therapy, psychology and behavioral support.",
  openGraph: {
    title: "About Echo Wellness Center",
    description: "Multidisciplinary therapy and rehabilitation care in Muscat, Oman.",
    images: ["/og-image.jpg"],
  },
  alternates: { canonical: "/about" },
};

const copy = {
  en: {
    heroTitle: "Our Team",
    heroDesc:
      "Echo Wellness Center brings multidisciplinary therapy to families in Muscat with certified specialists in audiology, speech therapy, occupational therapy, psychology, and behavioral support.",
    teamTitle: "Our Specialists Team",
    teamDesc:
      "Our specialists collaborate across disciplines, building each treatment plan around clinical assessment, family goals, and measurable progress.",
    techTitle: "Latest Technology",
    techDesc:
      "We use carefully selected assessment and therapy tools to support accurate diagnosis, practical recommendations, and confident follow-up for every family.",
    advancedTitle: "Advanced Technologies",
    advancedDesc:
      "Integrated care means families can move from assessment to therapy with one coordinated team and a clear plan.",
  },
  ar: {
    heroTitle: "فريقنا",
    heroDesc:
      "يقدم مركز إيكو للعافية في مسقط رعاية متعددة التخصصات في السمعيات، علاج النطق، العلاج الوظيفي، علم النفس، والدعم السلوكي.",
    teamTitle: "فريق المتخصصين",
    teamDesc: "يتعاون أخصائيونا لبناء خطة علاجية واضحة مبنية على التقييم واحتياجات الأسرة وقياس التقدم.",
    techTitle: "أحدث التقنيات",
    techDesc: "نستخدم أدوات تقييم وعلاج مختارة بعناية لدعم التشخيص الدقيق والمتابعة الواضحة لكل أسرة.",
    advancedTitle: "تقنيات متقدمة",
    advancedDesc: "الرعاية المتكاملة تعني انتقال الأسرة من التقييم إلى العلاج مع فريق واحد وخطة واضحة.",
  },
} as const;

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  const c = copy[locale as "ar" | "en"] ?? copy.en;
  const doctors = (await getApiData<Doctor[]>("/api/doctors")) ?? [];

  return (
    <>
      <HeroSection title={c.heroTitle} description={c.heroDesc} ctaLabel={locale === "ar" ? "تواصل معنا" : "Contact Us"} ctaHref="/contact" />

      <section className="figma-section bg-white">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="gradient-text text-[30px] font-semibold">{c.teamTitle}</h2>
            <p className="mx-auto mt-4 max-w-3xl text-[18px] font-light leading-8 text-[#42526b]">{c.teamDesc}</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.slice(0, 3).map((doctor) => (
              <TeamCard key={doctor.slug} doctor={doctor} locale={locale} />
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Button asChild className="rounded-full bg-brand-gold px-9 text-white hover:bg-brand-gold/90">
              <Link href="/team">{locale === "ar" ? "كل الأخصائيين" : "All Doctors"}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="figma-section bg-brand-50/70">
        <div className="container grid items-center gap-12 md:grid-cols-2">
          <div className="overflow-hidden rounded-[24px] shadow-[0_11px_26px_rgba(6,28,61,0.1)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=760&h=520&fit=crop" alt="Therapy technology" className="h-[380px] w-full object-cover" />
          </div>
          <div>
            <h2 className="gradient-text mb-5 text-[30px] font-semibold">{c.techTitle}</h2>
            <p className="text-[20px] font-light leading-9 text-[#1e1e1e]">{c.techDesc}</p>
            <Button asChild className="mt-6 rounded-full bg-brand-gold px-8 text-white hover:bg-brand-gold/90">
              <Link href="/shop">Shop Now</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="figma-section bg-white">
        <div className="container grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="gradient-text text-[30px] font-semibold">{c.advancedTitle}</h2>
            <p className="mt-6 text-[20px] font-light leading-9 text-[#1e1e1e]">{c.advancedDesc}</p>
            <Button asChild className="mt-8 rounded-full bg-brand-gold px-8 text-white hover:bg-brand-gold/90">
              <Link href="/services">All Services</Link>
            </Button>
          </div>
          <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-1">
            {[
              { icon: Ear, title: "Audiology", desc: "Hearing tests, auditory guidance, and family-friendly recommendations." },
              { icon: MessageCircle, title: "Speech Therapy", desc: "Speech, language, fluency, and communication development support." },
              { icon: Activity, title: "Occupational Therapy", desc: "Sensory, motor, and daily living skill development." },
            ].map((item) => (
              <article key={item.title} className="figma-card flex items-start gap-4 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-gold text-white">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="gradient-text text-[16px] font-semibold">{item.title}</h3>
                  <p className="mt-2 text-[13px] leading-6 text-[#42526b]">{item.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
    </>
  );
}
