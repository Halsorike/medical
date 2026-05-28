import { Link } from "@/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Activity, Ear, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BlogCard } from "@/components/store/blog-card";
import { TeamCard } from "@/components/store/team-card";
import { getApiData } from "@/lib/server-api";
import type { Doctor } from "@/types/doctor";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home",
  description: "Professional hearing, speech, and occupational therapy services in Jordan.",
  openGraph: {
    title: "Jordan Hearing & Speech Therapy",
    description: "Professional hearing, speech, and occupational therapy services in Jordan.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/",
  },
};


const BLOGS = [
  {
    id: 1,
    slug: "digital-thermometer",
    date: "29 July, 2024",
    title: "Latest insights in hearing care and family support",
    img: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=360&h=360&fit=crop",
  },
  {
    id: 2,
    slug: "read-blood-pressure-monitor-correctly",
    date: "29 July, 2024",
    title: "Speech therapy routines that help children progress",
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=360&h=360&fit=crop",
  },
  {
    id: 3,
    slug: "vitamins-101-right-supplement",
    date: "29 July, 2024",
    title: "Occupational therapy goals for confident daily living",
    img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=360&h=360&fit=crop",
  },
];

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale });
  const doctors = await getApiData<Doctor[]>("/api/doctors") ?? [];

  return (
    <>
      <section className="relative min-h-[760px] overflow-hidden bg-brand-gradient pb-24 pt-16 text-white lg:min-h-[932px]">
        <div className="container relative z-10 grid min-h-[640px] items-center gap-12 lg:grid-cols-[1fr_520px]">
          <div className="max-w-[620px] rounded-[20px] bg-white/35 p-10 shadow-[0_24px_60px_rgba(6,28,61,0.12)] backdrop-blur-md">
            <h1 className="text-[30px] font-semibold leading-[1.35] text-white">
              {t("hero.title")}
            </h1>
            <p className="mt-6 text-[20px] font-light leading-[1.65] text-white/80">
              {t("hero.subtitle")}
            </p>
            <Button asChild variant="gradient" className="mt-8 gap-2">
              <Link href="/book-appointment">{t("hero.cta")} <span aria-hidden="true">-&gt;</span></Link>
            </Button>
          </div>
          <div className="relative flex justify-center">
            <div className="absolute right-8 top-10 h-24 w-24 rotate-45 border-2 border-white/40" />
            <div className="absolute bottom-16 right-0 h-36 w-36 rotate-45 border-2 border-white/30" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=408&h=612&fit=crop"
              alt="Doctor"
              className="relative z-10 h-[520px] w-[346px] rounded-[26px] object-cover object-top shadow-2xl lg:h-[612px] lg:w-[408px]"
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg viewBox="0 0 1440 80" className="w-full fill-white">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* -- SERVICES ------------------------------------------------------- */}
      <section className="bg-white py-20 lg:min-h-[615px]">
        <div className="container grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
          {/* LEFT: text + CTA */}
          <div className="max-w-[520px]">
            <h2 className="gradient-text text-[30px] font-semibold">{t("services.heading")}</h2>
            <p className="mt-8 text-[20px] font-light leading-[1.8] text-[#1e1e1e]">
              {t("services.description")}
            </p>
            <Button asChild variant="gradient" className="mt-9">
              <Link href="/services">{t("services.cta")}</Link>
            </Button>
          </div>

          {/* RIGHT: 3 staggered white cards — exact Figma layout */}
          <div className="relative flex flex-col gap-6 lg:block lg:min-h-[480px]">
            {/* Card 1 — top-right */}
            <article className="flex max-w-[300px] flex-col items-center rounded-[12px] bg-white p-5 text-center shadow-[0_11px_26px_rgba(6,28,61,0.1)] lg:absolute lg:right-0 lg:top-0 lg:w-[296px]">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-button-gradient text-white">
                <Ear className="h-5 w-5" />
              </div>
              <h3 className="gradient-text mb-2 text-[16px] font-semibold">{t("services.hearing.title")}</h3>
              <p className="text-[12px] font-light leading-5 text-[#42526b]">{t("services.hearing.desc")}</p>
            </article>

            {/* Card 2 — middle-left */}
            <article className="flex max-w-[300px] flex-col items-center rounded-[12px] bg-white p-5 text-center shadow-[0_11px_26px_rgba(6,28,61,0.1)] lg:absolute lg:left-0 lg:top-[170px] lg:w-[296px]">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-button-gradient text-white">
                <MessageCircle className="h-5 w-5" />
              </div>
              <h3 className="gradient-text mb-2 text-[16px] font-semibold">{t("services.speech.title")}</h3>
              <p className="text-[12px] font-light leading-5 text-[#42526b]">{t("services.speech.desc")}</p>
            </article>

            {/* Card 3 — bottom-right */}
            <article className="flex max-w-[300px] flex-col items-center rounded-[12px] bg-white p-5 text-center shadow-[0_11px_26px_rgba(6,28,61,0.1)] lg:absolute lg:bottom-0 lg:right-0 lg:w-[296px]">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-button-gradient text-white">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="gradient-text mb-2 text-[16px] font-semibold">{t("services.occupational.title")}</h3>
              <p className="text-[12px] font-light leading-5 text-[#42526b]">{t("services.occupational.desc")}</p>
            </article>
          </div>
        </div>
      </section>

      {/* -- ABOUT US ------------------------------------------------------- */}
      <section className="bg-white py-20 lg:min-h-[500px]">
        <div className="container grid items-center gap-12 md:grid-cols-2">
          {/* LEFT: mock dashboard UI card — exact Figma layout */}
          <div className="relative flex items-center justify-center min-h-[380px]">
            {/* outer pink accent square */}
            <div className="absolute left-0 top-6 h-[220px] w-[220px] rounded-[28px] bg-[rgba(202,121,198,0.08)] shadow-[0_11px_26px_rgba(6,28,61,0.06)]" />
            {/* main dashboard card */}
            <div className="relative left-12 top-4 w-[300px] rounded-[20px] bg-white shadow-[0_18px_45px_rgba(6,28,61,0.12)] overflow-hidden">
              {/* pink header bar */}
              <div className="h-[52px] w-full bg-brand-gradient" />
              <div className="p-5">
                {/* patient avatar row */}
                <div className="mb-4 flex -space-x-3">
                  {doctors.slice(0, 4).map((doctor) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={doctor.slug} src={doctor.image} alt={doctor.name} className="h-10 w-10 rounded-full border-2 border-white object-cover object-top" />
                  ))}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#ca79c6]/20 text-[11px] font-semibold text-[#9b1fe1]">+6</div>
                </div>
                {/* skeleton lines */}
                <div className="h-2.5 w-40 rounded-full bg-[#ca79c6]/25" />
                <div className="mt-2.5 h-2.5 w-28 rounded-full bg-[#9b1fe1]/20" />
                {/* mini stats row */}
                <div className="mt-5 grid grid-cols-3 gap-2.5">
                  <div className="flex flex-col items-center justify-center h-[60px] rounded-[12px] bg-[#ca79c6]/10">
                    <p className="text-[13px] font-semibold text-[#9b1fe1]">142</p>
                    <p className="text-[9px] font-light text-[#42526b]">Patients</p>
                  </div>
                  <div className="flex flex-col items-center justify-center h-[60px] rounded-[12px] bg-[#9b1fe1]/10">
                    <p className="text-[13px] font-semibold text-[#9b1fe1]">98%</p>
                    <p className="text-[9px] font-light text-[#42526b]">Success</p>
                  </div>
                  <div className="flex flex-col items-center justify-center h-[60px] rounded-[12px] bg-[#8468f5]/10">
                    <p className="text-[13px] font-semibold text-[#8468f5]">5?</p>
                    <p className="text-[9px] font-light text-[#42526b]">Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: gradient title + mission text + CTA */}
          <div>
            <h2 className="gradient-text mb-6 text-[30px] font-semibold">{t("about.heading")}</h2>
            <p className="text-[20px] font-light leading-[1.75] text-[#1e1e1e]">
              {t("about.description")}
            </p>
            <Button asChild variant="gradient" className="mt-8">
              <Link href="/contact">{t("about.cta")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:min-h-[860px]">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="gradient-text text-[30px] font-semibold">{t("team.heading")}</h2>
            <p className="mx-auto mt-4 max-w-[958px] text-[24px] font-light capitalize leading-[1.6] text-[#1e1e1e]">
              {t("team.description")}
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.slice(0, 3).map((doctor) => (
              <TeamCard key={doctor.slug} doctor={doctor} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:min-h-[892px]">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="gradient-text text-[30px] font-semibold">{t("blog.heading")}</h2>
            <p className="mx-auto mt-4 max-w-[958px] text-[24px] font-light capitalize leading-[1.6] text-[#1e1e1e]">
              {t("blog.description")}
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {BLOGS.map((post) => (
              <BlogCard key={post.slug} id={post.id} slug={post.slug} title={post.title} date={post.date} image={post.img} />
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Button asChild variant="gradient">
              <Link href="/blog">{t("blog.cta")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:min-h-[429px]">
        <div className="container">
          <div className="mx-auto flex max-w-5xl flex-col items-center rounded-[20px] bg-[rgba(255,53,245,0.04)] px-6 py-12 text-center">
            <h2 className="gradient-text text-[30px] font-semibold">{t("subscribe.heading")}</h2>
            <p className="mt-3 text-[20px] font-light text-[#1e1e1e]">{t("subscribe.subtext")}</p>
            <form className="mt-8 flex w-full max-w-[590px] flex-col gap-3 rounded-[20px] bg-white p-2 shadow-sm sm:flex-row">
              <Input type="email" placeholder={t("subscribe.placeholder")} className="h-[60px] flex-1 rounded-[20px] border-white px-5 text-[15px]" />
              <Button type="submit" variant="gradient" className="h-[60px] gap-2">
                {t("subscribe.cta")}
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
