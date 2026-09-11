import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const consultaId = parseInt(id);
    const body = await request.json();

    const dataToUpdate: any = {};
    if (body.estado !== undefined) dataToUpdate.estado = body.estado;
    if (body.leido !== undefined) dataToUpdate.leido = Boolean(body.leido);
    if (body.notasInternas !== undefined) dataToUpdate.notasInternas = body.notasInternas;
    if (body.empleadoAsignadoId !== undefined) {
      dataToUpdate.empleadoAsignadoId = body.empleadoAsignadoId ? parseInt(body.empleadoAsignadoId) : null;
    }

    const actualizada = await prisma.consulta.update({
      where: { id: consultaId },
      data: dataToUpdate,
      include: {
        vehiculo: true,
        empleadoAsignado: {
          select: { id: true, nombreCompleto: true, username: true },
        },
      },
    });

    return NextResponse.json(actualizada);
  } catch (error) {
    console.error('Error al actualizar consulta:', error);
    return NextResponse.json({ error: 'Error al actualizar consulta' }, { status: 500 });
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

    const { id } = await params;
    await prisma.consulta.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true, message: 'Consulta eliminada' });
  } catch (error) {
    console.error('Error al eliminar consulta:', error);
    return NextResponse.json({ error: 'Error al eliminar consulta' }, { status: 500 });
  }
}
