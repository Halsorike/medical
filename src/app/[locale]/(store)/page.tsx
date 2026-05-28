import { Link } from "@/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Activity, ChevronLeft, ChevronRight, Ear, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/store/blog-card";
import { HeroSection } from "@/components/store/hero-section";
import { TeamCard } from "@/components/store/team-card";
import { getApiData } from "@/lib/server-api";
import type { Doctor } from "@/types/doctor";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Echo Wellness Center | Audiology, Speech and OT in Muscat",
  description:
    "Echo Wellness Center in Sarooj, Muscat - hearing assessment, speech therapy, occupational therapy, psychology and behavioral support for children and adults in Oman.",
  openGraph: {
    title: "Echo Wellness Center",
    description:
      "Integrated speech, occupational, behavioral, psychology, and audiology care by certified specialists in Muscat.",
    images: ["/og-image.jpg"],
  },
  alternates: { canonical: "/" },
};

const blogs = [
  {
    id: 1,
    slug: "digital-thermometer",
    date: "29 July, 2024",
    title: "Latest insights in hearing care and family support",
    img: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=720&h=520&fit=crop",
  },
  {
    id: 2,
    slug: "read-blood-pressure-monitor-correctly",
    date: "29 July, 2024",
    title: "Speech therapy routines that help children progress",
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=720&h=520&fit=crop",
  },
  {
    id: 3,
    slug: "vitamins-101-right-supplement",
    date: "29 July, 2024",
    title: "Occupational therapy goals for confident daily living",
    img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=720&h=520&fit=crop",
  },
];

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale });
  const doctors = (await getApiData<Doctor[]>("/api/doctors")) ?? [];
  const previewDoctors = doctors.length ? doctors.slice(0, 3) : [];

  return (
    <>
      <HeroSection
        title={t("hero.title")}
        description={t("hero.subtitle")}
        ctaLabel={t("hero.cta")}
        imageAlt="Echo Wellness clinician"
      />

      <section className="figma-section bg-white">
        <div className="container grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="max-w-[520px]">
            <h2 className="gradient-text text-[30px] font-semibold">{t("services.heading")}</h2>
            <p className="mt-8 text-[20px] font-light leading-[1.8] text-[#1e1e1e]">{t("services.description")}</p>
            <Button asChild className="mt-9 rounded-full bg-brand-gold px-8 text-white hover:bg-brand-gold/90">
              <Link href="/services">{t("services.cta")}</Link>
            </Button>
          </div>

          <div className="relative min-h-[500px]">
            {[
              { icon: Ear, title: t("services.hearing.title"), desc: t("services.hearing.desc"), pos: "right-0 top-0" },
              { icon: MessageCircle, title: t("services.speech.title"), desc: t("services.speech.desc"), pos: "left-0 top-[176px]" },
              { icon: Activity, title: t("services.occupational.title"), desc: t("services.occupational.desc"), pos: "right-6 bottom-0" },
            ].map((service) => (
              <article key={service.title} className={`figma-card flex max-w-[320px] flex-col items-center p-6 text-center lg:absolute ${service.pos}`}>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-brand-gold text-white">
                  <service.icon className="h-5 w-5" />
                </div>
                <h3 className="gradient-text mb-3 text-[16px] font-semibold">{service.title}</h3>
                <p className="text-[12.5px] font-light leading-6 text-[#42526b]">{service.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="figma-section bg-white">
        <div className="container grid items-center gap-12 md:grid-cols-2">
          <div className="relative min-h-[390px]">
            <div className="absolute left-0 top-8 h-[230px] w-[230px] rounded-[28px] bg-brand-50 shadow-[0_11px_26px_rgba(6,28,61,0.06)]" />
            <div className="figma-card relative left-8 top-4 max-w-[420px] overflow-hidden">
              <div className="h-14 bg-brand-gradient" />
              <div className="p-6">
                <div className="mb-5 flex -space-x-3">
                  {previewDoctors.map((doctor) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={doctor.slug} src={doctor.image} alt={doctor.name} className="h-12 w-12 rounded-full border-2 border-white object-cover object-top" />
                  ))}
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-brand-50 text-xs font-semibold text-brand-blue">5</div>
                </div>
                <div className="h-3 w-44 rounded-full bg-brand-teal/25" />
                <div className="mt-3 h-3 w-32 rounded-full bg-brand-blue/20" />
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    ["5", "Specialists"],
                    ["5", "Services"],
                    ["1:1", "Care"],
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-[12px] bg-brand-50 p-4 text-center">
                      <p className="text-[16px] font-semibold text-brand-blue">{value}</p>
                      <p className="text-[10px] text-[#42526b]">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="gradient-text mb-6 text-[30px] font-semibold">{t("about.heading")}</h2>
            <p className="text-[20px] font-light leading-[1.75] text-[#1e1e1e]">{t("about.description")}</p>
            <Button asChild className="mt-8 rounded-full bg-brand-gold px-8 text-white hover:bg-brand-gold/90">
              <Link href="/contact">{t("about.cta")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="figma-section bg-white">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="gradient-text text-[30px] font-semibold">{t("team.heading")}</h2>
            <p className="mx-auto mt-4 max-w-[958px] text-[22px] font-light capitalize leading-[1.6] text-[#1e1e1e]">
              {t("team.description")}
            </p>
          </div>
          <div className="relative">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {previewDoctors.map((doctor) => (
                <TeamCard key={doctor.slug} doctor={doctor} locale={locale} />
              ))}
            </div>
            <div className="mt-10 flex justify-center gap-3">
              <button className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-100 bg-white text-brand-teal shadow-sm" aria-label="Previous team member">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-teal text-white shadow-sm" aria-label="Next team member">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="figma-section bg-white">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="gradient-text text-[30px] font-semibold">{t("blog.heading")}</h2>
            <p className="mx-auto mt-4 max-w-[958px] text-[22px] font-light capitalize leading-[1.6] text-[#1e1e1e]">
              {t("blog.description")}
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((post) => (
              <BlogCard key={post.slug} id={post.id} slug={post.slug} title={post.title} date={post.date} image={post.img} />
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Button asChild className="rounded-full bg-brand-gold px-9 text-white hover:bg-brand-gold/90">
              <Link href="/blog">{t("blog.cta")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
