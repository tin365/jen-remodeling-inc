'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-[1000] border-b-2 border-ink bg-paper">
      <div className="max-w-content mx-auto px-6 py-4 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight m-0">
          <Link
            href="/"
            className="text-ink no-underline hover:underline"
          >
            JEN Remodeling Inc
          </Link>
        </h1>
        <nav>
          <ul className="list-none p-0 m-0 flex flex-wrap gap-6">
            <li>
              <Link
                href="/"
                className={`text-sm no-underline text-ink hover:underline decoration-2 ${pathname === '/' ? 'underline decoration-2' : ''}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className={`text-sm no-underline text-ink hover:underline decoration-2 ${pathname === '/services' ? 'underline decoration-2' : ''}`}
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className={`text-sm no-underline text-ink hover:underline decoration-2 ${pathname === '/projects' ? 'underline decoration-2' : ''}`}
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                href="/reviews"
                className={`text-sm no-underline text-ink hover:underline decoration-2 ${pathname === '/reviews' ? 'underline decoration-2' : ''}`}
              >
                Reviews
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={`text-sm no-underline text-ink hover:underline decoration-2 ${pathname === '/contact' ? 'underline decoration-2' : ''}`}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
