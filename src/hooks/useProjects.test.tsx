import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { useProjects } from './useProjects'

const mockFetchProjects = vi.fn()

vi.mock('@/lib/api', () => ({
  fetchProjects: (...args: unknown[]) => mockFetchProjects(...args),
}))

function ProjectsConsumer() {
  const { projects, loading, error } = useProjects()
  return (
    <div>
      <span data-testid="loading">{loading ? 'true' : 'false'}</span>
      <span data-testid="error">{error ? error.message : ''}</span>
      <ul>
        {projects.map((p) => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>
    </div>
  )
}

describe('useProjects', () => {
  beforeEach(() => {
    mockFetchProjects.mockReset()
  })

  it('loads projects on mount and updates state on success', async () => {
    mockFetchProjects.mockResolvedValueOnce([
      {
        id: 'p1',
        title: 'Kitchen',
        category: 'kitchen',
        description: 'Desc',
        before: [],
        after: [],
      },
    ])

    render(<ProjectsConsumer />)

    expect(screen.getByTestId('loading').textContent).toBe('true')

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })

    expect(screen.queryByTestId('error')?.textContent).toBe('')
    expect(screen.getByText('Kitchen')).toBeInTheDocument()
  })

  it('sets error and clears projects when fetch throws', async () => {
    mockFetchProjects.mockRejectedValueOnce(new Error('network failed'))

    render(<ProjectsConsumer />)

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })

    expect(screen.getByTestId('error').textContent).toBe('network failed')
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })
})

