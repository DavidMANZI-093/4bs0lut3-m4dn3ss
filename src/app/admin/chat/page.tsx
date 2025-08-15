'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminChat from '@/components/chat/AdminChat';

export default function AdminChatPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[var(--background)] py-8">
        <div className="container mx-auto px-4">
          <AdminChat />
        </div>
      </div>
    </ProtectedRoute>
  );
}