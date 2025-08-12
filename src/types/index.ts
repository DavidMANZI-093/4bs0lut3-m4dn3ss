import { Ticket, Score, Product, CartItem, Subscriber, Message, TicketStatus } from '@prisma/client'

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Extended Types with Relations
export interface CartItemWithProduct extends CartItem {
  product: Product
}

export interface CartSummary {
  items: CartItemWithProduct[]
  total: number
  itemCount: number
}

// Socket.IO Event Types
export interface SocketEvents {
  // Basketball Scoreboard
  'score:update': (score: Score) => void
  'score:reset': (score: Score) => void
  
  // Live Chat
  'message:send': (message: SendMessageInput) => void
  'message:broadcast': (message: Message) => void
  'user:join': (username: string) => void
  'user:leave': (username: string) => void
}

// Re-export Prisma types
export type {
  Ticket,
  Score,
  Product,
  CartItem,
  Subscriber,
  Message,
  TicketStatus
}

// Input types from validations
export type {
  CreateTicketInput,
  UpdateTicketStatusInput,
  UpdateScoreInput,
  AddToCartInput,
  SubscribeInput,
  SendMessageInput
} from '../lib/validations'