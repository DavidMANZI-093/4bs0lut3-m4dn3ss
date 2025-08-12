import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { updateTicketStatusSchema, idSchema } from '@/lib/validations'
import { successResponse, errorResponse, validationErrorResponse, withErrorHandling } from '@/lib/utils'

// GET /api/tickets/[id] - Get a specific ticket
export const GET = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const validation = idSchema.safeParse(params.id)
  if (!validation.success) {
    return errorResponse('Invalid ticket ID')
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: validation.data }
  })

  if (!ticket) {
    return errorResponse('Ticket not found', 404)
  }

  return successResponse(ticket)
})

// PATCH /api/tickets/[id] - Update ticket status
export const PATCH = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const idValidation = idSchema.safeParse(params.id)
  if (!idValidation.success) {
    return errorResponse('Invalid ticket ID')
  }

  const body = await request.json()
  const validation = updateTicketStatusSchema.safeParse(body)
  if (!validation.success) {
    return validationErrorResponse(validation.error)
  }

  const ticket = await prisma.ticket.update({
    where: { id: idValidation.data },
    data: { status: validation.data.status }
  })

  return successResponse(ticket, 'Ticket status updated successfully')
})