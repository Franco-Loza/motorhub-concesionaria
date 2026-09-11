'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X } from 'lucide-react';

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const [mostrarTooltip, setMostrarTooltip] = useState(true);
  const phoneNumber = '5491152638000';
  const defaultMessage = '¡Hola! Quisiera hacer una consulta sobre los vehículos disponibles en MotorHub.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  // No mostrar el widget en el panel de administración ni en ingreso
  if (pathname?.startsWith('/panel') || pathname?.startsWith('/admin') || pathname === '/login' || pathname === '/ingreso') {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 pointer-events-none print:hidden">
      {/* Tooltip de Bienvenida */}
      {mostrarTooltip && (
        <div className="pointer-events-auto bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700/80 flex items-center gap-3 animate-fade-in mb-1 max-w-xs">
          <div>
            <p className="font-bold text-white">¿Buscás asesoramiento?</p>
            <p className="text-[11px] text-zinc-300 font-normal">Chateá con nosotros al instante por WhatsApp</p>
          </div>
          <button
            onClick={() => setMostrarTooltip(false)}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            aria-label="Cerrar mensaje"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Botón Principal WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="pointer-events-auto group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/30 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
        <MessageCircle className="w-7 h-7 fill-white stroke-none relative z-10" />
      </a>
    </div>
  );
}
