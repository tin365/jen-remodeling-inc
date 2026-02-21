/** Shared types for Supabase-backed data (aligned with DB and RLS). */

export type ProjectCategory = 'basement' | 'kitchen' | 'bathroom' | 'living-room'

export interface Project {
  id: string
  category: ProjectCategory
  title: string
  before: string[]
  after: string[]
  description: string
}

export type ReviewService = 'basement' | 'kitchen' | 'bathroom' | 'living-room' | 'other'

export interface Review {
  id: string
  name: string
  service: ReviewService
  rating: number
  date: string
  text: string
  helpful: number
}

export interface ContactSubmissionInput {
  name: string
  email: string
  phone: string
  preferred_contact: string
  service: string
  project_type: string | null
  budget: string | null
  timeline: string | null
  message: string
}
