import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { subscribeSchema } from '@/lib/validations'
import { successResponse, errorResponse, validationErrorResponse, withErrorHandling } from '@/lib/utils'
import { Prisma } from '@prisma/client'

// POST /api/subscribe - Add a new subscriber
export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json()
  
  const validation = subscribeSchema.safeParse(body)
  if (!validation.success) {
    return validationErrorResponse(validation.error)
  }

  try {
    const subscriber = await prisma.subscriber.create({
      data: validation.data
    })

    return successResponse(subscriber, 'Successfully subscribed!')
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return errorResponse('Email already subscribed', 409)
      }
    }
    throw error
  }
})