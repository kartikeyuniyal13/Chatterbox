import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname;
    const isLoginPage = pathname.startsWith('/login');

    const isAuth = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const sensitiveRoutes = ['/dashboard'];
    const isAccessingSensitiveRoutes = sensitiveRoutes.some(route => pathname.startsWith(route));

    if (isLoginPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
      }
      return NextResponse.next();
    }

    if (!isAuth && isAccessingSensitiveRoutes) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    if (pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      async authorized() {
        return true;
      }
    }
  }
);

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*']
};
