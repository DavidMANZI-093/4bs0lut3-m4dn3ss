'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminTickets from '@/components/tickets/AdminTickets';

export default function AdminTicketsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <AdminTickets />
        </div>
      </div>
    </ProtectedRoute>
  );
}