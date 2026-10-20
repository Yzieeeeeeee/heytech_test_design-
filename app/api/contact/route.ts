import { NextResponse } from 'next/server';
import { dispatchSubmission, resolveServerProvider } from '@/lib/formProviders.server';
import { validateProjectRequest, hasErrors, type ProjectRequestInput } from '@/lib/submitForm';

/**
 * POST /api/contact
 * ---------------------------------------------------------------------------
 * Server-side half of the contact form. It exists so provider keys never touch
 * the browser bundle and so we can answer honestly when nothing is configured:
 *
 *   200 → provider accepted the message
 *   400 → validation failed
 *   429 → rate limited
 *   501 → no provider configured (the UI then offers WhatsApp / email)
 *   502 → provider rejected or was unreachable
 *
 * Minimal in-memory rate limiting is included to blunt casual spam on a
 * serverless deployment; swap it for Upstash/Redis if traffic grows.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;
const buckets = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (buckets.get(ip) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);
  recent.push(now);
  buckets.set(ip, recent);

  // Opportunistic cleanup so the map cannot grow without bound.
  if (buckets.size > 500) {
    for (const [key, timestamps] of buckets) {
      if (timestamps.every((timestamp) => now - timestamp > WINDOW_MS)) buckets.delete(key);
    }
  }

  return recent.length > MAX_REQUESTS;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return request.headers.get('x-real-ip') ?? 'unknown';
}

export async function POST(request: Request) {
  let body: Partial<ProjectRequestInput>;

  try {
    body = (await request.json()) as Partial<ProjectRequestInput>;
  } catch {
    return NextResponse.json(
      { ok: false, status: 'invalid', message: 'Malformed request body.' },
      { status: 400 },
    );
  }

  const input: ProjectRequestInput = {
    name: (body.name ?? '').toString().slice(0, 120),
    email: (body.email ?? '').toString().slice(0, 200),
    phone: (body.phone ?? '').toString().slice(0, 40),
    projectType: (body.projectType ?? '').toString().slice(0, 80),
    message: (body.message ?? '').toString().slice(0, 5000),
    company: (body.company ?? '').toString(),
  };

  const errors = validateProjectRequest(input);
  if (hasErrors(errors)) {
    return NextResponse.json(
      {
        ok: false,
        status: 'invalid',
        message: 'Please check the highlighted fields and try again.',
        errors,
      },
      { status: 400 },
    );
  }

  // Honeypot: answer 200 so bots cannot distinguish a trap from a success,
  // but never forward the message anywhere.
  if (input.company && input.company.trim() !== '') {
    return NextResponse.json({ ok: true, status: 'success', message: 'Received.' }, { status: 200 });
  }

  const ip = clientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        ok: false,
        status: 'error',
        message: 'Too many requests from this connection. Please try again later.',
      },
      { status: 429 },
    );
  }

  if (resolveServerProvider() === 'none') {
    return NextResponse.json(
      {
        ok: false,
        status: 'unconfigured',
        message:
          'The online form is not connected yet, so nothing was sent. Please use WhatsApp or email instead — your details can be pre-filled.',
      },
      { status: 501 },
    );
  }

  const result = await dispatchSubmission({
    input,
    ip,
    userAgent: request.headers.get('user-agent') ?? 'unknown',
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}

export function GET() {
  return NextResponse.json(
    { ok: false, message: 'Use POST to submit a project request.' },
    { status: 405 },
  );
}
