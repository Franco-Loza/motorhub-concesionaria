import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const [
      totalVehiculos,
      stockDisponible,
      ventas,
      totalConsultas,
      ultimosVehiculos,
      ultimasConsultas,
      ultimasAuditorias,
    ] = await Promise.all([
      prisma.vehiculo.count(),
      prisma.vehiculo.count({ where: { estado: 'DISPONIBLE' } }),
      prisma.venta.findMany({
        include: { vehiculo: true },
        orderBy: { fechaVenta: 'desc' },
      }),
      prisma.consulta.count(),
      prisma.vehiculo.findMany({
        orderBy: { fechaCreacion: 'desc' },
        take: 5,
      }),
      prisma.consulta.findMany({
        include: {
          vehiculo: {
            select: { marca: true, modelo: true },
          },
        },
        orderBy: { fechaConsulta: 'desc' },
        take: 5,
      }),
      session.rol === 'DUENO'
        ? prisma.auditoria.findMany({
            orderBy: { fecha: 'desc' },
            take: 6,
          })
        : Promise.resolve([]),
    ]);

    const totalVentas = ventas.length;
    const totalFacturacion = ventas.reduce((acc, v) => acc + v.precioFinal, 0);

    // 1. Ticket Promedio
    const ticketPromedio = totalVentas > 0 ? totalFacturacion/totalVentas : 0;

    // 2. Rotación de Stock (Días promedio de permanencia antes de venta)
    let rotacionStockDias = 0;
    if (totalVentas > 0) {
      let diasTotales = 0;
      let ventasConFecha = 0;
      for (const v of ventas) {
        if (v.vehiculo?.fechaCreacion && v.fechaVenta) {
          const diffMs = new Date(v.fechaVenta).getTime() - new Date(v.vehiculo.fechaCreacion).getTime();
          const dias = Math.max(1, Math.round(diffMs/(1000 * 60 * 60 * 24)));
          diasTotales += dias;
          ventasConFecha++;
        }
      }
      rotacionStockDias = ventasConFecha > 0 ? Math.round(diasTotales/ventasConFecha) : 15;
    }

    // 3. Marca Líder en Ventas
    const marcasContador: { [marca: string]: number } = {};
    for (const v of ventas) {
      if (v.vehiculo?.marca) {
        const m = v.vehiculo.marca.toUpperCase();
        marcasContador[m] = (marcasContador[m] || 0) + 1;
      }
    }
    let marcaLider = 'N/A';
    let maxVentasMarca = 0;
    for (const [marca, count] of Object.entries(marcasContador)) {
      if (count > maxVentasMarca) {
        maxVentasMarca = count;
        marcaLider = marca;
      }
    }

    // 4. Tasa de Conversión (Ventas/Consultas * 100)
    const tasaConversion = totalConsultas > 0 ? (totalVentas/totalConsultas) * 100 : (totalVentas > 0 ? 100 : 0);

    // Formatear imágenes de últimos vehículos
    const ultimosVehiculosFormateados = ultimosVehiculos.map((v) => {
      let imagenesUrls: string[] = [];
      try {
        if (v.imagenesUrls) imagenesUrls = JSON.parse(v.imagenesUrls);
      } catch {
        imagenesUrls = v.imagenesUrls ? [v.imagenesUrls] : [];
      }
      return { ...v, imagenesUrls };
    });

    return NextResponse.json({
      totalVehiculos,
      stockDisponible,
      totalVentas,
      totalFacturacion,
      totalConsultas,
      ticketPromedio,
      rotacionStockDias,
      marcaLider,
      tasaConversion: parseFloat(tasaConversion.toFixed(1)),
      ultimosVehiculos: ultimosVehiculosFormateados,
      ultimasConsultas,
      ultimasAuditorias: session.rol === 'DUENO' ? ultimasAuditorias : [],
    });
  } catch (error) {
    console.error('Error al calcular métricas de dashboard:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
