import type { Metadata } from "next";
import { posts as fallbackPosts } from "@/data/blog";
import { getApiData } from "@/lib/server-api";
import { getPostLocale, normalizeBlogPost } from "@/lib/blog-format";
import type { StorefrontBlogPost } from "@/types/blog";
import { BlogListClient } from "./blog-list-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Health tips, guides, and clinic news from Jordan Hearing & Speech Therapy.",
  openGraph: {
    title: "Blog | Jordan Hearing & Speech Therapy",
    description: "Health tips, guides, and clinic news.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const apiPosts = await getApiData<StorefrontBlogPost[]>("/api/blog");
  const posts = apiPosts?.length ? apiPosts.map(normalizeBlogPost) : fallbackPosts;
  const localePosts = posts.map((post) => getPostLocale(post, locale));

  return (
    <>
      <section className="relative overflow-hidden bg-brand-gradient pb-16 pt-12 text-white">
        <div className="container text-center">
          <h1 className="text-[38px] font-semibold">Our Blogs</h1>
          <p className="mx-auto mt-4 max-w-2xl text-[18px] font-light leading-8 text-white/85">
            Explore insights, stay informed. Our blogs offer concise expertise for your well-being journey.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg viewBox="0 0 1440 60" className="w-full fill-white">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      <BlogListClient posts={localePosts} />
    </>
  );
}
