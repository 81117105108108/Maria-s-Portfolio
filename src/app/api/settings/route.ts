import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getAllSettings, setSetting } from '@/lib/db/settings';

export async function GET() {
  const settings = await getAllSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    console.log('[settings PUT] session:', session ? 'exists' : 'null', session?.user ? `role=${session.user.role}` : 'no user');
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch (e) {
      console.error('[settings PUT] JSON parse error:', e);
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // Batch upsert: { settings: { key: value, ... } }
    if (body.settings && typeof body.settings === 'object' && !Array.isArray(body.settings)) {
      console.log('[settings PUT] batch upsert, keys:', Object.keys(body.settings));
      for (const [key, value] of Object.entries(body.settings as Record<string, unknown>)) {
        if (typeof value === 'string') {
          await setSetting(key, value);
          console.log(`[settings PUT] saved: ${key} = ${value.substring(0, 30)}`);
        }
      }
      return NextResponse.json({ success: true });
    }

    // Single upsert: { key: string, value: string }
    if (typeof body.key !== 'string' || typeof body.value !== 'string') {
      console.error('[settings PUT] bad payload:', JSON.stringify(body).substring(0, 200));
      return NextResponse.json(
        { error: 'Expected { settings: { ... } } or { key, value }' },
        { status: 400 },
      );
    }

    await setSetting(body.key, body.value);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('PUT /api/settings error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
