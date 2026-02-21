import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-paper border-t border-rule py-6 sm:py-8 px-4 sm:px-6 mt-8">
      <div className="max-w-content mx-auto text-center">
        <p className="text-sm text-ink-light m-0">
          &copy; 2026 JEN Remodeling Inc. All rights reserved.
        </p>
        <nav className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-ink-light" aria-label="Legal">
          <Link href="/privacy" className="underline hover:text-ink">Privacy Policy</Link>
          <Link href="/terms" className="underline hover:text-ink">Terms of Service</Link>
        </nav>
      </div>
    </footer>
  )
}
