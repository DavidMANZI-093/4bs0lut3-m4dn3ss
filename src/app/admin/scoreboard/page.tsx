'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminScoreboard from '@/components/scoreboard/AdminScoreboard';

export default function AdminScoreboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <AdminScoreboard />
        </div>
      </div>
    </ProtectedRoute>
  );
}