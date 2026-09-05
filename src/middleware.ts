import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "@/lib/auth.config";

// Middleware pakai config edge-safe (tanpa akses database) - lihat auth.config.ts.
const { auth } = NextAuth(authConfig);

// Melindungi semua halaman /admin/* (kecuali /admin/login).
// Survey publik (/survey/[id]) tetap anonymous, tidak melewati guard ini.
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  if (pathname.startsWith("/admin") && !isLoginPage && !req.auth) {
    const loginUrl = new URL("/admin/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
