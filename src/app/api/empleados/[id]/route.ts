import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { registrarAuditoria } from '@/lib/auditoria';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || session.rol !== 'DUENO') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const { id } = await params;
    const empleado = await prisma.usuario.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        nombreCompleto: true,
        dni: true,
        email: true,
        telefono: true,
        username: true,
        rol: true,
        activo: true,
        fechaCreacion: true,
      },
    });

    if (!empleado) {
      return NextResponse.json({ error: 'Empleado no encontrado' }, { status: 404 });
    }

    return NextResponse.json(empleado);
  } catch (error) {
    console.error('Error al obtener empleado:', error);
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
    const empleadoId = parseInt(id);
    const body = await request.json();

    const empleadoAnterior = await prisma.usuario.findUnique({
      where: { id: empleadoId },
      select: {
        id: true,
        nombreCompleto: true,
        username: true,
        rol: true,
        activo: true,
        email: true,
      },
    });

    const dataToUpdate: any = {
      nombreCompleto: body.nombreCompleto ? body.nombreCompleto.toUpperCase() : undefined,
      dni: body.dni !== undefined ? body.dni : undefined,
      email: body.email !== undefined ? body.email : undefined,
      telefono: body.telefono !== undefined ? body.telefono : undefined,
      rol: body.rol ? body.rol.toUpperCase() : undefined,
      activo: body.activo !== undefined ? Boolean(body.activo) : undefined,
    };

    if (body.password) {
      dataToUpdate.password = await bcrypt.hash(body.password, 10);
    }

    const actualizado = await prisma.usuario.update({
      where: { id: empleadoId },
      data: dataToUpdate,
      select: {
        id: true,
        nombreCompleto: true,
        dni: true,
        email: true,
        telefono: true,
        username: true,
        rol: true,
        activo: true,
      },
    });

    await registrarAuditoria({
      usuarioId: session.userId,
      nombreUsuario: session.nombreCompleto,
      rolUsuario: session.rol,
      accion: 'MODIFICACION',
      entidad: 'EMPLEADO',
      entidadId: empleadoId,
      detalles: `Modificación de usuario: ${actualizado.nombreCompleto} (${actualizado.username})${body.password ? ' [Contraseña Actualizada]' : ''}`,
      valoresAnteriores: empleadoAnterior,
      valoresNuevos: actualizado,
      request,
    });

    return NextResponse.json(actualizado);
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    return NextResponse.json({ error: 'Error al actualizar empleado' }, { status: 500 });
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
    const usuarioId = parseInt(id);

    if (usuarioId === session.userId) {
      return NextResponse.json({ error: 'No podés eliminar tu propia cuenta de dueño' }, { status: 400 });
    }

    const empleadoEliminar = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true, nombreCompleto: true, username: true, rol: true },
    });

    await prisma.usuario.delete({
      where: { id: usuarioId },
    });

    await registrarAuditoria({
      usuarioId: session.userId,
      nombreUsuario: session.nombreCompleto,
      rolUsuario: session.rol,
      accion: 'ELIMINACION',
      entidad: 'EMPLEADO',
      entidadId: usuarioId,
      detalles: `Baja/Eliminación de usuario del sistema: ${empleadoEliminar?.nombreCompleto} (${empleadoEliminar?.username})`,
      valoresAnteriores: empleadoEliminar,
      request,
    });

    return NextResponse.json({ success: true, message: 'Empleado eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    return NextResponse.json({ error: 'Error al eliminar empleado' }, { status: 500 });
  }
}
