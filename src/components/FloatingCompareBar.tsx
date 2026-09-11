'use client';

import React from 'react';
import Link from 'next/link';
import { useCompare } from '@/context/CompareContext';
import { Scale, X, ArrowRight } from 'lucide-react';

export default function FloatingCompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-zinc-900/95 backdrop-blur-md text-white border border-zinc-700 shadow-2xl rounded-2xl px-5 py-3.5 flex items-center gap-4 max-w-[95vw] sm:max-w-2xl animate-fade-in print:hidden">
      <div className="flex items-center gap-2 border-r border-zinc-700 pr-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
          <Scale className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-bold block font-['Outfit']">Comparador</span>
          <span className="text-[10px] text-zinc-400">{compareList.length} de 3 seleccionados</span>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto py-1">
        {compareList.map((v) => (
          <div
            key={v.id}
            className="flex items-center gap-2 bg-zinc-800/90 border border-zinc-700 rounded-xl px-2.5 py-1 text-xs shrink-0"
          >
            <span className="font-semibold text-zinc-200 truncate max-w-[110px]">
              {v.marca} {v.modelo}
            </span>
            <button
              onClick={() => removeFromCompare(v.id)}
              className="text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
              title="Quitar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 pl-2 border-l border-zinc-700">
        <Link
          href="/comparador"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-500/20 shrink-0"
        >
          <span>Comparar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <button
          onClick={clearCompare}
          className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          title="Limpiar lista"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
