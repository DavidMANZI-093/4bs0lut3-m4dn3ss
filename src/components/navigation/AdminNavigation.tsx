'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import UserProfile from '@/components/auth/UserProfile';
import { BarChart3, Activity, Ticket, Store, Users, MessageCircle, Monitor, Play } from 'lucide-react';

export default function AdminNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  const adminRoutes = [
    { name: 'Dashboard', href: '/admin', icon: <BarChart3 className="w-4 h-4" /> },
    { name: 'Live Stream', href: '/admin/livestream', icon: <Play className="w-4 h-4" /> },
    { name: 'Scoreboard', href: '/admin/scoreboard', icon: <Activity className="w-4 h-4" /> },
    { name: 'Tickets', href: '/admin/tickets', icon: <Ticket className="w-4 h-4" /> },
    { name: 'Store', href: '/admin/store', icon: <Store className="w-4 h-4" /> },
    { name: 'Membership', href: '/admin/membership', icon: <Users className="w-4 h-4" /> },
    { name: 'Chat', href: '/admin/chat', icon: <MessageCircle className="w-4 h-4" /> },
  ];

  // Add developer-only routes
  if (user?.role === 'DEVELOPER') {
    adminRoutes.push({ name: 'Dev Tools', href: '/admin/dev', icon: <Monitor className="w-4 h-4" /> });
  }

  return (
    <nav className="bg-[var(--primary)] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/admin" className="flex items-center">
              <span className="text-xl font-bold text-[var(--warning)] flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                4bs0lut3-m4dn3ss Admin
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {adminRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="flex items-center space-x-1 text-[var(--space-cadet-800)] hover:text-[var(--warning)] px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <span>{route.icon}</span>
                <span>{route.name}</span>
              </Link>
            ))}
            <div className="ml-4">
              <UserProfile />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[var(--space-cadet-800)] hover:text-[var(--warning)] focus:outline-none focus:text-[var(--warning)]"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-[var(--space-cadet-600)]">
              {adminRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className="flex items-center space-x-2 text-[var(--space-cadet-800)] hover:text-[var(--warning)] hover:bg-[var(--space-cadet-600)] block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{route.icon}</span>
                  <span>{route.name}</span>
                </Link>
              ))}
              <div className="px-3 py-2">
                <UserProfile showFullProfile={true} />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}