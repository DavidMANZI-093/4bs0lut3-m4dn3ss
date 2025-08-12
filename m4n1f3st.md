# Project Manifest – 5 Systems Challenge

## 1. Context

We have been tasked with implementing **five distinct systems** in a compressed time frame (3 days) as part of a skills test for a backend developer role.  
The objective is not to produce fully polished, production-grade applications, but to deliver **Minimum Impressive Products (MIPs)** — working, functional systems that demonstrate:
- Backend architecture skills.
- API design and database modeling competence.
- Real-time communication capabilities where relevant.
- Ability to prioritize and work under pressure.

The systems will be built using a **unified tech stack** to maximize speed and reusability:
- **Framework:** Next.js (API routes)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Real-time:** WebSockets (Socket.IO)

---

## 2. Scope

We will build a **single Next.js project** containing backend logic for all five systems.  
This approach ensures:
- One environment and codebase to maintain.
- Shared database connection and migrations.
- Consistent API patterns and data structures.

### Systems to Implement

#### 1 Ticketing System
- **Purpose:** Track and manage tickets with basic status updates.
- **Endpoints:**
  - `POST /tickets` – Create a new ticket.
  - `GET /tickets` – List all tickets (sorted newest first).
- **Data Model:** `Ticket { id, title, description, status, createdAt }`
- **Minimal but Impressive Features:**
  - Two statuses: `"open"` and `"closed"`.
  - Tickets sorted by creation date.
  - Seed with a few sample tickets.

---

#### 2 Basketball Scoreboard
- **Purpose:** Keep track of two teams’ scores with real-time updates.
- **Endpoints:**
  - `GET /score` – Get current score.
  - `POST /score/update` – Increment score for Team A or B.
- **Data Model:** `Score { id, teamA, teamB }`
- **Minimal but Impressive Features:**
  - WebSocket broadcast to update connected clients instantly.
  - Reset option via API.
  - Seed with `{ teamA: 0, teamB: 0 }`.

---

#### 3 E-commerce
- **Purpose:** Basic product listing and cart functionality.
- **Endpoints:**
  - `GET /products` – List products.
  - `POST /cart` – Add product to cart.
  - `GET /cart` – View cart contents.
- **Data Models:**
  - `Product { id, name, price, imageUrl }`
  - `CartItem { id, productId, quantity }`
- **Minimal but Impressive Features:**
  - Seed with ~5 products.
  - Return cart total in API response.
  - Support adding multiple of the same product.

---

#### 4 Subscription System
- **Purpose:** Collect subscriber details for mailing list.
- **Endpoints:**
  - `POST /subscribe` – Store subscriber.
  - `GET /subscribers` – List all subscribers.
- **Data Model:** `Subscriber { id, name, email, createdAt }`
- **Minimal but Impressive Features:**
  - Validate email uniqueness.
  - Seed with 2–3 sample subscribers.

---

#### 5 Live Stream with Chat
- **Purpose:** Enable a real-time chat alongside a video stream.
- **Endpoints (WebSocket-based):**
  - Event: `"message"` – Send and broadcast chat messages.
- **Data Model:** `Message { id, sender, content, createdAt }`
- **Minimal but Impressive Features:**
  - Broadcast all messages instantly to connected clients.
  - Optionally persist messages in DB for history.
  - Embed a placeholder video or YouTube Live link (no custom streaming).

---

## 3. Constraints & Priorities

- **Timeframe:** 3 days.
- **Focus:** Functionality over completeness; MVP quality with some polish.
- **Architecture:** Monorepo-style single Next.js app with shared Prisma schema.
- **Data:** All systems seeded with realistic sample data for demo readiness.
- **Testing:** Basic endpoint testing using Postman or Jest.

---

## 4. Success Criteria

A system is considered **successful** if:
1. All core endpoints work without errors.
2. Data models match scope and can store necessary information.
3. Minimal but impressive features are present (sorting, validation, totals, real-time updates where applicable).
4. API responses are consistent and clean.
5. Seeded data makes the demo feel alive and ready for presentation.

---

## 5. Development Approach

### Day 1:
- Scaffold project & install dependencies.
- Create all Prisma models and migrate DB.
- Implement minimal core endpoints for each system.
- Set up WebSocket server.
- Seed database with sample data.

### Day 2:
- Add validation, sorting, totals, and small polish.
- Improve WebSocket events for scoreboard & chat.
- Test all routes and fix bugs.

### Day 3:
- Clean up code & ensure naming consistency.
- Add minimal tests.
- Prepare demo data and Postman collection.
- Final run-through for stability.

---

## 6. Deliverables

By the end of Day 3:
- A single repository containing:
  - Prisma schema with all models.
  - Next.js API routes for all systems.
  - WebSocket server integrated.
  - Seed scripts for realistic demo data.
  - Optional Postman collection for endpoint testing.
- Fully functional APIs for all five systems with demo-ready data.

---

