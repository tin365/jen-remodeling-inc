'use client'

import React from 'react';
import Link from 'next/link';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-background">
          <div className="hero-image-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-headline">Quality Home Remodeling You Can Trust</h1>
            <p className="hero-subtext">
              With years of experience and a commitment to craftsmanship, JEN Remodeling transforms 
              houses into homes. Trusted by families throughout the region for quality workmanship 
              and exceptional service.
            </p>
            <div className="hero-buttons">
              <Link href="/projects" className="btn btn-primary">View Our Projects</Link>
              <Link href="/contact" className="btn btn-secondary">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <span className="section-label">About JEN Remodeling</span>
              <h2 className="section-title">Craftsmanship You Can Trust</h2>
              <p className="about-description">
                JEN Remodeling Inc has been serving homeowners for years, bringing expertise, 
                attention to detail, and quality craftsmanship to every project. We specialize 
                in transforming kitchens, bathrooms, basements, and living spaces into beautiful, 
                functional areas that reflect your style and enhance your daily life.
              </p>
              <p className="about-description">
                Our team of skilled professionals works closely with you throughout the entire 
                process, ensuring that your vision becomes reality. From initial consultation 
                to final walkthrough, we're committed to excellence and your complete satisfaction.
              </p>
              <div className="about-features">
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span className="feature-text">Licensed & Insured</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span className="feature-text">Quality Guaranteed</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span className="feature-text">Free Consultations</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span className="feature-text">Satisfaction Assured</span>
                </div>
              </div>
            </div>
            <div className="about-image">
              <div className="image-placeholder">
                <span>Professional Remodeling Team</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Project Section */}
      <section className="featured-project-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Our Work</span>
            <h2 className="section-title">Featured Project</h2>
            <p className="section-subtitle">
              See how we transformed this kitchen into a modern, functional space
            </p>
          </div>
          <div className="featured-project">
            <div className="project-images">
              <div className="project-image-wrapper before">
                <img 
                  src="https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop" 
                  alt="Before - Kitchen Remodel"
                  className="project-image"
                />
                <div className="image-label">BEFORE</div>
              </div>
              <div className="project-image-wrapper after">
                <img 
                  src="https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=800&h=600&fit=crop" 
                  alt="After - Kitchen Remodel"
                  className="project-image"
                />
                <div className="image-label">AFTER</div>
              </div>
            </div>
            <div className="project-details">
              <h3 className="project-title">Contemporary Kitchen Renovation</h3>
              <p className="project-description">
                Complete kitchen overhaul with new cabinets, quartz countertops, and modern appliances. 
                This transformation created a spacious, functional kitchen that serves as the heart of 
                the home. The design combines style with practicality, featuring custom storage solutions 
                and energy-efficient fixtures.
              </p>
              <div className="project-features">
                <span className="project-tag">Kitchen Remodeling</span>
                <span className="project-tag">Custom Cabinets</span>
                <span className="project-tag">Quartz Countertops</span>
              </div>
              <Link href="/projects" className="btn btn-primary">View All Projects</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section">
        <div className="container">
          <div className="testimonial-content">
            <div className="testimonial-quote">
              <span className="quote-mark">"</span>
              <p className="testimonial-text">
                Absolutely amazing transformation! Our kitchen went from outdated to stunning. 
                The team was professional, punctual, and the attention to detail was exceptional. 
                We couldn't be happier with the results. Highly recommend JEN Remodeling!
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">SJ</div>
                <div className="author-info">
                  <h4 className="author-name">Sarah Johnson</h4>
                  <p className="author-location">Kitchen Remodeling Project</p>
                </div>
              </div>
              <div className="testimonial-rating">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Home?</h2>
            <p className="cta-description">
              Let's discuss your remodeling project. Get a free consultation and see how we can 
              bring your vision to life with quality craftsmanship and exceptional service.
            </p>
            <div className="cta-buttons">
              <Link href="/contact" className="btn btn-primary">Get Free Consultation</Link>
              <Link href="/projects" className="btn btn-secondary">View Our Portfolio</Link>
            </div>
            <div className="cta-contact-info">
              <div className="contact-item">
                <span className="contact-label">Call Us</span>
                <a href="tel:+1234567890" className="contact-value">(123) 456-7890</a>
              </div>
              <div className="contact-item">
                <span className="contact-label">Email</span>
                <a href="mailto:info@jenremodeling.com" className="contact-value">info@jenremodeling.com</a>
              </div>
              <div className="contact-item">
                <span className="contact-label">Hours</span>
                <span className="contact-value">Mon-Fri: 8AM - 6PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
