import React from 'react'
import Link from 'next/link'

export default function Landing() {
  return (
    <div className="min-h-screen w-full bg-paper">
      <section className="py-12">
        <div className="container">
          <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] mb-4 leading-tight">
            Quality Home Remodeling You Can Trust
          </h1>
          <p className="text-base mb-6 leading-[1.7]">
            With years of experience and a commitment to craftsmanship, JEN Remodeling transforms
            houses into homes. Trusted by families throughout the region for quality workmanship
            and exceptional service.
          </p>
          <p className="text-base">
            <Link href="/projects">View Our Projects</Link>
            <span className="mx-2 text-rule-light">·</span>
            <Link href="/contact">Contact Us</Link>
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <p className="text-xs uppercase tracking-widest text-ink-light mb-2">
            About JEN Remodeling
          </p>
          <h2 className="text-[clamp(1.5rem,3vw,2rem)] mb-6">
            Craftsmanship You Can Trust
          </h2>
          <p className="mb-4">
            JEN Remodeling Inc has been serving homeowners for years, bringing expertise,
            attention to detail, and quality craftsmanship to every project. We specialize
            in transforming kitchens, bathrooms, basements, and living spaces into beautiful,
            functional areas that reflect your style and enhance your daily life.
          </p>
          <p className="mb-4">
            Our team of skilled professionals works closely with you throughout the entire
            process, ensuring that your vision becomes reality. From initial consultation
            to final walkthrough, we are committed to excellence and your complete satisfaction.
          </p>
          <p className="text-sm text-ink-light mt-6">
            Licensed & Insured · Quality Guaranteed · Free Consultations · Satisfaction Assured
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <p className="text-xs uppercase tracking-widest text-ink-light mb-2">
            Our Work
          </p>
          <h2 className="text-[clamp(1.5rem,3vw,2rem)] mb-6">
            Featured Project
          </h2>
          <p className="mb-6">
            See how we transformed this kitchen into a modern, functional space.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="border border-rule">
              <img
                src="https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop"
                alt="Before — Kitchen Remodel"
                className="w-full h-auto block"
              />
              <span className="block py-2 px-2 text-xs uppercase tracking-wider border-t border-rule text-center">
                Before
              </span>
            </div>
            <div className="border border-rule">
              <img
                src="https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=800&h=600&fit=crop"
                alt="After — Kitchen Remodel"
                className="w-full h-auto block"
              />
              <span className="block py-2 px-2 text-xs uppercase tracking-wider border-t border-rule text-center">
                After
              </span>
            </div>
          </div>
          <h3 className="mt-4 mb-2">
            Contemporary Kitchen Renovation
          </h3>
          <p className="mb-4">
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

      <section className="py-12">
        <div className="container">
          <blockquote className="m-0 p-0 border-none">
            <p className="italic mb-4">
              Absolutely amazing transformation! Our kitchen went from outdated to stunning.
              The team was professional, punctual, and the attention to detail was exceptional.
              We could not be happier with the results. Highly recommend JEN Remodeling!
            </p>
            <footer className="text-sm text-ink-light">
              — Sarah Johnson, <cite className="not-italic">Kitchen Remodeling Project</cite>
            </footer>
          </blockquote>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <h2 className="mb-3">
            Ready to Transform Your Home?
          </h2>
          <p className="mb-4">
            Get a free consultation. Let us discuss your remodeling project and bring your
            vision to life with quality craftsmanship and exceptional service.
          </p>
          <p className="mb-4">
            <Link href="/contact">Get Free Consultation</Link>
            <span className="mx-2 text-rule-light">·</span>
            <Link href="/projects">View Our Portfolio</Link>
          </p>
          <p className="text-sm text-ink-light mt-4">
            Call (123) 456-7890 · info@jenremodeling.com · Mon–Fri 8AM–6PM
          </p>
        </div>
      </section>
    </div>
  )
}
