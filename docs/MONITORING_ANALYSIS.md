# Professional Monitoring Analysis — JEN Remodeling React

**Project:** jen-remodeling-react (Next.js 15, static export, GitHub Pages, Supabase)  
**Scope:** Error reporting, observability, and operational monitoring.  
**Date:** February 2025.

---

## 1. Executive Summary

The application uses **Sentry** for error reporting and performance traces on the client, with optional server/edge instrumentation. Because the app is **statically exported** and served from **GitHub Pages**, there is no Node server in production; only **client-side** Sentry runs in the live environment. This analysis summarizes what is monitored today, identifies gaps, and recommends improvements for alerts, reliability, and business-critical flows.

---

## 2. Current Monitoring Stack

### 2.1 Sentry

| Layer | Config | Runtime in production |
|-------|--------|------------------------|
| **Client** | `src/instrumentation-client.ts`, `NEXT_PUBLIC_SENTRY_DSN` | Yes — runs in the browser on every page load. |
| **Server** | `sentry.server.config.ts`, `instrumentation.ts` | No — static export means no server in prod. |
| **Edge** | `sentry.edge.config.ts` | No — no edge runtime in prod. |

- **Error capture:** `Sentry.captureException()` via `reportError()` (used in Contact form and app/error boundary) and in `global-error.tsx`. Request errors are captured via `onRequestError = Sentry.captureRequestError` in `instrumentation.ts` (only when a server is present).
- **Performance:** `tracesSampleRate: 0.1` in production (10% of transactions); router transitions via `onRouterTransitionStart`.
- **Privacy:** `sendDefaultPii: false`; no automatic PII.
- **Build:** Source maps uploaded via `withSentryConfig` in `next.config.js` (org: `jen-remodeling-inc`, project: `javascript-nextjs`).

### 2.2 Error Boundaries

- **`app/error.tsx`** — Route-level errors: reports to Sentry via `reportError(error)` and shows “Something went wrong” with Try again / Back to home.
- **`app/global-error.tsx`** — Root-level errors: reports via `Sentry.captureException(error)` and renders Next.js default error UI.

### 2.3 Manual Reporting

- **Contact form** (`src/components/Contact.tsx`): on submit failure (e.g. Supabase or network error), calls `reportError(err)` before showing “Failed to send. Please try again or call us.”

### 2.4 External Dependencies (Not Monitored by Code)

- **Supabase** — Auth, DB, Storage. No application-level health checks or dependency monitoring.
- **Resend** — Used by Supabase Edge Function `send-notification` for email. No app-level visibility.
- **GitHub Pages** — Hosting. Availability is outside the app.

---

## 3. What Is Effectively Monitored Today

| Area | Monitored | Notes |
|------|------------|--------|
| Client-side JS errors | Yes | Unhandled exceptions and errors passed to `reportError` / error boundary. |
| Contact form submit failures | Yes | Caught and reported via `reportError`. |
| Route-level React errors | Yes | `error.tsx` catches and reports. |
| Root / layout crashes | Yes | `global-error.tsx` catches and reports. |
| Performance (client) | Partial | 10% trace sampling; router transitions. |
| Server/API errors | No | No server in production. |
| Supabase/Resend health | No | No checks in app. |
| Uptime / availability | No | No synthetic or uptime checks. |
| Business metrics | No | No custom events (e.g. form views, submissions). |

---

## 4. Gaps and Risks

### 4.1 Client-Side Only in Production

- With static export, **server** and **edge** Sentry configs do not run in production. Any future serverless/API routes would need to be wired to Sentry and env (e.g. `SENTRY_DSN`) when you add them.

### 4.2 Ad-Blockers and Sentry DSN

- Requests to Sentry’s domain are often blocked by ad-blockers. The Next.js config has a commented **`tunnelRoute: "/monitoring"`**; enabling it would proxy Sentry through your origin and can improve capture rates. Trade-off: extra load on the host that serves the app (e.g. GitHub Pages does not run Next.js, so you’d need a proxy or different host to use a tunnel).

### 4.3 No Alerting or SLOs

- Sentry receives events but there is no documented:
  - **Alert rules** (e.g. spike in errors, new issue types).
  - **Slack/email notifications** for critical errors.
  - **SLOs** (e.g. “contact form success rate” or “error rate &lt; X%”).

### 4.4 No Visibility into Supabase or Email

- If Supabase is down or RLS/quotas block requests, the app will show generic failures; Sentry will see the client error but not the root cause (e.g. “Supabase 5xx” vs “network”).
- The `send-notification` Edge Function (Resend) has no application-level monitoring; failures are only visible in Supabase Dashboard logs.

### 4.5 No Uptime / Synthetic Monitoring

- There is no automated “hit the site and contact page every N minutes” to detect full outages or broken critical paths.

### 4.6 Limited Business Context

- No custom Sentry (or other) events for “contact form viewed”, “contact form submitted successfully”, or “admin login failed/succeeded”, which would help correlate errors with user actions and prioritize fixes.

---

## 5. Recommendations

### 5.1 Sentry (Quick Wins)

1. **Configure alerts in Sentry**
   - Create alerts for “new issue”, “issue state change to resolved”, and “error count above threshold” (e.g. &gt; 10 in 1 hour).
   - Send notifications to email or Slack so the team is notified of critical errors.

2. **Optional: tunnel route**
   - If you move to a host that can run Next.js (or a small proxy), enable `tunnelRoute: "/monitoring"` and point the Sentry SDK to it to reduce loss from ad-blockers.

3. **Custom context for contact errors**
   - When calling `reportError` from the Contact form, add Sentry context (e.g. `Sentry.setTag("feature", "contact_form")` or `Sentry.setExtra("step", "submit")`) so you can filter and alert on contact-specific failures.

### 5.2 Uptime and Synthetic Monitoring

- Use an external **uptime/synthetic** service (e.g. UptimeRobot, Better Stack, Sentry Cron Monitors, or Vercel’s checks) to:
  - Request the homepage and contact page periodically.
  - Optionally trigger a test contact submission (with a test Supabase project or mock) to verify the full flow.
- Define a simple **availability target** (e.g. 99% over 30 days) and alert when checks fail.

### 5.3 Supabase and Backend

- **Supabase Dashboard:** Use the built-in logs and metrics for Auth, Database, and Edge Functions. Set up Supabase alerts if available (e.g. high error rate, quota).
- **Edge Function `send-notification`:** Ensure logging is sufficient (you already log Resend errors). Consider a small “heartbeat” or test webhook that runs periodically and alerts if the function fails.
- **Optional:** Add a **health or status page** in the app that calls Supabase (e.g. a simple read) and reports status; an external monitor can hit this page to confirm “app + Supabase” is up.

### 5.4 Optional: Business and Product Metrics

- If you want to track conversions or prioritize work:
  - Send **custom Sentry events** (e.g. “contact_form_submitted”) or use a product analytics tool for form views and submissions.
  - Keep PII out of event payloads; use `sendDefaultPii: false` and avoid logging full form data.

### 5.5 Documentation and Runbooks

- **Document** in the repo or wiki:
  - Where to view errors: Sentry project URL and filters.
  - How to get Supabase and Resend logs (Dashboard, Edge Function logs).
  - Whom to notify when alerts fire and what to do for “contact form down” vs “general JS errors”.

---

## 6. Summary Table

| Recommendation | Effort | Impact |
|----------------|--------|--------|
| Sentry alert rules + notifications | Low | High — team sees failures quickly. |
| Sentry tags/context for contact form | Low | Medium — easier triage. |
| External uptime/synthetic checks | Low | High — detect full outages. |
| Tunnel route for Sentry (if host allows) | Medium | Medium — better capture with ad-blockers. |
| Supabase/Edge Function monitoring and alerts | Medium | High — backend and email reliability. |
| Health endpoint + monitor | Medium | Medium — app + Supabase availability. |
| Business/analytics events | Optional | Product and prioritization. |

Implementing **Sentry alerts** and **uptime/synthetic monitoring** gives the largest gain for the least change to the codebase. The rest can be added as you grow or move to a host that supports server/edge and tunnels.
