'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import BrandLogo from './BrandLogo'

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
      <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between gap-6 lg:gap-8">
        <h1 className="m-0 shrink-0">
          <Link
            href="/"
            className="block no-underline"
            onClick={() => setMenuOpen(false)}
            aria-label="JEN Remodeling Inc home"
          >
            <BrandLogo
              variant="primary"
              className="w-[188px] h-[52px] sm:w-[208px] sm:h-[56px] xl:w-[226px] xl:h-[60px]"
            />
          </Link>
        </h1>
        {/* Desktop nav */}
        <nav className="hidden lg:block flex-1 min-w-0">
          <ul className="list-none p-0 m-0 flex items-center justify-end gap-6 xl:gap-8 whitespace-nowrap">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-[0.92rem] xl:text-[0.96rem] no-underline text-ink hover:underline decoration-2 ${pathname === link.href ? 'underline decoration-2' : ''}`}
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
          className="lg:hidden p-2 -mr-2 text-ink"
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
        <nav className="lg:hidden border-t border-ink/20 bg-paper">
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
