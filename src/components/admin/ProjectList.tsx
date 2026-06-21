'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import type { ProjectWithImages } from '@/types';

interface ProjectListProps {
  projects: ProjectWithImages[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this project and all its images?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete project');
      }

      router.refresh();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeletingId(null);
    }
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-brand-200">
        <p className="text-brand-500 mb-4">No projects yet.</p>
        <Link href="/admin/projects/new">
          <Button>Create Your First Project</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-brand-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-200 bg-brand-50">
              <th className="text-left px-4 py-3 font-medium text-brand-700">Title</th>
              <th className="text-left px-4 py-3 font-medium text-brand-700">Status</th>
              <th className="text-left px-4 py-3 font-medium text-brand-700">Date</th>
              <th className="text-left px-4 py-3 font-medium text-brand-700">Images</th>
              <th className="text-right px-4 py-3 font-medium text-brand-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-brand-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-brand-800">
                      {project.title}
                    </p>
                    <p className="text-xs text-brand-500">/{project.slug}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={project.published ? 'default' : 'outline'}>
                    {project.published ? 'Published' : 'Draft'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-brand-600 whitespace-nowrap">
                  {formatDate(project.date)}
                </td>
                <td className="px-4 py-3 text-brand-600">
                  {project.images.length}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="text-sm text-brand-600 hover:text-brand-800 transition-colors"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/admin/projects/${project.id}/images`}
                      className="text-sm text-brand-600 hover:text-brand-800 transition-colors"
                    >
                      Images
                    </Link>
                    {project.published && (
                      <Link
                        href={`/projects/${project.slug}`}
                        className="text-sm text-brand-600 hover:text-brand-800 transition-colors"
                        target="_blank"
                      >
                        View
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                      loading={deletingId === project.id}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
