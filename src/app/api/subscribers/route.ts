import { prisma } from '@/lib/db'
import { successResponse, withErrorHandling } from '@/lib/utils'

// GET /api/subscribers - List all subscribers
export const GET = withErrorHandling(async () => {
  const subscribers = await prisma.subscriber.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })

  return successResponse(subscribers, `Found ${subscribers.length} subscribers`)
})