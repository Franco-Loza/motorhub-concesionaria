import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export type TipoAccion =
  | 'CREACION'
  | 'MODIFICACION'
  | 'ELIMINACION'
  | 'CAMBIO_PRECIO'
  | 'CAMBIO_ESTADO'
  | 'VENTA'
  | 'ANULACION'
  | 'LOGIN'
  | 'LOGOUT';

export type TipoEntidad =
  | 'VEHICULO'
  | 'VENTA'
  | 'EMPLEADO'
  | 'SUCURSAL'
  | 'CONSULTA'
  | 'AUTH';

export interface ParametrosAuditoria {
  usuarioId?: number | null;
  nombreUsuario: string;
  rolUsuario: string;
  accion: TipoAccion;
  entidad: TipoEntidad;
  entidadId?: number | null;
  detalles: string;
  valoresAnteriores?: any;
  valoresNuevos?: any;
  request?: NextRequest | Request | null;
}

export async function registrarAuditoria(params: ParametrosAuditoria) {
  try {
    let ip = '127.0.0.1';
    if (params.request) {
      const forwarded = params.request.headers.get('x-forwarded-for');
      ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    }

    await prisma.auditoria.create({
      data: {
        usuarioId: params.usuarioId || null,
        nombreUsuario: params.nombreUsuario || 'SISTEMA',
        rolUsuario: params.rolUsuario || 'EMPLEADO',
        accion: params.accion,
        entidad: params.entidad,
        entidadId: params.entidadId || null,
        detalles: params.detalles,
        valoresAnteriores: params.valoresAnteriores ? JSON.stringify(params.valoresAnteriores) : null,
        valoresNuevos: params.valoresNuevos ? JSON.stringify(params.valoresNuevos) : null,
        ip,
      },
    });
  } catch (error) {
    console.error('Error no bloqueante al registrar auditoría:', error);
  }
}
