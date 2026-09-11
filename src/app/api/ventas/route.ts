import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { registrarAuditoria } from '@/lib/auditoria';

export async function GET(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fechaDesde = searchParams.get('fechaDesde');
    const fechaHasta = searchParams.get('fechaHasta');

    const where: any = {};

    // Si el usuario no es el dueño, solo puede visualizar sus propias ventas registradas
    if (session.rol !== 'DUENO') {
      where.vendedorId = session.userId;
    }

    if (fechaDesde || fechaHasta) {
      where.fechaVenta = {};
      if (fechaDesde) where.fechaVenta.gte = new Date(fechaDesde);
      if (fechaHasta) {
        const hasta = new Date(fechaHasta);
        hasta.setHours(23, 59, 59, 999);
        where.fechaVenta.lte = hasta;
      }
    }

    const ventas = await prisma.venta.findMany({
      where,
      include: {
        vehiculo: true,
        comprador: true,
        vendedor: {
          select: {
            id: true,
            nombreCompleto: true,
            username: true,
            email: true,
            rol: true,
          },
        },
      },
      orderBy: { fechaVenta: 'desc' },
    });

    return NextResponse.json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    return NextResponse.json({ error: 'Error al consultar ventas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { vehiculoId, compradorId, precioFinal, observaciones } = body;

    const parsedVehiculoId = parseInt(vehiculoId);
    const parsedCompradorId = parseInt(compradorId);
    const parsedPrecioFinal = parseFloat(precioFinal);

    if (isNaN(parsedVehiculoId) || isNaN(parsedCompradorId) || isNaN(parsedPrecioFinal) || parsedPrecioFinal <= 0) {
      return NextResponse.json(
        { error: 'Vehículo, comprador y un precio final mayor a 0 son obligatorios.' },
        { status: 400 }
      );
    }

    // Registrar venta y cambiar estado del vehículo en una transacción atómica protegida contra condiciones de carrera
    try {
      const resultado = await prisma.$transaction(async (tx) => {
        // 1. Intento atómico de bloquear el vehículo si aún está DISPONIBLE
        const updateResult = await tx.vehiculo.updateMany({
          where: {
            id: parsedVehiculoId,
            estado: 'DISPONIBLE',
          },
          data: {
            estado: 'VENDIDO',
          },
        });

        if (updateResult.count === 0) {
          throw new Error('VEHICULO_NO_DISPONIBLE');
        }

        // 2. Crear el registro oficial de la venta
        const nuevaVenta = await tx.venta.create({
          data: {
            vehiculoId: parsedVehiculoId,
            compradorId: parsedCompradorId,
            vendedorId: session.userId,
            precioFinal: parsedPrecioFinal,
            observaciones: observaciones ? String(observaciones).slice(0, 1000).trim() : '',
          },
          include: {
            vehiculo: true,
            comprador: true,
            vendedor: {
              select: {
                id: true,
                nombreCompleto: true,
                username: true,
              },
            },
          },
        });

        return nuevaVenta;
      });

      await registrarAuditoria({
        usuarioId: session.userId,
        nombreUsuario: session.nombreCompleto,
        rolUsuario: session.rol,
        accion: 'VENTA',
        entidad: 'VENTA',
        entidadId: resultado.id,
        detalles: `Registro de venta: ${resultado.vehiculo.marca} ${resultado.vehiculo.modelo} (${resultado.vehiculo.patente || 'Sin patente'}) vendido a ${resultado.comprador.nombreCompleto} por USD $${resultado.precioFinal.toLocaleString()}`,
        valoresNuevos: {
          ventaId: resultado.id,
          vehiculoId: resultado.vehiculoId,
          vehiculo: `${resultado.vehiculo.marca} ${resultado.vehiculo.modelo}`,
          precioFinal: resultado.precioFinal,
          comprador: resultado.comprador.nombreCompleto,
          vendedor: session.nombreCompleto,
        },
        request,
      });

      return NextResponse.json(resultado, { status: 201 });
    } catch (txError: any) {
      if (txError.message === 'VEHICULO_NO_DISPONIBLE') {
        return NextResponse.json(
          { error: 'La unidad ya no se encuentra disponible (fue vendida o reservada recientemente).' },
          { status: 409 }
        );
      }
      throw txError;
    }
  } catch (error) {
    console.error('Error al registrar venta:', error);
    return NextResponse.json({ error: 'Error interno al procesar la venta' }, { status: 500 });
  }
}
