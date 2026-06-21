import { CloudinaryImage } from '@/components/shared/CloudinaryImage';
import { Badge } from '@/components/ui/Badge';
import { Markdown } from '@/components/shared/Markdown';
import { formatDate } from '@/lib/utils';
import { GalleryImage } from './GalleryImage';
import type { ProjectWithImages } from '@/types';

interface ProjectDetailProps {
  project: ProjectWithImages;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const tags = project.tags
    ? project.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <article className="animate-fade-in">
      {/* Cover image */}
      {project.coverImage && (
        <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-brand-100 mb-8">
          <CloudinaryImage
            publicId={project.coverImage.publicId}
            alt={project.coverImage.alt || project.title}
            width={1200}
            height={675}
            className="object-cover w-full h-full"
            priority
          />
        </div>
      )}

      {/* Title & meta */}
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-900">
          {project.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <time className="text-sm text-brand-500" dateTime={project.date.toISOString()}>
            {formatDate(project.date)}
          </time>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mt-8 prose prose-brand max-w-none">
          <Markdown content={project.description} />
        </div>

        {/* Image gallery */}
        {project.images.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-display font-semibold text-brand-800 mb-6">
              Gallery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.images
                .filter((img) => img.id !== project.coverImageId)
                .map((image) => (
                  <GalleryImage key={image.id} image={image} />
                ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
