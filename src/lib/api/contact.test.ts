import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitContact } from './contact'
import type { ContactSubmissionInput } from '@/lib/types'

const mockInsert = vi.fn()
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({ insert: mockInsert })),
  },
}))

describe('submitContact', () => {
  beforeEach(() => {
    mockInsert.mockReset()
  })

  it('calls insert with trimmed and sliced payload on success', async () => {
    mockInsert.mockResolvedValueOnce({ error: null })

    const input: ContactSubmissionInput = {
      name: '  Jane Doe  ',
      email: ' jane@example.com ',
      phone: ' 555-123-4567 ',
      preferred_contact: 'email',
      service: 'Kitchen Remodeling',
      project_type: null,
      budget: null,
      timeline: null,
      message: '  I want a new kitchen.  ',
    }

    const result = await submitContact(input)

    expect(result.error).toBeNull()
    expect(mockInsert).toHaveBeenCalledTimes(1)
    const payload = mockInsert.mock.calls[0][0]
    expect(payload.name).toBe('Jane Doe')
    expect(payload.email).toBe('jane@example.com')
    expect(payload.phone).toBe('555-123-4567')
    expect(payload.preferred_contact).toBe('email')
    expect(payload.service).toBe('Kitchen Remodeling')
    expect(payload.project_type).toBeNull()
    expect(payload.budget).toBeNull()
    expect(payload.timeline).toBeNull()
    expect(payload.message).toBe('I want a new kitchen.')
  })

  it('slices name to 200 and message to 10000 chars', async () => {
    mockInsert.mockResolvedValueOnce({ error: null })

    const longName = 'a'.repeat(300)
    const longMessage = 'b'.repeat(15000)

    await submitContact({
      name: longName,
      email: 'a@b.co',
      phone: '1234567890',
      preferred_contact: 'phone',
      service: 'Other',
      project_type: null,
      budget: null,
      timeline: null,
      message: longMessage,
    })

    const payload = mockInsert.mock.calls[0][0]
    expect(payload.name).toHaveLength(200)
    expect(payload.name).toBe('a'.repeat(200))
    expect(payload.message).toHaveLength(10000)
    expect(payload.message).toBe('b'.repeat(10000))
  })

  it('returns error when Supabase returns error', async () => {
    const dbError = new Error('duplicate key')
    mockInsert.mockResolvedValueOnce({ error: dbError })

    const result = await submitContact({
      name: 'Jane',
      email: 'jane@example.com',
      phone: '5551234567',
      preferred_contact: 'email',
      service: 'Bathroom Remodeling',
      project_type: null,
      budget: null,
      timeline: null,
      message: 'I need a new bathroom with at least 20 characters here.',
    })

    expect(result.error).toBe(dbError)
    expect(mockInsert).toHaveBeenCalledTimes(1)
  })
})
