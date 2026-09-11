import { NextResponse } from 'next/server';
import { getMLConfig } from '@/lib/mercadolibre';

export async function GET(req: Request) {
  try {
    const config = await getMLConfig();

    if (!config?.appId) {
      return NextResponse.json(
        { error: 'Debe configurar el App ID de Mercado Libre primero.' },
        { status: 400 }
      );
    }

    const { origin } = new URL(req.url);
    const redirectUri = config.redirectUri || `${origin}/api/mercadolibre/callback`;

    // URL oficial de autorización de Mercado Libre (Argentina MLA)
    const authUrl = `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${config.appId}&redirect_uri=${encodeURIComponent(redirectUri)}`;

    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    console.error('Error al iniciar OAuth de ML:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
