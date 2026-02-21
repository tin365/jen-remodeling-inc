/**
 * Report errors to Sentry (when NEXT_PUBLIC_SENTRY_DSN is set) and console.
 * Used by error boundary (app/error.tsx) and manual catch blocks.
 */
import * as Sentry from '@sentry/nextjs'

export function reportError(error: unknown): void {
  if (!error) return
  const err = error instanceof Error ? error : new Error(String(error))
  Sentry.captureException(err)
  console.error(err)
}
