'use client'

import dynamic from 'next/dynamic'

const AdminPageClient = dynamic(() => import('./AdminPageClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f0e6]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-amber-300 border-t-amber-700 rounded-full animate-spin" />
        <span className="text-stone-600 text-sm">Loading...</span>
      </div>
    </div>
  ),
})

export default function AdminPage() {
  return <AdminPageClient />
}
