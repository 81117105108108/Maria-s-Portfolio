'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Pagination } from '@/components/ui/Pagination';
import { TagFilter } from './TagFilter';

interface ProjectsPageClientProps {
  tags: string[];
  activeTag?: string;
  currentPage: number;
  totalPages: number;
  children: React.ReactNode;
}

export function ProjectsPageClient({
  tags,
  activeTag,
  currentPage,
  totalPages,
  children,
}: ProjectsPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/projects?${params.toString()}`);
  }

  return (
    <>
      <TagFilter tags={tags} activeTag={activeTag} />
      {children}
      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}
