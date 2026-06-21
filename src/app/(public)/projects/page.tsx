import { getProjects, getPublishedTags } from '@/lib/db/projects';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import { ProjectsPageClient } from '@/components/projects/ProjectsPageClient';
import { PROJECTS_PER_PAGE } from '@/lib/constants';

interface ProjectsPageProps {
  searchParams: {
    page?: string;
    tag?: string;
  };
}

export const revalidate = 60;

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const page = parseInt(searchParams.page || '1', 10);
  const tag = searchParams.tag;

  const { projects, pagination } = await getProjects({
    page,
    limit: PROJECTS_PER_PAGE,
    tag,
    published: true,
  });

  const allTags = await getPublishedTags();

  return (
    <div className="container-page py-12 md:py-16 animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-900 mb-2">
        Projects
      </h1>
      <p className="text-brand-500 mb-8">
        A curated collection of my work.
      </p>

      <ProjectsPageClient
        tags={allTags}
        activeTag={tag}
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
      >
        <ProjectGrid projects={projects} />
      </ProjectsPageClient>
    </div>
  );
}
