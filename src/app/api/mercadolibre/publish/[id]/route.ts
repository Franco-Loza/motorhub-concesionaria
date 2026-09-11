import { NextResponse } from 'next/server';
import { publishVehicleToML } from '@/lib/mercadolibre';
import { registrarAuditoria } from '@/lib/auditoria';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vehiculoId = parseInt(id);

    if (isNaN(vehiculoId)) {
      return NextResponse.json({ error: 'ID de vehículo inválido' }, { status: 400 });
    }

    const result = await publishVehicleToML(vehiculoId);

    await registrarAuditoria({
      nombreUsuario: 'ADMIN',
      rolUsuario: 'ADMINISTRADOR',
      accion: 'MODIFICACION',
      entidad: 'VEHICULO',
      entidadId: vehiculoId,
      detalles: `Vehículo publicado/actualizado en Mercado Libre (Item: ${result.itemId})`,
      request: req,
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: result.action === 'created' 
        ? 'Vehículo publicado exitosamente en Mercado Libre'
        : 'Publicación sincronizada con Mercado Libre',
    });
  } catch (error: any) {
    console.error('Error al publicar en Mercado Libre:', error);
    return NextResponse.json(
      { error: error.message || 'Error al publicar vehículo en Mercado Libre' },
      { status: 500 }
    );
  }
}
