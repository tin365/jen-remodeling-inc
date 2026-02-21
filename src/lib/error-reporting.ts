/**
 * Report errors to console, optional Sentry (when NEXT_PUBLIC_SENTRY_DSN is set),
 * and Supabase error_logs for budget-friendly monitoring.
 * Used by error boundary (app/error.tsx) and manual catch blocks.
 */
import * as Sentry from '@sentry/nextjs'
import { supabase } from '@/lib/supabase'

export function reportError(error: unknown, source?: string): void {
  if (!error) return
  const err = error instanceof Error ? error : new Error(String(error))
  console.error(err)

  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(err)
  }

  if (typeof window !== 'undefined') {
    const url = window.location.href
    const payload = {
      message: err.message,
      stack: err.stack ?? null,
      url,
      source: source ?? null,
    }
    supabase
      .from('error_logs')
      .insert(payload)
      .then(() => {})
      .catch(() => {})
  }
}
