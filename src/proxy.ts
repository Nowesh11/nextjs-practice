import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // get NextAuth session token
  const token =
    req.cookies.get('authjs.session-token')?.value ||
    req.cookies.get('__Secure-authjs.session-token')?.value;

  // public routes
  const publicRoutes = ['/login', '/register', '/'];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // webhook is public — Stripe calls it directly
  if (pathname === '/api/stripe/webhook') {
    return NextResponse.next();
  }

  // protect dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  }

  // protect API routes — tasks AND stripe
  if (
    pathname.startsWith('/api/tasks') ||
    pathname.startsWith('/api/stripe') ||
    pathname.startsWith('/api/stats') ||
    pathname.startsWith('/api/upload')
  ) {
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/tasks/:path*',
    '/api/stripe/:path*',
    '/api/stats/:path*',
    '/api/upload/:path*',
  ]
};