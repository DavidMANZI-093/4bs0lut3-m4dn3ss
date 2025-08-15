import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
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

  const cartSummary = {
    items: cartItems,
    total,
    itemCount
  }

  return NextResponse.json({
    success: true,
    data: cartSummary,
    message: `Cart contains ${itemCount} items`
  })
})