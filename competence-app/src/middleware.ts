import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken');
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/evaluation';

  if (!token && req.nextUrl.pathname.startsWith(`${basePath}/dashboard`)) {
    return NextResponse.redirect(new URL(`${basePath}/login`, req.url));
  }

  return NextResponse.next();
}

// Define the paths where the middleware should be applied
export const config = {
  matcher: ['/evaluation/dashboard/:path*'], // Use static path instead of a variable
};
