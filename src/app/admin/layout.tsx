import ProtectedRoute from '@/components/auth/ProtectedRoute'
import AdminNavigation from '@/components/navigation/AdminNavigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[var(--background)]">
        <AdminNavigation />
        <main>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}