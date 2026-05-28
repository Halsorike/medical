import type { Metadata } from "next";
import { getApiData } from "@/lib/server-api";
import { fallbackBlogPosts } from "@/lib/blog-fallback";
import { getPostLocale, normalizeBlogPost } from "@/lib/blog-format";
import type { StorefrontBlogPost } from "@/types/blog";
import { BlogListClient } from "./blog-list-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Health tips, guides, and clinic news from Echo Wellness Center.",
  openGraph: {
    title: "Blog | Echo Wellness Center",
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
  const posts = apiPosts?.length ? apiPosts.map(normalizeBlogPost) : fallbackBlogPosts;
  const localePosts = posts.map((post) => getPostLocale(post, locale));

  return <BlogListClient posts={localePosts} />;
}
