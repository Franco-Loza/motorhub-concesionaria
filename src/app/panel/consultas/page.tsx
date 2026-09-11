'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  Car,
  UserCheck,
  ExternalLink,
  Phone,
  Mail,
  Filter,
  Sparkles,
  AlertCircle,
  Eye,
  FileText,
  User,
  X,
} from 'lucide-react';

export default function CRMConsultasPage() {
  const [consultas, setConsultas] = useState<any[]>([]);
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [filtroTipo, setFiltroTipo] = useState('TODOS');

  // Modal para ver detalles de tasación
  const [modalTasacionOpen, setModalTasacionOpen] = useState(false);
  const [consultaSeleccionada, setConsultaSeleccionada] = useState<any>(null);

  // Modal para notas
  const [modalNotaOpen, setModalNotaOpen] = useState(false);
  const [notaTexto, setNotaTexto] = useState('');
  const [guardandoNota, setGuardandoNota] = useState(false);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [resConsultas, resEmpleados] = await Promise.all([
        fetch('/api/consultas'),
        fetch('/api/empleados').catch(() => null),
      ]);

      if (resConsultas.ok) {
        const data = await resConsultas.json();
        setConsultas(data);
      }
      if (resEmpleados && resEmpleados.ok) {
        const dataEmp = await resEmpleados.json();
        setEmpleados(dataEmp);
      }
    } catch (err) {
      console.error('Error cargando consultas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleCambiarEstado = async (id: number, nuevoEstado: string) => {
    try {
      const res = await fetch(`/api/consultas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (res.ok) {
        setConsultas((prev) =>
          prev.map((c) => (c.id === id ? { ...c, estado: nuevoEstado } : c))
        );
      }
    } catch (err) {
      console.error('Error al actualizar estado:', err);
    }
  };

  const handleAsignarEmpleado = async (id: number, empleadoId: string) => {
    try {
      const res = await fetch(`/api/consultas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empleadoAsignadoId: empleadoId ? parseInt(empleadoId) : null }),
      });
      if (res.ok) {
        const updated = await res.json();
        setConsultas((prev) =>
          prev.map((c) => (c.id === id ? updated : c))
        );
      }
    } catch (err) {
      console.error('Error al asignar empleado:', err);
    }
  };

  const handleGuardarNota = async () => {
    if (!consultaSeleccionada) return;
    setGuardandoNota(true);
    try {
      const res = await fetch(`/api/consultas/${consultaSeleccionada.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notasInternas: notaTexto }),
      });
      if (res.ok) {
        setConsultas((prev) =>
          prev.map((c) => (c.id === consultaSeleccionada.id ? { ...c, notasInternas: notaTexto } : c))
        );
        setModalNotaOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGuardandoNota(false);
    }
  };

  // Filtrado
  const consultasFiltradas = consultas.filter((c) => {
    const q = filtroTexto.toLowerCase();
    const matchTexto =
      c.nombreCliente?.toLowerCase().includes(q) ||
      c.telefonoCliente?.includes(q) ||
      c.emailCliente?.toLowerCase().includes(q) ||
      c.vehiculo?.modelo?.toLowerCase().includes(q) ||
      c.vehiculo?.marca?.toLowerCase().includes(q) ||
      c.mensaje?.toLowerCase().includes(q);

    const matchEstado = filtroEstado === 'TODOS' || c.estado === filtroEstado;
    const matchTipo = filtroTipo === 'TODOS' || c.tipoConsulta === filtroTipo;

    return matchTexto && matchEstado && matchTipo;
  });

  // Métricas
  const totalNuevos = consultas.filter((c) => c.estado === 'NUEVO').length;
  const totalTasaciones = consultas.filter((c) => c.tipoConsulta === 'TASACION').length;
  const totalEnNegociacion = consultas.filter((c) => c.estado === 'EN_NEGOCIACION' || c.estado === 'CONTACTADO').length;

  const parseDatosUsado = (jsonStr: string | null) => {
    if (!jsonStr) return null;
    try {
      return JSON.parse(jsonStr);
    } catch {
      return null;
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'NUEVO':
        return 'bg-emerald-500 text-zinc-950';
      case 'CONTACTADO':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'EN_NEGOCIACION':
        return 'bg-amber-100 text-amber-900 border border-amber-300';
      case 'TEST_DRIVE':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'VENDIDO':
        return 'bg-zinc-900 text-white';
      case 'DESCARTADO':
        return 'bg-zinc-100 text-zinc-500';
      default:
        return 'bg-zinc-100 text-zinc-700';
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'TASACION':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'WHATSAPP':
        return 'bg-[#25D366]/10 text-[#128C7E] border-[#25D366]/30';
      case 'VEHICULO':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600 block mb-1">
            Gestión Comercial y Contactos
          </span>
          <h1 className="text-3xl font-extrabold text-black font-['Outfit']">
            Consultas y Solicitudes de Clientes
          </h1>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Leads</span>
            <MessageSquare className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-black text-black font-['Outfit'] mt-2">
            {consultas.length}
          </div>
          <span className="text-[11px] text-zinc-500">Historial completo registrado</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-emerald-200 bg-emerald-50/20 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Nuevos Sin Gestionar</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-emerald-600 font-['Outfit'] mt-2">
            {totalNuevos}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">Requieren primer contacto</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-amber-200 bg-amber-50/20 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Tasaciones de Usados</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 font-['Outfit'] mt-2">
            {totalTasaciones}
          </div>
          <span className="text-[11px] text-amber-800 font-semibold">Solicitudes de permuta</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">En Negociación</span>
            <UserCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 font-['Outfit'] mt-2">
            {totalEnNegociacion}
          </div>
          <span className="text-[11px] text-zinc-500">En proceso de cierre</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white border border-zinc-200 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar por cliente, teléfono, auto..."
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:border-black"
            >
              <option value="TODOS">Todos los Estados</option>
              <option value="NUEVO">Nuevos</option>
              <option value="CONTACTADO">Contactados</option>
              <option value="EN_NEGOCIACION">En Negociación</option>
              <option value="TEST_DRIVE">Prueba de Manejo</option>
              <option value="VENDIDO">Cerrados/Vendidos</option>
              <option value="DESCARTADO">Descartados</option>
            </select>
          </div>

          <div>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:border-black"
            >
              <option value="TODOS">Todos los Orígenes</option>
              <option value="TASACION">Tasación de Usado</option>
              <option value="WHATSAPP">Click WhatsApp</option>
              <option value="VEHICULO">Ficha de Vehículo</option>
              <option value="GENERAL">Consulta General</option>
            </select>
          </div>
        </div>
      </div>

      {/* CRM Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Fecha/Origen</th>
                <th className="py-3 px-4">Cliente/Contacto</th>
                <th className="py-3 px-4">Vehículo de Interés</th>
                <th className="py-3 px-4">Detalles/Tasación</th>
                <th className="py-3 px-4">Asignado a</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-400">
                    Cargando prospectos del CRM...
                  </td>
                </tr>
              ) : consultasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-400">
                    No se encontraron consultas con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                consultasFiltradas.map((item) => {
                  const datosUsado = parseDatosUsado(item.datosUsadoJson);
                  const whatsappClean = item.telefonoCliente?.replace(/\D/g, '');

                  return (
                    <tr key={item.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-zinc-900 text-xs">
                          {new Date(item.fechaConsulta).toLocaleDateString('es-AR')}
                        </div>
                        <span
                          className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border mt-1 ${getTipoBadge(
                            item.tipoConsulta
                          )}`}
                        >
                          {item.tipoConsulta === 'TASACION'
                            ? 'TASACIÓN'
                            : item.tipoConsulta === 'WHATSAPP'
                            ? 'WHATSAPP'
                            : item.tipoConsulta}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-black text-sm">{item.nombreCliente}</div>
                        <div className="flex items-center gap-2 text-zinc-500 text-[11px] mt-0.5">
                          {item.telefonoCliente && (
                            <span className="flex items-center gap-1 font-mono">
                              <Phone className="w-3 h-3 text-zinc-400" />
                              {item.telefonoCliente}
                            </span>
                          )}
                          {item.emailCliente && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-zinc-400" />
                              {item.emailCliente}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {item.vehiculo ? (
                          <div>
                            <span className="font-bold text-zinc-900 block">
                              {item.vehiculo.marca} {item.vehiculo.modelo}
                            </span>
                            <span className="text-[11px] text-zinc-500 font-mono">
                              USD ${item.vehiculo.precio?.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-zinc-400 italic">Consulta General</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 min-w-[280px] max-w-md">
                        {datosUsado ? (
                          <button
                            onClick={() => {
                              setConsultaSeleccionada(item);
                              setModalTasacionOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            <span>Ver Usado ({datosUsado.marca} {datosUsado.modelo})</span>
                          </button>
                        ) : (
                          <div className="text-[11px] text-zinc-700 whitespace-pre-wrap leading-relaxed bg-zinc-50/80 p-2 rounded-xl border border-zinc-100">
                            {item.mensaje || '-'}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={item.empleadoAsignadoId || ''}
                          onChange={(e) => handleAsignarEmpleado(item.id, e.target.value)}
                          className="px-2 py-1 bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] font-medium focus:outline-none focus:border-black"
                        >
                          <option value="">Sin Asignar</option>
                          {empleados.map((emp) => (
                            <option key={emp.id} value={emp.id}>
                              {emp.nombreCompleto}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={item.estado}
                          onChange={(e) => handleCambiarEstado(item.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase border-0 focus:outline-none cursor-pointer ${getEstadoBadge(
                            item.estado
                          )}`}
                        >
                          <option value="NUEVO">NUEVO</option>
                          <option value="CONTACTADO">CONTACTADO</option>
                          <option value="EN_NEGOCIACION">EN NEGOCIACIÓN</option>
                          <option value="TEST_DRIVE">PRUEBA DE MANEJO</option>
                          <option value="VENDIDO">VENDIDO</option>
                          <option value="DESCARTADO">DESCARTADO</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {whatsappClean && (
                            <a
                              href={`https://wa.me/${whatsappClean}?text=Hola%20${encodeURIComponent(
                                item.nombreCliente
                              )},%20te%20contacto%20desde%20MotorHub%20respecto%20a%20tu%20consulta`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 transition-colors"
                              title="Chatear por WhatsApp"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </a>
                          )}

                          <button
                            onClick={() => {
                              setConsultaSeleccionada(item);
                              setNotaTexto(item.notasInternas || '');
                              setModalNotaOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
                            title="Notas de seguimiento"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
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

      {/* Modal Detalles de Tasación de Usado */}
      {modalTasacionOpen && consultaSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-zinc-200 space-y-6 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 block">
                  Ficha de Usado en Parte de Pago
                </span>
                <h3 className="text-xl font-bold text-black font-['Outfit']">
                  {consultaSeleccionada.nombreCliente}
                </h3>
              </div>
              <button
                onClick={() => setModalTasacionOpen(false)}
                className="p-1 text-zinc-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(() => {
              const u = parseDatosUsado(consultaSeleccionada.datosUsadoJson);
              if (!u) return <p className="text-xs text-zinc-500">Sin datos registrados.</p>;
              return (
                <div className="space-y-6">
                  {/* Ficha técnica del usado */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-200 text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                        {u.tipoVehiculo === 'EMBARCACION'
                          ? 'Embarcación / Astillero'
                          : u.tipoVehiculo === 'MOTOCICLETA'
                          ? 'Motocicleta'
                          : u.tipoVehiculo === 'CAMION'
                          ? 'Camión'
                          : u.tipoVehiculo === 'MOTORHOME'
                          ? 'Motorhome / Chasis'
                          : 'Vehículo'}
                      </span>
                      <span className="font-bold text-zinc-900">{u.marca} {u.modelo} {u.version}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                        {u.tipoVehiculo === 'EMBARCACION' || u.horasUso ? 'Año / Horas de Uso' : 'Año / Kilómetros'}
                      </span>
                      <span className="font-bold text-zinc-900">
                        {u.anio} • {u.tipoVehiculo === 'EMBARCACION' || u.horasUso ? `${u.horasUso || 0} hs de uso` : `${u.kilometraje?.toLocaleString()} km`}
                      </span>
                    </div>

                    {u.tipoVehiculo === 'EMBARCACION' && (
                      <>
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-bold block">Motor / Potencia</span>
                          <span className="font-bold text-zinc-900">
                            {u.marcaMotor || 'S/D'} {u.potenciaHp ? `(${u.potenciaHp} HP)` : ''}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-bold block">Propulsión / Eslora</span>
                          <span className="font-bold text-zinc-900">
                            {u.tipoMotor?.replace(/_/g, ' ') || 'Fuera de Borda'} {u.esloraMetros ? `• ${u.esloraMetros}m` : ''}
                          </span>
                        </div>
                      </>
                    )}

                    {u.tipoVehiculo === 'MOTOCICLETA' && (
                      <>
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-bold block">Cilindrada / Estilo</span>
                          <span className="font-bold text-zinc-900">
                            {u.cilindradaCc ? `${u.cilindradaCc} cc` : 'S/D'} • {u.estiloMoto?.replace(/_/g, ' ') || 'Naked'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-bold block">Transmisión</span>
                          <span className="font-bold text-zinc-900">{u.transmision?.replace(/_/g, ' ') || 'Manual'}</span>
                        </div>
                      </>
                    )}

                    {u.tipoVehiculo === 'CAMION' && (
                      <>
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-bold block">Carrocería / Ejes</span>
                          <span className="font-bold text-zinc-900">
                            {u.tipoCarroceriaCamion?.replace(/_/g, ' ') || 'Chasis'} {u.cantidadEjes ? `(${u.cantidadEjes} ejes)` : ''}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-bold block">Carga Útil / Transmisión</span>
                          <span className="font-bold text-zinc-900">
                            {u.capacidadCargaKg ? `${u.capacidadCargaKg.toLocaleString()} kg` : 'S/D'} • {u.transmision?.replace(/_/g, ' ') || 'Manual'}
                          </span>
                        </div>
                      </>
                    )}

                    {u.tipoVehiculo === 'MOTORHOME' && (
                      <>
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-bold block">Plazas / Baño</span>
                          <span className="font-bold text-zinc-900">
                            {u.capacidadCamas ? `${u.capacidadCamas} Plazas` : 'S/D'} • Baño: {u.tieneBano ? 'Sí' : 'No'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-bold block">Transmisión</span>
                          <span className="font-bold text-zinc-900">{u.transmision}</span>
                        </div>
                      </>
                    )}

                    {u.tipoVehiculo === 'AUTOMOVIL' && (
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-bold block">Transmisión</span>
                        <span className="font-bold text-zinc-900">{u.transmision} ({u.combustible})</span>
                      </div>
                    )}

                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase font-bold block">Combustible</span>
                      <span className="font-bold text-zinc-900">{u.combustible}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase font-bold block">Estado General</span>
                      <span className="font-bold text-emerald-700">{u.estadoGeneral}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                        {u.tipoVehiculo === 'EMBARCACION' ? 'Guardería / Ciudad' : 'Ciudad / Localidad'}
                      </span>
                      <span className="font-bold text-zinc-900">{u.ciudad || '-'}</span>
                    </div>
                  </div>

                  {/* Observaciones del cliente */}
                  {u.comentarios && (
                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs">
                      <span className="font-bold text-zinc-700 block mb-1">Comentarios del Cliente:</span>
                      <p className="text-zinc-600 italic">{u.comentarios}</p>
                    </div>
                  )}

                  {/* Fotos del Usado */}
                  {u.fotosUrls && u.fotosUrls.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 block">
                        Fotos de la Unidad ({u.fotosUrls.length}):
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {u.fotosUrls.map((fotoUrl: string, idx: number) => (
                          <a
                            key={idx}
                            href={fotoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="relative h-32 rounded-xl overflow-hidden border border-zinc-200 group block"
                          >
                            <img src={fotoUrl} alt={`Foto ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                              Ver Grande ↗
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="flex justify-end pt-4 border-t border-zinc-100">
              <button
                onClick={() => setModalTasacionOpen(false)}
                className="px-5 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Notas Internas */}
      {modalNotaOpen && consultaSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-lg font-bold text-black font-['Outfit']">
                Notas de Seguimiento - {consultaSeleccionada.nombreCliente}
              </h3>
              <button
                onClick={() => setModalNotaOpen(false)}
                className="p-1 text-zinc-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              rows={5}
              value={notaTexto}
              onChange={(e) => setNotaTexto(e.target.value)}
              placeholder="Escribí notas internas sobre la conversación, contraofertas, fecha de test drive agendada..."
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-black resize-none"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setModalNotaOpen(false)}
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold uppercase cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardarNota}
                disabled={guardandoNota}
                className="px-6 py-2 bg-emerald-400 hover:bg-emerald-300 text-zinc-950 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer disabled:opacity-50"
              >
                {guardandoNota ? 'Guardando...' : 'Guardar Notas'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
