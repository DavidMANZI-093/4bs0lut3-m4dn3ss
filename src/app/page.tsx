export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-2">
            Five Systems Challenge
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto">
            A comprehensive backend implementation featuring 5 distinct systems built with Next.js, TypeScript, and PostgreSQL
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Systems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg card-shadow border border-gray-200 hover:border-blue-300 transition-colors">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">🎫</span>
              <h2 className="text-xl font-semibold text-gray-900">Ticketing System</h2>
            </div>
            <p className="text-gray-700 mb-4">Manage support tickets with status tracking and updates</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <code className="text-gray-800">GET /api/tickets</code> - List tickets
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <code className="text-gray-800">POST /api/tickets</code> - Create ticket
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <code className="text-gray-800">PATCH /api/tickets/[id]</code> - Update status
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg card-shadow border border-gray-200 hover:border-orange-300 transition-colors">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">🏀</span>
              <h2 className="text-xl font-semibold text-gray-900">Basketball Scoreboard</h2>
            </div>
            <p className="text-gray-700 mb-4">Real-time score tracking with WebSocket updates</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <code className="text-gray-800">GET /api/score</code> - Get current score
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <code className="text-gray-800">POST /api/score/update</code> - Update score
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <code className="text-gray-800">POST /api/score</code> - Reset score
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg card-shadow border border-gray-200 hover:border-purple-300 transition-colors">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">🛍️</span>
              <h2 className="text-xl font-semibold text-gray-900">E-commerce</h2>
            </div>
            <p className="text-gray-700 mb-4">Product catalog and shopping cart functionality</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <code className="text-gray-800">GET /api/products</code> - List products
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <code className="text-gray-800">GET /api/cart</code> - View cart
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <code className="text-gray-800">POST /api/cart/add</code> - Add to cart
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg card-shadow border border-gray-200 hover:border-green-300 transition-colors">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">📧</span>
              <h2 className="text-xl font-semibold text-gray-900">Subscription System</h2>
            </div>
            <p className="text-gray-700 mb-4">Email subscription management with validation</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <code className="text-gray-800">POST /api/subscribe</code> - Subscribe email
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <code className="text-gray-800">GET /api/subscribers</code> - List subscribers
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg card-shadow border border-gray-200 hover:border-indigo-300 transition-colors">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">💬</span>
              <h2 className="text-xl font-semibold text-gray-900">Live Stream Chat</h2>
            </div>
            <p className="text-gray-700 mb-4">Real-time chat with message persistence</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <code className="text-gray-800">WebSocket Events:</code>
              </div>
              <div className="flex items-center ml-4">
                <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                <code className="text-gray-800">message:send</code> - Send message
              </div>
              <div className="flex items-center ml-4">
                <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                <code className="text-gray-800">message:broadcast</code> - Receive messages
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200 card-shadow">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">🚀</span>
              <h2 className="text-xl font-semibold text-blue-900">Getting Started</h2>
            </div>
            <div className="space-y-3 text-sm text-blue-800">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-blue-200 text-blue-900 rounded-full flex items-center justify-center text-xs font-bold mr-3">1</span>
                Run database migrations
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 bg-blue-200 text-blue-900 rounded-full flex items-center justify-center text-xs font-bold mr-3">2</span>
                Seed with sample data
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 bg-blue-200 text-blue-900 rounded-full flex items-center justify-center text-xs font-bold mr-3">3</span>
                Start WebSocket server
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 bg-blue-200 text-blue-900 rounded-full flex items-center justify-center text-xs font-bold mr-3">4</span>
                Test APIs with Postman
              </div>
            </div>
          </div>
        </div>

        {/* Quick Commands Section */}
        <div className="bg-white rounded-lg card-shadow border border-gray-200 p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Quick Commands</h3>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-blue-600 font-mono font-semibold">npm run db:push</span>
                  <span className="text-gray-600 ml-3">- Push schema to database</span>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-600 font-mono font-semibold">npm run db:seed</span>
                  <span className="text-gray-600 ml-3">- Seed with sample data</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-blue-600 font-mono font-semibold">npm run socket</span>
                  <span className="text-gray-600 ml-3">- Start WebSocket server</span>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-600 font-mono font-semibold">npm run dev</span>
                  <span className="text-gray-600 ml-3">- Start Next.js server</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 border border-green-300 rounded-full">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            <span className="text-green-800 font-semibold">All Systems Operational</span>
          </div>
        </div>
      </div>
    </main>
  )
}