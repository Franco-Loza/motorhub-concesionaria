'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Car,
  ShoppingBag,
  Users,
  Building2,
  LogOut,
  Menu,
  X,
  User,
  ArrowUpRight,
  ShieldCheck,
  MessageSquare,
  Zap,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Cargar usuario activo
    const fetchMe = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        } else {
          router.push('/ingreso');
        }
      } catch {
        router.push('/ingreso');
      }
    };
    fetchMe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('auth_user');
      router.push('/ingreso');
      router.refresh();
    } catch {
      router.push('/ingreso');
    }
  };

  const isDueno = currentUser?.rol === 'DUENO';

  const navItems = [
    { name: 'Dashboard Analítico', href: '/panel/inicio', icon: LayoutDashboard, duenoOnly: false },
    { name: 'Consultas y Solicitudes', href: '/panel/consultas', icon: MessageSquare, duenoOnly: false },
    { name: 'Gestión de Stock', href: '/panel/stock', icon: Car, duenoOnly: false },
    { name: 'Mercado Libre', href: '/panel/mercadolibre', icon: Zap, duenoOnly: false },
    { name: 'Gestión de Ventas', href: '/panel/ventas', icon: ShoppingBag, duenoOnly: false },
    { name: 'Gestión de Empleados', href: '/panel/empleados', icon: Users, duenoOnly: true },
    { name: 'Gestión de Sucursales', href: '/panel/sucursales', icon: Building2, duenoOnly: true },
    { name: 'Auditoría y Trazabilidad', href: '/panel/auditoria', icon: ShieldCheck, duenoOnly: true },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-white border-b border-zinc-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link href="/panel/inicio" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="MotorHUB Logo"
            className="w-8 h-8 rounded-lg object-cover border border-zinc-800"
          />
          <span className="font-bold text-black font-['Outfit'] text-sm">
            MOTOR<span className="text-emerald-600 font-extrabold">HUB</span>
          </span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-zinc-600 hover:bg-zinc-100"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-white border-r border-zinc-200 flex flex-col justify-between p-6 transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <Link href="/panel/inicio" className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="MotorHUB Logo"
                className="w-10 h-10 rounded-xl object-cover border border-zinc-800 shadow-xs"
              />
              <div>
                <span className="font-bold text-black font-['Outfit'] text-base tracking-tight block">
                  MOTOR<span className="text-emerald-500 font-black">HUB</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-widest text-zinc-400 block -mt-1">
                  Panel de Control
                </span>
              </div>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card */}
          {currentUser && (
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-emerald-600 font-bold shadow-xs">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-black truncate">
                  {currentUser.nombreCompleto}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      isDueno ? 'bg-emerald-500 ring-2 ring-emerald-500/20' : 'bg-zinc-400'
                    }`}
                  />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                    {isDueno ? 'ADMINISTRADOR' : 'EMPLEADO'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              if (item.duenoOnly && !isDueno) return null;
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/panel/inicio' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-black text-white shadow-xs font-bold'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-black'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="space-y-3 pt-6 border-t border-zinc-100">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors"
          >
            <span>Ver Tienda Pública</span>
            <ArrowUpRight className="w-4 h-4 text-zinc-400" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-zinc-700 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 w-full min-w-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
