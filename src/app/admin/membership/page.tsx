'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminMembership from '@/components/membership/AdminMembership';

export default function AdminMembershipPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <AdminMembership />
        </div>
      </div>
    </ProtectedRoute>
  );
}