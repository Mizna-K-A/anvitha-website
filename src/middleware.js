import { NextResponse } from 'next/server';

export function middleware(request) {
  const session = request.cookies.get('admin_session')?.value;
  const { pathname } = request.nextUrl;

  // Protect admin panel routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Redirect from login to admin panel if already logged in
  if (pathname === '/admin/login') {
    if (session) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
