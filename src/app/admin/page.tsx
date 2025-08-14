'use client';

import UserProfile from '@/components/UserProfile';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                🏀 Admin Dashboard
              </h1>
            </div>
            <UserProfile />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">🎫 Ticketing System</h3>
                <p className="text-gray-600 mb-4">Manage game tickets and sales</p>
                <Link 
                  href="/admin/tickets"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Manage Tickets
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">🏀 Scoreboard</h3>
                <p className="text-gray-600 mb-4">Control live game scores</p>
                <Link 
                  href="/admin/scoreboard"
                  className="inline-block bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
                >
                  Manage Games
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">🛍️ Team Store</h3>
                <p className="text-gray-600 mb-4">Manage products and orders</p>
                <Link 
                  href="/admin/store"
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Manage Store
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">👥 Memberships</h3>
                <p className="text-gray-600 mb-4">Manage fan memberships</p>
                <Link 
                  href="/admin/membership"
                  className="inline-block bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Manage Members
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">💬 Live Chat</h3>
                <p className="text-gray-600 mb-4">Moderate game chat</p>
                <Link 
                  href="/admin/chat"
                  className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Moderate Chat
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">📊 Analytics</h3>
                <p className="text-gray-600 mb-4">View system metrics</p>
                <Link 
                  href="/admin/dev"
                  className="inline-block bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  View Analytics
                </Link>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
}