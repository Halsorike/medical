import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { fail, ok, toPublicBlogPost } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: { slug: string } }) {
  await ensureSeeded();

  const post = await db.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) {
    return fail("Blog post not found", 404);
  }

  return ok(toPublicBlogPost(post));
}
