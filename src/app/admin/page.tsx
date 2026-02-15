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

export default function AdminPage() {
  const [session, setSession] = useState<{ user: { email?: string } } | null>(null)
  const [loading, setLoading] = useState(true)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginSubmitting, setLoginSubmitting] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const [signUpSuccess, setSignUpSuccess] = useState<string | null>(null)
  const [contacts, setContacts] = useState<ContactRow[]>([])
  const [reviews, setReviews] = useState<ReviewRow[]>([])
  const [contactsLoading, setContactsLoading] = useState(false)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'contacts' | 'reviews'>('contacts')
  const [deletingId, setDeletingId] = useState<string | null>(null)

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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setSignUpSuccess(null)
    setLoginSubmitting(true)
    const { data, error } = await supabase.auth.signUp({ email: loginEmail.trim(), password: loginPassword })
    setLoginSubmitting(false)
    if (error) {
      setLoginError(error.message)
      return
    }
    if (data.user) {
      await supabase.auth.signOut()
      setSignUpSuccess(data.user.id)
      setLoginPassword('')
    }
  }

  const handleLogout = async () => {
    await signOutAdmin()
    setSession(null)
  }

  const deleteContact = async (id: string) => {
    if (!confirm('Delete this submission?')) return
    setDeletingId(id)
    await supabase.from('contact_submissions').delete().eq('id', id)
    await loadContacts()
    setDeletingId(null)
  }

  const deleteReview = async (id: string) => {
    if (!confirm('Delete this review?')) return
    setDeletingId(id)
    await supabase.from('reviews').delete().eq('id', id)
    await loadReviews()
    setDeletingId(null)
  }

  const formatDate = (s: string) => new Date(s).toLocaleString()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-white/80">Loading...</span>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-sm border border-white/20 rounded-lg p-8 bg-white/5">
          <h1 className="text-xl font-bold mb-2">{showSignUp ? 'Create admin account' : 'Admin sign in'}</h1>
          <p className="text-sm text-white/70 mb-6">
            {showSignUp
              ? 'Create an account, then add your User ID to admin_users in Supabase to get access.'
              : 'Sign in with your administrator account.'}
          </p>
          {signUpSuccess ? (
            <div className="space-y-4 text-sm">
              <p className="text-green-400">Account created.</p>
              <p className="text-white/80">Run this in Supabase Dashboard → SQL Editor to grant admin access:</p>
              <pre className="p-3 bg-black/30 rounded overflow-x-auto text-xs break-all">
                {`INSERT INTO admin_users (user_id) VALUES ('${signUpSuccess}');`}
              </pre>
              <p className="text-white/70">Then sign in above.</p>
              <button
                type="button"
                onClick={() => { setSignUpSuccess(null); setShowSignUp(false) }}
                className="text-white/70 hover:text-white"
              >
                ← Back to sign in
              </button>
            </div>
          ) : (
            <form onSubmit={showSignUp ? handleSignUp : handleLogin} className="space-y-4">
              {loginError && (
                <p className="text-sm text-red-400" role="alert">{loginError}</p>
              )}
              <div>
                <label htmlFor="admin-email" className="block text-sm mb-1">Email</label>
                <input
                  id="admin-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full px-3 py-2 rounded border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label htmlFor="admin-password" className="block text-sm mb-1">Password</label>
                <input
                  id="admin-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  autoComplete={showSignUp ? 'new-password' : 'current-password'}
                  minLength={6}
                  className="w-full px-3 py-2 rounded border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loginSubmitting}
                className="w-full py-2 px-4 bg-white text-[#1a1a1a] font-medium rounded hover:bg-white/90 disabled:opacity-50"
              >
                {loginSubmitting ? (showSignUp ? 'Creating...' : 'Signing in...') : (showSignUp ? 'Create account' : 'Sign in')}
              </button>
              <p className="text-center">
                <button
                  type="button"
                  onClick={() => { setShowSignUp(!showSignUp); setLoginError('') }}
                  className="text-sm text-white/70 hover:text-white"
                >
                  {showSignUp ? 'Already have an account? Sign in' : 'Need an account? Create one'}
                </button>
              </p>
            </form>
          )}
          <p className="mt-6 text-center">
            <Link href="/" className="text-sm text-white/70 hover:text-white">← Back to site</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-white/20 bg-[#1a1a1a] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-bold">Admin</h1>
          <nav className="flex gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('contacts')}
              className={`text-sm ${activeTab === 'contacts' ? 'text-white underline' : 'text-white/70 hover:text-white'}`}
            >
              Contact submissions
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`text-sm ${activeTab === 'reviews' ? 'text-white underline' : 'text-white/70 hover:text-white'}`}
            >
              Reviews
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/60">{session.user.email}</span>
          <Link href="/" className="text-sm text-white/70 hover:text-white">View site</Link>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm text-white/70 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="p-6 max-w-5xl mx-auto">
        {activeTab === 'contacts' && (
          <section>
            <h2 className="text-xl font-bold mb-4">Contact submissions</h2>
            {contactsLoading ? (
              <p className="text-white/70">Loading...</p>
            ) : contacts.length === 0 ? (
              <p className="text-white/70">No submissions yet.</p>
            ) : (
              <div className="space-y-4">
                {contacts.map((c) => (
                  <div
                    key={c.id}
                    className="border border-white/20 rounded-lg p-4 bg-white/5"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{c.name}</p>
                        <p className="text-sm text-white/70">{c.email} · {c.phone}</p>
                        <p className="text-sm mt-1">Service: {c.service}</p>
                        {c.budget && <p className="text-sm">Budget: {c.budget}</p>}
                        {c.timeline && <p className="text-sm">Timeline: {c.timeline}</p>}
                        <p className="text-sm mt-2 text-white/80">{c.message}</p>
                        <p className="text-xs text-white/50 mt-2">{formatDate(c.created_at)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteContact(c.id)}
                        disabled={deletingId === c.id}
                        className="shrink-0 text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'reviews' && (
          <section>
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            {reviewsLoading ? (
              <p className="text-white/70">Loading...</p>
            ) : reviews.length === 0 ? (
              <p className="text-white/70">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="border border-white/20 rounded-lg p-4 bg-white/5"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{r.name}</p>
                        <p className="text-sm text-white/70">{r.service} · {r.rating}/5</p>
                        <p className="text-sm mt-1 text-white/80">{r.text}</p>
                        <p className="text-xs text-white/50 mt-2">{formatDate(r.created_at)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteReview(r.id)}
                        disabled={deletingId === r.id}
                        className="shrink-0 text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
                      >
                        Delete
                      </button>
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
