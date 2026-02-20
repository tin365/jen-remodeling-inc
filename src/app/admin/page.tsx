'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getAdminSession, signInAdmin, signOutAdmin } from '@/lib/admin-auth'
import { supabase } from '@/lib/supabase'

type ContactRow = {
  id: string
  name: string
  email: string
  phone: string
  preferred_contact: string
  service: string
  project_type: string | null
  budget: string | null
  timeline: string | null
  message: string
  created_at: string
}

type ReviewRow = {
  id: string
  name: string
  service: string
  rating: number
  text: string
  helpful: number
  created_at: string
}

type ProjectRow = {
  id: string
  title: string
  category: string
  description: string
  sort_order: number
  created_at: string
}

type ProjectImageRow = {
  id: string
  project_id: string
  url: string
  label: 'before' | 'after'
  sort_order: number
}

const generateStars = (rating: number) =>
  Array.from({ length: 5 }, (_, i) => (i < rating ? '★' : '☆')).join('')

export default function AdminPage() {
  const [session, setSession] = useState<{ user: { email?: string } } | null>(null)
  const [loading, setLoading] = useState(true)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginSubmitting, setLoginSubmitting] = useState(false)
  const [contacts, setContacts] = useState<ContactRow[]>([])
  const [reviews, setReviews] = useState<ReviewRow[]>([])
  const [contactsLoading, setContactsLoading] = useState(false)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'contacts' | 'reviews' | 'projects'>('contacts')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedContact, setExpandedContact] = useState<string | null>(null)

  const [projects, setProjects] = useState<ProjectRow[]>([])
  const [projectImages, setProjectImages] = useState<ProjectImageRow[]>([])
  const [projectsLoading, setProjectsLoading] = useState(false)
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  type ProjectFormState = { title: string; category: 'basement' | 'kitchen' | 'bathroom' | 'living-room'; description: string }
  const [projectForm, setProjectForm] = useState<ProjectFormState>({ title: '', category: 'basement', description: '' })
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newImageLabel, setNewImageLabel] = useState<'before' | 'after'>('before')
  const [savingProject, setSavingProject] = useState(false)
  const [addingImage, setAddingImage] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadTargetProjectId, setUploadTargetProjectId] = useState<string | null>(null)
  const uploadInputRef = React.useRef<HTMLInputElement>(null)

  const loadSession = useCallback(async () => {
    const s = await getAdminSession()
    setSession(s ? { user: s.user } : null)
  }, [])

  useEffect(() => {
    loadSession().finally(() => setLoading(false))
  }, [loadSession])

  const loadContacts = useCallback(async () => {
    setContactsLoading(true)
    const { data } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
    setContacts((data ?? []) as ContactRow[])
    setContactsLoading(false)
  }, [])

  const loadReviews = useCallback(async () => {
    setReviewsLoading(true)
    const { data } = await supabase
      .from('reviews')
      .select('id, name, service, rating, "text", helpful, created_at')
      .order('created_at', { ascending: false })
    setReviews((data ?? []) as ReviewRow[])
    setReviewsLoading(false)
  }, [])

  const loadProjects = useCallback(async () => {
    setProjectsLoading(true)
    const { data: projectsData } = await supabase
      .from('projects')
      .select('id, title, category, description, sort_order, created_at')
      .order('sort_order', { ascending: true })
    setProjects((projectsData ?? []) as ProjectRow[])
    const { data: imagesData } = await supabase
      .from('project_images')
      .select('id, project_id, url, label, sort_order')
      .order('sort_order', { ascending: true })
    setProjectImages((imagesData ?? []) as ProjectImageRow[])
    setProjectsLoading(false)
  }, [])

  useEffect(() => {
    if (!session) return
    loadContacts()
    loadReviews()
    loadProjects()
  }, [session, loadContacts, loadReviews, loadProjects])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoginSubmitting(true)
    const { error } = await signInAdmin(loginEmail.trim(), loginPassword)
    setLoginSubmitting(false)
    if (error) {
      setLoginError(error)
      return
    }
    await loadSession()
    setLoginPassword('')
  }

  const handleLogout = async () => {
    await signOutAdmin()
    setSession(null)
  }

  const deleteContact = async (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id)
      return
    }
    setDeletingId(id)
    setConfirmDeleteId(null)
    await supabase.from('contact_submissions').delete().eq('id', id)
    await loadContacts()
    setDeletingId(null)
  }

  const deleteReview = async (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id)
      return
    }
    setDeletingId(id)
    setConfirmDeleteId(null)
    await supabase.from('reviews').delete().eq('id', id)
    await loadReviews()
    setDeletingId(null)
  }

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectForm.title.trim()) return
    setSavingProject(true)
    const { data } = await supabase
      .from('projects')
      .insert({ title: projectForm.title.trim(), category: projectForm.category, description: projectForm.description.trim() })
      .select('id')
      .single()
    if (data) {
      setProjectForm({ title: '', category: 'basement', description: '' })
      setEditingProjectId(data.id)
      await loadProjects()
    }
    setSavingProject(false)
  }

  const updateProject = async (id: string, updates: { title?: string; category?: string; description?: string }) => {
    setSavingProject(true)
    await supabase.from('projects').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id)
    await loadProjects()
    setSavingProject(false)
  }

  const deleteProject = async (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id)
      return
    }
    setConfirmDeleteId(null)
    setDeletingId(id)
    await supabase.from('project_images').delete().eq('project_id', id)
    await supabase.from('projects').delete().eq('id', id)
    await loadProjects()
    if (editingProjectId === id) setEditingProjectId(null)
    setDeletingId(null)
  }

  const addProjectImage = async (projectId: string) => {
    if (!newImageUrl.trim()) return
    setAddingImage(true)
    const maxOrder = Math.max(0, ...projectImages.filter((i) => i.project_id === projectId && i.label === newImageLabel).map((i) => i.sort_order))
    await supabase.from('project_images').insert({ project_id: projectId, url: newImageUrl.trim(), label: newImageLabel, sort_order: maxOrder + 1 })
    setNewImageUrl('')
    await loadProjects()
    setAddingImage(false)
  }

  const deleteProjectImage = async (imageId: string) => {
    await supabase.from('project_images').delete().eq('id', imageId)
    await loadProjects()
  }

  const randomId = () => {
    const bytes = new Uint8Array(16)
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(bytes)
    } else {
      for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256)
    }
    bytes[6] = (bytes[6]! & 0x0f) | 0x40
    bytes[8] = (bytes[8]! & 0x3f) | 0x80
    const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
  }

  const uploadProjectImage = async (projectId: string, label: 'before' | 'after', file: File) => {
    setUploadError('')
    setUploadingImage(true)
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 80)
      const path = `${projectId}/${randomId()}-${safeName}`
      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(path, file, { cacheControl: '3600', upsert: false })
      if (uploadError) {
        setUploadError(uploadError.message)
        setUploadingImage(false)
        return
      }
      const { data: urlData } = supabase.storage.from('project-images').getPublicUrl(path)
      const publicUrl = urlData.publicUrl
      const maxOrder = Math.max(0, ...projectImages.filter((i) => i.project_id === projectId && i.label === label).map((i) => i.sort_order))
      await supabase.from('project_images').insert({ project_id: projectId, url: publicUrl, label, sort_order: maxOrder + 1 })
      await loadProjects()
      setUploadError('')
      if (uploadInputRef.current) uploadInputRef.current.value = ''
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed')
    }
    setUploadingImage(false)
  }

  const handleUploadInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const file = e.target.files?.[0]
    if (!file || !uploadTargetProjectId) return
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowed.includes(file.type)) {
      setUploadError('Please choose a JPEG, PNG, GIF, or WebP image.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be under 5 MB.')
      return
    }
    uploadProjectImage(uploadTargetProjectId, newImageLabel, file)
    setUploadTargetProjectId(null)
  }

  const formatDate = (s: string) => new Date(s).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  // ─── Loading state ───
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e6]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-300 border-t-amber-700 rounded-full animate-spin" />
          <span className="text-stone-600 text-sm">Loading...</span>
        </div>
      </div>
    )
  }

  // ─── Login ───
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#f5f0e6]">
        <div className="w-full max-w-sm border-2 border-amber-300 rounded-lg p-6 sm:p-8 bg-white/90 shadow-lg shadow-amber-900/10">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-amber-100 border border-amber-300 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">🔒</span>
            </div>
            <h1 className="text-xl font-bold text-stone-800">Admin sign in</h1>
            <p className="text-sm text-stone-600 mt-1">JEN Remodeling Inc</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="bg-red-50 border border-red-300 rounded p-3">
                <p className="text-sm text-red-800" role="alert">{loginError}</p>
              </div>
            )}
            <div>
              <label htmlFor="admin-email" className="block text-xs font-medium text-stone-600 mb-1.5">Email</label>
              <input
                id="admin-email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-3 py-2.5 rounded border border-amber-300 bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 text-sm"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-xs font-medium text-stone-600 mb-1.5">Password</label>
              <input
                id="admin-password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                autoComplete="current-password"
                minLength={8}
                className="w-full px-3 py-2.5 rounded border border-amber-300 bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 text-sm"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loginSubmitting}
              className="w-full py-2.5 px-4 bg-amber-800 text-amber-50 font-semibold rounded border border-amber-900 hover:bg-amber-900 disabled:opacity-50 transition-colors text-sm"
            >
              {loginSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <p className="mt-5 text-center border-t border-amber-200 pt-4">
            <Link href="/" className="text-xs text-stone-600 hover:text-stone-800 transition-colors">← Back to site</Link>
          </p>
        </div>
      </div>
    )
  }

  // ─── Dashboard ───
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f0e6]">
      {/* Hidden file input at root so it is never inside a form (prevents refresh on upload) */}
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleUploadInputChange}
        aria-hidden
      />
      {/* Header */}
      <header className="sticky top-0 z-50 border-b-2 border-amber-300 bg-amber-50/95 backdrop-blur-sm shadow-sm">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-5">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-stone-800">
              <span className="hidden sm:inline">JEN Admin</span>
              <span className="sm:hidden">Admin</span>
            </h1>
            {/* Desktop tabs */}
            <nav className="hidden sm:flex gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('contacts')}
                className={`px-3 py-1.5 rounded text-sm transition-colors border ${activeTab === 'contacts' ? 'bg-amber-800 text-amber-50 border-amber-900' : 'text-stone-600 border-amber-200 hover:bg-amber-100 hover:text-stone-800'}`}
              >
                Contacts{contacts.length > 0 && ` (${contacts.length})`}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`px-3 py-1.5 rounded text-sm transition-colors border ${activeTab === 'reviews' ? 'bg-amber-800 text-amber-50 border-amber-900' : 'text-stone-600 border-amber-200 hover:bg-amber-100 hover:text-stone-800'}`}
              >
                Reviews{reviews.length > 0 && ` (${reviews.length})`}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('projects')}
                className={`px-3 py-1.5 rounded text-sm transition-colors border ${activeTab === 'projects' ? 'bg-amber-800 text-amber-50 border-amber-900' : 'text-stone-600 border-amber-200 hover:bg-amber-100 hover:text-stone-800'}`}
              >
                Projects{projects.length > 0 && ` (${projects.length})`}
              </button>
            </nav>
          </div>
          {/* Desktop right */}
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-xs text-stone-500 max-w-[180px] truncate">{session.user.email}</span>
            <Link href="/" className="text-xs text-stone-600 hover:text-stone-800 transition-colors">View site</Link>
            <button type="button" onClick={handleLogout} className="text-xs text-stone-600 hover:text-stone-800 transition-colors">
              Sign out
            </button>
          </div>
          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-stone-600 hover:text-stone-800"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-amber-300 px-4 py-3 space-y-2 bg-amber-50">
            <button
              type="button"
              onClick={() => { setActiveTab('contacts'); setMobileMenuOpen(false) }}
              className={`block w-full text-left px-3 py-2 rounded text-sm border ${activeTab === 'contacts' ? 'bg-amber-200 text-stone-800 border-amber-400' : 'text-stone-600 border-transparent'}`}
            >
              Contacts{contacts.length > 0 && ` (${contacts.length})`}
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('reviews'); setMobileMenuOpen(false) }}
              className={`block w-full text-left px-3 py-2 rounded text-sm border ${activeTab === 'reviews' ? 'bg-amber-200 text-stone-800 border-amber-400' : 'text-stone-600 border-transparent'}`}
            >
              Reviews{reviews.length > 0 && ` (${reviews.length})`}
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('projects'); setMobileMenuOpen(false) }}
              className={`block w-full text-left px-3 py-2 rounded text-sm border ${activeTab === 'projects' ? 'bg-amber-200 text-stone-800 border-amber-400' : 'text-stone-600 border-transparent'}`}
            >
              Projects{projects.length > 0 && ` (${projects.length})`}
            </button>
            <div className="border-t border-amber-200 pt-2 mt-2 space-y-1">
              <p className="px-3 text-xs text-stone-500 truncate">{session.user.email}</p>
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-sm text-stone-600 hover:text-stone-800">View site</Link>
              <button type="button" onClick={handleLogout} className="block w-full text-left px-3 py-1.5 text-sm text-stone-600 hover:text-stone-800">Sign out</button>
            </div>
          </div>
        )}
        {/* Mobile tab bar */}
        <div className="sm:hidden flex border-t border-amber-300">
          <button
            type="button"
            onClick={() => setActiveTab('contacts')}
            className={`flex-1 py-2.5 text-xs text-center transition-colors ${activeTab === 'contacts' ? 'text-stone-800 border-b-2 border-amber-700 font-semibold' : 'text-stone-500'}`}
          >
            Contacts{contacts.length > 0 && ` (${contacts.length})`}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-2.5 text-xs text-center transition-colors ${activeTab === 'reviews' ? 'text-stone-800 border-b-2 border-amber-700 font-semibold' : 'text-stone-500'}`}
          >
            Reviews{reviews.length > 0 && ` (${reviews.length})`}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`flex-1 py-2.5 text-xs text-center transition-colors ${activeTab === 'projects' ? 'text-stone-800 border-b-2 border-amber-700 font-semibold' : 'text-stone-500'}`}
          >
            Projects
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-6 max-w-5xl w-full mx-auto">
        {/* ─── Contacts tab ─── */}
        {activeTab === 'contacts' && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-stone-800">Contact submissions</h2>
              <button
                type="button"
                onClick={loadContacts}
                className="text-xs text-stone-600 hover:text-stone-800 transition-colors px-2 py-1 rounded border border-amber-300 hover:bg-amber-100"
              >
                Refresh
              </button>
            </div>
            {contactsLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-6 h-6 border-2 border-amber-300 border-t-amber-700 rounded-full animate-spin" />
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-amber-300 rounded-lg bg-white/60">
                <p className="text-stone-500">No submissions yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.map((c) => {
                  const isExpanded = expandedContact === c.id
                  return (
                    <div
                      key={c.id}
                      className="border-2 border-amber-200 rounded-lg bg-white/80 hover:bg-white shadow-sm overflow-hidden"
                    >
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => setExpandedContact(isExpanded ? null : c.id)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-sm sm:text-base text-stone-800">{c.name}</p>
                              <span className="inline-block px-2 py-0.5 bg-amber-100 border border-amber-300 rounded text-[10px] text-stone-700">{c.service}</span>
                            </div>
                            <p className="text-xs text-stone-500 mt-1">{formatDate(c.created_at)}</p>
                          </div>
                          <svg className={`w-4 h-4 text-stone-500 transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-amber-200 pt-3 space-y-2 bg-amber-50/50">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-stone-500 text-xs block">Email</span>
                              <a href={`mailto:${c.email}`} className="text-stone-800 hover:text-amber-900 break-all">{c.email}</a>
                            </div>
                            <div>
                              <span className="text-stone-500 text-xs block">Phone</span>
                              <a href={`tel:${c.phone}`} className="text-stone-800 hover:text-amber-900">{c.phone}</a>
                            </div>
                            <div>
                              <span className="text-stone-500 text-xs block">Contact preference</span>
                              <p className="text-stone-700">{c.preferred_contact}</p>
                            </div>
                            {c.project_type && (
                              <div>
                                <span className="text-stone-500 text-xs block">Property type</span>
                                <p className="text-stone-700">{c.project_type}</p>
                              </div>
                            )}
                            {c.budget && (
                              <div>
                                <span className="text-stone-500 text-xs block">Budget</span>
                                <p className="text-stone-700">{c.budget}</p>
                              </div>
                            )}
                            {c.timeline && (
                              <div>
                                <span className="text-stone-500 text-xs block">Timeline</span>
                                <p className="text-stone-700">{c.timeline}</p>
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="text-stone-500 text-xs block">Message</span>
                            <p className="text-sm text-stone-700 mt-1 leading-relaxed whitespace-pre-wrap">{c.message}</p>
                          </div>
                          <div className="flex justify-end pt-2 border-t border-amber-200 mt-2">
                            {confirmDeleteId === c.id ? (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-stone-500">Are you sure?</span>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); deleteContact(c.id) }}
                                  disabled={deletingId === c.id}
                                  className="text-[11px] text-red-700 hover:text-red-800 disabled:opacity-50 px-2 py-0.5 rounded border border-red-300 bg-red-50 hover:bg-red-100"
                                >
                                  {deletingId === c.id ? '...' : 'Yes, delete'}
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null) }}
                                  className="text-[11px] text-stone-600 hover:text-stone-800 px-2 py-0.5 rounded border border-amber-300 hover:bg-amber-100 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); deleteContact(c.id) }}
                                className="text-[11px] text-stone-600 hover:text-red-800 px-2 py-0.5 rounded border border-amber-300 hover:bg-red-50 hover:border-red-300 transition-colors"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {/* ─── Reviews tab ─── */}
        {activeTab === 'reviews' && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-stone-800">Reviews</h2>
              <button
                type="button"
                onClick={loadReviews}
                className="text-xs text-stone-600 hover:text-stone-800 transition-colors px-2 py-1 rounded border border-amber-300 hover:bg-amber-100"
              >
                Refresh
              </button>
            </div>
            {reviewsLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-6 h-6 border-2 border-amber-300 border-t-amber-700 rounded-full animate-spin" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-amber-300 rounded-lg bg-white/60">
                <p className="text-stone-500">No reviews yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="border-2 border-amber-200 rounded-lg p-4 bg-white/80 hover:bg-white shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="font-semibold text-sm sm:text-base text-stone-800">{r.name}</p>
                          <span className="inline-block px-2 py-0.5 bg-amber-100 border border-amber-300 rounded text-[10px] text-stone-700">{r.service}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-amber-600 text-sm tracking-wider">{generateStars(r.rating)}</span>
                          <span className="text-xs text-stone-500">{r.rating}/5</span>
                        </div>
                        <p className="text-sm text-stone-700 leading-relaxed">{r.text}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className="text-xs text-stone-500">{formatDate(r.created_at)}</span>
                          {r.helpful > 0 && <span className="text-xs text-stone-500">👍 {r.helpful} helpful</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-2 pt-2 border-t border-amber-200">
                      {confirmDeleteId === r.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-stone-500">Are you sure?</span>
                          <button
                            type="button"
                            onClick={() => deleteReview(r.id)}
                            disabled={deletingId === r.id}
                            className="text-[11px] text-red-700 hover:text-red-800 disabled:opacity-50 px-2 py-0.5 rounded border border-red-300 bg-red-50 hover:bg-red-100"
                          >
                            {deletingId === r.id ? '...' : 'Yes, delete'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-[11px] text-stone-600 hover:text-stone-800 px-2 py-0.5 rounded border border-amber-300 hover:bg-amber-100"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => deleteReview(r.id)}
                          className="text-[11px] text-stone-600 hover:text-red-700 px-2 py-0.5 rounded border border-amber-200 hover:border-red-300 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ─── Projects tab ─── */}
        {activeTab === 'projects' && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-stone-800">Projects (portfolio)</h2>
              <button
                type="button"
                onClick={loadProjects}
                className="text-xs text-stone-600 hover:text-stone-800 transition-colors px-2 py-1 rounded border border-amber-300 hover:bg-amber-100"
              >
                Refresh
              </button>
            </div>

            {/* Add project form */}
            <form onSubmit={createProject} className="mb-6 p-4 rounded-lg border-2 border-amber-200 bg-white/80 shadow-sm space-y-3">
              <h3 className="text-sm font-semibold text-stone-800">Add project</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Project title"
                  className="px-3 py-2 rounded border border-amber-300 bg-white text-stone-800 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <select
                  value={projectForm.category}
                  onChange={(e) => setProjectForm((f) => ({ ...f, category: e.target.value as ProjectFormState['category'] }))}
                  className="px-3 py-2 rounded border border-amber-300 bg-white text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="basement">Basement</option>
                  <option value="kitchen">Kitchen</option>
                  <option value="bathroom">Bathroom</option>
                  <option value="living-room">Living Room</option>
                </select>
                <button type="submit" disabled={savingProject || !projectForm.title.trim()} className="px-3 py-2 rounded border border-amber-700 bg-amber-800 text-amber-50 text-sm font-medium hover:bg-amber-900 disabled:opacity-50">
                  {savingProject ? 'Saving...' : 'Add project'}
                </button>
              </div>
              <textarea
                value={projectForm.description}
                onChange={(e) => setProjectForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Description (optional)"
                rows={2}
                className="w-full px-3 py-2 rounded border border-amber-300 bg-white text-stone-800 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-y"
              />
            </form>

            {projectsLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-6 h-6 border-2 border-amber-300 border-t-amber-700 rounded-full animate-spin" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-amber-300 rounded-lg bg-white/60">
                <p className="text-stone-500">No projects yet. Add one above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((proj) => {
                  const images = projectImages.filter((i) => i.project_id === proj.id)
                  const beforeImages = images.filter((i) => i.label === 'before').sort((a, b) => a.sort_order - b.sort_order)
                  const afterImages = images.filter((i) => i.label === 'after').sort((a, b) => a.sort_order - b.sort_order)
                  const isEditing = editingProjectId === proj.id
                  return (
                    <div key={proj.id} className="border-2 border-amber-200 rounded-lg bg-white/80 overflow-hidden shadow-sm">
                      <div className="p-4 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-stone-800">{proj.title}</p>
                          <p className="text-xs text-stone-500 mt-0.5">{proj.category} · {beforeImages.length} before, {afterImages.length} after</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setEditingProjectId(isEditing ? null : proj.id)}
                            className="text-xs text-stone-600 hover:text-stone-800 px-2 py-1 rounded border border-amber-300 hover:bg-amber-100"
                          >
                            {isEditing ? 'Close' : 'Edit'}
                          </button>
                          {confirmDeleteId === proj.id ? (
                            <>
                              <span className="text-xs text-stone-500">Delete?</span>
                              <button type="button" onClick={() => deleteProject(proj.id)} disabled={deletingId === proj.id} className="text-xs text-red-700 px-2 py-1 rounded border border-red-300 bg-red-50">Yes</button>
                              <button type="button" onClick={() => setConfirmDeleteId(null)} className="text-xs text-stone-600 px-2 py-1 rounded border border-amber-300">No</button>
                            </>
                          ) : (
                            <button type="button" onClick={() => setConfirmDeleteId(proj.id)} className="text-xs text-stone-600 hover:text-red-700 px-2 py-1 rounded border border-amber-200 hover:border-red-300 hover:bg-red-50">Delete</button>
                          )}
                        </div>
                      </div>
                      {isEditing && (
                        <div className="px-4 pb-4 pt-0 border-t-2 border-amber-200 space-y-4 bg-amber-50/50">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                            <div>
                              <label className="block text-xs text-stone-500 mb-1">Title</label>
                              <input
                                type="text"
                                defaultValue={proj.title}
                                onBlur={(e) => { const v = e.target.value.trim(); if (v && v !== proj.title) updateProject(proj.id, { title: v }) }}
                                className="w-full px-3 py-2 rounded border border-amber-300 bg-white text-stone-800 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-stone-500 mb-1">Category</label>
                              <select
                                defaultValue={proj.category}
                                onChange={(e) => updateProject(proj.id, { category: e.target.value })}
                                className="w-full px-3 py-2 rounded border border-amber-300 bg-white text-stone-800 text-sm"
                              >
                                <option value="basement">Basement</option>
                                <option value="kitchen">Kitchen</option>
                                <option value="bathroom">Bathroom</option>
                                <option value="living-room">Living Room</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-stone-500 mb-1">Description</label>
                            <textarea
                              defaultValue={proj.description}
                              onBlur={(e) => { const v = e.target.value; if (v !== proj.description) updateProject(proj.id, { description: v }) }}
                              rows={2}
                              className="w-full px-3 py-2 rounded border border-amber-300 bg-white text-stone-800 text-sm resize-y"
                            />
                          </div>
                          {/* Add image: URL or upload from device (file input is at dashboard root) */}
                          {uploadError && (
                            <p className="text-xs text-red-700 mb-2" role="alert">{uploadError}</p>
                          )}
                          <div className="flex flex-wrap items-end gap-2 p-3 rounded-lg bg-white/80 border border-amber-200">
                            <div className="flex-1 min-w-[200px]">
                              <label className="block text-xs text-stone-500 mb-1">Add image (URL)</label>
                              <input
                                type="url"
                                value={newImageUrl}
                                onChange={(e) => { setNewImageUrl(e.target.value); setUploadError('') }}
                                placeholder="https://... or /image.jpg"
                                className="w-full px-3 py-2 rounded border border-amber-300 bg-white text-stone-800 placeholder-stone-400 text-sm"
                              />
                            </div>
                            <div className="flex rounded border border-amber-300 overflow-hidden" role="group" aria-label="Image type">
                              <button
                                type="button"
                                onClick={() => setNewImageLabel('before')}
                                className={`px-3 py-2 text-sm border-r border-amber-300 transition-colors ${newImageLabel === 'before' ? 'bg-amber-800 text-amber-50' : 'bg-white text-stone-700 hover:bg-amber-50'}`}
                              >
                                Before
                              </button>
                              <button
                                type="button"
                                onClick={() => setNewImageLabel('after')}
                                className={`px-3 py-2 text-sm transition-colors ${newImageLabel === 'after' ? 'bg-amber-800 text-amber-50' : 'bg-white text-stone-700 hover:bg-amber-50'}`}
                              >
                                After
                              </button>
                            </div>
                            <button type="button" onClick={() => addProjectImage(proj.id)} disabled={addingImage || !newImageUrl.trim()} className="px-3 py-2 rounded border border-amber-700 bg-amber-800 text-amber-50 text-sm hover:bg-amber-900 disabled:opacity-50">
                              {addingImage ? '...' : 'Add URL'}
                            </button>
                            <button
                              type="button"
                              onClick={() => { setUploadTargetProjectId(proj.id); setUploadError(''); uploadInputRef.current?.click() }}
                              disabled={uploadingImage}
                              className="px-3 py-2 rounded border border-amber-300 bg-amber-50 text-stone-800 text-sm hover:bg-amber-100 disabled:opacity-50"
                            >
                              {uploadingImage ? 'Uploading...' : 'Upload from device'}
                            </button>
                          </div>
                          {/* Before images */}
                          <div>
                            <p className="text-xs font-medium text-stone-600 mb-2">Before ({beforeImages.length})</p>
                            <div className="space-y-2">
                              {beforeImages.length === 0 && <p className="text-xs text-stone-500">No before images. Add a URL above.</p>}
                              {beforeImages.map((img) => (
                                <div key={img.id} className="flex items-center gap-2 p-2 rounded bg-amber-50 border border-amber-200">
                                  <img src={img.url} alt="" className="w-12 h-12 object-cover rounded" />
                                  <span className="flex-1 truncate text-xs text-stone-600">{img.url}</span>
                                  <button type="button" onClick={() => deleteProjectImage(img.id)} className="text-xs text-red-700 hover:text-red-800">Remove</button>
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* After images */}
                          <div>
                            <p className="text-xs font-medium text-stone-600 mb-2">After ({afterImages.length})</p>
                            <div className="space-y-2">
                              {afterImages.length === 0 && <p className="text-xs text-stone-500">No after images. Add a URL above.</p>}
                              {afterImages.map((img) => (
                                <div key={img.id} className="flex items-center gap-2 p-2 rounded bg-amber-50 border border-amber-200">
                                  <img src={img.url} alt="" className="w-12 h-12 object-cover rounded" />
                                  <span className="flex-1 truncate text-xs text-stone-600">{img.url}</span>
                                  <button type="button" onClick={() => deleteProjectImage(img.id)} className="text-xs text-red-700 hover:text-red-800">Remove</button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
