import { siteConfig } from '@/data/site';
import type { FormProvider, ProjectRequestInput, SubmitResult } from '@/lib/submitForm';

/**
 * ============================================================================
 *  SERVER-SIDE FORM ADAPTERS
 * ============================================================================
 *  Imported ONLY by app/api/contact/route.ts, so secret keys never reach the
 *  browser bundle.
 *
 *  Every adapter returns the same shape, so adding a provider means adding one
 *  function here plus one case in `dispatchSubmission`.
 *
 *  Adding a new provider: implement `sendWithX`, add it to `SERVER_PROVIDERS`,
 *  then set NEXT_PUBLIC_FORM_PROVIDER / FORM_PROVIDER to its name.
 * ============================================================================
 */

interface AdapterContext {
  input: ProjectRequestInput;
  /** Client IP, forwarded to providers that support it (spam signals). */
  ip: string;
  userAgent: string;
}

type Adapter = (ctx: AdapterContext) => Promise<SubmitResult>;

export const SERVER_PROVIDERS: FormProvider[] = [
  'formspree',
  'resend',
  'supabase',
  'firebase',
];

function plainTextBody(input: ProjectRequestInput): string {
  return [
    `New project request from the ${siteConfig.companyName} website`,
    '',
    `Name:         ${input.name}`,
    `Email:        ${input.email}`,
    `Phone/WA:     ${input.phone || '—'}`,
    `Project type: ${input.projectType}`,
    '',
    'Message:',
    input.message,
  ].join('\n');
}

function ok(message?: string): SubmitResult {
  return {
    ok: true,
    status: 'success',
    message: message ?? siteConfig.contactSection.successBody,
  };
}

function fail(message: string): SubmitResult {
  return { ok: false, status: 'error', message };
}

/** Which server-side provider is active. FORM_PROVIDER wins, then the public one. */
export function resolveServerProvider(): FormProvider {
  const raw = (
    process.env.FORM_PROVIDER ??
    process.env.NEXT_PUBLIC_FORM_PROVIDER ??
    'none'
  )
    .trim()
    .toLowerCase();

  const known: FormProvider[] = [
    'formspree',
    'resend',
    'emailjs',
    'supabase',
    'firebase',
    'none',
  ];
  return (known as string[]).includes(raw) ? (raw as FormProvider) : 'none';
}

/* -------------------------------------------------------------------------- */
/*  Formspree — https://formspree.io                                          */
/* -------------------------------------------------------------------------- */
const sendWithFormspree: Adapter = async ({ input }) => {
  const id = process.env.NEXT_PUBLIC_FORMSPREE_ID || process.env.FORMSPREE_ID;
  if (!id) return fail('Formspree is not configured (missing form id).');

  const response = await fetch(`https://formspree.io/f/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      phone: input.phone || '—',
      projectType: input.projectType,
      message: input.message,
      _subject: `New project request — ${input.projectType}`,
      _replyto: input.email,
    }),
  });

  if (!response.ok) {
    return fail('Formspree rejected the submission. Please try WhatsApp or email.');
  }
  return ok();
};

/* -------------------------------------------------------------------------- */
/*  Resend — https://resend.com                                               */
/* -------------------------------------------------------------------------- */
const sendWithResend: Adapter = async ({ input }) => {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || siteConfig.contact.email;
  const from = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';

  if (!apiKey) return fail('Resend is not configured (missing RESEND_API_KEY).');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `${siteConfig.companyName} Website <${from}>`,
      to: [to],
      reply_to: input.email,
      subject: `New project request — ${input.projectType}`,
      text: plainTextBody(input),
    }),
  });

  if (!response.ok) {
    return fail('The mail provider rejected the message. Please try WhatsApp or email.');
  }
  return ok();
};

/* -------------------------------------------------------------------------- */
/*  Supabase — https://supabase.com  (insert into a `project_requests` table) */
/* -------------------------------------------------------------------------- */
const sendWithSupabase: Adapter = async ({ input, ip, userAgent }) => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const table = process.env.SUPABASE_CONTACT_TABLE || 'project_requests';

  if (!url || !key) {
    return fail('Supabase is not configured (missing URL or service role key).');
  }

  // Expected table (SQL):
  //   create table project_requests (
  //     id uuid primary key default gen_random_uuid(),
  //     created_at timestamptz default now(),
  //     name text, email text, phone text,
  //     project_type text, message text,
  //     ip text, user_agent text
  //   );
  const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      project_type: input.projectType,
      message: input.message,
      ip,
      user_agent: userAgent,
    }),
  });

  if (!response.ok) {
    return fail('The database rejected the submission. Please try WhatsApp or email.');
  }
  return ok();
};

/* -------------------------------------------------------------------------- */
/*  Firebase — Firestore REST (no admin SDK dependency required)              */
/* -------------------------------------------------------------------------- */
const sendWithFirebase: Adapter = async ({ input }) => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const apiKey = process.env.FIREBASE_API_KEY;
  const collection = process.env.FIREBASE_CONTACT_COLLECTION || 'projectRequests';

  if (!projectId || !apiKey) {
    return fail('Firebase is not configured (missing project id or API key).');
  }

  // NOTE: a public REST write path is only acceptable with Firestore security
  // rules that restrict this collection to create-only writes. For anything
  // stricter, use the Firebase Admin SDK in this adapter instead.
  const endpoint = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collection}?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fields: {
        name: { stringValue: input.name },
        email: { stringValue: input.email },
        phone: { stringValue: input.phone || '' },
        projectType: { stringValue: input.projectType },
        message: { stringValue: input.message },
        createdAt: { timestampValue: new Date().toISOString() },
      },
    }),
  });

  if (!response.ok) {
    return fail('Firestore rejected the submission. Please try WhatsApp or email.');
  }
  return ok();
};

/* -------------------------------------------------------------------------- */
/*  Dispatcher                                                                */
/* -------------------------------------------------------------------------- */

const ADAPTERS: Record<string, Adapter> = {
  formspree: sendWithFormspree,
  resend: sendWithResend,
  supabase: sendWithSupabase,
  firebase: sendWithFirebase,
};

export async function dispatchSubmission(ctx: AdapterContext): Promise<SubmitResult> {
  const provider = resolveServerProvider();

  if (provider === 'none' || provider === 'emailjs') {
    // 'emailjs' is handled entirely in the browser.
    return {
      ok: false,
      status: 'unconfigured',
      message:
        'The online form is not connected yet, so nothing was sent. Please use WhatsApp or email below — your details stay in the form and can be pre-filled.',
    };
  }

  const adapter = ADAPTERS[provider];
  if (!adapter) {
    return { ok: false, status: 'unconfigured', message: 'No form provider is configured.' };
  }

  try {
    return await adapter(ctx);
  } catch {
    return {
      ok: false,
      status: 'error',
      message: 'The form provider could not be reached. Please try WhatsApp or email.',
    };
  }
}
