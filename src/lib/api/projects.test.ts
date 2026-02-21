import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchProjects } from './projects'

function chainSelectOrder(result: { data: unknown[] | null }) {
  return {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue(result),
  }
}

const mockFrom = vi.fn()
vi.mock('@/lib/supabase', () => ({
  supabase: { from: (table: string) => mockFrom(table) },
}))

describe('fetchProjects', () => {
  beforeEach(() => {
    mockFrom.mockReset()
  })

  it('returns mapped projects with before/after images', async () => {
    const projectsData = [
      { id: 'p1', title: 'Kitchen', category: 'kitchen', description: 'New kitchen', sort_order: 0 },
    ]
    const imagesData = [
      { project_id: 'p1', url: 'https://before.jpg', label: 'before', sort_order: 0 },
      { project_id: 'p1', url: 'https://after.jpg', label: 'after', sort_order: 0 },
    ]
    mockFrom
      .mockReturnValueOnce(chainSelectOrder({ data: projectsData }))
      .mockReturnValueOnce(chainSelectOrder({ data: imagesData }))
    const result = await fetchProjects()
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      id: 'p1',
      category: 'kitchen',
      title: 'Kitchen',
      description: 'New kitchen',
      before: ['https://before.jpg'],
      after: ['https://after.jpg'],
    })
    expect(mockFrom).toHaveBeenNthCalledWith(1, 'projects')
    expect(mockFrom).toHaveBeenNthCalledWith(2, 'project_images')
  })

  it('returns empty array when no projects', async () => {
    mockFrom.mockReturnValueOnce(chainSelectOrder({ data: [] }))
    const result = await fetchProjects()
    expect(result).toEqual([])
    expect(mockFrom).toHaveBeenCalledTimes(1)
  })

  it('returns empty array when projectsData is null', async () => {
    mockFrom.mockReturnValueOnce(chainSelectOrder({ data: null }))
    const result = await fetchProjects()
    expect(result).toEqual([])
  })

  it('filters and sorts images by label and sort_order', async () => {
    const projectsData = [
      { id: 'p1', title: 'Bath', category: 'bathroom', description: '', sort_order: 0 },
    ]
    const imagesData = [
      { project_id: 'p1', url: '/b2.jpg', label: 'before', sort_order: 1 },
      { project_id: 'p1', url: '/b1.jpg', label: 'before', sort_order: 0 },
      { project_id: 'p1', url: '/a1.jpg', label: 'after', sort_order: 0 },
    ]
    mockFrom
      .mockReturnValueOnce(chainSelectOrder({ data: projectsData }))
      .mockReturnValueOnce(chainSelectOrder({ data: imagesData }))
    const result = await fetchProjects()
    expect(result[0].before).toEqual(['/b1.jpg', '/b2.jpg'])
    expect(result[0].after).toEqual(['/a1.jpg'])
  })

  it('uses empty description when null', async () => {
    const projectsData = [
      { id: 'p1', title: 'T', category: 'basement', description: null, sort_order: 0 },
    ]
    mockFrom
      .mockReturnValueOnce(chainSelectOrder({ data: projectsData }))
      .mockReturnValueOnce(chainSelectOrder({ data: [] }))
    const result = await fetchProjects()
    expect(result[0].description).toBe('')
  })
})
