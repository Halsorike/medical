import type { MetadataRoute } from "next";
import { posts } from "@/data/blog";
import { products } from "@/data/products";

const baseUrl = "https://jordanhearing.com";
const locales = ["ar", "en"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/shop",
    "/categories",
    "/brands",
    "/deals",
    "/blog",
    "/book-appointment",
    "/evaluation",
    "/services",
    "/team",
    "/contact",
    "/returns",
    "/track",
    "/help",
    "/privacy",
    "/terms",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        alternates: {
          languages: {
            ar: `${baseUrl}/ar${route}`,
            en: `${baseUrl}/en${route}`,
          },
        },
      });
    }

    for (const post of posts) {
      entries.push({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(),
      });
    }

    for (const product of products) {
      entries.push({
        url: `${baseUrl}/${locale}/product/${product.slug}`,
        lastModified: new Date(),
      });
    }
  }

  return entries;
}
