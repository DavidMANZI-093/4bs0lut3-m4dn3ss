import { prisma } from '@/lib/prisma'
import { successResponse, withErrorHandling } from '@/lib/utils'

// GET /api/score - Get current basketball score
export const GET = withErrorHandling(async () => {
  let score = await prisma.score.findFirst({
    orderBy: { updatedAt: 'desc' }
  })

  // Create initial score if none exists
  if (!score) {
    score = await prisma.score.create({
      data: { teamA: 0, teamB: 0 }
    })
  }

  return successResponse(score, 'Current basketball score')
})

// POST /api/score - Reset score to 0-0
export const POST = withErrorHandling(async () => {
  // Delete all existing scores and create a fresh one
  await prisma.score.deleteMany()
  
  const score = await prisma.score.create({
    data: { teamA: 0, teamB: 0 }
  })

  return successResponse(score, 'Score reset to 0-0')
})