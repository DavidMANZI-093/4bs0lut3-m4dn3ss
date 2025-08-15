import PublicScoreboard from '@/components/scoreboard/PublicScoreboard'
import PublicChat from '@/components/chat/PublicChat'
import PublicStore from '@/components/store/PublicStore'
import PublicTickets from '@/components/tickets/PublicTickets'
import PublicMembership from '@/components/membership/PublicMembership'
import { Activity } from 'lucide-react'

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--warning)] to-[var(--primary)] text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-2">
            <Activity className="w-8 h-8 inline mr-3" />
            4bs0lut3-m4dn3ss Platform Demo
          </h1>
          <p className="text-lg text-center opacity-90">
            Interactive basketball team platform with live features
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Basketball Scoreboard */}
        <section>
          <PublicScoreboard />
        </section>

        {/* Live Chat */}
        <section>
          <PublicChat />
        </section>

        {/* Product Catalog */}
        <section>
          <PublicStore />
        </section>

        {/* Ticketing Dashboard */}
        <section>
          <PublicTickets />
        </section>

        {/* Membership Manager */}
        <section>
          <PublicMembership />
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-[var(--surface)] border-t border-[var(--border)] mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-[var(--text-secondary)]">
          <p className="flex items-center justify-center gap-2">
            <Activity className="w-4 h-4" />
            4bs0lut3-m4dn3ss Basketball Team Platform - MVP Demo
          </p>
        </div>
      </footer>
    </main>
  )
}