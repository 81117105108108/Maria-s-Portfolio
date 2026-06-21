import { prisma } from '@/lib/prisma';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { ProjectList } from '@/components/admin/ProjectList';
import type { DashboardStats as DashboardStatsType } from '@/types';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [totalProjects, publishedProjects, draftProjects, totalImages] =
    await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { published: true } }),
      prisma.project.count({ where: { published: false } }),
      prisma.image.count(),
    ]);

  const stats: DashboardStatsType = {
    totalProjects,
    publishedProjects,
    draftProjects,
    totalImages,
  };

  const recentProjects = await prisma.project.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 5,
    include: {
      coverImage: true,
      images: { orderBy: { sortOrder: 'asc' } },
    },
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-brand-900">
          Dashboard
        </h1>
        <p className="text-sm text-brand-500 mt-1">
          Overview of your portfolio
        </p>
      </div>

      <DashboardStats stats={stats} />

      <div>
        <h2 className="text-lg font-semibold text-brand-800 mb-4">
          Recent Projects
        </h2>
        <ProjectList
          projects={recentProjects as unknown as any[]}
        />
      </div>
    </div>
  );
}
