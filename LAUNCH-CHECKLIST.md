# Pre-launch checklist

Everything the site ships with is either real, or visibly marked as a placeholder. This is the
list of placeholders to replace before you point a domain at it.

---

## 1. Non-negotiable — contact details

Edit `data/site.ts`:

- [ ] `contact.email` → `'YOUR_EMAIL@example.com'` becomes your real address
      (e.g. `hello@heytechtechnologies.com`). Unlocks: contact card, footer email, `mailto:`
      fallback, JSON-LD `email`, and the email fallback button.
- [ ] `contact.whatsapp` → `'YOUR_WHATSAPP_NUMBER'` becomes digits with country code only
      (e.g. `919876543210` — no `+`, spaces or dashes). Unlocks: the floating WhatsApp button,
      the WhatsApp contact card, the footer icon and the form's WhatsApp fallback.
- [ ] `contact.phoneDisplay` → set a human-readable number (e.g. `'+91 98765 43210'`) or leave
      empty to hide the phone row in the footer.
- [ ] `contact.responseNote` → adjust the reply promise if "a day or two" is not accurate.

## 2. Social links

- [ ] `socials.github` → `'YOUR_GITHUB_URL'`. Unlocks: footer icon, contact card, the
      **Explore our code** button (currently disabled), and per-project GitHub buttons.
- [ ] `socials.instagram` → `'YOUR_INSTAGRAM_URL'`.
- [ ] `socials.linkedin` → `'YOUR_LINKEDIN_URL'`. Also used in the founders' JSON-LD.
- [ ] Founder socials in `founders[].socials` → the same URLs per person (or leave `''` to hide
      that icon on that card).

> Any value left as `YOUR_…` stays hidden/disabled with a "link to be added" hint. Nothing breaks.

## 3. Deployment

- [ ] `.env.local` (and Vercel env vars): `NEXT_PUBLIC_SITE_URL=https://your-domain.com`
- [ ] Deploy once more after setting it, so canonical URLs, `sitemap.xml`, `robots.txt` and OG
      tags all use the production domain.
- [ ] Optional: connect a form provider (see README §5). Until then the contact form honestly says
      it is not connected and offers pre-filled WhatsApp / email instead.

## 4. Content to add as it becomes real

- [ ] `projects` — replace the four `isPlaceholder: true` entries with real work (name, summary,
      description, category, tags, image, links). The "placeholder" badges and notices disappear on
      their own once none are left.
- [ ] `founders[].photo` — add real portraits to `public/founders/` and set the path.
- [ ] `testimonials` — add real, permissioned feedback; the empty state is intentional until then.
- [ ] `about.timeline` — add milestone entries as they happen (the only entry is "founded in 2026").

## 5. Sanity check before you announce

- [ ] Mobile: 320 / 360 / 390 / 430px — no horizontal scroll, buttons reachable with a thumb.
- [ ] Both themes — toggle on a real phone, then reload: the choice sticks and there is no flash.
- [ ] Submit the contact form once: confirm you either receive the message, or that it clearly says
      it is not connected.
- [ ] WhatsApp button opens a chat with your number and a sensible pre-filled message.
- [ ] Share the domain in a WhatsApp/Slack chat and check the link preview uses the HT artwork.
- [ ] `npm run build` passes with no errors.
- [ ] Read the page once as a stranger: is every claim something you can back up today?

---

## Deliberately NOT included (keep it that way)

No fake statistics, client counts, "trusted by thousands", years of experience, client logos,
awards, certifications, university partnerships, government approval, invented projects, fake
testimonials, "24/7" promises, or company-suffix legal claims. Hey Tech is a new, honest,
two-founder studio — the site is written to read that way.
