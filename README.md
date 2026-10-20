# Hey Tech Technologies — Website

The official website for **Hey Tech Technologies**, an independent, two-founder freelance
technology studio founded in 2026.

> **Small team. Serious work. Big ideas.**

Built with **Next.js (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion**, deployed on
Vercel. Server components by default, minimal client JavaScript, dark mode as the house default.

---

## 1. Quick start

```bash
npm install        # install dependencies
npm run dev        # start the dev server → http://localhost:3000
npm run build      # production build
npm start          # run the production build locally
npm run typecheck  # tsc --noEmit
npm run assets     # regenerate favicons + project artwork (optional, see §7)
```

Requirements: **Node.js 18.18+** (20.x recommended) and npm.

---

## 2. Environment variables

Copy the example file and edit it:

```bash
cp .env.example .env.local
```

Nothing here is required to *run* the site — every variable degrades gracefully.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | recommended | Canonical URLs, `sitemap.xml`, `robots.txt`, Open Graph, JSON-LD. Use `https://your-domain.com` in production. |
| `NEXT_PUBLIC_FORM_PROVIDER` | optional | `none` \| `formspree` \| `resend` \| `emailjs` \| `supabase` \| `firebase`. Defaults to `none`. |
| `NEXT_PUBLIC_FORMSPREE_ID` | for Formspree | Public Formspree form id. |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` / `_TEMPLATE_ID` / `_PUBLIC_KEY` | for EmailJS | All three are client-side values by design. |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | for Resend | **Server-only.** Never prefix with `NEXT_PUBLIC_`. |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | for Supabase | Server-only. Inserts into `project_requests`. |
| `FIREBASE_PROJECT_ID`, `FIREBASE_API_KEY`, `FIREBASE_CONTACT_COLLECTION` | for Firebase | Firestore REST adapter. |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | optional | Reserved. Analytics is **off by default**; nothing is loaded. |

> `NEXT_PUBLIC_SITE_URL` is the only variable most deployments need.

---

## 3. Editing content — `data/site.ts`

`data/site.ts` is the single source of truth. You should not need to touch a component to change
copy. It holds: company details, tagline, founders, email, WhatsApp, GitHub, Instagram, LinkedIn,
services, tech stack, projects, process steps, testimonials, nav links and the contact copy.

### 3.1 Contact details and socials

```ts
contact: {
  email: 'YOUR_EMAIL@example.com',        // → hello@heytech.tech
  whatsapp: 'YOUR_WHATSAPP_NUMBER',       // → 919876543210  (digits only, with country code, no +)
  phoneDisplay: '',                        // → '+91 98765 43210' (optional, shown in the footer)
  responseNote: 'We usually reply within a day or two.',
},
socials: {
  github: 'YOUR_GITHUB_URL',              // → https://github.com/your-org
  instagram: 'YOUR_INSTAGRAM_URL',
  linkedin: 'YOUR_LINKEDIN_URL',
},
```

**Placeholder safety.** Any value still starting with `YOUR_` (or containing `example.com`) is
treated as *not configured* by `isConfigured()`. Those buttons render disabled/hidden with a
"link to be added" hint, the floating WhatsApp button does not render, and JSON-LD omits the
field — no dead links, no fake contact details.

The WhatsApp link is always `https://wa.me/{number}` and is built by `getWhatsAppHref()`, which
pre-fills a message.

### 3.2 Founders

```ts
founders: [
  {
    name: 'Muhammed Yasir',
    initials: 'MY',
    role: 'Co-Founder — Software Development',
    focus: 'Software Development',
    bio: '…',
    photo: undefined,        // ← see §4 to add a real photo
    socials: { github: '…', linkedin: '…', instagram: '' },
  },
  …
]
```

Leave `photo: undefined` and the card renders the styled gradient-initials avatar (never a
generated face). Social icons only render for values that are real URLs.

### 3.3 Projects

Five filters (`ALL / MOBILE / WEB / BACKEND / UI/UX`) and every card, counter and detail dialog are
derived from the `projects` array. To add real work, copy an entry and fill it in:

```ts
{
  id: 'campus-connect',                 // unique, used for React keys + ARIA ids
  name: 'Campus Connect',
  summary: 'One-line description shown on the card.',
  description: 'Longer copy shown inside the “View Details” dialog.',
  category: 'Mobile',                   // 'Mobile' | 'Web' | 'Backend' | 'UI/UX'
  tags: ['Flutter', 'Firebase'],
  image: '/projects/campus-connect.png',// first-party artwork (see §7)
  imageAlt: 'Describe the image for screen readers.',
  year: '2026',                          // optional
  github: 'https://github.com/…',        // optional — button only appears if present
  liveUrl: 'https://…',                  // optional
}
```

Then delete the four `isPlaceholder: true` slots. The "these cards are placeholders" notice and the
per-card "Placeholder slot" badge disappear automatically once no placeholder entries remain, and
an empty-state panel appears whenever a filter has no matches.

### 3.4 Testimonials

`testimonials` ships empty on purpose, so the section shows an honest empty state instead of
invented praise. Add real, permissioned feedback and the section renders quote cards automatically:

```ts
testimonials: [
  {
    id: 't1',
    quote: 'They turned our rough idea into a working app in a few weeks.',
    authorName: 'Client Name',
    authorRole: 'Founder, Company',
    context: 'Web app · 2026',   // optional
  },
],
```

### 3.5 Everything else

| Want to change… | Edit this key |
| --- | --- |
| Nav links | `nav`, `footer.links` |
| Hero heading / paragraph / status pill / code cards | `hero` |
| About copy, timeline, Idea → Delivery flow | `about` |
| Service cards (title, description, hover bullets) | `services` |
| Stack badges and their neutral descriptors | `techStack` |
| Student track steps and disclaimer | `students` |
| Business chips and CTA | `businesses` |
| Process steps | `process` |
| "Why Hey Tech?" cards | `whyCards` |
| GitHub section copy | `github` |
| Contact copy, project types, success message | `contactSection`, `contact` |
| SEO title / description / keywords | `seo` |
| Default theme, storage key, system-preference behaviour | `theme` |

---

## 4. Adding real founder photos

1. Put the image in `public/founders/` — e.g. `public/founders/muhammed-yasir.jpg`
   (square, ideally 800×800 or larger; JPG or WebP).
2. Point the founder at it:

```ts
photo: '/founders/muhammed-yasir.jpg',
```

`components/ui/Avatar.tsx` swaps the initials avatar for an optimised `next/image` automatically,
with lazy loading, correct `sizes` and alt text of the form `"<Name>, Co-Founder at Hey Tech
Technologies"`. No other changes required. Delete the key (or set `undefined`) to go back.

---

## 5. Connecting the contact form

The form never fakes a success. `lib/submitForm.ts` validates, then dispatches through a
provider-agnostic adapter layer; `app/api/contact/route.ts` + `lib/formProviders.server.ts` handle
the server side. Swapping providers means changing **one env variable**.

```
Browser ──validate──► lib/submitForm.ts ──► provider adapter
                        │                     ├── emailjs        (browser → EmailJS REST)
                        │                     └── /api/contact   (server → formspree | resend | supabase | firebase)
                        └── formspree/resend/supabase/firebase
```

With `NEXT_PUBLIC_FORM_PROVIDER` unset (or `none`), submitting shows a clear notice — *the online
form is not connected yet, so nothing was sent* — and offers pre-filled **WhatsApp** and **email**
links containing everything the visitor typed.

### Formspree (fastest to set up)

```bash
NEXT_PUBLIC_FORM_PROVIDER=formspree
NEXT_PUBLIC_FORMSPREE_ID=xyzabcd
```

Sent via `/api/contact`, so the id stays out of the client bundle.

### Resend (own your email)

```bash
NEXT_PUBLIC_FORM_PROVIDER=resend
RESEND_API_KEY=re_…
CONTACT_TO_EMAIL=hello@your-domain.com
CONTACT_FROM_EMAIL=onboarding@resend.dev   # verify your domain for a custom from-address
```

### EmailJS (no server needed)

```bash
NEXT_PUBLIC_FORM_PROVIDER=emailjs
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_…
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_…
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=…
```

Template variables received: `from_name`, `reply_to`, `phone`, `project_type`, `message`, `to_name`.

### Supabase

Create the table, then set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` and
`NEXT_PUBLIC_FORM_PROVIDER=supabase`:

```sql
create table project_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text, email text, phone text,
  project_type text, message text,
  ip text, user_agent text
);
```

### Firebase (Firestore)

Set `FIREBASE_PROJECT_ID`, `FIREBASE_API_KEY`, `FIREBASE_CONTACT_COLLECTION` and
`NEXT_PUBLIC_FORM_PROVIDER=firebase`. Rules must allow create-only writes to that collection, or
replace the adapter with the Admin SDK.

### Adding another provider

Add a `sendWithX` function in `lib/formProviders.server.ts`, register it in `ADAPTERS`, and add the
name to `FormProvider` in `lib/submitForm.ts`. The UI needs no changes.

Built-in protections: inline accessible validation, `aria-live` status, honeypot field, in-memory
IP rate limit (5 requests / 10 min per IP — swap for Upstash in production), and `501` from the API
when nothing is configured so the client can offer the WhatsApp fallback instead of lying.

---

## 6. Deploying to Vercel

1. Push the repository to GitHub/GitLab/Bitbucket.
2. In Vercel: **Add New → Project → Import** the repo. The framework preset (Next.js) is detected;
   no build settings need changing.
3. Add environment variables (Production + Preview):
   - `NEXT_PUBLIC_SITE_URL=https://your-domain.com`
   - your form provider keys, if any
4. **Deploy**, then attach the custom domain under *Settings → Domains*.
5. Re-deploy (or edit the env var) so the canonical URL, `sitemap.xml`, `robots.txt` and OG tags
   use the production domain.

Local production check before shipping:

```bash
npm run build && npm start
```

---

## 7. Artwork and icons

There is no stock photography anywhere on this site — every image is generated from the brand
palette:

- **Project cards** — `public/projects/project-{mobile,web,backend,uiux}.png`, four distinct
  abstract compositions (1600×1000), each rendering an abstract wireframe in the accent gradient.
- **Icons** — `public/favicon.svg` (HT monogram), `favicon.ico`, `apple-icon.png`, `icon-192.png`,
  `icon-512.png`.
- **Open Graph image** — generated at build time by `app/opengraph-image.tsx` (1200×630), so it can
  never drift out of sync with the brand.

To regenerate after changing brand colours, edit the `BRAND` object in
`scripts/generate-assets.mjs` and run:

```bash
npm run assets
```

The generated files are committed, so a plain `npm install && npm run build` works without ever
running this script. To use a real screenshot for a project instead, drop it in `public/projects/`
and point that project's `image` field at it.

**Bundled font.** `assets/fonts/SpaceGrotesk-Bold.ttf` is a static 700-weight instance of Space
Grotesk (SIL Open Font License 1.1, licence text alongside it). It is used only by
`app/opengraph-image.tsx` so that social preview images render in the brand typeface without any
build-time network request. The website itself uses `next/font/google`, which self-hosts the
webfonts at build time.

---

## 8. Project structure

```
app/               routes, metadata, OG image, robots, sitemap, manifest, 404, API
components/ui/     design-system primitives (Button, Dialog, ThemeToggle, Chip, …)
components/sections/ one file per page section
components/seo/    JSON-LD structured data
assets/fonts/      display font bundled for OG image generation (OFL)
data/site.ts       ← all content lives here
lib/               form submission, theme, motion tokens, hooks, helpers
public/            generated artwork + icons
scripts/           asset generator
styles/globals.css design tokens, theme mapping, motion, reduced-motion rules
```

---

## 9. Design, accessibility and performance notes

**Theme.** Dark by default, light on request. An inline pre-paint script in `app/layout.tsx` applies
the stored choice (or the OS preference on a first visit) before the first paint, so there is no
theme flash and no hydration mismatch. The choice is saved under `heytech-theme` in `localStorage`.

**Accessibility.** Semantic landmarks, one `h1`, ordered headings, skip links, visible focus rings,
keyboard-operable nav/filters/toggle, focus-trapped mobile menu and project dialog, `aria-live` form
status, labelled fields with inline errors, alt text on every image, and 44px minimum tap targets.

**Motion.** Only `transform` and `opacity` are animated. `prefers-reduced-motion: reduce` disables
non-essential motion, the cursor glow and the heavier hero effects; reduced-motion visitors get the
final visual state on first paint.

**Performance.** Server components by default with client code pushed to leaf components, `next/font`
self-hosting (no external font requests), `next/image` with AVIF/WebP, lazy loading, and no
third-party scripts. Analytics is off by default.

---

## 10. Content honesty rules

This project deliberately contains **no** fake statistics, client counts, testimonials, awards,
client logos, certifications, partnerships, government approvals or invented projects. Please keep
it that way when you add content:

- Projects are labelled "Placeholder slot" until real work replaces them.
- Testimonials render only what you add to config; the empty state is intentional.
- The student track promises development support, technical guidance, prototyping and project
  learning — no university affiliation, no submission service, no grade guarantees.
- Tech stack badges describe what each tool is used for, never proficiency levels.

---

## 11. License

© 2026 Hey Tech Technologies. All rights reserved.
