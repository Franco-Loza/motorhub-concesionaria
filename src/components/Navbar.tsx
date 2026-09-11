'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import DollarTicker from '@/components/DollarTicker';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: 'Inicio', href: '/' },
    { name: 'Catálogo', href: '/catalogo' },
    { name: 'Tasá tu Usado', href: '/tasa-tu-usado' },
    { name: 'Comparador', href: '/comparador' },
    { name: 'Sucursales', href: '/sucursales' },
    { name: 'Quiénes Somos', href: '/quienes-somos' },
    { name: 'Contacto', href: '/contacto' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-xs print:hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <img
              src="/logo.png"
              alt="MotorHUB Logo"
              className="w-10 h-10 rounded-xl object-cover border border-zinc-900 shadow-xs group-hover:scale-105 transition-all duration-300"
            />
            <div>
              <span className="text-xl font-bold tracking-tight text-zinc-900 block font-['Outfit']">
                MOTOR<span className="text-emerald-600 font-extrabold">HUB</span>
              </span>
              <span className="text-[10px] tracking-widest text-zinc-500 font-semibold uppercase block -mt-1">
                Flota Seleccionada
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Dollar Widget */}
          <div className="hidden md:flex items-center gap-3">
            <DollarTicker />
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-950 bg-emerald-400 hover:bg-emerald-300 transition-all duration-200 shadow-xs hover:scale-[1.02] active:scale-95 cursor-pointer shrink-0"
            >
              Ver Inventario
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 focus:outline-none cursor-pointer"
              aria-label="Abrir menú"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-zinc-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-lg">
          <div className="space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-base font-medium ${
                    isActive
                      ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 font-semibold'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
          <div className="pt-3 border-t border-zinc-200 space-y-2">
            <Link
              href="/catalogo"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-950 bg-emerald-400 hover:bg-emerald-300 shadow-xs"
            >
              Ver Inventario Completo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
