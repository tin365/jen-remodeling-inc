import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { reportError } from './error-reporting'

const mockInsert = vi.fn().mockResolvedValue(undefined)
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({ insert: mockInsert })),
  },
}))

const mockCaptureException = vi.fn()
vi.mock('@sentry/nextjs', () => ({
  captureException: (...args: unknown[]) => mockCaptureException(...args),
}))

const originalWindow = global.window
const originalEnv = process.env

describe('reportError', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(global, 'window', { value: { location: { href: 'https://example.com/contact' } }, writable: true })
  })

  afterEach(() => {
    Object.defineProperty(global, 'window', { value: originalWindow, writable: true })
    process.env = { ...originalEnv }
  })

  it('does nothing when error is null/undefined', () => {
    reportError(null)
    reportError(undefined)
    expect(mockInsert).not.toHaveBeenCalled()
    expect(mockCaptureException).not.toHaveBeenCalled()
  })

  it('inserts into error_logs with message, stack, url, and optional source', async () => {
    const err = new Error('Something broke')
    reportError(err, 'contact_form')
    await vi.waitFor(() => {
      expect(mockInsert).toHaveBeenCalledTimes(1)
    })
    const payload = mockInsert.mock.calls[0][0]
    expect(payload.message).toBe('Something broke')
    expect(payload.stack).toBe(err.stack)
    expect(payload.url).toBe('https://example.com/contact')
    expect(payload.source).toBe('contact_form')
  })

  it('converts non-Error to Error and uses message', async () => {
    reportError('string error')
    await vi.waitFor(() => {
      expect(mockInsert).toHaveBeenCalledTimes(1)
    })
    const payload = mockInsert.mock.calls[0][0]
    expect(payload.message).toBe('string error')
    expect(payload.source).toBeNull()
  })

  it('calls Sentry.captureException when NEXT_PUBLIC_SENTRY_DSN is set', () => {
    process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://key@sentry.io/1'
    const err = new Error('test')
    reportError(err)
    expect(mockCaptureException).toHaveBeenCalledWith(err)
  })

  it('does not call Sentry when NEXT_PUBLIC_SENTRY_DSN is unset', () => {
    delete process.env.NEXT_PUBLIC_SENTRY_DSN
    reportError(new Error('test'))
    expect(mockCaptureException).not.toHaveBeenCalled()
  })
})
