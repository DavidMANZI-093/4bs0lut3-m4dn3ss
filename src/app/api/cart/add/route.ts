import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { addToCartSchema } from '@/lib/validations'
import { successResponse, errorResponse, validationErrorResponse, withErrorHandling } from '@/lib/utils'

// POST /api/cart/add - Add product to cart
export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json()
  
  const validation = addToCartSchema.safeParse(body)
  if (!validation.success) {
    return validationErrorResponse(validation.error)
  }

  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: validation.data.productId }
  })

  if (!product) {
    return errorResponse('Product not found', 404)
  }

  // Check if item already exists in cart
  const existingCartItem = await prisma.cartItem.findFirst({
    where: { productId: validation.data.productId }
  })

  let cartItem
  if (existingCartItem) {
    // Update quantity if item already exists
    cartItem = await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: { 
        quantity: existingCartItem.quantity + validation.data.quantity 
      },
      include: { product: true }
    })
  } else {
    // Create new cart item
    cartItem = await prisma.cartItem.create({
      data: validation.data,
      include: { product: true }
    })
  }

  return successResponse(cartItem, 'Product added to cart successfully')
})