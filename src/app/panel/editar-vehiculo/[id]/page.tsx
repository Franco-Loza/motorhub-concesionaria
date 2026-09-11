'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import FormularioVehiculo from '@/components/FormularioVehiculo';

export default function EditarVehiculoPage() {
  const params = useParams();
  const id = params?.id as string;
  const [vehiculo, setVehiculo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchVehiculo = async () => {
      try {
        const res = await fetch(`/api/vehiculos/${id}`);
        if (res.ok) {
          const data = await res.json();
          // Aplanar los campos de la tabla hija en el objeto raíz para el formulario
          const { automovil, camion, embarcacion, motocicleta, motorhome, ...resto } = data;
          const hijaData = automovil || camion || embarcacion || motocicleta || motorhome || {};
          const { id: _hijaId, vehiculoId: _vId, ...hijaFields } = hijaData;
          setVehiculo({ ...resto, ...hijaFields });
        }
      } catch (err) {
        console.error('Error al recuperar vehículo:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehiculo();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-zinc-500">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        Cargando datos de la unidad...
      </div>
    );
  }

  if (!vehiculo) {
    return (
      <div className="py-20 text-center text-zinc-500 font-bold">
        Vehículo no encontrado.
      </div>
    );
  }

  return <FormularioVehiculo vehiculoId={id} initialData={vehiculo} />;
}

