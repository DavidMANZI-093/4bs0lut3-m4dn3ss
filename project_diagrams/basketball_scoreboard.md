# Basketball Scoreboard System - Component Architecture

## System Overview
Real-time basketball scoreboard with live updates, game management, and audit logging.

## Component Diagram

```mermaid
graph TB
    %% Client Layer
    WebClient[Web Client<br/>Scoreboard Display]
    AdminClient[Admin Client<br/>Score Management]
    WebSocket[WebSocket Connection<br/>Real-time Updates]
    
    %% API Gateway Layer
    APIGateway[API Gateway<br/>Next.js App Router]
    
    %% API Routes
    ScoreAPI[Score API<br/>/api/score]
    ScoreUpdateAPI[Score Update API<br/>/api/score/update]
    GamesAPI[Games API<br/>/api/games]
    
    %% Business Logic Layer
    ScoreController[Score Controller<br/>Business Logic]
    GameController[Game Controller<br/>Game Management]
    ValidationService[Validation Service<br/>Score Validation]
    WebSocketService[WebSocket Service<br/>Real-time Broadcasting]
    
    %% Authentication & Authorization
    AuthMiddleware[Auth Middleware<br/>Role-based Access]
    SessionManager[Session Manager<br/>User Sessions]
    
    %% Data Access Layer
    ScoreRepository[Score Repository<br/>Score CRUD Operations]
    GameRepository[Game Repository<br/>Game CRUD Operations]
    AuditRepository[Audit Repository<br/>Activity Logging]
    
    %% Database Layer
    PostgreSQL[(PostgreSQL Database)]
    ScoreTable[scores table<br/>Current game scores]
    GameTable[games table<br/>Game metadata]
    AuditTable[audit_logs table<br/>Score change history]
    
    %% External Services
    NotificationService[Notification Service<br/>Score Alerts]
    CacheLayer[Redis Cache<br/>Performance Optimization]
    
    %% Data Flow Connections
    WebClient --> WebSocket
    AdminClient --> APIGateway
    WebSocket --> WebSocketService
    APIGateway --> ScoreAPI
    APIGateway --> ScoreUpdateAPI
    APIGateway --> GamesAPI
    
    ScoreAPI --> AuthMiddleware
    ScoreUpdateAPI --> AuthMiddleware
    GamesAPI --> AuthMiddleware
    
    AuthMiddleware --> SessionManager
    AuthMiddleware --> ScoreController
    AuthMiddleware --> GameController
    
    ScoreController --> ValidationService
    ScoreController --> ScoreRepository
    ScoreController --> WebSocketService
    ScoreController --> AuditRepository
    
    GameController --> GameRepository
    GameController --> AuditRepository
    
    ScoreRepository --> PostgreSQL
    GameRepository --> PostgreSQL
    AuditRepository --> PostgreSQL
    
    PostgreSQL --> ScoreTable
    PostgreSQL --> GameTable
    PostgreSQL --> AuditTable
    
    WebSocketService --> NotificationService
    ScoreController --> CacheLayer
    
    %% Styling
    classDef clientLayer fill:#e1f5fe
    classDef apiLayer fill:#f3e5f5
    classDef businessLayer fill:#e8f5e8
    classDef dataLayer fill:#fff3e0
    classDef databaseLayer fill:#fce4ec
    
    class WebClient,AdminClient,WebSocket clientLayer
    class APIGateway,ScoreAPI,ScoreUpdateAPI,GamesAPI apiLayer
    class ScoreController,GameController,ValidationService,WebSocketService,AuthMiddleware,SessionManager businessLayer
    class ScoreRepository,GameRepository,AuditRepository dataLayer
    class PostgreSQL,ScoreTable,GameTable,AuditTable databaseLayer
```

## Key Backend Principles Demonstrated

### 1. **Separation of Concerns**
- Clear separation between API routes, business logic, and data access
- Dedicated controllers for different domains (Score vs Game management)

### 2. **Real-time Architecture**
- WebSocket integration for live score updates
- Event-driven architecture with broadcasting capabilities

### 3. **Security & Authentication**
- Role-based access control for score updates
- Session management with audit trails

### 4. **Data Consistency**
- Validation services to ensure score integrity
- Audit logging for all score changes
- ACID transactions for score updates

### 5. **Performance Optimization**
- Redis caching for frequently accessed scores
- Efficient database queries with proper indexing

### 6. **Scalability Considerations**
- Stateless API design
- Event-driven real-time updates
- Horizontal scaling capability through load balancing

## Data Models

- **Score**: Current game state (teamA, teamB scores)
- **Game**: Game metadata (teams, status, timing)
- **AuditLog**: Complete history of score changes
- **Session**: User authentication and authorization

## API Endpoints

- `GET /api/score` - Retrieve current scores
- `POST /api/score/update` - Update game scores (Admin only)
- `GET /api/games` - List all games
- `POST /api/games` - Create new game (Admin only)
- `WebSocket /ws/scores` - Real-time score updates
