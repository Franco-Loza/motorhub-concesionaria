import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { registrarAuditoria } from '@/lib/auditoria';

export async function GET() {
  try {
    const sucursales = await prisma.sucursal.findMany({
      orderBy: [{ esCasaCentral: 'desc' }, { fechaCreacion: 'asc' }],
    });
    return NextResponse.json(sucursales);
  } catch (error) {
    console.error('Error al listar sucursales:', error);
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

    if (!body.nombre) {
      return NextResponse.json({ error: 'El nombre de la sucursal es obligatorio' }, { status: 400 });
    }

    if (body.esCasaCentral) {
      // Si esta es casa central, quitar la marca a las demás
      await prisma.sucursal.updateMany({
        where: { esCasaCentral: true },
        data: { esCasaCentral: false },
      });
    }

    const nuevaSucursal = await prisma.sucursal.create({
      data: {
        nombre: body.nombre.toUpperCase(),
        activa: body.activa !== undefined ? Boolean(body.activa) : true,
        esCasaCentral: Boolean(body.esCasaCentral),
        horarios: body.horarios ? body.horarios.toUpperCase() : null,
        email: body.email || null,
        telefono: body.telefono || null,
        whatsapp: body.whatsapp || null,
        calle: body.calle ? body.calle.toUpperCase() : null,
        numero: body.numero || null,
        pisoDepto: body.pisoDepto ? body.pisoDepto.toUpperCase() : null,
        ciudad: body.ciudad ? body.ciudad.toUpperCase() : null,
        provincia: body.provincia ? body.provincia.toUpperCase() : null,
        codigoPostal: body.codigoPostal || null,
      },
    });

    await registrarAuditoria({
      usuarioId: session.userId,
      nombreUsuario: session.nombreCompleto,
      rolUsuario: session.rol,
      accion: 'CREACION',
      entidad: 'SUCURSAL',
      entidadId: nuevaSucursal.id,
      detalles: `Creación de sede/sucursal: ${nuevaSucursal.nombre} (${nuevaSucursal.ciudad || 'Santa Fe'}) ${nuevaSucursal.esCasaCentral ? '[CASA CENTRAL]' : ''}`,
      valoresNuevos: nuevaSucursal,
      request,
    });

    return NextResponse.json(nuevaSucursal, { status: 201 });
  } catch (error) {
    console.error('Error al crear sucursal:', error);
    return NextResponse.json({ error: 'Error al registrar sucursal' }, { status: 500 });
  }
}
