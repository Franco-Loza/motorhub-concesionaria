'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Car,
  PlusCircle,
  Search,
  SlidersHorizontal,
  Edit,
  Trash2,
  ExternalLink,
  AlertTriangle,
  Receipt,
  DollarSign,
  Plus,
  X,
  TrendingUp,
  CheckCircle2,
  FileText,
  Eye,
  Lock,
  Zap,
} from 'lucide-react';

export default function GestionCatalogoPage() {
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('TODOS');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [publishingMLId, setPublishingMLId] = useState<number | null>(null);
  const [toastML, setToastML] = useState<string | null>(null);

  // Modal Eliminar
  const [vehiculoAEliminar, setVehiculoAEliminar] = useState<any>(null);
  const [eliminando, setEliminando] = useState(false);

  // Modal Ficha Técnica
  const [vehiculoFicha, setVehiculoFicha] = useState<any>(null);
  const [fichaDetallada, setFichaDetallada] = useState<any>(null);
  const [loadingFicha, setLoadingFicha] = useState(false);

  // Modal Gastos y Margen
  const [vehiculoGastos, setVehiculoGastos] = useState<any>(null);
  const [gastosData, setGastosData] = useState<any>(null);
  const [loadingGastos, setLoadingGastos] = useState(false);
  const [costoCompraInput, setCostoCompraInput] = useState<number | string>('');
  const [tipoGasto, setTipoGasto] = useState('MECANICA');
  const [descGasto, setDescGasto] = useState('');
  const [montoGasto, setMontoGasto] = useState<number | string>('');
  const [guardandoGasto, setGuardandoGasto] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const abrirModalGastos = async (v: any) => {
    setVehiculoGastos(v);
    setCostoCompraInput(v.costoCompra || '');
    setTipoGasto('MECANICA');
    setDescGasto('');
    setMontoGasto('');
    setLoadingGastos(true);
    try {
      const res = await fetch(`/api/vehiculos/${v.id}/gastos`);
      if (res.ok) {
        const data = await res.json();
        setGastosData(data);
        if (data.vehiculo?.costoCompra) {
          setCostoCompraInput(data.vehiculo.costoCompra);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGastos(false);
    }
  };

  const abrirModalFicha = async (v: any) => {
    setVehiculoFicha(v);
    setFichaDetallada(v);
    setLoadingFicha(true);
    try {
      const res = await fetch(`/api/vehiculos/${v.id}`);
      if (res.ok) {
        const data = await res.json();
        setFichaDetallada(data);
      }
    } catch (err) {
      console.error('Error al cargar ficha técnica:', err);
    } finally {
      setLoadingFicha(false);
    }
  };

  const handleGuardarGasto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehiculoGastos) return;
    setGuardandoGasto(true);
    try {
      const res = await fetch(`/api/vehiculos/${vehiculoGastos.id}/gastos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          costoCompra: costoCompraInput !== '' ? Number(costoCompraInput) : undefined,
          tipoGasto: descGasto ? tipoGasto : undefined,
          descripcion: descGasto || undefined,
          monto: montoGasto !== '' ? Number(montoGasto) : undefined,
        }),
      });
      if (res.ok) {
        // Recargar gastos y stock
        const resG = await fetch(`/api/vehiculos/${vehiculoGastos.id}/gastos`);
        if (resG.ok) {
          const data = await resG.json();
          setGastosData(data);
        }
        setDescGasto('');
        setMontoGasto('');
        cargarDatos();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGuardandoGasto(false);
    }
  };

  const handleEliminarGasto = async (gastoId: number) => {
    if (!vehiculoGastos) return;
    try {
      const res = await fetch(`/api/vehiculos/${vehiculoGastos.id}/gastos?gastoId=${gastoId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const resG = await fetch(`/api/vehiculos/${vehiculoGastos.id}/gastos`);
        if (resG.ok) {
          const data = await resG.json();
          setGastosData(data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [resVehiculos, resMe] = await Promise.all([
        fetch('/api/vehiculos'),
        fetch('/api/auth/me'),
      ]);

      if (resVehiculos.ok) {
        const dataV = await resVehiculos.json();
        setVehiculos(dataV);
      }

      if (resMe.ok) {
        const dataMe = await resMe.json();
        setCurrentUser(dataMe.user);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (!vehiculoAEliminar) return;
    setEliminando(true);
    try {
      const res = await fetch(`/api/vehiculos/${vehiculoAEliminar.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setVehiculoAEliminar(null);
        cargarDatos();
      } else {
        const err = await res.json();
        alert(err.error || 'Error al eliminar vehículo');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión');
    } finally {
      setEliminando(false);
    }
  };

  const handlePublicarML = async (vehiculoId: number) => {
    setPublishingMLId(vehiculoId);
    try {
      const res = await fetch(`/api/mercadolibre/publish/${vehiculoId}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        setToastML(data.message || 'Publicado con éxito en Mercado Libre');
        cargarDatos();
      } else {
        alert(data.error || 'Error al publicar en Mercado Libre');
      }
    } catch (err: any) {
      alert('Error de conexión al publicar en Mercado Libre');
    } finally {
      setPublishingMLId(null);
      setTimeout(() => setToastML(null), 4000);
    }
  };

  const vehiculosFiltrados = vehiculos.filter((v) => {
    const coincideTipo = tipoFiltro === 'TODOS' || v.tipoVehiculo === tipoFiltro;
    const coincideTexto =
      search === '' ||
      v.marca?.toLowerCase().includes(search.toLowerCase()) ||
      v.modelo?.toLowerCase().includes(search.toLowerCase()) ||
      v.patente?.toLowerCase().includes(search.toLowerCase());
    return coincideTipo && coincideTexto;
  });

  const isDueno = currentUser?.rol === 'DUENO';

  return (
    <>
      {toastML && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-zinc-950 text-amber-400 border border-amber-500/30 shadow-2xl text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>{toastML}</span>
        </div>
      )}

      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600 block mb-1">
              Inventario General
            </span>
            <h1 className="text-3xl font-extrabold text-black font-['Outfit']">
              Gestión de Stock
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/panel/mercadolibre"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-amber-950 bg-amber-400 hover:bg-amber-300 shadow-xs transition-all cursor-pointer font-['Outfit']"
            >
              <Zap className="w-4 h-4 fill-current" />
              Mercado Libre
            </Link>
            <Link
              href="/panel/cargar-vehiculo"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-950 bg-emerald-400 hover:bg-emerald-300 shadow-sm shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Cargar Nuevo Vehículo
            </Link>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por marca, modelo o patente..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {['TODOS', 'AUTOMOVIL', 'CAMION', 'EMBARCACION', 'MOTOCICLETA', 'MOTORHOME'].map((t) => (
              <button
                key={t}
                onClick={() => setTipoFiltro(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                  tipoFiltro === t
                    ? 'bg-emerald-400 text-zinc-950 font-bold shadow-xs'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {t === 'TODOS' ? 'Todos' : t}
              </button>
            ))}
          </div>
        </div>

        {/* Stock Table */}
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-600">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Unidad</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Año/KM</th>
                  <th className="py-3 px-4">Precio (USD)</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-400">
                      Cargando inventario...
                    </td>
                  </tr>
                ) : vehiculosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-400">
                      No se encontraron vehículos registrados con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  vehiculosFiltrados.map((v) => {
                    const isPublishedML = !!v.mercadoLibreId;
                    const isPublishingThis = publishingMLId === v.id;

                    return (
                    <tr key={v.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={v.imagenesUrls?.[0] || 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=200&q=80'}
                            alt={v.modelo}
                            className="w-12 h-10 rounded-lg object-cover bg-zinc-100 border border-zinc-200"
                          />
                          <div>
                            <div className="font-bold text-black text-sm flex items-center gap-2">
                              <span>{v.marca} {v.modelo}</span>
                              {isPublishedML && (
                                <a
                                  href={v.mercadoLibrePermalink || '#'}
                                  target="_blank"
                                  rel="noreferrer"
                                  title="Publicado en Mercado Libre"
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors"
                                >
                                  <Zap className="w-2.5 h-2.5 fill-current" />
                                  ML
                                </a>
                              )}
                            </div>
                            <div className="text-[11px] text-zinc-400 font-normal">
                              {v.version || 'Base'} • Pat: {v.patente || 'S/D'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-zinc-100 text-zinc-800">
                          {v.tipoVehiculo}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div>{v.anio}</div>
                        <div className="text-[11px] text-zinc-400">
                          {v.kilometraje ? `${v.kilometraje.toLocaleString()} km` : `${v.horasUso || 0} hs`}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-black text-sm">
                        USD ${v.precio?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase block w-fit ${
                              v.estado === 'DISPONIBLE'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-zinc-200 text-zinc-700'
                            }`}
                          >
                            {v.estado}
                          </span>
                          {isPublishedML && (
                            <span className="text-[9px] font-semibold text-amber-700 block">
                              ML: {v.mercadoLibreStatus === 'active' ? 'Activo' : v.mercadoLibreStatus}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {v.estado === 'VENDIDO' ? (
                            <>
                              <button
                                onClick={() => abrirModalFicha(v)}
                                title="Ver Ficha Técnica Completa (Unidad Vendida)"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-zinc-700 bg-zinc-100 hover:bg-zinc-200 hover:text-black font-bold text-xs transition-colors cursor-pointer"
                              >
                                <FileText className="w-3.5 h-3.5 text-zinc-500" />
                                <span>Ver Ficha</span>
                              </button>
                              <span
                                title="Unidad vendida: bloqueada para edición comercial"
                                className="p-1.5 text-zinc-300"
                              >
                                <Lock className="w-3.5 h-3.5" />
                              </span>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handlePublicarML(v.id)}
                                disabled={isPublishingThis}
                                title={isPublishedML ? 'Actualizar en Mercado Libre' : 'Publicar en Mercado Libre en 1 clic'}
                                className={`p-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-50 ${
                                  isPublishedML
                                    ? 'text-amber-900 bg-amber-100 hover:bg-amber-200'
                                    : 'text-amber-950 bg-amber-400 hover:bg-amber-300'
                                }`}
                              >
                                <Zap className={`w-4 h-4 fill-current ${isPublishingThis ? 'animate-bounce' : ''}`} />
                              </button>
                              <button
                                onClick={() => abrirModalFicha(v)}
                                title="Ver Ficha Técnica"
                                className="p-1.5 rounded-lg text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => abrirModalGastos(v)}
                                title="Control de Gastos y Margen Neto"
                                className="p-1.5 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-900 transition-colors cursor-pointer"
                              >
                                <Receipt className="w-4 h-4" />
                              </button>
                              <Link
                                href={`/catalogo/${v.id}`}
                                target="_blank"
                                title="Ver en web pública"
                                className="p-1.5 rounded-lg text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                              <Link
                                href={`/panel/editar-vehiculo/${v.id}`}
                                title="Editar unidad"
                                className="p-1.5 rounded-lg text-zinc-700 hover:text-black hover:bg-zinc-100 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                              {isDueno && (
                                <button
                                  onClick={() => setVehiculoAEliminar(v)}
                                  title="Eliminar de stock"
                                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Gastos y Margen Neto */}
      {vehiculoGastos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-zinc-200 space-y-6 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 block">
                  Rentabilidad y Acondicionamiento
                </span>
                <h3 className="text-xl font-bold text-black font-['Outfit']">
                  {vehiculoGastos.marca} {vehiculoGastos.modelo} {vehiculoGastos.version} ({vehiculoGastos.anio})
                </h3>
              </div>
              <button
                onClick={() => setVehiculoGastos(null)}
                className="p-1 text-zinc-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingGastos ? (
              <div className="py-12 text-center text-zinc-400">Cargando desglose financiero...</div>
            ) : (
              <div className="space-y-6">
                {/* Financial Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block">Costo Compra</span>
                    <span className="text-base font-bold text-zinc-900 font-mono">
                      USD ${((gastosData?.vehiculo?.costoCompra || 0)).toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block">Gastos Totales</span>
                    <span className="text-base font-bold text-amber-700 font-mono">
                      USD ${(gastosData?.totalGastos || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block">Costo Total</span>
                    <span className="text-base font-black text-zinc-900 font-mono">
                      USD ${(gastosData?.costoTotal || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 uppercase font-bold block">Margen Neto Est.</span>
                    <span className="text-base font-black text-emerald-600 font-mono">
                      USD ${(gastosData?.margenEstimado || 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold block">
                      ({gastosData?.porcentajeMargen?.toFixed(1) || 0}%)
                    </span>
                  </div>
                </div>

                {/* Formulario Agregar Gasto o Actualizar Costo de Compra */}
                <form onSubmit={handleGuardarGasto} className="p-4 bg-zinc-50/70 rounded-2xl border border-zinc-200 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 block">
                    Registrar Nuevo Gasto/Actualizar Compra
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-600 block mb-1">
                        Costo de Compra (USD)
                      </label>
                      <input
                        type="number"
                        placeholder="Ej. 15000"
                        value={costoCompraInput}
                        onChange={(e) => setCostoCompraInput(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-600 block mb-1">
                        Tipo de Gasto
                      </label>
                      <select
                        value={tipoGasto}
                        onChange={(e) => setTipoGasto(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:border-black"
                      >
                        <option value="MECANICA">Mecánica/Taller</option>
                        <option value="SERVICE">Service de Aceite/Filtros</option>
                        <option value="CHAPA_PINTURA">Chapa y Pintura</option>
                        <option value="ESTETICA">Estética/Pulido/Lavado</option>
                        <option value="GESTORIA">Gestoría/Transferencia/Multas</option>
                        <option value="OTRO">Otro Gasto</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-600 block mb-1">
                        Monto del Gasto (USD)
                      </label>
                      <input
                        type="number"
                        placeholder="Monto"
                        value={montoGasto}
                        onChange={(e) => setMontoGasto(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 block mb-1">
                      Descripción del Comprobante/Service
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Ej. Cambio de 4 cubiertas Pirelli y alineación..."
                        value={descGasto}
                        onChange={(e) => setDescGasto(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-black"
                      />
                      <button
                        type="submit"
                        disabled={guardandoGasto}
                        className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs shrink-0 cursor-pointer disabled:opacity-50"
                      >
                        {guardandoGasto ? 'Guardando...' : 'Guardar'}
                      </button>
                    </div>
                  </div>
                </form>

                {/* Listado de Gastos Registrados */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 block">
                    Historial de Gastos ({gastosData?.vehiculo?.gastos?.length || 0})
                  </span>

                  {gastosData?.vehiculo?.gastos?.length === 0 ? (
                    <p className="text-xs text-zinc-400 italic p-3 text-center bg-zinc-50 rounded-xl border border-zinc-100">
                      No hay gastos de acondicionamiento cargados para esta unidad.
                    </p>
                  ) : (
                    <div className="divide-y divide-zinc-100 max-h-48 overflow-y-auto border border-zinc-200 rounded-xl bg-white">
                      {gastosData?.vehiculo?.gastos?.map((g: any) => (
                        <div key={g.id} className="p-3 flex items-center justify-between text-xs hover:bg-zinc-50">
                          <div>
                            <span className="font-bold text-zinc-900 block">{g.descripcion}</span>
                            <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                              <span className="uppercase font-semibold">{g.tipoGasto}</span>
                              <span>•</span>
                              <span>{new Date(g.fecha).toLocaleDateString('es-AR')}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-zinc-900 font-mono">
                              USD ${g.monto.toLocaleString()}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleEliminarGasto(g.id)}
                              className="text-zinc-400 hover:text-rose-600 p-1 cursor-pointer"
                              title="Eliminar gasto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setVehiculoGastos(null)}
                className="px-5 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmación de Eliminación Centrado */}
      {vehiculoAEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-zinc-200 space-y-6 my-auto">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-black font-['Outfit']">
                ¿Eliminar unidad del stock?
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Estás a punto de eliminar definitivamente el vehículo{' '}
                <strong className="text-black">
                  {vehiculoAEliminar.marca} {vehiculoAEliminar.modelo} ({vehiculoAEliminar.anio})
                </strong>. Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setVehiculoAEliminar(null)}
                className="w-1/2 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminar}
                disabled={eliminando}
                className="w-1/2 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-rose-600 hover:bg-rose-700 transition-colors cursor-pointer"
              >
                {eliminando ? 'Eliminando...' : 'Sí, Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ficha Técnica Completa (Lectura) */}
      {vehiculoFicha && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-hidden">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-zinc-200 max-h-[92vh] flex flex-col my-auto overflow-hidden animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-zinc-100 p-6 sm:p-8 pb-4 shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                    Ficha Técnica Comercial
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      vehiculoFicha.estado === 'VENDIDO'
                        ? 'bg-zinc-900 text-white'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {vehiculoFicha.estado}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-black font-['Outfit']">
                  {vehiculoFicha.marca} {vehiculoFicha.modelo} {vehiculoFicha.version || ''} ({vehiculoFicha.anio})
                </h3>
              </div>
              <button
                onClick={() => setVehiculoFicha(null)}
                className="p-2 text-zinc-400 hover:text-black cursor-pointer rounded-xl hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 sm:p-8 pt-4 overflow-y-auto flex-1 space-y-6">
              {loadingFicha ? (
                <div className="py-16 text-center text-zinc-400 font-medium">
                  Cargando datos completos de la unidad...
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Hero / Images */}
                  {fichaDetallada?.imagenesUrls && fichaDetallada.imagenesUrls.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {fichaDetallada.imagenesUrls.slice(0, 4).map((url: string, idx: number) => (
                        <div key={idx} className="h-28 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
                          <img src={url} alt={`Foto ${idx}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200">
                      <span className="text-[10px] text-zinc-400 uppercase font-bold block">Precio de Venta</span>
                      <span className="text-lg font-black text-black font-mono">
                        USD ${fichaDetallada?.precio?.toLocaleString()}
                      </span>
                    </div>
                    <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200">
                      <span className="text-[10px] text-zinc-400 uppercase font-bold block">Condición</span>
                      <span className="text-sm font-bold text-emerald-700">
                        {fichaDetallada?.primeraMano ? '0 KM' : 'Usado'}
                      </span>
                    </div>
                    <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200">
                      <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                        {fichaDetallada?.tipoVehiculo === 'EMBARCACION' ? 'Horas de Uso' : 'Kilometraje'}
                      </span>
                      <span className="text-sm font-bold text-zinc-900 font-mono">
                        {fichaDetallada?.tipoVehiculo === 'EMBARCACION'
                          ? `${fichaDetallada?.horasUso || 0} hs`
                          : `${fichaDetallada?.kilometraje?.toLocaleString() || 0} km`}
                      </span>
                    </div>
                    {fichaDetallada?.tipoVehiculo === 'EMBARCACION' ? (
                      <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold block">Material del Casco</span>
                        <span className="text-sm font-bold text-zinc-900">
                          {fichaDetallada?.embarcacion?.materialCasco
                            ? fichaDetallada.embarcacion.materialCasco.replaceAll('_', ' ')
                            : 'Fibra de Vidrio'}
                        </span>
                      </div>
                    ) : (
                      <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold block">Patente/Dominio</span>
                        <span className="text-sm font-bold text-zinc-900 font-mono uppercase">
                          {fichaDetallada?.patente || 'Sin Patente (0KM)'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Datos Técnicos Principales */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 block">
                      Especificaciones Técnicas
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-200 text-xs">
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Categoría</span>
                        <span className="font-bold text-zinc-900">
                          {fichaDetallada?.tipoVehiculo ? fichaDetallada.tipoVehiculo.replaceAll('_', ' ') : '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Combustible</span>
                        <span className="font-bold text-zinc-900">
                          {fichaDetallada?.combustible ? fichaDetallada.combustible.replaceAll('_', ' ') : '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Color</span>
                        <span className="font-bold text-zinc-900">
                          {fichaDetallada?.color ? fichaDetallada.color.replaceAll('_', ' ') : '-'}
                        </span>
                      </div>
                      {fichaDetallada?.potencia && (
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Potencia</span>
                          <span className="font-bold text-zinc-900">{fichaDetallada.potencia} CV/HP</span>
                        </div>
                      )}
                      {fichaDetallada?.torqueNm && (
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Torque</span>
                          <span className="font-bold text-zinc-900">{fichaDetallada.torqueNm} Nm</span>
                        </div>
                      )}
                      {/* Ocultar Dirección Asistida para Embarcaciones */}
                      {fichaDetallada?.tipoVehiculo !== 'EMBARCACION' && fichaDetallada?.tipoDireccion && (
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Dirección</span>
                          <span className="font-bold text-zinc-900">
                            {fichaDetallada.tipoDireccion.replaceAll('_', ' ')}
                          </span>
                        </div>
                      )}
                      {fichaDetallada?.vin && (
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">VIN/Chasis</span>
                          <span className="font-mono font-bold text-zinc-900 text-[11px]">{fichaDetallada.vin}</span>
                        </div>
                      )}
                      {fichaDetallada?.numeroMotor && (
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">N° de Motor</span>
                          <span className="font-mono font-bold text-zinc-900 text-[11px]">{fichaDetallada.numeroMotor}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Datos Náuticos para Embarcación */}
                  {fichaDetallada?.embarcacion && (
                    <div className="space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 block">
                        Datos Náuticos
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-200 text-xs">
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Dimensiones (Eslora/Manga/Puntal)</span>
                          <span className="font-bold text-zinc-900">
                            {fichaDetallada.embarcacion.esloraMetros || '-'}m x {fichaDetallada.embarcacion.mangaMetros || '-'}m x {fichaDetallada.embarcacion.puntalMetros || '-'}m
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Motor Marino</span>
                          <span className="font-bold text-zinc-900">
                            {fichaDetallada.embarcacion.marcaMotor}{' '}
                            {fichaDetallada.embarcacion.tipoMotor
                              ? `(${fichaDetallada.embarcacion.tipoMotor.replaceAll('_', ' ')})`
                              : ''}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Capacidad de Personas</span>
                          <span className="font-bold text-zinc-900">{fichaDetallada.embarcacion.capacidadPersonas || '-'} personas</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Tipo de Embarcación</span>
                          <span className="font-bold text-zinc-900">
                            {fichaDetallada.embarcacion.tipoEmbarcacion
                              ? fichaDetallada.embarcacion.tipoEmbarcacion.replaceAll('_', ' ')
                              : '-'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Material Casco</span>
                          <span className="font-bold text-zinc-900">
                            {fichaDetallada.embarcacion.materialCasco
                              ? fichaDetallada.embarcacion.materialCasco.replaceAll('_', ' ')
                              : '-'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Trailer de Transporte</span>
                          <span className="font-bold text-zinc-900">
                            {fichaDetallada.embarcacion.tieneTrailer ? 'Incluye Trailer' : 'Sin Trailer'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Datos del Automóvil */}
                  {fichaDetallada?.automovil && (
                    <div className="space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 block">
                        Datos del Automóvil
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-200 text-xs">
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Carrocería</span>
                          <span className="font-bold text-zinc-900">{fichaDetallada.automovil.tipoAutomovil?.replaceAll('_', ' ') || '-'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Motor</span>
                          <span className="font-bold text-zinc-900">{fichaDetallada.automovil.motor || '-'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Transmisión</span>
                          <span className="font-bold text-zinc-900">{fichaDetallada.automovil.transmision?.replaceAll('_', ' ') || '-'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Tracción</span>
                          <span className="font-bold text-zinc-900">{fichaDetallada.automovil.traccion?.replaceAll('_', ' ') || '-'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Puertas/Asientos</span>
                          <span className="font-bold text-zinc-900">{fichaDetallada.automovil.cantidadPuertas || '-'} pts • {fichaDetallada.automovil.cantidadAsientos || '-'} asientos</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Capacidad Baúl</span>
                          <span className="font-bold text-zinc-900">{fichaDetallada.automovil.capacidadBaulLitros ? `${fichaDetallada.automovil.capacidadBaulLitros} L` : '-'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Datos de Camión */}
                  {fichaDetallada?.camion && (
                    <div className="space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 block">
                        Datos de Carga y Ejes
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-200 text-xs">
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Capacidad de Carga</span>
                          <span className="font-bold text-zinc-900">{fichaDetallada.camion.capacidadCargaKg?.toLocaleString() || '-'} kg</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Cantidad de Ejes</span>
                          <span className="font-bold text-zinc-900">{fichaDetallada.camion.cantidadEjes || '-'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Carrocería</span>
                          <span className="font-bold text-zinc-900">{fichaDetallada.camion.tipoCarroceria?.replaceAll('_', ' ') || '-'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Equipamiento y Confort Incluido */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 block">
                      Equipamiento y Confort Incluido
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {fichaDetallada?.tieneAireAcondicionado && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Aire Acondicionado/Climatizador
                        </span>
                      )}
                      {fichaDetallada?.tieneAppleCarplayAndroidAuto && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Apple CarPlay/Android Auto
                        </span>
                      )}
                      {fichaDetallada?.tieneCamaraRetroceso && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Cámara de Retroceso
                        </span>
                      )}
                      {fichaDetallada?.tieneSensoresEstacionamiento && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Sensores de Estacionamiento
                        </span>
                      )}
                      {fichaDetallada?.tieneTechoSolar && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Techo Solar/Panorámico
                        </span>
                      )}
                      {fichaDetallada?.automovil?.abs && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Frenos ABS
                        </span>
                      )}
                      {fichaDetallada?.automovil?.controlEstabilidad && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Control de Estabilidad (ESP)
                        </span>
                      )}
                      {fichaDetallada?.automovil?.arranqueBotonKeyless && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Arranque Botón Keyless
                        </span>
                      )}
                      {fichaDetallada?.automovil?.asientosCuero && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Tapizado de Cuero
                        </span>
                      )}

                      {/* Equipamiento Náutico */}
                      {fichaDetallada?.embarcacion?.tieneTrailer && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Trailer Incluido
                        </span>
                      )}
                      {fichaDetallada?.embarcacion?.bombaAchique && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Bomba de Achique Eléctrica
                        </span>
                      )}
                      {fichaDetallada?.embarcacion?.ecosonda && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ecosonda/GPS Náutico
                        </span>
                      )}
                      {fichaDetallada?.embarcacion?.escaleraPopa && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Escalera de Popa
                        </span>
                      )}
                      {fichaDetallada?.embarcacion?.audio && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Audio Marino Bluetooth
                        </span>
                      )}
                      {fichaDetallada?.embarcacion?.toldoBimini && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Toldo Bimini/Lona
                        </span>
                      )}
                      {fichaDetallada?.embarcacion?.cerramientoCompleto && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Cerramiento Completo
                        </span>
                      )}
                      {fichaDetallada?.embarcacion?.malacateElectrico && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Malacate Eléctrico
                        </span>
                      )}
                      {fichaDetallada?.embarcacion?.lucesNavegacion && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Luces de Navegación
                        </span>
                      )}
                      {fichaDetallada?.embarcacion?.radioVHF && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Radio VHF
                        </span>
                      )}
                      {fichaDetallada?.embarcacion?.duchaPopa && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ducha de Popa
                        </span>
                      )}
                      {fichaDetallada?.embarcacion?.barraSki && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Barra de Ski
                        </span>
                      )}
                      {fichaDetallada?.embarcacion?.solariumProa && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Solárium de Proa
                        </span>
                      )}
                      {fichaDetallada?.embarcacion?.mesaCockpit && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Mesa de Cockpit
                        </span>
                      )}
                      {fichaDetallada?.embarcacion?.inodoroMarino && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Inodoro Marino
                        </span>
                      )}
                      {fichaDetallada?.embarcacion?.heladeraNautica && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Heladera Náutica
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Observaciones / Descripción Completa */}
                  {fichaDetallada?.descripcion && (
                    <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 block">
                        Observaciones/Descripción Comercial
                      </span>
                      <p className="text-xs text-zinc-700 leading-relaxed whitespace-pre-line font-normal">
                        {fichaDetallada.descripcion}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Fixed Footer */}
            <div className="flex justify-end p-4 sm:p-6 border-t border-zinc-100 bg-white shrink-0">
              <button
                type="button"
                onClick={() => setVehiculoFicha(null)}
                className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black cursor-pointer transition-colors shadow-xs"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

