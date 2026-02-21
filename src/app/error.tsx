'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { reportError } from '@/lib/error-reporting'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    reportError(error, 'error_boundary')
  }, [error])

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center border border-rule rounded-lg bg-paper shadow-sm p-8">
        <h1 className="text-xl font-bold text-ink mb-2">Something went wrong</h1>
        <p className="text-ink-light text-sm mb-6">
          We couldn’t load this page. Please try again or return to the home page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2.5 bg-ink text-paper border border-ink font-medium rounded hover:bg-ink-light hover:border-ink-light transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-4 py-2.5 border border-rule text-ink rounded hover:bg-ink/5 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
