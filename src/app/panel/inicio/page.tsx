'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Car,
  ShoppingBag,
  DollarSign,
  MessageSquare,
  TrendingUp,
  Clock,
  Award,
  Percent,
  PlusCircle,
  ArrowRight,
  Phone,
  Mail,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/dashboard');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Error al cargar dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-zinc-200 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-zinc-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const metrics = [
    {
      label: 'Stock Disponible',
      value: `${data?.stockDisponible || 0} / ${data?.totalVehiculos || 0}`,
      desc: 'Unidades en exhibición',
      icon: Car,
    },
    {
      label: 'Ventas Cerradas',
      value: data?.totalVentas || 0,
      desc: 'Operaciones exitosas',
      icon: ShoppingBag,
    },
    {
      label: 'Facturación Total',
      value: `USD $${(data?.totalFacturacion || 0).toLocaleString()}`,
      desc: 'Volumen comercial total',
      icon: DollarSign,
    },
    {
      label: 'Consultas/Leads',
      value: data?.totalConsultas || 0,
      desc: 'Mensajes web recibidos',
      icon: MessageSquare,
    },
    {
      label: 'Ticket Promedio',
      value: `USD $${Math.round(data?.ticketPromedio || 0).toLocaleString()}`,
      desc: 'Promedio por venta',
      icon: TrendingUp,
    },
    {
      label: 'Rotación Media',
      value: `${data?.rotacionStockDias || 0} Días`,
      desc: 'Tiempo medio en salón',
      icon: Clock,
    },
    {
      label: 'Marca Líder',
      value: data?.marcaLider || 'N/A',
      desc: 'Mayor volumen vendido',
      icon: Award,
    },
    {
      label: 'Tasa de Conversión',
      value: `${data?.tasaConversion || 0}%`,
      desc: 'Ratio consultas/ventas',
      icon: Percent,
    },
  ];

  // Helper to format phone for WhatsApp
  const formatWhatsAppUrl = (phone: string, nombreCliente: string, vehiculo?: any) => {
    if (!phone) return '#';
    let digits = phone.replace(/\D/g, '');
    if (digits.startsWith('0')) digits = digits.slice(1);
    if (!digits.startsWith('54') && digits.length >= 10) {
      digits = '549' + digits;
    } else if (digits.startsWith('54') && !digits.startsWith('549') && digits.length === 12) {
      digits = '549' + digits.slice(2);
    }
    const vehiculoTxt = vehiculo ? `${vehiculo.marca} ${vehiculo.modelo}` : 'el vehículo publicado';
    const text = `Hola ${nombreCliente}, te contactamos desde MotorHub Concesionaria en respuesta a tu consulta sobre ${vehiculoTxt}. ¿En qué podemos ayudarte?`;
    return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
  };

  // Helper to format mailto link
  const formatMailtoUrl = (email: string, nombreCliente: string, mensaje: string, vehiculo?: any) => {
    if (!email) return '#';
    const vehiculoTxt = vehiculo ? `${vehiculo.marca} ${vehiculo.modelo}` : 'tu vehículo de interés';
    const subject = `MotorHub Concesionaria - Respuesta a tu consulta sobre ${vehiculoTxt}`;
    const body = `Hola ${nombreCliente},\n\nGracias por comunicarte con MotorHub. Te escribimos en respuesta a tu consulta sobre ${vehiculoTxt}.\n\nTu consulta: "${mensaje}"\n\nQuedamos a tu entera disposición para resolver cualquier duda o coordinar una visita a nuestra sucursal.\n\nSaludos cordiales,\nEquipo Comercial MotorHub\nTel / WhatsApp: +54 9 11 5263-8000\nEmail: consultas@motorhub.com.ar`;
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600 block mb-1">
            Panel Ejecutivo
          </span>
          <h1 className="text-3xl font-extrabold text-black font-['Outfit']">
            Dashboard Comercial
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/panel/cargar-vehiculo"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-950 bg-emerald-400 hover:bg-emerald-300 shadow-sm shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Cargar Vehículo
          </Link>
          <Link
            href="/panel/ventas/nueva"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-black bg-white hover:bg-zinc-100 border border-zinc-300 shadow-xs transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            Registrar Venta
          </Link>
        </div>
      </div>

      {/* 8 Analytical Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  {m.label}
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-black font-['Outfit'] tracking-tight">
                  {m.value}
                </div>
                <div className="text-xs text-zinc-400 font-medium mt-1">{m.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2 Columns: Recent Stock & Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Vehicles */}
        <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2 font-bold text-black font-['Outfit']">
              <Car className="w-5 h-5 text-zinc-700" />
              <span>Últimos Ingresos al Stock</span>
            </div>
            <Link
              href="/panel/stock"
              className="text-xs font-semibold text-zinc-600 hover:text-black flex items-center gap-1"
            >
              <span>Ver Todo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {data?.ultimosVehiculos?.length === 0 ? (
              <p className="text-xs text-zinc-400 py-4 text-center">No hay vehículos registrados.</p>
            ) : (
              data?.ultimosVehiculos?.map((v: any) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100 hover:bg-zinc-100/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={v.imagenesUrls?.[0] || 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=200&q=80'}
                      alt={v.modelo}
                      className="w-12 h-10 rounded-lg object-cover bg-zinc-200"
                    />
                    <div>
                      <div className="text-xs font-bold text-black">
                        {v.marca} {v.modelo} {v.version}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-medium">
                        {v.anio} • {v.tipoVehiculo}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-black font-['Outfit']">
                      USD ${v.precio?.toLocaleString()}
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                        v.estado === 'DISPONIBLE'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-zinc-200 text-zinc-700'
                      }`}
                    >
                      {v.estado}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2 font-bold text-black font-['Outfit']">
              <MessageSquare className="w-5 h-5 text-zinc-700" />
              <span>Últimas Consultas Recibidas</span>
            </div>
          </div>

          <div className="space-y-3">
            {data?.ultimasConsultas?.length === 0 ? (
              <p className="text-xs text-zinc-400 py-4 text-center">No hay consultas registradas aún.</p>
            ) : (
              data?.ultimasConsultas?.map((c: any) => {
                const waUrl = formatWhatsAppUrl(c.telefonoCliente, c.nombreCliente, c.vehiculo);
                const mailUrl = formatMailtoUrl(c.emailCliente, c.nombreCliente, c.mensaje, c.vehiculo);

                return (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-black">{c.nombreCliente}</span>
                      <span className="text-[10px] text-zinc-400">
                        {new Date(c.fechaConsulta).toLocaleDateString()}
                      </span>
                    </div>

                    {c.vehiculo && (
                      <div className="text-[11px] font-medium text-black bg-zinc-200/80 px-2.5 py-0.5 rounded-md inline-block">
                        Interés: <span className="font-bold">{c.vehiculo.marca} {c.vehiculo.modelo}</span>
                      </div>
                    )}

                    <p className="text-xs text-zinc-600 line-clamp-3 italic bg-white p-2.5 rounded-lg border border-zinc-100">
                      &ldquo;{c.mensaje}&rdquo;
                    </p>

                    {/* Action links: Direct WhatsApp and Direct Email */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-200">
                      {c.telefonoCliente && (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Abrir chat de WhatsApp con mensaje pre-cargado"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer group"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                          <span>WhatsApp: {c.telefonoCliente}</span>
                          <ExternalLink className="w-3 h-3 text-emerald-500 opacity-70" />
                        </a>
                      )}

                      {c.emailCliente && (
                        <a
                          href={mailUrl}
                          title="Enviar correo de respuesta pre-cargado"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-zinc-800 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 transition-colors cursor-pointer group"
                        >
                          <Mail className="w-3.5 h-3.5 text-zinc-600 group-hover:scale-110 transition-transform" />
                          <span>Email: {c.emailCliente}</span>
                          <ExternalLink className="w-3 h-3 text-zinc-400 opacity-70" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Audit Movements Widget (DUENO only) */}
      {data?.ultimasAuditorias && data.ultimasAuditorias.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2 font-bold text-black font-['Outfit']">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Actividad y Auditoría Reciente del Sistema</span>
            </div>
            <Link
              href="/panel/auditoria"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Ver Auditoría Completa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.ultimasAuditorias.map((aud: any) => (
              <div
                key={aud.id}
                className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900">{aud.nombreUsuario}</span>
                  <span className="text-[10px] text-zinc-400">
                    {new Date(aud.fecha).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-zinc-200/80 text-zinc-800">
                    {aud.accion.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] font-semibold text-zinc-500">{aud.entidad}</span>
                </div>
                <p className="text-[11px] text-zinc-700 line-clamp-2">
                  {aud.detalles}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
