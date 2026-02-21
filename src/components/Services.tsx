import React from 'react'
import Link from 'next/link'

interface ServiceItem {
  number: string
  title: string
  description: string
  features: string[]
  icon: string
}

const servicesData: ServiceItem[] = [
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
  },
]

const btn = 'inline-block py-2 px-4 text-sm no-underline border border-ink cursor-pointer font-[inherit]'
const btnPrimary = 'bg-ink text-paper hover:bg-ink-light hover:border-ink-light'
const btnSecondary = 'bg-transparent text-ink hover:bg-ink hover:text-paper'

export default function Services() {
  return (
    <div className="w-full min-h-screen bg-paper">
      <section className="py-8 sm:py-12 px-4 sm:px-6 text-center border-b border-rule-light">
        <div className="max-w-content mx-auto">
          <h1 className="text-[clamp(1.5rem,4vw,2.25rem)] mb-3">Transform Your Home</h1>
          <p className="mb-6">Expert remodeling services for every room in your house. Quality craftsmanship, stunning results.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:flex-row sm:flex-nowrap">
            <Link href="/contact" className={`${btn} ${btnPrimary}`}>Get Free Estimate</Link>
            <a href="tel:+60174398540" className={`${btn} ${btnSecondary}`}>Call Now</a>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-content mx-auto px-4 sm:px-6">
          {servicesData.map((service, index) => (
            <div
              key={index}
              className={`border-b border-rule-light py-8 ${index === 0 ? 'pt-0' : ''}`}
            >
              <div className="mb-4">
                <div className="border border-rule py-8 text-center text-sm text-ink-light">
                  <span className="block text-2xl mb-2">{service.icon}</span>
                  <span className="font-bold text-ink">{service.title}</span>
                </div>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-ink-light mb-1">
                  {service.number} — Services
                </span>
                <h2 className="text-xl mb-2">{service.title}</h2>
                <p className="mb-4">{service.description}</p>
                <ul className="list-none p-0 m-0 mb-4 space-y-1 text-sm pl-5">
                  {service.features.map((feature, i) => (
                    <li key={i} className="relative before:content-['·'] before:absolute before:left-0 before:font-bold before:text-ink">
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className={`${btn} ${btnPrimary}`}>Start Your Project</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-8 sm:py-12 px-4 sm:px-6 text-center border-t border-rule">
        <div className="max-w-content mx-auto">
          <h2 className="text-2xl mb-3">Ready to Transform Your Home?</h2>
          <p className="mb-6">Get a free consultation and estimate today. Let&apos;s discuss your vision and bring it to life.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className={`${btn} ${btnPrimary}`}>Schedule Free Consultation</Link>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-6 max-w-[540px] mx-auto text-center mt-8">
            <div>
              <div className="text-2xl block mb-2">📞</div>
              <h3 className="text-xs uppercase tracking-wider font-normal text-ink-light mb-1">Call Us</h3>
              <p className="text-sm text-ink"><a href="tel:+60174398540">+60 17-439 8540</a></p>
            </div>
            <div>
              <div className="text-2xl block mb-2">✉️</div>
              <h3 className="text-xs uppercase tracking-wider font-normal text-ink-light mb-1">Email</h3>
              <p className="text-sm text-ink"><a href="mailto:info@jenremodeling.com">info@jenremodeling.com</a></p>
            </div>
            <div>
              <div className="text-2xl block mb-2">🕐</div>
              <h3 className="text-xs uppercase tracking-wider font-normal text-ink-light mb-1">Hours</h3>
              <p className="text-sm text-ink">Mon-Fri: 8AM - 6PM</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
