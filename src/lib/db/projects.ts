import { prisma } from '@/lib/prisma';
import { getPagination, getPaginationParams } from '@/lib/pagination';
import type { CreateProjectInput, UpdateProjectInput } from '@/types';
import type { Prisma } from '@prisma/client';

/** Lightweight select for list/grid views — no description, no full image list */
function projectCardSelect() {
  return {
    id: true,
    slug: true,
    title: true,
    date: true,
    tags: true,
    published: true,
    featured: true,
    coverImageId: true,
    coverImage: true,
    createdAt: true,
    updatedAt: true,
  } satisfies Prisma.ProjectSelect;
}

/** Full select for detail views — includes description and all images */
function projectDetailSelect() {
  return {
    id: true,
    slug: true,
    title: true,
    description: true,
    date: true,
    tags: true,
    published: true,
    featured: true,
    coverImageId: true,
    coverImage: true,
    createdAt: true,
    updatedAt: true,
    authorId: true,
    author: {
      select: { id: true, name: true, email: true },
    },
    images: {
      orderBy: { sortOrder: 'asc' as const },
    },
  } satisfies Prisma.ProjectSelect;
}

export interface GetProjectsOptions {
  page?: number;
  limit?: number;
  tag?: string;
  published?: boolean;
  featured?: boolean;
  searchParams?: URLSearchParams | Record<string, string | string[] | undefined>;
}

export async function getProjects(options: GetProjectsOptions = {}) {
  const { page = 1, limit = 12, tag, published, featured } = options;
  const pagination = getPaginationParams({ page: String(page), limit: String(limit) }, limit);

  const where: Prisma.ProjectWhereInput = {};

  if (published !== undefined) {
    where.published = published;
  }
  if (featured !== undefined) {
    where.featured = featured;
  }
  if (tag) {
    where.tags = { contains: tag };
  }

  const total = await prisma.project.count({ where });

  const { skip, take } = getPagination(total, { page, limit });

  const projects = await prisma.project.findMany({
    where,
    select: projectCardSelect(),
    orderBy: { date: 'desc' },
    skip,
    take,
  });

  const totalPages = Math.ceil(total / limit);

  return {
    projects,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
    select: projectDetailSelect(),
  });
}

export async function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: { id },
    select: projectDetailSelect(),
  });
}

export async function createProject(data: CreateProjectInput & { authorId: string }) {
  return prisma.project.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      date: data.date ? new Date(data.date) : new Date(),
      tags: data.tags || '',
      published: data.published ?? false,
      featured: data.featured ?? false,
      coverImageId: data.coverImageId || undefined,
      authorId: data.authorId,
    },
    select: projectDetailSelect(),
  });
}

export async function updateProject(id: string, data: UpdateProjectInput) {
  const updateData: Prisma.ProjectUpdateInput = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.date !== undefined) updateData.date = new Date(data.date);
  if (data.tags !== undefined) updateData.tags = data.tags;
  if (data.published !== undefined) updateData.published = data.published;
  if (data.featured !== undefined) updateData.featured = data.featured;
  if (data.coverImageId !== undefined) {
    updateData.coverImage =
      data.coverImageId === null
        ? { disconnect: true }
        : { connect: { id: data.coverImageId } };
  }

  return prisma.project.update({
    where: { id },
    data: updateData,
    select: projectDetailSelect(),
  });
}

export async function deleteProject(id: string) {
  return prisma.project.delete({
    where: { id },
  });
}

export async function getPublishedTags(): Promise<string[]> {
  const projects = await prisma.project.findMany({
    where: { published: true },
    select: { tags: true },
  });

  const tagSet = new Set<string>();
  for (const project of projects) {
    const tags = project.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    for (const tag of tags) {
      tagSet.add(tag);
    }
  }

  return Array.from(tagSet).sort();
}
