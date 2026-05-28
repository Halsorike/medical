import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { fail, ok, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

const doctorCreateSchema = z.object({
  name: z.string().min(2),
  nameAr: z.string().optional(),
  title: z.string().min(2),
  titleAr: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(7),
  bio: z.string().optional(),
  bioAr: z.string().optional(),
  specialization: z.string().min(2),
  experience: z.coerce.number().int().nonnegative().optional(),
  qualification: z.string().optional(),
  image: z.string().url().optional(),
  slug: z.string().min(2),
  departmentId: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export async function GET(request: NextRequest) {
  await ensureSeeded();

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? searchParams.get("search") ?? "";
  const departmentId = searchParams.get("departmentId");
  const status = searchParams.get("status");

  const where: Prisma.DoctorWhereInput = {
    ...(q ? { OR: [{ name: { contains: q } }, { specialization: { contains: q } }] } : {}),
    ...(departmentId ? { departmentId } : {}),
    ...(status ? { status } : {}),
  };

  const doctors = await db.doctor.findMany({
    where,
    include: { department: true },
    orderBy: { name: "asc" },
  });

  return ok(doctors);
}

export async function POST(request: NextRequest) {
  await ensureSeeded();

  const parsed = doctorCreateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  try {
    const doctor = await db.doctor.create({
      data: parsed.data,
    });

    return ok(doctor, { status: 201 });
  } catch {
    return fail("Doctor could not be created", 409);
  }
}
