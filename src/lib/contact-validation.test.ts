import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validatePhone,
  validateContactForm,
} from './contact-validation'

describe('validateEmail', () => {
  it('accepts valid emails', () => {
    expect(validateEmail('a@b.co')).toBe(true)
    expect(validateEmail('user@example.com')).toBe(true)
    expect(validateEmail('user.name+tag@example.co.uk')).toBe(true)
  })

  it('rejects invalid emails', () => {
    expect(validateEmail('')).toBe(false)
    expect(validateEmail('no-at-sign')).toBe(false)
    expect(validateEmail('@nodomain.com')).toBe(false)
    expect(validateEmail('nodomain@')).toBe(false)
    expect(validateEmail('a@b')).toBe(false)
    expect(validateEmail('a@.c')).toBe(false)
  })
})

describe('validatePhone', () => {
  it('accepts valid phones with at least 10 digit chars', () => {
    expect(validatePhone('1234567890')).toBe(true)
    expect(validatePhone('+60 17-439 8540')).toBe(true)
    expect(validatePhone('(555) 123-4567')).toBe(true)
    expect(validatePhone('555 123 4567')).toBe(true)
    expect(validatePhone('+1 555-123-4567')).toBe(true)
  })

  it('rejects phones with fewer than 10 digits', () => {
    expect(validatePhone('123456789')).toBe(false)
    expect(validatePhone('')).toBe(false)
    expect(validatePhone('12 34 56')).toBe(false)
  })

  it('rejects phones with disallowed characters', () => {
    expect(validatePhone('1234567890a')).toBe(false)
    expect(validatePhone('1234567890.')).toBe(false)
  })
})

describe('validateContactForm', () => {
  const validData = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '5551234567',
    service: 'Kitchen Remodeling',
    message: 'I need a full kitchen remodel with new cabinets.',
  }

  it('returns valid and no errors for complete valid data', () => {
    const result = validateContactForm(validData)
    expect(result.valid).toBe(true)
    expect(Object.keys(result.errors)).toHaveLength(0)
  })

  it('requires name', () => {
    const result = validateContactForm({ ...validData, name: '' })
    expect(result.valid).toBe(false)
    expect(result.errors.name).toBe('Name is required')
  })

  it('rejects name longer than 200 chars', () => {
    const result = validateContactForm({ ...validData, name: 'a'.repeat(201) })
    expect(result.valid).toBe(false)
    expect(result.errors.name).toBe('Name is too long')
  })

  it('accepts name with exactly 200 chars', () => {
    const result = validateContactForm({ ...validData, name: 'a'.repeat(200) })
    expect(result.valid).toBe(true)
    expect(result.errors.name).toBeUndefined()
  })

  it('requires email', () => {
    const result = validateContactForm({ ...validData, email: '' })
    expect(result.valid).toBe(false)
    expect(result.errors.email).toBe('Email is required')
  })

  it('rejects invalid email', () => {
    const result = validateContactForm({ ...validData, email: 'notanemail' })
    expect(result.valid).toBe(false)
    expect(result.errors.email).toBe('Please enter a valid email address')
  })

  it('requires phone', () => {
    const result = validateContactForm({ ...validData, phone: '' })
    expect(result.valid).toBe(false)
    expect(result.errors.phone).toBe('Phone number is required')
  })

  it('rejects invalid phone (9 digits)', () => {
    const result = validateContactForm({ ...validData, phone: '123456789' })
    expect(result.valid).toBe(false)
    expect(result.errors.phone).toBe('Please enter a valid phone number')
  })

  it('requires service', () => {
    const result = validateContactForm({ ...validData, service: '' })
    expect(result.valid).toBe(false)
    expect(result.errors.service).toBe('Please select a service')
  })

  it('requires message', () => {
    const result = validateContactForm({ ...validData, message: '' })
    expect(result.valid).toBe(false)
    expect(result.errors.message).toBe('Please tell us about your project')
  })

  it('rejects message shorter than 20 chars', () => {
    const result = validateContactForm({ ...validData, message: 'Too short' })
    expect(result.valid).toBe(false)
    expect(result.errors.message).toBe('Please provide more details (at least 20 characters)')
  })

  it('accepts message with exactly 20 chars', () => {
    const result = validateContactForm({ ...validData, message: 'a'.repeat(20) })
    expect(result.valid).toBe(true)
    expect(result.errors.message).toBeUndefined()
  })

  it('rejects message longer than 10000 chars', () => {
    const result = validateContactForm({ ...validData, message: 'a'.repeat(10001) })
    expect(result.valid).toBe(false)
    expect(result.errors.message).toBe('Message is too long (max 10,000 characters)')
  })

  it('accepts message with exactly 10000 chars', () => {
    const result = validateContactForm({ ...validData, message: 'a'.repeat(10000) })
    expect(result.valid).toBe(true)
    expect(result.errors.message).toBeUndefined()
  })

  it('collects multiple errors', () => {
    const result = validateContactForm({
      name: '',
      email: '',
      phone: '9',
      service: '',
      message: 'short',
    })
    expect(result.valid).toBe(false)
    expect(result.errors.name).toBeDefined()
    expect(result.errors.email).toBeDefined()
    expect(result.errors.phone).toBeDefined()
    expect(result.errors.service).toBeDefined()
    expect(result.errors.message).toBeDefined()
  })
})
