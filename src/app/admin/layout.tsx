import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin | JEN Remodeling Inc',
  description: 'Admin dashboard',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {children}
    </div>
  )
}
