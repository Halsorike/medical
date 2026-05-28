export type StorefrontBlogPost = {
  id: number | string;
  slug: string;
  title: string;
  titleAr?: string;
  excerpt: string;
  excerptAr?: string;
  date: string;
  category: string;
  categoryAr?: string;
  readTime: string;
  content: string[];
  contentAr?: string[];
};
