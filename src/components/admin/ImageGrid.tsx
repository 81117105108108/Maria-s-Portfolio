'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CloudinaryImage } from '@/components/shared/CloudinaryImage';
import { Button } from '@/components/ui/Button';
import type { Image } from '@prisma/client';

interface ImageGridProps {
  images: Image[];
  projectId: string;
  coverImageId?: string | null;
}

export function ImageGrid({ images, projectId, coverImageId }: ImageGridProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingCover, setSettingCover] = useState<string | null>(null);

  if (images.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg border border-brand-200 text-center">
        <p className="text-brand-500 text-sm">No images uploaded yet.</p>
      </div>
    );
  }

  async function handleDelete(imageId: string) {
    if (!confirm('Are you sure you want to delete this image?')) return;

    setDeletingId(imageId);
    try {
      const res = await fetch(`/api/projects/${projectId}/images`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete image');
      }

      router.refresh();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSetCover(imageId: string) {
    setSettingCover(imageId);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coverImageId: imageId }),
      });

      if (!res.ok) {
        throw new Error('Failed to set cover image');
      }

      router.refresh();
    } catch (err) {
      console.error('Set cover failed:', err);
    } finally {
      setSettingCover(null);
    }
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {images.map((image) => {
        const isCover = image.id === coverImageId;
        return (
          <div
            key={image.id}
            className={`relative group rounded-lg overflow-hidden border ${
              isCover ? 'border-brand-500 ring-2 ring-brand-500' : 'border-brand-200'
            }`}
          >
            <div className="aspect-square relative bg-brand-100">
              <CloudinaryImage
                publicId={image.publicId}
                alt={image.alt || 'Project image'}
                width={300}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleSetCover(image.id)}
                loading={settingCover === image.id}
                disabled={isCover}
                className="text-xs"
              >
                {isCover ? 'Cover' : 'Set Cover'}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleDelete(image.id)}
                loading={deletingId === image.id}
                className="text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
              >
                Delete
              </Button>
            </div>

            {/* Sort order badge */}
            <span className="absolute top-2 left-2 bg-brand-900/70 text-white text-xs px-1.5 py-0.5 rounded">
              #{image.sortOrder}
            </span>

            {/* Cover badge */}
            {isCover && (
              <span className="absolute top-2 right-2 bg-brand-600 text-white text-xs px-1.5 py-0.5 rounded">
                Cover
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
