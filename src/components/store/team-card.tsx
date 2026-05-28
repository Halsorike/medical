import { Link } from "@/navigation";
import { CalendarDays, Facebook, Instagram, Phone, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Doctor } from "@/types/doctor";

type TeamCardProps = {
  doctor: Doctor;
  locale?: string;
};

export function TeamCard({ doctor, locale = "en" }: TeamCardProps) {
  const doctorName = locale === "ar" && doctor.nameAr ? doctor.nameAr : doctor.name;
  const doctorTitle = locale === "ar" && doctor.titleAr ? doctor.titleAr : doctor.title;
  const years = doctor.experience ?? 5;

  return (
    <article className="figma-card group mx-auto flex min-h-[520px] w-full max-w-[370px] flex-col overflow-hidden p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(6,28,61,0.14)]">
      <div className="relative overflow-hidden rounded-[18px] border border-brand-teal/15 bg-brand-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={doctor.image} alt={doctorName} className="h-[310px] w-full object-cover object-top" />
        <div className="absolute left-4 top-4 rounded-[14px] bg-white/90 px-3 py-2 text-brand-teal shadow-sm backdrop-blur">
          <p className="text-[13px] font-semibold">{years} Years</p>
          <p className="text-[10px] font-light">Experience</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[18px] font-semibold text-[#061c3d]">{doctorName}</h3>
            <p className="gradient-text mt-1 text-[14px] font-medium">{doctorTitle}</p>
          </div>
          <div className="flex gap-2 text-brand-teal">
            <a className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 transition hover:bg-brand-teal hover:text-white" href={doctor.socials.facebook} aria-label={`${doctorName} Facebook`}>
              <Facebook className="h-4 w-4" />
            </a>
            <a className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 transition hover:bg-brand-teal hover:text-white" href={doctor.socials.instagram} aria-label={`${doctorName} Instagram`}>
              <Instagram className="h-4 w-4" />
            </a>
            <a className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 transition hover:bg-brand-teal hover:text-white" href={doctor.socials.twitter} aria-label={`${doctorName} Twitter`}>
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="my-5 h-px bg-brand-100" />

        <div className="mt-auto flex items-center justify-between gap-3">
          <Button asChild className="rounded-full bg-brand-teal px-5 text-white hover:bg-brand-blue">
            <Link href={`/book-appointment?doctor=${encodeURIComponent(doctorName)}`}>About Doctor</Link>
          </Button>
          <div className="flex gap-2 text-brand-teal">
            <Link href="/contact" aria-label="Call clinic" className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-100 hover:bg-brand-50">
              <Phone className="h-4 w-4" />
            </Link>
            <Link href={`/book-appointment?doctor=${encodeURIComponent(doctorName)}`} aria-label="Book appointment" className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-100 hover:bg-brand-50">
              <CalendarDays className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
