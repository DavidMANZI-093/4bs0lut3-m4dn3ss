import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createTicketSchema } from '@/lib/validations'
import { successResponse, errorResponse, validationErrorResponse, withErrorHandling } from '@/lib/utils'

// GET /api/tickets - List tickets with pagination and search
export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  
  // Pagination parameters
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')))
  const skip = (page - 1) * limit
  
  // Search and filter parameters
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') as 'OPEN' | 'CLOSED' | null

  // Build where clause
  const where: any = {}
  
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ]
  }
  
  if (status) {
    where.status = status
  }

  // Get tickets and total count
  const [tickets, totalCount] = await Promise.all([
    prisma.ticket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.ticket.count({ where })
  ])

  const totalPages = Math.ceil(totalCount / limit)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  return successResponse({
    tickets,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
      hasNextPage,
      hasPrevPage
    }
  }, `Found ${tickets.length} tickets (page ${page} of ${totalPages})`)
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