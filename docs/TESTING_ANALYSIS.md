# Professional Testing Analysis — JEN Remodeling React

**Project:** jen-remodeling-react (Next.js 15, React 19, Supabase, static export to GitHub Pages)  
**Analysis date:** February 2025  
**Scope:** Full codebase review for test strategy, gaps, and recommendations.

---

## 1. Executive Summary

The application is a **marketing + lead-capture site** for JEN Remodeling Inc. with:

- **Public:** Landing, Services, Projects, Reviews, Contact, Terms, Privacy.
- **Admin:** Auth (Supabase), contact/review/project CRUD, image uploads.
- **Integrations:** Supabase (DB + Auth + Storage), Sentry, Resend (edge function for email notifications).

**Current test state:** **No automated tests.** There is no test runner (Jest/Vitest), no E2E framework (Playwright/Cypress), and no test scripts in `package.json`. The only quality gate is `next lint`. This creates high regression risk for contact form, admin flows, and data integrity.

**Recommendation:** Introduce a layered test strategy (unit + integration + E2E) and prioritize the contact form, validation logic, admin auth, and critical user paths.

---

## 2. Project Structure (Test-Relevant)

| Area | Path | Risk |
|------|------|------|
| App routes | `src/app/**/page.tsx` | Medium – routing, SSG/export |
| Components | `src/components/*.tsx` | High – Contact form, Reviews, Projects |
| API / data | `src/lib/api/*.ts`, `src/lib/supabase.ts` | High – contact submit, reviews, projects |
| Auth | `src/lib/admin-auth.ts` | High – sign-in, session, access control |
| Hooks | `src/hooks/useReviews.ts`, `useProjects.ts` | Medium – loading/error/refetch |
| Edge function | `supabase/functions/send-notification/index.ts` | Medium – webhook, email, CORS |
| Error handling | `src/app/error.tsx`, `global-error.tsx`, `reportError` | Low–medium |

---

## 3. Critical Flows to Test

### 3.1 Contact form (highest priority)

- **Location:** `src/components/Contact.tsx` + `src/lib/api/contact.ts`
- **Behavior:** Client-side validation (name, email, phone, service, message length), then `submitContact()` → Supabase `contact_submissions` insert.
- **Risks:**
  - Validation bugs (e.g. `validateEmail`, `validatePhone`, message 20–10000 chars) could allow bad data or block valid submissions.
  - Trimming/slicing in `contact.ts` (e.g. name 200, message 10000) must match validation.
  - No tests today; any refactor can break submission or validation.

**Suggested tests:**

- **Unit:** `validateEmail` / `validatePhone` / `validateForm` (valid and invalid cases, edge cases like 9-digit phone, 19-char message).
- **Unit:** `submitContact` with a mocked Supabase client (success, Supabase error, network error).
- **Integration/component:** Render Contact form, fill valid data, submit → assert no validation errors and submit called with expected payload (mock `submitContact`).
- **E2E (staging):** Submit real form to a test Supabase project and optionally verify DB row and/or notification.

### 3.2 Admin authentication and authorization

- **Location:** `src/lib/admin-auth.ts`, `src/app/admin/layout.tsx`, `AdminPageClient.tsx`
- **Behavior:** `signInAdmin` → Supabase Auth + check `admin_users`; `getAdminSession()` for layout guard; sign-out.
- **Risks:**
  - Non-admin users could see admin UI if session check is wrong.
  - Error message mapping (invalid credentials vs “not an administrator”) affects UX and security messaging.

**Suggested tests:**

- **Unit:** `signInAdmin` with mocked Supabase:
  - Valid admin → `{ error: null }`.
  - Invalid credentials → `{ error: 'Invalid email or password.' }`.
  - Valid auth but not in `admin_users` → `{ error: 'Access denied...' }`, and `signOut` called.
- **Unit:** `getAdminSession()` – no user → null; user not in admin_users → null; user in admin_users → session object.
- **E2E:** Login as admin → admin panel visible; login as non-admin → redirect or “Access denied”; logout → no admin content.

### 3.3 Reviews and projects (read path)

- **Location:** `src/lib/api/reviews.ts`, `src/lib/api/projects.ts`, hooks, `Reviews.tsx`, `Projects.tsx`
- **Behavior:** Fetch from Supabase, map to `Review` / `Project` (dates, images, categories).
- **Risks:**
  - `fetchReviews()` returns `[]` on error (no differentiation between “empty” and “error”).
  - `fetchProjects()` does two queries (projects + images); join/mapping bugs could show wrong images or empty lists.
  - Date formatting (`created_at.split('T')[0]`) assumes ISO string; malformed data could throw.

**Suggested tests:**

- **Unit:** `fetchReviews()` / `fetchProjects()` with mocked Supabase:
  - Success with one/many rows → correct shape and date format.
  - Supabase error → reviews return `[]`; projects return `[]` and don’t throw.
  - Empty data → `[]`.
- **Component:** Reviews/Projects with mocked hooks (loading, error, empty, success) to assert skeletons and content.

### 3.4 Admin CRUD and images

- **Location:** `src/app/admin/AdminPageClient.tsx` (contacts, reviews, projects, project images, uploads).
- **Behavior:** Delete contact/review; create/update project; add/delete project images; file upload to Supabase Storage.
- **Risks:**
  - Large component with many state variables; regressions in delete confirmation, tab switching, or form state.
  - Upload and RLS policies must align; wrong bucket or policy could break uploads or expose data.

**Suggested tests:**

- **Component:** Admin panel with mocked Supabase and auth: list contacts/reviews, trigger delete (confirm/cancel), assert correct calls.
- **E2E (staging):** Admin login → create project → add image → verify in Storage and on public Projects page.

### 3.5 Edge function (send-notification)

- **Location:** `supabase/functions/send-notification/index.ts`
- **Behavior:** Webhook payload (INSERT/UPDATE/DELETE, table, record), optional `x-webhook-secret`, CORS, Resend email.
- **Risks:**
  - Invalid JSON, missing table/record, wrong event type → 400.
  - Missing RESEND_API_KEY/NOTIFICATION_EMAIL → 500.
  - Subject/HTML built from record; need to ensure `sanitizeSubject` and `escapeHtml` prevent header injection and XSS.

**Suggested tests:**

- **Unit (Deno):** Call handler with:
  - Valid `contact_submissions` INSERT → 200, correct subject/body shape (and optionally mocked fetch to Resend).
  - Invalid JSON → 400.
  - Missing record → 400.
  - WEBHOOK_SECRET set and wrong header → 401.
  - `sanitizeSubject` / `escapeHtml` with newlines, `<script>`, long string → safe output.

---

## 4. Validation and Data Integrity

- **Contact form:** Name 1–200, email format, phone ≥10 digits and allowed chars, message 20–10000. Backend `contact.ts` trims and slices; these limits must match. Add unit tests for boundary (e.g. 200 chars name, 19 vs 20 vs 10001 chars message).
- **Reviews API:** `submitReview` trims and slices (name 200, text 5000). If you add client-side review submission, validate consistently and test.
- **Types:** `ProjectCategory` and `ReviewService` are constrained; ensure API and DB only accept allowed values (unit tests + optional runtime checks).

---

## 5. Security-Related Testing

- **Admin:** Only users in `admin_users` should get session; others get “Access denied” and sign-out. Test with mocked Supabase.
- **Contact submission:** Table should be insert-only from anon (RLS). Test that update/delete from anon are rejected (integration or E2E against real Supabase with RLS).
- **Edge function:** With WEBHOOK_SECRET, requests without correct header must get 401. Test in unit tests.
- **XSS:** Contact/Review content is shown in admin and in emails. `escapeHtml` in the edge function is used for email; ensure any admin UI that renders user content also escapes or uses safe components. Consider a quick E2E or manual test with `<script>alert(1)</script>` in a message.

---

## 6. Accessibility and UX

- **Error states:** Contact form shows inline errors and submit error alert; error boundary has “Try again” and “Back to home.” Manual or E2E check: errors are announced and focus is manageable.
- **Forms:** Required fields and labels are present; ensure `id`/`htmlFor` and `aria-invalid`/`aria-describedby` where appropriate. Linting (e.g. eslint-plugin-jsx-a11y) plus one E2E pass with axe or similar is recommended.
- **Admin:** Large form and tabs; keyboard navigation and focus trap in modals (if any) should be verified.

---

## 7. Build, Export, and Environment

- **Static export:** `output: 'export'` and `basePath` for GitHub Pages. No server routes; all data is client + Supabase. Smoke test: run `npm run build` and open `out` with a static server; click through main routes and confirm assets (e.g. `_next/`) load (basePath).
- **Env:** App expects `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`; `supabase.ts` throws if missing. Edge function expects `RESEND_API_KEY`, `NOTIFICATION_EMAIL`. CI should run tests with env set (or mocked) so missing env fails fast.

---

## 8. Recommended Test Stack and Scripts

| Layer | Tool | Purpose |
|-------|------|--------|
| Unit / integration | **Vitest** | Fast, ESM-friendly, good for `lib`, hooks, and pure logic |
| Component | **React Testing Library** + Vitest | Contact, Reviews, Projects, admin components with mocked APIs |
| E2E | **Playwright** | Cross-browser, real browser for login, form submit, navigation |
| Lint | **ESLint** (existing) | Add `eslint-plugin-jsx-a11y` for a11y rules |

**Suggested `package.json` scripts:**

```json
"test": "vitest",
"test:run": "vitest run",
"test:coverage": "vitest run --coverage",
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui"
```

**Placement:**

- Unit/component: `src/**/*.test.ts(x)` or `src/**/__tests__/*.test.ts(x)`.
- E2E: `e2e/*.spec.ts` (or `tests/e2e/`) with Playwright config at repo root.

---

## 9. Priority Test List (Concrete)

1. **Contact validation (unit)** – `validateEmail`, `validatePhone`, `validateForm` (required fields, min/max length, invalid email/phone).
2. **Contact submit (unit)** – `submitContact` mock Supabase: success, error; assert payload (trim/slice).
3. **Contact component (RTL)** – valid submit → success message; invalid → errors shown; submit disabled while loading.
4. **Admin auth (unit)** – `signInAdmin` / `getAdminSession` with mocked Supabase (all branches).
5. **Reviews/Projects API (unit)** – `fetchReviews` / `fetchProjects` success and error; date and image mapping.
6. **Edge function (unit)** – payload validation, 401 with wrong secret, `sanitizeSubject`/`escapeHtml`.
7. **E2E:** Home → Contact → fill and submit (with test Supabase or mocked API); Admin login → view contacts (or redirect for non-admin).
8. **Build and export** – CI runs `npm run build` and optionally a quick Playwright smoke test on `out` (or preview URL).

---

## 10. Summary Table

| Area | Current | Recommended |
|------|--------|-------------|
| Unit tests | None | Vitest for lib, hooks, validation, edge function |
| Component tests | None | RTL + Vitest for Contact, Reviews, Projects, admin |
| E2E tests | None | Playwright for main flows and admin |
| Lint | next lint | Add a11y plugin |
| CI | Not inferred | Run lint + `vitest run` + `playwright test` (and build) |
| Coverage | None | Start with contact + admin-auth; aim >80% for critical paths |

Introducing the above in phases (e.g. Vitest + contact tests first, then admin auth, then E2E and edge function) will significantly reduce regression risk and make refactors safer.
