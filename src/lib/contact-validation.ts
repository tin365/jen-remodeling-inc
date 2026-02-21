/**
 * Contact form validation (extracted for testability).
 * Limits align with backend: name 200, message 20–10000.
 */

export interface ContactFormFields {
  name: string
  email: string
  phone: string
  service: string
  message: string
}

export interface ContactFormErrors {
  name?: string
  email?: string
  phone?: string
  service?: string
  message?: string
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function validatePhone(phone: string): boolean {
  const re = /^[\d\s\-()+]+$/
  const digitCount = (phone.match(/\d/g) ?? []).length
  return digitCount >= 10 && re.test(phone)
}

const NAME_MAX = 200
const MESSAGE_MIN = 20
const MESSAGE_MAX = 10000

export function validateContactForm(data: ContactFormFields): { errors: ContactFormErrors; valid: boolean } {
  const errors: ContactFormErrors = {}
  if (!data.name.trim()) errors.name = 'Name is required'
  else if (data.name.trim().length > NAME_MAX) errors.name = 'Name is too long'
  if (!data.email.trim()) errors.email = 'Email is required'
  else if (!validateEmail(data.email)) errors.email = 'Please enter a valid email address'
  if (!data.phone.trim()) errors.phone = 'Phone number is required'
  else if (!validatePhone(data.phone)) errors.phone = 'Please enter a valid phone number'
  if (!data.service) errors.service = 'Please select a service'
  if (!data.message.trim()) errors.message = 'Please tell us about your project'
  else if (data.message.trim().length < MESSAGE_MIN) errors.message = 'Please provide more details (at least 20 characters)'
  else if (data.message.trim().length > MESSAGE_MAX) errors.message = 'Message is too long (max 10,000 characters)'
  return { errors, valid: Object.keys(errors).length === 0 }
}
