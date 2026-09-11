import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dni = searchParams.get('dni');
    const search = searchParams.get('search');

    if (dni) {
      const cliente = await prisma.cliente.findUnique({
        where: { dni },
      });
      return NextResponse.json(cliente ? [cliente] : []);
    }

    const where: any = {};
    if (search) {
      where.OR = [
        { nombreCompleto: { contains: search } },
        { dni: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const clientes = await prisma.cliente.findMany({
      where,
      orderBy: { fechaCreacion: 'desc' },
      take: 20,
    });

    return NextResponse.json(clientes);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return NextResponse.json({ error: 'Error al consultar clientes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();

    if (!body.nombreCompleto || !body.dni) {
      return NextResponse.json(
        { error: 'Nombre completo y DNI son obligatorios' },
        { status: 400 }
      );
    }

    const existente = await prisma.cliente.findUnique({
      where: { dni: body.dni },
    });

    if (existente) {
      return NextResponse.json(existente);
    }

    const nuevoCliente = await prisma.cliente.create({
      data: {
        nombreCompleto: body.nombreCompleto.toUpperCase(),
        dni: body.dni,
        email: body.email || null,
        telefono: body.telefono || null,
        calle: body.calle ? body.calle.toUpperCase() : null,
        numero: body.numero || null,
        ciudad: body.ciudad ? body.ciudad.toUpperCase() : null,
        provincia: body.provincia ? body.provincia.toUpperCase() : null,
        pais: body.pais ? body.pais.toUpperCase() : 'ARGENTINA',
        codigoPostal: body.codigoPostal || null,
      },
    });

    return NextResponse.json(nuevoCliente, { status: 201 });
  } catch (error) {
    console.error('Error al crear cliente:', error);
    return NextResponse.json({ error: 'Error al guardar cliente' }, { status: 500 });
  }
}
