import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

// Rate limiter en memoria para prevenir spam de bots en el formulario público (máx. 10 consultas por minuto por IP)
const ipRateMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipRateMap.get(ip);

  if (!entry || now - entry.lastReset > RATE_LIMIT_WINDOW_MS) {
    ipRateMap.set(ip, { count: 1, lastReset: now });
    return false;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  entry.count += 1;
  return false;
}

export async function GET(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const estado = searchParams.get('estado');
    const tipo = searchParams.get('tipo');

    const where: any = {};
    if (estado && estado !== 'TODOS') where.estado = estado;
    if (tipo && tipo !== 'TODOS') where.tipoConsulta = tipo;

    const consultas = await prisma.consulta.findMany({
      where,
      include: {
        vehiculo: {
          select: {
            id: true,
            marca: true,
            modelo: true,
            version: true,
            precio: true,
            tipoVehiculo: true,
            imagenesUrls: true,
          },
        },
        empleadoAsignado: {
          select: {
            id: true,
            nombreCompleto: true,
            username: true,
          },
        },
      },
      orderBy: { fechaConsulta: 'desc' },
    });

    return NextResponse.json(consultas);
  } catch (error) {
    console.error('Error al obtener consultas:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Detección y limitación por IP
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes enviadas en poco tiempo. Por favor aguardá un minuto.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    const tipoConsulta = body.tipoConsulta || (body.vehiculoId ? 'VEHICULO' : 'GENERAL');
    const nombre = typeof body.nombreCliente === 'string' ? body.nombreCliente.trim() : 'CLIENTE WHATSAPP';
    const email = typeof body.emailCliente === 'string' ? body.emailCliente.trim() : '';
    const telefono = typeof body.telefonoCliente === 'string' ? body.telefonoCliente.trim() : '';
    const mensaje = typeof body.mensaje === 'string' ? body.mensaje.trim() : 'Consulta iniciada por WhatsApp';

    // Para clicks de WhatsApp o tasaciones, nombre puede ser opcional o por defecto
    if (!nombre || nombre.length < 2) {
      return NextResponse.json(
        { error: 'El nombre debe tener al menos 2 caracteres.' },
        { status: 400 }
      );
    }

    let datosUsadoJson = null;
    if (body.datosUsado) {
      datosUsadoJson = typeof body.datosUsado === 'string' ? body.datosUsado : JSON.stringify(body.datosUsado);
    }

    const nuevaConsulta = await prisma.consulta.create({
      data: {
        vehiculoId: body.vehiculoId ? parseInt(body.vehiculoId) : null,
        nombreCliente: nombre.toUpperCase(),
        emailCliente: email || null,
        telefonoCliente: telefono || null,
        mensaje: mensaje,
        tipoConsulta: tipoConsulta.toUpperCase(),
        estado: 'NUEVO',
        datosUsadoJson: datosUsadoJson,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Consulta registrada con éxito', data: nuevaConsulta },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al registrar consulta:', error);
    return NextResponse.json({ error: 'Error al procesar la consulta' }, { status: 500 });
  }
}
