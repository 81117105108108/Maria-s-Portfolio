import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUploadParams } from '@/lib/cloudinary-upload';

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const params = getUploadParams();
  return NextResponse.json(params);
}
