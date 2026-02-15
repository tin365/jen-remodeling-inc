import type { Metadata } from 'next'
import '../styles/globals.css'
import LayoutSwitcher from '@/components/LayoutSwitcher'

export const metadata: Metadata = {
  title: 'JEN Remodeling Inc - Professional Home Remodeling Services',
  description: 'Quality home remodeling services. Expert craftsmanship for kitchens, bathrooms, basements, and living rooms. Trusted remodeling experts with years of experience.',
  keywords: 'home remodeling, kitchen remodeling, bathroom remodeling, basement remodeling, home renovation, remodeling contractor',
  authors: [{ name: 'JEN Remodeling Inc' }],
  openGraph: {
    title: 'JEN Remodeling Inc - Professional Home Remodeling',
    description: 'Transform your home with quality remodeling services',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = { width: 'device-width', initialScale: 1 }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
        <LayoutSwitcher>{children}</LayoutSwitcher>
      </body>
    </html>
  )
}
