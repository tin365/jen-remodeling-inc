import { supabase } from '@/lib/supabase'
import type { Project, ProjectCategory } from '@/lib/types'

export async function fetchProjects(): Promise<Project[]> {
  const { data: projectsData } = await supabase
    .from('projects')
    .select('id, title, category, description, sort_order')
    .order('sort_order', { ascending: true })

  if (!projectsData?.length) return []

  const { data: imagesData } = await supabase
    .from('project_images')
    .select('project_id, url, label, sort_order')
    .order('sort_order', { ascending: true })

  const images = (imagesData ?? []) as {
    project_id: string
    url: string
    label: 'before' | 'after'
    sort_order: number
  }[]

  return projectsData.map((p: { id: string; title: string; category: string; description: string }) => {
    const before = images
      .filter((i) => i.project_id === p.id && i.label === 'before')
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((i) => i.url)
    const after = images
      .filter((i) => i.project_id === p.id && i.label === 'after')
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((i) => i.url)
    return {
      id: p.id,
      category: p.category as ProjectCategory,
      title: p.title,
      description: p.description ?? '',
      before,
      after,
    }
  })
}
