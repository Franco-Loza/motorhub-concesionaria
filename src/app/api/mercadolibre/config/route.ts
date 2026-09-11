import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getMLConfig } from '@/lib/mercadolibre';
import { registrarAuditoria } from '@/lib/auditoria';

export async function GET() {
  try {
    const config = await getMLConfig();
    const isConnected = !!(config?.accessToken);

    return NextResponse.json({
      connected: isConnected,
      appId: config?.appId || '',
      hasSecret: !!(config?.clientSecret),
      redirectUri: config?.redirectUri || '',
      nickname: config?.nickname || '',
      mlUserId: config?.mlUserId || '',
      tokenExpiresAt: config?.tokenExpiresAt || null,
      configured: !!(config?.appId && config?.clientSecret),
    });
  } catch (error: any) {
    console.error('Error al obtener config de ML:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { appId, clientSecret, redirectUri } = body;

    const existing = await prisma.mercadoLibreConfig.findFirst({
      where: { activo: true },
      orderBy: { id: 'desc' },
    });

    let config;
    if (existing) {
      config = await prisma.mercadoLibreConfig.update({
        where: { id: existing.id },
        data: {
          appId: appId !== undefined ? appId : existing.appId,
          clientSecret: clientSecret !== undefined ? clientSecret : existing.clientSecret,
          redirectUri: redirectUri !== undefined ? redirectUri : existing.redirectUri,
        },
      });
    } else {
      config = await prisma.mercadoLibreConfig.create({
        data: {
          appId: appId || '',
          clientSecret: clientSecret || '',
          redirectUri: redirectUri || 'http://localhost:3000/api/mercadolibre/callback',
          activo: true,
        },
      });
    }

    await registrarAuditoria({
      nombreUsuario: 'ADMIN',
      rolUsuario: 'ADMINISTRADOR',
      accion: 'MODIFICACION',
      entidad: 'AUTH',
      entidadId: config.id,
      detalles: 'Actualización de credenciales de Mercado Libre API (App ID / Secret)',
      request: req,
    });

    return NextResponse.json({
      success: true,
      configured: !!(config.appId && config.clientSecret),
      appId: config.appId,
      redirectUri: config.redirectUri,
      connected: !!config.accessToken,
    });
  } catch (error: any) {
    console.error('Error al guardar configuración ML:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
