import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin | JEN Remodeling Inc',
  description: 'Admin dashboard',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f0e6] text-stone-800 font-serif">
      {children}
    </div>
  )
}
