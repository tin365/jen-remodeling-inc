'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Reviews.css';

const Reviews = () => {
    const [reviews] = useState([
        {
            id: 1,
            name: "Sarah Johnson",
            service: "kitchen",
            rating: 5,
            date: "2025-01-15",
            text: "Absolutely amazing transformation! Our kitchen went from outdated to stunning. The team was professional, punctual, and the attention to detail was exceptional. Highly recommend!",
            helpful: 24
        },
        {
            id: 2,
            name: "Michael Chen",
            service: "basement",
            rating: 5,
            date: "2025-01-10",
            text: "We couldn't be happier with our new basement entertainment room. They turned an unused space into the heart of our home. The quality of work exceeded our expectations.",
            helpful: 18
        },
        {
            id: 3,
            name: "Emily Rodriguez",
            service: "bathroom",
            rating: 5,
            date: "2025-01-05",
            text: "Our master bathroom is now a spa-like retreat. The team was incredibly responsive and worked within our budget. They helped us choose materials and the result is breathtaking!",
            helpful: 31
        },
        {
            id: 4,
            name: "David Thompson",
            service: "living-room",
            rating: 4,
            date: "2024-12-28",
            text: "Great experience overall. The living room remodel opened up our space beautifully. Minor delays due to material shortages, but they kept us informed every step of the way.",
            helpful: 12
        },
        {
            id: 5,
            name: "Jennifer Martinez",
            service: "kitchen",
            rating: 5,
            date: "2024-12-20",
            text: "From design to completion, everything was seamless. Our new kitchen is functional and gorgeous. The custom cabinets are exactly what we wanted!",
            helpful: 27
        },
        {
            id: 6,
            name: "Robert Williams",
            service: "basement",
            rating: 5,
            date: "2024-12-15",
            text: "Converted our basement into a home office and guest suite. The craftsmanship is top-notch. Very satisfied with the entire process and would definitely hire again.",
            helpful: 15
        },
        {
            id: 7,
            name: "Lisa Anderson",
            service: "bathroom",
            rating: 4,
            date: "2024-12-10",
            text: "Beautiful bathroom renovation. The walk-in shower is perfect. Only giving 4 stars because it took a week longer than expected, but the quality makes up for it.",
            helpful: 9
        },
        {
            id: 8,
            name: "James Parker",
            service: "kitchen",
            rating: 5,
            date: "2024-12-05",
            text: "Incredible work! They completely transformed our dated kitchen. The quartz countertops and modern fixtures are stunning. Professional team from start to finish.",
            helpful: 22
        },
        {
            id: 9,
            name: "Amanda White",
            service: "living-room",
            rating: 5,
            date: "2024-11-28",
            text: "Our living room looks like it's from a magazine! The built-in entertainment center and new hardwood floors are perfect. Couldn't be happier!",
            helpful: 19
        },
        {
            id: 10,
            name: "Christopher Lee",
            service: "basement",
            rating: 4,
            date: "2024-11-20",
            text: "Good quality work on our basement finishing. The space is much more usable now. Team was friendly and cleaned up well after each day. Would recommend.",
            helpful: 11
        },
        {
            id: 11,
            name: "Michelle Taylor",
            service: "bathroom",
            rating: 5,
            date: "2024-11-15",
            text: "Absolutely love our new bathroom! The tile work is flawless and the dual vanities are exactly what we needed. Very professional and respectful of our home.",
            helpful: 16
        },
        {
            id: 12,
            name: "Daniel Brown",
            service: "kitchen",
            rating: 5,
            date: "2024-11-10",
            text: "Best decision we made was hiring this team for our kitchen remodel. They listened to our needs and delivered beyond expectations. The island is the centerpiece of our home now!",
            helpful: 25
        }
    ]);

    const [currentFilter, setCurrentFilter] = useState('all');
    const [displayedReviews, setDisplayedReviews] = useState(6);
    const [userReviews, setUserReviews] = useState([]);
    const [helpfulClicks, setHelpfulClicks] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        service: '',
        rating: 0,
        text: ''
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const modalRef = useRef(null);

    // Calculate overall rating
    const calculateOverallRating = useCallback(() => {
        const allReviews = [...userReviews, ...reviews];
        if (allReviews.length === 0) return { avg: 4.9, total: 127 };
        const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = (totalRating / allReviews.length).toFixed(1);
        return { avg: parseFloat(avgRating), total: allReviews.length };
    }, [userReviews, reviews]);

    const overallRating = calculateOverallRating();

    // Generate stars component
    const generateStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < rating ? 'star-filled' : 'star-empty'}>
                {i < rating ? '★' : '☆'}
            </span>
        ));
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    // Format service name
    const formatServiceName = (service) => {
        return service.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ') + ' Remodeling';
    };

    // Toggle helpful
    const toggleHelpful = (reviewId) => {
        setHelpfulClicks(prev => {
            if (prev[reviewId]) {
                const newClicks = { ...prev };
                delete newClicks[reviewId];
                return newClicks;
            }
            return { ...prev, [reviewId]: true };
        });
    };

    // Modal functions
    const openModal = () => {
        setIsModalOpen(true);
        if (typeof document !== 'undefined') {
            document.body.style.overflow = 'hidden';
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
        if (typeof document !== 'undefined') {
            document.body.style.overflow = 'auto';
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            service: '',
            rating: 0,
            text: ''
        });
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle star rating click
    const handleStarClick = (rating) => {
        setFormData(prev => ({
            ...prev,
            rating: rating
        }));
    };

    // Submit review
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.rating) {
            alert('Please select a rating');
            return;
        }

        const newReview = {
            id: Date.now(),
            name: formData.name,
            service: formData.service,
            rating: formData.rating,
            date: new Date().toISOString().split('T')[0],
            text: formData.text,
            helpful: 0
        };

        const updatedReviews = [newReview, ...userReviews];
        setUserReviews(updatedReviews);
        setShowSuccess(true);
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('userReviews', JSON.stringify(updatedReviews));
        }

        // Reset and close after delay
        setTimeout(() => {
            setShowSuccess(false);
            closeModal();
            setDisplayedReviews(6);
        }, 1500);
    };

    // Load reviews from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedReviews = localStorage.getItem('userReviews');
            const savedHelpful = localStorage.getItem('helpfulClicks');
            
            if (savedReviews) {
                try {
                    setUserReviews(JSON.parse(savedReviews));
                } catch (e) {
                    console.error('Error loading reviews:', e);
                }
            }
            
            if (savedHelpful) {
                try {
                    setHelpfulClicks(JSON.parse(savedHelpful));
                } catch (e) {
                    console.error('Error loading helpful clicks:', e);
                }
            }
        }
    }, []);

    // Save helpful clicks to localStorage
    useEffect(() => {
        if (typeof window !== 'undefined' && Object.keys(helpfulClicks).length > 0) {
            localStorage.setItem('helpfulClicks', JSON.stringify(helpfulClicks));
        }
    }, [helpfulClicks]);

    // Filter and display reviews
    const allReviews = [...userReviews, ...reviews];
    const filteredReviews = currentFilter === 'all' 
        ? allReviews 
        : allReviews.filter(review => review.service === currentFilter);
    
    const reviewsToShow = filteredReviews.slice(0, displayedReviews);
    const hasMore = filteredReviews.length > displayedReviews;

    return (
        <div>
            <section className="reviews-section">
                <div className="reviews-container">
                    {/* Section Header */}
                    <div className="section-header">
                        <span className="header-label">Testimonials</span>
                        <h2 className="section-title">What Our Clients Say</h2>
                        <p className="section-subtitle">Don&apos;t just take our word for it. Here&apos;s what homeowners have to say about their remodeling experience with us.</p>
                    </div>

                    {/* Overall Rating */}
                    <div className="overall-rating">
                        <div className="rating-stars">
                            {generateStars(Math.floor(overallRating.avg))}
                        </div>
                        <div className="rating-text">
                            <span className="rating-number">{overallRating.avg}</span>
                            <span className="rating-label">out of 5 based on <span>{overallRating.total}</span> reviews</span>
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="filter-section">
                        <button 
                            className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
                            onClick={() => { setCurrentFilter('all'); setDisplayedReviews(6); }}
                        >
                            All Reviews
                        </button>
                        <button 
                            className={`filter-btn ${currentFilter === 'basement' ? 'active' : ''}`}
                            onClick={() => { setCurrentFilter('basement'); setDisplayedReviews(6); }}
                        >
                            Basement
                        </button>
                        <button 
                            className={`filter-btn ${currentFilter === 'kitchen' ? 'active' : ''}`}
                            onClick={() => { setCurrentFilter('kitchen'); setDisplayedReviews(6); }}
                        >
                            Kitchen
                        </button>
                        <button 
                            className={`filter-btn ${currentFilter === 'bathroom' ? 'active' : ''}`}
                            onClick={() => { setCurrentFilter('bathroom'); setDisplayedReviews(6); }}
                        >
                            Bathroom
                        </button>
                        <button 
                            className={`filter-btn ${currentFilter === 'living-room' ? 'active' : ''}`}
                            onClick={() => { setCurrentFilter('living-room'); setDisplayedReviews(6); }}
                        >
                            Living Room
                        </button>
                    </div>

                    {/* Reviews Grid */}
                    <div className="reviews-grid">
                        {reviewsToShow.map((review, index) => {
                            const initials = review.name.split(' ').map(n => n[0]).join('');
                            const formattedDate = formatDate(review.date);
                            const isHelpful = helpfulClicks[review.id];

                            return (
                                <div key={review.id} className="review-card" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div className="review-header">
                                        <div className="reviewer-info">
                                            <div className="reviewer-avatar">{initials}</div>
                                            <div className="reviewer-details">
                                                <h4>{review.name}</h4>
                                                <span className="review-date">{formattedDate}</span>
                                            </div>
                                        </div>
                                        <div className="review-rating">
                                            {generateStars(review.rating)}
                                        </div>
                                    </div>
                                    <span className="review-service-tag">{formatServiceName(review.service)}</span>
                                    <p className="review-text">{review.text}</p>
                                    <div className="review-helpful">
                                        <button 
                                            className={`helpful-btn ${isHelpful ? 'clicked' : ''}`}
                                            onClick={() => toggleHelpful(review.id)}
                                        >
                                            👍 Helpful ({review.helpful + (isHelpful ? 1 : 0)})
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Load More Button */}
                    {hasMore && (
                        <div className="load-more-container">
                            <button 
                                className="load-more-btn"
                                onClick={() => setDisplayedReviews(displayedReviews + 6)}
                            >
                                Load More Reviews
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Write Review Modal */}
            <div className={`modal ${isModalOpen ? 'active' : ''}`} ref={modalRef}>
                <div className="modal-content">
                    <button className="modal-close" onClick={closeModal}>&times;</button>
                    <h2 className="modal-title">Write a Review</h2>
                    
                    {showSuccess && (
                        <div className="success-message">
                            ✓ Thank you! Your review has been submitted successfully.
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="reviewerName">Your Name *</label>
                            <input 
                                type="text" 
                                id="reviewerName"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="reviewService">Service Type *</label>
                            <select 
                                id="reviewService"
                                name="service"
                                value={formData.service}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select a service</option>
                                <option value="basement">Basement Remodeling</option>
                                <option value="kitchen">Kitchen Remodeling</option>
                                <option value="bathroom">Bathroom Remodeling</option>
                                <option value="living-room">Living Room Remodeling</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Your Rating *</label>
                            <div className="star-rating-input">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <span
                                        key={rating}
                                        className={`star ${formData.rating >= rating ? 'active' : ''}`}
                                        onClick={() => handleStarClick(rating)}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="reviewText">Your Review *</label>
                            <textarea 
                                id="reviewText"
                                name="text"
                                value={formData.text}
                                onChange={handleInputChange}
                                rows={5}
                                required
                                placeholder="Tell us about your experience..."
                            />
                        </div>

                        <button type="submit" className="submit-btn">Submit Review</button>
                    </form>
                </div>
            </div>

            {/* Floating Write Review Button */}
            <button className="floating-btn" onClick={openModal}>
                <span className="btn-icon">✍️</span>
                <span className="btn-text">Write a Review</span>
            </button>
        </div>
    );
}

export default Reviews;
