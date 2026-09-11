'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCompare } from '@/context/CompareContext';
import {
  Car,
  Truck,
  Ship,
  Bike,
  Home,
  Calendar,
  Gauge,
  Fuel,
  ShieldCheck,
  CheckCircle2,
  Calculator,
  MessageSquare,
  ChevronLeft,
  Share2,
  Phone,
  Send,
  Sparkles,
  Info,
  Anchor,
  Compass,
  Waves,
  Zap,
  Printer,
  FileText,
  Scale,
} from 'lucide-react';

function formatTexto(str: any): string {
  if (str === null || str === undefined || str === '') return 'No especificado';
  if (typeof str !== 'string') return String(str);

  const clean = str.trim().toUpperCase();

  const map: Record<string, string> = {
    // Embarcación - Propulsión
    FUERA_DE_BORDA: 'Fuera de Borda',
    DENTRO_FUERA: 'Dentro-Fuera (Stern Drive/Pata)',
    INTERNA: 'Línea de Eje/Intraborda',
    LINEA_DE_EJE: 'Línea de Eje/Intraborda',
    JET: 'Turbina/Jet Drive',
    TURBINA_JET: 'Turbina/Jet Drive',
    VELA: 'Velas con Motor Auxiliar',

    // Embarcación - Casco
    FIBRA_DE_VIDRIO: 'Fibra de Vidrio (P.R.F.V.)',
    ALUMINIO: 'Aluminio Naval',
    MADERA: 'Madera Tratada',
    ACERO: 'Acero Naval',
    GOMON: 'Gomón Semirrígido',
    NEOPRENO_HYPALON: 'Neopreno Hypalon/PVC',
    PRFV: 'Fibra de Vidrio (P.R.F.V.)',

    // Embarcación - Tipos
    LANCHA: 'Lancha Open/Cuddy',
    CRUCERO: 'Crucero',
    VELERO: 'Velero',
    YATE: 'Yate de Lujo',
    CATAMARAN: 'Catamarán Náutico',
    SEMIRRIGIDO: 'Semirrígido/Gomón',
    JET_SKI: 'Moto de Agua/Jet Ski',
    MOTO_DE_AGUA: 'Moto de Agua/Jet Ski',
    SEEKER: 'Bote/Tracker',
    TRACKER: 'Bote/Tracker',

    // Automóvil - Carrocería
    SEDAN: 'Sedán',
    HATCHBACK: 'Hatchback',
    SUV: 'SUV/Crossover',
    PICKUP: 'Pick-Up',
    COUPE: 'Coupé',
    DEPORTIVO: 'Deportivo',
    CONVERTIBLE: 'Convertible/Cabrio',
    MONOVOLUMEN: 'Monovolumen/Minivan',
    RURAL: 'Rural/Familiar',
    UTILITARIO: 'Utilitario/Furgón',

    // Transmisión
    AUTOMATICA: 'Automática',
    MANUAL: 'Manual',
    SECUENCIAL: 'Secuencial/Doble Embrague (DSG/PDK)',
    CVT: 'Automática Continuamente Variable (CVT)',

    // Tracción
    DELANTERA: 'Delantera (FWD)',
    TRASERA: 'Trasera (RWD)',
    INTEGRAL: 'Tracción Integral (AWD/4x4)',
    '4X4': 'Tracción 4x4',
    '4X2': 'Tracción 4x2',

    // Tapizados & Frenos
    CUERO: 'Cuero Premium',
    TELA: 'Tela Textil',
    ALCANTARA: 'Alcántara Deportiva',
    CUERO_ECOLOGICO: 'Cuero Ecológico/Sintético',
    MIXTO: 'Mixto Cuero y Tela',
    DISCO_VENTILADO: 'Discos Ventilados',
    DISCO: 'Discos Sólidos',
    TAMBOR: 'Tambores',
    CARBONO_CERAMICO: 'Carbón Cerámico de Alto Rendimiento',

    // Combustible
    NAFTA: 'Nafta',
    DIESEL: 'Diésel',
    GNC: 'Nafta/GNC',
    HIBRIDO: 'Híbrido Convencional (HEV)',
    HIBRIDO_ENCHUFABLE: 'Híbrido Enchufable (PHEV)',
    ELECTRICO: '100% Eléctrico (BEV)',

    // Camión - Carrocería & Mecánica
    CHASIS: 'Chasis Cabina',
    SEMI_REMOLQUE: 'Semi-Remolque',
    VOLCADOR: 'Volcador/Volquete',
    FURGON: 'Furgón Paquetero/Carga General',
    FRIGORIFICO: 'Furgón Frigorífico/Térmico',
    TRACTOR: 'Tractor de Carretera',
    TANQUE: 'Tanque Cisterna',
    PLANCHA_AUXILIO: 'Plancha de Auxilio Mecánico',
    HORMIGONERO: 'Hormigonero/Mixer',
    PORTACONTENEDOR: 'Portacontenedor',
    SILO: 'Tolva/Silo Granelero',
    AIRE: 'Frenos de Aire Comprimido con ABS',
    HIDRAULICO: 'Frenos Hidráulicos con Servo',
    DISCO_TOTAL: 'Frenos a Disco en Todos los Ejes',
    TAMBOR_TOTAL: 'Frenos a Tambor Reforzados',
    NEUMATICA: 'Suspensión Neumática Integral',
    ELASTICOS: 'Elásticos Mecánicos Reforzados',
    MECANICA: 'Elásticos/Mecánica',

    // Moto
    NAKED: 'Naked/Roadster',
    DEPORTIVA: 'Deportiva/Supersport',
    CUSTOM: 'Custom/Chopper/Cruiser',
    SCOOTER: 'Scooter/Maxiscooter',
    TOURING: 'Touring/Trail/Adventure',
    TRAIL: 'Trail/Adventure',
    ENDURO: 'Enduro/Cross',
    CAFE_RACER: 'Café Racer/Scrambler',
    ON_OFF: 'On-Off/Doble Propósito',
    PISTA: 'Sport/Pista',
    CALLE: 'Calle/Street',
    PATADA: 'Arranque a Patada',
    ELECTRICO_PATADA: 'Arranque Eléctrico y a Patada',
    CADENA: 'Cadena con O-Rings',
    CORREA: 'Correa Dentada',
    CARDAN: 'Cardán',
    AUTOMATICA_CVT: 'Automática por Variador (CVT)',
    LIQUIDA: 'Refrigeración Líquida',
    ACEITE: 'Refrigeración por Aire y Aceite',
    ALEACION: 'Aleación de Aluminio',
    RAYOS: 'Rayos Cruzados',
    FIBRA_CARBONO: 'Fibra de Carbono',

    // Motorhome
    CAPUCHINA: 'Capuchina (Cama sobre cabina)',
    CAMPER_VAN: 'Camper Van (Furgón Adaptado)',
    CASA_RODANTE: 'Casa Rodante de Arrastre',
    CAMPER_PICKUP: 'Camper Desmontable sobre Pick-Up',

    // Tipo General
    AUTOMOVIL: 'Automóvil',
    CAMION: 'Camión/Utilitario',
    EMBARCACION: 'Embarcación',
    MOTOCICLETA: 'Motocicleta',
    MOTORHOME: 'Motorhome',
  };

  if (map[clean]) {
    return map[clean];
  }

  // Fallback: reemplazar guiones bajos por espacios y aplicar formato capitalizado
  return str
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
}

export default function VehiculoDetallePage() {
  const params = useParams();
  const id = params?.id;

  const [vehiculo, setVehiculo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fotoActiva, setFotoActiva] = useState(0);

  // Financiación
  const [anticipo, setAnticipo] = useState<number>(0);
  const [cuotas, setCuotas] = useState<number>(24);
  const [resultadoFinanciacion, setResultadoFinanciacion] = useState<any>(null);

  // Formulario Consulta
  const [nombreConsulta, setNombreConsulta] = useState('');
  const [emailConsulta, setEmailConsulta] = useState('');
  const [telefonoConsulta, setTelefonoConsulta] = useState('');
  const [mensajeConsulta, setMensajeConsulta] = useState('');
  const [enviandoConsulta, setEnviandoConsulta] = useState(false);
  const [consultaEnviada, setConsultaEnviada] = useState(false);

  const calcularCreditoLocal = (precio: number, ant: number, cuot: number) => {
    const anticipoVal = Math.max(0, ant || 0);
    const cuotasVal = Math.min(120, Math.max(1, cuot || 12));
    const tasaInteresAnual = 45;

    if (anticipoVal >= precio) {
      setResultadoFinanciacion({
        precioTotal: precio,
        anticipo: anticipoVal,
        montoAFinanciar: 0,
        cuotas: cuotasVal,
        tasaInteresAnual,
        montoCuota: 0,
        totalFinanciado: 0,
        totalIntereses: 0,
      });
      return;
    }

    const montoAFinanciar = precio - anticipoVal;
    const tasaMensual = (tasaInteresAnual / 100) / 12;
    const cuotaMensual =
      (montoAFinanciar * (tasaMensual * Math.pow(1 + tasaMensual, cuotasVal))) /
      (Math.pow(1 + tasaMensual, cuotasVal) - 1);
    const totalFinanciado = cuotaMensual * cuotasVal;
    const totalIntereses = totalFinanciado - montoAFinanciar;

    setResultadoFinanciacion({
      precioTotal: precio,
      anticipo: anticipoVal,
      montoAFinanciar: Math.round(montoAFinanciar),
      cuotas: cuotasVal,
      tasaInteresAnual,
      montoCuota: Math.round(cuotaMensual),
      totalFinanciado: Math.round(totalFinanciado),
      totalIntereses: Math.round(totalIntereses),
    });
  };

  useEffect(() => {
    if (!id) return;
    const fetchVehiculo = async () => {
      try {
        const res = await fetch(`/api/vehiculos/${id}`);
        const data = await res.json();
        // Aplanar los campos de la tabla hija para acceso directo y conservar objetos
        const { automovil, camion, embarcacion, motocicleta, motorhome, ...resto } = data;
        const hijaData = automovil || camion || embarcacion || motocicleta || motorhome || {};
        const { id: _hijaId, vehiculoId: _vId, ...hijaFields } = hijaData;
        const vehiculoAplanado = {
          ...resto,
          ...hijaFields,
          automovil: automovil || {},
          camion: camion || {},
          embarcacion: embarcacion || {},
          motocicleta: motocicleta || {},
          motorhome: motorhome || {},
        };
        setVehiculo(vehiculoAplanado);
        if (vehiculoAplanado && vehiculoAplanado.precio) {
          const defaultAnticipo = Math.round(vehiculoAplanado.precio * 0.3);
          setAnticipo(defaultAnticipo);
          calcularCreditoLocal(vehiculoAplanado.precio, defaultAnticipo, 24);
        }
      } catch (err) {
        console.error('Error al cargar vehículo:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehiculo();
  }, [id]);

  const { addToCompare, isInCompare } = useCompare();
  const [dolarRate, setDolarRate] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/dolar')
      .then((res) => res.json())
      .then((data) => {
        if (data?.blue?.venta) {
          setDolarRate(data.blue.venta);
        }
      })
      .catch(console.error);
  }, []);

  const handleImprimirFicha = () => {
    window.print();
  };

  const handleWhatsAppClick = () => {
    if (!vehiculo) return;
    try {
      fetch('/api/consultas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipoConsulta: 'WHATSAPP',
          vehiculoId: vehiculo.id,
          nombreCliente: `Lead WhatsApp - ${vehiculo.marca} ${vehiculo.modelo}`,
          mensaje: `Interés en ficha técnica de ${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.version || ''} (${vehiculo.anio}) - USD $${vehiculo.precio.toLocaleString()}`,
        }),
      }).catch(() => {});
    } catch (e) {
      console.error(e);
    }
  };

  const handleRecalcular = (e: React.FormEvent) => {
    e.preventDefault();
    if (vehiculo) {
      calcularCreditoLocal(vehiculo.precio, anticipo, cuotas);
    }
  };

  const handleEnviarConsulta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreConsulta || !mensajeConsulta) return;

    setEnviandoConsulta(true);
    try {
      const res = await fetch('/api/consultas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehiculoId: vehiculo.id,
          nombreCliente: nombreConsulta,
          emailCliente: emailConsulta,
          telefonoCliente: telefonoConsulta,
          mensaje: mensajeConsulta,
        }),
      });
      if (res.ok) {
        setConsultaEnviada(true);
      }
    } catch (err) {
      console.error('Error al enviar consulta:', err);
    } finally {
      setEnviandoConsulta(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900">
        <Navbar />
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-24 flex-1 text-center">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-500 font-medium text-sm">Cargando ficha técnica...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!vehiculo || vehiculo.error) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900">
        <Navbar />
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-24 flex-1 text-center space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900 font-['Outfit']">Vehículo no encontrado</h2>
          <p className="text-zinc-500 text-sm">La unidad que estás buscando no existe o ya no se encuentra disponible.</p>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md shadow-emerald-500/20"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver al Catálogo
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const imagenes = vehiculo.imagenesUrls?.length
    ? vehiculo.imagenesUrls
    : ['https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80'];

  const renderFichaTecnica = () => {
    const tipo = vehiculo.tipoVehiculo;

    if (tipo === 'EMBARCACION') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-sm">
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Astillero</span>
            <span className="font-bold text-zinc-900">{vehiculo.marca}</span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Año del Casco</span>
            <span className="font-bold text-zinc-900">
              {vehiculo.anio} {vehiculo.primeraMano ? '(Casco 0 KM)' : ''}
            </span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Marca del Motor</span>
            <span className="font-bold text-zinc-900">{vehiculo.marcaMotor || 'No especificada'}</span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Año del Motor</span>
            <span className="font-bold text-zinc-900">
              {vehiculo.anioMotor ? `${vehiculo.anioMotor} ${vehiculo.motor0km ? '(Motor 0 KM)' : ''}` : 'No especificado'}
            </span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Horas de Uso del Motor</span>
            <span className="font-bold text-emerald-600">
              {vehiculo.motor0km ? '0 hs (Motor 0 KM/Sin Rodar)' : `${vehiculo.horasUso || 0} hs`}
            </span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Tipo de Propulsión</span>
            <span className="font-bold text-zinc-900">{formatTexto(vehiculo.tipoMotor || 'FUERA_DE_BORDA')}</span>
          </div>
          {vehiculo.numeroMotor && (
            <div>
              <span className="text-xs text-zinc-500 font-semibold uppercase block">N° Serie Motor</span>
              <span className="font-bold text-zinc-900">{vehiculo.numeroMotor}</span>
            </div>
          )}
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Eslora/Manga/Puntal</span>
            <span className="font-bold text-zinc-900">
              {vehiculo.esloraMetros || '-'}m/{vehiculo.mangaMetros || '-'}m/{vehiculo.puntalMetros || '-'}m
            </span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Material del Casco</span>
            <span className="font-bold text-zinc-900">{formatTexto(vehiculo.materialCasco || 'FIBRA_DE_VIDRIO')}</span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Capacidad Pasajeros</span>
            <span className="font-bold text-zinc-900">
              {vehiculo.capacidadPersonas ? `${vehiculo.capacidadPersonas} Tripulantes` : 'No especificada'}
            </span>
          </div>
          {vehiculo.pesoKg && (
            <div>
              <span className="text-xs text-zinc-500 font-semibold uppercase block">Peso Casco en Seco</span>
              <span className="font-bold text-zinc-900">{vehiculo.pesoKg.toLocaleString()} kg</span>
            </div>
          )}
          {vehiculo.pesoMaximoKg && (
            <div>
              <span className="text-xs text-zinc-500 font-semibold uppercase block">Carga Máxima</span>
              <span className="font-bold text-zinc-900">{vehiculo.pesoMaximoKg.toLocaleString()} kg</span>
            </div>
          )}
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Matrícula</span>
            <span className="font-bold text-zinc-700">
              {vehiculo.primeraMano ? 'A Matricular (CASCO 0km)' : (vehiculo.patente || 'Sin Matrícula')}
            </span>
          </div>
        </div>
      );
    }

    if (tipo === 'CAMION') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-sm">
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Año</span>
            <span className="font-bold text-zinc-900">{vehiculo.anio}</span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Kilometraje</span>
            <span className="font-bold text-emerald-600">
              {vehiculo.kilometraje ? `${vehiculo.kilometraje.toLocaleString()} km` : '0 km'}
            </span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Capacidad de Carga</span>
            <span className="font-bold text-zinc-900">
              {vehiculo.capacidadCargaKg ? `${vehiculo.capacidadCargaKg.toLocaleString()} kg` : 'No especificada'}
            </span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Peso Bruto Total</span>
            <span className="font-bold text-zinc-900">
              {vehiculo.pesoBrutoVehicularKg ? `${vehiculo.pesoBrutoVehicularKg.toLocaleString()} kg` : 'No especificado'}
            </span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Cantidad de Ejes</span>
            <span className="font-bold text-zinc-900">{vehiculo.cantidadEjes ? `${vehiculo.cantidadEjes} Ejes` : 'No especificado'}</span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Carrocería</span>
            <span className="font-bold text-zinc-900">{formatTexto(vehiculo.tipoCarroceria)}</span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Frenos/Suspensión</span>
            <span className="font-bold text-zinc-900">{formatTexto(vehiculo.tipoFreno)}/{formatTexto(vehiculo.suspension)}</span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Combustible</span>
            <span className="font-bold text-zinc-900">{formatTexto(vehiculo.combustible || 'DIESEL')}</span>
          </div>
        </div>
      );
    }

    if (tipo === 'MOTOCICLETA') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-sm">
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Año</span>
            <span className="font-bold text-zinc-900">{vehiculo.anio}</span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Kilometraje</span>
            <span className="font-bold text-emerald-600">
              {vehiculo.kilometraje ? `${vehiculo.kilometraje.toLocaleString()} km` : '0 km'}
            </span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Cilindrada</span>
            <span className="font-bold text-zinc-900">
              {vehiculo.cilindradaCc ? `${vehiculo.cilindradaCc} cc` : 'No especificada'}
            </span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Motor</span>
            <span className="font-bold text-zinc-900">
              {vehiculo.motorTiempos ? `${vehiculo.motorTiempos} Tiempos` : '4 Tiempos'}
            </span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Estilo/Segmento</span>
            <span className="font-bold text-zinc-900">{formatTexto(vehiculo.estilo)}</span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Refrigeración</span>
            <span className="font-bold text-zinc-900">{formatTexto(vehiculo.refrigeracion || 'LIQUIDA')}</span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Arranque</span>
            <span className="font-bold text-zinc-900">{formatTexto(vehiculo.tipoArranque || 'ELECTRICO')}</span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Combustible</span>
            <span className="font-bold text-zinc-900">{formatTexto(vehiculo.combustible || 'NAFTA')}</span>
          </div>
        </div>
      );
    }

    if (tipo === 'MOTORHOME') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-sm">
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Año</span>
            <span className="font-bold text-zinc-900">{vehiculo.anio}</span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Kilometraje</span>
            <span className="font-bold text-emerald-600">
              {vehiculo.kilometraje ? `${vehiculo.kilometraje.toLocaleString()} km` : '0 km'}
            </span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Capacidad de Camas</span>
            <span className="font-bold text-zinc-900">
              {vehiculo.capacidadCamas ? `${vehiculo.capacidadCamas} Plazas` : 'No especificada'}
            </span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Tanque de Agua</span>
            <span className="font-bold text-zinc-900">
              {vehiculo.capacidadTanqueAguaLitros ? `${vehiculo.capacidadTanqueAguaLitros} Lts` : 'No especificado'}
            </span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Baterías Auxiliares</span>
            <span className="font-bold text-zinc-900">
              {vehiculo.capacidadBateriasAh ? `${vehiculo.capacidadBateriasAh} Ah` : 'No especificado'}
            </span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Transmisión</span>
            <span className="font-bold text-zinc-900">{formatTexto(vehiculo.transmision || 'MANUAL')}</span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Combustible</span>
            <span className="font-bold text-zinc-900">{formatTexto(vehiculo.combustible || 'DIESEL')}</span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase block">Color</span>
            <span className="font-bold text-zinc-900">{formatTexto(vehiculo.color || 'Blanco')}</span>
          </div>
        </div>
      );
    }

    // Default: AUTOMOVIL
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-sm">
        <div>
          <span className="text-xs text-zinc-500 font-semibold uppercase block">Año</span>
          <span className="font-bold text-zinc-900">{vehiculo.anio}</span>
        </div>
        <div>
          <span className="text-xs text-zinc-500 font-semibold uppercase block">Kilometraje</span>
          <span className="font-bold text-emerald-600">
            {vehiculo.kilometraje ? `${vehiculo.kilometraje.toLocaleString()} km` : '0 km'}
          </span>
        </div>
        <div>
          <span className="text-xs text-zinc-500 font-semibold uppercase block">Combustible</span>
          <span className="font-bold text-zinc-900">{formatTexto(vehiculo.combustible)}</span>
        </div>
        <div>
          <span className="text-xs text-zinc-500 font-semibold uppercase block">Transmisión</span>
          <span className="font-bold text-zinc-900">{formatTexto(vehiculo.transmision)}</span>
        </div>
        <div>
          <span className="text-xs text-zinc-500 font-semibold uppercase block">Motorización</span>
          <span className="font-bold text-zinc-900">{vehiculo.motor || 'No especificado'}</span>
        </div>
        <div>
          <span className="text-xs text-zinc-500 font-semibold uppercase block">Tracción</span>
          <span className="font-bold text-zinc-900">{formatTexto(vehiculo.traccion)}</span>
        </div>
        <div>
          <span className="text-xs text-zinc-500 font-semibold uppercase block">Puertas/Asientos</span>
          <span className="font-bold text-zinc-900">
            {vehiculo.cantidadPuertas ? `${vehiculo.cantidadPuertas} Ptas` : '-'} {vehiculo.cantidadAsientos ? `(${vehiculo.cantidadAsientos} Asientos)` : ''}
          </span>
        </div>
        <div>
          <span className="text-xs text-zinc-500 font-semibold uppercase block">Color</span>
          <span className="font-bold text-zinc-900">{formatTexto(vehiculo.color)}</span>
        </div>
      </div>
    );
  };

  const renderEquipamiento = () => {
    const tipo = vehiculo.tipoVehiculo;

    if (tipo === 'EMBARCACION') {
      const items = [
        { label: 'Bomba de Achique Automática', active: vehiculo.bombaAchique },
        { label: 'Ecosonda/GPS Náutico', active: vehiculo.ecosonda },
        { label: 'Escalera de Popa Inoxidable', active: vehiculo.escaleraPopa },
        { label: 'Sistema de Audio Marino Bluetooth', active: vehiculo.audio },
        { label: 'Trailer de Transporte Homologado', active: vehiculo.tieneTrailer },
        { label: 'Toldo Bimini/Capota de Sol', active: vehiculo.toldoBimini },
        { label: 'Cerramiento Lona Completo', active: vehiculo.cerramientoCompleto },
        { label: 'Malacate/Molinete Eléctrico', active: vehiculo.malacateElectrico },
        { label: 'Luces de Navegación Reglamentarias', active: vehiculo.lucesNavegacion },
        { label: 'Radio VHF Marina/Antena', active: vehiculo.radioVHF },
        { label: 'Ducha de Popa Presurizada', active: vehiculo.duchaPopa },
        { label: 'Barra de Ski/Torre Wakeboard', active: vehiculo.barraSki },
        { label: 'Solárium de Proa con Colchonetas', active: vehiculo.solariumProa },
        { label: 'Mesa de Cockpit Desmontable', active: vehiculo.mesaCockpit },
        { label: 'Inodoro Marino/Baño', active: vehiculo.inodoroMarino },
        { label: 'Conservadora/Heladera Náutica', active: vehiculo.heladeraNautica },
      ].filter((item) => item.active);

      if (items.length === 0) return null;

      return (
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
            <Anchor className="w-4 h-4 text-emerald-600" />
            <span>Equipamiento Náutico y Confort</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (tipo === 'CAMION') {
      const items = [
        { label: 'Climatizador/Aire en Cabina', active: vehiculo.aireAcondicionadoCabina || vehiculo.tieneAireAcondicionado },
        { label: 'Cámara de Retroceso/Asistencia', active: vehiculo.camaraRetroceso || vehiculo.tieneCamaraRetroceso },
        { label: 'Sensores de Proximidad', active: vehiculo.sensoresEstacionamiento || vehiculo.tieneSensoresEstacionamiento },
        { label: 'Pantalla Multimedia Conectada', active: vehiculo.pantallaMultimedia },
        { label: 'Frenos de Aire con ABS', active: vehiculo.frenosAireAbs || vehiculo.abs || vehiculo.tipoFreno?.toLowerCase().includes('aire') },
        { label: 'Control de Estabilidad (ESP/ASR)', active: vehiculo.controlEstabilidadEsp || vehiculo.controlEstabilidad },
        { label: 'Butaca Conductor Neumática', active: vehiculo.butacaNeumatica },
        { label: 'Suspensión Neumática de Cabina', active: vehiculo.suspensionNeumaticaCabina },
        { label: 'Control de Velocidad Crucero', active: vehiculo.controlCrucero },
        { label: 'Calefacción Auxiliar/Climatizador', active: vehiculo.calefaccionAuxiliar },
        { label: 'Freno Motor Auxiliar/Retarder', active: vehiculo.frenoMotorRetarder },
        { label: 'Tacógrafo Digital Homologado', active: vehiculo.tacografoDigital },
      ].filter((item) => item.active);

      if (items.length === 0) return null;

      return (
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>Equipamiento y Asistencias de Carga</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (tipo === 'MOTOCICLETA') {
      const items = [
        { label: 'Frenos ABS (Doble Canal)', active: vehiculo.abs },
        { label: 'Control de Tracción (TCS)', active: vehiculo.controlTraccionTcs || vehiculo.controlEstabilidad },
        { label: 'Modos de Conducción (Riding Modes)', active: vehiculo.modosConduccion },
        { label: 'Quickshifter (Up y Down)', active: vehiculo.quickshifter },
        { label: 'Pantalla Digital TFT Bluetooth', active: vehiculo.pantallaTftBluetooth },
        { label: 'Iluminación Full LED', active: vehiculo.lucesLed },
        { label: 'Puños Calefaccionables', active: vehiculo.punosCalefaccionables },
        { label: 'Control de Velocidad Crucero', active: vehiculo.controlCrucero },
        { label: 'Parabrisas Regulable/Deflector', active: vehiculo.parabrisasRegulable },
        { label: 'Toma de Carga USB/12V', active: vehiculo.puertoUsb12v },
        { label: 'Cubrepuños y Defensas Laterales', active: vehiculo.cubrepunosDefensas },
        { label: 'Caballete Central y Lateral', active: vehiculo.caballeteCentral },
        { label: 'Arranque Eléctrico', active: vehiculo.tipoArranque?.toLowerCase().includes('eléc') || vehiculo.tipoArranque?.toLowerCase().includes('elec') },
        { label: 'Refrigeración Líquida', active: vehiculo.refrigeracion?.toLowerCase().includes('líq') || vehiculo.refrigeracion?.toLowerCase().includes('liq') },
      ].filter((item) => item.active);

      if (items.length === 0) return null;

      return (
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
            <Bike className="w-4 h-4 text-emerald-600" />
            <span>Equipamiento y Asistencias de Manejo</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (tipo === 'MOTORHOME') {
      const items = [
        { label: 'Cocina Completa/Anafe', active: vehiculo.tieneCocina },
        { label: 'Baño Completo con Ducha e Inodoro', active: vehiculo.tieneBano },
        { label: 'Ducha Exterior Presurizada', active: vehiculo.tieneDuchaExterior },
        { label: 'Paneles Solares Fotovoltaicos', active: vehiculo.tienePanelesSolares },
        { label: 'Calefacción Estacionaria/Tiro Balanceado', active: vehiculo.tieneCalefaccion },
        { label: 'Generador Eléctrico Integrado', active: vehiculo.tieneGenerador },
        { label: 'Smart TV/Antena/Audio', active: vehiculo.tieneTV },
        { label: 'Aire Acondicionado Habitáculo', active: vehiculo.aireAcondicionadoHabitaculo || vehiculo.tieneAireAcondicionado },
        { label: 'Toldo Exterior Extensible', active: vehiculo.toldoExterior },
        { label: 'Inversor de Corriente 12V a 220V', active: vehiculo.inversorCorriente220v },
        { label: 'Heladera con Freezer Trivalente/12V', active: vehiculo.heladeraFreezer },
        { label: 'Termotanque/Calefón Automático', active: vehiculo.termotanqueCalefon },
        { label: 'Instalación Gas Envasado', active: vehiculo.garrafaGasEnvasado },
        { label: 'Escalón de Acceso Eléctrico', active: vehiculo.escalonElectrico },
        { label: 'Soporte para Bicicletas/Enganche', active: vehiculo.soporteBicicletasEnganche },
      ].filter((item) => item.active);

      if (items.length === 0) return null;

      return (
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
            <Home className="w-4 h-4 text-emerald-600" />
            <span>Equipamiento y Confort de Vivienda</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // AUTOMOVIL
    const items = [
      { label: 'Aire Acondicionado/Climatizador', active: vehiculo.tieneAireAcondicionado },
      { label: 'Apple CarPlay/Android Auto', active: vehiculo.tieneAppleCarplayAndroidAuto },
      { label: 'Cámara de Retroceso/Visión 360°', active: vehiculo.tieneCamaraRetroceso },
      { label: 'Sensores de Estacionamiento', active: vehiculo.tieneSensoresEstacionamiento },
      { label: 'Techo Solar Panorámico', active: vehiculo.tieneTechoSolar },
      { label: 'Sistema de Frenos ABS', active: vehiculo.abs },
      { label: 'Control de Estabilidad (ESP)', active: vehiculo.controlEstabilidad },
      { label: 'Control Crucero Adaptativo', active: vehiculo.controlCruceroAdaptativo },
      { label: 'Tapizado en Cuero Premium', active: vehiculo.asientosCuero },
      { label: 'Butacas Eléctricas con Memoria', active: vehiculo.asientosElectricos },
      { label: 'Acceso Keyless y Arranque Botón', active: vehiculo.arranqueBotonKeyless },
      { label: 'Cargador Inalámbrico Celular', active: vehiculo.cargadorInalambrico },
      { label: 'Faros Full LED Automáticos', active: vehiculo.lucesLedAutomaticas },
      { label: 'Freno Mano Eléctrico/Auto-Hold', active: vehiculo.frenoEstacionamientoElectrico },
      { label: 'Alerta de Punto Ciego/Carril', active: vehiculo.alertaPuntoCiego },
      { label: `Tapizado: ${formatTexto(vehiculo.tipoTapizado)}`, active: Boolean(vehiculo.tipoTapizado) },
    ].filter((item) => item.active);

    if (items.length === 0) return null;

    return (
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
          <Car className="w-4 h-4 text-emerald-600" />
          <span>Equipamiento y Asistencias</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900">
      <Navbar />

      {/* Breadcrumb & Top Bar */}
      <div className="bg-white border-b border-zinc-200 py-4 print:hidden">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver al Inventario
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                addToCompare({
                  id: vehiculo.id,
                  marca: vehiculo.marca,
                  modelo: vehiculo.modelo,
                  version: vehiculo.version,
                  tipoVehiculo: vehiculo.tipoVehiculo,
                  precio: vehiculo.precio,
                  anio: vehiculo.anio,
                  kilometraje: vehiculo.kilometraje,
                  combustible: vehiculo.combustible,
                  imagenUrl: imagenes[0],
                });
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isInCompare(vehiculo.id)
                  ? 'bg-emerald-500 text-zinc-950 shadow-xs'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isInCompare(vehiculo.id) ? 'En Comparador' : 'Comparar'}</span>
            </button>

            <button
              onClick={handleImprimirFicha}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 transition-colors cursor-pointer"
              title="Descargar Ficha Técnica en PDF o Imprimir"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Ficha PDF</span>
            </button>

            <span className="text-xs font-bold uppercase px-3 py-1 bg-zinc-100 border border-zinc-200 text-zinc-700 rounded-lg">
              {formatTexto(vehiculo.tipoVehiculo)}
            </span>
            {vehiculo.primeraMano && (
              <span className="text-xs font-extrabold uppercase px-3 py-1 bg-emerald-500 text-zinc-950 rounded-lg shadow-sm shadow-emerald-500/20">
                0 KM
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Details */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-10 flex-1 print:hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Columna Izquierda: Galería y Especificaciones (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Galería Principal */}
            <div className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-xs space-y-4">
              <div className="relative h-96 sm:h-[480px] rounded-xl overflow-hidden bg-zinc-100 flex items-center justify-center">
                <img
                  src={imagenes[fotoActiva]}
                  alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Thumbnails */}
              {imagenes.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {imagenes.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setFotoActiva(idx)}
                      className={`relative w-24 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        fotoActiva === idx ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-zinc-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Ficha Técnica Detallada */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-6">
              <div className="border-b border-zinc-100 pb-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600 block mb-1">
                  Especificaciones Oficiales
                </span>
                <h2 className="text-2xl font-extrabold text-zinc-900 font-['Outfit']">
                  Ficha Técnica de la Unidad
                </h2>
              </div>

              {/* Grilla de Datos Principales según categoría */}
              {renderFichaTecnica()}

              {/* Descripción */}
              {vehiculo.descripcion && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">
                    Reseña Comercial y Estado
                  </h3>
                  <p className="text-sm text-zinc-700 leading-relaxed bg-zinc-50 p-4 rounded-xl border border-zinc-200 whitespace-pre-line">
                    {vehiculo.descripcion}
                  </p>
                </div>
              )}

              {/* Equipamiento y Confort según categoría */}
              {renderEquipamiento()}
            </div>

            {/* Simulador Financiero */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-6">
              <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 font-['Outfit']">
                    Simulador de Crédito Prendario
                  </h3>
                  <p className="text-xs text-zinc-500">Calculá tus cuotas mensuales con tasa fija y aprobación inmediata</p>
                </div>
              </div>

              <form onSubmit={handleRecalcular} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block mb-1.5">
                    Anticipo Inicial (USD)
                  </label>
                  <input
                    type="number"
                    value={anticipo}
                    onChange={(e) => setAnticipo(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-zinc-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block mb-1.5">
                    Plazo de Cuotas
                  </label>
                  <select
                    value={cuotas}
                    onChange={(e) => setCuotas(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-zinc-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  >
                    <option value={12}>12 Cuotas Mensuales</option>
                    <option value={24}>24 Cuotas Mensuales</option>
                    <option value={36}>36 Cuotas Mensuales</option>
                    <option value={48}>48 Cuotas Mensuales</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    Recalcular Cuotas
                  </button>
                </div>
              </form>

              {resultadoFinanciacion && (
                <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div>
                      <span className="text-[11px] text-zinc-500 uppercase font-semibold block">Monto Financiado</span>
                      <span className="text-lg font-bold text-zinc-900">
                        USD ${resultadoFinanciacion.montoAFinanciar?.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-zinc-500 uppercase font-semibold block">Plazo Elegido</span>
                      <span className="text-lg font-bold text-zinc-900">{resultadoFinanciacion.cuotas} Meses</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-zinc-500 uppercase font-semibold block">Tasa Anual (TNA)</span>
                      <span className="text-lg font-bold text-emerald-600">45% Fija</span>
                    </div>
                    <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 shadow-xs">
                      <span className="text-[10px] text-emerald-800 uppercase font-bold block">Cuota Estimada</span>
                      <span className="text-xl font-black text-emerald-600 font-['Outfit']">
                        USD ${resultadoFinanciacion.montoCuota?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Columna Derecha: Tarjeta de Precio & Consulta Directa (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Tarjeta de Precio y Contacto Rápido */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs space-y-6 sticky top-28">
              <div>
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest block mb-1">
                  {vehiculo.tipoVehiculo === 'EMBARCACION' ? `Astillero ${vehiculo.marca}` : vehiculo.marca}
                </span>
                <h1 className="text-2xl font-extrabold text-zinc-900 font-['Outfit']">
                  {vehiculo.modelo} {vehiculo.version}
                </h1>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="text-xs text-zinc-500 font-semibold uppercase block">
                  Precio Contado Efectivo
                </span>
                <div className="text-3xl font-extrabold text-zinc-900 font-['Outfit']">
                  USD ${vehiculo.precio.toLocaleString()}
                </div>
                {dolarRate && (
                  <div className="text-xs font-semibold text-emerald-700 font-mono">
                    ≈ ARS ${(vehiculo.precio * dolarRate).toLocaleString('es-AR')} <span className="text-[10px] text-zinc-400 font-sans">(Dólar Blue)</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <a
                  href={`https://wa.me/5491152638000?text=Hola,%20me%20interesa%20la%20unidad%20${encodeURIComponent(vehiculo.marca + ' ' + vehiculo.modelo)}%20${encodeURIComponent(vehiculo.version || '')}%20(${vehiculo.anio})%20-%20Precio:%20USD%20$${vehiculo.precio.toLocaleString()}%20(ID:%20${vehiculo.id})`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleWhatsAppClick}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] shadow-md shadow-[#25D366]/20 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Consultar por WhatsApp</span>
                </a>
              </div>

              {/* Formulario de Consulta Web */}
              <div className="border-t border-zinc-100 pt-6 space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Enviar Consulta por Email
                </h4>

                {consultaEnviada ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium text-center space-y-1">
                    <CheckCircle2 className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
                    <p className="font-bold">¡Mensaje enviado con éxito!</p>
                    <p className="text-zinc-600">Un asesor responderá a tu correo a la brevedad.</p>
                  </div>
                ) : (
                  <form onSubmit={handleEnviarConsulta} className="space-y-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Tu Nombre Completo *"
                        required
                        value={nombreConsulta}
                        onChange={(e) => setNombreConsulta(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Correo Electrónico"
                        value={emailConsulta}
                        onChange={(e) => setEmailConsulta(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Teléfono/Celular"
                        value={telefonoConsulta}
                        onChange={(e) => setTelefonoConsulta(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                      />
                    </div>
                    <div>
                      <textarea
                        rows={3}
                        placeholder="Hola, me interesa conocer más sobre este vehículo..."
                        required
                        value={mensajeConsulta}
                        onChange={(e) => setMensajeConsulta(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-emerald-500 focus:bg-white resize-none font-medium"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={enviandoConsulta}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-md shadow-emerald-500/20"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {enviandoConsulta ? 'Enviando...' : 'Enviar Consulta'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* FICHA TÉCNICA COMERCIAL PARA IMPRESIÓN / PDF (A4 BROCHURE) */}
      {/* ────────────────────────────────────────────────────────── */}
      <div id="printable-brochure" className="hidden print:block p-8 bg-white text-zinc-900 max-w-4xl mx-auto font-sans">
        {/* Header Brochure */}
        <div className="flex items-center justify-between border-b-2 border-zinc-900 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="MotorHUB Logo"
              className="w-12 h-12 rounded-xl object-cover border border-zinc-900"
            />
            <div>
              <h1 className="text-2xl font-black font-['Outfit'] tracking-tight text-zinc-950">
                MOTOR<span className="text-emerald-600">HUB</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block">
                Ficha Técnica Oficial de Venta • Garantía Certificada
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-zinc-400 font-semibold block">Precio de Lista Contado</span>
            <span className="text-2xl font-black text-zinc-950 font-mono">
              USD ${vehiculo.precio ? vehiculo.precio.toLocaleString() : '0'}
            </span>
            {dolarRate && vehiculo.precio && (
              <span className="text-xs font-bold text-emerald-700 block">
                ≈ ARS ${(vehiculo.precio * dolarRate).toLocaleString('es-AR')}
              </span>
            )}
          </div>
        </div>

        {/* Vehicle Header & Main Photo */}
        <div className="grid grid-cols-2 gap-6 mb-5">
          <div className="space-y-2.5">
            <div className="inline-block px-2.5 py-1 bg-zinc-100 border border-zinc-300 text-[10px] font-bold uppercase rounded">
              {formatTexto(vehiculo.tipoVehiculo)} {vehiculo.primeraMano ? '• 0 KM' : '• USADO SELECCIONADO'}
            </div>
            <h2 className="text-2xl font-extrabold text-zinc-950">
              {vehiculo.marca} {vehiculo.modelo}
            </h2>
            <h3 className="text-sm font-semibold text-zinc-600">
              {vehiculo.version || ''}
            </h3>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
              <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-200">
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">Año Modelo</span>
                <span className="font-extrabold text-zinc-900">{vehiculo.anio}</span>
              </div>
              <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-200">
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                  {vehiculo.tipoVehiculo === 'EMBARCACION' ? 'Horas de Uso' : 'Kilometraje'}
                </span>
                <span className="font-extrabold text-zinc-900">
                  {vehiculo.tipoVehiculo === 'EMBARCACION'
                    ? `${vehiculo.horasUso || 0} hs`
                    : vehiculo.kilometraje
                    ? `${vehiculo.kilometraje.toLocaleString()} km`
                    : '0 km'}
                </span>
              </div>
              <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-200">
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">Combustible</span>
                <span className="font-extrabold text-zinc-900">{formatTexto(vehiculo.combustible)}</span>
              </div>
              <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-200">
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">Color Exterior</span>
                <span className="font-extrabold text-zinc-900">{vehiculo.color || 'No especificado'}</span>
              </div>
            </div>

            {/* Identificación Legal */}
            {(vehiculo.patente || vehiculo.vin || vehiculo.numeroMotor) && (
              <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-200 text-[10px] text-zinc-600 space-y-0.5">
                {vehiculo.patente && <div><strong>Patente/Matrícula:</strong> {vehiculo.patente}</div>}
                {vehiculo.vin && <div><strong>Chasis/VIN:</strong> {vehiculo.vin}</div>}
                {vehiculo.numeroMotor && <div><strong>Nº Motor:</strong> {vehiculo.numeroMotor}</div>}
              </div>
            )}
          </div>

          <div className="h-60 rounded-2xl overflow-hidden border border-zinc-300 bg-zinc-100 flex items-center justify-center">
            <img
              src={imagenes[0]}
              alt={`${vehiculo.marca} ${vehiculo.modelo}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Technical Specs Detailed Grid */}
        <div className="border border-zinc-200 rounded-xl p-4 mb-5 bg-zinc-50 text-xs space-y-3">
          <h4 className="font-bold uppercase tracking-wider text-zinc-800 text-[11px] border-b border-zinc-200 pb-1">
            Especificaciones Técnicas Completas
          </h4>

          <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-[11px]">
            {/* General Specs */}
            {vehiculo.potencia && (
              <div><strong className="text-zinc-500">Potencia:</strong> {vehiculo.potencia} CV/HP</div>
            )}
            {vehiculo.torqueNm && (
              <div><strong className="text-zinc-500">Torque:</strong> {vehiculo.torqueNm} Nm</div>
            )}
            {vehiculo.capacidadTanqueCombustible && (
              <div><strong className="text-zinc-500">Tanque Combustible:</strong> {vehiculo.capacidadTanqueCombustible} Litros</div>
            )}
            {vehiculo.tipoDireccion && (
              <div><strong className="text-zinc-500">Dirección:</strong> {formatTexto(vehiculo.tipoDireccion)}</div>
            )}
            {(vehiculo.largoMetros || vehiculo.anchoMetros || vehiculo.altoMetros) && (
              <div><strong className="text-zinc-500">Dimensiones (L/An/Al):</strong> {vehiculo.largoMetros || '-'}m x {vehiculo.anchoMetros || '-'}m x {vehiculo.altoMetros || '-'}m</div>
            )}
            {vehiculo.pesoKg && (
              <div><strong className="text-zinc-500">Peso:</strong> {vehiculo.pesoKg.toLocaleString()} kg</div>
            )}

            {/* AUTOMÓVIL */}
            {vehiculo.tipoVehiculo === 'AUTOMOVIL' && (
              <>
                {(vehiculo.automovil?.motor || vehiculo.motor) && (
                  <div><strong className="text-zinc-500">Motorización:</strong> {vehiculo.automovil?.motor || vehiculo.motor}</div>
                )}
                {(vehiculo.automovil?.transmision || vehiculo.transmision) && (
                  <div><strong className="text-zinc-500">Transmisión:</strong> {formatTexto(vehiculo.automovil?.transmision || vehiculo.transmision)}</div>
                )}
                {(vehiculo.automovil?.traccion || vehiculo.traccion) && (
                  <div><strong className="text-zinc-500">Tracción:</strong> {formatTexto(vehiculo.automovil?.traccion || vehiculo.traccion)}</div>
                )}
                {(vehiculo.automovil?.tipoAutomovil || vehiculo.tipoAutomovil) && (
                  <div><strong className="text-zinc-500">Carrocería:</strong> {formatTexto(vehiculo.automovil?.tipoAutomovil || vehiculo.tipoAutomovil)}</div>
                )}
                {(vehiculo.automovil?.tipoTapizado || vehiculo.tipoTapizado) && (
                  <div><strong className="text-zinc-500">Tapizado:</strong> {formatTexto(vehiculo.automovil?.tipoTapizado || vehiculo.tipoTapizado)}</div>
                )}
                {(vehiculo.automovil?.capacidadBaulLitros || vehiculo.capacidadBaulLitros) && (
                  <div><strong className="text-zinc-500">Capacidad Baúl:</strong> {vehiculo.automovil?.capacidadBaulLitros || vehiculo.capacidadBaulLitros} Litros</div>
                )}
                {(vehiculo.automovil?.cantidadPuertas || vehiculo.cantidadPuertas) && (
                  <div><strong className="text-zinc-500">Puertas/Plazas:</strong> {vehiculo.automovil?.cantidadPuertas || vehiculo.cantidadPuertas}P / {vehiculo.automovil?.cantidadAsientos || vehiculo.cantidadAsientos || 5} Asientos</div>
                )}
                {(vehiculo.automovil?.airbags || vehiculo.airbags) && (
                  <div><strong className="text-zinc-500">Airbags:</strong> {vehiculo.automovil?.airbags || vehiculo.airbags}</div>
                )}
                {(vehiculo.automovil?.aceleracion0a100 || vehiculo.aceleracion0a100) && (
                  <div><strong className="text-zinc-500">Aceleración 0-100:</strong> {vehiculo.automovil?.aceleracion0a100 || vehiculo.aceleracion0a100} seg</div>
                )}
                {(vehiculo.automovil?.velocidadMaximaKmh || vehiculo.velocidadMaximaKmh) && (
                  <div><strong className="text-zinc-500">Velocidad Máxima:</strong> {vehiculo.automovil?.velocidadMaximaKmh || vehiculo.velocidadMaximaKmh} km/h</div>
                )}
              </>
            )}

            {/* CAMIÓN */}
            {vehiculo.tipoVehiculo === 'CAMION' && (
              <>
                {(vehiculo.camion?.tipoCarroceria || vehiculo.tipoCarroceria) && (
                  <div><strong className="text-zinc-500">Tipo Carrocería:</strong> {formatTexto(vehiculo.camion?.tipoCarroceria || vehiculo.tipoCarroceria)}</div>
                )}
                {(vehiculo.camion?.capacidadCargaKg || vehiculo.capacidadCargaKg) && (
                  <div><strong className="text-zinc-500">Capacidad Carga:</strong> {(vehiculo.camion?.capacidadCargaKg || vehiculo.capacidadCargaKg).toLocaleString()} kg</div>
                )}
                {(vehiculo.camion?.pesoBrutoVehicularKg || vehiculo.pesoBrutoVehicularKg) && (
                  <div><strong className="text-zinc-500">Peso Bruto (PBTC):</strong> {(vehiculo.camion?.pesoBrutoVehicularKg || vehiculo.pesoBrutoVehicularKg).toLocaleString()} kg</div>
                )}
                {(vehiculo.camion?.cantidadEjes || vehiculo.cantidadEjes) && (
                  <div><strong className="text-zinc-500">Cantidad Ejes:</strong> {vehiculo.camion?.cantidadEjes || vehiculo.cantidadEjes}</div>
                )}
                {(vehiculo.camion?.distanciaEntreEjesMm || vehiculo.distanciaEntreEjesMm) && (
                  <div><strong className="text-zinc-500">Dist. entre Ejes:</strong> {vehiculo.camion?.distanciaEntreEjesMm || vehiculo.distanciaEntreEjesMm} mm</div>
                )}
                {(vehiculo.camion?.tipoFreno || vehiculo.tipoFreno) && (
                  <div><strong className="text-zinc-500">Sistema Frenos:</strong> {formatTexto(vehiculo.camion?.tipoFreno || vehiculo.tipoFreno)}</div>
                )}
                {(vehiculo.camion?.suspension || vehiculo.suspension) && (
                  <div><strong className="text-zinc-500">Suspensión:</strong> {formatTexto(vehiculo.camion?.suspension || vehiculo.suspension)}</div>
                )}
                {(vehiculo.camion?.medidaNeumatico || vehiculo.medidaNeumatico) && (
                  <div><strong className="text-zinc-500">Neumáticos:</strong> {vehiculo.camion?.medidaNeumatico || vehiculo.medidaNeumatico} ({vehiculo.camion?.neumaticosCantidad || vehiculo.neumaticosCantidad || 6} ruedas)</div>
                )}
                {(vehiculo.camion?.consumoPromedioL100km || vehiculo.consumoPromedioL100km) && (
                  <div><strong className="text-zinc-500">Consumo Promedio:</strong> {vehiculo.camion?.consumoPromedioL100km || vehiculo.consumoPromedioL100km} L/100km</div>
                )}
              </>
            )}

            {/* EMBARCACIÓN */}
            {vehiculo.tipoVehiculo === 'EMBARCACION' && (
              <>
                {(vehiculo.embarcacion?.tipoEmbarcacion || vehiculo.tipoEmbarcacion) && (
                  <div><strong className="text-zinc-500">Tipo Embarcación:</strong> {formatTexto(vehiculo.embarcacion?.tipoEmbarcacion || vehiculo.tipoEmbarcacion)}</div>
                )}
                {(vehiculo.embarcacion?.materialCasco || vehiculo.materialCasco) && (
                  <div><strong className="text-zinc-500">Material Casco:</strong> {formatTexto(vehiculo.embarcacion?.materialCasco || vehiculo.materialCasco)}</div>
                )}
                {(vehiculo.embarcacion?.marcaMotor || vehiculo.marcaMotor) && (
                  <div><strong className="text-zinc-500">Motor Marino:</strong> {vehiculo.embarcacion?.marcaMotor || vehiculo.marcaMotor} ({formatTexto(vehiculo.embarcacion?.tipoMotor || vehiculo.tipoMotor)})</div>
                )}
                {(vehiculo.embarcacion?.esloraMetros || vehiculo.esloraMetros) && (
                  <div><strong className="text-zinc-500">Dimensiones:</strong> {vehiculo.embarcacion?.esloraMetros || vehiculo.esloraMetros}m x {vehiculo.embarcacion?.mangaMetros || vehiculo.mangaMetros}m x {vehiculo.embarcacion?.puntalMetros || vehiculo.puntalMetros}m</div>
                )}
                {(vehiculo.embarcacion?.capacidadPersonas || vehiculo.capacidadPersonas) && (
                  <div><strong className="text-zinc-500">Capacidad:</strong> {vehiculo.embarcacion?.capacidadPersonas || vehiculo.capacidadPersonas} Tripulantes</div>
                )}
                {(vehiculo.embarcacion?.pesoMaximoKg || vehiculo.pesoMaximoKg) && (
                  <div><strong className="text-zinc-500">Carga Máxima:</strong> {vehiculo.embarcacion?.pesoMaximoKg || vehiculo.pesoMaximoKg} kg</div>
                )}
                {(vehiculo.embarcacion?.capacidadAguaDulceLitros || vehiculo.capacidadAguaDulceLitros) ? (
                  <div><strong className="text-zinc-500">Agua Dulce:</strong> {vehiculo.embarcacion?.capacidadAguaDulceLitros || vehiculo.capacidadAguaDulceLitros} Litros</div>
                ) : null}
                {(vehiculo.embarcacion?.velocidadMaximaNudos || vehiculo.velocidadMaximaNudos) && (
                  <div><strong className="text-zinc-500">Velocidad Máxima:</strong> {vehiculo.embarcacion?.velocidadMaximaNudos || vehiculo.velocidadMaximaNudos} Nudos</div>
                )}
              </>
            )}

            {/* MOTOCICLETA */}
            {vehiculo.tipoVehiculo === 'MOTOCICLETA' && (
              <>
                {(vehiculo.motocicleta?.estilo || vehiculo.estilo) && (
                  <div><strong className="text-zinc-500">Estilo:</strong> {formatTexto(vehiculo.motocicleta?.estilo || vehiculo.estilo)}</div>
                )}
                {(vehiculo.motocicleta?.cilindradaCc || vehiculo.cilindradaCc) && (
                  <div><strong className="text-zinc-500">Cilindrada:</strong> {vehiculo.motocicleta?.cilindradaCc || vehiculo.cilindradaCc} cc</div>
                )}
                {(vehiculo.motocicleta?.motorTiempos || vehiculo.motorTiempos) && (
                  <div><strong className="text-zinc-500">Ciclo Motor:</strong> {vehiculo.motocicleta?.motorTiempos || vehiculo.motorTiempos} Tiempos (4T)</div>
                )}
                {(vehiculo.motocicleta?.transmisionMoto || vehiculo.transmisionMoto) && (
                  <div><strong className="text-zinc-500">Transmisión Sec.:</strong> {formatTexto(vehiculo.motocicleta?.transmisionMoto || vehiculo.transmisionMoto)}</div>
                )}
                {(vehiculo.motocicleta?.refrigeracion || vehiculo.refrigeracion) && (
                  <div><strong className="text-zinc-500">Refrigeración:</strong> {formatTexto(vehiculo.motocicleta?.refrigeracion || vehiculo.refrigeracion)}</div>
                )}
                {(vehiculo.motocicleta?.alturaAsientoMm || vehiculo.alturaAsientoMm) && (
                  <div><strong className="text-zinc-500">Altura Asiento:</strong> {vehiculo.motocicleta?.alturaAsientoMm || vehiculo.alturaAsientoMm} mm</div>
                )}
                {(vehiculo.motocicleta?.tipoLlanta || vehiculo.tipoLlanta) && (
                  <div><strong className="text-zinc-500">Tipo Llanta:</strong> {formatTexto(vehiculo.motocicleta?.tipoLlanta || vehiculo.tipoLlanta)}</div>
                )}
                {(vehiculo.motocicleta?.neumaticoDelantero || vehiculo.neumaticoDelantero) && (
                  <div><strong className="text-zinc-500">Neumático Del/Tras:</strong> {vehiculo.motocicleta?.neumaticoDelantero || vehiculo.neumaticoDelantero} / {vehiculo.motocicleta?.neumaticoTrasero || vehiculo.neumaticoTrasero}</div>
                )}
              </>
            )}

            {/* MOTORHOME */}
            {vehiculo.tipoVehiculo === 'MOTORHOME' && (
              <>
                {(vehiculo.motorhome?.capacidadCamas || vehiculo.capacidadCamas) && (
                  <div><strong className="text-zinc-500">Plazas / Camas:</strong> {vehiculo.motorhome?.capacidadCamas || vehiculo.capacidadCamas} Personas</div>
                )}
                {(vehiculo.motorhome?.capacidadTanqueAguaLitros || vehiculo.capacidadTanqueAguaLitros) && (
                  <div><strong className="text-zinc-500">Agua Potable:</strong> {vehiculo.motorhome?.capacidadTanqueAguaLitros || vehiculo.capacidadTanqueAguaLitros} Litros</div>
                )}
                {(vehiculo.motorhome?.capacidadAguasGrisesLitros || vehiculo.capacidadAguasGrisesLitros) && (
                  <div><strong className="text-zinc-500">Aguas Grises / Negras:</strong> {vehiculo.motorhome?.capacidadAguasGrisesLitros || vehiculo.capacidadAguasGrisesLitros}L / {vehiculo.motorhome?.capacidadAguasNegrasLitros || vehiculo.capacidadAguasNegrasLitros || 0}L</div>
                )}
                {(vehiculo.motorhome?.capacidadBateriasAh || vehiculo.capacidadBateriasAh) && (
                  <div><strong className="text-zinc-500">Banco Baterías:</strong> {vehiculo.motorhome?.capacidadBateriasAh || vehiculo.capacidadBateriasAh} Ah</div>
                )}
              </>
            )}
          </div>

          {/* Checklist de Equipamiento Activo */}
          <div className="pt-2 border-t border-zinc-200">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1.5">
              Equipamiento y Confort Incluido:
            </span>
            <div className="grid grid-cols-3 gap-x-2 gap-y-1 text-[10px]">
              {/* Común & Automóvil */}
              {vehiculo.tieneAireAcondicionado && <div><strong className="text-emerald-700">✓</strong> Climatizador/Aire</div>}
              {vehiculo.tieneAppleCarplayAndroidAuto && <div><strong className="text-emerald-700">✓</strong> Apple CarPlay/Android Auto</div>}
              {vehiculo.tieneCamaraRetroceso && <div><strong className="text-emerald-700">✓</strong> Cámara de Retroceso</div>}
              {vehiculo.tieneSensoresEstacionamiento && <div><strong className="text-emerald-700">✓</strong> Sensores de Estacionamiento</div>}
              {vehiculo.tieneTechoSolar && <div><strong className="text-emerald-700">✓</strong> Techo Solar / Panorámico</div>}
              {(vehiculo.automovil?.abs || vehiculo.abs) && <div><strong className="text-emerald-700">✓</strong> Frenos ABS</div>}
              {(vehiculo.automovil?.controlEstabilidad || vehiculo.controlEstabilidad) && <div><strong className="text-emerald-700">✓</strong> Control Estabilidad (ESP)</div>}
              {(vehiculo.automovil?.controlCruceroAdaptativo || vehiculo.controlCruceroAdaptativo) && <div><strong className="text-emerald-700">✓</strong> Control Crucero Adaptativo</div>}
              {(vehiculo.automovil?.asientosCuero || vehiculo.asientosCuero) && <div><strong className="text-emerald-700">✓</strong> Tapizado de Cuero</div>}
              {(vehiculo.automovil?.asientosElectricos || vehiculo.asientosElectricos) && <div><strong className="text-emerald-700">✓</strong> Butacas Eléctricas</div>}
              {(vehiculo.automovil?.arranqueBotonKeyless || vehiculo.arranqueBotonKeyless) && <div><strong className="text-emerald-700">✓</strong> Arranque por Botón (Keyless)</div>}
              {(vehiculo.automovil?.cargadorInalambrico || vehiculo.cargadorInalambrico) && <div><strong className="text-emerald-700">✓</strong> Cargador Inalámbrico</div>}
              {(vehiculo.automovil?.lucesLedAutomaticas || vehiculo.lucesLedAutomaticas) && <div><strong className="text-emerald-700">✓</strong> Luces LED Automáticas</div>}
              {(vehiculo.automovil?.frenoEstacionamientoElectrico || vehiculo.frenoEstacionamientoElectrico) && <div><strong className="text-emerald-700">✓</strong> Freno de Mano Eléctrico</div>}
              {(vehiculo.automovil?.alertaPuntoCiego || vehiculo.alertaPuntoCiego) && <div><strong className="text-emerald-700">✓</strong> Alerta de Punto Ciego</div>}

              {/* Camión */}
              {(vehiculo.camion?.aireAcondicionadoCabina || vehiculo.aireAcondicionadoCabina) && <div><strong className="text-emerald-700">✓</strong> Aire Cabina</div>}
              {(vehiculo.camion?.camaraRetroceso || vehiculo.camaraRetroceso) && <div><strong className="text-emerald-700">✓</strong> Cámara de Asistencia</div>}
              {(vehiculo.camion?.sensoresEstacionamiento || vehiculo.sensoresEstacionamiento) && <div><strong className="text-emerald-700">✓</strong> Sensores de Proximidad</div>}
              {(vehiculo.camion?.pantallaMultimedia || vehiculo.pantallaMultimedia) && <div><strong className="text-emerald-700">✓</strong> Pantalla Multimedia Conectada</div>}
              {(vehiculo.camion?.frenosAireAbs || vehiculo.frenosAireAbs) && <div><strong className="text-emerald-700">✓</strong> Frenos de Aire ABS</div>}
              {(vehiculo.camion?.controlEstabilidadEsp || vehiculo.controlEstabilidadEsp) && <div><strong className="text-emerald-700">✓</strong> Control Estabilidad (ESP/ASR)</div>}
              {(vehiculo.camion?.butacaNeumatica || vehiculo.butacaNeumatica) && <div><strong className="text-emerald-700">✓</strong> Butaca Neumática Conductor</div>}
              {(vehiculo.camion?.suspensionNeumaticaCabina || vehiculo.suspensionNeumaticaCabina) && <div><strong className="text-emerald-700">✓</strong> Suspensión Neumática Cabina</div>}
              {(vehiculo.camion?.controlCrucero || vehiculo.controlCrucero) && <div><strong className="text-emerald-700">✓</strong> Control Crucero</div>}
              {(vehiculo.camion?.calefaccionAuxiliar || vehiculo.calefaccionAuxiliar) && <div><strong className="text-emerald-700">✓</strong> Calefacción Auxiliar</div>}
              {(vehiculo.camion?.frenoMotorRetarder || vehiculo.frenoMotorRetarder) && <div><strong className="text-emerald-700">✓</strong> Freno Motor / Retarder</div>}
              {(vehiculo.camion?.tacografoDigital || vehiculo.tacografoDigital) && <div><strong className="text-emerald-700">✓</strong> Tacógrafo Digital Homologado</div>}

              {/* Embarcación */}
              {(vehiculo.embarcacion?.bombaAchique || vehiculo.bombaAchique) && <div><strong className="text-emerald-700">✓</strong> Bomba de Achique Automática</div>}
              {(vehiculo.embarcacion?.ecosonda || vehiculo.ecosonda) && <div><strong className="text-emerald-700">✓</strong> Ecosonda/GPS Náutico</div>}
              {(vehiculo.embarcacion?.escaleraPopa || vehiculo.escaleraPopa) && <div><strong className="text-emerald-700">✓</strong> Escalera de Popa Inox</div>}
              {(vehiculo.embarcacion?.audio || vehiculo.audio) && <div><strong className="text-emerald-700">✓</strong> Audio Marino Bluetooth</div>}
              {(vehiculo.embarcacion?.tieneTrailer || vehiculo.tieneTrailer) && <div><strong className="text-emerald-700">✓</strong> Trailer Homologado</div>}
              {(vehiculo.embarcacion?.toldoBimini || vehiculo.toldoBimini) && <div><strong className="text-emerald-700">✓</strong> Toldo Bimini/Capota</div>}
              {(vehiculo.embarcacion?.cerramientoCompleto || vehiculo.cerramientoCompleto) && <div><strong className="text-emerald-700">✓</strong> Cerramiento Lona Completo</div>}
              {(vehiculo.embarcacion?.malacateElectrico || vehiculo.malacateElectrico) && <div><strong className="text-emerald-700">✓</strong> Malacate Eléctrico</div>}
              {(vehiculo.embarcacion?.lucesNavegacion || vehiculo.lucesNavegacion) && <div><strong className="text-emerald-700">✓</strong> Luces Navegación</div>}
              {(vehiculo.embarcacion?.radioVHF || vehiculo.radioVHF) && <div><strong className="text-emerald-700">✓</strong> Radio VHF Marina</div>}
              {(vehiculo.embarcacion?.duchaPopa || vehiculo.duchaPopa) && <div><strong className="text-emerald-700">✓</strong> Ducha de Popa Presurizada</div>}
              {(vehiculo.embarcacion?.barraSki || vehiculo.barraSki) && <div><strong className="text-emerald-700">✓</strong> Barra de Ski/Wakeboard</div>}
              {(vehiculo.embarcacion?.solariumProa || vehiculo.solariumProa) && <div><strong className="text-emerald-700">✓</strong> Solárium de Proa</div>}
              {(vehiculo.embarcacion?.mesaCockpit || vehiculo.mesaCockpit) && <div><strong className="text-emerald-700">✓</strong> Mesa de Cockpit</div>}
              {(vehiculo.embarcacion?.inodoroMarino || vehiculo.inodoroMarino) && <div><strong className="text-emerald-700">✓</strong> Inodoro Marino / Baño</div>}
              {(vehiculo.embarcacion?.heladeraNautica || vehiculo.heladeraNautica) && <div><strong className="text-emerald-700">✓</strong> Heladera Náutica</div>}

              {/* Moto */}
              {(vehiculo.motocicleta?.abs || vehiculo.abs) && <div><strong className="text-emerald-700">✓</strong> Frenos ABS Doble Canal</div>}
              {(vehiculo.motocicleta?.controlTraccionTcs || vehiculo.controlTraccionTcs) && <div><strong className="text-emerald-700">✓</strong> Control de Tracción (TCS)</div>}
              {(vehiculo.motocicleta?.modosConduccion || vehiculo.modosConduccion) && <div><strong className="text-emerald-700">✓</strong> Modos de Conducción</div>}
              {(vehiculo.motocicleta?.quickshifter || vehiculo.quickshifter) && <div><strong className="text-emerald-700">✓</strong> Quickshifter Bidireccional</div>}
              {(vehiculo.motocicleta?.pantallaTftBluetooth || vehiculo.pantallaTftBluetooth) && <div><strong className="text-emerald-700">✓</strong> Pantalla TFT Bluetooth</div>}
              {(vehiculo.motocicleta?.lucesLed || vehiculo.lucesLed) && <div><strong className="text-emerald-700">✓</strong> Iluminación Full LED</div>}
              {(vehiculo.motocicleta?.punosCalefaccionables || vehiculo.punosCalefaccionables) && <div><strong className="text-emerald-700">✓</strong> Puños Calefaccionables</div>}
              {(vehiculo.motocicleta?.parabrisasRegulable || vehiculo.parabrisasRegulable) && <div><strong className="text-emerald-700">✓</strong> Parabrisas Regulable</div>}
              {(vehiculo.motocicleta?.puertoUsb12v || vehiculo.puertoUsb12v) && <div><strong className="text-emerald-700">✓</strong> Puerto USB / 12V</div>}
              {(vehiculo.motocicleta?.cubrepunosDefensas || vehiculo.cubrepunosDefensas) && <div><strong className="text-emerald-700">✓</strong> Cubrepuños y Defensas</div>}
              {(vehiculo.motocicleta?.caballeteCentral || vehiculo.caballeteCentral) && <div><strong className="text-emerald-700">✓</strong> Caballete Central</div>}

              {/* Motorhome */}
              {(vehiculo.motorhome?.tieneCocina || vehiculo.tieneCocina) && <div><strong className="text-emerald-700">✓</strong> Cocina Completa / Anafe</div>}
              {(vehiculo.motorhome?.tieneBano || vehiculo.tieneBano) && <div><strong className="text-emerald-700">✓</strong> Baño con Ducha e Inodoro</div>}
              {(vehiculo.motorhome?.tieneDuchaExterior || vehiculo.tieneDuchaExterior) && <div><strong className="text-emerald-700">✓</strong> Ducha Exterior Presurizada</div>}
              {(vehiculo.motorhome?.tienePanelesSolares || vehiculo.tienePanelesSolares) && <div><strong className="text-emerald-700">✓</strong> Paneles Solares Fotovoltaicos</div>}
              {(vehiculo.motorhome?.tieneCalefaccion || vehiculo.tieneCalefaccion) && <div><strong className="text-emerald-700">✓</strong> Calefacción Estacionaria</div>}
              {(vehiculo.motorhome?.tieneGenerador || vehiculo.tieneGenerador) && <div><strong className="text-emerald-700">✓</strong> Generador Eléctrico</div>}
              {(vehiculo.motorhome?.tieneTV || vehiculo.tieneTV) && <div><strong className="text-emerald-700">✓</strong> Smart TV / Audio</div>}
              {(vehiculo.motorhome?.toldoExterior || vehiculo.toldoExterior) && <div><strong className="text-emerald-700">✓</strong> Toldo Exterior Extensible</div>}
              {(vehiculo.motorhome?.aireAcondicionadoHabitaculo || vehiculo.aireAcondicionadoHabitaculo) && <div><strong className="text-emerald-700">✓</strong> Aire Acondicionado Habitáculo</div>}
              {(vehiculo.motorhome?.inversorCorriente220v || vehiculo.inversorCorriente220v) && <div><strong className="text-emerald-700">✓</strong> Inversor 12V a 220V</div>}
              {(vehiculo.motorhome?.heladeraFreezer || vehiculo.heladeraFreezer) && <div><strong className="text-emerald-700">✓</strong> Heladera con Freezer</div>}
              {(vehiculo.motorhome?.termotanqueCalefon || vehiculo.termotanqueCalefon) && <div><strong className="text-emerald-700">✓</strong> Termotanque / Calefón</div>}
              {(vehiculo.motorhome?.garrafaGasEnvasado || vehiculo.garrafaGasEnvasado) && <div><strong className="text-emerald-700">✓</strong> Instalación Gas Envasado</div>}
              {(vehiculo.motorhome?.escalonElectrico || vehiculo.escalonElectrico) && <div><strong className="text-emerald-700">✓</strong> Escalón Eléctrico</div>}
              {(vehiculo.motorhome?.soporteBicicletasEnganche || vehiculo.soporteBicicletasEnganche) && <div><strong className="text-emerald-700">✓</strong> Soporte Bicicletas / Enganche</div>}
            </div>
          </div>

          {vehiculo.descripcion && (
            <div className="pt-2 border-t border-zinc-200">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">
                Reseña Comercial:
              </span>
              <p className="text-[11px] text-zinc-700 leading-relaxed whitespace-pre-line">
                {vehiculo.descripcion}
              </p>
            </div>
          )}
        </div>

        {/* Footer Brochure */}
        <div className="flex items-center justify-between border-t-2 border-zinc-900 pt-4 text-xs text-zinc-600">
          <div>
            <p className="font-bold text-zinc-950">MotorHub Argentina • Casa Central y Sucursales</p>
            <p className="text-[11px]">Tel: +54 9 11 5263-8000 • Email: contacto@motorhub.com</p>
          </div>
          <div className="text-right text-[10px] text-zinc-400">
            Documento generado el {new Date().toLocaleDateString('es-AR')} • Validez de cotización: 7 días
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
