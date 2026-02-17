import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("accessToken")?.value;

  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/sso/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};