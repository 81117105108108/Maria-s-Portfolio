import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const projectId = formData.get('projectId') as string | null;

  if (!file || !projectId) {
    return NextResponse.json(
      { error: 'File and projectId are required' },
      { status: 400 }
    );
  }

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Unsupported file type. Use JPEG, PNG, WebP, AVIF, or GIF.' },
      { status: 400 }
    );
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: 'File too large. Maximum 10MB.' },
      { status: 400 }
    );
  }

  // Verify project exists
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true },
  });

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  // Upload to Cloudinary with compression
  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise<{
    secure_url: string;
    public_id: string;
    width?: number;
    height?: number;
    format?: string;
  }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'maria-portfolio',
        resource_type: 'image',
        quality: 'auto:good',
        fetch_format: 'auto',
      },
      (error, uploadResult) => {
        if (error || !uploadResult) {
          reject(error ?? new Error('Upload to Cloudinary failed'));
        } else {
          resolve(uploadResult);
        }
      }
    );

    uploadStream.end(buffer);
  });

  // Get next sort order
  const lastImage = await prisma.image.findFirst({
    where: { projectId },
    orderBy: { sortOrder: 'desc' },
    select: { sortOrder: true },
  });

  const sortOrder = (lastImage?.sortOrder ?? -1) + 1;

  // Save to DB
  const image = await prisma.image.create({
    data: {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width ?? null,
      height: result.height ?? null,
      format: result.format ?? null,
      alt: '',
      sortOrder,
      projectId,
    },
  });

  return NextResponse.json(image, { status: 201 });
}
