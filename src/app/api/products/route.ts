import { prisma } from '@/lib/db'
import { successResponse, withErrorHandling } from '@/lib/utils'

// GET /api/products - List all products
export const GET = withErrorHandling(async () => {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })

  return successResponse(products, `Found ${products.length} products`)
})