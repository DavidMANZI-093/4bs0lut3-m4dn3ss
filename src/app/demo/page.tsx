import BasketballScoreboard from '@/components/BasketballScoreboard'
import LiveChat from '@/components/LiveChat'
import ProductCatalog from '@/components/ProductCatalog'
import TicketingDashboard from '@/components/TicketingDashboard'
import SubscriptionManager from '@/components/SubscriptionManager'

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
            🚀 Five Systems Demo
          </h1>
          <p className="text-lg text-gray-600 text-center">
            Interactive demos of all 5 systems with real-time functionality
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Basketball Scoreboard */}
        <section>
          <BasketballScoreboard />
        </section>

        {/* Live Chat */}
        <section>
          <LiveChat />
        </section>

        {/* Product Catalog */}
        <section>
          <ProductCatalog />
        </section>

        {/* Ticketing Dashboard */}
        <section>
          <TicketingDashboard />
        </section>

        {/* Subscription Manager */}
        <section>
          <SubscriptionManager />
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>Five Systems Challenge - Phase 2A: Enhanced User Experience</p>
        </div>
      </footer>
    </main>
  )
}