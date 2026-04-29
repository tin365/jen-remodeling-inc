import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Header from './Header'

let mockPathname = '/'

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}))

vi.mock('next/link', () => ({
  default: ({ href, children, className, onClick }: { href: string; children: React.ReactNode; className?: string; onClick?: () => void }) => (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  ),
}))

describe('Header', () => {
  beforeEach(() => {
    mockPathname = '/'
  })

  it('highlights the active nav link based on pathname', () => {
    mockPathname = '/projects'
    render(<Header />)

    const projectsLink = screen.getByRole('link', { name: /projects/i })
    const homeLink = screen.getByRole('link', { name: /^Home$/i })

    // Active link should have a different className than inactive link
    expect(projectsLink.className).not.toBe(homeLink.className)
  })

  it('toggles mobile menu when hamburger is clicked', async () => {
    const user = userEvent.setup()
    render(<Header />)

    const toggleButton = screen.getByRole('button', { name: /toggle navigation/i })
    // Initial render should only have one "Contact" link visible (desktop nav)
    expect(screen.getAllByRole('link', { name: /contact/i }).length).toBe(1)

    await user.click(toggleButton)
    // After opening menu, there should be at least two "Contact" links (desktop + mobile)
    expect(screen.getAllByRole('link', { name: /contact/i }).length).toBeGreaterThan(1)
  })
})
