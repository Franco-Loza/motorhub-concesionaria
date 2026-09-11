import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando limpieza completa y carga de usuarios...');

  // Limpiar en orden por dependencias
  await prisma.consulta.deleteMany();
  await prisma.venta.deleteMany();
  await prisma.automovil.deleteMany();
  await prisma.camion.deleteMany();
  await prisma.embarcacion.deleteMany();
  await prisma.motocicleta.deleteMany();
  await prisma.motorhome.deleteMany();
  await prisma.vehiculo.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.sucursal.deleteMany();
  await prisma.usuario.deleteMany();

  // ── 1. USUARIOS DEMO / INICIALES ───────────────────
  const passwordAdmin = await bcrypt.hash('admin123', 10);
  const passwordEmpleado = await bcrypt.hash('empleado123', 10);

  await prisma.usuario.create({
    data: {
      nombreCompleto: 'Martín Rossi',
      dni: '38123456',
      email: 'admin@motorhub.com.ar',
      telefono: '+54 9 11 5555-0101',
      username: 'admin',
      password: passwordAdmin,
      rol: 'DUENO',
      activo: true,
    },
  });

  await prisma.usuario.create({
    data: {
      nombreCompleto: 'Federico Álvarez',
      dni: '42987654',
      email: 'empleado@motorhub.com.ar',
      telefono: '+54 9 11 5555-0202',
      username: 'empleado',
      password: passwordEmpleado,
      rol: 'EMPLEADO',
      activo: true,
    },
  });

  console.log('✓ Base de datos limpiada con éxito.');
  console.log('✓ Creados 2 usuarios iniciales:');
  console.log('   - Martín Rossi:     username = "admin"    | password = "admin123"    | rol = DUENO');
  console.log('   - Federico Álvarez: username = "empleado" | password = "empleado123" | rol = EMPLEADO');
}

main()
  .catch((e) => {
    console.error('Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
