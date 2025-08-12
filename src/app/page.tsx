export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Five Systems Challenge
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">🎫 Ticketing System</h2>
          <p className="text-gray-600 mb-4">Manage support tickets with status tracking</p>
          <div className="space-y-2 text-sm">
            <div><code>GET /api/tickets</code> - List tickets</div>
            <div><code>POST /api/tickets</code> - Create ticket</div>
            <div><code>PATCH /api/tickets/[id]</code> - Update status</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">🏀 Basketball Scoreboard</h2>
          <p className="text-gray-600 mb-4">Real-time score tracking with WebSocket updates</p>
          <div className="space-y-2 text-sm">
            <div><code>GET /api/score</code> - Get current score</div>
            <div><code>POST /api/score/update</code> - Update score</div>
            <div><code>POST /api/score</code> - Reset score</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">🛍️ E-commerce</h2>
          <p className="text-gray-600 mb-4">Product catalog and shopping cart functionality</p>
          <div className="space-y-2 text-sm">
            <div><code>GET /api/products</code> - List products</div>
            <div><code>GET /api/cart</code> - View cart</div>
            <div><code>POST /api/cart/add</code> - Add to cart</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">📧 Subscription System</h2>
          <p className="text-gray-600 mb-4">Email subscription management with validation</p>
          <div className="space-y-2 text-sm">
            <div><code>POST /api/subscribe</code> - Subscribe email</div>
            <div><code>GET /api/subscribers</code> - List subscribers</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">💬 Live Stream Chat</h2>
          <p className="text-gray-600 mb-4">Real-time chat with message persistence</p>
          <div className="space-y-2 text-sm">
            <div><code>WebSocket Events:</code></div>
            <div>• <code>message:send</code> - Send message</div>
            <div>• <code>message:broadcast</code> - Receive messages</div>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">🚀 Getting Started</h2>
          <div className="space-y-2 text-sm text-blue-700">
            <div>1. Run database migrations</div>
            <div>2. Seed with sample data</div>
            <div>3. Start WebSocket server</div>
            <div>4. Test APIs with Postman</div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <h3 className="text-2xl font-semibold mb-4">Quick Commands</h3>
        <div className="bg-gray-100 p-4 rounded-lg text-left max-w-2xl mx-auto">
          <div className="space-y-2 font-mono text-sm">
            <div><span className="text-blue-600">npm run db:push</span> - Push schema to database</div>
            <div><span className="text-blue-600">npm run db:seed</span> - Seed with sample data</div>
            <div><span className="text-blue-600">npm run socket</span> - Start WebSocket server</div>
            <div><span className="text-blue-600">npm run dev</span> - Start Next.js development server</div>
          </div>
        </div>
      </div>
    </main>
  )
}