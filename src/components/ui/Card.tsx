'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  hover?: boolean;
  className?: string;
  as?: 'div' | 'article';
}

export function Card({
  children,
  hover = false,
  className,
  as: Tag = 'div',
}: CardProps) {
  return (
    <Tag
      className={cn(
        'bg-white rounded-lg border border-brand-200 overflow-hidden',
        hover && 'transition-shadow hover:shadow-md',
        className
      )}
    >
      {children}
    </Tag>
  );
}
