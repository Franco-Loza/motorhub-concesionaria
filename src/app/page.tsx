import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import {
  Car,
  Truck,
  Ship,
  Bike,
  Home,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Gauge,
  Calendar,
  Fuel,
  BadgeCheck,
  Zap,
  Layers,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const formatText = (str: string | null | undefined) => {
  if (!str) return '';
  return str.replaceAll('_', ' ').toLowerCase().replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
};

async function getFeaturedVehicles() {
  try {
    const vehiculos = await prisma.vehiculo.findMany({
      where: { estado: 'DISPONIBLE' },
      include: {
        automovil: true,
        camion: true,
        embarcacion: true,
        motocicleta: true,
        motorhome: true,
      },
      orderBy: { fechaCreacion: 'desc' },
      take: 8,
    });

    return vehiculos.map((v) => {
      let imagenesUrls: string[] = [];
      try {
        if (v.imagenesUrls) imagenesUrls = JSON.parse(v.imagenesUrls);
      } catch {
        imagenesUrls = v.imagenesUrls ? [v.imagenesUrls] : [];
      }
      return { ...v, imagenesUrls };
    });
  } catch (err) {
    console.error('Error al recuperar vehículos destacados:', err);
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeaturedVehicles();

  const categories = [
    { label: 'Automóviles', type: 'AUTOMOVIL', icon: Car, count: 'Autos y Sedán' },
    { label: 'Camiones', type: 'CAMION', icon: Truck, count: 'Pesados y Utilitarios' },
    { label: 'Embarcaciones', type: 'EMBARCACION', icon: Ship, count: 'Lanchas y Yates' },
    { label: 'Motocicletas', type: 'MOTOCICLETA', icon: Bike, count: 'Pista y Touring' },
    { label: 'Motorhomes', type: 'MOTORHOME', icon: Home, count: 'Casas Rodantes' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[540px] lg:min-h-[620px] flex items-center justify-center bg-white border-b border-zinc-200">
        {/* Soft Ambient Glow Accent */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Hero Content */}
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-16 lg:py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-widest shadow-xs">
              <BadgeCheck className="w-4 h-4 text-emerald-600" />
              <span>Flota Seleccionada • Garantía Certificada</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-zinc-900 tracking-tight font-['Outfit'] leading-[1.1]">
              Tu próximo vehículo con{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 font-extrabold">
                Garantía y Confianza
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-zinc-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Automóviles seleccionados, utilitarios, náutica y motorhomes certificados.
              Peritaje mecánico de 150 puntos, documentación al día y financiación personalizada.
            </p>

            {/* Quick Search Widget */}
            <div className="max-w-3xl mx-auto bg-white border border-zinc-200 p-3 sm:p-4 rounded-2xl shadow-xl">
              <form action="/catalogo" method="GET" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-xl focus-within:border-emerald-500 transition-colors">
                  <Car className="w-5 h-5 text-emerald-600 shrink-0" />
                  <select
                    name="tipo"
                    aria-label="Tipo de vehículo"
                    className="w-full bg-transparent text-sm text-zinc-800 focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="">Todos los Tipos</option>
                    <option value="AUTOMOVIL">Automóviles</option>
                    <option value="CAMION">Camiones/Utilitarios</option>
                    <option value="EMBARCACION">Embarcaciones</option>
                    <option value="MOTOCICLETA">Motocicletas</option>
                    <option value="MOTORHOME">Motorhomes</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-xl focus-within:border-emerald-500 transition-colors">
                  <Gauge className="w-5 h-5 text-emerald-600 shrink-0" />
                  <select
                    name="orden"
                    aria-label="Ordenar por"
                    className="w-full bg-transparent text-sm text-zinc-800 focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="recientes">Más Recientes</option>
                    <option value="precio_asc">Menor Precio</option>
                    <option value="precio_desc">Mayor Precio</option>
                    <option value="km_asc">Menor Kilometraje</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-950 bg-emerald-400 hover:bg-emerald-300 shadow-md shadow-emerald-500/20 hover:scale-[1.01] active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <span>Buscar en Stock</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 max-w-4xl mx-auto text-left">
              <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs hover:border-emerald-500/40 transition-colors">
                <div className="text-2xl font-bold text-emerald-600 font-['Outfit']">+500</div>
                <div className="text-xs text-zinc-600 font-medium">Unidades Entregadas</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs hover:border-emerald-500/40 transition-colors">
                <div className="text-2xl font-bold text-emerald-600 font-['Outfit']">150 Pts</div>
                <div className="text-xs text-zinc-600 font-medium">Peritaje Mecánico</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs hover:border-emerald-500/40 transition-colors">
                <div className="text-2xl font-bold text-emerald-600 font-['Outfit']">100%</div>
                <div className="text-xs text-zinc-600 font-medium">Garantía Documental</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs hover:border-emerald-500/40 transition-colors">
                <div className="text-2xl font-bold text-emerald-600 font-['Outfit']">24hs</div>
                <div className="text-xs text-zinc-600 font-medium">Aprobación Crediticia</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Shortcuts */}
      <section className="py-12 bg-zinc-50 border-b border-zinc-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.type}
                  href={`/catalogo?tipo=${cat.type}`}
                  className="flex flex-col items-center p-5 rounded-2xl bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-emerald-500/50 hover:shadow-md transition-all duration-300 group text-center shadow-xs hover:-translate-y-0.5"
                >
                  <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-700 group-hover:text-emerald-600 group-hover:border-emerald-500/40 mb-3 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-zinc-900 text-sm font-['Outfit'] group-hover:text-emerald-700 transition-colors">
                    {cat.label}
                  </span>
                  <span className="text-xs text-zinc-500 mt-0.5">{cat.count}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Vehicles Grid */}
      <section className="py-20 bg-zinc-50 flex-1 border-b border-zinc-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600 block mb-1">
                Showroom Destacado
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 font-['Outfit']">
                Últimos Ingresos Seleccionados
              </h2>
            </div>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-700 hover:text-emerald-600 group transition-colors"
            >
              <span>Ver todos los vehículos</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featured.map((vehiculo) => {
              const foto = vehiculo.imagenesUrls[0] || 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80';
              return (
                <div
                  key={vehiculo.id}
                  className="bg-white rounded-2xl overflow-hidden border border-zinc-200 hover:border-emerald-500/50 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
                >
                  {/* Image Container */}
                  <div className="relative h-60 overflow-hidden bg-zinc-100">
                    <img
                      src={foto}
                      alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-zinc-900/90 text-white text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-md">
                      {vehiculo.tipoVehiculo}
                    </div>
                    {vehiculo.primeraMano && (
                      <div className="absolute top-3 right-3 bg-emerald-500 text-zinc-950 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md shadow-xs">
                        0 KM
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                        {vehiculo.marca}
                      </div>
                      <h3 className="text-xl font-bold text-zinc-900 font-['Outfit'] line-clamp-1 mb-2 group-hover:text-emerald-700 transition-colors">
                        {vehiculo.modelo} {vehiculo.version}
                      </h3>

                      {/* Specs pills */}
                      <div className="flex flex-wrap items-center gap-2.5 text-xs text-zinc-600 my-3.5 pb-3.5 border-b border-zinc-100">
                        <div className="flex items-center gap-1 bg-zinc-50 px-2 py-0.5 rounded-md border border-zinc-150">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span className="font-semibold">{vehiculo.anio}</span>
                        </div>

                        <div className="flex items-center gap-1 bg-zinc-50 px-2 py-0.5 rounded-md border border-zinc-150">
                          <Gauge className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span className="font-semibold">
                            {vehiculo.tipoVehiculo === 'EMBARCACION'
                              ? (vehiculo.primeraMano || !vehiculo.horasUso ? '0 hs' : `${vehiculo.horasUso} hs`)
                              : (vehiculo.primeraMano || !vehiculo.kilometraje ? '0 km' : `${vehiculo.kilometraje.toLocaleString()} km`)}
                          </span>
                        </div>

                        {vehiculo.automovil?.transmision && (
                          <div className="flex items-center gap-1 bg-zinc-50 px-2 py-0.5 rounded-md border border-zinc-150">
                            <Layers className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span className="font-semibold">{formatText(vehiculo.automovil.transmision)}</span>
                          </div>
                        )}

                        {vehiculo.embarcacion?.esloraMetros && (
                          <div className="flex items-center gap-1 bg-zinc-50 px-2 py-0.5 rounded-md border border-zinc-150">
                            <Ship className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span className="font-semibold">{vehiculo.embarcacion.esloraMetros}m</span>
                          </div>
                        )}

                        {vehiculo.camion?.tipoCarroceria && (
                          <div className="flex items-center gap-1 bg-zinc-50 px-2 py-0.5 rounded-md border border-zinc-150">
                            <Truck className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span className="font-semibold">{formatText(vehiculo.camion.tipoCarroceria)}</span>
                          </div>
                        )}

                        {vehiculo.motocicleta?.cilindradaCc && (
                          <div className="flex items-center gap-1 bg-zinc-50 px-2 py-0.5 rounded-md border border-zinc-150">
                            <Bike className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span className="font-semibold">{vehiculo.motocicleta.cilindradaCc} cc</span>
                          </div>
                        )}

                        {vehiculo.potencia && (
                          <div className="flex items-center gap-1 bg-zinc-50 px-2 py-0.5 rounded-md border border-zinc-150">
                            <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span className="font-semibold">{vehiculo.potencia} {vehiculo.tipoVehiculo === 'EMBARCACION' ? 'HP' : 'CV'}</span>
                          </div>
                        )}

                        {vehiculo.combustible && (
                          <div className="flex items-center gap-1 bg-zinc-50 px-2 py-0.5 rounded-md border border-zinc-150">
                            <Fuel className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span className="font-semibold">{formatText(vehiculo.combustible)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="text-[11px] text-zinc-500 uppercase font-semibold block">
                          Precio Contado
                        </span>
                        <span className="text-2xl font-bold text-zinc-900 font-['Outfit']">
                          USD ${vehiculo.precio.toLocaleString()}
                        </span>
                      </div>
                      <Link
                        href={`/catalogo/${vehiculo.id}`}
                        className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        Ver Ficha
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-white border-t border-zinc-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600 block mb-1">
              ¿Por qué elegirnos?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 font-['Outfit']">
              Seguridad y Excelencia Comercial
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4 hover:border-emerald-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 font-['Outfit']">
                Peritaje Técnico de 150 Puntos
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Cada unidad pasa por un riguroso proceso de inspección mecánica, chapa y pintura, scanner electrónico y verificación de kilometraje real.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4 hover:border-emerald-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 font-['Outfit']">
                Documentación 100% Garantizada
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Informes de dominio, libre deuda de patentes e infracciones al día. Transferencia inmediata y gestoría integral en nuestras sedes.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4 hover:border-emerald-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 font-['Outfit']">
                Financiación a Medida y Permutas
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Créditos prendarios en cuotas fijas con tasas preferenciales. Tomamos tu vehículo usado al mejor valor de plaza.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
