import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { registrarAuditoria } from '@/lib/auditoria';

export async function POST(req: Request) {
  try {
    const existing = await prisma.mercadoLibreConfig.findFirst({
      where: { activo: true },
      orderBy: { id: 'desc' },
    });

    if (existing) {
      await prisma.mercadoLibreConfig.update({
        where: { id: existing.id },
        data: {
          accessToken: null,
          refreshToken: null,
          tokenExpiresAt: null,
          mlUserId: null,
          nickname: null,
        },
      });
    }

    await registrarAuditoria({
      nombreUsuario: 'ADMIN',
      rolUsuario: 'ADMINISTRADOR',
      accion: 'MODIFICACION',
      entidad: 'AUTH',
      detalles: 'Cuenta de Mercado Libre desvinculada manualmente por el usuario',
      request: req,
    });

    return NextResponse.json({ success: true, message: 'Cuenta desvinculada correctamente' });
  } catch (error: any) {
    console.error('Error al desvincular ML:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
