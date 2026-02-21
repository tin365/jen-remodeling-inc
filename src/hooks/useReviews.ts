'use client'

import { useState, useEffect, useCallback } from 'react'
import { fetchReviews } from '@/lib/api'
import type { Review } from '@/lib/types'

export function useReviews(): {
  reviews: Review[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
} {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchReviews()
      setReviews(data)
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to load reviews'))
      setReviews([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { reviews, loading, error, refetch }
}
