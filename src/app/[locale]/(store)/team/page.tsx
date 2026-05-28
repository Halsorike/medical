import { Link } from "@/navigation";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { TeamCard } from "@/components/store/team-card";
import { doctors } from "@/data/team";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the Jordan Hearing & Speech Therapy clinical team.",
  openGraph: {
    title: "Our Team | Jordan Hearing & Speech Therapy",
    description: "Meet our hearing, speech, and occupational therapy specialists.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/team",
  },
};

export default function TeamPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-gradient pb-16 pt-12 text-white">
        <div className="container text-center">
          <h1 className="text-[38px] font-semibold">Our Team</h1>
          <p className="mx-auto mt-4 max-w-2xl text-[18px] font-light leading-8 text-white/85">
            Our collaborative team of dedicated professionals is committed to enhancing the lives of our clients with a personalized and evidence-based approach.
          </p>
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
            <h2 className="gradient-text text-[30px] font-semibold">Our Main Team</h2>
            <p className="mx-auto mt-4 max-w-3xl text-[18px] font-light leading-8 text-[#42526b]">
              Six real specialists covering hearing care, speech therapy, pediatric audiology, hearing aids, and occupational therapy.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <TeamCard key={doctor.slug} doctor={doctor} locale={locale} />
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Button asChild variant="gradient">
              <Link href="/book-appointment">Book Appointment</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
