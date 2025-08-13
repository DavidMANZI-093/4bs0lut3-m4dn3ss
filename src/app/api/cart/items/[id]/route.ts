import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateQuantitySchema = z.object({
  quantity: z.number().int().min(1).max(99)
})

const idSchema = z.string().cuid()

// PATCH /api/cart/items/[id] - Update cart item quantity
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const idValidation = idSchema.safeParse(params.id)
    if (!idValidation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid cart item ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validation = updateQuantitySchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid quantity' },
        { status: 400 }
      )
    }

    const cartItem = await prisma.cartItem.update({
      where: { id: idValidation.data },
      data: { quantity: validation.data.quantity },
      include: { product: true }
    })

    return NextResponse.json({
      success: true,
      data: cartItem,
      message: 'Cart item quantity updated'
    })
  } catch (error) {
    console.error('Error updating cart item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update cart item' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart/items/[id] - Remove cart item
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const idValidation = idSchema.safeParse(params.id)
    if (!idValidation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid cart item ID' },
        { status: 400 }
      )
    }

    await prisma.cartItem.delete({
      where: { id: idValidation.data }
    })

    return NextResponse.json({
      success: true,
      message: 'Cart item removed successfully'
    })
  } catch (error) {
    console.error('Error deleting cart item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete cart item' },
      { status: 500 }
    )
  }
}