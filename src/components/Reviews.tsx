'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

type ReviewService = 'basement' | 'kitchen' | 'bathroom' | 'living-room' | 'other'

interface Review {
  id: string
  name: string
  service: ReviewService
  rating: number
  date: string
  text: string
  helpful: number
}

interface ReviewFormData {
  name: string
  service: string
  rating: number
  text: string
}

const initialFormData: ReviewFormData = {
  name: '',
  service: '',
  rating: 0,
  text: '',
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [currentFilter, setCurrentFilter] = useState<'all' | ReviewService>('all')
  const [displayedReviews, setDisplayedReviews] = useState(6)
  const [helpfulClicks, setHelpfulClicks] = useState<Record<string, boolean>>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<ReviewFormData>(initialFormData)
  const [showSuccess, setShowSuccess] = useState(false)


  const calculateOverallRating = useCallback(() => {
    if (reviews.length === 0) return { avg: 0, total: 0 }
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const avgRating = (totalRating / reviews.length).toFixed(1)
    return { avg: parseFloat(avgRating), total: reviews.length }
  }, [reviews])

  const overallRating = calculateOverallRating()

  const generateStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-ink' : 'text-rule-light'}>
        {i < rating ? '★' : '☆'}
      </span>
    ))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  const formatServiceName = (service: string) => {
    return service.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' Remodeling'
  }

  const toggleHelpful = (reviewId: string) => {
    setHelpfulClicks((prev) => {
      if (prev[reviewId]) {
        const next = { ...prev }
        delete next[reviewId]
        return next
      }
      return { ...prev, [reviewId]: true }
    })
  }

  const openModal = () => {
    setIsModalOpen(true)
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden'
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setFormData(initialFormData)
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto'
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStarClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }))
  }

  const fetchReviews = useCallback(async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('id, name, service, rating, "text", helpful, created_at')
      .order('created_at', { ascending: false })
    if (error) return
    const mapped: Review[] = (data ?? []).map((r) => ({
      id: r.id,
      name: r.name,
      service: r.service as ReviewService,
      rating: r.rating,
      date: r.created_at.split('T')[0],
      text: r.text,
      helpful: r.helpful ?? 0,
    }))
    setReviews(mapped)
  }, [])

  useEffect(() => {
    fetchReviews().finally(() => setLoading(false))
  }, [fetchReviews])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isModalOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.rating) {
      alert('Please select a rating')
      return
    }
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          name: formData.name.trim(),
          service: formData.service,
          rating: formData.rating,
          text: formData.text.trim(),
        })
        .select('id, name, service, rating, "text", helpful, created_at')
        .single()
      if (error) throw error
      const newReview: Review = {
        id: data.id,
        name: data.name,
        service: data.service as ReviewService,
        rating: data.rating,
        date: data.created_at.split('T')[0],
        text: data.text,
        helpful: data.helpful ?? 0,
      }
      setReviews((prev) => [newReview, ...prev])
      setShowSuccess(true)
      closeModal()
      setFormData(initialFormData)
      setDisplayedReviews(6)
      setTimeout(() => setShowSuccess(false), 1500)
    } catch {
      alert('Failed to submit review. Please try again.')
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHelpful = localStorage.getItem('helpfulClicks')
      if (savedHelpful) {
        try {
          setHelpfulClicks(JSON.parse(savedHelpful))
        } catch {
          // ignore corrupted localStorage
        }
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(helpfulClicks).length > 0) {
      localStorage.setItem('helpfulClicks', JSON.stringify(helpfulClicks))
    }
  }, [helpfulClicks])

  const allReviews = reviews
  const filteredReviews =
    currentFilter === 'all' ? allReviews : allReviews.filter((r) => r.service === currentFilter)
  const reviewsToShow = filteredReviews.slice(0, displayedReviews)
  const hasMore = filteredReviews.length > displayedReviews

  const filterBtn = 'py-1.5 px-3 sm:py-2 sm:px-4 text-xs sm:text-sm font-[inherit] border border-rule bg-transparent text-ink cursor-pointer hover:bg-ink hover:text-white hover:border-ink'

  return (
    <div>
      <section className="py-12 px-6 min-h-screen bg-paper">
        <div className="max-w-content mx-auto">
          <div className="text-center mb-8 pb-6 border-b border-rule-light">
            <span className="text-xs uppercase tracking-widest text-ink-light block mb-2">Testimonials</span>
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] mb-2">What Our Clients Say</h2>
            <p className="text-[0.95rem] text-ink-light">Don&apos;t just take our word for it. Here&apos;s what homeowners have to say about their remodeling experience with us.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 p-4 sm:p-6 border border-rule mb-6 sm:mb-8">
            {loading ? (
              <p className="text-ink-light">Loading reviews...</p>
            ) : (
              <>
                <div className="text-2xl">{generateStars(Math.floor(overallRating.avg))}</div>
                <div>
                  <span className="text-3xl font-bold">{overallRating.avg}</span>
                  <span className="text-sm text-ink-light ml-1">out of 5 based on <span>{overallRating.total}</span> reviews</span>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button className={`${filterBtn} ${currentFilter === 'all' ? '!bg-ink !text-white border-ink' : ''}`} onClick={() => { setCurrentFilter('all'); setDisplayedReviews(6) }}>All Reviews</button>
            <button className={`${filterBtn} ${currentFilter === 'basement' ? '!bg-ink !text-white border-ink' : ''}`} onClick={() => { setCurrentFilter('basement'); setDisplayedReviews(6) }}>Basement</button>
            <button className={`${filterBtn} ${currentFilter === 'kitchen' ? '!bg-ink !text-white border-ink' : ''}`} onClick={() => { setCurrentFilter('kitchen'); setDisplayedReviews(6) }}>Kitchen</button>
            <button className={`${filterBtn} ${currentFilter === 'bathroom' ? '!bg-ink !text-white border-ink' : ''}`} onClick={() => { setCurrentFilter('bathroom'); setDisplayedReviews(6) }}>Bathroom</button>
            <button className={`${filterBtn} ${currentFilter === 'living-room' ? '!bg-ink !text-white border-ink' : ''}`} onClick={() => { setCurrentFilter('living-room'); setDisplayedReviews(6) }}>Living Room</button>
          </div>

          <div className="grid gap-6 mb-8">
            {loading && <p className="text-ink-light">Loading reviews...</p>}
            {!loading && reviewsToShow.length === 0 && (
              <p className="text-ink-light text-center py-8">No reviews yet. Be the first to share your experience!</p>
            )}
            {reviewsToShow.map((review, index) => {
              const initials = review.name.split(' ').map((n) => n[0]).join('')
              const formattedDate = formatDate(review.date)
              const isHelpful = helpfulClicks[review.id]
              return (
                <div key={review.id} className="p-4 sm:p-6 border border-rule-light border-l-4 border-l-ink" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-rule-light gap-2">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-ink text-paper text-[10px] sm:text-xs font-bold shrink-0">
                        {initials}
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base mb-0.5 sm:mb-1">{review.name}</h4>
                        <span className="text-xs sm:text-sm text-ink-light">{formattedDate}</span>
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm pl-11 sm:pl-0">{generateStars(review.rating)}</div>
                  </div>
                  <span className="inline-block text-[0.7rem] uppercase tracking-wider text-ink-light mb-3">{formatServiceName(review.service)}</span>
                  <p className="text-sm sm:text-[0.95rem] leading-relaxed mb-3 sm:mb-4">{review.text}</p>
                  <div className="pt-4 border-t border-rule-light">
                    <button
                      type="button"
                      className={`text-sm font-[inherit] border border-rule py-1.5 px-3 cursor-pointer text-ink hover:bg-ink hover:text-white ${isHelpful ? '!bg-ink !text-white border-ink' : ''}`}
                      onClick={() => toggleHelpful(review.id)}
                    >
                      👍 Helpful ({review.helpful + (isHelpful ? 1 : 0)})
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {hasMore && (
            <div className="text-center mt-8">
              <button
                type="button"
                className="py-2 px-6 text-sm font-[inherit] border border-ink bg-transparent text-ink cursor-pointer hover:bg-ink hover:text-white"
                onClick={() => setDisplayedReviews(displayedReviews + 6)}
              >
                Load More Reviews
              </button>
            </div>
          )}
        </div>
      </section>

      <div
        className={`fixed inset-0 bg-black/80 z-[1000] flex justify-center items-center p-3 sm:p-6 ${isModalOpen ? 'flex' : 'hidden'}`}
        onClick={closeModal}
        role="dialog"
        aria-modal="true"
        aria-label="Write a review"
      >
        <div
          className="bg-paper p-4 sm:p-8 max-w-[560px] w-full max-h-[90vh] overflow-y-auto border border-rule relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button type="button" className="absolute top-4 right-4 bg-transparent border border-rule p-1.5 cursor-pointer text-xl text-ink hover:bg-ink hover:text-white rounded" onClick={closeModal} aria-label="Close (Escape)">&times;</button>
          <h2 className="text-2xl mb-6 pb-3 border-b border-rule">Write a Review</h2>
          {showSuccess && (
            <div className="bg-ink text-paper p-4 mb-4 text-center text-[0.95rem]">
              ✓ Thank you! Your review has been submitted successfully.
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="reviewerName" className="block text-sm mb-1.5">Your Name *</label>
              <input type="text" id="reviewerName" name="name" value={formData.name} onChange={handleInputChange} required className="w-full p-2 border border-rule font-[inherit] text-[0.95rem] bg-paper focus:outline-none focus:border-ink" />
            </div>
            <div className="mb-5">
              <label htmlFor="reviewService" className="block text-sm mb-1.5">Service Type *</label>
              <select id="reviewService" name="service" value={formData.service} onChange={handleInputChange} required className="w-full p-2 border border-rule font-[inherit] text-[0.95rem] bg-paper focus:outline-none focus:border-ink">
                <option value="">Select a service</option>
                <option value="basement">Basement Remodeling</option>
                <option value="kitchen">Kitchen Remodeling</option>
                <option value="bathroom">Bathroom Remodeling</option>
                <option value="living-room">Living Room Remodeling</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="mb-5">
              <label className="block text-sm mb-1.5">Your Rating *</label>
              <div className="flex gap-2 text-xl mt-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <span
                    key={rating}
                    role="button"
                    tabIndex={0}
                    className={`cursor-pointer ${formData.rating >= rating ? 'text-ink' : 'text-rule-light'} hover:text-ink`}
                    onClick={() => handleStarClick(rating)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStarClick(rating)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-5">
              <label htmlFor="reviewText" className="block text-sm mb-1.5">Your Review *</label>
              <textarea id="reviewText" name="text" value={formData.text} onChange={handleInputChange} rows={5} required placeholder="Tell us about your experience..." className="w-full p-2 border border-rule font-[inherit] text-[0.95rem] bg-paper min-h-[100px] resize-y focus:outline-none focus:border-ink" />
            </div>
            <button type="submit" className="w-full py-3 bg-ink text-paper border border-ink font-[inherit] text-sm cursor-pointer hover:bg-ink-light hover:border-ink-light">
              Submit Review
            </button>
          </form>
        </div>
      </div>

      <button type="button" className="fixed bottom-6 right-6 bg-ink text-paper border border-ink py-3 px-5 cursor-pointer font-[inherit] text-sm z-[100] hover:bg-ink-light hover:border-ink-light sm:inline-flex sm:items-center sm:gap-2" onClick={openModal}>
        <span>✍️</span>
        <span className="hidden sm:inline">Write a Review</span>
      </button>
    </div>
  )
}
