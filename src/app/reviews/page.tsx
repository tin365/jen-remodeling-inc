import Reviews from '@/components/Reviews'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reviews - Client Testimonials | JEN Remodeling Inc',
  description: 'Read what our clients say about their remodeling experience. Real reviews from satisfied homeowners who transformed their spaces with JEN Remodeling.',
}

export default function ReviewsPage() {
  return <Reviews />
}
