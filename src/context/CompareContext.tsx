'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CompareVehicle {
  id: number;
  marca: string;
  modelo: string;
  version?: string | null;
  tipoVehiculo: string;
  precio: number;
  anio: number;
  kilometraje?: number | null;
  combustible?: string | null;
  imagenUrl?: string | null;
}

interface CompareContextType {
  compareList: CompareVehicle[];
  addToCompare: (vehicle: CompareVehicle) => boolean;
  removeFromCompare: (id: number) => void;
  isInCompare: (id: number) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<CompareVehicle[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('motorhub_compare');
      if (saved) {
        setCompareList(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveList = (list: CompareVehicle[]) => {
    setCompareList(list);
    try {
      localStorage.setItem('motorhub_compare', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  const formatCategoriaNombre = (tipo: string) => {
    switch (tipo) {
      case 'AUTOMOVIL': return 'Automóviles';
      case 'CAMION': return 'Camiones';
      case 'EMBARCACION': return 'Embarcaciones';
      case 'MOTOCICLETA': return 'Motocicletas';
      case 'MOTORHOME': return 'Motorhomes';
      default: return tipo;
    }
  };

  const addToCompare = (vehicle: CompareVehicle): boolean => {
    if (compareList.some((v) => v.id === vehicle.id)) {
      removeFromCompare(vehicle.id);
      return false;
    }
    if (compareList.length >= 3) {
      alert('Podés comparar un máximo de 3 vehículos simultáneamente.');
      return false;
    }
    // Restricción: La comparación debe ser exclusivamente entre vehículos del mismo tipo
    if (compareList.length > 0 && compareList[0].tipoVehiculo !== vehicle.tipoVehiculo) {
      const tipoActual = formatCategoriaNombre(compareList[0].tipoVehiculo);
      const tipoNuevo = formatCategoriaNombre(vehicle.tipoVehiculo);
      alert(`Solo podés comparar vehículos del mismo tipo.\n\nActualmente tenés seleccionado(s) ${tipoActual}. Si deseás comparar ${tipoNuevo}, limpiá primero la lista de comparación.`);
      return false;
    }
    const updated = [...compareList, vehicle];
    saveList(updated);
    return true;
  };

  const removeFromCompare = (id: number) => {
    const updated = compareList.filter((v) => v.id !== id);
    saveList(updated);
  };

  const isInCompare = (id: number) => {
    return compareList.some((v) => v.id === id);
  };

  const clearCompare = () => {
    saveList([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
