'use client';

import { useState, useEffect } from 'react';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
}

export default function PublicTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets');
      if (response.ok) {
        const result = await response.json();
        // Handle API response format: {success: true, data: {tickets: [...], pagination: {...}}}
        const ticketsArray = result.data?.tickets || [];
        // Only show available tickets to public
        setTickets(ticketsArray.filter((ticket: Ticket) => ticket.status === 'OPEN'));
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (title: string) => {
    // Simple price mapping based on ticket type
    if (title.toLowerCase().includes('courtside') || title.toLowerCase().includes('premium')) {
      return '$299';
    } else if (title.toLowerCase().includes('finals') || title.toLowerCase().includes('playoff')) {
      return '$199';
    } else if (title.toLowerCase().includes('family')) {
      return '$89';
    } else {
      return '$149';
    }
  };

  const getTicketCategory = (title: string) => {
    if (title.toLowerCase().includes('courtside') || title.toLowerCase().includes('premium')) {
      return 'Premium';
    } else if (title.toLowerCase().includes('finals') || title.toLowerCase().includes('playoff')) {
      return 'Playoff';
    } else if (title.toLowerCase().includes('family')) {
      return 'Family';
    } else {
      return 'Regular';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading available tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🎫 Game Tickets
            </h1>
            <p className="text-lg text-gray-600">
              Get your tickets for 4bs0lut3-m4dn3ss basketball games
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tickets Available</h3>
            <p className="text-gray-600">Check back soon for upcoming games!</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Games</h2>
              <p className="text-gray-600">
                {tickets.length} game{tickets.length !== 1 ? 's' : ''} available for purchase
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {getTicketCategory(ticket.title)}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {ticket.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {ticket.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-orange-600">
                        {formatPrice(ticket.title)}
                      </div>
                      <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors">
                        Select Tickets
                      </button>
                    </div>
                    
                    <div className="mt-3 text-xs text-gray-500">
                      Listed {new Date(ticket.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Ticket Details Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedTicket.title}
                  </h2>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Available Now
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                      {getTicketCategory(selectedTicket.title)}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-4">
                    {selectedTicket.description}
                  </p>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Ticket Details</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Mobile tickets delivered instantly</li>
                      <li>• Secure entry with QR code</li>
                      <li>• Refundable up to 24 hours before game</li>
                      <li>• Concession discounts included</li>
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-orange-600">
                        {formatPrice(selectedTicket.title)}
                      </div>
                      <div className="text-sm text-gray-500">per ticket</div>
                    </div>
                    <div className="space-x-3">
                      <button
                        onClick={() => setSelectedTicket(null)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors">
                        Purchase Tickets
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              Contact our ticket office for group sales, accessibility seating, or special requests.
            </p>
            <div className="flex justify-center space-x-4">
              <a href="tel:555-TICKETS" className="text-orange-600 hover:text-orange-700">
                📞 Call: 555-TICKETS
              </a>
              <a href="mailto:tickets@4bs0lut3-m4dn3ss.com" className="text-orange-600 hover:text-orange-700">
                ✉️ Email Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}