import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { registrarAuditoria } from '@/lib/auditoria';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sucursal = await prisma.sucursal.findUnique({
      where: { id: parseInt(id) },
    });

    if (!sucursal) {
      return NextResponse.json({ error: 'Sucursal no encontrada' }, { status: 404 });
    }

    return NextResponse.json(sucursal);
  } catch (error) {
    console.error('Error al obtener sucursal:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || session.rol !== 'DUENO') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const { id } = await params;
    const sucursalId = parseInt(id);
    const body = await request.json();

    const sucursalAnterior = await prisma.sucursal.findUnique({
      where: { id: sucursalId },
    });

    if (body.esCasaCentral) {
      await prisma.sucursal.updateMany({
        where: { esCasaCentral: true, id: { not: sucursalId } },
        data: { esCasaCentral: false },
      });
    }

    const actualizado = await prisma.sucursal.update({
      where: { id: sucursalId },
      data: {
        nombre: body.nombre ? body.nombre.toUpperCase() : undefined,
        activa: body.activa !== undefined ? Boolean(body.activa) : undefined,
        esCasaCentral: body.esCasaCentral !== undefined ? Boolean(body.esCasaCentral) : undefined,
        horarios: body.horarios !== undefined ? (body.horarios ? body.horarios.toUpperCase() : null) : undefined,
        email: body.email !== undefined ? body.email : undefined,
        telefono: body.telefono !== undefined ? body.telefono : undefined,
        whatsapp: body.whatsapp !== undefined ? body.whatsapp : undefined,
        calle: body.calle !== undefined ? (body.calle ? body.calle.toUpperCase() : null) : undefined,
        numero: body.numero !== undefined ? body.numero : undefined,
        pisoDepto: body.pisoDepto !== undefined ? (body.pisoDepto ? body.pisoDepto.toUpperCase() : null) : undefined,
        ciudad: body.ciudad !== undefined ? (body.ciudad ? body.ciudad.toUpperCase() : null) : undefined,
        provincia: body.provincia !== undefined ? (body.provincia ? body.provincia.toUpperCase() : null) : undefined,
        codigoPostal: body.codigoPostal !== undefined ? body.codigoPostal : undefined,
      },
    });

    await registrarAuditoria({
      usuarioId: session.userId,
      nombreUsuario: session.nombreCompleto,
      rolUsuario: session.rol,
      accion: 'MODIFICACION',
      entidad: 'SUCURSAL',
      entidadId: sucursalId,
      detalles: `Modificación de sucursal: ${actualizado.nombre} (Activa: ${actualizado.activa ? 'Sí' : 'No'}, Casa Central: ${actualizado.esCasaCentral ? 'Sí' : 'No'})`,
      valoresAnteriores: sucursalAnterior,
      valoresNuevos: actualizado,
      request,
    });

    return NextResponse.json(actualizado);
  } catch (error) {
    console.error('Error al actualizar sucursal:', error);
    return NextResponse.json({ error: 'Error al actualizar sucursal' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || session.rol !== 'DUENO') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const { id } = await params;
    const sucursalId = parseInt(id);

    const sucursalEliminar = await prisma.sucursal.findUnique({
      where: { id: sucursalId },
    });

    await prisma.sucursal.delete({
      where: { id: sucursalId },
    });

    await registrarAuditoria({
      usuarioId: session.userId,
      nombreUsuario: session.nombreCompleto,
      rolUsuario: session.rol,
      accion: 'ELIMINACION',
      entidad: 'SUCURSAL',
      entidadId: sucursalId,
      detalles: `Eliminación de sucursal: ${sucursalEliminar?.nombre}`,
      valoresAnteriores: sucursalEliminar,
      request,
    });

    return NextResponse.json({ success: true, message: 'Sucursal eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar sucursal:', error);
    return NextResponse.json({ error: 'Error al eliminar sucursal' }, { status: 500 });
  }
}
