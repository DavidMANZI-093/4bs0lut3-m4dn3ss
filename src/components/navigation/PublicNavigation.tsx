'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Activity, Ticket, Store, Users, MessageCircle } from 'lucide-react';

export default function PublicNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const publicRoutes = [
    { name: 'Live Scoreboard', href: '/scoreboard', icon: <Activity className="w-4 h-4" /> },
    { name: 'Game Tickets', href: '/tickets', icon: <Ticket className="w-4 h-4" /> },
    { name: 'Team Store', href: '/store', icon: <Store className="w-4 h-4" /> },
    { name: 'Memberships', href: '/membership', icon: <Users className="w-4 h-4" /> },
    { name: 'Live Chat', href: '/chat', icon: <MessageCircle className="w-4 h-4" /> },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-orange-600">
                <Activity className="w-6 h-6 mr-2" />
                4bs0lut3-m4dn3ss
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {publicRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <span>{route.icon}</span>
                <span>{route.name}</span>
              </Link>
            ))}
            <Link
              href="/auth/login"
              className="bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-700 transition-colors"
            >
              Admin Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-orange-600 focus:outline-none focus:text-orange-600"
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
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {publicRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{route.icon}</span>
                  <span>{route.name}</span>
                </Link>
              ))}
              <Link
                href="/auth/login"
                className="bg-orange-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-orange-700 transition-colors text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}