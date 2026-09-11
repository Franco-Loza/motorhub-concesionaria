import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_local_only_motorhub_2026';
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('session_token')?.value;

  // Redirigir legacy /login → /ingreso
  if (pathname === '/login') {
    return NextResponse.redirect(new URL('/ingreso', request.url));
  }

  // Permitir siempre acceso a /ingreso
  if (pathname === '/ingreso') {
    return NextResponse.next();
  }

  // Redirigir legacy /admin/* y /administracion/* → /panel/*
  if (pathname.startsWith('/admin') || pathname.startsWith('/administracion')) {
    const newPath = pathname
      .replace('/admin/dashboard', '/panel/inicio')
      .replace('/admin/gestion-catalogo', '/panel/stock')
      .replace('/admin/cargar', '/panel/cargar-vehiculo')
      .replace('/admin/editar', '/panel/editar-vehiculo')
      .replace('/admin/gestion-sucursales', '/panel/sucursales')
      .replace('/admin', '/panel')
      .replace('/administracion', '/panel');

    return NextResponse.redirect(new URL(newPath || '/panel/inicio', request.url));
  }

  // Rutas protegidas del Panel Interno
  if (pathname.startsWith('/panel')) {
    if (!token) {
      return NextResponse.redirect(new URL('/ingreso', request.url));
    }

    try {
      // Verificación estricta de la firma criptográfica del JWT
      const { payload } = await jwtVerify(token, secretKey);
      const rol = ((payload.rol as string) || '').toUpperCase();

      // Rutas exclusivas del dueño
      const esRutaSoloDueno =
        pathname.startsWith('/panel/empleados') ||
        pathname.startsWith('/panel/sucursales') ||
        pathname.startsWith('/panel/auditoria');

      if (esRutaSoloDueno && rol !== 'DUENO') {
        return NextResponse.redirect(new URL('/panel/inicio', request.url));
      }
    } catch {
      // Si el token fue alterado, expiró o la firma no coincide, limpiar y redirigir
      const response = NextResponse.redirect(new URL('/ingreso', request.url));
      response.cookies.delete('session_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/panel/:path*', '/admin/:path*', '/administracion/:path*', '/login', '/ingreso'],
};
