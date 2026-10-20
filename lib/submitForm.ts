import { getMailtoHref, getWhatsAppHref, siteConfig } from '@/data/site';

/**
 * ============================================================================
 *  PROVIDER-AGNOSTIC FORM SUBMISSION
 * ============================================================================
 *  The contact form talks to this module only. Swapping providers is a matter
 *  of changing one environment variable — no component code changes.
 *
 *    NEXT_PUBLIC_FORM_PROVIDER = none | formspree | resend | emailjs | supabase | firebase
 *
 *  Transport rules:
 *   • emailjs   → called directly from the browser (public key by design).
 *   • formspree → POSTed to our own /api/contact route (keeps the form id
 *                 server-side and avoids CORS surprises).
 *   • resend / supabase / firebase → server-only adapters in
 *                 lib/formProviders.server.ts, reached through /api/contact.
 *   • none      → the UI never claims success. It shows a clear notice and
 *                 offers a pre-filled WhatsApp / email fallback instead.
 *
 *  Honesty guarantee: `submitProjectRequest` returns `ok: true` ONLY after the
 *  chosen provider has actually accepted the message.
 * ============================================================================
 */

export type FormProvider = 'none' | 'formspree' | 'resend' | 'emailjs' | 'supabase' | 'firebase';

export type SubmitStatus = 'success' | 'unconfigured' | 'invalid' | 'error';

export interface ProjectRequestInput {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
  /** Honeypot — must stay empty. Real users never see it. */
  company?: string;
}

export interface SubmitResult {
  ok: boolean;
  status: SubmitStatus;
  /** Human-readable, safe to render in an aria-live region. */
  message: string;
}

export type FieldErrors = Partial<Record<keyof ProjectRequestInput, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/* -------------------------------------------------------------------------- */
/*  Provider detection                                                        */
/* -------------------------------------------------------------------------- */

const KNOWN_PROVIDERS: FormProvider[] = [
  'formspree',
  'resend',
  'emailjs',
  'supabase',
  'firebase',
];

export function getFormProvider(): FormProvider {
  const raw = (process.env.NEXT_PUBLIC_FORM_PROVIDER ?? 'none').trim().toLowerCase();
  return (KNOWN_PROVIDERS as string[]).includes(raw) ? (raw as FormProvider) : 'none';
}

/** True when the browser-side pieces required by the provider are present. */
export function isFormProviderConfigured(provider: FormProvider = getFormProvider()): boolean {
  switch (provider) {
    case 'emailjs':
      return Boolean(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID &&
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID &&
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      );
    case 'formspree':
      return Boolean(process.env.NEXT_PUBLIC_FORMSPREE_ID);
    case 'resend':
    case 'supabase':
    case 'firebase':
      // Configured server-side; if the keys are missing the API route answers
      // 501 and the form falls back to WhatsApp / email rather than lying.
      return true;
    default:
      return false;
  }
}

/* -------------------------------------------------------------------------- */
/*  Validation                                                                */
/* -------------------------------------------------------------------------- */

export function validateProjectRequest(input: Partial<ProjectRequestInput>): FieldErrors {
  const errors: FieldErrors = {};

  const name = input.name?.trim() ?? '';
  if (name.length < 2) errors.name = 'Please enter your name.';
  else if (name.length > 80) errors.name = 'That name looks a little long.';

  const email = input.email?.trim() ?? '';
  if (!email) errors.email = 'Please enter your email address.';
  else if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.';

  const phone = input.phone?.trim() ?? '';
  if (phone) {
    const digits = phone.replace(/[^\d]/g, '');
    if (digits.length < 7 || digits.length > 15) {
      errors.phone = 'Please enter a valid phone or WhatsApp number.';
    }
  }

  const projectType = input.projectType?.trim() ?? '';
  if (!projectType) errors.projectType = 'Please choose a project type.';
  else if (!(siteConfig.contactSection.projectTypes as readonly string[]).includes(projectType)) {
    errors.projectType = 'Please choose one of the listed project types.';
  }

  const message = input.message?.trim() ?? '';
  if (message.length < 10) errors.message = 'Please add a little more detail (at least 10 characters).';
  else if (message.length > 4000) errors.message = 'Please keep the message under 4000 characters.';

  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

/* -------------------------------------------------------------------------- */
/*  Fallback links (used when no provider is configured)                      */
/* -------------------------------------------------------------------------- */

/** Plain-text version of the enquiry, ready to paste into WhatsApp / email. */
export function buildPrefilledMessage(input: Partial<ProjectRequestInput>): string {
  const lines = [
    'Hi Hey Tech Technologies, I would like to discuss a project.',
    '',
    input.name ? `Name: ${input.name}` : '',
    input.email ? `Email: ${input.email}` : '',
    input.phone ? `Phone/WhatsApp: ${input.phone}` : '',
    input.projectType ? `Project type: ${input.projectType}` : '',
    input.message ? `Details: ${input.message}` : '',
  ].filter(Boolean);

  return lines.join('\n');
}

export interface FallbackLinks {
  whatsapp: string | null;
  mailto: string | null;
}

export function buildFallbackLinks(input: Partial<ProjectRequestInput>): FallbackLinks {
  const message = buildPrefilledMessage(input);
  return {
    whatsapp: getWhatsAppHref(message),
    mailto: getMailtoHref(
      `Project enquiry — ${input.projectType || 'New project'}`,
      message,
    ),
  };
}

/* -------------------------------------------------------------------------- */
/*  Submission                                                                */
/* -------------------------------------------------------------------------- */

const GENERIC_NETWORK_ERROR =
  'Something went wrong while sending. Please try WhatsApp or email instead — nothing was submitted.';

/**
 * Sends a project request through whichever provider is configured.
 * Never resolves with `ok: true` unless the provider accepted it.
 */
export async function submitProjectRequest(
  input: ProjectRequestInput,
): Promise<SubmitResult> {
  const errors = validateProjectRequest(input);
  if (hasErrors(errors)) {
    return {
      ok: false,
      status: 'invalid',
      message: 'Please fix the highlighted fields and try again.',
    };
  }

  // Silently swallow honeypot hits — no network call, no signal to bots.
  if (input.company && input.company.trim() !== '') {
    return { ok: true, status: 'success', message: siteConfig.contactSection.successBody };
  }

  const provider = getFormProvider();

  if (provider === 'none' || !isFormProviderConfigured(provider)) {
    return {
      ok: false,
      status: 'unconfigured',
      message:
        'The online form is not connected yet, so nothing was sent. Use WhatsApp or email below and your details will be pre-filled.',
    };
  }

  const payload = {
    ...input,
    submittedFrom: typeof window !== 'undefined' ? window.location.href : undefined,
    submittedAt: new Date().toISOString(),
  };

  try {
    if (provider === 'emailjs') {
      return await sendWithEmailJS(payload);
    }

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => null)) as
      | { ok?: boolean; status?: string; message?: string }
      | null;

    if (response.ok && data?.ok) {
      return {
        ok: true,
        status: 'success',
        message: data.message ?? siteConfig.contactSection.successBody,
      };
    }

    if (response.status === 501 || data?.status === 'unconfigured') {
      return {
        ok: false,
        status: 'unconfigured',
        message:
          data?.message ??
          'The online form is not connected yet, so nothing was sent. Please use WhatsApp or email instead.',
      };
    }

    if (response.status === 429) {
      return {
        ok: false,
        status: 'error',
        message: 'Too many attempts in a short time. Please try again in a few minutes.',
      };
    }

    return {
      ok: false,
      status: 'error',
      message: data?.message ?? GENERIC_NETWORK_ERROR,
    };
  } catch {
    return { ok: false, status: 'error', message: GENERIC_NETWORK_ERROR };
  }
}

/**
 * EmailJS is safe to call from the browser (service id, template id and public
 * key are all public by design) and needs no npm dependency — their REST
 * endpoint is used directly.
 */
async function sendWithEmailJS(payload: Record<string, unknown>): Promise<SubmitResult> {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    return {
      ok: false,
      status: 'unconfigured',
      message:
        'EmailJS keys are missing, so nothing was sent. Please use WhatsApp or email instead.',
    };
  }

  const input = payload as unknown as ProjectRequestInput;
  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        from_name: input.name,
        reply_to: input.email,
        phone: input.phone || '—',
        project_type: input.projectType,
        message: input.message,
        to_name: siteConfig.companyName,
      },
    }),
  });

  if (response.ok) {
    return { ok: true, status: 'success', message: siteConfig.contactSection.successBody };
  }

  return { ok: false, status: 'error', message: GENERIC_NETWORK_ERROR };
}
