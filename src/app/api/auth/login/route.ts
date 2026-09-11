import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { registrarAuditoria } from '@/lib/auditoria';

// Rate limiter en memoria para intentos fallidos de login (máx. 5 intentos fallidos cada 10 minutos por IP)
const loginAttemptsMap = new Map<string, { failedCount: number; lockUntil: number }>();
const LOCK_DURATION_MS = 10 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;

// Hash ficticio para comparación constante en tiempo (previene timing attacks cuando el usuario no existe)
const DUMMY_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    const now = Date.now();
    const attempts = loginAttemptsMap.get(ip);

    if (attempts && attempts.lockUntil > now) {
      const minutesLeft = Math.ceil((attempts.lockUntil - now)/(60 * 1000));
      return NextResponse.json(
        { error: `Demasiados intentos fallidos. Cuenta bloqueada temporalmente por ${minutesLeft} minuto(s).` },
        { status: 429 }
      );
    }

    const { username, password } = await request.json();

    const cleanUsername = typeof username === 'string' ? username.trim() : '';
    const cleanPassword = typeof password === 'string' ? password : '';

    if (!cleanUsername || !cleanPassword) {
      return NextResponse.json(
        { error: 'Debe ingresar usuario y contraseña' },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { username: cleanUsername },
    });

    // Comparación en tiempo constante para evitar enumeración de usuarios mediante timing attacks
    const passwordHashToTest = usuario ? usuario.password : DUMMY_HASH;
    const esPasswordValido = await bcrypt.compare(cleanPassword, passwordHashToTest);

    if (!usuario || !usuario.activo || !esPasswordValido) {
      // Registrar intento fallido
      const currentFailed = (attempts?.failedCount || 0) + 1;
      if (currentFailed >= MAX_FAILED_ATTEMPTS) {
        loginAttemptsMap.set(ip, { failedCount: currentFailed, lockUntil: now + LOCK_DURATION_MS });
      } else {
        loginAttemptsMap.set(ip, { failedCount: currentFailed, lockUntil: 0 });
      }

      return NextResponse.json(
        { error: 'Credenciales inválidas o cuenta inactiva' },
        { status: 401 }
      );
    }

    // Login exitoso -> resetear contador de fallos
    loginAttemptsMap.delete(ip);

    const payload = {
      userId: usuario.id,
      username: usuario.username,
      nombreCompleto: usuario.nombreCompleto,
      rol: usuario.rol,
    };

    const token = signToken(payload);

    try {
      await registrarAuditoria({
        usuarioId: usuario.id,
        nombreUsuario: usuario.nombreCompleto,
        rolUsuario: usuario.rol,
        accion: 'LOGIN',
        entidad: 'AUTH',
        entidadId: usuario.id,
        detalles: `Inicio de sesión exitoso en el sistema (${usuario.username})`,
        request,
      });
    } catch (auditErr) {
      console.warn('No se pudo registrar auditoría de login:', auditErr);
    }

    const response = NextResponse.json({
      success: true,
      user: payload,
      token,
    });

    // Configurar cookie HTTP-Only de sesión (expira al cerrar el navegador)
    response.cookies.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: error?.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
