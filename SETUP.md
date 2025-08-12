# 🚀 Project Setup Guide

## Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## Quick Setup

### 1. Clone and Install
```bash
git clone <repository-url>
cd five-systems-challenge
npm install
```

### 2. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Update .env with your database credentials:
DATABASE_URL="postgresql://username:password@localhost:5432/five_systems_db"
```

### 3. Database Setup
```bash
# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 4. Start Development Servers
```bash
# Terminal 1: Start Next.js server
npm run dev

# Terminal 2: Start WebSocket server
npm run socket
```

### 5. Verify Setup
- **Homepage:** http://localhost:3000
- **API Base:** http://localhost:3000/api
- **WebSocket:** http://localhost:3001

## Environment Variables

The `.env` file is not tracked in git for security. Required variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Socket.IO
SOCKET_PORT=3001

# Next.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

## Development Commands

```bash
npm run dev          # Start Next.js development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema changes
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
npm run socket       # Start WebSocket server
npm test             # Run test suite
```

## Database Setup Options

### Option 1: Local PostgreSQL
1. Install PostgreSQL locally
2. Create database: `createdb five_systems_db`
3. Update DATABASE_URL in .env

### Option 2: Docker PostgreSQL
```bash
docker run --name postgres-dev \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=five_systems_db \
  -p 5432:5432 -d postgres:16-alpine
```

### Option 3: Cloud Database
Use free tiers from:
- Neon (neon.tech)
- Supabase (supabase.com)
- Railway (railway.app)

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists

### Port Conflicts
- Next.js: Change port with `npm run dev -- -p 3001`
- WebSocket: Update SOCKET_PORT in .env

### Build Issues
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## Project Structure

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

## Next Steps

After setup, you can:
1. Test APIs using the Postman collection
2. Explore the database with Prisma Studio
3. Check real-time features with WebSocket
4. Run the test suite to verify everything works

For advanced features and deployment, see `NEXT_PHASES.md`.