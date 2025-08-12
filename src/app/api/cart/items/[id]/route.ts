import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { successResponse, errorResponse, validationErrorResponse, withErrorHandling } from '@/lib/utils'

const updateQuantitySchema = z.object({
  quantity: z.number().int().min(1).max(99)
})

const idSchema = z.string().cuid()

// PATCH /api/cart/items/[id] - Update cart item quantity
export const PATCH = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const idValidation = idSchema.safeParse(params.id)
  if (!idValidation.success) {
    return errorResponse('Invalid cart item ID')
  }

  const body = await request.json()
  const validation = updateQuantitySchema.safeParse(body)
  if (!validation.success) {
    return validationErrorResponse(validation.error)
  }

  const cartItem = await prisma.cartItem.update({
    where: { id: idValidation.data },
    data: { quantity: validation.data.quantity },
    include: { product: true }
  })

  return successResponse(cartItem, 'Cart item quantity updated')
})

// DELETE /api/cart/items/[id] - Remove cart item
export const DELETE = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const idValidation = idSchema.safeParse(params.id)
  if (!idValidation.success) {
    return errorResponse('Invalid cart item ID')
  }

  await prisma.cartItem.delete({
    where: { id: idValidation.data }
  })

  return successResponse(null, 'Cart item removed successfully')
})