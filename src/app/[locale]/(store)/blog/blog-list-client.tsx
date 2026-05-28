"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { BlogCard } from "@/components/store/blog-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { StorefrontBlogPost } from "@/types/blog";

const BLOG_IMAGES = [
  "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=360&h=360&fit=crop",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=360&h=360&fit=crop",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=360&h=360&fit=crop",
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=360&h=360&fit=crop",
  "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=360&h=360&fit=crop",
  "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=360&h=360&fit=crop",
];

export function BlogListClient({ posts }: { posts: StorefrontBlogPost[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return posts;

    return posts.filter((post) =>
      [post.title, post.excerpt, post.category].some((field) => field.toLowerCase().includes(value))
    );
  }, [posts, query]);

  return (
    <div className="container py-16">
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#42526b]" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search articles..."
            className="h-12 rounded-full border-[#ca79c6]/20 pl-11"
          />
        </div>
        <Button variant="outline" className="rounded-full border-[#ca79c6] px-8 text-[#ca79c6]" onClick={() => setQuery("")}>
          All Blogs
        </Button>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post, index) => (
            <BlogCard
              key={post.id}
              id={post.id}
              slug={post.slug}
              title={post.title}
              date={post.date || "29 July, 2024"}
              image={BLOG_IMAGES[index % BLOG_IMAGES.length]}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[20px] bg-white p-12 text-center text-[#42526b] shadow-[0_11px_26px_rgba(6,28,61,0.1)]">
          No articles match your search.
        </div>
      )}
    </div>
  );
}
