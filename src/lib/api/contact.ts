import { supabase } from '@/lib/supabase'
import type { ContactSubmissionInput } from '@/lib/types'

export async function submitContact(data: ContactSubmissionInput): Promise<{ error: Error | null }> {
  const { error } = await supabase.from('contact_submissions').insert({
    name: data.name.trim().slice(0, 200),
    email: data.email.trim().slice(0, 255),
    phone: data.phone.trim().slice(0, 50),
    preferred_contact: data.preferred_contact,
    service: data.service,
    project_type: data.project_type || null,
    budget: data.budget || null,
    timeline: data.timeline || null,
    message: data.message.trim().slice(0, 10000),
  })
  return { error: (error ?? null) as Error | null }
}
