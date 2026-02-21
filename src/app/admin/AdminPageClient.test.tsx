import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminPageClient from './AdminPageClient'

const mockGetAdminSession = vi.fn()
const mockSignInAdmin = vi.fn()
const mockSignOutAdmin = vi.fn()

const { deleteEqMock, contactsDataRef } = vi.hoisted(() => ({
  deleteEqMock: vi.fn().mockResolvedValue(undefined),
  contactsDataRef: { current: [] as unknown[] },
}))

vi.mock('@/lib/admin-auth', () => ({
  getAdminSession: () => mockGetAdminSession(),
  signInAdmin: (email: string, password: string) => mockSignInAdmin(email, password),
  signOutAdmin: () => mockSignOutAdmin(),
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))

vi.mock('@/lib/supabase', () => {
  const chain = (result: unknown) => ({
    select: vi.fn().mockReturnValue({
      order: vi.fn().mockResolvedValue({ data: result }),
    }),
    delete: vi.fn().mockReturnValue({
      eq: deleteEqMock,
    }),
    insert: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: null }) }),
    }),
    update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue(undefined) }),
  })
  return {
    supabase: {
      from: (table: string) => {
        if (table === 'contact_submissions') {
          return chain(contactsDataRef.current)
        }
        if (table === 'reviews') return chain([])
        if (table === 'projects') return chain([])
        if (table === 'project_images') return chain([])
        return chain([])
      },
      storage: {
        from: () => ({
          upload: vi.fn().mockResolvedValue({ error: null }),
          getPublicUrl: () => ({ data: { publicUrl: 'https://example.com/img.jpg' } }),
        }),
      },
    },
  }
})

describe('AdminPageClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    contactsDataRef.current = []
  })

  it('shows login form when session is null', async () => {
    mockGetAdminSession.mockResolvedValue(null)
    render(<AdminPageClient />)
    await screen.findByRole('heading', { name: /admin sign in/i })
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows dashboard with Contacts tab when session exists', async () => {
    mockGetAdminSession.mockResolvedValue({ user: { id: '1', email: 'admin@test.com' }, isAdmin: true })
    render(<AdminPageClient />)
    await screen.findByText(/contact submissions/i)
    const contactsButtons = screen.getAllByRole('button', { name: /contacts/i })
    expect(contactsButtons.length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('button', { name: /reviews/i }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('button', { name: /projects/i }).length).toBeGreaterThanOrEqual(1)
  })

  it('loads and displays contact submissions', async () => {
    mockGetAdminSession.mockResolvedValue({ user: { id: '1', email: 'admin@test.com' }, isAdmin: true })
    contactsDataRef.current = [
      {
        id: 'c1',
        name: 'Alice Smith',
        email: 'alice@example.com',
        phone: '555-1111',
        preferred_contact: 'email',
        service: 'Kitchen Remodeling',
        project_type: null,
        budget: null,
        timeline: null,
        message: 'I need a new kitchen.',
        created_at: '2025-01-15T10:00:00Z',
      },
    ]
    render(<AdminPageClient />)
    await screen.findByText(/Alice Smith/i)
    expect(screen.getByText(/Kitchen Remodeling/i)).toBeInTheDocument()
  })

  it('calls delete with correct id when confirming contact delete', async () => {
    mockGetAdminSession.mockResolvedValue({ user: { id: '1', email: 'admin@test.com' }, isAdmin: true })
    contactsDataRef.current = [
      {
        id: 'contact-to-delete',
        name: 'Bob Jones',
        email: 'bob@example.com',
        phone: '555-2222',
        preferred_contact: 'phone',
        service: 'Bathroom Remodeling',
        project_type: null,
        budget: null,
        timeline: null,
        message: 'Bathroom remodel needed.',
        created_at: '2025-01-10T12:00:00Z',
      },
    ]
    render(<AdminPageClient />)
    await screen.findByText(/Bob Jones/i)
    const card = screen.getByText(/Bob Jones/i).closest('[class*="border-2"]')
    expect(card).toBeTruthy()
    const clickable = card!.querySelector('[class*="cursor-pointer"]') ?? card
    await userEvent.click(clickable as HTMLElement)
    const deleteBtn = await screen.findByRole('button', { name: /^delete$/i })
    await userEvent.click(deleteBtn)
    const yesBtn = await screen.findByRole('button', { name: /yes, delete/i })
    await userEvent.click(yesBtn)
    expect(deleteEqMock).toHaveBeenCalledWith('id', 'contact-to-delete')
  })

  it('does not call delete when user clicks Cancel after confirming', async () => {
    mockGetAdminSession.mockResolvedValue({ user: { id: '1', email: 'admin@test.com' }, isAdmin: true })
    contactsDataRef.current = [
      {
        id: 'c2',
        name: 'Carol White',
        email: 'carol@example.com',
        phone: '555-3333',
        preferred_contact: 'email',
        service: 'Other',
        project_type: null,
        budget: null,
        timeline: null,
        message: 'General inquiry with enough text here.',
        created_at: '2025-01-12T09:00:00Z',
      },
    ]
    render(<AdminPageClient />)
    await screen.findByText(/Carol White/i)
    const card = screen.getByText(/Carol White/i).closest('[class*="border-2"]')
    const clickable = card!.querySelector('[class*="cursor-pointer"]') ?? card
    await userEvent.click(clickable as HTMLElement)
    const deleteBtn = await screen.findByRole('button', { name: /^delete$/i })
    await userEvent.click(deleteBtn)
    const cancelBtn = await screen.findByRole('button', { name: /cancel/i })
    await userEvent.click(cancelBtn)
    expect(deleteEqMock).not.toHaveBeenCalled()
  })
})
