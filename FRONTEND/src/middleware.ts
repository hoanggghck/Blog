// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Các route public (không cần token)
const PUBLIC_PATHS = ["/login", "/register", "/forgot-password"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Nếu là public route -> cho qua
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Lấy token từ cookies
  const AT = req.cookies.get("accessToken")?.value;
  const RT = req.cookies.get("refreshToken")?.value;

  // Nếu chưa có token -> redirect về login
  if (!AT || !RT) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Nếu có token -> cho qua
  return NextResponse.next();
}

// Áp dụng middleware cho tất cả route (trừ static/_next)
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};