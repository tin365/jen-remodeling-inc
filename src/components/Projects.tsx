'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

type ProjectCategory = 'basement' | 'kitchen' | 'bathroom' | 'living-room'

interface Project {
  id: number
  category: ProjectCategory
  title: string
  before: string
  after: string
  description: string
}

const projects: Project[] = [
  {
    id: 1,
    category: 'basement',
    title: 'Modern Basement Entertainment Room',
    before: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&h=600&fit=crop',
    after: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop',
    description: 'Transformed an unused basement into a modern entertainment space with custom lighting and built-in shelving.',
  },
  {
    id: 2,
    category: 'kitchen',
    title: 'Contemporary Kitchen Renovation',
    before: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop',
    after: 'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=800&h=600&fit=crop',
    description: 'Complete kitchen overhaul with new cabinets, quartz countertops, and modern appliances.',
  },
  {
    id: 3,
    category: 'bathroom',
    title: 'Luxury Spa Bathroom',
    before: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop',
    after: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop',
    description: 'Converted outdated bathroom into a luxurious spa retreat with walk-in shower and custom vanity.',
  },
  {
    id: 4,
    category: 'living-room',
    title: 'Open Concept Living Room',
    before: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=600&fit=crop',
    after: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop',
    description: 'Opened up the living space by removing walls and adding modern hardwood flooring.',
  },
  {
    id: 5,
    category: 'kitchen',
    title: 'Farmhouse Kitchen Remodel',
    before: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop',
    after: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
    description: 'Classic farmhouse kitchen with shaker cabinets, butcher block island, and subway tile backsplash.',
  },
  {
    id: 6,
    category: 'basement',
    title: 'Basement Home Office',
    before: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&h=600&fit=crop',
    after: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop',
    description: 'Created a productive home office space with custom built-ins and professional lighting.',
  },
  {
    id: 7,
    category: 'bathroom',
    title: 'Master Bathroom Suite',
    before: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop',
    after: 'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800&h=600&fit=crop',
    description: 'Luxurious master bathroom with dual vanities, soaking tub, and marble tile.',
  },
  {
    id: 8,
    category: 'living-room',
    title: 'Modern Living Space',
    before: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=600&fit=crop',
    after: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&h=600&fit=crop',
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

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === activeCategory)

  const filterBtn = 'py-1.5 px-3 sm:py-2 sm:px-4 text-xs sm:text-sm font-[inherit] border border-rule bg-transparent text-ink cursor-pointer hover:bg-ink hover:text-white hover:border-ink'
  const ctaBtn = 'inline-block py-2 px-4 text-sm no-underline border border-ink font-[inherit]'

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
                  src={project.before}
                  alt={`${project.title} - Before`}
                  className="w-full h-auto block md:border-r border-rule"
                />
                <img
                  src={project.after}
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
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-3 sm:p-6">
          <button
            onClick={() => setSelectedProject(null)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-paper bg-transparent border border-paper p-1.5 sm:p-2 cursor-pointer text-lg sm:text-xl hover:bg-paper hover:text-ink z-10"
          >
            <X size={24} className="sm:hidden" />
            <X size={32} className="hidden sm:block" />
          </button>
          <div className="max-w-content w-full bg-paper p-4 sm:p-8 border border-rule max-h-[90vh] overflow-y-auto">
            <div className="mb-6 pb-4 border-b border-rule">
              <h2 className="text-xl mb-2">{selectedProject.title}</h2>
              <p className="text-[0.95rem] text-ink-light">{selectedProject.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 border border-rule">
              <div>
                <img
                  src={selectedProject.before}
                  alt="Before"
                  className="w-full h-auto block"
                  draggable={false}
                />
                <div className="py-1.5 px-2 text-[0.7rem] uppercase bg-paper border border-rule">
                  BEFORE
                </div>
              </div>
              <div className="md:border-l border-rule">
                <img
                  src={selectedProject.after}
                  alt="After"
                  className="w-full h-auto block"
                  draggable={false}
                />
                <div className="py-1.5 px-2 text-[0.7rem] uppercase bg-paper border border-rule">
                  AFTER
                </div>
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
