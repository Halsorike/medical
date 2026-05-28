import { Link } from "@/navigation";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

type HeroSectionProps = {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageSrc?: string;
  imageAlt?: string;
};

const defaultImage =
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=520&h=720&fit=crop";

export function HeroSection({
  title,
  description,
  ctaLabel = "Book Appointment",
  ctaHref = "/book-appointment",
  imageSrc = defaultImage,
  imageAlt = "Echo Wellness specialist",
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[620px] overflow-hidden bg-figma-hero-gradient pb-28 pt-12 text-white md:pt-16 lg:min-h-[760px]">
      <div className="container relative z-10 grid min-h-[500px] items-center gap-10 lg:grid-cols-[1fr_430px]">
        <div className="max-w-[768px] rounded-[20px] bg-white/25 px-6 py-8 shadow-[0_24px_60px_rgba(6,28,61,0.12)] backdrop-blur-[6px] md:px-12 md:py-10">
          <h1 className="text-[30px] font-semibold leading-[1.35] md:text-[34px]">{title}</h1>
          <p className="mt-6 max-w-[690px] text-[18px] font-light leading-[1.7] text-white/88 md:text-[20px]">
            {description}
          </p>
          <Button asChild className="mt-8 rounded-full bg-brand-gold px-8 text-white shadow-[0_12px_20px_rgba(245,166,35,0.28)] hover:bg-brand-gold/90">
            <Link href={ctaHref}>
              <CalendarDays className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
              {ctaLabel}
            </Link>
          </Button>
        </div>

        <div className="relative hidden justify-center lg:flex">
          <div className="absolute right-8 top-10 h-24 w-24 rotate-45 rounded-[12px] border-2 border-white/35" />
          <div className="absolute -left-8 bottom-16 h-36 w-36 rotate-45 rounded-[18px] border-2 border-white/25" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={imageAlt}
            className="relative z-10 h-[560px] w-[374px] rounded-[28px] object-cover object-top shadow-2xl"
          />
        </div>
      </div>
      <div className="figma-wave-bottom">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path fill="#fff" d="M0,76 C235,26 418,112 682,75 C947,38 1150,1 1440,54 L1440,120 L0,120 Z" />
        </svg>
      </div>
    </section>
  );
}
