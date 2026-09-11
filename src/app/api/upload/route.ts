import { NextResponse, NextRequest } from 'next/server';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { getSessionFromRequest } from '@/lib/auth';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
  'image/avif',
]);

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB
const MAX_FILES_PER_REQUEST = 10;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      const singleFile = (formData.get('image') || formData.get('file')) as File;
      if (singleFile) {
        files.push(singleFile);
      } else {
        return NextResponse.json({ error: 'No se enviaron archivos' }, { status: 400 });
      }
    }

    if (files.length > MAX_FILES_PER_REQUEST) {
      return NextResponse.json(
        { error: `No se pueden subir más de ${MAX_FILES_PER_REQUEST} imágenes a la vez.` },
        { status: 400 }
      );
    }

    // Validar tipo MIME y tamaño de cada archivo antes de procesar
    for (const file of files) {
      if (!ALLOWED_MIME_TYPES.has(file.type)) {
        return NextResponse.json(
          { error: `El archivo "${file.name}" no es una imagen válida (solo JPG, PNG, WEBP, AVIF).` },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: `El archivo "${file.name}" supera el tamaño máximo permitido de 8 MB.` },
          { status: 400 }
        );
      }
    }

    const uploadPromises = files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return uploadImageToCloudinary(buffer, 'motorhub/vehiculos');
    });

    const urls = await Promise.all(uploadPromises);

    return NextResponse.json({ success: true, urls });
  } catch (error) {
    console.error('Error al subir imágenes:', error);
    return NextResponse.json({ error: 'Error al procesar la subida de imágenes' }, { status: 500 });
  }
}
