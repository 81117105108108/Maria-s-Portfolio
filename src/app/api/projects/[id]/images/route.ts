import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';
import { addImageSchema } from '@/lib/validation';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify project exists
  const project = await prisma.project.findUnique({
    where: { id: params.id },
  });

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const body = await request.json();
  const parsed = addImageSchema.safeParse({ ...body, projectId: params.id });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message || 'Invalid input' },
      { status: 400 }
    );
  }

  // Get next sort order
  const lastImage = await prisma.image.findFirst({
    where: { projectId: params.id },
    orderBy: { sortOrder: 'desc' },
    select: { sortOrder: true },
  });

  const sortOrder = (lastImage?.sortOrder ?? -1) + 1;

  const image = await prisma.image.create({
    data: {
      ...parsed.data,
      sortOrder: parsed.data.sortOrder ?? sortOrder,
    },
  });

  return NextResponse.json(image, { status: 201 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { imageId } = body;

  if (!imageId) {
    return NextResponse.json(
      { error: 'imageId is required' },
      { status: 400 }
    );
  }

  const image = await prisma.image.findUnique({
    where: { id: imageId },
  });

  if (!image) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }

  // Delete from Cloudinary
  try {
    await cloudinary.uploader.destroy(image.publicId);
  } catch {
    console.warn(`Failed to delete image from Cloudinary: ${image.publicId}`);
  }

  await prisma.image.delete({
    where: { id: imageId },
  });

  return NextResponse.json({ success: true });
}
