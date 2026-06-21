import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/validation';
import { rateLimit } from '@/lib/rate-limit';

const contactLimiter = rateLimit({
  maxRequests: 3,
  windowMs: 60 * 1000, // 1 minute
});

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  const rateCheck = contactLimiter.check(`contact:${ip}`);

  if (!rateCheck.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  const body = await request.json();
  const parsed = contactFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message || 'Invalid input' },
      { status: 400 }
    );
  }

  const { name, email, message } = parsed.data;

  // Log to console for now (can be extended to send email)
  console.log('=== Contact Form Submission ===');
  console.log(`Name: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Message: ${message}`);
  console.log('===============================');

  return NextResponse.json({
    success: true,
    message: 'Thank you for your message. I will get back to you soon.',
  });
}
