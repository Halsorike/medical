import crypto from "crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

const cookieName = "patient_session";
const iterations = 120000;
const keyLength = 32;
const digest = "sha256";

function sessionSecret() {
  return process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "local-patient-session-secret";
}

function sign(payload: string) {
  return crypto.createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("base64url");
  const hash = crypto.pbkdf2Sync(password, salt, iterations, keyLength, digest).toString("base64url");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash?: string | null) {
  if (!storedHash) return false;
  const [salt, expected] = storedHash.split(":");
  if (!salt || !expected) return false;

  const actual = crypto.pbkdf2Sync(password, salt, iterations, keyLength, digest).toString("base64url");
  return crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}

export function createPatientSession(patientId: string) {
  const payload = Buffer.from(JSON.stringify({ patientId, iat: Date.now() }), "utf8").toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function getPatientSessionId() {
  const token = cookies().get(cookieName)?.value;
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature || sign(payload) !== signature) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { patientId?: unknown };
    return typeof data.patientId === "string" ? data.patientId : null;
  } catch {
    return null;
  }
}

export function setPatientSessionCookie(response: NextResponse, patientId: string) {
  response.cookies.set(cookieName, createPatientSession(patientId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearPatientSessionCookie(response: NextResponse) {
  response.cookies.set(cookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
