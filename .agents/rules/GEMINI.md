# ImEnglish Project — Agent Rules & Guidelines

## 🎯 Project Overview
**ImEnglish** là nền tảng luyện tập giao tiếp tiếng Anh kết hợp AI (GenAI) và kết nối ngang hàng (P2P).

## 🏗️ Architecture
- **Backend**: Java 21 + Spring Boot 3.x (Primary)
- **Real-time**: Spring WebSockets + WebRTC Signaling
- **Database**: PostgreSQL (structured) + MongoDB (conversations/AI logs)
- **AI**: Google Gemini API / OpenAI GPT-4
- **Frontend**: React + TypeScript + Vite
- **Infrastructure**: Docker + Docker Compose

## 📋 Coding Standards

### Java / Spring Boot
- Use Java 21+ features (records, sealed classes, pattern matching)
- Follow Spring Boot best practices: layered architecture (Controller → Service → Repository)
- Always use `@Valid` and bean validation
- Prefer constructor injection over field injection
- Use `ResponseEntity<ApiResponse<T>>` for all REST responses
- Every service method must have appropriate exception handling
- Use `@Transactional` at service layer, not repository
- DTOs must be separate from entities (use MapStruct for mapping)
- All endpoints must be documented with Swagger/OpenAPI annotations

### Database
- PostgreSQL for user identity, friendships, sessions, reports
- MongoDB for: AI conversation history, long-term memory logs, ice-breaker cards, AI feedback reports
- Always use Flyway for PostgreSQL migrations
- Index frequently queried fields

### Security
- JWT-based authentication (Spring Security)
- Refresh token rotation strategy
- Rate limiting on AI endpoints
- All WebSocket connections must be authenticated

### API Design
- RESTful conventions: nouns for resources, correct HTTP verbs
- Version all APIs: `/api/v1/...`
- Consistent error response format: `{ success, message, data, errors }`
- Pagination for all list endpoints

### Real-time
- WebSocket for chat + signaling
- WebRTC for actual P2P voice call (client-to-client)
- STUN/TURN server configuration required

### Frontend (React)
- TypeScript strict mode
- Zustand for state management
- TanStack Query for server state
- Tailwind CSS for styling
- React Hook Form + Zod for forms

## 🚫 Constraints
- Never hardcode API keys or secrets → use environment variables
- Never return passwords or sensitive data in API responses
- AI calls must be async and non-blocking
- WebRTC signaling must handle ICE candidate failures gracefully

## 📁 Project Structure Convention
```
imenglish-backend/          # Java Spring Boot
imenglish-frontend/         # React + TypeScript
imenglish-docs/             # Documentation
docker-compose.yml          # Local dev environment
```
