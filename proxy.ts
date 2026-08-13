
import { NextResponse } from "next/server";
import { auth } from "./src/lib/auth";

const PROTECTED_PREFIX = "/dashboard";
const LOGIN_PATH = "/login";

export default auth((req) => {
  console.log("🔍 req.auth:", req.auth);
   console.log("🍪 cookies:", req.headers.get("cookie"));
  const isProtected = req.nextUrl.pathname.startsWith(PROTECTED_PREFIX);
  const isLoggedIn = !!req.auth;
  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL(LOGIN_PATH, req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (req.nextUrl.pathname === LOGIN_PATH && isLoggedIn) {
    return NextResponse.redirect(new URL(PROTECTED_PREFIX, req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};