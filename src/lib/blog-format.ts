import type { StorefrontBlogPost } from "@/types/blog";

export function getPostLocale(post: StorefrontBlogPost, locale: string): StorefrontBlogPost {
  if (locale !== "ar") return post;

  return {
    ...post,
    title: post.titleAr || post.title,
    excerpt: post.excerptAr || post.excerpt,
    category: post.categoryAr || post.category,
    content: post.contentAr?.length ? post.contentAr : post.content,
  };
}

export function normalizeBlogPost(post: any): StorefrontBlogPost {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    titleAr: post.titleAr,
    excerpt: post.excerpt,
    excerptAr: post.excerptAr,
    date: post.date || post.createdAt || "",
    category: post.category || "Health",
    categoryAr: post.categoryAr,
    readTime: post.readTime || "4 min read",
    content: Array.isArray(post.content) ? post.content : [],
    contentAr: Array.isArray(post.contentAr) ? post.contentAr : undefined,
  };
}
