'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type ProjectCategory = 'basement' | 'kitchen' | 'bathroom' | 'living-room'

interface Project {
  id: string
  category: ProjectCategory
  title: string
  before: string[]
  after: string[]
  description: string
}

const staticProjects: Project[] = [
  {
    id: '1',
    category: 'basement',
    title: 'Modern Basement Entertainment Room',
    before: ['/istockphoto-1312800260-612x612.jpg'],
    after: ['/WhatsApp%20Image%202026-02-14%20at%2021.45.33.jpeg'],
    description: 'Transformed an unused basement into a modern entertainment space with custom lighting and built-in shelving.',
  },
  {
    id: '2',
    category: 'kitchen',
    title: 'Contemporary Kitchen Renovation',
    before: [
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop',
    ],
    after: [
      'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&h=600&fit=crop',
    ],
    description: 'Complete kitchen overhaul with new cabinets, quartz countertops, and modern appliances.',
  },
  {
    id: '3',
    category: 'bathroom',
    title: 'Luxury Spa Bathroom',
    before: [
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop',
    ],
    after: [
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800&h=600&fit=crop',
    ],
    description: 'Converted outdated bathroom into a luxurious spa retreat with walk-in shower and custom vanity.',
  },
  {
    id: '4',
    category: 'living-room',
    title: 'Open Concept Living Room',
    before: [
      'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=600&fit=crop',
    ],
    after: [
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&h=600&fit=crop',
    ],
    description: 'Opened up the living space by removing walls and adding modern hardwood flooring.',
  },
  {
    id: '5',
    category: 'kitchen',
    title: 'Farmhouse Kitchen Remodel',
    before: [
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop',
    ],
    after: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop',
    ],
    description: 'Classic farmhouse kitchen with shaker cabinets, butcher block island, and subway tile backsplash.',
  },
  {
    id: '6',
    category: 'basement',
    title: 'Basement Home Office',
    before: [
      'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop',
    ],
    after: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop',
    ],
    description: 'Created a productive home office space with custom built-ins and professional lighting.',
  },
  {
    id: '7',
    category: 'bathroom',
    title: 'Master Bathroom Suite',
    before: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop',
    ],
    after: [
      'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop',
    ],
    description: 'Luxurious master bathroom with dual vanities, soaking tub, and marble tile.',
  },
  {
    id: '8',
    category: 'living-room',
    title: 'Modern Living Space',
    before: [
      'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop',
    ],
    after: [
      'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop',
    ],
    description: 'Contemporary living room with statement fireplace and custom entertainment center.',
  },
]

const categories: { id: 'all' | ProjectCategory; label: string }[] = [
  { id: 'all', label: 'All Projects' },
  { id: 'basement', label: 'Basement' },
  { id: 'bathroom', label: 'Bathroom' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'living-room', label: 'Living Room' },
]

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState<'all' | ProjectCategory>('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>(staticProjects)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const { data: projectsData } = await supabase
          .from('projects')
          .select('id, title, category, description, sort_order')
          .order('sort_order', { ascending: true })
        if (cancelled || !projectsData?.length) return
        const { data: imagesData } = await supabase
          .from('project_images')
          .select('project_id, url, label, sort_order')
          .order('sort_order', { ascending: true })
        const images = (imagesData ?? []) as { project_id: string; url: string; label: 'before' | 'after'; sort_order: number }[]
        const merged: Project[] = projectsData.map((p: { id: string; title: string; category: string; description: string }) => {
          const before = images.filter((i) => i.project_id === p.id && i.label === 'before').sort((a, b) => a.sort_order - b.sort_order).map((i) => i.url)
          const after = images.filter((i) => i.project_id === p.id && i.label === 'after').sort((a, b) => a.sort_order - b.sort_order).map((i) => i.url)
          return {
            id: p.id,
            category: p.category as ProjectCategory,
            title: p.title,
            description: p.description ?? '',
            before,
            after,
          }
        })
        setProjects(merged)
      } catch {
        // Keep static projects if Supabase unavailable
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === activeCategory)

  const filterBtn = 'py-1.5 px-3 sm:py-2 sm:px-4 text-xs sm:text-sm font-[inherit] border border-rule bg-transparent text-ink cursor-pointer hover:bg-ink hover:text-white hover:border-ink'
  const ctaBtn = 'inline-block py-2 px-4 text-sm no-underline border border-ink font-[inherit]'

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null)
    }
    if (selectedProject) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [selectedProject])

  return (
    <div className="min-h-screen bg-paper">
      <header className="py-8 sm:py-12 px-4 sm:px-6 text-center border-b border-rule-light">
        <div className="max-w-content mx-auto">
          <h1 className="text-[clamp(1.5rem,4vw,2.25rem)] mb-2">Before & After Gallery</h1>
          <p className="text-[0.95rem] text-ink-light">
            Explore our portfolio of stunning home transformations. See how we turn ordinary spaces into extraordinary living environments.
          </p>
        </div>
      </header>

      <div className="sticky top-0 z-40 bg-paper border-b border-rule-light">
        <div className="max-w-content mx-auto py-3 sm:py-4 px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`${filterBtn} ${activeCategory === cat.id ? '!bg-ink !text-white border-ink' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto py-6 sm:py-8 px-4 sm:px-6">
        <div className="grid gap-8 grid-cols-1">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="bg-paper border border-rule cursor-pointer hover:border-ink-light"
              onClick={() => setSelectedProject(project)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative grid grid-cols-1 md:grid-cols-2 border-b border-rule">
                <img
                  src={project.before[0]}
                  alt={`${project.title} - Before`}
                  className="w-full h-auto block md:border-r border-rule"
                />
                <img
                  src={project.after[0]}
                  alt={`${project.title} - After`}
                  className="w-full h-auto block"
                />
                <span className="absolute left-2 top-2 py-1.5 px-2 text-[0.7rem] uppercase tracking-wider bg-paper border border-rule">
                  BEFORE
                </span>
                <span className="absolute right-2 top-2 py-1.5 px-2 text-[0.7rem] uppercase tracking-wider bg-paper border border-rule md:right-2">
                  AFTER
                </span>
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="text-paper font-serif">Click to Compare</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-[1.1rem] mb-2">{project.title}</h3>
                <p className="text-sm text-ink-light leading-relaxed">{project.description}</p>
                <span className="inline-block text-xs text-ink-light mt-2">{project.category.replace('-', ' ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProject && (
        <div
          className="fixed inset-0 z-[1100] flex items-center justify-center p-4 sm:p-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setSelectedProject(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
        >
          <div
            className="max-w-content w-full max-h-[90vh] bg-paper relative flex flex-col rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-y-auto flex-1 min-h-0">
              {/* Extra top padding so close button clears nav bar; close aligned to content grid */}
              <div className="relative pt-14 sm:pt-6 px-6 sm:px-8">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-14 right-6 sm:top-6 sm:right-8 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-ink/70 hover:text-ink hover:bg-ink/5 focus:outline-none focus:ring-2 focus:ring-ink/30 focus:ring-offset-2 cursor-pointer transition-colors"
                  aria-label="Close (Escape)"
                >
                  <X size={24} strokeWidth={1.75} />
                </button>
                <h2 id="project-modal-title" className="text-xl sm:text-2xl font-bold text-ink pr-14 leading-tight">
                  {selectedProject.title}
                </h2>
                <p className="mt-4 text-[0.95rem] text-ink-light leading-relaxed max-w-[42rem]">
                  {selectedProject.description}
                </p>
              </div>

              {/* 1px low-contrast divider aligned to content padding */}
              <div className="mx-6 sm:mx-8 mt-6 border-t border-rule-light" />

              {/* Photo series: Before section then After section */}
              <div className="px-6 sm:px-8 pt-6 pb-8 space-y-8">
                <section>
                  <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-ink-light mb-3">
                    BEFORE
                  </p>
                  <div className="space-y-4">
                    {selectedProject.before.map((src, i) => (
                      <div key={`before-${i}`} className="rounded-lg overflow-hidden border border-rule-light">
                        <img
                          src={src}
                          alt={`Before ${i + 1}`}
                          className="w-full aspect-[4/3] object-cover block"
                          draggable={false}
                        />
                      </div>
                    ))}
                  </div>
                </section>
                <section>
                  <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-ink-light mb-3">
                    AFTER
                  </p>
                  <div className="space-y-4">
                    {selectedProject.after.map((src, i) => (
                      <div key={`after-${i}`} className="rounded-lg overflow-hidden border border-rule-light">
                        <img
                          src={src}
                          alt={`After ${i + 1}`}
                          className="w-full aspect-[4/3] object-cover block"
                          draggable={false}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="py-8 sm:py-12 px-4 sm:px-6 text-center border-t border-rule">
        <div className="max-w-content mx-auto">
          <h2 className="text-xl mb-2">Ready to Transform Your Home?</h2>
          <p className="text-[0.95rem] text-ink-light mb-6">
            Let&apos;s create your perfect before and after story. Get a free consultation today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className={`${ctaBtn} bg-ink text-paper hover:bg-ink-light hover:border-ink-light`}>
              Get Free Estimate
            </Link>
            <a href="tel:+1234567890" className={`${ctaBtn} bg-transparent text-ink hover:bg-ink hover:text-white`}>
              Call (123) 456-7890
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
