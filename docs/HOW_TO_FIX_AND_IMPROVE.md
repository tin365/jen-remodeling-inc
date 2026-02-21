# How to Fix and Improve — Step-by-Step Guide

This guide walks you through each fix and improvement from the production audit. Items already done in code are marked **Done**; the rest are configuration or optional steps.

---

## 1. Database length constraints (abuse prevention)

**Status: Done in code — you must run the migration.**

A migration was added to cap field lengths so huge payloads are rejected by the database.

**Steps:**

1. Apply the migration to your Supabase database:
   - **Option A (CLI):** From project root run:
     ```bash
     supabase db push
     ```
   - **Option B (Dashboard):** In Supabase Dashboard → SQL Editor, paste and run the contents of `supabase/migrations/002_length_constraints.sql`.

2. Confirm constraints exist:
   - In Table Editor, try inserting a contact with `message` longer than 10,000 characters (or review `text` > 5,000). It should fail.

**What was added:**

- `contact_submissions`: message ≤ 10,000; name ≤ 200; email ≤ 255; phone ≤ 50.
- `reviews`: text ≤ 5,000; name ≤ 200.

---

## 2. Env vars and secrets discipline

**Status: Partially done.**

- **Done:** `.env.example` added with placeholders (no real secrets). `.gitignore` already has `.env*.local`.
- **You should:**
  1. Never commit `.env.local` or any file containing real keys.
  2. Use GitHub Actions **Variables** (not Secrets) for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` so the build gets them (you already do this).
  3. Add **secret scanning** in CI (e.g. GitHub → Settings → Code security and analysis → enable “Secret scanning”).

---

## 3. Supabase Auth rate limiting

**Status: Configuration (Supabase Dashboard).**

Reduces brute-force on the admin login form and keeps auth stable under traffic.

**Steps:**

1. In **Supabase Dashboard** go to **Authentication** → **Rate Limits**.
2. Set values (per your project: admin-only login, no public sign-up, no SMS/Web3):

| Setting | Current (typical) | Recommended for JEN | Why |
|--------|--------------------|----------------------|-----|
| **Emails (per hour)** | 2 | **5–10** | You use Resend for contact/review notifications; this is only for Supabase auth emails (e.g. password reset). Slightly higher so an admin can trigger a couple of resets if needed. |
| **SMS (per hour)** | 30 | **30** (leave) | Not used; no change. |
| **Token refreshes (per 5 min per IP)** | 150 | **60–100** | Session refresh. Few admins = lower is fine; reduces abuse from one IP. |
| **Token verifications / OTP (per 5 min per IP)** | 30 | **10–15** | If you ever use magic link or OTP, this limits verification attempts. Lower = stricter. |
| **Anonymous sign-ins (per hour per IP)** | 30 | **30** (leave) | You don’t use anonymous auth; leave as is. |
| **Sign-ups and sign-ins (per 5 min per IP)** | 30 | **5–10** | **Most important.** Admin login only. 5–10 attempts per 5 min per IP makes brute-force impractical; real admins rarely need more. |
| **Web3 sign-ups/sign-ins** | 30 | **30** (leave) | Not used; no change. |

3. Click **Save changes**. No code changes required.

---

## 4. CAPTCHA on forms (contact, review, admin login)

**Status: Optional — add when you want to reduce spam and bot login attempts.**

### GitHub Pages hostname and Cloudflare Turnstile

If your site is at **https://tin365.github.io/jen-remodeling-inc/**, Cloudflare Turnstile often **does not accept** the hostname `tin365.github.io` when you add it in the widget/dashboard. Many CAPTCHA providers treat `*.github.io` as a shared, unverifiable domain and won’t allow it.

**Options:**

1. **Use a custom domain (recommended if you want Turnstile)**  
   - Add a domain you own (e.g. `www.jenremodeling.com`) and point it to GitHub Pages (CNAME to `tin365.github.io` or use GitHub’s custom domain docs).  
   - In Cloudflare Turnstile, add that custom domain (e.g. `jenremodeling.com` or `www.jenremodeling.com`). The widget will then be valid on that hostname.

2. **Use another CAPTCHA that allows github.io**  
   - Some providers (e.g. [hCaptcha](https://www.hcaptcha.com/), or Google reCAPTCHA in some configurations) may allow `tin365.github.io`. Check their dashboard when adding the domain. Results can vary.

3. **Skip CAPTCHA and rely on other controls**  
   - You already have **Supabase Auth rate limiting** (sign-ins per 5 min) and **DB length constraints**. For a small marketing site, that’s often enough.  
   - Add CAPTCHA later when you have a custom domain or if you see real spam/abuse.

### If you use Turnstile (e.g. with a custom domain)

1. Sign up at [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/).
2. Create a widget (e.g. “Managed” or “Non-interactive”); get the **site key** and **secret key**.
3. In the Turnstile dashboard, add only **domains you own** (e.g. `jenremodeling.com`). Do not use `tin365.github.io` if it’s not accepted.
4. Add to `.env.local` (and to GitHub Actions Variables for production):
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY=<site key>`
   - Do **not** put the secret key in `NEXT_PUBLIC_*`; use it only server-side (e.g. in a Supabase Edge Function or future API route).
5. In the app:
   - Load the Turnstile script and add the widget to the contact form, review form, and admin login form.
   - On submit, send the Turnstile token to your backend and verify it with Turnstile’s API (secret key) before inserting contact/review or signing in.

**Minimal client-only check:** You can show the widget and require it before enabling submit; without server-side verification bots can still bypass it, so prefer verification in an Edge Function or API.

---

## 5. Error tracking (e.g. Sentry)

**Status: Placeholder in code — you add the SDK and DSN.**

`src/lib/error-reporting.ts` is a stub that logs errors; the root `error.tsx` calls `reportError(error)` so unhandled React errors are at least logged. To get real error tracking:

**Steps:**

1. Create a project at [sentry.io](https://sentry.io) (or self-hosted Sentry).
2. Install the Sentry SDK for Next.js:
   ```bash
   npm install @sentry/nextjs
   ```
3. Run Sentry’s wizard (if they provide one) or add in your app:
   - `sentry.client.config.ts` and `sentry.server.config.ts` (and `sentry.edge.config.ts` if you use Edge).
   - In the client config, set `dsn: process.env.NEXT_PUBLIC_SENTRY_DSN`.
4. Add **client-side** capture in `src/lib/error-reporting.ts`:
   - Import `* as Sentry from '@sentry/nextjs'` and call `Sentry.captureException(err)` when `NEXT_PUBLIC_SENTRY_DSN` is set.
5. Add `NEXT_PUBLIC_SENTRY_DSN` to `.env.local` and to GitHub Actions Variables for production builds.
6. Keep the existing `reportError(error)` call in `app/error.tsx` so boundary errors are reported.

---

## 6. Uptime / health check

**Status: External setup.**

So you know when the site or Supabase is down.

**Steps:**

1. Use a free uptime checker (e.g. UptimeRobot, Better Stack, or GitHub Actions cron).
2. Add two checks:
   - **Site:** e.g. `https://<your-github-pages-url>/` (expect 200).
   - **Supabase:** e.g. ping your Supabase project URL or a simple “health” request if you add one (or just the site; if the site loads and uses Supabase, a failure will show up in Sentry).
3. Configure alerts (email/Slack) when a check fails.

---

## 7. Admin route mitigation (defense in depth)

**Status: Partially done.**

- **Done:** Admin bundle is lazy-loaded via `next/dynamic` so the admin UI and Supabase logic are in a separate chunk; the main bundle is smaller for non-admin users.
- **Optional:** With static export you cannot run real middleware at request time. You can:
  - **Obscure the path:** Move admin to a non-obvious path (e.g. `/manage` or a random segment) and update the link you give to admins. This doesn’t protect the data (RLS does) but reduces casual discovery.
  - **Later:** If you move to a host with a server (e.g. Vercel), add middleware that returns 404 or redirects for `/admin` when the user is not authenticated.

---

## 8. API layer and hooks (maintainability)

**Status: Done in code.**

- **`src/lib/api/`:** Centralized Supabase calls:
  - `contact.ts` — `submitContact()`
  - `reviews.ts` — `fetchReviews()`, `submitReview()`
  - `projects.ts` — `fetchProjects()`
- **`src/lib/types.ts`:** Shared types for `Project`, `Review`, `ContactSubmissionInput`.
- **`src/hooks/useProjects.ts`** and **`src/hooks/useReviews.ts`:** Data-fetching hooks used by the Projects and Reviews pages.
- **Contact** uses `submitContact()` and enforces max lengths in validation.
- **Projects** uses `useProjects()` and shows **ProjectsSkeleton** while loading.
- **Reviews** uses `useReviews()` and `submitReview()`, and shows **ReviewsSkeleton** while loading.

You can extend this pattern: add more functions in `lib/api/` and reuse hooks where it helps.

---

## 9. Loading skeletons

**Status: Done in code.**

- **ProjectsSkeleton** and **ReviewsSkeleton** are used on the Projects and Reviews pages so layout doesn’t jump when data loads.
- Admin page shows a simple loading spinner while the admin chunk loads (dynamic import).

---

## 10. Client-side validation aligned with DB

**Status: Done in code.**

- Contact form: message max length 10,000 and name max 200 are validated and sent via `submitContact()` (which also slices lengths before insert).
- Review form: text max 5,000 is validated before `submitReview()` (and the API slices before insert).
- DB migration enforces the same limits so invalid data is rejected even if client is bypassed.

---

## 11. Backup and migrations

**Status: Documentation and process.**

- **Backups:** Supabase handles backups on paid plans. Document how to restore (Supabase docs) and, if critical, consider occasional exports (e.g. `pg_dump`) to external storage.
- **Migrations:** You have `supabase/migrations/` and optional SQL files like `storage-project-images.sql`. Decide how you apply them (e.g. `supabase db push` or run in SQL Editor) and document it; optionally run migrations from CI if you use a safe workflow.

---

## 12. Optional: CI secret scanning

**Status: Configuration.**

- In the repo on GitHub: **Settings** → **Code security and analysis** → enable **Secret scanning**.
- Reduces risk of committing secrets; no code changes.

---

## Quick checklist (production readiness)

- [ ] Run `002_length_constraints.sql` (or `supabase db push`).
- [ ] Confirm `.env.local` is never committed; build uses GitHub Actions Variables.
- [ ] Enable Supabase Auth rate limiting (Dashboard).
- [ ] (Recommended) Add CAPTCHA on contact, review, and admin login and verify server-side.
- [ ] (Recommended) Add Sentry (or similar) and set `NEXT_PUBLIC_SENTRY_DSN`.
- [ ] Add at least one uptime check for the site (and optionally Supabase).
- [ ] Document backup/restore and how you run Supabase migrations.

After these, the site is in a good state for production at low-to-moderate traffic. For more (e.g. server-side rate limiting, MFA for admin), see the 30/90-day roadmap in `docs/PRODUCTION_AUDIT.md`.
