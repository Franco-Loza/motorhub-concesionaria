import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import { MapPin, Phone, MessageSquare, Clock, Mail, Building2, Navigation } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getSucursales() {
  try {
    const sucursales = await prisma.sucursal.findMany({
      where: { activa: true },
      orderBy: [{ esCasaCentral: 'desc' }, { fechaCreacion: 'asc' }],
    });
    // Fallback si no hay activas marcadas
    if (sucursales.length === 0) {
      return await prisma.sucursal.findMany({
        orderBy: [{ esCasaCentral: 'desc' }, { fechaCreacion: 'asc' }],
      });
    }
    return sucursales;
  } catch (error) {
    console.error('Error fetching sucursales:', error);
    return [];
  }
}

export default async function SucursalesPage() {
  const sucursales = await getSucursales();

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900">
      <Navbar />

      {/* Header */}
      <div className="border-b border-zinc-200 py-16 bg-white relative overflow-hidden">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 text-center space-y-4 relative z-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600 block">
            Puntos de Atención Oficial
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 font-['Outfit']">
            Nuestros Showrooms y Sedes
          </h1>
          <p className="text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Te invitamos a visitar nuestras modernas instalaciones para conocer de cerca toda nuestra flota y recibir asesoramiento personalizado.
          </p>
        </div>
      </div>

      {/* Branches List */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-16 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {sucursales.map((sucursal) => {
            const direccionCompleta = [
              sucursal.calle && sucursal.numero ? `${sucursal.calle} ${sucursal.numero}` : sucursal.calle,
              sucursal.pisoDepto ? `(${sucursal.pisoDepto})` : null,
              sucursal.ciudad,
              sucursal.provincia,
              sucursal.codigoPostal ? `CP ${sucursal.codigoPostal}` : null,
              'Argentina',
            ]
              .filter(Boolean)
              .join(', ');

            const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccionCompleta || sucursal.nombre)}`;
            // Con iwloc= sin valor evitamos que Google Maps dibuje la burbuja blanca invasiva sobre el mapa
            const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(direccionCompleta || sucursal.nombre)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
            const whatsappNum = sucursal.whatsapp?.replace(/\D/g, '') || '5491152638000';
            const emailAddr = sucursal.email || 'contacto@motorhub.com';

            return (
              <div
                key={sucursal.id}
                className="bg-white rounded-3xl overflow-hidden border border-zinc-200 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Google Maps Interactive Embed Frame */}
                <div className="relative h-64 sm:h-72 w-full bg-zinc-100 border-b border-zinc-200 overflow-hidden select-none">
                  <iframe
                    title={`Mapa de ${sucursal.nombre}`}
                    src={googleMapsEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute -top-24 left-0 w-full h-[calc(100%+96px)] pointer-events-auto"
                  />
                </div>

                {/* Details Content */}
                <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-emerald-500/30 text-emerald-600 flex items-center justify-center font-bold shadow-xs">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <h3 className="text-2xl font-bold text-zinc-900 font-['Outfit']">
                          {sucursal.nombre}
                        </h3>
                      </div>
                      {sucursal.esCasaCentral ? (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-xs">
                          Casa Central
                        </span>
                      ) : (
                        <span className="bg-zinc-100 text-zinc-700 border border-zinc-200 text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-xs">
                          Sucursal
                        </span>
                      )}
                    </div>

                    <ul className="space-y-3 text-sm text-zinc-700">
                      <li className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                        <span className="font-medium text-zinc-900">
                          {direccionCompleta}
                        </span>
                      </li>
                      {sucursal.horarios && (
                        <li className="flex items-start gap-3">
                          <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                          <span>{sucursal.horarios}</span>
                        </li>
                      )}
                      {sucursal.telefono && (
                        <li className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Tel: {sucursal.telefono}</span>
                        </li>
                      )}
                      {sucursal.whatsapp && (
                        <li className="flex items-center gap-3">
                          <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>WhatsApp: {sucursal.whatsapp}</span>
                        </li>
                      )}
                      {sucursal.email && (
                        <li className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                          <a href={`mailto:${emailAddr}`} className="text-emerald-600 hover:underline font-medium">
                            {emailAddr}
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Actions Bar (WhatsApp & Google Maps Navigation) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-zinc-100">
                    <a
                      href={`https://wa.me/${whatsappNum}?text=Hola,%20quisiera%20hacer%20una%20consulta%20para%20la%20sucursal%20${encodeURIComponent(sucursal.nombre)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] shadow-xs transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>WhatsApp Oficial</span>
                    </a>

                    <a
                      href={googleMapsSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 hover:border-zinc-300 transition-all cursor-pointer"
                    >
                      <Navigation className="w-4 h-4 text-emerald-600" />
                      <span>Cómo Llegar</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}
