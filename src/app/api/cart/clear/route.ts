import { prisma } from '@/lib/db'
import { successResponse, withErrorHandling } from '@/lib/utils'

// DELETE /api/cart/clear - Clear entire cart
export const DELETE = withErrorHandling(async () => {
  const result = await prisma.cartItem.deleteMany()

  return successResponse({
    deletedCount: result.count
  }, `Cleared ${result.count} items from cart`)
})