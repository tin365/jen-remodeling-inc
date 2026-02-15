'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface ContactFormData {
  name: string
  email: string
  phone: string
  service: string
  projectType: string
  budget: string
  timeline: string
  message: string
  preferredContact: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  service?: string
  message?: string
}

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  service: '',
  projectType: '',
  budget: '',
  timeline: '',
  message: '',
  preferredContact: 'email',
}

const services = [
  'Basement Remodeling',
  'Bathroom Remodeling',
  'Kitchen Remodeling',
  'Living Room Remodeling',
  'Indoor Remodeling',
  'Other',
]

const budgetRanges = [
  'Under $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000 - $100,000',
  'Over $100,000',
]

const timelines = [
  'As soon as possible',
  'Within 1-3 months',
  'Within 3-6 months',
  '6+ months',
  'Just exploring options',
]

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    const re = /^[\d\s\-()]+$/
    return phone.length >= 10 && re.test(phone)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email address'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    else if (!validatePhone(formData.phone)) newErrors.phone = 'Please enter a valid phone number'
    if (!formData.service) newErrors.service = 'Please select a service'
    if (!formData.message.trim()) newErrors.message = 'Please tell us about your project'
    else if (formData.message.trim().length < 20) newErrors.message = 'Please provide more details (at least 20 characters)'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setSubmitError(null)
    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('contact_submissions').insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        preferred_contact: formData.preferredContact,
        service: formData.service,
        project_type: formData.projectType || null,
        budget: formData.budget || null,
        timeline: formData.timeline || null,
        message: formData.message.trim(),
      })
      if (error) throw error
      setSubmitSuccess(true)
      setSubmitError(null)
      setFormData(initialFormData)
      setErrors({})
      setTimeout(() => setSubmitSuccess(false), 3000)
    } catch (err) {
      setSubmitError('Failed to send. Please try again or call us.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputBase = 'w-full p-2 border font-[inherit] text-[0.95rem] bg-paper focus:outline-none focus:border-ink'
  const inputError = 'border-ink border-2'

  return (
    <div className="bg-paper">
      <section className="py-10 px-6 text-center border-b border-rule-light">
        <div className="max-w-content mx-auto">
          <h1 className="text-[clamp(1.5rem,4vw,2.25rem)] mb-2">Let&apos;s Build Your Dream Home</h1>
          <p className="text-[0.95rem] text-ink-light">
            Ready to transform your space? Get in touch with us today for a free consultation and estimate.
          </p>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-content mx-auto">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 mb-12">
            <div className="p-6 border border-rule-light text-center">
              <span className="text-2xl block mb-3">📞</span>
              <h3 className="text-base mb-2">Call Us</h3>
              <p className="text-[0.95rem]"><a href="tel:+1234567890" className="text-ink underline hover:decoration-2">(123) 456-7890</a></p>
              <p className="text-sm text-ink-light">Mon-Fri: 8AM - 6PM</p>
            </div>
            <div className="p-6 border border-rule-light text-center">
              <span className="text-2xl block mb-3">✉️</span>
              <h3 className="text-base mb-2">Email Us</h3>
              <p className="text-[0.95rem]"><a href="mailto:info@jenremodeling.com" className="text-ink underline hover:decoration-2">info@jenremodeling.com</a></p>
              <p className="text-sm text-ink-light">We&apos;ll respond within 24 hours</p>
            </div>
            <div className="p-6 border border-rule-light text-center">
              <span className="text-2xl block mb-3">📍</span>
              <h3 className="text-base mb-2">Visit Us</h3>
              <p className="text-[0.95rem]">123 Remodeling Street</p>
              <p className="text-sm text-ink-light">Your City, ST 12345</p>
            </div>
            <div className="p-6 border border-rule-light text-center">
              <span className="text-2xl block mb-3">🕐</span>
              <h3 className="text-base mb-2">Business Hours</h3>
              <p className="text-[0.95rem]">Monday - Friday</p>
              <p className="text-sm text-ink-light">8:00 AM - 6:00 PM</p>
            </div>
          </div>

          <div className="p-8 border border-rule-light mb-12">
            <div className="text-center mb-8 pb-4 border-b border-rule-light">
              <h2 className="text-2xl mb-2">Request a Free Consultation</h2>
              <p className="text-[0.95rem] text-ink-light">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>
            </div>

            {submitError && (
              <div className="bg-ink/10 border border-ink text-ink p-4 mb-6 text-center" role="alert">
                {submitError}
              </div>
            )}
            {submitSuccess && (
              <div className="bg-ink text-paper p-6 mb-6 text-center">
                <div className="w-10 h-10 bg-paper text-ink flex items-center justify-center text-xl font-bold mx-auto mb-3">✓</div>
                <h3 className="text-xl mb-2">Thank you for contacting us!</h3>
                <p className="text-[0.95rem] opacity-95">We&apos;ve received your message and will get back to you soon.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="w-full">
              <div className="text-lg mt-0 mb-4 pt-0 pb-2 border-b border-rule-light">Personal Information</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="mb-4 md:mb-0">
                  <label htmlFor="name" className="block text-sm mb-1.5">Full Name *</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`${inputBase} border-rule ${errors.name ? inputError : ''}`} placeholder="John Doe" />
                  {errors.name && <span className="text-ink text-sm mt-1 block">{errors.name}</span>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm mb-1.5">Email Address *</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`${inputBase} border-rule ${errors.email ? inputError : ''}`} placeholder="john@example.com" />
                  {errors.email && <span className="text-ink text-sm mt-1 block">{errors.email}</span>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="mb-4 md:mb-0">
                  <label htmlFor="phone" className="block text-sm mb-1.5">Phone Number *</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={`${inputBase} border-rule ${errors.phone ? inputError : ''}`} placeholder="(123) 456-7890" />
                  {errors.phone && <span className="text-ink text-sm mt-1 block">{errors.phone}</span>}
                </div>
                <div>
                  <label htmlFor="preferredContact" className="block text-sm mb-1.5">Preferred Contact Method</label>
                  <select id="preferredContact" name="preferredContact" value={formData.preferredContact} onChange={handleChange} className={`${inputBase} border-rule`}>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="either">Either</option>
                  </select>
                </div>
              </div>
              <div className="text-lg mt-8 mb-4 pt-0 pb-2 border-b border-rule-light">Project Details</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="mb-4 md:mb-0">
                  <label htmlFor="service" className="block text-sm mb-1.5">Service Type *</label>
                  <select id="service" name="service" value={formData.service} onChange={handleChange} className={`${inputBase} border-rule ${errors.service ? inputError : ''}`}>
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                  {errors.service && <span className="text-ink text-sm mt-1 block">{errors.service}</span>}
                </div>
                <div>
                  <label htmlFor="budget" className="block text-sm mb-1.5">Estimated Budget</label>
                  <select id="budget" name="budget" value={formData.budget} onChange={handleChange} className={`${inputBase} border-rule`}>
                    <option value="">Select budget range</option>
                    {budgetRanges.map((range) => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="mb-4 md:mb-0">
                  <label htmlFor="timeline" className="block text-sm mb-1.5">Project Timeline</label>
                  <select id="timeline" name="timeline" value={formData.timeline} onChange={handleChange} className={`${inputBase} border-rule`}>
                    <option value="">Select timeline</option>
                    {timelines.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="projectType" className="block text-sm mb-1.5">Property Type</label>
                  <select id="projectType" name="projectType" value={formData.projectType} onChange={handleChange} className={`${inputBase} border-rule`}>
                    <option value="">Select property type</option>
                    <option value="single-family">Single Family Home</option>
                    <option value="condo">Condo/Apartment</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm mb-1.5">Tell Us About Your Project *</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} className={`${inputBase} border-rule min-h-[120px] resize-y ${errors.message ? inputError : ''}`} rows={6} placeholder="Please describe your remodeling project, including any specific requirements or ideas you have..." />
                {errors.message && <span className="text-ink text-sm mt-1 block">{errors.message}</span>}
              </div>
              <button type="submit" className="w-full py-3 bg-ink text-paper border border-ink font-[inherit] text-sm cursor-pointer mt-4 hover:bg-ink-light hover:border-ink-light disabled:opacity-60 disabled:cursor-not-allowed" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-paper rounded-full animate-spin align-middle mr-2" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>

          <div className="text-center pt-8 border-t border-rule-light">
            <h2 className="text-xl mb-6">Why Choose Us?</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
              <div className="p-5 border border-rule-light">
                <span className="text-2xl block mb-3">⚡</span>
                <h3 className="text-base mb-2">Fast Response</h3>
                <p className="text-sm text-ink-light leading-relaxed">We respond to all inquiries within 24 hours, guaranteed.</p>
              </div>
              <div className="p-5 border border-rule-light">
                <span className="text-2xl block mb-3">💰</span>
                <h3 className="text-base mb-2">Free Estimates</h3>
                <p className="text-sm text-ink-light leading-relaxed">Get a detailed, no-obligation quote for your project.</p>
              </div>
              <div className="p-5 border border-rule-light">
                <span className="text-2xl block mb-3">🏆</span>
                <h3 className="text-base mb-2">Quality Work</h3>
                <p className="text-sm text-ink-light leading-relaxed">Backed by our satisfaction guarantee and warranty.</p>
              </div>
              <div className="p-5 border border-rule-light">
                <span className="text-2xl block mb-3">👥</span>
                <h3 className="text-base mb-2">Expert Team</h3>
                <p className="text-sm text-ink-light leading-relaxed">Licensed, insured professionals with years of experience.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
