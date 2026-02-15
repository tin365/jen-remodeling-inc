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
  const [activeTab, setActiveTab] = useState<'contacts' | 'reviews'>('contacts')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedContact, setExpandedContact] = useState<string | null>(null)

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

  useEffect(() => {
    if (!session) return
    loadContacts()
    loadReviews()
  }, [session, loadContacts, loadReviews])

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

  const formatDate = (s: string) => new Date(s).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  // ─── Loading state ───
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span className="text-white/60 text-sm">Loading...</span>
        </div>
      </div>
    )
  }

  // ─── Login ───
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm border border-white/20 rounded-xl p-6 sm:p-8 bg-white/5 backdrop-blur-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">🔒</span>
            </div>
            <h1 className="text-xl font-bold">Admin sign in</h1>
            <p className="text-sm text-white/60 mt-1">JEN Remodeling Inc</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-sm text-red-400" role="alert">{loginError}</p>
              </div>
            )}
            <div>
              <label htmlFor="admin-email" className="block text-xs font-medium text-white/70 mb-1.5">Email</label>
              <input
                id="admin-email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-3 py-2.5 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent text-sm"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-xs font-medium text-white/70 mb-1.5">Password</label>
              <input
                id="admin-password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                autoComplete="current-password"
                minLength={8}
                className="w-full px-3 py-2.5 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent text-sm"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loginSubmitting}
              className="w-full py-2.5 px-4 bg-white text-[#1a1a1a] font-semibold rounded-lg hover:bg-white/90 disabled:opacity-50 transition-colors text-sm"
            >
              {loginSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <p className="mt-5 text-center border-t border-white/10 pt-4">
            <Link href="/" className="text-xs text-white/50 hover:text-white transition-colors">← Back to site</Link>
          </p>
        </div>
      </div>
    )
  }

  // ─── Dashboard ───
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#1a1a1a]/95 backdrop-blur-sm">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-5">
            <h1 className="text-base sm:text-lg font-bold tracking-tight">
              <span className="hidden sm:inline">JEN Admin</span>
              <span className="sm:hidden">Admin</span>
            </h1>
            {/* Desktop tabs */}
            <nav className="hidden sm:flex gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('contacts')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${activeTab === 'contacts' ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                Contacts{contacts.length > 0 && ` (${contacts.length})`}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${activeTab === 'reviews' ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                Reviews{reviews.length > 0 && ` (${reviews.length})`}
              </button>
            </nav>
          </div>
          {/* Desktop right */}
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-xs text-white/50 max-w-[180px] truncate">{session.user.email}</span>
            <Link href="/" className="text-xs text-white/60 hover:text-white transition-colors">View site</Link>
            <button type="button" onClick={handleLogout} className="text-xs text-white/60 hover:text-white transition-colors">
              Sign out
            </button>
          </div>
          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-white/70 hover:text-white"
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
          <div className="sm:hidden border-t border-white/10 px-4 py-3 space-y-2 bg-[#1a1a1a]">
            <button
              type="button"
              onClick={() => { setActiveTab('contacts'); setMobileMenuOpen(false) }}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${activeTab === 'contacts' ? 'bg-white/15 text-white' : 'text-white/60'}`}
            >
              Contacts{contacts.length > 0 && ` (${contacts.length})`}
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('reviews'); setMobileMenuOpen(false) }}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${activeTab === 'reviews' ? 'bg-white/15 text-white' : 'text-white/60'}`}
            >
              Reviews{reviews.length > 0 && ` (${reviews.length})`}
            </button>
            <div className="border-t border-white/10 pt-2 mt-2 space-y-1">
              <p className="px-3 text-xs text-white/40 truncate">{session.user.email}</p>
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-sm text-white/60 hover:text-white">View site</Link>
              <button type="button" onClick={handleLogout} className="block w-full text-left px-3 py-1.5 text-sm text-white/60 hover:text-white">Sign out</button>
            </div>
          </div>
        )}
        {/* Mobile tab bar */}
        <div className="sm:hidden flex border-t border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('contacts')}
            className={`flex-1 py-2.5 text-xs text-center transition-colors ${activeTab === 'contacts' ? 'text-white border-b-2 border-white' : 'text-white/50'}`}
          >
            Contacts{contacts.length > 0 && ` (${contacts.length})`}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-2.5 text-xs text-center transition-colors ${activeTab === 'reviews' ? 'text-white border-b-2 border-white' : 'text-white/50'}`}
          >
            Reviews{reviews.length > 0 && ` (${reviews.length})`}
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-6 max-w-5xl w-full mx-auto">
        {/* ─── Contacts tab ─── */}
        {activeTab === 'contacts' && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold">Contact submissions</h2>
              <button
                type="button"
                onClick={loadContacts}
                className="text-xs text-white/50 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
              >
                Refresh
              </button>
            </div>
            {contactsLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-white/20 rounded-xl">
                <p className="text-white/50">No submissions yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.map((c) => {
                  const isExpanded = expandedContact === c.id
                  return (
                    <div
                      key={c.id}
                      className="border border-white/10 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors overflow-hidden"
                    >
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => setExpandedContact(isExpanded ? null : c.id)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-sm sm:text-base">{c.name}</p>
                              <span className="inline-block px-2 py-0.5 bg-white/10 rounded-full text-[10px] text-white/70">{c.service}</span>
                            </div>
                            <p className="text-xs text-white/50 mt-1">{formatDate(c.created_at)}</p>
                          </div>
                          <svg className={`w-4 h-4 text-white/40 transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-white/10 pt-3 space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-white/40 text-xs block">Email</span>
                              <a href={`mailto:${c.email}`} className="text-white/90 hover:text-white break-all">{c.email}</a>
                            </div>
                            <div>
                              <span className="text-white/40 text-xs block">Phone</span>
                              <a href={`tel:${c.phone}`} className="text-white/90 hover:text-white">{c.phone}</a>
                            </div>
                            <div>
                              <span className="text-white/40 text-xs block">Contact preference</span>
                              <p className="text-white/80">{c.preferred_contact}</p>
                            </div>
                            {c.project_type && (
                              <div>
                                <span className="text-white/40 text-xs block">Property type</span>
                                <p className="text-white/80">{c.project_type}</p>
                              </div>
                            )}
                            {c.budget && (
                              <div>
                                <span className="text-white/40 text-xs block">Budget</span>
                                <p className="text-white/80">{c.budget}</p>
                              </div>
                            )}
                            {c.timeline && (
                              <div>
                                <span className="text-white/40 text-xs block">Timeline</span>
                                <p className="text-white/80">{c.timeline}</p>
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="text-white/40 text-xs block">Message</span>
                            <p className="text-sm text-white/80 mt-1 leading-relaxed whitespace-pre-wrap">{c.message}</p>
                          </div>
                          <div className="flex justify-end pt-2 border-t border-white/10 mt-2">
                            {confirmDeleteId === c.id ? (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-white/50">Are you sure?</span>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); deleteContact(c.id) }}
                                  disabled={deletingId === c.id}
                                  className="text-[11px] text-red-400 hover:text-red-300 disabled:opacity-50 px-2 py-0.5 rounded bg-red-500/10 hover:bg-red-500/20 transition-colors"
                                >
                                  {deletingId === c.id ? '...' : 'Yes, delete'}
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null) }}
                                  className="text-[11px] text-white/50 hover:text-white px-2 py-0.5 rounded hover:bg-white/10 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); deleteContact(c.id) }}
                                className="text-[11px] text-white/40 hover:text-red-400 px-2 py-0.5 rounded hover:bg-red-500/10 transition-colors"
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
              <h2 className="text-lg sm:text-xl font-bold">Reviews</h2>
              <button
                type="button"
                onClick={loadReviews}
                className="text-xs text-white/50 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
              >
                Refresh
              </button>
            </div>
            {reviewsLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-white/20 rounded-xl">
                <p className="text-white/50">No reviews yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="border border-white/10 rounded-xl p-4 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="font-semibold text-sm sm:text-base text-white">{r.name}</p>
                          <span className="inline-block px-2 py-0.5 bg-white/15 rounded-full text-[10px] text-white/80">{r.service}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-yellow-400 text-sm tracking-wider">{generateStars(r.rating)}</span>
                          <span className="text-xs text-white/50">{r.rating}/5</span>
                        </div>
                        <p className="text-sm text-white/75 leading-relaxed">{r.text}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className="text-xs text-white/40">{formatDate(r.created_at)}</span>
                          {r.helpful > 0 && <span className="text-xs text-white/40">👍 {r.helpful} helpful</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-2 pt-2 border-t border-white/10">
                      {confirmDeleteId === r.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white/50">Are you sure?</span>
                          <button
                            type="button"
                            onClick={() => deleteReview(r.id)}
                            disabled={deletingId === r.id}
                            className="text-[11px] text-red-400 hover:text-red-300 disabled:opacity-50 px-2 py-0.5 rounded bg-red-500/10 hover:bg-red-500/20 transition-colors"
                          >
                            {deletingId === r.id ? '...' : 'Yes, delete'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-[11px] text-white/50 hover:text-white px-2 py-0.5 rounded hover:bg-white/10 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => deleteReview(r.id)}
                          className="text-[11px] text-white/40 hover:text-red-400 px-2 py-0.5 rounded hover:bg-red-500/10 transition-colors"
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
      </div>
    </div>
  )
}
