'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

export default function LayoutSwitcher({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? ''
  const isChromeLess = pathname.includes('/admin') || pathname.includes('/brand-preview')

  if (isChromeLess) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
