import type { Metadata } from "next";
import { HeroSection } from "@/components/store/hero-section";
import { TeamCard } from "@/components/store/team-card";
import { Testimonials } from "@/components/store/testimonials";
import { getApiData } from "@/lib/server-api";
import type { Doctor } from "@/types/doctor";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Team | Echo Wellness Center Muscat",
  description:
    "Meet our audiologists, speech therapists, occupational therapists, psychologists, and behavioral specialists at Echo Wellness Center in Muscat, Oman.",
  openGraph: {
    title: "Our Team | Echo Wellness Center Muscat",
    description: "Meet our certified multidisciplinary therapy team in Muscat, Oman.",
    images: ["/og-image.jpg"],
  },
  alternates: { canonical: "/team" },
};

export default async function TeamPage({ params: { locale } }: { params: { locale: string } }) {
  const doctors = (await getApiData<Doctor[]>("/api/doctors")) ?? [];
  const rows = doctors.length >= 6 ? doctors.slice(0, 6) : [...doctors, ...doctors].slice(0, Math.max(3, Math.min(6, doctors.length * 2)));

  return (
    <>
      <HeroSection
        title={locale === "ar" ? "فريقنا" : "Our Team"}
        description={
          locale === "ar"
            ? "فريق متعدد التخصصات يساعد الأطفال والأسر على تحقيق تقدم واضح في التواصل والمهارات اليومية."
            : "A multidisciplinary team helping children and families make meaningful progress in communication, learning, behavior, and daily skills."
        }
        ctaLabel={locale === "ar" ? "احجز تقييم طفلك" : "Book Your Child's Assessment"}
      />

      <section className="figma-section bg-white">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="gradient-text text-[30px] font-semibold">{locale === "ar" ? "فريق الخبراء" : "Our Expert Team"}</h2>
            <p className="mx-auto mt-4 max-w-3xl text-[18px] font-light leading-8 text-[#42526b]">
              {locale === "ar"
                ? "أخصائيون معتمدون في السمعيات، علاج النطق، العلاج الوظيفي، علم النفس، والدعم السلوكي."
                : "Certified specialists in audiology, speech therapy, occupational therapy, psychology, and behavioral support."}
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((doctor, index) => (
              <TeamCard key={`${doctor.slug}-${index}`} doctor={doctor} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
    </>
  );
}
