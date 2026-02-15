'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-[1000] border-b-2 border-ink bg-paper">
      <div className="max-w-content mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight m-0">
          <Link
            href="/"
            className="text-ink no-underline hover:underline"
            onClick={() => setMenuOpen(false)}
          >
            JEN Remodeling Inc
          </Link>
        </h1>
        {/* Desktop nav */}
        <nav className="hidden sm:block">
          <ul className="list-none p-0 m-0 flex flex-wrap gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm no-underline text-ink hover:underline decoration-2 ${pathname === link.href ? 'underline decoration-2' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden p-2 -mr-2 text-ink"
          aria-label="Toggle navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <nav className="sm:hidden border-t border-ink/20 bg-paper">
          <ul className="list-none p-0 m-0">
            {navLinks.map((link) => (
              <li key={link.href} className="border-b border-ink/10 last:border-b-0">
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-3 text-sm no-underline text-ink hover:bg-ink/5 ${pathname === link.href ? 'font-bold' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
