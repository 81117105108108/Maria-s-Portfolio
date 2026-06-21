'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { slugify } from '@/lib/utils';
import type { ProjectWithImages } from '@/types';

interface ProjectFormProps {
  project?: ProjectWithImages | null;
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const isEditing = !!project;

  const [title, setTitle] = useState(project?.title || '');
  const [slug, setSlug] = useState(project?.slug || '');
  const [description, setDescription] = useState(project?.description || '');
  const [date, setDate] = useState(
    project?.date
      ? new Date(project.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [tags, setTags] = useState(project?.tags || '');
  const [published, setPublished] = useState(project?.published ?? false);
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    if (!slugManuallyEdited && !isEditing && title) {
      setSlug(slugify(title));
    }
  }, [title, slugManuallyEdited, isEditing]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const body = {
      title,
      slug,
      description,
      date,
      tags,
      published,
      featured,
    };

    try {
      const url = isEditing
        ? `/api/projects/${project!.id}`
        : '/api/projects';

      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'create'} project`);
      }

      const data = await res.json();
      router.push(`/admin/projects/${data.id}/images`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <Input
        label="Slug"
        value={slug}
        onChange={(e) => {
          setSlug(e.target.value);
          setSlugManuallyEdited(true);
        }}
        helperText="URL-friendly identifier. Auto-generated from title if not edited."
        required
      />

      <div>
        <label className="block text-sm font-medium text-brand-700 mb-1">
          Description (Markdown)
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={12}
          required
        />
      </div>

      <Input
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <Input
        label="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="e.g. portrait, landscape, event"
        helperText="Separate tags with commas"
      />

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="rounded border-brand-300 text-brand-700 focus:ring-brand-500"
          />
          <span className="text-sm font-medium text-brand-700">Published</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="rounded border-brand-300 text-brand-700 focus:ring-brand-500"
          />
          <span className="text-sm font-medium text-brand-700">Featured</span>
        </label>
      </div>

      {isEditing && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-brand-500">
            Cover image and gallery images can be managed after saving.
          </span>
        </div>
      )}

      <div className="flex items-center gap-3 pt-4 border-t border-brand-200">
        <Button type="submit" loading={loading}>
          {isEditing ? 'Update Project' : 'Create Project'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
