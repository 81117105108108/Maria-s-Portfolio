'use client';

import React, { useEffect, useCallback } from 'react';
import { CloudinaryImage } from '@/components/shared/CloudinaryImage';
import type { Image } from '@prisma/client';

interface ImageLightboxProps {
  image: Image;
  onClose: () => void;
}

export function ImageLightbox({ image, onClose }: ImageLightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white transition-colors"
        aria-label="Close lightbox"
      >
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Image */}
      <div
        className="max-w-[90vw] max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <CloudinaryImage
          publicId={image.publicId}
          alt={image.alt || 'Lightbox image'}
          width={image.width || 1200}
          height={image.height || 800}
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
          priority
        />
        {image.alt && (
          <p className="mt-2 text-center text-sm text-white/70">
            {image.alt}
          </p>
        )}
      </div>
    </div>
  );
}
