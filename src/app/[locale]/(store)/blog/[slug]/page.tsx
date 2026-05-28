import { Link } from "@/navigation";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Clock } from "lucide-react";
import { getPostLocale, posts } from "@/data/blog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogPostInteractive } from "./blog-post-interactive";

const BLOG_IMAGES = [
  "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=900&h=420&fit=crop",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&h=420&fit=crop",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=900&h=420&fit=crop",
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=900&h=420&fit=crop",
  "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=900&h=420&fit=crop",
  "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=900&h=420&fit=crop",
];

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const post = posts.find((item) => item.slug === params.slug);

  if (!post) {
    return {
      title: "Blog post",
    };
  }

  const localePost = getPostLocale(post, params.locale);

  return {
    title: localePost.title,
    description: localePost.excerpt,
    openGraph: {
      title: localePost.title,
      description: localePost.excerpt,
      type: "article",
      images: ["/og-image.jpg"],
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

export default function BlogPostPage({ params }: { params: { locale: string; slug: string } }) {
  const post = posts.find((item) => item.slug === params.slug);

  if (!post) {
    notFound();
  }

  const localePost = getPostLocale(post, params.locale);
  const relatedPosts = posts
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3)
    .map((item) => getPostLocale(item, params.locale));
  const heroImage = BLOG_IMAGES[(Number(post.id) - 1) % BLOG_IMAGES.length] ?? BLOG_IMAGES[0];
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://jordanhearing.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://jordanhearing.com/blog" },
      { "@type": "ListItem", position: 3, name: localePost.title, item: `https://jordanhearing.com/blog/${post.slug}` },
    ],
  };

  return (
    <div className="container py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="mb-6">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>
      </div>

      <div className="mb-8 overflow-hidden rounded-2xl border bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroImage} alt={localePost.title} className="h-64 w-full object-cover" />
        <div className="flex min-h-[220px] flex-col justify-center bg-brand-gradient px-6 py-10 text-white md:px-10">
          <Badge variant="secondary" className="w-fit bg-white/15 text-white">
            {localePost.category}
          </Badge>
          <div className="mt-4 flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15">
              <BookOpen className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm text-white/80">Health journal</p>
              <h1 className="text-3xl font-bold">{localePost.title}</h1>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-white/80">
            <Clock className="h-4 w-4" />
            <span>{localePost.readTime}</span>
            <span>&middot;</span>
            <span>{localePost.date}</span>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
              AA
            </div>
            <div>
              <p className="text-sm font-semibold">By Dr. Ahmad Al-Rashidi</p>
              <p className="text-xs text-white/75">{localePost.date}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_280px]">
        <article className="space-y-5 rounded-2xl border bg-white p-6 md:p-8">
          <p className="text-base leading-7 text-muted-foreground">
            {localePost.excerpt}
          </p>
          {localePost.content.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-7 text-slate-700">
              {paragraph}
            </p>
          ))}
        </article>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Related posts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {relatedPosts.map((item) => (
                <div key={item.id} className="space-y-1 border-b pb-4 last:border-0 last:pb-0">
                  <Badge variant="outline" className="text-[11px]">
                    {item.category}
                  </Badge>
                  <Link href={`/blog/${item.slug}`} className="block font-medium hover:text-primary">
                    {item.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {item.readTime} &middot; {item.date}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscribe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Get practical health updates, product tips, and clinic news in your inbox.
              </p>
              <BlogPostInteractive />
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
