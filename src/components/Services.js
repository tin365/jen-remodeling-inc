import React, { useEffect } from 'react';
import './Services.css';

function Services() {
    useEffect(() => {
        // Scroll animation
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div>
            <section className="hero">
                <div className="hero-content">
                    <h1>Transform Your Home</h1>
                    <p>Expert remodeling services for every room in your house. Quality craftsmanship, stunning results.</p>
                    <div className="cta-buttons">
                        <a href="#contact" className="btn btn-primary">Get Free Estimate</a>
                        <a href="tel:+1234567890" className="btn btn-secondary">Call Now</a>
                    </div>
                </div>
            </section>

            {/* Basement Remodeling */}
            <section className="service-section basement-section">
                <div className="service-content fade-in">
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
                        <a href="#contact" className="btn btn-primary">Start Your Project</a>
                    </div>
                    <div className="service-image-container">
                        <div className="image-placeholder">
                            Basement Remodeling<br />Before & After Gallery
                        </div>
                    </div>
                </div>
            </section>

            {/* Bathroom Remodeling */}
            <section className="service-section bathroom-section">
                <div className="service-content fade-in">
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
                        <a href="#contact" className="btn btn-primary">Start Your Project</a>
                    </div>
                    <div className="service-image-container">
                        <div className="image-placeholder">
                            Bathroom Remodeling<br />Before & After Gallery
                        </div>
                    </div>
                </div>
            </section>

            {/* Kitchen Remodeling */}
            <section className="service-section kitchen-section">
                <div className="service-content fade-in">
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
                        <a href="#contact" className="btn btn-primary">Start Your Project</a>
                    </div>
                    <div className="service-image-container">
                        <div className="image-placeholder">
                            Kitchen Remodeling<br />Before & After Gallery
                        </div>
                    </div>
                </div>
            </section>

            {/* Living Room Remodeling */}
            <section className="service-section living-room-section">
                <div className="service-content fade-in">
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
                        <a href="#contact" className="btn btn-primary">Start Your Project</a>
                    </div>
                    <div className="service-image-container">
                        <div className="image-placeholder">
                            Living Room Remodeling<br />Before & After Gallery
                        </div>
                    </div>
                </div>
            </section>

            {/* Indoor Remodeling & Replacement */}
            <section className="service-section indoor-section">
                <div className="service-content fade-in">
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
                        <a href="#contact" className="btn btn-primary">Start Your Project</a>
                    </div>
                    <div className="service-image-container">
                        <div className="image-placeholder">
                            Indoor Remodeling<br />Before & After Gallery
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section" id="contact">
                <h2>Ready to Transform Your Home?</h2>
                <p>Get a free consultation and estimate today. Let's discuss your vision and bring it to life.</p>
                <div className="cta-buttons">
                    <a href="#" className="btn btn-primary">Schedule Free Consultation</a>
                </div>
                <div className="contact-info">
                    <div className="contact-item">
                        <h3>Call Us</h3>
                        <p><a href="tel:+1234567890">(123) 456-7890</a></p>
                    </div>
                    <div className="contact-item">
                        <h3>Email</h3>
                        <p><a href="mailto:info@yourremodeling.com">info@yourremodeling.com</a></p>
                    </div>
                    <div className="contact-item">
                        <h3>Hours</h3>
                        <p>Mon-Fri: 8AM - 6PM</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Services;