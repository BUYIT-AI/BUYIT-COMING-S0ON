import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/app/lib/auth';

// Note: Logger cannot be imported in middleware as it checks process.env.NODE_ENV
// which is handled at build time, not runtime in middleware
const isDevelopment = process.env.NODE_ENV === "development";

// Protected routes that require authentication
const protectedRoutes = [
  '/admin',
  '/dashboard',
  '/profile',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get('token')?.value;

  if (!token) {
    // Redirect to login if no token
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  try {
    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      // Token is invalid or expired
      const url = request.nextUrl.clone();
      url.pathname = '/';
      const response = NextResponse.redirect(url);
      response.cookies.delete('token');
      return response;
    }

    // Token is valid, add user info to request headers for use in route handlers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.userId);
    requestHeaders.set('x-user-email', decoded.email);
    requestHeaders.set('x-user-name', decoded.first_name);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    if (isDevelopment) {
      console.error('Middleware authentication error:', error);
    }
    
    // If token verification fails, redirect to login
    const url = request.nextUrl.clone();
    url.pathname = '/';
    const response = NextResponse.redirect(url);
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
