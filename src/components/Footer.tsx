'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Car, MapPin, Phone, Mail, Clock, ArrowUpRight, Building2 } from 'lucide-react';

export default function Footer() {
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [fadeAnim, setFadeAnim] = useState(true);

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const res = await fetch('/api/sucursales');
        if (res.ok) {
          const data = await res.json();
          const activas = data.filter((s: any) => s.activa);
          if (activas.length > 0) {
            setSucursales(activas);
          }
        }
      } catch (err) {
        console.error('Error al cargar sucursales en Footer:', err);
      }
    };
    fetchSucursales();
  }, []);

  // Rotación automática cada 5 segundos
  useEffect(() => {
    if (sucursales.length <= 1) return;

    const interval = setInterval(() => {
      setFadeAnim(false);
      setTimeout(() => {
        setIndiceActual((prev) => (prev + 1) % sucursales.length);
        setFadeAnim(true);
      }, 250);
    }, 5000);

    return () => clearInterval(interval);
  }, [sucursales]);

  const sucursalActiva = sucursales[indiceActual] || {
    nombre: 'Showroom Central Reconquista',
    esCasaCentral: true,
    calle: '67',
    numero: '585',
    pisoDepto: '',
    ciudad: 'Reconquista',
    provincia: 'Santa Fe',
    codigoPostal: '',
    telefono: '+54 9 11 5263-8000',
    whatsapp: '5491152638000',
    email: 'consultas@motorhub.com.ar',
    horarios: 'Lun a Vie 09:00 - 19:00',
  };

  const direccionFormateada = [
    sucursalActiva.calle && sucursalActiva.numero ? `${sucursalActiva.calle} ${sucursalActiva.numero}` : sucursalActiva.calle,
    sucursalActiva.pisoDepto ? `(${sucursalActiva.pisoDepto})` : null,
    sucursalActiva.ciudad,
    sucursalActiva.provincia,
    sucursalActiva.codigoPostal ? `CP ${sucursalActiva.codigoPostal}` : null,
  ]
    .filter(Boolean)
    .join(', ');

  const telHref = sucursalActiva.whatsapp
    ? `https://wa.me/${sucursalActiva.whatsapp.replace(/\D/g, '')}`
    : `https://wa.me/5491152638000`;

  const emailHref = sucursalActiva.email || 'consultas@motorhub.com.ar';

  return (
    <footer className="bg-white text-zinc-600 border-t border-zinc-200 pt-16 pb-12 print:hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand Info & Socials */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="MotorHUB Logo"
                className="w-10 h-10 rounded-xl object-cover border border-zinc-900 shadow-xs"
              />
              <span className="text-xl font-bold tracking-tight text-zinc-900 font-['Outfit']">
                MOTOR<span className="text-emerald-600 font-extrabold">HUB</span>
              </span>
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed">
              MotorHub es referente en comercialización de vehículos seleccionados, utilitarios, motocicletas, embarcaciones y motorhomes con peritaje y garantía oficial.
            </p>

            {/* Redes Sociales y Canales de Contacto */}
            <div className="pt-1 flex items-center gap-2">
              <a
                href={`mailto:${emailHref}`}
                className="w-9 h-9 rounded-xl bg-zinc-100 hover:bg-emerald-50 hover:text-emerald-600 text-zinc-600 flex items-center justify-center transition-all border border-zinc-200/80 hover:border-emerald-200 shadow-xs hover:scale-105"
                title="Correo Electrónico"
                aria-label="Correo Electrónico"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-100 hover:bg-pink-50 hover:text-pink-600 text-zinc-600 flex items-center justify-center transition-all border border-zinc-200/80 hover:border-pink-200 shadow-xs hover:scale-105"
                title="Instagram"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href={telHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-100 hover:bg-emerald-50 hover:text-emerald-600 text-zinc-600 flex items-center justify-center transition-all border border-zinc-200/80 hover:border-emerald-200 shadow-xs hover:scale-105"
                title="WhatsApp"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.97.53 1.871.849 2.796.849 3.183 0 5.769-2.587 5.769-5.766.001-3.182-2.585-5.635-5.769-5.635zm3.393 8.163c-.144.405-.837.774-1.17.823-.312.045-.687.07-2.146-.532-1.868-.771-3.08-2.67-3.173-2.793-.093-.123-.755-1.004-.755-1.916s.478-1.362.648-1.547c.17-.184.37-.231.493-.231.124 0 .248.001.356.006.113.006.265-.043.414.316.154.372.525 1.28.571 1.373.047.093.078.201.016.324-.062.123-.093.2-.185.308-.093.108-.195.241-.279.324-.093.093-.19.194-.082.38.108.185.481.794 1.033 1.285.711.633 1.31.83 1.495.923.185.092.293.077.401-.047.108-.124.463-.54.586-.725.124-.185.247-.154.416-.092.17.062 1.08.51 1.265.602.185.093.308.139.354.216.047.078.047.449-.097.854z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-100 hover:bg-blue-50 hover:text-blue-600 text-zinc-600 flex items-center justify-center transition-all border border-zinc-200/80 hover:border-blue-200 shadow-xs hover:scale-105"
                title="Facebook"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.82 0-1.666.28-1.928.706-.214.348-.27.892-.27 1.884v1.394h4.21l-.547 3.667h-3.663v7.98h-4.876z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-4 font-['Outfit']">
              Navegación
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link href="/catalogo" className="hover:text-emerald-600 transition-colors flex items-center gap-1 group">
                  <span>Catálogo de Unidades</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600" />
                </Link>
              </li>
              <li>
                <Link href="/sucursales" className="hover:text-emerald-600 transition-colors flex items-center gap-1 group">
                  <span>Nuestras Sucursales</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600" />
                </Link>
              </li>
              <li>
                <Link href="/quienes-somos" className="hover:text-emerald-600 transition-colors flex items-center gap-1 group">
                  <span>Quiénes Somos</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600" />
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-emerald-600 transition-colors flex items-center gap-1 group">
                  <span>Contacto Directo</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-4 font-['Outfit']">
              Categorías
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link href="/catalogo?tipo=AUTOMOVIL" className="hover:text-emerald-600 transition-colors">
                  Automóviles y Sedán
                </Link>
              </li>
              <li>
                <Link href="/catalogo?tipo=CAMION" className="hover:text-emerald-600 transition-colors">
                  Camiones y Utilitarios
                </Link>
              </li>
              <li>
                <Link href="/catalogo?tipo=EMBARCACION" className="hover:text-emerald-600 transition-colors">
                  Embarcaciones y Lanchas
                </Link>
              </li>
              <li>
                <Link href="/catalogo?tipo=MOTOCICLETA" className="hover:text-emerald-600 transition-colors">
                  Motos Deportivas y Touring
                </Link>
              </li>
              <li>
                <Link href="/catalogo?tipo=MOTORHOME" className="hover:text-emerald-600 transition-colors">
                  Motorhomes y Casas Rodantes
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Dynamic Rotating Sucursal every 5s */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <h4 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider font-['Outfit'] truncate">
                  {sucursalActiva.esCasaCentral ? 'Casa Central' : sucursalActiva.nombre}
                </h4>
              </div>
              {sucursales.length > 1 && (
                <div className="flex items-center gap-1 shrink-0">
                  {sucursales.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndiceActual(i)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        i === indiceActual ? 'w-4 bg-emerald-500' : 'w-1.5 bg-zinc-300 hover:bg-zinc-400'
                      }`}
                      aria-label={`Ver sucursal ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div
              className={`p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3 text-sm transition-opacity duration-300 ${
                fadeAnim ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">
                {sucursalActiva.nombre}
              </div>

              <ul className="space-y-2.5 text-xs text-zinc-700 font-medium">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{direccionFormateada}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <a href={telHref} target="_blank" rel="noreferrer" className="hover:text-emerald-600 transition-colors">
                    {sucursalActiva.telefono || sucursalActiva.whatsapp || '+54 9 11 5263-8000'}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <a href={`mailto:${emailHref}`} className="hover:text-emerald-600 transition-colors">
                    {emailHref}
                  </a>
                </li>
                {sucursalActiva.horarios && (
                  <li className="flex items-start gap-2.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{sucursalActiva.horarios}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 text-center sm:text-left">
            <span>© {new Date().getFullYear()} MotorHub Flota Seleccionada. Todos los derechos reservados.</span>
            <span className="hidden sm:inline text-zinc-300">•</span>
            <span className="font-medium text-zinc-600">
              Desarrollado por{' '}
              <a
                href="https://portfolio-francoloza.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline transition-colors"
              >
                Franco Loza
              </a>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pr-0 md:pr-16">
            <Link href="/quienes-somos" className="hover:text-emerald-600 transition-colors font-medium">Términos Comerciales</Link>
            <Link href="/quienes-somos" className="hover:text-emerald-600 transition-colors font-medium">Garantías Oficiales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
