import PublicNavigation from '@/components/PublicNavigation';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Welcome to 4bs0lut3-m4dn3ss
            </h1>
            <p className="text-xl md:text-2xl text-orange-200 mb-8 max-w-3xl mx-auto">
              Your ultimate basketball team platform featuring live scores, tickets, merchandise, memberships, and fan chat
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/scoreboard/public"
                className="bg-white text-orange-900 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
              >
                🏀 Watch Live Game
              </Link>
              <Link
                href="/tickets/public"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-900 transition-colors"
              >
                🎫 Get Tickets
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need for Basketball
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From live game updates to exclusive merchandise, we've got your basketball experience covered
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Live Scoreboard */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🏀</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Live Scoreboard</h3>
            <p className="text-gray-600 mb-4">
              Follow every game with real-time score updates and live game information.
            </p>
            <Link 
              href="/scoreboard/public" 
              className="inline-block bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
            >
              Watch Live →
            </Link>
          </div>

          {/* Game Tickets */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎫</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Game Tickets</h3>
            <p className="text-gray-600 mb-4">
              Secure your seats for upcoming games with our easy ticket purchasing system.
            </p>
            <Link 
              href="/tickets/public" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Buy Tickets →
            </Link>
          </div>

          {/* Team Store */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🛍️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Store</h3>
            <p className="text-gray-600 mb-4">
              Show your team spirit with official merchandise and exclusive gear.
            </p>
            <Link 
              href="/store/public" 
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Shop Now →
            </Link>
          </div>

          {/* Fan Memberships */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fan Memberships</h3>
            <p className="text-gray-600 mb-4">
              Join our exclusive membership program for special perks and benefits.
            </p>
            <Link 
              href="/membership/public" 
              className="inline-block bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
            >
              Join Now →
            </Link>
          </div>

          {/* Live Chat */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Live Game Chat</h3>
            <p className="text-gray-600 mb-4">
              Connect with fellow fans during games with our live chat feature.
            </p>
            <Link 
              href="/chat/public" 
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Join Chat →
            </Link>
          </div>

          {/* Admin Access */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-orange-200">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Admin Access</h3>
            <p className="text-gray-600 mb-4">
              Team administrators can manage all systems from dedicated admin panels.
            </p>
            <Link 
              href="/auth/login" 
              className="inline-block bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Admin Login →
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Platform Statistics
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">5</div>
              <div className="text-gray-600">Integrated Systems</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">15+</div>
              <div className="text-gray-600">API Endpoints</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">Real-time</div>
              <div className="text-gray-600">Live Updates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">System Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500 mb-4">
              🏀 4bs0lut3-m4dn3ss
            </div>
            <p className="text-gray-400 mb-6">
              Professional basketball team platform with integrated systems
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/scoreboard/public" className="text-gray-400 hover:text-white">Live Scores</Link>
              <Link href="/tickets/public" className="text-gray-400 hover:text-white">Tickets</Link>
              <Link href="/store/public" className="text-gray-400 hover:text-white">Store</Link>
              <Link href="/membership/public" className="text-gray-400 hover:text-white">Memberships</Link>
              <Link href="/chat/public" className="text-gray-400 hover:text-white">Chat</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}