import { supabase } from '@/lib/supabase'
import type { Review, ReviewService } from '@/lib/types'

const REVIEW_COLS = 'id, name, service, rating, "text", helpful, created_at'

export async function fetchReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select(REVIEW_COLS)
    .order('created_at', { ascending: false })
  if (error) return []
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    service: r.service as ReviewService,
    rating: r.rating,
    date: r.created_at.split('T')[0],
    text: r.text,
    helpful: r.helpful ?? 0,
  }))
}

export interface SubmitReviewInput {
  name: string
  service: string
  rating: number
  text: string
}

export async function submitReview(input: SubmitReviewInput): Promise<{ data: Review | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      name: input.name.trim().slice(0, 200),
      service: input.service,
      rating: input.rating,
      text: input.text.trim().slice(0, 5000),
    })
    .select(REVIEW_COLS)
    .single()
  if (error) return { data: null, error }
  return {
    data: data
      ? {
          id: data.id,
          name: data.name,
          service: data.service as ReviewService,
          rating: data.rating,
          date: data.created_at.split('T')[0],
          text: data.text,
          helpful: data.helpful ?? 0,
        }
      : null,
    error: null,
  }
}
