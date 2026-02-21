import { describe, it, expect } from 'vitest'
import {
  sanitizeSubject,
  escapeHtml,
  formatContactEmail,
  formatReviewEmail,
  MAX_SUBJECT_LENGTH,
} from './notification-format'

describe('sanitizeSubject', () => {
  it('strips newlines and normalizes spaces', () => {
    expect(sanitizeSubject('hello\r\nworld')).toBe('hello world')
    expect(sanitizeSubject('  a   b   c  ')).toBe('a b c')
  })

  it('truncates to MAX_SUBJECT_LENGTH', () => {
    const long = 'a'.repeat(300)
    expect(sanitizeSubject(long)).toHaveLength(MAX_SUBJECT_LENGTH)
    expect(sanitizeSubject(long)).toBe('a'.repeat(MAX_SUBJECT_LENGTH))
  })

  it('trims and truncates together', () => {
    const longWithNewline = '\n\n' + 'b'.repeat(250)
    const result = sanitizeSubject(longWithNewline)
    expect(result).not.toMatch(/\n/)
    expect(result.length).toBeLessThanOrEqual(MAX_SUBJECT_LENGTH)
  })
})

describe('escapeHtml', () => {
  it('escapes angle brackets', () => {
    expect(escapeHtml('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;')
  })

  it('escapes ampersand', () => {
    expect(escapeHtml('a & b')).toBe('a &amp; b')
  })

  it('escapes double and single quotes', () => {
    expect(escapeHtml('"hello"')).toBe('&quot;hello&quot;')
    expect(escapeHtml("'test'")).toBe('&#39;test&#39;')
  })

  it('escapes all together', () => {
    expect(escapeHtml('<img src="x" onerror=\'y\'>')).toBe(
      '&lt;img src=&quot;x&quot; onerror=&#39;y&#39;&gt;'
    )
  })
})

describe('formatContactEmail', () => {
  it('returns subject and html with escaped fields', () => {
    const record = {
      name: 'Alice',
      email: 'alice@example.com',
      phone: '555-1234',
      preferred_contact: 'email',
      service: 'Kitchen Remodeling',
      message: 'I want a new kitchen.',
    }
    const { subject, html } = formatContactEmail(record)
    expect(subject).toBe('[JEN Site] New contact: Alice')
    expect(html).toContain('Alice')
    expect(html).toContain('alice@example.com')
    expect(html).toContain('Kitchen Remodeling')
    expect(html).toContain('I want a new kitchen.')
  })

  it('escapes HTML in name and message', () => {
    const record = {
      name: '<script>',
      email: 'a@b.co',
      phone: '1',
      preferred_contact: 'email',
      service: 'Other',
      message: 'Hello "world"',
    }
    const { html } = formatContactEmail(record)
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
    expect(html).not.toContain('"world"')
    expect(html).toContain('&quot;world&quot;')
  })
})

describe('formatReviewEmail', () => {
  it('returns subject and html with rating', () => {
    const record = {
      name: 'Bob',
      service: 'bathroom',
      rating: 5,
      text: 'Great work!',
    }
    const { subject, html } = formatReviewEmail(record)
    expect(subject).toBe('[JEN Site] New review from Bob')
    expect(html).toContain('Bob')
    expect(html).toContain('bathroom')
    expect(html).toContain('5/5')
    expect(html).toContain('Great work!')
  })

  it('escapes HTML in review text', () => {
    const record = {
      name: 'C',
      service: 'other',
      rating: 1,
      text: '<img src=x onerror=alert(1)>',
    }
    const { html } = formatReviewEmail(record)
    expect(html).not.toContain('<img')
    expect(html).toContain('&lt;img')
  })
})
