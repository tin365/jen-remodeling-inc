'use client'

import { useState, useEffect, useCallback } from 'react'
import { fetchProjects } from '@/lib/api'
import type { Project } from '@/lib/types'

export function useProjects(): {
  projects: Project[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
} {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchProjects()
      setProjects(data)
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to load projects'))
      setProjects([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { projects, loading, error, refetch }
}
