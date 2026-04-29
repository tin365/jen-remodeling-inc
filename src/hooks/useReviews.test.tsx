import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { useReviews } from './useReviews'

const mockFetchReviews = vi.fn()

vi.mock('@/lib/api', () => ({
  fetchReviews: (...args: unknown[]) => mockFetchReviews(...args),
}))

function ReviewsConsumer() {
  const { reviews, loading, error } = useReviews()
  return (
    <div>
      <span data-testid="loading">{loading ? 'true' : 'false'}</span>
      <span data-testid="error">{error ? error.message : ''}</span>
      <ul>
        {reviews.map((r) => (
          <li key={r.id}>{r.name}</li>
        ))}
      </ul>
    </div>
  )
}

describe('useReviews', () => {
  beforeEach(() => {
    mockFetchReviews.mockReset()
  })

  it('loads reviews on mount and updates state on success', async () => {
    mockFetchReviews.mockResolvedValueOnce([
      {
        id: 'r1',
        name: 'Alice',
        service: 'kitchen',
        rating: 5,
        date: '2025-01-01',
        text: 'Great work',
        helpful: 0,
      },
    ])

    render(<ReviewsConsumer />)

    expect(screen.getByTestId('loading').textContent).toBe('true')

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })

    expect(screen.queryByTestId('error')?.textContent).toBe('')
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('sets error and clears reviews when fetch throws', async () => {
    mockFetchReviews.mockRejectedValueOnce(new Error('db down'))

    render(<ReviewsConsumer />)

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })

    expect(screen.getByTestId('error').textContent).toBe('db down')
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })
})

