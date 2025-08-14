import { PrismaClient } from '@prisma/client'
import { AuthService } from '../src/lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.auditLog.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.ticketPurchase.deleteMany()
  await prisma.ticketType.deleteMany()
  await prisma.game.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()
  await prisma.member.deleteMany()
  await prisma.membershipTier.deleteMany()
  await prisma.message.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.product.deleteMany()
  await prisma.subscriber.deleteMany()
  await prisma.ticket.deleteMany()
  await prisma.score.deleteMany()

  // 1. Seed Authentication Users
  console.log('🔐 Seeding authentication users...')
  const adminUserId = await AuthService.createUser(
    'admin@4bs0lut3-m4dn3ss.com',
    'admin123',
    'ADMIN'
  )
  const devUserId = await AuthService.createUser(
    'dev@4bs0lut3-m4dn3ss.com',
    'dev123',
    'DEVELOPER'
  )
  console.log(`✅ Created 2 users (admin & developer)`)

  // 2. Seed Tickets
  console.log('📋 Seeding tickets...')
  const tickets = await prisma.ticket.createMany({
    data: [
      {
        title: 'Season Opener vs Lakers',
        description: 'Premium courtside seats for the season opening game against Lakers. Includes pre-game meet & greet.',
        status: 'OPEN'
      },
      {
        title: 'Championship Finals Game 3',
        description: 'Upper deck seats for the championship finals. Historic game with playoff atmosphere.',
        status: 'OPEN'
      },
      {
        title: 'Rivalry Game vs Warriors',
        description: 'Mid-court seats for the biggest rivalry game of the season. Sold out venue expected.',
        status: 'CLOSED'
      },
      {
        title: 'Family Night vs Celtics',
        description: 'Family-friendly game with kids activities and player autograph session after the game.',
        status: 'OPEN'
      },
      {
        title: 'Playoff Quarterfinals',
        description: 'Lower bowl seats for the first playoff game. Includes team merchandise package.',
        status: 'CLOSED'
      }
    ]
  })
  console.log(`✅ Created ${tickets.count} tickets`)

  // 3. Seed Basketball Score
  console.log('🏀 Seeding basketball score...')
  const score = await prisma.score.create({
    data: {
      teamA: 42,
      teamB: 38
    }
  })
  console.log(`✅ Created basketball score: Team A: ${score.teamA}, Team B: ${score.teamB}`)

  // 4. Seed Products
  console.log('🛍️ Seeding products...')
  const products = await prisma.product.createMany({
    data: [
      {
        name: 'Official Team Jersey - Home',
        description: 'Authentic home jersey with official team colors and logo',
        price: 89.99,
        inventory: 50,
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
        isActive: true
      },
      {
        name: 'Team Championship Cap',
        description: 'Adjustable cap celebrating our championship victory',
        price: 34.99,
        inventory: 100,
        imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400',
        isActive: true
      },
      {
        name: 'Basketball Signed by Team',
        description: 'Official game basketball signed by the entire team',
        price: 199.99,
        inventory: 25,
        imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
        isActive: true
      },
      {
        name: 'Team Hoodie - Premium',
        description: 'Premium quality hoodie with embroidered team logo',
        price: 79.99,
        inventory: 75,
        imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
        isActive: true
      },
      {
        name: 'Official Team Shorts',
        description: 'Comfortable athletic shorts in team colors',
        price: 49.99,
        inventory: 60,
        imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400',
        isActive: true
      },
      {
        name: 'Team Logo Water Bottle',
        description: 'Insulated water bottle with team logo',
        price: 24.99,
        inventory: 200,
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
        isActive: true
      }
    ]
  })
  console.log(`✅ Created ${products.count} products`)

  // 5. Seed Cart Items (sample cart)
  console.log('🛒 Seeding cart items...')
  const allProducts = await prisma.product.findMany()
  const cartItems = await prisma.cartItem.createMany({
    data: [
      {
        productId: allProducts[0].id, // Headphones
        quantity: 1
      },
      {
        productId: allProducts[2].id, // Phone Charger
        quantity: 2
      },
      {
        productId: allProducts[4].id, // USB-C Hub
        quantity: 1
      }
    ]
  })
  console.log(`✅ Created ${cartItems.count} cart items`)

  // 6. Seed Subscribers
  console.log('📧 Seeding subscribers...')
  const subscribers = await prisma.subscriber.createMany({
    data: [
      {
        name: 'Marcus Thompson',
        email: 'marcus.thompson@example.com'
      },
      {
        name: 'Sarah Williams',
        email: 'sarah.williams@example.com'
      },
      {
        name: 'James Rodriguez',
        email: 'james.rodriguez@example.com'
      },
      {
        name: 'Emily Chen',
        email: 'emily.chen@example.com'
      }
    ]
  })
  console.log(`✅ Created ${subscribers.count} subscribers`)

  // 7. Seed Chat Messages
  console.log('💬 Seeding chat messages...')
  const messages = await prisma.message.createMany({
    data: [
      {
        sender: 'GameHost',
        content: 'Welcome to the 4bs0lut3-m4dn3ss live game stream! 🏀'
      },
      {
        sender: 'FanMarcus',
        content: 'Let\'s go team! Ready for this game! 🔥'
      },
      {
        sender: 'CourtSideSarah',
        content: 'Amazing atmosphere in the arena tonight! 🎉'
      },
      {
        sender: 'BasketballJames',
        content: 'That was an incredible dunk! Replay please!'
      },
      {
        sender: 'GameHost',
        content: 'What a play! The energy is electric tonight!'
      },
      {
        sender: 'TeamFanEmily',
        content: 'Best game of the season so far! Go team! 🏆'
      }
    ]
  })
  console.log(`✅ Created ${messages.count} chat messages`)

  // 8. Seed Membership Tiers
  console.log('🏆 Seeding membership tiers...')
  const membershipTiers = await prisma.membershipTier.createMany({
    data: [
      {
        name: 'Bronze',
        price: 99.99,
        duration: 12,
        description: 'Perfect for casual fans who want to stay connected',
        benefits: [
          'Monthly newsletter with team updates',
          '10% discount on merchandise',
          'Access to member-only chat rooms',
          'Early ticket notifications'
        ],
        isPopular: false,
        isActive: true
      },
      {
        name: 'Silver',
        price: 199.99,
        duration: 12,
        description: 'Great value for dedicated fans',
        benefits: [
          'All Bronze benefits',
          '15% discount on merchandise',
          'Priority ticket access',
          'Quarterly team meetup invitations',
          'Exclusive behind-the-scenes content',
          'Free shipping on all orders'
        ],
        isPopular: true,
        isActive: true
      },
      {
        name: 'Gold',
        price: 399.99,
        duration: 12,
        description: 'Ultimate experience for true champions',
        benefits: [
          'All Silver benefits',
          '25% discount on merchandise',
          'VIP game day experiences',
          'Meet & greet with players',
          'Courtside seat upgrades (when available)',
          'Personalized team merchandise',
          'Access to exclusive events and parties'
        ],
        isPopular: false,
        isActive: true,
        maxMembers: 100
      }
    ]
  })
  console.log(`✅ Created ${membershipTiers.count} membership tiers`)

  // 9. Seed Sample Members
  console.log('👥 Seeding sample members...')
  const allTiers = await prisma.membershipTier.findMany()
  const members = await prisma.member.createMany({
    data: [
      {
        email: 'member1@example.com',
        tierId: allTiers[0].id, // Bronze
        tierName: allTiers[0].name,
        status: 'ACTIVE',
        paymentStatus: 'COMPLETED',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        benefits: allTiers[0].benefits
      },
      {
        email: 'member2@example.com',
        tierId: allTiers[1].id, // Silver
        tierName: allTiers[1].name,
        status: 'ACTIVE',
        paymentStatus: 'COMPLETED',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        benefits: allTiers[1].benefits
      },
      {
        email: 'member3@example.com',
        tierId: allTiers[2].id, // Gold
        tierName: allTiers[2].name,
        status: 'ACTIVE',
        paymentStatus: 'COMPLETED',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        benefits: allTiers[2].benefits
      },
      {
        email: 'expired@example.com',
        tierId: allTiers[0].id, // Bronze
        tierName: allTiers[0].name,
        status: 'EXPIRED',
        paymentStatus: 'COMPLETED',
        expiryDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        benefits: allTiers[0].benefits
      }
    ]
  })
  console.log(`✅ Created ${members.count} members`)

  // 10. Seed Games
  console.log('🏀 Seeding games...')
  const games = await prisma.game.createMany({
    data: [
      {
        homeTeam: '4bs0lut3-m4dn3ss',
        awayTeam: 'Lakers',
        homeScore: 42,
        awayScore: 38,
        status: 'LIVE',
        startTime: new Date(),
        venue: 'Home Arena',
        season: '2024-25',
        createdBy: adminUserId
      },
      {
        homeTeam: '4bs0lut3-m4dn3ss',
        awayTeam: 'Warriors',
        homeScore: 0,
        awayScore: 0,
        status: 'SCHEDULED',
        startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        venue: 'Home Arena',
        season: '2024-25',
        createdBy: adminUserId
      },
      {
        homeTeam: 'Celtics',
        awayTeam: '4bs0lut3-m4dn3ss',
        homeScore: 95,
        awayScore: 102,
        status: 'FINISHED',
        startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
        venue: 'Away Arena',
        season: '2024-25',
        createdBy: adminUserId
      }
    ]
  })
  console.log(`✅ Created ${games.count} games`)

  // 11. Seed Ticket Types
  console.log('🎫 Seeding ticket types...')
  const allGames = await prisma.game.findMany()
  const ticketTypes = await prisma.ticketType.createMany({
    data: [
      {
        gameId: allGames[0].id, // Current live game
        name: 'Courtside Premium',
        description: 'Best seats in the house with VIP amenities',
        price: 299.99,
        totalQuantity: 20,
        availableQuantity: 5,
        seatSection: 'Courtside',
        benefits: ['VIP parking', 'Complimentary drinks', 'Meet & greet opportunity'],
        isActive: true
      },
      {
        gameId: allGames[1].id, // Upcoming game
        name: 'Lower Bowl',
        description: 'Great view from the lower bowl section',
        price: 89.99,
        totalQuantity: 200,
        availableQuantity: 150,
        seatSection: 'Lower Bowl',
        benefits: ['Reserved parking'],
        isActive: true,
        saleStartDate: new Date(),
        saleEndDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000) // 6 days from now
      },
      {
        name: 'Season Pass',
        description: 'Access to all home games this season',
        price: 1299.99,
        totalQuantity: 50,
        availableQuantity: 25,
        benefits: ['All home games', 'Priority seating', 'Exclusive merchandise'],
        isActive: true
      }
    ]
  })
  console.log(`✅ Created ${ticketTypes.count} ticket types`)

  // 12. Seed Sample Payments
  console.log('💳 Seeding sample payments...')
  const allMembers = await prisma.member.findMany()
  const payments = await prisma.payment.createMany({
    data: [
      {
        memberId: allMembers[0].id,
        amount: 99.99,
        currency: 'USD',
        method: 'CARD',
        status: 'COMPLETED',
        transactionId: 'txn_bronze_001',
        processedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
      },
      {
        memberId: allMembers[1].id,
        amount: 199.99,
        currency: 'USD',
        method: 'PAYPAL',
        status: 'COMPLETED',
        transactionId: 'txn_silver_001',
        processedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000) // 25 days ago
      },
      {
        memberId: allMembers[2].id,
        amount: 399.99,
        currency: 'USD',
        method: 'CARD',
        status: 'COMPLETED',
        transactionId: 'txn_gold_001',
        processedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) // 20 days ago
      },
      {
        amount: 89.99,
        currency: 'USD',
        method: 'CARD',
        status: 'FAILED',
        failureReason: 'Insufficient funds',
        transactionId: 'txn_failed_001'
      }
    ]
  })
  console.log(`✅ Created ${payments.count} payments`)

  // 13. Seed Audit Logs
  console.log('📋 Seeding audit logs...')
  const auditLogs = await prisma.auditLog.createMany({
    data: [
      {
        userId: adminUserId,
        action: 'CREATE_GAME',
        resource: 'Game',
        resourceId: allGames[0].id,
        newValues: { homeTeam: '4bs0lut3-m4dn3ss', awayTeam: 'Lakers' },
        metadata: { source: 'admin_panel' },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Admin Browser)',
        severity: 'INFO',
        system: 'scoreboard'
      },
      {
        userId: adminUserId,
        action: 'UPDATE_SCORE',
        resource: 'Game',
        resourceId: allGames[0].id,
        oldValues: { homeScore: 40, awayScore: 35 },
        newValues: { homeScore: 42, awayScore: 38 },
        metadata: { quarter: 3 },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Admin Browser)',
        severity: 'INFO',
        system: 'scoreboard'
      },
      {
        userId: devUserId,
        action: 'CREATE_MEMBERSHIP_TIER',
        resource: 'MembershipTier',
        resourceId: allTiers[2].id,
        newValues: { name: 'Gold', price: 399.99 },
        metadata: { source: 'api' },
        ipAddress: '192.168.1.101',
        userAgent: 'API Client',
        severity: 'INFO',
        system: 'membership'
      },
      {
        action: 'FAILED_LOGIN',
        resource: 'Authentication',
        metadata: { email: 'hacker@example.com', reason: 'invalid_credentials' },
        ipAddress: '10.0.0.1',
        userAgent: 'Suspicious Browser',
        severity: 'WARN',
        system: 'auth'
      }
    ]
  })
  console.log(`✅ Created ${auditLogs.count} audit logs`)

  console.log('🎉 Database seeding completed successfully!')

  // Print summary
  console.log('\n📊 Seed Summary:')
  console.log(`- Users: 2 (admin & developer)`)
  console.log(`- Tickets: ${tickets.count}`)
  console.log(`- Basketball Score: Team A: ${score.teamA}, Team B: ${score.teamB}`)
  console.log(`- Games: ${games.count}`)
  console.log(`- Products: ${products.count}`)
  console.log(`- Cart Items: ${cartItems.count}`)
  console.log(`- Subscribers: ${subscribers.count}`)
  console.log(`- Chat Messages: ${messages.count}`)
  console.log(`- Membership Tiers: ${membershipTiers.count}`)
  console.log(`- Members: ${members.count}`)
  console.log(`- Ticket Types: ${ticketTypes.count}`)
  console.log(`- Payments: ${payments.count}`)
  console.log(`- Audit Logs: ${auditLogs.count}`)
  console.log('\n🔐 Authentication Credentials:')
  console.log('- Admin: admin@4bs0lut3-m4dn3ss.com / admin123')
  console.log('- Developer: dev@4bs0lut3-m4dn3ss.com / dev123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })