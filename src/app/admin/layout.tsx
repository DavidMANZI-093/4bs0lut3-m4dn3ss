import ProtectedRoute from '@/components/ProtectedRoute'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <nav className="flex space-x-6">
                <a href="/admin/scoreboard" className="text-blue-600 hover:text-blue-800">Scoreboard</a>
                <a href="/admin/tickets" className="text-blue-600 hover:text-blue-800">Tickets</a>
                <a href="/admin/store" className="text-blue-600 hover:text-blue-800">Store</a>
                <a href="/admin/membership" className="text-blue-600 hover:text-blue-800">Membership</a>
                <a href="/admin/chat" className="text-blue-600 hover:text-blue-800">Chat</a>
                <a href="/admin/dev" className="text-blue-600 hover:text-blue-800">Dev Status</a>
              </nav>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}