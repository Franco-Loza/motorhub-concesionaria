import { NextResponse } from 'next/server';
import { syncOrUpdateMLStatus } from '@/lib/mercadolibre';
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

    const body = await req.json().catch(() => ({}));
    const { action } = body; // 'pause', 'activate', 'close', 'sync'

    let newStatus: 'active' | 'paused' | 'closed' | undefined;
    if (action === 'pause') newStatus = 'paused';
    else if (action === 'activate') newStatus = 'active';
    else if (action === 'close') newStatus = 'closed';

    const result = await syncOrUpdateMLStatus(vehiculoId, newStatus);

    await registrarAuditoria({
      nombreUsuario: 'ADMIN',
      rolUsuario: 'ADMINISTRADOR',
      accion: 'MODIFICACION',
      entidad: 'VEHICULO',
      entidadId: vehiculoId,
      detalles: `Estado de Mercado Libre actualizado a: ${result.status}`,
      request: req,
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: `Estado actualizado a ${result.status}`,
    });
  } catch (error: any) {
    console.error('Error al sincronizar con Mercado Libre:', error);
    return NextResponse.json(
      { error: error.message || 'Error al sincronizar con Mercado Libre' },
      { status: 500 }
    );
  }
}
