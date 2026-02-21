import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Contact from './Contact'

const mockSubmitContact = vi.fn()
const mockReportError = vi.fn()

vi.mock('@/lib/api', () => ({
  submitContact: (...args: unknown[]) => mockSubmitContact(...args),
}))
vi.mock('@/lib/error-reporting', () => ({
  reportError: (...args: unknown[]) => mockReportError(...args),
}))

describe('Contact', () => {
  beforeEach(() => {
    mockSubmitContact.mockReset()
    mockReportError.mockReset()
  })

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup()
    render(<Contact />)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/phone number is required/i)).toBeInTheDocument()
    expect(screen.getByText(/please select a service/i)).toBeInTheDocument()
    expect(screen.getByText(/please tell us about your project/i)).toBeInTheDocument()
    expect(mockSubmitContact).not.toHaveBeenCalled()
  })

  it('shows success message after valid submit', async () => {
    mockSubmitContact.mockResolvedValueOnce({ error: null })
    const user = userEvent.setup()
    render(<Contact />)

    await user.type(screen.getByLabelText(/full name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/email address/i), 'jane@example.com')
    await user.type(screen.getByLabelText(/phone number/i), '5551234567')
    await user.selectOptions(screen.getByLabelText(/service type/i), 'Kitchen Remodeling')
    await user.type(
      screen.getByLabelText(/tell us about your project/i),
      'I need a full kitchen remodel with new cabinets and countertops.'
    )

    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(mockSubmitContact).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '5551234567',
        service: 'Kitchen Remodeling',
        message: expect.any(String),
      })
    )
    expect(screen.getByText(/thank you for contacting us/i)).toBeInTheDocument()
  })

  it('shows submit error when submitContact returns error', async () => {
    mockSubmitContact.mockResolvedValueOnce({ error: new Error('network') })
    const user = userEvent.setup()
    render(<Contact />)

    await user.type(screen.getByLabelText(/full name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/email address/i), 'jane@example.com')
    await user.type(screen.getByLabelText(/phone number/i), '5551234567')
    await user.selectOptions(screen.getByLabelText(/service type/i), 'Kitchen Remodeling')
    await user.type(
      screen.getByLabelText(/tell us about your project/i),
      'I need a full kitchen remodel with new cabinets.'
    )
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(screen.getByText(/failed to send/i)).toBeInTheDocument()
    expect(mockReportError).toHaveBeenCalled()
  })

  it('disables submit button while submitting', async () => {
    let resolveSubmit: () => void
    mockSubmitContact.mockImplementation(
      () => new Promise<void>((r) => { resolveSubmit = r })
    )
    const user = userEvent.setup()
    render(<Contact />)

    await user.type(screen.getByLabelText(/full name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/email address/i), 'jane@example.com')
    await user.type(screen.getByLabelText(/phone number/i), '5551234567')
    await user.selectOptions(screen.getByLabelText(/service type/i), 'Kitchen Remodeling')
    await user.type(
      screen.getByLabelText(/tell us about your project/i),
      'I need a full kitchen remodel with new cabinets.'
    )
    const submitBtn = screen.getByRole('button', { name: /send message/i })
    await user.click(submitBtn)

    await screen.findByText(/sending/i)
    expect(submitBtn).toBeDisabled()
    resolveSubmit!()
  })
})
