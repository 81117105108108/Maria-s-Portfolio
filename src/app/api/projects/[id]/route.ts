import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';
import { updateProjectSchema } from '@/lib/validation';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      coverImage: true,
      images: { orderBy: { sortOrder: 'asc' } },
      author: { select: { id: true, name: true, email: true } },
    },
  });

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateProjectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message || 'Invalid input' },
      { status: 400 }
    );
  }

  const existing = await prisma.project.findUnique({
    where: { id: params.id },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  // Check slug uniqueness if slug is being changed
  if (parsed.data.slug && parsed.data.slug !== existing.slug) {
    const slugExists = await prisma.project.findUnique({
      where: { slug: parsed.data.slug },
    });

    if (slugExists) {
      return NextResponse.json(
        { error: 'A project with this slug already exists' },
        { status: 409 }
      );
    }
  }

  const updateData: Record<string, unknown> = {};

  if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
  if (parsed.data.slug !== undefined) updateData.slug = parsed.data.slug;
  if (parsed.data.description !== undefined)
    updateData.description = parsed.data.description;
  if (parsed.data.date !== undefined)
    updateData.date = new Date(parsed.data.date);
  if (parsed.data.tags !== undefined) updateData.tags = parsed.data.tags;
  if (parsed.data.published !== undefined)
    updateData.published = parsed.data.published;
  if (parsed.data.featured !== undefined)
    updateData.featured = parsed.data.featured;
  if (parsed.data.coverImageId !== undefined) {
    updateData.coverImage =
      parsed.data.coverImageId === null
        ? { disconnect: true }
        : { connect: { id: parsed.data.coverImageId } };
  }

  const project = await prisma.project.update({
    where: { id: params.id },
    data: updateData,
    include: {
      coverImage: true,
      images: { orderBy: { sortOrder: 'asc' } },
      author: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json(project);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { images: true },
  });

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  // Delete images from Cloudinary
  for (const image of project.images) {
    try {
      await cloudinary.uploader.destroy(image.publicId);
    } catch {
      console.warn(`Failed to delete image from Cloudinary: ${image.publicId}`);
    }
  }

  // Delete project (cascades to images in DB)
  await prisma.project.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
