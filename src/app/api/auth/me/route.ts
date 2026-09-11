import { NextResponse, NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      nombreCompleto: true,
      username: true,
      email: true,
      rol: true,
      activo: true,
    },
  });

  if (!usuario || !usuario.activo) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, user: usuario });
}
