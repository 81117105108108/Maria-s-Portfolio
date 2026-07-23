'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface ImageUploaderProps {
  projectId: string;
}

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const COMPRESS_THRESHOLD = 3 * 1024 * 1024; // 3MB — compress larger files

/**
 * Compress image client-side using Canvas.
 * Resize to max 2560px longest edge, JPEG 85% quality.
 * Balance: good compression, no visible graininess.
 */
function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);

      let { width, height } = img;
      const MAX_DIM = 2560;

      if (width > MAX_DIM || height > MAX_DIM) {
        if (width > height) {
          height = Math.round((height / width) * MAX_DIM);
          width = MAX_DIM;
        } else {
          width = Math.round((width / height) * MAX_DIM);
          height = MAX_DIM;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Image compression failed'));
        },
        'image/jpeg',
        0.85
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image for compression'));
    };
    img.src = URL.createObjectURL(file);
  });
}

export function ImageUploader({ projectId }: ImageUploaderProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setSuccess(false);

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(
        'Unsupported file type. Allowed: JPEG, PNG, WebP, AVIF, GIF.'
      );
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      setError('File too large. Maximum 10MB.');
      return;
    }

    setUploading(true);

    try {
      // Compress if above threshold
      let uploadFile: File = file;

      if (file.size > COMPRESS_THRESHOLD) {
        const compressed = await compressImage(file);
        const baseName = file.name.replace(/\.[^.]+$/, '');
        uploadFile = new File([compressed], `${baseName}.jpg`, {
          type: 'image/jpeg',
        });
      }

      // Upload to server
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('projectId', projectId);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Upload failed');
      }

      setSuccess(true);
      router.refresh();

      // Reset input
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  return (
    <div
      className="p-6 bg-white rounded-lg border border-brand-200"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <h3 className="text-lg font-semibold text-brand-800 mb-2">
        Upload Images
      </h3>
      <p className="text-sm text-brand-500 mb-4">
        Upload an image. Files over 3MB are automatically compressed at high
        quality — no graininess.
      </p>

      <div className="space-y-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          onChange={handleFileSelect}
          disabled={uploading}
          className="block w-full text-sm text-brand-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 disabled:opacity-50"
        />

        <p className="text-xs text-brand-400">
          or drag and drop an image onto this card
        </p>

        {uploading && (
          <div className="flex items-center gap-2 text-sm text-brand-600">
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Uploading and processing...
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}

        {success && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
            Image uploaded successfully!
          </p>
        )}
      </div>
    </div>
  );
}
