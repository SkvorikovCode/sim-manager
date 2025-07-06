import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Маршруты, которые не требуют аутентификации
const publicRoutes = [
  '/login',
  '/reset-password',
];

// Маршруты API, которые не требуют аутентификации
const publicApiRoutes = [
  '/api/auth/login',
  '/api/auth/reset-password',
  '/api/auth/verify-code',
  '/api/auth/set-password',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Проверяем, является ли маршрут публичным
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route));
  
  // Получаем токен из cookie
  const token = request.cookies.get('auth-token')?.value;
  
  // Если это API маршрут
  if (pathname.startsWith('/api')) {
    // Если это публичный API маршрут, пропускаем
    if (isPublicApiRoute) {
      return NextResponse.next();
    }
    
    // Если нет токена, возвращаем ошибку
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Если есть токен, пропускаем запрос
    return NextResponse.next();
  }
  
  // Если это публичный маршрут и пользователь авторизован, редиректим на dashboard
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Если это защищенный маршрут и пользователь не авторизован, редиректим на login
  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

// Указываем, для каких маршрутов применять middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
    '/api/:path*',
  ],
};