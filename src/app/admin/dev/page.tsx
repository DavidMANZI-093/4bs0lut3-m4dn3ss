'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Settings, BarChart3, Database, FileText, Wifi, TestTube } from 'lucide-react';

export default function DeveloperDashboard() {
  return (
    <ProtectedRoute requiredRole="DEVELOPER">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[var(--surface)] rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  System Status
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">Monitor system health</p>
                <button className="bg-[var(--success)] text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                  View Status
                </button>
              </div>

              <div className="bg-[var(--surface)] rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  API Metrics
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">API performance and usage</p>
                <button className="bg-[var(--primary)] text-white px-4 py-2 rounded-md hover:bg-[var(--primary-hover)] transition-colors">
                  View Metrics
                </button>
              </div>

              <div className="bg-[var(--surface)] rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Database
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">Database administration</p>
                <button className="bg-[var(--ultra-violet)] text-white px-4 py-2 rounded-md hover:bg-[var(--ultra-violet-600)] transition-colors">
                  Open Prisma Studio
                </button>
              </div>

              <div className="bg-[var(--surface)] rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Logs
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">System and error logs</p>
                <button className="bg-[var(--warning)] text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors">
                  View Logs
                </button>
              </div>

              <div className="bg-[var(--surface)] rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <Wifi className="w-5 h-5" />
                  WebSocket
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">Real-time connections</p>
                <button className="bg-[var(--accent)] text-white px-4 py-2 rounded-md hover:bg-[var(--rose-quartz-600)] transition-colors">
                  Monitor Connections
                </button>
              </div>

              <div className="bg-[var(--surface)] rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <TestTube className="w-5 h-5" />
                  Testing
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">Run test suites</p>
                <button className="bg-[var(--text-secondary)] text-white px-4 py-2 rounded-md hover:bg-[var(--ultra-violet-600)] transition-colors">
                  Run Tests
                </button>
              </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}