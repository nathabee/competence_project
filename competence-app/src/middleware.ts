import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('authToken');
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/evaluation';

    // Redirect unauthenticated users trying to access the dashboard
    // if (!token && req.nextUrl.pathname.startsWith(`${basePath}/dashboard`)) {
    if (!token  ) {
        return NextResponse.redirect(new URL(`${basePath}/login`, req.url));
    }

    return NextResponse.next();
}

// Define the paths where the middleware should be applied
export const config = {
    matcher: ['/evaluation/:path*'], // This applies middleware to all routes under the base path
};
