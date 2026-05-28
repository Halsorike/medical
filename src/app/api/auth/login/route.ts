import { NextRequest, NextResponse } from "next/server";
import { createHmac, randomUUID, timingSafeEqual } from "crypto";
import { z } from "zod";
import { fail, validationError } from "@/lib/api";
import { env } from "@/lib/env";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const failedAttempts = new Map<string, { count: number; blockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const BLOCK_MS = 15 * 60 * 1000;

function getClientIp(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

function timingSafeStringEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    timingSafeEqual(left, left);
    return false;
  }

  return timingSafeEqual(left, right);
}

function recordFailure(ip: string) {
  const current = failedAttempts.get(ip) ?? { count: 0, blockedUntil: 0 };
  const nextCount = current.count + 1;
  failedAttempts.set(ip, {
    count: nextCount,
    blockedUntil: nextCount >= MAX_ATTEMPTS ? Date.now() + BLOCK_MS : 0,
  });
}

function createSessionToken(email: string) {
  const nonce = randomUUID();
  const secret = env.NEXTAUTH_SECRET || "development-only-session-secret";
  const signature = createHmac("sha256", secret).update(`${email}.${nonce}`).digest("hex");

  return `${nonce}.${signature}`;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const attempt = failedAttempts.get(ip);

  if (attempt?.blockedUntil && attempt.blockedUntil > Date.now()) {
    return fail("Invalid credentials", 401);
  }

  const parsed = loginSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const validEmail = timingSafeStringEqual(parsed.data.email, env.ADMIN_EMAIL);
  const validPassword = timingSafeStringEqual(parsed.data.password, env.ADMIN_PASSWORD);

  if (!validEmail || !validPassword) {
    recordFailure(ip);
    return fail("Invalid credentials", 401);
  }

  failedAttempts.delete(ip);
  const token = createSessionToken(parsed.data.email);
  const response = NextResponse.json({
    data: {
      token,
      user: {
        name: "Medical Admin",
        email: parsed.data.email,
        role: "admin",
      },
    },
  });

  response.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
