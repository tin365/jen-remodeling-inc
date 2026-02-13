import type { Metadata } from 'next'
import '../styles/globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
