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

export default function AdminTickets() {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
    const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL')

    useEffect(() => {
        fetchTickets()
    }, [])

    useEffect(() => {
        // Filter tickets based on status
        if (!Array.isArray(tickets)) {
            setFilteredTickets([])
            return
        }
        
        if (filter === 'ALL') {
            setFilteredTickets(tickets)
        } else {
            setFilteredTickets(tickets.filter(ticket => ticket.status === filter))
        }
    }, [tickets, filter])

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

    const updateTicketStatus = async (ticketId: string, status: 'OPEN' | 'CLOSED') => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/tickets/${ticketId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            })
            const data = await response.json()
            if (data.success) {
                await fetchTickets()
                setSelectedTicket(null)
            }
        } catch (error) {
            console.error('Failed to update ticket:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        return status === 'OPEN' ? 'bg-[var(--isabelline-700)] text-[var(--success)]' : 'bg-[var(--pale-dogwood-900)] text-[var(--text-secondary)]'
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
                <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Ticket className="w-6 h-6" />
                  Ticket Management Admin
                </h2>
                <div className="text-sm text-[var(--text-secondary)]">
                    Total Tickets: {tickets?.length || 0}
                </div>
            </div>

            {/* Filters */}
            <div className="flex space-x-2">
                {(['ALL', 'OPEN', 'CLOSED'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg transition-colors ${filter === status
                            ? 'bg-[var(--primary)] text-white'
                            : 'bg-[var(--pale-dogwood-200)] text-[var(--text-secondary)] hover:bg-[var(--pale-dogwood-300)]'
                            }`}
                    >
                        {status} ({status === 'ALL' ? (tickets?.length || 0) : (tickets?.filter(t => t.status === status)?.length || 0)})
                    </button>
                ))}
            </div>

            {/* Ticket Details Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Ticket Management</h3>
                            <button
                                onClick={() => setSelectedTicket(null)}
                                className="text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-[var(--text-primary)]">{selectedTicket.title}</h4>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                                    {selectedTicket.status}
                                </span>
                            </div>
                            <div>
                                <p className="text-[var(--text-secondary)]">{selectedTicket.description}</p>
                            </div>
                            <div className="text-sm text-[var(--text-muted)]">
                                <p>Created: {formatDate(selectedTicket.createdAt)}</p>
                                <p>Updated: {formatDate(selectedTicket.updatedAt)}</p>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => updateTicketStatus(selectedTicket.id, selectedTicket.status === 'OPEN' ? 'CLOSED' : 'OPEN')}
                                    disabled={isLoading}
                                    className={`px-4 py-2 rounded-lg transition-colors ${selectedTicket.status === 'OPEN'
                                        ? 'bg-[var(--error)] text-white hover:bg-red-700'
                                        : 'bg-[var(--success)] text-white hover:bg-green-700'
                                        } disabled:opacity-50`}
                                >
                                    {selectedTicket.status === 'OPEN' ? 'Close Ticket' : 'Reopen Ticket'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tickets List */}
            <div className="space-y-3">
                {filteredTickets.length === 0 ? (
                    <div className="text-center py-8 text-[var(--text-muted)]">
                        No tickets found for the selected filter.
                    </div>
                ) : (
                    filteredTickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            onClick={() => setSelectedTicket(ticket)}
                            className="bg-[var(--surface)] p-4 rounded-lg card-shadow border border-[var(--border)] cursor-pointer hover:border-[var(--primary)] transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3">
                                        <h3 className="font-semibold text-[var(--text-primary)]">{ticket.title}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <p className="text-[var(--text-secondary)] mt-1 line-clamp-2">{ticket.description}</p>
                                    <p className="text-sm text-[var(--text-muted)] mt-2">
                                        Created {formatDate(ticket.createdAt)}
                                    </p>
                                </div>
                                <div className="ml-4">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            updateTicketStatus(ticket.id, ticket.status === 'OPEN' ? 'CLOSED' : 'OPEN')
                                        }}
                                        disabled={isLoading}
                                        className={`px-3 py-1 rounded text-sm transition-colors ${ticket.status === 'OPEN'
                                            ? 'bg-[var(--rose-quartz-900)] text-[var(--error)] hover:bg-[var(--rose-quartz-800)]'
                                            : 'bg-[var(--isabelline-700)] text-[var(--success)] hover:bg-[var(--isabelline-600)]'
                                            } disabled:opacity-50`}
                                    >
                                        {ticket.status === 'OPEN' ? 'Close' : 'Reopen'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}