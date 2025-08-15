import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Database Schema & Integrity', () => {
  beforeAll(async () => {
    // Ensure database connection
    await prisma.$connect()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should connect to database', async () => {
    const result = await prisma.$queryRaw`SELECT 1 as test`
    expect(result).toBeDefined()
  })

  it('should have all required tables', async () => {
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    
    const tableNames = (tables as any[]).map(t => t.table_name)
    
    // Core system tables
    expect(tableNames).toContain('users')
    expect(tableNames).toContain('tickets')
    expect(tableNames).toContain('products')
    expect(tableNames).toContain('cart_items')
    expect(tableNames).toContain('subscribers')
    expect(tableNames).toContain('messages')
    expect(tableNames).toContain('scores')
    
    // Enhanced system tables
    expect(tableNames).toContain('membership_tiers')
    expect(tableNames).toContain('members')
    expect(tableNames).toContain('games')
    expect(tableNames).toContain('ticket_types')
    expect(tableNames).toContain('payments')
    expect(tableNames).toContain('audit_logs')
    expect(tableNames).toContain('live_streams')
  })

  it('should enforce foreign key constraints', async () => {
    // This should fail due to foreign key constraint
    await expect(
      prisma.cartItem.create({
        data: {
          productId: 'non-existent-id',
          quantity: 1,
          userId: 'non-existent-user'
        }
      })
    ).rejects.toThrow()
  })

  it('should validate required fields', async () => {
    // This should fail due to missing required fields
    await expect(
      prisma.user.create({
        data: {
          // Missing required email field
          role: 'USER'
        } as any
      })
    ).rejects.toThrow()
  })

  it('should validate enum constraints', async () => {
    // Test user role enum
    await expect(
      prisma.user.create({
        data: {
          email: 'test@example.com',
          passwordHash: 'hashed',
          role: 'INVALID_ROLE' as any
        }
      })
    ).rejects.toThrow()
  })

  it('should handle unique constraints', async () => {
    const testEmail = `unique-test-${Date.now()}@example.com`
    
    // First user should succeed
    const user1 = await prisma.user.create({
      data: {
        email: testEmail,
        passwordHash: 'hashed',
        role: 'USER'
      }
    })
    expect(user1.id).toBeDefined()

    // Second user with same email should fail
    await expect(
      prisma.user.create({
        data: {
          email: testEmail,
          passwordHash: 'hashed2',
          role: 'USER'
        }
      })
    ).rejects.toThrow()

    // Cleanup
    await prisma.user.delete({ where: { id: user1.id } })
  })

  it('should validate data relationships', async () => {
    // Test that membership tier relationships work
    const tiers = await prisma.membershipTier.findMany({
      include: {
        members: true
      }
    })
    
    expect(Array.isArray(tiers)).toBe(true)
    tiers.forEach(tier => {
      expect(tier.name).toBeDefined()
      expect(tier.price).toBeGreaterThan(0)
      expect(Array.isArray(tier.members)).toBe(true)
    })
  })

  it('should validate live stream constraints', async () => {
    const streams = await prisma.liveStream.findMany()
    
    streams.forEach(stream => {
      if (stream.youtubeUrl) {
        expect(typeof stream.youtubeUrl).toBe('string')
      }
      expect(typeof stream.isActive).toBe('boolean')
      expect(stream.createdAt).toBeInstanceOf(Date)
      expect(stream.updatedAt).toBeInstanceOf(Date)
    })
  })

  it('should validate audit log structure', async () => {
    const logs = await prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    })
    
    logs.forEach(log => {
      expect(log.action).toBeDefined()
      expect(typeof log.action).toBe('string')
      expect(log.createdAt).toBeInstanceOf(Date)
    })
  })

  it('should have enhanced user table with new fields', async () => {
    const user = await prisma.user.findFirst()
    
    expect(user).toBeDefined()
    expect(user?.permissions).toBeDefined()
    expect(Array.isArray(user?.permissions)).toBe(true)
    expect(user?.updatedAt).toBeDefined()
    expect(user?.createdAt).toBeDefined()
  })

  it('should have enhanced session table with isActive field', async () => {
    const session = await prisma.session.findFirst()
    
    if (session) {
      expect(typeof session.isActive).toBe('boolean')
      expect(session.ipAddress).toBeDefined()
      expect(session.userAgent).toBeDefined()
    }
  })

  it('should have enhanced membership tier table', async () => {
    const tier = await prisma.membershipTier.findFirst()
    
    expect(tier).toBeDefined()
    expect(typeof tier?.duration).toBe('number')
    expect(typeof tier?.isActive).toBe('boolean')
    expect(tier?.name).toBeDefined()
    expect(tier?.createdAt).toBeDefined()
    expect(tier?.updatedAt).toBeDefined()
  })

  it('should have enhanced member table with new fields', async () => {
    const member = await prisma.member.findFirst()
    
    expect(member).toBeDefined()
    expect(member?.tierName).toBeDefined()
    expect(member?.paymentStatus).toBeDefined()
    expect(Array.isArray(member?.benefits)).toBe(true)
    expect(member?.purchaseDate).toBeDefined()
    expect(member?.expiryDate).toBeDefined()
    expect(member?.createdAt).toBeDefined()
    expect(member?.updatedAt).toBeDefined()
  })

  it('should have payment table with proper relationships', async () => {
    const payment = await prisma.payment.findFirst({
      include: {
        user: true,
        member: true,
        transactions: true
      }
    })
    
    if (payment) {
      expect(payment.amount).toBeDefined()
      expect(payment.currency).toBeDefined()
      expect(payment.method).toBeDefined()
      expect(payment.status).toBeDefined()
      expect(payment.createdAt).toBeDefined()
      expect(payment.updatedAt).toBeDefined()
    }
  })

  it('should have audit log table with proper structure', async () => {
    const auditLog = await prisma.auditLog.findFirst({
      include: {
        user: true
      }
    })
    
    if (auditLog) {
      expect(auditLog.action).toBeDefined()
      expect(auditLog.resource).toBeDefined()
      expect(auditLog.severity).toBeDefined()
      expect(auditLog.system).toBeDefined()
      expect(auditLog.createdAt).toBeDefined()
    }
  })

  it('should have enhanced product table with inventory tracking', async () => {
    const product = await prisma.product.findFirst()
    
    expect(product).toBeDefined()
    expect(typeof product?.inventory).toBe('number')
    expect(typeof product?.isActive).toBe('boolean')
    expect(product?.description).toBeDefined()
    expect(product?.createdAt).toBeDefined()
    expect(product?.updatedAt).toBeDefined()
  })

  it('should have game table with enhanced scoreboard features', async () => {
    const game = await prisma.game.findFirst()
    
    if (game) {
      expect(game.homeTeam).toBeDefined()
      expect(game.awayTeam).toBeDefined()
      expect(typeof game.homeScore).toBe('number')
      expect(typeof game.awayScore).toBe('number')
      expect(game.status).toBeDefined()
      expect(game.startTime).toBeDefined()
      expect(game.createdAt).toBeDefined()
      expect(game.updatedAt).toBeDefined()
    }
  })

  it('should have ticket type table with enhanced ticketing', async () => {
    const ticketType = await prisma.ticketType.findFirst()
    
    if (ticketType) {
      expect(ticketType.name).toBeDefined()
      expect(typeof ticketType.price).toBe('number')
      expect(typeof ticketType.totalQuantity).toBe('number')
      expect(typeof ticketType.availableQuantity).toBe('number')
      expect(Array.isArray(ticketType.benefits)).toBe(true)
      expect(typeof ticketType.isActive).toBe('boolean')
      expect(ticketType.createdAt).toBeDefined()
      expect(ticketType.updatedAt).toBeDefined()
    }
  })

  it('should maintain proper foreign key relationships', async () => {
    // Test member -> tier relationship
    const memberWithTier = await prisma.member.findFirst({
      include: { tier: true }
    })
    
    if (memberWithTier) {
      expect(memberWithTier.tier).toBeDefined()
      expect(memberWithTier.tierId).toBe(memberWithTier.tier.id)
    }

    // Test payment -> member relationship
    const paymentWithMember = await prisma.payment.findFirst({
      where: { memberId: { not: null } },
      include: { member: true }
    })
    
    if (paymentWithMember) {
      expect(paymentWithMember.member).toBeDefined()
      expect(paymentWithMember.memberId).toBe(paymentWithMember.member?.id)
    }

    // Test audit log -> user relationship
    const auditLogWithUser = await prisma.auditLog.findFirst({
      where: { userId: { not: null } },
      include: { user: true }
    })
    
    if (auditLogWithUser) {
      expect(auditLogWithUser.user).toBeDefined()
      expect(auditLogWithUser.userId).toBe(auditLogWithUser.user?.id)
    }
  })
})