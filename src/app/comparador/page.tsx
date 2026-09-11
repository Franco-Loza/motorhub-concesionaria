'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCompare } from '@/context/CompareContext';
import {
  Scale,
  Plus,
  Trash2,
  Check,
  X,
  Car,
  Truck,
  Ship,
  Bike,
  Home,
  Fuel,
  Gauge,
  Calendar,
  Zap,
  Shield,
  ArrowRight,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

export default function ComparadorPage() {
  const { compareList, removeFromCompare, clearCompare, addToCompare } = useCompare();
  const [detallesVehiculos, setDetallesVehiculos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [todosVehiculos, setTodosVehiculos] = useState<any[]>([]);
  const [vehiculoSeleccionadoId, setVehiculoSeleccionadoId] = useState('');

  // Cargar catálogo disponible para el selector de agregar
  useEffect(() => {
    fetch('/api/vehiculos?estado=DISPONIBLE')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTodosVehiculos(data.filter((v: any) => v.estado === 'DISPONIBLE'));
        } else if (data && data.vehiculos) {
          setTodosVehiculos(data.vehiculos.filter((v: any) => v.estado === 'DISPONIBLE'));
        }
      })
      .catch(console.error);
  }, []);

  // Cargar detalles completos de los vehículos en la lista de comparación
  useEffect(() => {
    if (compareList.length === 0) {
      setDetallesVehiculos([]);
      return;
    }

    const cargarDetalles = async () => {
      setLoading(true);
      try {
        const promises = compareList.map((v) =>
          fetch(`/api/vehiculos/${v.id}`).then((res) => res.json())
        );
        const results = await Promise.all(promises);
        setDetallesVehiculos(results.filter((r) => r && !r.error));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarDetalles();
  }, [compareList]);

  const handleAgregarDesdeSelect = (idStr: string) => {
    if (!idStr) return;
    const v = todosVehiculos.find((item) => item.id === parseInt(idStr));
    if (v) {
      let imagenUrl = null;
      if (Array.isArray(v.imagenesUrls) && v.imagenesUrls.length > 0) {
        imagenUrl = v.imagenesUrls[0];
      }
      addToCompare({
        id: v.id,
        marca: v.marca,
        modelo: v.modelo,
        version: v.version,
        tipoVehiculo: v.tipoVehiculo,
        precio: v.precio,
        anio: v.anio,
        kilometraje: v.kilometraje,
        combustible: v.combustible,
        imagenUrl,
      });
      setVehiculoSeleccionadoId('');
    }
  };

  const parseImgs = (urls: any) => {
    if (Array.isArray(urls)) return urls;
    try {
      if (typeof urls === 'string') return JSON.parse(urls);
    } catch {}
    return urls ? [urls] : [];
  };

  const categoriaActual = compareList.length > 0 ? compareList[0].tipoVehiculo : null;

  // Filtrar el dropdown para mostrar únicamente vehículos de la misma categoría que el ya seleccionado
  const vehiculosFiltradosParaAgregar = todosVehiculos.filter((v) => {
    const yaEstaEnLista = compareList.some((c) => c.id === v.id);
    if (yaEstaEnLista) return false;
    if (categoriaActual) {
      return v.tipoVehiculo === categoriaActual;
    }
    return true;
  });

  const formatNombreTipo = (tipo: string | null) => {
    switch (tipo) {
      case 'AUTOMOVIL': return 'Automóviles';
      case 'CAMION': return 'Camiones';
      case 'EMBARCACION': return 'Embarcaciones';
      case 'MOTOCICLETA': return 'Motocicletas';
      case 'MOTORHOME': return 'Motorhomes';
      default: return 'Vehículos';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'AUTOMOVIL': return Car;
      case 'CAMION': return Truck;
      case 'EMBARCACION': return Ship;
      case 'MOTOCICLETA': return Bike;
      case 'MOTORHOME': return Home;
      default: return Car;
    }
  };

  // ─────────────────────────────────────────────────────────────
  // HELPERS DE ESPECIFICACIONES TÉCNICAS POR CATEGORÍA
  // ─────────────────────────────────────────────────────────────
  const getFilaCondicion = (v: any) => {
    if (v.primeraMano) {
      return v.tipoVehiculo === 'EMBARCACION' ? 'CASCO 0 KM (Sin Rodar)' : '0 KM (A Estrenar)';
    }
    if (v.tipoVehiculo === 'EMBARCACION') {
      return `${v.horasUso || 0} hs de uso`;
    }
    return `${v.kilometraje?.toLocaleString('es-AR') || 0} km`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900">
      <Navbar />

      {/* Header */}
      <section className="bg-white border-b border-zinc-200 py-12">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-widest mb-2">
                <Scale className="w-3.5 h-3.5 text-emerald-600" />
                <span>Comparador de Fichas Técnicas</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 font-['Outfit']">
                Comparador de Vehículos Lado a Lado
              </h1>
              <p className="text-sm text-zinc-600 mt-1">
                Analizá diferencias técnicas, equipamiento, motorización y valores de hasta 3 unidades simultáneamente.
              </p>
            </div>

            {compareList.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={clearCompare}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Limpiar Comparador</span>
                </button>
              </div>
            )}
          </div>

          {/* Selector para agregar vehículos (Bloqueado a la misma categoría) */}
          {compareList.length < 3 && (
            <div className="mt-6 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Agregar {categoriaActual ? formatNombreTipo(categoriaActual) : 'vehículo'} a comparar:
                </span>
                {categoriaActual && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wide">
                    Exclusivo {formatNombreTipo(categoriaActual)}
                  </span>
                )}
              </div>

              <select
                value={vehiculoSeleccionadoId}
                onChange={(e) => {
                  setVehiculoSeleccionadoId(e.target.value);
                  handleAgregarDesdeSelect(e.target.value);
                }}
                className="w-full sm:w-auto flex-1 px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500"
              >
                <option value="">
                  {categoriaActual
                    ? `-- Seleccionar otra unidad de tipo ${formatNombreTipo(categoriaActual)} (${vehiculosFiltradosParaAgregar.length} disponibles) --`
                    : `-- Seleccionar primer vehículo en stock (${vehiculosFiltradosParaAgregar.length} disponibles) --`}
                </option>
                {vehiculosFiltradosParaAgregar.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.marca} {v.modelo} {v.version} ({v.anio}) • {v.tipoVehiculo} - USD ${v.precio.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 flex-1">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                Cargando datos comparativos...
              </p>
            </div>
          ) : detallesVehiculos.length === 0 ? (
            <div className="max-w-xl mx-auto py-16 text-center space-y-6 bg-white rounded-3xl p-8 border border-zinc-200 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
                <Scale className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-zinc-900 font-['Outfit']">
                  No tenés vehículos seleccionados para comparar
                </h3>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">
                  Explorá nuestro catálogo y hacé clic en el botón «Comparar» en las tarjetas o seleccioná una unidad desde el menú superior.
                </p>
              </div>
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-500/20"
              >
                <span>Ir al Catálogo de Stock</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[800px] bg-white rounded-3xl border border-zinc-200 shadow-xs overflow-hidden">
                {/* Header Row: Vehicle Cards */}
                <div className="grid grid-cols-4 border-b border-zinc-200 divide-x divide-zinc-200 bg-zinc-50/50">
                  <div className="p-6 flex flex-col justify-end">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                      Especificación
                    </span>
                    <h3 className="text-lg font-bold text-zinc-900 font-['Outfit']">
                      Comparativa Técnica
                    </h3>
                    <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200 w-fit uppercase">
                      {React.createElement(getTipoIcon(categoriaActual || 'AUTOMOVIL'), { className: 'w-4 h-4 text-emerald-700' })}
                      <span>{formatNombreTipo(categoriaActual)}</span>
                    </div>
                  </div>

                  {detallesVehiculos.map((v) => {
                    const imgs = parseImgs(v.imagenesUrls);
                    const foto = imgs[0] || 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80';
                    return (
                      <div key={v.id} className="p-6 relative flex flex-col justify-between space-y-4">
                        <button
                          onClick={() => removeFromCompare(v.id)}
                          className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-100 hover:bg-rose-50 text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Quitar de la comparativa"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <div className="relative h-44 rounded-xl overflow-hidden bg-zinc-100">
                          <img src={foto} alt={v.modelo} className="w-full h-full object-cover" />
                          <div className="absolute top-2 left-2 bg-zinc-900/90 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded">
                            {v.tipoVehiculo}
                          </div>
                        </div>

                        <div>
                          <span className="text-[11px] font-bold uppercase text-emerald-600">{v.marca}</span>
                          <h4 className="text-base font-bold text-zinc-900 font-['Outfit'] line-clamp-1">
                            {v.modelo} {v.version}
                          </h4>
                          <div className="text-xl font-extrabold text-zinc-900 mt-2 font-mono">
                            USD ${v.precio.toLocaleString()}
                          </div>
                        </div>

                        <Link
                          href={`/catalogo/${v.id}`}
                          className="w-full py-2 text-center rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                          Ver Ficha Completa
                        </Link>
                      </div>
                    );
                  })}

                  {/* Empty slots placeholders */}
                  {Array.from({ length: 3 - detallesVehiculos.length }).map((_, i) => (
                    <div key={i} className="p-8 flex flex-col items-center justify-center text-center text-zinc-400 space-y-3">
                      <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-zinc-200 flex items-center justify-center">
                        <Plus className="w-5 h-5 text-zinc-400" />
                      </div>
                      <span className="text-xs font-semibold">Espacio libre para comparar</span>
                    </div>
                  ))}
                </div>

                {/* ═══════════════════════════════════════════════════════════ */}
                {/* 1. SECCIÓN: IDENTIFICACIÓN Y MOTORIZACIÓN                  */}
                {/* ═══════════════════════════════════════════════════════════ */}
                <div className="divide-y divide-zinc-100 text-xs">
                  <div className="bg-zinc-100/60 px-6 py-2.5 font-bold uppercase tracking-wider text-zinc-700 text-[10px]">
                    1. Identificación y Motorización
                  </div>

                  <div className="grid grid-cols-4 divide-x divide-zinc-100 p-4">
                    <span className="font-semibold text-zinc-500">Año de Fabricación</span>
                    {detallesVehiculos.map((v) => (
                      <span key={v.id} className="font-bold text-zinc-900 pl-4">{v.anio}</span>
                    ))}
                  </div>

                  <div className="grid grid-cols-4 divide-x divide-zinc-100 p-4">
                    <span className="font-semibold text-zinc-500">Condición / Rodaje</span>
                    {detallesVehiculos.map((v) => (
                      <span key={v.id} className="font-bold text-zinc-900 pl-4">
                        {getFilaCondicion(v)}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-4 divide-x divide-zinc-100 p-4">
                    <span className="font-semibold text-zinc-500">Tipo de Combustible</span>
                    {detallesVehiculos.map((v) => (
                      <span key={v.id} className="font-bold text-zinc-900 pl-4">{v.combustible || '-'}</span>
                    ))}
                  </div>

                  {/* Campo Motorización según Tipo */}
                  <div className="grid grid-cols-4 divide-x divide-zinc-100 p-4">
                    <span className="font-semibold text-zinc-500">
                      {categoriaActual === 'MOTOCICLETA'
                        ? 'Cilindrada y Ciclo de Motor'
                        : categoriaActual === 'EMBARCACION'
                        ? 'Marca y Fabricación del Motor'
                        : 'Motorización / Planta Motriz'}
                    </span>
                    {detallesVehiculos.map((v) => {
                      if (v.tipoVehiculo === 'MOTOCICLETA') {
                        return (
                          <span key={v.id} className="font-bold text-zinc-900 pl-4">
                            {v.motocicleta?.cilindradaCc ? `${v.motocicleta.cilindradaCc} cc` : '-'} ({v.motocicleta?.motorTiempos || 4} Tiempos)
                          </span>
                        );
                      }
                      if (v.tipoVehiculo === 'EMBARCACION') {
                        return (
                          <span key={v.id} className="font-bold text-zinc-900 pl-4">
                            {v.embarcacion?.marcaMotor ? `${v.embarcacion.marcaMotor} (Año ${v.embarcacion.anioMotor || v.anio})` : '-'}
                          </span>
                        );
                      }
                      if (v.tipoVehiculo === 'AUTOMOVIL') {
                        return (
                          <span key={v.id} className="font-bold text-zinc-900 pl-4">
                            {v.automovil?.motor || '-'}
                          </span>
                        );
                      }
                      return (
                        <span key={v.id} className="font-bold text-zinc-900 pl-4">
                          {v.potencia ? `${v.potencia} CV Turbo Diésel` : '-'}
                        </span>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-4 divide-x divide-zinc-100 p-4">
                    <span className="font-semibold text-zinc-500">Potencia Máxima</span>
                    {detallesVehiculos.map((v) => (
                      <span key={v.id} className="font-bold text-zinc-900 pl-4">
                        {v.potencia ? `${v.potencia} ${v.tipoVehiculo === 'CAMION' ? 'CV' : 'CV/HP'}` : '-'}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-4 divide-x divide-zinc-100 p-4">
                    <span className="font-semibold text-zinc-500">Torque Máximo</span>
                    {detallesVehiculos.map((v) => (
                      <span key={v.id} className="font-bold text-zinc-900 pl-4">
                        {v.torqueNm ? `${v.torqueNm} Nm` : '-'}
                      </span>
                    ))}
                  </div>

                  {/* Transmisión / Propulsión */}
                  <div className="grid grid-cols-4 divide-x divide-zinc-100 p-4">
                    <span className="font-semibold text-zinc-500">
                      {categoriaActual === 'MOTOCICLETA'
                        ? 'Transmisión Secundaria'
                        : categoriaActual === 'EMBARCACION'
                        ? 'Tipo de Propulsión'
                        : categoriaActual === 'CAMION'
                        ? 'Sistema de Frenos'
                        : categoriaActual === 'MOTORHOME'
                        ? 'Tipo de Dirección'
                        : 'Transmisión'}
                    </span>
                    {detallesVehiculos.map((v) => {
                      if (v.tipoVehiculo === 'MOTOCICLETA') {
                        return (
                          <span key={v.id} className="font-bold text-zinc-900 pl-4">
                            {v.motocicleta?.transmisionMoto?.replace(/_/g, ' ') || 'Cadena'}
                          </span>
                        );
                      }
                      if (v.tipoVehiculo === 'EMBARCACION') {
                        return (
                          <span key={v.id} className="font-bold text-zinc-900 pl-4">
                            {v.embarcacion?.tipoMotor?.replace(/_/g, ' ') || 'Fuera de Borda'}
                          </span>
                        );
                      }
                      if (v.tipoVehiculo === 'CAMION') {
                        return (
                          <span key={v.id} className="font-bold text-zinc-900 pl-4">
                            {v.camion?.tipoFreno ? `Frenos ${v.camion.tipoFreno.replace(/_/g, ' ')}` : 'Aire ABS'}
                          </span>
                        );
                      }
                      if (v.tipoVehiculo === 'MOTORHOME') {
                        return (
                          <span key={v.id} className="font-bold text-zinc-900 pl-4">
                            {v.tipoDireccion ? `Dirección ${v.tipoDireccion.replace(/_/g, ' ')}` : 'Asistida'}
                          </span>
                        );
                      }
                      const tr = v.automovil?.transmision?.replace(/_/g, ' ') || '-';
                      const trac = v.automovil?.traccion ? ` (${v.automovil.traccion.replace(/_/g, ' ')})` : '';
                      return (
                        <span key={v.id} className="font-bold text-zinc-900 pl-4">
                          {tr}{trac}
                        </span>
                      );
                    })}
                  </div>

                  {/* Tracción / Arranque / Refrigeración / Ejes */}
                  <div className="grid grid-cols-4 divide-x divide-zinc-100 p-4">
                    <span className="font-semibold text-zinc-500">
                      {categoriaActual === 'MOTOCICLETA'
                        ? 'Arranque y Refrigeración'
                        : categoriaActual === 'EMBARCACION'
                        ? 'Cantidad de Motores'
                        : categoriaActual === 'CAMION'
                        ? 'Ejes y Suspensión'
                        : categoriaActual === 'MOTORHOME'
                        ? 'Banco de Baterías'
                        : 'Tracción'}
                    </span>
                    {detallesVehiculos.map((v) => {
                      if (v.tipoVehiculo === 'MOTOCICLETA') {
                        const arr = v.motocicleta?.tipoArranque ? `Arranque ${v.motocicleta.tipoArranque.replace(/_/g, ' ')}` : '';
                        const ref = v.motocicleta?.refrigeracion ? `Refrig. ${v.motocicleta.refrigeracion.replace(/_/g, ' ')}` : '';
                        return (
                          <span key={v.id} className="font-bold text-zinc-900 pl-4">
                            {[arr, ref].filter(Boolean).join(' • ') || '-'}
                          </span>
                        );
                      }
                      if (v.tipoVehiculo === 'EMBARCACION') {
                        return (
                          <span key={v.id} className="font-bold text-zinc-900 pl-4">
                            {v.embarcacion?.numeroMotores ? `${v.embarcacion.numeroMotores} Motor(es)` : '1 Motor'}
                          </span>
                        );
                      }
                      if (v.tipoVehiculo === 'CAMION') {
                        return (
                          <span key={v.id} className="font-bold text-zinc-900 pl-4">
                            {v.camion?.cantidadEjes ? `${v.camion.cantidadEjes} Ejes (Susp. ${v.camion.suspension?.replace(/_/g, ' ') || 'Neumática'})` : '-'}
                          </span>
                        );
                      }
                      if (v.tipoVehiculo === 'MOTORHOME') {
                        return (
                          <span key={v.id} className="font-bold text-zinc-900 pl-4">
                            {v.motorhome?.capacidadBateriasAh ? `${v.motorhome.capacidadBateriasAh} Ah` : '-'}
                          </span>
                        );
                      }
                      return (
                        <span key={v.id} className="font-bold text-zinc-900 pl-4">
                          {v.automovil?.traccion?.replace(/_/g, ' ') || '-'}
                        </span>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-4 divide-x divide-zinc-100 p-4">
                    <span className="font-semibold text-zinc-500">Tanque de Combustible</span>
                    {detallesVehiculos.map((v) => (
                      <span key={v.id} className="font-bold text-zinc-900 pl-4">
                        {v.capacidadTanqueCombustible ? `${v.capacidadTanqueCombustible} Litros` : '-'}
                      </span>
                    ))}
                  </div>

                  {/* ═══════════════════════════════════════════════════════════ */}
                  {/* 2. SECCIÓN: DIMENSIONES, CARROCERÍA Y CAPACIDADES           */}
                  {/* ═══════════════════════════════════════════════════════════ */}
                  <div className="bg-zinc-100/60 px-6 py-2.5 font-bold uppercase tracking-wider text-zinc-700 text-[10px]">
                    2. Dimensiones, Carrocería y Capacidades
                  </div>

                  <div className="grid grid-cols-4 divide-x divide-zinc-100 p-4">
                    <span className="font-semibold text-zinc-500">
                      {categoriaActual === 'MOTOCICLETA'
                        ? 'Estilo de Moto'
                        : categoriaActual === 'EMBARCACION'
                        ? 'Tipo de Embarcación y Casco'
                        : 'Tipo de Carrocería'}
                    </span>
                    {detallesVehiculos.map((v) => {
                      if (v.tipoVehiculo === 'MOTOCICLETA') {
                        return (
                          <span key={v.id} className="font-bold text-zinc-900 pl-4 uppercase">
                            {v.motocicleta?.estilo?.replace(/_/g, ' ') || 'Naked'}
                          </span>
                        );
                      }
                      if (v.tipoVehiculo === 'EMBARCACION') {
                        const t = v.embarcacion?.tipoEmbarcacion?.replace(/_/g, ' ') || 'Lancha';
                        const m = v.embarcacion?.materialCasco ? ` (${v.embarcacion.materialCasco.replace(/_/g, ' ')})` : '';
                        return (
                          <span key={v.id} className="font-bold text-zinc-900 pl-4 uppercase">
                            {t}{m}
                          </span>
                        );
                      }
                      if (v.tipoVehiculo === 'CAMION') {
                        return (
                          <span key={v.id} className="font-bold text-zinc-900 pl-4 uppercase">
                            {v.camion?.tipoCarroceria?.replace(/_/g, ' ') || 'Chasis'}
                          </span>
                        );
                      }
                      if (v.tipoVehiculo === 'MOTORHOME') {
                        return (
                          <span key={v.id} className="font-bold text-zinc-900 pl-4 uppercase">
                            Casa Rodante / Motorhome
                          </span>
                        );
                      }
                      return (
                        <span key={v.id} className="font-bold text-zinc-900 pl-4 uppercase">
                          {v.automovil?.tipoAutomovil?.replace(/_/g, ' ') || 'Sedán'}
                        </span>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-4 divide-x divide-zinc-100 p-4">
                    <span className="font-semibold text-zinc-500">
                      {categoriaActual === 'MOTOCICLETA'
                        ? 'Altura del Asiento'
                        : categoriaActual === 'EMBARCACION'
                        ? 'Dimensiones Náuticas (Eslora x Manga x Puntal)'
                        : 'Dimensiones (Largo x Ancho x Alto)'}
                    </span>
                    {detallesVehiculos.map((v) => {
                      if (v.tipoVehiculo === 'MOTOCICLETA') {
                        return (
                          <span key={v.id} className="font-bold text-zinc-900 pl-4">
                            {v.motocicleta?.alturaAsientoMm ? `${v.motocicleta.alturaAsientoMm} mm` : '-'}
                          </span>
                        );
                      }
                      if (v.tipoVehiculo === 'EMBARCACION') {
                        return (
                          <span key={v.id} className="font-bold text-zinc-900 pl-4">
                            {v.embarcacion?.esloraMetros
                              ? `Eslora: ${v.embarcacion.esloraMetros}m • Manga: ${v.embarcacion.mangaMetros || '-'}m • Puntal: ${v.embarcacion.puntalMetros || '-'}m`
                              : '-'}
                          </span>
                        );
                      }
                      return (
                        <span key={v.id} className="font-bold text-zinc-900 pl-4">
                          {v.largoMetros && v.anchoMetros && v.altoMetros
                            ? `${v.largoMetros}m (L) x ${v.anchoMetros}m (An) x ${v.altoMetros}m (Al)`
                            : '-'}
                        </span>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-4 divide-x divide-zinc-100 p-4">
                    <span className="font-semibold text-zinc-500">
                      {categoriaActual === 'MOTOCICLETA'
                        ? 'Peso en Seco'
                        : categoriaActual === 'EMBARCACION'
                        ? 'Peso del Casco en Seco'
                        : categoriaActual === 'CAMION'
                        ? 'Peso Tara'
                        : 'Peso'}
                    </span>
                    {detallesVehiculos.map((v) => (
                      <span key={v.id} className="font-bold text-zinc-900 pl-4">
                        {v.pesoKg ? `${v.pesoKg.toLocaleString('es-AR')} kg` : '-'}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-4 divide-x divide-zinc-100 p-4">
                    <span className="font-semibold text-zinc-500">
                      {categoriaActual === 'MOTOCICLETA'
                        ? 'Llantas y Neumáticos'
                        : categoriaActual === 'EMBARCACION'
                        ? 'Capacidad y Tanque de Agua'
                        : categoriaActual === 'CAMION'
                        ? 'Carga Útil y Peso Bruto PBTC'
                        : categoriaActual === 'MOTORHOME'
                        ? 'Plazas Camas y Tanques de Agua'
                        : 'Capacidad Baúl y Habitáculo'}
                    </span>
                    {detallesVehiculos.map((v) => {
                      if (v.tipoVehiculo === 'MOTOCICLETA') {
                        const ll = v.motocicleta?.tipoLlanta ? `Llantas ${v.motocicleta.tipoLlanta.replace(/_/g, ' ')}` : '';
                        const neu = v.motocicleta?.neumaticoDelantero ? `Neum: ${v.motocicleta.neumaticoDelantero} / ${v.motocicleta.neumaticoTrasero || ''}` : '';
                        return (
                          <span key={v.id} className="font-bold text-zinc-900 pl-4">
                            {[ll, neu].filter(Boolean).join(' • ') || '-'}
                          </span>
                        );
                      }
                      if (v.tipoVehiculo === 'CAMION') {
                        const carga = v.camion?.capacidadCargaKg ? `Carga: ${v.camion.capacidadCargaKg.toLocaleString('es-AR')} kg` : '';
                        const pbtc = v.camion?.pesoBrutoVehicularKg ? `PBTC: ${v.camion.pesoBrutoVehicularKg.toLocaleString('es-AR')} kg` : '';
                        return (
                          <span key={v.id} className="font-bold text-zinc-900 pl-4">
                            {[carga, pbtc].filter(Boolean).join(' • ') || '-'}
                          </span>
                        );
                      }
                      if (v.tipoVehiculo === 'EMBARCACION') {
                        const pax = v.embarcacion?.capacidadPersonas ? `Capacidad: ${v.embarcacion.capacidadPersonas} personas` : '';
                        const agua = v.embarcacion?.capacidadAguaDulceLitros ? `Agua: ${v.embarcacion.capacidadAguaDulceLitros} L` : '';
                        return (
                          <span key={v.id} className="font-bold text-zinc-900 pl-4">
                            {[pax, agua].filter(Boolean).join(' • ') || '-'}
                          </span>
                        );
                      }
                      if (v.tipoVehiculo === 'MOTORHOME') {
                        const camas = v.motorhome?.capacidadCamas ? `Camas: ${v.motorhome.capacidadCamas} plazas` : '';
                        const agua = v.motorhome?.capacidadTanqueAguaLitros ? `Agua Limpia: ${v.motorhome.capacidadTanqueAguaLitros} L` : '';
                        return (
                          <span key={v.id} className="font-bold text-zinc-900 pl-4">
                            {[camas, agua].filter(Boolean).join(' • ') || '-'}
                          </span>
                        );
                      }
                      const baul = v.automovil?.capacidadBaulLitros ? `Baúl: ${v.automovil.capacidadBaulLitros} L` : '';
                      const ptas = v.automovil?.cantidadPuertas ? `${v.automovil.cantidadPuertas} Puertas` : '';
                      const as = v.automovil?.cantidadAsientos ? `${v.automovil.cantidadAsientos} Asientos` : '';
                      return (
                        <span key={v.id} className="font-bold text-zinc-900 pl-4">
                          {[baul, ptas, as].filter(Boolean).join(' • ') || '-'}
                        </span>
                      );
                    })}
                  </div>

                  {/* ═══════════════════════════════════════════════════════════ */}
                  {/* 3. SECCIÓN: EQUIPAMIENTO, TECNOLOGÍA Y CONFORT             */}
                  {/* ═══════════════════════════════════════════════════════════ */}
                  <div className="bg-zinc-100/60 px-6 py-2.5 font-bold uppercase tracking-wider text-zinc-700 text-[10px] flex items-center justify-between">
                    <span>3. Equipamiento, Tecnología y Confort</span>
                    <span className="text-emerald-700 font-extrabold uppercase text-[10px]">
                      Equipamiento Oficial ({formatNombreTipo(categoriaActual)})
                    </span>
                  </div>

                  {/* MOTOCICLETAS */}
                  {categoriaActual === 'MOTOCICLETA' && (
                    <>
                      {[
                        { label: 'Frenos ABS (Doble Canal)', check: (v: any) => Boolean(v.motocicleta?.abs) },
                        { label: 'Control de Tracción (TCS)', check: (v: any) => Boolean(v.motocicleta?.controlTraccionTcs) },
                        { label: 'Modos de Conducción (Riding Modes)', check: (v: any) => Boolean(v.motocicleta?.modosConduccion) },
                        { label: 'Quickshifter (Up y Down)', check: (v: any) => Boolean(v.motocicleta?.quickshifter) },
                        { label: 'Pantalla Digital TFT Bluetooth', check: (v: any) => Boolean(v.motocicleta?.pantallaTftBluetooth) },
                        { label: 'Iluminación Full LED', check: (v: any) => Boolean(v.motocicleta?.lucesLed) },
                        { label: 'Puños Calefaccionables', check: (v: any) => Boolean(v.motocicleta?.punosCalefaccionables) },
                        { label: 'Control de Velocidad Crucero', check: (v: any) => Boolean(v.motocicleta?.controlCrucero) },
                        { label: 'Parabrisas Regulable / Deflector', check: (v: any) => Boolean(v.motocicleta?.parabrisasRegulable) },
                        { label: 'Toma de Carga USB / 12V', check: (v: any) => Boolean(v.motocicleta?.puertoUsb12v) },
                        { label: 'Cubrepuños y Defensas Laterales', check: (v: any) => Boolean(v.motocicleta?.cubrepunosDefensas) },
                        { label: 'Caballete Central y Lateral', check: (v: any) => Boolean(v.motocicleta?.caballeteCentral) },
                      ].map((item, idx) => (
                        <div key={idx} className="grid grid-cols-4 divide-x divide-zinc-100 p-4 hover:bg-zinc-50/50 transition-colors">
                          <span className="font-semibold text-zinc-600">{item.label}</span>
                          {detallesVehiculos.map((v) => (
                            <div key={v.id} className="pl-4">
                              {item.check(v) ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                                  <Check className="w-4 h-4" /> Incluido
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-rose-500 font-semibold">
                                  <X className="w-4 h-4 text-rose-500" /> No incluido
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </>
                  )}

                  {/* CAMIONES */}
                  {categoriaActual === 'CAMION' && (
                    <>
                      {[
                        { label: 'Climatizador / Aire en Cabina', check: (v: any) => Boolean(v.camion?.aireAcondicionadoCabina) },
                        { label: 'Frenos de Aire con ABS', check: (v: any) => Boolean(v.camion?.frenosAireAbs) },
                        { label: 'Control de Estabilidad (ESP / ASR)', check: (v: any) => Boolean(v.camion?.controlEstabilidadEsp) },
                        { label: 'Butaca Conductor Neumática', check: (v: any) => Boolean(v.camion?.butacaNeumatica) },
                        { label: 'Suspensión Neumática de Cabina', check: (v: any) => Boolean(v.camion?.suspensionNeumaticaCabina) },
                        { label: 'Control de Velocidad Crucero', check: (v: any) => Boolean(v.camion?.controlCrucero) },
                        { label: 'Calefacción Auxiliar / Climatizador', check: (v: any) => Boolean(v.camion?.calefaccionAuxiliar) },
                        { label: 'Freno Motor Auxiliar / Retarder', check: (v: any) => Boolean(v.camion?.frenoMotorRetarder) },
                        { label: 'Tacógrafo Digital Homologado', check: (v: any) => Boolean(v.camion?.tacografoDigital) },
                        { label: 'Pantalla Multimedia Conectada', check: (v: any) => Boolean(v.camion?.pantallaMultimedia) },
                        { label: 'Cámara de Retroceso / Asistencia', check: (v: any) => Boolean(v.camion?.camaraRetroceso) },
                        { label: 'Sensores de Proximidad', check: (v: any) => Boolean(v.camion?.sensoresEstacionamiento) },
                      ].map((item, idx) => (
                        <div key={idx} className="grid grid-cols-4 divide-x divide-zinc-100 p-4 hover:bg-zinc-50/50 transition-colors">
                          <span className="font-semibold text-zinc-600">{item.label}</span>
                          {detallesVehiculos.map((v) => (
                            <div key={v.id} className="pl-4">
                              {item.check(v) ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                                  <Check className="w-4 h-4" /> Incluido
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-rose-500 font-semibold">
                                  <X className="w-4 h-4 text-rose-500" /> No incluido
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </>
                  )}

                  {/* EMBARCACIONES */}
                  {categoriaActual === 'EMBARCACION' && (
                    <>
                      {[
                        { label: 'Trailer Homologado Incluido', check: (v: any) => Boolean(v.embarcacion?.tieneTrailer) },
                        { label: 'Bomba de Achique Automática', check: (v: any) => Boolean(v.embarcacion?.bombaAchique) },
                        { label: 'Ecosonda / GPS Náutico', check: (v: any) => Boolean(v.embarcacion?.ecosonda) },
                        { label: 'Escalera de Popa Inoxidable', check: (v: any) => Boolean(v.embarcacion?.escaleraPopa) },
                        { label: 'Audio Marino Bluetooth', check: (v: any) => Boolean(v.embarcacion?.audio) },
                        { label: 'Toldo Bimini / Capota de Sol', check: (v: any) => Boolean(v.embarcacion?.toldoBimini) },
                        { label: 'Cerramiento de Lona Completo', check: (v: any) => Boolean(v.embarcacion?.cerramientoCompleto) },
                        { label: 'Malacate / Molinete Eléctrico', check: (v: any) => Boolean(v.embarcacion?.malacateElectrico) },
                        { label: 'Luces de Navegación Reglamentarias', check: (v: any) => Boolean(v.embarcacion?.lucesNavegacion) },
                        { label: 'Radio VHF Marina / Antena', check: (v: any) => Boolean(v.embarcacion?.radioVHF) },
                        { label: 'Ducha de Popa Presurizada', check: (v: any) => Boolean(v.embarcacion?.duchaPopa) },
                        { label: 'Barra de Ski / Torre Wakeboard', check: (v: any) => Boolean(v.embarcacion?.barraSki) },
                        { label: 'Solárium de Proa con Colchonetas', check: (v: any) => Boolean(v.embarcacion?.solariumProa) },
                        { label: 'Mesa de Cockpit Desmontable', check: (v: any) => Boolean(v.embarcacion?.mesaCockpit) },
                        { label: 'Inodoro Marino / Baño', check: (v: any) => Boolean(v.embarcacion?.inodoroMarino) },
                        { label: 'Conservadora / Heladera Náutica', check: (v: any) => Boolean(v.embarcacion?.heladeraNautica) },
                      ].map((item, idx) => (
                        <div key={idx} className="grid grid-cols-4 divide-x divide-zinc-100 p-4 hover:bg-zinc-50/50 transition-colors">
                          <span className="font-semibold text-zinc-600">{item.label}</span>
                          {detallesVehiculos.map((v) => (
                            <div key={v.id} className="pl-4">
                              {item.check(v) ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                                  <Check className="w-4 h-4" /> Incluido
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-rose-500 font-semibold">
                                  <X className="w-4 h-4 text-rose-500" /> No incluido
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </>
                  )}

                  {/* MOTORHOMES */}
                  {categoriaActual === 'MOTORHOME' && (
                    <>
                      {[
                        { label: 'Cocina Completa / Anafe', check: (v: any) => Boolean(v.motorhome?.tieneCocina) },
                        { label: 'Baño Completo con Ducha e Inodoro', check: (v: any) => Boolean(v.motorhome?.tieneBano) },
                        { label: 'Ducha Exterior Presurizada', check: (v: any) => Boolean(v.motorhome?.tieneDuchaExterior) },
                        { label: 'Paneles Solares Fotovoltaicos', check: (v: any) => Boolean(v.motorhome?.tienePanelesSolares) },
                        { label: 'Calefacción Estacionaria / Tiro Bal.', check: (v: any) => Boolean(v.motorhome?.tieneCalefaccion) },
                        { label: 'Generador Eléctrico Integrado', check: (v: any) => Boolean(v.motorhome?.tieneGenerador) },
                        { label: 'Smart TV / Antena / Audio', check: (v: any) => Boolean(v.motorhome?.tieneTV) },
                        { label: 'Aire Acondicionado Habitáculo', check: (v: any) => Boolean(v.motorhome?.aireAcondicionadoHabitaculo) },
                        { label: 'Toldo Exterior Extensible', check: (v: any) => Boolean(v.motorhome?.toldoExterior) },
                        { label: 'Inversor 12V a 220V', check: (v: any) => Boolean(v.motorhome?.inversorCorriente220v) },
                        { label: 'Heladera con Freezer Trivalente', check: (v: any) => Boolean(v.motorhome?.heladeraFreezer) },
                        { label: 'Termotanque / Calefón Automático', check: (v: any) => Boolean(v.motorhome?.termotanqueCalefon) },
                        { label: 'Instalación Gas Envasado', check: (v: any) => Boolean(v.motorhome?.garrafaGasEnvasado) },
                        { label: 'Escalón de Acceso Eléctrico', check: (v: any) => Boolean(v.motorhome?.escalonElectrico) },
                        { label: 'Soporte Bicicletas / Enganche', check: (v: any) => Boolean(v.motorhome?.soporteBicicletasEnganche) },
                        { label: 'Cámara de Retroceso', check: (v: any) => Boolean(v.motorhome?.tieneCamaraRetroceso) },
                      ].map((item, idx) => (
                        <div key={idx} className="grid grid-cols-4 divide-x divide-zinc-100 p-4 hover:bg-zinc-50/50 transition-colors">
                          <span className="font-semibold text-zinc-600">{item.label}</span>
                          {detallesVehiculos.map((v) => (
                            <div key={v.id} className="pl-4">
                              {item.check(v) ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                                  <Check className="w-4 h-4" /> Incluido
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-rose-500 font-semibold">
                                  <X className="w-4 h-4 text-rose-500" /> No incluido
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </>
                  )}

                  {/* AUTOMÓVILES (O DEFAULT) */}
                  {(categoriaActual === 'AUTOMOVIL' || !categoriaActual) && (
                    <>
                      {[
                        { label: 'Aire Acondicionado / Climatizador', check: (v: any) => Boolean(v.tieneAireAcondicionado || v.automovil?.tieneAireAcondicionado) },
                        { label: 'Apple CarPlay / Android Auto', check: (v: any) => Boolean(v.tieneAppleCarplayAndroidAuto || v.automovil?.tieneAppleCarplayAndroidAuto) },
                        { label: 'Cámara de Retroceso / Visión 360°', check: (v: any) => Boolean(v.tieneCamaraRetroceso || v.automovil?.tieneCamaraRetroceso) },
                        { label: 'Sensores de Estacionamiento', check: (v: any) => Boolean(v.tieneSensoresEstacionamiento || v.automovil?.tieneSensoresEstacionamiento) },
                        { label: 'Techo Solar Panorámico', check: (v: any) => Boolean(v.tieneTechoSolar || v.automovil?.tieneTechoSolar) },
                        { label: 'Frenos ABS', check: (v: any) => Boolean(v.automovil?.abs) },
                        { label: 'Control de Estabilidad (ESP)', check: (v: any) => Boolean(v.automovil?.controlEstabilidad) },
                        { label: 'Control Crucero Adaptativo', check: (v: any) => Boolean(v.automovil?.controlCruceroAdaptativo) },
                        { label: 'Tapizado en Cuero Premium', check: (v: any) => Boolean(v.automovil?.asientosCuero) },
                        { label: 'Butacas Eléctricas con Memoria', check: (v: any) => Boolean(v.automovil?.asientosElectricos) },
                        { label: 'Acceso Keyless y Arranque Botón', check: (v: any) => Boolean(v.automovil?.arranqueBotonKeyless) },
                        { label: 'Cargador Inalámbrico Celular', check: (v: any) => Boolean(v.automovil?.cargadorInalambrico) },
                        { label: 'Faros Full LED Automáticos', check: (v: any) => Boolean(v.automovil?.lucesLedAutomaticas) },
                        { label: 'Freno de Mano Eléctrico / Auto-Hold', check: (v: any) => Boolean(v.automovil?.frenoEstacionamientoElectrico) },
                        { label: 'Alerta de Punto Ciego / Carril', check: (v: any) => Boolean(v.automovil?.alertaPuntoCiego) },
                      ].map((item, idx) => (
                        <div key={idx} className="grid grid-cols-4 divide-x divide-zinc-100 p-4 hover:bg-zinc-50/50 transition-colors">
                          <span className="font-semibold text-zinc-600">{item.label}</span>
                          {detallesVehiculos.map((v) => (
                            <div key={v.id} className="pl-4">
                              {item.check(v) ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                                  <Check className="w-4 h-4" /> Incluido
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-rose-500 font-semibold">
                                  <X className="w-4 h-4 text-rose-500" /> No incluido
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
