import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getMLConfig } from '@/lib/mercadolibre';
import { registrarAuditoria } from '@/lib/auditoria';

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  if (error || !code) {
    console.error('Error en callback de Mercado Libre:', error, errorDescription);
    return NextResponse.redirect(`${origin}/panel/mercadolibre?error=${encodeURIComponent(errorDescription || error || 'Autorización denegada')}`);
  }

  try {
    const config = await getMLConfig();
    if (!config?.appId || !config?.clientSecret) {
      return NextResponse.redirect(`${origin}/panel/mercadolibre?error=${encodeURIComponent('Credenciales incompletas en el servidor')}`);
    }

    const redirectUri = config.redirectUri || `${origin}/api/mercadolibre/callback`;

    // Intercambiar código de autorización por token
    const tokenRes = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: config.appId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      console.error('Fallo al obtener token de ML:', tokenData);
      return NextResponse.redirect(`${origin}/panel/mercadolibre?error=${encodeURIComponent(tokenData.message || 'Error al obtener token de acceso')}`);
    }

    // Obtener datos del usuario en Mercado Libre
    let nickname = '';
    try {
      const userRes = await fetch(`https://api.mercadolibre.com/users/me`, {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        nickname = userData.nickname || '';
      }
    } catch (uErr) {
      console.warn('No se pudo obtener el nickname de ML:', uErr);
    }

    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

    // Guardar en la base de datos
    const existing = await prisma.mercadoLibreConfig.findFirst({
      where: { activo: true },
      orderBy: { id: 'desc' },
    });

    if (existing) {
      await prisma.mercadoLibreConfig.update({
        where: { id: existing.id },
        data: {
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          mlUserId: String(tokenData.user_id),
          nickname: nickname || existing.nickname,
          tokenExpiresAt: expiresAt,
          activo: true,
        },
      });
    } else {
      await prisma.mercadoLibreConfig.create({
        data: {
          appId: config.appId,
          clientSecret: config.clientSecret,
          redirectUri,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          mlUserId: String(tokenData.user_id),
          nickname,
          tokenExpiresAt: expiresAt,
          activo: true,
        },
      });
    }

    await registrarAuditoria({
      nombreUsuario: nickname ? `@${nickname}` : 'ADMIN',
      rolUsuario: 'ADMINISTRADOR',
      accion: 'MODIFICACION',
      entidad: 'AUTH',
      detalles: `Cuenta de Mercado Libre conectada con éxito (@${nickname || tokenData.user_id})`,
      request: req,
    });

    return NextResponse.redirect(`${origin}/panel/mercadolibre?status=connected&nickname=${encodeURIComponent(nickname)}`);
  } catch (err: any) {
    console.error('Excepción en callback de ML:', err);
    return NextResponse.redirect(`${origin}/panel/mercadolibre?error=${encodeURIComponent(err.message || 'Error inesperado')}`);
  }
}
