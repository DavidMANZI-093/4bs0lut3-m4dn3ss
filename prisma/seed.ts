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
        title: 'Login page not loading',
        description: 'Users are reporting that the login page shows a blank screen when accessed from mobile devices.',
        status: 'OPEN'
      },
      {
        title: 'Payment processing error',
        description: 'Credit card payments are failing with error code 500. Affects approximately 15% of transactions.',
        status: 'OPEN'
      },
      {
        title: 'Database backup issue',
        description: 'Automated database backups have been failing since last Tuesday. Need immediate attention.',
        status: 'CLOSED'
      },
      {
        title: 'Email notifications not sending',
        description: 'Order confirmation emails are not being sent to customers after successful purchases.',
        status: 'OPEN'
      },
      {
        title: 'Performance optimization request',
        description: 'Dashboard loading time is too slow. Need to optimize queries and implement caching.',
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
        name: 'Wireless Bluetooth Headphones',
        price: 79.99,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
      },
      {
        name: 'Smart Fitness Watch',
        price: 199.99,
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'
      },
      {
        name: 'Portable Phone Charger',
        price: 29.99,
        imageUrl: 'https://images.unsplash.com/photo-1609592806596-4d8b5b5e7e0a?w=400'
      },
      {
        name: 'Mechanical Gaming Keyboard',
        price: 149.99,
        imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400'
      },
      {
        name: 'USB-C Hub with HDMI',
        price: 59.99,
        imageUrl: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400'
      },
      {
        name: 'Wireless Mouse',
        price: 39.99,
        imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'
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
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com'
      },
      {
        name: 'Bob Smith',
        email: 'bob.smith@example.com'
      },
      {
        name: 'Carol Davis',
        email: 'carol.davis@example.com'
      },
      {
        name: 'David Wilson',
        email: 'david.wilson@example.com'
      }
    ]
  })
  console.log(`✅ Created ${subscribers.count} subscribers`)

  // 6. Seed Chat Messages
  console.log('💬 Seeding chat messages...')
  const messages = await prisma.message.createMany({
    data: [
      {
        sender: 'StreamHost',
        content: 'Welcome everyone to the live stream! 🎉'
      },
      {
        sender: 'Alice',
        content: 'Hey everyone! Excited to be here!'
      },
      {
        sender: 'Bob',
        content: 'Great stream quality today 👍'
      },
      {
        sender: 'Carol',
        content: 'Can you show that demo again?'
      },
      {
        sender: 'StreamHost',
        content: 'Sure! Let me repeat the demo for those who just joined.'
      },
      {
        sender: 'David',
        content: 'This is awesome! Thanks for the detailed explanation.'
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