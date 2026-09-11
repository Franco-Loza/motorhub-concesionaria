'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Pause,
  Play,
  Share2,
  Settings,
  Link2,
  Unlink,
  Car,
  Search,
  Zap,
  Info,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

function MercadoLibreContent() {
  const searchParams = useSearchParams();
  const [config, setConfig] = useState<any>(null);
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [search, setSearch] = useState('');
  const [filtroML, setFiltroML] = useState<'TODOS' | 'PUBLICADOS' | 'NO_PUBLICADOS' | 'ACTIVAS' | 'PAUSADAS'>('TODOS');
  
  // Acciones en curso
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modal de configuración de credenciales
  const [modalConfigOpen, setModalConfigOpen] = useState(false);
  const [appIdInput, setAppIdInput] = useState('');
  const [clientSecretInput, setClientSecretInput] = useState('');
  const [redirectUriInput, setRedirectUriInput] = useState('');
  const [guardandoConfig, setGuardandoConfig] = useState(false);

  useEffect(() => {
    cargarConfig();
    cargarVehiculos();

    const statusParam = searchParams.get('status');
    const errorParam = searchParams.get('error');
    if (statusParam === 'connected') {
      showToast('¡Cuenta de Mercado Libre conectada exitosamente!', 'success');
    } else if (errorParam) {
      showToast(`Error al conectar Mercado Libre: ${errorParam}`, 'error');
    }
  }, [searchParams]);

  const showToast = (text: string, type: 'success' | 'error') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 5000);
  };

  const cargarConfig = async () => {
    setLoadingConfig(true);
    try {
      const res = await fetch('/api/mercadolibre/config');
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
        setAppIdInput(data.appId || '');
        setRedirectUriInput(data.redirectUri || window.location.origin + '/api/mercadolibre/callback');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingConfig(false);
    }
  };

  const cargarVehiculos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vehiculos');
      if (res.ok) {
        const data = await res.json();
        setVehiculos(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardandoConfig(true);
    try {
      const res = await fetch('/api/mercadolibre/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: appIdInput,
          clientSecret: clientSecretInput || undefined,
          redirectUri: redirectUriInput,
        }),
      });

      if (res.ok) {
        showToast('Configuración de credenciales guardada correctamente', 'success');
        setModalConfigOpen(false);
        cargarConfig();
      } else {
        const err = await res.json();
        showToast(err.error || 'Error al guardar credenciales', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error de conexión con el servidor', 'error');
    } finally {
      setGuardandoConfig(false);
    }
  };

  const handleDesvincular = async () => {
    if (!confirm('¿Estás seguro de que deseas desvincular la cuenta de Mercado Libre?')) return;
    try {
      const res = await fetch('/api/mercadolibre/disconnect', { method: 'POST' });
      if (res.ok) {
        showToast('Cuenta de Mercado Libre desvinculada', 'success');
        cargarConfig();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublicar = async (vehiculoId: number) => {
    setActionLoadingId(vehiculoId);
    try {
      const res = await fetch(`/api/mercadolibre/publish/${vehiculoId}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || '¡Vehículo publicado con éxito en Mercado Libre!', 'success');
        cargarVehiculos();
      } else {
        showToast(data.error || 'No se pudo publicar en Mercado Libre', 'error');
      }
    } catch (err: any) {
      showToast('Error de conexión: ' + err.message, 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSyncStatus = async (vehiculoId: number, action: 'pause' | 'activate' | 'sync') => {
    setActionLoadingId(vehiculoId);
    try {
      const res = await fetch(`/api/mercadolibre/sync/${vehiculoId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || 'Estado actualizado', 'success');
        cargarVehiculos();
      } else {
        showToast(data.error || 'Error al sincronizar con Mercado Libre', 'error');
      }
    } catch (err: any) {
      showToast('Error de conexión', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const vehiculosFiltrados = vehiculos.filter((v) => {
    const matchSearch =
      search === '' ||
      v.marca?.toLowerCase().includes(search.toLowerCase()) ||
      v.modelo?.toLowerCase().includes(search.toLowerCase()) ||
      v.patente?.toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;

    if (filtroML === 'PUBLICADOS') return !!v.mercadoLibreId;
    if (filtroML === 'NO_PUBLICADOS') return !v.mercadoLibreId;
    if (filtroML === 'ACTIVAS') return v.mercadoLibreStatus === 'active';
    if (filtroML === 'PAUSADAS') return v.mercadoLibreStatus === 'paused';

    return true;
  });

  const totalPublicados = vehiculos.filter((v) => !!v.mercadoLibreId).length;
  const totalActivos = vehiculos.filter((v) => v.mercadoLibreStatus === 'active').length;
  const totalPausados = vehiculos.filter((v) => v.mercadoLibreStatus === 'paused').length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-xs font-bold transition-all transform translate-y-0 ${
            toastMessage.type === 'success'
              ? 'bg-zinc-950 text-emerald-400 border border-emerald-500/30'
              : 'bg-rose-950 text-rose-300 border border-rose-500/30'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-600 block mb-1">
            Ventas y Publicaciones
          </span>
          <h1 className="text-3xl font-extrabold text-black font-['Outfit']">
            Mercado Libre
          </h1>
        </div>

        {config?.connected && (
          <div className="flex items-center gap-2">
            <a
              href="/api/mercadolibre/auth"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-amber-950 bg-amber-400 hover:bg-amber-300 shadow-xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reconectar
            </a>
          </div>
        )}
      </div>

      {/* Account Status Card Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-300 to-amber-200 text-zinc-950 border border-amber-400/30 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${config?.connected ? 'bg-emerald-600 animate-pulse' : 'bg-amber-700'}`} />
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-950">
                {config?.connected ? 'Cuenta Conectada' : 'Cuenta No Vinculada'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] tracking-tight text-black">
              {config?.connected
                ? `Conectado como @${config?.nickname || 'Concesionaria'}`
                : 'Publicá tus vehículos en Mercado Libre'}
            </h2>
            <p className="text-xs text-amber-950/80 font-medium leading-relaxed">
              {config?.connected
                ? 'Tus unidades se publican directamente con sus fotos, precio y especificaciones técnicas.'
                : 'Conectá tu cuenta de Mercado Libre para publicar cualquier unidad en 1 clic.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {config?.connected ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <a
                  href="https://myaccount.mercadolibre.com.ar/listings"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-zinc-950 text-white hover:bg-black font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Ir a Publicaciones
                </a>
                <button
                  onClick={handleDesvincular}
                  className="px-4 py-2.5 rounded-xl bg-white/80 hover:bg-white text-rose-700 font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Unlink className="w-3.5 h-3.5" />
                  Desvincular
                </button>
              </div>
            ) : (
              <a
                href="/api/mercadolibre/auth"
                className="px-5 py-3 rounded-2xl bg-zinc-950 text-white hover:bg-black font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-400 fill-current" />
                Conectar con Mercado Libre
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
            Total en Stock
          </span>
          <span className="text-2xl font-black text-black font-mono">
            {vehiculos.length}
          </span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block mb-1">
            Publicados en ML
          </span>
          <span className="text-2xl font-black text-amber-600 font-mono">
            {totalPublicados}
          </span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
            Listings Activos
          </span>
          <span className="text-2xl font-black text-emerald-600 font-mono">
            {totalActivos}
          </span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
            Listings Pausados
          </span>
          <span className="text-2xl font-black text-zinc-700 font-mono">
            {totalPausados}
          </span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por marca, modelo o patente..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'TODOS', label: 'Todos' },
            { id: 'PUBLICADOS', label: `Publicados (${totalPublicados})` },
            { id: 'NO_PUBLICADOS', label: 'Sin Publicar' },
            { id: 'ACTIVAS', label: 'Activas' },
            { id: 'PAUSADAS', label: 'Pausadas' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFiltroML(item.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                filtroML === item.id
                  ? 'bg-amber-400 text-amber-950 font-bold shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory ML Management Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Vehículo</th>
                <th className="py-3.5 px-4">Categoría</th>
                <th className="py-3.5 px-4">Precio (USD)</th>
                <th className="py-3.5 px-4">Estado en Mercado Libre</th>
                <th className="py-3.5 px-4">Última Sincronización</th>
                <th className="py-3.5 px-4 text-right">Acción 1-Clic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400">
                    Cargando inventario para Mercado Libre...
                  </td>
                </tr>
              ) : vehiculosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400">
                    No se encontraron vehículos que coincidan con los filtros.
                  </td>
                </tr>
              ) : (
                vehiculosFiltrados.map((v) => {
                  const isPublished = !!v.mercadoLibreId;
                  const isLoadingThis = actionLoadingId === v.id;
                  const fotos = typeof v.imagenesUrls === 'string' ? JSON.parse(v.imagenesUrls || '[]') : v.imagenesUrls;
                  const thumb = fotos?.[0] || 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=200&q=80';

                  return (
                    <tr key={v.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={thumb}
                            alt={v.modelo}
                            className="w-12 h-10 rounded-lg object-cover bg-zinc-100 border border-zinc-200"
                          />
                          <div>
                            <div className="font-bold text-black text-sm">
                              {v.marca} {v.modelo}
                            </div>
                            <div className="text-[11px] text-zinc-400 font-normal">
                              {v.version || 'Base'} • {v.anio} • {v.patente || 'S/D'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-zinc-100 text-zinc-800">
                          {v.tipoVehiculo}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-black text-sm">
                        USD ${v.precio?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        {isPublished ? (
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                                v.mercadoLibreStatus === 'active'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : v.mercadoLibreStatus === 'paused'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-zinc-100 text-zinc-700'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  v.mercadoLibreStatus === 'active' ? 'bg-emerald-600' : 'bg-amber-600'
                                }`}
                              />
                              {v.mercadoLibreStatus === 'active' ? 'Activa' : v.mercadoLibreStatus === 'paused' ? 'Pausada' : v.mercadoLibreStatus}
                            </span>
                            <span className="font-mono text-[10px] text-zinc-400">
                              {v.mercadoLibreId}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-zinc-400 italic">
                            No publicado
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[11px] text-zinc-500">
                        {v.mercadoLibreSyncedAt
                          ? new Date(v.mercadoLibreSyncedAt).toLocaleString('es-AR', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })
                          : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          {isPublished ? (
                            <>
                              {v.mercadoLibrePermalink && (
                                <a
                                  href={v.mercadoLibrePermalink}
                                  target="_blank"
                                  rel="noreferrer"
                                  title="Ver publicación activa en Mercado Libre"
                                  className="p-2 rounded-xl text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                              {v.mercadoLibreStatus === 'active' ? (
                                <button
                                  onClick={() => handleSyncStatus(v.id, 'pause')}
                                  disabled={isLoadingThis}
                                  title="Pausar publicación en Mercado Libre"
                                  className="p-2 rounded-xl text-zinc-600 bg-zinc-100 hover:bg-zinc-200 hover:text-black transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  <Pause className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleSyncStatus(v.id, 'activate')}
                                  disabled={isLoadingThis}
                                  title="Reactivar publicación en Mercado Libre"
                                  className="p-2 rounded-xl text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  <Play className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => handlePublicar(v.id)}
                                disabled={isLoadingThis}
                                title="Actualizar datos y precio en Mercado Libre"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-800 bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer disabled:opacity-50"
                              >
                                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingThis ? 'animate-spin' : ''}`} />
                                <span className="hidden sm:inline">Actualizar</span>
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handlePublicar(v.id)}
                              disabled={isLoadingThis}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider text-amber-950 bg-amber-400 hover:bg-amber-300 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                            >
                              <Zap className={`w-3.5 h-3.5 fill-current ${isLoadingThis ? 'animate-bounce' : ''}`} />
                              <span>{isLoadingThis ? 'Publicando...' : 'Publicar en ML'}</span>
                            </button>
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

      {/* Acceso técnico discreto para el desarrollador */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => setModalConfigOpen(true)}
          className="text-[11px] text-zinc-400 hover:text-zinc-700 underline transition-colors cursor-pointer"
        >
          Configuración técnica de API (Desarrollador)
        </button>
      </div>

      {/* Modal Configuración de Credenciales API */}
      {modalConfigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-zinc-200 space-y-6 my-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 block">
                  Mercado Libre Developers
                </span>
                <h3 className="text-xl font-bold text-black font-['Outfit']">
                  Configuración de la Aplicación
                </h3>
              </div>
              <button
                onClick={() => setModalConfigOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-black cursor-pointer rounded-xl hover:bg-zinc-100"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-700" />
                ¿Cómo obtener tus credenciales?
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-amber-900 leading-relaxed font-medium">
                <li>
                  Ingresá a{' '}
                  <a
                    href="https://developers.mercadolibre.com.ar/apps/home"
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold underline text-amber-950 hover:text-black"
                  >
                    Mercado Libre Developers
                  </a>{' '}
                  y creá una aplicación.
                </li>
                <li>
                  En <strong>Redirect URI</strong> copiá exactamente la siguiente URL:
                  <div className="mt-1 p-2 bg-white rounded-lg border border-amber-300 font-mono text-[10px] text-black break-all select-all font-bold">
                    {redirectUriInput}
                  </div>
                </li>
                <li>Copiá el <strong>App ID</strong> (Client ID) y el <strong>Client Secret</strong> aquí abajo:</li>
              </ol>
            </div>

            <form onSubmit={handleGuardarConfig} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-800 block mb-1.5">
                  App ID (Client ID)
                </label>
                <input
                  type="text"
                  placeholder="Ej: 1234567890123456"
                  value={appIdInput}
                  onChange={(e) => setAppIdInput(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-black focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-800 block mb-1.5">
                  Client Secret {config?.hasSecret && <span className="text-emerald-600 font-normal">(Ya configurado ✓)</span>}
                </label>
                <input
                  type="password"
                  placeholder={config?.hasSecret ? '••••••••••••••••••••••••••••••••' : 'Ingresá el Client Secret'}
                  value={clientSecretInput}
                  onChange={(e) => setClientSecretInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-black focus:outline-none focus:border-black focus:bg-white"
                />
                <span className="text-[10px] text-zinc-400 mt-1 block">
                  Dejar en blanco si no deseas cambiar el Secret ya guardado.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-800 block mb-1.5">
                  Redirect URI (URL de Retorno OAuth)
                </label>
                <input
                  type="text"
                  value={redirectUriInput}
                  onChange={(e) => setRedirectUriInput(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono font-medium text-zinc-800 focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setModalConfigOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardandoConfig}
                  className="px-5 py-2.5 bg-zinc-950 hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {guardandoConfig ? 'Guardando...' : 'Guardar Credenciales'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MercadoLibrePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-400">Cargando integración de Mercado Libre...</div>}>
      <MercadoLibreContent />
    </Suspense>
  );
}
