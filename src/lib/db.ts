import { PrismaClient } from "@prisma/client";
import { env } from "@/lib/env";

process.env.DATABASE_URL ??= env.DATABASE_URL || `file:${process.cwd().replace(/\\/g, "/")}/prisma/dev.db`;

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
