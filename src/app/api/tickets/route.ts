import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { createTicketSchema } from '@/lib/validations'
import { successResponse, errorResponse, validationErrorResponse, withErrorHandling } from '@/lib/utils'

// GET /api/tickets - List all tickets (sorted newest first)
export const GET = withErrorHandling(async () => {
  const tickets = await prisma.ticket.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })

  return successResponse(tickets, `Found ${tickets.length} tickets`)
})

// POST /api/tickets - Create a new ticket
export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json()
  
  const validation = createTicketSchema.safeParse(body)
  if (!validation.success) {
    return validationErrorResponse(validation.error)
  }

  const ticket = await prisma.ticket.create({
    data: validation.data
  })

  return successResponse(ticket, 'Ticket created successfully')
})