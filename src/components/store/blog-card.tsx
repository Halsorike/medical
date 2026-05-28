"use client";

import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, MessageCircle } from "lucide-react";

type BlogCardProps = {
  id?: number | string;
  slug: string;
  title: string;
  date: string;
  image: string;
};

// Figma shows 273 in placeholder â€” we vary by position so cards look different
const commentSeeds = [12, 34, 7, 89, 23, 45];

export function BlogCard({ id = 0, slug, title, date, image }: BlogCardProps) {
  const t = useTranslations("blog");
  const numericId = Number(id);
  const seed = Number.isFinite(numericId)
    ? numericId
    : String(id).split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const comments = commentSeeds[Math.abs(seed) % commentSeeds.length] ?? commentSeeds[0];

  return (
    <article className="relative mx-auto min-h-[460px] w-full max-w-[391px] overflow-hidden rounded-[15px] bg-white shadow-[0_11px_26px_rgba(6,28,61,0.1)]">
      <Link href={`/blog/${slug}`} className="block h-full">
        {/* circular image section â€” Figma: image sits centred in top white zone */}
        <div className="relative h-[288px] rounded-t-[15px] bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={title}
            className="absolute left-1/2 top-[17px] h-[234px] w-[234px] -translate-x-1/2 rounded-full object-cover"
          />
        </div>

        {/* content area */}
        <div className="relative px-[29px] pb-10 pt-0">
          {/* date + comments row */}
          <div className="flex items-center gap-[18px] pt-[18px] text-[16px]">
            <p className="font-medium text-[#0099A8]">{date}</p>
            <p className="flex items-center gap-[5.5px] font-medium text-[#42526b]">
              <MessageCircle className="h-[22px] w-[22px] text-[#42526b]/60" />
              <span className="text-[#061c3d]">{comments}</span>
              <span className="text-[#42526b]">{t("comments")}</span>
            </p>
          </div>

          {/* title */}
          <h3 className="mt-[14px] line-clamp-3 text-[16.6px] font-normal leading-[24px] text-[#061c3d]">
            {title}
          </h3>

          {/* READ MORE â€” absolute bottom Figma position */}
          <div className="absolute bottom-8 left-[29px] flex items-center gap-2 text-[#0099A8]">
            <span className="text-[9px] font-bold uppercase tracking-widest">{t("readMore")}</span>
            <ArrowRight className="h-[18px] w-[18px]" />
          </div>
        </div>
      </Link>
    </article>
  );
}
