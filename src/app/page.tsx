import Landing from '@/components/Landing'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home - JEN Remodeling Inc',
  description: 'Quality home remodeling you can trust. Transform your kitchen, bathroom, basement, and living spaces with expert craftsmanship.',
}

export default function Home() {
  return <Landing />
}
