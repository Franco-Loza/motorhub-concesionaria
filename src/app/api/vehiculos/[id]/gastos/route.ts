import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { registrarAuditoria } from '@/lib/auditoria';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const vehiculoId = parseInt(id);

    const vehiculo = await prisma.vehiculo.findUnique({
      where: { id: vehiculoId },
      select: {
        id: true,
        marca: true,
        modelo: true,
        version: true,
        precio: true,
        costoCompra: true,
        estado: true,
        gastos: {
          orderBy: { fecha: 'desc' },
        },
      },
    });

    if (!vehiculo) {
      return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 });
    }

    const totalGastos = vehiculo.gastos.reduce((acc, g) => acc + g.monto, 0);
    const costoTotal = (vehiculo.costoCompra || 0) + totalGastos;
    const margenEstimado = vehiculo.precio - costoTotal;
    const porcentajeMargen = costoTotal > 0 ? (margenEstimado/costoTotal) * 100 : 0;

    return NextResponse.json({
      vehiculo,
      totalGastos,
      costoTotal,
      margenEstimado,
      porcentajeMargen,
    });
  } catch (error) {
    console.error('Error al obtener gastos:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const vehiculoId = parseInt(id);
    const body = await request.json();

    // Actualizar costo de compra si vino en el body
    if (body.costoCompra !== undefined) {
      await prisma.vehiculo.update({
        where: { id: vehiculoId },
        data: { costoCompra: parseFloat(body.costoCompra) || null },
      });
    }

    // Agregar nuevo gasto si se enviaron descripcion y monto
    if (body.descripcion && body.monto) {
      const nuevoGasto = await prisma.gastoVehiculo.create({
        data: {
          vehiculoId,
          tipoGasto: body.tipoGasto || 'OTRO',
          descripcion: body.descripcion.trim(),
          monto: parseFloat(body.monto),
        },
      });

      await registrarAuditoria({
        usuarioId: session.userId,
        nombreUsuario: session.nombreCompleto,
        rolUsuario: session.rol,
        accion: 'MODIFICACION',
        entidad: 'VEHICULO',
        entidadId: vehiculoId,
        detalles: `Registro de gasto en vehículo ID ${vehiculoId}: ${nuevoGasto.descripcion} ($${nuevoGasto.monto}) - Tipo: ${nuevoGasto.tipoGasto}`,
        request,
      });
    }

    return NextResponse.json({ success: true, message: 'Gastos actualizados correctamente' });
  } catch (error) {
    console.error('Error al registrar gasto:', error);
    return NextResponse.json({ error: 'Error al registrar gasto' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const gastoId = searchParams.get('gastoId');

    if (!gastoId) {
      return NextResponse.json({ error: 'ID de gasto no proporcionado' }, { status: 400 });
    }

    await prisma.gastoVehiculo.delete({
      where: { id: parseInt(gastoId) },
    });

    return NextResponse.json({ success: true, message: 'Gasto eliminado' });
  } catch (error) {
    console.error('Error al eliminar gasto:', error);
    return NextResponse.json({ error: 'Error al eliminar gasto' }, { status: 500 });
  }
}
