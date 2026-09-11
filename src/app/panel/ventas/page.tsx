'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PlusCircle,
  Printer,
  Trash2,
  X,
  FileText,
  AlertTriangle,
} from 'lucide-react';

export default function GestionVentasPage() {
  const [ventas, setVentas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Ticket Modal
  const [ticketVenta, setTicketVenta] = useState<any>(null);

  // Anulación modal
  const [ventaAAnular, setVentaAAnular] = useState<any>(null);
  const [anulando, setAnulando] = useState(false);

  // Datos dinámicos de Casa Central
  const [casaCentral, setCasaCentral] = useState<any>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const json = await res.json();
          setCurrentUser(json.user);
        }
      } catch (e) {
        console.error(e);
      }
    };

    const fetchCasaCentral = async () => {
      try {
        const res = await fetch('/api/sucursales');
        if (res.ok) {
          const sucursales = await res.json();
          const cc = sucursales.find((s: any) => s.esCasaCentral) || sucursales[0] || null;
          setCasaCentral(cc);
        }
      } catch (e) {
        console.error('Error al cargar datos de Casa Central para factura:', e);
      }
    };

    fetchMe();
    fetchCasaCentral();
    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (fechaDesde) params.append('fechaDesde', fechaDesde);
      if (fechaHasta) params.append('fechaHasta', fechaHasta);

      const res = await fetch(`/api/ventas?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setVentas(data);
      }
    } catch (err) {
      console.error('Error al cargar ventas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnular = async () => {
    if (!ventaAAnular) return;
    setAnulando(true);
    try {
      const res = await fetch(`/api/ventas/${ventaAAnular.id}`, { method: 'DELETE' });
      if (res.ok) {
        setVentas(ventas.filter((v) => v.id !== ventaAAnular.id));
        setVentaAAnular(null);
      }
    } catch (err) {
      console.error('Error al anular venta:', err);
    } finally {
      setAnulando(false);
    }
  };

  const isDueno = currentUser?.rol === 'DUENO';
  const totalFacturado = ventas.reduce((acc, v) => acc + v.precioFinal, 0);

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-1">
            {isDueno ? 'Operaciones Globales' : 'Mis Operaciones Registradas'}
          </span>
          <h1 className="text-3xl font-extrabold text-black font-['Outfit']">
            {isDueno ? 'Gestión Global de Ventas' : 'Mis Ventas'}
          </h1>
        </div>
        <Link
          href="/panel/ventas/nueva"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-950 bg-emerald-400 hover:bg-emerald-300 shadow-sm shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Registrar Nueva Venta
        </Link>
      </div>

      {/* Date Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-zinc-500">Desde:</span>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="px-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-emerald-500 text-zinc-900"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-zinc-500">Hasta:</span>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="px-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-emerald-500 text-zinc-900"
            />
          </div>
          <button
            onClick={cargarVentas}
            className="px-4 py-1.5 bg-zinc-900 hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Filtrar
          </button>
        </div>

        <div className="text-xs font-bold text-zinc-700">
          Total Operaciones: <span className="text-black font-extrabold">{ventas.length}</span> | Facturado:{' '}
          <span className="text-emerald-700 font-extrabold font-['Outfit'] text-sm">
            USD ${totalFacturado.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">N° Operación</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Vehículo</th>
                <th className="px-6 py-4">Comprador</th>
                <th className="px-6 py-4">Vendedor</th>
                <th className="px-6 py-4">Precio Final</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-zinc-400">
                    Cargando ventas...
                  </td>
                </tr>
              ) : ventas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-400">
                    <div className="max-w-xs mx-auto space-y-1">
                      <p className="font-bold text-zinc-700 text-sm">No hay ventas registradas aún</p>
                      <p className="text-xs text-zinc-400">
                        {isDueno
                          ? 'Aún no se ha registrado ninguna venta en el sistema.'
                          : 'Aún no has registrado ninguna venta a tu nombre.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                ventas.map((v) => (
                  <tr key={v.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-black">#{v.id}</td>
                    <td className="px-6 py-4 text-zinc-600">
                      {new Date(v.fechaVenta).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-black">
                        {v.vehiculo?.marca} {v.vehiculo?.modelo}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {v.vehiculo?.anio} {v.vehiculo?.patente ? `• ${v.vehiculo?.patente}` : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-black">{v.comprador?.nombreCompleto}</div>
                      <div className="text-[11px] text-zinc-500">DNI: {v.comprador?.dni}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-700">
                      {v.vendedor?.nombreCompleto || 'Staff'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-extrabold text-black font-['Outfit'] text-sm">
                        USD ${v.precioFinal?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setTicketVenta(v)}
                          title="Ver/Imprimir Comprobante"
                          className="p-1.5 rounded-lg text-zinc-600 hover:text-black hover:bg-zinc-100 cursor-pointer"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        {isDueno && (
                          <button
                            onClick={() => setVentaAAnular(v)}
                            title="Anular venta y reincorporar vehículo"
                            className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

      {/* Ticket / Comprobante Modal Comercial Tipo Factura A/B */}
      {ticketVenta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
          {/* Print CSS Styles */}
          <style dangerouslySetInnerHTML={{
            __html: `
              @media print {
                body * {
                  visibility: hidden !important;
                }
                #printable-factura, #printable-factura * {
                  visibility: visible !important;
                }
                #printable-factura {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  background: white !important;
                  box-shadow: none !important;
                  border: none !important;
                }
                @page {
                  size: A4 portrait;
                  margin: 8mm;
                }
              }
            `
          }} />

          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto my-auto shadow-2xl border border-zinc-200 flex flex-col print:max-w-none print:max-h-none print:border-none print:shadow-none print:rounded-none">
            {/* Modal Actions Header (Hidden in Print) */}
            <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80 sticky top-0 z-10 print:hidden">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-zinc-950 text-emerald-400 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 font-['Outfit']">
                    Factura Comercial/Boleto de Compraventa Oficial
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Operación Nº 0001-{String(ticketVenta.id).padStart(8, '0')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm shadow-emerald-500/20"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir/Guardar PDF
                </button>
                <button
                  onClick={() => setTicketVenta(null)}
                  className="p-2 text-zinc-400 hover:text-zinc-600 rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Commercial Invoice Document */}
            <div className="p-6 sm:p-10 text-zinc-900 text-xs overflow-x-auto bg-white flex-1">
              <div id="printable-factura" className="max-w-[780px] mx-auto border-2 border-zinc-900 p-6 space-y-5 bg-white text-zinc-900 font-sans">
                
                {/* 1. TOP HEADER: DEALERSHIP / INVOICE LETTER / INVOICE NUMBER */}
                <div className="border border-zinc-900 p-4 relative">
                  {/* Central Invoice Badge (Letter B / A) */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/2 bg-white px-2">
                    <div className="w-14 h-14 border-2 border-zinc-900 bg-white flex flex-col items-center justify-center shadow-xs">
                      <span className="text-2xl font-black font-['Outfit'] leading-none">B</span>
                      <span className="text-[8px] font-bold uppercase tracking-tighter text-zinc-600">COD. 006</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-2">
                    {/* Left: Dealership info */}
                    <div className="space-y-1 pr-6 border-r border-zinc-300">
                      <div className="flex items-center gap-2.5 mb-2">
                        <img
                          src="/logo.png"
                          alt="MotorHUB Logo"
                          className="w-8 h-8 rounded-lg object-cover border border-zinc-900"
                        />
                        <span className="text-xl font-black text-black font-['Outfit'] tracking-tight">
                          MOTOR<span className="text-emerald-600 font-extrabold">HUB</span>
                        </span>
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-zinc-100 border border-zinc-300 rounded text-zinc-700">
                          Oficial
                        </span>
                      </div>
                      <p className="font-bold text-xs uppercase text-zinc-950">MOTORHUB AUTOMOTORES S.A.</p>
                      <p className="text-[11px] text-zinc-600 font-medium">Concesionaria Oficial Multimarca y Embarcaciones</p>
                      <p className="text-[11px] text-zinc-600">
                        <span className="font-bold text-zinc-800">Casa Central:</span>{' '}
                        {casaCentral
                          ? [
                              casaCentral.calle && casaCentral.numero ? `${casaCentral.calle} ${casaCentral.numero}` : casaCentral.calle,
                              casaCentral.pisoDepto ? `(${casaCentral.pisoDepto})` : null,
                              casaCentral.ciudad,
                              casaCentral.provincia,
                              casaCentral.codigoPostal ? `CP ${casaCentral.codigoPostal}` : null,
                              'Argentina',
                            ]
                              .filter(Boolean)
                              .join(', ')
                          : 'Av. Leandro N. Alem 3450, Santa Fe, Argentina'}
                      </p>
                      <p className="text-[11px] text-zinc-600">
                        Tel: {casaCentral?.telefono || casaCentral?.whatsapp || '+54 (342) 456-7890'} | Correo: {casaCentral?.email || 'administracion@motorhub.com.ar'}
                      </p>
                      <p className="text-[11px] font-bold text-zinc-900 pt-1">
                        IVA RESPONSABLE INSCRIPTO
                      </p>
                    </div>

                    {/* Right: Invoice Number and Tax Data */}
                    <div className="space-y-1 pl-4">
                      <h4 className="text-lg font-black uppercase text-zinc-950 font-['Outfit'] tracking-wide">
                        FACTURA COMERCIAL
                      </h4>
                      <p className="text-xs font-bold text-zinc-900">
                        Nº 0001 - {String(ticketVenta.id).padStart(8, '0')}
                      </p>
                      <div className="pt-2 space-y-1 text-[11px] text-zinc-700">
                        <p><span className="font-bold">Fecha de Emisión:</span> {new Date(ticketVenta.fechaVenta).toLocaleDateString('es-AR')} - {new Date(ticketVenta.fechaVenta).toLocaleTimeString('es-AR')}</p>
                        <p><span className="font-bold">CUIT:</span> 30-71689452-9</p>
                        <p><span className="font-bold">Ingresos Brutos:</span> 30-71689452-9</p>
                        <p><span className="font-bold">Inicio de Actividades:</span> 01/03/2018</p>
                        <p>
                          <span className="font-bold">Punto de Venta:</span> 0001 ({casaCentral?.nombre ? `${casaCentral.nombre} - Casa Central` : 'Casa Central'})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. CUSTOMER / BUYER DATA SECTION */}
                <div className="border border-zinc-900 p-3 bg-zinc-50/50">
                  <div className="grid grid-cols-2 gap-4 text-[11px]">
                    <div className="space-y-1">
                      <p>
                        <span className="font-bold text-zinc-700 uppercase">Señor(es)/Razón Social:</span>{' '}
                        <span className="font-extrabold text-zinc-950 text-xs">{ticketVenta.comprador?.nombreCompleto || 'Consumidor Final'}</span>
                      </p>
                      <p>
                        <span className="font-bold text-zinc-700 uppercase">DNI/CUIT:</span>{' '}
                        <span className="font-semibold text-zinc-900">{ticketVenta.comprador?.dni || 'Sin registrar'}</span>
                      </p>
                      <p>
                        <span className="font-bold text-zinc-700 uppercase">Domicilio:</span>{' '}
                        <span className="text-zinc-800">{ticketVenta.comprador?.direccion || 'Domicilio Particular Registrado'}</span>
                      </p>
                      <p>
                        <span className="font-bold text-zinc-700 uppercase">Teléfono de Contacto:</span>{' '}
                        <span className="text-zinc-800">{ticketVenta.comprador?.telefono || 'Sin registrar'}</span>
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p>
                        <span className="font-bold text-zinc-700 uppercase">Condición frente al IVA:</span>{' '}
                        <span className="font-bold text-zinc-950">Consumidor Final</span>
                      </p>
                      <p>
                        <span className="font-bold text-zinc-700 uppercase">Condición de Venta:</span>{' '}
                        <span className="font-bold text-emerald-800">Contado/Transferencia Inmediata</span>
                      </p>
                      <p>
                        <span className="font-bold text-zinc-700 uppercase">Asesor Comercial:</span>{' '}
                        <span className="text-zinc-900 font-semibold">{ticketVenta.vendedor?.nombreCompleto || 'Staff Oficial'} (Legajo #{ticketVenta.vendedorId || '01'})</span>
                      </p>
                      <p>
                        <span className="font-bold text-zinc-700 uppercase">Estado de la Operación:</span>{' '}
                        <span className="font-bold uppercase text-emerald-700">COMPRAVENTA CONCRETADA</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. ITEM DETAILS TABLE */}
                <div className="border border-zinc-900 overflow-hidden">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-zinc-900 text-white font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-2 px-3 border-r border-zinc-700 w-20">Código</th>
                        <th className="py-2 px-3 border-r border-zinc-700">Descripción y Especificaciones del Vehículo</th>
                        <th className="py-2 px-2 text-center border-r border-zinc-700 w-14">Cant.</th>
                        <th className="py-2 px-2 text-center border-r border-zinc-700 w-16">U. Med.</th>
                        <th className="py-2 px-3 text-right border-r border-zinc-700 w-28">Precio Unit. (USD)</th>
                        <th className="py-2 px-3 text-right w-28">Subtotal (USD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      <tr>
                        <td className="py-3 px-3 border-r border-zinc-200 font-mono font-bold align-top">
                          VEH-{String(ticketVenta.vehiculo?.id).padStart(4, '0')}
                        </td>
                        <td className="py-3 px-3 border-r border-zinc-200 align-top space-y-1.5">
                          <div>
                            <span className="font-black text-xs text-zinc-950 uppercase block">
                              {ticketVenta.vehiculo?.marca} {ticketVenta.vehiculo?.modelo} {ticketVenta.vehiculo?.version || ''}
                            </span>
                            <span className="text-[10px] text-zinc-600 font-medium">
                              Año de Fabricación: {ticketVenta.vehiculo?.anio} • Categoría: {ticketVenta.vehiculo?.tipoVehiculo}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px] text-zinc-700 bg-zinc-50 p-2 border border-zinc-200 rounded">
                            <p><span className="font-semibold">Patente/Matrícula:</span> <span className="font-bold text-zinc-900">{ticketVenta.vehiculo?.patente || 'A Patentar (0 KM)'}</span></p>
                            <p><span className="font-semibold">Chasis/VIN:</span> <span className="font-mono text-zinc-900">{ticketVenta.vehiculo?.vin || 'Verificado en peritaje'}</span></p>
                            <p><span className="font-semibold">Nº de Motor:</span> <span className="text-zinc-900">{ticketVenta.vehiculo?.numeroMotor || 'Registrado'}</span></p>
                            <p><span className="font-semibold">Condición de Rodaje:</span> <span className="font-bold text-emerald-800">{ticketVenta.vehiculo?.primeraMano ? 'Unidad 0 KM (A Estrenar)' : `${ticketVenta.vehiculo?.kilometraje?.toLocaleString('es-AR') || '0'} km`}</span></p>
                            <p><span className="font-semibold">Color:</span> {ticketVenta.vehiculo?.color || 'Original'}</p>
                            <p><span className="font-semibold">Combustible:</span> {ticketVenta.vehiculo?.combustible || 'Nafta'}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center border-r border-zinc-200 font-bold align-top">
                          1.00
                        </td>
                        <td className="py-3 px-2 text-center border-r border-zinc-200 align-top text-zinc-600">
                          UNIDAD
                        </td>
                        <td className="py-3 px-3 text-right border-r border-zinc-200 font-bold align-top font-mono">
                          USD ${ticketVenta.precioFinal?.toLocaleString('es-AR')}
                        </td>
                        <td className="py-3 px-3 text-right font-black align-top font-mono text-zinc-950">
                          USD ${ticketVenta.precioFinal?.toLocaleString('es-AR')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 4. TOTALS & OBSERVATIONS SECTION */}
                <div className="grid grid-cols-12 gap-4">
                  {/* Left: Observations and legal clauses */}
                  <div className="col-span-7 border border-zinc-900 p-3 space-y-2 text-[10px] text-zinc-700">
                    <span className="font-bold uppercase text-zinc-900 block border-b border-zinc-200 pb-1">
                      Observaciones y Cláusula de Transferencia
                    </span>
                    <p className="italic text-zinc-600">
                      {ticketVenta.observaciones || 'La presente unidad se entrega libre de prendas, embargos y deudas de patentes e infracciones. Concesionaria MotorHub garantiza la legitimidad de la documentación registral y verificación técnica oficial.'}
                    </p>
                    <p className="text-[9px] text-zinc-500 pt-1">
                      * Documento emitido como comprobante y boleto oficial de adquisición de vehículo automotor/náutico en Concesionaria MotorHub.
                    </p>
                  </div>

                  {/* Right: Subtotals and Grand Total */}
                  <div className="col-span-5 border border-zinc-900 p-3 space-y-1.5 bg-zinc-50/70 text-[11px]">
                    <div className="flex justify-between text-zinc-700">
                      <span className="font-semibold">Subtotal Gravado:</span>
                      <span className="font-mono font-bold">USD ${ticketVenta.precioFinal?.toLocaleString('es-AR')}</span>
                    </div>
                    <div className="flex justify-between text-zinc-700">
                      <span className="font-semibold">IVA (21% Incluido):</span>
                      <span className="font-mono font-bold">USD $0.00</span>
                    </div>
                    <div className="flex justify-between text-zinc-700">
                      <span className="font-semibold">Bonificaciones/Descuento:</span>
                      <span className="font-mono font-bold">USD $0.00</span>
                    </div>
                    <div className="border-t-2 border-zinc-900 pt-2 flex justify-between items-center">
                      <span className="font-black text-xs text-zinc-950 uppercase font-['Outfit']">
                        TOTAL FINAL:
                      </span>
                      <span className="font-black text-base text-zinc-950 font-['Outfit'] font-mono bg-emerald-100/80 px-2 py-0.5 border border-emerald-300 rounded">
                        USD ${ticketVenta.precioFinal?.toLocaleString('es-AR')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 5. SIGNATURES & CONCESIONARIA SEAL */}
                <div className="border border-zinc-900 p-4 pt-8">
                  <div className="grid grid-cols-2 gap-12 text-center text-[11px]">
                    <div className="space-y-1 pt-6 border-t border-zinc-400">
                      <span className="font-extrabold uppercase text-zinc-900 block">
                        {ticketVenta.comprador?.nombreCompleto || 'Firma del Comprador'}
                      </span>
                      <span className="text-[10px] text-zinc-500 block">
                        DNI / CUIT: {ticketVenta.comprador?.dni || '...........................'}
                      </span>
                      <span className="text-[9px] text-zinc-400 block font-semibold uppercase">
                        Firma y Aclaración del Comprador
                      </span>
                    </div>

                    <div className="space-y-1 pt-6 border-t border-zinc-400">
                      <span className="font-extrabold uppercase text-zinc-900 block">
                        MOTORHUB AUTOMOTORES S.A.
                      </span>
                      <span className="text-[10px] text-zinc-500 block">
                        Asesor: {ticketVenta.vendedor?.nombreCompleto || 'Firma Autorizada'}
                      </span>
                      <span className="text-[9px] text-zinc-400 block font-semibold uppercase">
                        Sello Oficial y Representación Legal
                      </span>
                    </div>
                  </div>
                </div>

                {/* 6. BOTTOM BARCODE & CAE STRIP */}
                <div className="border-t border-dashed border-zinc-400 pt-3 flex flex-wrap items-center justify-between gap-4 text-[10px] text-zinc-600">
                  <div className="space-y-0.5">
                    <p className="font-bold text-zinc-900">
                      CAE Nº: <span className="font-mono">74829103847291</span>
                    </p>
                    <p>
                      Fecha de Vencimiento de CAE:{' '}
                      <span className="font-mono font-semibold">
                        {new Date(new Date(ticketVenta.fechaVenta).getTime() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString('es-AR')}
                      </span>
                    </p>
                  </div>

                  {/* Simulated barcode graphic */}
                  <div className="flex items-center gap-2">
                    <div className="font-mono text-[9px] tracking-widest bg-zinc-100 px-3 py-1 border border-zinc-300 rounded font-bold">
                      ||| |||| || ||||| || |||||| |||| ||
                    </div>
                  </div>

                  <p className="text-[9px] text-zinc-400 text-right">
                    Comprobante Electrónico Oficial • Sistema Centralizado MotorHub
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmación de Anulación */}
      {ventaAAnular && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto my-auto shadow-2xl border border-zinc-200 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-black flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-black font-['Outfit']">
                ¿Anular Venta #{ventaAAnular.id}?
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Al anular esta operación, el vehículo{' '}
                <strong className="text-black">
                  {ventaAAnular.vehiculo?.marca} {ventaAAnular.vehiculo?.modelo}
                </strong>{' '}
                volverá automáticamente al estado de <strong>DISPONIBLE</strong> en el inventario.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setVentaAAnular(null)}
                className="w-1/2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleAnular}
                disabled={anulando}
                className="w-1/2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-rose-600 hover:bg-rose-700 transition-colors cursor-pointer"
              >
                {anulando ? 'Anulando...' : 'Sí, Anular'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


