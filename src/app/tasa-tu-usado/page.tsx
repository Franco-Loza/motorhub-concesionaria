'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Car,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  Sparkles,
  ShieldCheck,
  Calculator,
  MessageSquare,
  AlertCircle,
  Clock,
  BadgeCheck,
} from 'lucide-react';

export default function TasaTuUsadoPage() {
  const [paso, setPaso] = useState(1);
  const [catalogoVehiculos, setCatalogoVehiculos] = useState<any[]>([]);

  // Datos del Vehículo Usado
  const [tipoVehiculo, setTipoVehiculo] = useState('AUTOMOVIL');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [version, setVersion] = useState('');
  const [anio, setAnio] = useState(2020);
  const [kilometraje, setKilometraje] = useState(50000);
  const [horasUso, setHorasUso] = useState(150);
  const [transmision, setTransmision] = useState('MANUAL');
  const [combustible, setCombustible] = useState('NAFTA');
  const [estadoGeneral, setEstadoGeneral] = useState('EXCELENTE');
  const [comentarios, setComentarios] = useState('');

  // Campos específicos Náutica / Embarcación
  const [marcaMotor, setMarcaMotor] = useState('');
  const [potenciaHp, setPotenciaHp] = useState<number | ''>('');
  const [tipoMotor, setTipoMotor] = useState('FUERA_DE_BORDA');
  const [esloraMetros, setEsloraMetros] = useState<number | ''>('');

  // Campos específicos Motocicletas
  const [cilindradaCc, setCilindradaCc] = useState<number | ''>('');
  const [estiloMoto, setEstiloMoto] = useState('NAKED');

  // Campos específicos Camiones
  const [tipoCarroceriaCamion, setTipoCarroceriaCamion] = useState('CHASIS');
  const [capacidadCargaKg, setCapacidadCargaKg] = useState<number | ''>('');
  const [cantidadEjes, setCantidadEjes] = useState<number | ''>('');

  // Campos específicos Motorhomes
  const [capacidadCamas, setCapacidadCamas] = useState<number | ''>('');
  const [tieneBano, setTieneBano] = useState('SI');

  // Fotos y Unidad de Interés
  const [fotosUrls, setFotosUrls] = useState<string[]>([]);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [vehiculoInteresId, setVehiculoInteresId] = useState<string>('');

  // Datos del Cliente
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [ciudad, setCiudad] = useState('');

  // Estado de Envío
  const [enviando, setEnviando] = useState(false);
  const [enviadoExitoso, setEnviadoExitoso] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Cargar inventario disponible para selección
    fetch('/api/vehiculos?limit=50')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.vehiculos) {
          setCatalogoVehiculos(data.vehiculos);
        }
      })
      .catch(console.error);
  }, []);

  const handleSubirFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setSubiendoFoto(true);
    setErrorMsg('');
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        if (Array.isArray(data.urls) && data.urls.length > 0) {
          setFotosUrls((prev) => [...prev, ...data.urls]);
        } else if (data.url) {
          setFotosUrls((prev) => [...prev, data.url]);
        }
      } else {
        setErrorMsg(data.error || 'Error al subir las fotos.');
      }
    } catch (err) {
      console.error('Error al subir foto:', err);
      setErrorMsg('Error de conexión al subir imágenes.');
    } finally {
      setSubiendoFoto(false);
    }
  };

  const handleEnviarTasacion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !telefono.trim()) {
      setErrorMsg('Por favor completá tu nombre y teléfono celular.');
      return;
    }

    setEnviando(true);
    setErrorMsg('');

    const esEmbarcacion = tipoVehiculo === 'EMBARCACION';
    const esMoto = tipoVehiculo === 'MOTOCICLETA';
    const esCamion = tipoVehiculo === 'CAMION';
    const esMotorhome = tipoVehiculo === 'MOTORHOME';

    const datosUsado = {
      tipoVehiculo,
      marca,
      modelo,
      version,
      anio,
      kilometraje: esEmbarcacion ? null : kilometraje,
      horasUso: esEmbarcacion ? horasUso : null,
      transmision: esEmbarcacion ? null : transmision,
      combustible,
      estadoGeneral,
      comentarios,
      fotosUrls,
      ciudad,
      ...(esEmbarcacion && {
        marcaMotor,
        potenciaHp: potenciaHp ? Number(potenciaHp) : null,
        tipoMotor,
        esloraMetros: esloraMetros ? Number(esloraMetros) : null,
      }),
      ...(esMoto && {
        cilindradaCc: cilindradaCc ? Number(cilindradaCc) : null,
        estiloMoto,
      }),
      ...(esCamion && {
        tipoCarroceriaCamion,
        capacidadCargaKg: capacidadCargaKg ? Number(capacidadCargaKg) : null,
        cantidadEjes: cantidadEjes ? Number(cantidadEjes) : null,
      }),
      ...(esMotorhome && {
        capacidadCamas: capacidadCamas ? Number(capacidadCamas) : null,
        tieneBano: tieneBano === 'SI',
      }),
    };

    let mensajeResumen = '';
    if (esEmbarcacion) {
      mensajeResumen = `Solicitud de Tasación de Embarcación Usada:
• Embarcación: ${marca} ${modelo} ${version} (${anio}) - ${horasUso} hs de uso
• Motorización: ${marcaMotor || 'A especificar'} (${potenciaHp ? potenciaHp + ' HP' : 'HP s/d'}) | Tipo: ${tipoMotor.replace(/_/g, ' ')}
• Combustible: ${combustible} ${esloraMetros ? `| Eslora: ${esloraMetros}m` : ''}
• Estado General: ${estadoGeneral}
• Guardería / Ciudad: ${ciudad || 'No especificada'}
• Fotos adjuntas: ${fotosUrls.length} imagen(es)
${comentarios ? `• Observaciones/Equipamiento: ${comentarios}` : ''}`;
    } else if (esMoto) {
      mensajeResumen = `Solicitud de Tasación de Motocicleta:
• Moto: ${marca} ${modelo} ${version} (${anio}) - ${kilometraje.toLocaleString()} km
• Cilindrada: ${cilindradaCc ? cilindradaCc + ' cc' : 's/d'} | Estilo: ${estiloMoto.replace(/_/g, ' ')}
• Transmisión: ${transmision} | Combustible: ${combustible}
• Estado General: ${estadoGeneral}
• Ciudad / Localidad: ${ciudad || 'No especificada'}
• Fotos adjuntas: ${fotosUrls.length} imagen(es)
${comentarios ? `• Observaciones: ${comentarios}` : ''}`;
    } else if (esCamion) {
      mensajeResumen = `Solicitud de Tasación de Camión / Pesado:
• Unidad: ${marca} ${modelo} ${version} (${anio}) - ${kilometraje.toLocaleString()} km
• Carrocería: ${tipoCarroceriaCamion.replace(/_/g, ' ')} ${cantidadEjes ? `| Ejes: ${cantidadEjes}` : ''} ${capacidadCargaKg ? `| Capacidad Carga: ${capacidadCargaKg.toLocaleString()} kg` : ''}
• Transmisión: ${transmision} | Combustible: ${combustible}
• Estado General: ${estadoGeneral}
• Ciudad / Localidad: ${ciudad || 'No especificada'}
• Fotos adjuntas: ${fotosUrls.length} imagen(es)
${comentarios ? `• Observaciones: ${comentarios}` : ''}`;
    } else if (esMotorhome) {
      mensajeResumen = `Solicitud de Tasación de Motorhome / Casa Rodante:
• Unidad: ${marca} ${modelo} ${version} (${anio}) - ${kilometraje.toLocaleString()} km
• Distribución: ${capacidadCamas ? capacidadCamas + ' Plazas / Camas' : 'Plazas s/d'} | Baño Completo: ${tieneBano}
• Transmisión: ${transmision} | Combustible: ${combustible}
• Estado General: ${estadoGeneral}
• Ciudad / Localidad: ${ciudad || 'No especificada'}
• Fotos adjuntas: ${fotosUrls.length} imagen(es)
${comentarios ? `• Observaciones/Equipamiento: ${comentarios}` : ''}`;
    } else {
      mensajeResumen = `Solicitud de Tasación de Automóvil Usado:
• Unidad: ${marca} ${modelo} ${version} (${anio}) - ${kilometraje.toLocaleString()} km
• Transmisión: ${transmision} | Combustible: ${combustible}
• Estado General: ${estadoGeneral}
• Ciudad / Localidad: ${ciudad || 'No especificada'}
• Fotos adjuntas: ${fotosUrls.length} imagen(es)
${comentarios ? `• Observaciones: ${comentarios}` : ''}`;
    }

    try {
      const res = await fetch('/api/consultas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipoConsulta: 'TASACION',
          nombreCliente: nombre,
          telefonoCliente: telefono,
          emailCliente: email,
          mensaje: mensajeResumen,
          vehiculoId: vehiculoInteresId ? parseInt(vehiculoInteresId) : null,
          datosUsado,
        }),
      });

      if (res.ok) {
        setEnviadoExitoso(true);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Hubo un inconveniente al enviar la solicitud.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error de conexión al enviar la solicitud.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900">
      <Navbar />

      {/* Header */}
      <section className="bg-white border-b border-zinc-200 py-14 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-widest shadow-2xs">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Cotización Personalizada • Tomamos tu Usado</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 font-['Outfit']">
            Tasá tu Vehículo en Parte de Pago
          </h1>
          <p className="text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Completá los datos y subí fotos de tu vehículo actual. Un tasador oficial de MotorHub revisará tu unidad y te enviará una cotización formal y garantizada de toma en permuta por WhatsApp.
          </p>

          {/* Stepper Wizard Indicator */}
          <div className="flex items-center justify-center gap-3 pt-6 max-w-md mx-auto">
            <div
              className={`flex items-center gap-2 text-xs font-bold ${
                paso >= 1 ? 'text-emerald-700' : 'text-zinc-400'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                  paso >= 1 ? 'bg-emerald-500 text-zinc-950 shadow-xs' : 'bg-zinc-200 text-zinc-600'
                }`}
              >
                1
              </div>
              <span className="hidden sm:inline">Tu Usado</span>
            </div>
            <div className={`h-0.5 w-12 ${paso >= 2 ? 'bg-emerald-500' : 'bg-zinc-200'}`} />
            <div
              className={`flex items-center gap-2 text-xs font-bold ${
                paso >= 2 ? 'text-emerald-700' : 'text-zinc-400'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                  paso >= 2 ? 'bg-emerald-500 text-zinc-950 shadow-xs' : 'bg-zinc-200 text-zinc-600'
                }`}
              >
                2
              </div>
              <span className="hidden sm:inline">Fotos y Interés</span>
            </div>
            <div className={`h-0.5 w-12 ${paso >= 3 ? 'bg-emerald-500' : 'bg-zinc-200'}`} />
            <div
              className={`flex items-center gap-2 text-xs font-bold ${
                paso >= 3 ? 'text-emerald-700' : 'text-zinc-400'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                  paso >= 3 ? 'bg-emerald-500 text-zinc-950 shadow-xs' : 'bg-zinc-200 text-zinc-600'
                }`}
              >
                3
              </div>
              <span className="hidden sm:inline">Contacto</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Wizard Form Content */}
      <section className="py-12 flex-1">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-4xl mx-auto">
          {enviadoExitoso ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-zinc-200 shadow-xl text-center space-y-6 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold text-zinc-900 font-['Outfit']">
                  ¡Solicitud de Tasación Recibida!
                </h2>
                <p className="text-sm text-zinc-600 max-w-lg mx-auto leading-relaxed">
                  Hemos registrado la ficha de tu <strong className="text-zinc-900 font-bold">{marca} {modelo} {version} ({anio})</strong> con éxito. Un perito tasador oficial del equipo comercial de MotorHub revisará tus datos y fotos para enviarte la propuesta formal de toma en permuta por WhatsApp.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 max-w-md mx-auto text-center space-y-1 text-xs">
                <span className="font-bold text-emerald-900 block">
                  ✓ Tiempo promedio de respuesta: Menos de 2 horas
                </span>
                <p className="text-zinc-500 text-[11px]">
                  Recibirás la cotización directamente en tu WhatsApp con los pasos para concretar la permuta.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={`https://wa.me/5491152638000?text=Hola,%20acabo%20de%20enviar%20la%20solicitud%20de%20tasación%20para%20mi%20${encodeURIComponent(marca + ' ' + modelo)}%20(${anio})`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#25D366] hover:bg-[#20bd5a] shadow-md shadow-[#25D366]/20 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Avisar por WhatsApp</span>
                </a>
                <button
                  onClick={() => {
                    setEnviadoExitoso(false);
                    setPaso(1);
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  Cotizar otro vehículo
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200 shadow-sm space-y-8">
              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* PASO 1: Datos Técnicos del Usado */}
              {paso === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-zinc-100 pb-4">
                    <h2 className="text-xl font-bold text-zinc-900 font-['Outfit']">
                      Paso 1: Datos de tu Vehículo Actual
                    </h2>
                    <p className="text-xs text-zinc-500">Ingresá los datos identificatorios de la unidad</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                        Tipo de Vehículo *
                      </label>
                      <select
                        value={tipoVehiculo}
                        onChange={(e) => setTipoVehiculo(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 focus:bg-white"
                      >
                        <option value="AUTOMOVIL">Automóvil/Sedán/SUV/Pickup</option>
                        <option value="CAMION">Camión/Utilitario Pesado</option>
                        <option value="EMBARCACION">Embarcación/Lancha/Yate</option>
                        <option value="MOTOCICLETA">Motocicleta/Pista/Touring</option>
                        <option value="MOTORHOME">Motorhome/Casa Rodante</option>
                      </select>
                    </div>

                    {/* Campos dedicados por Tipo de Vehículo */}
                    {tipoVehiculo === 'EMBARCACION' && (
                      <>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Astillero / Marca del Casco *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ej. Quicksilver, Regnicoli, Bermuda, Pagliettini..."
                            value={marca}
                            onChange={(e) => setMarca(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Modelo de la Embarcación *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ej. 1800, Open 550, Daycruiser, Cuddy..."
                            value={modelo}
                            onChange={(e) => setModelo(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Versión / Tipo de Embarcación
                          </label>
                          <input
                            type="text"
                            placeholder="Ej. Lancha Open, Cuddy, Semirrígido, Crucero..."
                            value={version}
                            onChange={(e) => setVersion(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Año del Casco *
                          </label>
                          <input
                            type="number"
                            required
                            min={1980}
                            max={new Date().getFullYear()}
                            value={anio}
                            onChange={(e) => setAnio(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Horas de Uso del Motor *
                          </label>
                          <input
                            type="number"
                            required
                            min={0}
                            step={10}
                            placeholder="Ej. 120"
                            value={horasUso}
                            onChange={(e) => setHorasUso(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Marca y Modelo del Motor
                          </label>
                          <input
                            type="text"
                            placeholder="Ej. Mercury Pro XS, Yamaha 4T, Evinrude..."
                            value={marcaMotor}
                            onChange={(e) => setMarcaMotor(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Potencia del Motor (HP)
                          </label>
                          <input
                            type="number"
                            min={0}
                            placeholder="Ej. 115, 150, 200..."
                            value={potenciaHp}
                            onChange={(e) => setPotenciaHp(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Tipo de Montaje / Propulsión
                          </label>
                          <select
                            value={tipoMotor}
                            onChange={(e) => setTipoMotor(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                          >
                            <option value="FUERA_DE_BORDA">Fuera de Borda</option>
                            <option value="DENTRO_FUERA">Dentro-Fuera de Borda (Pata)</option>
                            <option value="INTERNO_EJE">Interno con Línea de Eje</option>
                            <option value="TURBINA_JET">Turbina / Jet (Moto de agua)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Eslora del Casco (Metros)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min={0}
                            placeholder="Ej. 5.5, 6.2..."
                            value={esloraMetros}
                            onChange={(e) => setEsloraMetros(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Combustible del Motor
                          </label>
                          <select
                            value={combustible}
                            onChange={(e) => setCombustible(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                          >
                            <option value="NAFTA">Nafta</option>
                            <option value="DIESEL">Diésel</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Estado General del Casco y Motor
                          </label>
                          <select
                            value={estadoGeneral}
                            onChange={(e) => setEstadoGeneral(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 focus:bg-white"
                          >
                            <option value="EXCELENTE">Excelente (Sin detalles, guardería cubierta)</option>
                            <option value="BUENO">Bueno (Desgaste habitual por uso náutico)</option>
                            <option value="REGULAR">Regular (Requiere mantenimiento o service)</option>
                          </select>
                        </div>
                      </>
                    )}

                    {tipoVehiculo === 'MOTOCICLETA' && (
                      <>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Marca de la Moto *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ej. Honda, Yamaha, BMW, Ducati, KTM..."
                            value={marca}
                            onChange={(e) => setMarca(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Modelo *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ej. MT-09, R 1300 GS, Africa Twin, Duke 390..."
                            value={modelo}
                            onChange={(e) => setModelo(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Cilindrada (cc) *
                          </label>
                          <input
                            type="number"
                            required
                            min={50}
                            placeholder="Ej. 125, 300, 600, 1000..."
                            value={cilindradaCc}
                            onChange={(e) => setCilindradaCc(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Estilo de la Moto
                          </label>
                          <select
                            value={estiloMoto}
                            onChange={(e) => setEstiloMoto(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                          >
                            <option value="NAKED">Naked / Street</option>
                            <option value="TRAIL_ADVENTURE">Trail / Adventure / Touring</option>
                            <option value="SPORT_PISTA">Deportiva / Pista</option>
                            <option value="CUSTOM_CHOPPER">Custom / Chopper / Cruiser</option>
                            <option value="SCOOTER">Scooter / Maxi-Scooter</option>
                            <option value="ENDURO_CROSS">Enduro / Cross</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Año *
                          </label>
                          <input
                            type="number"
                            required
                            min={1990}
                            max={new Date().getFullYear()}
                            value={anio}
                            onChange={(e) => setAnio(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Kilómetros Reales *
                          </label>
                          <input
                            type="number"
                            required
                            min={0}
                            step={500}
                            value={kilometraje}
                            onChange={(e) => setKilometraje(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Transmisión
                          </label>
                          <select
                            value={transmision}
                            onChange={(e) => setTransmision(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                          >
                            <option value="MANUAL">Manual (Embrague convencional)</option>
                            <option value="AUTOMATICA_CVT">Automática / Variador CVT (Scooter)</option>
                            <option value="QUICKSHIFTER">Manual con Quickshifter</option>
                            <option value="SEMI_AUTOMATICA">Semi-Automática</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Estado General de la Moto
                          </label>
                          <select
                            value={estadoGeneral}
                            onChange={(e) => setEstadoGeneral(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 focus:bg-white"
                          >
                            <option value="EXCELENTE">Excelente (Sin caídas, cubiertas nuevas, service oficial)</option>
                            <option value="BUENO">Bueno (Desgaste habitual por uso)</option>
                            <option value="REGULAR">Regular (Requiere cubiertas, transmisión o pintura)</option>
                          </select>
                        </div>
                      </>
                    )}

                    {tipoVehiculo === 'CAMION' && (
                      <>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Marca del Camión *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ej. Mercedes-Benz, Scania, Volvo, Iveco, Ford..."
                            value={marca}
                            onChange={(e) => setMarca(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Modelo / Versión *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ej. Actros 2045, R450, FH 540, Stralis 440..."
                            value={modelo}
                            onChange={(e) => setModelo(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Tipo de Carrocería / Configuración
                          </label>
                          <select
                            value={tipoCarroceriaCamion}
                            onChange={(e) => setTipoCarroceriaCamion(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                          >
                            <option value="TRACTOR">Tractor para Semirremolque</option>
                            <option value="CHASIS">Chasis con Cabina</option>
                            <option value="VOLCADOR">Volcador / Batea</option>
                            <option value="FURGON_TERMICO">Furgón Térmico / Frigorífico</option>
                            <option value="SIDER_PLAYO">Sider / Playo / Baranda Volcable</option>
                            <option value="TANQUE">Tanque Cisterna</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Configuración de Ejes
                          </label>
                          <select
                            value={cantidadEjes}
                            onChange={(e) => setCantidadEjes(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                          >
                            <option value="2">4x2 (2 Ejes)</option>
                            <option value="3">6x2 / 6x4 (3 Ejes)</option>
                            <option value="4">8x2 / 8x4 (4 Ejes / Bitren)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Capacidad de Carga Útil (kg)
                          </label>
                          <input
                            type="number"
                            min={0}
                            step={1000}
                            placeholder="Ej. 18000, 25000, 45000..."
                            value={capacidadCargaKg}
                            onChange={(e) => setCapacidadCargaKg(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Año *
                          </label>
                          <input
                            type="number"
                            required
                            min={1990}
                            max={new Date().getFullYear()}
                            value={anio}
                            onChange={(e) => setAnio(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Kilómetros Reales *
                          </label>
                          <input
                            type="number"
                            required
                            min={0}
                            step={5000}
                            value={kilometraje}
                            onChange={(e) => setKilometraje(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Transmisión
                          </label>
                          <select
                            value={transmision}
                            onChange={(e) => setTransmision(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                          >
                            <option value="AUTOMATIZADA">Automatizada (I-Shift / Opticruise / Powershift)</option>
                            <option value="MANUAL">Manual con Alta y Baja</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Estado General
                          </label>
                          <select
                            value={estadoGeneral}
                            onChange={(e) => setEstadoGeneral(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 focus:bg-white"
                          >
                            <option value="EXCELENTE">Excelente (Trabajando, mecánica y cubiertas impecables)</option>
                            <option value="BUENO">Bueno (Desgaste normal de ruta)</option>
                            <option value="REGULAR">Regular (Requiere cambio de neumáticos o mantenimiento)</option>
                          </select>
                        </div>
                      </>
                    )}

                    {tipoVehiculo === 'MOTORHOME' && (
                      <>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Marca del Chasis / Carrocera *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ej. Mercedes-Benz Sprinter, Iveco Daily, Fiat Ducato, Rodantes..."
                            value={marca}
                            onChange={(e) => setMarca(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Modelo / Tipo de Equipamiento *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ej. 515 CDI Motorhome, Daily 70C17, Camper, Casa Rodante..."
                            value={modelo}
                            onChange={(e) => setModelo(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Capacidad de Camas (Plazas) *
                          </label>
                          <input
                            type="number"
                            required
                            min={1}
                            max={10}
                            placeholder="Ej. 4, 6 plazas"
                            value={capacidadCamas}
                            onChange={(e) => setCapacidadCamas(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Baño Completo con Ducha
                          </label>
                          <select
                            value={tieneBano}
                            onChange={(e) => setTieneBano(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                          >
                            <option value="SI">Sí, posee baño completo con ducha</option>
                            <option value="NO">No posee baño o es químico portátil</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Año *
                          </label>
                          <input
                            type="number"
                            required
                            min={1990}
                            max={new Date().getFullYear()}
                            value={anio}
                            onChange={(e) => setAnio(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Kilómetros Reales *
                          </label>
                          <input
                            type="number"
                            required
                            min={0}
                            step={1000}
                            value={kilometraje}
                            onChange={(e) => setKilometraje(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Transmisión
                          </label>
                          <select
                            value={transmision}
                            onChange={(e) => setTransmision(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                          >
                            <option value="MANUAL">Manual</option>
                            <option value="AUTOMATICA">Automática</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Combustible
                          </label>
                          <select
                            value={combustible}
                            onChange={(e) => setCombustible(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                          >
                            <option value="DIESEL">Diésel</option>
                            <option value="NAFTA">Nafta</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Estado General Habitáculo y Mecánica
                          </label>
                          <select
                            value={estadoGeneral}
                            onChange={(e) => setEstadoGeneral(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 focus:bg-white"
                          >
                            <option value="EXCELENTE">Excelente (Instalaciones funcionando perfecto, autónomo)</option>
                            <option value="BUENO">Bueno (Desgaste habitual por viajes)</option>
                            <option value="REGULAR">Regular (Requiere revisiones de gas, agua o carrocería)</option>
                          </select>
                        </div>
                      </>
                    )}

                    {tipoVehiculo === 'AUTOMOVIL' && (
                      <>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Marca *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ej. Toyota, Volkswagen, BMW..."
                            value={marca}
                            onChange={(e) => setMarca(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Modelo *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ej. Hilux, Golf, Amarok, Corolla..."
                            value={modelo}
                            onChange={(e) => setModelo(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Versión/Equipamiento
                          </label>
                          <input
                            type="text"
                            placeholder="Ej. 2.8 SRV 4x4, Highline, 1.8 XEI..."
                            value={version}
                            onChange={(e) => setVersion(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Año de Fabricación *
                          </label>
                          <input
                            type="number"
                            required
                            min={1990}
                            max={new Date().getFullYear()}
                            value={anio}
                            onChange={(e) => setAnio(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Kilómetros Reales *
                          </label>
                          <input
                            type="number"
                            required
                            min={0}
                            step={1000}
                            value={kilometraje}
                            onChange={(e) => setKilometraje(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Transmisión
                          </label>
                          <select
                            value={transmision}
                            onChange={(e) => setTransmision(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                          >
                            <option value="MANUAL">Manual</option>
                            <option value="AUTOMATICA">Automática</option>
                            <option value="SECUENCIAL">Secuencial/DSG/CVT</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Combustible
                          </label>
                          <select
                            value={combustible}
                            onChange={(e) => setCombustible(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                          >
                            <option value="NAFTA">Nafta</option>
                            <option value="DIESEL">Diésel</option>
                            <option value="HIBRIDO">Híbrido</option>
                            <option value="ELECTRICO">100% Eléctrico</option>
                            <option value="GNC">Nafta / GNC</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                            Estado General del Vehículo
                          </label>
                          <select
                            value={estadoGeneral}
                            onChange={(e) => setEstadoGeneral(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 focus:bg-white"
                          >
                            <option value="EXCELENTE">Excelente (Sin detalles, services oficiales)</option>
                            <option value="BUENO">Bueno (Desgaste habitual por uso)</option>
                            <option value="REGULAR">Regular (Requiere detalles de pintura o service)</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex justify-end pt-6 border-t border-zinc-100">
                    <button
                      type="button"
                      onClick={() => {
                        if (!marca.trim() || !modelo.trim()) {
                          setErrorMsg('Por favor ingresá Marca y Modelo de tu vehículo.');
                          return;
                        }
                        setErrorMsg('');
                        setPaso(2);
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                    >
                      <span>Siguiente: Fotos y Unidad de Interés</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* PASO 2: Fotos y Unidad de Interés */}
              {paso === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-zinc-100 pb-4">
                    <h2 className="text-xl font-bold text-zinc-900 font-['Outfit']">
                      Paso 2: Fotos del Usado y Selección de Interés
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Subí fotos para una tasación más precisa y elegí qué unidad te gustaría llevarte
                    </p>
                  </div>

                  {/* Subida de Fotos */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block">
                      Fotos de tu Vehículo (Frente, Interior, Tablero)
                    </label>

                    <div className="border-2 border-dashed border-zinc-200 hover:border-emerald-500/60 rounded-2xl p-6 text-center bg-zinc-50/50 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        id="fotos-usado"
                        onChange={handleSubirFoto}
                        className="hidden"
                      />
                      <label
                        htmlFor="fotos-usado"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                          <Upload className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-zinc-800">
                          {subiendoFoto ? 'Subiendo imágenes...' : 'Hacé clic para seleccionar o arrastrar fotos'}
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          Formatos JPG, PNG, WEBP (Hasta 5 imágenes)
                        </span>
                      </label>
                    </div>

                    {fotosUrls.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
                        {fotosUrls.map((url, idx) => (
                          <div key={idx} className="relative h-20 rounded-xl overflow-hidden border border-zinc-200 group">
                            <img src={url} alt={`Foto ${idx}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setFotosUrls(fotosUrls.filter((_, i) => i !== idx))}
                              className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Selección de Unidad de Interés */}
                  <div className="border-t border-zinc-100 pt-5 space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block">
                      ¿Qué vehículo de nuestro catálogo te interesa adquirir? (Opcional)
                    </label>
                    <select
                      value={vehiculoInteresId}
                      onChange={(e) => setVehiculoInteresId(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 focus:bg-white"
                    >
                      <option value="">-- No tengo una unidad definida todavía (Solo tasar) --</option>
                      {catalogoVehiculos.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.marca} {v.modelo} {v.version} ({v.anio}) - USD ${v.precio.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Observaciones adicionales */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block">
                      Detalles o Equipamiento Extra
                    </label>
                    <textarea
                      rows={3}
                      value={comentarios}
                      onChange={(e) => setComentarios(e.target.value)}
                      placeholder="Ej. Posee cubiertas nuevas, service oficial recién hecho, detalles leves en paragolpe..."
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
                    <button
                      type="button"
                      onClick={() => setPaso(1)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Volver</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaso(3)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                    >
                      <span>Siguiente: Datos de Contacto</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* PASO 3: Datos de Contacto y Enviar */}
              {paso === 3 && (
                <form onSubmit={handleEnviarTasacion} className="space-y-6 animate-fade-in">
                  <div className="border-b border-zinc-100 pb-4">
                    <h2 className="text-xl font-bold text-zinc-900 font-['Outfit']">
                      Paso 3: Tus Datos de Contacto
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Ingresá tus datos para que un tasador oficial te envíe la cotización definitiva
                    </p>
                  </div>

                  {/* Resumen previo */}
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 block">
                        Unidad a Cotizar
                      </span>
                      <h4 className="text-base font-bold text-zinc-900 font-['Outfit']">
                        {marca} {modelo} {version} ({anio})
                      </h4>
                      <span className="text-xs text-zinc-500">
                        {tipoVehiculo === 'EMBARCACION' && (
                          `${horasUso} hs de uso • Motor: ${marcaMotor || 'S/D'} ${potenciaHp ? `(${potenciaHp} HP)` : ''} • ${estadoGeneral}`
                        )}
                        {tipoVehiculo === 'MOTOCICLETA' && (
                          `${kilometraje.toLocaleString()} km • ${cilindradaCc ? `${cilindradaCc} cc` : ''} • Estilo: ${estiloMoto.replace(/_/g, ' ')} • ${estadoGeneral}`
                        )}
                        {tipoVehiculo === 'CAMION' && (
                          `${kilometraje.toLocaleString()} km • ${tipoCarroceriaCamion.replace(/_/g, ' ')} ${cantidadEjes ? `(${cantidadEjes} ejes)` : ''} • ${estadoGeneral}`
                        )}
                        {tipoVehiculo === 'MOTORHOME' && (
                          `${kilometraje.toLocaleString()} km • ${capacidadCamas ? `${capacidadCamas} Plazas` : ''} (Baño: ${tieneBano}) • ${estadoGeneral}`
                        )}
                        {tipoVehiculo === 'AUTOMOVIL' && (
                          `${kilometraje.toLocaleString()} km • ${transmision} (${combustible}) • ${estadoGeneral}`
                        )}
                      </span>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 block">
                        Tasación Oficial
                      </span>
                      <span className="text-sm font-bold text-zinc-900">
                        Evaluación Personalizada
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                        Nombre y Apellido *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Lucas Gómez"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                        WhatsApp/Celular *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+54 9 11..."
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                        Ciudad/Provincia
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Reconquista, Santa Fe"
                        value={ciudad}
                        onChange={(e) => setCiudad(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
                    <button
                      type="button"
                      onClick={() => setPaso(2)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Volver</span>
                    </button>
                    <button
                      type="submit"
                      disabled={enviando}
                      className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                    >
                      {enviando ? (
                        <span>Enviando Solicitud...</span>
                      ) : (
                        <>
                          <BadgeCheck className="w-4 h-4" />
                          <span>Solicitar Tasación Formal</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
