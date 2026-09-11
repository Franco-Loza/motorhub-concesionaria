'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCompare } from '@/context/CompareContext';
import {
  Search,
  Car,
  Truck,
  Ship,
  Bike,
  Home,
  SlidersHorizontal,
  Calendar,
  Gauge,
  Fuel,
  Sparkles,
  RotateCcw,
  Scale,
  Check,
  Zap,
  Layers,
} from 'lucide-react';

const formatText = (str: string | null | undefined) => {
  if (!str) return '';
  return str.replaceAll('_', ' ').toLowerCase().replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
};

function CatalogoContent() {
  const searchParams = useSearchParams();
  const { addToCompare, isInCompare } = useCompare();
  const [todosLosVehiculos, setTodosLosVehiculos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState('TODOS');
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('');
  const [condicion, setCondicion] = useState('TODAS'); // TODAS, 0KM, USADO
  const [minAnio, setMinAnio] = useState('');
  const [maxAnio, setMaxAnio] = useState('');
  const [combustible, setCombustible] = useState('');
  const [minPrecio, setMinPrecio] = useState('');
  const [maxPrecio, setMaxPrecio] = useState('');
  const [orden, setOrden] = useState('recientes');

  const categories = [
    { label: 'Todos', type: 'TODOS', icon: Sparkles },
    { label: 'Autos', type: 'AUTOMOVIL', icon: Car },
    { label: 'Camiones', type: 'CAMION', icon: Truck },
    { label: 'Lanchas/Barcos', type: 'EMBARCACION', icon: Ship },
    { label: 'Motos', type: 'MOTOCICLETA', icon: Bike },
    { label: 'Motorhomes', type: 'MOTORHOME', icon: Home },
  ];

  // Marcas únicas disponibles para el tipo seleccionado
  const marcasDisponibles = useMemo(() => {
    const list =
      tipoSeleccionado === 'TODOS'
        ? todosLosVehiculos
        : todosLosVehiculos.filter((v) => v.tipoVehiculo === tipoSeleccionado);
    const set = new Set<string>();
    list.forEach((v) => {
      if (v.marca && typeof v.marca === 'string' && v.marca.trim()) {
        set.add(v.marca.trim());
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [todosLosVehiculos, tipoSeleccionado]);

  // Sync state with URL search params on mount or when searchParams changes
  useEffect(() => {
    const tipo = searchParams.get('tipo');
    const q = searchParams.get('search') || searchParams.get('q');
    const marcaParam = searchParams.get('marca');
    const condParam = searchParams.get('condicion');
    const minAParam = searchParams.get('minAnio') || searchParams.get('anioDesde');
    const maxAParam = searchParams.get('maxAnio') || searchParams.get('anioHasta');
    const ordenParam = searchParams.get('orden');

    if (tipo) {
      setTipoSeleccionado(tipo.toUpperCase());
    }
    if (q) {
      setSearch(q);
    }
    if (marcaParam) {
      setMarcaSeleccionada(marcaParam);
    }
    if (condParam) {
      setCondicion(condParam.toUpperCase());
    }
    if (minAParam) {
      setMinAnio(minAParam);
    }
    if (maxAParam) {
      setMaxAnio(maxAParam);
    }
    if (ordenParam) {
      if (ordenParam === 'precio_asc') setOrden('menor-precio');
      else if (ordenParam === 'precio_desc') setOrden('mayor-precio');
      else if (ordenParam === 'km_asc') setOrden('menor-km');
      else setOrden(ordenParam);
    }
  }, [searchParams]);

  // Cargar inventario inicial completo una sola vez
  const fetchVehiculos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vehiculos?estado=DISPONIBLE');
      if (!res.ok) throw new Error('Error al cargar catálogo');
      const data = await res.json();
      if (Array.isArray(data)) {
        setTodosLosVehiculos(data);
      }
    } catch (err) {
      console.error('Error al cargar catálogo:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehiculos();
  }, []);

  // Filtrado y ordenamiento instantáneo en memoria (<1 ms de respuesta)
  const vehiculosFiltrados = useMemo(() => {
    let result = [...todosLosVehiculos];

    // Filtro Categoría
    if (tipoSeleccionado !== 'TODOS') {
      result = result.filter((v) => v.tipoVehiculo === tipoSeleccionado);
    }

    // Filtro Marca
    if (marcaSeleccionada) {
      result = result.filter(
        (v) => v.marca?.toLowerCase() === marcaSeleccionada.toLowerCase()
      );
    }

    // Filtro Condición (0 KM vs Usado)
    if (condicion === '0KM') {
      result = result.filter((v) => Boolean(v.primeraMano) || Boolean(v.esCeroKm));
    } else if (condicion === 'USADO') {
      result = result.filter((v) => !v.primeraMano && !v.esCeroKm);
    }

    // Filtro Año
    if (minAnio) {
      const minA = parseInt(minAnio, 10);
      if (!isNaN(minA)) result = result.filter((v) => v.anio >= minA);
    }
    if (maxAnio) {
      const maxA = parseInt(maxAnio, 10);
      if (!isNaN(maxA)) result = result.filter((v) => v.anio <= maxA);
    }

    // Filtro Búsqueda por texto (marca, modelo, versión, patente)
    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter(
        (v) =>
          v.marca?.toLowerCase().includes(query) ||
          v.modelo?.toLowerCase().includes(query) ||
          v.version?.toLowerCase().includes(query) ||
          v.patente?.toLowerCase().includes(query)
      );
    }

    // Filtro Combustible
    if (combustible) {
      result = result.filter((v) => v.combustible?.toUpperCase() === combustible);
    }

    // Filtro Precios
    if (minPrecio) {
      const min = parseFloat(minPrecio);
      if (!isNaN(min)) result = result.filter((v) => v.precio >= min);
    }
    if (maxPrecio) {
      const max = parseFloat(maxPrecio);
      if (!isNaN(max)) result = result.filter((v) => v.precio <= max);
    }

    // Ordenamiento
    if (orden === 'menor-precio' || orden === 'precio_asc') {
      result.sort((a, b) => a.precio - b.precio);
    } else if (orden === 'mayor-precio' || orden === 'precio_desc') {
      result.sort((a, b) => b.precio - a.precio);
    } else if (orden === 'menor-km' || orden === 'km_asc') {
      result.sort((a, b) => (Number(a.kilometraje || a.horasUso) || 0) - (Number(b.kilometraje || b.horasUso) || 0));
    } else if (orden === 'anio-desc') {
      result.sort((a, b) => b.anio - a.anio);
    } else {
      // Recientes por defecto
      result.sort((a, b) => new Date(b.fechaCreacion || 0).getTime() - new Date(a.fechaCreacion || 0).getTime());
    }

    return result;
  }, [
    todosLosVehiculos,
    tipoSeleccionado,
    marcaSeleccionada,
    condicion,
    minAnio,
    maxAnio,
    search,
    combustible,
    minPrecio,
    maxPrecio,
    orden,
  ]);

  const resetFilters = () => {
    setSearch('');
    setTipoSeleccionado('TODOS');
    setMarcaSeleccionada('');
    setCondicion('TODAS');
    setMinAnio('');
    setMaxAnio('');
    setCombustible('');
    setMinPrecio('');
    setMaxPrecio('');
    setOrden('recientes');
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar />

      {/* Page Header */}
      <div className="bg-white border-b border-zinc-200 py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500 block mb-1">
                Showroom Disponible
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-black font-['Outfit']">
                Catálogo de Unidades
              </h1>
            </div>
            <div className="text-sm text-zinc-500 font-medium">
              Mostrando <span className="font-bold text-black">{vehiculosFiltrados.length}</span> unidades seleccionadas
            </div>
          </div>

          {/* Quick Category Badges */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-6 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = tipoSeleccionado === cat.type;
              return (
                <button
                  key={cat.type}
                  onClick={() => setTipoSeleccionado(cat.type)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide uppercase whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-950 text-emerald-400 shadow-xs border border-emerald-500/40 font-bold'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-zinc-500'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content y Filters */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 flex-1">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 xl:w-80 shrink-0 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs space-y-6 sticky top-28">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                <div className="flex items-center gap-2 font-bold text-black font-['Outfit'] text-base">
                  <SlidersHorizontal className="w-4 h-4 text-zinc-700" />
                  <span>Filtros de Búsqueda</span>
                </div>
                <button
                  onClick={resetFilters}
                  className="text-xs text-zinc-400 hover:text-black flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Limpiar
                </button>
              </div>

              {/* Text Search */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                  Buscar palabra clave
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Ej. BMW, Sedán, V8, AF 123..."
                    className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-500 focus:bg-white font-medium"
                  />
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Filtro Marca/Astillero */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                  {tipoSeleccionado === 'EMBARCACION' ? 'Astillero/Marca' : 'Marca'}
                </label>
                <select
                  value={marcaSeleccionada}
                  onChange={(e) => setMarcaSeleccionada(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-500 focus:bg-white font-medium"
                >
                  <option value="">Todas las marcas</option>
                  {marcasDisponibles.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro Condición (0 KM/Usado) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                  Condición
                </label>
                <div className="grid grid-cols-3 gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setCondicion('TODAS')}
                    className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                      condicion === 'TODAS'
                        ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200'
                        : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    type="button"
                    onClick={() => setCondicion('0KM')}
                    className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                      condicion === '0KM'
                        ? 'bg-emerald-500 text-zinc-950 font-extrabold shadow-xs'
                        : 'text-zinc-500 hover:text-emerald-700'
                    }`}
                  >
                    0 KM
                  </button>
                  <button
                    type="button"
                    onClick={() => setCondicion('USADO')}
                    className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                      condicion === 'USADO'
                        ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200'
                        : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    Usados
                  </button>
                </div>
              </div>

              {/* Filtro Año (Desde/Hasta) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                  Año de Fabricación
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={minAnio}
                    onChange={(e) => setMinAnio(e.target.value)}
                    placeholder="Desde (Ej. 2018)"
                    className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-500 focus:bg-white font-medium"
                  />
                  <input
                    type="number"
                    value={maxAnio}
                    onChange={(e) => setMaxAnio(e.target.value)}
                    placeholder="Hasta (Ej. 2026)"
                    className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-500 focus:bg-white font-medium"
                  />
                </div>
              </div>

              {/* Combustible */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                  Combustible
                </label>
                <select
                  value={combustible}
                  onChange={(e) => setCombustible(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-500 focus:bg-white font-medium"
                >
                  <option value="">Todos los combustibles</option>
                  <option value="NAFTA">Nafta</option>
                  <option value="DIESEL">Diésel</option>
                  <option value="GNC">Nafta/GNC</option>
                  <option value="HIBRIDO">Híbrido</option>
                  <option value="ELECTRICO">Eléctrico</option>
                </select>
              </div>

              {/* Rango de Precios */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                  Precio (USD)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={minPrecio}
                    onChange={(e) => setMinPrecio(e.target.value)}
                    placeholder="Mínimo"
                    className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-500 focus:bg-white font-medium"
                  />
                  <input
                    type="number"
                    value={maxPrecio}
                    onChange={(e) => setMaxPrecio(e.target.value)}
                    placeholder="Máximo"
                    className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-500 focus:bg-white font-medium"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Grid de Vehículos */}
          <main className="flex-1 w-full min-w-0 space-y-6">
            {/* Sorting bar */}
            <div className="bg-white p-4 rounded-2xl border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Ordenar Resultados Por:
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={orden}
                  onChange={(e) => setOrden(e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-500"
                >
                  <option value="recientes">Más Recientes Primero</option>
                  <option value="menor-precio">Menor Precio</option>
                  <option value="mayor-precio">Mayor Precio</option>
                  <option value="menor-km">Menor Kilometraje</option>
                  <option value="anio-desc">Año Más Nuevo</option>
                </select>
              </div>
            </div>

            {/* Results */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl h-96 animate-pulse border border-zinc-200" />
                ))}
              </div>
            ) : vehiculosFiltrados.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-zinc-200 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-100 text-zinc-700 flex items-center justify-center mx-auto">
                  <Car className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-black font-['Outfit']">
                  No se encontraron vehículos disponibles
                </h3>
                <p className="text-sm text-zinc-500 max-w-md mx-auto">
                  Probá ajustando los filtros de búsqueda o restableciendo los parámetros seleccionados.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-black text-white rounded-xl text-xs font-semibold uppercase tracking-wider shadow-xs hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Restablecer Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {vehiculosFiltrados.map((vehiculo) => {
                  const foto = (vehiculo.imagenesUrls && vehiculo.imagenesUrls[0]) || 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80';
                  return (
                    <div
                      key={vehiculo.id}
                      className="bg-white rounded-2xl overflow-hidden border border-zinc-200 hover:border-emerald-500/40 shadow-xs hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col group"
                    >
                      <div className="relative h-56 overflow-hidden bg-zinc-100">
                        <img
                          src={foto}
                          alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-zinc-950/90 text-zinc-200 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-md border border-zinc-800">
                          {vehiculo.tipoVehiculo}
                        </div>
                        {vehiculo.primeraMano && (
                          <div className="absolute top-3 right-3 bg-emerald-500 text-zinc-950 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md shadow-xs">
                            0 KM
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                            {vehiculo.marca}
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-black font-['Outfit'] line-clamp-1 mb-2 group-hover:text-emerald-700 transition-colors">
                            {vehiculo.modelo} {vehiculo.version}
                          </h3>

                          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-600 my-3 pb-3 border-b border-zinc-100">
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

                        <div className="flex items-center justify-between pt-2 gap-2">
                          <div>
                            <span className="text-[10px] text-zinc-400 uppercase font-semibold block">
                              Precio Contado
                            </span>
                            <span className="text-xl font-extrabold text-black font-['Outfit']">
                              USD ${vehiculo.precio.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
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
                                  imagenUrl: foto,
                                });
                              }}
                              className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                isInCompare(vehiculo.id)
                                  ? 'bg-emerald-500 text-zinc-950 border-emerald-500 shadow-xs'
                                  : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border-zinc-200 hover:border-zinc-300'
                              }`}
                              title={isInCompare(vehiculo.id) ? 'Quitar del comparador' : 'Agregar al comparador'}
                            >
                              <Scale className="w-4 h-4" />
                            </button>
                            <Link
                              href={`/catalogo/${vehiculo.id}`}
                              className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-zinc-950 hover:bg-emerald-500 hover:text-zinc-950 shadow-xs hover:shadow-emerald-500/20 transition-all cursor-pointer"
                            >
                              Ver Ficha
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50 flex items-center justify-center text-zinc-500 font-semibold">Cargando catálogo...</div>}>
      <CatalogoContent />
    </Suspense>
  );
}
