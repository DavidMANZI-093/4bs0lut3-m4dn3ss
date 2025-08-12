# Five Systems Challenge 🚀

A comprehensive backend implementation featuring **5 distinct systems** built with Next.js, TypeScript, PostgreSQL, and real-time WebSocket communication.

## 🏗️ Architecture

- **Framework:** Next.js 15.1 (App Router + API Routes)
- **Language:** TypeScript 5.7
- **Database:** PostgreSQL with Prisma ORM 6.1
- **Real-time:** Socket.IO 4.8
- **Validation:** Zod 3.24
- **Testing:** Jest 29.7

## 🎯 Systems Overview

### 1. 🎫 Ticketing System
Track and manage support tickets with status updates.
- Create, read, and update tickets
- Status management (OPEN/CLOSED)
- Sorted by creation date

### 2. 🏀 Basketball Scoreboard
Real-time score tracking with WebSocket updates.
- Live score updates for Team A and Team B
- Score increment and reset functionality
- Real-time broadcasting to all connected clients

### 3. 🛍️ E-commerce
Product catalog and shopping cart management.
- Product listing with images and pricing
- Shopping cart with quantity management
- Automatic total calculation

### 4. 📧 Subscription System
Email subscription management with validation.
- Email uniqueness validation
- Subscriber management
- Clean API responses

### 5. 💬 Live Stream Chat
Real-time chat system with message persistence.
- WebSocket-based messaging
- Message history storage
- User join/leave notifications

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd five-systems-challenge
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
# Update DATABASE_URL with your PostgreSQL credentials
```

3. **Set up database:**
```bash
npm run db:push      # Push schema to database
npm run db:seed      # Seed with sample data
```

4. **Start the servers:**
```bash
npm run dev          # Start Next.js server (port 3000)
npm run socket       # Start WebSocket server (port 3001)
```

## 📚 API Documentation

### 🎫 Ticketing System

#### Get All Tickets
```http
GET /api/tickets
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cme8qxpo00000eoufoz61rsbv",
      "title": "Login page not loading",
      "description": "Users are reporting issues...",
      "status": "OPEN",
      "createdAt": "2025-08-12T16:18:55.152Z",
      "updatedAt": "2025-08-12T16:18:55.152Z"
    }
  ],
  "message": "Found 5 tickets"
}
```

#### Create Ticket
```http
POST /api/tickets
Content-Type: application/json

{
  "title": "New Issue",
  "description": "Description of the issue"
}
```

#### Update Ticket Status
```http
PATCH /api/tickets/{id}
Content-Type: application/json

{
  "status": "CLOSED"
}
```

### 🏀 Basketball Scoreboard

#### Get Current Score
```http
GET /api/score
```

#### Update Score
```http
POST /api/score/update
Content-Type: application/json

{
  "team": "A",
  "points": 3
}
```

#### Reset Score
```http
POST /api/score
```

### 🛍️ E-commerce

#### Get Products
```http
GET /api/products
```

#### View Cart
```http
GET /api/cart
```
**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 149.97,
    "itemCount": 4
  }
}
```

#### Add to Cart
```http
POST /api/cart/add
Content-Type: application/json

{
  "productId": "product-id",
  "quantity": 2
}
```

### 📧 Subscription System

#### Subscribe
```http
POST /api/subscribe
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### Get Subscribers
```http
GET /api/subscribers
```

### 💬 Live Stream Chat (WebSocket)

Connect to WebSocket server at `http://localhost:3001`

**Events:**
- `message:send` - Send a chat message
- `message:broadcast` - Receive chat messages
- `user:join` - User joins chat
- `user:leave` - User leaves chat
- `score:update` - Basketball score updates
- `score:reset` - Score reset notifications

**Send Message:**
```javascript
socket.emit('message:send', {
  sender: 'Username',
  content: 'Hello everyone!'
})
```

## 🧪 Testing

Run the test suite:
```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
```

## 📊 Database Schema

The application uses a PostgreSQL database with the following tables:
- `tickets` - Support ticket management
- `scores` - Basketball game scores
- `products` - E-commerce product catalog
- `cart_items` - Shopping cart items
- `subscribers` - Email subscription list
- `messages` - Chat message history

## 🔧 Development Commands

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
npm run db:push       # Push schema changes
npm run db:seed       # Seed database
npm run db:studio     # Open Prisma Studio
npm run socket        # Start WebSocket server
```

## 🌟 Features

- ✅ **RESTful APIs** - Clean, consistent API design
- ✅ **Real-time Updates** - WebSocket integration for live features
- ✅ **Data Validation** - Zod schemas for input validation
- ✅ **Error Handling** - Comprehensive error responses
- ✅ **Type Safety** - Full TypeScript implementation
- ✅ **Database Relations** - Proper relational data modeling
- ✅ **Seeded Data** - Ready-to-demo sample data
- ✅ **Testing Suite** - API endpoint testing
- ✅ **Documentation** - Complete API documentation

## 🎯 Success Metrics

- ✅ All 12+ API endpoints functional
- ✅ Real-time WebSocket communication
- ✅ Comprehensive input validation
- ✅ Proper error handling and responses
- ✅ Clean, maintainable code structure
- ✅ Production-ready configuration

## 📝 Project Structure

```
src/
├── app/
│   ├── api/           # API route handlers
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Homepage
├── lib/
│   ├── db.ts          # Database connection
│   ├── socket.ts      # WebSocket server
│   ├── utils.ts       # Utility functions
│   └── validations.ts # Zod schemas
└── types/
    └── index.ts       # TypeScript types

prisma/
├── schema.prisma      # Database schema
└── seed.ts           # Database seeding

__tests__/
└── api/              # API tests
```

## 🚀 Deployment

The application is ready for deployment to platforms like:
- Vercel (recommended for Next.js)
- Railway
- Heroku
- AWS/GCP/Azure

Make sure to:
1. Set up a production PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Deploy both the Next.js app and WebSocket server

---

**Built with ❤️ for the Five Systems Challenge**