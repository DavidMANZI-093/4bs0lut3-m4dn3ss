'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import AdminLiveStream from '@/components/livestream/AdminLiveStream'

export default function AdminLiveStreamPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[var(--background)] py-8">
        <div className="container mx-auto px-4">
          <AdminLiveStream />
        </div>
      </div>
    </ProtectedRoute>
  )
}