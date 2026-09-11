import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { registrarAuditoria } from '@/lib/auditoria';

export async function GET(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || session.rol !== 'DUENO') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const empleados = await prisma.usuario.findMany({
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
        _count: {
          select: { ventas: true },
        },
      },
      orderBy: { fechaCreacion: 'desc' },
    });

    return NextResponse.json(empleados);
  } catch (error) {
    console.error('Error al listar empleados:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || session.rol !== 'DUENO') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const body = await request.json();

    if (!body.nombreCompleto || !body.username || !body.password) {
      return NextResponse.json(
        { error: 'Nombre completo, usuario y contraseña son obligatorios' },
        { status: 400 }
      );
    }

    const usernameExistente = await prisma.usuario.findUnique({
      where: { username: body.username },
    });

    if (usernameExistente) {
      return NextResponse.json(
        { error: 'El nombre de usuario ya está registrado' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const nuevoEmpleado = await prisma.usuario.create({
      data: {
        nombreCompleto: body.nombreCompleto.toUpperCase(),
        dni: body.dni || null,
        email: body.email || null,
        telefono: body.telefono || null,
        username: body.username,
        password: hashedPassword,
        rol: body.rol ? body.rol.toUpperCase() : 'EMPLEADO',
        activo: body.activo !== undefined ? Boolean(body.activo) : true,
      },
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

    await registrarAuditoria({
      usuarioId: session.userId,
      nombreUsuario: session.nombreCompleto,
      rolUsuario: session.rol,
      accion: 'CREACION',
      entidad: 'EMPLEADO',
      entidadId: nuevoEmpleado.id,
      detalles: `Alta de usuario del sistema: ${nuevoEmpleado.nombreCompleto} (Usuario: ${nuevoEmpleado.username}, Rol: ${nuevoEmpleado.rol})`,
      valoresNuevos: {
        nombreCompleto: nuevoEmpleado.nombreCompleto,
        username: nuevoEmpleado.username,
        rol: nuevoEmpleado.rol,
        email: nuevoEmpleado.email,
        activo: nuevoEmpleado.activo,
      },
      request,
    });

    return NextResponse.json(nuevoEmpleado, { status: 201 });
  } catch (error) {
    console.error('Error al crear empleado:', error);
    return NextResponse.json({ error: 'Error al registrar empleado' }, { status: 500 });
  }
}
