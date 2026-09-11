import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || session.rol !== 'DUENO') {
      return NextResponse.json({ error: 'Acceso restringido exclusivamente al Dueño del sistema' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const accion = searchParams.get('accion');
    const entidad = searchParams.get('entidad');
    const usuarioId = searchParams.get('usuarioId');
    const busqueda = searchParams.get('busqueda');
    const fechaDesde = searchParams.get('fechaDesde');
    const fechaHasta = searchParams.get('fechaHasta');
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')));
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (accion && accion !== 'TODAS') {
      where.accion = accion;
    }

    if (entidad && entidad !== 'TODAS') {
      where.entidad = entidad;
    }

    if (usuarioId && usuarioId !== 'TODOS') {
      where.usuarioId = parseInt(usuarioId);
    }

    if (busqueda && busqueda.trim()) {
      where.OR = [
        { detalles: { contains: busqueda.trim(), mode: 'insensitive' } },
        { nombreUsuario: { contains: busqueda.trim(), mode: 'insensitive' } },
      ];
    }

    if (fechaDesde || fechaHasta) {
      where.fecha = {};
      if (fechaDesde) {
        const d = new Date(fechaDesde);
        d.setHours(0, 0, 0, 0);
        where.fecha.gte = d;
      }
      if (fechaHasta) {
        const h = new Date(fechaHasta);
        h.setHours(23, 59, 59, 999);
        where.fecha.lte = h;
      }
    }

    // Auto-sincronizar ventas de la base de datos si falta algún registro en auditoría
    const totalVentasBD = await prisma.venta.count();
    const totalAuditoriaVentas = await prisma.auditoria.count({ where: { entidad: 'VENTA' } });

    if (totalVentasBD > totalAuditoriaVentas) {
      const ventas = await prisma.venta.findMany({
        include: { vehiculo: true, comprador: true, vendedor: true },
      });
      for (const v of ventas) {
        const existe = await prisma.auditoria.findFirst({
          where: { entidad: 'VENTA', entidadId: v.id },
        });
        if (!existe) {
          await prisma.auditoria.create({
            data: {
              usuarioId: v.vendedorId,
              nombreUsuario: v.vendedor?.nombreCompleto || 'Asesor Comercial',
              rolUsuario: v.vendedor?.rol || 'VENDEDOR',
              accion: 'VENTA',
              entidad: 'VENTA',
              entidadId: v.id,
              detalles: `Registro de venta: ${v.vehiculo?.marca || ''} ${v.vehiculo?.modelo || ''} (${v.vehiculo?.patente || 'Sin patente'}) vendido a ${v.comprador?.nombreCompleto || 'Cliente'} por USD $${v.precioFinal.toLocaleString()}`,
              valoresNuevos: JSON.stringify({
                ventaId: v.id,
                vehiculoId: v.vehiculoId,
                vehiculo: `${v.vehiculo?.marca || ''} ${v.vehiculo?.modelo || ''}`,
                precioFinal: v.precioFinal,
                comprador: v.comprador?.nombreCompleto,
                vendedor: v.vendedor?.nombreCompleto,
              }),
              fecha: v.fechaVenta,
              ip: '127.0.0.1',
            },
          });
        }
      }
    }

    const [total, registros, stats] = await Promise.all([
      prisma.auditoria.count({ where }),
      prisma.auditoria.findMany({
        where,
        orderBy: { fecha: 'desc' },
        skip,
        take: limit,
      }),
      // Métricas rápidas para el dashboard de auditoría
      Promise.all([
        prisma.auditoria.count({
          where: { fecha: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
        }),
        prisma.auditoria.count({ where: { accion: 'CAMBIO_PRECIO' } }),
        prisma.venta.count(),
        prisma.auditoria.count({ where: { accion: 'ELIMINACION' } }),
      ]),
    ]);

    return NextResponse.json({
      registros,
      paginacion: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total/limit),
      },
      metricas: {
        eventosUltimas24hs: stats[0],
        totalCambiosPrecio: stats[1],
        totalVentas: stats[2],
        totalBajas: stats[3],
      },
    });
  } catch (error) {
    console.error('Error al obtener registros de auditoría:', error);
    return NextResponse.json({ error: 'Error al consultar auditoría' }, { status: 500 });
  }
}
