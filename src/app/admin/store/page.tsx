'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminStore from '@/components/store/AdminStore';

export default function AdminStorePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <AdminStore />
        </div>
      </div>
    </ProtectedRoute>
  );
}