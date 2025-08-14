import PublicTickets from '@/components/tickets/PublicTickets'

export default function TicketsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <PublicTickets />
      </div>
    </div>
  )
}