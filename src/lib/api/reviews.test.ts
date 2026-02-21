import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchReviews, submitReview } from './reviews'

function chainSelectOrder(result: { data: unknown[] | null; error?: Error | null }) {
  return {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue(result),
  }
}

function chainInsertSelectSingle(result: { data: unknown | null; error?: Error | null }) {
  return {
    insert: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(result),
  }
}

const mockFrom = vi.fn()
vi.mock('@/lib/supabase', () => ({
  supabase: { from: (table: string) => mockFrom(table) },
}))

describe('fetchReviews', () => {
  beforeEach(() => {
    mockFrom.mockReset()
  })

  it('returns mapped reviews on success', async () => {
    const rows = [
      {
        id: 'r1',
        name: 'Alice',
        service: 'kitchen',
        rating: 5,
        text: 'Great work',
        helpful: 2,
        created_at: '2025-01-15T12:00:00Z',
      },
    ]
    mockFrom.mockReturnValue(chainSelectOrder({ data: rows, error: null }))
    const result = await fetchReviews()
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      id: 'r1',
      name: 'Alice',
      service: 'kitchen',
      rating: 5,
      date: '2025-01-15',
      text: 'Great work',
      helpful: 2,
    })
    expect(mockFrom).toHaveBeenCalledWith('reviews')
  })

  it('returns empty array on Supabase error', async () => {
    mockFrom.mockReturnValue(chainSelectOrder({ data: null, error: new Error('db') }))
    const result = await fetchReviews()
    expect(result).toEqual([])
  })

  it('returns empty array when data is null', async () => {
    mockFrom.mockReturnValue(chainSelectOrder({ data: null, error: null }))
    const result = await fetchReviews()
    expect(result).toEqual([])
  })

  it('returns empty array when data is empty', async () => {
    mockFrom.mockReturnValue(chainSelectOrder({ data: [], error: null }))
    const result = await fetchReviews()
    expect(result).toEqual([])
  })

  it('maps helpful to 0 when null', async () => {
    mockFrom.mockReturnValue(
      chainSelectOrder({
        data: [
          {
            id: 'r1',
            name: 'B',
            service: 'bathroom',
            rating: 4,
            text: 'Good',
            helpful: null,
            created_at: '2025-01-01T00:00:00Z',
          },
        ],
        error: null,
      })
    )
    const result = await fetchReviews()
    expect(result[0].helpful).toBe(0)
  })
})

describe('submitReview', () => {
  beforeEach(() => {
    mockFrom.mockReset()
  })

  it('returns mapped review on success', async () => {
    const row = {
      id: 'r1',
      name: 'Bob',
      service: 'living-room',
      rating: 5,
      text: 'Excellent',
      helpful: 0,
      created_at: '2025-02-01T10:00:00Z',
    }
    mockFrom.mockReturnValue(chainInsertSelectSingle({ data: row, error: null }))
    const result = await submitReview({
      name: 'Bob',
      service: 'living-room',
      rating: 5,
      text: 'Excellent',
    })
    expect(result.error).toBeNull()
    expect(result.data).toEqual({
      id: 'r1',
      name: 'Bob',
      service: 'living-room',
      rating: 5,
      date: '2025-02-01',
      text: 'Excellent',
      helpful: 0,
    })
  })

  it('returns error when Supabase returns error', async () => {
    const err = new Error('constraint')
    mockFrom.mockReturnValue(chainInsertSelectSingle({ data: null, error: err }))
    const result = await submitReview({
      name: 'C',
      service: 'other',
      rating: 3,
      text: 'Okay service with enough characters here.',
    })
    expect(result.data).toBeNull()
    expect(result.error).toBe(err)
  })

  it('trims and slices name and text in insert payload', async () => {
    const row = {
      id: 'r2',
      name: 'Trimmed',
      service: 'basement',
      rating: 4,
      text: 'Text',
      helpful: 0,
      created_at: '2025-01-01T00:00:00Z',
    }
    const chain = chainInsertSelectSingle({ data: row, error: null })
    mockFrom.mockReturnValue(chain)
    await submitReview({
      name: '  Long name ' + 'x'.repeat(300),
      service: 'basement',
      rating: 4,
      text: '  Short  ',
    })
    expect(chain.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        name: expect.any(String),
        text: 'Short',
      })
    )
    const insertArg = (chain.insert as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(insertArg.name.length).toBeLessThanOrEqual(200)
    expect(insertArg.text.length).toBeLessThanOrEqual(5000)
  })
})
