'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'

type ReviewService = 'basement' | 'kitchen' | 'bathroom' | 'living-room' | 'other'

interface Review {
  id: number
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

const INITIAL_REVIEWS: Review[] = [
  { id: 1, name: 'Sarah Johnson', service: 'kitchen', rating: 5, date: '2025-01-15', text: 'Absolutely amazing transformation! Our kitchen went from outdated to stunning. The team was professional, punctual, and the attention to detail was exceptional. Highly recommend!', helpful: 24 },
  { id: 2, name: 'Michael Chen', service: 'basement', rating: 5, date: '2025-01-10', text: "We couldn't be happier with our new basement entertainment room. They turned an unused space into the heart of our home. The quality of work exceeded our expectations.", helpful: 18 },
  { id: 3, name: 'Emily Rodriguez', service: 'bathroom', rating: 5, date: '2025-01-05', text: "Our master bathroom is now a spa-like retreat. The team was incredibly responsive and worked within our budget. They helped us choose materials and the result is breathtaking!", helpful: 31 },
  { id: 4, name: 'David Thompson', service: 'living-room', rating: 4, date: '2024-12-28', text: 'Great experience overall. The living room remodel opened up our space beautifully. Minor delays due to material shortages, but they kept us informed every step of the way.', helpful: 12 },
  { id: 5, name: 'Jennifer Martinez', service: 'kitchen', rating: 5, date: '2024-12-20', text: 'From design to completion, everything was seamless. Our new kitchen is functional and gorgeous. The custom cabinets are exactly what we wanted!', helpful: 27 },
  { id: 6, name: 'Robert Williams', service: 'basement', rating: 5, date: '2024-12-15', text: 'Converted our basement into a home office and guest suite. The craftsmanship is top-notch. Very satisfied with the entire process and would definitely hire again.', helpful: 15 },
  { id: 7, name: 'Lisa Anderson', service: 'bathroom', rating: 4, date: '2024-12-10', text: "Beautiful bathroom renovation. The walk-in shower is perfect. Only giving 4 stars because it took a week longer than expected, but the quality makes up for it.", helpful: 9 },
  { id: 8, name: 'James Parker', service: 'kitchen', rating: 5, date: '2024-12-05', text: "Incredible work! They completely transformed our dated kitchen. The quartz countertops and modern fixtures are stunning. Professional team from start to finish.", helpful: 22 },
  { id: 9, name: 'Amanda White', service: 'living-room', rating: 5, date: '2024-11-28', text: "Our living room looks like it's from a magazine! The built-in entertainment center and new hardwood floors are perfect. Couldn't be happier!", helpful: 19 },
  { id: 10, name: 'Christopher Lee', service: 'basement', rating: 4, date: '2024-11-20', text: 'Good quality work on our basement finishing. The space is much more usable now. Team was friendly and cleaned up well after each day. Would recommend.', helpful: 11 },
  { id: 11, name: 'Michelle Taylor', service: 'bathroom', rating: 5, date: '2024-11-15', text: 'Absolutely love our new bathroom! The tile work is flawless and the dual vanities are exactly what we needed. Very professional and respectful of our home.', helpful: 16 },
  { id: 12, name: 'Daniel Brown', service: 'kitchen', rating: 5, date: '2024-11-10', text: "Best decision we made was hiring this team for our kitchen remodel. They listened to our needs and delivered beyond expectations. The island is the centerpiece of our home now!", helpful: 25 },
]

const initialFormData: ReviewFormData = {
  name: '',
  service: '',
  rating: 0,
  text: '',
}

export default function Reviews() {
  const [reviews] = useState<Review[]>(INITIAL_REVIEWS)
  const [currentFilter, setCurrentFilter] = useState<'all' | ReviewService>('all')
  const [displayedReviews, setDisplayedReviews] = useState(6)
  const [userReviews, setUserReviews] = useState<Review[]>([])
  const [helpfulClicks, setHelpfulClicks] = useState<Record<number, boolean>>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<ReviewFormData>(initialFormData)
  const [showSuccess, setShowSuccess] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const calculateOverallRating = useCallback(() => {
    const allReviews = [...userReviews, ...reviews]
    if (allReviews.length === 0) return { avg: 4.9, total: 127 }
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0)
    const avgRating = (totalRating / allReviews.length).toFixed(1)
    return { avg: parseFloat(avgRating), total: allReviews.length }
  }, [userReviews, reviews])

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

  const toggleHelpful = (reviewId: number) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.rating) {
      alert('Please select a rating')
      return
    }
    const newReview: Review = {
      id: Date.now(),
      name: formData.name,
      service: formData.service as ReviewService,
      rating: formData.rating,
      date: new Date().toISOString().split('T')[0],
      text: formData.text,
      helpful: 0,
    }
    const updatedReviews = [newReview, ...userReviews]
    setUserReviews(updatedReviews)
    setShowSuccess(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem('userReviews', JSON.stringify(updatedReviews))
    }
    setTimeout(() => {
      setShowSuccess(false)
      closeModal()
      setDisplayedReviews(6)
    }, 1500)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedReviews = localStorage.getItem('userReviews')
      const savedHelpful = localStorage.getItem('helpfulClicks')
      if (savedReviews) {
        try {
          setUserReviews(JSON.parse(savedReviews))
        } catch (e) {
          console.error('Error loading reviews:', e)
        }
      }
      if (savedHelpful) {
        try {
          setHelpfulClicks(JSON.parse(savedHelpful))
        } catch (e) {
          console.error('Error loading helpful clicks:', e)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(helpfulClicks).length > 0) {
      localStorage.setItem('helpfulClicks', JSON.stringify(helpfulClicks))
    }
  }, [helpfulClicks])

  const allReviews = [...userReviews, ...reviews]
  const filteredReviews =
    currentFilter === 'all' ? allReviews : allReviews.filter((r) => r.service === currentFilter)
  const reviewsToShow = filteredReviews.slice(0, displayedReviews)
  const hasMore = filteredReviews.length > displayedReviews

  const filterBtn = 'py-2 px-4 text-sm font-[inherit] border border-rule bg-transparent text-ink cursor-pointer hover:bg-ink hover:text-paper hover:border-ink'

  return (
    <div>
      <section className="py-12 px-6 min-h-screen bg-paper">
        <div className="max-w-content mx-auto">
          <div className="text-center mb-8 pb-6 border-b border-rule-light">
            <span className="text-xs uppercase tracking-widest text-ink-light block mb-2">Testimonials</span>
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] mb-2">What Our Clients Say</h2>
            <p className="text-[0.95rem] text-ink-light">Don&apos;t just take our word for it. Here&apos;s what homeowners have to say about their remodeling experience with us.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 p-6 border border-rule mb-8">
            <div className="text-2xl">{generateStars(Math.floor(overallRating.avg))}</div>
            <div>
              <span className="text-3xl font-bold">{overallRating.avg}</span>
              <span className="text-sm text-ink-light ml-1">out of 5 based on <span>{overallRating.total}</span> reviews</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button className={`${filterBtn} ${currentFilter === 'all' ? 'bg-ink text-paper border-ink' : ''}`} onClick={() => { setCurrentFilter('all'); setDisplayedReviews(6) }}>All Reviews</button>
            <button className={`${filterBtn} ${currentFilter === 'basement' ? 'bg-ink text-paper border-ink' : ''}`} onClick={() => { setCurrentFilter('basement'); setDisplayedReviews(6) }}>Basement</button>
            <button className={`${filterBtn} ${currentFilter === 'kitchen' ? 'bg-ink text-paper border-ink' : ''}`} onClick={() => { setCurrentFilter('kitchen'); setDisplayedReviews(6) }}>Kitchen</button>
            <button className={`${filterBtn} ${currentFilter === 'bathroom' ? 'bg-ink text-paper border-ink' : ''}`} onClick={() => { setCurrentFilter('bathroom'); setDisplayedReviews(6) }}>Bathroom</button>
            <button className={`${filterBtn} ${currentFilter === 'living-room' ? 'bg-ink text-paper border-ink' : ''}`} onClick={() => { setCurrentFilter('living-room'); setDisplayedReviews(6) }}>Living Room</button>
          </div>

          <div className="grid gap-6 mb-8">
            {reviewsToShow.map((review, index) => {
              const initials = review.name.split(' ').map((n) => n[0]).join('')
              const formattedDate = formatDate(review.date)
              const isHelpful = helpfulClicks[review.id]
              return (
                <div key={review.id} className="p-6 border border-rule-light border-l-4 border-l-ink" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex justify-between items-start mb-4 pb-4 border-b border-rule-light">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-ink text-paper text-xs font-bold shrink-0">
                        {initials}
                      </div>
                      <div>
                        <h4 className="text-base mb-1">{review.name}</h4>
                        <span className="text-sm text-ink-light">{formattedDate}</span>
                      </div>
                    </div>
                    <div className="text-sm">{generateStars(review.rating)}</div>
                  </div>
                  <span className="inline-block text-[0.7rem] uppercase tracking-wider text-ink-light mb-3">{formatServiceName(review.service)}</span>
                  <p className="text-[0.95rem] leading-relaxed mb-4">{review.text}</p>
                  <div className="pt-4 border-t border-rule-light">
                    <button
                      type="button"
                      className={`text-sm font-[inherit] border border-rule py-1.5 px-3 cursor-pointer text-ink hover:bg-ink hover:text-paper ${isHelpful ? 'bg-ink text-paper border-ink' : ''}`}
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
                className="py-2 px-6 text-sm font-[inherit] border border-ink bg-transparent text-ink cursor-pointer hover:bg-ink hover:text-paper"
                onClick={() => setDisplayedReviews(displayedReviews + 6)}
              >
                Load More Reviews
              </button>
            </div>
          )}
        </div>
      </section>

      <div className={`fixed inset-0 bg-black/80 z-[1000] flex justify-center items-center p-6 ${isModalOpen ? 'flex' : 'hidden'}`} ref={modalRef}>
        <div className="bg-paper p-8 max-w-[560px] w-full max-h-[90vh] overflow-y-auto border border-rule relative">
          <button type="button" className="absolute top-4 right-4 bg-transparent border border-rule p-1.5 cursor-pointer text-xl text-ink hover:bg-ink hover:text-paper" onClick={closeModal}>&times;</button>
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
