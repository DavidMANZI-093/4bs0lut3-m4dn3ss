import Link from 'next/link';
import { Activity, Ticket, ShoppingBag, Users, MessageCircle, Settings } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[var(--space-cadet)] via-[var(--ultra-violet)] to-[var(--rose-quartz)] -mx-4 -mt-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Welcome to 4bs0lut3-m4dn3ss
            </h1>
            <p className="text-xl md:text-2xl text-[var(--isabelline-800)] mb-8 max-w-3xl mx-auto">
              Your ultimate basketball team platform featuring live scores, tickets, merchandise, memberships, and fan chat
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/scoreboard"
                className="bg-white text-[var(--primary)] px-8 py-3 rounded-lg font-semibold hover:bg-[var(--isabelline-600)] transition-colors flex items-center justify-center gap-2"
              >
                <Activity className="w-5 h-5" />
                Watch Live Game
              </Link>
              <Link
                href="/tickets"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[var(--primary)] transition-colors flex items-center justify-center gap-2"
              >
                <Ticket className="w-5 h-5" />
                Get Tickets
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
            Everything You Need for Basketball
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            From live game updates to exclusive merchandise, we've got your basketball experience covered
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Live Scoreboard */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-[var(--border)]">
            <div className="text-[var(--primary)] mb-4">
              <Activity className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Live Scoreboard</h3>
            <p className="text-[var(--text-secondary)] mb-4">
              Follow every game with real-time score updates and live game information.
            </p>
            <Link 
              href="/scoreboard" 
              className="inline-block bg-[var(--primary)] text-white px-4 py-2 rounded-md hover:bg-[var(--primary-hover)] transition-colors"
            >
              Watch Live →
            </Link>
          </div>

          {/* Game Tickets */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-[var(--border)]">
            <div className="text-[var(--secondary)] mb-4">
              <Ticket className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Game Tickets</h3>
            <p className="text-[var(--text-secondary)] mb-4">
              Secure your seats for upcoming games with our easy ticket purchasing system.
            </p>
            <Link 
              href="/tickets" 
              className="inline-block bg-[var(--secondary)] text-white px-4 py-2 rounded-md hover:bg-[var(--ultra-violet-600)] transition-colors"
            >
              Buy Tickets →
            </Link>
          </div>

          {/* Team Store */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-[var(--border)]">
            <div className="text-[var(--accent)] mb-4">
              <ShoppingBag className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Team Store</h3>
            <p className="text-[var(--text-secondary)] mb-4">
              Show your team spirit with official merchandise and exclusive gear.
            </p>
            <Link 
              href="/store" 
              className="inline-block bg-[var(--accent)] text-white px-4 py-2 rounded-md hover:bg-[var(--rose-quartz-400)] transition-colors"
            >
              Shop Now →
            </Link>
          </div>

          {/* Fan Memberships */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-[var(--border)]">
            <div className="text-[var(--pale-dogwood-400)] mb-4">
              <Users className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Fan Memberships</h3>
            <p className="text-[var(--text-secondary)] mb-4">
              Join our exclusive membership program for special perks and benefits.
            </p>
            <Link 
              href="/membership" 
              className="inline-block bg-[var(--pale-dogwood-400)] text-white px-4 py-2 rounded-md hover:bg-[var(--pale-dogwood-300)] transition-colors"
            >
              Join Now →
            </Link>
          </div>

          {/* Live Chat */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-[var(--border)]">
            <div className="text-[var(--secondary)] mb-4">
              <MessageCircle className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Live Game Chat</h3>
            <p className="text-[var(--text-secondary)] mb-4">
              Connect with fellow fans during games with our live chat feature.
            </p>
            <Link 
              href="/chat" 
              className="inline-block bg-[var(--secondary)] text-white px-4 py-2 rounded-md hover:bg-[var(--ultra-violet-600)] transition-colors"
            >
              Join Chat →
            </Link>
          </div>

          {/* Admin Access */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-[var(--primary)]">
            <div className="text-[var(--primary)] mb-4">
              <Settings className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Admin Access</h3>
            <p className="text-[var(--text-secondary)] mb-4">
              Team administrators can manage all systems from dedicated admin panels.
            </p>
            <Link 
              href="/auth/login" 
              className="inline-block bg-[var(--primary)] text-white px-4 py-2 rounded-md hover:bg-[var(--primary-hover)] transition-colors"
            >
              Admin Login →
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[var(--surface)] -mx-4 px-4 py-16 mb-8 border-y border-[var(--border)]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
            Platform Statistics
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--primary)] mb-2">5</div>
            <div className="text-[var(--text-secondary)]">Integrated Systems</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--primary)] mb-2">15+</div>
            <div className="text-[var(--text-secondary)]">API Endpoints</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--primary)] mb-2">Real-time</div>
            <div className="text-[var(--text-secondary)]">Live Updates</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--primary)] mb-2">24/7</div>
            <div className="text-[var(--text-secondary)]">System Uptime</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[var(--space-cadet)] text-white -mx-4 -mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--isabelline-800)] mb-4 flex items-center justify-center gap-2">
              <Activity className="w-6 h-6" />
              4bs0lut3-m4dn3ss
            </div>
            <p className="text-[var(--space-cadet-800)] mb-6">
              Professional basketball team platform with integrated systems
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/scoreboard" className="text-[var(--space-cadet-800)] hover:text-white transition-colors">Live Scores</Link>
              <Link href="/tickets" className="text-[var(--space-cadet-800)] hover:text-white transition-colors">Tickets</Link>
              <Link href="/store" className="text-[var(--space-cadet-800)] hover:text-white transition-colors">Store</Link>
              <Link href="/membership" className="text-[var(--space-cadet-800)] hover:text-white transition-colors">Memberships</Link>
              <Link href="/chat" className="text-[var(--space-cadet-800)] hover:text-white transition-colors">Chat</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}