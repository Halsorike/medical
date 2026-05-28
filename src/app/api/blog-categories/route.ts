import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { fail, ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const blogCategoryCreateSchema = z.object({
  name: z.string().min(2),
  nameAr: z.string().optional(),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional(),
});

function slugify(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `category-${crypto.randomUUID().slice(0, 8)}`;
}

export async function GET() {
  await ensureSeeded();

  const categories = await db.blogCategory.findMany({
    include: {
      _count: {
        select: { posts: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return ok(categories);
}

export async function POST(request: NextRequest) {
  await ensureSeeded();

  const parsed = blogCategoryCreateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  try {
    const category = await db.blogCategory.create({
      data: {
        ...parsed.data,
        slug: parsed.data.slug ?? slugify(parsed.data.name),
      },
    });

    return ok(category, { status: 201 });
  } catch {
    return fail("Blog category could not be created", 409);
  }
}
