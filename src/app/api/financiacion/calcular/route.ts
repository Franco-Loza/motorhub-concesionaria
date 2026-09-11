import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const precioTotal = parseFloat(body.precioTotal);
    const anticipo = Math.max(0, parseFloat(body.anticipo) || 0);
    const cuotas = Math.min(120, Math.max(1, parseInt(body.cuotas) || 12));
    const tasaInteresAnual = Math.max(0, parseFloat(body.tasaInteresAnual) || 45);

    if (isNaN(precioTotal) || precioTotal <= 0) {
      return NextResponse.json({ error: 'El precio total debe ser un número válido mayor a 0.' }, { status: 400 });
    }

    if (anticipo >= precioTotal) {
      return NextResponse.json({
        precioTotal,
        anticipo,
        montoAFinanciar: 0,
        cuotas,
        tasaInteresAnual,
        montoCuota: 0,
        totalFinanciado: 0,
        totalIntereses: 0,
      });
    }

    const montoAFinanciar = precioTotal - anticipo;

    // Algoritmo Francés de Amortización
    const tasaMensual = (tasaInteresAnual / 100) / 12;
    let cuotaMensual = 0;

    if (tasaMensual === 0) {
      cuotaMensual = montoAFinanciar/cuotas;
    } else {
      cuotaMensual =
        (montoAFinanciar * (tasaMensual * Math.pow(1 + tasaMensual, cuotas))) /
        (Math.pow(1 + tasaMensual, cuotas) - 1);
    }

    const totalFinanciado = cuotaMensual * cuotas;
    const totalIntereses = totalFinanciado - montoAFinanciar;

    return NextResponse.json({
      precioTotal,
      anticipo,
      montoAFinanciar: Math.round(montoAFinanciar),
      cuotas,
      tasaInteresAnual,
      montoCuota: Math.round(cuotaMensual),
      totalFinanciado: Math.round(totalFinanciado),
      totalIntereses: Math.round(totalIntereses),
    });
  } catch (error) {
    console.error('Error al calcular financiación:', error);
    return NextResponse.json({ error: 'Error al calcular cuotas de financiación' }, { status: 500 });
  }
}
