'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Building2,
  Navigation,
  ShieldCheck,
  Headphones,
  Car,
} from 'lucide-react';

export default function ContactoPage() {
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [motivo, setMotivo] = useState('Consulta por Unidad en Stock');
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(true);

  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  // FAQ Accordion State
  const [faqAbierta, setFaqAbierta] = useState<number | null>(null);

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const res = await fetch('/api/sucursales');
        if (res.ok) {
          const data = await res.json();
          setSucursales(data);
          if (data.length > 0) {
            setSucursalSeleccionada(data[0].nombre);
          }
        }
      } catch (err) {
        console.error('Error al cargar sucursales:', err);
      }
    };
    fetchSucursales();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nombre || !mensaje || !telefono) {
      setError('Por favor completá los campos obligatorios (*).');
      return;
    }

    setEnviando(true);

    try {
      const mensajeCompleto = `[Motivo: ${motivo}] [Sucursal de Preferencia: ${sucursalSeleccionada || 'No especificada'}]\n\n${mensaje}`;

      const res = await fetch('/api/consultas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombreCliente: nombre,
          emailCliente: email,
          telefonoCliente: telefono,
          mensaje: mensajeCompleto,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setEnviado(true);
        setNombre('');
        setEmail('');
        setTelefono('');
        setMensaje('');
      } else {
        setError(data.error || 'Ocurrió un error al enviar el mensaje.');
      }
    } catch (err) {
      setError('Error de comunicación con el servidor. Intentá nuevamente.');
    } finally {
      setEnviando(false);
    }
  };

  const faqs = [
    {
      pregunta: '¿Cómo funciona la toma de vehículos usados o permutas?',
      respuesta:
        'Aceptamos vehículos, utilitarios y embarcaciones como parte de pago. Realizamos una tasación profesional y transparente en base al valor real de mercado tras peritar el estado mecánico y documental de tu unidad.',
    },
    {
      pregunta: '¿Cuáles son los requisitos para acceder a la financiación prendaria?',
      respuesta:
        'Solo necesitás DNI, comprobante de ingresos (recibo de sueldo o monotributo) y un servicio a tu nombre. Ofrecemos aprobación crediticia en 24 horas con tasas fijas preferenciales en pesos o dólares.',
    },
    {
      pregunta: '¿Hacen entregas y traslados a cualquier punto del país?',
      respuesta:
        'Sí, disponemos de logística propia y transporte asegurado para entregar tu unidad directamente en tu domicilio o en cualquiera de nuestros showrooms oficiales en Argentina.',
    },
    {
      pregunta: '¿Cómo puedo coordinar una visita o prueba de manejo (Test Drive)?',
      respuesta:
        'Podés agendarla a través de nuestro formulario de contacto seleccionando el motivo "Prueba de Manejo", o bien escribiéndonos directamente al WhatsApp oficial de la sucursal de tu interés.',
    },
    {
      pregunta: '¿Qué garantía y documentación incluye cada vehículo?',
      respuesta:
        'Todas nuestras unidades cuentan con peritaje mecánico integral de 150 puntos, verificación de dominio, libre de deudas y gestoría propia para garantizar una transferencia inmediata y segura.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-white border-b border-zinc-200 py-16 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 text-center space-y-4 relative z-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600 block">
            Canales de Atención Directa
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 font-['Outfit']">
            Contactate con MotorHub
          </h1>
          <p className="text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Estamos para asesorarte en la compra, venta o financiación de tu próximo vehículo. Escribinos y un ejecutivo comercial se comunicará a la brevedad.
          </p>
        </div>
      </section>

      {/* Direct Contact Cards */}
      <section className="py-12 bg-white border-b border-zinc-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* WhatsApp */}
            <a
              href="https://wa.me/5491152638000?text=Hola,%20quisiera%20hacer%20una%20consulta%20general%20a%20MotorHub"
              target="_blank"
              rel="noreferrer"
              className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-emerald-500 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 font-['Outfit'] group-hover:text-emerald-700 transition-colors">
                  WhatsApp Oficial
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Chateá al instante con nuestro equipo de ventas y recibí fotos y cotizaciones.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-600 mt-4 block">
                +54 9 11 5263-8000 →
              </span>
            </a>

            {/* Teléfono */}
            <a
              href="tel:+5491152638000"
              className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-emerald-500 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 font-['Outfit'] group-hover:text-emerald-700 transition-colors">
                  Llamada Telefónica
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Llamanos para recibir asesoramiento personalizado de lunes a sábados.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-600 mt-4 block">
                (011) 5263-8000 →
              </span>
            </a>

            {/* Email */}
            <a
              href="mailto:contacto@motorhub.com"
              className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-emerald-500 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 font-['Outfit'] group-hover:text-emerald-700 transition-colors">
                  Correo Electrónico
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Envianos documentación, consultas comerciales o propuestas por escrito.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-600 mt-4 block">
                contacto@motorhub.com →
              </span>
            </a>

            {/* Horarios */}
            <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 font-['Outfit']">
                  Horarios de Atención
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Lun a Vie: 09:00 a 19:00 hs<br />
                  Sábados: 09:00 a 13:00 hs
                </p>
              </div>
              <span className="text-xs font-bold text-zinc-500 mt-4 block">
                Respuesta en menos de 2 hs
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Form & Info Section */}
      <section className="py-16 flex-1">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Form */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-zinc-200 shadow-xs space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600 block mb-1">
                  Formulario Oficial
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 font-['Outfit']">
                  Envianos tu Consulta
                </h2>
                <p className="text-sm text-zinc-600 mt-1">
                  Completá los datos y un asesor se pondrá en contacto con vos a la brevedad.
                </p>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {enviado ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-emerald-900 font-['Outfit']">
                      ¡Consulta Recibida con Éxito!
                    </h3>
                    <p className="text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                      Muchas gracias por comunicarte. Hemos asignado tu solicitud a un ejecutivo comercial de nuestra sede, quien te responderá a la brevedad.
                    </p>
                  </div>
                  <button
                    onClick={() => setEnviado(false)}
                    className="mt-4 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                  >
                    Enviar Otra Consulta
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block mb-1.5">
                        Nombre y Apellido *
                      </label>
                      <input
                        type="text"
                        required
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej. Juan Pérez"
                        className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block mb-1.5">
                        Teléfono/WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder="Ej. +54 9 11 1234-5678"
                        className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block mb-1.5">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ej. juan@correo.com"
                        className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block mb-1.5">
                        Motivo de Consulta
                      </label>
                      <select
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium cursor-pointer"
                      >
                        <option value="Consulta por Unidad en Stock">Consulta por Unidad en Stock</option>
                        <option value="Quiero Vender/Entregar en Permuta">Quiero Vender/Entregar en Permuta</option>
                        <option value="Financiación Prendaria y Tasas">Financiación Prendaria y Tasas</option>
                        <option value="Prueba de Manejo (Test Drive)">Prueba de Manejo (Test Drive)</option>
                        <option value="Asesoramiento Náutico/Embarcaciones">Asesoramiento Náutico/Embarcaciones</option>
                        <option value="Atención Post-Venta y Gestoría">Atención Post-Venta y Gestoría</option>
                        <option value="Contacto Comercial/Proveedores">Contacto Comercial/Proveedores</option>
                      </select>
                    </div>
                  </div>

                  {sucursales.length > 0 && (
                    <div>
                      <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block mb-1.5">
                        Sucursal de Preferencia
                      </label>
                      <select
                        value={sucursalSeleccionada}
                        onChange={(e) => setSucursalSeleccionada(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium cursor-pointer"
                      >
                        {sucursales.map((s) => (
                          <option key={s.id} value={s.nombre}>
                            {s.nombre} {s.esCasaCentral ? '(Casa Central)' : ''} - {s.ciudad || 'Santa Fe'}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block mb-1.5">
                      Tu Mensaje o Detalle de la Unidad *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={mensaje}
                      onChange={(e) => setMensaje(e.target.value)}
                      placeholder="Escribí aquí tus dudas, vehículo de interés o características de tu unidad usada para cotizar..."
                      className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-emerald-500 focus:bg-white resize-none font-medium"
                    />
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="terminos"
                      checked={aceptaTerminos}
                      onChange={(e) => setAceptaTerminos(e.target.checked)}
                      className="mt-1 accent-emerald-600 rounded cursor-pointer"
                    />
                    <label htmlFor="terminos" className="text-xs text-zinc-600 cursor-pointer">
                      Acepto ser contactado por los asesores oficiales de MotorHub vía WhatsApp o correo electrónico.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={enviando || !aceptaTerminos}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-emerald-500/20"
                  >
                    <Send className="w-4 h-4" />
                    {enviando ? 'Enviando Consulta...' : 'Enviar Mensaje Directo'}
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: Values & Assurance */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-xs space-y-6">
                <h3 className="text-xl font-bold text-zinc-900 font-['Outfit']">
                  ¿Por qué contactar a MotorHub?
                </h3>
                <ul className="space-y-4 text-sm text-zinc-700">
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-zinc-900 block">Asesoramiento Especializado</span>
                      <span>Ejecutivos comerciales capacitados en cada segmento (autos, camiones, náutica y motorhomes).</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Headphones className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-zinc-900 block">Atención Rápida y Transparente</span>
                      <span>Respuesta personalizada en minutos sin intermediarios ni demoras burocráticas.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Car className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-zinc-900 block">Cotización Justa de tu Usado</span>
                      <span>Tasamos tu vehículo de inmediato para que puedas llevarte tu 0 KM o seminuevo seleccionado.</span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Quick Branch Links Card */}
              <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-bold text-zinc-900 font-['Outfit']">
                    Nuestras Sedes y Showrooms
                  </h3>
                </div>
                <p className="text-xs text-zinc-600">
                  Podés conocer nuestras ubicaciones oficiales con mapas interactivos y fotos de cada sede:
                </p>
                <div className="space-y-2 pt-2">
                  {sucursales.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs">
                      <div>
                        <span className="font-bold text-zinc-900 block">{s.nombre}</span>
                        <span className="text-zinc-500">{s.ciudad || 'Santa Fe'} • {s.esCasaCentral ? 'Casa Central' : 'Sucursal'}</span>
                      </div>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.calle ? `${s.calle} ${s.numero || ''}, ${s.ciudad || ''}` : s.nombre)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg border border-emerald-200 transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Mapa</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white border-t border-zinc-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600 block">
              Dudas Habituales
            </span>
            <h2 className="text-3xl font-extrabold text-zinc-900 font-['Outfit']">
              Preguntas Frecuentes
            </h2>
            <p className="text-sm text-zinc-600">
              Respuestas rápidas a las consultas más comunes de nuestros clientes.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const estaAbierta = faqAbierta === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setFaqAbierta(estaAbierta ? null : idx)}
                    className="w-full p-5 flex items-center justify-between text-left gap-4 cursor-pointer hover:bg-zinc-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-sm sm:text-base font-bold text-zinc-900">
                        {faq.pregunta}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-zinc-400 shrink-0 transition-transform duration-200 ${
                        estaAbierta ? 'rotate-180 text-emerald-600' : ''
                      }`}
                    />
                  </button>
                  {estaAbierta && (
                    <div className="px-5 pb-5 pt-1 text-sm text-zinc-600 border-t border-zinc-200/60 leading-relaxed bg-white">
                      {faq.respuesta}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
