import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { ok, toPublicBlogPost } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureSeeded();

  const posts = await db.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return ok(posts.map(toPublicBlogPost));
}
