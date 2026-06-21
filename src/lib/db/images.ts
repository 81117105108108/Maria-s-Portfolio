import { prisma } from '@/lib/prisma';
import type { AddImageInput } from '@/types';

export async function getImagesByProject(projectId: string) {
  return prisma.image.findMany({
    where: { projectId },
    orderBy: { sortOrder: 'asc' },
  });
}

export async function createImage(data: AddImageInput) {
  return prisma.image.create({ data });
}

export async function deleteImage(id: string) {
  return prisma.image.delete({ where: { id } });
}

export async function setCoverImage(projectId: string, imageId: string) {
  return prisma.project.update({
    where: { id: projectId },
    data: { coverImageId: imageId },
  });
}

export async function updateImageSortOrder(id: string, sortOrder: number) {
  return prisma.image.update({
    where: { id },
    data: { sortOrder },
  });
}
