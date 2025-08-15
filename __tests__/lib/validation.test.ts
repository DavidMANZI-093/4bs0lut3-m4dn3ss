import { describe, it, expect } from '@jest/globals'
import { 
  ticketSchema, 
  scoreUpdateSchema, 
  productSchema, 
  cartItemSchema, 
  subscriptionSchema, 
  messageSchema,
  membershipTierSchema,
  membershipPurchaseSchema,
  liveStreamSchema
} from '../../src/lib/validations'

describe('Validation Schemas', () => {
  describe('Ticket Schema', () => {
    it('should validate valid ticket data', () => {
      const validTicket = {
        title: 'Test Ticket',
        description: 'This is a test ticket',
        status: 'OPEN'
      }
      
      const result = ticketSchema.safeParse(validTicket)
      expect(result.success).toBe(true)
    })

    it('should reject invalid ticket data', () => {
      const invalidTicket = {
        title: '', // Empty title
        description: 'This is a test ticket',
        status: 'INVALID_STATUS'
      }
      
      const result = ticketSchema.safeParse(invalidTicket)
      expect(result.success).toBe(false)
    })

    it('should require title and description', () => {
      const incompleteTicket = {
        status: 'OPEN'
      }
      
      const result = ticketSchema.safeParse(incompleteTicket)
      expect(result.success).toBe(false)
    })
  })

  describe('Score Update Schema', () => {
    it('should validate valid score update', () => {
      const validScore = {
        team: 'A',
        points: 2
      }
      
      const result = scoreUpdateSchema.safeParse(validScore)
      expect(result.success).toBe(true)
    })

    it('should reject invalid team', () => {
      const invalidScore = {
        team: 'C', // Only A or B allowed
        points: 2
      }
      
      const result = scoreUpdateSchema.safeParse(invalidScore)
      expect(result.success).toBe(false)
    })

    it('should reject negative points', () => {
      const invalidScore = {
        team: 'A',
        points: -1
      }
      
      const result = scoreUpdateSchema.safeParse(invalidScore)
      expect(result.success).toBe(false)
    })
  })

  describe('Product Schema', () => {
    it('should validate valid product data', () => {
      const validProduct = {
        name: 'Test Jersey',
        price: 49.99,
        description: 'A test jersey',
        inventory: 100
      }
      
      const result = productSchema.safeParse(validProduct)
      expect(result.success).toBe(true)
    })

    it('should reject negative price', () => {
      const invalidProduct = {
        name: 'Test Jersey',
        price: -10,
        description: 'A test jersey',
        inventory: 100
      }
      
      const result = productSchema.safeParse(invalidProduct)
      expect(result.success).toBe(false)
    })

    it('should reject negative inventory', () => {
      const invalidProduct = {
        name: 'Test Jersey',
        price: 49.99,
        description: 'A test jersey',
        inventory: -5
      }
      
      const result = productSchema.safeParse(invalidProduct)
      expect(result.success).toBe(false)
    })
  })

  describe('Cart Item Schema', () => {
    it('should validate valid cart item', () => {
      const validCartItem = {
        productId: 'clhijk12345678901234567890',
        quantity: 2
      }
      
      const result = cartItemSchema.safeParse(validCartItem)
      expect(result.success).toBe(true)
    })

    it('should reject zero quantity', () => {
      const invalidCartItem = {
        productId: 'product-123',
        quantity: 0
      }
      
      const result = cartItemSchema.safeParse(invalidCartItem)
      expect(result.success).toBe(false)
    })

    it('should reject negative quantity', () => {
      const invalidCartItem = {
        productId: 'product-123',
        quantity: -1
      }
      
      const result = cartItemSchema.safeParse(invalidCartItem)
      expect(result.success).toBe(false)
    })
  })

  describe('Subscription Schema', () => {
    it('should validate valid subscription', () => {
      const validSubscription = {
        name: 'John Doe',
        email: 'john@example.com'
      }
      
      const result = subscriptionSchema.safeParse(validSubscription)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidSubscription = {
        name: 'John Doe',
        email: 'invalid-email'
      }
      
      const result = subscriptionSchema.safeParse(invalidSubscription)
      expect(result.success).toBe(false)
    })

    it('should require name and email', () => {
      const incompleteSubscription = {
        name: 'John Doe'
      }
      
      const result = subscriptionSchema.safeParse(incompleteSubscription)
      expect(result.success).toBe(false)
    })
  })

  describe('Message Schema', () => {
    it('should validate valid message', () => {
      const validMessage = {
        sender: 'TestUser',
        content: 'Hello world!'
      }
      
      const result = messageSchema.safeParse(validMessage)
      expect(result.success).toBe(true)
    })

    it('should reject empty content', () => {
      const invalidMessage = {
        sender: 'TestUser',
        content: ''
      }
      
      const result = messageSchema.safeParse(invalidMessage)
      expect(result.success).toBe(false)
    })

    it('should reject empty sender', () => {
      const invalidMessage = {
        sender: '',
        content: 'Hello world!'
      }
      
      const result = messageSchema.safeParse(invalidMessage)
      expect(result.success).toBe(false)
    })
  })

  describe('Membership Tier Schema', () => {
    it('should validate valid membership tier', () => {
      const validTier = {
        name: 'Gold',
        price: 99.99,
        duration: 12,
        benefits: ['Exclusive content', 'Priority support']
      }
      
      const result = membershipTierSchema.safeParse(validTier)
      expect(result.success).toBe(true)
    })

    it('should reject negative price', () => {
      const invalidTier = {
        name: 'Gold',
        price: -10,
        duration: 12,
        benefits: ['Exclusive content']
      }
      
      const result = membershipTierSchema.safeParse(invalidTier)
      expect(result.success).toBe(false)
    })

    it('should reject zero duration', () => {
      const invalidTier = {
        name: 'Gold',
        price: 99.99,
        duration: 0,
        benefits: ['Exclusive content']
      }
      
      const result = membershipTierSchema.safeParse(invalidTier)
      expect(result.success).toBe(false)
    })
  })

  describe('Membership Purchase Schema', () => {
    it('should validate valid membership purchase', () => {
      const validPurchase = {
        tierId: 'tier-123',
        email: 'customer@example.com'
      }
      
      const result = membershipPurchaseSchema.safeParse(validPurchase)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidPurchase = {
        tierId: 'tier-123',
        email: 'invalid-email'
      }
      
      const result = membershipPurchaseSchema.safeParse(invalidPurchase)
      expect(result.success).toBe(false)
    })
  })

  describe('Live Stream Schema', () => {
    it('should validate valid live stream', () => {
      const validStream = {
        youtubeUrl: 'https://youtu.be/dQw4w9WgXcQ',
        title: 'Live Game Stream',
        description: 'Watch the game live!',
        isActive: true
      }
      
      const result = liveStreamSchema.safeParse(validStream)
      expect(result.success).toBe(true)
    })

    it('should reject invalid YouTube URL', () => {
      const invalidStream = {
        youtubeUrl: 'https://example.com/video',
        title: 'Live Game Stream',
        description: 'Watch the game live!',
        isActive: true
      }
      
      const result = liveStreamSchema.safeParse(invalidStream)
      expect(result.success).toBe(false)
    })

    it('should allow optional fields', () => {
      const minimalStream = {
        isActive: false
      }
      
      const result = liveStreamSchema.safeParse(minimalStream)
      expect(result.success).toBe(true)
    })
  })
})