import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProjectForm } from '@/components/admin/ProjectForm';
import type { ProjectWithImages } from '@/types';

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      coverImage: true,
      images: { orderBy: { sortOrder: 'asc' } },
      author: { select: { id: true, name: true, email: true } },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-brand-900">
          Edit Project
        </h1>
        <p className="text-sm text-brand-500 mt-1">
          Update {project.title}
        </p>
      </div>
      <ProjectForm project={project as unknown as ProjectWithImages} />
    </div>
  );
}
