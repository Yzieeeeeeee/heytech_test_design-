'use client';

import { useCallback, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { siteConfig } from '@/data/site';
import { Button } from '@/components/ui/Button';
import { Alert, Check, Mail, WhatsApp } from '@/components/ui/icons';
import { Slash } from '@/components/ui/Slash';
import {
  buildFallbackLinks,
  getFormProvider,
  isFormProviderConfigured,
  submitProjectRequest,
  validateProjectRequest,
  type FieldErrors,
  type ProjectRequestInput,
  type SubmitStatus,
} from '@/lib/submitForm';
import { cn } from '@/lib/utils';

/**
 * ContactForm
 * ---------------------------------------------------------------------------
 * Accessibility & honesty contract:
 *  • Every field has a real <label>, inline error text wired via
 *    aria-describedby, and `aria-invalid` when it fails validation.
 *  • Status changes are announced through a polite live region.
 *  • A success state is only ever shown after the provider confirmed delivery.
 *  • With no provider configured the form says so up front and offers
 *    pre-filled WhatsApp / email fallbacks carrying the typed-in details.
 */

type Status = 'idle' | SubmitStatus | 'submitting';

const EMPTY: ProjectRequestInput = {
  name: '',
  email: '',
  phone: '',
  projectType: '',
  message: '',
  company: '', // honeypot
};

export function ContactForm() {
  const uid = useId();
  const reduceMotion = useReducedMotion();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [values, setValues] = useState<ProjectRequestInput>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [notice, setNotice] = useState<string>('');

  const providerConfigured = useMemo(() => isFormProviderConfigured(getFormProvider()), []);
  const provider = useMemo(() => getFormProvider(), []);
  const fallback = useMemo(() => buildFallbackLinks(values), [values]);
  const isSubmitting = status === 'submitting';

  const fieldId = (name: string) => `${uid}-${name}`;
  const errorId = (name: string) => `${uid}-${name}-error`;

  const setField = useCallback(
    (name: keyof ProjectRequestInput, value: string) => {
      setValues((current) => ({ ...current, [name]: value }));
      setTouched((current) => ({ ...current, [name]: true }));
      // Clear an existing error as soon as the user starts correcting it.
      setErrors((current) => {
        if (!current[name]) return current;
        const next = { ...current };
        delete next[name];
        return next;
      });
      if (status === 'success' || status === 'unconfigured') setStatus('idle');
    },
    [status],
  );

  const blurField = useCallback((name: keyof ProjectRequestInput) => {
    setTouched((current) => ({ ...current, [name]: true }));
    setErrors((current) => {
      const fresh = validateProjectRequest({ ...values });
      // Re-run validation for this single field against the latest values.
      if (fresh[name]) return { ...current, [name]: fresh[name] };
      const next = { ...current };
      delete next[name];
      return next;
    });
  }, [values]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const clientErrors = validateProjectRequest(values);
      setErrors(clientErrors);
      setTouched({
        name: true,
        email: true,
        phone: true,
        projectType: true,
        message: true,
      });

      if (Object.keys(clientErrors).length > 0) {
        setStatus('idle');
        setNotice('Please check the highlighted fields.');
        // Move focus to the first problem so keyboard users are not stranded.
        const firstKey = Object.keys(clientErrors)[0];
        if (firstKey) {
          const el = formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(fieldId(firstKey))}`);
          el?.focus();
        }
        return;
      }

      setStatus('submitting');
      setNotice('');

      const result = await submitProjectRequest(values);

      if (result.ok) {
        setStatus('success');
        setNotice(result.message);
        setValues(EMPTY);
        setTouched({});
        setErrors({});
        return;
      }

      setStatus(result.status === 'unconfigured' ? 'unconfigured' : 'error');
      setNotice(result.message);
    },
    [values, uid],
  );

  const showError = (name: keyof ProjectRequestInput) => Boolean(touched[name] && errors[name]);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5"
      aria-describedby={`${uid}-form-status`}
    >
      {/* Live region — polite, so it never interrupts typing -------------- */}
      <p
        id={`${uid}-form-status`}
        aria-live="polite"
        aria-atomic="true"
        className={cn(
          'border px-4 py-3.5 text-sm',
          status === 'idle' || status === 'submitting'
            ? 'sr-only'
            : status === 'success'
              ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--fg-strong)]'
              : 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--fg-strong)]',
        )}
      >
        {notice}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id={fieldId('name')}
          errorId={errorId('name')}
          label="Name"
          required
          error={showError('name') ? errors.name : undefined}
        >
          <input
            id={fieldId('name')}
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(event) => setField('name', event.target.value)}
            onBlur={() => blurField('name')}
            aria-invalid={showError('name') || undefined}
            aria-describedby={showError('name') ? errorId('name') : undefined}
            placeholder="Your full name"
            maxLength={80}
            className={inputClass(showError('name'))}
          />
        </Field>

        <Field
          id={fieldId('email')}
          errorId={errorId('email')}
          label="Email"
          required
          error={showError('email') ? errors.email : undefined}
        >
          <input
            id={fieldId('email')}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => setField('email', event.target.value)}
            onBlur={() => blurField('email')}
            aria-invalid={showError('email') || undefined}
            aria-describedby={showError('email') ? errorId('email') : undefined}
            placeholder="you@company.com"
            className={inputClass(showError('email'))}
          />
        </Field>

        <Field
          id={fieldId('phone')}
          errorId={errorId('phone')}
          label="Phone / WhatsApp"
          hint="Optional — helps us reply faster."
          error={showError('phone') ? errors.phone : undefined}
        >
          <input
            id={fieldId('phone')}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(event) => setField('phone', event.target.value)}
            onBlur={() => blurField('phone')}
            aria-invalid={showError('phone') || undefined}
            aria-describedby={showError('phone') ? errorId('phone') : `${fieldId('phone')}-hint`}
            placeholder="+91 00000 00000"
            className={inputClass(showError('phone'))}
          />
        </Field>

        <Field
          id={fieldId('projectType')}
          errorId={errorId('projectType')}
          label="Project type"
          required
          error={showError('projectType') ? errors.projectType : undefined}
        >
          <div className="relative">
            <select
              id={fieldId('projectType')}
              name="projectType"
              value={values.projectType}
              onChange={(event) => setField('projectType', event.target.value)}
              onBlur={() => blurField('projectType')}
              aria-invalid={showError('projectType') || undefined}
              aria-describedby={showError('projectType') ? errorId('projectType') : undefined}
              className={cn(inputClass(showError('projectType')), 'appearance-none pr-10')}
            >
              <option value="" disabled>
                Select an option
              </option>
              {siteConfig.contactSection.projectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <span
              aria-hidden
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[0.7rem] text-[var(--muted-2)]"
            >
              ▼
            </span>
          </div>
        </Field>
      </div>

      <Field
        id={fieldId('message')}
        errorId={errorId('message')}
        label="Message"
        required
        error={showError('message') ? errors.message : undefined}
        hint={`${values.message.length}/4000`}
      >
        <textarea
          id={fieldId('message')}
          name="message"
          rows={5}
          value={values.message}
          onChange={(event) => setField('message', event.target.value)}
          onBlur={() => blurField('message')}
          aria-invalid={showError('message') || undefined}
          aria-describedby={showError('message') ? errorId('message') : `${fieldId('message')}-hint`}
          placeholder="Tell us what you want to build, who it is for, and any timeline you have in mind."
          maxLength={4000}
          className={cn(inputClass(showError('message')), 'resize-y min-h-[8.5rem]')}
        />
      </Field>

      {/* Honeypot — hidden from humans and assistive tech ------------------ */}
      <div className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden>
        <label htmlFor={fieldId('company')}>Company (leave empty)</label>
        <input
          id={fieldId('company')}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(event) => setField('company', event.target.value)}
        />
      </div>

      {/* Provider notice ------------------------------------------------- */}
      {!providerConfigured && status !== 'success' && (
        <p className="flex items-start gap-3 border border-[var(--line)] bg-[var(--panel-2)] p-4 text-[0.72rem] leading-relaxed text-[var(--muted-2)]">
          <Slash size="h-3" className="mt-1 shrink-0" />
          <span>
            The online form is not connected to a mail provider yet (provider:{' '}
            <code className="rounded bg-[var(--elevated)] px-1.5 py-0.5 font-mono text-[0.7rem]">
              {provider}
            </code>
            ), so it will not pretend to send. Submitting will prepare your message and hand you a
            pre-filled WhatsApp or email link instead.
          </span>
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="submit"
          size="lg"
          loading={isSubmitting}
          disabled={isSubmitting}
          magnetic
          className="w-full sm:w-auto"
        >
          {isSubmitting ? 'Sending…' : siteConfig.contactSection.submitLabel}
        </Button>

        <p className="font-mono text-[0.62rem] uppercase leading-relaxed tracking-[0.12em] text-[var(--muted-2)]">
          We use your details only to reply to this enquiry.
          <br className="hidden sm:block" /> {siteConfig.contact.responseNote}
        </p>
      </div>

      {/* Unconfigured fallback -------------------------------------------- */}
      <AnimatePresence>
        {status === 'unconfigured' && (
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4 border border-[var(--line-strong)] bg-[var(--panel-2)] p-5"
          >
            <p className="eyebrow">
              <Slash size="h-3" />
              Send it directly instead
            </p>
            <p className="text-sm text-[var(--muted)]">
              Your details are kept in the form above and are pre-filled into these links — tap one
              and press send. Nothing was submitted yet.
            </p>
            <div className="flex flex-wrap gap-3">
              {fallback.whatsapp && (
                <Button href={fallback.whatsapp} size="sm" variant="primary">
                  <WhatsApp width={16} height={16} />
                  Send on WhatsApp
                </Button>
              )}
              {fallback.mailto && (
                <Button href={fallback.mailto} size="sm" variant="secondary">
                  <Mail width={16} height={16} />
                  Send by email
                </Button>
              )}
              {!fallback.whatsapp && !fallback.mailto && (
                <p className="text-xs text-[var(--muted-2)]">
                  Contact details have not been configured yet — add them in{' '}
                  <code className="rounded bg-[var(--elevated)] px-1.5 py-0.5 font-mono text-[0.7rem]">
                    data/site.ts
                  </code>
                  .
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Genuine success -------------------------------------------------- */}
        {status === 'success' && (
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-start gap-4 border border-[var(--accent)] bg-[var(--accent-soft)] p-5"
          >
            <span
              aria-hidden
              className="flex h-8 w-8 shrink-0 items-center justify-center bg-[var(--accent)] text-white"
            >
              <Check width={17} height={17} />
            </span>
            <span>
              <span className="block font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--fg-strong)]">
                {siteConfig.contactSection.successTitle}
              </span>
              <span className="mt-1 block text-sm text-[var(--muted)]">
                {siteConfig.contactSection.successBody}
              </span>
            </span>
          </motion.div>
        )}

        {/* Hard error ------------------------------------------------------ */}
        {status === 'error' && (
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32 }}
            className="flex items-start gap-3 border border-[var(--accent)] bg-[var(--accent-soft)] p-5"
          >
            <Alert width={18} height={18} className="mt-0.5 shrink-0 text-[var(--accent)]" />
            <span className="text-sm text-[var(--muted)]">
              {notice || 'The message could not be sent.'}{' '}
              {fallback.whatsapp && (
                <a
                  href={fallback.whatsapp}
                  className="font-semibold text-[var(--accent-text)] underline underline-offset-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Try WhatsApp
                </a>
              )}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <noscript>
        <p className="border border-[var(--line)] bg-[var(--panel-2)] p-4 text-[0.72rem] leading-relaxed text-[var(--muted-2)]">
          This form needs JavaScript. With it disabled, please reach us directly from the contact
          links beside this form.
        </p>
      </noscript>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/*  Field primitives                                                          */
/* -------------------------------------------------------------------------- */

function inputClass(hasError: boolean): string {
  return cn(
    'w-full border bg-[var(--panel-2)] px-4 py-3.5 text-sm text-[var(--fg-strong)]',
    'placeholder:text-[var(--muted-2)] transition-colors duration-200',
    'focus:bg-[var(--panel)] focus:outline-none',
    hasError
      ? 'border-[var(--accent)] focus:border-[var(--accent)]'
      : 'border-[var(--line)] focus:border-[var(--line-strong)]',
  );
}

function Field({
  id,
  errorId,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  errorId: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="flex items-baseline justify-between gap-2 font-mono text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[var(--muted)]"
      >
        <span>
          {label}
          {required && (
            <span aria-hidden className="ml-1 text-[var(--accent-text)]">
              *
            </span>
          )}
          {required && <span className="sr-only"> (required)</span>}
        </span>
        {hint && (
          <span id={`${id}-hint`} className="text-[0.68rem] font-normal normal-case tracking-normal text-[var(--muted-2)]">
            {hint}
          </span>
        )}
      </label>

      {children}

      {error && (
        <p id={errorId} role="alert" className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-[var(--accent-text)]">
          <Alert width={13} height={13} />
          {error}
        </p>
      )}
    </div>
  );
}

export default ContactForm;
