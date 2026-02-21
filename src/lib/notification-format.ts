/**
 * Shared helpers for email notification formatting (contact/review webhooks).
 * Used by tests; Supabase Edge Function send-notification mirrors this logic.
 */

export const MAX_SUBJECT_LENGTH = 200

/** Sanitize string for use in email subject (prevent header injection). */
export function sanitizeSubject(s: string): string {
  return s
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_SUBJECT_LENGTH)
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function formatContactEmail(record: Record<string, unknown>): { subject: string; html: string } {
  const name = sanitizeSubject(String(record.name ?? ''))
  const email = String(record.email ?? '')
  const phone = String(record.phone ?? '')
  const service = String(record.service ?? '')
  const message = String(record.message ?? '')
  const preferred = String(record.preferred_contact ?? '')
  const projectType = record.project_type ? String(record.project_type) : ''
  const budget = record.budget ? String(record.budget) : ''
  const timeline = record.timeline ? String(record.timeline) : ''
  return {
    subject: `[JEN Site] New contact: ${name}`,
    html: `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Preferred contact:</strong> ${escapeHtml(preferred)}</p>
      <p><strong>Service:</strong> ${escapeHtml(service)}</p>
      ${projectType ? `<p><strong>Project type:</strong> ${escapeHtml(projectType)}</p>` : ''}
      ${budget ? `<p><strong>Budget:</strong> ${escapeHtml(budget)}</p>` : ''}
      ${timeline ? `<p><strong>Timeline:</strong> ${escapeHtml(timeline)}</p>` : ''}
      <p><strong>Message:</strong></p>
      <pre style="white-space:pre-wrap;font-family:inherit;">${escapeHtml(message)}</pre>
    `.trim(),
  }
}

export function formatReviewEmail(record: Record<string, unknown>): { subject: string; html: string } {
  const name = sanitizeSubject(String(record.name ?? ''))
  const service = String(record.service ?? '')
  const rating = Number(record.rating ?? 0)
  const text = String(record.text ?? '')
  return {
    subject: `[JEN Site] New review from ${name}`,
    html: `
      <h2>New review</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Service:</strong> ${escapeHtml(service)}</p>
      <p><strong>Rating:</strong> ${rating}/5</p>
      <p><strong>Review:</strong></p>
      <pre style="white-space:pre-wrap;font-family:inherit;">${escapeHtml(text)}</pre>
    `.trim(),
  }
}
