'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useProjects } from '@/hooks/useProjects'
import type { Project, ProjectCategory } from '@/lib/types'
import ProjectsSkeleton from '@/components/ProjectsSkeleton'

const categories: { id: 'all' | ProjectCategory; label: string }[] = [
  { id: 'all', label: 'All Projects' },
  { id: 'basement', label: 'Basement' },
  { id: 'bathroom', label: 'Bathroom' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'living-room', label: 'Living Room' },
]

export default function Projects() {
  const { projects, loading, error } = useProjects()
  const [activeCategory, setActiveCategory] = useState<'all' | ProjectCategory>('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [expandedImage, setExpandedImage] = useState<{ url: string; alt: string } | null>(null)

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === activeCategory)

  const filterBtn = 'py-1.5 px-3 sm:py-2 sm:px-4 text-xs sm:text-sm font-[inherit] border border-rule bg-transparent text-ink cursor-pointer hover:bg-ink hover:text-white hover:border-ink'
  const ctaBtn = 'inline-block py-2 px-4 text-sm no-underline border border-ink font-[inherit]'

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (expandedImage) setExpandedImage(null)
        else setSelectedProject(null)
      }
    }
    if (selectedProject) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [selectedProject, expandedImage])

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
        {loading ? (
          <ProjectsSkeleton />
        ) : error ? (
          <div className="flex items-center justify-center py-16 text-ink-light">
            <p className="text-sm">Unable to load projects. Please try again later.</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-ink-light">
            <p className="text-sm">No projects to display.</p>
          </div>
        ) : (
        <div className="grid gap-8 grid-cols-1">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="bg-paper border border-rule cursor-pointer hover:border-ink-light"
              onClick={() => setSelectedProject(project)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative grid grid-cols-1 md:grid-cols-2 border-b border-rule">
                <div className="relative w-full aspect-[4/3] bg-rule-light/10 overflow-hidden md:border-r border-rule flex items-center justify-center">
                  {project.before[0] ? (
                    <Image
                      src={project.before[0]}
                      alt={`${project.title} - Before`}
                      fill
                      className="object-cover block"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <span className="text-ink-light text-sm">No before image</span>
                  )}
                </div>
                <div className="relative w-full aspect-[4/3] bg-rule-light/10 overflow-hidden flex items-center justify-center">
                  {project.after[0] ? (
                    <Image
                      src={project.after[0]}
                      alt={`${project.title} - After`}
                      fill
                      className="object-cover block"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <span className="text-ink-light text-sm">No after image</span>
                  )}
                </div>
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
        )}
      </div>

      {selectedProject && (
        <div
          className="fixed inset-0 z-[1100] flex items-center justify-center p-4 sm:p-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => { setExpandedImage(null); setSelectedProject(null) }}
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
                  onClick={() => { setExpandedImage(null); setSelectedProject(null) }}
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
                    {selectedProject.before.length === 0 ? (
                      <p className="text-sm text-ink-light py-4">No before images for this project.</p>
                    ) : (
                      selectedProject.before.map((src, i) => (
                        <button
                          key={`before-${i}`}
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setExpandedImage({ url: src, alt: `Before ${i + 1}` }) }}
                          className="rounded-lg overflow-hidden border border-rule-light w-full bg-rule-light/10 block text-left cursor-pointer hover:border-ink-light transition-colors focus:outline-none focus:ring-2 focus:ring-ink/30 focus:ring-offset-2"
                        >
                          <Image
                            src={src}
                            alt={`Before ${i + 1}`}
                            width={800}
                            height={600}
                            className="w-full h-auto block pointer-events-none"
                            draggable={false}
                            sizes="(max-width: 768px) 100vw, 42rem"
                          />
                        </button>
                      ))
                    )}
                  </div>
                </section>
                <section>
                  <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-ink-light mb-3">
                    AFTER
                  </p>
                  <div className="space-y-4">
                    {selectedProject.after.length === 0 ? (
                      <p className="text-sm text-ink-light py-4">No after images for this project.</p>
                    ) : (
                      selectedProject.after.map((src, i) => (
                        <button
                          key={`after-${i}`}
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setExpandedImage({ url: src, alt: `After ${i + 1}` }) }}
                          className="rounded-lg overflow-hidden border border-rule-light w-full bg-rule-light/10 block text-left cursor-pointer hover:border-ink-light transition-colors focus:outline-none focus:ring-2 focus:ring-ink/30 focus:ring-offset-2"
                        >
                          <Image
                            src={src}
                            alt={`After ${i + 1}`}
                            width={800}
                            height={600}
                            className="w-full h-auto block pointer-events-none"
                            draggable={false}
                            sizes="(max-width: 768px) 100vw, 42rem"
                          />
                        </button>
                      ))
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* Full-size image overlay: show at actual pixel dimensions (scroll if larger than viewport) */}
          {expandedImage && (
            <div
              className="fixed inset-0 z-[1200] bg-black/90 overflow-auto"
              onClick={() => setExpandedImage(null)}
              role="dialog"
              aria-modal="true"
              aria-label="View image full size"
            >
              <button
                type="button"
                onClick={() => setExpandedImage(null)}
                className="fixed top-4 right-4 z-[1201] w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Close"
              >
                <X size={24} strokeWidth={2} />
              </button>
              <div className="inline-block p-4 align-top" onClick={(e) => e.stopPropagation()}>
                <Image
                  src={expandedImage.url}
                  alt={expandedImage.alt}
                  width={1920}
                  height={1080}
                  unoptimized
                  className="block"
                  style={{
                    width: 'auto',
                    height: 'auto',
                    maxWidth: 'none',
                    maxHeight: 'none',
                    minWidth: 'auto',
                    minHeight: 'auto',
                    objectFit: 'none',
                  }}
                  draggable={false}
                />
              </div>
            </div>
          )}
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
