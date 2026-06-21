'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface ImageUploaderProps {
  projectId: string;
}

interface UploadParams {
  timestamp: number;
  signature: string;
  cloudName: string;
  apiKey: string;
  uploadPreset: string;
}

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (error: unknown, result: { event: string; info: Record<string, unknown> }) => void
      ) => { open: () => void };
    };
  }
}

export function ImageUploader({ projectId }: ImageUploaderProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [uploadParams, setUploadParams] = useState<UploadParams | null>(null);

  useEffect(() => {
    async function fetchParams() {
      try {
        const res = await fetch('/api/upload');
        if (res.ok) {
          const data = await res.json();
          setUploadParams(data);
        }
      } catch {
        console.error('Failed to fetch upload params');
      }
    }

    fetchParams();
  }, []);

  useEffect(() => {
    // Load Cloudinary Upload Widget script
    if (!document.getElementById('cloudinary-script')) {
      const script = document.createElement('script');
      script.id = 'cloudinary-script';
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  function openUploadWidget() {
    if (!uploadParams || !window.cloudinary) return;

    setUploading(true);
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: uploadParams.cloudName,
        apiKey: uploadParams.apiKey,
        uploadPreset: uploadParams.uploadPreset,
        timestamp: uploadParams.timestamp,
        signature: uploadParams.signature,
        sources: ['local', 'camera', 'url'],
        multiple: true,
        maxFileSize: 10 * 1024 * 1024,
        showAdvancedOptions: false,
        cropping: false,
        folder: 'maria-portfolio',
      },
      async (error, result) => {
        if (!error && result.event === 'success' && result.info) {
          const info = result.info as Record<string, unknown>;

          try {
            const res = await fetch(`/api/projects/${projectId}/images`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                url: info.secure_url,
                publicId: info.public_id,
                width: info.width || null,
                height: info.height || null,
                format: info.format || null,
                alt: '',
                sortOrder: 0,
                projectId,
              }),
            });

            if (!res.ok) {
              console.error('Failed to save image');
            }
          } catch (err) {
            console.error('Failed to save image', err);
          }
        }

        if (result.event === 'queue-end') {
          setUploading(false);
          router.refresh();
        }
      }
    );

    widget.open();
  }

  return (
    <div className="p-6 bg-white rounded-lg border border-brand-200">
      <h3 className="text-lg font-semibold text-brand-800 mb-2">Upload Images</h3>
      <p className="text-sm text-brand-500 mb-4">
        Upload images directly to Cloudinary. Supported formats: JPEG, PNG, WebP, AVIF.
      </p>
      <Button
        type="button"
        onClick={openUploadWidget}
        loading={uploading}
        disabled={!uploadParams}
      >
        {uploadParams ? 'Select Images' : 'Loading uploader...'}
      </Button>
      {!uploadParams && (
        <p className="mt-2 text-xs text-brand-400">
          Fetching upload parameters...
        </p>
      )}
    </div>
  );
}
