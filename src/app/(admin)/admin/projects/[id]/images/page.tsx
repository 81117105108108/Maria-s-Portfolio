import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { ImageGrid } from '@/components/admin/ImageGrid';
import { Button } from '@/components/ui/Button';

interface ManageImagesPageProps {
  params: {
    id: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function ManageImagesPage({
  params,
}: ManageImagesPageProps) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-brand-900">
            Manage Images
          </h1>
          <p className="text-sm text-brand-500 mt-1">{project.title}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/projects/${params.id}`}>
            <Button variant="secondary" size="sm">
              Edit Project
            </Button>
          </Link>
        </div>
      </div>

      <ImageUploader projectId={params.id} />

      <div>
        <h2 className="text-lg font-semibold text-brand-800 mb-4">
          Gallery Images ({project.images.length})
        </h2>
        <ImageGrid
          images={project.images}
          projectId={params.id}
          coverImageId={project.coverImageId}
        />
      </div>
    </div>
  );
}
