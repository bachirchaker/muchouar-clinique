import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const isPublicPath = path === '/login' || path.startsWith('/api/auth/');

  // Static assets and Next.js internals
  if (
    path.startsWith('/_next/') ||
    path.startsWith('/favicon') ||
    path.includes('.') ||
    path === '/'
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('session-token')?.value || '';

  // Redirect to login if accessing protected route without token
  if (!isPublicPath && !token) {
    // Allow development without auth for initial setup
    if (process.env.NODE_ENV === 'development' && process.env.SKIP_AUTH === 'true') {
      return NextResponse.next();
    }

    // API routes return 401
    if (path.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Page routes redirect to login
    const loginUrl = new URL('/login', request.nextUrl);
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if logged in and trying to access login
  if (path === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except static assets
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
