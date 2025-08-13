import { PrismaClient } from '@prisma/client'
import { AuthService } from '../src/lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
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
        price: 89.99,
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
      },
      {
        name: 'Team Championship Cap',
        price: 34.99,
        imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400'
      },
      {
        name: 'Basketball Signed by Team',
        price: 199.99,
        imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400'
      },
      {
        name: 'Team Hoodie - Premium',
        price: 79.99,
        imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'
      },
      {
        name: 'Official Team Shorts',
        price: 49.99,
        imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400'
      },
      {
        name: 'Team Logo Water Bottle',
        price: 24.99,
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400'
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
        name: 'Bronze Fan',
        price: 99.99,
        description: 'Perfect for casual fans who want to stay connected',
        benefits: [
          'Monthly newsletter with team updates',
          '10% discount on merchandise',
          'Access to member-only chat rooms',
          'Early ticket notifications'
        ],
        isPopular: false
      },
      {
        name: 'Silver Supporter',
        price: 199.99,
        description: 'Great value for dedicated fans',
        benefits: [
          'All Bronze benefits',
          '15% discount on merchandise',
          'Priority ticket access',
          'Quarterly team meetup invitations',
          'Exclusive behind-the-scenes content',
          'Free shipping on all orders'
        ],
        isPopular: true
      },
      {
        name: 'Gold Champion',
        price: 399.99,
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
        isPopular: false
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
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
      },
      {
        email: 'member2@example.com',
        tierId: allTiers[1].id, // Silver
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      },
      {
        email: 'member3@example.com',
        tierId: allTiers[2].id, // Gold
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      },
      {
        email: 'expired@example.com',
        tierId: allTiers[0].id, // Bronze
        status: 'EXPIRED',
        expiresAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
      }
    ]
  })
  console.log(`✅ Created ${members.count} members`)

  console.log('🎉 Database seeding completed successfully!')

  // Print summary
  console.log('\n📊 Seed Summary:')
  console.log(`- Users: 2 (admin & developer)`)
  console.log(`- Tickets: ${tickets.count}`)
  console.log(`- Basketball Score: Team A: ${score.teamA}, Team B: ${score.teamB}`)
  console.log(`- Products: ${products.count}`)
  console.log(`- Cart Items: ${cartItems.count}`)
  console.log(`- Subscribers: ${subscribers.count}`)
  console.log(`- Chat Messages: ${messages.count}`)
  console.log(`- Membership Tiers: ${membershipTiers.count}`)
  console.log(`- Members: ${members.count}`)
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