// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token'); // Token aus den Cookies abrufen

  const { pathname } = request.nextUrl;

  // Definieren Sie öffentliche Pfade, die keine Authentifizierung benötigen
  const publicPaths = ['/login', '/register', '/about'];

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (isPublicPath) {
    return NextResponse.next(); // Zugriff erlauben
  }

  // Wenn kein Token vorhanden ist, umleiten zur Login-Seite
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Wenn Token vorhanden ist, fortfahren
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico).*)'], // Anwenden auf alle Routen außer API und statischen Dateien
};
