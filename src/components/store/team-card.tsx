import { Link } from "@/navigation";
import { Briefcase, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Doctor } from "@/data/team";

type TeamCardProps = {
  doctor: Doctor;
  locale?: string;
};

/**
 * Matches Figma node 2:28113 exactly:
 * - rounded-top card (rounded-tl/tr ~42px, rounded-bl/br ~8px)
 * - outer shadow: -7px 4.6px 4.6px rgba(236,180,233,0.2)
 * - inner photo card: shadow 0 0 21px rgba(0,0,0,0.07), rounded-[17px]
 * - experience badge: top-left, icon + "5 Years / Experiences"
 * - bottom glassmorphism bar:
 *     gradient backdrop (ca79c6â†’transparent), name (opacity-70), specialty gradient text
 *     LEFT: "About Doctor" gradient pill button
 *     RIGHT: social icons (Instagram, Facebook, Twitter)
 */
export function TeamCard({ doctor, locale = "en" }: TeamCardProps) {
  const doctorName = locale === "ar" ? doctor.nameAr : doctor.name;
  const doctorTitle = locale === "ar" ? doctor.titleAr : doctor.title;

  return (
    <article className="relative mx-auto min-h-[531px] w-full max-w-[360px]">
      {/* card white body ? rounded top big, rounded bottom small */}
      <div className="absolute bottom-0 left-0 right-0 h-[357px] rounded-bl-[8px] rounded-br-[8px] rounded-tl-[42px] rounded-tr-[42px] bg-white shadow-[-7px_4.6px_4.6px_rgba(236,180,233,0.2)]" />

      {/* photo (overlaps top of card, sits above it) */}
      <div className="absolute left-[11.6px] top-[21px] w-[calc(100%-23.2px)] overflow-hidden rounded-[17px] shadow-[0_0_21px_rgba(0,0,0,0.07)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={doctor.image}
          alt={doctorName}
          className="h-[362px] w-full object-cover object-top"
        />
      </div>

      {/* experience badge ? top-left of photo */}
      <div className="absolute left-[25px] top-[82px] z-10 flex items-center gap-2 rounded-[10px] bg-white/85 px-3 py-2 shadow-sm backdrop-blur-sm">
        <Briefcase className="h-[16px] w-[16px] text-[#ca79c6]" />
        <div className="leading-tight text-[#ca79c6]">
          <p className="text-[13px] font-semibold">5 Years</p>
          <p className="text-[9px] font-light">Experiences</p>
        </div>
      </div>

      {/* glassmorphism bottom bar ? overlays bottom of photo */}
      <div
        className="absolute bottom-0 left-[5.8px] w-[calc(100%-11.6px)] rounded-[10px] px-[11px] pb-3 pt-2 backdrop-blur-[50px]"
        style={{ background: "linear-gradient(108deg, rgba(202,121,198,0.18) 0%, rgba(202,121,198,0.001) 100%)" }}
      >
        {/* name */}
        <p className="text-[13.4px] font-normal text-black/70">{doctorName}</p>
        {/* specialty gradient */}
        <p className="gradient-text text-[13.4px] font-medium">{doctorTitle}</p>

        {/* bottom row: button + social */}
        <div className="mt-2 flex items-center justify-between">
          {/* "About Doctor" gradient pill */}
          <div className="relative inline-flex">
            {/* blur shadow layer */}
            <div
              className="absolute inset-0 rounded-[25px] blur-[5.8px] opacity-70"
              style={{ background: "linear-gradient(80deg, #ec74e7 45%, #8468f5 74%)" }}
            />
            <Button
              asChild
              size="sm"
              className="relative h-[30px] rounded-[25px] border-0 px-4 text-[11.5px] font-medium text-white"
              style={{ background: "linear-gradient(82deg, #ec74e7 45%, #8468f5 74%)" }}
            >
              <Link href={`/book-appointment?doctor=${encodeURIComponent(doctorName)}`}>
                About Doctor
              </Link>
            </Button>
          </div>

          {/* social icons */}
          <div className="flex items-center gap-[14px] text-[#ca79c6]">
            <a href={doctor.socials.instagram} aria-label={`${doctorName} on Instagram`}>
              <Instagram className="h-[18px] w-[18px]" />
            </a>
            <a href={doctor.socials.facebook} aria-label={`${doctorName} on Facebook`}>
              <Facebook className="h-[18px] w-[18px]" />
            </a>
            <a href={doctor.socials.twitter} aria-label={`${doctorName} on Twitter`}>
              <Twitter className="h-[18px] w-[18px]" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
