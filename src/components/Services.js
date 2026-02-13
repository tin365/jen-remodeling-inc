'use client'

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import './Services.css';

function Services() {
    const [visibleSections, setVisibleSections] = useState(new Set());
    const sectionRefs = useRef([]);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = sectionRefs.current.indexOf(entry.target);
                    if (index !== -1) {
                        setVisibleSections(prev => new Set([...prev, index]));
                    }
                }
            });
        }, observerOptions);

        sectionRefs.current.forEach(el => {
            if (el) observer.observe(el);
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    const addToRefs = (el) => {
        if (el && !sectionRefs.current.includes(el)) {
            sectionRefs.current.push(el);
        }
    };

    return (
        <div className="services-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Transform Your Home</h1>
                    <p>Expert remodeling services for every room in your house. Quality craftsmanship, stunning results.</p>
                    <div className="cta-buttons">
                        <Link href="/contact" className="btn btn-primary">Get Free Estimate</Link>
                        <a href="tel:+1234567890" className="btn btn-secondary">Call Now</a>
                    </div>
                </div>
            </section>

            {/* Basement Remodeling */}
            <section className="service-section basement-section">
                <div className={`service-content ${visibleSections.has(0) ? 'visible' : ''}`} ref={el => { addToRefs(el); if (el) el.dataset.index = '0'; }}>
                    <div className="service-text">
                        <span className="service-number">01 — Services</span>
                        <h2>Basement Remodeling</h2>
                        <p>Turn your unused basement into a functional, beautiful living space. Whether you envision a home theater, guest suite, home office, or entertainment area, we bring your basement dreams to life.</p>
                        <ul className="service-features">
                            <li>Complete basement finishing and refinishing</li>
                            <li>Waterproofing and moisture control</li>
                            <li>Custom lighting and electrical work</li>
                            <li>Built-in storage solutions</li>
                            <li>Egress windows and safety compliance</li>
                        </ul>
                        <Link href="/contact" className="btn btn-primary">Start Your Project</Link>
                    </div>
                    <div className="service-image-container">
                        <div className="image-placeholder basement-image">
                            <div className="placeholder-icon">🏠</div>
                            <div className="placeholder-text">Basement Remodeling</div>
                            <div className="placeholder-subtext">Before & After Gallery</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bathroom Remodeling */}
            <section className="service-section bathroom-section">
                <div className={`service-content ${visibleSections.has(1) ? 'visible' : ''}`} ref={el => { addToRefs(el); if (el) el.dataset.index = '1'; }}>
                    <div className="service-text">
                        <span className="service-number">02 — Services</span>
                        <h2>Bathroom Remodeling</h2>
                        <p>Create your perfect bathroom oasis. From modern spa-like retreats to classic elegant designs, we handle everything from fixtures to flooring with precision and care.</p>
                        <ul className="service-features">
                            <li>Complete bathroom renovations</li>
                            <li>Walk-in showers and luxury tubs</li>
                            <li>Custom vanities and countertops</li>
                            <li>Tile installation and flooring</li>
                            <li>Modern plumbing and fixtures</li>
                        </ul>
                        <Link href="/contact" className="btn btn-primary">Start Your Project</Link>
                    </div>
                    <div className="service-image-container">
                        <div className="image-placeholder bathroom-image">
                            <div className="placeholder-icon">🚿</div>
                            <div className="placeholder-text">Bathroom Remodeling</div>
                            <div className="placeholder-subtext">Before & After Gallery</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Kitchen Remodeling */}
            <section className="service-section kitchen-section">
                <div className={`service-content ${visibleSections.has(2) ? 'visible' : ''}`} ref={el => { addToRefs(el); if (el) el.dataset.index = '2'; }}>
                    <div className="service-text">
                        <span className="service-number">03 — Services</span>
                        <h2>Kitchen Remodeling</h2>
                        <p>The kitchen is the heart of your home. We design and build kitchens that blend functionality with stunning aesthetics, creating spaces where memories are made.</p>
                        <ul className="service-features">
                            <li>Custom cabinet design and installation</li>
                            <li>Countertop replacement (granite, quartz, marble)</li>
                            <li>Kitchen island construction</li>
                            <li>Backsplash and tile work</li>
                            <li>Appliance installation and layout optimization</li>
                        </ul>
                        <Link href="/contact" className="btn btn-primary">Start Your Project</Link>
                    </div>
                    <div className="service-image-container">
                        <div className="image-placeholder kitchen-image">
                            <div className="placeholder-icon">🍳</div>
                            <div className="placeholder-text">Kitchen Remodeling</div>
                            <div className="placeholder-subtext">Before & After Gallery</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Living Room Remodeling */}
            <section className="service-section living-room-section">
                <div className={`service-content ${visibleSections.has(3) ? 'visible' : ''}`} ref={el => { addToRefs(el); if (el) el.dataset.index = '3'; }}>
                    <div className="service-text">
                        <span className="service-number">04 — Services</span>
                        <h2>Living Room Remodeling</h2>
                        <p>Design a living space that reflects your style and enhances your lifestyle. From open concept transformations to cozy traditional spaces, we make your vision reality.</p>
                        <ul className="service-features">
                            <li>Floor plan redesign and wall removal</li>
                            <li>Hardwood and luxury flooring installation</li>
                            <li>Built-in shelving and entertainment centers</li>
                            <li>Fireplace installation and updates</li>
                            <li>Crown molding and architectural details</li>
                        </ul>
                        <Link href="/contact" className="btn btn-primary">Start Your Project</Link>
                    </div>
                    <div className="service-image-container">
                        <div className="image-placeholder living-room-image">
                            <div className="placeholder-icon">🛋️</div>
                            <div className="placeholder-text">Living Room Remodeling</div>
                            <div className="placeholder-subtext">Before & After Gallery</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Indoor Remodeling & Replacement */}
            <section className="service-section indoor-section">
                <div className={`service-content ${visibleSections.has(4) ? 'visible' : ''}`} ref={el => { addToRefs(el); if (el) el.dataset.index = '4'; }}>
                    <div className="service-text">
                        <span className="service-number">05 — Services</span>
                        <h2>Complete Indoor Remodeling</h2>
                        <p>Comprehensive interior renovations and replacement services for any room in your home. We handle everything from flooring to lighting, paint to trim work.</p>
                        <ul className="service-features">
                            <li>Flooring replacement (hardwood, tile, carpet)</li>
                            <li>Interior painting and wallpaper</li>
                            <li>Window and door replacement</li>
                            <li>Drywall repair and installation</li>
                            <li>Complete home interior renovations</li>
                        </ul>
                        <Link href="/contact" className="btn btn-primary">Start Your Project</Link>
                    </div>
                    <div className="service-image-container">
                        <div className="image-placeholder indoor-image">
                            <div className="placeholder-icon">✨</div>
                            <div className="placeholder-text">Indoor Remodeling</div>
                            <div className="placeholder-subtext">Before & After Gallery</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-container">
                    <h2>Ready to Transform Your Home?</h2>
                    <p>Get a free consultation and estimate today. Let's discuss your vision and bring it to life.</p>
                    <div className="cta-buttons">
                        <Link href="/contact" className="btn btn-primary">Schedule Free Consultation</Link>
                    </div>
                    <div className="contact-info">
                        <div className="contact-item">
                            <div className="contact-icon">📞</div>
                            <h3>Call Us</h3>
                            <p><a href="tel:+1234567890">(123) 456-7890</a></p>
                        </div>
                        <div className="contact-item">
                            <div className="contact-icon">✉️</div>
                            <h3>Email</h3>
                            <p><a href="mailto:info@jenremodeling.com">info@jenremodeling.com</a></p>
                        </div>
                        <div className="contact-item">
                            <div className="contact-icon">🕐</div>
                            <h3>Hours</h3>
                            <p>Mon-Fri: 8AM - 6PM</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Services;
