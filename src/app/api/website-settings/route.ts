import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const websiteSettingsUpdateSchema = z.object({
  settings: z.array(
    z.object({
      key: z.string().min(1),
      value: z.string(),
    })
  ),
});

function toSettingsObject(settings: Array<{ key: string; value: string }>) {
  return Object.fromEntries(settings.map((setting) => [setting.key, setting.value]));
}

export async function GET() {
  await ensureSeeded();

  const settings = await db.siteSetting.findMany({
    orderBy: { key: "asc" },
  });

  return ok(toSettingsObject(settings));
}

export async function PUT(request: NextRequest) {
  await ensureSeeded();

  const parsed = websiteSettingsUpdateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const settings = await Promise.all(
    parsed.data.settings.map((setting) =>
      db.siteSetting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: setting,
      })
    )
  );

  return ok(toSettingsObject(settings));
}
