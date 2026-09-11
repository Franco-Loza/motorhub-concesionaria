'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShoppingBag,
  ArrowLeft,
  Search,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  UserPlus,
  UserCheck,
  X,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
} from 'lucide-react';

export default function NuevaVentaPage() {
  const router = useRouter();

  const [vehiculosDisponibles, setVehiculosDisponibles] = useState<any[]>([]);
  const [loadingVehiculos, setLoadingVehiculos] = useState(true);

  // Form State
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<any>(null);
  const [precioFinal, setPrecioFinal] = useState<string>('');
  const [observaciones, setObservaciones] = useState<string>('');

  // Client Search/Creation State
  const [dniBusqueda, setDniBusqueda] = useState('');
  const [clienteEncontrado, setClienteEncontrado] = useState<any>(null);
  const [buscandoCliente, setBuscandoCliente] = useState(false);
  const [mostrarModalCliente, setMostrarModalCliente] = useState(false);
  const [mensajeClienteNoEncontrado, setMensajeClienteNoEncontrado] = useState('');

  // New Client Form (Carga Manual)
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [calle, setCalle] = useState('');
  const [numero, setNumero] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [provincia, setProvincia] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [guardandoCliente, setGuardandoCliente] = useState(false);
  const [errorModalCliente, setErrorModalCliente] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const res = await fetch('/api/vehiculos?estado=DISPONIBLE');
        if (res.ok) {
          const data = await res.json();
          setVehiculosDisponibles(data);
        }
      } catch (err) {
        console.error('Error al cargar vehículos:', err);
      } finally {
        setLoadingVehiculos(false);
      }
    };
    fetchVehiculos();
  }, []);

  const handleSelectVehiculo = (v: any) => {
    setVehiculoSeleccionado(v);
    setPrecioFinal(v.precio.toString());
  };

  const handleBuscarCliente = async (dniDirecto?: string) => {
    const dniLimpio = (dniDirecto || dniBusqueda).trim();
    if (!dniLimpio) return;

    setBuscandoCliente(true);
    setError('');
    setClienteEncontrado(null);
    setMensajeClienteNoEncontrado('');

    try {
      const res = await fetch(`/api/clientes?dni=${dniLimpio}`);
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setClienteEncontrado(data[0]);
        } else {
          setDni(dniLimpio);
          setNombreCompleto('');
          setEmail('');
          setTelefono('');
          setCalle('');
          setNumero('');
          setCiudad('');
          setProvincia('');
          setCodigoPostal('');
          setMensajeClienteNoEncontrado(`No se encontró ningún cliente registrado con DNI "${dniLimpio}".`);
          setMostrarModalCliente(true);
        }
      }
    } catch (e) {
      console.error(e);
      setError('Error al consultar clientes');
    } finally {
      setBuscandoCliente(false);
    }
  };

  const handleAbrirModalNuevoCliente = () => {
    setDni(dniBusqueda.trim());
    setNombreCompleto('');
    setEmail('');
    setTelefono('');
    setCalle('');
    setNumero('');
    setCiudad('');
    setProvincia('');
    setCodigoPostal('');
    setErrorModalCliente('');
    setMensajeClienteNoEncontrado('');
    setMostrarModalCliente(true);
  };

  const handleCrearCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreCompleto.trim() || !dni.trim()) {
      setErrorModalCliente('Nombre completo y DNI son obligatorios');
      return;
    }

    setGuardandoCliente(true);
    setErrorModalCliente('');

    try {
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombreCompleto: nombreCompleto.trim(),
          dni: dni.trim(),
          email: email.trim() || undefined,
          telefono: telefono.trim() || undefined,
          calle: calle.trim() || undefined,
          numero: numero.trim() || undefined,
          ciudad: ciudad.trim() || undefined,
          provincia: provincia.trim() || undefined,
          codigoPostal: codigoPostal.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setClienteEncontrado(data);
        setMostrarModalCliente(false);
        setDniBusqueda(data.dni);
        // Limpiar formulario
        setNombreCompleto('');
        setDni('');
        setEmail('');
        setTelefono('');
        setCalle('');
        setNumero('');
        setCiudad('');
        setProvincia('');
        setCodigoPostal('');
      } else {
        setErrorModalCliente(data.error || 'Error al guardar cliente');
      }
    } catch (err) {
      setErrorModalCliente('Error de conexión');
    } finally {
      setGuardandoCliente(false);
    }
  };

  const handleSubmitVenta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehiculoSeleccionado) {
      setError('Debe seleccionar un vehículo para la venta');
      return;
    }
    if (!clienteEncontrado) {
      setError('Debe seleccionar o registrar un comprador');
      return;
    }
    if (!precioFinal || parseFloat(precioFinal) <= 0) {
      setError('El precio final debe ser mayor a 0');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehiculoId: vehiculoSeleccionado.id,
          compradorId: clienteEncontrado.id,
          precioFinal: parseFloat(precioFinal),
          observaciones,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/panel/ventas');
          router.refresh();
        }, 1200);
      } else {
        setError(data.error || 'Error al registrar venta');
        setSaving(false);
      }
    } catch (err) {
      setError('Error de comunicación con el servidor');
      setSaving(false);
    }
  };

  return (
    <>
      <div className="space-y-8 pb-16">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/panel/ventas"
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-black mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver a Ventas
            </Link>
          <h1 className="text-3xl font-extrabold text-black font-['Outfit']">
            Cierre y Registro de Venta
          </h1>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-semibold flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
          <span>¡Venta registrada con éxito! Descontando unidad del inventario...</span>
        </div>
      )}

      <form onSubmit={handleSubmitVenta} className="space-y-8">
        {/* Step 1: Seleccionar Vehículo */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
          <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold text-black font-['Outfit']">
              1. Seleccionar Vehículo a Vender
            </h3>
            {vehiculoSeleccionado && (
              <span className="text-xs font-extrabold text-zinc-950 bg-emerald-400 px-3 py-1 rounded-lg">
                Unidad #{vehiculoSeleccionado.id} Seleccionada
              </span>
            )}
          </div>

          {loadingVehiculos ? (
            <p className="text-xs text-zinc-400 py-4 text-center">Cargando vehículos disponibles...</p>
          ) : vehiculosDisponibles.length === 0 ? (
            <p className="text-xs text-zinc-400 py-4 text-center">No hay vehículos con estado DISPONIBLE.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-72 overflow-y-auto pr-1">
              {vehiculosDisponibles.map((v) => {
                const isSel = vehiculoSeleccionado?.id === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => handleSelectVehiculo(v)}
                    className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      isSel
                        ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-zinc-200 hover:border-zinc-400 bg-zinc-50/50'
                    }`}
                  >
                    <img
                      src={v.imagenesUrls?.[0] || 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=200&q=80'}
                      alt={v.modelo}
                      className="w-14 h-12 rounded-lg object-cover bg-zinc-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-black truncate">
                        {v.marca} {v.modelo}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        {v.anio} • {v.patente || 'S/Patente'}
                      </div>
                      <div className="text-xs font-extrabold text-black font-['Outfit'] mt-0.5">
                        USD ${v.precio?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Step 2: Cliente / Comprador */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-xs space-y-6">
          <div className="border-b border-zinc-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-black font-['Outfit']">
                2. Comprador/Cliente
              </h3>
              <p className="text-xs text-zinc-500">Buscá un cliente por DNI o registrá uno nuevo directamente</p>
            </div>
            <button
              type="button"
              onClick={handleAbrirModalNuevoCliente}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-black hover:bg-zinc-800 transition-colors cursor-pointer w-fit"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Registrar Nuevo Cliente</span>
            </button>
          </div>

          {/* Search by DNI */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl">
            <div className="relative flex-1">
              <input
                type="text"
                value={dniBusqueda}
                onChange={(e) => setDniBusqueda(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleBuscarCliente();
                  }
                }}
                placeholder="Ingresar DNI del comprador..."
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-black font-medium"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            </div>
            <button
              type="button"
              onClick={() => handleBuscarCliente()}
              disabled={buscandoCliente || !dniBusqueda.trim()}
              className="px-5 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-40"
            >
              {buscandoCliente ? 'Buscando...' : 'Buscar Cliente'}
            </button>
          </div>

          {/* Cliente Encontrado */}
          {clienteEncontrado ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-zinc-500 tracking-wider block">
                    Comprador Asignado a la Venta
                  </span>
                  <div className="text-base font-bold text-black font-['Outfit']">
                    {clienteEncontrado.nombreCompleto}
                  </div>
                  <div className="text-xs text-zinc-600 flex flex-wrap items-center gap-3 mt-0.5">
                    <span><strong>DNI:</strong> {clienteEncontrado.dni}</span>
                    {clienteEncontrado.telefono && <span>• <strong>Tel:</strong> {clienteEncontrado.telefono}</span>}
                    {clienteEncontrado.email && <span>• <strong>Email:</strong> {clienteEncontrado.email}</span>}
                    {clienteEncontrado.ciudad && <span>• <strong>Ciudad:</strong> {clienteEncontrado.ciudad}</span>}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setClienteEncontrado(null);
                  setDniBusqueda('');
                }}
                className="px-3 py-1.5 text-xs text-zinc-600 hover:text-black font-bold border border-zinc-300 rounded-lg hover:bg-zinc-100 transition-colors self-start sm:self-center cursor-pointer"
              >
                Cambiar Cliente
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-zinc-300 text-center py-6 bg-zinc-50/50">
              <User className="w-6 h-6 text-zinc-400 mx-auto mb-1.5" />
              <p className="text-xs text-zinc-500 font-medium">
                Ingresá el número de documento y presioná <strong className="text-zinc-800">Buscar Cliente</strong> para asignarlo automáticamente a la venta.
              </p>
            </div>
          )}
        </div>

        {/* Step 3: Condiciones Comerciales */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-xs space-y-6">
          <div className="border-b border-zinc-100 pb-3">
            <h3 className="text-lg font-bold text-black font-['Outfit']">
              3. Condiciones Finales de la Operación
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                Precio Final Acordado (USD) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  value={precioFinal}
                  onChange={(e) => setPrecioFinal(e.target.value)}
                  placeholder="Monto final de venta"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl font-extrabold text-black focus:outline-none focus:border-black"
                />
                <DollarSign className="w-4 h-4 text-zinc-600 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                Observaciones/Forma de Pago
              </label>
              <textarea
                rows={2}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Ej. 50% transferencia bancaria y 50% efectivo en dólares. Entrega pactada..."
                className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl resize-none font-medium focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/panel/ventas"
            className="px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-600 bg-white hover:bg-zinc-50 border border-zinc-300 shadow-xs transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <ShoppingBag className="w-4 h-4" />
            {saving ? 'Registrando Venta...' : 'Confirmar Venta y Emitir Comprobante'}
          </button>
        </div>
      </form>
    </div>

      {/* Modal Pantalla para Cargar Nuevo Cliente */}
      {mostrarModalCliente && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto my-auto shadow-2xl border border-zinc-200 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-black" />
                <span className="font-bold text-black font-['Outfit'] text-base">
                  Registrar Datos del Cliente
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMostrarModalCliente(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {mensajeClienteNoEncontrado && (
              <div className="p-3.5 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-medium">
                {mensajeClienteNoEncontrado} Completá los datos a continuación para darlo de alta y asignarlo a la venta.
              </div>
            )}

            {errorModalCliente && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorModalCliente}</span>
              </div>
            )}

            <form onSubmit={handleCrearCliente} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                    Nombre y Apellido Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={nombreCompleto}
                    onChange={(e) => setNombreCompleto(e.target.value)}
                    placeholder="Ej. Carlos Rodríguez"
                    className="w-full px-3 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-black font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                    DNI/Documento *
                  </label>
                  <input
                    type="text"
                    required
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="Ej. 38450123"
                    className="w-full px-3 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-black font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                    Teléfono/WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Ej. 1152638000"
                    className="w-full px-3 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-black font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ej. cliente@gmail.com"
                    className="w-full px-3 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-black font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:col-span-2">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                      Calle
                    </label>
                    <input
                      type="text"
                      value={calle}
                      onChange={(e) => setCalle(e.target.value)}
                      placeholder="Ej. San Martín"
                      className="w-full px-3 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-black font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                      Número
                    </label>
                    <input
                      type="text"
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      placeholder="Ej. 1234"
                      className="w-full px-3 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-black font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    placeholder="Ej. Reconquista"
                    className="w-full px-3 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-black font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                    Provincia
                  </label>
                  <input
                    type="text"
                    value={provincia}
                    onChange={(e) => setProvincia(e.target.value)}
                    placeholder="Ej. Santa Fe"
                    className="w-full px-3 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-black font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    value={codigoPostal}
                    onChange={(e) => setCodigoPostal(e.target.value)}
                    placeholder="Ej. S3560"
                    className="w-full px-3 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-black font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setMostrarModalCliente(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardandoCliente}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-950 bg-emerald-400 hover:bg-emerald-300 shadow-sm shadow-emerald-500/20 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {guardandoCliente ? 'Guardando...' : 'Guardar y Asignar a la Venta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}


