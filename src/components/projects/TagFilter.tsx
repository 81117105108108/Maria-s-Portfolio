'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

interface TagFilterProps {
  tags: string[];
  activeTag?: string;
}

export function TagFilter({ tags, activeTag }: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (tags.length === 0) return null;

  function handleTagClick(tag: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');

    if (tag) {
      params.set('tag', tag);
    } else {
      params.delete('tag');
    }

    const queryString = params.toString();
    router.push(`/projects${queryString ? `?${queryString}` : ''}`);
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        onClick={() => handleTagClick(null)}
        className={cn(
          'px-3 py-1.5 text-sm font-medium rounded-full transition-colors',
          !activeTag
            ? 'bg-brand-700 text-white'
            : 'bg-brand-100 text-brand-700 hover:bg-brand-200'
        )}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTagClick(tag)}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-full transition-colors',
            activeTag === tag
              ? 'bg-brand-700 text-white'
              : 'bg-brand-100 text-brand-700 hover:bg-brand-200'
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
