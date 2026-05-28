import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function POST() {
  const response = NextResponse.json({ data: { loggedOut: true } });

  response.cookies.set("admin_session", "", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
