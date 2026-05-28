"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Search } from "lucide-react";
import { BlogCard } from "@/components/store/blog-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { StorefrontBlogPost } from "@/types/blog";

const BLOG_IMAGES = [
  "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=720&h=520&fit=crop",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=720&h=520&fit=crop",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=720&h=520&fit=crop",
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=720&h=520&fit=crop",
  "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=720&h=520&fit=crop",
  "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=720&h=520&fit=crop",
];

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Clock className="h-5 w-5 text-brand-teal" />
        <h2 className="text-[24px] font-semibold text-[#061c3d]">{title}</h2>
      </div>
      <div className="flex gap-3">
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-100 bg-white text-brand-teal shadow-sm" aria-label={`Previous ${title}`}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-teal text-white shadow-sm" aria-label={`Next ${title}`}>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export function BlogListClient({ posts }: { posts: StorefrontBlogPost[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return posts;
    return posts.filter((post) =>
      [post.title, post.excerpt, post.category].some((field) => field.toLowerCase().includes(value))
    );
  }, [posts, query]);

  const recent = filtered.slice(0, 3);
  const next = filtered.slice(3, 6).length ? filtered.slice(3, 6) : filtered.slice(0, 3);

  return (
    <div className="container py-16 md:py-20">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <h1 className="gradient-text text-[38px] font-semibold">Our Blogs</h1>
        <p className="mt-4 text-[18px] leading-8 text-[#42526b]">
          Explore practical guidance from the Echo Wellness team for hearing, speech, occupational therapy, psychology, and child development.
        </p>
      </div>

      <div className="mb-14 flex flex-col gap-4 rounded-[22px] bg-brand-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#42526b]" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search articles..."
            className="h-12 rounded-full border-white bg-white pl-11 shadow-sm"
          />
        </div>
        <Button variant="outline" className="rounded-full border-brand-teal bg-white px-8 text-brand-teal" onClick={() => setQuery("")}>
          Sort by: New
        </Button>
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-16">
          <section>
            <SectionHeader title="Recent" />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((post, index) => (
                <BlogCard key={post.id} id={post.id} slug={post.slug} title={post.title} date={post.date || "29 July, 2024"} image={BLOG_IMAGES[index % BLOG_IMAGES.length]} />
              ))}
            </div>
          </section>
          <section>
            <SectionHeader title="New" />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {next.map((post, index) => (
                <BlogCard key={`${post.id}-new`} id={post.id} slug={post.slug} title={post.title} date={post.date || "29 July, 2024"} image={BLOG_IMAGES[(index + 3) % BLOG_IMAGES.length]} />
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="rounded-[20px] bg-white p-12 text-center text-[#42526b] shadow-[0_11px_26px_rgba(6,28,61,0.1)]">
          No articles match your search.
        </div>
      )}
    </div>
  );
}
