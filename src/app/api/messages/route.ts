import { prisma } from '@/lib/db'
import { successResponse, withErrorHandling } from '@/lib/utils'

// GET /api/messages - Get all chat messages
export const GET = withErrorHandling(async () => {
  const messages = await prisma.message.findMany({
    orderBy: {
      createdAt: 'asc'
    },
    take: 50 // Limit to last 50 messages
  })

  return successResponse(messages, `Found ${messages.length} messages`)
})