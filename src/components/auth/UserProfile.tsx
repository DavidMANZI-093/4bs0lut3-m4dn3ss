'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext'
import { User, Monitor } from 'lucide-react';

interface UserProfileProps {
  showFullProfile?: boolean;
  className?: string;
}

export default function UserProfile({ showFullProfile = false, className = '' }: UserProfileProps) {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <User className="w-4 h-4" />;
      case 'DEVELOPER':
        return <Monitor className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800';
      case 'DEVELOPER':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (showFullProfile) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-3">{getRoleIcon(user.role)}</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{user.email}</h3>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
            {user.role}
          </span>
          <div className="mt-4 text-sm text-gray-500">
            <p>Session expires: {new Date(user.expiresAt).toLocaleString()}</p>
            {user.lastActivity && (
              <p>Last activity: {new Date(user.lastActivity).toLocaleString()}</p>
            )}
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
      >
        <span className="text-lg">{getRoleIcon(user.role)}</span>
        <span className="hidden sm:block">{user.email}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-20">
            <div className="p-4 border-b border-gray-200">
              <p className="font-medium text-gray-900">{user.email}</p>
              <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                {user.role}
              </span>
            </div>
            <div className="p-2 text-xs text-gray-500">
              <p>Expires: {new Date(user.expiresAt).toLocaleString()}</p>
              {user.lastActivity && (
                <p>Last activity: {new Date(user.lastActivity).toLocaleString()}</p>
              )}
            </div>
            <div className="p-2 border-t border-gray-200">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}