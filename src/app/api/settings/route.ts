import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getAllSettings, setSetting } from '@/lib/db/settings';

export async function GET() {
  const settings = await getAllSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  // Batch upsert: { settings: { key: value, ... } }
  if (body.settings && typeof body.settings === 'object') {
    for (const [key, value] of Object.entries(body.settings)) {
      if (typeof value === 'string') {
        await setSetting(key, value);
      }
    }
    return NextResponse.json({ success: true });
  }

  // Single upsert: { key: string, value: string }
  if (!body.key || typeof body.value !== 'string') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  await setSetting(body.key, body.value);
  return NextResponse.json({ success: true });
}
