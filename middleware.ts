import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/adminAuth";

// The Viral Video Studio is an internal content-creation tool, not a
// customer-facing feature — gate it behind a simple admin session so only
// the brand's team can generate promotional clips. See lib/adminAuth.ts and
// .env.example (ADMIN_PASSWORD) for how the session is created and verified.
export async function middleware(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isAuthed = await verifyAdminSessionToken(token);

  if (isAuthed) return NextResponse.next();

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("from", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/video-studio/:path*", "/admin", "/admin/orders/:path*", "/admin/products/:path*"],
};
