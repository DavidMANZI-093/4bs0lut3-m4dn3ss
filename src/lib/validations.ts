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

// Common validation helpers
export const idSchema = z.string().cuid()

export type CreateTicketInput = z.infer<typeof createTicketSchema>
export type UpdateTicketStatusInput = z.infer<typeof updateTicketStatusSchema>
export type UpdateScoreInput = z.infer<typeof updateScoreSchema>
export type AddToCartInput = z.infer<typeof addToCartSchema>
export type SubscribeInput = z.infer<typeof subscribeSchema>
export type SendMessageInput = z.infer<typeof sendMessageSchema>