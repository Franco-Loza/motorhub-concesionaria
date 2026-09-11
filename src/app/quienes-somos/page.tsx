import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Award, ShieldCheck, Users } from 'lucide-react';

export default function QuienesSomosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900">
      <Navbar />

      {/* Header */}
      <div className="border-b border-zinc-200 py-16 bg-white relative overflow-hidden">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 text-center space-y-4 relative z-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600 block">
            Nuestra Trayectoria
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 font-['Outfit']">
            Excelencia y Confianza en Movilidad
          </h1>
          <p className="text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Más de 15 años brindando asesoramiento personalizado en la compra y venta de unidades seleccionadas, utilitarios, motocicletas, embarcaciones y motorhomes.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-16 flex-1 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-zinc-200 hover:border-emerald-500/40 shadow-xs hover:shadow-md space-y-4 text-center transition-all">
            <div className="w-14 h-14 rounded-2xl bg-zinc-50 text-emerald-600 border border-zinc-200 flex items-center justify-center mx-auto shadow-xs">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 font-['Outfit']">Calidad Certificada</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Seleccionamos meticulosamente cada vehículo de nuestro inventario, asegurando procedencia comprobable, servicios oficiales y peritaje mecánico integral de 150 puntos.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-zinc-200 hover:border-emerald-500/40 shadow-xs hover:shadow-md space-y-4 text-center transition-all">
            <div className="w-14 h-14 rounded-2xl bg-zinc-50 text-emerald-600 border border-zinc-200 flex items-center justify-center mx-auto shadow-xs">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 font-['Outfit']">Seguridad Jurídica</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Gestoría integral propia para agilizar trámites de patentamiento, transferencias, cancelaciones de prendas y verificación de dominio en tiempo récord.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-zinc-200 hover:border-emerald-500/40 shadow-xs hover:shadow-md space-y-4 text-center transition-all">
            <div className="w-14 h-14 rounded-2xl bg-zinc-50 text-emerald-600 border border-zinc-200 flex items-center justify-center mx-auto shadow-xs">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 font-['Outfit']">Atención a Medida</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Nuestro equipo de ejecutivos comerciales te acompaña en todo el proceso de selección, pruebas de manejo y planes de financiación personalizada.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
