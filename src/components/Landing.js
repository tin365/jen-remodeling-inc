'use client'

import React from 'react';
import Link from 'next/link';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="container">
          <h1 className="hero-headline">Quality Home Remodeling You Can Trust</h1>
          <p className="hero-subtext">
            With years of experience and a commitment to craftsmanship, JEN Remodeling transforms
            houses into homes. Trusted by families throughout the region for quality workmanship
            and exceptional service.
          </p>
          <p className="hero-links">
            <Link href="/projects">View Our Projects</Link>
            <span className="sep">·</span>
            <Link href="/contact">Contact Us</Link>
          </p>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <p className="section-label">About JEN Remodeling</p>
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
            to final walkthrough, we are committed to excellence and your complete satisfaction.
          </p>
          <p className="about-features">
            Licensed & Insured · Quality Guaranteed · Free Consultations · Satisfaction Assured
          </p>
        </div>
      </section>

      <section className="featured-project-section">
        <div className="container">
          <p className="section-label">Our Work</p>
          <h2 className="section-title">Featured Project</h2>
          <p className="section-subtitle">
            See how we transformed this kitchen into a modern, functional space.
          </p>
          <div className="project-images">
            <div className="project-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop"
                alt="Before — Kitchen Remodel"
                className="project-image"
              />
              <span className="image-caption">Before</span>
            </div>
            <div className="project-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=800&h=600&fit=crop"
                alt="After — Kitchen Remodel"
                className="project-image"
              />
              <span className="image-caption">After</span>
            </div>
          </div>
          <h3 className="project-title">Contemporary Kitchen Renovation</h3>
          <p className="project-description">
            Complete kitchen overhaul with new cabinets, quartz countertops, and modern appliances.
            This transformation created a spacious, functional kitchen that serves as the heart of
            the home. The design combines style with practicality, featuring custom storage solutions
            and energy-efficient fixtures.
          </p>
          <p>
            <Link href="/projects">View All Projects</Link>
          </p>
        </div>
      </section>

      <section className="testimonial-section">
        <div className="container">
          <blockquote className="testimonial-quote">
            <p className="testimonial-text">
              Absolutely amazing transformation! Our kitchen went from outdated to stunning.
              The team was professional, punctual, and the attention to detail was exceptional.
              We could not be happier with the results. Highly recommend JEN Remodeling!
            </p>
            <footer className="testimonial-author">
              — Sarah Johnson, <cite>Kitchen Remodeling Project</cite>
            </footer>
          </blockquote>
        </div>
      </section>

      <section className="final-cta-section">
        <div className="container">
          <h2 className="cta-title">Ready to Transform Your Home?</h2>
          <p className="cta-description">
            Get a free consultation. Let us discuss your remodeling project and bring your
            vision to life with quality craftsmanship and exceptional service.
          </p>
          <p className="cta-links">
            <Link href="/contact">Get Free Consultation</Link>
            <span className="sep">·</span>
            <Link href="/projects">View Our Portfolio</Link>
          </p>
          <p className="cta-contact">
            Call (123) 456-7890 · info@jenremodeling.com · Mon–Fri 8AM–6PM
          </p>
        </div>
      </section>
    </div>
  );
};

export default Landing;
