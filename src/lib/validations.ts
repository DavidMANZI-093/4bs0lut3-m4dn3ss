import { z } from 'zod'

// Ticketing System Validations
export const createTicketSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
})

export const updateTicketStatusSchema = z.object({
  status: z.enum(['OPEN', 'CLOSED']),
})

// Basketball Scoreboard Validations
export const updateScoreSchema = z.object({
  team: z.enum(['A', 'B']),
  points: z.number().int().min(1).max(10).default(1),
})

// E-commerce Validations
export const addToCartSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().min(1).max(99).default(1),
})

// Subscription System Validations
export const subscribeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email format'),
})

// Live Chat Validations
export const sendMessageSchema = z.object({
  sender: z.string().min(1, 'Sender name is required').max(50, 'Sender name too long'),
  content: z.string().min(1, 'Message content is required').max(500, 'Message too long'),
})

// Product Schema
export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name too long'),
  price: z.number().min(0, 'Price cannot be negative'),
  description: z.string().optional(),
  inventory: z.number().int().min(0, 'Inventory cannot be negative'),
})

// Ticket Schema (complete ticket with status)
export const ticketSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  status: z.enum(['OPEN', 'CLOSED']),
})

// Score Update Schema (aliased from existing)
export const scoreUpdateSchema = updateScoreSchema

// Cart Item Schema (aliased from existing)
export const cartItemSchema = addToCartSchema

// Subscription Schema (aliased from existing)
export const subscriptionSchema = subscribeSchema

// Message Schema (aliased from existing)
export const messageSchema = sendMessageSchema

// Membership Tier Schema
export const membershipTierSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  price: z.number().min(0, 'Price cannot be negative'),
  duration: z.number().int().min(1, 'Duration must be at least 1 month'),
  benefits: z.array(z.string()).min(1, 'At least one benefit is required'),
})

// Membership Purchase Schema
export const membershipPurchaseSchema = z.object({
  tierId: z.string().min(1, 'Tier ID is required'),
  email: z.string().email('Invalid email format'),
})

// Live Stream Schema
export const liveStreamSchema = z.object({
  youtubeUrl: z.string().regex(/^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/, 'Invalid YouTube URL').optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean(),
})

// Common validation helpers
export const idSchema = z.string().cuid()

export type CreateTicketInput = z.infer<typeof createTicketSchema>
export type UpdateTicketStatusInput = z.infer<typeof updateTicketStatusSchema>
export type UpdateScoreInput = z.infer<typeof updateScoreSchema>
export type AddToCartInput = z.infer<typeof addToCartSchema>
export type SubscribeInput = z.infer<typeof subscribeSchema>
export type SendMessageInput = z.infer<typeof sendMessageSchema>
export type ProductInput = z.infer<typeof productSchema>
export type TicketInput = z.infer<typeof ticketSchema>
export type MembershipTierInput = z.infer<typeof membershipTierSchema>
export type MembershipPurchaseInput = z.infer<typeof membershipPurchaseSchema>
export type LiveStreamInput = z.infer<typeof liveStreamSchema>
