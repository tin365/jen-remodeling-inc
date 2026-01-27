import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: '',
    preferredContact: 'email'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const services = [
    'Basement Remodeling',
    'Bathroom Remodeling',
    'Kitchen Remodeling',
    'Living Room Remodeling',
    'Indoor Remodeling',
    'Other'
  ];

  const budgetRanges = [
    'Under $10,000',
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    '$50,000 - $100,000',
    'Over $100,000'
  ];

  const timelines = [
    'As soon as possible',
    'Within 1-3 months',
    'Within 3-6 months',
    '6+ months',
    'Just exploring options'
  ];

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[\d\s\-\(\)]+$/;
    return phone.length >= 10 && re.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.service) {
      newErrors.service = 'Please select a service';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please tell us about your project';
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Please provide more details (at least 20 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          projectType: '',
          budget: '',
          timeline: '',
          message: '',
          preferredContact: 'email'
        });
        setSubmitSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Let's Build Your Dream Home</h1>
          <p className="hero-subtitle">
            Ready to transform your space? Get in touch with us today for a free consultation and estimate.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="contact-container">
          {/* Contact Info Cards */}
          <div className="contact-info-grid">
            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3 className="info-title">Call Us</h3>
              <p className="info-detail">
                <a href="tel:+1234567890">(123) 456-7890</a>
              </p>
              <p className="info-subtitle">Mon-Fri: 8AM - 6PM</p>
            </div>

            <div className="info-card">
              <div className="info-icon">✉️</div>
              <h3 className="info-title">Email Us</h3>
              <p className="info-detail">
                <a href="mailto:info@yourremodeling.com">info@yourremodeling.com</a>
              </p>
              <p className="info-subtitle">We'll respond within 24 hours</p>
            </div>

            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3 className="info-title">Visit Us</h3>
              <p className="info-detail">123 Remodeling Street</p>
              <p className="info-subtitle">Your City, ST 12345</p>
            </div>

            <div className="info-card">
              <div className="info-icon">🕐</div>
              <h3 className="info-title">Business Hours</h3>
              <p className="info-detail">Monday - Friday</p>
              <p className="info-subtitle">8:00 AM - 6:00 PM</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="form-section">
            <div className="form-header">
              <h2 className="form-title">Request a Free Consultation</h2>
              <p className="form-subtitle">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>
            </div>

            {submitSuccess && (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h3>Thank you for contacting us!</h3>
                <p>We've received your message and will get back to you soon.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              {/* Personal Information */}
              <div className="form-section-title">Personal Information</div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                    placeholder="John Doe"
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="john@example.com"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                    placeholder="(123) 456-7890"
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="preferredContact">Preferred Contact Method</label>
                  <select
                    id="preferredContact"
                    name="preferredContact"
                    value={formData.preferredContact}
                    onChange={handleChange}
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="either">Either</option>
                  </select>
                </div>
              </div>

              {/* Project Details */}
              <div className="form-section-title">Project Details</div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="service">Service Type *</label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className={errors.service ? 'error' : ''}
                  >
                    <option value="">Select a service</option>
                    {services.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                  {errors.service && <span className="error-message">{errors.service}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="budget">Estimated Budget</label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                  >
                    <option value="">Select budget range</option>
                    {budgetRanges.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="timeline">Project Timeline</label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                  >
                    <option value="">Select timeline</option>
                    {timelines.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="projectType">Property Type</label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                  >
                    <option value="">Select property type</option>
                    <option value="single-family">Single Family Home</option>
                    <option value="condo">Condo/Apartment</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="message">Tell Us About Your Project *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={errors.message ? 'error' : ''}
                  rows="6"
                  placeholder="Please describe your remodeling project, including any specific requirements or ideas you have..."
                ></textarea>
                {errors.message && <span className="error-message">{errors.message}</span>}
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>

          {/* Why Choose Us Section */}
          <div className="why-choose-section">
            <h2 className="section-title">Why Choose Us?</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">⚡</div>
                <h3>Fast Response</h3>
                <p>We respond to all inquiries within 24 hours, guaranteed.</p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">💰</div>
                <h3>Free Estimates</h3>
                <p>Get a detailed, no-obligation quote for your project.</p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">🏆</div>
                <h3>Quality Work</h3>
                <p>Backed by our satisfaction guarantee and warranty.</p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">👥</div>
                <h3>Expert Team</h3>
                <p>Licensed, insured professionals with years of experience.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;