import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ProjectList } from '@/components/admin/ProjectList';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      coverImage: true,
      images: { orderBy: { sortOrder: 'asc' } },
    },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-brand-900">
            Projects
          </h1>
          <p className="text-sm text-brand-500 mt-1">
            Manage your portfolio projects
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button>New Project</Button>
        </Link>
      </div>

      <ProjectList projects={projects as unknown as any[]} />
    </div>
  );
}
