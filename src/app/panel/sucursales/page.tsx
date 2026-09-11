'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  PlusCircle,
  Edit,
  Trash2,
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  Mail,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function GestionSucursalesPage() {
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<any>(null);

  // Form State
  const [nombre, setNombre] = useState('');
  const [activa, setActiva] = useState(true);
  const [esCasaCentral, setEsCasaCentral] = useState(false);
  const [horarios, setHorarios] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [calle, setCalle] = useState('');
  const [numero, setNumero] = useState('');
  const [pisoDepto, setPisoDepto] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [provincia, setProvincia] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    cargarSucursales();
  }, []);

  const cargarSucursales = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sucursales');
      if (res.ok) {
        const data = await res.json();
        setSucursales(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const abrirCrear = () => {
    setEditando(null);
    setNombre('');
    setActiva(true);
    setEsCasaCentral(false);
    setHorarios('LUNES A VIERNES DE 09:00 A 19:00');
    setEmail('');
    setTelefono('');
    setWhatsapp('');
    setCalle('');
    setNumero('');
    setPisoDepto('');
    setCiudad('');
    setProvincia('');
    setCodigoPostal('');
    setError('');
    setSuccess('');
    setModalOpen(true);
  };

  const abrirEditar = (suc: any) => {
    setEditando(suc);
    setNombre(suc.nombre);
    setActiva(suc.activa);
    setEsCasaCentral(suc.esCasaCentral);
    setHorarios(suc.horarios || '');
    setEmail(suc.email || '');
    setTelefono(suc.telefono || '');
    setWhatsapp(suc.whatsapp || '');
    setCalle(suc.calle || '');
    setNumero(suc.numero || '');
    setPisoDepto(suc.pisoDepto || '');
    setCiudad(suc.ciudad || '');
    setProvincia(suc.provincia || '');
    setCodigoPostal(suc.codigoPostal || '');
    setError('');
    setSuccess('');
    setModalOpen(true);
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = editando ? `/api/sucursales/${editando.id}` : '/api/sucursales';
      const method = editando ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          activa,
          esCasaCentral,
          horarios,
          email,
          telefono,
          whatsapp,
          calle,
          numero,
          pisoDepto,
          ciudad,
          provincia,
          codigoPostal,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('¡Sucursal guardada con éxito!');
        cargarSucursales();
        setTimeout(() => {
          setModalOpen(false);
        }, 1000);
      } else {
        setError(data.error || 'Error al guardar sucursal');
      }
    } catch (err) {
      setError('Error de comunicación con el servidor');
    } finally {
      setSaving(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta sucursal?')) return;
    try {
      const res = await fetch(`/api/sucursales/${id}`, { method: 'DELETE' });
      if (res.ok) {
        cargarSucursales();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600 block mb-1">
            Red de Showrooms
          </span>
          <h1 className="text-3xl font-extrabold text-black font-['Outfit']">
            Gestión de Sucursales
          </h1>
        </div>
        <button
          onClick={abrirCrear}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-950 bg-emerald-400 hover:bg-emerald-300 shadow-sm shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Nueva Sucursal
        </button>
      </div>

      {/* Grid of branches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <p className="text-xs text-zinc-400 py-8 text-center col-span-2">Cargando sucursales...</p>
        ) : sucursales.map((suc) => (
          <div
            key={suc.id}
            className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs space-y-4 flex flex-col justify-between hover:border-emerald-500/40 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black font-['Outfit']">{suc.nombre}</h3>
                    <span className="text-[10px] text-zinc-400 font-semibold uppercase block">
                      ID #{suc.id}
                    </span>
                  </div>
                </div>
                {suc.esCasaCentral && (
                  <span className="text-[9px] font-bold uppercase px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-500/30 rounded-md">
                    Casa Central
                  </span>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-zinc-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <span>
                    {suc.calle} {suc.numero} {suc.pisoDepto ? `(${suc.pisoDepto})` : ''}, {suc.ciudad},{' '}
                    {suc.provincia} {suc.codigoPostal ? `(CP ${suc.codigoPostal})` : ''}
                  </span>
                </div>
                {suc.horarios && (
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                    <span>{suc.horarios}</span>
                  </div>
                )}
                {suc.telefono && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span>Tel: {suc.telefono}</span>
                  </div>
                )}
                {suc.whatsapp && (
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold text-xs">WA:</span>
                    <span>{suc.whatsapp}</span>
                  </div>
                )}
                {suc.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400 font-bold text-xs">@:</span>
                    <span>{suc.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
              <button
                onClick={() => abrirEditar(suc)}
                className="p-1.5 rounded-lg text-zinc-700 hover:text-black hover:bg-zinc-100 cursor-pointer transition-colors"
                title="Editar"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleEliminar(suc.id)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

      {/* Modal Centrado y Responsivo con TODOS los campos de la BDD */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-zinc-200 space-y-6 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-black font-['Outfit'] text-base">
                  {editando ? 'Editar Sucursal' : 'Nueva Sucursal'}
                </span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleGuardar} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1">
                  Nombre de la Sucursal *
                </label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Showroom Central Rosario"
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl font-medium focus:outline-none focus:border-emerald-500 text-zinc-900"
                />
              </div>

              {/* Dirección Física */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 block mb-1">Calle</label>
                  <input
                    type="text"
                    value={calle}
                    onChange={(e) => setCalle(e.target.value)}
                    placeholder="Av. del Libertador"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-emerald-500 text-zinc-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 block mb-1">Número</label>
                  <input
                    type="text"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    placeholder="7500"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-emerald-500 text-zinc-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 block mb-1">Piso/Depto/Local</label>
                  <input
                    type="text"
                    value={pisoDepto}
                    onChange={(e) => setPisoDepto(e.target.value)}
                    placeholder="Piso 1/Local A"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-emerald-500 text-zinc-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 block mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    placeholder="Rosario"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-emerald-500 text-zinc-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 block mb-1">Provincia</label>
                  <input
                    type="text"
                    value={provincia}
                    onChange={(e) => setProvincia(e.target.value)}
                    placeholder="Santa Fe"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-emerald-500 text-zinc-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 block mb-1">Código Postal</label>
                  <input
                    type="text"
                    value={codigoPostal}
                    onChange={(e) => setCodigoPostal(e.target.value)}
                    placeholder="S2000"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-emerald-500 text-zinc-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 block mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="+54 9 11 5263-8000"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-emerald-500 text-zinc-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 block mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="5491152638000"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-emerald-500 text-zinc-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 block mb-1">Email Oficial</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sucursal@motorhub.com"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-emerald-500 text-zinc-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 block mb-1">Horarios de Atención</label>
                  <input
                    type="text"
                    value={horarios}
                    onChange={(e) => setHorarios(e.target.value)}
                    placeholder="Lun a Vie 09:00 - 19:00 | Sáb 09:00 - 13:00"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-emerald-500 text-zinc-900"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={esCasaCentral}
                    onChange={(e) => setEsCasaCentral(e.target.checked)}
                    className="w-4 h-4 rounded text-black focus:ring-black"
                  />
                  <span className="text-xs font-bold text-zinc-800 uppercase">Es Casa Central</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activa}
                    onChange={(e) => setActiva(e.target.checked)}
                    className="w-4 h-4 rounded text-black focus:ring-black"
                  />
                  <span className="text-xs font-bold text-zinc-800 uppercase">Sucursal Activa</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-zinc-600 bg-zinc-100 hover:bg-zinc-200 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-950 bg-emerald-400 hover:bg-emerald-300 shadow-sm shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar Sucursal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
