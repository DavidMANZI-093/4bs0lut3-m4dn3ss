'use client';

import Link from 'next/link';
import { Activity, Ticket, Store, Users, MessageCircle, BarChart3, Play } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[var(--surface)] rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <Ticket className="w-5 h-5" />
                  Ticketing System
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">Manage game tickets and sales</p>
                <Link 
                  href="/admin/tickets"
                  className="inline-block bg-[var(--primary)] text-white px-4 py-2 rounded-md hover:bg-[var(--primary-hover)] transition-colors"
                >
                  Manage Tickets
                </Link>
              </div>

              <div className="bg-[var(--surface)] rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Live Stream
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">Manage YouTube live streams</p>
                <Link 
                  href="/admin/livestream"
                  className="inline-block bg-[var(--primary)] text-white px-4 py-2 rounded-md hover:bg-[var(--primary-hover)] transition-colors"
                >
                  Manage Stream
                </Link>
              </div>

              <div className="bg-[var(--surface)] rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Scoreboard
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">Control live game scores</p>
                <Link 
                  href="/admin/scoreboard"
                  className="inline-block bg-[var(--warning)] text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
                >
                  Manage Games
                </Link>
              </div>

              <div className="bg-[var(--surface)] rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  Team Store
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">Manage products and orders</p>
                <Link 
                  href="/admin/store"
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Manage Store
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Memberships
                </h3>
                <p className="text-gray-600 mb-4">Manage fan memberships</p>
                <Link 
                  href="/admin/membership"
                  className="inline-block bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Manage Members
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Live Chat
                </h3>
                <p className="text-gray-600 mb-4">Moderate game chat</p>
                <Link 
                  href="/admin/chat"
                  className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Moderate Chat
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Analytics
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">View system metrics</p>
                <Link 
                  href="/admin/dev"
                  className="inline-block bg-[var(--text-secondary)] text-white px-4 py-2 rounded-md hover:bg-[var(--ultra-violet-600)] transition-colors"
                >
                  View Analytics
                </Link>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}