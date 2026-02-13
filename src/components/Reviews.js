import React, { useState, useEffect, useCallback } from 'react';
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
    const [userReviews, setUserReviews] = useState([]); // Store user-submitted reviews
    const [helpfulClicks, setHelpfulClicks] = useState({}); // Track which reviews user found helpful

    // Update overall rating
    const updateOverallRating = useCallback(() => {
        const allReviews = [...userReviews, ...reviews];
        const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = (totalRating / allReviews.length).toFixed(1);

        // Update stars
        const overallStars = document.getElementById('overallStars');
        if (overallStars) {
            const fullStars = Math.floor(avgRating);
            const hasHalfStar = avgRating % 1 >= 0.5;

            let starsHTML = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= fullStars) {
                    starsHTML += '★';
                } else if (i === fullStars + 1 && hasHalfStar) {
                    starsHTML += '★';
                } else {
                    starsHTML += '☆';
                }
            }
            overallStars.innerHTML = starsHTML;
        }
    }, [userReviews, reviews]);

    useEffect(() => {
        loadReviews(); // Load saved reviews first
    }, []);

    useEffect(() => {
        updateOverallRating();
    }, [updateOverallRating]);

    // Display reviews based on filter
    const displayReviews = () => {
        const allReviews = [...userReviews, ...reviews];
        
        let filteredReviews = currentFilter === 'all' 
            ? allReviews 
            : allReviews.filter(review => review.service === currentFilter);

        const reviewsToShow = filteredReviews.slice(0, displayedReviews);
        
        return reviewsToShow.map((review, index) => createReviewCard(review, index));
    }

    // Create review card element
    const createReviewCard = (review, index) => {
        const initials = review.name.split(' ').map(n => n[0]).join('');
        const formattedDate = formatDate(review.date);
        const stars = generateStars(review.rating);

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
                    <div className="review-rating">{stars}</div>
                </div>
                <span className="review-service-tag">{formatServiceName(review.service)}</span>
                <p className="review-text">{review.text}</p>
                <div className="review-helpful">
                    <button className={`helpful-btn ${helpfulClicks[review.id] ? 'clicked' : ''}`} onClick={() => toggleHelpful(review.id)}>
                        👍 Helpful ({review.helpful + (helpfulClicks[review.id] ? 1 : 0)})
                    </button>
                </div>
            </div>
        );
    }

    // Generate star HTML
    const generateStars = (rating) => {
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                starsHTML += '★';
            } else {
                starsHTML += '☆';
            }
        }
        return starsHTML;
    }

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Format service name
    const formatServiceName = (service) => {
        return service.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ') + ' Remodeling';
    }

    // Toggle helpful
    const toggleHelpful = (reviewId) => {
        if (helpfulClicks[reviewId]) {
            const newHelpfulClicks = { ...helpfulClicks };
            delete newHelpfulClicks[reviewId];
            setHelpfulClicks(newHelpfulClicks);
        } else {
            setHelpfulClicks({ ...helpfulClicks, [reviewId]: true });
        }
    }

    // Modal functions
    const openModal = () => {
        document.getElementById('reviewModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    const closeModal = () => {
        document.getElementById('reviewModal').classList.remove('active');
        document.body.style.overflow = 'auto';
        resetForm();
    }

    const resetForm = () => {
        document.getElementById('reviewForm').reset();
        document.getElementById('ratingValue').value = '';
        highlightStars(0);
    }

    // Star rating functions
    const updateStarRating = (rating) => {
        highlightStars(rating);
    }

    const highlightStars = (rating) => {
        const stars = document.querySelectorAll('.star-rating-input .star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    // Submit review
    const submitReview = () => {
        const name = document.getElementById('reviewerName').value;
        const service = document.getElementById('reviewService').value;
        const rating = parseInt(document.getElementById('ratingValue').value);
        const text = document.getElementById('reviewText').value;

        if (!rating) {
            alert('Please select a rating');
            return;
        }

        const newReview = {
            id: Date.now(),
            name: name,
            service: service,
            rating: rating,
            date: new Date().toISOString().split('T')[0],
            text: text,
            helpful: 0
        };

        setUserReviews([newReview, ...userReviews]);
        
        // Show success message
        showSuccessMessage();
        
        // Save and close modal
        setTimeout(() => {
            saveReviews();
            closeModal();
            setDisplayedReviews(6);
            updateOverallRating();
        }, 1500);
    }

    // Show success message
    const showSuccessMessage = () => {
        const form = document.getElementById('reviewForm');
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = '✓ Thank you! Your review has been submitted successfully.';
        
        form.parentElement.insertBefore(successMsg, form);
        
        setTimeout(() => {
            successMsg.remove();
        }, 3000);
    }

    // Save reviews to localStorage
    const saveReviews = () => {
        localStorage.setItem('userReviews', JSON.stringify(userReviews));
        localStorage.setItem('helpfulClicks', JSON.stringify(helpfulClicks));
    }

    // Load reviews from localStorage
    const loadReviews = () => {
        const savedReviews = localStorage.getItem('userReviews');
        const savedHelpful = localStorage.getItem('helpfulClicks');
        
        if (savedReviews) {
            setUserReviews(JSON.parse(savedReviews));
        }
        
        if (savedHelpful) {
            setHelpfulClicks(JSON.parse(savedHelpful));
        }
    }

    return (
        <div>
            <section className="reviews-section">
                <div className="reviews-container">
                    {/* Section Header */}
                    <div className="section-header">
                        <span className="header-label">Testimonials</span>
                        <h2 className="section-title">What Our Clients Say</h2>
                        <p className="section-subtitle">Don't just take our word for it. Here's what homeowners have to say about their remodeling experience with us.</p>
                    </div>

                    {/* Overall Rating */}
                    <div className="overall-rating">
                        <div className="rating-stars" id="overallStars"></div>
                        <div className="rating-text">
                            <span className="rating-number" id="averageRating">4.9</span>
                            <span className="rating-label">out of 5 based on <span id="totalReviews">127</span> reviews</span>
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="filter-section">
                        <button className="filter-btn active" data-filter="all" onClick={() => { setCurrentFilter('all'); setDisplayedReviews(6); }}>All Reviews</button>
                        <button className="filter-btn" data-filter="basement" onClick={() => { setCurrentFilter('basement'); setDisplayedReviews(6); }}>Basement</button>
                        <button className="filter-btn" data-filter="kitchen" onClick={() => { setCurrentFilter('kitchen'); setDisplayedReviews(6); }}>Kitchen</button>
                        <button className="filter-btn" data-filter="bathroom" onClick={() => { setCurrentFilter('bathroom'); setDisplayedReviews(6); }}>Bathroom</button>
                        <button className="filter-btn" data-filter="living-room" onClick={() => { setCurrentFilter('living-room'); setDisplayedReviews(6); }}>Living Room</button>
                    </div>

                    {/* Reviews Grid */}
                    <div className="reviews-grid" id="reviewsGrid">
                        {displayReviews()}
                    </div>

                    {/* Load More Button */}
                    <div className="load-more-container">
                        <button className="load-more-btn" id="loadMoreBtn" onClick={() => setDisplayedReviews(displayedReviews + 6)}>Load More Reviews</button>
                    </div>
                </div>
            </section>

            {/* Write Review Modal */}
            <div className="modal" id="reviewModal">
                <div className="modal-content">
                    <button className="modal-close" id="closeModal" onClick={closeModal}>&times;</button>
                    <h2 className="modal-title">Write a Review</h2>
                    <form id="reviewForm" onSubmit={(e) => { e.preventDefault(); submitReview(); }}>
                        <div className="form-group">
                            <label htmlFor="reviewerName">Your Name *</label>
                            <input type="text" id="reviewerName" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="reviewService">Service Type *</label>
                            <select id="reviewService" required>
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
                            <div className="star-rating-input" id="starRatingInput">
                                <span className="star" data-rating="1" onClick={() => updateStarRating(1)}>★</span>
                                <span className="star" data-rating="2" onClick={() => updateStarRating(2)}>★</span>
                                <span className="star" data-rating="3" onClick={() => updateStarRating(3)}>★</span>
                                <span className="star" data-rating="4" onClick={() => updateStarRating(4)}>★</span>
                                <span className="star" data-rating="5" onClick={() => updateStarRating(5)}>★</span>
                            </div>
                            <input type="hidden" id="ratingValue" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="reviewText">Your Review *</label>
                            <textarea id="reviewText" rows="5" required placeholder="Tell us about your experience..."></textarea>
                        </div>

                        <button type="submit" className="submit-btn">Submit Review</button>
                    </form>
                </div>
            </div>

            {/* Floating Write Review Button */}
            <button className="floating-btn" id="writeReviewBtn" onClick={openModal}>
                <span className="btn-icon">✍️</span>
                <span className="btn-text">Write a Review</span>
            </button>
        </div>
    );
}

export default Reviews;