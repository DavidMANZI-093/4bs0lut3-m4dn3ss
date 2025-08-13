import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateScoreSchema } from '@/lib/validations'
import { successResponse, errorResponse, validationErrorResponse, withErrorHandling } from '@/lib/utils'

// POST /api/score/update - Update team score
export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json()
  
  const validation = updateScoreSchema.safeParse(body)
  if (!validation.success) {
    return validationErrorResponse(validation.error)
  }

  // Get current score
  let currentScore = await prisma.score.findFirst({
    orderBy: { updatedAt: 'desc' }
  })

  // Create initial score if none exists
  if (!currentScore) {
    currentScore = await prisma.score.create({
      data: { teamA: 0, teamB: 0 }
    })
  }

  // Update the appropriate team's score
  const updateData = validation.data.team === 'A' 
    ? { teamA: currentScore.teamA + validation.data.points }
    : { teamB: currentScore.teamB + validation.data.points }

  const updatedScore = await prisma.score.update({
    where: { id: currentScore.id },
    data: updateData
  })

  return successResponse(updatedScore, `Team ${validation.data.team} score updated`)
})