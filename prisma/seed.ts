import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.message.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.product.deleteMany()
  await prisma.subscriber.deleteMany()
  await prisma.ticket.deleteMany()
  await prisma.score.deleteMany()

  // 1. Seed Tickets
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

  // 2. Seed Basketball Score
  console.log('🏀 Seeding basketball score...')
  const score = await prisma.score.create({
    data: {
      teamA: 42,
      teamB: 38
    }
  })
  console.log(`✅ Created basketball score: Team A: ${score.teamA}, Team B: ${score.teamB}`)

  // 3. Seed Products
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

  // 4. Seed Cart Items (sample cart)
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

  // 5. Seed Subscribers
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

  // 6. Seed Chat Messages
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

  console.log('🎉 Database seeding completed successfully!')
  
  // Print summary
  console.log('\n📊 Seed Summary:')
  console.log(`- Tickets: ${tickets.count}`)
  console.log(`- Basketball Score: Team A: ${score.teamA}, Team B: ${score.teamB}`)
  console.log(`- Products: ${products.count}`)
  console.log(`- Cart Items: ${cartItems.count}`)
  console.log(`- Subscribers: ${subscribers.count}`)
  console.log(`- Chat Messages: ${messages.count}`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })