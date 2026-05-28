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

const commentSeeds = [273, 126, 84, 45, 31, 18];

export function BlogCard({ id = 0, slug, title, date, image }: BlogCardProps) {
  const t = useTranslations("blog");
  const numericId = Number(id);
  const seed = Number.isFinite(numericId)
    ? numericId
    : String(id).split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const comments = commentSeeds[Math.abs(seed) % commentSeeds.length] ?? commentSeeds[0];

  return (
    <article className="figma-card group mx-auto min-h-[500px] w-full max-w-[392px] overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(6,28,61,0.14)]">
      <Link href={`/blog/${slug}`} className="block h-full">
        <div className="h-[288px] overflow-hidden rounded-t-[15px] bg-brand-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
        <div className="relative min-h-[212px] px-[29px] pb-10 pt-7">
          <div className="flex flex-wrap items-center gap-x-[18px] gap-y-2 text-[14.75px]">
            <p className="font-medium text-brand-teal">{date}</p>
            <p className="flex items-center gap-[5.5px] font-medium text-[#42526b]">
              <MessageCircle className="h-[22px] w-[22px] text-brand-teal/70" />
              <span className="text-[#061c3d]">{comments}</span>
              <span>{t("comments")}</span>
            </p>
          </div>
          <h3 className="mt-4 line-clamp-3 text-[16.6px] font-normal leading-[24px] text-[#061c3d]">
            {title}
          </h3>
          <div className="absolute bottom-8 left-[29px] flex items-center gap-2 text-brand-teal">
            <span className="text-[10px] font-bold uppercase tracking-widest">{t("readMore")}</span>
            <ArrowRight className="h-[18px] w-[18px]" />
          </div>
        </div>
      </Link>
    </article>
  );
}
