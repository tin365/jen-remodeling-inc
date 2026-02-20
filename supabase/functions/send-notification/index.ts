// Supabase Edge Function: send email notification when DB changes (e.g. new contact, new review).
// Uses Resend (https://resend.com). Set RESEND_API_KEY and NOTIFICATION_EMAIL in Supabase secrets.

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const NOTIFICATION_EMAIL = Deno.env.get('NOTIFICATION_EMAIL') // Your email to receive notifications

interface WebhookPayload {
  type?: 'INSERT' | 'UPDATE' | 'DELETE'
  table?: string
  record?: Record<string, unknown>
  old_record?: Record<string, unknown>
}

function formatContactEmail(record: Record<string, unknown>): { subject: string; html: string } {
  const name = String(record.name ?? '')
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

function formatReviewEmail(record: Record<string, unknown>): { subject: string; html: string } {
  const name = String(record.name ?? '')
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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*' } })
  }

  if (!RESEND_API_KEY || !NOTIFICATION_EMAIL) {
    console.error('Missing RESEND_API_KEY or NOTIFICATION_EMAIL')
    return new Response(
      JSON.stringify({ error: 'Server configuration missing' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  let payload: WebhookPayload
  try {
    payload = await req.json()
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const { type, table, record, old_record } = payload
  if (type !== 'INSERT' && type !== 'UPDATE' && type !== 'DELETE') {
    return new Response(
      JSON.stringify({ error: 'Unsupported event type' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const data = (type === 'DELETE' ? old_record : record) as Record<string, unknown> | undefined
  if (!data && type !== 'DELETE') {
    return new Response(
      JSON.stringify({ error: 'No record in payload' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  let subject: string
  let html: string

  if (table === 'contact_submissions' && data && (type === 'INSERT' || type === 'UPDATE')) {
    const formatted = formatContactEmail(data)
    subject = type === 'INSERT' ? formatted.subject : `[JEN Site] Contact updated: ${data.name}`
    html = formatted.html
  } else if (table === 'reviews' && data && (type === 'INSERT' || type === 'UPDATE')) {
    const formatted = formatReviewEmail(data)
    subject = type === 'INSERT' ? formatted.subject : `[JEN Site] Review updated: ${data.name}`
    html = formatted.html
  } else if (table === 'projects' || table === 'project_images') {
    subject = `[JEN Site] Change: ${table} ${type}`
    html = `<p>Table: ${table}, Event: ${type}</p><pre>${JSON.stringify(data ?? {}, null, 2)}</pre>`
  } else {
    subject = `[JEN Site] ${table ?? 'unknown'} – ${type}`
    html = `<p>Table: ${table}, Event: ${type}</p><pre>${JSON.stringify(data ?? {}, null, 2)}</pre>`
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'onboarding@resend.dev',
      to: [NOTIFICATION_EMAIL],
      subject,
      html,
    }),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    console.error('Resend error', res.status, data)
    return new Response(
      JSON.stringify({ error: 'Failed to send email', details: data }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ ok: true, id: data.id }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
})
