import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken');
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  if (!token && req.nextUrl.pathname.startsWith(`${basePath}/dashboard`)) {
    return NextResponse.redirect(new URL(`${basePath}/login`, req.url));
  }

  return NextResponse.next();
}

/*
export const config = {
  matcher: [`${process.env.NEXT_PUBLIC_BASE_PATH}/dashboard/:path*`, `${process.env.NEXT_PUBLIC_BASE_PATH}/admin/:path*`],
};
*/

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],  // Apply middleware to specific routes
};