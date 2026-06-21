'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CloudinaryImageProps {
  publicId?: string;
  url?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

function buildCloudinaryUrl(publicId: string, width: number, height: number): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
  const transformations = `f_auto,q_auto,w_${width},h_${height},c_fill`;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
}

export function CloudinaryImage({
  publicId,
  url,
  alt,
  width,
  height,
  className,
  priority = false,
}: CloudinaryImageProps) {
  const imgSrc = publicId
    ? buildCloudinaryUrl(publicId, width * 2, height * 2) // 2x for retina
    : url || '';

  if (!imgSrc) {
    return (
      <div
        className={cn('bg-brand-100 flex items-center justify-center', className)}
        style={{ aspectRatio: `${width}/${height}` }}
      >
        <svg
          className="h-8 w-8 text-brand-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={cn('transition-opacity duration-300', className)}
      priority={priority}
      sizes={`(max-width: 640px) 100vw, (max-width: 1024px) 50vw, ${width}px`}
    />
  );
}
