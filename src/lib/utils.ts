import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import type { ApiResponse } from '@/types'

// API Response Helpers
export function successResponse<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message
  })
}

export function errorResponse(error: string, status: number = 400): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error
  }, { status })
}

export function validationErrorResponse(error: ZodError): NextResponse<ApiResponse> {
  const errorMessage = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
  return NextResponse.json({
    success: false,
    error: `Validation error: ${errorMessage}`
  }, { status: 400 })
}

// Utility Functions
export function calculateCartTotal(items: Array<{ quantity: number; product: { price: number } }>): number {
  return items.reduce((total, item) => total + (item.quantity * item.product.price), 0)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Error handling wrapper for API routes
export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | NextResponse<ApiResponse>> => {
    try {
      return await handler(...args)
    } catch (error) {
      console.error('API Error:', error)
      
      if (error instanceof ZodError) {
        return validationErrorResponse(error)
      }
      
      return errorResponse(
        error instanceof Error ? error.message : 'Internal server error',
        500
      )
    }
  }
}