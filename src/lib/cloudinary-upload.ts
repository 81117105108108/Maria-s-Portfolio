import crypto from 'crypto';

export interface UploadParams {
  timestamp: number;
  signature: string;
  cloudName: string;
  apiKey: string;
  uploadPreset: string;
}

export function getUploadParams(): UploadParams {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
  const apiKey = process.env.CLOUDINARY_API_KEY || '';
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || '';

  const params: Record<string, string | number> = {
    timestamp,
    upload_preset: uploadPreset,
  };

  const sortedKeys = Object.keys(params).sort();
  const signatureString = sortedKeys
    .map((key) => `${key}=${params[key]}`)
    .join('&') + (process.env.CLOUDINARY_API_SECRET || '');

  const signature = crypto
    .createHash('sha1')
    .update(signatureString)
    .digest('hex');

  return {
    timestamp,
    signature,
    cloudName,
    apiKey,
    uploadPreset,
  };
}
