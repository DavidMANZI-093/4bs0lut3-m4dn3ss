'use client'

import { useState, useEffect } from 'react'
import { Ticket, X } from 'lucide-react'

interface Ticket {
    id: string
    title: string
    description: string
    status: 'OPEN' | 'CLOSED'
    createdAt: string
    updatedAt: string
}

export default function PublicTickets() {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

    // Form state
    const [newTicket, setNewTicket] = useState({
        title: '',
        description: ''
    })

    useEffect(() => {
        fetchTickets()
    }, [])

    const fetchTickets = async () => {
        try {
            const response = await fetch('/api/tickets')
            const data = await response.json()
            if (data.success) {
                // Handle both old format (data.data as array) and new format (data.data.tickets)
                const ticketsData = Array.isArray(data.data) ? data.data : data.data?.tickets || []
                setTickets(ticketsData)
            }
        } catch (error) {
            console.error('Failed to fetch tickets:', error)
            setTickets([]) // Ensure tickets is always an array
        }
    }

    const createTicket = async () => {
        if (!newTicket.title.trim() || !newTicket.description.trim()) return

        setIsLoading(true)
        try {
            const response = await fetch('/api/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTicket),
            })
            const data = await response.json()
            if (data.success) {
                await fetchTickets()
                setNewTicket({ title: '', description: '' })
                setShowCreateForm(false)
            }
        } catch (error) {
            console.error('Failed to create ticket:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        return status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Ticket className="w-6 h-6" />
                    Game Ticket Booking
                </h2>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Book Game Ticket
                </button>
            </div>

            {/* Create Ticket Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Book Game Ticket</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event</label>
                                <input
                                    type="text"
                                    value={newTicket.title}
                                    onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter game/event name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                                <textarea
                                    value={newTicket.description}
                                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Any special seating requests or notes"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={createTicket}
                                    disabled={isLoading || !newTicket.title.trim() || !newTicket.description.trim()}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                    Book Ticket
                                </button>
                                <button
                                    onClick={() => setShowCreateForm(false)}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Ticket Details Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Ticket Details</h3>
                            <button
                                onClick={() => setSelectedTicket(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-gray-900">{selectedTicket.title}</h4>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                                    {selectedTicket.status}
                                </span>
                            </div>
                            <div>
                                <p className="text-gray-700">{selectedTicket.description}</p>
                            </div>
                            <div className="text-sm text-gray-500">
                                <p>Booked: {formatDate(selectedTicket.createdAt)}</p>
                                <p>Updated: {formatDate(selectedTicket.updatedAt)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* My Tickets List */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">My Ticket Bookings</h3>
                {tickets.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No tickets booked yet. Book your first game ticket!
                    </div>
                ) : (
                    tickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            onClick={() => setSelectedTicket(ticket)}
                            className="bg-white p-4 rounded-lg card-shadow border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3">
                                        <h3 className="font-semibold text-gray-900">{ticket.title}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mt-1 line-clamp-2">{ticket.description}</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Booked {formatDate(ticket.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}