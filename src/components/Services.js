'use client'

import React from 'react';
import Link from 'next/link';
import './Services.css';

const servicesData = [
    {
        number: '01',
        title: 'Basement Remodeling',
        description: 'Turn your unused basement into a functional, beautiful living space. Whether you envision a home theater, guest suite, home office, or entertainment area, we bring your basement dreams to life.',
        features: [
            'Complete basement finishing and refinishing',
            'Waterproofing and moisture control',
            'Custom lighting and electrical work',
            'Built-in storage solutions',
            'Egress windows and safety compliance',
        ],
        icon: '🏠',
        imageClass: 'basement-image',
    },
    {
        number: '02',
        title: 'Bathroom Remodeling',
        description: 'Create your perfect bathroom oasis. From modern spa-like retreats to classic elegant designs, we handle everything from fixtures to flooring with precision and care.',
        features: [
            'Complete bathroom renovations',
            'Walk-in showers and luxury tubs',
            'Custom vanities and countertops',
            'Tile installation and flooring',
            'Modern plumbing and fixtures',
        ],
        icon: '🚿',
        imageClass: 'bathroom-image',
    },
    {
        number: '03',
        title: 'Kitchen Remodeling',
        description: 'The kitchen is the heart of your home. We design and build kitchens that blend functionality with stunning aesthetics, creating spaces where memories are made.',
        features: [
            'Custom cabinet design and installation',
            'Countertop replacement (granite, quartz, marble)',
            'Kitchen island construction',
            'Backsplash and tile work',
            'Appliance installation and layout optimization',
        ],
        icon: '🍳',
        imageClass: 'kitchen-image',
    },
    {
        number: '04',
        title: 'Living Room Remodeling',
        description: 'Design a living space that reflects your style and enhances your lifestyle. From open concept transformations to cozy traditional spaces, we make your vision reality.',
        features: [
            'Floor plan redesign and wall removal',
            'Hardwood and luxury flooring installation',
            'Built-in shelving and entertainment centers',
            'Fireplace installation and updates',
            'Crown molding and architectural details',
        ],
        icon: '🛋️',
        imageClass: 'living-room-image',
    },
    {
        number: '05',
        title: 'Complete Indoor Remodeling',
        description: 'Comprehensive interior renovations and replacement services for any room in your home. We handle everything from flooring to lighting, paint to trim work.',
        features: [
            'Flooring replacement (hardwood, tile, carpet)',
            'Interior painting and wallpaper',
            'Window and door replacement',
            'Drywall repair and installation',
            'Complete home interior renovations',
        ],
        icon: '✨',
        imageClass: 'indoor-image',
    },
];

function Services() {
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

            {/* Services Grid */}
            <section className="services-grid-section">
                <div className="services-grid">
                    {servicesData.map((service, index) => (
                        <div className="service-card" key={index}>
                            <div className="service-card-image-container">
                                <div className={`image-placeholder ${service.imageClass}`}>
                                    <div className="placeholder-icon">{service.icon}</div>
                                    <div className="placeholder-text">{service.title}</div>
                                </div>
                            </div>
                            <div className="service-card-content">
                                <span className="service-number">{service.number} — Services</span>
                                <h2>{service.title}</h2>
                                <p>{service.description}</p>
                                <ul className="service-features">
                                    {service.features.map((feature, i) => (
                                        <li key={i}>{feature}</li>
                                    ))}
                                </ul>
                                <Link href="/contact" className="btn btn-primary">Start Your Project</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-container">
                    <h2>Ready to Transform Your Home?</h2>
                    <p>Get a free consultation and estimate today. Let&apos;s discuss your vision and bring it to life.</p>
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
