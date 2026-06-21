import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidation-secret');

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const slug = body.slug;

  try {
    if (slug) {
      revalidatePath(`/projects/${slug}`);
    }

    revalidatePath('/');
    revalidatePath('/projects');

    return NextResponse.json({ revalidated: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}
