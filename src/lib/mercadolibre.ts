import { prisma } from '@/lib/prisma';

// Categorías oficiales MLA (Mercado Libre Argentina)
export const ML_CATEGORIES = {
  AUTOMOVIL: 'MLA1743',    // Autos y Camionetas
  CAMION: 'MLA1744',       // Camiones
  EMBARCACION: 'MLA1785',  // Náutica (Lanchas, Barcos)
  MOTOCICLETA: 'MLA1763',  // Motos
  MOTORHOME: 'MLA1743',    // Motorhomes / Casas Rodantes
};

export interface MLConfigData {
  appId?: string;
  clientSecret?: string;
  redirectUri?: string;
  mlUserId?: string;
  nickname?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: Date | null;
  activo?: boolean;
}

/**
 * Obtiene la configuración de Mercado Libre desde la base de datos o variables de entorno
 */
export async function getMLConfig(): Promise<MLConfigData | null> {
  const dbConfig = await prisma.mercadoLibreConfig.findFirst({
    where: { activo: true },
    orderBy: { id: 'desc' },
  });

  const appId = dbConfig?.appId || process.env.MERCADOLIBRE_APP_ID;
  const clientSecret = dbConfig?.clientSecret || process.env.MERCADOLIBRE_CLIENT_SECRET;
  const redirectUri = dbConfig?.redirectUri || process.env.MERCADOLIBRE_REDIRECT_URI || 'http://localhost:3000/api/mercadolibre/callback';

  return {
    appId,
    clientSecret,
    redirectUri,
    mlUserId: dbConfig?.mlUserId || undefined,
    nickname: dbConfig?.nickname || undefined,
    accessToken: dbConfig?.accessToken || undefined,
    refreshToken: dbConfig?.refreshToken || undefined,
    tokenExpiresAt: dbConfig?.tokenExpiresAt || null,
    activo: dbConfig?.activo ?? true,
  };
}

/**
 * Obtiene un Access Token válido, refrescándolo automáticamente si expiró o está por expirar
 */
export async function getValidMLAccessToken(): Promise<string> {
  const config = await getMLConfig();
  if (!config) {
    throw new Error('No se encontró configuración de Mercado Libre');
  }

  if (!config.accessToken) {
    throw new Error('La cuenta de Mercado Libre no está vinculada. Por favor, conéctala desde el panel.');
  }

  // Verificar si expira en los próximos 5 minutos
  const now = new Date();
  const expiresAt = config.tokenExpiresAt ? new Date(config.tokenExpiresAt) : null;
  const isExpiredOrClose = !expiresAt || (expiresAt.getTime() - now.getTime() < 5 * 60 * 1000);

  if (isExpiredOrClose && config.refreshToken && config.appId && config.clientSecret) {
    try {
      const response = await fetch('https://api.mercadolibre.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: config.appId,
          client_secret: config.clientSecret,
          refresh_token: config.refreshToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error al refrescar token de ML:', errorData);
        // Si el refresh_token falló, retornamos el accessToken actual por si aún sirve
        return config.accessToken;
      }

      const tokenData = await response.json();
      const newExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

      // Actualizar en base de datos
      const existing = await prisma.mercadoLibreConfig.findFirst({
        where: { activo: true },
        orderBy: { id: 'desc' },
      });

      if (existing) {
        await prisma.mercadoLibreConfig.update({
          where: { id: existing.id },
          data: {
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            mlUserId: String(tokenData.user_id),
            tokenExpiresAt: newExpiresAt,
          },
        });
      }

      return tokenData.access_token;
    } catch (err) {
      console.error('Excepción al renovar token de ML:', err);
      return config.accessToken;
    }
  }

  return config.accessToken;
}

/**
 * Mapea un vehículo y sus especificaciones técnicas al formato JSON requerido por Mercado Libre Items API
 */
export function buildMLItemPayload(vehiculo: any) {
  const tipo = vehiculo.tipoVehiculo || 'AUTOMOVIL';
  const categoryId = ML_CATEGORIES[tipo as keyof typeof ML_CATEGORIES] || 'MLA1743';

  // Título (máximo 60 caracteres en Mercado Libre)
  let title = `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.version || ''} ${vehiculo.anio}`.trim();
  if (title.length > 60) {
    title = `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio}`.trim();
  }
  if (title.length > 60) {
    title = title.substring(0, 60);
  }

  // Procesar imágenes
  let pictureUrls: string[] = [];
  if (typeof vehiculo.imagenesUrls === 'string') {
    try {
      pictureUrls = JSON.parse(vehiculo.imagenesUrls);
    } catch {
      pictureUrls = [];
    }
  } else if (Array.isArray(vehiculo.imagenesUrls)) {
    pictureUrls = vehiculo.imagenesUrls;
  }

  const pictures = pictureUrls.length > 0 
    ? pictureUrls.map((source) => ({ source }))
    : [{ source: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80' }];

  // Construir atributos técnicos universales y específicos de VIS
  const attributes: Array<{ id: string; value_name?: string; value_id?: string }> = [
    { id: 'BRAND', value_name: vehiculo.marca || 'Otra Marca' },
    { id: 'MODEL', value_name: vehiculo.modelo || 'Otro Modelo' },
    { id: 'VEHICLE_YEAR', value_name: String(vehiculo.anio || new Date().getFullYear()) },
    { id: 'ITEM_CONDITION', value_id: vehiculo.primeraMano ? '2230284' : '2230581', value_name: vehiculo.primeraMano ? 'Nuevo' : 'Usado' },
  ];

  if (vehiculo.color) {
    attributes.push({ id: 'COLOR', value_name: vehiculo.color.replaceAll('_', ' ') });
  }

  // Kilometraje u Horas de uso
  if (tipo === 'EMBARCACION') {
    if (vehiculo.horasUso !== undefined && vehiculo.horasUso !== null) {
      attributes.push({ id: 'HOURS_OF_USE', value_name: `${vehiculo.horasUso}` });
    }
  } else {
    const km = vehiculo.kilometraje !== undefined && vehiculo.kilometraje !== null ? vehiculo.kilometraje : 0;
    attributes.push({ id: 'KILOMETERS', value_name: `${km} km` });
  }

  // Combustible
  if (vehiculo.combustible) {
    let fuelValue = 'Nafta';
    const c = vehiculo.combustible.toUpperCase();
    if (c.includes('DIESEL')) fuelValue = 'Diésel';
    else if (c.includes('HIBRIDO') || c.includes('HYBRID')) fuelValue = 'Híbrido';
    else if (c.includes('ELECTRICO')) fuelValue = 'Eléctrico';
    else if (c.includes('GNC')) fuelValue = 'Nafta/GNC';
    attributes.push({ id: 'FUEL_TYPE', value_name: fuelValue });
  }

  // Atributos específicos según tipo
  if (vehiculo.automovil) {
    const auto = vehiculo.automovil;
    if (auto.cantidadPuertas) {
      attributes.push({ id: 'DOORS', value_name: `${auto.cantidadPuertas}` });
    }
    if (auto.transmision) {
      const trans = auto.transmision === 'AUTOMATICA' || auto.transmision === 'CVT' ? 'Automática' : 'Manual';
      attributes.push({ id: 'TRANSMISSION', value_name: trans });
    }
    if (auto.motor) {
      attributes.push({ id: 'ENGINE', value_name: auto.motor });
    }
    if (auto.tipoAutomovil) {
      attributes.push({ id: 'BODY_TYPE', value_name: auto.tipoAutomovil.replaceAll('_', ' ') });
    }
    if (auto.traccion) {
      attributes.push({ id: 'TRACTION_CONTROL', value_name: auto.traccion.replaceAll('_', ' ') });
    }
    if (auto.controlEstabilidad) {
      attributes.push({ id: 'HAS_ELECTRONIC_STABILITY_CONTROL', value_name: 'Sí' });
    }
    if (auto.airbags) {
      attributes.push({ id: 'AIRBAG_COUNT', value_name: `${auto.airbags}` });
    }
    if (auto.abs) {
      attributes.push({ id: 'HAS_ABS_BRAKES', value_name: 'Sí' });
    }
  }

  if (vehiculo.motocicleta) {
    const moto = vehiculo.motocicleta;
    if (moto.cilindradaCc) {
      attributes.push({ id: 'ENGINE_DISPLACEMENT', value_name: `${moto.cilindradaCc} cc` });
    }
    if (moto.estilo) {
      attributes.push({ id: 'MOTORCYCLE_TYPE', value_name: moto.estilo.replaceAll('_', ' ') });
    }
    if (moto.motorTiempos) {
      attributes.push({ id: 'ENGINE_STROKES', value_name: `${moto.motorTiempos} tiempos` });
    }
  }

  if (vehiculo.camion) {
    const cam = vehiculo.camion;
    if (cam.capacidadCargaKg) {
      attributes.push({ id: 'PAYLOAD_CAPACITY', value_name: `${cam.capacidadCargaKg} kg` });
    }
    if (cam.cantidadEjes) {
      attributes.push({ id: 'AXLES_QUANTITY', value_name: `${cam.cantidadEjes}` });
    }
    if (cam.tipoCarroceria) {
      attributes.push({ id: 'BODY_TYPE', value_name: cam.tipoCarroceria.replaceAll('_', ' ') });
    }
  }

  if (vehiculo.embarcacion) {
    const emb = vehiculo.embarcacion;
    if (emb.esloraMetros) {
      attributes.push({ id: 'LENGTH', value_name: `${emb.esloraMetros} m` });
    }
    if (emb.marcaMotor) {
      attributes.push({ id: 'ENGINE_BRAND', value_name: emb.marcaMotor });
    }
    if (emb.materialCasco) {
      attributes.push({ id: 'HULL_MATERIAL', value_name: emb.materialCasco.replaceAll('_', ' ') });
    }
  }

  // Equipamiento general
  if (vehiculo.tieneAireAcondicionado) {
    attributes.push({ id: 'AIR_CONDITIONING', value_name: 'Sí' });
  }
  if (vehiculo.tieneCamaraRetroceso) {
    attributes.push({ id: 'HAS_REAR_CAMERA', value_name: 'Sí' });
  }
  if (vehiculo.tieneSensoresEstacionamiento) {
    attributes.push({ id: 'HAS_PARKING_SENSOR', value_name: 'Sí' });
  }

  // Construir descripción comercial completa
  let fullDescription = `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.version || ''} (${vehiculo.anio})\n\n`;
  if (vehiculo.descripcion) {
    fullDescription += `${vehiculo.descripcion}\n\n`;
  }
  fullDescription += `--- ESPECIFICACIONES DESTACADAS ---\n`;
  fullDescription += `• Condición: ${vehiculo.primeraMano ? '0 KM' : 'Usado seleccionado'}\n`;
  if (vehiculo.tipoVehiculo === 'EMBARCACION') {
    fullDescription += `• Horas de uso: ${vehiculo.horasUso || 0} hs\n`;
  } else {
    fullDescription += `• Kilometraje: ${vehiculo.kilometraje ? vehiculo.kilometraje.toLocaleString('es-AR') : 0} km\n`;
  }
  if (vehiculo.combustible) {
    fullDescription += `• Combustible: ${vehiculo.combustible.replaceAll('_', ' ')}\n`;
  }
  fullDescription += `\nUnidad disponible en salón de ventas. Tomamos usados en parte de pago y ofrecemos financiación a medida.`;

  return {
    title,
    category_id: categoryId,
    price: vehiculo.precio || 0,
    currency_id: 'USD',
    available_quantity: 1,
    buying_mode: 'classified',
    listing_type_id: 'gold_special', // VIS Tipo de publicación estándar para automotores
    condition: vehiculo.primeraMano ? 'new' : 'used',
    description: {
      plain_text: fullDescription,
    },
    pictures,
    attributes,
  };
}

/**
 * Publica un vehículo en Mercado Libre
 */
export async function publishVehicleToML(vehiculoId: number) {
  const vehiculo = await prisma.vehiculo.findUnique({
    where: { id: vehiculoId },
    include: {
      automovil: true,
      camion: true,
      embarcacion: true,
      motocicleta: true,
      motorhome: true,
    },
  });

  if (!vehiculo) {
    throw new Error('Vehículo no encontrado');
  }

  const token = await getValidMLAccessToken();
  const payload = buildMLItemPayload(vehiculo);

  // Si ya tiene un ID en Mercado Libre, actualizamos el precio y estado
  if (vehiculo.mercadoLibreId) {
    try {
      const updateRes = await fetch(`https://api.mercadolibre.com/items/${vehiculo.mercadoLibreId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: vehiculo.precio,
          status: 'active',
          pictures: payload.pictures,
        }),
      });

      if (updateRes.ok) {
        const updateData = await updateRes.json();
        const updated = await prisma.vehiculo.update({
          where: { id: vehiculo.id },
          data: {
            mercadoLibrePermalink: updateData.permalink || vehiculo.mercadoLibrePermalink,
            mercadoLibreStatus: updateData.status || 'active',
            mercadoLibreSyncedAt: new Date(),
          },
        });
        return {
          success: true,
          action: 'updated',
          itemId: vehiculo.mercadoLibreId,
          permalink: updated.mercadoLibrePermalink,
          status: updated.mercadoLibreStatus,
        };
      }
    } catch (err) {
      console.warn('Fallo al actualizar item existente en ML, intentando crear uno nuevo:', err);
    }
  }

  // Publicar nuevo Item
  const response = await fetch('https://api.mercadolibre.com/items', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const resData = await response.json();

  if (!response.ok) {
    console.error('Error al publicar en Mercado Libre:', resData);
    const errorMessage = resData.message || resData.cause?.[0]?.message || resData.error || 'Error al comunicarse con Mercado Libre';
    throw new Error(`Mercado Libre: ${errorMessage}`);
  }

  // Guardar ID y link en el vehículo
  await prisma.vehiculo.update({
    where: { id: vehiculo.id },
    data: {
      mercadoLibreId: resData.id,
      mercadoLibrePermalink: resData.permalink,
      mercadoLibreStatus: resData.status || 'active',
      mercadoLibreSyncedAt: new Date(),
    },
  });

  return {
    success: true,
    action: 'created',
    itemId: resData.id,
    permalink: resData.permalink,
    status: resData.status,
  };
}

/**
 * Cambia el estado (pausar/activar/cerrar) o sincroniza el vehículo con Mercado Libre
 */
export async function syncOrUpdateMLStatus(vehiculoId: number, newStatus?: 'active' | 'paused' | 'closed') {
  const vehiculo = await prisma.vehiculo.findUnique({
    where: { id: vehiculoId },
  });

  if (!vehiculo || !vehiculo.mercadoLibreId) {
    throw new Error('El vehículo no está publicado en Mercado Libre');
  }

  const token = await getValidMLAccessToken();

  if (newStatus) {
    const response = await fetch(`https://api.mercadolibre.com/items/${vehiculo.mercadoLibreId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    const resData = await response.json();
    if (!response.ok) {
      throw new Error(resData.message || 'No se pudo cambiar el estado en Mercado Libre');
    }

    await prisma.vehiculo.update({
      where: { id: vehiculo.id },
      data: {
        mercadoLibreStatus: resData.status,
        mercadoLibreSyncedAt: new Date(),
      },
    });

    return {
      success: true,
      status: resData.status,
      permalink: resData.permalink,
    };
  }

  // Sincronizar lectura de estado actual
  const response = await fetch(`https://api.mercadolibre.com/items/${vehiculo.mercadoLibreId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || 'No se pudo consultar el estado en Mercado Libre');
  }

  await prisma.vehiculo.update({
    where: { id: vehiculo.id },
    data: {
      mercadoLibrePermalink: resData.permalink,
      mercadoLibreStatus: resData.status,
      mercadoLibreSyncedAt: new Date(),
    },
  });

  return {
    success: true,
    status: resData.status,
    permalink: resData.permalink,
  };
}
