import { NextResponse } from 'next/server';

export const revalidate = 300; // Revalidar cada 5 minutos

interface DolarInfo {
  moneda: string;
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
}

export async function GET() {
  try {
    const res = await fetch('https://dolarapi.com/v1/dolares', {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`DolarApi respondió con status ${res.status}`);
    }

    const data: DolarInfo[] = await res.json();
    const oficial = data.find((d) => d.casa === 'oficial') || {
      compra: 1300,
      venta: 1350,
      fechaActualizacion: new Date().toISOString(),
    };
    const blue = data.find((d) => d.casa === 'blue') || {
      compra: 1380,
      venta: 1410,
      fechaActualizacion: new Date().toISOString(),
    };

    return NextResponse.json({
      oficial: {
        compra: oficial.compra,
        venta: oficial.venta,
        fechaActualizacion: oficial.fechaActualizacion,
      },
      blue: {
        compra: blue.compra,
        venta: blue.venta,
        fechaActualizacion: blue.fechaActualizacion,
      },
      origen: 'dolarapi.com',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error al obtener cotización de dólar:', error);
    // Fallback con valores estimados de referencia para no romper la UI
    return NextResponse.json({
      oficial: { compra: 1320, venta: 1370, fechaActualizacion: new Date().toISOString() },
      blue: { compra: 1400, venta: 1430, fechaActualizacion: new Date().toISOString() },
      origen: 'fallback',
      timestamp: new Date().toISOString(),
    });
  }
}
