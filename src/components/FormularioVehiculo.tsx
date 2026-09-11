'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Car,
  Truck,
  Ship,
  Bike,
  Home,
  Save,
  ArrowLeft,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Zap,
  ShieldCheck,
  FileText,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';

interface FormularioVehiculoProps {
  vehiculoId?: string;
  initialData?: any;
}

export default function FormularioVehiculo({ vehiculoId, initialData }: FormularioVehiculoProps) {
  const router = useRouter();
  const isEditing = Boolean(vehiculoId);

  const [formData, setFormData] = useState<any>({
    tipoVehiculo: 'AUTOMOVIL',
    marca: '',
    modelo: '',
    version: '',
    color: '',
    anio: new Date().getFullYear(),
    precio: '',
    kilometraje: '',
    horasUso: '',
    primeraMano: false,
    combustible: 'NAFTA',
    patente: '',
    vin: '',
    numeroMotor: '',
    tipoDireccion: 'ASISTIDA',
    largoMetros: '',
    anchoMetros: '',
    altoMetros: '',
    pesoKg: '',
    capacidadTanqueCombustible: '',
    potencia: '',
    torqueNm: '',
    descripcion: '',
    estado: 'DISPONIBLE',
    imagenesUrls: [],

    // Equipamiento Común (Autos)
    tieneAireAcondicionado: false,
    tieneAppleCarplayAndroidAuto: false,
    tieneCamaraRetroceso: false,
    tieneSensoresEstacionamiento: false,
    tieneTechoSolar: false,

    // Automóvil
    tipoAutomovil: 'SEDAN',
    motor: '',
    transmision: 'AUTOMATICA',
    traccion: 'DELANTERA',
    tipoFrenosDelanteros: 'DISCO',
    tipoFrenosTraseros: 'DISCO',
    tipoTapizado: 'TELA',
    capacidadBaulLitros: '',
    cantidadPuertas: 4,
    cantidadAsientos: 5,
    aceleracion0a100: '',
    velocidadMaximaKmh: '',
    airbags: 6,
    consumoMixtoKmPorLitro: '',
    abs: false,
    controlEstabilidad: false,
    controlCruceroAdaptativo: false,
    asientosCuero: false,
    asientosElectricos: false,
    arranqueBotonKeyless: false,
    cargadorInalambrico: false,
    lucesLedAutomaticas: false,
    frenoEstacionamientoElectrico: false,
    alertaPuntoCiego: false,

    // Camión
    capacidadCargaKg: '',
    pesoBrutoVehicularKg: '',
    cantidadEjes: 2,
    distanciaEntreEjesMm: '',
    tipoFreno: 'AIRE',
    suspension: 'NEUMATICA',
    neumaticosCantidad: 6,
    medidaNeumatico: '',
    consumoPromedioL100km: '',
    tipoCarroceria: 'CHASIS',
    aireAcondicionadoCabina: false,
    camaraRetroceso: false,
    sensoresEstacionamiento: false,
    pantallaMultimedia: false,
    frenosAireAbs: false,
    controlEstabilidadEsp: false,
    butacaNeumatica: false,
    suspensionNeumaticaCabina: false,
    controlCrucero: false,
    calefaccionAuxiliar: false,
    frenoMotorRetarder: false,
    tacografoDigital: false,

    // Embarcación
    esloraMetros: '',
    mangaMetros: '',
    puntalMetros: '',
    materialCasco: 'FIBRA_DE_VIDRIO',
    tipoEmbarcacion: 'LANCHA',
    tipoMotor: 'FUERA_DE_BORDA',
    capacidadPersonas: 6,
    pesoMaximoKg: '',
    marcaMotor: '',
    anioMotor: '',
    motor0km: false,
    numeroMotores: 1,
    velocidadMaximaNudos: '',
    capacidadAguaDulceLitros: '',
    tieneTrailer: false,
    bombaAchique: false,
    ecosonda: false,
    escaleraPopa: false,
    audio: false,
    toldoBimini: false,
    cerramientoCompleto: false,
    malacateElectrico: false,
    lucesNavegacion: false,
    radioVHF: false,
    duchaPopa: false,
    barraSki: false,
    solariumProa: false,
    mesaCockpit: false,
    inodoroMarino: false,
    heladeraNautica: false,

    // Moto
    cilindradaCc: '',
    motorTiempos: 4,
    estilo: 'NAKED',
    tipoArranque: 'ELECTRICO',
    transmisionMoto: 'CADENA',
    refrigeracion: 'LIQUIDA',
    alturaAsientoMm: '',
    tipoLlanta: 'ALEACION',
    neumaticoDelantero: '',
    neumaticoTrasero: '',
    controlTraccionTcs: false,
    modosConduccion: false,
    quickshifter: false,
    pantallaTftBluetooth: false,
    lucesLed: false,
    punosCalefaccionables: false,
    parabrisasRegulable: false,
    puertoUsb12v: false,
    cubrepunosDefensas: false,
    caballeteCentral: false,

    // Motorhome
    capacidadCamas: 4,
    capacidadBateriasAh: 150,
    cantidadPisos: 1,
    capacidadTanqueAguaLitros: 120,
    capacidadAguasGrisesLitros: 80,
    capacidadAguasNegrasLitros: 40,
    tieneCocina: false,
    tieneBano: false,
    tieneDuchaExterior: false,
    tienePanelesSolares: false,
    tieneCalefaccion: false,
    tieneGenerador: false,
    tieneTV: false,
    toldoExterior: false,
    aireAcondicionadoHabitaculo: false,
    inversorCorriente220v: false,
    heladeraFreezer: false,
    termotanqueCalefon: false,
    garrafaGasEnvasado: false,
    escalonElectrico: false,
    soporteBicicletasEnganche: false,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [manualImageUrl, setManualImageUrl] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData((prev: any) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev: any) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setError('');
    try {
      const data = new FormData();
      for (let i = 0; i < files.length; i++) {
        data.append('images', files[i]);
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (res.ok && json.urls) {
        setFormData((prev: any) => ({
          ...prev,
          imagenesUrls: [...(prev.imagenesUrls || []), ...json.urls],
        }));
      } else {
        setError(json.error || 'Error al subir imágenes');
      }
    } catch (err) {
      console.error(err);
      setError('Error al conectar con el servicio de imágenes');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddManualImage = () => {
    if (!manualImageUrl || !manualImageUrl.trim()) return;
    setFormData((prev: any) => ({
      ...prev,
      imagenesUrls: [...(prev.imagenesUrls || []), manualImageUrl.trim()],
    }));
    setManualImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      imagenesUrls: prev.imagenesUrls.filter((_: any, i: number) => i !== index),
    }));
  };

  const validateForm = (): string[] => {
    const missing: string[] = [];
    const type = formData.tipoVehiculo;

    // 1. Identificación & Registro Comercial
    if (!formData.marca || !formData.marca.trim()) {
      missing.push(type === 'EMBARCACION' ? 'Astillero' : 'Marca');
    }
    if (!formData.modelo || !formData.modelo.trim()) {
      missing.push('Modelo');
    }
    if (!formData.anio || Number(formData.anio) < 1900) {
      missing.push('Año válido (mayor o igual a 1900)');
    }
    if (!formData.precio || Number(formData.precio) <= 0) {
      missing.push('Precio Contado (USD)');
    }
    if (!formData.primeraMano) {
      if (type === 'EMBARCACION') {
        if (!formData.patente || !formData.patente.trim()) missing.push('Número de Matrícula');
      } else {
        if (!formData.patente || !formData.patente.trim()) missing.push('Patente');
      }
    }

    // 2. Galería de Fotos (al menos 1 imagen real)
    if (!formData.imagenesUrls || formData.imagenesUrls.length === 0) {
      missing.push('Galería de Fotos (al menos 1 imagen real cargada)');
    }

    // 3. Motorización, Mecánica & Dimensiones por Tipo
    if (type === 'EMBARCACION') {
      if (!formData.marcaMotor || !formData.marcaMotor.trim()) missing.push('Marca del Motor');
      if (!formData.anioMotor || Number(formData.anioMotor) < 1900) missing.push('Año de Fabricación del Motor');
      if (!formData.tipoMotor) missing.push('Tipo de Propulsión');
      if (!formData.motor0km && (formData.horasUso === '' || formData.horasUso === undefined || formData.horasUso === null)) {
        missing.push('Horas de Uso del Motor');
      }
      if (!formData.potencia || Number(formData.potencia) <= 0) missing.push('Potencia Total (HP)');
      if (!formData.capacidadTanqueCombustible || Number(formData.capacidadTanqueCombustible) <= 0) missing.push('Tanque Combustible (Litros)');
      if (!formData.esloraMetros || Number(formData.esloraMetros) <= 0) missing.push('Eslora (m)');
      if (!formData.mangaMetros || Number(formData.mangaMetros) <= 0) missing.push('Manga (m)');
      if (!formData.puntalMetros || Number(formData.puntalMetros) <= 0) missing.push('Puntal (m)');
      if (!formData.capacidadPersonas || Number(formData.capacidadPersonas) <= 0) missing.push('Capacidad de Personas');
    } else {
      if (!formData.primeraMano && (formData.kilometraje === '' || formData.kilometraje === undefined || formData.kilometraje === null)) {
        missing.push('Kilometraje');
      }
      if (!formData.potencia || Number(formData.potencia) <= 0) missing.push(type === 'CAMION' ? 'Potencia (CV)' : 'Potencia (CV/HP)');
      if (!formData.torqueNm || Number(formData.torqueNm) <= 0) missing.push('Torque (Nm)');
      if (!formData.capacidadTanqueCombustible || Number(formData.capacidadTanqueCombustible) <= 0) missing.push('Tanque Combustible (Litros)');

      if (['AUTOMOVIL', 'CAMION', 'MOTORHOME'].includes(type)) {
        if (!formData.largoMetros || Number(formData.largoMetros) <= 0) missing.push('Largo (m)');
        if (!formData.anchoMetros || Number(formData.anchoMetros) <= 0) missing.push('Ancho (m)');
        if (!formData.altoMetros || Number(formData.altoMetros) <= 0) missing.push('Alto (m)');
        if (!formData.tipoDireccion) missing.push('Tipo de Dirección');
      }
      if (!formData.pesoKg || Number(formData.pesoKg) <= 0) missing.push(type === 'MOTOCICLETA' ? 'Peso en Seco (kg)' : 'Peso (kg)');

      if (type === 'AUTOMOVIL') {
        if (!formData.tipoAutomovil) missing.push('Carrocería');
        if (!formData.motor || !formData.motor.trim()) missing.push('Motorización');
        if (!formData.transmision) missing.push('Transmisión');
        if (!formData.traccion) missing.push('Tracción');
        if (!formData.tipoFrenosDelanteros || !formData.tipoFrenosDelanteros.trim()) missing.push('Frenos Delanteros');
        if (!formData.tipoFrenosTraseros || !formData.tipoFrenosTraseros.trim()) missing.push('Frenos Traseros');
        if (!formData.tipoTapizado || !formData.tipoTapizado.trim()) missing.push('Tapizado');
        if (!formData.capacidadBaulLitros || Number(formData.capacidadBaulLitros) <= 0) missing.push('Capacidad Baúl (L)');
        if (!formData.cantidadPuertas || Number(formData.cantidadPuertas) <= 0) missing.push('Cantidad Puertas');
        if (!formData.cantidadAsientos || Number(formData.cantidadAsientos) <= 0) missing.push('Cantidad Asientos');
        if (formData.airbags === '' || formData.airbags === undefined || Number(formData.airbags) < 0) missing.push('Cantidad Airbags');
      } else if (type === 'CAMION') {
        if (!formData.tipoCarroceria || !formData.tipoCarroceria.trim()) missing.push('Tipo de Carrocería');
        if (!formData.capacidadCargaKg || Number(formData.capacidadCargaKg) <= 0) missing.push('Capacidad de Carga (kg)');
        if (!formData.pesoBrutoVehicularKg || Number(formData.pesoBrutoVehicularKg) <= 0) missing.push('Peso Bruto Vehicular (kg)');
        if (!formData.cantidadEjes || Number(formData.cantidadEjes) <= 0) missing.push('Cantidad de Ejes');
      } else if (type === 'MOTOCICLETA') {
        if (!formData.cilindradaCc || Number(formData.cilindradaCc) <= 0) missing.push('Cilindrada (cc)');
      } else if (type === 'MOTORHOME') {
        if (!formData.capacidadCamas || Number(formData.capacidadCamas) <= 0) missing.push('Capacidad de Camas (Plazas)');
        if (!formData.capacidadTanqueAguaLitros || Number(formData.capacidadTanqueAguaLitros) <= 0) missing.push('Tanque de Agua Limpia (L)');
      }
    }

    return missing;
  };

  const [validationList, setValidationList] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setValidationList([]);

    const missingFields = validateForm();
    if (missingFields.length > 0) {
      setValidationList(missingFields);
      setError('Por favor complete todos los campos obligatorios antes de guardar.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSaving(true);

    try {
      const url = isEditing ? `/api/vehiculos/${vehiculoId}` : '/api/vehiculos';
      const method = isEditing ? 'PUT' : 'POST';

      const submissionPayload = { ...formData };
      if (submissionPayload.tipoVehiculo === 'EMBARCACION') {
        submissionPayload.tipoDireccion = null;
        if (submissionPayload.primeraMano) {
          submissionPayload.patente = null;
        }
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al guardar el vehículo');
        setSaving(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      setSuccessMsg(isEditing ? '¡Vehículo actualizado con éxito!' : '¡Vehículo registrado con éxito!');
      setTimeout(() => {
        router.push('/panel/stock');
        router.refresh();
      }, 1000);
    } catch (err) {
      console.error(err);
      setError('Error de comunicación con el servidor');
      setSaving(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const categories = [
    { type: 'AUTOMOVIL', label: 'Automóvil', icon: Car, subtitle: 'Autos, SUVs y Sedán' },
    { type: 'CAMION', label: 'Camión', icon: Truck, subtitle: 'Pesados y Utilitarios' },
    { type: 'EMBARCACION', label: 'Embarcación', icon: Ship, subtitle: 'Lanchas, Yates y Veleros' },
    { type: 'MOTOCICLETA', label: 'Motocicleta', icon: Bike, subtitle: 'Pista, Naked y Touring' },
    { type: 'MOTORHOME', label: 'Motorhome', icon: Home, subtitle: 'Casas Rodantes' },
  ];

  const currentType = formData.tipoVehiculo;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/panel/stock"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-black mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver al Catálogo
          </Link>
          <h1 className="text-3xl font-extrabold text-black font-['Outfit']">
            {isEditing ? 'Modificar Unidad de Stock' : 'Alta de Nuevo Vehículo'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/panel/stock"
            className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-600 bg-white hover:bg-zinc-50 border border-zinc-300 shadow-xs transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-950 bg-emerald-400 hover:bg-emerald-300 shadow-sm shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Registrar Vehículo'}
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5 font-bold text-rose-900 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          {validationList.length > 0 && (
            <div className="bg-white/80 p-3.5 rounded-xl border border-rose-200">
              <span className="block font-bold text-rose-900 uppercase text-[11px] mb-2 tracking-wide">
                Campos faltantes requeridos ({validationList.length}):
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5 text-xs text-rose-700 font-medium">
                {validationList.map((campo, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                    <span>{campo}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 1. Category Selector */}
      <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-3">
          1. Tipo de Vehículo
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = formData.tipoVehiculo === cat.type;
            return (
              <button
                key={cat.type}
                type="button"
                onClick={() => setFormData((prev: any) => ({ ...prev, tipoVehiculo: cat.type }))}
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-md shadow-emerald-950/30 scale-[1.02]'
                    : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300'
                }`}
              >
                <Icon className={`w-6 h-6 mb-1.5 ${isSelected ? 'text-emerald-400' : 'text-zinc-500'}`} />
                <span className="font-bold text-xs uppercase tracking-wide">{cat.label}</span>
                <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-emerald-300/80 font-medium' : 'text-zinc-400'}`}>
                  {cat.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Identificación y Registro Comercial */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center gap-2.5">
          <FileText className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
              2. Identificación y Registro Comercial
            </h3>
            <p className="text-xs text-slate-500">Datos comerciales de venta, kilometraje/horas y documentación registral</p>
          </div>
        </div>

        {/* Bloque Comercial */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
              {currentType === 'EMBARCACION' ? 'Astillero *' : 'Marca *'}
            </label>
            <input
              type="text"
              name="marca"
              required
              value={formData.marca}
              onChange={handleChange}
              placeholder={currentType === 'EMBARCACION' ? 'Ej. Quicksilver, Regnicoli, Bayliner' : 'Ej. BMW, Porsche, Scania, Ducati'}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
              Modelo *
            </label>
            <input
              type="text"
              name="modelo"
              required
              value={formData.modelo}
              onChange={handleChange}
              placeholder={currentType === 'EMBARCACION' ? 'Ej. 2400 Bowrider, 630 Open' : 'Ej. M3, 911 Carrera, R540, Monster'}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
              {currentType === 'EMBARCACION' ? 'Versión / Modelo Casco' : 'Versión / Equipamiento'}
            </label>
            <input
              type="text"
              name="version"
              value={formData.version || ''}
              onChange={handleChange}
              placeholder={currentType === 'EMBARCACION' ? 'Ej. Open Cuddy, Bowrider V8' : 'Ej. Competition xDrive, Highline'}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
              {currentType === 'EMBARCACION' ? 'Año de Fabricación Casco *' : 'Año / Modelo *'}
            </label>
            <input
              type="number"
              name="anio"
              required
              value={formData.anio}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
              Precio Contado (USD) *
            </label>
            <input
              type="number"
              name="precio"
              required
              value={formData.precio}
              onChange={handleChange}
              placeholder="Monto total en dólares"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
              Color Exterior
            </label>
            <input
              type="text"
              name="color"
              value={formData.color || ''}
              onChange={handleChange}
              placeholder={currentType === 'EMBARCACION' ? 'Ej. Blanco / Azul Marino' : 'Ej. Negro Cosmos, Gris Platino'}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
              Tipo de Combustible *
            </label>
            <select
              name="combustible"
              value={formData.combustible || 'NAFTA'}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="NAFTA">Nafta</option>
              <option value="DIESEL">Diésel</option>
              {currentType !== 'EMBARCACION' && <option value="GNC">Nafta/GNC</option>}
              {currentType !== 'EMBARCACION' && <option value="HIBRIDO">Híbrido Convencional (HEV)</option>}
              {currentType !== 'EMBARCACION' && <option value="HIBRIDO_ENCHUFABLE">Híbrido Enchufable (PHEV)</option>}
              <option value="ELECTRICO">100% Eléctrico (BEV)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
              Estado de Comercialización *
            </label>
            <select
              name="estado"
              value={formData.estado || 'DISPONIBLE'}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-bold"
            >
              <option value="DISPONIBLE">DISPONIBLE</option>
              <option value="RESERVADO">RESERVADO</option>
              <option value="VENDIDO">VENDIDO</option>
            </select>
          </div>
        </div>

        {/* Bloque Condición y Kilometraje / Horas */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">
            Condición de Uso y Kilometraje
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
            <div className="flex items-center gap-2 pb-2">
              <input
                type="checkbox"
                id="primeraMano"
                name="primeraMano"
                checked={formData.primeraMano}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setFormData((prev: any) => ({
                    ...prev,
                    primeraMano: checked,
                    ...(checked
                      ? {
                          patente: '',
                          ...(currentType !== 'EMBARCACION' ? { kilometraje: '0' } : {}),
                        }
                      : {}),
                  }));
                }}
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="primeraMano" className="text-xs font-bold text-slate-800 uppercase tracking-wide cursor-pointer">
                {currentType === 'EMBARCACION' ? 'CASCO 0km (Sin Rodar)' : '0 KM (Vehículo Nuevo)'}
              </label>
            </div>

            {currentType !== 'EMBARCACION' ? (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                  Kilometraje (km) *
                  {formData.primeraMano && (
                    <span className="text-[10px] text-emerald-600 font-semibold normal-case ml-2">
                      (0 km: 0KM)
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  name="kilometraje"
                  disabled={formData.primeraMano}
                  value={formData.primeraMano ? '0' : (formData.kilometraje || '')}
                  onChange={handleChange}
                  placeholder={formData.primeraMano ? '0 km (0KM)' : 'Ej. 25000'}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium disabled:opacity-50 disabled:bg-zinc-100"
                />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 pb-2">
                  <input
                    type="checkbox"
                    id="motor0km"
                    name="motor0km"
                    checked={formData.motor0km}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setFormData((prev: any) => ({
                        ...prev,
                        motor0km: checked,
                        ...(checked ? { horasUso: '0' } : {}),
                      }));
                    }}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="motor0km" className="text-xs font-bold text-slate-800 uppercase tracking-wide cursor-pointer">
                    MOTOR 0km (Nuevo de Caja)
                  </label>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                    Horas de Uso del Motor (hs) *
                    {formData.motor0km && (
                      <span className="text-[10px] text-emerald-600 font-semibold normal-case ml-2">
                        (0 hs: MOTOR 0km)
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    name="horasUso"
                    disabled={formData.motor0km}
                    value={formData.motor0km ? '0' : (formData.horasUso || '')}
                    onChange={handleChange}
                    placeholder={formData.motor0km ? '0 hs (MOTOR 0km)' : 'Ej. 120'}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium disabled:opacity-50 disabled:bg-zinc-100"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bloque Registro y Documentación Legal */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">
            Registro Legal, Chasis y Motor
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                {currentType === 'EMBARCACION' ? 'Número de Matrícula (REY)' : 'Patente'}
                {formData.primeraMano && (
                  <span className="text-[10px] text-emerald-600 font-semibold normal-case ml-2">
                    (Bloqueado: {currentType === 'EMBARCACION' ? 'A Matricular' : '0km A Patentar'})
                  </span>
                )}
              </label>
              <input
                type="text"
                name="patente"
                disabled={formData.primeraMano}
                value={formData.primeraMano ? '' : (formData.patente || '')}
                onChange={handleChange}
                placeholder={
                  formData.primeraMano
                    ? currentType === 'EMBARCACION'
                      ? 'A Matricular (0km)'
                      : 'A Patentar (0km)'
                    : currentType === 'EMBARCACION'
                      ? 'Ej. AR-012345'
                      : 'Ej. AF 123 ZZ'
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium disabled:opacity-50 disabled:bg-zinc-100"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                {currentType === 'EMBARCACION' ? 'Número de Serie del Casco (HIN)' : 'Número de Chasis (VIN)'}
              </label>
              <input
                type="text"
                name="vin"
                value={formData.vin || ''}
                onChange={handleChange}
                placeholder={
                  currentType === 'EMBARCACION'
                    ? 'Ej. AR-ABC12345B324'
                    : 'Ej. 8AJFA4228KP123456'
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                Número de Serie del Motor
              </label>
              <input
                type="text"
                name="numeroMotor"
                value={formData.numeroMotor || ''}
                onChange={handleChange}
                placeholder="Ej. 1B123456 / Serie de Fábrica"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Motorización, Mecánica y Rendimiento */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center gap-2.5">
          <Zap className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
              3. Motorización, Mecánica y Rendimiento
            </h3>
            <p className="text-xs text-slate-500">Mecánica, potencia, transmisión, frenos y consumo de combustible</p>
          </div>
        </div>

        {/* AUTOMÓVIL */}
        {currentType === 'AUTOMOVIL' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Motorización / Nombre *</label>
              <input
                type="text"
                name="motor"
                required
                value={formData.motor || ''}
                onChange={handleChange}
                placeholder="Ej. 3.0 Biturbo 6L, 2.0 TDI"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Potencia (CV/HP) *</label>
              <input
                type="number"
                name="potencia"
                required
                value={formData.potencia || ''}
                onChange={handleChange}
                placeholder="Ej. 300"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Torque (Nm) *</label>
              <input
                type="number"
                name="torqueNm"
                required
                value={formData.torqueNm || ''}
                onChange={handleChange}
                placeholder="Ej. 450"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Transmisión *</label>
              <select
                name="transmision"
                value={formData.transmision || 'AUTOMATICA'}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="AUTOMATICA">Automática</option>
                <option value="MANUAL">Manual</option>
                <option value="SECUENCIAL">Secuencial/Doble Embrague (DSG/PDK)</option>
                <option value="CVT">Automática CVT</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Tracción *</label>
              <select
                name="traccion"
                value={formData.traccion || 'DELANTERA'}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="DELANTERA">Delantera (FWD)</option>
                <option value="TRASERA">Trasera (RWD)</option>
                <option value="INTEGRAL">Integral Permanente (AWD/4x4)</option>
                <option value="4X4">Tracción 4x4 con Reductora</option>
                <option value="4X2">Tracción 4x2</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Frenos Delanteros *</label>
              <select
                name="tipoFrenosDelanteros"
                value={formData.tipoFrenosDelanteros || 'DISCO_VENTILADO'}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="DISCO_VENTILADO">Discos Ventilados</option>
                <option value="DISCO">Discos Sólidos</option>
                <option value="CARBONO_CERAMICO">Carbón Cerámico</option>
                <option value="TAMBOR">Tambores</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Frenos Traseros *</label>
              <select
                name="tipoFrenosTraseros"
                value={formData.tipoFrenosTraseros || 'DISCO'}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="DISCO">Discos Sólidos</option>
                <option value="DISCO_VENTILADO">Discos Ventilados</option>
                <option value="TAMBOR">Tambores</option>
                <option value="CARBONO_CERAMICO">Carbón Cerámico</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Tipo de Dirección *</label>
              <select
                name="tipoDireccion"
                value={formData.tipoDireccion || 'ASISTIDA'}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="ASISTIDA">Asistida Eléctrica</option>
                <option value="HIDRAULICA">Hidráulica</option>
                <option value="ELECTROHIDRAULICA">Electrohidráulica</option>
                <option value="MECANICA">Mecánica</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Tanque Combustible (L) *</label>
              <input
                type="number"
                name="capacidadTanqueCombustible"
                required
                value={formData.capacidadTanqueCombustible || ''}
                onChange={handleChange}
                placeholder="Ej. 65"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Consumo Mixto (km/L)</label>
              <input
                type="number"
                step="0.1"
                name="consumoMixtoKmPorLitro"
                value={formData.consumoMixtoKmPorLitro || ''}
                onChange={handleChange}
                placeholder="Ej. 12.5"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">0 a 100 km/h (s)</label>
              <input
                type="number"
                step="0.1"
                name="aceleracion0a100"
                value={formData.aceleracion0a100 || ''}
                onChange={handleChange}
                placeholder="Ej. 3.8"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Velocidad Máxima (km/h)</label>
              <input
                type="number"
                name="velocidadMaximaKmh"
                value={formData.velocidadMaximaKmh || ''}
                onChange={handleChange}
                placeholder="Ej. 290"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>
        )}

        {/* CAMIÓN */}
        {currentType === 'CAMION' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Potencia (CV) *</label>
              <input
                type="number"
                name="potencia"
                required
                value={formData.potencia || ''}
                onChange={handleChange}
                placeholder="Ej. 540"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Torque (Nm) *</label>
              <input
                type="number"
                name="torqueNm"
                required
                value={formData.torqueNm || ''}
                onChange={handleChange}
                placeholder="Ej. 2700"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Sistema de Frenos</label>
              <select
                name="tipoFreno"
                value={formData.tipoFreno || 'AIRE'}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="AIRE">Frenos de Aire Comprimido con ABS</option>
                <option value="HIDRAULICO">Frenos Hidráulicos con Servo</option>
                <option value="DISCO_TOTAL">Frenos a Disco en Todos los Ejes</option>
                <option value="TAMBOR_TOTAL">Frenos a Tambor Reforzados</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Tipo de Suspensión</label>
              <select
                name="suspension"
                value={formData.suspension || 'NEUMATICA'}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="NEUMATICA">Neumática Integral Regulable</option>
                <option value="ELASTICOS">Elásticos Mecánicos Reforzados</option>
                <option value="MIXTA">Mixta (Elásticos Delanteros / Neumática Trasera)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Tipo de Dirección *</label>
              <select
                name="tipoDireccion"
                value={formData.tipoDireccion || 'HIDRAULICA'}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="HIDRAULICA">Hidráulica</option>
                <option value="ASISTIDA">Asistida Eléctrica</option>
                <option value="ELECTROHIDRAULICA">Electrohidráulica</option>
                <option value="MECANICA">Mecánica</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Tanque Combustible (L) *</label>
              <input
                type="number"
                name="capacidadTanqueCombustible"
                required
                value={formData.capacidadTanqueCombustible || ''}
                onChange={handleChange}
                placeholder="Ej. 600"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Consumo Promedio (L/100km)</label>
              <input
                type="number"
                step="0.1"
                name="consumoPromedioL100km"
                value={formData.consumoPromedioL100km || ''}
                onChange={handleChange}
                placeholder="Ej. 32.5"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>
        )}

        {/* EMBARCACIÓN */}
        {currentType === 'EMBARCACION' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Marca del Motor *</label>
              <input
                type="text"
                name="marcaMotor"
                required
                value={formData.marcaMotor || ''}
                onChange={handleChange}
                placeholder="Ej. Mercury, Yamaha, Mercruiser, Evinrude"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Año de Fabricación del Motor *</label>
              <input
                type="number"
                name="anioMotor"
                required
                value={formData.anioMotor || ''}
                onChange={handleChange}
                placeholder="Ej. 2022"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Tipo de Propulsión / Montaje *</label>
              <select
                name="tipoMotor"
                value={formData.tipoMotor || 'FUERA_DE_BORDA'}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="FUERA_DE_BORDA">Fuera de Borda</option>
                <option value="DENTRO_FUERA">Dentro-Fuera (Stern Drive / Pata)</option>
                <option value="LINEA_DE_EJE">Línea de Eje / Intraborda Directo</option>
                <option value="TURBINA_JET">Turbina / Jet Drive</option>
                <option value="VELA">Velas con Motor Auxiliar</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Cantidad de Motores</label>
              <input
                type="number"
                name="numeroMotores"
                value={formData.numeroMotores || 1}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Potencia Total (HP) *</label>
              <input
                type="number"
                name="potencia"
                required
                value={formData.potencia || ''}
                onChange={handleChange}
                placeholder="Ej. 150, 250, 300"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Tanque Combustible (L) *</label>
              <input
                type="number"
                name="capacidadTanqueCombustible"
                required
                value={formData.capacidadTanqueCombustible || ''}
                onChange={handleChange}
                placeholder="Ej. 120"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Velocidad Máxima (km/h)</label>
              <input
                type="number"
                step="0.1"
                name="velocidadMaximaNudos"
                value={formData.velocidadMaximaNudos || ''}
                onChange={handleChange}
                placeholder="Ej. 75"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>
        )}

        {/* MOTOCICLETA */}
        {currentType === 'MOTOCICLETA' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Cilindrada (cc) *</label>
              <input
                type="number"
                name="cilindradaCc"
                required
                value={formData.cilindradaCc || ''}
                onChange={handleChange}
                placeholder="Ej. 1000"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Ciclo del Motor *</label>
              <select
                name="motorTiempos"
                value={formData.motorTiempos || 4}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value={4}>4 Tiempos (4T)</option>
                <option value={2}>2 Tiempos (2T)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Potencia (CV/HP) *</label>
              <input
                type="number"
                name="potencia"
                required
                value={formData.potencia || ''}
                onChange={handleChange}
                placeholder="Ej. 200"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Torque (Nm) *</label>
              <input
                type="number"
                name="torqueNm"
                required
                value={formData.torqueNm || ''}
                onChange={handleChange}
                placeholder="Ej. 115"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Tipo de Arranque</label>
              <select
                name="tipoArranque"
                value={formData.tipoArranque || 'ELECTRICO'}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="ELECTRICO">Eléctrico</option>
                <option value="PATADA">A Patada</option>
                <option value="MIXTO">Eléctrico y a Patada</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Transmisión Secundaria</label>
              <select
                name="transmisionMoto"
                value={formData.transmisionMoto || 'CADENA'}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="CADENA">Cadena con O-Rings</option>
                <option value="CARDAN">Cardán</option>
                <option value="CORREA">Correa Dentada</option>
                <option value="AUTOMATICA_CVT">Automática por Variador (CVT)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Sistema de Refrigeración</label>
              <select
                name="refrigeracion"
                value={formData.refrigeracion || 'LIQUIDA'}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="LIQUIDA">Líquida</option>
                <option value="AIRE">Por Aire</option>
                <option value="ACEITE">Por Aire y Aceite</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Tanque Combustible (L) *</label>
              <input
                type="number"
                name="capacidadTanqueCombustible"
                required
                value={formData.capacidadTanqueCombustible || ''}
                onChange={handleChange}
                placeholder="Ej. 16.5"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>
        )}

        {/* MOTORHOME */}
        {currentType === 'MOTORHOME' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Potencia (CV/HP) *</label>
              <input
                type="number"
                name="potencia"
                required
                value={formData.potencia || ''}
                onChange={handleChange}
                placeholder="Ej. 170"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Torque (Nm) *</label>
              <input
                type="number"
                name="torqueNm"
                required
                value={formData.torqueNm || ''}
                onChange={handleChange}
                placeholder="Ej. 400"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Tipo de Dirección *</label>
              <select
                name="tipoDireccion"
                value={formData.tipoDireccion || 'ASISTIDA'}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="ASISTIDA">Asistida Eléctrica</option>
                <option value="HIDRAULICA">Hidráulica</option>
                <option value="ELECTROHIDRAULICA">Electrohidráulica</option>
                <option value="MECANICA">Mecánica</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Tanque Combustible (L) *</label>
              <input
                type="number"
                name="capacidadTanqueCombustible"
                required
                value={formData.capacidadTanqueCombustible || ''}
                onChange={handleChange}
                placeholder="Ej. 80"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Banco de Baterías (Ah)</label>
              <input
                type="number"
                name="capacidadBateriasAh"
                value={formData.capacidadBateriasAh || ''}
                onChange={handleChange}
                placeholder="Ej. 200"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. Dimensiones, Carrocería y Capacidades */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center gap-2.5">
          <Layers className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
              4. Dimensiones, Carrocería y Capacidades
            </h3>
            <p className="text-xs text-slate-500">Estructura física, medidas exteriores, pesos, volumen de carga y habitáculo</p>
          </div>
        </div>

        {/* AUTOMÓVIL */}
        {currentType === 'AUTOMOVIL' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Tipo de Carrocería *</label>
              <select
                name="tipoAutomovil"
                value={formData.tipoAutomovil || 'SEDAN'}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="SEDAN">Sedán</option>
                <option value="HATCHBACK">Hatchback</option>
                <option value="SUV">SUV/Crossover</option>
                <option value="PICKUP">Pick-Up</option>
                <option value="COUPE">Coupé</option>
                <option value="DEPORTIVO">Deportivo</option>
                <option value="CONVERTIBLE">Convertible/Cabrio</option>
                <option value="MONOVOLUMEN">Monovolumen/Minivan</option>
                <option value="RURAL">Rural/Familiar</option>
                <option value="UTILITARIO">Utilitario/Furgón</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Largo (m) *</label>
              <input
                type="number"
                step="0.01"
                name="largoMetros"
                required
                value={formData.largoMetros || ''}
                onChange={handleChange}
                placeholder="Ej. 4.75"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Ancho (m) *</label>
              <input
                type="number"
                step="0.01"
                name="anchoMetros"
                required
                value={formData.anchoMetros || ''}
                onChange={handleChange}
                placeholder="Ej. 1.88"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Alto (m) *</label>
              <input
                type="number"
                step="0.01"
                name="altoMetros"
                required
                value={formData.altoMetros || ''}
                onChange={handleChange}
                placeholder="Ej. 1.45"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Peso en Orden de Marcha (kg) *</label>
              <input
                type="number"
                name="pesoKg"
                required
                value={formData.pesoKg || ''}
                onChange={handleChange}
                placeholder="Ej. 1650"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Capacidad Baúl (L) *</label>
              <input
                type="number"
                name="capacidadBaulLitros"
                required
                value={formData.capacidadBaulLitros || ''}
                onChange={handleChange}
                placeholder="Ej. 480"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Cantidad Puertas *</label>
              <input
                type="number"
                name="cantidadPuertas"
                required
                value={formData.cantidadPuertas || ''}
                onChange={handleChange}
                placeholder="Ej. 4"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Cantidad Asientos *</label>
              <input
                type="number"
                name="cantidadAsientos"
                required
                value={formData.cantidadAsientos || ''}
                onChange={handleChange}
                placeholder="Ej. 5"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Cantidad Airbags *</label>
              <input
                type="number"
                name="airbags"
                required
                value={formData.airbags || ''}
                onChange={handleChange}
                placeholder="Ej. 6"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Tipo de Tapizado *</label>
              <select
                name="tipoTapizado"
                value={formData.tipoTapizado || 'CUERO'}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="CUERO">Cuero Premium/Nappa</option>
                <option value="TELA">Tela Textil Reforzada</option>
                <option value="ALCANTARA">Alcántara Deportiva</option>
                <option value="CUERO_ECOLOGICO">Cuero Ecológico/Sintético</option>
                <option value="MIXTO">Mixto Cuero y Tela</option>
              </select>
            </div>
          </div>
        )}

        {/* CAMIÓN */}
        {currentType === 'CAMION' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Tipo de Carrocería *</label>
              <select
                name="tipoCarroceria"
                value={formData.tipoCarroceria || 'CHASIS'}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="CHASIS">Chasis Cabina</option>
                <option value="TRACTOR">Tractor de Carretera</option>
                <option value="VOLCADOR">Volcador/Volquete</option>
                <option value="SEMI_REMOLQUE">Semi-Remolque</option>
                <option value="FURGON">Furgón Paquetero/Carga General</option>
                <option value="FRIGORIFICO">Furgón Frigorífico/Térmico</option>
                <option value="TANQUE">Tanque Cisterna</option>
                <option value="PLANCHA_AUXILIO">Plancha de Auxilio Mecánico</option>
                <option value="HORMIGONERO">Hormigonero/Mixer</option>
                <option value="PORTACONTENEDOR">Portacontenedor</option>
                <option value="SILO">Tolva/Silo Granelero</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Capacidad Carga Útil (kg) *</label>
              <input
                type="number"
                name="capacidadCargaKg"
                required
                value={formData.capacidadCargaKg || ''}
                onChange={handleChange}
                placeholder="Ej. 45000"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Peso Bruto Vehicular PBTC (kg) *</label>
              <input
                type="number"
                name="pesoBrutoVehicularKg"
                required
                value={formData.pesoBrutoVehicularKg || ''}
                onChange={handleChange}
                placeholder="Ej. 55000"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Cantidad de Ejes *</label>
              <input
                type="number"
                name="cantidadEjes"
                required
                value={formData.cantidadEjes || ''}
                onChange={handleChange}
                placeholder="Ej. 3"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Distancia Entre Ejes (mm)</label>
              <input
                type="number"
                name="distanciaEntreEjesMm"
                value={formData.distanciaEntreEjesMm || ''}
                onChange={handleChange}
                placeholder="Ej. 3900"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Largo (m) *</label>
              <input
                type="number"
                step="0.01"
                name="largoMetros"
                required
                value={formData.largoMetros || ''}
                onChange={handleChange}
                placeholder="Ej. 6.80"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Ancho (m) *</label>
              <input
                type="number"
                step="0.01"
                name="anchoMetros"
                required
                value={formData.anchoMetros || ''}
                onChange={handleChange}
                placeholder="Ej. 2.55"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Alto (m) *</label>
              <input
                type="number"
                step="0.01"
                name="altoMetros"
                required
                value={formData.altoMetros || ''}
                onChange={handleChange}
                placeholder="Ej. 3.90"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Peso Tara / Chasis (kg) *</label>
              <input
                type="number"
                name="pesoKg"
                required
                value={formData.pesoKg || ''}
                onChange={handleChange}
                placeholder="Ej. 8900"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Medida de Neumático</label>
              <input
                type="text"
                name="medidaNeumatico"
                value={formData.medidaNeumatico || ''}
                onChange={handleChange}
                placeholder="Ej. 295/80 R22.5"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Cantidad Neumáticos</label>
              <input
                type="number"
                name="neumaticosCantidad"
                value={formData.neumaticosCantidad || ''}
                onChange={handleChange}
                placeholder="Ej. 10"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>
        )}

        {/* EMBARCACIÓN */}
        {currentType === 'EMBARCACION' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Tipo de Embarcación *</label>
              <select
                name="tipoEmbarcacion"
                value={formData.tipoEmbarcacion || 'LANCHA'}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="LANCHA">Lancha Open/Cuddy</option>
                <option value="CRUCERO">Crucero</option>
                <option value="YATE">Yate de Lujo</option>
                <option value="VELERO">Velero/Monocasco</option>
                <option value="CATAMARAN">Catamarán Náutico</option>
                <option value="SEMIRRIGIDO">Semirrígido/Gomón</option>
                <option value="MOTO_DE_AGUA">Moto de Agua/Jet Ski</option>
                <option value="TRACKER">Bote/Tracker</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Material del Casco *</label>
              <select
                name="materialCasco"
                value={formData.materialCasco || 'FIBRA_DE_VIDRIO'}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="FIBRA_DE_VIDRIO">Fibra de Vidrio (P.R.F.V.)</option>
                <option value="ALUMINIO">Aluminio Naval</option>
                <option value="MADERA">Madera Tratada</option>
                <option value="ACERO">Acero Naval</option>
                <option value="NEOPRENO_HYPALON">Neopreno Hypalon/PVC</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Eslora (m) *</label>
              <input
                type="number"
                step="0.01"
                name="esloraMetros"
                required
                value={formData.esloraMetros || ''}
                onChange={handleChange}
                placeholder="Ej. 6.30"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Manga (m) *</label>
              <input
                type="number"
                step="0.01"
                name="mangaMetros"
                required
                value={formData.mangaMetros || ''}
                onChange={handleChange}
                placeholder="Ej. 2.45"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Puntal (m) *</label>
              <input
                type="number"
                step="0.01"
                name="puntalMetros"
                required
                value={formData.puntalMetros || ''}
                onChange={handleChange}
                placeholder="Ej. 1.20"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Capacidad Personas / Tripulantes *</label>
              <input
                type="number"
                name="capacidadPersonas"
                required
                value={formData.capacidadPersonas || ''}
                onChange={handleChange}
                placeholder="Ej. 8"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Peso del Casco en Seco (kg)</label>
              <input
                type="number"
                name="pesoKg"
                value={formData.pesoKg || ''}
                onChange={handleChange}
                placeholder="Ej. 850 (Estructura)"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Carga Máxima Transportable (kg)</label>
              <input
                type="number"
                name="pesoMaximoKg"
                value={formData.pesoMaximoKg || ''}
                onChange={handleChange}
                placeholder="Ej. 1400 (Carga + tripulantes)"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Tanque Agua Dulce (L)</label>
              <input
                type="number"
                name="capacidadAguaDulceLitros"
                value={formData.capacidadAguaDulceLitros || ''}
                onChange={handleChange}
                placeholder="Ej. 60"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>
        )}

        {/* MOTOCICLETA */}
        {currentType === 'MOTOCICLETA' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Estilo de Moto *</label>
              <select
                name="estilo"
                value={formData.estilo || 'NAKED'}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="NAKED">Naked/Roadster</option>
                <option value="DEPORTIVA">Deportiva/Supersport</option>
                <option value="TOURING">Touring/Trail/Adventure</option>
                <option value="ENDURO">Enduro/Cross</option>
                <option value="CUSTOM">Custom/Chopper/Cruiser</option>
                <option value="SCOOTER">Scooter/Maxiscooter</option>
                <option value="CAFE_RACER">Café Racer/Scrambler</option>
                <option value="ON_OFF">On-Off/Doble Propósito</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Altura del Asiento (mm)</label>
              <input
                type="number"
                name="alturaAsientoMm"
                value={formData.alturaAsientoMm || ''}
                onChange={handleChange}
                placeholder="Ej. 820"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Peso en Seco (kg) *</label>
              <input
                type="number"
                name="pesoKg"
                required
                value={formData.pesoKg || ''}
                onChange={handleChange}
                placeholder="Ej. 195"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Tipo de Llanta</label>
              <select
                name="tipoLlanta"
                value={formData.tipoLlanta || 'ALEACION'}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="ALEACION">Aleación de Aluminio</option>
                <option value="RAYOS">Rayos Cruzados</option>
                <option value="FIBRA_CARBONO">Fibra de Carbono</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Neumático Delantero</label>
              <input
                type="text"
                name="neumaticoDelantero"
                value={formData.neumaticoDelantero || ''}
                onChange={handleChange}
                placeholder="Ej. 120/70 ZR17"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Neumático Trasero</label>
              <input
                type="text"
                name="neumaticoTrasero"
                value={formData.neumaticoTrasero || ''}
                onChange={handleChange}
                placeholder="Ej. 190/55 ZR17"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>
        )}

        {/* MOTORHOME */}
        {currentType === 'MOTORHOME' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Capacidad de Camas (Plazas) *</label>
              <input
                type="number"
                name="capacidadCamas"
                required
                value={formData.capacidadCamas || ''}
                onChange={handleChange}
                placeholder="Ej. 4"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Cantidad de Pisos</label>
              <input
                type="number"
                name="cantidadPisos"
                value={formData.cantidadPisos || 1}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Largo (m) *</label>
              <input
                type="number"
                step="0.01"
                name="largoMetros"
                required
                value={formData.largoMetros || ''}
                onChange={handleChange}
                placeholder="Ej. 7.20"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Ancho (m) *</label>
              <input
                type="number"
                step="0.01"
                name="anchoMetros"
                required
                value={formData.anchoMetros || ''}
                onChange={handleChange}
                placeholder="Ej. 2.30"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Alto (m) *</label>
              <input
                type="number"
                step="0.01"
                name="altoMetros"
                required
                value={formData.altoMetros || ''}
                onChange={handleChange}
                placeholder="Ej. 3.10"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Peso (kg) *</label>
              <input
                type="number"
                name="pesoKg"
                required
                value={formData.pesoKg || ''}
                onChange={handleChange}
                placeholder="Ej. 3500"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Tanque Agua Limpia (L) *</label>
              <input
                type="number"
                name="capacidadTanqueAguaLitros"
                required
                value={formData.capacidadTanqueAguaLitros || ''}
                onChange={handleChange}
                placeholder="Ej. 150"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Tanque Aguas Grises (L)</label>
              <input
                type="number"
                name="capacidadAguasGrisesLitros"
                value={formData.capacidadAguasGrisesLitros || ''}
                onChange={handleChange}
                placeholder="Ej. 80"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Tanque Aguas Negras / Cloacal (L)</label>
              <input
                type="number"
                name="capacidadAguasNegrasLitros"
                value={formData.capacidadAguasNegrasLitros || ''}
                onChange={handleChange}
                placeholder="Ej. 50"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>
        )}
      </div>

      {/* 5. Equipamiento y Confort */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
              5. Equipamiento y Confort
            </h3>
            <p className="text-xs text-slate-500">Accesorios, tecnología de seguridad y elementos de confort instalados</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* AUTOMÓVIL */}
          {currentType === 'AUTOMOVIL' && (
            <>
              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="tieneAireAcondicionado"
                  checked={formData.tieneAireAcondicionado}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Aire Acondicionado/Climatizador</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="tieneAppleCarplayAndroidAuto"
                  checked={formData.tieneAppleCarplayAndroidAuto}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Apple CarPlay/Android Auto</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="tieneCamaraRetroceso"
                  checked={formData.tieneCamaraRetroceso}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Cámara de Retroceso/Visión 360°</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="tieneSensoresEstacionamiento"
                  checked={formData.tieneSensoresEstacionamiento}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Sensores de Estacionamiento</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="tieneTechoSolar"
                  checked={formData.tieneTechoSolar}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Techo Solar Panorámico</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="abs"
                  checked={formData.abs}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Frenos ABS</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="controlEstabilidad"
                  checked={formData.controlEstabilidad}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Control de Estabilidad (ESP)</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="controlCruceroAdaptativo"
                  checked={formData.controlCruceroAdaptativo}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Control Crucero Adaptativo</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="asientosCuero"
                  checked={formData.asientosCuero}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Tapizado en Cuero Premium</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="asientosElectricos"
                  checked={formData.asientosElectricos}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Butacas Eléctricas con Memoria</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="arranqueBotonKeyless"
                  checked={formData.arranqueBotonKeyless}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Acceso Keyless y Arranque Botón</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="cargadorInalambrico"
                  checked={formData.cargadorInalambrico}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Cargador Inalámbrico Celular</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="lucesLedAutomaticas"
                  checked={formData.lucesLedAutomaticas}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Faros Full LED Automáticos</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="frenoEstacionamientoElectrico"
                  checked={formData.frenoEstacionamientoElectrico}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Freno Mano Eléctrico/Auto-Hold</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="alertaPuntoCiego"
                  checked={formData.alertaPuntoCiego}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Alerta de Punto Ciego/Carril</span>
              </label>
            </>
          )}

          {/* CAMIÓN */}
          {currentType === 'CAMION' && (
            <>
              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="aireAcondicionadoCabina"
                  checked={formData.aireAcondicionadoCabina}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Climatizador/Aire en Cabina</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="camaraRetroceso"
                  checked={formData.camaraRetroceso}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Cámara de Retroceso/Asistencia</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="sensoresEstacionamiento"
                  checked={formData.sensoresEstacionamiento}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Sensores de Proximidad</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="pantallaMultimedia"
                  checked={formData.pantallaMultimedia}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Pantalla Multimedia Conectada</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="frenosAireAbs"
                  checked={formData.frenosAireAbs}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Frenos de Aire con ABS</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="controlEstabilidadEsp"
                  checked={formData.controlEstabilidadEsp}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Control de Estabilidad (ESP/ASR)</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="butacaNeumatica"
                  checked={formData.butacaNeumatica}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Butaca Conductor Neumática</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="suspensionNeumaticaCabina"
                  checked={formData.suspensionNeumaticaCabina}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Suspensión Neumática de Cabina</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="controlCrucero"
                  checked={formData.controlCrucero}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Control de Velocidad Crucero</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="calefaccionAuxiliar"
                  checked={formData.calefaccionAuxiliar}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Calefacción Auxiliar/Climatizador</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="frenoMotorRetarder"
                  checked={formData.frenoMotorRetarder}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Freno Motor Auxiliar/Retarder</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="tacografoDigital"
                  checked={formData.tacografoDigital}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Tacógrafo Digital Homologado</span>
              </label>
            </>
          )}

          {/* EMBARCACIÓN */}
          {currentType === 'EMBARCACION' && (
            <>
              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="bombaAchique"
                  checked={formData.bombaAchique}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Bomba de Achique Automática</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="ecosonda"
                  checked={formData.ecosonda}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Ecosonda/GPS Náutico</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="escaleraPopa"
                  checked={formData.escaleraPopa}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Escalera de Popa Inoxidable</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="audio"
                  checked={formData.audio}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Audio Marino Bluetooth</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="tieneTrailer"
                  checked={formData.tieneTrailer}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Incluye Trailer Homologado</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="toldoBimini"
                  checked={formData.toldoBimini}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Toldo Bimini/Capota de Sol</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="cerramientoCompleto"
                  checked={formData.cerramientoCompleto}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Cerramiento Lona Completo</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="malacateElectrico"
                  checked={formData.malacateElectrico}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Malacate/Molinete Eléctrico</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="lucesNavegacion"
                  checked={formData.lucesNavegacion}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Luces de Navegación Reglamentarias</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="radioVHF"
                  checked={formData.radioVHF}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Radio VHF Marina/Antena</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="duchaPopa"
                  checked={formData.duchaPopa}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Ducha de Popa Presurizada</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="barraSki"
                  checked={formData.barraSki}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Barra de Ski/Torre Wakeboard</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="solariumProa"
                  checked={formData.solariumProa}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Solárium de Proa con Colchonetas</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="mesaCockpit"
                  checked={formData.mesaCockpit}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Mesa de Cockpit Desmontable</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="inodoroMarino"
                  checked={formData.inodoroMarino}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Inodoro Marino/Baño</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="heladeraNautica"
                  checked={formData.heladeraNautica}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Conservadora/Heladera Náutica</span>
              </label>
            </>
          )}

          {/* MOTOCICLETA */}
          {currentType === 'MOTOCICLETA' && (
            <>
              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="abs"
                  checked={formData.abs}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Frenos ABS (Doble Canal)</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="controlTraccionTcs"
                  checked={formData.controlTraccionTcs}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Control de Tracción (TCS)</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="modosConduccion"
                  checked={formData.modosConduccion}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Modos de Conducción (Riding Modes)</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="quickshifter"
                  checked={formData.quickshifter}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Quickshifter (Up y Down)</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="pantallaTftBluetooth"
                  checked={formData.pantallaTftBluetooth}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Pantalla Digital TFT Bluetooth</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="lucesLed"
                  checked={formData.lucesLed}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Iluminación Full LED</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="punosCalefaccionables"
                  checked={formData.punosCalefaccionables}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Puños Calefaccionables</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="controlCrucero"
                  checked={formData.controlCrucero}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Control de Velocidad Crucero</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="parabrisasRegulable"
                  checked={formData.parabrisasRegulable}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Parabrisas Regulable/Deflector</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="puertoUsb12v"
                  checked={formData.puertoUsb12v}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Toma de Carga USB/12V</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="cubrepunosDefensas"
                  checked={formData.cubrepunosDefensas}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Cubrepuños y Defensas Laterales</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="caballeteCentral"
                  checked={formData.caballeteCentral}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Caballete Central y Lateral</span>
              </label>
            </>
          )}

          {/* MOTORHOME */}
          {currentType === 'MOTORHOME' && (
            <>
              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="tieneCocina"
                  checked={formData.tieneCocina}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Cocina Completa/Anafe</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="tieneBano"
                  checked={formData.tieneBano}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Baño Completo con Ducha e Inodoro</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="tieneDuchaExterior"
                  checked={formData.tieneDuchaExterior}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Ducha Exterior Presurizada</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="tienePanelesSolares"
                  checked={formData.tienePanelesSolares}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Paneles Solares Fotovoltaicos</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="tieneCalefaccion"
                  checked={formData.tieneCalefaccion}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Calefacción Estacionaria/Tiro Bal.</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="tieneGenerador"
                  checked={formData.tieneGenerador}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Generador Eléctrico Integrado</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="tieneTV"
                  checked={formData.tieneTV}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Smart TV/Antena/Audio</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="aireAcondicionadoHabitaculo"
                  checked={formData.aireAcondicionadoHabitaculo}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Aire Acondicionado Habitáculo</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="toldoExterior"
                  checked={formData.toldoExterior}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Toldo Exterior Extensible</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="inversorCorriente220v"
                  checked={formData.inversorCorriente220v}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Inversor de Corriente 12V a 220V</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="heladeraFreezer"
                  checked={formData.heladeraFreezer}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Heladera con Freezer Trivalente/12V</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="termotanqueCalefon"
                  checked={formData.termotanqueCalefon}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Termotanque/Calefón Automático</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="garrafaGasEnvasado"
                  checked={formData.garrafaGasEnvasado}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Instalación Gas Envasado</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="escalonElectrico"
                  checked={formData.escalonElectrico}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Escalón de Acceso Eléctrico</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="soporteBicicletasEnganche"
                  checked={formData.soporteBicicletasEnganche}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Soporte Bicicletas/Enganche</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="tieneCamaraRetroceso"
                  checked={formData.tieneCamaraRetroceso}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">Cámara de Retroceso</span>
              </label>
            </>
          )}
        </div>
      </div>

      {/* 6. Galería de Imágenes y Reseña Comercial */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <ImageIcon className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-lg font-bold text-black font-['Outfit']">
                6. Galería de Imágenes y Reseña Comercial <span className="text-rose-500 text-sm">* (Mínimo 1 foto)</span>
              </h3>
              <p className="text-xs text-zinc-500">Subí fotos reales de la unidad y redactá una reseña destacada para la publicación</p>
            </div>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${formData.imagenesUrls?.length > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
            {formData.imagenesUrls?.length || 0} imágenes cargadas
          </span>
        </div>

        {/* Reseña Comercial */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
            Descripción Comercial y Reseña Destacada
          </label>
          <textarea
            name="descripcion"
            rows={4}
            value={formData.descripcion || ''}
            onChange={handleChange}
            placeholder="Detalles sobre estado general, equipamiento adicional, mantenimientos oficiales realizados, garantía de fábrica, etc..."
            className="w-full p-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 resize-none font-medium text-slate-800"
          />
        </div>

        {/* Upload Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 border-t border-slate-100">
          <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-700 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 transition-colors cursor-pointer shadow-xs">
            <Upload className="w-4 h-4 text-zinc-600" />
            <span>{uploadingImage ? 'Subiendo archivos...' : 'Subir Fotos Locales'}</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploadingImage}
              className="hidden"
            />
          </label>

          <div className="flex items-center gap-2 w-full sm:flex-1">
            <input
              type="url"
              value={manualImageUrl}
              onChange={(e) => setManualImageUrl(e.target.value)}
              placeholder="O pegar enlace web de imagen (https://...)"
              className="flex-1 px-3 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
            />
            <button
              type="button"
              onClick={handleAddManualImage}
              className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-zinc-900 hover:bg-black transition-colors cursor-pointer"
            >
              Agregar Foto
            </button>
          </div>
        </div>

        {/* Image Grid Preview */}
        {formData.imagenesUrls?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 pt-4">
            {formData.imagenesUrls.map((url: string, index: number) => (
              <div key={index} className="relative group rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100 h-28 shadow-xs">
                <img src={url} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1.5 right-1.5 p-1 bg-black/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600 cursor-pointer"
                  title="Eliminar foto"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-1.5 left-1.5 text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-emerald-500 text-zinc-950 rounded shadow-xs">
                    Portada Principal
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 text-center space-y-1">
            <p className="text-xs font-bold text-zinc-600">No hay fotos cargadas todavía.</p>
            <p className="text-[11px] text-zinc-400">Es obligatorio cargar al menos una fotografía para registrar el vehículo.</p>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <Link
          href="/panel/stock"
          className="px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-600 bg-white hover:bg-zinc-50 border border-zinc-300 shadow-xs transition-colors"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Registrar Vehículo'}
        </button>
      </div>
    </form>
  );
}
