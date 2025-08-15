import LoginForm from '@/components/auth/LoginForm'
import { Activity } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <Activity className="w-6 h-6 inline mr-2" />
            4bs0lut3-m4dn3ss
          </h1>
          <p className="text-gray-600">Basketball Team Platform</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm redirectTo="/admin" />
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Need access? Contact your system administrator.
        </p>
      </div>
    </div>
  );
}