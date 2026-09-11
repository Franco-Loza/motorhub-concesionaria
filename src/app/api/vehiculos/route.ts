import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { registrarAuditoria } from '@/lib/auditoria';

function formatVehiculo(v: any) {
  let imagenesUrls: string[] = [];
  if (v.imagenesUrls) {
    try {
      imagenesUrls = typeof v.imagenesUrls === 'string' ? JSON.parse(v.imagenesUrls) : v.imagenesUrls;
    } catch {
      imagenesUrls = [v.imagenesUrls];
    }
  }
  return {
    ...v,
    imagenesUrls: Array.isArray(imagenesUrls) ? imagenesUrls : [],
  };
}

// ──────────────────────────────────────────────
// GET /api/vehiculos (Optimizado para Catálogo Rápido)
// ──────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');
    const search = searchParams.get('search')?.trim();
    const estado = searchParams.get('estado');
    const minPrecio = searchParams.get('minPrecio');
    const maxPrecio = searchParams.get('maxPrecio');
    const combustible = searchParams.get('combustible');
    const limit = searchParams.get('limit');
    const includeDetails = searchParams.get('details') === 'true';

    const where: any = {};

    if (tipo && tipo !== 'TODOS') {
      where.tipoVehiculo = tipo.toUpperCase();
    }
    if (estado) {
      where.estado = estado.toUpperCase();
    }
    if (combustible) {
      where.combustible = combustible.toUpperCase();
    }

    if (minPrecio || maxPrecio) {
      where.precio = {};
      if (minPrecio) where.precio.gte = parseFloat(minPrecio);
      if (maxPrecio) where.precio.lte = parseFloat(maxPrecio);
    }

    if (search) {
      where.OR = [
        { marca: { contains: search, mode: 'insensitive' } },
        { modelo: { contains: search, mode: 'insensitive' } },
        { version: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Consulta con detalles clave para tarjetas
    const vehiculos = await prisma.vehiculo.findMany({
      where,
      include: {
        automovil: true,
        camion: true,
        embarcacion: true,
        motocicleta: true,
        motorhome: true,
      },
      orderBy: { fechaCreacion: 'desc' },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(vehiculos.map(formatVehiculo), {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    return NextResponse.json({ error: 'Error al recuperar vehículos' }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// POST /api/vehiculos (Creación de Vehículo)
// ──────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();

    const tipo = (body.tipoVehiculo || 'AUTOMOVIL').toUpperCase();

    if (!body.marca || !body.marca.trim() || !body.modelo || !body.modelo.trim() || !body.anio || !body.precio) {
      return NextResponse.json(
        { error: `${tipo === 'EMBARCACION' ? 'Astillero' : 'Marca'}, modelo, año y precio son obligatorios` },
        { status: 400 }
      );
    }

    if (!body.imagenesUrls || (Array.isArray(body.imagenesUrls) && body.imagenesUrls.length === 0)) {
      return NextResponse.json(
        { error: 'Debes incluir al menos 1 imagen real de la unidad en la publicación' },
        { status: 400 }
      );
    }

    if (tipo === 'EMBARCACION') {
      if (!body.marcaMotor || !body.marcaMotor.trim()) {
        return NextResponse.json({ error: 'El campo "Marca del Motor" es obligatorio para embarcaciones' }, { status: 400 });
      }
      if (!body.esloraMetros || parseFloat(body.esloraMetros) <= 0) {
        return NextResponse.json({ error: 'El campo "Eslora (m)" es obligatorio para embarcaciones' }, { status: 400 });
      }
      if (!body.mangaMetros || parseFloat(body.mangaMetros) <= 0) {
        return NextResponse.json({ error: 'El campo "Manga (m)" es obligatorio para embarcaciones' }, { status: 400 });
      }
      if (!body.puntalMetros || parseFloat(body.puntalMetros) <= 0) {
        return NextResponse.json({ error: 'El campo "Puntal (m)" es obligatorio para embarcaciones' }, { status: 400 });
      }
      if (!body.capacidadPersonas || parseInt(body.capacidadPersonas) <= 0) {
        return NextResponse.json({ error: 'El campo "Capacidad de Personas" es obligatorio para embarcaciones' }, { status: 400 });
      }
    }

    let imagenesUrlsStr: string | null = null;
    if (body.imagenesUrls && Array.isArray(body.imagenesUrls)) {
      imagenesUrlsStr = JSON.stringify(body.imagenesUrls);
    } else if (typeof body.imagenesUrls === 'string') {
      imagenesUrlsStr = body.imagenesUrls;
    }

    // Datos comunes del padre
    const vehiculoData: any = {
      tipoVehiculo: tipo,
      marca: body.marca.toUpperCase().trim(),
      modelo: body.modelo.toUpperCase().trim(),
      version: body.version ? body.version.toUpperCase().trim() : null,
      color: body.color ? body.color.toUpperCase().trim() : null,
      anio: parseInt(body.anio),
      precio: parseFloat(body.precio),
      kilometraje: body.kilometraje ? parseInt(body.kilometraje) : null,
      horasUso: body.horasUso ? parseInt(body.horasUso) : null,
      primeraMano: Boolean(body.primeraMano),
      combustible: body.combustible ? body.combustible.toUpperCase() : null,
      patente: body.patente ? body.patente.toUpperCase().trim() : null,
      vin: body.vin ? body.vin.toUpperCase().trim() : null,
      numeroMotor: body.numeroMotor ? body.numeroMotor.toUpperCase().trim() : null,
      tipoDireccion: body.tipoDireccion ? body.tipoDireccion.toUpperCase() : null,
      largoMetros: body.largoMetros ? parseFloat(body.largoMetros) : null,
      anchoMetros: body.anchoMetros ? parseFloat(body.anchoMetros) : null,
      altoMetros: body.altoMetros ? parseFloat(body.altoMetros) : null,
      pesoKg: body.pesoKg ? parseFloat(body.pesoKg) : null,
      capacidadTanqueCombustible: body.capacidadTanqueCombustible ? parseFloat(body.capacidadTanqueCombustible) : null,
      potencia: body.potencia ? parseInt(body.potencia) : null,
      torqueNm: body.torqueNm ? parseInt(body.torqueNm) : null,
      descripcion: body.descripcion || null,
      estado: body.estado ? body.estado.toUpperCase() : 'DISPONIBLE',
      imagenesUrls: imagenesUrlsStr,
      tieneAireAcondicionado: Boolean(body.tieneAireAcondicionado),
      tieneAppleCarplayAndroidAuto: Boolean(body.tieneAppleCarplayAndroidAuto),
      tieneCamaraRetroceso: Boolean(body.tieneCamaraRetroceso),
      tieneSensoresEstacionamiento: Boolean(body.tieneSensoresEstacionamiento),
      tieneTechoSolar: Boolean(body.tieneTechoSolar),
    };

    // Datos de la tabla hija según tipo
    if (tipo === 'AUTOMOVIL') {
      vehiculoData.automovil = {
        create: {
          tipoAutomovil: body.tipoAutomovil || null,
          motor: body.motor || null,
          transmision: body.transmision || null,
          traccion: body.traccion || null,
          tipoFrenosDelanteros: body.tipoFrenosDelanteros || null,
          tipoFrenosTraseros: body.tipoFrenosTraseros || null,
          tipoTapizado: body.tipoTapizado || null,
          capacidadBaulLitros: body.capacidadBaulLitros ? parseInt(body.capacidadBaulLitros) : null,
          cantidadPuertas: body.cantidadPuertas ? parseInt(body.cantidadPuertas) : null,
          cantidadAsientos: body.cantidadAsientos ? parseInt(body.cantidadAsientos) : null,
          aceleracion0a100: body.aceleracion0a100 ? parseFloat(body.aceleracion0a100) : null,
          velocidadMaximaKmh: body.velocidadMaximaKmh ? parseInt(body.velocidadMaximaKmh) : null,
          airbags: body.airbags ? parseInt(body.airbags) : null,
          consumoMixtoKmPorLitro: body.consumoMixtoKmPorLitro ? parseFloat(body.consumoMixtoKmPorLitro) : null,
          abs: Boolean(body.abs),
          controlEstabilidad: Boolean(body.controlEstabilidad),
          controlCruceroAdaptativo: Boolean(body.controlCruceroAdaptativo),
          asientosCuero: Boolean(body.asientosCuero),
          asientosElectricos: Boolean(body.asientosElectricos),
          arranqueBotonKeyless: Boolean(body.arranqueBotonKeyless),
          cargadorInalambrico: Boolean(body.cargadorInalambrico),
          lucesLedAutomaticas: Boolean(body.lucesLedAutomaticas),
          frenoEstacionamientoElectrico: Boolean(body.frenoEstacionamientoElectrico),
          alertaPuntoCiego: Boolean(body.alertaPuntoCiego),
        },
      };
    } else if (tipo === 'CAMION') {
      vehiculoData.camion = {
        create: {
          capacidadCargaKg: body.capacidadCargaKg ? parseFloat(body.capacidadCargaKg) : null,
          pesoBrutoVehicularKg: body.pesoBrutoVehicularKg ? parseFloat(body.pesoBrutoVehicularKg) : null,
          cantidadEjes: body.cantidadEjes ? parseInt(body.cantidadEjes) : null,
          distanciaEntreEjesMm: body.distanciaEntreEjesMm ? parseInt(body.distanciaEntreEjesMm) : null,
          tipoFreno: body.tipoFreno || null,
          suspension: body.suspension || null,
          neumaticosCantidad: body.neumaticosCantidad ? parseInt(body.neumaticosCantidad) : null,
          medidaNeumatico: body.medidaNeumatico || null,
          consumoPromedioL100km: body.consumoPromedioL100km ? parseFloat(body.consumoPromedioL100km) : null,
          tipoCarroceria: body.tipoCarroceria || null,
          aireAcondicionadoCabina: Boolean(body.aireAcondicionadoCabina),
          camaraRetroceso: Boolean(body.camaraRetroceso),
          sensoresEstacionamiento: Boolean(body.sensoresEstacionamiento),
          pantallaMultimedia: Boolean(body.pantallaMultimedia),
          frenosAireAbs: Boolean(body.frenosAireAbs),
          controlEstabilidadEsp: Boolean(body.controlEstabilidadEsp),
          butacaNeumatica: Boolean(body.butacaNeumatica),
          suspensionNeumaticaCabina: Boolean(body.suspensionNeumaticaCabina),
          controlCrucero: Boolean(body.controlCrucero),
          calefaccionAuxiliar: Boolean(body.calefaccionAuxiliar),
          frenoMotorRetarder: Boolean(body.frenoMotorRetarder),
          tacografoDigital: Boolean(body.tacografoDigital),
        },
      };
    } else if (tipo === 'EMBARCACION') {
      vehiculoData.embarcacion = {
        create: {
          esloraMetros: body.esloraMetros ? parseFloat(body.esloraMetros) : null,
          mangaMetros: body.mangaMetros ? parseFloat(body.mangaMetros) : null,
          puntalMetros: body.puntalMetros ? parseFloat(body.puntalMetros) : null,
          materialCasco: body.materialCasco || null,
          tipoEmbarcacion: body.tipoEmbarcacion || null,
          tipoMotor: body.tipoMotor || null,
          capacidadPersonas: body.capacidadPersonas ? parseInt(body.capacidadPersonas) : null,
          pesoMaximoKg: body.pesoMaximoKg ? parseFloat(body.pesoMaximoKg) : null,
          marcaMotor: body.marcaMotor || null,
          anioMotor: body.anioMotor ? parseInt(body.anioMotor) : null,
          motor0km: Boolean(body.motor0km),
          numeroMotores: body.numeroMotores ? parseInt(body.numeroMotores) : null,
          velocidadMaximaNudos: body.velocidadMaximaNudos ? parseFloat(body.velocidadMaximaNudos) : null,
          capacidadAguaDulceLitros: body.capacidadAguaDulceLitros ? parseFloat(body.capacidadAguaDulceLitros) : null,
          tieneTrailer: Boolean(body.tieneTrailer),
          bombaAchique: Boolean(body.bombaAchique),
          ecosonda: Boolean(body.ecosonda),
          escaleraPopa: Boolean(body.escaleraPopa),
          audio: Boolean(body.audio),
          toldoBimini: Boolean(body.toldoBimini),
          cerramientoCompleto: Boolean(body.cerramientoCompleto),
          malacateElectrico: Boolean(body.malacateElectrico),
          lucesNavegacion: Boolean(body.lucesNavegacion),
          radioVHF: Boolean(body.radioVHF),
          duchaPopa: Boolean(body.duchaPopa),
          barraSki: Boolean(body.barraSki),
          solariumProa: Boolean(body.solariumProa),
          mesaCockpit: Boolean(body.mesaCockpit),
          inodoroMarino: Boolean(body.inodoroMarino),
          heladeraNautica: Boolean(body.heladeraNautica),
        },
      };
    } else if (tipo === 'MOTOCICLETA') {
      vehiculoData.motocicleta = {
        create: {
          cilindradaCc: body.cilindradaCc ? parseInt(body.cilindradaCc) : null,
          motorTiempos: body.motorTiempos ? parseInt(body.motorTiempos) : null,
          estilo: body.estilo || null,
          tipoArranque: body.tipoArranque || null,
          transmisionMoto: body.transmisionMoto || null,
          refrigeracion: body.refrigeracion || null,
          alturaAsientoMm: body.alturaAsientoMm ? parseInt(body.alturaAsientoMm) : null,
          tipoLlanta: body.tipoLlanta || null,
          neumaticoDelantero: body.neumaticoDelantero || null,
          neumaticoTrasero: body.neumaticoTrasero || null,
          abs: Boolean(body.abs),
          controlTraccionTcs: Boolean(body.controlTraccionTcs),
          modosConduccion: Boolean(body.modosConduccion),
          quickshifter: Boolean(body.quickshifter),
          pantallaTftBluetooth: Boolean(body.pantallaTftBluetooth),
          lucesLed: Boolean(body.lucesLed),
          punosCalefaccionables: Boolean(body.punosCalefaccionables),
          controlCrucero: Boolean(body.controlCrucero),
          parabrisasRegulable: Boolean(body.parabrisasRegulable),
          puertoUsb12v: Boolean(body.puertoUsb12v),
          cubrepunosDefensas: Boolean(body.cubrepunosDefensas),
          caballeteCentral: Boolean(body.caballeteCentral),
        },
      };
    } else if (tipo === 'MOTORHOME') {
      vehiculoData.motorhome = {
        create: {
          capacidadCamas: body.capacidadCamas ? parseInt(body.capacidadCamas) : null,
          capacidadBateriasAh: body.capacidadBateriasAh ? parseInt(body.capacidadBateriasAh) : null,
          cantidadPisos: body.cantidadPisos ? parseInt(body.cantidadPisos) : null,
          capacidadTanqueAguaLitros: body.capacidadTanqueAguaLitros ? parseFloat(body.capacidadTanqueAguaLitros) : null,
          capacidadAguasGrisesLitros: body.capacidadAguasGrisesLitros ? parseFloat(body.capacidadAguasGrisesLitros) : null,
          capacidadAguasNegrasLitros: body.capacidadAguasNegrasLitros ? parseFloat(body.capacidadAguasNegrasLitros) : null,
          tieneCocina: Boolean(body.tieneCocina),
          tieneBano: Boolean(body.tieneBano),
          tieneDuchaExterior: Boolean(body.tieneDuchaExterior),
          tienePanelesSolares: Boolean(body.tienePanelesSolares),
          tieneCalefaccion: Boolean(body.tieneCalefaccion),
          tieneGenerador: Boolean(body.tieneGenerador),
          tieneTV: Boolean(body.tieneTV),
          toldoExterior: Boolean(body.toldoExterior),
          aireAcondicionadoHabitaculo: Boolean(body.aireAcondicionadoHabitaculo),
          inversorCorriente220v: Boolean(body.inversorCorriente220v),
          heladeraFreezer: Boolean(body.heladeraFreezer),
          termotanqueCalefon: Boolean(body.termotanqueCalefon),
          garrafaGasEnvasado: Boolean(body.garrafaGasEnvasado),
          escalonElectrico: Boolean(body.escalonElectrico),
          soporteBicicletasEnganche: Boolean(body.soporteBicicletasEnganche),
        },
      };
    }

    const nuevoVehiculo = await prisma.vehiculo.create({
      data: vehiculoData,
    });

    await registrarAuditoria({
      usuarioId: session?.userId,
      nombreUsuario: session?.nombreCompleto || 'USUARIO',
      rolUsuario: session?.rol || 'EMPLEADO',
      accion: 'CREACION',
      entidad: 'VEHICULO',
      entidadId: nuevoVehiculo.id,
      detalles: `Alta de vehículo: ${nuevoVehiculo.marca} ${nuevoVehiculo.modelo} ${nuevoVehiculo.version || ''} (${nuevoVehiculo.tipoVehiculo}) - USD $${nuevoVehiculo.precio.toLocaleString()}`,
      valoresNuevos: {
        marca: nuevoVehiculo.marca,
        modelo: nuevoVehiculo.modelo,
        version: nuevoVehiculo.version,
        tipoVehiculo: nuevoVehiculo.tipoVehiculo,
        precio: nuevoVehiculo.precio,
        anio: nuevoVehiculo.anio,
        estado: nuevoVehiculo.estado,
        patente: nuevoVehiculo.patente,
      },
      request,
    });

    return NextResponse.json(formatVehiculo(nuevoVehiculo), { status: 201 });
  } catch (error) {
    console.error('Error al guardar vehículo:', error);
    return NextResponse.json({ error: 'Error al registrar vehículo' }, { status: 500 });
  }
}
