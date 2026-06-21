import { notFound } from 'next/navigation';
import { getProjectBySlug } from '@/lib/db/projects';
import { ProjectDetail } from '@/components/projects/ProjectDetail';
import { SITE_NAME } from '@/lib/constants';
import type { Metadata } from 'next';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);

  if (!project || !project.published) {
    return { title: 'Project Not Found' };
  }

  return {
    title: project.title,
    description:
      project.description?.slice(0, 160) || `${project.title} — ${SITE_NAME}`,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug);

  if (!project || !project.published) {
    notFound();
  }

  return (
    <div className="container-page py-12 md:py-16">
      <ProjectDetail project={project} />
    </div>
  );
}
