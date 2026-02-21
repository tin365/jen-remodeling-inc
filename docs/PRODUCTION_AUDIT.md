# JEN Remodeling Inc — Production-Level Technical Audit

**Audit date:** February 2025  
**Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Supabase, static export (GitHub Pages)  
**Scope:** Architecture, security, performance, DevOps, scalability, code quality, UX/A11y

---

## 1. Executive Summary

### Project maturity level: **Intermediate (leaning Production-ready for low traffic)**

The project is a coherent marketing site with contact form, reviews, portfolio, and an admin dashboard. It is **not** Enterprise-ready. For a small business site with moderate traffic it can be production-ready **after** addressing the critical and high-severity items below.

### Biggest technical risks

1. **Admin protection is client-only** — `/admin` is a client-rendered page; anyone can load it. Data is protected by RLS, but the UI and login form are exposed to enumeration and brute-force (no server-side gate, no rate limiting).
2. **Static export + Supabase anon key in bundle** — `NEXT_PUBLIC_*` vars are baked into the client bundle; anon key is public by design but all app logic (including admin) relies on it. No API layer to hide or rotate secrets.
3. **No rate limiting** — Contact form, review submission, and auth are directly against Supabase. Supabase has limits but no application-level throttling; abuse can exhaust quotas or trigger Supabase throttling.
4. **No monitoring or error tracking** — Failures in production are invisible unless you manually check; no Sentry, no structured logging, no uptime checks.
5. **Database constraints missing for abuse** — No max length on `contact_submissions.message` or `reviews.text`; no DB-level rate or spam mitigation.

### Top 5 urgent fixes

| # | Fix | Why |
|---|-----|-----|
| 1 | Add **Supabase Auth rate limiting** (Dashboard → Auth → Rate Limits) and optionally **CAPTCHA** (e.g. Turnstile) on contact + review forms | Prevent brute-force on admin login and form spam. |
| 2 | Add **DB constraints**: `CHECK (char_length(message) <= 10000)` on contact `message`, similar for review `text`; consider `CHECK (char_length(name) <= 200)` etc. | Prevent huge payloads and some abuse. |
| 3 | **Never commit** `.env.local` (verify it’s in `.gitignore`; it is, but ensure no accidental commit). Use **GitHub Actions Variables** for build (you already do). Add **Secrets scanning** in CI. | Prevent credential leak. |
| 4 | Add **error tracking** (e.g. Sentry) and a **health/uptime check** (e.g. Supabase + GitHub Pages URL) so you know when the site or DB is down. | Production visibility. |
| 5 | **Admin route**: Add a **middleware** (or, if you move off static export, a server check) that at least returns 404 or redirects for `/admin` when not authenticated — so the admin UI isn’t trivially discoverable. With static export, middleware runs at build time for `output: 'export'` in a limited way; consider a simple “admin discovery” mitigation (e.g. obscure path or post-login redirect). | Defense in depth; reduces attack surface. |

### Security risk level: **Medium–High**

- **Critical:** No service role key in frontend (good). RLS is enabled and policies are correct for the intended model.
- **High:** Admin is client-only; auth and forms have no rate limiting or CAPTCHA; no server-side validation layer.
- **Medium:** Env vars are public by design (anon key); ensure no other secrets use `NEXT_PUBLIC_`.

### Scalability risk level: **Low–Medium for current scope**

- Static site scales with CDN (GitHub Pages); Supabase handles DB and auth.
- At **1k–10k users** you’ll hit Supabase free tier limits (DB size, bandwidth, auth MAU); no application-level caching or connection pooling to optimize.
- At **100k users** you need Supabase Pro, CDN caching for API responses (you don’t have an API layer), and possibly edge/serverless for sensitive ops.

### Overall score: **58 / 100**

- **Security:** 55  
- **Architecture:** 52  
- **Performance:** 62  
- **DevOps:** 50  
- **Maintainability:** 68  

---

## 2. Architecture Deep Review (Next.js Focus)

### App Router usage

- **Correct use:** You use the App Router with `app/` layout, `layout.tsx`, `page.tsx` per route, and `metadata` exports. Root layout is a Server Component; it only imports `LayoutSwitcher`, which is a Client Component.
- **Issue:** With `output: 'export'`, every page is pre-rendered at build time. There are **no** server-only API routes or Server Actions at runtime; all data fetching is **client-side** via the single Supabase client.

### Server vs Client separation

- **Root layout:** Server Component (good).
- **Pages (home, services, projects, reviews, contact):** Server Components that only render a single client component (`Landing`, `Services`, `Projects`, `Reviews`, `Contact`). So the **page** is server-rendered once at build, but the **data** (Supabase) is fetched on the client after hydration. For a static export this is expected.
- **Admin page:** Entirely `'use client'` — necessary because of auth state and interactivity. The downside is the whole admin bundle (including Supabase calls) is client-side; there is no server-side “is this user admin?” check before sending HTML.

**Verdict:** Separation is reasonable for a static export. The only “unnecessary” client boundary is that **every** data-dependent view is behind a client component (Reviews, Projects, Contact, Admin). For static export you have no choice for live data; for a future hybrid/SSR setup you could fetch projects/reviews on the server and pass as props.

### Data fetching

- **Method:** All data is fetched in client components with `supabase.from(...).select()` or `.insert()`. No Server Actions, no Route Handlers (and with static export you cannot have runtime API routes).
- **Implication:** Every visitor runs Supabase queries from the browser with the anon key. RLS correctly restricts what anon can do; the only “admin” operations use the same client after sign-in (JWT sent with requests), and RLS restricts those to `admin_users`. So **data** access is correct; **architecturally** you have no backend layer — everything is client → Supabase.

### Static export appropriateness

- **Appropriate** for a marketing site on GitHub Pages: no server to run, cheap hosting, good for SEO of static content.
- **Limitations:** No middleware at runtime, no API routes, no ISR/SSR. Admin and all dynamic content depend on client-side Supabase. If you need server-only logic (e.g. admin check before rendering, rate limiting, webhook verification), you’d need a hybrid (e.g. Vercel with some server routes) or Edge Functions + stricter client use.

### API routes

- **None** in the repo. With `output: 'export'` you cannot have runtime API routes. All “API” is direct Supabase from the client. This is consistent but means no place to hide secrets or add server-side validation.

### Project structure

- **Current:** Flat `src/app/`, `src/components/`, `src/lib/`. Clear enough for this size.
- **Tight coupling:** Components import `@/lib/supabase` and `@/lib/admin-auth` directly; no abstraction layer. If you swap Supabase or add a BFF, you’d touch many files.
- **Logic in UI:** Admin page is a very large single component (~560 lines) with all state, handlers, and JSX. Contact and Reviews also mix validation and submit logic in the component. Works, but refactoring (e.g. custom hooks, small components) would improve testability and reuse.
- **Hardcoded config:** `next.config.js` has `repo = 'jen-remodeling-inc'` and basePath/assetPrefix derived from it. Phone number and address are hardcoded in Contact and elsewhere. Prefer env or a single config object for base URL, company name, phone, etc.

### Recommendations

- **Folder structure (scalable):** Option A — feature-based: `src/features/contact/`, `src/features/reviews/`, `src/features/admin/`, each with `components/`, `hooks/`, `api/` (if you add a BFF). Option B — keep current but add `src/lib/api/` (e.g. `contact.ts`, `reviews.ts`, `projects.ts`) that wrap Supabase and keep components thin.
- **SSR/SSG/ISR:** For this product, **static export is fine**. If you later need server-only admin or rate-limited endpoints, move to **Vercel (or similar)** with `output: 'standalone'` or default, and add a few API routes or Server Actions for auth check and sensitive ops; keep the rest static or ISR.

---

## 3. Supabase Security & Database Audit

### Authentication

- **Enforcement:** Supabase Auth is used for admin only. `getAdminSession()` and `signInAdmin()` use `supabase.auth.getUser()` and `signInWithPassword()`; admin check is done via `admin_users` table. RLS ensures only users in `admin_users` can read that row and perform admin actions.
- **Gap:** Auth is entirely client-side. An attacker can open `/admin`, see the login form, and attempt brute-force. Supabase Dashboard rate limits apply but are not tuned in your project; there is no CAPTCHA or lockout in the app.
- **Recommendation:** Enable and tune **Auth → Rate Limits** in Supabase; add **CAPTCHA** (e.g. Cloudflare Turnstile) on the admin login form; consider **MFA** for admin accounts.

### Row Level Security (RLS)

- **Enabled:** Yes, on all relevant tables (`admin_users`, `contact_submissions`, `reviews`, `projects`, `project_images`). Migration `001_rls.sql` is consistent with `full-setup.sql`.
- **Policies reviewed:**
  - **admin_users:** SELECT for authenticated where `user_id = auth.uid()` — correct.
  - **contact_submissions:** INSERT for anon and authenticated; SELECT/DELETE only for admins — correct.
  - **reviews:** INSERT for anon and authenticated; SELECT for all; DELETE only for admins — correct. (No UPDATE policy, so reviews can’t be edited from client — good.)
  - **projects / project_images:** SELECT for anon; full CRUD for authenticated admins — correct.
- **Storage:** `storage-project-images.sql` defines RLS on `storage.objects`: public read for `project-images`, INSERT/DELETE only for authenticated users in `admin_users`. No UPDATE policy on storage; if you need update, add it explicitly.

**Verdict:** RLS is not over-permissive. Users cannot read other users’ data; anon cannot delete or update. Good.

### Common Supabase mistakes — checklist

| Check | Status |
|-------|--------|
| Service role key in frontend | ✅ Not used; only anon key in client. |
| RLS enabled on all tables | ✅ Yes. |
| Client-side only validation | ⚠️ Contact and review forms validate in client only; DB has CHECKs for reviews (service, rating) but no length limits on text/message. |
| Direct table access without constraints | ⚠️ contact_submissions and reviews accept arbitrary-length text; add length limits. |
| Rate limiting | ❌ None at app level; rely on Supabase. |

### Vulnerabilities and severity

1. **Admin login brute-force**  
   - **Exploit:** Attacker scripts POSTs to Supabase Auth with many passwords.  
   - **Mitigation:** Supabase Auth rate limits + CAPTCHA on login form; optional lockout after N failures.  
   - **Severity:** **High** (if admin password is weak or rate limits are high).

2. **Contact/review spam and large payloads**  
   - **Exploit:** Submit huge `message` or `text` or many requests in a short time.  
   - **Mitigation:** DB `CHECK (char_length(message) <= 10000)` (and similar for review text, name, etc.); consider Supabase Edge Function or a small backend to rate limit by IP or token.  
   - **Severity:** **Medium**.

3. **Storage upload by non-admin**  
   - **Exploit:** Authenticated user not in `admin_users` tries to upload to `project-images`.  
   - **Mitigation:** RLS “Admins insert project-images” already restricts INSERT to users in `admin_users`.  
   - **Severity:** **Low** (RLS covers it).

4. **Anon key exposure**  
   - **Exploit:** Key is in client bundle; someone could use it to hit your project.  
   - **Mitigation:** Expected for Supabase; RLS and Auth are the real security. Restrict key in Dashboard (URL restrictions) if available; never use service role in client.  
   - **Severity:** **Low** (by design).

### Secure configuration example (add to migrations)

```sql
-- Length limits for contact and reviews (run after 001_rls.sql or in a new migration)
ALTER TABLE contact_submissions
  ADD CONSTRAINT chk_contact_message_length CHECK (char_length(message) <= 10000),
  ADD CONSTRAINT chk_contact_name_length CHECK (char_length(name) <= 200),
  ADD CONSTRAINT chk_contact_email_length CHECK (char_length(email) <= 255);

ALTER TABLE reviews
  ADD CONSTRAINT chk_review_text_length CHECK (char_length(text) <= 5000),
  ADD CONSTRAINT chk_review_name_length CHECK (char_length(name) <= 200);
```

---

## 4. Frontend Security Review (Next.js Specific)

- **XSS:** No `dangerouslySetInnerHTML` found. User content (review text, contact message) is rendered as text in React (e.g. `{review.text}`, `{c.message}` in admin). React escapes by default. **Low risk** as long as you never inject HTML from DB into the DOM without sanitization.
- **Unsanitized input:** Contact and review forms send trimmed strings to Supabase; no HTML stripping. If you ever render those in a context that interprets HTML, sanitize (e.g. DOMPurify). Currently you don’t, so risk is low.
- **API key exposure:** Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are used; both are intended to be public. No other secrets in client.
- **Env misuse:** No server-only secrets are prefixed with `NEXT_PUBLIC_`. Good.
- **CSRF:** Supabase uses JWT and same-origin; forms are same-origin. Supabase Auth and PostgREST are not cookie-based CSRF in the classic sense. For static export there’s no custom API to protect. **Low risk.**
- **Form validation:** Client-side validation in Contact (email, phone, required fields, message length ≥ 20) and in Reviews (rating required). No server-side validation (no API). DB CHECKs exist for reviews; add length limits as above.
- **File upload (admin):** Allowed types and 5 MB limit are enforced in client only; storage RLS ensures only admins can INSERT. Supabase storage bucket can enforce file size and MIME; your SQL suggests 5 MB and image types. **Acceptable** with RLS.
- **Admin route protection:** Admin UI is not behind a server check; anyone can open `/admin` and see the login form. RLS prevents data access without auth. **Recommendation:** Obscure path or add a middleware that redirects unauthenticated users (complex with static export) for defense in depth.

---

## 5. Performance & Optimization Audit

- **Bundle:** Single Supabase client and no heavy UI libs. Admin page is one large client component; code-splitting by route (e.g. `next/dynamic` for admin) would reduce initial JS for non-admin users.
- **Dependencies:** Small set (next, react, @supabase/supabase-js, lucide-react, tailwind). No obvious dead weight.
- **Images:** `next/image` used in Projects and Landing with `unoptimized: true` (required for static export). Remote patterns for Unsplash and Supabase storage. No Image Optimization API at runtime — expected for GitHub Pages. Consider pre-optimizing assets at build or using a CDN that can resize.
- **Lazy loading:** No `next/dynamic` for admin or heavy modals. Reviews “Load more” is implemented in component state (slice), not infinite scroll library — fine.
- **Caching:** Static export means HTML/JS/CSS are cached by CDN/browser. Supabase responses are not cached in the app; every visit refetches projects/reviews. For a small dataset this is acceptable; for scale you’d add caching (e.g. SWR/React Query with stale time, or an edge cache in front of Supabase).
- **Revalidation:** N/A (no ISR).
- **API duplication:** Projects page and Admin both fetch projects and project_images in separate queries; no shared cache. Could be normalized in a small client-side cache or data layer.
- **Supabase queries:** Simple selects; indexes exist on `project_images(project_id)` and `projects(sort_order)`. Contact/reviews inserts are single-row. No N+1 in the code.
- **Over-fetching:** Admin loads all contacts, all reviews, all projects at once. For large tables, add pagination and/or lazy load per tab.
- **Client-heavy rendering:** All data-dependent pages hydrate then fetch. For static export this is normal; Lighthouse will show LCP then potential layout shift when data arrives. Use skeletons or fixed-height placeholders to reduce CLS.

**Lighthouse (estimate):** With unoptimized images and client fetch, expect **Performance 70–80**, **Accessibility 85–95**, **Best Practices 80–90**, **SEO 90+**. Main hits: LCP from images and JS from Supabase + React.

**Recommendations:**

- Add a **performance budget** in CI (e.g. `@next/bundle-analyzer`, fail if main bundle > 200 KB).
- Lazy-load admin: `const AdminPage = dynamic(() => import('@/app/admin/page'), { ssr: false })` from a thin route that redirects if not admin (where possible).
- Use **skeletons** on Projects and Reviews while loading to stabilize layout.
- Consider **SWR** or **React Query** for projects/reviews with `revalidateOnFocus: false` and `dedupingInterval` to avoid duplicate requests when switching tabs or returning to the page.

---

## 6. DevOps & Deployment Readiness

- **CI/CD:** GitHub Actions workflow deploys on push to `main`: install, build with env vars, add `.nojekyll`, deploy to GitHub Pages. **Good.**
- **Deployment:** Optimized for GitHub Pages (basePath, assetPrefix, `output: 'export'`, `out`). No Vercel or server config.
- **Env vars:** Build uses `vars.NEXT_PUBLIC_SUPABASE_URL` and `vars.NEXT_PUBLIC_SUPABASE_ANON_KEY`. Correct; no secrets in repo. `.env.local` is gitignored.
- **Monitoring:** None. No Sentry, no logging, no uptime checks.
- **Error tracking:** None. `error.tsx` exists but only shows a generic message; no reporting.
- **Logging:** No structured logs or log aggregation.
- **Backup:** Supabase handles DB backups on paid plans; no custom backup automation in repo.
- **Migrations:** Supabase migrations in `supabase/migrations/` and `storage-project-images.sql`; no automated migration run in CI (you’d run `supabase db push` or run SQL manually). Document and/or automate for production.

**Recommendations:**

- **Production checklist:** Env vars set in GitHub; no `.env.local` committed; RLS and storage policies applied; rate limits and (optional) CAPTCHA configured; error tracking and at least one uptime check.
- **Monitoring:** Sentry (or similar) for frontend errors; optional Supabase Dashboard alerts for DB/API usage.
- **Backup:** Rely on Supabase backups; document restore process; consider occasional pg_dump to external storage if critical.

---

## 7. Code Quality & Maintainability

- **Type safety:** TypeScript throughout; no `any` found. Types for Supabase rows are defined locally (e.g. in admin page); consider shared types (e.g. generated from Supabase or a shared `types/`).
- **Error handling:** Try/catch in Contact and Reviews; admin loaders don’t always surface Supabase errors to the user. Inconsistent; some places set error state, others ignore.
- **Reusability:** Header, Footer, LayoutSwitcher are reusable. Contact and Reviews are page-specific; admin is one large component. Extract hooks (e.g. `useContacts`, `useProjects`) and smaller presentational components to improve testability.
- **Hooks:** No custom data-fetching hooks; logic is inline in components. A `useSupabaseProjects()` and similar would reduce duplication between public Projects and Admin.
- **API abstraction:** No layer above `supabase.from(...)`. Adding `src/lib/api/` (e.g. `getProjects()`, `submitContact()`) would centralize logic and simplify mocking.
- **Duplication:** `generateStars` in admin and Reviews; date formatting in several places; project-fetch logic in Projects and Admin. Consolidate in `lib/` or shared components.
- **Naming:** Consistent (Contact, Reviews, Projects, admin). File names match components.
- **Folder organization:** Flat and clear for current size; see Section 2 for scalable structure.

**Refactoring strategy:** (1) Add `lib/api/` and move Supabase calls there. (2) Add custom hooks for projects, reviews, contacts. (3) Split admin into smaller components and hooks. (4) Introduce shared types for DB entities.

---

## 8. UX / UI & Accessibility Review

- **Mobile:** Responsive layout (Tailwind breakpoints, hamburger menu, stacked grids). Admin has a mobile menu and tab bar. Good.
- **Accessibility:** Focus and keyboard (e.g. Escape to close modals); `aria-label` on buttons (e.g. “Toggle navigation”, “Close”); `role="alert"` for errors; `role="dialog"` and `aria-modal` on modals. Review form has star buttons with `role="button"` and `tabIndex={0}`. Missing: skip link, focus trap in modals (focus can leave), and possibly more `aria-live` for dynamic content.
- **Loading:** Spinners on admin and Projects/Reviews; no skeletons. Could add skeleton cards for projects and review list.
- **Error states:** Contact and Reviews show submit errors; admin shows login error. Generic error page exists. Could improve with retry and clearer messages.
- **Forms:** Labels, placeholders, required indicators. Min length on message. Good.
- **Navigation:** Clear nav links; admin has “Back to site”. basePath is applied by Next.js; links are relative so they work under GitHub Pages.
- **Trust:** Contact info, “Why Choose Us,” testimonials section. Consider real phone/address or clear “sample” labeling if placeholder.

---

## 9. Scalability Simulation

- **1,000 users:** Static site and Supabase free tier should hold. Watch Supabase DB size and auth MAU.
- **10,000 users:** Likely need Supabase Pro; consider CDN caching for static assets (GitHub Pages already provides some). No app-level caching of Supabase data; each visitor triggers live queries.
- **100,000 users:** Supabase Pro + connection pooling; consider edge caching or a small BFF to cache projects/reviews and reduce direct Supabase load. Rate limit and CAPTCHA on forms and auth to avoid abuse. Admin should paginate contacts/reviews and lazy load tabs.

**Bottlenecks:** Supabase API rate limits and DB connections; no rate limiting in app; no caching layer.

---

## 10. Final Verdict & Roadmap

### Scores (out of 100)

| Area | Score | Notes |
|------|-------|--------|
| Security | 55 | RLS and anon-only client are good; admin and forms need hardening. |
| Performance | 62 | Static export and small deps help; images unoptimized, no data caching. |
| Architecture | 52 | Clear for static export; no BFF, heavy client component, large admin file. |
| Maintainability | 68 | TypeScript and structure are fine; needs abstraction and splitting. |
| **Production readiness** | **58** | Usable for low-traffic production after critical/high fixes. |

### 30-day improvement roadmap

1. **Week 1:** Add DB length constraints for contact and reviews; enable and tune Supabase Auth rate limits; add CAPTCHA (e.g. Turnstile) on contact and review forms and admin login.
2. **Week 2:** Set up error tracking (e.g. Sentry) and one uptime check; document backup/restore for Supabase; add `.env.example` (no secrets) and verify CI uses vars.
3. **Week 3:** Refactor admin into smaller components and at least one `useProjects`-style hook; add skeletons for Projects and Reviews loading.
4. **Week 4:** Add a simple “admin discovery” mitigation (e.g. document that admin URL is not linked publicly, or add an obscure path and redirect); optional bundle analysis and performance budget in CI.

### 90-day enterprise-oriented roadmap

1. **Months 1–2:** Move high-value or sensitive flows to a server layer (e.g. Vercel): Server Actions or API routes for contact submit and review submit with rate limiting and validation; keep Supabase RLS. Add MFA for admin. Introduce shared Supabase types and `lib/api/` abstraction.
2. **Month 3:** Pagination and lazy loading in admin; edge or CDN caching for projects/reviews if traffic grows; formal incident and deployment runbooks; optional E2E tests for contact and admin login.

### “If I were CTO” strategic recommendation

- **Short term:** Treat this as a **production-ready marketing site** only after the top 5 urgent fixes (rate limiting, DB constraints, env discipline, error tracking, admin mitigation). Keep static export and GitHub Pages; don’t over-engineer.
- **Medium term:** If you add more features (e.g. quotes, payments, CRM), introduce a **thin backend** (Vercel Server Actions or a few API routes) for anything that must not be client-only (rate limits, validation, webhooks). Keep Supabase as the database and keep RLS.
- **Long term:** If the business grows (many admins, many submissions, SLA requirements), consider **feature-based structure**, shared API layer, and proper monitoring/alerting; optionally move admin to a separate app or route with server-side auth check.

---

*End of audit.*
