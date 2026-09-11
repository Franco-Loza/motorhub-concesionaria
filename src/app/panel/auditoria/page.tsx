'use client';

import React, { useState, useEffect, useTransition } from 'react';
import {
  ShieldCheck,
  Search,
  SlidersHorizontal,
  RotateCcw,
  Calendar,
  User,
  Activity,
  DollarSign,
  ShoppingBag,
  Trash2,
  Eye,
  X,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Car,
  Building2,
  Users,
  KeyRound,
  ArrowRight,
  Clock,
  Globe,
} from 'lucide-react';

export default function AuditoriaPage() {
  const [registros, setRegistros] = useState<any[]>([]);
  const [metricas, setMetricas] = useState<any>({
    eventosUltimas24hs: 0,
    totalCambiosPrecio: 0,
    totalVentas: 0,
    totalBajas: 0,
  });
  const [paginacion, setPaginacion] = useState({
    total: 0,
    page: 1,
    limit: 30,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Filters State
  const [busqueda, setBusqueda] = useState('');
  const [accion, setAccion] = useState('TODAS');
  const [entidad, setEntidad] = useState('TODAS');
  const [usuarioId, setUsuarioId] = useState('TODOS');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const [usuariosLista, setUsuariosLista] = useState<any[]>([]);

  // Diff Modal State
  const [modalRegistro, setModalRegistro] = useState<any | null>(null);

  const cargarUsuarios = async () => {
    try {
      const res = await fetch('/api/empleados');
      if (res.ok) {
        const data = await res.json();
        setUsuariosLista(data);
      }
    } catch (e) {
      console.error('Error cargando usuarios:', e);
    }
  };

  const cargarAuditoria = async (pagina = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(pagina));
      params.set('limit', '30');

      if (accion !== 'TODAS') params.set('accion', accion);
      if (entidad !== 'TODAS') params.set('entidad', entidad);
      if (usuarioId !== 'TODOS') params.set('usuarioId', usuarioId);
      if (busqueda.trim()) params.set('busqueda', busqueda.trim());
      if (fechaDesde) params.set('fechaDesde', fechaDesde);
      if (fechaHasta) params.set('fechaHasta', fechaHasta);

      const res = await fetch(`/api/auditoria?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRegistros(data.registros || []);
        setPaginacion(data.paginacion || { total: 0, page: 1, limit: 30, totalPages: 1 });
        if (data.metricas) setMetricas(data.metricas);
      }
    } catch (err) {
      console.error('Error al cargar auditoría:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  useEffect(() => {
    cargarAuditoria(1);
  }, [accion, entidad, usuarioId, fechaDesde, fechaHasta]);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    cargarAuditoria(1);
  };

  const handleResetFiltros = () => {
    setBusqueda('');
    setAccion('TODAS');
    setEntidad('TODAS');
    setUsuarioId('TODOS');
    setFechaDesde('');
    setFechaHasta('');
    cargarAuditoria(1);
  };

  const exportarCSV = () => {
    if (registros.length === 0) return;

    const headers = ['ID', 'Fecha', 'Usuario', 'Rol', 'Acción', 'Entidad', 'Detalles', 'IP'];
    const rows = registros.map((r) => [
      r.id,
      new Date(r.fecha).toLocaleString('es-AR'),
      `"${r.nombreUsuario}"`,
      r.rolUsuario,
      r.accion,
      r.entidad,
      `"${r.detalles.replace(/"/g, '""')}"`,
      r.ip || 'N/A',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `auditoria_motorhub_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getBadgeAccion = (tipo: string) => {
    switch (tipo) {
      case 'CREACION':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CAMBIO_PRECIO':
        return 'bg-amber-50 text-amber-700 border-amber-200 font-bold';
      case 'CAMBIO_ESTADO':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'VENTA':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
      case 'ANULACION':
        return 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
      case 'ELIMINACION':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
      case 'LOGIN':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'LOGOUT':
        return 'bg-zinc-100 text-zinc-700 border-zinc-200';
      default:
        return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  const getIconoEntidad = (entidad: string) => {
    switch (entidad) {
      case 'VEHICULO':
        return <Car className="w-4 h-4 text-emerald-600" />;
      case 'VENTA':
        return <ShoppingBag className="w-4 h-4 text-blue-600" />;
      case 'EMPLEADO':
        return <Users className="w-4 h-4 text-purple-600" />;
      case 'SUCURSAL':
        return <Building2 className="w-4 h-4 text-amber-600" />;
      case 'AUTH':
        return <KeyRound className="w-4 h-4 text-zinc-700" />;
      default:
        return <Activity className="w-4 h-4 text-zinc-500" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-950 text-emerald-400 flex items-center justify-center font-bold shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 font-['Outfit']">
                Control de Auditoría y Trazabilidad
              </h1>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg">
                Exclusivo Dueño
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
              Supervisión en tiempo real de modificaciones de stock, variaciones de precios, ventas y accesos al sistema.
            </p>
          </div>
        </div>

        <button
          onClick={exportarCSV}
          disabled={registros.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Exportar Historial (.CSV)</span>
        </button>
      </div>

      {/* Metrics Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-medium block">Últimas 24 Horas</span>
            <span className="text-2xl font-bold text-zinc-900 font-['Outfit']">
              {metricas.eventosUltimas24hs}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-medium block">Cambios de Precio</span>
            <span className="text-2xl font-bold text-zinc-900 font-['Outfit']">
              {metricas.totalCambiosPrecio}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-medium block">Ventas Registradas</span>
            <span className="text-2xl font-bold text-zinc-900 font-['Outfit']">
              {metricas.totalVentas}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 font-medium block">Bajas/Eliminaciones</span>
            <span className="text-2xl font-bold text-zinc-900 font-['Outfit']">
              {metricas.totalBajas}
            </span>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-4">
        <form onSubmit={handleBuscar} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Text search */}
          <div className="lg:col-span-2 relative">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por usuario o palabra clave..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          </div>

          {/* Entidad */}
          <div>
            <select
              value={entidad}
              onChange={(e) => setEntidad(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white font-medium cursor-pointer"
            >
              <option value="TODAS">Todas las Entidades</option>
              <option value="VEHICULO">Vehículos (Stock)</option>
              <option value="VENTA">Ventas y Boletos</option>
              <option value="EMPLEADO">Usuarios/Empleados</option>
              <option value="SUCURSAL">Sedes y Sucursales</option>
              <option value="AUTH">Sesiones y Accesos</option>
            </select>
          </div>

          {/* Acción */}
          <div>
            <select
              value={accion}
              onChange={(e) => setAccion(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white font-medium cursor-pointer"
            >
              <option value="TODAS">Todas las Acciones</option>
              <option value="CREACION">Altas/Creaciones</option>
              <option value="MODIFICACION">Modificaciones</option>
              <option value="CAMBIO_PRECIO">Cambios de Precio</option>
              <option value="CAMBIO_ESTADO">Cambios de Estado</option>
              <option value="VENTA">Ventas</option>
              <option value="ANULACION">Anulaciones</option>
              <option value="ELIMINACION">Bajas/Eliminaciones</option>
              <option value="LOGIN">Inicios de Sesión</option>
            </select>
          </div>

          {/* Usuario */}
          <div>
            <select
              value={usuarioId}
              onChange={(e) => setUsuarioId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white font-medium cursor-pointer"
            >
              <option value="TODOS">Todos los Usuarios</option>
              {usuariosLista.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombreCompleto} ({u.rol})
                </option>
              ))}
            </select>
          </div>

          {/* Clear Button */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs uppercase rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              Filtrar
            </button>
            <button
              type="button"
              onClick={handleResetFiltros}
              className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl transition-colors cursor-pointer"
              title="Restablecer filtros"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Date Filters Row */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-zinc-100 text-xs text-zinc-600">
          <span className="font-semibold flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            Rango de Fecha:
          </span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="px-2.5 py-1 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none"
            />
            <span>hasta</span>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="px-2.5 py-1 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none"
            />
          </div>
          {(fechaDesde || fechaHasta) && (
            <button
              onClick={() => {
                setFechaDesde('');
                setFechaHasta('');
              }}
              className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
            >
              Limpiar Fechas
            </button>
          )}
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 font-['Outfit']">
            Historial de Movimientos ({paginacion.total})
          </h2>
          <span className="text-xs text-zinc-500 font-medium">
            Página {paginacion.page} de {paginacion.totalPages || 1}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-zinc-500 font-medium">Cargando registros de auditoría...</p>
          </div>
        ) : registros.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <ShieldCheck className="w-12 h-12 text-zinc-300 mx-auto" />
            <h3 className="text-base font-bold text-zinc-700 font-['Outfit']">No se encontraron registros</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              No hay movimientos que coincidan con los criterios de búsqueda aplicados.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/80 border-b border-zinc-200 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Fecha y Hora</th>
                  <th className="py-3.5 px-4">Usuario Responsable</th>
                  <th className="py-3.5 px-4">Acción</th>
                  <th className="py-3.5 px-4">Entidad</th>
                  <th className="py-3.5 px-4">Detalle del Cambio</th>
                  <th className="py-3.5 px-4">IP</th>
                  <th className="py-3.5 px-4 text-center">Diff/Info</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs text-zinc-700 font-medium">
                {registros.map((reg) => {
                  const tieneSnapshot = Boolean(reg.valoresAnteriores || reg.valoresNuevos);
                  return (
                    <tr key={reg.id} className="hover:bg-zinc-50/60 transition-colors">
                      {/* Fecha */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-zinc-900">
                          {new Date(reg.fecha).toLocaleDateString('es-AR')}
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          {new Date(reg.fecha).toLocaleTimeString('es-AR')}
                        </div>
                      </td>

                      {/* Usuario */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-zinc-900">{reg.nombreUsuario}</div>
                        <span
                          className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md mt-0.5 ${
                            reg.rolUsuario === 'DUENO'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-zinc-100 text-zinc-600'
                          }`}
                        >
                          {reg.rolUsuario}
                        </span>
                      </td>

                      {/* Acción */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg border ${getBadgeAccion(
                            reg.accion
                          )}`}
                        >
                          {reg.accion.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Entidad */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-bold text-zinc-800">
                          {getIconoEntidad(reg.entidad)}
                          <span>{reg.entidad}</span>
                        </div>
                      </td>

                      {/* Detalle */}
                      <td className="py-3.5 px-4 max-w-md">
                        <span className="line-clamp-2 text-zinc-800 font-normal">
                          {reg.detalles}
                        </span>
                      </td>

                      {/* IP */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-zinc-400 font-mono">
                        {reg.ip || '127.0.0.1'}
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {tieneSnapshot ? (
                          <button
                            onClick={() => setModalRegistro(reg)}
                            className="p-1.5 rounded-lg bg-zinc-100 hover:bg-emerald-50 text-zinc-700 hover:text-emerald-700 border border-zinc-200 transition-colors cursor-pointer"
                            title="Ver comparación de valores antes y después"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-zinc-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {paginacion.totalPages > 1 && (
          <div className="p-4 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/50">
            <span className="text-xs text-zinc-500 font-medium">
              Mostrando página {paginacion.page} de {paginacion.totalPages} ({paginacion.total} movimientos totales)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={paginacion.page <= 1}
                onClick={() => cargarAuditoria(paginacion.page - 1)}
                className="p-2 rounded-xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={paginacion.page >= paginacion.totalPages}
                onClick={() => cargarAuditoria(paginacion.page + 1)}
                className="p-2 rounded-xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Diff Inspector Modal */}
      {modalRegistro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center font-bold">
                  {getIconoEntidad(modalRegistro.entidad)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 font-['Outfit']">
                    Detalle del Cambio (Snapshot Diff)
                  </h3>
                  <p className="text-xs text-zinc-500">
                    ID #{modalRegistro.id} • {new Date(modalRegistro.fecha).toLocaleString('es-AR')} • Responsable: {modalRegistro.nombreUsuario}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalRegistro(null)}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-800">
                <span className="font-bold text-zinc-900 uppercase tracking-wide block text-[10px] mb-1">
                  Resumen de la Operación
                </span>
                <p className="font-medium text-xs">{modalRegistro.detalles}</p>
              </div>

              {/* Visual Human-Friendly Comparator for Dealership Owner */}
              {(() => {
                let objAnterior: Record<string, any> = {};
                let objNuevo: Record<string, any> = {};

                try {
                  if (modalRegistro.valoresAnteriores) {
                    objAnterior = JSON.parse(modalRegistro.valoresAnteriores);
                  }
                } catch (e) {
                  console.error(e);
                }

                try {
                  if (modalRegistro.valoresNuevos) {
                    objNuevo = JSON.parse(modalRegistro.valoresNuevos);
                  }
                } catch (e) {
                  console.error(e);
                }

                const todosLosCampos = Array.from(
                  new Set([...Object.keys(objAnterior), ...Object.keys(objNuevo)])
                ).filter(
                  (key) =>
                    !['id', 'createdAt', 'updatedAt', 'passwordHash'].includes(key)
                );

                const camposModificados = todosLosCampos.filter((k) => {
                  const v1 = JSON.stringify(objAnterior[k]);
                  const v2 = JSON.stringify(objNuevo[k]);
                  return v1 !== v2;
                });

                const FIELD_LABELS: Record<string, string> = {
                  // Vehículo Base
                  precio: 'Precio de Lista (USD)',
                  precioFinal: 'Precio Final Acordado (USD)',
                  estado: 'Estado del Vehículo',
                  kilometraje: 'Kilometraje',
                  marca: 'Marca/Astillero',
                  modelo: 'Modelo',
                  version: 'Versión/Equipamiento',
                  anio: 'Año de Fabricación',
                  tipoVehiculo: 'Tipo de Vehículo',
                  combustible: 'Combustible',
                  transmision: 'Transmisión',
                  color: 'Color Exterior',
                  carroceria: 'Tipo de Carrocería',
                  patente: 'Patente/Matrícula',
                  vin: 'Número de Chasis/Serie de Casco',
                  numeroMotor: 'Número de Motor',
                  cilindrada: 'Cilindrada',
                  cilindradaCc: 'Cilindrada (cc)',
                  potencia: 'Potencia (CV/HP)',
                  potenciaHp: 'Potencia (CV/HP)',
                  torqueNm: 'Torque Máximo (Nm)',
                  tipoDireccion: 'Tipo de Dirección',
                  capacidadTanqueCombustible: 'Tanque de Combustible (L)',
                  largoMetros: 'Largo Total (m)',
                  anchoMetros: 'Ancho Total (m)',
                  altoMetros: 'Alto Total (m)',
                  pesoKg: 'Peso (kg)',
                  descripcion: 'Descripción Comercial',
                  primeraMano: 'Condición 0 KM',
                  esCeroKm: 'Condición 0 KM',
                  motor0km: 'Motor 0 KM',
                  horasUso: 'Horas de Uso (hs)',
                  tieneAireAcondicionado: 'Aire Acondicionado/Climatizador',
                  tieneAppleCarplayAndroidAuto: 'Apple CarPlay/Android Auto',
                  tieneCamaraRetroceso: 'Cámara de Retroceso',
                  tieneSensoresEstacionamiento: 'Sensores de Estacionamiento',
                  tieneTechoSolar: 'Techo Solar Panorámico',

                  // Automóvil
                  tipoAutomovil: 'Carrocería',
                  motor: 'Motorización',
                  traccion: 'Tracción',
                  tipoFrenosDelanteros: 'Frenos Delanteros',
                  tipoFrenosTraseros: 'Frenos Traseros',
                  tipoTapizado: 'Tapizado',
                  capacidadBaulLitros: 'Capacidad de Baúl (L)',
                  cantidadPuertas: 'Cantidad de Puertas',
                  cantidadAsientos: 'Cantidad de Asientos',
                  aceleracion0a100: '0 a 100 km/h (s)',
                  velocidadMaximaKmh: 'Velocidad Máxima (km/h)',
                  airbags: 'Cantidad de Airbags',
                  consumoMixtoKmPorLitro: 'Consumo Mixto (km/l)',
                  abs: 'Sistema Antibloqueo ABS',
                  controlEstabilidad: 'Control de Estabilidad (ESP)',
                  controlCruceroAdaptativo: 'Control Crucero Adaptativo',
                  asientosCuero: 'Tapizado en Cuero Premium',
                  asientosElectricos: 'Butacas Eléctricas con Memoria',
                  arranqueBotonKeyless: 'Acceso Keyless y Arranque Botón',
                  cargadorInalambrico: 'Cargador Inalámbrico Celular',
                  lucesLedAutomaticas: 'Faros Full LED Automáticos',
                  frenoEstacionamientoElectrico: 'Freno Mano Eléctrico/Auto-Hold',
                  alertaPuntoCiego: 'Alerta de Punto Ciego/Carril',

                  // Camión
                  capacidadCargaKg: 'Capacidad de Carga (kg)',
                  pesoBrutoVehicularKg: 'Peso Bruto Vehicular (kg)',
                  cantidadEjes: 'Cantidad de Ejes',
                  distanciaEntreEjesMm: 'Distancia Entre Ejes (mm)',
                  tipoFreno: 'Sistema de Frenos',
                  suspension: 'Tipo de Suspensión',
                  neumaticosCantidad: 'Cantidad de Neumáticos',
                  medidaNeumatico: 'Medida de Neumático',
                  consumoPromedioL100km: 'Consumo Promedio (L/100km)',
                  tipoCarroceria: 'Tipo de Carrocería',
                  aireAcondicionadoCabina: 'Climatizador/Aire en Cabina',
                  camaraRetroceso: 'Cámara de Retroceso/Asistencia',
                  sensoresEstacionamiento: 'Sensores de Proximidad',
                  pantallaMultimedia: 'Pantalla Multimedia Conectada',
                  frenosAireAbs: 'Frenos de Aire con ABS',
                  controlEstabilidadEsp: 'Control de Estabilidad (ESP/ASR)',
                  butacaNeumatica: 'Butaca Conductor Neumática',
                  suspensionNeumaticaCabina: 'Suspensión Neumática de Cabina',
                  controlCrucero: 'Control de Velocidad Crucero',
                  calefaccionAuxiliar: 'Calefacción Auxiliar/Climatizador',
                  frenoMotorRetarder: 'Freno Motor Auxiliar/Retarder',
                  tacografoDigital: 'Tacógrafo Digital Homologado',

                  // Embarcación
                  esloraMetros: 'Eslora (m)',
                  mangaMetros: 'Manga (m)',
                  puntalMetros: 'Puntal (m)',
                  materialCasco: 'Material del Casco',
                  tipoEmbarcacion: 'Tipo de Embarcación',
                  tipoMotor: 'Tipo de Propulsión',
                  capacidadPersonas: 'Capacidad de Personas',
                  pesoMaximoKg: 'Carga Máxima (kg)',
                  marcaMotor: 'Marca del Motor',
                  anioMotor: 'Año del Motor',
                  numeroMotores: 'Cantidad de Motores',
                  velocidadMaximaNudos: 'Velocidad Máxima (km/h)',
                  capacidadAguaDulceLitros: 'Tanque de Agua Dulce (L)',
                  tieneTrailer: 'Incluye Trailer',
                  bombaAchique: 'Bomba de Achique',
                  ecosonda: 'Ecosonda/Sonar',
                  escaleraPopa: 'Escalera de Popa',
                  audio: 'Audio Náutico',
                  toldoBimini: 'Toldo Bimini/Capota',
                  cerramientoCompleto: 'Cerramiento Lona Completo',
                  malacateElectrico: 'Malacate/Molinete Eléctrico',
                  lucesNavegacion: 'Luces de Navegación',
                  radioVHF: 'Radio VHF Marina',
                  duchaPopa: 'Ducha de Popa',
                  barraSki: 'Barra de Ski/Wakeboard',
                  solariumProa: 'Solárium de Proa',
                  mesaCockpit: 'Mesa de Cockpit',
                  inodoroMarino: 'Inodoro Marino',
                  heladeraNautica: 'Heladera Náutica',

                  // Moto
                  motorTiempos: 'Tiempos de Motor',
                  estilo: 'Estilo de Moto',
                  tipoArranque: 'Tipo de Arranque',
                  transmisionMoto: 'Transmisión',
                  refrigeracion: 'Refrigeración',
                  alturaAsientoMm: 'Altura de Asiento (mm)',
                  tipoLlanta: 'Tipo de Llanta',
                  neumaticoDelantero: 'Neumático Delantero',
                  neumaticoTrasero: 'Neumático Trasero',
                  controlTraccionTcs: 'Control de Tracción (TCS)',
                  modosConduccion: 'Modos de Conducción',
                  quickshifter: 'Quickshifter (Up y Down)',
                  pantallaTftBluetooth: 'Pantalla Digital TFT Bluetooth',
                  lucesLed: 'Iluminación Full LED',
                  punosCalefaccionables: 'Puños Calefaccionables',
                  parabrisasRegulable: 'Parabrisas Regulable/Deflector',
                  puertoUsb12v: 'Toma de Carga USB/12V',
                  cubrepunosDefensas: 'Cubrepuños y Defensas Laterales',
                  caballeteCentral: 'Caballete Central y Lateral',

                  // Motorhome
                  capacidadCamas: 'Capacidad de Camas (Plazas)',
                  capacidadBateriasAh: 'Baterías Auxiliares (Ah)',
                  cantidadPisos: 'Cantidad de Pisos',
                  capacidadTanqueAguaLitros: 'Tanque Agua Limpia (L)',
                  capacidadAguasGrisesLitros: 'Tanque Aguas Grises (L)',
                  capacidadAguasNegrasLitros: 'Tanque Aguas Negras (L)',
                  tieneCocina: 'Cocina Equipada',
                  tieneBano: 'Baño con Inodoro y Ducha',
                  tieneDuchaExterior: 'Ducha Exterior',
                  tienePanelesSolares: 'Paneles Solares e Inversor',
                  tieneCalefaccion: 'Calefacción',
                  tieneGenerador: 'Generador Eléctrico',
                  tieneTV: 'Smart TV',
                  aireAcondicionadoHabitaculo: 'Aire Acondicionado Habitáculo',
                  toldoExterior: 'Toldo Exterior Extensible',
                  inversorCorriente220v: 'Inversor de Corriente 12V a 220V',
                  heladeraFreezer: 'Heladera con Freezer Trivalente/12V',
                  termotanqueCalefon: 'Termotanque/Calefón Automático',
                  garrafaGasEnvasado: 'Instalación Gas Envasado',
                  escalonElectrico: 'Escalón de Acceso Eléctrico',
                  soporteBicicletasEnganche: 'Soporte para Bicicletas/Enganche',

                  // Ventas
                  metodoPago: 'Método de Pago',
                  estadoVenta: 'Estado de la Venta',
                  comentarios: 'Observaciones/Comentarios',
                  clienteNombre: 'Nombre del Cliente',
                  clienteDni: 'DNI/CUIT Cliente',
                  clienteTelefono: 'Teléfono del Cliente',
                  clienteEmail: 'Email del Cliente',
                  clienteDireccion: 'Domicilio del Cliente',
                  fechaVenta: 'Fecha de Operación',
                  vendedorId: 'Vendedor Responsable',
                  vehiculoId: 'Vehículo Asociado',

                  // Empleados y Sucursales
                  nombreCompleto: 'Nombre Completo',
                  email: 'Correo Electrónico',
                  rol: 'Rol en el Sistema',
                  telefono: 'Teléfono',
                  activo: 'Usuario Activo',
                  dni: 'DNI',
                  direccion: 'Dirección',
                  nombre: 'Nombre de la Sede',
                  ciudad: 'Ciudad',
                  esCasaCentral: 'Casa Central',
                  codigo: 'Código Interno',
                  lat: 'Latitud GPS',
                  lng: 'Longitud GPS',
                };

                const formatValor = (key: string, val: any): string => {
                  if (val === null || val === undefined || val === '') return '— (Sin asignar)';
                  if (typeof val === 'boolean') return val ? 'Sí' : 'No';
                  if (key === 'precio' || key === 'precioFinal') {
                    const num = Number(val);
                    return isNaN(num) ? String(val) : `USD $${num.toLocaleString('es-AR')}`;
                  }
                  if (key === 'kilometraje' && (typeof val === 'number' || !isNaN(Number(val)))) {
                    return `${Number(val).toLocaleString('es-AR')} km`;
                  }
                  if (key === 'horasUso' && (typeof val === 'number' || !isNaN(Number(val)))) {
                    return `${Number(val).toLocaleString('es-AR')} hs`;
                  }
                  if (key === 'consumoMixtoKmPorLitro' && (typeof val === 'number' || !isNaN(Number(val)))) {
                    return `${Number(val).toLocaleString('es-AR')} km/l`;
                  }
                  if (key === 'consumoPromedioL100km' && (typeof val === 'number' || !isNaN(Number(val)))) {
                    return `${Number(val).toLocaleString('es-AR')} L/100km`;
                  }
                  if (key === 'aceleracion0a100' && (typeof val === 'number' || !isNaN(Number(val)))) {
                    return `${Number(val).toLocaleString('es-AR')} s`;
                  }
                  if ((key === 'velocidadMaximaKmh' || key === 'velocidadMaximaNudos') && (typeof val === 'number' || !isNaN(Number(val)))) {
                    return `${Number(val).toLocaleString('es-AR')} km/h`;
                  }
                  if (key === 'potencia' && (typeof val === 'number' || !isNaN(Number(val)))) {
                    return `${Number(val).toLocaleString('es-AR')} CV/HP`;
                  }
                  if (key === 'torqueNm' && (typeof val === 'number' || !isNaN(Number(val)))) {
                    return `${Number(val).toLocaleString('es-AR')} Nm`;
                  }
                  if (key === 'cilindradaCc' && (typeof val === 'number' || !isNaN(Number(val)))) {
                    return `${Number(val).toLocaleString('es-AR')} cc`;
                  }
                  if (Array.isArray(val)) {
                    return `${val.length} fotos registradas`;
                  }
                  if (typeof val === 'string') {
                    return val.replace(/_/g, ' ');
                  }
                  return String(val);
                };

                const esAlta = !modalRegistro.valoresAnteriores && Boolean(modalRegistro.valoresNuevos);
                const esBaja = Boolean(modalRegistro.valoresAnteriores) && !modalRegistro.valoresNuevos;
                const esModificacion = Boolean(modalRegistro.valoresAnteriores && modalRegistro.valoresNuevos);

                return (
                  <div className="space-y-4">
                    {/* Header Summary Pill */}
                    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-zinc-100/70 border border-zinc-200">
                      <span className="font-bold text-zinc-800 text-[11px] uppercase tracking-wider">
                        {esModificacion
                          ? `${camposModificados.length} ${camposModificados.length === 1 ? 'campo modificado' : 'campos modificados'}`
                          : esAlta
                          ? 'Nuevo registro cargado'
                          : 'Registro eliminado del sistema'}
                      </span>
                      {esModificacion && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                          Comparativa Antes vs Después
                        </span>
                      )}
                    </div>

                    {/* Modification Case */}
                    {esModificacion && (
                      <div className="space-y-3">
                        {camposModificados.length === 0 ? (
                          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-center text-zinc-500">
                            No se detectaron variaciones en los campos principales.
                          </div>
                        ) : (
                          <div className="overflow-hidden rounded-2xl border border-zinc-200 shadow-2xs">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-zinc-100/80 border-b border-zinc-200 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                                  <th className="py-2.5 px-3">Propiedad/Campo</th>
                                  <th className="py-2.5 px-3">Valor Anterior (Antes)</th>
                                  <th className="py-2.5 px-2 text-center w-8"></th>
                                  <th className="py-2.5 px-3">Nuevo Valor (Ahora)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-zinc-100 text-xs">
                                {camposModificados.map((k) => {
                                  const label = FIELD_LABELS[k] || k.replace(/([A-Z])/g, ' $1').toUpperCase();
                                  const valAnt = formatValor(k, objAnterior[k]);
                                  const valNue = formatValor(k, objNuevo[k]);

                                  return (
                                    <tr key={k} className="hover:bg-zinc-50/80 transition-colors">
                                      <td className="py-3 px-3 font-semibold text-zinc-800 align-top">
                                        <div className="flex items-center gap-1.5">
                                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                                          <span>{label}</span>
                                        </div>
                                      </td>
                                      <td className="py-3 px-3 text-rose-700 font-medium bg-rose-50/40 line-through decoration-rose-400 align-top">
                                        {valAnt}
                                      </td>
                                      <td className="py-3 px-2 text-center text-zinc-400 align-middle">
                                        <ArrowRight className="w-3.5 h-3.5 mx-auto text-emerald-600" />
                                      </td>
                                      <td className="py-3 px-3 text-emerald-950 font-bold bg-emerald-50/60 align-top">
                                        <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-100/80 text-emerald-900 border border-emerald-200/60">
                                          {valNue}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Creation Case (Alta) */}
                    {esAlta && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-1 max-h-[350px] overflow-y-auto">
                        {Object.entries(objNuevo).map(([k, v]) => {
                          if (['id', 'createdAt', 'updatedAt', 'passwordHash'].includes(k)) return null;
                          const label = FIELD_LABELS[k] || k.replace(/([A-Z])/g, ' $1').toUpperCase();
                          return (
                            <div
                              key={k}
                              className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-100 flex flex-col justify-between gap-1"
                            >
                              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                                {label}
                              </span>
                              <span className="font-semibold text-zinc-900 text-xs break-words">
                                {formatValor(k, v)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Deletion Case (Baja) */}
                    {esBaja && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-1 max-h-[350px] overflow-y-auto">
                        {Object.entries(objAnterior).map(([k, v]) => {
                          if (['id', 'createdAt', 'updatedAt', 'passwordHash'].includes(k)) return null;
                          const label = FIELD_LABELS[k] || k.replace(/([A-Z])/g, ' $1').toUpperCase();
                          return (
                            <div
                              key={k}
                              className="p-3 rounded-xl bg-rose-50/40 border border-rose-100 flex flex-col justify-between gap-1"
                            >
                              <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">
                                {label}
                              </span>
                              <span className="font-semibold text-zinc-900 text-xs break-words">
                                {formatValor(k, v)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Optional Raw JSON inspection accordion for tech support */}
                    <details className="pt-2 text-[10px] text-zinc-400 group cursor-pointer">
                      <summary className="hover:text-zinc-600 select-none flex items-center gap-1 font-semibold">
                        <span>▶ Ver datos técnicos en formato original (JSON)</span>
                      </summary>
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-zinc-900 text-zinc-100 rounded-2xl font-mono text-[10px] overflow-x-auto">
                        <div>
                          <div className="text-zinc-400 font-bold mb-1 border-b border-zinc-700 pb-1">Anterior:</div>
                          <pre className="whitespace-pre-wrap">{modalRegistro.valoresAnteriores || 'null'}</pre>
                        </div>
                        <div>
                          <div className="text-zinc-400 font-bold mb-1 border-b border-zinc-700 pb-1">Nuevo:</div>
                          <pre className="whitespace-pre-wrap">{modalRegistro.valoresNuevos || 'null'}</pre>
                        </div>
                      </div>
                    </details>
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-100 bg-zinc-50 flex justify-end">
              <button
                onClick={() => setModalRegistro(null)}
                className="px-5 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
