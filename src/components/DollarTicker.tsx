'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, RefreshCw } from 'lucide-react';

interface DolarData {
  oficial: { compra: number; venta: number };
  blue: { compra: number; venta: number };
}

export default function DollarTicker() {
  const [dolar, setDolar] = useState<DolarData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDolar = async () => {
      try {
        const res = await fetch('/api/dolar');
        if (res.ok) {
          const data = await res.json();
          setDolar(data);
        }
      } catch (e) {
        console.error('Error cargando dólar:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchDolar();
    // Actualizar cada 5 minutos
    const interval = setInterval(fetchDolar, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !dolar) {
    return (
      <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] text-zinc-400">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Cotización USD...</span>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-[11px] font-semibold text-zinc-800 shadow-2xs">
      <div className="flex items-center gap-1.5 text-emerald-800">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-bold uppercase tracking-wider text-[10px]">Dólar Hoy:</span>
      </div>
      <div className="flex items-center gap-1 text-zinc-700">
        <span className="text-zinc-500 font-normal">Blue:</span>
        <span className="font-extrabold text-zinc-900 font-mono">${dolar.blue.venta.toLocaleString('es-AR')}</span>
      </div>
      <span className="text-zinc-300">|</span>
      <div className="flex items-center gap-1 text-zinc-700">
        <span className="text-zinc-500 font-normal">Oficial:</span>
        <span className="font-extrabold text-zinc-900 font-mono">${dolar.oficial.venta.toLocaleString('es-AR')}</span>
      </div>
    </div>
  );
}
