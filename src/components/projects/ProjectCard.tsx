import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CloudinaryImage } from '@/components/shared/CloudinaryImage';
import { formatDate, truncate } from '@/lib/utils';
import type { ProjectCardData } from '@/types';

interface ProjectCardProps {
  project: ProjectCardData;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const tags = project.tags
    ? project.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <Link href={`/projects/${project.slug}`}>
      <Card hover className="group h-full">
        <div className="aspect-[4/3] relative overflow-hidden bg-brand-100">
          {project.coverImage ? (
            <CloudinaryImage
              publicId={project.coverImage.publicId}
              alt={project.coverImage.alt || project.title}
              width={600}
              height={450}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-brand-300">
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-display text-lg font-semibold text-brand-800 group-hover:text-brand-600 transition-colors">
            {truncate(project.title, 60)}
          </h3>
          <p className="mt-1 text-xs text-brand-500">
            {formatDate(project.date)}
          </p>
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="outline">+{tags.length - 3}</Badge>
              )}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
