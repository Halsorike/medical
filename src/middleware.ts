import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  const session = request.cookies.get("admin_session")?.value;

  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

/** Protect all /admin/* routes except /admin/login */
export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};

