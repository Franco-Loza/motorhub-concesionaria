import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { registrarAuditoria } from '@/lib/auditoria';

const includeAll = {
  automovil: true,
  camion: true,
  embarcacion: true,
  motocicleta: true,
  motorhome: true,
};

function formatVehiculo(v: any) {
  let imagenesUrls: string[] = [];
  try {
    if (v.imagenesUrls) imagenesUrls = JSON.parse(v.imagenesUrls);
  } catch {
    imagenesUrls = v.imagenesUrls ? [v.imagenesUrls] : [];
  }
  return { ...v, imagenesUrls };
}

// ──────────────────────────────────────────────
// GET /api/vehiculos/[id]
// ──────────────────────────────────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vehiculoId = parseInt(id);

    if (isNaN(vehiculoId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const vehiculo = await prisma.vehiculo.findUnique({
      where: { id: vehiculoId },
      include: includeAll,
    });

    if (!vehiculo) {
      return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 });
    }

    return NextResponse.json(formatVehiculo(vehiculo), {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Error al obtener vehículo:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// PUT /api/vehiculos/[id]
// ──────────────────────────────────────────────
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
    const vehiculoId = parseInt(id);
    const body = await request.json();

    // Obtener el vehículo actual con todas sus relaciones para snapshot de auditoría
    const vehiculoActual = await prisma.vehiculo.findUnique({
      where: { id: vehiculoId },
      include: includeAll,
    });

    if (!vehiculoActual) {
      return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 });
    }

    const tipo = vehiculoActual.tipoVehiculo;

    const parseNullableInt = (val: any): number | null => {
      if (val === undefined || val === null || val === '') return null;
      const num = parseInt(String(val), 10);
      return isNaN(num) ? null : num;
    };

    const parseNullableFloat = (val: any): number | null => {
      if (val === undefined || val === null || val === '') return null;
      const num = parseFloat(String(val));
      return isNaN(num) ? null : num;
    };

    let imagenesUrlsStr: string | null | undefined = undefined;
    if (body.imagenesUrls !== undefined) {
      if (Array.isArray(body.imagenesUrls)) {
        imagenesUrlsStr = JSON.stringify(body.imagenesUrls);
      } else if (typeof body.imagenesUrls === 'string') {
        imagenesUrlsStr = body.imagenesUrls;
      } else {
        imagenesUrlsStr = null;
      }
    }

    // Campos del padre
    const vehiculoUpdate: any = {};
    if (body.marca       !== undefined) vehiculoUpdate.marca       = body.marca.toUpperCase().trim();
    if (body.modelo      !== undefined) vehiculoUpdate.modelo      = body.modelo.toUpperCase().trim();
    if (body.version     !== undefined) vehiculoUpdate.version     = body.version ? body.version.toUpperCase().trim() : null;
    if (body.color       !== undefined) vehiculoUpdate.color       = body.color ? body.color.toUpperCase().trim() : null;
    if (body.anio        !== undefined) vehiculoUpdate.anio        = parseNullableInt(body.anio);
    if (body.precio      !== undefined) vehiculoUpdate.precio      = parseNullableFloat(body.precio);
    if (body.primeraMano !== undefined) vehiculoUpdate.primeraMano = Boolean(body.primeraMano);
    if (body.combustible !== undefined) vehiculoUpdate.combustible = body.combustible ? body.combustible.toUpperCase() : null;
    if (body.vin         !== undefined) vehiculoUpdate.vin         = body.vin ? body.vin.toUpperCase().trim() : null;
    if (body.numeroMotor !== undefined) vehiculoUpdate.numeroMotor = body.numeroMotor ? body.numeroMotor.toUpperCase().trim() : null;
    if (body.tipoDireccion !== undefined) vehiculoUpdate.tipoDireccion = body.tipoDireccion ? body.tipoDireccion.toUpperCase() : null;
    if (body.largoMetros !== undefined) vehiculoUpdate.largoMetros = parseNullableFloat(body.largoMetros);
    if (body.anchoMetros !== undefined) vehiculoUpdate.anchoMetros = parseNullableFloat(body.anchoMetros);
    if (body.altoMetros  !== undefined) vehiculoUpdate.altoMetros  = parseNullableFloat(body.altoMetros);
    if (body.pesoKg      !== undefined) vehiculoUpdate.pesoKg      = parseNullableFloat(body.pesoKg);
    if (body.capacidadTanqueCombustible !== undefined) vehiculoUpdate.capacidadTanqueCombustible = parseNullableFloat(body.capacidadTanqueCombustible);
    if (body.potencia    !== undefined) vehiculoUpdate.potencia    = parseNullableInt(body.potencia);
    if (body.torqueNm    !== undefined) vehiculoUpdate.torqueNm    = parseNullableInt(body.torqueNm);
    if (body.descripcion !== undefined) vehiculoUpdate.descripcion = body.descripcion || null;
    if (body.estado      !== undefined) vehiculoUpdate.estado      = body.estado.toUpperCase();
    if (imagenesUrlsStr  !== undefined) vehiculoUpdate.imagenesUrls = imagenesUrlsStr;
    if (body.tieneAireAcondicionado       !== undefined) vehiculoUpdate.tieneAireAcondicionado       = Boolean(body.tieneAireAcondicionado);
    if (body.tieneAppleCarplayAndroidAuto !== undefined) vehiculoUpdate.tieneAppleCarplayAndroidAuto = Boolean(body.tieneAppleCarplayAndroidAuto);
    if (body.tieneCamaraRetroceso         !== undefined) vehiculoUpdate.tieneCamaraRetroceso         = Boolean(body.tieneCamaraRetroceso);
    if (body.tieneSensoresEstacionamiento !== undefined) vehiculoUpdate.tieneSensoresEstacionamiento = Boolean(body.tieneSensoresEstacionamiento);
    if (body.tieneTechoSolar              !== undefined) vehiculoUpdate.tieneTechoSolar              = Boolean(body.tieneTechoSolar);

    // Kilometraje y Patente según condición 0 KM
    const is0km = body.primeraMano !== undefined ? Boolean(body.primeraMano) : vehiculoActual.primeraMano;
    if (tipo !== 'EMBARCACION') {
      if (is0km) {
        vehiculoUpdate.kilometraje = 0;
        vehiculoUpdate.patente = null;
      } else {
        if (body.kilometraje !== undefined) vehiculoUpdate.kilometraje = parseNullableInt(body.kilometraje);
        if (body.patente !== undefined) vehiculoUpdate.patente = body.patente ? body.patente.toUpperCase().trim() : null;
      }
    } else {
      if (is0km) {
        vehiculoUpdate.patente = null;
      } else {
        if (body.patente !== undefined) vehiculoUpdate.patente = body.patente ? body.patente.toUpperCase().trim() : null;
      }
      const isMotor0km = body.motor0km !== undefined ? Boolean(body.motor0km) : (vehiculoActual.embarcacion?.motor0km ?? false);
      if (isMotor0km) {
        vehiculoUpdate.horasUso = 0;
      } else if (body.horasUso !== undefined) {
        vehiculoUpdate.horasUso = parseNullableInt(body.horasUso);
      }
    }

    // Campos de la tabla hija según tipo
    if (tipo === 'AUTOMOVIL') {
      vehiculoUpdate.automovil = {
        update: {
          tipoAutomovil:         body.tipoAutomovil   !== undefined ? body.tipoAutomovil   || null : undefined,
          motor:                 body.motor            !== undefined ? body.motor            || null : undefined,
          transmision:           body.transmision      !== undefined ? body.transmision      || null : undefined,
          traccion:              body.traccion         !== undefined ? body.traccion         || null : undefined,
          tipoFrenosDelanteros:  body.tipoFrenosDelanteros !== undefined ? body.tipoFrenosDelanteros || null : undefined,
          tipoFrenosTraseros:    body.tipoFrenosTraseros   !== undefined ? body.tipoFrenosTraseros   || null : undefined,
          tipoTapizado:          body.tipoTapizado     !== undefined ? body.tipoTapizado     || null : undefined,
          capacidadBaulLitros:   body.capacidadBaulLitros   !== undefined ? parseNullableInt(body.capacidadBaulLitros) : undefined,
          cantidadPuertas:       body.cantidadPuertas       !== undefined ? parseNullableInt(body.cantidadPuertas) : undefined,
          cantidadAsientos:      body.cantidadAsientos      !== undefined ? parseNullableInt(body.cantidadAsientos) : undefined,
          aceleracion0a100:      body.aceleracion0a100      !== undefined ? parseNullableFloat(body.aceleracion0a100) : undefined,
          velocidadMaximaKmh:    body.velocidadMaximaKmh    !== undefined ? parseNullableInt(body.velocidadMaximaKmh) : undefined,
          airbags:               body.airbags               !== undefined ? parseNullableInt(body.airbags) : undefined,
          consumoMixtoKmPorLitro: body.consumoMixtoKmPorLitro !== undefined ? parseNullableFloat(body.consumoMixtoKmPorLitro) : undefined,
          abs:                   body.abs                   !== undefined ? Boolean(body.abs) : undefined,
          controlEstabilidad:    body.controlEstabilidad    !== undefined ? Boolean(body.controlEstabilidad) : undefined,
          controlCruceroAdaptativo: body.controlCruceroAdaptativo !== undefined ? Boolean(body.controlCruceroAdaptativo) : undefined,
          asientosCuero:         body.asientosCuero         !== undefined ? Boolean(body.asientosCuero) : undefined,
          asientosElectricos:    body.asientosElectricos    !== undefined ? Boolean(body.asientosElectricos) : undefined,
          arranqueBotonKeyless:  body.arranqueBotonKeyless  !== undefined ? Boolean(body.arranqueBotonKeyless) : undefined,
          cargadorInalambrico:   body.cargadorInalambrico   !== undefined ? Boolean(body.cargadorInalambrico) : undefined,
          lucesLedAutomaticas:   body.lucesLedAutomaticas   !== undefined ? Boolean(body.lucesLedAutomaticas) : undefined,
          frenoEstacionamientoElectrico: body.frenoEstacionamientoElectrico !== undefined ? Boolean(body.frenoEstacionamientoElectrico) : undefined,
          alertaPuntoCiego:      body.alertaPuntoCiego      !== undefined ? Boolean(body.alertaPuntoCiego) : undefined,
        },
      };
    } else if (tipo === 'CAMION') {
      vehiculoUpdate.camion = {
        update: {
          capacidadCargaKg:     body.capacidadCargaKg     !== undefined ? parseNullableFloat(body.capacidadCargaKg) : undefined,
          pesoBrutoVehicularKg: body.pesoBrutoVehicularKg !== undefined ? parseNullableFloat(body.pesoBrutoVehicularKg) : undefined,
          cantidadEjes:         body.cantidadEjes          !== undefined ? parseNullableInt(body.cantidadEjes) : undefined,
          distanciaEntreEjesMm: body.distanciaEntreEjesMm  !== undefined ? parseNullableInt(body.distanciaEntreEjesMm) : undefined,
          tipoFreno:            body.tipoFreno             !== undefined ? body.tipoFreno             || null : undefined,
          suspension:           body.suspension            !== undefined ? body.suspension            || null : undefined,
          neumaticosCantidad:   body.neumaticosCantidad    !== undefined ? parseNullableInt(body.neumaticosCantidad) : undefined,
          medidaNeumatico:      body.medidaNeumatico       !== undefined ? body.medidaNeumatico       || null : undefined,
          consumoPromedioL100km: body.consumoPromedioL100km !== undefined ? parseNullableFloat(body.consumoPromedioL100km) : undefined,
          tipoCarroceria:       body.tipoCarroceria        !== undefined ? body.tipoCarroceria        || null : undefined,
          aireAcondicionadoCabina: body.aireAcondicionadoCabina !== undefined ? Boolean(body.aireAcondicionadoCabina) : undefined,
          camaraRetroceso:         body.camaraRetroceso         !== undefined ? Boolean(body.camaraRetroceso) : undefined,
          sensoresEstacionamiento: body.sensoresEstacionamiento !== undefined ? Boolean(body.sensoresEstacionamiento) : undefined,
          pantallaMultimedia:      body.pantallaMultimedia      !== undefined ? Boolean(body.pantallaMultimedia) : undefined,
          frenosAireAbs:           body.frenosAireAbs           !== undefined ? Boolean(body.frenosAireAbs) : undefined,
          controlEstabilidadEsp:   body.controlEstabilidadEsp   !== undefined ? Boolean(body.controlEstabilidadEsp) : undefined,
          butacaNeumatica:         body.butacaNeumatica         !== undefined ? Boolean(body.butacaNeumatica) : undefined,
          suspensionNeumaticaCabina: body.suspensionNeumaticaCabina !== undefined ? Boolean(body.suspensionNeumaticaCabina) : undefined,
          controlCrucero:          body.controlCrucero          !== undefined ? Boolean(body.controlCrucero) : undefined,
          calefaccionAuxiliar:     body.calefaccionAuxiliar     !== undefined ? Boolean(body.calefaccionAuxiliar) : undefined,
          frenoMotorRetarder:      body.frenoMotorRetarder      !== undefined ? Boolean(body.frenoMotorRetarder) : undefined,
          tacografoDigital:        body.tacografoDigital        !== undefined ? Boolean(body.tacografoDigital) : undefined,
        },
      };
    } else if (tipo === 'EMBARCACION') {
      vehiculoUpdate.embarcacion = {
        update: {
          esloraMetros:            body.esloraMetros            !== undefined ? parseNullableFloat(body.esloraMetros) : undefined,
          mangaMetros:             body.mangaMetros             !== undefined ? parseNullableFloat(body.mangaMetros) : undefined,
          puntalMetros:            body.puntalMetros            !== undefined ? parseNullableFloat(body.puntalMetros) : undefined,
          materialCasco:           body.materialCasco           !== undefined ? body.materialCasco           || null : undefined,
          tipoEmbarcacion:         body.tipoEmbarcacion         !== undefined ? body.tipoEmbarcacion         || null : undefined,
          tipoMotor:               body.tipoMotor               !== undefined ? body.tipoMotor               || null : undefined,
          capacidadPersonas:       body.capacidadPersonas       !== undefined ? parseNullableInt(body.capacidadPersonas) : undefined,
          pesoMaximoKg:            body.pesoMaximoKg            !== undefined ? parseNullableFloat(body.pesoMaximoKg) : undefined,
          marcaMotor:              body.marcaMotor              !== undefined ? body.marcaMotor              || null : undefined,
          anioMotor:               body.anioMotor               !== undefined ? parseNullableInt(body.anioMotor) : undefined,
          motor0km:                body.motor0km                !== undefined ? Boolean(body.motor0km) : undefined,
          numeroMotores:           body.numeroMotores           !== undefined ? parseNullableInt(body.numeroMotores) : undefined,
          velocidadMaximaNudos:    body.velocidadMaximaNudos    !== undefined ? parseNullableFloat(body.velocidadMaximaNudos) : undefined,
          capacidadAguaDulceLitros: body.capacidadAguaDulceLitros !== undefined ? parseNullableFloat(body.capacidadAguaDulceLitros) : undefined,
          tieneTrailer:            body.tieneTrailer            !== undefined ? Boolean(body.tieneTrailer) : undefined,
          bombaAchique:            body.bombaAchique            !== undefined ? Boolean(body.bombaAchique) : undefined,
          ecosonda:                body.ecosonda                !== undefined ? Boolean(body.ecosonda) : undefined,
          escaleraPopa:            body.escaleraPopa            !== undefined ? Boolean(body.escaleraPopa) : undefined,
          audio:                   body.audio                   !== undefined ? Boolean(body.audio) : undefined,
          toldoBimini:             body.toldoBimini             !== undefined ? Boolean(body.toldoBimini) : undefined,
          cerramientoCompleto:     body.cerramientoCompleto     !== undefined ? Boolean(body.cerramientoCompleto) : undefined,
          malacateElectrico:       body.malacateElectrico       !== undefined ? Boolean(body.malacateElectrico) : undefined,
          lucesNavegacion:         body.lucesNavegacion         !== undefined ? Boolean(body.lucesNavegacion) : undefined,
          radioVHF:                body.radioVHF                !== undefined ? Boolean(body.radioVHF) : undefined,
          duchaPopa:               body.duchaPopa               !== undefined ? Boolean(body.duchaPopa) : undefined,
          barraSki:                body.barraSki                !== undefined ? Boolean(body.barraSki) : undefined,
          solariumProa:            body.solariumProa            !== undefined ? Boolean(body.solariumProa) : undefined,
          mesaCockpit:             body.mesaCockpit             !== undefined ? Boolean(body.mesaCockpit) : undefined,
          inodoroMarino:           body.inodoroMarino           !== undefined ? Boolean(body.inodoroMarino) : undefined,
          heladeraNautica:         body.heladeraNautica         !== undefined ? Boolean(body.heladeraNautica) : undefined,
        },
      };
    } else if (tipo === 'MOTOCICLETA') {
      vehiculoUpdate.motocicleta = {
        update: {
          cilindradaCc:          body.cilindradaCc          !== undefined ? parseNullableInt(body.cilindradaCc) : undefined,
          motorTiempos:          body.motorTiempos          !== undefined ? parseNullableInt(body.motorTiempos) : undefined,
          estilo:                body.estilo                !== undefined ? body.estilo                || null : undefined,
          tipoArranque:          body.tipoArranque          !== undefined ? body.tipoArranque          || null : undefined,
          transmisionMoto:       body.transmisionMoto       !== undefined ? body.transmisionMoto       || null : undefined,
          refrigeracion:         body.refrigeracion         !== undefined ? body.refrigeracion         || null : undefined,
          alturaAsientoMm:       body.alturaAsientoMm       !== undefined ? parseNullableInt(body.alturaAsientoMm) : undefined,
          tipoLlanta:            body.tipoLlanta            !== undefined ? body.tipoLlanta            || null : undefined,
          neumaticoDelantero:    body.neumaticoDelantero    !== undefined ? body.neumaticoDelantero    || null : undefined,
          neumaticoTrasero:      body.neumaticoTrasero      !== undefined ? body.neumaticoTrasero      || null : undefined,
          abs:                   body.abs                   !== undefined ? Boolean(body.abs) : undefined,
          controlTraccionTcs:    body.controlTraccionTcs    !== undefined ? Boolean(body.controlTraccionTcs) : undefined,
          modosConduccion:       body.modosConduccion       !== undefined ? Boolean(body.modosConduccion) : undefined,
          quickshifter:          body.quickshifter          !== undefined ? Boolean(body.quickshifter) : undefined,
          pantallaTftBluetooth:  body.pantallaTftBluetooth  !== undefined ? Boolean(body.pantallaTftBluetooth) : undefined,
          lucesLed:              body.lucesLed              !== undefined ? Boolean(body.lucesLed) : undefined,
          punosCalefaccionables: body.punosCalefaccionables !== undefined ? Boolean(body.punosCalefaccionables) : undefined,
          controlCrucero:        body.controlCrucero        !== undefined ? Boolean(body.controlCrucero) : undefined,
          parabrisasRegulable:   body.parabrisasRegulable   !== undefined ? Boolean(body.parabrisasRegulable) : undefined,
          puertoUsb12v:          body.puertoUsb12v          !== undefined ? Boolean(body.puertoUsb12v) : undefined,
          cubrepunosDefensas:    body.cubrepunosDefensas    !== undefined ? Boolean(body.cubrepunosDefensas) : undefined,
          caballeteCentral:      body.caballeteCentral      !== undefined ? Boolean(body.caballeteCentral) : undefined,
        },
      };
    } else if (tipo === 'MOTORHOME') {
      vehiculoUpdate.motorhome = {
        update: {
          capacidadCamas:              body.capacidadCamas              !== undefined ? parseNullableInt(body.capacidadCamas) : undefined,
          capacidadBateriasAh:         body.capacidadBateriasAh         !== undefined ? parseNullableInt(body.capacidadBateriasAh) : undefined,
          cantidadPisos:               body.cantidadPisos               !== undefined ? parseNullableInt(body.cantidadPisos) : undefined,
          capacidadTanqueAguaLitros:   body.capacidadTanqueAguaLitros   !== undefined ? parseNullableFloat(body.capacidadTanqueAguaLitros) : undefined,
          capacidadAguasGrisesLitros:  body.capacidadAguasGrisesLitros  !== undefined ? parseNullableFloat(body.capacidadAguasGrisesLitros) : undefined,
          capacidadAguasNegrasLitros:  body.capacidadAguasNegrasLitros  !== undefined ? parseNullableFloat(body.capacidadAguasNegrasLitros) : undefined,
          tieneCocina:                 body.tieneCocina                 !== undefined ? Boolean(body.tieneCocina) : undefined,
          tieneBano:                   body.tieneBano                   !== undefined ? Boolean(body.tieneBano) : undefined,
          tieneDuchaExterior:          body.tieneDuchaExterior          !== undefined ? Boolean(body.tieneDuchaExterior) : undefined,
          tienePanelesSolares:         body.tienePanelesSolares         !== undefined ? Boolean(body.tienePanelesSolares) : undefined,
          tieneCalefaccion:            body.tieneCalefaccion            !== undefined ? Boolean(body.tieneCalefaccion) : undefined,
          tieneGenerador:              body.tieneGenerador              !== undefined ? Boolean(body.tieneGenerador) : undefined,
          tieneTV:                     body.tieneTV                     !== undefined ? Boolean(body.tieneTV) : undefined,
          toldoExterior:               body.toldoExterior               !== undefined ? Boolean(body.toldoExterior) : undefined,
          aireAcondicionadoHabitaculo: body.aireAcondicionadoHabitaculo !== undefined ? Boolean(body.aireAcondicionadoHabitaculo) : undefined,
          inversorCorriente220v:       body.inversorCorriente220v       !== undefined ? Boolean(body.inversorCorriente220v) : undefined,
          heladeraFreezer:             body.heladeraFreezer             !== undefined ? Boolean(body.heladeraFreezer) : undefined,
          termotanqueCalefon:          body.termotanqueCalefon          !== undefined ? Boolean(body.termotanqueCalefon) : undefined,
          garrafaGasEnvasado:          body.garrafaGasEnvasado          !== undefined ? Boolean(body.garrafaGasEnvasado) : undefined,
          escalonElectrico:            body.escalonElectrico            !== undefined ? Boolean(body.escalonElectrico) : undefined,
          soporteBicicletasEnganche:   body.soporteBicicletasEnganche   !== undefined ? Boolean(body.soporteBicicletasEnganche) : undefined,
        },
      };
    }

    const actualizado = await prisma.vehiculo.update({
      where: { id: vehiculoId },
      data: vehiculoUpdate,
      include: includeAll,
    });

    // Determinar tipo de acción específica
    let accionAuditoria: 'CAMBIO_PRECIO' | 'CAMBIO_ESTADO' | 'MODIFICACION' = 'MODIFICACION';
    let descripcionAuditoria = `Modificación de ficha técnica: ${actualizado.marca} ${actualizado.modelo} ${actualizado.version || ''}`;

    if (vehiculoActual.precio !== actualizado.precio) {
      accionAuditoria = 'CAMBIO_PRECIO';
      descripcionAuditoria = `Cambio de precio en ${actualizado.marca} ${actualizado.modelo}: de USD $${vehiculoActual.precio.toLocaleString()} a USD $${actualizado.precio.toLocaleString()}`;
    } else if (vehiculoActual.estado !== actualizado.estado) {
      accionAuditoria = 'CAMBIO_ESTADO';
      descripcionAuditoria = `Cambio de estado en ${actualizado.marca} ${actualizado.modelo}: de ${vehiculoActual.estado} a ${actualizado.estado}`;
    }

    const createVehiculoSnapshot = (v: any) => {
      if (!v) return null;
      const snapshot: Record<string, any> = {
        marca: v.marca,
        modelo: v.modelo,
        version: v.version,
        anio: v.anio,
        precio: v.precio,
        color: v.color,
        combustible: v.combustible,
        estado: v.estado,
        primeraMano: v.primeraMano,
        kilometraje: v.kilometraje,
        horasUso: v.horasUso,
        patente: v.patente,
        vin: v.vin,
        numeroMotor: v.numeroMotor,
        potencia: v.potencia,
        torqueNm: v.torqueNm,
        tipoDireccion: v.tipoDireccion,
        capacidadTanqueCombustible: v.capacidadTanqueCombustible,
        largoMetros: v.largoMetros,
        anchoMetros: v.anchoMetros,
        altoMetros: v.altoMetros,
        pesoKg: v.pesoKg,
        descripcion: v.descripcion,
        tieneAireAcondicionado: v.tieneAireAcondicionado,
        tieneAppleCarplayAndroidAuto: v.tieneAppleCarplayAndroidAuto,
        tieneCamaraRetroceso: v.tieneCamaraRetroceso,
        tieneSensoresEstacionamiento: v.tieneSensoresEstacionamiento,
        tieneTechoSolar: v.tieneTechoSolar,
      };

      if (v.automovil) {
        snapshot.tipoAutomovil = v.automovil.tipoAutomovil;
        snapshot.motor = v.automovil.motor;
        snapshot.transmision = v.automovil.transmision;
        snapshot.traccion = v.automovil.traccion;
        snapshot.tipoTapizado = v.automovil.tipoTapizado;
        snapshot.capacidadBaulLitros = v.automovil.capacidadBaulLitros;
        snapshot.cantidadPuertas = v.automovil.cantidadPuertas;
        snapshot.cantidadAsientos = v.automovil.cantidadAsientos;
        snapshot.aceleracion0a100 = v.automovil.aceleracion0a100;
        snapshot.velocidadMaximaKmh = v.automovil.velocidadMaximaKmh;
        snapshot.airbags = v.automovil.airbags;
        snapshot.consumoMixtoKmPorLitro = v.automovil.consumoMixtoKmPorLitro;
        snapshot.abs = v.automovil.abs;
        snapshot.controlEstabilidad = v.automovil.controlEstabilidad;
        snapshot.controlCruceroAdaptativo = v.automovil.controlCruceroAdaptativo;
        snapshot.asientosCuero = v.automovil.asientosCuero;
        snapshot.asientosElectricos = v.automovil.asientosElectricos;
        snapshot.arranqueBotonKeyless = v.automovil.arranqueBotonKeyless;
        snapshot.cargadorInalambrico = v.automovil.cargadorInalambrico;
        snapshot.lucesLedAutomaticas = v.automovil.lucesLedAutomaticas;
        snapshot.frenoEstacionamientoElectrico = v.automovil.frenoEstacionamientoElectrico;
        snapshot.alertaPuntoCiego = v.automovil.alertaPuntoCiego;
      } else if (v.camion) {
        snapshot.capacidadCargaKg = v.camion.capacidadCargaKg;
        snapshot.pesoBrutoVehicularKg = v.camion.pesoBrutoVehicularKg;
        snapshot.cantidadEjes = v.camion.cantidadEjes;
        snapshot.distanciaEntreEjesMm = v.camion.distanciaEntreEjesMm;
        snapshot.tipoFreno = v.camion.tipoFreno;
        snapshot.suspension = v.camion.suspension;
        snapshot.neumaticosCantidad = v.camion.neumaticosCantidad;
        snapshot.medidaNeumatico = v.camion.medidaNeumatico;
        snapshot.consumoPromedioL100km = v.camion.consumoPromedioL100km;
        snapshot.tipoCarroceria = v.camion.tipoCarroceria;
        snapshot.aireAcondicionadoCabina = v.camion.aireAcondicionadoCabina;
        snapshot.camaraRetroceso = v.camion.camaraRetroceso;
        snapshot.sensoresEstacionamiento = v.camion.sensoresEstacionamiento;
        snapshot.pantallaMultimedia = v.camion.pantallaMultimedia;
        snapshot.frenosAireAbs = v.camion.frenosAireAbs;
        snapshot.controlEstabilidadEsp = v.camion.controlEstabilidadEsp;
        snapshot.butacaNeumatica = v.camion.butacaNeumatica;
        snapshot.suspensionNeumaticaCabina = v.camion.suspensionNeumaticaCabina;
        snapshot.controlCrucero = v.camion.controlCrucero;
        snapshot.calefaccionAuxiliar = v.camion.calefaccionAuxiliar;
        snapshot.frenoMotorRetarder = v.camion.frenoMotorRetarder;
        snapshot.tacografoDigital = v.camion.tacografoDigital;
      } else if (v.embarcacion) {
        snapshot.esloraMetros = v.embarcacion.esloraMetros;
        snapshot.mangaMetros = v.embarcacion.mangaMetros;
        snapshot.puntalMetros = v.embarcacion.puntalMetros;
        snapshot.materialCasco = v.embarcacion.materialCasco;
        snapshot.tipoEmbarcacion = v.embarcacion.tipoEmbarcacion;
        snapshot.tipoMotor = v.embarcacion.tipoMotor;
        snapshot.capacidadPersonas = v.embarcacion.capacidadPersonas;
        snapshot.marcaMotor = v.embarcacion.marcaMotor;
        snapshot.anioMotor = v.embarcacion.anioMotor;
        snapshot.motor0km = v.embarcacion.motor0km;
        snapshot.numeroMotores = v.embarcacion.numeroMotores;
        snapshot.velocidadMaximaNudos = v.embarcacion.velocidadMaximaNudos;
        snapshot.capacidadAguaDulceLitros = v.embarcacion.capacidadAguaDulceLitros;
        snapshot.tieneTrailer = v.embarcacion.tieneTrailer;
        snapshot.bombaAchique = v.embarcacion.bombaAchique;
        snapshot.ecosonda = v.embarcacion.ecosonda;
        snapshot.escaleraPopa = v.embarcacion.escaleraPopa;
        snapshot.audio = v.embarcacion.audio;
        snapshot.toldoBimini = v.embarcacion.toldoBimini;
        snapshot.cerramientoCompleto = v.embarcacion.cerramientoCompleto;
        snapshot.malacateElectrico = v.embarcacion.malacateElectrico;
        snapshot.lucesNavegacion = v.embarcacion.lucesNavegacion;
        snapshot.radioVHF = v.embarcacion.radioVHF;
        snapshot.duchaPopa = v.embarcacion.duchaPopa;
        snapshot.barraSki = v.embarcacion.barraSki;
        snapshot.solariumProa = v.embarcacion.solariumProa;
        snapshot.mesaCockpit = v.embarcacion.mesaCockpit;
        snapshot.inodoroMarino = v.embarcacion.inodoroMarino;
        snapshot.heladeraNautica = v.embarcacion.heladeraNautica;
      } else if (v.motocicleta) {
        snapshot.cilindradaCc = v.motocicleta.cilindradaCc;
        snapshot.motorTiempos = v.motocicleta.motorTiempos;
        snapshot.estilo = v.motocicleta.estilo;
        snapshot.tipoArranque = v.motocicleta.tipoArranque;
        snapshot.transmisionMoto = v.motocicleta.transmisionMoto;
        snapshot.refrigeracion = v.motocicleta.refrigeracion;
        snapshot.alturaAsientoMm = v.motocicleta.alturaAsientoMm;
        snapshot.abs = v.motocicleta.abs;
        snapshot.controlTraccionTcs = v.motocicleta.controlTraccionTcs;
        snapshot.modosConduccion = v.motocicleta.modosConduccion;
        snapshot.quickshifter = v.motocicleta.quickshifter;
        snapshot.pantallaTftBluetooth = v.motocicleta.pantallaTftBluetooth;
        snapshot.lucesLed = v.motocicleta.lucesLed;
        snapshot.punosCalefaccionables = v.motocicleta.punosCalefaccionables;
        snapshot.controlCrucero = v.motocicleta.controlCrucero;
        snapshot.parabrisasRegulable = v.motocicleta.parabrisasRegulable;
        snapshot.puertoUsb12v = v.motocicleta.puertoUsb12v;
        snapshot.cubrepunosDefensas = v.motocicleta.cubrepunosDefensas;
        snapshot.caballeteCentral = v.motocicleta.caballeteCentral;
      } else if (v.motorhome) {
        snapshot.capacidadCamas = v.motorhome.capacidadCamas;
        snapshot.capacidadBateriasAh = v.motorhome.capacidadBateriasAh;
        snapshot.cantidadPisos = v.motorhome.cantidadPisos;
        snapshot.capacidadTanqueAguaLitros = v.motorhome.capacidadTanqueAguaLitros;
        snapshot.tieneCocina = v.motorhome.tieneCocina;
        snapshot.tieneBano = v.motorhome.tieneBano;
        snapshot.tieneDuchaExterior = v.motorhome.tieneDuchaExterior;
        snapshot.tienePanelesSolares = v.motorhome.tienePanelesSolares;
        snapshot.tieneCalefaccion = v.motorhome.tieneCalefaccion;
        snapshot.tieneGenerador = v.motorhome.tieneGenerador;
        snapshot.tieneTV = v.motorhome.tieneTV;
        snapshot.toldoExterior = v.motorhome.toldoExterior;
        snapshot.aireAcondicionadoHabitaculo = v.motorhome.aireAcondicionadoHabitaculo;
        snapshot.inversorCorriente220v = v.motorhome.inversorCorriente220v;
        snapshot.heladeraFreezer = v.motorhome.heladeraFreezer;
        snapshot.termotanqueCalefon = v.motorhome.termotanqueCalefon;
        snapshot.garrafaGasEnvasado = v.motorhome.garrafaGasEnvasado;
        snapshot.escalonElectrico = v.motorhome.escalonElectrico;
        snapshot.soporteBicicletasEnganche = v.motorhome.soporteBicicletasEnganche;
      }

      return snapshot;
    };

    await registrarAuditoria({
      usuarioId: session?.userId,
      nombreUsuario: session?.nombreCompleto || 'USUARIO',
      rolUsuario: session?.rol || 'EMPLEADO',
      accion: accionAuditoria,
      entidad: 'VEHICULO',
      entidadId: actualizado.id,
      detalles: descripcionAuditoria,
      valoresAnteriores: createVehiculoSnapshot(vehiculoActual),
      valoresNuevos: createVehiculoSnapshot(actualizado),
      request,
    });

    return NextResponse.json(formatVehiculo(actualizado));
  } catch (error) {
    console.error('Error al actualizar vehículo:', error);
    return NextResponse.json({ error: 'Error al actualizar vehículo' }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// DELETE /api/vehiculos/[id]
// ──────────────────────────────────────────────
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || session.rol !== 'DUENO') {
      return NextResponse.json({ error: 'Acceso denegado: solo el dueño puede eliminar vehículos' }, { status: 403 });
    }

    const { id } = await params;
    const vehiculoId = parseInt(id);

    const vehiculoAEliminar = await prisma.vehiculo.findUnique({
      where: { id: vehiculoId },
    });

    if (!vehiculoAEliminar) {
      return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 });
    }

    // onDelete: Cascade en el schema elimina automáticamente la tabla hija
    await prisma.vehiculo.delete({
      where: { id: vehiculoId },
    });

    await registrarAuditoria({
      usuarioId: session.userId,
      nombreUsuario: session.nombreCompleto,
      rolUsuario: session.rol,
      accion: 'ELIMINACION',
      entidad: 'VEHICULO',
      entidadId: vehiculoId,
      detalles: `Eliminación/Baja de vehículo del stock: ${vehiculoAEliminar.marca} ${vehiculoAEliminar.modelo} ${vehiculoAEliminar.version || ''} (ID: ${vehiculoId}) - Precio: USD $${vehiculoAEliminar.precio.toLocaleString()}`,
      valoresAnteriores: {
        marca: vehiculoAEliminar.marca,
        modelo: vehiculoAEliminar.modelo,
        precio: vehiculoAEliminar.precio,
        tipoVehiculo: vehiculoAEliminar.tipoVehiculo,
        patente: vehiculoAEliminar.patente,
      },
      request,
    });

    return NextResponse.json({ success: true, message: 'Vehículo eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar vehículo:', error);
    return NextResponse.json({ error: 'Error al eliminar vehículo' }, { status: 500 });
  }
}
