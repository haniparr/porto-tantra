// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Allow public access to login and register pages
    if (path === "/admin/login" || path === "/admin/register") {
      return NextResponse.next();
    }

    // Admin-only routes
    if (path.startsWith("/admin/users") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // Allow access to login and register without authentication
        if (path === "/admin/login" || path === "/admin/register") {
          return true;
        }
        return !!token;
      },
    },
  },
);

export const config = {
  matcher: ["/admin/:path*"],
};
