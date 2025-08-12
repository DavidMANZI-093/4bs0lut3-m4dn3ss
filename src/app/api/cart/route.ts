import { prisma } from '@/lib/db'
import { successResponse, withErrorHandling } from '@/lib/utils'
import { calculateCartTotal } from '@/lib/utils'
import type { CartSummary } from '@/types'

// GET /api/cart - View cart contents with total
export const GET = withErrorHandling(async () => {
  const cartItems = await prisma.cartItem.findMany({
    include: {
      product: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const total = calculateCartTotal(cartItems)
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const cartSummary: CartSummary = {
    items: cartItems,
    total,
    itemCount
  }

  return successResponse(cartSummary, `Cart contains ${itemCount} items`)
})