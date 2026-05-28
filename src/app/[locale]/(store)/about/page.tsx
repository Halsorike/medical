import { Link } from "@/navigation";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { TeamCard } from "@/components/store/team-card";
import { getApiData } from "@/lib/server-api";
import type { Doctor } from "@/types/doctor";

export const dynamic = "force-dynamic";

const CONTENT = {
  ar: {
    heading: "من نحن",
    mission: "تأسس مركزنا عام ٢٠١٠ بهدف واحد: تقديم رعاية سمعية ونطقية ووظيفية من أعلى مستوى لكل أسرة في الأردن. نعمل مع الأطفال من عمر الولادة، والبالغين في كل مرحلة من مراحل الحياة.",
    vision: "رؤيتنا عالم يستطيع فيه كل شخص أن يسمع بوضوح ويتحدث بثقة ويشارك بفاعلية في الحياة اليومية.",
    stats: [
      { label: "مريض تمت معالجته", value: "٥٠٠٠+" },
      { label: "سنوات خبرة", value: "١٤+" },
      { label: "متخصص معتمد", value: "١٢" },
      { label: "نسبة رضا المرضى", value: "٩٨٪" },
    ],
    teamHeading: "فريقنا من المتخصصين",
    teamDesc: "فريقنا من أخصائيي السمع والنطق والعلاج الوظيفي يعمل على دعم التواصل والمهارات الحسية والحركية لكل مريض.",
    techHeading: "أحدث التقنيات",
    techDesc: "نستخدم أحدث الأجهزة التشخيصية والعلاجية المعتمدة دولياً لضمان أفضل النتائج لمرضانا.",
    testimonialsHeading: "آراء مرضانا",
    testimonials: [
      { name: "أم أحمد", text: "بعد جلسات النطق، بدأ ابني يتكلم بشكل واضح. الفريق رائع ومتفانٍ.", role: "والدة مريض" },
      { name: "عبدالله م.", text: "الأجهزة ممتازة والأطباء محترفون جداً. أنصح كل من يعاني من مشكلة سمع بزيارة المركز.", role: "مريض بالغ" },
      { name: "سمر خ.", text: "ابنتي تحسنت كثيراً في العلاج الوظيفي. الحمد لله على هذا المركز.", role: "والدة مريضة" },
    ],
  },
  en: {
    heading: "About Us",
    mission: "Echo Wellness Center brings multidisciplinary therapy to families in Muscat, Oman, with certified specialists in audiology, speech therapy, occupational therapy, psychology, and behavioral support.",
    vision: "Our vision is to empower every child and adult to communicate, participate, and thrive with confidence.",
    stats: [
      { label: "Certified Specialists", value: "5" },
      { label: "Specialties", value: "5" },
      { label: "Care Model", value: "1:1" },
      { label: "Location", value: "Muscat" },
    ],
    teamHeading: "Our Specialists Team",
    teamDesc: "Our team of audiologists, speech therapists, and occupational therapists supports communication, sensory, and motor skills for every patient.",
    techHeading: "Latest Technology",
    techDesc: "We use the latest internationally certified diagnostic and therapeutic equipment to ensure the best outcomes for our patients.",
    testimonialsHeading: "Real Stories from Satisfied Customers",
    testimonials: [
      { name: "Ahmad's Mother", text: "After speech sessions, my son started speaking clearly. The team is wonderful and dedicated.", role: "Patient Parent" },
      { name: "Abdullah M.", text: "Excellent equipment and very professional doctors. I recommend the center to anyone with hearing issues.", role: "Adult Patient" },
      { name: "Samar K.", text: "My daughter improved so much in occupational therapy. Thank God for this center.", role: "Patient Parent" },
    ],
  },
} as const;

export const metadata: Metadata = {
  title: "About Us | Echo Wellness Center",
  description:
    "Founded in Muscat, Oman, Echo Wellness Center provides multidisciplinary rehabilitation: audiology, speech therapy, occupational therapy, psychology and behavioral support.",
  openGraph: {
    title: "About Echo Wellness Center",
    description: "Multidisciplinary therapy and rehabilitation care in Muscat, Oman.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/about",
  },
};

export default async function AboutPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const c = CONTENT[locale as "ar" | "en"] ?? CONTENT.ar;
  const doctors = await getApiData<Doctor[]>("/api/doctors") ?? [];

  return (
    <>
      <section className="relative overflow-hidden bg-brand-gradient pb-16 pt-12 text-white">
        <div className="container grid items-center gap-8 md:grid-cols-2">
          <div>
            <h1 className="text-[38px] font-semibold leading-tight">{c.heading}</h1>
            <p className="mt-4 text-[18px] font-light leading-8 text-white/90">
              {c.mission}
            </p>
            <p className="mt-3 text-[16px] font-light leading-7 text-white/80">
              {c.vision}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {c.stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-xs text-white/80">{stat.label}</p>
                </div>
              ))}
            </div>
            <Button asChild variant="gradient" className="mt-6">
              <Link href="/team">All Doctors</Link>
            </Button>
          </div>
          <div className="hidden md:flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=400&fit=crop"
              alt="Echo Wellness team"
              className="rounded-[26px] object-cover shadow-2xl"
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg viewBox="0 0 1440 60" className="w-full fill-white">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="gradient-text text-[30px] font-semibold">{c.teamHeading}</h2>
            <p className="mx-auto mt-4 max-w-3xl text-[18px] font-light leading-8 text-[#42526b]">
              {c.teamDesc}
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.slice(0, 3).map((doctor) => (
              <TeamCard key={doctor.slug} doctor={doctor} locale={locale} />
            ))}
          </div>
          <div className="mt-12 flex justify-center gap-4">
            <Button asChild variant="outline" className="rounded-full border-[#0099A8] px-8 text-[#0099A8]">
              <Link href="/team">More Detail</Link>
            </Button>
            <Button asChild variant="gradient">
              <Link href="/team">All Doctors</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-[rgba(0,153,168,0.06)] py-20">
        <div className="container grid items-center gap-10 md:grid-cols-2">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop"
              alt="Clinic technology"
              className="rounded-[24px] shadow-[0_11px_26px_rgba(6,28,61,0.1)]"
            />
          </div>
          <div>
            <h2 className="gradient-text mb-5 text-[30px] font-semibold">{c.techHeading}</h2>
            <p className="text-[20px] font-light leading-9 text-[#1e1e1e]">
              {c.techDesc}
            </p>
            <Button asChild variant="gradient" className="mt-6">
              <Link href="/shop">Shop Now</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="gradient-text text-[30px] font-semibold">{c.testimonialsHeading}</h2>
            <p className="mt-3 text-[18px] font-light text-[#42526b]">Get inspired by these stories.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {c.testimonials.map((testimonial) => (
              <article key={testimonial.name} className="rounded-[20px] bg-white p-6 shadow-[0_11px_26px_rgba(6,28,61,0.1)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-button-gradient text-lg font-bold text-white">
                  {testimonial.name[0]}
                </div>
                <p className="text-sm leading-7 text-[#42526b]">{testimonial.text}</p>
                <p className="mt-4 font-semibold text-[#061c3d]">{testimonial.name}</p>
                <p className="text-xs text-muted-foreground">{testimonial.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
