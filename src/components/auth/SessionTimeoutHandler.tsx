'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function SessionTimeoutHandler() {
  const { user, logout, refreshSession } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!user) return;

    const checkSessionExpiry = () => {
      const expiresAt = new Date(user.expiresAt);
      const now = new Date();
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();
      
      // Show warning 10 minutes before expiry
      const warningTime = 10 * 60 * 1000; // 10 minutes in milliseconds
      
      if (timeUntilExpiry <= warningTime && timeUntilExpiry > 0) {
        setShowWarning(true);
        setTimeLeft(Math.ceil(timeUntilExpiry / 1000 / 60)); // minutes
      } else if (timeUntilExpiry <= 0) {
        // Session expired
        handleSessionExpired();
      } else {
        setShowWarning(false);
      }
    };

    // Check immediately
    checkSessionExpiry();

    // Check every minute
    const interval = setInterval(checkSessionExpiry, 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

  const handleSessionExpired = async () => {
    setShowWarning(false);
    await logout();
    alert('Your session has expired. Please log in again.');
  };

  const handleExtendSession = async () => {
    try {
      await refreshSession();
      setShowWarning(false);
    } catch (error) {
      console.error('Failed to extend session:', error);
      handleSessionExpired();
    }
  };

  const handleLogoutNow = async () => {
    setShowWarning(false);
    await logout();
  };

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
        <div className="text-center">
          <div className="text-yellow-500 text-4xl mb-4">⏰</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Session Expiring Soon
          </h3>
          <p className="text-gray-600 mb-4">
            Your session will expire in {timeLeft} minute{timeLeft !== 1 ? 's' : ''}. 
            Would you like to extend your session?
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleExtendSession}
              className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors"
            >
              Extend Session
            </button>
            <button
              onClick={handleLogoutNow}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              Logout Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}