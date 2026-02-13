import Projects from '@/components/Projects'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects - Before & After Gallery | JEN Remodeling Inc',
  description: 'Explore our portfolio of stunning home transformations. See before and after photos of our kitchen, bathroom, basement, and living room remodeling projects.',
}

export default function ProjectsPage() {
  return <Projects />
}
