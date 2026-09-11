import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { registrarAuditoria } from '@/lib/auditoria';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || session.rol !== 'DUENO') {
      return NextResponse.json({ error: 'Acceso denegado: solo el dueño puede anular ventas' }, { status: 403 });
    }

    const { id } = await params;
    const ventaId = parseInt(id);

    const venta = await prisma.venta.findUnique({
      where: { id: ventaId },
      include: { vehiculo: true, comprador: true },
    });

    if (!venta) {
      return NextResponse.json({ error: 'Venta no encontrada' }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.venta.delete({
        where: { id: ventaId },
      });

      await tx.vehiculo.update({
        where: { id: venta.vehiculoId },
        data: { estado: 'DISPONIBLE' },
      });
    });

    await registrarAuditoria({
      usuarioId: session.userId,
      nombreUsuario: session.nombreCompleto,
      rolUsuario: session.rol,
      accion: 'ANULACION',
      entidad: 'VENTA',
      entidadId: ventaId,
      detalles: `Anulación de venta ID #${ventaId}: Vehículo ${venta.vehiculo.marca} ${venta.vehiculo.modelo} retornado a stock DISPONIBLE. (Comprador original: ${venta.comprador.nombreCompleto})`,
      valoresAnteriores: {
        ventaId: venta.id,
        vehiculoId: venta.vehiculoId,
        precioFinal: venta.precioFinal,
        comprador: venta.comprador.nombreCompleto,
      },
      request,
    });

    return NextResponse.json({ success: true, message: 'Venta anulada y vehículo retornado a stock disponible' });
  } catch (error) {
    console.error('Error al anular venta:', error);
    return NextResponse.json({ error: 'Error al anular venta' }, { status: 500 });
  }
}
