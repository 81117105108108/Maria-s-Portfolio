'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CloudinaryImage } from '@/components/shared/CloudinaryImage';
import { ImageLightbox } from './ImageLightbox';
import type { Image } from '@prisma/client';

interface GalleryImageProps {
  image: Image;
}

export function GalleryImage({ image }: GalleryImageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        ref={imgRef}
        className="relative aspect-[4/3] rounded-lg overflow-hidden bg-brand-100 cursor-pointer group"
        onClick={() => setLightboxOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setLightboxOpen(true);
          }
        }}
      >
        {isVisible && (
          <CloudinaryImage
            publicId={image.publicId}
            alt={image.alt || 'Gallery image'}
            width={600}
            height={450}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </div>

      {lightboxOpen && (
        <ImageLightbox
          image={image}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
