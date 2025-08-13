import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { successResponse, validationErrorResponse, withErrorHandling } from '@/lib/utils'

const bulkUpdateSchema = z.object({
  ticketIds: z.array(z.string().cuid()).min(1, 'At least one ticket ID is required'),
  status: z.enum(['OPEN', 'CLOSED'])
})

// POST /api/tickets/bulk-update - Update multiple ticket statuses
export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json()
  
  const validation = bulkUpdateSchema.safeParse(body)
  if (!validation.success) {
    return validationErrorResponse(validation.error)
  }

  const { ticketIds, status } = validation.data

  // Update multiple tickets
  const result = await prisma.ticket.updateMany({
    where: {
      id: {
        in: ticketIds
      }
    },
    data: {
      status
    }
  })

  return successResponse({
    updatedCount: result.count,
    status
  }, `Updated ${result.count} tickets to ${status}`)
})