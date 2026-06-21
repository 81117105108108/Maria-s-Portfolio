import type { Project, Image, User } from '@prisma/client';

export type ProjectWithImages = Project & {
  coverImage?: Image | null;
  images: Image[];
  author?: Pick<User, 'id' | 'name' | 'email'>;
};

export type ProjectCardData = Pick<
  Project,
  'id' | 'slug' | 'title' | 'date' | 'tags' | 'published' | 'featured' | 'coverImageId' | 'createdAt' | 'updatedAt'
> & {
  coverImage?: Image | null;
};

export interface CreateProjectInput {
  title: string;
  slug: string;
  description: string;
  date?: string;
  tags?: string;
  published?: boolean;
  featured?: boolean;
  coverImageId?: string | null;
}

export interface UpdateProjectInput {
  title?: string;
  slug?: string;
  description?: string;
  date?: string;
  tags?: string;
  published?: boolean;
  featured?: boolean;
  coverImageId?: string | null;
}

export type ImageWithProject = Image & {
  project?: Pick<Project, 'id' | 'title' | 'slug'>;
};

export interface AddImageInput {
  url: string;
  publicId: string;
  width?: number | null;
  height?: number | null;
  format?: string | null;
  alt?: string;
  sortOrder?: number;
  projectId: string;
}

export interface PaginatedResult<T> {
  projects: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UploadParams {
  timestamp: number;
  signature: string;
  cloudName: string;
  apiKey: string;
  uploadPreset: string;
}

export interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  totalImages: number;
}
