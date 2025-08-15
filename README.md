# 4bs0lut3-m4dn3ss - Multi-System Basketball Platform

A comprehensive basketball team management platform featuring five integrated systems built with modern web technologies. This platform demonstrates enterprise-level backend architecture with real-time capabilities, payment processing, membership management, and extensive test coverage.

## Architecture

**Core Technologies:**
- **Framework:** Next.js 15.1 with App Router architecture
- **Language:** TypeScript 5.7 for type-safe development
- **Database:** PostgreSQL with Prisma ORM 6.1
- **Real-time:** Socket.IO 4.8 for live communications
- **Validation:** Zod 3.24 for comprehensive data validation
- **Testing:** Jest 29.7 with 110+ comprehensive tests
- **Authentication:** JWT-based with role-based access control
- **Payment Processing:** Integrated payment gateway support

## System Overview

### 1. Basketball Scoreboard System
Real-time scoreboard with live game tracking and administrative controls.
**Features:**
- Live score updates with WebSocket broadcasting
- Multi-game support with scheduling
- Role-based access control (Admin/Developer/User)
- Complete audit logging for score changes
- Real-time spectator viewing

### 2. Membership & Subscription Management
Comprehensive membership system with tiered subscriptions and automated billing.
**Features:**
- Multi-tier membership plans with custom benefits
- Automated payment processing and renewal
- Newsletter subscription management
- Member lifecycle tracking
- Payment history and financial reporting

### 3. Live Streaming with Interactive Chat
Live streaming platform with real-time chat moderation.
**Features:**
- YouTube API integration for video streaming
- Real-time chat with WebSocket communication
- Content moderation and spam protection
- User presence tracking
- Mobile-responsive streaming interface

### 4. E-commerce Store
Full-featured e-commerce platform for team merchandise.
**Features:**
- Product catalog with inventory management
- Shopping cart with persistent sessions
- Order processing and fulfillment tracking
- Payment gateway integration
- Inventory alerts and stock management

### 5. Event Ticketing System
Comprehensive ticketing platform for games and events.
**Features:**
- Event creation and management
- Ticket type configuration with dynamic pricing
- Digital ticket generation with QR codes
- Purchase confirmation and delivery
- Access control and validation

## Quick Start

### Prerequisites
- Node.js 18 or higher
- PostgreSQL database (local or cloud)
- npm package manager

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd 4bs0lut3-m4dn3ss
npm install
```

2. **Environment configuration:**
```bash
cp .env.example .env
# Configure DATABASE_URL and other environment variables
```

3. **Database setup:**
```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Apply schema to database
npm run db:seed      # Populate with sample data
```

4. **Development servers:**
```bash
npm run dev          # Next.js development server (port 3000)
npm run socket       # WebSocket server (port 3001)
```

## API Documentation

### Authentication System

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@4bs0lut3-m4dn3ss.com",
  "password": "admin123"
}
```

#### Get Session
```http
GET /api/auth/session
Authorization: Bearer <token>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### Ticketing System

#### Support Tickets (CRUD)
```http
GET /api/tickets          # List all tickets
POST /api/tickets         # Create new ticket
GET /api/tickets/{id}     # Get specific ticket
PATCH /api/tickets/{id}   # Update ticket
DELETE /api/tickets/{id}  # Delete ticket
POST /api/tickets/bulk-update  # Bulk update tickets
```

### Basketball Scoreboard

#### Score Management
```http
GET /api/score            # Get current game score
POST /api/score/update    # Update team score (Admin only)
```

**Score Update Request:**
```json
{
  "team": "A",
  "points": 2
}
```

### E-commerce Store

#### Product Management
```http
GET /api/products         # List all products
POST /api/products        # Create product (Admin)
GET /api/products/{id}    # Get specific product
PUT /api/products/{id}    # Update product (Admin)
DELETE /api/products/{id} # Delete product (Admin)
```

#### Shopping Cart
```http
GET /api/cart             # View cart contents
POST /api/cart/add        # Add item to cart
POST /api/cart/clear      # Clear entire cart
DELETE /api/cart/items/{id} # Remove specific cart item
```

**Add to Cart Request:**
```json
{
  "productId": "clhijk12345678901234567890",
  "quantity": 2
}
```

### Membership System

#### Membership Tiers
```http
GET /api/membership/tiers     # List membership tiers
POST /api/membership/tiers    # Create tier (Admin)
GET /api/membership/tiers/{id} # Get specific tier
```

#### Member Management
```http
GET /api/membership/members   # List all members (Admin)
POST /api/membership/purchase # Purchase membership
```

#### Newsletter Subscription
```http
POST /api/subscribe          # Subscribe to newsletter
GET /api/subscribers         # List subscribers (Admin)
```

### Live Streaming & Chat

#### Live Stream Management
```http
GET /api/livestream          # Get current stream info
POST /api/livestream         # Create/update stream (Admin)
```

#### Chat System
```http
GET /api/messages            # Get chat history
POST /api/messages           # Send message
GET /api/messages/{id}       # Get specific message
DELETE /api/messages/{id}    # Delete message (Moderator)
```

#### Chat Moderation
```http
GET /api/chat/users          # List active chat users
POST /api/chat/moderation    # Moderate chat content
```

### WebSocket Events

Connect to WebSocket server for real-time features:

**Connection:** `ws://localhost:3001`

**Available Events:**
- `message:send` - Send chat message
- `message:broadcast` - Receive chat messages  
- `score:update` - Live score updates
- `user:join` - User joins chat
- `user:leave` - User leaves chat
- `stream:start` - Stream goes live
- `stream:end` - Stream ends

## Testing

Comprehensive test suite with 110+ tests covering all systems:

```bash
npm test                 # Run all tests
npm run test:unit        # Unit tests only
npm run test:api         # API endpoint tests
npm run test:integration # Integration tests
npm run test:database    # Database tests
npm run test:coverage    # Coverage reports
```

**Test Coverage:**
- Unit tests for business logic and validation
- API endpoint testing for all routes
- Integration tests for complete user journeys
- Database schema and constraint validation
- Authentication and authorization testing

## Database Schema

PostgreSQL database with comprehensive relational design:

**Core Tables:**
- `users` - Authentication and user management
- `sessions` - JWT session management
- `audit_logs` - Complete activity tracking

**Business Domain Tables:**
- `tickets` - Support ticket management
- `games` - Basketball game scheduling
- `scores` - Real-time game scores
- `products` - E-commerce product catalog
- `cart_items` - Shopping cart management
- `orders` / `order_items` - Order processing
- `membership_tiers` / `members` - Subscription management
- `subscribers` - Newsletter subscriptions
- `live_streams` - Stream management
- `messages` - Chat message history
- `payments` / `transactions` - Financial records
- `ticket_types` / `ticket_purchases` - Event ticketing

## Development Commands

**Development:**
```bash
npm run dev              # Start development server
npm run socket           # Start WebSocket server
npm run lint             # Code linting
```

**Database:**
```bash
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:migrate       # Create migration
npm run db:seed          # Seed with sample data
npm run db:studio        # Open Prisma Studio
npm run db:reset         # Reset database
```

**Production:**
```bash
npm run build            # Build for production
npm run start            # Start production server
```

## Key Features

**Backend Architecture:**
- RESTful API design with 25+ endpoints
- Real-time WebSocket communication
- JWT-based authentication with role-based access
- Comprehensive input validation with Zod
- Advanced error handling and logging
- Full TypeScript type safety

**Business Capabilities:**
- Multi-system integration (5 core systems)
- Payment processing and financial management
- Real-time scoreboard and live streaming
- E-commerce with inventory management
- Membership tiers and subscription billing
- Event ticketing with digital validation

**Quality Assurance:**
- 110+ comprehensive tests (99.1% pass rate)
- Complete API documentation
- Database relationship integrity
- Production-ready configuration
- Extensive audit logging

## Project Structure

```
4bs0lut3-m4dn3ss/
├── src/
│   ├── app/
│   │   ├── api/                    # 25+ API route handlers
│   │   │   ├── auth/              # Authentication system
│   │   │   ├── cart/              # Shopping cart management
│   │   │   ├── chat/              # Chat moderation
│   │   │   ├── livestream/        # Stream management
│   │   │   ├── membership/        # Subscription system
│   │   │   ├── messages/          # Chat messages
│   │   │   ├── products/          # E-commerce catalog
│   │   │   ├── score/             # Scoreboard system
│   │   │   ├── subscribe/         # Newsletter
│   │   │   └── tickets/           # Support tickets
│   │   ├── (public)/              # Public pages
│   │   ├── admin/                 # Admin interface
│   │   └── auth/                  # Auth pages
│   ├── components/                # React components
│   │   ├── auth/                  # Authentication UI
│   │   ├── chat/                  # Chat interface
│   │   ├── common/                # Shared components
│   │   ├── livestream/            # Streaming UI
│   │   ├── membership/            # Membership UI
│   │   ├── navigation/            # Navigation
│   │   ├── payments/              # Payment forms
│   │   ├── scoreboard/            # Scoreboard display
│   │   ├── store/                 # E-commerce UI
│   │   ├── tickets/               # Ticket management
│   │   └── ui/                    # UI primitives
│   ├── lib/
│   │   ├── middleware/            # Auth middleware
│   │   ├── auth.ts               # Authentication logic
│   │   ├── db.ts                 # Database utilities
│   │   ├── prisma.ts             # Prisma client
│   │   ├── socket.ts             # WebSocket server
│   │   ├── utils.ts              # Utility functions
│   │   └── validations.ts        # Zod schemas
│   └── types/                     # TypeScript definitions
├── prisma/
│   ├── migrations/               # Database migrations
│   ├── schema.prisma             # Complete database schema
│   └── seed.ts                   # Sample data seeding
├── __tests__/                    # Comprehensive test suite
│   ├── api/                      # API endpoint tests
│   ├── database/                 # Database tests
│   ├── integration/              # Integration tests
│   └── lib/                      # Unit tests
├── diagrams/                     # Architecture diagrams
└── socket-server.ts              # WebSocket server
```

## Deployment

Production-ready for deployment on:

**Recommended Platforms:**
- **Vercel** (Next.js optimized)
- **Railway** (Full-stack with database)
- **AWS/GCP/Azure** (Enterprise deployment)

**Deployment Checklist:**
1. PostgreSQL production database setup
2. Environment variables configuration
3. Database migrations execution
4. WebSocket server deployment
5. CDN configuration for static assets

**Environment Variables:**
```bash
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-auth-secret
NEXTAUTH_URL=https://your-domain.com
```

---

**Enterprise-grade multi-system basketball platform built with modern web technologies**
