import { NextResponse } from 'next/server';

// Define your protected routes (paths that require authentication)
const PROTECTED_ROUTES = ['/', '/sale', '/categories','/foodSize','/foodTaste','/food','/organization'];
const PUBLIC_ROUTES = ['/(full-width-pages)/(auth)/signin', '/(full-width-pages)/(auth)/signup']; // Routes accessible without auth

export async function middleware(request : any) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('authToken'); // Get token from request cookies

  // 1. If trying to access a public route, allow it.
  if (PUBLIC_ROUTES.includes(pathname) || pathname === '/') { // Allow root and public routes
    return NextResponse.next();
  }

  // 2. If trying to access a protected route
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    if (!authToken) {
      // No token, redirect to signin page
      const url = request.nextUrl.clone();
      url.pathname = '/signin';
      return NextResponse.redirect(url);
    }

    // Optional: Server-side token validation (e.g., with a backend API)
    // This makes the middleware much more secure.
    // In a real app, you'd call your API to validate the JWT.
    try {
      const validationResponse = await fetch(`${request.nextUrl.origin}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!validationResponse.ok) {
        // Token invalid or expired, redirect to signin
        const url = request.nextUrl.clone();
        url.pathname = '/signin';
        // Clear the cookie on redirect if possible (can be tricky with middleware, usually handled on client login/logout)
        const response = NextResponse.redirect(url);
        response.cookies.delete('authToken'); // Attempt to clear cookie
        return response;
      }

      // If token is valid, continue to the requested page
      return NextResponse.next();

    } catch (error) {
      console.error('Middleware token validation error:', error);
      const url = request.nextUrl.clone();
      url.pathname = '/signin';
      return NextResponse.redirect(url);
    }
  }

  // For any other routes not explicitly handled, just continue
  return NextResponse.next();
}

// Define paths where the middleware should run.
// This is important for performance.
export const config = {
  matcher: ['/', '/dashboard/:path*', '/signin'], // Apply middleware to these paths
};