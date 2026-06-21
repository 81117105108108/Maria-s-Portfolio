import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createProjectSchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  const tag = searchParams.get('tag');
  const published = searchParams.get('published');
  const featured = searchParams.get('featured');

  const where: Record<string, unknown> = {};

  if (published !== null) {
    where.published = published === 'true';
  }
  if (featured !== null) {
    where.featured = featured === 'true';
  }
  if (tag) {
    where.tags = { contains: tag };
  }

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      include: {
        coverImage: true,
        images: { orderBy: { sortOrder: 'asc' } },
        author: { select: { id: true, name: true, email: true } },
      },
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.project.count({ where }),
  ]);

  return NextResponse.json({
    projects,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createProjectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message || 'Invalid input' },
      { status: 400 }
    );
  }

  // Check slug uniqueness
  const existing = await prisma.project.findUnique({
    where: { slug: parsed.data.slug },
  });

  if (existing) {
    return NextResponse.json(
      { error: 'A project with this slug already exists' },
      { status: 409 }
    );
  }

  const project = await prisma.project.create({
    data: {
      ...parsed.data,
      date: parsed.data.date ? new Date(parsed.data.date) : new Date(),
      authorId: session.user.id,
    },
    include: {
      coverImage: true,
      images: { orderBy: { sortOrder: 'asc' } },
      author: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json(project, { status: 201 });
}
