import Services from '@/components/Services'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services - Home Remodeling Services | JEN Remodeling Inc',
  description: 'Professional remodeling services including basement, bathroom, kitchen, and living room renovations. Quality craftsmanship and exceptional service.',
}

export default function ServicesPage() {
  return <Services />
}
